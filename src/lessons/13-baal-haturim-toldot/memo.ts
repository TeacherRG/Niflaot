import type { MemoData } from '../types';

/**
 * Memo «Бааль ґа-Турим · Толдот» — the second game of the lesson: 12 comments of the Baal HaTurim on Bereshit 25:19–28:9
 * (Kitzur Ba'al HaTurim, Sefaria), one pair of cards each — a picture (memo/NN.png — line art for print and colouring,
 * drawn for now by code; framed by scripts/memo-frame.py) and the Torah words. Texts — `memo` in i18n/<lang>.ts, same order.
 * Every gematria and letter hint is the commentary's own and is checked by `npm run check`.
 */
const memo: MemoData = {
  items: [
    {
      verse: 'אברהם הוליד את יצחק',
      quote: 'הוליד בגימטריא דומה, שהיה זיו איקונין של יצחק דומה לאברהם',
      gematria: [{ a: 'הוליד', b: 'דומה', v: 55 }],
      source: 'bht-25-19',
    },
    {
      verse: 'לבן הארמי',
      quote: 'לבן הארמי — אותיות הרמאי',
      letters: [{ from: 'הארמי', take: 'all', word: 'הרמאי', kind: 'letters' }],
      source: 'bht-25-20-2',
    },
    {
      verse: 'ותהר רבקה אשתו',
      quote: 'אשתו בגימטריא קש ואש: והיה בית יעקב אש ובית עשו לקש',
      gematria: [{ a: 'אשתו', b: 'קש ואש', v: 707 }],
      source: 'bht-25-21-2',
    },
    {
      verse: 'ואחרי כן יצא אחיו',
      quote: 'כ״ן עולה ע׳, שע׳ אומות הן חוץ מיעקב',
      gematria: [{ a: 'כן', v: 70 }],
      source: 'bht-25-26-1',
    },
    {
      verse: 'איש תם',
      quote: 'איש תם — ס״ת שם, שישב באהלי שם ללמוד',
      letters: [{ from: 'איש תם', take: 'last', word: 'שם', kind: 'st' }],
      source: 'bht-25-27',
    },
    {
      verse: 'הלעיטני נא מן',
      quote: 'הלעיטני נא מן — ר״ת המן: כשם שיעקב קנה מעשו בכורתו בלחם ועדשים, כך קנה מרדכי את המן לעבד בפת לחם',
      letters: [{ from: 'הלעיטני נא מן', take: 'first', word: 'המן', kind: 'rt' }],
      source: 'bht-25-30',
    },
    {
      verse: 'הארצת האל',
      quote: 'הארצת — חסר וי״ו, שיתננה לו אחר ו׳ דורות: יצחק, יעקב, לוי, קהת, עמרם, משה',
      source: 'bht-26-3-2',
    },
    {
      verse: 'עקב אשר שמע אברהם בקלי',
      quote: 'עק״ב שנים שמע בקולי: בן ג׳ שנים הכיר בוראו, ושנותיו קע״ה',
      gematria: [{ a: 'עקב', v: 172 }],
      source: 'bht-26-5-1',
    },
    {
      verse: 'ויקרא שמה רחבות',
      quote: 'רחובות — כנגד יון שגזרו שלא יטבלו; ונעשה להם נס ונזדמן להם מקוה לכל אחד ואחד',
      source: 'bht-26-22',
    },
    {
      verse: 'לצוד ציד',
      quote: 'לצוד בגימטריא מן גזל',
      gematria: [{ a: 'לצוד', b: 'מן גזל', v: 130 }],
      source: 'bht-27-5-2',
    },
    {
      verse: 'וירח את ריח בגדיו',
      quote: 'וירח בגימטריא יום פסח היה; ריח בגימטריא ליל פסח',
      gematria: [
        { a: 'וירח', b: 'יום פסח היה', v: 224 },
        { a: 'ריח', b: 'ליל פסח', v: 218 },
      ],
      source: 'bht-27-27-2',
    },
    {
      verse: 'ויאמר מי אפוא',
      quote: 'ויאמר מי איפוא — ר״ת אמו: מי נעשה סרסור בדבר? רבקה',
      letters: [{ from: 'ויאמר מי אפוא', take: 'first', word: 'אמו', kind: 'rt' }],
      source: 'bht-27-33-1',
    },
  ],
};

export default memo;
