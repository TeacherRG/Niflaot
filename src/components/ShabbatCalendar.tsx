import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';
import { hebrewDateText, sunTimes } from '../core/hebcal';
import { currentPlace, findCities, PLACE_EVENT, setPlace, timeZone, type Place } from '../core/places';

const DAY = 86_400_000;
const CANDLE_MINUTES = 18;
const HAVDALAH_MINUTES = 50;

const dateIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** This week's Shabbat: Sunday–Friday — the coming one, Saturday — today's; after it ends — the next one. */
function shabbatTimes(now: Date, place: Place, zone: string) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const untilFriday = today.getDay() === 6 ? -1 : (5 - today.getDay() + 7) % 7;
  let friday = new Date(today.getTime() + untilFriday * DAY);
  let saturday = new Date(friday.getTime() + DAY);
  let saturdaySun = sunTimes(dateIso(saturday), place.lat, place.lon, zone);
  if (saturdaySun.sunset && now.getTime() >= saturdaySun.sunset.getTime() + HAVDALAH_MINUTES * 60_000) {
    friday = new Date(friday.getTime() + 7 * DAY);
    saturday = new Date(friday.getTime() + DAY);
    saturdaySun = sunTimes(dateIso(saturday), place.lat, place.lon, zone);
  }
  const fridaySun = sunTimes(dateIso(friday), place.lat, place.lon, zone);
  return {
    saturday,
    lighting: fridaySun.sunset ? new Date(fridaySun.sunset.getTime() - CANDLE_MINUTES * 60_000) : null,
    havdalah: saturdaySun.sunset ? new Date(saturdaySun.sunset.getTime() + HAVDALAH_MINUTES * 60_000) : null,
  };
}

const plainHe = (iso: string) => hebrewDateText(iso).replace(/[\u0591-\u05C7]/g, '');

/** Home-page calendar and local Shabbat times; location is the city associated with the device time zone. */
export function ShabbatCalendar({ bare = false, shabbatOnly = false }: { bare?: boolean; shabbatOnly?: boolean }) {
  const { t, locale } = useI18n();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const [, redraw] = useState(0);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const on = () => redraw((n) => n + 1);
    window.addEventListener(PLACE_EVENT, on);
    window.addEventListener('storage', on);
    return () => {
      window.removeEventListener(PLACE_EVENT, on);
      window.removeEventListener('storage', on);
    };
  }, []);

  const { place, zone, auto } = currentPlace();
  const picker = editing && <CityPicker auto={auto} onDone={() => setEditing(false)} />;
  if (!place) {
    return (
      <section className={`shabbat-calendar${bare ? ' bare' : ''}`} aria-labelledby={bare ? undefined : 'shabbat-calendar-title'}>
        {!bare && <h2 id="shabbat-calendar-title">{t('calendar.title')}</h2>}
        <p className="shabbat-calendar-city">
          {t('calendar.locationUnavailable')}{' '}
          {!editing && (
            <button type="button" className="sc-edit" onClick={() => setEditing(true)}>
              {t('calendar.choose')}
            </button>
          )}
        </p>
        {picker}
      </section>
    );
  }

  const times = shabbatTimes(now, place, zone);
  const today = sunTimes(dateIso(now), place.lat, place.lon, zone);
  // the Jewish day begins at sunset: after it — already tomorrow's date
  const evening = !!today.sunset && now >= today.sunset;
  const hebrewToday = plainHe(dateIso(evening ? new Date(now.getTime() + DAY) : now));
  const timeFormatter = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', timeZone: zone });
  const dateFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: zone });
  const city = place.name[locale as keyof typeof place.name] ?? place.name.en;
  const time = (d: Date | null) => (d ? timeFormatter.format(d) : t('calendar.noSun'));
  const block = (kind: 'today' | 'shabbat', title: string, date: string, he: string, rows: [Parameters<typeof t>[0], Date | null][], sub?: string) => (
    <div className={`shabbat-calendar-block ${kind}`}>
      <div className="shabbat-calendar-head">
        <h3>{title}</h3>
        <div className="shabbat-calendar-date">
          <strong>{date}</strong>
          <span className="he" lang="he">{he}</span>
          {sub && <small>{sub}</small>}
        </div>
      </div>
      <dl className="shabbat-calendar-times">
        {rows.map(([key, at]) => (
          <div key={key}>
            <dt>{t(key)}</dt>
            <dd>{time(at)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <section className={`shabbat-calendar${bare ? ' bare' : ''}`} aria-labelledby={bare ? undefined : 'shabbat-calendar-title'}>
      {!bare && <h2 id="shabbat-calendar-title">{t('calendar.title')}</h2>}
      <p className="shabbat-calendar-city">
        {t('calendar.city', { city })}
        {auto && <small> · {t('calendar.auto')}</small>}{' '}
        {!editing && (
          <button type="button" className="sc-edit" onClick={() => setEditing(true)} aria-label={`${t('calendar.change')}: ${city}`}>
            {t('calendar.change')}
          </button>
        )}
      </p>
      {picker}
      {!shabbatOnly && block('today', t('calendar.today'), dateFormatter.format(now), hebrewToday, [
        ['calendar.sunrise', today.sunrise],
        ['calendar.sunset', today.sunset],
      ], evening ? t('calendar.evening') : undefined)}
      {block('shabbat', t('calendar.shabbat'), dateFormatter.format(times.saturday), plainHe(dateIso(times.saturday)), [
        ['calendar.lighting', times.lighting],
        ['calendar.havdalah', times.havdalah],
      ])}
      <p className="shabbat-calendar-note">{t(auto ? 'calendar.note' : 'calendar.noteChosen')}</p>
    </section>
  );
}

/**
 * «Изменить» next to the city (owner, 10.11.2026): type a city — the list of the matching ones; or your own coordinates.
 * The choice — `niflaot:place`, only on this device (src/core/places.ts); the calendar, the Jewish date in the top bar and
 * the Shabbat rest of the site follow it. No geolocation and no request anywhere — the list is in the code.
 */
function CityPicker({ auto, onDone }: { auto: boolean; onDone: () => void }) {
  const { t, locale } = useI18n();
  const [q, setQ] = useState('');
  const [own, setOwn] = useState(false);
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [name, setName] = useState('');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => input.current?.focus(), []);
  const found = findCities(q);
  const nameOf = (p: Place) => p.name[locale as keyof typeof p.name] ?? p.name.en;
  const choose = (p: Place | null) => {
    setPlace(p);
    onDone();
  };
  const num = (s: string) => Number(s.replace(',', '.').trim());
  const la = num(lat);
  const lo = num(lon);
  const okCoords = lat.trim() !== '' && lon.trim() !== '' && Number.isFinite(la) && Number.isFinite(lo) && Math.abs(la) <= 90 && Math.abs(lo) <= 180;
  return (
    <div className="sc-pick">
      <label className="sc-pick-l" htmlFor="sc-city">
        {t('calendar.typeCity')}
      </label>
      <input
        id="sc-city"
        ref={input}
        className="sc-pick-in"
        type="search"
        autoComplete="off"
        value={q}
        placeholder={t('calendar.cityPlaceholder')}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && found[0]) choose(found[0]);
          if (e.key === 'Escape') {
            e.stopPropagation();
            onDone();
          }
        }}
      />
      {q.trim() !== '' && (
        <ul className="sc-pick-list">
          {found.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => choose(p)}>
                <b>{nameOf(p)}</b>
              </button>
            </li>
          ))}
          {!found.length && <li className="sc-pick-none">{t('calendar.noCity')}</li>}
        </ul>
      )}
      {own ? (
        <div className="sc-own">
          <p className="sc-own-hint">{t('calendar.ownHint')}</p>
          <div className="sc-own-row">
            <label>
              {t('calendar.lat')}
              <input inputMode="decimal" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="48.21" />
            </label>
            <label>
              {t('calendar.lon')}
              <input inputMode="decimal" value={lon} onChange={(e) => setLon(e.target.value)} placeholder="16.37" />
            </label>
          </div>
          <label>
            {t('calendar.ownName')}
            <input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
          </label>
          <button
            type="button"
            className="btn sc-own-save"
            disabled={!okCoords}
            onClick={() => {
              const n = name.trim() || `${la.toFixed(2)}, ${lo.toFixed(2)}`;
              choose({ id: 'custom', lat: la, lon: lo, tz: timeZone(), name: { en: n, ru: n } });
            }}
          >
            {t('calendar.save')}
          </button>
        </div>
      ) : (
        <button type="button" className="sc-link" onClick={() => setOwn(true)}>
          {t('calendar.own')}
        </button>
      )}
      <div className="sc-pick-foot">
        {!auto && (
          <button type="button" className="sc-link" onClick={() => choose(null)}>
            {t('calendar.backAuto')}
          </button>
        )}
        <button type="button" className="sc-link" onClick={onDone}>
          {t('calendar.cancel')}
        </button>
      </div>
    </div>
  );
}
