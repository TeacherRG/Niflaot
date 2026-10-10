import { useEffect, useMemo, useRef, useState } from 'react';
import { Html, useI18n } from '../i18n';
import { LESSONS } from '../lessons';
import { VALUES, letters } from '../core/gematria';
import { gematriaSteps } from '../core/gematriaSteps';
import { formatTime, copyText } from '../core/format';
import { pageLink, type Ref } from '../core/site';
import { MAX_TRIES, dailyNumber, dailyPool, dailyWord, grid, loadResults, saveResult, streak, type DailyResult } from '../core/daily';
import { TopBar } from './TopBar';
import { Colophon } from './Colophon';
import { GematriaSolution } from './GematriaSolution';

/** time until the next local midnight */
function useUntilMidnight() {
  const left = () => {
    const d = new Date();
    d.setHours(24, 0, 0, 0);
    return d.getTime() - Date.now();
  };
  const [ms, setMs] = useState(left);
  useEffect(() => {
    const id = setInterval(() => setMs(left()), 30_000);
    return () => clearInterval(id);
  }, []);
  return ms;
}

/** «Гиматрия дня»: one word a day, its letters added in the head, the result shared without the answer. */
export function DailyPage() {
  const { t, pick, locale } = useI18n();
  const pool = useMemo(() => dailyPool(LESSONS), []);
  const [n] = useState(() => dailyNumber());
  const w = dailyWord(pool, n);
  const text = pick(w.lesson.texts).value;
  const [r, setR] = useState<DailyResult>(() => loadResults()[n] ?? { wrong: [] });
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const untilNext = useUntilMidnight();
  const done = !!r.done;
  const tiles = letters(w.he);

  useEffect(() => {
    document.title = `${t('daily.title')} ${t('daily.no', { n })} · ${t('app.title')}`;
  }, [n, t]);

  // a new day while the page is open: start the new word
  useEffect(() => {
    if (untilNext > 60_000) return;
    const id = setTimeout(() => location.reload(), untilNext + 2000);
    return () => clearTimeout(id);
  }, [untilNext]);

  const update = (next: DailyResult) => {
    setR(next);
    saveResult(n, next);
  };

  const check = () => {
    const v = parseInt(value.replace(/\D/g, ''), 10);
    if (isNaN(v) || done) return input.current?.focus();
    const start = r.start ?? Date.now();
    if (v === w.v) return update({ ...r, start, end: Date.now(), done: 'win' });
    const wrong = [...r.wrong, v];
    update({ ...r, start, wrong, ...(wrong.length >= MAX_TRIES ? { end: Date.now(), done: 'lose' as const } : {}) });
    setValue('');
    input.current?.focus();
  };

  const all = loadResults();
  all[n] = r;
  const series = streak(all, n);
  const solved = Object.values(all).filter((x) => x.done === 'win').length;
  const time = r.start && r.end ? formatTime(r.end - r.start) : '—';
  const share = (ref: Ref) =>
    t('daily.shareText', {
      n,
      grid: grid(r) || '🟥'.repeat(MAX_TRIES),
      time,
      streak: series > 1 ? ` · 🔥 ${series}` : '',
      link: pageLink('daily', locale, ref),
    });

  const shareNative = async () => {
    const txt = share('daily');
    try {
      if (navigator.share) return await navigator.share({ text: txt });
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
    }
    if (await copyText(share('copy'))) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const where =
    w.ri !== undefined
      ? { href: `#/${w.lesson.slug}/read/${w.ri + 1}`, label: t('daily.whereRiddle', { n: w.ri + 1 }) }
      : w.mi !== undefined
        ? { href: `#/${w.lesson.slug}/memo/${w.mi + 1}`, label: t('daily.whereMemo', { n: w.mi + 1 }) }
        : { href: `#/${w.lesson.slug}`, label: text.title };

  return (
    <>
      <TopBar title={t('daily.title')} />
      <div className="wrap daily">
        <section className="m-card daily-card">
          <div className="eyebrow">
            {t('daily.title')} · {t('daily.no', { n })}
          </div>
          <div className="daily-word he" lang="he">
            {w.he}
          </div>
          <div className="daily-gloss">{text.glossary[w.he]}</div>
          <div className="daily-tiles" dir="rtl">
            {tiles.map((c, i) => (
              <span key={i}>
                <b>{c}</b>
                <i>{r.hint || done ? VALUES[c] : '?'}</i>
              </span>
            ))}
          </div>

          {!done ? (
            <>
              <p className="daily-task">{t('daily.task')}</p>
              <div className="row daily-row">
                <input
                  ref={input}
                  className="inp"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-label={t('daily.answer')}
                  placeholder="?"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value.replace(/\D/g, ''));
                    // the clock starts with the first keystroke, not with opening the page
                    if (!r.start) update({ ...r, start: Date.now() });
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && check()}
                />
                <button className="btn" onClick={check} disabled={!value}>
                  {t('math.check')}
                </button>
                {!r.hint && (
                  <button className="btn ghost" onClick={() => update({ ...r, hint: true })}>
                    {t('daily.hint')}
                  </button>
                )}
              </div>
              {!r.hint && <p className="daily-note">{t('daily.hintNote')}</p>}
              {r.wrong.length > 0 && (
                <div className="fb no" role="status">
                  {t('daily.wrong', { n: MAX_TRIES - r.wrong.length })}{' '}
                  <span className="daily-grid">{grid(r)}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className={`fb ${r.done === 'win' ? 'ok' : 'no'}`} role="status">
                {r.done === 'win' ? `${t('daily.win')} ${w.v}` : t('daily.lose', { v: w.v })}
              </div>
              <div className="daily-result">
                <span className="daily-grid">{grid(r) || '🟥'.repeat(MAX_TRIES)}</span>
                <span>⏱ {time}</span>
                {series > 0 && <span>🔥 {t('daily.streak', { n: series })}</span>}
                <span>{t('daily.solved', { n: solved })}</span>
              </div>
              <div className="share-btns daily-share">
                <button className="btn gold" onClick={shareNative}>
                  {copied ? t('final.copied') : `📤 ${t('daily.share')}`}
                </button>
                <a className="btn ghost" href={`https://wa.me/?text=${encodeURIComponent(share('wa'))}`} target="_blank" rel="noopener">
                  WhatsApp
                </a>
                <a
                  className="btn ghost"
                  href={`https://t.me/share/url?url=${encodeURIComponent(pageLink('daily', locale, 'tg'))}&text=${encodeURIComponent(share('tg'))}`}
                  target="_blank"
                  rel="noopener"
                >
                  Telegram
                </a>
              </div>
              <h3 className="m-h3">{t('daily.how')}</h3>
              <GematriaSolution g={gematriaSteps(w.he)} />
              <p className="daily-links">
                {t('daily.from', { title: text.title })}: <a href={where.href}>{where.label} →</a>
              </p>
              <p className="daily-next">
                ⏳{' '}
                {t('daily.next', {
                  time: `${Math.floor(untilNext / 36e5)} ${t('countdown.h')} ${Math.floor((untilNext % 36e5) / 6e4)} ${t('countdown.m')}`,
                })}
              </p>
            </>
          )}
        </section>

        <section className="m-card">
          <h3 className="m-h3">{t('daily.title')}</h3>
          <Html as="div" className="prose" html={t('daily.rules')} />
          <p>
            <a href="#/math/add">🧮 {t('daily.train')} →</a>
          </p>
        </section>
      </div>
      <Colophon />
    </>
  );
}
