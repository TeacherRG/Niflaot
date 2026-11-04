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
 */
import type { ReadLang } from './translit';

type Profile = {
  qamats: string;
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
    qamats: 'о', holam: 'ой', tsere: 'ей', segol: 'е', patah: 'а', hiriq: 'и', qubuts: 'у', shuruq: 'у', shevaNa: 'е', namesHolam: 'о',
    cons: { ב: ['б', 'в'], ג: 'г', ד: 'д', ה: 'ґ', ו: 'в', ז: 'з', ח: 'х', ט: 'т', י: 'й', כ: ['к', 'х'], ל: 'л', מ: 'м', נ: 'н',
      ס: 'с', פ: ['п', 'ф'], צ: 'ц', ק: 'к', ר: 'р', שׁ: 'ш', שׂ: 'с', ת: ['т', 'с'] },
    k: 'к', finalYod: 'й', apostrophe: false,
    names: { adonai: 'Адойной', elokim: 'Элоґим', kel: 'Эйл', keli: 'Эйли', kah: 'Йо', shaddai: 'Шадай' },
  },
  en: {
    qamats: 'o', holam: 'o', tsere: 'ei', segol: 'e', patah: 'a', hiriq: 'i', qubuts: 'u', shuruq: 'u', shevaNa: 'e', namesHolam: 'o',
    cons: { ב: ['b', 'v'], ג: 'g', ד: 'd', ה: 'h', ו: 'v', ז: 'z', ח: 'ch', ט: 't', י: 'y', כ: ['k', 'ch'], ל: 'l', מ: 'm', נ: 'n',
      ס: 's', פ: ['p', 'f'], צ: 'tz', ק: 'k', ר: 'r', שׁ: 'sh', שׂ: 's', ת: ['t', 's'] },
    k: 'k', finalYod: 'i', apostrophe: true,
    names: { adonai: 'Adonoi', elokim: 'Elohim', kel: 'Eil', keli: 'Eili', kah: 'Yo', shaddai: 'Shadai' },
  },
  de: {
    qamats: 'o', holam: 'o', tsere: 'ej', segol: 'e', patah: 'a', hiriq: 'i', qubuts: 'u', shuruq: 'u', shevaNa: 'e', namesHolam: 'o',
    cons: { ב: ['b', 'w'], ג: 'g', ד: 'd', ה: 'h', ו: 'w', ז: 's', ח: 'ch', ט: 't', י: 'j', כ: ['k', 'ch'], ל: 'l', מ: 'm', נ: 'n',
      ס: 's', פ: ['p', 'f'], צ: 'z', ק: 'k', ר: 'r', שׁ: 'sch', שׂ: 's', ת: ['t', 's'] },
    k: 'k', finalYod: 'j', apostrophe: true,
    names: { adonai: 'Adonoj', elokim: 'Elohim', kel: 'Ejl', keli: 'Ejli', kah: 'Jo', shaddai: 'Schadaj' },
  },
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

function plain(cls: Cl[], o: Profile, word: string, opts: { holam?: string } = {}): string {
  let s = '';
  const vowelOf = (v: string | null): string => {
    switch (v) {
      case HSEGOL: case SEGOL: return o.segol;
      case HPATAH: case PATAH: return o.patah;
      case HQAMATS: case QAMATS: case QAMATS_QATAN: return o.qamats;
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
export function translitToken(token: string, lang: ReadLang): string {
  const o = PROFILES[lang];
  return token
    .split(MAQAF)
    .map((part) => {
      const cls = parse(part);
      return cls.length ? (divineName(cls, o, part) ?? plain(cls, o, part)) : '';
    })
    .filter(Boolean)
    .join('-');
}

/** Стих по кускам: первое слово — с большой буквы. */
export function translitTokens(toks: string[], lang: ReadLang): string[] {
  const out = toks.map((x) => translitToken(x, lang));
  const first = out.findIndex(Boolean);
  if (first >= 0) out[first] = cap(out[first]);
  return out;
}

/** Как показывать текст: иврит / транслит крупно и иврит мелко / только транслит. */
export type TrMode = 'he' | 'duo' | 'tr';
export const TR_MODES: TrMode[] = ['he', 'duo', 'tr'];
