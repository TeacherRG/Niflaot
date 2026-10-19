/**
 * «Викторина вместе»: колоды вопросов (src/core/quizGame.ts) — ничего нового не пишется, всё из данных сайта, уже
 * проверенных `npm run check`:
 * - **Тора** (`torah-<глава>`, оба режима): шаги-выборы загадок всех уроков главы (Бааль ґа-Турим и «Нифлаот Ребе»)
 *   и карточки Ребе — «к какому стиху это объяснение?» (как «Проверь себя», src/core/readCheck.ts);
 * - **Пророки и Писания** (`tanakh-<воскресенье недели>`, взрослые): «Вопросы к отрывку» всех дней недели;
 * - **Хасидут** (`hs-<воскресенье недели>`, взрослые): вопросы отрывков дня этой недели.
 * Колоды недель показываются, когда неделя началась (`from`): вопросов к ещё не открытым отрывкам в игре нет.
 * Варианты — в постоянном перемешанном порядке (в данных верный — первый). Файлы `/quiz/<язык>/<id>.json` и список
 * `/quiz/index.json` пишет scripts/prerender.ts; сервер берёт колоду с сайта, не от ведущего.
 */
import { LESSON_GROUPS, type Lesson } from '../lessons';
import { PARSHIOT } from '../lessons/parshiot';
import { displayNames } from './names';
import { readQuestions } from './readCheck';
import { addDays, weekday } from './restDays';
import { BOOKS } from './tanakhCycle';
import { allPassages, passageDate } from './hemshech';
import { validDeck, type QuizDeck, type QuizQuestion } from './quizGame';

export type QuizLang = 'ru' | 'en' | 'de';
export const QUIZ_LANGS: QuizLang[] = ['ru', 'en', 'de'];
export type DeckKind = 'torah' | 'tanakh' | 'hs';

export interface DeckInfo {
  id: string;
  kind: DeckKind;
  title: Record<QuizLang, string>;
  /** вопросов в колоде */
  n: number;
  /** колода недели — с этого дня (раньше её не предлагают) */
  from?: string;
}

type T3 = Record<QuizLang, string>;
/** «Вопросы к отрывку» одного дня: src/tanakh/quiz/<дата>.json */
export type DayQuiz = Record<'neviim' | 'ketuvim', { ref: string; q: T3; o: T3[] }[]>;

const ENT: Record<string, string> = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', laquo: '«', raquo: '»', mdash: '—', ndash: '–', hellip: '…' };
/** HTML урока → обычный текст: без сносок и тегов, Имена — как на экране. */
export const plain = (html: string) =>
  displayNames(
    html
      .replace(/<sup[^>]*>.*?<\/sup>/g, '')
      .replace(/<br\s*\/?>|<\/p>\s*<p[^>]*>/g, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&(\w+);/g, (m, e) => ENT[e] ?? m)
      .replace(/\s+/g, ' ')
      .trim(),
  );

/** Постоянный перемешанный порядок вариантов (от строки): у вопроса с верным первым — верный не всегда первый. */
function fixedOrder(n: number, seed: string): number[] {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const next = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0) / 2 ** 32;
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Вопрос с верным вариантом первым → вопрос викторины с перемешанными вариантами. */
function shuffled(q: string, opts: string[], seed: string, ex?: string, d?: string): QuizQuestion {
  const order = fixedOrder(opts.length, seed);
  return { q, o: order.map((i) => opts[i]), a: order.indexOf(0), ...(ex ? { ex } : {}), ...(d ? { d } : {}) };
}

function lessonQuestions(l: Lesson, lang: QuizLang, cardQ: string): QuizQuestion[] {
  const tx = l.texts[lang] ?? l.texts.ru!;
  const out: QuizQuestion[] = [];
  for (const rq of readQuestions(l)) {
    if (rq.card !== undefined) {
      const items = tx.cards?.items ?? [];
      const card = items[rq.card];
      if (!card) continue;
      out.push({ q: `${cardQ} «${displayNames(card.card)}»`, o: rq.opts.map((k) => plain(items[k].verse)), a: rq.c, ex: plain(tx.title) });
    }
  }
  // the choice steps of every riddle — also in a lesson with cards (its investigation)
  l.riddles.forEach((r, ri) =>
    r.steps.forEach((s, si) => {
      if (s.t !== 'ch' || s.opts.length > 4) return;
      const st = tx.riddles[ri].steps[si];
      const opts = s.opts.map((o, k) => displayNames(o.h) + (st.opts?.[k] ? ` — ${plain(st.opts[k])}` : ''));
      const right = opts[s.c];
      const q = shuffled(plain(st.q), [right, ...opts.filter((_, k) => k !== s.c)], `${l.slug}:r${ri}s${si}`, `${plain(tx.title)} · ${plain(tx.riddles[ri].title)}`);
      out.push(q);
    }),
  );
  return out;
}

const bookName = (ref: string, lang: QuizLang) => {
  const [slug, cv] = ref.split(' ');
  const b = BOOKS.find((x) => x.slug === slug);
  return b ? `${b.name[lang]} ${cv}` : ref;
};

const dm = (iso: string) => `${iso.slice(8, 10)}.${iso.slice(5, 7)}`;
/** воскресенье недели даты */
const weekOf = (iso: string) => addDays(iso, -weekday(iso));

/**
 * Все колоды на всех языках. `tanakh` — «Вопросы к отрывку» по датам; `ui` — тексты интерфейса (заголовки колод).
 */
export function buildDecks(tanakh: Record<string, DayQuiz>, ui: Record<QuizLang, Record<string, unknown>>): { index: DeckInfo[]; decks: Record<QuizLang, QuizDeck[]> } {
  const decks: Record<QuizLang, QuizDeck[]> = { ru: [], en: [], de: [] };
  const index: DeckInfo[] = [];
  const s = (lang: QuizLang, k: string) => String(ui[lang][k]);
  const add = (id: string, kind: DeckKind, title: (lang: QuizLang) => string, qs: (lang: QuizLang) => QuizQuestion[], from?: string) => {
    const per = QUIZ_LANGS.map((lang) => ({ lang, deck: { id, title: title(lang), questions: qs(lang) } }));
    if (!per[0].deck.questions.length) return;
    for (const { lang, deck } of per) decks[lang].push(deck);
    index.push({ id, kind, title: Object.fromEntries(per.map((p) => [p.lang, p.deck.title])) as T3, n: per[0].deck.questions.length, ...(from ? { from } : {}) });
  };

  for (const g of LESSON_GROUPS) {
    const lessons = [...g.lessons, ...g.rebbe];
    const name = PARSHIOT[g.id].name;
    add(
      `torah-${g.id}`,
      'torah',
      (lang) => `${s(lang, 'lq.deckTorah')} ${name[lang]}`,
      (lang) => lessons.flatMap((l) => lessonQuestions(l, lang, s(lang, 'rc.cardQ'))),
    );
  }

  const weeks = new Map<string, string[]>();
  for (const date of Object.keys(tanakh).sort()) weeks.set(weekOf(date), [...(weeks.get(weekOf(date)) ?? []), date]);
  for (const [sun, dates] of weeks) {
    const last = dates[dates.length - 1];
    add(
      `tanakh-${sun}`,
      'tanakh',
      (lang) => `${s(lang, 'lq.deckTanakh')} · ${dates.length > 1 ? `${dm(dates[0])}–` : ''}${dm(last)}.${last.slice(0, 4)}`,
      (lang) =>
        dates.flatMap((d) =>
          (['neviim', 'ketuvim'] as const).flatMap((sec) =>
            (tanakh[d][sec] ?? []).map((x, k) =>
              shuffled(x.q[lang], x.o.map((o) => o[lang]), `${d}:${sec}:${k}`, bookName(x.ref, lang), d),
            ),
          ),
        ),
      dates[0],
    );
  }

  const hsWeeks = new Map<string, { date: string; p: ReturnType<typeof allPassages>[number]['p'] }[]>();
  allPassages().forEach(({ p }, k) => {
    const date = passageDate(k);
    hsWeeks.set(weekOf(date), [...(hsWeeks.get(weekOf(date)) ?? []), { date, p }]);
  });
  for (const [sun, ps] of hsWeeks) {
    const last = ps[ps.length - 1].date;
    add(
      `hs-${sun}`,
      'hs',
      (lang) => `${s(lang, 'lq.deckHs')} · ${ps.length > 1 ? `${dm(ps[0].date)}–` : ''}${dm(last)}.${last.slice(0, 4)}`,
      (lang) => ps.flatMap(({ p, date }) => p.questions.map((x, k) => shuffled(x.q[lang], x.o.map((o) => o[lang]), `${p.id}:${k}`, p.title[lang], date))),
      ps[0].date,
    );
  }

  return { index, decks };
}

/** Колода прошла проверку сервера (validDeck) на каждом языке — иначе комната её не примет. */
export const deckProblems = (decks: Record<QuizLang, QuizDeck[]>) =>
  QUIZ_LANGS.flatMap((lang) => decks[lang].filter((d) => !validDeck(d)).map((d) => `${lang}/${d.id}`));
