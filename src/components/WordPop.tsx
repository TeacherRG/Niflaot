import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { boxOf, KNOWN_BOX, loadDict, loadLex, markKnown, markLearn, unmark, useWordStore, type Dict, type WordLang } from '../core/words';
import { readHebrew } from '../core/translit';
import { atlasEntity, atlasName, loadAtlasTexts, osmLink, placeSure, useAtlasVersion, type AtlasTexts } from '../core/atlas';
import { AtlasMap } from './AtlasMap';
import { Family } from './TanakhAtlas';

/**
 * A verse in Hebrew with every word a target: hovering it (with a mouse) or tapping it (on a phone) opens WordPop — how the
 * word is read, its parts (the prefixes ו ה ב ל מ כ ש, the dictionary form, the ending «his», «our»…), the translation and
 * the root. `parse` — the words of the verse as scripts/fetch-words.py parsed them (Open Scriptures Hebrew Bible):
 * «prefixes|number|ending» for each word of our text, split at spaces and maqaf; 0 — the word didn't match.
 * `atlas` — who or what the word names ({word number: id}, public/tanakh/atlas/<date>.json): the window shows its note.
 */
export function HeVerse({ text, parse, atlas, beacon }: { text: string; parse?: (string | 0)[]; atlas?: Record<string, string>; beacon?: Beacon }) {
  const parts = text.split(/([ ־]+)/);
  let w = 0;
  return (
    <>
      {parts.map((p, i) => {
        if (!p || /^[ ־]+$/.test(p)) return p;
        const n = w++;
        const code = parse?.[n];
        // the sof pasuq stays outside the word
        const m = p.match(/^(.*?)(׃?)$/)!;
        // «Ключевое место»: the words of the phrase are underlined, the beacon stands before the first of them
        const key = beacon && n >= beacon.range[0] && n <= beacon.range[1];
        return (
          <span key={i}>
            {key && n === beacon.range[0] && <BeaconButton k={beacon.k} label={beacon.label} />}
            <span className={key ? 'tk-hw tk-key' : 'tk-hw'} data-c={code || ''} data-a={atlas?.[n] ?? ''} data-k={key ? beacon.k : undefined}>
              {m[1]}
            </span>
            {m[2]}
          </span>
        );
      })}
    </>
  );
}

/** the beacon of a key phrase (src/core/atlasKeys.ts): the verse, where its words are, the button's label */
export interface Beacon {
  k: string;
  range: [number, number];
  label: string;
}
/** a pulsing gold light; KeyPop listens to the page for `.tk-beacon` */
export const BeaconButton = ({ k, label }: { k: string; label: string }) => (
  <button type="button" className="tk-beacon no-print" data-k={k} aria-label={label} title={label}>
    <span aria-hidden="true" />
  </button>
);

const PREFIX_HE: Record<string, string> = { b: 'ב', c: 'ו', d: 'ה', i: 'ה', k: 'כ', l: 'ל', m: 'מ', s: 'ש' };

interface Open {
  word: string;
  code: string;
  /** the person or place the word names (scripts/fetch-atlas.py), or '' */
  atlas: string;
  /** where the word is on the page (document coordinates) */
  x: number;
  top: number;
  bottom: number;
  /** opened by a tap / click: stays until a tap elsewhere; by hover — closes when the mouse leaves */
  pinned: boolean;
}

/**
 * The window over a word of a verse (one per page): listens to the page for `.tk-hw` words (HeVerse). With a mouse — opens on
 * hover and closes when the mouse leaves the word and the window; a tap or a click pins it until a tap elsewhere or Esc.
 */
export function WordPop() {
  const { t, locale } = useI18n();
  const lang: WordLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const [open, setOpen] = useState<Open | null>(null);
  const [dict, setDict] = useState<Dict | null>(null);
  const [lex, setLex] = useState<Record<string, string> | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const leave = useRef<number>(0);
  const store = useWordStore();
  const [atx, setAtx] = useState<AtlasTexts | null>(null);
  useAtlasVersion();

  useEffect(() => {
    let live = true;
    loadDict(lang).then((d) => live && setDict(d));
    loadLex().then((l) => live && setLex(l));
    loadAtlasTexts(lang).then((x) => live && setAtx(x));
    return () => {
      live = false;
    };
  }, [lang]);

  const show = useCallback((el: HTMLElement, pinned: boolean) => {
    clearTimeout(leave.current);
    const r = el.getBoundingClientRect();
    setOpen({ word: el.textContent ?? '', code: el.dataset.c ?? '', atlas: el.dataset.a ?? '', x: r.left + r.width / 2 + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY, pinned });
  }, []);

  useEffect(() => {
    const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const word = (e: Event) => (e.target as HTMLElement | null)?.closest?.('.tk-hw') as HTMLElement | null;
    const onOver = (e: MouseEvent) => {
      const el = word(e);
      if (el) show(el, false);
      else if (box.current?.contains(e.target as Node)) clearTimeout(leave.current);
    };
    const onOut = (e: MouseEvent) => {
      if (!word(e) && !box.current?.contains(e.target as Node)) return;
      leave.current = window.setTimeout(() => setOpen((o) => (o && !o.pinned ? null : o)), 250);
    };
    const onClick = (e: MouseEvent) => {
      const el = word(e);
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

  // keep the window inside the screen: above the word, or below it when there is no room above
  const [pos, setPos] = useState<CSSProperties>({ visibility: 'hidden' });
  useLayoutEffect(() => {
    if (!open || !box.current) return;
    const b = box.current.getBoundingClientRect();
    const w = b.width;
    const left = Math.max(scrollX + 8, Math.min(open.x - w / 2, scrollX + document.documentElement.clientWidth - w - 8));
    const above = open.top - scrollY > b.height + 14;
    setPos({ left, top: above ? open.top - b.height - 8 : open.bottom + 8 });
  }, [open, dict, lex, atx]);

  if (!open) return null;
  const [raw, id = '', suf = ''] = open.code.split('|');
  const ketiv = raw.startsWith('!');
  const pref = raw.replace('!', '');
  const w = dict?.words[(dict.rank.get(id) ?? 0) - 1];
  const read = readHebrew(open.word, lang);
  // a name — with a capital letter (Исраэль, Yarden)
  const reading = id === 'n' ? read.charAt(0).toUpperCase() + read.slice(1) : read;
  // `=лемма` — the dictionary form of a word outside the dictionary as the parse gives it (Dicta); a number — the dictionary's
  const own = id.startsWith('=') ? id.slice(1) : '';
  const tr = id && !own ? dict?.tr[id] : undefined;
  const head = w?.he ?? (own || (id ? lex?.[id] : undefined));
  const box_ = id ? boxOf(store, id) : 0;
  const known = box_ >= KNOWN_BOX;
  const learning = box_ > 0 && !known;
  const ae = open.atlas ? atlasEntity(open.atlas) : undefined;
  const card = ae && (
    <div className="wp-atlas">
      <p className="wp-a-head">
        <b>{atlasName(open.atlas, ae, atx, lang)}</b> <small className="ta-kind">{t(`atlas.kind.${ae.k}` as MessageKey)}</small>
      </p>
      <p className="wp-a-d">
        {atx?.[open.atlas]?.d ?? t('atlas.noText')}{' '}
        {atx?.[open.atlas]?.d && <a href={`#/atlas/${open.atlas}`}>{t('atlas.more1')} →</a>}
      </p>
      <Family e={ae} get={atlasEntity} tx={atx} lang={lang} />
      {ae.ll && (
        <>
          <div className="wp-a-map">
            <AtlasMap label={t('atlas.mapLabel')} ratio={0.45} points={[{ id: open.atlas, ll: ae.ll, a: ae.a, label: atlasName(open.atlas, ae, atx, lang) }]} />
          </div>
          <p className="ta-meta">
            {!ae.a && (
              <>
                <span className={`ta-sure s${placeSure(ae)}`}>{t(`atlas.sure.${placeSure(ae)}` as MessageKey)}</span> ·{' '}
              </>
            )}
            <a href={osmLink(ae.ll)} target="_blank" rel="noopener noreferrer">
              {t('atlas.osm')}
            </a>
          </p>
        </>
      )}
    </div>
  );
  // in <body>: the window is placed in page coordinates, not inside the column of the text
  return createPortal(
    <div ref={box} className="wp no-print" role="dialog" aria-label={open.word} style={pos}>
      <p className="wp-word">
        <span className="he" lang="he" dir="rtl">
          {open.word}
        </span>
        {/* a ketiv has no vowels — it is not read as written */}
        {/[\u05B0-\u05BB\u05C7]/.test(open.word) && <span className="wp-read">{reading}</span>}
      </p>
      {ketiv && <p className="wp-note">{t('wp.ketiv')}</p>}
      {id === 'H' ? (
        <p className="wp-tr">{t('wp.hashem')}</p>
      ) : (
        <>
          {pref && (
            <ul className="wp-parts">
              {[...pref].map((p, i) => (
                <li key={i}>
                  <span className="he" lang="he">
                    {PREFIX_HE[p]}־
                  </span>{' '}
                  {t(`wp.pre.${p}` as MessageKey)}
                </li>
              ))}
            </ul>
          )}
          {id === 'n' ? (
            card || <p className="wp-tr">{t('wp.name')}</p>
          ) : head ? (
            <div className="wp-main">
              {head !== open.word.replace(/[[\]()]/g, '') && (
                <span className="he wp-head" lang="he" dir="rtl">
                  {head}
                </span>
              )}
              {tr ? <span className="wp-tr">{tr}</span> : <span className="wp-note">{t('wp.rare')}</span>}
              {w && (
                <small className="wp-meta">
                  {w.root && (
                    <>
                      {t('words.root')}{' '}
                      <span className="he" lang="he">
                        {w.root}
                      </span>{' '}
                      ·{' '}
                    </>
                  )}
                  {w.aram && <>{t('words.aram')} · </>}
                  {t('words.rank', { n: dict!.rank.get(id)! })}
                </small>
              )}
            </div>
          ) : null}
          {id !== 'n' && card}
          {suf && (
            <p className="wp-suf">
              {t('wp.suffix')}: <b>{t(`wp.suf.${suf}` as MessageKey)}</b>
            </p>
          )}
          {tr && (
            <p className="wp-btns tk-w-btns">
              <button type="button" className="tk-w-learn" aria-pressed={learning} onClick={() => (learning ? unmark(id) : markLearn(id))}>
                {learning ? `● ${t('words.learn')}` : t('words.learn')}
              </button>
              <button type="button" className="tk-w-know" aria-pressed={known} onClick={() => (known ? unmark(id) : markKnown(id))}>
                {known ? `✓ ${t('words.know')}` : t('words.know')}
              </button>
            </p>
          )}
        </>
      )}
    </div>,
    document.body,
  );
}
