import { useState, useRef, useCallback } from 'react'
import { useLightbox } from '../../hooks/useLightbox'
import './install-carousel.css'

/**
 * Installation views carousel — Almine Rech style.
 *
 * Center image prominent, previous/next peeking from sides.
 * Arrows navigate. Click opens in lightbox fullscreen.
 * Captions below current image.
 */
export default function InstallCarousel({ images = [], exhibitionTitle = '' }) {
  const [current, setCurrent] = useState(0)
  const trackRef = useRef(null)
  const { open } = useLightbox()

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % images.length)
  }, [images.length])

  const prev = useCallback(() => {
    setCurrent(i => (i - 1 + images.length) % images.length)
  }, [images.length])

  const openLightbox = (index) => {
    const items = images.map((img, i) => ({
      id: `install-${i}`,
      title: `Installation view ${i + 1}`,
      artistName: exhibitionTitle,
      displaySrc: img.src || '',
      fullSrc: img.src || '',
      dominantColor: img.color || '#f0ece8',
      aspectRatio: 3 / 2,
    }))
    open(items, index)
  }

  if (images.length === 0) return null

  return (
    <div className="install-carousel">
      {/* Track */}
      <div className="install-carousel-viewport">
        <div
          ref={trackRef}
          className="install-carousel-track"
          style={{ transform: `translateX(calc(-${current * 76}% - ${current * 12}px))` }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className={`install-carousel-slide ${i === current ? 'active' : ''}`}
              onClick={() => i === current ? openLightbox(i) : setCurrent(i)}
            >
              <div
                className="install-carousel-image"
                style={{ background: img.color ? `linear-gradient(160deg, ${img.color}, ${img.color}dd)` : '#e0e0e0' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Caption + Arrows on same row */}
      <div className="install-carousel-bottom">
        <div className="install-carousel-caption">
          Installation view, <em>{exhibitionTitle}</em>
          <span className="install-carousel-counter">{current + 1} / {images.length}</span>
        </div>
        {images.length > 1 && (
          <div className="install-carousel-controls">
            <button className="install-carousel-arrow" onClick={prev} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="11 18 5 12 11 6" />
              </svg>
            </button>
            <button className="install-carousel-arrow" onClick={next} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="13 6 19 12 13 18" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
