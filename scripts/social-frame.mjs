// Shared social frame (feed / story / reel): dark navy field, a soft palette-tinted glow,
// the poster pixel-for-pixel, an optional caption above and a label below. Rendered in headless
// Chrome so the brand fonts are the real ones. Used by social-export.mjs and social-timelapse.mjs.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = path.join(ROOT, 'node_modules/@fontsource');

export const POSTER = { w: 900, h: 1200 }; // 18×24 in at 50 DPI: the 100 DPI render halved

// Feed 1080×1350: 90 px sides, 75 px top/bottom (outside IG's 5% crop margin).
// Story/Reel 1080×1920: poster inside the 1080×1420 safe centre (y 250-1670), label under it.
export const FORMATS = {
  feed: { kind: 'feed', W: 1080, H: 1350, top: 75 },
  story: { kind: 'story', W: 1080, H: 1920, top: 330 },
};

// Palette glow behind the poster + label colour (from PALETTES in waveform-poster/sketch.js).
export const TINT = {
  cyan: { glow: '30,110,255', accent: '80,230,255', ice: '215,250,255' },
  ice: { glow: '110,130,165', accent: '200,222,242', ice: '248,250,255' },
  violet: { glow: '110,60,255', accent: '184,146,255', ice: '242,230,255' },
  aurora: { glow: '0,170,150', accent: '90,255,214', ice: '222,255,246' },
  ember: { glow: '40,92,232', accent: '255,190,112', ice: '255,242,222' },
};

const font = async (family, file, weight, range) =>
  `@font-face{font-family:'${family}';font-weight:${weight};unicode-range:${range};src:url(data:font/woff2;base64,${(await fs.readFile(path.join(FONTS, file))).toString('base64')}) format('woff2')}`;
const LATIN = 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+2000-206F,U+20AC,U+2122';
const CYR = 'U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116';
const FONT_CSS = [
  await font('JetBrains Mono', 'jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2', 400, LATIN),
  await font('JetBrains Mono', 'jetbrains-mono/files/jetbrains-mono-cyrillic-400-normal.woff2', 400, CYR),
  await font('Unbounded', 'unbounded/files/unbounded-latin-500-normal.woff2', 500, LATIN),
  await font('Unbounded', 'unbounded/files/unbounded-cyrillic-500-normal.woff2', 500, CYR),
].join('\n');

// Elements with ids (#poster, #label, #caption, #pen) can be updated in place for video frames.
export function frameHtml({ W, H, top, poster, tint, label = '', caption = '' }) {
  const left = (W - POSTER.w) / 2;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS}
    *{margin:0;padding:0}
    html,body{width:${W}px;height:${H}px;overflow:hidden;background:#02050d}
    body{position:relative;background:radial-gradient(120% 80% at 50% ${((top + POSTER.h / 2) / H) * 100}%, #0a1630 0%, #02050d 70%)}
    .glow{position:absolute;left:${left - 40}px;top:${top - 40}px;width:${POSTER.w + 80}px;height:${POSTER.h + 80}px;
      background:rgba(${tint.glow},0.22);filter:blur(60px);border-radius:40px}
    .shadow{position:absolute;left:${left + 10}px;top:${top + 22}px;width:${POSTER.w}px;height:${POSTER.h}px;background:#000;opacity:.6;filter:blur(14px)}
    #poster,#loop{position:absolute;left:${left}px;top:${top}px;width:${POSTER.w}px;height:${POSTER.h}px;display:block;
      outline:1px solid rgba(255,255,255,0.07);outline-offset:0}
    #label{position:absolute;left:0;right:0;top:${top + POSTER.h + 46}px;text-align:center;
      font:400 26px/1 'JetBrains Mono',monospace;letter-spacing:.32em;color:rgb(${tint.accent});opacity:.85}
    #caption{position:absolute;left:90px;right:90px;bottom:${H - top + 26}px;text-align:center;
      font:500 34px/1.25 'Unbounded',sans-serif;letter-spacing:.02em;color:rgb(${tint.ice})}
    #pen{position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;display:none;
      background:radial-gradient(circle, rgba(${tint.ice},1) 0 3px, rgba(${tint.accent},.55) 5px, rgba(${tint.accent},0) 22px)}
  </style></head><body>
    <div class="glow"></div><div class="shadow"></div>
    <img id="poster" src="data:image/png;base64,${poster.toString('base64')}">
    <div id="pen"></div>
    <div id="caption">${caption}</div>
    <div id="label">${label}</div>
  </body></html>`;
}
