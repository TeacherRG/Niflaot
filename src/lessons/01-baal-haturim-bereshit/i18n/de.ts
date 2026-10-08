import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Baal HaTurim: Bereschit',
  hero: {
    heading: 'Baal HaTurim: <i>vier Rätsel zum Anfang der Tora</i>',
    author: 'nach dem Kommentar des Baal HaTurim, Rabbi Jaakow ben Ascher',
    intro:
      'Der große Kommentator fand in den ersten Kapiteln der Tora Zahlen, Anfangs- und Endbuchstaben von Wörtern und „Paare“ der Massora. Rechne selbst nach: wann die Welt erschaffen wurde, warum das Licht die Tora ist, woraus der Mensch gemacht ist und wen der Allmächtige liebt.',
  },
  summary:
    'Bereschit 1–4 mit den Augen des Baal HaTurim: „Bereschit bara“ = „an Rosch Haschana erschaffen“, Licht = 613, der Mensch aus Erde, Siegel und Challa, der siebte Tag und die siebte Generation.',
  glossary: {
    'בראשית': 'im Anfang',
    'ברא': 'erschuf',
    'את': 'Partikel des direkten Objekts',
    'האור': 'das Licht',
    'אדמה': 'Erde, Erdboden',
    'ויבאה': 'und Er brachte sie',
    'עדי': 'mein Zeuge',
  },
  riddles: [
    {
      title: 'Im Anfang — Wahrheit',
      cond: `<p>Der Baal HaTurim ist Rabbi Jaakow ben Ascher (um 1269–1343), Verfasser des Gesetzeskodex „Arba’a Turim“. Zu jedem Vers der Tora hinterließ er kurze Andeutungen: Gematrien, Anfangs- und Endbuchstaben von Wörtern, Wörter, die im ganzen Tanach genau zwei- oder dreimal vorkommen. Seine erste Andeutung gilt den ersten Worten der Tora:</p><p class="verse" dir="rtl" lang="he">בראשית ברא אלקים את השמים ואת הארץ</p><p>„Im Anfang erschuf G-tt den Himmel und die Erde.“<sup data-src="gen-1-1"></sup></p>`,
      steps: [
        {
          q: 'Was ergeben die ersten zwei Wörter der Tora, <span class="he">בראשית ברא</span>?',
          hint: 'בראשית = 2 + 200 + 1 + 300 + 10 + 400; ברא = 2 + 200 + 1.',
        },
        {
          q: 'Der Baal HaTurim fand einen Ausdruck mit derselben Gematria — er sagt, <b>wann</b> die Welt erschaffen wurde. Welchen?',
          opts: ['„an Rosch Haschana erschaffen“', '„im Monat Nissan erschaffen“', '„am ersten Tag erschaffen“', '„in sechs Tagen erschaffen“'],
        },
        {
          q: 'Bilde ein Wort aus den <b>letzten</b> Buchstaben der ersten drei Wörter der Tora. Die Buchstaben dürfen umgestellt werden.',
          hint: 'Die letzten Buchstaben der Wörter sind markiert. Es ergibt ein Wort aus drei Buchstaben, das „Wahrheit“ bedeutet.',
        },
        {
          q: 'Im zweiten Kapitel heißt es: „Dies sind die Hervorbringungen des Himmels und der Erde <span class="he">בהבראם</span> — als sie erschaffen wurden“. Stelle <b>alle</b> Buchstaben dieses Wortes so um, dass „in Awraham“ entsteht — der Name des Erzvaters mit der Vorsilbe <span class="he">ב</span>.',
          hint: 'Awrahams Name ist אברהם. Setze ב („in“) davor.',
        },
      ],
      reveal: {
        h: 'Die Welt wurde an Rosch Haschana erschaffen — mit Wahrheit',
        p: 'Die ersten zwei Wörter der Tora, „Bereschit bara“, ergeben 1116 — wie „an Rosch Haschana erschaffen“. Die Endbuchstaben von „Bereschit bara Elokim“ bilden das Wort „Emet“, Wahrheit: Die Welt ist mit Wahrheit erschaffen. Und das Wort „behibar’am“, „als sie erschaffen wurden“, hat dieselben Buchstaben wie „be-Awraham“: Himmel und Erde wurden um Awrahams willen erschaffen.',
      },
      lessons: [
        {
          h: 'Wie man den Baal HaTurim liest',
          b: `<p>Der Kommentar des Baal HaTurim, der in fast jedem Chumasch abgedruckt ist, besteht aus kurzen Andeutungen. Er nutzt mehrere Mittel. <b>Gematria</b>: Zwei Ausdrücke mit derselben Zahl hängen im Sinn zusammen. <b>Raschej tewot und Sofej tewot</b> (<span class="he">ר״ת</span>, <span class="he">ס״ת</span>): Die Anfangs- oder Endbuchstaben benachbarter Wörter bilden ein neues Wort. <b>Notarikon</b>: Jeder Buchstabe eines Wortes wird als Anfang eines eigenen Wortes gelesen. <b>„Zwei in der Massora“</b> (<span class="he">ב׳ במסורה</span>): Ein Wort kommt im ganzen Tanach genau zweimal vor, und die beiden Stellen erklären einander.</p><p>Jede Zahl in dieser Lektion ist geprüft. Zwei Gematrien des Kommentars gehen in unserer Rechnung nicht auf — das wird offen gesagt, und sie wurden nicht in die Rätsel aufgenommen.</p>`,
        },
        {
          h: 'Die Welt wurde an Rosch Haschana erschaffen',
          b: `<p>Der Baal HaTurim schreibt: „<b>Bereschit bara</b> — in Gematria: <b>an Rosch Haschana erschaffen</b> (die Welt).“<sup data-src="bht-1-1"></sup> <span class="he">בראשית</span> = 913, <span class="he">ברא</span> = 203, zusammen 1116. Und <span class="he">בראש</span> (503) + <span class="he">השנה</span> (360) + <span class="he">נברא</span> (253) ergibt ebenfalls 1116.</p><p>Die allerersten Worte der Tora sprechen von dem Tag, an dem die Welt begann: vom Haupt des Jahres.</p>`,
        },
        {
          h: '„Bereschit“ — um der Tora und Israels willen',
          b: `<p>Weiter liest der Baal HaTurim <span class="he">בראשית</span> als Notarikon — sechs Buchstaben, sechs Wörter: <span class="he">בראשונה ראה אלקים שיקבלו ישראל תורה</span> — „<b>vor allem sah G-tt, dass Israel die Tora annehmen wird</b>“.</p><p>Noch bevor Er Himmel und Erde erschuf, „sah“ der Allmächtige das Ziel der Schöpfung: ein Volk, das die Tora annehmen wird.</p>`,
        },
        {
          h: 'Das Siegel der Wahrheit',
          b: `<p>Die Endbuchstaben von <span class="he">בראשית ברא אלקים</span> — <span class="he">ת</span>, <span class="he">א</span>, <span class="he">ם</span> — bilden das Wort <span class="he">אמת</span>, „Wahrheit“. Das lehrt, sagt der Baal HaTurim, dass der Allmächtige die Welt mit Wahrheit erschuf, wie es heißt: „Der Anfang Deines Wortes ist Wahrheit.“<sup data-src="ps-119-160"></sup> „Und so gibt es viele Verse, deren Endbuchstaben <span class="he">אמת</span> ergeben.“</p><p>Der Anfang von G-ttes Wort — der erste Vers der Tora — trägt an seinem „Ende“ das Siegel der Wahrheit.</p>`,
        },
        {
          h: 'Der Geist des Maschiach',
          b: `<p>Zum zweiten Vers — „und der Geist G-ttes schwebte über den Wassern“ — schreibt der Baal HaTurim: Die Worte <span class="he">ורוח אלקים מרחפת</span> entsprechen in Gematria <span class="he">זו רוחו של משיח</span>, „das ist der Geist des Maschiach“.<sup data-src="bht-1-2"></sup> Schon im zweiten Vers der Tora, über den Urwassern, schwebt der Geist der künftigen Erlösung.</p><p>Ehrlich gesagt: In unserer Rechnung stimmen die Zahlen nicht überein (1034 und 921) — vielleicht hatte der Baal HaTurim eine andere Schreibweise der Wörter. Darum ist diese Gematria nicht Teil der Rätsel.</p>`,
        },
        {
          h: 'Um Awrahams willen',
          b: `<p>Im zweiten Kapitel: „Dies sind die Hervorbringungen des Himmels und der Erde <span class="he">בהבראם</span> — als sie erschaffen wurden.“<sup data-src="gen-2-4"></sup> Der Baal HaTurim: Die Buchstaben von <span class="he">בהבראם</span> sind die Buchstaben von <span class="he">באברהם</span>, „in Awraham“: <b>Durch das Verdienst Awrahams wurden Himmel und Erde erschaffen</b>.<sup data-src="bht-2-4"></sup> Beide Wörter haben dieselben Buchstaben, also auch dieselbe Gematria — 250.</p><p>Am Ende desselben Verses steht „Erde und Himmel“ — in umgekehrter Reihenfolge. Laut der Massora kommt dieser Ausdruck zweimal vor: hier und im Psalm „Seine Herrlichkeit ist über Erde und Himmel“. Warum dankt man für Erde und Himmel? Weil Er Erde und Himmel gemacht hat.</p>`,
        },
      ],
      reflection: 'Womit beginnt mein Tag? Wenn „der Anfang Deines Wortes Wahrheit ist“ — welches erste Wort, welche erste Tat am Morgen gibt allem anderen den Ton?',
      takeaways: [
        'בראשית ברא = 1116 = בראש השנה נברא: Die Welt wurde an Rosch Haschana erschaffen.',
        'Notarikon von בראשית: „vor allem sah G-tt, dass Israel die Tora annehmen wird“.',
        'Die Endbuchstaben von בראשית ברא אלקים bilden אמת: Die Welt ist mit Wahrheit erschaffen; „der Anfang Deines Wortes ist Wahrheit“.',
        'בהבראם hat die Buchstaben von באברהם (250): Himmel und Erde wurden um Awrahams willen erschaffen.',
      ],
      puzzle: {
        q: 'Ordne die Andeutungen in der Reihenfolge des Toratextes.',
        pieces: ['בראשית ברא = 1116', '„An Rosch Haschana erschaffen“', 'Endbuchstaben: אמת', 'בהבראם = באברהם'],
        meaning: 'Die ersten Worte der Tora nennen den Tag der Schöpfung — Rosch Haschana; ihre Endbuchstaben setzen das Siegel der Wahrheit; und „als sie erschaffen wurden“ verrät, um wessentwillen: um Awrahams willen.',
      },
    },
    {
      title: 'Das Licht ist die Tora',
      cond: `<p>Der erste Tag der Schöpfung. Die Tora sagt:</p><p class="verse" dir="rtl" lang="he">וירא אלקים את האור כי טוב ויבדל אלקים בין האור ובין החשך</p><p>„Und G-tt sah das Licht, dass es gut war, und G-tt schied zwischen dem Licht und der Finsternis.“<sup data-src="gen-1-1"></sup></p><p>Der Baal HaTurim findet in diesem Vers drei Andeutungen: auf die Tora, auf den Bund und auf die Hawdala — die Trennung am Ausgang des Schabbats.</p>`,
      steps: [
        {
          q: 'Was ergeben die Wörter <span class="he">את האור</span> — „das Licht“ (mit der Partikel des direkten Objekts <span class="he">את</span>)?',
          hint: 'את = 1 + 400; האור = 5 + 1 + 6 + 200.',
        },
        { q: 'Welches Wort hat dieselbe Gematria?', opts: ['„in der Tora“', '„Tora“', '„Glaube“', '„Gebot“'] },
        {
          q: 'Bilde ein Wort aus den <b>letzten</b> Buchstaben von <span class="he">את האור כי טוב</span> („das Licht, dass es gut war“). Die Buchstaben dürfen umgestellt werden.',
          hint: 'Die letzten Buchstaben sind markiert. Es ergibt ein Wort, das „Bund“ bedeutet.',
        },
        { q: 'Was ergibt das Wort <span class="he">ויבדל</span> — „und Er schied“?', hint: '6 + 10 + 2 + 4 + 30.' },
        {
          q: 'Am vierten Tag: „Es seien Leuchten.“ Gewöhnlich schreibt man das Wort <span class="he">מאורת</span>, in der Tora hat es aber <b>einen Buchstaben weniger</b>: <span class="he">מארת</span>. Tippe den Buchstaben an, der in der Tora fehlt.',
          hint: 'Vergleiche die beiden Schreibungen Buchstabe für Buchstabe: מ־א־?־ר־ת.',
        },
      ],
      reveal: {
        h: 'Das Licht sind die 613 Gebote',
        p: '„Et ha-or“ ergibt 613, wie „ba-Tora“, „in der Tora“, und wie die Zahl der Gebote der Tora (תרי״ג). Die Endbuchstaben von „et ha-or ki tow“ bilden das Wort „Brit“, Bund. Und „wajawdel“, „und Er schied“, ergibt 52: So oft im Jahr machen wir Hawdala am Ausgang des Schabbats.',
      },
      lessons: [
        {
          h: 'Das Licht ist in der Tora',
          b: `<p>Der Baal HaTurim: „<span class="he">את האור</span> — seine Gematria ist <span class="he">בתורה</span>, und es ergibt <span class="he">תרי״ג</span>“, 613.<sup data-src="bht-1-4"></sup> <span class="he">את</span> (401) + <span class="he">האור</span> (212) = 613; <span class="he">בתורה</span> = 2 + 611 = 613. Das Licht des ersten Tages ist das Licht der Tora mit ihren 613 Geboten.</p><p>Beachte: Das Wort „Tora“ (<span class="he">תורה</span>) ergibt 611, „in der Tora“ aber 613. Das Licht ist nicht die Tora „irgendwo“, sondern das, was in ihr ist.</p>`,
        },
        {
          h: 'Der Bund',
          b: `<p>Die Endbuchstaben von <span class="he">את האור כי טוב</span> — <span class="he">ת</span>, <span class="he">ר</span>, <span class="he">י</span>, <span class="he">ב</span> — bilden das Wort <span class="he">ברית</span>, „Bund“. Das Licht, über das der Allmächtige „gut“ sagte, ist Sein Bund mit der Schöpfung.</p>`,
        },
        {
          h: 'Hawdala: zuerst Nutzen vom Licht',
          b: `<p>„Und G-tt sah das Licht, dass es gut war — und schied.“ Zuerst „sah, dass es gut war“, erst dann „schied“. Daraus, sagt der Baal HaTurim, lernen wir, dass man den Segen über die Kerze (bei der Hawdala) erst spricht, wenn man ihr Licht genutzt hat. So sagt die Mischna: „Man segnet nicht über die Kerze, bis man ihr Licht genießt.“<sup data-src="berakhot-51b"></sup></p><p>Und weiter: <span class="he">ויבדל</span> = 6 + 10 + 2 + 4 + 30 = 52 — so oft im Jahr „scheiden“ wir (machen Hawdala) am Ausgang des Schabbats: Ein Jahr hat 52 Wochen.</p>`,
        },
        {
          h: 'Über dem Himmelsgewölbe — ein Geheimnis',
          b: `<p>Am zweiten Tag: „…und schied zwischen den Wassern unter dem Gewölbe und den Wassern <span class="he">מעל לרקיע</span> — über dem Gewölbe“. Laut der Massora kommen diese Worte zweimal vor: hier und in Jecheskels Vision vom Wagen — „und es war eine Stimme über dem Gewölbe“. Der Baal HaTurim lernt daraus: So wie man das <b>Schöpfungswerk</b> nicht vor vielen auslegt, so legt man auch das <b>Werk des Wagens</b> nicht aus.<sup data-src="bht-1-7"></sup> Beides sind Geheimnisse der Tora.</p>`,
        },
        {
          h: 'Ein Stern für jeden Grashalm',
          b: `<p>Am dritten Tag: „Fruchtbaum… <span class="he">מזריע זרע למינהו</span> — der Samen trägt nach seiner Art“. Die Anfangsbuchstaben dieser Wörter sind <span class="he">מזל</span>, „Masal“, ein himmlischer Hüter: Es gibt keinen Grashalm, der oben keinen Masal hätte.<sup data-src="bht-1-12"></sup></p>`,
        },
        {
          h: 'Leuchten ohne Waw',
          b: `<p>Am vierten Tag: „Es seien <span class="he">מארת</span> — Leuchten.“ Das Wort ist „mangelhaft“ geschrieben, ohne den Buchstaben <span class="he">ו</span>. Der Baal HaTurim erklärt: Nur die Sonne wurde erschaffen, um zu leuchten. Der Mond wurde nur erschaffen, damit die Menschen nicht die Sonne anbeten, wie sie es täten, wäre sie allein.<sup data-src="bht-1-14"></sup></p>`,
        },
      ],
      reflection: 'Wo in meinem Leben gibt es ein Licht, das ich schon nutze, für das ich aber noch nicht gedankt habe? Und was in meinem Tag sollte ich „scheiden“ — so wie die Hawdala das Heilige vom Alltäglichen scheidet?',
      takeaways: [
        'את האור = 613 = בתורה = תרי״ג: Das Licht des ersten Tages ist das Licht der Tora und ihrer 613 Gebote.',
        'Die Endbuchstaben von „את האור כי טוב“ bilden ברית, Bund.',
        '„Sah, dass es gut war“ — dann „schied“: Über die Hawdala-Kerze segnet man erst, wenn man ihr Licht genutzt hat.',
        'ויבדל = 52 — so viele Hawdalot im Jahr, eine für jeden Schabbat.',
        'Weitere Andeutungen: „über dem Gewölbe“ ist ein Geheimnis wie der Wagen; jeder Grashalm hat seinen Masal; der Mond wurde erschaffen, damit man die Sonne nicht anbetet.',
      ],
      puzzle: {
        q: 'Ordne die Andeutungen von Vers 1,4 nach der Reihenfolge seiner Wörter.',
        pieces: ['את האור = 613 = בתורה', 'Endbuchstaben von „את האור כי טוב“: ברית', '„Sah, dass es gut war“: zuerst Nutzen vom Licht', 'ויבדל = 52 Hawdalot im Jahr'],
        meaning: 'Das Licht des ersten Tages ist Tora und Bund; der Allmächtige „sah zuerst, dass es gut war“, dann „schied“ Er — so segnen auch wir jede Woche das Licht und scheiden dann den Schabbat vom Alltag.',
      },
    },
    {
      title: 'Der Mensch aus Erde',
      cond: `<p>Wie wurde der Mensch erschaffen? Die Tora sagt:</p><p class="verse" dir="rtl" lang="he">וייצר ה׳ אלקים את האדם עפר מן האדמה ויפח באפיו נשמת חיים ויהי האדם לנפש חיה</p><p>„Da bildete der Ewige G-tt den Menschen aus Staub von der Erde und blies in seine Nase den Hauch des Lebens, und der Mensch wurde zu einem lebendigen Wesen.“<sup data-src="gen-2-7"></sup></p><p>Der Baal HaTurim bemerkt: In den Buchstaben von <em>האדם</em>, „der Mensch“, ist verborgen, woraus der Mensch genommen ist.</p>`,
      steps: [
        {
          q: 'Stelle <b>alle</b> Buchstaben von <span class="he">האדם</span> („der Mensch“) so um, dass das Wort „Erde“ entsteht.',
          hint: 'Erde heißt auf Hebräisch „adama“: אדמה.',
        },
        {
          q: 'Bilde ein Wort aus den <b>letzten</b> Buchstaben von <span class="he">ויפח באפיו נשמת חיים</span> („und blies in seine Nase den Hauch des Lebens“). Die Buchstaben dürfen umgestellt werden.',
          hint: 'Die letzten Buchstaben sind markiert. Es ergibt ein Wort, das „Siegel“ bedeutet.',
        },
        {
          q: 'Und jetzt aus den <b>ersten</b> Buchstaben von <span class="he">האדם לנפש חיה</span> („der Mensch — zu einem lebendigen Wesen“). Sie müssen umgestellt werden.',
          hint: 'Die ersten Buchstaben sind markiert. Es ergibt den Namen des Teigstücks, das abgetrennt und dem Kohen gegeben wird.',
        },
        {
          q: 'Der Allmächtige „brachte“ Chawa „zum Menschen“. Voll geschrieben heißt das Wort <span class="he">ויביאה</span>, in der Tora aber <span class="he">ויבאה</span>, „mangelhaft“. Tippe den Buchstaben an, der in der Tora fehlt.',
          hint: 'Vergleiche Buchstabe für Buchstabe: ו־י־ב־?־א־ה.',
        },
        {
          q: 'Was ergibt das Wort <span class="he">ויבאה</span> („und Er brachte sie“) so, wie es in der Tora geschrieben ist?',
          hint: '6 + 10 + 2 + 1 + 5.',
        },
      ],
      reveal: {
        h: 'Erde, Siegel und Challa',
        p: '„Ha-adam“ und „adama“ ergeben 50: Der Mensch ist aus der Erde genommen. Die Endbuchstaben von „und blies in seine Nase den Hauch des Lebens“ ergeben „Chotam“, Siegel, und die Anfangsbuchstaben von „der Mensch — zu einem lebendigen Wesen“ ergeben „Challa“: Adam war die „Challa der Welt“. Das ohne Jud geschriebene „und Er brachte sie“ ergibt 24: Der Allmächtige schmückte Chawa mit vierundzwanzig Schmuckstücken und brachte sie zu Adam.',
      },
      lessons: [
        {
          h: 'Staub, Blut und Galle',
          b: `<p>Zum Vers „Und G-tt erschuf den Menschen in Seinem Bild“<sup data-src="gen-1-27"></sup> schreibt der Baal HaTurim: <span class="he">האדם</span> hat die Buchstaben von <span class="he">אדמה</span>, weil der Mensch aus der Erde erschaffen wurde. Und das Wort <span class="he">אדם</span> ist ein Notarikon: <span class="he">אפר</span>, <span class="he">דם</span>, <span class="he">מרה</span> — „Staub, Blut, Galle“.<sup data-src="bht-1-27"></sup></p><p>Darum ist auch ihre Gematria gleich: <span class="he">האדם</span> = <span class="he">אדמה</span> = 50.</p>`,
        },
        {
          h: 'Zwei Triebe',
          b: `<p>Das Wort „und Er bildete“ kommt in der Schöpfungsgeschichte zweimal vor, unterschiedlich geschrieben. Beim Menschen — <b>voll</b>, mit zwei Jud: <span class="he">וייצר</span>. Bei den Tieren — „und der Ewige G-tt bildete aus der Erde alle Tiere des Feldes“ — <b>mangelhaft</b>, mit einem Jud: <span class="he">ויצר</span>. Der Baal HaTurim: Der Mensch hat zwei „Jezer“, zwei Triebe — den guten und den bösen; die Tiere nur einen.<sup data-src="bht-2-7"></sup></p>`,
        },
        {
          h: 'Siegel und Seele',
          b: `<p>Die Endbuchstaben von <span class="he">ויפח באפיו נשמת חיים</span> — <span class="he">ח</span>, <span class="he">ו</span>, <span class="he">ת</span>, <span class="he">ם</span> — bilden <span class="he">חותם</span>, „Siegel“: Die Seele, die der Allmächtige dem Menschen einhauchte, ist Sein Siegel.</p><p>Das Wort <span class="he">נשמת</span> („Hauch“, „Seele“) kommt laut der Massora viermal vor: „und blies in seine Nase den <i>Hauch</i> des Lebens“; „alles, was den <i>Hauch</i> des Lebensgeistes hatte“ (bei der Sintflut); „eine Leuchte des Ewigen ist die <i>Seele</i> des Menschen“<sup data-src="prov-20-27"></sup>; „der <i>Hauch</i> des Ewigen wie ein Schwefelstrom“. Der Baal HaTurim verbindet sie: Die Seele des Menschen ist eine Leuchte des Ewigen, „und wenn nicht“ — wird der Hauch des Ewigen zu einem Schwefelstrom.</p>`,
        },
        {
          h: 'Die Challa der Welt',
          b: `<p>Die Anfangsbuchstaben von <span class="he">האדם לנפש חיה</span> — <span class="he">ה</span>, <span class="he">ל</span>, <span class="he">ח</span> — sind <span class="he">חלה</span>, Challa: Adam war die „Challa der Welt“. Wie die Challa der erste Teil des Teiges ist, der für den Allmächtigen abgesondert wird, so ist der Mensch der erlesenste, heilige Teil der ganzen Schöpfung.</p>`,
        },
        {
          h: 'Vierundzwanzig Schmuckstücke',
          b: `<p>„Und der Ewige G-tt baute die Rippe… zu einer Frau und brachte sie zum Menschen.“<sup data-src="gen-2-21"></sup> Das Wort <span class="he">ויבאה</span> ist mangelhaft geschrieben und ergibt 24: Der Allmächtige schmückte Chawa mit vierundzwanzig Schmuckstücken und brachte sie zu Adam.</p><p>In voller Schreibung — <span class="he">ויביאה</span> — kommt das Wort laut der Massora viermal vor: „und brachte sie zum Menschen“; „und Jizchak führte sie ins Zelt“; „und brachte sie in die Stadt Davids“ — die Tochter des Pharao, die Schlomo nahm; „und der Ewige wachte über das Unheil und brachte es“. Der Baal HaTurim erklärt: Bevor Schlomo die Tochter des Pharao heiratete, herrschte er über die oberen Welten — so wie Adam, der wegen Chawa aus den oberen Welten vertrieben wurde. Bei Jizchak war es umgekehrt: Riwka trat an Saras Stelle, so steht es im Midrasch.<sup data-src="bht-2-22"></sup></p>`,
        },
        {
          h: 'Nach der Sünde: der Verleumder und die Undankbarkeit',
          b: `<p>„Hast du von dem Baum gegessen, von dem Ich dir geboten habe, nicht zu essen?“<sup data-src="gen-3-11"></sup> Die Endbuchstaben von <span class="he">אשר צויתיך לבלתי אכל</span> — <span class="he">ר</span>, <span class="he">ך</span>, <span class="he">י</span>, <span class="he">ל</span> — bilden <span class="he">רכיל</span>, „Verleumder“: Du bist dem Rat eines Verleumders gefolgt — der Schlange.</p><p>Das Wort <span class="he">המן</span> („von…?“) kommt laut der Massora dreimal vor: „von dem Baum?“; „aus diesem Felsen?“ — Mosches Worte bei Mej Meriwa; „von der Tenne oder von der Kelter?“. Nach der Meinung, dass der Baum, von dem Adam aß, Weizen war — daher „die Tenne“. Und wie über Adam für „von dem Baum“ der Tod verhängt wurde, so wurde dort für „aus diesem Felsen“ der Tod verhängt.<sup data-src="bht-3-11"></sup></p><p>„Und der Mensch sprach: Die Frau, die Du mir beigegeben hast, sie gab mir von dem Baum, und ich aß.“ Darüber heißt es: „Wer Gutes mit Bösem vergilt, von dessen Haus weicht das Böse nicht.“<sup data-src="prov-17-13"></sup> Die Endbuchstaben von <span class="he">רעה לא תמוש רעה</span> — <span class="he">ה</span>, <span class="he">א</span>, <span class="he">ש</span>, <span class="he">ה</span> — sind <span class="he">האשה</span>, „die Frau“: Adam war undankbar für die Frau, die der Allmächtige ihm als Hilfe gab. Und „sie gab mir von dem Baum“ heißt nach dem einfachen Sinn: „Sie schlug mich mit einem Stock, bis ich auf sie hörte.“<sup data-src="bht-3-12"></sup></p>`,
        },
        {
          h: 'Priesterkleider, die Wache und zwei Verlangen',
          b: `<p>„Und der Ewige G-tt machte Adam und seiner Frau Kleider aus Fell <span class="he">וילבשם</span> — und bekleidete sie.“<sup data-src="gen-3-21"></sup> Laut der Massora kommt dieses Wort zweimal vor: hier und bei Aharon und seinen Söhnen — „und bekleidete sie mit Röcken“. Das lehrt, dass der Allmächtige dem ersten Menschen Priesterkleider machte; in Bereschit Rabba heißt es, dass die Erstgeborenen in ihnen dienten. Und dieser Vers hat acht Wörter — wie die acht Gewänder des Hohepriesters.<sup data-src="bht-3-21"></sup></p><p>„…<span class="he">לשמר</span> — um den Weg zum Baum des Lebens zu bewachen.“ Das Notarikon von <span class="he">לשמר</span>: <span class="he">לילין שדין מזיקין רוחין</span> — Nachtgeister, Dämonen, Schädiger und Geister.<sup data-src="bht-3-24"></sup></p><p>Der Allmächtige sagt zu Kajin über die Sünde: „nach dir ist <span class="he">תשוקתו</span> — ihr Verlangen“. Laut der Massora zweimal: hier und „Ich bin meines Geliebten, und nach mir ist sein Verlangen“ (Hoheslied). Die Weisen sagten: Es gibt zwei Verlangen — das Verlangen der Frevler nach der Sünde und das Verlangen des Heiligen, gelobt sei Er, nach Israel.<sup data-src="bht-4-7"></sup></p>`,
        },
      ],
      reflection: 'Ich bin aus „Staub, Blut und Galle“ gemacht — und trage das Siegel des Allmächtigen. Wofür kann ich heute danken, statt wie Adam einen Schuldigen zu suchen?',
      takeaways: [
        'האדם = אדמה = 50: der Mensch aus Erde; אדם — „Staub, Blut, Galle“.',
        'וייצר mit zwei Jud: Der Mensch hat zwei Triebe, die Tiere einen.',
        'Die Endbuchstaben von „ויפח באפיו נשמת חיים“ bilden חותם, Siegel; die Anfangsbuchstaben von „האדם לנפש חיה“ bilden חלה — Adam ist die Challa der Welt.',
        'ויבאה = 24: Chawa wurde mit vierundzwanzig Schmuckstücken geschmückt.',
        'Nach der Sünde: אשר צויתיך לבלתי אכל → רכיל (Rat eines Verleumders); „Böses für Gutes“ → האשה (Undankbarkeit).',
      ],
      puzzle: {
        q: 'Ordne den Weg des Menschen nach der Reihenfolge der Verse: von der Schöpfung bis zur Sünde.',
        pieces: ['האדם = אדמה = 50', 'Endbuchstaben: חותם, Siegel', 'Anfangsbuchstaben: חלה, Challa der Welt', 'ויבאה = 24 Schmuckstücke', 'Endbuchstaben: רכיל, Verleumder'],
        meaning: 'Der Mensch ist aus Erde genommen und mit dem Siegel des Allmächtigen versiegelt; er ist die Challa der Welt; ihm wird eine geschmückte Frau gegeben — und doch folgt er dem Rat eines Verleumders.',
      },
    },
    {
      title: 'Der Siebte',
      cond: `<p>Die sechs Schöpfungstage enden mit den Worten <em>יום הששי. ויכלו השמים</em> — „der sechste Tag. Und vollendet waren die Himmel“. Die Anfangsbuchstaben dieser Wörter, schreibt der Baal HaTurim, bilden den vierbuchstabigen Namen des Allmächtigen: Mit ihm versiegelte Er die Schöpfung.<sup data-src="bht-1-31"></sup> Dann folgt der siebte Tag:</p><p class="verse" dir="rtl" lang="he">ויכל אלקים ביום השביעי מלאכתו אשר עשה וישבת ביום השביעי מכל מלאכתו אשר עשה. ויברך אלקים את יום השביעי ויקדש אתו כי בו שבת מכל מלאכתו אשר ברא אלקים לעשות</p><p>„Und G-tt vollendete am siebten Tag Sein Werk, das Er gemacht hatte, und ruhte am siebten Tag von all Seinem Werk, das Er gemacht hatte. Und G-tt segnete den siebten Tag und heiligte ihn, denn an ihm ruhte Er von all Seinem Werk, das G-tt schaffend gemacht hatte.“<sup data-src="gen-2-1"></sup></p><p>Und am Ende dieser Kapitel bringt der Baal HaTurim die Worte Ijobs: <em>גם עתה הנה בשמים עדי</em> — „auch jetzt, siehe, ist im Himmel mein Zeuge“.<sup data-src="job-16-19"></sup></p>`,
      steps: [
        { q: 'Wie oft steht in diesen zwei Versen das Wort <span class="he">מלאכתו</span>, „Sein Werk“?', hint: 'Geh die Verse durch und markiere jedes מלאכתו.' },
        { q: 'Was ergibt das Wort <span class="he">עדי</span>, „mein Zeuge“?', hint: '70 + 4 + 10.' },
        { q: 'Wessen Name ergibt diese Zahl?', opts: ['Chanoch (Henoch)', 'Noach', 'Jered', 'Enosch'] },
        {
          q: 'Chanoch „wandelte mit G-tt, und er war nicht mehr, denn G-tt hatte ihn genommen“. Die wievielte Generation nach Adam war er? (Adam ist die erste.)',
          hint: 'אדם · שת · אנוש · קינן · מהללאל · ירד · חנוך',
        },
      ],
      reveal: {
        h: 'Der Allmächtige liebt die Siebten',
        p: 'Das Wort „Sein Werk“ steht dreimal — für die drei Schöpfungen, von denen Er „ruhte“: Himmel, Erde und Meer. „Mein Zeuge“ im Himmel ergibt 84, wie Chanoch: Der Allmächtige nahm ihn als Zeugen in den Himmel. Chanoch war die siebte Generation nach Adam, und der Allmächtige liebt die Siebten: Auch von Mosche, dem Siebten nach Awraham, heißt es „und Mosche stieg hinauf zu G-tt“.',
      },
      lessons: [
        {
          h: 'Die Schöpfung unter dem Siegel des Namens',
          b: `<p>Die Anfangsbuchstaben von „<b>J</b>om <b>ha</b>-schischi. <b>Wa</b>-jechulu <b>ha</b>-schamajim“ bilden den vierbuchstabigen Namen des Allmächtigen (Hawaja): Mit ihm wurde das Schöpfungswerk versiegelt.<sup data-src="bht-1-31"></sup> Ebenso im Psalm: „<b>J</b>ismechu <b>ha</b>-schamajim <b>we</b>-tagel <b>ha</b>-arez“ — „Es freue sich der Himmel, und es jauchze die Erde“<sup data-src="ps-96-11"></sup>: Die Anfangsbuchstaben sind derselbe Name, mit dem die Welt versiegelt wurde.</p><p>Den Namen selbst schreiben und sprechen wir nicht aus — darum steht er nicht im Rätsel.</p>`,
        },
        {
          h: 'Der begehrteste der Tage',
          b: `<p>„Und G-tt vollendete“ (<span class="he">ויכל</span>) übersetzt der Targum Jeruschalmi mit „und Er begehrte“. Das sagen wir im Schabbatgebet: „den begehrtesten der Tage hast Du ihn genannt“.</p><p>Im Abschnitt „Wajechulu“ steht dreimal „Sein Werk“ — für die drei Werke, von denen Er ruhte: Himmel, Erde und Meer. Und beim siebten Tag steht nicht „und es war Abend, und es war Morgen“ — denn man fügt vom Alltäglichen zum Heiligen hinzu: Der Schabbat wird früher empfangen und später verabschiedet.<sup data-src="bht-2-2"></sup></p>`,
        },
        {
          h: 'Das Man ruht',
          b: `<p>Das Wort <span class="he">וישבות</span> („und Er ruhte“) kommt laut der Massora zweimal vor: hier und „und das Man hörte auf“ (Buch Jehoschua). Das erklärt Mosches Worte in der Geschichte vom Man: „Das ist es, was der Ewige gesagt hat: ein Ruhetag, ein heiliger Schabbat.“ Wir finden nicht, dass Mosche es ihnen vorher gesagt hätte — doch es war in den sechs Schöpfungstagen verborgen: „und Er ruhte am siebten Tag“ — „und das Man hörte auf“.</p><p>Eine andere Erklärung: Es lehrt, dass das Man am Schabbat nicht fiel, wie im Traktat Kidduschin bewiesen wird. Und noch eine: Es deutet an, was die Weisen auslegten — „Er segnete ihn mit dem Man und heiligte ihn mit dem Man“.<sup data-src="bht-2-2"></sup></p>`,
        },
        {
          h: 'Drei Segen',
          b: `<p>Die Worte „und G-tt segnete“ stehen dreimal unmittelbar vor ihrem Objekt: hier (den Schabbat), „und G-tt segnete Noach“ und „und G-tt segnete Jizchak“. Als der Allmächtige die Welt erschuf, segnete Er den Schabbat und die Welt. In den Tagen Noachs, als alle Früheren umkamen und die Welt erneuert wurde, musste sie ein zweites Mal gesegnet werden. Und dann segnete Er Jizchak — wie es im Midrasch heißt: „Bis jetzt musste Ich Meine Geschöpfe segnen; von nun an sind die Segnungen in deine Hände gegeben“ (an Awraham).<sup data-src="bht-2-3"></sup></p>`,
        },
        {
          h: 'Ein Zeuge im Himmel',
          b: `<p>Ijob sagt: „Auch jetzt, siehe, ist im Himmel mein Zeuge (<span class="he">עדי</span>), und der mich kennt, in den Höhen.“<sup data-src="job-16-19"></sup> Der Baal HaTurim: <span class="he">עדי</span> ergibt in Gematria <span class="he">חנוך</span>, Chanoch (84). Der Allmächtige nahm einen, der vor der Sintflut lebte, und einen nach der Sintflut — Chanoch und Pinchas — und hob sie in den Himmel, damit sie von Ihm zeugen.<sup data-src="bht-4-18"></sup> Dort schreibt der Baal HaTurim auch, dass das Wort <span class="he">ושהדי</span> („und der mich kennt“) dem Namen des Engels Metatron entspricht; doch in unserer Rechnung stimmen die Zahlen nicht überein (325 und 314), darum steht das nicht im Rätsel.</p><p>Von Chanoch sagt die Tora: „Und Chanoch wandelte mit G-tt, und er war nicht mehr, denn G-tt hatte ihn genommen.“<sup data-src="gen-5-21"></sup></p>`,
        },
        {
          h: 'Alle Siebten sind geliebt',
          b: `<p>Warum wählte der Allmächtige Chanoch? Weil er die <b>siebte Generation</b> war: Adam, Schet, Enosch, Kenan, Mahalalel, Jered, Chanoch. Und der Heilige, gelobt sei Er, liebt die Siebten.</p><p>So war auch Mosche der Siebte von den Vätern an: Awraham, Jizchak, Jaakow, Levi, Kehat, Amram, Mosche. Und von ihm steht geschrieben: „Und Mosche stieg hinauf zu G-tt.“<sup data-src="ex-19-3"></sup> Der siebte Tag ist der Schabbat, die siebte Generation ist Chanoch, der Siebte nach Awraham ist Mosche: Die Siebten steigen zum Allmächtigen hinauf.</p>`,
        },
      ],
      reflection: 'Was in meiner Woche ist das „Siebte“, das der Allmächtige liebt? Wie kann ich ihm ein wenig „vom Alltäglichen“ hinzufügen — es früher empfangen und später verabschieden?',
      takeaways: [
        'Die Anfangsbuchstaben von „יום הששי ויכלו השמים“ bilden den vierbuchstabigen Namen: Mit ihm ist die Schöpfung versiegelt.',
        'Dreimal „מלאכתו“ — Himmel, Erde, Meer. Kein „Abend und Morgen“ am siebten Tag: Man fügt vom Alltäglichen zum Heiligen hinzu.',
        'וישבות — über den Schabbat und über das Man: Das Man „ruhte“ am Schabbat.',
        'עדי = 84 = חנוך: ein Zeuge im Himmel.',
        'Chanoch ist der Siebte nach Adam, Mosche der Siebte nach Awraham: Der Allmächtige liebt die Siebten.',
      ],
      puzzle: {
        q: 'Ordne die Lektion über die Siebten: vom Ende der Schöpfung bis zu den siebten Generationen.',
        pieces: ['Der Name versiegelt die sechs Tage', 'Der siebte Tag — „der begehrteste“', 'עדי = 84 = חנוך', 'Chanoch — der Siebte nach Adam', 'Mosche — der Siebte nach Awraham'],
        meaning: 'Die Schöpfung ist mit dem Namen versiegelt, der siebte Tag ist der begehrteste; der Zeuge im Himmel ist Chanoch, die siebte Generation, so wie Mosche der Siebte nach Awraham ist: Der Allmächtige liebt die Siebten.',
      },
    },
  ],
  final: {
    title: 'Der Anfang ist offenbart',
    allSolved:
      'Alle vier Rätsel gelöst. Die Welt wurde an Rosch Haschana erschaffen und mit Wahrheit versiegelt, das Licht des ersten Tages ist die Tora, der Mensch trägt das Siegel des Allmächtigen, und die Siebten steigen zu Ihm hinauf.',
  },
  puzzle: {
    q: 'Ordne den Weg der ganzen Lektion nach der Reihenfolge der Kapitel von Bereschit.',
    pieces: ['Anfang: בראשית ברא = 1116', 'Licht: את האור = 613', 'Mensch: האדם = אדמה', 'Der Siebte: עדי = חנוך'],
    meaning: 'Vom ersten Wort bis zur siebten Generation: Die Welt ist mit Wahrheit erschaffen, sie leuchtet mit der Tora, der Mensch aus Erde trägt das g-ttliche Siegel, und die Siebten sind vom Allmächtigen geliebt.',
  },
  audience: 'Addition und Buchstabenspiele zu vertrauten Themen — Schöpfung, Adam und Chawa. Jüngere Kinder — gemeinsam mit einem Erwachsenen.',
  practice:
    'Schau bei der nächsten Hawdala zuerst auf das Licht der Kerze — zum Beispiel auf die Fingernägel in ihrem Schein — und sprich erst dann den Segen: wie die Tora, zuerst „sah das Licht, dass es gut war“, dann „schied“. Und empfange den nächsten Schabbat ein paar Minuten früher — füge vom Alltäglichen zum Heiligen hinzu.',
  highlight: 'Die ersten Worte der Tora sagen, wann die Welt erschaffen wurde: an Rosch Haschana.',
  share: ({ score, max, time, grid, allSolved, site }) => `📜 Wann wurde die Welt erschaffen? Die Antwort steckt in den ersten zwei Wörtern der Tora.

Ich suche sie in einem Gematria-Spiel nach dem Kommentar des Baal HaTurim. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bisher:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: über „Bereschit bara“ und die Wahrheit, über das Licht, das der Tora gleicht, über den Menschen aus Erde und über den siebten Tag und die siebte Generation. Schaffst du es besser?
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Nach dem Kommentar des Baal HaTurim (Rabbi Jaakow ben Ascher, 14. Jh.) zu den Kapiteln 1–4 von Bereschit, Kurzfassung („Kizur Baal HaTurim“). Hebräischer Text — Sefaria.',
};

export default de;
