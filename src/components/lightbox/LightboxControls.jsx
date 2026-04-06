/**
 * Navigation arrows — centered below the image.
 * Counter between prev/next.
 */
export default function LightboxControls({
  onPrev, onNext, currentIndex, totalItems
}) {
  return (
    <div className="lightbox-controls">
      {/* Bottom nav: ‹ counter › */}
      <div className="lightbox-nav">
        {onPrev ? (
          <button className="lightbox-arrow" onClick={onPrev} aria-label="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 4l-8 8 8 8"/>
            </svg>
          </button>
        ) : <div style={{ width: 36 }} />}

        {totalItems > 1 && (
          <div className="lightbox-counter">
            {currentIndex + 1} / {totalItems}
          </div>
        )}

        {onNext ? (
          <button className="lightbox-arrow" onClick={onNext} aria-label="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 4l8 8-8 8"/>
            </svg>
          </button>
        ) : <div style={{ width: 36 }} />}
      </div>
    </div>
  )
}
