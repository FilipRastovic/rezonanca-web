// Cart: kept in localStorage (falls back to memory if storage is blocked).
// Line = one product in one configuration; same configuration added twice = higher qty.
export type Line = { slug: string; format: string; size: string; frame?: string; qty: number };
type Catalog = {
  lang: 'sr' | 'en';
  prices: Record<string, Record<string, number>>;
  shipping: number;
  products: Record<string, { name: string; img: string; href: string; series: string }>;
  formats: Record<string, string>;
  frames: Record<string, string>;
  framed: string[];
};

const KEY = 'rz-cart-v1';
let memory: Line[] = [];

export const catalog = (): Catalog => JSON.parse(document.getElementById('rz-catalog')!.textContent!);

export function read(): Line[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return memory; }
}
function write(lines: Line[]) {
  memory = lines;
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* private mode: memory only */ }
  document.dispatchEvent(new CustomEvent('cart:change'));
}
const same = (a: Line, b: Line) => a.slug === b.slug && a.format === b.format && a.size === b.size && (a.frame || '') === (b.frame || '');

export function add(line: Line) {
  const c = catalog();
  if (!c.framed.includes(line.format)) delete line.frame;
  const lines = read();
  const hit = lines.find((l) => same(l, line));
  if (hit) hit.qty = Math.min(20, hit.qty + line.qty); else lines.push(line);
  write(lines);
}
export const setQty = (i: number, qty: number) => { const l = read(); if (l[i]) { l[i].qty = Math.max(1, Math.min(20, qty)); write(l); } };
export const remove = (i: number) => { const l = read(); l.splice(i, 1); write(l); };
export const clear = () => write([]);
export const count = () => read().reduce((a, l) => a + l.qty, 0);

export const money = (n: number) => `${n.toLocaleString(catalog().lang === 'sr' ? 'sr-RS' : 'en-US')} RSD`;
export const unitPrice = (l: Line) => catalog().prices[l.format]?.[l.size] ?? 0;
export function totals() {
  const lines = read();
  const subtotal = lines.reduce((a, l) => a + unitPrice(l) * l.qty, 0);
  const shipping = lines.length ? catalog().shipping : 0;
  return { lines, subtotal, shipping, total: subtotal + shipping };
}
export function describe(l: Line) {
  const c = catalog();
  return [c.formats[l.format], l.size.replace('x', ' × ') + ' cm', l.frame ? c.frames[l.frame] : ''].filter(Boolean).join(' · ');
}
