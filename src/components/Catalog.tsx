import { Fragment, useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { LESSONS, LESSON_GROUPS, cardsOnly, type Lesson } from '../lessons';
import { TEACHERS, teacherOf } from '../lessons/teachers';
import { lessonProgress } from '../core/progress';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { WeekCountdown } from './WeekCountdown';
import { PhoneOffer } from './PhoneOffer';
import { HabitCard } from './HabitCard';
import { dailyNumber, grid, loadResults, streak } from '../core/daily';
import { Icon } from './ui';
import { lessonGames } from './lessonGames';
import { lessonArt } from '../core/art';
import { NIFLAOT_LOGO } from '../core/partners';
import { useMode } from '../core/mode';

/** A lesson of the week on the adults' home: the tile opens the lesson to read, without games, age or progress. */
function WeekTile({ lesson: l }: { lesson: Lesson }) {
  const { t, pick } = useI18n();
  const text = pick(l.texts).value;
  const who = teacherOf(l);
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

          <HabitCard />

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
                  <WeekTile key={l.slug} lesson={l} />
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

/** A lesson's games in words, for the tiles: «Игра с гематриями · Memo-игра · Читать» (src/components/lessonGames.ts). */
function gamesLine(l: Lesson, t: ReturnType<typeof useI18n>['t']) {
  return (lessonGames(l) ?? [{ label: l.kind === 'sicha' ? ('cards.tabLesson' as const) : ('memo.tabGematria' as const) }]).map((g) => t(g.label)).join(' · ');
}

/** The cover of a tile: the lesson's picture (art/hero.webp), else its Hebrew title on the teacher's colour. */
function Cover({ lesson: l, he }: { lesson?: Lesson; he: string }) {
  const { pick } = useI18n();
  const art = l && lessonArt(l, 'hero');
  return l && art ? (
    <img className="k-cover" src={art} alt={pick(l.texts).value.hero?.art ?? ''} loading="lazy" width={640} height={360} />
  ) : (
    <span className="k-cover k-cover-he he" aria-hidden="true">
      {he}
    </span>
  );
}

/**
 * The path of a lesson inside the main card: a circle per riddle (solved — ✓, the next — «сейчас», links to the riddle),
 * then the certificate of the Academy; a lesson with Memo — «Потом — Memo-игра».
 */
function LessonPath({ lesson: l, done }: { lesson: Lesson; done: number }) {
  const { t } = useI18n();
  const total = l.riddles.length;
  return (
    <div className="k-path">
      <ol aria-label={t('home.path')}>
        {l.riddles.map((_, k) => {
          const state = k < done ? 'done' : k === done ? 'now' : 'next';
          const label = t('home.riddle', { n: k + 1, total });
          return (
            <Fragment key={k}>
              {k > 0 && <li className={`k-path-line${k <= done ? ' on' : ''}`} aria-hidden="true" />}
              <li className={`k-step ${state}`}>
                {state === 'next' ? (
                  <span aria-label={label}>{k + 1}</span>
                ) : (
                  <a href={`#/${l.slug}/r/${k + 1}`} aria-label={state === 'done' ? `${label} ✓` : label} aria-current={state === 'now' ? 'step' : undefined}>
                    {state === 'done' ? <Icon name="check" size={18} /> : k + 1}
                  </a>
                )}
              </li>
            </Fragment>
          );
        })}
        <li className={`k-path-line${done >= total ? ' on' : ''}`} aria-hidden="true" />
        <li className="k-step k-cert">
          <a href="#/academy" aria-label={t('academy.title')} title={t('academy.title')}>
            <Icon name="award" size={20} />
          </a>
        </li>
      </ol>
      {l.memo && (
        <a className="k-path-memo" href={`#/${l.slug}/memo`}>
          {t('home.pathMemo')} →
        </a>
      )}
    </div>
  );
}

/** A lesson of the week (besides the main one): its cover, teacher and age, title and games. */
function LessonTile({ lesson: l }: { lesson: Lesson }) {
  const { t, pick } = useI18n();
  const who = teacherOf(l);
  const done = lessonProgress(l.slug, l.legacyStorageKey);
  return (
    <a className={`k-tile t-${TEACHERS[who].color}`} href={`#/${l.slug}${cardsOnly(l) ? '/cards' : ''}`}>
      <Cover lesson={l} he={l.hebrewTitle} />
      <span className="k-tile-body">
        <span className="k-tile-k">
          {t(`teacher.${who}.short`)} · {t('age.short', { n: l.age })}
          {!cardsOnly(l) && done > 0 && ` · ${t('catalog.progress', { done, total: l.riddles.length })}`}
        </span>
        <span className="k-tile-title">{pick(l.texts).value.title}</span>
        <span className="k-tile-sub">{gamesLine(l, t)}</span>
      </span>
    </a>
  );
}

/** An earlier portion: the picture of one of its lessons, its name, its teachers; opens its first lesson. */
function PastTile({ group: g }: { group: (typeof LESSON_GROUPS)[number] }) {
  const { t, locale } = useI18n();
  const all = [...g.lessons, ...g.rebbe];
  const first = all[0];
  const withArt = all.find((l) => lessonArt(l, 'hero'));
  const teachers = [...new Set(all.map((l) => t(`teacher.${teacherOf(l)}.short`)))].join(' · ');
  return (
    <a className="k-tile t-gold" href={`#/${first.slug}${cardsOnly(first) ? '/cards' : ''}`}>
      <Cover lesson={withArt} he={g.he} />
      <span className="k-tile-body">
        <span className="k-tile-k">{t('home.pastOne')}</span>
        <span className="k-tile-title">
          {g.name[locale as keyof typeof g.name] ?? g.name.ru}{' '}
          <span className="he">{g.he}</span>
        </span>
        <span className="k-tile-sub">{teachers}</span>
      </span>
    </a>
  );
}

/**
 * The children's and families' home (the design «Нифлаот — новая главная»): warm, with pictures. On top — the week's
 * portion and one big card: the lesson to start or continue, a real «▶ Начать» button and the path of its riddles up to
 * the Academy; beside it — the streak, «Гематрия дня», the week's countdown and «Нифлаот на телефоне»; below — the
 * other lessons of the week and the earlier portions, with the lessons' pictures.
 */
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
  const nextTitle = pick(next.texts).value.title;
  const nextGroup = LESSON_GROUPS.find((g) => g.id === next.parsha);
  const others = lessons.filter((l) => l !== next);
  const past = LESSON_GROUPS.filter((g) => g !== week).reverse();
  const weekName = week.name[locale as keyof typeof week.name] ?? week.name.ru;

  return (
    <>
      <TopBar title={t('app.title')} wide />
      <main className="k-home">
        <div className="k-head">
          <span className="k-week">
            {t('home.week')} · {weekName} <span className="he">{week.he}</span>
          </span>
          <h1>{t('catalog.uvp')}</h1>
        </div>

        <div className="k-top">
          {/* the one main action of the screen: the lesson, «▶ Начать», and the path of its riddles */}
          <section className={`k-go t-${TEACHERS[nextWho].color}`} aria-labelledby="k-go-title">
            <span className="k-go-he he" aria-hidden="true">
              {nextGroup?.he ?? next.hebrewTitle}
            </span>
            <span className="k-go-lbl">
              {/* the teacher, unless the title already names him («Бааль ґа-Турим: Лех леха») */}
              {!nextTitle.includes(t(`teacher.${nextWho}.short`)) && `${t(`teacher.${nextWho}.short`)} · `}
              {t(next.kind === 'sicha' ? 'cards.tabLesson' : 'memo.tabGematria')} · {t('age.short', { n: next.age })}
            </span>
            <h2 id="k-go-title" className="k-go-title">
              {nextTitle}
            </h2>
            <LessonPath lesson={next} done={nextDone} />
            <span className="k-go-row">
              <a className="k-go-btn" href={`#/${next.slug}`}>
                ▶ {t(started ? 'home.continue' : 'home.start')}
              </a>
              <span className="k-go-n">{t('home.riddle', { n: Math.min(nextDone + 1, next.riddles.length), total: next.riddles.length })}</span>
            </span>
          </section>

          <div className="k-side">
            <HabitCard compact />
            <DailyLink />
            <WeekCountdown />
            <PhoneOffer />
          </div>
        </div>

        {others.length > 0 && (
          <section className="k-sec" aria-labelledby="k-more">
            <h2 id="k-more">{t('home.moreWeek')}</h2>
            <div className="k-tiles">
              {others.map((l) => (
                <LessonTile key={l.slug} lesson={l} />
              ))}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section className="k-sec" aria-labelledby="k-past">
            <h2 id="k-past">{t('home.past')}</h2>
            <div className="k-tiles">
              {past.map((g) => (
                <PastTile key={g.id} group={g} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Colophon />
    </>
  );
}
