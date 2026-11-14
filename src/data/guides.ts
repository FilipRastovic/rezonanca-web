// Guide pages (/guide/<slug>/): plain-English maths behind a series, for people searching the topic.
// Each section can show one of our posters (`piece` = product key) and an equation (`f`).
// Numbers quoted from our pieces come from src/data/math/<key>.json.
export interface GuideSection { h: string; p: string[]; f?: string; piece?: string; caption?: string }
export interface Guide {
  slug: string; series: string; title: string; desc: string; h1: string; kicker: string; lead: string;
  updated: string; sections: GuideSection[]; faq: { q: string; a: string }[];
  // Gift-style guides: a hand-picked shop grid instead of one series (series is then '').
  shop?: string[];
  // Other series this guide explains (their collection and product pages link to it too).
  also?: string[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'what-is-a-strange-attractor',
    series: 'attractor',
    title: 'What Is a Strange Attractor? Lorenz and Chaos',
    desc: 'A strange attractor is the shape chaos settles into. A plain-English guide to the Lorenz, Thomas and Clifford attractors, with their equations.',
    h1: 'What is a strange attractor?',
    kicker: 'Guide // Chaos theory',
    lead: 'A strange attractor is the shape a chaotic system settles into. The motion never repeats and can\'t be predicted for long, yet it always stays on the same delicate shape. Here is what that means, with the equations behind our posters.',
    updated: '2026-11-13',
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
    title: 'Mandelbrot Set Explained: z = z² + c in Plain English',
    desc: 'The Mandelbrot set explained in plain English: one equation, z² + c, the escape radius, seahorse valley, minibrots and how a deep zoom is computed and coloured.',
    h1: 'The Mandelbrot set explained: z = z² + c',
    kicker: 'Guide // Fractals',
    lead: 'The Mandelbrot set is the set of complex numbers c for which z = z² + c, started at z = 0 and repeated forever, never runs off to infinity. It is the most famous fractal, and that one line is its whole definition. Here is how that one line produces an endless coastline of spirals, seahorses and tiny copies of itself, and how our posters are computed from it.',
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
    title: 'What Is a Fractal Flame? The Chaos Game Explained',
    desc: 'How fractal flames are made: the chaos game, iterated function systems, non-linear variations and log-density colour, in plain English.',
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
    title: 'The Hopf Fibration Explained: Circles from 4D',
    desc: 'The Hopf fibration in plain English: the 3-sphere, linked circles, nested tori and stereographic projection, with the maths behind our 4D posters.',
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
  {
    slug: 'math-gifts',
    series: '',
    shop: ['lorenc', 'mandelbrotov-skup', 'snop', 'klifordov-veo', 'tomas', 'dolina-morskih-konjica', 'metropola', 'dim'],
    title: 'Math Gifts for Mathematicians, Physicists and Coders',
    desc: 'Math gift ideas that look good on a wall: Lorenz, Mandelbrot and Hopf posters drawn from real equations, for mathematicians, physicists and programmers.',
    h1: 'Math gifts for people who love equations',
    kicker: 'Guide // Gifts',
    lead: 'A good math gift is one the person actually puts on the wall. These posters are drawn from real equations, so they read as art to everyone and as maths to the one who knows. Here is which piece suits whom.',
    updated: '2026-11-02',
    sections: [
      {
        h: 'For the physicist: the Lorenz attractor',
        p: [
          'The Lorenz attractor is where chaos theory began: three equations from a 1963 weather model, and the first picture of the butterfly effect. Anyone who has studied physics, meteorology or differential equations will recognise the two wings at once.',
          'The poster is the real solution of the equations, 260,000 steps long, with σ = 10, ρ = 28 and β = 8/3 printed in the corner.',
        ],
        piece: 'lorenc',
        caption: 'Lorenz: the classic chaos theory gift.',
      },
      {
        h: 'For the mathematician: the Mandelbrot set',
        p: [
          'The most famous fractal, defined by one line, z² + c. The full set is the safe choice; a deep zoom such as Seahorse Valley is the one that starts conversations, because only someone who knows the set will recognise where it comes from.',
        ],
        piece: 'mandelbrotov-skup',
        caption: 'The Mandelbrot set: one equation, an infinite coastline.',
      },
      {
        h: 'For the topologist: the Hopf fibration',
        p: [
          'Circles from the fourth dimension, every one linked with every other. The Hopf fibration is a favourite of geometers and topologists, and of physicists too, since it is the shape behind the Bloch sphere of a qubit. It rarely appears on posters, which makes it a gift they won\'t already own.',
        ],
        piece: 'snop',
        caption: 'Fibration: nested tori of linked circles.',
      },
      {
        h: 'For the programmer: the Clifford attractor',
        p: [
          'Two lines of code with four sines and cosines, iterated millions of times. Programmers like the Clifford attractor because they can write it in a minute and still be surprised by what it draws. Every one of our posters is computed this way, by a program written line by line.',
        ],
        piece: 'klifordov-veo',
        caption: 'Clifford\'s Veil: four constants, one silk-like veil.',
      },
      {
        h: 'For the music lover: sound waves',
        p: [
          'Not every math gift has to look like maths. The sound wave series turns signals into landscapes and cities, built from sine waves, envelopes and Perlin noise. It suits engineers, musicians and anyone who works with audio.',
        ],
        piece: 'metropola',
        caption: 'Metropolis: a spectrogram turned into a city.',
      },
      {
        h: 'Choosing a size and frame',
        p: [
          'Every poster comes in 30 × 40 cm (12 × 16 in) or 45 × 60 cm (18 × 24 in). The smaller size suits a desk, an office or a gift you aren\'t sure where they will hang. The larger one works above a sofa or a bed.',
          'Framed prints arrive in a black or natural wood frame with plexiglass, ready to hang, which makes them the easiest gift: no trip to a framer. Black suits the darker pieces; natural wood softens them for a warmer room.',
        ],
      },
      {
        h: 'Ordering a gift',
        p: [
          'Each poster is printed to order on fine art matte paper and shipped worldwide with free shipping. Because every print is made when you order, order a little earlier before holidays. You can send it straight to the person\'s address.',
          'Every product page explains the maths behind that exact piece: its equations, parameters and measurements. That makes a good message to go with the gift.',
        ],
      },
    ],
    faq: [
      { q: 'What is a good gift for a mathematician?', a: 'Something that shows real maths rather than a joke about it. A poster of the Mandelbrot set, a strange attractor or the Hopf fibration, drawn from the actual equations, works on any wall and still means something to a mathematician.' },
      { q: 'What is a good gift for a physicist?', a: 'The Lorenz attractor, the original picture of chaos and the butterfly effect, or the Hopf fibration, which appears in quantum mechanics as the geometry of a qubit.' },
      { q: 'Can I ship a poster directly to someone else?', a: 'Yes. Enter their address at checkout. Shipping is free worldwide.' },
      { q: 'Which size should I choose for a gift?', a: '30 × 40 cm is the safe choice when you don\'t know the wall. Choose 45 × 60 cm for a statement piece above a sofa or bed.' },
    ],
  },
  {
    slug: 'perlin-noise-explained',
    series: 'ridges',
    also: ['flux', 'structure'],
    title: 'Perlin Noise Explained: Octaves and Gradients',
    desc: 'Perlin noise explained in plain English: what it is, how gradients and octaves work, and how it turns sound waves into the landscapes on our posters.',
    h1: 'Perlin noise explained',
    kicker: 'Guide // Code',
    lead: 'Perlin noise is the most famous trick in computer graphics: a way to make randomness look natural. Clouds in films, mountains in games and the lines on our sound wave posters all use it. Here is how it works.',
    updated: '2026-11-03',
    sections: [
      {
        h: 'Why plain randomness looks wrong',
        p: [
          'Ask a computer for random numbers and draw them as a line, and you get static: every value jumps with no relation to the one before. Nature doesn\'t look like that. A coastline, a cloud or a mountain ridge changes gradually, with large shapes and small details at the same time.',
          'What we want is randomness that is smooth: nearby points get similar values, distant points get unrelated ones. That is exactly what Perlin noise gives.',
        ],
      },
      {
        h: 'Ken Perlin and Tron',
        p: [
          'Ken Perlin worked on the computer graphics of the film Tron (1982) and was frustrated by how machine-like computer images looked. In 1983 he developed a noise function to give surfaces a natural texture, and published it in 1985. In 1997 he received an Academy Award for Technical Achievement for it.',
          'Since then it has been used for clouds, fire, marble, terrain and water in countless films and games, and it is built into creative coding tools such as Processing and p5.js.',
        ],
      },
      {
        h: 'How it works: gradients on a grid',
        p: [
          'Imagine a grid laid over space. At every grid point the function picks a random direction, a gradient. To get the value at any point in between, it looks at the nearby grid points, measures how far the point lies along each of their directions, and blends those numbers with a smooth curve.',
          'Because the blending is smooth, the result has no jumps. Because the directions are random, it has no visible pattern. And because the same coordinates always give the same value, the noise can be computed again at any time, identically.',
        ],
        f: 'fade(t) = 6t⁵ − 15t⁴ + 10t³',
      },
      {
        h: 'Octaves: large shapes and fine detail',
        p: [
          'One layer of Perlin noise gives gentle hills. Real landscapes have hills, rocks and pebbles at once. So the noise is added up in layers called octaves: each layer twice as fine as the last and, typically, half as strong.',
          'Our program uses four octaves with a falloff of 0.5, so the first layer sets the broad swell of a line and the last adds the slight roughness that makes it look drawn rather than ruled.',
        ],
        f: 'noise(x) = Σₖ 0.5ᵏ · perlin(2ᵏ·x),   k = 0…3',
      },
      {
        h: 'From noise to sound waves',
        p: [
          'On First Signal, from the Ridges series, each of the 56 lines is one waveform. A Gaussian envelope decides where the signal is loud, a carrier wave makes it oscillate, and two noise layers shape it: one for the slow swell, one for the fine texture. Every line samples the noise at a slightly different row, so neighbouring lines look related but never identical.',
          'Stacked one behind another, with each line hiding the ones behind it, the waveforms read as a mountain range at night.',
        ],
        f: 'yᵢ(t) = bᵢ − A·env(t)·(n₁(t)² + |sin(2π·f·t + φᵢ)|³·n₂(t))',
        piece: 'prvi-signal',
        caption: 'First Signal: 56 waveforms shaped by two layers of noise.',
      },
      {
        h: 'Noise around a circle',
        p: [
          'On the Orbit posters the same signal is wound into rings. There is a catch: if you sample noise along a straight line and bend it into a circle, the end won\'t meet the start and the ring breaks. The fix is to sample the noise along a circle in noise space itself, at (cos θ, sin θ), so the values return exactly to where they began.',
        ],
        f: 'rᵢ(θ) = Rᵢ + A·env(θ)·noise(cos θ, sin θ, i)',
        piece: 'nulta-orbita',
        caption: 'Orbit Zero: 40 rings, each a seamless loop of noise.',
      },
      {
        h: 'The same seed, the same picture',
        p: [
          'Perlin noise looks random but is fully determined by its seed. Our programs fix the seed for each piece, so the same equations and the same seed always draw the same lines. That is why every print of a piece is identical to the image you see on its page.',
        ],
      },
    ],
    faq: [
      { q: 'What is Perlin noise in simple terms?', a: 'A function that returns smooth random values: nearby inputs give similar outputs, so it looks like natural variation rather than static. It is used for clouds, terrain, textures and organic lines.' },
      { q: 'What are octaves in Perlin noise?', a: 'Layers of noise added together, each one finer and weaker than the last. A few octaves give both large shapes and small detail, like hills with rocks on them.' },
      { q: 'Who invented Perlin noise?', a: 'Ken Perlin, in 1983, after working on the film Tron. He published it in 1985 and received an Academy Award for Technical Achievement in 1997.' },
      { q: 'What is the difference between Perlin noise and random noise?', a: 'Random noise has no relation between neighbouring values, so it looks like static. Perlin noise changes smoothly, so it looks like something from nature.' },
    ],
  },
  {
    slug: 'fractal-art',
    series: '',
    shop: ['mandelbrotov-skup', 'dolina-morskih-konjica', 'dim', 'perje', 'lorenc', 'klifordov-veo', 'drvo-signala', 'snop'],
    title: 'Fractal Art: Meaning, Types and Examples',
    desc: 'What fractal art is, where it came from and how it is made: the Mandelbrot set, fractal flames, strange attractors and recursive rules, with real examples.',
    h1: 'Fractal art: meaning, types and examples',
    kicker: 'Guide // Fractals',
    lead: 'Fractal art is art made from shapes that repeat at every scale, computed rather than drawn by hand. Here is what makes a shape a fractal, where the art form came from, and the main kinds of fractal art you will see on our walls and elsewhere.',
    updated: '2026-11-13',
    sections: [
      {
        h: 'What a fractal is',
        p: [
          'A fractal is a shape whose parts look like the whole. Zoom into a fern leaf and each leaflet is a small fern; zoom into a coastline and the bays have bays. Mathematically, a fractal has detail at every scale and a dimension that isn\'t a whole number.',
          'The Koch snowflake is the classic example: replace the middle third of every edge with a small triangle, forever. The outline becomes infinitely long while enclosing a finite area, and its dimension is about 1.26, more than a line and less than a surface.',
        ],
        f: 'D = log 4 / log 3 ≈ 1.262',
      },
      {
        h: 'Where fractal art came from',
        p: [
          'Mathematicians found fractal shapes long before anyone could see them properly: Georg Cantor\'s set in 1883, Helge von Koch\'s snowflake in 1904, Wacław Sierpiński\'s triangle in 1915. Without computers, they were mostly seen as curiosities.',
          'In 1975 Benoit Mandelbrot coined the word "fractal", and his 1982 book The Fractal Geometry of Nature showed that clouds, mountains and coastlines follow the same rules. Computer images of the Mandelbrot set spread through magazines in the 1980s, and fractal art became one of the first art forms made entirely with code.',
        ],
      },
      {
        h: 'Escape-time fractals: the Mandelbrot set',
        p: [
          'The best-known kind of fractal art comes from repeating one equation for every point of the plane and colouring each point by how quickly the numbers escape to infinity. The Mandelbrot set, z² + c, is the classic. Its edge holds endless spirals, and deep zooms show places no one has seen before.',
        ],
        piece: 'dolina-morskih-konjica',
        caption: 'Seahorse Valley: a deep zoom into the Mandelbrot set.',
      },
      {
        h: 'Fractal flames',
        p: [
          'A fractal flame is drawn by a single point jumping millions of times between a few random rules. Where it lands most often, the image glows. Invented by Scott Draves in 1992, flames have a soft, smoky look quite unlike the hard edges of the Mandelbrot set.',
        ],
        piece: 'dim',
        caption: 'Smoke: a fractal flame with threefold symmetry.',
      },
      {
        h: 'Strange attractors',
        p: [
          'Strange attractors come from chaos theory: the path of a point moving by a set of equations, like the Lorenz system. The path never repeats and folds into layers within layers, which gives the shape a fractal dimension. The Lorenz attractor\'s is about 2.06.',
        ],
        piece: 'lorenc',
        caption: 'Lorenz: the original strange attractor.',
      },
      {
        h: 'Recursive rules',
        p: [
          'Another family grows from rules that call themselves: "a branch is a line, then two smaller branches". The biologist Aristid Lindenmayer wrote such rules for plant growth in 1968, and artists later turned them into drawing programs. Each rule is simple; applied thousands of times, it builds trees, coral and architecture.',
        ],
        piece: 'drvo-signala',
        caption: 'Signal: blocks of light grown by recursive rules.',
      },
      {
        h: 'Is fractal art real art?',
        p: [
          'The equations are discovered, not invented, but the picture is chosen. Someone decides where to look in the Mandelbrot set, which rules to combine in a flame, which angle to view an attractor from, which colours to use and when a piece is finished. Like photography, the medium does much of the work, and the eye does the rest.',
        ],
      },
      {
        h: 'Fractal art on a wall',
        p: [
          'Fractals suit large prints because they reward a closer look: the detail keeps going. Our posters are printed on fine art matte paper at 300 DPI, so the fine filaments stay sharp up close. Every product page lists the exact equations and parameters behind its piece.',
        ],
      },
    ],
    faq: [
      { q: 'What is fractal art?', a: 'Art made from fractals, shapes with detail that repeats at every scale, computed from mathematical rules rather than drawn by hand. The main kinds are escape-time fractals like the Mandelbrot set, fractal flames, strange attractors and recursive rule systems.' },
      { q: 'How is fractal art made?', a: 'With a program that applies a mathematical rule many times, from thousands to millions of iterations, and turns the results into colour and brightness. The artist chooses the rule, the view, the colours and the final composition.' },
      { q: 'Who invented fractal art?', a: 'No single person. Benoit Mandelbrot coined the word "fractal" in 1975 and made the first detailed images of the Mandelbrot set around 1980; fractal art grew from the computer images that followed in the 1980s.' },
      { q: 'What is the most famous fractal?', a: 'The Mandelbrot set, defined by repeating z² + c. Its boundary is infinitely detailed and full of spirals and small copies of the whole set.' },
    ],
  },
  {
    slug: 'sound-wave-art',
    series: 'ridges',
    also: ['city', 'orbit'],
    title: 'Sound Wave Art: Waveforms, Spectrograms and Prints',
    desc: 'Sound wave art explained: how a waveform and a spectrogram turn sound into a picture, from frequency and harmonics to envelopes, with real wall art examples.',
    h1: 'Sound wave art: waveforms, spectrograms and prints',
    kicker: 'Guide // Sound',
    lead: 'Sound wave art turns something you hear into something you can see. A sound is a pressure wave, and there are two classic ways to draw it: as a waveform, which shows loudness over time, and as a spectrogram, which shows which frequencies are playing at each moment. Here is how both work, and how our sound wave posters are made with code.',
    updated: '2026-11-14',
    sections: [
      {
        h: 'What a sound wave is',
        p: [
          'Sound is air being pushed and pulled. A speaker cone or a guitar string moves back and forth, the air next to it is squeezed and stretched, and that pattern of pressure travels outward at about 343 metres per second.',
          'A microphone turns the pressure at one point into a number that changes over time. Plot that number and you have a waveform. Its height is the amplitude, which we hear as loudness, and how many times it repeats per second is the frequency, measured in hertz, which we hear as pitch. People hear roughly from 20 Hz to 20,000 Hz; the A above middle C is 440 Hz.',
        ],
        f: 'y(t) = A·sin(2π·f·t + φ)',
      },
      {
        h: 'Harmonics: why a violin and a flute sound different',
        p: [
          'A pure sine wave sounds thin, like a tuning fork. Real instruments play many sine waves at once: a fundamental frequency plus partials above it. On a string or a voice the partials sit near whole multiples of the fundamental and are called harmonics.',
          'How strong each partial is gives a sound its colour, or timbre. A violin and a flute playing the same 440 Hz note share the fundamental but mix their partials differently, so their waveforms have different shapes even though the pitch is the same.',
        ],
        f: 'y(t) = Σₖ aₖ·sin(2π·k·f·t + φₖ)',
      },
      {
        h: 'The envelope: how a sound starts and fades',
        p: [
          'A sound also changes over time. A piano note hits hard and fades; a bowed cello note swells and holds. The curve that shapes the loudness over time is the envelope. In a waveform plot it is the outline you see around the fast wiggles inside.',
          'Musicians and synthesiser makers describe it in four parts: attack, decay, sustain and release. A drum is almost all attack; a pad sound is almost all sustain. The envelope is often what makes a waveform picture recognisable at a glance.',
        ],
      },
      {
        h: 'Waveform art: loudness over time',
        p: [
          'The simplest sound wave art is a waveform drawn large: time runs left to right, amplitude goes up and down. A spoken phrase or a few seconds of a song becomes a row of peaks and valleys, loud passages tall and quiet ones flat.',
          'Stack many waveforms and the picture becomes a landscape. Our Silent Storm poster stacks 62 lines. Each one carries a fast carrier wave of 47.6 cycles shaped by smooth envelopes and a little noise, and the lines in front hide the ones behind, so the sound reads as a mountain range.',
        ],
        f: 'yᵢ(t) = bᵢ − A·env(t)·eᵢ·(1.56·n₁(t)² + 0.45·|sin(2π·f·t + φᵢ)|³·n₂(t))',
        piece: 'tiha-oluja',
        caption: 'Silent Storm: 62 stacked waveforms, carrier 47.6, 37,262 samples.',
      },
      {
        h: 'Circular waveforms',
        p: [
          'Wrap the time axis around a circle and a waveform becomes a ring: the angle is time and the radius moves in and out with the amplitude. A loop of sound closes back on itself, which suits a sound that repeats.',
          'Our circular waveform posters nest dozens of these rings. Orbit Zero has 40 rings, 36,000 samples in all, with each ring pushed outward where its envelope is loud.',
        ],
        f: 'rᵢ(θ) = Rᵢ + A·env(θ)·eᵢ·(1.56·n₁(θ)² + 0.45·|sin(f·θ + φᵢ)|³·n₂(θ))',
        piece: 'nulta-orbita',
        caption: 'Orbit Zero: 40 rings, carrier 41, 36,000 samples.',
      },
      {
        h: 'Spectrograms: which frequencies, when',
        p: [
          'A waveform shows how loud a sound is, but not which notes are in it. For that you split the sound into its frequencies. In 1822 Joseph Fourier showed that any repeating signal can be written as a sum of sine waves, and the Fourier transform finds how much of each frequency a signal contains.',
          'A spectrogram applies the transform to one short slice of sound after another and lays the results side by side: time along one axis, frequency along the other, strength as brightness or height. Bell Labs built the first sound spectrograph in the 1940s, and the fast Fourier transform of Cooley and Tukey, published in 1965, made spectrograms quick enough for any computer.',
        ],
        f: 'X(f) = ∫ x(t)·e^(−2πi·f·t) dt',
      },
      {
        h: 'Spectrogram cities',
        p: [
          'Draw a spectrogram in 3D, with strength as height, and every cell of the grid becomes a tower. Low and high frequencies form the streets; loud moments rise into skyscrapers. That is the idea behind our Spectrogram City series.',
          'Metropolis is a 26 × 26 grid, 676 towers. The height of each tower comes from a signal built from four partials and three swells, multiplied across frequency band and time slice, with a little noise so no two neighbouring towers are quite the same height.',
        ],
        f: 'H(i, j) = (0.75·s(i/G)·s(j/G) + 0.25·n(i, j))^2.1 · c(i, j)',
        piece: 'metropola',
        caption: 'Metropolis: 26 × 26 grid, 676 towers.',
      },
      {
        h: 'Recorded sound or written sound?',
        p: [
          'Some sound wave art starts from a recording: a voice message, a first dance song, a heartbeat. The shape is then fixed by the audio. Our posters work the other way round. The sound is written as equations, a sum of partials shaped by envelopes, and the program draws it directly, so every line can be tuned for the picture.',
          'Each product page lists the exact equations, parameters and measurements behind that piece. What you see on the page is exactly the print you get, on fine art matte paper at 300 DPI, framed or unframed.',
        ],
      },
    ],
    faq: [
      { q: 'What is sound wave art?', a: 'Art that turns sound into a picture, usually as a waveform (loudness over time) or a spectrogram (which frequencies play at each moment). It can start from a recording or from a sound written as equations.' },
      { q: 'What is the difference between a waveform and a spectrogram?', a: 'A waveform shows the amplitude of a sound over time, so you see how loud it is. A spectrogram shows the strength of each frequency over time, so you see which notes and tones are in it.' },
      { q: 'How is a spectrogram made?', a: 'The sound is cut into short slices, each slice is split into its frequencies with a Fourier transform, and the results are placed side by side, with strength shown as brightness or height.' },
      { q: 'Is sound wave art a good gift for a musician?', a: 'It suits musicians, sound engineers and anyone who works with audio, because the picture uses the same waveforms and spectrograms they see in their software every day.' },
    ],
  },
  {
    slug: 'clifford-attractor',
    series: '',
    shop: ['klifordov-veo', 'de-zong', 'tomas', 'halvorsen', 'lorenc', 'aizava'],
    title: 'Clifford Attractor: Equation and Parameters',
    desc: 'The Clifford attractor is a two-line map of sines and cosines. See the equation, what a, b, c and d change, how it is plotted, and try it live.',
    h1: 'Clifford attractor: equation and parameters',
    kicker: 'Guide // Strange attractors',
    lead: 'The Clifford attractor is a strange attractor defined by two lines: each new point (x, y) is computed from the previous one with sines and cosines and four constants, a, b, c and d. Here is the equation, what each constant does, how millions of points become a picture, and how to try it yourself.',
    updated: '2026-11-14',
    sections: [
      {
        h: 'The equation',
        p: [
          'The Clifford attractor is a map, not a flow. There are no derivatives and no time steps to integrate. You take a point, apply the rule once to get the next point, and repeat. Every point depends only on the one before it.',
          'The rule uses the point\'s two coordinates crosswise: the new x is built from the old y, and the new y from the old x. The constants a and b set how fast the sine and cosine waves oscillate, and c and d set how strongly the cosine terms push the point.',
        ],
        f: 'xₙ₊₁ = sin(a·yₙ) + c·cos(a·xₙ)\nyₙ₊₁ = sin(b·xₙ) + d·cos(b·yₙ)',
      },
      {
        h: 'Why the points stay in a box',
        p: [
          'A sine and a cosine can never leave the range from −1 to 1. So the new x always lies between −1 − |c| and 1 + |c|, and the new y between −1 − |d| and 1 + |d|. However many steps you take, the point cannot escape this rectangle.',
          'That is why the map needs no scaling tricks: the picture always fits in a known frame. What happens inside the frame depends entirely on the four constants. For many choices the points settle onto a fixed point or a short cycle and the picture is dull. For others they never repeat, and that is the strange attractor.',
        ],
        f: '|xₙ| ≤ 1 + |c|,   |yₙ| ≤ 1 + |d|',
      },
      {
        h: 'What a, b, c and d do',
        p: [
          'There is no single dial for each visual effect, because the terms are tangled together. Still, some rules of thumb hold. Larger a and b make the sine and cosine waves faster, so the veil folds more times and looks finer and more crowded. Values near zero give a smooth, simple sweep.',
          'The constants c and d scale the cosine terms. When both are small the sine terms dominate and the picture is more symmetric. When they grow, the shape stretches and the frame gets wider. Moving any constant by a few hundredths can change the whole shape, which is the sign of a chaotic map. This is also why the same four numbers always reproduce the same picture, and why a slightly different set gives a different one.',
        ],
      },
      {
        h: 'From points to a picture',
        p: [
          'One orbit is a list of points. To see the attractor you iterate for millions of steps and count how many times the orbit lands in each pixel of a grid. Pixels that are visited often are bright, and pixels that are visited rarely are dim. The picture is a density map.',
          'A common practice is to skip the first few hundred points, so the orbit has time to reach the attractor before counting starts. After that, every point lands on or very near the attractor, and the veils appear as the counts build up. Nothing about the picture is random: the same constants and the same starting point always give the same image.',
        ],
        f: 'density(pixel) = number of orbit points inside the pixel',
      },
      {
        h: 'Is it chaotic? The Lyapunov exponent',
        p: [
          'To test whether a choice of constants is chaotic, follow two orbits that start almost together and measure how fast they separate. The average rate of separation is the Lyapunov exponent λ. If λ is positive, nearby orbits drift apart exponentially, and the motion is chaotic. If it is zero or negative, the orbit settles into a cycle.',
          'Our program measures this while it draws. For the Clifford piece Cup, with a = 1.7, b = 1.7, c = 0.6 and d = 1.2, it found λ = 0.349 over 3,372,754 iterations, which is positive. The guide to strange attractors explains why a positive exponent makes long-range prediction impossible.',
        ],
        f: '|δₙ| ≈ |δ₀|·e^(λ·n),   λ > 0',
        piece: 'klifordov-veo',
        caption: 'Cup: Clifford map, a = 1.7, b = 1.7, c = 0.6, d = 1.2, 3,372,754 iterations, λ = 0.349.',
      },
      {
        h: 'The Peter de Jong attractor',
        p: [
          'A close relative is the Peter de Jong attractor. It uses the same ingredients, sines of one coordinate and cosines of the other, but with two sines and two cosines of different constants, and with the cosine terms subtracted and no scaling factors.',
          'Because all four constants sit inside the trigonometric functions, the frame is always the same size, from −2 to 2. Our piece Teardrop uses a = −2.2584, b = 0.4335, c = −0.6238 and d = −2.4105, with λ = 0.397.',
        ],
        f: 'xₙ₊₁ = sin(a·yₙ) − cos(b·xₙ)\nyₙ₊₁ = sin(c·xₙ) − cos(d·yₙ)',
        piece: 'de-zong',
        caption: 'Teardrop: Peter de Jong map, a = −2.2584, b = 0.4335, c = −0.6238, d = −2.4105, λ = 0.397.',
      },
      {
        h: 'Try it yourself',
        p: [
          'The fastest way to understand the four constants is to move them. On the play page you can change a, b, c and d with sliders and watch the Clifford attractor redraw live in your browser, then save your version as a phone wallpaper.',
          'Small steps show the most. Try a = b first, since the two sine waves then run at the same speed, and compare it with a and b far apart. Change one constant by 0.05 and see which parts of the shape move and which stay. You will find regions where the picture changes smoothly, and sudden jumps where it becomes a different shape.',
        ],
      },
      {
        h: 'Our Clifford poster',
        p: [
          'Cup is the Clifford attractor drawn by a program written in JavaScript, with the constants and iteration count listed above. Nothing is painted by hand: the shape, the shading and the glow all come from the equation. The product page lists the exact equations, parameters and measurements.',
          'For attractors defined by differential equations instead of maps, see the Lorenz and Thomas pieces in the attractor series. What you see on the page is exactly the print you get, on fine art matte paper.',
        ],
      },
    ],
    faq: [
      { q: 'What is the Clifford attractor?', a: 'It is a strange attractor defined by a two-line map. Each new point is computed from the previous one using sines and cosines and four constants a, b, c and d, and millions of iterations draw a veil-like shape.' },
      { q: 'What is the Clifford attractor equation?', a: 'xₙ₊₁ = sin(a·yₙ) + c·cos(a·xₙ) and yₙ₊₁ = sin(b·xₙ) + d·cos(b·yₙ). Starting from any point, you apply both lines again and again and plot every point.' },
      { q: 'What is the difference between the Clifford and Peter de Jong attractors?', a: 'They are close relatives. Clifford uses scaling factors c and d on the cosine terms, while Peter de Jong puts all four constants inside the sines and cosines and subtracts the cosines.' },
      { q: 'Why does the Clifford attractor look different for different parameters?', a: 'The map is chaotic, so small changes to a, b, c or d change how the orbit folds and stretches. Some choices give a cycle, and others give a detailed attractor.' },
    ],
  },
];

export const guideFor = (series: string) => GUIDES.find((g) => (g.series && g.series === series) || g.also?.includes(series));
