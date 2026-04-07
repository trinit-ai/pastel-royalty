#!/usr/bin/env node
// @ts-check
/**
 * ingest.js
 *
 * Walks _intake/ and produces:
 *   - public/images/{exhibitions,artists}/{slug}/...   (optimized)
 *   - public/pdfs/{kind}-{slug}.pdf                    (copied)
 *   - src/data/content.js                              (typed data layer)
 *
 * Folder convention (see CONTENT-CHECKLIST.md):
 *
 *   _intake/
 *   ├── exhibitions/
 *   │   └── {slug}/
 *   │       ├── meta.yml         (required)
 *   │       ├── hero.jpg
 *   │       ├── press-release.pdf
 *   │       ├── checklist.pdf
 *   │       ├── installation/    (carousel — auto-numbered)
 *   │       │   ├── 01.jpg
 *   │       │   └── 02.jpg
 *   │       └── works/
 *   │           ├── 01.jpg
 *   │           └── meta.yml     (optional, parallel array of work metadata)
 *   └── artists/
 *       └── {slug}/
 *           ├── meta.yml
 *           ├── hero.jpg
 *           ├── cv.pdf
 *           └── works/
 *               ├── 01.jpg
 *               └── meta.yml
 *
 * Run: npm run ingest
 */

import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import YAML from 'yaml'

const ROOT = process.cwd()
const INTAKE_DIR = path.join(ROOT, '_intake')
const PUBLIC_DIR = path.join(ROOT, 'public')
const IMAGES_OUT = path.join(PUBLIC_DIR, 'images')
const PDFS_OUT = path.join(PUBLIC_DIR, 'pdfs')
const DATA_OUT = path.join(ROOT, 'src', 'data', 'content.js')

// ─── Output formatting ─────────────────────────────────
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const CYAN = '\x1b[36m'
const DIM = '\x1b[2m'
const BOLD = '\x1b[1m'
const RESET = '\x1b[0m'

const log = (msg) => console.log(msg)
const ok = (msg) => log(`${GREEN}✓${RESET} ${msg}`)
const warn = (msg) => log(`${YELLOW}⚠${RESET} ${msg}`)
const err = (msg) => log(`${RED}✗${RESET} ${msg}`)
const info = (msg) => log(`${CYAN}→${RESET} ${msg}`)

// ─── Required fields per entity ────────────────────────
const REQUIRED_EXHIBITION = ['title', 'slug', 'type', 'start_date', 'end_date', 'description', 'artists', 'status']
const REQUIRED_ARTIST = ['name', 'slug', 'medium', 'location', 'born', 'bio']

// ─── Image processing ──────────────────────────────────
async function processImage(srcPath, destPath, opts = {}) {
  const { maxLongEdge = 2400, quality = 88 } = opts
  await fs.promises.mkdir(path.dirname(destPath), { recursive: true })
  const meta = await sharp(srcPath).metadata()
  const isLandscape = (meta.width || 0) >= (meta.height || 0)
  const resizeOpts = isLandscape
    ? { width: maxLongEdge, withoutEnlargement: true }
    : { height: maxLongEdge, withoutEnlargement: true }
  await sharp(srcPath)
    .rotate() // honor EXIF orientation
    .resize(resizeOpts)
    .webp({ quality })
    .toFile(destPath)
  const { size } = fs.statSync(destPath)
  return { size, width: meta.width, height: meta.height }
}

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

// ─── Walk helpers ──────────────────────────────────────
function listDirs(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

function readMeta(filePath) {
  if (!fs.existsSync(filePath)) return null
  return YAML.parse(fs.readFileSync(filePath, 'utf-8'))
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
}

function validate(record, required, label) {
  const missing = required.filter((field) => record[field] == null || record[field] === '')
  if (missing.length) {
    err(`${label}: missing required fields: ${missing.join(', ')}`)
    return false
  }
  return true
}

// ─── Ingest exhibitions ────────────────────────────────
async function ingestExhibitions() {
  const exhibitionsDir = path.join(INTAKE_DIR, 'exhibitions')
  const slugs = listDirs(exhibitionsDir)
  const records = []
  const works = []

  for (const slug of slugs) {
    info(`Exhibition: ${slug}`)
    const dir = path.join(exhibitionsDir, slug)
    const meta = readMeta(path.join(dir, 'meta.yml'))
    if (!meta) {
      err(`  no meta.yml found, skipping`)
      continue
    }
    meta.slug = meta.slug || slug
    if (!validate(meta, REQUIRED_EXHIBITION, `  exhibition "${slug}"`)) continue

    // Hero image
    const heroSrc = ['hero.jpg', 'hero.jpeg', 'hero.png', 'hero.webp']
      .map((f) => path.join(dir, f))
      .find((p) => fs.existsSync(p))
    if (heroSrc) {
      const heroDest = path.join(IMAGES_OUT, 'exhibitions', slug, 'hero.webp')
      await processImage(heroSrc, heroDest, { maxLongEdge: 3200, quality: 90 })
      meta.heroImage = `/images/exhibitions/${slug}/hero.webp`
      ok(`  hero image processed`)
    } else {
      warn(`  no hero image found`)
    }

    // PDFs
    for (const [pdfName, fieldName] of [
      ['press-release.pdf', 'pressReleasePdf'],
      ['checklist.pdf', 'checklistPdf'],
    ]) {
      const pdfSrc = path.join(dir, pdfName)
      if (fs.existsSync(pdfSrc)) {
        const pdfKind = pdfName.replace('.pdf', '')
        const pdfDest = path.join(PDFS_OUT, `${pdfKind}-${slug}.pdf`)
        copyFile(pdfSrc, pdfDest)
        meta[fieldName] = `/pdfs/${pdfKind}-${slug}.pdf`
        ok(`  ${pdfName} → ${path.basename(pdfDest)}`)
      }
    }

    // Installation views
    const installDir = path.join(dir, 'installation')
    const installImages = listImages(installDir)
    if (installImages.length) {
      meta.installationImages = []
      for (const [i, img] of installImages.entries()) {
        const dest = path.join(IMAGES_OUT, 'exhibitions', slug, 'installation', `${String(i + 1).padStart(2, '0')}.webp`)
        await processImage(path.join(installDir, img), dest, { maxLongEdge: 2400, quality: 86 })
        meta.installationImages.push(`/images/exhibitions/${slug}/installation/${String(i + 1).padStart(2, '0')}.webp`)
      }
      ok(`  ${installImages.length} installation views processed`)
    }

    // Featured works
    const worksDir = path.join(dir, 'works')
    const workImages = listImages(worksDir)
    const worksMeta = readMeta(path.join(worksDir, 'meta.yml')) || []
    if (workImages.length) {
      for (const [i, img] of workImages.entries()) {
        const dest = path.join(IMAGES_OUT, 'exhibitions', slug, 'works', `${String(i + 1).padStart(2, '0')}.webp`)
        await processImage(path.join(worksDir, img), dest, { maxLongEdge: 2400, quality: 88 })
        const workMeta = worksMeta[i] || {}
        works.push({
          id: `${slug}-w${i + 1}`,
          exhibitionId: meta.id || slug,
          title: workMeta.title || `Untitled ${i + 1}`,
          year: workMeta.year || null,
          medium: workMeta.medium || '',
          dimensions: workMeta.dimensions || '',
          status: workMeta.status || 'available',
          imageUrl: `/images/exhibitions/${slug}/works/${String(i + 1).padStart(2, '0')}.webp`,
          color: workMeta.color || meta.color || '#e8e0d4',
        })
      }
      ok(`  ${workImages.length} works processed`)
    }

    records.push(meta)
  }

  return { exhibitions: records, exhibitionWorks: works }
}

// ─── Ingest artists ────────────────────────────────────
async function ingestArtists() {
  const artistsDir = path.join(INTAKE_DIR, 'artists')
  const slugs = listDirs(artistsDir)
  const records = []
  const works = []

  for (const slug of slugs) {
    info(`Artist: ${slug}`)
    const dir = path.join(artistsDir, slug)
    const meta = readMeta(path.join(dir, 'meta.yml'))
    if (!meta) {
      err(`  no meta.yml found, skipping`)
      continue
    }
    meta.slug = meta.slug || slug
    if (!validate(meta, REQUIRED_ARTIST, `  artist "${slug}"`)) continue

    // Hero image
    const heroSrc = ['hero.jpg', 'hero.jpeg', 'hero.png', 'hero.webp']
      .map((f) => path.join(dir, f))
      .find((p) => fs.existsSync(p))
    if (heroSrc) {
      const heroDest = path.join(IMAGES_OUT, 'artists', slug, 'hero.webp')
      await processImage(heroSrc, heroDest, { maxLongEdge: 3200, quality: 90 })
      meta.heroImage = `/images/artists/${slug}/hero.webp`
      ok(`  hero image processed`)
    }

    // CV
    const cvSrc = path.join(dir, 'cv.pdf')
    if (fs.existsSync(cvSrc)) {
      const cvDest = path.join(PDFS_OUT, `cv-${slug}.pdf`)
      copyFile(cvSrc, cvDest)
      meta.cvPdf = `/pdfs/cv-${slug}.pdf`
      ok(`  cv.pdf → ${path.basename(cvDest)}`)
    }

    // Works
    const worksDir = path.join(dir, 'works')
    const workImages = listImages(worksDir)
    const worksMeta = readMeta(path.join(worksDir, 'meta.yml')) || []
    if (workImages.length) {
      for (const [i, img] of workImages.entries()) {
        const dest = path.join(IMAGES_OUT, 'artists', slug, 'works', `${String(i + 1).padStart(2, '0')}.webp`)
        await processImage(path.join(worksDir, img), dest, { maxLongEdge: 2400, quality: 88 })
        const workMeta = worksMeta[i] || {}
        works.push({
          id: `${slug}-w${i + 1}`,
          artistId: meta.id || slug,
          title: workMeta.title || `Untitled ${i + 1}`,
          year: workMeta.year || null,
          medium: workMeta.medium || meta.medium || '',
          dimensions: workMeta.dimensions || '',
          status: workMeta.status || 'available',
          imageUrl: `/images/artists/${slug}/works/${String(i + 1).padStart(2, '0')}.webp`,
          color: workMeta.color || meta.color || '#e8e0d4',
        })
      }
      ok(`  ${workImages.length} works processed`)
    }

    records.push(meta)
  }

  return { artists: records, artistWorks: works }
}

// ─── Generate content.js ───────────────────────────────
function generateContentFile({ exhibitions, artists, exhibitionWorks, artistWorks }) {
  const allWorks = [...exhibitionWorks, ...artistWorks]
  const content = `// AUTO-GENERATED by scripts/ingest.js — do not edit by hand.
// To regenerate, drop new content into _intake/ and run \`npm run ingest\`.
// Generated: ${new Date().toISOString()}

/** @type {import('./demo').Exhibition[]} */
export const EXHIBITIONS = ${JSON.stringify(exhibitions, null, 2)}

/** @type {import('./demo').Artist[]} */
export const ARTISTS = ${JSON.stringify(artists, null, 2)}

/** @type {import('./demo').Artwork[]} */
export const ARTWORKS = ${JSON.stringify(allWorks, null, 2)}
`
  fs.mkdirSync(path.dirname(DATA_OUT), { recursive: true })
  fs.writeFileSync(DATA_OUT, content)
}

// ─── Main ──────────────────────────────────────────────
async function main() {
  console.log()
  console.log(`${BOLD}Pastel Royalty — Content Ingest${RESET}`)
  console.log(`${DIM}Walking ${path.relative(ROOT, INTAKE_DIR)}/${RESET}`)
  console.log()

  if (!fs.existsSync(INTAKE_DIR)) {
    err(`No _intake/ directory found at ${INTAKE_DIR}`)
    info(`Create one and add exhibitions/ and artists/ subdirectories.`)
    info(`See CONTENT-CHECKLIST.md for the folder convention.`)
    process.exit(1)
  }

  const { exhibitions, exhibitionWorks } = await ingestExhibitions()
  console.log()
  const { artists, artistWorks } = await ingestArtists()
  console.log()

  generateContentFile({ exhibitions, artists, exhibitionWorks, artistWorks })

  console.log()
  console.log(`${BOLD}Summary${RESET}`)
  console.log(`  ${exhibitions.length} exhibitions`)
  console.log(`  ${artists.length} artists`)
  console.log(`  ${exhibitionWorks.length + artistWorks.length} works`)
  console.log()
  ok(`Content written to ${path.relative(ROOT, DATA_OUT)}`)
  console.log()
  info(`Next: import from this file in your pages instead of demo.js, e.g.`)
  console.log(`  ${DIM}import { EXHIBITIONS, ARTISTS, ARTWORKS } from '../data/content'${RESET}`)
  console.log()
}

main().catch((e) => {
  err(e.message)
  console.error(e)
  process.exit(1)
})
