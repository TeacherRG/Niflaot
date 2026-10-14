import type { RebbeCardsData } from '../types';

/**
 * «Карточки» of «Нифлаот Ребе» · Ноах: a verse of the portion and one explanation of the Rebbe on it
 * (weekly talks of «Ликутей сихот» on Noach). One talk per verse; order — by the verses.
 * Vol. 1, Noach: one talk with two themes — «тева» = word (7:1) and the Flood as a mikveh (7:12).
 */
const cards: RebbeCardsData = {
  items: [
    { verse: 'אלה תולדת נח', source: 'gen-6-9-only', ls: { vol: 5, sicha: 1 } },
    { verse: 'קץ כל בשר בא לפני', source: 'gen-6-13-only', ls: { vol: 25, sicha: 1 } },
    { verse: 'עשה לך תבת', source: 'gen-6-14', ls: { vol: 15, sicha: 1 } },
    { verse: 'צהר תעשה לתבה', source: 'gen-6-16', ls: { vol: 10, sicha: 1 } },
    { verse: 'בא אתה וכל ביתך אל התבה', source: 'gen-7-1', ls: { vol: 1, sicha: 1 } },
    { verse: 'נבקעו כל מעינת תהום רבה', source: 'gen-7-11', ls: { vol: 15, sicha: 2 } },
    { verse: 'ארבעים יום וארבעים לילה', source: 'gen-7-12', ls: { vol: 1, sicha: 1 } },
    { verse: 'וישאר אך נח', source: 'gen-7-23', ls: { vol: 5, sicha: 2 } },
    { verse: 'צא מן התבה', source: 'gen-8-16', ls: { vol: 25, sicha: 3 } },
    { verse: 'כי בצלם אלקים עשה את האדם', source: 'gen-9-6', ls: { vol: 15, sicha: 4 } },
    { verse: 'את קשתי נתתי בענן', source: 'gen-9-13', ls: { vol: 15, sicha: 3 } },
    { verse: 'וערות אביהם לא ראו', source: 'gen-9-23', ls: { vol: 10, sicha: 2 } },
  ],
};

export default cards;
