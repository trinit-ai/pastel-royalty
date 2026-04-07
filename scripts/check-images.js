#!/usr/bin/env node
/**
 * check-images.js
 *
 * Walks public/ and warns if any image file exceeds the size threshold.
 * Run before deploy to catch oversized assets.
 *
 * Usage: npm run check-images
 */

import fs from 'node:fs'
import path from 'node:path'

const THRESHOLD_KB = 500
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']

const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GREEN = '\x1b[32m'
const DIM = '\x1b[2m'
const RESET = '\x1b[0m'

function walk(dir) {
  const results = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walk(fullPath))
    } else if (IMAGE_EXTS.includes(path.extname(entry.name).toLowerCase())) {
      results.push(fullPath)
    }
  }
  return results
}

if (!fs.existsSync(PUBLIC_DIR)) {
  console.error(`${RED}public/ directory not found${RESET}`)
  process.exit(1)
}

const images = walk(PUBLIC_DIR)
const oversized = []
let totalBytes = 0

for (const file of images) {
  const { size } = fs.statSync(file)
  totalBytes += size
  if (size > THRESHOLD_KB * 1024) {
    oversized.push({ file, size })
  }
}

const totalMB = (totalBytes / (1024 * 1024)).toFixed(2)
const relPublic = path.relative(process.cwd(), PUBLIC_DIR)

console.log()
console.log(`${DIM}Scanned ${images.length} images in ${relPublic}/ — total ${totalMB} MB${RESET}`)
console.log()

if (oversized.length === 0) {
  console.log(`${GREEN}✓ All images under ${THRESHOLD_KB} KB${RESET}`)
  process.exit(0)
}

console.log(`${YELLOW}⚠ ${oversized.length} image${oversized.length === 1 ? '' : 's'} exceed ${THRESHOLD_KB} KB:${RESET}`)
console.log()

oversized.sort((a, b) => b.size - a.size)
for (const { file, size } of oversized) {
  const rel = path.relative(process.cwd(), file)
  const sizeKB = (size / 1024).toFixed(0)
  console.log(`  ${RED}${sizeKB.padStart(6)} KB${RESET}  ${rel}`)
}

console.log()
console.log(`${DIM}Tip: run ${RESET}npm run images${DIM} to process source images into optimized WebP tiers.${RESET}`)
console.log()

process.exit(0) // Warn-only, don't fail the build
