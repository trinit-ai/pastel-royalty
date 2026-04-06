import { useParams, Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { EXHIBITIONS, TYPE_LABELS } from '../data/demo'
import './exhibition-detail.css'

export default function ExhibitionDetail() {
  const { slug } = useParams()
  useScrollReveal()

  const exhibition = EXHIBITIONS.find(e => e.slug === slug)

  if (!exhibition) {
    return (
      <main className="exhibition-detail-page">
        <div className="exhibition-detail-header">
          <Link to="/exhibitions" className="exhibition-back">← Back to Exhibitions</Link>
          <h1 className="section-title" style={{ marginTop: 20 }}>Exhibition not found</h1>
        </div>
      </main>
    )
  }

  const formatDateRange = (start, end) => {
    const s = new Date(start)
    const e = new Date(end)
    const opts = { month: 'long', day: 'numeric', year: 'numeric' }
    return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`
  }

  return (
    <main className="exhibition-detail-page">
      {/* Hero */}
      <div className="exhibition-detail-hero reveal" style={{ background: `linear-gradient(160deg, ${exhibition.color}, ${exhibition.color}dd, ${exhibition.color}bb)` }}>
        {exhibition.status === 'current' && <div className="exhibit-card-badge">On View</div>}
      </div>

      {/* Content */}
      <div className="exhibition-detail-content">
        <Link to="/exhibitions" className="exhibition-back reveal">← Back to Exhibitions</Link>

        <div className="exhibition-detail-meta reveal">
          <span className="exhibition-type-badge">{TYPE_LABELS[exhibition.type]}</span>
          <span className="exhibition-detail-location">{exhibition.location}</span>
        </div>

        <h1 className="exhibition-detail-title reveal">{exhibition.title}</h1>
        <div className="exhibition-detail-artists reveal">{exhibition.artists}</div>
        <div className="exhibition-detail-dates reveal">{formatDateRange(exhibition.start_date, exhibition.end_date)}</div>

        <div className="exhibition-detail-divider reveal-line" />

        <p className="exhibition-detail-description reveal">{exhibition.description}</p>

        {/* Artwork grid placeholder */}
        <div className="exhibition-detail-works-header reveal">
          <h2 className="exhibition-detail-works-title">Works in Exhibition</h2>
        </div>
        <div className="exhibition-detail-works-grid reveal">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="exhibition-work-placeholder" style={{
              background: `linear-gradient(160deg, ${exhibition.color}cc, ${exhibition.color}99)`,
              aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '1/1' : '4/3',
            }}>
              <div className="exhibition-work-label">
                <div className="exhibition-work-label-title">Artwork Title {i}</div>
                <div className="exhibition-work-label-detail">Medium, Dimensions</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="exhibition-detail-actions reveal">
          <a href="mailto:info@yourgallery.com" className="btn btn-primary" style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', padding: '14px 32px' }}>
            Inquire About This Exhibition →
          </a>
          <button className="btn btn-outline" style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', padding: '14px 32px', color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
            Download PDF ↓
          </button>
        </div>
      </div>
    </main>
  )
}
