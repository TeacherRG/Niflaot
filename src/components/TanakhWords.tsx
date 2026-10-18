import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import type { Section } from '../core/tanakhCycle';
import { coverage, isKnown, knownCount, loadDayWords, loadDict, pickWords, readWordStore, setKnown, useWordStore, type DayWords, type Dict, type Word, type WordLang } from '../core/words';

/**
 * «Слова отрывка» под отрывком дня (src/core/words.ts): сколько процентов слов отрывка игрок узнаёт и до пяти самых
 * частых слов Танаха из этого отрывка, которых он ещё не знает, — с переводом, корнем и частотой; «Знаю» отмечает слово.
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
          {picks.map((w) => {
            const on = isKnown(store, w.id);
            return (
              <li key={w.id} className={on ? 'on' : undefined}>
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
                  {t('words.rank', { n: dict.rank.get(w.id)! })} · {t('words.count', { n: w.n })} · {t('words.here', { n: day.w[w.id] })}
                </small>
                <button type="button" className="tk-w-know" aria-pressed={on} onClick={() => setKnown(w.id, !on)}>
                  {on ? `✓ ${t('words.know')}` : t('words.know')}
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="tk-words-done">{t('words.allKnown')}</p>
      )}
      <p className="tk-words-src">{t('words.src')}</p>
    </section>
  );
}

