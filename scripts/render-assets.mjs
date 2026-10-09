// Renders all shop imagery from the poster generator in ../waveform-poster:
//   public/posters/<slug>-<lang>.webp        catalogue card (900w)
//   public/posters/<slug>-<lang>-lg.webp     product page main image (1440w)
//   public/details/<slug>.webp               close-up of the artwork (language-free)
//   public/rooms/<slug>-<lang>.webp          the poster in a room (product gallery)
//   public/interiors/<scene>-<lang>.webp     homepage room scenes
//   public/og-<lang>.jpg                     social share image
//
//   node scripts/render-assets.mjs                 everything
//   node scripts/render-assets.mjs slug1,slug2     only these products
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PRODUCTS, findProduct } from '../src/data/products.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEN = path.resolve(ROOT, '../waveform-poster');
const TMP = path.join(ROOT, '.asset-cache');
const LANGS = { sr: 'sr-cyrl', en: 'en' };
const out = (...p) => path.join(ROOT, 'public', ...p);

for (const d of ['posters', 'details', 'rooms', 'interiors']) await fs.mkdir(out(d), { recursive: true });
await fs.mkdir(TMP, { recursive: true });

const only = process.argv[2] ? process.argv[2].split(',') : null;
const products = only ? PRODUCTS.filter((p) => only.includes(p.slug)) : PRODUCTS;
const posterPng = (slug, lang) => path.join(TMP, `${slug}-${lang}.png`);
const detailPng = (slug) => path.join(TMP, `${slug}-detail.png`);

// 1. Render with the existing exporter: 80 DPI per language, 150 DPI once for detail crops.
const jobs = [];
for (const p of products) {
  const base = { seed: p.seed, style: p.style, variant: p.variant, palette: p.palette };
  for (const [lang, code] of Object.entries(LANGS)) jobs.push({ ...base, lang: code, dpi: 80, name: `${p.slug}-${lang}` });
  jobs.push({ ...base, lang: 'sr-cyrl', dpi: 150, name: `${p.slug}-detail` });
}
const jobsFile = path.join(TMP, 'jobs.json');
await fs.writeFile(jobsFile, JSON.stringify(jobs));
execFileSync('node', ['export.mjs', '--jobs', jobsFile, '--out', TMP], { cwd: GEN, stdio: 'inherit' });

// Where the artwork sits on the poster, per style (fractions of width/height) - used for the detail crop.
const ART_CENTRE = { structure: [0.5, 0.42], flux: [0.5, 0.42], city: [0.5, 0.4], ridges: [0.5, 0.45], orbit: [0.5, 0.44] };

for (const p of products) {
  for (const lang of Object.keys(LANGS)) {
    await sharp(posterPng(p.slug, lang)).resize({ width: 900 }).webp({ quality: 84 }).toFile(out('posters', `${p.slug}-${lang}.webp`));
    await sharp(posterPng(p.slug, lang)).webp({ quality: 86 }).toFile(out('posters', `${p.slug}-${lang}-lg.webp`));
  }
  const img = sharp(detailPng(p.slug));
  const { width, height } = await img.metadata();
  const [fx, fy] = p.variant === 'tree' ? [0.5, 0.55] : ART_CENTRE[p.style];
  const s = Math.round(width * 0.46);
  await img.extract({ left: Math.round(width * fx - s / 2), top: Math.round(height * fy - s / 2), width: s, height: s })
    .resize({ width: 1100 }).webp({ quality: 86 }).toFile(out('details', `${p.slug}.webp`));
}

// 2. Room scenes: SVG silhouettes, posters composited onto the wall.
const W = 1600, H = 1000;
const defs = (lampX, lampY) => `
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#05070d"/><stop offset="1" stop-color="#0a1426"/></linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070a12"/><stop offset="1" stop-color="#020306"/></linearGradient>
    <radialGradient id="lamp" cx="${lampX}" cy="${lampY}" r="0.55"><stop offset="0" stop-color="#ffcf9a" stop-opacity="0.22"/><stop offset="1" stop-color="#ffcf9a" stop-opacity="0"/></radialGradient>
    <filter id="blur"><feGaussianBlur stdDeviation="40"/></filter>
    <filter id="soft"><feGaussianBlur stdDeviation="6"/></filter>
  </defs>`;
// Wall glow tinted by the poster's palette.
const GLOW = { cyan: '#2a8cff', ice: '#8fa6c8', violet: '#7a4dff', aurora: '#11c9a8', ember: '#ff9a4a' };
const glowBehind = (x, y, w, h, c) =>
  `<rect x="${x - 30}" y="${y - 30}" width="${w + 60}" height="${h + 60}" fill="${c}" opacity="0.26" filter="url(#blur)"/>
   <rect x="${x + 14}" y="${y + 26}" width="${w}" height="${h}" fill="#000" opacity="0.7" filter="url(#soft)"/>`;

const SCENES = {
  living: {
    floorY: 800, lamp: [0.15, 0.3],
    svg: `<rect x="420" y="640" width="760" height="150" rx="26" fill="#0b0f18"/>
      <rect x="440" y="600" width="720" height="90" rx="22" fill="#0e1320"/>
      <rect x="400" y="650" width="70" height="140" rx="20" fill="#0c111b"/><rect x="1130" y="650" width="70" height="140" rx="20" fill="#0c111b"/>
      <rect x="470" y="790" width="14" height="22" fill="#05070b"/><rect x="1116" y="790" width="14" height="22" fill="#05070b"/>
      <rect x="236" y="300" width="6" height="500" fill="#121722"/><path d="M190 300 L288 300 L270 230 L208 230 Z" fill="#1a1f2b"/>
      <ellipse cx="239" cy="805" rx="50" ry="8" fill="#0b0e15"/>
      <rect x="1290" y="700" width="90" height="100" rx="8" fill="#0d121c"/>
      <path d="M1335 700 C1300 600 1250 560 1230 520 M1335 700 C1340 590 1360 540 1400 490 M1335 700 C1380 630 1420 610 1460 600 M1335 700 C1310 640 1270 640 1240 630" stroke="#0f1724" stroke-width="16" fill="none" stroke-linecap="round"/>`,
  },
  studio: {
    floorY: 820, lamp: [0.3, 0.2],
    svg: `<rect x="160" y="600" width="760" height="22" fill="#121826"/>
      <rect x="180" y="622" width="16" height="200" fill="#0b0f18"/><rect x="884" y="622" width="16" height="200" fill="#0b0f18"/>
      <rect x="250" y="390" width="330" height="190" rx="8" fill="#0a0e17" stroke="#16304f" stroke-width="3"/>
      <path d="M270 520 Q330 440 380 500 T490 470 T560 500" stroke="#2f9bff" stroke-width="3" fill="none" opacity="0.7"/>
      <rect x="405" y="580" width="20" height="20" fill="#0d121c"/>
      <rect x="610" y="430" width="230" height="150" rx="8" fill="#0a0e17" stroke="#16304f" stroke-width="3"/>
      <rect x="628" y="450" width="194" height="6" fill="#1f5fae" opacity="0.6"/><rect x="628" y="466" width="140" height="6" fill="#1f5fae" opacity="0.4"/>
      <rect x="715" y="580" width="20" height="20" fill="#0d121c"/>
      <rect x="300" y="560" width="300" height="36" rx="4" fill="#0f1420"/>
      ${Array.from({ length: 18 }, (_, k) => `<rect x="${310 + k * 16}" y="572" width="10" height="20" fill="#1b2232"/>`).join('')}
      <rect x="170" y="470" width="66" height="128" rx="6" fill="#0d121c"/><circle cx="203" cy="550" r="22" fill="#080b12"/>
      <path d="M520 690 Q560 640 640 650 L650 760 L520 760 Z" fill="#0b0f18"/><rect x="575" y="760" width="12" height="60" fill="#080b12"/>`,
  },
  hall: {
    floorY: 800, lamp: [0.5, 0.0],
    svg: `<rect x="440" y="680" width="720" height="26" rx="6" fill="#121826"/>
      <rect x="480" y="706" width="14" height="94" fill="#0b0f18"/><rect x="1106" y="706" width="14" height="94" fill="#0b0f18"/>
      <rect x="1020" y="610" width="40" height="70" rx="14" fill="#0f1522"/>
      <rect x="560" y="660" width="120" height="20" fill="#0e1320"/><rect x="570" y="642" width="100" height="18" fill="#111827"/>
      <rect x="0" y="80" width="${W}" height="3" fill="#2a8cff" opacity="0.12"/>`,
  },
};

async function room(scene, frames, file) {
  const sc = SCENES[scene];
  const fr = frames.map((f) => ({ ...f, h: Math.round((f.w * 4) / 3) }));
  const bg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${defs(...sc.lamp)}
    <rect width="${W}" height="${sc.floorY}" fill="url(#wall)"/>
    <rect y="${sc.floorY}" width="${W}" height="${H - sc.floorY}" fill="url(#floor)"/>
    <rect y="${sc.floorY}" width="${W}" height="2" fill="#1a2436"/>
    <rect width="${W}" height="${H}" fill="url(#lamp)"/>
    ${fr.map((f) => glowBehind(f.x, f.y, f.w, f.h, GLOW[f.palette] || GLOW.cyan)).join('')}
    ${sc.svg}</svg>`;
  const layers = [];
  for (const f of fr) {
    const border = 10;
    const art = await sharp(f.file).resize({ width: f.w - border * 2, height: f.h - border * 2 }).toBuffer();
    const framed = await sharp({ create: { width: f.w, height: f.h, channels: 3, background: '#0b0b0d' } })
      .composite([{ input: art, left: border, top: border }]).png().toBuffer();
    layers.push({ input: framed, left: f.x, top: f.y });
  }
  await sharp(Buffer.from(bg)).composite(layers).webp({ quality: 82 }).toFile(file);
}

// Per-product room shot (living room) for the product gallery.
for (const p of products) {
  for (const lang of Object.keys(LANGS)) {
    await room('living', [{ x: 650, y: 110, w: 300, file: posterPng(p.slug, lang), palette: p.palette }], out('rooms', `${p.slug}-${lang}.webp`));
  }
}

// Homepage interiors + social share image.
if (!only) {
  const HOME = {
    living: [{ slug: 'predajnik', x: 650, y: 110, w: 300 }],
    studio: [{ slug: 'metropola', x: 980, y: 120, w: 360 }],
    hall: [{ slug: 'dvostruka-spirala', x: 430, y: 170, w: 300 }, { slug: 'galaksija', x: 870, y: 170, w: 300 }],
  };
  for (const [scene, frames] of Object.entries(HOME)) {
    for (const lang of Object.keys(LANGS)) {
      await room(scene, frames.map((f) => ({ ...f, file: posterPng(f.slug, lang), palette: findProduct(f.slug).palette })), out('interiors', `${scene}-${lang}.webp`));
    }
  }
  for (const lang of Object.keys(LANGS)) {
    const art = await sharp(posterPng('predajnik', lang)).resize({ height: 630 }).toBuffer();
    const label = lang === 'sr' ? 'РЕЗОНАНЦА' : 'REZONANCA';
    const sub = lang === 'sr' ? 'Звук, заустављен у светлости.' : 'Sound, frozen in light.';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#02060f"/>
      <text x="520" y="300" font-family="Unbounded, Verdana, sans-serif" font-weight="700" font-size="64" letter-spacing="8" fill="#d7faff">${label}</text>
      <text x="524" y="360" font-family="JetBrains Mono, Menlo, monospace" font-size="24" letter-spacing="3" fill="#50e6ff">${sub}</text></svg>`;
    await sharp(Buffer.from(svg)).composite([{ input: art, left: 0, top: 0 }]).jpeg({ quality: 85 }).toFile(out(`og-${lang}.jpg`));
  }
}
console.log(`✓ assets for ${products.length} products`);
