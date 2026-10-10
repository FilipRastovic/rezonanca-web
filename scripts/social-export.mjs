// Social media exports of every poster, rendered fresh from the generator in ../waveform-poster:
//   ../social/feed/<slug>-1080x1350.jpg     Instagram / Facebook feed (4:5)
//   ../social/story/<slug>-1080x1920.jpg    Story / Reel / TikTok cover (9:16)
// English versions get an -en suffix (<slug>-en-1080x1350.jpg).
//
// The poster is rendered at 100 DPI (1800×2400) and downscaled exactly 2× to 900×1200, so it is never
// upscaled and never re-toned: the image is the same print the shop sells, only smaller.
// Frames are composed in headless Chrome (social-frame.mjs) so the brand fonts are the real ones.
//
//   node scripts/social-export.mjs                    all products, Serbian
//   node scripts/social-export.mjs lorenc,tomas       only these products
//   node scripts/social-export.mjs --lang en|all      English, or both
//   node scripts/social-export.mjs --reuse            skip rendering when a cached PNG exists
//   node scripts/social-export.mjs --clean            no wordmark on the story frame
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { PRODUCTS } from '../src/data/products.js';
import { FORMATS as F, POSTER, TINT, frameHtml } from './social-frame.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const GEN = path.resolve(ROOT, '../waveform-poster');
const SOCIAL = path.resolve(ROOT, '../social');
const TMP = path.join(SOCIAL, '.cache');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const argv = process.argv.slice(2);
const flag = (k) => argv.includes(`--${k}`);
const langArg = argv[argv.indexOf('--lang') + 1];
const LANGS = { sr: 'sr-cyrl', en: 'en' };
const langs = !flag('lang') ? ['sr'] : langArg === 'all' ? ['sr', 'en'] : [langArg];
const only = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--lang');
const products = only ? PRODUCTS.filter((p) => only.split(',').includes(p.slug)) : PRODUCTS;
if (!products.length) throw new Error(`no products match "${only}"`);

for (const d of ['feed', 'story']) await fs.mkdir(path.join(SOCIAL, d), { recursive: true });
await fs.mkdir(TMP, { recursive: true });

const DPI = 100;
const pngOf = (slug, lang) => path.join(TMP, `${slug}-${lang}.png`);
const fileOf = (slug, lang, kind, size) => path.join(SOCIAL, kind, `${slug}${lang === 'sr' ? '' : '-' + lang}-${size}.jpg`);

// 1. Render (same seed/style/variant/palette/boost as the shop images).
const exists = (f) => fs.access(f).then(() => true, () => false);
const jobs = [];
for (const p of products) for (const lang of langs) {
  if (flag('reuse') && (await exists(pngOf(p.slug, lang)))) continue;
  jobs.push({ seed: p.seed, style: p.style, variant: p.variant, palette: p.palette, boost: p.boost, lang: LANGS[lang], dpi: DPI, name: `${p.slug}-${lang}` });
}
if (jobs.length) {
  const jobsFile = path.join(TMP, 'jobs.json');
  await fs.writeFile(jobsFile, JSON.stringify(jobs));
  execFileSync('node', ['export.mjs', '--jobs', jobsFile, '--out', TMP], { cwd: GEN, stdio: 'inherit' });
}

const FORMATS = [{ ...F.feed, label: false }, { ...F.story, label: !flag('clean') }];

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--force-color-profile=srgb'] });
try {
  const page = await browser.newPage();
  for (const p of products) for (const lang of langs) {
    const poster = await sharp(pngOf(p.slug, lang)).removeAlpha()
      .resize(POSTER.w, POSTER.h, { kernel: 'lanczos3' }).png().toBuffer();
    const tint = TINT[p.palette] || TINT.cyan;
    for (const f of FORMATS) {
      await page.setViewport({ width: f.W, height: f.H, deviceScaleFactor: 1 });
      await page.setContent(frameHtml({ ...f, poster, tint, label: f.label ? 'rezonanca.art' : '' }), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      const shot = await page.screenshot({ type: 'png' });
      // 4:4:4 chroma keeps thin coloured lines crisp; sRGB is what Instagram/TikTok expect.
      await sharp(shot).jpeg({ quality: 92, chromaSubsampling: '4:4:4', mozjpeg: true }).withMetadata({ icc: 'srgb' })
        .toFile(fileOf(p.slug, lang, f.kind, `${f.W}x${f.H}`));
    }
    console.log(`✓ ${p.slug} (${lang})`);
  }
} finally {
  await browser.close();
}
console.log(`✓ social exports for ${products.length} products → ${path.relative(process.cwd(), SOCIAL)}/feed, /story`);
