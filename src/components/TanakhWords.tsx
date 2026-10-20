import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import type { Section } from '../core/tanakhCycle';
import { BOOKS } from '../core/tanakhCycle';
import { boxOf, coverage, KNOWN_BOX, knownCount, loadDayWords, loadDict, markKnown, markLearn, pickWords, readWordStore, unmark, useWordStore, type DayWords, type Dict, type Example, type Word, type WordLang, type WordStore } from '../core/words';

/**
 * «Слова отрывка» под отрывком дня (src/core/words.ts): сколько процентов слов отрывка игрок узнаёт и до пяти самых
 * частых слов Танаха из этого отрывка, которых нет в «Моих словах», — с переводом, корнем и частотой; «Учу» / «Знаю» кладёт
 * слово в «Мои слова» (`#/words`, повторение).
 * Слова на экране не меняются, пока страница открыта: отмеченное остаётся с галочкой (его можно снять).
 */
export function TanakhWords({ section, date }: { section: Section; date: string }) {
  const { t, locale } = useI18n();
  const lang: WordLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const store = useWordStore();
  const [data, setData] = useState<{ dict: Dict; day: DayWords[Section]; picks: Word[] } | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all([loadDict(lang), loadDayWords(date)]).then(([dict, day]) => {
      // the words are chosen once — by what the reader knew when the page opened
      if (live && day) setData({ dict, day: day[section], picks: pickWords(day[section], dict, readWordStore()) });
    });
    return () => {
      live = false;
    };
  }, [lang, date, section]);

  if (!data) return null;
  const { dict, day, picks } = data;
  const pct = coverage(day, store);
  const learn = Object.keys(dict.tr).length;
  return (
    <section className="tk-words no-print" aria-labelledby="tk-words-h">
      <h2 id="tk-words-h">
        {t('words.title')}{' '}
        <span className="he" lang="he">
          מִלִּים
        </span>
      </h2>
      <p className="tk-words-lead">{t('words.lead')}</p>
      <div className="tk-words-cov">
        <b>{t('words.cov', { p: pct })}</b>
        <span className="tk-words-bar" role="img" aria-label={`${pct}%`}>
          <span style={{ width: `${pct}%` }} />
        </span>
        <small>{t('words.known', { k: knownCount(dict, store), n: learn })}</small>
      </div>
      {picks.length ? (
        <ul className="tk-words-list">
          {picks.map((w) => (
            <WordRow key={w.id} w={w} dict={dict} store={store} here={day.w[w.id]} />
          ))}
        </ul>
      ) : (
        <p className="tk-words-done">{t('words.allKnown')}</p>
      )}
      <p className="tk-words-more">
        <a href="#/words">{t('words.toMine')} →</a>
      </p>
      <p className="tk-words-src">{t('words.src')}</p>
    </section>
  );
}

/**
 * One word with «Учу» / «Знаю» (src/core/words.ts): the form with vowels, the translation, the root, the frequency
 * (and how many times in the passage — `here`). The pressed button takes the word out of «Мои слова» again.
 */
export function WordRow({ w, dict, store, here, compact, ex }: { w: Word; dict: Dict; store: WordStore; here?: number; compact?: boolean; ex?: Example }) {
  const { t } = useI18n();
  const box = boxOf(store, w.id);
  const known = box >= KNOWN_BOX;
  const learning = box > 0 && !known;
  return (
    <li className={`tk-w${known ? ' on' : learning ? ' learn' : ''}${compact ? ' compact' : ''}`}>
      <span className="he tk-w-he" lang="he">
        {w.he}
      </span>
      <span className="tk-w-tr">{dict.tr[w.id]}</span>
      <small className="tk-w-meta">
        {w.root && (
          <>
            {t('words.root')}{' '}
            <span className="he" lang="he">
              {w.root}
            </span>{' '}
            ·{' '}
          </>
        )}
        {w.aram && <>{t('words.aram')} · </>}
        {t('words.rank', { n: dict.rank.get(w.id)! })}
        {!compact && <> · {t('words.count', { n: w.n })}</>}
        {here ? <> · {t('words.here', { n: here })}</> : null}
      </small>
      {ex && <WordVerse ex={ex} />}
      <span className="tk-w-btns">
        <button type="button" className="tk-w-learn" aria-pressed={learning} onClick={() => (learning ? unmark(w.id) : markLearn(w.id))}>
          {learning ? `● ${t('words.learn')}` : t('words.learn')}
        </button>
        <button type="button" className="tk-w-know" aria-pressed={known} onClick={() => (known ? unmark(w.id) : markKnown(w.id))}>
          {known ? `✓ ${t('words.know')}` : t('words.know')}
        </button>
      </span>
    </li>
  );
}


/** «Йеґошуа 1:10» — the verse's place, a link to the passage of that day */
export function VerseRef({ ex }: { ex: Example }) {
  const { locale } = useI18n();
  const lang: WordLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const [slug, cv] = ex.ref.split(' ');
  const book = BOOKS.find((b) => b.slug === slug);
  return <a href={`#/${ex.section}/${ex.date}`}>{`${book ? book.name[lang] : slug} ${cv}`}</a>;
}

/**
 * A verse of the Prophets or Writings with the word (src/core/words.ts, `Example`): the Hebrew with the word in bold,
 * the translation (`tr: false` — not yet: the review card shows it only after «Показать перевод») and the place.
 */
export function WordVerse({ ex, tr = true }: { ex: Example; tr?: boolean }) {
  const { t } = useI18n();
  return (
    <span className="tk-w-ex">
      <span className="he" lang="he">
        {ex.he[0]}
        <b>{ex.he[1]}</b>
        {ex.he[2]}
      </span>
      {tr && (
        <span className="tk-w-ex-tr" lang={ex.en ? 'en' : undefined}>
          {ex.tr}
          {ex.en && <small> {t('words.exampleEn')}</small>}
        </span>
      )}
      <small className="tk-w-ex-ref">
        <VerseRef ex={ex} />
      </small>
    </span>
  );
}
