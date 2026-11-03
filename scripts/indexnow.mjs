// Tell Bing (and the other IndexNow engines: Yandex, Seznam, Naver; Bing feeds DuckDuckGo and Yahoo) about our pages.
//   node scripts/indexnow.mjs            all URLs in the live sitemap
//   node scripts/indexnow.mjs /guide/x/  just these paths
// The key is public by design: it lives at /<key>.txt on the site.
const KEY = 'f381bc158b4553f30c24fb98767efb39';
const HOST = 'rezonanca.art';
let urls = process.argv.slice(2).map((p) => `https://${HOST}${p}`);
if (!urls.length) {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !/\.(webp|jpg|png)$/.test(u));
}
const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(r.status, r.statusText, `${urls.length} URLs`);
