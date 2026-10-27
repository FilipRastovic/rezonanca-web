// Rezonanca payments: Raiffeisen card payments through the UPC "e-Commerce Connect" gateway.
// The static site can't sign requests or receive the gateway's POSTs, so this Worker does:
//   POST /api/checkout  cart + buyer -> order in D1 -> signed form fields for the gateway (pre-authorisation, Delay=1)
//   POST /api/notify    gateway -> verify signature, record the result, approve/reverse, send emails
//   POST /api/success | /api/failure  gateway redirects the buyer here -> 303 to the site's result page
//   GET  /api/order     result page reads the order status (order id + secret token)
// Prices come from the site's own config, never from the browser. Card data never touches us
// (the buyer types it on the bank's page). The bank requires keeping the transaction log for 13 months.
import { PRICES, SHOP, SELLER, ACTIVE_FORMATS, FORMAT_SIZES, FRAMES } from '../../src/config';
import { PRODUCTS } from '../../src/data/products.js';
import { T } from '../../src/i18n';

export interface Env {
  DB: D1Database;
  MERCHANT_ID: string;
  TERMINAL_ID: string;
  GATEWAY_URL: string;
  SITE_URL: string;
  NOTIFY_IPS: string; // comma-separated; empty = don't check (local tests only)
  MAIL_FROM: string;
  OWNER_EMAIL: string;
  MERCHANT_KEY: string; // secret: PKCS#8 PEM private key (<MerchantID>.pem converted)
  GATEWAY_PUBKEY: string; // SPKI PEM public key from the gateway's certificate
  RESEND_API_KEY?: string; // secret; without it emails are only logged
}

type Lang = 'sr' | 'en';
type Line = { slug: string; format: string; size: string; frame?: string; tone?: string; qty: number };
type Customer = { name: string; phone: string; email: string; address: string; city: string; zip: string; note?: string };
type Order = {
  id: string; token: string; created_at: string; purchase_time: string; lang: Lang; amount: number; currency: number;
  lines: string; customer: string; ip: string; status: string; tran_code: string | null; approval_code: string | null;
  rrn: string | null; xid: string | null; proxy_pan: string | null; notified_at: string | null; emails: string | null;
};

const RSD = 941;
const ok = (body: unknown, origin: string | null, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
const cors = (origin: string | null): Record<string, string> =>
  origin && (/^https:\/\/(www\.)?rezonanca\.art$/.test(origin) || /^http:\/\/localhost:\d+$/.test(origin))
    ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', Vary: 'Origin' }
    : {};

// ---------- crypto (RSA-SHA1, PKCS#1 v1.5, as in the bank's PHP openssl_sign / openssl_verify)
const pemBody = (pem: string) => Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')), (c) => c.charCodeAt(0));
const enc = new TextEncoder();
let signKey: Promise<CryptoKey> | null = null;
const algo = { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-1' };
async function sign(env: Env, data: string) {
  signKey ??= crypto.subtle.importKey('pkcs8', pemBody(env.MERCHANT_KEY), algo, false, ['sign']);
  const sig = new Uint8Array(await crypto.subtle.sign(algo, await signKey, enc.encode(data)));
  return btoa(String.fromCharCode(...sig));
}
// The gateway signs its replies with SHA-512 (the docs say SHA-1, which our requests still use): accept either.
const verifyKeys: Record<string, Promise<CryptoKey>> = {};
async function verify(env: Env, data: string, b64: string) {
  const sig = Uint8Array.from(atob(b64.replace(/ /g, '+').replace(/\s+/g, '')), (c) => c.charCodeAt(0));
  for (const hash of ['SHA-512', 'SHA-1']) {
    const a = { name: 'RSASSA-PKCS1-v1_5', hash };
    verifyKeys[hash] ??= crypto.subtle.importKey('spki', pemBody(env.GATEWAY_PUBKEY), a, false, ['verify']);
    try { if (await crypto.subtle.verify(a, await verifyKeys[hash], sig, enc.encode(data))) return true; } catch { /* try the next hash */ }
  }
  return false;
}

// ---------- helpers
const belgrade = (d = new Date()) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Belgrade', year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' })
    .formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.year}${p.month}${p.day}${p.hour}${p.minute}${p.second}`;
};
const rand = (n: number) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, '0')).join('');
const money = (rsd: number, lang: Lang) => `${rsd.toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-US')} RSD`;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const product = (slug: string) => PRODUCTS.find((p: any) => p.slug === slug) as any;
const unit = (l: Line) => (PRICES as any)[l.format]?.[l.size] as number | undefined;
const describe = (l: Line, lang: Lang) => {
  const t = T[lang] as any;
  return [l.tone ? t.order.tones[l.tone] : '', t.formats.items[l.format]?.t, l.size.replace('x', ' × ') + ' cm', l.frame ? t.order.frames[l.frame] : ''].filter(Boolean).join(' · ');
};
function validLine(l: any): l is Line {
  if (!l || typeof l.slug !== 'string' || !product(l.slug)) return false;
  if (!ACTIVE_FORMATS.includes(l.format) || !(FORMAT_SIZES as any)[l.format]?.includes(l.size) || !unit(l)) return false;
  if (l.frame && !(FRAMES as readonly string[]).includes(l.frame)) return false;
  if (l.tone && !(product(l.slug).tones ?? []).includes(l.tone)) return false;
  return Number.isInteger(l.qty) && l.qty >= 1 && l.qty <= 20;
}
const totals = (lines: Line[]) => {
  const subtotal = lines.reduce((a, l) => a + unit(l)! * l.qty, 0);
  return { subtotal, shipping: SHOP.shipping, total: subtotal + SHOP.shipping };
};
const form = async (req: Request) => Object.fromEntries((await req.formData()).entries()) as Record<string, string>;
const getOrder = (env: Env, id: string) => env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<Order>();

// ---------- emails (Prilog 1: confirmation to the buyer after every attempt, success or failure)
const L = {
  sr: {
    okSubject: (id: string) => `Резонанца - плаћање успешно, поруџбина ${id}`,
    failSubject: (id: string) => `Резонанца - плаћање није успело, поруџбина ${id}`,
    okLead: 'Хвала! Плаћање картицом је одобрено. Износ је резервисан на твојој картици и наплаћује се тек када пошаљемо пошиљку.',
    failLead: 'Плаћање картицом није успело и твоја картица није задужена. Можеш да покушаш поново или изабереш плаћање поузећем.',
    order: 'Поруџбина', date: 'Датум', status: 'Статус', ok: 'Одобрено', fail: 'Неуспешно', code: 'Ауторизациони код', card: 'Картица', rrn: 'Референца трансакције (RRN)',
    items: 'Наручено', qty: 'Ком.', price: 'Цена', subtotal: 'Међузбир', shipping: 'Достава', total: 'Укупно', deliver: 'Достава на адресу', seller: 'Продавац',
    reason: 'Разлог', help: 'Питања и рекламације',
  },
  en: {
    okSubject: (id: string) => `Rezonanca - payment successful, order ${id}`,
    failSubject: (id: string) => `Rezonanca - payment failed, order ${id}`,
    okLead: 'Thank you! Your card payment was approved. The amount is reserved on your card and is only charged once we ship your parcel.',
    failLead: 'Your card payment did not go through and your card was not charged. You can try again or choose cash on delivery.',
    order: 'Order', date: 'Date', status: 'Status', ok: 'Approved', fail: 'Unsuccessful', code: 'Authorisation code', card: 'Card', rrn: 'Transaction reference (RRN)',
    items: 'Items', qty: 'Qty', price: 'Price', subtotal: 'Subtotal', shipping: 'Shipping', total: 'Total', deliver: 'Delivery address', seller: 'Seller',
    reason: 'Reason', help: 'Questions and complaints',
  },
};
const REASONS: Record<string, { sr: string; en: string }> = {
  '105': { sr: 'банка издавалац није одобрила трансакцију', en: 'declined by the issuing bank' },
  '116': { sr: 'нема довољно средстава', en: 'insufficient funds' },
  '111': { sr: 'картица не постоји', en: 'card does not exist' },
  '108': { sr: 'картица је пријављена као изгубљена или украдена', en: 'card reported lost or stolen' },
  '101': { sr: 'погрешан датум истека', en: 'wrong expiry date' },
  '130': { sr: 'прекорачен лимит', en: 'limit exceeded' },
  '290': { sr: 'банка издавалац није доступна', en: 'issuing bank unavailable' },
  '291': { sr: 'технички проблем', en: 'technical problem' },
  '501': { sr: 'плаћање је прекинуто', en: 'payment cancelled' },
  '502': { sr: 'истекло је време за плаћање', en: 'session expired' },
};

function receipt(o: Order, approved: boolean) {
  const lang = o.lang, l = L[lang], lines: Line[] = JSON.parse(o.lines), c: Customer = JSON.parse(o.customer), t = totals(lines);
  const rows = lines.map((x) => `<tr><td style="padding:6px 0">${esc(product(x.slug).name[lang])}<br><span style="color:#7a7d82;font-size:13px">${esc(describe(x, lang))}</span></td><td align="center">${x.qty}</td><td align="right">${money(unit(x)! * x.qty, lang)}</td></tr>`).join('');
  const reason = !approved && o.tran_code ? (REASONS[o.tran_code]?.[lang] ?? `${lang === 'sr' ? 'код' : 'code'} ${o.tran_code}`) : '';
  const facts: [string, string][] = [
    [l.order, o.id], [l.date, new Date().toLocaleString(lang === 'sr' ? 'sr-RS' : 'en-GB', { timeZone: 'Europe/Belgrade' })],
    [l.status, approved ? l.ok : l.fail],
    ...(approved ? [[l.code, o.approval_code ?? ''], [l.card, o.proxy_pan ? '**** ' + o.proxy_pan.slice(-4) : ''], [l.rrn, o.rrn ?? '']] as [string, string][] : [[l.reason, reason]] as [string, string][]),
  ];
  const html = `<div style="font-family:Arial,sans-serif;color:#121417;max-width:560px">
<p style="font-size:18px;font-weight:bold">Резонанца</p><p>${approved ? l.okLead : l.failLead}</p>
<table style="font-size:14px;margin:16px 0">${facts.map(([k, v]) => `<tr><td style="color:#7a7d82;padding:2px 16px 2px 0">${k}</td><td>${esc(v)}</td></tr>`).join('')}</table>
<table width="100%" style="font-size:14px;border-top:1px solid #e2dfd8;border-collapse:collapse"><tr><th align="left">${l.items}</th><th>${l.qty}</th><th align="right">${l.price}</th></tr>${rows}
<tr><td colspan="2" style="padding-top:8px">${l.subtotal}</td><td align="right">${money(t.subtotal, lang)}</td></tr>
<tr><td colspan="2">${l.shipping}</td><td align="right">${money(t.shipping, lang)}</td></tr>
<tr><td colspan="2"><b>${l.total}</b></td><td align="right"><b>${money(t.total, lang)}</b></td></tr></table>
<p style="font-size:14px"><b>${l.deliver}</b><br>${esc(c.name)}<br>${esc(c.address)}, ${esc(c.zip)} ${esc(c.city)}<br>${esc(c.phone)}</p>
<p style="font-size:12px;color:#7a7d82">${l.seller}: ${esc(SELLER.name)}, ${esc(SELLER.address)}, MB ${SELLER.mb}, PIB ${SELLER.pib}, ${esc(SELLER.activity)}<br>${l.help}: ${SHOP.email}, ${SHOP.phone} · ${env_site()}</p></div>`;
  const subject = approved ? l.okSubject(o.id) : l.failSubject(o.id);
  return { subject, html, to: c.email };
}
let SITE = 'https://rezonanca.art';
const env_site = () => SITE.replace(/^https:\/\//, '');

async function sendMail(env: Env, to: string, subject: string, html: string, replyTo?: string) {
  if (!env.RESEND_API_KEY) return { to, subject, at: new Date().toISOString(), result: 'skipped: no RESEND_API_KEY' };
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  return { to, subject, at: new Date().toISOString(), result: `${r.status} ${(await r.text()).slice(0, 200)}` };
}
async function mailAfterPayment(env: Env, o: Order, approved: boolean) {
  const log: unknown[] = JSON.parse(o.emails || '[]');
  const r = receipt(o, approved);
  log.push(await sendMail(env, r.to, r.subject, r.html, SHOP.email));
  if (approved) {
    const c: Customer = JSON.parse(o.customer), lines: Line[] = JSON.parse(o.lines);
    const owner = `<p><b>Нова поруџбина ${o.id}</b> - картица, ПРЕДАУТОРИЗАЦИЈА. Пошаљи пошиљку, па у трговачком порталу потврди наплату (у року од 7 дана).</p>
<p>${esc(c.name)}, ${esc(c.phone)}, ${esc(c.email)}<br>${esc(c.address)}, ${esc(c.zip)} ${esc(c.city)}${c.note ? `<br>Напомена: ${esc(c.note)}` : ''}</p>
<ul>${lines.map((l) => `<li>${l.qty} × ${esc(product(l.slug).name.sr)} - ${esc(describe(l, 'sr'))} = ${money(unit(l)! * l.qty, 'sr')}</li>`).join('')}</ul>
<p>Укупно ${money(o.amount / 100, 'sr')} · ауторизација ${o.approval_code} · RRN ${o.rrn}</p>`;
    log.push(await sendMail(env, env.OWNER_EMAIL, `Резонанца - поруџбина ${o.id} (картица, ${money(o.amount / 100, 'sr')})`, owner, c.email));
  }
  await env.DB.prepare('UPDATE orders SET emails = ? WHERE id = ?').bind(JSON.stringify(log), o.id).run();
}

// ---------- routes
async function checkout(req: Request, env: Env, origin: string | null) {
  let body: any;
  try { body = await req.json(); } catch { return ok({ error: 'bad_json' }, origin, 400); }
  const lang: Lang = body.lang === 'en' ? 'en' : 'sr';
  const lines = Array.isArray(body.lines) ? body.lines : [];
  if (!lines.length || lines.length > 30 || !lines.every(validLine)) return ok({ error: 'bad_cart' }, origin, 400);
  const c = body.customer ?? {};
  const need = ['name', 'phone', 'email', 'address', 'city', 'zip'];
  if (need.some((k) => typeof c[k] !== 'string' || !c[k].trim() || c[k].length > 200) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email)) return ok({ error: 'bad_customer' }, origin, 400);
  if (body.terms !== true) return ok({ error: 'terms' }, origin, 400);
  const customer: Customer = Object.fromEntries([...need, 'note'].map((k) => [k, String(c[k] ?? '').trim().slice(0, 500)])) as Customer;
  const clean: Line[] = lines.map((l: Line) => ({ slug: l.slug, format: l.format, size: l.size, ...(l.frame ? { frame: l.frame } : {}), ...(l.tone ? { tone: l.tone } : {}), qty: l.qty }));
  const { total } = totals(clean);
  const amount = total * 100; // para
  const purchaseTime = belgrade();
  const id = `RZ${purchaseTime.slice(0, 6)}${rand(3).toUpperCase()}`; // e.g. RZ261026A1B2C3 (14 chars, gateway allows 20)
  const token = rand(16);
  await env.DB.prepare(`INSERT INTO orders (id, token, created_at, purchase_time, lang, amount, currency, lines, customer, ip, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`)
    .bind(id, token, new Date().toISOString(), purchaseTime, lang, amount, RSD, JSON.stringify(clean), JSON.stringify(customer), req.headers.get('CF-Connecting-IP') ?? '').run();
  const sd = token;
  const data = `${env.MERCHANT_ID};${env.TERMINAL_ID};${purchaseTime};${id},1;${RSD};${amount};${sd};`;
  const fields = {
    Version: '1', MerchantID: env.MERCHANT_ID, TerminalID: env.TERMINAL_ID, TotalAmount: String(amount), Currency: String(RSD),
    locale: lang === 'sr' ? 'rs' : 'en', PurchaseTime: purchaseTime, OrderID: id, Delay: '1', SD: sd,
    PurchaseDesc: `Rezonanca ${id}`, Signature: await sign(env, data),
  };
  return ok({ action: env.GATEWAY_URL, fields, order: id }, origin);
}

async function notify(req: Request, env: Env, ctx: ExecutionContext) {
  const ip = req.headers.get('CF-Connecting-IP') ?? '';
  const allowed = env.NOTIFY_IPS.split(',').map((s) => s.trim()).filter(Boolean);
  const p = await form(req);
  // forwardUrl sends the buyer to our result page after any outcome (otherwise declines land on the bare site URL).
  const known = p.OrderID ? await getOrder(env, p.OrderID) : null;
  const forward = known && known.token === p.SD ? `${known.lang === 'en' ? `${env.SITE_URL}/en/payment/` : `${env.SITE_URL}/placanje/`}?o=${encodeURIComponent(known.id)}&t=${known.token}` : '';
  const echo = (action: 'approve' | 'reverse', reason: string) => new Response(
    [`MerchantID=${p.MerchantID ?? ''}`, `TerminalID=${p.TerminalID ?? ''}`, `OrderID=${p.OrderID ?? ''}`, `Currency=${p.Currency ?? ''}`, `TotalAmount=${p.TotalAmount ?? ''}`,
      `XID=${p.XID ?? ''}`, `PurchaseTime=${p.PurchaseTime ?? ''}`, `Response.action=${action}`, `Response.reason=${reason}`, `Response.forwardUrl=${forward}`].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  if (allowed.length && !allowed.includes(ip)) { console.log('notify from unlisted ip', ip, p.OrderID); return new Response('forbidden', { status: 403 }); }

  const r = await apply(env, ctx, p, ip);
  if (r === 'bad signature' || r === 'unknown order' || r === 'mismatch') return echo('reverse', r);
  return echo('approve', 'ok');
}

// Verifies a gateway result (NOTIFY or the signed SUCCESS/FAILURE post) and records it once.
async function apply(env: Env, ctx: ExecutionContext, p: Record<string, string>, ip: string) {
  const cur = p.AltCurrency ? `${p.Currency},${p.AltCurrency}` : p.Currency;
  const amt = p.AltTotalAmount ? `${p.TotalAmount},${p.AltTotalAmount}` : p.TotalAmount;
  // The SUCCESS/FAILURE post leaves Delay out, while the gateway may still sign it (we always send Delay=1).
  const data = (delay: string) => `${p.MerchantID};${p.TerminalID};${p.PurchaseTime};${p.OrderID}${delay};${p.XID};${cur};${amt};${p.SD ?? ''};${p.TranCode};${p.ApprovalCode ?? ''};`;
  const tries = [...new Set([p.Delay ? `,${p.Delay}` : '', ',1', ''])].map(data);
  let signed = false;
  for (const d of tries) if (await verify(env, d, p.Signature ?? '')) { signed = true; break; }
  if (!signed) { console.log('bad signature', JSON.stringify({ ...p, Signature: undefined })); return 'bad signature'; }

  const o = await getOrder(env, p.OrderID);
  if (!o) return 'unknown order';
  const matches = p.MerchantID === env.MERCHANT_ID && Number(p.TotalAmount) === o.amount && Number(p.Currency) === o.currency && p.SD === o.token;
  const approved = p.TranCode === '000' && matches;
  const already = o.status === 'preauthorized' || o.status === 'failed';
  await env.DB.prepare(`UPDATE orders SET status = ?, tran_code = ?, approval_code = ?, rrn = ?, xid = ?, proxy_pan = ?, notify_raw = ?, notified_at = ? WHERE id = ?`)
    .bind(approved ? 'preauthorized' : 'failed', p.TranCode ?? null, p.ApprovalCode ?? null, p.Rrn ?? null, p.XID ?? null, p.ProxyPan ?? null,
      JSON.stringify({ ...p, Signature: undefined, ip }), new Date().toISOString(), o.id).run();
  if (!already) {
    const fresh = (await getOrder(env, o.id))!;
    ctx.waitUntil(mailAfterPayment(env, fresh, approved));
  }
  return p.TranCode === '000' && !matches ? 'mismatch' : 'ok';
}

async function back(req: Request, env: Env, ctx: ExecutionContext, success: boolean) {
  const p = req.method === 'POST' ? await form(req) : Object.fromEntries(new URL(req.url).searchParams);
  console.log('back', success, Object.keys(p).join(','));
  // The gateway signs this post too: record it here in case NOTIFY_URL never arrives.
  if (p.Signature && p.TranCode) await apply(env, ctx, p, req.headers.get('CF-Connecting-IP') ?? '');
  const o = p.OrderID ? await getOrder(env, p.OrderID) : null;
  // Cancelled or failed attempts don't always reach NOTIFY_URL: record them here so the buyer still
  // gets the failure email. Never overrides a result the gateway confirmed.
  if (!success && o && p.SD === o.token && o.status === 'pending') {
    await env.DB.prepare(`UPDATE orders SET status = 'failed', tran_code = ? WHERE id = ? AND status = 'pending'`).bind(p.TranCode ?? null, o.id).run();
    ctx.waitUntil(mailAfterPayment(env, (await getOrder(env, o.id))!, false));
  }
  const base = o?.lang === 'en' ? `${env.SITE_URL}/en/payment/` : `${env.SITE_URL}/placanje/`;
  const qs = o && p.SD === o.token ? `?o=${encodeURIComponent(o.id)}&t=${o.token}` : `?r=${success ? 'ok' : 'fail'}`;
  return Response.redirect(base + qs, 303);
}

// No result from the gateway: mark a still-pending order failed and send the buyer the failure email (Prilog 1).
async function giveUp(env: Env, ctx: ExecutionContext, o: Order) {
  const r = await env.DB.prepare(`UPDATE orders SET status = 'failed' WHERE id = ? AND status = 'pending'`).bind(o.id).run();
  if (r.meta.changes) ctx.waitUntil(mailAfterPayment(env, (await getOrder(env, o.id))!, false));
}

// The buyer came back to the site from the bank's page without passing SUCCESS_URL: declined or cancelled.
async function abandon(req: Request, env: Env, ctx: ExecutionContext, origin: string | null) {
  const b = await req.json().catch(() => ({})) as { o?: string; t?: string };
  const o = await getOrder(env, b.o ?? '');
  if (!o || o.token !== b.t) return ok({ error: 'not_found' }, origin, 404);
  await giveUp(env, ctx, o);
  return describeOrder((await getOrder(env, o.id))!, origin);
}

// Buyer closed the tab on the bank's page: nothing comes back at all, so give up after 30 minutes.
async function sweep(env: Env, ctx: ExecutionContext) {
  const cutoff = new Date(Date.now() - 30 * 60e3).toISOString(), floor = new Date(Date.now() - 2 * 86400e3).toISOString();
  const { results } = await env.DB.prepare(`SELECT * FROM orders WHERE status = 'pending' AND created_at < ? AND created_at > ?`).bind(cutoff, floor).all<Order>();
  for (const o of results) await giveUp(env, ctx, o);
}

async function status(req: Request, env: Env, origin: string | null) {
  const u = new URL(req.url), o = await getOrder(env, u.searchParams.get('o') ?? '');
  if (!o || o.token !== u.searchParams.get('t')) return ok({ error: 'not_found' }, origin, 404);
  return describeOrder(o, origin);
}

function describeOrder(o: Order, origin: string | null) {
  const lines: Line[] = JSON.parse(o.lines), t = totals(lines);
  return ok({
    order: o.id, status: o.status, tranCode: o.tran_code, approvalCode: o.approval_code, card: o.proxy_pan ? o.proxy_pan.slice(-4) : null,
    total: t.total, subtotal: t.subtotal, shipping: t.shipping,
    lines: lines.map((l) => ({ name: product(l.slug).name[o.lang], desc: describe(l, o.lang), qty: l.qty, price: unit(l)! * l.qty })),
  }, origin);
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext) {
    SITE = env.SITE_URL;
    const { pathname } = new URL(req.url), origin = req.headers.get('Origin');
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    try {
      if (pathname === '/api/checkout' && req.method === 'POST') return await checkout(req, env, origin);
      if (pathname === '/api/notify' && req.method === 'POST') return await notify(req, env, ctx);
      if (pathname === '/api/success') return await back(req, env, ctx, true);
      if (pathname === '/api/failure') return await back(req, env, ctx, false);
      if (pathname === '/api/order' && req.method === 'GET') return await status(req, env, origin);
      if (pathname === '/api/abandon' && req.method === 'POST') return await abandon(req, env, ctx, origin);
      return new Response('Rezonanca payments', { status: 404 });
    } catch (e) {
      console.error(e);
      return ok({ error: 'server' }, origin, 500);
    }
  },
  async scheduled(_e: ScheduledController, env: Env, ctx: ExecutionContext) {
    SITE = env.SITE_URL;
    await sweep(env, ctx);
  },
};
