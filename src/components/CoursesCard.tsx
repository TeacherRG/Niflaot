import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { COURSES, toggleCourse, useCourses } from '../core/courses';
import { useHabit } from '../core/habit';
import type { CourseRow } from '../core/myCourses';

/** the bar: of the book being read (the Prophets, the Writings — a book is a step one sees), else of the whole course */
/** where to look at a course before adding it */
const COURSE_HREF = { neviim: '#/neviim', ketuvim: '#/ketuvim', hemshech: '#/hemshech', lashon: '#/lashon', nigun: '#/nigun' } as const;

const pct = (r: CourseRow) => (r.book ? Math.round((r.book.done / r.book.parts) * 100) : r.total ? Math.round((r.done / r.total) * 100) : 0);

/**
 * «Мои курсы» on the home page (both modes): a row for each course the player chose (src/core/courses.ts) — the course,
 * how far along it is (done of the whole course; the Prophets and Writings — the bar of the book being read), what comes next
 * and its link; under them — the other courses: the name opens the course to try it, «＋» adds it. The weekly Torah portion is not here: it is the same for everyone and has its own card. «Изменить» opens
 * the choice in the account window. The progress (src/core/myCourses.ts) is loaded only here.
 * `lead` — the main block of the adults' home (owner, 26.10.2026): bigger, «N дней подряд · сегодня N из M» (the daily courses:
 * the Prophets, the Writings, Chassidut once it has started, «Святой язык»), and the first course not done today gets «Читать».
 */
export function CoursesCard({ lead = false }: { lead?: boolean }) {
  const { t, locale } = useI18n();
  const h = useHabit();
  const mode = useMode();
  const choice = useCourses(mode);
  const { c, pace, years } = choice;
  const [rows, setRows] = useState<CourseRow[] | null>(null);
  const key = c.join();
  useEffect(() => {
    let live = true;
    import('../core/myCourses').then((m) => live && setRows(m.myCourses(c, choice, locale)));
    return () => {
      live = false;
    };
    // the courses' content is the key (the array is new on every change)
  }, [key, pace, years, choice.startDate, locale]);

  const sub = (r: CourseRow) => {
    if (r.starts) return t('courses.starts', { date: r.starts });
    if (r.id === 'neviim' || r.id === 'ketuvim' || r.id === 'hemshech') return r.finished ? `✓ ${r.next}` : `${t('courses.next')}: ${r.next}`;
    if (r.id === 'lashon') return t('courses.lashonSub', { n: r.next ?? 0, xp: r.done, goal: r.total });
    return r.finished ? t('courses.nigunAll') : `${t('courses.next')}: ${r.next}`;
  };
  // today: the daily courses (a niggun has no part of the day); the first one not done today — the one action of the home
  const daily = (rows ?? []).filter((r) => r.id !== 'nigun' && !r.starts);
  const doneToday = daily.filter((r) => r.today).length;
  const go = lead ? (rows ?? []).find((r) => !r.starts && !(r.id === 'nigun' ? r.finished : r.today)) : undefined;
  const goLabel = (r: CourseRow) => t(r.id === 'lashon' ? 'words.homeCta' : r.id === 'nigun' ? 'home.continue' : 'read.tab');
  const count = (r: CourseRow) =>
    r.id === 'lashon' ? `${r.done}/${r.total}` : r.id === 'nigun' ? `🎓 ${r.done}/${r.total}` : t('courses.of', { n: r.done, total: r.total });

  return (
    <section className={`courses ${mode === 'adults' ? 'adults' : 'kids'}${lead ? ' lead' : ''}`} aria-labelledby="courses-h">
      <div className="courses-head">
        <h2 id="courses-h">{t('courses.title')}</h2>
        <a href="#/account" className="courses-edit">
          {t('acc.change')}
        </a>
      </div>
      {lead && rows && (h.streak > 0 || daily.length > 0) && (
        <p className="courses-status">
          {h.streak > 0 && <b>{t('habit.streak', { n: h.streak })}</b>}
          {h.streak > 0 && daily.length > 0 && ' · '}
          {daily.length > 0 && t('courses.todayDone', { n: doneToday, total: daily.length })}
        </p>
      )}
      {c.length === 0 ? (
        <p className="courses-empty">
          {t('courses.empty')}
        </p>
      ) : (
        <ul>
          {(rows ?? []).map((r) => (
            <li key={r.id}>
              <a className={`courses-row${r.finished ? ' done' : ''}${lead && r.today ? ' today' : ''}${r === go ? ' go' : ''}`} href={r.href}>
                <span className="courses-t">
                  {t(`courses.${r.id}`)}
                  {(r.id === 'neviim' || r.id === 'ketuvim') && <small> · {t(`courses.pace.${pace}.short`)}{pace === 'own' ? ` · ${t(years === 1 ? 'courses.years.1.short' : 'courses.years.3.short')}` : ''}</small>}
                </span>
                <span className="courses-n">
                  {lead && r.today && <span className="courses-tick" aria-label={t('menu.doneToday')}>✓ </span>}
                  {count(r)}
                </span>
                <span className="courses-s">
                  {sub(r)}
                  {r.book && ` · ${t('courses.inBook', { n: r.book.done, total: r.book.parts })}`}
                </span>
                <span className="a-bar" aria-hidden="true">
                  <span style={{ width: `${pct(r)}%` }} />
                </span>
                {r === go && <span className="courses-go">{goLabel(r)}</span>}
              </a>
            </li>
          ))}
        </ul>
      )}
      {/* the others — one tap adds a course, without the account window; or open it first and look around */}
      {c.length < COURSES.length && (
        <div className="courses-more">
          <span>{t('courses.more')}</span>
          {COURSES.filter((x) => !c.includes(x)).map((x) => (
            <span key={x} className="courses-chip">
              <a href={COURSE_HREF[x]}>{t(`courses.${x}`)}</a>
              <button type="button" onClick={() => toggleCourse(mode, x, true)} aria-label={`${t('courses.add')}: ${t(`courses.${x}`)}`} title={t('courses.add')}>
                ＋
              </button>
            </span>
          ))}
        </div>
      )}
      <p className="courses-torah">{t('courses.torahNote')}</p>
    </section>
  );
}
