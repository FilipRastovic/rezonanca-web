// Sitemap for search engines: the English pages plus the Serbian legal texts.
import { PRODUCTS, SERIES } from '../data/products.js';
import { GUIDES } from '../data/guides';
import { guideHref, homeHref, collectionHref, productHref, interiorsHref, legalHref } from '../i18n';

export const GET = ({ site }: { site: URL }) => {
  const paths = [
    homeHref(), collectionHref('en'), ...SERIES.map((s) => collectionHref('en', s.slug)), interiorsHref(),
    guideHref(), ...GUIDES.map((g) => guideHref(g.slug)), '/wallpapers/', '/play/',
    ...PRODUCTS.map((p) => productHref('en', p.slug)),
    legalHref('en', 'terms'), legalHref('en', 'privacy'), legalHref('sr', 'terms'), legalHref('sr', 'privacy'),
  ];
  // Product pages also list their images (the print and the room shot) for Google Images.
  const images: Record<string, string[]> = Object.fromEntries(PRODUCTS.map((p) => [productHref('en', p.slug), [`/posters/${p.slug}-en-lg.webp`, `/rooms/${p.slug}-en.webp`]]));
  const url = (p: string) => `  <url><loc>${new URL(p, site).href}</loc>${(images[p] ?? []).map((i) => `<image:image><image:loc>${new URL(i, site).href}</image:loc></image:image>`).join('')}</url>`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${paths.map(url).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
