/**
 * «Слова ґалахи» — слова «Мишне Торы», которых нет в словаре Танаха (владелец, 24.11.2026: «если нет в словаре Танаха — сделать
 * словарь ґалахи и тоже помечать «Учу» и «Знаю»»). Основные формы и их общее значение — public/rambam/words/lexicon-ru.json
 * (scripts/fetch-rambam.py words); слово текста ссылается на форму `h:<ключ>` в ru.json. Учёба — как «Мои слова»: коробки
 * 0–5 (`INTERVALS`, `KNOWN_BOX` из words.ts), «Учу» — коробка 1, повторить сегодня; «Знаю» — коробка 3, проверка через неделю;
 * «Помню» — следующая коробка, «Не помню» — коробка 1, завтра. localStorage `niflaot:halacha-words` = {<ключ>: [время, коробка,
 * день повтора]}, синхронизируется (mergeWords в sync.ts — тот же вид записи).
 */
import { useEffect, useState } from 'react';
import { INTERVALS, KNOWN_BOX, today } from './words';
import type { WordStore } from './words';
import { markStudied } from './habit';
import { root } from './tanakh';

export const HALACHA_KEY = 'niflaot:halacha-words';
const EVENT = 'niflaot:halacha-words';

/** {ключ: [основная форма с огласовками, перевод]} */
export type Lexicon = Record<string, [string, string]>;
let lex: Promise<Lexicon> | undefined;
export const loadLexicon = () =>
  (lex ??= fetch(`${root()}rambam/words/lexicon-ru.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Lexicon>) : {}))
    .catch(() => ({})));

export function readHalachaStore(): WordStore {
  try {
    const raw = JSON.parse(localStorage.getItem(HALACHA_KEY) ?? 'null');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function put(id: string, box: number, due: number) {
  const s = readHalachaStore();
  s[id] = [Math.floor(Date.now() / 1000), box, due];
  try {
    localStorage.setItem(HALACHA_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  if (box > 0) markStudied();
}
export const hBox = (s: WordStore, id: string) => s[id]?.[1] ?? 0;
export const hMarkKnown = (id: string) => put(id, KNOWN_BOX, today() + INTERVALS[KNOWN_BOX]);
export const hMarkLearn = (id: string) => put(id, 1, today());
export const hUnmark = (id: string) => put(id, 0, 0);
/** итог карточки: вспомнил — следующая коробка, нет — коробка 1, завтра */
export function hReview(id: string, remembered: boolean) {
  const box = hBox(readHalachaStore(), id);
  if (remembered) {
    const next = Math.min(box + 1, INTERVALS.length - 1);
    put(id, next, today() + INTERVALS[next]);
  } else put(id, 1, today() + 1);
}
/** пора повторить: в колоде (коробка 1+) и день повтора наступил — сначала «учу», потом ждущие дольше */
export const hDue = (s: WordStore) =>
  Object.entries(s)
    .filter(([, w]) => w[1] > 0 && w[2] <= today())
    .sort((a, b) => a[1][1] - b[1][1] || a[1][2] - b[1][2])
    .map(([id]) => id);

export function useHalachaStore(): WordStore {
  const [s, set] = useState(readHalachaStore);
  useEffect(() => {
    const on = () => set(readHalachaStore());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return s;
}
