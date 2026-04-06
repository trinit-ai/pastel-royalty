# Pastel Royalty — Design Ledger

A running inventory of every design element, interaction, and feature in the system. Each entry describes what it is, why it exists, and how it behaves.

---

## Layout & Structure

### Split-View Landing Hero
Full-viewport hero divided into two panels. Left: exhibition content (title, artists, dates, description, CTAs, newsletter card, cookie notice). Right: featured artwork with label. The split creates tension between information and image — the visitor chooses where to look first. On the dark theme, left panel is navy gradient; on light, it's white with a border divider.

### Sticky Section Headers
Section headers (Exhibitions, Artists, About) pin below the main nav on scroll. Full-bleed background matching their section color. Content scrolls underneath. Creates a sense of chapters — the visitor always knows where they are.

### Gold Ticker Bar
Horizontal info strip below the header: current exhibition, hours, location (with Directions link), phone, email. Compact, always visible. Dark theme: gold gradient background. Light theme: pastel sky blue. Functional — every item is a potential link.

### Ornament Divider
Centered gold lines with a rotated diamond dot between sections. A quiet breath between content areas. Gallery convention translated to web.

### Visit + About Split Pane
Two-column section: left is the gallery's physical details (address, hours, contact, Instagram) on a dark/blue background; right is the About narrative with Inquire CTA. The physical and philosophical identity side by side.

---

## Navigation

### Header Nav
Sticky, minimal. Gallery name left (brand blue on light, `#336699` on both), section links right. Hover states shift to brand blue (light) or `#336699` (dark). Gold top rule on both themes. 72px height — enough presence without competing with content.

### Scroll-to-Section Links
Nav links smooth-scroll to their sections. About link targets the Gallery Information/Services section, not the Visit pane. Lenis handles the easing.

### Footer Navigation
Four-column footer: Gallery info (name, tagline, address, hours), Navigate (section links), Legal (privacy, terms, cookies, accessibility), Connect (email, phone, socials). Bottom bar: italic serif gallery line left, copyright right.

---

## Exhibitions

### Exhibition Cards (Imagistic)
Three-column grid of exhibition cards. Each card: background image (or pastel gradient placeholder) with overlay text at bottom — date, title, artists. Current show gets an "On View" badge (gold on dark, blue on light). Equal-width columns, 3:2 landscape aspect ratio. Hover state subtle. Footer bar: exhibition count + "View Full Archive →" link.

### Exhibition Archive (Planned)
Full chronological list of all exhibitions. Row-based: date, title, artists, thumbnail. Filterable by year/type. Links to individual exhibition pages.

### Exhibition Page (Planned)
Single exhibition view: hero image, title, dates, artists, description. Artwork grid below — each piece clickable into lightbox. Download PDF option for price sheet.

---

## Artists

### Artist Row List
Horizontal rows: thumbnail (120×90), name/medium/badge, location, "View →" link. Currently exhibiting artists get gold "On View" badge. Clean, scannable, respects the hierarchy — the artist's name is the largest element. Footer: artist count + "View Full Roster →".

### Artist Page (Planned)
Single artist view: portrait/hero, bio, medium, available works grid. Each artwork opens in lightbox. Exhibition history. Inquiry CTA.

### Artist Roster (Planned)
Full grid of all represented artists. Card or row layout (configurable). Filterable by medium. Links to individual artist pages.

---

## Artwork Display

### GalleryImage Component
The core image element. Reserves exact aspect ratio space before load (zero CLS). Shows dominant color while loading. Lazy loads via Intersection Observer with 200px prefetch. Serves WebP/AVIF via `<picture>` with JPEG fallback. Subtle fade-in on load. Click opens lightbox from element's screen position. Hover: gentle scale (1.02) with "View" overlay.

### Image Pipeline
Three tiers generated on upload: thumb (400px/75q), display (1600px/82q), full (3200px/88q). All WebP. Originals archived in Supabase Storage. Minimum 2400px long edge enforced on upload. BlurHash generated server-side for placeholders.

### Director of Photography Philosophy
Not 20 works in a grid. Three full-bleed paintings that stop you cold. High-res details. Reflective surfaces. Texture. Every image is a moment, not a thumbnail. The site curates — fewer images, higher impact.

---

## Lightbox

### Cinematic Open/Close
Image scales up from 0.92 with opacity fade. Backdrop fades to #0a0a0a. Exiting reverses. Cubic-bezier easing (0.16, 1, 0.3, 1) — fast start, gentle land. The art emerges, it doesn't pop.

### Progressive HD Loading
Display image (1600px) loads first and shows immediately. Full-res (3200px) loads silently in background. When ready, it swaps in and an "HD" badge appears bottom-right. The visitor never waits, but the quality is there when they zoom.

### Details Panel
Slides in from right (desktop) or up from bottom (mobile). Contains: artist name, title (italic), year, medium, dimensions, availability status (Available/Sold/NFS/On Hold with color-coded badges), description, Inquire button, exhibition context. 380px wide, cream background, subtle shadow. Toggle with `i` key or info button.

### Integrated Inquiry
The Inquire button lives inside the lightbox details panel. Click opens the InquireForm pre-filled with artwork context. The viewing-to-buying moment is one gesture — no navigation away from the piece.

### Navigation
Arrow keys or side arrows to move between works. Swipe left/right on touch. Counter shows position (1/12). Controls auto-hide, appear on hover. Swipe down to close.

### Zoom
Double-click: toggle between 1x and 2.5x zoom centered on click position. Pinch-to-zoom on touch: 1x to 4x. Smooth CSS transforms. Resets to 1x on release below 1.1x threshold.

### Keyboard
`←` `→` navigate, `i` toggles details, `esc` closes. Hints shown subtly at bottom center. Body scroll locked while open. Full ARIA labeling.

---

## Inquiry System

### InquireForm
Contextual — knows which artwork or exhibition is being inquired about. Pre-fills subject line: "Inquiring about 'Camellias I' by Rob Ventura". Three fields: name, email, message (phone optional). Honeypot field for spam — hidden from humans, catches bots. No CAPTCHA.

### Inquiry Flow
Submit → Supabase insert → edge function fires → Resend email to gallery with artwork details, collector info, one-click reply link → contact auto-created/updated. In-page confirmation: "Thank you — we'll be in touch shortly." No redirect.

### Inquiry Email
HTML email to gallery: structured table with name, email, phone, source page. If artwork attached: highlighted card with title, artist, medium, dimensions. Message block. Blue "Reply to [Name] →" button.

### Inquiry Dashboard (Planned)
Admin view: open inquiries sorted by recency, response time tracking, status management (new → responded → closed). The gallery that responds in 2 hours wins the sale.

---

## Contact / CRM

### Newsletter Signup
Two touchpoints on homepage: hero contact card ("Stay Connected" + email input + Subscribe) and newsletter strip above footer. Both upsert to contacts table with source tracking.

### Contact Auto-Creation
Every inquiry and newsletter signup creates or updates a contact record. Email is unique key — no duplicates. Type classification: collector, designer, institution, press. Source tracked: inquiry, newsletter, manual.

### CRM Agent (Planned)
AI-assisted contact management. Read inbound from all channels (inquiries, email, newsletter signups). Draft responses. Track collector interests based on inquiry history. Flag high-value contacts. Batch outreach capabilities.

---

## Services / Gallery Information

### Service Cards
Three pastel cards (sage, lavender, blush) — Consultations, Appraisals, Art Advisory. Full-bleed, no gaps. Each card: title (italic serif), description, "Inquire →" link. Edge-to-edge layout bleeds past section padding. No icons — the typography is enough.

### About Summary
One-liner in italic serif below section header: "A fine art gallery and full-service advisory firm in Spring Lake, New Jersey — curating exhibitions and building collections with fifteen years of expertise in contemporary and modern art."

---

## Theming

### Dark Theme (Pastel Royalty)
Navy gradients, gold accents, cream text on dark. Hero is cinematic — dark left panel, art right. Ticker: gold gradient. Footer: near-black with gold gallery name. Exhibition cards: dark gradient placeholders. Mood: evening opening, champagne, gallery at night.

### Light Theme (Pastel Royalty)
White base, `#336699` primary, gold tertiary accents. Hero: white left panel, art right. Ticker: pastel sky. Footer: light parchment with blue headings. Exhibition cards: pastel gradient placeholders (sage, lavender, sky). Service cards: same pastels. Mood: Sunday afternoon, natural light, gallery in spring.

### Theme Toggle (Planned)
CSS custom properties swap via `data-theme` attribute on `<html>`. Manual toggle in header (sun/moon icon). Respects `prefers-color-scheme` as default. 0.3s transition on all color properties.

### Per-Client Branding
Brand colors, fonts, logo stored in `site_config` table. Theme selection is a config flag. All customization lives in database + env vars, not code.

---

## Animation & Scroll

### Lenis Smooth Scroll
Inertia-based scrolling: duration 1.2s, exponential easing. Page decelerates naturally instead of stopping dead. Persists across interactions.

### Scroll Reveals
Intersection Observer triggers on elements with `.reveal` class. Fade up 32px with 0.7s cubic-bezier transition. Stagger delays on card grids (0.1s, 0.2s, 0.3s). Section dividers animate scaleX from left. One-shot — fires once, stays visible.

### Hero Entrance
Staggered fade-up on hero content: eyebrow → title → artist → dates → body → actions → contact card. 0.1s–0.5s delays. Creates a reading sequence.

---

## Cookie & Privacy

### Cookie Notice
Inline at bottom of hero content panel. Text + Privacy link + "→ Decline" button. Dot separators between elements. Sentence case, no underlines. Dismisses to localStorage. Quiet — doesn't interrupt the experience.

---

## Responsive (Planned)

### Mobile Breakpoints
- Lightbox: 95vw/75vh image, bottom-sheet details panel, no arrows, swipe navigation
- Hero: stacked (content above, image below)
- Exhibition cards: single column
- Artist rows: simplified (thumb + name + link)
- Service cards: stacked
- Footer: two columns then single column
- Nav: hamburger menu

---

*This document is the source of truth for what exists and what's planned. Update it when features ship.*
