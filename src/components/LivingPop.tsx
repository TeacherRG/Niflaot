import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { livingItem, loadLivingRu, type LivingText } from '../core/living';

interface Open {
  id: string;
  /** the words of the verse as they stand on the page (Hebrew, with vowels) */
  phrase: string;
  x: number;
  top: number;
  bottom: number;
  pinned: boolean;
}

/** a pulsing gold light before the words of the verse; LivingPop listens to the page for `.tk-beacon[data-l]` */
export const LivingBeacon = ({ id, label, phrase }: { id: string; label: string; phrase: string }) => (
  <button type="button" className="tk-beacon rd-beacon no-print" data-l={id} data-p={phrase} dir="ltr" aria-label={label} title={label}>
    <span aria-hidden="true" />
  </button>
);

/**
 * «Мысль к стиху» (src/core/living.ts): the window over a beacon in Tehillim (one per page, like KeyPop in the Prophets) —
 * the words of the verse, their translation and the thought from «Living the Mizmor» (nafshi.org), with the credit and the link.
 * With a mouse — opens on hover; a tap pins it until a tap elsewhere or Esc.
 */
export function LivingPop() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState<Open | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const leave = useRef<number>(0);

  const show = useCallback((el: HTMLElement, pinned: boolean) => {
    clearTimeout(leave.current);
    const r = el.getBoundingClientRect();
    setOpen({ id: el.dataset.l ?? '', phrase: el.dataset.p ?? '', x: r.left + r.width / 2 + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY, pinned });
  }, []);

  useEffect(() => {
    const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const beacon = (e: Event) => (e.target as HTMLElement | null)?.closest?.('.tk-beacon[data-l]') as HTMLElement | null;
    const onOver = (e: MouseEvent) => {
      const el = beacon(e);
      if (el) show(el, false);
      else if (box.current?.contains(e.target as Node)) clearTimeout(leave.current);
    };
    const onOut = (e: MouseEvent) => {
      if (!beacon(e) && !box.current?.contains(e.target as Node)) return;
      leave.current = window.setTimeout(() => setOpen((o) => (o && !o.pinned ? null : o)), 250);
    };
    const onClick = (e: MouseEvent) => {
      const el = beacon(e);
      if (el) {
        e.preventDefault();
        show(el, true);
      } else if (!box.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    if (hover) {
      document.addEventListener('mouseover', onOver);
      document.addEventListener('mouseout', onOut);
    }
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      clearTimeout(leave.current);
    };
  }, [show]);

  const [pos, setPos] = useState<CSSProperties>({ visibility: 'hidden' });
  useLayoutEffect(() => {
    if (!open || !box.current) return;
    const b = box.current.getBoundingClientRect();
    const w = b.width;
    const left = Math.max(scrollX + 8, Math.min(open.x - w / 2, scrollX + document.documentElement.clientWidth - w - 8));
    const above = open.top - scrollY > b.height + 14;
    setPos({ left, top: above ? open.top - b.height - 8 : open.bottom + 8 });
  }, [open]);

  // the project's Russian translation of this chapter (Russian site only); until it loads — the English source
  const [ru, setRu] = useState<{ c: number; items: LivingText[] } | null>(null);
  const chapter = open && locale === 'ru' ? Number(open.id.split(':')[0]) : 0;
  useEffect(() => {
    if (!chapter) return;
    let alive = true;
    void loadLivingRu(chapter).then((items) => alive && items && setRu({ c: chapter, items }));
    return () => {
      alive = false;
    };
  }, [chapter]);

  const found = open && livingItem(open.id);
  if (!open || !found) return null;
  const { living, item } = found;
  const tr = ru && ru.c === chapter ? ru.items[Number(open.id.split(':')[1])] : undefined;
  const shown: LivingText = tr ?? item;
  const topic = item.topic ? t(`living.topic.${item.topic}` as MessageKey) : '';

  return createPortal(
    <div ref={box} className="wp kp lp no-print" role="dialog" aria-label={t('living.title')} style={pos}>
      <p className="kp-eyebrow">
        <span className="kp-dot" aria-hidden="true" /> {t(`living.kind.${item.kind}`)}
        {topic && <span className="lp-topic"> · {topic}</span>}
      </p>
      {open.phrase && (
        <p className="kp-phrase he" lang="he" dir="rtl">
          {open.phrase}
        </p>
      )}
      <div lang={tr ? 'ru' : 'en'} dir="ltr" className="lp-en">
        {shown.quote && <p className="lp-quote">{tr ? `«${shown.quote}»` : `“${shown.quote}”`}</p>}
        {shown.title && <p className="lp-t">{shown.title}</p>}
        {shown.text && <p className="gp-thought">{shown.text}</p>}
      </div>
      {tr ? <p className="wp-note">{t('living.translated')}</p> : locale !== 'en' && <p className="wp-note">{t('living.english')}</p>}
      <p className="kp-more">
        {t('living.from')}{' '}
        <a href={living.url} target="_blank" rel="noopener">
          Living the Mizmor · nafshi.org ↗
        </a>
      </p>
    </div>,
    document.body,
  );
}
