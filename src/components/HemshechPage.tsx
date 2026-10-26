import { Fragment, useEffect, useState } from 'react';
import { AddCourse } from './AddCourse';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { optionOrder } from '../core/quiz';
import { setOtherPage } from '../core/assistant';
import { HEMSHECH, allPassages, hsLang, passageDate, hsIsDone, passageMinutes, readHsStore, todayIndex, useHsDone, useHsQuiz, type HsLang, type HsPassage } from '../core/hemshech';
import { localToday } from '../core/tanakh';
import { civilDate, jewishDate } from '../core/hebrewDate';
import { isAdmin } from '../admin/github';
import { Icon, Sheet } from './ui';

/** The credit the Neirot Foundation asked for: under every passage, with a link to their site. */
function Credit({ lang }: { lang: HsLang }) {
  const { t } = useI18n();
  return (
    <footer className="hs-credit">
      <p>{HEMSHECH.credit[lang]}</p>
      <p className="hs-rights">
        {t('hs.rights')}{' '}
        <a href={HEMSHECH.creditUrl} target="_blank" rel="noopener">
          Neirot.com
        </a>
      </p>
    </footer>
  );
}

/** «Я прочитал(а)» — at the end of the passage, besides the questions: the reading progress (`niflaot:hemshech-done`). */
function DoneCheck({ id, lang }: { id: string; lang: HsLang }) {
  const { t } = useI18n();
  const [store, mark] = useHsDone();
  const done = hsIsDone(store, id);
  const all = allPassages();
  const today = todayIndex(localToday());
  const read = all.filter((x) => hsIsDone(store, x.p.id)).length;
  const missed = all.findIndex((x, k) => k <= today && x.p.id !== id && !hsIsDone(store, x.p.id));
  return (
    <div className={`tk-done no-print${done ? ' on' : ''}`}>
      <label>
        <input type="checkbox" checked={done} onChange={(e) => mark(id, e.target.checked)} />
        <span>{t('tanakh.doneCheck')}</span>
      </label>
      <p>
        {t('hs.doneStat', { n: read, total: all.length })}
        {missed >= 0 && (
          <>
            {' · '}
            <a href={`#/hemshech/${all[missed].p.id}`}>{t('hs.doneFirst', { title: all[missed].p.title[lang] })}</a>
          </>
        )}
      </p>
    </div>
  );
}

function Questions({ p, lang }: { p: HsPassage; lang: HsLang }) {
  const { t } = useI18n();
  const { result, answer, restart } = useHsQuiz(p.id, p.questions.length);
  const finished = result.p.every((x) => x >= 0);
  const right = result.p.filter((x) => x === 0).length;
  return (
    <section className="st-block">
      <h2>{t('hs.questions')}</h2>
      <ol className="qz-list">
        {p.questions.map((q, i) => {
          const picked = result.p[i];
          return (
            <li key={i} className="qz-q">
              <p className="qz-text">
                <span className="qz-num num">{i + 1}</span>
                {q.q[lang]}
              </p>
              <div className="qz-opts" role="group" aria-label={q.q[lang]}>
                {optionOrder(q.o.length, `${p.id}:${i}`).map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`qz-opt${picked >= 0 && k === 0 ? ' ok' : ''}${picked === k && k !== 0 ? ' bad' : ''}`}
                    disabled={picked >= 0}
                    onClick={() => answer(i, k)}
                  >
                    {q.o[k][lang]}
                  </button>
                ))}
              </div>
              {picked >= 0 && (
                <p className={`qz-fb ${picked === 0 ? 'ok' : 'bad'}`} role="status">
                  {picked === 0 ? t('quiz.right') : t('quiz.wrong', { a: q.o[0][lang] })}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      {finished && (
        <div className="qz-result ok">
          <p className="qz-score">{t('quiz.score', { n: right, total: p.questions.length })}</p>
          <div className="qz-actions">
            <button type="button" className="btn ghost" onClick={restart}>
              {t('quiz.again')}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

const shortDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
const weekday = (iso: string, locale: string) => {
  const w = new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));
  return w.charAt(0).toUpperCase() + w.slice(1);
};
/** A passage is open on its day (the admin sees the coming ones ahead). */
const isOpen = (k: number) => passageDate(k) <= localToday() || isAdmin();

/**
 * ‹ / › at the corners of the date bar — the previous / next passage (as on «Пророки», TanakhPage.tsx); a coming
 * passage is reachable too — its page says when it opens.
 */
function Step({ k, dir, lang }: { k: number; dir: 'prev' | 'next'; lang: HsLang }) {
  const { t } = useI18n();
  const all = allPassages();
  if (k < 0 || k >= all.length) return <span className={`tk-step ${dir}`} aria-hidden="true" />;
  const label = t(dir === 'prev' ? 'hs.prev' : 'hs.next');
  return (
    <a className={`tk-step ${dir}`} href={`#/hemshech/${all[k].p.id}`} aria-label={`${label}: ${all[k].p.title[lang]}`} title={label}>
      <Icon name="chevron" size={20} />
      <small>{shortDate(passageDate(k), lang)}</small>
    </a>
  );
}

function Passage({ at, lang, onHelp }: { at: number; lang: HsLang; onHelp: () => void }) {
  const { t } = useI18n();
  const all = allPassages();
  const [showEn, setShowEn] = useState(false);
  const found = all[at];

  // the AI teacher (✦) knows the passage on screen
  useEffect(() => {
    if (!found) return;
    const { m, p } = found;
    setOtherPage({
      kind: 'hemshech',
      context: () =>
        `Page: "${HEMSHECH.title.en}" by the Rebbe Rashab — discourse ${m.title.en} (${m.date.en}), passage "${p.title.en}". ` +
        `English translation by Rabbi A. and Rabbi Y. Markel (© The Neirot Foundation, used with permission).\n\n` +
        `Summary: ${p.summary[lang]}\n\n${p.en.join('\n\n')}`,
    });
    return () => setOtherPage(null);
  }, [found, lang]);
  useEffect(() => {
    if (found) document.title = `${found.p.title[lang]} · ${HEMSHECH.title[lang]} · ${t('app.title')}`;
  }, [found, lang, t]);

  if (!found) return <p className="tk-note">{t('hs.notFound')}</p>;
  const { m, p } = found;
  const date = passageDate(at);
  const today = todayIndex(localToday());
  const isToday = at === today;
  const bar = (
    <nav className="tk-dates no-print" aria-label={t('hs.navLabel')}>
      <Step k={at - 1} dir="prev" lang={lang} />
      <div className="tk-date">
        <b>{isToday ? t('tanakh.today') : weekday(date, lang)}</b>
        <span>{civilDate(date, lang)}</span>
        <span className="he" lang="he">
          {jewishDate(date)}
        </span>
        {!isToday && today >= 0 && (
          <a className="tk-to-today" href="#/hemshech">
            {t('tanakh.toToday')}
          </a>
        )}
      </div>
      <Step k={at + 1} dir="next" lang={lang} />
    </nav>
  );
  const prev = all[at - 1];
  const next = all[at + 1];
  const pager = (
    <nav className="tk-pager no-print" aria-label={t('hs.navLabel')}>
      {prev ? (
        <a className="prev" href={`#/hemshech/${prev.p.id}`}>
          <small>← {t('hs.prev')}</small>
          <b>{prev.p.title[lang]}</b>
          <span>{civilDate(passageDate(at - 1), lang)}</span>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a className="next" href={`#/hemshech/${next.p.id}`}>
          <small>{t('hs.next')} →</small>
          <b>{next.p.title[lang]}</b>
          <span>{isOpen(at + 1) ? civilDate(passageDate(at + 1), lang) : t('hs.opens', { date: civilDate(passageDate(at + 1), lang) })}</span>
        </a>
      )}
    </nav>
  );
  if (!isOpen(at))
    return (
      <>
        {bar}
        <header className="tk-head">
          <p className="tk-kicker">
            {HEMSHECH.title[lang]} · {m.title[lang]} · {t('hs.passageN', { n: m.passages.indexOf(p) + 1, total: m.passages.length })}
          </p>
          <h1>{p.title[lang]}</h1>
          <AddCourse course="hemshech" />
        </header>
        <p className="tk-note">{t('hs.opensOn', { date: civilDate(date, lang) })}</p>
        {pager}
      </>
    );
  const n = m.passages.indexOf(p) + 1;
  const text = p[lang];
  return (
    <article className="hs-passage">
      {bar}
      <header className="tk-head">
        <p className="tk-kicker">
          {HEMSHECH.title[lang]} · {m.title[lang]} · {t('hs.passageN', { n, total: m.passages.length })}
        </p>
        <h1>{p.title[lang]}</h1>
        <p className="tk-day">
          {HEMSHECH.author[lang]} · {t('tanakh.readingTime', { n: passageMinutes(p, lang) })}
        </p>
        <AddCourse course="hemshech" />
      </header>
      <div className="tk-tools no-print">
        {lang !== 'en' ? (
          <label className="hs-en-toggle">
            <input type="checkbox" checked={showEn} onChange={(e) => setShowEn(e.target.checked)} />
            {t('hs.showEn')}
          </label>
        ) : (
          <span />
        )}
        <button type="button" className="hs-about" onClick={onHelp}>
          <Icon name="help" size={17} />
          <span>{t('hs.about')}</span>
        </button>
      </div>
      <div className="st-summary">
        <b>{t('hs.summary')}</b> {p.summary[lang]}
      </div>
      <div className="hs-text">
        {text.map((s, i) => (
          <div key={i} className="st-par">
            {showEn && lang !== 'en' && (
              <p className="st-en" lang="en">
                {p.en[i]}
              </p>
            )}
            <p className="st-ru" lang={lang}>
              {lang === 'ru' ? s.replace(/([БГ])-(?=г|спод)/g, '$1‑') : s}
            </p>
          </div>
        ))}
      </div>
      <Credit lang={lang} />
      <DoneCheck id={p.id} lang={lang} />
      <Questions key={p.id} p={p} lang={lang} />
      {pager}
    </article>
  );
}


/** «О разделе»: what «Ґемшех Самех-Вав» is, how it is learnt, and all the passages (with the reading marks). */
function About({ open, onClose, lang, at }: { open: boolean; onClose: () => void; lang: HsLang; at: number }) {
  const { t } = useI18n();
  const store = readHsStore();
  const [done] = useHsDone();
  const all = allPassages();
  return (
    <Sheet open={open} onClose={onClose} title={HEMSHECH.title[lang]} closeLabel={t('menu.close')}>
      <p className="tk-range">{HEMSHECH.author[lang]}</p>
      <p>{t('hs.lead')}</p>
      {HEMSHECH.maamarim.map((m) => (
        <Fragment key={m.id}>
          <h3 className="sheet-h3">{m.title[lang]}</h3>
          <p className="sheet-note">{m.date[lang]}</p>
          <ol className="st-list">
            {m.passages.map((p) => {
              const r = store[p.id];
              const k = all.findIndex((x) => x.p === p);
              return (
                <li key={p.id} className={isOpen(k) ? undefined : 'hs-locked'}>
                  {isOpen(k) ? (
                    <a href={`#/hemshech/${p.id}`} onClick={onClose} aria-current={k === at ? 'page' : undefined}>
                      {p.title[lang]}
                    </a>
                  ) : (
                    <span>{p.title[lang]}</span>
                  )}{' '}
                  <span className="hs-min">
                    · {civilDate(passageDate(k), lang)} · {t('tanakh.readingTime', { n: passageMinutes(p, lang) })}
                  </span>
                  {hsIsDone(done, p.id) && <span className="st-done"> · {t('hs.read')}</span>}
                  {r && r.best >= 0 && (
                    <span className="st-done">
                      {' '}
                      ✓ {r.best}/{r.n}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </Fragment>
      ))}
      <Credit lang={lang} />
    </Sheet>
  );
}

/**
 * `#/hemshech`, `#/hemshech/<passage>` — «Ґемшех Самех-Вав» of the Rebbe Rashab (src/core/hemshech.ts):
 * the passage of the day (without an id — today's), in the site's language, with the English source on request,
 * a short summary, questions and the translators' credit; the days — in the date bar, as on «Пророки»;
 * what the section is and all its passages — in «О разделе».
 */
export function HemshechPage({ passage }: { passage?: string }) {
  const { t, locale } = useI18n();
  const lang = hsLang(locale);
  const [help, setHelp] = useState(false);
  const all = allPassages();
  const today = todayIndex(localToday());
  const at = passage ? all.findIndex((x) => x.p.id === passage) : today;
  useEffect(() => {
    if (at < 0) document.title = `${HEMSHECH.title[lang]} · ${t('app.title')}`;
  }, [at, lang, t]);
  return (
    <>
      <TopBar title={t('hs.short')} />
      <div className="wrap tk hs">
        {at >= 0 ? (
          <Passage key={at} at={at} lang={lang} onHelp={() => setHelp(true)} />
        ) : passage ? (
          <p className="tk-note">{t('hs.notFound')}</p>
        ) : (
          <>
            <header className="tk-head">
              <p className="tk-kicker">{t('hs.kicker')}</p>
              <h1>{HEMSHECH.title[lang]}</h1>
            </header>
            <p className="tk-note">{t('hs.startsOn', { date: civilDate(passageDate(0), lang) })}</p>
            <p>
              <button type="button" className="btn ghost" onClick={() => setHelp(true)}>
                {t('hs.about')}
              </button>
            </p>
          </>
        )}
      </div>
      <About open={help} onClose={() => setHelp(false)} lang={lang} at={at} />
      <Colophon />
    </>
  );
}
