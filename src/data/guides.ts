// Guide pages (/guide/<slug>/): plain-English maths behind a series, for people searching the topic.
// Each section can show one of our posters (`piece` = product key) and an equation (`f`).
// Numbers quoted from our pieces come from src/data/math/<key>.json.
export interface GuideSection { h: string; p: string[]; f?: string; piece?: string; caption?: string }
export interface Guide {
  slug: string; series: string; title: string; desc: string; h1: string; kicker: string; lead: string;
  updated: string; sections: GuideSection[]; faq: { q: string; a: string }[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'what-is-a-strange-attractor',
    series: 'attractor',
    title: 'What Is a Strange Attractor? Lorenz, Chaos and the Butterfly Effect',
    desc: 'A strange attractor is the shape chaos settles into. A plain-English guide to the Lorenz, Thomas and Clifford attractors, with the equations and how they are drawn.',
    h1: 'What is a strange attractor?',
    kicker: 'Guide // Chaos theory',
    lead: 'A strange attractor is the shape a chaotic system settles into. The motion never repeats and can\'t be predicted for long, yet it always stays on the same delicate shape. Here is what that means, with the equations behind our posters.',
    updated: '2026-11-02',
    sections: [
      {
        h: 'A point that follows a rule',
        p: [
          'Picture a single point moving through space. At every moment its velocity is set by a rule that depends only on where it is right now. Mathematicians call this a dynamical system, and the space it moves in the phase space.',
          'Start the point anywhere and, after a while, it stops wandering and falls onto a particular shape. That shape is the attractor: the place the motion is drawn to and never leaves.',
        ],
        f: 'dx/dt = f(x)',
      },
      {
        h: 'Three kinds of attractor',
        p: [
          'The simplest attractor is a fixed point: a pendulum with friction ends up hanging still. The next is a loop, called a limit cycle: a heartbeat or a ticking clock repeats the same path forever.',
          'The third kind is strange. The path never settles to a point and never closes into a loop, yet it stays inside a bounded shape. The name "strange attractor" was given by the mathematicians David Ruelle and Floris Takens in 1971.',
        ],
      },
      {
        h: 'The Lorenz attractor and the butterfly effect',
        p: [
          'In 1963 the meteorologist Edward Lorenz reduced a model of warm air rising and falling to three equations. With σ = 10, ρ = 28 and β = 8/3, the solution traces the famous two-winged shape: the point loops around one wing, then jumps to the other, with no pattern in how many loops it makes before switching.',
          'Lorenz noticed that two runs starting from almost the same numbers soon looked nothing alike. In 1972 he asked in a talk whether the flap of a butterfly\'s wings in Brazil could set off a tornado in Texas, and the idea got its name: the butterfly effect.',
        ],
        f: 'dx/dt = σ(y − x)\ndy/dt = x(ρ − z) − y\ndz/dt = xy − βz',
        piece: 'lorenc',
        caption: 'Lorenz: σ = 10, ρ = 28, β = 8/3, 260,000 steps.',
      },
      {
        h: 'Why it is called chaos',
        p: [
          'Chaos here has a precise meaning: the system is fully determined by its equations, yet a tiny difference at the start grows exponentially. The rate of that growth is the Lyapunov exponent λ. When λ is positive, small errors double again and again, so long-range prediction is impossible.',
          'For the Lorenz system λ is about 0.9. Our program measures it while drawing each poster: for the Lorenz piece it came out at 0.907, which means a difference between two nearby paths doubles roughly every 0.76 time units.',
        ],
        f: '|δ(t)| ≈ |δ₀|·e^(λt),   λ > 0',
      },
      {
        h: 'A shape with a fractal dimension',
        p: [
          'Paths in phase space can never cross, because from any point the rule allows only one future. So the path keeps folding into ever thinner layers without touching itself. The result is a fractal: the Lorenz attractor has a dimension of about 2.06, a little more than a surface and far less than a solid.',
        ],
      },
      {
        h: 'The Thomas attractor',
        p: [
          'In 1999 the biologist René Thomas wrote down a system where each coordinate is pushed by the sine of the next one and slowed by friction b. The equations are cyclically symmetric: swap x, y and z in a circle and nothing changes.',
          'For large b the motion dies down. Below about b = 0.208 it turns chaotic, and the point drifts through a labyrinth of sine waves. Our Thomas poster uses b = 0.18 and 420,000 steps.',
        ],
        f: 'dx/dt = sin y − bx\ndy/dt = sin z − by\ndz/dt = sin x − bz',
        piece: 'tomas',
        caption: 'Thomas: b = 0.18, 420,000 steps.',
      },
      {
        h: 'Attractors from two lines of code',
        p: [
          'Not every attractor needs calculus. The Clifford attractor (named after Clifford Pickover) and the Peter de Jong attractor are maps: each new point is computed directly from the previous one with a few sines and cosines. Iterate a few million times and the points pile up into silk-like veils.',
          'Change the four constants a, b, c and d slightly and the veil takes a completely different shape, which is why these maps are a favourite of artists who work in code.',
        ],
        f: 'xₙ₊₁ = sin(a·yₙ) + c·cos(a·xₙ)\nyₙ₊₁ = sin(b·xₙ) + d·cos(b·yₙ)',
        piece: 'klifordov-veo',
        caption: 'Clifford: a = 1.7, b = 1.7, c = 0.6, d = 1.2.',
      },
      {
        h: 'How our attractor posters are drawn',
        p: [
          'For the three-dimensional systems the program solves the equations with the fourth-order Runge-Kutta method, a standard way to follow a path accurately in small time steps. It records every step, hundreds of thousands of them, and projects the 3D path onto the page from a chosen angle.',
          'The light in the picture is density. Where the path passes more often, the line glows brighter. Nothing is painted by hand: the shape, the shading and the glow all come from the equations. Every product page lists the exact equations, parameters and measurements behind that piece.',
        ],
      },
    ],
    faq: [
      { q: 'What is a strange attractor in simple terms?', a: 'It is the shape a chaotic system settles into. The motion never repeats and is sensitive to its starting point, but it always stays on the same bounded, fractal shape.' },
      { q: 'What is the difference between an attractor and a strange attractor?', a: 'An ordinary attractor is a point or a closed loop, so the motion becomes still or periodic. On a strange attractor the motion never repeats, nearby paths drift apart, and the shape has a fractal dimension.' },
      { q: 'Is the Lorenz attractor the butterfly effect?', a: 'The butterfly effect is the property the Lorenz attractor made famous: tiny changes at the start grow into completely different outcomes. The two-winged shape of the attractor is often drawn as a butterfly too.' },
      { q: 'Which strange attractors can I get as a poster?', a: 'Our attractor series includes Lorenz, Thomas, Aizawa, Halvorsen, Rössler, Chen, Dadras, Sprott, Rabinovich, Four Wings, Clifford and De Jong, each printed on fine art matte paper.' },
    ],
  },
  {
    slug: 'mandelbrot-set-explained',
    series: 'mandelbrot',
    title: 'The Mandelbrot Set Explained: z² + c, Fractals and Deep Zooms',
    desc: 'The Mandelbrot set explained in plain English: one equation, z² + c, the escape radius, seahorse valley, minibrots and how a deep zoom is computed and coloured.',
    h1: 'The Mandelbrot set explained',
    kicker: 'Guide // Fractals',
    lead: 'The Mandelbrot set is the most famous fractal, and its whole definition fits on one line. Here is how that one line produces an endless coastline of spirals, seahorses and tiny copies of itself, and how our posters are computed from it.',
    updated: '2026-11-02',
    sections: [
      {
        h: 'One equation',
        p: [
          'Take a complex number c, a point on a plane with a real part (left-right) and an imaginary part (up-down). Start with z = 0, square it and add c. Then square the result and add c again, and keep going.',
          'For some values of c the numbers stay small forever. For others they grow without limit. The Mandelbrot set is every c whose numbers stay small. That is the entire definition.',
        ],
        f: 'zₙ₊₁ = zₙ² + c,   z₀ = 0',
      },
      {
        h: 'The escape radius',
        p: [
          'It is proven that once |z| grows past 2, it can never come back, so the point has escaped and c is outside the set. This gives a simple test a computer can run for every pixel: repeat the step until |z| passes 2, or until a maximum number of steps is reached.',
          'Points that never escape within that limit are treated as inside the set. Our posters use between 400 and 1,400 steps per pixel; the deeper the zoom, the more steps are needed to separate the inside from the edge.',
        ],
        f: '|zₙ| > 2  ⇒  c ∉ M',
      },
      {
        h: 'Where the colour comes from',
        p: [
          'The set itself is just one flat region. All the detail lives outside it, in how fast each point escapes. The program counts the steps each point takes to pass the escape radius, and that count becomes its colour and brightness.',
          'Points far from the set escape in one or two steps and stay dark. Points close to the edge hesitate for hundreds of steps and glow. So the bright filaments in the pictures trace the boundary of the set.',
        ],
        piece: 'mandelbrotov-skup',
        caption: 'The whole set, centred at −0.6986 + 0.0016i, 400 steps per pixel.',
      },
      {
        h: 'The shape of the set',
        p: [
          'The large heart-shaped body is the main cardioid: there the numbers settle onto a single value. The round bulb on its left, centred at −1 with radius ¼, is where they settle into a cycle of two. Around them sit smaller bulbs for cycles of three, four and more, each attached at a precise point.',
          'Adrien Douady and John Hubbard proved in 1982 that the set is connected: every piece, however small it looks, is joined to the main body by thin filaments. They also gave it its name, after Benoit Mandelbrot, who made the first detailed computer pictures of it at IBM around 1980.',
        ],
      },
      {
        h: 'Seahorse valley',
        p: [
          'The gap between the main cardioid and the left bulb, near c = −0.75 + 0.1i, is called seahorse valley. Zoom in and the edge curls into rows of spirals with tails like seahorses, and each spiral holds smaller spirals.',
          'Our Seahorse Valley poster is a window 0.0065 wide, centred at −0.7454 + 0.1127i: about 477 times closer than the full view, rotated 15 degrees and computed with 900 steps per pixel.',
        ],
        piece: 'dolina-morskih-konjica',
        caption: 'Seahorse Valley: 477× zoom, 900 steps per pixel.',
      },
      {
        h: 'Minibrots: the set inside itself',
        p: [
          'Follow a filament far enough and you will find a tiny copy of the whole set, complete with its own cardioid and bulbs. These are called minibrots, and there are infinitely many of them. The largest one on the real axis sits near c = −1.75, where the numbers settle into a cycle of three.',
          'The copies are never exact. Each is wrapped in decorations that reflect where it sits, which is why no two deep zooms look the same.',
        ],
        piece: 'mali-mandelbrot',
        caption: 'Minibrot: centred at −1.7574, 46× zoom.',
      },
      {
        h: 'An infinitely detailed edge',
        p: [
          'The boundary of the set is a fractal. However far you magnify it, new detail appears, and the edge is so crumpled that it has Hausdorff dimension 2, as Mitsuhiro Shishikura proved in 1998. In other words, the edge is as complex as a line can be while still being a line.',
          'The area of the set, by contrast, is finite: about 1.506 square units. And the set holds surprises. In 1991 Dave Boll found that counting the escape steps near the neck at −0.75 gives the digits of π.',
        ],
        f: 'dim_H(∂M) = 2',
      },
      {
        h: 'Mandelbrot and Julia sets',
        p: [
          'Every value of c also has its own fractal, the Julia set, drawn by fixing c and varying the starting z instead. The Mandelbrot set is a map of all of them: when c is inside the set, its Julia set is one connected piece; when c is outside, the Julia set shatters into dust.',
        ],
      },
      {
        h: 'How our Mandelbrot posters are made',
        p: [
          'Each poster is a window into the set: a centre point, a width and a rotation. The program tests about 1.5 million points for every image, counts their escape steps and maps the counts to colour. Every product page lists the exact centre, zoom and number of steps, so you can find the same spot yourself.',
        ],
        piece: 'spirala',
        caption: 'Spiral: 886× zoom, 1,400 steps per pixel.',
      },
    ],
    faq: [
      { q: 'What is the Mandelbrot set in simple terms?', a: 'It is the set of points c for which repeating "square it and add c", starting from zero, never grows without limit. Drawn on a plane, it forms the most famous fractal.' },
      { q: 'Why is the Mandelbrot set infinite?', a: 'Its area is finite, but its boundary is infinitely detailed: magnify any part of the edge and new spirals, filaments and smaller copies of the set keep appearing.' },
      { q: 'What is seahorse valley?', a: 'The region between the main cardioid and the left bulb, near −0.75 + 0.1i, where the edge forms spirals shaped like seahorse tails.' },
      { q: 'Who discovered the Mandelbrot set?', a: 'Robert Brooks and Peter Matelski drew an early picture of it in 1978. Benoit Mandelbrot made the first detailed images at IBM around 1980, and Adrien Douady and John Hubbard named it after him.' },
    ],
  },
];

export const guideFor = (series: string) => GUIDES.find((g) => g.series === series);
