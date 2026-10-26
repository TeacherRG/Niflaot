import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Ein ewiger Bund',
  hero: {
    heading: 'Warum ist die Beschneidung mit <i>acht Tagen</i> größer als mit dreizehn Jahren?',
    author: 'nach einer Rede des Lubawitscher Rebben · Likkutej Sichot, Bd. 25, Wajera',
    intro:
      'Jizchak und Jischmael streiten, wen G-tt mehr liebt. Jischmael: „Ich wurde mit dreizehn beschnitten — ich hätte Nein sagen können und habe es nicht getan!“ Jizchak: „Und ich — mit acht Tagen.“ Aber welches Verdienst hat ein Baby, das nichts gewählt hat? Ermittle zusammen mit dem Rebben — und finde heraus, was ein „ewiger Bund“ ist.',
  },
  summary:
    'Jischmael wurde mit dreizehn Jahren beschnitten, Jizchak mit acht Tagen. Warum ist Jizchak „beliebter“? Der Rebbe erklärt: Die Brit Mila ist ein „ewiger Bund“, und G-tt schließt ihn, nicht der Mensch. Darum macht man sie gleich, schon beim Baby — und erst bei Jizchak wurde sichtbar, dass dieser Bund ganz von oben kommt.',
  glossary: {},
  riddles: [
    {
      title: 'Acht Tage oder dreizehn Jahre',
      cond: `<p>Der Midrasch erzählt:</p><p class="verse" dir="rtl" lang="he">יצחק וישמעאל היו מדיינים זה עם זה, זה אומר אני חביב ממך שנמלתי לשלש עשרה שנה, וזה אמר חביב אני ממך שנמלתי לשמונה ימים</p><p>„Jizchak und Jischmael stritten miteinander. Der eine sagte: ‚Ich bin beliebter als du, denn ich wurde mit dreizehn Jahren beschnitten.‘ Und der andere sagte: ‚Ich bin beliebter als du, denn ich wurde mit acht Tagen beschnitten.‘“<sup data-src="bereshit-rabbah-55-4"></sup></p><p>Warum dreizehn Jahre ein Verdienst sind, ist klar: Jischmael hätte sich weigern können, und er hat es nicht getan.<sup data-src="rashi-22-1"></sup> Aber was ist das Verdienst von acht Tagen? Ein Baby hat doch nichts entschieden!</p>`,
      steps: [
        {
          q: 'Wie erklärt Jischmael, warum er „beliebter“ ist?',
          hint: 'Mit dreizehn kann man schon „Nein“ sagen.',
          opts: ['„ich hätte mich wehren können — und habe mich nicht gewehrt“', '„ich bin der Erstgeborene“', '„ich wurde als Erster beschnitten“', '„mein Vater hat mich beschnitten“'],
        },
        {
          q: 'Die Erklärer des Midrasch erklären das Verdienst Jizchaks mit einer Regel. Mit welcher?',
          hint: 'Diese Mizwa hat ihren eigenen Tag.',
          opts: ['„eine Mizwa zu ihrer Zeit ist besser“', '„eine Mizwa zieht eine Mizwa nach sich“', '„der Lohn einer Mizwa ist eine Mizwa“', '„man mischt nicht eine Freude mit einer anderen“'],
        },
        {
          q: 'Wo steht in der Tora, dass die Zeit der Beschneidung acht Tage ist?',
          hint: 'G-tt spricht zu Awraham über alle seine Nachkommen.',
          opts: ['„Mit acht Tagen soll bei euch beschnitten werden“', '„An eben diesem Tag“', '„Beschnitten werde, wer in deinem Haus geboren ist“', '„Ihr sollt das Fleisch eurer Vorhaut beschneiden“'],
        },
        {
          q: 'G-tt hat Jischmael nicht mit acht Tagen befohlen, sich zu beschneiden. Wann war dann für ihn „die Zeit“ der Mizwa?',
          hint: 'Schau, wie alt Jischmael an diesem Tag war.',
          opts: ['„mit dreizehn Jahren“', '„mit acht Tagen“', '„mit neunundneunzig Jahren“', '„mit siebenunddreißig Jahren“'],
        },
        {
          q: '„Eine Mizwa zu ihrer Zeit“ — ein Vorteil worin?',
          hint: 'Ist die Zeit die ganze Mizwa oder nur eine Einzelheit?',
          opts: ['„in einer Einzelheit der Mizwa — ihrer Zeit“', '„in der ganzen Mizwa“', '„im Lohn der Mizwa“', '„in der Absicht der Mizwa“'],
        },
      ],
      reveal: {
        h: 'Eine Einzelheit gegen das Ganze',
        p: '„Eine Mizwa zu ihrer Zeit“ ist ein Vorteil nur in einer Einzelheit der Mizwa — in ihrer Zeit. Aber das Verdienst Jischmaels betrifft die ganze Mizwa: „Ich hätte mich wehren können — und habe mich nicht gewehrt.“ Wie kann Jizchak das eine mit dem anderen vergleichen und sagen „Ich bin beliebter als du“? Und für Jischmael waren dreizehn Jahre ja „die Zeit“: Da hat G-tt es ihm befohlen.<sup data-src="gen-17-24"></sup> Also ist „mit acht Tagen beschnitten“ keine Einzelheit, sondern betrifft die ganze Beschneidung: Eine Beschneidung mit acht Tagen ist von anderer Art und anderer Qualität.',
      },
      lessons: [
        {
          h: 'Der Streit der Brüder',
          b: `<p>Im Midrasch wird erzählt: „Jizchak und Jischmael stritten miteinander. Der eine sagte: ‚Ich bin beliebter als du, denn ich wurde mit dreizehn Jahren beschnitten.‘ Und der andere sagte: ‚Ich bin beliebter als du, denn ich wurde mit acht Tagen beschnitten.‘“<sup data-src="bereshit-rabbah-55-4"></sup></p><p>Das muss man verstehen. Warum „mit dreizehn Jahren beschnitten“ einen Menschen „beliebter“ macht, ist einfach. So begründet es Jischmael später im Midrasch: „Denn ich hätte mich wehren können — und habe mich nicht gewehrt“ (so erzählt es auch Raschi am Anfang der Bindung Jizchaks: Jischmael prahlte vor Jizchak, dass er mit dreizehn beschnitten wurde und sich nicht wehrte<sup data-src="rashi-22-1"></sup>). Aber welchen Vorteil hat „ich wurde mit acht Tagen beschnitten“, sodass Jizchak deshalb sagt: „Ich bin beliebter als du“?</p>`,
        },
        {
          h: '„Eine Mizwa zu ihrer Zeit“',
          b: `<p>Die Erklärer des Midrasch sagen: Der Vorteil ist, dass „eine Mizwa zu ihrer Zeit besser ist“, und die Zeit der Mizwa der Beschneidung ist „acht Tage“: „Mit acht Tagen soll bei euch jedes Männliche beschnitten werden, in all euren Generationen.“<sup data-src="gen-17-12"></sup></p><p>Aber das reicht noch nicht. Denn G-tt hat Jischmael erst befohlen, sich zu beschneiden, als er dreizehn Jahre alt war<sup data-src="gen-17-24"></sup> — deshalb kann man nicht sagen, dass ihm der Vorteil „eine Mizwa zu ihrer Zeit“ fehlt: Für ihn war damals (mit dreizehn) „die Zeit“ der Mizwa.</p><p>(So wurde schon einmal erklärt, warum Awraham sich an Jom Kippur beschneiden durfte, obwohl das Gesetz sagt, dass eine Beschneidung nicht an ihrem Tag Schabbat und Feiertag nicht verdrängt — und Awraham hielt ja die ganze Tora, bevor sie gegeben wurde:<sup data-src="yoma-28b"></sup> Weil er damals den Befehl zur Beschneidung bekam, war es für ihn eine Beschneidung an ihrem Tag.)</p>`,
        },
        {
          h: 'Einzelheit und Ganzes',
          b: `<p>Und noch etwas. „Eine Mizwa zu ihrer Zeit ist besser“ ist nur ein Vorteil in einer Einzelheit der Mizwa — in ihrer Zeit. Wie kann man also vergleichen, dass Jizchak die Mizwa „zu ihrer Zeit“ erfüllte, mit dem Vorteil der Beschneidung Jischmaels, der die ganze Erfüllung der Mizwa betrifft („ich hätte mich wehren können — und habe mich nicht gewehrt“),<sup data-src="bereshit-rabbah-55-4"></sup> sodass Jizchak deshalb sagt: „Ich bin beliebter als du“?</p><p>Man muss also sagen: Dass Jizchak „mit acht Tagen beschnitten“ wurde, ist nicht nur eine Einzelheit der Mizwa — ihre Zeit. Es betrifft die ganze Beschneidung: Eine Beschneidung mit acht Tagen ist von anderer Art und anderer Qualität.</p>`,
        },
      ],
      reflection: 'Was ist mir bei einer guten Tat wichtiger: dass ich sie selbst gewählt habe — oder dass G-tt es gesagt hat?',
      takeaways: [
        'Der Midrasch: Jischmael — „ich wurde mit dreizehn beschnitten“, Jizchak — „und ich mit acht Tagen“; jeder sagt: „Ich bin beliebter.“',
        'Das Verdienst Jischmaels ist klar: Er hätte sich wehren können — und tat es nicht.',
        'Die Erklärer: Jizchak hatte „eine Mizwa zu ihrer Zeit“; die Zeit der Beschneidung sind acht Tage.',
        'Aber für Jischmael waren dreizehn Jahre „die Zeit“ — da hat G-tt es ihm befohlen.',
        'Und die Zeit ist nur eine Einzelheit der Mizwa. Also ist die Beschneidung mit acht Tagen von anderer Art.',
      ],
      puzzle: {
        q: 'Ordne die Ermittlung: vom Streit — zur Frage des Rebben.',
        pieces: ['Jizchak und Jischmael streiten', '„Ich hätte mich wehren können“', '„Eine Mizwa zu ihrer Zeit“', 'Für Jischmael — auch seine Zeit', 'Acht Tage — von anderer Art'],
        meaning: 'Die Antwort „eine Mizwa zu ihrer Zeit“ erklärt den Streit nicht: Die Zeit ist nur eine Einzelheit. Also unterscheidet sich die Beschneidung mit acht Tagen im Wesen.',
      },
    },
    {
      title: 'Ein ewiger Bund',
      cond: `<p>Die Weisen zählen auf, wer welches Gebot bekam: „Der erste Mensch bekam sieben Gebote… Noach kam das Verbot dazu, ein Glied von einem lebenden Tier zu essen… Awraham bekam die Beschneidung, <b>Jizchak weihte sie mit acht Tagen ein</b>.“ Denn Jizchak wurde als Erster mit acht Tagen beschnitten:</p><p class="verse" dir="rtl" lang="he">וימל אברהם את יצחק בנו בן שמנת ימים כאשר צוה אתו אלקים</p><p>„Und Awraham beschnitt seinen Sohn Jizchak mit acht Tagen, wie G-tt es ihm befohlen hatte.“<sup data-src="gen-21-4"></sup></p><p>Der Midrasch trennt die „acht Tage“ von der Brit Mila selbst — wie ein eigenes Gebot. Warum? Der Rebbe sucht die Antwort darin, was die Brit Mila ist: „Und Mein Bund soll an eurem Fleisch ein ewiger Bund sein.“<sup data-src="gen-17-13"></sup></p>`,
      steps: [
        {
          q: 'Was hat Jizchak nach dem Midrasch zum Gebot der Beschneidung hinzugefügt?',
          hint: 'Awraham bekam das Gebot, und Jizchak…',
          opts: ['„er weihte sie mit acht Tagen ein“', '„das Verbot des Hüftnervs“', '„das Verbot eines Glieds vom lebenden Tier“', '„die Schwagerehe“'],
        },
        {
          q: 'Was für ein Bund soll die Brit Mila nach dem Vers sein?',
          hint: '„…an eurem Fleisch ein … Bund“',
          opts: ['„ein ewiger Bund“', '„ein ewiger Besitz“', '„ein ewiger Knecht“', '„ein ewiges Gesetz“'],
        },
        {
          q: 'Warum schließen zwei Menschen, die sich lieben, einen Bund?',
          hint: 'Solange alles gut ist, braucht man keinen Bund.',
          opts: ['„damit die Liebe bleibt, auch wenn etwas sie stört“', '„um einen Lohn zu bekommen“', '„damit die Liebe anfängt“', '„um es allen zu erzählen“'],
        },
        {
          q: 'Aber ein Bund zwischen zwei Menschen kann sich doch ändern. Warum?',
          hint: 'Menschen sind Geschöpfe.',
          opts: ['„ein Geschöpf kann sich ändern“', '„ein Bund wird nicht aufgeschrieben“', '„ein Bund hat keine Zeugen“', '„ein Bund wird mit Blut geschlossen“'],
        },
        {
          q: 'Awraham hielt die ganze Tora, bevor sie gegeben wurde. Warum machte er die Brit Mila erst, als G-tt es ihm befahl?',
          hint: 'Etwas Ewiges — wer kann es schaffen?',
          opts: ['„ein Geschöpf kann keinen ewigen Bund schaffen“', '„er wusste nichts von dieser Mizwa“', '„er hatte Angst vor dem Schmerz“', '„er wartete auf die Geburt Jizchaks“'],
        },
      ],
      reveal: {
        h: 'Ewig heißt: von G-tt',
        p: 'Die Brit Mila ist ein „ewiger Bund“:<sup data-src="gen-17-13"></sup> eine ewige Verbindung zwischen dem Beschnittenen und G-tt. Ein Bund zwischen zwei Menschen, so stark er auch ist, kann sich ändern: Der Mensch ist ein Geschöpf, und ein Geschöpf kann sich ändern. Aber wenn G-tt Selbst den Bund schließt — mit einem Juden, der beschnitten ist —, ist es ein „ewiger Bund“, und er kann sich nie ändern. Darum hat Awraham, der die ganze Tora hielt, bevor sie gegeben wurde,<sup data-src="yoma-28b"></sup> sich nicht selbst beschnitten, bis G-tt es ihm befahl: Ein Geschöpf kann aus eigener Kraft nichts Ewiges schaffen.',
      },
      lessons: [
        {
          h: 'Jizchak weihte den achten Tag ein',
          b: `<p>Das sieht man auch an den Worten der Weisen: „Der erste Mensch bekam sieben Gebote… Noach kam das Verbot eines Glieds vom lebenden Tier dazu… Awraham bekam die Beschneidung, Jizchak weihte sie mit acht Tagen ein“ — denn Jizchak war „der Erste, der mit acht Tagen beschnitten wurde“: „Und Awraham beschnitt seinen Sohn Jizchak mit acht Tagen.“<sup data-src="gen-21-4"></sup></p><p>Aber auf den ersten Blick: Warum teilt der Midrasch das Gebot der Beschneidung in zwei Teile — den Befehl an Awraham und die „Einweihung“ mit acht Tagen (durch Jizchak)? Soll man wegen einer Einzelheit (Beschneidung mit acht Tagen) Jizchak die „Einweihung“ des Gebots der Beschneidung zuschreiben? Und mehr noch: Der Midrasch macht daraus einen eigenen Teil, als wäre es etwas Neues wie das Verbot eines Glieds vom lebenden Tier, das Noach dazubekam.</p><p>Also ist „mit acht Tagen beschnitten“ das Hauptneue im Gebot der Beschneidung selbst.</p>`,
        },
        {
          h: 'Was ein Bund ist',
          b: `<p>Man kann es so sagen. Der Inhalt der Brit Mila ist (mit den Worten des Verses): „Und Mein Bund soll an eurem Fleisch ein ewiger Bund sein“:<sup data-src="gen-17-13"></sup> Durch die Brit Mila entsteht eine ewige Verbindung zwischen dem Beschnittenen und dem Heiligen, gesegnet sei Er — ein Bund.</p><p>Der Sinn eines Bundes zwischen zwei, die sich lieben: Wenn sie sicher sein wollen, dass ihre Liebe so ist, dass nichts sie stört, stärken sie sie mit einem Bund. Durch den Bund sind sie so verbunden, dass selbst wenn ein Grund kommt, der die Liebe stören könnte, er sie nicht stört.</p>`,
        },
        {
          h: 'Ein Bund, der sich nicht ändert',
          b: `<p>Aber wenn zwei Menschen einen Bund schließen, kann es sein, dass auch der Bund schwächer wird: Ein Geschöpf kann sich ändern. Wenn aber der Heilige, gesegnet sei Er, den Bund schließt — und in unserem Fall mit dem jüdischen Volk (dadurch, dass ein Jude beschnitten wird) —, ist es ein „ewiger Bund“,<sup data-src="gen-17-13"></sup> und er kann sich überhaupt nicht ändern.</p><p>Das ist auch eine der Erklärungen, warum Awraham sich nicht selbst beschnitt, bis der Heilige, gesegnet sei Er, es ihm befahl — obwohl Awraham die ganze Tora hielt, bevor sie gegeben wurde:<sup data-src="yoma-28b"></sup> Ein Geschöpf kann aus eigener Kraft nichts machen, was zu einem „ewigen Bund“ gehört. Ein ewiger Bund ist nur möglich, wenn der Schöpfer das Gebot gibt und Er Selbst „den Bund schließt“.</p>`,
        },
      ],
      reflection: 'Manchmal habe ich keine Lust auf eine Mizwa oder bin wütend. Ändert das meine Verbindung mit G-tt?',
      takeaways: [
        'Der Midrasch: Awraham bekam die Beschneidung, und Jizchak „weihte sie mit acht Tagen ein“ — wie ein eigenes Gebot.',
        'Also sind die acht Tage das Hauptneue in der Brit Mila selbst.',
        'Die Brit Mila ist ein „ewiger Bund“: eine Verbindung, die nichts stören kann.',
        'Ein Bund von Menschen kann schwächer werden — Geschöpfe ändern sich; der Bund G-ttes ist ewig.',
        'Darum hat Awraham sich nicht selbst beschnitten, bis G-tt es befahl: Ein Geschöpf kann nichts Ewiges schaffen.',
      ],
      puzzle: {
        q: 'Ordne die Antwort des Rebben: vom Midrasch — zum ewigen Bund.',
        pieces: ['Jizchak weihte den achten Tag ein', 'Die Brit Mila ist ein Bund', 'Ein Bund von Menschen kann sich ändern', 'Der Bund G-ttes ist ewig', 'Awraham wartete auf den Befehl'],
        meaning: 'Die Brit Mila ist ein ewiger Bund, und nur G-tt kann Ewiges schaffen; darum wartete auch Awraham auf Seinen Befehl.',
      },
    },
    {
      title: 'Warum ein Baby',
      cond: `<p>Drei Beschneidungen — drei Alter:</p><p class="verse" dir="rtl" lang="he">ואברהם בן תשעים ותשע שנה בהמלו בשר ערלתו וישמעאל בנו בן שלש עשרה שנה</p><p>„Awraham war neunundneunzig Jahre alt, als er beschnitten wurde, und sein Sohn Jischmael war dreizehn Jahre alt.“<sup data-src="gen-17-24"></sup> Und Jizchak wurde mit acht Tagen beschnitten.<sup data-src="gen-21-4"></sup></p><p>Was ein Mensch aus eigener Kraft tut, das tut er, wenn er bereit ist: wenn er versteht und selbst mitmachen kann. Warum macht man die Brit Mila dann bei einem Baby, das nichts versteht? Und warum ist die Beschneidung Jizchaks, „des Ersten, der mit acht Tagen beschnitten wurde“, größer als die von Awraham selbst?</p>`,
      steps: [
        {
          q: 'Wer schließt eigentlich den Bund der Brit Mila?',
          hint: 'Die Beschneidung macht ein Mensch. Und den Bund?',
          opts: ['„der Heilige, gesegnet sei Er“', '„der, der beschnitten wird“', '„der Mohel“', '„der Vater des Kindes“'],
        },
        {
          q: 'Wann soll man die Brit Mila dann machen?',
          hint: 'Es hat keinen Sinn zu warten, bis das Kind groß ist.',
          opts: ['„bei der ersten Gelegenheit“', '„wenn es groß ist und versteht“', '„bei der Bar Mizwa“', '„wenn es selbst will“'],
        },
        {
          q: 'Die Weisen: Awraham erkannte seinen Schöpfer, als er … alt war.',
          hint: 'Noch ein kleines Kind.',
          opts: ['„drei Jahre“', '„acht Tage“', '„dreizehn Jahre“', '„neunundneunzig Jahre“'],
        },
        {
          q: 'Vor der Brit Mila sagte G-tt zu Awraham: „Wandle vor Mir und sei…“',
          hint: 'Raschi: Solange die Vorhaut da ist, gibt es einen Makel.',
          opts: ['„vollkommen (tamim)“', '„reich“', '„ein König“', '„ein Ältester“'],
        },
        {
          q: 'Was war der ganze Dienst Awrahams bis neunundneunzig für den Bund?',
          hint: 'Kein Grund und keine Bezahlung.',
          opts: ['„eine Vorbereitung auf den Bund“', '„ein Gefäß und Grund für den Bund“', '„eine Bezahlung für den Bund“', '„hat mit dem Bund nichts zu tun“'],
        },
        {
          q: 'Bei wem wurde sichtbar, dass der Bund der Brit Mila ganz von G-tt kommt?',
          hint: 'Bei dem, der selbst nichts entschieden hat.',
          opts: ['„bei Jizchak“', '„bei Awraham“', '„bei Jischmael“', '„bei Jaakow“'],
        },
      ],
      reveal: {
        h: 'Ein Geschenk von oben',
        p: 'Den Bund der Brit Mila schließt G-tt, nicht der Mensch: Die Beschneidung machen Menschen, aber die Verbindung, die entsteht, kommt ganz vom Heiligen, gesegnet sei Er. Darum hat es keinen Sinn zu warten, bis das Kind groß ist — auch dann wäre der Bund nicht sein Werk —, und man macht die Brit Mila bei der ersten Gelegenheit, mit acht Tagen. Awraham bekam die Brit Mila erst nach einem langen Weg — von drei Jahren bis neunundneunzig,<sup data-src="nedarim-32a"></sup> und sein Dienst war nur eine Vorbereitung: Der Bund ist ein Geschenk von oben. Aber weil er nach dem Dienst Awrahams und nach seiner Entscheidung kam, sah man bei ihm nicht, dass der Bund ganz von oben kommt. Das wurde erst bei Jizchak sichtbar, der mit acht Tagen beschnitten wurde.',
      },
      lessons: [
        {
          h: 'Warum gerade mit acht Tagen',
          b: `<p>Daraus versteht man auch, warum die Zeit der Brit Mila gerade in der Kindheit ist, mit acht Tagen, wenn der, der beschnitten wird, überhaupt nicht selbst bei der Mizwa mitmachen kann.<sup data-src="gen-21-4"></sup></p><p>Was ein Mensch aus eigener Kraft tut, braucht Vorbereitung und eine Zeit, in der er bereit ist und es tun kann. Aber der „Bund“, der durch die Brit Mila entsteht, kommt ganz vom Schöpfer — die „Hände“ des Menschen, der beschnitten wird, haben daran keinen Anteil.</p>`,
        },
        {
          h: 'Nicht der Mensch zu G-tt, sondern G-tt zum Menschen',
          b: `<p>Die Handlung der Mizwa selbst macht zwar ein Mensch, aber der Bund, der dabei entsteht, ist vom Heiligen, gesegnet sei Er.<sup data-src="gen-17-13"></sup> Das heißt: Der Sinn der Brit Mila ist nicht, dass ein Mensch sich mit dem Heiligen, gesegnet sei Er, verbindet, sondern umgekehrt: Wenn ein Jude beschnitten wird, verbindet Sich der Heilige, gesegnet sei Er, mit ihm in einem „ewigen Bund“.</p><p>Darum hat es überhaupt keinen Sinn zu warten, bis das Kind groß ist und selbst bei der Mizwa mitmachen kann: Es wäre sowieso nicht die ganze Handlung. Im Gegenteil — bei der ersten Gelegenheit (wenn das Kind gesund genug ist, mit acht Tagen) wird es beschnitten.</p>`,
        },
        {
          h: 'Awrahams Weg',
          b: `<p>So versteht man auch den Vorteil der Beschneidung Jizchaks — „des Ersten, der mit acht Tagen beschnitten wurde“ — gegenüber der Beschneidung Awrahams (und Jischmaels).</p><p>Awraham bekam das Gebot der Beschneidung erst, nachdem er sich mit seinem ganzen früheren Dienst darauf vorbereitet hatte, bis er neunundneunzig Jahre alt war. Und er ging der Reihe nach, Stufe für Stufe: davon, dass er „seinen Schöpfer erkannte“ (nach verschiedenen Meinungen — mit drei,<sup data-src="nedarim-32a"></sup> mit vierzig, mit achtundvierzig), über seinen Dienst, G-tt in der Welt bekannt zu machen, bis zur höchsten Vollkommenheit, die für ein Geschöpf möglich ist. Erst danach bekam er (von oben) das Gebot der Beschneidung, durch das er „vollkommen“ wurde: „Wandle vor Mir und sei vollkommen.“<sup data-src="gen-17-1"></sup> (Raschi: „Durch diese Mizwa wirst du vollkommen sein: Solange die Vorhaut an dir ist, hast du einen Makel vor Mir.“<sup data-src="rashi-17-1"></sup>)</p><p>Darum sah man bei seiner Brit Mila nicht deutlich, dass dieser „Bund“ eine Verbindung ist, die ganz und nur von oben kommt.</p>`,
        },
        {
          h: 'Eine Vorbereitung, kein Grund',
          b: `<p>Das heißt: Auch bei Awraham war sein früherer Dienst kein „Gefäß“ für den Bund, kein Grund für den Bund. Denn der Bund, der durch die Brit Mila entsteht, ist ein „ewiger Bund“,<sup data-src="gen-17-13"></sup> und ein Geschöpf, von dem es heißt „alles, was entsteht, vergeht“, kann nichts Ewiges machen. Der Größte der Großen (der die Mizwa am besten versteht) ist nicht „näher“ daran als der Kleinste der Kleinen.</p><p>Der Dienst Awrahams war nur eine Vorbereitung auf den Bund: Nachdem er seinen Dienst vollendet hatte, so weit ein Geschöpf es kann, gab ihm der Heilige, gesegnet sei Er, ein Geschenk von oben — einen „ewigen Bund“.</p><p>(So sagt die Gemara: „Hätte er ihm keine Freude gemacht, hätte er ihm kein Geschenk gegeben.“ Die Freude ist keine Bezahlung für das Geschenk und erst recht nichts, was den Geber zwingt: Ein Geschenk kommt vom Geber. Und trotzdem gibt man es gerade dann, wenn der andere einem Freude gemacht hat.)</p>`,
        },
        {
          h: 'Awrahams Entscheidung',
          b: `<p>Und trotzdem: Weil es nach dem Dienst Awrahams kam, war seine Erfüllung der Mizwa der Beschneidung mit seinem Dienst „vermischt“: Sogar die Brit Mila selbst war mit seiner eigenen „Entscheidung“ verbunden — dass er sich beschneiden muss. Der Befehl kam nicht nur vom Heiligen, gesegnet sei Er: Auch sein eigener Verstand entschied, dass er sich beschneiden muss.</p><p>Darum sah man bei ihm nicht deutlich, wie der Bund ganz von oben kommt. (Genauso bei Jischmael, der mit dreizehn beschnitten wurde, als er schon groß war und verstand:<sup data-src="gen-17-24"></sup> Jischmael war also mit seinem Verstand einverstanden, sich zu beschneiden und sich mit dem Heiligen, gesegnet sei Er, zu verbinden.)</p>`,
        },
        {
          h: 'Jizchak: der Bund ganz von oben',
          b: `<p>Erst bei Jizchak, der mit acht Tagen beschnitten wurde,<sup data-src="gen-21-4"></sup> wurde sichtbar, was der Bund der Brit Mila ist: eine Verbindung, die nicht vom Menschen kommt, der beschnitten wird, einem Geschöpf, sondern ganz vom Heiligen, gesegnet sei Er.</p><p>Darum sagt Jizchak zu Jischmael: „Ich bin beliebter als du, denn ich wurde mit acht Tagen beschnitten.“<sup data-src="bereshit-rabbah-55-4"></sup> Nicht weil er die Mizwa „pünktlich“ erfüllte, sondern weil man bei seiner Beschneidung das Wesen der Brit Mila sieht — einen ewigen Bund, den G-tt schließt.</p>`,
        },
      ],
      reflection: 'Ist meine Verbindung mit G-tt mein Verdienst oder Sein Geschenk? Was ändert das daran, wie ich lerne und bete?',
      takeaways: [
        'Den Bund der Brit Mila schließt G-tt: Der, der beschnitten wird, hat daran keinen Anteil.',
        'Darum macht man sie bei der ersten Gelegenheit — mit acht Tagen, ohne zu warten, bis das Kind groß ist.',
        'Awraham ging zur Brit Mila von drei Jahren bis neunundneunzig — und erst dann bekam er sie und wurde „vollkommen“.',
        'Sein Dienst war eine Vorbereitung auf den Bund, kein Grund: Das Ewige ist ein Geschenk von oben.',
        'Bei Awraham und Jischmael war die Brit Mila mit ihrer Entscheidung verbunden; erst bei Jizchak sieht man, dass der Bund ganz von oben kommt.',
      ],
      puzzle: {
        q: 'Ordne die Antwort des Rebben: vom Wesen des Bundes — zum Vorteil Jizchaks.',
        pieces: ['G-tt schließt den Bund', 'Brit Mila bei der ersten Gelegenheit', 'Awrahams Dienst — eine Vorbereitung', 'Ein Geschenk von oben', 'Jizchak: der Bund ganz von oben'],
        meaning: 'Weil der Bund von G-tt ist, gibt man ihn einem Baby; bei Awraham kam er nach seinem Dienst, bei Jizchak aber sah man, dass der Bund ein reines Geschenk von oben ist.',
      },
    },
  ],
  final: {
    title: 'Ermittlung gelöst',
    allSolved:
      'Alle drei Rätsel gelöst. Acht Tage sind nicht nur „eine Mizwa pünktlich“: Die Brit Mila ist ein ewiger Bund, und G-tt schließt ihn. Darum gibt man ihn einem Baby, und bei Jizchak wurde sichtbar, dass der Bund ganz ein Geschenk von oben ist.',
  },
  puzzle: {
    q: 'Ordne den Weg der Rede.',
    pieces: ['Jizchak und Jischmael streiten', 'Acht Tage — keine Einzelheit', 'Die Brit Mila — ein ewiger Bund', 'G-tt schließt ihn', 'Jizchak — der Bund von oben'],
    meaning: 'Die Beschneidung mit acht Tagen zeigt das Wesen der Brit Mila: einen ewigen Bund, den G-tt jedem Juden schenkt, noch bevor er etwas verstehen oder entscheiden kann.',
  },
  audience: 'Ab 11 Jahren: der Streit im Midrasch und der Sinn eines Bundes; die Brit Mila wird behutsam erklärt. Jüngere — zusammen mit Erwachsenen.',
  practice:
    'Deine Verbindung mit G-tt ist ein Geschenk von oben, kein Lohn dafür, wie groß und klug du bist. Mach heute eine Mizwa nicht, weil „ich es so entschieden habe“, sondern weil G-tt es befohlen hat — und freu dich, dass diese Verbindung immer deine ist.',
  highlight: '„Und Mein Bund soll an eurem Fleisch ein ewiger Bund sein“ (Bereschit 17,13): Den ewigen Bund schließt G-tt — darum gibt man ihn einem Baby mit acht Tagen.',
  share: ({ score, max, time, grid, allSolved, site }) => `✨ Jischmael wurde mit dreizehn Jahren beschnitten, Jizchak mit acht Tagen. Wen liebt G-tt mehr? Und warum macht man die Brit Mila bei einem Baby?

Ich ermittle zusammen mit dem Lubawitscher Rebben — „Niflaot des Rebben“, Abschnitt Wajera. ${allSolved ? 'Alle drei Rätsel gelöst:' : 'Mein Weg bis jetzt:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Drei Rätsel: acht Tage oder dreizehn Jahre, ein ewiger Bund und warum ein Baby.
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Die Ermittlung folgt einer Rede des Lubawitscher Rebben am letzten Tag von Pessach 5741 (Likkutej Sichot, Bd. 25, Wajera, Rede 3), in hebräischer Übersetzung; Nacherzählung des Projekts.',
};

export default de;
