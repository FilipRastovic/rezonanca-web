// Light hero background (ink grey): slow, smooth bezier "sound lines" bent by 3D gradient noise (x, line, time).
// Plain canvas 2D, ~1 kB, no p5. Pauses off-screen; one still frame for prefers-reduced-motion.

// Classic Perlin gradient noise in 3D.
const P = new Uint8Array(512);
{
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 7; // fixed seed: the same composition every visit
  for (let i = 255; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) P[i] = p[i & 255];
}
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (a: number, b: number, t: number) => a + t * (b - a);
const grad = (h: number, x: number, y: number, z: number) => {
  const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
};
function noise(x: number, y: number, z: number) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
  x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
  const u = fade(x), v = fade(y), w = fade(z);
  const A = P[X] + Y, AA = P[A] + Z, AB = P[A + 1] + Z, B = P[X + 1] + Y, BA = P[B] + Z, BB = P[B + 1] + Z;
  return lerp(
    lerp(lerp(grad(P[AA] & 15, x, y, z), grad(P[BA] & 15, x - 1, y, z), u), lerp(grad(P[AB] & 15, x, y - 1, z), grad(P[BB] & 15, x - 1, y - 1, z), u), v),
    lerp(lerp(grad(P[AA + 1] & 15, x, y, z - 1), grad(P[BA + 1] & 15, x - 1, y, z - 1), u), lerp(grad(P[AB + 1] & 15, x, y - 1, z - 1), grad(P[BB + 1] & 15, x - 1, y - 1, z - 1), u), v),
    w);
}

export function mountHeroLines(host: HTMLElement) {
  const cv = document.createElement('canvas');
  host.appendChild(cv);
  const ctx = cv.getContext('2d')!;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W = 0, H = 0, dpr = 1, raf = 0, visible = true, t0 = performance.now();

  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = host.clientWidth; H = host.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
  };

  const LINES = 46, STEPS = 64;
  const draw = (now: number) => {
    const t = (now - t0) / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const top = H * 0.16, span = H * 0.72;
    for (let i = 0; i < LINES; i++) {
      const k = i / (LINES - 1);
      const base = top + k * span;
      // a few accent lines, the rest faint ink
      const accent = i % 9 === 4;
      ctx.strokeStyle = accent ? 'rgba(18, 20, 23, 0.22)' : `rgba(18, 20, 23, ${0.04 + 0.06 * Math.sin(k * Math.PI)})`;
      ctx.lineWidth = accent ? 1.1 : 0.8;
      ctx.beginPath();
      let px = 0, py = 0;
      for (let s = 0; s <= STEPS; s++) {
        const u = s / STEPS, x = u * W;
        // amplitude swells towards the right (behind the prints), calm on the left under the text
        const env = Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.05)), 1.3) * (0.35 + 0.65 * u);
        const n = noise(u * 1.6, k * 1.2, t * 0.06) + 0.35 * noise(u * 3.8 + 9, k * 2.4, t * 0.1);
        const y = base + n * env * H * 0.42;
        if (s === 0) ctx.moveTo(x, y);
        else ctx.quadraticCurveTo(px, py, (px + x) / 2, (py + y) / 2); // smooth: control = previous point
        px = x; py = y;
      }
      ctx.lineTo(px, py);
      ctx.stroke();
    }
  };

  const loop = (now: number) => { draw(now); if (visible && !still) raf = requestAnimationFrame(loop); };
  size(); draw(performance.now());
  new ResizeObserver(() => { size(); draw(performance.now()); }).observe(host);
  if (still) return;
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) raf = requestAnimationFrame(loop);
  }).observe(host);
}
