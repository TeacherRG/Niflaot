import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Icon, useDismiss } from './ui';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { BOOKS, rangeLabel, type Section } from '../core/tanakhCycle';
import { CYCLE, cycleDayFor, loadDay, localToday, type DayContent, type DayVerse } from '../core/tanakh';
import { civilDate, hebrewNumber, jewishDate } from '../core/hebrewDate';

export const SECTION_HE: Record<Section, string> = { neviim: 'נביאים', ketuvim: 'כתובים' };

/**
 * The page's one language menu: which text to show — the Hebrew and a translation, only a translation, or only the Hebrew —
 * and whether to show Rabbi Steinsaltz's explanations. It applies to everything: the verse, the explanation, the introductions.
 * Russian is the project's translation (src/tanakh/ru), ready week by week; where a day has none, English stands in.
 */
type TextLang = 'he-ru' | 'he-en' | 'ru' | 'en' | 'he';
const TEXT_LANGS: TextLang[] = ['he-ru', 'he-en', 'ru', 'en', 'he'];
interface View {
  text: TextLang;
  st: boolean;
}
const VIEW_KEY = 'niflaot:tanakh-view';
function useView(locale: string): [View, (v: View) => void] {
  const [view, set] = useState<View>(() => {
    try {
      const v = JSON.parse(localStorage.getItem(VIEW_KEY) ?? 'null');
      if (v && TEXT_LANGS.includes(v.text) && typeof v.st === 'boolean') return v;
    } catch {}
    // by default: the Hebrew with the translation in the site's language (Russian site — Russian, else English)
    return { text: locale === 'ru' ? 'he-ru' : 'he-en', st: true };
  });
  return [
    view,
    (v) => {
      set(v);
      try {
        localStorage.setItem(VIEW_KEY, JSON.stringify(v));
      } catch {}
    },
  ];
}

/**
 * One button for the page's languages: it shows the current choice and opens a list — the text languages and,
 * below a line, Rabbi Steinsaltz's explanations on/off.
 */
function ViewMenu({ view, setView, ruSoon }: { view: View; setView: (v: View) => void; ruSoon: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);
  const label = (l: TextLang) => `${t(`tanakh.view.${l}`)}${l.endsWith('ru') && ruSoon ? ` — ${t('tanakh.ruSoon')}` : ''}`;
  return (
    <div className="tk-view no-speak" ref={root}>
      <button type="button" className="lang-btn tk-view-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="globe" size={17} />
        <span>
          {t(`tanakh.view.${view.text}`)}
          {view.st && <small> · {t('tanakh.steinsaltzShort')}</small>}
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
              <span className="code">{l === 'he' ? 'עב' : l.endsWith('ru') ? 'RU' : 'EN'}</span>
              <span className="name">{label(l)}</span>
              {view.text === l && <Icon name="check" size={16} />}
            </button>
          ))}
          <div className="tk-view-sep" />
          <button type="button" role="menuitemcheckbox" aria-checked={view.st} onClick={() => setView({ ...view, st: !view.st })}>
            <span className="code">✦</span>
            <span className="name">{t('tanakh.steinsaltzExpl')}</span>
            {view.st && <Icon name="check" size={16} />}
          </button>
        </div>
      )}
    </div>
  );
}

const bookOf = (slug: string) => BOOKS.find((b) => b.slug === slug)!;
const labelLang = (locale: string) => (locale === 'en' || locale === 'de' ? locale : 'ru');

/** The verses of one section of one day: a heading at each new chapter, Steinsaltz's introductions, then verse by verse. */
function Verses({ verses, he, tr, st }: { verses: DayVerse[]; he: boolean; tr: 'ru' | 'en' | null; st: boolean }) {
  const { t, locale } = useI18n();
  // the translation in the chosen language (in Б-г / Г-сподь the hyphen doesn't break: a non-breaking hyphen on screen)
  const tx = (x: { en?: string; ru?: string }) => (tr === 'ru' ? x.ru?.replace(/([БГ])-(?=г|спод)/g, '$1\u2011') : tr === 'en' ? x.en : undefined);
  return (
    <>
      {verses.map((v, i) => {
        const prev = verses[i - 1];
        const book = bookOf(v.b);
        const newChapter = !prev || prev.b !== v.b || prev.c !== v.c;
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
            {st &&
              v.intro?.map((x, k) => (
                <aside key={k} className="tk-intro">
                  <span className="tk-intro-by">{t('tanakh.steinsaltz')}</span>
                  {he && x.title.he && (
                    <h3 className="he" lang="he" dir="rtl">
                      {x.title.he}
                    </h3>
                  )}
                  {tx(x.title) && <h3 lang={tr!}>{tx(x.title)}</h3>}
                  {he && x.he && (
                    <p className="he" lang="he" dir="rtl">
                      {x.he}
                    </p>
                  )}
                  {tx(x) && <p lang={tr!}>{tx(x)}</p>}
                </aside>
              ))}
            <section className="tk-verse" id={`v-${v.b}-${v.c}-${v.v}`}>
              <span className="tk-num num" aria-label={`${v.c}:${v.v}`}>
                {v.c}:{v.v}
              </span>
              {he && (
                <p className="tk-he he" lang="he" dir="rtl">
                  {v.he}
                </p>
              )}
              {tx(v) && (
                <p className="tk-en" lang={tr!}>
                  {tx(v)}
                  {tr === 'en' && v.enFrom && <small className="fn"> ({v.enFrom})</small>}
                </p>
              )}
              {st && v.st && (he || tx(v.st)) && (
                <div className="tk-st">
                  <span className="tk-st-by">{t('tanakh.steinsaltzShort')}</span>
                  {he && v.st.he && <p className="he" lang="he" dir="rtl" dangerouslySetInnerHTML={{ __html: v.st.he }} />}
                  {tx(v.st) && <p lang={tr!} dangerouslySetInnerHTML={{ __html: tx(v.st)! }} />}
                </div>
              )}
            </section>
          </Fragment>
        );
      })}
    </>
  );
}

/**
 * `#/neviim[/<date>]`, `#/ketuvim[/<date>]` — «Пророки» / «Писания»: the passage of the day of the three-year cycle
 * (src/core/tanakhCycle.ts): the Hebrew verse, its English translation and Rabbi Adin Steinsaltz's explanation.
 * Without a date — today, or the next study day when today has no reading.
 */
export function TanakhPage({ section, date }: { section: Section; date?: string }) {
  const { t, locale } = useI18n();
  const [view, setView] = useView(locale);
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
    return () => {
      live = false;
    };
  }, [day.date]);

  useEffect(() => {
    document.title = `${title}: ${range} · ${t('app.title')}`;
  }, [title, range, t]);

  const other: Section = section === 'neviim' ? 'ketuvim' : 'neviim';
  const prev = CYCLE[index - 1];
  const next = CYCLE[index + 1];
  const sec = content?.[section];
  // Russian is shown where the whole day is translated (both sections); otherwise English stands in, with a note
  const ruReady = !!content && (['neviim', 'ketuvim'] as const).every((s) => content[s].verses.every((v) => v.ru));
  const he = view.text.startsWith('he');
  const want = view.text === 'he' ? null : view.text.endsWith('ru') ? 'ru' : 'en';
  const tr = want === 'ru' && content && !ruReady ? 'en' : want;
  const isToday = day.date === today;

  return (
    <>
      <TopBar title={title} />
      <div className="wrap tk">
        <article>
          <header className="tk-head">
            <p className="tk-kicker">
              {isToday ? t('tanakh.today') : !date && !exact ? t('tanakh.nextReading') : civilDate(day.date, locale)} ·{' '}
              <span className="he" lang="he">
                {jewishDate(day.date)}
              </span>
            </p>
            <h1>
              {title}{' '}
              <span className="he" lang="he">
                {SECTION_HE[section]}
              </span>
            </h1>
            <p className="tk-range">{range}</p>
            <p className="tk-day">{t('tanakh.day', { n: index + 1, total: CYCLE.length })}</p>
            {!date && !exact && <p className="tk-note">{t('tanakh.restToday')}</p>}
          </header>

          <nav className="tk-nav" aria-label={t('tanakh.navLabel')}>
            {prev ? <a href={`#/${section}/${prev.date}`}>← {civilDate(prev.date, locale)}</a> : <span />}
            <a className="tk-other" href={`#/${other}/${day.date}`}>
              {t(`tanakh.${other}`)}: {rangeLabel(other, day[other], lang)}
            </a>
            {next ? <a href={`#/${section}/${next.date}`}>{civilDate(next.date, locale)} →</a> : <span />}
          </nav>

          <ViewMenu view={view} setView={setView} ruSoon={!!content && !ruReady} />
          {want === 'ru' && content && !ruReady && <p className="tk-note">{t('tanakh.ruMissing')}</p>}
          {locale === 'de' && tr === 'en' && <p className="tk-note">{t('tanakh.enOnly')}</p>}

          {content === undefined ? (
            <p className="tk-note">{t('tanakh.loading')}</p>
          ) : !sec ? (
            <p className="tk-note">{t('tanakh.notReady')}</p>
          ) : (
            <Verses verses={sec.verses} he={he} tr={tr} st={view.st} />
          )}

          {sec && (
            <footer className="tk-sources">
              <p>
                {t('tanakh.sourceHe')} — {sec.versions.he?.title} ({sec.versions.he?.license}), Sefaria.{' '}
                {t('tanakh.sourceEn')} — {sec.versions.en?.title} ({sec.versions.en?.license}), Sefaria.{' '}
                {tr === 'ru' && <>{t('tanakh.sourceRu')} </>}
                {sec.versions.steinsaltz && (
                  <>
                    {t('tanakh.steinsaltz')} — {sec.versions.steinsaltz.title} ({sec.versions.steinsaltz.license}).
                  </>
                )}
              </p>
              <p>
                {sec.refs.map((r) => (
                  <a key={r.url} href={r.url} target="_blank" rel="noopener">
                    {t('tanakh.onSefaria')} ↗
                  </a>
                ))}
              </p>
            </footer>
          )}
          <p className="tk-cycle">
            {t('tanakh.cycle', { start: civilDate(CYCLE[0].date, locale), end: civilDate(CYCLE[CYCLE.length - 1].date, locale), days: CYCLE.length })}
          </p>
        </article>
      </div>
      <Colophon />
    </>
  );
}
