import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { isAdmin } from '../admin/github';
import { markStudied } from '../core/habit';
import type { Nigun } from '../nigun';
import { PASS } from '../core/academy';
import { POINTS, gaps, rightCount, saveNigunResult } from '../core/nigunGame';
import { SING_POINTS, inTuneAt, linePoints, lineStars, newVoice, openMic, refAt, type PitchTrack } from '../core/singing';

/** The site's root: the built code lives in /assets/, the recordings in /nigun/ (as in src/core/tanakh.ts). */
const root = () => (import.meta.env.DEV ? import.meta.env.BASE_URL : new URL('..', import.meta.url).href);
const TIMES_KEY = (id: string) => `niflaot:nigun-times:${id}`;

/** The times marked in this browser by the admin (the markup tool below), else the niggun's own. */
function savedTimes(n: Nigun): number[] | null {
  try {
    const v = JSON.parse(localStorage.getItem(TIMES_KEY(n.id)) ?? 'null');
    return Array.isArray(v) && v.length === n.lines.length && v.every((x) => typeof x === 'number') ? v : null;
  } catch {
    return null;
  }
}

/** The line playing at second `time`: the last one that has started (−1 before the first). */
export const lineAt = (times: number[], time: number) => {
  let k = -1;
  for (let i = 0; i < times.length; i++) if (times[i] <= time) k = i;
  return k;
};

/**
 * The karaoke of a niggun: the recording and the words line by line — the line being sung lights up and fills as it goes,
 * the next one waits under it; a tap on a line sings from it. «Медленнее» — 0.75×, «Повторять строку» — the line again
 * and again, to learn it. On the English and German site each line also has how it is read and what it means.
 * «Игра на баллы» (src/core/nigunGame.ts): from the start, one word of each line is missing; when the line comes, the
 * player picks the word from three — one answer, 10 points; at the end the result and the certificate «Знаток нигуна».
 * «Петь» (src/core/singing.ts): the microphone, only after a tap — the voice is compared with the recording note by
 * note, octave aside, line by line up to 10 points; nothing is recorded or sent. The same certificate «Знаток нигуна».
 * The admin («браузер админа») can mark the start of every line while listening (`niflaot:nigun-times:<id>`, this
 * browser only) and copy the times for the data (src/nigun/index.ts).
 */
export function Karaoke({ nigun: n }: { nigun: Nigun }) {
  const { t, locale } = useI18n();
  const audio = useRef<HTMLAudioElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [times, setTimes] = useState(() => savedTimes(n) ?? n.times);
  const [time, setTime] = useState(0);
  const [end, setEnd] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [slow, setSlow] = useState(false);
  const [loop, setLoop] = useState(false);
  const [marks, setMarks] = useState<number[] | null>(null); // the markup in progress
  // the tab: «Учить», «Игра на баллы» (a missing word), «Петь» (the microphone)
  const [tab, setTab] = useState<'learn' | 'game' | 'sing'>('learn');
  const game = tab === 'game';
  const sing = tab === 'sing';
  // «Петь»: the microphone while singing, the recording's notes, the singer's notes and the result
  const mic = useRef<Awaited<ReturnType<typeof openMic>> | null>(null);
  const [track, setTrack] = useState<PitchTrack | null>(null);
  const heard = useRef<Float32Array | null>(null);
  // the points of the lines already sung — counted once, when the line is over
  const donePts = useRef<number[]>([]);
  const [voice, setVoice] = useState<'none' | 'off' | 'on'>('none');
  const voiceCandidate = useRef<{ state: 'none' | 'off' | 'on'; since: number }>({ state: 'none', since: 0 });
  const [singing, setSinging] = useState(false);
  const [singResult, setSingResult] = useState<{ got: number; max: number } | null>(null);
  const [micError, setMicError] = useState(false);
  const [p, setP] = useState<number[]>(() => n.lines.map(() => -1));
  const [result, setResult] = useState<number | null>(null);
  const gs = gaps(n);
  const total = gs.filter(Boolean).length;
  const right = rightCount(n, p);
  const admin = isAdmin();
  const cur = lineAt(times, time);
  const studied = useRef(false);

  // the clock: smooth while playing (timeupdate fires only ~4 times a second)
  useEffect(() => {
    if (!playing) return;
    let id = 0;
    const tick = () => {
      const a = audio.current;
      if (a) {
        // «Повторять строку»: at the end of the line, back to its start
        const k = lineAt(times, a.currentTime);
        const next = times[k + 1] ?? a.duration;
        if (loop && k >= 0 && a.currentTime >= next - 0.05) a.currentTime = times[k];
        // «Петь»: the singer's note at this moment of the recording; in tune right now?
        if (singing && mic.current && track && heard.current && k >= 0) {
          const me = mic.current.read();
          const f = Math.round(a.currentTime / track.hop);
          if (me && f < heard.current.length) heard.current[f] = me;
          const ok = inTuneAt(track, a.currentTime, me);
          // the hint changes only once a state has held for a moment — a flicker every frame shook the screen
          const now = !me ? 'none' : ok ? 'on' : 'off';
          const c = voiceCandidate.current;
          if (c.state !== now) voiceCandidate.current = { state: now, since: performance.now() };
          else if (performance.now() - c.since > 400) setVoice(now);
        }
        setTime(a.currentTime);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing, loop, times, singing, track]);

  // the microphone is never left on: leaving the page or the tab turns it off
  useEffect(() => () => mic.current?.stop(), []);

  useEffect(() => {
    if (audio.current) audio.current.playbackRate = slow ? 0.75 : 1;
  }, [slow]);

  // the length may be known before React listens to the element (a cached recording)
  useEffect(() => {
    const d = audio.current?.duration;
    if (d && Number.isFinite(d)) setEnd(d);
  }, []);

  // the line being sung stays in view inside the list
  useEffect(() => {
    const ol = list.current;
    const li = ol?.children[cur] as HTMLElement | undefined;
    if (ol && li) ol.scrollTo({ top: li.offsetTop - ol.clientHeight / 3, behavior: 'smooth' });
  }, [cur]);

  const play = (from?: number) => {
    const a = audio.current;
    if (!a) return;
    if (from !== undefined) a.currentTime = from;
    void a.play();
    if (!studied.current) {
      studied.current = true;
      markStudied();
    }
  };
  const toggle = () => (playing ? audio.current?.pause() : play());

  // the markup: from the start, a tap at the beginning of every line
  const startMarks = () => {
    setLoop(false);
    setMarks([]);
    play(0);
  };
  const mark = () => {
    const a = audio.current;
    if (!a || !marks) return;
    const m = [...marks, Math.round(a.currentTime * 10) / 10];
    if (m.length === n.lines.length) {
      try {
        localStorage.setItem(TIMES_KEY(n.id), JSON.stringify(m));
      } catch {}
      setTimes(m);
    }
    setMarks(m);
  };
  const foreign = locale !== n.lang;

  const startGame = () => {
    setLoop(false);
    setMarks(null);
    setResult(null);
    setP(n.lines.map(() => -1));
    setTab('game');
    play(0);
  };
  const finish = (answers: number[]) => {
    const r = rightCount(n, answers);
    saveNigunResult(n.id, { p: answers, best: r, n: total });
    setResult(r);
    audio.current?.pause();
  };
  const answer = (k: number, o: number) => {
    if (p[k] >= 0) return;
    const next = p.map((x, i) => (i === k ? o : x));
    setP(next);
    // every gap answered — the game is over, even before the recording ends
    if (gs.every((g, i) => !g || next[i] >= 0)) finish(next);
  };
  const stopMic = () => {
    mic.current?.stop();
    mic.current = null;
    setSinging(false);
    setVoice('none');
  };
  const switchTab = (to: 'learn' | 'game' | 'sing') => {
    if (to === tab) return;
    audio.current?.pause();
    stopMic();
    setResult(null);
    setSingResult(null);
    setTab(to);
  };
  // the lines the recording sings (has notes in) — they are scored
  const sungLines = (tr: PitchTrack) =>
    n.lines.map((_, k) => {
      const to = times[k + 1] ?? tr.p.length * tr.hop;
      for (let t = times[k]; t < to; t += tr.hop) if (refAt(tr, t)) return true;
      return false;
    });
  const startSinging = async () => {
    setMicError(false);
    setSingResult(null);
    try {
      const tr: PitchTrack = track ?? (await (await fetch(`${root()}${n.audio.replace(/\.mp3$/, '.pitch.json')}`)).json());
      setTrack(tr);
      mic.current?.stop();
      mic.current = await openMic();
      heard.current = newVoice(tr);
      donePts.current = [];
      setLoop(false);
      setSinging(true);
      play(0);
    } catch {
      stopMic();
      setMicError(true);
    }
  };
  // a line's points; the singer may be late, so a line is final only once the next one has gone on a while
  const ptsOf = (k: number) => {
    if (!track || !heard.current) return 0;
    if (donePts.current[k] !== undefined) return donePts.current[k];
    const v = linePoints(track, heard.current, times[k], times[k + 1] ?? track.p.length * track.hop);
    if (k < cur - 1) donePts.current[k] = v;
    return v;
  };
  const finishSinging = () => {
    if (!track) return;
    const lines = sungLines(track);
    const pts = n.lines.map((_, k) => (lines[k] ? ptsOf(k) : 0));
    const got = pts.reduce((a, b) => a + b, 0);
    const max = lines.filter(Boolean).length * SING_POINTS;
    saveNigunResult(`${n.id}:sing`, { p: pts, best: got, n: max });
    setSingResult({ got, max });
    audio.current?.pause();
    stopMic();
  };
  const singPct = singResult && singResult.max ? Math.round((100 * singResult.got) / singResult.max) : 0;
  // while singing — no numbers: on top, a strip with a cell for every sung line, filled with its points and its stars
  const scored = track ? sungLines(track) : [];
  const linePts = n.lines.map((_, k) => (scored[k] && k <= cur && (singing || singResult) ? ptsOf(k) : 0));
  const strip = scored.flatMap((s, k) => (s ? [k] : []));
  // under the strip — the line being sung now (the same one that lights up in the words below), its stars growing as it is sung
  const nowLine = singing && scored[cur] ? cur : undefined;
  const resultPct = result === null || !total ? 0 : Math.round((100 * result) / total);

  return (
    <section className="kar" aria-label={t('nigun.karaoke')}>
      <audio
        ref={audio}
        src={`${root()}${n.audio}`}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          if (game && result === null) finish(p);
          if (sing && singing) finishSinging();
        }}
        onDurationChange={(e) => setEnd(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => !playing && setTime(e.currentTarget.currentTime)}
      />
      <div className="kar-tabs" role="tablist" aria-label={t('nigun.karaoke')}>
        <button type="button" role="tab" aria-selected={tab === 'learn'} className={tab === 'learn' ? 'on' : undefined} onClick={() => switchTab('learn')}>
          🎵 {t('nigun.learn')}
        </button>
        <button type="button" role="tab" aria-selected={game} className={game ? 'on' : undefined} onClick={() => switchTab('game')}>
          ⭐ {t('nigun.game')}
        </button>
        <button type="button" role="tab" aria-selected={sing} className={sing ? 'on' : undefined} onClick={() => switchTab('sing')}>
          🎤 {t('nigun.sing')}
        </button>
      </div>
      {game && (
        <p className="kar-game-note">
          {t('nigun.gameHow', { n: total, pass: Math.round(PASS * 100) })}
        </p>
      )}
      {game && result === null && (
        <p className="kar-live">
          <b className="kar-score">{t('nigun.score', { n: right * POINTS, max: total * POINTS })}</b>
        </p>
      )}
      {game && result !== null && (
        <div className={`kar-result${resultPct >= PASS * 100 ? ' ok' : ''}`} role="status">
          <b>{t('nigun.result', { n: result, total, pct: resultPct, points: result * POINTS })}</b>
          <span>{resultPct >= PASS * 100 ? t('nigun.passed') : t('nigun.need', { pass: Math.round(PASS * 100) })}</span>
          <span className="kar-result-a">
            {resultPct >= PASS * 100 && (
              <a className="btn" href={`#/academy/n-${n.id}`}>
                🎓 {t('academy.open')}
              </a>
            )}
            <button type="button" className="btn ghost" onClick={startGame}>
              ⟲ {t('nigun.playAgain')}
            </button>
          </span>
        </div>
      )}
      {sing && (
        <>
          <p className="kar-game-note">
            {t('nigun.singHow', { pass: 70 })}
          </p>
          <p className="kar-privacy">🔒 {t('nigun.singPrivacy')}</p>
          {micError && <p className="kar-was">{t('nigun.micError')}</p>}
          {(singing || singResult) && strip.length > 0 && (
            <div className={`kar-strip-box ${singing ? voice : ''}`}>
              <ol className="kar-strip" aria-label={t('nigun.singProgress')}>
                {strip.map((k) => {
                  const sung = k < cur || (k === cur && singing) || (!singing && k <= cur);
                  const st = lineStars(linePts[k]);
                  return (
                    <li
                      key={k}
                      className={`${k === cur && singing ? 'now ' : ''}s${sung ? st : 'x'}`}
                      title={n.lines[k].text}
                      aria-label={`${n.lines[k].text}: ${'★'.repeat(st)}${'☆'.repeat(3 - st)}`}
                    >
                      <span style={{ height: `${sung ? Math.max(8, (100 * linePts[k]) / SING_POINTS) : 0}%` }} />
                    </li>
                  );
                })}
              </ol>
              {singing && (
                <p className="kar-stars" aria-live="polite">
                  {nowLine !== undefined ? (
                    <>
                      <span className="kar-stars-l" lang={n.lang}>
                        {n.lines[nowLine].text}
                      </span>
                      <b aria-label={`${lineStars(linePts[nowLine])} / 3`}>
                        {'★'.repeat(lineStars(linePts[nowLine]))}
                        <i>{'★'.repeat(3 - lineStars(linePts[nowLine]))}</i>
                      </b>
                    </>
                  ) : (
                    <span className="kar-stars-l">🎤 {t(`nigun.voice.${voice}`)}</span>
                  )}
                </p>
              )}
            </div>
          )}
          {singResult && (
            <div className={`kar-result${singPct >= PASS * 100 ? ' ok' : ''}`} role="status">
              <b>{t('nigun.singResult', { n: singResult.got, max: singResult.max, pct: singPct })}</b>
              <span>{singPct >= PASS * 100 ? t('nigun.passed') : t('nigun.singNeed', { pass: Math.round(PASS * 100) })}</span>
              <span className="kar-result-a">
                {singPct >= PASS * 100 && (
                  <a className="btn" href={`#/academy/n-${n.id}`}>
                    🎓 {t('academy.open')}
                  </a>
                )}
              </span>
            </div>
          )}
          {!singing && (
            <button type="button" className="btn kar-start" onClick={() => void startSinging()}>
              🎤 {t(singResult ? 'nigun.singAgain' : 'nigun.singStart')}
            </button>
          )}
        </>
      )}
      {game && result === null && !playing && time === 0 ? (
        <button type="button" className="btn kar-start" onClick={startGame}>
          ▶ {t('nigun.startGame')}
        </button>
      ) : null}
      <div className="kar-bar" hidden={(game && (result !== null || (!playing && time === 0))) || (sing && !singing)}>
        <button type="button" className="btn kar-play" onClick={toggle} aria-label={t(playing ? 'nigun.pause' : 'nigun.play')}>
          {playing ? '⏸' : '▶'} {t(playing ? 'nigun.pause' : 'nigun.play')}
        </button>
        {tab === 'learn' && (
          <button type="button" className="btn ghost" onClick={() => play(0)}>
            ⟲ {t('nigun.again')}
          </button>
        )}
        <label className="kar-opt">
          <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} />
          {t('nigun.slow')}
        </label>
        {tab === 'learn' && (
          <label className="kar-opt">
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
            {t('nigun.loop')}
          </label>
        )}
      </div>
      {tab === 'learn' && (
      <input
        className="kar-seek"
        type="range"
        min={0}
        max={end || 1}
        step={0.1}
        value={time}
        aria-label={t('nigun.seek')}
        onChange={(e) => {
          const a = audio.current;
          if (a) a.currentTime = Number(e.target.value);
          setTime(Number(e.target.value));
        }}
      />
      )}
      <ol ref={list} className="kar-lines" lang={n.lang}>
        {n.lines.map((l, k) => {
          const next = times[k + 1] ?? (end || times[k] + 5);
          const fill = k < cur ? 1 : k === cur ? Math.min(1, Math.max(0, (time - times[k]) / (next - times[k]))) : 0;
          const g = game ? gs[k] : null;
          const extra = (
            <>
              {foreign && l.read?.[locale] && (
                <span className="kar-read" lang={locale}>
                  {l.read[locale]}
                </span>
              )}
              {foreign && l.tr?.[locale] && (
                <span className="kar-tr" lang={locale}>
                  {l.tr[locale]}
                </span>
              )}
            </>
          );
          const cls = k === cur ? 'now' : k < cur ? 'done' : undefined;
          if (!g)
            return (
              <li key={k} className={cls}>
                {game || sing ? (
                  <div className="kar-line">
                    <span className="kar-text" style={{ '--p': `${Math.round(fill * 100)}%` } as React.CSSProperties}>
                      {l.text}
                    </span>
                    {extra}
                  </div>
                ) : (
                  <button type="button" onClick={() => play(times[k])} aria-current={k === cur ? 'true' : undefined}>
                    <span className="kar-text" style={{ '--p': `${Math.round(fill * 100)}%` } as React.CSSProperties}>
                      {l.text}
                    </span>
                    {extra}
                  </button>
                )}
              </li>
            );
          // «Игра на баллы»: the line with its gap; when the line has come — three words to choose from
          const chosen = p[k];
          const ok = chosen >= 0 && g.opts[chosen].toLocaleLowerCase() === g.word.toLocaleLowerCase();
          const open = chosen < 0 && k <= cur && result === null;
          return (
            <li key={k} className={cls}>
              <div className="kar-line">
                <span className="kar-text kar-gapline">
                  {g.before}
                  <span className={`kar-gap${chosen < 0 ? '' : ok ? ' ok' : ' bad'}`}>{chosen < 0 && result === null ? '＿＿＿' : g.word}</span>
                  {g.after}
                </span>
                {extra}
                {open && (
                  <span className="kar-opts" role="group" aria-label={t('nigun.pick')}>
                    {g.opts.map((o, i) => (
                      <button key={i} type="button" className="btn ghost" onClick={() => answer(k, i)}>
                        {o}
                      </button>
                    ))}
                  </span>
                )}
                {chosen >= 0 && !ok && <span className="kar-was">{t('nigun.was', { w: g.opts[chosen] })}</span>}
              </div>
            </li>
          );
        })}
      </ol>
      {sing && singing && playing && (
        <button type="button" className="btn ghost kar-end" onClick={finishSinging}>
          {t('nigun.singEnd')}
        </button>
      )}
      {game && result === null && playing && (
        <button type="button" className="btn ghost kar-end" onClick={() => finish(p)}>
          {t('nigun.finish')}
        </button>
      )}
      {n.draftTimes && times === n.times && <p className="kar-note">{t('nigun.draft')}</p>}

      {admin && tab === 'learn' && (
        <div className="kar-admin no-print">
          <b>{t('nigun.markTitle')}</b>
          {marks && marks.length < n.lines.length ? (
            <>
              <p>{t('nigun.markNow', { n: marks.length + 1, total: n.lines.length, line: n.lines[marks.length].text })}</p>
              <button type="button" className="btn" onClick={mark}>
                {t('nigun.markBtn', { n: marks.length + 1 })}
              </button>
            </>
          ) : (
            <>
              {marks && <p>{t('nigun.markDone')}</p>}
              <button type="button" className="btn ghost" onClick={startMarks}>
                {t('nigun.markStart')}
              </button>
            </>
          )}
          <code>{`times: [${times.join(', ')}],`}</code>
          <button type="button" className="btn ghost" onClick={() => void navigator.clipboard?.writeText(`times: [${times.join(', ')}],`)}>
            {t('nigun.markCopy')}
          </button>
        </div>
      )}
    </section>
  );
}
