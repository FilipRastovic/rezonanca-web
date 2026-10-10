const geoms = JSON.parse(require('fs').readFileSync('srb.json', 'utf8'));
const polys = geoms.flatMap((g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates));
const inRing = (x, y, r) => { let c = false; for (let i = 0, j = r.length - 1; i < r.length; j = i++) { const [xi, yi] = r[i], [xj, yj] = r[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c; } return c; };
const inside = (x, y) => polys.some((p) => inRing(x, y, p[0]) && !p.slice(1).some((h) => inRing(x, y, h)));
let minX = 99, maxX = -99, minY = 99, maxY = -99;
for (const p of polys) for (const [x, y] of p[0]) { minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
const COLS = +process.argv[2] || 46, dx = (maxX - minX) / COLS, dy = dx * 1.2 * Math.cos((44 * Math.PI) / 180) / 0.6 * 0.6 / 0.72 * 0.72;
const ROWS = Math.ceil((maxY - minY) / (dx * 1.2));
const g = [];
for (let r = 0; r < ROWS; r++) { g.push([]); for (let c = 0; c < COLS; c++) g[r].push(inside(minX + (c + 0.5) * dx, maxY - (r + 0.5) * dx * 1.2)); }
const at = (r, c) => r >= 0 && r < ROWS && c >= 0 && c < COLS && g[r][c];
const NS = [19.83, 45.25];
const nsC = Math.floor((NS[0] - minX) / dx), nsR = Math.floor((maxY - NS[1]) / (dx * 1.2));
const out = g.map((row, r) => row.map((v, c) => {
  if (r === nsR && c === nsC) return '@';
  if (!v) return ' ';
  const edge = !at(r - 1, c) || !at(r + 1, c) || !at(r, c - 1) || !at(r, c + 1);
  return edge ? '#' : ((r + c) % 2 ? '.' : ':');
}).join('').replace(/\s+$/, ''));
console.log(out.join('\n'));
console.error(`rows ${ROWS} cols ${COLS} | Novi Sad at row ${nsR} col ${nsC}, inside: ${g[nsR]?.[nsC]}`);
