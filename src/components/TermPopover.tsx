import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Pop = { def: string; x: number; y: number; above: boolean };

/**
 * One popover for all glossary terms (<span class="term" data-def>): tap/click or Enter shows it,
 * hovering shows it on devices with a mouse; a tap elsewhere, Escape or scrolling closes it.
 * Rendered with position: fixed, so cards with overflow: hidden never clip it.
 */
export function TermPopover() {
  const [pop, setPop] = useState<Pop | null>(null);
  const pinned = useRef(false);

  useEffect(() => {
    const show = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      const above = r.bottom + 160 > innerHeight && r.top > 160;
      setPop({ def: el.dataset.def ?? '', x: r.left + r.width / 2, y: above ? r.top : r.bottom, above });
    };
    const hide = () => {
      pinned.current = false;
      setPop(null);
    };
    const term = (e: Event) => (e.target as HTMLElement | null)?.closest?.('.term') as HTMLElement | null;

    const onClick = (e: MouseEvent) => {
      const el = term(e);
      if (el) {
        pinned.current = true;
        show(el);
      } else hide();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return hide();
      const el = term(e);
      if (el && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        pinned.current = true;
        show(el);
      }
    };
    const hover = matchMedia('(hover: hover) and (pointer: fine)');
    const onOver = (e: MouseEvent) => {
      if (!hover.matches || pinned.current) return;
      const el = term(e);
      if (el) show(el);
    };
    const onOut = (e: MouseEvent) => {
      if (!hover.matches || pinned.current) return;
      if (term(e) && !(e.relatedTarget as HTMLElement | null)?.closest?.('.term')) setPop(null);
    };
    addEventListener('click', onClick);
    addEventListener('keydown', onKey);
    addEventListener('mouseover', onOver);
    addEventListener('mouseout', onOut);
    addEventListener('scroll', hide, { passive: true });
    addEventListener('hashchange', hide);
    return () => {
      removeEventListener('click', onClick);
      removeEventListener('keydown', onKey);
      removeEventListener('mouseover', onOver);
      removeEventListener('mouseout', onOut);
      removeEventListener('scroll', hide);
      removeEventListener('hashchange', hide);
    };
  }, []);

  if (!pop) return null;
  const width = Math.min(300, innerWidth - 24);
  const left = Math.max(12, Math.min(pop.x - width / 2, innerWidth - width - 12));
  return createPortal(
    <div
      className={`term-pop${pop.above ? ' above' : ''}`}
      role="tooltip"
      style={{ left, width, top: pop.above ? undefined : pop.y + 8, bottom: pop.above ? innerHeight - pop.y + 8 : undefined }}
    >
      {pop.def}
    </div>,
    document.body,
  );
}
