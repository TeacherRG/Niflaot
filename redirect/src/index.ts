/**
 * The old address niflaot.mychitas.app after the move to niflaot.app (17.11.2026).
 *
 * It must answer for years: QR codes on printed sheets and certificates, links in Telegram posts, podcast apps and the
 * phones where the site is installed all point here.
 * - Search engines, feeds, pictures, data files: a permanent redirect 301 to the same path on niflaot.app — Google moves
 *   the index (and Search Console's «Change of address» needs exactly this), podcast apps follow the feed.
 * - People's browsers opening a page: a tiny page that takes the progress kept in this browser for the old address
 *   (the browser keeps it per address — on niflaot.app a guest would start from nothing), puts it into the fragment of
 *   the new address and goes there; src/core/migrate.ts on the site writes it in. The fragment never reaches a server.
 *   It also removes the old service worker, so the installed app stops showing the old offline copy.
 * - /sw.js: a service worker that removes itself — the installed app asks for it when it checks for an update.
 */

interface Env {
  NEW_SITE?: string;
}

const BOTS =
  /bot|crawl|spider|slurp|Google-InspectionTool|Storebot-Google|BingPreview|YandexRenderResolver|facebookexternalhit|WhatsApp|TelegramBot|Twitterbot|LinkedInBot|Discordbot|Applebot|Podcast|iTunes|Spotify|Overcast|Pocket ?Casts|Feed|RSS|curl|wget|python|Go-http/i;

/** a request for a file, not for a page (/og/site.png, /feed.xml, /quiz/ru/x.json, /tts/…) */
const isFile = (path: string) => /\.[a-z0-9]{2,5}$/i.test(path) && !/\.html?$/i.test(path);

const SELF_REMOVING_SW = `self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil((async () => {
  for (const k of await caches.keys()) await caches.delete(k);
  await self.registration.unregister();
  for (const c of await self.clients.matchAll({ type: 'window' })) c.navigate(c.url);
})()));
`;

function page(target: string) {
  const t = JSON.stringify(target);
  return `<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><link rel="canonical" href="${target.replace(/"/g, '&quot;')}">
<title>Нифлаот — niflaot.app</title>
<noscript><meta http-equiv="refresh" content="0;url=${target.replace(/"/g, '&quot;')}"></noscript>
<style>body{font:16px/1.5 system-ui,sans-serif;background:#fbf8f1;color:#1c2333;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px;text-align:center}a{color:#1f4e8c}</style>
</head><body><p>Нифлаот переехал — <a id="go" href="${target.replace(/"/g, '&quot;')}">niflaot.app</a><br>Niflaot has moved · Niflaot ist umgezogen</p>
<script>
(function () {
  var target = ${t}, url = target + (location.hash || '');
  try {
    var data = {}, n = 0;
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (!k || !(k.indexOf('niflaot:') === 0 || k.indexOf('koelet-') === 0)) continue;
      if (k === 'niflaot:account' || k === 'niflaot:admin-token' || k === 'niflaot:admin-draft') continue;
      data[k] = localStorage.getItem(k); n++;
    }
    if (n) {
      var bytes = new TextEncoder().encode(JSON.stringify(data)), bin = '';
      for (var j = 0; j < bytes.length; j += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(j, j + 0x8000));
      var b64 = btoa(bin).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
      var base = target.split('#')[0];
      // browsers take addresses of a few megabytes; above 1.5 MB the progress stays behind rather than break the move
      if (b64.length < 1500000) url = base + '#nfmig=' + b64 + '&to=' + encodeURIComponent(location.hash || '');
    }
  } catch (e) {}
  var go = function () { location.replace(url); };
  try {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then(function (rs) {
        return Promise.all(rs.map(function (r) { return r.unregister(); }));
      }).then(go, go);
      setTimeout(go, 1500);
      return;
    }
  } catch (e) {}
  go();
})();
</script></body></html>`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const site = (env.NEW_SITE || 'https://niflaot.app').replace(/\/$/, '');
    const target = site + url.pathname + url.search;

    if (url.pathname === '/sw.js') {
      return new Response(SELF_REMOVING_SW, {
        headers: { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store' },
      });
    }

    const ua = request.headers.get('user-agent') || '';
    const wantsPage = (request.headers.get('accept') || '').includes('text/html');
    if (request.method !== 'GET' || BOTS.test(ua) || isFile(url.pathname) || !wantsPage) {
      return Response.redirect(target, 301);
    }
    // the hash is not sent to the server: the page adds it (location.hash) — the route `#/…` survives the move
    return new Response(page(target), {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'referrer-policy': 'no-referrer',
        'x-robots-tag': 'noindex',
      },
    });
  },
};
