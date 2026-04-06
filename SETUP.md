# Pastel Royalty — Gallery OS

A gallery-grade website platform for fine art dealers. Built by TMOS13.

## Quick Start (Demo Mode)

No database required. The site runs entirely on demo data.

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`. Everything works — all pages, lightbox, inquiry modal, theming. The inquiry form falls back to clipboard copy when no database is configured.

---

## Features

### Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero with featured exhibition, ticker, exhibition cards, artist rows, services, visit info |
| `/exhibitions` | Exhibitions | Tabs (current/forthcoming/archive), filterable, linked to detail pages |
| `/exhibitions/:slug` | Exhibition Detail | Full-bleed hero, curatorial essay, installation carousel, selected works grid, artist cards |
| `/artists` | Artists | Two-column alphabetical roster with hover effects |
| `/artists/:slug` | Artist Detail | Full-height hero, selected works grid (lightbox-enabled), exhibition history with thumbnails |
| `/news` | News | Three-column card grid grouped by year — art fairs, events, publications, announcements |
| `/services` | Services | Service offerings with detail sections |
| `/about` | About | Split-pane editorial layout, quote section, contact grid |
| `/legal/:slug` | Legal | Privacy Policy, Terms of Use, Cookie Policy, Accessibility |
| `/private` | Private Portal | Unlinked auth gate — dark, no chrome, access code input, Supabase auth ready |
| `*` | 404 | Catch-all not found page |

### Lightbox

Full-view image lightbox with gallery-wall aesthetic:
- White parchment background with radial gradient
- Image centered in left pane, details panel on right (340px)
- Structured metadata fields (Year, Medium, Dimensions)
- Integrated inquiry button + inline InquireForm
- Navigation: click left/right halves of image, keyboard arrows, swipe on mobile
- Pinch-to-zoom on touch devices, double-click to zoom on desktop
- Nav arrows + counter pinned to bottom of details panel
- Gallery name watermark (desktop only)
- Mobile: image top half, details bottom half (50/50 split)
- Progressive image loading (display → full HD)

### Inquiry System

Global inquiry modal accessible from any page via `useInquire()` context:
- Triggered from: header, footer, exhibition detail, artist detail, services, visit section
- Pre-fills context ("Inquiring about *Still Life with Light*")
- With Supabase: saves to `inquiries` table, upserts `contacts`
- Without Supabase: copies formatted message to clipboard
- Lightbox has inline inquiry form (not modal)
- Honeypot spam protection (no CAPTCHA)

### Image Processing Pipeline

```bash
npm run images <input-dir> [output-dir]
```

- Sharp with Lanczos3 kernel — sharpest possible downscale
- Three WebP tiers: thumb (400px/85%), display (1600px/90%), full (3200px/92%)
- Never upscales — respects original dimensions
- Extracts dominant color for placeholder backgrounds
- Outputs metadata JSON per image (dimensions, aspect ratio, color, file sizes)
- Directory structure maps directly to Supabase Storage paths

### Theming

Dark and light themes via CSS custom properties:
- Toggle in header (desktop) and hamburger menu (mobile)
- Smooth crossfade transitions on all themed elements
- Both themes fully styled across all pages
- Variables in `src/styles/theme.css`

### Security

**Rate Limiting** (three layers):
- Client-side: localStorage tracks submissions, blocks after 5/hour
- Server-side: Supabase trigger rejects 5+ inserts per email per hour (`002_rate_limit.sql`)
- Defense in depth: client blocks first, server enforces

**Input Sanitization** (two layers):
- Client: strips HTML tags before submitting
- Edge function: escapes HTML entities in email templates (prevents stored XSS)

**Security Headers** (vercel.json):
- Content Security Policy (scripts, styles, images, connections locked down)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security (HSTS with preload)
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: blocks camera, mic, geolocation, payment

**Row-Level Security** (Supabase):
- Public read for published content (artists, artworks, exhibitions, images)
- Insert-only for inquiries and contacts (anyone can submit)
- Authenticated-only for reading inquiries/contacts and all writes

### Cookie Consent

- Inline notice on homepage: "This site uses essential cookies only."
- "Decline" stores `cookie_consent: declined` in localStorage — line disappears permanently
- No analytics loaded by default (consent by omission, GDPR compliant)
- Ready for "Accept" button to gate future analytics scripts

### Responsive Design

- Hamburger menu on mobile with serif nav links + gallery info (hours, location, phone, email)
- Desktop nav hidden on mobile
- All grids collapse: 4-col → 2-col → 1-col
- Hero images go full-bleed on mobile with overlay labels
- Tickers hidden on mobile (info in hamburger)
- Footer single column on mobile
- Newsletter form full-width, no iOS auto-zoom (16px font minimum)
- Sticky section headers disabled on mobile
- Lightbox: image top, details bottom (50/50)

### Social Sharing

- Open Graph meta tags (title, description, image)
- Twitter Card (summary_large_image)
- OG card: 1200x630 with gallery logo on white background

---

## Production Setup

### 1. Supabase

Create a new Supabase project at [supabase.com](https://supabase.com).

Run the migrations:

```bash
# Using Supabase CLI
supabase db push

# Or manually run in SQL editor:
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_rate_limit.sql
```

Schema includes: artists, artworks, exhibitions, images, inquiries, contacts, page_content. Full RLS policies, indexes, triggers, and convenience views.

### 2. Environment Variables

```bash
cp .env.example .env
```

Fill in Supabase project URL and anon key from Dashboard → Settings → API.

### 3. Deploy to Vercel

```bash
npm run build
vercel
```

Add env vars in Vercel project settings. Security headers apply automatically via `vercel.json`.

### 4. Image Processing

```bash
# Process images for upload
npm run images ./originals ./processed

# Output structure:
# processed/thumbs/{artist}/{artwork}.webp
# processed/display/{artist}/{artwork}.webp
# processed/full/{artist}/{artwork}.webp
# processed/meta/{artist}/{artwork}.json
```

Upload the `thumbs/`, `display/`, and `full/` directories to a public Supabase Storage bucket called `gallery`.

### 5. Email Notifications

The `supabase/functions/handle-inquiry/index.ts` edge function sends email notifications via Resend when new inquiries are submitted. Set these env vars in Supabase:

- `RESEND_API_KEY`
- `GALLERY_EMAIL`
- `GALLERY_FROM_EMAIL` (optional)

### 6. Private Portal

Navigate to `/private` (not linked anywhere on the site). With Supabase configured, create an admin user and use the access code to authenticate. Post-auth placeholder ready for admin dashboard.

---

## Customization

| What | Where |
|------|-------|
| Gallery name | `GALLERY_NAME` in `src/App.jsx` |
| Gallery email | `GALLERY_EMAIL` in `src/components/inquiry/InquireForm.jsx` |
| Theme colors | `src/styles/theme.css` (dark + light) |
| Fonts | Google Fonts import in `src/styles/global.css` |
| Demo data | `src/data/demo.js` (matches DB schema) |
| Logo | `public/logo-embossed.png` + hero contact card in `Home.jsx` |
| OG card | `public/og-card.png` (1200x630) |
| Favicon | `public/favicon.svg` |
| Legal copy | `src/pages/Legal.jsx` (gallery name, email, address) |
| Ticker items | `src/components/layout/Header.jsx` (TICKER_ITEMS array) |
| News feed | `src/pages/News.jsx` (FEED array) |

---

## Architecture

```
src/
├── components/
│   ├── artwork/        GalleryImage (lazy load, IntersectionObserver, progressive HD)
│   ├── inquiry/        InquireForm, InquireModal (global modal via useInquire)
│   ├── layout/         Header (hamburger menu), Footer, Newsletter
│   ├── lightbox/       Lightbox, LightboxDetails (full-view, white wall)
│   └── ui/             InstallCarousel, ScrollToTop, EndDivider
├── hooks/
│   ├── useInquire      Global inquiry modal state
│   ├── useLightbox     Global lightbox state
│   ├── useScrollReveal GSAP scroll-triggered animations
│   └── useSmoothScroll Lenis smooth scrolling
├── lib/                Supabase client (null-safe without env vars)
├── pages/              Home, Exhibitions, ExhibitionDetail, Artists, ArtistDetail,
│                       News, Services, About, Legal, Private, NotFound
├── styles/             global.css, theme.css
├── data/               demo.js (32 artists, 8 exhibitions, sample artworks)
└── utils/              imageProcessing.js (tiers, srcSet, validation, storage paths)

scripts/
└── process-images.js   Sharp pipeline — three-tier WebP with Lanczos3

supabase/
├── migrations/
│   ├── 001_initial_schema.sql   Tables, RLS, indexes, triggers, views
│   └── 002_rate_limit.sql       Inquiry rate limiting trigger
└── functions/
    └── handle-inquiry/          Email notification via Resend
```

## Tech Stack

- **Frontend**: React 19, Vite, React Router v7
- **Animation**: GSAP, Lenis (smooth scroll)
- **Backend**: Supabase (auth, Postgres, storage, edge functions)
- **Email**: Resend (transactional)
- **Images**: Sharp (processing), WebP (delivery)
- **Deploy**: Vercel
- **Security**: CSP headers, HSTS, RLS, rate limiting, input sanitization
