/**
 * «Пророки» и «Писания»: трёхлетний цикл чтения Невиим и Ктувим — параллельно, каждый учебный день
 * отрывок из обоих разделов, и оба заканчиваются в один день.
 *
 * Учебные дни — все, кроме Шабата и праздников (как в диаспоре): Рош ґа-Шана (1–2 тишрея), Йом Кипур (10 тишрея),
 * Суккот (15–16 тишрея), Шмини Ацерет и Симхат Тора (22–23 тишрея), Песах (15–16 и 21–22 нисана), Шавуот (6–7 сивана)
 * и 9 ава (Тиша бе-Ав; когда 9 ава в Шабат — 10 ава): в этот день Танах не учат.
 * Цикл: с 11.10.2026 (первое воскресенье после Симхат Тора 5787) до Симхат Тора 5790 — вместе с тремя годовыми циклами Торы.
 *
 * Расписание считает scripts/tanakh-cycle.ts (→ src/tanakh/cycle.json), проверяет `npm run check`.
 */
import booksJson from '../tanakh/books.json';

export type Section = 'neviim' | 'ketuvim';
export const SECTIONS: Section[] = ['neviim', 'ketuvim'];

export interface TanakhBook {
  slug: string;
  section: Section;
  /** название книги на Sefaria */
  sefaria: string;
  he: string;
  name: { ru: string; en: string; de: string };
  /** перевод названия, где имя книги — ивритское («Шофтим» — «Судьи») */
  gloss?: { ru?: string; en?: string; de?: string };
  /** число стихов в каждой главе (по ивритскому тексту Sefaria) */
  verses: number[];
}
export const BOOKS = booksJson.books as TanakhBook[];

export const CYCLE_START = '2026-10-11';
/** Цикл кончается перед этим днём (22 тишрея 5790 — Шмини Ацерет). */
export const CYCLE_END_HEBREW = { year: 5790, month: 'Tishri', day: 22 };

/** Сколько стихов подряд можно сдвинуть границу дня, чтобы она пришлась на конец главы. */
export const SNAP = 3;

const heb = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Еврейская дата для `YYYY-MM-DD` (календарь браузера / Node, Intl). */
export function hebrewParts(iso: string) {
  const parts = heb.formatToParts(new Date(`${iso}T12:00:00Z`));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { year: Number(get('year')), month: get('month'), day: Number(get('day')) };
}

const weekday = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay();
export const addDays = (iso: string, n: number) => new Date(Date.parse(`${iso}T12:00:00Z`) + n * 86400000).toISOString().slice(0, 10);

const HOLIDAYS: Record<string, number[]> = { Tishri: [1, 2, 10, 15, 16, 22, 23], Nisan: [15, 16, 21, 22], Sivan: [6, 7] };

/** Почему в этот день нет чтения: 'shabbat', 'holiday', 'tishaBeAv' — или null (учебный день). */
export function restReason(iso: string): 'shabbat' | 'holiday' | 'tishaBeAv' | null {
  if (weekday(iso) === 6) return 'shabbat';
  const h = hebrewParts(iso);
  if (HOLIDAYS[h.month]?.includes(h.day)) return 'holiday';
  // 9 ава; когда оно в Шабат, пост — в воскресенье, 10 ава
  if (h.month === 'Av' && (h.day === 9 || (h.day === 10 && weekday(iso) === 0))) return 'tishaBeAv';
  return null;
}

/** Все учебные дни цикла по порядку. */
export function studyDays(): string[] {
  const out: string[] = [];
  for (let d = CYCLE_START; ; d = addDays(d, 1)) {
    const h = hebrewParts(d);
    if (h.year === CYCLE_END_HEBREW.year && h.month === CYCLE_END_HEBREW.month && h.day >= CYCLE_END_HEBREW.day) break;
    if (!restReason(d)) out.push(d);
  }
  return out;
}

/** Стих раздела по номеру в разделе (0 — первый стих первой книги). */
export interface VerseRef {
  book: TanakhBook;
  chapter: number;
  verse: number;
}

const tracks = new Map<Section, VerseRef[]>();
export function track(section: Section): VerseRef[] {
  let t = tracks.get(section);
  if (!t) {
    t = [];
    for (const book of BOOKS.filter((b) => b.section === section))
      book.verses.forEach((n, c) => {
        for (let v = 1; v <= n; v++) t!.push({ book, chapter: c + 1, verse: v });
      });
    tracks.set(section, t);
  }
  return t;
}

/**
 * Делит раздел (total стихов) на days дней поровну; граница дня сдвигается до SNAP стихов, чтобы прийтись
 * на конец главы. Возвращает days + 1 границ: день i — стихи [b[i], b[i+1]).
 */
export function splitTrack(section: Section, days: number): number[] {
  const t = track(section);
  const total = t.length;
  const chapterStart = (i: number) => i === 0 || i === total || t[i].verse === 1;
  const b = [0];
  for (let i = 1; i < days; i++) {
    const even = Math.round((i * total) / days);
    let best = even;
    for (let d = 1; d <= SNAP && best === even && !chapterStart(even); d++) {
      if (chapterStart(even - d)) best = even - d;
      else if (chapterStart(even + d)) best = even + d;
    }
    // каждый день — хотя бы один стих
    b.push(Math.min(Math.max(best, b[i - 1] + 1), total - (days - i)));
  }
  b.push(total);
  return b;
}

/** Один день цикла (из src/tanakh/cycle.json): дата и стихи каждого раздела [с, до). */
export interface CycleDay {
  date: string;
  neviim: [number, number];
  ketuvim: [number, number];
}

/** «Йеґошуа 1:1–18», «Теґилим 1:1 – 2:12» — отрывок [from, to) раздела. */
export function rangeLabel(section: Section, [from, to]: [number, number], lang: 'ru' | 'en' | 'de' | 'he') {
  const t = track(section);
  const parts: string[] = [];
  let i = from;
  while (i < to) {
    const book = t[i].book;
    let j = i;
    while (j + 1 < to && t[j + 1].book === book) j++;
    const a = t[i];
    const z = t[j];
    const name = lang === 'he' ? book.he : book.name[lang];
    const span =
      a.chapter === z.chapter
        ? a.verse === 1 && z.verse === book.verses[a.chapter - 1]
          ? `${a.chapter}`
          : `${a.chapter}:${a.verse}${z.verse !== a.verse ? `–${z.verse}` : ''}`
        : a.verse === 1 && z.verse === book.verses[z.chapter - 1]
          ? `${a.chapter}–${z.chapter}`
          : `${a.chapter}:${a.verse} – ${z.chapter}:${z.verse}`;
    parts.push(`${name} ${span}`);
    i = j + 1;
  }
  return parts.join('; ');
}
