import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { NIFLAOT_LOGO } from '../core/partners';
import { HEBREW_LEVELS, savedHebrewLevel, setHebrewLevel, type HebrewLevel } from '../core/hebrewLevel';
import { setMode, useSavedMode, type Mode } from '../core/mode';
import { COURSES, PACES, PLAN_YEARS, defaultCourses, savedCourses, setCourses, type Course, type Pace, type PlanYears } from '../core/courses';
import { Colophon } from './Colophon';
import { TopBar } from './TopBar';

/**
 * The onboarding — one window on the first visit instead of the home page (and at `#/mode`): short questions,
 * 1) who is learning — the children's site or the adults' one (src/core/mode.ts),
 * 2) «Как вы с ивритом?» — how much help the letters get (src/core/hebrewLevel.ts),
 * 3) «Что вы хотите учить?» — the courses besides the weekly Torah portion (src/core/courses.ts), none or several, and for
 *    the Prophets and Writings — at one's own pace or with the Academy;
 * «Начать» saves the answers and opens the home page. All are changed later in the account window (👤).
 */
export function ModePicker() {
  const { t } = useI18n();
  const saved = useSavedMode();
  const [mode, pickMode] = useState<Mode | null>(saved);
  const [level, pickLevel] = useState<HebrewLevel | null>(savedHebrewLevel);
  const [courses, pickCourses] = useState<Course[]>(() => savedCourses()?.c ?? (saved ? defaultCourses(saved).c : []));
  const [pace, pickPace] = useState<Pace>(() => savedCourses()?.pace ?? (saved ? defaultCourses(saved).pace : 'own'));
  const [years, pickYears] = useState<PlanYears>(() => savedCourses()?.years ?? 3);
  // until the player touches the courses, they follow the mode (its usual courses ticked)
  const [touched, touch] = useState(() => savedCourses() !== null);
  const toggle = (c: Course) => (touch(true), pickCourses((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c])));
  const choose = (m: Mode) => {
    pickMode(m);
    if (!touched) {
      const defaults = defaultCourses(m);
      pickCourses(defaults.c);
      pickPace(defaults.pace);
    }
  };
  const tanakh = courses.includes('neviim') || courses.includes('ketuvim');
  const skipCourses = () => {
    touch(true);
    pickCourses([]);
  };

  useEffect(() => {
    document.title = `${t('mode.title')} · ${t('app.title')}`;
  }, [t]);

  const start = () => {
    if (!mode) return;
    if (level) setHebrewLevel(level);
    setCourses({ c: courses, pace, years });
    try {
      localStorage.setItem('niflaot:help-seen', '1');
    } catch {}
    setMode(mode);
    if (location.hash !== '#/' && location.hash !== '') location.hash = '#/';
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* the language and «Войти» are needed before the choice too: a visitor may read another language, or come back on a new device */}
      <TopBar title={t('app.title')} wide />
      <main className="mode-pick">
        <img className="h-logo" src={NIFLAOT_LOGO} alt="Niflaot" width={512} height={512} fetchPriority="high" />
        <p className="mode-brand">
          {t('mode.brand')} · <span className="mode-promise">{t('home.promise')}</span>
        </p>
        <h1 id="mode-q1" className="mode-q">
          <span className="mode-n">1</span>
          {t('mode.title')}
        </h1>
        <p className="mode-hint">{t('mode.hint')}</p>
        <fieldset className="mode-opts" aria-labelledby="mode-q1">
          {(['kids', 'adults'] as const).map((m) => (
            <label key={m} className={`mode-opt ${m}${mode === m ? ' on' : ''}`}>
              <input type="radio" name="mode" checked={mode === m} onChange={() => choose(m)} />
              <span className="mode-ico" aria-hidden="true">{m === 'kids' ? '🧩' : '📖'}</span>
              <b>{t(`mode.${m}`)}</b>
              <small>{t(`mode.${m}Short`)}</small>
            </label>
          ))}
        </fieldset>
        <h2 id="mode-q2" className="mode-q">
          <span className="mode-n">2</span>
          {t('hebrew.q')}
        </h2>
        <p className="mode-hint">{t('hebrew.note')}</p>
        <fieldset className="mode-hb" aria-labelledby="mode-q2">
          {HEBREW_LEVELS.map((l) => (
            <label key={l} className={`mode-hb-opt${level === l ? ' on' : ''}`}>
              <input type="radio" name="hebrew-level" checked={level === l} onChange={() => pickLevel(l)} />
              <b>{t(`hebrew.${l}.short`)}</b>
              <small>{t(`hebrew.${l}.sub`)}</small>
            </label>
          ))}
        </fieldset>
        <button className="mode-skip" type="button" onClick={() => pickLevel(null)}>{t('hebrew.skip')}</button>
        <h2 id="mode-q3" className="mode-q">
          <span className="mode-n">3</span>
          {t('courses.q')}
        </h2>
        <p className="mode-sub">{t('courses.qSub')}</p>
        <div className="mode-courses" aria-labelledby="mode-q3">
          {COURSES.map((c) => (
            <label key={c} className={`mode-course${courses.includes(c) ? ' on' : ''}`}>
              <span className="mode-course-label">
                <b>{t(`courses.${c}`)}</b>
                <small>{t(`courses.${c}.sub`)}</small>
              </span>
              <input type="checkbox" role="switch" checked={courses.includes(c)} onChange={() => toggle(c)} aria-label={t(`courses.${c}`)} />
            </label>
          ))}
        </div>
        {tanakh && (
          <>
            <fieldset className="mode-pace">
              <legend>{t('courses.paceQ')}</legend>
              {PACES.map((p) => (
                <label key={p} className={`mode-pace-opt${pace === p ? ' on' : ''}`}>
                  <input type="radio" name="course-pace" checked={pace === p} onChange={() => pickPace(p)} />
                  <b>{t(`courses.pace.${p}`)}</b>
                  <small>{t(`courses.pace.${p}.sub`)}</small>
                </label>
              ))}
            </fieldset>
            {pace === 'own' && (
              <fieldset className="mode-pace">
                <legend>{t('courses.yearsQ')}</legend>
                {PLAN_YEARS.map((y) => (
                  <label key={y} className={`mode-pace-opt${years === y ? ' on' : ''}`}>
                    <input type="radio" name="plan-years" checked={years === y} onChange={() => pickYears(y)} />
                    <b>{t(`courses.years.${y}`)}</b>
                    <small>{t(`courses.years.${y}.sub`)}</small>
                  </label>
                ))}
              </fieldset>
            )}
          </>
        )}
        <button className="mode-skip" type="button" onClick={skipCourses}>{t('courses.skip')}</button>
        <button className="btn mode-start" disabled={!mode} onClick={start}>
          {t('mode.start')} →
        </button>
        <p className="mode-note">{t('mode.note')}</p>
      </main>
      <Colophon />
    </>
  );
}
