/**
 * «Pelecoin» — the rules of the game coins, pure functions on plain objects (the site — src/core/coins.ts, the server —
 * assistant/src/accounts.ts, the check — scripts/check-coins.ts).
 *
 * Coins are earned by study: +1 for a passage read («Я прочитал(а)», each passage once, not more than READ_CAP a day),
 * +3 for a right answer / a riddle or a game solved (each once), +10 — the chest of every 7th day of the study streak
 * (src/core/habit.ts: Shabbat and holidays don't break it). «Маасер»: whoever has given a tenth of everything earned to
 * the common tzedakah box gets the first reward of the day doubled.
 * Coins are spent on the «Свитки мудрости» of the shop and given to the common box («Пушка»): all players fill one
 * box, PUSHKA_TARGET coins a round.
 *
 * localStorage `niflaot:coins` = { d: earned, g: given, i: { item: cost } }; `d` and `g` are ledgers
 * { "YYYY-MM-DD": [total of the day, { id: coins }?] } — the ids of a day are kept KEEP_DAYS days (an id is rewarded
 * once), then only the total stays, so the store stays small (the account keeps 256 KB for everything).
 */

export const REWARD = { read: 1, answer: 3, chest: 10 } as const;
export type EarnKind = 'read' | 'answer';
export const READ_CAP = 5;
export const CHEST_DAYS = 7;
export const KEEP_DAYS = 45;
export const PUSHKA_TARGET = 10_000;
/** one gift to the box: 1 … GIFT_MAX coins; the server takes not more than GIFT_DAY from an account a day */
export const GIFT_MAX = 500;
export const GIFT_DAY = 1000;
export const CAUSES = ['shabbat', 'books', 'trees'] as const;
export type Cause = (typeof CAUSES)[number];
export const isCause = (c: unknown): c is Cause => CAUSES.includes(c as Cause);

/** the «Свитки мудрости» of the shop: bought once, the text — `coins.item.<id>.*` */
export const ITEMS = [
  { id: 'alef', cost: 15, he: 'א' },
  { id: 'chai', cost: 18, he: 'חי' },
  { id: 'pushka', cost: 25, he: 'צדקה' },
] as const;
export type ItemId = (typeof ITEMS)[number]['id'];

export type Ledger = Record<string, [number, Record<string, number>?]>;
export interface CoinStore {
  d: Ledger;
  g: Ledger;
  i: Record<string, number>;
}

const num = (x: unknown) => (Number.isFinite(x) && (x as number) > 0 ? Math.floor(x as number) : 0);
const DAY = /^\d{4}-\d\d-\d\d$/;

function normLedger(raw: unknown): Ledger {
  const out: Ledger = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [day, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!DAY.test(day) || !Array.isArray(v)) continue;
    const ids = v[1] && typeof v[1] === 'object' ? Object.fromEntries(Object.entries(v[1] as Record<string, unknown>).map(([k, n]) => [k, num(n)]).filter(([, n]) => n)) : undefined;
    const total = ids ? Object.values<number>(ids).reduce((a, n) => a + n, 0) : num(v[0]);
    if (total) out[day] = ids ? [total, ids] : [total];
  }
  return out;
}
export function normCoins(raw: unknown): CoinStore {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const i: Record<string, number> = {};
  if (r.i && typeof r.i === 'object') for (const [k, n] of Object.entries(r.i as Record<string, unknown>)) if (num(n)) i[k] = num(n);
  return { d: normLedger(r.d), g: normLedger(r.g), i };
}

const sum = (l: Ledger) => Object.values(l).reduce((a, [n]) => a + n, 0);
export const earnedTotal = (s: CoinStore) => sum(s.d);
export const givenTotal = (s: CoinStore) => sum(s.g);
export const spentTotal = (s: CoinStore) => Object.values(s.i).reduce((a, n) => a + n, 0);
/** never below 0 (two devices could each spend the same coins before they met) */
export const balance = (s: CoinStore) => Math.max(0, earnedTotal(s) - givenTotal(s) - spentTotal(s));
export const earnedOn = (s: CoinStore, day: string) => s.d[day]?.[0] ?? 0;
export const readsOn = (s: CoinStore, day: string) => Object.keys(s.d[day]?.[1] ?? {}).filter((k) => k.startsWith('r:')).length;
const has = (l: Ledger, id: string) => Object.values(l).some(([, ids]) => ids && id in ids);

const addDays = (day: string, n: number) => {
  const d = new Date(`${day}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/** «Маасер»: a tenth of everything earned is given */
export const maaserOf = (s: CoinStore) => Math.ceil(earnedTotal(s) / 10);
export const maaserKept = (s: CoinStore) => earnedTotal(s) > 0 && givenTotal(s) >= maaserOf(s);
/** how much is still to give for the tenth (not more than the balance) */
export const maaserDue = (s: CoinStore) => Math.min(balance(s), Math.max(0, maaserOf(s) - givenTotal(s)));

function put(l: Ledger, day: string, id: string, n: number): Ledger {
  const [total, ids] = l[day] ?? [0, {}];
  return { ...l, [day]: [total + n, { ...ids, [id]: n }] };
}

export interface Earned {
  store: CoinStore;
  /** coins of this reward, the doubling included */
  gained: number;
  doubled: boolean;
}

/**
 * A reward for `id` (unique in its kind): null — already rewarded, or the day's reading cap is reached.
 * The first reward of a day is doubled for one who keeps the «маасер».
 */
export function addEarn(s: CoinStore, kind: EarnKind, id: string, today: string): Earned | null {
  const key = `${kind === 'read' ? 'r' : 'a'}:${id}`;
  if (has(s.d, key)) return null;
  if (kind === 'read' && readsOn(s, today) >= READ_CAP) return null;
  const base = REWARD[kind];
  const doubled = maaserKept(s) && !s.d[today]?.[1]?.m;
  let d = put(s.d, today, key, base);
  if (doubled) d = put(d, today, 'm', base);
  return { store: { ...s, d }, gained: doubled ? base * 2 : base, doubled };
}

/** The chest: today is studied, the streak is a full week (7, 14…), and no chest was opened in the last 6 days. */
export function chestDue(s: CoinStore, streak: number, studiedToday: boolean, today: string): boolean {
  if (!studiedToday || streak < CHEST_DAYS || streak % CHEST_DAYS) return false;
  for (let i = 0; i < CHEST_DAYS; i++) if (s.d[addDays(today, -i)]?.[1]?.c) return false;
  return true;
}
export const addChest = (s: CoinStore, today: string): CoinStore => ({ ...s, d: put(s.d, today, 'c', REWARD.chest) });
/** days of the streak towards the next chest, 0 … 6 (7 — opened today) */
export const chestProgress = (s: CoinStore, streak: number, today: string) => (s.d[today]?.[1]?.c ? CHEST_DAYS : streak % CHEST_DAYS);

export const owns = (s: CoinStore, item: string) => item in s.i;
export function buy(s: CoinStore, item: ItemId): CoinStore | null {
  const it = ITEMS.find((x) => x.id === item);
  if (!it || owns(s, item) || balance(s) < it.cost) return null;
  return { ...s, i: { ...s.i, [item]: it.cost } };
}

/** A gift to the common box: `id` — unique (the server takes a gift once). */
export function give(s: CoinStore, amount: number, cause: Cause, id: string, today: string): CoinStore | null {
  if (!Number.isInteger(amount) || amount < 1 || amount > GIFT_MAX || amount > balance(s)) return null;
  return { ...s, g: put(s.g, today, `${cause}:${id}`, amount) };
}

/** days older than KEEP_DAYS keep only their total */
export function fold(s: CoinStore, today: string): CoinStore {
  const old = addDays(today, -KEEP_DAYS);
  const f = (l: Ledger): Ledger => Object.fromEntries(Object.entries(l).map(([day, v]) => [day, day < old ? [v[0]] : v])) as Ledger;
  return canon({ ...s, d: f(s.d), g: f(s.g) });
}

/** one spelling of a store (days and ids in order): two devices with the same coins hold the same string, so the sync has nothing to send */
const sorted = <T>(o: Record<string, T>): Record<string, T> => Object.fromEntries(Object.keys(o).sort().map((k) => [k, o[k]]));
function canon(s: CoinStore): CoinStore {
  const l = (x: Ledger): Ledger => sorted(Object.fromEntries(Object.entries(x).map(([day, [n, ids]]) => [day, ids ? [n, sorted(ids)] : [n]])) as Ledger);
  return { d: l(s.d), g: l(s.g), i: sorted(s.i) };
}

function mergeLedger(a: Ledger, b: Ledger): Ledger {
  const out: Ledger = {};
  for (const day of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) {
    const [x, y] = [a[day], b[day]];
    if (!x || !y) out[day] = (x ?? y)!;
    else if (x[1] && y[1]) {
      // the same id on both devices is one reward
      const ids: Record<string, number> = { ...y[1] };
      for (const [k, n] of Object.entries(x[1])) ids[k] = Math.max(n, ids[k] ?? 0);
      out[day] = [Object.values(ids).reduce((p, n) => p + n, 0), ids];
    } else out[day] = [Math.max(x[0], y[0])]; // one copy has folded the day: the total only
  }
  return out;
}

/** Two copies (this device and the account): every reward, gift and purchase of both, each once. */
export function mergeCoinStores(a: CoinStore, b: CoinStore): CoinStore {
  const i: Record<string, number> = { ...b.i };
  for (const [k, n] of Object.entries(a.i)) i[k] = Math.max(n, i[k] ?? 0);
  return canon({ d: mergeLedger(a.d, b.d), g: mergeLedger(a.g, b.g), i });
}

/* ── the common box (the server) ── */

export interface PushkaState {
  /** the round now, from 1 */
  round: number;
  /** coins in the round now, 0 … PUSHKA_TARGET − 1 */
  coins: number;
  target: number;
  /** coins given for each cause in this round */
  votes: Record<string, number>;
  /** rounds filled: when, and the cause that won the vote */
  closed: { n: number; at: number; cause: string }[];
  /** the signed-in player's coins in this round */
  mine?: number;
}

/** A gift to the box: the rounds it fills (a big gift over the edge goes on into the next round). */
export function pushkaAdd(coins: number, amount: number, target = PUSHKA_TARGET): { coins: number; filled: number } {
  const all = coins + amount;
  return { coins: all % target, filled: Math.floor(all / target) };
}
export const winningCause = (votes: Record<string, number>): Cause =>
  [...CAUSES].sort((a, b) => (votes[b] ?? 0) - (votes[a] ?? 0))[0];
