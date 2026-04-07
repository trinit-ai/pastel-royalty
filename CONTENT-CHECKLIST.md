# Content Checklist & Image Specs

A dual-audience reference:
- **Gallery owner / content uploader**: what to prepare for each page, image specs, file naming
- **Developer**: where each slot lives in code, which data fields drive it, what's wired up vs. placeholder

Print the relevant sections, check items off as you populate the site, and use the developer notes when wiring real content into the data layer.

---

## Image specs at a glance

| Slot | Aspect ratio | Min long edge | Format | Notes |
|---|---|---|---|---|
| Homepage hero | Any (cropped to fill) | 3000px | JPG/WebP | Cropped to a detail at 1.5× scale, center-top anchor. Use texture-rich, color-rich source. |
| Artist hero (detail bleed) | Any (cropped to fill) | 3000px | JPG/WebP | Same crop logic as homepage. One per artist. |
| Exhibition hero (detail bleed) | Any (cropped to fill) | 3000px | JPG/WebP | One per exhibition. Use a hero work from the show. |
| Featured work cards | 4:5 portrait *or* 1:1 square | 1600px | JPG/WebP | Eight per artist/exhibition. Mixed orientations OK — grid handles both. |
| Installation views | 16:9 or 3:2 landscape | 2400px | JPG/WebP | 5–10 per exhibition. Wide-angle, well-lit, consistent perspective. |
| Press logos | SVG preferred, or PNG transparent | 200×80 | SVG/PNG | Optional — used in press strip if added later. |
| OG sharing card | 1200×630 exact | 1200px | PNG/JPG | Solid background (no transparency). Goes in `public/og-card.png`. |
| Embossed gallery logo | Transparent background | 400px wide | PNG | Goes in `public/logo-embossed.png`. Shown in hero contact card. |
| Favicon | 1:1 | 32×32 baseline | SVG | Goes in `public/favicon.svg`. |

**Total file size budget:** keep each image under 500KB after optimization. Run `npm run check-images` to audit.

---

## Exhibition Detail page

> **Developer:** `src/pages/ExhibitionDetail.jsx` + `src/pages/exhibition-detail.css`
> Data source: `src/data/demo.js` → `EXHIBITIONS` array, looked up by `slug` from URL
> Type definition: `Exhibition` typedef at top of `demo.js`

### Required content
- [ ] **Title** — exhibition name → `title`
- [ ] **Slug** — URL-safe (lowercase, hyphens) → `slug`
- [ ] **Type** — solo, group, or fair → `type`
- [ ] **Dates** — start and end (ISO format `YYYY-MM-DD`) → `start_date`, `end_date`
- [ ] **Location** — venue or "Main Gallery" → `location`
- [ ] **Artists** — list of artists (display string, e.g. "Elena Marsh & Julian Cole") → `artists`
- [ ] **Artist IDs** — references to ARTISTS[].id → `artistIds` (array of strings)
- [ ] **Description** — 1–3 sentence summary for cards/previews → `description`
- [ ] **Essay** — long-form curatorial text (3–6 paragraphs) → `essay` (use `\n\n` for breaks)
- [ ] **Pull quote** — featured quote from artist or curator → `pullQuote`
- [ ] **Opening details** — reception date/time → `opening`
- [ ] **Status** — current, forthcoming, or past → `status`

### Image slots
- [ ] **Hero detail image** — 3000px+ on long edge, will be cropped full-bleed
  - Currently: placeholder gradient using `exhibition.color`
  - To wire real image: add `heroImage` field to data, update `<div className="exd-hero-image" style={...}>` to render an `<img>` like the homepage hero
- [ ] **8 featured works**
  - 4:5 portrait or 1:1 square preferred
  - 1600px+ on long edge
  - Title, year, medium, dimensions for each
  - Optional: status (available / sold / NFS / on hold)
  - Currently: 8 generated placeholder works in `getWorks()` function inside `ExhibitionDetail.jsx`
  - To wire real works: replace `getWorks()` with a lookup from a new `ARTWORKS` array in `demo.js` filtered by exhibition ID
- [ ] **5–10 installation views**
  - 16:9 or 3:2 landscape
  - 2400px+ on long edge
  - Component: `src/components/ui/InstallCarousel.jsx`
  - Carousel auto-fits — keep aspect ratios consistent within a single show
  - Currently: 5 placeholder gradient slides
  - To wire real images: pass an array of image URLs as the `images` prop to `<InstallCarousel>`
  - Tip: shoot with same lens, same height, similar lighting for visual cohesion

### Document slots
- [ ] **Press release PDF** — single document, ≤2MB recommended
  - Naming convention: `press-release-{slug}.pdf` in `public/pdfs/`
  - Currently: button at top of detail page renders `<a href="#" className="btn btn-gold">Press Release ↓</a>`
  - To wire: replace `href="#"` with `href={`/pdfs/press-release-${slug}.pdf`}` and add `download` attribute
- [ ] **Checklist PDF** — single document with works list, prices, dimensions
  - Naming convention: `checklist-{slug}.pdf` in `public/pdfs/`
  - Currently: button rendered as `<a href="#" className="btn btn-outline">Checklist ↓</a>`
  - To wire: same pattern as press release
  - Optional: add `pressReleasePdf` and `checklistPdf` fields to `Exhibition` typedef so each show can specify its own paths

---

## Artist Detail page

> **Developer:** `src/pages/ArtistDetail.jsx` + `src/pages/artist-detail.css`
> Data source: `src/data/demo.js` → `ARTISTS` array, looked up by `slug` from URL
> Type definition: `Artist` typedef at top of `demo.js`

### Required content
- [ ] **Name** — full name → `name`
- [ ] **Slug** — URL-safe → `slug`
- [ ] **Medium** — primary medium(s) → `medium`
- [ ] **Location** — city, state → `location`
- [ ] **Born** — birth year → `born`
- [ ] **Bio** — 2–4 sentences (artist statement-adjacent) → `bio`
- [ ] **Instagram handle** — optional, with `@` → `instagram`
- [ ] **Website** — optional, domain only → `website`

### Image slots
- [ ] **Hero detail image** — 3000px+ on long edge, full-bleed crop
  - One representative work, texture-rich
  - Same aesthetic logic as homepage hero
  - Currently: all artists share `/hero-artwork.jpg` as a placeholder
  - To wire per-artist: add `heroImage` field to `Artist` typedef, then in `ArtistDetail.jsx` change the `<img src="/hero-artwork.jpg" ...>` to `<img src={artist.heroImage || '/hero-artwork.jpg'} ...>`
- [ ] **8 featured works**
  - 4:5 portrait or 1:1 square preferred
  - 1600px+ on long edge
  - Title, year, medium, dimensions, optional status
  - Currently: 8 generated placeholder works in `getWorks()` function inside `ArtistDetail.jsx`
  - To wire real works: replace `getWorks()` with a lookup from `ARTWORKS` array filtered by artist ID

### Document & link slots
- [ ] **CV PDF** — single document
  - Naming: `cv-{slug}.pdf` in `public/pdfs/`
  - Standard artist CV format (education, exhibitions, collections, press)
  - Currently: button rendered as `<a href="#" className="btn btn-gold">Download CV ↓</a>`
  - To wire: replace `href="#"` with `href={`/pdfs/cv-${artist.slug}.pdf`}` and add `download` attribute
  - Optional: add `cvPdf` field to `Artist` typedef
- [ ] **3 press links** — links to articles/reviews/features
  - External URLs OK
  - Format: title — publication, year
  - Example: *Coastal Light: A Painter's Vow* — Modern Painters, 2025
  - Currently: 3 placeholder press items hardcoded in `ArtistDetail.jsx` (`atd-hero-press` block)
  - To wire: add `pressLinks` array to `Artist` typedef → `[{ title, publication, year, url }]`, then map over it instead of the hardcoded items

---

## Homepage

> **Developer:** `src/pages/Home.jsx` + `src/pages/home.css`

### Required content
- [ ] **Hero exhibition** — current exhibition reference (auto-pulled from `EXHIBITIONS` data → first item with `featured: true` or `status: 'current'`)
- [ ] **Featured exhibitions** — first 3 from the data file (auto-selected via `FEATURED_EXHIBITIONS`)
- [ ] **Featured artists** — first 4 from the data file (auto-selected via `FEATURED_ARTISTS`)
- [ ] **Services copy** — 3 cards (Consultations, Appraisals, Art Advisory) — currently hardcoded in JSX
- [ ] **Visit info** — address, hours, contact, Instagram — currently hardcoded in JSX (`#visit` section)

### Image slots
- [ ] **Hero detail image** — `public/hero-artwork.jpg`, 3000px+ long edge
  - Most important image on the site
  - Pick one with rich texture, color, and visual interest
  - Will be cropped center-top at 1.5× scale (controlled by `.hero-artwork-img` transform in `home.css`)
  - Adjust the `transform: scale(1.5) translateY(-15%)` if your image needs a different crop region
  - Preloaded via `<link rel="preload">` in `index.html`

---

## News page

### Per news item
- [ ] **Date** — display string (e.g. "March 20–23")
- [ ] **Title** — headline
- [ ] **Body** — 1–3 sentences
- [ ] **Tag** — Art Fair / Publication / Event / Announcement / Exhibition
- [ ] **Year** — for grouping (or "Forthcoming")
- [ ] **Optional href** — external URL or internal page link
- [ ] **Color** — hex for placeholder gradient (until real images are added)

News items currently use color gradients. To add per-item images:
- Aspect ratio: 16:9 landscape
- Long edge: 1600px

---

## About page

- [ ] Gallery story / mission (3–5 paragraphs)
- [ ] Quote (italicized callout)
- [ ] Optional: gallery interior or director portrait image (16:9 landscape, 2400px)

---

## Services page

- [ ] Three services with detailed descriptions
- [ ] Optional: 3 banner images (16:9 landscape, 2400px) — currently uses solid color placeholders

---

## File organization

Recommended `public/` structure once you populate real content:

```
public/
├── hero-artwork.jpg              # Homepage hero
├── og-card.png                   # Social sharing
├── logo-embossed.png             # Hero contact card
├── favicon.svg
├── pdfs/
│   ├── press-release-still-life-with-light.pdf
│   ├── checklist-still-life-with-light.pdf
│   ├── cv-elena-marsh.pdf
│   └── cv-julian-cole.pdf
├── exhibitions/
│   └── still-life-with-light/
│       ├── hero.jpg              # Detail bleed
│       ├── installation-01.jpg
│       ├── installation-02.jpg
│       ├── ...
│       └── works/
│           ├── 01.jpg
│           ├── 02.jpg
│           └── ...
└── artists/
    └── elena-marsh/
        ├── hero.jpg              # Detail bleed
        └── works/
            ├── 01.jpg
            └── ...
```

This structure isn't enforced by the code — it's just recommended for organization. The data files reference images by path, so you can use any structure you like.

---

## Image preparation workflow

1. Start from highest-resolution source (master files, RAW exports, original photography)
2. Crop and color-correct in your tool of choice
3. Export each image at the recommended long edge above
4. Drop into `public/` (or run through `npm run images` if you want the three-tier WebP pipeline)
5. Run `npm run check-images` to verify nothing exceeds 500KB
6. Update the relevant data file (`src/data/demo.js`) or page component to reference the new image
7. Commit and push

---

## Quick reference: aspect ratios in plain English

- **4:5 portrait** — taller than wide (like a magazine cover). Best for vertical paintings, drawings, single sculptural pieces.
- **1:1 square** — equal sides. Best for centered compositions, mixed-medium works, balanced compositions.
- **3:2 landscape** — classic photo aspect (35mm). Best for installation views, wide paintings.
- **16:9 landscape** — widescreen. Best for installation shots, gallery interiors, banner images.

The site is designed to handle mixed orientations gracefully — you don't need to force everything into one shape. But within a single grid (e.g. an exhibition's 8 featured works), keeping orientations consistent looks more polished than mixing freely.

---

## Developer wiring summary

What's currently placeholder vs. what's already wired up. Use this as a TODO list when migrating to real content.

### Already wired (data-driven)
- Exhibition title, dates, location, description, essay, pull quote, opening, status, artists string
- Artist name, slug, medium, location, bio, born, instagram, website
- Featured exhibitions on homepage (auto-pulled from `EXHIBITIONS`)
- Featured artists on homepage (auto-pulled from `ARTISTS`)
- News items (driven by `FEED` array in `News.jsx`)
- Routing (`/exhibitions/:slug`, `/artists/:slug`, `/news/:slug`, `/legal/:slug`)
- Inquiry form pre-fill (artwork, exhibition, artist context modes)

### Currently placeholder — needs wiring per gallery
| Slot | Where to fix | Approach |
|---|---|---|
| Exhibition hero image | `ExhibitionDetail.jsx` `.exd-hero-image` div | Add `heroImage` to `Exhibition` typedef, render `<img>` |
| Exhibition featured works | `getWorks()` in `ExhibitionDetail.jsx` | Replace with lookup from new `ARTWORKS` array |
| Exhibition installation views | `<InstallCarousel>` in `ExhibitionDetail.jsx` | Pass `images` prop array |
| Press release PDF link | `<a href="#">Press Release ↓</a>` in `ExhibitionDetail.jsx` | Set `href` to `/pdfs/press-release-${slug}.pdf` |
| Checklist PDF link | `<a href="#">Checklist ↓</a>` in `ExhibitionDetail.jsx` | Set `href` to `/pdfs/checklist-${slug}.pdf` |
| Artist hero image | `<img src="/hero-artwork.jpg" />` in `ArtistDetail.jsx` | Use `artist.heroImage` field |
| Artist featured works | `getWorks()` in `ArtistDetail.jsx` | Replace with `ARTWORKS` lookup |
| Artist CV PDF link | `<a href="#">Download CV ↓</a>` in `ArtistDetail.jsx` | Set `href` to `/pdfs/cv-${artist.slug}.pdf` |
| Artist press links | Hardcoded `<a>` tags in `atd-hero-press` block | Map over `artist.pressLinks` array |
| Services page banner images | `<div>` placeholders in `Services.jsx` | Add `heroImage` to each service object |
| About page interior photo | None — not yet a slot | Add `<img>` to About.jsx if desired |

### To enable a new ARTWORKS data layer

The cleanest path to wire real artworks across the site:

1. Add `Artwork` typedef to `src/data/demo.js` (already documented in JSDoc)
2. Create an `ARTWORKS` array in `demo.js` with `id`, `title`, `artistId`, `exhibitionId`, `year`, `medium`, `dimensions`, `imageUrl`, `status`, `color`
3. In `ArtistDetail.jsx`, replace `getWorks(artist)` with `ARTWORKS.filter(w => w.artistId === artist.id)`
4. In `ExhibitionDetail.jsx`, replace `getWorks(exhibition)` with `ARTWORKS.filter(w => w.exhibitionId === exhibition.id)`
5. The lightbox already accepts artwork records that match this shape, so no further wiring is needed there
6. Update tests in `src/test/` to seed test data if needed

### File path conventions to adopt

When you start uploading real assets, use these paths so a single regex find-and-replace can update everything:

- Exhibition hero: `/images/exhibitions/{slug}/hero.jpg`
- Exhibition install carousel: `/images/exhibitions/{slug}/installation-{n}.jpg`
- Exhibition works: `/images/exhibitions/{slug}/works/{n}.jpg`
- Artist hero: `/images/artists/{slug}/hero.jpg`
- Artist works: `/images/artists/{slug}/works/{n}.jpg`
- PDFs: `/pdfs/{kind}-{slug}.pdf` (e.g., `/pdfs/cv-elena-marsh.pdf`, `/pdfs/press-release-still-life-with-light.pdf`)
