/**
 * «Слова отрывка» — иврит по словам Танаха (TanakhWords.tsx под отрывком дня Пророков и Писаний).
 *
 * Словарь — src/tanakh/words.json (scripts/fetch-words.py): самые частые слова Пророков и Писаний в основной форме
 * (по разметке Open Scriptures Hebrew Bible, CC BY 4.0), без имён собственных, по порядку частоты; `cov` — сколько
 * процентов текста покрывают это слово и все более частые. Переводы — проекта: src/tanakh/words/<ru|en|de>.json;
 * учить можно только переведённые слова (начало списка). По дню — public/tanakh/words/<дата>.json: сколько слов в
 * отрывке раздела (`n`, без имён) и сколько раз в нём встречается каждое слово словаря (`w`).
 *
 * «Мои слова» — localStorage `niflaot:words` = { номер слова: [время, коробка, день повторения] } (ниже),
 * синхронизируется с аккаунтом (src/core/sync.ts: у одного слова — более позднее изменение).
 */
import { useEffect, useState } from 'react';
import type { Section } from './tanakhCycle';
import { localToday, root } from './tanakh';
import { normWord, type WordEntry } from './sync';
import type { Certificate, Progress } from './academy';
import { markStudied } from './habit';

export interface Word {
  /** номер Стронга */
  id: string;
  /** основная форма с огласовками (Имена — как во всём проекте) */
  he: string;
  pos: string;
  /** сколько раз встречается в Пророках и Писаниях */
  n: number;
  /** корень (у глагола — он сам) */
  root?: string;
  /** арамейское слово (Даниэль, Эзра) */
  aram?: 1;
  /** % текста, который покрывают это слово и все более частые */
  cov: number;
}
export type WordLang = 'ru' | 'en' | 'de';
export interface Dict {
  words: Word[];
  /** слов в Пророках и Писаниях без имён */
  total: number;
  /** номер слова → место по частоте (с 1) */
  rank: Map<string, number>;
  /** номер слова → перевод на языке сайта; только переведённые слова можно учить */
  tr: Record<string, string>;
}
/**
 * `v` — the words of each verse parsed (WordPop.tsx): «книга глава:стих» → for each word of our text (split at spaces and
 * maqaf) «prefixes|number|ending» (prefixes — OSHB letters b c d i k l m s; number `n` — a name, `H` — the Name; `!` first —
 * a ketiv), 0 — the word didn't match.
 */
export type DayWords = Record<Section, { n: number; w: Record<string, number>; v?: Record<string, (string | 0)[]> }>;

/** сколько слов отрывка предлагать в день */
export const PER_DAY = 5;

const dicts = new Map<WordLang, Promise<Dict>>();
/** Словарь и переводы — отдельным куском кода, только на странице отрывка. */
export function loadDict(lang: WordLang): Promise<Dict> {
  let p = dicts.get(lang);
  if (!p) {
    p = Promise.all([import('../tanakh/words.json'), import(`../tanakh/words/${lang}.json`)]).then(([w, tr]) => {
      const { words, total } = w.default as { words: Word[]; total: number };
      return { words, total, rank: new Map(words.map((x, i) => [x.id, i + 1])), tr: tr.default as Record<string, string> };
    });
    dicts.set(lang, p);
  }
  return p;
}

let lex: Promise<Record<string, string>> | undefined;
/** The dictionary form of the words outside the dictionary (public/tanakh/words/lex.json), for the window over a word. */
export function loadLex(): Promise<Record<string, string>> {
  lex ??= fetch(`${root()}tanakh/words/lex.json`)
    .then((r) => (r.ok ? (r.json() as Promise<Record<string, string>>) : {}))
    .catch(() => ({}));
  return lex;
}

const days = new Map<string, Promise<DayWords | null>>();
export function loadDayWords(date: string): Promise<DayWords | null> {
  let p = days.get(date);
  if (!p) {
    p = fetch(`${root()}tanakh/words/${date}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<DayWords>) : null))
      .catch(() => null);
    days.set(date, p);
  }
  return p;
}

/**
 * Пример стиха к слову (scripts/fetch-words.py → public/tanakh/words/examples-<язык>.json): стих Пророков или Писаний,
 * где слово встречается, — дата и раздел дня цикла, «книга глава:стих», иврит [до, слово, после], перевод стиха (проекта;
 * `en` — английский JPS 1985, на этом языке стих ещё не переведён).
 */
export interface Example {
  date: string;
  section: Section;
  ref: string;
  he: [string, string, string];
  tr: string;
  en: boolean;
}
type RawExample = [string, Section, string, [string, string, string], string, 1?];
const examples = new Map<WordLang, Promise<Record<string, RawExample>>>();
export function loadExamples(lang: WordLang): Promise<Record<string, RawExample>> {
  let p = examples.get(lang);
  if (!p) {
    p = fetch(`${root()}tanakh/words/examples-${lang}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Record<string, RawExample>>) : {}))
      .catch(() => ({}));
    examples.set(lang, p);
  }
  return p;
}
export const exampleOf = (all: Record<string, RawExample>, id: string): Example | undefined => {
  const x = all[id];
  return x && { date: x[0], section: x[1], ref: x[2], he: x[3], tr: x[4], en: x[5] === 1 };
};

export const WORDS_KEY = 'niflaot:words';
const EVENT = 'niflaot:words';
/**
 * Слово в «Моих словах»: [время изменения, с; коробка; день следующего повторения]. Коробки — как «карточки с
 * коробками»: 0 — убрано, 1–2 — учу, 3–5 — знаю. Вспомнил — следующая коробка, повтор через `INTERVALS[коробка]` дней;
 * не вспомнил — снова коробка 1, повтор завтра. «Знаю» сразу — коробка 3 (проверка через неделю), «Учу» — коробка 1
 * (повторить сегодня). Дни — номера дней с 1970-01-01 по дате устройства.
 */
export type { WordEntry } from './sync';
export type WordStore = Record<string, WordEntry>;
export const INTERVALS = [0, 1, 3, 7, 21, 60];
export const KNOWN_BOX = 3;

/** сегодня (по дате устройства) — номер дня */
export const today = () => {
  const [y, m, d] = localToday().split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 864e5);
};
export const boxOf = (s: WordStore, id: string) => s[id]?.[1] ?? 0;
export const isKnown = (s: WordStore, id: string) => boxOf(s, id) >= KNOWN_BOX;
export const inDeck = (s: WordStore, id: string) => boxOf(s, id) > 0;
/** слова, которые пора повторить сегодня (сначала — те, что ждут дольше) */
export const dueWords = (s: WordStore, day = today()) =>
  Object.keys(s)
    .filter((id) => s[id][1] > 0 && s[id][2] <= day)
    .sort((a, b) => s[a][2] - s[b][2]);

/** номера Стронга, слитые в словаре с другим (`MERGE` в scripts/fetch-words.py): יָלַךְ — это הָלַךְ */
const MERGED: Record<string, string> = { '3212': '1980' };

export function readWordStore(): WordStore {
  try {
    const raw = JSON.parse(localStorage.getItem(WORDS_KEY) ?? 'null');
    if (!raw || typeof raw !== 'object') return {};
    const out: WordStore = {};
    for (const [k, v] of Object.entries(raw)) {
      const id = MERGED[k] ?? k;
      const w = normWord(v);
      if (!out[id] || out[id][0] < w[0]) out[id] = w;
    }
    return out;
  } catch {
    return {};
  }
}

function put(id: string, box: number, due: number) {
  const s = readWordStore();
  s[id] = [Math.floor(Date.now() / 1000), box, due];
  try {
    localStorage.setItem(WORDS_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  if (box > 0) markStudied();
}
/** «Знаю» — проверить через неделю; «Учу» — повторить сегодня; убрать из моих слов */
export const markKnown = (id: string) => put(id, KNOWN_BOX, today() + INTERVALS[KNOWN_BOX]);
export const markLearn = (id: string) => put(id, 1, today());
export const unmark = (id: string) => put(id, 0, 0);
/** итог повторения слова: вспомнил — следующая коробка, нет — снова коробка 1, завтра */
export function review(id: string, remembered: boolean) {
  const box = boxOf(readWordStore(), id);
  if (remembered) {
    const next = Math.min(box + 1, INTERVALS.length - 1);
    put(id, next, today() + INTERVALS[next]);
  } else put(id, 1, today() + 1);
}

export function useWordStore(): WordStore {
  const [s, set] = useState(readWordStore);
  useEffect(() => {
    const on = () => set(readWordStore());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return s;
}

/** Слова дня: самые частые переведённые слова отрывка, которых нет в «Моих словах». */
export function pickWords(day: DayWords[Section], dict: Dict, known: WordStore, n = PER_DAY): Word[] {
  return Object.keys(day.w)
    .filter((id) => dict.tr[id] && !inDeck(known, id))
    .sort((a, b) => dict.rank.get(a)! - dict.rank.get(b)!)
    .slice(0, n)
    .map((id) => dict.words[dict.rank.get(id)! - 1]);
}

/** Сколько процентов слов отрывка игрок узнаёт (имена не считаются). */
export function coverage(day: DayWords[Section], known: WordStore): number {
  if (!day.n) return 100;
  let k = 0;
  for (const [id, c] of Object.entries(day.w)) if (isKnown(known, id)) k += c;
  return Math.round((k / day.n) * 100);
}

/** Следующие самые частые переведённые слова, которых нет в «Моих словах». */
export const nextWords = (dict: Dict, s: WordStore, n = PER_DAY) => dict.words.filter((w) => dict.tr[w.id] && !inDeck(s, w.id)).slice(0, n);

/** Сколько переведённых слов словаря игрок знает. */
export const knownCount = (dict: Dict, known: WordStore) => Object.keys(dict.tr).filter((id) => isKnown(known, id)).length;

/** Сколько процентов слов Пророков и Писаний (без имён) покрывают знакомые слова. */
export const textCoverage = (dict: Dict, s: WordStore) =>
  Math.round((dict.words.reduce((a, w) => a + (isKnown(s, w.id) ? w.n : 0), 0) / dict.total) * 100);

/** Вехи «Моих слов» — по ним и сертификаты «Академии» (следующий этап). */
export const WORD_GOALS = [100, 300, 500, 1000, 1500];

/**
 * Сертификаты «Академии» «100 / 300 / 500 / 1000 / 1500 слов Танаха» (`w-<число>`): засчитываются только слова, **подтверждённые
 * повторением** — вспомненные на карточке хотя бы раз после «Знаю» / выученные (коробка `VERIFIED_BOX` и выше), а не
 * просто отмеченные. got — подтверждено (не больше вехи), done — «знаю» всего.
 */
export const VERIFIED_BOX = 4;
export const verifiedCount = (s: WordStore) => Object.values(s).filter((e) => e[1] >= VERIFIED_BOX).length;
const W_NAME = (n: number) => ({ ru: `${n} слов Танаха`, en: `${n} words of Tanakh`, de: `${n} Wörter des Tanach` });
export function wordsCertificates(s: WordStore): (Certificate & { goal: number; progress: Progress })[] {
  const verified = verifiedCount(s);
  const known = Object.values(s).filter((e) => e[1] >= KNOWN_BOX).length;
  return WORD_GOALS.map((goal) => ({
    id: `w-${goal}`,
    kind: 'words' as const,
    goal,
    book: { id: String(goal), he: 'מִלִּים', name: W_NAME(goal) },
    progress: { got: Math.min(verified, goal), max: goal, done: known, parts: goal, complete: true, earned: verified >= goal },
  }));
}

/**
 * «Слово дня» (пост в Telegram): из обоих отрывков дня — переведённое слово, которое встречается в них чаще всего,
 * кроме 50 самых частых (служебных) слов; при равенстве — более частое в Танахе. Нет такого — самое частое из всех.
 */
export function wordOfDay(day: DayWords, words: Word[], tr: Record<string, string>): Word | undefined {
  const rank = new Map(words.map((w, i) => [w.id, i]));
  const count = new Map<string, number>();
  for (const s of Object.values(day)) for (const [id, c] of Object.entries(s.w)) count.set(id, (count.get(id) ?? 0) + c);
  const pick = (min: number) =>
    [...count.keys()]
      .filter((id) => tr[id] && (rank.get(id) ?? -1) >= min)
      .sort((a, b) => count.get(b)! - count.get(a)! || rank.get(a)! - rank.get(b)!)[0];
  const id = pick(50) ?? pick(0);
  return id ? words[rank.get(id)!] : undefined;
}
