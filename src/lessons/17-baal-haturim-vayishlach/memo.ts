import type { MemoData } from '../types';

/**
 * Memo «Бааль ґа-Турим · Ваишлах» — the second game of the lesson: 12 comments of the Baal HaTurim on Bereshit 32:4–33:9
 * (Kitzur Ba'al HaTurim, Sefaria), one pair of cards each — a picture (memo/NN.png — line art for print and colouring,
 * drawn for now by code; framed by scripts/memo-frame.py) and the Torah words. Texts — `memo` in i18n/<lang>.ts, same order.
 * Every gematria and letter hint is the commentary's own and is checked by `npm run check`.
 */
const memo: MemoData = {
  items: [
    {
      verse: 'עם לבן גרתי',
      quote: 'עם לבן גרתי — אף על פי שהייתי בבית לבן קיימתי תרי״ג מצות',
      source: 'bht-32-5-1',
    },
    {
      verse: 'ויהי לי שור וחמור',
      quote: 'לי שור בגימטריא שנולד יוסף',
      gematria: [{ a: 'לי שור', b: 'שנולד יוסף', v: 546 }],
      source: 'bht-32-6-2',
    },
    {
      verse: 'כי במקלי עברתי את הירדן',
      quote: 'במקלי בגימטריא יעקב, פירוש בגופי לבדי',
      gematria: [{ a: 'במקלי', b: 'יעקב', v: 182 }],
      source: 'bht-32-11-2',
    },
    {
      verse: 'הצילני נא מיד אחי',
      quote: 'הצילני נא מיד — ר״ת המן, שיצא להכות אם על בנים',
      letters: [{ from: 'הצילני נא מיד', take: 'first', word: 'המן', kind: 'rt' }],
      source: 'bht-32-12-1',
    },
    {
      verse: 'מנחה לעשו אחיו',
      quote: 'מנחה בגימטריא אבנים — ששלח לו אבנים טובות',
      gematria: [{ a: 'מנחה', b: 'אבנים', v: 103 }],
      source: 'bht-32-14',
    },
    {
      verse: 'ויאבק איש עמו',
      quote: 'איש עמו בגימטריא עשו אדום',
      gematria: [{ a: 'איש עמו', b: 'עשו אדום', v: 427 }],
      source: 'bht-32-25-2',
    },
    {
      verse: 'עד עלות השחר',
      quote: 'ויאבק איש עמו — ס״ת קשו, על שם בית עשו לקש',
      letters: [{ from: 'ויאבק איש עמו', take: 'last', word: 'קשו', kind: 'st' }],
      source: 'bht-32-25-3',
    },
    {
      verse: 'ויגע בכף ירכו',
      quote: 'בכף ירכו בגימטריא לפוסלו מכהונה',
      gematria: [{ a: 'בכף ירכו', b: 'לפוסלו מכהונה', v: 338 }],
      source: 'bht-32-26',
    },
    {
      verse: 'כי אם ברכתני',
      quote: 'ברכתני בגימטריא הודה לברכתי, ששרו של עשו היה',
      gematria: [{ a: 'ברכתני', b: 'הודה לברכתי', v: 682 }],
      source: 'bht-32-27',
    },
    {
      verse: 'וישתחו ארצה שבע פעמים',
      quote: 'וישתחו ארצה ז׳ פעמים — על שם כי שבע יפול צדיק וקם',
      source: 'bht-33-3',
    },
    {
      verse: 'ויפל על צוארו וישקהו',
      quote: 'וישקהו בגימטריא לנושכיהו',
      gematria: [{ a: 'וישקהו', b: 'לנושכיהו', v: 427 }],
      source: 'bht-33-4',
    },
    {
      verse: 'אחי יהי לך אשר לך',
      quote: 'אחי יהי לך אשר לך בגימטריא זה הברכות',
      gematria: [{ a: 'אחי יהי לך אשר לך', b: 'זה הברכות', v: 645 }],
      source: 'bht-33-9',
    },
  ],
};

export default memo;
