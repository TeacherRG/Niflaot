import type { Lesson } from '../lessons/types';
import type { Locale } from '../i18n';
import { displayNames } from './names';
import { authToken } from './account';

/**
 * AI assistant client. The Claude API key lives in a separate Cloudflare Worker (`assistant/`);
 * the site only knows its URL. Without VITE_ASSISTANT_URL the assistant is hidden.
 */
export const ASSISTANT_URL: string = import.meta.env.VITE_ASSISTANT_URL ?? '';

export type ChatTurn = { role: 'user' | 'assistant'; content: string };

/* ───────────── what the assistant knows about the page ───────────── */

/** The lesson on screen and the player's progress; set by the lesson page, null elsewhere. */
export interface PageState {
  lesson: Lesson;
  locale: Locale;
  done: number[];
  lvl: number;
}

let page: PageState | null = null;
const listeners = new Set<() => void>();
export const setPageState = (s: PageState | null) => {
  page = s;
  listeners.forEach((f) => f());
};
export const getPageState = () => page;
export const subscribePageState = (f: () => void) => {
  listeners.add(f);
  return () => void listeners.delete(f);
};
/**
 * What the assistant knows about any other page — the passage of the day of «Пророки» / «Писания», its quiz,
 * «Академия»: the page sets a short kind (it picks the suggested questions) and a builder of the context text.
 */
export type PageKind = 'lesson' | 'tanakh' | 'quiz' | 'academy' | 'hemshech';
let other: { kind: Exclude<PageKind, 'lesson'>; context: () => string | Promise<string> } | null = null;
export const setOtherPage = (s: typeof other) => {
  other = s;
  listeners.forEach((f) => f());
};
export const pageKind = (): PageKind | null => (page ? 'lesson' : (other?.kind ?? null));

/** Context text is cut here (the server takes at most 24 000 characters). */
const MAX_CONTEXT = 22000;

/** The primary sources (sefaria.json) load only with the first question, not with the site. */
const assistantContext = async () =>
  (page
    ? lessonContext(page.lesson, page.locale, page.done, page.lvl, await import('../sources'))
    : other
      ? await other.context()
      : ''
  ).slice(0, MAX_CONTEXT);

const plain = (html: string) =>
  html
    .replace(/<\/(p|li|h\d|div)>|<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

/**
 * Lesson context for the assistant. Solved riddles carry the full solution and lesson text;
 * unsolved ones only the condition, questions and hints — so the assistant cannot spoil them.
 */
export function lessonContext(
  lesson: Lesson,
  locale: Locale,
  done: number[],
  current: number,
  { SOURCES, sourceLabel, translation }: typeof import('../sources'),
): string {
  const text = lesson.texts[locale] ?? lesson.texts.ru!;
  const out: string[] = [
    `Lesson ${lesson.number}: ${text.title} (${lesson.hebrewTitle}), ${text.hero.author}`,
    plain(text.hero.intro),
    `User is on: ${current >= lesson.riddles.length ? 'the final summary' : `riddle ${current + 1}`}. Solved riddles: ${done.length ? done.map((i) => i + 1).join(', ') : 'none'}.`,
  ];
  lesson.riddles.forEach((r, i) => {
    const t = text.riddles[i];
    if (!t) return;
    const solved = done.includes(i);
    out.push(`\n## Riddle ${i + 1}: ${t.title} — ${solved ? 'SOLVED' : 'NOT SOLVED (do not reveal answers)'}`);
    out.push(plain(t.cond));
    out.push(`Word cards: ${r.words.join(', ')}`);
    t.steps.forEach((s, k) => out.push(`Step ${k + 1}: ${plain(s.q)}${s.hint ? ` (hint: ${plain(s.hint)})` : ''}`));
    if (!solved) return;
    out.push(`Solution: ${r.equations.map(plain).join('; ')}`);
    out.push(`${t.reveal.h}: ${plain(t.reveal.p)}`);
    for (const l of t.lessons) out.push(`### ${l.h}\n${plain(l.b)}`);
    out.push(`Question for yourself: ${t.reflection}`);
    for (const id of r.sources ?? []) {
      const s = SOURCES[id];
      if (!s) continue;
      out.push(`Source — ${sourceLabel(s, locale).title} (${s.ref}): ${s.he.join(' ')}\nTranslation: ${translation(s, id, locale).lines.join(' ')}`);
    }
  });
  if (done.length === lesson.riddles.length) out.push(`\nPractical conclusion: ${text.practice}`);
  return displayNames(out.join('\n'));
}

/* ───────────── streaming request ───────────── */

export async function askAssistant(
  messages: ChatTurn[],
  locale: Locale,
  onText: (chunk: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const context = await assistantContext();
  const res = await fetch(`${ASSISTANT_URL.replace(/\/$/, '')}/chat`, {
    method: 'POST',
    // signed in: the question counts for the account (src/core/account.ts)
    headers: { 'Content-Type': 'application/json', ...(authToken() ? { Authorization: `Bearer ${authToken()}` } : {}) },
    body: JSON.stringify({ locale, messages, context }),
    signal,
  });
  // 429: too many questions — from this address in a minute (busy) or from everyone today (limit)
  if (res.status === 429) throw new Error((await res.text().catch(() => '')) === 'daily' ? 'limit' : 'busy');
  if (!res.ok || !res.body) throw new Error(`http ${res.status}`);
  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buf = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += value;
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (!line) continue;
      const msg = JSON.parse(line) as { t?: string; done?: boolean; error?: string };
      if (msg.error) throw new Error(msg.error);
      if (msg.t) onText(msg.t);
    }
  }
}
