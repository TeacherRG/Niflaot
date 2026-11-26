/** Live connection helpers for multiplayer dreidel rooms. */
import { useCallback, useEffect, useRef, useState } from 'react';

const BASE: string = (import.meta.env.VITE_ASSISTANT_URL ?? '').replace(/\/$/, '');
const HOSTS = 'niflaot:dreidel-host';
const PLAYER = 'niflaot:dreidel-player';
const read = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) ?? 'null') ?? fallback; } catch { return fallback; }
};
const write = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

export const dreidelAvailable = () => !!BASE;
export async function createDreidelRoom(): Promise<string> {
  const response = await fetch(BASE + '/dreidel/new', { method: 'POST' });
  if (!response.ok) throw new Error('Could not create dreidel room: ' + response.status);
  const { code, key } = await response.json() as { code: string; key: string };
  const rooms = read<Record<string, [string, number]>>(HOSTS, {});
  rooms[code] = [key, Date.now()];
  write(HOSTS, rooms);
  return code;
}
export const dreidelHostKey = (code: string) => read<Record<string, [string, number]>>(HOSTS, {})[code]?.[0];

export function dreidelPlayer(code: string): { pid: string; name: string } {
  const all = read<Record<string, { pid: string; name: string }>>(PLAYER, {});
  if (all[code]) return all[code];
  const pid = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => (b % 36).toString(36)).join('');
  const value = { pid, name: '' };
  all[code] = value;
  write(PLAYER, all);
  return value;
}
export function saveDreidelName(code: string, name: string) {
  const all = read<Record<string, { pid: string; name: string }>>(PLAYER, {});
  if (!all[code]) all[code] = dreidelPlayer(code);
  all[code].name = name;
  write(PLAYER, all);
}

export type DreidelStatus = 'connecting' | 'open' | 'lost' | 'closed';
export type DreidelView = {
  code: string;
  phase: 'lobby' | 'playing' | 'final';
  players: { name: string; coins: number }[];
  count: number;
  pot: number;
  turnName: string | null;
  last: { id: number; name: string; face: 'נ' | 'ג' | 'ה' | 'ש'; delta: number; at: number } | null;
  now: number;
  me: { name: string; coins: number; canSpin: boolean } | null;
};

export function useDreidelRoom(code: string, query: string) {
  const [view, setView] = useState<DreidelView | null>(null);
  const [status, setStatus] = useState<DreidelStatus>('connecting');
  const [error, setError] = useState('');
  const ws = useRef<WebSocket | null>(null);
  useEffect(() => {
    let alive = true;
    let tries = 0;
    let ever = false;
    let timer: ReturnType<typeof setTimeout>;
    const connect = () => {
      const socket = new WebSocket(BASE.replace(/^http/, 'ws') + '/dreidel/ws/' + code + '?' + query);
      ws.current = socket;
      socket.onopen = () => { tries = 0; ever = true; setStatus('open'); };
      socket.onmessage = (event) => {
        const message = JSON.parse(String(event.data));
        if (message.error) { setError(String(message.error)); return; }
        setError('');
        setView(message as DreidelView);
      };
      socket.onclose = (event) => {
        if (!alive) return;
        if (event.code === 4000 || (!ever && tries >= 2)) { setStatus('closed'); return; }
        setStatus(ever ? 'lost' : 'connecting');
        timer = setTimeout(connect, Math.min(15000, 1000 * 2 ** tries++));
      };
    };
    connect();
    const wake = () => {
      if (document.visibilityState === 'visible' && ws.current && ws.current.readyState > 1) {
        clearTimeout(timer);
        connect();
      }
    };
    document.addEventListener('visibilitychange', wake);
    return () => { alive = false; clearTimeout(timer); document.removeEventListener('visibilitychange', wake); ws.current?.close(); };
  }, [code, query]);
  const send = useCallback((message: object) => {
    if (ws.current?.readyState === 1) ws.current.send(JSON.stringify(message));
  }, []);
  return { view, status, error, send };
}
