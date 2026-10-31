import type { MemoData } from '../types';

/**
 * Memo «Бааль ґа-Турим · Хаей Сара» — the second game of the lesson: 12 comments of the Baal HaTurim on Bereshit 23:1–25:18
 * (Kitzur Ba'al HaTurim, Sefaria), one pair of cards each — a picture (memo/NN.png — line art for print and colouring;
 * framed by scripts/memo-frame.py) and the Torah words. Texts — `memo` in i18n/<lang>.ts, same order. Every gematria
 * and letter hint is the commentary's own and is checked by `npm run check`.
 */
const memo: MemoData = {
  items: [
    {
      verse: 'חיי שרה',
      quote: 'עד שלא שקעה שמשה של שרה זרחה שמשה של רבקה',
      source: 'bht-23-1-1',
    },
    {
      verse: 'שרה מאה שנה',
      quote: 'שרה מאה שנה — ר״ת שמש: וזרח השמש ובא השמש',
      letters: [{ from: 'שרה מאה שנה', take: 'first', word: 'שמש', kind: 'rt' }],
      source: 'bht-23-1-2',
    },
    {
      verse: 'ויהיו חיי שרה',
      quote: 'מנין ויהיו היה עיקר שנותיה משנולד יצחק, דבת צ׳ היתה כשנולד',
      gematria: [{ a: 'ויהיו', v: 37 }],
      source: 'bht-23-1-3',
    },
    {
      verse: 'לעפרן',
      quote: 'לעפרן — חסר, בגימטריא עין רע; עפרן עולה ת׳ כנגד ארבע מאות שקלים',
      gematria: [{ a: 'עפרן', b: 'עין רע', v: 400 }],
      source: 'bht-23-16',
    },
    {
      verse: 'ויקם שדה עפרון',
      quote: 'ויקם שדה עפרון — ר״ת בהפך עשו, רמז לעשו שיקום לערער על המערה',
      letters: [{ from: 'ויקם שדה עפרון', take: 'first', word: 'עשו', kind: 'rt' }],
      source: 'bht-23-17',
    },
    {
      verse: 'שים נא ידך',
      quote: 'נא ידך — בגימטריא מילה, שהשביעו במילה',
      gematria: [{ a: 'נא ידך', b: 'מילה', v: 85 }],
      source: 'bht-24-2-2',
    },
    {
      verse: 'עם אדני אברהם',
      quote: 'עם אדוני אברהם — ס״ת מים: בשכר יוקח נא מעט מים ענהו על המים',
      letters: [{ from: 'עם אדני אברהם', take: 'last', word: 'מים', kind: 'st' }],
      source: 'bht-24-12',
    },
    {
      verse: 'ובה אדע',
      quote: 'ובה אדע כי עשית חסד — אם תהיה צדקת גומלת חסדים',
      source: 'bht-24-14',
    },
    {
      verse: 'עם האיש הזה',
      quote: 'עם האיש הזה — ס״ת משה, לרמז שהלך כדת משה וישראל',
      letters: [{ from: 'עם האיש הזה', take: 'last', word: 'משה', kind: 'st' }],
      source: 'bht-24-58',
    },
    {
      verse: 'את היי',
      quote: 'היי בגימטריא כה: תזכי למה שנאמר כה יהיה זרעך',
      gematria: [{ a: 'היי', b: 'כה', v: 25 }],
      source: 'bht-24-60-1',
    },
    {
      verse: 'לשוח בשדה',
      quote: 'לשוח בשדה — שיצחק תקן תפלת המנחה ואז נזדמנה לו רבקה',
      source: 'bht-24-63-1',
    },
    {
      verse: 'ויבאה יצחק האהלה',
      quote: 'ויבאה — כתיב חסר ועולה כ״ד, מלמד שקשטה בכ״ד קשוטים',
      gematria: [{ a: 'ויבאה', v: 24 }],
      source: 'bht-24-67-1',
    },
  ],
};

export default memo;
