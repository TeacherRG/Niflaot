import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { toggleCourse, useCourses, type Course } from '../core/courses';

/**
 * On a course's page (the Prophets, the Writings, Chassidut, the Holy Tongue, the niggunim): «＋ Добавить в мои курсы» —
 * or «✓ В моих курсах» with «убрать». One may try a course first and choose it after the onboarding (src/core/courses.ts).
 */
export function AddCourse({ course }: { course: Course }) {
  const { t } = useI18n();
  const mode = useMode();
  const on = useCourses(mode).c.includes(course);
  return (
    <p className="add-course no-print">
      {on ? (
        <>
          <a className="add-course-on" href="#/">
            ✓ {t('courses.inMine')}
          </a>
          <button type="button" className="add-course-off" onClick={() => toggleCourse(mode, course, false)}>
            {t('courses.remove')}
          </button>
        </>
      ) : (
        <button type="button" className="add-course-btn" onClick={() => toggleCourse(mode, course, true)}>
          ＋ {t('courses.add')}
        </button>
      )}
    </p>
  );
}
