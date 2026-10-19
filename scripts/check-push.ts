/**
 * Checks of the daily reminder (part of `npm run check`): the VAPID signature of assistant/src/vapid.ts verifies
 * with its public key as JWS ES256; the server's rules (assistant/src/rules.ts) — local time, no notifications on
 * Shabbat, only real push services; the same hours on the site and on the server; public/sw.js has its build
 * placeholders.
 */
import { readFileSync } from 'node:fs';
import { makeVapidKeys, vapidAuth } from '../assistant/src/vapid';
import { PUSH_HOURS as SERVER_HOURS, localTime, restDay, validEndpoint, validTz } from '../assistant/src/rules';

const errors: string[] = [];
const err = (s: string) => errors.push(s);
const unb64 = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

// VAPID: header format, claims, signature
const keys = await makeVapidKeys();
const auth = await vapidAuth('https://fcm.googleapis.com/fcm/send/abc', keys, 'mailto:Office@mychitas.app', Date.parse('2026-10-11T10:00:00Z'));
const m = auth.match(/^vapid t=([\w-]+)\.([\w-]+)\.([\w-]+), k=([\w-]+)$/);
if (!m) err(`vapid: header «${auth.slice(0, 40)}…» has the wrong form`);
else {
  const [, h, b, sig, k] = m;
  const head = JSON.parse(new TextDecoder().decode(unb64(h)));
  const claims = JSON.parse(new TextDecoder().decode(unb64(b)));
  if (head.alg !== 'ES256') err('vapid: alg is not ES256');
  if (claims.aud !== 'https://fcm.googleapis.com') err(`vapid: aud ${claims.aud}`);
  if (claims.exp !== Date.parse('2026-10-11T22:00:00Z') / 1000) err('vapid: exp is not now + 12 h');
  if (unb64(k).length !== 65 || unb64(k)[0] !== 4) err('vapid: the public key is not a raw P-256 point');
  if (unb64(sig).length !== 64) err('vapid: the signature is not r‖s (64 bytes)');
  const pub = await crypto.subtle.importKey('raw', unb64(k), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, pub, unb64(sig), new TextEncoder().encode(`${h}.${b}`));
  if (!ok) err('vapid: the signature does not verify with the public key');
}

// local time and Shabbat (Vienna: UTC+2 in October)
const vienna = (iso: string) => localTime('Europe/Vienna', new Date(iso));
const cases: [string, boolean][] = [
  ['2026-10-15T15:00:00Z', false], // Thursday 17:00
  ['2026-10-16T08:30:00Z', false], // Friday 10:30
  ['2026-10-16T10:00:00Z', true], // Friday 12:00
  ['2026-10-17T05:00:00Z', true], // Shabbat 07:00
  ['2026-10-17T20:00:00Z', true], // Saturday 22:00
  ['2026-10-18T05:00:00Z', false], // Sunday 07:00
];
for (const [iso, rest] of cases) {
  const l = vienna(iso);
  if (restDay(l.weekday, l.hour) !== rest) err(`rules: ${iso} (Vienna ${l.date} ${l.hour}:00) — rest ${!rest} instead of ${rest}`);
}
if (vienna('2026-10-15T22:30:00Z').date !== '2026-10-16') err('rules: local date after midnight');
if (localTime('America/New_York', new Date('2026-10-16T02:00:00Z')).weekday !== 4) err('rules: weekday behind UTC');

for (const e of ['https://fcm.googleapis.com/fcm/send/x', 'https://updates.push.services.mozilla.com/wpush/v2/x', 'https://web.push.apple.com/x', 'https://wns2-par02p.notify.windows.com/w/?token=x'])
  if (!validEndpoint(e)) err(`rules: push service refused: ${e}`);
for (const e of ['http://fcm.googleapis.com/x', 'https://evil.com/fcm.googleapis.com', 'https://fcm.googleapis.com.evil.com/x', 'https://localhost/x', 42])
  if (validEndpoint(e)) err(`rules: not a push service accepted: ${e}`);
if (!validTz('Europe/Vienna') || validTz('Mars/Olympus') || validTz(5)) err('rules: time zone check');

// the site offers the hours the server accepts
const site = readFileSync('src/core/push.ts', 'utf8').match(/PUSH_HOURS = \[([^\]]+)\]/)?.[1].split(',').map(Number);
if (JSON.stringify(site) !== JSON.stringify(SERVER_HOURS)) err(`push hours: site ${site}, server ${SERVER_HOURS}`);

const sw = readFileSync('public/sw.js', 'utf8');
if (!sw.includes("/*__VERSION__*/ 'dev'") || !sw.includes('/*__PRECACHE__*/ []')) err('public/sw.js: no build placeholders');

// «После чего вы будете учиться?»: every anchor has an hour the server accepts and a first line in sw.js in every language
const anchors = Object.fromEntries(
  [...(readFileSync('src/core/push.ts', 'utf8').match(/ANCHORS = \{([^}]+)\}/)?.[1] ?? '').matchAll(/(\w+): (\d+)/g)].map((x) => [x[1], Number(x[2])]),
);
if (!Object.keys(anchors).length) err('push anchors: ANCHORS not found in src/core/push.ts');
for (const [a, h] of Object.entries(anchors)) {
  if (!(SERVER_HOURS as readonly number[]).includes(h)) err(`push anchor ${a}: hour ${h} is not one of the server's`);
  for (const lang of ['ru', 'en', 'de'])
    if (!new RegExp(`${lang}: \\{[^}]*\\b${a}: '`).test(sw)) err(`public/sw.js: ANCHOR_LINE.${lang}.${a} missing`);
}

// «Учёба каждый день» (src/core/habit.ts): Shabbat doesn't break the streak, a missed weekday does
const { habitStats } = await import('../src/core/habit');
const st = (days: string[], today: string) => habitStats(new Set(days), today);
// Thu 22.10, Fri 23.10, (Shabbat 24.10), Sun 25.10 — today Mon 26.10, not yet learnt
let hs = st(['2026-10-22', '2026-10-23', '2026-10-25'], '2026-10-26');
if (hs.streak !== 3 || hs.today || hs.back) err(`habit: streak over Shabbat ${JSON.stringify(hs)}`);
hs = st(['2026-10-22', '2026-10-23', '2026-10-25', '2026-10-26'], '2026-10-26');
if (hs.streak !== 4 || !hs.today || hs.best !== 4 || hs.total !== 4) err(`habit: today counted ${JSON.stringify(hs)}`);
// Tue 20.10 missed: the streak starts again on Wed
hs = st(['2026-10-19', '2026-10-21', '2026-10-22'], '2026-10-22');
if (hs.streak !== 2 || hs.best !== 2) err(`habit: a missed weekday breaks it ${JSON.stringify(hs)}`);
hs = st(['2026-10-19'], '2026-10-22');
if (hs.streak !== 0 || !hs.back || hs.repair) err(`habit: two missed days break it ${JSON.stringify(hs)}`);
// «Восполнить»: one missed weekday after a streak — made up, the streak goes on; two missed — not; once in 30 days
hs = st(['2026-10-15', '2026-10-16', '2026-10-18'], '2026-10-20');
if (hs.repair?.day !== '2026-10-19' || hs.repair.streak !== 4) err(`habit: repair over Shabbat ${JSON.stringify(hs)}`);
hs = st(['2026-10-15', '2026-10-16'], '2026-10-21');
if (hs.repair || !hs.back) err(`habit: two missed days are not made up ${JSON.stringify(hs)}`);
if (habitStats(new Set(['2026-10-18']), '2026-10-20', 1).repair) err('habit: a second repair within 30 days');
hs = st(['2026-10-01'], '2026-10-22');
if (hs.repair || !hs.back) err(`habit: «С возвращением» ${JSON.stringify(hs)}`);

if (errors.length) {
  console.error(errors.map((e) => '✗ ' + e).join('\n'));
  process.exit(1);
}
console.log('✓ daily reminder: VAPID signature, Shabbat rules, push services, hours, anchors, service worker, study streak');
