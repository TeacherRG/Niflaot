import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { AtlasMap } from './AtlasMap';
import {
  atlasName,
  bce,
  atlasMatch,
  loadAtlasAll,
  loadAtlasTexts,
  loadTimeline,
  osmLink,
  placeSure,
  type AtlasAll,
  type AtlasEntity,
  type AtlasLang,
  type AtlasTexts,
  type Timeline,
  type TimelineEvent,
  type TimelineKing,
} from '../core/atlas';
import { BOOKS, track } from '../core/tanakhCycle';
import { CYCLE, cycleDayFor, localToday } from '../core/tanakh';
import { civilDate } from '../core/hebrewDate';

type Kind = 'all' | 'people' | 'peoples' | 'places';
const KIND_OF = (e: AtlasEntity): Exclude<Kind, 'all'> => (e.k === 'p' ? 'places' : e.k === 'g' ? 'peoples' : 'people');

/** «joshua 9:3» → подпись «Йеґошуа 9:3» и ссылка на день цикла с этим стихом (`#/verse/…`) */
function refLink(ref: string, lang: AtlasLang) {
  const [b, cv] = ref.split(' ');
  const [c, v = '1'] = cv.split(':');
  const book = BOOKS.find((x) => x.slug === b);
  return { label: `${book ? book.name[lang] : b} ${cv}`, href: `#/verse/${b}-${c}-${v}` };
}

function useAtlas(lang: AtlasLang) {
  const [data, setData] = useState<{ all: AtlasAll; tx: AtlasTexts; tl: Timeline } | null>(null);
  useEffect(() => {
    let live = true;
    Promise.all([loadAtlasAll(), loadAtlasTexts(lang), loadTimeline()]).then(([all, tx, tl]) => live && all && setData({ all, tx, tl }));
    return () => {
      live = false;
    };
  }, [lang]);
  return data;
}

/**
 * «Кто и где» — справочник людей и мест Пророков и Писаний (меню → «Танах»): `#/atlas` — поиск и по алфавиту,
 * `#/atlas/<id>` — страница записи, `#/atlas/timeline` — хронология по «Седер олам». Данные — проекта (src/tanakh/atlas).
 */
export function AtlasPage({ id }: { id?: string }) {
  const { t, locale } = useI18n();
  const lang: AtlasLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const data = useAtlas(lang);
  const title = id === 'timeline' ? t('atlas.timeline') : t('atlas.menu');
  useEffect(() => {
    document.title = `${title} · ${t('app.title')}`;
  }, [title, t]);
  return (
    <>
      <TopBar title={title} />
      <div className="wrap at">
        <nav className="at-tabs" aria-label={t('atlas.menu')}>
          <a href="#/atlas" className={id !== 'timeline' ? 'on' : ''} aria-current={!id ? 'page' : undefined}>
            {t('atlas.tabIndex')}
          </a>
          <a href="#/atlas/timeline" className={id === 'timeline' ? 'on' : ''} aria-current={id === 'timeline' ? 'page' : undefined}>
            {t('atlas.timeline')}
          </a>
          <a href="#/atlas/3d">{t('sno.tab')}</a>
        </nav>
        {!data ? (
          <p className="tk-note">{t('tanakh.loading')}</p>
        ) : id === 'timeline' ? (
          <TimelineView data={data} lang={lang} />
        ) : id ? (
          <Entry id={id} data={data} lang={lang} />
        ) : (
          <Index data={data} lang={lang} />
        )}
      </div>
      <Colophon />
    </>
  );
}

function Index({ data, lang }: { data: { all: AtlasAll; tx: AtlasTexts }; lang: AtlasLang }) {
  const { t, locale } = useI18n();
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<Kind>('all');
  const { all, tx } = data;
  // только записи со справкой (у записей семьи и ориентиров — одно имя)
  const items = useMemo(() => {
    const coll = new Intl.Collator(locale);
    return Object.entries(all.e)
      .filter(([i]) => tx[i]?.d)
      .map(([i, e]) => ({ id: i, e, name: atlasName(i, e, tx, lang), d: tx[i].d! }))
      .sort((a, b) => coll.compare(a.name, b.name));
  }, [all, tx, lang, locale]);
  // имена на всех трёх языках: на русском сайте находится и «Gerar», на английском — «Герар»
  const [others, setOthers] = useState<AtlasTexts[]>([]);
  useEffect(() => {
    let live = true;
    Promise.all((['ru', 'en', 'de'] as AtlasLang[]).filter((l) => l !== lang).map(loadAtlasTexts)).then((x) => live && setOthers(x));
    return () => {
      live = false;
    };
  }, [lang]);
  const f = q.trim();
  const shown = useMemo(() => {
    const ranked = items
      .filter((x) => kind === 'all' || KIND_OF(x.e) === kind)
      .map((x) => ({ x, r: atlasMatch(f, [x.name, ...others.map((o) => o[x.id]?.n ?? '')], x.e.he, x.d) }))
      .filter((y) => y.r >= 0);
    // с запросом — сначала лучшие совпадения (по алфавиту внутри), без запроса — весь список по алфавиту
    if (f) ranked.sort((a, b) => a.r - b.r);
    return ranked.map((y) => y.x);
  }, [items, others, kind, f]);
  const groups = new Map<string, typeof shown>();
  for (const x of shown) {
    const L = f ? '' : x.name.charAt(0).toUpperCase();
    groups.set(L, [...(groups.get(L) ?? []), x]);
  }
  return (
    <>
      <header className="at-head">
        <h1>
          {t('atlas.menu')}{' '}
          <span className="he" lang="he">
            מִי וְאֵיפֹה
          </span>
        </h1>
        <p className="ws-lead">{t('atlas.indexLead')}</p>
      </header>
      <div className="at-search">
        <input type="search" dir="auto" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('atlas.search')} aria-label={t('atlas.search')} />
      </div>
      <div className="bm-filter" role="group" aria-label={t('atlas.menu')}>
        {(['all', 'people', 'peoples', 'places'] as Kind[]).map((k) => (
          <button key={k} type="button" className={`bm-chip${kind === k ? ' on' : ''}`} aria-pressed={kind === k} onClick={() => setKind(k)}>
            {t(`atlas.kinds.${k}` as MessageKey)}
          </button>
        ))}
      </div>
      {!f && (
        <nav className="at-abc" aria-label={t('atlas.abc')}>
          {[...groups.keys()].map((L) => (
            <a key={L} href={`#/atlas`} onClick={(e) => (e.preventDefault(), document.getElementById(`at-${L}`)?.scrollIntoView({ behavior: 'smooth' }))}>
              {L}
            </a>
          ))}
        </nav>
      )}
      <p className="at-count">{shown.length ? t('atlas.count', { n: shown.length }) : t('atlas.none')}</p>
      {f && (
        <p className="at-more">
          {!shown.length && <>{t('atlas.growing')} </>}
          <a href={`#/search?q=${encodeURIComponent(f)}`}>{t('atlas.searchText', { q: f })} →</a>
        </p>
      )}
      {[...groups].map(([L, xs]) => (
        <section key={L} className="at-group" id={`at-${L}`}>
          {L && <h2 className="at-letter">{L}</h2>}
          <ul className="at-list">
            {xs.map((x) => (
              <li key={x.id}>
                <a href={`#/atlas/${x.id}`}>
                  <b>{x.name}</b>{' '}
                  <span className="he" lang="he">
                    {x.e.he}
                  </span>{' '}
                  <small className="ta-kind">{t(`atlas.kind.${x.e.k}` as MessageKey)}</small>
                  <span className="at-d">{x.d.split(/(?<=[.!?])\s/)[0]}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="ta-credit">{t('atlas.credit')}</p>
    </>
  );
}

function EventItem({ ev, here, data, lang, self }: { ev: TimelineEvent; here?: boolean; data: { all: AtlasAll; tx: AtlasTexts }; lang: AtlasLang; self?: string }) {
  const { t } = useI18n();
  const r = ev.ref ? refLink(ev.ref, lang) : null;
  const years = ev.y2 ? `${ev.y}–${ev.y2}` : `${ev.y}`;
  return (
    <li className={`at-ev${here ? ' here' : ''}`} id={here ? 'at-here' : undefined}>
      <span className="at-y">
        {years}
        <small>{t('atlas.bce', { n: ev.y2 ? `${bce(ev.y)}–${bce(ev.y2)}` : bce(ev.y) })}</small>
      </span>
      <div>
        <p className="at-ev-t">
          <b>{ev.t[lang]}</b>
          {here && <span className="at-here">{t('atlas.youAreHere')}</span>}
        </p>
        <p className="at-ev-d">{ev.d[lang]}</p>
        <p className="at-ev-links">
          {r ? <a href={r.href}>{r.label}</a> : ev.src && <span>{ev.src[lang]}</span>}
          {(ev.who ?? [])
            .filter((i) => data.all.e[i] && i !== self)
            .map((i) =>
              data.tx[i]?.d ? (
                <a key={i} className="at-chip" href={`#/atlas/${i}`}>
                  {atlasName(i, data.all.e[i], data.tx, lang)}
                </a>
              ) : (
                <span key={i} className="at-chip">
                  {atlasName(i, data.all.e[i], data.tx, lang)}
                </span>
              ),
            )}
        </p>
      </div>
    </li>
  );
}

/** Событие, до которого дошёл отрывок дня Пророков (последнее со ссылкой не дальше сегодняшнего стиха) */
function hereIndex(events: TimelineEvent[]): number {
  const tr = track('neviim');
  const day = CYCLE[cycleDayFor(localToday()).index];
  if (!day) return -1;
  const now = day.neviim[0];
  let best = -1;
  events.forEach((ev, i) => {
    if (!ev.ref) return;
    const [b, cv] = ev.ref.split(' ');
    const [c, v] = cv.split(':').map(Number);
    const at = tr.findIndex((x) => x.book.slug === b && x.chapter === c && (!v || x.verse === v));
    if (at >= 0 && at <= now) best = i;
  });
  return best;
}

/**
 * «Цари и пророки по годам» — таблица: год (от сотворения мира, по «Седер ґа-дорот») · цари Йеґуды · цари Израиля · пророки.
 * Строка — год, в который кто-то воцарился или начал пророчествовать; царь объединённого царства — на оба столбца.
 */
function ReignTable({ data, lang }: { data: { all: AtlasAll; tx: AtlasTexts; tl: Timeline }; lang: AtlasLang }) {
  const { t } = useI18n();
  const { kings, prophets } = data.tl;
  const years = [...new Set([...kings.map((k) => k.y!), ...prophets.map((p) => p.y)])].sort((a, b) => a - b);
  const king = (k: TimelineKing) => {
    const r = refLink(k.ref, lang);
    return (
      <div key={k.t.ru} className="rt-k">
        <b>{k.who && data.tx[k.who]?.d ? <a href={`#/atlas/${k.who}`}>{k.t[lang]}</a> : k.t[lang]}</b>{' '}
        <span className="he" lang="he">
          {k.he}
        </span>
        <small>
          {k.r[lang]} · <a href={r.href}>{r.label}</a>
        </small>
      </div>
    );
  };
  return (
    <div className="rt-wrap">
      <table className="rt">
        <thead>
          <tr>
            <th scope="col">{t('atlas.year')}</th>
            <th scope="col">{t('atlas.kingsJudah')}</th>
            <th scope="col">{t('atlas.kingsIsrael')}</th>
            <th scope="col">{t('atlas.prophets')}</th>
          </tr>
        </thead>
        <tbody>
          {years.map((y) => {
            const united = kings.filter((k) => k.y === y && k.lane === 'united');
            const ps = prophets.filter((p) => p.y === y);
            return (
              <tr key={y}>
                <th scope="row">
                  {y}
                  <small>{t('atlas.bce', { n: bce(y) })}</small>
                </th>
                {united.length ? (
                  <td colSpan={2} className="rt-united">
                    {united.map(king)}
                  </td>
                ) : (
                  <>
                    <td>{kings.filter((k) => k.y === y && k.lane === 'judah').map(king)}</td>
                    <td>{kings.filter((k) => k.y === y && k.lane === 'israel').map(king)}</td>
                  </>
                )}
                <td>
                  {ps.map((p) => {
                    const r = refLink(p.ref, lang);
                    return (
                      <div key={p.t.ru} className="rt-p">
                        <b>{p.t[lang]}</b>{' '}
                        <span className="he" lang="he">
                          {p.he}
                        </span>
                        <small>
                          {p.w[lang]} · <a href={r.href}>{r.label}</a>
                        </small>
                      </div>
                    );
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function TimelineView({ data, lang }: { data: { all: AtlasAll; tx: AtlasTexts; tl: Timeline }; lang: AtlasLang }) {
  const { t } = useI18n();
  const { eras, events } = data.tl;
  const here = useMemo(() => hereIndex(events), [events]);
  const [view, setView] = useState<'table' | 'events'>('table');
  const span = eras[eras.length - 1].to - eras[0].from;
  return (
    <>
      <header className="at-head">
        <h1>{t('atlas.timeline')}</h1>
        <p className="ws-lead">{t('atlas.tlLead')}</p>
      </header>
      <div className="at-bar" aria-hidden="true">
        {eras.map((e, i) => (
          <a key={e.id} href={`#/atlas/timeline`} onClick={(ev) => (ev.preventDefault(), document.getElementById(`era-${e.id}`)?.scrollIntoView({ behavior: 'smooth' }))} className={`at-era e${i % 3}`} style={{ flexGrow: Math.max(e.to - e.from, span / 40) }} title={e.t[lang]}>
            <span>{e.t[lang]}</span>
          </a>
        ))}
      </div>
      <div className="bm-filter" role="group" aria-label={t('atlas.timeline')}>
        {(['table', 'events'] as const).map((v) => (
          <button key={v} type="button" className={`bm-chip${view === v ? ' on' : ''}`} aria-pressed={view === v} onClick={() => setView(v)}>
            {t(v === 'table' ? 'atlas.viewTable' : 'atlas.viewEvents')}
          </button>
        ))}
      </div>
      {view === 'table' && <ReignTable data={data} lang={lang} />}
      {view === 'events' && here >= 0 && (
        <p className="at-now">
          <a href="#/atlas/timeline" onClick={(ev) => (ev.preventDefault(), document.getElementById('at-here')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))}>
            {t('atlas.nowLine', { t: events[here].t[lang], y: events[here].y })} ↓
          </a>
        </p>
      )}
      {view === 'events' && eras.map((era, k) => {
        const evs = events.map((ev, i) => [ev, i] as const).filter(([ev]) => ev.y >= era.from && (ev.y < era.to || (k === eras.length - 1 && ev.y <= era.to)));
        return (
          <section key={era.id} className="at-era-sec" id={`era-${era.id}`}>
            <h2>
              {era.t[lang]} <small>{t('atlas.years', { a: era.from, b: era.to })}</small>
            </h2>
            {evs.length > 0 && (
              <ol className="at-events">
                {evs.map(([ev, i]) => (
                  <EventItem key={i} ev={ev} here={i === here} data={data} lang={lang} />
                ))}
              </ol>
            )}
          </section>
        );
      })}
      <p className="ta-credit">{t('atlas.tlSource')}</p>
    </>
  );
}

function Entry({ id, data, lang }: { id: string; data: { all: AtlasAll; tx: AtlasTexts; tl: Timeline }; lang: AtlasLang }) {
  const { t, locale } = useI18n();
  const { all, tx, tl } = data;
  const e = all.e[id];
  if (!e || !tx[id]?.d) return <p className="tk-note">{t('atlas.none')}</p>;
  const name = (i: string) => atlasName(i, all.e[i], tx, lang);
  const person = (i: string) =>
    tx[i]?.d ? (
      <a key={i} href={`#/atlas/${i}`}>
        {name(i)}
      </a>
    ) : (
      <span key={i}>{name(i)}</span>
    );
  // родители и дети — и те, у кого эта запись в семье (сын Нуна — у Нуна в детях)
  const kids = new Set(e.ch ?? []);
  for (const [j, x] of Object.entries(all.e)) if (x.fa === id || x.mo === id) kids.add(j);
  const fam: [string, string[]][] = [
    ['atlas.fa', e.fa ? [e.fa] : []],
    ['atlas.mo', e.mo ? [e.mo] : []],
    ['atlas.sp', e.sp ?? []],
    ['atlas.ch', [...kids]],
  ];
  const where = all.r[id];
  const evs = tl.events.filter((ev) => ev.who?.includes(id));
  return (
    <article className="at-entry">
      <p className="at-back">
        <a href="#/atlas">← {t('atlas.back')}</a>
      </p>
      <header className="at-head">
        <p className="he at-he" lang="he">
          {e.he}
        </p>
        <h1>{name(id)}</h1>
        <p>
          <small className="ta-kind">{t(`atlas.kind.${e.k}` as MessageKey)}</small>
        </p>
      </header>
      <p className="at-desc">{tx[id].d}</p>
      {fam.some(([, x]) => x.length) && (
        <ul className="ta-fam at-fam">
          {fam
            .filter(([, x]) => x.length)
            .map(([k, ids]) => (
              <li key={k}>
                <span>{t(k as MessageKey)}</span>{' '}
                {ids.map((i, n) => (
                  <span key={i}>
                    {n > 0 && ', '}
                    {person(i)}
                  </span>
                ))}
              </li>
            ))}
        </ul>
      )}
      {e.ll && (
        <section className="at-sec">
          <div className="ta-map">
            <AtlasMap label={t('atlas.mapLabel')} ratio={0.62} points={[{ id, ll: e.ll, a: e.a, label: name(id) }]} />
          </div>
          <p className="ta-meta">
            {!e.a && (
              <>
                <span className={`ta-sure s${placeSure(e)}`}>{t(`atlas.sure.${placeSure(e)}` as MessageKey)}</span> ·{' '}
              </>
            )}
            <a href={osmLink(e.ll)} target="_blank" rel="noopener noreferrer">
              {t('atlas.osm')}
            </a>
          </p>
        </section>
      )}
      {evs.length > 0 && (
        <section className="at-sec">
          <h2>{t('atlas.inTimeline')}</h2>
          <ol className="at-events">
            {evs.map((ev, i) => (
              <EventItem key={i} ev={ev} data={data} lang={lang} self={id} />
            ))}
          </ol>
          <p>
            <a href="#/atlas/timeline">{t('atlas.timeline')} →</a>
          </p>
        </section>
      )}
      {where && (
        <section className="at-sec">
          <h2>{t('atlas.inCycle')}</h2>
          <p className="at-count">{t('atlas.verses', { n: where[0] })}</p>
          {/* по книгам: «Йеґошуа 1, 2, 3…» — глава ведёт на день цикла с её первым стихом, где есть это имя */}
          {[...new Set(where[1].map(([, , ref]) => ref.split(' ')[0]))].map((b) => (
            <p key={b} className="at-where">
              <b>{BOOKS.find((x) => x.slug === b)?.name[lang] ?? b}</b>{' '}
              {where[1]
                .filter(([, , ref]) => ref.startsWith(`${b} `))
                .map(([date, , ref]) => (
                  <a key={ref} href={refLink(ref, lang).href} title={civilDate(date, locale)}>
                    {ref.split(' ')[1].split(':')[0]}
                  </a>
                ))}
            </p>
          ))}
        </section>
      )}
      <p className="ta-credit">{t('atlas.credit')}</p>
    </article>
  );
}
