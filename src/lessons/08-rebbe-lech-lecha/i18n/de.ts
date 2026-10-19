import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Vater vieler Völker',
  hero: {
    heading: 'Warum blieb der Buchstabe <i>ר</i> im Namen Awrahams?',
    author: 'nach Reden des Lubawitscher Rebben · Likkutej Sichot, Bd. 25 und Bd. 30, Lech Lecha',
    intro:
      'Awram wurde zu Awraham — „Vater vieler Völker“. Aber im Namen blieb der Buchstabe ר, der in diesen Worten nicht vorkommt. Und Sarai verlor ihren Buchstaben י. Warum durfte ein Buchstabe bleiben und der andere nicht? Und warum baute Awraham drei Altäre, wenn Raschi nur zwei erklärt? Ermittle zusammen mit dem Rebben.',
  },
  summary:
    'Der Buchstabe ר „rückte nicht von seinem Platz“ im Namen Awrahams, aber das י von Sarai ging zu Jehoschua. Warum? Und die drei Altäre Awrahams: Sie ernähren die Welt, sie sühnen — und der dritte, in Chewron, ist nur für G-tt: ein Zeichen für den Dritten Tempel und König David.',
  glossary: {},
  riddles: [
    {
      title: 'Der Buchstabe, der blieb',
      cond: `<p>G-tt sagte zu Awram:</p><p class="verse" dir="rtl" lang="he">ולא יקרא עוד את שמך אברם והיה שמך אברהם כי אב המון גוים נתתיך</p><p>„Du sollst nicht mehr Awram heißen, sondern dein Name soll Awraham sein, denn zum Vater vieler Völker habe Ich dich gemacht.“<sup data-src="gen-17-5"></sup></p><p>Raschi erklärt: „Vater vieler Völker“ — <b>Aw Hamon Gojim</b> — steckt im Namen אברהם selbst. Aber im Namen ist ein Buchstabe, der in diesen Worten fehlt. Raschi sagt: Dieser Buchstabe „rückte nicht von seinem Platz“ — denn sogar der Buchstabe י, den man aus dem Namen Sarai nahm, beschwerte sich, bis man ihn zum Namen Jehoschua hinzufügte.<sup data-src="rashi-17-5"></sup></p><p>Der Rebbe fragt: Was ist das für ein Beweis? Der Buchstabe י ist doch gerade weggegangen!</p>`,
      steps: [
        {
          q: 'Wie nennt Raschi die Verbindung zwischen „Vater vieler Völker“ und dem Namen Awraham?',
          hint: 'Aus den Worten — Buchstabe für Buchstabe — entsteht der Name.',
          opts: ['„eine Abkürzung (Notarikon) seines Namens“', '„ein neuer Name ohne besonderen Sinn“', '„eine Übersetzung des Namens ins Aramäische“', '„der Name seiner Stadt“'],
        },
        {
          q: 'Welcher Buchstabe des Namens אברהם fehlt in den Worten אב המון („Vater vieler“)?',
          hint: 'Vergleiche die Buchstaben: א־ב — „Aw“, ה־מ — „Hamon“.',
          opts: ['der Buchstabe Resch', 'der Buchstabe Alef', 'der Buchstabe Bet', 'der Buchstabe He'],
        },
        {
          q: 'Raschi bringt als Beispiel das י aus dem Namen Sarai. Was tat es, als man es wegnahm?',
          hint: 'Der Buchstabe war „gekränkt“.',
          opts: ['„es beschwerte sich bei der Schechina“', '„es wurde vergessen“', '„es wurde zu einem He“', '„es wurde zweimal in der Tora geschrieben“'],
        },
        {
          q: 'Zu wessen Namen fügte man dieses י am Ende hinzu?',
          hint: 'Mosche gab Hoschea, dem Sohn Nuns, einen neuen Namen.',
          opts: ['„zum Namen Jehoschua“', '„zum Namen Jizchak“', '„zum Namen Israel“', '„zum Namen Jehuda“'],
        },
      ],
      reveal: {
        h: 'Ein Beweis für das Gegenteil?',
        p: 'Das י von Sarai ist gerade „von seinem Platz gerückt“ — es ging zu Jehoschua, zu einem anderen Namen und einem anderen Menschen<sup data-src="numbers-13-16"></sup>. Aber über das ר sagt Raschi: „Es rückte nicht von seinem Platz.“ Was ist das für ein Beweis? Und noch mehr: Raschi schreibt „denn <i>sogar</i> das י“ — also hatte das י weniger Grund, sich zu beschweren. Aber ist es nicht dasselbe: Beide Buchstaben wurden aus dem Namen eines Zaddik genommen? Und warum erklärt Raschi so ausführlich, woher das ר kommt: „Er war nur Vater für Aram“?',
      },
      lessons: [
        {
          h: 'Eine Abkürzung des Namens',
          b: `<p>Zum Vers „Du sollst nicht mehr Awram heißen, sondern dein Name soll Awraham sein, denn zum Vater vieler Völker habe Ich dich gemacht“<sup data-src="gen-17-5"></sup> bringt Raschi die Worte „denn … Vater vieler Völker“ und erklärt: „Eine Abkürzung [Notarikon] seines Namens. Und das Resch, das zuerst darin war — als er nur Vater für Aram war, seinen Ort, und jetzt ist er Vater für die ganze Welt —, sogar es rückte nicht von seinem Platz: Denn sogar das Jud von Sarai beschwerte sich bei der Schechina, bis man es zu Jehoschua hinzufügte, wie es heißt: ‚Und Mosche nannte Hoschea, den Sohn Nuns, Jehoschua.‘“<sup data-src="rashi-17-5"></sup></p><p>Der einfache Sinn: Die Worte „denn … Vater“ geben den Grund für den Namen Awraham — also steckt „Vater vieler Völker“ im Namen selbst. Darum erklärt Raschi: Es ist „eine Abkürzung seines Namens“. (Darum bringt Raschi auch das Wort „denn“, obwohl es nicht zur Abkürzung gehört: Gerade an „denn“ sieht man, dass hier der Name erklärt wird.)</p><p>Aber dann gibt es eine Frage: Warum blieb das ר im Namen Awraham, wenn es nicht zur Abkürzung gehört? Raschi antwortet: Es „rückte nicht von seinem Platz“, und bringt ein Beispiel und einen Beweis — das Jud von Sarai, von dem später im Kapitel steht: „Nenne sie nicht Sarai, denn Sara ist ihr Name.“<sup data-src="gen-17-15"></sup> Es „beschwerte sich bei der Schechina“ (weil man es aus Saras Namen nahm), „bis man es zu Jehoschua hinzufügte“. So auch hier: Damit sich das ר nicht beschwert wie das Jud von Sarai, nahm man es nicht aus Awrahams Namen.</p>`,
        },
        {
          h: 'Ein Beweis für das Gegenteil',
          b: `<p>Aber man muss verstehen. Erstens scheint das Beispiel mit dem Jud von Sarai das Gegenteil zu beweisen. Das Jud ist ja „von seinem Platz gerückt“ und wurde zu Jehoschua hinzugefügt<sup data-src="numbers-13-16"></sup> — zu einem anderen Namen und zu einem anderen Menschen. Aber hier sagt Raschi, dass das ר „nicht von seinem Platz rückte“!</p><p>Außerdem geschah das erst Hunderte Jahre später — und die ganze Zeit blieb das Jud bei seiner „Beschwerde“: Es stand da und rief viele Jahre lang, bis Jehoschua kam.</p>`,
        },
        {
          h: 'Das Wort „sogar“',
          b: `<p>Zweitens schreibt Raschi: „<b>denn sogar</b> das Jud von Sarai beschwerte sich“ — und nicht „<b>und genauso</b> das Jud“.<sup data-src="rashi-17-5"></sup> Daran sieht man: Das Jud von Sarai hatte weniger Grund, sich zu beschweren, als das ר von Awraham. Nicht nur das ר von Awraham, sondern <i>sogar</i> das Jud von Sarai beschwerte sich.</p><p>Das ist erstaunlich: Was ist der Unterschied zwischen ihnen? Beide haben doch denselben Grund für eine Beschwerde — ein Buchstabe wird aus dem Namen eines Zaddik genommen.</p>`,
        },
        {
          h: 'Raschis zusätzliche Worte',
          b: `<p>Das wird klar, wenn wir zuerst fragen, warum Raschi so lang schreibt: „Und das Resch, das zuerst darin war — als er nur Vater für Aram war, seinen Ort, und jetzt ist er Vater für die ganze Welt —, sogar es rückte nicht von seinem Platz.“</p><p>Raschi nennt den Namen „Awram“ hier gar nicht; er beginnt sofort: „Und das Resch, das zuerst darin war …“ (und erst dann fügt er hinzu: „als er nur Vater für Aram war“). Umso mehr, weil in der Gemara steht: „Zuerst wurde er Vater für Aram, und am Ende wurde er Vater für die ganze Welt.“<sup data-src="berakhot-13a"></sup> Also will Raschi hier nicht die Abkürzung des früheren Namens Awram erklären, sondern nur, warum das ר im Namen Awraham blieb. (Die Abkürzung des Namens Awram muss Raschi nicht erklären: Für den Sinn des Namens Awraham — „Vater vieler Völker“ — ist es nicht so wichtig, ob der frühere Name einen ähnlichen Sinn hatte.)</p><p>Aber wenn Raschi nur erklären will, warum das ר „nicht von seinem Platz rückte“, hätte er kurz sagen können: „Eine Abkürzung von ‚Vater vieler Völker‘, und das Resch, das zuerst darin war, rückte nicht von seinem Platz, denn sogar das Jud …“ Warum muss er erklären, dass das ר im Namen war, weil „er nur Vater für Aram war“?</p><p>Und man muss auch Raschis genaue Worte verstehen: „sogar das Resch … <b>rückte nicht von seinem Platz</b>“. Das sind ungewöhnliche Worte; einfacher wäre: „Man nahm es nicht weg“ oder „Man entfernte es nicht aus seinem Namen“.</p>`,
        },
      ],
      reflection: 'Vergesse ich manchmal, wenn ich etwas Neues und Großes beginne, was ich vorher Gutes hatte?',
      takeaways: [
        '„Vater vieler Völker“ ist eine Abkürzung des Namens Awraham; den Buchstaben ר gibt es in diesen Worten nicht.',
        'Raschi: Das ר „rückte nicht von seinem Platz“ — denn sogar das י von Sarai beschwerte sich, bis man es zu Jehoschua hinzufügte.',
        'Die Frage des Rebben: Das י ist doch weggegangen — zu einem anderen Namen und Menschen —, was ist das für ein Beweis?',
        'Das Wort „sogar“ zeigt: Das י hatte weniger Grund zur Beschwerde als das ר. Warum?',
        'Und warum erklärt Raschi, dass das ר von „Vater für Aram“ kommt, und schreibt „rückte nicht von seinem Platz“?',
      ],
      puzzle: {
        q: 'Ordne die Ermittlung: vom Vers zu den Fragen des Rebben.',
        pieces: ['Awram → Awraham', 'Die Abkürzung „Aw Hamon“', 'Der Buchstabe ר ist übrig', 'Beispiel: das י von Sarai', 'Aber das י ging weg!'],
        meaning: 'Raschi erklärt, warum das ר blieb, mit dem Beispiel des י — doch das י ging zu Jehoschua. Die zwei Buchstaben gingen also verschiedene Wege, und die Antwort liegt im Sinn der Namen selbst.',
      },
    },
    {
      title: 'Sarai und Sara',
      cond: `<p>Im selben Kapitel sagt G-tt zu Awraham:</p><p class="verse" dir="rtl" lang="he">שרי אשתך לא תקרא את שמה שרי כי שרה שמה</p><p>„Sarai, deine Frau, nenne sie nicht Sarai, denn Sara ist ihr Name.“<sup data-src="gen-17-15"></sup></p><p>Raschi erklärt: „Sarai“ heißt „meine Fürstin“ — „Fürstin für mich und nicht für andere“; „Sara“ heißt einfach „Fürstin“ — „sie soll Fürstin über alle sein“.<sup data-src="rashi-17-15"></sup> Und in der Gemara steht: „Zuerst war sie Sarai — Fürstin für ihr Volk —, und am Ende wurde sie Sara — für die ganze Welt.“<sup data-src="berakhot-13a"></sup></p><p>Der Rebbe sucht die Antwort im Sinn der Namen selbst: Was bedeutete der Buchstabe ר im Namen Awram — und was bedeutete der Buchstabe י im Namen Sarai?</p>`,
      steps: [
        {
          q: 'Was war Awram nach Raschi, bevor er Awraham hieß?',
          hint: 'Aram ist der Ort, aus dem er kam.',
          opts: ['„Vater für Aram“', '„Vater für die ganze Welt“', '„Vater für Kenaan“', '„Vater nur für seine Söhne“'],
        },
        {
          q: '„Vater für Aram“ — und „Vater für die ganze Welt“. Wie hängt das eine mit dem anderen zusammen?',
          hint: 'Aram ist auch ein Teil der Welt.',
          opts: ['„das Erste ist im Zweiten enthalten“', '„das Erste widerspricht dem Zweiten“', '„sie haben nichts miteinander zu tun“', '„das Erste ist größer als das Zweite“'],
        },
        {
          q: 'Und was bedeutet der Name „Sarai“ nach Raschi?',
          hint: 'Das י am Ende heißt „mein“.',
          opts: ['„Fürstin für mich und nicht für andere“', '„Fürstin über alle“', '„Fürstin für ihr Volk“', '„Fürstin über Awraham“'],
        },
        {
          q: 'Sara wurde „Fürstin über alle“ — sogar über Awraham. Was sagte G-tt später zu Awraham über Sara?',
          hint: 'Hören — auf wen?',
          opts: ['„alles, was Sara dir sagt, höre auf ihre Stimme“', '„höre nicht auf ihre Stimme“', '„schick sie weg“', '„er wird über dich herrschen“'],
        },
        {
          q: 'Der Buchstabe ר fand einen Platz im Namen Awraham. Aber für das י gibt es im Namen Sara keinen Platz. Wie wurde es also „beruhigt“?',
          hint: 'Man ließ es nicht — man fügte es zu einem anderen Namen hinzu.',
          opts: ['„man fügte es zum Namen Jehoschua hinzu“', '„man ließ es im Namen Sara“', '„man löschte es ganz“', '„man gab es Awraham“'],
        },
      ],
      reveal: {
        h: 'Der Sinn des Buchstabens entscheidet',
        p: 'Das ר steht für „Vater für Aram“, und „Vater für Aram“ ist in „Vater für die ganze Welt“ enthalten: Sein Sinn lebt im neuen Namen weiter. Darum ist seine Beschwerde stark — „mein Sinn bleibt, warum nimmt man mich weg?“ —, und die Antwort ist: Das ר „rückte nicht von seinem Platz“. Aber das י bedeutet „mein — und nicht für andere“, das Gegenteil von „Sara — Fürstin über alle“, sogar über Awraham: „Alles, was Sara dir sagt, höre auf ihre Stimme.“<sup data-src="gen-21-12"></sup> Für das י gibt es im neuen Namen keinen Platz — darum ist seine Beschwerde schwächer („sogar“), und man kann es nur anders beruhigen: Man fügt es zum Namen Jehoschua hinzu.',
      },
      lessons: [
        {
          h: 'Ein Name sagt, was jemand ist',
          b: `<p>Wie schon oft erklärt wurde, wird im einfachen Sinn der Tora, auf Raschis Weg, nichts ohne Grund gesagt. Der Name eines Menschen drückt sein Wesen aus, und Raschi erklärt den Sinn eines Namens dort, wo es wichtig ist. Darum kann man nicht denken, dass der Name „Awram“ nichts über Awrahams eigenes Leben sagte.</p><p>Das sagt uns Raschi mit seinen Worten „als er nur Vater für Aram war, seinen Ort“:<sup data-src="rashi-17-5"></sup> Nach dem einfachen Sinn kann man nicht sagen, dass G-tt einen Buchstaben nur „wegen einer Beschwerde“ im Namen ließ, wenn der Buchstabe selbst nichts mit dem Sinn des Namens zu tun hat. Aber das ר hat eine solche Verbindung: Sein Sinn im Namen Awram — „Vater für Aram“ — ist mit dem Sinn des Namens Awraham verbunden — „Vater vieler Völker“. Denn „Vater für die ganze Welt“ enthält auch „Vater für Aram“ (das Allgemeine enthält das Einzelne) — also ist das keine Aufhebung, sondern nur eine Erweiterung.</p><p>Und die genauen Worte „rückte nicht von seinem Platz“: Man könnte sagen, dass das ר blieb, weil sein Sinn („Vater für Aram“) einfach ein Teil von „Vater für die ganze Welt“ wurde, wie ein Teil der Welt. Aber Raschi betont etwas Neues: Das ר blieb <i>an seinem eigenen Platz</i> — „Vater für Aram“ bleibt im Namen Awraham ein eigener, selbstständiger Sinn, obwohl er im Grunde in „Vater für die ganze Welt“ enthalten ist.</p>`,
        },
        {
          h: 'Zwei Beschwerden, zwei Antworten',
          b: `<p>Jetzt ist auch der Beweis klar: „denn sogar das Jud von Sarai beschwerte sich“. Das ר von Awraham hat ein Argument und eine Beschwerde: Weil sein Sinn im Namen bleibt, gibt es keinen Grund, es aus dem Namen des Zaddik zu nehmen; im Gegenteil — es soll bleiben. Aber das Jud von Sarai hat kein solches Argument: Im Sinn des Namens Sara hat das Jud keinen Platz (wie unten erklärt wird). Es hat also weniger Grund, sich zu beschweren — und doch beschwerte sich <i>sogar</i> es, und darum fügte man es zu Jehoschua „hinzu“.<sup data-src="numbers-13-16"></sup></p><p>So versteht man auch den Unterschied: Das Jud „rückte von seinem Platz“, das ר nicht. Der Vergleich und der Beweis zeigen nur, dass Beschwerden etwas bewirken; aber <i>wie</i> man einen Buchstaben beruhigt, hängt vom Fall ab. Hier bleibt der Sinn des ר im Namen Awraham — darum bleibt es an seinem Platz. Das Jud von Sarai hat im neuen Namen keinen Platz — man kann es nicht „an seinem Platz“ lassen, also beruhigt man es anders: Man fügt es zu einem anderen Namen hinzu.</p>`,
        },
        {
          h: 'Sarai — Awrahams Fürstin',
          b: `<p>Aber warum hat das Jud im Namen Sara keinen Platz? Es scheint doch umgekehrt zu sein! Raschi erklärt: „Sarai bedeutet ‚Fürstin für mich und nicht für andere‘; aber Sara heißt einfach ‚Fürstin‘: Sie soll Fürstin über alle sein.“<sup data-src="rashi-17-15"></sup> Dann scheint „Sarai“ („für mich“) in „Sara“ („über alle“) enthalten zu sein, so wie „Vater für Aram“ in „Vater für die ganze Welt“. Warum ist das Jud dann „nicht an seinem Platz“?</p><p>Die Antwort liegt gerade in Raschis Erklärung. Nach der Gemara „wurde sie zuerst Sarai — Fürstin für ihr Volk —, und am Ende wurde sie Sara — für die ganze Welt“<sup data-src="berakhot-13a"></sup>: Dann wäre der Unterschied zwischen Sarai und Sara genau wie zwischen Awram und Awraham. Aber Raschi erklärt „Sarai“ anders: „Fürstin <b>für mich</b>“. Und der Vers spricht von diesem Namen zu Awraham: „G-tt sprach zu Awraham: Sarai, deine Frau …“<sup data-src="gen-17-15"></sup> — also bedeutet „Sarai“: „Awrahams Fürstin“.</p><p>Darum ist der Sinn von „Sarai“ („für mich“ — für Awraham) das Gegenteil von „Sara“ („über alle“, auch über Awraham). „Sarai“ bedeutet, dass sie Fürstin für Awraham ist, und wie es heißt: „Er wird über dich herrschen.“<sup data-src="gen-3-16"></sup> Aber „Sara — über alle“ bedeutet, dass sie auch über Awraham Fürstin ist: „Alles, was Sara dir sagt, höre auf ihre Stimme“!<sup data-src="gen-21-12"></sup> Darum gibt es im Namen Sara keinen Platz für das Jud, das „für mich“ bedeutete.</p>`,
        },
        {
          h: '„Über alle“ hebt „für mich“ auf',
          b: `<p>So versteht man auch Raschis Worte: „Nenne sie nicht Sarai — denn das bedeutet ‚Fürstin für mich und nicht für andere‘ —, denn Sara ist einfach ihr Name: Sie soll Fürstin über alle sein.“<sup data-src="rashi-17-15"></sup> Über Awraham schreibt Raschi „zuerst … Vater für Aram … und jetzt — Vater für die ganze Welt“, aber hier sagt er nicht „zuerst“. Denn der Sinn des Namens „Sarai“ bleibt nicht einfach in der Vergangenheit — er wird aufgehoben: „für mich <i>und nicht für andere</i>“. Weil G-tt wollte, dass sie „Fürstin über alle“ ist, musste der Name Sarai („für mich und nicht für andere“) aufgehoben werden: Wäre er geblieben, hätte Sara nicht „Fürstin über alle“ sein können.</p><p>(Und noch etwas: Die Worte „Alles, was Sara dir sagt, höre auf ihre Stimme“<sup data-src="gen-21-12"></sup> wurden einige Jahre nachdem sie Sara genannt wurde gesagt — und zwar als etwas Neues.)</p>`,
        },
        {
          h: 'Aw Ram — der verborgene Verstand',
          b: `<p>Der „Wein der Tora“ in Raschis Worten ist eine innere Erklärung, die zu beiden Namen passt, Awram und Awraham. Der Alte Rebbe (im Buch „Tora Or“) erklärt: „Awram“ besteht aus den Worten „Aw Ram“ — „hoher Vater“: „Aw“ ist die Weisheit (Chochma), und „Ram“ ist, was darüber steht, „der Verstand, der vor jedem Gedanken verborgen ist“. Und die Änderung von Awram zu Awraham („Vater vieler Völker“) bedeutet: Sogar dieser „Verstand, der vor jedem Gedanken verborgen ist“, soll zu den „vielen Völkern“ kommen — nach unten leuchten, damit die Menschen ihn verstehen.</p><p>Man könnte denken: Wenn der „verborgene Verstand“ zu den „vielen Völkern“ hinuntergeht, verliert er seine Höhe. Darum sagt Raschi: „Sogar das Resch … rückte nicht von seinem Platz“<sup data-src="rashi-17-5"></sup> — „Ram“, die Höhe, bleibt an seinem Platz und in seiner Höhe und kommt doch nach unten, zu den „vielen Völkern“. Das ist das Neue und Besondere an Awraham: Oben und unten verbinden sich — der verborgene Verstand kommt nach unten und bleibt, was er ist.</p>`,
        },
        {
          h: 'Zuerst dein eigener Ort',
          b: `<p>Eine Lehre für den Dienst an G-tt. Man weiß: Alles, was die Väter hatten, erbt jeder Jude. So auch der Name „Awraham“ — „Vater vieler Völker“: Jeder Jude hat die Kraft, auf „viele Völker“, auf die ganze Welt, zu wirken.</p><p>Aber man muss wissen: „Das Resch … Vater für Aram, seinen Ort … rückte nicht von seinem Platz.“ Obwohl ein Jude in der ganzen Welt wirken soll, ist seine erste Pflicht, auf seinen eigenen Ort und seine Umgebung zu wirken (wie das Gesetz sagt: „Die Armen deiner Stadt gehen vor“<sup data-src="bava-metzia-71a"></sup>), und erst dann, von dort aus, „Vater für die ganze Welt“ zu werden.</p>`,
        },
      ],
      reflection: 'Wer ist „mein Aram“ — mein Ort und die Menschen, die mir nahe sind? Was Gutes kann ich zuerst für sie tun?',
      takeaways: [
        'Ein Name drückt das Wesen aus: „Awram“ — „Vater für Aram“, seinen Ort.',
        '„Vater für die ganze Welt“ enthält auch „Vater für Aram“ — darum blieb das ר und „rückte nicht von seinem Platz“.',
        '„Sarai“ — „Fürstin für mich und nicht für andere“; „Sara“ — Fürstin über alle, sogar über Awraham: „höre auf ihre Stimme“.',
        'Für das י gibt es im Namen Sara keinen Platz — darum beruhigte man es anders: Man fügte es zum Namen Jehoschua hinzu.',
        'Die Lehre: auf die ganze Welt wirken — aber zuerst auf den eigenen Ort („die Armen deiner Stadt gehen vor“).',
      ],
      puzzle: {
        q: 'Ordne die Antwort des Rebben: vom Sinn der Buchstaben zur Lehre.',
        pieces: ['„Vater für Aram“ ist in „Vater für die ganze Welt“', 'Das ר bleibt an seinem Platz', '„Mein“ gegen „über alle“', 'Das י geht zu Jehoschua', 'Zuerst der eigene Ort'],
        meaning: 'Ein Buchstabe bleibt, wenn sein Sinn im neuen Namen weiterlebt, und geht, wenn er ihm widerspricht. So auch wir: Wir wirken auf die ganze Welt, ohne unseren eigenen Ort zu verlassen.',
      },
    },
    {
      title: 'Drei Altäre',
      cond: `<p>In unserem Wochenabschnitt baut Awraham drei Altäre:</p><p class="verse" dir="rtl" lang="he">ויבן שם מזבח לה׳ הנראה אליו</p><p>— in Schechem, nach G-ttes Worten „Deinen Nachkommen gebe Ich dieses Land“;<sup data-src="gen-12-7"></sup> den zweiten — zwischen Bet-El und Ai;<sup data-src="gen-12-8"></sup> den dritten — in Chewron.<sup data-src="gen-13-18"></sup></p><p>Raschi erklärt die ersten zwei. Über den dritten — schweigt er. Der Midrasch sagt: Es waren drei Altäre — für die Nachricht vom Land Israel, für seinen Erwerb und damit seine Kinder nicht fallen.<sup data-src="bereshit-rabbah-39-16"></sup> Warum hat Raschi den dritten nicht erklärt?</p>`,
      steps: [
        {
          q: 'Wofür baute Awraham nach Raschi den ersten Altar?',
          hint: 'G-tt versprach ihm Kinder und das Land.',
          opts: ['„für die Nachricht von den Nachkommen und die Nachricht vom Land Israel“', '„für den Erwerb des Landes“', '„damit seine Kinder nicht fallen“', '„zu Ehren des Königs“'],
        },
        {
          q: 'Und der zweite, bei der Stadt Ai? Raschi: Er sah voraus, dass seine Nachkommen dort straucheln würden — wegen wessen Sünde?',
          hint: 'In der Zeit von Jehoschua, als man Verbotenes aus Jericho nahm.',
          opts: ['„wegen der Sünde Achans“', '„wegen der Sünde des goldenen Kalbes“', '„wegen der Generation der Flut“', '„wegen des Verkaufs von Josef“'],
        },
        {
          q: 'Der Midrasch: Der dritte Altar war „für den Erwerb“ des Landes. Aber nach dem einfachen Sinn sagte G-tt: „Steh auf, geh durch das Land … denn dir werde Ich es geben.“ Warum ist das kein Erwerb?',
          hint: 'Achte auf die Zeitform des Verbs.',
          opts: ['„‚Ich werde geben‘ ist Zukunft: Das Land wird erst noch gegeben“', '„Awraham ging nicht durch das Land“', '„Awraham hatte es schon gekauft“', '„dort war kein Platz für einen Altar“'],
        },
        {
          q: 'Was war in Chewron anders als an Awrahams früheren Orten?',
          hint: 'Bis dahin „zog er immer weiter nach Süden“.',
          opts: ['„dort ließ er sich nieder“', '„dort wurde er geboren“', '„dort kämpfte er“', '„dort wurde er beschnitten“'],
        },
        {
          q: 'Die Gemara: „Misbeach“ (Altar) — „mesiach, mesin, mechabew, mechaper“. Was davon ist kein Nutzen für den Menschen, sondern Liebe zwischen Israel und ihrem Vater?',
          hint: 'Es ernährt nicht, sühnt nicht und wendet keine Verhängnisse ab.',
          opts: ['„mechabew — macht beliebt“', '„mesin — ernährt“', '„mechaper — sühnt“', '„mesiach — wendet ab“'],
        },
        {
          q: 'Der Rambam teilt die Opfergaben in vier Arten: Ola, Chatat, Ascham, Schelamim. Aber Chatat und Ascham kommen beide zur Sühne. Wie viele Arten sind es, wenn man sie zusammen zählt (so teilt der Midrasch)?',
          hint: '4 − 1.',
        },
      ],
      reveal: {
        h: 'Drei Wirkungen des Altars',
        p: '„Die Taten der Väter sind ein Zeichen für die Kinder“:<sup data-src="tanchuma-lech-lecha-9"></sup> Awrahams Altäre sind ein Zeichen und eine Quelle der Kraft für den Altar seiner Nachkommen, im Mischkan und im Tempel. Und der Altar hat drei Wirkungen: Er „ernährt“ die Welt, er „wendet ab und sühnt“ — und er „macht Israel bei ihrem Vater beliebt“.<sup data-src="ketubot-10b"></sup> So auch die drei Arten von Opfergaben: Schelamim (die Besitzer essen sie), Chatat und Ascham (zur Sühne) und die Ola — ganz für G-tt.',
      },
      lessons: [
        {
          h: 'Drei Altäre',
          b: `<p>Unser Wochenabschnitt erzählt, dass Awraham drei Altäre baute: „und er baute dort einen Altar dem Ewigen, der ihm erschienen war“;<sup data-src="gen-12-7"></sup> „und er baute dort einen Altar dem Ewigen und rief den Namen des Ewigen an“;<sup data-src="gen-12-8"></sup> „und er baute dort einen Altar dem Ewigen“.<sup data-src="gen-13-18"></sup> Unsere Weisen erklären, dass Awraham alle drei Altäre im Land Israel für seine Kinder baute: den ersten — für die Nachricht vom Land Israel; den zweiten, bei Ai — „damit seine Kinder nicht fallen“ (als G-tt ihm das Land versprach, sah er voraus, dass seine Nachkommen dort straucheln würden); den dritten — nachdem er den Befehl erfüllte „Steh auf, geh durch das Land, in seiner Länge und Breite, denn dir werde Ich es geben“ — „für seinen Erwerb“.<sup data-src="bereshit-rabbah-39-16"></sup></p><p>Raschi bringt in seinem Kommentar aus dem Midrasch den Sinn der ersten zwei Altäre. Zum ersten: „für die Nachricht von den Nachkommen und die Nachricht vom Land Israel“.<sup data-src="rashi-12-7"></sup> Zum zweiten: „Er sah voraus, dass seine Kinder dort wegen der Sünde Achans straucheln würden, und betete dort für sie.“<sup data-src="rashi-12-8"></sup> Aber über den dritten Altar schweigt Raschi und erklärt nichts.</p>`,
        },
        {
          h: 'Warum nicht „für den Erwerb“',
          b: `<p>Warum erklärte Raschi nicht wie der Midrasch, dass der dritte Altar „für den Erwerb“ war? Nach dem Midrasch „erwarb“ Awraham das Land, indem er durch es ging — darum passt es zu sagen, dass der Altar für den Erwerb gebaut wurde. Aber nach dem einfachen Sinn des Verses ist der Befehl „Steh auf, geh durch das Land …“ nicht dazu da, es zu erwerben: Der Vers endet mit „denn dir <b>werde</b> Ich es <b>geben</b>“<sup data-src="gen-13-17"></sup> — in der Zukunft. Das Gehen war also nur, um zu sehen, wie groß das Land ist, das G-tt in Zukunft geben wird. Darum kann man nicht erklären, dass dieser Altar „für den Erwerb“ gebaut wurde.</p><p>Aber wenn das so ist: Warum sagte Raschi, nachdem er die Gründe der ersten zwei Altäre erklärt hatte, nichts über den Grund des dritten?</p>`,
        },
        {
          h: 'Chewron — der erste feste Wohnort',
          b: `<p>Man könnte einfach sagen: Raschi hat schon erklärt, dass Awraham einen Altar für gute Nachrichten baute — für die Nachricht vom Land Israel —, also muss man für den dritten keinen anderen Grund suchen. Denn der Vers erzählt, dass Awraham ihn nach einem noch größeren Versprechen baute: „Das ganze Land, das du siehst, dir werde Ich es geben und deinen Nachkommen für immer, und Ich werde deine Nachkommen machen wie den Staub der Erde.“<sup data-src="gen-13-17"></sup> Awraham hörte gute Nachrichten — und baute einen Altar, wie den ersten.</p><p>Aber das passt nicht gut zu den einfachen Worten „und er baute <b>dort</b> einen Altar“: Das Bauen hängt mit dem Ort zusammen. (Der erste — „dem Ewigen, der ihm erschienen war“, dort, wo G-tt erschien; der zweite — „und rief den Namen des Ewigen an“, dort betete er.) Aber der dritte wurde in Chewron gebaut für Nachrichten, die er schon vor seiner Ankunft in Chewron bekam — was hat der Ort damit zu tun?</p><p>Nach dem einfachen Sinn kann man erklären: Chewron ist der erste Ort im Land Israel, wo Awraham fest wohnte. Vorher war er unterwegs: „Er zog immer weiter nach Süden“<sup data-src="gen-12-9"></sup> — und erst als er nach Chewron kam, ließ er sich nieder: „Und er kam und wohnte in den Ebenen von Mamre, die in Chewron sind.“<sup data-src="gen-13-18"></sup> (Und später starb Sara in Chewron, wo Awraham wohnte.) Darum ist das der passendste Ort, um G-tt für die guten Nachrichten zu danken — als er sich für lange Zeit im Land Israel niederließ. Aber auch so ist die Frage nicht ganz gelöst.</p>`,
        },
        {
          h: 'Die Taten der Väter sind ein Zeichen für die Kinder',
          b: `<p>Die Erklärung. Unsere Weisen sagten: „Der Heilige, gelobt sei Er, gab Awraham ein Zeichen: Alles, was ihm geschah, geschah auch seinen Kindern“<sup data-src="tanchuma-lech-lecha-9"></sup> — „die Taten der Väter sind ein Zeichen für die Kinder“. Darum hängen die Altäre, die Awraham baute, mit dem Altar für die Opfergaben seiner Kinder zusammen — im Mischkan und im Tempel.</p><p>Das ist der Sinn, warum Awraham genau drei Altäre baute: Der Altar seiner „Kinder“ hat drei Wirkungen, und das Zeichen (und die Kraft) dafür sind die drei Altäre Awrahams.</p>`,
        },
        {
          h: 'Misbeach: ernährt, sühnt, macht beliebt',
          b: `<p>Über den Altar sagten unsere Weisen: „‚Misbeach‘ — mesiach, mesin, mechabew, mechaper“:<sup data-src="ketubot-10b"></sup> Er wendet ab (böse Verhängnisse von Israel); er ernährt — dank der Opfergaben bekommt die Welt ihre Nahrung, denn die Opfergaben werden aus Nahrung gebracht und bringen ihr Segen; er macht Israel bei ihrem Vater beliebt; und er sühnt die Sünden.</p><p>Diese vier Wirkungen teilen sich im Ganzen in drei Arten: a) „mesin“ — Nahrung für die Welt; b) „mesiach und mechaper“ — Unerwünschtes aufheben (Verhängnisse und Sünden); c) „mechabew — Israel bei ihrem Vater beliebt machen“.</p><p>Dieselbe Teilung „vier, die drei sind“ gibt es auch bei den Opfergaben auf dem Altar. Der Rambam teilt die Opfergaben in vier Arten: Ola, Chatat, Ascham und Schelamim; aber im Midrasch werden sie in drei geteilt: Ola, Schelamim und Chatat. Das ist kein Widerspruch: Chatat und Ascham haben einen Inhalt — beide kommen zur Sühne.</p>`,
        },
        {
          h: 'Drei Arten von Opfergaben',
          b: `<p>Man kann sagen, dass die drei Wirkungen des Altars den drei Arten von Opfergaben entsprechen.</p><p>Die <b>Schelamim</b>, die ihre Besitzer essen, entsprechen dem, dass der Altar die Welt „ernährt“: So wie die Besitzer diese Nahrung (gewöhnliche Nahrung für den Körper) durch eine Opfergabe für G-tt bekommen, so „bekommt die Welt dank der Opfergaben ihre Nahrung“.<sup data-src="ketubot-10b"></sup></p><p>Die <b>Chatat</b> (und Ascham), die zur Sühne gebracht werden, sind „wendet ab … sühnt“.</p><p>Und die <b>Ola</b>, die ganz für G-tt auf dem Altar verbrannt wird — ihr Sinn ist, „Israel bei ihrem Vater beliebt zu machen“. Wie der Midrasch sagt: Die Ola wird nur zur Ehre des Heiligen, gelobt sei Er, gebracht, die Schelamim und die Chatat aber für uns selbst. Das heißt: Schelamim und Chatat nützen dem, der sie bringt (Nahrung oder das Aufheben von Unerwünschtem), die Ola aber ist nur zur Ehre G-ttes, und durch sie wird Israel bei ihrem Vater im Himmel beliebt.</p>`,
        },
      ],
      reflection: 'Wenn ich etwas Gutes tue — wofür? Tue ich manchmal etwas „nur für G-tt“, ohne etwas dafür zu wollen?',
      takeaways: [
        'Awraham baute drei Altäre: in Schechem, bei Ai und in Chewron.',
        'Raschi: der erste — für die Nachricht von Nachkommen und Land; der zweite — ein Gebet für seine Kinder, die wegen der Sünde Achans straucheln würden. Über den dritten schweigt Raschi.',
        'Nach dem einfachen Sinn ist „dir werde Ich es geben“ Zukunft; darum ist der dritte Altar nicht „für den Erwerb“. In Chewron ließ sich Awraham nieder.',
        '„Die Taten der Väter sind ein Zeichen für die Kinder“: Awrahams Altäre sind ein Zeichen für den Altar im Tempel.',
        'Der Altar ernährt, sühnt und macht Israel bei ihrem Vater beliebt — wie Schelamim, Chatat (und Ascham) und Ola: 4 − 1 = 3.',
      ],
      puzzle: {
        q: 'Ordne die Ermittlung: von der Frage zu den drei Wirkungen des Altars.',
        pieces: ['Drei Altäre', 'Raschi schweigt über den dritten', '„Ich werde geben“ — Zukunft', 'Die Taten der Väter sind ein Zeichen', 'Ernährt · sühnt · macht beliebt'],
        meaning: 'Der dritte Altar ist nicht „für den Erwerb“; Awrahams Altäre sind ein Zeichen für den Altar seiner Kinder, der drei Wirkungen hat, wie die drei Arten von Opfergaben.',
      },
    },
    {
      title: 'Der Altar in Chewron',
      cond: `<p>Gehen wir zurück zum dritten Altar:</p><p class="verse" dir="rtl" lang="he">ויבא וישב באלני ממרא אשר בחברון ויבן שם מזבח לה׳</p><p>„Und er kam und wohnte in den Ebenen von Mamre, die in Chewron sind, und baute dort einen Altar dem Ewigen.“<sup data-src="gen-13-18"></sup></p><p>Keine gute Nachricht, kein Gebet — einfach „ein Altar dem Ewigen“. Und viel später, im selben Chewron, „kamen alle Ältesten Israels zum König … und König David schloss mit ihnen einen Bund in Chewron vor dem Ewigen“.<sup data-src="samuel2-5-3"></sup> Was haben Awrahams Altar und König David gemeinsam?</p>`,
      steps: [
        {
          q: 'Welcher der drei Altäre wurde nur zur Ehre G-ttes gebaut, ohne einen anderen Zweck?',
          hint: 'Raschi schrieb darüber kein Wort.',
          opts: ['„der Altar in Chewron“', '„der Altar in Schechem“', '„der Altar bei Ai“', '„der Altar auf dem Berg Morija“'],
        },
        {
          q: 'Welche Opfergabe wird ganz auf dem Altar verbrannt, „nur zur Ehre G-ttes“?',
          hint: 'Weder die Besitzer noch (außer der Haut) die Kohanim essen davon.',
          opts: ['„Ola“', '„Schelamim“', '„Chatat“', '„Ascham“'],
        },
        {
          q: 'Mit welchem Wort hängt der Name „Chewron“ zusammen?',
          hint: 'Hebräisch „Chibur“.',
          opts: ['„Verbindung“', '„Krieg“', '„Ruhe“', '„Kraft“'],
        },
        {
          q: 'Der erste Altar ist wie der Erste Tempel, der zweite wie der Zweite. Und der dritte?',
          hint: 'Der Tempel, der noch gebaut wird.',
          opts: ['„der Dritte Tempel“', '„der Erste Tempel“', '„der Zweite Tempel“', '„der Mischkan in der Wüste“'],
        },
        {
          q: 'Wer wurde in Chewron zum König über ganz Israel gesalbt?',
          hint: 'Sein Königtum ist ewig, und der Moschiach kommt aus seiner Familie.',
          opts: ['„David“', '„Schaul“', '„Schlomo“', '„Jehoschua“'],
        },
      ],
      reveal: {
        h: 'Ein Altar ohne „wofür“',
        p: 'Raschi erklärt den Zweck des dritten Altars nicht, weil er keinen Zweck für den Menschen hatte: Er wurde nur „dem Ewigen“ gebaut — wie eine Ola, ganz für G-tt. Das ist Dienst mit völliger Hingabe, ohne jede Rechnung — und gerade in Chewron, denn „Chewron“ kommt von „Verbindung“. Die drei Altäre sind ein Zeichen für die drei Tempel, und der dritte, in Chewron, wo David gesalbt wurde,<sup data-src="samuel2-5-3"></sup> ist ein Zeichen für den Dritten Tempel und das Königtum des Moschiach: „Und Mein Diener David wird König über sie sein.“<sup data-src="ezekiel-37-24"></sup>',
      },
      lessons: [
        {
          h: 'Drei Teile jeder Opfergabe',
          b: `<p>Man kann sagen, dass diese drei Wirkungen im Ganzen in jeder Opfergabe sind, denn alle haben drei Teile: a) Das Blut wird auf den Altar gesprengt; b) die Kohanim und die Besitzer essen die Opfergabe (und von der Ola bekommen die Kohanim die Haut); c) die Offenbarung der Schechina — das Feuer, das vom Himmel kam und die Opfergaben „aß“ (und im Ganzen — dass der Altar im Tempel steht, „dem Haus G-ttes, bereit, um darin Opfergaben zu bringen“, wie der Rambam schreibt).</p><p>Der Teil der Opfergabe, den die Kohanim und die Besitzer essen, deutet darauf hin, dass der Altar die Welt „ernährt“.</p><p>Das Blut, das auf den Altar gesprengt wird, bringt die Sühne für die Sünden und Vergebung (und das schließt Vergebung für alles Unerwünschte ein).</p><p>Und die Offenbarung der Schechina in den Opfergaben (das Feuer vom Himmel; und im Ganzen, dass der Altar im Tempel ist, im „Haus G-ttes“) zeigt, wie beliebt Israel ist — so sehr, dass es heißt: „Wie man kommt, um zu sehen, so kommt man, um gesehen zu werden“<sup data-src="chagigah-2a"></sup>: Diese ganze Offenbarung ist für Israel, das Volk, das Ihm nahe ist.</p>`,
        },
        {
          h: 'Drei Stufen des Dienstes',
          b: `<p>Man weiß, dass der Dienst der Opfergaben einfach „der Dienst“ (Awoda) heißt: In ihm zeigt sich der ganze Dienst an G-tt. Darum gibt es, so wie die Opfergaben diese drei Seiten haben, auch im ganzen Dienst an G-tt drei Teile.</p><p>Der Anfang ist der Dienst mit Tora und Mizwot, „Nahrung für die Seele“ („ernährt“): Die Tora ist „unser Leben“, und über die Mizwot heißt es: „die der Mensch tun soll, und er wird durch sie leben“.<sup data-src="lev-18-5"></sup> Man weiß, dass die 248 Gebote zum Tun den 248 Gliedern des Menschen entsprechen, und durch Tora und Mizwot kommt das Leben (der Seele) in die Glieder des Menschen.</p><p>Höher ist der Dienst der Umkehr (Teschuwa): Auch wenn ein Mensch gesündigt, etwas verdorben hat und vom Weg abgekommen ist — G-tt behüte —, macht er es durch Teschuwa wieder gut („sühnt“ und „wendet ab“).</p><p>Aber die volle Verbindung mit G-tt ist der Dienst der Hingabe: Der Mensch gibt sich selbst und alles, was er hat, G-tt (wie eine Ola, ganz für G-tt). Echte Hingabe ist nicht für einen Lohn und nicht für irgendeinen Nutzen (für den Körper oder sogar für die Seele), sondern nur zur Ehre G-ttes, ganz ohne Rechnung. Und wenn ein Mensch sich so ganz G-tt gibt und nichts für sich sucht, „macht er Israel bei ihrem Vater beliebt“.</p>`,
        },
        {
          h: 'Awrahams drei Altäre',
          b: `<p>Jetzt ist der Sinn der drei Altäre Awrahams klar — nach der Regel „die Taten der Väter sind ein Zeichen für die Kinder“: In ihnen legte Awraham den Grund (das „Zeichen“) für die drei großen Teile des Dienstes Israels in allen Generationen.</p><p>Der erste Altar — „für die Nachricht von den Nachkommen und die Nachricht vom Land Israel“<sup data-src="rashi-12-7"></sup>: Das sind die Bedürfnisse des Menschen, für den Körper und für die Seele (wie „ernährt“). Der zweite — wo er wegen der Sünde Achans für seine Kinder betete<sup data-src="rashi-12-8"></sup>: Das ist „wendet ab … sühnt“. Und beim dritten erklärt Raschi nicht, was sein Sinn ist — weil der Zweck dieses Altars kein Nebennutzen ist, sondern nur, G-tt einen Altar zu bauen (wie eine Ola — ganz für G-tt, nur zu Seiner Ehre). Das ist „macht beliebt“: Eine solche Opfergabe bringt G-ttes Liebe zu Israel.</p><p>Die drei Altäre Awrahams gehen also der Reihe nach, vom Leichten zum Schweren: der erste — für die Nachricht von Nachkommen und Land („ernährt“); der zweite — das Gebet wegen der Sünde Achans („wendet ab … sühnt“); der dritte — „und er baute dort einen Altar dem Ewigen“,<sup data-src="gen-13-18"></sup> einfach so, ohne einen anderen Zweck — nur zur Ehre G-ttes.</p><p>[So versteht man auch, warum Raschi beim ersten Altar die Worte „dem Ewigen, der ihm erschienen war“ nicht bringt. Es scheint, dass der einfache Sinn des Verses ist: Nachdem G-tt Awraham erschienen war, baute er einen Altar „dem Ewigen, der ihm erschienen war“ — um für diese Erscheinung zu danken (oder die Erscheinung weckte in ihm den Wunsch, G-tt mit einem Altar zu dienen). Aber Raschi erklärt, dass der Altar (nur) „für die Nachricht von den Nachkommen und die Nachricht vom Land Israel“ war. Das ist so, weil der Dienst in Stufen geht, von unten nach oben, vom Leichten zum Schweren, und die Worte „dem Ewigen, der ihm erschienen war“ nicht den Zweck des Altars beschreiben, sondern nur die Zeit: Die Nachrichten bekam er, als G-tt ihm erschien.]</p>`,
        },
        {
          h: 'Chewron — Verbindung',
          b: `<p>So kann man auch erklären, warum der Vers beim dritten Altar betont „und er baute <b>dort</b> einen Altar dem Ewigen“<sup data-src="gen-13-18"></sup> — gerade in Chewron: Der Sinn dieses Altars hängt gerade mit der Stadt Chewron zusammen.</p><p>Man weiß, dass „Chewron“ von „Chibur“ kommt, „Verbindung“. (An anderer Stelle wird erklärt, dass das auch mit der Stadt Chewron selbst zu tun hat: Dort sind die Väter und Mütter ganz Israels begraben, und „Väter nennt man nur drei“, und alle Gebete steigen über Chewron auf.) Und die echte Verbindung Israels mit G-tt ist, wenn der Dienst nicht „für uns selbst“ ist, nicht für einen Nutzen des Menschen (nicht einmal für den höchsten — die Sühne), sondern wenn sein „Altar“ — die Opfergabe — nur zur Ehre G-ttes ist, ganz für G-tt.</p>`,
        },
        {
          h: 'Drei Tempel',
          b: `<p>Man weiß, dass das Wichtigste im Tempel — „dem Haus G-ttes, bereit, um darin Opfergaben zu bringen“ — der Altar ist. Darum kann man sagen, dass die drei Altäre Awrahams den drei Tempeln entsprechen.</p><p>An anderer Stelle wird ausführlich erklärt, dass im geistigen Dienst der Unterschied zwischen dem Ersten und dem Zweiten Tempel so ist: Der Erste Tempel ist der Dienst der Zaddikim, und der Zweite, der (nach der Zerstörung des Ersten und) zur Reparatur der Zerstörung gebaut wurde, ist der Dienst der Umkehr (Teschuwa). Also ist Awrahams erster Altar — passend zum Dienst mit Tora und Mizwot — das „Zeichen“ für den Ersten Tempel, den Dienst der Zaddikim (sie heißen so, weil sie Tora und Mizwot erfüllen); der zweite — passend zum Dienst der Teschuwa — ist das „Zeichen“ für den Dienst des Zweiten Tempels.</p><p>Aber das Ziel und die Vollendung ist der Dritte Tempel, die Vollendung des Dienstes an G-tt, wenn sich das Versprechen erfüllt: „Denn Auge in Auge werden sie sehen“<sup data-src="isaiah-52-8"></sup> — die volle Offenbarung G-ttlichkeit, und darum auch die volle Verbindung Israels mit G-tt, völlige Hingabe an Ihn. Und das ist genau wie Awrahams dritter Altar in Chewron, dessen ganzer Sinn ist: „und er baute dort einen Altar dem Ewigen“.</p><p>Eine Stütze dafür findet man in den Worten des Midrasch: Awraham baute einen Altar in Chewron, weil es der Ort ist, wo David König wurde und wo man einen Bund schloss, wie es heißt: „Alle Ältesten Israels kamen zum König nach Chewron, und König David schloss mit ihnen einen Bund in Chewron vor dem Ewigen.“<sup data-src="samuel2-5-3"></sup></p>`,
        },
        {
          h: 'Das Königtum Davids',
          b: `<p>Man weiß, dass das Königtum von König David (besonders als er wirklich König über ganz Israel wurde) ein ewiges Königtum ist, und seine Vollendung ist das Königtum von König Moschiach. Nach der Entscheidung des Rambam wird König Moschiach aufstehen und das Königtum Davids wieder so herstellen, wie es früher war; und mehr noch: In den Midraschim unserer Weisen steht, dass König Moschiach König David selbst ist.</p><p>Also hängt dieser Altar Awrahams mit dem Königtum Davids zusammen — dem Königtum des Moschiach, wenn die Vollendung des Dienstes an G-tt kommt.</p>`,
        },
        {
          h: 'Die Lehre: Dienst, verbunden mit der Erlösung',
          b: `<p>Die Lehre für unsere Taten und unseren Dienst jetzt. Weil „die Taten der Väter ein Zeichen für die Kinder sind“, sollen die drei Altäre Awrahams im Dienst jedes Juden sein.</p><p>Und weil der dritte Altar der Vollendung entspricht, die in der wahren und vollständigen Erlösung durch unseren gerechten Moschiach kommt, folgt daraus: Unser ganzer Dienst (der Altar und die Opfergaben im Dienst an G-tt) soll, auch in der Zeit des Exils, mit dem Königtum Davids verbunden sein — David, König Moschiach.</p><p>Das heißt: Sowohl der Dienst mit Tora und Mizwot als auch die Teschuwa sollen von dem klaren Wissen erfüllt sein, dass die Vollendung des Dienstes an G-tt erst in der Zukunft kommt (dann werden die Mizwot „nach dem Gebot Deines Willens“ erfüllt; und, wie man aus den Worten des Ramban weiß, sind die Mizwot, die wir jetzt erfüllen, nur „Wegweiser“).</p><p>Und das weckt noch mehr den Wunsch und die Sehnsucht nach der wahren und vollständigen Erlösung — und so bringt es die Zeit näher und beschleunigt sie, in der wir mit eigenen Augen, in der Tat, die Erfüllung des Bundes mit König David sehen, David, König Moschiach: „Und Mein Diener David wird König über sie sein, und sie alle werden einen Hirten haben … und David, Mein Diener, wird ihr Fürst sein für immer“<sup data-src="ezekiel-37-24"></sup> — bald, in unseren Tagen.</p>`,
        },
      ],
      reflection: 'Was kann ich heute einfach „für G-tt“ tun — nicht für einen Nutzen und nicht für Lob?',
      takeaways: [
        'Jede Opfergabe hat drei Teile: Man isst sie (ernährt), ihr Blut wird gesprengt (sühnt), Feuer vom Himmel (G-ttes Liebe zu Israel).',
        'Und der Dienst hat drei Stufen: Tora und Mizwot, Teschuwa und Hingabe nur für G-tt.',
        'Der erste Altar — Bedürfnisse des Menschen, der zweite — Sühne, der dritte — nur „dem Ewigen“; darum schweigt Raschi darüber.',
        '„Chewron“ — „Verbindung“: Die echte Verbindung mit G-tt ist Dienst ohne Rechnung.',
        'Die drei Altäre sind ein Zeichen für die drei Tempel; der dritte, in Chewron, wo David gesalbt wurde, ist ein Zeichen für den Dritten Tempel und das Königtum des Moschiach.',
      ],
      puzzle: {
        q: 'Ordne die Antwort des Rebben: vom Leichten zum Höchsten.',
        pieces: ['Nachricht von Nachkommen und Land', 'Gebet wegen der Sünde Achans', '„Ein Altar dem Ewigen“ — und sonst nichts', 'Chewron — Verbindung', 'Der Dritte Tempel und König David'],
        meaning: 'Awrahams Altäre steigen vom Nutzen für den Menschen zum Dienst nur für G-tt; der dritte, in Chewron, ist ein Zeichen für die Vollendung des Dienstes in den Tagen des Moschiach.',
      },
    },
  ],
  final: {
    title: 'Fall gelöst',
    allSolved:
      'Alle vier Rätsel sind gelöst. Der Buchstabe ר blieb an seinem Platz, das י ging zu Jehoschua; Awrahams dritter Altar war nur für G-tt, ein Zeichen für den Dritten Tempel. Wirke auf die ganze Welt — ohne deinen eigenen Ort zu verlassen.',
  },
  puzzle: {
    q: 'Ordne den Weg beider Reden.',
    pieces: ['Das ר rückte nicht von seinem Platz', 'Das י ging zu Jehoschua', 'Zuerst der eigene Ort', 'Drei Altäre', 'Chewron — zum Moschiach'],
    meaning: 'Awrahams Name lehrt, auf die ganze Welt zu wirken, ohne den eigenen Ort zu verlassen, und seine Altäre — G-tt vom Einfachen bis zum Höchsten zu dienen, bis zur Vollendung des Dritten Tempels.',
  },
  cards: {
    intro: 'Zwölf Verse des Abschnitts Lech Lecha — und zu jedem eine Erklärung des Rebben aus seinen Reden. Finde, welche Erklärung zu welchem Vers gehört.',
    items: [
      {
        title: 'Geh zu dir selbst',
        verse: '„Geh für dich“',
        card: 'Geh zu dir selbst — zur Wurzel der Seele, über Gewohnheiten hinaus',
        explain: 'G-tt sagt zu Awram „Lech Lecha“ — wörtlich „geh für dich“. Der Rebbe erklärt: In diesen Worten stecken zwei Bewegungen. Von oben nach unten: Die Seele steigt aus ihrer hohen Quelle in unsere Welt hinab, um dort G-ttlichkeit zu zeigen. Und von unten nach oben: „Geh zu dir selbst“ — zu deinem wahren Ich, zur Wurzel der Seele. Dafür geht der Mensch über seine Gewohnheiten und seine Natur hinaus.',
        horaah: 'Das wahre Ich ist die Seele, nicht die Gewohnheit. Geh heute einen Schritt weiter als „wie immer“.',
        poem: [
          '„Geh für dich“, sprach G-tt — die Seele kommt zur Welt,',
          'Doch geh zu dir, zur Quelle, die dich hält.',
          'Geh über die Gewohnheit, Schritt für Schritt,',
          'Und nimm dein wahres Ich auf diesem Weg mit.',
        ],
      },
      {
        title: 'Wünsche, Gefühle, Verstand',
        verse: '„Aus deinem Land, aus deiner Heimat und aus dem Haus deines Vaters“',
        card: 'Land — Wünsche, Heimat — Gefühle, Vaterhaus — Verstand',
        explain: 'Warum diese Reihenfolge? Auf einer Reise verlässt man doch zuerst das Haus des Vaters, dann die Stadt und erst dann das Land. Nach dem einfachen Sinn erklärt Raschi: Awram und sein Vater waren schon aus Ur Kasdim weggezogen und bis Charan gekommen; jetzt sagt G-tt ihm, noch weiter zu gehen — und das Haus seines Vaters zu verlassen. Und der Rebbe erklärt drei Stufen im Menschen: „Land“ (Erez) hängt mit „Razon“, Wunsch, zusammen — geh aus deinen irdischen Wünschen heraus; „Heimat“ — die Gefühle und Gewohnheiten, mit denen man aufgewachsen ist; „Vaterhaus“ — der Verstand, den man durch die Erziehung bekommen hat.',
        horaah: 'Wachsen heißt: Schritt für Schritt aus den eigenen Grenzen gehen — aus Wünschen, aus gewohnten Gefühlen und sogar aus der gewohnten Sicht auf die Dinge.',
        poem: [
          '„Dein Land“ — die Wünsche: lass sie hinter dir,',
          '„Die Heimat“ — die Gewohnheit: geh von hier,',
          '„Das Vaterhaus“ — der Verstand soll weiter gehn:',
          'Drei Stufen hoch, nach innen, wirst du stehn.',
        ],
      },
      {
        title: 'Ich zeige dich dir',
        verse: '„In das Land, das Ich dir zeigen werde“',
        card: '„Ich werde dir zeigen“ — Ich zeige dir dich selbst',
        explain: 'G-tt nennt Awram das Land nicht, sondern sagt: „das Ich dir zeigen werde“ — „Arecka“. Der Rebbe erklärt den inneren Sinn dieses Wortes: „Ich zeige und offenbare dich dir selbst“ — Ich zeige dir dein wahres, g-ttliches Wesen. Und es zeigt sich gerade hier unten, wenn die Seele im Körper die Mizwot erfüllt.',
        horaah: 'Wer dorthin geht, wohin G-tt ihn führt, lernt sich selbst kennen. Denk bei einer Mizwa daran: So zeigt sich auch meine Seele.',
        poem: [
          '„Ich zeige dir“ — nicht nur ein fernes Land,',
          'Dein wahres Ich wird dir so erst bekannt.',
          'Das Licht der Seele zeigt sich hier und heut,',
          'Wenn du die Mizwot tust — und das erfreut.',
        ],
      },
      {
        title: 'Zu deinem Nutzen',
        verse: '„Und Ich mache dich zu einem großen Volk“',
        card: 'Ein Weg „zu deinem Nutzen“ — für den Körper und für die Seele',
        explain: 'Raschi erklärt „geh für dich“: „zu deinem Nutzen und zu deinem Wohl“ — dort mache Ich dich zu einem großen Volk. Und weiter: Reisen macht drei Dinge weniger — Kinder, Geld und den guten Namen; darum verspricht G-tt drei Segen. Der Rebbe erklärt, dass es hier zwei Seiten gibt. Für den Körper verspricht G-tt echte Güter: Nachkommen, Reichtum und einen Namen. Doch für die Seele ist der höchste Nutzen der Weg selbst: G-ttes Befehl zu erfüllen und Seinen Willen anzunehmen; so ein Dienst wird selbst zur Freude und zum Glück des Menschen.',
        horaah: 'G-ttes Willen zu tun ist kein Verlust, sondern ein Gewinn — für das Leben und für die Seele.',
        poem: [
          '„Geh — dir zum Wohl“, so fing G-ttes Rede an:',
          'Ein Volk, ein Name, Reichtum — das sagt Er dann.',
          'Doch höher noch: Sein Wille, Sein Gebot —',
          'Er macht die Seele froh, ist ihr täglich Brot.',
        ],
      },
      {
        title: 'G-tt auch auf der Erde',
        verse: '„Und durch dich werden alle Familien der Erde gesegnet“',
        card: 'Durch Awraham wurde G-tt „G-tt der Erde“, nicht nur des Himmels',
        explain: 'Raschi schreibt: „Es gibt viele Midraschim. Doch der einfache Sinn ist: Ein Mensch sagt zu seinem Sohn: Sei wie Awraham.“ Der Rebbe erklärt: In Charan und in Ur Kasdim kannten die Menschen den Ewigen nur als „G-tt des Himmels“ — fern, irgendwo oben. Durch den Dienst Awrahams, der die Menschen den Glauben lehrte, wurde G-tt für sie auch „G-tt der Erde“: Die Welt und die G-ttlichkeit wurden eins.',
        horaah: 'G-tt ist nicht nur im Gebet, sondern auch in ganz normalen Dingen. Sei „wie Awraham“, damit die Menschen um dich das sehen.',
        poem: [
          '„Gesegnet wird durch dich“ jedes Geschlecht:',
          '„Sei wie Awraham“ — so sagt der Vater recht.',
          'G-tt war „im Himmel“ — fern und weit entfernt,',
          'Durch ihn hat man „G-tt der Erde“ auch gelernt.',
        ],
      },
      {
        title: 'Der erste Altar',
        verse: '„Und er baute dort einen Altar für den Ewigen, Der ihm erschienen war“',
        card: 'Der erste Altar — für die Nachricht von Kindern und Land',
        explain: 'Raschi: Awraham baute diesen Altar für die Nachricht von Nachkommen und für die Nachricht vom Land Israel. Der Rebbe erklärt: „Die Taten der Väter sind ein Zeichen für die Kinder“, und die drei Altäre Awrahams sind die Grundlage von drei Teilen des Dienstes seiner Nachkommen. Der erste — was der Mensch braucht, körperlich und geistig: So wie der Altar die Welt „ernährt“, sind Tora und Mizwot Nahrung für die Seele.',
        horaah: 'Tora und Mizwot sind Nahrung für die Seele: „Füttere“ sie jeden Tag mit Lernen und einer guten Tat.',
        poem: [
          'Den ersten Altar baute er sogleich,',
          'Als G-tt ihm Kinder versprach und ein Land so reich.',
          'So sind uns Tora und Mizwot gegeben —',
          'Als Brot der Seele, Nahrung für das Leben.',
        ],
      },
      {
        title: 'Der zweite Altar',
        verse: '„Und er baute dort einen Altar für den Ewigen und rief den Namen des Ewigen an“',
        card: 'Der zweite Altar — ein Gebet für die Söhne: der Weg der Teschuwa',
        explain: 'Raschi: Bei Ai sah Awraham voraus, dass seine Nachkommen dort wegen der Sünde Achans straucheln würden, und er betete für sie. Der Rebbe erklärt: Das ist das Zeichen für den zweiten Teil des Dienstes — die Teschuwa. So wie der Altar „abwendet und sühnt“, so repariert die Teschuwa, was der Mensch verdorben hat.',
        horaah: 'Einen Fehler gemacht? Nicht verzweifeln: Teschuwa repariert. Mach heute einen deiner Fehler wieder gut.',
        poem: [
          'Der zweite bei Ai: Dort betete er dann,',
          'Dass G-tt den Söhnen ihre Sünde verzeihen kann.',
          'So macht die Teschuwa die Wege wieder gut:',
          'Nach einem Fehler fang neu an — mit Mut.',
        ],
      },
      {
        title: 'Saras Schönheit',
        verse: '„Sieh doch, ich weiß, dass du eine Frau von schönem Aussehen bist“',
        card: 'Awraham war so mit G-tt verbunden, dass er äußere Schönheit nicht sah',
        explain: 'Warum sagt Awraham zu Sara „sieh, ich weiß, dass du schön bist“ erst an der Grenze von Ägypten — nach so vielen Jahren zusammen? Raschi bringt Erklärungen: Bis jetzt hatte er es wegen der Bescheidenheit von ihnen beiden nicht bemerkt; oder: Auf einer Reise verlieren Menschen meist ihre Schönheit, doch Sara behielt sie; und nach dem einfachen Sinn — jetzt kommen sie zu fremden Menschen, und es ist Zeit, sich um ihre Schönheit zu sorgen. Der Rebbe bringt die Erklärung des Baal Schem Tow: Awrahams Gedanken waren immer mit G-tt verbunden, und auf äußere, körperliche Schönheit achtete er nicht — bis er Sara vor der Gefahr Ägyptens schützen musste.',
        horaah: 'Die Gedanken beim Wichtigen: bei G-tt und beim Guten. An Äußeres denken, wenn es nötig ist — um zu schützen.',
        poem: [
          'An Ägyptens Grenze sprach er: „Du bist schön“ —',
          'Vorher hatte er es gar nicht gesehn:',
          'Mit G-tt war Awraham im Denken stets vereint,',
          'Sah Äußeres nur, wenn Gefahr erscheint.',
          'Halt bei G-tt und Gutem deinen Sinn',
          'Und schau aufs Äußere zum Schützen hin.',
        ],
      },
      {
        title: '„Ich werde geben“ — in der Zukunft',
        verse: '„Steh auf, geh durch das Land, seiner Länge und seiner Breite nach, denn dir werde Ich es geben“',
        card: 'Durch das Land gehen — nicht um es zu erwerben, sondern um es zu sehen',
        explain: 'Der Midrasch sagt, dass Awraham das Land „erwarb“, indem er durch es ging. Der Rebbe erklärt: Nach dem einfachen Sinn endet der Vers mit „denn dir werde Ich es geben“ — in der Zukunft. Das Gehen war also nicht dazu da, das Land zu erwerben, sondern zu sehen, wie groß das Land ist, das G-tt später geben wird. Darum sagt Raschi über den Altar, der danach gebaut wurde, nicht, dass er „für den Erwerb“ war.',
        horaah: 'G-ttes Versprechen sind wahr, auch bevor sie sich erfüllen: Lerne über sie und warte mit Freude auf sie.',
        poem: [
          '„Steh auf, geh durch das Land“, sprach Er zu ihm,',
          '„Dir geb Ich es“ — die Zukunft liegt darin.',
          '„Ich geb“ — kein Kauf: Er zeigt es dir genau,',
          'Wie groß das Land ist — das zeigt Er dir zur Schau.',
        ],
      },
      {
        title: 'Chewron — Verbindung',
        verse: '„Und er ließ sich in Elonej Mamre nieder, das in Chewron ist“',
        card: 'Der dritte Altar — nur für G-tt: ein Zeichen für den Dritten Tempel',
        explain: 'Hier baute Awraham den dritten Altar, und Raschi sagt kein Wort über ihn. Der Rebbe erklärt: Er hatte keinen Zweck für den Menschen — er war nur „für den Ewigen“, wie eine Ola, die ganz verbrannt wird. Das ist Dienst mit voller Hingabe, und darum in Chewron: „Chewron“ kommt von „Chibur“, „Verbindung“. Die drei Altäre sind ein Zeichen für die drei Tempel; der dritte, in Chewron, wo David zum König gesalbt wurde, ist ein Zeichen für den Dritten Tempel und das Königreich des Moschiach.',
        horaah: 'Tu heute etwas Gutes einfach „für G-tt“ — nicht für einen Vorteil und nicht für Lob.',
        poem: [
          'In Chewron stand der dritte — nur für G-tt,',
          'Kein Nutzen, kein Gewinn, nur Herz und Gebot.',
          '„Chewron“ heißt „Verbindung“ — und ein Zeichen ist:',
          'Den Dritten Tempel bald man sehen wird, gewiss.',
        ],
      },
      {
        title: 'Der Buchstabe, der blieb',
        verse: '„Denn zum Vater einer Menge von Völkern habe Ich dich gemacht“',
        card: 'Das ר blieb: die Welt beeinflussen, ohne vom eigenen Platz zu gehen',
        explain: 'Awram — „Vater Arams“, seines eigenen Ortes; Awraham — „Vater einer Menge von Völkern“. Zum Namen kam der Buchstabe ה dazu, doch das ר, das an Aram erinnert, „rührte sich nicht von seinem Platz“. Der Rebbe erklärt: Der neue Titel hebt den alten nicht auf, sondern schließt ihn ein — „Vater für Aram“ ist ein Teil von „Vater für die ganze Welt“. Wer Vater der ganzen Welt wurde, bleibt auch Vater seines eigenen Ortes.',
        horaah: 'Beeinflusse die ganze Welt — und fang bei deinen Nächsten an: Familie, Klasse, Nachbarn.',
        poem: [
          'Awram war Vater nur für Aram, klein,',
          'Dann sollte er der Völker Vater sein.',
          'Doch blieb das ר in seinem Namen fest:',
          'Fang bei den Nächsten an — dann kommt der Rest.',
        ],
      },
      {
        title: 'Sarai und Sara',
        verse: '„Denn Sara ist ihr Name“',
        card: 'Sarai — „meine Fürstin“, Sara — Fürstin über alle',
        explain: 'Sarai, mit dem Buchstaben י, heißt „meine Fürstin“: nur für Awraham, „meine und nicht für andere“. Sara, mit dem Buchstaben ה, ist „Fürstin über alle“, sogar über Awraham: „Alles, was Sara dir sagt, hör auf ihre Stimme.“ Der Rebbe erklärt: Der Sinn des Buchstabens י ist das Gegenteil des neuen Namens, darum ist für ihn dort kein Platz — und er wurde zum Namen Jehoschua hinzugefügt.',
        horaah: 'Das Gute, das ich habe, ist nicht „nur meins“: Teile es mit anderen.',
        poem: [
          '„Sarai“ — „meine Fürstin“, nur für ihren Mann,',
          '„Sara“ — über alle, wie man sehen kann.',
          'Das י ging fort — für „nur meins“ war da kein Platz:',
          'Teil auch dein Gutes — das ist ein wahrer Schatz.',
        ],
      },
    ],
  },
  audience: 'Ab 11 Jahren: genaues Lesen von Raschi und der Sinn von Namen; Opfergaben und Tempel werden erklärt. Jüngere — zusammen mit Erwachsenen.',
  practice:
    'Fang bei deinem eigenen „Aram“ an: Tu heute etwas Gutes für jemanden in deiner Nähe — in der Familie, in der Klasse oder im Haus („die Armen deiner Stadt gehen vor“) — einfach für G-tt, ohne etwas dafür zu erwarten.',
  highlight: '„Denn zum Vater vieler Völker habe Ich dich gemacht“ (Bereschit 17,5): Der Buchstabe ר „rückte nicht von seinem Platz“ — wirke auf die ganze Welt, ohne deinen eigenen Ort zu verlassen.',
  share: ({ score, max, time, grid, allSolved, site }) => `✨ Awram wurde zu Awraham — aber der Buchstabe ר blieb im Namen. Warum? Und wozu brauchte Awraham drei Altäre?

Ich ermittle zusammen mit dem Lubawitscher Rebben — „Niflaot des Rebben“, Abschnitt Lech Lecha. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bis jetzt:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: der Buchstabe, der blieb, Sarai und Sara, drei Altäre und der Altar in Chewron.
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Die Ermittlung folgt Reden des Lubawitscher Rebben: Schabbat Lech Lecha 5744 (Likkutej Sichot, Bd. 25, Lech Lecha, Rede 3) und 7. Mar-Cheschwan 5746 (Likkutej Sichot, Bd. 30, Lech Lecha, Rede 1), in hebräischer Übersetzung; Nacherzählung des Projekts.',
};

export default de;
