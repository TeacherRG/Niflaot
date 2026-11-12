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
  // «Тайна Коэлета» (koelet/) — its own files, music and pictures: not cached, the browser fetches them
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/__niflaot/') || url.pathname.startsWith('/koelet/')) return;
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
// «Zip — стих Торы» (src/core/zip.ts): to those who play it and haven't solved today's verse — a line under the message
const ZIP_LINE = {
  ru: 'Zip — стих Торы: новый стих ждёт · уровень {n}',
  en: 'Zip — a Torah verse: a new verse is waiting · level {n}',
  de: 'Zip — ein Vers der Tora: ein neuer Vers wartet · Stufe {n}',
};
// «После чего вы будете учиться?» (src/core/push.ts, ANCHORS): the first line of the message
const ANCHOR_LINE = {
  ru: { prayer: 'После утренней молитвы — время учиться', breakfast: 'После завтрака — время учиться', lunch: 'В обед — время учиться', school: 'После школы — время учиться', work: 'После работы — время учиться', dinner: 'После ужина — время учиться' },
  en: { prayer: 'After the morning prayer — time to learn', breakfast: 'After breakfast — time to learn', lunch: 'At lunch — time to learn', school: 'After school — time to learn', work: 'After work — time to learn', dinner: 'After dinner — time to learn' },
  de: { prayer: 'Nach dem Morgengebet — Zeit zum Lernen', breakfast: 'Nach dem Frühstück — Zeit zum Lernen', lunch: 'In der Mittagspause — Zeit zum Lernen', school: 'Nach der Schule — Zeit zum Lernen', work: 'Nach der Arbeit — Zeit zum Lernen', dinner: 'Nach dem Abendessen — Zeit zum Lernen' },
};
// The first line — the hook (owner, 10.11.2026: «короткие мотивационные сообщения — учись каждый Б-жий день»):
// studied today — praise and the streak; a streak still alive — «don't break it»; otherwise — a motto of the day, in turn.
// The streak comes from src/core/push.ts (`study`: s — days in a row through the day d, keep — the last day that continues it).
const STREAK_LINE = {
  ru: { done: '✓ Сегодня вы уже учились · серия {n} 🔥 Ещё минутку?', keep: '🔥 {n} дн. подряд — не прервите серию сегодня!', first: '🔥 Вчера начали — сегодня второй день серии!' },
  en: { done: '✓ You already learned today · streak {n} 🔥 One more minute?', keep: '🔥 {n} days in a row — keep your streak today!', first: '🔥 You started yesterday — make today day two!' },
  de: { done: '✓ Heute hast du schon gelernt · Serie {n} 🔥 Noch eine Minute?', keep: '🔥 {n} Tage am Stück — halte deine Serie heute!', first: '🔥 Gestern angefangen — heute ist Tag zwei!' },
};
const MOTTO = {
  ru: [
    'Учитесь каждый Б-жий день — хоть одну минуту.',
    'Одна минута Торы — и день уже другой.',
    'Капля за каплей камень точит — слово за словом учит.',
    'Сделайте Тору постоянной (Авот 1:15) — начните с минуты.',
    'Сегодняшний день не повторится — выучите в нём что-то новое.',
    'Маленький шаг каждый день сильнее большого раз в месяц.',
    'Тора ждёт вас — пять минут, и вы на шаг ближе.',
    '«И повторяй их детям твоим, и говори о них» — начните с себя.',
    'Не «когда будет время», а сейчас: одна загадка.',
    'Каждый день — новая буква, новое слово, новое чудо.',
    'Учиться можно в автобусе, в очереди, за чаем.',
    'Кто учится каждый день — тот растёт каждый день.',
  ],
  en: [
    'Learn every single day — even just one minute.',
    'One minute of Torah — and the day is different.',
    'Drop by drop the stone wears away — word by word you learn.',
    'Make your Torah study fixed (Avot 1:15) — start with a minute.',
    'Today won’t come again — learn something new in it.',
    'A small step every day beats a big one once a month.',
    'The Torah is waiting — five minutes, one step closer.',
    '“Teach them to your children and speak of them” — start with yourself.',
    'Not “when I have time” — now: one riddle.',
    'Every day — a new letter, a new word, a new wonder.',
    'You can learn on the bus, in a queue, over tea.',
    'Learn every day — grow every day.',
  ],
  de: [
    'Lerne jeden Tag — und sei es nur eine Minute.',
    'Eine Minute Tora — und der Tag ist ein anderer.',
    'Tropfen für Tropfen höhlt den Stein — Wort für Wort lernst du.',
    'Mach dein Tora-Lernen fest (Awot 1,15) — fang mit einer Minute an.',
    'Heute kommt nicht wieder — lerne heute etwas Neues.',
    'Ein kleiner Schritt jeden Tag ist mehr als ein großer einmal im Monat.',
    'Die Tora wartet — fünf Minuten, ein Schritt näher.',
    '„Schärfe sie deinen Kindern ein und rede von ihnen“ — fang bei dir an.',
    'Nicht „wenn ich Zeit habe“ — jetzt: ein Rätsel.',
    'Jeden Tag — ein neuer Buchstabe, ein neues Wort, ein neues Wunder.',
    'Lernen geht im Bus, in der Schlange, beim Tee.',
    'Wer jeden Tag lernt, wächst jeden Tag.',
  ],
};
/** the hook line: `st` — the streak from the site (src/core/habit.ts, streakForReminder), `today` — the device's date */
function hookLine(lang, st, today, n) {
  const L = STREAK_LINE[lang] || STREAK_LINE.ru;
  if (st && typeof st.d === 'string') {
    if (st.d === today && st.s > 0) return L.done.replace('{n}', st.s);
    if (st.d < today && today <= st.keep) {
      if (st.s >= 2) return L.keep.replace('{n}', st.s);
      if (st.s === 1) return L.first;
    }
  }
  const m = MOTTO[lang] || MOTTO.ru;
  return m[n % m.length];
}
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
      // «учу» — все, что пора; «знаю» — не больше 25 в день (DAILY_KNOWN в src/core/words.ts)
      const dueOf = (a) => (Array.isArray(a) ? a.filter((d) => d <= dayNumber()).length : 0);
      const due = p.mode === 'adults' ? dueOf(p.wordsDue) + Math.min(25, dueOf(p.wordsKnownDue)) : 0;
      // already learnt today — no «время учиться»: the praise alone
      const anchor = p.study?.d === localDate() ? undefined : ANCHOR_LINE[lang][p.anchor];
      const hook = hookLine(lang, p.study, localDate(), dayNumber());
      let body = due ? `${m.body}\n${(WORDS_LINE[lang] || WORDS_LINE.ru).replace('{n}', due)}` : m.body;
      if (p.zip && p.zip.w !== localDate()) body += `\n${(ZIP_LINE[lang] || ZIP_LINE.ru).replace('{n}', p.zip.l)}`;
      await self.registration.showNotification(m.title, {
        body: [hook, anchor, body].filter(Boolean).join('\n'),
        lang,
        icon: '/icons/icon-192.png?v=3',
        badge: '/icons/icon-192.png?v=3',
        tag: 'niflaot-daily',
        data: { url: m.url },
      });
    })(),
  );
});

/**
 * The browser replaced the push subscription (it expired, was renewed, or the app was reinstalled): subscribe again and
 * tell the server the new address — with the hour, time zone and language saved by src/core/push.ts (`savePrefs`).
 * Without it the server kept pushing to the dead address and the reminder stopped silently. The page also repairs it
 * on the next visit (`syncPush`).
 */
self.addEventListener('pushsubscriptionchange', (e) => {
  e.waitUntil(
    (async () => {
      const p = await prefs();
      if (!p.api || !p.hour) return;
      const b64 = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
      let sub = e.newSubscription || (await self.registration.pushManager.getSubscription());
      if (!sub) {
        let key = e.oldSubscription?.options?.applicationServerKey;
        if (!key) key = b64(p.key || (await (await fetch(`${p.api}/push/key`)).json()).key);
        sub = await self.registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key });
      }
      const post = (path, body) =>
        fetch(`${p.api}/push/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const old = e.oldSubscription?.endpoint;
      if (old && old !== sub.endpoint) await post('unsubscribe', { endpoint: old }).catch(() => {});
      const lang = ['ru', 'en', 'de'].includes(p.lang) ? p.lang : 'ru';
      await post('subscribe', { subscription: sub.toJSON(), tz: p.tz || 'UTC', hour: p.hour, lang });
    })().catch(() => {}),
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      // a tab of the site is open: take it there; a tab this worker doesn't control can't be navigated (navigate()
      // rejects) — then a new window, so the tap never does nothing
      const open = list.find((c) => new URL(c.url).origin === location.origin && 'navigate' in c);
      if (open)
        return open
          .navigate(url)
          .then((c) => (c || open).focus())
          .catch(() => self.clients.openWindow(url));
      return self.clients.openWindow(url);
    }),
  );
});
