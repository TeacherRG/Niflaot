import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { shownCourses, toggleCourse, useCourses } from '../core/courses';
import type { CourseRow } from '../core/myCourses';

/** the bar: of the book being read (the Prophets, the Writings — a book is a step one sees), else of the whole course */
/** where to look at a course before adding it */
const COURSE_HREF = { neviim: '#/neviim', ketuvim: '#/ketuvim', hemshech: '#/hemshech', lashon: '#/lashon', nigun: '#/nigun', koelet: '#/koelet' } as const;

const pct = (r: CourseRow) => (r.book ? Math.round((r.book.done / r.book.parts) * 100) : r.total ? Math.round((r.done / r.total) * 100) : 0);

/**
 * «Мои курсы» on the home page (both modes): a row for each course the player chose (src/core/courses.ts) — the course,
 * how far along it is (done of the whole course; the Prophets and Writings — the bar of the book being read), what comes next
 * and its link; under them — the other courses: the name opens the course to try it, «＋» adds it. The weekly Torah portion is not here: it is the same for everyone and has its own card. «Изменить» opens
 * the choice in the account window. The progress (src/core/myCourses.ts) is loaded only here.
 * `simple` — the adults' home (owner, 28.10.2026): only the names of the chosen courses with their bars, no other words.
 */
export function CoursesCard({ simple = false }: { simple?: boolean }) {
  const { t, locale } = useI18n();
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
    if (r.id === 'lashon') return t('courses.lashonSub', { n: r.next ?? 0, xp: r.xp ?? 0, goal: r.goal ?? 0 });
    if (r.id === 'koelet') return r.finished ? t('courses.koeletAll') : r.done ? t('courses.koeletSub', { n: r.done, total: r.total }) : t('courses.koeletStart');
    return r.finished ? t('courses.nigunAll') : `${t('courses.next')}: ${r.next}`;
  };
  const count = (r: CourseRow) =>
    r.id === 'lashon' || r.id === 'koelet' ? `${r.done}/${r.total}` : r.id === 'nigun' ? `🎓 ${r.done}/${r.total}` : t('courses.of', { n: r.done, total: r.total });

  if (simple) return <SimpleCourses rows={rows ?? []} />;

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
          {t('courses.empty')}
        </p>
      ) : (
        <ul>
          {(rows ?? []).map((r) => (
            <li key={r.id}>
              <a className={`courses-row${r.finished ? ' done' : ''}`} href={r.href}>
                <span className="courses-t">
                  {t(`courses.${r.id}`)}
                  {(r.id === 'neviim' || r.id === 'ketuvim') && <small> · {t(`courses.pace.${pace}.short`)}{pace === 'own' ? ` · ${t(years === 1 ? 'courses.years.1.short' : 'courses.years.3.short')}` : ''}</small>}
                </span>
                <span className="courses-n">
                  {count(r)}
                </span>
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
      {/* the others — one tap adds a course, without the account window; or open it first and look around */}
      {c.length < shownCourses().length && (
        <div className="courses-more">
          <span>{t('courses.more')}</span>
          {shownCourses().filter((x) => !c.includes(x)).map((x) => (
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

/**
 * «Мои курсы» on the adults' home — half a tile, next to «Святая игра Zip» (owner, 02.11.2026): as many courses as fit
 * the tile's height make a page; the other pages are a swipe away (scroll-snap, the dots under them go to a page).
 */
function SimpleCourses({ rows }: { rows: CourseRow[] }) {
  const { t } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const [per, setPer] = useState(rows.length || 1);
  const [page, setPage] = useState(0);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => {
      const row = el.querySelector<HTMLElement>('.courses-row');
      const h = row?.parentElement?.offsetHeight ?? 0;
      if (!h || !el.clientHeight) return;
      setPer(Math.max(1, Math.floor((el.clientHeight + 1) / h)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [rows.length]);
  const pages = Array.from({ length: Math.ceil(rows.length / per) || 1 }, (_, i) => rows.slice(i * per, (i + 1) * per));
  const go = (i: number) => box.current?.scrollTo({ left: i * box.current.clientWidth, behavior: 'smooth' });
  return (
    <section className="courses adults simple" aria-labelledby="courses-h">
      <h2 id="courses-h">{t('courses.title')}</h2>
      <div
        className="cc-pages"
        ref={box}
        onScroll={(e) => setPage(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}
      >
        {pages.map((p, i) => (
          <ul key={i} className="cc-page">
            {p.map((r) => (
              <li key={r.id}>
                <a className={`courses-row${r.finished ? ' done' : ''}${!r.done && !r.book?.done ? ' zero' : ''}`} href={r.href}>
                  <span className="courses-t">{t(`courses.${r.id}`)}</span>
                  <span className="a-bar" aria-hidden="true">
                    <span style={{ width: `${pct(r)}%` }} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ))}
      </div>
      {pages.length > 1 && (
        <div className="cc-dots">
          {pages.map((_, i) => (
            <button key={i} type="button" aria-current={i === page ? 'true' : undefined} aria-label={t('courses.page', { n: i + 1, total: pages.length })} onClick={() => go(i)} />
          ))}
        </div>
      )}
    </section>
  );
}
