// Reel / TikTok timelapse: the generator drawing one poster, line by line, in the 9:16 story frame.
//   ../social/reels/<slug>[-en]-draw-1080x1920.mp4
//
// Timeline: a short empty poster, the path drawing itself (slow first, so the single line reads,
// then accelerating), a hold on the finished poster, and a crossfade back to the empty poster so
// the Reel loops seamlessly. The last drawn frame is the shop image exactly (same seed, palette,
// boost and white point), rendered at 100 DPI and halved like social-export.mjs.
// Supports the flow attractors (Лоренц, Аизава, Томас, Халворсен).
//
//   node scripts/social-timelapse.mjs lorenc                    10 s, 30 fps, Serbian
//   node scripts/social-timelapse.mjs lorenc --preview          12 fps, for checking the timing quickly
//   node scripts/social-timelapse.mjs lorenc --seconds 12 --fps 30 --lang en
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { findProduct } from '../src/data/products.js';
import { FORMATS, POSTER, TINT, frameHtml } from './social-frame.mjs';
import { startServer } from '../../waveform-poster/serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOCIAL = path.resolve(ROOT, '../social');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const argv = process.argv.slice(2);
const opt = (k, d) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : d);
const preview = argv.includes('--preview');
const slug = argv.find((a, i) => !a.startsWith('--') && !argv[i - 1]?.startsWith('--')) || 'lorenc';
const lang = opt('lang', 'sr');
const fps = Number(opt('fps', preview ? 12 : 30));
const seconds = Number(opt('seconds', 10));
const p = findProduct(slug);
if (!p) throw new Error(`unknown product "${slug}"`);
if (p.style !== 'attractor' || ['clifford', 'dejong'].includes(p.variant)) throw new Error(`${slug}: timelapse supports the flow attractors only for now`);

const COPY = {
  sr: { caption: 'Ово је код који црта.', step: 'корак', loc: 'sr-RS', code: 'sr-cyrl' },
  en: { caption: 'This is code, drawing.', step: 'step', loc: 'en-US', code: 'en' },
}[lang];

// Timeline (seconds): intro on the empty poster, drawing, hold, loop crossfade (inside the hold).
const INTRO = 0.6, HOLD = 2.4, XFADE = 0.5;
const DRAW = seconds - INTRO - HOLD;
const total = Math.round(seconds * fps);
const at = (k) => {
  const s = k / fps;
  if (s < INTRO) return { t: 0 };
  if (s < INTRO + DRAW) return { t: ((s - INTRO) / DRAW) ** 2, drawing: true }; // ease-in: one line first, then the cloud
  const fade = Math.max(0, (s - (seconds - XFADE)) / XFADE);
  return { t: 1, hold: true, fade };
};

const name = `${slug}${lang === 'sr' ? '' : '-' + lang}-draw`;
const FRAMES = path.join(SOCIAL, '.cache/film', name);
await fs.rm(FRAMES, { recursive: true, force: true });
await fs.mkdir(FRAMES, { recursive: true });
await fs.mkdir(path.join(SOCIAL, 'reels'), { recursive: true });

const server = await startServer(0);
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 15 * 60 * 1000, args: ['--no-sandbox', '--force-color-profile=srgb'] });
const t0 = Date.now();
try {
  // Generator page in film mode.
  const gen = await browser.newPage();
  gen.on('pageerror', (e) => console.error('[page error]', e.message));
  const q = new URLSearchParams({ seed: p.seed, size: '18x24', style: p.style, variant: p.variant, palette: p.palette, boost: p.boost, lang: COPY.code, dpi: 100, export: '1', film: '0' });
  await gen.goto(`http://127.0.0.1:${server.address().port}/index.html?${q}`, { waitUntil: 'load' });
  await gen.waitForFunction('window.__done === true', { timeout: 15 * 60 * 1000, polling: 100 });
  const logicalW = await gen.evaluate(() => width);
  const steps = await gen.evaluate(() => Math.round(window.__math?.stats?.find?.((s) => s[0] === 'steps')?.[1] ?? 0)) ||
    260000;
  const posterAt = async (t) => {
    await gen.evaluate((tt) => window.__filmFrame(tt), t);
    await gen.waitForFunction('window.__done === true', { timeout: 15 * 60 * 1000, polling: 50 });
    const [b64, pen] = await gen.evaluate(() => [document.querySelector('canvas').toDataURL('image/png'), window.__film.pen]);
    const png = await sharp(Buffer.from(b64.slice(b64.indexOf(',') + 1), 'base64')).removeAlpha()
      .resize(POSTER.w, POSTER.h, { kernel: 'lanczos3' }).png().toBuffer();
    return { png, pen };
  };

  // Composition page: the story frame, updated in place each frame.
  const f = FORMATS.story;
  const left = (f.W - POSTER.w) / 2, scale = POSTER.w / logicalW;
  const empty = await posterAt(0), done = await posterAt(1);
  const comp = await browser.newPage();
  await comp.setViewport({ width: f.W, height: f.H, deviceScaleFactor: 1 });
  await comp.setContent(frameHtml({ ...f, poster: empty.png, tint: TINT[p.palette] || TINT.cyan, caption: COPY.caption }), { waitUntil: 'load' });
  await comp.evaluate((src) => {
    const a = document.getElementById('poster'), b = a.cloneNode();
    b.id = 'loop'; b.src = src; b.style.opacity = 0; b.style.outline = 'none';
    a.after(b);
  }, `data:image/png;base64,${empty.png.toString('base64')}`);
  await comp.evaluate(() => document.fonts.ready);

  const fmt = (n) => n.toLocaleString(COPY.loc).replace(/[  ]/g, '.');
  let last = null;
  for (let k = 0; k < total; k++) {
    const fr = at(k);
    const art = fr.t === 0 ? empty : fr.t === 1 ? done : await posterAt(fr.t);
    const step = Math.round(steps * fr.t);
    const state = {
      src: art === last ? null : `data:image/png;base64,${art.png.toString('base64')}`,
      label: fr.hold ? 'rezonanca.art' : `${COPY.step} ${fmt(step)} / ${fmt(steps)}`,
      pen: fr.drawing && art.pen ? [left + art.pen[0] * scale, f.top + art.pen[1] * scale] : null,
      fade: fr.fade || 0,
    };
    last = art;
    await comp.evaluate(async (s) => {
      if (s.src) { const img = document.getElementById('poster'); img.src = s.src; await img.decode(); }
      document.getElementById('label').textContent = s.label;
      document.getElementById('loop').style.opacity = s.fade;
      const pen = document.getElementById('pen');
      pen.style.display = s.pen ? 'block' : 'none';
      if (s.pen) { pen.style.left = s.pen[0] + 'px'; pen.style.top = s.pen[1] + 'px'; }
    }, state);
    await fs.writeFile(path.join(FRAMES, `f${String(k).padStart(5, '0')}.png`), await comp.screenshot({ type: 'png' }));
    if (k % fps === 0) console.log(`  frame ${k}/${total}  t=${fr.t.toFixed(3)}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
} finally {
  await browser.close();
  server.close();
}

const out = path.join(SOCIAL, 'reels', `${name}${preview ? '-preview' : ''}-1080x1920.mp4`);
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(FRAMES, 'f%05d.png'),
  '-c:v', 'libx264', '-preset', preview ? 'veryfast' : 'slow', '-crf', preview ? '23' : '16', '-pix_fmt', 'yuv420p',
  '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', out], { stdio: 'inherit' });
console.log(`✓ ${path.relative(process.cwd(), out)}  ${total} frames @ ${fps} fps  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
