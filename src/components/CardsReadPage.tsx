import { useEffect } from 'react';
import { Html, useI18n } from '../i18n';
import { withTerms } from '../i18n/glossary';
import type { Lesson, LessonText, RebbeCardsData } from '../lessons/types';
import { displayNames } from '../core/names';
import { footnotes } from '../sources/footnotes';
import { Sources } from './Sources';
import { cardsReadHref, cardsReadModes, type CardsReadMode } from './cardsRead';
import { TopBar } from './TopBar';
import { CardInfo } from './RebbeCards';
import { HebrewRuns } from './Hebrew';
import { Colophon } from './Colophon';
import { useMode } from '../core/mode';
import { CardsCheck, ChapterCheck } from './ReadCheck';
import { cardRef } from '../core/cardRef';
import { ListenBar } from './ListenBar';

/**
 * One chapter of the Rebbe's talk (a riddle of the investigation), all of it at once: the question on the verse,
 * the Rebbe's answer (`reveal`), the retold sections with their footnotes, the sources, the summary, a question to oneself.
 */
function TalkChapter({ lesson, text, ri }: { lesson: Lesson; text: LessonText; ri: number }) {
  const { t, pick } = useI18n();
  const textLocale = pick(lesson.texts).locale;
  const r = lesson.riddles[ri];
  const rt = text.riddles[ri];
  const fn = footnotes([rt.cond, rt.reveal.p, ...rt.lessons.map((l) => l.b)], r.sources ?? [], ri, t('sources.footnote'));
  const [condHtml, revealHtml, ...lessonHtml] = fn.html;
  return (
    <section className="riddle read-riddle" id={`riddle-${ri + 1}`}>
      <div className="r-head">
        <span className="eyebrow">{t('read.chapter', { n: ri + 1, total: lesson.riddles.length })}</span>
        <h2>{rt.title}</h2>
      </div>
      <Html as="div" className="cond" html={withTerms(condHtml, textLocale)} />
      <div className="reveal">
        <h3>{rt.reveal.h}</h3>
        <Html as="p" html={withTerms(revealHtml, textLocale)} />
      </div>
      <div className="lessons">
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
      {/* «Проверь себя» of a lesson without cards: the riddle's choice steps (src/core/readCheck.ts) */}
      <ChapterCheck lesson={lesson} text={text} ri={ri} />
    </section>
  );
}

/**
 * «Прочитать» of a «Нифлаот Ребе» lesson. `#/<slug>/read` — «Беседа»: the whole talk, chapter by chapter (when the lesson
 * has an investigation); `#/<slug>/read/cards` (or `/read`, for a lesson of cards only) — every verse with the Rebbe's
 * explanation, in a row; `#/<slug>/read/poem` — «Запомнить в стихах»: the same pairs as short rhymed poems. A switch at the top.
 * A lesson without cards yet has only «Беседа» (no switch).
 */
export function CardsReadPage({ lesson, cards, mode }: { lesson: Lesson; cards?: RebbeCardsData; mode: CardsReadMode }) {
  const { t, pick, locale } = useI18n();
  const { value: text, locale: textLocale } = pick(lesson.texts);
  const adults = useMode() === 'adults';
  const items = text.cards?.items ?? [];

  useEffect(() => {
    document.title = `${t(mode === 'poem' ? 'cards.modePoem' : mode === 'talk' ? 'cards.modeTalk' : 'cards.tabRead')} · ${text.title} · ${t('app.title')}`;
  }, [mode, text.title, t]);

  return (
    <>
      <TopBar title={text.title} />
      <div className="wrap">
        {textLocale !== locale && <div className="fallback-note">{t('catalog.fallback')}</div>}
        <main>
          {/* one <article> in the text's language: the browser's reading mode, translation and «read aloud» take it whole */}
          <article lang={textLocale}>
            <div className="memo-page-head">
              <div className="heb gold-text">{lesson.hebrewTitle}</div>
              <h1>{text.title}</h1>
              <p className="author">{text.hero.author}</p>
            </div>
            {cardsReadModes(lesson).length > 1 && (
              <nav className="seg no-speak" aria-label={t('cards.tabRead')}>
                {cardsReadModes(lesson).map((m) => (
                  <a key={m} href={cardsReadHref(lesson, m)} className={m === mode ? 'on' : undefined} aria-current={m === mode ? 'page' : undefined}>
                    {m === 'talk' ? '📜' : m === 'read' ? '🃏' : '🎵'} {t(m === 'talk' ? 'cards.modeTalk' : m === 'read' ? 'cards.tab' : 'cards.modePoem')}
                  </a>
                ))}
              </nav>
            )}
            {/* the talk is read aloud (a lesson of cards only — its pairs): src/core/narration.ts */}
            {(mode === 'talk' || (mode === 'read' && !lesson.riddles.length)) && <ListenBar slug={lesson.slug} lang={textLocale} title={text.title} />}
            <p className="read-intro no-speak">{t(mode === 'poem' ? 'cards.poemIntro' : mode === 'talk' ? 'cards.talkIntro' : 'cards.readIntro')}</p>

            {mode === 'talk' ? (
              <>
                {lesson.riddles.map((_, ri) => (
                  <TalkChapter key={ri} lesson={lesson} text={text} ri={ri} />
                ))}
                <section className="practice">
                  <h2 className="practice-lbl">{t('final.practice')}</h2>
                  <p>{text.practice}</p>
                </section>
              </>
            ) : mode === 'read' ? (
              <div className="memo-study">
                {cards?.items.map((it, k) => items[k] && <CardInfo key={k} item={it} text={items[k]} n={k + 1} />)}
              </div>
            ) : (
              <div className="poems">
                {cards?.items.map(
                  (it, k) =>
                    items[k] && (
                      <section key={k} className="poem">
                        <div className="poem-head">
                          <span className="mi-n num">{k + 1}</span>
                          <h3>{items[k].title}</h3>
                        </div>
                        <div className="poem-verse">
                          <span className="he" lang="he">
                            {displayNames(it.verse)}
                          </span>
                          <span>{items[k].verse}</span>
                        </div>
                        <p className="poem-lines">
                          {items[k].poem.map((l, j) => (
                            // a space between the lines: a voice reading the poem keeps them apart
                            <span key={j}>
                              <HebrewRuns text={l} />{' '}
                            </span>
                          ))}
                        </p>
                        <p className="rc-ls">{cardRef(it, t)}</p>
                      </section>
                    ),
                )}
              </div>
            )}
          </article>
          {/* «Проверь себя»: which verse is each explanation about — for the Torah certificate of a reader («Академия») */}
          <CardsCheck lesson={lesson} text={text} />
        </main>
        {/* the invitation to play — not in the adults' mode (src/core/mode.ts) */}
        {!adults && (
          <section className="memo-cta">
            <span aria-hidden="true">{mode === 'talk' ? '🔎' : '🃏'}</span>
            <p>{t(mode === 'talk' ? 'cards.talkCta' : 'cards.readCta')}</p>
            <a className="btn" href={`#/${lesson.slug}${mode === 'talk' ? '' : '/cards'}`}>
              {t(mode === 'talk' ? 'read.playBtn' : 'cards.ctaBtn')} →
            </a>
          </section>
        )}
      </div>
      <Colophon source={text.source} />
    </>
  );
}
