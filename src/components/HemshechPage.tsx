import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { optionOrder } from '../core/quiz';
import { setOtherPage } from '../core/assistant';
import { HEMSHECH, allPassages, hsLang, passageDate, passageMinutes, readHsStore, todayIndex, useHsQuiz, type HsLang, type HsPassage } from '../core/hemshech';
import { localToday } from '../core/tanakh';
import { civilDate, jewishDate } from '../core/hebrewDate';
import { isAdmin } from '../admin/github';

/** The credit the Neirot Foundation asked for: under every passage, with a link to their site. */
function Credit({ lang }: { lang: HsLang }) {
  const { t } = useI18n();
  return (
    <footer className="hs-credit">
      <p>{HEMSHECH.credit[lang]}</p>
      <p>
        <a href={HEMSHECH.creditUrl} target="_blank" rel="noopener">
          {t('hs.neirot')} ↗
        </a>
      </p>
    </footer>
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

function Passage({ id, lang }: { id: string; lang: HsLang }) {
  const { t } = useI18n();
  const all = allPassages();
  const at = all.findIndex((x) => x.p.id === id);
  const [showEn, setShowEn] = useState(false);
  const found = at >= 0 ? all[at] : undefined;

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
  // a passage opens on its day; the admin sees the coming ones ahead
  if (date > localToday() && !isAdmin())
    return (
      <>
        <p className="tk-note">{t('hs.opensOn', { date: civilDate(date, lang) })}</p>
        <p>
          <a href="#/hemshech">{t('hs.all')}</a>
        </p>
      </>
    );
  const prev = all[at - 1];
  const next = all[at + 1];
  const n = m.passages.indexOf(p) + 1;
  const text = p[lang];
  return (
    <article className="hs-passage">
      <header className="tk-head">
        <p className="tk-kicker">
          {civilDate(date, lang)} ·{' '}
          <span className="he" lang="he">
            {jewishDate(date)}
          </span>
        </p>
        <p className="tk-kicker">
          {HEMSHECH.title[lang]} · {m.title[lang]} · {t('hs.passageN', { n, total: m.passages.length })}
        </p>
        <h1>{p.title[lang]}</h1>
        <p className="tk-day">
          {HEMSHECH.author[lang]} · {t('tanakh.readingTime', { n: passageMinutes(p, lang) })}
        </p>
      </header>
      <div className="st-summary">
        <b>{t('hs.summary')}</b> {p.summary[lang]}
      </div>
      {lang !== 'en' && (
        <label className="hs-en-toggle no-print">
          <input type="checkbox" checked={showEn} onChange={(e) => setShowEn(e.target.checked)} />
          {t('hs.showEn')}
        </label>
      )}
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
      <Questions key={p.id} p={p} lang={lang} />
      <nav className="tk-nav st-nav no-print">
        {prev ? <a href={`#/hemshech/${prev.p.id}`}>← {prev.p.title[lang]}</a> : <span />}
        <a href="#/hemshech">{t('hs.all')}</a>
        {next && (passageDate(at + 1) <= localToday() || isAdmin()) ? <a href={`#/hemshech/${next.p.id}`}>{next.p.title[lang]} →</a> : <span />}
      </nav>
    </article>
  );
}

function Index({ lang }: { lang: HsLang }) {
  const { t } = useI18n();
  const store = readHsStore();
  const all = allPassages();
  const today = todayIndex(localToday());
  const admin = isAdmin();
  useEffect(() => {
    document.title = `${HEMSHECH.title[lang]} · ${t('app.title')}`;
  }, [lang, t]);
  return (
    <>
      <header className="tk-head">
        <p className="tk-kicker">{t('hs.kicker')}</p>
        <h1>{HEMSHECH.title[lang]}</h1>
        <p className="tk-range">{HEMSHECH.author[lang]}</p>
      </header>
      <p className="ac-lead">{t('hs.lead')}</p>
      {today >= 0 ? (
        <a className="hs-today" href={`#/hemshech/${all[today].p.id}`}>
          <span className="hs-today-k">
            {passageDate(today) === localToday() ? t('hs.today') : t('hs.last')} · {civilDate(passageDate(today), lang)}
          </span>
          <b>{all[today].p.title[lang]}</b>
          <span className="hs-min">{t('tanakh.readingTime', { n: passageMinutes(all[today].p, lang) })} →</span>
        </a>
      ) : (
        <p className="tk-note">{t('hs.startsOn', { date: civilDate(passageDate(0), lang) })}</p>
      )}
      {HEMSHECH.maamarim.map((m) => (
        <section key={m.id} className="st-block">
          <h2>{m.title[lang]}</h2>
          <p className="tk-day">{m.date[lang]}</p>
          <ol className="st-list">
            {m.passages.map((p) => {
              const r = store[p.id];
              const k = all.findIndex((x) => x.p === p);
              const open = k <= today || admin;
              return (
                <li key={p.id} className={open ? undefined : 'hs-locked'}>
                  {open ? <a href={`#/hemshech/${p.id}`}>{p.title[lang]}</a> : <span>{p.title[lang]}</span>}{' '}
                  <span className="hs-min">
                    · {civilDate(passageDate(k), lang)} · {t('tanakh.readingTime', { n: passageMinutes(p, lang) })}
                  </span>
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
        </section>
      ))}
      <Credit lang={lang} />
    </>
  );
}

/**
 * `#/hemshech`, `#/hemshech/<passage>` — «Ґемшех Самех-Вав» of the Rebbe Rashab (src/core/hemshech.ts):
 * the discourses in passages of up to ten minutes, in the site's language, with the English source on request,
 * a short summary, questions and the translators' credit.
 */
export function HemshechPage({ passage }: { passage?: string }) {
  const { t, locale } = useI18n();
  const lang = hsLang(locale);
  return (
    <>
      <TopBar title={t('hs.short')} />
      <div className="wrap tk hs">{passage ? <Passage key={passage} id={passage} lang={lang} /> : <Index lang={lang} />}</div>
      <Colophon />
    </>
  );
}
