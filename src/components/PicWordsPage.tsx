import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { useHebrewLevel } from '../core/hebrewLevel';
import { useMode } from '../core/mode';
import { celebrate, feedback } from '../core/fx';
import { noteAnswer } from '../core/lashonStore';
import { markStudied } from '../core/habit';
import { loadDict, reviewFromCourse, type Dict, type WordLang } from '../core/words';
import { readHebrew } from '../core/translit';
import { makePicRound, notePic, notePicBest, PIC_KNOWN, PIC_WORDS, picPoints, picSrc, picTime, readPicBest, readPicScore, type PicQuestion } from '../core/picWords';

/**
 * `#/pics` — «Слово — картинка» (src/core/picWords.ts): four pictures and a word in Hebrew in the middle — tap the right picture;
 * sometimes the other way — a picture and four words. 10 questions; the least known words first. Every question has a
 * shrinking time bar (`picTime`): the quicker the answer, the more points (`picPoints`); a run of right answers makes it faster;
 * time out — the answer is shown, as after a mistake. Below — all the words with their pictures, to look at first.
 */
export function PicWordsPage() {
  const { t, locale } = useI18n();
  const level = useHebrewLevel();
  const adults = useMode() === 'adults';
  const lang = locale as WordLang;
  const [dict, setDict] = useState<Dict | null>(null);
  const [round, setRound] = useState<PicQuestion[] | null>(null);
  const [score, setScore] = useState(readPicScore);

  useEffect(() => {
    document.title = `${t('pic.title')} · ${t('app.title')}`;
  }, [t]);
  useEffect(() => {
    let live = true;
    loadDict(lang).then((d) => live && setDict(d));
    return () => {
      live = false;
    };
  }, [lang]);

  const ids = useMemo(() => (dict ? PIC_WORDS.filter((id) => dict.tr[id] && dict.rank.has(id)) : []), [dict]);
  const he = (id: string) => dict?.words[(dict.rank.get(id) ?? 1) - 1]?.he ?? '';
  const tr = (id: string) => dict?.tr[id] ?? '';
  const read = (id: string) => (level === 'none' ? readHebrew(he(id), lang) : '');
  const known = ids.filter((id) => (score[id] ?? 0) >= PIC_KNOWN).length;
  const start = () => setRound(makePicRound(ids, readPicScore()));

  return (
    <>
      <TopBar title={t('pic.title')} />
      <div className="wrap tw pw">
        <header className="tk-head">
          <h1>
            {t('pic.title')}{' '}
            <span className="he" lang="he">
              מִלָּה וּתְמוּנָה
            </span>
          </h1>
          {!round && <p className="ws-lead">{t(adults ? 'pic.leadA' : 'pic.lead')}</p>}
        </header>

        {!dict ? (
          <p className="ws-lead">…</p>
        ) : round ? (
          <Game
            key={round.map((q) => q.id).join()}
            round={round}
            he={he}
            tr={tr}
            read={read}
            spelled={level === 'none'}
            onClose={() => (setRound(null), setScore(readPicScore()))}
            onAgain={() => (setScore(readPicScore()), start())}
          />
        ) : (
          <>
            <section className="ws-stats">
              <b className="ws-cov">{t('pic.known', { k: known, n: ids.length })}</b>
              <span className="tk-words-bar" role="img" aria-label={`${Math.round((100 * known) / Math.max(1, ids.length))}%`}>
                <span style={{ width: `${(100 * known) / Math.max(1, ids.length)}%` }} />
              </span>
            </section>
            <button type="button" className="btn tw-play" onClick={start}>
              ▶ {t('pic.play', { n: Math.min(10, ids.length) })}
            </button>
            <p className="pw-note">
              ⏱ {t('pic.timerNote')}
              {readPicBest() > 0 && <> · {t('pic.best', { p: readPicBest() })}</>}
            </p>
          </>
        )}

        {dict && !round && (
          <>
            <h2 className="tw-h2">{t('pic.allH')}</h2>
            <ul className="pw-all">
              {ids.map((id) => (
                <li key={id} className={(score[id] ?? 0) >= PIC_KNOWN ? 'done' : undefined}>
                  <img src={picSrc(id)} alt="" loading="lazy" width={512} height={512} />
                  <span className="he" lang="he">
                    {he(id)}
                  </span>
                  {read(id) && <small className="tw-translit">{read(id)}</small>}
                  <span className="pw-tr">{tr(id)}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <Colophon />
    </>
  );
}

/** `picked` when the time ran out (no picture or word has this id) */
const TIME_UP = 'time-up';

function Game({
  round,
  he,
  tr,
  read,
  spelled,
  onClose,
  onAgain,
}: {
  round: PicQuestion[];
  he: (id: string) => string;
  tr: (id: string) => string;
  read: (id: string) => string;
  spelled: boolean;
  onClose: () => void;
  onAgain: () => void;
}) {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [ok, setOk] = useState(0);
  const [combo, setCombo] = useState(0);
  const [points, setPoints] = useState(0);
  const [gain, setGain] = useState(0);
  const [record, setRecord] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  // the pictures of the next question — ahead of time
  useEffect(() => {
    for (const id of round[i + 1]?.options ?? []) new Image().src = picSrc(id);
  }, [round, i]);

  // the time of each question is fixed when it opens (the run of right answers before it)
  const limits = useRef<Record<number, number>>({});
  const q = round[i] as PicQuestion | undefined;
  const limit = q ? (limits.current[i] ??= picTime(q.reverse, combo, spelled)) : 0;
  const bar = useRef<HTMLSpanElement>(null);
  const used = useRef(0);
  const answerRef = useRef<(id: string | null) => void>(() => {});
  useEffect(() => {
    if (!limit || picked) return;
    used.current = 0;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      // a hidden tab or a long freeze is a pause, not lost time
      if (dt < 250) used.current += dt;
      const share = Math.max(0, 1 - used.current / limit);
      const el = bar.current;
      if (el) {
        el.style.transform = `scaleX(${share})`;
        el.dataset.level = share < 0.25 ? 'low' : share < 0.5 ? 'mid' : 'hi';
      }
      if (share <= 0) return answerRef.current(null);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [i, limit, picked]);

  if (!q)
    return (
      <div className="ws-card tw-card ws-done">
        <p>{t('pic.done', { ok, n: round.length })}</p>
        <p className="pw-final">
          <b>{t('pic.points', { p: points })}</b>
          {record ? <em>{t('pic.record')}</em> : readPicBest() > 0 && <small>{t('pic.best', { p: readPicBest() })}</small>}
        </p>
        <span className="ws-btns">
          <button type="button" className="btn ghost" onClick={onClose}>
            {t('words.close')}
          </button>
          <button type="button" className="btn" onClick={onAgain}>
            {t('tw.again')}
          </button>
        </span>
      </div>
    );

  const next = () => {
    window.clearTimeout(timer.current);
    setPicked(null);
    setGain(0);
    setI((n) => n + 1);
  };
  /** an answer: a picture / word, or `null` — the time is up */
  const answer = (id: string | null) => {
    if (picked) return;
    setPicked(id ?? TIME_UP);
    const right = id === q.id;
    const got = picPoints(right, 1 - used.current / limit);
    const total = points + got;
    setPoints(total);
    setGain(got);
    if (right) setOk((n) => n + 1);
    const run = right ? combo + 1 : 0;
    setCombo(run);
    feedback(run && run % 5 === 0 ? 'combo' : right ? 'right' : 'wrong', run);
    notePic(q.id, right);
    // the same word in «Святой язык — уроки» and, if it is there, in «Мои слова»
    noteAnswer(q.id, right);
    reviewFromCourse({ [q.id]: right });
    markStudied();
    if (i + 1 === round.length) {
      const all = right && ok + 1 === round.length;
      setRecord(notePicBest(total));
      window.setTimeout(() => (feedback(all ? 'perfect' : 'finish'), celebrate(all ? 'grand' : 'big')), 450);
    }
    if (right) timer.current = window.setTimeout(next, 1100);
  };
  answerRef.current = answer;
  const pick = (id: string) => answer(id);
  const state = (id: string) => (picked ? (id === q.id ? ' right' : id === picked ? ' wrong' : ' off') : '');
  const word = (
    <span className="pw-word">
      <span className="he" lang="he">
        {he(q.id)}
      </span>
      {read(q.id) && <small>{read(q.id)}</small>}
      {picked && <em>{tr(q.id)}</em>}
    </span>
  );

  return (
    <div className="pw-game" aria-live="polite">
      <div className="pw-top">
        <small>{t('words.progress', { i: i + 1, n: round.length })}</small>
        <b>
          {gain > 0 && (
            <em key={i} className="pw-plus">
              +{gain}
            </em>
          )}
          {points}
        </b>
      </div>
      <div className={`pw-time${picked ? ' stop' : ''}`} role="timer" aria-label={t('pic.timeLeft')}>
        <span key={i} ref={bar} data-level="hi" />
      </div>
      <p className="tw-ask">{t(q.reverse ? 'pic.askWord' : 'pic.askPic')}</p>
      {q.reverse ? (
        <>
          <div className="pw-one">
            <img src={picSrc(q.id)} alt="" />
            {picked && <em className="pw-cap">{tr(q.id)}</em>}
          </div>
          <div className="pw-words">
            {q.options.map((id) => (
              <button key={id} type="button" className={`pw-opt${state(id)}`} disabled={!!picked} onClick={() => pick(id)}>
                <span className="he" lang="he">
                  {he(id)}
                </span>
                {read(id) && <small>{read(id)}</small>}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="pw-grid">
          {q.options.map((id) => (
            <button
              key={id}
              type="button"
              className={`pw-tile${state(id)}`}
              disabled={!!picked}
              onClick={() => pick(id)}
              aria-label={picked ? tr(id) : t('pic.option')}
            >
              <img src={picSrc(id)} alt="" />
            </button>
          ))}
          {word}
        </div>
      )}
      {picked && picked !== q.id && (
        <>
          <p className="tw-fb wrong">
            {t(picked === TIME_UP ? 'pic.timeUp' : 'tw.wrong')}{' '}
            <span className="he" lang="he">
              {he(q.id)}
            </span>{' '}
            — {tr(q.id)}
          </p>
          <button type="button" className="btn ws-show" onClick={next}>
            {t('tw.next')}
          </button>
        </>
      )}
    </div>
  );
}
