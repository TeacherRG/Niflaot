import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { LESSONS, LESSON_GROUPS, cardsOnly, type Lesson } from '../lessons';
import { TEACHERS, teacherOf } from '../lessons/teachers';
import { lessonProgress } from '../core/progress';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { WeekCountdown } from './WeekCountdown';
import { PhoneOffer } from './PhoneOffer';
import { dailyNumber, grid, loadResults, streak } from '../core/daily';
import { Icon } from './ui';
import { NIFLAOT_LOGO } from '../core/partners';
import { useMode } from '../core/mode';

/** The games of a lesson as small icons: gematria (#), Memo or cards, investigation (magnifier), reading (book). */
function GameIcons({ lesson: l }: { lesson: Lesson }) {
  return (
    <span className="h-games">
      {!cardsOnly(l) && <Icon name={l.kind === 'sicha' ? 'search' : 'hash'} size={15} />}
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
/** `read` — the adults' home: the tile opens the lesson to read, without games, age or progress ring. */
function WeekTile({ lesson: l, read }: { lesson: Lesson; read?: boolean }) {
  const { t, pick } = useI18n();
  const text = pick(l.texts).value;
  const who = teacherOf(l);
  const done = lessonProgress(l.slug, l.legacyStorageKey);
  if (read)
    return (
      <a className={`h-tile t-${TEACHERS[who].color}`} href={`#/${l.slug}/read`}>
        <span className="h-tile-top">
          <span className="h-badge">{t(`teacher.${who}.short`)}</span>
        </span>
        <span className="h-tile-he he" lang="he">
          {l.hebrewTitle}
        </span>
        <span className="h-tile-title">{text.title}</span>
        <span className="h-tile-sum">{text.summary}</span>
        <span className="h-tile-foot">
          <span className="h-games">
            <Icon name="book" size={15} /> {t(l.cards ? 'cards.tabRead' : 'read.tab')}
          </span>
        </span>
      </a>
    );
  return (
    <a className={`h-tile t-${TEACHERS[who].color}`} href={`#/${l.slug}${cardsOnly(l) ? '/cards' : ''}`}>
      <span className="h-tile-top">
        <span className="h-badge">{t(`teacher.${who}.short`)}</span>
        {!cardsOnly(l) && <Ring done={done} total={l.riddles.length} />}
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
/** «Гематрия дня» on the home screen: today's number, or the result when today's word is solved. */
function DailyLink() {
  const { t } = useI18n();
  const n = dailyNumber();
  const all = loadResults();
  const r = all[n];
  const series = streak(all, n);
  return (
    <a className="h-daily" href="#/daily">
      <span className="h-daily-title">
        ✦ {t('daily.title')} <span className="num">{t('daily.no', { n })}</span>
      </span>
      <span className="h-daily-sub">
        {r?.done ? `${grid(r) || '🟥🟥🟥'}${series > 1 ? ` · 🔥 ${series}` : ''}` : t('daily.menuSub')} →
      </span>
    </a>
  );
}

/**
 * The passage of the day of the Prophets and Writings on the adults' home: today's books and verses and the reading
 * time. The cycle's data is loaded only after the page is shown (it is not part of the home bundle).
 */
function AdultsLink() {
  const { t, locale } = useI18n();
  const [info, setInfo] = useState<{ range: string; min?: number } | null>(null);
  // today's «Вопросы к отрывку»: shown only when written; a finished one — with its best result
  const [quiz, setQuiz] = useState<{ sec: 'neviim' | 'ketuvim'; best?: string }[]>([]);
  useEffect(() => {
    let live = true;
    const lang = locale === 'en' || locale === 'de' ? locale : 'ru';
    Promise.all([import('../core/tanakh'), import('../core/tanakhCycle'), import('../core/quiz')]).then(async ([tk, cy, qz]) => {
      const day = tk.CYCLE[tk.cycleDayFor(tk.localToday()).index];
      const range = `${cy.rangeLabel('neviim', day.neviim, lang)} · ${cy.rangeLabel('ketuvim', day.ketuvim, lang)}`;
      if (live) setInfo({ range });
      if (live && qz.quizReady(day.date)) {
        const store = qz.readQuizStore();
        setQuiz(
          (['neviim', 'ketuvim'] as const).map((sec) => {
            const r = store[`${day.date}:${sec}`];
            return { sec, best: r && r.n > 0 && r.best >= 0 ? `${r.best}/${r.n}` : undefined };
          }),
        );
      }
      const c = await tk.loadDay(day.date);
      const tr = lang === 'ru' || lang === 'de' ? (c?.neviim.verses.every((v) => v[lang]) ? lang : 'en') : 'en';
      const min = c && tk.readingMinutes([...c.neviim.verses, ...c.ketuvim.verses], true, tr, { md: true, rashi: false });
      if (live && min) setInfo({ range, min });
    });
    return () => {
      live = false;
    };
  }, [locale]);
  return (
    <div className="h-adults">
      <a className="h-adults-main" href="#/neviim">
        <span className="h-adults-title">
          {t('home.adultsTitle')} <span className="he" lang="he">נביאים · כתובים</span>
        </span>
        <span className="h-adults-sub">
          {info ? info.range : t('wing.adultsSub')}
          {info?.min ? ` · ${t('tanakh.readingTime', { n: info.min })}` : ''}
        </span>
        <span className="h-adults-cta">{t('home.adultsCta')} →</span>
      </a>
      {quiz.length > 0 && (
        <span className="h-adults-quiz">
          {quiz.map((q) => (
            <a key={q.sec} href={`#/${q.sec}/quiz`}>
              {q.best && '✓ '}
              {t('quiz.title')} · {t(`tanakh.${q.sec}`)}
              {q.best && ` · ${q.best}`} →
            </a>
          ))}
        </span>
      )}
    </div>
  );
}

/**
 * The adults' home («Подростки и взрослые», src/core/mode.ts): the passage of the day of the Prophets and Writings,
 * the week's Torah lessons to read, quietly — «Знаете ли вы?» / «Гематрия дня» and «Академия». No games, ages, confetti.
 */
function AdultsHome() {
  const { t, locale } = useI18n();
  useEffect(() => {
    document.title = `${t('home.adultsH1')} · ${t('app.title')} · MyChitas`;
  }, [t]);
  const week = LESSON_GROUPS[LESSON_GROUPS.length - 1];
  const reads = [...week.lessons, ...week.rebbe].filter((l) => l.kind !== 'sicha' || l.cards);
  return (
    <>
      <TopBar title={t('app.title')} wide />
      <div className="home home-adults">
        <main className="home-main">
          <section className="h-hero">
            <div className="h-hero-text">
              <img className="h-logo" src={NIFLAOT_LOGO} alt="Niflaot" width={760} height={298} fetchPriority="high" />
              <h1>{t('home.adultsH1')}</h1>
              <p className="h-adults-lead">{t('home.adultsLead')}</p>
            </div>
            <div className="h-hero-side">
              <AdultsLink />
              <PhoneOffer />
            </div>
          </section>

          {reads.length > 0 && (
            <section className="h-section" aria-labelledby="h-week">
              <h2 id="h-week">
                {t('home.weekReadTitle')} · {week.name[locale as keyof typeof week.name] ?? week.name.ru}{' '}
                <span className="he" lang="he">
                  {week.he}
                </span>
              </h2>
              <div className="h-tiles">
                {reads.map((l) => (
                  <WeekTile key={l.slug} lesson={l} read />
                ))}
              </div>
            </section>
          )}

          <p className="h-adults-more">
            <a href="#/academy">
              {t('academy.title')} · {t('academy.menuSub')} →
            </a>
            <a href="#/facts">{t('home.adultsFacts')} →</a>
          </p>
        </main>
      </div>
      <Colophon />
    </>
  );
}

export function Catalog() {
  return useMode() === 'adults' ? <AdultsHome /> : <KidsHome />;
}

/** The children's and families' home: «Start / Continue», «Гематрия дня», the week's lessons with their games. */
function KidsHome() {
  const { t, pick, locale } = useI18n();

  useEffect(() => {
    document.title = `${t('app.title')} · MyChitas`;
  }, [t]);

  // the week's portion: the latest one with lessons
  const week = LESSON_GROUPS[LESSON_GROUPS.length - 1];
  const lessons = [...week.lessons, ...week.rebbe];
  // continue a started lesson, else the first unfinished one of the week (a cards-only lesson has no riddles to continue)
  const playable = lessons.filter((l) => !cardsOnly(l));
  const started = LESSONS.find((l) => {
    const d = lessonProgress(l.slug, l.legacyStorageKey);
    return d > 0 && d < l.riddles.length;
  });
  const next =
    started ?? playable.find((l) => lessonProgress(l.slug, l.legacyStorageKey) < l.riddles.length) ?? playable[0] ?? LESSONS[0];
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
              <DailyLink />
              <PhoneOffer />
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
