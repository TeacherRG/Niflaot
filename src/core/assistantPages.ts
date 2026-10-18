/**
 * What the AI assistant (src/core/assistant.ts) is told about pages other than a lesson: the passage of the day
 * of «Пророки» / «Писания», its «Вопросы к отрывку», «Академия». Plain text; Names as on the site.
 */
import type { Section } from './tanakhCycle';
import { rangeLabel } from './tanakhCycle';
import { CYCLE, loadDay, type Commentary, type DayVerse } from './tanakh';
import type { QuizQuestion } from './quiz';
import type { QuizResult } from './academy';
import { PASS, type Progress } from './academy';

type Lang = 'ru' | 'en' | 'de';
const SECTION = { neviim: 'Prophets (Nevi’im)', ketuvim: 'Writings (Ketuvim)' } as const;
const plain = (html?: string) => (html ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** The verses of one section of a day: Hebrew, the translation in the site's language (or English), Metzudat David and Rashi. */
function versesText(verses: DayVerse[], lang: Lang) {
  const comm = (c: Commentary | undefined) => (c ? (c[lang] ?? c.en ?? c.he ?? []).map(plain).join(' ') : '');
  return verses
    .map((v) => {
      const tr = v[lang] || v.en;
      const md = comm(v.md);
      const rashi = comm(v.rashi);
      return `${v.b} ${v.c}:${v.v} ${v.he}\n${plain(tr)}${md ? `\nMetzudat David: ${md}` : ''}${rashi ? `\nRashi: ${rashi}` : ''}`;
    })
    .join('\n');
}

/** «Отрывок дня»: the day, the range, every verse with its translation and the commentaries (Metzudat David, Rashi). */
export async function tanakhContext(section: Section, date: string, lang: Lang) {
  const day = CYCLE.find((d) => d.date === date);
  const content = await loadDay(date);
  const head = `Page: "Passage of the day" of the three-year cycle — ${SECTION[section]}, ${date}` +
    (day ? `, ${rangeLabel(section, day[section], 'en')} (day ${CYCLE.indexOf(day) + 1} of ${CYCLE.length})` : '') +
    '. Below the passage the user can take the "Questions on the passage" quiz.';
  return content ? `${head}\n\n${versesText(content[section].verses, lang)}` : head;
}

/**
 * «Вопросы к отрывку»: the questions; for the answered ones the user's pick and the right answer, for the rest
 * only the options — the assistant must not tell which is right. Then the passage itself, for hints.
 */
export async function quizContext(section: Section, date: string, lang: Lang, questions: QuizQuestion[], result: QuizResult) {
  const lines = questions.map((q, i) => {
    const p = result.p[i];
    const opts = q.o.map((o) => o[lang]);
    return p >= 0
      ? `Q${i + 1} (${q.ref}) ANSWERED ${p === 0 ? 'correctly' : `wrongly ("${opts[p]}")`}: ${q.q[lang]} — right answer: ${opts[0]}`
      : `Q${i + 1} (${q.ref}) NOT ANSWERED — do not reveal which option is right: ${q.q[lang]} Options: ${[...opts].sort().join(' | ')}`;
  });
  const best = result.best >= 0 ? ` Best finished result: ${result.best} of ${questions.length}.` : '';
  return `Page: "Questions on the passage" quiz — ${SECTION[section]}, ${date}. Each answer counts once; ${Math.round(PASS * 100)}% right over all the days of a book earns the book's certificate.${best}\n${lines.join('\n')}\n\n${await tanakhContext(section, date, lang)}`;
}

/** «Академия»: every certificate and the user's progress on this device. */
export function academyContext(rows: { kind: 'torah' | 'tanakh' | 'hemshech'; title: string; book: string; p: Progress; extra: string }[]) {
  return `Page: "Academy" — certificates for books. Torah: ${Math.round(PASS * 100)}% of the points. Prophets and Writings: ` +
    `100% of the book's daily passages marked "I've read it" (under each passage); the certificate shows points too when ` +
    `the "Questions on the passage" of all those days are passed with ${Math.round(PASS * 100)}%. Chassidut («Hemshech 5666»): ` +
    `the same for each discourse — all its passages marked read; with points when their questions are passed.\n` +
    rows
      .map(
        (r) =>
          `- ${r.title}, ${r.book}: ` +
          (r.kind === 'torah'
            ? `${r.p.got} of ${r.p.max} points`
            : `${r.p.seen?.done ?? 0} of ${r.p.parts} passages read, ${r.p.got} of ${r.p.max} quiz answers right`) +
          `, ${r.extra}; ` +
          (r.p.earned
            ? r.kind !== 'torah'
              ? r.p.scored
                ? 'EARNED, with points'
                : 'EARNED (by reading, without points)'
              : 'EARNED'
            : r.kind !== 'torah'
              ? 'not earned yet: every passage must be marked read'
              : r.p.complete
                ? 'not earned yet'
                : 'the book is not complete on the site yet (its last portion is not there)'),
      )
      .join('\n');
}
