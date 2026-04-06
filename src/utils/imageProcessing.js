/**
 * Image processing utilities.
 *
 * These run server-side (Supabase Edge Functions) on upload.
 * Client-side, they provide helpers for responsive images.
 */

// Image size tiers — the three derivatives generated on upload
export const IMAGE_TIERS = {
  thumb:   { maxWidth: 400,  quality: 85, format: 'webp' },
  display: { maxWidth: 1600, quality: 90, format: 'webp' },
  full:    { maxWidth: 3200, quality: 92, format: 'webp' },
}

// Minimum upload requirements
export const UPLOAD_REQUIREMENTS = {
  minLongEdge: 2400,       // px — reject anything smaller
  maxFileSize: 50_000_000, // 50MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/tiff', 'image/webp'],
}

/**
 * Generate a responsive srcSet string for an artwork's images.
 */
export function buildSrcSet(artwork) {
  const sets = []
  if (artwork.thumbSrc)   sets.push(`${artwork.thumbSrc} 400w`)
  if (artwork.displaySrc) sets.push(`${artwork.displaySrc} 1600w`)
  if (artwork.fullSrc)    sets.push(`${artwork.fullSrc} 3200w`)
  return sets.join(', ')
}

/**
 * Generate sizes attribute based on usage context.
 */
export function buildSizes(context = 'grid') {
  switch (context) {
    case 'hero':
      return '(max-width: 768px) 100vw, 50vw'
    case 'grid':
      return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    case 'single':
      return '(max-width: 768px) 100vw, 85vw'
    case 'lightbox':
      return '85vw'
    default:
      return '100vw'
  }
}

/**
 * Calculate dominant color from image data.
 * Used as a fallback when blurhash isn't available.
 * Run this server-side on upload.
 */
export function extractDominantColor(imageData) {
  // In production: use sharp or canvas to sample center pixels
  // Returns a hex color string
  return '#f0ece8' // warm gallery neutral fallback
}

/**
 * Validate an image file before upload.
 */
export function validateImageUpload(file) {
  const errors = []

  if (!UPLOAD_REQUIREMENTS.allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} not accepted. Use JPEG, PNG, TIFF, or WebP.`)
  }

  if (file.size > UPLOAD_REQUIREMENTS.maxFileSize) {
    errors.push(`File too large (${(file.size / 1_000_000).toFixed(1)}MB). Maximum is 50MB.`)
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Generate Supabase Storage paths for an artwork's image derivatives.
 */
export function getStoragePaths(artistSlug, artworkSlug, filename) {
  const base = `${artistSlug}/${artworkSlug}`
  const ext = filename.split('.').pop()
  return {
    original: `originals/${base}/${filename}`,
    display:  `display/${base}/${artworkSlug}.webp`,
    thumb:    `thumbs/${base}/${artworkSlug}.webp`,
    full:     `full/${base}/${artworkSlug}.webp`,
  }
}
