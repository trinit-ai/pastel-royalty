import { useState, useCallback } from 'react'
import { useLightbox } from '../../hooks/useLightbox'
import './install-carousel.css'

/**
 * Installation views carousel — Almine Rech style.
 *
 * Active image ~65% width, next image peeks ~30% from right.
 * Small chevron arrows stacked vertically between the two.
 * Click active image to open lightbox. Click peek to navigate.
 * Wraps infinitely.
 */
export default function InstallCarousel({ images = [], exhibitionTitle = '' }) {
  const [current, setCurrent] = useState(0)
  const { open } = useLightbox()
  const total = images.length

  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total])
  const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total])

  const getIndex = (offset) => ((current + offset) % total + total) % total

  const openLightbox = (index) => {
    const items = images.map((img, i) => ({
      id: `install-${i}`,
      title: `Installation view ${i + 1}`,
      artistName: exhibitionTitle,
      displaySrc: img.src || '',
      fullSrc: img.src || '',
      dominantColor: img.color || '#f0ece8',
      aspectRatio: 4 / 5,
    }))
    open(items, index)
  }

  if (total === 0) return null

  return (
    <div className="install-carousel">
      <div className="install-carousel-stage">
        {/* Active image */}
        <div className="install-carousel-active" onClick={() => openLightbox(current)}>
          <div
            className="install-carousel-image"
            style={{ background: `linear-gradient(160deg, ${images[current].color}, ${images[current].color}dd)` }}
          />

          {/* Arrows — stacked vertically, right edge */}
          {total > 1 && (
            <div className="install-arrows">
              <button className="install-arrow" onClick={(e) => { e.stopPropagation(); prev() }} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button className="install-arrow" onClick={(e) => { e.stopPropagation(); next() }} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Next peek */}
        <div className="install-carousel-peek" onClick={next}>
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
