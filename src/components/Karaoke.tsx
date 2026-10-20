import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { isAdmin } from '../admin/github';
import { markStudied } from '../core/habit';
import type { Nigun } from '../nigun';
import { PASS } from '../core/academy';
import { POINTS, gaps, rightCount, saveNigunResult } from '../core/nigunGame';

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
  // «Игра на баллы»: the answers of this game (-1 — not yet), and the result once it is over
  const [game, setGame] = useState(false);
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
        setTime(a.currentTime);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [playing, loop, times]);

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
    setGame(true);
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
  const exitGame = () => {
    audio.current?.pause();
    setGame(false);
    setResult(null);
  };
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
        }}
        onDurationChange={(e) => setEnd(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => !playing && setTime(e.currentTarget.currentTime)}
      />
      <div className="kar-tabs" role="tablist" aria-label={t('nigun.karaoke')}>
        <button type="button" role="tab" aria-selected={!game} className={!game ? 'on' : undefined} onClick={exitGame}>
          🎵 {t('nigun.learn')}
        </button>
        <button type="button" role="tab" aria-selected={game} className={game ? 'on' : undefined} onClick={() => !game && setGame(true)}>
          ⭐ {t('nigun.game')}
        </button>
      </div>
      {game && (
        <p className="kar-game-note">
          {t('nigun.gameHow', { n: total, pass: Math.round(PASS * 100) })}
          {result === null && (
            <b className="kar-score">
              {' '}
              · {t('nigun.score', { n: right * POINTS, max: total * POINTS })}
            </b>
          )}
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
      {game && result === null && !playing && time === 0 ? (
        <button type="button" className="btn kar-start" onClick={startGame}>
          ▶ {t('nigun.startGame')}
        </button>
      ) : null}
      <div className="kar-bar" hidden={game && (result !== null || (!playing && time === 0))}>
        <button type="button" className="btn kar-play" onClick={toggle} aria-label={t(playing ? 'nigun.pause' : 'nigun.play')}>
          {playing ? '⏸' : '▶'} {t(playing ? 'nigun.pause' : 'nigun.play')}
        </button>
        {!game && (
          <button type="button" className="btn ghost" onClick={() => play(0)}>
            ⟲ {t('nigun.again')}
          </button>
        )}
        <label className="kar-opt">
          <input type="checkbox" checked={slow} onChange={(e) => setSlow(e.target.checked)} />
          {t('nigun.slow')}
        </label>
        {!game && (
          <label className="kar-opt">
            <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
            {t('nigun.loop')}
          </label>
        )}
      </div>
      {!game && (
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
                {game ? (
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
      {game && result === null && playing && (
        <button type="button" className="btn ghost kar-end" onClick={() => finish(p)}>
          {t('nigun.finish')}
        </button>
      )}
      {n.draftTimes && times === n.times && <p className="kar-note">{t('nigun.draft')}</p>}

      {admin && !game && (
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
