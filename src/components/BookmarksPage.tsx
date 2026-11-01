import { useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { BOOKS } from '../core/tanakhCycle';
import { civilDate } from '../core/hebrewDate';
import { gotoVerse, isLive, setNote, toggleMark, useNotes, type VerseNote } from '../core/notes';

type Filter = 'all' | 'marks' | 'notes';

/**
 * «Мои закладки» (`#/bookmarks`): все стихи Пророков и Писаний с закладкой или заметкой — по книгам в порядке Танаха;
 * у стиха — начало перевода, своя заметка и ссылка на день цикла (страница прокручивает к стиху).
 */
export function BookmarksPage() {
  const { t, locale } = useI18n();
  const store = useNotes();
  const [filter, setFilter] = useState<Filter>('all');
  const lang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const order = (k: string) => {
    const [b, cv] = k.split(' ');
    const [c, v] = cv.split(':').map(Number);
    return [BOOKS.findIndex((x) => x.slug === b), c, v];
  };
  const all = Object.entries(store)
    .filter((e): e is [string, VerseNote] => isLive(e[1]))
    .sort(([a], [b]) => {
      const [x, y] = [order(a), order(b)];
      return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
    });
  const shown = all.filter(([, e]) => (filter === 'marks' ? e.m === 1 : filter === 'notes' ? !!e.n : true));
  const marks = all.filter(([, e]) => e.m === 1).length;
  const notes = all.filter(([, e]) => e.n).length;

  return (
    <>
      <TopBar title={t('notes.title')} />
      <div className="wrap ws bm">
        <header className="tk-head">
          <h1>{t('notes.title')}</h1>
          <p className="ws-lead">{t('notes.lead')}</p>
        </header>
        {all.length === 0 ? (
          <p className="ws-note">
            {t('notes.empty')} <a href="#/neviim">{t('tanakh.neviim')}</a> · <a href="#/ketuvim">{t('tanakh.ketuvim')}</a>
          </p>
        ) : (
          <>
            <div className="bm-filter" role="group" aria-label={t('notes.title')}>
              {(
                [
                  ['all', t('notes.all', { n: all.length })],
                  ['marks', t('notes.marks', { n: marks })],
                  ['notes', t('notes.notes', { n: notes })],
                ] as [Filter, string][]
              ).map(([f, label]) => (
                <button key={f} type="button" className={`bm-chip${filter === f ? ' on' : ''}`} aria-pressed={filter === f} onClick={() => setFilter(f)}>
                  {label}
                </button>
              ))}
            </div>
            <ul className="bm-list">
              {shown.map(([k, e]) => {
                const [b, cv] = k.split(' ');
                const [c, v] = cv.split(':');
                const book = BOOKS.find((x) => x.slug === b);
                const ref = { key: k, date: e.d, section: e.s, text: e.x };
                return (
                  <li key={k} className="bm-item">
                    <div className="bm-top">
                      <a
                        className="bm-ref"
                        href={e.d ? `#/${e.s}/${e.d}` : `#/${e.s}`}
                        onClick={() => gotoVerse(`v-${b}-${c}-${v}`)}
                      >
                        {book ? `${book.name[lang]} ${cv}` : k}
                        {book && (
                          <span className="he" lang="he">
                            {book.he}
                          </span>
                        )}
                      </a>
                      {e.d && <small className="bm-date">{civilDate(e.d, locale)}</small>}
                    </div>
                    {e.x && <p className="bm-text">{e.x}</p>}
                    {e.n && <p className="bm-note">{e.n}</p>}
                    <div className="bm-actions">
                      {e.m === 1 && (
                        <button type="button" className="btn ghost" onClick={() => toggleMark(ref)}>
                          {t('notes.unmark')}
                        </button>
                      )}
                      {e.n && (
                        <button type="button" className="btn ghost" onClick={() => setNote(ref, '')}>
                          {t('notes.delete')}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
      <Colophon />
    </>
  );
}
