import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useLightbox } from '../../hooks/useLightbox'
import LightboxDetails from './LightboxDetails'
import LightboxControls from './LightboxControls'
import './lightbox.css'

/**
 * Gallery-grade lightbox.
 *
 * Design philosophy:
 * - The art is the only thing that matters
 * - Zero chrome until interaction
 * - Cinematic open/close from source element position
 * - Progressive image loading (thumb → display → full)
 * - Integrated inquiry — the "buy" moment lives here
 * - Keyboard + gesture native
 */
export default function Lightbox() {
  const {
    isOpen, current, items, close, next, prev,
    sourceRect, detailsVisible, toggleDetails
  } = useLightbox()

  const overlayRef = useRef(null)
  const imageRef = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [hdLoaded, setHdLoaded] = useState(false)
  const [phase, setPhase] = useState('closed') // closed → entering → open → exiting
  const [pinch, setPinch] = useState({ scale: 1, x: 0, y: 0 })

  // Cinematic enter animation
  useEffect(() => {
    if (isOpen && phase === 'closed') {
      setPhase('entering')
      setLoaded(false)
      setHdLoaded(false)
      setPinch({ scale: 1, x: 0, y: 0 })

      // Allow the entering CSS to paint, then transition to open
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
        case 'i': case 'I': toggleDetails(); break
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, close, next, prev, toggleDetails])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Progressive load: display image first, then full-res on demand
  const handleDisplayLoad = useCallback(() => {
    setLoaded(true)
    // Start loading full-res in background
    if (current?.fullSrc) {
      const hdImg = new Image()
      hdImg.onload = () => setHdLoaded(true)
      hdImg.src = current.fullSrc
    }
  }, [current])

  // Pinch-to-zoom (touch)
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

  // Swipe to navigate (single touch)
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
    // Swipe down to close
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

  // Determine which image to show (progressive)
  const imageSrc = hdLoaded ? artwork.fullSrc : artwork.displaySrc

  return createPortal(
    <div
      ref={overlayRef}
      className={`lightbox-overlay lightbox-${phase}`}
      onClick={(e) => { if (e.target === overlayRef.current) close() }}
      role="dialog"
      aria-modal="true"
      aria-label={`${artwork.title} by ${artwork.artistName}`}
    >
      {/* Dark surround — gallery wall */}
      <div className="lightbox-backdrop" />

      {/* The image — the only thing that matters */}
      <div
        className="lightbox-stage"
        onTouchStart={(e) => { handleTouchStart(e); handleSwipeStart(e) }}
        onTouchMove={handleTouchMove}
        onTouchEnd={(e) => { handleTouchEnd(); handleSwipeEnd(e) }}
        onDoubleClick={handleDoubleClick}
      >
        {/* BlurHash placeholder */}
        {!loaded && artwork.blurhash && (
          <div
            className="lightbox-placeholder"
            style={{
              aspectRatio: artwork.aspectRatio || 'auto',
              backgroundColor: artwork.dominantColor || '#1a1a1a'
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

        {/* HD indicator */}
        {loaded && hdLoaded && (
          <div className="lightbox-hd-badge">HD</div>
        )}
      </div>

      {/* Artwork details panel — slides in from right */}
      <LightboxDetails
        artwork={artwork}
        visible={detailsVisible}
        onClose={toggleDetails}
      />

      {/* Minimal controls — appear on hover/tap */}
      <LightboxControls
        onClose={close}
        onPrev={items.length > 1 ? prev : null}
        onNext={items.length > 1 ? next : null}
        onToggleDetails={toggleDetails}
        detailsVisible={detailsVisible}
        currentIndex={items.indexOf(current)}
        totalItems={items.length}
      />
    </div>,
    document.body
  )
}
