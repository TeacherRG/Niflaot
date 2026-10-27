import { useEffect, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n';
import { PARSHIOT, type ParshaId } from '../lessons';
import { CYCLE, localToday, loadDay, type DayContent, type DayVerse } from '../core/tanakh';
import { BOOKS, SECTIONS, addDays, rangeLabel, type Section } from '../core/tanakhCycle';
import { HEMSHECH, hsLang } from '../core/hemshech';
import { HS_SENTENCES, digestWeek, digestWeeks, firstLines, firstSentences, quoteSentence, quoteVerse, retell, weekDays, weekNigun, weekPassages } from '../core/weekDigest';
import { SITE_HOST } from '../core/site';
import { civilDate, jewishDate } from '../core/hebrewDate';
import { Icon } from './ui';
import { TanakhMasthead } from './PrintBrand';
import { NotFound, PageLoading } from './PageStates';
import { SLOGAN_HE, Slogan } from './Slogan';

type Lang = 'ru' | 'en' | 'de';
const fmt = (iso: string, locale: string, o: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale, { ...o, timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
const dayLabel = (iso: string, locale: string) => fmt(iso, locale, { weekday: 'short', day: 'numeric', month: 'long' });
const verseRef = (v: DayVerse, lang: Lang) => `${BOOKS.find((b) => b.slug === v.b)?.name[lang] ?? v.b} ${v.c}:${v.v}`;
const plain = (s: string) => s.replace(/<[^>]+>/g, '');

/** The head of a section: its icon in a coloured circle, the title, what it covers this week, and its name in Hebrew. */
function SectionHead({ icon, title, sub, he }: { icon: string; title: string; sub?: string; he: string }) {
  return (
    <header className="wd-sec-h">
      <span className="wd-ico" aria-hidden="true">
        {icon}
      </span>
      <div className="wd-sec-t">
        <h2>{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      <span className="wd-sec-he he" lang="he" dir="rtl">
        {he}
      </span>
    </header>
  );
}

/** A day of the week: its badge (weekday and date) beside what was learnt — a timeline down the section. */
function Day({ date, href, title, children }: { date: string; href: string; title: string; children: ReactNode }) {
  const { locale } = useI18n();
  return (
    <li className="wd-day">
      <span className="wd-badge">
        <b>{fmt(date, locale, { weekday: 'short' })}</b>
        <span>{fmt(date, locale, { day: 'numeric', month: 'short' })}</span>
      </span>
      <div className="wd-body">
        <a className="wd-range" href={href}>
          {title}
        </a>
        {children}
      </div>
    </li>
  );
}

/** A verse in Hebrew and under it its translation: the project's where there is one, else the English (marked). */
function Quote({ v, lang, label }: { v: DayVerse; lang: Lang; label?: string }) {
  const { t } = useI18n();
  const tr = v[lang] ?? v.en;
  return (
    <figure className={label ? 'wd-verse' : 'wd-quote'}>
      {label && <figcaption className="wd-label">{label}</figcaption>}
      <p className="he" lang="he" dir="rtl">
        {plain(v.he)}
      </p>
      <p className="wd-tr">«{plain(tr)}»</p>
      <cite className="wd-ref">
        {verseRef(v, lang)}
        {tr === v[lang] || lang === 'en' ? '' : `, ${t('digest.english')}`}
      </cite>
    </figure>
  );
}

const CYCLE_BY_DATE = new Map(CYCLE.map((d) => [d.date, d]));
const HE_NAME: Record<Section, string> = { neviim: 'נביאים', ketuvim: 'כתובים' };

/**
 * One section of the Prophets and Writings: day by day — the passage and what it tells (the project's retelling; a day not
 * retold yet — a verse of it), then one verse of the week (the same choice as a day's, over the whole week).
 */
function TanakhWeek({ section, days, lang }: { section: Section; days: DayContent[]; lang: Lang }) {
  const { t } = useI18n();
  const week = quoteVerse(days.flatMap((d) => d[section].verses));
  const cyc = days.map((d) => CYCLE_BY_DATE.get(d.date)).filter((d) => !!d);
  const span = cyc.length ? rangeLabel(section, [cyc[0][section][0], cyc[cyc.length - 1][section][1]], lang) : '';
  return (
    <section className={`wd-sec wd-${section}`}>
      <SectionHead icon={section === 'neviim' ? '📖' : '📜'} title={t(`tanakh.${section}`)} sub={span} he={HE_NAME[section]} />
      <ol className="wd-days">
        {days.map((d) => {
          const told = retell(d.date, section, lang);
          return (
            <Day key={d.date} date={d.date} href={`#/${section}/${d.date}`} title={rangeLabelOf(d, section, lang)}>
              {told ? <p className="wd-retell">{told}</p> : <DayQuote verses={d[section].verses} lang={lang} />}
            </Day>
          );
        })}
      </ol>
      {week && <Quote v={week} lang={lang} label={t('digest.verse')} />}
    </section>
  );
}
function DayQuote({ verses, lang }: { verses: DayVerse[]; lang: Lang }) {
  const v = quoteVerse(verses);
  return v ? <Quote v={v} lang={lang} /> : null;
}
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
  const friday = addDays(sunday, 5);
  const last = passages.length ? passages[passages.length - 1] : null;
  const nl = locale as Lang;
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

      <article className="sheet-paper wd">
        <TanakhMasthead title={t('digest.title')} he={parsha ? `פרשת ${PARSHIOT[parsha].he}` : ''} route={`digest/${sunday}`} date={shabbat} label={t('digest.kicker')} />
        <header className="wd-head">
          <p className="wd-kicker">{t('digest.kicker')}</p>
          <h1>{t('digest.title')}</h1>
          <p className="wd-dates">
            <span>
              {fmt(sunday, locale, { day: 'numeric', month: 'long' })} – {civilDate(friday, locale)}
            </span>
            <span className="he" lang="he" dir="rtl">
              {jewishDate(sunday).replace(/\s\S+$/, '')} – {jewishDate(friday)}
            </span>
          </p>
          <div className="wd-slogan">
            <Slogan />
          </div>
          <p className="wd-lead">{t('digest.lead')}</p>
        </header>

        {!days.length && !passages.length && <p className="wd-empty">{t('digest.empty')}</p>}
        {days.length > 0 && SECTIONS.map((s) => <TanakhWeek key={s} section={s} days={days} lang={lang} />)}

        {last && (
          <section className="wd-sec wd-hemshech">
            <SectionHead icon="✦" title={t('hs.menuLbl')} sub={HEMSHECH.title[hl]} he="חסידות" />
            <ol className="wd-days">
              {passages.map(({ p, date }) => (
                <Day key={p.id} date={date} href={`#/hemshech/${p.id}`} title={p.title[hl]}>
                  <p className="wd-retell">{firstSentences(plain(p.summary[hl]), HS_SENTENCES)}</p>
                </Day>
              ))}
            </ol>
            <figure className="wd-verse">
              <p className="wd-tr">«{quoteSentence(last.p[hl])}»</p>
              <cite className="wd-ref">{last.p.title[hl]}</cite>
            </figure>
            <p className="wd-credit">
              {HEMSHECH.credit[hl]} {t('hs.rights')} <a href={HEMSHECH.creditUrl}>{HEMSHECH.creditUrl.replace(/^https?:\/\/(www\.)?/, '')}</a>
            </p>
          </section>
        )}

        <section className="wd-sec wd-nigun">
          <SectionHead icon="♫" title={t('digest.nigun')} sub={nigun.title[nl] ?? nigun.title.ru} he="ניגון" />
          <p className="wd-about no-print">{nigun.about[nl] ?? nigun.about.ru}</p>
          <div className="wd-song">
            {firstLines(nigun).map((l, i) => (
              <div key={i} className="wd-line">
                <p className={nigun.lang === 'he' ? 'he' : 'wd-sung'} lang={nigun.lang} dir={nigun.lang === 'he' ? 'rtl' : undefined}>
                  {l.text}
                </p>
                {(l.read?.[nl] || l.tr?.[nl]) && (
                  <p className="wd-tr">
                    {l.read?.[nl] && <span className="wd-read">{l.read[nl]}</span>}
                    {l.read?.[nl] && l.tr?.[nl] && ' — '}
                    {l.tr?.[nl]}
                  </p>
                )}
              </div>
            ))}
          </div>
          <p className="wd-credit">
            <a className="wd-sing" href={`#/nigun/${nigun.id}`}>
              ▶ {t('digest.sing')}
            </a>{' '}
            · {t('nigun.credit')} <a href={nigun.source.url}>{nigun.source.name}</a>
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
