# Pastel Royalty

Gallery-grade website OS by TMOS13, LLC.

A premium, white-label gallery operating system — not a template, a collection. Built for fine art galleries, art advisories, and curated programs that demand the same visual precision online as they do on the wall.

## Stack

- **Vite + React** — fast builds, modern DX
- **Supabase** — auth, database, storage, edge functions
- **Vercel** — deploy
- **Lenis** — smooth scroll
- **GSAP** — scroll-triggered animations
- **Resend** — transactional email (inquiry notifications)

## Dev Server

```bash
# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env

# Start dev server
npm run dev
```

Runs at `http://localhost:5173`

## Build

```bash
npm run build
npm run preview   # preview production build locally
```

## Project Structure

```
src/
  components/
    lightbox/          Premium image viewer — cinematic, progressive HD, integrated inquiry
    artwork/           GalleryImage — lazy load, blurhash, WebP/AVIF, zero CLS
    inquiry/           InquireForm — contextual, honeypot spam protection
    exhibition/        Exhibition display components
    layout/            Header, footer, navigation
    ui/                Shared primitives
  pages/               Route-level components
  hooks/
    useLightbox.js     Lightbox state provider (context)
  utils/
    imageProcessing.js Upload validation, size tiers, responsive srcSet
  lib/
    supabase.js        Client init
  styles/              Global styles, theme variables
  assets/              Static assets

supabase/
  migrations/          Database schema (artists, artworks, exhibitions, images, inquiries, contacts, page_content)
  functions/
    handle-inquiry/    Edge function — Resend email on new inquiry
```

## Database

Initial migration: `supabase/migrations/001_initial_schema.sql`

Tables: `artists`, `artworks`, `exhibitions`, `exhibition_artworks`, `exhibition_artists`, `images`, `inquiries`, `contacts`, `page_content`

All tables have RLS enabled. Public read on published content, authenticated write for admin. Inquiries and newsletter signups are open insert.

## Themes

Two proven theme directions:

- **Dark** — navy/gold, cinematic, exhibition-forward
- **Light** — white/pastel, airy, gallery-white with easter egg accents

Theme is configurable per deployment via CSS custom properties and `site_config`.

## Per-Client Deployment

Each gallery gets its own Supabase project + Vercel deployment. Customization lives in the database and env vars, not the code:

- `page_content` — all editable copy
- `.env` — Supabase credentials, gallery name, email
- Theme selection — config flag
- Brand colors, logo — `site_config` table

## Key Design Principles

1. **Director of Photography, not web designer** — every image is a moment, not a thumbnail
2. **Less is more** — high quality/impact images, fewer grids, perfect loads
3. **Every interaction considered** — hover states, transitions, scroll behavior, loading states
4. **The inquiry is the revenue moment** — contextual, minimal, integrated into the viewing experience
5. **Your IP stays yours** — database-driven, portable, no platform lock-in

---

TMOS13, LLC
