import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Für immer erwählt',
  hero: {
    heading: 'Warum endet die Haftara mit „<i>Es lebe König David für immer</i>“?',
    author: 'nach einer Rede des Lubawitscher Rebben · Likkutej Sichot, Bd. 25, Chaje Sara',
    intro:
      'Im Wochenabschnitt ist Awraham „alt und hochbetagt“ und wählt seinen Erben — Jizchak. In der Haftara ist auch König David alt geworden und wählt seinen Erben — Schlomo. Aber die Haftara hört bei Davids Schwur auf. Sie erzählt nicht, wie Schlomo zum König gesalbt wurde. Warum? Ermittle zusammen mit dem Rebben — vom Streit zwischen Raschi und dem Rambam bis zu einer Wahl, die sich nie ändert.',
  },
  summary:
    'Die Haftara von Chaje Sara erzählt vom alten König David und seinem Erben Schlomo — so wie der Wochenabschnitt vom alten Awraham und Jizchak. Warum endet sie dann mit dem Schwur „Es lebe mein Herr, König David, für immer“ und schweigt über Schlomos Salbung? Der Rebbe erklärt: Das Königtum des Hauses David ist ewig. G-tt hat es erwählt, und Seine Wahl ändert sich nie — wie die Wahl von Awraham und Jizchak. Und die Wahl der Väter wurde vollendet in den Königen aus dem Haus David: Sie machten Israel zu einem Volk und bauten den Beit HaMikdasch.',
  glossary: {},
  riddles: [
    {
      title: 'Die Haftara — ein Spiegel des Abschnitts',
      cond: `<p>Eine Haftara soll „zum Thema des Wochenabschnitts“ passen — und sogar seinem Ende ähneln. Die Haftara von Chaje Sara beginnt so:</p><p class="verse" dir="rtl" lang="he">והמלך דוד זקן בא בימים</p><p>„König David war alt und hochbetagt.“<sup data-src="kings1-1-1"></sup> Und im Abschnitt: „Awraham war alt und hochbetagt.“<sup data-src="gen-24-1"></sup></p><p>Nicht nur die Worte sind ähnlich. Finde, was der Abschnitt und die Haftara noch gemeinsam haben — und was in der Haftara zu fehlen scheint.</p>`,
      steps: [
        {
          q: 'Wer ist in der Haftara „alt und hochbetagt“, so wie Awraham im Abschnitt?',
          hint: 'Der erste Vers der Haftara.',
          opts: ['„König David“', '„Schlomo“', '„der Prophet Natan“', '„Adonijahu“'],
        },
        {
          q: 'Welcher Sohn Davids wurde hochmütig und sagte: „Ich werde König sein“?',
          hint: 'Der ältere der beiden Brüder in der Haftara.',
          opts: ['„Adonijahu“', '„Schlomo“', '„Awschalom“', '„Amnon“'],
        },
        {
          q: 'Und wer stritt im Abschnitt mit seinem Bruder: „Ich bin größer als du“?',
          hint: 'Awrahams älterer Sohn.',
          opts: ['„Jischmael“', '„Jizchak“', '„Esaw“', '„Elieser“'],
        },
        {
          q: 'Wem gab Awraham „alles, was er hatte“?',
          hint: 'Die Söhne der Nebenfrauen schickte er mit Geschenken weg.',
          opts: ['„Jizchak“', '„Jischmael“', '„den Söhnen der Nebenfrauen“', '„Elieser“'],
        },
        {
          q: 'Was haben David und Awraham gemeinsam, als sie einen Erben wählen?',
          hint: 'Schlomo ist jünger als Adonijahu, Jizchak jünger als Jischmael.',
          opts: ['„der jüngere Sohn wird gewählt“', '„der ältere Sohn wird gewählt“', '„der Stärkste wird gewählt“', '„es wird gelost“'],
        },
        {
          q: 'Der Abschnitt erzählt auch, was nach Awrahams Tod geschah: „G-tt segnete Jizchak.“ Was würdest du dann auch in der Haftara erwarten — aber es fehlt?',
          hint: 'Wie endet die Geschichte von Schlomo in diesem Kapitel von Melachim?',
          opts: ['„Schlomos Salbung und ‚Schlomo setzte sich auf den Thron‘“', '„Davids Tod“', '„Adonijahus Herrschaft“', '„den Bau des Beit HaMikdasch“'],
        },
      ],
      reveal: {
        h: 'Warum hört die Haftara auf?',
        p: 'Die Haftara ist ein Spiegel des Abschnitts. David ist wie Awraham „alt und hochbetagt“. David hat zwei Söhne, Adonijahu und Schlomo; Awraham hat Jischmael und Jizchak. Der Ältere erhebt Anspruch („Ich werde König sein“, „Ich bin größer als du“), aber der Jüngere wird gewählt: David schwört, dass „Schlomo, dein Sohn, nach mir König sein wird“. Awraham gibt „alles, was er hatte“, Jizchak. Doch der Abschnitt geht weiter — nach Awrahams Tod segnet G-tt Jizchak. Warum liest man dann in der Haftara nicht weiter — wie Schlomo gesalbt wurde und „sich auf den Königsthron setzte“?',
      },
      lessons: [
        {
          h: 'Eine Haftara zum Thema des Abschnitts',
          b: `<p>Das Gesetz sagt: Die Haftara eines Wochenabschnitts soll „zum Thema des Abschnitts“ passen. Und mehr noch: Sie soll dem Ende des Abschnitts ähneln.</p><p>Die einfache Verbindung zwischen unserem Abschnitt, Chaje Sara, und seiner Haftara: Die Haftara erzählt, was David erlebte und tat, als er „alt und hochbetagt“ war.<sup data-src="kings1-1-1"></sup> So handelt auch der größte Teil des Abschnitts von der Zeit, als „Awraham alt und hochbetagt war“.<sup data-src="gen-24-1"></sup></p><p>Aber die Ähnlichkeit liegt nicht nur darin, dass es geschah, als Awraham und David „alt und hochbetagt“ waren. Sie liegt auch im Inhalt selbst.</p>`,
        },
        {
          h: 'Zwei Söhne Davids — zwei Söhne Awrahams',
          b: `<p>Die Haftara erzählt von Davids zwei Söhnen, Adonijahu und Schlomo. Adonijahu „wurde hochmütig und sagte: Ich werde König sein“.<sup data-src="kings1-1-5"></sup> Und am Ende schwor David Bat-Scheva: Sein früherer Schwur — „Schlomo, dein Sohn, wird nach mir König sein, und er wird an meiner Stelle auf meinem Thron sitzen“ — „so werde ich es heute tun“.<sup data-src="kings1-1-30"></sup></p><p>Das ähnelt dem, was im Abschnitt zwischen Awrahams zwei Söhnen geschah, Jizchak und Jischmael. Jischmael behauptete: „Ich bin größer (beliebter) als Jizchak.“<sup data-src="sanhedrin-89b"></sup> Und trotzdem machte Awraham Jizchak zu seinem Erben. Er sorgte auch dafür, dass Jizchak heiratet, und „Awraham gab alles, was er hatte, Jizchak“. Aber „den Söhnen der Nebenfrauen … gab Awraham Geschenke und schickte sie weg von seinem Sohn Jizchak, als er noch lebte“.<sup data-src="gen-25-5"></sup> Auch über die Söhne Jischmaels heißt es am Ende des Abschnitts: „Das sind ihre Namen nach ihren Dörfern und Lagern — zwölf Fürsten ihrer Völker.“ Die Verbindung zwischen ihnen und Awraham war abgeschnitten (so wie bei Jischmael selbst: „Vertreibe …“).</p>`,
        },
        {
          h: 'Der Jüngere wird gewählt',
          b: `<p>Man kann es auch ein wenig anders sagen: David wählte seinen jüngeren Sohn statt des älteren, damit der Jüngere Davids Königtum fortsetzt. Genauso wurde bei Awraham sein jüngerer Sohn Jizchak gewählt, um das Haus Awrahams fortzusetzen.<sup data-src="gen-25-5"></sup></p><p>Den anderen Kindern wurde dieses Recht genommen — sogar der Familie des älteren Sohnes, Jischmael. Sie wohnten „in ihren Dörfern und Lagern, zwölf Fürsten ihrer Völker … von Chawila bis Schur“ — ohne Verbindung zu Awraham.</p>`,
        },
        {
          h: 'Was fehlt',
          b: `<p>Aber die Sache ist noch nicht ganz „glatt“. Der Abschnitt erzählt auch von der Zeit nach Awrahams Tod: „Nach Awrahams Tod segnete G-tt seinen Sohn Jizchak …“<sup data-src="gen-25-11"></sup> Warum beendet man dann die Haftara nicht auch mit den nächsten Versen — wie Schlomo gesalbt wurde und „Schlomo schon auf dem Königsthron sitzt“?<sup data-src="kings1-1-46"></sup></p>`,
        },
      ],
      reflection: 'Wähle ich manchmal nicht das, was lauter und stärker ist, sondern das, was richtig ist?',
      takeaways: [
        'Eine Haftara soll „zum Thema des Abschnitts“ passen und seinem Ende ähneln.',
        'David war wie Awraham „alt und hochbetagt“.',
        'Adonijahu: „Ich werde König sein“; Jischmael: „Ich bin größer als du.“',
        'Der Jüngere wird gewählt: Schlomo ist Davids Erbe, Jizchak ist Awrahams Erbe.',
        'Die Frage: Der Abschnitt erzählt auch, was nach Awraham kam — warum schweigt die Haftara über Schlomos Salbung?',
      ],
      puzzle: {
        q: 'Ordne die Ermittlung: von der Regel der Haftara — zur Frage des Rebben.',
        pieces: ['Haftara zum Thema des Abschnitts', 'David wurde alt wie Awraham', 'Zwei Söhne — der Ältere will', 'Der Jüngere wird gewählt', 'Warum keine Salbung Schlomos?'],
        meaning: 'Die Haftara wiederholt den Abschnitt: ein alter Vater, zwei Söhne, der Jüngere wird gewählt. Aber das Ende — wie Schlomo sich auf den Thron setzte — fehlt.',
      },
    },
    {
      title: 'Gesalbt wegen eines Streits',
      cond: `<p>Die Gemara lehrt: „Einen König, der Sohn eines Königs ist, salbt man nicht. Und wenn du fragst: Warum hat man dann Schlomo gesalbt? — Wegen des Streits mit Adonijahu.“<sup data-src="horayot-11b"></sup> Der Sohn eines Königs bekommt das Königtum also normalerweise als Erbe. Was ändert ein Streit?</p><p>Raschi und der Rambam erklären das verschieden — und davon hängt ab, wo die Haftara endet. Nach dem Brauch des Rambam ist ihr letzter Vers:</p><p class="verse" dir="rtl" lang="he">יחי אדני המלך דוד לעלם</p><p>„Es lebe mein Herr, König David, für immer!“<sup data-src="kings1-1-30"></sup></p>`,
      steps: [
        {
          q: 'Was sagt die Gemara über einen König, der Sohn eines Königs ist?',
          hint: 'Das Königtum ist ein Erbe.',
          opts: ['„man salbt ihn nicht“', '„man salbt jeden König“', '„man salbt nur den Erstgeborenen“', '„man salbt ihn nur in Jeruschalajim“'],
        },
        {
          q: 'Warum hat man Schlomo dann gesalbt?',
          hint: 'Sein Bruder sagte: „Ich werde König sein.“',
          opts: ['„wegen des Streits mit Adonijahu“', '„weil er der Jüngere war“', '„wegen Davids Tod“', '„wegen eines Krieges mit den Pelischtim“'],
        },
        {
          q: 'Wie erklärt Raschi: Was geschieht mit dem Königtum, wenn es Streit gibt?',
          hint: 'Eine Salbung „von Anfang an“.',
          opts: ['„es ist kein Erbe mehr — man muss neu salben“', '„das Erbe bleibt, die Salbung beendet nur den Streit“', '„man braucht keine Salbung“', '„der König wählt, wen er will“'],
        },
        {
          q: 'Und nach dem Rambam: Warum salbt man den Sohn eines Königs, wenn es Streit gab?',
          hint: 'Das Erbe wird nicht aufgehoben.',
          opts: ['„um den Streit zu beenden“', '„um ein neues Königtum zu schaffen“', '„damit er seinen Vater beerbt“', '„um das Volk zu erfreuen“'],
        },
        {
          q: 'Mit welchem Vers endet die Haftara nach dem Brauch des Rambam?',
          hint: 'Bat-Schevas Worte nach Davids Schwur.',
          opts: ['„‚Es lebe mein Herr, König David, für immer!‘“', '„‚Und Schlomo sitzt schon auf dem Königsthron‘“', '„‚Und Schlomo saß auf dem Thron seines Vaters David‘“', '„‚König David war alt‘“'],
        },
        {
          q: 'Andere Bräuche lesen weiter — auch von Schlomos Salbung. Nach wessen Meinung?',
          hint: 'Bei wem ist das Königtum bei Streit kein Erbe mehr?',
          opts: ['„nach Raschis Meinung“', '„nach der Meinung des Rambam“', '„nach dem Brauch von Jeruschalajim“', '„nach keiner — einfach so“'],
        },
      ],
      reveal: {
        h: 'Der Schwur hat schon entschieden',
        p: 'Nach Raschi hört das Königtum bei Streit auf, ein Erbe zu sein. Die Salbung ist dann so, als ob man einen neuen König einsetzt. Schlomo wurde also erst durch die Salbung König — darum lesen viele Gemeinden auch davon in der Haftara. Nach dem Rambam wird das Erbe nicht aufgehoben und nicht einmal verändert: Die Salbung „beendet nur den Streit“. Schlomos Königtum entschied Davids Schwur: „So werde ich es heute tun.“ Darum endet die Haftara nach dem Brauch des Rambam mit „Es lebe mein Herr, König David, für immer!“ und erwähnt die Salbung nicht. Aber die Frage bleibt: Der Abschnitt erzählt ja auch von Jizchaks Stellung nach Awrahams Tod — der „Herr der Segnungen“ selbst kam und segnete ihn.',
      },
      lessons: [
        {
          h: 'Die Gemara: Den Sohn eines Königs salbt man nicht',
          b: `<p>Auf den ersten Blick könnte man sagen: Dass die Haftara die Fortsetzung — die Verse über Schlomos Salbung — nicht enthält, folgt aus der Meinung des Rambam: was die Salbung eines „Königs, der Sohn eines Königs ist“, bedeutet, und auch die Salbung Schlomos.</p><p>Die Gemara sagt: „Einen König, der Sohn eines Königs ist, salbt man nicht. Und wenn du fragst: Warum hat man dann Schlomo gesalbt? — Wegen des Streits mit Adonijahu.“ Und die Gemara fragt weiter: „Woher wissen wir, dass man bei einem Streit eine Salbung braucht und dass nicht jeder König, wann er will, das Königtum seinem Sohn vererbt? Rav Papa sagte: Der Vers sagt: ‚Er und seine Söhne inmitten Israels‘ — wenn in Israel Frieden ist.“<sup data-src="horayot-11b"></sup></p><p>Raschi erklärt: „Wenn in Israel Frieden ist, ist das Königtum ein Erbe, und man braucht keine Salbung. Aber wenn es Streit gibt, ist es kein Erbe, und man braucht eine Salbung von Anfang an.“</p>`,
        },
        {
          h: 'Raschi und der Rambam',
          b: `<p>Der Rambam aber entscheidet: „Und man salbt keinen König, der Sohn eines Königs ist, denn das Königtum ist ein Erbe für den König für immer … Gab es aber einen Streit, salbt man ihn, um den Streit zu beenden und allen bekannt zu machen, dass er allein der König ist — so wie man Schlomo wegen des Streits mit Adonijahu salbte …“<sup data-src="rambam-vessels-1-11"></sup></p><p>Spätere Gelehrte erklären den Streit zwischen Raschi und dem Rambam. Nach Raschi hört das Königtum bei Streit auf, ein Erbe zu sein. Dann ist die Salbung so, als ob man einen neuen König einsetzt. Nach dem Rambam wird das Erbe des Königtums nicht aufgehoben und nicht einmal verändert. Die Salbung ist nur da, um „den Streit zu beenden“ — ein Hindernis wegzuräumen.</p>`,
        },
        {
          h: 'Warum die Haftara mit dem Schwur endet',
          b: `<p>So kann man den Brauch des Rambam erklären — und noch besser verstehen: Er beendet die Haftara mit dem Vers „Es lebe mein Herr, König David, für immer!“ und erwähnt Schlomos Salbung gar nicht.<sup data-src="kings1-1-30"></sup> Denn nach seiner Meinung schafft die Salbung eines Königssohnes das Königtum nicht. Sie ist nur da, um „den Streit zu beenden“. Darum hängt man die Geschichte von Schlomos Salbung nicht an die Haftara an. Davids Schwur hat schon endgültig entschieden, wer König wird: „Wie ich dir beim Ewigen, dem G-tt Israels, geschworen habe: Schlomo, dein Sohn, wird nach mir König sein, und er wird an meiner Stelle auf meinem Thron sitzen — so werde ich es heute tun.“</p>`,
        },
        {
          h: 'Die anderen Bräuche — nach Raschi',
          b: `<p>Andere Bräuche lesen in der Haftara weiter — wie David befahl, Schlomo zu salben, bis zur Salbung selbst. Und der Abudraham meint sogar, man liest bis nach Davids Tod: „Und Schlomo saß auf dem Thron seines Vaters David, und sein Königtum wurde sehr fest.“<sup data-src="kings1-2-12"></sup> Diese Bräuche folgen Raschis Meinung. Nach Raschi ist das Königtum bei Streit kein Erbe, und man braucht eine neue Salbung: Durch die Salbung setzt man einen neuen König ein. Darum wurde auch Schlomo erst durch seine Salbung König.</p>`,
        },
        {
          h: 'Die Frage bleibt',
          b: `<p>Aber auch das ist noch nicht ganz „glatt“. Der Abschnitt erzählt nicht nur, wie Awraham die Söhne der Nebenfrauen wegschickte und Jizchak wählte. Er erzählt auch von Jizchaks Stellung und Größe nach Awrahams Tod: „Nach Awrahams Tod segnete G-tt Jizchak …“ — neu.<sup data-src="gen-25-11"></sup> Mit Raschis Worten: „Der Herr der Segnungen“ — der Heilige, gelobt sei Er, selbst — „kam und segnete ihn.“<sup data-src="rashi-25-11"></sup></p><p>Wenn das so ist, würde es passen, auch in der Haftara zu lesen, wie Schlomos Ernennung (durch die Salbung) vollendet wurde und wie er wirklich König wurde — umso mehr, weil das noch zu Davids Lebzeiten geschah.</p>`,
        },
      ],
      reflection: 'Wenn ich etwas versprochen habe — halte ich mein Wort so fest wie David seinen Schwur?',
      takeaways: [
        'Die Gemara: Den Sohn eines Königs salbt man nicht; Schlomo wurde wegen des Streits mit Adonijahu gesalbt.',
        'Raschi: Bei Streit ist das Königtum kein Erbe mehr; die Salbung setzt einen neuen König ein.',
        'Der Rambam: Das Erbe bleibt; die Salbung beendet nur den Streit.',
        'Darum endet die Haftara nach dem Brauch des Rambam mit dem Schwur: „Es lebe mein Herr, König David, für immer!“',
        'Aber die Frage bleibt: Der Abschnitt spricht auch von Jizchak nach Awraham — G-tt selbst segnete ihn.',
      ],
      puzzle: {
        q: 'Ordne die Erklärung: von der Gemara — zum Ende der Haftara.',
        pieces: ['Königssohn wird nicht gesalbt', 'Schlomo gesalbt wegen Streit', 'Rambam: nur Streit beenden', 'Davids Schwur entschied', 'Die Haftara endet mit dem Schwur'],
        meaning: 'Für den Rambam hat Schlomos Salbung nichts geschaffen — Davids Schwur entschied über das Königtum; darum endet die Haftara dort.',
      },
    },
    {
      title: 'Ein Horn, kein Krug',
      cond: `<p>Chana prophezeite: „Erhoben ist mein Horn durch den Ewigen.“<sup data-src="samuel1-2-1"></sup> Die Gemara erklärt:</p><p class="verse" dir="rtl" lang="he">רמה קרני ולא רמה פכי</p><p>„‚Erhoben ist mein Horn‘ — und nicht ‚erhoben ist mein Krug‘: David und Schlomo wurden aus einem Horn gesalbt — ihr Königtum ging weiter. Schaul und Jehu wurden aus einem Krug gesalbt — ihr Königtum ging nicht weiter.“<sup data-src="megillah-14a-2"></sup></p><p>Aber nach dem Rambam gehörte das Königtum, sobald David gesalbt war, ihm und seinen Söhnen für immer.<sup data-src="rambam-kings-1-7"></sup> Warum nennt man dann Schlomo extra, als wäre es ein neues Königtum?</p>`,
      steps: [
        {
          q: 'Wessen Königtum ging nach der Gemara weiter — wer wurde aus einem Horn gesalbt?',
          hint: 'Vater und Sohn aus unserer Haftara.',
          opts: ['„David und Schlomo“', '„Schaul und Jehu“', '„David und Schaul“', '„Schlomo und Jehu“'],
        },
        {
          q: 'Welchen Grund für die Salbung bei Streit nennt der Rambam in den „Gesetzen der Tempelgeräte“ zusätzlich — aber nicht in den „Gesetzen der Könige“?',
          hint: 'Nicht nur den Streit beenden, sondern auch …',
          opts: ['„allen bekannt machen, dass er allein der König ist“', '„das Volk erfreuen“', '„das Öl sparen“', '„ihm Tora beibringen“'],
        },
        {
          q: 'Wen salbt man mit dem Salböl, das Mosche gemacht hat?',
          hint: 'Von den Königen — nur eine Familie.',
          opts: ['„nur die Könige aus dem Haus David“', '„alle Könige Israels“', '„Könige und Propheten“', '„nur Schlomo“'],
        },
        {
          q: 'Und womit salbt man Könige aus den anderen Stämmen?',
          hint: 'So salbte Elischa Jehu.',
          opts: ['„mit Balsamöl“', '„mit dem Salböl“', '„mit Wein“', '„mit Quellwasser“'],
        },
        {
          q: '„Ein heiliges Salböl soll dies Mir sein …“ — wie lange?',
          hint: 'Dasselbe Öl reicht sogar für die kommende Zeit.',
          opts: ['„für eure Generationen“', '„für ein Jahr“', '„nur in der Wüste“', '„bis man ins Land kommt“'],
        },
        {
          q: 'Was bedeutet „er allein ist der König“ bei den Königen aus dem Haus David?',
          hint: 'Nicht nur „er, und nicht sein Bruder“.',
          opts: ['„er ist immer König — auch wenn es einen König aus anderen Stämmen gibt“', '„er ist König statt des Bruders, der stritt“', '„er hat keine Söhne“', '„er regiert ohne Berater“'],
        },
      ],
      reveal: {
        h: 'Öl für alle Generationen',
        p: 'Die Könige aus dem Haus David werden mit dem Öl gesalbt, das Mosche gemacht hat — „für eure Generationen“: Es bleibt für immer. Darum schuf Davids Salbung die Ewigkeit seines Königtums — „dein Thron wird fest sein für immer“. Ein Sohn ohne Streit braucht keine Salbung: Die Salbung des Vaters wirkt auch in ihm. Gibt es aber Streit, sieht man die Ewigkeit des Königtums beim Sohn nicht. Dann salbt man ihn aus zwei Gründen: um den Streit zu beenden — das gilt auch für Könige aus anderen Stämmen (sie werden mit Balsamöl gesalbt) — und „um allen bekannt zu machen, dass er allein der König ist“. Das gilt nur für die Könige aus dem Haus David. Das eigentliche Königtum gehört immer David und seinen Söhnen. Darum steht dieser Grund bei den Gesetzen über das Salböl und nicht in den allgemeinen „Gesetzen der Könige“.',
      },
      lessons: [
        {
          h: 'Horn und Krug',
          b: `<p>Das wird klar, wenn wir zuerst genauer erklären, was Schlomos Salbung war.</p><p>Die Gemara sagt über Chanas Prophezeiung „Erhoben ist mein Horn durch den Ewigen“:<sup data-src="samuel1-2-1"></sup> „‚Erhoben ist mein Horn‘ — und nicht ‚erhoben ist mein Krug‘: David und Schlomo wurden aus einem Horn gesalbt — ihr Königtum ging weiter. Schaul und Jehu wurden aus einem Krug gesalbt — ihr Königtum ging nicht weiter.“<sup data-src="megillah-14a-2"></sup></p><p>Auf den ersten Blick versteht man das nicht. Der Rambam entscheidet doch: „Sobald David gesalbt war, bekam er die Krone des Königtums. Das Königtum gehört ihm und seinen männlichen Söhnen für immer, denn es heißt: ‚Dein Thron wird fest sein für immer.‘“<sup data-src="rambam-kings-1-7"></sup><sup data-src="samuel2-7-16"></sup> Schlomos Königtum war also die Fortsetzung („sein Königtum ging weiter“) von Davids Königtum. Was bedeutet dann „David und Schlomo wurden aus einem Horn gesalbt — ihr Königtum ging weiter“? Es klingt, als wäre jeder von ihnen ein eigenes Königtum und als wäre Schlomos Königtum der Anfang eines neuen (wie bei Schaul und Jehu: Jeder von ihnen war ein König am Anfang, nicht der Sohn eines Königs). Aber Schlomos Königtum galt sofort, „sobald David gesalbt war“ — da bekam er „die Krone des Königtums … für immer“. Und Schlomos Salbung war nur da, „um den Streit zu beenden und allen bekannt zu machen, dass er allein der König ist“.</p>`,
        },
        {
          h: 'Zwei Gesetze — in zwei Büchern',
          b: `<p>Noch etwas muss man verstehen. Das Gesetz „einen König, der Sohn eines Königs ist, salbt man nicht“ bringt der Rambam zweimal: in den „Gesetzen der Tempelgeräte“ und in den „Gesetzen der Könige“. In den „Gesetzen der Tempelgeräte“ schreibt er, wie oben zitiert: „um den Streit zu beenden und allen bekannt zu machen, dass er allein der König ist — so wie man Schlomo wegen des Streits mit Adonijahu salbte, Joasch wegen Atalja und Jehoachas wegen Jehojakim, seines Bruders“.<sup data-src="rambam-vessels-1-11"></sup> In den „Gesetzen der Könige“ sagt er aber nur „um den Streit zu beenden“. Er fügt nicht hinzu: „und allen bekannt zu machen, dass er allein der König ist“.</p><p>Auf den ersten Blick: Der Rambam verlässt sich gewöhnlich auf das, was er früher in seinem Buch geschrieben hat. Die „Gesetze der Tempelgeräte“ kommen vor den „Gesetzen der Könige“ — er muss es nicht wiederholen. Aber die Frage ist eine andere: Ein Thema, das direkt die Könige betrifft — eine genaue Erklärung der Gesetze über Könige und ihre Salbung —, gehört vor allem in die „Gesetze der Könige“. Es gehört nicht zu den Gesetzen über das Salböl, wo die Salbung eines Königs nur nebenbei erwähnt wird. Wenn das so ist, müsste der Grund des Gesetzes — und besonders der zusätzliche Grund „allen bekannt zu machen, dass er allein der König ist“ — doch nur in den „Gesetzen der Könige“ stehen?</p>`,
        },
        {
          h: 'Könige aus dem Haus David und Könige aus anderen Stämmen',
          b: `<p>Der Kern der Erklärung: Der Grund, den der Rambam nennt — „allen bekannt zu machen, dass er allein der König ist“ —, betrifft vor allem die Könige aus dem Haus David. In den „Gesetzen der Tempelgeräte“ ist die Salbung eines Königs eine Einzelheit der Gesetze über das Salböl. Und von den Königen salbt man mit dem Salböl nur „die Könige aus dem Haus David“.<sup data-src="rambam-vessels-1-7"></sup> Darum schreibt er dort, dass man einen Königssohn auch salbt, „um allen bekannt zu machen, dass er allein der König ist“.</p><p>In den „Gesetzen der Könige“ geht es um Könige allgemein. Dort steht neben dem Gesetz „sobald David gesalbt war, bekam er die Krone des Königtums“ auch ein anderes: „Ein Prophet, der einen König aus den anderen Stämmen Israels eingesetzt hat, und dieser König geht den Weg der Tora und der Mizwa und führt die Kriege des Ewigen — der ist ein König, und alle Gebote des Königtums gelten für ihn … Denn Achija aus Schilo setzte Jarowam ein und sagte zu ihm: ‚… dann werde Ich dir ein festes Haus bauen, wie Ich es David gebaut habe.‘“<sup data-src="rambam-kings-1-8"></sup> (Er fügt nur hinzu, dass man die Könige Israels nicht mit dem Salböl salbt, sondern mit Balsamöl.) Darum nennt er dort beim Gesetz „einen Königssohn salbt man nicht, außer es gab Streit oder Krieg“ den Grund „um den Streit zu beenden“. Dieser Grund gilt auch für die Könige Israels.</p>`,
        },
        {
          h: 'Das eigentliche Königtum gehört David',
          b: `<p>Die Erklärung dazu: Nach dem Rambam gilt auch, nachdem David die Krone des Königtums bekam: „Ein Prophet, der einen König aus den anderen Stämmen Israels eingesetzt hat — der ist ein König.“ Trotzdem gibt es einen grundsätzlichen Unterschied zwischen ihnen. Der Rambam schreibt weiter: „Die Könige aus dem Haus David sind die, die für immer bestehen, denn es heißt: ‚Dein Thron wird fest sein für immer.‘ Wenn aber ein König aus dem übrigen Israel aufsteht, hört das Königtum in seinem Haus auf.“<sup data-src="rambam-kings-1-9"></sup> Und selbst wenn es einen König aus den anderen Stämmen gibt, „gehört das eigentliche Königtum David“.<sup data-src="rambam-kings-1-8"></sup></p><p>Mehr noch: Der Rambam schreibt in seinem „Buch der Gebote“: „Das Königtum aber — du weißt schon aus den Büchern der Propheten, dass David es bekam. Und die Weisen sagten deutlich: Die Krone des Königtums bekam David. Und so seine Nachkommen nach ihm bis zum Ende aller Generationen: Es gibt keinen König für den, der an die Tora von Mosche, unserem Lehrer, glaubt, außer aus den Nachkommen Davids und aus den Nachkommen Schlomos. Und wer nicht aus diesen geehrten Nachkommen ist, heißt beim Königtum ‚fremd‘ — so wie jeder, der nicht von Aharon abstammt, beim Tempeldienst ‚fremd‘ heißt.“</p><p>Der Unterschied zwischen dem Königtum des Hauses David und den Königen Israels liegt also nicht nur in der Zeit — dass die Könige aus dem Haus David für immer bestehen und die Könige Israels nicht. Er liegt im Wesen des Königtums selbst: Die Krone des Königtums bekam David. Das Wesen des Königtums ist immer nur bei David und seinen Söhnen. Es kann sein, dass „auf G-ttes Befehl“ ein einzelner König aus den anderen Stämmen eingesetzt wird. Aber das ist nicht „das eigentliche Königtum“. Darum heißt [ein anderer] beim Königtum Davids „fremd“, wie es in der Mechilta heißt: „Als David erwählt wurde, schieden alle [anderen in] Israel aus.“</p>`,
        },
        {
          h: 'Das Salböl — „für eure Generationen“',
          b: `<p>Man kann sagen: Darum salbte man nur die Könige aus dem Haus David mit dem Salböl. Das versteht man auch aus den einfachen Worten des Rambam: „Sobald David gesalbt war, bekam er die Krone des Königtums. Das Königtum gehört ihm und seinen männlichen Söhnen für immer.“<sup data-src="rambam-kings-1-7"></sup> Die Salbung mit dem Salböl war bei David nicht nur noch eine Einzelheit, als er König wurde. Sie bewirkte, dass Davids Königtum fest und ewig ist, „für immer“.</p><p>Der Grund: Das Salböl ist das Öl, das Mosche gemacht hat, so dass „dies Mir für eure Generationen sein soll“,<sup data-src="ex-30-31"></sup> und „das ganze Öl bleibt für die kommende Zeit“.<sup data-src="horayot-11b"></sup> Wie der Rambam in den „Gesetzen der Tempelgeräte“ sagt: „Man bewahrte es in einem Gefäß für die Generationen auf“, und „man hat nie anderes Öl gemacht als das, was Mosche gemacht hat“. Darum wirkt die Salbung mit dem Salböl auch „für eure Generationen“: Sie macht das Königtum fest und ewig — „die Könige aus dem Haus David sind die, die für immer bestehen“.</p>`,
        },
        {
          h: '„Er allein ist der König“',
          b: `<p>Darüber sagt der Rambam: „Man salbt keinen König, der Sohn eines Königs ist, denn das Königtum ist ein Erbe für den König für immer … Gab es aber einen Streit, salbt man ihn, um den Streit zu beenden und allen bekannt zu machen, dass er allein der König ist.“<sup data-src="rambam-vessels-1-11"></sup> Gibt es keinen Streit, braucht der Sohn des Königs keine Salbung: Die Salbung seines Vaters wirkt auch auf die Söhne, und sie sind wie ihr Vater. „Gab es aber einen Streit“, dann sieht und kennt man beim Sohn nicht, dass sein Königtum fest und ewig ist — das, was die Salbung mit dem Salböl bewirkt. Dann muss man ihn aus zwei Gründen salben: a) um den Streit zu beenden — das gilt nicht nur für die Könige aus dem Haus David, die man mit dem Salböl salbt, sondern auch für einen König aus anderen Stämmen, den man mit Balsamöl salbt; b) „um allen bekannt zu machen, dass er allein der König ist“ — das gibt es nur bei den Königen aus dem Haus David.</p><p>Das ist die Genauigkeit und die Ergänzung in den Worten des Rambam: „um allen bekannt zu machen, dass er allein der König ist“. Wozu sonst das Wort „allein“? Der Rambam meint nicht nur: Er ist der König und nicht der andere, der mit ihm stritt. Er meint: „Er allein ist der König“ — immer und in jeder Lage. Nicht nur so wie in den Tagen von David und Schlomo, sondern auch dann, wenn es einen König aus den anderen Stämmen gibt: Die Krone des Königtums bekamen gerade David und seine Nachkommen für immer. Darum sagt der Rambam das in den „Gesetzen der Tempelgeräte“. Es ist keine Einzelheit der Gesetze über den König (ein König kann auch nicht „allein“ sein), sondern der Gesetze über das Salböl: Es soll auch bei einem Königssohn (über den es Streit gab) das „er allein ist der König“ zeigen, das die Könige aus dem Haus David haben. Auch in ihm ist ihre Ewigkeit: Sie „bestehen für immer“.</p>`,
        },
      ],
      reflection: 'Was in mir ist „für immer“ — auch wenn sich ringsum alles ändert und streitet?',
      takeaways: [
        'Die Gemara: David und Schlomo wurden aus einem Horn gesalbt — ihr Königtum ging weiter; Schaul und Jehu — aus einem Krug.',
        'Mit Mosches Salböl salbt man nur die Könige aus dem Haus David; Könige aus anderen Stämmen — mit Balsamöl.',
        'Das Salböl gilt „für eure Generationen“: Es machte Davids Königtum ewig.',
        'Bei Streit salbt man den Königssohn: um den Streit zu beenden und „allen bekannt zu machen, dass er allein der König ist“.',
        '„Er allein“ — immer: Das eigentliche Königtum gehört David, auch wenn es einen König aus anderen Stämmen gibt.',
      ],
      puzzle: {
        q: 'Ordne die Erklärung des Rebben: vom Horn — zu „er allein ist der König“.',
        pieces: ['Aus dem Horn — es ging weiter', 'Mosches Öl — nur für Davids Haus', 'Das Öl — für die Generationen', 'Davids Könige bestehen ewig', 'Er allein ist der König'],
        meaning: 'Das Salböl ist ewig, und nur das Haus David wird damit gesalbt. Darum zeigt die Salbung bei Streit: Ein König aus dem Haus David ist der einzige — für immer.',
      },
    },
    {
      title: 'Für immer erwählt',
      cond: `<p>Warum sagt die Gemara dann „<b>David und Schlomo</b>“ — zusammen —, obwohl Schlomo ein König war, der Sohn eines Königs ist? Der Rambam schreibt in den dreizehn Grundsätzen des Glaubens: „Es gibt keinen König für Israel außer aus dem Haus David und aus den Nachkommen Schlomos.“</p><p>Über David und über Schlomo heißt es: „Er erwählte.“<sup data-src="ps-78-70"></sup> Über Schlomo:</p><p class="verse" dir="rtl" lang="he">ויבחר בשלמה בני לשבת על כסא מלכות ה׳ על ישראל</p><p>„… Er hat Schlomo, meinen Sohn, erwählt, auf dem Thron des Königtums des Ewigen über Israel zu sitzen.“<sup data-src="chron1-28-4"></sup> Und wie hängt das mit Awraham und Jizchak zusammen — und mit dem Ende der Haftara?</p>`,
      steps: [
        {
          q: 'Der Rambam: Es gibt keinen König für Israel außer aus dem Haus David und aus den Nachkommen …',
          hint: 'Davids Sohn aus unserer Haftara.',
          opts: ['„Schlomos“', '„Awschaloms“', '„Natans“', '„Adonijahus“'],
        },
        {
          q: 'Welche Prophezeiung über Schlomo bekam David?',
          hint: 'Darüber, dass sein Königtum ewig ist.',
          opts: ['„‚Ich werde den Thron seines Königtums über Israel festigen für immer‘“', '„‚er baute das Haus und vollendete es‘“', '„‚Schlomo liebte fremde Frauen‘“', '„‚Schlomo legte sich zu seinen Vätern‘“'],
        },
        {
          q: 'Auch wenn Davids Söhne die Tora verlassen — was hat G-tt versprochen?',
          hint: 'Tehillim 89.',
          opts: ['„‚Meine Güte nehme Ich nicht von ihm‘“', '„‚Ich reiße das Königreich weg‘“', '„‚Ich wähle einen anderen König‘“', '„‚Ich vergesse Meinen Bund‘“'],
        },
        {
          q: 'Welches Versprechen setzte das Haus Awrahams durch Jizchak fort?',
          hint: 'G-tt sagte es Awraham, als Sara verlangte, Jischmael zu vertreiben.',
          opts: ['„‚denn durch Jizchak sollen dir Nachkommen genannt werden‘“', '„‚vertreibe diese Magd und ihren Sohn‘“', '„‚Awraham war alt‘“', '„‚nimm doch deinen Sohn‘“'],
        },
        {
          q: 'Wann waren die Väter des Volkes vollständig — „Väter nennt man nur drei“?',
          hint: '„Durch Jizchak“ — und nicht ganz Jizchak.',
          opts: ['„mit der Geburt Jaakows“', '„mit Awrahams Tod“', '„mit Jizchaks Hochzeit“', '„mit Jischmaels Geburt“'],
        },
        {
          q: 'Wann ist ein Volk ein vollständiges Volk?',
          hint: 'Das Gebot, einen König einzusetzen, „der unser ganzes Volk sammelt“.',
          opts: ['„wenn es eins und vereint ist — durch einen König“', '„wenn es sehr viele sind“', '„wenn es reich ist“', '„wenn jeder für sich ist“'],
        },
      ],
      reveal: {
        h: 'Eine Wahl, die sich nie ändert',
        p: 'Dass Davids Königtum ewig ist, wurde gerade über Schlomo gesagt: „Ich werde den Thron seines Königtums über Israel festigen für immer.“ Und Schlomo wurde erwählt, wie David — darum nennt die Gemara sie zusammen. Davids Krone ist mit G-ttes Wahl verbunden, und in Seiner Wahl gibt es keinen echten Bruch und keine Änderung: „Es lebe mein Herr, König David, für immer“ — selbst wenn seine Söhne sich nicht richtig verhalten: „Meine Güte nehme Ich nicht von ihm.“ So ist auch die Wahl Awrahams: „Du hast Awram erwählt“ — für immer. Sie ging weiter durch „denn durch Jizchak sollen dir Nachkommen genannt werden“. Aber in unserem Abschnitt sind die Väter noch nicht vollständig — erst, wenn Jaakow geboren wird. Darum hört auch die Haftara beim Schwur auf. Und vollendet wurde die Wahl der Väter in den Königen aus dem Haus David: Ein König macht Israel zu einem Volk, und David und Schlomo bauten den Beit HaMikdasch — die Wohnung der Schechina, die für immer im Volk Israel bleibt.',
      },
      lessons: [
        {
          h: 'Warum „David und Schlomo“',
          b: `<p>So kann man erklären, warum die Gemara ausdrücklich sagt: „David und Schlomo wurden aus einem Horn gesalbt — ihr Königtum ging weiter“,<sup data-src="megillah-14a-2"></sup> obwohl Schlomo ein König war, der Sohn eines Königs ist, und nur gesalbt wurde, „um den Streit zu beenden“.</p><p>Es stimmt: „Sobald David gesalbt war, bekam er die Krone des Königtums.“<sup data-src="rambam-kings-1-7"></sup> Aber die Fortsetzung und das Wichtigste im Königtum kommen gerade durch Schlomo. Der Rambam sagt im „Buch der Gebote“, wie oben zitiert: „Es gibt keinen König für den, der an die Tora von Mosche glaubt, außer aus den Nachkommen Davids und aus den Nachkommen Schlomos.“ Und er nimmt das in die dreizehn Grundsätze des Glaubens auf, in den zwölften Grundsatz: „Und zu diesem Grundsatz (über die Tage des Moschiach) gehört … dass es keinen König für Israel gibt außer aus dem Haus David und nur aus den Nachkommen Schlomos.“</p><p>Schlomos Königtum und Salbung waren also nicht nur die wirkliche Fortsetzung von Davids Königtum — weil er sein Erbe war. Das Wesen des Königtums des Hauses David — ein Königtum „für immer“ — kam (nach David) gerade durch Schlomos Königtum.</p>`,
        },
        {
          h: 'Prophezeiung und Wahl Schlomos',
          b: `<p>Darum finden wir, dass Schlomos Königtum anders war als das aller anderen Könige aus dem Haus David. Er war wirklich und sichtbar „allein der König“, wie David, sein Vater. Die anderen Könige aus dem Haus David waren nicht allein König über ganz Israel: Zu ihrer Zeit wurde durch das Wort eines Propheten ein König aus den anderen Stämmen über die zehn Stämme eingesetzt.</p><p>Der Grund: Über Schlomos Königtum gab es von Anfang an eine klare Prophezeiung an David, dass es ewig sein wird: „Siehe, dir wird ein Sohn geboren werden, der wird ein Mann der Ruhe sein … denn Schlomo wird sein Name sein … Er wird ein Haus für Meinen Namen bauen … und Ich werde den Thron seines Königtums über Israel festigen für immer.“<sup data-src="chron1-22-9"></sup></p><p>Mehr noch: Über Davids Wahl heißt es: „Und Er erwählte David, Seinen Diener.“<sup data-src="ps-78-70"></sup> Dadurch „schieden alle [anderen in] Israel aus“ dem Königtum aus, wie oben aus der Mechilta zitiert. Genauso heißt es über Schlomo: „Der Ewige … hat mich aus dem ganzen Haus meines Vaters erwählt, König über Israel zu sein für immer … an mir hat Er Gefallen gefunden, mich zum König über ganz Israel zu machen. Und von allen meinen Söhnen — denn viele Söhne hat mir der Ewige gegeben — hat Er Schlomo, meinen Sohn, erwählt, auf dem Thron des Königtums des Ewigen über Israel zu sitzen.“<sup data-src="chron1-28-4"></sup> Und so schieden alle anderen Söhne Davids aus.</p><p>Darum werden beide zusammen genannt: „David und Schlomo wurden aus einem Horn gesalbt — ihr Königtum ging weiter.“ Dass Davids Königtum ewig ist, wurde besonders und nur über Schlomo gesagt: „Ich werde den Thron seines Königtums über Israel festigen für immer.“ Gerade das setzt sich in Schlomos Salbung fort: „um allen bekannt zu machen, dass er allein der König ist“. Darum heißt das Königtum nach beiden — David und Schlomo.</p>`,
        },
        {
          h: '„Es lebe König David für immer“',
          b: `<p>Aus allem, was wir gesagt haben, kann man erklären, wie die Haftara „zum Thema des Abschnitts“ passt: im Inhalt und als Fortsetzung des Abschnitts.</p><p>„Die Könige aus dem Haus David sind die, die für immer bestehen.“ Und Bat-Scheva ruft am Ende der Haftara — nachdem David ihr geschworen hat „so werde ich es heute tun“ (dass Schlomo König wird) —: „Es lebe mein Herr, König David, für immer!“<sup data-src="kings1-1-30"></sup> Das bedeutet: „Das Königtum wird von den Nachkommen Davids nie abgeschnitten“, auch wenn sie sich, G-tt behüte, nicht richtig verhalten. „Der Heilige, gelobt sei Er, hat es ihm versprochen, denn es heißt: ‚Wenn seine Söhne Meine Tora verlassen und nicht nach Meinen Gesetzen gehen … dann bestrafe Ich ihre Sünde mit der Rute und ihre Schuld mit Plagen, aber Meine Güte nehme Ich nicht von ihm.‘“<sup data-src="rambam-kings-1-7"></sup><sup data-src="ps-89-31"></sup> Das ist so, weil Davids Krone des Königtums mit der Wahl des Heiligen, gelobt sei Er, verbunden ist. Und darin gibt es keinen (echten) Bruch und keine Änderung.</p>`,
        },
        {
          h: 'Wie die Wahl Awrahams',
          b: `<p>Das ähnelt dem Besonderen am Volk Israel als Kindern von Awraham, Jizchak und Jaakow: Was die Väter — Awraham, Jizchak und Jaakow — ihren Kindern nach ihnen weitergegeben haben, jedem und jeder im Volk Israel, das bleibt bis zum Ende aller Generationen. Denn in der Wahl des Heiligen, gelobt sei Er — „der Awram erwählt hat“<sup data-src="neh-9-7"></sup> —, gibt es keine Änderung.</p><p>Bei den Königen aus dem Haus David wurde „Es lebe mein Herr, König David, für immer“ wirklich, als das Königtum weiterging: „Schlomo, dein Sohn, wird nach mir König sein“, denn „Er hat Schlomo, meinen Sohn, erwählt, auf dem Thron des Königtums des Ewigen über Israel zu sitzen“. Genauso wurde in unserem Abschnitt die Fortsetzung Awrahams („der Awram erwählt hat“) wirklich, als sich G-ttes Versprechen erfüllte: „Denn durch Jizchak sollen dir Nachkommen genannt werden.“<sup data-src="gen-21-12"></sup> Jizchak setzte das Haus Awrahams wirklich fort.</p>`,
        },
        {
          h: 'Väter nennt man nur drei',
          b: `<p>Darum kann man sagen, warum man nach dem Text des Rambam (und nach dem Brauch der meisten Gemeinden in Israel heute) in der Haftara nicht den Vers sagt, dass Schlomo wirklich König war. Auch in unserem Abschnitt sind die Väter — Awraham, Jizchak (und Jaakow) — als Fundament des ganzen Volkes Israel, das sie ihren Kindern für immer weitergaben, (in unserem Abschnitt) noch nicht vollständig. Das sind sie erst, wenn Jaakow geboren wird (im Abschnitt Toldot). Denn „durch Jizchak“ — „und nicht ganz Jizchak“.<sup data-src="nedarim-31a"></sup> Erst dann waren die Väter vollständig: „Väter nennt man nur drei.“<sup data-src="berakhot-16b"></sup></p>`,
        },
        {
          h: 'Ein Volk — ein König',
          b: `<p>Man kann sagen: „Zum Thema des Abschnitts“ passt in dieser Haftara nicht nur, dass das Königtum des Hauses David — David und Schlomo — den Vätern entspricht. Sondern auch: Die Vollendung der Wahl von Awraham und Jizchak — des Fundaments des Volkes Israel — zeigte sich in den Königen aus dem Haus David.</p><p>Die Erklärung: Ein „Volk“ ist gerade dann vollständig, wenn es ein vereintes Volk wird — nicht, wenn jeder für sich ist. Und das geschieht durch den König. Mit den Worten des Rambam über das Gebot, einen König einzusetzen: „dass Er uns geboten hat, über uns einen König einzusetzen, der unser ganzes Volk sammelt und uns führt“. Darum zeigt sich die Wahl des ganzen Volkes Israel als ein Volk darin, dass der Heilige, gelobt sei Er, einen König über ganz Israel für immer erwählt hat — die Wahl von David und Schlomo: „Die Könige aus dem Haus David … bestehen für immer“, und durch sie geht „das Königtum des Ewigen über Israel“ weiter.<sup data-src="chron1-28-4"></sup></p>`,
        },
        {
          h: 'Das Königtum und der Beit HaMikdasch',
          b: `<p>Und noch etwas. Wie schon oft gesagt wurde, ist das Königtum des Hauses David mit dem Beit HaMikdasch verbunden. Es steht geschrieben: „Ich habe keine Stadt aus allen Stämmen Israels erwählt, um ein Haus zu bauen, damit Mein Name dort ist; und Ich habe David erwählt, über Mein Volk Israel zu sein.“<sup data-src="kings1-8-16"></sup> Darum wurde der Beit HaMikdasch gerade durch David gebaut — er bereitete alles für den Bau vor — und durch Schlomo, über den es heißt: „Er wird ein Haus für Meinen Namen bauen“<sup data-src="chron1-22-9"></sup> — und er baute es wirklich.</p><p>Durch die Wahl der Könige aus dem Haus David und durch den Bau des Hauses kam das Volk Israel „zur Ruhe und zum Erbe“ — zusammen mit der Ruhe und dem Erbe der Schechina: Die Schechina wohnt dort — „das ist das Haus des Ewigen, G-ttes …“, „das ist Meine Ruhestätte für immer“.<sup data-src="ps-132-14"></sup></p><p>Darum zeigte sich die Wahl Awrahams und der Väter nach ihm als Väter des Volkes Israel zu der Zeit, als sich „Es lebe mein Herr, König David, für immer“ erfüllte — im Königtum von David und Schlomo. Sie bauten den Beit HaMikdasch: die Wohnung der Schechina, die für immer im Volk Israel bleibt.</p>`,
        },
      ],
      reflection: 'G-tt hat mich erwählt — für immer, was auch geschieht. Was kann ich heute tun, damit man diese Wahl sieht?',
      takeaways: [
        'Dass Davids Königtum ewig ist, wurde gerade über Schlomo gesagt; darum nennt die Gemara sie zusammen.',
        'Davids Krone ist G-ttes Wahl, und sie ändert sich nicht: „Meine Güte nehme Ich nicht von ihm.“',
        'Auch die Wahl Awrahams ist für immer; sie ging weiter durch „durch Jizchak sollen dir Nachkommen genannt werden“.',
        'Die Väter sind erst mit Jaakow vollständig — darum hört auch die Haftara beim Schwur auf.',
        'Die Wahl der Väter wurde in den Königen aus dem Haus David vollendet: ein Volk mit einem König — und der Beit HaMikdasch.',
      ],
      puzzle: {
        q: 'Ordne die Antwort des Rebben: von der Wahl — zum Beit HaMikdasch.',
        pieces: ['Schlomo erwählt, wie David', 'G-ttes Wahl ändert sich nicht', 'Wie „Du hast Awram erwählt“', 'Die Väter vollständig mit Jaakow', 'Ein König — ein Volk — der Tempel'],
        meaning: 'Die Wahl des Hauses David ist wie die Wahl der Väter für immer. Und die Wahl der Väter wurde vollendet, als die Könige aus dem Haus David das Volk vereinten und den Beit HaMikdasch bauten.',
      },
    },
  ],
  final: {
    title: 'Ermittlung gelöst',
    allSolved:
      'Alle vier Rätsel sind gelöst. Die Haftara endet mit dem Schwur „Es lebe mein Herr, König David, für immer“, denn das Königtum des Hauses David ist G-ttes Wahl, und sie ändert sich nicht — wie die Wahl von Awraham und Jizchak. Und die Wahl der Väter wurde in den Königen aus dem Haus David vollendet: Sie vereinten das Volk und bauten den Beit HaMikdasch.',
  },
  puzzle: {
    q: 'Ordne den Weg der Rede.',
    pieces: ['Die Haftara spiegelt den Abschnitt', 'Gesalbt wegen eines Streits', 'Das Öl — für die Generationen', 'Die Wahl ändert sich nicht', 'Ein Volk und der Tempel'],
    meaning: 'Von der Frage nach dem Ende der Haftara zum Wichtigsten: G-tt hat Awraham und David für immer erwählt, und diese Wahl machte Israel zu einem Volk mit dem Beit HaMikdasch in seiner Mitte.',
  },
  audience: 'Ab 11 Jahren: wie die Haftara zum Abschnitt passt, der Streit von Raschi und dem Rambam und die Gesetze über die Salbung eines Königs. Jüngere Kinder — zusammen mit einem Erwachsenen.',
  practice:
    'G-tt hat Awraham — und jedes seiner Kinder — für immer erwählt. Das hängt nicht davon ab, wie gut wir uns heute benommen haben. Tu heute etwas, das verbindet: hilf jemandem, versöhne dich, lerne zusammen mit einem anderen — denn ein Volk ist vollständig, wenn es eins ist.',
  highlight: '„Es lebe mein Herr, König David, für immer!“ (Melachim I 1,31): G-ttes Wahl ändert sich nicht — wie die Wahl von Awraham und Jizchak.',
  share: ({ score, max, time, grid, allSolved, site }) => `✨ Warum endet die Haftara von Chaje Sara mit „Es lebe König David für immer“ — und erzählt nicht, wie Schlomo zum König gesalbt wurde?

Ich ermittle zusammen mit dem Lubawitscher Rebben — „Niflaot des Rebben“, Abschnitt Chaje Sara. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bis jetzt:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: die Haftara als Spiegel des Abschnitts, gesalbt wegen eines Streits, ein Horn und kein Krug, und für immer erwählt.
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Die Ermittlung folgt einer Rede des Lubawitscher Rebben an den Schabbatot Wajera und Chaje Sara 5743 (Likkutej Sichot, Bd. 25, Chaje Sara, Rede 3), in hebräischer Übersetzung; Nacherzählung des Projekts.',
};

export default de;
