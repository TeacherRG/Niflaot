/**
 * «Академия Нифлаот» — сертификаты за пройденные книги (страница `#/academy`, src/components/AcademyPage.tsx).
 *
 * Тора: сертификат «Знаток <учителя> · книга <Берейшит…>» — за уроки одного учителя во всех главах книги.
 * Он открывается, когда на сайте есть последняя глава книги (Ваехи, Пкудей, Бехукотай, Масэй, Ґаазину), и выдаётся,
 * когда набрано не меньше PASS (70 %) от всех возможных очков этих уроков (очки — как в итоге урока: 10 за шаг),
 * или — для того, кто только читает, — когда на страницах чтения этих уроков отвечены все вопросы «Проверь себя»
 * (src/core/readCheck.ts) и верных не меньше PASS.
 *
 * Пророки и Писания: сертификат «книга <Йеґошуа, Теґилим…>» — за «Вопросы к отрывку» (src/tanakh/quiz/<дата>.json)
 * всех дней цикла, в которых читается эта книга: все тесты пройдены и верных ответов — не меньше PASS.
 *
 * Чистые функции; браузерная часть (что сохранено на устройстве, какие тесты уже есть) — в src/core/quiz.ts.
 */
import { LESSONS, PARSHIOT, type Lesson } from '../lessons';
import { teacherOf, type TeacherId } from '../lessons/teachers';
import { BOOKS, track, type Section, type TanakhBook } from './tanakhCycle';
import type { CycleDay } from './tanakhCycle';

/** доля очков / верных ответов для сертификата */
export const PASS = 0.7;

/**
 * Ректор на сертификате: над чертой — нарисованная подпись (`RectorSignature` в AcademyPage.tsx), под чертой —
 * должность («Ректор Академии Нифлаот») и имя, если оно задано (на каждом языке сайта; null — только должность).
 */
export const RECTOR: { name: { ru: string; en: string; de: string } | null } = { name: null };

/**
 * Пять книг Торы и их главы — канонические id глав для `src/lessons/parshiot.ts` (новую главу называть отсюда;
 * сдвоенная глава — через дефис: `vayakhel-pekudei`). Последняя глава книги открывает её сертификат
 * (у Дварим — Ґаазину: Везот ґа-Браха читают в Симхат Тора).
 */
export const TORAH_BOOKS = [
  {
    id: 'bereshit',
    he: 'בראשית',
    name: { ru: 'Берейшит', en: 'Bereishit', de: 'Bereschit' },
    parshiot: ['bereshit', 'noach', 'lech-lecha', 'vayera', 'chayei-sarah', 'toldot', 'vayetze', 'vayishlach', 'vayeshev', 'miketz', 'vayigash', 'vayechi'],
  },
  {
    id: 'shemot',
    he: 'שמות',
    name: { ru: 'Шмот', en: 'Shemot', de: 'Schemot' },
    parshiot: ['shemot', 'vaera', 'bo', 'beshalach', 'yitro', 'mishpatim', 'terumah', 'tetzaveh', 'ki-tisa', 'vayakhel', 'pekudei'],
  },
  {
    id: 'vayikra',
    he: 'ויקרא',
    name: { ru: 'Ваикра', en: 'Vayikra', de: 'Wajikra' },
    parshiot: ['vayikra', 'tzav', 'shemini', 'tazria', 'metzora', 'acharei-mot', 'kedoshim', 'emor', 'behar', 'bechukotai'],
  },
  {
    id: 'bamidbar',
    he: 'במדבר',
    name: { ru: 'Бемидбар', en: 'Bamidbar', de: 'Bamidbar' },
    parshiot: ['bamidbar', 'nasso', 'behaalotecha', 'shelach', 'korach', 'chukat', 'balak', 'pinchas', 'matot', 'masei'],
  },
  {
    id: 'devarim',
    he: 'דברים',
    name: { ru: 'Дварим', en: 'Devarim', de: 'Dewarim' },
    parshiot: ['devarim', 'vaetchanan', 'eikev', 'reeh', 'shoftim', 'ki-tetze', 'ki-tavo', 'nitzavim', 'vayelech', 'haazinu', 'vezot-haberacha'],
  },
] as const;
export type TorahBookId = (typeof TORAH_BOOKS)[number]['id'];
const LAST: Record<TorahBookId, string> = { bereshit: 'vayechi', shemot: 'pekudei', vayikra: 'bechukotai', bamidbar: 'masei', devarim: 'haazinu' };

/** Книга Торы главы (сдвоенная `vayakhel-pekudei` — по первой); undefined — id не из списка. */
export function bookOfParsha(id: string): TorahBookId | undefined {
  for (const b of TORAH_BOOKS) if ((b.parshiot as readonly string[]).some((p) => id === p || id.startsWith(`${p}-`))) return b.id;
  return undefined;
}

/** Книга дочитана на сайте: среди глав есть её последняя (сама или в сдвоенной). */
export function torahBookComplete(book: TorahBookId, parshiot: string[] = Object.keys(PARSHIOT)): boolean {
  const last = LAST[book];
  return parshiot.some((p) => p === last || p.endsWith(`-${last}`) || (book === 'devarim' && p === 'vezot-haberacha'));
}

/** Все очки урока — как в итоге урока: 10 за каждый шаг каждой загадки. */
export const lessonMax = (l: Lesson) => l.riddles.reduce((a, r) => a + r.steps.length * 10, 0);

export interface Progress {
  /** набрано (очки / верные ответы) */
  got: number;
  /** из скольких возможных — по тому, что уже есть на сайте */
  max: number;
  /** пройдено частей (уроков / тестов дней) */
  done: number;
  /** всего частей (уроков / дней книги) */
  parts: number;
  /** книга целиком есть на сайте (все главы / тесты всех дней) — без этого сертификата нет */
  complete: boolean;
  earned: boolean;
  /** Тора: путь чтения — вопросы «Проверь себя» (got — верных, max — вопросов, done — отвечено, parts — уроков с вопросами) */
  read?: { got: number; max: number; done: number; parts: number; earned: boolean };
}

export interface Certificate {
  /** `t-<учитель>-<книга>` — Тора, `k-<книга>` — Пророки и Писания */
  id: string;
  kind: 'torah' | 'tanakh';
  teacher?: TeacherId;
  section?: Section;
  book: { id: string; he: string; name: { ru: string; en: string; de: string } };
}

/** Сертификаты Торы — пары «учитель × книга», где у учителя уже есть уроки. */
export function torahCertificates(lessons: Lesson[] = LESSONS): (Certificate & { lessons: Lesson[] })[] {
  const out: (Certificate & { lessons: Lesson[] })[] = [];
  for (const b of TORAH_BOOKS)
    for (const teacher of ['baal-haturim', 'rebbe'] as TeacherId[]) {
      const ls = lessons.filter((l) => teacherOf(l) === teacher && bookOfParsha(l.parsha) === b.id && lessonMax(l) > 0);
      if (ls.length)
        out.push({ id: `t-${teacher}-${b.id}`, kind: 'torah', teacher, book: { id: b.id, he: b.he, name: b.name }, lessons: ls });
    }
  return out;
}

/**
 * Прогресс сертификата Торы; `score(slug)` — очки урока на устройстве, `read(lesson)` — его вопросы «Проверь себя»
 * (отвечено, верных, всего). Сертификат — за игру или за чтение, что раньше.
 */
export function torahProgress(
  c: { book: { id: string }; lessons: Lesson[] },
  score: (slug: string) => number,
  complete: boolean,
  read?: (l: Lesson) => { done: number; got: number; n: number },
): Progress {
  let got = 0;
  let max = 0;
  let done = 0;
  for (const l of c.lessons) {
    const m = lessonMax(l);
    const s = Math.min(Math.max(0, score(l.slug)), m);
    got += s;
    max += m;
    if (s > 0) done++;
  }
  const game = complete && max > 0 && got >= PASS * max;
  if (!read) return { got, max, done, parts: c.lessons.length, complete, earned: game };
  const r = { got: 0, max: 0, done: 0, parts: 0, earned: false };
  let answered = 0;
  for (const l of c.lessons) {
    const x = read(l);
    r.got += x.got;
    r.max += x.n;
    answered += x.done;
    if (x.n) r.parts++;
    if (x.n && x.done === x.n) r.done++;
  }
  // every lesson of the book has questions, all are answered, and enough are right
  r.earned = complete && r.max > 0 && r.parts === c.lessons.length && answered === r.max && r.got >= PASS * r.max;
  return { got, max, done, parts: c.lessons.length, complete, earned: game || r.earned, read: r };
}

/** Дни цикла, в которых читается эта книга (в её разделе). */
export function bookDays(book: TanakhBook, cycle: CycleDay[]): CycleDay[] {
  const t = track(book.section);
  return cycle.filter((d) => {
    const [from, to] = d[book.section];
    for (let i = from; i < to; i++) if (t[i].book === book) return true;
    return false;
  });
}

/** Сертификаты Пророков и Писаний — по книге; в списке — книги, до которых цикл уже дошёл (`today`). */
export function tanakhCertificates(cycle: CycleDay[], today: string): (Certificate & { days: CycleDay[] })[] {
  return BOOKS.map((b) => ({ b, days: bookDays(b, cycle) }))
    .filter(({ days }) => days.length && days[0].date <= today)
    .map(({ b, days }) => ({ id: `k-${b.slug}`, kind: 'tanakh' as const, section: b.section, book: { id: b.slug, he: b.he, name: b.name }, days }));
}

/** Результат теста одного дня на устройстве: выбранные варианты и лучший результат. */
export interface QuizResult {
  /** выбранный вариант каждого вопроса (индекс в файле; верный — 0); -1 — ещё не ответил */
  p: number[];
  /** лучший результат законченного теста (верных); -1 — тест ещё ни разу не закончен */
  best: number;
  /** вопросов в тесте */
  n: number;
}
export type QuizStore = Record<string, QuizResult>;
export const quizKey = (date: string, section: Section) => `${date}:${section}`;

/** Прогресс сертификата книги Пророков / Писаний; `ready(date)` — тест этого дня уже написан. */
export function tanakhProgress(c: { section?: Section; days: CycleDay[] }, store: QuizStore, ready: (date: string) => boolean): Progress {
  let got = 0;
  let max = 0;
  let done = 0;
  let readyDays = 0;
  for (const d of c.days) {
    if (ready(d.date)) readyDays++;
    const r = store[quizKey(d.date, c.section!)];
    if (r && r.n > 0 && r.best >= 0) {
      done++;
      got += Math.min(r.best, r.n);
      max += r.n;
    }
  }
  const complete = readyDays === c.days.length;
  return { got, max, done, parts: c.days.length, complete, earned: complete && done === c.days.length && max > 0 && got >= PASS * max };
}
