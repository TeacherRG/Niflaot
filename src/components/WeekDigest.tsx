import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { PARSHIOT, type ParshaId } from '../lessons';
import { CYCLE, localToday, loadDay, type DayContent, type DayVerse } from '../core/tanakh';
import { BOOKS, SECTIONS, addDays, rangeLabel, type Section } from '../core/tanakhCycle';
import { HEMSHECH, hsLang } from '../core/hemshech';
import { HS_SENTENCES, digestWeek, digestWeeks, firstLines, firstSentences, quoteSentence, quoteVerse, retell, weekDays, weekNigun, weekPassages } from '../core/weekDigest';
import { SITE_HOST } from '../core/site';
import { Icon } from './ui';
import { TanakhMasthead } from './PrintBrand';
import { NotFound, PageLoading } from './PageStates';
import { SLOGAN_HE, Slogan } from './Slogan';

type Lang = 'ru' | 'en' | 'de';
const dayLabel = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
const verseRef = (v: DayVerse, lang: Lang) => `${BOOKS.find((b) => b.slug === v.b)?.name[lang] ?? v.b} ${v.c}:${v.v}`;

/** A verse in Hebrew and under it its translation: the project's where there is one, else the English (marked). */
function Quote({ v, lang }: { v: DayVerse; lang: Lang }) {
  const { t } = useI18n();
  const tr = v[lang] ?? v.en;
  return (
    <blockquote className="wd-quote">
      <p className="he" lang="he" dir="rtl">
        {v.he.replace(/<[^>]+>/g, '')}
      </p>
      <p className="wd-tr">
        «{tr.replace(/<[^>]+>/g, '')}» <span className="wd-ref">({verseRef(v, lang)}{tr === v[lang] || lang === 'en' ? '' : `, ${t('digest.english')}`})</span>
      </p>
    </blockquote>
  );
}

/**
 * One section of the Prophets and Writings: day by day — the passage and what it tells (the project's retelling; a day not
 * retold yet — a verse of it), then one verse of the week (the same choice as a day's, over the whole week).
 */
function TanakhWeek({ section, days, lang }: { section: Section; days: DayContent[]; lang: Lang }) {
  const { t, locale } = useI18n();
  const week = quoteVerse(days.flatMap((d) => d[section].verses));
  return (
    <section className="p-block">
      <h2 className="st-h2">
        {section === 'neviim' ? '📖' : '📜'} {t(`tanakh.${section}`)}
      </h2>
      <ol className="wd-days">
        {days.map((d) => {
          const range = rangeLabelOf(d, section, lang);
          const told = retell(d.date, section, lang);
          return (
            <li key={d.date} className="wd-day">
              <p className="wd-when">
                <b>{dayLabel(d.date, locale)}</b> ·{' '}
                <a href={`#/${section}/${d.date}`}>{range}</a>
              </p>
              {told ? <p className="wd-retell">{told}</p> : <DayQuote verses={d[section].verses} lang={lang} />}
            </li>
          );
        })}
      </ol>
      {week && (
        <>
          <p className="wd-label">{t('digest.verse')}</p>
          <Quote v={week} lang={lang} />
        </>
      )}
    </section>
  );
}
function DayQuote({ verses, lang }: { verses: DayVerse[]; lang: Lang }) {
  const v = quoteVerse(verses);
  return v ? <Quote v={v} lang={lang} /> : null;
}
const CYCLE_BY_DATE = new Map(CYCLE.map((d) => [d.date, d]));
/** «Йеґошуа 5:11 – 6:6» — the passage of the day as the cycle has it */
function rangeLabelOf(d: DayContent, section: Section, lang: Lang) {
  const day = CYCLE_BY_DATE.get(d.date);
  return day ? rangeLabel(section, day[section], lang) : '';
}

/**
 * `#/digest[/<воскресенье>]` — «Неделя в Академии» (src/core/weekDigest.ts): what was learnt this week besides the
 * weekly portion, told briefly with small quotes — the Prophets, the Writings, the «Ґемшех» and the niggun of the week;
 * to read or print.
 */
export function WeekDigest({ week }: { week?: string }) {
  const { t, locale } = useI18n();
  const lang: Lang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const today = localToday();
  const weeks = digestWeeks(today);
  const sunday = week ?? digestWeek(today);
  const known = weeks.includes(sunday);
  const [days, setDays] = useState<DayContent[] | null>(null);

  useEffect(() => {
    document.title = `${t('digest.title')} · ${t('app.title')}`;
  }, [t]);
  useEffect(() => {
    if (!known) return;
    let live = true;
    Promise.all(weekDays(sunday, today).map((d) => loadDay(d.date))).then((all) => live && setDays(all.filter((d): d is DayContent => !!d)));
    return () => {
      live = false;
    };
  }, [sunday, today, known]);

  if (!known) return <NotFound />;
  if (!days) return <PageLoading />;

  const shabbat = addDays(sunday, 6);
  const parsha = (Object.keys(PARSHIOT) as ParshaId[]).find((id) => PARSHIOT[id].shabbat === shabbat);
  const passages = weekPassages(sunday, today);
  const hl = hsLang(locale);
  const nigun = weekNigun(sunday);
  const range = `${dayLabel(sunday, locale)} – ${dayLabel(addDays(sunday, 5), locale)}`;
  return (
    <div className="print-view">
      <div className="print-bar no-print">
        <a className="btn ghost" href="#/">
          {t('table.back')}
        </a>
        {weeks.length > 1 && (
          <label className="print-opts">
            {t('digest.week')}
            <select value={sunday} onChange={(e) => (location.hash = `#/digest/${e.target.value}`)}>
              {weeks.map((w) => (
                <option key={w} value={w}>
                  {dayLabel(w, locale)} – {dayLabel(addDays(w, 5), locale)}
                </option>
              ))}
            </select>
          </label>
        )}
        <button className="btn" onClick={() => window.print()}>
          <Icon name="print" size={18} />
          {t('print.print')}
        </button>
      </div>

      <article className="sheet-paper st wd">
        <TanakhMasthead title={t('digest.title')} he={parsha ? `פרשת ${PARSHIOT[parsha].he}` : ''} route={`digest/${sunday}`} date={shabbat} label={t('digest.kicker')} />
        <header className="st-head">
          <p className="p-label">{t('digest.kicker')}</p>
          <h1>{t('digest.title')}</h1>
          <p className="wd-range">{range}</p>
          <p className="st-tag">
            <Slogan />
          </p>
        </header>
        <p className="st-note">{t('digest.lead')}</p>

        {!days.length && !passages.length && <p>{t('digest.empty')}</p>}
        {days.length > 0 && SECTIONS.map((s) => <TanakhWeek key={s} section={s} days={days} lang={lang} />)}

        {passages.length > 0 && (
          <section className="p-block">
            <h2 className="st-h2">✦ {t('hs.menuLbl')} · {HEMSHECH.title[hl]}</h2>
            <ol className="wd-days">
              {passages.map(({ p, date }) => (
                <li key={p.id} className="wd-day">
                  <p className="wd-when">
                    <b>{dayLabel(date, locale)}</b> · <a href={`#/hemshech/${p.id}`}>{p.title[hl]}</a>
                  </p>
                  <p className="wd-retell">{firstSentences(p.summary[hl].replace(/<[^>]+>/g, ''), HS_SENTENCES)}</p>
                </li>
              ))}
            </ol>
            <blockquote className="wd-quote">
              <p className="wd-tr">
                «{quoteSentence(passages[passages.length - 1].p[hl])}» <span className="wd-ref">({passages[passages.length - 1].p.title[hl]})</span>
              </p>
            </blockquote>
            <p className="st-note">
              {HEMSHECH.credit[hl]} {t('hs.rights')} <a href={HEMSHECH.creditUrl}>{HEMSHECH.creditUrl.replace(/^https?:\/\/(www\.)?/, '')}</a>
            </p>
          </section>
        )}

        <section className="p-block">
          <h2 className="st-h2">🎵 {t('digest.nigun')} · {nigun.title[locale as Lang] ?? nigun.title.ru}</h2>
          <p className="no-print">{nigun.about[locale as Lang] ?? nigun.about.ru}</p>
          <blockquote className="wd-quote wd-song">
            {firstLines(nigun).map((l, i) => (
              <div key={i} className="wd-line">
                <p className={nigun.lang === 'he' ? 'he' : undefined} lang={nigun.lang} dir={nigun.lang === 'he' ? 'rtl' : undefined}>
                  {l.text}
                </p>
                {(l.read?.[locale as Lang] || l.tr?.[locale as Lang]) && (
                  <p className="wd-tr">
                    {l.read?.[locale as Lang] && <span className="wd-read">{l.read[locale as Lang]}</span>}
                    {l.read?.[locale as Lang] && l.tr?.[locale as Lang] && ' — '}
                    {l.tr?.[locale as Lang]}
                  </p>
                )}
              </div>
            ))}
          </blockquote>
          <p className="st-note">
            <a href={`#/nigun/${nigun.id}`}>{t('digest.sing')}</a> · {t('nigun.credit')} <a href={nigun.source.url}>{nigun.source.name}</a>
          </p>
        </section>

        <footer className="p-foot">
          <span className="he" lang="he">
            {SLOGAN_HE}
          </span>{' '}
          · {t('app.title')} · {SITE_HOST} · © mychitas.app 5787
        </footer>
      </article>
    </div>
  );
}
