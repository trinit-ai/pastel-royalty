# Customizing Pastel Royalty for Your Gallery

A focused checklist. Work through this top to bottom and your gallery is live.

## 1. Brand identity (5 minutes)

**`src/App.jsx`**
- [ ] Change `GALLERY_NAME` to your gallery's name

**`index.html`**
- [ ] Update `<title>` and `<meta name="description">`
- [ ] Update Open Graph tags (`og:title`, `og:description`, `og:image`)

## 2. Colors & theme (10 minutes)

**`src/styles/theme.css`**
- [ ] Set `--gold` to your primary accent color
- [ ] Set `--accent-secondary` (used for links and buttons)
- [ ] Set `--ink` and `--cream` (text and background base colors)
- [ ] Optionally adjust `--sage`, `--lavender`, `--blush`, `--sky` (used in service cards and exhibition placeholders)

That's it. Every color in the site reads from these variables.

## 3. Replace placeholder images (15 minutes)

Drop your files into `public/` with these exact names:

- [ ] `hero-artwork.jpg` — main homepage hero (any aspect ratio, ideally 2400px+ on long edge)
- [ ] `logo-embossed.png` — small logo shown in the hero contact card (transparent PNG, ~400px wide)
- [ ] `favicon.svg` — browser tab icon
- [ ] `og-card.png` — social sharing card (1200×630, opaque background)

Run `npm run check-images` to make sure none exceed 500KB.

## 4. Gallery info (10 minutes)

**`src/components/layout/Header.jsx`**
- [ ] Update `TICKER_ITEMS` — current show, hours, location, phone, email

**`src/pages/Home.jsx`**
- [ ] Update the ticker bar (lines ~30-35)
- [ ] Update the visit section: address, hours, contact, Instagram

**`src/components/layout/Footer.jsx`**
- [ ] Update gallery name, address, contact info

## 5. Content (the bulk of the work)

**`src/data/demo.js`** — replace with your real data:
- [ ] `EXHIBITIONS` — your exhibition history (current, forthcoming, past)
- [ ] `ARTISTS` — your roster

The shape of each record is documented at the top of the file (JSDoc typedefs). Your editor should autocomplete the fields.

**`src/pages/News.jsx`** — edit the `FEED` array with your news items (art fairs, publications, announcements, events)

**`src/pages/About.jsx`** — replace placeholder copy with your gallery's story

**`src/pages/Services.jsx`** — edit the `SERVICES` array (consultations, appraisals, advisory)

## 6. Legal pages

**`src/pages/Legal.jsx`** — review and customize:
- Privacy policy
- Terms of service
- Cookie policy
- Accessibility statement

The included copy is generic and gallery-appropriate but should be reviewed by your legal counsel.

## 7. Optional: Supabase (for real inquiry forms)

Without Supabase the inquiry form copies a pre-formatted message to clipboard — works fine for low-volume galleries.

To enable real form submissions:
1. Create a Supabase project
2. Run `supabase/migrations/001_initial.sql` and `002_rate_limit.sql`
3. Add to `.env`:
   ```
   VITE_SUPABASE_URL=https://yourproject.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart dev server. The form will automatically use Supabase.

## 8. Deploy

```bash
npm run build
```

Drag `dist/` to Vercel or Netlify, or connect the repo for auto-deploy. The included `vercel.json` handles SPA routing and security headers automatically.

## Common edits after launch

| What you want to change | Where to look |
|---|---|
| Add a new page | `src/pages/` (see ARCHITECTURE.md) |
| Change navigation order | `src/components/layout/Header.jsx` → `NAV_ITEMS` |
| Change footer columns | `src/components/layout/Footer.jsx` |
| Change colors | `src/styles/theme.css` |
| Change typography | `src/styles/global.css` |
| Add new artist or exhibition | `src/data/demo.js` |
| Tweak section spacing | `src/styles/theme.css` → `--section-gap` |

## Need help?

For deeper customization see `ARCHITECTURE.md`. For anything beyond template editing, contact the developer.
