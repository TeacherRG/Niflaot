import type { Lesson } from '../types';
import ru from './i18n/ru';
import en from './i18n/en';
import de from './i18n/de';
import memo from './memo';

/**
 * Урок №7 — «Бааль ґа-Турим: Хаей Сара»: гематрии и первые/последние буквы слов в комментарии рабби Яакова
 * бен Ашера (Бааль ґа-Турим, краткая редакция) к главе Хаей Сара (Берешит 23:1–25:18).
 * Все числа проверены кодом (см. уравнения ниже). Комментарий к 24:49 («על ימין או על שמאל» с колелем = «ישמעאל ועמון
 * ומואב») в издании стоит в скобках и без числа — не взят; не взят и комментарий о маленькой כ в «ולבכתה» (23:2).
 * Memo-игра — memo.ts (картинки: memo/NN.png — раскраски для печати).
 */
const lesson: Lesson = {
  slug: 'baal-haturim-chayei-sarah',
  number: 7,
  parsha: 'chayei-sarah',
  hebrewTitle: 'בעל הטורים · חיי שרה',
  year: 'ה׳תשפ״ז · 5787',
  age: 8,
  kind: 'commentary',
  heroLetters: ['ח', 'ש'],
  riddles: [
    {
      words: ['ויהיו'],
      steps: [
        { t: 'lt', est: { sec: 40, level: 1 }, from: 'שרה מאה שנה', take: 'first', a: 'שמש' },
        {
          t: 'ch', est: { sec: 25, level: 1 },
          opts: [{ h: 'רבקה' }, { h: 'רחל' }, { h: 'לאה' }, { h: 'מלכה' }],
          c: 0,
        },
        { t: 'num', est: { sec: 30, level: 1 }, a: 37, coach: [{ word: 'ויהיו' }] },
        { t: 'num', est: { sec: 30, level: 1 }, a: 37, coach: [{ sub: [127, 90] }] },
      ],
      equations: [
        'שרה מאה שנה → ש · מ · ש → שמש',
        'ויהיו = 37',
        '127 − 90 = 37',
      ],
      sources: ['gen-23-1', 'bht-23-1', 'ecclesiastes-1-5', 'gen-22-23', 'gen-17-17'],
      quotes: [['bht-23-1:1-2'], ['bht-23-1:3']],
    },
    {
      words: ['עפרן'],
      steps: [
        { t: 'num', est: { sec: 30, level: 1 }, a: 400, coach: [{ word: 'עפרן' }] },
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [
            { h: 'עין רע', v: 400 },
            { h: 'עין טובה', v: 152 },
            { h: 'לב טוב', v: 49 },
            { h: 'יד פתוחה', v: 513 },
          ],
          c: 0,
        },
        { t: 'lt', est: { sec: 40, level: 1 }, from: 'ויקם שדה עפרון', take: 'first', a: 'עשו' },
      ],
      equations: [
        'עפרן = 70 + 80 + 200 + 50 = 400 = עין רע',
        'ויקם שדה עפרון → ו · ש · ע → עשו',
      ],
      sources: ['gen-23-16', 'bht-23-16', 'rashi-23-16', 'gen-23-17', 'bht-23-17'],
      quotes: [['bht-23-16', 'rashi-23-16'], ['bht-23-17']],
    },
    {
      words: ['נא', 'ידך'],
      steps: [
        { t: 'num', est: { sec: 40, level: 1 }, a: 85, coach: [{ word: 'נא' }, { word: 'ידך' }, { add: ['$1', '$2'] }] },
        {
          t: 'ch', est: { sec: 30, level: 1 },
          opts: [
            { h: 'מילה', v: 85 },
            { h: 'ברית', v: 612 },
            { h: 'שבועה', v: 383 },
            { h: 'תפלין', v: 570 },
          ],
          c: 0,
        },
        { t: 'lt', est: { sec: 40, level: 1 }, from: 'עם אדני אברהם', take: 'last', a: 'מים' },
        { t: 'lt', est: { sec: 45, level: 2 }, from: 'חסד עם אדני אברהם', take: 'last', a: 'דמים' },
      ],
      equations: [
        'נא ידך = 51 + 34 = 85 = מילה',
        'עם אדני אברהם → ם · י · ם → מים',
        'חסד עם אדני אברהם → ד · ם · י · ם → דמים',
      ],
      sources: ['gen-24-2', 'bht-24-2-2', 'rashi-24-2', 'gen-24-12', 'bht-24-12', 'gen-18-4', 'gen-22-10'],
      quotes: [['bht-24-2-2', 'rashi-24-2'], ['bht-24-12']],
    },
    {
      words: ['היי', 'ויבאה'],
      steps: [
        { t: 'lt', est: { sec: 40, level: 1 }, from: 'עם האיש הזה', take: 'last', a: 'משה' },
        { t: 'num', est: { sec: 20, level: 1 }, a: 25, coach: [{ word: 'היי' }] },
        {
          t: 'ch', est: { sec: 25, level: 1 },
          opts: [
            { h: 'כה', v: 25 },
            { h: 'אלף', v: 111 },
            { h: 'רב', v: 202 },
            { h: 'זרע', v: 277 },
          ],
          c: 0,
        },
        { t: 'num', est: { sec: 30, level: 1 }, a: 24, coach: [{ word: 'ויבאה' }] },
      ],
      equations: [
        'עם האיש הזה → ם · ש · ה → משה',
        'היי = 25 = כה',
        'ויבאה = 24',
      ],
      sources: ['gen-24-58', 'bht-24-58', 'gen-24-60', 'bht-24-60-1', 'gen-15-5', 'gen-24-67', 'bht-24-67-1', 'rashi-24-67'],
      quotes: [['bht-24-58'], ['bht-24-60-1'], ['bht-24-67-1', 'rashi-24-67']],
    },
  ],
  highlight: [
    ['400', '=', 'עפרן'],
    ['400', '=', 'עין רע'],
  ],
  calculator: {
    words: [
      'שרה מאה שנה', 'שמש', 'ויהיו',
      'עפרן', 'עפרון', 'עין רע', 'ויקם שדה עפרון', 'עשו',
      'נא ידך', 'מילה', 'עם אדני אברהם', 'מים', 'דמים',
      'עם האיש הזה', 'משה', 'היי', 'כה', 'ויבאה',
    ],
    secrets: { 400: 1, 85: 2, 25: 3 },
  },
  texts: { ru, en, de },
  memo,
  author: { name: 'Яаков бен Ашер (Бааль ґа-Турим)', alternateName: 'Rabbi Yaakov ben Asher (Baal HaTurim)' },
};

export default lesson;
