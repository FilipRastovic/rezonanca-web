// Screenshots of the built site (desktop, mobile, order modal) for review.
//   npm run build && npm run shots
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import puppeteer from 'puppeteer-core';

const OUT = process.argv[2] || 'screenshots';
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 4329;

await fs.mkdir(OUT, { recursive: true });
const server = spawn('npx', ['astro', 'preview', '--port', String(PORT)], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true });

try {
  for (const [name, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true }]]) {
    for (const path of ['/', '/en/']) {
      const page = await browser.newPage();
      page.on('pageerror', (e) => console.error('[page error]', e.message));
      await page.setViewport(vp);
      await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle0' });
      await new Promise((r) => setTimeout(r, 2200));
      const tag = `${name}-${path === '/' ? 'sr' : 'en'}`;
      await page.screenshot({ path: `${OUT}/${tag}-hero.png` });
      // Scroll through so lazy images load, then force all reveals on.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
        document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('in'));
      });
      await new Promise((r) => setTimeout(r, 1200));
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      if (overflow > 0) console.warn(`! ${tag}: horizontal overflow ${overflow}px`);
      await page.screenshot({ path: `${OUT}/${tag}-full.png`, fullPage: true });
      if (path === '/') {
        await page.evaluate(() => scrollTo(0, 0));
        await page.click('[data-order][data-format="framed"]');
        await new Promise((r) => setTimeout(r, 600));
        await page.screenshot({ path: `${OUT}/${tag}-order.png` });
      }
      await page.close();
      console.log('✓', tag);
    }
  }
} finally {
  await browser.close();
  server.kill();
}
