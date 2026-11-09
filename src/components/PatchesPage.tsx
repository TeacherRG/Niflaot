import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { useMode } from '../core/mode';
import { markStudied } from '../core/habit';
import { celebrate, feedback } from '../core/fx';
import {
  LEVELS,
  MAX_LEVEL,
  TOO_MANY,
  area,
  check,
  hintRect,
  inside,
  letterOf,
  lettersOf,
  loadPatches,
  makeBoard,
  overlaps,
  sameRect,
  recordWin,
  savePatches,
  solved,
  spanRect,
  type Clue,
  type PatchesState,
  type Rect,
  type Shape,
  type Wrong,
} from '../core/patches';

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
/** the colours of the pieces (one per letter of the board), soft enough for both themes */
const COLORS = ['#E5534B', '#D4A72C', '#8B6CEF', '#2DA44E', '#1F9EB0', '#E0823D', '#C2569B', '#5A8DEE', '#7DA233', '#B07A4F', '#3FB7A0', '#A66CC8'];
const LETTER_VALUES: [string, number][] = [...'אבגדהוזחטיכלמנסעפצ'].map((ch, i) => [ch, i < 9 ? i + 1 : (i - 8) * 10]);

/** the shape mark of a clue, in the top corner of its cell (and in the legend) */
function ShapeMark({ shape, x, y, s }: { shape: Shape; x: number; y: number; s: number }) {
  const [w, h] = shape === 'tall' ? [s * 0.62, s] : shape === 'wide' ? [s, s * 0.62] : [s * 0.85, s * 0.85];
  return <rect className={`pt-shape${shape === 'any' ? ' any' : ''}`} x={x - w / 2} y={y - h / 2} width={w} height={h} rx={s * 0.15} />;
}

/**
 * `#/patches` — «Лоскуты гематрии» (src/core/patches.ts): cover the grid with rectangles; every rectangle holds one letter,
 * and its gematria is the number of cells. The level follows the player: few mistakes — harder, many — easier.
 */
export function PatchesPage() {
  const { t } = useI18n();
  const adults = useMode() === 'adults';
  const [state, setState] = useState<PatchesState>(loadPatches);
  // the level and the seed of this board (the state moves on after a win)
  const [level, setLevel] = useState(state.l);
  const [seed, setSeed] = useState(state.g);
  const board = useMemo(() => makeBoard(level, seed), [level, seed]);
  const L = LEVELS[level - 1];
  const n = board.n;
  const [rects, setRects] = useState<Rect[]>([]);
  // «Отменить» — a step back: every change of the shapes (draw, remove, reset) is kept
  const [history, setHistory] = useState<Rect[][]>([]);
  // «Подсказка» — the next step highlighted; a second press draws it
  const [shown, setShown] = useState<Rect | null>(null);
  const [drag, setDrag] = useState<{ a: number; b: number } | null>(null);
  const [bad, setBad] = useState<Rect | null>(null);
  const [msg, setMsg] = useState<string>('');
  const [mistakes, setMistakes] = useState(0);
  const [hints, setHints] = useState(0);
  const [sec, setSec] = useState(0);
  const [started, setStarted] = useState(false);
  const [won, setWon] = useState<{ sec: number; mistakes: number; hints: number; from: number; to: number; record: boolean } | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const [anchor, setAnchor] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const winCard = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = `${t('patches.title')} · ${t('app.title')}`;
  }, [t]);

  // the clock runs from the first rectangle to the solution
  useEffect(() => {
    if (!started || won) return;
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [started, won]);

  useEffect(() => {
    if (!bad) return;
    const id = setTimeout(() => setBad(null), 900);
    return () => clearTimeout(id);
  }, [bad]);

  const clueIndex = (x: Rect) => board.clues.findIndex((k) => inside(x, k.cell, n));
  const value = (k: Clue) => `\u2067${letterOf(k.value)}\u2069 = ${k.value}`;

  const explain = (w: Wrong, x: Rect): string => {
    if (w.why === 'none') return t('patches.wrongNone');
    if (w.why === 'two') return t('patches.wrongTwo');
    if (w.why === 'area') {
      const parts = lettersOf(w.clue.value).map(([, v]) => v);
      const sum = parts.length > 1 ? `${parts.join(' + ')} = ${w.clue.value}` : String(w.clue.value);
      return t('patches.wrongArea', { letter: `\u2067${letterOf(w.clue.value)}\u2069`, sum, got: area(x) });
    }
    return t('patches.wrongShape', { shape: t(`patches.shape.${w.clue.shape}`) });
  };

  const place = (x: Rect, byHint = false) => {
    if (won) return;
    if (!started) setStarted(true);
    const w = check(board, x);
    if (w) {
      setBad(x);
      setMsg(explain(w, x));
      setMistakes((m) => m + 1);
      feedback('wrong');
      return;
    }
    const next = [...rects.filter((y) => !overlaps(x, y)), x];
    commit(next);
    const k = board.clues[clueIndex(x)];
    setMsg(byHint ? t('patches.hinted', { v: value(k) }) : t('patches.right', { v: value(k) }));
    if (solved(board, next)) win(hints);
    else feedback('right', next.length);
  };

  const win = (usedHints: number) => {
    const rec = recordWin(state, level, sec, mistakes, usedHints);
    const best = state.b[level];
    savePatches(rec);
    setState(rec);
    setWon({ sec, mistakes, hints: usedHints, from: level, to: rec.l, record: !usedHints && best !== undefined && sec < best });
    setMsg('');
    markStudied();
    const clean = !usedHints && mistakes <= 1;
    feedback(clean ? 'perfect' : 'finish');
    celebrate(clean ? 'grand' : 'big', adults);
    setTimeout(() => winCard.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600);
  };

  const commit = (next: Rect[]) => {
    setHistory((h) => [...h, rects]);
    setRects(next);
    if (shown && next.some((y) => sameRect(y, shown))) setShown(null);
  };
  const undo = () => {
    if (!history.length) return;
    setRects(history[history.length - 1]);
    setHistory(history.slice(0, -1));
    setMsg('');
  };

  const cellAt = (e: ReactPointerEvent): number | null => {
    const r = svg.current?.getBoundingClientRect();
    if (!r) return null;
    const pad = 7; // the board's border 1 + padding 6
    const side = (r.width - 2 * pad) / n;
    const c = Math.floor((e.clientX - r.left - pad) / side);
    const w = Math.floor((e.clientY - r.top - pad) / side);
    return c >= 0 && c < n && w >= 0 && w < n ? w * n + c : null;
  };

  const down = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (won) return;
    const cell = cellAt(e);
    if (cell === null) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDrag({ a: cell, b: cell });
  };
  const move = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const cell = cellAt(e);
    if (cell !== null && cell !== drag.b) setDrag({ ...drag, b: cell });
  };
  const up = () => {
    if (!drag) return;
    const x = spanRect(drag.a, drag.b, n);
    setDrag(null);
    if (area(x) === 1) {
      // a tap: on a rectangle — take it away; on an empty cell — nothing (a tap is not a mistake)
      const hit = rects.find((y) => inside(y, drag.a, n));
      if (hit) {
        commit(rects.filter((y) => y !== hit));
        setMsg('');
      }
      return;
    }
    place(x);
  };

  const key = (e: KeyboardEvent) => {
    if (won) return;
    const d = { ArrowUp: -n, ArrowDown: n, ArrowLeft: -1, ArrowRight: 1 }[e.key];
    const cur = cursor ?? 0;
    if (d !== undefined) {
      e.preventDefault();
      const to = cur + d;
      if (cursor === null) return setCursor(0);
      if (to < 0 || to >= n * n || (Math.abs(d) === 1 && Math.floor(to / n) !== Math.floor(cur / n))) return;
      setCursor(to);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (anchor === null) setAnchor(cur);
      else {
        const x = spanRect(anchor, cur, n);
        setAnchor(null);
        if (area(x) > 1) place(x);
      }
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (rects.some((y) => inside(y, cur, n))) commit(rects.filter((y) => !inside(y, cur, n)));
    } else if (e.key === 'Escape') setAnchor(null);
  };

  const reset = (lv: number, sd: number) => {
    setLevel(lv);
    setSeed(sd);
    setRects([]);
    setHistory([]);
    setShown(null);
    setMistakes(0);
    setHints(0);
    setSec(0);
    setStarted(false);
    setWon(null);
    setMsg('');
    setAnchor(null);
  };
  const restart = () => {
    commit([]);
    setMsg('');
  };
  const hint = () => {
    if (won) return;
    // the highlighted step, pressed again — draw it
    if (shown && !rects.some((y) => sameRect(y, shown))) return place(shown, true);
    const x = hintRect(board, rects);
    if (!x) return;
    setHints(hints + 1);
    setShown(x);
    const k = board.clues[clueIndex(x)];
    const blocking = rects.some((y) => overlaps(x, y));
    setMsg(t(blocking ? 'patches.hintBlocked' : 'patches.hintShow', { v: value(k) }));
  };
  const easier = () => {
    const lv = Math.max(1, level - 1);
    const rec = { ...state, l: lv, g: state.g + 1 };
    savePatches(rec);
    setState(rec);
    reset(lv, rec.g);
  };

  const preview = drag && drag.a !== drag.b ? spanRect(drag.a, drag.b, n) : anchor !== null && cursor !== null ? spanRect(anchor, cursor, n) : null;
  const size = (lv: number) => `${LEVELS[lv - 1].n}×${LEVELS[lv - 1].n}`;
  const best = state.b[level];
  const covered = rects.reduce((s, x) => s + area(x), 0);

  return (
    <>
      <TopBar title={t('patches.title')} />
      <div className="wrap zip patches">
        <header className="tk-head">
          <h1>
            {t('patches.title')}{' '}
            <span className="he" lang="he">
              טְלָאִים
            </span>
          </h1>
          <p className="ws-lead">{t('patches.lead')}</p>
        </header>

        <div className="zip-bar">
          <span className="zip-level" title={t('patches.levelHow')}>
            {t('zip.level', { k: level, n: MAX_LEVEL })} · {size(level)}
          </span>
          <span className="zip-ref">
            {t('patches.mistakes', { k: won ? won.mistakes : mistakes })}
            {(won ? won.hints : hints) > 0 && ` · ${t('patches.hintsUsed', { k: won ? won.hints : hints })}`}
          </span>
        </div>
        <div className={`zip-timer${started && !won ? ' run' : ''}${won ? ' done' : ''}`} role="timer" aria-label={t('zip.time')}>
          <span className="zip-clock">⏱ {clock(won ? won.sec : sec)}</span>
          {best !== undefined && <small>{t('zip.best', { time: clock(best) })}</small>}
        </div>

        <div className="zip-board-wrap">
          <svg
            ref={svg}
            className={`zip-board pt-board${won ? ' done' : ''}`}
            viewBox={`0 0 ${n} ${n}`}
            role="application"
            tabIndex={0}
            aria-label={t('patches.boardLabel')}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={() => setDrag(null)}
            onKeyDown={key}
            onFocus={() => cursor === null && setCursor(0)}
          >
            {Array.from({ length: n * n }, (_, c) => (
              <rect key={c} className="pt-cell" x={c % n} y={Math.floor(c / n)} width={1} height={1} />
            ))}
            {rects.map((x, i) => {
              const color = COLORS[clueIndex(x) % COLORS.length];
              return <rect key={i} className="pt-piece" x={x.c + 0.06} y={x.r + 0.06} width={x.w - 0.12} height={x.h - 0.12} rx={0.14} style={{ fill: color, stroke: color }} />;
            })}
            {preview && <rect className={`pt-preview${check(board, preview) ? '' : ' ok'}`} x={preview.c + 0.06} y={preview.r + 0.06} width={preview.w - 0.12} height={preview.h - 0.12} rx={0.14} />}
            {shown && <rect className="pt-hint" x={shown.c + 0.04} y={shown.r + 0.04} width={shown.w - 0.08} height={shown.h - 0.08} rx={0.14} />}
            {bad && <rect className="pt-bad" x={bad.c + 0.06} y={bad.r + 0.06} width={bad.w - 0.12} height={bad.h - 0.12} rx={0.14} />}
            {preview && (
              <text className="pt-count" transform={`translate(${preview.c + preview.w / 2} ${preview.r + preview.h / 2}) scale(0.01)`} dy="4">
                {area(preview)}
              </text>
            )}
            {board.clues.map((k, i) => {
              const [x, y] = [(k.cell % n) + 0.5, Math.floor(k.cell / n) + 0.5];
              const cover = rects.find((r) => inside(r, k.cell, n));
              const done = !!cover;
              // a hidden letter shows itself once its shape is drawn: the cells are counted — here is the letter
              const val = k.letter || won ? k.value : cover ? area(cover) : 0;
              return (
                <g key={i} className={`pt-clue${done ? ' on' : ''}`}>
                  {val ? (
                    <>
                      {k.shape !== 'any' && <ShapeMark shape={k.shape} x={x - 0.3} y={y - 0.3} s={0.17} />}
                      {/* text in a 100× bigger frame: a font of 0.46px gets misplaced by the browser's rounding */}
                      <text className={`pt-letter${k.letter ? '' : ' late'}`} transform={`translate(${x} ${L.num ? y - 0.06 : y}) scale(0.01)`} dy="4" lang="he">
                        {letterOf(val)}
                      </text>
                      {L.num && (
                        <text className="pt-num" transform={`translate(${x} ${y + 0.27}) scale(0.01)`}>
                          {val}
                        </text>
                      )}
                    </>
                  ) : k.shape !== 'any' ? (
                    <ShapeMark shape={k.shape} x={x} y={y} s={0.42} />
                  ) : (
                    <>
                      <circle className="pt-blank" cx={x} cy={y} r={0.2} />
                      <text className="pt-q" transform={`translate(${x} ${y}) scale(0.01)`} dy="2">
                        ?
                      </text>
                    </>
                  )}
                </g>
              );
            })}
            {cursor !== null && !won && <rect className="pt-cursor" x={(cursor % n) + 0.03} y={Math.floor(cursor / n) + 0.03} width={0.94} height={0.94} rx={0.1} />}
          </svg>
        </div>

        {!won && (
          <p className={`zip-how${msg && bad ? ' zip-warn' : ''}`} role="status" aria-live="polite">
            {msg || (rects.length ? t('patches.howGo', { k: n * n - covered }) : t('patches.howStart'))}
          </p>
        )}

        <div className="zip-actions">
          <button className="btn" onClick={undo} disabled={!history.length || !!won}>
            ↶ {t('zip.undo')}
          </button>
          <button className="btn" onClick={restart} disabled={!rects.length || !!won}>
            {t('patches.reset')}
          </button>
          <button className="btn" onClick={hint} disabled={!!won}>
            {t('zip.hint')}
            {hints > 0 && ` · ${hints}`}
          </button>
        </div>

        {!won && mistakes >= TOO_MANY && level > 1 && (
          <p className="pt-easier" role="status">
            {t('patches.tooMany')}{' '}
            <button className="btn ghost" onClick={easier}>
              {t('patches.easier', { k: level - 1 })}
            </button>
          </p>
        )}

        {won && (
          <section className="zip-win" aria-live="polite" ref={winCard}>
            <h2>{t('patches.won')}</h2>
            <p className="zip-win-stats">
              {t('patches.stats', { time: clock(won.sec), mistakes: won.mistakes, hints: won.hints })}
              {won.record && <span className="zip-record"> · {t('zip.record')}</span>}
              <br />
              <b>
                {won.to > won.from
                  ? t('patches.up', { k: won.to, size: size(won.to) })
                  : won.to < won.from
                    ? t('patches.down', { k: won.to, size: size(won.to) })
                    : won.from === MAX_LEVEL && !won.hints && won.mistakes <= 1
                      ? t('zip.top')
                      : t('patches.same', { k: won.to })}
              </b>
            </p>
            <h3>{t('patches.counted')}</h3>
            <ul className="pt-sums">
              {[...board.clues]
                .sort((a, b) => a.value - b.value)
                .filter((k, i, all) => !i || all[i - 1].value !== k.value)
                .map((k) => {
                  const parts = lettersOf(k.value);
                  return (
                    <li key={k.value}>
                      <span className="he" lang="he">
                        {letterOf(k.value)}
                      </span>{' '}
                      = {parts.length > 1 && `${parts.map(([, v]) => v).join(' + ')} = `}
                      <b>{k.value}</b>
                      {parts.length > 1 && (
                        <small>
                          {' '}
                          ({parts.map(([ch, v]) => `${ch} ${v}`).join(', ')})
                        </small>
                      )}
                    </li>
                  );
                })}
            </ul>
            <button className="btn zip-next" onClick={() => reset(state.l, state.g)}>
              {t('patches.next')} →
            </button>
          </section>
        )}

        <section className="pt-legend" aria-label={t('patches.rulesH')}>
          <h2>{t('patches.rulesH')}</h2>
          <ul className="pt-rules">
            {(['patches.rule1', 'patches.rule2', 'patches.rule3', 'patches.rule4'] as const).map((i) => (
              <li key={i}>{t(i)}</li>
            ))}
          </ul>
          <h2>{t('patches.legend')}</h2>
          <ul>
            {(['square', 'tall', 'wide', 'any'] as Shape[]).map((s) => (
              <li key={s}>
                <svg viewBox="0 0 1 1" width="22" height="22" aria-hidden="true">
                  <ShapeMark shape={s} x={0.5} y={0.5} s={0.8} />
                </svg>
                {t(`patches.shape.${s}`)}
              </li>
            ))}
          </ul>
          <h2>{t('patches.cluesH')}</h2>
          <ul className="pt-kinds">
            <li>
              <b className="he" lang="he">
                ח
              </b>{' '}
              {t('patches.clueLetter')}
            </li>
            <li>
              <svg viewBox="0 0 1 1" width="22" height="22" aria-hidden="true">
                <ShapeMark shape="tall" x={0.5} y={0.5} s={0.8} />
              </svg>
              {t('patches.clueShape')}
            </li>
            <li>
              <svg viewBox="0 0 1 1" width="22" height="22" aria-hidden="true">
                <circle className="pt-blank" cx={0.5} cy={0.5} r={0.4} />
                <text className="pt-q" transform="translate(0.5 0.5) scale(0.02)" dy="2">
                  ?
                </text>
              </svg>
              {t('patches.clueNone')}
            </li>
          </ul>
          <p className="pt-help">{t('patches.help')}</p>
        </section>
        <details className="pt-values">
          <summary>{t('patches.values')}</summary>
          <ul dir="rtl">
            {LETTER_VALUES.map(([ch, v]) => (
              <li key={ch}>
                <span className="he" lang="he">
                  {ch}
                </span>
                <small>{v}</small>
              </li>
            ))}
          </ul>
          <p>{t('patches.valuesNote')}</p>
        </details>
        <p className="zip-progress">{t('patches.progress', { k: state.g })}</p>
      </div>
      <Colophon />
    </>
  );
}
