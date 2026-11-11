import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent, type KeyboardEvent } from 'react';
import { track } from '../core/analytics';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { Quote } from './Quote';
import { useMode } from '../core/mode';
import { markStudied, todayIso } from '../core/habit';
import { celebrate, feedback } from '../core/fx';
import { copyText } from '../core/format';
import { routeLink, type Ref } from '../core/site';
import { DailyReminder } from './DailyReminder';
import {
  LEVELS,
  MAX_LEVEL,
  adjacent,
  bestTime,
  canStep,
  stepBlock,
  hintLine,
  loadZip,
  makeBoard,
  pickVerse,
  reachedCount,
  recordWin,
  saveZip,
  solved,
  verseTranslation,
  zipPool,
  type Cell,
  type ZipState,
  type ZipVerse,
} from '../core/zip';

const BOOK = { ru: 'Берешит', en: 'Genesis', de: 'Bereschit' } as const;
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/**
 * `#/zip` — «Zip — стих Торы» (src/core/zip.ts): one line from 1 to the last number through every cell of the grid;
 * the numbers are the words of a verse Baal HaTurim comments on. A new verse every visit, the level follows the player.
 */
export function ZipPage() {
  const { t, locale } = useI18n();
  const adults = useMode() === 'adults';
  const pool = useMemo(zipPool, []);
  const [state, setState] = useState<ZipState>(loadZip);
  const [verse, setVerse] = useState<ZipVerse | undefined>(() => pickVerse(pool, state, todayIso()));
  // the level this board was made at (the state's level moves on after a win)
  const [level, setLevel] = useState(state.l);
  const board = useMemo(() => (verse ? makeBoard(verse, level) : null), [verse, level]);
  const [line, setLine] = useState<Cell[]>([]);
  const [hints, setHints] = useState(0);
  const [sec, setSec] = useState(0);
  const [won, setWon] = useState<{ sec: number; hints: number; from: number; to: number; record: boolean } | null>(null);
  const [copied, setCopied] = useState(false);
  // the line tried the last number before the other cells were filled — say why it stops
  const [lastWarn, setLastWarn] = useState(false);
  const svg = useRef<SVGSVGElement>(null);
  const winCard = useRef<HTMLElement>(null);
  const drag = useRef(false);

  useEffect(() => {
    document.title = `${t('zip.title')} · ${t('app.title')}`;
  }, [t]);

  // remember the verse of this visit: today it stays the same until solved
  useEffect(() => {
    if (!verse) return;
    setState((s) => {
      const next = { ...s, c: { d: todayIso(), v: verse.ref } };
      saveZip(next);
      return next;
    });
  }, [verse]);

  // the clock runs from the first step to the solution
  useEffect(() => {
    if (!line.length || won) return;
    const id = setInterval(() => setSec((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [line.length > 0, won]);

  if (!verse || !board) {
    return (
      <>
        <TopBar title={t('zip.title')} />
        <div className="wrap zip">
          <p>{t('zip.none')}</p>
        </div>
        <Colophon />
      </>
    );
  }

  const n = board.n;
  const reached = reachedCount(board, line);
  const title = `${BOOK[locale as keyof typeof BOOK] ?? BOOK.en} ${verse.ch}${locale === 'de' ? ',' : ':'}${verse.v}`;
  const solvedCount = pool.filter((z) => state.d[z.ref]).length;

  const update = (next: Cell[], used = hints) => {
    if (next.length !== line.length) setLastWarn(false);
    if (won) return;
    const before = reachedCount(board, line);
    const after = reachedCount(board, next);
    setLine(next);
    if (after > before) feedback('right', after);
    if (solved(board, next)) win(used);
  };

  const win = (used: number) => {
    const from = level;
    const best = bestTime(state, level);
    const rec = recordWin(state, verse.ref, todayIso(), sec, used);
    saveZip(rec);
    setState(rec);
    setWon({ sec, hints: used, from, to: rec.l, record: !used && best !== undefined && sec < best });
    markStudied();
    // every right finish — confetti; without hints — the grand one, two waves
    feedback(used ? 'finish' : 'perfect');
    celebrate(used ? 'big' : 'grand', adults);
  };

  /** go from the end of the line towards a cell, step by step (a fast finger skips cells) */
  const walk = (cur: Cell[], target: Cell): Cell[] => {
    let path = cur;
    for (let guard = 0; guard < 2 * n; guard++) {
      const head = path[path.length - 1];
      if (head === target) break;
      if (path.length > 1 && path[path.length - 2] === target) return path.slice(0, -1);
      const [hr, hc, tr, tc] = [Math.floor(head / n), head % n, Math.floor(target / n), target % n];
      const tries: Cell[] = [];
      const rowStep = hr === tr ? null : head + (tr > hr ? n : -n);
      const colStep = hc === tc ? null : head + (tc > hc ? 1 : -1);
      if (Math.abs(tr - hr) >= Math.abs(tc - hc)) tries.push(...[rowStep, colStep].filter((x): x is number => x !== null));
      else tries.push(...[colStep, rowStep].filter((x): x is number => x !== null));
      const step = tries.find((c) => (path.length > 1 && path[path.length - 2] === c) || canStep(board, path, c));
      if (step === undefined) {
        if (tries.some((c) => stepBlock(board, path, c) === 'last')) setLastWarn(true);
        break;
      }
      path = path.length > 1 && path[path.length - 2] === step ? path.slice(0, -1) : [...path, step];
    }
    return path;
  };

  const cellAt = (e: ReactPointerEvent): Cell | null => {
    const r = svg.current?.getBoundingClientRect();
    if (!r) return null;
    const c = Math.floor(((e.clientX - r.left) / r.width) * n);
    const w = Math.floor(((e.clientY - r.top) / r.height) * n);
    return c >= 0 && c < n && w >= 0 && w < n ? w * n + c : null;
  };

  const down = (e: ReactPointerEvent<SVGSVGElement>) => {
    const cell = cellAt(e);
    if (cell === null || won) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drag.current = true;
    if (!line.length) {
      if (cell === board.nodes[0].cell) update([cell]);
      else drag.current = false;
    } else if (line.includes(cell)) update(line.slice(0, line.indexOf(cell) + 1));
    else update(walk(line, cell));
  };

  const move = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag.current) return;
    const cell = cellAt(e);
    if (cell === null || !line.length || cell === line[line.length - 1]) return;
    const next = walk(line, cell);
    if (next !== line) update(next);
  };

  const key = (e: KeyboardEvent) => {
    const d = { ArrowUp: -n, ArrowDown: n, ArrowLeft: -1, ArrowRight: 1 }[e.key];
    if (d === undefined) return;
    e.preventDefault();
    if (!line.length) return update([board.nodes[0].cell]);
    const head = line[line.length - 1];
    const to = head + d;
    if (to < 0 || to >= n * n || !adjacent(head, to, n)) return;
    if (line.length > 1 && line[line.length - 2] === to) update(line.slice(0, -1));
    else if (canStep(board, line, to)) update([...line, to]);
    else if (stepBlock(board, line, to) === 'last') setLastWarn(true);
  };

  const restart = () => {
    setLine([]);
    setSec(0);
    setHints(0);
  };

  const hint = () => {
    if (won) return;
    setHints(hints + 1);
    update(hintLine(board, line), hints + 1);
  };

  const nextVerse = () => {
    const v = pickVerse(pool, state, todayIso());
    setWon(null);
    setLevel(state.l);
    restart();
    setVerse(v);
    window.scrollTo(0, 0);
  };

  const best = bestTime(state, level);
  const shareText = (ref: Ref) =>
    t('zip.shareText', {
      ref: title,
      level: won?.from ?? level,
      size: size(won?.from ?? level),
      time: clock(won?.sec ?? sec),
      hints: won?.hints ? t('zip.shareHints', { n: won.hints }) : t('zip.shareClean'),
      link: routeLink('zip', ref, locale),
    });
  const shareNative = async () => {
    try {
      if (navigator.share) return await navigator.share({ text: shareText('share') }), track('share');
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
    if (await copyText(shareText('copy'))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const center = (cell: Cell) => [(cell % n) + 0.5, Math.floor(cell / n) + 0.5] as const;
  const size = (lv: number) => `${LEVELS[lv - 1].n}×${LEVELS[lv - 1].n}`;

  return (
    <>
      <TopBar title={t('zip.title')} />
      <div className="wrap zip">
        <header className="tk-head">
          <h1>
            {t('zip.title')}{' '}
            <span className="he" lang="he">
              פָּסוּק
            </span>
          </h1>
          <p className="ws-lead">{t('zip.lead')}</p>
        </header>

        <div className="zip-bar">
          <span className="zip-level" title={t('zip.levelHow')}>
            {t('zip.level', { k: level, n: MAX_LEVEL })} · {size(level)}
          </span>
          <span className="zip-ref">{title}</span>
        </div>
        <div className={`zip-timer${line.length && !won ? ' run' : ''}${won ? ' done' : ''}`} role="timer" aria-label={t('zip.time')}>
          <span className="zip-clock">⏱ {clock(won ? won.sec : sec)}</span>
          {best !== undefined && <small>{t('zip.best', { time: clock(best) })}</small>}
        </div>

        <ol className="zip-verse" dir="rtl" lang="he" aria-label={t('zip.verse')}>
          {board.nodes.map((x, i) => (
            <li key={i} className={i < reached ? 'on' : i === reached ? 'next' : undefined}>
              <b>{i + 1}</b> <span className="he">{x.words.join(' ')}</span>
            </li>
          ))}
        </ol>

        <div className={`zip-board-wrap${won ? ' won' : ''}`}>
          <svg
            ref={svg}
            className={`zip-board${won ? ' done' : ''}`}
            viewBox={`0 0 ${n} ${n}`}
            role="application"
            tabIndex={0}
            aria-label={t('zip.boardLabel', { n: board.nodes.length })}
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={() => (drag.current = false)}
            onPointerCancel={() => (drag.current = false)}
            onKeyDown={key}
          >
            {Array.from({ length: n * n }, (_, c) => (
              <rect key={c} className={line.includes(c) ? 'zc on' : 'zc'} x={(c % n) + 0.04} y={Math.floor(c / n) + 0.04} width={0.92} height={0.92} rx={0.14} />
            ))}
            {line.length > 1 && <polyline className="zip-line" points={line.map((c) => center(c).join(',')).join(' ')} />}
            {line.length === 1 && <circle className="zip-dot" cx={center(line[0])[0]} cy={center(line[0])[1]} r={0.21} />}
            {board.nodes.map((x, i) => {
              const [cx, cy] = center(x.cell);
              return (
                <g key={i} className={`zip-node${i < reached ? ' on' : i === reached ? ' next' : ''}`}>
                  <circle cx={cx} cy={cy} r={0.32} />
                  <text x={cx} y={cy} dy="0.12">
                    {i + 1}
                  </text>
                </g>
              );
            })}
          </svg>
          {won && (
            <VerseAssemble
              key={verse.ref}
              board={svg.current}
              n={n}
              groups={board.nodes.map((x) => ({ cell: x.cell, text: x.words.join(' ') }))}
              onDone={() => winCard.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            />
          )}
        </div>
        {!won &&
          (lastWarn ? (
            <p className="zip-how zip-warn" role="status">
              {t('zip.lastWarn', { n: board.nodes.length, k: n * n - line.length - 1 })}
            </p>
          ) : (
            <p className="zip-how">{line.length ? t('zip.howGo', { k: n * n - line.length }) : t('zip.howStart')}</p>
          ))}

        <div className="zip-actions">
          <button className="btn" onClick={() => update(line.slice(0, -1))} disabled={!line.length || !!won}>
            ↶ {t('zip.undo')}
          </button>
          <button className="btn" onClick={restart} disabled={!line.length || !!won}>
            {t('zip.restart')}
          </button>
          <button className="btn" onClick={hint} disabled={!!won}>
            {t('zip.hint')}
            {hints > 0 && ` · ${hints}`}
          </button>
        </div>

        {won && (
          <section className="zip-win" aria-live="polite" ref={winCard}>
            <h2>{t('zip.won')}</h2>
            <p className="zip-win-ref">{title}</p>
            <p className="zip-win-he he" dir="rtl" lang="he">
              {verse.words.join(' ')}
            </p>
            <p className="zip-win-tr">{verseTranslation(verse, locale)}</p>
            <p className="zip-win-stats">
              {t('zip.stats', { time: clock(won.sec), hints: won.hints })}
              {won.record && <span className="zip-record"> · {t('zip.record')}</span>}
              <br />
              <b>
                {won.to > won.from
                  ? t('zip.up', { k: won.to, size: size(won.to) })
                  : won.to < won.from
                    ? t('zip.down', { k: won.to, size: size(won.to) })
                    : won.from === MAX_LEVEL && !won.hints
                      ? t('zip.top')
                      : t('zip.same', { k: won.to })}
              </b>
            </p>
            <button className="btn zip-next" onClick={nextVerse}>
              {t('zip.next')} →
            </button>
            <div className="share-btns zip-share">
              <button className="btn gold" onClick={shareNative}>
                {copied ? t('final.copied') : `📤 ${t('zip.share')}`}
              </button>
              <a className="btn ghost" href={`https://wa.me/?text=${encodeURIComponent(shareText('wa'))}`} target="_blank" rel="noopener">
                WhatsApp
              </a>
              <a
                className="btn ghost"
                href={`https://t.me/share/url?url=${encodeURIComponent(routeLink('zip', 'tg', locale))}&text=${encodeURIComponent(shareText('tg').replace(/\s*\S+$/, ''))}`}
                target="_blank"
                rel="noopener"
              >
                Telegram
              </a>
            </div>
            <div className="zip-remind">
              <DailyReminder compact note={t('zip.remindLead')} />
            </div>
            <h3>{t('zip.bht')}</h3>
            {verse.bht.map((id) => (
              <Quote key={id} q={{ id }} />
            ))}
            <p>
              <a href={verse.link}>{t('zip.lesson')} →</a>
            </p>
          </section>
        )}

        <p className="zip-progress">{t('zip.progress', { k: solvedCount, n: pool.length })}</p>
      </div>
      <Colophon />
    </>
  );
}

/**
 * The verse comes together (owner, 03.11.2026: «слова пасука как бы передвинулись по кругу и образовали пасук, уже без цифр»):
 * every word group starts at its numbered circle, goes round the centre of the board and lands in its place in the verse —
 * one line of Hebrew from right to left over the faded board. FLIP: the words stand in their final places, a Web Animation
 * carries each from its circle along the circle to there (one after another). «Reduce motion» — the verse at once.
 */
function VerseAssemble({ board, n, groups, onDone }: { board: SVGSVGElement | null; n: number; groups: { cell: number; text: string }[]; onDone: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [landed, setLanded] = useState(false);
  useEffect(() => {
    const el = box.current;
    const spans = el ? [...el.querySelectorAll<HTMLElement>('.zv-w')] : [];
    const still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || !board || still || typeof el.animate !== 'function') {
      setLanded(true);
      const id = setTimeout(onDone, 300);
      return () => clearTimeout(id);
    }
    // the board in the middle of the screen (on a phone its bottom may be under the tab bar); all is measured in the
    // overlay's own coordinates, so the scrolling doesn't move the flight
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const wrap = el.getBoundingClientRect();
    const b = board.getBoundingClientRect();
    // the board's content box (border 1 + padding 6) in the overlay's coordinates; a cell's centre
    const inset = 7;
    const side = (b.width - 2 * inset) / n;
    const cellAt = (c: number) => ({ x: b.left - wrap.left + inset + ((c % n) + 0.5) * side, y: b.top - wrap.top + inset + (Math.floor(c / n) + 0.5) * side });
    const C = { x: b.left - wrap.left + b.width / 2, y: b.top - wrap.top + b.height / 2 };
    const STEPS = 24;
    const DUR = 2200;
    const GAP = Math.min(140, 1100 / spans.length);
    const anims = spans.map((s, i) => {
      const r = s.getBoundingClientRect();
      const end = { x: r.left - wrap.left + r.width / 2, y: r.top - wrap.top + r.height / 2 };
      const start = cellAt(groups[i].cell);
      const a0 = Math.atan2(start.y - C.y, start.x - C.x);
      let a1 = Math.atan2(end.y - C.y, end.x - C.x);
      // one whole turn around the centre, the same way for all, then into place
      while (a1 <= a0) a1 += 2 * Math.PI;
      a1 += 2 * Math.PI;
      const r0 = Math.hypot(start.x - C.x, start.y - C.y);
      const r1 = Math.hypot(end.x - C.x, end.y - C.y);
      const ring = Math.max(r0, (b.width / 2) * 0.62);
      const frames: Keyframe[] = [];
      for (let k = 0; k <= STEPS; k++) {
        const t = k / STEPS;
        // out to the ring, round it, and in to the place
        const rad = t < 0.2 ? r0 + (ring - r0) * (t / 0.2) : t < 0.75 ? ring : ring + (r1 - ring) * ((t - 0.75) / 0.25);
        const a = a0 + (a1 - a0) * t;
        const x = C.x + rad * Math.cos(a) - end.x;
        const y = C.y + rad * Math.sin(a) - end.y;
        const scale = t < 0.15 ? 0.55 + t * 3 : 1;
        frames.push({ transform: `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) scale(${scale.toFixed(2)})`, opacity: t < 0.08 ? t / 0.08 : 1, offset: t });
      }
      frames[frames.length - 1].transform = 'translate(0px, 0px) scale(1)';
      return s.animate(frames, { duration: DUR, delay: i * GAP, easing: 'cubic-bezier(.45,.05,.3,1)', fill: 'backwards' });
    });
    const last = anims[anims.length - 1];
    let live = true;
    const finish = () => {
      if (!live) return;
      setLanded(true);
      // the whole verse stays on the screen a moment before the page goes on to the result
      setTimeout(onDone, 1600);
    };
    if (last) last.finished.then(finish, finish);
    else finish();
    return () => {
      live = false;
      anims.forEach((a) => a.cancel());
    };
  }, []);
  const words = groups.reduce((a, g) => a + g.text.split(' ').length, 0);
  return (
    <div ref={box} className={`zip-verse-fly${landed ? ' landed' : ''}${words > 16 ? ' long' : ''}`} dir="rtl" lang="he" aria-hidden="true">
      <p>
        {groups.map((g, i) => (
          <span key={i} className="zv-w he">
            {g.text}
          </span>
        ))}
      </p>
    </div>
  );
}
