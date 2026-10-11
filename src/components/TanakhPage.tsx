import { Fragment, useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { BOOKS, rangeLabel, type Section } from '../core/tanakhCycle';
import { CYCLE, cycleDayFor, loadDay, localToday, type DayContent, type DayVerse } from '../core/tanakh';
import { civilDate, hebrewNumber, jewishDate } from '../core/hebrewDate';

export const SECTION_HE: Record<Section, string> = { neviim: 'נביאים', ketuvim: 'כתובים' };

/**
 * Which of Rabbi Steinsaltz's texts to show: Hebrew and the translation, one of them, or none (only the verse and its translation).
 * 'en' is «the translation»: Russian where the project has translated the day (on the Russian site), else English.
 */
type StMode = 'both' | 'en' | 'he' | 'off';
const ST_KEY = 'niflaot:tanakh-st';
function useStMode(): [StMode, (m: StMode) => void] {
  const [mode, set] = useState<StMode>(() => {
    try {
      const m = localStorage.getItem(ST_KEY);
      if (m === 'both' || m === 'en' || m === 'he' || m === 'off') return m;
    } catch {}
    return 'both';
  });
  return [
    mode,
    (m) => {
      set(m);
      try {
        localStorage.setItem(ST_KEY, m);
      } catch {}
    },
  ];
}

const bookOf = (slug: string) => BOOKS.find((b) => b.slug === slug)!;
const labelLang = (locale: string) => (locale === 'en' || locale === 'de' ? locale : 'ru');

/** The verses of one section of one day: a heading at each new chapter, Steinsaltz's introductions, then verse by verse. */
function Verses({ verses, mode, ru }: { verses: DayVerse[]; mode: StMode; ru: boolean }) {
  const { t, locale } = useI18n();
  // the translation: Russian (the project's) on the Russian site when the day has it, else English
  // (in Б-г / Г-сподь the hyphen doesn't break: a non-breaking hyphen on screen)
  const tr = <T extends { en?: string; ru?: string }>(x: T) =>
    ru && x.ru ? { text: x.ru.replace(/([БГ])-(?=г|спод)/g, '$1\u2011'), lang: 'ru' } : { text: x.en, lang: 'en' };
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
            {mode !== 'off' &&
              v.intro?.map((x, k) => (
                <aside key={k} className="tk-intro">
                  <span className="tk-intro-by">{t('tanakh.steinsaltz')}</span>
                  {mode !== 'en' && x.title.he && (
                    <h3 className="he" lang="he" dir="rtl">
                      {x.title.he}
                    </h3>
                  )}
                  {mode !== 'he' && tr(x.title).text && <h3 lang={tr(x.title).lang}>{tr(x.title).text}</h3>}
                  {mode !== 'en' && x.he && (
                    <p className="he" lang="he" dir="rtl">
                      {x.he}
                    </p>
                  )}
                  {mode !== 'he' && tr(x).text && <p lang={tr(x).lang}>{tr(x).text}</p>}
                </aside>
              ))}
            <section className="tk-verse" id={`v-${v.b}-${v.c}-${v.v}`}>
              <span className="tk-num num" aria-label={`${v.c}:${v.v}`}>
                {v.c}:{v.v}
              </span>
              <p className="tk-he he" lang="he" dir="rtl">
                {v.he}
              </p>
              {tr(v).text && (
                <p className="tk-en" lang={tr(v).lang}>
                  {tr(v).text}
                  {tr(v).lang === 'en' && v.enFrom && <small className="fn"> ({v.enFrom})</small>}
                </p>
              )}
              {mode !== 'off' && v.st && (
                <div className="tk-st">
                  <span className="tk-st-by">{t('tanakh.steinsaltzShort')}</span>
                  {mode !== 'en' && v.st.he && <p className="he" lang="he" dir="rtl" dangerouslySetInnerHTML={{ __html: v.st.he }} />}
                  {mode !== 'he' && tr(v.st).text && <p lang={tr(v.st).lang} dangerouslySetInnerHTML={{ __html: tr(v.st).text! }} />}
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
  const [mode, setMode] = useStMode();
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
  // the Russian site shows the project's Russian translation where the whole day is translated
  const ru = locale === 'ru' && !!sec?.verses.length && sec.verses.every((v) => v.ru);
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

          <div className="tk-mode no-speak" role="group" aria-label={t('tanakh.steinsaltz')}>
            <span>{t('tanakh.steinsaltzShort')}:</span>
            {(['both', 'en', 'he', 'off'] as StMode[]).map((m) => (
              <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}>
                {t(`tanakh.mode.${m}`)}
              </button>
            ))}
          </div>
          {locale !== 'en' && sec && !ru && <p className="tk-note">{t('tanakh.enOnly')}</p>}

          {content === undefined ? (
            <p className="tk-note">{t('tanakh.loading')}</p>
          ) : !sec ? (
            <p className="tk-note">{t('tanakh.notReady')}</p>
          ) : (
            <Verses verses={sec.verses} mode={mode} ru={ru} />
          )}

          {sec && (
            <footer className="tk-sources">
              <p>
                {t('tanakh.sourceHe')} — {sec.versions.he?.title} ({sec.versions.he?.license}), Sefaria.{' '}
                {t('tanakh.sourceEn')} — {sec.versions.en?.title} ({sec.versions.en?.license}), Sefaria.{' '}
                {ru && <>{t('tanakh.sourceRu')} </>}
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
