import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { ARTISTS } from '../data/demo'

import './artists.css'

export default function Artists() {
  useScrollReveal()

  // Sort alphabetically by last name
  const sorted = [...ARTISTS].sort((a, b) => {
    const lastA = a.name.split(' ').pop()
    const lastB = b.name.split(' ').pop()
    return lastA.localeCompare(lastB)
  })

  // Split into two columns
  const mid = Math.ceil(sorted.length / 2)
  const left = sorted.slice(0, mid)
  const right = sorted.slice(mid)

  return (
    <main className="artists-page">
      <div className="artists-page-header reveal">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Roster</div>
        <h1 className="section-title">Artists</h1>
        <div className="section-divider reveal-line" />
        <div className="artists-count">{ARTISTS.length} represented artists</div>
      </div>

      <div className="artists-roster">
        <div className="artists-roster-col">
          {left.map(artist => (
            <Link to={`/artists/${artist.slug}`} key={artist.id} className="artist-roster-row reveal">
              <div className="artist-roster-thumb" style={{ background: `linear-gradient(135deg, ${artist.color}, ${artist.color}cc)` }} />
              <div className="artist-roster-info">
                <div className="artist-roster-name">{artist.name}</div>
                <div className="artist-roster-meta">{artist.medium}{artist.location ? ` · ${artist.location}` : ''}</div>
                {artist.bio && <div className="artist-roster-bio">{artist.bio}</div>}
              </div>
            </Link>
          ))}
        </div>
        <div className="artists-roster-col">
          {right.map(artist => (
            <Link to={`/artists/${artist.slug}`} key={artist.id} className="artist-roster-row reveal">
              <div className="artist-roster-thumb" style={{ background: `linear-gradient(135deg, ${artist.color}, ${artist.color}cc)` }} />
              <div className="artist-roster-info">
                <div className="artist-roster-name">{artist.name}</div>
                <div className="artist-roster-meta">{artist.medium}{artist.location ? ` · ${artist.location}` : ''}</div>
                {artist.bio && <div className="artist-roster-bio">{artist.bio}</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
