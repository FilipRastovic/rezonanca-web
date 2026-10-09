// Verifies every internal href/src in the built site resolves to a file in dist/.
//   npm run build && node scripts/check-links.mjs
import fs from 'node:fs';
import path from 'node:path';

const dist = 'dist';
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); fs.statSync(p).isDirectory() ? walk(p) : files.push(p); } })(dist);
const html = files.filter((f) => f.endsWith('.html'));
const bad = new Set();
let checked = 0;
for (const f of html) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    checked++;
    let p = path.join(dist, decodeURIComponent(m[1]));
    if (m[1].endsWith('/')) p = path.join(p, 'index.html');
    if (!fs.existsSync(p)) bad.add(`${m[1]}  <- ${f}`);
  }
}
console.log(`pages ${html.length}, links checked ${checked}, broken ${bad.size}`);
for (const b of [...bad].slice(0, 30)) console.log('  ', b);
process.exit(bad.size ? 1 : 0);
