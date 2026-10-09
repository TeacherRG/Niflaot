import type { RebbeCardsData } from '../types';

/**
 * «Карточки» of «Нифлаот Ребе» · Берешит: a verse of the portion and one explanation of the Rebbe on it, from the table
 * of the weekly Likkutei Sichot («Нишмат Эфраим», parshapages.com). Where the table has several talks on one verse
 * (בראשית — four; ויקרא לו האדם / הוא שמו — two), only one is taken. Order — by the verses.
 */
const cards: RebbeCardsData = {
  items: [
    { verse: 'בראשית', source: 'gen-1-1-only', ls: { vol: 15, sicha: 1 } },
    { verse: 'יהי אור', source: 'gen-1-3', ls: { vol: 10, sicha: 2 } },
    { verse: 'יהי מארת', source: 'gen-1-14', ls: { vol: 15, sicha: 2 } },
    { verse: 'שני המארת הגדלים', source: 'gen-1-16', ls: { vol: 30, sicha: 2 } },
    { verse: 'התנינם הגדלים', source: 'gen-1-21', ls: { vol: 5, sicha: 2 } },
    { verse: 'ויברך אתם', source: 'gen-1-22', ls: { vol: 25, sicha: 2 } },
    { verse: 'לכם יהיה לאכלה', source: 'gen-1-29', ls: { vol: 20, sicha: 2 } },
    { verse: 'ויכל אלהים ביום השביעי', source: 'gen-2-2', ls: { vol: 5, sicha: 3 } },
    { verse: 'אשר ברא אלהים לעשות', source: 'gen-2-3', ls: { vol: 25, sicha: 3 } },
    { verse: 'הוא שמו', source: 'gen-2-19', ls: { vol: 15, sicha: 3 } },
    { verse: 'מפרי האדמה', source: 'gen-4-3', ls: { vol: 15, sicha: 4 } },
    { verse: 'כי נחמתי כי עשיתם', source: 'gen-6-7', ls: { vol: 15, sicha: 5 } },
  ],
};

export default cards;
