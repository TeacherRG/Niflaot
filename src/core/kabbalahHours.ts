/**
 * The twelve hours of the day (and of the night) and the twelve months — one table for the big face, the small «kabbalistic» dial and
 * its window on «Часы» (owner, 26–27.11.2026: the table «Каббалистический циферблат — 12 часов и соответствий», ported here).
 * Hour N ↔ month N counted from Nisan. By day — the combination of the Name Havayah of that month, by night — of the Name Adni
 * (the Arizal, «При эц хаим», Шаар Рош ходеш 3; «Бней Иссасхар»); the letter, the sense, the organ and the sign — «Сефер Йецира» 5;
 * the tribe — the order of the camps; the stone — the stone of that tribe on the breastplate (Rashi, Shemot 28:17–20);
 * the verse — the verse whose first or last letters spell the combination of the month. Which combination belongs to which hour is
 * not spelled out in the books — that choice is the project's, not checked by a rabbi. The owner's notes from rav Ginsburgh's books are
 * left out: his texts are not published without written permission (CLAUDE.md).
 */
export type TribeId =
  | 'yehuda' | 'issachar' | 'zevulun' | 'reuven' | 'shimon' | 'gad'
  | 'ephraim' | 'menashe' | 'binyamin' | 'dan' | 'asher' | 'naftali';

type Lang = 'ru' | 'en' | 'de';
export type L = Record<Lang, string>;

export interface HourSign {
  /** hebcal's month name */
  month: string;
  monthHe: string;
  tribe: TribeId;
  tribeHe: string;
  /** the sign of the month (Unicode, text presentation) */
  sign: string;
  /** the combination of the Name Havayah — by day; letters joined with hyphens: the Name is never written whole */
  tziruf: string;
  /** the combination of the Name Adni — by night, with hyphens */
  night: string;
  /** the letter of the month (Sefer Yetzirah 5) */
  letter: string;
  senseHe: string;
  sense: L;
  organ: L;
  stoneHe: string;
  stone: L;
  stoneColor: string;
  /** the diagonal boundary of Sefer Yetzirah 5 */
  gvulHe: string;
  gvul: L;
  sefirot: L;
  path: L;
  season: L;
  /** whether the verse spells the combination by its first (`rt`) or last (`st`) letters */
  code: 'rt' | 'st';
  /** the verse in Hebrew, without vowels */
  verse: string;
  /** words at the start of the verse that are not part of the code */
  skip?: number;
  verseT: L;
  verseSrc: L;
}

const T = (ru: string, en: string, de: string): L => ({ ru, en, de });

const SEASON_SPRING = T('Весна · буква י (Хохма, Хесед)', 'Spring · the letter י (Chochmah, Chesed)', 'Frühling · der Buchstabe י (Chochma, Chessed)');
const SEASON_SUMMER = T('Лето · первая ה (Бина, Гвура)', 'Summer · the first ה (Binah, Gevurah)', 'Sommer · das erste ה (Bina, Gewura)');
const SEASON_AUTUMN = T('Осень · буква ו (Зеир Анпин, Тиферет)', 'Autumn · the letter ו (Zeir Anpin, Tiferet)', 'Herbst · der Buchstabe ו (Seir Anpin, Tiferet)');
const SEASON_WINTER = T('Зима · вторая ה (Малхут)', 'Winter · the second ה (Malchut)', 'Winter · das zweite ה (Malchut)');
const join = (a: L, b: L): L => ({ ru: `${a.ru}: ${b.ru}`, en: `${a.en}: ${b.en}`, de: `${a.de}: ${b.de}` });

export const HOUR_SIGNS: HourSign[] = [
  {
    month: 'Nisan', monthHe: 'ניסן', tribe: 'yehuda', tribeHe: 'יהודה', sign: '♈', tziruf: 'יהוה', night: 'אדני', letter: 'ה',
    senseHe: 'שיחה', sense: T('Речь', 'Speech', 'Sprechen'), organ: T('Правая нога', 'Right foot', 'Rechter Fuß'),
    stoneHe: 'נפך', stone: T('Нофех (бирюза)', 'Nofech (turquoise)', 'Nofech (Türkis)'), stoneColor: '#06b6d4',
    gvulHe: 'גבול מזרח רום', gvul: T('Восток — Верх', 'East — Above', 'Osten — Oben'),
    sefirot: T('Тиферет — Нецах', 'Tiferet — Netzach', 'Tiferet — Nezach'), path: T('Кетер → Хохма', 'Keter → Chochmah', 'Keter → Chochma'),
    season: join(SEASON_SPRING, T('прямое раскрытие света сверху вниз (итъорут де-леэла), полнота ясности.', 'the light revealed directly from above (itaruta de-le’eila), clarity at its fullest.', 'das Licht offenbart sich direkt von oben (Itaruta de-le’ejla), volle Klarheit.')),
    code: 'rt', verse: 'ישמחו השמים ותגל הארץ',
    verseT: T('«Возвеселятся небеса и возрадуется земля»', '“The heavens will rejoice and the earth will exult”', '„Die Himmel freuen sich, und die Erde jubelt“'),
    verseSrc: T('Теґилим 96:11', 'Tehillim 96:11', 'Tehillim 96,11'),
  },
  {
    month: 'Iyyar', monthHe: 'אייר', tribe: 'issachar', tribeHe: 'יששכר', sign: '♉', tziruf: 'יההו', night: 'אדינ', letter: 'ו',
    senseHe: 'הרהור', sense: T('Размышление', 'Thought', 'Denken'), organ: T('Правая почка', 'Right kidney', 'Rechte Niere'),
    stoneHe: 'ספיר', stone: T('Сапир (сапфир)', 'Sapir (sapphire)', 'Sapir (Saphir)'), stoneColor: '#2563eb',
    gvulHe: 'גבול מזרח צפון', gvul: T('Восток — Север', 'East — North', 'Osten — Norden'),
    sefirot: T('Тиферет — Гвура', 'Tiferet — Gevurah', 'Tiferet — Gewura'), path: T('Кетер → Бина', 'Keter → Binah', 'Keter → Bina'),
    season: join(SEASON_SPRING, T('свет углубляется в разум, исправление качеств души (счёт Омера).', 'the light goes deeper into the mind; refining the traits of the soul (counting the Omer).', 'das Licht geht tiefer in den Verstand; die Eigenschaften der Seele werden verfeinert (Omer-Zählung).')),
    code: 'rt', verse: 'יתהלל המתהלל השכל וידע',
    verseT: T('«Пусть хвалится хвалящийся тем, что разумеет и знает»', '“Let him who glories glory in this: that he understands and knows”', '„Wer sich rühmt, rühme sich dessen, dass er versteht und erkennt“'),
    verseSrc: T('Йирмеяґу 9:23', 'Yirmeyahu 9:23', 'Jirmejahu 9,23'),
  },
  {
    month: 'Sivan', monthHe: 'סיון', tribe: 'zevulun', tribeHe: 'זבולון', sign: '♊', tziruf: 'יוהה', night: 'אנדי', letter: 'ז',
    senseHe: 'הילוך', sense: T('Ходьба', 'Walking', 'Gehen'), organ: T('Левая нога', 'Left foot', 'Linker Fuß'),
    stoneHe: 'יהלם', stone: T('Яґалом (алмаз)', 'Yahalom (diamond)', 'Jahalom (Diamant)'), stoneColor: '#e2e8f0',
    gvulHe: 'גבול מזרח תחת', gvul: T('Восток — Низ', 'East — Below', 'Osten — Unten'),
    sefirot: T('Тиферет — Ход', 'Tiferet — Hod', 'Tiferet — Hod'), path: T('Хохма → Гвура', 'Chochmah → Gevurah', 'Chochma → Gewura'),
    season: join(SEASON_SPRING, T('свет Торы приходит прямо в сердце и в мир (дарование Торы).', 'the light of the Torah comes straight into the heart and the world (the Giving of the Torah).', 'das Licht der Tora kommt direkt ins Herz und in die Welt (die Gabe der Tora).')),
    code: 'rt', verse: 'ידתיו ולצלע המשכן השנית',
    verseT: T('«…его шипы. И для второй стороны Мишкана…»', '“…its tenons. And for the second side of the Mishkan…”', '„…seine Zapfen. Und für die zweite Seite des Mischkan…“'),
    verseSrc: T('Шмот 26:19–20', 'Shemot 26:19–20', 'Schemot 26,19–20'),
  },
  {
    month: 'Tamuz', monthHe: 'תמוז', tribe: 'reuven', tribeHe: 'ראובן', sign: '♋', tziruf: 'הוהי', night: 'דאני', letter: 'ח',
    senseHe: 'ראיה', sense: T('Зрение', 'Sight', 'Sehen'), organ: T('Правая рука', 'Right hand', 'Rechte Hand'),
    stoneHe: 'אדם', stone: T('Одем (рубин)', 'Odem (ruby)', 'Odem (Rubin)'), stoneColor: '#e11d48',
    gvulHe: 'גבול דרום רום', gvul: T('Юг — Верх', 'South — Above', 'Süden — Oben'),
    sefirot: T('Хесед — Нецах', 'Chesed — Netzach', 'Chessed — Nezach'), path: T('Бина → Хесед', 'Binah → Chesed', 'Bina → Chessed'),
    season: join(SEASON_SUMMER, T('движение снизу вверх (итъорута де-летата), исправление сокрытия через зрение.', 'movement from below upward (itaruta de-letata); repairing concealment through sight.', 'Bewegung von unten nach oben (Itaruta de-letata); die Verborgenheit wird durch das Sehen berichtigt.')),
    code: 'st', verse: 'וכל זה איננו שוה לי', skip: 1,
    verseT: T('«Но всё это ничего не стоит для меня»', '“Yet all this is worth nothing to me”', '„Doch all das ist mir nichts wert“'),
    verseSrc: T('Эстер 5:13', 'Esther 5:13', 'Ester 5,13'),
  },
  {
    month: 'Av', monthHe: 'אב', tribe: 'shimon', tribeHe: 'שמעון', sign: '♌', tziruf: 'הויה', night: 'דאינ', letter: 'ט',
    senseHe: 'שמיעה', sense: T('Слух', 'Hearing', 'Hören'), organ: T('Левая почка', 'Left kidney', 'Linke Niere'),
    stoneHe: 'פטדה', stone: T('Питда (топаз)', 'Pitdah (topaz)', 'Pitda (Topas)'), stoneColor: '#eab308',
    gvulHe: 'גבול דרום מזרח', gvul: T('Юг — Восток', 'South — East', 'Süden — Osten'),
    sefirot: T('Хесед — Тиферет', 'Chesed — Tiferet', 'Chessed — Tiferet'), path: T('Хохма → Тиферет', 'Chochmah → Tiferet', 'Chochma → Tiferet'),
    season: join(SEASON_SUMMER, T('пробуждение глубокого понимания и утешения, скорбь превращается в радость.', 'deep understanding and comfort awaken; mourning turns into joy.', 'tiefes Verstehen und Trost erwachen; Trauer wird zu Freude.')),
    code: 'rt', verse: 'הסכת ושמע ישראל היום',
    verseT: T('«Внемли и слушай, Израиль: сегодня…»', '“Be silent and hear, O Israel: today…”', '„Merke auf und höre, Israel: Heute…“'),
    verseSrc: T('Дварим 27:9', 'Devarim 27:9', 'Dewarim 27,9'),
  },
  {
    month: 'Elul', monthHe: 'אלול', tribe: 'gad', tribeHe: 'גד', sign: '♍', tziruf: 'ההוי', night: 'דנאי', letter: 'י',
    senseHe: 'מעשה', sense: T('Действие', 'Action', 'Handeln'), organ: T('Левая рука', 'Left hand', 'Linke Hand'),
    stoneHe: 'אחלמה', stone: T('Ахлама (аметист)', 'Achlamah (amethyst)', 'Achlama (Amethyst)'), stoneColor: '#9333ea',
    gvulHe: 'גבול דרום תחת', gvul: T('Юг — Низ', 'South — Below', 'Süden — Unten'),
    sefirot: T('Хесед — Ход', 'Chesed — Hod', 'Chessed — Hod'), path: T('Бина → Тиферет', 'Binah → Tiferet', 'Bina → Tiferet'),
    season: join(SEASON_SUMMER, T('корень тшувы: «Царь в поле» — исправление поступков и мыслей.', 'the root of teshuvah: “the King in the field” — repairing deeds and thoughts.', 'die Wurzel der Teschuwa: „der König auf dem Feld“ — Taten und Gedanken werden berichtigt.')),
    code: 'st', verse: 'וצדקה תהיה לנו כי',
    verseT: T('«И будет нам праведностью, если…»', '“And it will be righteousness for us, if…”', '„Und es wird uns Gerechtigkeit sein, wenn…“'),
    verseSrc: T('Дварим 6:25', 'Devarim 6:25', 'Dewarim 6,25'),
  },
  {
    month: 'Tishrei', monthHe: 'תשרי', tribe: 'ephraim', tribeHe: 'אפרים', sign: '♎', tziruf: 'והיה', night: 'נאדי', letter: 'ל',
    senseHe: 'תשמיש', sense: T('Близость', 'Union', 'Vereinigung'), organ: T('Желчный пузырь', 'Gallbladder', 'Gallenblase'),
    stoneHe: 'שהם', stone: T('Шоґам (оникс)', 'Shoham (onyx)', 'Schoham (Onyx)'), stoneColor: '#64748b',
    gvulHe: 'גבול מערב רום', gvul: T('Запад — Верх', 'West — Above', 'Westen — Oben'),
    sefirot: T('Йесод — Нецах', 'Yesod — Netzach', 'Jessod — Nezach'), path: T('Хесед → Тиферет', 'Chesed → Tiferet', 'Chessed → Tiferet'),
    season: join(SEASON_AUTUMN, T('прямой канал милосердия, соединяющий Небо и землю в праздники.', 'a straight channel of mercy joining Heaven and earth on the festivals.', 'ein gerader Kanal der Barmherzigkeit, der an den Festtagen Himmel und Erde verbindet.')),
    code: 'st', verse: 'ויראו אתה שרי פרעה',
    verseT: T('«И увидели её вельможи фараона»', '“And Pharaoh’s princes saw her”', '„Und die Fürsten Pharaos sahen sie“'),
    verseSrc: T('Берешит 12:15', 'Bereshit 12:15', 'Bereschit 12,15'),
  },
  {
    month: 'Cheshvan', monthHe: 'חשון', tribe: 'menashe', tribeHe: 'מנשה', sign: '♏', tziruf: 'וההי', night: 'נאיד', letter: 'נ',
    senseHe: 'ריח', sense: T('Обоняние', 'Smell', 'Riechen'), organ: T('Кишечник', 'Intestines', 'Darm'),
    stoneHe: 'שהם', stone: T('Шоґам (оникс)', 'Shoham (onyx)', 'Schoham (Onyx)'), stoneColor: '#475569',
    gvulHe: 'גבול מערב דרום', gvul: T('Запад — Юг', 'West — South', 'Westen — Süden'),
    sefirot: T('Йесод — Хесед', 'Yesod — Chesed', 'Jessod — Chessed'), path: T('Гвура → Тиферет', 'Gevurah → Tiferet', 'Gewura → Tiferet'),
    season: join(SEASON_AUTUMN, T('свет осенних праздников переходит в будничную работу и тонкое чутьё души.', 'the light of the autumn festivals passes into everyday work and the soul’s fine sense.', 'das Licht der Herbstfeste geht in die Arbeit des Alltags und das feine Gespür der Seele über.')),
    code: 'rt', verse: 'ודבש היום הזה יהוה',
    verseT: T('«…и мёдом. В этот день Г-сподь…»', '“…and honey. This day the L-rd…”', '„…und Honig. An diesem Tag gebietet dir der Ewige…“'),
    verseSrc: T('Дварим 26:15–16', 'Devarim 26:15–16', 'Dewarim 26,15–16'),
  },
  {
    month: 'Kislev', monthHe: 'כסלו', tribe: 'binyamin', tribeHe: 'בנימין', sign: '♐', tziruf: 'ויהה', night: 'נדאי', letter: 'ס',
    senseHe: 'שינה', sense: T('Сон', 'Sleep', 'Schlaf'), organ: T('Желудок', 'Stomach', 'Magen'),
    stoneHe: 'ישפה', stone: T('Яшфе (яшма)', 'Yashfeh (jasper)', 'Jaschfe (Jaspis)'), stoneColor: '#b91c1c',
    gvulHe: 'גבול מערב תחת', gvul: T('Запад — Низ', 'West — Below', 'Westen — Unten'),
    sefirot: T('Йесод — Ход', 'Yesod — Hod', 'Jessod — Hod'), path: T('Тиферет → Нецах', 'Tiferet → Netzach', 'Tiferet → Nezach'),
    season: join(SEASON_AUTUMN, T('свет чудес и хасидута (Ханука, 19 кислева) освещает ночную тьму.', 'the light of miracles and Chassidut (Chanukah, 19 Kislev) lights up the darkness of night.', 'das Licht der Wunder und der Chassidut (Chanukka, 19. Kislew) erhellt die Dunkelheit der Nacht.')),
    code: 'rt', verse: 'וירא יושב הארץ הכנעני',
    verseT: T('«И увидел житель земли, кнаанеец…»', '“And the inhabitant of the land, the Canaanite, saw…”', '„Und der Bewohner des Landes, der Kenaaniter, sah…“'),
    verseSrc: T('Берешит 50:11', 'Bereshit 50:11', 'Bereschit 50,11'),
  },
  {
    month: 'Tevet', monthHe: 'טבת', tribe: 'dan', tribeHe: 'דן', sign: '♑', tziruf: 'היהו', night: 'יאדנ', letter: 'ע',
    senseHe: 'רוגז', sense: T('Гнев', 'Anger', 'Zorn'), organ: T('Печень', 'Liver', 'Leber'),
    stoneHe: 'לשם', stone: T('Лешем (янтарь)', 'Leshem (amber)', 'Leschem (Bernstein)'), stoneColor: '#f59e0b',
    gvulHe: 'גבול צפון רום', gvul: T('Север — Верх', 'North — Above', 'Norden — Oben'),
    sefirot: T('Гвура — Нецах', 'Gevurah — Netzach', 'Gewura — Nezach'), path: T('Тиферет → Ход', 'Tiferet → Hod', 'Tiferet → Hod'),
    season: join(SEASON_WINTER, T('работа при внешнем сокрытии, принятие ига Небес (кабалат оль) и выдержка.', 'serving when all is hidden outside; accepting the yoke of Heaven (kabbalat ol) and endurance.', 'Dienst, wenn außen alles verborgen ist; das Joch des Himmels annehmen (Kabbalat Ol) und Ausdauer.')),
    code: 'st', verse: 'ליהוה אתי ונרוממה שמו',
    verseT: T('«Возвеличьте Г-спода со мною, и превознесём Имя Его»', '“Exalt the L-rd with me, and let us extol His Name together”', '„Preist den Ewigen mit mir, lasst uns gemeinsam Seinen Namen erheben“'),
    verseSrc: T('Теґилим 34:4', 'Tehillim 34:4', 'Tehillim 34,4'),
  },
  {
    month: "Sh'vat", monthHe: 'שבט', tribe: 'asher', tribeHe: 'אשר', sign: '♒', tziruf: 'היוה', night: 'יאנד', letter: 'צ',
    senseHe: 'לעיטה', sense: T('Вкус (еда)', 'Taste (eating)', 'Geschmack (Essen)'), organ: T('Пищевод', 'Gullet', 'Speiseröhre'),
    stoneHe: 'תרשיש', stone: T('Таршиш (аквамарин)', 'Tarshish (aquamarine)', 'Tarschisch (Aquamarin)'), stoneColor: '#0ea5e9',
    gvulHe: 'גבול צפון מערב', gvul: T('Север — Запад', 'North — West', 'Norden — Westen'),
    sefirot: T('Гвура — Йесод', 'Gevurah — Yesod', 'Gewura — Jessod'), path: T('Нецах → Йесод', 'Netzach → Yesod', 'Nezach → Jessod'),
    season: join(SEASON_WINTER, T('скрытое пробуждение соков в земле (Ту би-Шват), освящение материального.', 'the hidden awakening of the sap in the earth (Tu BiShvat); making the material holy.', 'das verborgene Erwachen der Säfte in der Erde (Tu biSchwat); das Materielle wird geheiligt.')),
    code: 'rt', verse: 'המר ימירנו והיה הוא',
    verseT: T('«А если заменит его, то будет и оно…»', '“And if he exchanges it, then both it…”', '„Und wenn er es eintauscht, dann soll es…“'),
    verseSrc: T('Ваикра 27:33', 'Vayikra 27:33', 'Wajikra 27,33'),
  },
  {
    month: 'Adar', monthHe: 'אדר', tribe: 'naftali', tribeHe: 'נפתלי', sign: '♓', tziruf: 'ההיו', night: 'ידאנ', letter: 'ק',
    senseHe: 'שחוק', sense: T('Смех', 'Laughter', 'Lachen'), organ: T('Селезёнка', 'Spleen', 'Milz'),
    stoneHe: 'שבו', stone: T('Шво (агат)', 'Shevo (agate)', 'Schewo (Achat)'), stoneColor: '#d97706',
    gvulHe: 'גבול צפון תחת', gvul: T('Север — Низ', 'North — Below', 'Norden — Unten'),
    sefirot: T('Гвура — Ход', 'Gevurah — Hod', 'Gewura — Hod'), path: T('Ход → Йесод', 'Hod → Yesod', 'Hod → Jessod'),
    season: join(SEASON_WINTER, T('сокрытие прорывается сверхъестественной радостью (Пурим), судьба переворачивается к добру.', 'concealment breaks open with joy beyond nature (Purim); fate turns over to the good.', 'die Verborgenheit bricht durch übernatürliche Freude auf (Purim); das Schicksal wendet sich zum Guten.')),
    code: 'st', verse: 'עירה ולשרקה בני אתנו',
    verseT: T('«…к лозе — ослёнка, к ветви — сына ослицы своей»', '“…his foal to the vine, his donkey’s colt to the choice vine”', '„…an den Weinstock sein Füllen, an die Edelrebe das Junge seiner Eselin“'),
    verseSrc: T('Берешит 49:11', 'Bereshit 49:11', 'Bereschit 49,11'),
  },
].map((h) => ({ ...h, sign: `${h.sign}︎`, tziruf: [...h.tziruf].join('-'), night: [...h.night].join('-') })) as HourSign[];

/** the combinations of the Name Havayah, hour 1…12 → index 0…11 — the day */
export const TZIRUFIM = HOUR_SIGNS.map((h) => h.tziruf);
/** the combinations of the Name Adni — the night */
export const NIGHT_TZIRUFIM = HOUR_SIGNS.map((h) => h.night);
/** the Name of the hour: by day Havayah, by night Adni (owner, 27.11.2026: «днём дневное имя и ночью ночное») */
export const nameOfHour = (index: number, day: boolean) => (day ? TZIRUFIM : NIGHT_TZIRUFIM)[((index % 12) + 12) % 12];

/** the row of a halachic hour 1…12 */
export const hourSign = (hour: number) => HOUR_SIGNS[Math.min(12, Math.max(1, Math.round(hour))) - 1];

/** the text in the content language: Hebrew pages read the English (as the rest of the site's content) */
export const tr = (l: L, ui: string) => l[(ui in l ? ui : 'en') as Lang];

/** the words of the verse with the letters of the code marked: [before, letter, after] for each word */
export function verseCode(h: HourSign): [string, string, string][] {
  return h.verse
    .split(' ')
    .map((w, i) => (i < (h.skip ?? 0) ? [w, '', ''] : h.code === 'rt' ? ['', w[0], w.slice(1)] : [w.slice(0, -1), w[w.length - 1], '']));
}

const MONTHS: Record<Lang, string[]> = {
  ru: ['Нисан', 'Ияр', 'Сиван', 'Тамуз', 'Ав', 'Элул', 'Тишрей', 'Хешван', 'Кислев', 'Тевет', 'Шват', 'Адар'],
  en: ['Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul', 'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat', 'Adar'],
  de: ['Nissan', 'Ijar', 'Siwan', 'Tammus', 'Aw', 'Elul', 'Tischri', 'Cheschwan', 'Kislew', 'Tewet', 'Schwat', 'Adar'],
};
const TRIBES: Record<Lang, string[]> = {
  ru: ['Йеґуда', 'Иссахар', 'Звулун', 'Реувен', 'Шимон', 'Гад', 'Эфраим', 'Менаше', 'Биньямин', 'Дан', 'Ашер', 'Нафтали'],
  en: ['Yehudah', 'Yissachar', 'Zevulun', 'Reuven', 'Shimon', 'Gad', 'Ephraim', 'Menasheh', 'Binyamin', 'Dan', 'Asher', 'Naftali'],
  de: ['Jehuda', 'Jissachar', 'Swulun', 'Reuwen', 'Schimon', 'Gad', 'Efraim', 'Menasche', 'Binjamin', 'Dan', 'Ascher', 'Naftali'],
};
const SIGNS: Record<Lang | 'he', string[]> = {
  ru: ['Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'],
  en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  de: ['Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau', 'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische'],
  he: ['טלה', 'שור', 'תאומים', 'סרטן', 'אריה', 'בתולה', 'מאזנים', 'עקרב', 'קשת', 'גדי', 'דלי', 'דגים'],
};
/** the sign of hour 1…12: its name in the language of the page and in Hebrew (Sefer Yetzirah 5) */
export function signNames(hour: number, ui: string): { name: string; he: string } {
  const i = HOUR_SIGNS.indexOf(hourSign(hour));
  return { name: (SIGNS[ui as Lang] ?? (ui === 'he' ? SIGNS.he : SIGNS.en))[i], he: SIGNS.he[i] };
}

/** the month and the tribe of hour 1…12 in the language of the page (`he` — in Hebrew) */
export function hourNames(hour: number, ui: string): { month: string; tribe: string } {
  const h = hourSign(hour);
  const i = HOUR_SIGNS.indexOf(h);
  if (!(ui in MONTHS)) return ui === 'he' ? { month: h.monthHe, tribe: h.tribeHe } : { month: MONTHS.en[i], tribe: TRIBES.en[i] };
  return { month: MONTHS[ui as Lang][i], tribe: TRIBES[ui as Lang][i] };
}

export const KMINI_KEY = 'niflaot:clock-kmini';
export const loadKmini = (): boolean => {
  try {
    return localStorage.getItem(KMINI_KEY) !== '0';
  } catch {
    return true;
  }
};
