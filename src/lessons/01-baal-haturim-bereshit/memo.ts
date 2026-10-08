import type { MemoData } from '../types';

/**
 * Memo «Бааль а-Турим · Берешит» — the second game of the lesson: 12 comments of the Baal HaTurim on Bereshit 1–4
 * (Kitzur Ba'al HaTurim, Sefaria), one pair of cards each — a picture (memo/NN.png, framed by scripts/memo-frame.py)
 * and the Torah words. Texts — `memo` in i18n/<lang>.ts, same order.
 * Every gematria and letter hint is the commentary's own and is checked by `npm run check`.
 * The comments use no אתב״ש. Divine Names in real spelling — shown as אלקים.
 */
const memo: MemoData = {
  items: [
    {
      verse: 'בראשית ברא',
      quote: 'בראשית ברא — בגימטריא בראש השנה נברא (העולם)',
      gematria: [{ a: 'בראשית ברא', b: 'בראש השנה נברא', v: 1116 }],
      source: 'bht-1-1',
    },
    {
      verse: 'בראשית ברא אלהים',
      quote: 'בראשית ברא אלהים — ס״ת אמת, מלמד שברא העולם באמת, כמו שנאמר: ראש דברך אמת',
      letters: [{ from: 'בראשית ברא אלהים', take: 'last', word: 'אמת', kind: 'st' }],
      source: 'bht-1-1',
    },
    {
      verse: 'את האור',
      quote: 'את האור — בגימטריא בתורה, ועולה מנין תרי״ג',
      gematria: [
        { a: 'את האור', b: 'בתורה', v: 613 },
        { a: 'תריג', v: 613 },
      ],
      source: 'bht-1-4',
    },
    {
      verse: 'ויבדל',
      quote: 'וירא אלהים את האור כי טוב ויבדל — מכאן שאין מברכין על הנר עד שיאותו לאורו. כמנין ויבדל מבדילין בשנה במוצאי שבתות',
      gematria: [{ a: 'ויבדל', v: 52 }],
      source: 'bht-1-4',
    },
    {
      verse: 'מזריע זרע למינהו',
      quote: 'מזריע זרע למינהו — ר״ת מזל, שאין לך עשב שאין לו מזל למעלה',
      letters: [{ from: 'מזריע זרע למינהו', take: 'first', word: 'מזל', kind: 'rt' }],
      source: 'bht-1-12',
    },
    {
      verse: 'מארת',
      quote: 'מארת — חסר, שלא נברא להאיר אלא השמש. וירח לא נברא אלא כדי שלא יעבדו לחמה אם תהיה יחידה',
      source: 'bht-1-14',
    },
    {
      verse: 'האדם',
      quote: 'האדם — אותיות אדמה, שנברא מן האדמה. אדם — נוטריקון: אפר, דם, מרה',
      gematria: [{ a: 'האדם', b: 'אדמה', v: 50 }],
      letters: [
        { from: 'האדם', take: 'all', word: 'אדמה', kind: 'letters' },
        { from: 'אפר דם מרה', take: 'first', word: 'אדם', kind: 'notarikon' },
      ],
      source: 'bht-1-27',
    },
    {
      verse: 'ויפח באפיו נשמת חיים',
      quote: 'ויפח באפיו נשמת חיים — ס״ת חותם',
      letters: [{ from: 'ויפח באפיו נשמת חיים', take: 'last', word: 'חותם', kind: 'st' }],
      source: 'bht-2-7',
    },
    {
      verse: 'בהבראם',
      quote: 'בהבראם — אותיות באברהם, בזכות אברהם נבראו שמים וארץ',
      gematria: [{ a: 'בהבראם', b: 'באברהם', v: 250 }],
      letters: [{ from: 'בהבראם', take: 'all', word: 'באברהם', kind: 'letters' }],
      source: 'bht-2-4',
    },
    {
      verse: 'ויבאה אל האדם',
      quote: 'ויבאה — כתיב חסר, והיא עולה כ״ד, שקשטה בכ״ד קשוטין והביאה לו',
      gematria: [{ a: 'ויבאה', v: 24 }],
      source: 'bht-2-22',
    },
    {
      verse: 'אשר צויתיך לבלתי אכל',
      quote: 'אשר צויתיך לבלתי אכל — ס״ת רכיל, שהלכת בעצת רכיל',
      letters: [{ from: 'אשר צויתיך לבלתי אכל', take: 'last', word: 'רכיל', kind: 'st' }],
      source: 'bht-3-11',
    },
    {
      verse: 'הנה בשמים עדי',
      quote: 'הנה בשמים עדי — בגימטריא חנוך… ובחר בחנוך שהיה דור שביעי, שהקב״ה חפץ בשביעיות',
      gematria: [{ a: 'עדי', b: 'חנוך', v: 84 }],
      source: 'bht-4-18',
    },
  ],
};

export default memo;
