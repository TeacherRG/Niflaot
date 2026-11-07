/**
 * «Слово — картинка» (`#/pics`): the most frequent words of the Prophets and Writings that can be drawn — four pictures and a word
 * in Hebrew, tap the right picture (or the other way: a picture and four words). The pictures — public/lashon/pics/<Strong>.webp
 * (flat linocut style, 512×512; the prompt and the list of all 50 words — docs/PIC-WORDS.md); a word is in the game only if its
 * picture is in PIC_WORDS. The answers go into «Святой язык — уроки» and «Мои слова», as in «Слова Торы».
 */
import { root } from './tanakh';

/** words with a picture, by frequency (Strong numbers, as in src/tanakh/words.json) */
export const PIC_WORDS = [
  '1121', '4428', '1004', '776', '3117', '376', '6440', '5971', '3027', '5892',
  '1', '5869', '5650', '1870', '259', '3820', '8141', '802', '7218', '3548',
  '8147', '1419', '6963', '2022', '1323', '2719', '6310', '4325', '7307', '251',
  '8064', '8179', '7969', '3220', '784', '3701', '2091', '1241', '6629', '6025',
  '6086', '7704', '5288', '2568', '7272', '68', '5612', '3915',
];

/**
 * Pictures that are easy to mix up are never shown together in one question: man / father / son / kohen / woman / daughter / «voice» (one bearded man on all
 * of them), face / head / eye, sky / day / night, water / sea, land / field, silver / gold, the numbers (pomegranates).
 */
export const PIC_GROUPS: string[][] = [
  ['1121', '1', '376', '3548', '251', '5288', '1323', '802', '6963'],
  ['6440', '7218', '5869', '6310', '639'],
  ['3117', '8064', '3915'],
  ['4325', '3220'],
  ['776', '7704'],
  ['3701', '2091'],
  ['259', '8147', '7969', '702', '2568', '7651'],
];

export const picSrc = (id: string) => `${root()}lashon/pics/${id}.webp`;

const groupOf = (id: string) => PIC_GROUPS.find((g) => g.includes(id));
/** may `a` and `b` stand side by side in one question */
export const apart = (a: string, b: string) => a !== b && !groupOf(a)?.includes(b);

export interface PicQuestion {
  id: string;
  /** four Strong numbers, the right one among them */
  options: string[];
  /** a picture and four words (otherwise — a word and four pictures) */
  reverse: boolean;
}

const shuffle = <T>(a: T[], rnd: () => number) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

/** right answers on this device: id → count (the less, the sooner the word comes back) */
export const PICS_KEY = 'niflaot:pics';
export type PicScore = Record<string, number>;
export function readPicScore(): PicScore {
  try {
    const raw = JSON.parse(localStorage.getItem(PICS_KEY) ?? '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}
export function notePic(id: string, right: boolean) {
  const s = readPicScore();
  s[id] = Math.max(0, (s[id] ?? 0) + (right ? 1 : -1));
  try {
    localStorage.setItem(PICS_KEY, JSON.stringify(s));
  } catch {}
}
/** a word is «known» after this many right answers */
export const PIC_KNOWN = 3;

/**
 * A round: `n` words, the least known first (the same score — in random order); every question has three other pictures that
 * cannot be mixed up with it and with one another; from the second half — sometimes the other way (a picture → the word).
 */
export function makePicRound(ids: string[], score: PicScore, n = 10, rnd: () => number = Math.random): PicQuestion[] {
  const order = shuffle(ids, rnd).sort((a, b) => (score[a] ?? 0) - (score[b] ?? 0));
  const pick = order.slice(0, Math.min(n, ids.length));
  return shuffle(pick, rnd).map((id, i) => {
    const options = [id];
    for (const o of shuffle(ids, rnd)) {
      if (options.length === 4) break;
      if (options.every((x) => apart(x, o))) options.push(o);
    }
    return { id, options: shuffle(options, rnd), reverse: i >= pick.length / 2 && rnd() < 0.5 };
  });
}
