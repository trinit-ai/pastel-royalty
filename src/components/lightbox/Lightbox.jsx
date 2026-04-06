import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useLightbox } from '../../hooks/useLightbox'
import LightboxDetails from './LightboxDetails'
import './lightbox.css'

/**
 * Gallery-grade lightbox.
 *
 * Design: White wall. Image + details always side by side.
 * Clean minimal chrome. No shadows. Art-first.
 */
export default function Lightbox() {
  const { isOpen, current, items, close, next, prev } = useLightbox()

  const overlayRef = useRef(null)
  const imageRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [hdLoaded, setHdLoaded] = useState(false)
  const [phase, setPhase] = useState('closed')
  const [pinch, setPinch] = useState({ scale: 1, x: 0, y: 0 })

  // Enter animation
  useEffect(() => {
    if (isOpen && phase === 'closed') {
      setPhase('entering')
      setLoaded(false)
      setHdLoaded(false)
      setPinch({ scale: 1, x: 0, y: 0 })
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase('open'))
      })
    }
    if (!isOpen && phase === 'open') {
      setPhase('exiting')
      setTimeout(() => setPhase('closed'), 400)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      switch (e.key) {
        case 'Escape': close(); break
        case 'ArrowRight': next(); break
        case 'ArrowLeft': prev(); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close, next, prev])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Progressive load
  const handleDisplayLoad = useCallback(() => {
    setLoaded(true)
    if (current?.fullSrc) {
      const hdImg = new Image()
      hdImg.onload = () => setHdLoaded(true)
      hdImg.src = current.fullSrc
    }
  }, [current])

  // Pinch-to-zoom
  const touchState = useRef({ initialDistance: 0, initialScale: 1 })
  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      touchState.current.initialDistance = Math.hypot(dx, dy)
      touchState.current.initialScale = pinch.scale
    }
  }
  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const distance = Math.hypot(dx, dy)
      const scale = Math.min(4, Math.max(1,
        touchState.current.initialScale * (distance / touchState.current.initialDistance)
      ))
      setPinch(prev => ({ ...prev, scale }))
    }
  }
  const handleTouchEnd = () => {
    if (pinch.scale < 1.1) setPinch({ scale: 1, x: 0, y: 0 })
  }

  // Swipe to navigate
  const swipeRef = useRef({ startX: 0, startY: 0 })
  const handleSwipeStart = (e) => {
    if (e.touches.length === 1 && pinch.scale === 1) {
      swipeRef.current.startX = e.touches[0].clientX
      swipeRef.current.startY = e.touches[0].clientY
    }
  }
  const handleSwipeEnd = (e) => {
    if (pinch.scale !== 1) return
    const dx = e.changedTouches[0].clientX - swipeRef.current.startX
    const dy = e.changedTouches[0].clientY - swipeRef.current.startY
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 60) {
      dx > 0 ? prev() : next()
    }
    if (dy > 100 && Math.abs(dy) > Math.abs(dx)) {
      close()
    }
  }

  // Double-click to zoom
  const handleDoubleClick = (e) => {
    if (pinch.scale > 1) {
      setPinch({ scale: 1, x: 0, y: 0 })
    } else {
      const rect = imageRef.current?.getBoundingClientRect()
      if (rect) {
        setPinch({
          scale: 2.5,
          x: (rect.width / 2 - (e.clientX - rect.left)) * 1.5,
          y: (rect.height / 2 - (e.clientY - rect.top)) * 1.5
        })
      }
    }
  }

  if (phase === 'closed') return null

  const artwork = current
  if (!artwork) return null

  const imageSrc = hdLoaded ? artwork.fullSrc : artwork.displaySrc
  const hasImage = !!imageSrc
  const currentIndex = items.indexOf(current)

  return createPortal(
    <div
      ref={overlayRef}
      className={`lightbox-overlay lightbox-${phase}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${artwork.title} by ${artwork.artistName}`}
    >
      <div className="lightbox-backdrop" />

      {/* Image area — click left half = prev, right half = next */}
      <div
        className="lightbox-stage"
        onClick={(e) => {
          if (e.target !== e.currentTarget) return
          const rect = e.currentTarget.getBoundingClientRect()
          const clickX = e.clientX - rect.left
          if (clickX < rect.width / 2) { prev() } else { next() }
        }}
        onTouchStart={(e) => { handleTouchStart(e); handleSwipeStart(e) }}
        onTouchMove={handleTouchMove}
        onTouchEnd={(e) => { handleTouchEnd(); handleSwipeEnd(e) }}
        onDoubleClick={handleDoubleClick}
      >
        <div className="lightbox-watermark">Pastel Royalty Gallery</div>

        {hasImage ? (
          <>
            {!loaded && (
              <div
                className="lightbox-placeholder"
                style={{
                  aspectRatio: artwork.aspectRatio || 'auto',
                  backgroundColor: artwork.dominantColor || '#e8e4de'
                }}
              />
            )}

            <img
              ref={imageRef}
              src={imageSrc}
              alt={`${artwork.title} by ${artwork.artistName}`}
              className={`lightbox-image ${loaded ? 'loaded' : ''}`}
              style={{
                transform: `scale(${pinch.scale}) translate(${pinch.x}px, ${pinch.y}px)`,
                aspectRatio: artwork.aspectRatio || 'auto'
              }}
              onLoad={handleDisplayLoad}
              draggable={false}
            />

            {loaded && hdLoaded && (
              <div className="lightbox-hd-badge">HD</div>
            )}
          </>
        ) : (
          <div
            className="lightbox-image loaded lightbox-placeholder-art"
            style={{
              aspectRatio: artwork.aspectRatio || '3/4',
              background: `linear-gradient(160deg, ${artwork.dominantColor || '#e8e4de'}cc, ${artwork.dominantColor || '#e8e4de'}88)`,
            }}
          />
        )}
      </div>

      {/* Details — always visible. Nav, close, inquiry all here. */}
      <LightboxDetails
        artwork={artwork}
        onClose={close}
        onPrev={prev}
        onNext={next}
        currentIndex={currentIndex}
        totalItems={items.length}
      />
    </div>,
    document.body
  )
}
