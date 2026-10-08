/**
 * The site rests on Shabbat: from Friday 21:00 to Saturday 21:00 in the user's own time zone
 * (the device clock). Fixed hours, the same everywhere — not the zmanim of a place.
 */
export const SHABBAT_FROM = 21; // Friday, hour
export const SHABBAT_TO = 21; // Saturday, hour

export function isShabbatRest(d = new Date()): boolean {
  const day = d.getDay(); // 5 Friday, 6 Saturday
  return (day === 5 && d.getHours() >= SHABBAT_FROM) || (day === 6 && d.getHours() < SHABBAT_TO);
}

/** When the site opens again: the coming Saturday at SHABBAT_TO. */
export function reopensAt(d = new Date()): Date {
  const r = new Date(d);
  r.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7));
  r.setHours(SHABBAT_TO, 0, 0, 0);
  return r;
}

/** `?shabbat=preview` shows the Shabbat screen at any time (to check it). */
export const shabbatPreview = () => {
  try {
    return new URLSearchParams(location.search).get('shabbat') === 'preview';
  } catch {
    return false;
  }
};
