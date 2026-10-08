import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { LESSON_GROUPS } from '../lessons';
import { TEACHERS, teacherOf, type TeacherId } from '../lessons/teachers';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { LessonCard } from './LessonCard';

/** `#/teacher/<id>` — all lessons of one teacher, by Torah portion. */
export function TeacherPage({ id }: { id: TeacherId }) {
  const { t, locale } = useI18n();
  const name = t(`teacher.${id}.name`);

  useEffect(() => {
    document.title = `${name} · ${t('app.title')}`;
  }, [name, t]);

  return (
    <>
      <TopBar title={t('app.title')} />
      <div className="wrap">
        <header className={`teacher-head t-${TEACHERS[id].color}`}>
          <span className="teacher-he he" lang="he" aria-hidden="true">
            {TEACHERS[id].he}
          </span>
          <div>
            <h1>{name}</h1>
            <p>{t(`teacher.${id}.about`)}</p>
            <p className="teacher-genre">{t(`teacher.${id}.genre`)}</p>
          </div>
        </header>
        {LESSON_GROUPS.map((g) => {
          const lessons = [...g.lessons, ...g.rebbe].filter((l) => teacherOf(l) === id);
          if (!lessons.length) return null;
          return (
            <section key={g.id} className="parsha">
              <h2 className="parsha-h">
                <span>{g.name[locale as keyof typeof g.name] ?? g.name.ru}</span>
                <span className="he">{g.he}</span>
                <span className="parsha-year">
                  {g.year} · <span className="he">{g.heYear}</span>
                </span>
              </h2>
              <div className="cards">
                {lessons.map((l) => (
                  <LessonCard key={l.slug} lesson={l} />
                ))}
              </div>
            </section>
          );
        })}
        <div className="cards teacher-soon">
          <div className="card soon">{t('catalog.soon')}</div>
        </div>
      </div>
      <Colophon />
    </>
  );
}
