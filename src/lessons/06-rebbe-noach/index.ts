import type { Lesson } from '../types';
import cards from './cards';
import ru from './i18n/ru';
import en from './i18n/en';
import de from './i18n/de';

/**
 * «Нифлаот Ребе» · Ноах, урок №1 — «Войди в ковчег»: пока только «Карточки» — 12 стихов главы Ноах
 * и по одному объяснению Ребе к каждому (cards.ts). Расследования нет (`riddles: []`): `#/<slug>` открывает карточки.
 */
const lesson: Lesson = {
  slug: 'rebbe-noach',
  number: 1,
  parsha: 'noach',
  series: 'rebbe',
  kind: 'sicha',
  hebrewTitle: 'בא אל התבה',
  year: 'ה׳תשפ״ז · 5787',
  age: 8,
  heroLetters: ['נ', 'ח'],
  author: { name: 'Rabbi Menachem Mendel Schneerson, the Lubavitcher Rebbe', alternateName: 'Любавичский Ребе' },
  riddles: [],
  highlight: [['בא אתה וכל ביתך אל התבה']],
  // a talk of the Rebbe: no gematria calculator
  calculator: { words: [], secrets: {} },
  cards,
  texts: { ru, en, de },
};

export default lesson;
