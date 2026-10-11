// Posting calendar: builds one folder per post in ../social/posts/<date>-<slot>-<name>/ (media + captions)
// and ../social/calendar.html, a local page with thumbnails, folder links and copy-caption buttons.
// The PLAN below is the single source; re-run after new media exists and statuses update themselves.
//
//   node scripts/social-calendar.mjs
import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { findProduct } from '../src/data/products.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOCIAL = path.resolve(ROOT, '../social');
const POSTS = path.join(SOCIAL, 'posts');
const S = (...p) => path.join(SOCIAL, ...p);

// Media sources.
const feed = (slug) => ({ from: S('feed', `${slug}-1080x1350.jpg`), as: `${slug}-1080x1350.jpg` });
const reel = (slug) => ({ from: S('reels', `${slug}-draw-1080x1920.mp4`), as: `${slug}-reel-1080x1920.mp4`, thumb: S('story', `${slug}-1080x1920.jpg`) });
const detail = (slug) => ({ detail: slug, as: `${slug}-detail-1080x1350.jpg` });
const numbered = (items) => items.map((m, i) => ({ ...m, as: `${String(i + 1).padStart(2, '0')}-${m.as}` }));

const TAGS = {
  attractor: '#codeart #strangeattractor #mathart #creativecoding #chaostheory #wallart #posteri #enterijer #novisad',
  mandelbrot: '#mandelbrot #fractalart #mathart #codeart #creativecoding #wallart #posteri #dekoracija #novisad',
  reel: '#creativecoding #p5js #codeart #mathart #strangeattractor #javascript #novisad',
  tiktok: '#creativecoding #mathart #codeart #math #javascript',
};
// Call to action follows the site's sales switch (src/config.ts SALES_OPEN): waitlist while closed.
const SALES_OPEN = /SALES_OPEN\s*=\s*true/.test(await fs.readFile(path.join(ROOT, 'src/config.ts'), 'utf8'));
const BUY = `50 × 70 cm · штампано у Новом Саду\n${SALES_OPEN ? 'Поручи на rezonanca.art (линк у биоу)' : 'Ускоро у продаји. Пријави се за прво издање на rezonanca.art (линк у биоу)'}`;
const piece = (slug, extra = '') => {
  const p = findProduct(slug);
  return `${p.name.sr}.\n\n${p.line.sr}\n${extra || 'Нацртано кодом, линију по линију. Без AI.'}\n\n${BUY}\n\n${TAGS[p.style]}`;
};

// owner: 'ready' (I just post) · 'claude' (Claude makes the media before the date) · 'filip' (you shoot it)
const PREP = [
  { date: '2026-10-11', text: 'Instagram + Facebook post automatically at the calendar times (Claude\'s scheduler). You only do TikTok by hand, in TikTok Studio on desktop: Upload → Schedule, with the „Copy TikTok“ caption.' },
  { date: '2026-10-11', text: 'Profile picture avatar-1080.png on Instagram and TikTok (Facebook is done), and the Facebook cover facebook-cover-1640x924.png if it isn\'t up yet.',
    links: [['Open profile folder', 'profile/']] },
  { date: '2026-10-11', text: 'Instagram Name field: „Резонанца · програмерска уметност“. Bio: paste from below. Link: https://rezonanca.art/?utm_source=instagram&utm_medium=bio' },
  { date: '2026-10-11', text: 'Highlight „Радови“ (Instagram phone app; the website can\'t make Highlights). Folder: profile/highlights/1-radovi.',
    steps: [
      'Get the files onto your phone: in Finder select everything in the folder → right-click → Share → AirDrop → your iPhone. They land in Photos. (No AirDrop: send them to yourself in Telegram „Saved Messages“ as files.)',
      'Instagram app → + → Story → pick 01-… → „Your story“. Repeat for 02, 03, 04, 05. Don\'t post 00-cover.',
      'Your profile → the „New“ (+) circle under the bio → tick the 5 stories → Next → name it Радови.',
      'Edit cover → the gallery icon → pick 00-cover.png → Done.',
      'That\'s it: Stories disappear after 24 h but stay in the Highlight forever. Nothing to delete or archive.',
    ],
    links: [['Open 1-radovi', 'profile/highlights/1-radovi/']] },
  { date: '2026-10-11', text: 'After 20:10 (launch posts are out): Highlight „Процес“, same steps with the two Reel videos in profile/highlights/2-proces (01, 02), cover 00-cover.png.',
    links: [['Open 2-proces', 'profile/highlights/2-proces/']] },
  { date: '2026-10-11', text: 'Highlight „Поручивање“: wait. Claude makes the 3 „how to order“ Story slides first (folder has the cover and a TODO).',
    links: [['Open 3-poruchivanje', 'profile/highlights/3-poruchivanje/']] },
];
const BIO = 'Резонанца · програмерска уметност\nПостери нацртани кодом, без AI.\nШтампано у Новом Саду · поузећем\n↓ rezonanca.art';

const PLAN = [
  // ---- Week 1: launch
  { date: '2026-10-11', time: '20:00', slot: 1, name: 'halvorsen', title: 'Халворсен (launch post 1 of 3)', kind: 'Photo', ig: true,
    note: 'Launch day: post these 3 one after another, in this order (oldest first, so the Reel ends up top-left).',
    media: [feed('halvorsen')], igCap: piece('halvorsen') },
  { date: '2026-10-11', time: '20:05', slot: 2, name: 'morska-zvezda', title: 'Морска звезда (launch post 2 of 3)', kind: 'Photo', ig: true,
    media: [feed('morska-zvezda')], igCap: piece('morska-zvezda', 'Цела слика је једна једначина: z² + c. Нацртано кодом, тачку по тачку. Без AI.') },
  { date: '2026-10-11', time: '20:10', slot: 3, name: 'lorenc-reel', title: 'Reel: Лоренц црта сам себе (launch post 3 of 3)', kind: 'Reel', ig: true, tt: '19:00',
    media: [reel('lorenc')],
    igCap: `Ово није видео монтажа. Ово је код који црта.\n\n260.000 корака, три једначине, једна путања која се никад не понови.\nЛоренцов атрактор, 1963.\n\nrezonanca.art\n\n${TAGS.reel} #lorenz`,
    ttCap: `Код црта Лоренцов атрактор, 260.000 корака. Без AI, само JavaScript. ${TAGS.tiktok} #lorenz #chaostheory` },
  { date: '2026-10-14', time: '20:00', slot: 1, name: 'halvorsen-reel', title: 'Reel: Халворсен црта сам себе', kind: 'Reel', ig: true, tt: '19:00',
    media: [reel('halvorsen')],
    igCap: `Од празног листа до последње линије.\n\nХалворсенов атрактор: три једначине, једна путања, 260.000 корака.\nОвако настаје постер, без AI, без шаблона.\n\nrezonanca.art\n\n${TAGS.reel} #halvorsen`,
    ttCap: `Халворсенов атрактор, нацртан кодом корак по корак. Без AI. ${TAGS.tiktok} #chaostheory` },
  { date: '2026-10-16', time: '20:00', slot: 1, name: 'tomas', title: 'Томас + детаљ (carousel, 2 slides)', kind: 'Carousel', ig: true, tt: '19:00',
    note: 'TikTok gets the Томас Reel instead of the carousel (file in the same folder).',
    media: [...numbered([feed('tomas'), detail('tomas')]), { ...reel('tomas'), ttOnly: true }],
    igCap: piece('tomas', 'Друга слика: детаљ изблиза. Свака линија је један корак рачуна. Без AI.'),
    ttCap: `Томасов атрактор: dx/dt = sin y − bx. Три кратке једначине, 420.000 корака. Без AI. ${TAGS.tiktok}` },
  { date: '2026-10-18', time: '12:00', slot: 1, name: 'aizava-tiktok', title: 'TikTok: Аизава црта сам себе', kind: 'Reel', tt: '12:00',
    media: [reel('aizava')],
    ttCap: `Аизава: сфера исплетена из једне нити, нацртана кодом. Без AI. ${TAGS.tiktok} #chaostheory` },

  // ---- Week 2
  { date: '2026-10-19', time: '20:00', slot: 1, name: 'carousel-atraktor', title: 'Carousel: „Шта је чудни атрактор?“ (7 slides)', kind: 'Carousel', ig: true, tt: '19:00', owner: 'claude',
    todo: 'Claude makes the 7 slides (brand template, step 3 of the plan). Also posted to TikTok as a photo carousel.',
    igCap: `Шта је чудни атрактор? Превуци.\n\nЕдвард Лоренц, MIT, 1963: три једначине за атмосферу, и први пут да је неко видео ефекат лептира.\n\nrezonanca.art\n\n${TAGS.attractor}`,
    ttCap: `Шта је чудни атрактор, у 7 слика. ${TAGS.tiktok} #chaostheory #butterflyeffect` },
  { date: '2026-10-21', time: '20:00', slot: 1, name: 'mandelbrot-zoom', title: 'Reel: зум у Морску звезду', kind: 'Reel', ig: true, tt: '19:00', owner: 'claude',
    todo: 'Claude renders the continuous Mandelbrot zoom (10 s) before this date.',
    igCap: `Зумирамо у једну једначину: z² + c.\n\nНа крају пута: Морска звезда, увеличано четиристо пута.\nНацртано кодом. Без AI.\n\nrezonanca.art\n\n${TAGS.mandelbrot}`,
    ttCap: `Зум у Манделбротов скуп, све из z² + c. Без AI. ${TAGS.tiktok} #mandelbrot #fractal` },
  { date: '2026-10-23', time: '20:00', slot: 1, name: 'spirala', title: 'Спирала + детаљ (carousel, 2 slides)', kind: 'Carousel', ig: true,
    media: numbered([feed('spirala'), detail('spirala')]),
    igCap: piece('spirala', 'Друга слика: детаљ изблиза. Нацртано кодом, тачку по тачку. Без AI.') },
  { date: '2026-10-25', time: '12:00', slot: 1, name: 'aizava-reel', title: 'Reel: Аизава црта сам себе', kind: 'Reel', ig: true,
    media: [reel('aizava')],
    igCap: `Сфера исплетена из једне нити.\n\nАизавин атрактор, нацртан кодом корак по корак. Без AI.\n\nrezonanca.art\n\n${TAGS.reel} #aizawa` },

  // ---- Week 3
  { date: '2026-10-26', time: '20:00', slot: 1, name: 'unboxing', title: 'Reel: први отисак, распакивање и урамљивање', kind: 'Reel', ig: true, tt: '19:00', owner: 'filip',
    todo: 'You shoot (vertical, daylight): the tube/box, pulling out the print, placing it in the frame, the frame on the wall. 10-20 s of clips. Drop them in this folder and Claude edits the Reel. No prints yet? Swap this with the 13 Nov carousel.',
    igCap: `Први отисак стигао из штампарије. 12 боја, мат папир, 50 × 70.\nОвако изгледа кад код изађе са екрана.\n\nrezonanca.art\n\n#posteri #enterijer #dekoracija #novisad #wallart #codeart`,
    ttCap: `Од кода до зида: први отисак. ${TAGS.tiktok} #unboxing #wallart` },
  { date: '2026-10-28', time: '20:00', slot: 1, name: 'carousel-z2c', title: 'Carousel: „z² + c: цела дефиниција“', kind: 'Carousel', ig: true, tt: '19:00', owner: 'claude',
    todo: 'Claude makes the Mandelbrot carousel (brand template).',
    igCap: `z² + c. То је цела дефиниција. Превуци.\n\nНајпознатији фрактал на свету стане у три карактера.\n\nrezonanca.art\n\n${TAGS.mandelbrot}`,
    ttCap: `Цео Манделбротов скуп стане у z² + c. ${TAGS.tiktok} #mandelbrot #fractal` },
  { date: '2026-10-30', time: '20:00', slot: 1, name: 'klifordov-veo', title: 'Клифордов вео', kind: 'Photo', ig: true,
    media: [feed('klifordov-veo')], igCap: piece('klifordov-veo', 'Нацртано кодом, тачку по тачку. Без AI.') },

  // ---- Week 4
  { date: '2026-11-02', time: '20:00', slot: 1, name: 'founder', title: 'Reel: „Зашто правим постере од кода“', kind: 'Reel', ig: true, tt: '19:00', owner: 'filip',
    todo: 'You record: voice-over only, or hands + laptop with code, then the printed poster (30-45 s). No face needed. Claude writes the script and edits.',
    igCap: `Програмер сам из Новог Сада. Резонанца је место где се мој посао и математика сусрећу са зидом твог стана.\nСваки рад пишем сам, у JavaScript-у. Без AI, без шаблона.\n\nrezonanca.art\n\n#novisad #madeinserbia #codeart #creativecoding #posteri`,
    ttCap: `Зашто правим постере од кода. ${TAGS.tiktok} #novisad` },
  { date: '2026-11-04', time: '20:00', slot: 1, name: 'struktura-reel', title: 'Reel: Структура расте', kind: 'Reel', ig: true, tt: '19:00', owner: 'claude',
    todo: 'Claude adds a film mode for the Структура style and renders the Reel.',
    igCap: `Хиљаде зрака из једног језгра, нацртано кодом док гледаш.\n\nrezonanca.art\n\n${TAGS.reel}`,
    ttCap: `Код црта сигнал из једног језгра. Без AI. ${TAGS.tiktok}` },
  { date: '2026-11-06', time: '20:00', slot: 1, name: 'kolekcija-atraktori', title: 'Carousel: колекција Атрактори (6 slides)', kind: 'Carousel', ig: true, tt: '19:00',
    note: 'TikTok: upload the same 6 images as a photo post.',
    media: numbered(['tomas', 'halvorsen', 'klifordov-veo', 'de-zong', 'lorenc', 'aizava'].map(feed)),
    igCap: `Атрактори. Шест система, шест путања које се никад не понављају. Превуци.\n\nКоји би стајао на твом зиду?\n\n${BUY}\n\n${TAGS.attractor}`,
    ttCap: `Шест чудних атрактора, нацртаних кодом. Који је твој? ${TAGS.tiktok} #chaostheory` },
];

const STORIES = {
  '2026-10-11': 'Stories this week: share every new post to your Story. Behind the scenes: a short clip of code on your screen (no face needed).',
  '2026-10-19': 'Stories: poll sticker „Која боја за твој зид?“ with two posters side by side.',
  '2026-10-26': 'Stories: Q&A on how ordering works (поузећем, 500 RSD поштарина, потврда у року од 24 h).',
  '2026-11-02': 'Stories: countdown sticker for the giveaway (1 framed print: follow + tag 2 friends + share).',
};

// ---- Sync with the auto-poster repo (github.com/FilipRastovic/rezonanca-social): pull posted.json records first.
const git = (...a) => execFileSync('git', ['-C', SOCIAL, ...a], { encoding: 'utf8' });
const isRepo = await fs.access(path.join(SOCIAL, '.git')).then(() => true, () => false);
if (isRepo) git('pull', '--rebase', '--autostash', '-q');

// ---- Build the folders.
const exists = (f) => fs.access(f).then(() => true, () => false);
await fs.mkdir(POSTS, { recursive: true });
for (const post of PLAN) {
  post.folder = `${post.date}-${post.slot}-${post.name}`;
  const dir = path.join(POSTS, post.folder);
  await fs.mkdir(dir, { recursive: true });
  post.files = [];
  let missing = 0;
  for (const m of post.media || []) {
    const to = path.join(dir, m.as);
    if (m.detail) {
      // Close-up straight from the 1800×2400 render: native pixels, no scaling.
      const src = S('.cache', `${m.detail}-sr.png`);
      if (!(await exists(src))) { missing++; continue; }
      await sharp(src).removeAlpha().extract({ left: 360, top: 309, width: 1080, height: 1350 })
        .jpeg({ quality: 92, chromaSubsampling: '4:4:4', mozjpeg: true }).toFile(to);
    } else {
      if (!(await exists(m.from))) { missing++; continue; }
      await fs.copyFile(m.from, to);
      // Reel cover for the auto-poster: the finished poster in the story frame.
      if (m.thumb && !m.ttOnly && (await exists(m.thumb))) await fs.copyFile(m.thumb, path.join(dir, 'cover.jpg'));
    }
    post.files.push({ name: m.as, thumb: m.thumb ? path.relative(SOCIAL, m.thumb) : null, video: m.as.endsWith('.mp4'), ttOnly: !!m.ttOnly });
  }
  if (post.igCap) await fs.writeFile(path.join(dir, 'caption-instagram.txt'), post.igCap + '\n');
  if (post.ttCap) await fs.writeFile(path.join(dir, 'caption-tiktok.txt'), post.ttCap + '\n');
  if (post.todo) await fs.writeFile(path.join(dir, 'TODO.txt'), post.todo + '\n');
  post.status = post.owner && post.owner !== 'ready' ? post.owner : missing ? 'claude' : 'ready';
  // Written by social/tools/publish.mjs after it posts (Instagram + Facebook).
  post.posted = await fs.readFile(path.join(dir, 'posted.json'), 'utf8').then(JSON.parse, () => null);
}
// Drop folders of posts that are no longer in the plan (e.g. after a date change), unless already posted.
for (const d of await fs.readdir(POSTS)) {
  if (PLAN.some((p) => p.folder === d)) continue;
  if (await exists(path.join(POSTS, d, 'posted.json'))) continue;
  await fs.rm(path.join(POSTS, d), { recursive: true, force: true });
}

// Schedule for the auto-poster: Instagram + Facebook posts whose media is ready (TikTok stays manual).
const schedule = PLAN.filter((p) => p.ig && p.status === 'ready').map((p) => ({
  id: p.folder, date: p.date, time: p.time, title: p.title,
  files: p.files.filter((f) => !f.ttOnly).map((f) => f.name),
}));
await fs.writeFile(S('schedule.json'), JSON.stringify({ timezone: 'Europe/Belgrade', posts: schedule }, null, 2) + '\n');

// ---- Highlight folders: cover + content, numbered in posting order.
const HL = S('profile', 'highlights');
const HIGHLIGHTS = {
  '1-radovi': { cover: 'radovi', items: ['halvorsen', 'morska-zvezda', 'tomas', 'aizava', 'klifordov-veo'].map((x) => S('story', `${x}-1080x1920.jpg`)) },
  '2-proces': { cover: 'proces', items: ['lorenc', 'halvorsen'].map((x) => S('reels', `${x}-draw-1080x1920.mp4`)) },
  '3-poruchivanje': { cover: 'poruchivanje', items: [], todo: 'Claude makes 3 Story slides: how ordering works (or the waitlist while sales are closed), shipping 500 RSD, payment on delivery. Then: same steps as Радови.' },
};
for (const [name, h] of Object.entries(HIGHLIGHTS)) {
  const dir = path.join(HL, name);
  await fs.mkdir(dir, { recursive: true });
  await fs.copyFile(S('profile', `highlight-${h.cover}-1080x1920.png`), path.join(dir, '00-cover.png'));
  for (const [i, f] of h.items.entries()) if (await exists(f)) await fs.copyFile(f, path.join(dir, `${String(i + 1).padStart(2, '0')}-${path.basename(f)}`));
  if (h.todo) await fs.writeFile(path.join(dir, 'TODO.txt'), h.todo + '\n');
}

// ---- Build the calendar page.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const DAYS = ['нед', 'пон', 'уто', 'сре', 'чет', 'пет', 'суб'];
const MONTHS = ['јан', 'феб', 'мар', 'апр', 'мај', 'јун', 'јул', 'авг', 'сеп', 'окт', 'нов', 'дец'];
const dayLabel = (d) => { const x = new Date(d + 'T12:00'); return `${DAYS[x.getDay()]} ${x.getDate()}. ${MONTHS[x.getMonth()]}`; };
const STATUS = { ready: ['Ready to post', 'ok'], claude: ['Claude prepares', 'wait'], filip: ['You shoot', 'you'] };
const href = (p) => p.split('/').map(encodeURIComponent).join('/');

const weeks = [
  { label: 'Today · setup', range: 'Sun 11 Oct, before 20:00', setup: true },
  { label: 'Week 1 · launch', range: '11 - 18 Oct', from: '2026-10-11', to: '2026-10-18' },
  { label: 'Week 2', range: '19 - 25 Oct', from: '2026-10-19', to: '2026-10-25' },
  { label: 'Week 3', range: '26 Oct - 1 Nov', from: '2026-10-26', to: '2026-11-01' },
  { label: 'Week 4', range: '2 - 8 Nov', from: '2026-11-02', to: '2026-11-08' },
];

const card = (p) => {
  const [stLabel, stCls] = STATUS[p.status];
  const base = `posts/${p.folder}`;
  const thumbs = p.files.length
    ? p.files.map((f) => {
      const src = href(f.video ? f.thumb : `${base}/${f.name}`);
      return `<a class="th${f.video ? ' vid' : ''}" href="${href(`${base}/${f.name}`)}" title="${esc(f.name)}"><img loading="lazy" src="${src}" alt=""></a>`;
    }).join('')
    : `<div class="th empty">${p.status === 'filip' ? 'your footage' : 'in progress'}</div>`;
  const auto = p.posted ? `<span class="st ok">Posted ✓ ${esc((p.posted.at || '').slice(0, 16).replace('T', ' '))}</span>` : p.ig && p.status === 'ready' ? '<span class="st auto">IG + FB auto</span>' : '';
  const plats = [p.ig && `<span class="pl ig">Instagram ${p.time}</span>`, p.tt && `<span class="pl tt">TikTok ${p.tt}</span>`].filter(Boolean).join('');
  const caps = [p.igCap && ['Instagram caption', p.igCap], p.ttCap && ['TikTok caption', p.ttCap]].filter(Boolean)
    .map(([l, c], i) => `<details><summary>${l}</summary><pre>${esc(c)}</pre></details><button class="copy" data-cap="${esc(c)}">Copy ${l.split(' ')[0]}</button>`).join('');
  return `<article class="post" data-id="${p.folder}" data-date="${p.date}">
    <div class="thumbs">${thumbs}</div>
    <div class="body">
      <div class="meta"><span class="kind">${p.kind}</span>${plats}<span class="st ${stCls}">${stLabel}</span>${auto}</div>
      <h3>${esc(p.title)}</h3>
      ${p.note ? `<p class="note">${esc(p.note)}</p>` : ''}
      ${p.todo ? `<p class="todo">${esc(p.todo)}</p>` : ''}
      <div class="actions">
        <a class="btn" href="${href(base)}/">Open folder</a>${caps}
        <label class="done"><input type="checkbox"> posted</label>
      </div>
    </div>
  </article>`;
};

const weekHtml = weeks.map((w) => {
  if (w.setup) {
    return `<section class="week"><header><h2>${w.label}</h2><span>${w.range}</span></header>
      <ol class="prep">${PREP.map((t, i) => ({ ...t, i })).sort((a, b) => a.date.localeCompare(b.date)).map((t) => `<li data-id="prep-${t.i}"><label class="done"><input type="checkbox"></label><b>${dayLabel(t.date)}</b><span>${esc(t.text)}${t.steps ? `<ol class="steps">${t.steps.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}${(t.links || []).map(([l, h]) => ` <a class="btn" href="${href(h)}">${esc(l)}</a>`).join('')}</span></li>`).join('')}</ol>
      <div class="bio"><div><b>Instagram bio</b><pre>${esc(BIO)}</pre></div><button class="copy" data-cap="${esc(BIO)}">Copy bio</button></div></section>`;
  }
  const items = PLAN.filter((p) => p.date >= w.from && p.date <= w.to);
  const days = [...new Set(items.map((p) => p.date))];
  const story = STORIES[w.from];
  return `<section class="week"><header><h2>${w.label}</h2><span>${w.range}</span></header>
    ${story ? `<p class="story">${esc(story)}</p>` : ''}
    ${days.map((d) => `<div class="day" data-date="${d}"><div class="dl">${dayLabel(d)}</div><div class="list">${items.filter((p) => p.date === d).map(card).join('')}</div></div>`).join('')}
  </section>`;
}).join('');

const counts = Object.fromEntries(Object.keys(STATUS).map((k) => [k, PLAN.filter((p) => p.status === k).length]));
const html = `<!doctype html>
<html lang="sr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Резонанца · posting calendar</title>
<style>
:root{--bg:#04070f;--panel:#0a1120;--line:#18233a;--text:#dce6f5;--dim:#8796b0;--cyan:#50e6ff;--amber:#ffa546;--blue:#285ce8;--ok:#3ddc97;--you:#ff7ab6}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:15px/1.5 -apple-system,BlinkMacSystemFont,"Inter","Segoe UI",sans-serif}
.wrap{max-width:1040px;margin:0 auto;padding:32px 16px 80px}
h1{font-size:26px;letter-spacing:.14em;margin:0;text-transform:uppercase}h1 small{display:block;font-size:13px;letter-spacing:.04em;color:var(--dim);text-transform:none;margin-top:6px;font-weight:400}
.legend{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 6px}.legend span{font-size:13px}
.next{margin:20px 0 8px;padding:14px 16px;border:1px solid var(--cyan);border-radius:10px;background:rgba(80,230,255,.06)}
.next b{color:var(--cyan)}
.week{margin-top:36px}.week>header{display:flex;align-items:baseline;gap:12px;border-bottom:1px solid var(--line);padding-bottom:8px;margin-bottom:14px}
.week h2{margin:0;font-size:18px;letter-spacing:.06em}.week>header span{color:var(--dim);font-size:13px}
.story{color:var(--dim);font-size:13px;margin:0 0 14px;padding-left:12px;border-left:2px solid var(--blue)}
.day{display:grid;grid-template-columns:110px 1fr;gap:14px;margin-bottom:14px}.dl{font:600 13px/1.4 ui-monospace,Menlo,monospace;color:var(--cyan);padding-top:12px;text-transform:uppercase}
.day.today .dl::after{content:" · данас";color:var(--amber)}
.list{display:grid;gap:12px}
.post{display:grid;grid-template-columns:auto 1fr;gap:16px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:14px}
.post.posted{opacity:.45}
.thumbs{display:flex;gap:6px;flex-wrap:wrap;max-width:260px}
.th{display:block;width:76px;height:95px;border-radius:6px;overflow:hidden;border:1px solid var(--line);position:relative;background:#000}
.th img{width:100%;height:100%;object-fit:cover;display:block}.th.vid{height:135px}
.th.vid::after{content:"▶";position:absolute;inset:auto 6px 6px auto;font-size:12px;color:#fff;background:rgba(0,0,0,.6);border-radius:4px;padding:1px 5px}
.th.empty{display:flex;align-items:center;justify-content:center;text-align:center;font-size:11px;color:var(--dim);width:76px;border-style:dashed;background:transparent}
.meta{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.kind,.pl,.st{font-size:11.5px;padding:2px 8px;border-radius:99px;border:1px solid var(--line);color:var(--dim)}
.pl.ig{color:#ffb3d9;border-color:#5a2a48}.pl.tt{color:#9ff;border-color:#1f4f55}
.st.ok{color:var(--ok);border-color:#1f5a43}.st.auto{color:var(--cyan);border-color:#1f4f55}.st.wait{color:var(--amber);border-color:#5e4220}.st.you{color:var(--you);border-color:#5e2742}
.post h3{margin:8px 0 4px;font-size:16px}
.note,.todo{margin:4px 0;font-size:13px;color:var(--dim)}.todo{color:#e9c48f}
.actions{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:10px}
.btn,.copy{font:inherit;font-size:13px;color:var(--text);background:#111b31;border:1px solid #24345a;border-radius:7px;padding:5px 11px;text-decoration:none;cursor:pointer}
.btn:hover,.copy:hover{border-color:var(--cyan)}.copy.copied{border-color:var(--ok);color:var(--ok)}
details{width:100%;order:9}summary{cursor:pointer;color:var(--dim);font-size:13px}
pre{white-space:pre-wrap;font:13px/1.5 ui-monospace,Menlo,monospace;background:#060b16;border:1px solid var(--line);border-radius:8px;padding:10px;margin:6px 0 0}
.done{font-size:13px;color:var(--dim);display:inline-flex;gap:6px;align-items:center;cursor:pointer}
.prep{list-style:none;padding:0;margin:0;display:grid;gap:8px}
.prep li{display:grid;grid-template-columns:24px 100px 1fr;gap:10px;align-items:start;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.prep .steps{margin:8px 0 6px;padding-left:20px;display:grid;gap:4px;color:var(--dim);font-size:14px}.prep .steps li{display:list-item;background:none;border:0;padding:0}
.prep li b{font:600 12.5px/1.6 ui-monospace,Menlo,monospace;color:var(--cyan);text-transform:uppercase}.prep li.posted{opacity:.45}
.bio{display:flex;gap:16px;align-items:flex-end;justify-content:space-between;margin-top:12px;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:12px}
.bio pre{margin-top:6px}
.foot{margin-top:40px;color:var(--dim);font-size:13px}
@media (max-width:640px){.day{grid-template-columns:1fr}.dl{padding-top:0}.post{grid-template-columns:1fr}.prep li{grid-template-columns:24px 1fr}.prep li span{grid-column:2}}
</style></head><body><div class="wrap">
<h1>Резонанца<small>Posting calendar · Instagram + TikTok · built ${new Date().toISOString().slice(0, 10)}</small></h1>
<div class="legend"><span class="st ok">Ready to post: ${counts.ready}</span><span class="st wait">Claude prepares: ${counts.claude}</span><span class="st you">You shoot: ${counts.filip}</span></div>
<div class="next" id="next"></div>
${weekHtml}
<p class="foot">How to post: on Sunday open Meta Business Suite (Instagram) and TikTok Studio on desktop, and schedule the week. For each post, click <b>Open folder</b>, drag the files in, click <b>Copy</b> and paste the caption. Tick <b>posted</b> when it's scheduled (saved in this browser only).<br>Captions leave prices out until the print shop confirms them.</p>
</div>
<script>
const KEY = 'rezonanca-calendar-done';
let done = {};
try { done = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(done)); } catch (e) {} };
document.querySelectorAll('[data-id]').forEach((el) => {
  const box = el.querySelector('.done input');
  if (!box) return;
  box.checked = !!done[el.dataset.id];
  el.classList.toggle('posted', box.checked);
  box.addEventListener('change', () => { done[el.dataset.id] = box.checked; el.classList.toggle('posted', box.checked); save(); showNext(); });
});
document.querySelectorAll('.copy').forEach((b) => b.addEventListener('click', async () => {
  const t = b.dataset.cap;
  try { await navigator.clipboard.writeText(t); }
  catch (e) { const a = document.createElement('textarea'); a.value = t; document.body.append(a); a.select(); document.execCommand('copy'); a.remove(); }
  const old = b.textContent; b.textContent = 'Copied'; b.classList.add('copied');
  setTimeout(() => { b.textContent = old; b.classList.remove('copied'); }, 1400);
}));
const today = new Date(); const iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
document.querySelectorAll('.day').forEach((d) => d.classList.toggle('today', d.dataset.date === iso));
function showNext() {
  const n = [...document.querySelectorAll('.post')].find((p) => p.dataset.date >= iso && !done[p.dataset.id]);
  const el = document.getElementById('next');
  if (!n) { el.innerHTML = '<b>All scheduled posts are done.</b> Ask Claude for the next month.'; return; }
  const day = n.closest('.day').querySelector('.dl').textContent.replace(' · данас', '');
  el.innerHTML = '<b>Next up:</b> ' + day + ' · ' + n.querySelector('h3').textContent + ' · ' + [...n.querySelectorAll('.pl')].map((x) => x.textContent).join(', ');
}
showNext();
</script></body></html>`;
await fs.writeFile(S('calendar.html'), html);
// Push the rebuilt schedule + media so the auto-poster sees them.
if (isRepo) {
  git('add', '-A');
  if (git('status', '--porcelain').trim()) {
    git('commit', '-q', '-m', 'Calendar rebuild\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>');
    git('push', '-q');
    console.log('✓ pushed to rezonanca-social (auto-poster)');
  }
}
console.log(`✓ calendar.html + ${PLAN.length} post folders  (ready ${counts.ready}, claude ${counts.claude}, filip ${counts.filip})`);
