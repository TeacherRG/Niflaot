/**
 * «Слова Торы» — детская колода (`#/torah-words[/<урок>]`, TorahWordsPage.tsx): слова уроков, которые дети уже видели.
 * Собирается сама из уроков — с каждым новым уроком колода растёт:
 *  - пары Memo: слова Торы с карточки (`memo.items[k].verse`), их перевод и картинка пары (`memo/NN.png`);
 *  - слова с карточек загадок (`riddles[].words`): перевод — `glossary` урока, как читается — `translit`.
 * Одно и то же слово в двух уроках — один раз (у первого урока). Имена — как на сайте (`displayNames`).
 *
 * Игра: слово на иврите (и картинка) → выбрать перевод из четырёх; у слова со звёздочкой иногда наоборот — перевод →
 * выбрать слово на иврите. Верно — звёздочка (до 3), неверно — минус одна; 3 звёздочки — слово выучено.
 * localStorage `niflaot:torah-words` = { слово: [время, с; звёзды 0–3; 0] } — та же запись, что у «Моих слов»
 * взрослых (src/core/words.ts), и то же слияние в src/core/sync.ts (у слова — более позднее изменение).
 */
import { useEffect, useState } from 'react';
import type { Locale } from '../i18n/config';
import type { Lesson } from '../lessons/types';
import { PARSHIOT, type ParshaId } from '../lessons/parshiot';
import type { Certificate, Progress } from './academy';
import { displayNames } from './names';
import { normWord, type WordEntry } from './sync';

export interface TorahWord {
  /** ключ — слово как в уроке (настоящее написание) */
  key: string;
  /** как показывать (Имена — по правилам проекта) */
  he: string;
  tr: string;
  /** как читается — у слов с карточек загадок */
  translit?: string;
  /** картинка пары Memo */
  img?: string;
  lesson: string;
  /** глава Торы урока — по ней фильтр игры и сертификат */
  parsha: ParshaId;
  /** где это в уроке: пара Memo или загадки */
  href: string;
}

export const STARS = 3;
/** сколько вопросов в одной игре */
export const ROUND = 10;

/** `images` — the pictures of a lesson's Memo pairs (src/core/memo.ts on the site; none in the checks) */
export function torahWords(lessons: Lesson[], locale: Locale, images: (l: Lesson) => string[] = () => []): TorahWord[] {
  const out: TorahWord[] = [];
  const seen = new Set<string>();
  const add = (w: TorahWord) => {
    if (!w.tr || seen.has(w.key)) return;
    seen.add(w.key);
    out.push(w);
  };
  for (const l of lessons) {
    const text = l.texts[locale] ?? l.texts.ru;
    if (!text) continue;
    if (l.memo && text.memo) {
      const imgs = images(l);
      l.memo.items.forEach((m, k) =>
        add({ key: m.verse, he: displayNames(m.verse), tr: text.memo!.items[k]?.verse ?? '', img: imgs[k], lesson: l.slug, parsha: l.parsha, href: `#/${l.slug}/memo/${k + 1}` }),
      );
    }
    for (const w of new Set(l.riddles.flatMap((r) => r.words)))
      add({ key: w, he: displayNames(w), tr: text.glossary[w] ?? '', translit: text.translit?.[w], lesson: l.slug, parsha: l.parsha, href: `#/${l.slug}` });
  }
  return out;
}

export const TORAH_WORDS_KEY = 'niflaot:torah-words';
const EVENT = 'niflaot:torah-words';
export type StarStore = Record<string, WordEntry>;
export const starsOf = (s: StarStore, key: string) => Math.min(STARS, s[key]?.[1] ?? 0);

export function readStars(): StarStore {
  try {
    const raw = JSON.parse(localStorage.getItem(TORAH_WORDS_KEY) ?? 'null');
    if (!raw || typeof raw !== 'object') return {};
    const out: StarStore = {};
    for (const [k, v] of Object.entries(raw)) out[k] = normWord(v);
    return out;
  } catch {
    return {};
  }
}

/** Ответ в игре: верно — звёздочка (до 3), неверно — минус одна. */
export function answerWord(key: string, right: boolean) {
  const s = readStars();
  const n = starsOf(s, key);
  s[key] = [Math.floor(Date.now() / 1000), right ? Math.min(STARS, n + 1) : Math.max(0, n - 1), 0];
  try {
    localStorage.setItem(TORAH_WORDS_KEY, JSON.stringify(s));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

export function useStars(): StarStore {
  const [s, set] = useState(readStars);
  useEffect(() => {
    const on = () => set(readStars());
    window.addEventListener(EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);
  return s;
}

const shuffle = <T,>(xs: T[]) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/** the core of a translation or a word, to compare: no quotes, brackets, punctuation, vowel points or case */
const core = (x: string) =>
  x
    .toLowerCase()
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[«»„“”"'’()\[\].,;:!?—–-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
/** two answers too alike to stand side by side: «свет» and «"свет" (Б-г увидел свет)», האור and את האור */
const alike = (a: TorahWord, b: TorahWord) => {
  const [x, y, p, q] = [core(a.tr), core(b.tr), core(a.he), core(b.he)];
  return x.includes(y) || y.includes(x) || p.includes(q) || q.includes(p);
};

export interface Question {
  word: TorahWord;
  /** true — по переводу выбрать слово на иврите */
  reverse: boolean;
  options: TorahWord[];
}

/**
 * Игра: до `ROUND` слов — сначала с меньшим числом звёзд (новые и забытые), в случайном порядке; к каждому — три
 * других слова с другим переводом (из того же урока, если хватает). Слово со звёздочкой — иногда наоборот.
 */
export function makeRound(words: TorahWord[], all: TorahWord[], stars: StarStore): Question[] {
  const byStars = shuffle(words).sort((a, b) => starsOf(stars, a.key) - starsOf(stars, b.key));
  return byStars.slice(0, ROUND).map((word) => {
    const pool = (ws: TorahWord[]) => shuffle(ws.filter((w) => w.key !== word.key && !alike(w, word)));
    const near = pool(all.filter((w) => w.parsha === word.parsha));
    const others: TorahWord[] = [];
    for (const w of [...near, ...pool(all)]) {
      if (others.length === 3) break;
      if (!others.some((o) => alike(o, w))) others.push(w);
    }
    return { word, reverse: starsOf(stars, word.key) > 0 && Math.random() < 0.5, options: shuffle([word, ...others]) };
  });
}

/**
 * Сертификаты «Академии» детям — «Знаток слов главы» (`tw-<глава>`): все слова главы (из всех её уроков) выучены — у каждого
 * три звезды. got — выучено, max — слов главы.
 */
export function torahWordsCertificates(words: TorahWord[], stars: StarStore): (Certificate & { progress: Progress; href: string })[] {
  const parshiot = [...new Set(words.map((w) => w.parsha))];
  return parshiot.map((id) => {
    const ws = words.filter((w) => w.parsha === id);
    const got = ws.filter((w) => starsOf(stars, w.key) >= STARS).length;
    const p = PARSHIOT[id];
    return {
      id: `tw-${id}`,
      kind: 'torahWords' as const,
      book: { id, he: p.he, name: { ru: p.name.ru, en: p.name.en ?? p.name.ru, de: p.name.de ?? p.name.ru } },
      progress: { got, max: ws.length, done: got, parts: ws.length, complete: true, earned: ws.length > 0 && got === ws.length },
      href: `#/torah-words/${id}`,
    };
  });
}
