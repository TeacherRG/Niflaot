import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { useCourses } from '../core/courses';
import type { CourseRow } from '../core/myCourses';

/** the bar: of the book being read (the Prophets, the Writings — a book is a step one sees), else of the whole course */
const pct = (r: CourseRow) => (r.book ? Math.round((r.book.done / r.book.parts) * 100) : r.total ? Math.round((r.done / r.total) * 100) : 0);

/**
 * «Мои курсы» on the home page (both modes): a row for each course the player chose (src/core/courses.ts) — the course,
 * how far along it is (done of the whole course; the Prophets and Writings — the bar of the book being read), what comes next
 * and its link. The weekly Torah portion is not here: it is the same for everyone and has its own card. «Изменить» opens
 * the choice in the account window. The progress (src/core/myCourses.ts) is loaded only here.
 */
export function CoursesCard() {
  const { t, locale } = useI18n();
  const mode = useMode();
  const { c, pace } = useCourses(mode);
  const [rows, setRows] = useState<CourseRow[] | null>(null);
  const key = c.join();
  useEffect(() => {
    let live = true;
    import('../core/myCourses').then((m) => live && setRows(m.myCourses(c, pace, locale)));
    return () => {
      live = false;
    };
    // the courses' content is the key (the array is new on every change)
  }, [key, pace, locale]);

  const sub = (r: CourseRow) => {
    if (r.starts) return t('courses.starts', { date: r.starts });
    if (r.id === 'neviim' || r.id === 'ketuvim' || r.id === 'hemshech') return r.finished ? `✓ ${r.next}` : `${t('courses.next')}: ${r.next}`;
    if (r.id === 'lashon') return t('courses.lashonSub', { n: r.next ?? 0, xp: r.done, goal: r.total });
    return r.finished ? t('courses.nigunAll') : `${t('courses.next')}: ${r.next}`;
  };
  const count = (r: CourseRow) =>
    r.id === 'lashon' ? `${r.done}/${r.total}` : r.id === 'nigun' ? `🎓 ${r.done}/${r.total}` : t('courses.of', { n: r.done, total: r.total });

  return (
    <section className={`courses ${mode === 'adults' ? 'adults' : 'kids'}`} aria-labelledby="courses-h">
      <div className="courses-head">
        <h2 id="courses-h">{t('courses.title')}</h2>
        <a href="#/account" className="courses-edit">
          {t('acc.change')}
        </a>
      </div>
      {c.length === 0 ? (
        <p className="courses-empty">
          {t('courses.empty')} <a href="#/account">{t('courses.choose')} →</a>
        </p>
      ) : (
        <ul>
          {(rows ?? []).map((r) => (
            <li key={r.id}>
              <a className={`courses-row${r.finished ? ' done' : ''}`} href={r.href}>
                <span className="courses-t">
                  {t(`courses.${r.id}`)}
                  {(r.id === 'neviim' || r.id === 'ketuvim') && <small> · {t(`courses.pace.${pace}.short`)}</small>}
                </span>
                <span className="courses-n">{count(r)}</span>
                <span className="courses-s">
                  {sub(r)}
                  {r.book && ` · ${t('courses.inBook', { n: r.book.done, total: r.book.parts })}`}
                </span>
                <span className="a-bar" aria-hidden="true">
                  <span style={{ width: `${pct(r)}%` }} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="courses-torah">{t('courses.torahNote')}</p>
    </section>
  );
}
