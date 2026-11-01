import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { hebrewDateText, sunTimes } from '../core/hebcal';
import { placeOf, timeZone } from '../core/places';

const DAY = 86_400_000;
const CANDLE_MINUTES = 18;
const HAVDALAH_MINUTES = 50;

const dateIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

/** This week's Shabbat: Sunday–Friday — the coming one, Saturday — today's; after it ends — the next one. */
function shabbatTimes(now: Date, place: NonNullable<ReturnType<typeof placeOf>>, zone: string) {
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
export function ShabbatCalendar({ bare = false }: { bare?: boolean }) {
  const { t, locale } = useI18n();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const zone = timeZone();
  const place = placeOf(zone);
  if (!place) {
    return (
      <section className={`shabbat-calendar${bare ? ' bare' : ''}`} aria-labelledby={bare ? undefined : 'shabbat-calendar-title'}>
        {!bare && <h2 id="shabbat-calendar-title">{t('calendar.title')}</h2>}
        <p>{t('calendar.locationUnavailable')}</p>
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
  const block = (title: string, date: string, he: string, rows: [Parameters<typeof t>[0], Date | null][], sub?: string) => (
    <div className="shabbat-calendar-block">
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
      <p className="shabbat-calendar-city">{t('calendar.city', { city })}</p>
      {block(t('calendar.today'), dateFormatter.format(now), hebrewToday, [
        ['calendar.sunrise', today.sunrise],
        ['calendar.sunset', today.sunset],
      ], evening ? t('calendar.evening') : undefined)}
      {block(t('calendar.shabbat'), dateFormatter.format(times.saturday), plainHe(dateIso(times.saturday)), [
        ['calendar.lighting', times.lighting],
        ['calendar.havdalah', times.havdalah],
      ])}
      <p className="shabbat-calendar-note">{t('calendar.note')}</p>
    </section>
  );
}
