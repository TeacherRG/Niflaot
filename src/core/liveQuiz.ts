/**
 * «Викторина вместе» на сайте: создать комнату и держать связь с ней (сервер — assistant/src/quiz.ts, правила —
 * src/core/quizGame.ts). Ключ ведущего и id игрока — в localStorage, по коду комнаты: перезагрузка страницы
 * возвращает в ту же игру с теми же очками. Без VITE_ASSISTANT_URL викторины нет.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { View } from './quizGame';
import type { DeckInfo } from './quizDecks';

const BASE: string = (import.meta.env.VITE_ASSISTANT_URL ?? '').replace(/\/$/, '');
export const quizAvailable = () => !!BASE;

const up = '..';
const HOSTS = 'niflaot:quiz-host';
const PLAYER = 'niflaot:quiz-player';

const read = <T,>(k: string, d: T): T => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? 'null') ?? d;
  } catch {
    return d;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

/** Колоды — список с сайта (`/quiz/index.json`, собирает scripts/prerender.ts). */
export async function loadDecks(): Promise<DeckInfo[]> {
  // from the site's root (as src/core/tanakh.ts: the build is relative, the code lives in /assets/)
  const root = import.meta.env.DEV ? import.meta.env.BASE_URL : new URL(up, import.meta.url).href;
  const res = await fetch(`${root.replace(/\/?$/, '/')}quiz/index.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`quiz index: ${res.status}`);
  return res.json();
}

/** Новая комната; ключ ведущего запоминается на этом устройстве (на сутки — комната живёт меньше). */
export async function createRoom(deck: string, lang: string, n: number): Promise<string> {
  const res = await fetch(`${BASE}/quiz/new`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ deck, lang, n, today: new Date().toLocaleDateString('sv') }) });
  if (!res.ok) throw new Error(`quiz/new: ${res.status}`);
  const { code, key } = (await res.json()) as { code: string; key: string };
  const now = Date.now();
  const hosts = Object.fromEntries(Object.entries(read<Record<string, [string, number]>>(HOSTS, {})).filter(([, v]) => now - v[1] < 864e5));
  hosts[code] = [key, now];
  write(HOSTS, hosts);
  return code;
}

export const hostKey = (code: string) => read<Record<string, [string, number]>>(HOSTS, {})[code]?.[0];

/** id игрока в этой комнате (новый — для новой комнаты) и имя, которое он вводил в прошлый раз. */
export function playerId(code: string): { pid: string; name: string } {
  const p = read<{ code?: string; pid?: string; name?: string }>(PLAYER, {});
  if (p.code === code && p.pid) return { pid: p.pid, name: p.name ?? '' };
  const pid = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => (b % 36).toString(36)).join('');
  write(PLAYER, { code, pid, name: p.name ?? '' });
  return { pid, name: p.name ?? '' };
}
export const rememberName = (code: string, pid: string, name: string) => write(PLAYER, { code, pid, name });

export type Status = 'connecting' | 'open' | 'lost' | 'closed';

/**
 * Связь с комнатой: вид от сервера, отправка, состояние. Обрыв — переподключение (1, 2, 4… до 15 с);
 * комната закрыта или её нет — 'closed'. `offset` — разница часов сервера и устройства (для таймера).
 */
export function useRoom(code: string, query: string) {
  const [view, setView] = useState<View | null>(null);
  const [status, setStatus] = useState<Status>('connecting');
  const [error, setError] = useState('');
  const offset = useRef(0);
  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    let alive = true;
    let tries = 0;
    let ever = false;
    let timer: ReturnType<typeof setTimeout>;
    const connect = () => {
      const s = new WebSocket(`${BASE.replace(/^http/, 'ws')}/quiz/ws/${code}?${query}`);
      ws.current = s;
      s.onopen = () => {
        tries = 0;
        ever = true;
        setStatus('open');
      };
      s.onmessage = (e) => {
        const m = JSON.parse(String(e.data));
        if (m.error) return setError(String(m.error));
        offset.current = m.now - Date.now();
        setError('');
        setView(m);
      };
      s.onclose = (e) => {
        if (!alive) return;
        // the room is gone (closed by the server, or never there): no reconnecting
        if (e.code === 4000 || (!ever && tries >= 2)) return setStatus('closed');
        setStatus(ever ? 'lost' : 'connecting');
        timer = setTimeout(connect, Math.min(15000, 1000 * 2 ** tries++));
      };
    };
    connect();
    // back to the tab (a phone wakes up): reconnect at once
    const wake = () => {
      if (document.visibilityState === 'visible' && ws.current && ws.current.readyState > 1) {
        clearTimeout(timer);
        connect();
      }
    };
    document.addEventListener('visibilitychange', wake);
    return () => {
      alive = false;
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', wake);
      ws.current?.close();
    };
  }, [code, query]);
  const send = useCallback((m: object) => {
    if (ws.current?.readyState === 1) ws.current.send(JSON.stringify(m));
  }, []);
  return { view, status, error, send, offset };
}

/** Секунд до конца вопроса — по часам сервера, обновляется 4 раза в секунду. */
export function useCountdown(deadline: number | undefined, offset: { current: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!deadline) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [deadline]);
  return deadline ? Math.max(0, Math.ceil((deadline - now - offset.current) / 1000)) : 0;
}
