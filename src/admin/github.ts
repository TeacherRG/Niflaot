import { applyOverrides, put, setText, type Overrides } from '../content';
import { sanitizeHtml } from '../core/sanitize';

/**
 * The admin's side of the text editor: sign-in with a GitHub token (only someone who may push to the repo
 * can publish), a draft of edits kept in this browser and shown on the site at once, and publishing —
 * a commit of `src/content/overrides.json` to `main`, which the deploy workflow checks and puts online.
 */
export const REPO = 'TeacherRG/Niflaot';
export const BRANCH = 'main';
export const FILE = 'src/content/overrides.json';
const API = 'https://api.github.com';
const TOKEN_KEY = 'niflaot:admin-token';
const DRAFT_KEY = 'niflaot:admin-draft';
/** not a secret: "this is the admin's browser" — no visit counting, future passages open — also after the token is gone */
const DEVICE_KEY = 'niflaot:admin-device';
/** a remembered token lives at most this long */
const REMEMBER_MS = 30 * 24 * 3600 * 1000;

const store = (kind: 'local' | 'session') => {
  try {
    return kind === 'local' ? localStorage : sessionStorage;
  } catch {
    return null;
  }
};
const read = (k: string, kind: 'local' | 'session' = 'local') => {
  try {
    return store(kind)?.getItem(k) ?? null;
  } catch {
    return null;
  }
};
const write = (k: string, v: string | null, kind: 'local' | 'session' = 'local') => {
  try {
    if (v === null) store(kind)?.removeItem(k);
    else store(kind)?.setItem(k, v);
  } catch {}
};

/**
 * The token may write to the repo, so it is kept as briefly as possible: by default only for this tab
 * (sessionStorage — gone when the tab closes); "remember on this device" keeps it in localStorage for 30 days.
 * A token saved the old way (a bare string in localStorage, no time limit) moves to this tab.
 */
export function getToken(): string | null {
  const own = read(TOKEN_KEY, 'session');
  if (own) return own;
  const saved = read(TOKEN_KEY);
  if (!saved) return null;
  let kept: { t?: string; exp?: number } | null = null;
  try {
    kept = JSON.parse(saved) as { t?: string; exp?: number };
  } catch {}
  if (kept && typeof kept === 'object' && kept.t && (kept.exp ?? 0) > Date.now()) return kept.t;
  write(TOKEN_KEY, null);
  if (kept && typeof kept === 'object') return null; // a remembered token whose time is up
  write(TOKEN_KEY, saved, 'session');
  return saved;
}
export const isAdmin = () => read(DEVICE_KEY) === '1' || !!getToken();

async function gh<T>(path: string, init: RequestInit = {}, token = getToken()): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(`GitHub ${res.status}: ${body.message ?? res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/** Checks the token: it must let its owner push to the repo. Returns the GitHub login. */
export async function signIn(token: string, remember = false): Promise<string> {
  const repo = await gh<{ permissions?: { push?: boolean } }>(`/repos/${REPO}`, {}, token);
  if (!repo.permissions?.push) throw new Error('У этого токена нет права записи в репозиторий');
  const user = await gh<{ login: string }>('/user', {}, token).catch(() => ({ login: '' }));
  write(TOKEN_KEY, token, 'session');
  write(TOKEN_KEY, remember ? JSON.stringify({ t: token, exp: Date.now() + REMEMBER_MS }) : null);
  write(DEVICE_KEY, '1');
  return user.login;
}

export function signOut() {
  write(TOKEN_KEY, null, 'session');
  write(TOKEN_KEY, null);
}

/* ───── draft: edits not yet published ───── */

/** Full key → new text, or null to bring back the source-file text. */
export type Draft = Record<string, string | null>;

export function loadDraft(): Draft {
  try {
    return JSON.parse(read(DRAFT_KEY) ?? '{}') as Draft;
  } catch {
    return {};
  }
}

export function saveDraft(d: Draft) {
  write(DRAFT_KEY, Object.keys(d).length ? JSON.stringify(d) : null);
}

/** Shows the admin's unpublished edits on the site (called once at startup). */
export function applyDraft() {
  if (!isAdmin()) return;
  for (const [k, v] of Object.entries(loadDraft())) setText(k, v);
}

/** Drops the draft and puts the site back to the published texts. */
export function discardDraft(published: Overrides) {
  for (const k of Object.keys(loadDraft())) setText(k, null);
  applyOverrides(published);
  saveDraft({});
}

/* ───── publishing ───── */

const toBase64 = (s: string) => {
  const bytes = new TextEncoder().encode(s);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
};
const fromBase64 = (b: string) => new TextDecoder().decode(Uint8Array.from(atob(b.replace(/\s/g, '')), (c) => c.charCodeAt(0)));

/**
 * Merges the draft into the latest `overrides.json` on GitHub (edits made meanwhile from another browser stay)
 * and commits it. Returns the commit's sha.
 */
export async function publish(draft: Draft, login: string): Promise<string> {
  const file = await gh<{ content: string; sha: string }>(`/repos/${REPO}/contents/${FILE}?ref=${BRANCH}`);
  const ov = JSON.parse(fromBase64(file.content)) as Overrides;
  for (const [k, v] of Object.entries(draft)) put(ov, k, v === null ? null : sanitizeHtml(v));
  const n = Object.keys(draft).length;
  const res = await gh<{ commit: { sha: string } }>(`/repos/${REPO}/contents/${FILE}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `Правка текстов на сайте (${n})${login ? ` — ${login}` : ''}`,
      content: toBase64(JSON.stringify(ov, null, 2) + '\n'),
      sha: file.sha,
      branch: BRANCH,
    }),
  });
  return res.commit.sha;
}

export type DeployState = 'waiting' | 'running' | 'done' | 'failed';

/** State of the deploy workflow run for a commit. */
export async function deployState(sha: string): Promise<{ state: DeployState; url?: string }> {
  const { workflow_runs: runs } = await gh<{
    workflow_runs: { status: string; conclusion: string | null; html_url: string }[];
  }>(`/repos/${REPO}/actions/workflows/deploy.yml/runs?head_sha=${sha}&per_page=1`);
  const run = runs[0];
  if (!run) return { state: 'waiting' };
  if (run.status !== 'completed') return { state: 'running', url: run.html_url };
  return { state: run.conclusion === 'success' ? 'done' : 'failed', url: run.html_url };
}
