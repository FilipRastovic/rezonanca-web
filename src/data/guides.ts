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
  {
    slug: 'what-is-a-fractal-flame',
    series: 'flame',
    title: 'What Is a Fractal Flame? The Chaos Game, IFS and Flame Art',
    desc: 'How fractal flames are made: the chaos game, iterated function systems, non-linear variations and log-density colour, explained with the rules behind our flame posters.',
    h1: 'What is a fractal flame?',
    kicker: 'Guide // Fractals',
    lead: 'A fractal flame is a picture made by a single point jumping millions of times between a few simple rules picked at random. Where it lands most often, the image glows. Here is how a handful of rules turns into smoke, feathers and petals.',
    updated: '2026-11-02',
    sections: [
      {
        h: 'The chaos game',
        p: [
          'Draw three corners of a triangle and put a point anywhere. Now pick one corner at random and move the point halfway towards it. Repeat. After a few thousand jumps the points form the Sierpinski triangle, a fractal of triangles inside triangles, even though every single jump was random.',
          'This is the chaos game, popularised by the mathematician Michael Barnsley. The randomness only decides the order of the jumps. The shape itself is fixed by the rules.',
        ],
        f: 'xₙ₊₁ = Fᵢ(xₙ),   i chosen at random',
      },
      {
        h: 'Iterated function systems',
        p: [
          'Each rule in the chaos game is a function that shrinks, turns and shifts the plane. A set of such rules is called an iterated function system, or IFS, described by John Hutchinson in 1981. Its fractal is the one shape that every rule maps back onto part of itself.',
          'In 1988 Barnsley showed in his book Fractals Everywhere that just four of these rules draw a fern, down to the smallest leaflet. This is the Barnsley fern, and it made the idea famous.',
        ],
        f: 'A(x, y) = (a·x + b·y + c,  d·x + e·y + f)',
      },
      {
        h: 'From fern to flame',
        p: [
          'Plain IFS rules only use straight-line maps, so their fractals look crisp and geometric. In 1992 the programmer Scott Draves added a bend: after the straight-line step, each rule passes the point through a non-linear function called a variation, such as sine, sphere, swirl, spiral or horseshoe.',
          'The variations curve the plane, and the result no longer looks like geometry. It looks like smoke, silk and fire, which is where the name comes from. Draves later used flames in Electric Sheep, a screensaver started in 1999 that shares flames between thousands of computers.',
        ],
        f: 'F(x) = Σ wⱼ·Vⱼ(A·x)',
        piece: 'dim',
        caption: 'Smoke: a few rules with threefold symmetry, about 10 million points.',
      },
      {
        h: 'Brightness on a log scale',
        p: [
          'A flame is a histogram: the program counts how many times the point lands on each pixel. Some pixels are hit millions of times and others only a few, so a straight count would show a bright blob and nothing else.',
          'Flames use the logarithm of the count instead. That compresses the range, so the dense core still glows while the faintest wisps stay visible. It is the same trick the eye uses to see both a bright window and a dark room.',
        ],
        f: 'L = log(1 + n) / log(1 + nₘₐₓ)',
      },
      {
        h: 'Colour from history',
        p: [
          'Each rule carries its own colour value. Every time the point jumps, its colour moves halfway towards the colour of the rule it just used. A pixel\'s colour is then the average of the colours of all the points that landed on it.',
          'So the colour records where the point has been, not just where it is. Regions built mostly by one rule take its colour, and regions where several rules meet blend them.',
        ],
        piece: 'perje',
        caption: 'Feathers: colour follows which rules each point came through.',
      },
      {
        h: 'Symmetry',
        p: [
          'Add one more rule that simply rotates the point by a fixed angle, and the whole flame gains rotational symmetry. With a rotation of a fifth of a turn, every feature repeats five times around the centre, like the petals of a flower.',
        ],
        piece: 'ruza',
        caption: 'Rose: fivefold symmetry around a warm core.',
      },
      {
        h: 'How our flame posters are made',
        p: [
          'For each piece the program chooses two to four rules, each with its own straight-line map and one or two variations from a set of twelve, and sometimes a rotational symmetry. It tests many candidate sets of rules and keeps one whose flame fills the page well, neither collapsed to a dot nor scattered into dust.',
          'It then runs the chaos game for about ten million points, builds the log-density image and maps the colour history to the palette. The rules are fixed by the piece\'s number, so the same piece always comes out the same.',
        ],
      },
    ],
    faq: [
      { q: 'What is a fractal flame?', a: 'A fractal flame is an image made by the chaos game with non-linear rules: a point jumps millions of times between a few functions picked at random, and the picture shows how often it lands on each pixel, on a log scale, coloured by the rules it passed through.' },
      { q: 'Who invented fractal flames?', a: 'Scott Draves devised the fractal flame algorithm in 1992, building on iterated function systems (John Hutchinson, 1981) and the chaos game popularised by Michael Barnsley.' },
      { q: 'What is the difference between a fractal flame and an IFS fractal?', a: 'A classic IFS fractal like the Barnsley fern uses only straight-line maps and draws points as on or off. A flame adds non-linear variations, log-density brightness and colour from the rules, which gives its soft, smoky look.' },
      { q: 'Are fractal flames really fractals?', a: 'Yes. Each is the attractor of an iterated function system: the shape that the rules map back onto itself, with detail repeating at smaller and smaller scales.' },
    ],
  },
  {
    slug: 'hopf-fibration-explained',
    series: 'hopf',
    title: 'The Hopf Fibration Explained: Linked Circles from the Fourth Dimension',
    desc: 'The Hopf fibration explained in plain English: the 3-sphere, linked circles, nested tori and stereographic projection, with the maths behind our 4D geometry posters.',
    h1: 'The Hopf fibration explained',
    kicker: 'Guide // 4D geometry',
    lead: 'The Hopf fibration fills a four-dimensional sphere entirely with circles, every one of them linked with every other like the links of a chain. Here is what that means, and how it is brought down into our three dimensions to be drawn.',
    updated: '2026-11-02',
    sections: [
      {
        h: 'A sphere in four dimensions',
        p: [
          'An ordinary circle is all the points at distance 1 from a centre in the flat plane. An ordinary sphere is the same idea in three dimensions. The three-sphere, written S³, is the same idea once more, in four dimensions: all the points (x, y, z, w) with x² + y² + z² + w² = 1.',
          'We can\'t see four dimensions directly, but we can compute in them. A handy way is to pair the four coordinates into two complex numbers, z₁ = x + iy and z₂ = z + iw, so a point of S³ is a pair with |z₁|² + |z₂|² = 1.',
        ],
        f: '|z₁|² + |z₂|² = 1',
      },
      {
        h: 'Hopf\'s map',
        p: [
          'In 1931 the mathematician Heinz Hopf found a map that sends every point of S³ to a point on an ordinary sphere S². Many points of S³ land on the same spot of S², and they always form a circle. So S³ is filled completely with circles, one circle for every point of the ordinary sphere, and no two circles share a point.',
          'A space filled with circles in this tidy way is called a fibration, and each circle is a fibre. Written as symbols, the circle S¹ sits inside the three-sphere S³, which lies over the sphere S².',
        ],
        f: 'S¹ → S³ → S²\n(z₁, z₂) ↦ (2z₁z̄₂,  |z₁|² − |z₂|²)',
      },
      {
        h: 'Every circle linked with every other',
        p: [
          'The surprising part: any two of these circles are linked. They never touch, yet you couldn\'t pull them apart without cutting one, just like two links of a chain. Hopf proved that this linking can\'t be undone by any smooth deformation, which made the fibration a landmark of topology.',
          'Take all the points on one circle of latitude of the ordinary sphere. Their fibres sweep out a torus, a doughnut shape, wound with circles that twist around it. Different latitudes give nested tori, one inside the next.',
        ],
        piece: 'snop',
        caption: 'Fibration: nested tori, each wound with linked circles.',
      },
      {
        h: 'Down into our space',
        p: [
          'To draw S³ we use stereographic projection, the same trick that maps the globe onto flat paper. Pick one point of S³ as the pole, then send every other point along a straight line from the pole into ordinary three-dimensional space.',
          'This projection keeps circles as circles. The only exception is the fibre through the pole itself, which becomes a straight line running off to infinity. Every other fibre becomes an ordinary round circle, still linked with all the rest.',
        ],
        f: 'p ↦ (x, y, z) / (1 − w)',
      },
      {
        h: 'Where it turns up in physics',
        p: [
          'The Hopf fibration appears well beyond pure geometry. The state of a qubit, the basic unit of quantum information, is a point of S³ up to a phase, and the Bloch sphere that physicists draw is exactly the S² at the bottom of the Hopf map. It also shows up in the mathematics of the magnetic monopole and of spinning rigid bodies.',
          'The films Dimensions by Jos Leys, Étienne Ghys and Aurélien Alvarez brought pictures of it to a wide audience.',
        ],
      },
      {
        h: 'How our Hopf posters are made',
        p: [
          'For each piece the program picks between 100 and 320 points on the ordinary sphere, either along several circles of latitude, which gives nested tori, or along a spiral from pole to pole, which gives a vortex. For every point it computes the matching circle in S³ at 260 points around it.',
          'Each circle is projected stereographically, turned to the chosen viewing angle and drawn as a fine line of light, brighter towards the front. Nothing is approximated by hand: every ring on the poster is one exact fibre of the Hopf map.',
        ],
        piece: 'vrtlog',
        caption: 'Vortex: fibres over a spiral on the sphere.',
      },
    ],
    faq: [
      { q: 'What is the Hopf fibration in simple terms?', a: 'It is a way of filling the four-dimensional sphere S³ completely with circles, one for each point of an ordinary sphere, so that every pair of circles is linked like two links of a chain.' },
      { q: 'Why are the circles linked?', a: 'Because of how the Hopf map twists S³ around the sphere below it. Hopf proved in 1931 that the linking is a topological fact: no smooth deformation of the map can undo it.' },
      { q: 'How can you draw something from four dimensions?', a: 'With stereographic projection, which maps the four-dimensional sphere into ordinary 3D space and keeps circles as circles. The 3D picture is then viewed from an angle, like any object.' },
      { q: 'What are the tori in Hopf fibration pictures?', a: 'The circles that lie over one circle of latitude on the ordinary sphere sweep out a torus. Several latitudes give nested tori, each wound with linked circles.' },
    ],
  },
];

export const guideFor = (series: string) => GUIDES.find((g) => g.series === series);
