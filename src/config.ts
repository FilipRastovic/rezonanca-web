// Shop settings - edit these before going live.
export const SHOP = {
  name: 'Резонанца',
  email: 'filiporastovic@gmail.com',
  phone: '+381 63 171 4561',
  instagram: '', // add the profile URL when the account exists; hidden while empty
  // Free key from https://web3forms.com (orders are emailed to the address you register there).
  // While this is 'TODO' the order form runs in demo mode and only logs the order to the console.
  web3formsKey: 'TODO',
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
