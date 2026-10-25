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
    // word for word as sung in the recording (sent by the owner): «Люба, братья-люба», the verse twice, the bullets, «Эй, люба…» — and again
    lines: [
      { text: "Люба, братья-люба,", read: { en: "Lyuba, bratya-lyuba,", de: "Ljuba, bratja-ljuba," }, tr: { en: "It is good, brothers, it is good,", de: "Schön, Brüder, schön," } },
      { text: "любо, братья, жить,", read: { en: "lyubo, bratya, zhit’,", de: "ljubo, bratja, shit," }, tr: { en: "it is good, brothers, to live,", de: "schön ist es, Brüder, zu leben," } },
      { text: "С нашим атаманом", read: { en: "S nashim atamanom", de: "S naschim atamanom" }, tr: { en: "With our ataman", de: "Mit unserem Ataman" } },
      { text: "нечего тужить.", read: { en: "nechego tuzhit’.", de: "netschewo tuschit." }, tr: { en: "there is nothing to grieve about.", de: "gibt es nichts zu klagen." } },
      { text: "Любо, братья-люба,", read: { en: "Lyubo, bratya-lyuba,", de: "Ljubo, bratja-ljuba," }, tr: { en: "It is good, brothers, it is good,", de: "Schön, Brüder, schön," } },
      { text: "любо, братья, жить,", read: { en: "lyubo, bratya, zhit’,", de: "ljubo, bratja, shit," }, tr: { en: "it is good, brothers, to live,", de: "schön ist es, Brüder, zu leben," } },
      { text: "С нашим атаманом", read: { en: "S nashim atamanom", de: "S naschim atamanom" }, tr: { en: "With our ataman", de: "Mit unserem Ataman" } },
      { text: "нечего тужить.", read: { en: "nechego tuzhit’.", de: "netschewo tuschit." }, tr: { en: "there is nothing to grieve about.", de: "gibt es nichts zu klagen." } },
      { text: "Первая пуля ранила коня,", read: { en: "Pervaya pulya ranila konya,", de: "Perwaja pulja ranila konja," }, tr: { en: "The first bullet wounded the horse,", de: "Die erste Kugel verwundete das Pferd," } },
      { text: "и вторая пуля ранила меня.", read: { en: "i vtoraya pulya ranila menya.", de: "i wtoraja pulja ranila menja." }, tr: { en: "and the second bullet wounded me.", de: "und die zweite Kugel verwundete mich." } },
      { text: "Эй, люба, братья-люба,", read: { en: "Ey, lyuba, bratya-lyuba,", de: "Ej, ljuba, bratja-ljuba," }, tr: { en: "Hey, it is good, brothers, it is good,", de: "Hej, schön, Brüder, schön," } },
      { text: "любо, братья, жить,", read: { en: "lyubo, bratya, zhit’,", de: "ljubo, bratja, shit," }, tr: { en: "it is good, brothers, to live,", de: "schön ist es, Brüder, zu leben," } },
      { text: "С нашим атаманом", read: { en: "S nashim atamanom", de: "S naschim atamanom" }, tr: { en: "With our ataman", de: "Mit unserem Ataman" } },
      { text: "нечего тужить.", read: { en: "nechego tuzhit’.", de: "netschewo tuschit." }, tr: { en: "there is nothing to grieve about.", de: "gibt es nichts zu klagen." } },
      { text: "Любо, братья-люба,", read: { en: "Lyubo, bratya-lyuba,", de: "Ljubo, bratja-ljuba," }, tr: { en: "It is good, brothers, it is good,", de: "Schön, Brüder, schön," } },
      { text: "любо, братья, жить,", read: { en: "lyubo, bratya, zhit’,", de: "ljubo, bratja, shit," }, tr: { en: "it is good, brothers, to live,", de: "schön ist es, Brüder, zu leben," } },
      { text: "С нашим атаманом", read: { en: "S nashim atamanom", de: "S naschim atamanom" }, tr: { en: "With our ataman", de: "Mit unserem Ataman" } },
      { text: "нечего тужить.", read: { en: "nechego tuzhit’.", de: "netschewo tuschit." }, tr: { en: "there is nothing to grieve about.", de: "gibt es nichts zu klagen." } },
      { text: "Первая пуля ранила коня,", read: { en: "Pervaya pulya ranila konya,", de: "Perwaja pulja ranila konja," }, tr: { en: "The first bullet wounded the horse,", de: "Die erste Kugel verwundete das Pferd," } },
      { text: "и вторая пуля ранила меня.", read: { en: "i vtoraya pulya ranila menya.", de: "i wtoraja pulja ranila menja." }, tr: { en: "and the second bullet wounded me.", de: "und die zweite Kugel verwundete mich." } },
      { text: "Первая пуля ранила коня,", read: { en: "Pervaya pulya ranila konya,", de: "Perwaja pulja ranila konja," }, tr: { en: "The first bullet wounded the horse,", de: "Die erste Kugel verwundete das Pferd," } },
      { text: "вторая пуля ранила меня.", read: { en: "vtoraya pulya ranila menya.", de: "wtoraja pulja ranila menja." }, tr: { en: "the second bullet wounded me.", de: "die zweite Kugel verwundete mich." } },
      { text: "Эй, люба, братья-люба,", read: { en: "Ey, lyuba, bratya-lyuba,", de: "Ej, ljuba, bratja-ljuba," }, tr: { en: "Hey, it is good, brothers, it is good,", de: "Hej, schön, Brüder, schön," } },
      { text: "любо, братья, жить,", read: { en: "lyubo, bratya, zhit’,", de: "ljubo, bratja, shit," }, tr: { en: "it is good, brothers, to live,", de: "schön ist es, Brüder, zu leben," } },
      { text: "С нашим атаманом", read: { en: "S nashim atamanom", de: "S naschim atamanom" }, tr: { en: "With our ataman", de: "Mit unserem Ataman" } },
      { text: "не приходится тужить.", read: { en: "ne prikhoditsya tuzhit’.", de: "ne prichoditsja tuschit." }, tr: { en: "we have no cause to grieve.", de: "brauchen wir nicht zu klagen." } },
    ],
    times: [1.2, 3.6, 6.1, 8.5, 11.8, 14, 16.2, 18.4, 22.1, 25.8, 30, 32.5, 35, 37.3, 39.2, 44, 46, 48.2, 50.5, 55, 59.4, 63.6, 67.3, 72, 76.4, 81.5],
    source: { name: 'm770.org', url: 'https://m770.org/' },
  },
  {
    id: 'anim-zmirot',
    title: { ru: 'Аним змирот', en: 'Anim Zemirot', de: 'Anim Semirot' },
    lang: 'he',
    audio: 'nigun/anim-zmirot.mp3',
    about: {
      ru: '«Буду услаждать песнопениями» («Аним змирот»). Ребе спел этот нигун первый раз под утро в праздник Симхат Тора 1961 года и объяснил его скрытый смысл. Мелодия этого нигуна выражает возвышенную тоску еврейской души по своему Создателю. Слова взяты из праздничной молитвы.',
      en: '“I will sing sweet songs” (“Anim Zemirot”). The Rebbe first sang this niggun towards morning on Simchat Torah 1961 and explained its hidden meaning. The melody of this niggun expresses the lofty longing of the Jewish soul for its Creator. The words are taken from the festival prayer.',
      de: '„Ich singe süße Lieder“ („Anim Semirot“). Der Rebbe sang diesen Nigun zum ersten Mal gegen Morgen an Simchat Tora 1961 und erklärte seine verborgene Bedeutung. Die Melodie dieses Niguns drückt die erhabene Sehnsucht der jüdischen Seele nach ihrem Schöpfer aus. Die Worte stammen aus dem Festtagsgebet.',
    },
    // the words in Hebrew (sent by the owner), read the Ashkenazi way; the times are a first guess — to be marked by ear (and the repeats added as sung)
    lines: [
      { text: "אַנְעִים זְמִירוֹת וְשִׁירִים אֶאֱרֹג,", read: { ru: "Аним змиройс вэ-ширим ээройг,", en: "Anim zmiros ve-shirim e’eroig,", de: "Anim smiros we-schirim e’eroig," }, tr: { ru: "Буду услаждать песнопениями и слагать песни,", en: "I will sing sweet melodies and weave songs,", de: "Ich singe süße Lieder und flechte Gesänge," } },
      { text: "כִּי אֵלֶיךָ נַפְשִׁי תַעֲרֹג.", read: { ru: "ки эйлехо нафши сааройг.", en: "ki eilecho nafshi sa’aroig.", de: "ki ejlecho nafschi sa’aroig." }, tr: { ru: "ибо Тебя жаждет душа моя.", en: "for my soul longs for You.", de: "denn nach Dir sehnt sich meine Seele." } },
      { text: "נַפְשִׁי חָמְדָה בְּצֵל יָדֶךָ,", read: { ru: "Нафши хомдо бэцэйль йодэхо,", en: "Nafshi chomdo betzeil yodecho,", de: "Nafschi chomdo bezejl jodecho," }, tr: { ru: "Душе моей любо в тени руки Твоей", en: "My soul yearns, in the shade of Your hand,", de: "Meine Seele sehnt sich, im Schatten Deiner Hand" } },
      { text: "לָדַעַת כָּל רָז סוֹדֶךָ.", read: { ru: "лодаас коль ройз сойдэхо.", en: "lodaas kol roiz soidecho.", de: "lodaas kol rojs sojdecho." }, tr: { ru: "постигать Твои сокровенные тайны.", en: "to know all Your hidden secrets.", de: "all Deine verborgenen Geheimnisse zu erkennen." } },
    ],
    times: [3, 66, 129, 192],
    draftTimes: true,
    source: { name: 'm770.org', url: 'https://m770.org/' },
  },
];

export const findNigun = (id: string) => NIGUNIM.find((n) => n.id === id);
