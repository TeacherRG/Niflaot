import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { Slogan } from './Slogan';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { LESSONS } from '../lessons';
import { TEACHERS, type TeacherId } from '../lessons/teachers';
import { lessonScore } from '../core/progress';
import { readScore, readStore } from '../core/readCheck';
import { useMode } from '../core/mode';
import { CYCLE, localToday } from '../core/tanakh';
import { readQuizStore, quizReady } from '../core/quiz';
import { readDoneStore } from '../core/tanakhDone';
import { readWordStore, wordsCertificates } from '../core/words';
import { readStars, torahWords, torahWordsCertificates } from '../core/torahWords';
import { HEMSHECH, allPassages, hsCertificates, hsIsDone, passageDate, readHsDone, todayIndex } from '../core/hemshech';
import { NIFLAOT_LOGO, PARTNERS } from '../core/partners';
import { NIGUNIM } from '../nigun';
import { civilDate, jewishDate } from '../core/hebrewDate';
import { useAccount } from '../core/account';
import { routeLink } from '../core/site';
import { QrCode } from './QrCode';
import { setOtherPage } from '../core/assistant';
import { academyContext } from '../core/assistantPages';
import {
  PASS,
  RECTOR,
  isDone,
  TORAH_BOOKS,
  tanakhCertificates,
  tanakhProgress,
  torahBookComplete,
  torahCertificates,
  torahProgress,
  type Certificate,
  type Progress,
} from '../core/academy';

type Lang = 'ru' | 'en' | 'de';
const langOf = (locale: string): Lang => (locale === 'en' || locale === 'de' ? locale : 'ru');
const pct = (p: Progress) => (p.max ? Math.round((100 * p.got) / p.max) : 0);
const PASS_PCT = Math.round(PASS * 100);

/**
 * The faculties of the Academy («факультативы»), by the mode. The children: «Лашон ґа-кодеш» (letters and the words of
 * the Torah), «Святая арифметика» (the gematria of the Baal HaTurim — the game), «Святая музыка» (the niggunim of m770.org
 * by karaoke, #/nigun) and «Кодеш ґа-кодашим» (the Chassidut of the Rebbe — investigations and cards). The adults:
 * the Prophets and Writings and the Chassidut of Chabad («Ґемшех Самех-Вав») first, then the same four «the grown-up
 * way»: the words of Tanakh, the Baal HaTurim and the Rebbe's talks to read.
 */
type FacultyId = 'lashon' | 'gematria' | 'nigun' | 'rebbe' | 'tanakh' | 'hemshech';
const FACULTIES: Record<'kids' | 'adults', FacultyId[]> = {
  kids: ['lashon', 'gematria', 'nigun', 'rebbe'],
  adults: ['tanakh', 'hemshech', 'lashon', 'gematria', 'nigun', 'rebbe'],
};
const FACULTY: Record<FacultyId, { he: string; color: string }> = {
  lashon: { he: 'לשון הקודש', color: 'gold' },
  gematria: { he: 'גימטריא', color: 'tchelet' },
  nigun: { he: 'ניגון', color: 'gold' },
  rebbe: { he: 'קודש הקדשים', color: 'green' },
  tanakh: { he: 'נביאים וכתובים', color: 'tchelet' },
  hemshech: { he: 'חסידות', color: 'green' },
};
/** Where to learn in each faculty: [href, UI key], the children's and the adults'. */
const LINKS: Record<FacultyId, Record<'k' | 'a', [string, MessageKey][]>> = {
  lashon: { k: [['#/torah-words', 'tw.title'], ['#/letters', 'abc.title']], a: [['#/words', 'words.mine'], ['#/letters', 'abc.title']] },
  gematria: { k: [['#/daily', 'daily.title'], ['#/facts', 'facts.title'], ['#/math/add', 'math.title']], a: [['#/daily', 'daily.title'], ['#/facts', 'facts.title']] },
  nigun: { k: [['#/nigun', 'nigun.title']], a: [['#/nigun', 'nigun.title']] },
  rebbe: { k: [['#/shabbat-table', 'table.title']], a: [['#/shabbat-table', 'table.title']] },
  tanakh: { k: [], a: [['#/neviim', 'tanakh.neviim'], ['#/ketuvim', 'tanakh.ketuvim']] },
  hemshech: { k: [], a: [['#/hemshech', 'hs.menuLbl']] },
};

/** Every certificate with its progress on this device. */
export function useCertificates() {
  return useMemo(() => {
    const today = localToday();
    const store = readQuizStore();
    const read = readDoneStore();
    const torah = torahCertificates(LESSONS).map((c) => {
      const legacy = (slug: string) => LESSONS.find((l) => l.slug === slug)?.legacyStorageKey;
      const rs = readStore();
      const progress = torahProgress(c, (slug) => lessonScore(slug, legacy(slug)), torahBookComplete(c.book.id as never), (l) => readScore(l, rs));
      // the reading path starts at the first lesson whose «Проверь себя» isn't finished
      const toRead = c.lessons.find((l) => { const x = readScore(l, rs); return x.done < x.n; }) ?? c.lessons[0];
      return { ...c, progress, href: `#/${c.lessons[0].slug}`, readHref: `#/${toRead.slug}/read` };
    });
    const tanakh = tanakhCertificates(CYCLE, today).map((c) => {
      const progress = tanakhProgress(c, store, quizReady, read);
      const ready = c.days.filter((d) => quizReady(d.date)).length;
      const first = c.days.find((d) => quizReady(d.date) && !(store[`${d.date}:${c.section}`]?.best >= 0));
      // the reading starts at the first passage of the book not marked «Я прочитал(а)»
      const toRead = c.days.find((d) => !isDone(read, d.date, c.section!)) ?? c.days[0];
      return { ...c, progress, ready, href: `#/${c.section}/${toRead.date}`, quizHref: first && `#/${c.section}/${first.date}/quiz` };
    });
    // the reader's tracker: the passages of the whole cycle read, and those of the days already past
    const tracker = (['neviim', 'ketuvim'] as const).map((section) => {
      const past = CYCLE.filter((d) => d.date <= today);
      const missed = past.find((d) => !isDone(read, d.date, section));
      return {
        section,
        read: CYCLE.filter((d) => isDone(read, d.date, section)).length,
        total: CYCLE.length,
        pastRead: past.filter((d) => isDone(read, d.date, section)).length,
        past: past.length,
        missed: missed?.date,
      };
    });
    // «Хасидут»: a certificate for each discourse; the reading starts at its first open passage not marked read
    const hsDone = readHsDone();
    const passages = allPassages();
    const hsToday = todayIndex(today);
    const hemshech = hsCertificates(today, undefined, hsDone).map((c) => {
      const toRead = c.maamar.passages.find((p) => !hsIsDone(hsDone, p.id) && passageDate(passages.findIndex((x) => x.p === p)) <= today) ?? c.maamar.passages[0];
      return { ...c, ready: c.progress.parts, href: `#/hemshech/${toRead.id}` };
    });
    const hsMissed = passages.find((x, k) => k <= hsToday && !hsIsDone(hsDone, x.p.id));
    const hsTracker = {
      read: passages.filter((x) => hsIsDone(hsDone, x.p.id)).length,
      total: passages.length,
      pastRead: passages.filter((x, k) => k <= hsToday && hsIsDone(hsDone, x.p.id)).length,
      past: hsToday + 1,
      missed: hsMissed && { id: hsMissed.p.id, date: passageDate(passages.indexOf(hsMissed)) },
    };
    // «Иврит Танаха»: 100 / 300 / 500 words confirmed by the review (src/core/words.ts)
    const words = wordsCertificates(readWordStore());
    // children: «Знаток слов главы» — every word of a portion's lessons on three stars («Слова Торы», src/core/torahWords.ts)
    const torahWordsCerts = torahWordsCertificates(torahWords(LESSONS, 'ru'), readStars());
    return { torah, tanakh, tracker, hemshech, hsTracker, words, torahWords: torahWordsCerts };
  }, []);
}

function certTitle(c: Certificate, t: ReturnType<typeof useI18n>['t']) {
  return c.kind === 'torah'
    ? t(`academy.master.${c.teacher!}`)
    : c.kind === 'hemshech'
      ? t('academy.master.hemshech')
      : c.kind === 'words'
        ? t('academy.master.words')
        : c.kind === 'torahWords'
          ? t('academy.master.torahWords')
          : t('academy.master.tanakh');
}

/** Under the title: the book (with its Hebrew name), or the discourse of «Хасидут» (no Hebrew there). */
function certBook(c: Certificate, t: ReturnType<typeof useI18n>['t'], lang: Lang) {
  if (c.kind === 'hemshech') return <>{t('academy.maamar', { name: c.book.name[lang] })}</>;
  return (
    <>
      {t('academy.book', { name: c.book.name[lang] })} · <span className="he" lang="he">{c.book.he}</span>
    </>
  );
}

function Bar({ p }: { p: Progress }) {
  const v = pct(p);
  return (
    <div className="ac-bar" role="img" aria-label={`${v}%`}>
      <span style={{ width: `${Math.min(100, v)}%` }} />
      <i style={{ insetInlineStart: `${PASS_PCT}%` }} />
    </div>
  );
}

/**
 * A certificate with its progress. `reading` — the adults' mode: the Torah certificate by reading — the bar and the
 * numbers are the «Проверь себя» answers, the button opens the lessons to read.
 */
function Card({ c, p: game, href, extra, readHref, reading }: { c: Certificate; p: Progress; href: string; extra: string; readHref?: string; reading?: boolean }) {
  const p: Progress = reading && game.read ? { ...game, ...game.read, earned: game.earned } : game;
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const color = c.kind === 'torah' ? TEACHERS[c.teacher!].color : c.section === 'neviim' ? 'tchelet' : 'gold';
  return (
    <li className={`ac-card t-${color}${p.earned ? ' earned' : ''}`}>
      <div className="ac-seal" aria-hidden="true">
        {p.earned ? '🎓' : <span className="he">{c.book.he.slice(0, 1)}</span>}
      </div>
      <div className="ac-body">
        <h3>
          {certTitle(c, t)}
          <small>
            {t('academy.book', { name: c.book.name[lang] })} · <span className="he" lang="he">{c.book.he}</span>
          </small>
        </h3>
        <Bar p={p} />
        <p className="ac-meta">
          {/* «Вопросы к отрывку» are right or wrong answers too; before the first test — only the days */}
          {c.kind === 'torah' || p.max > 0
            ? `${t(reading || c.kind !== 'torah' ? 'academy.readPoints' : 'academy.points', { got: p.got, max: p.max, pct: pct(p) })} · `
            : ''}
          {extra}
        </p>
        {!reading && readHref && p.read && p.read.max > 0 && (
          <p className="ac-meta ac-read">
            {t('academy.readPath', { got: p.read.got, max: p.read.max, done: p.read.done, parts: p.read.parts })}
          </p>
        )}
        {p.earned ? (
          <p className="ac-ok">{t('academy.earned')}</p>
        ) : !p.complete ? (
          <p className="ac-wait">{c.kind === 'torah' ? t('academy.waitBook') : t('academy.waitQuiz', { ready: (c as { ready?: number }).ready ?? 0, parts: p.parts })}</p>
        ) : (
          <p className="ac-wait">{t('academy.need', { pass: PASS_PCT })}</p>
        )}
        <div className="ac-actions">
          {p.earned ? (
            <a className="btn" href={`#/academy/${c.id}`}>
              {t('academy.open')}
            </a>
          ) : (
            <>
              <a className="btn" href={href}>
                {t(reading ? 'academy.readBtn' : 'academy.start')}
              </a>
              {!reading && readHref && p.read && p.read.max > 0 && (
                <a className="btn ghost" href={readHref}>
                  {t('academy.readBtn')}
                </a>
              )}
              <a className="btn ghost" href={`#/academy/${c.id}?sample`}>
                {t('academy.sample')}
              </a>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

/**
 * A certificate of the Prophets and Writings: by reading — every passage of the book marked «Я прочитал(а)» (100 %);
 * with points when «Вопросы к отрывку» of all its days are passed too. The bar is the passages read.
 */
function TanakhCard({ c, p, href, quizHref, ready }: { c: Certificate; p: Progress; href: string; quizHref?: string; ready: number }) {
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const seen = p.seen ?? { done: 0, parts: p.parts };
  const readPct = seen.parts ? Math.round((100 * seen.done) / seen.parts) : 0;
  const hs = c.kind === 'hemshech';
  return (
    <li className={`ac-card t-${c.section === 'neviim' || hs ? 'tchelet' : 'gold'}${p.earned ? ' earned' : ''}`}>
      <div className="ac-seal" aria-hidden="true">
        {p.earned ? '🎓' : hs ? '📜' : <span className="he">{c.book.he.slice(0, 1)}</span>}
      </div>
      <div className="ac-body">
        <h3>
          {certTitle(c, t)}
          <small>{certBook(c, t, lang)}</small>
        </h3>
        <div className="ac-bar" role="img" aria-label={`${readPct}%`}>
          <span style={{ width: `${Math.min(100, readPct)}%` }} />
        </div>
        <p className="ac-meta">{t('academy.readDays', { done: seen.done, parts: seen.parts, pct: readPct })}</p>
        <p className="ac-meta ac-read">
          {t('academy.days', { done: p.done, parts: p.parts })}
          {p.max > 0 && ` · ${t('academy.readPoints', { got: p.got, max: p.max, pct: pct(p) })}`}
        </p>
        {p.earned ? (
          <p className="ac-ok">{t(p.scored ? 'academy.earnedPoints' : hs ? 'academy.hsEarnedRead' : 'academy.earnedRead', { pct: pct(p) })}</p>
        ) : (
          <p className="ac-wait">{t(hs ? 'academy.hsNeedRead' : 'academy.needRead', { pass: PASS_PCT })}</p>
        )}
        {!p.scored && !p.complete && <p className="ac-wait">{t('academy.waitQuiz', { ready, parts: p.parts })}</p>}
        <div className="ac-actions">
          {p.earned && (
            <a className="btn" href={`#/academy/${c.id}`}>
              {t('academy.open')}
            </a>
          )}
          {seen.done < seen.parts && (
            <a className={`btn${p.earned ? ' ghost' : ''}`} href={href}>
              {t('academy.readBtn')}
            </a>
          )}
          {quizHref && (
            <a className="btn ghost" href={quizHref}>
              {t('quiz.title')}
            </a>
          )}
          {!p.earned && (
            <a className="btn ghost" href={`#/academy/${c.id}?sample`}>
              {t('academy.sample')}
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

/** The reader's tracker of the three-year cycle: passages read in each section; the first past day left unread. */
function ReadTracker({ rows }: { rows: { section: 'neviim' | 'ketuvim'; read: number; total: number; pastRead: number; past: number; missed?: string }[] }) {
  const { t, locale } = useI18n();
  return (
    <div className="ac-tracker">
      <h3>{t('academy.trackerTitle')}</h3>
      {rows.map((r) => {
        const v = r.total ? Math.round((100 * r.read) / r.total) : 0;
        return (
          <div key={r.section} className={`ac-track t-${r.section === 'neviim' ? 'tchelet' : 'gold'}`}>
            <p className="ac-track-h">
              <b>{t(`tanakh.${r.section}`)}</b> {t('academy.trackerRead', { n: r.read, total: r.total, pct: v })}
            </p>
            <div className="ac-bar" role="img" aria-label={`${v}%`}>
              <span style={{ width: `${Math.min(100, v)}%` }} />
            </div>
            <p className="ac-meta">
              {t('academy.trackerPast', { n: r.pastRead, total: r.past })}
              {r.missed && (
                <>
                  {' · '}
                  <a href={`#/${r.section}/${r.missed}`}>{t('academy.trackerMissed', { date: civilDate(r.missed, locale) })}</a>
                </>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** The reader's tracker of «Хасидут»: passages read, of the days already past, the first one left unread. */
function HsTracker({ r }: { r: { read: number; total: number; pastRead: number; past: number; missed?: { id: string; date: string } } }) {
  const { t, locale } = useI18n();
  const v = r.total ? Math.round((100 * r.read) / r.total) : 0;
  return (
    <div className="ac-tracker">
      <div className="ac-track t-tchelet">
        <p className="ac-track-h">
          <b>{t('hs.menuLbl')}</b> {t('academy.trackerRead', { n: r.read, total: r.total, pct: v })}
        </p>
        <div className="ac-bar" role="img" aria-label={`${v}%`}>
          <span style={{ width: `${Math.min(100, v)}%` }} />
        </div>
        <p className="ac-meta">
          {t('academy.hsTrackerPast', { n: r.pastRead, total: r.past })}
          {r.missed && (
            <>
              {' · '}
              <a href={`#/hemshech/${r.missed.id}`}>{t('academy.trackerMissed', { date: civilDate(r.missed.date, locale) })}</a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/** The rector's signature: a handwritten stroke in ink, drawn as a vector so it prints sharp. */
function RectorSignature() {
  return (
    <svg className="cert-sig" viewBox="0 0 240 80" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path
        strokeWidth={2.1}
        d="M14 58C20 40 30 18 36 14C42 10 40 30 34 46C30 56 26 62 28 60C34 50 44 30 52 30C58 30 52 46 50 52C49 56 54 54 58 48C62 42 66 38 68 42C70 46 64 54 68 54C72 54 78 40 84 40C88 40 84 50 86 52C90 54 96 36 104 28C110 22 114 20 110 34C106 48 100 60 104 58C110 54 116 42 122 42C128 42 122 54 128 54C134 54 140 40 146 40C150 40 146 52 152 52C160 52 170 36 180 34"
      />
      <path strokeWidth={1.6} d="M22 66C70 60 140 58 222 50" />
      <path strokeWidth={1.8} d="M186 30C196 26 206 30 200 38C196 44 188 42 194 36" />
    </svg>
  );
}

/**
 * «Иврит Танаха»: a certificate for 100 / 300 / 500 words — only the words confirmed by the review count (remembered on a
 * card after «Знаю» or after learning), not the marks alone. The bar is the confirmed words.
 */
function WordsCard({ c, p, href = '#/words' }: { c: Certificate; p: Progress; href?: string }) {
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const v = p.max ? Math.round((100 * p.got) / p.max) : 0;
  return (
    <li className={`ac-card t-${c.kind === 'torahWords' ? 'gold' : 'tchelet'}${p.earned ? ' earned' : ''}`}>
      <div className="ac-seal" aria-hidden="true">
        {p.earned ? '🎓' : <span className="he">{c.kind === 'torahWords' ? c.book.he.slice(0, 1) : 'מ'}</span>}
      </div>
      <div className="ac-body">
        <h3>
          {certTitle(c, t)}
          <small>
            {c.book.name[lang]} · <span className="he" lang="he">{c.book.he}</span>
          </small>
        </h3>
        <div className="ac-bar" role="img" aria-label={`${v}%`}>
          <span style={{ width: `${Math.min(100, v)}%` }} />
        </div>
        {c.kind === 'torahWords' ? (
          <p className="ac-meta">{t('academy.twMeta', { got: p.got, max: p.max })}</p>
        ) : (
          <p className="ac-meta">{t('academy.wordsMeta', { got: p.got, max: p.max, known: p.done })}</p>
        )}
        {p.earned ? (
          <p className="ac-ok">{t('academy.earned')}</p>
        ) : (
          <p className="ac-wait">{c.kind === 'torahWords' ? t('academy.twNeed') : t('academy.wordsNeed', { n: p.max })}</p>
        )}
        <div className="ac-actions">
          {p.earned ? (
            <a className="btn" href={`#/academy/${c.id}`}>
              {t('academy.open')}
            </a>
          ) : (
            <>
              <a className="btn" href={href}>
                {c.kind === 'torahWords' ? t('tw.title') : t('words.mine')}
              </a>
              <a className="btn ghost" href={`#/academy/${c.id}?sample`}>
                {t('academy.sample')}
              </a>
            </>
          )}
        </div>
      </div>
    </li>
  );
}

const NAME_KEY = 'niflaot:cert-name';
const POINTS_KEY = 'niflaot:cert-points';

/**
 * The result printed on a certificate, or null when it has none: a Torah certificate — the points of the way it was
 * earned (the game, else «Проверь себя»); the Prophets and Writings — the quiz, only when it was passed (with points).
 */
function certResult(c: Certificate, p: Progress): number | null {
  if (c.kind !== 'torah') return p.scored ? pct(p) : null;
  if (p.max > 0 && p.got >= PASS * p.max) return pct(p);
  return p.read && p.read.max ? Math.round((100 * p.read.got) / p.read.max) : null;
}

/** The certificate itself: on screen and on paper (A4 landscape); without the result — a sample. */
function CertificateView({ c, p, sample }: { c: Certificate; p: Progress; sample: boolean }) {
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem(NAME_KEY) ?? '';
    } catch {
      return '';
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(NAME_KEY, name);
    } catch {}
  }, [name]);
  const [showPoints, setShowPoints] = useState(() => {
    try {
      return localStorage.getItem(POINTS_KEY) !== '0';
    } catch {
      return true;
    }
  });
  const togglePoints = (v: boolean) => {
    setShowPoints(v);
    try {
      localStorage.setItem(POINTS_KEY, v ? '1' : '0');
    } catch {}
  };
  const result = sample ? null : certResult(c, p);
  const today = localToday();
  const torahBook = TORAH_BOOKS.find((b) => b.id === c.book.id);
  return (
    <>
      <div className="ac-tools no-print">
        <a href="#/academy">{t('cert.back')}</a>
        {sample && <p className="tk-note">{t('cert.sampleNote')}</p>}
        <label className="ac-name">
          <span>{t('cert.name')}</span>
          <input value={name} maxLength={60} placeholder={t('cert.namePh')} onChange={(e) => setName(e.target.value)} />
          <small>{t('cert.nameNote')}</small>
        </label>
        {/* a certificate is given with or without the points: the learner chooses */}
        {result !== null && (
          <label className="ac-points">
            <input type="checkbox" checked={showPoints} onChange={(e) => togglePoints(e.target.checked)} />
            <span>{t('cert.showPoints', { pct: result })}</span>
          </label>
        )}
        <button type="button" className="btn" onClick={() => window.print()}>
          {t('cert.print')}
        </button>
      </div>
      <section className={`cert${sample ? ' sample' : ''}`} aria-label={t('cert.title')}>
        {sample && (
          <div className="cert-wm" aria-hidden="true">
            {t('cert.sample')}
          </div>
        )}
        <div className="cert-logos">
          <img src={NIFLAOT_LOGO} alt="Niflaot" />
          <span>
            {PARTNERS.map((x) => (
              <img key={x.id} src={x.logo} alt={x.name} />
            ))}
          </span>
        </div>
        <p className="cert-kicker">{t('cert.title')}</p>
        <h1 className="cert-title">{certTitle(c, t)}</h1>
        <p className="cert-awarded">{t('cert.awarded')}</p>
        <p className="cert-name">{name.trim() || ' '}</p>
        <p className="cert-for">
          {c.kind === 'torah' ? t('cert.forTorah') : c.kind === 'hemshech' ? t('cert.forHemshech') : c.kind === 'words' ? t('cert.forWords') : c.kind === 'torahWords' ? t('cert.forTorahWords') : t('cert.forTanakh')}
        </p>
        <p className="cert-book">
          {c.kind === 'hemshech' && <>{HEMSHECH.title[lang]} · </>}
          {c.book.name[lang]}{' '}
          {c.kind !== 'hemshech' && (
            <span className="he" lang="he">
              {torahBook ? torahBook.he : c.book.he}
            </span>
          )}
        </p>
        {!sample && c.kind === 'words' && <p className="cert-result">{t('cert.wordsAll', { n: p.max })}</p>}
        {!sample && c.kind === 'torahWords' && <p className="cert-result">{t('cert.twAll', { n: p.max })}</p>}
        {!sample && (c.kind === 'tanakh' || c.kind === 'hemshech') && (
          <p className="cert-result">{t(c.kind === 'hemshech' ? 'cert.hsReadAll' : 'cert.readAll', { n: p.seen?.parts ?? p.parts })}</p>
        )}
        {result !== null && showPoints && <p className="cert-result">{t('cert.result', { pct: result })}</p>}
        {/* date · QR code to the site · the rector's signature */}
        <div className="cert-foot">
          <div className="cert-sign">
            <span className="cert-sign-v">
              {civilDate(today, locale)}
              <span className="he" lang="he">
                {jewishDate(today)}
              </span>
            </span>
            <span className="cert-sign-l">{t('cert.date')}</span>
          </div>
          <div className="cert-qr">
            <QrCode value={routeLink('', 'qr', locale)} size={72} title={t('cert.qr')} />
            <span>niflaot.mychitas.app</span>
          </div>
          <div className="cert-sign">
            <span className="cert-sign-v">
              <RectorSignature />
            </span>
            <span className="cert-sign-l">
              {t('cert.rector')}
              {RECTOR.name && <> · {RECTOR.name[lang]}</>}
            </span>
          </div>
        </div>
        <p className="cert-academy">{t('cert.academy')}</p>
      </section>
    </>
  );
}

/**
 * `#/academy` — «Академия»: the certificates for the books of the Torah (a teacher's lessons in all the portions of a book)
 * and of the Prophets and Writings («Вопросы к отрывку» of every day the book is read), with the progress on this device;
 * `#/academy/<id>` — an earned certificate to print (`?sample` — a sample of one not earned yet).
 */
export function AcademyPage({ id, sample }: { id?: string; sample?: boolean }) {
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const { token } = useAccount();
  const { torah, tanakh, tracker, hemshech, hsTracker, words, torahWords: twCerts } = useCertificates();
  const adults = useMode() === 'adults';
  // the AI assistant (✦) knows the certificates and the progress
  useEffect(() => {
    const rows = [...torah, ...tanakh, ...hemshech, ...words, ...twCerts].map((c) => ({
      kind: c.kind,
      title: certTitle(c, t),
      book: c.book.name[lang],
      p: c.progress,
      extra:
        c.kind === 'torah'
          ? t('academy.lessons', { done: c.progress.done, parts: c.progress.parts })
          : c.kind === 'words'
            ? t('academy.wordsMeta', { got: c.progress.got, max: c.progress.max, known: c.progress.done })
            : c.kind === 'torahWords'
            ? t('academy.twMeta', { got: c.progress.got, max: c.progress.max })
            : `${t('academy.readDays', { done: c.progress.seen?.done ?? 0, parts: c.progress.parts, pct: Math.round((100 * (c.progress.seen?.done ?? 0)) / (c.progress.parts || 1)) })}; ${t('academy.days', { done: c.progress.done, parts: c.progress.parts })}`,
    }));
    setOtherPage({ kind: 'academy', context: () => academyContext(rows) });
    return () => setOtherPage(null);
  }, [torah, tanakh, hemshech, words, twCerts, t, lang]);
  useEffect(() => {
    document.title = `${t('academy.h1')} · ${t('app.title')}`;
  }, [t]);
  // the Torah certificates of one teacher, by book: the children by playing, the adults by reading
  const torahOf = (teacher: TeacherId) =>
    TORAH_BOOKS.map((b) => {
      const cs = torah.filter((c) => c.book.id === b.id && c.teacher === teacher);
      if (!cs.length) return null;
      return (
        <section key={b.id}>
          <h3 className="parsha-h">
            {b.name[lang]} <span className="he">{b.he}</span>
          </h3>
          <ul className="ac-list">
            {cs.map((c) =>
              adults ? (
                <Card key={c.id} c={c} p={c.progress} href={c.readHref} reading extra={t('academy.readLessons', { done: c.progress.read?.done ?? 0, parts: c.progress.read?.parts ?? 0 })} />
              ) : (
                <Card key={c.id} c={c} p={c.progress} href={c.href} extra={t('academy.lessons', { done: c.progress.done, parts: c.progress.parts })} />
              ),
            )}
          </ul>
        </section>
      );
    });
  const facs = adults ? FACULTIES.adults : FACULTIES.kids;
  const certsOf = (f: FacultyId) =>
    f === 'lashon'
      ? adults
        ? words
        : twCerts
      : f === 'gematria'
        ? torah.filter((c) => c.teacher === 'baal-haturim')
        : f === 'rebbe'
          ? torah.filter((c) => c.teacher === 'rebbe')
          : f === 'tanakh'
            ? tanakh
            : f === 'hemshech'
              ? hemshech
              : [];
  const earned = Object.fromEntries(facs.map((f) => [f, certsOf(f).filter((c) => c.progress.earned).length])) as Record<FacultyId, number>;
  const total = Object.fromEntries(facs.map((f) => [f, certsOf(f).length])) as Record<FacultyId, number>;
  const faculty = (f: FacultyId) => {
    switch (f) {
      case 'lashon':
        // children: «Слова Торы» — a certificate for every portion; adults: «Иврит Танаха» — 100 … 1000 words confirmed by the review
        return adults ? (
          <ul className="ac-list">
            {words.map((c) => (
              <WordsCard key={c.id} c={c} p={c.progress} />
            ))}
          </ul>
        ) : twCerts.length ? (
          <ul className="ac-list">
            {twCerts.map((c) => (
              <WordsCard key={c.id} c={c} p={c.progress} href={c.href} />
            ))}
          </ul>
        ) : null;
      case 'gematria':
        return (
          <>
            <p className="ac-note">{t(adults ? 'academy.torahNoteAdults' : 'academy.torahNote')}</p>
            {torahOf('baal-haturim')}
          </>
        );
      case 'rebbe':
        return (
          <>
            <p className="ac-note">{t(adults ? 'academy.torahNoteAdults' : 'academy.torahNote')}</p>
            {torahOf('rebbe')}
          </>
        );
      case 'nigun':
        // the lessons of the niggunim: no certificate yet — each lesson is a niggun to learn by karaoke
        return (
          <ul className="ng-list">
            {NIGUNIM.map((x) => (
              <li key={x.id}>
                <a href={`#/nigun/${x.id}`}>
                  <b>🎵 {x.title[lang]}</b>
                  <span>{t('nigun.karaoke')}</span>
                </a>
              </li>
            ))}
          </ul>
        );
      case 'tanakh':
        return (
          <>
            <ReadTracker rows={tracker} />
            {tanakh.length ? (
              <ul className="ac-list">
                {tanakh.map((c) => (
                  <TanakhCard key={c.id} c={c} p={c.progress} href={c.href} quizHref={c.quizHref} ready={c.ready} />
                ))}
              </ul>
            ) : (
              <p className="ac-note">{t('academy.empty')}</p>
            )}
          </>
        );
      case 'hemshech':
        // «Ґемшех Самех-Вав»: a certificate for each discourse, by reading — as a book of the Prophets
        return (
          <>
            <HsTracker r={hsTracker} />
            {hemshech.length ? (
              <ul className="ac-list">
                {hemshech.map((c) => (
                  <TanakhCard key={c.id} c={c} p={c.progress} href={c.href} ready={c.ready} />
                ))}
              </ul>
            ) : (
              <p className="ac-note">{t('hs.startsOn', { date: civilDate(passageDate(0), lang) })}</p>
            )}
          </>
        );
    }
  };
  const one = id ? [...torah, ...tanakh, ...hemshech, ...words, ...twCerts].find((c) => c.id === id) : undefined;
  if (one && (one.progress.earned || sample))
    return (
      <>
        <TopBar title={t('academy.title')} />
        <div className="wrap ac ac-one">
          <CertificateView c={one} p={one.progress} sample={!one.progress.earned} />
        </div>
      </>
    );

  return (
    <>
      <TopBar title={t('academy.title')} />
      <div className="wrap ac">
        <header className="tk-head">
          <p className="tk-kicker">🎓 {t('cert.academy')}</p>
          <h1>{t(adults ? 'academy.h1Adults' : 'academy.h1Kids')}</h1>
          <p className="ac-tag">
            <Slogan />
          </p>
          <p className="ac-lead">{t(adults ? 'academy.leadAdults' : 'academy.lead', { pass: PASS_PCT })}</p>
          {!token && <p className="tk-note">{t('academy.guest')}</p>}
        </header>

        {/* the faculties of the mode at a glance: a tap scrolls to the faculty */}
        <nav className={`ac-facs${adults ? '' : ' kids'}`} aria-label={t('academy.facs')}>
          {facs.map((f) => (
            <button
              key={f}
              type="button"
              className={`ac-fac-tile t-${FACULTY[f].color}`}
              onClick={() => document.getElementById(`fac-${f}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <span className="ac-fac-he he" lang="he">
                {FACULTY[f].he}
              </span>
              <b>{t(`academy.fac.${f}`)}</b>
              <small>{t(`academy.fac.${f}.sub`)}</small>
              <span className="ac-fac-n">
                {f === 'nigun' ? t('academy.facLessons', { n: NIGUNIM.length }) : t('academy.facEarned', { n: earned[f], total: total[f] })}
              </span>
            </button>
          ))}
        </nav>

        {facs.map((f) => (
          <section key={f} id={`fac-${f}`} className="ac-fac">
            <h2 className="ac-h2">
              {t(`academy.fac.${f}`)} <span className="he" lang="he">{FACULTY[f].he}</span>
            </h2>
            <p className="ac-fac-sub">{t(`academy.fac.${f}.sub`)}</p>
            <p className="ac-note">{t(`academy.fac.${f}.${adults ? 'a' : 'k'}`, { pass: PASS_PCT })}</p>
            {faculty(f)}
            {LINKS[f][adults ? 'a' : 'k'].length > 0 && (
              <p className="ac-fac-links">
                {LINKS[f][adults ? 'a' : 'k'].map(([href, key]) => (
                  <a key={href} href={href}>
                    {t(key)} →
                  </a>
                ))}
              </p>
            )}
          </section>
        ))}
      </div>
      <Colophon />
    </>
  );
}
