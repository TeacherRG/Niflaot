/**
 * «К шабатнему столу» — the Friday sheet of a weekly portion (`#/shabbat-table[/<глава>]`, ShabbatTable.tsx): printed
 * before Shabbat and read aloud at the table — for those who don't read the site. Everything comes from the lessons of
 * the portion, nothing is written for it: the talk of «Нифлаот Ребе» told plainly (its question and, riddle by riddle,
 * the Rebbe's answers), two verses of the portion with the Rebbe's explanation (the «Карточки» pairs),
 * two gematrias of the Baal HaTurim with their explanation and lesson (the Memo pairs), questions to talk over and
 * «Ґораа ле-поаль». No letter table, no riddles to count. A new lesson gets onto the sheet by itself.
 */
import { LESSONS, PARSHIOT, type Lesson, type ParshaId } from '../lessons';
import { stripFootnotes } from '../sources/footnotes';

/** How many of each kind fit on two pages of A4. */
export const TABLE_LIMITS = { verses: 2, gematria: 2, questions: 2 } as const;

export interface TableSheet {
  parsha: ParshaId;
  lessons: Lesson[];
  /** the talk of «Нифлаот Ребе» told on the sheet */
  sicha: Lesson | null;
  /** verses of the portion with the Rebbe's explanation: lesson and pair index (0-based) of its cards */
  verses: { lesson: Lesson; k: number }[];
  /** gematrias of the commentary: lesson and pair index of its Memo game */
  gematria: { lesson: Lesson; k: number }[];
  /** questions to talk over: lesson and riddle index */
  questions: { lesson: Lesson; ri: number }[];
}

/** Round robin over the lessons, so each teacher gets a turn. */
function interleave<T>(lists: T[][], n: number): T[] {
  const out: T[] = [];
  for (let i = 0; out.length < n && lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length && out.length < n) out.push(l[i]);
  return out;
}

/** n items spread evenly over a list (its first, its middle…), in order. */
function spread<T>(list: T[], n: number): T[] {
  if (list.length <= n) return list;
  return Array.from({ length: n }, (_, i) => list[Math.floor((i * list.length) / n)]);
}

const plain = (html: string) => stripFootnotes(html).replace(/<[^>]+>/g, ' ');
const letters = (s: string) => s.replace(/[^א-ת]/g, '');

/**
 * The Rebbe's verses for the sheet: the pairs whose verse is not on the sheet already — neither quoted in the talk (told
 * above) nor the verse of a gematria (`taken`: their letters) — spread over the portion.
 */
function sichaVerses(l: Lesson, taken: string[]): number[] {
  const talk = letters(l.texts.ru!.riddles.map((r) => plain(r.cond)).join(' '));
  const items = (l.cards?.items ?? []).map((c, k) => ({
    v: letters(c.verse),
    k,
  }));
  const fresh = items.filter(({ v }) => !talk.includes(v) && !taken.some((g) => g.includes(v) || v.includes(g)));
  return spread(fresh.length >= TABLE_LIMITS.verses ? fresh : items, TABLE_LIMITS.verses).map((x) => x.k);
}

/** The Memo pairs with a gematria; first those whose number equals other words («a = b»), spread over the lesson. */
function memoGematria(l: Lesson): number[] {
  const items = (l.memo?.items ?? []).map((m, k) => ({ m, k })).filter(({ m }) => m.gematria?.length);
  const eq = items.filter(({ m }) => m.gematria!.some((g) => g.b));
  const rest = items.filter(({ m }) => !m.gematria!.some((g) => g.b));
  return [...spread(eq, TABLE_LIMITS.gematria), ...spread(rest, TABLE_LIMITS.gematria)]
    .slice(0, TABLE_LIMITS.gematria)
    .sort((a, b) => a.k - b.k)
    .map((x) => x.k);
}

/** The sheet of a portion, or null when it has no lessons. */
export function tableSheet(parsha: ParshaId): TableSheet | null {
  if (!(parsha in PARSHIOT)) return null;
  const lessons = LESSONS.filter((l) => l.parsha === parsha);
  if (!lessons.length) return null;
  const rebbe = lessons.filter((l) => l.series === 'rebbe');
  const sicha = rebbe.find((l) => l.riddles.length) ?? null;
  const commentary = lessons.filter((l) => l.memo);
  const gematria = interleave(
    commentary.map((l) => memoGematria(l).map((k) => ({ lesson: l, k }))),
    TABLE_LIMITS.gematria,
  );
  const taken = gematria.map(({ lesson, k }) => letters(lesson.memo!.items[k].verse));
  const verses = interleave(
    rebbe.filter((l) => l.cards).map((l) => sichaVerses(l, taken).map((k) => ({ lesson: l, k }))),
    TABLE_LIMITS.verses,
  );
  // the last riddle's question of each lesson: the talk and the lesson for life come at the end
  const questions = interleave(
    lessons.map((l) => l.riddles.map((_, ri) => ({ lesson: l, ri })).reverse()),
    TABLE_LIMITS.questions,
  );
  return { parsha, lessons, sicha, verses, gematria, questions };
}
