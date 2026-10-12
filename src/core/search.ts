/**
 * «Поиск» (`#/search?q=…`, src/components/SearchPage.tsx): one index of everything on the site in the language of the
 * page — lessons and every chapter of a lesson (the retelling, the summary), Memo pairs, the Rebbe's cards, the feed
 * «Знаете ли вы?» (equal gematria — also by a number: «26», or by a Hebrew word: its value and what equals it),
 * the books of the Prophets and Writings («Теґилим 23» — the day of the cycle the chapter is read), the terms of the
 * dictionary and the pages of the menu. Built from the data itself, so a new lesson is found by itself.
 *
 * The search forgives spelling: case, niqqud, final letters, ґ/г, ё/е, umlauts, hyphens and quotes are ignored;
 * every word of the query must occur (anywhere in the title or the text).
 */
import type { Locale } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { LESSONS, PARSHIOT, type Lesson } from '../lessons';
import { teacherOf } from '../lessons/teachers';
import { GLOSSARY } from '../i18n/glossary';
import { collectFacts } from './facts';
import { gematria, letters } from './gematria';
import { BOOKS, track, type Section, type TanakhBook } from './tanakhCycle';
import type { CycleDay } from './tanakhCycle';

export type HitKind = 'lesson' | 'chapter' | 'memo' | 'card' | 'fact' | 'term' | 'word' | 'page';
/** The groups of the results page (the books of the Prophets and Writings — `searchTanakh`). */
export type HitGroup = 'lessons' | 'facts' | 'terms' | 'pages';
export const GROUP_OF: Record<HitKind, HitGroup> = {
  lesson: 'lessons',
  chapter: 'lessons',
  memo: 'lessons',
  card: 'lessons',
  fact: 'facts',
  term: 'terms',
  word: 'terms',
  page: 'pages',
};

export interface Doc {
  kind: HitKind;
  title: string;
  /** Hebrew shown next to the title */
  he?: string;
  /** plain text: what the snippet is cut from */
  body: string;
  /** where it is: «Рав Гинзбург · Берейшит», the lesson's title… */
  where?: string;
  href?: string;
  /** a whole lesson weighs more than one of its chapters */
  boost: number;
  /** for a fact: its value (a number query finds it) */
  value?: number;
  /** normalized title + Hebrew, body (built once) */
  nt: string;
  nb: string;
}

export interface Hit {
  doc: Doc;
  score: number;
}

/* ───────────── normalization ───────────── */

const FINAL: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };
/** joined: hyphens and quotes inside words («ґа-Турим», «ה׳», «ר״ת») */
const JOIN = /[\-‐‑–—־״׳"'`’‘]/;
const WORD = /[\p{L}\p{N}]/u;

/**
 * Text for comparing: lower case, no niqqud or accents, ґ → г, ё → е, ß → ss, final letters → ordinary, hyphens and
 * quotes dropped, any other punctuation — one space. `map[i]` — the index in the original of the i-th character.
 */
export function normMap(s: string): { n: string; map: number[] } {
  let n = '';
  const map: number[] = [];
  let i = 0;
  for (const ch of s) {
    let out = ch
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-֑ͯ-ׇ]/g, '');
    if (out === 'ґ') out = 'г';
    else if (out === 'ß') out = 'ss';
    else if (FINAL[out]) out = FINAL[out];
    else if (JOIN.test(out)) out = '';
    else if (out && !WORD.test(out)) out = ' ';
    for (const c of out) {
      if (c === ' ' && (n === '' || n.endsWith(' '))) continue;
      n += c;
      map.push(i);
    }
    i += ch.length;
  }
  return { n, map };
}
export const norm = (s: string) => normMap(s).n.trim();

/** HTML of a lesson text as plain text. */
export function plain(html: string): string {
  return html
    .replace(/<sup[^>]*>.*?<\/sup>/g, '')
    .replace(/<(br|\/p|\/li|\/h\d)\b[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const HEBREW = /[א-ת]/;
/** The query is a Hebrew word or phrase: its gematria is worth showing. */
export const isHebrew = (q: string) => HEBREW.test(q) && !/[a-zа-яäöü]/i.test(q);

/* ───────────── the index ───────────── */

type Lang = 'ru' | 'en' | 'de';
const langOf = (l: Locale): Lang => (l === 'en' || l === 'de' ? l : 'ru');
type T = (key: MessageKey) => string;

const doc = (d: Omit<Doc, 'nt' | 'nb'>): Doc => ({ ...d, nt: norm(`${d.title} ${d.he ?? ''}`), nb: norm(d.body) });

function lessonDocs(l: Lesson, locale: Locale, t: T): Doc[] {
  const text = l.texts[locale] ?? l.texts.ru!;
  const parsha = PARSHIOT[l.parsha];
  const parshaName = parsha.name[langOf(locale)] ?? parsha.name.ru;
  const teacher = t(`teacher.${teacherOf(l)}.short` as MessageKey);
  const where = `${l.series === 'rebbe' ? t('rebbe.title') : teacher} · ${parshaName}`;
  const out: Doc[] = [
    doc({
      kind: 'lesson',
      title: text.title,
      he: l.hebrewTitle,
      body: plain([text.summary, text.hero.heading, text.hero.author, text.hero.intro, text.practice, parshaName, parsha.he, teacher].join(' · ')),
      where,
      href: `#/${l.slug}`,
      boost: 6,
    }),
  ];
  const read = l.kind !== 'sicha';
  text.riddles.forEach((r, ri) =>
    out.push(
      doc({
        kind: 'chapter',
        title: r.title,
        body: plain(
          [r.cond, r.reveal.h, r.reveal.p, ...r.lessons.flatMap((x) => [x.h, x.b]), ...(r.takeaways ?? []), r.reflection].join(' · '),
        ),
        where: text.title,
        href: read ? `#/${l.slug}/read/${ri + 1}` : `#/${l.slug}/r/${ri + 1}`,
        boost: 2,
      }),
    ),
  );
  text.memo?.items.forEach((it, mi) =>
    out.push(
      doc({
        kind: 'memo',
        title: it.title,
        he: l.memo?.items[mi]?.verse,
        body: plain([it.caption, it.verse, it.quote, it.explain, it.note ?? '', it.moral].join(' · ')),
        where: text.title,
        href: `#/${l.slug}/memo/${mi + 1}`,
        boost: 1,
      }),
    ),
  );
  text.cards?.items.forEach((it, ci) =>
    out.push(
      doc({
        kind: 'card',
        title: it.title,
        he: l.cards?.items[ci]?.verse,
        body: plain([it.verse, it.card, it.explain, it.horaah].join(' · ')),
        where: text.title,
        href: `#/${l.slug}/read`,
        boost: 1,
      }),
    ),
  );
  // the words of the word cards with their translation: «гордыня» finds גאוה
  for (const [he, tr] of Object.entries(text.glossary))
    out.push(doc({ kind: 'word', title: plain(tr), he, body: text.translit?.[he] ?? '', where: text.title, href: `#/${l.slug}`, boost: 0 }));
  return out;
}

function factDocs(locale: Locale): Doc[] {
  return collectFacts(LESSONS).map((f) => {
    const text = f.lesson.texts[locale] ?? f.lesson.texts.ru!;
    const gloss = (h: string) => h.split(' + ').map((w) => text.glossary[w] ?? text.glossary[w.trim()] ?? '');
    if (f.kind === 'eq') {
      const heb = [f.q, ...f.rest.slice(1)];
      return doc({
        kind: 'fact',
        title: `${f.q} = ${f.rest.join(' = ')}`,
        body: plain(heb.flatMap(gloss).join(' · ')),
        where: text.title,
        href: `#/facts/${f.id}`,
        boost: 1,
        value: f.v,
      });
    }
    return doc({
      kind: 'fact',
      title: `${f.from} → ${f.word}`,
      body: plain([...gloss(f.from), ...gloss(f.word)].join(' · ')),
      where: text.title,
      href: `#/facts/${f.id}`,
      boost: 1,
    });
  });
}

function termDocs(locale: Locale): Doc[] {
  return (GLOSSARY[locale] ?? GLOSSARY.ru ?? []).map((term) => {
    // the name of the term is the start of its definition: «Тикун — …», «„Парцуф“ — …»
    const name = term.def.split(/ — | – /)[0].replace(/[«»"„“”]/g, '').trim();
    return doc({ kind: 'term', title: name, body: term.def, boost: 1 });
  });
}

/** The pages of the menu: their names are found too («сертификат» → «Академия»). */
const PAGES: { href: string; title: MessageKey; sub?: MessageKey }[] = [
  { href: '#/my', title: 'my.title', sub: 'my.menuSub' },
  { href: '#/facts', title: 'facts.title', sub: 'facts.menuSub' },
  { href: '#/daily', title: 'daily.title', sub: 'daily.menuSub' },
  { href: '#/academy', title: 'academy.title', sub: 'academy.menuSub' },
  { href: '#/neviim', title: 'tanakh.neviim', sub: 'tanakh.daySub' },
  { href: '#/ketuvim', title: 'tanakh.ketuvim', sub: 'tanakh.daySub' },
  { href: '#/neviim/quiz', title: 'quiz.title', sub: 'quiz.menuSub' },
  { href: '#/letters', title: 'abc.title', sub: 'abc.menuSub' },
  { href: '#/math/add', title: 'math.title' },
  { href: '#/teacher', title: 'teacher.title' },
  { href: '#/partners', title: 'partners.title' },
  { href: '#/account', title: 'acc.title' },
  { href: '#/privacy', title: 'privacy.title' },
];

function pageDocs(locale: Locale, t: T): Doc[] {
  const out = PAGES.map((p) => doc({ kind: 'page', title: t(p.title), body: p.sub ? t(p.sub) : '', href: p.href, boost: 4 }));
  for (const id of Object.keys(PARSHIOT) as (keyof typeof PARSHIOT)[]) {
    const p = PARSHIOT[id];
    const name = p.name[langOf(locale)] ?? p.name.ru;
    out.push(doc({ kind: 'page', title: `${t('rebbe.title')} · ${name}`, he: p.he, body: t('rebbe.intro'), href: `#/rebbe/${id}`, boost: 2 }));
  }
  return out;
}

const cache = new Map<string, Doc[]>();
/** The index of the site in this language (built on the first search). */
export function buildIndex(locale: Locale, t: T): Doc[] {
  let d = cache.get(locale);
  if (!d) {
    d = [...LESSONS.flatMap((l) => lessonDocs(l, locale, t)), ...factDocs(locale), ...termDocs(locale), ...pageDocs(locale, t)];
    cache.set(locale, d);
  }
  return d;
}

/* ───────────── searching ───────────── */

const startsWord = (hay: string, i: number) => i === 0 || hay[i - 1] === ' ';
const DIGIT = /\d/;

/** Where the word of the query occurs: a number only as a whole number («26» is not in «1269»). */
function find(hay: string, w: string): number {
  if (!DIGIT.test(w[0])) return hay.indexOf(w);
  for (let i = hay.indexOf(w); i >= 0; i = hay.indexOf(w, i + 1))
    if (!DIGIT.test(hay[i - 1] ?? '') && !DIGIT.test(hay[i + w.length] ?? '')) return i;
  return -1;
}

/** Every word of the query must occur; a word in the title weighs more, the start of a word more than its middle. */
export function search(index: Doc[], query: string): Hit[] {
  const q = norm(query);
  if (!q) return [];
  const words = q.split(' ');
  const num = /^\d+$/.test(q) ? Number(q) : undefined;
  const hits: Hit[] = [];
  for (const d of index) {
    let score = 0;
    if (num !== undefined && d.value === num) score += 30;
    let all = true;
    for (const w of words) {
      const it = find(d.nt, w);
      const ib = find(d.nb, w);
      if (it < 0 && ib < 0) {
        all = false;
        break;
      }
      if (it >= 0) score += startsWord(d.nt, it) ? 12 : 6;
      else score += startsWord(d.nb, ib) ? 3 : 1;
    }
    if (!all) {
      // a number finds a fact by its value too
      if (num !== undefined && d.value === num) hits.push({ doc: d, score: 30 + d.boost });
      continue;
    }
    if (d.nt === q || d.nt.startsWith(`${q} `)) score += 20;
    else if (words.length > 1 && d.nt.includes(q)) score += 10;
    else if (words.length > 1 && d.nb.includes(q)) score += 4;
    hits.push({ doc: d, score: score + d.boost });
  }
  return hits.sort((a, b) => b.score - a.score);
}

/**
 * Pieces of `text` with the words of the query marked: the title whole, a long text cut around the first match
 * (`max` characters).
 */
export function highlight(text: string, query: string, max = Infinity): { s: string; mark?: boolean }[] {
  const words = norm(query).split(' ').filter(Boolean);
  const { n, map } = normMap(text);
  const marks: [number, number][] = [];
  for (const w of words)
    for (let i = n.indexOf(w); i >= 0; i = n.indexOf(w, i + w.length)) {
      if (DIGIT.test(w[0]) && (DIGIT.test(n[i - 1] ?? '') || DIGIT.test(n[i + w.length] ?? ''))) continue;
      const end = i + w.length - 1;
      marks.push([map[i], map[end] + (text.codePointAt(map[end])! > 0xffff ? 2 : 1)]);
    }
  marks.sort((a, b) => a[0] - b[0]);
  let from = 0;
  let to = text.length;
  if (text.length > max) {
    const at = marks[0]?.[0] ?? 0;
    from = Math.max(0, at - Math.round(max * 0.35));
    to = Math.min(text.length, from + max);
    from = Math.max(0, to - max);
    // whole words
    if (from > 0) from = text.indexOf(' ', from) + 1 || from;
    if (to < text.length) to = text.lastIndexOf(' ', to) > from ? text.lastIndexOf(' ', to) : to;
  }
  const out: { s: string; mark?: boolean }[] = [];
  if (from > 0) out.push({ s: '… ' });
  let i = from;
  for (const [a, b] of marks) {
    if (b <= i || a >= to) continue;
    const s = Math.max(a, i);
    if (s > i) out.push({ s: text.slice(i, s) });
    out.push({ s: text.slice(s, Math.min(b, to)), mark: true });
    i = Math.min(b, to);
  }
  if (i < to) out.push({ s: text.slice(i, to) });
  if (to < text.length) out.push({ s: ' …' });
  return out;
}

/* ───────────── the Prophets and the Writings ───────────── */

export interface TanakhHit {
  book: TanakhBook;
  /** the chapter (and verse) asked for, if any */
  chapter?: number;
  verse?: number;
  /** the day of the cycle the chapter (or the book) begins; and the last day of the book */
  date: string;
  last: string;
  section: Section;
}

/** The day of the cycle whose passage of `section` has the verse number `i` of the section. */
const dayOf = (cycle: CycleDay[], section: Section, i: number) => cycle.find((d) => d[section][0] <= i && i < d[section][1]);

/**
 * «Теґилим 23», «Tehillim 23:4», «יהושע», «Судьи»: the book of the Prophets or Writings named in the query
 * (in any language of the site, in Hebrew, or by the translation of its name) and the day the chapter is read.
 */
export function searchTanakh(query: string, cycle: CycleDay[]): TanakhHit[] {
  const q = norm(query.replace(/(\d)\s*[:.,]\s*(\d)/g, '$1 $2'));
  if (!q) return [];
  const nums = q.split(' ').filter((w) => /^\d+$/.test(w)).map(Number);
  const name = q
    .split(' ')
    .filter((w) => !/^\d+$/.test(w))
    .join(' ');
  if (name.length < 2) return [];
  const out: TanakhHit[] = [];
  for (const book of BOOKS) {
    const names = [book.he, ...Object.values(book.name), ...Object.values(book.gloss ?? {}), book.sefaria].map(norm);
    if (!names.some((n) => n.startsWith(name) || n.split(' ').some((p) => p.startsWith(name)) || (name.length > 3 && n.includes(name)))) continue;
    const t = track(book.section);
    const first = t.findIndex((v) => v.book === book);
    const lastIdx = first + book.verses.reduce((a, b) => a + b, 0) - 1;
    const [chapter, verse] = nums;
    let idx = first;
    if (chapter && chapter <= book.verses.length) {
      const v = verse && verse <= book.verses[chapter - 1] ? verse : 1;
      idx = t.findIndex((x) => x.book === book && x.chapter === chapter && x.verse === v);
    }
    const day = dayOf(cycle, book.section, idx);
    const last = dayOf(cycle, book.section, lastIdx);
    if (!day || !last) continue;
    out.push({
      book,
      chapter: chapter && chapter <= book.verses.length ? chapter : undefined,
      verse: chapter && verse && verse <= (book.verses[chapter - 1] ?? 0) ? verse : undefined,
      date: day.date,
      last: last.date,
      section: book.section,
    });
  }
  return out;
}

/** The query as Hebrew letters: its gematria (to show «גאוה = 15» and the facts equal to it). */
export function queryGematria(query: string): number | null {
  if (!isHebrew(query)) return null;
  const he = query.replace(/[^א-ת ]/g, '').trim();
  return letters(he).length ? gematria(he) : null;
}
