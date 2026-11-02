// Instagram posts on the site: latest posts on the homepage, posts of a piece on its product page.
//   node scripts/sync-instagram.mjs
// Reads the Meta token from ~/.config/rezonanca/meta-app-rezonanca (never printed), lists the account's media,
// saves a 4:5 thumbnail per post to public/social/<id>.webp and writes src/data/instagram.json
// ({ id, url, type, date, img, slugs }). A post is tagged with a piece when its first caption line names it.
// Rerun after new posts go out, then deploy.
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { PRODUCTS } from '../src/data/products.js';

const IG = '17841422092140005';
// Only English-era posts (2026-10-29 on): earlier ones show the old Cyrillic poster text, not what ships now.
const FROM = '2026-10-29';
// Posts about things no longer sold (Мини), the old Serbian launch notice, the first reel with its on-screen caption.
const SKIP = ['DfApTZVm2nR', 'DeosPfPACpF', 'DeXcck6gA6H'];
// Pieces named later in the caption (or in the genitive) that the first-line match misses.
const EXTRA = { DfLAwU5nyiP: ['aurora'], DetrebwPVzh: ['aizava'], Ded7xPZvoGq: ['halvorsen'] };
const token = readFileSync(`${homedir()}/.config/rezonanca/meta-app-rezonanca`, 'utf8').match(/EA[A-Za-z0-9]{50,}/)[0];

const media = [];
let next = `https://graph.facebook.com/v21.0/${IG}/media?fields=id,caption,media_type,permalink,timestamp,thumbnail_url,media_url&limit=50&access_token=${token}`;
while (next) {
  const r = await (await fetch(next)).json();
  if (r.error) throw new Error(r.error.message);
  media.push(...r.data);
  next = r.paging?.next;
}

const norm = (s) => s.toLowerCase().replace(/[’'`]/g, '');
const names = PRODUCTS.map((p) => ({ slug: p.slug, keys: [p.name.sr, p.name.en].map(norm) }))
  .sort((a, b) => Math.max(...b.keys.map((k) => k.length)) - Math.max(...a.keys.map((k) => k.length)));
const tag = (caption = '') => {
  let head = norm(caption.split('\n').find((l) => l.trim()) || '');
  const hit = [];
  for (const n of names) for (const k of n.keys) {
    const re = new RegExp(`(^|[^\\p{L}])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}]|$)`, 'u');
    if (re.test(head)) { hit.push(n.slug); head = head.replace(re, ' '); break; }
  }
  return hit;
};

mkdirSync('public/social', { recursive: true });
const out = [];
for (const m of media) {
  const code = m.permalink.split('/').filter(Boolean).at(-1);
  if (SKIP.includes(code) || m.timestamp.slice(0, 10) < FROM) continue;
  const file = `public/social/${code}.webp`;
  if (!existsSync(file)) {
    const src = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url;
    if (!src) continue;
    const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
    await sharp(buf).resize(600, 750, { fit: 'cover' }).webp({ quality: 80 }).toFile(file);
  }
  out.push({ id: code, url: m.permalink, type: m.media_type === 'VIDEO' ? 'reel' : m.media_type === 'CAROUSEL_ALBUM' ? 'carousel' : 'image', date: m.timestamp.slice(0, 10), img: `/social/${code}.webp`, slugs: EXTRA[code] ?? tag(m.caption) });
}
writeFileSync('src/data/instagram.json', JSON.stringify(out, null, 1) + '\n');
console.log(`${out.length} posts, ${out.filter((x) => x.slugs.length).length} tagged`);
for (const x of out) console.log(x.date, x.type.padEnd(8), x.id, x.slugs.join(', '));
