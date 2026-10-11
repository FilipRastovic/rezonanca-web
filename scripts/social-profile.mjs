// Profile assets for Instagram / TikTok / Facebook, all in one style: the logo's waveform (or a line icon)
// glowing over the dimmed centre of Лоренц.
//   ../social/profile/avatar-1080.png                    profile picture (apps crop it to a circle)
//   ../social/profile/highlight-<name>-1080x1920.png     Instagram highlight covers (upload as a Story, crop to the centre)
//   ../social/profile/facebook-cover-1640x924.png        Facebook Page cover (phones show all of it, desktop the middle 1640×624)
//   ../social/profile/preview.png                        the profile mocked up at real sizes, light + dark UI
//
//   node scripts/social-profile.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOCIAL = path.resolve(ROOT, '../social');
const OUT = path.join(SOCIAL, 'profile');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
await fs.mkdir(OUT, { recursive: true });

// Glowing line drawing: a soft halo pass + a crisp core (stroke thick enough to survive a 32 px avatar).
const glowSvg = ({ viewBox, paths, w, h, x, y, core = 2.8, halo = 6.5 }) => `
  <svg viewBox="${viewBox}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;overflow:visible">
    ${paths.map((d) => `<path d="${d}" fill="none" stroke="#50e6ff" stroke-width="${halo}" stroke-linecap="round" stroke-linejoin="round" opacity=".38" style="filter:blur(2.2px)"/>`).join('')}
    ${paths.map((d) => `<path d="${d}" fill="none" stroke="#d7faff" stroke-width="${core}" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
  </svg>`;

// The site logo's waveform (Logo.astro), 40×20 viewBox.
const WAVE = 'M1 12h6l2.5-6 4 13 4-18 4 15 3-7 2.5 4H39';
// Highlight icons, 100×100 viewBox.
const ICONS = {
  radovi: ['M27 16h46v68H27z', 'M35 24h30v52H35z', 'M39 56l6-10 5 14 6-18 5 14'], // framed print with a waveform
  proces: ['M36 30L18 50l18 20', 'M64 30l18 20-18 20', 'M56 24L44 76'], // </>
  poruchivanje: ['M50 16l32 16v36L50 84 18 68V32z', 'M18 32l32 16 32-16', 'M50 48v36', 'M34 24l32 16'], // parcel
};

// Лоренц centre, native pixels from the 1800×2400 render (same image as the shop poster).
const lorenz = await sharp(path.join(SOCIAL, '.cache/lorenc-sr.png')).removeAlpha()
  .extract({ left: 360, top: 444, width: 1080, height: 1080 }).png().toBuffer();
const art = (top, opacity = 0.55) => `<img src="data:image/png;base64,${lorenz.toString('base64')}" style="position:absolute;left:0;top:${top}px;width:1080px;height:1080px;opacity:${opacity};
  -webkit-mask-image:radial-gradient(circle at 50% 50%, #000 58%, transparent 74%)">`;

const SHOTS = {
  'avatar-1080': { W: 1080, H: 1080, html: art(0) + glowSvg({ viewBox: '0 0 40 20', paths: [WAVE], w: 640, h: 320, x: 220, y: 370 }) },
  ...Object.fromEntries(Object.entries(ICONS).map(([name, paths]) => [`highlight-${name}-1080x1920`,
    { W: 1080, H: 1920, html: art(420, 0.4) + glowSvg({ viewBox: '0 0 100 100', paths, w: 660, h: 660, x: 210, y: 630, core: 4, halo: 9 }) }])),
};

// Facebook cover: a gallery wall of four posters, one per palette, inside the desktop-safe middle band.
const WALL = [['morska-zvezda', '30,110,255'], ['halvorsen', '40,92,232'], ['tomas', '0,170,150'], ['aizava', '110,60,255']];
const PW = 330, PH = 440, GAP = 36, X0 = (1640 - (4 * PW + 3 * GAP)) / 2, Y0 = 462 - PH / 2;
let wall = '';
for (const [i, [slug, glow]] of WALL.entries()) {
  const png = await sharp(path.join(SOCIAL, `.cache/${slug}-sr.png`)).removeAlpha().resize(PW, PH, { kernel: 'lanczos3' }).png().toBuffer();
  const x = X0 + i * (PW + GAP);
  wall += `<div style="position:absolute;left:${x - 30}px;top:${Y0 - 30}px;width:${PW + 60}px;height:${PH + 60}px;background:rgba(${glow},.24);filter:blur(44px);border-radius:30px"></div>
    <div style="position:absolute;left:${x + 8}px;top:${Y0 + 16}px;width:${PW}px;height:${PH}px;background:#000;opacity:.6;filter:blur(10px)"></div>
    <img src="data:image/png;base64,${png.toString('base64')}" style="position:absolute;left:${x}px;top:${Y0}px;width:${PW}px;height:${PH}px;outline:1px solid rgba(255,255,255,.07)">`;
}
SHOTS['facebook-cover-1640x924'] = { W: 1640, H: 924, html: wall };

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox', '--force-color-profile=srgb'] });
try {
  const page = await browser.newPage();
  const src = {};
  for (const [name, s] of Object.entries(SHOTS)) {
    await page.setViewport({ width: s.W, height: s.H, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><body style="margin:0;width:${s.W}px;height:${s.H}px;position:relative;overflow:hidden;
      background:radial-gradient(circle at 50% 50%, #0a1a3a 0%, #02050d 60%)">${s.html}</body>`, { waitUntil: 'load' });
    const file = path.join(OUT, `${name}.png`);
    await page.screenshot({ path: file });
    src[name] = `data:image/png;base64,${(await fs.readFile(file)).toString('base64')}`;
  }

  // Preview: the profile header as Instagram shows it, light + dark.
  const hl = (name, label) => `<div style="display:grid;justify-items:center;gap:6px;font-size:12px">
    <div style="width:64px;height:64px;border-radius:50%;padding:3px;border:1px solid #8884"><div style="width:64px;height:64px;border-radius:50%;
      background:url(${src[`highlight-${name}-1080x1920`]}) center/cover"></div></div>${label}</div>`;
  const ui = (bg, fg, dim) => `<div style="background:${bg};color:${fg};padding:22px;border-radius:14px;display:grid;gap:16px">
    <div style="display:flex;gap:22px;align-items:center">
      <img src="${src['avatar-1080']}" style="width:150px;height:150px;border-radius:50%">
      <div style="display:grid;gap:6px"><b style="font-size:18px">rezonanca.art</b>
        <span>Резонанца · програмерска уметност</span>
        <span style="color:${dim};font-size:13px;white-space:pre-line">Постери нацртани кодом, без AI.\nШтампано у Новом Саду · поузећем\n↓ rezonanca.art</span></div>
    </div>
    <div style="display:flex;gap:20px">${hl('radovi', 'Радови')}${hl('proces', 'Процес')}${hl('poruchivanje', 'Поручивање')}</div>
    <div style="display:flex;gap:14px;align-items:center;border-top:1px solid #8883;padding-top:14px">
      <img src="${src['avatar-1080']}" style="width:44px;height:44px;border-radius:50%"><b>rezonanca.art</b>
      <img src="${src['avatar-1080']}" style="width:32px;height:32px;border-radius:50%;margin-left:18px"><span><b>rezonanca.art</b> Хвала!</span>
    </div></div>`;
  await page.setViewport({ width: 1000, height: 600, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><body style="margin:0;padding:24px;background:#141a26;font:15px -apple-system,sans-serif;
    display:grid;grid-template-columns:1fr 1fr;gap:16px">${ui('#fff', '#111', '#555')}${ui('#000', '#f2f2f2', '#aaa')}</body>`, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(OUT, 'preview.png'), fullPage: true });
  // Cover preview: desktop band (dashed) + where the Page's profile picture overlaps on phones.
  await page.setViewport({ width: 1640, height: 924, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><body style="margin:0;position:relative;width:1640px;height:924px;overflow:hidden">
    <img src="${src['facebook-cover-1640x924']}" style="position:absolute;inset:0">
    <div style="position:absolute;left:0;right:0;top:150px;height:624px;border:3px dashed #ffa546"></div>
    <div style="position:absolute;left:16px;top:160px;font:600 22px -apple-system,sans-serif;color:#ffa546">desktop shows this band</div>
    <img src="${src['avatar-1080']}" style="position:absolute;left:60px;top:720px;width:300px;height:300px;border-radius:50%;border:8px solid #fff;opacity:.9">
    <div style="position:absolute;left:380px;bottom:20px;font:600 22px -apple-system,sans-serif;color:#fff">profile picture overlap (approx.)</div>
  </body>`, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(OUT, 'facebook-cover-preview.png') });
} finally {
  await browser.close();
}
console.log(`✓ avatar + ${Object.keys(ICONS).length} highlight covers + preview → ${path.relative(process.cwd(), OUT)}`);
