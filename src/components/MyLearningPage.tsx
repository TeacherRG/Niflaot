import { useEffect, useMemo } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { LESSONS, LESSON_GROUPS, type Lesson } from '../lessons';
import { TEACHERS, teacherOf } from '../lessons/teachers';
import { lessonSummary, type LessonSummary } from '../core/progress';
import { dailyNumber, loadResults, streak } from '../core/daily';
import { CYCLE, cycleDayFor, localToday } from '../core/tanakh';
import { readQuizStore, quizReady } from '../core/quiz';
import { SECTIONS } from '../core/tanakhCycle';
import {
  PASS,
  lessonMax,
  tanakhCertificates,
  tanakhProgress,
  torahBookComplete,
  torahCertificates,
  torahProgress,
  quizKey,
  type Progress,
} from '../core/academy';
import { useAccount } from '../core/account';

type Lang = 'ru' | 'en' | 'de';
const langOf = (locale: string): Lang => (locale === 'en' || locale === 'de' ? locale : 'ru');
const pct = (a: number, b: number) => (b ? Math.round((100 * a) / b) : 0);

interface Row {
  lesson: Lesson;
  s: LessonSummary | null;
  total: number;
  max: number;
}

/** Everything played on this device — read once when the page opens. */
function useMyLearning() {
  return useMemo(() => {
    const rows: Row[] = LESSONS.map((l) => ({ lesson: l, s: lessonSummary(l.slug, l.legacyStorageKey), total: l.riddles.length, max: lessonMax(l) }));
    const daily = loadResults();
    const today = dailyNumber();
    const store = readQuizStore();
    const day = localToday();
    const torah = torahCertificates(LESSONS).map((c) => {
      const p = torahProgress(c, (slug) => rows.find((r) => r.lesson.slug === slug)?.s?.best ?? 0, torahBookComplete(c.book.id as never));
      return { ...c, p };
    });
    const tanakh = tanakhCertificates(CYCLE, day).map((c) => ({ ...c, p: tanakhProgress(c, store, quizReady) }));
    const quizzes = Object.values(store).filter((r) => r.best >= 0);
    const { index } = cycleDayFor(day);
    return {
      rows,
      daily: {
        today,
        done: daily[today]?.done,
        streak: streak(daily, today),
        wins: Object.values(daily).filter((r) => r.done === 'win').length,
      },
      certs: [...torah, ...tanakh],
      quiz: {
        done: quizzes.length,
        right: quizzes.reduce((a, r) => a + Math.min(r.best, r.n), 0),
        asked: quizzes.reduce((a, r) => a + r.n, 0),
        date: CYCLE[index].date,
        today: SECTIONS.map((sec) => ({ sec, r: store[quizKey(CYCLE[index].date, sec)] })),
      },
    };
  }, []);
}

const solved = (r: Row) => r.s?.done.length ?? 0;

function LessonRow({ r }: { r: Row }) {
  const { t, pick } = useI18n();
  const text = pick(r.lesson.texts).value;
  const who = teacherOf(r.lesson);
  const n = solved(r);
  const finished = n >= r.total;
  // a started lesson opens on the first riddle not solved yet
  const nextRiddle = [...Array(r.total).keys()].find((i) => !r.s?.done.includes(i));
  const href = n && !finished && nextRiddle !== undefined ? `#/${r.lesson.slug}/r/${nextRiddle + 1}` : `#/${r.lesson.slug}`;
  return (
    <li className={`my-row t-${TEACHERS[who].color}${finished ? ' done' : ''}`}>
      <a href={href}>
        <span className="my-row-top">
          <span className="my-badge">{r.lesson.series === 'rebbe' ? t('rebbe.title') : t(`teacher.${who}.short`)}</span>
          <span className="my-state">
            {finished ? `✓ ${t('my.finished')}` : n ? t('catalog.progress', { done: n, total: r.total }) : t('my.notStarted')}
          </span>
        </span>
        <span className="my-row-title">
          {text.title}{' '}
          <span className="he" lang="he">
            {r.lesson.hebrewTitle}
          </span>
        </span>
        <span className="my-bar" aria-hidden="true">
          <span style={{ width: `${pct(n, r.total)}%` }} />
        </span>
        {r.s && r.max > 0 && (
          <span className="my-pts">
            {t('my.points', { got: Math.min(r.s.best, r.max), max: r.max })}
            {n > 0 && !finished && <b> · {t('home.continue')} →</b>}
          </span>
        )}
      </a>
    </li>
  );
}

function CertRow({ c }: { c: { id: string; kind: string; teacher?: string; book: { he: string; name: Record<Lang, string> }; p: Progress } }) {
  const { t, locale } = useI18n();
  const v = pct(c.p.got, c.p.max);
  return (
    <li className={`my-cert${c.p.earned ? ' earned' : ''}`}>
      <a href={c.p.earned ? `#/academy/${c.id}` : '#/academy'}>
        <span>
          {c.p.earned ? '🎓 ' : ''}
          {c.kind === 'torah' ? t(`academy.master.${c.teacher}` as 'academy.master.tanakh') : t('academy.master.tanakh')} ·{' '}
          {c.book.name[langOf(locale)]}{' '}
          <span className="he" lang="he">
            {c.book.he}
          </span>
        </span>
        <span className="ac-bar" role="img" aria-label={`${v}%`}>
          <span style={{ width: `${Math.min(100, v)}%` }} />
          <i style={{ insetInlineStart: `${Math.round(PASS * 100)}%` }} />
        </span>
        <small>
          {v}% · {c.p.earned ? t('academy.earned') : t('academy.need', { pass: Math.round(PASS * 100) })}
        </small>
      </a>
    </li>
  );
}

/**
 * `#/my` — «Моё обучение»: всё, что начато на этом устройстве, на одной странице — сводка, «Продолжить»,
 * все уроки по главам с решёнными загадками и очками, сертификаты Академии, «Гиматрия дня», «Вопросы к отрывку»
 * и свои заметки (вопрос к себе) со ссылкой на загадку.
 */
export function MyLearningPage() {
  const { t, pick, locale } = useI18n();
  const { token } = useAccount();
  const my = useMyLearning();
  useEffect(() => {
    document.title = `${t('my.title')} · ${t('app.title')}`;
  }, [t]);

  const started = my.rows.filter((r) => solved(r) > 0 && solved(r) < r.total);
  const finished = my.rows.filter((r) => solved(r) >= r.total).length;
  const riddles = my.rows.reduce((a, r) => a + solved(r), 0);
  const points = my.rows.reduce((a, r) => a + (r.s ? Math.min(r.s.best, r.max) : 0), 0);
  const earned = my.certs.filter((c) => c.p.earned).length;
  const notes = my.rows.flatMap((r) =>
    Object.entries(r.s?.notes ?? {})
      .filter(([, v]) => typeof v === 'string' && v.trim())
      .map(([ri, v]) => ({ r, ri: Number(ri), v: v as string })),
  );
  const nothing = !riddles && !my.daily.wins && !my.quiz.done;
  const week = LESSON_GROUPS[LESSON_GROUPS.length - 1];
  const first = week.lessons[0] ?? week.rebbe[0];
  const certs = my.certs.filter((c) => c.p.got > 0 || c.kind === 'torah');

  return (
    <>
      <TopBar title={t('my.title')} />
      <div className="wrap my">
        <header className="tk-head">
          <p className="tk-kicker">📚 {t('my.kicker')}</p>
          <h1>{t('my.title')}</h1>
          <p className="ac-lead">{t('my.lead')}</p>
          {!token && (
            <p className="tk-note">
              {t('academy.guest')} <a href="#/account">{t('acc.chipGuest')} →</a>
            </p>
          )}
        </header>

        <ul className="my-stats">
          <li>
            <b className="num">
              {finished}
              <small>/{my.rows.length}</small>
            </b>
            <span>{t('my.stat.lessons')}</span>
          </li>
          <li>
            <b className="num">{riddles}</b>
            <span>{t('my.stat.riddles')}</span>
          </li>
          <li>
            <b className="num">{points}</b>
            <span>{t('my.stat.points')}</span>
          </li>
          <li>
            <b className="num">🔥 {my.daily.streak}</b>
            <span>{t('my.stat.streak')}</span>
          </li>
          <li>
            <b className="num">{my.quiz.done}</b>
            <span>{t('my.stat.quizzes')}</span>
          </li>
          <li>
            <b className="num">🎓 {earned}</b>
            <span>{t('my.stat.certs')}</span>
          </li>
        </ul>

        {nothing && first && (
          <div className="my-empty">
            <p>{t('my.empty')}</p>
            <a className="btn" href={`#/${first.slug}`}>
              {t('home.start')}: {pick(first.texts).value.title} →
            </a>{' '}
            <a className="btn ghost" href="#/daily">
              ✦ {t('daily.title')}
            </a>
          </div>
        )}

        {started.length > 0 && (
          <section>
            <h2 className="ac-h2">{t('home.continue')}</h2>
            <ul className="my-list">
              {started.map((r) => (
                <LessonRow key={r.lesson.slug} r={r} />
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="ac-h2">{t('my.today')}</h2>
          <ul className="my-today">
            <li>
              <a href="#/daily">
                <b>
                  ✦ {t('daily.title')} <span className="num">{t('daily.no', { n: my.daily.today })}</span>
                </b>
                <span>
                  {my.daily.done === 'win' ? `✓ ${t('my.solved')}` : my.daily.done ? t('my.tried') : t('daily.menuSub')} ·{' '}
                  {t('my.dailyWins', { n: my.daily.wins })}
                </span>
              </a>
            </li>
            {my.quiz.today.map(({ sec, r }) => (
              <li key={sec}>
                <a href={`#/${sec}/${my.quiz.date}${quizReady(my.quiz.date) ? '/quiz' : ''}`}>
                  <b>
                    {t(`tanakh.${sec}`)} · {quizReady(my.quiz.date) ? t('quiz.title') : t('tanakh.daySub')}
                  </b>
                  <span>
                    {r && r.best >= 0
                      ? `✓ ${t('my.quizResult', { right: r.best, n: r.n })}`
                      : quizReady(my.quiz.date)
                        ? t('my.quizOpen')
                        : t('tanakh.daySub')}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {my.quiz.done > 0 && (
            <p className="ac-note">{t('my.quizTotal', { done: my.quiz.done, pct: pct(my.quiz.right, my.quiz.asked) })}</p>
          )}
        </section>

        {certs.length > 0 && (
          <section>
            <h2 className="ac-h2">{t('academy.title')}</h2>
            <ul className="my-certs">
              {certs.map((c) => (
                <CertRow key={c.id} c={c} />
              ))}
            </ul>
          </section>
        )}

        {notes.length > 0 && (
          <section>
            <h2 className="ac-h2">{t('my.notes')}</h2>
            <ul className="my-notes">
              {notes.map(({ r, ri, v }) => {
                const text = pick(r.lesson.texts).value;
                return (
                  <li key={`${r.lesson.slug}-${ri}`}>
                    <a href={`#/${r.lesson.slug}/r/${ri + 1}`}>
                      <small>
                        {text.title} · {text.riddles[ri]?.title}
                      </small>
                      <span>{v}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section>
          <h2 className="ac-h2">{t('my.all')}</h2>
          {LESSON_GROUPS.map((g) => (
            <div key={g.id}>
              <h3 className="parsha-h">
                {g.name[locale as keyof typeof g.name] ?? g.name.ru} <span className="he">{g.he}</span>
              </h3>
              <ul className="my-list">
                {[...g.lessons, ...g.rebbe].map((l) => (
                  <LessonRow key={l.slug} r={my.rows.find((r) => r.lesson === l)!} />
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
      <Colophon />
    </>
  );
}
