/**
 * «Святой язык» — часть «Чтение» (`track: 'read'`), между «Буквами» и словами (отзыв ученика, 10.11.2026: «после букв сразу
 * слова, а читать их не учат; уроков на огласовки нет»):
 *  - «Огласовки» — 2 юнита (`nk-1`: а, э, и; `nk-2`: о, у, шва и хатафы): знак под буквой א, его название и звук;
 *  - «Слоги» — 5 юнитов (`sy-N`): буква + огласовка (בָּ — ба), урок — одна буква с пятью огласовками;
 *  - «Читаем слова» — 3 юнита (`rw-N`): частые слова Танаха из 2–3 слогов — как читается, найти слово по чтению,
 *    собрать слово из слогов (`syllables`).
 * Чтение — `readHebrew` (src/core/translit.ts: современное чтение, ru — ґ, х; en — как chabad.org; de — как de.chabad.org).
 * У элемента части: `tr` — название знака / чтение слога или слова, `sound` — звук знака, `mean` — перевод слова.
 */
import type { Locale } from '../i18n/config';
import type { Dict } from './words';
import type { Item, Unit } from './lashon';
import { readHebrew, type ReadLang } from './translit';

const lang = (l: Locale): ReadLang => (l === 'en' || l === 'de' ? l : 'ru');

// ——— огласовки ———

type VowelId = 'kamatz' | 'patach' | 'tzere' | 'segol' | 'chirik' | 'chirikMale' | 'cholam' | 'cholamMale' | 'shuruk' | 'kubutz' | 'sheva' | 'chatafPatach' | 'chatafSegol' | 'chatafKamatz';
/** знак — на букве א (у «полных» — с ו / י), звук: a e i o u, `-` — шва */
const VOWELS: [VowelId, string, string][] = [
  ['kamatz', 'אָ', 'a'],
  ['patach', 'אַ', 'a'],
  ['tzere', 'אֵ', 'e'],
  ['segol', 'אֶ', 'e'],
  ['chirik', 'אִ', 'i'],
  ['chirikMale', 'אִי', 'i'],
  ['cholam', 'אֹ', 'o'],
  ['cholamMale', 'אוֹ', 'o'],
  ['shuruk', 'אוּ', 'u'],
  ['kubutz', 'אֻ', 'u'],
  ['sheva', 'אְ', '-'],
  ['chatafPatach', 'אֲ', 'a'],
  ['chatafSegol', 'אֱ', 'e'],
  ['chatafKamatz', 'אֳ', 'o'],
];
const NK_UNITS: VowelId[][] = [
  ['kamatz', 'patach', 'tzere', 'segol', 'chirik', 'chirikMale'],
  ['cholam', 'cholamMale', 'shuruk', 'kubutz', 'sheva', 'chatafPatach', 'chatafSegol', 'chatafKamatz'],
];
const NAMES: Record<Locale, Record<VowelId, string>> = {
  ru: { kamatz: 'камац', patach: 'патах', tzere: 'цере', segol: 'сегол', chirik: 'хирик', chirikMale: 'хирик малэ', cholam: 'холам', cholamMale: 'холам малэ', shuruk: 'шурук', kubutz: 'кубуц', sheva: 'шва', chatafPatach: 'хатаф-патах', chatafSegol: 'хатаф-сегол', chatafKamatz: 'хатаф-камац' },
  en: { kamatz: 'kamatz', patach: 'patach', tzere: 'tzeirei', segol: 'segol', chirik: 'chirik', chirikMale: 'chirik male', cholam: 'cholam', cholamMale: 'cholam male', shuruk: 'shuruk', kubutz: 'kubutz', sheva: 'sheva', chatafPatach: 'chataf patach', chatafSegol: 'chataf segol', chatafKamatz: 'chataf kamatz' },
  de: { kamatz: 'Kamaz', patach: 'Patach', tzere: 'Zere', segol: 'Segol', chirik: 'Chirik', chirikMale: 'Chirik male', cholam: 'Cholam', cholamMale: 'Cholam male', shuruk: 'Schuruk', kubutz: 'Kubuz', sheva: 'Schwa', chatafPatach: 'Chataf Patach', chatafSegol: 'Chataf Segol', chatafKamatz: 'Chataf Kamaz' },
};
const SOUND: Record<Locale, Record<string, string>> = {
  ru: { a: 'а', e: 'э', i: 'и', o: 'о', u: 'у', '-': 'краткое «э» или не читается' },
  en: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u', '-': 'a short «e» or silent' },
  de: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u', '-': 'kurzes „e“ oder stumm' },
};
/** примечание к знаку (на экране знакомства) */
const NOTE: Record<Locale, Partial<Record<VowelId, string>>> = {
  ru: {
    kamatz: 'Так читают в Израиле; в ашкеназском чтении (Теґилим, молитва в Хабаде) камац — «о».',
    chirikMale: 'Буква י после хирика не читается — она только подсказывает «и».',
    cholamMale: 'Точка над ו: ו не читается, это «о».',
    shuruk: 'Точка внутри ו: ו не читается, это «у».',
    sheva: 'В начале слова шва читается коротким «э» (בְּרֵאשִׁית — берешит), в конце слога — молчит (מִדְבָּר — мидбар).',
    chatafPatach: 'Хатаф — короткая огласовка: шва вместе с патахом.',
  },
  en: {
    kamatz: 'As read in Israel; in the Ashkenazi reading (Tehillim, prayer in Chabad) the kamatz is «o».',
    chirikMale: 'The י after a chirik is not read — it only shows the «i».',
    cholamMale: 'A dot over the ו: the ו is not read, it is «o».',
    shuruk: 'A dot inside the ו: the ו is not read, it is «u».',
    sheva: 'At the start of a word a sheva is a short «e» (בְּרֵאשִׁית — bereshit), at the end of a syllable it is silent (מִדְבָּר — midbar).',
    chatafPatach: 'A chataf is a short vowel: a sheva together with a patach.',
  },
  de: {
    kamatz: 'So liest man in Israel; in der aschkenasischen Lesung (Tehillim, Gebet bei Chabad) ist Kamaz ein „o“.',
    chirikMale: 'Das י nach einem Chirik liest man nicht — es zeigt nur das „i“.',
    cholamMale: 'Ein Punkt über dem ו: Das ו liest man nicht, es ist ein „o“.',
    shuruk: 'Ein Punkt im ו: Das ו liest man nicht, es ist ein „u“.',
    sheva: 'Am Wortanfang ist Schwa ein kurzes „e“ (בְּרֵאשִׁית — bereschit), am Silbenende ist es stumm (מִדְבָּר — midbar).',
    chatafPatach: 'Chataf ist ein kurzer Vokal: Schwa zusammen mit Patach.',
  },
};
/** примеры знака: три слога с ним (хатафы — под горловыми буквами) и как они читаются */
function examples(he: string, l: Locale): [string, string] {
  const mark = he.slice(1);
  if (mark === '\u05B0') return ['בְּרֵאשִׁית', readHebrew('בְּרֵאשִׁית', lang(l))];
  const s = (/[\u05B1-\u05B3]/.test(mark) ? ['ה', 'ח', 'ע'] : ['בּ', 'מ', 'ל']).map((c) => c + mark);
  return [s.join(' '), s.map((x) => readHebrew(x, lang(l))).join(', ')];
}

export function vowelUnits(locale: Locale): Unit[] {
  const all = VOWELS.map(([id, he, s]): Item => ({ key: `nk:${id}`, he, tr: NAMES[locale][id], sound: SOUND[locale][s], note: NOTE[locale][id], examples: examples(he, locale) }));
  return NK_UNITS.map((ids, i) => ({ id: `nk-${i + 1}`, track: 'read', n: i + 1, items: ids.map((id) => all.find((x) => x.key === `nk:${id}`)!), size: i ? 4 : 6, pool: all }));
}

// ——— слоги ———

/** буквы юнитов слогов: א — просто огласовка; с точкой (дагеш) и без — разные звуки (בּ — б, ב — в) */
const SY_UNITS = [
  ['א', 'בּ', 'מ', 'ל'],
  ['שׁ', 'ד', 'נ', 'ר', 'ת'],
  ['ג', 'ק', 'ס', 'ז', 'ט'],
  ['כּ', 'פּ', 'ה', 'י', 'צ'],
  ['ב', 'כ', 'פ', 'ח', 'שׂ', 'ע'],
];
/** пять звуков: камац, цере, хирик, холам, кубуц */
const SY_MARKS = ['ָ', 'ֵ', 'ִ', 'ֹ', 'ֻ'];

export function syllableUnits(locale: Locale): Unit[] {
  const units = SY_UNITS.map((ls) => ls.flatMap((c) => SY_MARKS.map((m): Item => ({ key: `sy:${c}${m}`, he: c + m, tr: readHebrew(c + m, lang(locale)) }))));
  const all = units.flat();
  return units.map((items, i) => ({ id: `sy-${i + 1}`, track: 'read', n: i + 1, items, size: 5, pool: all }));
}

// ——— слова из слогов ———

const POINT = /[ֱ-ׇֻ]/; // огласовка (не шва, не дагеш, не точки ש)
const isVowelCluster = (c: string) => POINT.test(c) || /^וּ$/.test(c);
/**
 * Слоги слова: буква с огласовкой начинает слог; буква без огласовки (и с шва в конце слога) закрывает его; шва в начале
 * слова и после закрытого слога — «подвижное», идёт к следующему слогу (בְּרֵא שִׁית). Холам и шурук на ו после буквы без
 * огласовки — огласовка этой буквы (לוֹ, כוּ). Знаки кантилляции и метег не мешают.
 */
export function syllables(he: string): string[] {
  const cl = he.match(/[\u05D0-\u05EA][\u0591-\u05C7]*/g) ?? [];
  const out: { c: string[]; v: boolean; closed: boolean }[] = [];
  for (const c of cl) {
    const cur = out[out.length - 1];
    const sheva = c.includes('\u05B0');
    if (/^ו[\u05B9\u05BC]$/.test(c) && cur?.closed && !isVowelCluster(cur.c[cur.c.length - 1]) && !cur.c[cur.c.length - 1].includes('\u05B0')) {
      // holam male / shuruk: the ו is the vowel of the letter before it (שָׁ | לוֹם)
      const prev = cur.c.pop()!;
      cur.closed = cur.c.length > 1 && cur.c.slice(1).some((x) => !isVowelCluster(x));
      out.push({ c: [prev, c], v: true, closed: false });
    } else if (isVowelCluster(c)) {
      if (cur && !cur.v) (cur.c.push(c), (cur.v = true));
      else out.push({ c: [c], v: true, closed: false });
    } else if (sheva && (!cur || cur.closed)) out.push({ c: [c], v: false, closed: false });
    else if (cur) (cur.c.push(c), cur.v && (cur.closed = true));
    else out.push({ c: [c], v: false, closed: false });
  }
  return out.map((x) => x.c.join(''));
}

/** «Читаем слова»: 3 юнита по 12 — сначала слова из двух слогов, потом из трёх; по частоте */
export const RW_UNITS = 3;
export const RW_SIZE = 12;
/** Имена и слова, которые читаются не по буквам (כָּל — коль, Имена) */
const RW_SKIP = new Set(['430', '3068', '410', '136', '3605', '3478', '3063']);
export function readWordUnits(dict: Dict, locale: Locale): Unit[] {
  const ok = dict.words
    .filter((w) => dict.tr[w.id] && !RW_SKIP.has(w.id) && /^[א-תְ-ּׁׂ]+$/.test(w.he))
    .map((w) => ({ w, syl: syllables(w.he), read: readHebrew(w.he, lang(locale)) }))
    // a «furtive» patach at the end (רוּחַ — ruach) is read before its letter: not a word to build by syllables
    .filter((x) => x.read && x.syl.every((s) => /[ֱ-ֻ]|וּ/.test(s)) && !/[חעה]ּ?ַ$/.test(x.w.he))
    // one reading — one word (עַיִן and אַיִן are both «ayin»)
    .filter((x, i, a) => a.findIndex((y) => y.read === x.read) === i);
  const two = ok.filter((x) => x.syl.length === 2);
  const three = ok.filter((x) => x.syl.length === 3);
  const take = [...two.slice(0, RW_SIZE * 2), ...three.slice(0, RW_SIZE)];
  const items = take.map(({ w, read }): Item => ({ key: `rw:${w.id}`, he: w.he, tr: read, mean: dict.tr[w.id] }));
  const units: Unit[] = [];
  for (let g = 0; g < RW_UNITS; g++) {
    const list = items.slice(g * RW_SIZE, (g + 1) * RW_SIZE);
    if (list.length) units.push({ id: `rw-${g + 1}`, track: 'read', n: g + 1, items: list, size: 4, pool: items });
  }
  return units;
}

/** вид юнита части «Чтение» — по его элементам (`nk:`, `sy:`, `rw:`), так и у урока «Трудные» */
export const readKind = (u: { items: { key: string }[] }): 'nk' | 'sy' | 'rw' => (u.items[0]?.key.slice(0, 2) ?? 'nk') as 'nk' | 'sy' | 'rw';

// ——— транслит первых слов Танаха ———

/** у первых слов Танаха (по частоте) в уроках — как они читаются */
export const TRANSLIT_WORDS = 500;
export const wordTranslit = (he: string, locale: Locale) => (/[׳\-־]/.test(he) ? undefined : readHebrew(he, lang(locale)) || undefined);
