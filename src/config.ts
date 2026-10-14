// Sales switch. false = "coming soon": prices hidden, cart/checkout disabled, product pages collect
// waitlist signups (emailed via FormSubmit like orders). Set to true once prices are final.
export const SALES_OPEN = true;
// Prices shown on the site even while sales are closed (waitlist instead of ordering). Filip, 2026-10-14.
export const PRICES_VISIBLE = true;

// Shop settings - edit these before going live.
export const SHOP = {
  name: 'Резонанца',
  email: 'filiporastovic@gmail.com',
  phone: '+381 63 171 4561',
  // Social profiles (footer links; an empty string hides that link).
  instagram: 'https://www.instagram.com/rezonanca.art/',
  tiktok: 'https://www.tiktok.com/@rezonanca.art',
  facebook: 'https://www.facebook.com/people/%D0%A0%D0%B5%D0%B7%D0%BE%D0%BD%D0%B0%D0%BD%D1%86%D0%B0/61595416314680/',
  // Orders are emailed via FormSubmit (https://formsubmit.co). The first order triggers an
  // activation email to this address; click "Activate" once. FormSubmit then offers a random
  // alias - put it here instead of the email to keep the address out of the page source.
  // Set to '' for demo mode (orders are only logged to the console).
  orderInbox: 'filiporastovic@gmail.com',
  editionSize: 50,
  currency: 'RSD',
  shipping: 500, // courier, paid by the customer
};

// Legal seller details (Agencija za privredne registre).
export const SELLER = {
  name: 'FILIP RASTOVIĆ PR SREMSKA KAMENICA',
  mb: '67800826',
  pib: '114718565',
  address: 'Slavka Rodića 40, 21208 Sremska Kamenica, Srbija',
};

// Analytics. Both load only after the visitor accepts cookies (Consent.astro). An empty string disables it.
export const ANALYTICS = {
  metaPixel: '28640408028947508', // Events Manager → dataset rezonanca.art
  ga4: 'G-FKNVF77VNE', // GA4 Measurement ID (property rezonanca.art)
};

// Product range 2026-10-14 (BUSINESS-PLAN.md): each format has its own sizes and prices.
export const SIZES = ['14x14', '28x35', '30x40', '50x70'] as const; // 28x35 = Temu 11×14" black mat (print 20×25 inside)
export type Size = (typeof SIZES)[number];
export const DEFAULT_SIZE: Size = '30x40'; // preselected on product pages

export const FORMATS = ['print', 'framed', 'mounted', 'mini', 'edition', 'metal'] as const;
export type Format = (typeof FORMATS)[number];

// Formats offered on the site. edition/metal stay in code but hidden until tested.
export const ACTIVE_FORMATS: Format[] = ['print', 'framed', 'mounted', 'mini'];

// Which sizes each format comes in. Mounted is sized by the mat (Temu 11×14" = 28×35 cm, 20×25 print inside);
// add '20x25' (8×10" mat, ~13×18 print) once those mats are bought and tested.
export const FORMAT_SIZES: Record<Format, Size[]> = {
  print: ['30x40', '50x70'],
  framed: ['30x40', '50x70'],
  mounted: ['28x35'],
  mini: ['14x14'],
  edition: [],
  metal: [],
};

// Prices in RSD per format and size (launch proposal 2026-10-14, see BUSINESS-PLAN.md).
export const PRICES: Record<Format, Partial<Record<Size, number>>> = {
  print: { '30x40': 2490, '50x70': 3990 },
  framed: { '30x40': 5490, '50x70': 8990 },
  mounted: { '28x35': 2290 },
  mini: { '14x14': 1990 },
  edition: {},
  metal: {},
};
export const minPrice = (f: Format) => Math.min(...Object.values(PRICES[f]) as number[]);
export const MIN_PRICE = Math.min(...ACTIVE_FORMATS.map(minPrice));
export const MAX_PRICE = Math.max(...ACTIVE_FORMATS.flatMap((f) => Object.values(PRICES[f]) as number[]));

// Frame colours offered for 'framed'.
export const FRAMES = ['black', 'oak'] as const;

export const formatPrice = (n: number, lang: 'sr' | 'en') =>
  `${n.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} RSD`;
