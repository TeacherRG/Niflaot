import { lazy, Suspense, useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { Sheet } from './ui';

const ShabbatCalendar = lazy(() => import('./ShabbatCalendar').then((m) => ({ default: m.ShabbatCalendar })));

/** The day of the Jewish month of a moment by the browser's Hebrew calendar (no library in the top bar), e.g. «18»; null — no support. */
function hebrewDay(at: Date): string | null {
  try {
    const d = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric' }).format(at);
    return /^\d+$/.test(d) ? d : null;
  } catch {
    return null;
  }
}

const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/**
 * The Jewish day begins at nightfall: after today's sunset in the reader's city (by the time zone — src/core/places.ts;
 * the sun — @hebcal/core, loaded after the page) it is already the next day's number.
 */
async function todayHebrewDay(): Promise<string | null> {
  const now = new Date();
  try {
    const [{ sunTimes }, { placeOf, timeZone }] = await Promise.all([import('../core/hebcal'), import('../core/places')]);
    const zone = timeZone();
    const place = placeOf(zone);
    const sunset = place && sunTimes(isoOf(now), place.lat, place.lon, zone).sunset;
    if (sunset && now >= sunset) return hebrewDay(new Date(now.getTime() + 86_400_000));
  } catch {
    /* no city or no code — the civil day */
  }
  return hebrewDay(now);
}

/**
 * The top bar, right of the language: today's Jewish day, just the number (owner, 28.10.2026; after sunset — the next one);
 * a tap opens the calendar of Shabbat with its times (ShabbatCalendar, loaded only then).
 */
export function HebrewDay() {
  const { t } = useI18n();
  const [day, setDay] = useState(() => hebrewDay(new Date()));
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let live = true;
    const tick = () => void todayHebrewDay().then((d) => live && setDay(d));
    tick();
    const id = setInterval(tick, 60_000);
    return () => {
      live = false;
      clearInterval(id);
    };
  }, []);
  if (!day) return null;
  return (
    <>
      <button type="button" className="hday" onClick={() => setOpen(true)} aria-label={`${t('calendar.hebrewDay')}: ${day} · ${t('calendar.title')}`} title={t('calendar.title')}>
        {day}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={t('calendar.title')} closeLabel={t('menu.close')}>
        <Suspense fallback={null}>{open && <ShabbatCalendar bare />}</Suspense>
      </Sheet>
    </>
  );
}
