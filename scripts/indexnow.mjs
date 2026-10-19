/**
 * IndexNow — after every deploy (.github/workflows/deploy.yml) tells Bing, Yandex, Seznam, Naver… that the pages of the
 * site changed, so they re-read them in hours, not weeks. The URLs — from the live sitemap; the key — public/<key>.txt
 * (IndexNow checks that the key file is on the site). Google doesn't take IndexNow: it reads sitemap.xml.
 * A failure is only printed — publishing the site never depends on it.
 */
const SITE = 'https://niflaot.mychitas.app';
const KEY = '3f4a50ac64c99e0e8b01df04b1ab9777';

const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs → ${res.status} ${res.statusText}`);
if (!res.ok) console.log(await res.text());
