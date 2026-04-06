# Pastel Royalty — Gallery OS Setup Guide

## Quick Start (Demo Mode)

No database required. The site runs entirely on demo data.

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`. Everything works — exhibitions, artists, lightbox, legal pages. The inquiry form falls back to `mailto:` links.

## Production Setup

### 1. Supabase

Create a new Supabase project at [supabase.com](https://supabase.com).

Run the migration to set up the schema:

```bash
# Using Supabase CLI
supabase db push

# Or manually: copy the contents of supabase/migrations/001_initial_schema.sql
# into the Supabase SQL editor and run it.
```

This creates:
- **artists** — gallery roster
- **artworks** — works with status tracking (available/sold/NFS/on hold)
- **exhibitions** — current, upcoming, past with type classification
- **images** — multi-view image system with thumb/display/full tiers
- **inquiries** — form submissions with artwork/exhibition context
- **contacts** — mailing list + CRM with source tracking
- **page_content** — editable content without redeploy

Row-level security is pre-configured:
- Public can read artists, artworks, exhibitions, images
- Public can submit inquiries and subscribe (insert only)
- Only authenticated users can read inquiries/contacts or write any data

### 2. Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Fill in your Supabase project URL and anon key from your Supabase dashboard → Settings → API.

### 3. Deploy to Vercel

```bash
npm run build   # verify it builds
vercel           # deploy
```

Add your env vars in Vercel project settings → Environment Variables.

### 4. Supabase Storage (Images)

Create a public bucket called `gallery` in Supabase Storage.

Image path convention:
```
originals/{artistSlug}/{artworkSlug}/{filename}
display/{artistSlug}/{artworkSlug}/{artworkSlug}.webp    (1600px, 82% quality)
thumbs/{artistSlug}/{artworkSlug}/{artworkSlug}.webp     (400px, 75% quality)
full/{artistSlug}/{artworkSlug}/{artworkSlug}.webp       (3200px, 88% quality)
```

Image processing (thumb/display/full generation) can be handled by a Supabase Edge Function on upload, or offline via a build script.

### 5. Customization

**Gallery name & branding**: Update `GALLERY_NAME` in `src/App.jsx` and email references in `src/components/inquiry/InquireForm.jsx`.

**Theme colors**: Edit `src/styles/theme.css` — both dark and light themes use CSS custom properties.

**Fonts**: The site uses Cormorant Garamond (display) and DM Sans (UI), loaded from Google Fonts in `src/styles/global.css`.

**Demo data**: Replace `src/data/demo.js` with your gallery's real data, or connect to Supabase queries. The demo data matches the database schema exactly.

## Architecture

```
src/
├── components/
│   ├── artwork/        GalleryImage (lazy load, progressive HD)
│   ├── inquiry/        InquireForm (Supabase or mailto fallback)
│   ├── layout/         Header, Footer, Newsletter
│   ├── lightbox/       Full-view lightbox system
│   └── ui/             Carousel, ScrollToTop, EndDivider
├── hooks/              useLightbox, useScrollReveal, useSmoothScroll
├── lib/                Supabase client (null-safe)
├── pages/              All route-level components
├── styles/             Global CSS, theme variables
├── data/               Demo data (matches DB schema)
└── utils/              Image processing utilities
```

## Tech Stack

- React 19 + Vite
- React Router v7
- GSAP + Lenis (smooth scroll)
- Supabase (auth, database, storage, edge functions)
- Vercel (deploy)
