import { useRef, useState } from 'react'
import { useLightbox } from '../../hooks/useLightbox'
import './install-carousel.css'

/**
 * Installation views carousel.
 * Native horizontal scroll with scroll-snap.
 * Arrows advance by one slide. Click image for lightbox.
 */
export default function InstallCarousel({ images = [], exhibitionTitle = '' }) {
  const trackRef = useRef(null)
  const [current, setCurrent] = useState(0)
  const { open } = useLightbox()
  const total = images.length

  const scrollTo = (index) => {
    const wrapped = ((index % total) + total) % total
    const track = trackRef.current
    if (!track) return
    const slide = track.children[wrapped]
    if (slide) {
      track.scrollTo({ left: slide.offsetLeft - 52, behavior: 'smooth' })
    }
    setCurrent(wrapped)
  }

  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const scrollLeft = track.scrollLeft + 52
    for (let i = 0; i < track.children.length; i++) {
      const child = track.children[i]
      if (child.offsetLeft + child.offsetWidth / 2 > scrollLeft) {
        setCurrent(i)
        break
      }
    }
  }

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

  return (
    <div className="install-carousel">
      <div
        ref={trackRef}
        className="install-carousel-track"
        onScroll={handleScroll}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="install-carousel-slide"
            onClick={() => openLightbox(i)}
          >
            <div
              className="install-carousel-image"
              style={{ background: `linear-gradient(160deg, ${img.color}, ${img.color}dd)` }}
            />
          </div>
        ))}
      </div>

      {total > 1 && (
        <div className="install-carousel-arrows">
          <button className="install-carousel-arrow" onClick={() => scrollTo(current - 1)} aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button className="install-carousel-arrow" onClick={() => scrollTo(current + 1)} aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}

      <div className="install-carousel-caption">
        Installation view, <em>{exhibitionTitle}</em>
        <span className="install-carousel-counter">{current + 1} / {total}</span>
      </div>
    </div>
  )
}
