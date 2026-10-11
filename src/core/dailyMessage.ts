/**
 * «Сообщение дня» — the daily notification («Напоминать каждый день», src/core/push.ts): one short message a day
 * from the lessons of the current weekly portion — a riddle of «Знаете ли вы?» (only the question; the answer is on
 * the site), a «Знаете ли вы?» of a Memo pair, a takeaway, an explanation of the Rebbe, a «Ґораа ле-поаль».
 *
 * The portion of a day: the first one whose Shabbat is that day or later (its week runs Sunday → Shabbat); after
 * the last portion of PARSHIOT — the last one. The messages of a portion go in turn, one per day, from the Sunday of
 * its week; a week has six days without Shabbat, so a portion with ≥ 6 messages never repeats one in its week
 * (`npm run check` makes sure of it). On Shabbat there is no message.
 *
 * scripts/prerender.ts writes the schedule for the coming days to dist/daily-message.json; the service worker
 * (public/sw.js) shows the message of the device's date when the push arrives.
 */
import { LESSONS, PARSHIOT, type Lesson, type ParshaId } from '../lessons';
import { collectFacts } from './facts';
import { displayNames } from './names';
import { stripFootnotes } from '../sources/footnotes';
import ru from '../i18n/locales/ru';
import en from '../i18n/locales/en';
import de from '../i18n/locales/de';

const UI = { ru, en, de } as const;
export type MsgLocale = keyof typeof UI;
export const MSG_LOCALES = Object.keys(UI) as MsgLocale[];

export interface DailyMessage {
  /** stable: the same message has the same id in every schedule */
  id: string;
  /** per language: notification title, body and the link (a hash route of the site) */
  text: Record<MsgLocale, { title: string; body: string; route: string }>;
}

const MAX_BODY = 220;
const t = (loc: MsgLocale, key: string) => String((UI[loc] as Record<string, unknown>)[key] ?? (ru as Record<string, unknown>)[key]);
/** plain text: no markup, footnotes or extra spaces; Names of G-d as on screen; not longer than a notification shows */
const plain = (html: string) => {
  const s = displayNames(stripFootnotes(html).replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim());
  return s.length > MAX_BODY ? `${s.slice(0, MAX_BODY - 1).replace(/\s+\S*$/, '')}…` : s;
};
const tx = (l: Lesson, loc: MsgLocale) => l.texts[loc] ?? l.texts.ru!;
const title = (l: Lesson, loc: MsgLocale) =>
  `${t(loc, l.series === 'rebbe' ? 'rebbe.title' : 'app.title')} · ${PARSHIOT[l.parsha].name[loc] ?? PARSHIOT[l.parsha].name.ru}`;
const per = (f: (loc: MsgLocale) => { title: string; body: string; route: string }) =>
  Object.fromEntries(MSG_LOCALES.map((loc) => [loc, f(loc)])) as DailyMessage['text'];

/** Round robin: one from each list in turn, so the days of a week differ in kind. */
function interleave<T>(lists: T[][]): T[] {
  const out: T[] = [];
  for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

function lessonMessages(l: Lesson): DailyMessage[] {
  const facts: DailyMessage[] = collectFacts([l]).map((f) => ({
    id: `fact:${f.id}`,
    text: per((loc) => {
      const he = f.kind === 'eq' ? f.q : f.from;
      const gloss = he.split(' + ').map((w) => tx(l, loc).glossary[w]).filter(Boolean).join(' + ');
      const q = f.kind === 'eq' ? t(loc, 'facts.qEq') : t(loc, `facts.qLt.${f.take}`);
      return {
        title: title(l, loc),
        body: plain(`${q} ${displayNames(he)}${gloss ? ` (${gloss})` : ''}? ${t(loc, 'push.answerOnSite')}`),
        route: `facts/${f.id}`,
      };
    }),
  }));
  const memo: DailyMessage[] = (l.memo?.items ?? []).map((_, i) => ({
    id: `memo:${l.slug}:${i}`,
    text: per((loc) => {
      const it = tx(l, loc).memo!.items[i];
      return { title: title(l, loc), body: plain(`${it.title}. ${it.explain}`), route: `${l.slug}/memo/${i + 1}` };
    }),
  }));
  const cards: DailyMessage[] = (l.cards?.items ?? []).map((_, i) => ({
    id: `card:${l.slug}:${i}`,
    text: per((loc) => {
      const it = tx(l, loc).cards!.items[i];
      return { title: title(l, loc), body: plain(`«${it.verse}» — ${it.card}. ${it.horaah}`), route: `${l.slug}/read` };
    }),
  }));
  const takeaways: DailyMessage[] = l.riddles.flatMap((_, ri) =>
    (tx(l, 'ru').riddles[ri].takeaways ?? []).map((_, k) => ({
      id: `take:${l.slug}:${ri}:${k}`,
      text: per((loc) => ({
        title: title(l, loc),
        body: plain(tx(l, loc).riddles[ri].takeaways?.[k] ?? tx(l, 'ru').riddles[ri].takeaways![k]),
        route: l.kind === 'sicha' ? l.slug : `${l.slug}/read/${ri + 1}`,
      })),
    })),
  );
  const practice: DailyMessage = {
    id: `practice:${l.slug}`,
    text: per((loc) => ({ title: title(l, loc), body: plain(tx(l, loc).practice), route: l.slug })),
  };
  return [...interleave([facts, memo, cards, takeaways]), practice];
}

/** All the messages of a portion: its lessons in turn (every teacher), each lesson's kinds in turn. */
export function parshaMessages(p: ParshaId): DailyMessage[] {
  return interleave(LESSONS.filter((l) => l.parsha === p).map(lessonMessages));
}

const PARSHA_IDS = (Object.keys(PARSHIOT) as ParshaId[]).filter((p) => LESSONS.some((l) => l.parsha === p));
const day = (date: string) => Math.round(Date.parse(`${date}T00:00:00Z`) / 864e5);

/** The portion of a date (YYYY-MM-DD): the first with lessons whose Shabbat is that day or later; else the last. */
export function parshaOf(date: string): ParshaId {
  return PARSHA_IDS.find((p) => PARSHIOT[p].shabbat >= date) ?? PARSHA_IDS[PARSHA_IDS.length - 1];
}

/** The message of a date, or null on Shabbat. */
export function messageFor(date: string): DailyMessage | null {
  const d = day(date);
  if (new Date(d * 864e5).getUTCDay() === 6) return null;
  const p = parshaOf(date);
  const sunday = day(PARSHIOT[p].shabbat) - 6;
  // days of the portion so far, without the Shabbatot (after the last portion the count goes on, not over)
  const n = Math.max(0, d - sunday) - Math.floor(Math.max(0, d - sunday) / 7);
  const pool = parshaMessages(p);
  return pool.length ? pool[n % pool.length] : null;
}

/** The schedule for `days` days from `from`: date → per language {title, body, url}; Shabbat is left out. */
export function schedule(from: string, days: number, site: string) {
  const out: Record<string, Record<MsgLocale, { title: string; body: string; url: string }>> = {};
  for (let i = 0; i < days; i++) {
    const date = new Date((day(from) + i) * 864e5).toISOString().slice(0, 10);
    const m = messageFor(date);
    if (!m) continue;
    out[date] = Object.fromEntries(
      MSG_LOCALES.map((loc) => [loc, { title: m.text[loc].title, body: m.text[loc].body, url: `${site}/?lang=${loc}&ref=push#/${m.text[loc].route}` }]),
    ) as Record<MsgLocale, { title: string; body: string; url: string }>;
  }
  return out;
}
