import type { Locale } from './config';

/**
 * Terms explained in a popover when tapped in lesson texts.
 * `re` matches the stem (any inflection); only the first occurrence per text block is marked.
 */
export interface Term {
  re: string;
  def: string;
}

const ru: Term[] = [
  { re: 'парцуф', def: '«Парцуф» — «облик, лицо». В каббале — целостная духовная «личность»; в уроке — образ, который человек показывает другим.' },
  { re: 'занав', def: '«Занав» — «хвост»: малое, низшее начало. В уроке — корень вожделения.' },
  { re: 'гиматри', def: 'Гиматрия — числовое значение слова: сумма значений его букв (א = 1, ב = 2 … ת = 400).' },
  { re: 'тикун', def: 'Тикун — «исправление»: возвращение вещи или черты характера к её истинному назначению.' },
  { re: 'сфир', def: 'Сфирот — десять Б-жественных качеств, через которые Всевышний творит и ведёт мир: Хохма, Бина, Хесед … Йесод, Малхут.' },
  { re: 'йесод', def: 'Йесод — «основа», девятая сфира: связь и передача. Мера праведника Йосефа.' },
  { re: 'хохм', def: 'Хохма — «мудрость»: первая вспышка мысли, первая из сфирот разума.' },
  { re: 'бин[аеуыо]', def: 'Бина — «понимание»: развитие и углубление мысли. В каббале называется «мать» (има).' },
  { re: 'цимцум', def: 'Цимцум — «сжатие»: Всевышний как бы скрывает Свой бесконечный свет, чтобы освободить место для мира.' },
  { re: 'решимо', def: 'Решимо — «след»: отпечаток света, оставшийся в пустом пространстве после цимцума.' },
  { re: 'ор хозер', def: 'Ор хозер — «отражённый свет»: свет, поднимающийся снизу вверх, от творения к Творцу.' },
  { re: 'тоу(?![а-яё])', def: 'Тоу — «хаос»: первичный мир, где огромный свет разбил «сосуды»; из их осколков строится мир исправления.' },
  { re: 'каббал', def: 'Каббала — внутреннее, тайное учение Торы о Б-жественном и о строении миров.' },
  { re: 'хасид', def: 'Хасидизм — путь служения, основанный Бааль Шем Товом: радость, вера и внутренний смысл Торы в каждом деле.' },
  { re: 'хабад', def: 'Хабад — хасидское движение (Любавич). Название составлено из первых букв слов Хохма, Бина, Даат.' },
  { re: 'бреслав', def: 'Бреслав — хасидское направление, основанное рабби Нахманом из Бреслава.' },
  { re: 'тфилин', def: 'Тфилин — кожаные коробочки с отрывками Торы, которые надевают на руку и на голову на утренней молитве в будни.' },
  { re: 'микв', def: 'Миква — собрание воды для ритуального очищения. В уроке — «собрание вод» третьего дня творения.' },
  { re: 'гемар', def: 'Гемара — основная часть Талмуда: обсуждение Мишны мудрецами.' },
  { re: 'зоар', def: 'Зоар — главная книга каббалы, комментарий к Торе.' },
  { re: 'тани[яиюе]', def: 'Тания — основная книга хасидизма Хабад; её автор — Алтер Ребе, рабби Шнеур-Залман из Ляд.' },
  { re: 'мидраш', def: 'Мидраш — толкования и рассказы мудрецов к Торе.' },
  { re: 'катнут', def: 'Катнут — «малость»: незрелое, суженное состояние сознания.' },
  { re: 'нид[аыу](?![а-яё])', def: 'Нида — состояние ритуальной отделённости женщины в определённые дни цикла.' },
  { re: 'шиур кома', def: 'Шиур кома — «мера величия»: образ строения Б-жественных качеств в древнем мидраше.' },
  { re: 'таргум', def: 'Таргум — древний арамейский перевод Торы.' },
  { re: 'мей ха-шилоах', def: '«Мей ха-Шилоах» — книга хасидских толкований к Торе рабби Мордехая-Йосефа из Ижбицы.' },
  { re: 'суккот', def: 'Суккот — осенний праздник шалашей, через несколько дней после Йом Кипура.' },
  { re: 'бааль а-турим', def: 'Бааль а-Турим — рабби Яаков бен Ашер (ок. 1269–1343), автор кодекса «Арбаа турим». Так называют и его комментарий к Торе: гиматрии, первые и последние буквы слов, наблюдения масоры.' },
  { re: 'масор', def: 'Масора — традиция точного написания текста Танаха. Масореты отметили, сколько раз встречается каждое слово и как оно написано — полно или неполно.' },
  { re: 'нотарикон', def: 'Нотарикон — прочтение слова как аббревиатуры: каждая его буква — начало отдельного слова.' },
  { re: 'авдал', def: 'Авдала — «разделение»: благословение на исходе субботы над вином, благовониями и пламенем свечи.' },
  { re: 'мазал', def: 'Мазаль — небесный покровитель, «звезда», через которую до каждой вещи доходит её жизненная сила.' },
  { re: 'колесниц', def: 'Деяние Колесницы (Маасе Меркава) — тайное учение о видении Б-жественной Колесницы у пророка Йехезкеля.' },
];

const en: Term[] = [
  { re: 'partzuf', def: '“Partzuf” — “countenance, face”. In Kabbalah, a complete spiritual “persona”; in the lesson, the image a person shows to others.' },
  { re: 'zanav', def: '“Zanav” — “tail”: the small, lower aspect. In the lesson, the root of desire.' },
  { re: 'gematria', def: 'Gematria — the numerical value of a word: the sum of its letters (א = 1, ב = 2 … ת = 400).' },
  { re: 'tikun', def: 'Tikun — “rectification”: returning a thing or a character trait to its true purpose.' },
  { re: 'sefir', def: 'Sefirot — the ten Divine attributes through which G-d creates and guides the world: Chochmah, Binah, Chesed … Yesod, Malchut.' },
  { re: 'yesod', def: 'Yesod — “foundation”, the ninth sefirah: connection and transmission. The attribute of Yosef the tzaddik.' },
  { re: 'chochmah', def: 'Chochmah — “wisdom”: the first flash of thought, the first of the intellectual sefirot.' },
  { re: 'binah', def: 'Binah — “understanding”: developing and deepening a thought. In Kabbalah it is called “mother” (ima).' },
  { re: 'tzimtzum', def: 'Tzimtzum — “contraction”: G-d, as it were, conceals His infinite light to make room for the world.' },
  { re: 'reshimu', def: 'Reshimu — “impression”: the trace of light left in the empty space after the tzimtzum.' },
  { re: 'or chozer', def: 'Or chozer — “returning light”: light rising from below upward, from creation to the Creator.' },
  { re: 'tohu(?![a-z])', def: 'Tohu — “chaos”: the primordial world where great light shattered the “vessels”; the world of rectification is built from their fragments.' },
  { re: 'kabbalah', def: 'Kabbalah — the inner, hidden teaching of the Torah about the Divine and the structure of the worlds.' },
  { re: 'chassid', def: 'Chassidut — the path of Divine service founded by the Baal Shem Tov: joy, faith and the inner meaning of Torah in everything.' },
  { re: 'chabad', def: 'Chabad — the Chassidic movement of Lubavitch; its name is an acronym of Chochmah, Binah, Daat.' },
  { re: 'breslov', def: 'Breslov — the Chassidic path founded by Rabbi Nachman of Breslov.' },
  { re: 'tefillin', def: 'Tefillin — leather boxes containing Torah passages, worn on the arm and head during weekday morning prayer.' },
  { re: 'mikveh', def: 'Mikveh — a gathering of water for ritual purification. In the lesson, the “gathering of waters” of the third day.' },
  { re: 'gemara', def: 'Gemara — the main body of the Talmud: the Sages’ discussion of the Mishnah.' },
  { re: 'zohar', def: 'Zohar — the central book of Kabbalah, a commentary on the Torah.' },
  { re: 'tanya', def: 'Tanya — the fundamental book of Chabad Chassidut, by the Alter Rebbe, Rabbi Schneur Zalman of Liadi.' },
  { re: 'midrash', def: 'Midrash — the Sages’ interpretations and stories on the Torah.' },
  { re: 'katnut', def: 'Katnut — “smallness”: an immature, narrowed state of consciousness.' },
  { re: 'niddah', def: 'Niddah — a woman’s state of ritual separation during certain days of her cycle.' },
  { re: 'shiur komah', def: 'Shiur komah — “the measure of the stature”: an image of the structure of the Divine attributes in an ancient midrash.' },
  { re: 'targum', def: 'Targum — the ancient Aramaic translation of the Torah.' },
  { re: 'mei hashiloach', def: '“Mei HaShiloach” — a book of Chassidic Torah commentary by Rabbi Mordechai Yosef of Izbica.' },
  { re: 'sukkot', def: 'Sukkot — the autumn festival of booths, a few days after Yom Kippur.' },
  { re: 'baal haturim', def: 'Baal HaTurim — Rabbi Yaakov ben Asher (c. 1269–1343), author of the law code “Arba’ah Turim”. The name also refers to his Torah commentary: gematria, first and last letters of words, observations of the Masorah.' },
  { re: 'masor', def: 'Masorah — the tradition of the exact text of Tanakh. The Masoretes noted how many times each word appears and how it is spelled — in full or defectively.' },
  { re: 'notarikon', def: 'Notarikon — reading a word as an acronym: each of its letters begins a separate word.' },
  { re: 'havdal', def: 'Havdalah — “separation”: the blessing at the end of Shabbat over wine, spices and the flame of a candle.' },
  { re: 'mazal', def: 'Mazal — a heavenly guardian, a “star” through which each thing receives its life force.' },
  { re: 'chariot', def: 'The Work of the Chariot (Ma’aseh Merkavah) — the secret teaching about the vision of the Divine Chariot in the prophet Ezekiel.' },
];

const de: Term[] = [
  { re: 'parzuf', def: '„Parzuf“ — „Antlitz, Gesicht“. In der Kabbala eine vollständige geistige „Person“; in der Lektion das Bild, das ein Mensch anderen zeigt.' },
  { re: 'sanaw', def: '„Sanaw“ — „Schwanz“: das Kleine, Niedere. In der Lektion die Wurzel der Begierde.' },
  { re: 'gematria', def: 'Gematria — der Zahlenwert eines Wortes: die Summe seiner Buchstaben (א = 1, ב = 2 … ת = 400).' },
  { re: 'tikkun', def: 'Tikkun — „Berichtigung“: eine Sache oder Charaktereigenschaft zu ihrer wahren Bestimmung zurückführen.' },
  { re: 'sefir', def: 'Sefirot — die zehn g-ttlichen Eigenschaften, durch die G-tt die Welt erschafft und lenkt: Chochma, Bina, Chessed … Jessod, Malchut.' },
  { re: 'jessod', def: 'Jessod — „Grundlage“, die neunte Sefira: Verbindung und Weitergabe. Die Eigenschaft Josefs, des Zaddiks.' },
  { re: 'chochma', def: 'Chochma — „Weisheit“: der erste Blitz des Gedankens, die erste der Sefirot des Verstandes.' },
  { re: 'bina(?![a-zäöüß])', def: 'Bina — „Verständnis“: Entfaltung und Vertiefung eines Gedankens. In der Kabbala heißt sie „Mutter“ (Ima).' },
  { re: 'zimzum', def: 'Zimzum — „Zusammenziehung“: G-tt verbirgt gleichsam Sein unendliches Licht, um der Welt Raum zu geben.' },
  { re: 'reschimu', def: 'Reschimu — „Spur“: der Abdruck des Lichtes, der nach dem Zimzum im leeren Raum zurückblieb.' },
  { re: 'or chosser', def: 'Or Chosser — „zurückkehrendes Licht“: Licht, das von unten nach oben steigt, vom Geschöpf zum Schöpfer.' },
  { re: 'tohu(?![a-zäöüß])', def: 'Tohu — „Chaos“: die Urwelt, in der ein gewaltiges Licht die „Gefäße“ zerbrach; aus ihren Scherben wird die Welt der Berichtigung gebaut.' },
  { re: 'kabbala', def: 'Kabbala — die innere, verborgene Lehre der Tora über das G-ttliche und den Aufbau der Welten.' },
  { re: 'chassid', def: 'Chassidut — der vom Baal Schem Tov begründete Weg des Dienstes: Freude, Glaube und der innere Sinn der Tora in jeder Sache.' },
  { re: 'chabad', def: 'Chabad — die chassidische Bewegung von Lubawitsch; der Name setzt sich aus den Anfangsbuchstaben von Chochma, Bina, Daat zusammen.' },
  { re: 'breslow', def: 'Breslow — die chassidische Richtung, die Rabbi Nachman von Breslow begründet hat.' },
  { re: 'tefillin', def: 'Tefillin — Lederkapseln mit Abschnitten der Tora, die beim Morgengebet an Wochentagen an Arm und Kopf gelegt werden.' },
  { re: 'mikwe', def: 'Mikwe — eine Wasseransammlung zur rituellen Reinigung. In der Lektion die „Sammlung der Wasser“ des dritten Tages.' },
  { re: 'gemara', def: 'Gemara — der Hauptteil des Talmuds: die Erörterung der Mischna durch die Weisen.' },
  { re: 'sohar', def: 'Sohar — das Hauptbuch der Kabbala, ein Kommentar zur Tora.' },
  { re: 'tanja', def: 'Tanja — das grundlegende Buch des Chabad-Chassidismus; sein Verfasser ist der Alter Rebbe, Rabbi Schneur Salman von Ljadi.' },
  { re: 'midrasch', def: 'Midrasch — Auslegungen und Erzählungen der Weisen zur Tora.' },
  { re: 'katnut', def: 'Katnut — „Kleinheit“: ein unreifer, verengter Bewusstseinszustand.' },
  { re: 'nidda', def: 'Nidda — der Zustand ritueller Trennung der Frau an bestimmten Tagen ihres Zyklus.' },
  { re: 'schiur koma', def: 'Schiur Koma — „Maß der Gestalt“: ein Bild des Aufbaus der g-ttlichen Eigenschaften in einem alten Midrasch.' },
  { re: 'targum', def: 'Targum — die alte aramäische Übersetzung der Tora.' },
  { re: 'mei haschiloach', def: '„Mei HaSchiloach“ — ein Buch chassidischer Toraauslegungen von Rabbi Mordechai Josef von Izbica.' },
  { re: 'sukkot', def: 'Sukkot — das Laubhüttenfest im Herbst, wenige Tage nach Jom Kippur.' },
  { re: 'baal haturim', def: 'Baal HaTurim — Rabbi Jaakow ben Ascher (um 1269–1343), Verfasser des Gesetzeskodex „Arba’a Turim“. So heißt auch sein Torakommentar: Gematrien, Anfangs- und Endbuchstaben von Wörtern, Beobachtungen der Massora.' },
  { re: 'massor', def: 'Massora — die Überlieferung des genauen Textes des Tanach. Die Masoreten vermerkten, wie oft jedes Wort vorkommt und wie es geschrieben ist — voll oder mangelhaft.' },
  { re: 'notarikon', def: 'Notarikon — das Lesen eines Wortes als Abkürzung: Jeder seiner Buchstaben beginnt ein eigenes Wort.' },
  { re: 'hawdal', def: 'Hawdala — „Trennung“: der Segen am Ausgang des Schabbats über Wein, Gewürze und die Flamme einer Kerze.' },
  { re: 'masal', def: 'Masal — ein himmlischer Hüter, ein „Stern“, durch den jedes Ding seine Lebenskraft empfängt.' },
  { re: 'wagen', def: 'Das Werk des Wagens (Ma’asse Merkawa) — die geheime Lehre über die Vision des g-ttlichen Wagens beim Propheten Jecheskel.' },
];

export const GLOSSARY: Partial<Record<Locale, Term[]>> = { ru, en, de };

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Marks the first occurrence of each glossary term in an HTML string (text outside tags only)
 * with <span class="term" data-def="…">. Matches are found in the original text and never overlap.
 */
export function withTerms(html: string, locale: Locale): string {
  const terms = GLOSSARY[locale];
  if (!terms) return html;
  const used = new Set<number>();
  return html
    .split(/(<[^>]+>)/)
    .map((part) => {
      if (part.startsWith('<') || !part.trim()) return part;
      const hits: { at: number; end: number; def: string }[] = [];
      terms.forEach((term, i) => {
        if (used.has(i)) return;
        const m = new RegExp(`(^|[^\\p{L}])(${term.re}[\\p{L}-]*)`, 'iu').exec(part);
        if (!m) return;
        const at = m.index + m[1].length;
        const end = at + m[2].length;
        if (hits.some((h) => at < h.end && end > h.at)) return;
        used.add(i);
        hits.push({ at, end, def: term.def });
      });
      hits.sort((a, b) => b.at - a.at);
      let out = part;
      for (const h of hits)
        out = `${out.slice(0, h.at)}<span class="term" tabindex="0" role="button" data-def="${escapeAttr(h.def)}">${out.slice(h.at, h.end)}</span>${out.slice(h.end)}`;
      return out;
    })
    .join('');
}
