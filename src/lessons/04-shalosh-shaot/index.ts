import type { Lesson } from '../types';
import cards from './cards';
import ru from './i18n/ru';
import en from './i18n/en';
import de from './i18n/de';

/**
 * «Нифлаот Ребе» · Берешит, урок №1 — «Три часа»: почему Адам не выдержал запрета всего на три часа
 * (беседа Любавичского Ребе, Симхат Тора 5723; «Ликутей сихот», т. 3, Берешит).
 * Расследование без гиматрий: вопрос к стиху → ответ Ребе → вывод для дома. Числа — только часы дня (Санедрин 38б).
 * Вторая игра — «Карточки»: 12 стихов главы и по одному объяснению Ребе к каждому (cards.ts).
 */
const lesson: Lesson = {
  slug: 'shalosh-shaot',
  number: 1,
  parsha: 'bereshit',
  series: 'rebbe',
  kind: 'sicha',
  hebrewTitle: 'שלש שעות',
  year: 'ה׳תשפ״ז · 5787',
  age: 11,
  heroLetters: ['ג', 'ש'],
  author: { name: 'Rabbi Menachem Mendel Schneerson, the Lubavitcher Rebbe', alternateName: 'Любавичский Ребе' },
  riddles: [
    {
      words: [],
      steps: [
        // the command came in the 9th hour; the day has 12 — then Shabbat, and the prohibition ends
        { t: 'num', est: { sec: 25, level: 1 }, a: 3, coach: [{ sub: [12, 9] }] },
        // commanded in the 9th hour, sinned in the 10th
        { t: 'num', est: { sec: 25, level: 1 }, a: 1, coach: [{ sub: [10, 9] }] },
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'ערלה' }, { h: 'שמיטה' }, { h: 'יובל' }, { h: 'שבת' }],
          c: 0,
        },
      ],
      equations: ['12 − 9 = 3', '10 − 9 = 1', 'לא יכולת לעמוד בצוויך אפילו שעה אחת'],
      sources: ['gen-2-17', 'sanhedrin-38b', 'bereshit-rabbah-21-7', 'bereshit-rabbah-24-5', 'shabbat-63a'],
    },
    {
      words: [],
      steps: [
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'לעבור על רצון ה׳' }, { h: 'ליהנות' }, { h: 'לנוח' }, { h: 'להצליח' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'יצרו' }, { h: 'שכרו' }, { h: 'כבודו' }, { h: 'חלקו' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'זהיר' }, { h: 'שמח' }, { h: 'עשיר' }, { h: 'גבור' }],
          c: 0,
        },
      ],
      equations: ['כל הגדול מחבירו יצרו גדול הימנו', 'אבוך במאי זהיר טפי', 'זהיר — זוהר'],
      sources: ['sukkah-52a', 'shabbat-118b', 'tanya-ih-7'],
    },
    {
      words: [],
      steps: [
        {
          t: 'ch', est: { sec: 40, level: 1 },
          opts: [{ h: 'ולא תגעו בו' }, { h: 'לא תאכל ממנו' }, { h: 'מעץ הדעת' }, { h: 'טוב ורע' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [{ h: 'הנשים' }, { h: 'האנשים' }, { h: 'הזקנים' }, { h: 'הכהנים' }],
          c: 0,
        },
        {
          t: 'ch', est: { sec: 30, level: 2 },
          opts: [{ h: 'מקדם' }, { h: 'היום' }, { h: 'לעולם' }, { h: 'עכשיו' }],
          c: 0,
        },
      ],
      equations: ['ולא תגעו בו', 'כה תאמר לבית יעקב — אלו הנשים', 'כשמחך יצירך בגן עדן מקדם'],
      sources: ['gen-2-17', 'gen-3-3', 'gen-2-21', 'bereshit-rabbah-19-3', 'ex-19-3', 'shemot-rabbah-28-2', 'ez-11-16', 'ex-25-8', 'ps-113-9', 'prov-3-17', 'niddah-45b', 'ketubot-8a'],
    },
  ],
  highlight: [['כל הגדול מחבירו'], ['יצרו גדול הימנו']],
  // a talk of the Rebbe: no gematria calculator
  calculator: { words: [], secrets: {} },
  cards,
  texts: { ru, en, de },
};

export default lesson;
