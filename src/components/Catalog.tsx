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
      <Icon name="book" size={15} />
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
            <Icon name="book" size={15} /> {t(l.kind === 'sicha' ? 'cards.tabRead' : 'read.tab')}
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
  useEffect(() => {
    let live = true;
    const lang = locale === 'en' || locale === 'de' ? locale : 'ru';
    Promise.all([import('../core/tanakh'), import('../core/tanakhCycle')]).then(async ([tk, cy]) => {
      const day = tk.CYCLE[tk.cycleDayFor(tk.localToday()).index];
      const range = `${cy.rangeLabel('neviim', day.neviim, lang)} · ${cy.rangeLabel('ketuvim', day.ketuvim, lang)}`;
      if (live) setInfo({ range });
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
    </div>
  );
}

/**
 * «Хасидут» on the adults' home — a tile like the passage of the day: today's passage of «Ґемшех Самех-Вав», its reading
 * time and the «Я прочитал(а)» mark. The discourse's data is loaded after the page is shown (not in the home bundle).
 */
function HemshechLink() {
  const { t, locale } = useI18n();
  const [info, setInfo] = useState<{ title: string; min: number; read: boolean } | { starts: string } | null>(null);
  useEffect(() => {
    let live = true;
    Promise.all([import('../core/hemshech'), import('../core/tanakh'), import('../core/hebrewDate')]).then(([hs, tk, hd]) => {
      const lang = hs.hsLang(locale);
      const k = hs.todayIndex(tk.localToday());
      if (!live) return;
      if (k < 0) return setInfo({ starts: hd.civilDate(hs.passageDate(0), lang) });
      const { p } = hs.allPassages()[k];
      setInfo({ title: p.title[lang], min: hs.passageMinutes(p, lang), read: hs.hsIsDone(hs.readHsDone(), p.id) });
    });
    return () => {
      live = false;
    };
  }, [locale]);
  return (
    <a className="h-adults h-adults-main" href="#/hemshech">
      <span className="h-adults-title">
        {t('hs.menuLbl')} <span className="h-adults-k">{t('hs.short')}</span>
      </span>
      <span className="h-adults-sub">
        {info && 'title' in info ? (
          <>
            {info.read && '✓ '}
            {info.title} · {t('tanakh.readingTime', { n: info.min })}
          </>
        ) : info ? (
          t('hs.startsOn', { date: info.starts })
        ) : (
          t('hs.menuSub')
        )}
      </span>
      <span className="h-adults-cta">{t('home.adultsCta')} →</span>
    </a>
  );
}

/**
 * «Мои слова» (src/core/words.ts): how many words to review today and how many are known; nothing yet — an invitation.
 * Read from this browser's marks only (the dictionary itself is not loaded on the home page).
 */
function WordsLink() {
  const { t } = useI18n();
  const [info, setInfo] = useState<{ due: number; known: number; any: boolean } | null>(null);
  useEffect(() => {
    let live = true;
    import('../core/words').then((w) => {
      const s = w.readWordStore();
      const ids = Object.keys(s);
      if (live) setInfo({ due: w.dueWords(s).length, known: ids.filter((id) => w.isKnown(s, id)).length, any: ids.some((id) => w.inDeck(s, id)) });
    });
    return () => {
      live = false;
    };
  }, []);
  return (
    <a className="h-adults h-adults-main" href="#/words">
      <span className="h-adults-title">
        {t('words.mine')}{' '}
        <span className="h-adults-k he" lang="he">
          מִלִּים
        </span>
      </span>
      <span className="h-adults-sub">{info?.any ? (info.due ? t('words.homeSub', { d: info.due, k: info.known }) : t('words.homeSubDone', { k: info.known })) : t('words.homeStart')}</span>
      <span className="h-adults-cta">{t(info?.due ? 'words.homeReview' : 'words.homeCta')} →</span>
    </a>
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
  const reads = [...week.lessons, ...week.rebbe];
  return (
    <>
      <TopBar title={t('app.title')} wide />
      <div className="home home-adults">
        <main className="home-main">
          <section className="h-hero">
            <div className="h-hero-text">
              <img className="h-logo" src={NIFLAOT_LOGO} alt="Niflaot" width={760} height={298} fetchPriority="high" />
              <h1>{t('home.adultsH1')}</h1>
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

          {/* the week's Torah lessons first; the daily study (Prophets and Writings, Chassidut, words) below */}
          <section className="h-adults-tiles">
            <AdultsLink />
            <HemshechLink />
            <WordsLink />
            <PhoneOffer />
          </section>

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
