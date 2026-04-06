import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { EXHIBITIONS, TYPE_LABELS } from '../data/demo'
import './exhibitions.css'

const TABS = [
  { key: 'current', label: 'Current' },
  { key: 'forthcoming', label: 'Forthcoming' },
  { key: 'archive', label: 'Archive' },
]

export default function Exhibitions() {
  const [activeTab, setActiveTab] = useState('current')
  const [typeFilter, setTypeFilter] = useState(null)
  useScrollReveal([activeTab, typeFilter])

  const current = EXHIBITIONS.filter(e => e.status === 'current')
  const forthcoming = EXHIBITIONS.filter(e => e.status === 'upcoming')
  const archive = EXHIBITIONS.filter(e => e.status === 'past')

  // Get unique types for filter
  const archiveTypes = [...new Set(archive.map(e => e.type))]

  const filteredArchive = typeFilter
    ? archive.filter(e => e.type === typeFilter)
    : archive

  const formatDateRange = (start, end) => {
    const s = new Date(start)
    const e = new Date(end)
    const opts = { month: 'long', day: 'numeric', year: 'numeric' }
    return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`
  }

  const formatSeason = (dateStr) => {
    const d = new Date(dateStr)
    const month = d.getMonth()
    const year = d.getFullYear()
    if (month >= 2 && month <= 4) return `Spring ${year}`
    if (month >= 5 && month <= 7) return `Summer ${year}`
    if (month >= 8 && month <= 10) return `Fall ${year}`
    return `Winter ${year}`
  }

  return (
    <main className="exhibitions-page">
      {/* Header */}
      <div className="exhibitions-page-header reveal">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Program</div>
        <h1 className="section-title">Exhibitions</h1>
        <div className="section-divider reveal-line" />
      </div>

      {/* Tabs */}
      <div className="exhibitions-tabs reveal">
        <div className="exhibitions-tabs-left">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`exhibitions-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setTypeFilter(null) }}
            >
              {tab.label}
              {tab.key === 'current' && current.length > 0 && (
                <span className="exhibitions-tab-count">{current.length}</span>
              )}
            </button>
          ))}
        </div>
        {activeTab === 'archive' && archiveTypes.length > 1 && (
          <div className="exhibitions-filters">
            <button
              className={`exhibitions-filter ${!typeFilter ? 'active' : ''}`}
              onClick={() => setTypeFilter(null)}
            >All</button>
            {archiveTypes.map(type => (
              <button
                key={type}
                className={`exhibitions-filter ${typeFilter === type ? 'active' : ''}`}
                onClick={() => setTypeFilter(type)}
              >{TYPE_LABELS[type] || type}</button>
            ))}
          </div>
        )}
      </div>

      {/* Current */}
      {activeTab === 'current' && (
        <div className="exhibitions-current">
          {current.length === 0 && (
            <div className="exhibitions-empty reveal">No exhibitions currently on view.</div>
          )}
          {current.map(ex => (
            <Link to={`/exhibitions/${ex.slug}`} key={ex.id} className="exhibition-current-card reveal">
              <div className="exhibition-current-image" style={{ background: `linear-gradient(160deg, ${ex.color}, ${ex.color}dd, ${ex.color}bb)` }}>
                <div className="exhibit-card-badge">On View</div>
              </div>
              <div className="exhibition-current-info">
                <div className="exhibition-current-dates">{formatDateRange(ex.start_date, ex.end_date)}</div>
                <h2 className="exhibition-current-title">{ex.title}</h2>
                <div className="exhibition-current-artists">{ex.artists}</div>
                <p className="exhibition-current-description">{ex.description}</p>
                <div className="exhibition-current-meta">
                  <span className="exhibition-type-badge">{TYPE_LABELS[ex.type]}</span>
                  <span className="exhibition-current-location">{ex.location}</span>
                </div>
                <span className="exhibition-current-link">View Exhibition →</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Forthcoming */}
      {activeTab === 'forthcoming' && (
        <div className="exhibitions-forthcoming">
          {forthcoming.length === 0 && (
            <div className="exhibitions-empty reveal">No forthcoming exhibitions announced.</div>
          )}
          {forthcoming.map(ex => (
            <div key={ex.id} className="exhibition-forthcoming-card reveal">
              <div className="exhibition-forthcoming-season">{formatSeason(ex.start_date)}</div>
              <h2 className="exhibition-forthcoming-title">{ex.title}</h2>
              <div className="exhibition-forthcoming-artists">{ex.artists}</div>
              <p className="exhibition-forthcoming-description">{ex.description}</p>
              <div className="exhibition-forthcoming-meta">
                <span className="exhibition-type-badge">{TYPE_LABELS[ex.type]}</span>
                <span className="exhibition-forthcoming-location">{ex.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archive */}
      {activeTab === 'archive' && (
        <div className="exhibitions-archive">
          {filteredArchive.map(ex => (
            <Link to={`/exhibitions/${ex.slug}`} key={ex.id} className="exhibition-archive-row reveal">
              <div className="exhibition-archive-thumb" style={{ background: `linear-gradient(160deg, ${ex.color}, ${ex.color}dd)` }} />
              <div className="exhibition-archive-info">
                <span className="exhibition-type-badge">{TYPE_LABELS[ex.type]}</span>
                <h3 className="exhibition-archive-title">{ex.title}</h3>
                <div className="exhibition-archive-location">{ex.location} — {ex.artists}</div>
              </div>
              <div className="exhibition-archive-right">
                <div className="exhibition-archive-dates">{formatDateRange(ex.start_date, ex.end_date)}</div>
                <span className="exhibition-archive-link">View →</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
