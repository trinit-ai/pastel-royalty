#!/usr/bin/env node

/**
 * Pastel Royalty — Image Processing Pipeline
 *
 * Takes original high-res images and generates gallery-grade derivatives.
 * Uses Sharp with Lanczos3 resampling — sharpest possible downscale.
 * WebP output at high quality. Originals are never modified.
 *
 * Usage:
 *   node scripts/process-images.js <input-dir> [output-dir]
 *
 * Input structure (flat or nested):
 *   input/
 *     elena-marsh/
 *       morning-harbor.jpg
 *       green-passage.tiff
 *     julian-cole/
 *       tidal-form.png
 *
 * Output structure:
 *   output/
 *     thumbs/elena-marsh/morning-harbor.webp     (400px,  85% quality)
 *     display/elena-marsh/morning-harbor.webp     (1600px, 90% quality)
 *     full/elena-marsh/morning-harbor.webp        (3200px, 92% quality)
 *     meta/elena-marsh/morning-harbor.json        (dimensions, blurhash color, sizes)
 *
 * The output maps directly to Supabase Storage paths:
 *   thumbs/{artistSlug}/{artworkSlug}.webp
 *   display/{artistSlug}/{artworkSlug}.webp
 *   full/{artistSlug}/{artworkSlug}.webp
 */

import sharp from 'sharp'
import { readdir, stat, mkdir, writeFile } from 'fs/promises'
import { join, parse, relative, extname } from 'path'

// ─── Configuration ───────────────────────────────────────

const TIERS = [
  { name: 'thumbs',  maxWidth: 400,  quality: 85 },
  { name: 'display', maxWidth: 1600, quality: 90 },
  { name: 'full',    maxWidth: 3200, quality: 92 },
]

const SUPPORTED_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp', '.avif',
])

const MIN_LONG_EDGE = 2400
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

// ─── Helpers ─────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function getFiles(dir, base = dir) {
  const files = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await getFiles(fullPath, base))
    } else if (SUPPORTED_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
      files.push(fullPath)
    }
  }
  return files
}

/** Extract dominant color from image (average of center crop) */
async function getDominantColor(sharpInstance) {
  const { data } = await sharpInstance
    .clone()
    .resize(1, 1, { fit: 'cover' })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const [r, g, b] = data
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Main ────────────────────────────────────────────────

async function processImage(filePath, inputDir, outputDir) {
  const rel = relative(inputDir, filePath)
  const { dir, name } = parse(rel)
  const slug = slugify(name)
  const subDir = dir ? dir.split('/').map(slugify).join('/') : ''

  // Validate file size
  const fileStat = await stat(filePath)
  if (fileStat.size > MAX_FILE_SIZE) {
    console.warn(`  ⚠ SKIP ${rel} — exceeds ${formatBytes(MAX_FILE_SIZE)} limit (${formatBytes(fileStat.size)})`)
    return null
  }

  // Load image
  const img = sharp(filePath, { failOn: 'none' })
  const metadata = await img.metadata()

  if (!metadata.width || !metadata.height) {
    console.warn(`  ⚠ SKIP ${rel} — could not read dimensions`)
    return null
  }

  const longEdge = Math.max(metadata.width, metadata.height)
  if (longEdge < MIN_LONG_EDGE) {
    console.warn(`  ⚠ WARN ${rel} — long edge ${longEdge}px is below ${MIN_LONG_EDGE}px minimum (processing anyway)`)
  }

  // Get dominant color for placeholder
  const dominantColor = await getDominantColor(img)

  const results = { file: rel, slug, subDir, dominantColor, tiers: {} }

  // Generate each tier
  for (const tier of TIERS) {
    // Skip tier if original is smaller than target
    if (longEdge <= tier.maxWidth && tier.name !== 'thumbs') {
      // For display/full, if original is smaller, still generate at original size
      // but only if it's larger than the previous tier
    }

    const outPath = join(outputDir, tier.name, subDir, `${slug}.webp`)
    await mkdir(join(outputDir, tier.name, subDir), { recursive: true })

    const resized = img.clone()
      .resize(tier.maxWidth, tier.maxWidth, {
        fit: 'inside',          // maintain aspect ratio
        withoutEnlargement: true, // never upscale
        kernel: 'lanczos3',     // sharpest downscale kernel
      })
      .webp({
        quality: tier.quality,
        effort: 6,              // max compression effort (slower, smaller files)
        smartSubsample: true,   // better chroma subsampling
      })

    const info = await resized.toFile(outPath)

    results.tiers[tier.name] = {
      width: info.width,
      height: info.height,
      size: info.size,
      path: join(tier.name, subDir, `${slug}.webp`),
    }
  }

  // Write metadata JSON
  const metaDir = join(outputDir, 'meta', subDir)
  await mkdir(metaDir, { recursive: true })

  const meta = {
    original: {
      file: rel,
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
    },
    slug,
    aspectRatio: +(metadata.width / metadata.height).toFixed(4),
    dominantColor,
    tiers: Object.fromEntries(
      Object.entries(results.tiers).map(([tier, info]) => [
        tier,
        {
          width: info.width,
          height: info.height,
          size: formatBytes(info.size),
          path: info.path,
        },
      ])
    ),
  }

  await writeFile(join(metaDir, `${slug}.json`), JSON.stringify(meta, null, 2))

  return results
}

async function main() {
  const inputDir = process.argv[2]
  const outputDir = process.argv[3] || join(inputDir, '..', 'processed')

  if (!inputDir) {
    console.error('Usage: node scripts/process-images.js <input-dir> [output-dir]')
    process.exit(1)
  }

  console.log(`\n  Pastel Royalty — Image Processing`)
  console.log(`  ─────────────────────────────────`)
  console.log(`  Input:  ${inputDir}`)
  console.log(`  Output: ${outputDir}\n`)

  const files = await getFiles(inputDir)
  if (files.length === 0) {
    console.log('  No supported images found.\n')
    process.exit(0)
  }

  console.log(`  Found ${files.length} image${files.length === 1 ? '' : 's'}\n`)

  let processed = 0
  let skipped = 0
  let totalOriginal = 0
  let totalOutput = 0

  for (const file of files) {
    const rel = relative(inputDir, file)
    process.stdout.write(`  → ${rel} ... `)

    const result = await processImage(file, inputDir, outputDir)

    if (!result) {
      skipped++
      continue
    }

    processed++
    const fileStat = await stat(file)
    totalOriginal += fileStat.size

    const tierSizes = Object.values(result.tiers).map(t => t.size)
    const outputSize = tierSizes.reduce((a, b) => a + b, 0)
    totalOutput += outputSize

    const displayTier = result.tiers.display || result.tiers.full
    console.log(
      `${displayTier.width}×${displayTier.height} → ` +
      `${Object.entries(result.tiers).map(([k, v]) => `${k}: ${formatBytes(v.size)}`).join(', ')} ` +
      `[${result.dominantColor}]`
    )
  }

  console.log(`\n  ─────────────────────────────────`)
  console.log(`  Processed: ${processed}  Skipped: ${skipped}`)
  if (processed > 0) {
    const ratio = ((1 - totalOutput / totalOriginal) * 100).toFixed(0)
    console.log(`  Original:  ${formatBytes(totalOriginal)}`)
    console.log(`  Output:    ${formatBytes(totalOutput)} (${ratio}% reduction)`)
  }
  console.log(`  Output at: ${outputDir}\n`)
}

main().catch(err => {
  console.error('\n  Error:', err.message)
  process.exit(1)
})
