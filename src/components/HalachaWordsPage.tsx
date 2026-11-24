import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { readHebrew } from '../core/translit';
import { KNOWN_BOX } from '../core/words';
import { loadTerms, type RambamTerms } from '../core/rambam';
import { hBox, hDue, hMarkKnown, hMarkLearn, hReview, hUnmark, loadLexicon, useHalachaStore, type Lexicon } from '../core/halachaWords';

const readLang = (l: string) => (l === 'en' || l === 'de' ? l : 'ru');

/** «Учу» / «Знаю» of one word of the halachah dictionary (the window over a word, the lists of this page) */
export function HalachaButtons({ id }: { id: string }) {
  const { t } = useI18n();
  const store = useHalachaStore();
  const box = hBox(store, id);
  const known = box >= KNOWN_BOX;
  const learning = box > 0 && !known;
  return (
    <p className="wp-btns tk-w-btns">
      <button type="button" className="tk-w-learn" aria-pressed={learning} onClick={() => (learning ? hUnmark(id) : hMarkLearn(id))}>
        {learning ? `● ${t('words.learn')}` : t('words.learn')}
      </button>
      <button type="button" className="tk-w-know" aria-pressed={known} onClick={() => (known ? hUnmark(id) : hMarkKnown(id))}>
        {known ? `✓ ${t('words.know')}` : t('words.know')}
      </button>
    </p>
  );
}

/**
 * `#/halacha-words` — «Слова ґалахи» (src/core/halachaWords.ts): words of the Mishneh Torah that the Tanakh dictionary hasn't.
 * Today's review — a card: the word → «Показать перевод» → «Помню» / «Не помню»; then «Учу», «Знаю» and the whole dictionary
 * (alphabetical, with «Учу» / «Знаю»). The words come from the chapters prepared so far; translations — Russian for now.
 */
export function HalachaWordsPage() {
  const { t, locale } = useI18n();
  const store = useHalachaStore();
  const [lex, setLex] = useState<Lexicon | null>(null);
  const [shown, setShown] = useState(false);
  const [q, setQ] = useState('');
  const [terms, setTerms] = useState<RambamTerms | null>(null);
  useEffect(() => {
    loadTerms().then(setTerms);
  }, []);
  const term = (id: string) => (locale === 'ru' ? terms?.t[id] : undefined);
  useEffect(() => {
    let live = true;
    loadLexicon().then((x) => live && setLex(x));
    return () => {
      live = false;
    };
  }, []);
  useEffect(() => {
    document.title = `${t('hw.title')} · ${t('app.title')}`;
  }, [t]);
  const due = useMemo(() => (lex ? hDue(store).filter((id) => lex[id]) : []), [store, lex]);
  const card = due[0];
  useEffect(() => setShown(false), [card]);
  const ids = lex ? Object.keys(lex) : [];
  const learning = ids.filter((id) => hBox(store, id) > 0 && hBox(store, id) < KNOWN_BOX);
  const known = ids.filter((id) => hBox(store, id) >= KNOWN_BOX);
  const all = useMemo(() => {
    if (!lex) return [];
    const s = q.trim().replace(/[֑-ׇ]/g, '').toLowerCase();
    return Object.entries(lex)
      .filter(([id, [, tr]]) => !s || id.includes(s) || tr.toLowerCase().includes(s))
      .sort((a, b) => a[0].localeCompare(b[0], 'he'));
  }, [lex, q]);
  const row = (id: string) =>
    lex?.[id] && (
      <li key={id} className="hw-row">
        <span className="he hw-he" lang="he">
          {lex[id][0]}
        </span>
        <span className="hw-tr">
          {lex[id][1]}
          {term(id) && (
            <small className="hw-term">
              <b>{term(id)![0]}</b> — {term(id)![1]}
            </small>
          )}
        </span>
        <HalachaButtons id={id} />
      </li>
    );
  return (
    <>
      <TopBar title={t('hw.title')} />
      <div className="wrap hw">
        <header className="tk-head">
          <p className="tk-kicker">{t('rm.title')}</p>
          <h1>{t('hw.title')}</h1>
          <p className="tk-day">{t('hw.lead')}</p>
          <p className="hw-stats">
            {t('hw.stats', { l: learning.length, k: known.length, d: due.length, n: ids.length })} · <a href="#/rambam">{t('rm.toToday')} →</a>
          </p>
        </header>
        {!lex ? (
          <p className="tk-note">{t('rm.loading')}</p>
        ) : card ? (
          <section className="hw-card" aria-live="polite">
            <p className="hw-card-k">{t('hw.review', { n: due.length })}</p>
            <p className="he hw-card-he" lang="he">
              {lex[card][0]}
            </p>
            <p className="hw-card-read">{lex[card][0].split(' ').map((w) => readHebrew(w, readLang(locale))).join(' ')}</p>
            {shown ? (
              <>
                <p className="hw-card-tr">{lex[card][1]}</p>
                {term(card) && (
                  <p className="rm-term">
                    <b>{term(card)![0]}</b> — {term(card)![1]}
                  </p>
                )}
                <p className="hw-card-btns">
                  <button type="button" className="btn" onClick={() => hReview(card, true)}>
                    {t('hw.remember')}
                  </button>
                  <button type="button" className="btn ghost" onClick={() => hReview(card, false)}>
                    {t('hw.forgot')}
                  </button>
                </p>
              </>
            ) : (
              <button type="button" className="btn" onClick={() => setShown(true)}>
                {t('hw.show')}
              </button>
            )}
          </section>
        ) : (
          <p className="tk-note">{learning.length + known.length ? t('hw.noneDue') : t('hw.empty')}</p>
        )}
        {learning.length > 0 && (
          <section>
            <h2 className="hw-h">{t('hw.learning', { n: learning.length })}</h2>
            <ul className="hw-list">{learning.map(row)}</ul>
          </section>
        )}
        {known.length > 0 && (
          <section>
            <h2 className="hw-h">{t('hw.known', { n: known.length })}</h2>
            <ul className="hw-list">{known.map(row)}</ul>
          </section>
        )}
        {lex && (
          <details className="hw-all">
            <summary>{t('hw.all', { n: ids.length })}</summary>
            <input className="hw-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('hw.search')} aria-label={t('hw.search')} />
            <ul className="hw-list">{all.map(([id]) => row(id))}</ul>
          </details>
        )}
        <p className="rm-credit">{t('hw.credit')}</p>
      </div>
      <Colophon />
    </>
  );
}
