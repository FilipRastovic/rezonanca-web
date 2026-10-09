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
// The same page in the other language.
export const altHref = (path: string, to: Lang) => {
  const sr = path.replace(/^\/en(\/|$)/, '/').replace(/^\/collection\//, '/kolekcija/');
  if (to === 'sr') return sr;
  return ('/en' + sr.replace(/^\/kolekcija\//, '/collection/')).replace(/\/+$/, '/') ;
};
