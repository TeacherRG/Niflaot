import type { Lesson } from '../types';
import cards from './cards';
import ru from './i18n/ru';
import en from './i18n/en';
import de from './i18n/de';

/**
 * «Нифлаот Ребе» · Ноах, урок №1 — «Выйди из ковчега»: почему Ноаху понадобился приказ выйти, хотя земля уже высохла
 * (беседа Любавичского Ребе, Шабат Ноах 5741, 5743; «Ликутей сихот», т. 25, Ноах, беседа 3).
 * Расследование без гематрий: вопрос к стиху → ответ Ребе → вывод для жизни. Число — только люди в ковчеге (8).
 * Вторая игра — «Карточки»: 12 стихов главы и по одному объяснению Ребе к каждому (cards.ts).
 */
const lesson: Lesson = {
  slug: 'rebbe-noach',
  number: 1,
  parsha: 'noach',
  series: 'rebbe',
  kind: 'sicha',
  hebrewTitle: 'צא מן התבה',
  year: 'ה׳תשפ״ז · 5787',
  age: 11,
  heroLetters: ['נ', 'ח'],
  author: { name: 'Rabbi Menachem Mendel Schneerson, the Lubavitcher Rebbe', alternateName: 'Любавичский Ребе' },
  riddles: [
    {
      words: [],
      steps: [
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'נעשה גריד כהלכתה' }, { h: 'נעשה כמין טיט' }, { h: 'כסוה המים' }, { h: 'צמח בה עשב' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'לא נכנסתי אלא ברשות' }, { h: 'פחדתי מן המים' }, { h: 'לא ידעתי שיבשה' }, { h: 'הייתי ישן' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'עד שדחקוהו המים' }, { h: 'מיד בשמחה' }, { h: 'אחרי כל החיות' }, { h: 'כשבא העורב' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'הוציאם אתה' }, { h: 'השאר אותם בתבה' }, { h: 'צא בלעדיהם' }, { h: 'שלח אותם לים' }],
          c: 0,
        },
      ],
      equations: ['יבשה — נעשה גריד כהלכתה', 'בא אל התבה — צא מן התבה', 'הוצא — אם אינם רוצים לצאת הוציאם אתה'],
      sources: ['gen-8-13', 'gen-8-16-17', 'rashi-8-14', 'bereshit-rabbah-34-4', 'gen-7-1', 'rashi-7-7', 'rashi-8-16', 'rashi-6-18', 'rashi-8-17-2', 'rashi-8-17'],
    },
    {
      words: [],
      steps: [
        {
          t: 'ch', est: { sec: 25, level: 1 },
          opts: [{ h: 'כבש' }, { h: 'דב' }, { h: 'נמר' }, { h: 'אריה' }],
          c: 0,
        },
        // Noach and his wife, three sons and their three wives
        { t: 'num', est: { sec: 25, level: 1 }, a: 8, coach: [{ add: [1, 1, 3, 3] }] },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'מאליהן באו' }, { h: 'נח צד אותן' }, { h: 'בניו הביאום' }, { h: 'המים הביאום' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 25, level: 1 },
          opts: [{ h: 'נער קטן' }, { h: 'מלך גדול' }, { h: 'רועה זקן' }, { h: 'אריה' }],
          c: 0,
        },
      ],
      equations: ['וגר זאב עם כבש', '1 + 1 + 3 + 3 = 8', 'ונער קטן נהג בם'],
      sources: ['isaiah-11-6', 'gen-6-14', 'rashi-6-14', 'rashi-6-20'],
    },
    {
      words: [],
      steps: [
        {
          t: 'ch', est: { sec: 35, level: 2 },
          opts: [{ h: 'כמו לעתיד לבוא' }, { h: 'פחד מן הגשם' }, { h: 'לא ידע שיבשה' }, { h: 'חס על התבה' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'שוב יהיו טורפות' }, { h: 'יירטבו בגשם' }, { h: 'ילכו לאיבוד' }, { h: 'ישכחו את נח' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'פרו ורבו' }, { h: 'עשה לך תבת' }, { h: 'שלח את העורב' }, { h: 'בנה מזבח' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 20, level: 1 },
          opts: [{ h: 'את הארץ' }, { h: 'את התבה' }, { h: 'את השמים' }, { h: 'את הים' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'דירה בתחתונים' }, { h: 'היכל בשמים' }, { h: 'תבה בים' }, { h: 'גן בעדן' }],
          c: 0,
        },
      ],
      equations: ['צא מן התבה — ירידה', 'פרו ורבו ומלאו את הארץ', 'נתאוה הקב״ה להיות לו דירה בתחתונים'],
      sources: ['gen-8-16-17', 'rashi-8-17', 'gen-1-28', 'gen-9-1', 'tanya-36'],
    },
    {
      words: [],
      steps: [
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'מילה' }, { h: 'בית' }, { h: 'ספר' }, { h: 'ספינה' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 40, level: 2 },
          opts: [{ h: 'נח ובניו ואשתו ונשי בניו' }, { h: 'נח ואשתו ובניו ונשיהם' }, { h: 'נח לבדו' }, { h: 'נח והחיות' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'בהדי כבשי דרחמנא למה לך' }, { h: 'יפה עשית' }, { h: 'חכה עד שתזקין' }, { h: 'שאל את החכמים' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'יאשיהו' }, { h: 'מנשה' }, { h: 'אחאב' }, { h: 'שאול' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'עד שיכלו כל נשמות שבגוף' }, { h: 'עד שיבנה בית המקדש' }, { h: 'עד שיעשו כולם תבה' }, { h: 'עד שייבשו כל המים' }],
          c: 0,
        },
      ],
      equations: ['בא אל התבה — אל תיבות התורה והתפלה', 'ויצא נח ובניו ואשתו ונשי בניו', 'מאי דמפקדת איבעי לך למעבד', 'אין בן דוד בא עד שיכלו כל נשמות שבגוף'],
      sources: ['gen-7-1', 'gen-28-14', 'micah-2-13', 'gen-9-1', 'rashi-8-16', 'gen-8-18', 'rashi-9-9', 'berakhot-10a', 'kings2-23-25', 'gen-1-28', 'yevamot-62a'],
      // «Расчёты» — the reasoning of those who put off having children; «Новый источник пропитания» — the blessing
      // after meals (Birkat HaMazon), not in Sefaria's export
      noSource: [3, 6],
    },
  ],
  highlight: [['פרו ורבו'], ['ומלאו את הארץ']],
  // a talk of the Rebbe: no gematria calculator
  calculator: { words: [], secrets: {} },
  cards,
  texts: { ru, en, de },
};

export default lesson;
