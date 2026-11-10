import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import type { MessageKey } from '../i18n/locales/ru';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { bce, loadAtlasAll, loadAtlasTexts, loadTimeline, type AtlasLang, type AtlasTexts } from '../core/atlas';
import { loadAtlasKeys } from '../core/atlasKeys';
import { activeAt, buildSnoModel, personName, placeName, stayAt, type SnoData, type SnoEvent, type SnoModel, type SnoPerson } from '../core/sno3d';
import { BOOKS } from '../core/tanakhCycle';
import { Scene, type Pick } from './Sno3DScene';

/** «joshua 9:3» → «Йеґошуа 9:3» и ссылка на день цикла (`#/verse/…`) */
function refLink(ref: string, lang: AtlasLang) {
  const [b, cv] = ref.split(' ');
  const [c, v = '1'] = cv.split(':');
  const book = BOOKS.find((x) => x.slug === b);
  return book ? { label: `${book.name[lang]} ${cv}`, href: `#/verse/${b}-${c}-${v}` } : null;
}

interface Loaded {
  data: SnoData;
  model: SnoModel;
  tx: AtlasTexts;
}

/**
 * «Шана · Нефеш · Олам» — объёмная модель (`#/atlas/3d`; меню → «Танах»): время, люди и места Танаха в трёх осях.
 * Модель — src/core/sno3d.ts, рисование — Sno3DScene.ts. Нажатие на год (ось, ползунок) высвечивает людей, события и места
 * этого года; на человека или событие — справку о нём.
 */
export function Sno3DPage() {
  const { t, locale } = useI18n();
  const lang: AtlasLang = locale === 'en' || locale === 'de' ? locale : 'ru';
  const [ld, setLd] = useState<Loaded | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [win, setWin] = useState(10);
  const [sel, setSel] = useState<Pick>({ kind: 'none' });
  const [scale, setScale] = useState<'eras' | 'linear'>('eras');
  const [tip, setTip] = useState<{ s: string; x: number; y: number } | null>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<Scene | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = `${t('sno.title')} · ${t('app.title')}`;
  }, [t]);

  useEffect(() => {
    let live = true;
    Promise.all([import('../tanakh/atlas/sno3d.json').then((m) => m.default as unknown as SnoData), loadTimeline(), loadAtlasKeys(), loadAtlasAll(), loadAtlasTexts(lang)]).then(([data, tl, keys, all, tx]) => {
      if (!live || !all) return;
      setLd({ data, model: buildSnoModel(data, tl, keys, all.e), tx });
    });
    return () => {
      live = false;
    };
  }, [lang]);

  const pick = (p: Pick) => {
    if (p.kind === 'year') {
      setYear(Math.max(0, Math.min(ld?.model.y1 ?? 3450, p.year)));
      return;
    }
    setSel(p);
    if (p.kind === 'person' && p.year !== undefined) setYear(p.year);
    if (p.kind === 'event') {
      const e = ld?.model.events.find((x) => x.key === p.key);
      if (e) setYear(e.y);
    }
    if (p.kind !== 'none' && matchMedia('(max-width: 900px)').matches) panel.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
  const pickRef = useRef(pick);
  pickRef.current = pick;

  useEffect(() => {
    if (!canvas.current || !ld) return;
    const s = new Scene(
      canvas.current,
      (p) => pickRef.current(p),
      (label, x, y) => setTip(label ? { s: label, x, y } : null),
    );
    scene.current = s;
    return () => {
      s.destroy();
      scene.current = null;
    };
  }, [ld]);

  const act = useMemo(() => (ld && year !== null ? activeAt(ld.model, year, win) : null), [ld, year, win]);

  useEffect(() => {
    if (!ld || !scene.current) return;
    const eraName = (i: number) => (i === 0 ? t('sno.era0') : i === 1 ? t('sno.era1') : (ld.model.eras[i - 2]?.t[lang] ?? ''));
    scene.current.set({
      model: ld.model,
      scale,
      year,
      win,
      sel,
      active: new Set(act?.persons.map((p) => p.key) ?? []),
      activeEvents: new Set(act?.events.map((e) => e.key) ?? []),
      activePlaces: new Set(act?.places.map((p) => p.id) ?? []),
      name: (p) => personName(p, ld.tx, lang),
      place: (id) => placeName(id, ld.data, ld.tx, lang),
      eraName,
      axis: { shana: t('sno.axisShana'), nefesh: t('sno.axisNefesh'), olam: t('sno.axisOlam'), south: t('sno.south'), north: t('sno.north'), groups: t('sno.groups') },
    });
  }, [ld, scale, year, win, sel, act, lang, t]);

  const name = (p: SnoPerson) => (ld ? personName(p, ld.tx, lang) : '');
  const place = (id: string | null) => (id && ld ? placeName(id, ld.data, ld.tx, lang) : '');
  const selPerson = sel.kind === 'person' ? ld?.model.persons.find((p) => p.key === sel.key) : undefined;
  const selEvent = sel.kind === 'event' ? ld?.model.events.find((e) => e.key === sel.key) : undefined;
  const eraOf = (y: number) => {
    if (!ld) return '';
    if (y < 1948) return t('sno.era0');
    if (y < 2448) return t('sno.era1');
    return ld.model.eras.find((e) => y >= e.from && y < e.to)?.t[lang] ?? ld.model.eras.at(-1)!.t[lang];
  };
  const step = (d: number) => setYear((y) => Math.max(0, Math.min(ld?.model.y1 ?? 3450, (y ?? 2488) + d)));

  const personBtn = (p: SnoPerson, extra?: string) => (
    <li key={p.key}>
      <button type="button" className={`sno-p sno-k-${p.kind}`} onClick={() => pick({ kind: 'person', key: p.key })}>
        <b>{name(p)}</b>{' '}
        <span className="he" lang="he">
          {p.he}
        </span>
        {extra ? <small> · {extra}</small> : null}
      </button>
    </li>
  );
  const eventBtn = (e: SnoEvent) => (
    <li key={e.key}>
      <button type="button" className={`sno-e ${e.kind}`} onClick={() => pick({ kind: 'event', key: e.key })}>
        <small>{e.y2 ? t('atlas.years', { a: e.y, b: e.y2 }) : e.y}</small> {e.t[lang]}
      </button>
    </li>
  );
  const kindLabel = (p: SnoPerson) => t(`sno.kind.${p.kind}` as MessageKey);

  return (
    <>
      <TopBar title={t('sno.title')} />
      <div className="wrap at sno">
        <nav className="at-tabs" aria-label={t('atlas.menu')}>
          <a href="#/atlas">{t('atlas.tabIndex')}</a>
          <a href="#/atlas/timeline">{t('atlas.timeline')}</a>
          <a href="#/atlas/3d" className="on" aria-current="page">
            {t('sno.tab')}
          </a>
        </nav>
        <header className="at-head">
          <h1>
            {t('sno.title')}{' '}
            <span className="he" lang="he">
              שָׁנָה · נֶפֶשׁ · עוֹלָם
            </span>
          </h1>
          <p className="ws-lead">{t('sno.lead')}</p>
        </header>
        {!ld ? (
          <p className="tk-note">{t('tanakh.loading')}</p>
        ) : (
          <div className="sno-grid">
            <div className="sno-stage">
              <div className="sno-tools" role="toolbar" aria-label={t('sno.views')}>
                {(['3d', 'to', 'tn', 'no'] as const).map((v) => (
                  <button key={v} type="button" onClick={() => scene.current?.goto(v)}>
                    {t(`sno.view.${v}` as MessageKey)}
                  </button>
                ))}
                <span className="sno-sep" />
                <button type="button" aria-label={t('sno.zoomIn')} onClick={() => scene.current?.zoom(1 / 1.25)}>
                  +
                </button>
                <button type="button" aria-label={t('sno.zoomOut')} onClick={() => scene.current?.zoom(1.25)}>
                  −
                </button>
                <span className="sno-sep" />
                <label className="sno-scale">
                  {t('sno.scale')}{' '}
                  <select value={scale} onChange={(e) => setScale(e.target.value as 'eras' | 'linear')}>
                    <option value="eras">{t('sno.scaleEras')}</option>
                    <option value="linear">{t('sno.scaleLinear')}</option>
                  </select>
                </label>
              </div>
              <div className="sno-canvas">
                <canvas ref={canvas} tabIndex={0} aria-label={t('sno.canvas')} />
                {tip ? (
                  <span className="sno-tip" style={{ left: tip.x + 12, top: tip.y + 12 }}>
                    {tip.s}
                  </span>
                ) : null}
              </div>
              <p className="sno-help">{t('sno.help')}</p>
              <div className="sno-year">
                <button type="button" onClick={() => step(-10)} aria-label={t('sno.back10')}>
                  ‹‹
                </button>
                <button type="button" onClick={() => step(-1)} aria-label={t('sno.back1')}>
                  ‹
                </button>
                <label>
                  <span className="sr-only">{t('sno.year')}</span>
                  <input type="range" min={0} max={ld.model.y1} value={year ?? 2488} onChange={(e) => setYear(+e.target.value)} />
                </label>
                <button type="button" onClick={() => step(1)} aria-label={t('sno.fwd1')}>
                  ›
                </button>
                <button type="button" onClick={() => step(10)} aria-label={t('sno.fwd10')}>
                  ››
                </button>
                <label className="sno-num">
                  {t('sno.year')}{' '}
                  <input type="number" min={0} max={ld.model.y1} value={year ?? ''} placeholder="—" onChange={(e) => setYear(e.target.value === '' ? null : Math.max(0, Math.min(ld.model.y1, +e.target.value)))} />
                </label>
                <label className="sno-num">
                  ±{' '}
                  <select value={win} onChange={(e) => setWin(+e.target.value)}>
                    {[0, 5, 10, 25, 50].map((n) => (
                      <option key={n} value={n}>
                        {t('sno.win', { n })}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <ul className="sno-legend">
                <li className="l-life">{t('sno.kind.life')}</li>
                <li className="l-judah">{t('sno.legendJudah')}</li>
                <li className="l-israel">{t('sno.kind.king-israel')}</li>
                <li className="l-prophet">{t('sno.kind.prophet')}</li>
                <li className="l-event">{t('sno.legendEvent')}</li>
                <li className="l-key">{t('sno.legendKey')}</li>
                <li className="l-dash">{t('sno.legendDash')}</li>
              </ul>
            </div>

            <aside className="sno-panel" ref={panel} aria-live="polite">
              {selPerson ? (
                <section className="sno-card">
                  <button type="button" className="sno-x" aria-label={t('sno.close')} onClick={() => setSel({ kind: 'none' })}>
                    ×
                  </button>
                  <p className={`sno-kind sno-k-${selPerson.kind}`}>{kindLabel(selPerson)}</p>
                  <h2>
                    {name(selPerson)}{' '}
                    <span className="he" lang="he">
                      {selPerson.he}
                    </span>
                  </h2>
                  <p>
                    {selPerson.kind === 'life'
                      ? t('sno.lived', { a: selPerson.from, b: selPerson.to }) + (ld.data.lives.find((l) => l.id === selPerson.key)?.to ? '' : ` ${t('sno.toUnknown')}`)
                      : selPerson.reign
                        ? t('sno.reigned', { a: selPerson.reign[0], r: selPerson.note?.[lang] ?? '' })
                        : selPerson.prophetFrom !== undefined
                          ? t('sno.prophesied', { y: selPerson.prophetFrom })
                          : t('sno.mentioned', { y: selPerson.from })}
                    <small> ({t('atlas.bce', { n: bce(selPerson.from) })})</small>
                  </p>
                  {selPerson.kind === 'life' && selPerson.reign ? <p>{t('sno.reignLife', { a: selPerson.reign[0], b: Math.round(selPerson.reign[1]) })}</p> : null}
                  {selPerson.kind === 'life' && selPerson.prophetFrom !== undefined ? <p>{t('sno.prophesied', { y: selPerson.prophetFrom })}</p> : null}
                  {selPerson.kind === 'prophet' && selPerson.note ? <p>{selPerson.note[lang]}</p> : null}
                  {selPerson.stays.some((s) => s.place) ? (
                    <>
                      <h3>{t('sno.path')}</h3>
                      <ol className="sno-path">
                        {selPerson.stays
                          .filter((s, i, a) => s.place && s.known && !(i && a[i - 1].place === s.place && a[i - 1].known))
                          .map((s, i) => (
                            <li key={i}>
                              <button type="button" onClick={() => setYear(s.a)}>
                                {s.a}
                              </button>{' '}
                              {place(s.place)}
                              {ld.data.places[s.place!]?.sure === 0 ? <small> · {t('atlas.sure.0')}</small> : null}
                            </li>
                          ))}
                      </ol>
                    </>
                  ) : null}
                  {selPerson.approx ? <p className="sno-note">{t('sno.approx')}</p> : null}
                  {selPerson.src ? <p className="sno-note">{selPerson.src[lang]}</p> : null}
                  <p className="sno-links">
                    {selPerson.ref && refLink(selPerson.ref, lang) ? <a href={refLink(selPerson.ref, lang)!.href}>{refLink(selPerson.ref, lang)!.label}</a> : null}
                    {selPerson.atlas && ld.tx[selPerson.atlas]?.d ? <a href={`#/atlas/${selPerson.atlas}`}>{t('sno.entry')} →</a> : null}
                  </p>
                  {(() => {
                    const evs = ld.model.events.filter((e) => e.who.includes(selPerson.atlas ?? '#'));
                    return evs.length ? (
                      <>
                        <h3>{t('sno.events')}</h3>
                        <ul className="sno-list">{evs.map(eventBtn)}</ul>
                      </>
                    ) : null;
                  })()}
                </section>
              ) : selEvent ? (
                <section className="sno-card">
                  <button type="button" className="sno-x" aria-label={t('sno.close')} onClick={() => setSel({ kind: 'none' })}>
                    ×
                  </button>
                  <p className="sno-kind">{selEvent.kind === 'key' ? t('sno.legendKey') : t('sno.legendEvent')}</p>
                  <h2>{selEvent.t[lang]}</h2>
                  <p>
                    <b>{selEvent.y2 ? t('atlas.years', { a: selEvent.y, b: selEvent.y2 }) : selEvent.y}</b> <small>({t('atlas.bce', { n: bce(selEvent.y) })})</small> · {eraOf(selEvent.y)}
                  </p>
                  <p>{selEvent.d[lang]}</p>
                  {selEvent.who.length ? (
                    <p className="sno-chips">
                      <span>{t('sno.who')}</span>
                      {selEvent.who.map((w) => {
                        const p = ld.model.persons.find((x) => x.atlas === w);
                        return p ? (
                          <button key={w} type="button" onClick={() => pick({ kind: 'person', key: p.key })}>
                            {name(p)}
                          </button>
                        ) : (
                          <a key={w} href={`#/atlas/${w}`}>
                            {ld.tx[w]?.n ?? w}
                          </a>
                        );
                      })}
                    </p>
                  ) : null}
                  {selEvent.where.length ? (
                    <p className="sno-chips">
                      <span>{t('sno.where')}</span>
                      {selEvent.where.map((w) => (
                        <a key={w} href={`#/atlas/${w}`}>
                          {place(w)}
                        </a>
                      ))}
                    </p>
                  ) : null}
                  <p className="sno-links">
                    {selEvent.ref && refLink(selEvent.ref, lang) ? <a href={refLink(selEvent.ref, lang)!.href}>{refLink(selEvent.ref, lang)!.label}</a> : selEvent.src ? <span>{selEvent.src[lang]}</span> : null}
                  </p>
                </section>
              ) : null}

              {year !== null && act ? (
                <section className="sno-card sno-yearcard">
                  <h2>
                    {t('sno.yearH', { y: year })} <small>{t('atlas.bce', { n: bce(year) })}</small>
                  </h2>
                  <p className="sno-era">{eraOf(year)}</p>
                  {!act.persons.length && !act.events.length ? <p>{t('sno.none')}</p> : null}
                  {act.persons.length ? (
                    <>
                      <h3>{t('sno.alive')}</h3>
                      <ul className="sno-list">
                        {act.persons.map((p) => {
                          const s = p.span ? stayAt(p, year) : p.stays[0];
                          return personBtn(p, [p.kind.startsWith('king') ? t('sno.short.king') : p.kind === 'prophet' ? t('sno.short.prophet') : '', s?.place && s.known ? place(s.place) : ''].filter(Boolean).join(' · '));
                        })}
                      </ul>
                    </>
                  ) : null}
                  {act.events.length ? (
                    <>
                      <h3>{t('sno.eventsNear', { n: win })}</h3>
                      <ul className="sno-list">{act.events.map(eventBtn)}</ul>
                    </>
                  ) : null}
                  {act.places.length ? (
                    <>
                      <h3>{t('sno.places')}</h3>
                      <p className="sno-chips">
                        {[...act.places].reverse().map((p) => (
                          <a key={p.id} href={ld.tx[p.id]?.d ? `#/atlas/${p.id}` : undefined}>
                            {place(p.id)}
                          </a>
                        ))}
                      </p>
                    </>
                  ) : null}
                </section>
              ) : !selPerson && !selEvent ? (
                <section className="sno-card">
                  <h2>{t('sno.startH')}</h2>
                  <p>{t('sno.start')}</p>
                  <p className="sno-chips">
                    {[1656, 2023, 2238, 2448, 2488, 2928, 3338].map((y) => (
                      <button key={y} type="button" onClick={() => setYear(y)}>
                        {y}
                      </button>
                    ))}
                  </p>
                </section>
              ) : null}
            </aside>
          </div>
        )}
        <p className="sno-source">{t('sno.source')}</p>
      </div>
      <Colophon />
    </>
  );
}
