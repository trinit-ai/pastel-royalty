#!/usr/bin/env node
// @ts-check
/**
 * csv-to-meta.js
 *
 * Converts CSV exports (ArtLogic, Squarespace, Excel, etc.) into the
 * _intake/ folder structure that `npm run ingest` expects.
 *
 * Buyer drops files into:
 *
 *   _intake/_csv/
 *   ├── exhibitions.csv         (optional — one row per exhibition)
 *   ├── artists.csv             (optional — one row per artist)
 *   ├── artworks.csv            (optional — one row per work, references artist_slug or exhibition_slug)
 *   ├── images/                 (flat folder of all images, filenames match the CSV)
 *   └── pdfs/                   (flat folder of all PDFs, filenames match the CSV)
 *
 * Run: npm run ingest:csv
 *
 * The script:
 * 1. Parses each CSV using flexible column mapping (case-insensitive, normalized)
 * 2. For each row, generates a meta.yml in the right _intake/{kind}/{slug}/ folder
 * 3. Copies referenced images and PDFs into the right place
 * 4. Optionally chains into `npm run ingest` to process everything end-to-end
 *
 * Column name flexibility:
 *   The script accepts variations like "Title", "title", "Exhibition Title", "name"
 *   See COLUMN_ALIASES below to extend.
 */

import fs from 'node:fs'
import path from 'node:path'
import { parse } from 'csv-parse/sync'
import YAML from 'yaml'

const ROOT = process.cwd()
const CSV_DIR = path.join(ROOT, '_intake', '_csv')
const INTAKE_DIR = path.join(ROOT, '_intake')
const IMAGES_SRC = path.join(CSV_DIR, 'images')
const PDFS_SRC = path.join(CSV_DIR, 'pdfs')

// ─── Output formatting ─────────────────────────────────
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'
const RESET = '\x1b[0m'

const ok = (msg) => console.log(`${GREEN}✓${RESET} ${msg}`)
const warn = (msg) => console.log(`${YELLOW}⚠${RESET} ${msg}`)
const err = (msg) => console.log(`${RED}✗${RESET} ${msg}`)
const info = (msg) => console.log(`${CYAN}→${RESET} ${msg}`)

// ─── Column aliases ────────────────────────────────────
// Maps the canonical field name → array of accepted CSV column variants.
// Matching is case-insensitive and ignores spaces/underscores.
const COLUMN_ALIASES = {
  // Common
  id: ['id', 'identifier'],
  slug: ['slug', 'url slug', 'permalink'],
  title: ['title', 'name', 'work title', 'piece title'],
  description: ['description', 'summary', 'short description'],

  // Exhibitions
  type: ['type', 'exhibition type', 'show type'],
  start_date: ['start date', 'opening date', 'date start', 'from'],
  end_date: ['end date', 'closing date', 'date end', 'to'],
  location: ['location', 'venue', 'gallery'],
  artists: ['artists', 'artist', 'artist names'],
  essay: ['essay', 'press release', 'long description', 'curatorial essay'],
  pull_quote: ['pull quote', 'quote', 'featured quote'],
  opening: ['opening', 'opening reception', 'reception'],
  status: ['status', 'state'],
  hero_image: ['hero image', 'hero', 'featured image', 'main image', 'main image url large', 'main image url medium'],
  press_release_pdf: ['press release', 'press release pdf', 'press release file'],
  checklist_pdf: ['checklist', 'checklist pdf'],
  // ArtLogic-style image URL columns (for artworks)
  image_url_large: ['main image url large', 'image url large'],
  image_url_medium: ['main image url medium', 'image url medium'],
  image_url_small: ['main image url small', 'image url small'],

  // Artists
  name: ['name', 'artist name', 'full name'],
  medium: ['medium', 'media', 'discipline'],
  born: ['born', 'birth year', 'year born', 'dob'],
  bio: ['bio', 'biography', 'about'],
  instagram: ['instagram', 'ig', 'instagram handle'],
  website: ['website', 'url', 'site'],
  cv_pdf: ['cv', 'cv pdf', 'curriculum vitae'],

  // Artworks
  artist_slug: ['artist slug', 'artist', 'artist id'],
  exhibition_slug: ['exhibition slug', 'exhibition', 'show'],
  year: ['year', 'date', 'created'],
  dimensions: ['dimensions', 'size'],
  image_filename: ['image', 'image filename', 'filename', 'file', 'image file'],
}

// Cache for downloaded images so we don't re-fetch
const downloadCache = new Set()

/**
 * Download a URL to a file. Skips if already downloaded in this run.
 * @param {string} url
 * @param {string} destPath
 */
async function downloadFile(url, destPath) {
  if (downloadCache.has(url) && fs.existsSync(destPath)) return true
  try {
    const res = await fetch(url)
    if (!res.ok) {
      warn(`  download failed (${res.status}): ${url}`)
      return false
    }
    const buf = Buffer.from(await res.arrayBuffer())
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    fs.writeFileSync(destPath, buf)
    downloadCache.add(url)
    return true
  } catch (e) {
    warn(`  download error: ${url} — ${e.message}`)
    return false
  }
}

// ─── Helpers ───────────────────────────────────────────
function normalize(str) {
  return String(str || '').toLowerCase().replace(/[\s_-]+/g, ' ').trim()
}

function findColumn(row, fieldName) {
  const aliases = COLUMN_ALIASES[fieldName] || [fieldName]
  const normalizedKeys = Object.keys(row).map((k) => ({ raw: k, norm: normalize(k) }))
  for (const alias of aliases) {
    const aliasNorm = normalize(alias)
    const match = normalizedKeys.find((k) => k.norm === aliasNorm)
    if (match) return row[match.raw]
  }
  return null
}

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function readCsv(filePath) {
  if (!fs.existsSync(filePath)) return []
  const content = fs.readFileSync(filePath, 'utf-8')
  return parse(content, { columns: true, skip_empty_lines: true, trim: true })
}

/**
 * Resolve a filename or URL to a local file at destDir/destName.
 * - If it looks like a URL (http://, https://), download it.
 * - Otherwise look for it in the local images/ or pdfs/ folder.
 */
async function resolveAsset(filenameOrUrl, destDir, destName) {
  if (!filenameOrUrl) return false
  if (/^https?:\/\//i.test(filenameOrUrl)) {
    return await downloadFile(filenameOrUrl, path.join(destDir, destName))
  }
  const src = path.join(IMAGES_SRC, filenameOrUrl)
  const pdfSrc = path.join(PDFS_SRC, filenameOrUrl)
  const actualSrc = fs.existsSync(src) ? src : fs.existsSync(pdfSrc) ? pdfSrc : null
  if (!actualSrc) {
    warn(`  file not found: ${filenameOrUrl}`)
    return false
  }
  fs.mkdirSync(destDir, { recursive: true })
  fs.copyFileSync(actualSrc, path.join(destDir, destName))
  return true
}

function writeMeta(dir, data) {
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'meta.yml'), YAML.stringify(data))
}

// ─── Process exhibitions CSV ───────────────────────────
/**
 * Build a lookup of slugified-name → artist id from the artists.csv.
 * Used to auto-populate artistIds on exhibitions.
 */
function buildArtistLookup() {
  const csvPath = path.join(CSV_DIR, 'artists.csv')
  const rows = readCsv(csvPath)
  /** @type {Record<string, string>} */
  const lookup = {}
  for (const row of rows) {
    const name = findColumn(row, 'name')
    if (!name) continue
    const slug = findColumn(row, 'slug') || slugify(name)
    const id = findColumn(row, 'id') || slug
    lookup[slug] = id
    // Also map last name → id for fuzzy fallback
    const last = name.trim().split(/\s+/).pop()
    if (last) lookup[slugify(last)] = id
  }
  return lookup
}

/**
 * Resolve a comma/ampersand/semicolon-separated artist names string into ids.
 * "Elena Marsh & Julian Cole" → ['1', '2'] (using artistLookup)
 */
function resolveArtistIds(artistsString, lookup) {
  if (!artistsString) return []
  const names = artistsString
    .split(/[,&;]| and /i)
    .map((n) => n.trim())
    .filter(Boolean)
  const ids = []
  for (const name of names) {
    const slug = slugify(name)
    if (lookup[slug]) ids.push(lookup[slug])
    else {
      const last = slugify(name.split(/\s+/).pop() || '')
      if (lookup[last]) ids.push(lookup[last])
    }
  }
  return ids
}

async function processExhibitions(artistLookup) {
  const csvPath = path.join(CSV_DIR, 'exhibitions.csv')
  const rows = readCsv(csvPath)
  if (!rows.length) return 0

  console.log()
  info(`exhibitions.csv: ${rows.length} rows`)

  for (const row of rows) {
    const title = findColumn(row, 'title')
    if (!title) {
      warn(`  row missing title, skipping`)
      continue
    }
    const slug = findColumn(row, 'slug') || slugify(title)
    const dir = path.join(INTAKE_DIR, 'exhibitions', slug)

    const artistsString = findColumn(row, 'artists') || ''
    const artistIds = resolveArtistIds(artistsString, artistLookup)

    const meta = {
      id: findColumn(row, 'id') || slug,
      title,
      slug,
      type: findColumn(row, 'type') || 'group',
      start_date: findColumn(row, 'start_date') || '',
      end_date: findColumn(row, 'end_date') || '',
      location: findColumn(row, 'location') || 'Main Gallery',
      artists: artistsString,
      artistIds,
      description: findColumn(row, 'description') || '',
      essay: findColumn(row, 'essay') || '',
      pullQuote: findColumn(row, 'pull_quote') || '',
      opening: findColumn(row, 'opening') || '',
      status: findColumn(row, 'status') || 'past',
      color: '#e8e0d4',
    }
    writeMeta(dir, meta)

    // Hero image
    const heroFilename = findColumn(row, 'hero_image')
    if (heroFilename) await resolveAsset(heroFilename, dir, 'hero.jpg')

    // PDFs
    const pressFilename = findColumn(row, 'press_release_pdf')
    if (pressFilename) await resolveAsset(pressFilename, dir, 'press-release.pdf')

    const checklistFilename = findColumn(row, 'checklist_pdf')
    if (checklistFilename) await resolveAsset(checklistFilename, dir, 'checklist.pdf')

    ok(`  exhibition: ${slug}`)
  }

  return rows.length
}

// ─── Process artists CSV ───────────────────────────────
async function processArtists() {
  const csvPath = path.join(CSV_DIR, 'artists.csv')
  const rows = readCsv(csvPath)
  if (!rows.length) return 0

  console.log()
  info(`artists.csv: ${rows.length} rows`)

  for (const row of rows) {
    const name = findColumn(row, 'name')
    if (!name) {
      warn(`  row missing name, skipping`)
      continue
    }
    const slug = findColumn(row, 'slug') || slugify(name)
    const dir = path.join(INTAKE_DIR, 'artists', slug)

    const meta = {
      id: findColumn(row, 'id') || slug,
      name,
      slug,
      medium: findColumn(row, 'medium') || '',
      location: findColumn(row, 'location') || '',
      born: parseInt(findColumn(row, 'born')) || null,
      instagram: findColumn(row, 'instagram') || '',
      website: findColumn(row, 'website') || '',
      bio: findColumn(row, 'bio') || '',
      featured: false,
      onView: false,
      color: '#e8e0d4',
    }
    writeMeta(dir, meta)

    const heroFilename = findColumn(row, 'hero_image')
    if (heroFilename) await resolveAsset(heroFilename, dir, 'hero.jpg')

    const cvFilename = findColumn(row, 'cv_pdf')
    if (cvFilename) await resolveAsset(cvFilename, dir, 'cv.pdf')

    ok(`  artist: ${slug}`)
  }

  return rows.length
}

// ─── Process artworks CSV ──────────────────────────────
async function processArtworks() {
  const csvPath = path.join(CSV_DIR, 'artworks.csv')
  const rows = readCsv(csvPath)
  if (!rows.length) return 0

  console.log()
  info(`artworks.csv: ${rows.length} rows`)

  // Group by parent (artist or exhibition)
  /** @type {Record<string, { dir: string, kind: string, items: any[] }>} */
  const groups = {}

  for (const row of rows) {
    // Accept artist_slug, exhibition_slug, or fall back to slugifying the artist Name column
    const artistName = findColumn(row, 'name')
    const artistSlug = findColumn(row, 'artist_slug') || (artistName ? slugify(artistName) : null)
    const exhibitionSlug = findColumn(row, 'exhibition_slug')
    const parentSlug = exhibitionSlug || artistSlug
    const parentKind = exhibitionSlug ? 'exhibitions' : 'artists'
    if (!parentSlug) {
      warn(`  artwork "${findColumn(row, 'title') || '?'}": no artist name/slug or exhibition slug, skipping`)
      continue
    }

    const key = `${parentKind}/${parentSlug}`
    if (!groups[key]) {
      groups[key] = {
        dir: path.join(INTAKE_DIR, parentKind, parentSlug, 'works'),
        kind: parentKind,
        items: [],
      }
    }
    // Prefer URL columns (ArtLogic-style) over local filename, large > medium > small
    const imageRef =
      findColumn(row, 'image_url_large') ||
      findColumn(row, 'image_url_medium') ||
      findColumn(row, 'image_url_small') ||
      findColumn(row, 'image_filename') ||
      null

    groups[key].items.push({
      title: findColumn(row, 'title') || 'Untitled',
      year: parseInt(findColumn(row, 'year')) || null,
      medium: findColumn(row, 'medium') || '',
      dimensions: findColumn(row, 'dimensions') || '',
      status: findColumn(row, 'status') || 'available',
      _imageFilename: imageRef,
    })
  }

  // For each group, write meta.yml + copy images
  for (const [key, group] of Object.entries(groups)) {
    fs.mkdirSync(group.dir, { recursive: true })

    // Strip the internal _imageFilename before writing meta
    const cleanItems = group.items.map(({ _imageFilename, ...rest }) => rest)
    fs.writeFileSync(path.join(group.dir, 'meta.yml'), YAML.stringify(cleanItems))

    // Copy images, naming them sequentially
    let i = 1
    for (const item of group.items) {
      if (item._imageFilename) {
        const ext = path.extname(item._imageFilename) || '.jpg'
        const destName = `${String(i).padStart(2, '0')}${ext}`
        await resolveAsset(item._imageFilename, group.dir, destName)
      }
      i++
    }
    ok(`  ${key}: ${group.items.length} works`)
  }

  return rows.length
}

// ─── Main ──────────────────────────────────────────────
async function main() {
  console.log()
  console.log(`${BOLD}Pastel Royalty — CSV → Meta Converter${RESET}`)
  console.log(`${DIM}Reading from ${path.relative(ROOT, CSV_DIR)}/${RESET}`)

  if (!fs.existsSync(CSV_DIR)) {
    console.log()
    err(`No _intake/_csv/ directory found.`)
    info(`Create _intake/_csv/ and add your exhibitions.csv, artists.csv, and/or artworks.csv there.`)
    info(`Place all referenced images in _intake/_csv/images/ and PDFs in _intake/_csv/pdfs/.`)
    info(`See _intake/_csv/README.md for the full format.`)
    process.exit(1)
  }

  // Build artist lookup first (needed for exhibition → artistIds resolution)
  const artistLookup = buildArtistLookup()
  const artistCount = await processArtists()
  const exhibitionCount = await processExhibitions(artistLookup)
  const artworkCount = await processArtworks()

  console.log()
  console.log(`${BOLD}Summary${RESET}`)
  console.log(`  ${exhibitionCount} exhibitions`)
  console.log(`  ${artistCount} artists`)
  console.log(`  ${artworkCount} artworks`)
  console.log()

  if (exhibitionCount + artistCount + artworkCount === 0) {
    warn(`No CSVs found. Drop exhibitions.csv, artists.csv, or artworks.csv into _intake/_csv/`)
    process.exit(0)
  }

  ok(`Generated meta.yml files in _intake/`)
  console.log()
  info(`Next: run ${BOLD}npm run ingest${RESET}${CYAN} to process everything into the live data layer.${RESET}`)
  console.log()
}

main().catch((e) => {
  err(e.message)
  console.error(e)
  process.exit(1)
})
