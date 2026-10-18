import { useMemo } from 'react';
import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { CYCLE, localToday } from '../core/tanakh';
import { isDone, PASS, TORAH_BOOKS } from '../core/academy';
import { useDoneStore } from '../core/tanakhDone';
import { bookRoadmap, doneMilestones, markDate, pctMilestones, type Milestone, type RoadBook } from '../core/milestones';
import { civilDate } from '../core/hebrewDate';
import { TEACHERS } from '../lessons/teachers';
import { useCertificates } from './AcademyPage';
import { HEMSHECH, allPassages, hsIsDone, passageDate, useHsDone } from '../core/hemshech';

type Lang = 'ru' | 'en' | 'de';
const langOf = (locale: string): Lang => (locale === 'en' || locale === 'de' ? locale : 'ru');
const short = (at: number, locale: string) =>
  new Date(`${markDate(at)}T12:00:00`).toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { day: 'numeric', month: 'short', year: 'numeric' });
/** how many upcoming books are shown before «ещё N книг» */
const AHEAD = 2;

/** The progress inside a book: the bar with 25/50/75 % on it, the numbers, «продолжить», the percent milestones. */
function Inside({ pct, meta, steps, href, pass }: { pct: number; meta: string; steps: Milestone[]; href?: string; pass?: number }) {
  const { t, locale } = useI18n();
  return (
    <>
      <div className="ac-bar bp-bar" role="img" aria-label={`${pct}%`}>
        <span style={{ width: `${Math.min(100, pct)}%` }} />
        {steps.slice(0, -1).map((s) => (
          <i key={s.step} className={`bp-tick${s.at !== undefined ? ' on' : ''}`} style={{ insetInlineStart: `${s.step}%` }} />
        ))}
        {pass !== undefined && <i style={{ insetInlineStart: `${pass}%` }} />}
      </div>
      <p className="ac-meta">
        {meta}
        {href && (
          <>
            {' · '}
            <a href={href}>{t('bp.continue')}</a>
          </>
        )}
      </p>
      <ul className="bp-steps">
        {steps.map((s) => (
          <li key={s.step} className={s.at !== undefined ? 'on' : ''}>
            {s.at !== undefined ? '✓' : '○'} {s.step}%{s.at ? ` · ${short(s.at, locale)}` : ''}
          </li>
        ))}
      </ul>
    </>
  );
}

/** One section of the Prophets and Writings as a road of books: read — with the date, the current one — its progress, ahead — when it starts. */
type Stop = RoadBook & { href: string };
function Road({ section, road }: { section: 'neviim' | 'ketuvim'; road: Stop[] }) {
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const read = road.filter((r) => r.status === 'done').length;
  const ahead = road.filter((r) => r.status === 'next');
  const shown = new Set(ahead.slice(0, AHEAD));
  const item = (r: Stop) => {
    const pct = Math.round((100 * r.done) / r.days.length);
    return (
      <li key={r.book.slug} className={`bp-stop ${r.status}`}>
        <span className="bp-dot" aria-hidden="true">{r.status === 'done' ? '✓' : r.status === 'now' ? '●' : '○'}</span>
        <div className="bp-stop-body">
          <div className="bp-head">
            <b>{r.book.name[lang]}</b> <span className="he" lang="he">{r.book.he}</span>
            {r.status === 'done' && (
              <a className="bp-cert" href={`#/academy/k-${r.book.slug}`}>
                🎓 {t('bp.cert')}
              </a>
            )}
          </div>
          {r.status === 'done' ? (
            <p className="ac-meta">{r.finishedAt ? t('bp.finished', { date: short(r.finishedAt, locale) }) : t('bp.finishedNoDate')}</p>
          ) : r.status === 'now' ? (
            <Inside
              pct={pct}
              meta={t('academy.readDays', { done: r.done, parts: r.days.length, pct })}
              steps={r.steps}
              href={r.href}
            />
          ) : (
            <p className="ac-meta">{t('bp.starts', { date: civilDate(r.days[0].date, locale), n: r.days.length })}</p>
          )}
        </div>
      </li>
    );
  };
  return (
    <div className={`bp-section t-${section === 'neviim' ? 'tchelet' : 'gold'}`}>
      <h3 className="bp-h3">
        {t(`tanakh.${section}`)} <small>{t('bp.booksRead', { n: read, total: road.length })}</small>
      </h3>
      <ol className="bp-road">{road.filter((r) => r.status !== 'next' || shown.has(r)).map(item)}</ol>
      {ahead.length > AHEAD && (
        <details className="bp-more">
          <summary>{t('bp.more', { n: ahead.length - AHEAD })}</summary>
          <ol className="bp-road">{ahead.slice(AHEAD).map(item)}</ol>
        </details>
      )}
    </div>
  );
}

/** «Хасидут»: the discourses of «Ґемшех Самех-Вав» as the road — read (with the date), the current, the coming ones. */
function HsRoad() {
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const [done] = useHsDone();
  const all = allPassages();
  const today = localToday();
  const road = HEMSHECH.maamarim.map((m) => {
    const ids = m.passages.map((p) => p.id);
    const n = ids.filter((id) => hsIsDone(done, id)).length;
    const steps = doneMilestones(done, ids);
    const first = passageDate(all.findIndex((x) => x.p === m.passages[0]));
    const next = m.passages.find((p) => !hsIsDone(done, p.id)) ?? m.passages[0];
    const status = n === ids.length && ids.length ? 'done' : n > 0 || first <= today ? 'now' : 'next';
    return { m, n, steps, first, status, href: `#/hemshech/${next.id}` };
  });
  const read = road.filter((r) => r.status === 'done').length;
  return (
    <div className="bp-section t-tchelet">
      <h3 className="bp-h3">
        {t('hs.menuLbl')} · {HEMSHECH.title[lang]} <small>{t('bp.hsRead', { n: read, total: road.length })}</small>
      </h3>
      <ol className="bp-road">
        {road.map((r) => {
          const pct = Math.round((100 * r.n) / (r.m.passages.length || 1));
          return (
            <li key={r.m.id} className={`bp-stop ${r.status}`}>
              <span className="bp-dot" aria-hidden="true">{r.status === 'done' ? '✓' : r.status === 'now' ? '●' : '○'}</span>
              <div className="bp-stop-body">
                <div className="bp-head">
                  <b>{r.m.title[lang]}</b>
                  {r.status === 'done' && (
                    <a className="bp-cert" href={`#/academy/h-${r.m.id}`}>
                      🎓 {t('bp.cert')}
                    </a>
                  )}
                </div>
                {r.status === 'done' ? (
                  <p className="ac-meta">{r.steps[r.steps.length - 1].at ? t('bp.finished', { date: short(r.steps[r.steps.length - 1].at!, locale) }) : t('bp.finishedNoDate')}</p>
                ) : r.status === 'now' ? (
                  <Inside pct={pct} meta={t('academy.readDays', { done: r.n, parts: r.m.passages.length, pct })} steps={r.steps} href={r.href} />
                ) : (
                  <p className="ac-meta">{t('bp.starts', { date: civilDate(r.first, locale), n: r.m.passages.length })}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/**
 * «Мой путь по книгам» in the account (`#/account`): the books are the milestones. The adults — the road of the
 * Prophets and of the Writings (every book of the cycle in order: read — with the date, the current — its progress and
 * 25/50/75/100 %, ahead — when it starts) and the Torah by reading; the children — the five books of the Torah by playing.
 * On this device; with an account — the same on every device (src/core/sync.ts).
 */
export function BookProgress() {
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const adults = useMode() === 'adults';
  const store = useDoneStore();
  const { torah, hemshech } = useCertificates();
  const [hsDone] = useHsDone();
  const hsRead = allPassages().filter((x) => hsIsDone(hsDone, x.p.id)).length;

  const roads = useMemo(() => {
    const today = localToday();
    return (['neviim', 'ketuvim'] as const).map((section) => ({
      section,
      road: bookRoadmap(section, store, CYCLE, today).map((r) => {
        const next = r.days.find((d) => !isDone(store, d.date, section)) ?? r.days[0];
        return { ...r, href: `#/${section}/${next.date}` };
      }),
    }));
  }, [store]);
  const booksRead = roads.reduce((a, r) => a + r.road.filter((b) => b.status === 'done').length, 0);
  const booksAll = roads.reduce((a, r) => a + r.road.length, 0);
  const passages = Object.values(store).filter((x) => x > 0).length;

  // on the card — only what is done: the books read and the certificates earned; the road itself — under «Весь путь»
  const doneBooks = adults ? roads.flatMap((r) => r.road.filter((b) => b.status === 'done').map((b) => ({ ...b, section: r.section }))) : [];
  const doneTorah = torah.filter((c) => c.progress.earned);
  const doneHs = adults ? hemshech.filter((c) => c.progress.earned) : [];

  return (
    <section className="acc-card bp">
      <h2>📚 {t('bp.title')}</h2>
      {adults && (
        <p className="bp-total">
          {t('bp.totalBooks', { n: booksRead, total: booksAll })} · {t('bp.total', { n: passages, total: CYCLE.length * 2 })}
          <br />
          {t('bp.hsTotal', { n: hsRead, total: allPassages().length })}
        </p>
      )}
      {doneBooks.length + doneTorah.length + doneHs.length ? (
        <ol className="bp-road">
          {doneBooks.map((r) => (
            <li key={r.book.slug} className="bp-stop done">
              <span className="bp-dot" aria-hidden="true">✓</span>
              <div className="bp-stop-body">
                <div className="bp-head">
                  <b>{r.book.name[lang]}</b> <span className="he" lang="he">{r.book.he}</span> <small>{t(`tanakh.${r.section}`)}</small>
                  <a className="bp-cert" href={`#/academy/k-${r.book.slug}`}>
                    🎓 {t('bp.cert')}
                  </a>
                </div>
                <p className="ac-meta">{r.finishedAt ? t('bp.finished', { date: short(r.finishedAt, locale) }) : t('bp.finishedNoDate')}</p>
              </div>
            </li>
          ))}
          {doneHs.map((c) => (
            <li key={c.id} className="bp-stop done">
              <span className="bp-dot" aria-hidden="true">✓</span>
              <div className="bp-stop-body">
                <div className="bp-head">
                  <b>{c.book.name[lang]}</b> <small>{t('hs.menuLbl')}</small>
                  <a className="bp-cert" href={`#/academy/${c.id}`}>
                    🎓 {t('bp.cert')}
                  </a>
                </div>
              </div>
            </li>
          ))}
          {doneTorah.map((c) => (
            <li key={c.id} className="bp-stop done">
              <span className="bp-dot" aria-hidden="true">✓</span>
              <div className="bp-stop-body">
                <div className="bp-head">
                  <b>{c.book.name[lang]}</b> <span className="he" lang="he">{c.book.he}</span> <small>{t(`academy.master.${c.teacher!}`)}</small>
                  <a className="bp-cert" href={`#/academy/${c.id}`}>
                    🎓 {t('bp.cert')}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="acc-note">{t('bp.noneYet')}</p>
      )}

      {/* the whole road — the current and the next books, with the progress inside each */}
      <details className="bp-all">
        <summary>{t('bp.all')}</summary>
        <p className="acc-note">{t(adults ? 'bp.leadAdults' : 'bp.lead')}</p>

        {adults && (
          <>
            {roads.map((r) => (
              <Road key={r.section} section={r.section} road={r.road} />
            ))}
            <HsRoad />
          </>
        )}

        {/* the Torah: the five books are the milestones; a book with lessons — by teacher */}
        <div className="bp-section">
          <h3 className="bp-h3">
            {t(adults ? 'bp.torahRead' : 'bp.torah')}{' '}
            <small>{t('bp.booksRead', { n: TORAH_BOOKS.filter((b) => torah.some((c) => c.book.id === b.id && c.progress.earned)).length, total: TORAH_BOOKS.length })}</small>
          </h3>
          <ol className="bp-road">
            {TORAH_BOOKS.map((b) => {
              const cs = torah.filter((c) => c.book.id === b.id);
              const earned = cs.some((c) => c.progress.earned);
              return (
                <li key={b.id} className={`bp-stop ${earned ? 'done' : cs.length ? 'now' : 'next'}`}>
                  <span className="bp-dot" aria-hidden="true">{earned ? '✓' : cs.length ? '●' : '○'}</span>
                  <div className="bp-stop-body">
                    <div className="bp-head">
                      <b>{b.name[lang]}</b> <span className="he" lang="he">{b.he}</span>
                    </div>
                    {!cs.length && <p className="ac-meta">{t('bp.torahSoon')}</p>}
                    {cs.map((c) => {
                      const p = c.progress;
                      const r = adults && p.read ? p.read : p;
                      const pct = r.max ? Math.round((100 * r.got) / r.max) : 0;
                      return (
                        <div key={c.id} className={`bp-teacher t-${TEACHERS[c.teacher!].color}`}>
                          <p className="bp-sub">
                            {t(`academy.master.${c.teacher!}`)}
                            {p.earned && (
                              <a className="bp-cert" href={`#/academy/${c.id}`}>
                                🎓 {t('bp.cert')}
                              </a>
                            )}
                          </p>
                          <Inside
                            pct={pct}
                            meta={t(adults ? 'academy.readPoints' : 'academy.points', { got: r.got, max: r.max, pct })}
                            steps={pctMilestones(pct)}
                            pass={Math.round(PASS * 100)}
                            href={p.earned ? undefined : adults ? c.readHref : c.href}
                          />
                        </div>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </details>
      <p className="acc-note">
        <a href="#/academy">{t('bp.academy')} →</a>
      </p>
    </section>
  );
}
