import type { RebbeCardsData } from '../types';

/**
 * «Карточки» of «Нифлаот Ребе» · Лех леха: a verse (or, in the long first verse, a phrase of it) and one explanation of
 * the Rebbe on it; order — by the verses. Where the talk's number is not known, its pages are given; talks that are
 * not in Likkutei Sichot — by Torat Menachem (Hitvaaduyot). 12:7, 12:8, 13:17, 13:18 — vol. 30, Lech Lecha 1 and
 * 17:5, 17:15 — vol. 25, Lech Lecha 3: the same talks as the investigation.
 */
const cards: RebbeCardsData = {
  items: [
    { verse: 'לך לך', source: 'gen-12-1-only', ls: { vol: 1, pages: '10–11' } },
    { verse: 'מארצך וממולדתך ומבית אביך', source: 'gen-12-1-only', tm: { year: 5743, vol: 3, pages: '1223' } },
    { verse: 'אל הארץ אשר אראך', source: 'gen-12-1-only', ls: { vol: 1, pages: '10–11' } },
    { verse: 'ואעשך לגוי גדול', source: 'gen-12-2', ls: { vol: 5, pages: '83–85' } },
    { verse: 'ונברכו בך כל משפחת האדמה', source: 'gen-12-3', tm: { year: 5742, vol: 1, pages: '376–381' } },
    { verse: 'ויבן שם מזבח לה׳ הנראה אליו', source: 'gen-12-7', ls: { vol: 30, sicha: 1 } },
    { verse: 'ויבן שם מזבח לה׳ ויקרא בשם ה׳', source: 'gen-12-8', ls: { vol: 30, sicha: 1 } },
    { verse: 'הנה נא ידעתי כי אשה יפת מראה את', source: 'gen-12-11', ls: { vol: 5, pages: '83–85' } },
    { verse: 'קום התהלך בארץ לארכה ולרחבה כי לך אתננה', source: 'gen-13-17', ls: { vol: 30, sicha: 1 } },
    { verse: 'וישב באלני ממרא אשר בחברון', source: 'gen-13-18', ls: { vol: 30, sicha: 1 } },
    { verse: 'כי אב המון גוים נתתיך', source: 'gen-17-5', ls: { vol: 25, sicha: 3 } },
    { verse: 'כי שרה שמה', source: 'gen-17-15', ls: { vol: 25, sicha: 3 } },
  ],
};

export default cards;
