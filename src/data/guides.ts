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
  {
    slug: 'double-pendulum',
    series: 'chaos',
    title: 'Double Pendulum Chaos: Equations and Sensitivity',
    desc: 'Two pendulums joined end to end move chaotically. See the equations, why tiny differences grow, and how we draw 12 million pendulums as pictures.',
    h1: 'Double pendulum chaos: equations and sensitivity',
    kicker: 'Guide // Chaos',
    lead: 'A double pendulum is a pendulum hanging from the end of another pendulum, and its motion is chaotic: two starts that differ by a hair end up in completely different places. Here are the equations, the reason small differences grow, and how we turn millions of pendulums into pictures.',
    updated: '2026-11-15',
    sections: [
      {
        h: 'Two arms, two angles',
        p: [
          'Take a rod that swings from a fixed pivot. At its lower end, attach a second rod that swings freely. That is the whole machine. A single pendulum is regular: it swings back and forth with a steady rhythm. Adding the second arm changes everything.',
          'Two numbers describe the position at any moment: the angle θ₁ of the upper arm and the angle θ₂ of the lower arm, both measured from straight down. Add the two angular speeds and you have four numbers that fully describe the state. Given those four numbers, the future is fixed by the laws of motion. Nothing is random.',
        ],
      },
      {
        h: 'The equations',
        p: [
          'The motion follows from the Lagrangian L, the kinetic energy T minus the potential energy V. The Euler-Lagrange equation gives one equation for each angle. For two arms of equal length l and equal mass, the energy terms have a compact form, where g is the acceleration of gravity.',
          'The resulting equation for the upper arm is below. The lower arm has a similar one. Each angular acceleration depends on both angles and both speeds, with sines, cosines and squared speeds. The two arms push on each other, and that coupling is where the trouble starts.',
        ],
        f: 'L = T − V = ml²(θ̇₁² + ½θ̇₂² + θ̇₁θ̇₂·cos(θ₁ − θ₂)) + mgl(2cos θ₁ + cos θ₂)\nd/dt ∂L/∂θ̇ᵢ = ∂L/∂θᵢ,   i = 1, 2',
      },
      {
        h: 'Why it is chaotic',
        p: [
          'The equations are non-linear: the angles appear inside sines and cosines, and the speeds are squared. For small swings, sin θ is close to θ and the system behaves almost like two simple springs. For large swings that shortcut fails, and the arms can flip over the top.',
          'There is no friction in the ideal model, so the total energy never changes. The pendulum does not settle onto an attractor the way a damped system does. Instead it wanders through all the states its energy allows, and the path never repeats exactly. The guide to strange attractors covers the damped kind of chaos, where motion collapses onto a fractal shape.',
        ],
        f: 'E = T + V = constant',
      },
      {
        h: 'Sensitivity to the starting point',
        p: [
          'Start two pendulums with angles that differ by a millionth of a radian and watch them. At first they move together. Then the gap grows, and after enough time they swing in unrelated ways. The gap grows roughly exponentially, at a rate called the Lyapunov exponent λ. A positive λ is the mathematical sign of chaos.',
          'This has a practical meaning. To predict the pendulum for twice as long, you need the starting angles to far more digits, not merely twice as many. No measurement is exact, so long-range prediction fails, even though every step follows exact laws.',
        ],
        f: '|δ(t)| ≈ |δ₀|·e^(λ·t),   λ > 0',
      },
      {
        h: 'One pixel, one pendulum',
        p: [
          'To see chaos rather than describe it, we let a whole grid of pendulums go. Every pixel is its own pendulum. The horizontal position of the pixel sets the starting angle θ₁, the vertical position sets θ₂, and all pendulums are released from rest. After a fixed time, the colour of the pixel records what that pendulum did.',
          'In Flamingo, the colour shows the height h of the lower arm, with h = −(cos θ₁ + cos θ₂). The starting angles run from 0.2π to 0.9π for θ₁ and from 0.1π to π for θ₂, and every pendulum is followed for 6 seconds. That is 12,000,000 pendulums, one per pixel, with arms of equal length and mass.',
        ],
        f: 'h = −(cos θ₁ + cos θ₂)',
        piece: 'chaos-1',
        caption: 'Flamingo: 12,000,000 pendulums, θ₁ from 0.2π to 0.9π, θ₂ from 0.1π to π, T = 6 s, RK4.',
      },
      {
        h: 'Folds where neighbours part ways',
        p: [
          'In some regions of the picture, neighbouring pixels have almost the same colour. Those pendulums behave alike. In other regions the colour changes from pixel to pixel with no pattern, because tiny differences in the start have already grown into large differences in the outcome.',
          'Watercolor covers a wider range of starts, with θ₁ from 0 to π and θ₂ from 0 to 1.3π, again for 6 seconds. The folds you see are the places where pendulums that start a hair apart end up in completely different places.',
        ],
        piece: 'chaos-2',
        caption: 'Watercolor: 12,000,000 pendulums, θ₁ from 0 to π, θ₂ from 0 to 1.3π, T = 6 s, RK4.',
      },
      {
        h: 'The edge of chaos',
        p: [
          'If you start the pendulum with little energy, it swings calmly and regularly, and nearby starts stay nearby. With more energy, the arms can flip over and the motion turns chaotic. Between the two lies a boundary, and in the picture it appears as a sharp edge between smooth areas and noise.',
          'Brushstroke is drawn along that boundary. Its starting angles run from −π to 0.2π for θ₁ and from −π to 0.5π for θ₂, followed for 5.5 seconds. On one side of the stroke neighbouring pendulums agree, and on the other no two do.',
        ],
        piece: 'chaos-3',
        caption: 'Brushstroke: 12,000,000 pendulums, θ₁ from −π to 0.2π, θ₂ from −π to 0.5π, T = 5.5 s, RK4.',
      },
      {
        h: 'How we solve it: Runge-Kutta',
        p: [
          'There is no general formula that gives θ₁ and θ₂ for any time t. The equations must be solved step by step on a computer. We use the fourth-order Runge-Kutta method, written RK4. It samples the slope four times per step and blends them, which is far more accurate than simply following the slope once.',
          'Chaos makes accuracy matter. Any numerical error acts like a tiny change of the starting point, and chaos amplifies it. The small steps and the careful method keep the picture faithful to the equations.',
        ],
        f: 'yₙ₊₁ = yₙ + (h/6)·(k₁ + 2k₂ + 2k₃ + k₄)',
      },
      {
        h: 'Our pendulum posters',
        p: [
          'The chaos series is made with code: a program written in JavaScript follows each pendulum with RK4 and colours the pixel from the result. The product pages list the equations, the ranges of the starting angles and the number of pendulums for every piece.',
          'Nothing is painted by hand, and no photograph is involved. What you see is exactly the print you get, on fine art matte paper.',
        ],
      },
    ],
    faq: [
      { q: 'Why is a double pendulum chaotic?', a: 'Its equations are non-linear and the two arms push on each other, so tiny differences in the starting angles grow exponentially. After a short time two almost identical starts give completely different motion.' },
      { q: 'What are the equations of a double pendulum?', a: 'They come from the Lagrangian L = T − V with one Euler-Lagrange equation for each angle. The result is two coupled second-order equations for θ₁ and θ₂ with no general closed-form solution.' },
      { q: 'Can the motion of the pendulum be predicted?', a: 'Only for a short time. The laws are exact, but any error in the starting angles grows exponentially, so long-range prediction is impossible in practice.' },
      { q: 'What does a pendulum chaos picture show?', a: 'Each pixel is one pendulum with its own starting angles, coloured by what it did after a fixed time. Smooth areas mean neighbours agree, and noisy areas mean the motion is chaotic.' },
    ],
  },
  {
    slug: 'lorenz-attractor',
    series: '',
    shop: ['lorenc', 'halvorsen', 'aizava', 'tomas', 'klifordov-veo', 'de-zong'],
    title: 'Lorenz Attractor: Equations and Parameters',
    desc: 'The Lorenz attractor comes from three equations with parameters σ, ρ and β. See what each one does, where the two wings come from and how we plot it.',
    h1: 'Lorenz attractor: equations and parameters',
    kicker: 'Guide // Chaos theory',
    lead: 'The Lorenz attractor is the two-winged shape traced by the solution of three coupled equations with the parameters σ, ρ and β. This page goes through the equations line by line, shows what each parameter controls, and explains how we plot the curve as a poster.',
    updated: '2026-11-16',
    sections: [
      {
        h: 'Where the equations come from',
        p: [
          'In 1963 the meteorologist Edward Lorenz published a paper titled "Deterministic Nonperiodic Flow". He started from a model of a fluid layer heated from below and cooled from above, the setting known as Rayleigh-Benard convection, and cut it down to the smallest set of equations that still showed the effect he was after.',
          'What remained is three equations for three numbers that change with time t. The variable x measures how fast the fluid circulates, y measures the temperature difference between the rising and the falling fluid, and z measures how far the vertical temperature profile departs from a straight line.',
        ],
        f: 'dx/dt = σ(y − x)\ndy/dt = x(ρ − z) − y\ndz/dt = xy − βz',
      },
      {
        h: 'Reading the three lines',
        p: [
          'The first line pulls x toward y. If y is larger than x, the circulation speeds up, and the factor σ sets how quickly. The second line has the term x(ρ − z): the temperature difference y grows when the circulation x is strong and z is small, and the −y term damps it.',
          'The third line is where the non-linearity sits. The product xy feeds z, and −βz drains it. Products of two variables, such as x(ρ − z) and xy, are what make the system non-linear, and without them the solution would be simple. The general idea of a point moving under such a rule is covered in the guide to strange attractors.',
        ],
      },
      {
        h: 'What σ, ρ and β do',
        p: [
          'Each parameter has a physical meaning. σ is the Prandtl number, the ratio of how easily the fluid flows to how easily it conducts heat. ρ is the Rayleigh number measured against its critical value, and it describes how hard the layer is heated. β is a geometric factor tied to the shape of the convection cells.',
          'The classic values, chosen by Lorenz, are σ = 10, ρ = 28 and β = 8/3. Of the three, ρ is the one that changes the behaviour most. Raise it from zero and the motion goes through very different regimes, as the next sections show.',
        ],
        f: 'σ = 10,   ρ = 28,   β = 8/3',
      },
      {
        h: 'Fixed points and the road to chaos',
        p: [
          'A fixed point is a place where all three derivatives are zero, so a point put there stays there. For ρ below 1 the only fixed point is the origin, and every path falls into it: the fluid stops moving. At ρ = 1 two more fixed points appear, one for each direction of circulation.',
          'For the classic σ and β, those two points sit at x = y = ±√(β(ρ − 1)) and z = ρ − 1. At ρ = 28 that is x = y = ±8.485 and z = 27. They are stable only up to ρ of about 24.74. Above that value the paths spiral away from both of them and never settle, and chaos begins.',
        ],
        f: 'x = y = ±√(β(ρ − 1)),   z = ρ − 1',
      },
      {
        h: 'Why there are two wings',
        p: [
          'At ρ = 28 the two fixed points are still there, but both repel the path. The point spirals outward around one of them, and when the spiral grows large enough the path crosses over to the other and starts spiralling around that one. Those two spirals are the two wings.',
          'How many loops the path makes on one wing before it switches is the part that cannot be predicted. The sequence of loop counts looks random, even though the equations contain no randomness at all. This is the property that gave rise to the butterfly effect.',
        ],
        piece: 'lorenc',
        caption: 'Tightly Woven: the Lorenz system with σ = 10, ρ = 28, β = 2.666667, 260,000 steps.',
      },
      {
        h: 'Volume shrinks, yet the path never repeats',
        p: [
          'Take a small blob of starting points and follow all of them. The Lorenz system squeezes the blob: its volume shrinks at the constant rate σ + 1 + β, which for the classic values is about 13.67. After a short time the blob has collapsed onto a surface of zero volume, which is the attractor.',
          'A path on that surface still cannot repeat or cross itself, so it folds into ever thinner layers. The attractor therefore has a fractal dimension, a little above 2 and well below 3. Shrinking volume and a never-repeating path are the two properties that together define a strange attractor.',
        ],
        f: '∇·F = −(σ + 1 + β) ≈ −13.67',
      },
      {
        h: 'Sensitivity and the Lyapunov exponent',
        p: [
          'Two paths that start very close together follow each other for a while, then separate. The average rate of separation is the largest Lyapunov exponent λ. A positive value means chaos. Our program estimates it while it draws, and for the Lorenz piece it reports λ = 0.907.',
          'The same idea, with a pendulum instead of convection, is worked out in the guide to double pendulum chaos. There the starting angles play the role that the starting point plays here.',
        ],
        f: '|δ(t)| ≈ |δ₀|·e^(λt)',
      },
      {
        h: 'How the curve is plotted',
        p: [
          'There is no formula that gives x, y and z at any time t, so the program solves the equations in small steps with the fourth-order Runge-Kutta method (RK4). For our piece the time step is dt = 0.004 and the path is followed for 260,000 steps, starting from x = −6.353, y = −4.015, z = 27.645.',
          'The three-dimensional path is then projected onto the page from a chosen viewing angle. Brightness records how often the path passes through each spot, so the busy regions glow and the rare ones stay dark. For a different flow drawn the same way, see the Halvorsen attractor.',
        ],
        piece: 'halvorsen',
        caption: 'Waves: the Halvorsen system with a = 1.4, 260,000 steps, RK4, Lyapunov exponent 0.694.',
      },
      {
        h: 'Our Lorenz poster',
        p: [
          'The Lorenz poster is drawn by a program written in JavaScript from the equations on this page. The product page lists the equations, the parameters, the starting point and the measured values, so the numbers quoted here are the ones behind the picture. You can also try attractor maps live in /play/.',
          'Nothing is painted by hand and no photograph is involved. What you see is exactly the print you get, on fine art matte paper.',
        ],
      },
    ],
    faq: [
      { q: 'What are the Lorenz attractor equations?', a: 'They are dx/dt = σ(y − x), dy/dt = x(ρ − z) − y and dz/dt = xy − βz. The classic parameters are σ = 10, ρ = 28 and β = 8/3.' },
      { q: 'What does ρ do in the Lorenz system?', a: 'ρ is the Rayleigh number, a measure of how strongly the fluid layer is heated. Below 1 the motion dies out, and for the classic σ and β chaos appears above about 24.74.' },
      { q: 'Why is the Lorenz attractor shaped like a butterfly?', a: 'The path spirals around two unstable fixed points and jumps between them at unpredictable moments. Each spiral forms one wing.' },
      { q: 'How do you plot the Lorenz attractor?', a: 'Solve the three equations in small time steps, for example with the Runge-Kutta method, store every point, and project the 3D path onto a plane.' },
    ],
  },
  {
    slug: 'algorithmic-art',
    series: '',
    shop: ['drvo-signala', 'aurora', 'metropola', 'lorenc', 'klifordov-veo', 'tiha-oluja'],
    title: 'Algorithmic Art: History, Methods and Examples',
    desc: 'Algorithmic art is art made by following a written procedure. See how it began with Molnar, Nake and Mohr, what plotters did, and how code draws a poster.',
    h1: 'Algorithmic art: history, methods and examples',
    kicker: 'Guide // Art and code',
    lead: 'Algorithmic art is art made by writing down a procedure, a finite list of exact steps, and letting it produce the image. This page covers where the idea comes from, the early artists who used it, what an algorithm adds to a drawing, and three of our own pieces taken apart rule by rule.',
    updated: '2026-11-17',
    sections: [
      {
        h: 'What an algorithm is',
        p: [
          'An algorithm is a finite sequence of unambiguous steps that turns an input into an output. The word comes from the name of the ninth-century mathematician al-Khwarizmi. A recipe is close to one, except that a recipe leaves room for judgement and an algorithm does not.',
          'In art, the input is a set of numbers and rules, and the output is a picture. The artist decides the rules, the starting values and when to stop, and then the procedure does the drawing. That division of work is what separates this kind of art from sketching by hand.',
        ],
      },
      {
        h: 'The early artists',
        p: [
          'Vera Molnar, born in Budapest, began in the 1950s and 1960s by working out systematic variations of simple shapes on paper, a method she called the imaginary machine, before she had access to a computer. She went on to use computers from the late 1960s.',
          'In Germany, the mathematician Frieder Nake and the engineer Georg Nees both showed plotter drawings in Stuttgart in 1965, among the first public exhibitions of computer art. Manfred Mohr, who trained as a jazz musician before turning to art, moved to programs in the late 1960s and spent decades on cubes and their rotations in higher dimensions.',
          'What these artists share is that the program is part of the work. Changing one rule or one number gives a related but different image, so the artist is exploring a family of pictures rather than making one.',
        ],
      },
      {
        h: 'Plotters and screens',
        p: [
          'Early computers had no screens worth drawing on. The output device was a plotter: a pen held over paper that moved to coordinates sent by the program, drew a line to the next coordinates, and lifted. Every picture was a list of line segments.',
          'Today the output is usually pixels, but the idea is unchanged. The program computes positions and colours, and a device draws them. Our posters are rendered by programs written in JavaScript and sent to print as finished images.',
        ],
      },
      {
        h: 'Rules that call themselves',
        p: [
          'One common method is a grammar: a rule says that one shape is replaced by other shapes, and the replacement is applied again and again. The Signal poster is built this way. A "spoke" either continues straight, splits into two smaller spokes, or ends in a node, and a random draw picks which rule applies at each step.',
          'The three rules fire with probabilities of 73%, 20% and 5%. Applied until the program reaches its limit, they produce 5,396 primitives, of which 5,208 are boxes and 188 are nodes, growing from 15 rays. The guide to fractal flames covers another kind of repeated rule.',
        ],
        f: 'spoke → box · spoke(rz + θ, s × 0.8) · spoke(rz − θ, s × 0.8)   p = 20%',
        piece: 'drvo-signala',
        caption: 'Signal: a grammar with 15 rays and 5,396 primitives (5,208 boxes, 188 nodes).',
      },
      {
        h: 'A signal that steers the drawing',
        p: [
          'An algorithm needs inputs, and the input does not have to be a picture. Several of our pieces share one control curve s(t) built from a few sine waves, called partials, multiplied by smooth swells. The curve then sets how tall, wide or bright something is at each point along the drawing.',
          'It is the same sum of sines used to describe sound, which is why these pieces look like recordings. The guide to sound wave art explains waveforms and spectrograms. Here the curve is only a source of controlled variation, written as a formula so that it can be repeated exactly.',
        ],
        f: 's(t) = Σₖ aₖ·(½ + ½·sin(2π·fₖ·t + φₖ)) · Σⱼ bⱼ·e^(−((t − cⱼ)/wⱼ)²)',
      },
      {
        h: 'A ribbon from one formula',
        p: [
          'The Aurora poster is one ribbon of 150 lines. Each point P of the ribbon is a centre line C(t) plus an offset that rotates around it by an angle θ(t). That angle grows steadily with t, so the ribbon twists, and a noise term makes the twists uneven.',
          'The width h(t) depends on the control curve, so the ribbon swells where the signal is strong. The piece twists 2.376 times and is built from 105,150 samples. Nothing else is needed: one formula, a set of numbers and a loop over t.',
        ],
        f: 'θ(t) = 2π·k·t + θ₀ + 1.4·noise(3t)',
        piece: 'aurora',
        caption: 'Aurora: one ribbon, 150 lines, 2.376 twists, 105,150 samples.',
      },
      {
        h: 'A city from a grid',
        p: [
          'The Metropolis poster uses a grid of 26 by 26 cells, which gives 676 towers. The index i is a frequency band and j is a time slice, so each tower is a spot on a spectrogram. Its height H(i, j) multiplies the control curve at i and at j, adds a little noise, and raises the result to the power 2.1, which makes tall towers rarer than short ones.',
          'This is a typical use of an algorithm in art: a small formula evaluated at every cell of a grid. Change the grid size or the exponent and the skyline changes while the method stays the same.',
        ],
        f: 'H(i, j) = (0.75·s(i/G)·s(j/G) + 0.25·n(i, j))^2.1 · c(i, j)',
        piece: 'metropola',
        caption: 'Metropolis: a 26 × 26 grid, 676 towers, height from a formula.',
      },
      {
        h: 'How our posters relate to algorithmic art',
        p: [
          'Every Rezonanca poster is made this way: equations or rules written in JavaScript, numbers chosen, and a program that draws the result. We call it Programmer Art. The product page for each piece lists its equations and parameters, so you can see the procedure behind the picture.',
          'Nothing is painted by hand and no photograph is involved. You can run some of the same maps live in /play/. What you see is exactly the print you get, on fine art matte paper.',
        ],
      },
    ],
    faq: [
      { q: 'What is algorithmic art?', a: 'It is art produced by following a written procedure of exact steps, usually run by a computer. The artist chooses the rules and the numbers, and the program draws the image.' },
      { q: 'Who were the first algorithmic artists?', a: 'Vera Molnar, Frieder Nake, Georg Nees and Manfred Mohr are among the best known early names. Nake and Nees showed plotter drawings in Stuttgart in 1965.' },
      { q: 'Is algorithmic art the same as computer art?', a: 'Not exactly. Computer art is any art made with a computer, while algorithmic art stresses that the image comes from an explicit procedure written by the artist.' },
      { q: 'Do you need to code to make algorithmic art?', a: 'Most of it is made by writing code, but you can start with a short script in JavaScript or Python that draws lines from a formula. The first results appear after a few lines.' },
    ],
  },
  {
    slug: 'gifts-for-programmers',
    series: '',
    shop: ['klifordov-veo', 'drvo-signala', 'metropola', 'lorenc'],
    title: 'Gifts for Programmers: Art Made With Code',
    desc: 'Gifts for programmers that skip the joke mug: posters drawn by short programs from real equations. See the loop or rule behind four pieces for a desk.',
    h1: 'Gifts for programmers: art made with code',
    kicker: 'Guide // Gifts',
    lead: 'The best gifts for programmers are objects they can read: a poster where the picture is the output of a short program, and the rules are small enough to follow. This page takes four of our pieces and shows the loop, the rule or the formula behind each one, so you can pick the one that suits the person and say why.',
    updated: '2026-11-18',
    sections: [
      {
        h: 'What a programmer sees in a poster',
        p: [
          'Most programmer gifts are jokes about bugs, coffee or semicolons. They wear out fast. A picture that comes out of a real algorithm lasts longer, because the person can look at it and think about how it was computed.',
          'Our posters are written in JavaScript. Each one starts from a few numbers and a rule, runs a loop, and draws the result. Four of them are described below by the rule that makes them, in the order of how much code you would need to reproduce them.',
          'None of them needs a library or a trick. Each is a loop, a rule and a handful of constants, and the constants are listed on the product page. If the person you are buying for likes to take things apart, that is the part they will enjoy most.',
          'The pieces also differ in kind. One is an iterated map, one is a numerical simulation, one is a recursive grammar and one is a formula evaluated over a grid. Together they cover most of the ways a program can draw, so the choice is really a question of which style of programming the person likes.',
        ],
      },
      {
        h: 'Cup: a two-line loop',
        p: [
          'Cup is a Clifford attractor. The whole program is a loop that takes a point (x, y), computes the next point from the two lines below, and plots it. The poster contains 3,372,754 iterations with a = 1.7, b = 1.7, c = 0.6 and d = 1.2.',
          'Nothing in the loop is random. The same four constants always give the same picture, which is why the poster can be checked against the numbers printed on its product page. A small change to any constant gives a different fabric, so the person who receives it may want to try other values.',
          'It suits the programmer who likes small programs with surprising output. The guide to the Clifford attractor explains what each constant does, and the /play/ page lets the person change them live.',
        ],
        f: 'xₙ₊₁ = sin(a·yₙ) + c·cos(a·xₙ)   yₙ₊₁ = sin(b·xₙ) + d·cos(b·yₙ)',
        piece: 'klifordov-veo',
        caption: 'Cup: a Clifford map, 3,372,754 iterations.',
      },
      {
        h: 'Tightly Woven: a simulation stepped forward',
        p: [
          'Tightly Woven is the Lorenz system, three coupled differential equations. A program cannot solve them in closed form, so it steps forward in small time increments. This poster uses the fourth-order Runge-Kutta method (RK4) with a step of 0.004 and 260,000 steps, starting from a point near x = −6.353, y = −4.015, z = 27.645.',
          'The step size matters. A crude method such as Euler drifts away from the true path quickly, and RK4 is the usual upgrade because it samples the slope four times per step. That is the kind of detail a numerical programmer will notice and enjoy.',
          'It is the right gift for someone who has written a physics simulation, or wishes to. The guide to the Lorenz attractor covers the three parameters σ = 10, ρ = 28 and β = 8/3.',
        ],
        f: 'dx/dt = σ(y − x)   dy/dt = x(ρ − z) − y   dz/dt = xy − βz',
        piece: 'lorenc',
        caption: 'Tightly Woven: the Lorenz system, RK4, 260,000 steps.',
      },
      {
        h: 'Signal: rules that call themselves',
        p: [
          'Signal is a recursive grammar. A "spoke" draws a box and then calls itself in one of three ways, chosen by a random draw: 73% continue straight, 20% split into two smaller spokes, and 5% end in a node and curl. Fifteen rays start the process and it produces 5,396 primitives.',
          'The rules are listed in full on the product page, together with the control curve that sets the size of each box, so the structure can be traced by hand. The random draw is what stops the tree from looking like a template: the rules stay the same, and the choices vary along the way.',
          'Anyone who has written a recursive function will see the structure straight away: a base case, a branch and a scale factor of 0.8 on each split. It is a good fit for the programmer who prefers algorithms to maths.',
        ],
        f: 'spoke → box · spoke(rz + θ, s × 0.8) · spoke(rz − θ, s × 0.8)   p = 20%',
        piece: 'drvo-signala',
        caption: 'Signal: 15 rays, 5,396 primitives from three rules.',
      },
      {
        h: 'Metropolis: a nested loop over a grid',
        p: [
          'Metropolis is a double loop over a 26 by 26 grid, which gives 676 towers. For each cell the program evaluates one formula for the height, where i is a frequency band, j is a time slice, s is a control curve built from sine waves and n is noise.',
          'It will feel familiar to anyone who has filled a 2D array. It also suits people who work with audio or data visualisation, since each tower is a cell of a spectrogram. The guide to sound wave art explains that idea.',
        ],
        f: 'H(i, j) = (0.75·s(i/G)·s(j/G) + 0.25·n(i, j))^2.1 · c(i, j)',
        piece: 'metropola',
        caption: 'Metropolis: a 26 × 26 grid, 676 towers.',
      },
      {
        h: 'Choosing for a desk or an office wall',
        p: [
          'Dark pieces with bright lines, such as Cup and Tightly Woven, look sharp next to a monitor and do not compete with the screen. Metropolis is the most graphic of the four and reads well from across a room, which helps in an open office or a shared study. Signal is the most detailed, with thousands of small boxes, and rewards a closer look.',
          'Sizes, frames and shipping are covered in the maths gifts guide, which also has picks for mathematicians and physicists. If you are unsure which piece to choose, take the one whose rule the person would most like to explain to a visitor.',
        ],
      },
      {
        h: 'How our posters relate to gifts for programmers',
        p: [
          'Every Rezonanca poster is a program written line by line in Novi Sad, with its numbers chosen by hand. We call it Programmer Art. The product page for each piece lists its equations, parameters and measurements, so the recipient can check the picture against the rule that made it.',
          'Nothing is photographed or painted. What you see is exactly the print you get, fine art matte paper.',
        ],
      },
    ],
    faq: [
      { q: 'What is a good gift for a programmer who has everything?', a: 'Something they can read rather than use: a print of the output of a short program, such as a Clifford attractor or a recursive grammar, with its equations listed so they can see how it was made.' },
      { q: 'What should I give a software engineer for their desk or office?', a: 'A poster is easier to place than a gadget and does not need a power outlet. A dark piece with fine lines sits well beside a monitor.' },
      { q: 'Is there art that a programmer can understand and reproduce?', a: 'Yes. The Clifford attractor is two lines of iteration, and the Lorenz system is three equations stepped forward in time. Both can be drawn in a short script in JavaScript or Python.' },
      { q: 'Which piece suits a programmer who does not like maths?', a: 'Signal. It is built from a recursive rule with a base case and a branch, which reads like code rather than like an equation.' },
    ],
  },
  {
    slug: 'circle-inversion',
    series: 'inversion',
    title: 'Circle Inversion: How It Works and Why It Draws Fractals',
    desc: 'Circle inversion swaps the inside and outside of a circle. See the formula, how lines become circles, and how repeating it draws lace-like fractals.',
    h1: 'Circle inversion: how it works and why it draws fractals',
    kicker: 'Guide // Inversion',
    lead: 'Circle inversion is a map of the plane that turns a circle inside out: points near the centre fly far away, far points come close, and the circle itself stays put. Here is the rule, what it does to lines and circles, and how repeating it millions of times draws lace.',
    updated: '2026-11-20',
    sections: [
      {
        h: 'The rule',
        p: [
          'Draw a circle with centre O and radius r. Take any point P except O itself. Draw the ray from O through P. The inverse of P is the point P\' on that same ray whose distance from O satisfies one condition: the two distances multiply to r².',
          'So the rule needs only a centre and a radius. Nothing else is chosen, and every point of the plane except the centre gets exactly one partner.',
        ],
        f: '|OP| · |OP\'| = r²',
      },
      {
        h: 'Inside goes out, outside goes in',
        p: [
          'If P is close to O, then |OP| is small, so |OP\'| must be large. A point at a tenth of the radius lands at ten times the radius. A point at twice the radius lands at half the radius. The points on the circle itself have |OP| = r, so they map to themselves.',
          'Apply the rule twice and you get the start back, because the partner of P\' is P. A map that undoes itself is called an involution. The centre O has no inverse at all: as P approaches O, P\' runs off to infinity, which is why mathematicians add a single point at infinity to make the picture complete.',
        ],
        f: '(P\')\' = P',
      },
      {
        h: 'The formula with complex numbers',
        p: [
          'Put the centre at the origin and write each point as a complex number z = x + iy. The inverse keeps the direction of z and changes its length from |z| to r²/|z|. That is the formula below, where |z|² = x² + y².',
          'In coordinates this reads x\' = r²x / (x² + y²) and y\' = r²y / (x² + y²). It is a rational formula with a single division, cheap enough to evaluate for millions of points. If you have met the complex plane in the Mandelbrot set guide, this is another simple rule on the same plane.',
        ],
        f: 'z → r²·z / |z|²\nx\' = r²x / (x² + y²),   y\' = r²y / (x² + y²)',
      },
      {
        h: 'Lines become circles',
        p: [
          'Inversion does not keep straight lines straight. A line that does not pass through the centre becomes a circle that does pass through the centre. A circle through the centre becomes a line. A circle that avoids the centre becomes another circle.',
          'A small example with r = 1: the vertical line x = 1 maps to the circle below, which has centre (½, 0), radius ½, and passes through the origin. Lines through the centre are the only ones that stay lines, because they map onto themselves.',
        ],
        f: 'x = 1   →   (u − ½)² + v² = ¼',
      },
      {
        h: 'Angles survive',
        p: [
          'Although lines bend into circles, the angle at which two curves cross is unchanged by inversion. A map with this property is called conformal. Tiny shapes keep their form and are only scaled and mirrored, so a small square stays a small square and does not shear into a parallelogram.',
          'That is why patterns made with inversion look orderly rather than smeared. Round shapes meet round shapes at the same angles they had before, and the result keeps the look of soft, tidy curves.',
        ],
      },
      {
        h: 'Repeating the map',
        p: [
          'One inversion is a simple move. Repeating inversions in several circles is where it gets rich. In the 1880s Henri Poincaré and Felix Klein studied shapes built from repeated inversions in circles, and found that their edges are endlessly detailed. In 2002 David Mumford, Caroline Series and David Wright published the book Indra\'s Pearls, which draws these fractals by computer.',
          'Each pass maps a copy of the picture into the gaps left by the last pass, so the same pattern shows up inside itself at smaller and smaller scales. The fractal art guide explains more about shapes with detail at every scale.',
        ],
      },
      {
        h: 'Our recipe: fold, invert, repeat',
        p: [
          'Our inversion series uses three steps for every pixel. First the point is folded back into the square from −1 to 1, like folding a sheet of paper until it fits. Then it is inverted in the unit circle and scaled by a number s. These two moves are repeated 14 times, and the colour of the pixel records how much the point was stretched along the way.',
          'In Flower the scale is s = 1.18, the offset is 0.3, 0.3, the rotation is 0.3 and the zoom is 1.6. Blue lace grows wherever the stretch piles up. Lines are drawn only until the detail gets smaller than one pixel, so the lace stays sharp on paper.',
        ],
        f: 'x, y → fold into [−1, 1]\nz → s·z / |z|²\ncolour = total stretch',
        piece: 'inversion-1',
        caption: 'Flower: s = 1.18, offset 0.3, 0.3, rotation 0.3, zoom 1.6, 14 repeats, 12,000,000 pixels.',
      },
      {
        h: 'Changing the numbers',
        p: [
          'The scale s decides how strongly each pass stretches the plane. Eternity uses s = 1.3, with offset 0.2, 0.1, no rotation and zoom 1. The change of numbers gives a very different image: a cross of cream and blue where the pattern repeats inside itself, scale after scale.',
          'The fold and the inversion are the same as in Flower, and so is the count of 14 repeats. Only four numbers moved, and the picture changed completely. That sensitivity to the parameters is typical of repeated maps.',
        ],
        piece: 'inversion-2',
        caption: 'Eternity: s = 1.3, offset 0.2, 0.1, rotation 0, zoom 1, 14 repeats, 12,000,000 pixels.',
      },
      {
        h: 'Same maths, different colour',
        p: [
          'Holes is computed with the same numbers as Flower: s = 1.18, offset 0.3, 0.3, rotation 0.3, zoom 1.6 and 14 repeats. Only the colouring differs. Gold lace surrounds deep navy pools, which are the regions where the stretch stays small.',
          'This shows what the colour stands for. The geometry is fixed by the equations, and the palette is a choice about how to show the total stretch.',
        ],
        piece: 'inversion-3',
        caption: 'Holes: s = 1.18, offset 0.3, 0.3, rotation 0.3, zoom 1.6, 14 repeats, 12,000,000 pixels.',
      },
      {
        h: 'Our inversion posters',
        p: [
          'The inversion series is made with code: a program written in JavaScript applies the fold and the inversion 14 times to each of 12,000,000 pixels and colours the pixel from the result. The product pages list the equations and the parameters of every piece.',
          'Nothing is painted by hand, and no photograph is involved. What you see is exactly the print you get, on fine art matte paper.',
        ],
      },
    ],
    faq: [
      { q: 'What is inversion in a circle?', a: 'It is a map that sends each point P to the point on the same ray from the centre whose distance satisfies |OP|·|OP\'| = r². Points inside the circle go outside, points outside go inside, and points on the circle stay where they are.' },
      { q: 'What is the formula for inversion?', a: 'With the centre at the origin and z = x + iy, the inverse is r²·z / |z|². In coordinates, x\' = r²x / (x² + y²) and y\' = r²y / (x² + y²).' },
      { q: 'What does inversion do to a line?', a: 'A line that does not pass through the centre becomes a circle through the centre, and a circle through the centre becomes a line. A line through the centre maps to itself.' },
      { q: 'How can inversion make a fractal?', a: 'Repeating inversions and folds maps copies of the picture into its own gaps, so the same pattern appears at smaller and smaller scales. Poincaré and Klein studied such shapes in the 1880s.' },
    ],
  },
  {
    slug: 'chaos-theory-art',
    series: '',
    shop: ['lorenc', 'tomas', 'chaos-1', 'chaos-2', 'chaos-3', 'halvorsen', 'resler', 'klifordov-veo'],
    title: 'Chaos Theory Art: Maths You Can Hang on a Wall',
    desc: 'Chaos theory art draws systems that follow exact equations yet cannot be predicted. See three kinds of chaos we plot: flows, maps and pendulums.',
    h1: 'Chaos theory art: maths you can hang on a wall',
    kicker: 'Guide // Chaos theory art',
    lead: 'Chaos theory art is made by drawing a system that follows exact rules but whose long-term behaviour cannot be predicted, so the picture is the rules made visible. This page explains what chaos means in maths, then shows three kinds we draw: flows, maps and pendulums.',
    updated: '2026-11-21',
    sections: [
      {
        h: 'What chaos means in maths',
        p: [
          'In everyday speech chaos means mess. In maths it means something narrower: a system with fixed rules and no randomness, whose future depends so sharply on its starting point that the smallest change grows into a large one. The system is deterministic, but in practice unpredictable.',
          'A picture of such a system is not random noise. It has structure, often a very particular one. That is why the topic suits art: the rules are simple, and the result is rich and still exact. For the theory of the shapes these systems settle onto, see the guide on strange attractors.',
        ],
      },
      {
        h: 'The three ingredients',
        p: [
          'A system needs three things to be chaotic. It must be non-linear, so the effect of a change is not proportional to the change. It must stay bounded, so the path does not simply run off to infinity. And it must be sensitive: two paths that start close together must separate.',
          'The speed of separation is measured by the Lyapunov exponent λ. If λ is positive, a gap between two paths grows roughly like e^(λt). A positive value is the usual test for chaos, and our program estimates it while it draws.',
        ],
        f: '|δ(t)| ≈ |δ₀|·e^(λ·t),   λ > 0',
      },
      {
        h: 'Kind one: flows',
        p: [
          'A flow is a system where a point moves continuously through space, and the equations give its velocity at every position. A program follows the point in tiny time steps and draws the path. After many steps the path fills out a shape called an attractor.',
          'The Lorenz system is the best known flow. Its three equations, with σ = 10, ρ = 28 and β = 8/3, were written down by Edward Lorenz in 1963 as a simple model of convection. The full line-by-line explanation is in the guide to the Lorenz attractor.',
        ],
        f: 'dx/dt = σ(y − x)\ndy/dt = x(ρ − z) − y\ndz/dt = xy − βz',
      },
      {
        h: 'A flow on paper: Tightly Woven',
        p: [
          'Tightly Woven is the Lorenz system drawn with σ = 10, ρ = 28 and β = 2.666667. The path starts at x, y, z = −6.353, −4.015, 27.645 and is followed for 260,000 steps of size 0.004 with the RK4 method. The program measures a Lyapunov exponent of 0.907.',
          'The path winds around two centres and switches between them in an order that never repeats. The thickness of the weave comes from one curve looping back over itself, not from many curves.',
        ],
        piece: 'lorenc',
        caption: 'Tightly Woven: the Lorenz system, σ = 10, ρ = 28, β = 2.666667, 260,000 steps, RK4, Lyapunov exponent 0.907.',
      },
      {
        h: 'Another flow with a different feel: Together',
        p: [
          'Not every chaotic flow looks like wings. Together is drawn from the Thomas system, where each coordinate is driven by the sine of the next one, and a single damping number b pulls the path back toward the centre.',
          'Here b = 0.18, the path starts at 4.107, 0.76, −1.164 and runs for 420,000 steps of size 0.03. The measured Lyapunov exponent is 0.034, far gentler than the Lorenz value, so nearby paths separate slowly. Chaos comes in degrees, and the picture shows a calmer kind.',
        ],
        f: 'dx/dt = sin y − bx\ndy/dt = sin z − by\ndz/dt = sin x − bz',
        piece: 'tomas',
        caption: 'Together: the Thomas system, b = 0.18, 420,000 steps, RK4, Lyapunov exponent 0.034.',
      },
      {
        h: 'Kind two: maps',
        p: [
          'A map has no continuous motion. It is a rule that takes a point and gives the next point, applied again and again. The result is a cloud of dots rather than a smooth curve, and the cloud has a structure of its own.',
          'The Clifford attractor is a famous example, built from sines and cosines of the previous coordinates. The guide to the Clifford attractor shows the two-line rule and lets you try the parameters live, and the play page does the same in the browser. Maps are the cheapest chaos to compute, so they can be drawn with very many points.',
        ],
        f: 'xₙ₊₁ = f(xₙ, yₙ)\nyₙ₊₁ = g(xₙ, yₙ)',
      },
      {
        h: 'Kind three: a pendulum for every pixel',
        p: [
          'The third kind turns the picture inside out. Instead of one path drawn many times, every pixel is its own experiment. In Flamingo each pixel is a double pendulum released from rest with its own pair of starting angles, θ₁ from 0.2π to 0.9π and θ₂ from 0.1π to π. After 6 seconds the colour records the height of the lower arm.',
          'There are 12,000,000 pendulums, one per pixel. Where neighbouring pixels share a colour, the pendulums behave alike. Where the colour jumps from pixel to pixel, tiny differences in the start have already grown large. The chaos is visible as texture. The guide to the double pendulum has the equations.',
        ],
        f: 'h = −(cos θ₁ + cos θ₂)',
        piece: 'chaos-1',
        caption: 'Flamingo: 12,000,000 double pendulums, θ₁ from 0.2π to 0.9π, θ₂ from 0.1π to π, T = 6 s, RK4.',
      },
      {
        h: 'Why chaos looks good',
        p: [
          'Chaotic systems are bounded but never repeat, so a long path covers its shape densely without crossing itself exactly. That gives fine detail at every scale, from the overall form down to single lines.',
          'The shapes are also not chosen by a person. Once the equations and the numbers are set, the picture is fixed. A change of one parameter can turn a loop into a tangle, and the artist works by searching for the numbers where this happens, then choosing the view and the colours.',
        ],
      },
      {
        h: 'Our chaos posters',
        p: [
          'Our attractors, maps and pendulum pictures are made with code: a program written in JavaScript follows the equations step by step and draws the result. The product pages list the equations, the parameters and the measured numbers for every piece, such as the Lyapunov exponent.',
          'Nothing is painted by hand, and no photograph is involved. What you see is exactly the print you get, on fine art matte paper.',
        ],
      },
    ],
    faq: [
      { q: 'What is chaos theory in simple terms?', a: 'It studies systems with exact rules whose long-term behaviour cannot be predicted, because tiny differences in the start grow exponentially. Nothing in them is random.' },
      { q: 'Is chaos the same as randomness?', a: 'No. A chaotic system is fully determined by its equations and starting point. It looks unpredictable only because any error in the start grows very fast.' },
      { q: 'How is chaos theory turned into art?', a: 'A program follows the equations step by step and draws the path or colours each pixel by what its starting point did. The picture is the rules made visible.' },
      { q: 'What does a positive Lyapunov exponent mean?', a: 'It means two nearby paths separate exponentially fast. A positive value is the standard sign that a system is chaotic.' },
    ],
  },
  {
    slug: 'julia-set',
    series: '',
    shop: ['mandelbrotov-skup', 'dolina-morskih-konjica', 'spirala', 'mali-mandelbrot', 'vitica', 'morska-zvezda'],
    title: 'Julia Set vs Mandelbrot Set: How They Connect',
    desc: 'A Julia set fixes c and varies the start z; the Mandelbrot set varies c and fixes z at 0. See how the two fractals relate and why one is a map of the other.',
    h1: 'Julia set vs Mandelbrot set: how they connect',
    kicker: 'Guide // Julia set',
    lead: 'A Julia set is the boundary between starting points z that escape to infinity and those that stay bounded, when the rule zₙ₊₁ = zₙ² + c is repeated with one fixed value of c. The Mandelbrot set uses the same rule but fixes the start and varies c, and this page shows how the two pictures fit together.',
    updated: '2026-11-22',
    sections: [
      {
        h: 'Same rule, different question',
        p: [
          'Both fractals come from one rule: square a complex number and add a constant c. Repeat it and watch whether the numbers stay small or grow without limit. The only difference is which quantity you hold still and which one you vary.',
          'For the Julia picture you pick one c and test every possible starting point z. For the Mandelbrot picture you always start at z = 0 and test every possible c. One image has a fixed rule and many starts. The other has a fixed start and many rules.',
        ],
        f: 'zₙ₊₁ = zₙ² + c',
      },
      {
        h: 'Fixed c, varying z',
        p: [
          'Choose a value of c, for example c = −0.4 + 0.6i. Every pixel of the image is a starting value z₀. The program repeats the rule for that pixel and counts how many steps it takes for |z| to pass 2, the same escape radius used for the Mandelbrot set.',
          'The pixels that never escape form the filled set. Its edge is the curve named after Gaston Julia, who studied the iteration of such functions in a long paper published in 1918. Pierre Fatou worked on the same problems at the same time. Colouring the escaping pixels by their step count gives the glowing filaments around the edge.',
        ],
        f: 'z₀ = pixel,   c fixed,   |zₙ| > 2  ⇒  z₀ escapes',
      },
      {
        h: 'Fixed z, varying c',
        p: [
          'The Mandelbrot set turns this around. Each pixel is a value of c, and the start is always z₀ = 0. The point z = 0 matters because it is the critical point of the rule: the one place where the squaring step folds the plane onto itself. Its fate decides the shape of every Julia picture.',
          'So the Mandelbrot set is one image about one starting point, while there is a separate Julia picture for every single c. The full explanation of the Mandelbrot side is in the Mandelbrot set guide.',
        ],
        f: 'z₀ = 0,   c = pixel,   |zₙ| > 2  ⇒  c ∉ M',
        piece: 'mandelbrotov-skup',
        caption: 'Brot: the whole Mandelbrot set, centred at −0.6986 + 0.0016i, 400 steps per pixel.',
      },
      {
        h: 'The dichotomy: connected or dust',
        p: [
          'Here is the link between the two. If c is inside the Mandelbrot set, the Julia picture for that c is one connected piece. If c is outside, the picture falls apart into infinitely many separate points, a cloud often called Cantor dust.',
          'The reason is the critical point. When the path of z = 0 stays bounded, the Julia curve cannot break up. When that path escapes, the curve shatters. This is why the Mandelbrot set is sometimes described as a map of all the Julia pictures: it records, for every c, which of the two cases holds.',
        ],
        f: 'c ∈ M  ⇔  connected\nc ∉ M  ⇔  dust',
      },
      {
        h: 'Simple examples',
        p: [
          'Take c = 0. The rule is then just squaring, so any start with |z| below 1 shrinks toward 0 and any start above 1 grows. The Julia curve is the unit circle, a plain smooth loop.',
          'Take c = −2, at the far left tip of the Mandelbrot set. The curve becomes the straight line segment from −2 to 2. Take c = i and you get a thin, branching tree with no inside at all, still connected because i lies in the Mandelbrot set. Between these cases the curves wrinkle, pinch and spiral.',
        ],
        f: 'c = 0: unit circle\nc = −2: segment from −2 to 2',
      },
      {
        h: 'Reading the map: where c sits',
        p: [
          'Inside the main heart-shaped body of the Mandelbrot set, the Julia curve is a slightly deformed circle. In the round bulb on its left, it pinches into two lobes touching at a point. Each smaller bulb gives a Julia curve with more lobes, matching the length of the cycle the numbers fall into.',
          'Near the edge of the Mandelbrot set the Julia curves become the most intricate, with spirals and branches. The two pictures are tied: zoom into the edge of the Mandelbrot set near a given c, and the local shape resembles the Julia curve for that c.',
        ],
        piece: 'dolina-morskih-konjica',
        caption: 'Seahorse Valley: centred at −0.7454 + 0.1127i, 477× zoom, 900 steps per pixel.',
      },
      {
        h: 'Edge detail you can compare',
        p: [
          'The deep Mandelbrot zooms are windows onto the boundary where the two pictures meet. The Far Out There piece is a window 0.0035 wide, centred at −0.7616 − 0.0848i, about 886 times closer than the full view, with 1,400 steps per pixel.',
          'Spirals like these are the same kind of structure that appear in the Julia curves for values of c at that place. To see a rule with a fixed shape rather than a fixed constant, the guide to fractal art and the live /play/ page are good next stops.',
        ],
        piece: 'spirala',
        caption: 'Far Out There: 886× zoom, centred at −0.7616 − 0.0848i, 1,400 steps per pixel.',
      },
      {
        h: 'How we draw them',
        p: [
          'Our Mandelbrot posters are drawn by a program written in JavaScript. It tests about 1.5 million points for each image, repeats the rule for every point and maps the escape count to colour. The product page lists the centre, zoom and steps used, so you can find the same window yourself.',
          'Because each image is one fixed start with many values of c, our posters show the Mandelbrot side of the pair. The Julia pictures for any c in those windows follow from the same rule, with the roles of z and c swapped.',
        ],
      },
      {
        h: 'Our posters and this maths',
        p: [
          'The Mandelbrot series puts the boundary of the set on paper, from the full view to deep zooms of its spirals and tendrils. Each page lists the exact numbers used, with nothing painted by hand. What you see is exactly the print you get, fine art matte paper.',
        ],
      },
    ],
    faq: [
      { q: 'What is the difference between the Julia set and the Mandelbrot set?', a: 'Both use zₙ₊₁ = zₙ² + c. A Julia set fixes c and tests every starting z, while the Mandelbrot set fixes the start at 0 and tests every c.' },
      { q: 'How many Julia sets are there?', a: 'There is one for every complex number c, so infinitely many. The Mandelbrot set shows which c give a connected one.' },
      { q: 'When is a Julia set connected?', a: 'It is connected exactly when c lies inside the Mandelbrot set. For any c outside, it breaks into disconnected dust.' },
      { q: 'Who discovered Julia sets?', a: 'Gaston Julia published his work on iterating functions in 1918, and Pierre Fatou studied the same problems at the same time. The pictures came much later, with computers.' },
    ],
  },
];

export const guideFor = (series: string) => GUIDES.find((g) => (g.series && g.series === series) || g.also?.includes(series));
