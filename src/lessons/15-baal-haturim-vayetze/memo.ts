import type { MemoData } from '../types';

/**
 * Memo «Бааль ґа-Турим · Ваеце» — the second game of the lesson: 12 comments of the Baal HaTurim on Bereshit 28:10–32:3
 * (Kitzur Ba'al HaTurim, Sefaria), one pair of cards each — a picture (memo/NN.png — line art for print and colouring,
 * drawn for now by code; framed by scripts/memo-frame.py) and the Torah words. Texts — `memo` in i18n/<lang>.ts, same order.
 * Every gematria and letter hint is the commentary's own and is checked by `npm run check`.
 */
const memo: MemoData = {
  items: [
    {
      verse: 'ויצא יעקב מבאר שבע',
      quote: 'יעקב מבאר שבע — ס״ת עבר, שנטמן בבית עבר',
      letters: [{ from: 'יעקב מבאר שבע', take: 'last', word: 'עבר', kind: 'st' }],
      source: 'bht-28-10-3',
    },
    {
      verse: 'וילך חרנה',
      quote: 'וילך בגימטריא בו ביום',
      gematria: [{ a: 'וילך', b: 'בו ביום', v: 66 }],
      source: 'bht-28-10-7',
    },
    {
      verse: 'ויפגע במקום',
      quote: 'ג׳ פעמים כתיב מקום בפסוק — רמז לג׳ רגלים שיעלו בניו למקום ההוא',
      source: 'bht-28-11-1',
    },
    {
      verse: 'כי בא השמש',
      quote: 'כי בא השמש — ר״ת כבה, שכבה מאור השמש שלא בעונתו',
      letters: [{ from: 'כי בא השמש', take: 'first', word: 'כבה', kind: 'rt' }],
      source: 'bht-28-11-2',
    },
    {
      verse: 'סלם מצב ארצה',
      quote: 'סלם בגימטריא סיני, שהראהו מעמד הר סיני',
      gematria: [{ a: 'סלם', b: 'סיני', v: 130 }],
      source: 'bht-28-12-6',
    },
    {
      verse: 'והנה סלם',
      quote: 'והנה סלם בגימטריא וקץ, שהראהו קיצי הגליות',
      gematria: [{ a: 'והנה סלם', b: 'וקץ', v: 196 }],
      source: 'bht-28-12-5',
    },
    {
      verse: 'וייקץ יעקב משנתו ויאמר',
      quote: 'וייקץ יעקב משנתו ויאמר — ס״ת צבור: אין תפלתו של אדם נשמעת אלא בצבור',
      letters: [{ from: 'וייקץ יעקב משנתו ויאמר', take: 'last', word: 'צבור', kind: 'st' }],
      source: 'bht-28-16-1',
    },
    {
      verse: 'וידר יעקב נדר',
      quote: 'וידר — הראשון שנדר היה יעקב',
      source: 'bht-28-20-1',
    },
    {
      verse: 'כי מן הבאר ההוא',
      quote: 'כי מן הבאר ההוא בגימטריא משה',
      gematria: [{ a: 'כי מן הבאר ההוא', b: 'משה', v: 345 }],
      source: 'bht-29-2-4',
    },
    {
      verse: 'וימצא דודאים בשדה',
      quote: 'דודאים בגימטריא כאדם',
      gematria: [{ a: 'דודאים', b: 'כאדם', v: 65 }],
      source: 'bht-30-14',
    },
    {
      verse: 'לכן ישכב עמך הלילה',
      quote: 'לכן בגימטריא מדה במדה',
      gematria: [{ a: 'לכן', b: 'מדה במדה', v: 100 }],
      source: 'bht-30-15-2',
    },
    {
      verse: 'כי ברח יעקב',
      quote: 'כי ברח בגימטריא עמלק',
      gematria: [{ a: 'כי ברח', b: 'עמלק', v: 240 }],
      source: 'bht-31-22-2',
    },
  ],
};

export default memo;
