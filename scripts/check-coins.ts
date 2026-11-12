/**
 * «Pelecoin» (src/core/coinsRules.ts): rewards are given once, the reading cap, the chest of the 7th day, «маасер»,
 * gifts and purchases never overdraw, two devices merge without doubling, old days fold to totals, the common box
 * fills round by round; the texts exist in every language and the numbers of the «Свитки мудрости» are right.
 */
import { addChest, addEarn, balance, buy, CAUSES, chestDue, earnedTotal, fold, give, givenTotal, ITEMS, maaserDue, maaserKept, mergeCoinStores, normCoins, PUSHKA_TARGET, pushkaAdd, READ_CAP, readsOn, REWARD, winningCause, type CoinStore } from '../src/core/coinsRules';
import { gematria } from '../src/core/gematria';
import { mergeSnapshots, SYNC_KEYS } from '../src/core/sync';
import ru from '../src/i18n/locales/ru';
import en from '../src/i18n/locales/en';
import de from '../src/i18n/locales/de';
import he from '../src/i18n/locales/he';

let bad = 0;
const err = (m: string) => (console.error(`✗ coins: ${m}`), bad++);
const ok = (c: unknown, m: string) => c || err(m);
const D = '2026-11-12';
let s: CoinStore = normCoins(null);
const earn = (kind: 'read' | 'answer', id: string, day = D) => {
  const r = addEarn(s, kind, id, day);
  if (r) s = r.store;
  return r?.gained ?? 0;
};

ok(earn('answer', 'q1') === REWARD.answer && earn('answer', 'q1') === 0, 'an answer is rewarded once');
ok(earn('read', 'q1') === REWARD.read, 'a passage and an answer with the same id are different rewards');
for (let i = 0; i < READ_CAP + 3; i++) earn('read', `p${i}`);
ok(readsOn(s, D) === READ_CAP, `not more than ${READ_CAP} readings a day`);
ok(earn('read', 'next', '2026-11-13') === REWARD.read, 'the reading cap is per day');
ok(balance(s) === earnedTotal(s) && earnedTotal(s) === REWARD.answer + (READ_CAP + 1) * REWARD.read, 'the balance is the sum of the rewards');

// the chest
ok(!chestDue(s, 6, true, D) && !chestDue(s, 7, false, D) && chestDue(s, 7, true, D) && chestDue(s, 14, true, D) && !chestDue(s, 8, true, D), 'the chest: every 7th day of the streak, studied today');
const withChest = addChest(s, D);
ok(earnedTotal(withChest) === earnedTotal(s) + REWARD.chest && !chestDue(withChest, 7, true, D) && !chestDue(withChest, 7, true, '2026-11-15') && chestDue(withChest, 14, true, '2026-11-19'), 'one chest a week');

// gifts, «маасер», purchases
ok(!give(s, 0, 'books', 'a', D) && !give(s, balance(s) + 1, 'books', 'a', D) && !give(s, 1.5, 'books', 'a', D), 'a gift: a whole number, not more than the balance');
ok(!maaserKept(s) && maaserDue(s) === 1, 'the tenth of 9 coins is 1');
s = give(s, maaserDue(s), 'books', 'g1', D)!;
ok(maaserKept(s) && givenTotal(s) === 1 && maaserDue(s) === 0, 'the tenth is given');
const before = earnedTotal(s);
const dbl = addEarn(s, 'answer', 'q2', '2026-11-14')!;
ok(dbl.doubled && dbl.gained === 2 * REWARD.answer && earnedTotal(dbl.store) === before + 2 * REWARD.answer, 'with the tenth given the first reward of a day is doubled');
const second = addEarn(dbl.store, 'answer', 'q3', '2026-11-14');
ok(second && !second.doubled, 'only the first reward of the day is doubled');
ok(!buy(s, 'pushka'), 'a scroll costs more than the balance: not sold');
let rich = normCoins({ d: { [D]: [100] }, g: {}, i: {} });
rich = buy(rich, 'chai')!;
ok(rich && balance(rich) === 100 - 18 && !buy(rich, 'chai'), 'a scroll is bought once');

// two devices
const a = addEarn(addEarn(normCoins(null), 'answer', 'x', D)!.store, 'read', 'y', D)!.store;
const b = addEarn(addEarn(normCoins(null), 'answer', 'x', D)!.store, 'answer', 'z', D)!.store;
const m = mergeCoinStores(a, b);
ok(earnedTotal(m) === 2 * REWARD.answer + REWARD.read, 'the same reward on two devices is counted once');
ok(JSON.stringify(mergeCoinStores(m, a)) === JSON.stringify(m) && earnedTotal(mergeCoinStores(b, a)) === earnedTotal(m), 'the merge is stable');
const old = fold(normCoins({ d: { '2026-01-01': [4, { 'a:x': 3, 'r:y': 1 }], [D]: [3, { 'a:k': 3 }] }, g: {}, i: {} }), D);
ok(!old.d['2026-01-01'][1] && old.d['2026-01-01'][0] === 4 && !!old.d[D][1], 'old days keep only their total');
ok(earnedTotal(mergeCoinStores(old, normCoins({ d: { '2026-01-01': [4, { 'a:x': 3, 'r:y': 1 }] }, g: {}, i: {} }))) === 7, 'a folded day merges with an unfolded one without doubling');
ok(balance(normCoins({ d: { [D]: [5] }, g: { [D]: [5] }, i: { chai: 18 } })) === 0, 'the balance is never negative');
ok(earnedTotal(normCoins({ d: { [D]: [999, { 'a:x': 3 }], bad: [5], '2026-11-11': ['7'] }, g: 5 })) === 3, 'a broken store is read safely: the total is the sum of the ids');

// the account keeps the coins
ok(SYNC_KEYS.includes('niflaot:coins'), 'niflaot:coins is synced');
const snap = mergeSnapshots({ 'niflaot:coins': JSON.stringify(a) }, { 'niflaot:coins': JSON.stringify(b) });
ok(earnedTotal(normCoins(JSON.parse(snap['niflaot:coins']))) === earnedTotal(m), 'the account merges the coins of two devices');

// the common box
ok(JSON.stringify(pushkaAdd(9990, 25)) === JSON.stringify({ coins: 15, filled: 1 }) && pushkaAdd(0, 500).filled === 0 && pushkaAdd(PUSHKA_TARGET - 1, 1).filled === 1, 'the box: a round is filled at the target, the rest goes on');
ok(winningCause({ books: 5, trees: 9 }) === 'trees' && winningCause({}) === CAUSES[0], 'the cause with the most coins wins');

// the texts
ok(gematria('יוי') === 26 && gematria('חי') === 18, 'the numbers of the scrolls');
const keys = Object.keys(ru).filter((k) => k.startsWith('coins.'));
for (const k of [...CAUSES.map((c) => `coins.cause.${c}`), ...ITEMS.flatMap((i) => [`coins.item.${i.id}.t`, `coins.item.${i.id}.b`])]) ok(keys.includes(k), `no text ${k}`);
for (const [lang, msgs] of Object.entries({ en, de, he }) as [string, Record<string, unknown>][])
  for (const k of keys) {
    const v = msgs[k];
    if (typeof v !== 'string' || !v) err(`${lang}: no text ${k}`);
    else for (const ph of String((ru as Record<string, unknown>)[k]).match(/\{\w+\}/g) ?? []) ok(v.includes(ph), `${lang}: ${k} lost ${ph}`);
  }
for (const k of keys) if (/Бог|Господ|\bGod\b|\bGott\b|\bLord\b/.test(`${(ru as any)[k]}${(en as any)[k]}${(de as any)[k]}`)) err(`${k}: a Name written in full`);

if (bad) process.exit(1);
console.log(`✓ Pelecoin: ${keys.length} texts in 4 languages, the rules of rewards, gifts, the merge and the common box`);
