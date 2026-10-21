// One colour dot per poster/colourway: the colour you see first. Every pixel votes for its hue, weighted by
// saturation × brightness² (so a pink ground or bright cyan lines win, a near-black ground doesn't); the swatch is
// the mean colour of the winning hue band, lifted to a readable brightness.
//   node scripts/swatches.mjs  → src/data/swatches.json  { "<key>": "#rrggbb" }
import fs from 'node:fs';
import sharp from 'sharp';
import { PRODUCTS, imgKey } from '../src/data/products.js';

const BINS = 24;
const hsv = (r, g, b) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, mx ? d / mx : 0, mx / 255];
};
const out = {};
for (const p of PRODUCTS) {
  for (const tone of ['', ...(p.tones || [])]) {
    const key = imgKey(p.slug, tone);
    if (tone === 'tus') { out[key] = '#121417'; continue; } // Туш = black ink on white paper
    const { data } = await sharp(`public/posters/${key}-sr.webp`).resize(150).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const w = new Float64Array(BINS), sum = Array.from({ length: BINS }, () => [0, 0, 0]);
    for (let i = 0; i < data.length; i += 3) {
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      const [h, s, v] = hsv(r, g, b);
      const k = Math.floor(h / (360 / BINS)) % BINS, wt = s * v * v;
      w[k] += wt; sum[k][0] += r * wt; sum[k][1] += g * wt; sum[k][2] += b * wt;
    }
    // best band = strongest bin plus its neighbours
    let best = 0, bs = -1;
    for (let k = 0; k < BINS; k++) { const s = w[k] + w[(k + 1) % BINS] + w[(k + BINS - 1) % BINS]; if (s > bs) { bs = s; best = k; } }
    const ks = [best, (best + 1) % BINS, (best + BINS - 1) % BINS];
    const tw = ks.reduce((a, k) => a + w[k], 0) || 1;
    let c = [0, 1, 2].map((j) => ks.reduce((a, k) => a + sum[k][j], 0) / tw);
    const lift = 205 / Math.max(...c, 1);  // readable dot, never white
    if (lift > 1) c = c.map((v) => Math.min(255, v * lift));
    out[key] = '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  }
}
fs.writeFileSync('src/data/swatches.json', JSON.stringify(out, null, 0) + '\n');
console.log(Object.keys(out).length, 'swatches');
