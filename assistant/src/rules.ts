/**
 * The rules of the daily reminder, without Cloudflare APIs (scripts/check-push.ts checks them in Node):
 * the hours one can pick, the languages, local time of a time zone, no notifications on Shabbat,
 * which push addresses are accepted.
 */

/** the same list as PUSH_HOURS in src/core/push.ts on the site */
export const PUSH_HOURS = [7, 8, 13, 16, 17, 19];
export const LANGS = ['ru', 'en', 'de'];
/** only real push services: the worker must never be made to post to other addresses */
const PUSH_HOSTS = /(^|\.)(fcm\.googleapis\.com|android\.googleapis\.com|push\.services\.mozilla\.com|push\.apple\.com|notify\.windows\.com)$/;

/** local date (YYYY-MM-DD), weekday (0 = Sunday) and hour of a time zone */
export function localTime(tz: string, now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', hourCycle: 'h23' })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(parts.weekday),
    hour: Number(parts.hour),
  };
}

/** Shabbat and the hours before it: no notifications */
export const restDay = (weekday: number, hour: number) => weekday === 6 || (weekday === 5 && hour >= 12);

export const validTz = (tz: unknown): tz is string => {
  if (typeof tz !== 'string' || tz.length > 64) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

export function validEndpoint(e: unknown): e is string {
  if (typeof e !== 'string' || e.length > 1024) return false;
  try {
    const u = new URL(e);
    return u.protocol === 'https:' && PUSH_HOSTS.test(u.hostname);
  } catch {
    return false;
  }
}

