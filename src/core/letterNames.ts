/**
 * Names and sounds of the Hebrew letters in the languages of the site — for players who don't know the letters
 * (see hebrewLevel.ts): «מ — мем», «ש — шин / син». Russian transliteration follows the project's rule (ה → ґ).
 */
import type { Locale } from '../i18n';
import { VALUES } from './gematria';
import { expectedTiles, phraseTiles, type Take } from './letterPuzzle';

type L = Record<'ru' | 'en' | 'de', string>;
/** letter → [name, sound]; for letters with two sounds both are given («б / в») */
const INFO: Record<string, [L, L]> = {
  'א': [{ ru: 'алеф', en: 'alef', de: 'Alef' }, { ru: 'немая', en: 'silent', de: 'stumm' }],
  'ב': [{ ru: 'бет', en: 'bet', de: 'Bet' }, { ru: 'б / в', en: 'b / v', de: 'b / w' }],
  'ג': [{ ru: 'гимель', en: 'gimel', de: 'Gimel' }, { ru: 'г', en: 'g', de: 'g' }],
  'ד': [{ ru: 'далет', en: 'dalet', de: 'Dalet' }, { ru: 'д', en: 'd', de: 'd' }],
  'ה': [{ ru: 'ґей', en: 'hei', de: 'He' }, { ru: 'ґ', en: 'h', de: 'h' }],
  'ו': [{ ru: 'вав', en: 'vav', de: 'Waw' }, { ru: 'в / о / у', en: 'v / o / u', de: 'w / o / u' }],
  'ז': [{ ru: 'заин', en: 'zayin', de: 'Sajin' }, { ru: 'з', en: 'z', de: 's' }],
  'ח': [{ ru: 'хет', en: 'chet', de: 'Chet' }, { ru: 'х', en: 'ch', de: 'ch' }],
  'ט': [{ ru: 'тет', en: 'tet', de: 'Tet' }, { ru: 'т', en: 't', de: 't' }],
  'י': [{ ru: 'йуд', en: 'yud', de: 'Jud' }, { ru: 'й / и', en: 'y / i', de: 'j / i' }],
  'כ': [{ ru: 'каф', en: 'kaf', de: 'Kaf' }, { ru: 'к / х', en: 'k / ch', de: 'k / ch' }],
  'ל': [{ ru: 'ламед', en: 'lamed', de: 'Lamed' }, { ru: 'л', en: 'l', de: 'l' }],
  'מ': [{ ru: 'мем', en: 'mem', de: 'Mem' }, { ru: 'м', en: 'm', de: 'm' }],
  'נ': [{ ru: 'нун', en: 'nun', de: 'Nun' }, { ru: 'н', en: 'n', de: 'n' }],
  'ס': [{ ru: 'самех', en: 'samech', de: 'Samech' }, { ru: 'с', en: 's', de: 's' }],
  'ע': [{ ru: 'аин', en: 'ayin', de: 'Ajin' }, { ru: 'немая', en: 'silent', de: 'stumm' }],
  'פ': [{ ru: 'пе', en: 'pei', de: 'Pe' }, { ru: 'п / ф', en: 'p / f', de: 'p / f' }],
  'צ': [{ ru: 'цади', en: 'tzadi', de: 'Zadi' }, { ru: 'ц', en: 'tz', de: 'z' }],
  'ק': [{ ru: 'куф', en: 'kuf', de: 'Kuf' }, { ru: 'к', en: 'k', de: 'k' }],
  'ר': [{ ru: 'рейш', en: 'reish', de: 'Resch' }, { ru: 'р', en: 'r', de: 'r' }],
  'ש': [{ ru: 'шин', en: 'shin', de: 'Schin' }, { ru: 'ш / с', en: 'sh / s', de: 'sch / s' }],
  'ת': [{ ru: 'тав', en: 'tav', de: 'Taw' }, { ru: 'т', en: 't', de: 't' }],
};
/** final forms → their letter */
export const FINALS: Record<string, string> = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' };
const SOFIT: L = { ru: 'конечная', en: 'final', de: 'End-' };

const lang = (l: Locale) => (l === 'en' || l === 'de' ? l : 'ru');

/** «мем», «мем конечная» (en «final mem», de «End-Mem») */
export function letterName(c: string, locale: Locale): string {
  const base = FINALS[c];
  const k = lang(locale);
  if (!base) return INFO[c]?.[0][k] ?? c;
  const n = INFO[base][0][k];
  return k === 'ru' ? `${n} конечная` : k === 'en' ? `${SOFIT.en} ${n}` : `${SOFIT.de}${n}`;
}

export const letterSound = (c: string, locale: Locale) => INFO[FINALS[c] ?? c]?.[1][lang(locale)] ?? '';

/** «мем · 40» — the title of a letter tile (shown on a long press / hover) */
export const letterTitle = (c: string, locale: Locale) => `${letterName(c, locale)} · ${VALUES[c] ?? ''}`;

/** The 22 letters in order, then the 5 final forms. */
export const ALEPH_BET = [...'אבגדהוזחטיכלמנסעפצקרשת'];
export const FINAL_FORMS = [...'ךםןףץ'];

/** Letters that are easy to confuse — the trainer offers them as wrong answers. */
export const LOOKALIKES: string[][] = [
  [...'בכפ'], [...'דרך'], [...'החת'], [...'וזןי'], [...'גנ'], [...'טמסם'], [...'עצ'], [...'שע'],
];

/**
 * «Собери слово» for a player who doesn't know the letters: the names of the letters the rule takes, in the order they
 * stand in the phrase (not in the order of the answer — that stays the player's work): «мем, алеф, ґей».
 */
export function neededLetters(from: string, take: Take, locale: Locale): string {
  const tiles = phraseTiles(from);
  return [...expectedTiles(tiles, take)].sort((a, b) => a - b).map((i) => letterName(tiles[i].c, locale)).join(', ');
}
