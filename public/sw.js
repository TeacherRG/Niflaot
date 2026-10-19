/*
 * Niflaot service worker: the site works without the internet, and the daily reminder («Напоминать каждый день»).
 * scripts/prerender.ts fills VERSION and PRECACHE at build time (dist/sw.js); registered in src/main.tsx (production only).
 *
 * Offline: pages — network first, the saved copy when there is no connection (the app itself still closes on
 * Shabbat by the device's clock); the build's files (/assets/…, names with a hash) — saved once, then from the cache;
 * other files of the site — from the cache, refreshed in the background. Other hosts (statistics, the AI teacher) — never cached.
 *
 * Reminder: the push from the assistant worker carries no text; the message of the day is taken from
 * /daily-message.json (src/core/dailyMessage.ts) for the device's date, in the language and the mode (`adults` — the
 * passage of the day of the Prophets and Writings) saved by src/core/push.ts.
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

// Safari refuses a page that the worker answers with a redirected response («Response served by service worker
// has redirections») and shows «the network connection was lost»: the same body as a plain response
const plain = (res) =>
  res.redirected ? res.blob().then((body) => new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers })) : res;

// no network and nothing saved: a small page instead of an empty answer (Safari shows that as a lost connection)
const OFFLINE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Нифлаот</title>
<body style="font-family:system-ui,sans-serif;text-align:center;padding:40px 16px;color:#141A33">
<p style="font-size:40px;margin:0">נ</p><p>Нет соединения с интернетом. · No internet connection. · Keine Internetverbindung.</p>
<p><a href="/" onclick="location.reload();return false" style="color:#2B4F95">Обновить · Reload · Neu laden</a></p></body>`;
const offline = (html) =>
  html ? new Response(OFFLINE, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }) : Response.error();

self.addEventListener('fetch', (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/__niflaot/')) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(plain)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(url.pathname, copy));
          }
          return res;
        })
        // offline: this page if it was opened before, else the app (it reads the address itself), else a note
        .catch(() => caches.match(url.pathname, ANY).then((r) => r || caches.match('/', ANY)).then((r) => r || offline(true))),
    );
    return;
  }
  if (url.pathname === '/daily-message.json') {
    e.respondWith(fetch(req).catch(() => caches.match(req, ANY).then((r) => r || offline(false))));
    return;
  }
  if (url.pathname.startsWith('/assets/')) {
    e.respondWith(
      caches.match(req, ANY).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy));
            }
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
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit || offline(false));
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

const ADULTS_FALLBACK = {
  ru: { title: 'Пророки и Писания', body: 'Отрывок дня ждёт вас на сайте.' },
  en: { title: 'Prophets and Writings', body: 'Today’s passage is waiting for you on the site.' },
  de: { title: 'Propheten und Schriften', body: 'Der Abschnitt des Tages wartet auf dich auf der Seite.' },
};

// «Мои слова»: words due for review today — a line under the adults' message (the review days come from src/core/push.ts)
const WORDS_LINE = {
  ru: 'Слова: повторить {n} — «Мои слова»',
  en: 'Words to review: {n} — “My words”',
  de: 'Wörter wiederholen: {n} — „Meine Wörter“',
};
// «После чего вы будете учиться?» (src/core/push.ts, ANCHORS): the first line of the message
const ANCHOR_LINE = {
  ru: { prayer: 'После утренней молитвы — время учиться', breakfast: 'После завтрака — время учиться', lunch: 'В обед — время учиться', school: 'После школы — время учиться', work: 'После работы — время учиться', dinner: 'После ужина — время учиться' },
  en: { prayer: 'After the morning prayer — time to learn', breakfast: 'After breakfast — time to learn', lunch: 'At lunch — time to learn', school: 'After school — time to learn', work: 'After work — time to learn', dinner: 'After dinner — time to learn' },
  de: { prayer: 'Nach dem Morgengebet — Zeit zum Lernen', breakfast: 'Nach dem Frühstück — Zeit zum Lernen', lunch: 'In der Mittagspause — Zeit zum Lernen', school: 'Nach der Schule — Zeit zum Lernen', work: 'Nach der Arbeit — Zeit zum Lernen', dinner: 'Nach dem Abendessen — Zeit zum Lernen' },
};
const dayNumber = () => {
  const d = new Date();
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
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

async function todaysMessage(lang, mode) {
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
  // the adults' mode: the passage of the day of the Prophets and Writings (src/core/dailyMessage.ts)
  const day = all?.days?.[localDate()];
  const m = (mode === 'adults' && day?.adults?.[lang]) || day?.[lang];
  if (m) return m;
  const adults = mode === 'adults';
  const f = (adults ? ADULTS_FALLBACK : FALLBACK)[lang] || FALLBACK.ru;
  return { title: f.title, body: f.body, url: `${location.origin}/?lang=${lang}&ref=push#/${adults ? 'neviim' : 'daily'}` };
}

self.addEventListener('push', (e) => {
  e.waitUntil(
    (async () => {
      const p = await prefs();
      const lang = ['ru', 'en', 'de'].includes(p.lang) ? p.lang : 'ru';
      const m = await todaysMessage(lang, p.mode);
      const due = p.mode === 'adults' && Array.isArray(p.wordsDue) ? p.wordsDue.filter((d) => d <= dayNumber()).length : 0;
      const anchor = ANCHOR_LINE[lang][p.anchor];
      const body = due ? `${m.body}\n${(WORDS_LINE[lang] || WORDS_LINE.ru).replace('{n}', due)}` : m.body;
      await self.registration.showNotification(m.title, {
        body: anchor ? `${anchor}\n${body}` : body,
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
