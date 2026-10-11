import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Baal HaTurim: Noach',
  hero: {
    heading: 'Baal HaTurim: <i>fünf Rätsel über Noach und die Sintflut</i>',
    author: 'nach dem Kommentar des Baal HaTurim, Rabbi Jaakow ben Ascher',
    intro:
      'Der Baal HaTurim hat im Wochenabschnitt Noach Zahlen und versteckte Wörter gefunden. Rechne selbst nach: wie Noach war, wie viele Tage die Sintflut dauerte, wer noch mit der Arche gerettet wurde und was nach der Sintflut geschah — mit dem Wein, dem Turm und der Sprache; und wie man im Atbasch und »mit dem Kolel« zählt.',
  },
  summary:
    'Der Abschnitt Noach mit den Augen des Baal HaTurim: »Chamas« = »die Wasser Noachs«, »Kez« — 190 Tage Sintflut, der »Zohar« — ein leuchtender Stein, »ach Noach« = Og, Wein = Wehklage, und das »Wohlan!« der Turmbauer versteckt »sorglosen Wohlstand«, und Sara ist im Atbasch Jiska.',
  glossary: {
    'נח': 'Noach (der Name bedeutet »Ruhe«, »angenehm«)',
    'היה': '»war«',
    'תמים היה': '»untadelig war er«',
    'האלהים התהלך נח': '»mit G-tt wandelte Noach«',
    'חכם': 'ein Weiser',
    'חמס': 'Gewalttat, Raub',
    'מי נח': 'die Wasser Noachs',
    'גיהנם': 'Gehinnom — wo die Seele nach dem Tod gereinigt wird',
    'מבול': 'Sintflut',
    'תיבה': 'Arche',
    'גשם': 'Regen',
    'קץ': 'Ende',
    'משחיתם': '»Ich vernichte sie«',
    'משחיתם את הארץ': '»Ich vernichte sie mit der Erde«',
    'מאה': 'hundert',
    'היא שלשה טפחים': '»das sind drei Handbreiten« (drei Tefachim)',
    'צהר': 'Zohar — ein Fenster, die Lichtquelle in der Arche',
    'לאור האבן': '»für das Licht des Steins«',
    'לאור החלון': '»für das Licht des Fensters«',
    'אור הירח': '»das Licht des Mondes«',
    'חלון גדול': '»ein großes Fenster«',
    'לשבעת': '»nach sieben …«',
    'הימים': '»… Tagen«',
    'לשבעת הימים': '»nach den sieben Tagen«',
    'לימי אבל מתושלח': '»für die Tage der Trauer um Metuschelach«',
    'לימי המבול': '»für die Tage der Sintflut«',
    'לימי שמחה': '»für Tage der Freude«',
    'לימי גשם': '»für Tage des Regens«',
    'מתושלח': 'Metuschelach, Noachs Großvater',
    'היקום אשר עשיתי': '»alles Bestehende, das Ich gemacht habe«',
    'לא חיים לתחיית המתים': '»sie werden nicht leben bei der Auferstehung der Toten«',
    'טוב': 'gut',
    'אך': '»nur«',
    'אך נח': '»nur Noach«',
    'עוג': 'Og, der Riese, König von Baschan',
    'שם': 'Schem, Sohn Noachs',
    'חם': 'Cham, Sohn Noachs',
    'יפת': 'Jefet, Sohn Noachs',
    'מקים את בריתי אתכם': '»Ich errichte Meinen Bund mit euch«',
    'מתים': 'die Toten',
    'היין': 'der Wein',
    'יללה': 'Wehklage',
    'שמחה': 'Freude',
    'כרם': 'Weinberg',
    'ענבים': 'Weintrauben',
    'ויתגל': '»und er entblößte sich«',
    'גליות': 'Verbannungen, Exile',
    'יהיה': '»soll sein«',
    'איש אל רעהו הבה': '»einer zum anderen: wohlan«',
    'שלוה': 'sorgloser Wohlstand',
    'שפה': 'Sprache (wörtlich »Lippe«)',
    'אחת': 'eine, eins',
    'שפה אחת': '»eine Sprache«',
    'לשון הקדש': 'die heilige Sprache — das Hebräisch der Tora',
    'שפה ברורה': '»eine klare Sprache«',
    'לשון זהב': '»eine goldene Zunge«',
    'שפת עבר': '»die Sprache Ewers«',
    'שרה': 'Sara',
    'בגץ': '»bgz« — der Name שרה im Atbasch',
    'יסכה': 'Jiska, Tochter Harans',
    'רבקה': 'Riwka',
    'רחל': 'Rachel',
    'לאה': 'Lea',
  },
  translit: {
    'היה': 'haja',
    'חמס': 'chamas',
    'קץ': 'kez',
    'צהר': 'zohar',
    'לשבעת': 'leschiwat',
    'הימים': 'hajamim',
    'אך': 'ach',
    'נח': 'Noach',
    'היין': 'hajajin',
    'יהיה': 'jihje',
    'שפה': 'safa',
    'אחת': 'achat',
    'שרה': 'Sara',
  },
  riddles: [
    {
      title: 'Noach, der Zaddik',
      cond: `<p>Der Baal HaTurim — Rabbi Jaakow ben Ascher (ca. 1269–1343), Verfasser des Gesetzbuchs »Arbaa Turim«. Zu jedem Vers der Tora hat er kurze Hinweise geschrieben: Gematria, erste und letzte Buchstaben von Wörtern, Wörter, die im ganzen Tanach genau zwei- oder dreimal vorkommen. Der Abschnitt Noach beginnt so:</p><p class="verse" dir="rtl" lang="he">אלה תולדת נח נח איש צדיק תמים היה בדרתיו את האלקים התהלך נח</p><p>»Dies sind die Nachkommen Noachs. Noach war ein gerechter Mann, untadelig in seinen Generationen; mit G-tt wandelte Noach.«<sup data-src="gen-6-9"></sup></p><p>Und zwei Verse später: »und die Erde wurde voll <em>חמס</em> — Gewalttat.«</p>`,
      steps: [
        {
          q: 'Wie oft steht in diesem Vers der Name <span class="he">נח</span> — Noach?',
          hint: 'Geh den Vers Wort für Wort durch und zähle jedes נח.',
        },
        {
          q: '»Untadelig <span class="he">היה</span> — war er.« Wie viel ist das Wort <span class="he">היה</span> wert?',
          hint: '5 + 10 + 5.',
        },
        {
          q: 'Bilde ein Wort aus den <b>letzten</b> Buchstaben der Wörter <span class="he">האלקים התהלך נח</span> (»mit G-tt wandelte Noach«). Du darfst die Buchstaben umstellen.',
          hint: 'Die letzten Buchstaben leuchten. Es entsteht ein Wort, das »ein Weiser« bedeutet.',
        },
        {
          q: 'Wie viel ist das Wort <span class="he">חמס</span> — »Gewalttat« — wert?',
          hint: '8 + 40 + 60.',
        },
        {
          q: 'Der Baal HaTurim hat einen Ausdruck mit derselben Gematria gefunden — er sagt, <b>womit</b> die Generation der Sintflut bestraft wurde. Welchen?',
          opts: ['»die Wasser Noachs«', '»Sintflut«', '»Arche«', '»Regen«'],
        },
      ],
      reveal: {
        h: 'Ein weiser Zaddik und »die Wasser Noachs«',
        p: 'Noachs Name steht im Vers dreimal: Noach sah drei Welten. »Haja« — »war« — ist 20: Noach war untadelig in allen zwanzig Generationen von Adam bis Awraham. Die letzten Buchstaben von »mit G-tt wandelte Noach« ergeben »Chacham« — ein Weiser. Und »Chamas«, Gewalttat, ist 108 — wie »mej Noach«, »die Wasser Noachs«: Maß für Maß.',
      },
      lessons: [
        {
          h: 'Wie man den Baal HaTurim liest',
          b: `<p>Der Kommentar des Baal HaTurim steht in fast jedem Chumasch. Er besteht aus kurzen Hinweisen. Seine Werkzeuge: <b>Gematria</b> — zwei Ausdrücke mit derselben Zahl hängen in ihrer Bedeutung zusammen; <b>Raschej Tewot und Sofej Tewot</b> (<span class="he">ר״ת</span>, <span class="he">ס״ת</span>) — die ersten oder letzten Buchstaben benachbarter Wörter ergeben ein neues Wort; <b>»zwei- oder dreimal in der Masora«</b> — ein Wort kommt im ganzen Tanach genau zwei- oder dreimal vor, und diese Stellen erklären einander. Manchmal zählt er auch anders — »mit dem Kolel« oder im Atbasch (Rätsel 5).</p><p>Jede Zahl in dieser Lektion wurde geprüft. Einige Gematriot des Kommentars zum Abschnitt Noach stimmen in unserer Rechnung nicht — sie sind nicht in der Lektion.</p>`,
        },
        {
          h: '»Dies sind die Nachkommen«',
          b: `<p>Der Baal HaTurim vergleicht vier Stellen, an denen die Tora sagt „dies sind die Nachkommen“ (<i>ele toldot</i>): Jedes Mal beginnt mit diesen Worten etwas Neues, und das Frühere bleibt zurück.<sup data-src="bht-6-9"></sup></p><p class="expl"><b>Erklärung.</b> Mit Noach beginnt die Geschichte neu.</p>`,
        },
        {
          h: 'Noach, Noach, Noach',
          b: `<p>Alle drei Erklärungen sagen, warum der Name <span class="he">נח</span> im ersten Vers des Abschnitts dreimal steht: drei Welten, drei Gerettete durch das Verdienst eines Zaddiks und „angenehm“ — so kann man den Namen <span class="he">נח</span> selbst lesen.<sup data-src="bht-6-9"></sup></p>`,
        },
        {
          h: 'Zwanzig Generationen untadelig',
          b: `<p><span class="he">היה</span> = 5 + 10 + 5 = 20 — so viele Generationen sind es von Adam bis Awraham.<sup data-src="bht-6-9"></sup></p><p class="expl"><b>Erklärung.</b> Von Adam bis Noach sind es zehn Generationen, von Noach bis Awraham noch einmal zehn. Noach lebte so lange, dass er sie alle sah.</p>`,
        },
        {
          h: 'Ein Weiser',
          b: `<p>Die letzten Buchstaben von <span class="he">האלקים התהלך נח</span> — <span class="he">ם</span>, <span class="he">ך</span>, <span class="he">ח</span> — ergeben <span class="he">חכם</span>.<sup data-src="bht-6-9"></sup> Der Vers, den der Baal HaTurim bringt, steht in Mischle: „Die Frucht des Gerechten ist ein Baum des Lebens, und wer Seelen gewinnt, ist weise.“<sup data-src="prov-11-30"></sup></p>`,
        },
        {
          h: 'Gewalttat und Wasser',
          b: `<p><span class="he">חמס</span> = 8 + 40 + 60 = 108; <span class="he">מי נח</span> = 50 + 58 = 108; <span class="he">גיהנם</span> = 3 + 10 + 5 + 50 + 40 = 108.<sup data-src="bht-6-11-2"></sup></p><p class="expl"><b>Erklärung.</b> Die Generation der Sintflut raubte — und wurde von den „Wassern Noachs“ weggespült; „kochendes Wasser“ heißt, dass das Wasser der Sintflut heiß war.</p>`,
        },
      ],
      reflection: 'Noach war »angenehm dem Himmel und den Menschen«. Wem kann ich heute eine Freude machen — dem Allmächtigen und dem Menschen neben mir?',
      takeaways: [
        'Der Name נח dreimal im Vers: Noach sah drei Welten; er rettete drei Söhne — so wie Daniel und Ijow drei retteten.',
        'היה = 20: Noach war zwanzig Generationen untadelig, von Adam bis Awraham.',
        'Die letzten Buchstaben von »האלקים התהלך נח« — חכם: »wer Seelen gewinnt, ist weise«.',
        'חמס = 108 = מי נח = גיהנם: Maß für Maß.',
      ],
    },
    {
      title: 'Die Arche',
      cond: `<p>Der Allmächtige sagt zu Noach:</p><p class="verse" dir="rtl" lang="he">קץ כל בשר בא לפני כי מלאה הארץ חמס מפניהם והנני משחיתם את הארץ</p><p>»Das Ende allen Fleisches ist vor Mich gekommen, denn die Erde ist voll Gewalttat durch sie, und siehe, Ich vernichte sie mit der Erde.«</p><p>Und Er sagt ihm, er soll eine Arche bauen — dreihundert Ellen lang, fünfzig breit, dreißig hoch — und darin einen <em>צהר</em> machen, eine Lichtquelle.<sup data-src="gen-6-13"></sup></p>`,
      steps: [
        {
          q: 'Der Baal HaTurim: Das Wort <span class="he">קץ</span> — »Ende« — deutet an, <b>wie viele Tage</b> die Sintflut dauerte. Wie viel ist es wert?',
          hint: '100 + 90.',
        },
        {
          q: 'Vierzig Tage regnete es. Wie viele Tage danach <b>stieg</b> das Wasser noch, wenn es insgesamt so viele Tage sind, wie das Wort <span class="he">קץ</span> wert ist?',
          hint: 'Zieh vom Wert des Wortes קץ 40 ab.',
        },
        {
          q: 'Bilde ein Wort aus den <b>ersten</b> Buchstaben der Wörter <span class="he">משחיתם את הארץ</span> (»Ich vernichte sie mit der Erde«). Du darfst die Buchstaben umstellen.',
          hint: 'Die ersten Buchstaben leuchten. Es entsteht eine Zahl — wie viele Ellen groß die Menschen vor der Sintflut waren.',
        },
        {
          q: 'Wie viel ist das Wort <span class="he">צהר</span> wert — der »Zohar«, die Lichtquelle in der Arche?',
          hint: '90 + 5 + 200.',
        },
        {
          q: 'Welcher Ausdruck hat dieselbe Gematria — und sagt, <b>was</b> der Zohar war?',
          opts: ['»für das Licht des Steins«', '»für das Licht des Fensters«', '»das Licht des Mondes«', '»ein großes Fenster«'],
        },
      ],
      reveal: {
        h: 'Hundertneunzig Tage und ein leuchtender Stein',
        p: '»Kez« — »Ende« — ist 190: vierzig Tage Regen und hundertfünfzig Tage, in denen das Wasser stieg. Die ersten Buchstaben von »Ich vernichte sie mit der Erde« ergeben »Mea« — hundert: Die Menschen waren hundert Ellen groß. Und der »Zohar« ist 295 — wie »le-or ha-ewen«, »für das Licht des Steins«: Ein Edelstein machte die Arche hell.',
      },
      lessons: [
        {
          h: 'Das Ende — 190 Tage',
          b: `<p>40 Tage Regen + 150 Tage, in denen das Wasser stieg, = 190 = <span class="he">קץ</span> (100 + 90).<sup data-src="bht-6-13-1"></sup></p>`,
        },
        {
          h: 'Hundert Ellen groß',
          b: `<p>Die ersten Buchstaben von <span class="he">משחיתם את הארץ</span> — <span class="he">מ</span>, <span class="he">א</span>, <span class="he">ה</span> — ergeben <span class="he">מאה</span>, „hundert“.<sup data-src="bht-6-13-6"></sup></p>`,
        },
        {
          h: 'Drei Handbreiten Erde',
          b: `<p><span class="he">משחיתם</span> = 40 + 300 + 8 + 10 + 400 + 40 = 798 = <span class="he">היא שלשה טפחים</span> (16 + 635 + 147).<sup data-src="bht-6-13-4"></sup> Welche drei Handbreiten? Raschi erklärt: Die Erde selbst wurde so tief weggespült, wie ein Pflug geht — drei Handbreiten.<sup data-src="rashi-6-13"></sup></p>`,
        },
        {
          h: 'Ein Stein, der leuchtete',
          b: `<p>Raschi bringt zwei Meinungen über den Zohar: ein Fenster oder ein leuchtender Stein.<sup data-src="rashi-6-16"></sup> Die Gematria des Baal HaTurim spricht für die zweite: <span class="he">צהר</span> = 90 + 5 + 200 = 295 = <span class="he">לאור האבן</span> (237 + 58).<sup data-src="bht-6-16-1"></sup></p>`,
        },
      ],
      reflection: 'Ein Stein machte die Arche hell, während draußen das Wasser tobte. Was gibt mir von innen Licht, wenn es draußen schwer ist?',
      takeaways: [
        'קץ = 190 = 40 Tage Regen + 150 Tage steigendes Wasser.',
        'Die ersten Buchstaben von »משחיתם את הארץ« — מאה: Die Menschen waren hundert Ellen groß.',
        'משחיתם = 798 = היא שלשה טפחים: Sogar die oberste Erdschicht wurde weggespült, so tief wie ein Pflug.',
        'צהר = 295 = לאור האבן: Ein Edelstein machte die Arche hell.',
      ],
    },
    {
      title: 'Die Sintflut und der Bund',
      cond: `<p>Vor der Sintflut wartete der Allmächtige sieben Tage:</p><p class="verse" dir="rtl" lang="he">ויהי לשבעת הימים ומי המבול היו על הארץ</p><p>»Und es geschah nach den sieben Tagen, da waren die Wasser der Sintflut auf der Erde.«<sup data-src="gen-7-10"></sup></p><p>Die Sintflut löschte alles Lebendige aus, und nur von einem heißt es: <em>וישאר אך נח ואשר אתו בתבה</em> — »und nur Noach blieb übrig und die mit ihm in der Arche waren.«<sup data-src="gen-7-23"></sup> Und nach der Sintflut sagt der Allmächtige: <em>הנני מקים את בריתי אתכם</em> — »siehe, Ich errichte Meinen Bund mit euch.«<sup data-src="gen-9-9"></sup></p>`,
      steps: [
        {
          q: 'Wie viel sind die Wörter <span class="he">לשבעת הימים</span> — »nach den sieben Tagen« — wert?',
          hint: 'לשבעת = 30 + 300 + 2 + 70 + 400; הימים = 5 + 10 + 40 + 10 + 40.',
        },
        {
          q: 'Der Baal HaTurim hat einen Ausdruck mit derselben Gematria gefunden — er erklärt, <b>wozu</b> diese sieben Tage waren. Welchen?',
          opts: ['»für die Tage der Trauer um Metuschelach«', '»für die Tage der Sintflut«', '»für Tage der Freude«', '»für Tage des Regens«'],
        },
        {
          q: 'Wie viel sind die Wörter <span class="he">אך נח</span> — »nur Noach« — wert?',
          hint: 'אך = 1 + 20; נח = 50 + 8.',
        },
        {
          q: 'Der Baal HaTurim: Mit Noach wurde noch jemand gerettet — sein Name hat dieselbe Gematria. Wer?',
          opts: ['Og, der Riese', 'Schem, Sohn Noachs', 'Cham, Sohn Noachs', 'Jefet, Sohn Noachs'],
        },
        {
          q: 'Bilde ein Wort aus den <b>letzten</b> Buchstaben der Wörter <span class="he">מקים את בריתי אתכם</span> (»Ich errichte Meinen Bund mit euch«). Du darfst die Buchstaben umstellen.',
          hint: 'Die letzten Buchstaben leuchten. Es entsteht ein Wort, das »die Toten« bedeutet.',
        },
      ],
      reveal: {
        h: 'Trauer, ein Riese und ein Versprechen des Lebens',
        p: '»Le-schiwat ha-jamim« ist 907, wie »für die Tage der Trauer um Metuschelach«: Der Allmächtige hielt die Sintflut zurück, solange man um den Zaddik trauerte. »Ach Noach« ist 79 — wie Og: Auch der Riese wurde gerettet. Und die letzten Buchstaben von »Ich errichte Meinen Bund mit euch« ergeben »Metim« — die Toten: Der Bund ist ein Versprechen, dass die Toten wieder leben werden.',
      },
      lessons: [
        {
          h: 'Sie werden nicht leben',
          b: `<p>Sieben Tage vor der Sintflut sagte der Allmächtige: „und Ich lösche aus <span class="he">את כל היקום אשר עשיתי</span>.“<sup data-src="gen-7-4"></sup> Beide Sätze haben die Gematria 1452.<sup data-src="bht-7-4"></sup></p><p>Die dritte Stelle des Wortes <span class="he">היקום</span> spricht von Datan und Awiram, den Leuten Korachs, die die Erde „mit all ihrem Besitz“ verschlang.<sup data-src="deut-11-6"></sup></p>`,
        },
        {
          h: 'Sieben Tage Trauer',
          b: `<p><span class="he">לשבעת</span> = 802, <span class="he">הימים</span> = 105, zusammen 907 = <span class="he">לימי אבל מתושלח</span>.<sup data-src="bht-7-10"></sup> Von denselben sieben Tagen der Trauer schreibt auch Raschi — zu den Worten „noch sieben Tage“ (7,4).<sup data-src="rashi-7-4"></sup></p>`,
        },
        {
          h: 'Der Siebzehnte — »tow«',
          b: `<p>Die Sintflut begann „am siebzehnten Tag des Monats“,<sup data-src="gen-7-11"></sup> und <span class="he">טוב</span> = 9 + 6 + 2 = 17. Die Worte „sie verbringen ihre Tage im Guten“ stehen im Buch Ijow, über die Bösen.<sup data-src="job-21-13"></sup></p><p class="expl"><b>Erklärung.</b> Die Generation der Sintflut lebte im Überfluss und im Guten — und am »Tag des Guten« kam die Strafe.</p><p>Die zweite Gematria dieses Kommentars — „und die Fenster des Himmels“ — stimmt in unserer Rechnung nicht (1016 und 1011), darum ist sie nicht in den Rätseln.<sup data-src="bht-7-11"></sup></p>`,
        },
        {
          h: 'Und Og blieb übrig',
          b: `<p>Zwei Einschränkungen hintereinander — <span class="he">וישאר</span> („blieb übrig“) und <span class="he">אך</span> („nur“).<sup data-src="bht-7-23"></sup> Die Gematria: <span class="he">אך נח</span> = 21 + 58 = 79 = <span class="he">עוג</span> (70 + 6 + 3).</p><p class="expl"><b>Erklärung.</b> Og ist der Riese, der viele Jahre später König von Baschan wurde.</p>`,
        },
        {
          h: 'Der Bund — ein Versprechen des Lebens',
          b: `<p>Die letzten Buchstaben von <span class="he">מקים את בריתי אתכם</span> — <span class="he">ם</span>, <span class="he">ת</span>, <span class="he">י</span>, <span class="he">ם</span> — ergeben <span class="he">מתים</span>.<sup data-src="bht-9-9"></sup></p><p class="expl"><b>Erklärung.</b> So endet die Geschichte, die mit »alles Bestehende wird nicht leben« begann, mit einem Versprechen: Die Toten werden wieder leben.</p>`,
        },
      ],
      reflection: 'Der Allmächtige hielt die Sintflut zurück, um um einen Zaddik zu trauern. Welche guten Menschen um mich herum schätze ich — und sage ich es ihnen, solange sie da sind?',
      takeaways: [
        'היקום אשר עשיתי = 1452 = לא חיים לתחיית המתים; Reichtum ohne Dankbarkeit führt zur Sünde — bei der Sintflut und bei Korach.',
        'לשבעת הימים = 907 = לימי אבל מתושלח: sieben Tage Trauer um einen Zaddik.',
        'טוב = 17: Die Sintflut kam am Siebzehnten — zu denen, die »ihre Tage im Guten verbrachten«.',
        'אך נח = 79 = עוג: Auch Og wurde gerettet.',
        'Die letzten Buchstaben von »מקים את בריתי אתכם« — מתים: Der Bund ist ein Versprechen der Auferstehung der Toten.',
      ],
    },
    {
      title: 'Der Wein und der Turm',
      cond: `<p>Nach der Sintflut pflanzte Noach einen Weinberg:</p><p class="verse" dir="rtl" lang="he">וישת מן היין וישכר ויתגל בתוך אהלה</p><p>»Und er trank von dem Wein und wurde betrunken und entblößte sich in seinem Zelt.«<sup data-src="gen-9-20"></sup></p><p>Dann sagte Noach über Kenaan, den Sohn Chams: <em>עבד עבדים יהיה לאחיו</em> — »ein Knecht der Knechte soll er seinen Brüdern sein.«<sup data-src="gen-9-25"></sup> Und einige Generationen später wollten die Menschen eine Stadt und einen Turm bis zum Himmel bauen: <em>ויאמרו איש אל רעהו הבה נלבנה לבנים</em> — »und sie sagten einer zum anderen: Wohlan, lasst uns Ziegel machen.«<sup data-src="gen-11-1"></sup></p>`,
      steps: [
        {
          q: 'Wie viel ist das Wort <span class="he">היין</span> — »der Wein« — wert?',
          hint: '5 + 10 + 10 + 50.',
        },
        {
          q: 'Welches Wort hat dieselbe Gematria — und sagt, <b>wozu</b> Wein führt?',
          opts: ['»Wehklage«', '»Freude«', '»Weinberg«', '»Weintrauben«'],
        },
        {
          q: 'Stell <b>alle</b> Buchstaben des Wortes <span class="he">ויתגל</span> (»und er entblößte sich«) so um, dass das Wort »Verbannungen« entsteht.',
          hint: 'Verbannung heißt auf Hebräisch »Galut«; in der Mehrzahl ist es ein Wort mit fünf Buchstaben, das mit ג beginnt.',
        },
        {
          q: '»Ein Knecht der Knechte <span class="he">יהיה</span> — soll er sein.« Wie viel ist das Wort <span class="he">יהיה</span> wert?',
          hint: '10 + 5 + 10 + 5.',
        },
        {
          q: 'Bilde ein Wort aus den <b>letzten</b> Buchstaben der Wörter <span class="he">איש אל רעהו הבה</span> (»einer zum anderen: wohlan«). Du darfst die Buchstaben umstellen.',
          hint: 'Die letzten Buchstaben leuchten. Es entsteht ein Wort, das »sorgloser Wohlstand« bedeutet.',
        },
      ],
      reveal: {
        h: 'Wehklage, Exil und Sorglosigkeit',
        p: '»Ha-jajin« — der Wein — ist 75, wie »Jelala« — Wehklage. In »wa-jitgal«, »und er entblößte sich«, stecken die Buchstaben von »Galujot«, Verbannungen: Wegen des Weins gingen sie ins Exil. »Jihje« — »soll sein« — ist 30: dreißig Schekel, der Preis eines Knechtes. Und die letzten Buchstaben von »einer zum anderen: wohlan« ergeben »Schalwa« — sorgloser Wohlstand: Deswegen sündigten die Turmbauer.',
      },
      lessons: [
        {
          h: 'Wein und Wehklage',
          b: `<p><span class="he">היין</span> = 5 + 10 + 10 + 50 = 75 = <span class="he">יללה</span> (10 + 30 + 30 + 5).<sup data-src="bht-9-21"></sup></p><p class="expl"><b>Erklärung.</b> Wein ohne Maß bringt Weinen.</p>`,
        },
        {
          h: 'Die Buchstaben des Exils',
          b: `<p><span class="he">ויתגל</span> und <span class="he">גליות</span> haben dieselben Buchstaben, darum auch dieselbe Zahl: 449.<sup data-src="bht-9-21"></sup> „An der Spitze der Verbannten“ — das sind die Worte des Propheten Amos über die, die „Wein aus Schalen trinken und sich mit dem besten Öl salben — und sich nicht um den Untergang Josefs kümmern“.<sup data-src="amos-6-6"></sup></p>`,
        },
        {
          h: 'Dreißig Schekel',
          b: `<p>Das sagte Noach über Kenaan, als er aufwachte. <span class="he">יהיה</span> = 10 + 5 + 10 + 5 = 30.<sup data-src="bht-9-25"></sup> Der Preis eines Knechtes steht im Gesetz der Tora: Wenn ein Stier einen Knecht stößt, zahlt der Besitzer des Stiers „dreißig Schekel Silber“.<sup data-src="ex-21-32"></sup></p>`,
        },
        {
          h: 'Die sorglosen Turmbauer',
          b: `<p>Die Menschen wohnten im Tal Schinar und wollten eine Stadt und einen Turm bis zum Himmel bauen. Die letzten Buchstaben von <span class="he">איש אל רעהו הבה</span> — <span class="he">ש</span>, <span class="he">ל</span>, <span class="he">ו</span>, <span class="he">ה</span> — ergeben <span class="he">שלוה</span>.<sup data-src="bht-11-3-1"></sup></p><p class="expl"><b>Erklärung.</b> So war es auch am Anfang des Abschnitts: Die Generation der Sintflut sündigte »wegen des vielen Guten«, Korach — wegen seines Reichtums. Wenn man von allem viel hat, vergisst man leicht, von Wem das alles kommt.</p>`,
        },
      ],
      reflection: 'Wenn es mir gut geht — denke ich daran, von Wem das kommt, oder werde ich sorglos? Was kann ich heute tun, damit gute Zeiten mich zur Dankbarkeit führen und nicht zum Hochmut?',
      takeaways: [
        'היין = 75 = יללה: Wein ohne Maß bringt Weinen.',
        'ויתגל — die Buchstaben von גליות: Wegen des Weins gingen sie »an der Spitze der Verbannten« ins Exil.',
        'יהיה = 30: dreißig Schekel — der Preis eines Knechtes.',
        'Die letzten Buchstaben von »איש אל רעהו הבה« — שלוה: Die Turmbauer sündigten aus zu viel Wohlstand.',
      ],
    },
    {
      title: 'Eine Sprache und Saras Name',
      cond: `<p>Vor dem Turm von Bawel hatten alle Menschen eine Sprache:</p><p class="verse" dir="rtl" lang="he">ויהי כל הארץ שפה אחת ודברים אחדים</p><p>»Und die ganze Erde hatte eine Sprache und dieselben Worte.«<sup data-src="gen-11-1"></sup></p><p>Und am Ende des Abschnitts werden die Frauen von Awram und Nachor genannt — <em>שרי</em> und <em>מלכה</em> — und noch ein Mädchen, von dem die Tora sonst nichts erzählt: <em>יסכה</em>, Jiska.<sup data-src="gen-11-29"></sup></p><p>Hier zählt der Baal HaTurim <b>nicht mit der üblichen Gematria</b>: Beim ersten Hinweis braucht man den »Kolel« — für den Ausdruck selbst kommt 1 dazu; beim zweiten den <b>Atbasch</b>: Jeder Buchstabe wird mit seinem »Spiegelbild« getauscht (erster ↔ letzter: <span class="he">א</span> ↔ <span class="he">ת</span>, zweiter ↔ vorletzter: <span class="he">ב</span> ↔ <span class="he">ש</span> …).</p>`,
      steps: [
        {
          q: 'Wie viel sind die Wörter <span class="he">שפה אחת</span> — »eine Sprache« — wert?',
          hint: 'שפה = 300 + 80 + 5; אחת = 1 + 8 + 400.',
        },
        {
          q: 'Zähl den »Kolel« dazu — 1 für den ganzen Ausdruck. Wie viel kommt heraus?',
          hint: 'Zähl zur Summe des letzten Schritts 1 dazu.',
        },
        {
          q: 'Welcher Ausdruck ist so viel wert — und sagt, <b>welche</b> Sprache es war?',
          opts: ['»die heilige Sprache«', '»eine klare Sprache«', '»eine goldene Zunge«', '»die Sprache Ewers«'],
        },
        {
          q: 'Schreib den Namen <span class="he">שרה</span> (Sara) im Atbasch: statt <span class="he">ש</span> schreibst du <span class="he">ב</span>, statt <span class="he">ר</span> — <span class="he">ג</span>, statt <span class="he">ה</span> — <span class="he">צ</span>. Wie viel ist das neue Wort wert?',
          hint: 'Die neuen Buchstaben sind Bet, Gimel und Zadi: 2 + 3 + 90.',
        },
        {
          q: 'Wessen Name in diesem Abschnitt hat dieselbe Gematria?',
          opts: ['Jiska', 'Riwka', 'Rachel', 'Lea'],
        },
      ],
      reveal: {
        h: 'Die heilige Sprache und Sara, die Prophetin',
        p: '»Safa achat« ist 794, und mit dem Kolel 795, wie »Laschon ha-Kodesch«, die heilige Sprache: Vor dem Turm sprachen alle die heilige Sprache. Der Name »Sara« wird im Atbasch zu »bgz« — 95, wie »Jiska«: Die Weisen sagen, dass Jiska Sara ist.',
      },
      lessons: [
        {
          h: 'Arten zu zählen',
          b: `<p>Bei den Kommentatoren der Tora gibt es mehr als eine Gematria. Außer der üblichen (<i>Mispar Hechrechi</i>) gibt es die <b>kleine Gematria</b> (der Wert eines Buchstabens ohne Nullen: <span class="he">י</span> = 1, <span class="he">ק</span> = 1), die <b>Ordnungszahl</b> (<span class="he">א</span> = 1 … <span class="he">ת</span> = 22), die <b>große Zahl</b> (Endbuchstaben <span class="he">ך ם ן ף ץ</span> — 500 … 900), die <b>volle Schreibweise</b> (jeder Buchstabe mit seinem Namen: <span class="he">א</span> = <span class="he">אלף</span> = 111) und den <b>Kolel</b> — wenn für das Wort selbst 1 dazukommt.</p><p>Es gibt auch Buchstabentausch: <b>Atbasch</b> (<span class="he">א״ת ב״ש</span>) — der erste Buchstabe des Alphabets tauscht mit dem letzten, der zweite mit dem vorletzten; <b>Albam</b> (<span class="he">א״ל ב״ם</span>) — das Alphabet wird in zwei Hälften geteilt. Und Buchstabenspiele: <b>Raschej und Sofej Tewot</b> — die ersten und letzten Buchstaben der Wörter; <b>Notarikon</b> — jeder Buchstabe eines Wortes beginnt ein eigenes Wort. Alle diese Arten kannst du im Gematria-Rechner ausprobieren.</p>`,
        },
        {
          h: 'Die heilige Sprache',
          b: `<p>Vor dem Turm sprachen alle Menschen eine Sprache — die Sprache der Tora.<sup data-src="bht-11-1-2"></sup></p><p class="expl"><b>Erklärung.</b> Rechnen wir nach: <span class="he">שפה</span> = 385, <span class="he">אחת</span> = 409, zusammen 794; <span class="he">לשון הקדש</span> = 386 + 409 = 795. Der Unterschied ist eins. Der Baal HaTurim schreibt einfach »Gematria«, und die Zahlen stimmen nach der Regel »<b>mit dem Kolel</b>«: Für den ganzen Ausdruck kommt 1 dazu. 794 + 1 = 795.</p>`,
        },
        {
          h: 'Sara ist Jiska',
          b: `<p>Jiska wird am Ende des Abschnitts erwähnt — „des Vaters von Milka und des Vaters von Jiska“ — und sonst nirgends. Im Atbasch wird <span class="he">ש</span> zu <span class="he">ב</span>, <span class="he">ר</span> zu <span class="he">ג</span>, <span class="he">ה</span> zu <span class="he">צ</span>: <span class="he">בגץ</span> = 2 + 3 + 90 = 95 = <span class="he">יסכה</span> (10 + 60 + 20 + 5).<sup data-src="bht-11-29"></sup></p><p>In der Gemara erklärt Rabbi Jizchak, warum sie so hieß: Sara war eine der sieben Prophetinnen und „sah“ (<i>sachta</i>) mit heiligem Geist — darum sagte der Allmächtige zu Awraham: „Alles, was Sara dir sagt, darauf hör“. Und auch, weil alle ihre Schönheit „anschauten“.<sup data-src="megillah-14a"></sup></p>`,
        },
      ],
      reflection: 'Vor dem Turm sprachen alle eine heilige Sprache. Mit welchen Worten kann ich heute mein Sprechen »heilig« machen — freundlich, ehrlich, ohne Grobheit?',
      takeaways: [
        'Außer der üblichen Gematria gibt es die kleine Zahl, die Ordnungszahl, die große Zahl, die volle Schreibweise, den Kolel, Atbasch, Albam; Buchstabenspiele — Raschej/Sofej Tewot und Notarikon.',
        'שפה אחת = 794, mit dem Kolel 795 = לשון הקדש: Vor dem Turm sprachen alle die heilige Sprache.',
        'שרה ist im Atbasch בגץ = 95 = יסכה: Jiska ist Sara.',
        'Sara ist eine Prophetin: »Alles, was Sara dir sagt, darauf hör«.',
      ],
    },
  ],
  final: {
    title: 'Die Arche ist offen',
    allSolved:
      'Alle fünf Rätsel sind gelöst. Noach ist ein weiser Zaddik, »Chamas« wurde mit »den Wassern Noachs« bestraft, die Arche leuchtete durch einen Stein, Og wurde mit Noach gerettet, der Bund nach der Sintflut verspricht Leben, der Wein und die sorglosen Turmbauer lehren uns, vorsichtig zu sein, und der Atbasch zeigt, dass Jiska Sara ist.',
  },
  audience: 'Addieren, Buchstabenspiele und Atbasch, eine bekannte Geschichte — Noach, die Arche und die Sintflut. Jüngere Kinder — zusammen mit einem Erwachsenen.',
  practice:
    'Wenn dir diese Woche etwas gelingt oder du ein Geschenk bekommst, sag laut »Danke« — dem Allmächtigen und dem, der dir geholfen hat. Dreimal zeigt der Baal HaTurim: Unglück kommt nicht von Armut, sondern von »Schalwa« — von guten Zeiten, bei denen man vergessen hat, woher sie kommen.',
  highlight: 'Die »Gewalttat« der Generation der Sintflut ist so viel wert wie »die Wasser Noachs«: Der Allmächtige vergilt Maß für Maß.',
  share: ({ score, max, time, grid, allSolved, site }) => `🌊 Wie viel ist die »Gewalttat« der Generation der Sintflut wert? Die Antwort steckt in »den Wassern Noachs«.

Ich spiele ein Gematria-Spiel nach dem Kommentar des Baal HaTurim zum Abschnitt Noach. ${allSolved ? 'Alle fünf Rätsel gelöst:' : 'Mein Weg bis jetzt:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Fünf Rätsel: über Noach, den Zaddik, und »die Wasser Noachs«, über die Arche und den leuchtenden Stein, über die Sintflut, den Riesen Og und den Bund, über den Wein und den Turm, über die heilige Sprache und Saras Namen. Schaffst du es besser?
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Nach dem Kommentar des Baal HaTurim (Rabbi Jaakow ben Ascher, 14. Jh.) zum Abschnitt Noach (Bereschit 6,9–11,32), Kurzfassung (»Kizur Baal HaTurim«). Hebräischer Text — Sefaria.',
};

export default de;
