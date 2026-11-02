import { defineConfig } from 'astro/config';
import { PRODUCTS, SERIES } from './src/data/products.js';

// The site is English only (2026-10-29). Old Serbian and /en/ addresses forward to the English pages.
// Not /uslovi/ and /privatnost/: they stay as the Serbian legal texts.
const MOVED = {
  '/en': '/',
  '/en/collection': '/collection/',
  '/en/in-a-room': '/in-a-room/',
  '/en/cart': '/cart/',
  '/en/checkout': '/checkout/',
  '/en/payment': '/payment/',
  '/en/terms': '/terms/',
  '/en/privacy': '/privacy/',
  '/kolekcija': '/collection/',
  '/u-prostoru': '/in-a-room/',
  '/korpa': '/cart/',
  '/naplata': '/checkout/',
  '/placanje': '/payment/',
};
// English product and series addresses (2026-11-02): every earlier address of a piece or series forwards to the new one.
// The old /poster/<slug>/ and /collection/<old>/ pages are built by their own routes (src/components/Moved.astro keeps
// UTM tags and ?boja= on the way); these are the older /en/ and Serbian forms.
for (const p of PRODUCTS) MOVED[`/en/poster/${p.slug}`] = `/poster/${p.url}/`;
for (const s of SERIES) {
  MOVED[`/en/collection/${s.old}`] = `/collection/${s.slug}/`;
  MOVED[`/kolekcija/${s.old}`] = `/collection/${s.slug}/`;
}

export default defineConfig({
  site: 'https://rezonanca.art',
  redirects: MOVED,
});
