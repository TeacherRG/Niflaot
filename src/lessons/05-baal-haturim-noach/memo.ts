import type { MemoData } from '../types';

/**
 * Memo «Бааль ґа-Турим · Ноах» — the second game of the lesson: 12 comments of the Baal HaTurim on Bereshit 6–11
 * (Kitzur Ba'al HaTurim, Sefaria), one pair of cards each — a picture (memo/NN.png, framed by scripts/memo-frame.py)
 * and the Torah words. Texts — `memo` in i18n/<lang>.ts, same order.
 * Every gematria and letter hint is the commentary's own and is checked by `npm run check`.
 * A gematria that doesn't add up in our spelling is not used (וארובות השמים 1016 ≠ שלקח שני כוכבים מכימה 1011 — pair 8 is
 * the 17th = טוב of the same comment); שפה אחת (794) = לשון הקדש (795) only with the kolel — the texts say so.
 */
const memo: MemoData = {
  items: [
    {
      verse: 'אלה תולדת נח נח',
      quote: 'נח נח — ג׳ פעמים כתיב נח בפסוק, שראה ג׳ עולמות',
      source: 'bht-6-9',
    },
    {
      verse: 'את האלהים התהלך נח',
      quote: 'את האלהים התהלך נח — ס״ת חכם, וזה שנאמר: ולוקח נפשות חכם',
      letters: [{ from: 'האלהים התהלך נח', take: 'last', word: 'חכם', kind: 'st' }],
      source: 'bht-6-9',
    },
    {
      verse: 'ותמלא הארץ חמס',
      quote: 'חמס — בגימטריא מי נח, מלמד שפרע להם מדה במדה. חמס בגימטריא גיהנם, מלמד שברותחין נדונו',
      gematria: [
        { a: 'חמס', b: 'מי נח', v: 108 },
        { a: 'חמס', b: 'גיהנם', v: 108 },
      ],
      source: 'bht-6-11-2',
    },
    {
      verse: 'קץ כל בשר',
      quote: 'קץ כל בשר — רמז לו לימי המבול, שהם כמנין קץ: מ׳ יום של מטר וק״ן של תגבורת',
      gematria: [{ a: 'קץ', v: 190 }],
      source: 'bht-6-13-1',
    },
    {
      verse: 'משחיתם את הארץ',
      quote: 'משחיתם את הארץ — ר״ת מאה, לומר לך שהשחית קומתן שהיתה גבוהה מאה אמה',
      letters: [{ from: 'משחיתם את הארץ', take: 'first', word: 'מאה', kind: 'rt' }],
      source: 'bht-6-13-6',
    },
    {
      verse: 'צהר תעשה לתבה',
      quote: 'צהר — בגימטריא לאור האבן',
      gematria: [{ a: 'צהר', b: 'לאור האבן', v: 295 }],
      source: 'bht-6-16-1',
    },
    {
      verse: 'ויהי לשבעת הימים',
      quote: 'לשבעת הימים — בגימטריא לימי אבל מתושלח',
      gematria: [{ a: 'לשבעת הימים', b: 'לימי אבל מתושלח', v: 907 }],
      source: 'bht-7-10',
    },
    {
      verse: 'בשבעה עשר יום לחדש',
      quote: 'בשבעה עשר יום לחודש — וזה יבלו בטוב ימיהם: כמנין טוב לחודש ירד המבול',
      gematria: [{ a: 'טוב', v: 17 }],
      source: 'bht-7-11',
    },
    {
      verse: 'וישאר אך נח',
      quote: 'אך נח — בגימטריא עוג',
      gematria: [{ a: 'אך נח', b: 'עוג', v: 79 }],
      source: 'bht-7-23',
    },
    {
      verse: 'מקים את בריתי אתכם',
      quote: 'מקים את בריתי אתכם — ס״ת מתים, רמז לתחיית המתים',
      letters: [{ from: 'מקים את בריתי אתכם', take: 'last', word: 'מתים', kind: 'st' }],
      source: 'bht-9-9',
    },
    {
      verse: 'וישת מן היין',
      quote: 'היין — בגימטריא יללה. ויתגל — אותיות גליות, שגלו בראש גולים על ידי היין',
      gematria: [{ a: 'היין', b: 'יללה', v: 75 }],
      letters: [{ from: 'ויתגל', take: 'all', word: 'גליות', kind: 'letters' }],
      source: 'bht-9-21',
    },
    {
      verse: 'שפה אחת',
      quote: 'שפה אחת — בגימטריא לשון הקדש',
      source: 'bht-11-1-2',
    },
  ],
};

export default memo;
