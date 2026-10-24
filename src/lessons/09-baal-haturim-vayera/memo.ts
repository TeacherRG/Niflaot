import type { MemoData } from '../types';

/**
 * Memo «Бааль ґа-Турим · Вайера» — the second game of the lesson: 12 comments of the Baal HaTurim on Bereshit 18–22
 * (Kitzur Ba'al HaTurim, Sefaria), one pair of cards each — a picture (memo/NN.png — line art for print and colouring;
 * framed by scripts/memo-frame.py) and the Torah words. Texts — `memo` in i18n/<lang>.ts, same order. Every gematria
 * and letter hint is the commentary's own and is checked by `npm run check`.
 */
const memo: MemoData = {
  items: [
    {
      verse: 'וירא אליו ה׳',
      quote: 'וירא אליו ה׳ — ס״ת אוה, מלמד שאוה לשכון באהלו של אברהם',
      letters: [{ from: 'וירא אליו יהוה', take: 'last', word: 'אוה', kind: 'st' }],
      source: 'bht-18-1-2',
    },
    {
      verse: 'והנה שלשה',
      quote: 'והנה שלשה — בגימטריא אלו מיכאל גבריאל ורפאל',
      gematria: [{ a: 'והנה שלשה', b: 'אלו מיכאל גבריאל ורפאל', v: 701 }],
      source: 'bht-18-2',
    },
    {
      verse: 'ואקחה פת לחם',
      quote: 'היה לו לומר קחו פת לחם — מכאן רמז שבעל הבית בוצע',
      source: 'bht-18-5-1',
    },
    {
      verse: 'וסעדו לבכם',
      quote: 'שהיה מצטער על שלא באו לו אורחים… כיון שראה אלו — ושש לבכם',
      source: 'bht-18-5-2',
    },
    {
      verse: 'ואל הבקר',
      quote: 'ג׳ תגין על הקו״ף, לומר ששלש בהמות היו, ובזכות זה ניתן לו בן לק׳ שנה',
      gematria: [{ a: 'ק', v: 100 }],
      source: 'bht-18-7-1',
    },
    {
      verse: 'על פני סדם',
      quote: 'על פני סדום — ס״ת מיל, ששיעור מיל הלך עמהם לשלחם, דשיעור לויה מיל',
      letters: [{ from: 'על פני סדם', take: 'last', word: 'מיל', kind: 'st' }],
      source: 'bht-18-16-1',
    },
    {
      verse: 'ויאמרו אליו',
      quote: 'ויאמרו אליו — בגימטריא אמרו אליה איו',
      gematria: [{ a: 'ויאמרו אליו', b: 'אמרו אליה איו', v: 310 }],
      source: 'bht-18-9',
    },
    {
      verse: 'היו יהיה לגוי',
      quote: 'היו יהיה לגוי — בגימטריא ק׳: כשיהיה בן ק׳ אז יהיה לגוי גדול',
      gematria: [{ a: 'היו יהיה לגוי', v: 100 }],
      source: 'bht-18-18-2',
    },
    {
      verse: 'אשר יצוה את בניו',
      quote: 'אשר יצוה את בניו — ס״ת תורה; אשר יצוה בגימטריא ברית',
      letters: [{ from: 'אשר יצוה את בניו', take: 'last', word: 'תורה', kind: 'st' }],
      gematria: [{ a: 'אשר יצוה', b: 'ברית', v: 612 }],
      source: 'bht-18-19',
    },
    {
      verse: 'ואנכי עפר ואפר',
      quote: 'מכאן זכה לאפר פרה… ואפר בגימטריא בפרה',
      gematria: [{ a: 'ואפר', b: 'בפרה', v: 287 }],
      source: 'bht-18-27',
    },
    {
      verse: 'ולנכדי',
      quote: 'לנכדי — בגימטריא בן בני',
      gematria: [{ a: 'לנכדי', b: 'בן בני', v: 114 }],
      source: 'bht-21-23',
    },
    {
      verse: 'עקב אשר שמעת בקלי',
      quote: 'עקב אשר שמעת בקולי — ס״ת ברית',
      letters: [{ from: 'עקב אשר שמעת בקלי', take: 'last', word: 'ברית', kind: 'st' }],
      source: 'bht-22-18',
    },
  ],
};

export default memo;
