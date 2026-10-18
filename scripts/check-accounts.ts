/**
 * Checks of the optional account (part of `npm run check`): merging this device's progress with the account's
 * never loses a solved riddle or a «Гематрия дня» day (src/core/sync.ts), only the synced keys travel, and the
 * server's rules for emails and nicknames (assistant/src/rules.ts).
 */
import { mergeSnapshots, summarize } from '../src/core/sync';
import { methodsFor, validEmail, validNick } from '../assistant/src/rules';
import { sanitizeHtml } from '../src/core/sanitize';

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
const qz = mergeSnapshots(
  { 'niflaot:tanakh-quiz': JSON.stringify({ 'd1:neviim': { p: [0, 1, 0], best: 2, n: 3 }, 'd2:neviim': { p: [0, -1, -1], best: -1, n: 3 } }) },
  { 'niflaot:tanakh-quiz': JSON.stringify({ 'd1:neviim': { p: [0, 0, 0], best: 3, n: 3 }, 'd3:ketuvim': { p: [1, 1, 1], best: 0, n: 3 } }) },
);
const q = JSON.parse(qz['niflaot:tanakh-quiz'] ?? '{}');
if (q['d1:neviim']?.best !== 3 || !q['d2:neviim'] || !q['d3:ketuvim']) err('sync: «Вопросы к отрывку» — a day or the better result is lost');
const best = mergeSnapshots({ 'niflaot:lesson:a': JSON.stringify({ ...JSON.parse(lesson([0, 1], 20)), best: 40 }) }, { 'niflaot:lesson:a': lesson([0, 1, 2], 25) });
if (JSON.parse(best['niflaot:lesson:a']).best !== 40 || JSON.parse(best['niflaot:lesson:a']).done.length !== 3) err('sync: a lesson\'s best earlier score is lost');
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
  ['/progress', 'GET', true], ['/progress', 'PUT', true], ['/progress', 'POST', false],
  ['/leaders', 'GET', true], ['/class/join', 'POST', true], ['/class/abc_DEF-12', 'GET', true], ['/class/abc', 'POST', false],
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

console.log('✓ accounts: progress merge, synced keys, emails, nicknames, routes and methods; editor sanitizer');
