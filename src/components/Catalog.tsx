import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
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
import { parshaDaily } from '../core/turimDaily';
import { lessonArt } from '../core/art';
import { useMode } from '../core/mode';
import { CoursesCard } from './CoursesCard';
import { PATCHES_KEY, ZIP_KEY, patchesTile, zipTile } from '../core/zipReminder';
import { todayIso } from '../core/habit';
import { Dedication } from './Dedication';
import { ShabbatCalendar } from './ShabbatCalendar';
import { NUMS, collectFacts, type Fact } from '../core/facts';
import { displayNames } from '../core/names';
import { loadDict, nextWords, today, unlearnedWords, useWordStore, type Dict, type WordLang } from '../core/words';
import { certName, hebFinals, hebGuess, hebOnly, readMyName, saveMyName, SEFARIA_BOOKS, versesFor, type MyName, type MyVerses, type Verse } from '../core/myVerse';

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
 * «Игры» (owner, 09.11.2026: «плитку переименуй в игры и свайпом сделай выбор игры»): one tile, the games side by side —
 * swipe (scroll-snap) or the dots; «Zip — стих Торы» (#/zip) and «Лоскуты гематрии» (#/patches), each with the level of the
 * next puzzle or ✓ for today. It opens on the first game not played today. `adults` — the book-like tile of the adults' home.
 */
function GamesTile({ adults = false }: { adults?: boolean }) {
  const { t } = useI18n();
  const read = (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  };
  const today = todayIso();
  const z = zipTile(read(ZIP_KEY), today);
  const p = patchesTile(read(PATCHES_KEY), today);
  const games = [
    { href: '#/zip', name: 'Zip', he: 'פָּסוּק', icon: '🧩', sub: t(z.today ? 'home.zipDone' : 'home.zipNew', { n: z.l }), done: z.today },
    { href: '#/patches', name: t('patches.short'), he: 'טְלָאִים', icon: '🟩', sub: t(p.today ? 'home.patchesDone' : 'home.patchesNew', { n: p.l }), done: p.today },
  ];
  const start = Math.max(0, games.findIndex((g) => !g.done));
  const [page, setPage] = useState(start);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (start && box.current) box.current.scrollLeft = start * box.current.clientWidth;
  }, []);
  const go = (i: number) => box.current?.scrollTo({ left: i * box.current.clientWidth, behavior: 'smooth' });
  return (
    <div className={`games ${adults ? 'a-games' : 'h-games'}`} role="group" aria-roledescription="carousel" aria-label={t('home.games')}>
      <div className="g-pages" ref={box} onScroll={(e) => setPage(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}>
        {games.map((g, i) =>
          adults ? (
            <a key={g.href} className="a-tile a-zip g-slide" href={g.href} aria-label={`${t('home.games')}: ${g.name}. ${g.sub}`} tabIndex={i === page ? 0 : -1}>
              <span className="a-tile-k">{t('home.games')}</span>
              <span className="a-tile-t">{g.name}</span>
              <span className="a-tile-he he">{g.he}</span>
              <span className="a-zip-s">{g.sub}</span>
            </a>
          ) : (
            <a key={g.href} className="h-daily h-zip g-slide" href={g.href} tabIndex={i === page ? 0 : -1}>
              <span className="h-daily-title">
                {g.icon} {t('home.games')} · <span className={g.name === 'Zip' ? 'num' : undefined}>{g.name}</span>
              </span>
              <span className="h-daily-sub">{g.sub} →</span>
            </a>
          ),
        )}
      </div>
      <div className="g-dots">
        {games.map((g, i) => (
          <button key={g.href} type="button" aria-current={i === page ? 'true' : undefined} aria-label={t('home.gamesPick', { name: g.name })} onClick={() => go(i)} />
        ))}
      </div>
    </div>
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
 * names of the chosen courses with their bars — CoursesCard `simple`), «Проворное чтение Теґилим» (#/reading) and the running feed
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
            <a className={`a-tile a-parsha${art ? ' a-art' : ''}`} href={parshaDaily(week.id) ? `#/${parshaDaily(week.id)!.slug}/day` : `#/${reads[0].slug}/read`} style={art ? { backgroundImage: `url(${art})` } : undefined}>
              <span className="a-tile-k">{t('home.todayParsha')}</span>
              <span className="a-tile-t">{week.name[locale as keyof typeof week.name] ?? week.name.ru}</span>
              <span className="a-tile-he he">{week.he}</span>
            </a>
          )}
          <a className="a-tile a-reading" href="#/reading">
            <span className="a-tile-k">{t('home.readingK')}</span>
            <span className="a-tile-t">{t('reading.h1')}</span>
            <span className="a-tile-he he">תְּהִלִּים</span>
          </a>
          {/* «Мои курсы» — half the tile, «Игры» (Zip, «Лоскуты гематрии») next to it (owner, 02.11 and 09.11.2026) */}
          <div className="a-pair">
            <CoursesCard simple />
            <GamesTile adults />
          </div>
          <HomeTicker />
        </div>
        <Dedication line />
      </main>
      <Colophon />
    </>
  );
}

/**
 * «Гематрии» on the adults' home: every equality of the lessons («פרצוף + גאוה = 471 = זנב + תאוה», src/core/facts.ts)
 * with its words translated under it (the lesson's glossary), running slowly upwards in a closed loop (the list twice,
 * the animation moves it by one list); ⏸ stops it (moving content needs a pause — WCAG 2.2.2; on a phone there is no hover),
 * so does the mouse or focus; a tap opens the equality in «Знаете ли вы?» (#/facts/<id>); «reduce motion» — a still list.
 */
type TickerKind = 'gematria' | 'words' | 'verse';
const TICKER_KEY = 'niflaot:home-ticker';
const TICKER_LABEL = { gematria: 'home.gematria', words: 'words.mine', verse: 'home.myVerse' } as const;
const readTicker = (): TickerKind => {
  try {
    const k = localStorage.getItem(TICKER_KEY);
    return k === 'words' || k === 'verse' ? k : 'gematria';
  } catch {
    return 'gematria';
  }
};

/**
 * The running feed on the adults' home — the player chooses what runs in it (owner, 31.10.2026): «Гематрии» (the lessons'
 * equalities) or «Мои слова» (the words of Tanakh the player is learning and hasn't learned yet). The choice —
 * `niflaot:home-ticker`, only on this device.
 */
function HomeTicker() {
  const { t } = useI18n();
  const [kind, setKind] = useState<TickerKind>(readTicker);
  const choose = (k: TickerKind) => {
    setKind(k);
    try {
      localStorage.setItem(TICKER_KEY, k);
    } catch {}
  };
  const head = (
    <>
      <h2 id="a-tick-h" className="sr-only">
        {t(TICKER_LABEL[kind])}
      </h2>
      <div className="a-tick-switch" role="group" aria-label={t('home.tickerChoose')}>
        {(['gematria', 'words', 'verse'] as const).map((k) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => choose(k)}>
            {t(TICKER_LABEL[k])}
          </button>
        ))}
      </div>
    </>
  );
  return kind === 'words' ? <WordsTicker head={head} /> : kind === 'verse' ? <VerseTicker head={head} /> : <GematriaTicker head={head} />;
}

/** The head of a feed: the switch (or the title) and ⏸ / ▶. */
function TickHead({ paused, setPaused, children }: { paused: boolean; setPaused: (f: (x: boolean) => boolean) => void; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="a-tick-head">
      {children}
      <button type="button" className="a-tick-pause" onClick={() => setPaused((x) => !x)} aria-pressed={paused} aria-label={t(paused ? 'reading.resume' : 'reading.pause')} title={t(paused ? 'reading.resume' : 'reading.pause')}>
        {paused ? '▶' : '❚❚'}
      </button>
    </div>
  );
}

/**
 * «Мои слова» as a feed: each word the player is learning — Hebrew, its translation (and «повторить сегодня»), running like
 * the gematria; a tap opens «Мои слова» (#/words). Nothing to learn yet — the most frequent words not in «Мои слова»
 * (a line says so). The dictionary is loaded only when this feed is chosen.
 */
const NEW_IN_TICKER = 20;
const MIN_IN_LOOP = 8;
function WordsTicker({ head }: { head: ReactNode }) {
  const { t, locale } = useI18n();
  const store = useWordStore();
  const [dict, setDict] = useState<Dict | null>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    let live = true;
    loadDict(locale as WordLang).then((d) => live && setDict(d), () => {});
    return () => {
      live = false;
    };
  }, [locale]);
  const { ids, fresh } = useMemo(() => {
    if (!dict) return { ids: [] as string[], fresh: false };
    const mine = unlearnedWords(dict, store);
    return mine.length ? { ids: mine, fresh: false } : { ids: nextWords(dict, store, NEW_IN_TICKER).map((w) => w.id), fresh: true };
  }, [dict, store]);
  const day = today();
  // a short list — repeated, so the loop fills the window (the second copy below moves it by exactly one list)
  const loop = ids.length ? Array.from({ length: Math.ceil(MIN_IN_LOOP / ids.length) }, () => ids).flat() : [];
  const row = (id: string, copy: boolean, k: number) => {
    const w = dict!.words[dict!.rank.get(id)! - 1];
    const due = !fresh && store[id][2] <= day;
    return (
      <li key={`${copy ? 'b' : 'a'}${k}`} aria-hidden={copy || k >= ids.length || undefined}>
        <a href="#/words" tabIndex={copy || k >= ids.length ? -1 : undefined}>
          <span className="he" dir="rtl">
            {w.he}
          </span>
          <span className="a-tick-g">
            {dict!.tr[id]}
            {due && <span className="a-tick-due"> · {t('words.statDue')}</span>}
          </span>
        </a>
      </li>
    );
  };
  return (
    <section className={`a-tick${paused ? ' paused' : ''}`} aria-labelledby="a-tick-h">
      <TickHead paused={paused} setPaused={setPaused}>
        {head}
      </TickHead>
      {fresh && dict && <p className="a-tick-note">{t('home.tickerNew')}</p>}
      <div className="a-tick-win">
        {dict && ids.length > 0 && (
          <ul style={{ animationDuration: `${loop.length * 4}s` }}>
            {loop.map((id, k) => row(id, false, k))}
            {loop.map((id, k) => row(id, true, k))}
          </ul>
        )}
      </div>
    </section>
  );
}

/**
 * «Мой стих Торы» (owner, 03.11.2026): the verse of the player's name — it begins with the first letter of the name in
 * Hebrew and ends with the last (said at the end of the Amidah), the verse with the name itself and the other verses on
 * these letters, running like the other feeds. The first time — «Как вас зовут?»: the name, its Hebrew spelling guessed
 * as in «Стих имени» of «Тайна Коэлета» (src/core/myVerse.ts, data koelet/data/pesukim/) and editable. The name stays on
 * this device (`niflaot:my-verse`). A tap opens the verse: Prophets and Writings — the day of the cycle, Torah — Sefaria.
 */
const MORE_IN_TICKER = 24;
type Cite = { label: string; href: string; external: boolean } | null;
function VerseTicker({ head }: { head: ReactNode }) {
  const { t, locale } = useI18n();
  const [me, setMe] = useState<MyName | null>(readMyName);
  const [paused, setPaused] = useState(false);
  const [data, setData] = useState<{ v: MyVerses; cite: (ref: string) => Cite } | null>(null);
  const [err, setErr] = useState(false);
  const [tryN, setTryN] = useState(0);
  useEffect(() => {
    if (!me) return;
    let live = true;
    setData(null);
    setErr(false);
    Promise.all([versesFor(me.he), import('../core/citations')]).then(
      ([v, c]) => live && setData({ v, cite: (ref) => c.resolveCite(ref, locale) }),
      () => live && setErr(true),
    );
    return () => {
      live = false;
    };
  }, [me, locale, tryN]);

  if (!me)
    return (
      <section className="a-tick" aria-labelledby="a-tick-h">
        <TickHead paused={paused} setPaused={setPaused}>
          {head}
        </TickHead>
        <MyNameForm
          onDone={(v) => {
            saveMyName(v);
            setMe(v);
          }}
        />
      </section>
    );

  type Item = { v: Verse; tag?: string; first?: boolean };
  const items: Item[] = [];
  for (const n of data?.v.names ?? []) {
    const [mine, ...more] = n.pair;
    if (mine) items.push({ v: mine, tag: t('home.myVerseMine'), first: true });
    if (n.withName) items.push({ v: n.withName, tag: t('home.myVerseWithName') });
    for (const v of more.slice(0, MORE_IN_TICKER)) items.push({ v, tag: t('home.myVerseMore'), first: true });
  }
  const loop = items.length ? Array.from({ length: Math.ceil(4 / items.length) }, () => items).flat() : [];
  const verse = (v: Verse, first?: boolean) => {
    const txt = v[3];
    if (!first) return txt;
    // the first and the last letters — the letters of the name
    const a = txt.search(/[א-ת]/),
      b = txt.search(/[א-ת][^א-ת]*$/);
    if (a < 0 || b <= a) return txt;
    return (
      <>
        {txt.slice(0, a)}
        <mark>{txt[a]}</mark>
        {txt.slice(a + 1, b)}
        <mark>{txt[b]}</mark>
        {txt.slice(b + 1)}
      </>
    );
  };
  const row = (it: Item, copy: boolean, k: number) => {
    const hide = copy || k >= items.length;
    const c = data!.cite(`${SEFARIA_BOOKS[it.v[0]]} ${it.v[1]}:${it.v[2]}`);
    const ref = c?.label ?? `${data!.v.books[it.v[0]]} ${it.v[1]}:${it.v[2]}`;
    const body = (
      <>
        <span className="he a-tick-v" dir="rtl">
          {verse(it.v, it.first)}
        </span>
        <span className="a-tick-g">
          {it.tag && <span className="a-tick-due">{it.tag} · </span>}
          {ref}
        </span>
      </>
    );
    return (
      <li key={`${copy ? 'b' : 'a'}${k}`} aria-hidden={hide || undefined}>
        {c ? (
          <a href={c.href} tabIndex={hide ? -1 : undefined} {...(c.external ? { target: '_blank', rel: 'noopener' } : {})}>
            {body}
          </a>
        ) : (
          <span className="a-tick-item">{body}</span>
        )}
      </li>
    );
  };
  return (
    <section className={`a-tick${paused ? ' paused' : ''}`} aria-labelledby="a-tick-h">
      <TickHead paused={paused} setPaused={setPaused}>
        {head}
      </TickHead>
      <p className="a-tick-note a-tick-me">
        <span className="he">{me.he}</span>
        {me.name && me.name !== me.he && <> · {me.name}</>}
        {' · '}
        <button type="button" className="a-tick-edit" onClick={() => setMe(null)}>
          {t('home.myVerseEdit')}
        </button>
      </p>
      {err ? (
        <p className="a-tick-note">
          {t('home.myVerseError')}{' '}
          <button type="button" className="a-tick-edit" onClick={() => setTryN((n) => n + 1)}>
            ↻
          </button>
        </p>
      ) : !data ? (
        <p className="a-tick-note">{t('home.myVerseLoading')}</p>
      ) : !items.length ? (
        <p className="a-tick-note">{t('home.myVerseNone')}</p>
      ) : (
        <div className="a-tick-win">
          <ul style={{ animationDuration: `${loop.length * 6}s` }}>
            {loop.map((it, k) => row(it, false, k))}
            {loop.map((it, k) => row(it, true, k))}
          </ul>
        </div>
      )}
    </section>
  );
}

/** «Как вас зовут?»: the name and its Hebrew spelling (guessed, editable — the first and the last letters matter). */
function MyNameForm({ onDone }: { onDone: (v: MyName) => void }) {
  const { t } = useI18n();
  const prev = readMyName();
  const [name, setName] = useState(prev?.name ?? certName());
  const [he, setHe] = useState(prev?.he ?? hebGuess(name));
  const [heTouched, setHeTouched] = useState(!!prev);
  const ok = hebFinals(he).trim().length >= 2;
  return (
    <form
      className="a-myname"
      onSubmit={(e) => {
        e.preventDefault();
        if (ok) onDone({ name: name.trim(), he: hebFinals(he).trim() });
      }}
    >
      <p className="a-tick-note">{t('home.myVerseAsk')}</p>
      <div className="a-myname-row">
      <label>
        <span>{t('home.myVerseName')}</span>
        <input
          value={name}
          maxLength={40}
          autoComplete="given-name"
          onChange={(e) => {
            setName(e.target.value);
            if (!heTouched) setHe(hebGuess(e.target.value));
          }}
        />
      </label>
      <label>
        <span>{t('home.myVerseHe')}</span>
        <input
          className="he"
          lang="he"
          dir="rtl"
          value={he}
          maxLength={24}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            setHeTouched(true);
            setHe(hebFinals(hebOnly(e.target.value)));
          }}
        />
      </label>
      </div>
      <button type="submit" className="btn" disabled={!ok}>
        {t('home.myVerseGo')}
      </button>
    </form>
  );
}

function GematriaTicker({ head }: { head: ReactNode }) {
  const { pick } = useI18n();
  const [paused, setPaused] = useState(false);
  const facts = useMemo(() => collectFacts(LESSONS).filter((f): f is Extract<Fact, { kind: 'eq' }> => f.kind === 'eq'), []);
  if (!facts.length) return null;
  const gloss = (f: Extract<Fact, { kind: 'eq' }>) => {
    const words = pick(f.lesson.texts).value.glossary;
    const tr = (h: string) =>
      h
        .split(' + ')
        .map((w) => words[w])
        .filter(Boolean)
        .join(' + ');
    return [f.q, ...f.rest.filter((p) => !NUMS.test(p))].map(tr).filter(Boolean).join(' = ');
  };
  const row = (f: Extract<Fact, { kind: 'eq' }>, copy: boolean) => {
    const g = gloss(f);
    return (
      <li key={`${copy ? 'b' : 'a'}${f.id}`} aria-hidden={copy || undefined}>
        <a href={`#/facts/${f.id}`} tabIndex={copy ? -1 : undefined}>
          <span dir="rtl">
            {[f.q, ...f.rest].map((p, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="a-tick-eq"> = </span>}
                {NUMS.test(p) ? <b className="a-tick-n">{p}</b> : <span className="he">{displayNames(p)}</span>}
              </Fragment>
            ))}
          </span>
          {g && <span className="a-tick-g">{g}</span>}
        </a>
      </li>
    );
  };
  return (
    <section className={`a-tick${paused ? ' paused' : ''}`} aria-labelledby="a-tick-h">
      <TickHead paused={paused} setPaused={setPaused}>
        {head}
      </TickHead>
      <div className="a-tick-win">
        <ul style={{ animationDuration: `${facts.length * 4}s` }}>
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
            <GamesTile />
            <CoursesCard />
            <DailyLink />
            <TableLink />
            {/* on the kids home only the Shabbat (the date is beside it, in WeekCountdown; the full calendar — in the top bar) */}
            <ShabbatCalendar shabbatOnly />
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
