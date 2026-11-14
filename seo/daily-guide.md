# Daily guide job

Runs every morning in GitHub Actions (`.github/workflows/daily-guide.yml`). You write ONE new guide page for rezonanca.art. Nobody reviews it before it goes live, so follow every rule below. The workflow builds, checks, commits and deploys after you finish: you only edit files.

You may change only these three files: `src/data/guides.ts`, `seo/guide-queue.md`, `seo/daily-log.md`. The workflow fails the run if anything else changes.

## About the shop
Rezonanca sells posters made with code: strange attractors, Mandelbrot zooms, fractal flames, Hopf fibrations, sound waves and more, each drawn by a program from real equations. Made to order on fine art matte paper, 300 DPI, framed or unframed, ships worldwide. The art is written in Novi Sad.

## Steps
1. Pick the first `- [ ]` line in `seo/guide-queue.md` (format: slug | target searches | pieces | angle).
2. Check: every piece slug exists in `PRODUCTS` in `src/data/products.js`, and no guide in `GUIDES` (`src/data/guides.ts`) already answers the same search. If a check fails, change the line to `- [-] ... SKIPPED <date>: <reason>` and take the next line.
3. Read two existing guides in `src/data/guides.ts` to match their tone, depth and shape. Read `src/data/math/<slug>.json` for every piece you show.
4. Add the new guide as the LAST object in the `GUIDES` array (just before `];`). Add only; never edit or delete anything else in that file.
   - `slug` = the queue slug. `series: ''` with `shop: [4-8 product slugs]`, unless the queue line says to use a series key, then `series: '<key>'` and no `shop`.
   - `title` 35-60 characters (" | Rezonanca" is added), Title Case, main search phrase first.
   - `desc` 120-158 characters, plain and specific.
   - `h1` = title in sentence case. `kicker` = `Guide // <topic>`. `updated` = today.
   - `lead`: the first sentence directly answers the main search (a definition or the answer), then one or two sentences on what the page covers.
   - 6-9 `sections`, 900-1,400 words in total. At least 3 sections have a real equation in `f` (same Unicode style as the other guides: ², ₙ, σ, ·, −). 2-4 sections show a piece (`piece` = product slug) with a factual `caption`.
   - Numbers about our pieces come only from `src/data/math/<slug>.json`. Piece names come only from `PRODUCTS` (`name.en`). Never invent names, numbers or parameters.
   - Mention related guides or /play/ in the text where it helps the reader (plain text, no HTML).
   - Last section: how our posters relate to the topic, ending with: what you see is exactly the print you get, fine art matte paper.
   - `faq`: 4 items, each a real question people search, answered in 1-2 sentences.
   - Escape apostrophes in single-quoted strings (`don\'t`), like the other guides.
5. Run `npm run build` and `npm run check-links` (must say broken 0). Fix any error you caused.
6. Change the queue line to `- [x] ... - DONE <date> https://rezonanca.art/guide/<slug>/`.
7. Add one line to `seo/daily-log.md`: `<date> | <slug> | <title> | <word count> words | published`.

## Rules (non-negotiable)
- Never mention AI. Never use the word "generative". Say "made with code", "written in JavaScript", "drawn by a program", "Programmer Art".
- No em dashes or en dashes in text; use plain hyphens or commas.
- English only.
- Never say each copy or print is unique: every product image is exactly the print shipped. The design is original.
- Never say where posters are printed or by whom.
- No prices, discounts, reviews, ratings, customer quotes or statistics you can't back with a source.
- Facts only: well-known, checkable facts (who, when, what equation). If you are not sure of a date or a name, leave it out.
- One search intent per page. Don't repeat paragraphs or examples from other guides; link to them instead.
- No keyword stuffing: the main phrase appears in title, h1, lead and at most 3 more times.
- Plain, precise maths wording. No poetic filler, no hype ("mesmerizing", "stunning", "unlock").
- If you can't write a guide that meets all of this, change nothing in guides.ts, log `<date> | <slug> | skipped: <reason>` and stop.
