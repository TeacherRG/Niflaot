/**
 * «Pelecoin» on the site: the player's coins in localStorage (`niflaot:coins`, synced with the account — src/core/sync.ts)
 * and the common tzedakah box on the accounts server (`/account/pushka`). The rules — src/core/coinsRules.ts.
 * No heavy imports: `earn` is called wherever the player reads a passage or answers.
 */
import { useEffect, useState, useSyncExternalStore } from 'react';
import { authToken, useAccount } from './account';
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
/** «Игровой режим» can be switched off in the account (this device only): no coins are given, no badge, no notes */
const GAME_KEY = 'niflaot:game';
export const GAME_EVENT = 'niflaot:game';
export const gameOn = () => {
  try {
    return localStorage.getItem(GAME_KEY) !== 'off';
  } catch {
    return true;
  }
};
export function setGame(on: boolean) {
  try {
    if (on) localStorage.removeItem(GAME_KEY);
    else localStorage.setItem(GAME_KEY, 'off');
  } catch {}
  window.dispatchEvent(new Event(GAME_EVENT));
}
export function useGame(): boolean {
  const [on, set] = useState(gameOn);
  useEffect(() => {
    const f = () => set(gameOn());
    window.addEventListener(GAME_EVENT, f);
    window.addEventListener('storage', f);
    return () => (window.removeEventListener(GAME_EVENT, f), window.removeEventListener('storage', f));
  }, []);
  return on;
}

export const readCoins = (): CoinStore => normCoins(parse(COINS_KEY));
let serverStore: CoinStore | null = null;
let serverWalletToken: string | null = null;
export async function refreshWallet(token: string): Promise<CoinStore | null> {
  if (!BASE) return null;
  try {
    const res = await fetch(`${BASE}/account/wallet`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json() as { ledger?: { kind: string; amount: number; ref: string | null; at: number }[] };
    const d: Record<string, [number, Record<string, number>]> = {};
    const g: Record<string, [number, Record<string, number>]> = {};
    const i: Record<string, number> = {};
    let x = 0;
    for (const row of data.ledger ?? []) {
      const day = new Date(row.at).toISOString().slice(0, 10);
      if (row.kind === 'opening' || row.kind.startsWith('earn:')) {
        const key = row.kind === 'opening' ? `opening:${row.ref ?? 'legacy'}`
          : row.kind === 'earn:read' ? `r:${row.ref ?? ''}`
          : row.kind === 'earn:answer' ? `a:${row.ref ?? ''}`
          : row.kind === 'earn:chest' ? 'c'
          : `${row.kind}:${row.ref ?? ''}`;
        const entry = d[day] ?? (d[day] = [0, {}]);
        if (!(key in entry[1])) { entry[1][key] = row.amount; entry[0] += row.amount; }
      } else if (row.kind === 'give') {
        const key = `gift:${row.ref ?? ''}`;
        const entry = g[day] ?? (g[day] = [0, {}]);
        if (!(key in entry[1])) { entry[1][key] = -row.amount; entry[0] += -row.amount; }
      } else if (row.kind === 'buy' && row.ref) i[row.ref] = -row.amount;
      else if (row.kind === 'reserve' || row.kind === 'settle') x += row.amount;
    }
    serverStore = normCoins({ d, g, i, x });
    serverWalletToken = token;
    window.dispatchEvent(new Event(COINS_EVENT));
    return serverStore;
  } catch { return null; }
}
async function walletPost(path: string, body: object, token: string): Promise<{ ok: boolean; gained?: number; duplicate?: boolean } | null> {
  try {
    const res = await fetch(`${BASE}/account/wallet/${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const result = await res.json() as { ok: boolean; gained?: number; duplicate?: boolean };
    await refreshWallet(token);
    return result;
  } catch { return null; }
}
const currentCoins = () => (serverWalletToken === authToken() ? serverStore : null) ?? readCoins();

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
export function earn(kind: EarnKind | 'chest', id: string): boolean {
  if (!gameOn()) return false;
  const token = authToken();
  if (token) {
    void walletPost('earn', { kind, id }, token).then(async (ok) => {
      if (!ok) return;
      const gained = kind === 'read' ? REWARD.read : kind === 'answer' ? REWARD.answer : REWARD.chest;
      announce({ gained, chest: kind === 'chest' });
    });
    return true;
  }
  if (kind === 'chest') return false;
  const r = addEarn(readCoins(), kind, id, todayIso());
  if (!r) return false;
  write(r.store);
  announce({ gained: r.gained, doubled: r.doubled });
  return true;
}

/** the chest of the 7th day of the streak — checked whenever a day of study is counted */
function openChest() {
  if (!gameOn()) return;
  const today = todayIso();
  const s = currentCoins();
  const h = habitStats(studyDates(), today);
  if (!chestDue(s, h.streak, h.today, today)) return;
  if (authToken()) {
    earn('chest' as EarnKind, `chest:${today}`);
    return;
  }
  write(addChest(s, today));
  setTimeout(() => announce({ gained: REWARD.chest, chest: true }), 1200);
}
if (typeof window !== 'undefined') window.addEventListener(STUDY_EVENT, openChest);

export async function buy(item: ItemId): Promise<boolean> {
  const token = authToken();
  if (token) {
    const result = await walletPost('buy', { item }, token);
    if (result?.ok) announce();
    return !!result?.ok;
  }
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
        await refreshWallet(token);
      }
    const p = await call(token);
    if (p) setPushka(p);
  } catch {}
}

/** Give coins to the common box: they leave the balance at once; the server takes the gift now or at the next visit. */
export function give(amount: number, cause: Cause, token: string | null): boolean {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  if (authToken() && serverWalletToken !== authToken()) return false;
  const s = giveCoins(currentCoins(), amount, cause, id, todayIso());
  if (!s) return false;
  if (!authToken()) write(s);
  saveOut([...outbox(), { id, amount, cause }]);
  announce();
  void loadPushka(token);
  return true;
}

/** The coins — re-read when something is earned or spent (this tab), in another tab, or brought by the account. */
export function useCoins(): CoinStore {
  const { token, me } = useAccount();
  const [s, set] = useState(() => (token && serverWalletToken === token ? serverStore : null) ?? readCoins());
  useEffect(() => {
    let live = true;
    if (token && me?.user.active) {
      if (serverWalletToken !== token) { serverStore = null; serverWalletToken = token; set(normCoins(null)); }
      void refreshWallet(token).then((next) => { if (live && next) set(next); });
    } else { serverStore = null; serverWalletToken = null; set(readCoins()); }
    const on = () => set(serverStore ?? readCoins());
    window.addEventListener(COINS_EVENT, on);
    window.addEventListener('storage', on);
    window.addEventListener(STUDY_EVENT, on);
    return () => {
      live = false;
      window.removeEventListener(COINS_EVENT, on);
      window.removeEventListener('storage', on);
      window.removeEventListener(STUDY_EVENT, on);
    };
  }, [token, me?.user.active]);
  return s;
}
export const useBalance = () => balance(useCoins());
