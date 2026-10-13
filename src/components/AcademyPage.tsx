import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { LESSONS } from '../lessons';
import { TEACHERS } from '../lessons/teachers';
import { lessonScore } from '../core/progress';
import { readScore, readStore } from '../core/readCheck';
import { useMode } from '../core/mode';
import { CYCLE, localToday } from '../core/tanakh';
import { readQuizStore, quizReady } from '../core/quiz';
import { NIFLAOT_LOGO, PARTNERS } from '../core/partners';
import { civilDate, jewishDate } from '../core/hebrewDate';
import { useAccount } from '../core/account';
import { routeLink } from '../core/site';
import { QrCode } from './QrCode';
import { setOtherPage } from '../core/assistant';
import { academyContext } from '../core/assistantPages';
import {
  PASS,
  RECTOR,
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

/** Every certificate with its progress on this device. */
function useCertificates() {
  return useMemo(() => {
    const today = localToday();
    const store = readQuizStore();
    const torah = torahCertificates(LESSONS).map((c) => {
      const legacy = (slug: string) => LESSONS.find((l) => l.slug === slug)?.legacyStorageKey;
      const rs = readStore();
      const progress = torahProgress(c, (slug) => lessonScore(slug, legacy(slug)), torahBookComplete(c.book.id as never), (l) => readScore(l, rs));
      // the reading path starts at the first lesson whose «Проверь себя» isn't finished
      const toRead = c.lessons.find((l) => { const x = readScore(l, rs); return x.done < x.n; }) ?? c.lessons[0];
      return { ...c, progress, href: `#/${c.lessons[0].slug}`, readHref: `#/${toRead.slug}/read` };
    });
    const tanakh = tanakhCertificates(CYCLE, today).map((c) => {
      const progress = tanakhProgress(c, store, quizReady);
      const ready = c.days.filter((d) => quizReady(d.date)).length;
      const first = c.days.find((d) => quizReady(d.date) && !(store[`${d.date}:${c.section}`]?.best >= 0)) ?? c.days[0];
      return { ...c, progress, ready, href: `#/${c.section}/${first.date}/quiz` };
    });
    return { torah, tanakh };
  }, []);
}

function certTitle(c: Certificate, t: ReturnType<typeof useI18n>['t']) {
  return c.kind === 'torah' ? t(`academy.master.${c.teacher!}`) : t('academy.master.tanakh');
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

const NAME_KEY = 'niflaot:cert-name';

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
        <p className="cert-for">{c.kind === 'torah' ? t('cert.forTorah') : t('cert.forTanakh')}</p>
        <p className="cert-book">
          {c.book.name[lang]}{' '}
          <span className="he" lang="he">
            {torahBook ? torahBook.he : c.book.he}
          </span>
        </p>
        {!sample && <p className="cert-result">{t('cert.result', { pct: pct(p) })}</p>}
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
  const { torah, tanakh } = useCertificates();
  const adults = useMode() === 'adults';
  // the AI assistant (✦) knows the certificates and the progress
  useEffect(() => {
    const rows = [...torah, ...tanakh].map((c) => ({
      kind: c.kind,
      title: certTitle(c, t),
      book: c.book.name[lang],
      p: c.progress,
      extra: c.kind === 'torah' ? t('academy.lessons', { done: c.progress.done, parts: c.progress.parts }) : t('academy.days', { done: c.progress.done, parts: c.progress.parts }),
    }));
    setOtherPage({ kind: 'academy', context: () => academyContext(rows) });
    return () => setOtherPage(null);
  }, [torah, tanakh, t, lang]);
  useEffect(() => {
    document.title = `${t('academy.h1')} · ${t('app.title')}`;
  }, [t]);
  const one = id ? [...torah, ...tanakh].find((c) => c.id === id) : undefined;
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
          <h1>{t('academy.h1')}</h1>
          <p className="ac-lead">{t(adults ? 'academy.leadAdults' : 'academy.lead', { pass: PASS_PCT })}</p>
          {!token && <p className="tk-note">{t('academy.guest')}</p>}
        </header>

        {/* by the mode: the children — the Torah certificates by playing; the adults — by reading, and the Prophets and Writings */}
        <h2 className="ac-h2">{t('academy.torah')}</h2>
        <p className="ac-note">{t(adults ? 'academy.torahNoteAdults' : 'academy.torahNote')}</p>
        {TORAH_BOOKS.map((b) => {
          const cs = torah.filter((c) => c.book.id === b.id);
          if (!cs.length) return null;
          return (
            <section key={b.id}>
              <h3 className="parsha-h">
                {b.name[lang]} <span className="he">{b.he}</span>
              </h3>
              <ul className="ac-list">
                {cs.map((c) => (
                  adults ? (
                    <Card key={c.id} c={c} p={c.progress} href={c.readHref} reading extra={t('academy.readLessons', { done: c.progress.read?.done ?? 0, parts: c.progress.read?.parts ?? 0 })} />
                  ) : (
                    <Card key={c.id} c={c} p={c.progress} href={c.href} extra={t('academy.lessons', { done: c.progress.done, parts: c.progress.parts })} />
                  )
                ))}
              </ul>
            </section>
          );
        })}

        {adults && (
          <>
            <h2 className="ac-h2">{t('academy.tanakh')}</h2>
            <p className="ac-note">{t('academy.tanakhNote')}</p>
            {tanakh.length ? (
              <ul className="ac-list">
                {tanakh.map((c) => (
                  <Card key={c.id} c={c} p={c.progress} href={c.href} extra={t('academy.days', { done: c.progress.done, parts: c.progress.parts })} />
                ))}
              </ul>
            ) : (
              <p className="ac-note">{t('academy.empty')}</p>
            )}
          </>
        )}
      </div>
      <Colophon />
    </>
  );
}
