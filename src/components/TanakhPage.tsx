import { ListenBar } from './ListenBar';
import { tanakhLang, tanakhNarration, tanakhSlug } from '../core/tanakhNarration';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Icon, useDismiss } from './ui';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { BOOKS, rangeLabel, type Section } from '../core/tanakhCycle';
import { CYCLE, cycleDayFor, loadDay, localToday, readingMinutes, type Commentary, type DayContent, type SectionDay, type DayVerse, type Tr } from '../core/tanakh';
import { civilDate, hebrewNumber, jewishDate } from '../core/hebrewDate';
import { TanakhMasthead } from './PrintBrand';
import { TanakhWords } from './TanakhWords';
import { setOtherPage } from '../core/assistant';
import { tanakhContext } from '../core/assistantPages';
import { useDone, useDoneStore } from '../core/tanakhDone';
import { isDone } from '../core/academy';

export const SECTION_HE: Record<Section, string> = { neviim: 'נביאים', ketuvim: 'כתובים' };

/**
 * The page's one language menu: which text to show — the Hebrew and a translation, only a translation, or only the Hebrew —
 * and which commentaries to show: Metzudat David (a plain explanation of the verse) and Rashi. It applies to the verse and
 * to the commentaries. Russian and German are the project's translations (src/tanakh/ru, src/tanakh/de), ready week by
 * week; where a day has none, English stands in.
 */
type TextLang = 'he-ru' | 'he-en' | 'he-de' | 'ru' | 'en' | 'de' | 'he';
const TEXT_LANGS: TextLang[] = ['he-ru', 'he-en', 'he-de', 'ru', 'en', 'de', 'he'];
/** the project's own translations (the rest is English) */
type OwnLang = 'ru' | 'de';
const trOf = (l: TextLang): Tr | null => (l === 'he' ? null : (l.replace('he-', '') as Tr));
interface View {
  text: TextLang;
  /** Metzudat David */
  md: boolean;
  rashi: boolean;
}
const VIEW_KEY = 'niflaot:tanakh-view';
function useView(locale: string): [View, (v: View) => void] {
  const [view, set] = useState<View>(() => {
    try {
      const v = JSON.parse(localStorage.getItem(VIEW_KEY) ?? 'null');
      if (v && TEXT_LANGS.includes(v.text)) {
        // a choice saved before the commentaries (`st`, a switch of earlier explanations) becomes Metzudat David's
        const md = typeof v.md === 'boolean' ? v.md : v.st !== false;
        const rashi = v.rashi === true;
        // a choice saved before the German translation existed (no `de` mark): on the German site English becomes German, once
        if (locale === 'de' && !v.de && (v.text === 'he-en' || v.text === 'en')) return { text: v.text === 'en' ? 'de' : 'he-de', md, rashi };
        return { text: v.text, md, rashi };
      }
    } catch {}
    // by default: the Hebrew with the translation in the site's language, with Metzudat David
    return { text: locale === 'ru' ? 'he-ru' : locale === 'de' ? 'he-de' : 'he-en', md: true, rashi: false };
  });
  return [
    view,
    (v) => {
      set(v);
      try {
        localStorage.setItem(VIEW_KEY, JSON.stringify({ ...v, de: true }));
      } catch {}
    },
  ];
}

/**
 * One button for the page's languages: it shows the current choice and opens a list — the text languages and,
 * below a line, the commentaries on/off: Metzudat David, Rashi.
 */
function ViewMenu({ view, setView, soon }: { view: View; setView: (v: View) => void; soon: Record<OwnLang, boolean> }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);
  const label = (l: TextLang) => {
    const tr = trOf(l);
    return `${t(`tanakh.view.${l}`)}${tr && tr !== 'en' && soon[tr] ? ` — ${t('tanakh.ruSoon')}` : ''}`;
  };
  return (
    <div className="tk-view no-speak" ref={root}>
      <button type="button" className="lang-btn tk-view-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="globe" size={17} />
        <span>
          {t(`tanakh.view.${view.text}`)}
          {view.md && <small> · {t('tanakh.md')}</small>}
          {view.rashi && <small> · {t('tanakh.rashi')}</small>}
        </span>
        <Icon name="chevron" size={14} />
      </button>
      {open && (
        <div className="lang-list tk-view-list" role="menu" aria-label={t('tanakh.viewLabel')}>
          <div className="tk-view-head">{t('tanakh.viewLabel')}</div>
          {TEXT_LANGS.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={view.text === l}
              onClick={() => {
                setView({ ...view, text: l });
                close();
              }}
            >
              <span className="code">{l === 'he' ? 'עב' : trOf(l)!.toUpperCase()}</span>
              <span className="name">{label(l)}</span>
              {view.text === l && <Icon name="check" size={16} />}
            </button>
          ))}
          <div className="tk-view-sep" />
          <div className="tk-view-head">{t('tanakh.commLabel')}</div>
          <button type="button" role="menuitemcheckbox" aria-checked={view.md} onClick={() => setView({ ...view, md: !view.md })}>
            <span className="code">✦</span>
            <span className="name">{t('tanakh.mdLong')}</span>
            {view.md && <Icon name="check" size={16} />}
          </button>
          <button type="button" role="menuitemcheckbox" aria-checked={view.rashi} onClick={() => setView({ ...view, rashi: !view.rashi })}>
            <span className="code">✦</span>
            <span className="name">{t('tanakh.rashi')}</span>
            {view.rashi && <Icon name="check" size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}


/** The sources and licenses under a section, and its link to Sefaria (the link only on screen). */
function Sources({ sec, tr }: { sec: SectionDay; tr: Tr | null }) {
  const { t } = useI18n();
  const v = sec.versions;
  return (
    <footer className="tk-sources">
      <p>
        {t('tanakh.sourceHe')} — {v.he?.title} ({v.he?.license}), Sefaria.{' '}
        {t('tanakh.sourceEn')} — {v.en?.title} ({v.en?.license}), Sefaria.{' '}
        {(v.md || v.rashi) && <>{t('tanakh.sourceComm', { title: (v.md ?? v.rashi)!.title ?? '' })} </>}
        {v.rashiEn && <>{t('tanakh.sourceRashiEn', { title: v.rashiEn.title ?? '' })} </>}
        {tr === 'en' && <>{t('tanakh.sourceEnMd')} </>}
        {tr === 'ru' && <>{t('tanakh.sourceRu')} </>}
        {tr === 'de' && <>{t('tanakh.sourceDe')} </>}
      </p>
      <p className="no-print">
        {sec.refs.map((r) => (
          <a key={r.url} href={r.url} target="_blank" rel="noopener">
            {t('tanakh.onSefaria')} ↗
          </a>
        ))}
      </p>
    </footer>
  );
}

/** «Распечатать»: the page as it is shown (the chosen languages and commentaries); optionally both sections of the day. */
const BOTH_KEY = 'niflaot:tanakh-print-both';
function usePrintBoth(): [boolean, (v: boolean) => void] {
  const [v, set] = useState(() => {
    try {
      return localStorage.getItem(BOTH_KEY) === '1';
    } catch {
      return false;
    }
  });
  return [
    v,
    (x) => {
      set(x);
      try {
        localStorage.setItem(BOTH_KEY, x ? '1' : '0');
      } catch {}
    },
  ];
}

const bookOf = (slug: string) => BOOKS.find((b) => b.slug === slug)!;
const labelLang = (locale: string) => (locale === 'en' || locale === 'de' ? locale : 'ru');

/** the translation with the Names' hyphen unbroken on screen (Б‑г / Г‑сподь / G‑tt: a non-breaking hyphen) */
const nb = (tr: Tr | null, x?: string) =>
  x && (tr === 'ru' ? x.replace(/([БГ])-(?=г|спод)/g, '$1\u2011') : tr === 'de' ? x.replace(/([Gg])-(?=tt)/g, '$1\u2011') : x);

/**
 * One commentary on a verse: its comments in Hebrew (when the Hebrew is shown) and in the chosen translation. Without a
 * translation in that language: Rashi — in English, marked; Metzudat David — in Hebrew, with a note (when only the
 * translation is shown, the Hebrew stands in).
 */
function Comm({ c, by, he, tr }: { c: Commentary; by: string; he: boolean; tr: Tr | null }) {
  const { t } = useI18n();
  const own = tr ? c[tr] : undefined;
  const en = !own && tr && tr !== 'en' ? c.en : undefined;
  const showHe = !!c.he && (he || (!!tr && !own && !en));
  const pending = !!tr && !own && !en && !!c.he;
  if (!showHe && !own && !en) return null;
  return (
    <div className="tk-st">
      <span className="tk-st-by">
        {by}
        {en && <small> · {t('tanakh.commEnOnly')}</small>}
        {pending && <small className="no-print"> · {t('tanakh.commTr')}</small>}
      </span>
      {showHe && c.he!.map((x, k) => <p key={`h${k}`} className="he" lang="he" dir="rtl" dangerouslySetInnerHTML={{ __html: x }} />)}
      {(own ?? en)?.map((x, k) => <p key={`t${k}`} lang={own ? tr! : 'en'} dangerouslySetInnerHTML={{ __html: nb(own ? tr : 'en', x)! }} />)}
    </div>
  );
}

/** The verses of one section of one day: a heading at each new chapter, then verse by verse with the chosen commentaries. */
function Verses({ verses, he, tr, md, rashi }: { verses: DayVerse[]; he: boolean; tr: Tr | null; md: boolean; rashi: boolean }) {
  const { t, locale } = useI18n();
  return (
    <>
      {verses.map((v, i) => {
        const prev = verses[i - 1];
        const book = bookOf(v.b);
        const newChapter = !prev || prev.b !== v.b || prev.c !== v.c;
        const text = tr ? nb(tr, v[tr]) : undefined;
        return (
          <Fragment key={`${v.b}-${v.c}-${v.v}`}>
            {newChapter && (
              <h2 className="tk-chapter">
                {book.name[labelLang(locale)]} · {t('tanakh.chapter', { n: v.c })}{' '}
                <span className="he" lang="he">
                  {book.he} {hebrewNumber(v.c).replace(/[׳״]/g, '')}
                </span>
              </h2>
            )}
            <section className="tk-verse" id={`v-${v.b}-${v.c}-${v.v}`}>
              <span className="tk-num num" aria-label={`${v.c}:${v.v}`}>
                {v.c}:{v.v}
              </span>
              {he && (
                <p className="tk-he he" lang="he" dir="rtl">
                  {v.he}
                </p>
              )}
              {text && (
                <p className="tk-en" lang={tr!}>
                  {text}
                  {tr === 'en' && v.enFrom && <small className="fn"> ({v.enFrom})</small>}
                </p>
              )}
              {md && v.md && <Comm c={v.md} by={t('tanakh.md')} he={he} tr={tr} />}
              {rashi && v.rashi && <Comm c={v.rashi} by={t('tanakh.rashi')} he={he} tr={tr} />}
            </section>
          </Fragment>
        );
      })}
    </>
  );
}

/**
 * «Я прочитал(а)» under the passage, and the reader's tracker of this section: how many passages of the cycle are read,
 * and the first earlier day left unread. The marks make the certificates of «Академия» (100 % of a book's passages).
 */
function DoneCheck({ section, date, today }: { section: Section; date: string; today: string }) {
  const { t, locale } = useI18n();
  const [done, setDone] = useDone(date, section);
  const store = useDoneStore();
  let read = 0;
  let missed = 0;
  let first: string | undefined;
  for (const d of CYCLE) {
    if (isDone(store, d.date, section)) read++;
    else if (d.date < today) {
      missed++;
      first ??= d.date;
    }
  }
  return (
    <div className={`tk-done no-print${done ? ' on' : ''}`}>
      <label>
        <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
        <span>{t('tanakh.doneCheck')}</span>
      </label>
      <p>
        {t('tanakh.doneStat', { n: read, total: CYCLE.length, section: t(`tanakh.${section}`) })}
        {first && first !== date && (
          <>
            {' · '}
            <a href={`#/${section}/${first}`}>{t('tanakh.doneMissed', { n: missed, date: civilDate(first, locale) })}</a>
          </>
        )}
      </p>
    </div>
  );
}

const weekday = (iso: string, locale: string) => {
  const w = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
  return w.charAt(0).toUpperCase() + w.slice(1);
};
const shortDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));

/** ‹ / › at the corners of the date bar: the previous / next study day of the cycle (a day off is skipped). */
function DayStep({ to, section, dir }: { to?: string; section: Section; dir: 'prev' | 'next' }) {
  const { t, locale } = useI18n();
  if (!to) return <span className={`tk-step ${dir}`} aria-hidden="true" />;
  const label = t(dir === 'prev' ? 'tanakh.prevDay' : 'tanakh.nextDay');
  return (
    <a className={`tk-step ${dir}`} href={`#/${section}/${to}`} aria-label={`${label}: ${civilDate(to, locale)}`} title={label}>
      <Icon name="chevron" size={20} />
      <small>{shortDate(to, locale)}</small>
    </a>
  );
}

/** «Распечатать»: a small menu — print this section, or both sections of the day (`niflaot:tanakh-print-both`). */
function PrintMenu({ other, both, setBoth }: { other: Section; both: boolean; setBoth: (v: boolean) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);
  return (
    <div className="tk-print" ref={root}>
      <button type="button" className="lang-btn tk-print-btn" aria-label={t('print.button')} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="print" size={17} />
        <span>{t('print.button')}</span>
      </button>
      {open && (
        <div className="lang-list tk-print-list" role="dialog" aria-label={t('print.button')}>
          <label>
            <input type="checkbox" checked={both} onChange={(e) => setBoth(e.target.checked)} />
            {t('tanakh.printBoth', { other: t(`tanakh.${other}`) })}
          </label>
          <button
            type="button"
            className="btn"
            onClick={() => {
              close();
              window.print();
            }}
          >
            <Icon name="print" size={16} /> {t('print.button')}
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * `#/neviim[/<date>]`, `#/ketuvim[/<date>]` — «Пророки» / «Писания»: the passage of the day of the three-year cycle
 * (src/core/tanakhCycle.ts): the Hebrew verse, its translation and the commentaries — Metzudat David and Rashi.
 * Without a date — today, or the next study day when today has no reading.
 */
export function TanakhPage({ section, date }: { section: Section; date?: string }) {
  const { t, locale } = useI18n();
  const [view, setView] = useView(locale);
  const [printBoth, setPrintBoth] = usePrintBoth();
  const today = localToday();
  const { index, exact } = cycleDayFor(date ?? today);
  const day = CYCLE[index];
  const lang = labelLang(locale);
  const title = t(`tanakh.${section}`);
  const range = rangeLabel(section, day[section], lang);
  const [content, setContent] = useState<DayContent | null | undefined>(undefined);

  useEffect(() => {
    let live = true;
    setContent(undefined);
    loadDay(day.date).then((c) => live && setContent(c));
    // the day didn't load without network: when the network is back, it loads by itself
    const retry = () => loadDay(day.date).then((c) => live && c && setContent(c));
    addEventListener('online', retry);
    return () => {
      live = false;
      removeEventListener('online', retry);
    };
  }, [day.date]);

  useEffect(() => {
    document.title = `${title}: ${range} · ${t('app.title')}`;
  }, [title, range, t]);

  // the AI assistant (✦) knows the passage on screen
  useEffect(() => {
    const lang = locale === 'en' || locale === 'de' ? locale : 'ru';
    setOtherPage({ kind: 'tanakh', context: () => tanakhContext(section, day.date, lang) });
    return () => setOtherPage(null);
  }, [section, day.date, locale]);

  const other: Section = section === 'neviim' ? 'ketuvim' : 'neviim';
  const prev = CYCLE[index - 1];
  const next = CYCLE[index + 1];
  const sec = content?.[section];
  // the project's translation is shown where the whole day is translated (both sections); otherwise English stands in, with a note
  const ready = (l: OwnLang) => !!content && (['neviim', 'ketuvim'] as const).every((s) => content[s].verses.every((v) => v[l]));
  const soon = { ru: !!content && !ready('ru'), de: !!content && !ready('de') };
  const he = view.text.startsWith('he');
  const want = trOf(view.text);
  const missing = want === 'ru' || want === 'de' ? soon[want] : false;
  const tr = missing ? 'en' : want;
  const isToday = day.date === today;

  return (
    <>
      <TopBar title={title} />
      <div className="wrap tk">
        <article>
          <TanakhMasthead title={title} he={SECTION_HE[section]} route={`${section}/${day.date}`} date={day.date} />
          <p className="wing-tag adults no-print">{t('wing.adults')}</p>
          <nav className="tk-tabs no-print" aria-label={t('tanakh.sectionsLabel')}>
            {(['neviim', 'ketuvim'] as const).map((s) => (
              <a key={s} href={`#/${s}/${day.date}`} className={s === section ? 'on' : undefined} aria-current={s === section ? 'page' : undefined}>
                <span className="tk-tab-name">
                  {t(`tanakh.${s}`)}{' '}
                  <span className="he" lang="he">
                    {SECTION_HE[s]}
                  </span>
                </span>
                <small>{rangeLabel(s, day[s], lang)}</small>
              </a>
            ))}
          </nav>

          <nav className="tk-dates no-print" aria-label={t('tanakh.navLabel')}>
            <DayStep to={prev?.date} section={section} dir="prev" />
            <div className="tk-date">
              <b>{isToday ? t('tanakh.today') : !date && !exact ? t('tanakh.nextReading') : weekday(day.date, locale)}</b>
              <span>{civilDate(day.date, locale)}</span>
              <span className="he" lang="he">
                {jewishDate(day.date)}
              </span>
              {!isToday && (date || exact) && (
                <a className="tk-to-today" href={`#/${section}`}>
                  {t('tanakh.toToday')}
                </a>
              )}
            </div>
            <DayStep to={next?.date} section={section} dir="next" />
          </nav>

          <header className="tk-head">
            <h1>
              {title}{' '}
              <span className="he" lang="he">
                {SECTION_HE[section]}
              </span>
            </h1>
            <p className="tk-range">{range}</p>
            <p className="tk-day">
              {t('tanakh.day', { n: index + 1, total: CYCLE.length })}
              {sec && <> · {t('tanakh.readingTime', { n: readingMinutes(sec.verses, he, tr, view) })}</>}
            </p>
            {!date && !exact && <p className="tk-note">{t('tanakh.restToday')}</p>}
          </header>

          <div className="tk-tools no-print">
            <ViewMenu view={view} setView={setView} soon={soon} />
            {sec && <PrintMenu other={other} both={printBoth} setBoth={setPrintBoth} />}
          </div>
          {missing && <p className="tk-note">{t(want === 'de' ? 'tanakh.deMissing' : 'tanakh.ruMissing')}</p>}
          {/* «Слушать»: the translation and Metzudat David read aloud (src/core/tanakhNarration.ts) */}
          {sec && content && (
            <ListenBar
              key={`${section}-${day.date}-${locale}`}
              slug={tanakhSlug(section, day.date)}
              lang={tanakhLang(content, locale)}
              title={title}
              passage
              load={() => tanakhNarration(content, section, tanakhLang(content, locale))}
            />
          )}

          {content === undefined ? (
            <p className="tk-note">{t('tanakh.loading')}</p>
          ) : !sec ? (
            <p className="tk-note">{t('tanakh.notReady')}</p>
          ) : (
            <Verses verses={sec.verses} he={he} tr={tr} md={view.md} rashi={view.rashi} />
          )}

          {sec && <DoneCheck section={section} date={day.date} today={today} />}
          {sec && (
            <p className="tk-quiz no-print">
              <a className="btn" href={`#/${section}/${day.date}/quiz`}>
                ✓ {t('quiz.cta')}
              </a>
            </p>
          )}
          {sec && <TanakhWords section={section} date={day.date} />}
          <nav className="tk-pager no-print" aria-label={t('tanakh.navLabel')}>
            {prev ? (
              <a className="prev" href={`#/${section}/${prev.date}`}>
                <small>← {t('tanakh.prevDay')}</small>
                <b>{rangeLabel(section, prev[section], lang)}</b>
                <span>{civilDate(prev.date, locale)}</span>
              </a>
            ) : (
              <span />
            )}
            {next && (
              <a className="next" href={`#/${section}/${next.date}`}>
                <small>{t('tanakh.nextDay')} →</small>
                <b>{rangeLabel(section, next[section], lang)}</b>
                <span>{civilDate(next.date, locale)}</span>
              </a>
            )}
          </nav>
          {sec && <Sources sec={sec} tr={tr} />}
          {printBoth && content?.[other] && (
            <section className="tk-print-other print-only">
              <header className="tk-head">
                <h1>
                  {t(`tanakh.${other}`)}{' '}
                  <span className="he" lang="he">
                    {SECTION_HE[other]}
                  </span>
                </h1>
                <p className="tk-range">{rangeLabel(other, day[other], lang)}</p>
              </header>
              <Verses verses={content[other].verses} he={he} tr={tr} md={view.md} rashi={view.rashi} />
              <Sources sec={content[other]} tr={tr} />
            </section>
          )}
          <p className="tk-cycle no-print">
            {t('tanakh.cycle', { start: civilDate(CYCLE[0].date, locale), end: civilDate(CYCLE[CYCLE.length - 1].date, locale), days: CYCLE.length })}
          </p>
        </article>
      </div>
      <Colophon />
    </>
  );
}
