import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useInquire } from '../hooks/useInquire'
import { EXHIBITIONS, ARTISTS } from '../data/demo'
import './home.css'

// Homepage shows first 3 exhibitions and first 4 artists
const FEATURED_EXHIBITIONS = EXHIBITIONS.filter(e => e.featured || e.status === 'current').concat(
  EXHIBITIONS.filter(e => e.status === 'past')
).slice(0, 3)
const FEATURED_ARTISTS = ARTISTS.slice(0, 4)

export default function Home({ galleryName }) {
  useScrollReveal()
  const { openInquire } = useInquire()

  return (
    <main className="home-page">
      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-item"><div className="ticker-dot" /><div className="ticker-text"><strong>Now on view</strong> — Still Life with Light</div></div>
        <div className="ticker-item"><div className="ticker-dot" /><div className="ticker-text"><strong>Hours</strong> — Thu–Sun, 11–5</div></div>
        <div className="ticker-item"><div className="ticker-dot" /><div className="ticker-text"><strong>Your City, ST</strong> — Directions</div></div>
        <div className="ticker-item"><div className="ticker-dot" /><div className="ticker-text"><strong>(555) 000-0000</strong></div></div>
        <div className="ticker-item"><div className="ticker-dot" /><div className="ticker-text"><strong>info@yourgallery.com</strong></div></div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-eyebrow fade-up fade-up-1">
            <div className="hero-rule" />
            <div className="hero-label">Current Exhibition</div>
          </div>
          <h1 className="hero-title fade-up fade-up-2">Still Life with Light</h1>
          <div className="hero-artist fade-up fade-up-2">Elena Marsh &amp; Julian Cole</div>
          <div className="hero-dates fade-up fade-up-3">Summer 2026</div>
          <div className="hero-divider fade-up fade-up-3" />
          <p className="hero-body fade-up fade-up-3">
            Two artists exploring the quiet tension between permanence and impermanence — painting and sculpture in conversation with coastal light.
          </p>
          <div className="hero-actions fade-up fade-up-4">
            <Link to="/exhibitions/still-life-with-light" className="btn btn-outline">View Exhibition →</Link>
            <a href="#" className="btn btn-gold">Download PDF ↓</a>
          </div>

          <div className="hero-contact-card fade-up fade-up-4">
            <div className="hero-contact-logo">
              <span className="hero-contact-logo-text">{galleryName}</span>
            </div>
            <div className="hero-contact-top">
              <span className="hero-contact-label">Stay connected</span>
              <a className="hero-contact-link" onClick={openInquire} role="button" style={{ cursor: 'pointer' }}>Inquire</a>
            </div>
            <form className="hero-contact-form" onSubmit={e => e.preventDefault()}>
              <input type="email" className="hero-contact-input" placeholder="Your email" />
              <button type="submit" className="hero-contact-submit">Subscribe</button>
            </form>
          </div>

          <div className="cookie-inline">
            <span className="cookie-text">This site uses analytics cookies.</span>
            <span className="cookie-sep">·</span>
            <a href="#" className="cookie-link">Privacy</a>
            <span className="cookie-sep">·</span>
            <button className="cookie-btn">→ Decline</button>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-image-placeholder" />
          <div className="artwork-label">
            <div className="artwork-label-title">Morning Harbor</div>
            <div className="artwork-label-detail">
              Elena Marsh, 2025<br />Oil on linen<br />48 × 36 in
            </div>
          </div>
        </div>
      </section>

      {/* EXHIBITIONS */}
      <section className="section" id="exhibitions">
        <div className="section-header reveal">
          <div className="eyebrow" style={{ marginBottom: 14 }}>Featured</div>
          <h2 className="section-title">Exhibitions</h2>
          <div className="section-divider reveal-line" />
        </div>
        <div className="exhibitions-grid">
          {FEATURED_EXHIBITIONS.map((ex, i) => (
            <Link to={`/exhibitions/${ex.slug}`} key={ex.id} className={`exhibit-card ${i === 0 ? 'exhibit-card-featured' : ''} reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}>
              <div className="exhibit-card-image" style={{ background: `linear-gradient(160deg, ${ex.color}, ${ex.color}dd, ${ex.color}bb)` }} />
              {ex.status === 'current' && <div className="exhibit-card-badge">On View</div>}
              <div className="exhibit-card-info">
                <div className="exhibit-card-date">{ex.artists}</div>
                <div className="exhibit-card-title">{ex.title}</div>
                <div className="exhibit-card-artists">{ex.location}</div>
              </div>
            </Link>
          ))}
        </div>
        <div className="section-footer reveal">
          <div className="section-footer-text">{EXHIBITIONS.length} exhibitions since 2024</div>
          <Link to="/exhibitions" className="section-footer-link">View Full Archive →</Link>
        </div>
      </section>

      {/* ARTISTS */}
      <section className="section section-alt" id="artists">
        <div className="section-header reveal">
          <div className="eyebrow" style={{ marginBottom: 14 }}>On View</div>
          <h2 className="section-title">Artists</h2>
          <div className="section-divider reveal-line" />
        </div>
        <div className="artists-list">
          {FEATURED_ARTISTS.map(artist => (
            <Link to={`/artists/${artist.slug}`} key={artist.id} className="artist-row reveal">
              <div className="artist-row-thumb" style={{ background: `linear-gradient(160deg, ${artist.color}, ${artist.color}dd)` }} />
              <div className="artist-row-info">
                {artist.onView && <div className="artist-row-badge">On View</div>}
                <div className="artist-row-name">{artist.name}</div>
                <div className="artist-row-medium">{artist.medium}</div>
              </div>
              <div className="artist-row-right">
                {artist.location && <div className="artist-row-location">{artist.location}</div>}
                <span className="artist-row-link">View →</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="section-footer reveal">
          <div className="section-footer-text">32 represented artists</div>
          <Link to="/artists" className="section-footer-link">View Full Roster →</Link>
        </div>
      </section>

      {/* ABOUT / SERVICES */}
      <section className="section" id="about" style={{ paddingBottom: 0 }}>
        <div className="section-header reveal">
          <div className="eyebrow" style={{ marginBottom: 14 }}>About</div>
          <h2 className="section-title">Gallery Information</h2>
          <div className="section-divider reveal-line" />
          <p className="about-summary reveal">
            A fine art gallery and full-service advisory firm — curating exhibitions and building collections with deep expertise in contemporary and modern art.
          </p>
        </div>
        <div className="services-grid">
          <div className="service-card service-sage reveal">
            <div className="service-icon" />
            <div className="service-title">Consultations</div>
            <div className="service-body">Private advisory for collectors at every stage — from first acquisitions to comprehensive collection strategy.</div>
            <a className="service-link" onClick={openInquire} role="button" style={{ cursor: 'pointer' }}>Inquire</a>
          </div>
          <div className="service-card service-lavender reveal reveal-delay-1">
            <div className="service-icon" />
            <div className="service-title">Appraisals</div>
            <div className="service-body">USPAP-compliant appraisals for insurance, estate planning, charitable donation, and equitable distribution.</div>
            <a className="service-link" onClick={openInquire} role="button" style={{ cursor: 'pointer' }}>Inquire</a>
          </div>
          <div className="service-card service-blush reveal reveal-delay-2">
            <div className="service-icon" />
            <div className="service-title">Art Advisory</div>
            <div className="service-body">Long-term advisory relationships with institutions and private clients seeking a trusted curatorial partner.</div>
            <a className="service-link" onClick={openInquire} role="button" style={{ cursor: 'pointer' }}>Inquire</a>
          </div>
        </div>
      </section>

      {/* VISIT + ABOUT */}
      <section id="visit" style={{ borderBottom: 'none' }}>
        <div className="visit-grid reveal">
          <div className="visit-left">
            <div className="eyebrow-gold" style={{ marginBottom: 20 }}>Visit</div>
            <div className="visit-title">Your City,<br />Your State</div>
            <div className="visit-detail">
              <div className="visit-label">Address</div>
              <div className="visit-value">123 Main Street, Suite #1<br />Your City, ST 00000</div>
            </div>
            <div className="visit-detail">
              <div className="visit-label">Hours</div>
              <div className="visit-value">Thursday – Sunday, 11am – 5pm<br />And by appointment</div>
            </div>
            <div className="visit-detail">
              <div className="visit-label">Contact</div>
              <div className="visit-value">info@yourgallery.com</div>
            </div>
            <div className="visit-detail" style={{ borderBottom: 'none' }}>
              <div className="visit-label">Instagram</div>
              <div className="visit-value">@yourgallery</div>
            </div>
          </div>
          <div className="visit-right">
            <div className="eyebrow" style={{ marginBottom: 20 }}>About</div>
            <div className="visit-right-title">Contemporary art<br />for the modern collector.</div>
            <p className="visit-right-body">
              The gallery presents contemporary painting, sculpture, and works on paper. We represent emerging and established artists working across media, with a focus on material craft, visual intensity, and curatorial precision.
            </p>
            <a className="btn btn-primary" style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', padding: '14px 32px', cursor: 'pointer' }} onClick={openInquire} role="button">
              Inquire
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}
