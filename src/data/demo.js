/**
 * Demo data — replaced by Supabase queries in production.
 * Structured to match the database schema exactly.
 *
 * ─── Type definitions (JSDoc) ────────────────────────────
 * These document the shape of every record in this file. When
 * wiring up Supabase, your tables should match these exactly.
 *
 * @typedef {Object} Exhibition
 * @property {string} id                  - Unique identifier
 * @property {string} title               - Display title
 * @property {string} slug                - URL slug (lowercase, hyphenated)
 * @property {'solo'|'group'|'fair'} type - Exhibition format
 * @property {string} start_date          - ISO date YYYY-MM-DD
 * @property {string} end_date            - ISO date YYYY-MM-DD
 * @property {string} location            - Physical location / venue
 * @property {string} description         - Short summary (1-3 sentences)
 * @property {string} [essay]             - Long-form curatorial essay
 * @property {string} [pullQuote]         - Featured quote (artist or curator)
 * @property {string} [opening]           - Reception details
 * @property {string[]} artistIds         - References to ARTISTS[].id
 * @property {'current'|'forthcoming'|'past'} status
 * @property {boolean} [featured]         - Show on homepage
 * @property {string} artists             - Display string (e.g. "Elena Marsh & Julian Cole")
 * @property {string} color               - Hex color for placeholder gradient
 *
 * @typedef {Object} Artist
 * @property {string} id                  - Unique identifier
 * @property {string} name                - Full name
 * @property {string} slug                - URL slug
 * @property {string} medium              - Primary medium(s)
 * @property {string} location            - City, State
 * @property {number} born                - Birth year
 * @property {string} [instagram]         - Handle with @
 * @property {string} [website]           - Domain only, no https://
 * @property {string} bio                 - Short bio (1-2 sentences)
 * @property {boolean} [featured]         - Show on homepage
 * @property {boolean} [onView]           - Currently in an exhibition
 * @property {string} color               - Hex color for placeholder gradient
 *
 * @typedef {Object} NewsItem
 * @property {string|number} year         - Year or "Forthcoming"
 * @property {string} slug                - URL slug for detail page
 * @property {string} date                - Display date (e.g. "March 20–23")
 * @property {string} title               - Headline
 * @property {string} body                - Body copy (1-3 sentences)
 * @property {'Art Fair'|'Publication'|'Event'|'Announcement'|'Exhibition'} tag
 * @property {string} color               - Hex color for placeholder gradient
 * @property {string} [href]              - Optional override link (external URL or internal path)
 *
 * @typedef {Object} Artwork
 * @property {string} id                  - Unique identifier
 * @property {string} title               - Title (will be italicized in UI)
 * @property {string} artistId            - Reference to ARTISTS[].id
 * @property {number} year                - Creation year
 * @property {string} medium              - Medium description
 * @property {string} dimensions          - Display dimensions (e.g. "48 × 36 in")
 * @property {'available'|'sold'|'nfs'|'on-hold'} [status]
 * @property {string} [imageUrl]          - Image path
 * @property {string} color               - Hex color for placeholder gradient
 */

/** @type {Exhibition[]} */

export const EXHIBITIONS = [
  // Current
  {
    id: '1',
    title: 'Still Life with Light',
    slug: 'still-life-with-light',
    type: 'group',
    start_date: '2026-05-01',
    end_date: '2026-08-15',
    location: 'Main Gallery',
    description: 'Two artists exploring the quiet tension between permanence and impermanence — painting and sculpture in conversation with coastal light. The exhibition brings together new bodies of work created specifically for this presentation.',
    essay: 'Elena Marsh and Julian Cole approach their respective mediums from opposite ends of the material spectrum — Marsh through the fluid accumulation of pigment on linen, Cole through the slow subtraction of form from wood and stone. Yet both artists share a preoccupation with the quality of coastal light: its capacity to flatten and reveal, to dissolve edges while sharpening attention.\n\nIn "Still Life with Light," their works are placed in direct dialogue for the first time. Marsh\'s large-scale paintings — some exceeding six feet — occupy the gallery\'s main walls, their surfaces thick with beeswax and oil, colors shifting between the saturated greens of late summer and the bleached whites of winter shoreline. Cole\'s sculptures, positioned throughout the space, respond to these chromatic fields with forms that suggest driftwood, bone, and geological strata.\n\nThe title refers not to the traditional genre but to the literal condition of stillness in light — the particular quality of attention that emerges when movement stops and looking begins. Both artists have described their studios as places where time operates differently, where the slow accumulation of marks or the gradual revelation of form creates its own temporal logic.',
    pullQuote: '"The painting is finished when the light in it matches the light outside the window." — Elena Marsh',
    opening: 'Opening reception: Thursday, May 1, 2026, 5–8pm',
    artistIds: ['1', '2'],
    status: 'current',
    featured: true,
    artists: 'Elena Marsh & Julian Cole',
    color: '#C4D2C0',
  },
  // Forthcoming
  {
    id: '2',
    title: 'Tidal Patterns',
    slug: 'tidal-patterns',
    type: 'solo',
    start_date: '2026-09-12',
    end_date: '2026-11-15',
    location: 'Main Gallery',
    description: 'A solo exhibition of new ceramic and mixed media works exploring the rhythmic geometry found in tidal systems, salt marshes, and barrier island topography.',
    status: 'upcoming',
    featured: false,
    artists: 'Nora Whitfield',
    color: '#DDD8E8',
  },
  {
    id: '3',
    title: 'Coastal Contemporary 2027',
    slug: 'coastal-contemporary-2027',
    type: 'fair',
    start_date: '2027-03-20',
    end_date: '2027-03-23',
    location: 'Chelsea Industrial, New York',
    description: 'The gallery returns to Coastal Contemporary with a curated booth presentation featuring five gallery artists.',
    status: 'upcoming',
    featured: false,
    artists: 'Gallery Artists',
    color: '#D4E4F0',
  },
  // Past
  {
    id: '4',
    title: 'Salt & Stone',
    slug: 'salt-and-stone',
    type: 'group',
    start_date: '2025-12-01',
    end_date: '2026-02-28',
    location: 'Main Gallery',
    description: 'A group exhibition examining the intersection of natural materials and contemporary process — stone carving, salt crystallization, mineral pigments, and earth-based sculpture.',
    status: 'past',
    featured: false,
    artists: 'Group Exhibition',
    color: '#e8e0d4',
  },
  {
    id: '5',
    title: 'Coastal Contemporary 2025',
    slug: 'coastal-contemporary-2025',
    type: 'fair',
    start_date: '2025-10-18',
    end_date: '2025-10-21',
    location: 'Chelsea Industrial, New York',
    description: 'Inaugural presentation at Coastal Contemporary art fair, featuring paintings by Elena Marsh and sculpture by Julian Cole.',
    status: 'past',
    featured: false,
    artists: 'Elena Marsh, Julian Cole',
    color: '#D4E4F0',
  },
  {
    id: '6',
    title: 'Perpetual Bloom',
    slug: 'perpetual-bloom',
    type: 'solo',
    start_date: '2025-06-15',
    end_date: '2025-09-30',
    location: 'Main Gallery',
    description: 'Elena Marsh presents a suite of large-scale oil paintings inspired by the garden landscapes of the central Jersey Shore — color saturated, layered, hovering between representation and abstraction.',
    status: 'past',
    featured: false,
    artists: 'Elena Marsh',
    color: '#d4ece8',
  },
  {
    id: '7',
    title: 'Material Witness',
    slug: 'material-witness',
    type: 'group',
    start_date: '2025-03-01',
    end_date: '2025-05-31',
    location: 'Main Gallery',
    description: 'Five artists working in wood, clay, glass, and fiber — each material carrying its own memory, each process a form of testimony.',
    status: 'past',
    featured: false,
    artists: 'Group Exhibition',
    color: '#e8d8d4',
  },
  {
    id: '8',
    title: 'Opening Exhibition',
    slug: 'opening-exhibition',
    type: 'group',
    start_date: '2024-10-01',
    end_date: '2024-12-31',
    location: 'Main Gallery',
    description: 'The inaugural exhibition introducing the gallery program and its founding roster of artists to the community.',
    status: 'past',
    featured: false,
    artists: 'Gallery Artists',
    color: '#ddd8e8',
  },
]

/** @type {Artist[]} */
export const ARTISTS = [
  { id: '1', name: 'Elena Marsh', slug: 'elena-marsh', medium: 'Painting, Mixed Media', location: 'Brooklyn, NY', born: 1988, instagram: '@elenamarsh.studio', website: 'elenamarsh.com', bio: 'Layered oil and beeswax paintings exploring coastal light and seasonal color shifts.', featured: true, onView: true, color: '#d4ece8' },
  { id: '2', name: 'Julian Cole', slug: 'julian-cole', medium: 'Sculpture', location: 'Hudson Valley, NY', born: 1982, instagram: '@juliancole.art', website: 'juliancole.com', bio: 'Carved wood and stone forms evoking driftwood, bone, and geological strata.', featured: true, onView: true, color: '#e8e0d4' },
  { id: '3', name: 'Nora Whitfield', slug: 'nora-whitfield', medium: 'Ceramics, Mixed Media', location: 'Asbury Park, NJ', born: 1991, instagram: '@norawhitfield', website: 'norawhitfield.com', bio: 'Hand-built ceramic vessels and wall works informed by marine biology and tide patterns.', featured: true, onView: false, color: '#d8dce8' },
  { id: '4', name: 'Marcus Hale', slug: 'marcus-hale', medium: 'Photography', location: 'Philadelphia, PA', born: 1979, instagram: '@marcushale', bio: 'Large-format photographs of post-industrial landscapes and reclaimed urban spaces.', featured: false, onView: false, color: '#e8d8d4' },
  { id: '5', name: 'Ada Belmont', slug: 'ada-belmont', medium: 'Oil on Canvas', location: 'Santa Fe, NM', born: 1985, instagram: '@adabelmont', website: 'adabelmont.com', bio: 'Luminous desert landscapes rendered in thin, translucent glazes.', featured: false, onView: false, color: '#ddd8e8' },
  { id: '6', name: 'Brian Callas', slug: 'brian-callas', medium: 'Printmaking', location: 'Chicago, IL', born: 1984, instagram: '@briancallas', website: 'briancallas.com', bio: 'Large-scale woodblock prints combining architectural geometry with organic pattern.', featured: false, onView: false, color: '#d4e4f0' },
  { id: '7', name: 'Carmen Díaz', slug: 'carmen-diaz', medium: 'Installation', location: 'Miami, FL', born: 1990, instagram: '@carmendiaz.art', website: 'carmendiaz.art', bio: 'Immersive light and textile installations exploring diaspora and memory.', featured: false, onView: false, color: '#e4d8d0' },
  { id: '8', name: 'David Enright', slug: 'david-enright', medium: 'Watercolor', location: 'Portland, OR', born: 1976, instagram: '@davidenright', website: 'davidenright.com', bio: 'Atmospheric watercolors of Pacific Northwest forests and waterways.', featured: false, onView: false, color: '#d0dce4' },
  { id: '9', name: 'Fiona Garrett', slug: 'fiona-garrett', medium: 'Collage, Works on Paper', location: 'Boston, MA', born: 1987, instagram: '@fionagarrett', website: 'fionagarrett.com', bio: 'Intricate paper collages sourced from vintage botanical and scientific illustrations.', featured: false, onView: false, color: '#e0d4dc' },
  { id: '10', name: 'George Harmon', slug: 'george-harmon', medium: 'Bronze Sculpture', location: 'New Haven, CT', born: 1973, instagram: '@georgeharmon.sculpture', website: 'georgeharmon.com', bio: 'Figurative bronze works negotiating classical form and contemporary gesture.', featured: false, onView: false, color: '#d8e4d4' },
  { id: '11', name: 'Ingrid Johansson', slug: 'ingrid-johansson', medium: 'Textile, Fiber Art', location: 'Minneapolis, MN', born: 1986, instagram: '@ingridjohansson', website: 'ingridjohansson.com', bio: 'Monumental woven works bridging Scandinavian craft traditions and abstract painting.', featured: false, onView: false, color: '#e8dce0' },
  { id: '12', name: 'James Kim', slug: 'james-kim', medium: 'Digital Media', location: 'Los Angeles, CA', born: 1993, instagram: '@jameskim.digital', website: 'jameskim.art', bio: 'Generative digital compositions examining the aesthetics of data and information flow.', featured: false, onView: false, color: '#d4d8ec' },
  { id: '13', name: 'Katherine Lowe', slug: 'katherine-lowe', medium: 'Encaustic', location: 'Savannah, GA', born: 1980, instagram: '@katherinelowe', website: 'katherinelowe.com', bio: 'Encaustic paintings with embedded materials exploring memory and material history.', featured: false, onView: false, color: '#e4e0d4' },
  { id: '14', name: 'Leo Marchetti', slug: 'leo-marchetti', medium: 'Oil on Linen', location: 'Providence, RI', born: 1981, instagram: '@leomarchetti', website: 'leomarchetti.com', bio: 'Intimate still lifes painted from direct observation with quiet, deliberate attention.', featured: false, onView: false, color: '#d0e0d8' },
  { id: '15', name: 'Maya Novak', slug: 'maya-novak', medium: 'Glass', location: 'Seattle, WA', born: 1989, instagram: '@mayanovak.glass', website: 'mayanovak.com', bio: 'Blown and cast glass sculptures inspired by deep-sea organisms and bioluminescence.', featured: false, onView: false, color: '#dcd4e8' },
  { id: '16', name: 'Oscar Park', slug: 'oscar-park', medium: 'Acrylic, Spray Paint', location: 'Detroit, MI', born: 1994, instagram: '@oscarpark', website: 'oscarpark.com', bio: 'High-energy canvases merging street art vocabulary with abstract expressionist gesture.', featured: false, onView: false, color: '#e8d4d8' },
  { id: '17', name: 'Patricia Quinn', slug: 'patricia-quinn', medium: 'Stone Carving', location: 'Tucson, AZ', born: 1975, instagram: '@patriciaquinn.stone', website: 'patriciaquinn.com', bio: 'Direct-carved stone works drawing from Sonoran desert geology and ancient landforms.', featured: false, onView: false, color: '#d4e8dc' },
  { id: '18', name: 'Rafael Santos', slug: 'rafael-santos', medium: 'Photography, Video', location: 'Austin, TX', born: 1988, instagram: '@rafaelsantos', website: 'rafaelsantos.com', bio: 'Documentary photography and short films focused on borderland communities.', featured: false, onView: false, color: '#e0d8e4' },
  { id: '19', name: 'Sonia Tan', slug: 'sonia-tan', medium: 'Ink on Rice Paper', location: 'San Francisco, CA', born: 1983, instagram: '@soniatan.ink', website: 'soniatan.com', bio: 'Contemporary ink paintings reinterpreting classical Chinese landscape traditions.', featured: false, onView: false, color: '#d8e0d4' },
  { id: '20', name: 'Thomas Underwood', slug: 'thomas-underwood', medium: 'Assemblage', location: 'Baltimore, MD', born: 1977, instagram: '@thomasunderwood', website: 'thomasunderwood.art', bio: 'Sculptural assemblages from salvaged industrial materials and domestic objects.', featured: false, onView: false, color: '#e4dcd0' },
  { id: '21', name: 'Uma Vasquez', slug: 'uma-vasquez', medium: 'Painting, Sculpture', location: 'Denver, CO', born: 1992, instagram: '@umavasquez', website: 'umavasquez.com', bio: 'Cross-disciplinary works investigating color, weight, and bodily presence.', featured: false, onView: false, color: '#d0d8e8' },
  { id: '22', name: 'Victor Wells', slug: 'victor-wells', medium: 'Gouache', location: 'Nashville, TN', born: 1986, instagram: '@victorwells', website: 'victorwells.com', bio: 'Small-scale gouache paintings of vernacular architecture and rural interiors.', featured: false, onView: false, color: '#e8e4d4' },
  { id: '23', name: 'Wendy Xu', slug: 'wendy-xu', medium: 'Ceramics', location: 'Richmond, VA', born: 1991, instagram: '@wendyxu.ceramics', website: 'wendyxu.com', bio: 'Wheel-thrown and altered vessels exploring asymmetry, glaze chemistry, and chance.', featured: false, onView: false, color: '#d4dce0' },
  { id: '24', name: 'Xavier Young', slug: 'xavier-young', medium: 'Mixed Media', location: 'Atlanta, GA', born: 1990, instagram: '@xavieryoung.art', website: 'xavieryoung.art', bio: 'Layered mixed-media works on panel addressing Black Southern identity and landscape.', featured: false, onView: false, color: '#dce0d8' },
  { id: '25', name: 'Yara Zaman', slug: 'yara-zaman', medium: 'Tapestry', location: 'Pittsburgh, PA', born: 1987, instagram: '@yarazaman', website: 'yarazaman.com', bio: 'Hand-woven tapestries translating digital imagery into textile form.', featured: false, onView: false, color: '#e0d4d8' },
  { id: '26', name: 'Anna Frost', slug: 'anna-frost', medium: 'Monotype', location: 'Burlington, VT', born: 1984, instagram: '@annafrost.prints', website: 'annafrost.com', bio: 'One-of-a-kind monotypes capturing fleeting atmospheric conditions in the Green Mountains.', featured: false, onView: false, color: '#d8d4e0' },
  { id: '27', name: 'Charles Dunn', slug: 'charles-dunn', medium: 'Oil on Panel', location: 'Kansas City, MO', born: 1978, instagram: '@charlesdunn', website: 'charlesdunn.com', bio: 'Tightly rendered figurative paintings drawn from historical photography and found archives.', featured: false, onView: false, color: '#e4d4dc' },
  { id: '28', name: 'Diana Ellis', slug: 'diana-ellis', medium: 'Woodcut', location: 'Asheville, NC', born: 1982, instagram: '@dianaellis.woodcut', website: 'dianaellis.com', bio: 'Large-format reduction woodcuts depicting Appalachian flora at monumental scale.', featured: false, onView: false, color: '#d4e0e4' },
  { id: '29', name: 'Elliot Farrow', slug: 'elliot-farrow', medium: 'Resin, Found Objects', location: 'Marfa, TX', born: 1985, instagram: '@elliotfarrow', website: 'elliotfarrow.com', bio: 'Desert-sourced objects embedded in clear resin, suspending time and place.', featured: false, onView: false, color: '#e0e4d4' },
  { id: '30', name: 'Grace Hayward', slug: 'grace-hayward', medium: 'Pastel on Paper', location: 'Beacon, NY', born: 1993, instagram: '@gracehayward', website: 'gracehayward.com', bio: 'Soft pastel drawings of Hudson Valley light rendered at architectural scale.', featured: false, onView: false, color: '#d8e4e0' },
  { id: '31', name: 'Henry Ito', slug: 'henry-ito', medium: 'Lacquer, Wood', location: 'Portland, ME', born: 1980, instagram: '@henryito', website: 'henryito.com', bio: 'Urushi lacquer and carved wood objects informed by Japanese joinery and minimalism.', featured: false, onView: false, color: '#e4d8e0' },
  { id: '32', name: 'Isabelle Laurent', slug: 'isabelle-laurent', medium: 'Charcoal, Graphite', location: 'New Orleans, LA', born: 1989, instagram: '@isabellelaurent', website: 'isabellelaurent.com', bio: 'Large-scale charcoal drawings of Southern Gothic interiors and overgrown gardens.', featured: false, onView: false, color: '#dce4d8' },
]

export const TYPE_LABELS = {
  solo: 'Solo',
  group: 'Group',
  fair: 'Art Fair',
  offsite: 'Offsite',
  auction: 'Auction',
}
