/**
 * When the site rests on Shabbat, for a place: from an hour before sunset on Friday to an hour after sunset on
 * Saturday — a wide margin on both sides. These are not halachic times and the site never shows them as such
 * (no «candle lighting», no «end of Shabbat»). The sun by the standard «sunrise equation» (accurate to about a minute);
 * where the sun does not set (far north in summer) the times are null and fixed hours are used.
 */
const RAD = Math.PI / 180;
const J2000 = 2451545;
const DAY = 86_400_000;

const julian = (ms: number) => ms / DAY + 2440587.5;
const fromJulian = (j: number) => new Date((j - 2440587.5) * DAY);

/**
 * The moment in the evening when the sun's centre is `h` degrees above the horizon (negative = below) on the
 * calendar day of `day` (local), at latitude `lat` and longitude `lon` (east positive). Null if it never gets there.
 */
export function eveningSun(day: Date, lat: number, lon: number, h: number): Date | null {
  const noon = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 12);
  const n = Math.round(julian(noon.getTime()) - J2000 + 0.0008);
  const jStar = n - lon / 360;
  const M = (357.5291 + 0.98560028 * jStar) % 360;
  const C = 1.9148 * Math.sin(M * RAD) + 0.02 * Math.sin(2 * M * RAD) + 0.0003 * Math.sin(3 * M * RAD);
  const L = (M + C + 180 + 102.9372) % 360;
  const transit = J2000 + jStar + 0.0053 * Math.sin(M * RAD) - 0.0069 * Math.sin(2 * L * RAD);
  const sinD = Math.sin(L * RAD) * Math.sin(23.4397 * RAD);
  const cosD = Math.cos(Math.asin(sinD));
  const cosW = (Math.sin(h * RAD) - Math.sin(lat * RAD) * sinD) / (Math.cos(lat * RAD) * cosD);
  if (cosW < -1 || cosW > 1) return null;
  return fromJulian(transit + Math.acos(cosW) / RAD / 360);
}

export const SUNSET = -0.833;
/** the site closes an hour before sunset on Friday and opens an hour after sunset on Saturday — with a margin */
export const MARGIN_MIN = 60;

/** When the site rests: an hour before sunset on Friday `friday` to an hour after sunset on Saturday; null without a sunset. */
export function shabbatTimes(friday: Date, lat: number, lon: number): { from: Date; to: Date } | null {
  const sat = new Date(friday.getFullYear(), friday.getMonth(), friday.getDate() + 1);
  const fri = eveningSun(friday, lat, lon, SUNSET);
  const satSunset = eveningSun(sat, lat, lon, SUNSET);
  if (!fri || !satSunset) return null;
  return {
    from: new Date(fri.getTime() - MARGIN_MIN * 60_000),
    to: new Date(satSunset.getTime() + MARGIN_MIN * 60_000),
  };
}
