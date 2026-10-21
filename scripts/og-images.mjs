// Light-mode share images (Open Graph, 1200×630 JPG) rendered in Chrome with the site's fonts.
//   node scripts/og-images.mjs           → public/og-sr.jpg, og-en.jpg, public/og/<slug>-<lang>.jpg
// Home: wordmark + line + a room shot. Product: name, series, line, its room shot.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { PRODUCTS } from '../src/data/products.js';
import sr from '../src/i18n/sr.ts';
import en from '../src/i18n/en.ts';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const T = { sr, en };
const F = (p) => 'file://' + path.join(ROOT, 'node_modules/@fontsource', p);
const font = (fam, w, sub) => `@font-face{font-family:'${fam}';font-weight:${w};src:url(${F(`${fam.toLowerCase()}/files/${fam.toLowerCase()}-${sub}-${w}-normal.woff2`)})}`;
const fonts = ['cyrillic', 'latin'].flatMap((s) => [font('Unbounded', 600, s), font('Unbounded', 500, s), font('Inter', 400, s), font('Inter', 500, s)]).join('');
const img = (rel) => 'file://' + path.join(ROOT, 'public', rel);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const page = ({ lang, label, title, big, line, sub, shot }) => `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
*{margin:0;box-sizing:border-box} body{width:1200px;height:630px;background:#fbfaf7;color:#121417;font-family:Inter;display:flex;align-items:center;gap:64px;padding:0 72px}
.t{flex:1;min-width:0} .label{display:flex;align-items:center;gap:14px;font:500 16px/1 Inter;letter-spacing:.14em;text-transform:uppercase}
.label:before{content:'';width:30px;height:1px;background:#121417}
h1{margin-top:26px;font:600 ${big ? 64 : 54}px/1.05 Unbounded;letter-spacing:${big ? '.05em' : '.01em'}}
.line{margin-top:24px;font:400 24px/1.45 Inter;color:#3b3f46;max-width:560px} .sub{margin-top:34px;font:500 16px/1 Inter;letter-spacing:.12em;text-transform:uppercase;color:#5f636b}
.pic{width:402px;height:536px;flex:none;overflow:hidden;box-shadow:0 30px 60px -30px rgba(18,20,23,.45)} .pic img{width:100%;height:100%;object-fit:cover}
</style></head><body><div class="t"><p class="label">${esc(label)}</p><h1>${esc(title)}</h1><p class="line">${esc(line)}</p><p class="sub">${esc(sub)}</p></div>
<div class="pic"><img src="${shot}"></div></body></html>`;

const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--allow-file-access-from-files'] });
const p = await b.newPage();
await p.setViewport({ width: 1200, height: 630 });
const shoot = async (html, out) => {
  const tmp = path.join(ROOT, '.asset-cache', 'og.html');
  fs.mkdirSync(path.dirname(tmp), { recursive: true }); fs.writeFileSync(tmp, html);
  await p.goto('file://' + tmp, { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out, type: 'jpeg', quality: 86 });
};
fs.mkdirSync(path.join(ROOT, 'public/og'), { recursive: true });
for (const lang of ['sr', 'en']) {
  const t = T[lang];
  await shoot(page({ lang, label: t.hero.label, title: t.hero.title, big: true, line: t.ogHome, sub: 'rezonanca.art', shot: img(`rooms/halvorsen-${lang}.webp`) }), path.join(ROOT, `public/og-${lang}.jpg`));
  for (const pr of PRODUCTS) {
    const series = t.series[pr.style].name.split(' · ');
    await shoot(page({ lang, label: lang === 'sr' ? series[0] : series[series.length - 1], title: pr.name[lang], line: pr.line[lang], sub: `${t.ogSub} · rezonanca.art`, shot: img(`rooms/${pr.slug}-${lang}.webp`) }), path.join(ROOT, `public/og/${pr.slug}-${lang}.jpg`));
  }
}
await b.close();
console.log('og images:', 2 + PRODUCTS.length * 2);
