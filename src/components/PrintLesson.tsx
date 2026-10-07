import { useEffect, useState } from 'react';
import { Html, useI18n } from '../i18n';
import { VALUES, letters } from '../core/gematria';
import { SITE_HOST } from '../core/site';
import type { Lesson } from '../lessons/types';
import { PARSHIOT } from '../lessons/parshiot';
import { HebrewRuns } from './Hebrew';
import { Icon } from './ui';

const TABLE = Object.entries(VALUES).filter(([c]) => !'ךםןףץ'.includes(c));
const OPTS_KEY = 'niflaot:print-options';

/** Stable pseudo-random order, so the right option isn't always first on paper. */
function order(n: number, seed: number) {
  const a = [...Array(n).keys()];
  let x = seed * 9301 + 49297;
  for (let j = n - 1; j > 0; j--) {
    x = (x * 9301 + 49297) % 233280;
    const r = Math.floor((x / 233280) * (j + 1));
    [a[j], a[r]] = [a[r], a[j]];
  }
  return a;
}

type Options = { answers: boolean; lessons: boolean; reflection: boolean };

function loadOptions(): Options {
  try {
    return { answers: true, lessons: false, reflection: true, ...JSON.parse(localStorage.getItem(OPTS_KEY) ?? '{}') };
  } catch {
    return { answers: true, lessons: false, reflection: true };
  }
}

/** Printable worksheet: riddles with blanks to fill in by hand, optional answers and lesson text. */
export function PrintLesson({ lesson }: { lesson: Lesson }) {
  const { t, pick, locale } = useI18n();
  const parsha = PARSHIOT[lesson.parsha];
  const text = pick(lesson.texts).value;
  const [opt, setOpt] = useState(loadOptions);

  useEffect(() => {
    document.title = `${text.title} · ${t('print.button')}`;
  }, [text.title, t]);

  const toggle = (k: keyof Options) =>
    setOpt((o) => {
      const n = { ...o, [k]: !o[k] };
      try {
        localStorage.setItem(OPTS_KEY, JSON.stringify(n));
      } catch {}
      return n;
    });

  return (
    <div className="print-view">
      <div className="print-bar no-print">
        <a className="btn ghost" href={`#/${lesson.slug}`}>
          {t('print.back')}
        </a>
        <div className="print-opts" role="group" aria-label={t('print.options')}>
          {(
            [
              ['answers', 'print.withAnswers'],
              ['reflection', 'print.withReflection'],
              ['lessons', 'print.withLessons'],
            ] as const
          ).map(([k, label]) => (
            <label key={k}>
              <input type="checkbox" checked={opt[k]} onChange={() => toggle(k)} />
              {t(label)}
            </label>
          ))}
        </div>
        <button className="btn" onClick={() => window.print()}>
          <Icon name="print" size={18} />
          {t('print.print')}
        </button>
      </div>

      <article className="sheet-paper">
        <header className="p-head">
          <div className="p-head-main">
            <div className="p-year">
              {parsha.name[locale as keyof typeof parsha.name] ?? parsha.name.ru} · {parsha.year} ·{' '}
              <span className="he">{parsha.heYear}</span>
            </div>
            <div className="p-heb he">{lesson.hebrewTitle}</div>
            <h1>{text.title}</h1>
            <div className="p-author">
              {text.hero.author}
            </div>
          </div>
          <div className="p-fields">
            <span>{t('print.name')}: ____________________</span>
            <span>{t('print.date')}: ______________</span>
          </div>
        </header>


        {lesson.riddles.map((r, ri) => {
          const rt = text.riddles[ri];
          return (
            <section key={ri} className="p-riddle">
              <div className="p-eyebrow">{t('riddle.of', { n: ri + 1, total: lesson.riddles.length })}</div>
              <h2>{rt.title}</h2>
              <Html as="div" className="p-cond" html={rt.cond} />

              <div className="p-words">
                {r.words.map((w) => (
                  <div key={w} className="p-word">
                    <div className="p-w he">{w}</div>
                    <div className="p-t">{text.glossary[w]}</div>
                    <div className="p-tiles" dir="rtl">
                      {letters(w).map((c, k) => (
                        <span key={k}>
                          <b>{c}</b>
                          <i />
                        </span>
                      ))}
                    </div>
                    <div className="p-sum">= ______</div>
                  </div>
                ))}
              </div>

              <ol className="p-steps">
                {r.steps.map((s, i) => {
                  const st = rt.steps[i];
                  return (
                    <li key={i}>
                      <Html as="div" className="p-q" html={st.q} />
                      {s.t === 'num' ? (
                        <div className="p-answer">{t('print.answer')} ______________</div>
                      ) : (
                        <div className="p-opts">
                          {order(s.opts.length, ri * 10 + i + 1).map((k) => (
                            <span key={k} className="p-opt">
                              <span className="p-box" />
                              <span className="he">{s.opts[k].h}</span>
                              {st.opts?.[k] && <small>{st.opts[k]}</small>}
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>

              {opt.reflection && (
                <div className="p-refl">
                  <div className="p-label">{t('print.reflection')}</div>
                  <p>{rt.reflection}</p>
                  <div className="p-lines">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              )}
            </section>
          );
        })}

        <section className="p-block">
          <h3 className="p-label">{t('print.letters')}</h3>
          <div className="p-table" dir="rtl">
            {TABLE.map(([c, v]) => (
              <span key={c}>
                <b>{c}</b>
                <i>{v}</i>
              </span>
            ))}
          </div>
        </section>

        <footer className="p-foot">
          {SITE_HOST} · {text.source} · {t('footer.fine')}
        </footer>

        {opt.answers && (
          <section className="p-answers">
            <h2>{t('print.answers')}</h2>
            {lesson.riddles.map((r, ri) => {
              const rt = text.riddles[ri];
              return (
                <div key={ri} className="p-ans">
                  <h3>
                    {ri + 1}. {rt.title}
                  </h3>
                  <ol>
                    {r.steps.map((s, i) => (
                      <li key={i}>
                        <b>{s.t === 'num' ? s.a : <span className="he">{s.opts[s.c].h}</span>}</b>
                        {s.t === 'ch' && rt.steps[i].opts?.[s.c] && <> — {rt.steps[i].opts![s.c]}</>}
                        {rt.steps[i].hint && (
                          <small>
                            {' '}
                            · {t('print.hint')} {rt.steps[i].hint}
                          </small>
                        )}
                      </li>
                    ))}
                  </ol>
                  <div className="p-eqs">
                    {r.equations.map((e, k) => (
                      <div key={k}>
                        <HebrewRuns text={e} />
                      </div>
                    ))}
                  </div>
                  <p>
                    <b>{rt.reveal.h}.</b> {rt.reveal.p}
                  </p>
                </div>
              );
            })}
          </section>
        )}

        {opt.lessons && (
          <section className="p-lessons">
            <h2>{t('print.lessonTexts')}</h2>
            {text.riddles.map((rt, ri) =>
              rt.lessons.map((l, k) => (
                <div key={`${ri}-${k}`} className="p-les">
                  <h3>
                    <HebrewRuns text={l.h} />
                  </h3>
                  <Html as="div" html={l.b} />
                </div>
              )),
            )}
          </section>
        )}

        <section className="p-about">
          <h2>{t('about.title')}</h2>
          <Html as="div" className="prose" html={t('about.body')} />
          <p className="p-site">{SITE_HOST}</p>
        </section>
      </article>
    </div>
  );
}
