import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { LESSON_GROUPS, weekParsha } from '../lessons';
import { teacherOf } from '../lessons/teachers';
import { useMode } from '../core/mode';
import { todayIso } from '../core/habit';
import { readStore } from '../core/readCheck';
import { STUDY_DAYS, dayDate, partDone, partHref, studyDay, useTorahDone, weekPlan, weekdayName, dayMonth, type DayPart } from '../core/torahDaily';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { Icon } from './ui';

/** One part of a day: a chapter of a lesson (to read; the children — also to play), its review, or the Shabbat sheet. */
function Part({ p, adults, done }: { p: DayPart; adults: boolean; done: boolean }) {
  const { t, pick } = useI18n();
  if (p.kind === 'table')
    return (
      <li className="td-part td-extra">
        <span className="td-mark" aria-hidden="true">
          <Icon name="print" size={18} />
        </span>
        <a href="#/shabbat-table">{t('td.table')} →</a>
      </li>
    );
  const l = p.lesson;
  const text = pick(l.texts).value;
  const who = t(`teacher.${teacherOf(l)}.short`);
  if (p.kind === 'review')
    return (
      <li className="td-part td-extra">
        <span className="td-mark" aria-hidden="true">
          ↺
        </span>
        <a href={partHref(p, adults)}>
          {t('td.review', { title: adults ? text.title : t(l.memo ? 'td.reviewMemo' : l.cards ? 'td.reviewCards' : 'td.reviewGame') })} →
        </a>
      </li>
    );
  const href = partHref(p, true);
  return (
    <li className={`td-part${done ? ' on' : ''}`}>
      <span className="td-mark" aria-hidden="true">
        {done ? <Icon name="check" size={18} /> : p.ri + 1}
      </span>
      <span className="td-body">
        <span className="td-who">
          {who} · {t('read.chapter', { n: p.ri + 1, total: l.riddles.length })}
          {done && <span className="sr-only"> · {t('td.done')}</span>}
        </span>
        <a className="td-t" href={adults ? href : partHref(p, false)}>
          {text.riddles[p.ri]?.title ?? text.title}
        </a>
        <span className="td-sub">{text.title}</span>
      </span>
      {!adults && (
        <a className="td-read" href={href}>
          {t('td.read')}
        </a>
      )}
    </li>
  );
}

/**
 * «Тора на каждый день» (`#/torah[/<portion>]`, src/core/torahDaily.ts): the week's lessons — Baal HaTurim and the Rebbe's
 * talk — chapter by chapter, from Sunday to Friday; today's day on top of the list is marked, done chapters — ✓.
 */
export function TorahDayPage({ parsha }: { parsha?: string }) {
  const { t, locale } = useI18n();
  const adults = useMode() === 'adults';
  const store = useTorahDone();
  const read = readStore();
  const today = todayIso();
  const group = LESSON_GROUPS.find((g) => g.id === (parsha ?? weekParsha(today))) ?? LESSON_GROUPS[LESSON_GROUPS.length - 1];
  const plan = weekPlan(group);
  const day = studyDay(group, today);
  const name = group.name[locale as keyof typeof group.name] ?? group.name.ru;
  const chapters = plan.flat().filter((p) => p.kind === 'chapter');
  const doneN = chapters.filter((p) => partDone(p, store, read)).length;

  useEffect(() => {
    document.title = `${t('td.title')} · ${name} · ${t('app.title')}`;
  }, [t, name]);

  useEffect(() => {
    if (day < 0 || day >= STUDY_DAYS) return;
    const id = requestAnimationFrame(() => document.getElementById(`td-day-${day}`)?.scrollIntoView({ block: 'center' }));
    return () => cancelAnimationFrame(id);
  }, [day]);

  const others = LESSON_GROUPS.filter((g) => g !== group).reverse();
  return (
    <>
      <TopBar title={t('td.title')} />
      <div className="wrap">
        <main className="td">
          <header className="td-head">
            <div className="heb gold-text he">{group.he}</div>
            <h1>{t('td.title')}</h1>
            <p className="td-week">
              {t('td.week', { name })} · {dayMonth(dayDate(group, 0), locale)} – {dayMonth(dayDate(group, STUDY_DAYS - 1), locale)}
            </p>
            <p className="td-lead">{t('td.lead')}</p>
            <p className="td-stat">
              {doneN >= chapters.length ? t('td.allDone') : t('td.progress', { n: doneN, total: chapters.length })}
            </p>
            {day === 6 && <p className="td-note">{t('td.shabbat')}</p>}
            {day === 7 && doneN < chapters.length && <p className="td-note">{t('td.after')}</p>}
          </header>
          <ol className="td-days">
            {plan.map((parts, k) => {
              const date = dayDate(group, k);
              const now = k === day;
              return (
                <li key={k} id={`td-day-${k}`} className={`td-day${now ? ' today' : ''}${date < today && !now ? ' past' : ''}`} aria-current={now ? 'date' : undefined}>
                  <h2>
                    <span className="td-dname">{weekdayName(date, locale)}</span>
                    <span className="td-date">{dayMonth(date, locale)}</span>
                    {now && <span className="td-today">{t('td.today')}</span>}
                  </h2>
                  <ul>
                    {parts.map((p, j) => (
                      <Part key={j} p={p} adults={adults} done={partDone(p, store, read)} />
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
          {others.length > 0 && (
            <nav className="td-others" aria-label={t('td.others')}>
              <span>{t('td.others')}:</span>
              {others.map((g) => (
                <a key={g.id} href={`#/torah/${g.id}`}>
                  {g.name[locale as keyof typeof g.name] ?? g.name.ru}
                </a>
              ))}
            </nav>
          )}
        </main>
      </div>
      <Colophon />
    </>
  );
}
