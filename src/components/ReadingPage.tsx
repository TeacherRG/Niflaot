import '@fontsource/noto-serif-hebrew/400.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { NotFound, PageLoading } from './PageStates';
import { hebrewNumber } from '../core/hebrewDate';
import { markStudied } from '../core/habit';
import { celebrate } from '../core/fx';
import { useMode } from '../core/mode';
import { useHebrewLevel } from '../core/hebrewLevel';
import {
  CHAPTERS,
  MAX_WPM,
  currentHebrewDay,
  dailyPortion,
  loadChapter,
  loadIndex,
  loadView,
  markedTimes,
  records,
  saveAttempt,
  saveTimes,
  saveView,
  shortHebrewMonth,
  startTimes,
  stripTaamim,
  todayISO,
  tokens,
  wpm,
  type ReadingIndex,
  type ReadingId,
  type PsalmPortion,
  type Token,
  type View,
} from '../core/reading';

type Tool = 'reader' | 'pace' | 'step' | 'listen';
interface Tok extends Token {
  /** the verse it belongs to */
  v: number;
}
interface TextSection {
  chapter: number;
  verses: string[];
  firstVerse: number;
}

const clock = (ms: number) => {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/**
 * «Святое чтение»: порция Теґилим на день еврейского месяца (`#/reading[/day/<день>]`) или отдельная глава
 * (`#/reading/<глава>`). Тренажёры: «Чтец», «Темп», «Слово за словом» и аудио порции. Данные — src/core/reading.ts.
 */
export function ReadingPage({ chapter, day }: { chapter?: string; day?: string }) {
  const { t } = useI18n();
  const mode = useMode();
  const level = useHebrewLevel();
  const daily = chapter === undefined;
  const currentDay = currentHebrewDay();
  const dailyDay = day === undefined ? currentDay : Number(day);
  const c = daily ? dailyPortion(dailyDay)[0]?.chapter ?? 1 : Number(chapter);
  const shortMonth = shortHebrewMonth(todayISO());
  const maxDailyDay = shortMonth ? 29 : 30;
  const portions: PsalmPortion[] = useMemo(
    () => (daily ? dailyPortion(dailyDay, dailyDay === 29 && shortMonth) : [{ chapter: c }]),
    [daily, dailyDay, shortMonth, c],
  );
  const valid = daily ? Number.isInteger(dailyDay) && dailyDay >= 1 && dailyDay <= maxDailyDay : Number.isInteger(c) && c >= 1 && c <= CHAPTERS;
  const [idx, setIdx] = useState<ReadingIndex | null>(null);
  const [sections, setSections] = useState<TextSection[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<View>(loadView);
  const [tool, setTool] = useState<Tool>('reader');
  const [active, setActive] = useState(-1);
  const [audioFailed, setAudioFailed] = useState(false);
  const [audioRate, setAudioRate] = useState(1);
  const [, rerender] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const syncOffset = useRef(0);
  const [audioState, setAudioState] = useState<'stopped' | 'playing' | 'paused'>('stopped');

  const verses = sections?.flatMap((section) => section.verses) ?? null;
  const toks = useMemo<Tok[]>(() => (verses ?? []).flatMap((v, i) => tokens(v).map((x) => ({ ...x, v: i }))), [verses]);
  const total = useMemo(() => toks.reduce((a, x) => a + x.w, 0), [toks]);
  const readingId: ReadingId = daily ? `day-${dailyDay}` : c;
  const audio = daily ? idx?.audio?.[dailyDay] : undefined;
  const playAudio = useCallback((restart = true) => {
    const player = audioRef.current;
    if (!player) return;
    setAudioFailed(false);
    if (restart) {
      player.currentTime = 0;
      syncOffset.current = 0;
    }
    void player.play().catch(() => {
      setAudioState('paused');
      setAudioFailed(true);
    });
  }, []);
  const pauseAudio = useCallback(() => {
    audioRef.current?.pause();
    setAudioState('paused');
  }, []);
  const stopAudio = useCallback(() => {
    syncOffset.current = 0;
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setAudioState('stopped');
    setActive(-1);
  }, []);
  // Разметки слов нет, а оценка времени неточна: нажатие на слово не перематывает голос,
  // а сдвигает подсветку, чтобы она шла дальше с этого слова.
  const seekAudioToWord = (i: number) => {
    const player = audioRef.current;
    if (!audio || !player || !Number.isFinite(player.duration)) {
      onWord.current(i);
      return;
    }
    const starts = startTimes(toks, player.duration, markedTimes(readingId) ?? audio.times);
    syncOffset.current = (starts[i] ?? 0) - player.currentTime;
    setActive(i);
    if (player.paused || player.ended) playAudio(false);
  };

  useEffect(() => {
    document.title = `${t('reading.title')} · ${daily ? `${t('reading.day')} ${dailyDay}` : `${t('reading.book')} ${c}`} · ${t('app.title')}`;
  }, [t, daily, dailyDay, c]);
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = audioRate;
  }, [audioRate, audio]);
  useEffect(() => {
    if (!valid) return;
    stopAudio();
    setAudioFailed(false);
    setFailed(false);
    setSections(null);
    setActive(-1);
    let live = true;
    Promise.all([loadIndex(), ...portions.map(({ chapter: n }) => loadChapter(n))])
      .then(([i, ...loaded]) => {
        if (!live) return;
        const nextSections = portions.map((portion, index) => {
          const all = loaded[index] as string[];
          const from = portion.fromVerse ?? 1;
          const to = portion.toVerse ?? all.length;
          return { chapter: portion.chapter, firstVerse: from, verses: all.slice(from - 1, to) };
        });
        setIdx(i as ReadingIndex);
        setSections(nextSections);
      })
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [c, dailyDay, valid, stopAudio, portions]);

  const setV = (v: View) => {
    setView(v);
    saveView(v);
  };
  const go = (n: number) => {
    location.hash = `#/reading/${n}`;
  };
  const goDay = (n: number) => {
    location.hash = `#/reading/day/${n}`;
  };
  const dailyPortionLabel = (n: number) => {
    const ps = dailyPortion(n, n === 29 && shortMonth);
    if (ps.length && ps[0].chapter === 119) {
      return `119:${ps[0].fromVerse}–${ps[0].toVerse}`;
    }
    return ps.length > 1 ? `${ps[0].chapter}–${ps[ps.length - 1].chapter}` : String(ps[0]?.chapter ?? '');
  };

  // the word in the light stays in sight
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active < 0) return;
    textRef.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [active]);

  // a click on a word: the reader stops there; word by word — the light moves there
  const onWord = useRef<(i: number) => void>(() => {});
  if (!valid) return <NotFound />;

  return (
    <>
      <TopBar title={t('reading.title')} />
      <div className={`wrap rd${view.big ? ' rd-big' : ''}`}>
        <header className="tk-head">
          <p className="tk-kicker">
            📖 {t('reading.title')} · <span className="he">קְרִיאָה</span>
          </p>
          <h1>
            {t('reading.h1')} <span className="he">תְּהִלִּים</span>
          </h1>
          <p className="ac-lead">{t('reading.lead')}</p>
          {daily && <p className="ac-lead">{t('reading.dayHeader', { day: dailyDay, psalms: dailyPortionLabel(dailyDay) })}</p>}
          {level === 'none' && (
            <p className="rd-note">
              {t('reading.noLetters')} <a href="#/letters">{t('abc.title')}</a>
            </p>
          )}
        </header>

        <nav className="rd-nav" aria-label={t(daily ? 'reading.dayPick' : 'reading.pick')}>
          <button type="button" className="rd-arrow" onClick={() => (daily ? goDay(dailyDay - 1) : go(c - 1))} disabled={daily ? dailyDay <= 1 : c <= 1} aria-label={t('reading.prev')}>
            ‹
          </button>
          <label className="rd-pick">
            <span className="sr-only">{t(daily ? 'reading.dayPick' : 'reading.pick')}</span>
            <select value={daily ? dailyDay : c} onChange={(e) => (daily ? goDay(Number(e.target.value)) : go(Number(e.target.value)))}>
              {Array.from({ length: daily ? maxDailyDay : CHAPTERS }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {daily ? `${t('reading.day')} ${n} · ${dailyPortionLabel(n)}` : `${t('reading.book')} ${n}${idx ? ` — ${t('reading.words', { n: idx.words[n - 1] })}` : ''}`}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="rd-arrow" onClick={() => (daily ? goDay(dailyDay + 1) : go(c + 1))} disabled={daily ? dailyDay >= maxDailyDay : c >= CHAPTERS} aria-label={t('reading.next')}>
            ›
          </button>
        </nav>

        <div className="rd-opts no-print">
          <label>
            <input type="checkbox" checked={view.taamim} onChange={(e) => setV({ ...view, taamim: e.target.checked })} /> {t('reading.taamim')}
          </label>
          <label>
            <input type="checkbox" checked={view.big} onChange={(e) => setV({ ...view, big: e.target.checked })} /> {t('reading.big')}
          </label>
        </div>

        <section className="rd-tools no-print" aria-labelledby="rd-tools-h">
          <h2 id="rd-tools-h">{t('reading.tools')}</h2>
          {audio && (
            <audio
              ref={audioRef}
              src={src_(audio.src)}
              preload="metadata"
              controls={tool === 'listen'}
              onTimeUpdate={(e) => {
                const player = e.currentTarget;
                if (player.paused && player.currentTime === 0) {
                  setActive(-1);
                  return;
                }
                if (!player.duration) return;
                const starts = startTimes(toks, player.duration, markedTimes(readingId) ?? audio.times);
                let i = -1;
                for (let k = 0; k < starts.length; k++) if (starts[k] <= player.currentTime + syncOffset.current) i = k;
                setActive(player.ended ? -1 : i);
              }}
              onEnded={() => {
                setActive(-1);
                setAudioState('stopped');
                markStudied();
              }}
              onPlay={() => setAudioState('playing')}
              onPause={() => setAudioState((state) => (state === 'stopped' ? state : 'paused'))}
              onError={() => setAudioFailed(true)}
            />
          )}
          {audioFailed && <p className="rd-note" role="alert">{t('reading.audioFailed')}</p>}
          <div className="rd-tabs" role="tablist">
            {(['reader', 'pace', 'step', ...(audio ? ['listen' as const] : [])] as Tool[]).map((x) => (
              <button
                key={x}
                type="button"
                role="tab"
                aria-selected={tool === x}
                className={tool === x ? 'on' : ''}
                onClick={() => {
                  setTool(x);
                  setActive(-1);
                }}
              >
                {t(`reading.tool.${x}`)}
              </button>
            ))}
          </div>
          {verses && (
            <>
              {tool === 'reader' && <Reader key={readingId} c={readingId} toks={toks} total={total} onWord={onWord} setActive={setActive} onStart={playAudio} onStop={stopAudio} adults={mode === 'adults'} done={() => rerender((n) => n + 1)} />}
              {tool === 'pace' && <Pace key={readingId} c={readingId} toks={toks} setActive={setActive} onStart={playAudio} onPause={pauseAudio} onStop={stopAudio} />}
              {tool === 'step' && <Step key={c} toks={toks} active={active} setActive={setActive} onWord={onWord} />}
              {tool === 'listen' && audio && <Listen rate={audioRate} setRate={setAudioRate} estimate={!markedTimes(readingId) && !audio.times} />}
            </>
          )}
        </section>

        {audio && (
          <div className="rd-audio-float no-print" role="group" aria-label={t('reading.audioControls')}>
            <button
              type="button"
              className="btn"
              onClick={() => (audioState === 'playing' ? pauseAudio() : playAudio(audioState === 'stopped'))}
              aria-label={t(audioState === 'playing' ? 'reading.pause' : audioState === 'paused' ? 'reading.resume' : 'reading.start')}
              title={t(audioState === 'playing' ? 'reading.pause' : audioState === 'paused' ? 'reading.resume' : 'reading.start')}
            >
              {audioState === 'playing' ? '⏸' : '▶'}{' '}
              {t(audioState === 'playing' ? 'reading.pause' : audioState === 'paused' ? 'reading.resume' : 'reading.start')}
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={stopAudio}
              disabled={audioState === 'stopped'}
              aria-label={t('reading.stop')}
              title={t('reading.stop')}
            >
              ■ {t('reading.stop')}
            </button>
          </div>
        )}

        {failed ? (
          <p className="rd-note">{t('reading.failed')}</p>
        ) : !verses ? (
          <PageLoading />
        ) : (
          <article className="rd-text he" lang="he" dir="rtl" ref={textRef}>
            {sections?.map((section, si) => {
              const verseOffset = sections.slice(0, si).reduce((sum, previous) => sum + previous.verses.length, 0);
              return (
                <section key={`${section.chapter}-${section.firstVerse}`}>
                  <h2 className="rd-ch">פֶּרֶק {hebrewNumber(section.chapter)}</h2>
                  {section.verses.map((_, vi) => {
                    const globalVerse = verseOffset + vi;
                    return (
                      <p key={globalVerse} className="rd-v">
                        <span className="rd-vn" aria-hidden="true">
                          {hebrewNumber(section.firstVerse + vi).replace(/[׳״]/g, '')}
                        </span>{' '}
                        {toks.map((x, i) =>
                          x.v !== globalVerse ? null : (
                            <span key={i}>
                              <span
                                data-i={i}
                                className={`rd-w${i === active ? ' rd-on' : active > i ? ' rd-past' : ''}${x.w ? '' : ' rd-paseq'}`}
                                onClick={() => x.w && seekAudioToWord(i)}
                              >
                                {view.taamim ? x.s : stripTaamim(x.s)}
                              </span>{' '}
                            </span>
                          ),
                        )}
                      </p>
                    );
                  })}
                </section>
              );
            })}
          </article>
        )}

        {verses && audio && <Marking c={readingId} toks={toks} src={audio.src} setActive={setActive} />}

        {idx && (
          <p className="rd-credit">
            {t('reading.credit')}{' '}
            <a href={idx.version.source} target="_blank" rel="noopener">
              {idx.version.title}
            </a>{' '}
            · {t('reading.pd')}
            {audio?.credit && (
              <>
                {' '}
                · {t('reading.audioBy')}{' '}
                <a href={audio.credit.url} target="_blank" rel="noopener">
                  {audio.credit.name}
                </a>
              </>
            )}
          </p>
        )}
      </div>
      <Colophon />
    </>
  );
}

/** «Чтец»: a stopwatch — read the chapter aloud; «Готово» or a tap on the last word read; words per minute, the record. */
function Reader({
  c,
  toks,
  total,
  onWord,
  setActive,
  onStart,
  onStop,
  adults,
  done,
}: {
  c: ReadingId;
  toks: Tok[];
  total: number;
  onWord: React.MutableRefObject<(i: number) => void>;
  setActive: (i: number) => void;
  onStart: (restart?: boolean) => void;
  onStop: () => void;
  adults: boolean;
  done: () => void;
}) {
  const { t } = useI18n();
  const [start, setStart] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [result, setResult] = useState<{ words: number; ms: number; v: number | null; record: boolean } | null>(null);
  const rec = records()[c];

  useEffect(() => {
    if (start === null) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [start]);

  const finish = (words: number) => {
    if (start === null) return;
    onStop();
    const ms = Date.now() - start;
    let v = wpm(words, ms);
    if (v !== null && v > MAX_WPM) v = null;
    const record = v !== null && saveAttempt(c, v);
    if (v !== null) {
      markStudied();
      if (record && rec) celebrate('small', adults);
    }
    setStart(null);
    setResult({ words, ms, v, record: record && !!rec });
    done();
  };
  onWord.current = (i) => {
    if (start === null) return;
    setActive(i);
    finish(toks.slice(0, i + 1).reduce((a, x) => a + x.w, 0));
  };

  return (
    <div className="rd-tool">
      <dl className="rd-stats">
        <div>
          <dt>{t('reading.reader')}</dt>
          <dd>
            <b>{result?.v ?? rec?.last ?? '–'}</b> {t('reading.wpm')}
          </dd>
        </div>
        <div>
          <dt>{t('reading.best')}</dt>
          <dd>{rec ? <b>{rec.best}</b> : <>– {t('reading.noTries')}</>}</dd>
        </div>
        <div>
          <dt>{t('reading.last')}</dt>
          <dd>
            <b>{rec?.last ?? '–'}</b>
          </dd>
        </div>
      </dl>
      {start === null ? (
        <>
          {result && (
            <p className={`rd-result${result.record ? ' rd-record' : ''}`} role="status">
              {result.v === null
                ? t('reading.tooFast')
                : t('reading.result', { words: t('reading.words', { n: result.words }), time: clock(result.ms), v: result.v })}
              {result.record && <> · {t('reading.newRecord')}</>}
            </p>
          )}
          <p className="rd-hint">{t('reading.readerHow', { words: t('reading.words', { n: total }) })}</p>
          <button
            type="button"
            className="btn rd-big-btn"
            onClick={() => {
              setActive(-1);
              setResult(null);
              setNow(Date.now());
              setStart(Date.now());
              onStart();
            }}
          >
            ▶ {result ? t('reading.again') : t('reading.start')}
          </button>
        </>
      ) : (
        <>
          <p className="rd-clock" aria-live="off">
            {clock(now - start)}
          </p>
          <p className="rd-hint">{t('reading.readerRun')}</p>
          <div className="rd-row">
            <button type="button" className="btn rd-big-btn" onClick={() => finish(total)}>
              ■ {t('reading.finish')}
            </button>
            <button type="button" className="btn ghost" onClick={() => (onStop(), setStart(null))}>
              {t('reading.cancel')}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/** «Темп»: the light goes word by word at the chosen speed — keep up with it reading aloud. */
function Pace({ c, toks, setActive, onStart, onPause, onStop }: { c: ReadingId; toks: Tok[]; setActive: (i: number) => void; onStart: (restart?: boolean) => void; onPause: () => void; onStop: () => void }) {
  const { t } = useI18n();
  const rec = records()[c];
  const [speed, setSpeed] = useState(() => Math.min(200, Math.max(20, Math.round(((rec?.best ?? 50) * 1.1) / 5) * 5)));
  const [at, setAt] = useState(-1);
  const [run, setRun] = useState(false);
  const end = at >= toks.length;

  useEffect(() => {
    setActive(end ? -1 : at);
  }, [at, end, setActive]);
  useEffect(() => {
    if (!run) return;
    if (at >= toks.length) {
      setRun(false);
      onStop();
      markStudied();
      return;
    }
    const w = at < 0 ? 1 : toks[at].w;
    const id = setTimeout(() => setAt((i) => i + 1), at < 0 ? 600 : (w * 60000) / speed);
    return () => clearTimeout(id);
  }, [run, at, speed, toks, onStop]);

  return (
    <div className="rd-tool">
      <label className="rd-speed">
        {t('reading.speed')}: <b>{speed}</b> {t('reading.wpm')}
        <input type="range" min={20} max={200} step={5} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} />
      </label>
      <p className="rd-hint">{end ? t('reading.paceDone') : t('reading.paceHow')}</p>
      <div className="rd-row">
        <button
          type="button"
          className="btn rd-big-btn"
          onClick={() => {
            if (end || at < 0) setAt(-1);
            if (!run || end) onStart(at < 0 || end);
            else onPause();
            setRun(!run || end);
          }}
        >
          {run && !end ? `⏸ ${t('reading.pause')}` : at < 0 || end ? `▶ ${t('reading.start')}` : `▶ ${t('reading.resume')}`}
        </button>
        {at >= 0 && !end && (
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              onStop();
              setRun(false);
              setAt(-1);
            }}
          >
            {t('reading.restart')}
          </button>
        )}
      </div>
    </div>
  );
}

/** «Слово за словом»: the light moves on the space bar, a tap on the big button or on a word. */
function Step({
  toks,
  active,
  setActive,
  onWord,
}: {
  toks: Tok[];
  active: number;
  setActive: (i: number) => void;
  onWord: React.MutableRefObject<(i: number) => void>;
}) {
  const { t } = useI18n();
  const words = toks.map((x, i) => (x.w ? i : -1)).filter((i) => i >= 0);
  const k = words.indexOf(active);
  // counted as in the reader: words joined by a maqaf — each
  const total = toks.reduce((a, x) => a + x.w, 0);
  const upTo = toks.slice(0, active + 1).reduce((a, x) => a + x.w, 0);
  const move = (d: number) => {
    const n = k + d;
    if (n >= words.length) {
      setActive(-1);
      markStudied();
    } else setActive(words[Math.max(0, n)]);
  };
  onWord.current = (i) => setActive(i);
  const moveRef = useRef(move);
  moveRef.current = move;
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.('input, select, textarea, summary')) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        moveRef.current(1);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        moveRef.current(-1);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  return (
    <div className="rd-tool">
      <p className="rd-hint">{t('reading.stepHow')}</p>
      <p className="rd-count">{k >= 0 ? t('reading.stepAt', { n: upTo, m: total }) : t('reading.stepStart', { m: total })}</p>
      <div className="rd-row">
        <button type="button" className="btn ghost" onClick={() => move(-1)} disabled={k <= 0}>
          {t('reading.back')}
        </button>
        <button type="button" className="btn rd-big-btn" onClick={() => move(1)}>
          {t('reading.nextWord')}
        </button>
      </div>
    </div>
  );
}

const src_ = (src: string) => (/^https?:/.test(src) ? src : `${import.meta.env.BASE_URL}${src}`);

/** «Слушать»: the recording, the light follows the voice (the teacher's marking, else an estimate by the letters). */
function Listen({ rate, setRate, estimate }: { rate: number; setRate: (rate: number) => void; estimate: boolean }) {
  const { t } = useI18n();
  return (
    <div className="rd-tool">
      <label className="rd-check">
        <input type="checkbox" checked={rate < 1} onChange={(e) => setRate(e.target.checked ? 0.75 : 1)} /> {t('reading.slower')}
      </label>
      {estimate && <p className="rd-hint">{t('reading.estimate')}</p>}
    </div>
  );
}

/** «Разметка аудио (для учителя)»: the recording slowly from the start; a press at the start of every word. */
function Marking({ c, toks, src, setActive }: { c: ReadingId; toks: Tok[]; src: string; setActive: (i: number) => void }) {
  const { t } = useI18n();
  const ref = useRef<HTMLAudioElement>(null);
  const words = useMemo(() => toks.map((x, i) => (x.w ? i : -1)).filter((i) => i >= 0), [toks]);
  const [marks, setMarks] = useState<number[] | null>(null);
  const [saved, setSaved] = useState<number[] | null>(() => markedTimes(c));
  const [copied, setCopied] = useState(false);
  const run = marks !== null;

  const stop = (m: number[]) => {
    ref.current?.pause();
    setMarks(null);
    setActive(-1);
    if (m.length) {
      saveTimes(c, m);
      setSaved(m);
    }
  };
  const tap = () => {
    const a = ref.current;
    if (!a || !marks) return;
    const m = [...marks, Math.round(a.currentTime * 100) / 100];
    if (m.length >= words.length) stop(m);
    else {
      setMarks(m);
      setActive(words[m.length]);
    }
  };
  const tapRef = useRef(tap);
  tapRef.current = tap;
  useEffect(() => {
    if (!run) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        tapRef.current();
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [run]);

  const json = saved ? JSON.stringify({ chapter: c, times: saved }) : '';
  return (
    <details className="rd-mark no-print">
      <summary>{t('reading.markTitle')}</summary>
      <p className="rd-hint">{t('reading.markHow')}</p>
      <audio ref={ref} src={src_(src)} preload="metadata" onEnded={() => marks && stop(marks)} />
      {run ? (
        <div className="rd-row">
          <button type="button" className="btn rd-tap" onClick={tap}>
            {t('reading.markTap', { n: marks.length + 1, m: words.length })}
          </button>
          <button type="button" className="btn ghost" onClick={() => stop(marks)}>
            {t('reading.markStop')}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn"
          onClick={() => {
            const a = ref.current;
            if (!a) return;
            a.currentTime = 0;
            a.playbackRate = 0.6;
            setMarks([]);
            setActive(words[0]);
            void a.play();
          }}
        >
          ▶ {t('reading.markStart')}
        </button>
      )}
      {saved && !run && (
        <>
          <p className="rd-hint">{t('reading.markSaved', { n: saved.length, m: words.length })}</p>
          <textarea className="rd-json" readOnly value={json} rows={3} onFocus={(e) => e.target.select()} />
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              void navigator.clipboard?.writeText(json).then(() => setCopied(true));
            }}
          >
            {copied ? `✓ ${t('reading.copied')}` : t('reading.copy')}
          </button>
        </>
      )}
    </details>
  );
}
