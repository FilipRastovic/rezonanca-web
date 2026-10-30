// Print files for Gelato. The bucket stays private; a file is served only under the secret token,
// so nobody can list or guess them. Objects live at gelato/<slug>[-roza|-tus]-<30x40|45x60>.pdf.
interface Env { PRINT: R2Bucket; FILE_TOKEN: string }

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
    const m = new URL(req.url).pathname.match(/^\/f\/([^/]+)\/([a-z0-9-]+\.pdf)$/);
    if (!m || !env.FILE_TOKEN || m[1] !== env.FILE_TOKEN) return new Response('Not found', { status: 404 });
    const obj = await env.PRINT.get(`gelato/${m[2]}`);
    if (!obj) return new Response('Not found', { status: 404 });
    return new Response(req.method === 'HEAD' ? null : obj.body, {
      headers: { 'Content-Type': 'application/pdf', 'Content-Length': String(obj.size), 'Cache-Control': 'private, max-age=3600', 'X-Robots-Tag': 'noindex' },
    });
  },
};
