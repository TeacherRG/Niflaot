import { useI18n } from '../i18n';
import { useState } from 'react';
import { HOUR_SIGNS, hourNames, nameOfHour, signNames, tr, verseCode } from '../core/kabbalahHours';
import { routeLink, SITE_HOST } from '../core/site';
import { Icon } from './ui';
import './KabbalahMiniDial.css';

function point(angle: number, radius: number) {
  const a = ((angle - 90) * Math.PI) / 180;
  return [60 + radius * Math.cos(a), 60 + radius * Math.sin(a)] as const;
}
/** hour N takes the same twelfth as on the big face: hour 1 from the top clockwise, hour 12 ends at the top */
const centre = (i: number) => i * 30 + 15;
function sector(i: number) {
  const [x1, y1] = point(centre(i) - 15, 56);
  const [x2, y2] = point(centre(i) + 15, 56);
  return `M 60 60 L ${x1} ${y1} A 56 56 0 0 1 ${x2} ${y2} Z`;
}

/**
 * The small «kabbalistic» dial at the upper corner of the big face on «Часы»: the twelve hours and their months, tribes and
 * signs by the Arizal (`src/core/kabbalahHours.ts`, the same combinations as on the big face). The hour of now is lit;
 * pressing it opens the window of the hour (`KabbalahWindow`).
 */
export function KabbalahMiniDial({ hour, day, onOpen }: { hour: number; day: boolean; onOpen: () => void }) {
  const { t, ui } = useI18n();
  const active = Math.min(12, Math.max(1, hour)) - 1;
  const now = hourNames(hour, ui);
  const label = (i: number) => {
    const n = hourNames(i + 1, ui);
    return `${t(day ? 'clock.hourDay' : 'clock.hourNight', { n: i + 1 })} · ${n.month} · ${n.tribe} · ${nameOfHour(i, day)}`;
  };
  return (
    <button type="button" className="clk-kmini" onClick={onOpen} aria-label={`${t('clock.km.title')}: ${label(active)}`} title={t('clock.km.title')}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="clk-kmini-aura" cx="60" cy="60" r="58" />
        {HOUR_SIGNS.map((h, i) => {
          const [x, y] = point(centre(i), 43);
          return (
            <g key={h.month} className={i === active ? 'active' : ''}>
              <path className="clk-kmini-sector" d={sector(i)} />
              <text className="clk-kmini-month" x={x} y={y} textAnchor="middle" dominantBaseline="central">
                {h.sign}
              </text>
              <title>{label(i)}</title>
            </g>
          );
        })}
        <circle className="clk-kmini-core" cx="60" cy="60" r="23" />
        <text className="clk-kmini-number" x="60" y="56" textAnchor="middle" dominantBaseline="central">
          {active + 1}
        </text>
        <text className="clk-kmini-caption" x="60" y="69" textAnchor="middle">
          {t(day ? 'clock.km.day' : 'clock.km.night')}
        </text>
      </svg>
      <span className="clk-kmini-current">
        <b>{now.month}</b>
        <span>{now.tribe}</span>
      </span>
    </button>
  );
}

/**
 * The window of the small dial (owner, 27.11.2026: «там около 9–10 соответствий; днём дневное Имя и ночью ночное; отправить красивое
 * карточкой»): the hour of now — or any hour, ‹ › — by day or by night, four cards as in the owner's table (the Name of the hour; the
 * boundary and the sefirot; tribe, month, sign, sense, organ, stone; the verse-code), «Поделиться карточкой» and the table of all hours.
 */
export function KabbalahWindow({ hour, day: nowDay }: { hour: number; day: boolean }) {
  const { t, ui } = useI18n();
  const live = Math.min(12, Math.max(1, hour)) - 1;
  const [pick, setPick] = useState<{ i: number; day: boolean } | null>(null);
  const [saved, setSaved] = useState(false);
  const i = pick?.i ?? live;
  const day = pick?.day ?? nowDay;
  const h = HOUR_SIGNS[i];
  const names = hourNames(i + 1, ui);
  const sign = signNames(i + 1, ui);
  const he = ui === 'he';
  const hourTitle = `${t(day ? 'clock.hourDay' : 'clock.hourNight', { n: i + 1 })} · ${names.month}`;
  const alt = `${t(day ? 'clock.km.nightName' : 'clock.km.dayName')}: ${day ? h.night : h.tziruf}`;
  const rows: [string, string, string?][] = [
    [t('clock.km.tribe'), names.tribe, he ? undefined : h.tribeHe],
    [t('clock.km.sign'), `${h.sign} ${sign.name}`, he ? undefined : sign.he],
    [t('clock.km.letter'), h.letter],
    [t('clock.km.sense'), he ? h.senseHe : tr(h.sense, ui), he ? undefined : h.senseHe],
    [t('clock.km.organ'), tr(h.organ, ui)],
    [t('clock.km.stone'), tr(h.stone, ui), he ? undefined : h.stoneHe],
    [t('clock.km.gvul'), tr(h.gvul, ui), he ? undefined : h.gvulHe],
    [t('clock.km.sefirot'), tr(h.sefirot, ui)],
  ];
  const go = (d: number) => setPick({ i: (i + d + 12) % 12, day });
  const share = async () => {
    const { renderHourCard, shareOrSave } = await import('../core/shareCard');
    const link = routeLink('clock', 'card', ui);
    const verseNote = t(h.code === 'rt' ? 'clock.km.rt' : 'clock.km.st');
    const blob = await renderHourCard({
      eyebrow: t('clock.km.eyebrow'),
      title: hourTitle,
      name: nameOfHour(i, day),
      alt,
      sign: h.sign,
      rows: rows.map(([l, v, x]) => [l, l === t('clock.km.sign') ? sign.name : v, x]),
      verse: verseCode(h),
      verseNote: `${verseNote} · ${tr(h.verseSrc, ui)}`,
      verseT: tr(h.verseT, ui),
      cta: t('clock.km.cta'),
      link,
      site: SITE_HOST,
    });
    const text = `${hourTitle} · ${nameOfHour(i, day)}\n${rows.map(([l, v]) => `${l}: ${v}`).join(' · ')}\n${t('clock.km.cta')} 👉 ${link}`;
    const r = await shareOrSave(blob, `niflaot-hour-${i + 1}${day ? '' : '-night'}.png`, text);
    if (r === 'saved') {
      await navigator.clipboard?.writeText(text).catch(() => undefined);
      setSaved(true);
    }
  };
  return (
    <div className="kmw">
      <div className="kmw-bar">
        <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label={t('clock.km.prev')}>
          ‹
        </button>
        <div className="kmw-pick">
          <button type="button" className={day ? 'on' : ''} onClick={() => setPick({ i, day: true })} aria-pressed={day}>
            ☀ {t('clock.km.day')}
          </button>
          <button type="button" className={!day ? 'on' : ''} onClick={() => setPick({ i, day: false })} aria-pressed={!day}>
            ☾ {t('clock.km.night')}
          </button>
        </div>
        <button type="button" className="icon-btn" onClick={() => go(1)} aria-label={t('clock.km.next')}>
          ›
        </button>
      </div>
      {pick && (pick.i !== live || pick.day !== nowDay) && (
        <button type="button" className="kmw-live" onClick={() => setPick(null)}>
          ⟲ {t('clock.km.now')}
        </button>
      )}

      <section className={`kmw-card kmw-name ${day ? 'day' : 'night'}`}>
        <p className="kmw-k">{t('clock.km.name')}</p>
        <p className="kmw-title">
          <span className="kmw-sign" aria-hidden="true">
            {h.sign}
          </span>{' '}
          {hourTitle}
        </p>
        <p className="kmw-big he" lang="he" dir="rtl">
          {nameOfHour(i, day)}
        </p>
        <p className="kmw-alt">
          {t(day ? 'clock.km.nightName' : 'clock.km.dayName')}: <span className="he">{day ? h.night : h.tziruf}</span>
        </p>
        <p className="kmw-season">{tr(h.season, ui)}</p>
      </section>

      <section className="kmw-card">
        <p className="kmw-k">{t('clock.km.gvulH')}</p>
        <p className="kmw-he he" lang="he" dir="rtl">
          {h.gvulHe}
        </p>
        <dl className="kmw-dl">
          <dt>{t('clock.km.gvul')}</dt>
          <dd>{tr(h.gvul, ui)}</dd>
          <dt>{t('clock.km.sefirot')}</dt>
          <dd>{tr(h.sefirot, ui)}</dd>
          <dt>{t('clock.km.path')}</dt>
          <dd>{tr(h.path, ui)}</dd>
        </dl>
      </section>

      <section className="kmw-card">
        <p className="kmw-k">{t('clock.km.tribeH')}</p>
        <dl className="kmw-grid">
          {rows
            .filter(([l]) => l !== t('clock.km.gvul') && l !== t('clock.km.sefirot'))
            .map(([l, v, x]) => (
              <div key={l}>
                <dt>{l}</dt>
                <dd>
                  {l === t('clock.km.stone') && <i className="kmw-swatch" style={{ background: h.stoneColor }} aria-hidden="true" />}
                  {l === t('clock.km.letter') ? <span className="he kmw-letter">{v}</span> : v}
                  {x && (
                    <>
                      {' '}
                      <span className="he">{x}</span>
                    </>
                  )}
                </dd>
              </div>
            ))}
          <div>
            <dt>{t('clock.km.month')}</dt>
            <dd>
              {names.month}
              {!he && (
                <>
                  {' '}
                  <span className="he">{h.monthHe}</span>
                </>
              )}
            </dd>
          </div>
        </dl>
      </section>

      <section className="kmw-card">
        <p className="kmw-k">{t('clock.km.verseH')}</p>
        <p className="kmw-verse he" lang="he" dir="rtl">
          {verseCode(h).map(([b, l, e], k) => (
            <span key={k}>
              {k > 0 && ' '}
              {b}
              {l && <b>{l}</b>}
              {e}
            </span>
          ))}
        </p>
        <p className="kmw-vt">{tr(h.verseT, ui)}</p>
        <p className="kmw-src">
          {t(h.code === 'rt' ? 'clock.km.rt' : 'clock.km.st')} · {tr(h.verseSrc, ui)}
        </p>
      </section>

      <button type="button" className="btn kmw-share" onClick={share}>
        <Icon name="share" size={18} /> {t('clock.km.share')}
      </button>
      {saved && <p className="clk-note">{t('clock.km.saved')}</p>}

      <div className="kmt-scroll">
        <table className="kmt-table">
          <thead>
            <tr>
              <th>{t('clock.km.hour')}</th>
              <th>{t('clock.km.month')}</th>
              <th>{t('clock.km.tribe')}</th>
              <th>{t('clock.km.sign')}</th>
              <th>☀</th>
              <th>☾</th>
            </tr>
          </thead>
          <tbody>
            {HOUR_SIGNS.map((x, k) => {
              const n = hourNames(k + 1, ui);
              return (
                <tr key={x.month} className={k === i ? 'on' : ''} aria-current={k === live ? 'true' : undefined} onClick={() => setPick({ i: k, day })}>
                  <td>{k + 1}</td>
                  <td>
                    {n.month}
                    {!he && <span className="he">{x.monthHe}</span>}
                  </td>
                  <td>
                    {n.tribe}
                    {!he && <span className="he">{x.tribeHe}</span>}
                  </td>
                  <td>
                    <span aria-hidden="true">{x.sign}</span> {signNames(k + 1, ui).name}
                  </td>
                  <td className={`he${day ? ' cur' : ''}`}>{x.tziruf}</td>
                  <td className={`he${!day ? ' cur' : ''}`}>{x.night}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="clk-note">{t('clock.km.source')}</p>
    </div>
  );
}
