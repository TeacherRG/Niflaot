import { useMemo } from 'react';
import { useI18n } from '../i18n';
import { useMode } from '../core/mode';
import { CYCLE, localToday } from '../core/tanakh';
import { BOOKS } from '../core/tanakhCycle';
import { bookDays, isDone, PASS } from '../core/academy';
import { useDoneStore } from '../core/tanakhDone';
import { markDate, passageMilestones, pctMilestones, tanakhBookMilestones, type Milestone } from '../core/milestones';
import { TEACHERS } from '../lessons/teachers';
import { useCertificates } from './AcademyPage';

type Lang = 'ru' | 'en' | 'de';
const langOf = (locale: string): Lang => (locale === 'en' || locale === 'de' ? locale : 'ru');
const short = (at: number, locale: string) =>
  new Date(`${markDate(at)}T12:00:00`).toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { day: 'numeric', month: 'short' });

/** One book: the bar with the milestones on it, the numbers, the milestone chips, the certificate. */
function BookRow(props: {
  he: string;
  name: string;
  sub?: string;
  color: string;
  done: number;
  parts: number;
  pct: number;
  /** the numbers under the bar */
  meta: string;
  steps: Milestone[];
  cert?: string;
  href?: string;
  /** a mark on the bar where the certificate is earned (the Torah: PASS) */
  pass?: number;
}) {
  const { t, locale } = useI18n();
  const { he, name, sub, color, done, parts, pct, meta, steps, cert, href, pass } = props;
  return (
    <li className={`bp-book t-${color}`}>
      <div className="bp-head">
        <b>{name}</b> <span className="he" lang="he">{he}</span>
        {sub && <small> · {sub}</small>}
        {cert && (
          <a className="bp-cert" href={cert}>
            🎓 {t('bp.cert')}
          </a>
        )}
      </div>
      <div className="ac-bar bp-bar" role="img" aria-label={`${pct}%`}>
        <span style={{ width: `${Math.min(100, pct)}%` }} />
        {steps.slice(0, -1).map((s) => (
          <i key={s.step} className={`bp-tick${s.at !== undefined ? ' on' : ''}`} style={{ insetInlineStart: `${s.step}%` }} />
        ))}
        {pass !== undefined && <i style={{ insetInlineStart: `${pass}%` }} />}
      </div>
      <p className="ac-meta">
        {meta}
        {href && done < parts && (
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
    </li>
  );
}

/**
 * «Мой путь по книгам» in the account (`#/account`): the progress of every book and its milestones (25/50/75/100 %).
 * The adults — the passages of the Prophets and Writings marked «Я прочитал(а)» (with the dates of the milestones and
 * the reading milestones of the whole cycle) and the Torah by reading; the children — the Torah by playing.
 * On this device; with an account — the same on every device (src/core/sync.ts).
 */
export function BookProgress() {
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const adults = useMode() === 'adults';
  const store = useDoneStore();
  const { torah } = useCertificates();

  const tanakh = useMemo(() => {
    const today = localToday();
    return BOOKS.map((b) => ({ b, days: bookDays(b, CYCLE) }))
      .filter(({ b, days }) => days.length && (days[0].date <= today || days.some((d) => isDone(store, d.date, b.section))))
      .map(({ b, days }) => {
        const done = days.filter((d) => isDone(store, d.date, b.section)).length;
        const next = days.find((d) => !isDone(store, d.date, b.section)) ?? days[0];
        return { b, days, done, steps: tanakhBookMilestones(store, days, b.section), href: `#/${b.section}/${next.date}` };
      });
  }, [store]);
  const reading = useMemo(() => passageMilestones(store, CYCLE.length * 2), [store]);
  const reached = reading.filter((m) => m.at !== undefined);
  const next = reading.find((m) => m.at === undefined);
  const total = Object.values(store).filter((x) => x > 0).length;

  const torahRows = torah.map((c) => {
    const p = c.progress;
    const r = adults && p.read ? p.read : p;
    const pct = r.max ? Math.round((100 * r.got) / r.max) : 0;
    return { c, p, pct, got: r.got, max: r.max };
  });

  return (
    <section className="acc-card bp">
      <h2>📚 {t('bp.title')}</h2>
      <p className="acc-note">{t(adults ? 'bp.leadAdults' : 'bp.lead')}</p>

      {adults && (
        <>
          <h3 className="bp-h3">{t('bp.milestones')}</h3>
          <p className="bp-total">{t('bp.total', { n: total, total: CYCLE.length * 2 })}</p>
          <ul className="bp-miles">
            {reached.map((m) => (
              <li key={m.step} className="on">
                <span className="bp-medal" aria-hidden="true">{m.step === CYCLE.length * 2 ? '🏆' : '★'}</span>
                {t('bp.passage', { n: m.step })}
                {m.at ? <small>{short(m.at, locale)}</small> : null}
              </li>
            ))}
            {next && (
              <li className="next">
                <span className="bp-medal" aria-hidden="true">☆</span>
                {t('bp.passage', { n: next.step })}
                <small>{t('bp.left', { n: next.step - total })}</small>
              </li>
            )}
          </ul>

          <h3 className="bp-h3">{t('bp.tanakh')}</h3>
          {tanakh.length ? (
            <ul className="bp-list">
              {tanakh.map(({ b, days, done, steps, href }) => (
                <BookRow
                  key={b.slug}
                  he={b.he}
                  name={b.name[lang]}
                  sub={t(`tanakh.${b.section}`)}
                  color={b.section === 'neviim' ? 'tchelet' : 'gold'}
                  done={done}
                  parts={days.length}
                  pct={Math.round((100 * done) / days.length)}
                  meta={t('academy.readDays', { done, parts: days.length, pct: Math.round((100 * done) / days.length) })}
                  steps={steps}
                  href={href}
                  cert={done === days.length ? `#/academy/k-${b.slug}` : undefined}
                />
              ))}
            </ul>
          ) : (
            <p className="acc-note">{t('academy.empty')}</p>
          )}
        </>
      )}

      {torahRows.length > 0 && (
        <>
          <h3 className="bp-h3">{t(adults ? 'bp.torahRead' : 'bp.torah')}</h3>
          <ul className="bp-list">
            {torahRows.map(({ c, p, pct, got, max }) => (
              <BookRow
                key={c.id}
                he={c.book.he}
                name={c.book.name[lang]}
                sub={t(`academy.master.${c.teacher!}`)}
                color={TEACHERS[c.teacher!].color}
                done={got}
                parts={max}
                pct={pct}
                meta={t(adults ? 'academy.readPoints' : 'academy.points', { got, max, pct })}
                steps={pctMilestones(pct)}
                pass={Math.round(PASS * 100)}
                href={adults ? c.readHref : c.href}
                cert={p.earned ? `#/academy/${c.id}` : undefined}
              />
            ))}
          </ul>
        </>
      )}
      <p className="acc-note">
        <a href="#/academy">{t('bp.academy')} →</a>
      </p>
    </section>
  );
}
