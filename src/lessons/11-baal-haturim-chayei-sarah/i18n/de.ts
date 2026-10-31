import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Baal HaTurim: Chaje Sara',
  hero: {
    heading: 'Baal HaTurim: <i>vier Rätsel über Saras Zelt</i>',
    author: 'nach dem Kommentar des Baal HaTurim, Rabbi Jaakow ben Ascher',
    intro:
      'Der Baal HaTurim hat im Wochenabschnitt Chaje Sara versteckte Wörter und Zahlen gefunden. Rechne selbst: Welche „Sonne“ steckt in Saras Jahren, was hat die Höhle Machpela gekostet, worauf hat Awrahams Diener geschworen und worum hat er am Brunnen gebetet, und wie kam Riwka in Saras Zelt?',
  },
  summary:
    'Chaje Sara mit den Augen des Baal HaTurim: „Sara — hundert Jahre“ — die Anfangsbuchstaben ergeben „Sonne“, „und es waren“ = Saras 37 wichtigste Jahre, „an Efron“ = 400 = „ein böses Auge“, „und das Feld Efrons ging über“ — Esaw, „doch deine Hand“ = „Beschneidung“, Wasser und Blut im Gebet am Brunnen, „mit diesem Mann“ — Mosche, „werde“ = „so“, „und er brachte sie“ = 24.',
  glossary: {
    'חיי שרה': '„das Leben Saras“ — der Name des Wochenabschnitts',
    'שרה': 'Sara',
    'מאה': '„hundert“',
    'שנה': '„Jahr“',
    'שרה מאה שנה': '„Sara — hundert Jahre“ — aus dem ersten Vers des Wochenabschnitts',
    'שמש': 'Schemesch — die Sonne',
    'רבקה': 'Riwka',
    'רחל': 'Rachel',
    'לאה': 'Lea',
    'מלכה': 'Milka — die Mutter Betuels',
    'ויהיו': '„und es waren“ — das erste Wort des Wochenabschnitts',
    'ויהיו חיי שרה': '„und das Leben Saras war“ — der Anfang des Wochenabschnitts',
    'עפרון': 'Efron — der Name vollständig geschrieben',
    'עפרן': 'Efron — ohne ו: so steht es, als Awraham das Silber abwiegt',
    'לעפרן': '„an Efron“ — ohne ו geschrieben',
    'עין רע': '„ein böses Auge“ — Geiz, wenn man anderen nichts gönnt',
    'עין טובה': '„ein gutes Auge“ — Großzügigkeit',
    'לב טוב': '„ein gutes Herz“',
    'יד פתוחה': '„eine offene Hand“',
    'ויקם שדה עפרון': '„und das Feld Efrons ging über“ — an Awraham',
    'עשו': 'Esaw — der Zwillingsbruder Jaakows',
    'נא': '„doch“, „bitte“',
    'ידך': '„deine Hand“',
    'נא ידך': '„doch deine Hand“',
    'שים נא ידך': '„leg doch deine Hand“ — so ließ Awraham seinen Diener schwören',
    'מילה': 'Mila — die Beschneidung',
    'ברית': 'Brit — der Bund',
    'שבועה': 'ein Schwur',
    'תפלין': 'Tefillin',
    'עם אדני אברהם': '„meinem Herrn Awraham“ — aus dem Gebet des Dieners am Brunnen',
    'חסד': 'Chessed — Güte, eine gute Tat',
    'חסד עם אדני אברהם': '„Güte für meinen Herrn Awraham“',
    'מים': 'Majim — Wasser',
    'דמים': 'Damim — Blut',
    'ד': 'der Buchstabe Dalet',
    'ובה אדע': '„und an ihr werde ich erkennen“ — aus dem Gebet des Dieners am Brunnen',
    'עם האיש הזה': '„mit diesem Mann“ — man fragte Riwka: „Gehst du mit diesem Mann?“',
    'משה': 'Mosche',
    'את היי': '„du — werde“ — aus dem Segen für Riwka',
    'היי': '„werde“ (im Segen für Riwka)',
    'כה': '„so“ — „so wird deine Nachkommenschaft sein“',
    'אלף': '„tausend“',
    'רב': '„viel“',
    'זרע': '„Nachkommenschaft“',
    'לשוח בשדה': '„um auf dem Feld zu sprechen“ — Jizchak ging gegen Abend aufs Feld',
    'ויבאה': '„und er brachte sie“ — hier ohne das zweite י',
    'ויביאה': '„und er brachte sie“ — vollständig geschrieben, mit zwei י',
    'ויבאה יצחק האהלה': '„und Jizchak brachte sie ins Zelt“',
  },
  translit: {
    'ויהיו': 'wajihju',
    'עפרן': 'Efron',
    'נא': 'na',
    'ידך': 'jadcha',
    'היי': 'haji',
    'ויבאה': 'wajewieha',
  },
  riddles: [
    {
      title: 'Saras Sonne',
      cond: `<p>Der Baal HaTurim ist Rabbi Jaakow ben Ascher (um 1269–1343). Er schrieb das Gesetzbuch <i>Arba’a Turim</i>. Zu jedem Vers der Tora schrieb er kurze Hinweise: Gematria, die ersten und letzten Buchstaben von Wörtern und Wörter, die im Tanach nur zwei- oder dreimal vorkommen. Der Wochenabschnitt Chaje Sara beginnt so:</p><p class="verse" dir="rtl" lang="he">ויהיו חיי שרה מאה שנה ועשרים שנה ושבע שנים שני חיי שרה</p><p>„Und das Leben Saras war hundert Jahre und zwanzig Jahre und sieben Jahre — die Jahre des Lebens Saras.“<sup data-src="gen-23-1"></sup></p>`,
      steps: [
        {
          q: 'Der Baal HaTurim nimmt die Anfangsbuchstaben der Wörter <span class="he">שרה מאה שנה</span> — „Sara — hundert Jahre“. Du darfst die Buchstaben umstellen. Welches Wort entsteht?',
          hint: 'Ein Wort aus drei Buchstaben: das, was jeden Morgen aufgeht und jeden Abend untergeht.',
        },
        {
          q: 'Direkt vor diesem Abschnitt, am Ende von Wajera, erzählt die Tora: „Und Betuel zeugte …“ Der Baal HaTurim: Bevor Saras „Sonne“ unterging, war die Sonne dieses Mädchens schon aufgegangen. Wer ist sie?',
          opts: ['Riwka', 'Rachel', 'Lea', 'Milka'],
        },
        {
          q: 'Der Abschnitt beginnt mit dem Wort <span class="he">ויהיו</span> — „und es waren“. Wie viel ergibt es?',
          hint: 'ו = 6, י = 10, ה = 5.',
        },
        {
          q: 'Sara war 90, als Jizchak geboren wurde, und sie wurde 127 Jahre alt. Wie viele Jahre lebte Sara nach Jizchaks Geburt?',
          hint: '127 − 90.',
        },
      ],
      reveal: {
        h: 'Eine Sonne geht unter — eine andere geht auf',
        p: 'Die Anfangsbuchstaben von „Sara mea schana“ ergeben שמש, „Sonne“: Bevor Saras Sonne unterging, ging Riwkas Sonne auf. Und „wajihju“ = 37 — so viele Jahre lebte Sara nach Jizchaks Geburt: Das waren ihre wichtigsten Jahre.',
      },
      lessons: [
        {
          h: 'Die Sonne geht unter — die Sonne geht auf',
          b: `<p>Die Anfangsbuchstaben von <span class="he">שרה מאה שנה</span>: ש, מ, ש — <span class="he">שמש</span>, „Sonne“.<sup data-src="bht-23-1"></sup> Der Baal HaTurim bringt einen Vers aus dem Buch Kohelet: „Die Sonne geht auf, und die Sonne geht unter.“<sup data-src="ecclesiastes-1-5"></sup></p><p>Und die letzten Worte des vorigen Abschnitts handeln von der Familie von Awrahams Bruder: „Und Betuel zeugte Riwka.“<sup data-src="gen-22-23"></sup> Riwka wird Jizchaks Frau und die Herrin von Saras Zelt.</p><p class="expl"><b>Erklärung.</b> Die Welt bleibt nie ohne Gerechte: Bevor einer geht, ist der schon geboren, der seine Arbeit weiterführt.</p>`,
        },
        {
          h: 'Siebenunddreißig wichtigste Jahre',
          b: `<p><span class="he">ויהיו</span> = 6 + 10 + 5 + 10 + 6 = 37.<sup data-src="bht-23-1"></sup></p><p>Als G-tt Awraham einen Sohn versprach, wunderte er sich: „Soll Sara, neunzig Jahre alt, ein Kind bekommen?“<sup data-src="gen-17-17"></sup> 127 − 90 = 37: genau so viele Jahre lebte Sara mit ihrem Sohn.</p><p class="expl"><b>Erklärung.</b> Die wichtigsten Jahre im Leben sind die, in denen man die großzieht, die den eigenen Weg weitergehen.</p>`,
        },
      ],
      reflection: 'Sara lebte so, dass nach ihr eine neue Sonne „aufging“ — Riwka. Wem kann ich heute etwas Gutes weitergeben, das ich selbst gelernt habe?',
      takeaways: [
        'Die Anfangsbuchstaben von „שרה מאה שנה“ ergeben שמש, die Sonne.',
        'Bevor Saras Sonne unterging, ging Riwkas Sonne auf.',
        'ויהיו = 37 = 127 − 90: Saras wichtigste Jahre — seit Jizchaks Geburt.',
      ],
    },
    {
      title: 'Der Preis der Höhle',
      cond: `<p>Sara starb in Chewron. Awraham wollte sie in der Höhle Machpela begraben und kaufte das Feld mit der Höhle vom Hethiter Efron. Efron redete viel und schön, aber als es um den Preis ging, nannte er eine riesige Summe. Und die Tora erzählt:</p><p class="verse" dir="rtl" lang="he">וישקל אברהם לעפרן את הכסף</p><p>„Und Awraham wog Efron das Silber ab, das er vor den Söhnen Chets genannt hatte: vierhundert Schekel Silber, wie es bei den Händlern gilt.“<sup data-src="gen-23-16"></sup></p>`,
      steps: [
        {
          q: 'Zuerst ist Efrons Name vollständig geschrieben, <span class="he">עפרון</span>, aber hier, als Awraham das Silber abwiegt, steht er ohne ו: <span class="he">עפרן</span>. Wie viel ergibt dieses Wort?',
          hint: 'ע = 70, פ = 80, ר = 200, ן = 50.',
        },
        {
          q: 'Der Baal HaTurim: Genau so viele Schekel nahm Efron für die Höhle. Und welcher Ausdruck ergibt dieselbe Zahl — und sagt, <b>was für ein Mensch</b> Efron war?',
          opts: ['„ein böses Auge“ — Geiz', '„ein gutes Auge“ — Großzügigkeit', '„ein gutes Herz“', '„eine offene Hand“'],
        },
        {
          q: 'Das Feld ging an Awraham über: <span class="he">ויקם שדה עפרון</span> — „und das Feld Efrons ging über“. Nimm die Anfangsbuchstaben dieser Wörter — du darfst sie umstellen. Wessen Name steckt darin?',
          hint: 'Der Name von Jaakows Zwillingsbruder.',
        },
      ],
      reveal: {
        h: 'Ein böses Auge',
        p: 'Efron ohne ו ergibt 400 — wie „Ajin ra“, „ein böses Auge“, und wie die 400 Schekel, die er für die Höhle nahm. Und die Anfangsbuchstaben von „wajakam sede Efron“, rückwärts gelesen, ergeben Esaw: Er wird später um die Höhle streiten.',
      },
      lessons: [
        {
          h: 'Vierhundert Schekel',
          b: `<p><span class="he">עפרן</span> = 70 + 80 + 200 + 50 = 400; <span class="he">עין רע</span> = 130 + 270 = 400.<sup data-src="bht-23-16"></sup></p><p>Auch Raschi erklärt, warum Efrons Name an dieser Stelle kein ו hat.<sup data-src="rashi-23-16"></sup></p><p class="expl"><b>Erklärung.</b> Zuerst bot Efron das Feld als Geschenk an, dann nahm er eine riesige Summe. Der Buchstabe, der in seinem Namen fehlt, zeigt, was ihm selbst fehlte: ein gutes Auge.</p>`,
        },
        {
          h: 'Esaw und die Höhle',
          b: `<p>Die Anfangsbuchstaben von <span class="he">ויקם שדה עפרון</span>: ו, ש, ע — rückwärts: <span class="he">עשו</span>, Esaw.<sup data-src="bht-23-17"></sup> Die Tora zählt genau auf, was an Awraham überging: das Feld, die Höhle, alle Bäume ringsum — alles vor den Augen der Leute der Stadt.<sup data-src="gen-23-17"></sup></p><p class="expl"><b>Erklärung.</b> Awraham zahlte den vollen Preis vor Zeugen. Was ehrlich gekauft ist, gehört dir, auch wenn es später jemand bestreiten will.</p>`,
        },
      ],
      reflection: 'Efron gönnte Awraham nichts. Wo kann ich heute einen anderen mit einem „guten Auge“ ansehen — mich für ihn freuen oder gern etwas teilen?',
      takeaways: [
        'עפרן ohne ו = 400 = עין רע, „ein böses Auge“.',
        '400 — so viele Schekel nahm Efron für die Höhle Machpela.',
        'Die Anfangsbuchstaben von „ויקם שדה עפרון“, rückwärts, ergeben עשו: Esaw wird um die Höhle streiten.',
      ],
    },
    {
      title: 'Ein Schwur und ein Gebet am Brunnen',
      cond: `<p>Awraham wurde alt und schickte seinen ältesten Diener los, um eine Frau für Jizchak zu finden — aus seiner eigenen Familie, in Aram Naharajim. Zuerst ließ er ihn schwören:</p><p class="verse" dir="rtl" lang="he">שים נא ידך תחת ירכי</p><p>„Leg doch deine Hand unter meine Hüfte, und ich lasse dich beim Ewigen schwören …“<sup data-src="gen-24-2"></sup></p><p>Der Diener kam zum Brunnen vor der Stadt und betete: „Ewiger, G-tt meines Herrn Awraham, lass es mir heute gelingen und tu Güte an meinem Herrn Awraham.“<sup data-src="gen-24-12"></sup></p><p class="verse" dir="rtl" lang="he">ועשה חסד עם אדני אברהם</p>`,
      steps: [
        {
          q: 'Wie viel ergeben die Wörter <span class="he">נא ידך</span> — „doch deine Hand“?',
          hint: 'נא = 50 + 1; ידך = 10 + 4 + 20.',
        },
        {
          q: 'Welches Wort ergibt dieselbe Zahl — und sagt, <b>worauf</b> Awraham ihn schwören ließ?',
          opts: ['Beschneidung', 'Bund', 'Schwur', 'Tefillin'],
        },
        {
          q: 'Nimm die Endbuchstaben der Wörter <span class="he">עם אדני אברהם</span> — „meinem Herrn Awraham“. Du darfst sie umstellen. Welches Wort entsteht?',
          hint: 'Ein Wort aus drei Buchstaben: das, was man trinkt.',
        },
        {
          q: 'Direkt vor diesen Wörtern steht <span class="he">חסד</span> — „Güte“. Nimm auch seinen letzten Buchstaben dazu. Welches Wort entsteht jetzt?',
          hint: 'Ein Wort aus vier Buchstaben: „Blut“.',
        },
      ],
      reveal: {
        h: 'Wasser und Blut',
        p: '„Na jadcha“ = 85 = „Mila“: Awraham ließ ihn bei der Beschneidung schwören. Die Endbuchstaben von „im adoni Awraham“ ergeben „Majim“, Wasser: Als Lohn für das Wasser, das Awraham seinen Gästen gab, antworte am Wasser. Und mit dem ד von „Chessed“ — „Damim“, Blut: im Verdienst Awrahams auf dem Berg Morija.',
      },
      lessons: [
        {
          h: 'Ein Schwur bei der Beschneidung',
          b: `<p><span class="he">נא ידך</span> = 51 + 34 = 85; <span class="he">מילה</span> = 40 + 10 + 30 + 5 = 85.<sup data-src="bht-24-2-2"></sup></p><p>Raschi erklärt, warum man beim Schwören einen Gegenstand einer Mizwa in der Hand hält und warum Awraham gerade diese Mizwa wählte.<sup data-src="rashi-24-2"></sup></p><p class="expl"><b>Erklärung.</b> Awraham verband den Schwur mit dem Wertvollsten, das er hatte: mit der Mizwa, die er unter Schmerzen erfüllt hatte.</p>`,
        },
        {
          h: 'Wasser und Blut',
          b: `<p>Die Endbuchstaben von <span class="he">עם אדני אברהם</span>: ם, י, ם — <span class="he">מים</span>, „Wasser“. Mit dem <span class="he">ד</span> aus <span class="he">חסד</span>: <span class="he">דמים</span>, „Blut“.<sup data-src="bht-24-12"></sup></p><p>Als drei Gäste zu Awraham kamen, sagte er: „Man soll ein wenig Wasser bringen, wascht eure Füße.“<sup data-src="gen-18-4"></sup> Und auf dem Berg Morija hatte er schon das Messer genommen, um Jizchak zu opfern.<sup data-src="gen-22-10"></sup></p><p class="expl"><b>Erklärung.</b> Gutes geht nie verloren: Das Wasser, das Awraham seinen Gästen gab, „kam“ zu seinem Haus „zurück“ — am Brunnen, wo der Diener Riwka traf.</p>`,
        },
      ],
      reflection: 'Awrahams Diener bat „im Verdienst“ der guten Taten seines Herrn. Welche gute Tat meiner Eltern oder Lehrer kann ich weiterführen?',
      takeaways: [
        'נא ידך = 85 = מילה: Awraham ließ ihn bei der Beschneidung schwören.',
        'Die Endbuchstaben von „עם אדני אברהם“ ergeben מים: Lohn für das Wasser für die Gäste.',
        'Mit dem ד aus חסד — דמים: im Verdienst Awrahams auf dem Berg Morija.',
      ],
    },
    {
      title: 'Riwka in Saras Zelt',
      cond: `<p>Am Brunnen gab Riwka dem Diener und allen seinen Kamelen zu trinken. Ihre Familie war einverstanden, aber sie fragte Riwka selbst:</p><p class="verse" dir="rtl" lang="he">התלכי עם האיש הזה</p><p>„Gehst du mit diesem Mann?“ Und sie sagte: „Ich gehe.“<sup data-src="gen-24-58"></sup> Vor der Reise segneten sie Riwka: „Unsere Schwester, werde zu Tausenden von Zehntausenden!“<sup data-src="gen-24-60"></sup> Und Jizchak brachte sie in das Zelt seiner Mutter Sara, nahm sie zur Frau und liebte sie.<sup data-src="gen-24-67"></sup></p>`,
      steps: [
        {
          q: 'Nimm die Endbuchstaben der Wörter <span class="he">עם האיש הזה</span> — „mit diesem Mann“. Du darfst sie umstellen. Wessen Name entsteht?',
          hint: 'Der Name dessen, der Israel die Tora brachte.',
        },
        {
          q: 'Im Segen steht <span class="he">את היי</span> — „du — werde“. Wie viel ergibt das Wort <span class="he">היי</span>?',
          hint: 'ה = 5, י = 10.',
        },
        {
          q: 'Der Baal HaTurim: Diese Zahl ergibt auch ein Wort aus dem Versprechen an Awraham, als G-tt ihm die Sterne zeigte: „… wird deine Nachkommenschaft sein“. Welches Wort?',
          opts: ['„so“', '„tausend“', '„viel“', '„Nachkommenschaft“'],
        },
        {
          q: '<span class="he">ויבאה</span> — „und er brachte sie“. Hier ist das Wort unvollständig geschrieben, ohne das zweite י. Wie viel ergibt es?',
          hint: 'ו = 6, י = 10, ב = 2, א = 1, ה = 5.',
        },
      ],
      reveal: {
        h: 'Vierundzwanzig Schmuckstücke',
        p: 'Die Endbuchstaben von „im ha-isch ha-se“ ergeben Mosche: Riwkas Hochzeit war nach dem Gesetz von Mosche und Israel. „Haji“ = 25 = „ko“, „so“: Möge das Versprechen an Awraham „so wird deine Nachkommenschaft sein“ wahr werden. Und „wajewieha“ ohne das zweite י = 24: Man schmückte Riwka mit vierundzwanzig Schmuckstücken.',
      },
      lessons: [
        {
          h: 'Nach dem Gesetz von Mosche',
          b: `<p>Die Endbuchstaben von <span class="he">עם האיש הזה</span>: ם, ש, ה — <span class="he">משה</span>.<sup data-src="bht-24-58"></sup></p><p class="expl"><b>Erklärung.</b> Man fragte Riwka, ob sie einverstanden ist — und sie antwortete selbst: „Ich gehe.“ Bei einer jüdischen Hochzeit sagt man bis heute: „nach dem Gesetz von Mosche und Israel“.</p>`,
        },
        {
          h: 'So wird deine Nachkommenschaft sein',
          b: `<p><span class="he">היי</span> = 5 + 10 + 10 = 25; <span class="he">כה</span> = 20 + 5 = 25.<sup data-src="bht-24-60-1"></sup> Das Wort <span class="he">כה</span> kommt aus dem Versprechen an Awraham: G-tt führte ihn hinaus und sagte: „Schau zum Himmel und zähle die Sterne, wenn du sie zählen kannst … So wird deine Nachkommenschaft sein.“<sup data-src="gen-15-5"></sup></p><p class="expl"><b>Erklärung.</b> Der Segen, den Awraham bekam, geht durch Riwka weiter: Von ihr kommt ein Volk, so zahlreich wie die Sterne.</p>`,
        },
        {
          h: 'Vierundzwanzig Schmuckstücke',
          b: `<p><span class="he">ויבאה</span> = 6 + 10 + 2 + 1 + 5 = 24.<sup data-src="bht-24-67-1"></sup> Vollständig würde man dieses Wort <span class="he">ויביאה</span> schreiben — mit zwei י.</p><p>Raschi erzählt, was mit Riwka ins Zelt zurückkam.<sup data-src="rashi-24-67"></sup></p><p class="expl"><b>Erklärung.</b> Riwkas schönster Schmuck waren ihre Taten: Im Zelt brannte wieder das Licht, im Brot war Segen und über dem Eingang eine Wolke — wie zu Saras Zeiten.</p>`,
        },
      ],
      reflection: 'Mit Riwka kamen Licht, Segen und die Wolke ins Zelt zurück. Was Gutes kann ich in mein Zuhause bringen — Licht, Ordnung, Wärme?',
      takeaways: [
        'Die Endbuchstaben von „עם האיש הזה“ ergeben משה: nach dem Gesetz von Mosche und Israel.',
        'היי = 25 = כה: „so wird deine Nachkommenschaft sein“.',
        'ויבאה ohne das zweite י = 24: Man schmückte Riwka mit 24 Schmuckstücken.',
        'Raschi: Mit Riwka kamen das Licht, der Segen im Teig und die Wolke ins Zelt zurück.',
      ],
    },
  ],
  memo: {
    intro:
      'Zwölf Kommentare des Baal HaTurim zum Wochenabschnitt Chaje Sara — zwölf Kartenpaare. Jedes Bild erzählt von einem Kommentar, und sein Paar sind die Worte der Tora, über die er spricht.',
    items: [
      {
        title: 'Riwkas Sonne',
        caption: 'Eine Sonne geht unter, eine andere auf',
        verse: '„das Leben Saras“',
        quote: 'Bevor die Sonne Saras unterging, ging die Sonne Riwkas auf.',
        explain:
          'Die letzten Worte des vorigen Abschnitts sind „Und Betuel zeugte Riwka“, und dieser Abschnitt beginnt mit Saras Tod. Der Baal HaTurim lehrt: G-tt hat schon vorher dafür gesorgt, dass Jizchak eine Frau bekommt, die zu Saras Zelt passt.',
        moral: 'Die Welt bleibt nie ohne Gerechte.',
      },
      {
        title: 'Eine Sonne in Saras Jahren',
        caption: 'Die Sonne am Himmel',
        verse: '„Sara — hundert Jahre“',
        quote: '„Sara — hundert Jahre“ — die Anfangsbuchstaben ergeben „Schemesch“ [Sonne]: „Die Sonne geht auf, und die Sonne geht unter.“',
        explain:
          'Nimm die Anfangsbuchstaben der Wörter שרה מאה שנה: ש, מ, ש — das ergibt שמש, „Sonne“. Saras Leben leuchtete wie die Sonne für alle, die in ihr Zelt kamen.',
        moral: 'Ein Gerechter leuchtet für andere wie die Sonne.',
      },
      {
        title: 'Saras wichtigste Jahre',
        caption: 'Sara mit dem kleinen Jizchak',
        verse: '„und das Leben Saras war“',
        quote: 'Die Zahl von „wajihju“ war der Hauptteil ihrer Jahre, seit Jizchak geboren wurde: Sie war neunzig, als er geboren wurde.',
        explain:
          'Das Wort ויהיו („und es waren“) = 37. Sara bekam Jizchak mit 90 und wurde 127 Jahre alt. 127 − 90 = 37: So viele Jahre zog sie ihren Sohn groß — das waren ihre wichtigsten Jahre.',
        note: '37 Jahre lebte Sara nach Jizchaks Geburt',
        moral: 'Die wichtigsten Jahre sind die, in denen man Kinder großzieht und ihnen Gutes beibringt.',
      },
      {
        title: 'Efrons böses Auge',
        caption: 'Eine Waage und Silbermünzen',
        verse: '„an Efron“',
        quote: '„An Efron“ — ohne Waw geschrieben: Gematria „Ajin ra“ [ein böses Auge]; „Efron“ = 400 — wie die vierhundert Schekel für die Höhle.',
        explain:
          'Efron redete schön, aber für die Höhle nahm er eine riesige Summe. Hier ist sein Name ohne ו geschrieben: עפרן = 400, wie עין רע — „ein böses Auge“, Geiz. Und 400 Schekel Silber zahlte ihm Awraham.',
        moral: 'Schön reden reicht nicht — schau andere mit einem guten Auge an.',
      },
      {
        title: 'Esaw und die Höhle',
        caption: 'Der Eingang der Höhle Machpela',
        verse: '„und das Feld Efrons ging über“',
        quote: '„Und das Feld Efrons ging über“ — die Anfangsbuchstaben, umgekehrt, ergeben „Esaw“: Er wird aufstehen, um die Höhle zu bestreiten.',
        explain:
          'Nimm die Anfangsbuchstaben der Wörter ויקם שדה עפרון: ו, ש, ע — lies sie rückwärts: עשו, Esaw. Awraham kaufte die Höhle ehrlich, vor Zeugen — und Esaw wird später streiten, wer dort begraben sein soll.',
        moral: 'Ein ehrlicher Kauf vor Zeugen schützt vor späterem Streit.',
      },
      {
        title: 'Ein Schwur bei der Beschneidung',
        caption: 'Awraham und sein Diener schwören',
        verse: '„leg doch deine Hand“',
        quote: '„Doch deine Hand“ — Gematria „Mila“ [Beschneidung]: Er ließ ihn bei der Beschneidung schwören.',
        explain:
          'Awraham ließ seinen Diener schwören, dass er für Jizchak eine Frau aus seiner Familie findet. נא ידך = 85, und מילה („Beschneidung“) = 85. Die Beschneidung war Awrahams erste Mizwa, und sie war ihm sehr wertvoll.',
        moral: 'Das wichtigste Versprechen verbindet man mit dem Wertvollsten.',
      },
      {
        title: 'Wasser am Brunnen',
        caption: 'Ein Brunnen und ein Krug Wasser',
        verse: '„meinem Herrn Awraham“',
        quote: '„Meinem Herrn Awraham“ — die Endbuchstaben ergeben „Majim“ [Wasser]: Als Lohn für „man soll ein wenig Wasser bringen“ antworte ihm am Wasser.',
        explain:
          'Der Diener betete am Brunnen: „Tu Güte an meinem Herrn Awraham.“ Die Endbuchstaben von עם אדני אברהם: ם, י, ם — מים, „Wasser“. Awraham hatte einmal seinen Gästen Wasser gegeben — und jetzt kam die Antwort am Wasser.',
        moral: 'Das Gute, das wir tun, kommt zurück.',
      },
      {
        title: 'Ein Mädchen, das Gutes tut',
        caption: 'Riwka tränkt die Kamele',
        verse: '„und an ihr werde ich erkennen“',
        quote: '„Und an ihr werde ich erkennen, dass Du Güte erwiesen hast“ — wenn sie eine Gerechte ist, die Gutes tut.',
        explain:
          'Der Diener bat um ein Zeichen: ein Mädchen, das ihm und auch seinen Kamelen zu trinken gibt. Der Baal HaTurim erklärt: So erkennt er, dass sie gerecht ist und gern Gutes tut — und so ein Mädchen passt zu Jizchak.',
        moral: 'Ein gutes Herz zeigt sich in Taten.',
      },
      {
        title: 'Nach dem Gesetz von Mosche',
        caption: 'Riwka reist auf einem Kamel los',
        verse: '„mit diesem Mann“',
        quote: '„Mit diesem Mann“ — die Endbuchstaben ergeben „Mosche“: ein Hinweis, dass alles nach dem Gesetz von Mosche und Israel geschah.',
        explain:
          'Die Familie fragte Riwka: „Gehst du mit diesem Mann?“ — und sie antwortete: „Ich gehe.“ Die Endbuchstaben von עם האיש הזה: ם, ש, ה — משה, Mosche. Auch heute sagt man bei einer Hochzeit: „nach dem Gesetz von Mosche und Israel“.',
        moral: 'Eine Ehe baut man nach dem Gesetz der Tora — und mit dem Ja der Braut.',
      },
      {
        title: 'So wird deine Nachkommenschaft sein',
        caption: 'Ein Sternenhimmel',
        verse: '„du — werde“',
        quote: '„Haji“ ist in Gematria „ko“ [so]: Mögest du das verdienen, was gesagt ist: „So wird deine Nachkommenschaft sein.“',
        explain:
          'Man segnete Riwka: „Werde zu Tausenden von Zehntausenden!“ Das Wort היי = 25, und כה („so“) = 25. Dieses Wort stammt aus dem Versprechen an Awraham: „Schau die Sterne an … so wird deine Nachkommenschaft sein.“',
        moral: 'Der Segen der Eltern lebt in den Kindern weiter.',
      },
      {
        title: 'Das Mincha-Gebet',
        caption: 'Jizchak betet am Abend auf dem Feld',
        verse: '„um auf dem Feld zu sprechen“',
        quote: '„Um auf dem Feld zu sprechen“ — Jizchak hat das Mincha-Gebet eingeführt, und da begegnete ihm Riwka.',
        explain:
          'Jizchak ging gegen Abend aufs Feld — und betete. So begann das Nachmittagsgebet, Mincha. Und genau da kam die Karawane mit Riwka näher: Das Gebet und seine Antwort trafen sich.',
        moral: 'Auch mitten am Tag lohnt es sich, anzuhalten und zu beten.',
      },
      {
        title: 'Vierundzwanzig Schmuckstücke',
        caption: 'Riwka kommt geschmückt ins Zelt',
        verse: '„und Jizchak brachte sie ins Zelt“',
        quote: '„Und er brachte sie“ — unvollständig geschrieben und ergibt vierundzwanzig: Man schmückte sie mit vierundzwanzig Schmuckstücken.',
        explain:
          'Das Wort ויבאה ist hier ohne das zweite י geschrieben und ergibt 24. Jizchak brachte Riwka geschmückt wie eine Braut in Saras Zelt. Und Raschi erzählt: Mit ihr kamen das Licht, der Segen im Brot und die Wolke ins Zelt zurück.',
        note: '24 Schmuckstücke einer Braut',
        moral: 'Der schönste Schmuck sind gute Taten.',
      },
    ],
  },
  final: {
    title: 'Das Zelt leuchtet wieder',
    allSolved:
      'Alle vier Rätsel sind gelöst. In Saras Jahren steckt eine Sonne, und bevor sie unterging, ging Riwkas Sonne auf; Efron ohne ו ist „ein böses Auge“ und 400 Schekel; Awraham ließ seinen Diener bei der Beschneidung schwören, und am Brunnen bat der Diener „im Verdienst von Wasser und Blut“; Riwka ging „nach dem Gesetz von Mosche“, bekam den Segen „so wird deine Nachkommenschaft sein“ und kam in Saras Zelt — und das Licht kam zurück.',
  },
  audience: 'Gematria von einem oder zwei Wörtern, Subtraktion, Spiele mit Anfangs- und Endbuchstaben; eine bekannte Geschichte — Sara, Efron, Awrahams Diener und Riwka am Brunnen. Jüngere Kinder — zusammen mit einem Erwachsenen.',
  practice:
    'Tu diese Woche etwas Gutes „wie Riwka“ — mehr, als man dich bittet: Wenn jemand um Wasser für einen bittet, gib auch denen neben ihm zu trinken; wenn du hilfst, spare nicht an Zeit und Mühe.',
  highlight: '„An Efron“ ohne ו ergibt „ein böses Auge“: 400 — wie die vierhundert Schekel, die er für die Höhle nahm.',
  share: ({ score, max, time, grid, allSolved, site }) => `☀️ Welche „Sonne“ steckt in Saras Jahren? Die Antwort steckt in den Anfangsbuchstaben der Wörter.

Ich spiele ein Gematria-Spiel nach dem Kommentar des Baal HaTurim zum Wochenabschnitt Chaje Sara. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bis jetzt:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: Saras Sonne und ihre wichtigsten Jahre, was die Höhle Machpela kostete und was ein „böses Auge“ ist, worauf Awrahams Diener schwor und worum er am Brunnen bat, wie Riwka in Saras Zelt kam. Schaffst du es besser?
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Nach dem Kommentar des Baal HaTurim (Rabbi Jaakow ben Ascher, 14. Jahrhundert) zum Wochenabschnitt Chaje Sara (Bereschit 23,1–25,18), kurze Fassung („Kizur Baal HaTurim“). Hebräischer Text — Sefaria.',
};

export default de;
