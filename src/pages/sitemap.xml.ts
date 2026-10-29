// Sitemap for search engines: the English pages plus the Serbian legal texts.
import { PRODUCTS, SERIES } from '../data/products.js';
import { homeHref, collectionHref, productHref, interiorsHref, legalHref } from '../i18n';

export const GET = ({ site }: { site: URL }) => {
  const paths = [
    homeHref(), collectionHref('en'), ...SERIES.map((s) => collectionHref('en', s.slug)), interiorsHref(),
    ...PRODUCTS.map((p) => productHref('en', p.slug)),
    legalHref('en', 'terms'), legalHref('en', 'privacy'), legalHref('sr', 'terms'), legalHref('sr', 'privacy'),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((p) => `  <url><loc>${new URL(p, site).href}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
