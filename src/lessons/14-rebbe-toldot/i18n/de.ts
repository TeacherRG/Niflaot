import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Die Asche Jizchaks',
  hero: {
    heading: 'Warum liegt „<i>die Asche Jizchaks aufgehäuft auf dem Altar</i>“, wenn man die Asche eines Opfers wegräumt?',
    author: 'nach einer Rede des Lubawitscher Rebben · Likkutej Sichot, Bd. 25, Toldot',
    intro:
      'G-tt sagt zu Jizchak: „Zieh nicht nach Ägypten hinab… wohne in diesem Land“ — denn er ist eine „Ola Temima“, ein Opfer, das man nicht hinausbringen darf. Und die Weisen sagen: Das Verdienst der Bindung Jizchaks ist seine „Asche, aufgehäuft auf dem Altar“. Aber nach dem Gesetz nimmt man die Asche eines Opfers ab und trägt sie hinaus! Ermittle zusammen mit dem Rebben — von den Gesetzen des Tempels bis dahin, wie Jizchak auch jetzt noch „brennt“.',
  },
  summary:
    'Jizchak ist eine „Ola Temima“: Der Widder wurde „anstelle seines Sohnes“ geopfert, darum darf er das Land Israel nicht verlassen. Die Weisen sagen, seine Asche liegt „aufgehäuft auf dem Altar“ — obwohl man die Asche der Opfer nach dem Gesetz wegräumt. Der Rebbe erklärt: Bei der Akeda gab es weder „Terumat HaDeschen“ noch das Hinaustragen der Asche. Und tiefer: Die Akeda dauert immer an, als ob Jizchak jetzt brennt. Asche steht für das Alltägliche, das Erlaubte. Bei Jizchak, dessen Hingabe bis in den Körper reichte, blieb sogar die „Asche“ auf dem Altar. Die Lehre: Nach dem Gebet sollst du dich mit dem Alltag „neben dem Altar“ beschäftigen — damit du morgen besser beten kannst.',
  glossary: {},
  riddles: [
    {
      title: 'Ola Temima',
      cond: `<p>In einer Hungersnot erschien G-tt dem Jizchak und sagte:</p><p class="verse" dir="rtl" lang="he">אל תרד מצרימה… גור בארץ הזאת</p><p>„Zieh nicht nach Ägypten hinab… wohne in diesem Land.“<sup data-src="gen-26-2"></sup> Raschi erklärt: „Du bist eine Ola Temima (ein vollkommenes Ganzopfer), und das Ausland passt nicht zu dir.“<sup data-src="rashi-26-2"></sup></p><p>Aber die Heiligkeit eines Opfers beginnt doch, wenn man es auf dem Altar darbringt — und Jizchak wurde nicht dargebracht. Und was bedeutet es, dass seine „Asche“ auf dem Altar liegt?</p>`,
      steps: [
        {
          q: 'Warum durfte Jizchak nicht nach Ägypten hinabziehen?',
          hint: 'Raschis Worte zu unserem Vers.',
          opts: ['„weil du eine Ola Temima bist“', '„weil der Hunger in Ägypten schlimmer ist“', '„weil Awimelech ihn nicht gehen lässt“', '„weil der Weg gefährlich ist“'],
        },
        {
          q: 'Was geschieht mit einer Ola, die hinter die Vorhänge hinausgeht — aus dem Tempelhof?',
          hint: 'Der Midrasch: „so auch du, wenn du das Land verlässt…“',
          opts: ['„sie wird untauglich“', '„sie wird noch heiliger“', '„man bringt sie zurück“', '„die Kohanim essen sie“'],
        },
        {
          q: 'Was war das ganze Land Israel für Jizchak, wie die Erklärer sagen?',
          hint: 'Und alles außerhalb des Landes ist wie „außerhalb des…“',
          opts: ['„wie der Tempelhof — die Asara“', '„wie eine Zufluchtsstadt“', '„wie das Lager der Lewiten“', '„wie die Wüste“'],
        },
        {
          q: 'Wo beginnt auf den ersten Blick die Heiligkeit einer Ola — die Heiligkeit, die das Hinausgehen verdirbt?',
          hint: 'Bevor eine Ola dargebracht ist, verdirbt das Verlassen des Hofes sie nicht.',
          opts: ['„auf dem Altar“', '„im Haus Awrahams“', '„an jedem Ort“', '„im Land Morija“'],
        },
        {
          q: 'Der Widder wurde „anstelle seines Sohnes“ geopfert. Worum betete Awraham bei jeder Handlung mit dem Widder?',
          hint: 'Raschi zu Bereschit 22,13.',
          opts: ['„als ob mein Sohn geschlachtet wäre“', '„dass der Widder ohne Makel sei“', '„dass Jizchak keine Angst hat“', '„dass Feuer vom Himmel fällt“'],
        },
        {
          q: 'Wo ist „die Asche Jizchaks“, sagen die Weisen?',
          hint: 'An ihr hat man den Platz des Altars im Zweiten Tempel gefunden.',
          opts: ['„aufgehäuft auf dem Altar“', '„vom Wind verweht“', '„aus dem Lager hinausgetragen“', '„in Chewron begraben“'],
        },
      ],
      reveal: {
        h: 'Asche, die man nicht wegräumte',
        p: 'Jizchak ist eine Ola Temima: Der Widder wurde „anstelle seines Sohnes“ geopfert, und alles, was man mit dem Widder tat, zählt, als ob es mit Jizchak getan wurde — als ob er auf dem Altar dargebracht wurde. Darum würde ihn das Verlassen des Landes, das für ihn wie der Tempelhof ist, untauglich machen. Aber daraus folgt eine Frage: Die Weisen sagen, das Verdienst der Akeda ist „die Asche Jizchaks, aufgehäuft auf dem Altar“, und an ihr fand man sogar den Platz des Altars im Zweiten Tempel. Doch nach dem Gesetz bleibt die Asche eines Opfers nicht auf dem Altar: Man nimmt sie ab und trägt sie hinaus. Wie kann dann die Asche Jizchaks „aufgehäuft auf dem Altar liegen“?',
      },
      lessons: [
        {
          h: '„Wohne in diesem Land“',
          b: `<p>Zum Vers „wohne in diesem Land“<sup data-src="gen-26-2"></sup> sagen die Weisen: Jizchak durfte das Land Israel nicht verlassen, weil er eine „Ola Temima“ war: „Wie eine Ola untauglich wird, wenn sie hinter die Vorhänge hinausgeht, so wirst auch du untauglich, wenn du aus dem Land hinausgehst.“<sup data-src="bereshit-rabbah-64-3"></sup> Und Raschi: „Du bist eine Ola Temima, und das Ausland passt nicht zu dir.“<sup data-src="rashi-26-2"></sup></p>`,
        },
        {
          h: 'Das ganze Land — wie der Tempelhof',
          b: `<p>Die Erklärer sagen: Das ganze Land Israel war für ihn „so wichtig wie die Asara“ — der Tempelhof —, und alles außerhalb des Landes „wie außerhalb der Asara“. Darum durfte er als „Ola Temima“ — und eine Ola ist „hochheilig“ — das Land Israel nicht verlassen, so wie „das Hochheilige nicht aus der Asara hinausgeht“.<sup data-src="rashi-26-2"></sup></p>`,
        },
        {
          h: 'Eine Heiligkeit, die auf dem Altar beginnt',
          b: `<p>Man muss verstehen: Warum hat Jizchak die Heiligkeit einer Ola so, dass sie „untauglich wird, wenn sie hinter die Vorhänge hinausgeht“? Auf den ersten Blick entsteht so eine Heiligkeit erst, nachdem man die Ola auf dem Altar darbringt. Solange eine Ola Temima noch lebt, wird sie nicht untauglich, wenn man sie aus der Asara hinausbringt.<sup data-src="bereshit-rabbah-64-3"></sup></p>`,
        },
        {
          h: '„Anstelle seines Sohnes“',
          b: `<p>Die Erklärung versteht man aus den Worten der Weisen zum Vers „und er brachte ihn als Ganzopfer dar, anstelle seines Sohnes“:<sup data-src="gen-22-13"></sup> Der Widder wurde an Jizchaks Stelle geopfert — „anstelle seines Sohnes“ —, und es ist, als ob Jizchak das Opfer war. Mit Raschis Worten betete Awraham bei jeder Handlung: „Möge es sein, als ob es an meinem Sohn getan wird: als ob mein Sohn geschlachtet wäre… sein Blut gesprengt… ihm die Haut abgezogen, als ob er verbrannt und zu Asche geworden wäre.“<sup data-src="rashi-22-13"></sup></p><p>Und weil man alle diese Handlungen so zählt, als ob sie an Jizchak getan wurden und er auf dem Altar dargebracht wurde, wurde er mit der Heiligkeit einer Ola Temima geheiligt — die untauglich wird, wenn sie „hinausgeht“.</p>`,
        },
        {
          h: '„Die Asche Jizchaks, aufgehäuft auf dem Altar“',
          b: `<p>Aber wenn Jizchak als Opfer gilt, das schon auf dem Altar dargebracht wurde, braucht man eine Erklärung. Über das Verdienst der Akeda sagen die Weisen an mehreren Stellen: „Die Asche Jizchaks ist, als ob sie auf dem Altar aufgehäuft wäre.“ Und Raschi: „Die Asche Jizchaks erscheint vor Mir, aufgehäuft und liegend auf dem Altar.“<sup data-src="rashi-lev-26-42"></sup> An den genauen Worten der Weisen — „aufgehäuft <b>auf dem Altar</b>“, und nicht nur „aufgehäuft und bereit zur Sühne“, wie Raschi an anderer Stelle sagt — sieht man: Das Verdienst der Akeda hängt damit zusammen, dass die Asche Jizchaks gleichsam auf dem Altar <b>geblieben</b> ist.</p>`,
        },
        {
          h: 'Die Asche zeigte den Platz des Altars',
          b: `<p>Mehr noch: Im Traktat Sewachim fragt die Gemara, woher die Erbauer des Zweiten Tempels den Platz des Altars kannten, und antwortet: „Sie sahen die Asche Jizchaks — dass sie an diesem Ort lag.“<sup data-src="zevachim-62a"></sup> An ihr <b>bestimmten</b> sie den Platz des Altars.</p>`,
        },
        {
          h: 'Aber die Asche eines Opfers räumt man weg',
          b: `<p>Und das ist schwer zu verstehen: Der Platz des „Deschen“ — der Asche, die vom Opfer übrig bleibt (bei Jizchak entspricht ihr „die Asche Jizchaks“, dieselbe wie der „Deschen“ des Widders) — ist <b>nicht</b> auf dem Altar. Denn mit der Asche macht man „Terumat HaDeschen“ — das Abheben der Asche — und das Hinaustragen der Asche.<sup data-src="lev-6-3"></sup></p><p>Wie kann man dann sagen, dass die Asche Jizchaks „aufgehäuft (und liegend) auf dem Altar“ ist?</p>`,
        },
      ],
      reflection: 'Gibt es einen Ort, der für mich wie ein „Tempelhof“ ist — den ich nicht verlasse?',
      takeaways: [
        'Jizchak darf das Land Israel nicht verlassen: Er ist eine „Ola Temima“, und das Land ist für ihn wie der Tempelhof.',
        'Die Heiligkeit einer Ola, die das Hinausgehen verdirbt, beginnt auf dem Altar.',
        'Der Widder wurde „anstelle seines Sohnes“ geopfert — als ob Jizchak geschlachtet und verbrannt wurde.',
        'Die Weisen: Das Verdienst der Akeda ist „die Asche Jizchaks, aufgehäuft auf dem Altar“; an ihr fand man den Platz des Altars.',
        'Die Frage: Nach dem Gesetz nimmt man die Asche eines Opfers ab und trägt sie hinaus.',
      ],
      puzzle: {
        q: 'Ordne den Weg der Ermittlung: vom Verbot, das Land zu verlassen — zur Frage nach der Asche.',
        pieces: ['Wohne in diesem Land', 'Jizchak — Ola Temima', 'Der Widder — anstelle des Sohnes', 'Asche auf dem Altar aufgehäuft', 'Aber Asche räumt man weg'],
        meaning: 'Jizchak gilt als dargebrachtes Opfer — darum ist er eine „Ola Temima“. Aber warum blieb seine Asche auf dem Altar, wenn man die Asche eines Opfers wegräumt?',
      },
    },
    {
      title: 'Die Akeda jetzt',
      cond: `<p>Das Gesetz über die Asche des Altars:</p><p class="verse" dir="rtl" lang="he">והרים את הדשן… ושמו אצל המזבח… והוציא את הדשן אל מחוץ למחנה</p><p>„Er soll die Asche abheben… und sie neben den Altar legen… und die Asche hinaus vor das Lager tragen.“<sup data-src="lev-6-3"></sup></p><p>Warum tat man das nicht mit der Asche Jizchaks? Und warum sehen die Weisen das Verdienst der Akeda gerade in der Asche — wo Asche doch bedeutet, dass das Opfer schon verbrannt und nicht mehr da ist?</p>`,
      steps: [
        {
          q: 'Wohin legt man die Asche bei „Terumat HaDeschen“?',
          hint: 'Der Vers Wajikra 6,3.',
          opts: ['„neben den Altar“', '„oben auf den Altar“', '„vor die Stadt“', '„ins Heiligtum“'],
        },
        {
          q: 'Wann trägt man die Asche nach Raschi hinaus vor das Lager?',
          hint: 'Es ist keine Pflicht für jeden Tag.',
          opts: ['„wenn kein Platz mehr für die ‚Maaracha‘ — den Holzstoß — ist“', '„jeden Tag“', '„nur am Schabbat“', '„wenn die Asche abgekühlt ist“'],
        },
        {
          q: 'Was ist über alles gesagt, was den Altar berührt?',
          hint: 'Schemot 29,37.',
          opts: ['„alles, was den Altar berührt, wird heilig“', '„alles, was den Altar berührt, wird unrein“', '„den Altar darf man nicht berühren“', '„der Altar ist nur am Tag heilig“'],
        },
        {
          q: 'Wann bereitet eine Ola G-tt „Nachat Ruach“ — Freude?',
          hint: '„Und der Ewige roch den lieblichen Duft.“',
          opts: ['„solange sie brennt — der ‚liebliche Duft‘“', '„wenn sie schon Asche ist“', '„bevor man sie schlachtet“', '„wenn man sie isst“'],
        },
        {
          q: 'Welche Mizwa beruhigte König David im Bad, als er sich „nackt, ohne Mizwa“ sah?',
          hint: 'Sie ist in seinem Körper.',
          opts: ['„die Beschneidung“', '„Tefillin“', '„Zizit“', '„Mesusa“'],
        },
        {
          q: 'Wie wirkt also das Verdienst der Akeda?',
          hint: 'Wie die Beschneidung, nicht wie Tefillin.',
          opts: ['„als ob Jizchak jetzt brennt“', '„einmal getan und vorbei“', '„längst vergessen“', '„nur an Rosch HaSchana“'],
        },
      ],
      reveal: {
        h: 'Jizchak brennt jetzt',
        p: 'Einfach gesagt: Bei der Akeda gab es kein „Terumat HaDeschen“ — ein kleiner Altar hat kein „neben dem Altar“. Und es gab keinen Grund, die Asche hinauszutragen — dort brauchte man keinen Platz für die nächste „Maaracha“. Und was den Altar berührt hat, kommt nicht mehr herunter; so blieb die Asche. Aber die Weisen verbinden gerade das Verdienst der Akeda mit der Asche. Asche ist schon etwas anderes, und die Freude an einer Ola ist, solange sie brennt. Also ist das Verdienst der Akeda wie die Mizwa der Beschneidung, die sich jeden Augenblick erneuert: Jizchak brennt gleichsam jetzt auf dem Altar, von Neuem, und jetzt steigt der „liebliche Duft“ auf. Darum ist die Asche „aufgehäuft auf dem Altar“.',
      },
      lessons: [
        {
          h: 'Es gab kein „Terumat HaDeschen“',
          b: `<p>Die einfache Erklärung, im offenen Sinn: Als man den Widder darbrachte, machte man weder „Terumat HaDeschen“ noch das Hinaustragen der Asche.</p><p>„Terumat HaDeschen“ war unmöglich: Dieser Dienst endet mit den Worten „und er soll sie neben den Altar legen“.<sup data-src="lev-6-3"></sup> Die Akeda aber galt als „kleiner Altar“ — eine Bama —, und dort gab es keinen Ort „neben dem Altar“: Alles, was nicht auf dem Altar selbst ist, gilt als „draußen“.</p>`,
        },
        {
          h: 'Es gab auch kein Hinaustragen',
          b: `<p>Und der Grund für das Hinaustragen der Asche, mit Raschis Worten: „wenn kein Platz für die Maaracha ist“<sup data-src="rashi-lev-6-4"></sup> — wenn man die Asche nicht vom Altar nimmt, ist kein Platz für die nächste „Maaracha“ (den Holzstoß). Natürlich gilt dieser Grund nicht für den Altar, den Awraham für die Bindung Jizchaks gebaut hat.</p>`,
        },
        {
          h: 'Was den Altar berührt, kommt nicht herunter',
          b: `<p>Man kann sagen: Weil es keine Pflicht gab, die Asche vom Altar zu nehmen, ist klar, dass die Asche auf dem Altar <b>blieb</b>. Denn das Gesetz lautet: „Alles, was den Altar berührt, wird heilig“,<sup data-src="ex-29-37"></sup> und „sogar ein untaugliches Opfer, das hinaufgekommen ist… kommt nicht herunter“. Darum: Wenn es keine Pflicht und keinen besonderen Grund gibt, die Asche wegzunehmen, „kommt sie nicht herunter“.</p><p>Und so ist auch „die Asche Jizchaks“, dieselbe wie der „Deschen“ des Widders, „aufgehäuft auf dem Altar“.</p>`,
        },
        {
          h: 'Aber das ist das Verdienst der Akeda selbst',
          b: `<p>Aber man braucht noch eine Erklärung. Das Gesagte erklärt, warum die Asche Jizchaks „aufgehäuft auf dem Altar“ bleiben <b>konnte</b> und auch blieb. Doch weil die Weisen Jizchaks Verdienst damit verbinden, dass „seine Asche… aufgehäuft auf dem Altar“ ist, ist klar: Das hängt gerade mit dem <b>Verdienst der Akeda selbst</b> zusammen.<sup data-src="rashi-lev-26-42"></sup></p><p>Und man muss sagen: Obwohl man den „Deschen“ einer Ola sonst unbedingt vom Altar nimmt — obwohl sie ganz für G-tt ist —, ist die Heiligkeit der Ola bei Jizchak, durch die Akeda, so, dass die „Asche“ „aufgehäuft (und liegend) auf dem Altar“ bleibt.</p>`,
        },
        {
          h: 'Asche ist schon etwas anderes',
          b: `<p>Um das zu erklären, muss man etwas vorausschicken.</p><p>a) Allgemein sieht man auch am praktischen Gesetz: Wenn etwas zu Asche geworden ist, ist es <b>nicht mehr</b> in seinem früheren Dasein. Ein Beispiel ist das Vernichten von Chamez nach der Meinung, dass man es nur durch Verbrennen vernichtet: Nach dem Verbrennen bleibt noch Asche, aber das ist schon etwas anderes.</p><p>b) Die Wirkung, die „Nachat Ruach“ — die Freude — an einer Ola, deren Darbringung mit dem Verbrennen auf dem Altar endet, ist der „liebliche Duft“ <b>während</b> sie brennt: „und der Ewige roch den lieblichen Duft…“<sup data-src="gen-8-21"></sup> — und während sie zu Asche wird, aber nicht danach.</p><p>Dann ist schwer zu verstehen, dass das Verdienst der Akeda für alle Generationen gerade mit dem Ausdruck „<b>Asche</b> Jizchaks“ besteht: Das Wort „Asche“ betont doch genau das <b>Gegenteil</b> — dass die Akeda, die Darbringung selbst, nicht mehr da ist!</p>`,
        },
        {
          h: 'Drei Arten von Verdienst',
          b: `<p>Um das zu verstehen, muss man vorausschicken: Das Verdienst einer Mizwa wirkt nach ihrer Erfüllung auf verschiedene Weisen:</p><p>a) Ein Verdienst, das schon in der Vergangenheit <b>vollendet</b> ist: Die Mizwa schafft ein Verdienst, das für immer beim Menschen bleibt, aber der Grund des Verdienstes ist schon in der Vergangenheit getan und abgeschlossen.</p><p>b) Die Mizwa wurde in der Vergangenheit getan, aber ihre Wirkung <b>dauert an</b> — darum dauert auch ihr Verdienst an, auch in der Zeit, in der man es braucht.</p><p>c) Die frühere Tat dauert an und <b>erneuert sich</b> die ganze Zeit, sodass es auch nach langer Zeit ist, als ob die Mizwa <b>jetzt</b> erfüllt wird.</p>`,
        },
        {
          h: 'König David im Bad',
          b: `<p>So versteht man, was über König David gesagt ist: „Als David ins Badehaus ging und sich nackt dastehen sah, sagte er: Wehe mir, dass ich nackt dastehe, ohne Mizwa! Aber als er sich an die Beschneidung an seinem Körper erinnerte, beruhigte er sich.“<sup data-src="menachot-43b"></sup></p><p>Doch auf den ersten Blick spürte David in seinem Verstand und Herzen sicher die „Unterwerfung von Herz und Verstand“ vom früheren Anlegen der Tefillin. Warum fühlte er sich dann „nackt, ohne Mizwa“?</p><p>Die Erklärung: Die Unterwerfung von Herz und Verstand ist die andauernde Wirkung der Tefillin, die man <b>vorher</b> angelegt hat — aber die Mizwa selbst wird jetzt nicht getan. Die Mizwa der Beschneidung dagegen — beschnitten zu sein — erneuert sich jeden Augenblick, und der Mensch gilt, als ob er <b>jetzt</b> beschnitten worden wäre.</p>`,
        },
        {
          h: 'Die Akeda — jeden Augenblick',
          b: `<p>Das ist das Neue an der Akeda: Das Verdienst der Akeda besteht so, als ob Jizchak <b>jetzt brennt</b> (jeden Augenblick) — <b>von Neuem</b> auf dem Altar. Darum ist „die Asche Jizchaks… aufgehäuft auf dem Altar“: Er brennt <b>jetzt</b> auf dem Altar, und jetzt steigt der „liebliche Duft“ auf.<sup data-src="gen-8-21"></sup></p>`,
        },
      ],
      reflection: 'Welche meiner guten Taten kann auch heute „weitergehen“ — und nicht nur in der Vergangenheit bleiben?',
      takeaways: [
        'Bei der Akeda gab es kein „Terumat HaDeschen“: Ein kleiner Altar hat kein „neben dem Altar“.',
        'Es gab auch kein Hinaustragen der Asche: Das tut man, „wenn kein Platz für die Maaracha ist“.',
        'Was den Altar berührt hat, kommt nicht mehr herunter — darum blieb die Asche.',
        'Aber Asche ist schon etwas anderes, und die Freude an einer Ola ist, solange sie brennt.',
        'Das Verdienst der Akeda ist wie die Beschneidung: Es erneuert sich jeden Augenblick, als ob Jizchak jetzt brennt.',
      ],
      puzzle: {
        q: 'Ordne die Erklärung: von den Gesetzen der Asche — zur Akeda, die andauert.',
        pieces: ['Kein „neben dem Altar“', 'Kein Grund zum Hinaustragen', 'Sie kommt nicht herunter', 'Beschneidung — jeden Augenblick', 'Jizchak brennt jetzt'],
        meaning: 'Die Asche blieb, weil man sie nicht wegräumen musste; aber das Verdienst ist, dass die Akeda immer andauert — als ob Jizchak jetzt auf dem Altar brennt.',
      },
    },
    {
      title: 'Asche ist der Alltag',
      cond: `<p>Was bedeutet der „Deschen“ — die Asche des Altars — im Dienst des Menschen? Der Rebbe nennt zwei Wege, wie man sich mit alltäglichen, erlaubten Dingen beschäftigt:</p><p class="verse" dir="rtl" lang="he">כל מעשיך יהיו לשם שמים</p><p>„Alle deine Taten sollen um des Himmels willen sein.“<sup data-src="avot-2-12"></sup></p><p class="verse" dir="rtl" lang="he">בכל דרכיך דעהו</p><p>„Auf all deinen Wegen erkenne Ihn.“<sup data-src="prov-3-6"></sup></p><p>Welcher davon ist die Asche, die man vor das Lager trägt, und welcher die Asche neben dem Altar?</p>`,
      steps: [
        {
          q: 'Was ist Asche, wie der Alte Rebbe im Tanja erklärt?',
          hint: 'Das Feuer hat keine Macht über sie; sie sinkt nach unten.',
          opts: ['„das Element Erde — das gröbste“', '„das Element Feuer“', '„das Element Wasser“', '„das Element Luft“'],
        },
        {
          q: 'Worauf weist der Teil des Opfers hin, der auf dem Altar verbrennt?',
          hint: 'Die feineren Dinge der Welt, die ganz in die Heiligkeit eingehen können.',
          opts: ['„Dinge, mit denen man Mizwot tut“', '„erlaubte alltägliche Dinge“', '„Sünden“', '„Essen“'],
        },
        {
          q: 'Und worauf weist die Asche hin, die übrig bleibt?',
          hint: 'Was ein Jude braucht, aber was nicht heilig ist.',
          opts: ['„erlaubte alltägliche Dinge“', '„heilige Gegenstände“', '„Worte der Tora“', '„heilige Bücher“'],
        },
        {
          q: 'Die Asche trägt man „vor das Lager — an einen reinen Ort“. Welcher Weg ist das?',
          hint: 'Die Taten sind „deine“, aber das Ziel ist Heiligkeit.',
          opts: ['„‚Alle deine Taten — um des Himmels willen‘“', '„‚Auf all deinen Wegen erkenne Ihn‘“', '„‚Liebe deinen Nächsten wie dich selbst‘“', '„‚Weiche vom Bösen und tu Gutes‘“'],
        },
        {
          q: 'Und die Asche der „Terumat HaDeschen“ legt man „neben den Altar“. Welcher Weg ist das?',
          hint: 'Er ist der höhere.',
          opts: ['„‚Auf all deinen Wegen erkenne Ihn‘“', '„‚Alle deine Taten — um des Himmels willen‘“', '„‚Sei vorsichtig bei einer leichten Mizwa‘“', '„‚Mach dir einen Lehrer‘“'],
        },
        {
          q: 'Was wird zur Heiligkeit auf dem Weg „Auf all deinen Wegen erkenne Ihn“?',
          hint: 'Nicht nur das, was später daraus wird.',
          opts: ['„die erlaubten Dinge selbst“', '„nur der Nutzen, der später kommt“', '„nichts“', '„nur die Mizwot“'],
        },
      ],
      reveal: {
        h: 'Neben dem Altar — und vor dem Lager',
        p: 'Asche ist das Gröbste, das Element Erde. Was verbrennt, steht für die feineren Dinge der Welt, mit denen man Mizwot tut; die Asche steht für das Erlaubte, Alltägliche, das nicht ins Feuer des Altars eingehen kann, in die höchste Heiligkeit — darum bleibt Asche nicht auf dem Altar. Aber es gibt zwei Stufen. Asche, die man „vor das Lager, an einen reinen Ort“ trägt, ist „alle deine Taten um des Himmels willen“: alltägliche Taten, aber für die Heiligkeit — der Nutzen kommt später. Die Asche der „Terumat HaDeschen“, die man „neben den Altar“ legt, ist „auf all deinen Wegen erkenne Ihn“: die alltäglichen Dinge selbst werden zur Heiligkeit; sie bleiben nicht auf dem Altar, aber sie liegen daneben und gehen an ihrem Platz auf.',
      },
      lessons: [
        {
          h: 'Asche — das Gröbste',
          b: `<p>Die Erklärung all dessen im geistigen Dienst des Menschen.</p><p>Die Bedeutung des „Deschen“ im Dienst des Menschen: <b>Asche</b> an sich, ohne Bezug darauf, was etwas zu Asche gemacht hat, ist reine Körperlichkeit. Wie der Alte Rebbe im Tanja erklärt: Die Asche, die von „verbranntem Holz“ übrig bleibt, ist das Element Erde darin, „das nach unten sinkt, und das Feuer hat keine Macht darüber… die Erde ist körperlicher als alle“ anderen Elemente.</p>`,
        },
        {
          h: 'Was verbrennt und was übrig bleibt',
          b: `<p>Das ist die Bedeutung der Asche des Altars. Der Teil des Opfers, der auf dem Altar verbrennt, weist auf die „feineren“ Dinge der Welt hin, die aufsteigen und ganz in die Heiligkeit eingehen können: allgemein die Dinge der Welt, mit denen man eine Mizwa tut — Gegenstände für eine Mizwa, heilige Gegenstände und Ähnliches.</p><p>Die Asche aber, die vom Opfer übrig bleibt, weist auf den niedrigeren Teil der Welt hin, der <b>nicht</b> ins Feuer des Altars eingehen kann — in die völlige Heiligkeit. Allgemein sind das die <b>erlaubten</b>, alltäglichen Dinge, die ein Jude braucht.</p><p>Darum kann die Asche nicht auf dem Altar bleiben — dem Gipfel der Heiligkeit.<sup data-src="lev-6-3"></sup></p>`,
        },
        {
          h: 'Zwei Stufen',
          b: `<p>Darin gibt es zwei Stufen: a) der „Deschen“, mit dem man „Terumat HaDeschen“ macht — er bleibt wenigstens „neben dem Altar“; b) der „Deschen“, den man „vor das Lager“ hinausträgt.<sup data-src="lev-6-3"></sup></p><p>Man kann sagen: Das ist der Unterschied zwischen zwei Wegen des geistigen Dienstes — „alle deine Taten sollen um des Himmels willen sein“<sup data-src="avot-2-12"></sup> und „auf all deinen Wegen erkenne Ihn“.<sup data-src="prov-3-6"></sup></p>`,
        },
        {
          h: '„Alle deine Taten — um des Himmels willen“',
          b: `<p>Die Bedeutung von „alle deine Taten sollen um des Himmels willen sein“: Wenn der Mensch diese Taten tut, sind sie für ihn „<b>deine</b> Taten“, erlaubte Dinge; nur tut er sie „um des Himmels willen“, für die Heiligkeit — später wächst aus ihnen ein <b>Nutzen</b> für himmlische Dinge.<sup data-src="avot-2-12"></sup></p><p>Auf diesen Weg weist die Asche hin, die man „vor das Lager“ trägt: Sie ist <b>nicht</b> im Lager der Heiligkeit. Aber man trägt sie „an einen <b>reinen</b> Ort“<sup data-src="lev-6-3"></sup> — der Mensch tut Erlaubtes um des Himmels willen, für die Heiligkeit.</p>`,
        },
        {
          h: '„Auf all deinen Wegen erkenne Ihn“',
          b: `<p>Ein höherer Weg bei den alltäglichen Dingen ist „auf all deinen Wegen <b>erkenne Ihn</b>“:<sup data-src="prov-3-6"></sup> nicht nur, dass er <b>später</b> durch sie zu „erkenne Ihn“ kommt, sondern <b>in ihnen selbst</b> — „auf all deinen Wegen“ — „erkenne Ihn“. Es sind zwar „<b>deine</b> Wege“ — erlaubte Dinge, aber die erlaubten Dinge selbst werden zur Heiligkeit.</p><p>Das ist wie bei „Terumat HaDeschen“: Auf dem Altar selbst kann die Asche nicht bleiben — es sind ja „deine Wege“ —, und trotzdem „soll er sie neben den Altar legen“:<sup data-src="lev-6-3"></sup> Sie bleibt dicht beim Altar und geht an ihrem Platz auf.</p>`,
        },
      ],
      reflection: 'Wenn ich esse, arbeite oder mich ausruhe — tue ich das „um des Himmels willen“, oder kann ich auch darin „Ihn erkennen“?',
      takeaways: [
        'Asche ist das Element Erde, das Körperlichste.',
        'Was auf dem Altar verbrennt, steht für Dinge, mit denen man Mizwot tut; die Asche — für erlaubte alltägliche Dinge.',
        'Asche, die man vor das Lager „an einen reinen Ort“ trägt — „alle deine Taten um des Himmels willen“: Der Nutzen kommt später.',
        'Asche neben dem Altar — „auf all deinen Wegen erkenne Ihn“: Das Alltägliche selbst wird zur Heiligkeit.',
        'Auf dem Altar selbst bleibt die Asche nicht — das ist die höchste Heiligkeit.',
      ],
      puzzle: {
        q: 'Ordne die Erklärung des Rebben: Was Asche im Dienst des Menschen ist.',
        pieces: ['Asche — das Element Erde', 'Was verbrennt — für die Mizwa', 'Asche — das Erlaubte', 'Vor das Lager — für den Himmel', 'Neben dem Altar — erkenne Ihn'],
        meaning: 'Alltägliche Dinge sind „Asche“: Auf dem Altar ist kein Platz für sie. Aber man kann sie „an einen reinen Ort“ tragen — um des Himmels willen — oder „neben dem Altar“ lassen, um G-tt in ihnen selbst zu erkennen.',
      },
    },
    {
      title: 'Ganz auf dem Altar',
      cond: `<p>Der Midrasch erzählt:</p><p class="verse" dir="rtl" lang="he">כיון שהגיע החרב על צוארו, פרחה ויצאה נפשו של יצחק</p><p>„Als das Messer seinen Hals berührte, flog die Seele Jizchaks davon und ging hinaus“ — und als die Stimme sagte „Leg deine Hand nicht an“, kam sie zurück.<sup data-src="pdre-31"></sup></p><p>Wie unterscheidet sich die Hingabe Jizchaks von der Hingabe Awrahams — und warum blieb deshalb bei Jizchak sogar die „Asche“ auf dem Altar? Und was lehrt das jeden von uns nach dem Morgengebet?</p>`,
      steps: [
        {
          q: 'Was geschah mit Jizchak, als das Messer seinen Hals berührte?',
          hint: 'Pirke de-Rabbi Elieser, Kap. 31.',
          opts: ['„seine Seele flog davon und ging hinaus“', '„er lief vom Berg weg“', '„er schlief ein“', '„er rief seinen Vater“'],
        },
        {
          q: 'Und was geschah mit Awraham im Feuerofen von Ur Kasdim?',
          hint: 'Darum gab es dort keine Hingabe des Körpers in der Tat.',
          opts: ['„das Feuer berührte ihn nicht“', '„er verbrannte und wurde zu Asche“', '„er lief aus dem Ofen“', '„man warf ihn nicht in den Ofen“'],
        },
        {
          q: 'Wie weit reichte die Hingabe Jizchaks?',
          hint: 'Sie kommt aus dem innersten Wesen der Seele.',
          opts: ['„auch bis in den Körper“', '„nur bis in die Gedanken“', '„nur bis in die Rede“', '„nur bis zum Besitz“'],
        },
        {
          q: '„Und Jizchak säte.“ Was „säte“ er nach dem Midrasch?',
          hint: '„Sät euch zur Gerechtigkeit.“',
          opts: ['„den Zehnten seines Reichtums — als Zedaka“', '„Weizen für Awimelech“', '„Samen für Esaw“', '„einen Weinberg für Awraham“'],
        },
        {
          q: 'Wem entsprechen die Gebete nach der Gemara?',
          hint: 'Und das tägliche Opfer ist eine Ola, ganz für G-tt.',
          opts: ['„den täglichen Opfern — dem Tamid“', '„den Wochentagen“', '„den Stämmen Israels“', '„den Engeln“'],
        },
        {
          q: 'Wann darf man nach dem Gebet „vor das Lager“ gehen — zu alltäglichen Dingen?',
          hint: 'Die Asche trägt man nur hinaus, wenn „kein Platz für die Maaracha“ ist.',
          opts: ['„wenn es nützt: morgen besser zu beten“', '„wenn man reich werden will“', '„wenn man sich vom Gebet ausruhen will“', '„immer, ohne Grund“'],
        },
      ],
      reveal: {
        h: 'Sogar die Asche liegt auf dem Altar',
        p: 'Bei der Akeda gab Jizchak sich in der Tat hin — seine Seele flog davon —, Awraham aber berührte das Feuer nicht. So eine Hingabe kommt aus dem innersten Wesen der Seele und reicht bis in den Körper. Darum wurde Jizchak ganz geheiligt: Sogar sein Körperliches wurde zur Ola, „ganz für G-tt“ — sogar als er Weizen säte, war der Sinn „sät euch zur Gerechtigkeit“. Für das Alltägliche „draußen“ gibt es bei ihm keinen Platz: Sogar die „Asche“ ist auf dem Altar aufgehäuft. Die Lehre: Das Gebet steht anstelle des täglichen Ola-Opfers; danach gehen wir zu unseren Aufgaben, aber „vor das Lager“ nur für die nächste „Maaracha“ — um morgen besser zu beten. Der Platz eines Juden ist drinnen, „neben dem Altar“; und innerlich, mit der Stufe Jizchaks in ihm, ist seine „Asche“ auf dem Altar.',
      },
      lessons: [
        {
          h: 'Hingabe in der Tat',
          b: `<p>Daraus versteht man, warum „die Asche Jizchaks ist, als ob sie auf dem Altar aufgehäuft wäre“.</p><p>Das Neue an der Bindung Jizchaks ist die Hingabe <b>in der Tat</b>, das Hingeben des Körpers im wörtlichen Sinn. Als Awraham in Ur Kasdim in den Feuerofen ging, gab es keine Hingabe des Körpers in der Tat: Das Feuer berührte ihn überhaupt nicht. Bei Jizchak aber „flog bei der Akeda die Seele Jizchaks davon und ging hinaus“,<sup data-src="pdre-31"></sup> — und danach erlebte er die Auferstehung der Toten.</p>`,
        },
        {
          h: 'Bis in den Körper',
          b: `<p>Diese Stufe der Hingabe kommt aus dem innersten Wesen der Seele, die mit G-ttlichkeit verbunden und in völliger Einheit vereint ist. Darum durchdringt sie alle Teile des Menschen gleich — auch den körperlichen Leib. Darum zeigt sie sich auch darin, dass man den <b>Körper</b> für den Heiligen, gelobt sei Er, hingibt.</p><p>Darum wurde Jizchak durch die Akeda so geheiligt, dass auch sein <b>Körper ganz heilig</b> wurde, und sogar die <b>körperlichen</b> Teile Jizchaks stiegen auf zur Stufe einer Ola, „ganz für G-tt“: Seine körperlichen Dinge gingen so in der Heiligkeit auf, dass er seine „Körperlichkeit“ überhaupt „nicht spürte“, und sein ganzes Wesen war „Dienst für G-tt“.<sup data-src="pdre-31"></sup></p>`,
        },
        {
          h: '„Und Jizchak säte“ — Zedaka',
          b: `<p>Wie schon an anderer Stelle ausführlich erklärt — über das, was Pirke de-Rabbi Elieser zum Vers „und Jizchak säte“<sup data-src="gen-26-12"></sup> sagt: „Hat Jizchak etwa Weizen gesät, G-tt behüte? Nein — er nahm den Zehnten seines ganzen Reichtums und säte Zedaka für die Armen, wie es heißt: ‚Sät euch zur Gerechtigkeit.‘“<sup data-src="pdre-33"></sup><sup data-src="hosea-10-12"></sup></p><p>Ein Vers verlässt nicht seinen einfachen Sinn: Jizchak säte Weizen im wörtlichen Sinn, und das war der Reichtum, von dem er den Zehnten nahm. Aber „G-tt behüte“ zu sagen, dass sein Tun „und er säte“ in seinem <b>Sinn und Wesen</b> das Säen von Weizen war. Nein: Für <b>ihn</b> war der Sinn des Tuns „Weizen säen“: „Sät euch zur Gerechtigkeit.“</p>`,
        },
        {
          h: 'Der Zehnte — für die Zedaka',
          b: `<p>Man kann auch nach einem anderen Wort der Weisen bemerken: Jizchak führte den Zehnten ein,<sup data-src="rambam-kings-9-1"></sup> und den Zehnten gibt man gerade vom Ertrag, der dem Menschen selbst gehört — darum, und nur darum, säte er Weizen: um den Zehnten abzusondern.</p><p>Und man kann sagen, dass es dasselbe ist: Die Wurzel der Mizwa des Zehnten und Ähnlichem ist die Zedaka.</p>`,
        },
        {
          h: 'Durch die Akeda wurde auch die „Asche“ geheiligt',
          b: `<p>Darum ist „die Asche Jizchaks… aufgehäuft auf dem Altar“: Durch die Akeda wurde Jizchak so geheiligt, dass kein Platz blieb für das „Alltägliche“, das nach „draußen“ gehört — sogar seine „<b>Asche</b>“, alle seine körperlichen Dinge, ist „aufgehäuft auf dem Altar“, alles ganz für G-tt.</p><p>Das erklärt auch, warum man das Verdienst der Akeda gerade mit dem Wort „Asche“ ausdrückt: Das Verdienst der Akeda beruht darauf, wie Jizchak sich hingab — der besondere Vorzug seiner Hingabe liegt gerade im Neuen, dass „seine Asche… auf dem Altar aufgehäuft“ ist.<sup data-src="rashi-lev-26-42"></sup></p>`,
        },
        {
          h: 'Das Gebet — anstelle des täglichen Opfers',
          b: `<p>Die Lehre daraus für den Dienst jedes Einzelnen:</p><p>Einer der Gründe, warum man den Abschnitt der Akeda jeden Tag sagt, ist: „um seinen Trieb zu bezwingen, G-tt zu dienen, so wie Jizchak seine Seele hingab“. Man muss wissen: Dieses Bezwingen soll dazu führen, dass auch die „<b>Asche</b>“ (das Körperliche) eines Juden „auf dem Altar aufgehäuft“ ist.</p><p>Das bedeutet: „Die Gebete wurden anstelle der täglichen Opfer eingeführt“,<sup data-src="berakhot-26b"></sup> und das tägliche Opfer ist eine Ola, ganz für G-tt. Denn die Vollkommenheit des Gebets ist, dass ein Jude sich ganz dem Heiligen, gelobt sei Er, hingibt.</p>`,
        },
        {
          h: '„Wenn kein Platz für die Maaracha ist“',
          b: `<p>Aber die Hingabe im Gebet „erlaubt“, dass ein Jude nach dem Gebet „vor das Lager“ geht und sich mit seinen körperlichen Dingen beschäftigt. Zwar bewirkt das Gebet, dass diese Beschäftigungen nur „an einen reinen Ort“ gehen — alle deine Taten um des Himmels willen —, aber trotzdem sind sie <b>vor</b> dem Lager.</p><p>Dazu kommt die Klarstellung: Der Grund für das Hinaustragen der Asche ist „wenn kein Platz für die Maaracha ist“;<sup data-src="rashi-lev-6-4"></sup> wenn aber Platz für die Maaracha <b>da ist</b>, trägt man die Asche nicht hinaus. Die „Erlaubnis“, sich so „vor dem Lager“ mit Körperlichem zu beschäftigen, gilt nur, wenn daraus ein Nutzen für die nächste Maaracha wächst: damit man am nächsten Tag besser beten kann.</p>`,
        },
        {
          h: 'Der Platz eines Juden ist drinnen',
          b: `<p>Der Platz eines Juden ist drinnen. Zwar ist er eine Seele in einem Körper und hat körperliche Bedürfnisse — aber es genügt ihm, sich mit dem Körperlichen „neben dem Altar“ zu beschäftigen; „vor das Lager“ hinauszugehen ist nicht der Platz eines Juden. Auch wenn er Erlaubtes um des Himmels willen tut, ist das ein niedrigerer Dienst: Er schenkt seinem Lehrer nicht den Becher ein, sondern kocht ihm einen Topf, und er muss „seine Kleider“ wechseln (seine Begeisterung — für das „Kochen“ — in Tat, Rede und Gedanke).<sup data-src="lev-6-3"></sup></p>`,
        },
        {
          h: 'Die Stufe Jizchaks in jedem',
          b: `<p>Darum sagt man den Abschnitt der Akeda vor allen Dingen des Tages: Um das zu spüren, braucht man Hingabe wie Jizchak. Die Hingabe im Gebet soll so sein, dass sie den Körper und alle körperlichen Beschäftigungen „mitreißt“, bis man spürt, dass es bei einem kein „vor dem Lager“ gibt und das Körperliche ganz von Heiligkeit durchdrungen ist.</p><p>Und dann, auch wenn er nach dem Gebet „vor das Lager“ geht, um sich mit den Dingen der Welt zu beschäftigen, und sie so führt, wie es in der Welt üblich ist — spürt er, dass er nur äußerlich „vor dem Lager“ ist. Sein Inneres, und besonders von der Seite seiner Seele her — die Stufe Jizchaks in ihm —, ist „die Asche… aufgehäuft auf dem Altar“.</p><p>Und dadurch beschäftigt er sich so mit dem Körperlichen, dass seine ganze Absicht nur der Nutzen ist, der daraus für den Dienst G-ttes wächst, für den Platz der Maaracha.</p>`,
        },
      ],
      reflection: 'Was nehme ich nach dem Morgengebet mit in die Aufgaben des Tages — und helfen sie mir, morgen besser zu beten?',
      takeaways: [
        'Bei der Akeda gab Jizchak sich in der Tat hin: Seine Seele flog davon; Awraham berührte das Feuer nicht.',
        'So eine Hingabe kommt aus dem Wesen der Seele und reichte bis in den Körper: Alles Körperliche Jizchaks wurde zur Ola.',
        '„Und Jizchak säte“: Der Sinn des Weizensäens war Zedaka.',
        'Darum ist bei Jizchak sogar die „Asche“ auf dem Altar: Für „draußen“ gibt es keinen Platz.',
        'Die Lehre: Nach dem Gebet beschäftige dich mit dem Alltag „neben dem Altar“ — damit du morgen besser beten kannst.',
      ],
      puzzle: {
        q: 'Ordne die Antwort des Rebben: von der Akeda — zum Morgen jedes Tages.',
        pieces: ['Jizchaks Seele flog davon', 'Hingabe — bis in den Körper', 'Säen — für die Zedaka', 'Sogar die Asche auf dem Altar', 'Der Alltag — für die Maaracha'],
        meaning: 'Jizchaks Hingabe heiligte sogar seinen Alltag; so soll auch das Gebet den ganzen Körper mitreißen, damit danach die Aufgaben des Tages der nächsten „Maaracha“ dienen.',
      },
    },
  ],
  final: {
    title: 'Ermittlung gelöst',
    allSolved:
      'Alle vier Rätsel gelöst. Die Asche Jizchaks blieb auf dem Altar: Bei der Akeda gab es weder „Terumat HaDeschen“ noch das Hinaustragen der Asche. Und tiefer: Die Akeda dauert jeden Augenblick an, und Jizchaks Hingabe, die bis in den Körper reichte, heiligte sogar seinen Alltag. Darum sollen auch wir uns nach dem Gebet mit unseren Aufgaben „neben dem Altar“ beschäftigen.',
  },
  puzzle: {
    q: 'Ordne den Weg der Rede.',
    pieces: ['Jizchak — Ola Temima', 'Asche auf dem Altar aufgehäuft', 'Die Akeda — jetzt', 'Asche — der Alltag', 'Der Alltag — beim Altar'],
    meaning: 'Von der Frage nach der Asche Jizchaks zum Wichtigsten: Jizchaks Hingabe heiligte sogar seine „Asche“, und das Gebet von jedem von uns kann seinen Alltag heiligen.',
  },
  audience: 'Ab 11 Jahren: die Gesetze des Ola-Opfers und der Asche des Altars, Midraschim über die Akeda und eine Lehre für jeden Tag. Jüngere Kinder — zusammen mit einem Erwachsenen.',
  practice:
    'Wähle heute nach dem Morgengebet eine alltägliche Aufgabe — eine Mahlzeit, Hausaufgaben, Arbeit — und tu sie so, dass sie dir hilft, morgen besser zu beten und zu lernen: zum Beispiel rechtzeitig schlafen gehen oder die Aufgabe ruhig und ehrlich erledigen.',
  highlight: '„Die Asche Jizchaks erscheint vor Mir, aufgehäuft und liegend auf dem Altar“ (Raschi, Wajikra 26,42): Die Akeda dauert jeden Augenblick an.',
  share: ({ score, max, time, grid, allSolved, site }) => `✨ Warum sagen die Weisen, dass „die Asche Jizchaks auf dem Altar aufgehäuft ist“, obwohl man die Asche eines Opfers nach dem Gesetz wegräumt?

Ich ermittle zusammen mit dem Lubawitscher Rebben — „Niflaot des Rebben“, Abschnitt Toldot. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bis jetzt:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: Ola Temima, die Akeda jetzt, Asche ist der Alltag, und ganz auf dem Altar.
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Die Ermittlung folgt einer Rede des Lubawitscher Rebben am Schabbat Behar-Bechukotai 5728 (Likkutej Sichot, Bd. 25, Toldot, Rede 3), in hebräischer Übersetzung; Nacherzählung des Projekts.',
};

export default de;
