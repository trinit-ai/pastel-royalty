import { useRef, useState, useImperativeHandle, forwardRef } from 'react'
import { useLightbox } from '../../hooks/useLightbox'
import './install-carousel.css'

/**
 * Installation views carousel.
 * Native horizontal scroll with scroll-snap.
 * Exposes prev/next via ref for external arrow controls.
 */
const InstallCarousel = forwardRef(function InstallCarousel({ images = [], exhibitionTitle = '', disableLightbox = false }, ref) {
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

  useImperativeHandle(ref, () => ({
    next: () => scrollTo(current + 1),
    prev: () => scrollTo(current - 1),
    current,
    total,
  }))

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
            style={disableLightbox ? { cursor: 'default' } : undefined}
            onClick={() => !disableLightbox && openLightbox(i)}
          >
            <div
              className="install-carousel-image"
              style={{ background: `linear-gradient(160deg, ${img.color}, ${img.color}dd)` }}
            />
          </div>
        ))}
      </div>

      <div className="install-carousel-caption">
        Installation view, <em>{exhibitionTitle}</em>
        <span className="install-carousel-counter">{current + 1} / {total}</span>
      </div>
    </div>
  )
})

export default InstallCarousel
