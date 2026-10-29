import sr from './sr';
import en from './en';

export type Lang = 'sr' | 'en';
export const T = { sr, en };

// Short series name: Cyrillic on the Serbian site, English on the English one ("Град · City" → "City").
export const seriesShort = (lang: Lang, key: string) => {
  const parts = T[lang].series[key as 'structure'].name.split(' · ');
  return lang === 'sr' ? parts[0] : parts[parts.length - 1];
};

// URL helpers - the site is English only, at the root. Serbian survives only as the legal pages
// (/uslovi/, /privatnost/), which the law requires in Serbian for buyers in Serbia.
// `lang` stays in the signatures so components keep one shape.
export const homeHref = (_lang?: Lang) => '/';
export const collectionHref = (_lang: Lang, series?: string) => `/collection/${series ? `${series}/` : ''}`;
export const productHref = (_lang: Lang, slug: string) => `/poster/${slug}/`;
export const interiorsHref = (_lang?: Lang) => '/in-a-room/';
export const cartHref = (_lang?: Lang) => '/cart/';
export const checkoutHref = (_lang?: Lang) => '/checkout/';
export const paymentHref = (_lang?: Lang) => '/payment/';
export const legalHref = (lang: Lang, page: 'terms' | 'privacy') =>
  lang === 'sr' ? (page === 'terms' ? '/uslovi/' : '/privatnost/') : `/${page}/`;
