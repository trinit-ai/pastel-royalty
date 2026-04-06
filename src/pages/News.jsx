import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import './news.css'

const FEED = [
  {
    year: 'Forthcoming',
    slug: 'coastal-contemporary-2027',
    date: 'March 20–23',
    title: 'Coastal Contemporary 2027',
    body: 'The gallery returns to Coastal Contemporary with a curated booth presentation featuring five gallery artists. Chelsea Industrial, New York.',
    tag: 'Art Fair',
    color: '#D4E4F0',
  },
  {
    year: 'Forthcoming',
    slug: 'elena-marsh-modern-painters',
    date: 'February',
    title: 'Elena Marsh in Modern Painters',
    body: 'A four-page spread exploring Marsh\'s recent body of work and her evolving relationship with coastal light, beeswax, and linen.',
    tag: 'Publication',
    color: '#ddd8e8',
    href: '#', // external link placeholder
  },
  {
    year: 'Forthcoming',
    slug: 'collectors-breakfast-winter-preview',
    date: 'January 15',
    title: 'Collector\'s Breakfast: Winter Preview',
    body: 'An intimate morning event previewing the 2027 exhibition calendar. By invitation — contact the gallery for details.',
    tag: 'Event',
    color: '#e8e4de',
  },
  {
    year: 2026,
    slug: 'now-representing-tomas-herrera',
    date: 'December',
    title: 'Now Representing: Tomás Herrera',
    body: 'The gallery is pleased to announce the addition of Tomás Herrera to its roster. Large-scale ink and graphite works on handmade paper exploring the architecture of memory.',
    tag: 'Announcement',
    color: '#d4ddd0',
  },
  {
    year: 2026,
    slug: 'tidal-patterns',
    date: 'September',
    title: 'Nora Whitfield: Tidal Patterns',
    body: 'Solo exhibition of new ceramic and mixed media works exploring the rhythmic geometry found in tidal systems, salt marshes, and barrier island topography.',
    tag: 'Exhibition',
    color: '#DDD8E8',
    href: '/exhibitions/tidal-patterns',
  },
  {
    year: 2026,
    slug: 'still-life-with-light-opens',
    date: 'May 1',
    title: 'Still Life with Light Opens',
    body: 'Elena Marsh and Julian Cole — painting and sculpture in conversation with coastal light. Opening reception Thursday, May 1, 5–8pm.',
    tag: 'Exhibition',
    color: '#C4D2C0',
    href: '/exhibitions/still-life-with-light',
  },
  {
    year: 2025,
    slug: 'coastal-contemporary-2025',
    date: 'October 18–21',
    title: 'Coastal Contemporary 2025',
    body: 'Inaugural presentation at Coastal Contemporary art fair. Paintings by Elena Marsh and sculpture by Julian Cole. Chelsea Industrial, Booth F13.',
    tag: 'Art Fair',
    color: '#e8e0d4',
  },
  {
    year: 2025,
    slug: 'julian-cole-sculpture-magazine',
    date: 'September',
    title: 'Julian Cole in Sculpture Magazine',
    body: 'A studio visit profile examining Cole\'s material process — from driftwood sourcing along the Hudson Valley to the slow, subtractive carving that defines his practice.',
    tag: 'Publication',
    color: '#ccd4c8',
    href: '#', // external link placeholder
  },
  {
    year: 2025,
    slug: 'artist-talk-marsh-cole',
    date: 'August 12',
    title: 'Artist Talk: Marsh & Cole',
    body: 'In conversation with the gallery director, the artists discuss "Salt & Stone" and the intersection of painting and sculpture.',
    tag: 'Event',
    color: '#d4e4f0',
  },
  {
    year: 2025,
    slug: 'gallery-profile-art-object',
    date: 'April',
    title: 'Gallery Profile in Art & Object',
    body: 'A feature on the gallery\'s first year — curatorial vision, the artist roster, and building a program outside the traditional gallery district.',
    tag: 'Publication',
    color: '#d2c8c4',
    href: '#', // external link placeholder
  },
  {
    year: 2025,
    slug: 'pastel-royalty-gallery-opens',
    date: 'January',
    title: 'Pastel Royalty Gallery Opens',
    body: 'Our inaugural exhibition, featuring works by eight emerging and mid-career artists, opens to the public this spring.',
    tag: 'Announcement',
    color: '#e2ded8',
  },
]

const TAG_COLORS = {
  'Art Fair': 'var(--accent-secondary)',
  'Publication': '#8B6F5C',
  'Event': 'var(--accent)',
  'Announcement': '#4a7a50',
  'Exhibition': 'var(--accent-secondary)',
}

// Group items by year
function groupByYear(items) {
  const groups = []
  let currentYear = null
  for (const item of items) {
    if (item.year !== currentYear) {
      currentYear = item.year
      groups.push({ year: currentYear, items: [] })
    }
    groups[groups.length - 1].items.push(item)
  }
  return groups
}

export default function News() {
  useScrollReveal()
  const groups = groupByYear(FEED)

  return (
    <main className="news-page">
      <div className="news-header">
        <div className="eyebrow" style={{ marginBottom: 14 }}>Gallery</div>
        <h1 className="news-title">News</h1>
        <p className="news-subtitle">Art fairs, events, publications, and announcements.</p>
      </div>

      <div className="news-feed">
        {groups.map((group) => (
          <div key={group.year} className="news-year-group">
            <div className="news-year-marker reveal">
              <span className="news-year-label">{group.year}</span>
              <span className="news-year-line" />
            </div>

            <div className="news-grid">
              {group.items.map((item, i) => {
                const isExternal = item.href && (item.href.startsWith('http') || item.href === '#')
                const isInternal = item.href && item.href.startsWith('/')
                const fallbackTo = `/news/${item.slug}`

                const cardContent = (
                  <>
                    <div className="news-card-image" style={{ background: `linear-gradient(160deg, ${item.color}, ${item.color}dd)` }} />
                    <div className="news-card-content">
                      <div className="news-card-meta">
                        <span className="news-card-tag" style={{ color: TAG_COLORS[item.tag] || 'var(--text-muted)' }}>{item.tag}</span>
                        <span className="news-card-date">{item.date}</span>
                      </div>
                      <h2 className="news-card-title">{item.title}</h2>
                      <p className="news-card-body">{item.body}</p>
                    </div>
                  </>
                )

                if (isExternal) {
                  return (
                    <a key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="news-card reveal">
                      {cardContent}
                    </a>
                  )
                }

                return (
                  <Link key={i} to={isInternal ? item.href : fallbackTo} className="news-card reveal">
                    {cardContent}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
