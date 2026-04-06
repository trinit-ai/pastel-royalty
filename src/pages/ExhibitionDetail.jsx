import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { EXHIBITIONS, ARTISTS, TYPE_LABELS } from '../data/demo'
import InstallCarousel from '../components/ui/InstallCarousel'
import './exhibition-detail.css'

export default function ExhibitionDetail() {
  const { slug } = useParams()
  useScrollReveal([slug])
  const carouselRef = useRef(null)

  const exhibition = EXHIBITIONS.find(e => e.slug === slug)

  if (!exhibition) {
    return (
      <main className="exd">
        <div className="exd-content">
          <Link to="/exhibitions" className="exd-back">← Back to Exhibitions</Link>
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

  // Get artists in this show
  const showArtists = exhibition.artistIds
    ? ARTISTS.filter(a => exhibition.artistIds.includes(a.id))
    : []

  // Demo installation view colors
  const installColors = [
    '#d4ddd0',
    '#c8d8c4',
    '#dde4d8',
    '#ccd4c8',
    '#d8e0d4',
  ]

  return (
    <main className="exd">
      {/* 1. FULL-BLEED HERO */}
      <div
        className="exd-hero reveal"
        style={{ background: `linear-gradient(160deg, ${exhibition.color}, ${exhibition.color}dd, ${exhibition.color}bb)` }}
      >
        {exhibition.status === 'current' && <div className="exd-hero-badge">On View</div>}
      </div>

      {/* 2. EXHIBITION HEADER */}
      <div className="exd-header">
        <Link to="/exhibitions" className="exd-back reveal">← Exhibitions</Link>

        <div className="exd-header-meta reveal">
          <span className="exd-type-badge">{TYPE_LABELS[exhibition.type]}</span>
          <span className="exd-location">{exhibition.location}</span>
        </div>

        <h1 className="exd-title reveal">{exhibition.title}</h1>
        <div className="exd-artists reveal">{exhibition.artists}</div>
        <div className="exd-dates reveal">{formatDateRange(exhibition.start_date, exhibition.end_date)}</div>

        {exhibition.opening && (
          <div className="exd-opening reveal">{exhibition.opening}</div>
        )}

        <a href="mailto:info@yourgallery.com" className="exd-inquire-btn reveal">
          Inquire →
        </a>
      </div>

      {/* 3. CURATORIAL ESSAY */}
      {exhibition.essay && (
        <div className="exd-essay">
          <div className="exd-essay-divider reveal-line" />
          {exhibition.essay.split('\n\n').map((para, i) => (
            <p key={i} className="exd-essay-para reveal">{para}</p>
          ))}
          {exhibition.pullQuote && (
            <blockquote className="exd-pullquote reveal">
              {exhibition.pullQuote}
            </blockquote>
          )}
        </div>
      )}

      {/* 4. PRESS RELEASE */}
      <div className="exd-press reveal">
        <div className="exd-press-inner">
          <div className="exd-press-label">Press</div>
          <div className="exd-press-actions">
            <button className="exd-press-btn">Download Press Release (PDF) ↓</button>
            <button className="exd-press-btn">Download Checklist (PDF) ↓</button>
          </div>
        </div>
      </div>

      {/* 5. INSTALLATION VIEWS — carousel */}
      <div className="exd-install">
        <div className="exd-install-header reveal">
          <h2 className="exd-section-title" style={{ marginBottom: 0 }}>Installation Views</h2>
          <div className="install-header-nav">
            <button className="install-header-arrow" onClick={() => carouselRef.current?.prev()}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8L10 13" /></svg>
            </button>
            <button className="install-header-arrow" onClick={() => carouselRef.current?.next()}>
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3L11 8L6 13" /></svg>
            </button>
          </div>
        </div>
        <div className="reveal">
          <InstallCarousel
            ref={carouselRef}
            images={installColors.map((color, i) => ({ color, src: '' }))}
            exhibitionTitle={exhibition.title}
            disableLightbox
          />
        </div>
      </div>

      {/* 6. SELECTED ARTWORKS — 3 column grid */}
      <div className="exd-artworks">
        <h2 className="exd-section-title reveal">Selected Works</h2>
        <div className="exd-artworks-grid">
          {[
            { title: 'Morning Harbor', artist: 'Elena Marsh', year: 2025, medium: 'Oil on linen', dims: '48 × 36 in' },
            { title: 'Coastal Fragment III', artist: 'Julian Cole', year: 2025, medium: 'Carved walnut', dims: '22 × 14 × 10 in' },
            { title: 'Green Passage', artist: 'Elena Marsh', year: 2026, medium: 'Oil and beeswax on hemp', dims: '60 × 48 in' },
            { title: 'Tidal Form', artist: 'Julian Cole', year: 2026, medium: 'Bronze', dims: '18 × 12 × 8 in' },
            { title: 'Late Summer', artist: 'Elena Marsh', year: 2025, medium: 'Oil on linen', dims: '40 × 32 in' },
            { title: 'Shore Bone', artist: 'Julian Cole', year: 2026, medium: 'Bleached oak', dims: '36 × 8 × 6 in' },
            { title: 'Estuary', artist: 'Elena Marsh', year: 2026, medium: 'Oil on canvas', dims: '36 × 28 in' },
            { title: 'Drift', artist: 'Julian Cole', year: 2025, medium: 'Found wood, steel', dims: '42 × 16 × 12 in' },
          ].map((work, i) => (
            <div key={i} className={`exd-artwork-card reveal ${i > 2 ? 'reveal-delay-1' : ''}`}>
              <div
                className="exd-artwork-image"
                style={{
                  background: `linear-gradient(160deg, ${exhibition.color}${i % 2 === 0 ? 'cc' : 'aa'}, ${exhibition.color}${i % 2 === 0 ? '99' : 'bb'})`,
                  aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '1/1' : '4/5',
                }}
              />
              <div className="exd-artwork-info">
                <div className="exd-artwork-artist">{work.artist}</div>
                <div className="exd-artwork-title"><em>{work.title}</em>, {work.year}</div>
                <div className="exd-artwork-medium">{work.medium}</div>
                <div className="exd-artwork-dims">{work.dims}</div>
                <a href={`mailto:info@yourgallery.com?subject=Inquiry: ${work.title} by ${work.artist}`} className="exd-artwork-inquire">Inquire →</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. ARTISTS IN SHOW */}
      {showArtists.length > 0 && (
        <div className="exd-show-artists">
          <h2 className="exd-section-title reveal">Artists in This Exhibition</h2>
          <div className="exd-show-artists-grid">
            {showArtists.map(artist => (
              <div key={artist.id} className="exd-artist-card reveal">
                <div className="exd-artist-portrait" style={{ background: `linear-gradient(160deg, ${artist.color}, ${artist.color}dd)` }} />
                <div className="exd-artist-name">{artist.name}</div>
                <div className="exd-artist-medium">{artist.medium}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </main>
  )
}
