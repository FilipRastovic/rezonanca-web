# Резонанца — website

Static Astro site for the Rezonanca generative poster shop. Serbian Cyrillic at `/`, English at `/en/`.
Orders are emailed via FormSubmit (formsubmit.co) — no payments on the site (pouzećem / bank transfer).

```bash
npm run dev       # http://localhost:4321
npm run build     # → dist/ (deploy to Netlify, Vercel or Cloudflare Pages)
npm run assets    # re-render posters, interior mockups and OG images from ../waveform-poster
npm run shots     # desktop/mobile screenshots of the built site → screenshots/
```

## Before going live
1. Click "Activate" in the first FormSubmit email (sent on the first order to `orderInbox`), then swap the email for FormSubmit's random alias.
2. Edit `src/config.ts`: prices, `instagram` when it exists.
3. Set the real domain in `astro.config.mjs` (`site`).

## Pages
| Serbian | English | |
|---|---|---|
| `/` | `/en/` | Homepage |
| `/kolekcija/` | `/en/collection/` | All 30 works, grouped by series |
| `/kolekcija/<series>/` | `/en/collection/<series>/` | One series (struktura, tok, grad, grebeni, orbita) |
| `/poster/<slug>/` | `/en/poster/<slug>/` | Product page: gallery, format/size/frame, live price, order |

## Where things live
- Copy: `src/i18n/sr.ts` (+ `en.ts` mirror)
- **Products**: `src/data/products.js` — slug, series, seed, variant, palette, names and descriptions.
  Add or change a product there, then `npm run assets` (or `node scripts/render-assets.mjs <slug>` for one).
- Live hero: `src/scripts/hero.ts` — the Структура design grammar (port of `../waveform-poster/styles.js`), plain Canvas, no dependencies
- Order form logic: `src/scripts/order.ts`
