# Content intake

Drop content here, then run `npm run ingest` to process everything into the live site.

## Folder structure

```
_intake/
├── exhibitions/
│   └── {slug}/
│       ├── meta.yml         (required — see exhibition-meta.template.yml)
│       ├── hero.jpg         (full-bleed detail image)
│       ├── press-release.pdf
│       ├── checklist.pdf
│       ├── installation/    (5–10 install views, any filenames, processed in alpha order)
│       │   ├── 01.jpg
│       │   └── 02.jpg
│       └── works/           (8 featured works)
│           ├── 01.jpg
│           ├── 02.jpg
│           └── meta.yml     (optional — array of work titles/year/medium/dimensions)
└── artists/
    └── {slug}/
        ├── meta.yml
        ├── hero.jpg
        ├── cv.pdf
        └── works/
            ├── 01.jpg
            └── meta.yml
```

## meta.yml templates

### `_intake/exhibitions/{slug}/meta.yml`

```yaml
id: '1'
title: Still Life with Light
slug: still-life-with-light
type: group              # solo | group | fair
start_date: 2026-05-01
end_date: 2026-08-15
location: Main Gallery
artists: 'Elena Marsh & Julian Cole'
artistIds: ['1', '2']
description: Two artists exploring the quiet tension between permanence and impermanence.
essay: |
  Long-form curatorial essay. Use the | block scalar so line breaks
  and paragraph spacing are preserved.

  Multiple paragraphs are fine.
pullQuote: '"The painting is finished when the light in it matches the light outside the window." — Elena Marsh'
opening: 'Opening reception: Thursday, May 1, 2026, 5–8pm'
status: current          # current | forthcoming | past
featured: true
color: '#C4D2C0'
```

### `_intake/exhibitions/{slug}/works/meta.yml` (optional)

```yaml
- title: Untitled I
  year: 2025
  medium: Oil and beeswax on linen
  dimensions: 60 × 48 in
  status: available
- title: Passage
  year: 2025
  medium: Oil and beeswax on linen
  dimensions: 48 × 36 in
  status: sold
```

The array order matches the alphabetical order of image files in `works/`.

### `_intake/artists/{slug}/meta.yml`

```yaml
id: '1'
name: Elena Marsh
slug: elena-marsh
medium: 'Painting, Mixed Media'
location: 'Brooklyn, NY'
born: 1988
instagram: '@elenamarsh.studio'
website: elenamarsh.com
bio: Layered oil and beeswax paintings exploring coastal light and seasonal color shifts.
featured: true
onView: true
color: '#d4ece8'
```

## Running

```bash
npm run ingest
```

The script will:
1. Walk every exhibition and artist folder
2. Validate `meta.yml` against required fields (typedef from `src/data/demo.js`)
3. Process all images through Sharp → optimized WebP at the right resolutions
4. Copy PDFs to `public/pdfs/`
5. Write everything into `src/data/content.js` (auto-generated, do not hand-edit)
6. Print a summary

If validation fails, the script tells you exactly which slug is missing which field.

After running, switch your page imports from `'../data/demo'` to `'../data/content'`:

```js
import { EXHIBITIONS, ARTISTS, ARTWORKS } from '../data/content'
```

`demo.js` remains as the placeholder content used by the template out of the box.
