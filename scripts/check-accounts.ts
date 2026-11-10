/**
 * Checks of the optional account (part of `npm run check`): merging this device's progress with the account's
 * never loses a solved riddle or a «Гематрия дня» day (src/core/sync.ts), only the synced keys travel, and the
 * server's rules for emails and nicknames (assistant/src/rules.ts).
 */
import { mergeSnapshots, summarize, SYNC_KEYS } from '../src/core/sync';
import { readFileSync } from 'node:fs';
import { methodsFor, validEmail, validNick } from '../assistant/src/rules';
import { sanitizeHtml } from '../src/core/sanitize';
import { verifyGoogleToken } from '../assistant/src/google';

const errors: string[] = [];
const err = (s: string) => errors.push(s);
const lesson = (done: number[], score: number) => JSON.stringify({ lvl: 0, score, done, st: { '0-0': { ok: true } }, open: {}, time: [], started: [], ord: {}, notes: {}, puz: {} });

const local = {
  'niflaot:lesson:a': lesson([0, 1], 20),
  'niflaot:lesson:b': lesson([0], 10),
  'niflaot:daily': JSON.stringify({ 1: { wrong: [], done: 'win' }, 3: { wrong: [5] } }),
  'niflaot:lang': 'de',
  'niflaot:admin-token': 'secret',
};
const remote = {
  'niflaot:lesson:a': lesson([0], 30),
  'niflaot:lesson:b': lesson([0, 1, 2], 15),
  'niflaot:lesson:c': lesson([0], 5),
  'niflaot:daily': JSON.stringify({ 2: { wrong: [], done: 'win' }, 3: { wrong: [5, 7], done: 'lose' } }),
  'niflaot:lang': 'ru',
};
const m = mergeSnapshots(local, remote);
const done = (k: string) => JSON.parse(m[k]).done.length;
if (done('niflaot:lesson:a') !== 2) err('sync: the lesson with more riddles solved must win (this device)');
if (done('niflaot:lesson:b') !== 3) err('sync: the lesson with more riddles solved must win (the account)');
if (!m['niflaot:lesson:c']) err('sync: a lesson only in the account is lost');
const daily = JSON.parse(m['niflaot:daily']);
if (!daily[1] || !daily[2]) err('sync: a «Гематрия дня» day is lost');
if (daily[3]?.done !== 'lose') err('sync: a finished day must win over an unfinished one');
if (m['niflaot:lang'] !== 'de') err('sync: this device\'s settings must win');
if ('niflaot:admin-token' in m) err('sync: a key that must stay on the device travels (admin token)');
if (JSON.stringify(mergeSnapshots(m, m)) !== JSON.stringify(m)) err('sync: merging a copy with itself changes it');
// every synced key is kept by the server (assistant/src/accounts.ts — the allowlist of keys)
{
  const src = readFileSync(new URL('../assistant/src/accounts.ts', import.meta.url), 'utf8');
  const re = /\/\^niflaot:\((lesson:[^/]+)\)\$\/\.test\(k\)/.exec(src);
  if (!re) err('sync: the server allowlist of keys is not found');
  else {
    const allow = new RegExp(`^niflaot:(${re[1]})$`);
    for (const k of SYNC_KEYS) if (!allow.test(k)) err(`sync: the server drops ${k}`);
  }
}
// «Лоскуты гематрии»: the copy with more boards leads, best times — the faster
{
  const pm = JSON.parse(
    mergeSnapshots({ 'niflaot:patches': JSON.stringify({ l: 3, g: 5, b: { 1: 40, 2: 90 }, w: '2026-11-09' }) }, { 'niflaot:patches': JSON.stringify({ l: 6, g: 9, b: { 2: 70, 5: 200 } }) })['niflaot:patches'],
  );
  if (pm.l !== 6 || pm.g !== 9 || pm.b[1] !== 40 || pm.b[2] !== 70 || pm.b[5] !== 200 || pm.w !== '2026-11-09') err(`sync: patches merge ${JSON.stringify(pm)}`);
}
const qz = mergeSnapshots(
  { 'niflaot:tanakh-quiz': JSON.stringify({ 'd1:neviim': { p: [0, 1, 0], best: 2, n: 3 }, 'd2:neviim': { p: [0, -1, -1], best: -1, n: 3 } }) },
  { 'niflaot:tanakh-quiz': JSON.stringify({ 'd1:neviim': { p: [0, 0, 0], best: 3, n: 3 }, 'd3:ketuvim': { p: [1, 1, 1], best: 0, n: 3 } }) },
);
const q = JSON.parse(qz['niflaot:tanakh-quiz'] ?? '{}');
if (q['d1:neviim']?.best !== 3 || !q['d2:neviim'] || !q['d3:ketuvim']) err('sync: «Вопросы к отрывку» — a day or the better result is lost');
const best = mergeSnapshots({ 'niflaot:lesson:a': JSON.stringify({ ...JSON.parse(lesson([0, 1], 20)), best: 40 }) }, { 'niflaot:lesson:a': lesson([0, 1, 2], 25) });
if (JSON.parse(best['niflaot:lesson:a']).best !== 40 || JSON.parse(best['niflaot:lesson:a']).done.length !== 3) err('sync: a lesson\'s best earlier score is lost');
// «Мои закладки»: every verse from both; the same verse — the later change (a removal reaches the other device)
const nt = JSON.parse(
  mergeSnapshots(
    { 'niflaot:notes': JSON.stringify({ 'psalms 16:7': { t: 300, m: 1, n: 'почки', d: '2026-11-01', s: 'ketuvim', x: '' }, 'joshua 1:8': { t: 100, m: 1, n: '', d: '2026-10-11', s: 'neviim', x: '' } }) },
    { 'niflaot:notes': JSON.stringify({ 'psalms 16:7': { t: 200, m: 0, n: '', d: '2026-11-01', s: 'ketuvim', x: '' }, 'joshua 1:8': { t: 400, m: 0, n: '', d: '2026-10-11', s: 'neviim', x: '' }, 'psalms 1:1': { t: 50, m: 1, n: '', d: '2026-10-11', s: 'ketuvim', x: '' } }) },
  )['niflaot:notes'] ?? '{}',
);
if (nt['psalms 16:7']?.n !== 'почки' || nt['joshua 1:8']?.m !== 0 || !nt['psalms 1:1']) err('sync: «Мои закладки» — a verse, a note or a removal is lost');
// «Мои слова»: the later change of a word wins; an early number entry (only «Знаю») reads as known (box 3) / removed (box 0)
const wd = mergeSnapshots(
  { 'niflaot:words': JSON.stringify({ '1961': [200, 4, 30], '559': [100, 1, 10], '853': 150 }) },
  { 'niflaot:words': JSON.stringify({ '1961': [100, 1, 5], '559': [300, 0, 0], '3808': [50, 2, 7], '853': -120 }) },
);
const w = JSON.parse(wd['niflaot:words'] ?? '{}');
if (w['1961']?.[1] !== 4 || w['559']?.[1] !== 0 || w['3808']?.[1] !== 2 || w['853']?.[1] !== 3) err(`sync: «Мои слова» — ${JSON.stringify(w)}`);
const s = summarize(m, 4);
if (s.solved !== 6 || s.points !== 20 + 15 + 5 || s.days !== 2 || s.streak !== 4 || s.lessons.b !== 3) err(`sync: summary ${JSON.stringify(s)}`);

for (const e of ['a@b.co', 'roman.g@mychitas.app']) if (!validEmail(e)) err(`accounts: email refused: ${e}`);
for (const e of ['a@b', 'a b@c.de', '@c.de', 'x'.repeat(250) + '@a.de']) if (validEmail(e)) err(`accounts: bad email accepted: ${e}`);
for (const n of ['Мойше', 'tzadik_7', 'Leah K', 'דוד123']) if (!validNick(n)) err(`accounts: nickname refused: ${n}`);
for (const n of ['ab', '12345', ' lead', 'x'.repeat(21), '<script>', 'a@b']) if (validNick(n)) err(`accounts: bad nickname accepted: ${n}`);

// «Войти через Google»: a token signed by our own test key — accepted only when everything holds
{
  const pair = (await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true, ['sign', 'verify'],
  )) as CryptoKeyPair;
  const jwk = { ...(await crypto.subtle.exportKey('jwk', pair.publicKey)), kid: 'k1' };
  const b64 = (s: string | Uint8Array) =>
    Buffer.from(typeof s === 'string' ? s : s).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const now = 1_800_000_000;
  const good = { iss: 'https://accounts.google.com', aud: 'cid', exp: now + 600, iat: now, email: 'A@Example.com', email_verified: true, nonce: 'n1' };
  const sign = async (c: object, kid = 'k1') => {
    const head = `${b64(JSON.stringify({ alg: 'RS256', kid }))}.${b64(JSON.stringify(c))}`;
    const sig = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(head)));
    return `${head}.${b64(sig)}`;
  };
  const check = (t: string, nonce = 'n1') => verifyGoogleToken(t, { clientId: 'cid', nonce, keys: [jwk], now });
  const ok = await check(await sign(good));
  if (!ok.ok || ok.email !== 'a@example.com') err(`google: a valid token must sign in a@example.com: ${JSON.stringify(ok)}`);
  const bad: [string, string][] = [
    ['aud', await sign({ ...good, aud: 'other' })],
    ['iss', await sign({ ...good, iss: 'https://evil.example' })],
    ['expired', await sign({ ...good, exp: now - 3600 })],
    ['email', await sign({ ...good, email_verified: false })],
    ['key', await sign(good, 'k2')],
    ['signature', (await sign(good)).replace(/\.[^.]+\./, `.${b64(JSON.stringify({ ...good, email: 'x@evil.example' }))}.`)],
  ];
  for (const [why, t] of bad) {
    const r = await check(t);
    if (r.ok || r.error !== why) err(`google: a token with a wrong ${why} must be refused: ${JSON.stringify(r)}`);
  }
  const n = await check(await sign(good), 'n2');
  if (n.ok || n.error !== 'nonce') err('google: a token for another sign-in (nonce) must be refused');
  if (!methodsFor('/google')?.includes('POST')) err('accounts: POST /google must be allowed');
}

if (errors.length) {
  console.error(errors.map((e) => '✗ ' + e).join('\n'));
  process.exit(1);
}
// every account route takes only its own methods (assistant/src/rules.ts → 405 otherwise)
const routes: [string, string, boolean][] = [
  ['/config', 'GET', true], ['/config', 'POST', false],
  ['/profile', 'POST', true], ['/profile', 'GET', false],
  ['/logout', 'POST', true], ['/logout', 'GET', false],
  ['/delete', 'POST', true], ['/delete', 'GET', false], ['/delete', 'DELETE', false],
  ['/consent', 'POST', true], ['/consent', 'GET', false],
  ['/newsletter/code', 'POST', true], ['/newsletter/code', 'GET', false],
  ['/newsletter/confirm', 'POST', true], ['/newsletter/confirm', 'GET', false],
  ['/newsletter/unsubscribe', 'POST', true], ['/newsletter/unsubscribe', 'GET', false],
  ['/newsletter/deliver', 'POST', true], ['/newsletter/deliver', 'GET', false],
  ['/progress', 'GET', true], ['/progress', 'PUT', true], ['/progress', 'POST', false],
  ['/leaders', 'GET', true], ['/stats', 'GET', true], ['/stats', 'POST', false], ['/class/join', 'POST', true], ['/class/abc_DEF-12', 'GET', true], ['/class/abc', 'POST', false],
];
for (const [path, method, ok] of routes)
  if ((methodsFor(path)?.includes(method) ?? false) !== ok) err(`accounts: ${method} ${path} must be ${ok ? 'allowed' : 'refused'}`);
for (const path of ['/nope', '/class/', '/class/a/b', '/class/../me']) if (methodsFor(path)) err(`accounts: ${path} must be 404`);

// the editor's sanitizer (src/core/sanitize.ts): what an XSS needs never survives it, the site's own markup does
const evil = [
  '<img src=x onerror=alert(1)>', '<a href="javascript:alert(1)">x</a>', '<a href="jav&#x09;ascript:alert(1)">x</a>',
  '<a href="&#106;avascript:alert(1)">x</a>', '<a href=" JAVASCRIPT:1">x</a>', '<a href="data:text/html,1">x</a>',
  '<p onclick="x">t</p>', '<p class="x"onmouseover=1>t</p>', '<script>alert(1)</script>', '<svg><script>1</script></svg>',
  '<scr<script>ipt>alert(1)</script>', '<iframe src="https://x"></iframe>', '<b style="background:url(x)">b</b>',
  '<a href="vbscript:1">x</a>', '<math><mtext><a href="javascript:1">x</a></mtext></math>', '<!--<img src=x onerror=1>-->',
];
for (const e of evil) {
  const s = sanitizeHtml(e);
  if (/<(script|iframe|img|svg|math|style)\b|\son[a-z]+\s*=|style\s*=|(javascript|vbscript|data):/i.test(s)) err(`sanitize: ${e} → ${s}`);
}
const fine = '<p class="expl" dir="rtl" lang="he"><b>Пояснение.</b> <span class="he">א</span><sup data-src="bht-1"></sup> <a href="#/privacy">x</a> <a href="https://www.neirot.com" target="_blank" rel="noopener">y</a></p>';
if (sanitizeHtml(fine) !== fine) err(`sanitize: the site's own markup must stay: ${sanitizeHtml(fine)}`);

console.log('✓ accounts: Google sign-in token, progress merge, synced keys, emails, nicknames, routes and methods; editor sanitizer');
