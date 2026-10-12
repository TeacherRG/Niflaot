import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { CYCLE } from '../core/tanakh';
import {
  GROUP_OF,
  buildIndex,
  highlight,
  queryGematria,
  search,
  searchTanakh,
  type Hit,
  type HitGroup,
  type TanakhHit,
} from '../core/search';

const GROUPS: HitGroup[] = ['lessons', 'facts', 'terms', 'pages'];
/** results of a group shown before «Показать ещё» */
const FIRST = 6;

/** The query from the address: `#/search?q=…` (kept there, so «back» and a shared link return to it). */
const readQuery = () => new URLSearchParams(location.hash.split('?')[1] ?? '').get('q') ?? '';

function Marked({ text, q, max }: { text: string; q: string; max?: number }) {
  return (
    <>
      {highlight(text, q, max).map((p, i) => (p.mark ? <mark key={i}>{p.s}</mark> : <Fragment key={i}>{p.s}</Fragment>))}
    </>
  );
}

function HitRow({ hit, q }: { hit: Hit; q: string }) {
  const { t } = useI18n();
  const d = hit.doc;
  const fact = d.kind === 'fact';
  const inner = (
    <>
      <span className="srch-meta">
        <span className="srch-kind">{t(`search.kind.${d.kind}` as MessageKey)}</span>
        {d.where && <span> · {d.where}</span>}
      </span>
      <span className="srch-title">
        {fact ? (
          <span className="he" lang="he" dir="rtl">
            <Marked text={d.title} q={q} />
          </span>
        ) : (
          <Marked text={d.title} q={q} />
        )}
        {d.he && (
          <>
            {' '}
            <span className="he" lang="he">
              <Marked text={d.he} q={q} />
            </span>
          </>
        )}
      </span>
      {d.body && (
        <span className="srch-snip">
          <Marked text={d.body} q={q} max={d.kind === 'term' ? undefined : 200} />
        </span>
      )}
    </>
  );
  return <li>{d.href ? <a className="srch-hit" href={d.href}>{inner}</a> : <div className="srch-hit">{inner}</div>}</li>;
}

function TanakhRow({ hit }: { hit: TanakhHit }) {
  const { t, locale } = useI18n();
  const lang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const date = (iso: string) =>
    new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T12:00:00`));
  const name = hit.book.name[lang];
  const ref = hit.chapter ? `${name} ${hit.chapter}${hit.verse ? `:${hit.verse}` : ''}` : name;
  return (
    <li>
      <a className="srch-hit" href={`#/${hit.section}/${hit.date}`}>
        <span className="srch-meta">
          <span className="srch-kind">{t(`tanakh.${hit.section}`)}</span> · {t('tanakh.daySub')}
        </span>
        <span className="srch-title">
          {ref}{' '}
          <span className="he" lang="he">
            {hit.book.he}
          </span>
        </span>
        <span className="srch-snip">
          {hit.chapter
            ? t('search.tanakhDay', { date: date(hit.date) })
            : t('search.tanakhBook', { from: date(hit.date), to: date(hit.last) })}
        </span>
      </a>
    </li>
  );
}

/**
 * `#/search?q=…` — «Поиск» по всему сайту: уроки и их главы, Memo и карточки, «Знаете ли вы?» (и по числу:
 * «26»; ивритское слово — его гиматрия и что ей равно), книги Пророков и Писаний с днём чтения («Теґилим 23»),
 * словарь терминов и страницы меню (src/core/search.ts).
 */
export function SearchPage() {
  const { t, locale } = useI18n();
  const [q, setQ] = useState(readQuery);
  const [more, setMore] = useState<Partial<Record<HitGroup, boolean>>>({});
  const input = useRef<HTMLInputElement>(null);
  const index = useMemo(() => buildIndex(locale, t), [locale, t]);

  useEffect(() => {
    document.title = `${t('search.title')} · ${t('app.title')}`;
  }, [t]);
  useEffect(() => {
    const on = () => setQ(readQuery());
    addEventListener('hashchange', on);
    return () => removeEventListener('hashchange', on);
  }, []);

  const change = (v: string) => {
    setQ(v);
    setMore({});
    history.replaceState(null, '', `#/search${v.trim() ? `?q=${encodeURIComponent(v)}` : ''}`);
  };

  const query = q.trim();
  const gem = useMemo(() => queryGematria(query), [query]);
  const results = useMemo(() => {
    if (!query) return null;
    const hits = search(index, query);
    // a Hebrew word: the facts equal to its value too
    if (gem !== null) for (const h of search(index, String(gem))) if (h.doc.kind === 'fact' && !hits.some((x) => x.doc === h.doc)) hits.push(h);
    const seen = new Set<string>();
    const by: Record<HitGroup, Hit[]> = { lessons: [], facts: [], terms: [], pages: [] };
    for (const h of hits) {
      const k = `${h.doc.kind}|${h.doc.title}|${h.doc.he ?? ''}`;
      if (seen.has(k)) continue;
      seen.add(k);
      by[GROUP_OF[h.doc.kind]].push(h);
    }
    return { by, tanakh: searchTanakh(query, CYCLE) };
  }, [index, query, gem]);

  const total = results ? GROUPS.reduce((a, g) => a + results.by[g].length, 0) + results.tanakh.length : 0;
  const examples = t('search.examples').split(' | ');

  return (
    <>
      <TopBar title={t('search.title')} />
      <div className="wrap srch">
        <header className="tk-head">
          <h1>{t('search.h1')}</h1>
        </header>
        <form role="search" className="srch-form" onSubmit={(e) => (e.preventDefault(), input.current?.blur())}>
          <input
            ref={input}
            type="search"
            enterKeyHint="search"
            autoFocus
            value={q}
            onChange={(e) => change(e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.title')}
          />
        </form>

        {!query && (
          <div className="srch-ex">
            <p>{t('search.try')}</p>
            <div className="srch-chips">
              {examples.map((x) => (
                <button key={x} type="button" className="srch-chip" onClick={() => change(x)}>
                  <span className={/[א-ת]/.test(x) ? 'he' : undefined}>{x}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {gem !== null && (
          <p className="srch-gem">
            <span className="he" lang="he">
              {query}
            </span>{' '}
            = <b className="num">{gem}</b> <small>{t('search.gematria')}</small>
          </p>
        )}

        {results && (
          <p className="srch-count" aria-live="polite">
            {total ? t('search.found', { n: total }) : t('search.none')}
          </p>
        )}

        {results && results.tanakh.length > 0 && (
          <section className="srch-group">
            <h2>{t('search.group.tanakh')}</h2>
            <ul>
              {results.tanakh.map((h) => (
                <TanakhRow key={h.book.slug} hit={h} />
              ))}
            </ul>
          </section>
        )}
        {results &&
          GROUPS.filter((g) => results.by[g].length).map((g) => {
            const list = results.by[g];
            const shown = more[g] ? list : list.slice(0, FIRST);
            return (
              <section key={g} className="srch-group">
                <h2>
                  {t(`search.group.${g}` as MessageKey)} <small>{list.length}</small>
                </h2>
                <ul>
                  {shown.map((h, i) => (
                    <HitRow key={i} hit={h} q={query} />
                  ))}
                </ul>
                {list.length > shown.length && (
                  <button type="button" className="btn ghost srch-more" onClick={() => setMore((m) => ({ ...m, [g]: true }))}>
                    {t('search.more', { n: list.length - shown.length })}
                  </button>
                )}
              </section>
            );
          })}
        {results && !total && <p className="srch-ask">{t('search.ask')}</p>}
      </div>
      <Colophon />
    </>
  );
}
