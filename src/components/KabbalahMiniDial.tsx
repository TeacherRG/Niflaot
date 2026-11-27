import { useI18n } from '../i18n';
import { HOUR_SIGNS, hourNames, NIGHT_NAME, signNames } from '../core/kabbalahHours';
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
 * pressing it opens «Как считаем» with the explanation.
 */
export function KabbalahMiniDial({ hour, day, onOpen }: { hour: number; day: boolean; onOpen: () => void }) {
  const { t, ui } = useI18n();
  const active = Math.min(12, Math.max(1, hour)) - 1;
  const now = hourNames(hour, ui);
  const label = (i: number) => {
    const n = hourNames(i + 1, ui);
    return `${t(day ? 'clock.hourDay' : 'clock.hourNight', { n: i + 1 })} · ${n.month} · ${n.tribe} · ${HOUR_SIGNS[i].tziruf}`;
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
 * What pressing the small dial opens (owner, 27.11.2026: «при нажатии — вся информация, которая была в коде»): the hour of now,
 * and the whole table of the twelve hours — month, tribe, sign, combination of the Name; the hour of now is lit.
 */
export function KabbalahTable({ hour, day }: { hour: number; day: boolean }) {
  const { t, ui } = useI18n();
  const active = Math.min(12, Math.max(1, hour)) - 1;
  const now = hourNames(active + 1, ui);
  const sign = signNames(active + 1, ui);
  return (
    <div className="kmt">
      <div className="kmt-now">
        <span className="kmt-sign" aria-hidden="true">{HOUR_SIGNS[active].sign}</span>
        <div>
          <b>{t(day ? 'clock.hourDay' : 'clock.hourNight', { n: active + 1 })}</b>
          <p>
            {t('clock.km.month')}: {now.month}
            {ui !== 'he' && <>{' '}<span className="he">{HOUR_SIGNS[active].monthHe}</span></>} · {t('clock.km.tribe')}: {now.tribe}
            {ui !== 'he' && <>{' '}<span className="he">{HOUR_SIGNS[active].tribeHe}</span></>} · {t('clock.km.sign')}: {sign.name}
            {ui !== 'he' && <>{' '}<span className="he">{sign.he}</span></>}
          </p>
          <p className="kmt-name">
            <span className="he">{HOUR_SIGNS[active].tziruf}</span>
          </p>
          {!day && (
            <p className="kmt-night">
              {t('clock.km.nightName')} <span className="he">{NIGHT_NAME}</span>
            </p>
          )}
        </div>
      </div>
      <div className="kmt-scroll">
        <table className="kmt-table">
          <thead>
            <tr>
              <th>{t('clock.km.hour')}</th>
              <th>{t('clock.km.month')}</th>
              <th>{t('clock.km.tribe')}</th>
              <th>{t('clock.km.sign')}</th>
              <th>{t('clock.km.tziruf')}</th>
            </tr>
          </thead>
          <tbody>
            {HOUR_SIGNS.map((h, i) => {
              const n = hourNames(i + 1, ui);
              const sg = signNames(i + 1, ui);
              return (
                <tr key={h.month} className={i === active ? 'on' : ''} aria-current={i === active ? 'true' : undefined}>
                  <td>{i + 1}</td>
                  <td>
                    {n.month}
                    {ui !== 'he' && <span className="he">{h.monthHe}</span>}
                  </td>
                  <td>
                    {n.tribe}
                    {ui !== 'he' && <span className="he">{h.tribeHe}</span>}
                  </td>
                  <td>
                    <span aria-hidden="true">{h.sign}</span> {sg.name}
                  </td>
                  <td className="he">{h.tziruf}</td>
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
