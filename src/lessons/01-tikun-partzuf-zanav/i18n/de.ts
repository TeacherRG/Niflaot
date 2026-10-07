import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Tikkun Parzuf-Sanaw',
  hero: {
    heading: 'Die Mathematik der Seele: <i>vier Gematria-Rätsel</i>',
    author: 'nach einem Artikel von Rabbiner Jizchak Ginsburgh',
    intro:
      'Zähle die Zahlenwerte von Wörtern, entdecke verborgene Gleichheiten und erschließe ihren Sinn: Hochmut und Begierde, Gebet, die drei Gesichter des Menschen und das Geheimnis der Ehe.',
  },
  summary: 'Hochmut und Begierde, Gebet, die drei Gesichter des Menschen und das Geheimnis der Ehe — vier Rätsel über Gesicht, Maske und Herz.',
  glossary: {
    'פרצוף': 'Gesicht, Antlitz',
    'זנב': 'Schwanz',
    'גאוה': 'Hochmut',
    'תאוה': 'Begierde',
    'אש': 'Feuer',
    'אלף': 'Alef',
    'שין': 'Schin',
    'תפלה': 'Gebet',
    'פנים': 'inneres Antlitz',
    'מסכה': 'Maske',
    'לעיני': 'vor den Augen',
    'כל': 'von ganz',
    'ישראל': 'Israel',
    'אשה': 'Frau',
    'טוב': 'Gutes',
    'חי': 'Leben',
    'ויבן': 'und Er baute',
  },
  riddles: [
    {
      title: 'Das kosmische Gleichgewicht zweier Kräfte',
      cond: `<p>Die Weisen des Talmuds streiten darüber, was die „Rückseite“ (<em>אחור</em>) des ersten Menschen war, aus der Chawa erschaffen wurde: Die einen sagen — ein Gesicht (<em>פרצוף</em>), die anderen — ein Schwanz (<em>זנב</em>).<sup data-src="berakhot-61a"></sup></p><p>Die Chassidut erklärt: Hinter dem „Gesicht“ steht die Wurzel des Hochmuts (<em>גאוה</em>), hinter dem „Schwanz“ die Wurzel der Begierde (<em>תאוה</em>). Wiege beide Paare.</p>`,
      steps: [
        { q: 'Wie viel ist <span class="he">פרצוף + גאוה</span>?', hint: 'פרצוף = 456, und גאוה ist 3 + 1 + 6 + 5.' },
        { q: 'Wie viel ist <span class="he">זנב + תאוה</span>?', hint: 'זנב = 7 + 50 + 2, und תאוה = 400 + 1 + 6 + 5.' },
        {
          q: 'Welches Wort ergibt, wenn man seine Buchstaben voll ausschreibt (מילוי), genau 471?',
          opts: ['Feuer · אלף + שין', 'Licht · אלף + וו + ריש', 'Wasser · מם + יוד + מם', 'Geist · ריש + וו + חית'],
        },
      ],
      reveal: {
        h: 'Das Feuer des Hochmuts und das Feuer der Leidenschaft',
        p: 'Beide Seiten des Unterbewussten stehen in genauem Gleichgewicht. Beide sind Feuer: Der Buchstabe Alef ist die Wurzel des hochmütigen „Ich“, der Buchstabe Schin die Flamme der Leidenschaft.',
      },
      lessons: [
        { h: 'Woraus die Frau erschaffen wurde', b: `<p>Die unmittelbarste Bedeutung des Streits um „Gesicht“ und „Schwanz“ ist ein Streit darüber, <b>woraus die Frau erschaffen wurde</b>. In der Gemara (Berachot 61a, Eruwin 18a)<sup data-src="berakhot-61a"></sup> wird über die Worte „und G-tt baute die Rippe (<span class="he">צלע</span>) … zu einer Frau“<sup data-src="gen-2-21"></sup> gestritten. Was war diese „Rippe“?</p><p><b>Einer sagt — ein „Parzuf“, ein Gesicht.</b> Adam wurde mit zwei Gesichtern erschaffen: vorn ein männliches Gesicht, hinten ein weibliches. Der Allmächtige trennte sie, und das hintere Gesicht wurde Chawa. Nach dieser Meinung ist die Frau von Anfang an ein vollständiges, eigenes Gesicht, dem Mann gleich.</p><p><b>Der andere sagt — ein „Sanaw“, ein Schwanz.</b> Adam hatte hinten einen kleinen Fortsatz, und aus ihm wurde die Frau „gebaut“. Nach dieser Meinung beginnt sie mit etwas Kleinem und entwickelt sich.</p><p>Die Lektion führt diese Linie fort. <b>Raw, der Idealist:</b> Die Frau ist ursprünglich ein „Parzuf“, eine vollkommene Schöpfung. <b>Schmuel, der Realist:</b> Die Frau ist ursprünglich ein „Schwanz“, und der Weg zur Vollkommenheit geht schrittweise.</p><p>Das Wort „Schwanz“ (<span class="he">זנב</span>) hat die Gematria 59, wie „Nidda“ (<span class="he">נדה</span>): 50 + 4 + 5. Das ist ein Hinweis auf einen Zustand der Trennung und Unreinheit, der berichtigt werden muss. Daher das Ideal einer Ehe, die in Reinheit beginnt.</p>` },
        {
          h: 'Das Jahr פ״ז: Gesicht und Schwanz',
          b: `<p>Das Jahr ה׳תשפ״ז liest sich als Hinweis auf „Parzuf-Sanaw“: Die Buchstaben פ und ז beginnen beide Wörter. Der erste Mensch wurde „hinten und vorn“ erschaffen, und die Weisen streiten darüber, was seine Rückseite war. Raw sagt — ein Gesicht, Schmuel sagt — ein Schwanz.</p><p>In der Kabbala ist die „Rückseite“ des Menschen sein Unterbewusstes, das, was er an sich selbst nicht sieht. Der Streit geht also darum, was in der Tiefe des Unbewussten liegt: ein Bild des eigenen Ich oder ein Trieb.</p>`,
        },
        {
          h: 'Was ist ein „Parzuf“',
          b: `<p>Ein „Parzuf“ ist weder das Antlitz selbst (פנים) noch eine Maske (מסכה), sondern etwas dazwischen. Es ist das Bild, das ein Mensch anderen zeigen will: wie er vor den Leuten erscheinen möchte. Daher die Verbindung zum Hochmut.</p><p>Hochmut wird als die „andere Seite“ (סטרא אחרא) beschrieben: Der Mensch legt gleichsam ein fremdes Selbstbewusstsein an und erhebt sich über seinen Nächsten. Der „Schwanz“ ist mit dem Umherschweifen von Herz und Augen verbunden, und seine Berichtigung ist das Hüten des Bundes.</p>`,
        },
        {
          h: 'Chabad und Breslow: was an der Wurzel liegt',
          b: `<p>Die chassidischen Schulen unterscheiden sich ebenso wie Raw und Schmuel. In Chabad ist die Hauptwurzel des Bösen der Hochmut, also der „Parzuf“. In Breslow ist es die Begierde, also der „Schwanz“.</p><p>Die Zahlen zeigen, dass beide Positionen gleich viel wiegen: „Parzuf-Hochmut“ ist gleich „Schwanz-Begierde“, 471. Das ist „Feuer“ in voller Schreibweise: Alef — die Wurzel des Selbstbewusstseins, Schin — die Flamme der Leidenschaft. Die Berichtigung des Hochmuts ist die Demut Mosches, „des demütigsten aller Menschen“<sup data-src="num-12-3"></sup>.</p>`,
        },
        {
          h: 'Freud und Jung',
          b: `<p>Auch die moderne Psychologie beginnt beim Unterbewussten, das sich im Traum zeigt. Für Freud drückt der Traum den niedrigsten Teil der Persönlichkeit aus, die Triebe des „Es“ — das ist der „Schwanz“.</p><p>Für Jung kann der Traum auch den höchsten Teil der Persönlichkeit ausdrücken, bis hin zu einem „prophetischen“ Blick in das kollektive Unbewusste — das ist der „Parzuf“. Jungs Begriff der „Persona“, der Maske vor der Gesellschaft, stimmt im Grunde mit dem „Parzuf“ überein.</p>`,
        },
      ],
      reflection: 'Was ist heute stärker in mir — der Wunsch, gut dazustehen („Parzuf“), oder der Wunsch, zu bekommen („Schwanz“)? In welcher Situation hat sich das diese Woche gezeigt?',
      takeaways: [
        'Raw und Schmuel streiten darüber, was die „Rückseite“ Adams war, aus der Chawa erschaffen wurde: ein „Gesicht“ (פרצוף) oder ein „Schwanz“ (זנב). Nach der einen Meinung ist die Frau von Anfang an dem Mann gleich, nach der anderen wächst sie aus dem Kleinen.',
        'Die „Rückseite“ des Menschen ist sein Unterbewusstes. Hinter dem „Gesicht“ steht die Wurzel des Hochmuts (גאוה), hinter dem „Schwanz“ die Wurzel der Begierde (תאוה).',
        'פרצוף + גאוה = זנב + תאוה = 471 = אש in voller Schreibweise (אלף + שין): Beide Leidenschaften sind Feuer, und sie wiegen gleich viel.',
        'Chabad sieht die Hauptwurzel des Bösen im Hochmut, Breslow in der Begierde. Bei Jung ist die „Persona“ der „Parzuf“, bei Freud sind die Triebe des „Es“ der „Schwanz“.',
        'זנב = 59 = נדה: ein Hinweis auf eine Trennung, die berichtigt wird; daher das Ideal einer Ehe, die in Reinheit beginnt.',
      ],
      puzzle: {
        q: 'Setze den Gedankengang zusammen: vom Streit der Weisen zur Zahl und ihrem Sinn.',
        pieces: ['Streit: „Gesicht“ oder „Schwanz“', 'Die „Rückseite“ ist das Unterbewusste', 'Zwei Wurzeln: גאוה und תאוה', 'Gleiches Gewicht: 471', 'Beide sind Feuer, אש'],
        meaning: 'Der Hochmut des „Gesichts“ und die Begierde des „Schwanzes“ leben im Unterbewussten und wiegen gleich viel: Beide sind Feuer, 471 = אש.',
      },
    },
    {
      title: 'Die Mathematik der Berichtigung',
      cond: `<p>Verbinde beide Extreme des Unterbewussten — „Gesicht“ und „Schwanz“ (<em>פרצוף־זנב</em>) — in einer einzigen Betrachtung. Welcher Dienst ergibt sich als Summe, und welche Mizwa berichtigt beide Wurzeln?</p>`,
      steps: [
        { q: 'Wie viel ist <span class="he">פרצוף + זנב</span>?', hint: 'Beide Zahlen kennst du schon aus dem ersten Rätsel: 456 und 59.' },
        { q: 'Welches Wort hat die Gematria 515?', opts: ['Gebet', 'Tora', 'Zedaka', 'Teschuwa'] },
        { q: 'Welche Mizwa wird sowohl auf den Kopf gelegt — den Sitz des Hochmuts des Verstandes — als auch auf den Arm gegenüber dem Herzen — den Sitz der Leidenschaft?', opts: ['Tefillin', 'Zizit', 'Mesusa', 'Schabbat'] },
      ],
      reveal: {
        h: 'Das Gebet verbindet Gesicht und Schwanz',
        p: 'Die Tefillin des Arms legt man gegenüber dem Herzen, um die Leidenschaften („Schwanz“) zu bezwingen. Die Tefillin des Kopfes legt man auf das Gehirn, um den Hochmut des Verstandes („Gesicht“) zu demütigen.',
      },
      lessons: [
        {
          h: 'Gebet und Tefillin',
          b: `<p>Zählt man beide Seiten zusammen, „Parzuf“ und „Sanaw“, ergibt sich „Gebet“ (תפלה). Um beide Triebe zu berichtigen, gibt es zwei Tefillin.</p><p>Die Tefillin des Arms legt man gegenüber dem Herzen: Sie berichtigen die Begierde, die im Herzen wohnt. Das ist das „Gebet Davids“, des Herzens von ganz Israel. Die Tefillin des Kopfes legt man auf das Gehirn, den Sitz des Selbstbewusstseins: Sie berichtigen den Hochmut. Das ist das „Gebet Mosches“, des Hauptes des Volkes.</p>`,
        },
      ],
      reflection: 'Welchen einen Satz werde ich morgen im Gebet so sagen, dass er vom Kopf und vom Herzen zugleich kommt?',
      takeaways: [
        'פרצוף + זנב = 515 = תפלה: Das Gebet verbindet und berichtigt beide Seiten des Unterbewussten.',
        'Die Tefillin des Arms legt man gegenüber dem Herzen — sie berichtigen die Begierde („Gebet Davids“).',
        'Die Tefillin des Kopfes legt man auf das Gehirn — sie demütigen den Hochmut des Verstandes („Gebet Mosches“).',
      ],
      puzzle: {
        q: 'Setze den Weg der Berichtigung zusammen: von den zwei Seiten zur Mizwa.',
        pieces: ['Gesicht und Schwanz: 456 + 59', '515 = תפלה, Gebet', 'Zwei Tefillin: Kopf und Arm', 'Hochmut und Leidenschaft berichtigt'],
        meaning: 'Gesicht und Schwanz zusammen sind Gebet. Die Tefillin des Kopfes demütigen den Hochmut des Verstandes, die Tefillin des Arms — gegenüber dem Herzen — berichtigen die Leidenschaft.',
      },
    },
    {
      title: 'Die drei Stufen Mosches: von der Maske zur Liebe',
      cond: `<p>Der Artikel unterscheidet drei Stufen, auf denen ein Mensch sich zeigt:</p><p>• die harte Maske (<em>מסכה</em>), die man im Zorn und beim Richten aufsetzt;<br>• die gesellschaftliche Fassade (<em>פרצוף</em>), mit der man hinausgeht, um andere zu lehren;<br>• das wahre innere Antlitz (<em>פנים</em>), das die Liebe zum Nächsten verbirgt.</p><p>Zähle alle drei zusammen. Welcher Satz vom Ende der Tora ergibt sich?</p>`,
      steps: [
        { q: 'Wie viel ist <span class="he">פנים + פרצוף + מסכה</span>?', hint: 'פנים = 80 + 50 + 10 + 40, מסכה = 40 + 60 + 20 + 5.' },
        { q: 'Welcher Satz der Tora ist gleich dieser Zahl?', opts: ['vor den Augen von ganz Israel', 'Höre, Israel', 'Im Anfang erschuf', 'Mosche, unser Lehrer'] },
        { q: '761 ist eine zentrierte Quadratzahl der Ordnung 20. Berechne <span class="num">20² + 19²</span>.', hint: '400 + 361.' },
      ],
      reveal: {
        h: 'Die letzten Worte der Tora',
        p: 'Die Tora endet mit den Worten „vor den Augen von ganz Israel“ (Dewarim 34,12). Alle drei Stufen Mosches — Maske, Fassade und inneres Antlitz — zeigen sich zusammen vor dem ganzen Volk.',
      },
      lessons: [
        {
          h: 'Die Maske Mosches',
          b: `<p>Nach der Sünde des Goldenen Kalbes begann Mosche, sein Gesicht mit einer Decke zu verhüllen<sup data-src="ex-34-33"></sup>. Die Lektion verbindet das mit den Augenblicken, in denen Mosche zornig wurde und irrte: Zorn verbirgt das wahre Gesicht. Die Maske ist das Gesicht, mit dem man kommt, um zurechtzuweisen.</p>`,
        },
        {
          h: 'Der Parzuf Mosches',
          b: `<p>Wenn Mosche das Volk Tora lehrt — erklärt, was verboten und was erlaubt ist —, tritt er in der Gestalt eines Lehrers vor die Menschen. Das ist sein „Parzuf“, das Gesicht der Unterweisung.</p>`,
        },
        {
          h: 'Das wahre Gesicht Mosches',
          b: `<p>Das innere Wesen Mosches ist grenzenlose Liebe zu Israel. Er ist bereit, aus der Tora gelöscht zu werden, wenn nur dem Volk vergeben wird<sup data-src="ex-32-31"></sup>. Er ist der „treue Hirte“, der das Volk mit Erbarmen führt.</p><p>Alle drei Stufen zusammen — Maske, Parzuf und Antlitz — ergeben 761, „vor den Augen von ganz Israel“: die letzten Worte der Tora, die sich<sup data-src="deut-34-10"></sup> sogleich mit ihrem Anfang, „Bereschit“, verbinden.</p>`,
        },
        {
          h: 'Realist und Idealist',
          b: `<p>Den Streit zwischen Raw und Schmuel liest die Lektion auch als Streit zweier Weltanschauungen. Schmuel ist Realist: Die Welt entwickelt sich schrittweise, vom „Schwanz“ zum „Gesicht“, wie in der Evolution. Raw ist Idealist: Die Schöpfung ist von Anfang an vollkommen, ein vollendeter „Parzuf“.</p><p>Daher auch die unterschiedliche Sicht auf die Tage des Maschiach: Bei Schmuel ist es eine schrittweise Berichtigung im Rahmen der Natur, bei Raw eine wunderbare Verwandlung der Welt.</p>`,
        },
      ],
      reflection: 'Wo trage ich eine Maske, wo zeige ich einen „Parzuf“, und wem öffne ich mein wahres Gesicht? Wer verdient es, es öfter zu sehen?',
      takeaways: [
        'Der Mensch hat drei Stufen: die Maske (מסכה) — das Gesicht des Zorns und der Zurechtweisung; den „Parzuf“ — das Gesicht des Lehrers vor den Menschen; das wahre Antlitz (פנים) — die verborgene Liebe.',
        'פנים + פרצוף + מסכה = 761 = לעיני כל ישראל — die letzten Worte der Tora; 761 = 20² + 19².',
        'Das innere Wesen Mosches ist grenzenlose Liebe zu Israel: Er ist bereit, um des Volkes willen aus der Tora gelöscht zu werden.',
        'Raw ist Idealist: Die Schöpfung ist sofort vollkommen. Schmuel ist Realist: Die Berichtigung geht schrittweise, vom „Schwanz“ zum „Gesicht“.',
      ],
      puzzle: {
        q: 'Setze die drei Stufen Mosches von außen nach innen zusammen — und ihre Summe.',
        pieces: ['Maske, מסכה — Zorn und Tadel', 'Parzuf — das Gesicht des Lehrers', 'Antlitz, פנים — verborgene Liebe', '761 = „vor den Augen von ganz Israel“'],
        meaning: 'Maske, Parzuf und wahres Antlitz ergeben zusammen 761 — die letzten Worte der Tora: Alles an Mosche ist vor dem Volk offenbar.',
      },
    },
    {
      title: 'Das Geheimnis der Ehe: vom Egoismus zum Guten',
      cond: `<p>In einer egoistischen Ehe („ich finde“, <em>מוצא אני</em>)<sup data-src="berakhot-8a"></sup> sucht der Mensch die Befriedigung seiner Ambitionen („Gesicht“) oder seiner Begierden („Schwanz“). Erhebt er sich zu einer Begegnung „von Angesicht zu Angesicht“, findet er eine wahre Frau (<em>מצא אשה</em>) und erlangt das Gute (<em>טוב</em>).</p>`,
      steps: [
        { q: 'Wie viel Mal größer ist <span class="he">אשה</span> als <span class="he">טוב</span>?', hint: 'אשה = 306, טוב = 17. Teile.' },
        { q: 'Welches Wort ist gleich diesem Faktor?', opts: ['Leben', 'Liebe', 'eins', 'Herz'] },
        {
          q: 'Mit dem Wort <span class="he">ויבן</span> („und Er baute“) erschuf der Allmächtige die Frau. Wie oft ist <span class="he">טוב</span> darin enthalten?',
          hint: 'ויבן = 6 + 10 + 2 + 50 = 68.',
        },
      ],
      reveal: {
        h: 'Eine Frau gefunden — Gutes gefunden',
        p: '„Frau“ ist achtzehnmal „Gutes“, also Leben aus dem Guten. Selbst der Akt ihrer Erschaffung, „und Er baute“, enthält das Gute viermal.',
      },
      lessons: [
        { h: 'Wie er seine Frau sieht', b: `<p>Der Streit zwischen Raw und Schmuel verlagert sich in den Mann hinein. Ob er seine Frau als „Gesicht“ oder als „Schwanz“ sieht, hängt von seiner eigenen „Rückseite“ ab, von seinem Unterbewussten.</p><p>Sieht er einen „Schwanz“, betrachtet er sie durch die Begierde. Sieht er einen „Parzuf“, betrachtet er sie als Teil seiner eigenen Ehre.</p><p>Die Berichtigung ist, sie nicht mit der eigenen „Rückseite“ zu sehen, sondern von Angesicht zu Angesicht, so wie sie ist. Dann gilt: „Wer eine Frau gefunden hat, hat Gutes gefunden.“</p>` },
        {
          h: '„Ich finde“ und „eine Frau gefunden“',
          b: `<p>Die Schrift sagt sowohl „Wer eine Frau gefunden hat, hat Gutes gefunden“<sup data-src="prov-18-22"></sup> als auch „Ich finde die Frau bitterer als den Tod“<sup data-src="eccl-7-26"></sup>. Der Unterschied liegt darin, wer schaut. Der Blick „ich finde“ ist subjektiv: Der Mensch sieht seine Frau durch sein eigenes „Ich“.</p><p>Der „Schwanz“ sucht in der Ehe die Befriedigung von Wünschen. Der „Parzuf“ sucht in der Frau eine Ergänzung zum eigenen Bild und Ansehen. In beiden Fällen sieht der Mensch nicht sie, sondern sich selbst.</p>`,
        },
        {
          h: 'Nur das Gute sehen',
          b: `<p>Das Ziel ist, von einer Beziehung „Rücken an Rücken“ zu einer Beziehung „von Angesicht zu Angesicht“ zu gelangen. Dann sieht der Mensch in seiner Frau sie selbst, ohne Masken und fremde Projektionen — und sieht in ihr das Gute.</p><p>Daher die Zahlen: „Frau“ ist 18-mal „Gutes“, „Leben aus dem Guten“. Das Wort „und Er baute“, mit dem die Frau erschaffen wurde<sup data-src="gen-2-21"></sup>, ist viermal „Gutes“.</p>`,
        },
        {
          h: 'Sukkot: von Angesicht zu Angesicht',
          b: `<p>Das Wort „und Er baute“ ist auch mit der Sukka verbunden. An Sukkot stellt der Allmächtige den Menschen „von Angesicht zu Angesicht“ vor das, was vor ihm steht, und der Mensch wird gewürdigt, das wahre Gesicht zu sehen — das seiner Frau, sein eigenes und das des Schöpfers.</p>`,
        },
      ],
      reflection: 'Wenn ich einen nahen Menschen ansehe — sehe ich ihn oder mein eigenes Spiegelbild? Welches eine Gute werde ich heute an ihm bemerken?',
      takeaways: [
        'Der Streit verlagert sich in den Mann: Sieht er einen „Schwanz“, betrachtet er seine Frau durch die Begierde; sieht er einen „Parzuf“, als Teil seiner Ehre.',
        '„Ich finde“ ist der Blick durch das eigene „Ich“; „eine Frau gefunden“ ist die Begegnung von Angesicht zu Angesicht, ohne Masken. Dann gilt: „Wer eine Frau gefunden hat, hat Gutes gefunden.“',
        'אשה (306) = 18 × טוב (17), und 18 = חי — „Leben aus dem Guten“; ויבן (68) = 4 × טוב.',
        'An Sukkot stellt der Allmächtige den Menschen von Angesicht zu Angesicht — vor seine Frau, vor sich selbst und vor den Schöpfer.',
      ],
      puzzle: {
        q: 'Setze den Weg in der Ehe zusammen: vom Blick durch sich selbst zum Guten.',
        pieces: ['„Ich finde“ — Blick durch das eigene „Ich“', 'Begegnung von Angesicht zu Angesicht', '„Eine Frau gefunden — Gutes gefunden“', 'אשה = 18 × טוב: Leben aus dem Guten'],
        meaning: 'Solange ein Mann seine Frau durch sein „Ich“ sieht, sieht er sich selbst. Von Angesicht zu Angesicht findet er sie — und das Gute: אשה = 18 × טוב.',
      },
    },
  ],
  final: {
    title: 'Tikkun vollendet',
    allSolved:
      'Alle vier Rätsel sind gelöst. Gesicht und Schwanz, Hochmut und Leidenschaft sind im Gebet verbunden und vor den Augen von ganz Israel offenbart.',
  },
  puzzle: {
    q: 'Setze den Weg der ganzen Lektion zusammen — von den Wurzeln des Unterbewussten zur Begegnung von Angesicht zu Angesicht.',
    pieces: ['Hochmut und Begierde — ein Feuer', 'Das Gebet verbindet beide Seiten', 'Drei Gesichter Mosches — vor ganz Israel', 'Mann und Frau — von Angesicht zu Angesicht'],
    meaning: 'Gesicht und Schwanz, Hochmut und Leidenschaft werden im Gebet verbunden, vor den Augen von ganz Israel offenbart und begegnen einander von Angesicht zu Angesicht.',
  },
  practice:
    'Frage dich diese Woche vor dem Gebet: Was ist gerade stärker in mir — der Wunsch, gut dazustehen, oder der Wunsch, zu bekommen? Und sieh einmal am Tag einen nahen Menschen „von Angesicht zu Angesicht“ an: Sprich laut ein Gutes aus, das du in ihm siehst.',
  highlight: 'Hochmut und Begierde wiegen gleich viel: Beide sind Feuer (אש = 471).',
  share: ({ score, max, time, grid, allSolved, site }) => `🔥 Was haben Hochmut und Begierde gemeinsam?
Die Antwort steckt in einer einzigen Zahl.

Ich suche sie in einem Gematria-Spiel nach der Lektion von Rabbiner Jizchak Ginsburgh „Tikkun Parzuf-Sanaw“. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bisher:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: über Hochmut und Leidenschaft, über das Gebet, über die Maske und das wahre Gesicht — und über Mann und Frau, die sich von Angesicht zu Angesicht begegnen. Schaffst du es besser?
Spiel mit 👉 ${site}

©pnimi.org.il ©mychitas.app`,
  source: 'Nach der Lektion „Tikkun Parzuf-Sanaw“, Broschüre „Niflaot“, Bereschit ה׳תשפ״ז (Gal Einai). Vollständiger hebräischer Text: pnimi.org.il',
};

export default de;
