/**
 * «Слова ґалахи» use the same progress store as «Мои слова». The old halacha store
 * is copied once into namespaced keys in niflaot:words; the old key is retained
 * for account sync and rollback. No separate progress engine remains.
 */
import { useEffect, useState } from 'react';
import { INTERVALS, KNOWN_BOX, today, readWordStore, setWordEntry, type WordStore } from './words';
import { normWord } from './sync';
import { markStudied } from './habit';
import { root } from './tanakh';

export const HALACHA_KEY = 'niflaot:halacha-words';
const EVENT = 'niflaot:words';
const PREFIX = 'h:';

/** {key: [vocalized headword, translation]} */
export type Lexicon = Record<string, [string, string]>;
let lex: Promise<Lexicon> | undefined;
export const loadLexicon = () =>
  (lex ??= fetch(`${root()}rambam/words/lexicon-ru.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Lexicon>) : {}))
    .catch(() => ({})));

function migrateLegacy() {
  try {
    const raw = JSON.parse(localStorage.getItem(HALACHA_KEY) ?? 'null');
    if (!raw || typeof raw !== 'object') return;
    const current = readWordStore();
    let changed = false;
    for (const [key, value] of Object.entries(raw)) {
      const id = PREFIX + key;
      const entry = normWord(value);
      if (!current[id] || current[id][0] < entry[0]) { current[id] = entry; changed = true; }
    }
    if (changed) {
      localStorage.setItem('niflaot:words', JSON.stringify(current));
      window.dispatchEvent(new Event(EVENT));
    }
  } catch {}
}

export function readHalachaStore(): WordStore {
  migrateLegacy();
  const all = readWordStore();
  return Object.fromEntries(Object.entries(all).filter(([id]) => id.startsWith(PREFIX)).map(([id, value]) => [id.slice(PREFIX.length), value]));
}

function put(id: string, box: number, due: number) {
  setWordEntry(PREFIX + id, box, due);
}
export const hBox = (s: WordStore, id: string) => s[id]?.[1] ?? 0;
export const hMarkKnown = (id: string) => put(id, KNOWN_BOX, today() + INTERVALS[KNOWN_BOX]);
export const hMarkLearn = (id: string) => put(id, 1, today());
export const hUnmark = (id: string) => put(id, 0, 0);
export function hReview(id: string, remembered: boolean) {
  const box = hBox(readHalachaStore(), id);
  if (remembered) {
    const next = Math.min(box + 1, INTERVALS.length - 1);
    put(id, next, today() + INTERVALS[next]);
  } else put(id, 1, today() + 1);
}
export const hDue = (s: WordStore) =>
  Object.entries(s).filter(([, w]) => w[1] > 0 && w[2] <= today()).sort((a, b) => a[1][1] - b[1][1] || a[1][2] - b[1][2]).map(([id]) => id);

export function useHalachaStore(): WordStore {
  const [s, set] = useState(readHalachaStore);
  useEffect(() => {
    const on = () => set(readHalachaStore());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => { window.removeEventListener(EVENT, on); window.removeEventListener('storage', on); };
  }, []);
  return s;
}
