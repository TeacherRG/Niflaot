/*
 * Niflaot service worker: the site works without the internet, and the daily reminder («Напоминать каждый день»).
 * scripts/prerender.ts fills VERSION and PRECACHE at build time (dist/sw.js); registered in src/main.tsx (production only).
 *
 * Offline: pages — network first, the saved copy when there is no connection (the app itself still closes on
 * Shabbat by the device's clock); the build's files (/assets/…, names with a hash) — saved once, then from the cache;
 * other files of the site — from the cache, refreshed in the background. Other hosts (statistics, the AI teacher) — never cached.
 *
 * Reminder: the push from the assistant worker carries no text; the message of the day is taken from
 * /daily-message.json (src/core/dailyMessage.ts) for the device's date, in the language saved by src/core/push.ts.
 */
const VERSION = /*__VERSION__*/ 'dev';
const PRECACHE = /*__PRECACHE__*/ [];
const CACHE = `niflaot-${VERSION}`;
const PREFS = '/__niflaot/push-prefs';
// the files were saved at install without the page's Origin header; a server that answers «Vary: Origin»
// must not make the saved copy unusable for the page's own (module script) requests
const ANY = { ignoreVary: true };

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      // one missing file must not stop the update: each is added on its own
      .then((c) => Promise.all(['/', ...PRECACHE].map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('niflaot-') && k !== CACHE && k !== 'niflaot-prefs').map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/__niflaot/')) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(url.pathname, res.clone()));
          return res;
        })
        // offline: this page if it was opened before, else the app (it reads the address itself)
        .catch(() => caches.match(url.pathname, ANY).then((r) => r || caches.match('/', ANY))),
    );
    return;
  }
  if (url.pathname === '/daily-message.json') {
    e.respondWith(fetch(req).catch(() => caches.match(req, ANY)));
    return;
  }
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(req, ANY).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
            return res;
          }),
      ),
    );
    return;
  }
  e.respondWith(
    caches.match(req, ANY).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(() => hit);
      return hit || net;
    }),
  );
});

/* ───── the daily reminder ───── */

const FALLBACK = {
  ru: { title: 'Нифлаот', body: 'Загадка дня ждёт вас на сайте.' },
  en: { title: 'Niflaot', body: 'Today’s riddle is waiting for you on the site.' },
  de: { title: 'Niflaot', body: 'Das Rätsel des Tages wartet auf dich auf der Seite.' },
};

const localDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

async function prefs() {
  try {
    const r = await (await caches.open('niflaot-prefs')).match(PREFS);
    return r ? await r.json() : {};
  } catch {
    return {};
  }
}

async function todaysMessage(lang) {
  let all = null;
  try {
    const res = await fetch('/daily-message.json', { cache: 'no-cache' });
    if (res.ok) {
      all = await res.json();
      (await caches.open(CACHE)).put('/daily-message.json', new Response(JSON.stringify(all), { headers: { 'Content-Type': 'application/json' } }));
    }
  } catch {}
  if (!all) {
    const hit = await caches.match('/daily-message.json', ANY);
    if (hit) all = await hit.json().catch(() => null);
  }
  const m = all?.days?.[localDate()]?.[lang];
  if (m) return m;
  const f = FALLBACK[lang] || FALLBACK.ru;
  return { title: f.title, body: f.body, url: `${location.origin}/?lang=${lang}&ref=push#/daily` };
}

self.addEventListener('push', (e) => {
  e.waitUntil(
    (async () => {
      const p = await prefs();
      const lang = ['ru', 'en', 'de'].includes(p.lang) ? p.lang : 'ru';
      const m = await todaysMessage(lang);
      await self.registration.showNotification(m.title, {
        body: m.body,
        lang,
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
        tag: 'niflaot-daily',
        data: { url: m.url },
      });
    })(),
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const open = list.find((c) => new URL(c.url).origin === location.origin);
      if (open) return open.navigate(url).then((c) => (c || open).focus());
      return self.clients.openWindow(url);
    }),
  );
});
