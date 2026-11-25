/**
 * «Три сокровища» (src/core/inviteRules.ts): the campaign window is in order and not on Shabbat, the categories of pages,
 * tickets, codes and device ids, the code rides only on the links a person shares, the server routes, and the texts in
 * every language.
 */
import { CAMPAIGN, CODE_RE, DEVICE_RE, NOMS, campaignDay, campaignShown, inCampaign, newCode, nomOf, ticketsOf } from '../src/core/inviteRules';
import { lessonLink, pageLink, routeLink, setInviteCode } from '../src/core/site';
import { methodsFor } from '../assistant/src/rules';
import ru from '../src/i18n/locales/ru';
import en from '../src/i18n/locales/en';
import de from '../src/i18n/locales/de';
import he from '../src/i18n/locales/he';

let bad = 0;
const ok = (c: unknown, m: string) => c || (console.error(`✗ invite: ${m}`), bad++);

const from = Date.parse(CAMPAIGN.from), to = Date.parse(CAMPAIGN.to), draw = Date.parse(CAMPAIGN.draw);
ok(from < to && to < draw, 'from < to < draw');
ok(!inCampaign(from - 1) && inCampaign(from) && inCampaign(to - 1) && !inCampaign(to), 'the window');
ok(campaignShown(from - 864e5) && campaignShown(draw + 864e5) && !campaignShown(draw + 3 * 864e5), 'shown in the account');
// the draw and the end are not on Shabbat (Vienna)
const wd = (ms: number) => new Intl.DateTimeFormat('en', { weekday: 'short', timeZone: 'Europe/Vienna' }).format(ms);
ok(wd(draw) !== 'Sat' && !(wd(to) === 'Fri' && new Date(to).getUTCHours() >= 13), 'not on Shabbat');
ok(campaignDay(Date.parse('2026-12-06T23:30:00Z')) === '2026-12-07', 'the day is Vienna time');

const cases: [string, string, string][] = [
  ['/', '#/neviim/2026-12-07', 'sources'],
  ['/', '#/', 'sources'],
  ['/09-baal-haturim-vayera/', '', 'sources'],
  ['/', '#/lashon', 'lashon'],
  ['/en/learn-hebrew/', '', 'lashon'],
  ['/', '#/words/12', 'lashon'],
  ['/', '#/reading/23', 'music'],
  ['/de/tehillim/', '', 'music'],
  ['/', '#/nigun/lubo', 'music'],
];
for (const [p, h, n] of cases) ok(nomOf(p, h) === n, `nomOf(${p}${h}) = ${nomOf(p, h)}, not ${n}`);
ok(ticketsOf({ friends: 3, active: 2 }) === 7, 'tickets 3 + 2×2');

for (let i = 0; i < 200; i++) ok(CODE_RE.test(newCode()), 'a new code fits CODE_RE');
ok(!CODE_RE.test('abc1l0') && !CODE_RE.test('ABCDEF'), 'confusable letters are not in codes');
ok(DEVICE_RE.test('a'.repeat(20)) && !DEVICE_RE.test('x'), 'device ids');

setInviteCode('abc234');
ok(routeLink('lashon', 'wa', 'ru').includes('ref=wa&r=abc234#/lashon'), 'the code in a shared route link');
ok(lessonLink('x', 'copy').endsWith('ref=copy&r=abc234'), 'the code in a shared lesson link');
ok(pageLink('daily', 'ru', 'tg').endsWith('r=abc234'), 'the code in a shared page link');
ok(!routeLink('x', 'qr').includes('r=abc') && !routeLink('x', 'channel').includes('r=abc') && !routeLink('x', 'push').includes('r=abc'), 'not in QR, channel and push links');
setInviteCode(null);
ok(!routeLink('x', 'wa').includes('&r='), 'no code — no r');

ok(methodsFor('/invite')?.includes('GET') && methodsFor('/invite/visit')?.includes('POST') && methodsFor('/invite/active')?.includes('POST') && methodsFor('/invite/board')?.includes('GET'), 'server routes');

const keys = Object.keys(ru).filter((k) => k.startsWith('inv.'));
ok(keys.length >= 15, 'texts');
for (const [l, m] of Object.entries({ en, de, he }) as [string, Record<string, string>][])
  for (const k of keys) ok(m[k], `${l}: ${k}`);
for (const n of NOMS) ok((ru as Record<string, string>)[`inv.nom.${n}`], `inv.nom.${n}`);

if (bad) process.exit(1);
console.log(`✓ invite: ${campaignDay(from)} – ${campaignDay(to)}, draw ${campaignDay(draw)}; ${NOMS.length} categories`);
