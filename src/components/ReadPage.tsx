import { useEffect, useMemo } from 'react';
import { Html, useI18n } from '../i18n';
import { withTerms } from '../i18n/glossary';
import { letters } from '../core/gematria';
import { buildCoach, type CoachAction } from '../core/coach';
import { asWord, expectedTiles, phraseTiles } from '../core/letterPuzzle';
import { displayNames } from '../core/names';
import { footnotes } from '../sources/footnotes';
import type { Lesson, LessonText, StepData } from '../lessons/types';
import { TopBar } from './TopBar';
import { Hero } from './Hero';
import { HebrewRuns } from './Hebrew';
import { Sources } from './Sources';
import { sectionQuotes } from '../core/quotes';
import { Quote } from './Quote';
import { firstLetters } from '../core/gematriaMethods';
import { useLetterHelp } from './letterHelp';
import { lessonArt } from '../core/art';
import { Colophon } from './Colophon';
import { ChapterCheck } from './ReadCheck';

/** A ready calculation from the step's coach data: every word spelled into letter values, every action with its result. */
function Calc({ actions }: { actions: CoachAction[] }) {
  const parts = useMemo(() => buildCoach(actions), [actions]);
  const help = useLetterHelp();
  return (
    <ol className="coach-steps read-calc">
      {parts.map((p, k) =>
        p.word ? (
          <li key={k} className="coach-word">
            <span className="he">{displayNames(p.word)}</span>
            <span className="coach-letters" dir="rtl" aria-hidden="true">
              {p.letters!.map(([c, v], j) => (
                <span key={j} title={help.title(c)}>
                  <b>{c}</b>
                  <i>{v}</i>
                  <help.Name c={c} />
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
        {s.notarikon && (
          <span className="he" lang="he">
            {' '}
            → {firstLetters(s.opts[s.c].h)} → {s.notarikon}
          </span>
        )}
      </div>
    );
  if (s.t === 'lt') {
    const tiles = phraseTiles(displayNames(s.from));
    const exp = expectedTiles(phraseTiles(s.from), s.take);
    const words = [...new Set(tiles.map((tl) => tl.w))];
    return (
      <div className="lt">
        <div className="lt-bank" dir="rtl" lang="he" aria-hidden="true">
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
    <>
      <div className="lt-bank tap" dir="rtl" lang="he" aria-hidden="true">
        <span className="lt-word">
          {letters(displayNames(s.word)).map((c, k) => (
            <span key={k} className={`lt-tile big${k === s.a ? ' right' : ''}`}>
              {c}
            </span>
          ))}
        </span>
      </div>
      <div className="read-ans">
        {t('read.answer')}{' '}
        <b className="he" lang="he">
          {letters(displayNames(s.word))[s.a]}
        </b>
      </div>
    </>
  );
}

/**
 * One riddle as a chapter to read: the verse, then every section of the lesson — the commentator's own words
 * (original + translation) where they are first retold, then the explanation; the checked calculations of the
 * chapter are folded at its end, then the sources, the summary and a question to oneself.
 */
function ReadRiddle({ lesson, text, ri, here }: { lesson: Lesson; text: LessonText; ri: number; here?: boolean }) {
  const { t, pick } = useI18n();
  const textLocale = pick(lesson.texts).locale;
  const r = lesson.riddles[ri];
  const rt = text.riddles[ri];
  const ids = r.sources ?? [];
  // the solution text is not shown on this page (except in «Нифлаот Ребе», which has its own read page)
  const fn = footnotes([rt.cond, ...rt.lessons.map((l) => l.b)], ids, ri, t('sources.footnote'));
  const [condHtml, ...lessonHtml] = fn.html;

  // the commentator's words: as the lesson data places them (`quotes`), else each passage where first cited
  const quotes = sectionQuotes(r, rt);

  return (
    <section className={`riddle read-riddle${here ? ' here' : ''}`} id={`riddle-${ri + 1}`}>
      <div className="r-head">
        <span className="eyebrow">{t('read.chapter', { n: ri + 1, total: lesson.riddles.length })}</span>
        <h2>{rt.title}</h2>
      </div>
      {lessonArt(lesson, `riddle-${ri + 1}`) && (
        <img className="r-art" src={lessonArt(lesson, `riddle-${ri + 1}`)} alt={rt.art ?? ''} width={1280} height={720} loading="lazy" />
      )}
      <Html as="div" className="cond" html={withTerms(condHtml, textLocale)} />
      {quotes.cond.map((q) => (
        <Quote key={q.id} q={q} />
      ))}

      <div className="lessons">
        {rt.lessons.map((l, k) => (
          <section key={k} className="read-les">
            <h3>
              <HebrewRuns text={l.h} />
            </h3>
            {quotes.lessons[k].map((q) => (
              <Quote key={q.id + (q.segs?.join() ?? '')} q={q} />
            ))}
            <Html as="div" className="les-b" html={withTerms(lessonHtml[k], textLocale)} />
          </section>
        ))}
      </div>

      {/* «Проверь себя»: the chapter's choice questions, for the Torah certificate of a reader («Академия») */}
      <ChapterCheck lesson={lesson} text={text} ri={ri} />

      <details className="read-calcs no-speak">
        <summary>🧮 {t('read.calcs')}</summary>
        <div className="eqs">
          {r.equations.map((e, k) => (
            <div key={k} className="eq">
              <HebrewRuns text={e} />
            </div>
          ))}
        </div>
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
      </details>

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
    </section>
  );
}

/**
 * «Читать» — the whole lesson to read, chapter by chapter (a chapter = a riddle of the game): the verse,
 * the commentator's words in the original with a translation, the explanation; the checked calculations
 * (the same coach data as the game) are folded at the end of every chapter.
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
        <main id="game">
          {/* one <article> in the text's language: the browser's reading mode, translation and «read aloud» take it whole */}
          <article lang={textLocale}>
            <Hero lesson={lesson} text={text} reading />
            <p className="read-intro no-speak">{t(lesson.kind === 'commentary' ? 'read.intro' : 'read.introArticle')}</p>
            {lesson.riddles.map((_, ri) => (
              <ReadRiddle key={ri} lesson={lesson} text={text} ri={ri} here={at === ri + 1} />
            ))}
            <section className="practice">
              <h2 className="practice-lbl">{t('final.practice')}</h2>
              <p>{text.practice}</p>
            </section>
          </article>
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
