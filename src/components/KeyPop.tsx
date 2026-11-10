import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n';
import { atlasName, bce, loadAtlasAll, loadAtlasTexts, loadTimeline, type AtlasAll, type AtlasLang, type AtlasTexts, type Timeline } from '../core/atlas';
import { loadAtlasKeys, type AtlasKeys } from '../core/atlasKeys';
import { AtlasMap } from './AtlasMap';

interface Open {
  k: string;
  /** the words of the phrase as they stand in the verse (with vowels), '' — Hebrew isn't shown */
  phrase: string;
  x: number;
  top: number;
  bottom: number;
  pinned: boolean;
}

/**
 * «Ключевое место» (src/core/atlasKeys.ts): the window over a beacon `.tk-beacon` (one per page, like WordPop) —
 * שָׁנָה time — when (the year from Creation, the era of the timeline, the day), נֶפֶשׁ soul — who and עוֹלָם space — where (notes of «Кто и где»,
 * the map), and how the verse ties them together. With a mouse — opens on hover; a tap pins it until a tap elsewhere or Esc.
 */
export function KeyPop() {
  const { t, locale } = useI18n();
  const lang: AtlasLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const [open, setOpen] = useState<Open | null>(null);
  const [keys, setKeys] = useState<AtlasKeys | null>(null);
  const [all, setAll] = useState<AtlasAll | null>(null);
  const [tx, setTx] = useState<AtlasTexts | null>(null);
  const [tl, setTl] = useState<Timeline | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const leave = useRef<number>(0);
  const asked = useRef(false);

  // the notes, the entities and the timeline load only when a beacon is opened for the first time
  useEffect(() => {
    if (!open || asked.current) return;
    asked.current = true;
    loadAtlasKeys().then(setKeys);
    loadAtlasAll().then(setAll);
    loadTimeline().then(setTl);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    let live = true;
    loadAtlasTexts(lang).then((x) => live && setTx(x));
    return () => {
      live = false;
    };
  }, [lang, open]);

  const show = useCallback((el: HTMLElement, pinned: boolean) => {
    clearTimeout(leave.current);
    const k = el.dataset.k ?? '';
    const r = el.getBoundingClientRect();
    const phrase = [...document.querySelectorAll<HTMLElement>(`.tk-key[data-k="${CSS.escape(k)}"]`)].map((w) => w.textContent).join(' ');
    setOpen({ k, phrase, x: r.left + r.width / 2 + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY, pinned });
  }, []);

  useEffect(() => {
    const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const beacon = (e: Event) => (e.target as HTMLElement | null)?.closest?.('.tk-beacon') as HTMLElement | null;
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
  }, [open, keys, all, tx, tl]);

  if (!open) return null;
  const key = keys?.[open.k];
  const name = (id: string) => atlasName(id, all?.e[id], tx, lang);
  const link = (id: string) =>
    tx?.[id]?.d ? (
      <a key={id} href={`#/atlas/${id}`}>
        {name(id)}
      </a>
    ) : (
      <span key={id}>{name(id)}</span>
    );
  const list = (ids: string[]) => ids.flatMap((id, i) => (i ? [', ', link(id)] : [link(id)]));
  const era = key && tl?.eras.find((e) => key.y >= e.from && key.y < e.to);
  const points = key?.where.flatMap((id) => {
    const e = all?.e[id];
    return e?.ll ? [{ id, ll: e.ll, a: e.a, label: name(id) }] : [];
  });

  return createPortal(
    <div ref={box} className="wp kp no-print" role="dialog" aria-label={t('keys.title')} style={pos}>
      <p className="kp-eyebrow">
        <span className="kp-dot" aria-hidden="true" /> {t('keys.title')}
      </p>
      {open.phrase && (
        <p className="kp-phrase he" lang="he" dir="rtl">
          {open.phrase}
        </p>
      )}
      {!key ? (
        <p className="wp-note">{t('keys.loading')}</p>
      ) : (
        <>
          <p className="kp-t">{key.t[lang]}</p>
          <dl className="kp-rows">
            <div className="kp-row kp-shana">
              <dt>
                <span className="he" lang="he">
                  שָׁנָה
                </span>{' '}
                {t('keys.when')}
              </dt>
              <dd>
                {key.when && <b>{key.when[lang]} · </b>}
                {key.y2 ? t('atlas.years', { a: key.y, b: key.y2 }) : key.y} {t('keys.am')} <small>({t('atlas.bce', { n: bce(key.y) })})</small>
                {era && <span className="kp-era"> · {era.t[lang]}</span>}
              </dd>
            </div>
            {key.who.length > 0 && (
              <div className="kp-row kp-nefesh">
                <dt>
                  <span className="he" lang="he">
                    נֶפֶשׁ
                  </span>{' '}
                  {t('keys.who')}
                </dt>
                <dd>{list(key.who)}</dd>
              </div>
            )}
            {key.where.length > 0 && (
              <div className="kp-row kp-olam">
                <dt>
                  <span className="he" lang="he">
                    עוֹלָם
                  </span>{' '}
                  {t('keys.where')}
                </dt>
                <dd>{list(key.where)}</dd>
              </div>
            )}
          </dl>
          {points && points.length > 0 && (
            <div className="wp-a-map">
              <AtlasMap label={t('atlas.mapLabel')} ratio={0.5} points={points} />
            </div>
          )}
          <p className="kp-d">{key.d[lang]}</p>
          <p className="kp-more">
            <a href="#/atlas/timeline">{t('keys.timeline')} →</a>
          </p>
        </>
      )}
    </div>,
    document.body,
  );
}
