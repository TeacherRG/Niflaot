import type { Locale } from '../i18n';

/**
 * «Святая музыка» — the faculty of the niggun (`#/nigun`, NigunPage.tsx): a lesson per niggun — what it is and who sang
 * it, then learning it by karaoke (Karaoke.tsx). The recordings and the texts are from m770.org, used with their
 * permission: every lesson links straight to their site (`source`). The words are sung as they are (here — Russian);
 * on the English and German site each line also has how it is read and a translation of the project.
 */
export interface NigunLine {
  /** the line as it is sung */
  text: string;
  /** how it is read and what it means, on the other languages of the site */
  read?: Partial<Record<Locale, string>>;
  tr?: Partial<Record<Locale, string>>;
}

export interface Nigun {
  id: string;
  title: Record<Locale, string>;
  /** the language the words are sung in */
  lang: Locale | 'he' | 'yi';
  /** under public/: the recording */
  audio: string;
  /** a paragraph (plain text) about the niggun and the Chassidim who sang it */
  about: Record<Locale, string>;
  lines: NigunLine[];
  /** the second each line starts in the recording (as many as `lines`, increasing) */
  times: number[];
  /** the times are a first estimate from the pauses of the recording, not checked by ear */
  draftTimes?: boolean;
  source: { name: string; url: string };
}

export const NIGUNIM: Nigun[] = [
  {
    id: 'lubo-bratzi',
    title: { ru: 'Любо, братцы, любо', en: 'Lyubo, bratsy, lyubo', de: 'Ljubo, bratzy, ljubo' },
    lang: 'ru',
    audio: 'nigun/lubo-bratzi.mp3',
    about: {
      ru: 'Во время фарбренгена в «770» часто поют нигун «Любо, братцы, любо». Его пели Гриша Чачкес, реб Мендель Футерфас, Мендель Маркель и р. Шнеор-Залман Левин из Невеля. Он был известен среди хасидов своим музыкальным талантом и прекрасно исполнял хасидские нигуны.',
      en: 'At farbrengens in “770” the niggun “Lyubo, bratsy, lyubo” is often sung. It was sung by Grisha Chachkes, Reb Mendel Futerfas, Mendel Markel and Rabbi Shneur Zalman Levin of Nevel. He was known among the Chassidim for his musical talent and sang Chassidic niggunim beautifully.',
      de: 'Bei Farbrengen in „770“ wird oft der Nigun „Ljubo, bratzy, ljubo“ gesungen. Ihn sangen Grischa Tschatschkes, Reb Mendel Futerfas, Mendel Markel und Rabbi Schneur Salman Lewin aus Newel. Er war unter den Chassidim für seine musikalische Begabung bekannt und sang chassidische Nigunim wunderschön.',
    },
    // as sung in the recording: the verse twice, the bullets, «Эй!» — and again (words «братья», as sung)
    lines: [
      { text: "Любо, братья, любо,", read: { en: "Lyubo, bratya, lyubo,", de: "Ljubo, bratja, ljubo," }, tr: { en: "It is good, brothers, it is good,", de: "Schön, Brüder, schön," } },
      { text: "Любо, братья, жить,", read: { en: "Lyubo, bratya, zhit’,", de: "Ljubo, bratja, shit," }, tr: { en: "It is good, brothers, to live,", de: "schön ist es, Brüder, zu leben," } },
      { text: "С нашим атаманом", read: { en: "S nashim atamanom", de: "S naschim atamanom" }, tr: { en: "With our ataman", de: "mit unserem Ataman" } },
      { text: "Нечего тужить.", read: { en: "Nechego tuzhit’.", de: "Netschewo tuschit." }, tr: { en: "there is nothing to grieve about.", de: "gibt es nichts zu klagen." } },
      { text: "Любо, братья, любо,", read: { en: "Lyubo, bratya, lyubo,", de: "Ljubo, bratja, ljubo," }, tr: { en: "It is good, brothers, it is good,", de: "Schön, Brüder, schön," } },
      { text: "Любо, братья, жить,", read: { en: "Lyubo, bratya, zhit’,", de: "Ljubo, bratja, shit," }, tr: { en: "It is good, brothers, to live,", de: "schön ist es, Brüder, zu leben," } },
      { text: "С нашим атаманом", read: { en: "S nashim atamanom", de: "S naschim atamanom" }, tr: { en: "With our ataman", de: "mit unserem Ataman" } },
      { text: "Нечего тужить.", read: { en: "Nechego tuzhit’.", de: "Netschewo tuschit." }, tr: { en: "there is nothing to grieve about.", de: "gibt es nichts zu klagen." } },
      { text: "Первая пуля ранила коня,", read: { en: "Pervaya pulya ranila konya,", de: "Perwaja pulja ranila konja," }, tr: { en: "The first bullet wounded the horse,", de: "Die erste Kugel verwundete das Pferd," } },
      { text: "И вторая пуля ранила меня.", read: { en: "I vtoraya pulya ranila menya.", de: "I wtoraja pulja ranila menja." }, tr: { en: "and the second bullet wounded me.", de: "und die zweite Kugel verwundete mich." } },
      { text: "Эй!", read: { en: "Ey!", de: "Ej!" }, tr: { en: "Hey!", de: "Hej!" } },
      { text: "Любо, братья, любо,", read: { en: "Lyubo, bratya, lyubo,", de: "Ljubo, bratja, ljubo," }, tr: { en: "It is good, brothers, it is good,", de: "Schön, Brüder, schön," } },
      { text: "Любо, братья, жить,", read: { en: "Lyubo, bratya, zhit’,", de: "Ljubo, bratja, shit," }, tr: { en: "It is good, brothers, to live,", de: "schön ist es, Brüder, zu leben," } },
      { text: "С нашим атаманом", read: { en: "S nashim atamanom", de: "S naschim atamanom" }, tr: { en: "With our ataman", de: "mit unserem Ataman" } },
      { text: "Нечего тужить.", read: { en: "Nechego tuzhit’.", de: "Netschewo tuschit." }, tr: { en: "there is nothing to grieve about.", de: "gibt es nichts zu klagen." } },
      { text: "Любо, братья, любо,", read: { en: "Lyubo, bratya, lyubo,", de: "Ljubo, bratja, ljubo," }, tr: { en: "It is good, brothers, it is good,", de: "Schön, Brüder, schön," } },
      { text: "Любо, братья, жить,", read: { en: "Lyubo, bratya, zhit’,", de: "Ljubo, bratja, shit," }, tr: { en: "It is good, brothers, to live,", de: "schön ist es, Brüder, zu leben," } },
      { text: "С нашим атаманом", read: { en: "S nashim atamanom", de: "S naschim atamanom" }, tr: { en: "With our ataman", de: "mit unserem Ataman" } },
      { text: "Нечего тужить.", read: { en: "Nechego tuzhit’.", de: "Netschewo tuschit." }, tr: { en: "there is nothing to grieve about.", de: "gibt es nichts zu klagen." } },
      { text: "Первая пуля ранила коня,", read: { en: "Pervaya pulya ranila konya,", de: "Perwaja pulja ranila konja," }, tr: { en: "The first bullet wounded the horse,", de: "Die erste Kugel verwundete das Pferd," } },
      { text: "И вторая пуля ранила меня.", read: { en: "I vtoraya pulya ranila menya.", de: "I wtoraja pulja ranila menja." }, tr: { en: "and the second bullet wounded me.", de: "und die zweite Kugel verwundete mich." } },
      { text: "Первая пуля ранила коня,", read: { en: "Pervaya pulya ranila konya,", de: "Perwaja pulja ranila konja," }, tr: { en: "The first bullet wounded the horse,", de: "Die erste Kugel verwundete das Pferd," } },
      { text: "Вторая пуля ранила меня.", read: { en: "Vtoraya pulya ranila menya.", de: "Wtoraja pulja ranila menja." }, tr: { en: "the second bullet wounded me.", de: "die zweite Kugel verwundete mich." } },
      { text: "Эй!", read: { en: "Ey!", de: "Ej!" }, tr: { en: "Hey!", de: "Hej!" } },
      { text: "Любо, братья, любо,", read: { en: "Lyubo, bratya, lyubo,", de: "Ljubo, bratja, ljubo," }, tr: { en: "It is good, brothers, it is good,", de: "Schön, Brüder, schön," } },
      { text: "Любо, братья, жить,", read: { en: "Lyubo, bratya, zhit’,", de: "Ljubo, bratja, shit," }, tr: { en: "It is good, brothers, to live,", de: "schön ist es, Brüder, zu leben," } },
      { text: "С нашим атаманом", read: { en: "S nashim atamanom", de: "S naschim atamanom" }, tr: { en: "With our ataman", de: "mit unserem Ataman" } },
      { text: "Не приходится тужить.", read: { en: "Ne prikhoditsya tuzhit’.", de: "Ne prichoditsja tuschit." }, tr: { en: "we have no cause to grieve.", de: "brauchen wir nicht zu klagen." } },
    ],
    times: [0.3, 3.8, 6.7, 10.0, 11.8, 15.2, 17.4, 19.2, 21.8, 27.5, 32.4, 33.2, 35.8, 39.0, 40.7, 43.1, 46.6, 48.7, 50.1, 55.2, 60.2, 64.2, 69.4, 72.4, 73.8, 76.1, 79.8, 84.0],
    draftTimes: true,
    source: { name: 'm770.org', url: 'https://m770.org/' },
  },
];

export const findNigun = (id: string) => NIGUNIM.find((n) => n.id === id);
