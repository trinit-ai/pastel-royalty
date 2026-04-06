import { useState } from 'react'
import InquireForm from '../inquiry/InquireForm'

/**
 * Details panel — always visible.
 * Content scrolls, nav pinned to bottom.
 */
export default function LightboxDetails({ artwork, onClose, onPrev, onNext, currentIndex, totalItems }) {
  const [showInquiry, setShowInquiry] = useState(false)

  if (!artwork) return null

  const fields = [
    artwork.year && ['Year', artwork.year],
    artwork.medium && ['Medium', artwork.medium],
    artwork.dimensions && ['Dimensions', artwork.dimensions],
  ].filter(Boolean)

  return (
    <div className="lightbox-details visible">
      {/* Close */}
      <button className="lightbox-details-close" onClick={onClose} aria-label="Close lightbox">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* Scrollable content */}
      <div className="lightbox-details-content">
        <div className="lightbox-details-artist">{artwork.artistName}</div>

        <h2 className="lightbox-details-title">
          <em>{artwork.title}</em>
        </h2>

        {fields.length > 0 && (
          <div className="lightbox-details-fields">
            {fields.map(([label, value]) => (
              <div key={label} className="lightbox-details-field">
                <div className="lightbox-details-field-label">{label}</div>
                <div className="lightbox-details-field-value">{value}</div>
              </div>
            ))}
          </div>
        )}

        {artwork.description && (
          <p className="lightbox-details-description">{artwork.description}</p>
        )}

        {artwork.status !== 'sold' && artwork.status !== 'nfs' && !showInquiry && (
          <button
            className="lightbox-inquire-btn"
            onClick={() => setShowInquiry(true)}
          >
            Inquire About This Work
          </button>
        )}

        {showInquiry && (
          <InquireForm
            artwork={artwork}
            onSuccess={() => setShowInquiry(false)}
            compact
          />
        )}

        {/* Footer */}
        <div className="lightbox-details-footer">
          {artwork.exhibitionTitle && (
            <div className="lightbox-details-exhibition">
              Shown in <em>{artwork.exhibitionTitle}</em>
            </div>
          )}
          <div className="lightbox-details-inquiries">
            Inquiries: <a href="mailto:info@yourgallery.com">info@yourgallery.com</a>
          </div>
        </div>
      </div>

      {/* Nav — pinned to bottom of panel */}
      {totalItems > 1 && (
        <div className="lightbox-details-nav">
          <button className="lightbox-details-nav-btn" onClick={onPrev} aria-label="Previous">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 4l-8 8 8 8"/>
            </svg>
          </button>
          <div className="lightbox-details-counter">{currentIndex + 1} / {totalItems}</div>
          <button className="lightbox-details-nav-btn" onClick={onNext} aria-label="Next">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 4l8 8-8 8"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
