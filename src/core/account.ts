/**
 * «Войти» — the account (server: assistant/src/accounts.ts). Since 02.11.2026 the site opens only signed in (src/core/gate.ts:
 * without it — the Tehillim only); a **guest** (no server to send emails, offline): everything
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
/** `google` — the OAuth client id when «Войти через Google» is on; `googleBusy` / `googleErr` — the sign-in coming back from Google */
type State = { token: string | null; me: Me | null; mail: boolean | null; google: string | null; googleBusy: boolean; googleErr: string | null; sync: SyncStatus };
let state: State = (() => {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) ?? 'null');
    return { token: s?.token ?? null, me: s?.me ?? null, mail: null, google: null, googleBusy: false, googleErr: null, sync: null };
  } catch {
    return { token: null, me: null, mail: null, google: null, googleBusy: false, googleErr: null, sync: null };
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
    const c = await api<{ mail: boolean; google?: string | null }>('/config');
    set({ mail: c.mail, google: c.google || null });
  } catch {
    set({ mail: false });
  }
}

export const sendCode = (email: string, lang: Locale) => api('/code', { body: { email, lang } });
export const newsletterApi = <T>(path: string, body: unknown) => api<T>(`/newsletter/${path}`, { body });

/** The code from the email: signed in; the progress of this device and of the account become one. */
export async function login(email: string, code: string, lang: Locale) {
  const r = await api<Me & { token: string }>('/login', { body: { email, code, lang } });
  set({ token: r.token, me: { user: r.user, classes: r.classes, ai: r.ai } });
  if (r.user.active) await firstSync();
  return r;
}

/* ───── «Войти через Google» (server: assistant/src/google.ts) ─────
 * OpenID Connect without Google's script on the site: the page goes to Google (`response_type=id_token`, scope
 * `openid email` — only the email) and comes back to `/` with the token in the hash; `takeGoogleReturn` (main.tsx,
 * before anything reads the address) puts the address back to the page the person was on and sends the token to the
 * server, which checks it and signs in by the email — the same account as with the code. `nonce` and `state` — made
 * here for this one sign-in (sessionStorage), so a token from somewhere else is not accepted. */
const GOOGLE_FLOW = 'niflaot:google-flow';
const rnd = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');

export function startGoogle(lang: Locale) {
  if (!state.google) return;
  const flow = { nonce: rnd(), state: rnd(), back: location.hash || '#/', lang };
  try {
    sessionStorage.setItem(GOOGLE_FLOW, JSON.stringify(flow));
  } catch {
    return set({ googleErr: 'google' });
  }
  const u = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  u.search = new URLSearchParams({
    client_id: state.google,
    redirect_uri: `${location.origin}/`,
    response_type: 'id_token',
    scope: 'openid email',
    nonce: flow.nonce,
    state: flow.state,
    prompt: 'select_account',
  }).toString();
  location.assign(u.toString());
}

/** Back from Google: `#id_token=…&state=…` (or `#error=…`) → the page the person was on, and the sign-in. */
export function takeGoogleReturn() {
  const p = new URLSearchParams(location.hash.slice(1));
  if (!p.has('state') || !(p.has('id_token') || p.has('error'))) return;
  let flow: { nonce: string; state: string; back: string; lang: Locale } | null = null;
  try {
    flow = JSON.parse(sessionStorage.getItem(GOOGLE_FLOW) ?? 'null');
    sessionStorage.removeItem(GOOGLE_FLOW);
  } catch {}
  // the token never stays in the address (history, statistics, «поделиться»)
  const back = flow && /^#\/[^#]*$/.test(flow.back) ? flow.back : '#/';
  history.replaceState(null, '', location.pathname + location.search + back);
  if (!flow || p.get('state') !== flow.state) return set({ googleErr: 'google' });
  const idToken = p.get('id_token');
  if (!idToken) return; // the person closed Google's page or said no: nothing to say
  set({ googleBusy: true, googleErr: null });
  api<Me & { token: string }>('/google', { body: { idToken, nonce: flow.nonce, lang: flow.lang } })
    .then(async (r) => {
      set({ token: r.token, me: { user: r.user, classes: r.classes, ai: r.ai }, googleBusy: false });
      if (r.user.active) await firstSync();
    })
    .catch((e) => set({ googleBusy: false, googleErr: e instanceof AccountError ? e.code : 'failed' }));
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

export interface UserStats {
  total: number;
  unfinished: number;
  adults: number;
  children: number;
  pending: number;
  withProgress: number;
  active: Record<'1' | '7' | '30', number>;
  joined: Record<'1' | '7' | '30', number>;
  langs: Record<string, number>;
  daily: Record<string, { joined: number; active: number }>;
}

/** «Пользователи» in the admin: the admin's GitHub token (src/admin/github.ts), not an account's session */
export async function userStats(githubToken: string): Promise<UserStats> {
  if (!BASE) throw new AccountError('no server', 0);
  const res = await fetch(`${BASE}/account/stats`, { headers: { Authorization: `Bearer ${githubToken}` } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AccountError(data.error ?? 'failed', res.status);
  return data as UserStats;
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
