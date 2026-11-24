import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useI18n, uiLang } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { AddCourse } from './AddCourse';
import { Icon } from './ui';
import { civilDate, jewishDate } from '../core/hebrewDate';
import { localToday } from '../core/tanakh';
import { readHebrew, type ReadLang } from '../core/translit';
import { setOtherPage } from '../core/assistant';
import { HalachaButtons } from './HalachaWordsPage';
import { boxOf, KNOWN_BOX, markKnown, markLearn, unmark, useWordStore } from '../core/words';
import {
  addDays,
  chapterOn,
  heNum,
  loadDict,
  loadSlides,
  loadText,
  slideSrc,
  useRambamDone,
  wordKey,
  type RambamDay,
  type RambamDict,
  type RambamText,
  type Slide,
} from '../core/rambam';

const weekday = (iso: string, locale: string) => {
  const w = new Intl.DateTimeFormat(uiLang(locale), { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
  return w.charAt(0).toUpperCase() + w.slice(1);
};
const shortDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(uiLang(locale), { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
const readLang = (l: string): ReadLang => (l === 'en' || l === 'de' ? l : 'ru');
/** «Маахалот асурот, глава 13» — the part's Russian name before « — » */
const partName = (d: RambamDay, locale: string) => (locale === 'ru' && d.book.ru ? d.book.ru.split(' — ')[0] : d.book.en);

/**
 * `#/rambam[/<date>]` — «Мишне Тора — глава в день» (src/core/rambam.ts): the chapter of the day of the one-chapter cycle.
 * Two halves side by side (a phone turned sideways, a computer): the slides of the explanation on the left, the text
 * of the Rambam in Hebrew on the right; on a phone held upright — the slide above the text. Turning a slide lights its
 * halachot and scrolls to them; a tap on a halacha's number opens its slide. A tap on a word — how it is read and the
 * project's translation (WordPop-like, RambamWord); the English of E. Touger by a switch.
 */
export function RambamPage({ date: asked }: { date?: string }) {
  const { t, locale } = useI18n();
  const today = localToday();
  const date = asked ?? today;
  const day = useMemo(() => chapterOn(date), [date]);
  const [text, setText] = useState<RambamText | null | undefined>(undefined);
  const [slides, setSlides] = useState<Slide[] | null>(null);
  const [dict, setDict] = useState<RambamDict | null>(null);
  const [en, setEn] = useState(false);
  const [active, setActive] = useState(0);
  const textBox = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [done, mark] = useRambamDone();

  useEffect(() => {
    let live = true;
    setText(undefined);
    setSlides(null);
    setActive(0);
    loadText(day.id).then((x) => live && setText(x));
    loadSlides(day.id).then((x) => live && setSlides(x));
    loadDict().then((x) => live && setDict(x));
    return () => {
      live = false;
    };
  }, [day.id]);

  const name = partName(day, locale);
  useEffect(() => {
    document.title = `${name} ${day.perek} · ${t('rm.title')} · ${t('app.title')}`;
  }, [name, day.perek, t]);
  useEffect(() => {
    if (!text) return;
    setOtherPage({
      kind: 'rambam',
      context: () =>
        `Page: Rambam, Mishneh Torah, Hilchot ${day.book.en}, chapter ${day.perek} (the one-chapter-a-day cycle).\n\n` +
        text.he.map((h, i) => `${i + 1}. ${h}\n${text.en[i] ?? ''}`).join('\n\n') +
        (slides ? `\n\nThe project's slides explaining it:\n${slides.map((s) => `[${s.hl ? s.hl.join('–') : '—'}] ${s.title}: ${s.text}`).join('\n')}` : ''),
    });
    return () => setOtherPage(null);
  }, [text, slides, day]);

  // the halachot of the slide in view; the two halves follow each other both ways — turning a slide scrolls the text to its
  // halachot, scrolling the text turns the slide; the side that moved first leads for a moment (no ping-pong)
  const lit = slides?.[active]?.hl ?? null;
  const lead = useRef<{ by: 'text' | 'slide'; until: number }>({ by: 'slide', until: 0 });
  const aside = useRef<HTMLElement>(null);
  const led = (by: 'text' | 'slide') => lead.current.by === by && Date.now() < lead.current.until;
  /** the text scrolls in its own column (side by side) or with the page (a phone upright, the slide stuck above) */
  const ownColumn = () => {
    const box = textBox.current;
    return !!box && box.scrollHeight > box.clientHeight + 4;
  };
  useEffect(() => {
    if (!lit || led('text')) return;
    const box = textBox.current;
    const el = box?.querySelector<HTMLElement>(`[data-h="${lit[0]}"]`);
    if (!box || !el) return;
    lead.current = { by: 'slide', until: Date.now() + 900 };
    if (ownColumn()) box.scrollTo({ top: el.offsetTop - box.offsetTop - 8, behavior: 'smooth' });
    else {
      const under = aside.current?.getBoundingClientRect().bottom ?? 60;
      scrollTo({ top: scrollY + el.getBoundingClientRect().top - under - 8, behavior: 'smooth' });
    }
  }, [lit]);

  const goSlide = useCallback((k: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * k * (document.dir === 'rtl' ? -1 : 1), behavior: 'smooth' });
  }, []);
  // the slide counts once the strip has stopped: a smooth turn over several slides must not drag the text through each of them
  const settle = useRef(0);
  const onTrack = () => {
    clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const el = track.current;
      if (el) setActive(Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
    }, 120);
  };
  const slideOf = (n: number) => slides?.findIndex((s) => s.hl && n >= s.hl[0] && n <= s.hl[1]) ?? -1;
  const openHalacha = (n: number) => {
    const k = slideOf(n);
    if (k >= 0) {
      lead.current = { by: 'text', until: Date.now() + 1500 };
      goSlide(k);
    }
  };
  // scrolling the text: the first halacha at the top of the reading place — its slide, if the slide in view isn't one of its
  const activeRef = useRef(active);
  activeRef.current = active;
  useEffect(() => {
    if (!slides) return;
    const box = textBox.current;
    if (!box) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      if (led('slide')) return;
      const top = ownColumn() ? box.getBoundingClientRect().top + 24 : (aside.current?.getBoundingClientRect().bottom ?? 60) + 24;
      const first = [...box.querySelectorAll<HTMLElement>('[data-h]')].find((h) => h.getBoundingClientRect().bottom > top);
      if (!first) return;
      const n = Number(first.dataset.h);
      const cur = slides[activeRef.current]?.hl;
      if (cur && n >= cur[0] && n <= cur[1]) return;
      const k = slideOf(n);
      if (k < 0 || k === activeRef.current) return;
      lead.current = { by: 'text', until: Date.now() + 1500 };
      goSlide(k);
    };
    const on = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    box.addEventListener('scroll', on, { passive: true });
    addEventListener('scroll', on, { passive: true });
    return () => {
      box.removeEventListener('scroll', on);
      removeEventListener('scroll', on);
      cancelAnimationFrame(frame);
    };
  }, [slides, goSlide]);

  const isDone = (done[day.id] ?? 0) > 0;
  const bar = (
    <nav className="tk-dates no-print" aria-label={t('rm.nav')}>
      <a className="tk-step prev" href={`#/rambam/${addDays(date, -1)}`} aria-label={t('rm.prev')} title={t('rm.prev')}>
        <Icon name="chevron" size={20} />
        <small>{shortDate(addDays(date, -1), locale)}</small>
      </a>
      <div className="tk-date">
        <b>{date === today ? t('tanakh.today') : weekday(date, locale)}</b>
        <span>{civilDate(date, locale)}</span>
        <span className="he" lang="he">
          {jewishDate(date)}
        </span>
        {date !== today && (
          <a className="tk-to-today" href="#/rambam">
            {t('rm.toToday')}
          </a>
        )}
      </div>
      <a className="tk-step next" href={`#/rambam/${addDays(date, 1)}`} aria-label={t('rm.next')} title={t('rm.next')}>
        <Icon name="chevron" size={20} />
        <small>{shortDate(addDays(date, 1), locale)}</small>
      </a>
    </nav>
  );

  return (
    <>
      <TopBar title={t('rm.title')} />
      <div className="wrap tk rm">
        {bar}
        <header className="tk-head rm-head">
          <p className="tk-kicker">{t('rm.kicker')}</p>
          <h1>{t('rm.h1', { part: name, n: day.perek })}</h1>
          <p className="rm-he he" lang="he">
            {day.book.he ?? text?.title.he} · פרק {heNum(day.perek)}
          </p>
          <AddCourse course="rambam" />
        </header>
        {text === undefined ? (
          <p className="tk-note">{t('rm.loading')}</p>
        ) : text === null ? (
          <p className="tk-note">{t('rm.notReady')}</p>
        ) : (
          <>
            <p className="rm-rotate no-print">
              <span aria-hidden="true">⟲</span> {t('rm.rotate')}
            </p>
            <div className={slides ? 'rm-split' : 'rm-split solo'}>
              {slides && (
                <aside className="rm-slides" aria-label={t('rm.slides')} ref={aside}>
                  <div className="rm-track" ref={track} onScroll={onTrack} dir="ltr">
                    {slides.map((s, k) => (
                      <figure key={s.img} className="rm-slide">
                        <img src={slideSrc(day.id, s.img)} width={s.w} height={s.h} alt={`${s.title}. ${s.text}`} loading={k < 2 ? 'eager' : 'lazy'} decoding="async" />
                      </figure>
                    ))}
                  </div>
                  <div className="rm-ctl">
                    <button type="button" className="rm-arrow" onClick={() => goSlide(Math.max(0, active - 1))} disabled={active === 0} aria-label={t('rm.slidePrev')}>
                      ‹
                    </button>
                    <span className="rm-cap">
                      <b>
                        {active + 1} / {slides.length}
                      </b>
                      {slides[active]?.hl && (
                        <>
                          {' · '}
                          {t('rm.halachot')}{' '}
                          <bdi className="he" lang="he">
                            {heNum(slides[active].hl![0])}
                            {slides[active].hl![1] !== slides[active].hl![0] ? '–' + heNum(slides[active].hl![1]) : ''}
                          </bdi>
                        </>
                      )}
                    </span>
                    <a className="rm-full" href={slideSrc(day.id, slides[active]?.img ?? '')} target="_blank" rel="noopener" aria-label={t('rm.full')} title={t('rm.full')}>
                      ⤢
                    </a>
                    <button type="button" className="rm-arrow" onClick={() => goSlide(Math.min(slides.length - 1, active + 1))} disabled={active === slides.length - 1} aria-label={t('rm.slideNext')}>
                      ›
                    </button>
                  </div>
                </aside>
              )}
              <section className="rm-text" ref={textBox}>
                <div className="rm-tools no-print">
                  <label>
                    <input type="checkbox" checked={en} onChange={(e) => setEn(e.target.checked)} /> {t('rm.showEn')}
                  </label>
                  <span className="rm-tap">{t('rm.tapHint')}</span>
                </div>
                {text.he.map((h, i) => {
                  const n = i + 1;
                  const on = lit && n >= lit[0] && n <= lit[1];
                  return (
                    <div key={i} className={on ? 'rm-h on' : 'rm-h'} data-h={n}>
                      <p className="he" lang="he" dir="rtl">
                        <button type="button" className="rm-n" onClick={() => openHalacha(n)} aria-label={t('rm.halachaN', { n })}>
                          {heNum(n)}
                        </button>{' '}
                        <Words text={h} />
                      </p>
                      {en && text.en[i] && (
                        <p className="rm-en" lang="en" dir="ltr">
                          {text.en[i]}
                        </p>
                      )}
                    </div>
                  );
                })}
                <p className="rm-credit">{t('rm.credit')}</p>
                <label className="tk-done rm-done">
                  <input type="checkbox" checked={isDone} onChange={(e) => mark(day.id, e.target.checked)} />
                  <span>{t('rm.done')}</span>
                </label>
              </section>
            </div>
          </>
        )}
        <nav className="tk-pager no-print" aria-label={t('rm.nav')}>
          <a className="prev" href={`#/rambam/${addDays(date, -1)}`}>
            <small>← {t('rm.prev')}</small>
            <b>{t('rm.h1', { part: partName(chapterOn(addDays(date, -1)), locale), n: chapterOn(addDays(date, -1)).perek })}</b>
            <span>{civilDate(addDays(date, -1), locale)}</span>
          </a>
          <a className="next" href={`#/rambam/${addDays(date, 1)}`}>
            <small>{t('rm.next')} →</small>
            <b>{t('rm.h1', { part: partName(chapterOn(addDays(date, 1)), locale), n: chapterOn(addDays(date, 1)).perek })}</b>
            <span>{civilDate(addDays(date, 1), locale)}</span>
          </a>
        </nav>
      </div>
      <RambamWord dict={dict} box={textBox} />
      <Colophon />
    </>
  );
}

/** the words of a halacha — each a target for RambamWord (punctuation stays outside) */
function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((p, i) => {
        if (!p.trim()) return p;
        const m = p.match(/^(.*?)([.:,;]*)$/)!;
        return (
          <span key={i}>
            <span className="rm-w">{m[1]}</span>
            {m[2]}
          </span>
        );
      })}
    </>
  );
}

/** the word is in the Tanakh dictionary: «Учу» / «Знаю» put it into «Мои слова» (as the window over a word of the Prophets) */
function TanakhButtons({ id }: { id: string }) {
  const { t } = useI18n();
  const store = useWordStore();
  const box = boxOf(store, id);
  const known = box >= KNOWN_BOX;
  const learning = box > 0 && !known;
  return (
    <>
      <p className="wp-meta">{t('rm.inTanakh')}</p>
      <p className="wp-btns tk-w-btns">
        <button type="button" className="tk-w-learn" aria-pressed={learning} onClick={() => (learning ? unmark(id) : markLearn(id))}>
          {learning ? `● ${t('words.learn')}` : t('words.learn')}
        </button>
        <button type="button" className="tk-w-know" aria-pressed={known} onClick={() => (known ? unmark(id) : markKnown(id))}>
          {known ? `✓ ${t('words.know')}` : t('words.know')}
        </button>
      </p>
    </>
  );
}

interface Open {
  word: string;
  x: number;
  top: number;
  bottom: number;
}
/** the window over a tapped word: the word, how it is read, its translation here and the dictionary form */
function RambamWord({ dict, box }: { dict: RambamDict | null; box: React.RefObject<HTMLDivElement | null> }) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState<Open | null>(null);
  const pop = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('.rm-w') as HTMLElement | null;
      if (el) {
        const r = el.getBoundingClientRect();
        setOpen({ word: el.textContent ?? '', x: r.left + r.width / 2 + scrollX, top: r.top + scrollY, bottom: r.bottom + scrollY });
      } else if (!pop.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    const close = () => setOpen(null);
    const col = box.current;
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    col?.addEventListener('scroll', close, { passive: true });
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      col?.removeEventListener('scroll', close);
    };
  }, [box]);
  const [pos, setPos] = useState<CSSProperties>({ visibility: 'hidden' });
  useLayoutEffect(() => {
    if (!open || !pop.current) return;
    const b = pop.current.getBoundingClientRect();
    const left = Math.max(scrollX + 8, Math.min(open.x - b.width / 2, scrollX + document.documentElement.clientWidth - b.width - 8));
    const above = open.top - scrollY > b.height + 14;
    setPos({ left, top: above ? open.top - b.height - 8 : open.bottom + 8 });
  }, [open, dict]);
  if (!open) return null;
  const entry = dict?.[wordKey(open.word)];
  const ru = locale === 'ru';
  return createPortal(
    <div className="wp rm-pop" ref={pop} style={pos} role="dialog" aria-label={open.word}>
      <p className="wp-word">
        <span className="he" lang="he">
          {open.word}
        </span>
        <span className="wp-read">{readHebrew(open.word, readLang(locale))}</span>
      </p>
      <div className="wp-main">
        {entry ? (
          <>
            {ru ? <p className="wp-tr">{entry[0]}</p> : <p className="wp-meta">{t('rm.onlyRu')}</p>}
            {entry[1] && (
              <p className="wp-meta">
                {t('rm.base')}{' '}
                <span className="he" lang="he">
                  {entry[1]}
                </span>
              </p>
            )}
          </>
        ) : (
          <p className="wp-meta">{dict ? t('rm.noWord') : t('rm.loading')}</p>
        )}
        {entry?.[2] &&
          (entry[2].startsWith('h:') ? (
            <>
              <p className="wp-meta">
                {t('rm.inHalacha')} <a href="#/halacha-words">{t('hw.title')} →</a>
              </p>
              <HalachaButtons id={entry[2].slice(2)} />
            </>
          ) : (
            <TanakhButtons id={entry[2]} />
          ))}
      </div>
    </div>,
    document.body,
  );
}
