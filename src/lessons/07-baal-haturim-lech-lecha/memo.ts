import type { MemoData } from '../types';

/**
 * Memo «Бааль ґа-Турим · Лех леха» — the second game of the lesson: 12 comments of the Baal HaTurim on Bereshit 12–17
 * (Kitzur Ba'al HaTurim, Sefaria), one pair of cards each — a picture (memo/NN.png — line art for print and colouring,
 * memo/color/NN.webp — the same picture in colour for the screen; framed by scripts/memo-frame.py) and the Torah words.
 * Texts — `memo` in i18n/<lang>.ts, same order. Every gematria and letter hint is the commentary's own and is checked
 * by `npm run check`. Not used, because it doesn't add up in the Torah's spelling: ומקללך אאר (428) = זה בלעם הבא לקלל בניך
 * (434) — only with the commentary's spelling אאור.
 */
const memo: MemoData = {
  items: [
    {
      verse: 'לך לך',
      quote: 'לך לך — רמז לו: כשתהיה בן מאה כמנין לך לך, אז ואעשך לגוי גדול, שנולד לו יצחק',
      gematria: [{ a: 'לך לך', v: 100 }],
      source: 'bht-12-1',
    },
    {
      verse: 'ויאמר ה׳ אל אברם',
      quote: 'פתח באמירה, בלשון שנברא בו העולם — שבעשרה מאמרות נברא העולם, וכולו לא נברא אלא בזכות אברהם',
      source: 'bht-12-1',
    },
    {
      verse: 'ואברכך ואגדלה שמך',
      quote: 'ואעשך לגוי גדול ואברכך ואגדלה שמך — ג׳ ברכות כנגד ג׳ ברכות כהנים',
      source: 'bht-12-2-3',
    },
    {
      verse: 'קח ולך',
      quote: 'קחנה בידך ולך — שאע״פ שאינו מפרש בכאן שנתן לו מתנות, ודאי נתן לו',
      source: 'bht-12-19',
    },
    {
      verse: 'איש מעל אחיו אברם',
      quote: 'ויפרדו איש מעל אחיו אברם — ס״ת שלום, לומר: כדי לעשות שלום נתפרדו',
      letters: [{ from: 'איש מעל אחיו אברם', take: 'last', word: 'שלום', kind: 'st' }],
      source: 'bht-13-11',
    },
    {
      verse: 'ובארבע עשרה שנה',
      quote: 'כשם שבאו האומות על חזקיהו ונפלו בידו, כך באו על אברהם ונפלו בידו',
      source: 'bht-14-5',
    },
    {
      verse: 'מלך שלם',
      quote: 'מלך שלם — ר״ת שם, לומר לך שזה שם בן נח',
      letters: [{ from: 'מלך שלם', take: 'first', word: 'שם', kind: 'rt' }],
      source: 'bht-14-18',
    },
    {
      verse: 'כה יהיה זרעך',
      quote: 'יהיה — בגימטריא שלשים, לומר לך שאין דור שאין בו ל׳ צדיקים',
      gematria: [{ a: 'יהיה', v: 30 }],
      source: 'bht-15-5-2',
    },
    {
      verse: 'כי גר יהיה זרעך',
      quote: 'כי גר — סופי תיבות עולה למנין רד״ו',
      gematria: [{ a: 'רדו', v: 210 }],
      source: 'bht-15-13',
    },
    {
      verse: 'על עין המים',
      quote: 'על עין המים — שטוב הוא להתפלל על המים, וכן התפלה נמשלה למים, דכתיב: שפכי כמים לבך',
      source: 'bht-16-7',
    },
    {
      verse: 'אב המון',
      quote: 'שני פעמים אב המון בפרשה, והוא עולה בחשבון יצחק. וכן ארבה בגימטריא יצחק',
      gematria: [
        { a: 'אב המון', v: 104 },
        { a: 'ארבה', b: 'יצחק', v: 208 },
      ],
      source: 'bht-17-4',
    },
    {
      verse: 'ואת בריתי אקים',
      quote: 'אקים — נוטריקון: אשר קידש ידיד מבטן',
      letters: [{ from: 'אשר קידש ידיד מבטן', take: 'first', word: 'אקים', kind: 'notarikon' }],
      source: 'bht-17-21',
    },
  ],
};

export default memo;
