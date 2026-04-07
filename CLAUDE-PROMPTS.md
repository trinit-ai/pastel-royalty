# Claude Code Prompts — Quick Recipes

A copy-paste cookbook for managing your gallery site with [Claude Code](https://claude.ai/code). No coding knowledge required — just drag files into the chat and use these prompts.

## Before you start

1. **Install Claude Code** — `npm install -g @anthropic-ai/claude-code`
2. **Open your project** — in Terminal, run `cd path/to/your-gallery-site && claude`
3. **Drag files into the chat** — Claude Code accepts dragged files just like a normal chat. The image or PDF gets attached to your message.
4. **Tell Claude what to do in plain English** — use the prompts below as templates.

Don't worry about Terminal. You just need to type `claude` once and then talk to it like you'd talk to a person. It edits files, runs commands, and pushes to the live site for you.

---

## Adding content

### Add a new exhibition

> **Drag in:** the hero image, install photos, work photos, press release PDF, checklist PDF
>
> **Prompt:**
> Add a new exhibition called "[Title]" by [Artists]. It runs from [start date] to [end date]. Here's the description: [paste description]. The status is [current/forthcoming/past]. Use the images I'm dragging in — the first one is the hero, the next 5 are installation views, and the rest are featured works. The two PDFs are the press release and the checklist.

### Add a new artist

> **Drag in:** the hero image, work photos, CV PDF
>
> **Prompt:**
> Add a new artist named [Full Name]. They work in [medium], based in [city, state], born [year]. Their Instagram is [@handle] and website is [domain.com]. Bio: [paste 2-3 sentences]. The first image I dragged in is the hero (full-bleed detail), the rest are 8 featured works. The PDF is their CV.

### Add a news item

> **Drag in:** an image (optional)
>
> **Prompt:**
> Add a news item to the news page. It's a [Art Fair / Publication / Event / Announcement] called "[Title]" happening [date]. Here's the body: [paste 1-3 sentences]. [If linked: It links out to [URL]]. Year is [year or "Forthcoming"].

### Update the homepage hero image

> **Drag in:** the new hero image
>
> **Prompt:**
> Replace the homepage hero image with this one. Make sure the crop still shows [whatever should be visible — e.g. "the main subject in the upper third"]. It should be [artist name]'s work.

### Add featured works to an existing artist

> **Drag in:** the new work images
>
> **Prompt:**
> Add these works to [Artist Name]'s featured works. For each one, here are the details:
> 1. "Title" — Year, Medium, Dimensions, Status
> 2. "Title" — Year, Medium, Dimensions, Status
> (one line per image, in the order they appear)

### Replace an artist's hero image

> **Drag in:** the new image
>
> **Prompt:**
> Replace [Artist Name]'s hero image with this one. Adjust the crop if needed so the most interesting detail is centered.

---

## Editing existing content

### Update the current exhibition shown on the homepage

> **Prompt:**
> The homepage hero is showing the wrong exhibition. Change it to feature "[Exhibition Title]" instead. The dates are [start] to [end]. Update the description if needed.

### Mark a work as sold

> **Prompt:**
> Mark "[Work Title]" by [Artist Name] as sold. It should still appear in the grid but the inquiry button should be hidden.

### Update an artist's bio

> **Prompt:**
> Update [Artist Name]'s bio to: "[paste new bio]". Don't change any other fields.

### Change gallery hours or address

> **Drag in:** nothing needed
>
> **Prompt:**
> Update the gallery hours everywhere on the site. New hours are: [hours]. Also update the ticker at the top of the homepage and the visit section.

### Update the gallery name

> **Prompt:**
> Change the gallery name from "[Old Name]" to "[New Name]" everywhere on the site — header, footer, page titles, meta tags, OG sharing card.

---

## Visual / design tweaks

### Change the gold accent color

> **Prompt:**
> Change the gold accent color to [hex code]. It's used in section dividers, the ticker bar, and the eyebrow text.

### Change the primary blue

> **Prompt:**
> Change the primary blue to [hex code]. It's used in links, the gallery name in the header, and the inquire buttons.

### Make a section heading bigger or smaller

> **Prompt:**
> The "[Section Name]" heading on the [page] page is too [big/small]. Adjust it.

### Adjust the hero image crop

> **Prompt:**
> The homepage hero image is cropped too [high/low/zoomed in/zoomed out]. [Move it down a bit / Zoom out / Show more of the [thing]].

---

## Publishing changes

### Push the site live

> **Prompt:**
> Push my changes to the live site.

That's it. Claude Code will run `git add`, `git commit`, and `git push`. Your site updates on Vercel automatically within ~30 seconds.

### See what's changed since last push

> **Prompt:**
> What's changed since my last push?

### Undo my last change

> **Prompt:**
> Undo my last change and don't push it. (Or: revert the last commit on the live site.)

---

## When something breaks

### The site is showing an error

> **Prompt:**
> The live site is showing [describe what you see — "a blank page" / "an error message" / "the wrong image"]. Can you figure out what's wrong and fix it?

### I uploaded an image and it looks wrong

> **Prompt:**
> The image I uploaded for [where] is [too tall / too wide / wrong color / cut off]. Can you fix the crop or replace it?

### The inquiry form isn't sending emails

> **Prompt:**
> Test the inquiry form and tell me whether it's actually submitting. If it's not, walk me through fixing it.

---

## Asking Claude about your site

### "What pages do I have?"

> **Prompt:**
> Show me a list of every page on my site and what each one is for.

### "Where is X stored?"

> **Prompt:**
> Where is the artist roster stored? I want to know the file so I understand the structure.

### "What does this button do?"

> **Prompt:**
> When someone clicks the Inquire button on the artist page, what happens? Walk me through it.

### "Is my site fast?"

> **Prompt:**
> Run an image size check and tell me if any of my images are too large. If they are, optimize them.

---

## Tips for talking to Claude Code

- **Be specific about which page or artist you mean.** "Update the exhibition page" is ambiguous; "Update the Still Life with Light exhibition page" is clear.
- **Drag files in directly.** Don't try to describe what an image looks like — just drop it into the chat.
- **It's OK to be casual.** Claude understands "the thing on the homepage with the green box" — it'll figure out what you mean.
- **Ask follow-up questions.** If something looks wrong after a change, just say "that's not right, the [thing] should be [different]" and Claude will iterate.
- **Always ask Claude to push when you're done.** Changes don't go live until they're pushed.
- **You can't break the live site permanently.** Every change is in git history. If something goes wrong, just say "undo that" or "revert to before my last change."

---

## What Claude Code can NOT do (yet)

- **Send actual emails through the inquiry form** — that requires Supabase + Resend setup. Without those, the inquiry form copies the message to clipboard for the visitor to paste manually.
- **Take payments** — no e-commerce. Inquiries only.
- **Schedule social posts** — separate tool.
- **Generate AI artwork** — bring your own photos.
- **Scrape your old website** — you'll need to provide the content.

For anything in this list, contact the developer who set up your site.

---

## Quick reference: file paths Claude knows about

These are the most common files Claude will edit when you ask for changes. You don't need to know them — Claude does — but here for reference:

- `src/data/demo.js` — placeholder content (artists, exhibitions)
- `src/data/content.js` — your real content (auto-generated by `npm run ingest`)
- `src/pages/Home.jsx` — homepage layout
- `src/pages/News.jsx` — news feed content
- `src/styles/theme.css` — colors, fonts, spacing tokens
- `public/` — all images and PDFs
- `_intake/` — drop folder for new content batches

---

## Example session

Here's what a real conversation might look like:

> **You:** Add a new artist named Rob Ventura. He's a painter based in Jersey City, NJ, born 1985. His Instagram is @robventura and website is robventura.com. Bio: "Detailed paintings on hemp and linen exploring botanical and microbiological subjects." Here are 8 of his works *[drags 8 images]*. The first image is a detail crop for his hero.
>
> **Claude:** I'll add Rob Ventura to the artist roster. Let me process the hero image and the 8 works, add them to the data file, and update the routing. Should I push when I'm done?
>
> **You:** Yes
>
> **Claude:** Done. Rob Ventura is now live at /artists/rob-ventura. The hero image is processed, the 8 works are in his featured grid, and I've pushed to the live site. It should be visible in about 30 seconds.
>
> **You:** Can you also add him to the homepage featured artists?
>
> **Claude:** Yes — moving him into the featured artists slot. He'll appear on the homepage as soon as I push.
>
> **You:** Push it
>
> **Claude:** Done.

That's the entire workflow.
