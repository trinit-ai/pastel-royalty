import { useParams, Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useLightbox } from '../hooks/useLightbox'
import { useInquire } from '../hooks/useInquire'
import { ARTISTS, EXHIBITIONS, TYPE_LABELS } from '../data/demo'
import './artist-detail.css'

// Generate 8 placeholder works per artist
function getWorks(artist) {
  const titles = ['Untitled I', 'Passage', 'Interior', 'Fragment', 'Study No. 3', 'After Rain', 'Threshold', 'Meridian']
  const years = [2026, 2025, 2025, 2024, 2024, 2023, 2023, 2022]
  const dims = ['48 × 36 in', '30 × 24 in', '60 × 48 in', '22 × 14 × 10 in', '36 × 28 in', '40 × 32 in', '18 × 12 in', '24 × 20 in']
  return titles.map((t, i) => ({
    title: t,
    year: years[i],
    medium: artist.medium,
    dimensions: dims[i],
    color: artist.color,
  }))
}

// Find real exhibitions + generate placeholder history
function getExhibitions(artist) {
  const real = EXHIBITIONS.filter(ex =>
    ex.artists?.toLowerCase().includes(artist.name.split(' ')[1]?.toLowerCase()) ||
    ex.artistIds?.includes(artist.id)
  )
  // Placeholder exhibition history so every artist has entries
  const placeholders = [
    { year: 2025, title: 'New Perspectives', type: 'Group', venue: 'Pastel Royalty Gallery' },
    { year: 2024, title: 'Material Encounters', type: 'Solo', venue: 'Pastel Royalty Gallery' },
    { year: 2024, title: 'Summer Exhibition', type: 'Group', venue: 'Elsewhere Gallery, New York' },
    { year: 2023, title: 'Emerging Voices', type: 'Group', venue: 'Institute of Contemporary Art' },
    { year: 2022, title: 'First Light', type: 'Solo', venue: 'Project Space, Brooklyn' },
  ]
  return { real, history: placeholders }
}

export default function ArtistDetail() {
  const { slug } = useParams()
  useScrollReveal([slug])
  const { open } = useLightbox()
  const { openInquire } = useInquire()

  const artist = ARTISTS.find(a => a.slug === slug)
  if (!artist) {
    return <main className="atd"><div className="atd-empty">Artist not found.</div></main>
  }

  const works = getWorks(artist)
  const { real: realExhibitions, history: exhibitionHistory } = getExhibitions(artist)

  // Build lightbox items from works
  const lightboxItems = works.map(w => ({
    title: w.title,
    artistName: artist.name,
    year: w.year,
    medium: w.medium,
    dimensions: w.dimensions,
    status: 'available',
    // Placeholder gradient as "image" — will be replaced with real images in production
    displaySrc: '',
    fullSrc: '',
    dominantColor: w.color,
  }))

  const openWork = (index) => {
    open(lightboxItems, index)
  }

  return (
    <main className="atd">
      {/* Ticker — artist bio details */}
      <div className="atd-ticker">
        {artist.location && <div className="ticker-item"><div className="ticker-dot" /><div className="ticker-text"><strong>{artist.location}</strong></div></div>}
        {artist.born && <div className="ticker-item"><div className="ticker-dot" /><div className="ticker-text"><strong>b. {artist.born}</strong></div></div>}
        {artist.instagram && <div className="ticker-item"><div className="ticker-dot" /><div className="ticker-text"><strong>{artist.instagram}</strong></div></div>}
        {artist.website && <div className="ticker-item"><div className="ticker-dot" /><div className="ticker-text"><strong>{artist.website}</strong></div></div>}
      </div>

      {/* Full-height hero — matches homepage formfactor */}
      <section className="atd-hero">
        <div className="atd-hero-content">
          <div className="atd-hero-eyebrow fade-up fade-up-1">
            <div className="atd-hero-rule" />
            <span className="atd-hero-label">Artist</span>
          </div>
          <h1 className="atd-hero-name fade-up fade-up-2">{artist.name}</h1>
          <div className="atd-hero-medium fade-up fade-up-2">{artist.medium}</div>
          <div className="atd-hero-divider fade-up fade-up-3" />
          <p className="atd-hero-bio fade-up fade-up-3">{artist.bio}</p>
          <p className="atd-hero-bio-extended reveal">
            Selected works have been exhibited nationally and internationally. The artist's practice draws on sustained observation and a deep engagement with material process, resulting in works that reward close, unhurried looking.
          </p>
          <p className="atd-hero-bio-extended reveal">
            Recent exhibitions include group presentations at institutional and commercial venues across the United States. Work is held in private and public collections. The artist maintains an active studio practice and is available for commissions and site-specific projects.
          </p>
          <div className="atd-hero-actions reveal">
            <a className="btn btn-outline" onClick={() => openInquire()} role="button">Inquire</a>
            <a href="#" className="btn btn-gold">Download CV ↓</a>
          </div>

          <div className="atd-hero-press reveal">
            <div className="atd-hero-press-label">Press</div>
            <a href="#" target="_blank" rel="noopener noreferrer" className="atd-press-item"><em>Title of Review</em> — Publication Name, 2025</a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="atd-press-item"><em>Title of Feature</em> — Publication Name, 2024</a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="atd-press-item"><em>Title of Interview</em> — Publication Name, 2023</a>
          </div>

        </div>

        <div className="atd-hero-image" style={{ background: `${artist.color}` }}>
          <img
            src="/hero-artwork.jpg"
            alt={`Detail of work by ${artist.name}`}
            className="atd-hero-artwork-img"
            decoding="async"
          />
        </div>
      </section>

      {/* Selected Works */}
      <section className="atd-works" id="works">
        <h2 className="atd-section-title reveal">Selected Works</h2>
        <div className="atd-works-grid">
          {works.map((w, i) => (
            <div key={i} className={`atd-work-card reveal ${i > 3 ? 'reveal-delay-1' : ''}`} onClick={() => openWork(i)} role="button" tabIndex={0}>
              <div
                className="atd-work-image"
                style={{
                  background: `linear-gradient(160deg, ${w.color}${i % 2 === 0 ? 'cc' : 'aa'}, ${w.color}${i % 2 === 0 ? '99' : 'bb'})`,
                  aspectRatio: i % 3 === 0 ? '3/4' : i % 2 === 0 ? '1/1' : '4/5',
                }}
              />
              <div className="atd-work-info">
                <div className="atd-work-title"><em>{w.title}</em>, {w.year}</div>
                <div className="atd-work-medium">{w.medium}</div>
                <div className="atd-work-dims">{w.dimensions}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exhibitions */}
      <section className="atd-exhibitions" id="exhibitions">
        <h2 className="atd-section-title reveal">Selected Exhibitions</h2>
        <div className="atd-exhibitions-list">
          {realExhibitions.map(ex => (
            <Link to={`/exhibitions/${ex.slug}`} key={ex.id} className="atd-exh-row atd-exh-linked reveal">
              <div className="atd-exh-thumb" style={{ background: `linear-gradient(160deg, ${ex.color}, ${ex.color}dd)` }} />
              <div className="atd-exh-info">
                <div className="atd-exh-type">{TYPE_LABELS[ex.type] || ex.type}</div>
                <div className="atd-exh-title">{ex.title}</div>
                <div className="atd-exh-venue">{ex.location}</div>
              </div>
              <div className="atd-exh-right">
                <div className="atd-exh-date">
                  {new Date(ex.start_date).getFullYear()}
                  {ex.end_date && ex.start_date.slice(0, 4) !== ex.end_date.slice(0, 4)
                    ? ` – ${new Date(ex.end_date).getFullYear()}`
                    : ''}
                </div>
                <div className="atd-exh-view">View →</div>
              </div>
            </Link>
          ))}
          {exhibitionHistory.map((ex, i) => (
            <div key={i} className="atd-exh-row reveal">
              <div className="atd-exh-thumb atd-exh-thumb-placeholder" />
              <div className="atd-exh-info">
                <div className="atd-exh-type">{ex.type}</div>
                <div className="atd-exh-title">{ex.title}</div>
                <div className="atd-exh-venue">{ex.venue}</div>
              </div>
              <div className="atd-exh-right">
                <div className="atd-exh-date">{ex.year}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Back */}
      <div className="atd-back reveal">
        <Link to="/artists" className="atd-back-link">← All Artists</Link>
      </div>
    </main>
  )
}
