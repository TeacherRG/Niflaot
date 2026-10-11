import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { VALUES } from '../core/gematria';
import { ALEPH_BET, FINAL_FORMS, LOOKALIKES, letterName, letterSound } from '../core/letterNames';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';

const GROUPS = [
  { key: 'abc.units', letters: ALEPH_BET.slice(0, 9) },
  { key: 'abc.tens', letters: ALEPH_BET.slice(9, 18) },
  { key: 'abc.hundreds', letters: ALEPH_BET.slice(18) },
  { key: 'abc.finals', letters: FINAL_FORMS },
] as const;

type Kind = 'name' | 'value' | 'find';
interface Question {
  kind: Kind;
  /** the letter asked about */
  c: string;
  /** four letters: the right one and three others, lookalikes first */
  opts: string[];
}

const shuffle = <T,>(a: T[]) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/** Ten questions over the 22 letters; the wrong answers are letters that look alike, so the test teaches the difference. */
function makeQuiz(): Question[] {
  const kinds: Kind[] = ['name', 'value', 'find'];
  return shuffle(ALEPH_BET)
    .slice(0, 10)
    .map((c, i) => {
      const alike = (LOOKALIKES.find((g) => g.includes(c)) ?? []).filter((x) => x !== c && ALEPH_BET.includes(x));
      const others = shuffle(ALEPH_BET.filter((x) => x !== c && !alike.includes(x)));
      return { kind: kinds[i % 3], c, opts: shuffle([c, ...[...alike, ...others].slice(0, 3)]) };
    });
}

/**
 * «Буквы за 5 минут» (#/letters): the 22 letters and 5 final forms — shape, name, sound, number — and a short test.
 * Offered to a player who doesn't know the letters (src/core/hebrewLevel.ts); in the menu under «Устный счёт».
 */
export function LettersPage() {
  const { t, locale } = useI18n();
  const [quiz, setQuiz] = useState(makeQuiz);
  const [i, setI] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const q = quiz[i];
  const done = i >= quiz.length;

  useEffect(() => {
    document.title = `${t('abc.title')} · ${t('app.title')}`;
  }, [t]);

  const answer = (c: string) => {
    if (pick) return;
    setPick(c);
    if (c === q.c) setScore((n) => n + 1);
  };
  const next = () => {
    setPick(null);
    setI((n) => n + 1);
  };
  const again = () => {
    setQuiz(makeQuiz());
    setI(0);
    setPick(null);
    setScore(0);
  };
  const label = useMemo(
    () => (c: string, kind: Kind) => (kind === 'name' ? letterName(c, locale) : kind === 'value' ? String(VALUES[c]) : c),
    [locale],
  );

  return (
    <>
      <TopBar title={t('abc.title')} />
      <div className="wrap">
        <main id="game" className="abc">
          <h1>{t('abc.title')}</h1>
          <p className="abc-lead">{t('abc.lead')}</p>

          {GROUPS.map((g) => (
            <section key={g.key} className="abc-group">
              <h2>{t(g.key)}</h2>
              <div className="abc-grid" dir="rtl">
                {g.letters.map((c) => (
                  <div key={c} className="abc-card">
                    <b className="he" lang="he">
                      {c}
                    </b>
                    <span className="abc-name">{letterName(c, locale)}</span>
                    <span className="abc-sound">{letterSound(c, locale)}</span>
                    <i className="num">{VALUES[c]}</i>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="abc-group">
            <h2>{t('abc.alike')}</h2>
            <div className="abc-alike">
              {LOOKALIKES.map((grp) => (
                <div key={grp.join('')} className="abc-pair" dir="rtl">
                  {grp.map((c) => (
                    <span key={c}>
                      <b className="he" lang="he">
                        {c}
                      </b>
                      <small>{letterName(c, locale)}</small>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="abc-group abc-quiz" aria-live="polite">
            <h2>{t('abc.quiz')}</h2>
            {done ? (
              <div className="abc-done">
                <p className="abc-score">{t('abc.score', { n: score, total: quiz.length })}</p>
                <p>{t('abc.done')}</p>
                <div className="row">
                  <button className="btn ghost" onClick={again}>
                    {t('abc.again')}
                  </button>
                  <a className="btn" href="#/">
                    {t('abc.play')} →
                  </a>
                </div>
              </div>
            ) : (
              <div className="abc-q">
                <p className="abc-n">
                  {i + 1} / {quiz.length}
                </p>
                <p className="abc-ask">
                  {q.kind === 'find' ? t('abc.qFind', { name: letterName(q.c, locale) }) : t(q.kind === 'name' ? 'abc.qName' : 'abc.qValue')}
                </p>
                {q.kind !== 'find' && (
                  <p className="abc-big he" lang="he">
                    {q.c}
                  </p>
                )}
                <div className={`abc-opts${q.kind === 'find' ? ' letters' : ''}`}>
                  {q.opts.map((c) => (
                    <button
                      key={c}
                      className={`opt${pick && c === q.c ? ' right' : pick === c ? ' wrong' : ''}`}
                      disabled={!!pick}
                      onClick={() => answer(c)}
                    >
                      <span className={q.kind === 'find' ? 'oh' : ''} lang={q.kind === 'find' ? 'he' : undefined}>
                        {label(c, q.kind)}
                      </span>
                    </button>
                  ))}
                </div>
                {pick && (
                  <div className={`fb ${pick === q.c ? 'ok' : 'no'}`}>
                    {pick === q.c
                      ? t('abc.right')
                      : t('abc.wrong', { name: `${q.kind === 'find' ? pick : q.c} ${letterName(q.kind === 'find' ? pick : q.c, locale)}`, v: VALUES[q.kind === 'find' ? pick : q.c] })}{' '}
                    <button className="btn" onClick={next}>
                      {t('abc.next')} →
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
      <Colophon />
    </>
  );
}
