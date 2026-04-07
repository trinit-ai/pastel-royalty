# CSV Intake

The fastest way to populate your gallery site from an existing CMS export (ArtLogic, Squarespace, Excel spreadsheet, etc.).

## What you need

**Minimum:** just the CSV file. If your CSV has image URLs (e.g. ArtLogic exports include columns like `Main image URL (large)`), the script will download images directly — no folder management required.

**Or, if your images are local files:**
1. A folder of images with filenames matching the CSV → `_intake/_csv/images/`
2. A folder of PDFs → `_intake/_csv/pdfs/`

## ArtLogic export workflow (the easy path)

1. In ArtLogic: **Database → Artworks → Export → CSV**
2. Save the file as `_intake/_csv/artworks.csv`
3. Run `npm run ingest:csv`

That's it. The script will:
- Read the `Main image URL (large)` column for each row
- Download every image directly from ArtLogic's CDN
- Process them through Sharp into optimized WebP
- Generate the data file
- You're done

No image folders to manage. No Dropbox links. No manual file matching.

The same workflow works for any CSV that includes image URLs in any column.

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
| `image_filename` *or* `image_url_large` *or* `image_url_medium` | yes | Local filename in images/, or a public URL the script can download. ArtLogic's `Main image URL (large)` column matches automatically. |

If a work belongs to **both** an exhibition and an artist, set `exhibition_slug` (it takes precedence). The work will appear in the exhibition's grid; you can also list it in the artist's grid by adding a separate row with `artist_slug` set.

## Importing from ArtLogic — full details

ArtLogic's CSV exports include image URL columns like `Main image URL (large)`, `Main image URL (medium)`, `Main image URL (small)` pointing to their CDN at `datastore.artlogic.net`. The script reads these URLs directly and downloads each image during ingest — you don't need to manually download anything.

The script's column aliasing also handles standard ArtLogic columns like `Artwork Title`, `Artist Name`, `Year`, `Medium`, `Dimensions`. No CSV renaming required.

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
