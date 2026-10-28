import '@fontsource/noto-serif-hebrew/400.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { NotFound, PageLoading } from './PageStates';
import { hebrewNumber } from '../core/hebrewDate';
import { markStudied } from '../core/habit';
import { useHebrewLevel } from '../core/hebrewLevel';
import {
  CHAPTERS,
  chapterAudioTracks,
  currentHebrewDay,
  dailyPortion,
  loadChapter,
  loadIndex,
  loadView,
  markedTimes,
  saveTimes,
  saveView,
  shortHebrewMonth,
  startTimes,
  stripTaamim,
  todayISO,
  tokens,
  type ReadingIndex,
  type ReadingId,
  type PsalmPortion,
  type Token,
  type View,
} from '../core/reading';

/** скорость записи — список в плеере */
const RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5];
interface Tok extends Token {
  /** the verse it belongs to */
  v: number;
}
interface TextSection {
  chapter: number;
  verses: string[];
  firstVerse: number;
}

/**
 * «Святое чтение»: порция Теґилим на день еврейского месяца (`#/reading[/day/<день>]`) или отдельная глава
 * (`#/reading/<глава>`). Аудио порции: подсветка идёт за голосом, нажатие на слово — подсветка с него, скорость 0.5–3.5×. Данные — src/core/reading.ts.
 */
export function ReadingPage({ chapter, day }: { chapter?: string; day?: string }) {
  const { t } = useI18n();
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
  const readingId: ReadingId = daily ? `day-${dailyDay}` : c;
  const tracks = useMemo(() => (daily ? chapterAudioTracks(portions, readingId) : []), [daily, portions, readingId]);
  const valid = daily ? Number.isInteger(dailyDay) && dailyDay >= 1 && dailyDay <= maxDailyDay : Number.isInteger(c) && c >= 1 && c <= CHAPTERS;
  const [idx, setIdx] = useState<ReadingIndex | null>(null);
  const [sections, setSections] = useState<TextSection[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<View>(loadView);
  const [active, setActive] = useState(-1);
  const [trackIndex, setTrackIndex] = useState(0);
  const [audioFailed, setAudioFailed] = useState(false);
  const [audioRate, setAudioRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const syncOffset = useRef(0);
  const pendingPlay = useRef(false);
  const pendingWord = useRef<number | null>(null);
  const [audioState, setAudioState] = useState<'stopped' | 'playing' | 'paused'>('stopped');

  const verses = sections?.flatMap((section) => section.verses) ?? null;
  const toks = useMemo<Tok[]>(() => (verses ?? []).flatMap((v, i) => tokens(v).map((x) => ({ ...x, v: i }))), [verses]);
  const trackTokenIndices = useMemo(() => {
    let firstVerse = 0;
    return (sections ?? []).map((section) => {
      const start = firstVerse;
      firstVerse += section.verses.length;
      return toks.flatMap((token, i) => (token.v >= start && token.v < firstVerse ? [i] : []));
    });
  }, [sections, toks]);
  const audio = sections ? tracks[trackIndex] ?? null : null;
  const playAudio = useCallback((restart = true) => {
    if (!tracks.length) return;
    setAudioFailed(false);
    if (restart && trackIndex !== 0) {
      pendingPlay.current = true;
      pendingWord.current = null;
      setTrackIndex(0);
      return;
    }
    const player = audioRef.current;
    if (!player) return;
    if (restart) {
      player.currentTime = 0;
      syncOffset.current = 0;
    }
    void player.play().catch(() => {
      setAudioState('paused');
      setAudioFailed(true);
    });
  }, [tracks.length, trackIndex]);
  const pauseAudio = useCallback(() => {
    pendingPlay.current = false;
    audioRef.current?.pause();
    setAudioState('paused');
  }, []);
  const stopAudio = useCallback(() => {
    pendingPlay.current = false;
    pendingWord.current = null;
    syncOffset.current = 0;
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
    setTrackIndex(0);
    setAudioState('stopped');
    setActive(-1);
  }, []);
  useEffect(() => {
    if (!pendingPlay.current || !audioRef.current) return;
    pendingPlay.current = false;
    void audioRef.current.play().catch(() => {
      setAudioState('paused');
      setAudioFailed(true);
    });
  }, [trackIndex]);
  // Разметки слов нет, а оценка времени неточна: нажатие на слово не перематывает голос,
  // а сдвигает подсветку, чтобы она шла дальше с этого слова.
  const seekAudioToWord = (i: number) => {
    const player = audioRef.current;
    const nextTrackIndex = trackTokenIndices.findIndex((indices) => indices.includes(i));
    if (!audio || nextTrackIndex < 0) {
      setActive(i);
      return;
    }
    if (nextTrackIndex !== trackIndex) {
      pendingPlay.current = true;
      pendingWord.current = i;
      syncOffset.current = 0;
      setTrackIndex(nextTrackIndex);
      setActive(i);
      return;
    }
    if (!player || !Number.isFinite(player.duration)) {
      setActive(i);
      return;
    }
    const indices = trackTokenIndices[trackIndex] ?? [];
    const localIndex = indices.indexOf(i);
    const localTokens = indices.map((tokenIndex) => toks[tokenIndex]);
    const starts = startTimes(localTokens, player.duration, markedTimes(audio.markId));
    syncOffset.current = (starts[localIndex] ?? 0) - player.currentTime;
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

        {audio && (
          <audio
            key={audio.src}
            ref={audioRef}
            src={src_(audio.src)}
            preload="metadata"
            onLoadedMetadata={(e) => {
              const word = pendingWord.current;
              if (word === null) return;
              pendingWord.current = null;
              const indices = trackTokenIndices[trackIndex] ?? [];
              const localIndex = indices.indexOf(word);
              if (localIndex < 0) return;
              const localTokens = indices.map((tokenIndex) => toks[tokenIndex]);
              const starts = startTimes(localTokens, e.currentTarget.duration, markedTimes(audio.markId));
              syncOffset.current = starts[localIndex] ?? 0;
              setActive(word);
            }}
            onTimeUpdate={(e) => {
              const player = e.currentTarget;
              if (player.paused && player.currentTime === 0) {
                setActive(-1);
                return;
              }
              if (!player.duration) return;
              const indices = trackTokenIndices[trackIndex] ?? [];
              const localTokens = indices.map((tokenIndex) => toks[tokenIndex]);
              const starts = startTimes(localTokens, player.duration, markedTimes(audio.markId));
              let i = -1;
              for (let k = 0; k < starts.length; k++) if (starts[k] <= player.currentTime + syncOffset.current) i = k;
              setActive(player.ended || i < 0 ? -1 : indices[i]);
            }}
            onEnded={() => {
              if (trackIndex + 1 < tracks.length) {
                syncOffset.current = 0;
                pendingPlay.current = true;
                setTrackIndex(trackIndex + 1);
              } else {
                setActive(-1);
                setAudioState('stopped');
                markStudied();
              }
            }}
            onPlay={() => setAudioState('playing')}
            onPause={() => setAudioState((state) => (state === 'stopped' ? state : 'paused'))}
            onError={() => setAudioFailed(true)}
          />
        )}
        {audioFailed && <p className="rd-note" role="alert">{t('reading.audioFailed')}</p>}
        {audio && <p className="rd-hint rd-tap-hint no-print">{t('reading.tapSync')}</p>}

        {audio && (
          <div className="rd-audio-float no-print" role="group" aria-label={t('reading.audioControls')}>
            <button
              type="button"
              className="btn"
              onClick={() => (audioState === 'playing' ? pauseAudio() : playAudio(audioState === 'stopped'))}
              aria-label={t(audioState === 'playing' ? 'reading.pause' : audioState === 'paused' ? 'reading.resume' : 'reading.start')}
              title={t(audioState === 'playing' ? 'reading.pause' : audioState === 'paused' ? 'reading.resume' : 'reading.start')}
            >
              {audioState === 'playing' ? '⏸' : '▶'}
              <span className="rd-lbl"> {t(audioState === 'playing' ? 'reading.pause' : audioState === 'paused' ? 'reading.resume' : 'reading.start')}</span>
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={stopAudio}
              disabled={audioState === 'stopped'}
              aria-label={t('reading.stop')}
              title={t('reading.stop')}
            >
              ■<span className="rd-lbl"> {t('reading.stop')}</span>
            </button>
            <label className="rd-rate" title={t('reading.speed')}>
              <span className="sr-only">{t('reading.speed')}</span>
              <select value={audioRate} onChange={(e) => setAudioRate(Number(e.target.value))}>
                {RATES.map((r) => (
                  <option key={r} value={r}>
                    {r}×
                  </option>
                ))}
              </select>
            </label>
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

        {verses &&
          tracks.map((track, i) => {
            const indices = trackTokenIndices[i] ?? [];
            return (
              <Marking
                key={track.markId}
                c={track.markId}
                label={`${t('reading.book')} ${track.chapter}`}
                toks={indices.map((tokenIndex) => toks[tokenIndex])}
                src={track.src}
                setActive={(word) => setActive(indices[word] ?? -1)}
              />
            );
          })}

        {idx && (
          <p className="rd-credit">
            {t('reading.credit')}{' '}
            <a href={idx.version.source} target="_blank" rel="noopener">
              {idx.version.title}
            </a>{' '}
            · {t('reading.pd')}
          </p>
        )}
      </div>
      <Colophon />
    </>
  );
}

const src_ = (src: string) => (/^https?:/.test(src) ? src : `${import.meta.env.BASE_URL}${src}`);

/** «Разметка аудио (для учителя)»: the recording slowly from the start; a press at the start of every word. */
function Marking({ c, label, toks, src, setActive }: { c: ReadingId; label: string; toks: Tok[]; src: string; setActive: (i: number) => void }) {
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
      <summary>{label} · {t('reading.markTitle')}</summary>
      <p className="rd-hint">{t('reading.markHow')}</p>
      <audio ref={ref} src={src_(src)} preload="none" onEnded={() => marks && stop(marks)} />
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
