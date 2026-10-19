/**
 * «Вопросы к отрывку» на сайте: тесты дней (src/tanakh/quiz/<дата>.json — 3–4 вопроса к каждому разделу дня,
 * верный вариант в файле первым; на экране варианты перемешаны) и результаты на устройстве — `niflaot:tanakh-quiz`
 * (синхронизируется с аккаунтом, src/core/sync.ts). Из результатов — сертификаты книг (src/core/academy.ts).
 */
import { useCallback, useEffect, useState } from 'react';
import type { Section } from './tanakhCycle';
import { quizKey, type QuizResult, type QuizStore } from './academy';
import { markStudied } from './habit';

type Lang = 'ru' | 'en' | 'de';
export interface QuizQuestion {
  /** «joshua 2:18» — стих, на который вопрос */
  ref: string;
  q: Record<Lang, string>;
  /** варианты; верный — первый */
  o: Record<Lang, string>[];
}
export type DayQuiz = Record<Section, QuizQuestion[]>;

const FILES = import.meta.glob<DayQuiz>('../tanakh/quiz/*.json', { import: 'default' });
const dateOf = (path: string) => path.slice(-15, -5);
const BY_DATE = new Map(Object.entries(FILES).map(([p, load]) => [dateOf(p), load]));

/** Тест этого дня уже написан. */
export const quizReady = (date: string) => BY_DATE.has(date);
/** Все даты с тестами, по порядку. */
export const quizDates = () => [...BY_DATE.keys()].sort();
export const loadQuiz = (date: string): Promise<DayQuiz | null> => BY_DATE.get(date)?.() ?? Promise.resolve(null);

const KEY = 'niflaot:tanakh-quiz';
export function readQuizStore(): QuizStore {
  try {
    const s = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return s && typeof s === 'object' ? s : {};
  } catch {
    return {};
  }
}
function writeQuizStore(s: QuizStore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {}
  markStudied();
}

/** Порядок вариантов на экране — перемешан, но всегда один и тот же для этого вопроса (от даты и номера). */
export function optionOrder(n: number, seed: string): number[] {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const a = [...Array(n).keys()];
  for (let j = n - 1; j > 0; j--) {
    h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
    const r = h % (j + 1);
    [a[j], a[r]] = [a[r], a[j]];
  }
  return a;
}

/** Результат теста одного раздела одного дня: ответить на вопрос, начать заново. */
export function useQuizResult(date: string, section: Section, n: number) {
  const key = quizKey(date, section);
  const fresh = (): QuizResult => ({ p: Array(n).fill(-1), best: -1, n });
  const [r, setR] = useState<QuizResult>(() => readQuizStore()[key] ?? fresh());
  useEffect(() => {
    const saved = readQuizStore()[key];
    setR(saved && saved.n === n ? saved : fresh());
  }, [key, n]);
  const save = (x: QuizResult) => {
    const s = readQuizStore();
    s[key] = x;
    writeQuizStore(s);
    setR(x);
  };
  const answer = useCallback(
    (i: number, opt: number) => {
      if (r.p[i] >= 0) return;
      const p = r.p.map((x, k) => (k === i ? opt : x));
      const finished = p.every((x) => x >= 0);
      const right = p.filter((x) => x === 0).length;
      save({ p, n, best: finished ? Math.max(r.best, right) : r.best });
    },
    [r, n, key],
  );
  const restart = useCallback(() => save({ ...r, p: Array(n).fill(-1) }), [r, n, key]);
  return { result: r, answer, restart };
}
