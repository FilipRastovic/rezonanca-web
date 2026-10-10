import sr from './sr';
import en from './en';

export type Lang = 'sr' | 'en';
export const T = { sr, en };

// Short series name: Cyrillic on the Serbian site, English on the English one ("Град · City" → "City").
export const seriesShort = (lang: Lang, key: string) => {
  const parts = T[lang].series[key as 'structure'].name.split(' · ');
  return lang === 'sr' ? parts[0] : parts[parts.length - 1];
};

// URL helpers - Serbian lives at the root, English under /en/.
export const homeHref = (lang: Lang) => (lang === 'sr' ? '/' : '/en/');
export const collectionHref = (lang: Lang, series?: string) =>
  `${lang === 'sr' ? '/kolekcija/' : '/en/collection/'}${series ? `${series}/` : ''}`;
export const productHref = (lang: Lang, slug: string) => `${lang === 'sr' ? '' : '/en'}/poster/${slug}/`;
export const cartHref = (lang: Lang) => (lang === 'sr' ? '/korpa/' : '/en/cart/');
export const checkoutHref = (lang: Lang) => (lang === 'sr' ? '/naplata/' : '/en/checkout/');
export const legalHref = (lang: Lang, page: 'terms' | 'privacy') =>
  lang === 'sr' ? (page === 'terms' ? '/uslovi/' : '/privatnost/') : `/en/${page}/`;
// The same page in the other language. Pairs: Serbian path prefix <-> English path prefix (after /en).
const PAIRS: [string, string][] = [['/kolekcija/', '/collection/'], ['/uslovi/', '/terms/'], ['/privatnost/', '/privacy/'], ['/korpa/', '/cart/'], ['/naplata/', '/checkout/']];
export const altHref = (path: string, to: Lang) => {
  const isEn = path === '/en' || path.startsWith('/en/');
  let rest = isEn ? path.slice(3) || '/' : path;
  for (const [srP, enP] of PAIRS) {
    const [from, into] = isEn ? [enP, srP] : [srP, enP];
    if (rest.startsWith(from)) { rest = into + rest.slice(from.length); break; }
  }
  if (to === 'sr') return isEn ? rest : path;
  return isEn ? path : '/en' + rest;
};
