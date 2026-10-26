import { Suspense, lazy, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Html, useI18n } from '../i18n';
import { LESSON_GROUPS, findLesson, weekParsha, type Lesson } from '../lessons';
import { teacherOf } from '../lessons/teachers';
import { useMode } from '../core/mode';
import { useCourses } from '../core/courses';
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
 * The menu, by sections (both modes; a section holding the open page is unfolded):
 *  - «Хасидут» — «Сихот Ребе» (the «Нифлаот Ребе» lessons of a portion) and «Ґемшех Ребе Рашаба»;
 *  - «Танах» — «Тора с Бааль ґа-Турим» (the lessons of a portion), «Невиим», «Ктувим» (the passage of the day);
 *  - «Святой язык» — the course, the words («Слова Торы» / «Мои слова»), the letters; «Святая музыка»;
 *  - «Разное» — print, «К шабатнему столу», «Викторина вместе», «Знаете ли вы?»;
 * then «Помощь и навыки» (children), «Академия», «Учитель», «Партнёры», «О проекте». The lessons: the children's — the games
 * (and «Читать»), the adults' — «Читать» / «Прочитать» only. Today's passages (src/core/todayStudy.ts) show their verses and ✓
 * when done; the data loads when the menu opens.
 */
export function Panels() {
  const { t, pick, locale } = useI18n();
  const { panel, open, lessonSlug } = useUI();
  const level = useHebrewLevel();
  const installable = useSyncExternalStore(subscribeInstall, canInstall, () => false);
  const mode = useMode();
  const kids = mode === 'kids';
  const pace = useCourses(mode).pace;
  const today = useToday(locale, panel === 'menu', pace);
  // at one's own pace (src/core/courses.ts) — the first passage not read, on its own day
  const tk = (sec: 'neviim' | 'ketuvim') => (pace === 'own' && today ? `#/${sec}/${today[sec].date}` : `#/${sec}`);
  const close = () => open(null);
  const hash = location.hash.split('?')[0];
  // the page a menu link points to is open (#/<slug> or #/<slug>/memo, #/<slug>/cards)
  const isHere = (href: string) => hash === href;
  const starts = (...hs: string[]) => hs.some((h) => hash === h || hash.startsWith(`${h}/`));
  const lesson = lessonSlug ? findLesson(lessonSlug) : undefined;
  const isMath = hash.startsWith('#/math');
  const currentParsha = lesson?.parsha ?? hash.match(/^#\/rebbe\/([^/?]+)/)?.[1];
  // a portion at a time — the open page's, else the week's; the others — in the strip of portions above it
  const week = weekParsha();
  const [picked, setPicked] = useState<string | null>(null);
  useEffect(() => {
    if (panel === 'menu') setPicked(null);
  }, [panel]);
  const choose = <G extends { id: string }>(gs: G[]) =>
    gs.find((g) => g.id === picked) ?? gs.find((g) => g.id === currentParsha) ?? gs.find((g) => g.id === week) ?? gs[gs.length - 1];
  const rebbeGroups = LESSON_GROUPS.filter((g) => g.rebbe.length);
  const torahGroups = LESSON_GROUPS.filter((g) => g.lessons.length);
  const rebbeSel = choose(rebbeGroups);
  const torahSel = choose(torahGroups);
  const inRebbe = lesson?.series === 'rebbe' || starts('#/rebbe');
  const inTorah = !!lesson && lesson.series !== 'rebbe';

  const link = (href: string, icon: React.ReactNode, title: string, sub?: string, done = false) => (
    <a href={href} onClick={close} className={`menu-item${done ? ' menu-done' : ''}`} aria-current={starts(href) ? 'page' : undefined}>
      {done ? <Icon name="check" /> : icon}
      <span>
        {title}
        {sub && (
          <small>
            {done && <span className="sr-only">{t('menu.doneToday')} · </span>}
            {sub}
          </small>
        )}
      </span>
    </a>
  );
  const group = (icon: React.ReactNode, title: string, sub: string, on: boolean, body: React.ReactNode) => (
    <details className="menu-group" open={on}>
      <summary className="menu-item">
        {icon}
        <span>
          {title}
          <small>{sub}</small>
        </span>
      </summary>
      <div className="menu-sub">{body}</div>
    </details>
  );
  const num = (s: string, he = false) => <span className={`menu-num${he ? ' he' : ''}`}>{s}</span>;
  /** the adults: a lesson only to read — Baal HaTurim's «Читать», the Rebbe's «Прочитать» (the children's games include it) */
  const readLink = (l: Lesson) => (
    <a key={l.slug} href={`#/${l.slug}/read`} onClick={close} className="menu-item menu-game" aria-current={isHere(`#/${l.slug}/read`) ? 'page' : undefined}>
      <span>
        {pick(l.texts).value.title}
        {/* the teacher, unless the title already names him («Бааль ґа-Турим: Ноах») */}
        {!pick(l.texts).value.title.includes(t(`teacher.${teacherOf(l)}.short`)) && <small>{t(`teacher.${teacherOf(l)}.short`)}</small>}
      </span>
    </a>
  );
  const games = (l: Lesson, named: boolean) =>
    (lessonGames(l) ?? []).map((game, k) => (
      <a key={game.href} href={game.href} onClick={close} className="menu-item menu-game" aria-current={isHere(game.href) ? 'page' : undefined}>
        {num(game.icon)}
        {named && k === 0 ? (
          <span>
            {pick(l.texts).value.title}
            <small lang="he">{l.hebrewTitle}</small>
          </span>
        ) : (
          <span>{t(game.label)}</span>
        )}
      </a>
    ));

  /* «Сихот Ребе»: the «Нифлаот Ребе» lessons of a portion — the children's investigation and cards, the adults' «Прочитать» */
  const sichot = rebbeSel && (
    <>
      <ParshaPicker groups={rebbeGroups} selected={rebbeSel} week={week} onPick={setPicked} />
      {kids && link(`#/rebbe/${rebbeSel.id}`, num('✦'), t('rebbe.title'))}
      {kids ? rebbeSel.rebbe.flatMap((l) => games(l, true)) : rebbeSel.rebbe.map(readLink)}
    </>
  );
  /* «Тора с Бааль ґа-Турим»: the lessons of a portion — the children's games (gematria, Memo) right under the lesson */
  const torah = torahSel && (
    <>
      <ParshaPicker groups={torahGroups} selected={torahSel} week={week} onPick={setPicked} />
      {kids
        ? torahSel.lessons.map((l) => {
            const gs = lessonGames(l);
            return (
              <div key={l.slug} className="menu-lesson">
                <a href={`#/${l.slug}`} onClick={close} className="menu-item" aria-current={l.slug === lessonSlug && !gs ? 'page' : undefined}>
                  {num(String(l.number))}
                  <span>
                    {pick(l.texts).value.title}
                    <small lang="he">{l.hebrewTitle}</small>
                  </span>
                </a>
                {games(l, false)}
              </div>
            );
          })
        : torahSel.lessons.map(readLink)}
    </>
  );
  const w = today?.words;

  return (
    <>
      <Sheet variant="drawer" open={panel === 'menu'} onClose={close} title={t('app.title')} closeLabel={t('menu.close')}>
        <nav className="menu">
          <a href="#/" onClick={close} className="menu-item" aria-current={!location.hash || location.hash === '#/' ? 'page' : undefined}>
            <Icon name="home" />
            <span>{t('menu.home')}</span>
          </a>
          {group(<Icon name="spark" />, t('menu.chassidut'), t('menu.chassidutSub'), inRebbe || starts('#/hemshech'), (
            <>
              {rebbeGroups.length > 0 && (
                <details className="menu-group" open={inRebbe}>
                  <summary className="menu-item">
                    {num('✦')}
                    <span>
                      {t('menu.sichot')}
                      <small>{t('menu.sichotSub')}</small>
                    </span>
                  </summary>
                  <div className="menu-sub">{sichot}</div>
                </details>
              )}
              {link('#/hemshech', <Icon name="book" />, t('menu.hemshech'), today && 'title' in today.hs ? today.hs.title : t('hs.short'), !!today && 'title' in today.hs && today.hs.done)}
            </>
          ))}
          {group(<Icon name="book" />, t('menu.tanakh'), t('menu.tanakhSub'), inTorah || starts('#/neviim', '#/ketuvim'), (
            <>
              {torahGroups.length > 0 && (
                <details className="menu-group" open={inTorah}>
                  <summary className="menu-item">
                    {num('ת', true)}
                    <span>
                      {t('menu.torahBht')}
                      <small>{t('menu.torahBhtSub')}</small>
                    </span>
                  </summary>
                  <div className="menu-sub">{torah}</div>
                </details>
              )}
              {link(tk('neviim'), num('נ', true), t('menu.neviim'), today?.neviim.range ?? t('tanakh.daySub'), today?.neviim.done)}
              {link(tk('ketuvim'), num('כ', true), t('menu.ketuvim'), today?.ketuvim.range ?? t('tanakh.daySub'), today?.ketuvim.done)}
            </>
          ))}
          {group(<Icon name="chat" />, t('academy.fac.lashon'), t('menu.lashonSub'), starts('#/lashon', '#/torah-words', '#/words', '#/letters'), (
            <>
              {link('#/lashon', num('ל', true), t('ln.title'), t('ln.menuSub'))}
              {kids
                ? link('#/torah-words', <Icon name="cards" />, t('tw.title'), t('tw.menuSub'))
                : link('#/words', <Icon name="cards" />, t('words.mine'), w?.any ? (w.due ? t('words.homeSub', { d: w.due, k: w.known }) : t('words.homeSubDone', { k: w.known })) : t('words.menuSub'), !!w?.any && !w.due)}
              {level !== 'reads' && link('#/letters', num('א', true), t('abc.title'), t('abc.menuSub'))}
            </>
          ))}
          {link('#/nigun', <Icon name="music" />, t('nigun.title'), t('nigun.menuSub'))}
          {group(<Icon name="grid" />, t('menu.misc'), t('menu.miscSub'), starts('#/facts', '#/daily', '#/quiz', '#/shabbat-table', '#/digest'), (
            <>
              {lessonSlug && link(`#/${lessonSlug}/print`, <Icon name="print" />, t('print.button'))}
              {link('#/shabbat-table', <Icon name="print" />, t('table.title'), t('table.menuSub'))}
              {link('#/digest', <Icon name="print" />, t('digest.title'), t('digest.menuSub'))}
              {link('#/quiz', <Icon name="phone" />, t('lq.title'), t('lq.menuSub'))}
              {link('#/facts', <Icon name="hash" />, t('facts.title'), t('facts.menuSub'))}
            </>
          ))}
          {/* the children: how to play, my Hebrew and mental math */}
          {kids &&
            group(<Icon name="help" />, t('menu.learn'), t('menu.learnSub'), isMath, (
              <>
                <button className="menu-item" onClick={() => open('help')}>
                  {num('?')}
                  <span>{t('help.title')}</span>
                </button>
                <button className="menu-item" onClick={() => open('help')}>
                  {num('א', true)}
                  <span>
                    {t('hebrew.menu')}
                    <small>{t(`hebrew.${level}`)}</small>
                  </span>
                </button>
                <details className="menu-group" open={isMath}>
                  <summary className="menu-item">
                    {num('±')}
                    <span>{t('math.title')}</span>
                  </summary>
                  <div className="menu-sub">
                    {OPS.map((o) => (
                      <a key={o} href={`#/math/${o}`} onClick={close} className="menu-item" aria-current={isHere(`#/math/${o}`) ? 'page' : undefined}>
                        {num(SIGN[o])}
                        <span>{t(`math.op.${o}`)}</span>
                      </a>
                    ))}
                  </div>
                </details>
              </>
            ))}
          {link('#/academy', <Icon name="award" />, t('academy.title'), t('academy.menuSub'))}
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
