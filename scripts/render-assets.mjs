// Renders all shop imagery from the poster generator in ../waveform-poster:
//   public/posters/<slug>-<lang>.webp        catalogue card (900w)
//   public/posters/<slug>-<lang>-lg.webp     product page main image (1440w)
//   public/details/<slug>.webp               close-up of the artwork (language-free)
//   public/rooms/<slug>-<lang>(-sm).webp     the poster in a room (via scripts/render-rooms.py; gallery + card hover)
//   public/interiors/<scene>-<lang>.webp     homepage room scenes
//   public/og-<lang>.jpg                     social share image
//   src/data/math/<slug>.json                equations, parameters and measurements of each render
//
//   node scripts/render-assets.mjs                 everything
//   node scripts/render-assets.mjs slug1,slug2     only these products
//   node scripts/render-assets.mjs --rooms-only    reuse cached renders; rebuild room shots + homepage interiors
//   node scripts/render-assets.mjs --tones-only    only the colourway images (<slug>-<tone>-…), originals untouched
// Colourways (product.tones) get the same set under <slug>-<tone>: posters, details and rooms.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { PRODUCTS, findProduct, imgKey } from '../src/data/products.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEN = path.resolve(ROOT, '../waveform-poster');
const TMP = path.join(ROOT, '.asset-cache');
const LANGS = { sr: 'sr-cyrl', en: 'en' };
// Print-safe colours (waveform-poster/print-safe.py): the shop shows what the matte print really looks like.
const PS = 0.4;
const out = (...p) => path.join(ROOT, 'public', ...p);

for (const d of ['posters', 'details', 'rooms', 'interiors']) await fs.mkdir(out(d), { recursive: true });
await fs.mkdir(TMP, { recursive: true });

const roomsOnly = process.argv.includes('--rooms-only');
const tonesOnly = process.argv.includes('--tones-only');
const arg = process.argv.slice(2).find((a) => !a.startsWith('--'));
const only = arg ? arg.split(',') : null;
const products = only ? PRODUCTS.filter((p) => only.includes(p.slug)) : PRODUCTS;
// Every image set to build: the original ('' tone) and each colourway.
const sets = products.flatMap((p) => [...(tonesOnly ? [] : ['']), ...(p.tones || [])].map((tone) => ({ p, tone, key: imgKey(p.slug, tone) })));
const posterPng = (slug, lang) => path.join(TMP, `${slug}-${lang}.png`);
const detailPng = (slug) => path.join(TMP, `${slug}-detail.png`);

// 1. Render with the existing exporter: 80 DPI per language, 150 DPI once for detail crops.
const jobs = [];
for (const { p, tone, key } of sets) {
  const base = { seed: p.seed, style: p.style, variant: p.variant, palette: p.palette, boost: p.boost, ps: PS, ...(tone ? { tone } : {}) };
  for (const [lang, code] of Object.entries(LANGS)) jobs.push({ ...base, lang: code, dpi: 80, name: `${key}-${lang}` });
  jobs.push({ ...base, lang: 'sr-cyrl', dpi: 150, name: `${key}-detail` });
}
const jobsFile = path.join(TMP, 'jobs.json');
const external = new Set(PRODUCTS.filter((x) => x.style === 'object' || x.render).map((x) => x.seed + '|' + x.style + '|' + x.variant));
const genJobs = jobs.filter((j) => !external.has(j.seed + '|' + j.style + '|' + j.variant)); // rendered by explore/kiber or explore/apstrakt, below
await fs.writeFile(jobsFile, JSON.stringify(genJobs));
if (!roomsOnly && genJobs.length) execFileSync('node', ['export.mjs', '--jobs', jobsFile, '--out', TMP], { cwd: GEN, stdio: 'inherit' });

// Објекти: particle worlds from explore/kiber/kiber.html (mode=objekat), rendered at the approved 1500×2000,
// made print-safe like everything else, then scaled to the poster PNG size (1440×1920) and a 2700×3600 detail source.
const KIBER = path.resolve(ROOT, '../explore/kiber');
const KPAL = { ember: 'zar', violet: 'neon', aurora: 'kiselina', ice: 'led', cyan: 'led' };
const objects = sets.filter(({ p }) => p.style === 'object' || p.render);
if (!roomsOnly && objects.length) {
  const APS = path.resolve(ROOT, '../explore/apstrakt');
  const { default: puppeteer } = await import('puppeteer-core');
  const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 2000 });
  for (const { p, key } of objects) {
    const url = (lang) => p.render
      ? `file://${APS}/apstrakt.html?mode=${p.render[0]}&seed=${p.render[1]}&pal=${p.render[2]}&w=1500&h=2000&lang=${lang}`
      : `file://${KIBER}/kiber.html?mode=objekat&seed=${p.seed}&pal=${KPAL[p.palette]}&w=1500&h=2000&lang=${lang}`;
    for (const [lang] of Object.entries(LANGS)) {
      await page.goto(url(lang));
      await page.waitForFunction('window.__done === true', { timeout: 600000 });
      const raw = path.join(TMP, `${key}-${lang}.raw.png`);
      await page.screenshot({ path: raw, type: 'png' });
      execFileSync('/usr/bin/python3', [path.join(GEN, 'print-safe.py'), raw, raw, String(PS)]);
      await sharp(raw).resize(1440, 1920).png().toFile(posterPng(key, lang));
      if (lang === 'sr') await sharp(raw).resize(2700, 3600, { kernel: 'lanczos3' }).png().toFile(detailPng(key));
      await fs.rm(raw);
    }
    const eqs = { atraktor: null, hopf: ['S¹ → S³ → S²', '(z₁, z₂) ↦ (2z₁z̄₂, |z₁|² − |z₂|²)', 'p ↦ (x, y, z) / (1 − w)'], plamen: ['xₙ₊₁ = Fᵢ(xₙ)', 'F(x) = Σ wⱼ·Vⱼ(Ax + b)', 'L = log(1 + n) / log(1 + nₘₐₓ)'] };
    const sysEq = { 1: ["x' = −y − z", "y' = x + 0,2y", "z' = 0,2 + z(x − 5,7)"], 2: ["x' = 35(y − x)", "y' = −7x − xz + 28y", "z' = xy − 3z"], 3: ["x' = y − 3x + 2,7yz", "y' = 1,7y − xz + z", "z' = 2xy − 9z"],
      4: ["x' = y + 2,07xy + xz", "y' = 1 − 1,79x² + yz", "z' = x − x² − y²"], 5: ["x' = y(z − 1 + x²) + 0,87x", "y' = x(3z + 1 − x²) + 0,87y", "z' = −2z(1,1 + xy)"], 6: ["x' = 0,2x + yz", "y' = 0,01x − 0,4y − xz", "z' = −z − xy"] };
    const math = p.render
      ? { kind: p.render[0], style: p.style, equations: p.render[0] === 'atraktor' ? sysEq[p.render[1]] : eqs[p.render[0]],
          params: [['seed', p.render[1]], ...(p.render[0] === 'atraktor' ? [['integrator', 'RK4']] : [])],
          stats: p.render[0] === 'plamen' ? [['particles', '≈ 10 000 000']] : p.render[0] === 'hopf' ? [['fibres', '100 - 320']] : [['steps', 340000]] }
      : { kind: 'object', style: 'object', equations: ['x² + y² + z² = r²', "x' = f·x / (z + d)", 'L(p) = Σ wᵢ'],
          params: [['seed', p.seed], ['camera', 'f = 1,25·min(W, H)']], stats: [['particles', '≈ 2 000 000'], ['layers', 9]] };
    await fs.writeFile(path.join(TMP, `${p.slug}-sr.math.json`), JSON.stringify(math, null, 2));
    console.log(`✓ ${key} (${p.render ? 'apstrakt ' + p.render.join(' ') : 'kiber objekat ' + p.seed})`);
  }
  await browser.close();
}

// Where the artwork sits on the poster, per style (fractions of width/height) - used for the detail crop.
const ART_CENTRE = { object: [0.5, 0.42], hopf: [0.5, 0.4], flame: [0.5, 0.4], structure: [0.5, 0.42], flux: [0.5, 0.42], city: [0.5, 0.4], attractor: [0.5, 0.41], mandelbrot: [0.5, 0.41], ridges: [0.5, 0.45], orbit: [0.5, 0.44] };

// Maths metadata recorded during the render -> src/data/math/<slug>.json (product page reads it).
await fs.mkdir(path.join(ROOT, 'src/data/math'), { recursive: true });
for (const p of roomsOnly || tonesOnly ? [] : products) {
  const src = path.join(TMP, `${p.slug}-sr.math.json`);
  await fs.copyFile(src, path.join(ROOT, 'src/data/math', `${p.slug}.json`));
}

for (const { p, key } of roomsOnly ? [] : sets) {
  for (const lang of Object.keys(LANGS)) {
    await sharp(posterPng(key, lang)).resize({ width: 900 }).webp({ quality: 84 }).toFile(out('posters', `${key}-${lang}.webp`));
    await sharp(posterPng(key, lang)).webp({ quality: 86 }).toFile(out('posters', `${key}-${lang}-lg.webp`));
  }
  const img = sharp(detailPng(key));
  const { width, height } = await img.metadata();
  const [fx, fy] = p.variant === 'tree' ? [0.5, 0.55] : ART_CENTRE[p.style];
  const s = Math.round(width * 0.46);
  await img.extract({ left: Math.round(width * fx - s / 2), top: Math.round(height * fy - s / 2), width: s, height: s })
    .resize({ width: 1100 }).webp({ quality: 86 }).toFile(out('details', `${key}.webp`));
  await sharp(out('details', `${key}.webp`)).resize(320).webp({ quality: 72 }).toFile(out('details', `${key}-sm.webp`)); // gallery thumb
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
const GLOW = { cyan: '#2a8cff', ice: '#8fa6c8', violet: '#7a4dff', aurora: '#11c9a8', ember: '#ff9a4a', roza: '#e0508a' };
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
    // Thin black frame + off-white gallery mat (same look as the site's cards).
    const frame = Math.max(5, Math.round(f.w * 0.022));
    const pad = Math.round(f.w * 0.075);
    const aw = f.w - 2 * (frame + pad), ah = f.h - 2 * (frame + pad);
    const art = await sharp(f.file).resize({ width: aw, height: ah }).toBuffer();
    const bevel = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${aw + 4}" height="${ah + 4}"><rect x="0.5" y="0.5" width="${aw + 3}" height="${ah + 3}" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="2"/></svg>`);
    const mat = await sharp({ create: { width: f.w - 2 * frame, height: f.h - 2 * frame, channels: 3, background: '#e4e2dc' } })
      .composite([{ input: bevel, left: pad - 2, top: pad - 2 }, { input: art, left: pad, top: pad }]).png().toBuffer();
    const framed = await sharp({ create: { width: f.w, height: f.h, channels: 3, background: '#0d0d0f' } })
      .composite([{ input: mat, left: frame, top: frame }]).png().toBuffer();
    layers.push({ input: framed, left: f.x, top: f.y });
  }
  await sharp(Buffer.from(bg)).composite(layers).webp({ quality: 82 }).toFile(file);
}

// Per-product room shot for the product gallery + card hover: the approved black-frame mockup scenes
// (scripts/render-rooms.py, scenes in ../social/mockups/scenes). Needs the posters above to exist first.
{
  const PY = path.join(process.env.HOME, '.venvs/rezonanca-mockup/bin/python');
  const keys = [...new Set(sets.map((x) => x.key))];
  try { execFileSync(PY, [path.join(ROOT, 'scripts/render-rooms.py'), ...keys], { cwd: ROOT, stdio: 'inherit' }); }
  catch (e) { console.warn('room shots NOT rendered (run scripts/render-rooms.py with the mockup venv):', e.message); }
}

// Homepage interiors + social share image.
if (!only && !tonesOnly) {
  const HOME = {
    living: [{ slug: 'lorenc', x: 650, y: 110, w: 300 }],
    studio: [{ slug: 'morska-zvezda', x: 980, y: 120, w: 360 }],
    hall: [{ slug: 'aizava', x: 430, y: 170, w: 300 }, { slug: 'dolina-morskih-konjica', x: 870, y: 170, w: 300 }],
  };
  for (const [scene, frames] of Object.entries(HOME)) {
    for (const lang of Object.keys(LANGS)) {
      await room(scene, frames.map((f) => ({ ...f, file: posterPng(f.slug, lang), palette: findProduct(f.slug).palette })), out('interiors', `${scene}-${lang}.webp`));
    }
  }
  for (const lang of Object.keys(LANGS)) {
    const art = await sharp(posterPng('lorenc', lang)).resize({ height: 630 }).toBuffer();
    const label = lang === 'sr' ? 'РЕЗОНАНЦА' : 'REZONANCA';
    const sub = lang === 'sr' ? 'Звук, заустављен у светлости.' : 'Sound, frozen in light.';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#02060f"/>
      <text x="520" y="300" font-family="Unbounded, Verdana, sans-serif" font-weight="700" font-size="64" letter-spacing="8" fill="#d7faff">${label}</text>
      <text x="524" y="360" font-family="JetBrains Mono, Menlo, monospace" font-size="24" letter-spacing="3" fill="#50e6ff">${sub}</text></svg>`;
    await sharp(Buffer.from(svg)).composite([{ input: art, left: 0, top: 0 }]).jpeg({ quality: 85 }).toFile(out(`og-${lang}.jpg`));
  }
}
// Colour dots (cards, product page) from the fresh posters.
execFileSync('node', [path.join(ROOT, 'scripts/swatches.mjs')], { cwd: ROOT, stdio: 'inherit' });
console.log(`✓ assets for ${products.length} products`);
