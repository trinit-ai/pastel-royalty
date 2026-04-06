# Pastel Royalty — Skills & Capabilities

## What This System Does

### Gallery Frontend
- Responsive, scroll-animated gallery website with light/dark theme support
- Sticky section headers, smooth Lenis scroll, GSAP reveal animations
- Full-bleed hero with current exhibition, artwork label, integrated newsletter
- Exhibition cards (imagistic) with "On View" badges
- Artist roster with thumbnail rows, "On View" status, "View Full Roster" drill-down
- Services/advisory section with pastel cards
- Visit + About split pane
- Newsletter strip
- Full footer with navigation, legal, connect columns

### Image System
- Three-tier image pipeline: thumb (400px), display (1600px), full (3200px)
- WebP/AVIF generation with JPEG fallback
- BlurHash / LQIP placeholders — beautiful color blur while loading
- Lazy loading via Intersection Observer with 200px prefetch margin
- Aspect ratio reservation in DOM — zero cumulative layout shift
- Minimum upload resolution enforcement (2400px long edge)
- Supabase Storage CDN delivery with aggressive cache headers

### Premium Lightbox
- Cinematic open/close animation (scale from source element)
- Progressive HD loading — display image loads first, full-res silently upgrades in background
- HD badge indicator when full resolution is ready
- Slide-in details panel (right side desktop, bottom sheet mobile)
- Integrated inquiry form — pre-filled with artwork context
- Double-click zoom to 2.5x with smooth transforms
- Pinch-to-zoom on touch (up to 4x)
- Swipe left/right to navigate between works
- Swipe down to close
- Keyboard native: arrows navigate, `i` toggles details, `esc` closes
- Counter display (1/12)
- Controls auto-hide, appear on hover/interaction
- Dark surround (#0a0a0a) — gallery wall at night
- Accessible: ARIA labels, focus management, keyboard-only navigation

### Inquiry System
- Contextual forms: knows which artwork/exhibition is being inquired about
- Minimal fields: name, email, message (phone optional)
- Honeypot spam protection (no CAPTCHA)
- Supabase insert → edge function → Resend email to gallery
- Email includes artwork details, reply-to link, collector info
- Auto-creates/updates contact record on submission
- Inquiry status tracking: new → responded → closed → archived
- In-page confirmation ("Thank you") — no redirect

### Contact / CRM
- Contacts table with type classification (collector, designer, institution, press)
- Source tracking (inquiry, newsletter, manual)
- Newsletter subscription management
- Upsert on email — existing contacts update, don't duplicate

### Content Management
- `page_content` table — JSON-driven editable sections
- No deploy needed to update copy, descriptions, exhibition text
- Per-page, per-section granularity with sort ordering

### Database
- Full RLS on every table
- Public read for published content
- Authenticated write for admin operations
- Open insert on inquiries and contacts (form submissions)
- Updated_at triggers on mutable tables
- Convenience views: current_exhibitions, featured_artists, available_artworks
- Indexed on all query patterns (slug lookups, status filters, foreign keys)

## What This System Does NOT Do (Yet)

- Admin dashboard / CMS interface
- Image upload + derivative generation UI
- E-commerce / cart / checkout
- User accounts for collectors
- Email marketing / drip campaigns
- Analytics dashboard
- PDF generation (exhibition price sheets)
- Print stylesheets
- Multi-language support
- Search

## Per-Client Customization Surface

| Layer | What Changes | How |
|-------|-------------|-----|
| Brand | Name, logo, colors, fonts | `.env` + CSS variables |
| Theme | Dark/light/custom | Config flag + theme CSS |
| Content | All copy, descriptions, bios | `page_content` table |
| Data | Artists, artworks, exhibitions | Supabase tables |
| Images | All artwork/exhibition photos | Supabase Storage |
| Email | Gallery email, from address | `.env` + edge function config |
| Domain | Custom domain | Vercel project settings |

## Architecture Decisions

- **No CMS** — the database is the CMS. Admin interface comes later, not as a dependency.
- **No image CDN service** — Supabase Storage handles it. One less vendor, one less bill.
- **No CAPTCHA** — honeypot + rate limiting. CAPTCHA kills the gallery mood.
- **No SSR initially** — pure SPA via Vite. SSR (Next.js) is an upgrade path for SEO if needed.
- **No component library** — every element is bespoke. This is a gallery, not a dashboard.
- **Separate Supabase project per client** — data isolation by default, not by policy.
