import { useEffect } from 'react';
import { useI18n } from '../i18n';
import { LESSONS, LESSON_GROUPS, type Lesson } from '../lessons';
import { TEACHERS, teacherOf } from '../lessons/teachers';
import { lessonProgress } from '../core/progress';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { WeekCountdown } from './WeekCountdown';
import { Icon } from './ui';
import { NIFLAOT_LOGO } from '../core/partners';

/** The games of a lesson as small icons: gematria (#), Memo or cards, investigation (magnifier), reading (book). */
function GameIcons({ lesson: l }: { lesson: Lesson }) {
  return (
    <span className="h-games">
      <Icon name={l.kind === 'sicha' ? 'search' : 'hash'} size={15} />
      {(l.memo || l.cards) && <Icon name="cards" size={15} />}
      {(l.kind !== 'sicha' || l.cards) && <Icon name="book" size={15} />}
    </span>
  );
}

/** A progress ring: the share of solved riddles. */
const Ring = ({ done, total }: { done: number; total: number }) => (
  <span className="h-ring" style={{ ['--p' as string]: `${Math.round((done / total) * 100)}%` }} aria-hidden="true" />
);

/** A lesson of the week: the teacher's colour and badge, Hebrew and translated title, its games, age and progress. */
function WeekTile({ lesson: l }: { lesson: Lesson }) {
  const { t, pick } = useI18n();
  const text = pick(l.texts).value;
  const who = teacherOf(l);
  const done = lessonProgress(l.slug, l.legacyStorageKey);
  return (
    <a className={`h-tile t-${TEACHERS[who].color}`} href={`#/${l.slug}`}>
      <span className="h-tile-top">
        <span className="h-badge">{t(`teacher.${who}.short`)}</span>
        <Ring done={done} total={l.riddles.length} />
      </span>
      <span className="h-tile-he he" lang="he">
        {l.hebrewTitle}
      </span>
      <span className="h-tile-title">{text.title}</span>
      <span className="h-tile-sum">{text.summary}</span>
      <span className="h-tile-foot">
        <GameIcons lesson={l} />
        <span className="sr-only">{done ? t('catalog.progress', { done, total: l.riddles.length }) : ''}</span>
        <b>{t('age.short', { n: l.age })}</b>
      </span>
    </a>
  );
}

/**
 * The home page — one screen: a short title with «Continue», the lessons of the week's portion (all teachers),
 * and beside them how long the games are open this week (until Shabbat).
 */
export function Catalog() {
  const { t, pick, locale } = useI18n();

  useEffect(() => {
    document.title = `${t('app.title')} · MyChitas`;
  }, [t]);

  // the week's portion: the latest one with lessons
  const week = LESSON_GROUPS[LESSON_GROUPS.length - 1];
  const lessons = [...week.lessons, ...week.rebbe];
  // continue a started lesson, else the first unfinished one of the week
  const started = LESSONS.find((l) => {
    const d = lessonProgress(l.slug, l.legacyStorageKey);
    return d > 0 && d < l.riddles.length;
  });
  const next = started ?? lessons.find((l) => lessonProgress(l.slug, l.legacyStorageKey) < l.riddles.length) ?? lessons[0];
  const nextDone = lessonProgress(next.slug, next.legacyStorageKey);
  const nextWho = teacherOf(next);

  return (
    <>
      <TopBar title={t('app.title')} wide />
      <div className="home">
        <main className="home-main">
          <section className="h-hero">
            <div className="h-hero-text">
              <img className="h-logo" src={NIFLAOT_LOGO} alt="Niflaot — Torah you can explore and learn with joy!" width={760} height={298} fetchPriority="high" />
              <div className="h-hero-he">
                <span className="he gold-text" lang="he">
                  נפלאות
                </span>
                <span className="num">
                  5787 · <span className="he">ה׳תשפ״ז</span>
                </span>
              </div>
              <h1>{t('catalog.uvp')}</h1>
              <p>{t('home.lead')}</p>
            </div>
            <div className="h-hero-side">
              <a className={`h-continue t-${TEACHERS[nextWho].color}`} href={`#/${next.slug}`}>
                <span className="h-continue-lbl">{t(started ? 'home.continue' : 'home.start')}</span>
                <span className="h-continue-title">
                  {pick(next.texts).value.title}
                </span>
                <span className="h-continue-where">
                  <i />
                  {t(`teacher.${nextWho}.short`)} ·{' '}
                  {t('home.riddle', { n: Math.min(nextDone + 1, next.riddles.length), total: next.riddles.length })}
                </span>
                <span className="h-bar">
                  <span style={{ width: `${Math.round((nextDone / next.riddles.length) * 100)}%` }} />
                </span>
              </a>
              <div className="h-countdown-compact">
                <WeekCountdown variant="compact" />
              </div>
            </div>
          </section>

          <section className="h-section" aria-labelledby="h-week">
            <h2 id="h-week">
              {t('home.week')} · {week.name[locale as keyof typeof week.name] ?? week.name.ru}{' '}
              <span className="he" lang="he">
                {week.he}
              </span>
            </h2>
            <div className="h-tiles">
              {lessons.map((l) => (
                <WeekTile key={l.slug} lesson={l} />
              ))}
            </div>
          </section>

        </main>
        <aside className="home-side">
          <WeekCountdown variant="side" />
        </aside>
      </div>
      <Colophon />
    </>
  );
}
