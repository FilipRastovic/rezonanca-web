// Sales switch. false = "coming soon": prices hidden, cart/checkout disabled, product pages collect
// waitlist signups (emailed via FormSubmit like orders). Set to true once prices are final.
export const SALES_OPEN = false;
// Prices shown on the site even while sales are closed (waitlist instead of ordering). Filip, 2026-10-14.
export const PRICES_VISIBLE = true; // Gelato EUR prices shown 2026-10-30 (Filip); hidden 2026-10-29 until then

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
  currency: 'EUR',
  shipping: 0, // included in the price (Gelato ships worldwide)
};

// Legal seller details (Agencija za privredne registre).
// Card payments (Raiffeisen e-commerce via the UPC gateway). api = the payments Worker (rezonanca-web/worker).
// cards = card option at checkout + the bank's required logos (Prilog 1) in the footer and checkout.
export const PAYMENTS = {
  cards: true, // true once the Worker is deployed and the bank's test passes
  api: 'https://rezonanca-payments.filiporastovic.workers.dev',
};

export const SELLER = {
  name: 'FILIP RASTOVIĆ PR SREMSKA KAMENICA',
  mb: '67800826',
  pib: '114718565',
  address: 'Slavka Rodića 40, 21208 Sremska Kamenica, Srbija',
  activity: '6201 - Računarsko programiranje', // pretežna delatnost + šifra (Prilog 1, APR)
};

// Analytics. Both load only after the visitor accepts cookies (Consent.astro). An empty string disables it.
export const ANALYTICS = {
  metaPixel: '28640408028947508', // Events Manager → dataset rezonanca.art
  ga4: 'G-FKNVF77VNE', // GA4 Measurement ID (property rezonanca.art)
  clarity: 'yzmig7kv3w', // Microsoft Clarity project ID (heatmaps + session recordings)
};

// Product range 2026-10-30: only what Gelato prints (BUSINESS-PLAN.md section 5, "EN range on Gelato").
// Both sizes are 3:4 like the art. Minis, mounted and 50×70 are gone (Gelato can't make them).
export const SIZES = ['30x40', '45x60'] as const;
export type Size = (typeof SIZES)[number];
export const DEFAULT_SIZE: Size = '30x40'; // preselected on product pages

export const FORMATS = ['print', 'framed', 'mounted', 'mini', 'miniprint', 'edition', 'metal'] as const;
export type Format = (typeof FORMATS)[number];

// Formats offered on the site: Gelato Fine Art poster, unframed or in a 12 mm wood frame with plexiglass.
export const ACTIVE_FORMATS: Format[] = ['print', 'framed'];

export const FORMAT_SIZES: Record<Format, Size[]> = {
  print: ['30x40', '45x60'],
  framed: ['30x40', '45x60'],
  mounted: [],
  mini: [],
  miniprint: [],
  edition: [],
  metal: [],
};

// Prices in EUR incl. shipping (Business, 2026-10-28). USD for outside Europe once the bank answers.
export const PRICES: Record<Format, Partial<Record<Size, number>>> = {
  print: { '30x40': 39, '45x60': 55 },
  framed: { '30x40': 99, '45x60': 149 },
  mounted: {},
  mini: {},
  miniprint: {},
  edition: {},
  metal: {},
};
export const minPrice = (f: Format) => Math.min(...Object.values(PRICES[f]) as number[]);
export const MIN_PRICE = Math.min(...ACTIVE_FORMATS.map(minPrice));
export const MAX_PRICE = Math.max(...ACTIVE_FORMATS.flatMap((f) => Object.values(PRICES[f]) as number[]));

// Gelato product per format, size and frame (checked against the Gelato product API 2026-10-30).
const GP = (s: string) => `${s}_200-gsm-80lb-enhanced-uncoated`;
const GSIZE: Record<Size, string> = { '30x40': '300x400-mm-12x16-inch', '45x60': '450x600-mm-18x24-inch' };
const GFRAME = { black: 'black_wood', oak: 'natural-wood_wood' } as const;
export const gelatoProduct = (format: Format, size: Size, frame: 'black' | 'oak' = 'black') =>
  format === 'framed'
    ? GP(`framed_fine_arts_poster_geo_simplified_product_12-0_${GFRAME[frame]}_w12xt22-mm_plexiglass_ver_${GSIZE[size]}_${GSIZE[size]}`)
    : GP(`fine_arts_poster_geo_simplified_product_12-0_ver_${GSIZE[size]}`);

// Frame colours offered for 'framed'. 'oak' = Gelato's natural wood (key kept: room shots are named after it).
export const FRAMES = ['black', 'oak'] as const;

export const formatPrice = (n: number, _lang?: 'sr' | 'en') => `€${n.toLocaleString('en-US')}`;
