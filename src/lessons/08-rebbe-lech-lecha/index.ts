import type { Lesson } from '../types';
import cards from './cards';
import ru from './i18n/ru';
import en from './i18n/en';
import de from './i18n/de';

/**
 * «Нифлаот Ребе» · Лех леха, урок №1 — «Отец множества народов»: две беседы Любавичского Ребе из недельного цикла
 * «Ликутей сихот». Загадки 1–2 — т. 25, Лех леха 3 (Шабат Лех леха 5744): почему буква ר осталась в имени Авраґам,
 * а י из имени Сарай ушла к Йеґошуа. Загадки 3–4 — т. 30, Лех леха 1 (7 мар-хешвана 5746): три жертвенника Авраґама
 * и почему Раши не объясняет третий, в Хевроне. Расследование без гематрий; число — только виды жертв (4 − 1 = 3).
 * Вторая игра — «Карточки»: 12 стихов главы и по одному объяснению Ребе к каждому (cards.ts).
 */
const lesson: Lesson = {
  slug: 'rebbe-lech-lecha',
  number: 1,
  parsha: 'lech-lecha',
  series: 'rebbe',
  kind: 'sicha',
  hebrewTitle: 'אב המון גוים',
  year: 'ה׳תשפ״ז · 5787',
  age: 11,
  heroLetters: ['ר', 'י'],
  author: { name: 'Rabbi Menachem Mendel Schneerson, the Lubavitcher Rebbe', alternateName: 'Любавичский Ребе' },
  riddles: [
    {
      words: [],
      steps: [
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'לשון נוטריקון של שמו' }, { h: 'שם חדש בלי טעם' }, { h: 'לשון תרגום' }, { h: 'שם עירו' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 25, level: 1 },
          opts: [{ h: 'ר' }, { h: 'א' }, { h: 'ב' }, { h: 'ה' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'נתרעמה על השכינה' }, { h: 'נשכחה' }, { h: 'נעשתה ה״א' }, { h: 'נכתבה פעמים' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 25, level: 1 },
          opts: [{ h: 'ליהושע' }, { h: 'ליצחק' }, { h: 'לישראל' }, { h: 'ליהודה' }],
          c: 0,
        },
      ],
      equations: ['אברם — אברהם', 'כי אב המון גוים — לשון נוטריקון של שמו', 'רי״ש… לא זזה ממקומה', 'יו״ד של שרי — ליהושע'],
      sources: ['gen-17-5', 'rashi-17-5', 'gen-17-15', 'numbers-13-16', 'berakhot-13a'],
    },
    {
      words: [],
      steps: [
        {
          t: 'ch', est: { sec: 25, level: 1 },
          opts: [{ h: 'אב לארם' }, { h: 'אב לכל העולם' }, { h: 'אב לכנען' }, { h: 'אב לבניו' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 35, level: 2 },
          opts: [{ h: 'כלול בו' }, { h: 'סותר אותו' }, { h: 'אין ביניהם קשר' }, { h: 'גדול ממנו' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'שרי לי ולא לאחרים' }, { h: 'שרה על כל' }, { h: 'שרה לאומתה' }, { h: 'שרה על אברהם' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'כל אשר תאמר אליך שרה שמע בקלה' }, { h: 'אל תשמע בקולה' }, { h: 'שלחה' }, { h: 'והוא ימשל בך' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 35, level: 2 },
          opts: [{ h: 'נוספה ליהושע' }, { h: 'נשארה בשרה' }, { h: 'נמחקה' }, { h: 'ניתנה לאברהם' }],
          c: 0,
        },
      ],
      equations: ['אב לארם — אב לכל העולם', 'שרי — לי ולא לאחרים', 'שרה — שתהא שרה על כל', 'כל אשר תאמר אליך שרה שמע בקלה'],
      sources: ['rashi-17-5', 'numbers-13-16', 'rashi-17-15', 'berakhot-13a', 'gen-17-15', 'gen-3-16', 'gen-21-12', 'bava-metzia-71a'],
    },
    {
      words: [],
      steps: [
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'על בשורת הזרע ועל בשורת ארץ ישראל' }, { h: 'לקנינה' }, { h: 'שלא יפלו בניו' }, { h: 'לכבוד המלך' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'עון עכן' }, { h: 'חטא העגל' }, { h: 'דור המבול' }, { h: 'מכירת יוסף' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 40, level: 2 },
          opts: [{ h: 'כי לך אתננה' }, { h: 'לא התהלך בה' }, { h: 'כבר קנה אותה' }, { h: 'אין שם מקום' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'וישב' }, { h: 'נולד' }, { h: 'נלחם' }, { h: 'נימול' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 35, level: 2 },
          opts: [{ h: 'מחבב' }, { h: 'מזין' }, { h: 'מכפר' }, { h: 'מזיח' }],
          c: 0,
        },
        // Rambam's four kinds of offerings; chatat and asham both atone — the Midrash counts three
        { t: 'num', est: { sec: 25, level: 1 }, a: 3, coach: [{ sub: [4, 1] }] },
      ],
      equations: ['מזבח — מזיח ומזין מחבב מכפר', 'שלמים · חטאת ואשם · עולה', '4 − 1 = 3'],
      sources: ['gen-12-7', 'gen-12-8', 'gen-13-18', 'bereshit-rabbah-39-16', 'rashi-12-7', 'rashi-12-8', 'gen-13-17', 'gen-12-9', 'tanchuma-lech-lecha-9', 'ketubot-10b'],
    },
    {
      words: [],
      steps: [
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'המזבח שבחברון' }, { h: 'המזבח שבשכם' }, { h: 'המזבח שבעי' }, { h: 'המזבח שבהר המוריה' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 25, level: 1 },
          opts: [{ h: 'עולה' }, { h: 'שלמים' }, { h: 'חטאת' }, { h: 'אשם' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 25, level: 2 },
          opts: [{ h: 'חיבור' }, { h: 'מלחמה' }, { h: 'מנוחה' }, { h: 'גבורה' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 25, level: 1 },
          opts: [{ h: 'בית המקדש השלישי' }, { h: 'בית המקדש הראשון' }, { h: 'בית המקדש השני' }, { h: 'המשכן' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 20, level: 1 },
          opts: [{ h: 'דוד' }, { h: 'שאול' }, { h: 'שלמה' }, { h: 'יהושע' }],
          c: 0,
        },
      ],
      equations: ['ויבן שם מזבח לה׳', 'חברון — חיבור', 'מקדש ראשון · שני · שלישי', 'ועבדי דוד מלך עליהם'],
      sources: ['gen-13-18', 'samuel2-5-3', 'ezekiel-37-24', 'chagigah-2a', 'lev-18-5', 'rashi-12-7', 'rashi-12-8', 'isaiah-52-8'],
      // «Царство Давида» — the ruling of the Rambam and the Midrashim, not in Sefaria's export as quoted
      noSource: [5],
    },
  ],
  highlight: [['כי אב המון גוים'], ['לא זזה ממקומה']],
  // a talk of the Rebbe: no gematria calculator
  calculator: { words: [], secrets: {} },
  cards,
  texts: { ru, en, de },
};

export default lesson;
