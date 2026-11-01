/**
 * «Мои закладки» — закладки и заметки к стихам Пророков и Писаний (`TanakhPage.tsx`, страница `#/bookmarks`).
 * `niflaot:notes` = {"<книга> <глава>:<стих>": {t: время изменения, с; m: 1 — закладка; n: заметка; d: дата дня цикла;
 * s: раздел; x: начало перевода стиха — для списка}}. Убранная запись остаётся с `m: 0` и пустой заметкой (так её
 * удаление доходит до другого устройства); синхронизируется с аккаунтом (`mergeNotes` в src/core/sync.ts:
 * у стиха — более позднее изменение).
 */
import { useEffect, useState } from 'react';
import { markStudied } from './habit';

export const NOTES_KEY = 'niflaot:notes';
const EVENT = 'niflaot:notes';
/** заметка — не длиннее; начало стиха для списка — не длиннее */
export const NOTE_MAX = 1000;
const SNIPPET = 140;

export interface VerseNote {
  t: number;
  m: 0 | 1;
  n: string;
  d: string;
  s: 'neviim' | 'ketuvim';
  x: string;
}
export type NoteStore = Record<string, VerseNote>;

export const verseKey = (b: string, c: number, v: number) => `${b} ${c}:${v}`;
/** запись жива — есть закладка или заметка */
export const isLive = (e: VerseNote | undefined): e is VerseNote => !!e && (e.m === 1 || !!e.n);

export function normNote(v: unknown): VerseNote | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const t = Number(o.t) || 0;
  if (!t) return null;
  return {
    t,
    m: o.m === 1 ? 1 : 0,
    n: typeof o.n === 'string' ? o.n.slice(0, NOTE_MAX) : '',
    d: typeof o.d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(o.d) ? o.d : '',
    s: o.s === 'ketuvim' ? 'ketuvim' : 'neviim',
    x: typeof o.x === 'string' ? o.x.slice(0, SNIPPET) : '',
  };
}

export function readNotes(): NoteStore {
  try {
    const raw = JSON.parse(localStorage.getItem(NOTES_KEY) ?? '{}') ?? {};
    const out: NoteStore = {};
    for (const [k, v] of Object.entries(raw)) {
      const e = normNote(v);
      if (e) out[k] = e;
    }
    return out;
  } catch {
    return {};
  }
}

const snippet = (s: string) => {
  const plain = s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > SNIPPET ? `${plain.slice(0, SNIPPET - 1).trimEnd()}…` : plain;
};

/** что известно о стихе, когда его отмечают */
export interface VerseRef {
  key: string;
  date: string;
  section: 'neviim' | 'ketuvim';
  text: string;
}

function save(ref: VerseRef, change: Partial<Pick<VerseNote, 'm' | 'n'>>) {
  const s = readNotes();
  const old = s[ref.key];
  const e: VerseNote = {
    t: Math.floor(Date.now() / 1000),
    m: change.m ?? old?.m ?? 0,
    n: (change.n ?? old?.n ?? '').slice(0, NOTE_MAX),
    d: ref.date || old?.d || '',
    s: ref.section,
    x: snippet(ref.text) || old?.x || '',
  };
  s[ref.key] = e;
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  if (isLive(e)) markStudied();
}

export const toggleMark = (ref: VerseRef) => save(ref, { m: readNotes()[ref.key]?.m === 1 ? 0 : 1 });
export const setNote = (ref: VerseRef, n: string) => save(ref, { n: n.trim() });

export function useNotes(): NoteStore {
  const [s, set] = useState(readNotes);
  useEffect(() => {
    const on = () => set(readNotes());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return s;
}

/** переход из списка к стиху: страница дня прокручивает к нему, когда загрузит текст */
const GOTO = 'niflaot:goto-verse';
export function gotoVerse(id: string) {
  try {
    sessionStorage.setItem(GOTO, id);
  } catch {}
}
export function takeGoto(): string | null {
  try {
    const id = sessionStorage.getItem(GOTO);
    sessionStorage.removeItem(GOTO);
    return id;
  } catch {
    return null;
  }
}
