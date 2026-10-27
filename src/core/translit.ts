/**
 * How a vocalized Hebrew word of the Tanakh is read — in Russian, English or German letters (the word's window on the
 * page of the day, WordPop.tsx). The modern (Sephardi) reading, as the project writes names: ru — ה is «ґ», ח and soft כ
 * are «х» (Йеґошуа, Ярден); en — as chabad.org (ch, tz, sh); de — as de.chabad.org (ch, z, sch, w, j). Rules, kept simple:
 * a sheva is read at the start of a word and after another sheva, otherwise it is silent; א and ע and a vowel letter
 * (י after i / e — after a tsere it is «ei», ו with a dot as u / o, final ה) are not read; a patach under a final ח / ע is read before it (רוּחַ — ruach);
 * כָּל is «kol». No stress, no doubling. The Name ה׳ is read Hashem.
 */
export type ReadLang = 'ru' | 'en' | 'de';

const DAGESH = 'ּ';
const SHIN = 'ׁ';
const SIN = 'ׂ';
const V = {
  sheva: 'ְ',
  hatafE: 'ֱ',
  hatafA: 'ֲ',
  hatafO: 'ֳ',
  hiriq: 'ִ',
  tsere: 'ֵ',
  segol: 'ֶ',
  patach: 'ַ',
  kamatz: 'ָ',
  holam: 'ֹ',
  holamV: 'ֺ',
  kubutz: 'ֻ',
  kamatzK: 'ׇ',
};
/** `y` — the «i» of a tsere with a yod after it (מַלְכֵי — malchei) */
type Vowel = 'a' | 'e' | 'i' | 'o' | 'u' | 'y' | ':' | '';
const VOWEL: Record<string, Vowel> = {
  [V.sheva]: ':',
  [V.hatafE]: 'e',
  [V.hatafA]: 'a',
  [V.hatafO]: 'o',
  [V.hiriq]: 'i',
  [V.tsere]: 'e',
  [V.segol]: 'e',
  [V.patach]: 'a',
  [V.kamatz]: 'a',
  [V.holam]: 'o',
  [V.holamV]: 'o',
  [V.kubutz]: 'u',
  [V.kamatzK]: 'o',
};

interface Letter {
  c: string;
  dagesh: boolean;
  sin: boolean;
  v: Vowel;
  /** the patach is under the letter (for the furtive patach) */
  patach: boolean;
  tsere: boolean;
}

function parse(word: string): Letter[] {
  const out: Letter[] = [];
  for (const ch of word.normalize('NFC').normalize('NFD')) {
    if (ch >= 'א' && ch <= 'ת') out.push({ c: ch, dagesh: false, sin: false, v: '', patach: false, tsere: false });
    const l = out[out.length - 1];
    if (!l) continue;
    if (ch === DAGESH) l.dagesh = true;
    else if (ch === SIN) l.sin = true;
    else if (ch === SHIN) l.sin = false;
    else if (VOWEL[ch] !== undefined) {
      // the holam of a ו after a letter without a vowel is that letter's «o» (holam male)
      l.v = VOWEL[ch];
      l.patach = ch === V.patach;
      l.tsere = ch === V.tsere;
    }
  }
  return out;
}

type Sound = { k: 'c'; s: string; soft?: boolean } | { k: 'v'; s: Vowel };

/** The word as consonants and vowels (the language decides how to write them). */
function sounds(word: string): Sound[] {
  const ls = parse(word);
  const out: Sound[] = [];
  let prevSheva = false;
  for (let i = 0; i < ls.length; i++) {
    const l = ls[i];
    const next = ls[i + 1];
    const last = i === ls.length - 1;
    const prevVowel = (() => {
      for (let k = out.length - 1; k >= 0; k--) {
        const s = out[k];
        if (s.k === 'v') return s.s;
        return '';
      }
      return '';
    })();
    // ו as a vowel letter: וּ without a vowel of its own is «u» (shuruk) — unless it starts the word with a vowel after it;
    // וֹ after a letter without a vowel is «o» (holam male)
    if (l.c === 'ו' && l.dagesh && !l.v && (i > 0 || !next)) {
      out.push({ k: 'v', s: 'u' });
      prevSheva = false;
      continue;
    }
    if (l.c === 'ו' && i === 0 && l.dagesh && !l.v) {
      out.push({ k: 'v', s: 'u' });
      continue;
    }
    if (l.c === 'ו' && l.v === 'o' && i > 0 && !ls[i - 1].v) {
      out.push({ k: 'v', s: 'o' });
      prevSheva = false;
      continue;
    }
    // י after i / e without a vowel of its own is not read (a vowel letter), nor is a final ה or א without a vowel
    if (l.c === 'י' && !l.v && !l.dagesh && (prevVowel === 'i' || prevVowel === 'e')) {
      // after a tsere it is heard: «ei» (מַלְכֵי — malchei)
      if (ls[i - 1]?.tsere) out.push({ k: 'v', s: 'y' });
      continue;
    }
    // ־ָיו at the end of a word is «av» (עָלָיו — alav)
    if (l.c === 'י' && !l.v && prevVowel === 'a' && next?.c === 'ו' && !next.v && !next.dagesh && i + 2 === ls.length) continue;
    // (but not before a ו that is its vowel: יְהוֹשֻׁעַ — the ה is read)
    const vowelVav = !!next && next.c === 'ו' && (next.v === 'o' || (next.dagesh && !next.v));
    if ((l.c === 'א' || (l.c === 'ה' && !l.dagesh)) && !l.v && !vowelVav && (last || !next || prevVowel)) continue;
    // a furtive patach: under a final ח / ע / הּ the «a» comes before the letter
    const furtive = last && l.patach && (l.c === 'ח' || l.c === 'ע' || (l.c === 'ה' && l.dagesh));
    if (furtive) out.push({ k: 'v', s: 'a' });
    const soft = !l.dagesh && 'בכפ'.includes(l.c);
    out.push({ k: 'c', s: l.c === 'ש' && l.sin ? 'שׂ' : l.c, soft });
    if (furtive) {
      prevSheva = false;
      continue;
    }
    if (l.v === ':') {
      // a sheva is read at the start of the word and after another sheva (not at the end of the word)
      const read: boolean = !last && (i === 0 || prevSheva) && !(next && next.c === 'ו' && next.dagesh && !next.v);
      if (read) out.push({ k: 'v', s: 'e' });
      prevSheva = !read;
    } else {
      if (l.v) out.push({ k: 'v', s: l.v });
      prevSheva = false;
    }
  }
  return out;
}

const C: Record<ReadLang, Record<string, string>> = {
  ru: { א: '', ב: 'б', בs: 'в', ג: 'г', ד: 'д', ה: 'ґ', ו: 'в', ז: 'з', ח: 'х', ט: 'т', י: 'й', כ: 'к', כs: 'х', ך: 'х', ל: 'л', מ: 'м', ם: 'м', נ: 'н', ן: 'н', ס: 'с', ע: '', פ: 'п', פs: 'ф', ף: 'ф', צ: 'ц', ץ: 'ц', ק: 'к', ר: 'р', ש: 'ш', שׂ: 'с', ת: 'т' },
  en: { א: '', ב: 'b', בs: 'v', ג: 'g', ד: 'd', ה: 'h', ו: 'v', ז: 'z', ח: 'ch', ט: 't', י: 'y', כ: 'k', כs: 'ch', ך: 'ch', ל: 'l', מ: 'm', ם: 'm', נ: 'n', ן: 'n', ס: 's', ע: '', פ: 'p', פs: 'f', ף: 'f', צ: 'tz', ץ: 'tz', ק: 'k', ר: 'r', ש: 'sh', שׂ: 's', ת: 't' },
  de: { א: '', ב: 'b', בs: 'w', ג: 'g', ד: 'd', ה: 'h', ו: 'w', ז: 's', ח: 'ch', ט: 't', י: 'j', כ: 'k', כs: 'ch', ך: 'ch', ל: 'l', מ: 'm', ם: 'm', נ: 'n', ן: 'n', ס: 's', ע: '', פ: 'p', פs: 'f', ף: 'f', צ: 'z', ץ: 'z', ק: 'k', ר: 'r', ש: 'sch', שׂ: 's', ת: 't' },
};
const RU_V: Record<Vowel, string> = { a: 'а', e: 'е', i: 'и', o: 'о', u: 'у', y: 'й', ':': '', '': '' };
const Y: Record<ReadLang, string> = { ru: 'й', en: 'i', de: 'j' };

/** How a Hebrew word (with vowels) is read in the letters of `lang`. */
export function readHebrew(word: string, lang: ReadLang): string {
  const plain = word.replace(/[[\]()]/g, '');
  if (/^ה׳$/.test(plain.replace(/[֑-ׇ]/g, ''))) return lang === 'ru' ? 'Ашем' : lang === 'de' ? 'Haschem' : 'Hashem';
  const letters = plain.replace(/[^א-ת]/g, '');
  // כָּל (kol) — a kamatz katan the rules above can't tell
  if (letters === 'כל' && plain.includes(V.kamatz)) return lang === 'ru' ? 'коль' : 'kol';
  const ss = sounds(plain.replace(/[-־]/g, ''));
  let out = '';
  for (let i = 0; i < ss.length; i++) {
    const s = ss[i];
    const next = ss[i + 1];
    if (s.k === 'c') {
      let x = C[lang][s.soft && C[lang][s.s + 's'] ? s.s + 's' : s.s] ?? '';
      // ru: final ל and ל before a consonant — «ль» (Исраэль, Шауль)
      if (lang === 'ru' && x === 'л' && (!next || next.k === 'c')) x = 'ль';
      // ru: й with a / u — я / ю (Ярден); and at the start with i — just «и» (Ицхак, Исраэль)
      if (lang === 'ru' && x === 'й' && next?.k === 'v' && (next.s === 'a' || next.s === 'u' || (next.s === 'i' && !out))) {
        out += next.s === 'a' ? 'я' : next.s === 'u' ? 'ю' : 'и';
        i++;
        continue;
      }
      out += x;
    } else {
      if (lang === 'ru' && s.s === 'y') out += Y.ru;
      else if (lang === 'ru') {
        const prev = out[out.length - 1];
        // «э» at the start and after a vowel (эрец, ваэра), «е» after a consonant
        out += s.s === 'e' && (!prev || /[аеиоуэяюё]/.test(prev)) ? 'э' : RU_V[s.s];
      } else out += s.s === 'y' ? Y[lang] : s.s === ':' ? '' : s.s;
    }
  }
  return out;
}
