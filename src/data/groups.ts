// Theme pages that sell pieces from several series under one search phrase (e.g. "fractal art prints").
// Each gets /collection/<slug>/ (src/pages/collection/<slug>/index.astro), the sitemap, llms.txt and the footer.
export interface Group {
  slug: string; series: string[]; guide?: string; hero: string; cover: string;
  name: string; label: string; title: string; h1: string; desc: string; lead: string[]; cta: string;
}

export const GROUPS: Group[] = [
  {
    slug: 'fractal-art',
    series: ['mandelbrot', 'flame', 'inversion', 'mandelbox'],
    guide: 'fractal-art',
    hero: 'mandelbrot', // header room shot (public/interiors/collection-hero-<hero>-*.webp)
    cover: 'mandelbrotov-skup', // home tile room shot (public/rooms/<cover>-en.webp)
    name: 'Fractal art',
    label: 'FRACTALS // MANDELBROT · FLAME · INVERSION · MANDELBOX',
    title: 'Fractal Art Prints & Posters - Mandelbrot and Fractal Flames | Rezonanca',
    h1: 'Fractal art prints',
    desc: 'Fractal art prints made with code: Mandelbrot set zooms, fractal flames, circle inversion lace and 3D Mandelbox views. Fine art matte paper, ships worldwide.',
    lead: [
      'Fractal art prints, made with code. A fractal is a shape that keeps its detail however far you zoom in, like the edge of the Mandelbrot set, a fern or a coastline. Every print here starts from one short rule, run millions of times.',
      'There are four series. The Mandelbrot set posters are deep zooms into z → z² + c, each a window onto a different stretch of its coastline: Seahorse Valley, spirals, a tiny copy of the whole set. The fractal flames send millions of points jumping between a few curved rules, and their traces pile up into something like smoke or silk. The circle inversion pieces fold the plane into a square and turn it inside out in a circle, fourteen times, until the lace is finer than a pixel. Diskont goes into three dimensions: the Mandelbox, space folded into a box and turned inside out in a sphere twelve times, seen up close like architecture.',
      'Each piece is made to order on fine art matte paper, framed or unframed, and ships worldwide.',
    ],
    cta: 'Shop fractal art prints',
  },
];

export const groupFor = (slug: string) => GROUPS.find((g) => g.slug === slug);
export const groupForGuide = (guide: string) => GROUPS.find((g) => g.guide === guide);
export const groupsWith = (series: string) => GROUPS.filter((g) => g.series.includes(series));
