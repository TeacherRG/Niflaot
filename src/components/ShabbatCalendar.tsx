import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { hebrewDateText, sunTimes } from '../core/hebcal';
import { placeOf, timeZone } from '../core/places';

const DAY = 86_400_000;
const CANDLE_MINUTES = 18;
const HAVDALAH_MINUTES = 50;

const dateIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

function shabbatTimes(now: Date, place: NonNullable<ReturnType<typeof placeOf>>, zone: string) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  const untilFriday = (5 - today.getDay() + 7) % 7;
  let friday = new Date(today.getTime() + untilFriday * DAY);
  let fridaySun = sunTimes(dateIso(friday), place.lat, place.lon, zone);

  if (fridaySun.sunset && now.getTime() >= fridaySun.sunset.getTime() + HAVDALAH_MINUTES * 60_000) {
    friday = new Date(friday.getTime() + 7 * DAY);
    fridaySun = sunTimes(dateIso(friday), place.lat, place.lon, zone);
  }

  const saturday = new Date(friday.getTime() + DAY);
  const saturdaySun = sunTimes(dateIso(saturday), place.lat, place.lon, zone);
  return {
    friday,
    sunrise: fridaySun.sunrise,
    sunset: fridaySun.sunset,
    lighting: fridaySun.sunset ? new Date(fridaySun.sunset.getTime() - CANDLE_MINUTES * 60_000) : null,
    havdalah: saturdaySun.sunset ? new Date(saturdaySun.sunset.getTime() + HAVDALAH_MINUTES * 60_000) : null,
    saturday,
  };
}

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
  const timeFormatter = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', timeZone: zone });
  const dateFormatter = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: zone });
  const city = place.name[locale as keyof typeof place.name] ?? place.name.en;
  const rows = [
    ['calendar.sunrise', times.sunrise],
    ['calendar.sunset', times.sunset],
    ['calendar.lighting', times.lighting],
    ['calendar.havdalah', times.havdalah],
  ] as const;

  return (
    <section className={`shabbat-calendar${bare ? ' bare' : ''}`} aria-labelledby={bare ? undefined : 'shabbat-calendar-title'}>
      <header className="shabbat-calendar-head">
        <div>
          {!bare && <h2 id="shabbat-calendar-title">{t('calendar.title')}</h2>}
          <p>{t('calendar.city', { city })}</p>
        </div>
        <div className="shabbat-calendar-date">
          <strong>{dateFormatter.format(times.friday)}</strong>
          <span className="he" lang="he">{hebrewDateText(dateIso(times.friday)).replace(/[\u0591-\u05C7]/g, '')}</span>
        </div>
      </header>
      <dl className="shabbat-calendar-times">
        {rows.map(([key, time]) => (
          <div key={key}>
            <dt>{t(key)}</dt>
            <dd>{time ? timeFormatter.format(time) : t('calendar.noSun')}</dd>
          </div>
        ))}
      </dl>
      <p className="shabbat-calendar-note">{t('calendar.note')}</p>
    </section>
  );
}
