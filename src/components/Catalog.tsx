import { Fragment, useEffect, useMemo } from 'react';
import { useI18n } from '../i18n';
import { Slogan } from './Slogan';
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
import { useMode } from '../core/mode';
import { CoursesCard } from './CoursesCard';
import { Dedication } from './Dedication';
import { ShabbatCalendar } from './ShabbatCalendar';
import { NUMS, collectFacts, type Fact } from '../core/facts';
import { displayNames } from '../core/names';

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
 * «К шабатнему столу»: the Friday sheet of the week's portion, to print before Shabbat; under it, in the same card,
 * «Неделя в Академии» — the digest of the week (WeekDigest.tsx), the rest of what was learnt.
 */
function TableLink() {
  const { t } = useI18n();
  return (
    <div className="h-daily h-table">
      <a href="#/shabbat-table">
        <span className="h-daily-title">🖨 {t('table.title')}</span>
        <span className="h-daily-sub">{t('table.homeSub')} →</span>
      </a>
      <a className="h-digest" href="#/digest">
        {t('digest.title')} →
      </a>
    </div>
  );
}

/**
 * The adults' home («Подростки и взрослые», src/core/mode.ts): four tiles and nothing else (owner, 28.10.2026: «убрать все лишние
 * тексты и повторяющиеся ссылки») — «Сегодня — глава» (the week's portion, opens its first lesson to read), «Мои курсы» (only the
 * names of the chosen courses with their bars — CoursesCard `simple`), «Беглое чтение Теґилим» (#/reading) and the running feed
 * of the lessons' gematria (the calendar moved to the top bar — HebrewDay.tsx); under them — the dedication of the week.
 * It all fits one screen, with no scrolling (owner).
 */
function AdultsHome() {
  const { t, locale } = useI18n();
  useEffect(() => {
    document.title = `${t('home.adultsH1')} · ${t('app.title')} · MyChitas`;
  }, [t]);
  const week = LESSON_GROUPS[LESSON_GROUPS.length - 1];
  const reads = [...week.lessons, ...week.rebbe];
  const art = reads.map((l) => lessonArt(l, 'hero')).find(Boolean);

  return (
    <>
      <TopBar title={t('app.title')} wide />
      <main className="a-home">
        <h1 className="sr-only">{t('home.adultsH1')}</h1>
        <div className="a-tiles">
          {reads.length > 0 && (
            <a className={`a-tile a-parsha${art ? ' a-art' : ''}`} href={`#/${reads[0].slug}/read`} style={art ? { backgroundImage: `url(${art})` } : undefined}>
              <span className="a-tile-k">{t('home.todayParsha')}</span>
              <span className="a-tile-t">{week.name[locale as keyof typeof week.name] ?? week.name.ru}</span>
              <span className="a-tile-he he">{week.he}</span>
            </a>
          )}
          <a className="a-tile a-reading" href="#/reading">
            <span className="a-tile-k">{t('reading.title')}</span>
            <span className="a-tile-t">{t('reading.h1')}</span>
            <span className="a-tile-he he">תְּהִלִּים</span>
          </a>
          <CoursesCard simple />
          <GematriaTicker />
        </div>
        <Dedication />
      </main>
      <Colophon />
    </>
  );
}

/**
 * «Гематрии» on the adults' home: every equality of the lessons («פרצוף + גאוה = 471 = זנב + תאוה», src/core/facts.ts)
 * running slowly upwards in a closed loop (the list twice, the animation moves it by one list); a tap opens it in
 * «Знаете ли вы?» (#/facts/<id>); it stops under the mouse or focus; «reduce motion» — a still list to scroll.
 */
function GematriaTicker() {
  const { t } = useI18n();
  const facts = useMemo(() => collectFacts(LESSONS).filter((f): f is Extract<Fact, { kind: 'eq' }> => f.kind === 'eq'), []);
  if (!facts.length) return null;
  const row = (f: Extract<Fact, { kind: 'eq' }>, copy: boolean) => (
    <li key={`${copy ? 'b' : 'a'}${f.id}`} aria-hidden={copy || undefined}>
      <a href={`#/facts/${f.id}`} tabIndex={copy ? -1 : undefined} dir="rtl">
        {[f.q, ...f.rest].map((p, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="a-tick-eq"> = </span>}
            {NUMS.test(p) ? <b className="a-tick-n">{p}</b> : <span className="he">{displayNames(p)}</span>}
          </Fragment>
        ))}
      </a>
    </li>
  );
  return (
    <section className="a-tick" aria-labelledby="a-tick-h">
      <h2 id="a-tick-h">
        <a href="#/facts">{t('home.gematria')}</a>
      </h2>
      <div className="a-tick-win">
        <ul style={{ animationDuration: `${facts.length * 3.5}s` }}>
          {facts.map((f) => row(f, false))}
          {facts.map((f) => row(f, true))}
        </ul>
      </div>
    </section>
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
 * the Academy; beside it — the streak, «Гематрия дня», the week's countdown and «Нифлаот на телефоне»; below — one row
 * of tiles: the other lessons of the week, then the earlier portions, with the lessons' pictures. On a phone it all fits
 * one screen above the tab bar.
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
          <p className="k-tag">
            <Slogan />
          </p>
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
            <CoursesCard />
            <DailyLink />
            <TableLink />
            <ShabbatCalendar />
            <WeekCountdown />
            <PhoneOffer />
          </div>
        </div>

        {/* one row of tiles: the week's other lessons, then the earlier portions (each tile says «Прошлая глава») */}
        {others.length + past.length > 0 && (
          <section className="k-sec" aria-labelledby="k-more">
            <h2 id="k-more">{t(others.length ? 'home.moreWeek' : 'home.past')}</h2>
            <div className="k-tiles">
              {others.map((l) => (
                <LessonTile key={l.slug} lesson={l} />
              ))}
              {past.map((g) => (
                <PastTile key={g.id} group={g} />
              ))}
            </div>
          </section>
        )}
        <Dedication />
      </main>
      <Colophon />
    </>
  );
}
