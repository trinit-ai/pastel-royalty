import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLightbox } from '../hooks/useLightbox'
import { useInquire } from '../hooks/useInquire'
import {
  getPrivateView,
  isExpired,
  formatPrice,
  STATUS_LABELS,
} from '../data/private-views'
import './private-view.css'

const formatDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

/**
 * Private View — an unlisted, per-collector viewing room at /private-view/:token.
 *
 * Renders without site chrome: a collector arriving from an emailed link should
 * land on the selection, not on the gallery's navigation. Borrows its type and
 * spacing from ExhibitionDetail so it reads as the same house.
 */
export default function PrivateView({ galleryName = 'Pastel Royalty Gallery' }) {
  const { token } = useParams()
  const view = getPrivateView(token)

  // A view names its own gallery; the prop is the fallback.
  const gallery = view?.galleryName ?? galleryName

  useScrollReveal([token])
  const { open } = useLightbox()
  const { openInquire } = useInquire()

  // Memoised so the derived useMemo below gets a stable dependency.
  const works = useMemo(() => view?.works ?? [], [view])

  const lightboxItems = useMemo(
    () =>
      works.map((w) => ({
        title: w.title,
        artistName: w.artist,
        year: w.year,
        medium: w.medium,
        dimensions: w.dimensions,
        status: w.status,
        displaySrc: w.displaySrc || '',
        fullSrc: w.fullSrc || '',
        dominantColor: w.color,
      })),
    [works],
  )

  // ─── Unknown token, or an expired link ────────────────────────────────
  // Both render the same neutral state: a wrong guess should not reveal
  // whether a token was ever real.
  if (!view || isExpired(view)) {
    return (
      <div className="pv-closed">
        <div className="pv-closed-inner">
          <div className="pv-closed-gallery">{gallery}</div>
          <h1 className="pv-closed-title">This view is no longer available</h1>
          <p className="pv-closed-body">
            Private views are held open for a limited period. If you would like it
            reopened, reply to the message it arrived in and we will send a new link.
          </p>
        </div>
      </div>
    )
  }

  const available = works.filter((w) => w.status === 'available')

  return (
    <main className="pv">
      {/* 1. CONFIDENTIAL RIBBON — the first thing that says "this is not public" */}
      <div className="pv-ribbon">
        <span className="pv-ribbon-mark">Private View</span>
        <span className="pv-ribbon-sep" />
        <span>Prepared for {view.collector}</span>
        <span className="pv-ribbon-sep" />
        <span className="pv-ribbon-quiet">
          Open through {formatDate(view.expiresOn)}
        </span>
      </div>

      {/* 2. MASTHEAD */}
      <header className="pv-head">
        <div className="pv-gallery reveal">{gallery}</div>
        <div className="pv-eyebrow reveal">{view.subtitle}</div>
        <h1 className="pv-title reveal">{view.title}</h1>
        <div className="pv-prepared reveal">
          Selected for {view.collector} by {view.preparedBy}
          {view.preparedByRole ? `, ${view.preparedByRole}` : ''} ·{' '}
          {formatDate(view.preparedOn)}
        </div>
      </header>

      {/* 3. THE NOTE — a letter, not marketing copy */}
      {view.note && (
        <section className="pv-note">
          <div className="pv-note-rule reveal-line" />
          {view.note.split('\n\n').map((para, i) => (
            <p key={i} className="pv-note-para reveal">
              {para}
            </p>
          ))}
        </section>
      )}

      {/* 4. COUNT */}
      <div className="pv-toolbar reveal">
        <div className="pv-count">
          {works.length} works · {available.length} available
        </div>
      </div>

      {/* 5. WORKS */}
      <section className="pv-grid">
        {works.map((work, i) => (
          <article
            key={work.id}
            className={`pv-card reveal ${i > 1 ? 'reveal-delay-1' : ''}`}
          >
            <div
              className="pv-card-image"
              onClick={() => open(lightboxItems, i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && open(lightboxItems, i)}
              aria-label={`View ${work.title}`}
              style={{
                background: `linear-gradient(160deg, ${work.color}, ${work.color}cc, ${work.color}99)`,
                aspectRatio: `${work.width_in} / ${work.height_in}`,
              }}
            >
              {work.status !== 'available' && (
                <span className={`pv-badge status-${work.status}`}>
                  {STATUS_LABELS[work.status]}
                </span>
              )}
            </div>

            <div className="pv-card-body">
              <div className="pv-card-artist">{work.artist}</div>
              <div className="pv-card-title">
                <em>{work.title}</em>, {work.year}
              </div>
              <div className="pv-card-meta">{work.medium}</div>
              <div className="pv-card-meta">{work.dimensions}</div>

              <div className="pv-card-price">{formatPrice(work, view.currency)}</div>

              {work.note && <div className="pv-card-note">{work.note}</div>}

              {work.status !== 'sold' && work.status !== 'nfs' && (
                <button
                  className="pv-card-action"
                  onClick={() => openInquire({ artwork: work })}
                >
                  {work.status === 'on_hold' ? 'Ask about this work' : 'Reserve this work'}
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* 6. CLOSING + CONTACT */}
      <section className="pv-close">
        <div className="pv-close-rule reveal-line" />
        {view.closing && <p className="pv-close-body reveal">{view.closing}</p>}

        <div className="pv-contact reveal">
          <div className="pv-contact-name">{view.contact.name}</div>
          {view.contact.role && (
            <div className="pv-contact-role">{view.contact.role}</div>
          )}
          <div className="pv-contact-links">
            <a href={`mailto:${view.contact.email}`}>{view.contact.email}</a>
            <span className="pv-ribbon-sep" />
            <a href={`tel:${view.contact.phone.replace(/[^\d+]/g, '')}`}>
              {view.contact.phone}
            </a>
          </div>
          <button className="pv-contact-btn" onClick={() => openInquire()}>
            Send a message
          </button>
        </div>
      </section>

      <footer className="pv-foot">
        Confidential · Prepared for {view.collector} · Not for distribution
      </footer>
    </main>
  )
}
