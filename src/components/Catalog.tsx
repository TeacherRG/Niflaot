import { Fragment, useEffect } from 'react';
import { useI18n } from '../i18n';
import { Slogan } from './Slogan';
import { LESSONS, LESSON_GROUPS, cardsOnly, type Lesson } from '../lessons';
import { TEACHERS, teacherOf } from '../lessons/teachers';
import { lessonProgress } from '../core/progress';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { WeekCountdown } from './WeekCountdown';
import { PhoneOffer } from './PhoneOffer';
import { HabitCard, Repair } from './HabitCard';
import { useHabit } from '../core/habit';
import { useToday } from '../core/useToday';
import { todayCount } from '../core/todayStudy';
import { jewishDate } from '../core/hebrewDate';
import { dailyNumber, grid, loadResults, streak } from '../core/daily';
import { Icon } from './ui';
import { lessonGames } from './lessonGames';
import { lessonArt } from '../core/art';
import { useMode } from '../core/mode';

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

/** «К шабатнему столу»: the Friday sheet of the week's portion, to print before Shabbat. */
function TableLink() {
  const { t } = useI18n();
  return (
    <a className="h-daily h-table" href="#/shabbat-table">
      <span className="h-daily-title">🖨 {t('table.title')}</span>
      <span className="h-daily-sub">{t('table.homeSub')} →</span>
    </a>
  );
}

/** A row of the plan of the day: the circle (✓ when done), the section, today's books / title, and «Читать» on the first one to do. */
function PlanRow({ href, title, sub, done, go, he }: { href: string; title: string; sub: string; done: boolean; go?: string; he?: string }) {
  const { t } = useI18n();
  return (
    <li>
      <a className={`a-row${done ? ' done' : ''}`} href={href}>
        <span className="a-check" aria-hidden="true">
          {done && <Icon name="check" size={16} />}
        </span>
        <span className="a-row-t">
          {title}
          {done && <span className="sr-only"> · {t('menu.doneToday')}</span>}
        </span>
        <span className="a-row-s">{sub}</span>
        {go ? (
          <span className="a-go">{go}</span>
        ) : (
          he && (
            <span className="a-row-he he" aria-hidden="true">
              {he}
            </span>
          )
        )}
      </a>
    </li>
  );
}

/**
 * The adults' home («Подростки и взрослые», src/core/mode.ts; the design «Нифлаот — новая главная»): bookish and quiet.
 * «Сегодня» — the date and the plan of the day as one list (src/core/todayStudy.ts): the Prophets, the Writings, Chassidut,
 * «Мои слова», each with ✓, «N из M сделано» and the streak; the first thing to do has «Читать». Beside it — the week's
 * Torah lessons to read, the next certificate of the Academy, «Знаете ли вы?» and «Викторина вместе». No games or ages.
 */
function AdultsHome() {
  const { t, pick, locale } = useI18n();
  useEffect(() => {
    document.title = `${t('home.adultsH1')} · ${t('app.title')} · MyChitas`;
  }, [t]);
  const h = useHabit();
  const d = useToday(locale);
  const week = LESSON_GROUPS[LESSON_GROUPS.length - 1];
  const reads = [...week.lessons, ...week.rebbe];
  const now = new Date();
  const iso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const civil = now.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  const count = d && todayCount(d);
  const min = (n?: number) => (n ? ` · ${t('tanakh.readingTime', { n })}` : '');

  // the plan of the day; the first one not done gets «Читать» (words — «Учить» / «Повторить»)
  const rows = d
    ? [
        { href: '#/neviim', title: t('tanakh.neviim'), sub: d.neviim.range + min(d.neviim.min), done: d.neviim.done, he: 'נביאים', go: t('read.tab') },
        { href: '#/ketuvim', title: t('tanakh.ketuvim'), sub: d.ketuvim.range + min(d.ketuvim.min), done: d.ketuvim.done, he: 'כתובים', go: t('read.tab') },
        'title' in d.hs
          ? { href: '#/hemshech', title: t('hs.menuLbl'), sub: d.hs.title + min(d.hs.min), done: d.hs.done, go: t('read.tab') }
          : { href: '#/hemshech', title: t('hs.menuLbl'), sub: t('hs.startsOn', { date: d.hs.starts }), done: false },
        {
          href: '#/words',
          title: t('words.mine'),
          sub: d.words.any ? (d.words.due ? t('words.homeSub', { d: d.words.due, k: d.words.known }) : t('words.homeSubDone', { k: d.words.known })) : t('words.homeStart'),
          done: d.words.any && !d.words.due,
          he: 'מִלִּים',
          go: t(d.words.due ? 'words.homeReview' : 'words.homeCta'),
        },
      ]
    : [];
  const first = rows.findIndex((r) => !r.done && r.go);

  return (
    <>
      <TopBar title={t('app.title')} wide />
      <main className="a-home">
        <section className="a-today" aria-labelledby="a-h1">
          <span className="a-date">
            {civil} · <span className="he">{jewishDate(iso)}</span>
          </span>
          <div className="a-head">
            <h1 id="a-h1">{t('tab.today')}</h1>
            {count && (
              <span className="a-count">
                <b>{t('home.todayCount', { n: count.done, total: count.total })}</b>
                {h.streak > 0 && ` · ${t('habit.streak', { n: h.streak })}`}
              </span>
            )}
          </div>
          <span className="a-bar" aria-hidden="true">
            <span style={{ width: count ? `${Math.round((count.done / count.total) * 100)}%` : 0 }} />
          </span>
          <ul className="a-plan">
            {rows.map((r, k) => (
              <PlanRow key={r.href} {...r} go={k === first ? r.go : undefined} />
            ))}
          </ul>
          {h.repair && <Repair day={h.repair.day} streak={h.repair.streak} pending={h.pending === h.repair.day} adults locale={locale} />}
          <p className="a-short">
            {t('habit.short')} <a href="#/daily">{t('habit.shortDaily')}</a>
          </p>
        </section>

        <aside className="a-side">
          {/* the motto «ושננתם לבניך»: the children learn the same portion in play — the Friday sheet brings it to the table */}
          <a className="a-tag" href="#/shabbat-table">
            <Slogan />
            <span>{t('home.adultsTag')} →</span>
          </a>
          {reads.length > 0 && (
            <section aria-labelledby="a-week">
              <h2 id="a-week">
                {t('home.week')} · {week.name[locale as keyof typeof week.name] ?? week.name.ru} <span className="he">{week.he}</span>
              </h2>
              <ul className="a-week">
                {reads.map((l) => {
                  const who = teacherOf(l);
                  return (
                    <li key={l.slug}>
                      <a className={`t-${TEACHERS[who].color}`} href={`#/${l.slug}/read`}>
                        <span className="a-week-k">{t(`teacher.${who}.short`)}</span>
                        <span className="a-week-t">{pick(l.texts).value.title} →</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          <a className="a-cert" href="#/academy">
            <span className="a-cert-k">
              {t('academy.title')} · {d?.book ? t('home.nextCert') : t('academy.menuSub')}
            </span>
            {d?.book && (
              <>
                <span className="a-cert-t">
                  {t('academy.master.tanakh')} {d.book.name}
                </span>
                <span className="a-bar" aria-hidden="true">
                  <span style={{ width: `${Math.round((d.book.done / d.book.parts) * 100)}%` }} />
                </span>
                <span className="a-cert-s">
                  {t('academy.readDays', { done: d.book.done, parts: d.book.parts, pct: Math.round((d.book.done / d.book.parts) * 100) })}
                </span>
              </>
            )}
          </a>
          <PhoneOffer />
          <p className="a-links">
            <a href="#/facts">{t('home.adultsFacts')} →</a>
            <a href="#/quiz">{t('lq.title')} →</a>
          </p>
        </aside>
      </main>
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
            <DailyLink />
            <TableLink />
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
