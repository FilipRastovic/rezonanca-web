// Shop settings - edit these before going live.
export const SHOP = {
  name: 'Резонанца',
  email: 'filiporastovic@gmail.com',
  phone: '+381 63 171 4561',
  instagram: '', // add the profile URL when the account exists; hidden while empty
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

export const SIZES = ['30x40', '50x70', '61x91'] as const;
export type Size = (typeof SIZES)[number];

export const FORMATS = ['print', 'framed', 'edition', 'metal'] as const;
export type Format = (typeof FORMATS)[number];

// Prices in RSD per format and size.
export const PRICES: Record<Format, Record<Size, number>> = {
  print:   { '30x40': 2900,  '50x70': 4900,  '61x91': 6900 },
  framed:  { '30x40': 6900,  '50x70': 10900, '61x91': 14900 },
  edition: { '30x40': 9900,  '50x70': 14900, '61x91': 19900 },
  metal:   { '30x40': 14900, '50x70': 22900, '61x91': 29900 },
};

export const FRAMES = ['black', 'white', 'oak'] as const;

export const formatPrice = (n: number, lang: 'sr' | 'en') =>
  `${n.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} RSD`;
