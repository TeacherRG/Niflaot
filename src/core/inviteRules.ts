/**
 * «Три сокровища» — the sharing campaign (owner, 25.11.2026: «сделай подсчёт друзей»): rules shared by the site and the
 * accounts server (assistant/src/accounts.ts). Pure functions, no storage.
 *
 * A signed-in learner has a personal invite code; the site adds it to the links they share (`&r=<code>`, src/core/site.ts).
 * A FRIEND is a device that opened such a link for the first time on that device. A friend brings 1 ticket; a friend who
 * then does something on the site (a day of study — `markStudied`) brings 2 more. Not more than DAY_CAP friends a day in
 * one category are counted for a learner. The category is the page the friend landed on.
 * Only friends who come during the campaign count; the draw is on the wheel (wheelofnames.com, weights = tickets).
 */

/** The campaign window (Vienna time, ISO with offset). Change here — the server and the site read the same. */
export const CAMPAIGN = {
  /** 26 Kislev 5787 — the second day of Chanukah, Sunday */
  from: '2026-12-06T00:00:00+01:00',
  /** 1 Tevet, Friday 13:00 — before Shabbat */
  to: '2026-12-11T13:00:00+01:00',
  /** the live draw: 3 Tevet, Sunday evening — after Chanukah and Shabbat */
  draw: '2026-12-13T19:00:00+01:00',
} as const;

/** the account page shows the campaign from a week before it to two days after the draw */
export const campaignShown = (now = Date.now()) =>
  now >= Date.parse(CAMPAIGN.from) - 7 * 864e5 && now < Date.parse(CAMPAIGN.draw) + 2 * 864e5;

export const inCampaign = (now = Date.now()) => now >= Date.parse(CAMPAIGN.from) && now < Date.parse(CAMPAIGN.to);

/** the three categories of the letter to the shop */
export const NOMS = ['sources', 'lashon', 'music'] as const;
export type Nom = (typeof NOMS)[number];
export const isNom = (x: unknown): x is Nom => NOMS.includes(x as Nom);

/** friends counted a day in one category for one learner */
export const DAY_CAP = 3;
/** tickets: a friend who came, and the extra for a friend who studied */
export const TICKET_VISIT = 1;
export const TICKET_ACTIVE = 2;

/** a personal code: 6 letters and digits without the easily confused ones */
export const CODE_RE = /^[a-hjkmnp-z2-9]{6}$/;
const CODE_ABC = 'abcdefghjkmnpqrstuvwxyz23456789';
export function newCode(rand: (n: number) => number = (n) => Math.floor(Math.random() * n)) {
  let s = '';
  for (let i = 0; i < 6; i++) s += CODE_ABC[rand(CODE_ABC.length)];
  return s;
}

/** a device of a friend: random id the friend's browser keeps (no personal data) */
export const DEVICE_RE = /^[a-z0-9]{16,32}$/;

/**
 * The category of the page a friend landed on (path + hash of the address).
 * Святой язык — Hebrew lessons, words, letters, the picture game, «Слова Торы»;
 * Святая музыка — nigunim and «Святое чтение» (Теґилим — песни Давида, the siddur);
 * everything else (Тора, Пророки и Писания, Хасидут, the home page, games) — Святые первоисточники.
 */
export function nomOf(path: string, hash: string): Nom {
  const route = (hash.replace(/^#\/?/, '') || path.replace(/^\/(?:en\/|de\/)?/, '')).split(/[/?]/)[0];
  if (/^(lashon|learn-hebrew|words|hebrew-words|letters|torah-words|pics|halacha-words|english|russian|german)$/.test(route)) return 'lashon';
  if (/^(nigun|reading|tehillim)$/.test(route)) return 'music';
  return 'sources';
}

/** a learner's friends of one category, as the server keeps them */
export interface NomCount {
  friends: number;
  active: number;
}
export const ticketsOf = (c: NomCount) => c.friends * TICKET_VISIT + c.active * TICKET_ACTIVE;

/** the day of a visit for DAY_CAP — Vienna date (the campaign is announced from Vienna) */
export function campaignDay(ms: number) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Vienna' }).format(ms);
}
