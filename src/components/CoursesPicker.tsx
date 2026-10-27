import { useId } from 'react';
import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { COURSES, PACES, coursesChosen, setCourses, useCourses } from '../core/courses';

/** Lets a learner choose daily courses and the Tanakh pace from the Academy or account settings. */
export function CoursesPicker() {
  const { t } = useI18n();
  const id = useId();
  const { c, pace } = useCourses(useMode());
  const chosen = coursesChosen();

  return (
    <details className="acc-pick ac-course-picker" open={!chosen}>
      <summary>
        <span className="acc-pick-q" id={id}>{t('courses.q')}</span>
        {chosen && <b>{c.length ? c.map((course) => t(`courses.${course}`)).join(', ') : t('courses.none')}</b>}
        <span className="acc-pick-edit">{t('acc.change')}</span>
      </summary>
      <p className="acc-courses-note">{t('courses.qSub')}</p>
      <div className="acc-modes" role="group" aria-labelledby={id}>
        {COURSES.map((course) => {
          const on = c.includes(course);
          return (
            <button
              key={course}
              type="button"
              role="checkbox"
              aria-checked={on}
              className={`acc-mode${on ? ' on' : ''}`}
              onClick={() => setCourses({ c: on ? c.filter((x) => x !== course) : [...c, course], pace })}
            >
              <b>{on ? '✓' : '+'} {t(`courses.${course}`)}</b>
              <small>{t(`courses.${course}.sub`)}</small>
            </button>
          );
        })}
      </div>
      {(c.includes('neviim') || c.includes('ketuvim')) && (
        <div className="acc-modes acc-pace" role="radiogroup" aria-label={t('courses.paceQ')}>
          <span className="acc-pick-q">{t('courses.paceQ')}</span>
          {PACES.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={pace === option}
              className={`acc-mode${pace === option ? ' on' : ''}`}
              onClick={() => setCourses({ c, pace: option })}
            >
              <b>{t(`courses.pace.${option}`)}</b>
              <small>{t(`courses.pace.${option}.sub`)}</small>
            </button>
          ))}
        </div>
      )}
    </details>
  );
}
