/**
 * «Pelecoin» on the site: the player's coins in localStorage (`niflaot:coins`, synced with the account — src/core/sync.ts)
 * and the common tzedakah box on the accounts server (`/account/pushka`). The rules — src/core/coinsRules.ts.
 * No heavy imports: `earn` is called wherever the player reads a passage or answers.
 */
import { useEffect, useState, useSyncExternalStore } from 'react';
import { habitStats, studyDates, STUDY_EVENT, todayIso } from './habit';
import { addChest, addEarn, balance, buy as buyItem, chestDue, fold, give as giveCoins, normCoins, REWARD, type Cause, type CoinStore, type EarnKind, type ItemId, type PushkaState } from './coinsRules';

export const COINS_KEY = 'niflaot:coins';
export const COINS_EVENT = 'niflaot:coins';
/** gifts not yet taken by the server (a guest, offline): [{ id, amount, cause }] — this device only */
const OUT_KEY = 'niflaot:coins-out';
// scripts (npm run check, prerender) load the core modules in Node, where there is no import.meta.env
const BASE = (import.meta.env?.VITE_ASSISTANT_URL ?? '').replace(/\/$/, '');

const parse = (k: string): unknown => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? 'null');
  } catch {
    return null;
  }
};
export const readCoins = (): CoinStore => normCoins(parse(COINS_KEY));
function write(s: CoinStore) {
  try {
    localStorage.setItem(COINS_KEY, JSON.stringify(fold(s, todayIso())));
  } catch {}
}

/** a reward just given — for the toast (CoinToast.tsx) */
export interface CoinNews {
  gained: number;
  doubled?: boolean;
  chest?: boolean;
}
const announce = (news?: CoinNews) => window.dispatchEvent(new CustomEvent<CoinNews | undefined>(COINS_EVENT, { detail: news }));

/** +1 for a passage read, +3 for a right answer — each `id` once; false — nothing given. */
export function earn(kind: EarnKind, id: string): boolean {
  const r = addEarn(readCoins(), kind, id, todayIso());
  if (!r) return false;
  write(r.store);
  announce({ gained: r.gained, doubled: r.doubled });
  return true;
}

/** the chest of the 7th day of the streak — checked whenever a day of study is counted */
function openChest() {
  const today = todayIso();
  const s = readCoins();
  const h = habitStats(studyDates(), today);
  if (!chestDue(s, h.streak, h.today, today)) return;
  write(addChest(s, today));
  // after the reward's own toast
  setTimeout(() => announce({ gained: REWARD.chest, chest: true }), 1200);
}
if (typeof window !== 'undefined') window.addEventListener(STUDY_EVENT, openChest);

export function buy(item: ItemId): boolean {
  const s = buyItem(readCoins(), item);
  if (!s) return false;
  write(s);
  announce();
  return true;
}

type Out = { id: string; amount: number; cause: Cause };
const outbox = (): Out[] => {
  const o = parse(OUT_KEY);
  return Array.isArray(o) ? o : [];
};
const saveOut = (o: Out[]) => {
  try {
    if (o.length) localStorage.setItem(OUT_KEY, JSON.stringify(o));
    else localStorage.removeItem(OUT_KEY);
  } catch {}
};
export const pendingGifts = () => outbox().reduce((a, g) => a + g.amount, 0);

/* the common box, as the server last showed it */
let pushka: PushkaState | null = null;
const listeners = new Set<() => void>();
const setPushka = (p: PushkaState) => ((pushka = p), listeners.forEach((f) => f()));
export const usePushka = () =>
  useSyncExternalStore(
    (f) => (listeners.add(f), () => void listeners.delete(f)),
    () => pushka,
    () => null,
  );
export const hasPushka = !!BASE;

async function call(token: string | null, body?: Out): Promise<PushkaState | null> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${BASE}/account/pushka`, { method: body ? 'POST' : 'GET', headers, body: body && JSON.stringify(body) });
  // a gift the server will never take (a bad one) must not stay in the queue for ever
  if (!res.ok) return body && res.status === 400 ? (dropOut(body.id), null) : null;
  const data = await res.json();
  return body ? data.pushka : data;
}
const dropOut = (id: string) => saveOut(outbox().filter((g) => g.id !== id));

/** Load the box; with a signed-in player — first send the gifts that wait on this device. */
export async function loadPushka(token: string | null) {
  if (!BASE) return;
  try {
    if (token)
      for (const g of outbox()) {
        const p = await call(token, g);
        if (!p) break;
        dropOut(g.id);
        setPushka(p);
      }
    const p = await call(token);
    if (p) setPushka(p);
  } catch {}
}

/** Give coins to the common box: they leave the balance at once; the server takes the gift now or at the next visit. */
export function give(amount: number, cause: Cause, token: string | null): boolean {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  const s = giveCoins(readCoins(), amount, cause, id, todayIso());
  if (!s) return false;
  write(s);
  saveOut([...outbox(), { id, amount, cause }]);
  announce();
  void loadPushka(token);
  return true;
}

/** The coins — re-read when something is earned or spent (this tab), in another tab, or brought by the account. */
export function useCoins(): CoinStore {
  const [s, set] = useState(readCoins);
  useEffect(() => {
    const on = () => set(readCoins());
    window.addEventListener(COINS_EVENT, on);
    window.addEventListener('storage', on);
    window.addEventListener(STUDY_EVENT, on);
    return () => {
      window.removeEventListener(COINS_EVENT, on);
      window.removeEventListener('storage', on);
      window.removeEventListener(STUDY_EVENT, on);
    };
  }, []);
  return s;
}
export const useBalance = () => balance(useCoins());
