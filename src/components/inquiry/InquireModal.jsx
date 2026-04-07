import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useInquire } from '../../hooks/useInquire'
import InquireForm from './InquireForm'
import './inquire-modal.css'

/**
 * Global inquiry modal — portal rendered at body level.
 * Triggered from anywhere via useInquire().openInquire()
 */
export default function InquireModal() {
  const { isOpen, artwork, exhibition, closeInquire } = useInquire()

  // Lock scroll + ESC to close
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    const handler = (e) => { if (e.key === 'Escape') closeInquire() }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [isOpen, closeInquire])

  if (!isOpen) return null

  return createPortal(
    <div className="inquire-modal-overlay" onClick={closeInquire}>
      <div className="inquire-modal" onClick={(e) => e.stopPropagation()}>
        <button className="inquire-modal-close" onClick={closeInquire} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="inquire-modal-eyebrow">Private Inquiry</div>

        <InquireForm
          artwork={artwork}
          exhibition={exhibition}
          onSuccess={() => setTimeout(closeInquire, 2500)}
        />
      </div>
    </div>,
    document.body
  )
}
