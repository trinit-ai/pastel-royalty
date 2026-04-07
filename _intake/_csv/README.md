# CSV Intake

The fastest way to populate your gallery site from an existing CMS export (ArtLogic, Squarespace, Excel spreadsheet, etc.).

## What you need

1. **One or more CSV files** describing your content
2. **A folder of images** with filenames matching the CSV
3. **A folder of PDFs** if you have press releases / checklists / CVs

## Folder structure

```
_intake/_csv/
├── exhibitions.csv          (optional)
├── artists.csv              (optional)
├── artworks.csv             (optional)
├── images/                  (flat folder — every image referenced in any CSV)
│   ├── still-life-hero.jpg
│   ├── elena-marsh-portrait.jpg
│   ├── camellias-i.jpg
│   └── ...
└── pdfs/                    (flat folder — every PDF referenced in any CSV)
    ├── press-release-still-life.pdf
    ├── checklist-still-life.pdf
    ├── cv-elena-marsh.pdf
    └── ...
```

## Running

```bash
npm run ingest:csv
```

This runs two steps in sequence:
1. **csv-to-meta** — parses your CSVs, generates `meta.yml` files in `_intake/exhibitions/{slug}/` and `_intake/artists/{slug}/`, copies referenced images and PDFs into place
2. **ingest** — processes all images through Sharp, generates the final `src/data/content.js`

After it runs, switch your page imports from `'../data/demo'` to `'../data/content'`.

## CSV column reference

Column names are matched **case-insensitively** and ignore spaces, dashes, and underscores. So `Title`, `title`, `TITLE`, `Exhibition_Title`, and `Exhibition Title` all match the same field.

You don't need to use these exact names — common variations are accepted (see `COLUMN_ALIASES` in `scripts/csv-to-meta.js` for the full list).

### exhibitions.csv

| Column | Required | Notes |
|---|---|---|
| `title` | yes | Display title |
| `slug` | no | Auto-generated from title if missing |
| `type` | no | solo / group / fair (defaults to "group") |
| `start_date` | yes | YYYY-MM-DD |
| `end_date` | yes | YYYY-MM-DD |
| `location` | no | Defaults to "Main Gallery" |
| `artists` | yes | Display string e.g. "Elena Marsh & Julian Cole" |
| `description` | yes | 1–3 sentence summary |
| `essay` | no | Long-form curatorial text |
| `pull_quote` | no | Featured quote |
| `opening` | no | Reception details |
| `status` | no | current / forthcoming / past |
| `hero_image` | no | Filename in images/ folder |
| `press_release_pdf` | no | Filename in pdfs/ folder |
| `checklist_pdf` | no | Filename in pdfs/ folder |

### artists.csv

| Column | Required | Notes |
|---|---|---|
| `name` | yes | Full name |
| `slug` | no | Auto-generated from name |
| `medium` | yes | Primary medium(s) |
| `location` | yes | City, State |
| `born` | yes | Birth year |
| `bio` | yes | 2–4 sentence bio |
| `instagram` | no | With or without @ |
| `website` | no | Domain only |
| `hero_image` | no | Filename in images/ folder |
| `cv_pdf` | no | Filename in pdfs/ folder |

### artworks.csv

| Column | Required | Notes |
|---|---|---|
| `title` | yes | Work title |
| `artist_slug` *or* `exhibition_slug` | yes (one or the other) | Links to parent |
| `year` | no | |
| `medium` | no | |
| `dimensions` | no | e.g. "48 × 36 in" |
| `status` | no | available / sold / nfs / on-hold |
| `image_filename` | yes | Filename in images/ folder |

If a work belongs to **both** an exhibition and an artist, set `exhibition_slug` (it takes precedence). The work will appear in the exhibition's grid; you can also list it in the artist's grid by adding a separate row with `artist_slug` set.

## Example: importing from ArtLogic

ArtLogic's standard CSV exports include columns like `Artwork Title`, `Artist Name`, `Year`, `Medium`, `Dimensions`, `Image File`. The script's column aliasing handles these automatically — no renaming required.

1. Export from ArtLogic: Database → Artworks → Export → CSV
2. Save as `_intake/_csv/artworks.csv`
3. Download the image folder from ArtLogic → put all images in `_intake/_csv/images/`
4. Repeat for artists if you have an artists export → save as `artists.csv`
5. Run `npm run ingest:csv`

If a column doesn't auto-match, open `scripts/csv-to-meta.js` and add the column variant to the relevant entry in `COLUMN_ALIASES`. For example:

```js
title: ['title', 'name', 'work title', 'piece title', 'Object Title'],
```

## Tips

- **Slugs are auto-generated** from titles/names if you don't provide them. They'll be lowercase, hyphenated, alphanumeric.
- **Image filenames are matched literally** — `Camellias I.jpg` and `camellias-i.jpg` are different. Make sure your CSV references match the actual files exactly (extension included).
- **You can run `csv-to-meta` and `ingest` separately** if you want to inspect the generated `meta.yml` files before processing images:
  ```bash
  node scripts/csv-to-meta.js   # generates meta.yml files
  # ... inspect _intake/exhibitions/ and _intake/artists/
  npm run ingest                 # process images and write content.js
  ```
- **Iteration is cheap.** If your CSV is wrong, fix it and re-run `npm run ingest:csv` — it overwrites cleanly.
