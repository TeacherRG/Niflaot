import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import { useI18n } from '../i18n';
import type { PuzzleText } from '../lessons/types';
import { HebrewRuns } from './Hebrew';

/** Bright piece colours, all readable with white text. Assigned by tray position, so colour never hints the order. */
const COLORS = ['#C2410C', '#1D4ED8', '#047857', '#7C3AED', '#BE185D', '#0E7490'];

/** Stable shuffle of 0..n-1 that is never the solved order. */
function trayOrder(n: number, seed: string) {
  let x = [...seed].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 233280, 7);
  const a = [...Array(n).keys()];
  do {
    for (let j = n - 1; j > 0; j--) {
      x = (x * 9301 + 49297) % 233280;
      const r = Math.floor((x / 233280) * (j + 1));
      [a[j], a[r]] = [a[r], a[j]];
    }
  } while (n > 1 && a.every((v, i) => v === i));
  return a;
}

function Piece({ text, color, className = '' }: { text: string; color: string; className?: string }) {
  return (
    <span className={`pz-piece ${className}`} style={{ ['--c' as string]: color }}>
      <span className="pz-body">
        {/* one flex child, so the spaces around Hebrew runs are kept */}
        <span>
          <HebrewRuns text={text} />
        </span>
      </span>
    </span>
  );
}

function TrayPiece({ i, text, color, selected, wrong, glow, onPick }: {
  i: number;
  text: string;
  color: string;
  selected: boolean;
  wrong: boolean;
  glow: boolean;
  onPick: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: `p${i}` });
  return (
    <button
      ref={setNodeRef}
      type="button"
      className={`pz-drag${selected ? ' sel' : ''}${wrong ? ' wrong' : ''}${glow ? ' glow' : ''}${isDragging ? ' lifting' : ''}`}
      onClick={onPick}
      {...listeners}
      {...attributes}
      aria-pressed={selected}
    >
      <Piece text={text} color={color} />
    </button>
  );
}

function Slot({ k, label, filled, armed, onDrop, children }: {
  k: number;
  label: string;
  filled: boolean;
  armed: boolean;
  onDrop: () => void;
  children?: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `s${k}`, disabled: filled });
  return (
    <div ref={setNodeRef} className={`pz-slot${filled ? ' filled' : ''}${isOver ? ' over' : ''}`}>
      {filled ? (
        children
      ) : (
        <button type="button" className={`pz-hole${armed ? ' armed' : ''}`} aria-label={label} onClick={onDrop}>
          <span className="pz-n">{k + 1}</span>
        </button>
      )}
    </div>
  );
}

/**
 * «Собери смысл»: key terms are jigsaw pieces; the player puts them in the order the lesson gives.
 * A piece locks only in its own place; a wrong place shakes it back. Drag (mouse / touch) or tap a piece, then a place.
 */
export function Puzzle({ id, puzzle, placed, onPlace, title }: {
  /** stable id: seeds the tray order */
  id: string;
  puzzle: PuzzleText;
  /** indices of pieces already in place */
  placed: number[];
  onPlace: (i: number) => void;
  title?: string;
}) {
  const { t } = useI18n();
  const n = puzzle.pieces.length;
  const tray = useMemo(() => trayOrder(n, id), [n, id]);
  const color = (i: number) => COLORS[tray.indexOf(i) % COLORS.length];
  const [sel, setSel] = useState<number | null>(null);
  const [drag, setDrag] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [misses, setMisses] = useState(0);
  const [glow, setGlow] = useState(false);
  const done = placed.length >= n;
  const next = [...Array(n).keys()].find((i) => !placed.includes(i));
  const board = useRef<HTMLDivElement>(null);
  const wasDone = useRef(done);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 140, tolerance: 8 } }),
  );

  // celebrate only when the chain is completed now, not when an already solved puzzle is opened
  useEffect(() => {
    if (done && !wasDone.current && board.current) {
      const r = board.current.getBoundingClientRect();
      confetti({
        particleCount: 110,
        spread: 80,
        startVelocity: 38,
        origin: { x: (r.left + r.width / 2) / innerWidth, y: Math.min(0.9, (r.top + r.height / 2) / innerHeight) },
        colors: [...COLORS, '#D8B565'],
        disableForReducedMotion: true,
      });
    }
    wasDone.current = done;
  }, [done]);

  useEffect(() => {
    if (wrong === null) return;
    const h = setTimeout(() => setWrong(null), 650);
    return () => clearTimeout(h);
  }, [wrong]);

  const tryPlace = (piece: number, slot: number) => {
    setSel(null);
    setGlow(false);
    if (piece === slot) onPlace(piece);
    else {
      setWrong(piece);
      setMisses((m) => m + 1);
    }
  };

  const onDragStart = (e: DragStartEvent) => setDrag(Number(String(e.active.id).slice(1)));
  const onDragEnd = (e: DragEndEvent) => {
    setDrag(null);
    if (!e.over) return;
    tryPlace(Number(String(e.active.id).slice(1)), Number(String(e.over.id).slice(1)));
  };

  return (
    <section className={`puzzle${done ? ' done' : ''}`} aria-label={title ?? t('puzzle.title')}>
      <div className="pz-lbl">
        {title ?? t('puzzle.title')} <span>{t('puzzle.sub')}</span>
      </div>
      <p className="pz-q">
        <HebrewRuns text={puzzle.q} />
      </p>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragCancel={() => setDrag(null)}>
        <div className="pz-board" ref={board}>
          {[...Array(n).keys()].map((k) => (
            <Slot
              key={k}
              k={k}
              label={t('puzzle.slot', { n: k + 1 })}
              filled={placed.includes(k)}
              armed={sel !== null}
              onDrop={() => sel !== null && tryPlace(sel, k)}
            >
              <Piece text={puzzle.pieces[k]} color={color(k)} className="locked" />
            </Slot>
          ))}
        </div>
        {!done && (
          <>
            <div className="pz-tray" aria-label={t('puzzle.tray')}>
              {tray
                .filter((i) => !placed.includes(i))
                .map((i) => (
                  <TrayPiece
                    key={i}
                    i={i}
                    text={puzzle.pieces[i]}
                    color={color(i)}
                    selected={sel === i}
                    wrong={wrong === i}
                    glow={glow && next === i}
                    onPick={() => setSel((s) => (s === i ? null : i))}
                  />
                ))}
            </div>
            <DragOverlay dropAnimation={null}>
              {drag !== null && <Piece text={puzzle.pieces[drag]} color={color(drag)} className="flying" />}
            </DragOverlay>
            <div className="pz-foot" aria-live="polite">
              {wrong !== null || misses > 0 ? (
                <span className={`pz-fb${wrong !== null ? ' no' : ''}`}>{t(wrong !== null ? 'puzzle.wrong' : 'puzzle.help')}</span>
              ) : (
                <span className="pz-fb">{t('puzzle.help')}</span>
              )}
              {misses >= 2 && (
                <button type="button" className="btn ghost" onClick={() => setGlow(true)}>
                  {t('puzzle.hint', { n: (next ?? 0) + 1 })}
                </button>
              )}
            </div>
          </>
        )}
      </DndContext>
      {done && (
        <div className="pz-meaning pop">
          <div className="pz-meaning-lbl">{t('puzzle.done')}</div>
          <p>
            <HebrewRuns text={puzzle.meaning} />
          </p>
        </div>
      )}
    </section>
  );
}
