import { useEffect } from 'react';
import { Html, useI18n } from '../i18n';
import { withTerms } from '../i18n/glossary';
import { PARSHIOT } from '../lessons';
import type { Lesson } from '../lessons/types';
import { parseQuote } from '../sources';
import { markCalcs } from '../core/calcLines';
import { localToday } from '../core/tanakh';
import { civilDate, jewishDate } from '../core/hebrewDate';
import { PER_DAY, TURIM_DAYS, dayItems, doneKey, turimDate, turimDays, turimIsDone, useTurimDone } from '../core/turimDaily';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { HebrewRuns } from './Hebrew';
import { Quote } from './Quote';
import { Icon } from './ui';

const weekday = (iso: string, locale: string) => {
  const w = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
  return w.charAt(0).toUpperCase() + w.slice(1);
};
const shortDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));

/** ‹ / › at the corners of the date bar: the previous / next day (across portions). */
function Step({ to, dir }: { to?: { href: string; date: string }; dir: 'prev' | 'next' }) {
  const { t, locale } = useI18n();
  if (!to) return <span className={`tk-step ${dir}`} aria-hidden="true" />;
  const label = t(dir === 'prev' ? 'turim.prev' : 'turim.next');
  return (
    <a className={`tk-step ${dir}`} href={to.href} aria-label={`${label}: ${civilDate(to.date, locale)}`} title={label}>
      <Icon name="chevron" size={20} />
      <small>{shortDate(to.date, locale)}</small>
    </a>
  );
}

/** «Я прочитал(а)» under the day — the progress through the portion's week (`niflaot:turim-done`). */
function DoneCheck({ lesson, n, today }: { lesson: Lesson; n: number; today: string }) {
  const { t, locale } = useI18n();
  const [store, mark] = useTurimDone();
  const key = doneKey(lesson, n);
  const done = turimIsDone(store, key);
  const days = Array.from({ length: TURIM_DAYS }, (_, k) => k + 1);
  const read = days.filter((d) => turimIsDone(store, doneKey(lesson, d))).length;
  const missed = days.find((d) => d !== n && turimDate(lesson, d) <= today && !turimIsDone(store, doneKey(lesson, d)));
  return (
    <div className={`tk-done no-print${done ? ' on' : ''}`}>
      <label>
        <input type="checkbox" checked={done} onChange={(e) => mark(key, e.target.checked)} />
        <span>{t('turim.done')}</span>
      </label>
      <p>
        {t('turim.doneStat', { n: read, total: TURIM_DAYS })}
        {missed && (
          <>
            {' · '}
            <a href={`#/${lesson.slug}/day/${missed}`}>{t('turim.doneFirst', { day: weekday(turimDate(lesson, missed), locale) })}</a>
          </>
        )}
      </p>
    </div>
  );
}

/**
 * «Бааль ґа-Турим на каждый день» — a commentary lesson read over the week of its portion, like the day's passage of
 * «Пророки и Писания»: two comments a day, Sunday to Friday — the verse, the commentator's words (original + translation,
 * in two columns) and the explanation; «Я прочитал(а)» at the end, then the next day.
 */
export function TurimDailyPage({ lesson, n }: { lesson: Lesson; n: number }) {
  const { t, pick, locale } = useI18n();
  const { value: text, locale: textLocale } = pick(lesson.texts);
  const today = localToday();
  const date = turimDate(lesson, n);
  const parsha = PARSHIOT[lesson.parsha];
  const parshaName = (parsha.name as Record<string, string>)[locale] ?? parsha.name.ru;
  const all = turimDays();
  const i = all.findIndex((d) => d.lesson.slug === lesson.slug && d.n === n);
  const link = (d?: (typeof all)[number]) => d && { href: `#/${d.lesson.slug}/day/${d.n}`, date: d.date };
  const prev = link(all[i - 1]);
  const next = link(all[i + 1]);
  const items = dayItems(lesson, n);
  const texts = text.daily?.items.slice((n - 1) * PER_DAY, n * PER_DAY) ?? [];
  const isToday = date === today;
  const title = t('turim.title');

  useEffect(() => {
    document.title = `${title} · ${parshaName} · ${weekday(date, locale)} · ${t('app.title')}`;
  }, [title, parshaName, date, locale, t]);
  return (
    <>
      <TopBar title={title} />
      <div className="wrap tk turim">
        <article lang={textLocale}>
          <nav className="tk-dates no-print" aria-label={title}>
            <Step to={prev} dir="prev" />
            <div className="tk-date">
              <b>{isToday ? t('turim.today') : weekday(date, locale)}</b>
              <span>{civilDate(date, locale)}</span>
              <span className="he" lang="he">
                {jewishDate(date)}
              </span>
              {!isToday && all.some((d) => d.date === today) && (
                <a className="tk-to-today" href="#/turim">
                  {t('turim.toToday')}
                </a>
              )}
            </div>
            <Step to={next} dir="next" />
          </nav>

          <header className="tk-head">
            <p className="eyebrow">{t('turim.eyebrow', { parsha: parshaName, n, total: TURIM_DAYS })}</p>
            <h1>
              {title}{' '}
              <span className="he" lang="he">
                {parsha.he}
              </span>
            </h1>
            <p className="tk-range">
              {texts.map((x) => x.h).join(' · ')} · {t('turim.minutes')}
            </p>
            {date > today && <p className="tk-note">{t('turim.ahead')}</p>}
          </header>
          {n === 1 && text.daily?.intro && <p className="read-intro no-speak">{text.daily.intro}</p>}

          {items.map((it, k) => (
            <section key={k} className="riddle read-riddle turim-item" id={`turim-${k + 1}`}>
              <div className="r-head">
                <span className="eyebrow">{t('turim.item', { n: (n - 1) * PER_DAY + k + 1, total: lesson.daily!.length })}</span>
                <h2>
                  <HebrewRuns text={texts[k]?.h ?? ''} />
                </h2>
              </div>
              <Quote q={{ id: it.verse }} />
              {it.quotes.map((q) => (
                <Quote key={q} q={parseQuote(q)} />
              ))}
              {texts[k] && <Html as="div" className="les-b" html={withTerms(markCalcs(texts[k].b), textLocale)} />}
            </section>
          ))}

          <DoneCheck lesson={lesson} n={n} today={today} />

          <nav className="tk-pager no-print" aria-label={title}>
            {prev ? (
              <a className="prev" href={prev.href}>
                <small>← {t('turim.prev')}</small>
                <b>{weekday(prev.date, locale)}</b>
                <span>{civilDate(prev.date, locale)}</span>
              </a>
            ) : (
              <span />
            )}
            {next && (
              <a className="next" href={next.href}>
                <small>{t('turim.next')} →</small>
                <b>{weekday(next.date, locale)}</b>
                <span>{civilDate(next.date, locale)}</span>
              </a>
            )}
          </nav>

          <section className="memo-cta no-print">
            <span aria-hidden="true">📖</span>
            <p>
              {t('turim.lesson')}: <b>{text.title}</b>
            </p>
            <a className="btn" href={`#/${lesson.slug}/read`}>
              {t('turim.lessonRead')} →
            </a>
            <a className="btn ghost" href={`#/${lesson.slug}`}>
              🔢 {t('turim.lessonPlay')}
            </a>
          </section>
        </article>
      </div>
      <Colophon source={text.source} />
    </>
  );
}
