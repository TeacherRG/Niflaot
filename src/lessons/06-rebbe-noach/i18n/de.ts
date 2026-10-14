import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Geh aus der Arche',
  hero: {
    heading: 'Warum musste Noach den Befehl bekommen, <i>aus der Arche zu gehen?</i>',
    author: 'nach einer Rede des Lubawitscher Rebben · Likkutej Sichot, Bd. 25, Noach',
    intro:
      'Die Erde ist schon trocken — und Noach sitzt in der Arche und wartet. Warum wollte er nicht hinaus? Warum musste G-tt ihm sagen: „Geh hinaus“ — und dazu noch extra über die Tiere? Ermittle zusammen mit dem Rebben. Und danach — Karten: zwölf Verse des Abschnitts und die Erklärungen des Rebben.',
  },
  summary:
    'Warum wollte Noach die Arche nicht verlassen? In der Arche war Frieden wie in den Tagen des Moschiach — und trotzdem: „Geh hinaus“ und fülle die Erde. König Chiskijahu und „die Geheimnisse des Allbarmherzigen“. Dazu Karten: 12 Verse des Abschnitts Noach und die Erklärungen des Rebben.',
  glossary: {},
  riddles: [
    {
      title: 'Wozu ein Befehl?',
      cond: `<p>Die Flut dauerte ein ganzes Jahr. Die Tora erzählt, wie das Wasser von der Erde wich, und endlich:</p><p class="verse" dir="rtl" lang="he">ובחדש השני בשבעה ועשרים יום לחדש יבשה הארץ</p><p>„Im zweiten Monat, am siebenundzwanzigsten Tag des Monats, war die Erde trocken.“<sup data-src="gen-8-13"></sup> Gleich danach sagt G-tt zu Noach:</p><p class="verse" dir="rtl" lang="he">צא מן התבה אתה ואשתך ובניך ונשי בניך אתך</p><p>„Geh aus der Arche — du und deine Frau, deine Söhne und die Frauen deiner Söhne mit dir.“ Und alle Tiere, Vögel und kriechenden Tiere — „bring sie mit dir hinaus“.<sup data-src="gen-8-16-17"></sup></p><p>Der Rebbe fragt: Wenn die Erde schon trocken war — wozu muss man Noach befehlen: „Geh hinaus“? Wäre er nicht von selbst hinausgegangen? Und wozu noch ein extra Befehl über die Tiere?</p>`,
      steps: [
        {
          q: 'Raschi erklärt, was „die Erde war trocken“ am 27. Tag bedeutet. Was war mit der Erde?',
          hint: 'Einen Monat vorher war das Wasser schon weg, aber die Erde war noch wie Schlamm.',
          opts: ['„sie wurde fest, wie Erde sein soll“', '„sie wurde wie Schlamm“', '„sie war wieder mit Wasser bedeckt“', '„auf ihr wuchs Gras“'],
        },
        {
          q: 'Der Midrasch antwortet auf die Frage im Namen Noachs. Was sagte Noach?',
          hint: 'So wie Noach in die Arche hineinging — so wollte er auch hinausgehen.',
          opts: ['„Ich bin nur mit Erlaubnis hineingegangen — und gehe nur mit Erlaubnis hinaus“', '„Ich hatte Angst vor dem Wasser“', '„Ich wusste nicht, dass die Erde trocken ist“', '„Ich habe geschlafen“'],
        },
        {
          q: 'Aber der Rebbe merkt an: Raschi bringt diesen Midrasch nicht. Nach Raschi sagte G-tt zu Noach „geh in die Arche“, weil Noach nicht hineingehen wollte. Wann ging Noach also hinein?',
          hint: 'Raschi: Noach „glaubte und glaubte nicht“, dass die Flut kommt.',
          opts: ['„als das Wasser ihn drängte“', '„sofort und fröhlich“', '„nach allen Tieren“', '„als der Rabe kam“'],
        },
        {
          q: 'Im Vers über die Tiere steht geschrieben „hozē“ („bring hinaus“), gelesen wird aber „hajzē“ („sag ihnen, sie sollen hinausgehen“). Was soll Noach nach Raschi tun, wenn die Tiere nicht hinauswollen?',
          hint: '„Hajzē“ — sag ihnen, sie sollen gehen. Und „hozē“?',
          opts: ['„bring du sie selbst hinaus“', '„lass sie in der Arche“', '„geh ohne sie hinaus“', '„lass sie ins Meer“'],
        },
      ],
      reveal: {
        h: 'Der Befehl gilt dem Hinausgehen selbst',
        p: 'Man könnte sagen: Der Befehl war nicht für das Hinausgehen nötig, sondern dafür, <i>wie</i> man hinausgeht — Mann und Frau zusammen. In der Arche lebten Männer und Frauen getrennt; hier erlaubte G-tt ihnen wieder das Familienleben.<sup data-src="rashi-8-16"></sup> Aber die einfachen Worte des Verses sagen: Der Befehl galt auch dem Hinausgehen selbst. Und bei den Tieren noch mehr: „Wenn sie nicht hinauswollen, bring du sie hinaus.“<sup data-src="rashi-8-17"></sup> Also wollten Noach und die Tiere die Arche nicht verlassen. Warum?',
      },
      lessons: [
        {
          h: 'Die Erde war schon trocken',
          b: `<p>In unserem Abschnitt steht: „Im zweiten Monat, am siebenundzwanzigsten Tag des Monats, war die Erde trocken.“ Danach sagte G-tt zu Noach: „Geh aus der Arche, du und deine Frau … alle Tiere … bring mit dir hinaus.“<sup data-src="gen-8-16-17"></sup></p><p>Das ist schwer zu verstehen. Die Erde war schon ganz trocken. Raschi erklärt das Wort „trocken“: „Sie wurde fest, wie es sich gehört.“<sup data-src="rashi-8-14"></sup> (Noch früher, als „das Wasser von der Erde abgetrocknet war“, war sie wie Schlamm.<sup data-src="gen-8-13"></sup>) Warum musste man Noach dann sagen: „Geh aus der Arche“? Alles, was Noach vorher tat — er schaute, ob das Wasser von der Erde weg war —, tat er von selbst, ohne Befehl.</p><p>Und mehr noch: Ein Befehl an Noach selbst reicht nicht — es braucht einen extra Befehl über die Tiere: „Alle Tiere … Vögel, Vieh und alles, was kriecht … bring mit dir hinaus“!</p>`,
        },
        {
          h: 'Mit Erlaubnis?',
          b: `<p>Im Midrasch steht: Als das Wasser ruhig wurde, hätte Noach aus der Arche gehen sollen. Aber er sagte: „Ich bin mit der Erlaubnis des Heiligen, gelobt sei Er, in die Arche gegangen. Er hat zu mir gesagt: ‚Geh du und dein ganzes Haus in die Arche.‘ Jetzt gehe ich nur mit Seiner Erlaubnis hinaus.“<sup data-src="bereshit-rabbah-34-4"></sup></p><p>Doch Raschi bringt diesen Midrasch nicht. Und vor allem: Nach dem einfachen Sinn — so schreibt Raschi ausdrücklich — sagte G-tt zu Noach „geh … in die Arche“<sup data-src="gen-7-1"></sup> nicht, um ihm die Erlaubnis zu geben. Er sagte es, weil Noach nicht hineingehen wollte: Er „glaubte und glaubte nicht, dass die Flut kommt, und ging erst in die Arche, als das Wasser ihn drängte“.<sup data-src="rashi-7-7"></sup></p>`,
        },
        {
          h: 'Wie man hinausgeht',
          b: `<p>Man kann es einfach sagen: Der Befehl war nicht für das Hinausgehen selbst nötig, sondern dafür, <i>wie</i> man hinausgeht: „du und deine Frau, deine Söhne und die Frauen deiner Söhne mit dir“. Raschi erklärt: „Mann und Frau — hier erlaubte Er ihnen wieder das Eheleben.“<sup data-src="rashi-8-16"></sup> In der Arche war es anders: „die Männer für sich und die Frauen für sich“ — das Eheleben war dort verboten.<sup data-src="rashi-6-18"></sup></p><p>Genauso bei den Tieren: Es musste gesagt werden (am Ende des Verses), dass sie sich „auf der Erde tummeln, fruchtbar sein und sich vermehren“ sollen. Raschi: „Aber nicht in der Arche — das zeigt, dass auch Vieh und Vögel dort keine Jungen bekommen durften.“<sup data-src="rashi-8-17-2"></sup></p>`,
        },
        {
          h: 'Und doch — das Hinausgehen selbst',
          b: `<p>Aber die einfachen Worte des Verses zeigen: Der Befehl galt auch dem Hinausgehen selbst — „geh aus der Arche“. Und bei den Tieren steht es noch stärker: „Geschrieben ist ‚hozē‘ … wenn sie nicht hinauswollen — bring du sie hinaus.“<sup data-src="rashi-8-17"></sup> Die Tiere wollten also vielleicht nicht aus der Arche. Darum heißt es „bring sie hinaus“ — sogar gegen ihren Willen. (Der Maharal erklärt in seinem Buch Gur Arje: Sie wollten nicht hinaus, weil ihr Futter in der Arche für sie bereitstand.)</p>`,
        },
      ],
      reflection: 'Habe ich meine eigene „Arche“ — einen Ort, an dem es mir so gut geht, dass ich nicht hinaus will?',
      takeaways: [
        'Die Erde war ganz trocken — „sie wurde fest, wie es sich gehört“ —, und trotzdem befahl G-tt Noach: „Geh aus der Arche.“',
        'Der Midrasch: Noach ging mit Erlaubnis hinein und wartete auf die Erlaubnis, hinauszugehen. Aber nach Raschi musste G-tt ihm befehlen hineinzugehen, weil er nicht wollte.',
        'Eine einfache Antwort: Der Befehl sagt, wie man hinausgeht — Mann und Frau zusammen; in der Arche lebten sie getrennt.',
        'Aber der Vers spricht auch vom Hinausgehen selbst, und bei den Tieren: „Wenn sie nicht wollen, bring sie hinaus.“ Weder Noach noch die Tiere wollten hinaus.',
      ],
      puzzle: {
        q: 'Ordne die Ermittlung: vom Vers zur Frage.',
        pieces: ['Die Erde wurde fest', '„Geh aus der Arche“', 'Wie: Mann und Frau zusammen', '„Wenn sie nicht wollen — bring sie hinaus“', 'Warum wollten sie nicht hinaus?'],
        meaning: 'Der Befehl war nicht nur dafür nötig, wie man hinausgeht, sondern für das Hinausgehen selbst: Noach und die Tiere wollten die Arche nicht verlassen. Warum — das zeigt das nächste Rätsel.',
      },
    },
    {
      title: 'Der Wolf beim Lamm',
      cond: `<p>Der Prophet Jeschajahu erzählt, wie die Welt in den Tagen des Moschiach sein wird:</p><p class="verse" dir="rtl" lang="he">וגר זאב עם כבש ונמר עם גדי ירבץ… ונער קטן נהג בם</p><p>„Der Wolf wird beim Lamm wohnen, und der Leopard wird beim Böckchen liegen … und ein kleiner Junge wird sie führen … Sie werden nichts Böses tun und nichts zerstören.“<sup data-src="isaiah-11-6"></sup></p><p>Der Rebbe sagt: In der Arche Noachs war genau so ein Frieden. Ein ganzes Jahr lebten alle Tiere zusammen — auch die Raubtiere —, und sie taten einander überhaupt nichts Böses.</p><p>Zwar sagte G-tt, Noach soll in der Arche „Kammern“ bauen<sup data-src="gen-6-14"></sup> — einen eigenen Raum für jede Art.<sup data-src="rashi-6-14"></sup> Waren die Raubtiere vielleicht einfach eingesperrt? Prüfe es zusammen mit dem Rebben.</p>`,
      steps: [
        {
          q: 'Ergänze die Worte des Propheten: „Der Wolf wird wohnen beim …“',
          hint: 'Der Wolf — bei dem, den er sonst frisst.',
          opts: ['„Lamm“', '„Bären“', '„Leoparden“', '„Löwen“'],
        },
        {
          q: 'Wer kümmerte sich um alle Tiere in der Arche? Dort waren Noach und seine Frau, drei Söhne und ihre Frauen. Wie viele Menschen waren es zusammen?',
          hint: '1 + 1 + 3 + 3.',
        },
        {
          q: 'Welche Tiere und Vögel ließ Noach nach Raschi in die Arche? Wie kamen sie dorthin?',
          hint: 'Raschi: Es waren die, die „bei ihrer Art blieben und ihren Weg nicht verdorben hatten“.',
          opts: ['„sie kamen von selbst“', '„Noach fing sie ein“', '„Noachs Söhne brachten sie“', '„das Wasser trug sie hin“'],
        },
        {
          q: 'Noch ein Wort des Propheten: Wer wird in den Tagen des Moschiach den Wolf, den Leoparden und den Löwen führen?',
          hint: 'Der, der selbst der Schwächste von allen ist.',
          opts: ['„ein kleiner Junge“', '„ein großer König“', '„ein alter Hirte“', '„ein Löwe“'],
        },
      ],
      reveal: {
        h: 'In der Arche änderte sich die Natur der Raubtiere',
        p: 'Auch wenn jede Art ihre eigene Kammer hatte: Es ist schwer zu glauben, dass die Raubtiere ein ganzes Jahr lang niemanden angerührt haben. Im Zoo braucht man viele Mitarbeiter, um auf viele Raubtiere aufzupassen — in der Arche waren nur acht Menschen, und sie hatten alle Tiere der Welt! Also änderte sich in der Arche die Natur der Raubtiere selbst — so wie es in den Tagen des Moschiach sein wird, wenn „ein kleiner Junge sie führen wird“.<sup data-src="isaiah-11-6"></sup>',
      },
      lessons: [
        {
          h: 'Wie in den Tagen des Moschiach',
          b: `<p>Eine der Erklärungen. An vielen Stellen (in chassidischen Reden) wird erklärt: In der Arche Noachs war Frieden — so wie es in der Zukunft sein wird: „Der Wolf wird beim Lamm wohnen … sie werden nichts Böses tun und nichts zerstören.“<sup data-src="isaiah-11-6"></sup> In der Arche Noachs lebten alle Arten von Vieh und wilden Tieren zusammen — auch Raubtiere, die ihre Beute zerreißen. Und trotzdem „taten sie einander gar nichts Böses und zerstörten einander nicht“.</p>`,
        },
        {
          h: 'Kammern — aber das reicht nicht',
          b: `<p>Das folgt auch aus dem einfachen Sinn des Verses. Zu den Worten „mach Kammern in der Arche“<sup data-src="gen-6-14"></sup> erklärt Raschi: „eigene Räume für jedes Vieh und jedes wilde Tier“<sup data-src="rashi-6-14"></sup> — jede Art lebte also getrennt von den anderen. Und trotzdem:</p><p>a) Es ist schwer zu sagen, dass die Raubtiere mit ihrer Natur — nur weil sie an einem eigenen Ort waren — sich so lange, ein ganzes Jahr, so verhalten haben, dass nie ein Tier einem anderen geschadet hat.</p><p>b) Wir sehen es mit eigenen Augen (im Zoo): Um auf viele Raubtiere aufzupassen, braucht man sehr viele Menschen. In der Arche Noachs waren aber nur acht Menschen — Noach, seine Frau, seine Söhne und ihre Frauen. Und sie kümmerten sich um alle Tiere, von allen Arten der ganzen Welt!</p><p>Also änderte sich in der Arche die Natur der Raubtiere — so wie es in der Zukunft sein wird. Dann ist es möglich, dass „ein kleiner Junge sie führt“.</p>`,
        },
        {
          h: 'Ein Wunder von Anfang an',
          b: `<p>Darüber muss man sich nicht wundern. Raschi hat schon vorher erklärt: In die Arche kamen nur „die, die bei ihrer Art blieben und ihren Weg nicht verdorben hatten; sie kamen von selbst, und jeden, den die Arche annahm, ließ [Noach] hinein“.<sup data-src="rashi-6-20"></sup> Daraus sehen wir: a) Nur die Besten kamen in die Arche — die ihren Weg nicht verdorben hatten. b) Schon auf dem Weg zur Arche schadeten die Raubtiere niemandem. c) Dass sie kamen, und d) dass sie in die Arche hineingingen, war ganz und gar ein Wunder.</p><p>Darum ist es gar nicht erstaunlich, dass dieses Wunder auch später weiterging, als sie in der Arche waren: Die Tiere zerstörten einander nicht, und die Natur der Raubtiere änderte sich so, dass sie anderen Tieren nicht schadeten.</p>`,
        },
      ],
      reflection: 'Wo fällt es mir am leichtesten, gut und friedlich zu sein? Was braucht es, damit es auch außerhalb meiner „Arche“ so ist?',
      takeaways: [
        'In der Arche Noachs war Frieden wie in den Tagen des Moschiach: „Der Wolf wird beim Lamm wohnen.“',
        'Eigene Kammern erklären nicht, wie die Raubtiere ein ganzes Jahr niemandem schadeten.',
        'Im Zoo passen viele Mitarbeiter auf die Raubtiere auf, in der Arche waren nur 8 Menschen.',
        'Die Tiere kamen von selbst, und nur die Besten — schon das war ein Wunder; in der Arche ging es weiter: Die Natur der Raubtiere änderte sich.',
      ],
      puzzle: {
        q: 'Ordne den Beweis des Rebben: von der Frage zum Schluss.',
        pieces: ['Eigene Kammern', 'Ein ganzes Jahr — kein Schaden', 'Nur 8 Menschen', 'Die Natur der Raubtiere änderte sich', 'Wie in den Tagen des Moschiach'],
        meaning: 'Kammern allein reichen nicht: Acht Menschen hätten die Raubtiere kein ganzes Jahr zurückhalten können. Also änderte sich ihre Natur — und die Arche war wie die Welt des Moschiach.',
      },
    },
    {
      title: 'Füllt die Erde',
      cond: `<p>Jetzt ist klar, warum Noach und die Tiere nicht hinauswollten: In der Arche war Frieden wie in den Tagen des Moschiach. Draußen — die gewöhnliche Welt.</p><p>Und trotzdem sagte G-tt: „Geh aus der Arche … bring mit dir hinaus … damit sie sich auf der Erde tummeln, fruchtbar sind und sich auf der Erde vermehren.“<sup data-src="gen-8-16-17"></sup> Danach segnete Er Noach und seine Söhne:</p><p class="verse" dir="rtl" lang="he">פרו ורבו ומלאו את הארץ</p><p>„Seid fruchtbar und vermehrt euch und füllt die Erde.“<sup data-src="gen-9-1"></sup></p><p>Was ist also höher — die Arche oder die Welt draußen?</p>`,
      steps: [
        {
          q: 'Warum wollte Noach nach den Worten des Rebben nicht aus der Arche?',
          hint: 'Denk an das letzte Rätsel: Wie war die Welt in der Arche?',
          opts: ['„in der Arche war es wie in den Tagen des Moschiach — hinausgehen heißt hinabsteigen“', '„er hatte Angst vor dem Regen“', '„er wusste nicht, dass die Erde trocken war“', '„es tat ihm leid um die Arche, die er gebaut hatte“'],
        },
        {
          q: 'Und die Raubtiere — warum wollten sie besonders nicht hinaus?',
          hint: 'Was passiert mit ihnen draußen?',
          opts: ['„draußen würden sie wieder Raubtiere und würden schaden“', '„sie würden im Regen nass“', '„sie würden sich verlaufen“', '„sie würden Noach vergessen“'],
        },
        {
          q: 'Was von dem, was beim Hinausgehen gesagt wurde, war in der Arche unmöglich?',
          hint: 'Raschi: „auf der Erde — und nicht in der Arche“.',
          opts: ['„seid fruchtbar und vermehrt euch“', '„mach dir eine Arche“', '„schick den Raben los“', '„bau einen Altar“'],
        },
        {
          q: 'Ergänze den Segen für Noach: „Seid fruchtbar und vermehrt euch und füllt die …“',
          hint: 'Nicht die Arche.',
          opts: ['„Erde“', '„Arche“', '„Himmel“', '„Meere“'],
        },
        {
          q: 'Wozu wurde diese Welt erschaffen? „Der Heilige, gelobt sei Er, wollte eine Wohnung haben in den …“',
          hint: 'Im Tanja: nicht in den oberen Welten.',
          opts: ['„unteren Welten“', '„Palästen des Himmels“', '„Arche mitten im Meer“', '„Garten Eden“'],
        },
      ],
      reveal: {
        h: 'Hinausgehen — hinabsteigen, um aufzusteigen',
        p: 'Aus der Arche gehen heißt hinabsteigen: eine Welt verlassen, die wie die Tage des Moschiach ist. Und die Raubtiere würden wieder Raubtiere. Darum wäre Noach ohne Befehl nicht hinausgegangen. Aber das Ziel ist: „Seid fruchtbar und vermehrt euch und füllt die Erde“<sup data-src="gen-9-1"></sup> — die Welt neu aufbauen. In der Arche war bei allen Wundern alles begrenzt. Wenn aber Kinder geboren werden, Generation um Generation, zeigt sich die unendliche Kraft G-ttes — und gerade in der gewöhnlichen, „unteren“ Welt: G-tt will „eine Wohnung in den unteren Welten“.<sup data-src="tanya-36"></sup>',
      },
      lessons: [
        {
          h: 'Sie wollten nicht hinabsteigen',
          b: `<p>Darum brauchte es auch, nachdem „die Erde trocken war“, den Befehl „geh aus der Arche“:<sup data-src="gen-8-16-17"></sup> Noach wollte nicht aus der Arche, denn dort war Frieden wie in der Zukunft. [Und nach der Chassidut leuchtete in der Arche Noachs das g-ttliche Licht, das sich in der Zukunft zeigen wird.] Darum ist das Hinausgehen aus der Arche ein Abstieg — verglichen mit dem, was in der Arche war.</p><p>Erst recht die Raubtiere. Wenn sie aus der Arche gehen, kehren sie zu ihrer Natur zurück — und werden wieder wild und gefährlich. Darum wollten sie nicht hinaus: Sie wollten nicht wieder Raubtiere werden.</p>`,
        },
        {
          h: 'Warum ein Befehl über die Tiere',
          b: `<p>Darum brauchte es auch einen besonderen Befehl über die Tiere: „Alle Tiere, die bei dir sind … bring mit dir hinaus“ — und sogar: „Wenn sie nicht hinauswollen, bring du sie hinaus.“<sup data-src="rashi-8-17"></sup> Denn Noach hätte so denken können: Für Noach selbst (mit Frau und Kindern) ist es nötig, aus der Arche zu gehen — um in der Welt draußen zu wirken. Für das Gute der Welt draußen lohnt sich der Abstieg. Aber die Raubtiere? Wenn man sie aus der Arche lässt, kehren sie zu ihrer alten Natur zurück, und in der Welt gibt es wieder Raubtiere!</p><p>Darum befahl G-tt Noach: Trotzdem — „alle Tiere … bring mit dir hinaus“. Daraus verstehen wir: Das Hinausgehen — „geh aus der Arche … bring mit dir hinaus“ — bringt einen Aufstieg, sogar verglichen mit dem, was in der Arche war.</p>`,
        },
        {
          h: 'Die Erde füllen',
          b: `<p>Worin besteht dieser Aufstieg? Ein Hinweis steht in den Worten des Verses selbst: „Geh aus der Arche, du und deine Frau …“ — also die Erlaubnis für das Familienleben; und „bring mit dir hinaus … damit sie sich auf der Erde tummeln, fruchtbar sind und sich auf der Erde vermehren“.<sup data-src="gen-8-16-17"></sup> Das Erste, was beim Hinausgehen gesagt wird, hat mit „seid fruchtbar und vermehrt euch“ zu tun — und in der Arche war das unmöglich. Also war der Dienst in der Arche begrenzt. Das Ziel und das Neue beim Hinausgehen ist: „Seid fruchtbar und vermehrt euch und füllt die Erde“ zu erfüllen.<sup data-src="gen-1-28"></sup></p><p>Denn nach der Flut, als G-tt „alles Bestehende auslöschte“, war Noachs Aufgabe, die Welt neu aufzubauen und die Erde zu füllen. So heißt es gleich danach: „Und G-tt segnete Noach und seine Söhne und sagte zu ihnen: Seid fruchtbar und vermehrt euch und füllt die Erde“<sup data-src="gen-9-1"></sup> — das ist ein Segen und zugleich ein Gebot.</p>`,
        },
        {
          h: 'Das Unendliche — in der unteren Welt',
          b: `<p>Alles, was es in der materiellen Welt gibt, kommt aus dem Geistigen. Darum hat das Hinausgehen aus der Arche auch einen geistigen Sinn.</p><p>Das Neue an „seid fruchtbar und vermehrt euch“ ist: Darin zeigt sich die Kraft des Unendlichen (Ejn Sof). Geburt hat keine Grenze — sie geht weiter, Generation um Generation, bis zum Ende aller Generationen.</p><p>Das ist der Unterschied zwischen der Arche und der Welt draußen. In der Arche zeigte sich zwar schon etwas von der Zukunft (die Natur der Tiere änderte sich), aber alles war begrenzt. Der Dienst in der Welt draußen dagegen, in der Welt, wie sie von Natur aus ist — gerade im „Unteren“ zeigt sich die grenzenlose Kraft G-ttes. Denn das Ziel der Schöpfung ist: „Der Heilige, gelobt sei Er, wollte eine Wohnung in den unteren Welten haben.“<sup data-src="tanya-36"></sup> Gerade unten zeigt sich das „Erbe ohne Grenzen“.</p>`,
        },
      ],
      reflection: 'Was ist mein „Hinausgehen aus der Arche“: Was Gutes kann ich heute nicht nur für mich tun, sondern für die Welt um mich herum?',
      takeaways: [
        'Die Arche war wie die Welt des Moschiach; hinausgehen heißt hinabsteigen. Die Raubtiere würden wieder Raubtiere.',
        'Darum wäre Noach ohne Befehl nicht hinausgegangen — und hätte die Raubtiere erst recht nicht hinausgelassen.',
        'Das Erste beim Hinausgehen ist „seid fruchtbar und vermehrt euch“: In der Arche war das unmöglich.',
        'Noachs Aufgabe war, die Welt neu aufzubauen: „Füllt die Erde.“',
        'Wenn Kinder geboren werden, zeigt sich die unendliche Kraft G-ttes — gerade in der unteren Welt: G-tt will „eine Wohnung in den unteren Welten“.',
      ],
      puzzle: {
        q: 'Ordne die Antwort des Rebben: vom Abstieg zum Aufstieg.',
        pieces: ['Die Arche — wie die Welt des Moschiach', 'Hinausgehen — hinabsteigen', '„Bring hinaus“ — auch die Raubtiere', '„Seid fruchtbar und vermehrt euch“', 'Eine Wohnung in den unteren Welten'],
        meaning: 'Das Hinausgehen aus der Arche sieht wie ein Abstieg aus. Aber durch „seid fruchtbar und vermehrt euch“ zeigt sich das Unendliche in der gewöhnlichen Welt — so bekommt G-tt eine Wohnung in den unteren Welten.',
      },
    },
    {
      title: 'Geh aus deiner eigenen Arche',
      cond: `<p>Daraus lernt der Rebbe Lehren für uns — für das geistige Leben und für den einfachen Sinn der Worte „seid fruchtbar und vermehrt euch“.</p><p>Der Baal Schem Tow, der Gründer der Chassidut, las die Worte „geh … in die Arche“<sup data-src="gen-7-1"></sup> auf seine Weise: Auf Hebräisch heißt „Tewa“ nicht nur „Arche“, sondern noch etwas anderes.</p><p>Und der Talmud erzählt von König Chiskijahu (Hiskija). Er sah durch heiligen Geist, dass von ihm unwürdige Kinder kommen würden — und beschloss, nicht zu heiraten. Da kam der Prophet Jeschajahu zu ihm und brachte ihm die Worte G-ttes …<sup data-src="berakhot-10a"></sup></p>`,
      steps: [
        {
          q: 'Was bedeutet „geh in die Arche (Tewa)“ nach dem Baal Schem Tow?',
          hint: '„Tewa“ heißt auf Hebräisch auch …',
          opts: ['„geh in die Worte des Gebets und der Tora“', '„geh in dein Haus“', '„geh in ein Buch“', '„steig auf ein Schiff“'],
        },
        {
          q: 'G-tt sagte: „Geh hinaus … du und deine Frau, deine Söhne und die Frauen deiner Söhne“ — die Paare zusammen. Und wie sind sie nach der Tora wirklich hinausgegangen?',
          hint: 'Schau, wer in der Geschichte vom Hinausgehen neben Noach geht (Bereschit 8,18).',
          opts: ['„Noach und seine Söhne — dann seine Frau und die Schwiegertöchter“', '„Noach mit seiner Frau, die Söhne mit ihren Frauen“', '„Noach allein“', '„Noach und die Tiere“'],
        },
        {
          q: 'Was antwortete der Prophet Jeschajahu dem König Chiskijahu, der nicht heiratete, weil er wusste, dass er unwürdige Kinder haben würde?',
          hint: '„… Was dir geboten ist — das sollst du tun.“',
          opts: ['„Was gehen dich die Geheimnisse des Allbarmherzigen an?“', '„Du hast richtig gehandelt“', '„Warte, bis du alt bist“', '„Frag die Weisen“'],
        },
        {
          q: 'Chiskijahu heiratete doch. Unter seinen Nachkommen war ein König, von dem es heißt: „Wie er war vor ihm kein König, der mit seinem ganzen Herzen zum Ewigen zurückkehrte.“ Wer war das?',
          hint: 'Nicht Menasche — der war gerade der unwürdige Sohn.',
          opts: ['„Joschijahu (Josia)“', '„Menasche“', '„Achaw“', '„Schaul“'],
        },
        {
          q: 'Der Talmud: „Der Sohn Davids (Moschiach) kommt erst, wenn …“',
          hint: 'Es geht um Seelen, die darauf warten, geboren zu werden.',
          opts: ['„alle Seelen im ‚Guf‘ verbraucht sind“ (dem Speicher der Seelen)', '„der Tempel gebaut ist“', '„alle sich eine Arche gebaut haben“', '„alle Wasser vertrocknet sind“'],
        },
      ],
      reveal: {
        h: 'Hinausgehen — und aufbauen',
        p: 'Manchmal muss man „in die Arche gehen“ — in die Worte der Tora und des Gebets —, aber danach hinausgehen und in der Welt wirken. Und „seid fruchtbar und vermehrt euch“ im einfachen Sinn ist eine besondere Aufgabe für unsere Generation, die ihre eigene Flut erlebt hat. Rechnungen wie „und wenn …?“ dürfen uns nicht aufhalten: „Was dir geboten ist — das sollst du tun.“<sup data-src="berakhot-10a"></sup> Mit jedem Kind öffnet G-tt einen neuen Kanal des Segens, und jedes Kind bringt das Kommen des Moschiach näher.<sup data-src="yevamot-62a"></sup>',
      },
      lessons: [
        {
          h: 'Versteck dich nicht in der Arche',
          b: `<p>Daraus folgt eine Lehre für den Dienst an G-tt. Manche Menschen neigen dazu, sich in die „vier Ellen“ der Tora einzuschließen: den ganzen Tag Tora lernen und sich gar nicht darum kümmern, was in der Welt um sie herum geschieht.</p><p>Sogar wer sagt: „Ich lerne den inneren Teil der Tora — ‚erkenne den G-tt deines Vaters‘. So schreibt auch der Rambam am Ende seines Buches: In den Tagen des Moschiach ‚wird die ganze Welt nur damit beschäftigt sein, G-tt zu erkennen‘“ —, kann einwenden: Warum soll ich aus den vier Ellen der Tora und des Judentums hinausgehen und „auf der Straße“ wirken? Die Antwort: „Geh aus der Arche!“</p><p>Zwar gibt es Zeiten, in denen man „in die Arche gehen“ muss. Der Baal Schem Tow erklärt die Worte „geh … in die Arche“<sup data-src="gen-7-1"></sup>: Geh in die „Tewot“ — in die Worte der Tora und des Gebets —, wenn eine Flut steigt, die „wilden Wasser“ der Welt. Aber danach muss man aus der Arche gehen und in der Welt um sich herum wirken.</p>`,
        },
        {
          h: 'Die Erde füllen — auch geistig',
          b: `<p>Man darf nicht denken, dass es nur um das eigene Gute geht: Man muss auch an das Gute für andere denken. Das Ziel ist, „die Erde zu füllen“: „Deine Quellen sollen sich nach draußen ausbreiten“ (der Baal Schem Tow), bis zum fernsten „Draußen“. „Seid fruchtbar und vermehrt euch“ im geistigen Sinn heißt: immer mehr Menschen zur Tora bringen, ohne Grenzen — „und du wirst dich ausbreiten nach Westen und Osten, nach Norden und Süden“<sup data-src="gen-28-14"></sup> — ein „Erbe ohne Grenzen“. Das bringt die Erlösung durch den Moschiach, von dem es heißt: „Der Durchbrecher zieht vor ihnen hinauf.“<sup data-src="micah-2-13"></sup></p>`,
        },
        {
          h: 'Neu aufbauen',
          b: `<p>Es gibt noch eine Lehre — aus „seid fruchtbar und vermehrt euch“ im einfachen Sinn. Die erste Aufgabe des Menschen nach der Flut, als G-tt „alles Bestehende auslöschte“, war: „Seid fruchtbar und vermehrt euch und füllt die Erde“<sup data-src="gen-9-1"></sup> — die Welt neu aufbauen.</p><p>Das ist eine besondere Lehre für unsere Generation. Sie hat eine Flut erlebt — der Allbarmherzige bewahre uns: Ein großer und wertvoller Teil des jüdischen Volkes, sein Glanz und seine Schönheit, wurde vernichtet. Darum müssen wir vor allem wissen: Auf uns liegt die Verantwortung, das jüdische Volk neu aufzubauen — auch im einfachsten, körperlichen Sinn. Damit es Menschen gibt, mit denen man Geistiges lernt, muss es zuerst Juden geben.</p>`,
        },
        {
          h: 'Rechnungen',
          b: `<p>Manche Menschen denken so: Kinder zu bekommen ist eine riesige Verantwortung. Man muss für sie sorgen — materiell und geistig: Man muss sie im Weg der Tora und der Mizwot erziehen. Wer weiß, ob ich die Kraft habe, Kinder richtig großzuziehen, damit sie an Körper und Seele gesund sind?</p><p>Darum muss man nach ihrer Meinung zuerst die eigene Lage ordnen — materiell und geistig. Erst später will man darüber nachdenken und noch später die Mizwa „seid fruchtbar und vermehrt euch“ erfüllen. Dazu kommt die Lehre von Noach.</p>`,
        },
        {
          h: 'Warum Noach zögerte',
          b: `<p>G-tt sagte zu Noach: „Geh aus der Arche, du und deine Frau“ — „Mann und Frau: hier erlaubte Er es ihnen“.<sup data-src="rashi-8-16"></sup> Trotzdem erzählt die Tora, dass in Wirklichkeit „Noach hinausging und seine Söhne und seine Frau und die Frauen seiner Söhne“<sup data-src="gen-8-18"></sup> — getrennt, nicht „Mann und Frau“.</p><p>Die Kommentatoren erklären (nach Raschi): „Noach hatte Sorge, die Mizwa ‚seid fruchtbar und vermehrt euch‘ zu erfüllen.“<sup data-src="rashi-9-9"></sup> Noach dachte also: Was nützt es, wenn ich Kinder bekomme? Es kann wieder dasselbe passieren: Sie sündigen, und das Wasser der Flut kommt und spült sie weg. Darum versprach G-tt ihm zuerst, die Welt nicht noch einmal zu zerstören — und erst danach befahl Er: „Seid fruchtbar und vermehrt euch.“</p><p>Wie konnte aber Noach, „ein gerechter und vollkommener Mann“, wegen irgendwelcher Rechnungen gegen G-ttes Willen handeln? Das ist nicht schwer: Noach dachte, die Worte „geh hinaus … du und deine Frau“ seien nur eine Erlaubnis („hier erlaubte Er es ihnen“), kein Gebot. Darum fügte G-tt danach hinzu: Das ist nicht nur eine Erlaubnis, sondern ein Gebot — „seid fruchtbar und vermehrt euch“.</p><p>Aber es bleibt unklar: G-tt versprach, dass keine Flut mehr kommt — Noach sorgte sich aber vor allem um den geistigen Zustand seiner Kinder. Wenn man Angst hat, „dass sie wieder sündigen“: Beruhigt es dann, dass sie nicht bestraft werden, wenn ihr geistiger Zustand so ist wie bei der Generation der Flut?</p>`,
        },
        {
          h: 'Die Geheimnisse des Allbarmherzigen',
          b: `<p>Daraus folgt eine klare Lehre: „Was gehen dich die Geheimnisse des Allbarmherzigen an?“ Ein Jude muss alles tun, was von ihm abhängt: die Mizwa „seid fruchtbar und vermehrt euch“ erfüllen und danach seine Söhne und Töchter nach der Tora erziehen. Er darf G-ttes Willen nicht wegen eigener Rechnungen unterlassen.</p><p>Die Weisen erzählen von König Chiskijahu: Er sah durch heiligen Geist, dass von ihm „unwürdige Kinder“ kommen würden. Darum wollte er die Mizwa „seid fruchtbar und vermehrt euch“ nicht erfüllen. G-tt bestrafte ihn dafür, denn „was gehen dich die Geheimnisse des Allbarmherzigen an? Was dir geboten ist — das sollst du tun“.<sup data-src="berakhot-10a"></sup> Wir sehen: Sogar wenn man genau weiß, was kommen wird, darf man G-ttes Gebot nicht unterlassen — erst recht, wenn es nur eine Sorge aus der eigenen Rechnung ist.</p><p>Und mehr noch: Später wurde unter Chiskijahus Nachkommen Joschijahu geboren. Von ihm heißt es: „Wie er war vor ihm kein König, der mit seinem ganzen Herzen zum Ewigen zurückkehrte … nach der ganzen Tora Mosches; und nach ihm stand keiner auf wie er“<sup data-src="kings2-23-25"></sup> — und noch andere gerechte Könige. Im Gegenteil: Erfülle G-ttes Gebot mit Freude und mit vollem Vertrauen, dass G-tt sicher hilft und Erfolg bei der Erziehung der Kinder schenkt — besonders weil du „seid fruchtbar und vermehrt euch“ ohne alle Rechnungen erfüllst.</p>`,
        },
        {
          h: 'Ein neuer Kanal für den Lebensunterhalt',
          b: `<p>Alles bisher Gesagte betrifft die Sorge um den geistigen Zustand der Kinder. Das hängt vor allem von den Eltern ab: G-tt gab ihnen die Mizwa (und das Verdienst), ihre Kinder im Weg der Tora zu erziehen, und die freie Wahl, sie zu erfüllen.</p><p>Wenn es aber um den Lebensunterhalt geht — wenn man rechnet, dass das Einkommen keine Kinder erlaubt —, zeigt man damit, dass man „klein im Glauben“ ist. Der Lebensunterhalt hängt nicht von der Wahl des Menschen ab. Ein Jude soll zwar arbeiten, aber seine Arbeit ist nur ein Gefäß für G-ttes Segen; Nahrung und Unterhalt kommen von oben. So sagt jeder im Tischgebet: „… der die ganze Welt ernährt in Seiner Güte — mit Gunst, mit Liebe und mit Erbarmen.“</p><p>Und weil G-tt einem Juden befohlen hat: „Seid fruchtbar und vermehrt euch“, öffnet sich mit jedem Kind, das geboren wird, sicher ein neuer Kanal für G-ttes Segen, für Nahrung und Unterhalt — auch für das neue Kind, „in Seiner Güte, mit Gunst, mit Liebe und mit Erbarmen“, aus Seiner Hand, die voll, offen, heilig und weit ist.</p>`,
        },
        {
          h: 'G-tt gibt die Kraft',
          b: `<p>Genauso ist es mit den Kräften der Seele. Andere sagen: Sie haben nicht die Kraft — weder körperlich noch seelisch —, um mehr Söhne und Töchter großzuziehen; das kostet viel Mühe von Seele und Körper.</p><p>Man muss wissen: Weil G-tt es befohlen hat, und Er „nur nach ihren Kräften verlangt“, ist klar, dass Er die Kraft gibt, die man braucht, um Seinen Willen zu erfüllen. Darum muss man sich nicht mit eigenen Rechnungen einmischen, sondern sich auf G-tt verlassen — und zwar mit Freude, wie bei jedem Dienst an G-tt. (Es gibt Lagen, in denen man nach der Tora anders handeln muss — wegen der Gesundheit und Ähnlichem; das entscheidet aber ein Rabbi, nicht der Mensch selbst mit seinen Rechnungen.) Und wenn die Kraft wirklich fehlt — G-tt wird sich darum kümmern. Denn damit Kinder geboren werden, braucht es einen besonderen Segen G-ttes: „Und G-tt segnete sie … seid fruchtbar und vermehrt euch.“<sup data-src="gen-1-28"></sup></p><p>Die Wahrheit ist: So ein Vertrauen auf G-tt schadet der Gesundheit nicht — im Gegenteil. Der Weg zu echter innerer Ruhe ist, nach der Ordnung zu leben, die G-tt festgelegt hat. Wenn man die natürliche Ordnung des Familienlebens stört, bringt das „Nerven“ … und vor allem schadet es der Beziehung zwischen Mann und Frau. Man nannte das Rechnen mit der „richtigen Zeit“ für Kinder „Familienplanung“. In Wirklichkeit führt es zum Gegenteil: nicht zu Ordnung und zum Aufbau einer Familie, sondern zu Unordnung.</p>`,
        },
        {
          h: 'Näher zur Erlösung',
          b: `<p>Die Mizwa „seid fruchtbar und vermehrt euch“ hat eine besondere Verbindung zu unserer Generation. Die Gemara sagt: „Der Sohn Davids kommt erst, wenn alle Seelen im ‚Guf‘ verbraucht sind“ — im Speicher der Seelen.<sup data-src="yevamot-62a"></sup> Das heißt: Die Geburt eines weiteren jüdischen Kindes bringt die vollständige Erlösung ganz Israels durch David, den König Moschiach, näher.</p><p>Und weil wir in der Generation der „Fersen des Moschiach“ leben und hoffen und beten, dass „der Spross Davids, Deines Dieners“ bald wächst, genau jetzt —, ist klar: Ein Jude muss alles tun, was von ihm abhängt, damit „alle Seelen im Guf verbraucht sind“. Das beschleunigt das Kommen des „Sohnes Davids“ mit der wahren und vollständigen Erlösung durch unseren gerechten Moschiach.</p>`,
        },
      ],
      reflection: 'Wo verstecke ich mich in meiner eigenen „Arche“ — und wem kann ich heute außerhalb von ihr etwas Gutes bringen?',
      takeaways: [
        'Manchmal muss man „in die Arche gehen“ — in die Worte der Tora und des Gebets —, aber dann hinausgehen und in der Welt wirken.',
        'Nach der Flut war die erste Aufgabe, neu aufzubauen: „Seid fruchtbar und vermehrt euch.“ Das ist eine besondere Lehre für die Generation, die die Schoa erlebt hat.',
        'Noach sorgte sich um seine künftigen Kinder. Chiskijahu hörte: „Was dir geboten ist — das sollst du tun“ — und unter seinen Nachkommen war der gerechte König Joschijahu.',
        'Mit jedem Kind öffnet G-tt einen neuen Kanal des Segens und gibt die Kraft.',
        '„Der Sohn Davids kommt erst, wenn alle Seelen im Guf verbraucht sind“: Jedes Kind bringt den Moschiach näher.',
      ],
      puzzle: {
        q: 'Ordne die Lehre des Rebben: von der Arche zur Erlösung.',
        pieces: ['In die Worte der Tora gehen', 'Zur Welt hinausgehen', 'Neu aufbauen', '„Was dir geboten ist — tu es“', 'Jedes Kind — näher zum Moschiach'],
        meaning: 'Die Arche der Tora gibt Kraft, aber das Ziel ist, hinauszugehen und die Welt zu füllen. Nicht Rechnungen entscheiden, sondern G-ttes Wille — und so kommt die Erlösung näher.',
      },
    },
  ],
  final: {
    title: 'Ermittlung gelöst',
    allSolved:
      'Alle vier Rätsel sind gelöst. Die Arche war wie die Welt des Moschiach — und trotzdem sagte G-tt: „Geh hinaus.“ Das Ziel ist, die Welt zu füllen und sie zu einer Wohnung für G-tt zu machen.',
  },
  puzzle: {
    q: 'Ordne den Weg der ganzen Rede.',
    pieces: ['Die Erde ist trocken — trotzdem braucht es einen Befehl', 'In der Arche — Frieden wie beim Moschiach', 'Hinausgehen — hinabsteigen', 'Die Erde füllen', 'Aus der eigenen Arche gehen'],
    meaning: 'Noach wollte die Arche nicht verlassen, die wie die Welt des Moschiach war. Aber G-tt will eine Wohnung unten: hinausgehen und die Erde füllen — und jeder von uns soll aus seiner eigenen Arche zur Welt hinausgehen.',
  },
  cards: {
    intro: 'Zwölf Verse des Abschnitts Noach — und zu jedem eine Erklärung des Rebben aus den Likkutej Sichot. Finde, welche Erklärung zu welchem Vers gehört.',
    items: [
      {
        title: 'Die wichtigsten Nachkommen',
        verse: '„Dies sind die Nachkommen Noachs“',
        card: 'Die wichtigsten „Nachkommen“ eines Zaddiks sind seine guten Taten',
        explain: 'Die Tora sagt: „Dies sind die Nachkommen Noachs.“ Doch bevor sie seine Kinder nennt, erzählt sie, wie gerecht er war. Raschi erklärt: Die wichtigsten „Nachkommen“ der Zaddikim sind ihre guten Taten. Das Gute, das ein Mensch tut, bleibt für immer.',
        horaah: 'Jede gute Tat ist wie ein Kind, das weiterlebt. Tu heute eine gute Tat mehr als sonst.',
        poem: [
          '„Die Nachkommen Noachs“ — so fängt es an,',
          'Doch erst wird erzählt, was er Gutes getan.',
          'Die Kinder der Zaddikim sind gute Taten:',
          'Sie leben weiter, wie wachsende Saaten.',
        ],
      },
      {
        title: '„Die Wasser Noachs“',
        verse: '„Das Ende allen Fleisches ist vor Mich gekommen“',
        card: 'Noach betete nicht für seine Generation — sorge für alle',
        explain: 'G-tt sagte Noach, dass die Welt zerstört wird. Noach baute die Arche, aber er bat nicht um Erbarmen für die Menschen seiner Generation, wie es später Awraham und Mosche taten. Darum, sagt der Sohar, nennt der Prophet Jeschajahu die Flut „die Wasser Noachs“. Der Rebbe lehrt: Daran sieht man, wie wichtig es ist, für andere zu sorgen.',
        horaah: 'Schließ dich nicht in deiner eigenen „Arche“ ein: Bete und sorge nicht nur für dich, sondern auch für die Menschen um dich herum.',
        poem: [
          'G-tt sprach: „Das Ende ist nun nah“ —',
          'Doch Noach betete für niemand da.',
          '„Die Wasser Noachs“ heißt die Flut seither:',
          'Bete für alle, nicht für dich nur — immer mehr.',
        ],
      },
      {
        title: 'Hundertzwanzig Jahre',
        verse: '„Mache dir eine Arche“',
        card: 'Die Arche dauerte 120 Jahre — damit Menschen fragen und umkehren',
        explain: 'G-tt hätte Noach auch ohne Arche retten können, aber Er befahl ihm, eine zu bauen. Raschi erklärt: Noach baute hundertzwanzig Jahre an der Arche. So sollten die Menschen sie sehen, fragen „Warum?“ — und Zeit haben, umzukehren.',
        horaah: 'Eine gute Tat, die alle sehen, ist schon selbst eine Lehre: Sie bringt Menschen zum Fragen und Nachdenken.',
        poem: [
          '„Bau eine Arche“, sprach G-tt zu Noach dort;',
          'Hundertzwanzig Jahre baute er fort,',
          'Damit die Menschen fragen: „Warum nur?“ —',
          'Und umkehren zu G-tt auf rechter Spur.',
        ],
      },
      {
        title: 'Fenster oder Stein',
        verse: '„Mache der Arche ein Licht“',
        card: 'Ein Fenster lässt Licht herein, ein Edelstein leuchtet selbst',
        explain: 'Raschi bringt zwei Meinungen: Der Zohar war ein Fenster — oder ein Edelstein, der leuchtete. Der Rebbe erklärt: Ein Fenster lässt Licht von draußen herein — so vertreibt man die Dunkelheit der Welt. Ein Stein leuchtet von innen — so wird die Welt selbst zu einer Quelle von Licht.',
        horaah: 'Lass nicht nur das Licht der Tora in dein Leben — werde selbst ein Licht.',
        poem: [
          '„Mach Licht in der Arche“: ein Fenster, ein Stein?',
          'Durchs Fenster scheint Licht von draußen herein,',
          'Der Edelstein strahlt aus sich selbst ganz hell:',
          'Die Welt wird selbst Licht — das ist unser Ziel.',
        ],
      },
      {
        title: 'Die Arche ist ein Wort',
        verse: '„Geh du und dein ganzes Haus in die Arche“',
        card: '„Tewa“ heißt auch „Wort“: Geh in die Worte der Tora und des Gebets',
        explain: 'Der Baal Schem Tow lehrte: „Tewa“ heißt nicht nur „Arche“, sondern auch „Wort“. Die Wasser der Flut sind die wilden Wasser der Sorgen um das tägliche Brot. Der Befehl „Geh in die Arche“ bedeutet: Geh in die Worte der Tora und des Gebets — sie schützen dich und dein ganzes Haus.',
        horaah: 'Wenn die Sorgen dich überfluten — geh in die Worte des Gebets und der Tora, zusammen mit deiner Familie.',
        poem: [
          '„Geh in die Tewa“ — geh hinein ins Wort:',
          'In Tora und Gebet, an diesen sicheren Ort.',
          'Mag rings das Wasser der Sorgen toben —',
          'Die Worte halten dich und dein Haus oben.',
        ],
      },
      {
        title: 'Quellen der Weisheit',
        verse: '„Alle Quellen der großen Tiefe brachen auf“',
        card: 'Vor Moschiach öffnen sich Quellen der Weisheit — wie Quellen der Flut',
        explain: 'Die Flut begann im sechshundertsten Lebensjahr Noachs: Die Quellen der Tiefe und die Fenster des Himmels öffneten sich. Der Sohar sagt: Im sechshundertsten Jahr des sechsten Jahrtausends öffnen sich die Tore der Weisheit oben und die Quellen der Weisheit unten. Der Rebbe erklärt: Wenn sich die innere Tora zeigt und die Wissenschaft wächst, bereitet das die Welt auf die Tage des Moschiach vor.',
        horaah: 'Nutze Wissen und Technik für das Gute — für Tora und Mizwot.',
        poem: [
          'Die Quellen der Tiefe brachen auf in der Flut,',
          'Im sechshundertsten Jahr kommt Weisheit wie eine Flut:',
          'Die innere Tora und Wissen dazu',
          'Bereiten die Welt auf Moschiach — im Nu.',
        ],
      },
      {
        title: 'Vierzig Tage',
        verse: '„vierzig Tage und vierzig Nächte“',
        card: 'Vierzig Tage — wie vierzig Sea einer Mikwe: Die Flut reinigte die Welt',
        explain: 'Der Regen der Flut fiel vierzig Tage und vierzig Nächte. Der Rebbe erklärt: Das ist wie die vierzig Sea Wasser in einer Mikwe. Die Flut war nicht nur eine Strafe — sie reinigte die Erde, und danach war die Welt neu.',
        horaah: 'Sieh auch in etwas Schwerem eine Reinigung und einen neuen Anfang.',
        poem: [
          'Vierzig Tage fiel der Regen schwer —',
          'Wie vierzig Sea der Mikwe, rein und klar.',
          'Nicht nur Strafe: Die Welt, die vorher war,',
          'Wurde neu durch den Schöpfer, rein und hehr.',
        ],
      },
      {
        title: '„Nur“ Noach',
        verse: '„Und es blieb nur Noach übrig“',
        card: 'Noach blieb allein — erschöpft von der Sorge um alle in der Arche',
        explain: 'Raschi erklärt das Wort „nur“ (אך): Nach dem einfachen Sinn blieb Noach allein. Und nach dem Midrasch stöhnte er und hustete Blut vor Arbeit: Tag und Nacht fütterte er die Tiere. Einmal kam er zu spät, und ein Löwe verletzte ihn. Der Rebbe verbindet beide Erklärungen: Man kann die Welt nur erhalten, wenn man sich ganz hingibt.',
        horaah: 'Sorge für die, die von dir abhängen — pünktlich und von ganzem Herzen, auch wenn es schwer ist.',
        poem: [
          '„Nur Noach blieb“ — allein und ganz erschöpft:',
          'Er fütterte die Tiere, bis die Kraft versiegt.',
          'Willst du die Welt erhalten, gib dich ganz hinein,',
          'Sorg pünktlich, auch wenn es schwer mag sein.',
        ],
      },
      {
        title: 'Geh aus der Arche',
        verse: '„Geh aus der Arche“',
        card: 'Noach wartete auf G-ttes Wort — und trug die Heiligkeit hinaus',
        explain: 'Die Erde war schon trocken, aber Noach ging nicht von selbst aus der Arche: Er wartete, bis G-tt sagte: „Geh aus der Arche.“ Der Rebbe lehrt: Die Arche ist eine Zeit, sich mit Heiligkeit zu füllen. Aber dann muss man hinaus in die Welt — eine Familie gründen („seid fruchtbar und mehret euch“), die Erde bebauen und die ganze Welt zu einer Wohnung für G-tt machen.',
        horaah: 'Was du beim Beten und Lernen bekommen hast — bring es in einen gewöhnlichen Tag: nach Hause, in die Schule, zur Arbeit.',
        poem: [
          'Noach ging nicht hinaus, bis er vernahm,',
          'Wie G-ttes Wort „Geh hinaus!“ zu ihm kam.',
          'Füll dich in der Arche, dann geh in die Welt,',
          'Damit sie G-tt zur Wohnung wird bestellt.',
        ],
      },
      {
        title: 'Das Ebenbild G-ttes',
        verse: '„denn im Ebenbild G-ttes hat Er den Menschen gemacht“',
        card: 'Der Mensch ist „im Ebenbild G-ttes“ gemacht — jedes Leben ist heilig',
        explain: 'Nach der Flut gab G-tt Noach und seinen Söhnen Gesetze für alle Menschen. Eines davon: nicht töten, „denn im Ebenbild G-ttes hat Er den Menschen gemacht“. Der Rebbe erklärt: In jedem Menschen ist ein g-ttliches Ebenbild, und darauf stehen die Gesetze für die Kinder Noachs.',
        horaah: 'Achte jeden Menschen: In jedem ist „das Ebenbild G-ttes“.',
        poem: [
          'G-tt sprach zu Noach: „Vergieß kein Blut:',
          'Im Bild G-ttes ist jeder Mensch, wie gut!“',
          'In jedem Menschen ist des Schöpfers Bild —',
          'Drum achte jeden, freundlich und mild.',
        ],
      },
      {
        title: 'Der Regenbogen',
        verse: '„Meinen Bogen habe Ich in die Wolke gesetzt“',
        card: 'Der Regenbogen zeigt: Die Welt ist rein, nach dem Fall steht sie auf',
        explain: 'Warum gab es vor der Flut keinen Regenbogen? Der Rebbe erklärt: Die Flut und die Opfergaben Noachs reinigten die Welt — und man konnte den Regenbogen sehen. Er ist ein Zeichen, dass die Welt „erwachsen“ geworden ist: Auch wenn sie stolpert, kann sie aufstehen und zum Schöpfer zurückkehren. Wenn G-tt den Regenbogen sieht, zerstört Er die Welt nicht.',
        horaah: 'Wenn du stolperst, verzweifle nicht: Du kannst immer aufstehen und umkehren (Teschuwa).',
        poem: [
          'Ein Bogen in der Wolke — ein Zeichen nach der Flut:',
          'Die Welt ist rein geworden, sie wächst und es wird gut.',
          'Fällst du, steh auf und kehr zum Schöpfer heim:',
          'Der Weg der Teschuwa wird immer offen sein.',
        ],
      },
      {
        title: 'Nicht auf fremde Scham schauen',
        verse: '„und die Blöße ihres Vaters sahen sie nicht“',
        card: 'Schem und Jefet sahen den Fehler des Vaters nicht an — sie deckten zu',
        explain: 'Als Noach betrunken war und unbedeckt dalag, sah es Cham und erzählte es seinen Brüdern. Aber Schem und Jefet gingen rückwärts, deckten ihren Vater zu und schauten ihn nicht an. Der Rebbe lehrt: Wenn du bei einem anderen etwas Schlechtes siehst, starr nicht hin und erzähl es nicht weiter — hilf und deck es zu.',
        horaah: 'Wenn du den Fehler eines anderen siehst — erzähl ihn nicht weiter, sondern hilf leise.',
        poem: [
          'Cham sah den Vater und hat es erzählt;',
          'Schem und Jefet gingen rückwärts und deckten ihn zu.',
          'Siehst du, dass einer irrt oder fehlt —',
          'Hilf und deck zu, so wie sie, auch du.',
        ],
      },
    ],
  },
  audience: 'Ab 11 Jahren: Das Rechnen ist ganz einfach, aber es geht um Familie, Kinder und unsere Generation; Jüngere zusammen mit Erwachsenen. Die Karten passen auch für Jüngere.',
  practice:
    'Geh heute aus deiner eigenen „Arche“: Erzähl nach dem Gebet oder dem Tora-Lernen jemandem einen Gedanken aus der Tora oder tu ihm etwas Gutes — „füll die Erde“ mit Licht.',
  highlight: '„Seid fruchtbar und vermehrt euch und füllt die Erde“ (Bereschit 9,1): In der Arche war Frieden wie in den Tagen des Moschiach, aber G-tt will eine Wohnung unten.',
  share: ({ score, max, time, grid, allSolved, site }) => `🕊 Die Erde ist schon trocken — und Noach geht nicht aus der Arche. Warum musste G-tt befehlen: „Geh hinaus“?

Ich ermittle zusammen mit dem Lubawitscher Rebben — „Niflaot des Rebben“, Abschnitt Noach. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bis jetzt:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: wozu der Befehl hinauszugehen, der Wolf beim Lamm in der Arche, „füllt die Erde“ und wie man aus der eigenen Arche geht. Und danach — Karten: 12 Verse des Abschnitts und die Erklärungen des Rebben.
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Die Ermittlung folgt einer Rede des Lubawitscher Rebben (Schabbat Noach 5741 und 5743, Schabbat Chaje Sara 5743; Likkutej Sichot, Bd. 25, Noach, Rede 3, in hebräischer Übersetzung); Nacherzählung des Projekts. Die Karten folgen Reden zum Abschnitt Noach (Likkutej Sichot, Bd. 1, 5, 10, 15, 25).',
};

export default de;
