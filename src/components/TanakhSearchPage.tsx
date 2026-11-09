import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { Icon } from './ui';
import { BOOKS, type Section } from '../core/tanakhCycle';
import { fold, highlight, isCyrillic, isHebrew, loadIndex, parseRef, search, terms, type SearchIndex, type SearchLang } from '../core/tanakhSearch';

const PAGE = 50;
type Filter = 'all' | Section | string; // string — slug книги

/** Запрос в адресе: `#/search?q=…` — ссылкой можно поделиться, «назад» возвращает к результатам. */
const queryFromHash = () => new URLSearchParams(location.hash.split('?')[1] ?? '').get('q') ?? '';

function Marked({ text, words, on }: { text: string; words: string[]; on: boolean }) {
  if (!on) return <>{text}</>;
  return (
    <>
      {highlight(text, words).map(([s, hit], k) => (hit ? <mark key={k}>{s}</mark> : s))}
    </>
  );
}

/**
 * «Поиск по Пророкам и Писаниям» (`#/search[?q=…]`): слово или несколько слов — на иврите (без огласовок, в любом месте
 * слова) или на языке перевода; либо место («Йеґошуа 2:5», «Tehillim 23») — переход к нему. Результаты — в порядке Танаха,
 * фильтр по разделу и книге; стих — ссылкой на день цикла читателя (`#/verse/…` → `VersePage`).
 */
export function TanakhSearchPage() {
  const { t, locale } = useI18n();
  const lang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const [input, setInput] = useState(queryFromHash);
  const [query, setQuery] = useState(input);
  const [indexes, setIndexes] = useState<Partial<Record<SearchLang, SearchIndex>>>({});
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [limit, setLimit] = useState(PAGE);

  // в чём искать: иврит — в тексте, кириллица — в русском переводе, латиница — в английском (и немецком на немецком сайте)
  const words = useMemo(() => terms(query), [query]);
  const hebrew = isHebrew(query);
  const where: SearchLang[] = hebrew ? ['he'] : isCyrillic(query) ? ['ru'] : lang === 'de' ? ['de', 'en'] : ['en'];
  const need: SearchLang[] = [...new Set<SearchLang>(['he', 'en', ...(lang === 'en' ? [] : [lang as SearchLang]), ...where])];

  useEffect(() => {
    let live = true;
    Promise.all(need.map((l) => loadIndex(l).then((ix) => [l, ix] as const))).then((res) => {
      if (!live) return;
      if (res.some(([, ix]) => !ix)) setFailed(true);
      setIndexes((old) => ({ ...old, ...Object.fromEntries(res.filter(([, ix]) => ix)) }));
    });
    return () => {
      live = false;
    };
  }, [need.join()]);

  // запрос — в адрес (без hashchange: страница не перерисовывается и не прыгает наверх)
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(input);
      setFilter('all');
      setLimit(PAGE);
      const base = location.hash.split('?')[0] || '#/search';
      history.replaceState(null, '', input.trim() ? `${base}?q=${encodeURIComponent(input.trim())}` : base);
    }, 250);
    return () => clearTimeout(t);
  }, [input]);

  const ready = where.every((l) => indexes[l]) && !!indexes.he && !!indexes.en;
  const short = words.join('').length < 2;
  const hits = useMemo(() => {
    if (!ready || short) return [];
    const seen = new Set<string>();
    return where
      .flatMap((l) => search(indexes[l]!, words))
      .filter((h) => (seen.has(`${h.section}${h.i}`) ? false : (seen.add(`${h.section}${h.i}`), true)))
      .sort((a, b) => (a.section === b.section ? a.i - b.i : a.section === 'neviim' ? -1 : 1));
  }, [ready, short, words, where.join()]);
  const ref = useMemo(() => parseRef(query), [query]);

  const count = (f: Filter) => hits.filter((h) => f === 'all' || h.section === f || h.book.slug === f).length;
  const shown = hits.filter((h) => filter === 'all' || h.section === filter || h.book.slug === filter);
  const books = BOOKS.filter((b) => hits.some((h) => h.book === b));

  return (
    <>
      <TopBar title={t('search.title')} />
      <div className="wrap ws ts">
        <header className="tk-head">
          <h1>
            {t('search.title')}{' '}
            <span className="he" lang="he">
              נביאים · כתובים
            </span>
          </h1>
          <p className="ws-lead">{t('search.lead')}</p>
        </header>

        <form className="ts-form" role="search" onSubmit={(e) => (e.preventDefault(), setQuery(input))}>
          <Icon name="search" size={18} />
          <input
            type="search"
            value={input}
            autoFocus
            dir="auto"
            enterKeyHint="search"
            aria-label={t('search.title')}
            placeholder={t('search.placeholder')}
            onChange={(e) => setInput(e.target.value)}
          />
        </form>
        <p className="ts-hint">{t('search.hint')}</p>

        {ref && (
          <p className="ts-goto">
            <a className="btn" href={`#/verse/${ref.book.slug}-${ref.chapter}-${ref.verse}`}>
              {t('search.goto', { ref: `${ref.book.name[lang]} ${ref.chapter}:${ref.verse}` })} →
            </a>
          </p>
        )}

        {failed && !ready ? (
          <p className="tk-note">{t('search.failed')}</p>
        ) : !ready && !short ? (
          <p className="ts-status">{t('search.loading')}</p>
        ) : short || (ref && hits.length === 0) ? null : hits.length === 0 ? (
          <p className="ts-status">
            {t('search.none')}
            {where[0] === 'ru' && <> {t('search.ruPartial')}</>}
          </p>
        ) : (
          <>
            <p className="ts-status">
              {t('search.found', { n: hits.length })}
            </p>
            {where[0] === 'ru' && <p className="ts-hint">{t('search.ruPartial')}</p>}
            <div className="bm-filter" role="group" aria-label={t('search.filter')}>
              {(['all', 'neviim', 'ketuvim'] as Filter[]).map((f) => {
                const n = count(f);
                if (f !== 'all' && (n === 0 || n === hits.length)) return null;
                return (
                  <button key={f} type="button" className={`bm-chip${filter === f ? ' on' : ''}`} aria-pressed={filter === f} onClick={() => (setFilter(f), setLimit(PAGE))}>
                    {f === 'all' ? t('search.all') : t(`tanakh.${f as Section}`)} · {n}
                  </button>
                );
              })}
            </div>
            {books.length > 1 && (
              <div className="bm-filter ts-books" role="group" aria-label={t('search.books')}>
                {books.map((b) => (
                  <button
                    key={b.slug}
                    type="button"
                    className={`bm-chip${filter === b.slug ? ' on' : ''}`}
                    aria-pressed={filter === b.slug}
                    onClick={() => (setFilter(filter === b.slug ? 'all' : b.slug), setLimit(PAGE))}
                  >
                    {b.name[lang]} · {count(b.slug)}
                  </button>
                ))}
              </div>
            )}
            <ul className="bm-list ts-list">
              {shown.slice(0, limit).map((h) => {
                const he = indexes.he![h.section][h.i];
                // перевод — тот, где нашлось (иначе — язык сайта, нет перевода проекта — английский)
                const found = hebrew ? undefined : where.find((l) => {
                      const x = fold(indexes[l]?.[h.section][h.i] ?? '');
                      return !!x && words.every((w) => x.includes(w));
                    });
                const own = lang !== 'en' ? indexes[lang]?.[h.section][h.i] : '';
                const trLang: SearchLang = found ?? (own ? lang : 'en');
                const tr = indexes[trLang]![h.section][h.i];
                return (
                  <li key={`${h.section}${h.i}`} className="bm-item">
                    <a className="bm-ref" href={`#/verse/${h.book.slug}-${h.chapter}-${h.verse}`}>
                      {h.book.name[lang]} {h.chapter}:{h.verse}
                      <span className="he" lang="he">
                        {h.book.he}
                      </span>
                    </a>
                    {he && (
                      <p className="ts-he he" lang="he" dir="rtl">
                        <Marked text={he} words={words} on={hebrew} />
                      </p>
                    )}
                    {tr && (
                      <p className="bm-text" lang={trLang}>
                        <Marked text={tr} words={words} on={!!found} />
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
            {shown.length > limit && (
              <p className="ts-more">
                <button type="button" className="btn ghost" onClick={() => setLimit((n) => n + PAGE)}>
                  {t('search.more', { n: Math.min(PAGE, shown.length - limit), left: shown.length - limit })}
                </button>
              </p>
            )}
          </>
        )}
      </div>
      <Colophon />
    </>
  );
}
