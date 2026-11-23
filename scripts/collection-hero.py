# Collection header room shot for one series: public/interiors/collection-hero-<series>-{1100,1800}.webp (40:27).
#   ~/.venvs/rezonanca-mockup/bin/python scripts/collection-hero.py <series key> <product key> <scene>
import sys, runpy
from PIL import Image
series, key, scene = sys.argv[1:4]
sys.argv = ['render-rooms.py', '__none__']  # load the helpers without rendering anything
g = runpy.run_path('scripts/render-rooms.py')
res, q = g['compose'](key, scene, 'en')
fw = q[:, 0].max() - q[:, 0].min(); fh = q[:, 1].max() - q[:, 1].min()
W = min(res.width, fw * 3.9); H = W * 27 / 40
cx, cy = q[:, 0].mean(), q[:, 1].mean() + fh * 0.12
x0 = min(max(cx - W / 2, 0), res.width - W); y0 = min(max(cy - H / 2, 0), res.height - H)
im = res.crop((round(x0), round(y0), round(x0 + W), round(y0 + H)))
for w in (1100, 1800):
    im.resize((w, round(w * 27 / 40)), Image.LANCZOS).save(f'public/interiors/collection-hero-{series}-{w}.webp', quality=78, method=6)
print('hero', series, key, scene)
