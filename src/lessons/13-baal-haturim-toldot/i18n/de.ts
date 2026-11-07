import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Baal HaTurim: Toldot',
  hero: {
    heading: 'Baal HaTurim: <i>vier Rätsel über die Söhne Jizchaks</i>',
    author: 'nach dem Kommentar des Baal HaTurim, Rabbi Jaakow ben Ascher',
    intro:
      'Der Baal HaTurim hat im Wochenabschnitt Toldot versteckte Wörter und Zahlen gefunden. Rechne selbst: Wem sah Jizchak ähnlich, was steckt im Wort „der Aramäer“, wie viele Völker kamen nach Jaakow, in wessen Zelten lernte er, wie viele Jahre verdiente Awraham seinen Lohn — und an welchem Fest segnete Jizchak Jaakow?',
  },
  summary:
    'Der Wochenabschnitt Toldot mit den Augen des Baal HaTurim: „zeugte“ = 55 = „ähnlich“, „der Aramäer“ — die Buchstaben von „der Betrüger“, „seine Frau“ = „Stroh und Feuer“, „danach“ = 70 Völker, „ein ganzer Mann“ — Schem, „Länder“ ohne ו — sechs Generationen bis Mosche, „weil“ = 172 Jahre, „er roch“ = „es war der Tag von Pessach“, „Duft“ = „die Nacht von Pessach“, 26 Wörter Segen.',
  glossary: {
    'תולדות': '„Nachkommen“, „Geschichte der Familie“ — der Name des Wochenabschnitts',
    'הוליד': '„zeugte“',
    'אברהם הוליד את יצחק': '„Awraham zeugte Jizchak“',
    'דומה': '„ähnlich“',
    'שונה': '„anders“',
    'גדול': '„groß“',
    'קטן': '„klein“',
    'לבן הארמי': '„Lawan, der Aramäer“',
    'הארמי': '„der Aramäer“ — aus Aram',
    'הרמאי': '„der Betrüger“',
    'אשתו': '„seine Frau“',
    'ותהר רבקה אשתו': '„und Riwka, seine Frau, wurde schwanger“',
    'קש ואש': '„Stroh und Feuer“',
    'אש ומים': '„Feuer und Wasser“',
    'אור וחשך': '„Licht und Dunkelheit“',
    'אבן ועץ': '„Stein und Holz“',
    'כן': '„so“, hier: „danach“ (ואחרי כן)',
    'ואחרי כן יצא אחיו': '„und danach kam sein Bruder heraus“',
    'תם': '„ganz, schlicht“',
    'איש תם': '„ein ganzer Mann“ — so nennt die Tora Jaakow',
    'שם': 'Schem — der Sohn von Noach',
    'יעקב': 'Jaakow',
    'מלאך האלהים': '„ein Engel G-ttes“',
    'הגן עדן': '„der Garten Eden“',
    'איש שדה': '„ein Mann des Feldes“ — so nennt die Tora Esaw',
    'איש ציד': '„ein Jäger“',
    'אדום': 'Edom — der zweite Name Esaws',
    'הלעיטני נא מן': '„lass mich doch schlucken von…“ — Esaws Worte',
    'המן': 'Haman — der Feind der Juden im Buch Esther',
    'הארצת': '„Länder“ — ohne ו geschrieben',
    'הארצות': '„Länder“ — volle Schreibweise, mit ו',
    'הארצת האל': '„alle diese Länder“',
    'משה': 'Mosche',
    'אהרן': 'Aharon',
    'יהושע': 'Jehoschua',
    'דוד': 'David',
    'עקב': '„weil“, „als Folge davon“',
    'עקב אשר שמע אברהם בקלי': '„weil Awraham auf Meine Stimme gehört hat“',
    'ויקרא שמה רחבות': '„und er nannte ihn Rechowot“ — „Weite“',
    'לצוד': '„jagen“',
    'לצוד ציד': '„Wild jagen“',
    'מן גזל': '„von Gestohlenem“',
    'נא אל הצאן': '„doch zur Herde“',
    'לך נא אל הצאן': '„geh doch zur Herde“ — Riwkas Worte an Jaakow',
    'נאה': '„passend, schön“',
    'משם': '„von dort“',
    'משלי': '„von meinem Eigenen“',
    'וירח': '„und er roch“',
    'ריח': '„Duft“',
    'וירח את ריח בגדיו': '„und er roch den Duft seiner Kleider“',
    'יום פסח היה': '„es war der Tag von Pessach“',
    'ליל פסח': '„die Nacht von Pessach“',
    'ליל שבת': '„die Nacht von Schabbat“',
    'יום כפור': '„Jom Kippur“',
    'ראש השנה': '„Rosch Haschana“',
    'ויאמר מי אפוא': '„und er sagte: Wer denn…“',
    'אמו': '„seine Mutter“',
  },
  translit: {
    'הוליד': 'holid',
    'אשתו': 'ischto',
    'כן': 'ken',
    'תם': 'tam',
    'יעקב': 'Jaakow',
    'הארצת': 'ha’arazot',
    'עקב': 'ekew',
    'וירח': 'wajarach',
    'ריח': 're’ach',
  },
  riddles: [
    {
      title: 'Wie der Vater',
      cond: `<p>Der Baal HaTurim ist Rabbi Jaakow ben Ascher (um 1269–1343), der Verfasser des Gesetzbuchs „Arba’a Turim“. Zu jedem Vers der Tora hat er kurze Hinweise hinterlassen: Gematria, erste und letzte Buchstaben von Wörtern, Wörter, die im Tanach nur zwei- oder dreimal vorkommen. Der Wochenabschnitt Toldot beginnt so:</p><p class="verse" dir="rtl" lang="he">ואלה תולדת יצחק בן אברהם אברהם הוליד את יצחק</p><p>„Und das sind die Nachkommen Jizchaks, des Sohnes Awrahams: Awraham zeugte Jizchak.“<sup data-src="gen-25-19"></sup> Jizchak heiratete Riwka, die Tochter Betuels, des Aramäers, die Schwester Lawans, des Aramäers.<sup data-src="gen-25-20"></sup> Zwanzig Jahre lang hatten sie keine Kinder; Jizchak betete für seine Frau — und G-tt erhörte ihn: „und Riwka, seine Frau, wurde schwanger“.<sup data-src="gen-25-21"></sup></p>`,
      steps: [
        {
          q: 'Wie viel ist das Wort <span class="he">הוליד</span> — „zeugte“?',
          hint: 'ה = 5, ו = 6, ל = 30, י = 10, ד = 4.',
        },
        {
          q: 'Welches Wort hat dieselbe Zahl — und sagt, <b>wie</b> Jizchak neben seinem Vater aussah?',
          opts: ['ähnlich', 'anders', 'groß', 'klein'],
        },
        {
          q: 'Lawan heißt <span class="he">הארמי</span> — „der Aramäer“. Stelle alle Buchstaben dieses Wortes um. Welches Wort über Lawan entsteht?',
          hint: 'Das Wort beginnt mit ה und endet mit י: Lawan wird Jaakow später betrügen.',
        },
        {
          q: 'Wie viel ist das Wort <span class="he">אשתו</span> — „seine Frau“?',
          hint: 'א = 1, ש = 300, ת = 400, ו = 6.',
        },
        {
          q: 'Riwka trug zwei Söhne — Jaakow und Esaw. Welche zwei Wörter haben dieselbe Zahl — und sagen, was ihre Nachkommen füreinander sein werden?',
          opts: ['„Stroh und Feuer“', '„Feuer und Wasser“', '„Licht und Dunkelheit“', '„Stein und Holz“'],
        },
      ],
      reveal: {
        h: 'Stroh und Feuer',
        p: '„Holid“, „zeugte“, = 55 = „dome“, „ähnlich“: Jizchaks Gesicht sah aus wie Awrahams. „Ha’arami“, „der Aramäer“, hat dieselben Buchstaben wie „haramai“, „der Betrüger“. Und „ischto“, „seine Frau“, = 707 = „kasch wa’esch“, „Stroh und Feuer“: Das Haus Jaakows ist Feuer, das Haus Esaws ist Stroh.',
      },
      lessons: [
        {
          h: 'Ein Gesicht wie das des Vaters',
          b: `<p><span class="he">הוליד</span> = 5 + 6 + 30 + 10 + 4 = 55; <span class="he">דומה</span> = 4 + 6 + 40 + 5 = 55.<sup data-src="bht-25-19"></sup></p><p>Der Vers sagt es zweimal: „Jizchak, der Sohn Awrahams“ und „Awraham zeugte Jizchak“. Raschi erklärt, wozu.<sup data-src="rashi-25-19"></sup></p><p class="expl"><b>Erklärung.</b> Ein Sohn, der seinem Vater ähnlich sieht, ist ein Zeugnis für alle. Aber die wichtigste Ähnlichkeit zwischen Jizchak und Awraham war nicht das Gesicht, sondern der Weg: Er setzte das Werk seines Vaters fort.</p>`,
        },
        {
          h: 'Der Aramäer und der Betrüger',
          b: `<p>Die Buchstaben von <span class="he">הארמי</span>: ה, א, ר, מ, י — umgestellt: <span class="he">הרמאי</span>, „der Betrüger“.<sup data-src="bht-25-20-2"></sup></p><p class="expl"><b>Erklärung.</b> Riwka wuchs im Haus von Betuel und Lawan auf — und wurde trotzdem eine Gerechte. Der Ort, an dem ein Mensch aufwächst, entscheidet nicht für ihn, wie er wird.</p>`,
        },
        {
          h: 'Stroh und Feuer',
          b: `<p><span class="he">אשתו</span> = 1 + 300 + 400 + 6 = 707; <span class="he">קש ואש</span> = 400 + 307 = 707.<sup data-src="bht-25-21-2"></sup></p><p>Das sind die Worte des Propheten Owadja: „Das Haus Jaakows wird Feuer sein und das Haus Josefs eine Flamme, und das Haus Esaws Stroh.“<sup data-src="obadiah-1-18"></sup></p><p class="expl"><b>Erklärung.</b> Schon in dem Moment, als Riwka schwanger wurde, war gesagt, wie der Streit ihrer Söhne enden wird: Feuer ist stärker als Stroh. Ein kleines Feuer kann viel Stroh anzünden — und Stroh kann Feuer nicht löschen.</p>`,
        },
      ],
      reflection: 'Jizchak war wie sein Vater — im Gesicht und in seinen Taten. Was Gutes möchte ich von meinen Eltern oder Lehrern übernehmen?',
      takeaways: [
        'הוליד = 55 = דומה: Jizchaks Gesicht sah aus wie Awrahams.',
        'הארמי hat dieselben Buchstaben wie הרמאי, „der Betrüger“.',
        'אשתו = 707 = קש ואש: Das Haus Jaakows ist Feuer, das Haus Esaws Stroh.',
      ],
    },
    {
      title: 'Zwei aus einem Leib',
      cond: `<p>Riwka bekam Zwillinge. Zuerst kam Esaw heraus, rot und ganz mit Haaren bedeckt.</p><p class="verse" dir="rtl" lang="he">ואחרי כן יצא אחיו וידו אחזת בעקב עשו</p><p>„Und danach kam sein Bruder heraus, und seine Hand hielt Esaws Ferse fest, und man nannte ihn Jaakow.“<sup data-src="gen-25-26"></sup> Die Jungen wuchsen auf — und wurden sehr verschieden:</p><p class="verse" dir="rtl" lang="he">ויעקב איש תם ישב אהלים</p><p>„Esaw war ein Mann, der jagen konnte, ein Mann des Feldes, und Jaakow war ein ganzer Mann, der in Zelten saß.“<sup data-src="gen-25-27"></sup></p>`,
      steps: [
        {
          q: 'Wie viel ist das Wort <span class="he">כן</span> — aus den Worten „und danach kam sein Bruder heraus“?',
          hint: 'כ = 20, ן = 50.',
        },
        {
          q: 'Nimm die letzten Buchstaben der Wörter <span class="he">איש תם</span> — „ein ganzer Mann“. Wessen Name entsteht? Die Buchstaben darfst du umstellen.',
          hint: 'Der Name eines Sohnes von Noach, zwei Buchstaben.',
        },
        {
          q: 'Das Wort <span class="he">תם</span> = 440. Der Baal HaTurim: So viele Jahre vergehen, bis die Schechina „im Zelt wohnt“ — im Beit HaMikdasch. Vom Auszug aus Ägypten bis zum Bau des Beit HaMikdasch vergingen 480 Jahre, und 40 davon war Israel in der Wüste. Wie viele Jahre vergingen vom Einzug ins Land Israel bis zum Bau des Beit HaMikdasch?',
          hint: '480 − 40.',
        },
        {
          q: 'Wie viel ist der Name <span class="he">יעקב</span>?',
          hint: 'י = 10, ע = 70, ק = 100, ב = 2.',
        },
        {
          q: 'Welche Wörter haben dieselbe Zahl wie der Name Jaakow?',
          opts: ['„ein Engel G-ttes“', '„ein Mann des Feldes“', '„ein Jäger“', 'Edom'],
        },
      ],
      reveal: {
        h: 'Lernen in den Zelten Schems',
        p: '„Ken“ = 70: Nach Esaw „kommen“ die siebzig Völker der Welt, Jaakow aber ist einer. Die letzten Buchstaben von „isch tam“ — Schem: Jaakow saß in den Zelten Schems und lernte. „Tam“ = 440 — die Jahre vom Einzug ins Land bis zum Beit HaMikdasch. Und „Jaakow“ = 182 = „malach ha’Elokim“, „ein Engel G-ttes“.',
      },
      lessons: [
        {
          h: 'Siebzig Völker',
          b: `<p><span class="he">כן</span> = 20 + 50 = 70.<sup data-src="bht-25-26-1"></sup></p><p class="expl"><b>Erklärung.</b> Zuerst kam Esaw heraus, „und danach“ — Jaakow. Die Völker der Welt sind siebzig, und Israel ist eines, ein besonderes. Wichtigkeit misst man nicht mit Zahlen.</p>`,
        },
        {
          h: 'Die Zelte Schems',
          b: `<p>Die letzten Buchstaben von <span class="he">איש תם</span>: ש, ם — <span class="he">שם</span>, Schem.<sup data-src="bht-25-27"></sup> Auch Raschi sagt, in wessen Zelten Jaakow saß.<sup data-src="rashi-25-27"></sup></p><p><span class="he">תם</span> = 400 + 40 = 440. „Im vierhundertachtzigsten Jahr nach dem Auszug der Kinder Israels aus Ägypten … begann er, das Haus des Ewigen zu bauen.“<sup data-src="kings1-6-1"></sup> 480 − 40 Jahre in der Wüste = 440.</p><p class="expl"><b>Erklärung.</b> Jaakows Zelt des Lernens ist der Anfang des Weges, der zum Beit HaMikdasch führt. Wo man Tora lernt, dort wohnt die Schechina.</p>`,
        },
        {
          h: 'Ein Engel G-ttes',
          b: `<p><span class="he">יעקב</span> = 10 + 70 + 100 + 2 = 182; <span class="he">מלאך האלהים</span> = 91 + 91 = 182, und <span class="he">הגן עדן</span> = 58 + 124 = 182.<sup data-src="bht-25-27"></sup></p><p class="expl"><b>Erklärung.</b> Jaakow ist „ein ganzer Mann“: Seine Worte und seine Taten sind dasselbe. So ein Mensch ist wie ein Engel — ein Engel tut immer das, wofür er geschickt wurde.</p>`,
        },
      ],
      reflection: 'Jaakow war „ganz“: Was er sagte, das dachte er auch. Wo kann ich heute genau das sagen, was ich denke — ehrlich und freundlich?',
      takeaways: [
        'כן = 70: die siebzig Völker der Welt — außer Jaakow.',
        'Die letzten Buchstaben von „איש תם“ — שם: Jaakow lernte in den Zelten Schems.',
        'תם = 440 = 480 − 40: vom Einzug ins Land bis zum Beit HaMikdasch.',
        'יעקב = 182 = מלאך האלהים.',
      ],
    },
    {
      title: 'Lohn für das Hören',
      cond: `<p>Im Land war eine Hungersnot, und Jizchak ging nach Gerar. G-tt sagte zu ihm: Geh nicht nach Ägypten hinunter, wohne in diesem Land —</p><p class="verse" dir="rtl" lang="he">כי לך ולזרעך אתן את כל הארצת האל</p><p>„…denn dir und deinen Nachkommen werde Ich alle diese Länder geben, und Ich werde den Schwur erfüllen, den Ich Awraham, deinem Vater, geschworen habe.“<sup data-src="gen-26-3"></sup> Und warum?</p><p class="verse" dir="rtl" lang="he">עקב אשר שמע אברהם בקלי</p><p>„Weil Awraham auf Meine Stimme gehört und Meine Hut bewahrt hat, Meine Gebote, Meine Satzungen und Meine Lehren.“<sup data-src="gen-26-5"></sup></p>`,
      steps: [
        {
          q: 'Voll geschrieben heißt das Wort „Länder“ <span class="he">הארצות</span>, hier aber steht <span class="he">הארצת</span>. Welcher Buchstabe fehlt? Tippe ihn an.',
        },
        {
          q: 'Der Buchstabe ו = 6. Der Baal HaTurim: Das Land wird nach sechs Generationen gegeben — Jizchak, Jaakow, Levi, Kehat, Amram und … Wer ist der sechste?',
          opts: ['Mosche', 'Aharon', 'Jehoschua', 'David'],
        },
        {
          q: 'Wie viel ist das Wort <span class="he">עקב</span> — „weil“?',
          hint: 'ע = 70, ק = 100, ב = 2.',
        },
        {
          q: 'Awraham lebte 175 Jahre. Unsere Weisen sagen: Er erkannte seinen Schöpfer, als er drei Jahre alt war. Wie viele Jahre hat Awraham „auf Seine Stimme gehört“?',
          hint: '175 − 3.',
        },
      ],
      reveal: {
        h: 'Hundertzweiundsiebzig Jahre',
        p: '„Ha’arazot“ ohne ו: Das Land wird nach sechs Generationen gegeben, in den Tagen von Mosche. Und „ekew“ = 172: Awraham erkannte den Schöpfer mit drei Jahren und lebte 175 Jahre — 172 Jahre hörte er auf Seine Stimme. Auch die Zehn Gebote haben 172 Wörter.',
      },
      lessons: [
        {
          h: 'Sechs Generationen',
          b: `<p>Im Wort <span class="he">הארצת</span> fehlt das ו, und ו = 6.<sup data-src="bht-26-3-2"></sup></p><p class="expl"><b>Erklärung.</b> G-ttes Versprechen wird sicher erfüllt, auch wenn man lange warten muss: Das Land wurde Jizchak versprochen, und hineinkommen wird man in den Tagen von Mosche und Jehoschua — sechs Generationen später.</p>`,
        },
        {
          h: 'Hundertzweiundsiebzig',
          b: `<p><span class="he">עקב</span> = 70 + 100 + 2 = 172.<sup data-src="bht-26-5-1"></sup> Awraham lebte 175 Jahre<sup data-src="gen-25-7"></sup>, und seinen Schöpfer erkannte er mit drei Jahren — so sagt der Talmud.<sup data-src="nedarim-32a"></sup> 175 − 3 = 172.</p><p>Der Vers <span class="he">עקב אשר שמע אברהם בקלי וישמר משמרתי מצותי חקותי ותורתי</span> hat 10 Wörter, und die Zehn Gebote (Schemot 20,2–14) haben 172 Wörter.<sup data-src="ex-20-2"></sup></p><p class="expl"><b>Erklärung.</b> Awraham hat die Gebote nicht einmal gelernt — er hörte jedes Jahr seines Lebens auf G-ttes Stimme. Darum bekamen auch seine Kinder den Lohn.</p>`,
        },
      ],
      reflection: 'Awraham hörte 172 Jahre lang auf G-ttes Stimme — jeden Tag. Welche gute Tat kann ich jeden Tag tun, nicht nur manchmal?',
      takeaways: [
        'הארצת ohne ו (= 6): das Land — nach sechs Generationen, in den Tagen von Mosche.',
        'עקב = 172 = 175 − 3: so viele Jahre hörte Awraham auf G-ttes Stimme.',
        'Die Zehn Gebote haben 172 Wörter.',
      ],
    },
    {
      title: 'Ein Segen an Pessach',
      cond: `<p>Jizchak wurde alt, seine Augen wurden schwach, und er wollte Esaw segnen. Riwka hörte das und sagte zu Jaakow:</p><p class="verse" dir="rtl" lang="he">לך נא אל הצאן וקח לי משם שני גדיי עזים טבים</p><p>„Geh doch zur Herde und hol mir von dort zwei gute Ziegenböckchen, und ich mache daraus ein Gericht für deinen Vater, so wie er es mag.“<sup data-src="gen-27-9"></sup> Jaakow kam zu seinem Vater.</p><p class="verse" dir="rtl" lang="he">וירח את ריח בגדיו</p><p>„Und er trat heran und küsste ihn, und er roch den Duft seiner Kleider und segnete ihn.“<sup data-src="gen-27-27"></sup> Das ist der Segen:</p><p class="verse" dir="rtl" lang="he">ויתן לך האלהים מטל השמים ומשמני הארץ ורב דגן ותירש יעבדוך עמים וישתחו לך לאמים הוה גביר לאחיך וישתחוו לך בני אמך ארריך ארור ומברכיך ברוך</p><p>„G-tt gebe dir vom Tau des Himmels und vom Fett der Erde, und viel Korn und Wein. Völker sollen dir dienen …“<sup data-src="gen-27-28"></sup></p>`,
      steps: [
        {
          q: 'Riwka sagte: „geh“, <span class="he">לך</span>, — und dann <span class="he">נא אל הצאן</span>. Nimm die ersten Buchstaben dieser drei Wörter — du darfst sie umstellen. Welches Wort entsteht?',
          hint: 'Ein Wort aus drei Buchstaben: „passend, schön“.',
        },
        {
          q: 'Wie viel ist das Wort <span class="he">וירח</span> — „und er roch“?',
          hint: 'ו = 6, י = 10, ר = 200, ח = 8.',
        },
        {
          q: 'Wie viel ist das Wort <span class="he">ריח</span> — „Duft“?',
          hint: 'ר = 200, י = 10, ח = 8.',
        },
        {
          q: 'Der Baal HaTurim: „und er roch“ = „es war der Tag von Pessach“. Und welche Wörter haben dieselbe Zahl wie das Wort „Duft“?',
          opts: ['„die Nacht von Pessach“', '„die Nacht von Schabbat“', '„Jom Kippur“', '„Rosch Haschana“'],
        },
        {
          q: 'Zähle die Wörter des Segens auf Hebräisch — von <span class="he">ויתן</span> bis <span class="he">ברוך</span>. Wie viele sind es?',
          hint: 'Der erste Vers hat 10 Wörter, der zweite 16.',
        },
      ],
      reveal: {
        h: 'Sechsundzwanzig Wörter',
        p: 'Die ersten Buchstaben von „na el hazon“ — „na’e“: „lech — na’e lach“, „das passt zu dir“. „Wajarach“ = 224 = „jom Pessach haja“, „es war der Tag von Pessach“, und „re’ach“ = 218 = „lejl Pessach“, „die Nacht von Pessach“: Jizchak segnete Jaakow an Pessach. Und der Segen hat 26 Wörter — so viel wie die Zahl des Namens aus vier Buchstaben.',
      },
      lessons: [
        {
          h: 'Zwei Ziegenböckchen',
          b: `<p>Die ersten Buchstaben von <span class="he">נא אל הצאן</span>: נ, א, ה — <span class="he">נאה</span>, „passend“.<sup data-src="bht-27-9"></sup> <span class="he">משם</span> = 40 + 300 + 40 = 380; <span class="he">משלי</span> = 40 + 300 + 30 + 10 = 380.</p><p>Auch Raschi erklärt, warum die Böckchen „von ihrem Eigenen“ waren.<sup data-src="rashi-27-9"></sup></p><p class="expl"><b>Erklärung.</b> Für eine Mizwa nahm Riwka nicht Fremdes, sondern ihr Eigenes — das, was ihr nach der Ketuba zustand. Eine Mizwa mit Fremdem ist keine Mizwa.</p>`,
        },
        {
          h: 'Der Duft von Pessach',
          b: `<p><span class="he">וירח</span> = 6 + 10 + 200 + 8 = 224; <span class="he">יום פסח היה</span> = 56 + 148 + 20 = 224.<sup data-src="bht-27-27-2"></sup></p><p><span class="he">ריח</span> = 200 + 10 + 8 = 218; <span class="he">ליל פסח</span> = 70 + 148 = 218.<sup data-src="bht-27-27-3"></sup></p><p class="expl"><b>Erklärung.</b> Pessach ist eine Zeit, in der G-tt segnet und befreit. In der Nacht, in der Israel aus Ägypten auszieht, wird auch der Segen Jaakows wahr.</p>`,
        },
        {
          h: 'Zehn und sechsundzwanzig',
          b: `<p>Der Vers <span class="he">ויתן לך האלהים מטל השמים ומשמני הארץ ורב דגן ותירש</span> hat 10 Wörter.<sup data-src="bht-27-28"></sup> Und der ganze Segen hat 10 + 16 = 26 Wörter; der Name aus vier Buchstaben = 10 + 5 + 6 + 5 = 26.<sup data-src="bht-27-29-1"></sup></p><p class="expl"><b>Erklärung.</b> Jizchak segnete seinen Sohn nicht aus sich selbst: In jedem Wort des Segens ist G-ttes Name. Ein Mensch gibt den Segen weiter, aber G-tt schenkt ihn.</p>`,
        },
      ],
      reflection: 'Riwka nahm für die Mizwa „ihr Eigenes“, nicht Fremdes. Was von meinem Eigenen — Zeit, Kraft, eine Sache — kann ich heute für eine gute Tat geben?',
      takeaways: [
        'Die ersten Buchstaben von „נא אל הצאן“ — נאה; משם = 380 = משלי.',
        'וירח = 224 = יום פסח היה; ריח = 218 = ליל פסח.',
        'Der Segen Jaakows hat 26 Wörter, so viel wie die Zahl des Namens.',
      ],
    },
  ],
  memo: {
    intro:
      'Zwölf Kommentare des Baal HaTurim zum Wochenabschnitt Toldot — zwölf Kartenpaare. Jedes Bild erzählt von einem Kommentar, und sein Paar sind die Worte der Tora, über die er spricht.',
    items: [
      {
        title: 'Wie der Vater',
        caption: 'Vater und Sohn mit ähnlichen Gesichtern',
        verse: '„Awraham zeugte Jizchak“',
        quote: '„Zeugte“ — in Gematria „ähnlich“: Jizchaks Gesicht sah aus wie Awrahams.',
        explain:
          'Das Wort הוליד („zeugte“) = 55, und דומה („ähnlich“) = 55. Raschi erklärt: Spötter sagten, Jizchak sei nicht Awrahams Sohn. Da machte G-tt Jizchaks Gesicht dem Gesicht seines Vaters ähnlich — und alle sahen die Wahrheit.',
        moral: 'Das beste Zeugnis sind Taten wie die Taten der Eltern.',
      },
      {
        title: 'Der aramäische Betrüger',
        caption: 'Die Maske eines Schlauen',
        verse: '„Lawan, der Aramäer“',
        quote: '„Lawan, der Aramäer“ — die Buchstaben von „der Betrüger“.',
        explain:
          'Stelle die Buchstaben von הארמי („der Aramäer“) um — dann entsteht הרמאי („der Betrüger“). Lawan wird Jaakow später betrügen: Er gibt ihm Lea statt Rachel. Und Riwka wuchs in so einer Familie auf — und wurde eine Gerechte.',
        moral: 'Wo du aufwächst, entscheidet nicht, wer du wirst.',
      },
      {
        title: 'Stroh und Feuer',
        caption: 'Ein Feuer und ein Strohbündel',
        verse: '„und Riwka, seine Frau, wurde schwanger“',
        quote: '„Seine Frau“ — in Gematria „Stroh und Feuer“: Das Haus Jaakows ist Feuer, das Haus Esaws Stroh.',
        explain:
          'Das Wort אשתו = 707, und קש ואש („Stroh und Feuer“) = 707. Riwka trug zwei Söhne. Der Prophet Owadja sagte: Das Haus Jaakows wird Feuer sein, das Haus Esaws Stroh. Feuer ist stärker als Stroh.',
        moral: 'Ein kleines Feuer ist stärker als ein großer Haufen Stroh.',
      },
      {
        title: 'Siebzig und einer',
        caption: 'Viele Fahnen und ein Stern',
        verse: '„und danach kam sein Bruder heraus“',
        quote: '„Ken“ ist siebzig: siebzig Völker — außer Jaakow.',
        explain:
          'Das Wort כן = 20 + 50 = 70. Zuerst wurde Esaw geboren, „und danach“ Jaakow. Die Völker der Welt sind siebzig, und Israel ist eines, ein besonderes.',
        note: 'die 70 Völker der Welt',
        moral: 'Wichtigkeit misst man nicht mit Zahlen.',
      },
      {
        title: 'Die Zelte Schems',
        caption: 'Jaakow lernt in einem Zelt',
        verse: '„ein ganzer Mann“',
        quote: '„Ein ganzer Mann“ — die letzten Buchstaben ergeben „Schem“: Er saß in den Zelten Schems und lernte.',
        explain:
          'Die letzten Buchstaben der Wörter איש תם: ש, ם — שם, Schem, der Sohn von Noach. Jaakow saß im Zelt und lernte Tora bei Schem und seinem Urenkel Ewer.',
        moral: 'Ein ganzer Mensch ist einer, der lernt.',
      },
      {
        title: 'Brot und Haman',
        caption: 'Eine Schüssel Linsen und Brot',
        verse: '„lass mich doch schlucken von…“',
        quote: '„Lass mich doch schlucken von“ — die ersten Buchstaben ergeben „Haman“: Wie Jaakow Esaws Erstgeburt für Brot kaufte, so „kaufte“ Mordechai Haman für ein Stück Brot.',
        explain:
          'Die ersten Buchstaben der Wörter הלעיטני נא מן: ה, נ, מ — המן, Haman. Esaw verkaufte seine Erstgeburt für Brot und Linsen. Und viele Jahre später „verkaufte“ sich Esaws Nachkomme Haman für ein Stück Brot als Knecht an Mordechai.',
        moral: 'Wer das Heilige nicht schätzt, verliert es für eine Schüssel Linsen.',
      },
      {
        title: 'Sechs Generationen',
        caption: 'Eine Leiter mit sechs Stufen',
        verse: '„alle diese Länder“',
        quote: '„Länder“ — ohne Waw geschrieben: Das Land wird nach sechs Generationen gegeben — Jizchak, Jaakow, Levi, Kehat, Amram, Mosche.',
        explain:
          'Voll geschrieben heißt das Wort הארצות, hier aber steht הארצת, ohne ו. Der Buchstabe ו = 6: Das Versprechen an Jizchak wird nach sechs Generationen wahr, in den Tagen von Mosche.',
        moral: 'G-ttes Versprechen wird wahr, auch wenn man lange warten muss.',
      },
      {
        title: '172 Jahre',
        caption: 'Ein Junge schaut zu den Sternen',
        verse: '„weil Awraham auf Meine Stimme gehört hat“',
        quote: '172 Jahre hörte er auf Meine Stimme: Mit drei Jahren erkannte er seinen Schöpfer, und er lebte 175 Jahre.',
        explain:
          'Das Wort עקב = 70 + 100 + 2 = 172. Awraham lebte 175 Jahre und erkannte seinen Schöpfer mit drei Jahren: 175 − 3 = 172. Und auch die Zehn Gebote haben 172 Wörter.',
        note: '172 Jahre hörte Awraham auf G-ttes Stimme',
        moral: 'Auf G-tt soll man an jedem Tag des Lebens hören.',
      },
      {
        title: 'Der Brunnen „Weite“',
        caption: 'Ein Brunnen in weitem Land',
        verse: '„und er nannte ihn Rechowot“',
        quote: '„Rechowot“ — gegen Griechenland, das das Untertauchen verbot; und es geschah ein Wunder: Jeder fand eine Mikwe.',
        explain:
          'Jizchak grub drei Brunnen — Essek, Sitna und Rechowot. Der Baal HaTurim: Das sind drei Exile. Rechowot ist Griechenland: Die Griechen verboten den Juden, in die Mikwe zu tauchen, und G-tt machte ein Wunder — jeder hatte Wasser.',
        moral: 'Auch wenn es verboten wird, öffnet G-tt die Weite.',
      },
      {
        title: 'Jagen mit Gestohlenem',
        caption: 'Ein Bogen und ein Pfeil',
        verse: '„Wild jagen“',
        quote: '„Jagen“ — in Gematria „von Gestohlenem“.',
        explain:
          'Das Wort לצוד = 130, und מן גזל („von Gestohlenem“) = 130. Esaw ging auf die Jagd, um seinem Vater ein Gericht zu bringen. Der Baal HaTurim deutet an: Auch das konnte er unehrlich bekommen.',
        moral: 'Ein Geschenk aus Gestohlenem ist kein Geschenk.',
      },
      {
        title: 'Der Duft von Pessach',
        caption: 'Ein Pessach-Tisch',
        verse: '„und er roch den Duft seiner Kleider“',
        quote: '„Und er roch“ — in Gematria „es war der Tag von Pessach“; „Duft“ — in Gematria „die Nacht von Pessach“.',
        explain:
          'וירח = 224 = יום פסח היה, und ריח = 218 = ליל פסח. Jizchak segnete Jaakow an Pessach. Und Raschi sagt: Von Jaakows Kleidern kam der Duft des Gartens Eden.',
        moral: 'Pessach ist eine Zeit des Segens.',
      },
      {
        title: 'Wer war es denn?',
        caption: 'Eine Mutter umarmt ihren Sohn',
        verse: '„und er sagte: Wer denn…“',
        quote: '„Und er sagte: Wer denn“ — die ersten Buchstaben ergeben „seine Mutter“: Wer hat das eingefädelt? Riwka.',
        explain:
          'Jizchak erschrak und fragte: „Wer war es denn?“ Die ersten Buchstaben der Wörter ויאמר מי אפוא: ו, מ, א — אמו, „seine Mutter“. Riwka hat es so eingerichtet, dass Jaakow den Segen bekam.',
        moral: 'Eine Mutter sieht, was zu wem passt.',
      },
    ],
  },
  daily: {
    intro:
      'Toldot jeden Tag: zwei Kommentare des Baal HaTurim — von Sonntag bis Freitag. Der Vers, die Worte des Baal HaTurim auf Hebräisch mit Übersetzung und eine Erklärung — etwa fünf Minuten.',
    items: [
      {
        h: 'Wie der Vater',
        b: '<p><span class="he">הוליד</span> = 5 + 6 + 30 + 10 + 4 = 55 = <span class="he">דומה</span>.</p><p>Warum sagt die Tora zweimal: „Jizchak, der Sohn Awrahams“ und „Awraham zeugte Jizchak“? Raschi: Die Spötter jener Generation sagten, Sara sei von Awimelech schwanger geworden. Da machte G-tt Jizchaks Gesicht Awrahams Gesicht ähnlich — und alle gaben zu: „Awraham zeugte Jizchak.“</p><p class="expl"><b>Erklärung.</b> Ein Sohn, der dem Vater ähnlich sieht, ist ein Zeugnis. Ein Sohn, der den Weg des Vaters weitergeht, ist ein noch stärkeres.</p>',
      },
      {
        h: 'Stroh und Feuer',
        b: '<p><span class="he">אשתו</span> = 1 + 300 + 400 + 6 = 707 = <span class="he">קש ואש</span>.</p><p>Der Baal HaTurim bringt die Worte des Propheten Owadja (1,18): „Das Haus Jaakows wird Feuer sein und das Haus Josefs eine Flamme, und das Haus Esaws Stroh.“</p><p class="expl"><b>Erklärung.</b> Schon als Riwka schwanger wurde, war gesagt, wie der Streit ihrer Söhne enden wird: Feuer ist stärker als Stroh. Ein wenig Licht vertreibt viel Dunkelheit.</p>',
      },
      {
        h: 'Siebzig Völker',
        b: '<p><span class="he">כן</span> = 20 + 50 = 70.</p><p>Zuerst kam Esaw heraus, „und danach“ Jaakow. In der Tora kamen von den Söhnen Noachs siebzig Völker; Israel wird nicht zu ihnen gezählt.</p><p class="expl"><b>Erklärung.</b> Es gibt viele Völker, und Israel ist eines. Seine Aufgabe ist nicht, „das einundsiebzigste“ zu werden, sondern besonders zu sein.</p>',
      },
      {
        h: 'Die Zelte Schems',
        b: '<p>Die letzten Buchstaben von <span class="he">איש תם</span>: ש, ם — <span class="he">שם</span>, Schem. <span class="he">תם</span> = 400 + 40 = 440: Vom Auszug aus Ägypten bis zum Beit HaMikdasch vergingen 480 Jahre (Melachim I 6,1), ohne die vierzig Jahre in der Wüste — 440.</p><p><span class="he">יעקב</span> = 10 + 70 + 100 + 2 = 182 = <span class="he">מלאך האלהים</span> = <span class="he">הגן עדן</span>.</p><p class="expl"><b>Erklärung.</b> Jaakows Zelt des Lernens ist der Anfang des Weges zum Beit HaMikdasch. Wo man Tora lernt, dort wohnt die Schechina.</p>',
      },
      {
        h: 'Brot und Haman',
        b: '<p>Die ersten Buchstaben von <span class="he">הלעיטני נא מן</span>: ה, נ, מ — <span class="he">המן</span>, Haman.</p><p>Esaw kam müde vom Feld zurück und verkaufte seine Erstgeburt für Brot und Linsensuppe. Der Midrasch erzählt: In den Tagen von Esther bat Haman, Esaws Nachkomme, Mordechai um Brot — und „verkaufte“ sich ihm für ein Stück Brot als Knecht.</p><p class="expl"><b>Erklärung.</b> Wer das Ewige gegen das Kurze tauscht, ist am Ende selbst im Nachteil. Das Heilige verkauft man nicht für eine Schüssel Suppe.</p>',
      },
      {
        h: 'Sechs Generationen',
        b: '<p>Voll geschrieben — <span class="he">הארצות</span>, in der Tora — <span class="he">הארצת</span>: ohne ו, und ו = 6.</p><p>Jizchak, Jaakow, Levi, Kehat, Amram, Mosche — sechs Generationen. In den Tagen von Mosche zog Israel aus Ägypten und machte sich auf den Weg ins versprochene Land.</p><p class="expl"><b>Erklärung.</b> G-ttes Versprechen wird genau erfüllt — auch wenn zwischen Wort und Tat Generationen vergehen.</p>',
      },
      {
        h: 'Hundertzweiundsiebzig',
        b: '<p><span class="he">עקב</span> = 70 + 100 + 2 = 172. Awraham lebte 175 Jahre (Bereschit 25,7) und erkannte seinen Schöpfer mit drei Jahren (Nedarim 32a): 175 − 3 = 172.</p><p>Der Vers hat 10 Wörter, wie die Zehn Gebote, und die Gebote selbst (Schemot 20,2–14) haben 172 Wörter. Awraham bestand zehn Prüfungen, und die Welt wurde mit zehn Aussprüchen erschaffen.</p><p class="expl"><b>Erklärung.</b> Awraham hörte nicht einmal auf G-ttes Stimme, sondern alle 172 Jahre — darum ging der Segen auf seinen Sohn über.</p>',
      },
      {
        h: 'Drei Brunnen — drei Exile',
        b: '<p>Jizchak grub drei Brunnen: Essek („Streit“), Sitna („Feindschaft“) und Rechowot („Weite“).</p><p>Der Baal HaTurim: Essek ist Babel, das Jehuda „bedrängte“; Sitna ist Haman, der eine „Anklage“ gegen Jeruschalajim schrieb (das Wort שטנה kommt noch einmal vor, im Buch Esra, 4,6); Rechowot ist Griechenland: Die Griechen verboten, in die Mikwe zu tauchen, doch es geschah ein Wunder — jeder fand Wasser. „Und wir werden fruchtbar sein im Land.“</p><p class="expl"><b>Erklärung.</b> Nach Streit und Feindschaft kommt die Weite. Exile gehen zu Ende — und Jizchaks Brunnen bleibt.</p>',
      },
      {
        h: 'Jagen mit Gestohlenem',
        b: '<p><span class="he">לצוד</span> = 30 + 90 + 6 + 4 = 130 = <span class="he">מן גזל</span>.</p><p>Jizchak bat Esaw, Wild zu jagen und ein Gericht zu machen. Der Baal HaTurim deutet an: Esaw konnte auch etwas bringen, das er unehrlich bekommen hatte.</p><p class="expl"><b>Erklärung.</b> Eine gute Tat, die auf unehrlichem Weg getan wird, verliert ihre Kraft. Ein Geschenk aus Gestohlenem ist kein Geschenk.</p>',
      },
      {
        h: 'Zwei Ziegenböckchen',
        b: '<p>Die ersten Buchstaben von <span class="he">נא אל הצאן</span>: נ, א, ה — <span class="he">נאה</span>. Die ersten Buchstaben von <span class="he">וקח לי משם שני</span>: ו, ל, מ, ש — <span class="he">משלו</span>, „von seinem Eigenen“; <span class="he">משם</span> = 380 = <span class="he">משלי</span>.</p><p>Es war Pessach: ein Böckchen für das Pessachopfer, das andere für das Festopfer. Und sie waren „von meinem Eigenen“: So hatte Jizchak es Riwka in die Ketuba geschrieben (Raschi).</p><p class="expl"><b>Erklärung.</b> Für eine Mizwa nimmt man sein Eigenes, ehrlich verdient — und das Beste: „zwei gute Ziegenböckchen“.</p>',
      },
      {
        h: 'Der Duft von Pessach',
        b: '<p><span class="he">וירח</span> = 6 + 10 + 200 + 8 = 224 = <span class="he">יום פסח היה</span>. <span class="he">ריח</span> = 200 + 10 + 8 = 218 = <span class="he">ליל פסח</span>.</p><p>Raschi: Von Jaakows Kleidern kam der Duft des Gartens Eden.</p><p class="expl"><b>Erklärung.</b> Jizchak segnete Jaakow an Pessach — an dem Fest, an dem G-tt später seine Nachkommen in die Freiheit führen wird.</p>',
      },
      {
        h: 'Wer war es denn?',
        b: '<p>Die ersten Buchstaben von <span class="he">ויאמר מי אפוא</span>: ו, מ, א — <span class="he">אמו</span>, „seine Mutter“.</p><p>Jizchak „erschrak mit großem Schrecken“ und fragte: „Wer war es denn?“ Die Antwort steckt in der Frage selbst: Riwka hat alles eingerichtet. Und Jizchak sagte: „Er soll auch gesegnet sein.“</p><p class="expl"><b>Erklärung.</b> Riwka sah, wem der Segen zustand, und hatte keine Angst zu handeln. Und Jizchak war, als er es verstand, mit ihr einverstanden.</p>',
      },
    ],
  },
  final: {
    title: 'Der Segen ging an Jaakow',
    allSolved:
      'Alle vier Rätsel sind gelöst. Jizchak sah aus wie Awraham, und Lawan „der Aramäer“ ist „der Betrüger“; das Haus Jaakows ist Feuer, das Haus Esaws Stroh; nach Esaw kommen siebzig Völker, Jaakow aber lernte in den Zelten Schems und ist so viel wie „ein Engel G-ttes“; das Land wird nach sechs Generationen gegeben, weil Awraham 172 Jahre auf G-ttes Stimme hörte; und den Segen bekam Jaakow an Pessach — sechsundzwanzig Wörter, so viel wie die Zahl des Namens.',
  },
  audience: 'Gematria von ein, zwei Wörtern, Minusrechnen, Buchstabenspiele; eine bekannte Geschichte — Jaakow und Esaw, die Linsensuppe und Jizchaks Segen. Jüngere Kinder — zusammen mit einem Erwachsenen.',
  practice:
    'Tu diese Woche eine gute Tat „von deinem Eigenen“ — mit deiner Zeit, deiner Kraft, deinem Taschengeld — und tu sie so gut du kannst, so wie Riwka „zwei gute Ziegenböckchen“ wählte.',
  highlight: '„Duft“ ist so viel wie „die Nacht von Pessach“: Jizchak segnete Jaakow an Pessach.',
  share: ({ score, max, time, grid, allSolved, site }) => `🍲 Welcher Name steckt in Esaws Worten „lass mich schlucken“? Die Antwort steckt in den ersten Buchstaben.

Ich spiele ein Gematria-Spiel nach dem Kommentar des Baal HaTurim zum Wochenabschnitt Toldot. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bis jetzt:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: wem Jizchak ähnlich sah und was „Stroh und Feuer“ bedeutet, wie viele Völker nach Jaakow kamen und in wessen Zelten er lernte, die 172 Jahre Awrahams und an welchem Fest Jizchak Jaakow segnete. Schaffst du es besser?
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Nach dem Kommentar des Baal HaTurim (Rabbi Jaakow ben Ascher, 14. Jh.) zum Wochenabschnitt Toldot (Bereschit 25,19–28,9), Kurzfassung („Kizur Baal HaTurim“). Hebräischer Text — Sefaria.',
};

export default de;
