import { useEffect, useMemo } from 'react';
import { Html, useI18n } from '../i18n';
import { withTerms } from '../i18n/glossary';
import { VALUES, gematria, letters } from '../core/gematria';
import { buildCoach, type CoachAction } from '../core/coach';
import { asWord, expectedTiles, phraseTiles } from '../core/letterPuzzle';
import { displayNames } from '../core/names';
import { footnotes } from '../sources/footnotes';
import type { Lesson, LessonText, StepData } from '../lessons/types';
import { TopBar } from './TopBar';
import { Hero } from './Hero';
import { HebrewRuns } from './Hebrew';
import { Sources } from './Sources';
import { Colophon } from './Colophon';

/** A ready calculation from the step's coach data: every word spelled into letter values, every action with its result. */
function Calc({ actions }: { actions: CoachAction[] }) {
  const parts = useMemo(() => buildCoach(actions), [actions]);
  return (
    <ol className="coach-steps read-calc">
      {parts.map((p, k) =>
        p.word ? (
          <li key={k} className="coach-word">
            <span className="he">{displayNames(p.word)}</span>
            <span className="coach-letters" dir="rtl">
              {p.letters!.map(([c, v], j) => (
                <span key={j}>
                  <b>{c}</b>
                  <i>{v}</i>
                </span>
              ))}
            </span>
            <span className="read-sum num">= {p.result}</span>
          </li>
        ) : (
          <li key={k} className="coach-done num">
            {p.expr.text} = <b>{p.result}</b>
          </li>
        ),
      )}
    </ol>
  );
}

/** The answer of one step, ready: a number with its calculation, the right option, the built word or the found letter. */
function Answer({ s, opts }: { s: StepData; opts?: string[] }) {
  const { t } = useI18n();
  if (s.t === 'num')
    return (
      <>
        <div className="read-ans">
          {t('read.answer')} <b className="num">{s.a}</b>
        </div>
        {s.coach && (
          <div className="coach read-coach">
            <div className="coach-head">{t('read.calc')}</div>
            <Calc actions={s.coach} />
          </div>
        )}
      </>
    );
  if (s.t === 'ch')
    return (
      <div className="read-ans">
        {t('read.answer')}{' '}
        <b className="he" lang="he">
          {s.opts[s.c].h}
        </b>
        {opts?.[s.c] && <> — {opts[s.c]}</>}
        {s.opts[s.c].v != null && <span className="num"> = {s.opts[s.c].v}</span>}
      </div>
    );
  if (s.t === 'lt') {
    const tiles = phraseTiles(displayNames(s.from));
    const exp = expectedTiles(phraseTiles(s.from), s.take);
    const words = [...new Set(tiles.map((tl) => tl.w))];
    return (
      <div className="lt">
        <div className="lt-bank" dir="rtl" lang="he">
          {words.map((w) => (
            <span key={w} className="lt-word">
              {tiles
                .filter((tl) => tl.w === w)
                .map((tl) => (
                  <span key={tl.i} className={`lt-tile${exp.has(tl.i) ? ' hl' : ''}`}>
                    {tl.c}
                  </span>
                ))}
            </span>
          ))}
        </div>
        <div className="read-ans">
          {t(`read.take.${s.take}`)}{' '}
          <b className="he" lang="he">
            {asWord(s.a)}
          </b>
        </div>
      </div>
    );
  }
  return (
    <div className="lt-bank tap" dir="rtl" lang="he">
      <span className="lt-word">
        {letters(displayNames(s.word)).map((c, k) => (
          <span key={k} className={`lt-tile big${k === s.a ? ' right' : ''}`}>
            {c}
          </span>
        ))}
      </span>
    </div>
  );
}

/** One riddle as a chapter to read: the question, ready answers with calculations, the reveal and the lesson. */
function ReadRiddle({ lesson, text, ri, here }: { lesson: Lesson; text: LessonText; ri: number; here?: boolean }) {
  const { t, pick } = useI18n();
  const textLocale = pick(lesson.texts).locale;
  const r = lesson.riddles[ri];
  const rt = text.riddles[ri];
  const fn = footnotes([rt.cond, rt.reveal.p, ...rt.lessons.map((l) => l.b)], r.sources ?? [], ri, t('sources.footnote'));
  const [condHtml, revealHtml, ...lessonHtml] = fn.html;

  return (
    <article className={`riddle read-riddle${here ? ' here' : ''}`} id={`riddle-${ri + 1}`}>
      <div className="r-head">
        <span className="eyebrow">{t('riddle.of', { n: ri + 1, total: lesson.riddles.length })}</span>
        <h2>{rt.title}</h2>
      </div>
      <Html as="div" className="cond" html={withTerms(condHtml, textLocale)} />

      {r.words.length > 0 && (
        <div className="words">
          {r.words.map((w) => (
            <div key={w} className="word">
              <span className="w" lang="he">
                {w}
              </span>
              <span className="t">{text.glossary[w] ?? ''}</span>
              <span className="tiles">
                {letters(w).map((c, k) => (
                  <span key={k} className="tile">
                    <b>{c}</b>
                    <i>{VALUES[c]}</i>
                  </span>
                ))}
              </span>
              <span className="sum">= {gematria(w)}</span>
            </div>
          ))}
        </div>
      )}

      {r.balance && (
        <div className="balance">
          {r.balance.map((b, k) => [
            k > 0 && (
              <span key={`m${k}`} className="mid">
                =
              </span>
            ),
            <div key={k} className="pan lit">
              <span className="he">{b.expr}</span>
              <span className="num">{b.value}</span>
            </div>,
          ])}
        </div>
      )}

      <div className="steps">
        {r.steps.map((s, i) => (
          <div key={i} className="step">
            <div className="q">
              <span className="n">{i + 1}.</span>
              <Html html={rt.steps[i].q} />
            </div>
            <Answer s={s} opts={rt.steps[i].opts} />
          </div>
        ))}
      </div>

      <div className="reveal">
        <h3>{rt.reveal.h}</h3>
        {r.equations.map((e, k) => (
          <div key={k} className="eq">
            <HebrewRuns text={e} />
          </div>
        ))}
        <Html as="p" html={withTerms(revealHtml, textLocale)} />
      </div>

      <div className="lessons">
        <div className="les-title">
          {t('lessons.title')} <span>{t('lessons.sub')}</span>
        </div>
        {rt.lessons.map((l, k) => (
          <section key={k} className="read-les">
            <h3>
              <HebrewRuns text={l.h} />
            </h3>
            <Html as="div" className="les-b" html={withTerms(lessonHtml[k], textLocale)} />
          </section>
        ))}
      </div>
      {r.sources && <Sources ri={ri} ids={fn.ordered} number={fn.number} refs={fn.refs} />}

      {rt.takeaways && (
        <ul className="read-take">
          {rt.takeaways.map((x, k) => (
            <li key={k}>
              <HebrewRuns text={x} />
            </li>
          ))}
        </ul>
      )}

      <div className="refl">
        <div className="refl-lbl">
          {t('refl.title')} <span>{t('refl.sub')}</span>
        </div>
        <p>{rt.reflection}</p>
      </div>
    </article>
  );
}

/**
 * «Читать» — the whole lesson for a reader who does not want to count: every riddle with its question,
 * ready answers and gematria calculations (from the same checked coach data), the reveal, the lesson and the sources.
 */
/** `at` — the riddle (1-based) a link points to, e.g. from «Знаете ли вы?»: the page opens there. */
export function ReadPage({ lesson, at }: { lesson: Lesson; at?: number }) {
  const { t, pick, locale } = useI18n();
  const { value: text, locale: textLocale } = pick(lesson.texts);

  useEffect(() => {
    if (!at) return;
    const id = requestAnimationFrame(() => document.getElementById(`riddle-${at}`)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(id);
  }, [at]);

  useEffect(() => {
    document.title = `${text.title} · ${t('read.tab')} · ${t('app.title')}`;
  }, [text.title, t]);

  return (
    <>
      <TopBar title={text.title} />
      <div className="wrap">
        {textLocale !== locale && <div className="fallback-note">{t('catalog.fallback')}</div>}
        <Hero lesson={lesson} text={text} reading />
        <p className="read-intro">📖 {t('read.intro')}</p>
        <main id="game">
          {lesson.riddles.map((_, ri) => (
            <ReadRiddle key={ri} lesson={lesson} text={text} ri={ri} here={at === ri + 1} />
          ))}
          <section className="practice">
            <div className="practice-lbl">{t('final.practice')}</div>
            <p>{text.practice}</p>
          </section>
          <section className="memo-cta">
            <span aria-hidden="true">🔢</span>
            <p>{t('read.play')}</p>
            <a className="btn" href={`#/${lesson.slug}`}>
              {t('read.playBtn')} →
            </a>
          </section>
        </main>
      </div>
      <Colophon source={text.source} />
    </>
  );
}
