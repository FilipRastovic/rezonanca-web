import { defineConfig } from 'astro/config';

// The site is English only (2026-10-29). Old Serbian and /en/ addresses forward to the English pages.
// Not /uslovi/ and /privatnost/: they stay as the Serbian legal texts.
const MOVED = {
  '/en': '/',
  '/en/collection': '/collection/',
  '/en/collection/[series]': '/collection/[series]',
  '/en/poster/[slug]': '/poster/[slug]',
  '/en/in-a-room': '/in-a-room/',
  '/en/cart': '/cart/',
  '/en/checkout': '/checkout/',
  '/en/payment': '/payment/',
  '/en/terms': '/terms/',
  '/en/privacy': '/privacy/',
  '/kolekcija': '/collection/',
  '/kolekcija/[series]': '/collection/[series]',
  '/u-prostoru': '/in-a-room/',
  '/korpa': '/cart/',
  '/naplata': '/checkout/',
  '/placanje': '/payment/',
};

export default defineConfig({
  site: 'https://rezonanca.art',
  redirects: MOVED,
});
