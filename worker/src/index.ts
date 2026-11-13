// Rezonanca payments: Raiffeisen card payments through the UPC "e-Commerce Connect" gateway.
// The static site can't sign requests or receive the gateway's POSTs, so this Worker does:
//   POST /api/checkout  cart + buyer -> order in D1 -> signed form fields for the gateway (pre-authorisation, Delay=1)
//   POST /api/notify    gateway -> verify signature, record the result, approve/reverse, send emails
//   POST /api/success | /api/failure  gateway redirects the buyer here -> 303 to the site's result page
//   GET  /api/order     result page reads the order status (order id + secret token)
//   cron (10 min)       gives up on abandoned payments; sends paid orders to Gelato; when Gelato ships:
//                       tracking email to the buyer + "capture now" email to Filip (capture stays manual in the bank portal)
// The card is charged in RSD (PRICES_RSD; Raiffeisen accepts no other currency), prices are shown in EUR too.
// Prices come from the site's own config, never from the browser. Card data never touches us
// (the buyer types it on the bank's page). The bank requires keeping the transaction log for 13 months.
import { PRICES, PRICES_RSD, SHOP, SELLER, ACTIVE_FORMATS, FORMAT_SIZES, FRAMES, COUNTRIES, STATE_COUNTRIES, gelatoProduct } from '../../src/config';
import { PRODUCTS } from '../../src/data/products.js';
import { T } from '../../src/i18n';

export interface Env {
  DB: D1Database;
  MERCHANT_ID: string;
  TERMINAL_ID: string;
  GATEWAY_URL: string;
  SITE_URL: string;
  API_URL: string;
  NOTIFY_IPS: string; // comma-separated; empty = don't check (local tests only)
  MAIL_FROM: string;
  OWNER_EMAIL: string;
  MERCHANT_KEY: string; // secret: PKCS#8 PEM private key (<MerchantID>.pem converted)
  GATEWAY_PUBKEY: string; // SPKI PEM public key from the gateway's certificate
  RESEND_API_KEY?: string; // secret; without it emails are only logged
  GELATO_API_KEY?: string; // secret; without it paid orders are not sent to Gelato (Filip gets an email instead)
  FILE_TOKEN?: string; // secret: print files URL token (files-worker)
  FILES_URL: string; // files-worker origin
  GELATO_ORDER_TYPE: string; // 'order' (printed + charged by Gelato) or 'draft' (tests: never printed)
  DEV?: string; // '1' only in .dev.vars: enables /api/dev/approve for local tests
}

type Lang = 'sr' | 'en';
type Line = { slug: string; format: string; size: string; frame?: string; tone?: string; qty: number };
type Customer = { firstName: string; lastName: string; name: string; phone: string; email: string; country: string; address: string; address2?: string; city: string; state?: string; zip: string; note?: string };
type Order = {
  id: string; token: string; created_at: string; purchase_time: string; lang: Lang; amount: number; currency: number;
  lines: string; customer: string; ip: string; status: string; tran_code: string | null; approval_code: string | null;
  rrn: string | null; xid: string | null; proxy_pan: string | null; notified_at: string | null; emails: string | null;
  shipped_at: string | null; gelato_id: string | null; gelato_status: string | null; gelato_error: string | null; tracking: string | null; warned_at: string | null;
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
const money = (rsd: number, _lang?: Lang) => `${rsd.toLocaleString('en-US')} RSD`;
const euro = (n: number) => `€${n.toLocaleString('en-US')}`;
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const product = (slug: string) => PRODUCTS.find((p: any) => p.slug === slug) as any;
const unit = (l: Line) => (PRICES_RSD as any)[l.format]?.[l.size] as number | undefined; // RSD, what the card is charged
const unitEur = (l: Line) => (PRICES as any)[l.format]?.[l.size] as number | undefined;
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
  const eur = lines.reduce((a, l) => a + unitEur(l)! * l.qty, 0);
  return { subtotal, shipping: SHOP.shipping, total: subtotal + SHOP.shipping, eur };
};
// Gateway posts are normally form-urlencoded, but read any body (text/plain, no content type, multipart) without throwing.
const parse = (ct: string, body: string) => {
  if (/multipart\/form-data/i.test(ct)) return null;
  const t = body.trim();
  if (t.startsWith('{')) { try { return Object.fromEntries(Object.entries(JSON.parse(t)).map(([k, v]) => [k, String(v)])); } catch { /* fall through */ } }
  // Form-encoded, or Parameter=Value lines.
  return Object.fromEntries(new URLSearchParams(t.includes('&') || !t.includes('\n') ? t : t.split(/\r?\n/).join('&')).entries());
};
const form = async (req: Request) => {
  const ct = req.headers.get('Content-Type') ?? '';
  if (/multipart\/form-data/i.test(ct)) return Object.fromEntries((await req.formData()).entries()) as Record<string, string>;
  return parse(ct, await req.text()) as Record<string, string>;
};
const getOrder = (env: Env, id: string) => env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<Order>();

// ---------- emails (Prilog 1: confirmation to the buyer after every attempt, success or failure). English only.
const L = {
  okSubject: (id: string) => `Rezonanca - payment successful, order ${id}`,
  failSubject: (id: string) => `Rezonanca - payment failed, order ${id}`,
  okLead: 'Thank you! Your card payment was approved. The amount is reserved on your card and is only charged once your print ships. We print it to order now; you will get the tracking link by email as soon as it ships.',
  failLead: 'Your card payment did not go through and your card was not charged. You can try again on the site.',
  order: 'Order', date: 'Date', status: 'Status', ok: 'Approved', fail: 'Unsuccessful', code: 'Authorisation code', card: 'Card', rrn: 'Transaction reference (RRN)',
  items: 'Items', qty: 'Qty', price: 'Price', subtotal: 'Subtotal', shipping: 'Shipping', free: 'Free', total: 'Total charged', deliver: 'Delivery address', seller: 'Seller',
  reason: 'Reason', help: 'Questions and complaints',
  fx: 'Your card is charged in Serbian dinars (RSD). If your card is in another currency, your bank converts the amount at its own rate, so the final amount on your statement may differ slightly.',
};
const REASONS: Record<string, string> = {
  '105': 'declined by the issuing bank', '116': 'insufficient funds', '111': 'card does not exist', '108': 'card reported lost or stolen',
  '101': 'wrong expiry date', '130': 'limit exceeded', '290': 'issuing bank unavailable', '291': 'technical problem', '501': 'payment cancelled', '502': 'session expired',
};
const countryName = (cc: string) => { try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(cc) ?? cc; } catch { return cc; } };
const addressHtml = (c: Customer) => [c.name, c.address, c.address2, `${c.zip} ${c.city}${c.state ? ', ' + c.state : ''}`, countryName(c.country), c.phone].filter(Boolean).map((x) => esc(x!)).join('<br>');
const wrap = (body: string) => `<div style="font-family:Arial,sans-serif;color:#121417;max-width:560px"><p style="font-size:18px;font-weight:bold">Rezonanca</p>${body}
<p style="font-size:12px;color:#7a7d82">${L.seller}: ${esc(SELLER.name)}, ${esc(SELLER.address)}, MB ${SELLER.mb}, PIB ${SELLER.pib}, ${esc(SELLER.activity)}<br>${L.help}: ${SHOP.email}, ${SHOP.phone} · ${env_site()}</p></div>`;

function receipt(o: Order, approved: boolean) {
  const lines: Line[] = JSON.parse(o.lines), c: Customer = JSON.parse(o.customer), t = totals(lines);
  const rows = lines.map((x) => `<tr><td style="padding:6px 0">${esc(product(x.slug).name.en)}<br><span style="color:#7a7d82;font-size:13px">${esc(describe(x, 'en'))}</span></td><td align="center">${x.qty}</td><td align="right">${money(unit(x)! * x.qty)}<br><span style="color:#7a7d82;font-size:13px">${euro(unitEur(x)! * x.qty)}</span></td></tr>`).join('');
  // No TranCode: the buyer cancelled or left the bank's page (we never got the gateway's result).
  const reason = approved ? '' : o.tran_code ? (REASONS[o.tran_code] ?? `code ${o.tran_code}`) : 'payment not completed';
  const facts: [string, string][] = [
    [L.order, o.id], [L.date, new Date().toLocaleString('en-GB', { timeZone: 'Europe/Belgrade' })],
    [L.status, approved ? L.ok : L.fail],
    ...(approved ? [[L.code, o.approval_code ?? ''], [L.card, o.proxy_pan ? '**** ' + o.proxy_pan.slice(-4) : ''], [L.rrn, o.rrn ?? '']] as [string, string][] : [[L.reason, reason]] as [string, string][]),
  ];
  const html = wrap(`<p>${approved ? L.okLead : L.failLead}</p>
<table style="font-size:14px;margin:16px 0">${facts.map(([k, v]) => `<tr><td style="color:#7a7d82;padding:2px 16px 2px 0">${k}</td><td>${esc(v)}</td></tr>`).join('')}</table>
<table width="100%" style="font-size:14px;border-top:1px solid #e2dfd8;border-collapse:collapse"><tr><th align="left">${L.items}</th><th>${L.qty}</th><th align="right">${L.price}</th></tr>${rows}
<tr><td colspan="2" style="padding-top:8px">${L.shipping}</td><td align="right">${L.free}</td></tr>
<tr><td colspan="2"><b>${L.total}</b></td><td align="right"><b>${money(t.total)}</b><br><span style="color:#7a7d82;font-size:13px">${euro(t.eur)}</span></td></tr></table>
<p style="font-size:13px;color:#7a7d82">${L.fx}</p>
<p style="font-size:14px"><b>${L.deliver}</b><br>${addressHtml(c)}</p>`);
  return { subject: approved ? L.okSubject(o.id) : L.failSubject(o.id), html, to: c.email };
}
let SITE = 'https://rezonanca.art';
const env_site = () => SITE.replace(/^https:\/\//, '');

async function sendMail(env: Env, to: string, subject: string, html: string, replyTo?: string) {
  if (!env.RESEND_API_KEY) { console.log('mail (not sent)', to, subject); return { to, subject, at: new Date().toISOString(), result: 'skipped: no RESEND_API_KEY' }; }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  return { to, subject, at: new Date().toISOString(), result: `${r.status} ${(await r.text()).slice(0, 200)}` };
}
async function logMail(env: Env, id: string, entry: unknown) {
  const o = await getOrder(env, id);
  const log: unknown[] = JSON.parse(o?.emails || '[]'); log.push(entry);
  await env.DB.prepare('UPDATE orders SET emails = ? WHERE id = ?').bind(JSON.stringify(log), id).run();
}
const ownerLines = (lines: Line[]) => `<ul>${lines.map((l) => `<li>${l.qty} × ${esc(product(l.slug).name.en)} - ${esc(describe(l, 'en'))} = ${money(unit(l)! * l.qty)} (${euro(unitEur(l)! * l.qty)})</li>`).join('')}</ul>`;
async function mailAfterPayment(env: Env, o: Order, approved: boolean) {
  const r = receipt(o, approved);
  await logMail(env, o.id, await sendMail(env, r.to, r.subject, r.html, SHOP.email));
}

// ---------- Gelato (print + ship). Paid (pre-authorised) order -> Gelato order; the cron watches it until it ships.
const GELATO = 'https://order.gelatoapis.com/v4/orders';
const gelato = async (env: Env, method: string, path: string, body?: unknown) => {
  const r = await fetch(GELATO + path, { method, headers: { 'X-API-KEY': env.GELATO_API_KEY!, 'Content-Type': 'application/json', 'User-Agent': 'rezonanca/1.0' }, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text();
  if (!r.ok) throw new Error(`gelato ${method} ${r.status} ${text.slice(0, 300)}`);
  return JSON.parse(text);
};
const fileKey = (l: Line) => `${l.slug}${l.tone && l.tone !== 'orig' ? '-' + l.tone : ''}-${l.size}.pdf`;

async function placeGelato(env: Env, id: string) {
  // Claim the order first so two callers (notify + success post, or the cron) never place it twice.
  const claim = await env.DB.prepare(`UPDATE orders SET gelato_status = 'placing' WHERE id = ? AND status = 'preauthorized' AND gelato_id IS NULL AND (gelato_status IS NULL OR gelato_status = 'error')`).bind(id).run();
  if (!claim.meta.changes) return;
  const o = (await getOrder(env, id))!, c: Customer = JSON.parse(o.customer), lines: Line[] = JSON.parse(o.lines);
  try {
    if (!env.GELATO_API_KEY || !env.FILE_TOKEN) throw new Error('GELATO_API_KEY / FILE_TOKEN not set');
    const g = await gelato(env, 'POST', '', {
      orderType: env.GELATO_ORDER_TYPE === 'draft' ? 'draft' : 'order', orderReferenceId: o.id, customerReferenceId: c.email, currency: 'EUR',
      items: lines.map((l, i) => ({ itemReferenceId: `${o.id}-${i + 1}`, productUid: gelatoProduct(l.format as any, l.size as any, (l.frame as any) || 'black'), quantity: l.qty,
        files: [{ type: 'default', url: `${env.FILES_URL}/f/${env.FILE_TOKEN}/${fileKey(l)}` }] })),
      shippingAddress: { firstName: c.firstName, lastName: c.lastName, addressLine1: c.address, addressLine2: c.address2 || undefined, city: c.city, postCode: c.zip,
        state: c.state || undefined, country: c.country, email: c.email, phone: c.phone },
    });
    await env.DB.prepare(`UPDATE orders SET gelato_id = ?, gelato_status = ?, gelato_error = NULL WHERE id = ?`).bind(g.id, g.fulfillmentStatus ?? 'created', o.id).run();
    await logMail(env, o.id, await sendMail(env, env.OWNER_EMAIL, `Rezonanca - new order ${o.id} (${money(o.amount / 100)}), sent to Gelato`,
      `<p><b>New card order ${o.id}</b>, pre-authorised. Sent to Gelato as ${env.GELATO_ORDER_TYPE === 'draft' ? 'a DRAFT (test mode, not printed)' : 'an order'}: ${esc(g.id)}.</p>
<p>Nothing to do now. When Gelato ships it, you get an email to capture the payment in the bank portal (within 7 days of the payment).</p>
${ownerLines(lines)}<p>Total ${money(o.amount / 100)} · authorisation ${esc(o.approval_code ?? '')} · RRN ${esc(o.rrn ?? '')}</p><p>${addressHtml(c)}<br>${esc(c.email)}${c.note ? `<br>Note: ${esc(c.note)}` : ''}</p>`, c.email));
  } catch (e) {
    const err = String(e).slice(0, 500);
    console.error('gelato', o.id, err);
    const first = o.gelato_status !== 'error' && !o.gelato_error;
    await env.DB.prepare(`UPDATE orders SET gelato_status = 'error', gelato_error = ? WHERE id = ?`).bind(err, o.id).run();
    if (first) await logMail(env, o.id, await sendMail(env, env.OWNER_EMAIL, `Rezonanca - ACTION NEEDED: order ${o.id} not sent to Gelato`,
      `<p>Card order ${o.id} is paid (pre-authorised) but Gelato refused it. The server retries every 10 minutes for a day; if it keeps failing, place it by hand in Gelato or cancel it in the bank portal.</p><p>${esc(err)}</p>${ownerLines(lines)}<p>${addressHtml(c)}<br>${esc(c.email)}</p>`, c.email));
  }
}

// Gelato status of one placed order: shipped -> tracking email to the buyer + capture email to Filip.
async function watchGelato(env: Env, o: Order) {
  const g = await gelato(env, 'GET', `/${o.gelato_id}`);
  const st: string = g.fulfillmentStatus ?? '';
  const packs: any[] = g.shipment?.packages ?? [];
  const track = packs.map((p) => p.trackingUrl || p.trackingCode).filter(Boolean);
  if (st !== o.gelato_status) await env.DB.prepare('UPDATE orders SET gelato_status = ? WHERE id = ?').bind(st, o.id).run();
  const c: Customer = JSON.parse(o.customer), lines: Line[] = JSON.parse(o.lines);
  if (st === 'canceled' || st === 'cancelled') {
    if (o.gelato_status !== st) await logMail(env, o.id, await sendMail(env, env.OWNER_EMAIL, `Rezonanca - ACTION NEEDED: Gelato cancelled order ${o.id}`,
      `<p>Gelato cancelled ${esc(o.gelato_id!)} for card order ${o.id}. Release the reservation in the bank portal (or re-place the order) and write to the buyer, ${esc(c.email)}.</p>${ownerLines(lines)}`, c.email));
    return;
  }
  if (!['shipped', 'delivered', 'in_transit'].includes(st) && !track.length) return;
  await env.DB.prepare('UPDATE orders SET shipped_at = ?, tracking = ? WHERE id = ? AND shipped_at IS NULL').bind(new Date().toISOString(), JSON.stringify(track), o.id).run();
  const links = track.map((t) => /^https?:/.test(t) ? `<a href="${esc(t)}">${esc(t)}</a>` : esc(t)).join('<br>');
  await logMail(env, o.id, await sendMail(env, c.email, `Rezonanca - your order ${o.id} has shipped`, wrap(`<p>Good news: your print is on its way.</p>
${links ? `<p><b>Tracking</b><br>${links}</p>` : '<p>The tracking link follows as soon as the courier scans the parcel.</p>'}
<p>${lines.map((l) => `${l.qty} × ${esc(product(l.slug).name.en)} - ${esc(describe(l, 'en'))}`).join('<br>')}</p>
<p style="font-size:14px"><b>${L.deliver}</b><br>${addressHtml(c)}</p>`), SHOP.email));
  await logMail(env, o.id, await sendMail(env, env.OWNER_EMAIL, `Rezonanca - CAPTURE NOW: order ${o.id} shipped (${money(o.amount / 100)})`,
    `<p>Gelato shipped order ${o.id}. Capture the payment in the bank portal now: Transakcije → search ${o.id} → open → enter the final amount <b>${(o.amount / 100).toFixed(2)}</b> → confirm. (Not the storniranje field: that voids it.)</p>
<p>Paid ${o.notified_at ?? o.created_at} · authorisation ${esc(o.approval_code ?? '')} · RRN ${esc(o.rrn ?? '')}</p>${ownerLines(lines)}${links ? `<p>${links}</p>` : ''}`));
}

// ---------- routes
async function checkout(req: Request, env: Env, origin: string | null) {
  let body: any;
  try { body = await req.json(); } catch { return ok({ error: 'bad_json' }, origin, 400); }
  const lang: Lang = body.lang === 'sr' ? 'sr' : 'en'; // the site is English only since 2026-10-29
  const lines = Array.isArray(body.lines) ? body.lines : [];
  if (!lines.length || lines.length > 30 || !lines.every(validLine)) return ok({ error: 'bad_cart' }, origin, 400);
  const c = body.customer ?? {};
  const need = ['firstName', 'lastName', 'phone', 'email', 'country', 'address', 'city', 'zip', ...(STATE_COUNTRIES.includes(c.country) ? ['state'] : [])];
  if (need.some((k) => typeof c[k] !== 'string' || !c[k].trim() || c[k].length > 200) || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email) || !COUNTRIES.includes(c.country)) return ok({ error: 'bad_customer' }, origin, 400);
  if (body.terms !== true) return ok({ error: 'terms' }, origin, 400);
  const customer = Object.fromEntries([...need, 'address2', 'state', 'note'].map((k) => [k, String(c[k] ?? '').trim().slice(0, 500)])) as Customer;
  customer.name = `${customer.firstName} ${customer.lastName}`;
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
  // Log the raw call first, so even a request we can't handle leaves a trace (content type + body without Signature).
  const ct = req.headers.get('Content-Type') ?? '';
  const raw = /multipart/i.test(ct) ? '' : await req.clone().text();
  ctx.waitUntil(env.DB.prepare(`INSERT INTO notify_log (at, ip, order_id, tran_code, result) VALUES (?, ?, ?, ?, ?)`)
    .bind(new Date().toISOString(), ip, null, null, `raw ${ct} | ${raw.replace(/Signature=[^&\n]*/g, 'Signature=…').slice(0, 1500)}`).run().catch(() => {}));
  const p = await form(req);
  // forwardUrl sends the buyer to our result page after any outcome (otherwise declines land on the bare site URL).
  const known = p.OrderID ? await getOrder(env, p.OrderID) : null;
  // Via our own /api/back: the gateway POSTs to forwardUrl, and GitHub Pages answers a POST with 405.
  const forward = known && known.token === p.SD ? `${env.API_URL}/api/back?o=${encodeURIComponent(known.id)}&t=${known.token}` : '';
  const echo = (action: 'approve' | 'reverse', reason: string) => new Response(
    [`MerchantID=${p.MerchantID ?? ''}`, `TerminalID=${p.TerminalID ?? ''}`, `OrderID=${p.OrderID ?? ''}`, `Currency=${p.Currency ?? ''}`, `TotalAmount=${p.TotalAmount ?? ''}`,
      `XID=${p.XID ?? ''}`, `PurchaseTime=${p.PurchaseTime ?? ''}`, ...(p.Delay ? [`Delay=${p.Delay}`] : []), `Response.action=${action}`, `Response.reason=${reason}`, `Response.forwardUrl=${forward}`].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  // The signature (gateway key) is what proves a notify is genuine. The IP list is only logged: rejecting an
  // unlisted gateway IP would silently drop real results (UPC reported 2026-11-03 that no notify got through).
  if (allowed.length && !allowed.includes(ip)) console.log('notify from unlisted ip', ip, p.OrderID);

  const r = await apply(env, ctx, p, ip);
  ctx.waitUntil(env.DB.prepare(`INSERT INTO notify_log (at, ip, order_id, tran_code, result) VALUES (?, ?, ?, ?, ?)`)
    .bind(new Date().toISOString(), ip, p.OrderID ?? null, p.TranCode ?? null, r).run().catch((e) => console.error('notify_log', e)));
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
    ctx.waitUntil(mailAfterPayment(env, fresh, approved).catch((e) => console.error('mail', e)).then(() => approved ? placeGelato(env, o.id) : undefined));
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
  const base = `${env.SITE_URL}/payment/`;
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
  // Paid orders Gelato hasn't taken yet (first attempt failed): retry for a day.
  const retry = await env.DB.prepare(`SELECT id FROM orders WHERE status = 'preauthorized' AND gelato_id IS NULL AND (gelato_status IS NULL OR gelato_status = 'error') AND created_at > ?`).bind(new Date(Date.now() - 86400e3).toISOString()).all<{ id: string }>();
  for (const r of retry.results) await placeGelato(env, r.id);
  // Placed and not shipped yet: ask Gelato. Warn Filip once at day 5 (the bank's capture limit is 7 days).
  const open = await env.DB.prepare(`SELECT * FROM orders WHERE status = 'preauthorized' AND gelato_id IS NOT NULL AND shipped_at IS NULL AND created_at > ?`).bind(new Date(Date.now() - 30 * 86400e3).toISOString()).all<Order>();
  for (const o of open.results) {
    try { await watchGelato(env, o); } catch (e) { console.error('watch', o.id, e); }
    if (!o.warned_at && Date.now() - Date.parse(o.created_at) > 5 * 86400e3) {
      await env.DB.prepare('UPDATE orders SET warned_at = ? WHERE id = ?').bind(new Date().toISOString(), o.id).run();
      const fresh = (await getOrder(env, o.id))!;
      if (!fresh.shipped_at) await logMail(env, o.id, await sendMail(env, env.OWNER_EMAIL, `Rezonanca - order ${o.id} not shipped after 5 days`,
        `<p>Gelato order ${esc(o.gelato_id!)} (status: ${esc(fresh.gelato_status ?? '')}) has not shipped, and the bank only lets you capture within 7 days of the payment (${o.created_at}). Check it in Gelato; if it ships later, capture as soon as it does, or ask the bank to extend.</p>`));
    }
  }
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
    total: t.total, subtotal: t.subtotal, shipping: t.shipping, eur: t.eur,
    lines: lines.map((l) => ({ slug: l.slug, name: product(l.slug).name.en, desc: describe(l, 'en'), qty: l.qty, price: unit(l)! * l.qty, eur: unitEur(l)! * l.qty })),
  }, origin);
}

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext) {
    SITE = env.SITE_URL;
    const { pathname } = new URL(req.url), origin = req.headers.get('Origin');
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    try {
      if (pathname === '/api/checkout' && req.method === 'POST') return await checkout(req, env, origin);
      if (pathname === '/api/notify' && req.method === 'POST') {
        try { return await notify(req, env, ctx); } catch (e) {
          console.error('notify', e);
          ctx.waitUntil(env.DB.prepare(`INSERT INTO notify_log (at, ip, result) VALUES (?, ?, ?)`).bind(new Date().toISOString(), req.headers.get('CF-Connecting-IP') ?? '', `error ${String(e).slice(0, 500)}`).run().catch(() => {}));
          return new Response('Response.action=reverse\nResponse.reason=merchant error\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        }
      }
      if (pathname === '/api/back') {
        // forwardUrl target (any method): send the buyer on to the site's result page with a GET.
        const q = new URL(req.url).searchParams, o = q.get('o') ?? '', t = q.get('t') ?? '';
        const qs = /^[A-Z0-9]{1,20}$/.test(o) && /^[a-f0-9]{16,64}$/.test(t) ? `?o=${o}&t=${t}` : '';
        return Response.redirect(`${env.SITE_URL}/payment/${qs}`, 303);
      }
      if (pathname === '/api/success') return await back(req, env, ctx, true);
      if (pathname === '/api/failure') return await back(req, env, ctx, false);
      if (pathname === '/api/order' && req.method === 'GET') return await status(req, env, origin);
      if (pathname === '/api/abandon' && req.method === 'POST') return await abandon(req, env, ctx, origin);
      // Local tests only (.dev.vars DEV=1): mark an order approved as if the gateway had, then run the cron once.
      if (env.DEV === '1' && pathname === '/api/dev/approve') {
        const id = new URL(req.url).searchParams.get('o') ?? '';
        await env.DB.prepare(`UPDATE orders SET status = 'preauthorized', tran_code = '000', approval_code = 'DEV', rrn = 'DEV', notified_at = ? WHERE id = ?`).bind(new Date().toISOString(), id).run();
        await mailAfterPayment(env, (await getOrder(env, id))!, true); await placeGelato(env, id);
        return ok(await getOrder(env, id), origin);
      }
      if (env.DEV === '1' && pathname === '/api/dev/sweep') { await sweep(env, ctx); return ok({ ok: true }, origin); }
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
