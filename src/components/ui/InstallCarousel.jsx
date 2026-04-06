import { useState, useCallback } from 'react'
import { useLightbox } from '../../hooks/useLightbox'
import './install-carousel.css'

/**
 * Installation views carousel — Almine Rech style.
 *
 * Center image prominent, previous/next peeking from sides.
 * Arrows on left/right edges of the active image.
 * Click active image opens lightbox fullscreen.
 * Wraps infinitely.
 */
export default function InstallCarousel({ images = [], exhibitionTitle = '' }) {
  const [current, setCurrent] = useState(0)
  const { open } = useLightbox()

  const total = images.length

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setCurrent(i => (i - 1 + total) % total)
  }, [total])

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

  if (total === 0) return null

  // Build visible slides: prev, current, next (wrapping)
  const getIndex = (offset) => ((current + offset) % total + total) % total

  return (
    <div className="install-carousel">
      {/* Three-panel layout: prev | current | next */}
      <div className="install-carousel-stage">
        {/* Previous (peek) */}
        <div
          className="install-carousel-peek install-carousel-peek-prev"
          onClick={prev}
        >
          <div
            className="install-carousel-image"
            style={{ background: `linear-gradient(160deg, ${images[getIndex(-1)].color}, ${images[getIndex(-1)].color}dd)` }}
          />
        </div>

        {/* Active */}
        <div
          className="install-carousel-active"
          onClick={() => openLightbox(current)}
        >
          <div
            className="install-carousel-image"
            style={{ background: `linear-gradient(160deg, ${images[current].color}, ${images[current].color}dd)` }}
          />

          {/* Arrows overlaid on active image edges */}
          {total > 1 && (
            <>
              <button className="install-arrow install-arrow-prev" onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Previous">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="11 18 5 12 11 6" />
                </svg>
              </button>
              <button className="install-arrow install-arrow-next" onClick={(e) => { e.stopPropagation(); next() }} aria-label="Next">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="13 6 19 12 13 18" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Next (peek) */}
        <div
          className="install-carousel-peek install-carousel-peek-next"
          onClick={next}
        >
          <div
            className="install-carousel-image"
            style={{ background: `linear-gradient(160deg, ${images[getIndex(1)].color}, ${images[getIndex(1)].color}dd)` }}
          />
        </div>
      </div>

      {/* Caption */}
      <div className="install-carousel-caption">
        Installation view, <em>{exhibitionTitle}</em>
        <span className="install-carousel-counter">{current + 1} / {total}</span>
      </div>
    </div>
  )
}
