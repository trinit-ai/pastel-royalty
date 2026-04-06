/**
 * Minimal controls that appear on hover/interaction.
 * Fade in, never compete with the art.
 */
export default function LightboxControls({
  onClose, onPrev, onNext, onToggleDetails,
  detailsVisible, currentIndex, totalItems
}) {
  return (
    <div className="lightbox-controls">
      {/* Top bar: close + info toggle */}
      <div className="lightbox-controls-top">
        <button
          className={`lightbox-ctrl-btn ${detailsVisible ? 'active' : ''}`}
          onClick={onToggleDetails}
          aria-label="Toggle artwork details"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
          </svg>
        </button>

        {totalItems > 1 && (
          <div className="lightbox-counter">
            {currentIndex + 1} / {totalItems}
          </div>
        )}

        <button className="lightbox-ctrl-btn" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Side arrows */}
      {onPrev && (
        <button className="lightbox-arrow lightbox-arrow-prev" onClick={onPrev} aria-label="Previous">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      )}
      {onNext && (
        <button className="lightbox-arrow lightbox-arrow-next" onClick={onNext} aria-label="Next">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      )}

      {/* Keyboard hints — only on first open */}
      <div className="lightbox-hints">
        <span>← →</span> navigate
        <span>i</span> details
        <span>esc</span> close
      </div>
    </div>
  )
}
