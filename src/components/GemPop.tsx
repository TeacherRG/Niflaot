import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n';
import { PARSHIOT } from '../lessons';
import { hebrewParts } from '../core/facts';
import { allEqFacts, gemLine, gemThought, phraseRange, sameNumber, type EqFact } from '../core/turimGems';
import { BeaconButton } from './WordPop';

/** a verse of the day with the words of its equalities underlined and a beacon before them (src/core/turimGems.ts) */
export function GemVerse({ text, marks }: { text: string; marks: { f: EqFact; range: [number, number] }[] }) {
  const { t } = useI18n();
  const parts = text.split(/([ ־]+)/);
  let w = 0;
  return (
    <>
      {parts.map((p, i) => {
        if (!p || /^[ ־]+$/.test(p)) return p;
        const n = w++;
        const m = marks.find((x) => n >= x.range[0] && n <= x.range[1]);
        if (!m) return p;
        return (
          <span key={i}>
            {n === m.range[0] && <BeaconButton g k={m.f.id} label={`${t('gem.title')}: ${m.f.q} = ${m.f.v}`} />}
            <span className="tk-key" data-g={m.f.id}>
              {p}
            </span>
          </span>
        );
      })}
    </>
  );
}

/** the verse's equalities: which stand in the verse (their words) — the rest go to the row over the commentator's words */
export function placeGems(verse: string | null, facts: EqFact[]) {
  const marks: { f: EqFact; range: [number, number] }[] = [];
  const rest: EqFact[] = [];
  for (const f of facts) {
    const r = verse ? phraseRange(verse, f.q.split(' + ')[0]) : null;
    // overlapping words («סלם» inside «והנה סלם») — the second one to the row
    if (r && !marks.some((m) => r[0] <= m.range[1] && m.range[0] <= r[1])) marks.push({ f, range: r });
    else rest.push(f);
  }
  return { marks, rest };
}

/** the beacons of equalities that are not in the verse: in a row over the commentator's words */
export function GemRow({ facts }: { facts: EqFact[] }) {
  const { t } = useI18n();
  if (!facts.length) return null;
  return (
    <p className="gp-row no-print">
      {facts.map((f) => (
        <span key={f.id} className="gp-chip">
          <BeaconButton g k={f.id} label={`${t('gem.title')}: ${f.q} = ${f.v}`} />
          <span className="he tk-key" lang="he" data-g={f.id}>
            {f.q.split(' + ')[0]}
          </span>
        </span>
      ))}
    </p>
  );
}

interface Open {
  id: string;
  x: number;
  top: number;
  bottom: number;
  pinned: boolean;
}

/**
 * The window over a gematria beacon `.tk-beacon[data-g]` (one per page, like KeyPop in the Prophets): the equality with its
 * words translated, the thought behind it in one sentence, and the same number in the other lessons — each with its thought.
 */
export function GemPop() {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState<Open | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const leave = useRef<number>(0);

  const show = useCallback((el: HTMLElement, pinned: boolean) => {
    clearTimeout(leave.current);
    const r = el.getBoundingClientRect();
    setOpen({ id: el.dataset.g ?? '', x: r.left + r.width / 2 + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY, pinned });
  }, []);

  useEffect(() => {
    const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const beacon = (e: Event) => (e.target as HTMLElement | null)?.closest?.('.tk-beacon[data-g], .tk-key[data-g]') as HTMLElement | null;
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

  const f = open && allEqFacts().find((x) => x.id === open.id);
  if (!open || !f) return null;
  const text = (x: EqFact) => x.lesson.texts[locale] ?? x.lesson.texts.ru;
  const thought = gemThought(f, text(f));
  const gloss = hebrewParts(f)
    .map((w) => [w, text(f)?.glossary[w]] as const)
    .filter(([, g]) => g);
  const others = sameNumber(f).slice(0, 5);
  const parsha = (x: EqFact) => {
    const p = PARSHIOT[x.lesson.parsha];
    return p ? ((p.name as Record<string, string>)[locale] ?? p.name.ru) : '';
  };

  return createPortal(
    <div ref={box} className="wp kp gp no-print" role="dialog" aria-label={t('gem.title')} style={pos}>
      <p className="kp-eyebrow">
        <span className="kp-dot" aria-hidden="true" /> {t('gem.title')}
      </p>
      <p className="kp-phrase he" lang="he" dir="rtl">
        {gemLine(f)}
      </p>
      {gloss.length > 0 && (
        <ul className="gp-gloss">
          {gloss.map(([w, g]) => (
            <li key={w}>
              <span className="he" lang="he">
                {w}
              </span>{' '}
              — {g}
            </li>
          ))}
        </ul>
      )}
      {thought && (
        <p className="gp-thought">
          <b>{t('gem.thought')}</b> {thought}
        </p>
      )}
      {others.length > 0 && (
        <div className="gp-same">
          <p className="gp-same-h">{t('gem.same', { n: f.v })}</p>
          <ul>
            {others.map((o) => (
              <li key={o.id}>
                <a href={`#/facts/${o.id}`}>
                  <span className="he" lang="he" dir="rtl">
                    {gemLine(o)}
                  </span>
                </a>{' '}
                <small className="gp-parsha">· {parsha(o)}</small>
                {gemThought(o, text(o)) && <span className="gp-o-thought">{gemThought(o, text(o))}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="kp-more">
        <a href={`#/facts/${f.id}`}>{t('gem.more')} →</a>
      </p>
    </div>,
    document.body,
  );
}
