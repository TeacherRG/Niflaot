import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n, type Locale } from '../i18n';
import { withTerms } from '../i18n/glossary';
import { PARSHIOT } from '../lessons';
import type { Lesson } from '../lessons/types';
import { SOURCES, parseQuote, translation } from '../sources';
import { markCalcs } from '../core/calcLines';
import { displayNames } from '../core/names';
import { localToday } from '../core/tanakh';
import { civilDate, hebrewNumber, jewishDate } from '../core/hebrewDate';
import { PER_DAY, TURIM_DAYS, dailyEntries, dayEntries, doneKey, turimDate, turimDays, turimIsDone, useTurimDone, type DayEntry } from '../core/turimDaily';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { TanakhMasthead } from './PrintBrand';
import { Icon, useDismiss } from './ui';
import { HebrewRuns } from './Hebrew';
import { GemPop, GemRow, GemVerse, placeGems } from './GemPop';
import { entryFacts, type EqFact } from '../core/turimGems';

/**
 * «Тора с Бааль ґа-Турим» по дням — как отрывок дня «Пророков и Писаний» (TanakhPage.tsx): полоса дат ‹ ›, заголовок,
 * одна кнопка языка и «Распечатать», стих за стихом — иврит справа, перевод слева, под стихом плашкой — слова Бааль ґа-Турима
 * (иврит и перевод в два столбца) и объяснение; «Я прочитал(а)», карточки «Предыдущий / Следующий день». Два комментария в день,
 * воскресенье — пятница (src/core/turimDaily.ts).
 */

type TextLang = 'he-ru' | 'he-en' | 'he-de' | 'ru' | 'en' | 'de' | 'he';
const TEXT_LANGS: TextLang[] = ['he-ru', 'he-en', 'he-de', 'ru', 'en', 'de', 'he'];
type Tr = 'ru' | 'en' | 'de';
const trOf = (l: TextLang): Tr | null => (l === 'he' ? null : (l.replace('he-', '') as Tr));
const VIEW_KEY = 'niflaot:turim-view';
const inLocale = (text: TextLang, locale: string): TextLang => {
  const tr: Tr = locale === 'ru' || locale === 'de' ? locale : 'en';
  return text === 'he' ? 'he' : text.startsWith('he-') ? `he-${tr}` : tr;
};

/** The language choice — remembered with the site's language it was made in, like the Tanakh page's. */
function useView(locale: string): [TextLang, (v: TextLang) => void] {
  const [saved, set] = useState<{ text: TextLang; loc?: string }>(() => {
    try {
      const v = JSON.parse(localStorage.getItem(VIEW_KEY) ?? 'null');
      if (v && TEXT_LANGS.includes(v.text)) return { text: v.text, loc: v.loc };
    } catch {}
    return { text: 'he-en' };
  });
  return [
    saved.loc === locale ? saved.text : inLocale(saved.text, locale),
    (text) => {
      const next = { text, loc: locale };
      set(next);
      try {
        localStorage.setItem(VIEW_KEY, JSON.stringify(next));
      } catch {}
    },
  ];
}

function ViewMenu({ text, setText }: { text: TextLang; setText: (v: TextLang) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, root, close);
  return (
    <div className="tk-view no-speak" ref={root}>
      <button type="button" className="lang-btn tk-view-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="globe" size={17} />
        <span>{t(`tanakh.view.${text}`)}</span>
        <Icon name="chevron" size={14} />
      </button>
      {open && (
        <div className="lang-list tk-view-list" role="menu" aria-label={t('tanakh.viewLabel')}>
          <div className="tk-view-head">{t('tanakh.viewLabel')}</div>
          {TEXT_LANGS.map((l) => (
            <button
              key={l}
              type="button"
              role="menuitemradio"
              aria-checked={text === l}
              onClick={() => {
                setText(l);
                close();
              }}
            >
              <span className="code">{l === 'he' ? 'עב' : trOf(l)!.toUpperCase()}</span>
              <span className="name">{t(`tanakh.view.${l}`)}</span>
              {text === l && <Icon name="check" size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const weekday = (iso: string, locale: string) => {
  const w = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
  return w.charAt(0).toUpperCase() + w.slice(1);
};
const shortDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
const BOOK = { ru: 'Берешит', en: 'Bereishit', de: 'Bereschit' } as const;
const bookName = (locale: string) => BOOK[(locale in BOOK ? locale : 'en') as keyof typeof BOOK];

/** ‹ / › at the corners of the date bar: the previous / next day (across portions). */
function Step({ to, dir }: { to?: { href: string; date: string }; dir: 'prev' | 'next' }) {
  const { t, locale } = useI18n();
  if (!to) return <span className={`tk-step ${dir}`} aria-hidden="true" />;
  const label = t(dir === 'prev' ? 'turim.prev' : 'turim.next');
  return (
    <a className={`tk-step ${dir}`} href={to.href} aria-label={`${label}: ${civilDate(to.date, locale)}`} title={label}>
      <Icon name="chevron" size={20} />
      <small>{shortDate(to.date, locale)}</small>
    </a>
  );
}

/** «Я прочитал(а)» under the day — the progress through the portion's week (`niflaot:turim-done`). */
function DoneCheck({ lesson, n, today }: { lesson: Lesson; n: number; today: string }) {
  const { t, locale } = useI18n();
  const [store, mark] = useTurimDone();
  const key = doneKey(lesson, n);
  const done = turimIsDone(store, key);
  const days = Array.from({ length: TURIM_DAYS }, (_, k) => k + 1);
  const read = days.filter((d) => turimIsDone(store, doneKey(lesson, d))).length;
  const missed = days.find((d) => d !== n && turimDate(lesson, d) <= today && !turimIsDone(store, doneKey(lesson, d)));
  return (
    <div className={`tk-done no-print${done ? ' on' : ''}`}>
      <label>
        <input type="checkbox" checked={done} onChange={(e) => mark(key, e.target.checked)} />
        <span>{t('turim.done')}</span>
      </label>
      <p>
        {t('turim.doneStat', { n: read, total: TURIM_DAYS })}
        {missed && (
          <>
            {' · '}
            <a href={`#/${lesson.slug}/day/${missed}`}>{t('turim.doneFirst', { day: weekday(turimDate(lesson, missed), locale) })}</a>
          </>
        )}
      </p>
    </div>
  );
}

/** the Names' hyphen unbroken on screen (Б‑г / Г‑сподь / G‑tt) */
const nb = (x: string) => x.replace(/([БГ])-(?=г|спод)/g, '$1‑').replace(/([Gg])-(?=tt)/g, '$1‑');

/** The commentator's words under the verse: Hebrew and translation side by side, comment by comment (as `.tk-st` on the Tanakh page). */
function Comment({ he, tr, trLang, by }: { he: string[] | null; tr: string[] | null; trLang: Tr | null; by: string }) {
  const heP = (x: string, k: number) => <p key={`h${k}`} className="he" lang="he" dir="rtl" dangerouslySetInnerHTML={{ __html: x }} />;
  const trP = (x: string, k: number) => <p key={`t${k}`} lang={trLang ?? undefined} dangerouslySetInnerHTML={{ __html: nb(x) }} />;
  const pairs = he && tr;
  return (
    <div className={`tk-st turim-st${pairs ? ' cols' : ''}`}>
      <span className="tk-st-by">{by}</span>
      {pairs ? (
        <div className="tk-cols">
          {Array.from({ length: Math.max(he.length, tr.length) }, (_, k) => (
            <Fragment key={k}>
              {tr[k] !== undefined ? trP(tr[k], k) : <span />}
              {he[k] !== undefined ? heP(he[k], k) : <span />}
            </Fragment>
          ))}
        </div>
      ) : (
        <>
          {he?.map(heP)}
          {tr?.map(trP)}
        </>
      )}
    </div>
  );
}

/** the Hebrew of a comment: the verse and the commentator's words (where an equality of the lesson stands) */
function entryHebrew(e: DayEntry): string[] {
  const out = [SOURCES[e.verse]?.he.join(' ') ?? ''];
  for (const q of e.quotes ?? []) {
    const { id } = parseQuote(q);
    out.push(...(SOURCES[id]?.he ?? []).map((h) => h.replace(/<[^>]+>/g, ' ')));
  }
  return out;
}

/** One comment of the day, as a verse of the Tanakh page: the verse, the commentator's words, the explanation. */
function Entry({ lesson, e, num, text, tr, chapter, same, gems }: { lesson: Lesson; e: DayEntry; num: number; text: TextLang; tr: Tr | null; chapter: boolean; same: boolean; gems: EqFact[] }) {
  const { t, pick, locale } = useI18n();
  const { value: lt, locale: lessonLocale } = pick(lesson.texts);
  const he = text.startsWith('he');
  const v = SOURCES[e.verse];
  const vTr = tr && v ? translation(v, e.verse, tr as Locale).lines : null;
  const [ch, vs] = e.ref.split(':').map(Number);
  // the commentator's words: the lesson's passages from Sefaria, or the Memo pair's (Hebrew + the lesson's translation)
  let cHe: string[] = [];
  let cTr: string[] = [];
  if (e.quotes)
    for (const q of e.quotes) {
      const { id, segs } = parseQuote(q);
      const s = SOURCES[id];
      if (!s) continue;
      const keep = (i: number) => !segs || segs.includes(i);
      cHe.push(...s.he.filter((_, i) => keep(i)));
      if (tr) cTr.push(...translation(s, id, tr as Locale).lines.filter((_, i) => keep(i)));
    }
  else if (e.memo !== undefined) {
    const it = lesson.memo!.items[e.memo];
    cHe = [displayNames(it.quote)];
    const mt = tr ? lesson.texts[tr as Locale]?.memo?.items[e.memo] : undefined;
    if (mt) cTr = [mt.quote];
  }
  // the explanation — in the site's language: the lesson's text of the day, or the Memo pair's «Знаете ли вы?» and «Чему это учит?»
  const title = e.text !== undefined ? lt.daily?.items[e.text]?.h : e.memo !== undefined ? lt.memo?.items[e.memo]?.title : undefined;
  const body = e.text !== undefined ? lt.daily?.items[e.text]?.b ?? '' : '';
  const mi = e.memo !== undefined ? lt.memo?.items[e.memo] : undefined;
  // маячки гематрий: в стихе — у его слов, остальные — строкой над словами комментатора
  const { marks, rest } = placeGems(he && v && !same ? v.he.join(' ') : null, gems);
  return (
    <>
      {chapter && (
        <h2 className="tk-chapter">
          {bookName(locale)} · {t('tanakh.chapter', { n: ch })}{' '}
          <span className="he" lang="he">
            בראשית {hebrewNumber(ch).replace(/[׳״]/g, '')}
          </span>
        </h2>
      )}
      <section className={`tk-verse${he && vTr && !same ? ' cols' : ''}`} id={`turim-${num}`} data-v={vs}>
        <span className="tk-num num" aria-label={e.ref}>
          {e.ref}
        </span>
        {/* the next comment on the same verse: the verse is not repeated */}
        {he && v && !same && (
          <p className="tk-he he" lang="he" dir="rtl">
            <GemVerse text={v.he.join(' ')} marks={marks} />
          </p>
        )}
        {vTr && !same && (
          <p className="tk-en" lang={tr!}>
            {nb(vTr.join(' '))}
          </p>
        )}
        <GemRow facts={rest} />
        <Comment he={he ? cHe : null} tr={tr && cTr.length ? cTr : null} trLang={tr} by={t('teacher.baal-haturim.short')} />
        {(body || mi) && (
          <div className="turim-expl" lang={lessonLocale}>
            {title && (
              <h3>
                <HebrewRuns text={title} />
              </h3>
            )}
            {body ? (
              <div className="les-b" dangerouslySetInnerHTML={{ __html: withTerms(markCalcs(body), lessonLocale) }} />
            ) : (
              mi && (
                <div className="les-b">
                  <p>
                    <HebrewRuns text={mi.explain} />
                  </p>
                  <p className="expl">
                    <b>{t('memo.learn')}</b> <HebrewRuns text={mi.moral} />
                  </p>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </>
  );
}

/**
 * `#/<slug>/day[/<1–6>]`, `#/turim` — «Тора с Бааль ґа-Турим» по дням: два комментария в день с воскресенья по пятницу.
 */
export function TurimDailyPage({ lesson, n }: { lesson: Lesson; n: number }) {
  const { t, pick, locale } = useI18n();
  const { value: text } = pick(lesson.texts);
  const today = localToday();
  const date = turimDate(lesson, n);
  const parsha = PARSHIOT[lesson.parsha];
  const parshaName = (parsha.name as Record<string, string>)[locale] ?? parsha.name.ru;
  const all = turimDays();
  const i = all.findIndex((d) => d.lesson.slug === lesson.slug && d.n === n);
  const link = (d?: (typeof all)[number]) => d && { href: `#/${d.lesson.slug}/day/${d.n}`, date: d.date, lesson: d.lesson, n: d.n };
  const prev = link(all[i - 1]);
  const next = link(all[i + 1]);
  const entries = dayEntries(lesson, n);
  // the equalities of the week's comments (each once, at its first comment) — the beacons of GemPop
  const gems = useMemo(() => entryFacts(lesson, dailyEntries(lesson), entryHebrew).slice((n - 1) * PER_DAY, n * PER_DAY), [lesson, n]);
  const [view, setView] = useView(locale);
  const tr = trOf(view);
  const isToday = date === today;
  const title = t('turim.h1');
  const refs = (l: Lesson, d: number) => `${bookName(locale)} ${[...new Set(dayEntries(l, d).map((e) => e.ref))].join(', ')}`;

  useEffect(() => {
    document.title = `${title} · ${parshaName} · ${weekday(date, locale)} · ${t('app.title')}`;
  }, [title, parshaName, date, locale, t]);

  return (
    <>
      <TopBar title={title} />
      <div className="wrap tk turim">
        <article>
          <TanakhMasthead title={`${title} · ${parshaName}`} he={parsha.he} route={`${lesson.slug}/day/${n}`} date={date} />
          <nav className="tk-dates no-print" aria-label={title}>
            <Step to={prev} dir="prev" />
            <div className="tk-date">
              <b>{isToday ? t('turim.today') : weekday(date, locale)}</b>
              <span>{civilDate(date, locale)}</span>
              <span className="he" lang="he">
                {jewishDate(date)}
              </span>
              {!isToday && all.some((d) => d.date === today) && (
                <a className="tk-to-today" href="#/turim">
                  {t('turim.toToday')}
                </a>
              )}
            </div>
            <Step to={next} dir="next" />
          </nav>

          <header className="tk-head">
            <h1>
              {title}{' '}
              <span className="he" lang="he">
                {parsha.he}
              </span>
            </h1>
            <p className="tk-range">
              {t('turim.parsha', { parsha: parshaName })} · {refs(lesson, n)}
            </p>
            <p className="tk-day">
              {t('tanakh.day', { n, total: TURIM_DAYS })} · {t('turim.minutes')}
            </p>
            {date > today && <p className="tk-note">{t('turim.ahead')}</p>}
          </header>

          <div className="tk-tools no-print">
            <ViewMenu text={view} setText={setView} />
            <button type="button" className="lang-btn tk-print-btn" onClick={() => window.print()}>
              <Icon name="print" size={17} />
              <span>{t('print.button')}</span>
            </button>
          </div>

          {gems.some((g) => g.length > 0) && (
            <p className="tk-hint kp-hint no-print">
              <span className="kp-dot" aria-hidden="true" /> {t('gem.hint')}
            </p>
          )}
          <GemPop />
          {entries.map((e, k) => (
            <Entry key={k} lesson={lesson} e={e} num={(n - 1) * PER_DAY + k + 1} text={view} tr={tr} chapter={k === 0 || entries[k - 1].ref.split(':')[0] !== e.ref.split(':')[0]} same={k > 0 && entries[k - 1].verse === e.verse} gems={gems[k] ?? []} />
          ))}

          <DoneCheck lesson={lesson} n={n} today={today} />

          <nav className="tk-pager no-print" aria-label={title}>
            {prev ? (
              <a className="prev" href={prev.href}>
                <small>← {t('turim.prev')}</small>
                <b>{refs(prev.lesson, prev.n)}</b>
                <span>
                  {weekday(prev.date, locale)}, {civilDate(prev.date, locale)}
                </span>
              </a>
            ) : (
              <span />
            )}
            {next && (
              <a className="next" href={next.href}>
                <small>{t('turim.next')} →</small>
                <b>{refs(next.lesson, next.n)}</b>
                <span>
                  {weekday(next.date, locale)}, {civilDate(next.date, locale)}
                </span>
              </a>
            )}
          </nav>

          <p className="turim-more no-print">
            {t('turim.lesson')}: <a href={`#/${lesson.slug}/read`}>{text.title}</a> · <a href={`#/${lesson.slug}`}>{t('turim.lessonPlay')}</a>
          </p>
          <footer className="tk-sources">
            <p>{t('turim.sources')}</p>
          </footer>
        </article>
      </div>
      <Colophon source={text.source} />
    </>
  );
}
