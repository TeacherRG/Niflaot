/**
 * «Святое чтение» — транслит для чтения вслух: как произносить огласованный текст Теґилим (и «Аазину») буквами языка сайта.
 * Это не окошко над словом (`translit.ts` — современное чтение и «Ашем» вне молитвы), а **ашкеназское чтение, как читают
 * Теґилим в общине Хабада**: камац — «о», холам — «ой» (ru) / «o» (en, de), цере — «ей» / «ei» / «ej», ת без дагеша — «с»;
 * Имена — как их произносят, читая Теґилим (владелец, 04.11.2026): Адойной, Элоґим / Элоґейну, Эйл, Йо, Шадай.
 * ru: ה — «ґ», как везде в проекте; en — ch, tz, sh (как английские сидуры Хабада); de — ch, z, sch, w, j, «ej» (не «ei» —
 * его прочтут «ай»). Между гласными на месте א / ע в en и de — апостроф (ho'ish).
 *
 * Шва: на — в начале слова, вторая из двух, под буквой с дагеш-хазаком, перед той же буквой, после долгой гласной (цере,
 * холам, шурук, хирик с йудом, камац с метегом); после камаца без метега — нах (почти всегда закрытый слог: יָדְךָ — йодхо),
 * спорные места — в `shevaAfterKamatz` (для проверки). Шва после приставки וּ — нах («увдерех»), как читают.
 *
 * **Сефардское чтение** (`pron = 'sef'`, владелец, 04.11.2026): камац — «а», а камац катан (закрытый безударный слог:
 * перед шва-нах без метега, перед хатаф-камацем, כָּל־) — «о»; холам — «о», цере — «е» / «e», ת без дагеша — «т»;
 * Имена — Адонай, Элоґим / Элоґену, Эль, Йа, Шадай.
 */
import type { ReadLang } from './translit';

type Profile = {
  qamats: string;
  /** камац катан (в сефардском — «о», в ашкеназском — как камац) */
  qamatsQatan: string;
  holam: string;
  tsere: string;
  segol: string;
  patah: string;
  hiriq: string;
  qubuts: string;
  shuruq: string;
  shevaNa: string;
  /** холам в Именах (Элоґим, Элоґейну) — без «й», как их произносят; Адойной — с «й», как обычный холам */
  namesHolam: string;
  /** согласные; у бегадкефат — [с дагешем, без] */
  cons: Record<string, string | [string, string]>;
  k: string;
  /** йуд в конце слова после патаха / камаца: חַי, עֵינַי */
  finalYod: string;
  /** апостроф между гласными на месте א / ע */
  apostrophe: boolean;
  names: { adonai: string; elokim: string; kel: string; keli: string; kah: string; shaddai: string };
};

const PROFILES: Record<ReadLang, Profile> = {
  ru: {
    qamats: 'о', holam: 'ой', tsere: 'ей', segol: 'е', patah: 'а', hiriq: 'и', qubuts: 'у', shuruq: 'у', shevaNa: 'е', namesHolam: 'о', qamatsQatan: 'о',
    cons: { ב: ['б', 'в'], ג: 'г', ד: 'д', ה: 'ґ', ו: 'в', ז: 'з', ח: 'х', ט: 'т', י: 'й', כ: ['к', 'х'], ל: 'л', מ: 'м', נ: 'н',
      ס: 'с', פ: ['п', 'ф'], צ: 'ц', ק: 'к', ר: 'р', שׁ: 'ш', שׂ: 'с', ת: ['т', 'с'] },
    k: 'к', finalYod: 'й', apostrophe: false,
    names: { adonai: 'Адойной', elokim: 'Элоґим', kel: 'Эйл', keli: 'Эйли', kah: 'Йо', shaddai: 'Шадай' },
  },
  en: {
    qamats: 'o', holam: 'o', tsere: 'ei', segol: 'e', patah: 'a', hiriq: 'i', qubuts: 'u', shuruq: 'u', shevaNa: 'e', namesHolam: 'o', qamatsQatan: 'o',
    cons: { ב: ['b', 'v'], ג: 'g', ד: 'd', ה: 'h', ו: 'v', ז: 'z', ח: 'ch', ט: 't', י: 'y', כ: ['k', 'ch'], ל: 'l', מ: 'm', נ: 'n',
      ס: 's', פ: ['p', 'f'], צ: 'tz', ק: 'k', ר: 'r', שׁ: 'sh', שׂ: 's', ת: ['t', 's'] },
    k: 'k', finalYod: 'i', apostrophe: true,
    names: { adonai: 'Adonoi', elokim: 'Elohim', kel: 'Eil', keli: 'Eili', kah: 'Yo', shaddai: 'Shadai' },
  },
  de: {
    qamats: 'o', holam: 'o', tsere: 'ej', segol: 'e', patah: 'a', hiriq: 'i', qubuts: 'u', shuruq: 'u', shevaNa: 'e', namesHolam: 'o', qamatsQatan: 'o',
    cons: { ב: ['b', 'w'], ג: 'g', ד: 'd', ה: 'h', ו: 'w', ז: 's', ח: 'ch', ט: 't', י: 'j', כ: ['k', 'ch'], ל: 'l', מ: 'm', נ: 'n',
      ס: 's', פ: ['p', 'f'], צ: 'z', ק: 'k', ר: 'r', שׁ: 'sch', שׂ: 's', ת: ['t', 's'] },
    k: 'k', finalYod: 'j', apostrophe: true,
    names: { adonai: 'Adonoj', elokim: 'Elohim', kel: 'Ejl', keli: 'Ejli', kah: 'Jo', shaddai: 'Schadaj' },
  },
};

/** Произношение: ашкеназское (как читают Теґилим в Хабаде, по умолчанию) или сефардское. */
export type Pron = 'ash' | 'sef';
export const PRONS: Pron[] = ['ash', 'sef'];

const SEF: Record<ReadLang, Profile> = {
  ru: { ...PROFILES.ru, qamats: 'а', qamatsQatan: 'о', holam: 'о', namesHolam: 'о', tsere: 'е',
    cons: { ...PROFILES.ru.cons, ת: ['т', 'т'] },
    names: { adonai: 'Адонай', elokim: 'Элоґим', kel: 'Эль', keli: 'Эли', kah: 'Йа', shaddai: 'Шадай' } },
  en: { ...PROFILES.en, qamats: 'a', qamatsQatan: 'o', holam: 'o', namesHolam: 'o', tsere: 'e',
    cons: { ...PROFILES.en.cons, ת: ['t', 't'] },
    names: { adonai: 'Adonai', elokim: 'Elohim', kel: 'El', keli: 'Eli', kah: 'Yah', shaddai: 'Shadai' } },
  de: { ...PROFILES.de, qamats: 'a', qamatsQatan: 'o', holam: 'o', namesHolam: 'o', tsere: 'e',
    cons: { ...PROFILES.de.cons, ת: ['t', 't'] },
    names: { adonai: 'Adonai', elokim: 'Elohim', kel: 'El', keli: 'Eli', kah: 'Jah', shaddai: 'Schadai' } },
};

const SHEVA = 'ְ', HSEGOL = 'ֱ', HPATAH = 'ֲ', HQAMATS = 'ֳ', HIRIQ = 'ִ', TSERE = 'ֵ', SEGOL = 'ֶ',
  PATAH = 'ַ', QAMATS = 'ָ', HOLAM = 'ֹ', HOLAM_VAV = 'ֺ', QUBUTS = 'ֻ', DAGESH = 'ּ', METEG = 'ֽ',
  MAQAF = '־', SIN_DOT = 'ׂ', QAMATS_QATAN = 'ׇ';
const VOWELS = new Set([SHEVA, HSEGOL, HPATAH, HQAMATS, HIRIQ, TSERE, SEGOL, PATAH, QAMATS, HOLAM, HOLAM_VAV, QUBUTS, QAMATS_QATAN]);
const FINAL: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };
const BEGADKEFAT = 'בגדכפת';

interface Cl {
  ch: string;
  vowel: string | null;
  dagesh: boolean;
  sin: boolean;
  meteg: boolean;
}

function parse(word: string): Cl[] {
  const out: Cl[] = [];
  for (const c of word.normalize('NFD')) {
    if (c >= 'א' && c <= 'ת') out.push({ ch: FINAL[c] ?? c, vowel: null, dagesh: false, sin: false, meteg: false });
    else if (!out.length) continue;
    else {
      const cl = out[out.length - 1];
      if (VOWELS.has(c)) cl.vowel = c;
      else if (c === DAGESH) cl.dagesh = true;
      else if (c === SIN_DOT) cl.sin = true;
      else if (c === METEG) cl.meteg = true;
      // знаки кантилляции и точка шин — не нужны
    }
  }
  return out;
}

const skeleton = (cls: Cl[]) => cls.map((c) => c.ch).join('');

function consonant(cl: Cl, i: number, cls: Cl[], o: Profile): string {
  if (cl.ch === 'א' || cl.ch === 'ע') return '';
  if (cl.ch === 'ה' && i === cls.length - 1 && !cl.dagesh && !cl.vowel) return '';
  const v = o.cons[cl.ch === 'ש' ? (cl.sin ? 'שׂ' : 'שׁ') : cl.ch];
  if (Array.isArray(v)) return cl.dagesh ? v[0] : v[1];
  return v ?? '';
}

/** вав — гласная (шурук, холам малэ) или согласная */
function isConsonantVav(i: number, cls: Cl[]): boolean {
  const cl = cls[i];
  if (cl.ch !== 'ו') return false;
  if (cl.dagesh && !cl.vowel) return false;
  if (cl.vowel === HOLAM && i > 0 && !cls[i - 1].vowel) return false;
  return true;
}

/** что заметить проверке: слова, где шва после камаца без метега прочитана как нах */
export const shevaAfterKamatz = new Set<string>();

function shevaIsNa(i: number, cls: Cl[], word: string): boolean {
  if (i === cls.length - 1) return false;
  const cl = cls[i];
  const prev = cls[i - 1];
  const next = cls[i + 1];
  if (i === 0) return true;
  if (prev.vowel === SHEVA) return true;
  if (prev.ch === 'ו' && prev.dagesh && !prev.vowel && i === 1) return false; // וּבְדֶרֶךְ — «увдерех»
  if (cl.dagesh && (!BEGADKEFAT.includes(cl.ch) || (prev.vowel && prev.vowel !== SHEVA))) return true; // дагеш хазак
  if (next && next.ch === cl.ch) return true;
  if (cl.ch === 'י' && (prev.vowel === QAMATS || prev.vowel === PATAH)) return false; // לַיְלָה, הָיְתָה
  if (prev.vowel === QAMATS && prev.meteg) return true;
  if (prev.vowel === QAMATS_QATAN) return false;
  if (prev.vowel === TSERE || prev.vowel === HOLAM) return true;
  if (prev.ch === 'ו' && (prev.dagesh || prev.vowel === HOLAM) && !isConsonantVav(i - 1, cls)) return true;
  if (prev.ch === 'י' && !prev.vowel && cls[i - 2]?.vowel === HIRIQ) return true;
  if (prev.vowel === QAMATS) shevaAfterKamatz.add(word);
  return false;
}

/** камац — катан: закрытый безударный слог (перед шва-нах без метега, перед хатаф-камацем), כָּל־ перед макафом */
function qatan(i: number, cls: Cl[], word: string, kol?: boolean): boolean {
  const cl = cls[i];
  const next = cls[i + 1];
  if (cl.meteg || !next) return false;
  if (kol && cl.ch === 'כ' && next.ch === 'ל' && !next.vowel && i + 1 === cls.length - 1) return true;
  if (next.vowel === HQAMATS) return true;
  // דְּבָרְךָ, יָדְךָ — перед окончанием ־ךָ / ־כֶם камац остаётся «а»
  const after = cls[i + 2];
  if (after?.ch === 'כ' && (i + 2 === cls.length - 1 || (i + 3 === cls.length - 1 && cls[i + 3].ch === 'מ'))) return false;
  // камац гадоль, хотя за ним шва (глагольные формы и другие исключения; разобраны все 246 слов Теґилим, 04.11.2026):
  const end = cls[cls.length - 1];
  const sk = skeleton(cls);
  if (next.ch === 'ו') return false; // שָׁוְא — «шав», הַמָּוְתָה
  if (cl.dagesh && cls[i - 1]?.vowel) return false; // нифаль: יִכָּלְמוּ, בְּהִשָּׁפְטוֹ — «йикалму»
  const shuruq = (c?: Cl) => c?.ch === 'ו' && c.dagesh && !c.vowel;
  if (shuruq(end) || (end.ch === 'נ' && shuruq(cls[cls.length - 2]))) return false; // אָמְרוּ «амру», יֵחָלְצוּן
  if (end.ch === 'ה' && !end.vowel && !end.dagesh && cls[cls.length - 2]?.vowel === QAMATS && !sk.includes('חכמ')) return false; // שָׁמְרָה «шамра», но חָכְמָה «хохма»
  if (after?.ch === 'ת' && after.dagesh && !sk.includes('בשת')) return false; // אָמָרְתִּי «амарти», но בָּשְׁתִּי «бошти»
  if (next.ch === 'ר' && 'הלבכמ'.includes(cl.ch) && (i === 0 || (i === 1 && cls[0].ch === 'ו'))) return false; // הָרְשָׁעִים «ґарешаим»
  if (sk.includes('שרת') || (next.ch === 'ת' && after?.ch === 'נ')) return false; // מְשָׁרְתָיו «мешаретав», אֲכָלָתְנִי
  if (next.vowel === SHEVA && next.ch !== 'י' && i + 1 < cls.length - 1 && !shevaIsNa(i + 1, cls, word)) {
    qatanWords.add(word);
    return true;
  }
  return false;
}

/** что заметить проверке: слова, где камац прочитан как катан («о») по правилу закрытого слога */
export const qatanWords = new Set<string>();

function plain(cls: Cl[], o: Profile, word: string, opts: { holam?: string; kol?: boolean } = {}): string {
  let s = '';
  const vowelOf = (v: string | null): string => {
    switch (v) {
      case HSEGOL: case SEGOL: return o.segol;
      case HPATAH: case PATAH: return o.patah;
      case HQAMATS: case QAMATS_QATAN: return o.qamatsQatan;
      case QAMATS: return o.qamats;
      case HIRIQ: return o.hiriq;
      case TSERE: return o.tsere;
      case HOLAM: case HOLAM_VAV: return opts.holam ?? o.holam;
      case QUBUTS: return o.qubuts;
      default: return '';
    }
  };
  const vowelEnd = (x: string) => /([aeiouаеэиоуыяю]|ej)$/.test(x); // de: цере «ej» — тоже гласная
  for (let i = 0; i < cls.length; i++) {
    const cl = cls[i];
    const prev = cls[i - 1];
    const next = cls[i + 1];
    const last = i === cls.length - 1;
    if (cl.ch === 'ו' && !isConsonantVav(i, cls)) {
      if (cl.dagesh && !cl.vowel) s += o.shuruq;
      else {
        if (o.apostrophe && prev && (prev.ch === 'א' || prev.ch === 'ע') && vowelEnd(s)) s += "'";
        s += vowelOf(HOLAM);
      }
      continue;
    }
    // йуд без гласной — буква-гласная
    if (cl.ch === 'י' && !cl.vowel && !cl.dagesh && prev) {
      if (prev.vowel === HIRIQ || prev.vowel === TSERE) continue;
      if (prev.vowel === SEGOL) {
        s += o.tsere.slice(o.segol.length);
        continue;
      }
      if (prev.vowel === QAMATS && next?.ch === 'ו' && i + 1 === cls.length - 1 && !next.vowel) {
        i++;
        s += consonant(next, i, cls, o); // ָיו — «ов»
        continue;
      }
      if (/й$/.test(s)) continue; // גּוֹי — «гой»
      if (last && (prev.vowel === PATAH || prev.vowel === QAMATS)) {
        s += o.finalYod;
        continue;
      }
    }
    // патах гнува: רוּחַ — руах
    if (last && cl.vowel === PATAH && (cl.ch === 'ח' || cl.ch === 'ע' || (cl.ch === 'ה' && cl.dagesh))) {
      s += vowelOf(PATAH) + consonant(cl, i, cls, o);
      continue;
    }
    let cons = consonant(cl, i, cls, o);
    if (cons && cons === o.cons['י'] && s.endsWith(cons)) cons = ''; // גּוֹיִם — гойим, не гоййим
    if (cons === 'y' && /[oe]i$/.test(s)) s = s.slice(0, -1);
    let vow = cl.vowel === SHEVA ? (shevaIsNa(i, cls, word) ? o.shevaNa : '') : vowelOf(cl.vowel);
    if (cl.vowel === QAMATS && qatan(i, cls, word, opts.kol)) vow = o.qamatsQatan;
    if (o.apostrophe && !cons && vow && vowelEnd(s)) vow = `'${vow}`;
    if (!o.apostrophe && !cons && /^е/.test(vow) && (s === '' || vowelEnd(s))) vow = vow.replace(/^е/, 'э');
    s += cons + vow;
  }
  return s;
}

const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);

/** Имена Всевышнего — как их произносят, читая Теґилим (владелец, 04.11.2026: «можно и нужно произносить»): יהוה — Адойной, יָהּ — Йо, אֱלֹהֵינוּ — Элоґейну; не Имя — null */
function divineName(cls: Cl[], o: Profile, word: string): string | null {
  const sk = skeleton(cls);
  const prefix = (n: number) => (n ? plain(cls.slice(0, n), o, word) + (cls[n - 1].vowel === SHEVA ? o.shevaNa : '') : '');
  const join = (p: string, name: string) => (p ? `${p}-${name}` : name);
  let m: RegExpMatchArray | null;
  if ((m = sk.match(/^([והבכלמש]{0,3})יהוה$/))) {
    const n = m[1].length;
    const elokim = cls[cls.length - 1].vowel === HIRIQ || cls[n].vowel === HSEGOL; // יֱהֹוִה после אֲדֹנָי
    return join(prefix(n), elokim ? o.names.elokim : o.names.adonai);
  }
  if ((m = sk.match(/^([והבכלמש]{0,3})אדני$/)) && cls[m[1].length + 2].vowel === QAMATS) return join(prefix(m[1].length), o.names.adonai);
  if ((m = sk.match(/^([והבכלמש]{0,3})אל(ו?)ה/))) {
    const n = m[1].length;
    const plene = m[2].length;
    const ok = plene ? !cls[n + 1].vowel && cls[n + 2].vowel === HOLAM : cls[n + 1].vowel === HOLAM;
    if (ok) return join(prefix(n), cap(plain(cls.slice(n), o, word, { holam: o.namesHolam })));
  }
  if ((m = sk.match(/^([והבכלמש]{0,2})אל(י?)$/)) && cls[m[1].length].vowel === TSERE) {
    const n = m[1].length;
    if (!m[2] || cls[n + 1].vowel === HIRIQ) return join(prefix(n), m[2] ? o.names.keli : o.names.kel);
  }
  if ((m = sk.match(/^([והבכלמש]{0,2})יה$/)) && cls[cls.length - 1].dagesh) return join(prefix(m[1].length), o.names.kah);
  if (sk === 'הללויה' && cls[cls.length - 1].dagesh) return `${plain(cls.slice(0, 4), o, word)}${o.names.kah.toLowerCase()}`;
  if (sk === 'שדי' && (cls[1].vowel === PATAH || cls[1].vowel === QAMATS)) return o.names.shaddai;
  return null;
}

/** Кусок текста между пробелами (слова через макаф — через дефис); паcек «׀» и знаки — пустая строка. */
export function translitToken(token: string, lang: ReadLang, pron: Pron = 'ash'): string {
  const o = pron === 'sef' ? SEF[lang] : PROFILES[lang];
  const parts = token.split(MAQAF);
  return parts
    .map((part, k) => {
      const cls = parse(part);
      return cls.length ? (divineName(cls, o, part) ?? plain(cls, o, part, { kol: k < parts.length - 1 })) : '';
    })
    .filter(Boolean)
    .join('-');
}

/** Стих по кускам: первое слово — с большой буквы. */
export function translitTokens(toks: string[], lang: ReadLang, pron: Pron = 'ash'): string[] {
  const out = toks.map((x) => translitToken(x, lang, pron));
  const first = out.findIndex(Boolean);
  if (first >= 0) out[first] = cap(out[first]);
  return out;
}

/** Как показывать текст: иврит / транслит крупно и иврит мелко / только транслит. */
export type TrMode = 'he' | 'duo' | 'tr';
export const TR_MODES: TrMode[] = ['he', 'duo', 'tr'];
