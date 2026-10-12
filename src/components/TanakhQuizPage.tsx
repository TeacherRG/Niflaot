import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { BOOKS, rangeLabel, type Section } from '../core/tanakhCycle';
import { CYCLE, cycleDayFor, localToday } from '../core/tanakh';
import { civilDate, jewishDate } from '../core/hebrewDate';
import { loadQuiz, optionOrder, quizReady, useQuizResult, type DayQuiz, type QuizQuestion } from '../core/quiz';
import { PASS } from '../core/academy';

const SECTION_HE: Record<Section, string> = { neviim: 'נביאים', ketuvim: 'כתובים' };
type Lang = 'ru' | 'en' | 'de';
const langOf = (locale: string): Lang => (locale === 'en' || locale === 'de' ? locale : 'ru');

/** «joshua 2:18» → «Йеґошуа 2:18» */
function refLabel(ref: string, lang: Lang) {
  const [slug, cv] = ref.split(' ');
  const book = BOOKS.find((b) => b.slug === slug);
  return `${book ? book.name[lang] : slug} ${cv}`;
}

/** The questions of one section of one day: answer each once, see at once whether it is right; the result counts for the book's certificate. */
function Quiz({ date, section, questions }: { date: string; section: Section; questions: QuizQuestion[] }) {
  const { t, locale } = useI18n();
  const lang = langOf(locale);
  const { result, answer, restart } = useQuizResult(date, section, questions.length);
  const answered = result.p.filter((x) => x >= 0).length;
  const right = result.p.filter((x) => x === 0).length;
  const finished = answered === questions.length;
  return (
    <>
      <ol className="qz-list">
        {questions.map((q, i) => {
          const picked = result.p[i];
          const order = optionOrder(q.o.length, `${date}:${section}:${i}`);
          return (
            <li key={i} className="qz-q">
              <p className="qz-text">
                <span className="qz-num num">{i + 1}</span>
                {q.q[lang]}
              </p>
              <div className="qz-opts" role="group" aria-label={q.q[lang]}>
                {order.map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`qz-opt${picked >= 0 && k === 0 ? ' ok' : ''}${picked === k && k !== 0 ? ' bad' : ''}`}
                    disabled={picked >= 0}
                    aria-pressed={picked === k}
                    onClick={() => answer(i, k)}
                  >
                    {q.o[k][lang]}
                  </button>
                ))}
              </div>
              {picked >= 0 && (
                <p className={`qz-fb ${picked === 0 ? 'ok' : 'bad'}`} role="status">
                  {picked === 0 ? t('quiz.right') : t('quiz.wrong', { a: q.o[0][lang] })}{' '}
                  <span className="qz-ref">({refLabel(q.ref, lang)})</span>
                </p>
              )}
            </li>
          );
        })}
      </ol>
      {finished && (
        <div className={`qz-result ${right >= PASS * questions.length ? 'ok' : 'bad'}`}>
          <p className="qz-score">{t('quiz.score', { n: right, total: questions.length })}</p>
          {result.best > right && <p className="qz-best">{t('quiz.best', { n: result.best, total: questions.length })}</p>}
          <p>{result.best >= PASS * questions.length ? t('quiz.pass') : t('quiz.fail', { pass: Math.round(PASS * 100) })}</p>
          <div className="qz-actions">
            <button type="button" className="btn ghost" onClick={restart}>
              {t('quiz.again')}
            </button>
            <a className="btn" href="#/academy">
              🎓 {t('quiz.academy')}
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * `#/neviim/quiz`, `#/neviim/<date>/quiz` (and `ketuvim`) — «Вопросы к отрывку»: 3–4 questions on the passage of the day
 * (src/tanakh/quiz/<date>.json). Without a date — today, or the next study day. The results build the certificates
 * of the books (`#/academy`).
 */
export function TanakhQuizPage({ section, date }: { section: Section; date?: string }) {
  const { t, locale } = useI18n();
  const today = localToday();
  const { index } = cycleDayFor(date ?? today);
  const day = CYCLE[index];
  const lang = langOf(locale);
  const title = t('quiz.title');
  const range = rangeLabel(section, day[section], lang);
  const [quiz, setQuiz] = useState<DayQuiz | null | undefined>(undefined);

  useEffect(() => {
    let live = true;
    setQuiz(undefined);
    loadQuiz(day.date).then((q) => live && setQuiz(q));
    return () => {
      live = false;
    };
  }, [day.date]);
  useEffect(() => {
    document.title = `${title}: ${range} · ${t('app.title')}`;
  }, [title, range, t]);

  const other: Section = section === 'neviim' ? 'ketuvim' : 'neviim';
  // the neighbouring days that have questions
  const prev = CYCLE.slice(0, index).reverse().find((d) => quizReady(d.date));
  const next = CYCLE.slice(index + 1).find((d) => quizReady(d.date));
  const questions = quiz?.[section];

  return (
    <>
      <TopBar title={t(`tanakh.${section}`)} />
      <div className="wrap tk qz">
        <article>
          <header className="tk-head">
            <p className="tk-kicker">
              {day.date === today ? t('tanakh.today') : civilDate(day.date, locale)} ·{' '}
              <span className="he" lang="he">
                {jewishDate(day.date)}
              </span>
            </p>
            <h1>{title}</h1>
            <p className="tk-range">
              {t(`tanakh.${section}`)}{' '}
              <span className="he" lang="he">
                {SECTION_HE[section]}
              </span>{' '}
              · {range}
            </p>
            {questions && <p className="tk-day">{t('quiz.lead', { n: questions.length })}</p>}
          </header>
          <nav className="tk-nav" aria-label={t('tanakh.navLabel')}>
            {prev ? <a href={`#/${section}/${prev.date}/quiz`}>← {civilDate(prev.date, locale)}</a> : <span />}
            <a className="tk-other" href={`#/${section}/${day.date}`}>
              📖 {t('quiz.read')}
            </a>
            {next ? <a href={`#/${section}/${next.date}/quiz`}>{civilDate(next.date, locale)} →</a> : <span />}
          </nav>
          {quiz === undefined ? (
            <p className="tk-note">{t('tanakh.loading')}</p>
          ) : !questions?.length ? (
            <p className="tk-note">{t('quiz.notReady')}</p>
          ) : (
            <Quiz key={`${day.date}:${section}`} date={day.date} section={section} questions={questions} />
          )}
          <p className="qz-more">
            <a href={`#/${other}/${day.date}/quiz`}>{t('quiz.other', { sec: t(`tanakh.${other}`) })} →</a>
          </p>
        </article>
      </div>
      <Colophon />
    </>
  );
}
