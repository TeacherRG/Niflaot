import { Fragment, Suspense, lazy, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Html, useI18n } from '../i18n';
import { LESSON_GROUPS, findLesson, weekParsha } from '../lessons';
import { teacherOf } from '../lessons/teachers';
import { useMode } from '../core/mode';
import { VALUES } from '../core/gematria';
import { OPS, SIGN } from '../core/mentalMath';
import { Icon, Sheet, useUI } from './ui';
import { lessonGames } from './lessonGames';
import { DailyReminder } from './DailyReminder';
import { canInstall, install, subscribeInstall } from '../core/install';
import { useToday } from '../core/useToday';

/** Gematria step by step, sources and FAQ (with all the primary sources) load when «Как играть» opens. */
const HelperContent = lazy(() => import('./Helper').then((m) => ({ default: m.HelperContent })));
import { HEBREW_LEVELS, savedHebrewLevel, setHebrewLevel, useHebrewLevel } from '../core/hebrewLevel';
import { letterName } from '../core/letterNames';

const TABLE = Object.entries(VALUES).filter(([c]) => !'ךםןףץ'.includes(c));

/**
 * «Как вы с ивритом?» — at the top of «Как играть» (first asked in the onboarding, ModePicker.tsx): the answer sets how much
 * help the letters get (src/core/hebrewLevel.ts). Before an answer no option is marked (the default is «Узнаю буквы»).
 */
function HebrewLevelPicker({ onStart }: { onStart: () => void }) {
  const { t } = useI18n();
  const level = useHebrewLevel();
  const answered = savedHebrewLevel() !== null;
  return (
    <section className="hb-level" aria-labelledby="hb-q">
      <h3 id="hb-q" className="sheet-h3">
        {t('hebrew.q')}
      </h3>
      <div className="hb-opts" role="radiogroup" aria-labelledby="hb-q">
        {HEBREW_LEVELS.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={answered && level === l}
            className={`hb-opt${answered && level === l ? ' on' : ''}`}
            onClick={() => setHebrewLevel(l)}
          >
            <b>{t(`hebrew.${l}`)}</b>
            <small>{t(`hebrew.${l}.sub`)}</small>
          </button>
        ))}
      </div>
      {answered && level === 'none' && (
        <a className="btn hb-cta" href="#/letters" onClick={onStart}>
          <span className="he">אבג</span> · {t('abc.cta')} →
        </a>
      )}
      <p className="sheet-note">{t('hebrew.note')}</p>
    </section>
  );
}

type Group = (typeof LESSON_GROUPS)[number];
/** The lessons of a portion to read (adults): Baal HaTurim's «Читать», the Rebbe's «Прочитать». */
const readsOf = (g: Group) => [...g.lessons, ...g.rebbe];

/**
 * The portions of «Тора» in the menu: a strip scrolled sideways (Torah order, the newest on the right), ‹ › — one back /
 * forward. The chosen one is in view when the menu opens; its lessons are shown under the strip.
 */
function ParshaPicker({ groups, selected, week, onPick }: { groups: Group[]; selected?: Group; week?: string; onPick: (id: string) => void }) {
  const { t, locale } = useI18n();
  const strip = useRef<HTMLDivElement>(null);
  const at = groups.findIndex((g) => g.id === selected?.id);
  useEffect(() => {
    const el = strip.current?.querySelector<HTMLElement>('[aria-pressed="true"]');
    const box = strip.current;
    if (el && box) box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2, behavior: 'smooth' });
  }, [selected?.id]);
  if (groups.length < 2) return null;
  const go = (d: number) => groups[at + d] && onPick(groups[at + d].id);
  return (
    <div className="parsha-pick">
      <button type="button" className="parsha-arrow" onClick={() => go(-1)} disabled={at <= 0} aria-label={t('menu.parshaPrev')}>
        ‹
      </button>
      <div className="parsha-strip" ref={strip} role="group" aria-label={t('menu.parshaPick')}>
        {groups.map((g) => (
          <button
            key={g.id}
            type="button"
            className={`parsha-chip${g.id === week ? ' week' : ''}`}
            aria-pressed={g.id === selected?.id}
            onClick={() => onPick(g.id)}
          >
            <b>{g.name[locale as keyof typeof g.name] ?? g.name.ru}</b>
            <small>{g.id === week ? t('menu.thisWeek') : <span lang="he">{g.he}</span>}</small>
          </button>
        ))}
      </div>
      <button type="button" className="parsha-arrow" onClick={() => go(1)} disabled={at >= groups.length - 1} aria-label={t('menu.parshaNext')}>
        ›
      </button>
    </div>
  );
}

/**
 * «Учить сегодня» — the adults' daily study at the top of the menu (src/core/todayStudy.ts): the passages of the day of the
 * Prophets and Writings, Chassidut and «Мои слова», each with today's books / title and ✓ when done. The data loads when the
 * menu opens (not in the main bundle); «Вопросы к отрывку» are under the passage itself.
 */
function TodayStudy({ active, onPick }: { active: boolean; onPick: () => void }) {
  const { t, locale } = useI18n();
  const d = useToday(locale, active);
  const here = (href: string) => location.hash.split('?')[0].startsWith(href) && !location.hash.split('?')[0].endsWith('/quiz');
  const row = (href: string, title: string, sub: string, done = false, icon: 'book' | 'cards' = 'book') => (
    <a href={href} onClick={onPick} className={`menu-item${done ? ' menu-done' : ''}`} aria-current={here(href) ? 'page' : undefined}>
      <Icon name={done ? 'check' : icon} />
      <span>
        {title}
        <small>
          {done && <span className="sr-only">{t('menu.doneToday')} · </span>}
          {sub}
        </small>
      </span>
    </a>
  );
  const w = d?.words;
  return (
    <>
      <div className="menu-lbl">{t('menu.today')}</div>
      {row('#/neviim', t('tanakh.neviim'), d?.neviim.range ?? t('tanakh.daySub'), d?.neviim.done)}
      {row('#/ketuvim', t('tanakh.ketuvim'), d?.ketuvim.range ?? t('tanakh.daySub'), d?.ketuvim.done)}
      {row('#/hemshech', t('hs.menuLbl'), d && 'title' in d.hs ? d.hs.title : t('hs.short'), !!d && 'title' in d.hs && d.hs.done)}
      {row('#/words', t('words.mine'), w?.any ? (w.due ? t('words.homeSub', { d: w.due, k: w.known }) : t('words.homeSubDone', { k: w.known })) : t('words.menuSub'), !!w?.any && !w.due, 'cards')}
    </>
  );
}

/** Side menu + "How to play" + "About" — rendered once at the app root. */
export function Panels() {
  const { t, pick, locale } = useI18n();
  const { panel, open, lessonSlug } = useUI();
  const level = useHebrewLevel();
  const installable = useSyncExternalStore(subscribeInstall, canInstall, () => false);
  const mode = useMode();
  const close = () => open(null);
  // the page a menu link points to is open (#/<slug> or #/<slug>/memo, #/<slug>/cards)
  const isHere = (href: string) => location.hash.split('?')[0] === href;
  // all groups start folded; only the one holding the open page (lesson, «Нифлаот Ребе», math) is unfolded
  const isLearn = location.hash.startsWith('#/math') || location.hash === '#/letters';
  const currentParsha = lessonSlug ? findLesson(lessonSlug)?.parsha : location.hash.match(/^#\/rebbe\/([^/?]+)/)?.[1];
  // «Тора»: one portion at a time — the open page's, else the week's; the others — in the strip of portions above it
  const week = weekParsha();
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => {
    if (panel === 'menu') setPicked(null);
  }, [panel]);
  const choose = <G extends { id: string }>(gs: G[]) =>
    gs.find((g) => g.id === picked) ?? gs.find((g) => g.id === currentParsha) ?? gs.find((g) => g.id === week) ?? gs[gs.length - 1];
  const kidsSel = choose(LESSON_GROUPS);
  const readGroups = LESSON_GROUPS.filter((g) => readsOf(g).length);
  const adultsSel = choose(readGroups);

  // in both modes, after the mode's own study: «Знаете ли вы?», «Викторина вместе», «К шабатнему столу», «Академия»
  const facts = (
    <a href="#/facts" onClick={close} className="menu-item" aria-current={location.hash === '#/facts' || location.hash === '#/daily' ? 'page' : undefined}>
      <Icon name="hash" />
      <span>
        {t('facts.title')}
        <small>{t('facts.menuSub')}</small>
      </span>
    </a>
  );
  /* «Викторина вместе»: a live quiz for a class or a family — the host's big screen, the players' phones */
  const quiz = (
    <a href="#/quiz" onClick={close} className="menu-item" aria-current={location.hash.startsWith('#/quiz') ? 'page' : undefined}>
      <Icon name="phone" />
      <span>
        {t('lq.title')}
        <small>{t('lq.menuSub')}</small>
      </span>
    </a>
  );
  /* «К шабатнему столу»: the Friday sheet of the week's portion to print (ShabbatTable.tsx) */
  const table = (
    <a href="#/shabbat-table" onClick={close} className="menu-item" aria-current={location.hash.startsWith('#/shabbat-table') ? 'page' : undefined}>
      <Icon name="print" />
      <span>
        {t('table.title')}
        <small>{t('table.menuSub')}</small>
      </span>
    </a>
  );
  /* «Святая музыка»: the niggunim with karaoke (NigunPage.tsx) */
  const nigun = (
    <a href="#/nigun" onClick={close} className="menu-item" aria-current={location.hash.startsWith('#/nigun') ? 'page' : undefined}>
      <span className="menu-num">♪</span>
      <span>
        {t('nigun.title')}
        <small>{t('nigun.menuSub')}</small>
      </span>
    </a>
  );
  const academy = (
    <a href="#/academy" onClick={close} className="menu-item" aria-current={location.hash.startsWith('#/academy') ? 'page' : undefined}>
      <Icon name="award" />
      <span>
        {t('academy.title')}
        <small>{t('academy.menuSub')}</small>
      </span>
    </a>
  );

  return (
    <>
      <Sheet variant="drawer" open={panel === 'menu'} onClose={close} title={t('app.title')} closeLabel={t('menu.close')}>
        <nav className="menu">
          <a href="#/" onClick={close} className="menu-item" aria-current={!location.hash || location.hash === '#/' ? 'page' : undefined}>
            <Icon name="home" />
            <span>{t('menu.home')}</span>
          </a>
{mode === 'kids' ? (
            <>
          <div className="menu-lbl">{t('menu.lessons')}</div>
          <ParshaPicker groups={LESSON_GROUPS} selected={kidsSel} week={week} onPick={setPicked} />
          {[kidsSel].filter((g) => g).map((g) => (
            <div key={g.id} className="menu-parsha">
              <div className="menu-sub">
                {g.lessons.map((l) => {
                  const games = lessonGames(l);
                  return (
                    <div key={l.slug} className="menu-lesson">
                      <a
                        href={`#/${l.slug}`}
                        onClick={close}
                        className="menu-item"
                        aria-current={l.slug === lessonSlug && !games ? 'page' : undefined}
                      >
                        <span className="menu-num">{l.number}</span>
                        <span>
                          {pick(l.texts).value.title}
                          <small lang="he">{l.hebrewTitle}</small>
                        </span>
                      </a>
                      {/* a lesson with two games (Baal HaTurim: gematria and Memo): both right under it */}
                      {games?.map((game) => (
                        <a
                          key={game.href}
                          href={game.href}
                          onClick={close}
                          className="menu-item menu-game"
                          aria-current={isHere(game.href) ? 'page' : undefined}
                        >
                          <span className="menu-num">{game.icon}</span>
                          <span>{t(game.label)}</span>
                        </a>
                      ))}
                    </div>
                  );
                })}
                {/* «Нифлаот Ребе» only when the portion has its lessons — no menu item to an empty «готовятся» page */}
                {g.rebbe.length > 0 && (
                  <a
                    href={`#/rebbe/${g.id}`}
                    onClick={close}
                    className="menu-item"
                    aria-current={location.hash === `#/rebbe/${g.id}` ? 'page' : undefined}
                  >
                    <span className="menu-num">✦</span>
                    <span>{t('rebbe.title')}</span>
                  </a>
                )}
                {/* «Нифлаот Ребе»: the investigation (named by the lesson's title) and its cards, right under the section */}
                {g.rebbe.flatMap((l) =>
                  (lessonGames(l) ?? []).map((game, k) => (
                    <a
                      key={game.href}
                      href={game.href}
                      onClick={close}
                      className="menu-item menu-game"
                      aria-current={isHere(game.href) ? 'page' : undefined}
                    >
                      <span className="menu-num">{game.icon}</span>
                      {k === 0 ? (
                        <span>
                          {pick(l.texts).value.title}
                          <small lang="he">{l.hebrewTitle}</small>
                        </span>
                      ) : (
                        <span>{t(game.label)}</span>
                      )}
                    </a>
                  )),
                )}
              </div>
            </div>
          ))}
          {lessonSlug && (
            <a href={`#/${lessonSlug}/print`} onClick={close} className="menu-item">
              <Icon name="print" />
              <span>{t('print.button')}</span>
            </a>
          )}
          {/* «Слова Торы»: a game with the words of the lessons — the Memo pictures and the riddle cards (src/core/torahWords.ts) */}
          <a href="#/torah-words" onClick={close} className="menu-item" aria-current={location.hash.startsWith('#/torah-words') ? 'page' : undefined}>
            <Icon name="cards" />
            <span>
              {t('tw.title')}
              <small>{t('tw.menuSub')}</small>
            </span>
          </a>
          {facts}
          {quiz}
          {table}
          {nigun}
          {academy}
          {/* how to play, my Hebrew, letters and mental math: one group */}
          <details className="menu-group" open={isLearn}>
            <summary className="menu-item">
              <Icon name="help" />
              <span>{t('menu.learn')}</span>
            </summary>
            <div className="menu-sub">
              <button className="menu-item" onClick={() => open('help')}>
                <span className="menu-num">?</span>
                <span>{t('help.title')}</span>
              </button>
              <button className="menu-item" onClick={() => open('help')}>
                <span className="menu-num he">א</span>
                <span>
                  {t('hebrew.menu')}
                  <small>{t(`hebrew.${level}`)}</small>
                </span>
              </button>
              <a href="#/letters" onClick={close} className="menu-item" aria-current={location.hash === '#/letters' ? 'page' : undefined}>
                <span className="menu-num he">ב</span>
                <span>
                  {t('abc.title')}
                  <small>{t('abc.menuSub')}</small>
                </span>
              </a>
              <details className="menu-group" open={location.hash.startsWith('#/math')}>
                <summary className="menu-item">
                  <span className="menu-num">±</span>
                  <span>{t('math.title')}</span>
                </summary>
                <div className="menu-sub">
                  {OPS.map((o) => (
                    <a
                      key={o}
                      href={`#/math/${o}`}
                      onClick={close}
                      className="menu-item"
                      aria-current={location.hash === `#/math/${o}` ? 'page' : undefined}
                    >
                      <span className="menu-num">{SIGN[o]}</span>
                      <span>{t(`math.op.${o}`)}</span>
                    </a>
                  ))}
                </div>
              </details>
            </div>
          </details>
            </>
          ) : (
            <>
          {/* the daily study first: the passages of the day, Chassidut and the words, with today's ✓ */}
          <TodayStudy active={panel === 'menu'} onPick={close} />
          {/* the Torah lessons to read — Baal HaTurim's «Читать», the Rebbe's «Прочитать»; the open (or the week's) portion, the others in the strip */}
          <div className="menu-lbl">{t('menu.lessons')}</div>
          <ParshaPicker groups={readGroups} selected={adultsSel} week={week} onPick={setPicked} />
          {[adultsSel].filter((g) => g).map((g) => {
            const reads = readsOf(g);
            return (
              <div key={g.id} className="menu-parsha">
                <div className="menu-sub">
                  {reads.map((l) => (
                    <Fragment key={l.slug}>
                      <a
                        href={`#/${l.slug}/read`}
                        onClick={close}
                        className="menu-item menu-game"
                        aria-current={isHere(`#/${l.slug}/read`) ? 'page' : undefined}
                      >
                        <span>
                          {pick(l.texts).value.title}
                          {/* the teacher, unless the title already names him («Бааль ґа-Турим: Ноах») */}
                          {!pick(l.texts).value.title.includes(t(`teacher.${teacherOf(l)}.short`)) && <small>{t(`teacher.${teacherOf(l)}.short`)}</small>}
                        </span>
                      </a>
                      {/* Baal HaTurim's Memo pairs to study (picture — the words of the Torah — the comment); the Rebbe's cards are a tab of «Прочитать» */}
                      {l.memo && (
                        <a
                          href={`#/${l.slug}/memo/1`}
                          onClick={close}
                          className="menu-item menu-game menu-memo"
                          aria-current={isHere(`#/${l.slug}/memo`) ? 'page' : undefined}
                        >
                          <span>
                            {t('read.memoMenu')}
                            <small>{t('read.memoMenuSub', { n: l.memo.items.length })}</small>
                          </span>
                        </a>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            );
          })}
          {facts}
          {quiz}
          {table}
          {nigun}
          {academy}
            </>
          )}
          <div className="menu-sep" />
          {installable && (
            <button
              className="menu-item"
              onClick={() => {
                close();
                install();
              }}
            >
              <Icon name="phone" />
              <span>
                {t('install.button')}
                <small>{t('install.sub')}</small>
              </span>
            </button>
          )}
          <a href="#/teacher" onClick={close} className="menu-item" aria-current={location.hash === '#/teacher' ? 'page' : undefined}>
            <Icon name="user" />
            <span>{t('teacher.title')}</span>
          </a>
          <a href="#/partners" onClick={close} className="menu-item" aria-current={location.hash === '#/partners' ? 'page' : undefined}>
            <Icon name="heart" />
            <span>{t('partners.title')}</span>
          </a>
          <button className="menu-item" onClick={() => open('about')}>
            <Icon name="info" />
            <span>{t('about.title')}</span>
          </button>
          <div className="menu-sep" />
          <a className="menu-item" href="https://mychitas.app/donate" target="_blank" rel="noopener">
            <Icon name="heart" />
            <span>{t('footer.donate')}</span>
          </a>
          <a className="menu-item" href="mailto:Office@mychitas.app">
            <Icon name="mail" />
            <span>{t('footer.contact')}</span>
          </a>
        </nav>
      </Sheet>

      <Sheet open={panel === 'help'} onClose={close} title={t('help.title')} closeLabel={t('menu.close')}>
        <HebrewLevelPicker onStart={close} />
        <Html as="div" className="prose" html={t('help.body')} />
        <h3 className="sheet-h3">{t('help.scoring')}</h3>
        <ul className="score-list">
          {(['rules.first', 'rules.next', 'rules.hint', 'rules.limit', 'rules.lesson'] as const).map((k) => (
            <Html as="li" key={k} html={t(k)} />
          ))}
        </ul>
        <h3 className="sheet-h3">{t('help.table')}</h3>
        <div className="gtable" dir="rtl">
          {TABLE.map(([c, v]) => (
            <span key={c}>
              <b>{c}</b>
              <i>{v}</i>
              {level !== 'reads' && <small className="ln">{letterName(c, locale)}</small>}
            </span>
          ))}
        </div>
        <p className="sheet-note">{t('help.finals')}</p>
        <p className="sheet-note">
          <a href="#/letters" onClick={close}>
            <span className="he">אבג</span> · {t('abc.title')} →
          </a>
        </p>
        <p className="sheet-note">{t('help.names')}</p>
        <h3 className="sheet-h3">{t('help.more')}</h3>
        {panel === 'help' && (
          <Suspense fallback={null}>
            <HelperContent inHelp />
          </Suspense>
        )}
        <button className="btn sheet-cta" data-autofocus onClick={close}>
          {t('help.go')}
        </button>
      </Sheet>

      <Sheet open={panel === 'reminder'} onClose={close} title={t('push.title')} closeLabel={t('menu.close')}>
        {panel === 'reminder' && <DailyReminder sheet />}
      </Sheet>

      <Sheet open={panel === 'about'} onClose={close} title={t('about.title')} closeLabel={t('menu.close')}>
        <div className="about-mark he">נפלאות</div>
        <Html as="div" className="prose" html={t('about.body')} />
        <Html as="p" className="prose" html={t('about.partners')} />
        <div className="about-links">
          <a className="btn" href="https://mychitas.app/donate" target="_blank" rel="noopener">
            {t('footer.donate')}
          </a>
          <a className="btn ghost" href="mailto:Office@mychitas.app">
            Office@mychitas.app
          </a>
        </div>
      </Sheet>
    </>
  );
}
