// Live "Структура" hero: a radial structure grown by a design grammar
// (after Structure Synth), ported from waveform-poster/styles.js to plain Canvas 2D.
// Resonance pulses travel outward through it; the pointer bends and excites it.

type Prim = { x: number; y: number; a: number; size: number; long: number; b: number; amp: number; node: boolean; r: number; rgb: string; base: number };

const STOPS: [number, number[]][] = [[0, [18, 40, 120]], [0.4, [35, 105, 255]], [0.75, [60, 230, 255]], [1, [225, 253, 255]]];
function paletteAt(t: number) {
  t = Math.min(1, Math.max(0, t));
  for (let i = 1; i < STOPS.length; i++) {
    if (t <= STOPS[i][0]) {
      const k = (t - STOPS[i - 1][0]) / (STOPS[i][0] - STOPS[i - 1][0]);
      return STOPS[i - 1][1].map((v, j) => v + (STOPS[i][1][j] - v) * k);
    }
  }
  return STOPS[STOPS.length - 1][1];
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seeded sound-like signal on the circle, t ∈ [0, 1) → [0, 1].
function makeSignal(rnd: () => number) {
  const range = (a: number, b: number) => a + (b - a) * rnd();
  const partials = Array.from({ length: 5 }, () => ({ f: Math.floor(range(2, 14)), p: range(0, 6.28), a: range(0.3, 1) }));
  const swells = Array.from({ length: 3 }, () => ({ c: rnd(), w: range(0.08, 0.2), a: range(0.5, 1) }));
  const raw = (t: number) => {
    let s = 0;
    for (const q of partials) s += q.a * (0.5 + 0.5 * Math.sin(2 * Math.PI * q.f * t + q.p));
    let env = 0.2;
    for (const w of swells) { const d = Math.min(Math.abs(t - w.c), 1 - Math.abs(t - w.c)); env += w.a * Math.exp(-((d / w.w) ** 2)); }
    return (s / partials.length) * env;
  };
  let mx = 0;
  for (let i = 0; i < 400; i++) mx = Math.max(mx, raw(i / 400));
  return (t: number) => raw(((t % 1) + 1) % 1) / mx;
}

// Design grammar in unit space (structure radius ≈ 1). Breadth-first, capped.
function grow(seed: number, spokes: number, maxObjects: number): Prim[] {
  const rnd = mulberry32(seed);
  const range = (a: number, b: number) => a + (b - a) * rnd();
  const sig = makeSignal(rnd);
  type S = { x: number; y: number; a: number; size: number; b: number; life: number; amp: number };
  const tf = (s: S, o: { x?: number; rz?: number; sc?: number; b?: number; life?: number }): S => ({
    ...s,
    x: s.x + Math.cos(s.a) * (o.x ?? 0) * s.size,
    y: s.y + Math.sin(s.a) * (o.x ?? 0) * s.size,
    a: s.a + ((o.rz ?? 0) * Math.PI) / 180,
    size: s.size * (o.sc ?? 1),
    b: s.b * (o.b ?? 1),
    life: o.life ?? s.life,
  });
  const out: Omit<Prim, 'r' | 'rgb' | 'base'>[] = [];
  const queue: { rule: 'spoke' | 'arc'; s: S }[] = [];
  const R0 = 0.09;
  for (let k = 0; k < spokes; k++) {
    const t = k / spokes;
    const a = t * Math.PI * 2 + range(-0.01, 0.01);
    const amp = sig(t);
    queue.push({ rule: 'spoke', s: { x: Math.cos(a) * R0, y: Math.sin(a) * R0, a, size: range(0.015, 0.027), b: 0.55 + 0.45 * amp, life: Math.floor(7 + amp ** 1.2 * 24 * range(0.8, 1.1)), amp } });
  }
  const box = (s: S, long: number, node = false) => out.push({ x: s.x, y: s.y, a: s.a, size: s.size, long, b: s.b, amp: s.amp, node });
  while (queue.length && out.length < maxObjects) {
    const { rule, s } = queue.shift()!;
    if (rule === 'arc') {
      box(s, 1.8);
      if (s.life > 0) {
        const r = Math.hypot(s.x, s.y);
        const dir = Math.sign(Math.sin(s.a - Math.atan2(s.y, s.x)));
        queue.push({ rule: 'arc', s: tf(s, { x: 1.9, rz: (((s.size * 1.9) / r) * 180 / Math.PI) * dir, sc: 0.99, b: 0.96, life: s.life - 1 }) });
      }
      continue;
    }
    const p = rnd();
    if (p < 0.84) {
      box(s, range(1.6, 3.4));
      if (s.life > 0) queue.push({ rule: 'spoke', s: tf(s, { x: range(1.4, 2.6), rz: range(-1.2, 1.2), sc: 1.045, b: 0.975, life: s.life - 1 }) });
    } else if (p < 0.93) {
      box(s, 2);
      if (s.life > 3) for (const sg of [1, -1]) queue.push({ rule: 'spoke', s: tf(s, { x: 1.6, rz: sg * range(6, 16), sc: 0.8, b: 0.9, life: s.life - 3 }) });
    } else if (p < 0.98) {
      box(s, 0, true);
      const n = Math.floor(range(3, 10));
      for (const sg of [90, -90]) queue.push({ rule: 'arc', s: tf(s, { rz: sg, sc: 0.9, life: n, b: 0.95 }) });
      if (s.life > 0) queue.push({ rule: 'spoke', s: tf(s, { x: 2.2, sc: 1.03, life: s.life - 1 }) });
    } else {
      box(s, 5);
    }
  }
  return out
    .map((p) => {
      const r = Math.hypot(p.x, p.y);
      const fade = Math.min(1, Math.max(0, 1.3 - r));
      const c = paletteAt(0.12 + 0.55 * p.b * p.amp + 0.25 * fade);
      return { ...p, r, rgb: `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`, base: (0.1 + 0.2 * fade * p.b) * (p.node ? 3 : 1) };
    })
    .filter((p) => p.r < 1.25);
}

export function mountHero(host: HTMLElement, onTick?: (freq: number) => void) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.createElement('canvas');
  host.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;
  let W = 0, H = 0, dpr = 1, cx = 0, cy = 0, S = 0;
  let prims: Prim[] = [];
  let pointerX = 0.5, pointerY = 0.5, energy = 0, raf = 0, running = false, frame = 0;
  const t0 = performance.now();

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = host.clientWidth; H = host.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    const mobile = W < 760;
    cx = mobile ? W * 0.5 : W * 0.68;
    cy = mobile ? H * 0.7 : H * 0.52;
    S = mobile ? Math.min(W * 0.62, H * 0.42) : Math.min(W * 0.36, H * 0.56);
    prims = grow(2, mobile ? 110 : 170, mobile ? 4500 : 9000);
  };

  const draw = (now: number) => {
    const t = reduce ? 3 : (now - t0) / 1000;
    energy *= 0.95;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#020611';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const rot = t * 0.025 + (pointerX - 0.5) * 0.25;
    const tilt = 1 - 0.12 * (pointerY - 0.5); // slight vertical squash, like a tilting dish
    const breathe = 1 + 0.015 * Math.sin(t * 0.8);
    const cr = Math.cos(rot), sr = Math.sin(rot);
    const k = S * breathe * dpr;

    // Guide rings.
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(80,200,255,0.12)';
    ctx.lineWidth = 0.8 * dpr;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.ellipse(cx * dpr, cy * dpr, (0.09 + 0.92 * (i / 5)) * k, (0.09 + 0.92 * (i / 5)) * k * tilt, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Structure: pulses travel outward through it.
    for (const p of prims) {
      const pulse = Math.pow(0.5 + 0.5 * Math.sin(p.r * 10 - t * 1.8 + p.amp * 2), 6);
      ctx.globalAlpha = Math.min(1, p.base * (0.55 + 1.6 * pulse + energy * 0.8));
      ctx.fillStyle = p.rgb;
      const x = p.x * cr - p.y * sr, y = (p.x * sr + p.y * cr) * tilt;
      const a = p.a + rot;
      const ca = Math.cos(a) * k, sa = Math.sin(a) * k;
      ctx.setTransform(ca, sa * tilt, -sa, ca * tilt, cx * dpr + x * k, cy * dpr + y * k);
      if (p.node) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        const L = p.size * p.long, w = p.size * 0.55;
        ctx.fillRect(-L / 2, -w / 2, L, w);
      }
    }

    // Core: glow + rotating wireframe sphere.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    const coreR = 0.075 * k;
    const g = ctx.createRadialGradient(cx * dpr, cy * dpr, 0, cx * dpr, cy * dpr, coreR * 5);
    g.addColorStop(0, `rgba(90,220,255,${0.45 + 0.2 * energy})`);
    g.addColorStop(1, 'rgba(90,220,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(cx * dpr - coreR * 5, cy * dpr - coreR * 5, coreR * 10, coreR * 10);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#020611';
    ctx.beginPath(); ctx.arc(cx * dpr, cy * dpr, coreR, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(200,250,255,0.7)';
    ctx.lineWidth = 1 * dpr;
    ctx.stroke();
    for (let i = 1; i < 6; i++) {
      const e = Math.abs(Math.cos((i / 6) * Math.PI + t * 0.4));
      ctx.beginPath(); ctx.ellipse(cx * dpr, cy * dpr, coreR * e, coreR, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx * dpr, cy * dpr, coreR, coreR * Math.abs(Math.cos((i / 6) * Math.PI)), 0, 0, Math.PI * 2); ctx.stroke();
    }

    if (onTick && frame++ % 6 === 0) onTick(432 + 120 * Math.sin(t * 0.3) + 60 * energy + 8 * Math.sin(t * 3.1));
    if (running) raf = requestAnimationFrame(draw);
  };

  const start = () => { if (!running && !reduce) { running = true; raf = requestAnimationFrame(draw); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };

  resize();
  draw(performance.now());
  addEventListener('resize', () => { resize(); if (!running) draw(performance.now()); });
  addEventListener('pointermove', (e) => {
    const nx = e.clientX / innerWidth, ny = e.clientY / innerHeight;
    energy = Math.min(1, energy + Math.hypot(nx - pointerX, ny - pointerY) * 2);
    pointerX = nx; pointerY = ny;
  }, { passive: true });
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())).observe(host);
}
