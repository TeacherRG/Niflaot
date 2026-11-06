import '@fontsource/noto-serif-hebrew/400.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { NotFound, PageLoading } from './PageStates';
import { hebrewNumber } from '../core/hebrewDate';
import { markStudied } from '../core/habit';
import { useHebrewLevel } from '../core/hebrewLevel';
import { PARSHIOT } from '../lessons/parshiot';
import { loadView, saveView, stripTaamim, todayISO, tokens, type Token, type View } from '../core/reading';
import { ALIYOT, aliyahOfDay, loadShnayim, shnayimParsha, type ShnayimText } from '../core/shnayim';

/** одна строка: стих Торы (первый и второй раз) или Таргум */
type Line = 'm1' | 'm2' | 't';
const LINES: Line[] = ['m1', 'm2', 't'];
interface Tok extends Token {
  v: number;
  line: Line;
}

/** воскресенье, с которого считаются отрывки (для названий дней недели) */
const SUNDAY = '2026-11-01';
const HIGHLIGHT_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5];
const addDays = (iso: string, n: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/**
 * «Шнаим микра ве-эхад таргум»: отрывок недельной главы на день (`#/reading/shnayim[/<отрывок>]`) — каждый стих Торы дважды
 * и Таргум Онкелос, другим шрифтом. Как в Теґилим: знаки кантилляции и крупный шрифт, выбор отрывка ‹ ›, нажатие на слово —
 * подсветка с него (аудио пока нет). Данные — src/core/shnayim.ts.
 */
export function ShnayimPage({ aliyah }: { aliyah?: string }) {
  const { t, locale } = useI18n();
  const level = useHebrewLevel();
  const today = todayISO();
  const parsha = shnayimParsha(today);
  const todayAliyah = aliyahOfDay(today);
  const n = aliyah === undefined ? todayAliyah : Number(aliyah);
  const valid = Number.isInteger(n) && n >= 1 && n <= ALIYOT;
  const [data, setData] = useState<ShnayimText | null>(null);
  const [failed, setFailed] = useState(false);
  const [view, setView] = useState<View>(loadView);
  const [active, setActive] = useState(-1);
  const [highlightState, setHighlightState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const [highlightRate, setHighlightRate] = useState(1);
  const remainingMs = useRef<number | null>(null);
  const deadline = useRef(0);

  useEffect(() => {
    let live = true;
    loadShnayim(parsha)
      .then((d) => live && setData(d))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [parsha]);
  useEffect(() => {
    setActive(-1);
    setHighlightState('stopped');
    remainingMs.current = null;
  }, [n]);

  const portion = valid ? data?.aliyot[n - 1] : undefined;
  const toks = useMemo<Tok[]>(
    () =>
      (portion?.v ?? []).flatMap((x, v) =>
        LINES.flatMap((line) => tokens(line === 't' ? x.t : x.m).map((tok) => ({ ...tok, v, line }))),
      ),
    [portion],
  );
  const wordIndices = useMemo(() => toks.flatMap((x, i) => (x.w ? [i] : [])), [toks]);

  useEffect(() => {
    if (highlightState !== 'playing' || active < 0) return;
    const token = toks[active];
    if (!token?.w) return;
    const letters = token.s.replace(/[^א-ת]/g, '').length;
    const duration = remainingMs.current ?? (220 + Math.max(1, letters) * 90) / highlightRate;
    remainingMs.current = null;
    deadline.current = Date.now() + duration;
    const timer = window.setTimeout(() => {
      const position = wordIndices.indexOf(active);
      const next = wordIndices[position + 1];
      if (next === undefined) {
        setHighlightState('stopped');
        markStudied();
        return;
      }
      setActive(next);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [active, highlightRate, highlightState, toks, wordIndices]);

  const dayName = (k: number) =>
    k === 7 ? t('shn.shabbat') : new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(new Date(`${addDays(SUNDAY, k - 1)}T12:00:00Z`));
  const range = (k: number) => {
    const a = data?.aliyot[k - 1];
    if (!a) return '';
    const [fc, fv] = a.from.split(':');
    const [tc, tv] = a.to.split(':');
    return fc === tc ? `${fc}:${fv}–${tv}` : `${a.from}–${a.to}`;
  };
  const name = PARSHIOT[parsha].name[locale];
  const book = data ? t(`shn.book.${data.book}` as `shn.book.${'genesis' | 'exodus' | 'leviticus' | 'numbers' | 'deuteronomy'}`) : '';

  useEffect(() => {
    document.title = `${t('shn.title')} · ${name} · ${n} · ${t('app.title')}`;
  }, [t, name, n]);

  // the word in the light stays in sight
  const textRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active < 0) return;
    textRef.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [active]);

  const tap = (i: number) => {
    remainingMs.current = null;
    setActive(i);
    if (toks.slice(i + 1).every((x) => !x.w)) markStudied(); // дошли до последнего слова Таргума
  };
  const playHighlight = () => {
    if (highlightState === 'playing') {
      remainingMs.current = Math.max(0, deadline.current - Date.now());
      setHighlightState('paused');
      return;
    }
    if (highlightState === 'paused') {
      setHighlightState('playing');
      return;
    }
    const position = wordIndices.indexOf(active);
    const start = position < 0 || position === wordIndices.length - 1 ? wordIndices[0] : active;
    remainingMs.current = null;
    if (start !== undefined) setActive(start);
    setHighlightState('playing');
  };
  const stopHighlight = () => {
    remainingMs.current = null;
    setHighlightState('stopped');
    setActive(-1);
  };
  const setV = (v: View) => {
    setView(v);
    saveView(v);
  };
  const go = (k: number) => {
    location.hash = `#/reading/shnayim/${k}`;
  };

  if (!valid) return <NotFound />;

  return (
    <>
      <TopBar title={t('reading.title')} />
      <div className={`wrap rd${view.big ? ' rd-big' : ''}`}>
        <header className="tk-head">
          <p className="tk-kicker">
            📖 {t('reading.title')} · <span className="he">שְׁנַיִם מִקְרָא וְאֶחָד תַּרְגּוּם</span>
          </p>
          <h1>
            {t('shn.h1')} <span className="he">{data?.he ?? PARSHIOT[parsha].he}</span>
          </h1>
          <p className="ac-lead">{t('shn.lead')}</p>
          {data && (
            <p className="ac-lead">
              {t('shn.dayHeader', { parsha: name, n, day: dayName(n), book, range: range(n) })}
              {n !== todayAliyah && (
                <>
                  {' · '}
                  <a href={`#/reading/shnayim/${todayAliyah}`}>{t('shn.toToday')}</a>
                </>
              )}
            </p>
          )}
          {level === 'none' && (
            <p className="rd-note">
              {t('reading.noLetters')} <a href="#/letters">{t('abc.title')}</a>
            </p>
          )}
        </header>

        <nav className="rd-nav" aria-label={t('shn.pick')}>
          <button type="button" className="rd-arrow" onClick={() => go(n - 1)} disabled={n <= 1} aria-label={t('shn.prev')}>
            ‹
          </button>
          <label className="rd-pick">
            <span className="sr-only">{t('shn.pick')}</span>
            <select value={n} onChange={(e) => go(Number(e.target.value))}>
              {Array.from({ length: ALIYOT }, (_, i) => i + 1).map((k) => (
                <option key={k} value={k}>
                  {t('shn.option', { n: k, day: dayName(k) })}
                  {data ? ` · ${range(k)}` : ''}
                  {k === todayAliyah ? ` · ${t('shn.today')}` : ''}
                </option>
              ))}
            </select>
          </label>
          <button type="button" className="rd-arrow" onClick={() => go(n + 1)} disabled={n >= ALIYOT} aria-label={t('shn.next')}>
            ›
          </button>
        </nav>

        <div className="rd-opts no-print">
          <label>
            <input type="checkbox" checked={view.taamim} onChange={(e) => setV({ ...view, taamim: e.target.checked })} /> {t('reading.taamim')}
          </label>
          <label>
            <input type="checkbox" checked={view.big} onChange={(e) => setV({ ...view, big: e.target.checked })} /> {t('reading.big')}
          </label>
        </div>
        <p className="rd-hint rd-tap-hint no-print">{t('shn.tap')}</p>
        <p className="rd-hint rd-tap-hint no-print">{t('shn.highlightHint')}</p>

        {failed ? (
          <p className="rd-note">{t('reading.failed')}</p>
        ) : !portion ? (
          <PageLoading />
        ) : (
          <article className="rd-text shn he" lang="he" dir="rtl" ref={textRef}>
            {portion.v.map((verse, v) => {
              const [c, vn] = verse.r.split(':').map(Number);
              const first = v === 0 || portion.v[v - 1].r.split(':')[0] !== String(c);
              return (
                <section key={verse.r} className="shn-v">
                  {first && <h2 className="rd-ch">פֶּרֶק {hebrewNumber(c)}</h2>}
                  {LINES.map((line) => (
                    <p key={line} className={`shn-l shn-${line}`}>
                      {line === 'm1' && (
                        <span className="rd-vn" aria-hidden="true">
                          {hebrewNumber(vn).replace(/[׳״]/g, '')}
                        </span>
                      )}
                      {line === 't' && (
                        <span className="shn-tag" aria-hidden="true">
                          ת״א
                        </span>
                      )}{' '}
                      {toks.map((x, i) =>
                        x.v !== v || x.line !== line ? null : (
                          <span key={i}>
                            <span
                              data-i={i}
                              className={`rd-w${i === active ? ' rd-on' : active > i ? ' rd-past' : ''}${x.w ? '' : ' rd-paseq'}`}
                              onClick={() => x.w && tap(i)}
                            >
                              {view.taamim || line === 't' ? x.s : stripTaamim(x.s)}
                            </span>{' '}
                          </span>
                        ),
                      )}
                    </p>
                  ))}
                </section>
              );
            })}
          </article>
        )}

        {portion && wordIndices.length > 0 && (
          <div className="rd-audio-float no-print" role="group" aria-label={t('shn.highlightControls')}>
            <button
              type="button"
              className="btn"
              onClick={playHighlight}
              aria-label={t(
                highlightState === 'playing'
                  ? 'shn.pauseHighlight'
                  : highlightState === 'paused'
                    ? 'shn.resumeHighlight'
                    : 'shn.startHighlight',
              )}
              title={t(
                highlightState === 'playing'
                  ? 'shn.pauseHighlight'
                  : highlightState === 'paused'
                    ? 'shn.resumeHighlight'
                    : 'shn.startHighlight',
              )}
            >
              {highlightState === 'playing' ? '⏸' : '▶'}
              <span className="rd-lbl">
                {' '}
                {t(
                  highlightState === 'playing'
                    ? 'shn.pauseHighlight'
                    : highlightState === 'paused'
                      ? 'shn.resumeHighlight'
                      : 'shn.startHighlight',
                )}
              </span>
            </button>
            <button
              type="button"
              className="btn ghost"
              onClick={stopHighlight}
              disabled={highlightState === 'stopped' && active < 0}
              aria-label={t('reading.stop')}
              title={t('reading.stop')}
            >
              ■<span className="rd-lbl"> {t('reading.stop')}</span>
            </button>
            <label className="rd-rate" title={t('reading.speed')}>
              <span className="sr-only">{t('reading.speed')}</span>
              <select value={highlightRate} onChange={(e) => setHighlightRate(Number(e.target.value))}>
                {HIGHLIGHT_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}×
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {data && (
          <p className="rd-credit">
            {t('shn.creditTorah')}{' '}
            <a href={data.torah.source} target="_blank" rel="noopener">
              {data.torah.title}
            </a>{' '}
            · {t('reading.pd')}. {t('shn.creditTargum')}{' '}
            <a href={data.targum.source} target="_blank" rel="noopener">
              {data.targum.title}
            </a>{' '}
            · {t('shn.pdTargum')}
          </p>
        )}
      </div>
      <Colophon />
    </>
  );
}
