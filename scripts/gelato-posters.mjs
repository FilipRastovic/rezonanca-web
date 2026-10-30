// Product poster images from the Gelato print files (what you see is what you get: the exact sheet incl. its white border).
//   node scripts/gelato-posters.mjs [key ...]
// ../print-files/gelato/SPREMNO-*/<key>-30x40.jpg (300 DPI, 4 mm bleed) → trim the bleed →
//   public/posters/<key>-en-lg.webp (1440×1920, product page) + <key>-en.webp (900×1200, cards, cart)
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { PRODUCTS } from '../src/data/products.js';

const ROOT = new URL('../../print-files/gelato/', import.meta.url).pathname;
const DIR = ROOT + readdirSync(ROOT).filter((d) => d.startsWith('SPREMNO-')).sort().at(-1) + '/';
const BLEED = Math.round((4 / 25.4) * 300); // 4 mm at 300 DPI
const want = process.argv.slice(2);
const keys = PRODUCTS.flatMap((p) => [p.slug, ...(p.tones || []).map((t) => `${p.slug}-${t}`)]).filter((k) => !want.length || want.includes(k));
for (const k of keys) {
  const src = sharp(DIR + `${k}-30x40.jpg`);
  const { width, height } = await src.metadata();
  const trimmed = await src.extract({ left: BLEED, top: BLEED, width: width - 2 * BLEED, height: height - 2 * BLEED }).toBuffer();
  await sharp(trimmed).resize(1440, 1920, { fit: 'cover' }).webp({ quality: 86 }).toFile(`public/posters/${k}-en-lg.webp`);
  await sharp(trimmed).resize(900, 1200, { fit: 'cover' }).webp({ quality: 82 }).toFile(`public/posters/${k}-en.webp`);
  console.log(k);
}
