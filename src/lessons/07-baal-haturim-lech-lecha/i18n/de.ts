import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Baal HaTurim: Lech Lecha',
  hero: {
    heading: 'Baal HaTurim: <i>fünf Rätsel über Awrahams Weg</i>',
    author: 'nach dem Kommentar des Baal HaTurim, Rabbi Jaakow ben Ascher',
    intro:
      'Der Baal HaTurim fand im Wochenabschnitt Lech Lecha Zahlen und versteckte Wörter. Rechne selbst: Wie viele Jahre wartete Awraham auf Jizchak? Was zeigte ihm den Weg? Warum trennten sich Awram und Lot? Wer war Malki-Zedek? Und was steckt in den Sternen, im Atbasch und in Awrahams neuem Namen?',
  },
  summary:
    'Lech Lecha mit den Augen des Baal HaTurim: „Lech lecha“ sind hundert Jahre bis zu Jizchaks Geburt, „Ich werde dir zeigen“ = „in den Wolken“, im Abschied von Lot steckt „Schalom“, Malki-Zedek ist Schem, „ba-ma“ im Atbasch sind 400 Jahre, und zweimal „Vater einer Menge“ ist Jizchak.',
  glossary: {
    'לך': '„geh“; in „lech lecha“ — „geh für dich“',
    'לך לך': '„geh für dich“ — die ersten Worte G-ttes an Awram',
    'אראך': '„Ich werde dir zeigen“',
    'בעננים': '„in den Wolken“',
    'בשמים': '„im Himmel“',
    'במים': '„im Wasser“',
    'ברוח': '„durch den Wind“',
    'ך': 'Schluss-Kaf (20)',
    'ס׳ אותיות שבברכת כהנים': '„die sechzig Buchstaben des Priestersegens“',
    'אברהם': 'Awraham',
    'אברם': 'Awram — Awrahams erster Name',
    'איש מעל אחיו אברם': '„voneinander. Awram…“ (Ende von Vers 13,11 und Anfang von 13,12)',
    'שלום': 'Frieden',
    'אל תצר את מואב': '„bedränge Moaw nicht“',
    'מואב': 'Moaw — ein Volk, Nachkommen von Lot',
    'מצרים': 'Ägypten',
    'עמלק': 'Amalek',
    'אדום': 'Edom',
    'מלך שלם': '„König von Schalem“ (Schalem — Jeruschalajim)',
    'מלכי צדק': 'Malki-Zedek, König von Schalem',
    'שם': 'Schem, der Sohn von Noach',
    'שם בן נח': '„Schem, der Sohn von Noach“',
    'נח': 'Noach',
    'עבר': 'Ewer, Schems Urenkel',
    'תרח': 'Terach, Awrams Vater',
    'לוט': 'Lot, Awrams Neffe',
    'ויוצא אתו החוצה': '„und Er führte ihn hinaus“',
    'כה': '„ko“ — „so“',
    'יהיה': '„wird sein“',
    'ל׳ צדיקים בכל דור': '„dreißig Gerechte in jeder Generation“',
    'צדיקים': 'Gerechte (Zaddikim)',
    'מלכים': 'Könige',
    'נביאים': 'Propheten',
    'כוכבים': 'Sterne',
    'במה': '„ba-ma“ — „wie?“, „woran?“',
    'שיץ': '„schiz“ — das Wort במה im Atbasch',
    'במה אדע': '„woran werde ich erkennen?“',
    'כי': '„dass“',
    'גר': '„Fremder“',
    'כי גר': '„dass Fremde“',
    'ועלטה היה והנה תנור': '„und es war Finsternis, und siehe — ein Ofen“',
    'תוהו': 'Tohu — Chaos, Leere',
    'אב': 'Vater',
    'המון': 'Menge',
    'אב המון': '„Vater einer Menge“',
    'ארבה': '„Ich werde vermehren“',
    'יצחק': 'Jizchak',
    'ישמעאל': 'Jischmael',
    'יעקב': 'Jaakow',
    'אקים': '„Ich werde aufrichten“',
    'אשר קידש ידיד מבטן': '„Der den Geliebten vom Mutterleib an geheiligt hat“',
    'אב המון גוים': '„Vater einer Menge von Völkern“',
    'וקראת את שמו יצחק': '„und du sollst ihn Jizchak nennen“',
    'לברית עולם לזרעו': '„als ewigen Bund für seine Nachkommen“',
  },
  translit: {
    'לך': 'lech',
    'אראך': 'arecha',
    'כה': 'ko',
    'יהיה': 'jihje',
    'במה': 'ba-ma',
    'כי': 'ki',
    'גר': 'ger',
    'אב': 'aw',
    'המון': 'hamon',
  },
  riddles: [
    {
      title: 'Geh für dich',
      cond: `<p>Der Baal HaTurim ist Rabbi Jaakow ben Ascher (um 1269–1343). Er schrieb das Gesetzbuch <i>Arba’a Turim</i>. Zu jedem Vers der Tora schrieb er kurze Hinweise: Gematria, die ersten und letzten Buchstaben von Wörtern und Wörter, die im Tanach genau zwei- oder dreimal vorkommen. Der Wochenabschnitt Lech Lecha beginnt so:</p><p class="verse" dir="rtl" lang="he">ויאמר ה׳ אל אברם לך לך מארצך וממולדתך ומבית אביך אל הארץ אשר אראך</p><p>„Der Ewige sprach zu Awram: Geh für dich aus deinem Land, von deiner Verwandtschaft und aus dem Haus deines Vaters in das Land, das Ich dir zeigen werde.“ Dann kommen die Segen: „Ich werde dich zu einem großen Volk machen, dich segnen und deinen Namen groß machen…“<sup data-src="gen-12-1"></sup></p><p>Awram war damals fünfundsiebzig Jahre alt.<sup data-src="gen-12-4"></sup></p>`,
      steps: [
        {
          q: 'Der Baal HaTurim: Die ersten Worte, <span class="he">לך לך</span> — „geh für dich“ —, zeigen, <b>wie alt</b> Awram sein wird, wenn Jizchak geboren wird. Wie viel ergeben die Worte <span class="he">לך לך</span>?',
          hint: 'לך = 30 + 20 — und das zweimal.',
        },
        {
          q: 'Noch ein Hinweis: Awram ging mit 75 Jahren los. Danach lebte er noch so viele Jahre, wie die Worte <span class="he">לך לך</span> ergeben. Wie viele Jahre lebte er insgesamt?',
          hint: '75 + die Zahl aus dem letzten Schritt.',
        },
        {
          q: '„In das Land, das Ich dir <span class="he">אראך</span> — zeigen werde.“ Wie viel ist das Wort <span class="he">אראך</span> wert?',
          hint: '1 + 200 + 1 + 20.',
        },
        {
          q: 'Welches Wort hat dieselbe Gematria? Es sagt, <b>wie</b> G-tt Awram den Weg zeigte.',
          opts: ['„in den Wolken“', '„im Himmel“', '„im Wasser“', '„durch den Wind“'],
        },
        {
          q: 'Der Baal HaTurim: Der Schlussbuchstabe <span class="he">ך</span> im Wort „die dich segnen“ hat drei Krönchen, <i>Tagin</i> (Verzierungen auf Buchstaben in der Torarolle). Dreimal <span class="he">ך</span> — wie viel ist das?',
          hint: 'ך = 20; 3 × 20.',
        },
      ],
      reveal: {
        h: 'Hundert Jahre und die Wolken',
        p: '„Lech lecha“ ist 100: Mit hundert Jahren bekam Awraham Jizchak. Und nachdem er losgegangen war, lebte er noch hundert Jahre — insgesamt 175. „Arecha“ — „Ich werde dir zeigen“ — ist 222, wie „ba-ananim“, „in den Wolken“: Wolken gingen vor Awraham her und zeigten ihm den Weg. Und drei Krönchen auf ך sind 3 × 20 = 60: So viele Buchstaben hat der Priestersegen.',
      },
      lessons: [
        {
          h: 'Der Anfang — ein Spruch',
          b: `<p>In der Geschichte der Schöpfung steht zehnmal „und Er sprach“ — <i>wa-jomer</i>. Mit demselben Wort beginnt auch das Kapitel über Awraham: <span class="he">ויאמר ה׳ אל אברם</span>.<sup data-src="bht-12-1"></sup></p>`,
        },
        {
          h: 'Hundert Jahre',
          b: `<p><span class="he">לך לך</span> = 30 + 20 + 30 + 20 = 100.<sup data-src="bht-12-1"></sup> Die Tora sagt: „Awraham war hundert Jahre alt, als ihm sein Sohn Jizchak geboren wurde“,<sup data-src="gen-21-5"></sup> und sein ganzes Leben dauerte hundertfünfundsiebzig Jahre:<sup data-src="gen-25-7"></sup> 75 + 100 = 175.</p><p>Das Wort <span class="he">לך</span> allein = 30 + 20 = 50 — die Zahl der Generationen in der letzten Erklärung.</p><p class="expl"><b>Erklärung.</b> Schon in den ersten Worten, die Awraham hörte, steckte ein Versprechen: Er wird einen Sohn bekommen und alt werden.</p>`,
        },
        {
          h: 'Sieben Segen',
          b: `<p>Hier sind diese Segen in den Versen 12,2–3, der Reihe nach: „Ich mache dich zu einem großen Volk“, „Ich segne dich“, „Ich mache deinen Namen groß“, „du wirst ein Segen sein“, „Ich segne, die dich segnen“, „wer dich verflucht, den verfluche Ich“, „durch dich werden alle Familien der Erde gesegnet“.<sup data-src="gen-12-1"></sup> Die Worte „Awram war sehr reich“ stehen im nächsten Kapitel (13,2).<sup data-src="bht-12-2-1"></sup></p>`,
        },
        {
          h: 'Wolken und der Priestersegen',
          b: `<p><span class="he">אראך</span> = 1 + 200 + 1 + 20 = 222; <span class="he">בעננים</span> = 2 + 70 + 50 + 50 + 10 + 40 = 222.<sup data-src="bht-12-2-3"></sup></p><p>Der Priestersegen besteht aus drei Versen im Buch Bamidbar.<sup data-src="num-6-24"></sup> Zähl ihre Buchstaben (der Name G-ttes hat vier Buchstaben): Der erste Vers hat 15, der zweite 20, der dritte 25; zusammen 60 = 3 × 20.</p>`,
        },
      ],
      reflection: 'Awraham ging los, ohne zu wissen wohin — und Wolken zeigten ihm den Weg. Welchen ersten Schritt zu etwas Gutem kann ich heute machen, auch wenn ich den ganzen Weg noch nicht sehe?',
      takeaways: [
        'Das Kapitel über Awraham beginnt mit „und Er sprach“ — wie die Schöpfung der Welt.',
        'לך לך = 100: Mit hundert bekam Awraham Jizchak; 75 + 100 = 175 — sein ganzes Leben.',
        'In den Versen 12,2–3 stehen sieben Segen für Awraham.',
        'אראך = 222 = בעננים: Wolken zeigten Awraham den Weg.',
        'Drei Krönchen auf ך: 3 × 20 = 60 — die sechzig Buchstaben des Priestersegens.',
      ],
    },
    {
      title: 'Frieden und Schem',
      cond: `<p>Die Hirten von Awram und Lot stritten sich. Awram sagte zu Lot: „Es soll kein Streit zwischen mir und dir sein… Gehst du nach links, gehe ich nach rechts.“ Lot wählte die Ebene am Jarden bei Sedom:</p><p class="verse" dir="rtl" lang="he">ויפרדו איש מעל אחיו. אברם ישב בארץ כנען</p><p>„…und sie trennten sich voneinander. Awram wohnte im Land Kenaan.“<sup data-src="gen-13-11"></sup></p><p>Später nahmen vier Könige Lot gefangen, und Awram befreite ihn. Da kam Awram <em>מלכי צדק מלך שלם</em> entgegen — Malki-Zedek, König von Schalem und Priester des Allmächtigen. Er brachte Brot und Wein und segnete Awram.<sup data-src="gen-14-18"></sup></p>`,
      steps: [
        {
          q: 'Bilde ein Wort aus den <b>letzten</b> Buchstaben der Wörter <span class="he">איש מעל אחיו אברם</span> („voneinander. Awram“). Du darfst die Buchstaben umstellen.',
          hint: 'Die letzten Buchstaben leuchten. Es ergibt ein Wort, das „Frieden“ bedeutet.',
        },
        {
          q: 'Der Baal HaTurim: Dieser Frieden gilt auch für Lots Nachkommen — Israel darf keinen Krieg gegen sie führen. Welches Volk stammt von Lot ab?',
          opts: ['Moaw', 'Ägypten', 'Amalek', 'Edom'],
        },
        {
          q: 'Bilde ein Wort aus den <b>ersten</b> Buchstaben der Wörter <span class="he">מלך שלם</span> („König von Schalem“). Du darfst die Buchstaben umstellen.',
          hint: 'Die ersten Buchstaben leuchten. Es ergibt einen Namen aus zwei Buchstaben — das Wort selbst bedeutet „Name“.',
        },
        {
          q: 'Der Baal HaTurim: Malki-Zedek ist Schem. Wessen Sohn ist er?',
          opts: ['von Noach', 'von Ewer', 'von Terach', 'von Lot'],
        },
      ],
      reveal: {
        h: 'Frieden und Schem',
        p: 'Die letzten Buchstaben von „voneinander. Awram“ ergeben „Schalom“ — Frieden: Awram und Lot trennten sich, um den Frieden zu bewahren. Und der Frieden gilt auch für ihre Nachkommen: „Bedränge Moaw nicht.“ Die ersten Buchstaben von „melech Schalem“, „König von Schalem“, ergeben „Schem“: Malki-Zedek ist Schem, der Sohn von Noach.',
      },
      lessons: [
        {
          h: 'Getrennt für den Frieden',
          b: `<p>Die letzten Buchstaben von <span class="he">איש מעל אחיו אברם</span> — <span class="he">ש</span>, <span class="he">ל</span>, <span class="he">ו</span>, <span class="he">ם</span> — bilden <span class="he">שלום</span>.<sup data-src="bht-13-11"></sup> Das letzte Wort, <span class="he">אברם</span>, gehört schon zum nächsten Vers.</p><p>„Bedränge Moaw nicht“ sagte G-tt zu Mosche, als Israel am Land Moaw vorbeizog: „denn den Söhnen Lots habe Ich Ar zum Erbe gegeben.“<sup data-src="deut-2-9"></sup></p><p class="expl"><b>Erklärung.</b> Manchmal ist es besser, sich ruhig zu trennen, als weiter zu streiten — so bleibt der Frieden.</p>`,
        },
        {
          h: 'Malki-Zedek ist Schem',
          b: `<p>Die ersten Buchstaben von <span class="he">מלך שלם</span> — <span class="he">מ</span> und <span class="he">ש</span> — bilden <span class="he">שם</span>.<sup data-src="bht-14-18"></sup> So erklärt es auch Raschi, nach dem Midrasch.<sup data-src="rashi-14-18"></sup></p><p class="expl"><b>Erklärung.</b> Schem, der Sohn von Noach, überlebte die Sintflut. Die Tora nennt ihn „Priester des Allmächtigen“.</p>`,
        },
      ],
      reflection: 'Awram ließ Lot zuerst das Land wählen — für den Frieden. In welchem Streit kann ich heute nachgeben, damit Frieden bleibt?',
      takeaways: [
        'Die letzten Buchstaben von „איש מעל אחיו אברם“ — שלום: Awram und Lot trennten sich für den Frieden.',
        'Der Frieden gilt auch für die Nachkommen: „Bedränge Moaw nicht.“',
        'Die ersten Buchstaben von „מלך שלם“ — שם: Malki-Zedek ist Schem, der Sohn von Noach.',
      ],
    },
    {
      title: 'Schau auf die Sterne',
      cond: `<p>Awram sagte zu G-tt: Ich habe keine Kinder. Da geschah Folgendes:</p><p class="verse" dir="rtl" lang="he">ויוצא אתו החוצה ויאמר הבט נא השמימה וספר הכוכבים אם תוכל לספר אתם ויאמר לו כה יהיה זרעך</p><p>„Er führte ihn hinaus und sprach: Schau zum Himmel und zähle die Sterne, wenn du sie zählen kannst. Und Er sagte zu ihm: So werden deine Nachkommen sein.“ Und Awram glaubte an G-tt.<sup data-src="gen-15-5"></sup></p><p>Der Baal HaTurim schreibt: Damals, beim Bund zwischen den Stücken, war Awram fünfundsiebzig Jahre alt.</p>`,
      steps: [
        {
          q: 'Wie viel ist das Wort <span class="he">כה</span> — „so“ — wert?',
          hint: '20 + 5.',
        },
        {
          q: 'Der Baal HaTurim: Nach so vielen Jahren, wie das Wort <span class="he">כה</span> ergibt, bekommt Awram Nachkommen. Jetzt ist er 75. Wie alt wird er sein, wenn sein Sohn geboren wird?',
          hint: '75 + die Zahl aus dem letzten Schritt.',
        },
        {
          q: '„So <span class="he">יהיה</span> — werden — deine Nachkommen sein.“ Wie viel ist das Wort <span class="he">יהיה</span> wert?',
          hint: '10 + 5 + 10 + 5.',
        },
        {
          q: 'Der Baal HaTurim: Diese Zahl sagt, <b>von wem</b> es in jeder Generation immer so viele gibt. Von wem?',
          opts: ['Gerechte', 'Könige', 'Propheten', 'Sterne'],
        },
      ],
      reveal: {
        h: 'Fünfundzwanzig Jahre und dreißig Gerechte',
        p: '„Ko“ — „so“ — ist 25: In fünfundzwanzig Jahren, mit hundert, bekommt Awraham Jizchak. „Jihje“ — „wird sein“ — ist 30: Es gibt keine Generation ohne dreißig Gerechte.',
      },
      lessons: [
        {
          h: 'Noch fünfundzwanzig Jahre',
          b: `<p><span class="he">כה</span> = 20 + 5 = 25.<sup data-src="bht-15-5-1"></sup> 75 + 25 = 100 — „Awraham war hundert Jahre alt, als ihm sein Sohn Jizchak geboren wurde.“<sup data-src="gen-21-5"></sup></p><p>Zu diesem Vers bringt Raschi einen Midrasch: „Geh hinaus aus deiner Sterndeuterei!“ — nach den Sternen hat Awram keinen Sohn, aber Awraham wird einen haben.<sup data-src="rashi-15-5"></sup></p>`,
        },
        {
          h: 'Dreißig Gerechte',
          b: `<p><span class="he">יהיה</span> = 10 + 5 + 10 + 5 = 30.<sup data-src="bht-15-5-2"></sup></p><p class="expl"><b>Erklärung.</b> G-tt verglich Awrahams Nachkommen mit den Sternen. Sterne leuchten in der Nacht. So geben auch die Gerechten jeder Generation den Menschen Licht, wenn es um sie herum dunkel ist.</p>`,
        },
      ],
      reflection: 'G-tt sagte zu Awram: „Schau zum Himmel.“ Wenn mir etwas Gutes unmöglich scheint — kann ich dann „die Augen heben“ und glauben, dass sich alles ändern kann?',
      takeaways: [
        'כה = 25: In fünfundzwanzig Jahren, mit hundert, bekommt Awraham Jizchak.',
        'Raschi: „Geh hinaus aus deiner Sterndeuterei“ — nach den Sternen hat Awram keinen Sohn, aber Awraham wird einen haben.',
        'יהיה = 30: In jeder Generation gibt es dreißig Gerechte.',
      ],
    },
    {
      title: 'Der Bund zwischen den Stücken',
      cond: `<p>G-tt versprach Awram das Land Kenaan. Awram fragte:</p><p class="verse" dir="rtl" lang="he">ויאמר אד-ני ה׳ במה אדע כי אירשנה</p><p>„…Mein Herr, Ewiger, woran werde ich erkennen, dass ich es besitzen werde?“<sup data-src="gen-15-8"></sup></p><p>Da schloss G-tt einen Bund mit ihm — den „Bund zwischen den Stücken“ — und sagte:</p><p class="verse" dir="rtl" lang="he">ידע תדע כי גר יהיה זרעך בארץ לא להם ועבדום וענו אתם ארבע מאות שנה</p><p>„Wisse: Deine Nachkommen werden Fremde sein in einem Land, das nicht ihnen gehört. Man wird sie versklaven und quälen, vierhundert Jahre lang.“<sup data-src="gen-15-13"></sup> Und als die Sonne unterging — <em>ועלטה היה והנה תנור עשן</em>: „und es war Finsternis, und siehe — ein rauchender Ofen.“<sup data-src="gen-15-17"></sup></p><p>Hier rechnet der Baal HaTurim nicht nur mit der gewöhnlichen Gematria. <b>Atbasch</b> — jeder Buchstabe wird mit seinem „Spiegel“-Buchstaben vertauscht: der erste ↔ der letzte (<span class="he">א</span> ↔ <span class="he">ת</span>), der zweite ↔ der vorletzte (<span class="he">ב</span> ↔ <span class="he">ש</span>)… Außerdem zählt er die <b>letzten Buchstaben</b> von Wörtern als Zahl.</p>`,
      steps: [
        {
          q: 'Schreib das Wort <span class="he">במה</span> („wie?“) im Atbasch: statt <span class="he">ב</span> schreibst du <span class="he">ש</span>, statt <span class="he">מ</span> — <span class="he">י</span>, statt <span class="he">ה</span> — <span class="he">צ</span>. Wie viel ist das neue Wort wert?',
          hint: 'Die neuen Buchstaben sind Schin, Jud und Zadi: 300 + 10 + 90.',
        },
        {
          q: 'Zähl die <b>letzten</b> Buchstaben der Wörter <span class="he">כי גר</span> („dass Fremde“) zusammen. Wie viel ergibt das?',
          hint: 'Die letzten Buchstaben sind י und ר: 10 + 200.',
        },
        {
          q: 'Raschi zählt die vierhundert Jahre ab Jizchaks Geburt: Jizchak war 60, als Jaakow geboren wurde; Jaakow war 130, als er nach Ägypten zog; und in Ägypten vergingen so viele Jahre wie im letzten Schritt. Wie viele sind es insgesamt?',
          hint: '60 + 130 + 210.',
        },
        {
          q: 'Bilde ein Wort aus den <b>ersten</b> Buchstaben der Wörter <span class="he">ועלטה היה והנה תנור</span> („und es war Finsternis, und siehe — ein Ofen“). Du darfst die Buchstaben umstellen.',
          hint: 'Die ersten Buchstaben leuchten. Es ergibt ein Wort aus dem zweiten Vers der Tora — „Chaos, Leere“.',
        },
      ],
      reveal: {
        h: 'Vierhundert Jahre und Tohu',
        p: '„Ba-ma“ — „wie?“ — wird im Atbasch zu „schiz“ — 400: Für diese Frage wurden Awrahams Nachkommen vierhundert Jahre bestimmt. Die letzten Buchstaben von „ki ger“ sind 210: So viele Jahre war Israel in Ägypten; mit den Jahren von Jizchak und Jaakow 60 + 130 + 210 = 400. Und die ersten Buchstaben von „und es war Finsternis, und siehe — ein Ofen“ ergeben „Tohu“, Chaos: Awraham wurden die Exile gezeigt.',
      },
      lessons: [
        {
          h: 'Vierhundert Jahre',
          b: `<p>Im Atbasch wird <span class="he">ב</span> → <span class="he">ש</span>, <span class="he">מ</span> → <span class="he">י</span>, <span class="he">ה</span> → <span class="he">צ</span>: <span class="he">שיץ</span> = 300 + 10 + 90 = 400.<sup data-src="bht-15-8"></sup></p><p>Die zweite Rechnung ist gewöhnliche Gematria: <span class="he">במה אדע</span> = 47 + 75 = 122 = 52 + 70.</p><p class="expl"><b>Erklärung.</b> Die siebzig Jahre sind das babylonische Exil nach der Zerstörung des Ersten Tempels.</p>`,
        },
        {
          h: 'Zweihundertzehn Jahre',
          b: `<p>Die letzten Buchstaben von <span class="he">כי גר</span> sind <span class="he">י</span> und <span class="he">ר</span>: 10 + 200 = 210.<sup data-src="bht-15-13"></sup> Raschi erklärt, wie die vierhundert Jahre zu den zweihundertzehn Jahren in Ägypten passen: 60 + 130 + 210 = 400.<sup data-src="rashi-15-13"></sup></p>`,
        },
        {
          h: 'Tohu — Chaos',
          b: `<p>Die ersten Buchstaben von <span class="he">ועלטה היה והנה תנור</span> — <span class="he">ו</span>, <span class="he">ה</span>, <span class="he">ו</span>, <span class="he">ת</span> — ergeben rückwärts gelesen <span class="he">תוהו</span>.<sup data-src="bht-15-17"></sup></p><p class="expl"><b>Erklärung.</b> Das Wort „Tohu“ steht im zweiten Vers der Tora: „Die Erde war Tohu wa-Wohu“, leer und wüst. Das Exil ist wie die Welt, bevor es Licht gab. Aber auch dann kommt nach der Dunkelheit das Licht — wie am Anfang der Welt.</p>`,
        },
      ],
      reflection: 'Awraham fragte „woran werde ich erkennen?“ — und erfuhr von schweren Zeiten, aber auch, dass sie enden. Denke ich daran, wenn es mir schwer geht, dass schwere Zeiten ein Ende haben?',
      takeaways: [
        'במה im Atbasch — שיץ = 400: die vierhundert Jahre für Awrahams Nachkommen.',
        'במה אדע = 122 = 52 + 70.',
        'Die letzten Buchstaben von „כי גר“ — י und ר = 210 Jahre in Ägypten; 60 + 130 + 210 = 400.',
        'Die ersten Buchstaben von „ועלטה היה והנה תנור“ — תוהו: Awraham wurden Exile gezeigt, die wie Chaos sind.',
      ],
    },
    {
      title: 'Vater einer Menge',
      cond: `<p>G-tt schloss mit Awram den Bund der Beschneidung und gab ihm einen neuen Namen:</p><p class="verse" dir="rtl" lang="he">ולא יקרא עוד את שמך אברם והיה שמך אברהם כי אב המון גוים נתתיך</p><p>„Dein Name soll nicht mehr Awram heißen, sondern Awraham, denn Ich habe dich zum Vater einer Menge von Völkern gemacht.“<sup data-src="gen-17-4"></sup></p><p>Die Worte <em>אב המון</em> — „Vater einer Menge“ — stehen in diesem Kapitel zweimal. Und über den Sohn, den Sara gebären wird, heißt es: <em>ואת בריתי אקים את יצחק</em> — „Meinen Bund aber werde Ich mit Jizchak aufrichten.“<sup data-src="gen-17-19"></sup></p>`,
      steps: [
        {
          q: 'Wie viel ergeben die Worte <span class="he">אב המון</span> — „Vater einer Menge“?',
          hint: 'אב = 1 + 2; המון = 5 + 40 + 6 + 50.',
        },
        {
          q: 'Im Kapitel stehen diese Worte <b>zweimal</b>. Wie viel ist das zusammen?',
          hint: 'Verdopple die Zahl aus dem letzten Schritt.',
        },
        {
          q: 'Wessen Name hat dieselbe Gematria?',
          opts: ['Jizchak', 'Jischmael', 'Jaakow', 'Awraham'],
        },
        {
          q: 'Der Baal HaTurim liest das Wort <span class="he">אקים</span> („Ich werde aufrichten“) als <b>Notarikon</b>: Jeder seiner Buchstaben beginnt ein eigenes Wort. Welcher Satz entsteht?',
          opts: ['„Der den Geliebten vom Mutterleib an geheiligt hat“', '„Vater einer Menge von Völkern“', '„und du sollst ihn Jizchak nennen“', '„als ewigen Bund für seine Nachkommen“'],
        },
      ],
      reveal: {
        h: 'Jizchak in Awrahams Namen',
        p: '„Aw hamon“ ist 104, und zweimal — 208, wie „Jizchak“: Im neuen Namen von Awraham steckt schon sein Sohn. Und „akim“ — „Ich werde aufrichten“ — ist ein Notarikon von „ascher kidesch jedid mi-beten“, „Der den Geliebten vom Mutterleib an geheiligt hat“: So sagt man im Segen bei der Brit Mila.',
      },
      lessons: [
        {
          h: 'Zweimal „Vater einer Menge“',
          b: `<p><span class="he">אב המון</span> = 3 + 101 = 104; 104 + 104 = 208 = <span class="he">יצחק</span> (10 + 90 + 8 + 100).<sup data-src="bht-17-4"></sup> „Arbe“ — „Ich werde vermehren“ — steht am Anfang desselben Kapitels (<span class="he">וארבה אותך</span>, 17,2): <span class="he">ארבה</span> = 1 + 200 + 2 + 5 = 208.</p>`,
        },
        {
          h: 'Vom Mutterleib an geheiligt',
          b: `<p>Die ersten Buchstaben der Wörter <span class="he">אשר קידש ידיד מבטן</span> — <span class="he">א</span>, <span class="he">ק</span>, <span class="he">י</span>, <span class="he">מ</span> — sind <span class="he">אקים</span>.<sup data-src="bht-17-21"></sup> Diese Worte stammen aus dem Segen, den man bei der Brit Mila sagt; die Gemara bringt ihn.<sup data-src="shabbat-137b"></sup></p><p class="expl"><b>Erklärung.</b> So geht der Bund, den G-tt mit Jizchak aufgerichtet hat, in der Brit Mila jedes jüdischen Jungen weiter.</p>`,
        },
      ],
      reflection: 'Im neuen Namen von Awraham steckte schon der Name seines künftigen Sohnes. Welche gute Tat, die ich heute tue, wird ein „Erbe“ für die, die nach mir kommen?',
      takeaways: [
        'אב המון = 104; zweimal — 208 = יצחק: Jizchak steckt in Awrahams Namen.',
        'ארבה („Ich werde vermehren“) = 208 = יצחק.',
        'אקים — ein Notarikon von „אשר קידש ידיד מבטן“, Worten aus dem Segen bei der Brit Mila.',
      ],
    },
  ],
  memo: {
    intro:
      'Zwölf Kommentare des Baal HaTurim zum Wochenabschnitt Lech Lecha — zwölf Kartenpaare. Jedes Bild erzählt von einem Kommentar, und sein Paar sind die Worte der Tora, um die es darin geht.',
    items: [
      {
        title: 'Hundert Jahre bis Jizchak',
        caption: 'Awram und seine Familie brechen auf',
        verse: '„Geh für dich“',
        quote: '„Geh für dich“ — Er deutete ihm an: Wenn du hundert [Jahre alt] bist, nach der Zahl von „lech lecha“, dann „mache Ich dich zu einem großen Volk“ — als Jizchak geboren wurde.',
        explain:
          'Das Wort לך ist 50: ל = 30, ך = 20. „Lech lecha“ ist zweimal 50, also 100. G-tt sagte „geh für dich“ zu Awram, als er fünfundsiebzig Jahre alt war, und Jizchak wurde geboren, als Awraham hundert wurde. So steckte schon in den ersten Worten ein Hinweis: Mit hundert wirst du Vater eines großen Volkes.',
        note: 'Awraham war 100 Jahre alt, als Jizchak geboren wurde',
        moral: 'G-ttes Versprechen erfüllt sich vielleicht nicht sofort — aber es erfüllt sich ganz sicher.',
      },
      {
        title: 'Zehn Sprüche',
        caption: 'Zehn Lichter — zehn Sprüche der Schöpfung',
        verse: '„Und der Ewige sprach zu Awram“',
        quote: '[Die Tora] begann mit einem Spruch — mit der Sprache, mit der die Welt erschaffen wurde: Die Welt wurde mit zehn Sprüchen erschaffen, und sie wurde ganz nur durch das Verdienst Awrahams erschaffen.',
        explain:
          'Die Welt wurde mit zehn Sprüchen erschaffen: „Und G-tt sprach: Es werde Licht…“ — zehnmal. Auch die Geschichte von Awraham beginnt die Tora mit „und Er sprach“. Der Baal HaTurim erklärt: Die ganze Welt wurde für Awraham erschaffen — für einen Menschen, der die Menschen lehrt, den Schöpfer zu kennen.',
        moral: 'Die Welt wurde für gute Taten erschaffen. Auch meine guten Taten gehören dazu.',
      },
      {
        title: 'Drei Segen',
        caption: 'Awram hebt die Hände: ein Segen',
        verse: '„und Ich segne dich und mache deinen Namen groß“',
        quote: '„Ich mache dich zu einem großen Volk, Ich segne dich und mache deinen Namen groß“ — drei Segen, entsprechend den drei Segen der Kohanim.',
        explain:
          'Hier segnet G-tt Awram dreimal. Der Baal HaTurim sieht darin die drei Segen der Kohanim: „Er segne dich…“, „Er lasse leuchten…“, „Er erhebe…“. Der Priestersegen hat sechzig Buchstaben, und auch darauf gibt es einen Hinweis: Auf dem Buchstaben ך (20) im Wort „die dich segnen“ stehen drei Krönchen, und dreimal 20 ist 60.',
        moral: 'Awrahams Segen geht weiter: Die Kohanim segnen seine Nachkommen bis heute.',
      },
      {
        title: 'Pharaos Geschenke',
        caption: 'Pharao, geschlagen, lässt Awram gehen',
        verse: '„nimm sie und geh“',
        quote: '„Nimm sie in deine Hand und geh“: Auch wenn hier nicht steht, dass [Pharao] ihm Geschenke gab, wie Awimelech, gab er sie ihm sicher.',
        explain:
          'Pharao nahm Sarai in seinen Palast, und G-tt schlug sein Haus mit schweren Plagen. Da gab Pharao Sarai zurück und sagte zu Awram: „Hier ist deine Frau, nimm sie und geh.“ Die Worte „und geh“ (ולך) stehen fünfmal im Tanach; im Buch Jirmejahu heißt es: „Die Rolle, aus der du gelesen hast — nimm sie in deine Hand und geh.“ Der Baal HaTurim lehrt: „und geh“ bedeutet, dass Awram etwas von Hand zu Hand bekam — Pharao ließ ihn mit Geschenken gehen. Und wirklich: Awram verließ Ägypten sehr reich.',
        moral: 'G-tt beschützt den Gerechten — sogar aus der Not kommt er mit Gutem heraus.',
      },
      {
        title: 'Getrennt für den Frieden',
        caption: 'Awram und Lot trennen sich mit ihren Herden',
        verse: '„voneinander. Awram…“',
        quote: '„Und sie trennten sich voneinander. Awram“ — die Endbuchstaben: שלום (Frieden). Sie trennten sich, um den Frieden zu bewahren.',
        explain:
          'Die Hirten von Awram und Lot stritten sich. Awram sagte: „Es soll kein Streit zwischen mir und dir sein… Gehst du nach links, gehe ich nach rechts.“ Nimm die letzten Buchstaben der Wörter איש מעל אחיו אברם: ש, ל, ו, ם — sie ergeben שלום, „Frieden“. Awram und Lot trennten sich nicht aus Feindschaft, sondern um den Frieden zu bewahren.',
        moral: 'Manchmal ist es besser nachzugeben und sich freundlich zu trennen, damit Frieden bleibt.',
      },
      {
        title: 'Das vierzehnte Jahr',
        caption: 'Kampf in der Nacht: Awram rettet Lot',
        verse: '„und im vierzehnten Jahr“',
        quote: 'So wie die Völker gegen Chiskijahu kamen und in seine Hand fielen, so kamen sie gegen Awraham und fielen in seine Hand.',
        explain:
          'Vier mächtige Könige kämpften gegen fünf und nahmen Lot gefangen. Awram holte sie mit einer kleinen Schar in der Nacht ein, besiegte sie und befreite Lot. Die Worte „und im vierzehnten“ stehen nur zweimal am Anfang eines Verses: hier und im Buch Melachim — „im vierzehnten Jahr des Königs Chiskijahu zog Sancheriw herauf“ mit einem riesigen Heer gegen Jeruschalajim. Der Baal HaTurim verbindet die beiden Geschichten: Awram und Chiskijahu besiegten die stärksten Feinde mit G-ttes Hilfe.',
        moral: 'Nicht die Stärke und nicht die Zahl der Krieger entscheiden — die Hilfe kommt von G-tt.',
      },
      {
        title: 'Malki-Zedek ist Schem',
        caption: 'Malki-Zedek bringt Brot und Wein',
        verse: '„König von Schalem“',
        quote: '„König von Schalem“ — die Anfangsbuchstaben: שם (Schem). Das ist Schem, der Sohn von Noach.',
        explain:
          'Nach dem Sieg kam Malki-Zedek, der König von Schalem und Priester G-ttes, Awram entgegen, brachte Brot und Wein und segnete ihn. Die ersten Buchstaben der Wörter מלך שלם sind מ und ש; vertausche sie — dann steht da שם, Schem. Der Baal HaTurim lehrt: Malki-Zedek ist Schem, der Sohn von Noach, der zur Zeit Awrams noch lebte.',
        moral: 'Gerechte aus verschiedenen Generationen begegnen sich und segnen einander — so wird das Gute weitergegeben.',
      },
      {
        title: 'Dreißig Gerechte',
        caption: 'Awram schaut zu den Sternen',
        verse: '„so werden deine Nachkommen sein“',
        quote: '„Wird sein“ — Gematria „dreißig“: Es gibt keine Generation ohne dreißig Gerechte.',
        explain:
          'G-tt führte Awram aus dem Zelt und sagte: „Schau zum Himmel und zähle die Sterne… So werden deine Nachkommen sein.“ Das Wort יהיה („wird sein“) ist 30: י = 10, ה = 5, י = 10, ה = 5. Der Baal HaTurim lehrt: In jeder Generation gibt es mindestens dreißig Gerechte — sie leuchten für die Welt wie Sterne.',
        note: 'dreißig Gerechte in jeder Generation',
        moral: 'Jeder kann einer von denen werden, die für ihre Generation leuchten.',
      },
      {
        title: 'Zweihundertzehn Jahre',
        caption: 'Jaakows Familie zieht nach Ägypten',
        verse: '„dass deine Nachkommen Fremde sein werden“',
        quote: '„Dass Fremde“ — die Endbuchstaben ergeben die Zahl רד״ו (210).',
        explain:
          'Beim Bund zwischen den Stücken sagte G-tt zu Awram: „Wisse, dass deine Nachkommen Fremde sein werden in einem Land, das nicht ihres ist.“ Nimm die letzten Buchstaben der Wörter כי גר: י (10) und ר (200) — zusammen 210, wie das Wort רדו, „zieht hinab“. So lange lebte Israel in Ägypten: Jaakow zog mit seiner Familie hinab, und nach 210 Jahren führte Mosche das Volk in die Freiheit.',
        note: 'so viele Jahre lebten Awrahams Nachkommen in Ägypten',
        moral: 'Auch ein langes Exil hat ein Ende — und G-tt hat es abgemessen.',
      },
      {
        title: 'Gebet am Wasser',
        caption: 'Hagar an einer Quelle in der Wüste',
        verse: '„an der Wasserquelle“',
        quote: '„An der Wasserquelle“: Es ist gut, am Wasser zu beten. Und das Gebet wird mit Wasser verglichen, wie geschrieben steht: „Schütte dein Herz aus wie Wasser.“',
        explain:
          'Hagar, die Magd von Sarai, floh in die Wüste, und ein Engel G-ttes fand sie „an der Wasserquelle“. Diese Worte stehen noch einmal in der Tora — als Awrahams Knecht an einer Quelle stand und betete, eine Frau für Jizchak zu finden. Der Baal HaTurim lehrt: Am Wasser ist es gut zu beten. Und das Gebet selbst ist wie Wasser — im Buch Echa heißt es: „Schütte dein Herz aus wie Wasser.“',
        moral: 'Beten heißt, G-tt das Herz einfach und ehrlich zu öffnen, so wie Wasser fließt.',
      },
      {
        title: 'Jizchak im Namen Awrahams',
        caption: 'Neue Namen: Awraham und Sara',
        verse: '„Vater einer Menge“',
        quote: 'Zweimal in diesem Kapitel — „Vater einer Menge“, und das ergibt die Zahl von „Jizchak“. Und ebenso „Ich werde vermehren“ — Gematria „Jizchak“.',
        explain:
          'G-tt gab Awram einen neuen Namen — Awraham: „denn zum Vater einer Menge von Völkern mache Ich dich.“ Die Worte אב המון („Vater einer Menge“) sind 104, und im Kapitel stehen sie zweimal: 104 + 104 = 208. Genauso viel ist יצחק, Jizchak: 10 + 90 + 8 + 100. Und auch das Wort ארבה („Ich werde vermehren“) ist 208. Im neuen Namen steckte schon ein Versprechen: Awraham und Sara bekommen Jizchak.',
        note: 'zweimal 104 = 208 = יצחק',
        moral: 'Manchmal ist das, was wir uns wünschen, schon ganz nah — wir müssen nur warten.',
      },
      {
        title: 'Der Bund der Beschneidung',
        caption: 'Ein Messer für die Brit Mila und eine Lampe',
        verse: '„Meinen Bund aber werde Ich aufrichten“',
        quote: '„Ich werde aufrichten“ — ein Notarikon: „Der den Geliebten vom Mutterleib an geheiligt hat“.',
        explain:
          'G-tt sagte zu Awraham: „Meinen Bund aber werde Ich mit Jizchak aufrichten.“ Nimm die ersten Buchstaben der Wörter אשר קידש ידיד מבטן: א, ק, י, מ — sie ergeben אקים, „Ich werde aufrichten“. Diese Worte stammen aus dem Segen, den man bei der Brit Mila sagt. So geht der Bund, der mit Awraham und Jizchak begann, bei jedem jüdischen Jungen weiter.',
        moral: 'Der Bund mit G-tt geht von Generation zu Generation weiter — und jeder von uns gehört dazu.',
      },
    ],
  },
  final: {
    title: 'Der Weg ist offen',
    allSolved:
      'Alle fünf Rätsel sind gelöst. „Lech lecha“ sind hundert Jahre bis zu Jizchaks Geburt, Wolken zeigten Awraham den Weg, Awram und Lot trennten sich für den Frieden, Malki-Zedek ist Schem, „ko“ sind fünfundzwanzig Jahre Warten, „ba-ma“ im Atbasch sind vierhundert Jahre, und in „Vater einer Menge“ steckt Jizchak.',
  },
  audience: 'Addieren, mal 2 und mal 3, Atbasch und Buchstabenspiele; eine bekannte Geschichte — Awrahams Weg. Jüngere Kinder — zusammen mit einem Erwachsenen.',
  practice:
    'Mach diese Woche deinen eigenen Schritt „lech lecha“: Fang eine gute Tat an, die du schon lange aufschiebst — auch wenn du noch nicht siehst, wie sie endet. Awraham ging in das Land, „das Ich dir zeigen werde“ — und Wolken zeigten ihm den Weg.',
  highlight: '„Ich werde dir zeigen“ ist gleich „in den Wolken“: Wolken gingen vor Awraham her und zeigten ihm den Weg.',
  share: ({ score, max, time, grid, allSolved, site }) => `☁️ Wie fand Awraham seinen Weg? Die Antwort steckt in den Worten „Ich werde dir zeigen“.

Ich spiele ein Gematria-Spiel nach dem Kommentar des Baal HaTurim zum Wochenabschnitt Lech Lecha. ${allSolved ? 'Alle fünf Rätsel gelöst:' : 'Mein Weg bis jetzt:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Fünf Rätsel: „geh für dich“ und die Wolken auf dem Weg, Frieden mit Lot und Malki-Zedek, die Sterne und dreißig Gerechte, der Bund zwischen den Stücken und Atbasch, Awrahams Name und Jizchak. Schaffst du es besser?
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Nach dem Kommentar des Baal HaTurim (Rabbi Jaakow ben Ascher, 14. Jh.) zum Wochenabschnitt Lech Lecha (Bereschit 12,1–17,27), Kurzfassung („Kizur Baal HaTurim“). Hebräischer Text — Sefaria.',
};

export default de;
