# Room shots for the site: every poster (and colourway) in the approved black-frame scene, both languages.
#   ~/.venvs/rezonanca-mockup/bin/python scripts/render-rooms.py [slug-or-key ...]   (--interiors: homepage scenes; --minis: mini cards; --frames: oak shots + minis + manifest)
# Scenes + masks come from ../social/mockups/scenes (extract.py / reshape.py); same lighting as social/mockups/render.py.
# → public/rooms/<key>-<lang>.webp (800×1067, 3:4 crop around the frame, product gallery image 2)
#   public/rooms/<key>-<lang>-sm.webp (480×640, cards)
# Scenes rotate in the shop's featured order so neighbouring cards differ; colourways use their product's scenes.
import json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image

WEB = Path(__file__).resolve().parent.parent
SC = WEB.parent / 'social/mockups/scenes'
OUT = WEB / 'public/rooms'
# Framed scenes rotate as the card image (shot 1) and a second gallery shot; boards/outdoor are the third shot.
FRAMED = ['poster-black-frame-minimalist-1-34', 'wooden-frame-summer-background-2-1-34', 'poster-black-frame-minimalist-2-34', 'poster-aesthetic']
EXTRA = ['a3-poster-minimalist-1', 'a3-poster-minimalist-2']
OUTDOOR = 'a4-poster-laying-outdoor-34'  # sparingly: every 7th product
SCENES = FRAMED  # homepage interiors pick from these
BORDER = 0.04
scenes = json.loads((SC / 'scenes.json').read_text())

# Products in the collection's default ("featured") order: series interleaved, as in CollectionPage.astro,
# so neighbouring cards on the shop grid get different scenes.
FEATURED_JS = "const F=['attractor','mandelbrot','structure','flux','orbit','city','ridges','hopf','flame','object'];const L=F.map(k=>m.productsBySeries(k));const o=[];for(let i=0;o.length<m.PRODUCTS.length;i++)for(const l of L)if(l[i])o.push(l[i]);"
prods = json.loads(subprocess.check_output(['node', '-e', "import('./src/data/products.js').then(m=>{" + FEATURED_JS + "console.log(JSON.stringify(o.map(p=>[p.slug,p.tones||[]])))})"], cwd=WEB))
jobs = []  # (key, [scene for shot 1, 2, 3])
for i, (slug, tones) in enumerate(prods):
    third = OUTDOOR if i % 7 == 3 else EXTRA[i % 2]
    shots = [FRAMED[i % 4], FRAMED[(i + 2) % 4], third]
    for k in [slug] + [f'{slug}-{t}' for t in tones]:
        jobs.append((k, shots))
# Homepage "У простору" scenes: (file key, poster, scene) → public/interiors/<file>-<lang>.webp, whole scene 1600w.
INTERIORS = [('living', 'halvorsen', 'poster-black-frame-minimalist-1-34'), ('studio', 'spirala', 'poster-black-frame-minimalist-2-34')]
interiors = '--interiors' in sys.argv
want = [a for a in sys.argv[1:] if not a.startswith('--') and (sys.argv.index(a) == 0 or sys.argv[sys.argv.index(a) - 1] != '--test')]
all_jobs = list(jobs)
if interiors or '--minis' in sys.argv: jobs = []
elif want: jobs = [j for j in jobs if j[0] in want or j[0].split('-roza')[0] in want]

def coeffs(dst, src):
    A, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
        b += [u, v]
    return np.linalg.solve(np.array(A, float), np.array(b, float))

def sheet(art, w, h, border=BORDER):
    paper = Image.new('RGB', (w, h), 'white')
    m = round(min(w, h) * border)
    s = min((w - 2 * m) / art.width, (h - 2 * m) / art.height)
    a = art.resize((round(art.width * s), round(art.height * s)), Image.LANCZOS)
    paper.paste(a, ((w - a.width) // 2, (h - a.height) // 2))
    return paper

cache = {}
def compose(key, name, lang, art=None, border=None):
    """The poster (exact print image) placed and lit in the scene; returns the whole scene + its frame quad.
    art/border: place a ready image instead (the mini cards already carry their white border, so border=0)."""
    if name not in cache:
        bg = Image.open(SC / f'{name}.jpg').convert('RGB')
        M = np.asarray(Image.open(SC / f'{name}-mask.png'), np.float32)[..., None] / 255
        B = np.asarray(bg, np.float32)
        ref = np.percentile(B[M[..., 0] > 0.5], 85, axis=0)
        light = B / np.maximum(ref, 1)
        cache[name] = (bg, B, M, np.where(light > 1, 1 + (light - 1) * 0.6, light))
    bg, B, M, gain = cache[name]
    q = np.array(scenes[name]['quad'])
    w = round((np.linalg.norm(q[1] - q[0]) + np.linalg.norm(q[2] - q[3])) / 2)
    h = round((np.linalg.norm(q[3] - q[0]) + np.linalg.norm(q[2] - q[1])) / 2)
    if art is None: art = Image.open(WEB / f'public/posters/{key}-{lang}-lg.webp').convert('RGB')
    warped = sheet(art, w, h, BORDER if border is None else border).transform(bg.size, Image.PERSPECTIVE, coeffs(q, [(0, 0), (w, 0), (w, h), (0, h)]), Image.BICUBIC, fillcolor=(0, 0, 0))
    P = np.asarray(warped, np.float32)
    return Image.fromarray(np.clip(B * (1 - M) + P * gain * M, 0, 255).astype(np.uint8)), q

def crop34(res, q):
    # 3:4 crop centred on the frame
    cx, cy = q[:, 0].mean(), q[:, 1].mean()
    fh = q[:, 1].max() - q[:, 1].min()  # never let the frame shrink below ~half the picture height
    H = min(res.height, res.width * 4 / 3, fh * 1.85); W = H * 3 / 4
    x0 = min(max(cx - W / 2, 0), res.width - W); y0 = min(max(cy - H / 2, 0), res.height - H)
    return res.crop((round(x0), round(y0), round(x0 + W), round(y0 + H)))

# --test <key>: one poster in every scene → public/rooms/_test-<scene>.webp (not used by the site)
if '--test' in sys.argv:
    key = sys.argv[sys.argv.index('--test') + 1]
    for name in FRAMED + EXTRA + [OUTDOOR]:
        res, q = compose(key, name, 'sr')
        crop34(res, q).resize((540, 720), Image.LANCZOS).save(OUT / f'_test-{name}.webp', quality=80)
    jobs = []

# Product page main image for "Принт урамљен": a black-frame and an oak-frame room shot per key. Reuse a gallery
# shot when it already has that frame; otherwise render <key>-<lang>-oak.webp. Manifest → src/data/room-frames.json.
BLACK = {'poster-black-frame-minimalist-1-34', 'poster-black-frame-minimalist-2-34', 'poster-aesthetic'}
OAK = 'wooden-frame-summer-background-2-1-34'
frames = {}
for key, shots in jobs:
    black = next(('' if n == 0 else f'-{n + 1}') for n, sc in enumerate(shots) if sc in BLACK)
    oak = next((('' if n == 0 else f'-{n + 1}') for n, sc in enumerate(shots) if sc == OAK), '-oak')
    frames[key] = {'black': black, 'oak': oak}

# Minis: the real printed card (../social/mockups/minis/<key>.png, from social/mockups/mini-cards.mjs; Cyrillic only,
# same in both languages) → public/minis/card-<key>.webp (Мини принт) and, in the small black frame scene,
# public/minis/framed-<key>.webp (Мини урамљен).
MINI_SCENE = 'small-poster-frame'
CARDS = WEB.parent / 'social/mockups/minis'
def render_minis(keys):
    for key in keys:
        card = Image.open(CARDS / f'{key}.png').convert('RGB')
        card.resize((900, 900), Image.LANCZOS).save(WEB / f'public/minis/card-{key}.webp', quality=80, method=6)
        res, q = compose(key, MINI_SCENE, 'sr', art=card, border=0)
        crop34(res, q).resize((800, 1067), Image.LANCZOS).save(WEB / f'public/minis/framed-{key}.webp', quality=70, method=6)
        print('mini', key)

# Files: <key>-<lang>.webp (+ -sm) = shot 1 (card image, gallery); <key>-<lang>-2/-3.webp (+ -sm) = more gallery shots.
skip_rooms = '--frames' in sys.argv  # oak shots + minis + manifest only, keep existing room shots
for key, shots in [] if skip_rooms else jobs:
    for lang in ('sr', 'en'):
        for n, name in enumerate(shots):
            res, q = compose(key, name, lang)
            res = crop34(res, q)
            suf = '' if n == 0 else f'-{n + 1}'
            res.resize((800, 1067), Image.LANCZOS).save(OUT / f'{key}-{lang}{suf}.webp', quality=70, method=6)
            res.resize((480, 640), Image.LANCZOS).save(OUT / f'{key}-{lang}{suf}-sm.webp', quality=68, method=6)
    print(key, shots)

for key, shots in jobs:
    if frames[key]['oak'] == '-oak':
        for lang in ('sr', 'en'):
            res, q = compose(key, OAK, lang)
            crop34(res, q).resize((800, 1067), Image.LANCZOS).save(OUT / f'{key}-{lang}-oak.webp', quality=70, method=6)
        print('oak', key)

if jobs:
    render_minis([k for k, _ in jobs])
    mf = WEB / 'src/data/room-frames.json'
    merged = {} if not want or not mf.exists() else json.loads(mf.read_text())  # partial run: update only these keys
    merged.update(frames)
    mf.write_text(json.dumps(merged, indent=0, sort_keys=True))
if '--minis' in sys.argv:
    render_minis(want or [k for k, _ in all_jobs])

for file, key, name in INTERIORS if interiors else []:
    for lang in ('sr', 'en'):
        res, _ = compose(key, name, lang)
        res.resize((1200, round(res.height * 1200 / res.width)), Image.LANCZOS).save(WEB / f'public/interiors/{file}-{lang}.webp', quality=72, method=6)
    print('interior', file, key)
