import { useRef, useState, useEffect } from 'react'
import { useLightbox } from '../../hooks/useLightbox'

/**
 * Premium image component for gallery use.
 *
 * Features:
 * - Reserves exact aspect ratio space (zero CLS)
 * - Shows dominant color / blurhash while loading
 * - Lazy loads with Intersection Observer
 * - Serves WebP/AVIF with JPEG fallback via <picture>
 * - Subtle fade-in on load
 * - Click opens lightbox from this element's position
 */
export default function GalleryImage({
  artwork,
  allArtworks,    // for lightbox navigation context
  index = 0,      // position in the set
  size = 'display', // 'thumb' | 'display' | 'full'
  priority = false,
  className = '',
  showLabel = false,
}) {
  const ref = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(priority)
  const { open } = useLightbox()

  // Lazy load via Intersection Observer
  useEffect(() => {
    if (priority || inView) return
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [priority, inView])

  const handleClick = () => {
    const rect = ref.current?.getBoundingClientRect()
    const items = (allArtworks || [artwork]).map(a => ({
      ...a,
      thumbSrc: getImageUrl(a, 'thumb'),
      displaySrc: getImageUrl(a, 'display'),
      fullSrc: getImageUrl(a, 'full'),
    }))
    open(items, index, rect)
  }

  const aspectRatio = artwork.aspectRatio || (artwork.width && artwork.height
    ? artwork.width / artwork.height
    : undefined)

  return (
    <figure
      ref={ref}
      className={`gallery-image ${loaded ? 'loaded' : ''} ${className}`}
      style={{
        aspectRatio: aspectRatio || 'auto',
        backgroundColor: artwork.dominantColor || '#f0ece8',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${artwork.title} by ${artwork.artistName}`}
    >
      {inView && (
        <picture>
          {artwork.webpSrc && <source srcSet={artwork.webpSrc} type="image/webp" />}
          {artwork.avifSrc && <source srcSet={artwork.avifSrc} type="image/avif" />}
          <img
            src={getImageUrl(artwork, size)}
            alt={`${artwork.title} by ${artwork.artistName}`}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
            draggable={false}
          />
        </picture>
      )}

      {/* Subtle hover overlay */}
      <div className="gallery-image-overlay">
        <span className="gallery-image-zoom">View</span>
      </div>

      {showLabel && loaded && (
        <figcaption className="gallery-image-label">
          <span className="gallery-image-label-title">{artwork.title}</span>
          <span className="gallery-image-label-artist">{artwork.artistName}</span>
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Resolve image URL by size tier.
 * In production, these come from Supabase Storage CDN.
 */
function getImageUrl(artwork, size) {
  if (size === 'full' && artwork.fullSrc) return artwork.fullSrc
  if (size === 'display' && artwork.displaySrc) return artwork.displaySrc
  if (size === 'thumb' && artwork.thumbSrc) return artwork.thumbSrc
  // Fallback: primary image path
  return artwork.imageSrc || artwork.displaySrc || ''
}
