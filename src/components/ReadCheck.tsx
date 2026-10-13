import { useEffect, useState } from 'react';
import { Html, useI18n } from '../i18n';
import type { Lesson, LessonText } from '../lessons/types';
import { displayNames } from '../core/names';
import { answerRead, readQuestions, readScore, readStore, subscribeRead, type ReadQuestion } from '../core/readCheck';
import { HebrewRuns } from './Hebrew';

/** The reading answers of a lesson, kept up to date. */
export function useAnswers(slug: string) {
  const [a, setA] = useState(() => readStore()[slug] ?? {});
  useEffect(() => subscribeRead(() => setA(readStore()[slug] ?? {})), [slug]);
  return a;
}

/** One question: options as buttons; answered once — then the right one is marked. */
function Question({ lesson, q, n, children, options }: { lesson: Lesson; q: ReadQuestion; n: number; children: React.ReactNode; options: React.ReactNode[] }) {
  const { t } = useI18n();
  const picked = useAnswers(lesson.slug)[q.key];
  const done = picked !== undefined;
  return (
    <li className="qz-q">
      <div className="qz-text">
        <span className="qz-num num">{n}</span>
        <span>{children}</span>
      </div>
      <div className="qz-opts">
        {options.map((o, i) => (
          <button
            key={i}
            className={`qz-opt${done && i === q.c ? ' ok' : ''}${done && i === picked && i !== q.c ? ' bad' : ''}`}
            disabled={done}
            onClick={() => answerRead(lesson.slug, q.key, i)}
          >
            {o}
          </button>
        ))}
      </div>
      {done && <p className={`qz-fb ${picked === q.c ? 'ok' : 'bad'}`}>{picked === q.c ? t('rc.right') : t('rc.wrong')}</p>}
    </li>
  );
}

function Head({ lesson }: { lesson: Lesson }) {
  const { t } = useI18n();
  useAnswers(lesson.slug);
  const s = readScore(lesson);
  return (
    <div className="rc-head">
      <h3>{t('rc.title')}</h3>
      <p>
        {t('rc.sub')} {s.done > 0 && <b>{t('rc.score', { got: s.got, done: s.done, n: s.n })}</b>}
      </p>
    </div>
  );
}

/** «Проверь себя» at the end of a chapter of «Читать»: the riddle's choice steps — no counting, the answer is in the text. */
export function ChapterCheck({ lesson, text, ri }: { lesson: Lesson; text: LessonText; ri: number }) {
  const qs = readQuestions(lesson).filter((q) => q.ri === ri);
  if (!qs.length) return null;
  return (
    <section className="read-check no-speak">
      <Head lesson={lesson} />
      <ol className="qz-list">
        {qs.map((q, k) => {
          const step = lesson.riddles[ri].steps[q.si!];
          const st = text.riddles[ri].steps[q.si!];
          if (step.t !== 'ch') return null;
          return (
            <Question
              key={q.key}
              lesson={lesson}
              q={q}
              n={k + 1}
              options={q.opts.map((i) => (
                <>
                  <span className="he" lang="he">
                    {displayNames(step.opts[i].h)}
                  </span>
                  {st.opts?.[i] && <> — {st.opts[i]}</>}
                </>
              ))}
            >
              <Html html={st.q} />
            </Question>
          );
        })}
      </ol>
    </section>
  );
}

/** «Проверь себя» at the end of «Прочитать» of «Нифлаот Ребе»: which verse is each explanation of the Rebbe about? */
export function CardsCheck({ lesson, text }: { lesson: Lesson; text: LessonText }) {
  const { t } = useI18n();
  const qs = readQuestions(lesson);
  const items = text.cards?.items ?? [];
  if (!qs.length || !lesson.cards) return null;
  return (
    <section className="read-check no-speak">
      <Head lesson={lesson} />
      <ol className="qz-list">
        {qs.map((q, k) => (
          <Question
            key={q.key}
            lesson={lesson}
            q={q}
            n={k + 1}
            options={q.opts.map((o) => (
              <>
                <span className="he" lang="he">
                  {displayNames(lesson.cards!.items[o].verse)}
                </span>
                {items[o] && <> — {items[o].verse}</>}
              </>
            ))}
          >
            {t('rc.cardQ')} <span className="rc-card">«<HebrewRuns text={items[q.card!]?.card ?? ''} />»</span>
          </Question>
        ))}
      </ol>
    </section>
  );
}

/** All «Проверь себя» questions of a chapter are answered (a chapter without questions — always). */
export function useChapterChecked(lesson: Lesson, ri: number) {
  const a = useAnswers(lesson.slug);
  return readQuestions(lesson)
    .filter((q) => q.ri === ri)
    .every((q) => a[q.key] !== undefined);
}
