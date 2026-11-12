// /llms.txt: a plain summary of the shop for answer engines (ChatGPT search, Perplexity, Claude, Gemini), per llmstxt.org.
import { PRODUCTS, SERIES, productsBySeries } from '../data/products.js';
import { GUIDES } from '../data/guides';
import { T, guideHref, collectionHref, productHref, interiorsHref, legalHref } from '../i18n';
import { PRICES, SIZES, ACTIVE_FORMATS, SHOP } from '../config';

export const GET = ({ site }: { site: URL }) => {
  const t = T.en;
  const u = (p: string) => new URL(p, site).href;
  const price = (f: (typeof ACTIVE_FORMATS)[number]) => SIZES.filter((s) => PRICES[f][s]).map((s) => `${s.replace('x', ' x ')} cm €${PRICES[f][s]}`).join(', ');
  const series = SERIES.map((s) => {
    const x = (t.series as Record<string, { name: string; desc: string }>)[s.key];
    const works = productsBySeries(s.key).map((p) => `[${p.name.en}](${u(productHref('en', p.slug))})`).join(', ');
    return `### ${x.name}\n${x.desc}\n- Collection: ${u(collectionHref('en', s.slug))}\n- Works: ${works}`;
  }).join('\n\n');
  const body = `# Rezonanca

> Rezonanca sells maths art posters drawn in code: strange attractors, fractal flames, the Mandelbrot set, Hopf fibrations and more. ${PRODUCTS.length} original designs in ${SERIES.length} series, written line by line in JavaScript in Novi Sad, Serbia. Each design comes from its own seed number and equations; the print you receive is exactly the image on the site.

## Shop facts
- Formats: unframed fine art print (${price('print')}); framed print, black or natural wood, ready to hang (${price('framed')}).
- Colourways: most works come in Original, Rose and Ink (black ink on white).
- Paper: fine art matte paper, 300 DPI. Made to order.
- Shipping: free, worldwide. Ships in 2-5 business days, delivery usually 3-10 days, with a tracking link by email.
- Payment: card (Visa, Mastercard, Maestro, DinaCard). Prices are shown in EUR; the card is charged a fixed amount in Serbian dinars (RSD).
- Returns: 14-day right of withdrawal.
- Contact: ${SHOP.email}
- Also on Etsy: ${SHOP.etsy}

## Main pages
- [Home](${u('/')})
- [Collection, all works](${u(collectionHref('en'))})
- [In a room: the posters in interiors](${u(interiorsHref())})
- [Guides: the maths behind the art](${u(guideHref())})
- [Free strange attractor phone wallpapers](${u('/wallpapers/')})
- [Play with the equation: Clifford attractor drawn live](${u('/play/')})
- [Terms](${u(legalHref('en', 'terms'))}), [Privacy](${u(legalHref('en', 'privacy'))})

## Series
${series}

## Guides
${GUIDES.map((g) => `- [${g.h1}](${u(guideHref(g.slug))})`).join('\n')}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
