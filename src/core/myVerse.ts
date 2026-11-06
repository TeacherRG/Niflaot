/**
 * «Мой стих Торы» — вкладка ленты на главной взрослых (`MyVerseTicker.tsx`): стих, который начинается на первую букву имени
 * на иврите и кончается на последнюю, и стих, где встречается само имя (обычай — говорить его в конце Амиды).
 * Логика и данные — из «Стиха имени» курса «Тайна Коэлета» (MyLot, `koelet/pasuk.js`): имя на иврите угадывается
 * по словарю частых имён или по звукам (`hebGuess`), стихи — `koelet/data/pesukim/` (список Torat Emet
 * «פסוק המתחיל ומסתיים באות», `koelet/tools/build-pesukim.mjs`): `index.json` (книги, имя → стих) и по файлу на первую
 * букву (пара букв → стихи, первый — личный, по возможности из Торы). Сайт отдаёт их по `/koelet/data/pesukim/`.
 * Имя — только на этом устройстве (`niflaot:my-verse`).
 */

const HEB_AB = [...'אבגדהוזחטיכלמנסעפצקרשת'];
const HEB_FINAL: Record<string, string> = { כ: 'ך', מ: 'ם', נ: 'ן', פ: 'ף', צ: 'ץ' };
const HEB_BASE: Record<string, string> = { ך: 'כ', ם: 'מ', ן: 'נ', ף: 'פ', ץ: 'צ' };

/** только буквы иврита и пробелы, до 24 знаков */
export const hebOnly = (s: string) =>
  (s || '')
    .replace(/[^א-ת ]/g, '')
    .replace(/ +/g, ' ')
    .trimStart()
    .slice(0, 24);
/** конечные формы в конце слова, обычные — внутри */
export const hebFinals = (s: string) => s.replace(/[ךםןףץ](?=[א-ת])/g, (c) => HEB_BASE[c]).replace(/[כמנפצ](?=\s|$)/g, (c) => HEB_FINAL[c]);

/* частые имена: как их пишут на иврите (как в koelet/pasuk.js) */
const HEB_NAMES: [string, string][] = [
  ['אברהם', 'авраам абрам авром авраґам abraham avraham'], ['יצחק', 'исаак ицхак ицик isaac yitzchak yitzhak itzhak'],
  ['יעקב', 'яков яаков янкель яків jacob jakob yaakov yakov'], ['משה', 'моше моисей мойша moshe moses mose'],
  ['אהרן', 'аарон арон aaron aharon aron'], ['דוד', 'давид давыд david dovid'], ['שלמה', 'шломо соломон shlomo solomon salomon'],
  ['יוסף', 'иосиф йосеф иосеф осип йосип joseph josef yosef'], ['בנימין', 'вениамин беньямин веня benjamin binyamin'],
  ['מיכאל', 'михаил миша михаэль михайло michael michail mikhail misha'], ['גבריאל', 'гавриил габриэль gabriel gavriel'],
  ['רפאל', 'рафаэль raphael rafael'], ['דניאל', 'даниил даниэль данил данило даня daniel'], ['שמואל', 'самуил шмуэль samuel shmuel'],
  ['נתן', 'натан nathan natan'], ['יונה', 'иона йона jonah jona yona'], ['אליהו', 'илья элияху элияґу ілля elijah eliyahu ilya'],
  ['אלישע', 'елисей элиша elisha'], ['יוחנן', 'иван иоанн йоханан іван ivan john johann johannes yochanan'],
  ['יהודה', 'иуда иегуда йегуда йеґуда yehuda judah juda'], ['לוי', 'леви levi'], ['אריה', 'арье arie arieh aryeh'],
  ['נח', 'ной ноах noah noach'], ['חיים', 'хаим chaim haim chayim'], ['מנחם', 'менахем menachem'], ['מרדכי', 'мордехай мордух mordechai'],
  ['פנחס', 'пинхас pinchas pinhas'], ['ישראל', 'исраэль израиль israel yisrael'], ['עזרא', 'эзра ездра ezra'], ['גדעון', 'гидеон gideon'],
  ['אליעזר', 'элиэзер лазарь eliezer lazar'], ['צבי', 'цви tzvi zvi hirsch'], ['זאב', 'зеэв вольф zeev wolf volf'], ['דב', 'дов dov'],
  ['ברוך', 'барух baruch'], ['מתתיהו', 'матвей матфей matthew matthias mattityahu'], ['אורי', 'ури uri'], ['נחום', 'нахум наум nahum'],
  ['אלכסנדר', 'александр саша олександр alexander alexandr aleksandr sasha'], ['עמנואל', 'эммануил эмануэль emmanuel immanuel'],
  ['שרה', 'сара сарра sara sarah'], ['רבקה', 'ревекка ривка ребекка rebecca rebekka rivka'], ['רחל', 'рахель рахиль rachel rahel'],
  ['לאה', 'лея лия леа leah lea'], ['מרים', 'мириам мирьям мария маша маня марія miriam maria mary marie'],
  ['חנה', 'анна ханна хана аня ганна anna hannah hanna chana ann anne'], ['אסתר', 'эстер эсфирь esther ester'],
  ['דבורה', 'дебора двора deborah debora dvora'], ['יהודית', 'юдифь иегудит юдит judith yehudit'], ['רות', 'рут руфь ruth rut'],
  ['חוה', 'ева хава єва eva eve chava'], ['אביגיל', 'абигайль авигаиль abigail avigail'], ['תמר', 'тамар тамара tamar tamara'],
  ['דינה', 'дина dina dinah'], ['נעמי', 'наоми ноэми naomi noemi'], ['יעל', 'яэль yael jael'], ['שושנה', 'сусанна сюзанна шошана susanna susan shoshana'],
  ['אלישבע', 'елизавета лиза элишева єлизавета elizabeth elisabeth elisheva'], ['מלכה', 'малка malka'], ['נעה', 'ноа noa'],
  ['חיה', 'хая chaya'], ['שולמית', 'шуламит shulamit'], ['אילנה', 'илана ilana'],
];
const HEB_DICT: Record<string, string> = {};
for (const [h, v] of HEB_NAMES) for (const k of v.split(' ')) HEB_DICT[k] = h;

const SOUNDS: [string, string][] = [
  ['tsch', 'צ'], ['sch', 'ש'], ['sh', 'ש'], ['ch', 'ח'], ['kh', 'ח'], ['tz', 'צ'], ['ts', 'צ'], ['th', 'ת'], ['ph', 'פ'], ['ck', 'ק'],
  ['щ', 'ש'], ['ш', 'ש'], ['ч', 'צ'], ['ц', 'צ'], ['ж', 'ז'], ['х', 'ח'], ['ю', 'יו'], ['я', 'יא'], ['ё', 'יו'], ['й', 'י'], ['ы', 'י'], ['ь', ''], ['ъ', ''],
  ['б', 'ב'], ['в', 'ב'], ['г', 'ג'], ['ґ', 'ה'], ['д', 'ד'], ['з', 'ז'], ['и', 'י'], ['і', 'י'], ['ї', 'י'], ['к', 'ק'], ['л', 'ל'], ['м', 'מ'], ['н', 'נ'],
  ['п', 'פ'], ['р', 'ר'], ['с', 'ס'], ['т', 'ט'], ['ф', 'פ'], ['b', 'ב'], ['v', 'ב'], ['w', 'ו'], ['g', 'ג'], ['d', 'ד'], ['z', 'ז'], ['j', 'י'], ['y', 'י'],
  ['i', 'י'], ['k', 'ק'], ['c', 'ק'], ['q', 'ק'], ['l', 'ל'], ['m', 'מ'], ['n', 'נ'], ['p', 'פ'], ['f', 'פ'], ['r', 'ר'], ['s', 'ס'], ['t', 'ט'], ['x', 'קס'], ['h', 'ה'],
];

/** имя (по-русски, по-английски, по-немецки) → на иврите: из словаря, иначе по звукам — важны первая и последняя буквы */
export function hebGuess(name: string): string {
  const key = (name || '').trim().toLowerCase().replace(/ё/g, 'е').replace(/['’ʼ`-]/g, '').split(/\s+/)[0];
  if (!key) return '';
  if (/[א-ת]/.test(key)) return hebFinals(hebOnly(key));
  if (HEB_DICT[key]) return HEB_DICT[key];
  const vowel = /^[аеэоуaeouєäöü]/;
  let out = '';
  for (let i = 0; i < key.length; ) {
    const rest = key.slice(i),
      last = i === key.length - 1;
    if (vowel.test(rest)) {
      const c = rest[0];
      if (i === 0) out += /[оуou]/.test(c) ? 'או' : /[еє]/.test(c) ? 'י' : 'א';
      else if (last) out += /[аaeе]/.test(c) ? 'ה' : /[оуou]/.test(c) ? 'ו' : '';
      else if (/[оуou]/.test(c)) out += 'ו';
      i++;
      continue;
    }
    if (i === 0 && /[иі]|i/.test(rest[0])) out += 'א';
    const r = SOUNDS.find(([k]) => rest.startsWith(k));
    if (r) {
      out += r[1];
      i += r[0].length;
    } else i++;
  }
  return hebFinals(out.replace(/(.)\1/g, '$1').replace(/יא$/, 'יה'));
}

/** стих: [книга — номер в `index.json` books, глава, стих, текст] */
export type Verse = [number, number, number, string];
interface Index {
  books: string[];
  names: Record<string, Verse>;
  loose: Record<string, Verse>;
}

const baseL = (c: string) => HEB_BASE[c] || c;
const nameKey = (n: string) =>
  [...n]
    .map(baseL)
    .join('')
    .replace(/(?!^)[וי]/g, '');
const firstOf = (n: string) => HEB_AB.indexOf(baseL(n[0]));

/** книги `index.json` по порядку — как на Sefaria (для ссылки, `resolveCite`) */
export const SEFARIA_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'I Samuel', 'II Samuel', 'I Kings', 'II Kings',
  'Isaiah', 'Jeremiah', 'Ezekiel', 'Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai',
  'Zechariah', 'Malachi', 'Psalms', 'Proverbs', 'Job', 'Song of Songs', 'Ruth', 'Lamentations', 'Ecclesiastes', 'Esther', 'Daniel',
  'Ezra', 'Nehemiah', 'I Chronicles', 'II Chronicles',
];

const up = '..';
const root = () => (import.meta.env.DEV ? import.meta.env.BASE_URL : new URL(up, import.meta.url).href);
const cache: Record<string, Promise<unknown>> = {};
function load<T>(file: string): Promise<T> {
  cache[file] ??= fetch(`${root()}koelet/data/pesukim/${file}.json`)
    .then((r) => {
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    })
    .catch((e) => {
      delete cache[file];
      throw e;
    });
  return cache[file] as Promise<T>;
}
let index: Promise<Index> | null = null;
const loadIndex = () =>
  (index ??= load<Omit<Index, 'loose'>>('index').then((d) => {
    // имена без «лишних» י и ו: אהרון найдёт אהרן
    const loose: Record<string, Verse> = {};
    for (const n in d.names) {
      const k = nameKey(n);
      if (!(k in loose)) loose[k] = d.names[n];
    }
    return { ...d, loose };
  })).catch((e) => {
    index = null;
    throw e;
  });

export interface NameVerses {
  /** имя на иврите */
  name: string;
  /** первый стих пары — личный, остальные — другие стихи на эти буквы */
  pair: Verse[];
  /** стих, где встречается само имя */
  withName: Verse | null;
}
export interface MyVerses {
  books: string[];
  names: NameVerses[];
}

/** стихи для имени на иврите (до трёх слов: «חיים אריה»); ошибка загрузки — исключение */
export async function versesFor(heb: string): Promise<MyVerses> {
  const names = hebFinals(heb || '')
    .trim()
    .split(' ')
    .filter((n) => n.length >= 2 && firstOf(n) >= 0)
    .slice(0, 3);
  const [idx, ...pairs] = await Promise.all([loadIndex(), ...[...new Set(names.map(firstOf))].map((i) => load<Record<string, Verse[]>>(String(i)).then((d) => [i, d] as const))]);
  const byFirst = new Map(pairs);
  return {
    books: idx.books,
    names: names.map((n) => ({
      name: n,
      pair: byFirst.get(firstOf(n))?.[baseL(n[0]) + baseL(n.at(-1)!)] ?? [],
      withName: idx.names[hebFinals(n)] ?? idx.loose[nameKey(n)] ?? null,
    })),
  };
}

export const MY_VERSE_KEY = 'niflaot:my-verse';
export interface MyName {
  name: string;
  he: string;
}
export function readMyName(): MyName | null {
  try {
    const v = JSON.parse(localStorage.getItem(MY_VERSE_KEY) || 'null');
    return v && typeof v.he === 'string' && v.he.trim() ? { name: String(v.name ?? ''), he: v.he } : null;
  } catch {
    return null;
  }
}
export function saveMyName(v: MyName | null) {
  try {
    if (v) localStorage.setItem(MY_VERSE_KEY, JSON.stringify(v));
    else localStorage.removeItem(MY_VERSE_KEY);
  } catch {}
}
/** имя из сертификатов академии — подсказка в поле */
export function certName(): string {
  try {
    return (localStorage.getItem('niflaot:cert-name') || '').trim().split(/\s+/)[0] || '';
  } catch {
    return '';
  }
}
