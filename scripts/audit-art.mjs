// Colour audit for rendered artwork (Filip's rule: bright + saturated, never blown-out white).
//
//   node scripts/audit-art.mjs                      audit all 30 masters in .asset-cache (after npm run assets)
//   node scripts/audit-art.mjs --compare <git-ref>  compare saturation vs the site images at a git commit
//
// Per piece: sat (value-weighted saturation, 1 = fully saturated), chroma (colour intensity),
// bg (chroma of background tones), white% (pixels with all channels >= 240), max channel.
// Pass criteria: white% = 0 and max <= 240 in every master.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { PRODUCTS } from '../src/data/products.js';

const args = process.argv.slice(2);
const ref = args[args.indexOf('--compare') + 1];
const comparing = args.includes('--compare');

async function stat(input) {
  const img = sharp(input, { limitInputPixels: false });
  const m = await img.metadata();
  const { data } = await img
    .extract({ left: Math.round(m.width * 0.06), top: Math.round(m.height * 0.08), width: Math.round(m.width * 0.88), height: Math.round(m.height * 0.62) })
    .resize({ width: 500, kernel: 'linear' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let chroma = 0, satW = 0, wsum = 0, white = 0, bgS = 0, bgN = 0, max = 0;
  const n = data.length / 3;
  for (let i = 0; i < data.length; i += 3) {
    const mx = Math.max(data[i], data[i + 1], data[i + 2]), mn = Math.min(data[i], data[i + 1], data[i + 2]);
    chroma += mx - mn;
    if (mx > 40) { satW += mx - mn; wsum += mx; } else { bgS += mx - mn; bgN++; }
    if (mn >= 240) white++;
    if (mx > max) max = mx;
  }
  return { sat: satW / wsum, chroma: chroma / n, bg: bgS / Math.max(1, bgN), white: (100 * white) / n, max };
}

const f = (x, d = 3) => x.toFixed(d);
let fail = 0, tA = 0, tB = 0;
for (const p of PRODUCTS) {
  const master = path.join('.asset-cache', `${p.slug}-sr.png`);
  if (!fs.existsSync(master)) { console.log(`${p.slug}: no master in .asset-cache (run npm run assets)`); continue; }
  const b = await stat(master);
  if (b.white > 0 || b.max > 240) fail++;
  if (comparing) {
    const buf = execSync(`git show ${ref}:public/posters/${p.slug}-sr-lg.webp`, { maxBuffer: 64 << 20 });
    const a = await stat(buf);
    tA += a.sat; tB += b.sat;
    console.log(p.slug.padEnd(18), `sat ${f(a.sat)} -> ${f(b.sat)}  chroma ${f(a.chroma, 1)} -> ${f(b.chroma, 1)}  bg ${f(a.bg, 1)} -> ${f(b.bg, 1)}  white% ${f(b.white, 2)}  max ${b.max}`);
  } else {
    console.log(p.slug.padEnd(18), `sat ${f(b.sat)}  chroma ${f(b.chroma, 1)}  bg ${f(b.bg, 1)}  white% ${f(b.white, 2)}  max ${b.max}`);
  }
}
if (comparing) console.log(`MEAN SAT ${f(tA / PRODUCTS.length)} -> ${f(tB / PRODUCTS.length)}`);
console.log(fail ? `✗ ${fail} piece(s) blow out (white% > 0 or max > 240)` : '✓ no blown-out highlights');
process.exit(fail ? 1 : 0);
