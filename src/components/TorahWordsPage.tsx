import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { LESSONS, PARSHIOT, type ParshaId } from '../lessons';
import { useHebrewLevel } from '../core/hebrewLevel';
import { memoImages } from '../core/memo';
import { celebrate, feedback } from '../core/fx';
import { answerWord, makeRound, readStars, STARS, starsOf, torahWords, useStars, type Question, type TorahWord } from '../core/torahWords';

const Stars = ({ n }: { n: number }) => (
  <span className="tw-stars" aria-label={`${n}/${STARS}`}>
    {'★'.repeat(n)}
    <i>{'★'.repeat(STARS - n)}</i>
  </span>
);

/**
 * `#/torah-words[/<глава>]` — «Слова Торы», the children's deck (src/core/torahWords.ts): the words of the lessons — the
 * Memo pairs with their pictures and the words of the riddle cards. A game of 10 questions (the Hebrew → pick the
 * translation; with a star — sometimes the other way), stars for every word, and all the words as cards.
 */
export function TorahWordsPage({ parsha }: { parsha?: string }) {
  const { t, locale } = useI18n();
  const level = useHebrewLevel();
  const stars = useStars();
  const all = useMemo(() => torahWords(LESSONS, locale, memoImages), [locale]);
  const parshiot = useMemo(() => [...new Set(all.map((w) => w.parsha))], [all]);
  const sel = parshiot.find((p) => p === parsha);
  const words = sel ? all.filter((w) => w.parsha === sel) : all;
  const [round, setRound] = useState<Question[] | null>(null);

  useEffect(() => {
    document.title = `${t('tw.title')} · ${t('app.title')}`;
  }, [t]);

  const learned = words.filter((w) => starsOf(stars, w.key) >= STARS).length;
  const pct = words.length ? Math.round((100 * learned) / words.length) : 0;
  const parshaName = (id: ParshaId) => PARSHIOT[id].name[locale] ?? PARSHIOT[id].name.ru;

  return (
    <>
      <TopBar title={t('tw.title')} />
      <div className="wrap tw">
        <header className="tk-head">
          <p className="wing-tag kids">{t('wing.kids')}</p>
          <h1>
            {t('tw.title')}{' '}
            <span className="he" lang="he">
              מִלִּים
            </span>
          </h1>
          <p className="ws-lead">{t('tw.lead')}</p>
        </header>

        <nav className="tw-chips" aria-label={t('tw.lessons')}>
          <a href="#/torah-words" aria-current={!sel ? 'page' : undefined}>
            {t('tw.all')}
          </a>
          {parshiot.map((p) => (
            <a key={p} href={`#/torah-words/${p}`} aria-current={sel === p ? 'page' : undefined}>
              {parshaName(p)}
            </a>
          ))}
        </nav>

        <section className="ws-stats">
          <b className="ws-cov">{t('tw.learned', { k: learned, n: words.length })}</b>
          <span className="tk-words-bar" role="img" aria-label={`${pct}%`}>
            <span style={{ width: `${pct}%` }} />
          </span>
          <small className="ws-goal">
            {t('tw.how')}
            {sel && (
              <>
                {' '}
                {learned === words.length && words.length ? (
                  <a href={`#/academy/tw-${sel}`}>🎓 {t('tw.certGot')}</a>
                ) : (
                  t('tw.certHint', { name: parshaName(sel) })
                )}
              </>
            )}
          </small>
        </section>

        {round ? (
          <Game round={round} level={level} onClose={() => setRound(null)} onAgain={() => setRound(makeRound(words, all, readStars()))} />
        ) : (
          <button type="button" className="btn tw-play" onClick={() => setRound(makeRound(words, all, readStars()))}>
            ▶ {t('tw.play', { n: Math.min(10, words.length) })}
          </button>
        )}

        <h2 className="tw-h2">{t('tw.listH')}</h2>
        <ul className="tw-list">
          {words.map((w) => (
            <li key={w.key} className={starsOf(stars, w.key) >= STARS ? 'done' : undefined}>
              {w.img && <img src={w.img} alt="" loading="lazy" />}
              <span className="he tw-he" lang="he">
                {w.he}
              </span>
              {level === 'none' && w.translit && <small className="tw-translit">{w.translit}</small>}
              <span className="tw-tr">{w.tr}</span>
              <span className="tw-foot">
                <Stars n={starsOf(stars, w.key)} />
                <a href={w.href}>{parshaName(w.parsha)} →</a>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Colophon />
    </>
  );
}

/** One game: a question at a time, the answer at once («Верно!» / the right answer), «Дальше»; at the end — the score. */
function Game({ round, level, onClose, onAgain }: { round: Question[]; level: string; onClose: () => void; onAgain: () => void }) {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<TorahWord | null>(null);
  const [ok, setOk] = useState(0);
  const [combo, setCombo] = useState(0);
  if (i >= round.length)
    return (
      <div className="ws-card tw-card ws-done">
        <p>{t('tw.done', { ok, n: round.length })}</p>
        <span className="ws-btns">
          <button type="button" className="btn ghost" onClick={onClose}>
            {t('words.close')}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setI(0);
              setOk(0);
              setCombo(0);
              setPicked(null);
              onAgain();
            }}
          >
            {t('tw.again')}
          </button>
        </span>
      </div>
    );
  const q = round[i];
  const pick = (w: TorahWord) => {
    if (picked) return;
    setPicked(w);
    const right = w.key === q.word.key;
    if (right) setOk((n) => n + 1);
    const run = right ? combo + 1 : 0;
    setCombo(run);
    feedback(right ? 'right' : 'wrong', run);
    answerWord(q.word.key, right);
    // the last question: a fanfare and confetti, more for all right
    if (i + 1 === round.length) {
      const all = right && ok + 1 === round.length;
      setTimeout(() => (feedback(all ? 'perfect' : 'finish'), celebrate(all ? 'grand' : 'big')), 450);
    }
  };
  return (
    <div className="ws-card tw-card" aria-live="polite">
      <small className="ws-count">{t('words.progress', { i: i + 1, n: round.length })}</small>
      {q.word.img && <img className="tw-img" src={q.word.img} alt="" />}
      {q.reverse ? (
        <>
          <span className="tw-ask">{t('tw.askHe')}</span>
          <span className="ws-tr">{q.word.tr}</span>
        </>
      ) : (
        <>
          <span className="tw-ask">{t('tw.askTr')}</span>
          <span className="he ws-he" lang="he">
            {q.word.he}
          </span>
          {level === 'none' && q.word.translit && <small className="tw-translit">{q.word.translit}</small>}
        </>
      )}
      <span className={`tw-opts${q.reverse ? ' he-opts' : ''}`}>
        {q.options.map((o) => {
          const state = picked ? (o.key === q.word.key ? 'right' : o.key === picked.key ? 'wrong' : '') : '';
          return (
            <button key={o.key} type="button" className={`tw-opt ${state}`} disabled={!!picked} onClick={() => pick(o)}>
              {q.reverse ? (
                <span className="he" lang="he">
                  {o.he}
                </span>
              ) : (
                o.tr
              )}
            </button>
          );
        })}
      </span>
      {picked && (
        <>
          <p className={`tw-fb ${picked.key === q.word.key ? 'right' : 'wrong'}`}>
            {picked.key === q.word.key ? (
              t('tw.right')
            ) : (
              <>
                {t('tw.wrong')}{' '}
                <span className="he" lang="he">
                  {q.word.he}
                </span>{' '}
                — {q.word.tr}
              </>
            )}
          </p>
          <button
            type="button"
            className="btn ws-show"
            onClick={() => {
              setPicked(null);
              setI((n) => n + 1);
            }}
          >
            {t('tw.next')}
          </button>
        </>
      )}
    </div>
  );
}
