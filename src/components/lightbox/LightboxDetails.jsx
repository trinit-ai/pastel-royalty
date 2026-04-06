import { useState } from 'react'
import InquireForm from '../inquiry/InquireForm'

/**
 * The details panel that slides in from the right.
 * Contains artwork info + integrated inquiry form.
 * This is where the viewing becomes a conversation.
 */
export default function LightboxDetails({ artwork, visible, onClose }) {
  const [showInquiry, setShowInquiry] = useState(false)

  if (!artwork) return null

  return (
    <div className={`lightbox-details ${visible ? 'visible' : ''}`}>
      <button className="lightbox-details-close" onClick={onClose} aria-label="Close details">
        &times;
      </button>

      <div className="lightbox-details-content">
        {/* Artist name — quiet, not competing with the art */}
        <div className="lightbox-details-artist">{artwork.artistName}</div>

        {/* Title — italic, the identity of the piece */}
        <h2 className="lightbox-details-title">
          <em>{artwork.title}</em>{artwork.year ? `, ${artwork.year}` : ''}
        </h2>

        {/* Medium + dimensions */}
        {artwork.medium && (
          <div className="lightbox-details-medium">{artwork.medium}</div>
        )}
        {artwork.dimensions && (
          <div className="lightbox-details-dimensions">{artwork.dimensions}</div>
        )}

        {/* Availability indicator */}
        <div className={`lightbox-details-status status-${artwork.status || 'available'}`}>
          {artwork.status === 'sold' ? 'Sold' :
           artwork.status === 'nfs' ? 'Not for Sale' :
           artwork.status === 'on_hold' ? 'On Hold' :
           'Available'}
        </div>

        {/* Description — if present */}
        {artwork.description && (
          <p className="lightbox-details-description">{artwork.description}</p>
        )}

        {/* The moment: Inquire */}
        {artwork.status === 'available' && !showInquiry && (
          <button
            className="lightbox-inquire-btn"
            onClick={() => setShowInquiry(true)}
          >
            Inquire About This Work &rarr;
          </button>
        )}

        {showInquiry && (
          <InquireForm
            artwork={artwork}
            onSuccess={() => setShowInquiry(false)}
            compact
          />
        )}

        {/* Exhibition context — if viewing from an exhibition */}
        {artwork.exhibitionTitle && (
          <div className="lightbox-details-exhibition">
            Shown in <em>{artwork.exhibitionTitle}</em>
          </div>
        )}
      </div>
    </div>
  )
}
