# Pastel Royalty — Architecture

A short tour of how this codebase is organized and the conventions to follow.

## File structure

```
src/
├── App.jsx                 # Routes, providers, AppShell pattern
├── main.jsx                # Entry point
├── pages/                  # One file per route
│   ├── Home.jsx
│   ├── home.css            # Co-located CSS — same name as the page
│   ├── Exhibitions.jsx
│   ├── ExhibitionDetail.jsx
│   ├── Artists.jsx
│   ├── ArtistDetail.jsx
│   ├── News.jsx / NewsDetail.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── Legal.jsx           # Slug-routed: /legal/:slug
│   ├── Private.jsx         # Unlinked auth portal at /private
│   └── NotFound.jsx
├── components/
│   ├── layout/             # Header, Footer, Newsletter
│   ├── lightbox/           # Lightbox + LightboxDetails
│   ├── inquiry/            # InquireModal + InquireForm
│   └── ui/                 # ScrollToTop, InstallCarousel
├── hooks/
│   ├── useLightbox.jsx     # Global lightbox context
│   ├── useInquire.jsx      # Global inquiry modal context
│   ├── useScrollReveal.js  # IntersectionObserver-based reveal-on-scroll
│   └── useSmoothScroll.js  # Lenis smooth scroll
├── data/
│   └── demo.js             # All artists, exhibitions, news as plain JS arrays
├── lib/
│   └── supabase.js         # Null-safe Supabase client
└── styles/
    ├── theme.css           # CSS custom properties (layout + color tokens)
    └── global.css          # Resets, typography, shared utilities
```

## Conventions

### Pages
- One JSX file per route. Co-located CSS file with matching name.
- Pages own their layout and import from `data/demo.js`.
- Section IDs match nav anchors (`#exhibitions`, `#artists`, `#about`, `#visit`).

### CSS
- **No CSS-in-JS, no Tailwind, no preprocessors.** Plain CSS only.
- Each page's CSS file is scoped by classname prefix (`exd-` for ExhibitionDetail, `atd-` for ArtistDetail, `news-` for News, etc.).
- Mobile overrides go in a single `@media (max-width: 768px)` block at the bottom of each file.
- **Inline styles in JSX are reserved for data-driven values only** (e.g. dynamic gradient colors from `artist.color`). Layout/spacing/typography belongs in CSS files.

### Layout tokens
Defined in `theme.css` under the `:root` block:
```css
--header-height: 72px;
--page-padding-x: 52px;
--page-padding-x-mobile: 24px;
--section-gap: 80px;
--section-gap-mobile: 48px;
```
Use these instead of hardcoding `72px`, `52px`, etc. If you change the header height, update this variable, not 8 different files.

### Color tokens
All semantic colors in `theme.css`. Two themes: `[data-theme="dark"]` (default) and `[data-theme="light"]`. Switching themes only swaps CSS variables — no JS, no re-render.

### Routing
React Router v7. SPA rewrites configured in `vercel.json` so direct URL access works in production.

### Global state
Two React Contexts:
- `useLightbox` — open/close lightbox with an array of items + active index
- `useInquire` — open the inquiry modal with optional artwork/exhibition context

These are wrapped in `AppShell` in `App.jsx`. The `/private` route bypasses both providers and renders without header/footer chrome.

### Data
Currently `data/demo.js` exports plain arrays. This is intentional — the app works without a backend.

If you wire up Supabase: the null-safe client in `lib/supabase.js` returns `null` when env vars are missing, and the inquiry form falls back to clipboard.

### Inquiry flow
Two paths:
1. **With Supabase**: form submits to `inquiries` table, rate-limited by DB trigger (5/hour per email).
2. **Without Supabase**: form copies a formatted message to clipboard so the user can paste into email.

Both paths use the same `InquireForm` component. No code changes needed to swap.

## Gotchas

### `overflow-x: hidden` is mobile-only
On desktop, `overflow-x: hidden` on `html`/`body` breaks `position: sticky` for section headers. The rule lives inside `@media (max-width: 768px)` in `global.css`. Don't move it out.

### Lenis smooth scroll
`useSmoothScroll` is mounted once in `AppShell`. If you ever add scroll-snap or scroll-to-anchor logic, use Lenis's API (`lenisInstance.scrollTo`) — not `window.scrollTo` — or the internal scroll position desyncs.

### Image sizes
There's no runtime image processing. Images go in `public/` as committed files. The `scripts/process-images.js` script can pre-process source images into the three-tier WebP pipeline (thumb/display/full) but it's not run automatically. If you accept user uploads in production, hook it up.

### CSP and rewrites
`vercel.json` defines:
- SPA rewrite: all routes except `/assets/*` rewrite to `/index.html`
- CSP, HSTS, frame-options, permissions-policy headers

If you add a new external asset host (CDN, font service, image source), update the CSP `connect-src` / `img-src` / `font-src` directives.

### The Private route
`/private` is unlinked from any nav. It renders bare (no header/footer/lightbox/inquiry providers) so the auth portal feels separate. To remove it: delete the page, the route in `App.jsx`, and the `pathname === '/private'` check in `AppShell`.

## Adding a new page

1. Create `src/pages/MyPage.jsx` and `src/pages/my-page.css`.
2. Import the CSS at the top of the JSX: `import './my-page.css'`.
3. Add a route in `App.jsx`: `<Route path="/my-page" element={<MyPage />} />`.
4. Add the nav link in `components/layout/Header.jsx` (`NAV_ITEMS` array).
5. If you want the page in the footer too: `components/layout/Footer.jsx`.

## Adding a new section to the homepage

1. Add a `<section className="section" id="my-section">...</section>` in `Home.jsx`.
2. Use the existing `.section-header`, `.eyebrow`, `.section-title`, `.section-divider` classes for consistency.
3. Add `<div className="reveal">...</div>` wrappers for scroll-triggered animations.
4. Add the nav anchor in `Header.jsx` if it should be linkable from the top nav.

## Theming

To customize for a new gallery:
1. Edit color tokens in `src/styles/theme.css` (`--ink`, `--cream`, `--gold`, `--accent-secondary`, etc.).
2. Update `GALLERY_NAME` in `App.jsx`.
3. Replace `public/hero-artwork.jpg`, `public/logo-embossed.png`, `public/favicon.svg`, `public/og-card.png`.
4. Edit `data/demo.js` with real artists, exhibitions, and news.
5. Update `public/index.html` meta tags (title, description, OG image).

## What this codebase is not

- **Not a CMS.** No admin interface. Content lives in `data/demo.js` or Supabase tables.
- **Not e-commerce.** No cart, no checkout. Inquiry-driven only.
- **Not multi-language.** English only.
- **Not SSR.** Pure SPA. SEO comes from meta tags + sitemap, not server-rendered pages.
