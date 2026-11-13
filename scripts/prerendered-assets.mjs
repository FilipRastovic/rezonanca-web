// Images + maths for pieces rendered outside the shop scripts (products with pre: true, e.g. Liquid / Deep Inside).
//   node scripts/prerendered-assets.mjs [key ...]
// posters  ← scripts/gelato-posters.mjs (the exact Gelato sheet)
// details  ← a close-up from the 300 DPI print sheet (print-safe, as printed)
// math     ← src/data/math/<slug>.json (params from explore/kaos/final + explore/klein/final READMEs)
// rooms    ← scripts/render-rooms.py <keys>; then og-images + swatches for everything
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { readdirSync, existsSync, writeFileSync, copyFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { PRODUCTS } from '../src/data/products.js';

const want = process.argv.slice(2);
const list = PRODUCTS.filter((p) => p.pre && (!want.length || want.includes(p.slug)));
const keys = list.map((p) => p.slug);
const run = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit' });
run('node', ['scripts/gelato-posters.mjs', ...keys]);
for (const k of keys) for (const v of ['', '-lg']) copyFileSync(`public/posters/${k}-en${v}.webp`, `public/posters/${k}-sr${v}.webp`); // scripts that still read -sr

const ROOT = '../print-files/gelato/';
const DIRS = readdirSync(ROOT).filter((d) => d.startsWith('SPREMNO-')).sort().reverse().map((d) => ROOT + d + '/');
// Close-up: a square from the art opening (30x40 sheet: 4 mm bleed + 30 mm border, art 240 × 340 mm), where it is busiest.
const FOCUS = { 'chaos-1': [0.62, 0.3], 'chaos-2': [0.62, 0.3], 'chaos-3': [0.36, 0.5], 'inversion-1': [0.5, 0.5], 'inversion-2': [0.5, 0.5], 'inversion-3': [0.5, 0.5] };
const mm = (v) => Math.round((v / 25.4) * 300);
for (const k of keys) {
  const src = DIRS.find((d) => existsSync(d + `${k}-30x40.jpg`)) + `${k}-30x40.jpg`;
  const ax = mm(34), ay = mm(34), aw = mm(240), ah = mm(340), side = Math.round(aw * 0.42);
  const [fx, fy] = FOCUS[k] ?? [0.5, 0.5];
  const left = Math.round(Math.min(Math.max(ax + aw * fx - side / 2, ax), ax + aw - side));
  const top = Math.round(Math.min(Math.max(ay + ah * fy - side / 2, ay), ay + ah - side));
  await sharp(src).extract({ left, top, width: side, height: side }).resize(1100).webp({ quality: 86 }).toFile(`public/details/${k}.webp`);
  await sharp(`public/details/${k}.webp`).resize(320).webp({ quality: 72 }).toFile(`public/details/${k}-sm.webp`);
}

// Maths per piece (values from the approved finals' READMEs).
const CHAOS = { 'chaos-1': [6, '0.2π … 0.9π', '0.1π … π'], 'chaos-2': [6, '0 … π', '0 … 1.3π'], 'chaos-3': [5.5, '−π … 0.2π', '−π … 0.5π'] };
const INV = { 'inversion-1': [1.18, '0.3, 0.3', 0.3, 1.6], 'inversion-2': [1.3, '0.2, 0.1', 0, 1], 'inversion-3': [1.18, '0.3, 0.3', 0.3, 1.6] };
for (const p of list) {
  const m = p.style === 'chaos'
    ? { kind: 'pendulum', style: 'chaos', equations: ['L = T − V', 'd/dt ∂L/∂θ̇ᵢ = ∂L/∂θᵢ', 'h = −(cos θ₁ + cos θ₂)'],
        params: [['arms', 'equal length and mass'], ['start θ₁', CHAOS[p.slug][1]], ['start θ₂', CHAOS[p.slug][2]], ['time T', `${CHAOS[p.slug][0]} s`], ['integrator', 'RK4']],
        stats: [['pendulums', '12 000 000 (one per pixel)']] }
    : { kind: 'inversion', style: 'inversion', equations: ['x, y → fold into [−1, 1]', 'z → s·z / |z|²', 'colour = total stretch'],
        params: [['s', INV[p.slug][0]], ['offset', INV[p.slug][1]], ['rotation', INV[p.slug][2]], ['zoom', INV[p.slug][3]], ['repeats', 14]],
        stats: [['pixels', '12 000 000']] };
  writeFileSync(`src/data/math/${p.slug}.json`, JSON.stringify(m, null, 2));
}

run(homedir() + '/.venvs/rezonanca-mockup/bin/python', ['scripts/render-rooms.py', ...keys]);
run('node', ['scripts/og-images.mjs']);
run('node', ['scripts/swatches.mjs']);
console.log('✓', keys.join(' '));
