/**
 * «Войти» — the optional account (server: assistant/src/accounts.ts). Without it the player is a **guest**: everything
 * works, the progress lives in this browser only. Signed in (a 6-digit code to the email, no password), the progress
 * is the same on every device (src/core/sync.ts merges it), the nickname can be on the leaderboards and in classes,
 * and the questions to the AI teacher are counted.
 *
 * A child under 14 signs up too, with a parent's email: until the parent confirms (the link in the email,
 * `#/consent/<token>`), the account is pending — nothing is synced and the child is on no board and in no class.
 * Registration is shown only when the server can send emails (`/account/config`).
 */
import { useSyncExternalStore } from 'react';
import { isSynced, mergeSnapshots, summarize, type Snapshot } from './sync';
import { dailyNumber, loadResults, streak } from './daily';
import type { Locale } from '../i18n';

const STORE = 'niflaot:account';
// the same server as the AI teacher; read here directly — assistant.ts imports this module
const BASE = (import.meta.env.VITE_ASSISTANT_URL ?? '').replace(/\/$/, '');

export interface Me {
  user: {
    email: string;
    nick: string | null;
    age: 'adult' | 'child' | null;
    parentEmail: string | null;
    parentOk: boolean;
    board: boolean;
    lang: string;
    active: boolean;
  };
  classes: { id: string; name: string; code?: string; teacher: boolean }[];
  ai: { today: number; total: number };
}
export interface Leaders {
  points: { nick: string; v: number }[];
  streak: { nick: string; v: number }[];
  days: { nick: string; v: number }[];
}
export interface ClassView {
  class: { id: string; name: string; code: string };
  members: { nick: string; points: number; solved: number; days: number; streak: number; lessons: Record<string, number>; updated: number | null }[];
}

/** the last exchange of progress with the account (this tab only): when, and whether it went through */
export type SyncStatus = { at: number; ok: boolean } | null;
type State = { token: string | null; me: Me | null; mail: boolean | null; sync: SyncStatus };
let state: State = (() => {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) ?? 'null');
    return { token: s?.token ?? null, me: s?.me ?? null, mail: null, sync: null };
  } catch {
    return { token: null, me: null, mail: null, sync: null };
  }
})();
const listeners = new Set<() => void>();
function set(next: Partial<State>) {
  state = { ...state, ...next };
  try {
    if (state.token) localStorage.setItem(STORE, JSON.stringify({ token: state.token, me: state.me }));
    else localStorage.removeItem(STORE);
  } catch {}
  listeners.forEach((f) => f());
}
const subscribe = (f: () => void) => {
  listeners.add(f);
  return () => listeners.delete(f);
};
export const useAccount = () => useSyncExternalStore(subscribe, () => state, () => state);
export const authToken = () => state.token;

export class AccountError extends Error {
  constructor(public code: string, public status: number) {
    super(code);
  }
}

async function api<T>(path: string, o: { method?: string; body?: unknown } = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (o.body !== undefined) headers['Content-Type'] = 'application/json';
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const res = await fetch(`${BASE}/account${path}`, {
    method: o.method ?? (o.body === undefined ? 'GET' : 'POST'),
    headers,
    body: o.body === undefined ? undefined : JSON.stringify(o.body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // the session ended (logged out elsewhere, deleted): back to a guest, the progress stays on this device
    if (res.status === 401 && state.token && path !== '/login') set({ token: null, me: null });
    throw new AccountError(data.error ?? 'failed', res.status);
  }
  return data as T;
}

/** Can the site register at all (the server sends emails)? Asked once per page load. */
export async function loadConfig() {
  if (!BASE) return set({ mail: false });
  if (state.mail !== null) return;
  try {
    set({ mail: (await api<{ mail: boolean }>('/config')).mail });
  } catch {
    set({ mail: false });
  }
}

export const sendCode = (email: string, lang: Locale) => api('/code', { body: { email, lang } });

/** The code from the email: signed in; the progress of this device and of the account become one. */
export async function login(email: string, code: string, lang: Locale) {
  const r = await api<Me & { token: string }>('/login', { body: { email, code, lang } });
  set({ token: r.token, me: { user: r.user, classes: r.classes, ai: r.ai } });
  if (r.user.active) await firstSync();
  return r;
}

export async function saveProfile(p: { nick: string; age?: 'adult' | 'child'; parentEmail?: string; board: boolean; lang: Locale }) {
  const me = await api<Me & { mail?: boolean }>('/profile', { body: p });
  set({ me });
  if (me.user.active) await firstSync();
  return me;
}

export async function refreshMe() {
  if (!state.token) return null;
  const me = await api<Me>('/me');
  const wasActive = state.me?.user.active;
  set({ me });
  // a child's account just got the parent's consent: the progress joins the account now
  if (me.user.active && !wasActive) await firstSync();
  return me;
}

export const resendConsent = () => api('/consent/resend', { body: {} });
export const confirmConsent = (token: string) => api<{ ok: boolean; nick: string }>('/consent', { body: { token } });

export async function logout() {
  await push().catch(() => {});
  await api('/logout', { body: {} }).catch(() => {});
  set({ token: null, me: null });
}

/** «Удалить аккаунт»: everything on the server goes; this device keeps its progress as a guest. */
export async function deleteAccount() {
  await api('/delete', { body: {} });
  set({ token: null, me: null });
}

export const leaders = (cls?: string) => api<Leaders>(`/leaders${cls ? `?class=${encodeURIComponent(cls)}` : ''}`);
export const createClass = async (name: string) => set({ me: await api<Me>('/class', { body: { name } }) });
export const joinClass = async (code: string) => set({ me: await api<Me>('/class/join', { body: { code } }) });
export const leaveClass = async (id: string) => set({ me: await api<Me>('/class/leave', { body: { id } }) });
export const classView = (id: string) => api<ClassView>(`/class/${encodeURIComponent(id)}`);
export const removeFromClass = (id: string, nick: string) => api('/class/remove', { body: { id, nick } });

/* ───── progress ───── */

function snapshot(): Snapshot {
  const s: Snapshot = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)!;
      if (isSynced(k)) s[k] = localStorage.getItem(k)!;
    }
  } catch {}
  return s;
}
const summary = (s: Snapshot) => summarize(s, streak(loadResults(), dailyNumber()));

let lastPushed = '';
async function push() {
  if (!state.token || !state.me?.user.active) return;
  const s = snapshot();
  const raw = JSON.stringify(s);
  if (raw === lastPushed) return;
  try {
    await api('/progress', { method: 'PUT', body: { data: s, summary: summary(s) } });
  } catch (e) {
    // nothing is lost: the progress stays on this device and goes with the next try (every 30 s)
    set({ sync: { at: Date.now(), ok: false } });
    throw e;
  }
  lastPushed = raw;
  set({ sync: { at: Date.now(), ok: true } });
}

/** «Синхронизировать сейчас»: the account's progress comes here, this device's goes there. */
export async function syncNow() {
  lastPull = Date.now();
  try {
    if (await pull()) notifyPulled();
    else set({ sync: { at: Date.now(), ok: true } });
  } catch (e) {
    set({ sync: { at: Date.now(), ok: false } });
    throw e;
  }
}

/** pages that show the progress (the home page) re-read it when the account brought something new */
const pulledListeners = new Set<() => void>();
export const onPulled = (f: () => void) => {
  pulledListeners.add(f);
  return () => void pulledListeners.delete(f);
};
const notifyPulled = () => pulledListeners.forEach((f) => f());

/** The best of this device and the account in both; true when this device got something from the account. */
async function pull(): Promise<boolean> {
  const remote = await api<{ data: Snapshot }>('/progress');
  const local = snapshot();
  const merged = mergeSnapshots(local, remote.data ?? {});
  let changed = false;
  for (const [k, v] of Object.entries(merged))
    if (local[k] !== v) {
      try {
        localStorage.setItem(k, v);
        changed = true;
      } catch {}
    }
  lastPushed = '';
  await push();
  return changed;
}

/** After signing in: the page reloads if this device got more — the lesson pages read their state when they open. */
async function firstSync() {
  if (await pull()) location.reload();
}

/**
 * Back to the page (another device may have played meanwhile): the account's progress comes to this device,
 * at most once a minute. A lesson or a game that is open is not reloaded — it reads the new state when it opens
 * next time, and whatever it saves meanwhile is merged on the server; the main screen is drawn again to show it.
 */
let lastPull = 0;
async function pullOnReturn() {
  if (!state.token || !state.me?.user.active || Date.now() - lastPull < 60_000) return;
  lastPull = Date.now();
  // the home page is drawn again from the new progress (no reload: what is open on it stays)
  if (await pull()) notifyPulled();
}

/**
 * While signed in: the progress goes to the account every 30 s when it changed, and when the page is hidden
 * (switching apps on a phone). Not `keepalive`: Chrome refuses it for a request with `Authorization`.
 */
export function startAccountSync() {
  if (!BASE) return;
  if (state.token) refreshMe().catch(() => {});
  setInterval(() => push().catch(() => {}), 30_000);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') push().catch(() => {});
    else pullOnReturn().catch(() => {});
  });
}
