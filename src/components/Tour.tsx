import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { currentMode, isReader } from '../core/mode';
import { endTour, stepsFor, TOUR_EVENT, tourWaiting, type TourStep } from '../core/tour';

const visible = (el: Element | null): el is HTMLElement => {
  if (!(el instanceof HTMLElement)) return false;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden';
};
const find = (s: TourStep) => [...document.querySelectorAll(s.sel)].find(visible) ?? null;

interface Box {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * The tour of the home page (src/core/tour.ts): the page is dimmed, the control is lit, a note by it says what it is
 * for — «Далее» / «Назад» / «Пропустить», Esc closes. `home` — the home page is open (the tour never runs elsewhere).
 */
export function Tour({ home }: { home: boolean }) {
  const { t } = useI18n();
  const [steps, setSteps] = useState<TourStep[] | null>(null);
  const [i, setI] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; arrow: number; above: boolean } | null>(null);
  const note = useRef<HTMLDivElement>(null);

  // start: the flag is set (the onboarding just ended, or «Показать подсказки») and the home page has drawn its controls
  useEffect(() => {
    if (!home || isReader()) return setSteps(null);
    let timer = 0;
    const tryStart = (left = 20) => {
      if (!tourWaiting()) return;
      const all = stepsFor(currentMode());
      const found = all.filter(find);
      // the tiles of the home page come with its code: wait a little for them
      if (found.length < Math.min(all.length, 4) && left > 0) return void (timer = window.setTimeout(() => tryStart(left - 1), 250));
      if (!found.length) return;
      setI(0);
      setSteps(found);
    };
    tryStart();
    const on = () => tryStart();
    window.addEventListener(TOUR_EVENT, on);
    return () => (window.removeEventListener(TOUR_EVENT, on), clearTimeout(timer));
  }, [home]);

  const close = useCallback(() => {
    endTour();
    setSteps(null);
    setBox(null);
    setPos(null);
  }, []);
  const step = steps?.[i];

  // where the control is now (the page may scroll or turn)
  const place = useCallback(() => {
    if (!step) return;
    const el = find(step);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 6;
    setBox({ top: r.top - pad, left: r.left - pad, width: r.width + 2 * pad, height: r.height + 2 * pad });
  }, [step]);
  useLayoutEffect(() => {
    if (!step) return;
    const el = find(step);
    if (!el) return void (i < steps!.length - 1 ? setI(i + 1) : close());
    const r = el.getBoundingClientRect();
    if (r.top < 60 || r.bottom > innerHeight - 60) el.scrollIntoView({ block: 'center' });
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => (window.removeEventListener('resize', place), window.removeEventListener('scroll', place, true));
  }, [step, place, i, steps, close]);

  // the note: under the control, or above it when there is no room; never off the screen
  useLayoutEffect(() => {
    const n = note.current;
    if (!n || !box) return;
    const [w, h, gap, edge] = [n.offsetWidth, n.offsetHeight, 12, 10];
    const below = box.top + box.height + gap;
    const above = below + h > innerHeight - edge && box.top - gap - h > edge;
    const top = above ? box.top - gap - h : Math.min(below, Math.max(edge, innerHeight - edge - h));
    const centre = box.left + box.width / 2;
    const left = Math.max(edge, Math.min(innerWidth - edge - w, centre - w / 2));
    setPos({ top, left, above, arrow: Math.max(18, Math.min(w - 18, centre - left)) });
  }, [box, i]);

  useEffect(() => {
    if (!step) return;
    note.current?.querySelector<HTMLButtonElement>('.tour-next')?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const fwd = (e.key === 'ArrowRight') !== (document.documentElement.dir === 'rtl');
        setI((k) => Math.max(0, Math.min(steps!.length - 1, k + (fwd ? 1 : -1))));
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [step, steps, close]);

  if (!steps || !step || !box) return null;
  const last = i === steps.length - 1;
  return (
    <div className="tour no-print">
      {/* nothing under the tour is pressed by chance */}
      <div className="tour-veil" onClick={(e) => e.stopPropagation()} />
      <div className="tour-spot" style={{ top: box.top, left: box.left, width: box.width, height: box.height }} />
      <div
        ref={note}
        className={`tour-note${pos?.above ? ' above' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-h"
        aria-describedby="tour-b"
        style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, visibility: pos ? 'visible' : 'hidden', ['--tour-arrow' as string]: `${pos?.arrow ?? 0}px` }}
      >
        <button className="tour-x" onClick={close} aria-label={t('tour.skip')} title={t('tour.skip')}>
          ×
        </button>
        <b id="tour-h">{t(`tour.${step.id}.t` as MessageKey)}</b>
        <p id="tour-b">{t(`tour.${step.id}.b` as MessageKey)}</p>
        <div className="tour-row">
          <span className="tour-n" aria-label={t('tour.of', { n: i + 1, of: steps.length })}>
            {steps.map((s, k) => (
              <i key={s.id} className={k === i ? 'on' : ''} />
            ))}
          </span>
          {i > 0 && (
            <button className="btn ghost" onClick={() => setI(i - 1)}>
              {t('tour.back')}
            </button>
          )}
          <button className="btn tour-next" onClick={() => (last ? close() : setI(i + 1))}>
            {t(last ? 'tour.done' : 'tour.next')}
          </button>
        </div>
      </div>
    </div>
  );
}
