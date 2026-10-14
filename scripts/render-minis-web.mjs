// Square, art-only images for the "Мини у раму" view on product pages: public/minis/<key>.webp (900×900).
// Generator products: rendered with hud=0 (art only), print-safe, then cropped square around the bright core.
// Products from explore/kiber or explore/apstrakt: square crop of the cached detail render (art area, no title).
//   node scripts/render-minis-web.mjs [slug1,slug2]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PRODUCTS, imgKey } from '../src/data/products.js';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEN = path.resolve(ROOT, '../waveform-poster'), TMP = path.join(ROOT, '.asset-cache', 'minis'), OUT = path.join(ROOT, 'public', 'minis');
await fs.mkdir(TMP, { recursive: true }); await fs.mkdir(OUT, { recursive: true });
const only = process.argv[2]?.split(',');
const list = PRODUCTS.filter((p) => !only || only.includes(p.slug)).flatMap((p) => ['', ...(p.tones || [])].map((tone) => ({ p, tone, key: imgKey(p.slug, tone) })));
const external = (p) => p.style === 'object' || p.render;
async function box(file, pad = 1.3) { // square around the bright core (top ~10% brightness)
  const { width: W, height: H } = await sharp(file).metadata();
  const { data } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const bg = [data[0], data[W - 1], data[(H - 1) * W], data[H * W - 1]].sort((a, b) => a - b)[2];
  const v = []; for (let i = 0; i < data.length; i += 7) v.push(data[i]); v.sort((a, b) => a - b);
  const thr = Math.max(bg + 40, v[Math.floor(v.length * 0.9)]);
  const xs = [], ys = []; for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (data[y * W + x] > thr) { xs.push(x); ys.push(y); }
  xs.sort((a, b) => a - b); ys.sort((a, b) => a - b);
  const q = (a, f) => a[Math.floor((a.length - 1) * f)];
  const x0 = q(xs, .01), x1 = q(xs, .99), y0 = q(ys, .01), y1 = q(ys, .99);
  let s = Math.min(Math.max(x1 - x0, y1 - y0) * pad, W, H); const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  return { left: Math.round(Math.max(0, Math.min(W - s, cx - s / 2))), top: Math.round(Math.max(0, Math.min(H - s, cy - s / 2))), width: Math.round(s), height: Math.round(s) };
}
const jobs = list.filter(({ p }) => !external(p)).map(({ p, tone, key }) => ({ seed: p.seed, style: p.style, variant: p.variant, palette: p.palette, boost: p.boost, lang: 'sr-cyrl', size: '200x200mm', dpi: 180, hud: 0, ps: 0.4, ...(tone ? { tone } : {}), name: key }));
if (jobs.length) { await fs.writeFile(path.join(TMP, 'jobs.json'), JSON.stringify(jobs)); execFileSync('node', ['export.mjs', '--jobs', path.join(TMP, 'jobs.json'), '--out', TMP], { cwd: GEN, stdio: 'ignore' }); }
for (const { p, key } of list) {
  let img;
  if (external(p)) { // crop the art area out of the cached 2700×3600 detail source
    const src = path.join(ROOT, '.asset-cache', `${key}-detail.png`);
    img = sharp(src).extract({ left: Math.round(2700 * 0.11), top: Math.round(3600 * 0.40 - 2700 * 0.39), width: Math.round(2700 * 0.78), height: Math.round(2700 * 0.78) });
  } else {
    const src = path.join(TMP, `${key}.png`);
    img = sharp(src).extract(await box(src));
  }
  await img.resize(900, 900).webp({ quality: 86 }).toFile(path.join(OUT, `${key}.webp`));
}
console.log(`✓ ${list.length} mini images`);
