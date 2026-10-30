// Framed product images = Gelato's own preview of each framed variant (their frame + our exact print file).
//   node scripts/gelato-previews.mjs [key ...]
// Makes Gelato draft orders (never printed or charged; deleted right after), 10 items each, reads each item's
// preview_default and saves public/framed/<key>-<black|oak>.webp (oak = Gelato natural wood). 30×40 variant.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { PRODUCTS } from '../src/data/products.js';
import { gelatoProduct } from '../src/config.ts';

const key = readFileSync(homedir() + '/.config/rezonanca/gelato-api-key', 'utf8').trim();
const token = readFileSync(homedir() + '/.config/rezonanca/print-file-token', 'utf8').trim();
const H = { 'X-API-KEY': key, 'Content-Type': 'application/json', 'User-Agent': 'rezonanca/1.0' };
const API = 'https://order.gelatoapis.com/v4/orders';
const api = async (method, url, body) => {
  const r = await fetch(url, { method, headers: H, body: body && JSON.stringify(body) });
  if (!r.ok) throw new Error(`${method} ${url.replace(API, '')} ${r.status} ${await r.text()}`);
  return r.json();
};
const want = process.argv.slice(2);
const keys = PRODUCTS.flatMap((p) => [p.slug, ...(p.tones || []).map((t) => `${p.slug}-${t}`)]).filter((k) => !want.length || want.includes(k));
const jobs = keys.flatMap((k) => ['black', 'oak'].map((fr) => ({ k, fr })));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

for (let i = 0; i < jobs.length; i += 10) {
  const batch = jobs.slice(i, i + 10);
  const o = await api('POST', API, {
    orderType: 'draft', orderReferenceId: `RZ-PREVIEW-${i}`, customerReferenceId: 'rz-previews', currency: 'EUR',
    items: batch.map(({ k, fr }) => ({ itemReferenceId: `${k}|${fr}`, productUid: gelatoProduct('framed', '30x40', fr), quantity: 1,
      files: [{ type: 'default', url: `https://rezonanca-files.filiporastovic.workers.dev/f/${token}/${k}-30x40.pdf` }] })),
    shippingAddress: { firstName: 'Preview', lastName: 'Draft', addressLine1: 'Alexanderplatz 1', city: 'Berlin', postCode: '10178', country: 'DE', email: 'filiporastovic@gmail.com' },
  });
  try {
    let left = new Set(batch.map((b) => `${b.k}|${b.fr}`));
    for (let t = 0; t < 20 && left.size; t++) {
      await sleep(10000);
      const d = await api('GET', `${API}/${o.id}`);
      for (const it of d.items) {
        const p = (it.previews || []).find((x) => x.type === 'preview_default');
        if (!p || !left.has(it.itemReferenceId)) continue;
        const img = Buffer.from(await (await fetch(p.url, { headers: { 'User-Agent': 'rezonanca/1.0' } })).arrayBuffer());
        const [k, fr] = it.itemReferenceId.split('|');
        await sharp(img).flatten({ background: '#f4f3ef' }).resize({ height: 1200 }).webp({ quality: 84 }).toFile(`public/framed/${k}-${fr}.webp`);
        left.delete(it.itemReferenceId);
        console.log(k, fr);
      }
    }
    if (left.size) console.log('MISSING', [...left].join(' '));
  } finally {
    await api('DELETE', `${API}/${o.id}`).catch((e) => console.log('delete failed', o.id, e.message));
  }
}
