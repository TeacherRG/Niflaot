import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { WordRow } from './TanakhWords';
import {
  dueWords,
  INTERVALS,
  inDeck,
  isKnown,
  knownCount,
  loadDict,
  nextWords,
  readWordStore,
  review,
  textCoverage,
  today,
  useWordStore,
  WORD_GOALS,
  type Dict,
  type Word,
  type WordLang,
} from '../core/words';

/** a level of the list — 50 words in order of frequency */
const LEVEL = 50;

/**
 * `#/words` — «Мои слова»: how much of the Prophets and Writings the reader recognizes, the review of the day («карточки с
 * коробками», src/core/words.ts), the next most frequent new words and the whole translated list by levels of 50.
 */
export function WordsPage() {
  const { t, locale } = useI18n();
  const lang: WordLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const store = useWordStore();
  const [dict, setDict] = useState<Dict | null>(null);
  // the review and the new words are chosen when they start — marking a word doesn't make the list jump
  const [session, setSession] = useState<string[] | null>(null);
  const [fresh, setFresh] = useState<Word[] | null>(null);

  useEffect(() => {
    document.title = `${t('words.mine')} · ${t('app.title')}`;
  }, [t]);
  useEffect(() => {
    let live = true;
    loadDict(lang).then((d) => {
      if (!live) return;
      setDict(d);
      setFresh(nextWords(d, readWordStore()));
    });
    return () => {
      live = false;
    };
  }, [lang]);

  const day = today();
  const due = useMemo(() => (dict ? dueWords(store, day).filter((id) => dict.tr[id]) : []), [store, dict, day]);
  if (!dict) return <TopBar title={t('words.mine')} />;

  const translated = Object.keys(dict.tr).length;
  const known = knownCount(dict, store);
  const learning = Object.keys(dict.tr).filter((id) => inDeck(store, id) && !isKnown(store, id)).length;
  const cov = textCoverage(dict, store);
  const goal = WORD_GOALS.find((g) => g > known);
  const tomorrow = dueWords(store, day + 1).filter((id) => dict.tr[id] && !due.includes(id)).length;
  const levels = Array.from({ length: Math.ceil(translated / LEVEL) }, (_, i) => dict.words.slice(i * LEVEL, Math.min((i + 1) * LEVEL, translated)));

  return (
    <>
      <TopBar title={t('words.mine')} />
      <div className="wrap ws">
        <header className="tk-head">
          <p className="wing-tag adults">{t('wing.adults')}</p>
          <h1>
            {t('words.mine')}{' '}
            <span className="he" lang="he">
              מִלִּים
            </span>
          </h1>
          <p className="ws-lead">{t('words.mineLead')}</p>
        </header>

        <section className="ws-stats" aria-label={t('words.mine')}>
          <div className="ws-nums">
            <span>
              <b>{known}</b>
              <small>{t('words.statKnown')}</small>
            </span>
            <span>
              <b>{learning}</b>
              <small>{t('words.statLearn')}</small>
            </span>
            <span>
              <b>{due.length}</b>
              <small>{t('words.statDue')}</small>
            </span>
          </div>
          <b className="ws-cov">{t('words.textCov', { p: cov })}</b>
          <span className="tk-words-bar" role="img" aria-label={`${cov}%`}>
            <span style={{ width: `${cov}%` }} />
          </span>
          <small className="ws-goal">{goal ? t('words.goal', { goal, n: goal - known }) : t('words.goalDone', { n: translated })}</small>
        </section>

        <section className="ws-sec" aria-labelledby="ws-review">
          <h2 id="ws-review">{t('words.reviewH')}</h2>
          {session ? (
            <Review dict={dict} ids={session} onClose={() => setSession(null)} />
          ) : due.length ? (
            <button type="button" className="btn ws-start" onClick={() => setSession(due)}>
              {t('words.reviewBtn', { n: due.length })}
            </button>
          ) : (
            <p className="ws-note">
              {Object.keys(store).some((id) => inDeck(store, id)) ? t('words.reviewNone') : t('words.reviewEmpty')}
              {tomorrow > 0 && <> {t('words.reviewTomorrow', { n: tomorrow })}</>}
            </p>
          )}
        </section>

        <section className="ws-sec" aria-labelledby="ws-new">
          <h2 id="ws-new">{t('words.newH')}</h2>
          <p className="ws-note">{t('words.newLead')}</p>
          {fresh && fresh.length ? (
            <>
              <ul className="tk-words-list">
                {fresh.map((w) => (
                  <WordRow key={w.id} w={w} dict={dict} store={store} />
                ))}
              </ul>
              <button type="button" className="btn ghost ws-more" onClick={() => setFresh(nextWords(dict, readWordStore()))}>
                {t('words.moreNew')}
              </button>
            </>
          ) : (
            <p className="ws-note">{t('words.goalDone', { n: translated })}</p>
          )}
        </section>

        <section className="ws-sec" aria-labelledby="ws-all">
          <h2 id="ws-all">{t('words.allH')}</h2>
          {levels.map((ws, i) => (
            <Level key={i} words={ws} from={i * LEVEL + 1} dict={dict} />
          ))}
        </section>

        <p className="ws-note">
          {t('words.readToday')} <a href="#/neviim">{t('tanakh.neviim')}</a> · <a href="#/ketuvim">{t('tanakh.ketuvim')}</a>
        </p>
        <p className="tk-words-src">{t('words.src')}</p>
      </div>
      <Colophon />
    </>
  );
}

/** A level of 50 words: how many are known and learned, and the words themselves — drawn only when opened. */
function Level({ words, from, dict }: { words: Word[]; from: number; dict: Dict }) {
  const { t } = useI18n();
  const store = useWordStore();
  const [open, setOpen] = useState(false);
  const k = words.filter((w) => isKnown(store, w.id)).length;
  const l = words.filter((w) => inDeck(store, w.id) && !isKnown(store, w.id)).length;
  return (
    <details className="ws-level" onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary>
        <b>{t('words.level', { a: from, b: from + words.length - 1 })}</b>
        <small>{t('words.levelStat', { k, l, n: words.length, cov: words[words.length - 1].cov })}</small>
      </summary>
      {open && (
        <ul className="tk-words-list">
          {words.map((w) => (
            <WordRow key={w.id} w={w} dict={dict} store={store} compact />
          ))}
        </ul>
      )}
    </details>
  );
}

/**
 * The review: one card at a time — the Hebrew word (and its root); «Показать перевод», then «Помню» / «Не помню».
 * Remembered — the next box, the next review later (1, 3, 7, 21, 60 days); not — box 1, tomorrow.
 */
function Review({ dict, ids, onClose }: { dict: Dict; ids: string[]; onClose: () => void }) {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [ok, setOk] = useState(0);
  if (i >= ids.length)
    return (
      <div className="ws-card ws-done">
        <p>{t('words.reviewDone', { ok, n: ids.length })}</p>
        <button type="button" className="btn ghost" onClick={onClose}>
          {t('words.close')}
        </button>
      </div>
    );
  const w = dict.words[dict.rank.get(ids[i])! - 1];
  const answer = (remembered: boolean) => {
    review(w.id, remembered);
    if (remembered) setOk((n) => n + 1);
    setShown(false);
    setI((n) => n + 1);
  };
  return (
    <div className="ws-card" aria-live="polite">
      <small className="ws-count">{t('words.progress', { i: i + 1, n: ids.length })}</small>
      <span className="he ws-he" lang="he">
        {w.he}
      </span>
      {w.root && (
        <small className="tk-w-meta">
          {t('words.root')}{' '}
          <span className="he" lang="he">
            {w.root}
          </span>
        </small>
      )}
      {shown ? (
        <>
          <span className="ws-tr">{dict.tr[w.id]}</span>
          <span className="ws-btns">
            <button type="button" className="btn ghost" onClick={() => answer(false)}>
              {t('words.forgot')}
            </button>
            <button type="button" className="btn" onClick={() => answer(true)}>
              {t('words.remember')}
            </button>
          </span>
          <small className="ws-hint">{t('words.intervals', { days: INTERVALS.slice(1).join(', ') })}</small>
        </>
      ) : (
        <button type="button" className="btn ws-show" onClick={() => setShown(true)}>
          {t('words.show')}
        </button>
      )}
    </div>
  );
}
