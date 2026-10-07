import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type Panel = 'menu' | 'help' | 'about' | 'assistant' | null;

export const UIContext = createContext<{ panel: Panel; open: (p: Panel) => void; lessonSlug?: string }>({
  panel: null,
  open: () => {},
});
export const useUI = () => useContext(UIContext);

/** Inline icons (stroke = currentColor). */
const PATHS = {
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  globe:
    'M12 3a9 9 0 100 18 9 9 0 000-18zM3.6 9h16.8M3.6 15h16.8M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z',
  chevron: 'M6 9l6 6 6-6',
  check: 'M5 12l5 5 9-10',
  book: 'M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5v-15zM4 20.5A2.5 2.5 0 016.5 18H20v3H6.5',
  help: 'M12 21a9 9 0 100-18 9 9 0 000 18zM9.5 9.3a2.6 2.6 0 015 .9c0 1.7-2.5 2.3-2.5 3.8M12 17.2v.1',
  info: 'M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v6M12 7.5v.1',
  heart: 'M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z',
  mail: 'M3 6h18v12H3zM3 6l9 7 9-7',
  calc: 'M6 3h12a1 1 0 011 1v16a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1zM8 7h8M8 12h2M14 12h2M8 16h2M14 16h2',
  image: 'M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M15.5 9.5a1.5 1.5 0 100-.01',
  spark: 'M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z',
  print: 'M7 8V3h10v5M7 17H5a2 2 0 01-2-2v-5a2 2 0 012-2h14a2 2 0 012 2v5a2 2 0 01-2 2h-2M7 14h10v7H7z',
} as const;

export function Icon({ name, size = 20 }: { name: keyof typeof PATHS; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

/** Calls `fn` on Escape and on pointer-down outside `ref` while `active`. */
export function useDismiss(active: boolean, ref: React.RefObject<HTMLElement | null>, fn: () => void, outside = true) {
  useEffect(() => {
    if (!active) return;
    const key = (e: KeyboardEvent) => e.key === 'Escape' && fn();
    const down = (e: PointerEvent) => outside && ref.current && !ref.current.contains(e.target as Node) && fn();
    addEventListener('keydown', key);
    addEventListener('pointerdown', down);
    return () => {
      removeEventListener('keydown', key);
      removeEventListener('pointerdown', down);
    };
  }, [active, ref, fn, outside]);
}

/**
 * Modal surface. `variant="drawer"` slides in from the inline-start edge (the menu),
 * `variant="dialog"` is a centred card that becomes a bottom sheet on phones.
 */
export function Sheet({
  open,
  onClose,
  title,
  closeLabel,
  variant = 'dialog',
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  variant?: 'drawer' | 'dialog';
  children: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const restore = useRef<Element | null>(null);
  useDismiss(open, box, onClose, false);

  useEffect(() => {
    if (!open) return;
    restore.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    box.current?.querySelector<HTMLElement>('[data-autofocus],button,a')?.focus();
    return () => {
      document.body.style.overflow = prev;
      (restore.current as HTMLElement | null)?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className={`overlay overlay-${variant}`} onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={box} className={`sheet sheet-${variant}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={closeLabel}>
            <Icon name="close" />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

/** Small floating heart in the bottom-right corner linking to the donation page. */
export function DonateFab({ label }: { label: string }) {
  return (
    <a className="donate-fab" href="https://mychitas.app/donate" target="_blank" rel="noopener" aria-label={label} title={label}>
      <Icon name="heart" size={20} />
    </a>
  );
}
