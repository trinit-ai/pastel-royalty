/**
 * Private Views — unlisted, per-collector viewing rooms.
 *
 * Each entry is keyed by its token, which is the only thing standing between
 * the public and the page. Tokens should be long and unguessable in production
 * (see getPrivateView below) — these demo ones are readable on purpose.
 *
 * A private view is not a public exhibition page. The differences that matter:
 *   - prices are shown
 *   - the selection is for one person, and says so
 *   - the dealer can attach a private note to the view and to each work
 *   - it expires
 *
 * In production this comes from the `private_views` table rather than here;
 * the shape is the same, so the page does not change.
 */

export const PRIVATE_VIEWS = {
  'harding-autumn-2026': {
    token: 'harding-autumn-2026',
    title: 'Flowers, Cells, and the Golden Spiral',
    subtitle: 'A private selection',
    collector: 'Ms. Harding',
    preparedBy: 'Caitlin Kelly-McKenna',
    preparedByRole: 'Director',
    preparedOn: '2026-09-23',
    expiresOn: '2026-10-21',
    currency: 'USD',

    note:
      'Dear Ms. Harding,\n\n' +
      'After our conversation about the Spira Mirabilis works, I have set aside six pieces I think sit well together — the two large honeycombs you responded to, and four smaller works on panel that carry the same logic at a different scale.\n\n' +
      'The Camellias panel is the one I would encourage you to see in person. It photographs flat, and it is not.',

    closing:
      'These are held for you through the date above. Nothing here is committed, and nothing is shown to anyone else while your view is open.',

    contact: {
      name: 'Caitlin Kelly-McKenna',
      role: 'Director',
      email: 'caitlin@kellymckennagallery.com',
      phone: '+1 (732) 449-0001',
    },

    works: [
      {
        id: 'w1',
        title: 'Honeycomb XI',
        artist: 'Rob Ventura',
        year: 2026,
        medium: 'Oil on canvas',
        dimensions: '72 × 72 in',
        width_in: 72,
        height_in: 72,
        price: 28000,
        status: 'available',
        color: '#E8A030',
        note: 'The one from the back wall at Spira Mirabilis.',
      },
      {
        id: 'w2',
        title: 'Camellias I',
        artist: 'Rob Ventura',
        year: 2026,
        medium: 'Oil and beeswax on panel',
        dimensions: '48 × 36 in',
        width_in: 48,
        height_in: 36,
        price: 16500,
        status: 'available',
        color: '#2A8AA8',
        note: 'See this one in person if you can.',
      },
      {
        id: 'w3',
        title: 'Pollination Study (Diptych)',
        artist: 'Rob Ventura',
        year: 2025,
        medium: 'Gouache on panel',
        dimensions: '96 × 42 in',
        width_in: 96,
        height_in: 42,
        price: 22000,
        status: 'on_hold',
        color: '#C4402A',
        note: 'On hold until the 28th — I will know by then.',
      },
      {
        id: 'w4',
        title: 'Microbiological VII',
        artist: 'Rob Ventura',
        year: 2025,
        medium: 'Charcoal on paper',
        dimensions: '30 × 22 in',
        width_in: 30,
        height_in: 22,
        price: 6800,
        status: 'available',
        color: '#7A7670',
      },
      {
        id: 'w5',
        title: 'Spiral Vessel',
        artist: 'Rob Ventura',
        year: 2024,
        medium: 'Glazed stoneware',
        dimensions: '18 × 11 × 11 in',
        width_in: 11,
        height_in: 18,
        price: 4200,
        status: 'available',
        color: '#C4D2C0',
      },
      {
        id: 'w6',
        title: 'False Indigo',
        artist: 'Rob Ventura',
        year: 2024,
        medium: 'Oil on linen',
        dimensions: '60 × 48 in',
        width_in: 60,
        height_in: 48,
        price: 19000,
        status: 'sold',
        color: '#3A5A8C',
        note: 'Sold last week — leaving it here so you can see the scale.',
      },
    ],
  },
}

/**
 * Look up a view by token. Returns null for unknown tokens so the page can
 * render a neutral "not available" state rather than leaking whether a token
 * ever existed.
 */
export function getPrivateView(token) {
  if (!token) return null
  return PRIVATE_VIEWS[token] ?? null
}

/** A view is expired once its expiresOn date has passed. */
export function isExpired(view, now = new Date()) {
  if (!view?.expiresOn) return false
  const end = new Date(`${view.expiresOn}T23:59:59`)
  return now > end
}

export const STATUS_LABELS = {
  available: 'Available',
  on_hold: 'On Hold',
  reserved: 'Reserved',
  sold: 'Sold',
  nfs: 'Not for Sale',
}

/** Price formatting. Works marked sold/nfs never show a number. */
export function formatPrice(work, currency = 'USD') {
  if (!work) return ''
  if (work.status === 'nfs') return 'Not for sale'
  if (work.status === 'sold') return 'Sold'
  if (work.price == null) return 'Price on request'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(work.price)
}
