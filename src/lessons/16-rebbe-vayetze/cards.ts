import type { RebbeCardsData } from '../types';

/**
 * «Карточки» of «Нифлаот Ребе» · Ваеце: the same 12 talks as «Беседы Ребе по дням» (`daily` in index.ts, same order) —
 * a phrase of the verse and one explanation of the Rebbe on it. Three talks on 28:10 — three different phrases of the verse.
 */
const cards: RebbeCardsData = {
  items: [
    { verse: 'ויצא יעקב', source: 'torah-28-10', ls: { vol: 35, sicha: 1 } },
    { verse: 'מבאר שבע', source: 'torah-28-10', ls: { vol: 10, sicha: 1 } },
    { verse: 'וילך חרנה', source: 'torah-28-10', tm: { year: 5725, day: 'ט׳ כסלו' } },
    { verse: 'ויפגע במקום', source: 'torah-28-11', ls: { vol: 25, sicha: 2 } },
    { verse: 'הארץ אשר אתה שכב עליה', source: 'torah-28-13', ls: { vol: 20, sicha: 2 } },
    { verse: 'וידר יעקב נדר', source: 'torah-28-20-22', ls: { vol: 15, sicha: 3 } },
    { verse: 'את־רחל בתו', source: 'torah-29-28', ls: { vol: 5, sicha: 2 } },
    { verse: 'ותקרא שמו ראובן', source: 'torah-29-32', ls: { vol: 10, sicha: 2 } },
    { verse: 'ויפרץ האיש מאד מאד', source: 'torah-30-43', ls: { vol: 15, sicha: 4 } },
    { verse: 'בכל־כחי עבדתי את־אביכן', source: 'torah-31-6', ls: { vol: 25 } },
    { verse: 'וישא את־בניו ואת־נשיו', source: 'torah-31-17', ls: { vol: 30, sicha: 3 } },
    { verse: 'ויעקב הלך לדרכו', source: 'torah-32-2', ls: { vol: 15, sicha: 5 } },
  ],
};

export default cards;
