import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Ein Wunder in den Augen der Völker',
  hero: {
    heading: 'Der Alter Rebbe kommt frei und schreibt: „<i>sogar in den Augen aller Fürsten und aller Völker</i>“. Warum ist das so wichtig?',
    author: 'nach einer Rede des Lubawitscher Rebben · Likkutej Sichot, Bd. 25, 19. Kislew',
    intro:
      'Der 19. Kislew — der Tag, an dem der Alter Rebbe aus dem Gefängnis in Petersburg freikam — fällt immer in die Nähe des Abschnitts Wajischlach. In seinem Brief über die Befreiung betont der Alter Rebbe: „Alle Fürsten und alle Völker“ sahen das Wunder und sagten: „Vom Ewigen ist dies geschehen.“ Aber das Wichtigste an dieser Befreiung ist doch die Freiheit der Lehre der Chassidut! Ermittle zusammen mit dem Rebben: Was haben der 19. Kislew, der Auszug aus Ägypten und die künftige Erlösung gemeinsam — und was haben die Völker der Welt damit zu tun?',
  },
  summary:
    'Der 19. Kislew fällt immer in die Nähe des Abschnitts Wajischlach. In seinem Brief über die Befreiung schreibt der Alter Rebbe, dass der Name G-ttes groß wurde „in den Augen aller Fürsten und aller Völker“, und sie sagten: „Vom Ewigen ist dies geschehen, es ist wunderbar in unseren Augen.“ Wenn die Völker die Wunder G-ttes bei einem Juden sehen, hilft ihnen das, ihre sieben Gebote zu halten — das ist auch der wichtigste Sinn der Geschichte von Schechem in unserem Abschnitt. Aber das Wichtigste an der Befreiung ist die Freiheit der Chassidut, des „inneren Teils der Tora“: Die Verhaftung hing mit einer Anklage im Himmel zusammen, weil die Geheimnisse der Tora offenbart wurden. Nach der Befreiung begannen die „Quellen“ des Baal Schem Tow sich zu verbreiten. Darum ist der 19. Kislew eine Vorbereitung auf die künftige Erlösung, wenn der Moschiach die Geheimnisse der Tora offenbart. Die künftige Erlösung gleicht dem Auszug aus Ägypten, nur höher: Damals erkannten die Ägypter G-tt durch die Plagen. In der Zukunft wird die Welt in Ordnung gebracht, und „alles Fleisch wird sehen“. Der 19. Kislew ist ihr Anfang: Die Fürsten sahen, dass die Natur kein eigenes Dasein hat. Daraus folgt die Aufgabe jedes Einzelnen: Auch unter den Völkern soll der Name G-ttes groß werden — die sieben noachidischen Gebote und der Glaube an Seine Einheit.',
  glossary: {},
  riddles: [
    {
      title: 'Der Brief über die Befreiung',
      cond: `<p>Nach seiner Befreiung aus dem Gefängnis schreibt der Alter Rebbe, dass sogar „alle Fürsten und alle Völker“ das Wunder sahen und mit den Worten aus Tehillim sagten:</p><p class="verse" dir="rtl" lang="he">מאת ה׳ היתה זאת היא נפלאת בעינינו</p><p>„Vom Ewigen ist dies geschehen, es ist wunderbar in unseren Augen.“<sup data-src="ps-118-23"></sup></p><p>Warum betont der Alter Rebbe, dass die Völker der Welt das Wunder sahen? Und was sagt der Abschnitt Wajischlach dazu — in dessen Nähe der 19. Kislew immer fällt?</p>`,
      steps: [
        {
          q: 'In die Nähe welches Wochenabschnitts fällt der 19. Kislew immer?',
          hint: 'Die Woche, die sein Schabbat segnet — oder dieser Schabbat selbst.',
          opts: ['„Wajischlach“', '„Bereschit“', '„Jitro“', '„Balak“'],
        },
        {
          q: 'Wem schrieb der Alter Rebbe, als er aus dem Gefängnis kam?',
          hint: 'Der berühmte Zaddik aus Berditschew.',
          opts: ['„Rabbi Levi Jizchak aus Berditschew“', '„dem Innenminister“', '„dem Maggid aus Mesritsch“', '„Rabbi Jisrael aus Ruschin“'],
        },
        {
          q: 'In wessen Augen war das Wunder laut dem Brief besonders groß?',
          hint: 'Worte aus dem Buch Esther: „in allen Provinzen des Königs“.',
          opts: ['„in den Augen aller Fürsten und aller Völker“', '„nur in den Augen der Chassidim“', '„nur in den Augen der Gegner“', '„nur in den Augen des Königs“'],
        },
        {
          q: 'Wenn die Völker der Welt die Wunder G-ttes bei einem Juden sehen — wozu bewegt sie das?',
          hint: 'Die Kinder Noachs haben eigene Gebote.',
          opts: ['„ihre sieben Gebote zu halten“', '„alle Juden zu werden“', '„den Schabbat zu halten“', '„Gemara zu lernen“'],
        },
        {
          q: 'Warum töteten Schimon und Levi nach dem Rambam die Leute von Schechem?',
          hint: 'Schechem selbst raubte Dina. Und die Leute?',
          opts: ['„sie sahen es und wussten es — und richteten ihn nicht“', '„sie nahmen ihnen Geld weg“', '„sie gaben ihnen kein Wasser“', '„sie schlossen das Stadttor“'],
        },
        {
          q: 'Welches der sieben noachidischen Gebote hielten die Leute von Schechem nicht?',
          hint: 'Rambam: „Sie müssen Richter einsetzen… in jedem Bezirk.“',
          opts: ['„Gerichte — Richter einsetzen“', '„das Verbot des Götzendienstes“', '„das Verbot des Blutvergießens“', '„das Verbot, ein Glied vom lebenden Tier zu essen“'],
        },
      ],
      reveal: {
        h: 'Ein Wunder — auch für die Völker',
        p: 'In seinem Brief über die Befreiung schreibt der Alter Rebbe, dass der Name G-ttes groß und geheiligt wurde „in den Augen aller Fürsten und aller Völker“, und sie sagten: „Vom Ewigen ist dies geschehen, es ist wunderbar in unseren Augen.“<sup data-src="ps-118-23"></sup> Wenn Nichtjuden die Wunder G-ttes bei einem Juden sehen und anerkennen: „Vom Ewigen ist dies geschehen“, dann weckt sie das. Es hilft ihnen, so zu leben, wie G-tt es befohlen hat — vor allem, ihre sieben Gebote zu halten. Dieser Einfluss der Juden auf die Kinder Noachs ist der wichtigste Sinn der Geschichte von Schechem in unserem Abschnitt: Schimon und Levi töteten die Leute von Schechem, weil sie die sieben Gebote nicht hielten. Nach dem Rambam — weil sie Schechem nicht richteten. Denn eines der sieben Gebote ist, Richter einzusetzen.<sup data-src="rambam-kings-9-14"></sup>',
      },
      lessons: [
        {
          h: 'Der 19. Kislew und der Abschnitt Wajischlach',
          b: `<p>Der 19. Kislew fällt immer in die Nähe des Abschnitts Wajischlach: in die Wochentage, die der Schabbat Wajischlach segnet, und manchmal auf diesen Schabbat selbst. Darum kann man im Abschnitt Wajischlach Hinweise auf das Fest der Erlösung am 19. Kislew finden — und sogar eine Verbindung dazu.</p><p>Die allgemeine Verbindung ist klar: Der Abschnitt erzählt von der Rettung und Erlösung Jaakows vor Esaw — und mehr noch: „Du hast mit einem Engel und mit Menschen gekämpft und hast gesiegt.“<sup data-src="gen-32-29"></sup> Jaakow besiegte den Schutzengel Esaws, und dieser erkannte selbst Jaakows Segnungen an.</p>`,
        },
        {
          h: 'Der Brief des Alter Rebben',
          b: `<p>Als der Alter Rebbe aus dem Gefängnis kam, schrieb er über seine Befreiung an Rabbi Levi Jizchak aus Berditschew. Unter anderem schreibt er: „Denn G-tt hat Wunder getan und Großes auf der Erde gewirkt, Er hat Wunder getan und Seinen großen und heiligen Namen groß gemacht. Er wurde groß und geheiligt vor vielen, und besonders in den Augen aller Fürsten und aller Völker in allen Provinzen des Königs. Denn auch in ihren Augen war die Sache ein Wunder der Wunder, und sie antworteten und sagten darüber: ‚Nur vom Ewigen ist dies geschehen, es ist wunderbar in unseren Augen.‘“<sup data-src="ps-118-23"></sup></p><p>Ähnlich schreibt er auch im Brief an Rabbi Baruch aus Medschybisch.</p>`,
        },
        {
          h: 'Wenn die Völker ein Wunder sehen',
          b: `<p>Der Alter Rebbe verbindet also den Sinn der Erlösung damit, wie sie auf „alle Fürsten und alle Völker“ wirkte.</p><p>Und das ist verständlich: Wenn Nichtjuden die Wunder G-ttes bei einem Juden sehen und anerkennen: „Vom Ewigen ist dies geschehen“,<sup data-src="ps-118-23"></sup> dann weckt sie das. Es hilft ihnen, richtig zu leben, so wie G-tt es befohlen hat. Und das Wichtigste in diesem Befehl ist für sie: ihre sieben Gebote zu halten.</p>`,
        },
        {
          h: 'Die Lehre von Schechem',
          b: `<p>Dieser Einfluss der Juden auf die Kinder Noachs — damit sie ihre Gebote halten — ist der wichtigste Sinn der Geschichte von Schechem in unserem Abschnitt. Schimon und Levi töteten die Leute von Schechem<sup data-src="gen-34-25"></sup> als Strafe dafür, dass sie die sieben noachidischen Gebote nicht hielten.</p><p>Warum wurden sie bestraft? Nach dem Rambam — weil sie Schechem für seine Sünde nicht richteten. Denn eines der sieben noachidischen Gebote sind die Gerichte: „Sie müssen Richter einsetzen…, um über diese sechs Gebote zu richten“, und „darum hatten alle Leute von Schechem den Tod verdient: Schechem hatte geraubt, und sie sahen es und wussten es — und richteten ihn nicht“.<sup data-src="rambam-kings-9-14"></sup> Und nach dem Ramban — wegen Sünden, die sie schon vor der Geschichte mit Dina begangen hatten.</p>`,
        },
      ],
      reflection: 'Wenn andere sehen, wie ich lebe — was erfahren sie dann über G-tt?',
      takeaways: [
        'Der 19. Kislew fällt immer in die Nähe des Abschnitts Wajischlach — der Abschnitt deutet auf dieses Fest hin.',
        'Der Alter Rebbe schreibt: „Alle Fürsten und alle Völker“ sahen das Wunder und sagten: „Vom Ewigen ist dies geschehen.“',
        'Wenn die Völker die Wunder G-ttes bei einem Juden sehen, hilft ihnen das, ihre sieben Gebote zu halten.',
        'Das ist der wichtigste Sinn der Geschichte von Schechem: Seine Leute hielten die sieben Gebote nicht.',
        'Rambam: Sie sahen es und wussten es — und richteten Schechem nicht. Und Gerichte sind eines der sieben Gebote.',
      ],
      puzzle: {
        q: 'Ordne die Ermittlung: vom Brief — zur Geschichte von Schechem.',
        pieces: ['Der 19. Kislew — bei Wajischlach', 'Der Brief des Alter Rebben', 'Ein Wunder in den Augen der Völker', 'Die sieben noachidischen Gebote', 'Die Lehre von Schechem'],
        meaning: 'Der Alter Rebbe betont, dass die Völker das Wunder sahen: Das hilft ihnen, ihre sieben Gebote zu halten — davon erzählt auch der Abschnitt Wajischlach.',
      },
    },
    {
      title: 'Die Geheimnisse der Tora werden frei',
      cond: `<p>Über die Quellen der Lehre des Baal Schem Tow heißt es mit Worten aus Mischle:</p><p class="verse" dir="rtl" lang="he">יפוצו מעינתיך חוצה</p><p>„Deine Quellen werden sich nach draußen verbreiten.“<sup data-src="prov-5-16"></sup></p><p>Die Quellen der Chassidut begannen sich genau nach der Befreiung am 19. Kislew zu verbreiten. Aber warum betont der Alter Rebbe dann in seinem Brief über die Befreiung nicht das, sondern dass die Fürsten und die Völker das Wunder sahen?</p>`,
      steps: [
        {
          q: 'Alles, was in der Welt geschieht — erst recht mit dem Führer der Generation —, geschieht durch…',
          hint: 'Nicht durch einen Beschluss der Behörden und nicht durch Zufall.',
          opts: ['„g-ttliche Vorsehung“', '„Zufall“', '„einen Beschluss der Behörden“', '„nur einen Verrat“'],
        },
        {
          q: 'Womit hing die Verhaftung des Alter Rebben im Himmel zusammen?',
          hint: 'Das sagten ihm der Baal Schem Tow und der Maggid.',
          opts: ['„mit einer Anklage (Kitrug)“', '„mit einem Streit der Weisen“', '„mit einer Geldschuld“', '„mit einem Krieg“'],
        },
        {
          q: 'Worum ging es bei dieser Anklage?',
          hint: 'Im Gefängnis sagten ihm der Baal Schem Tow und der Maggid: „Die Anklage wurde stärker, weil du…“',
          opts: ['„viel Chassidut sagst, und offen“', '„nicht betest“', '„nicht Gemara lernst“', '„ins Land Israel reisen willst“'],
        },
        {
          q: 'Wie nennt der Sohar den inneren Teil der Tora?',
          hint: 'Was verborgen ist, soll verborgen bleiben.',
          opts: ['„das Verborgene der Tora“', '„das Offenbare der Tora“', '„der Krieg der Tora“', '„der einfache Sinn des Verses“'],
        },
        {
          q: 'Der Alter Rebbe fragte: „Wenn ich hier herauskomme — soll ich aufhören, Chassidut zu sagen?“ Was antwortete man ihm?',
          hint: 'Die Anklage wurde aufgehoben — also ist es erlaubt.',
          opts: ['„Hör nicht auf; und wenn du herauskommst — sag mehr“', '„Hör ganz auf“', '„Schreib, aber sprich nicht“', '„Sag es nur wenigen“'],
        },
        {
          q: 'Das Erste, was einem einfällt: Warum werden die Fürsten und Völker erwähnt?',
          hint: 'Damit die Gegner der Chassidut sehen…',
          opts: ['„ein Beweis für die Gegner: ‚G-tt ist mit uns‘“', '„die Ehre des Alter Rebben“', '„damit er eine Belohnung bekommt“', '„damit die Fürsten Angst haben“'],
        },
      ],
      reveal: {
        h: 'Das Wichtigste ist die Freiheit der Chassidut. Warum dann die Fürsten?',
        p: 'Die Verhaftung und die Befreiung des Alter Rebben waren kein Beschluss der Behörden: Alles, was mit einem Juden geschieht, und erst recht mit dem Führer der Generation, geschieht durch g-ttliche Vorsehung. Die Verhaftung hing mit einer Anklage im Himmel zusammen — weil „das Verborgene der Tora“ allen offenbart wurde. Die Anklage wurde aufgehoben, der Alter Rebbe kam frei — und die Lehre der Chassidut begann sich zu verbreiten: „Deine Quellen werden sich nach draußen verbreiten“<sup data-src="prov-5-16"></sup> begann vor allem nach dem 19. Kislew. Warum betont der Brief über die Befreiung dann die Fürsten und die Völker? Man kann nicht sagen, dass es ein Beweis für die Gegner der Chassidut ist: Für einen Beweis braucht man kein „Wunder der Wunder“. Und der Brief ging an große Zaddikim, die sowieso verstanden, dass die Chassidut befreit wurde. Weil der Alter Rebbe das gleich nach der Befreiung betont, in seiner „goldenen Sprache“, in der jedes Wort genau ist — darin liegt der wichtigste Sinn des 19. Kislew. Aber welcher?',
      },
      lessons: [
        {
          h: 'Kein Beschluss der Behörden',
          b: `<p>Aber das muss man verstehen. Alles, was in der Welt geschieht, geschieht durch die persönliche Vorsehung des Heiligen, gelobt sei Er — erst recht ein Ereignis, das mit einem Juden, mit Tora und Mizwot zu tun hat. Und erst recht eines, das mit dem Führer der Generation und mit der Offenbarung der Lehre der Chassidut überhaupt zu tun hat.</p><p>Darum kann man nicht sagen, dass die Verhaftung und die Befreiung wegen eines Beschlusses und der Macht der Regierung „unten“ geschahen — auch wenn es äußerlich durch den Verrat von Juden geschah, die freie Wahl haben.</p>`,
        },
        {
          h: 'Eine Anklage im Himmel',
          b: `<p>Wie bekannt ist, hing die Verhaftung mit einer Anklage zusammen, die im Himmel erhoben wurde, weil der Alter Rebbe die Geheimnisse der Tora offenbarte. Der Baal Schem Tow und der Maggid aus Mesritsch sagten ihm im Gefängnis: Die Anklage gegen dich wurde stärker, weil du viel Chassidut sagst, und offen.</p><p>Denn die Tora selbst nennt ihren inneren Teil „das Verborgene der Tora“. Also sollen diese Dinge verschlossen und verborgen bleiben und nicht offen herabkommen wie der offenbare Teil der Tora.</p>`,
        },
        {
          h: 'Die Quellen — nach draußen',
          b: `<p>Die Befreiung geschah, weil die Anklage aufgehoben wurde. Darum wurde der Alter Rebbe auch hier unten befreit — und durch ihn konnte der innere Teil der Tora, die Lehre der Chassidut, offenbar werden.</p><p>Der Alter Rebbe fragte den Baal Schem Tow und den Maggid: „Und wenn ich hier herauskomme — soll ich aufhören, Chassidut zu sagen?“ Sie antworteten: Weil du angefangen hast — hör nicht auf. Im Gegenteil: Wenn du herauskommst — sag mehr.</p><p>Die Befreiung am 19. Kislew war also die geistige Befreiung der ganzen Lehre der Chassidut, der Lehre des Baal Schem Tow. Und wie bekannt ist, begann die Verbreitung der Lehre des Baal Schem Tow — „Deine Quellen werden sich nach draußen verbreiten“<sup data-src="prov-5-16"></sup> — vor allem nach der Befreiung am 19. Kislew.</p>`,
        },
        {
          h: 'Was ist also wichtiger?',
          b: `<p>Daraus folgt die Frage: Wie kann der Alter Rebbe in seinem Brief mit der Nachricht von der Befreiung betonen, wie sie wirkte, „in den Augen aller Fürsten und aller Völker… und sie antworteten und sagten: ‚Vom Ewigen ist dies geschehen, es ist wunderbar in unseren Augen‘“?<sup data-src="ps-118-23"></sup></p><p>Welche Bedeutung hat das — so groß es auch ist — im Vergleich zur Befreiung und Offenbarung des ganzen inneren Teils der Tora selbst? Und mit ihm auch des inneren Teils der jüdischen Seelen: Die Offenbarung des „Verborgenen der Tora“ führt zur Offenbarung des „Verborgenen der Seele“. Dann sind das Tora-Lernen und die Mizwot eines Juden erfüllt vom Glauben an G-tt, von der Liebe zu Ihm und von der Ehrfurcht vor Ihm!</p>`,
        },
        {
          h: 'Ein Beweis für die Gegner?',
          b: `<p>Weiter schreibt der Alter Rebbe im Brief: „Und es wurde zu einem Wunder, dass G-tt mit uns ist, und es gibt keinen anderen.“ Man könnte denken: Dass alle Fürsten und alle Völker das Wunder sahen und sagten „nur vom Ewigen ist dies geschehen“, hat den Gegnern bewiesen, dass der Alter Rebbe und die Lehre der Chassidut recht haben.</p><p>Aber man kann nicht sagen, dass das die ganze Erklärung ist — aus zwei Gründen.</p>`,
        },
        {
          h: 'Zwei Einwände',
          b: `<p>Erstens: Dafür müsste man nicht so ausführlich über das Wunder sprechen — dass es sogar „in den Augen aller Fürsten und aller Völker… ein Wunder“ war. Es hätte gereicht, dass die Fürsten erkannten, dass der Alter Rebbe recht hat, und ihn freiließen.</p><p>Zweitens: Diesen Brief schickte der Alter Rebbe an Rabbi Levi Jizchak aus Berditschew und Rabbi Baruch aus Medschybisch. Und sie wussten und verstanden sicher, dass die Befreiung als Befreiung der Lehre der Chassidut wichtig war. Welche Bedeutung hätte ein „Beweis für die Gegner“ in den Augen großer Zaddikim, im Vergleich zum Wichtigsten an der Befreiung — der Offenbarung der Chassidut?!</p><p>Und wir wissen, wie genau die „goldene Sprache“ des Alter Rebben immer ist — erst recht gleich nach der Befreiung, in einem Brief an große Weise Israels, die auch im inneren Teil der Tora groß waren. Darum ist klar: Genau darin zeigt sich der wichtigste Sinn der Befreiung am 19. Kislew.</p>`,
        },
      ],
      reflection: 'Was ist in meinem Leben „verborgen“, soll aber offenbar werden — und mit wem kann ich es teilen?',
      takeaways: [
        'Alles, was mit einem Juden geschieht, geschieht durch g-ttliche Vorsehung. Die Verhaftung war kein Beschluss der Behörden.',
        'Die Verhaftung hing mit einer Anklage im Himmel zusammen: „Das Verborgene der Tora“ wurde allen offenbart.',
        'Die Anklage wurde aufgehoben — und die Lehre der Chassidut begann sich zu verbreiten: „Die Quellen — nach draußen.“',
        'Man kann nicht sagen, dass die Fürsten nur als Beweis für die Gegner erwähnt werden: Weniger hätte gereicht, und der Brief ging an große Zaddikim.',
        'Also liegt in den Worten über die Fürsten und die Völker der wichtigste Sinn des 19. Kislew.',
      ],
      puzzle: {
        q: 'Ordne die Frage der Rede.',
        pieces: ['Vorsehung, nicht die Behörden', 'Eine Anklage im Himmel', 'Die Anklage aufgehoben', 'Die Quellen der Chassidut — nach draußen', 'Warum dann die Fürsten?'],
        meaning: 'Der 19. Kislew befreite die Lehre der Chassidut — und trotzdem betont der Alter Rebbe die Fürsten und die Völker: Also liegt darin der wichtigste Sinn des Tages.',
      },
    },
    {
      title: 'Wie in den Tagen des Auszugs aus Ägypten',
      cond: `<p>Über die künftige Erlösung sagt der Prophet:</p><p class="verse" dir="rtl" lang="he">כימי צאתך מארץ מצרים אראנו נפלאות</p><p>„Wie in den Tagen deines Auszugs aus dem Land Ägypten werde Ich ihm Wunder zeigen.“<sup data-src="micah-7-15"></sup></p><p>Was war beim Auszug aus Ägypten neu — nicht für die Juden, sondern für die Ägypter? Und wie erklärt das den Brief des Alter Rebben?</p>`,
      steps: [
        {
          q: 'Der Baal Schem Tow fragte den Moschiach: „Wann kommt der Herr?“ Was antwortete er?',
          hint: 'Dieselben Worte wie im vorigen Rätsel.',
          opts: ['„wenn sich deine Quellen nach draußen verbreiten“', '„wenn alle Zaddikim werden“', '„in tausend Jahren“', '„wenn der Tempel gebaut ist“'],
        },
        {
          q: 'Die Befreiung jedes Juden, auch des einfachsten, …',
          hint: 'Raschi: „denn der Name Erlösung gilt auch für sie“.',
          opts: ['„hängt mit der allgemeinen Erlösung Israels zusammen“', '„betrifft nur ihn“', '„hat nichts mit der Tora zu tun“', '„gibt es nur bei Zaddikim“'],
        },
        {
          q: 'Wohin die Juden auch verbannt wurden, sagt die Gemara, —',
          hint: 'Megilla 29a.',
          opts: ['„die Schechina ist mit ihnen“', '„ein Engel ist mit ihnen“', '„ein Prophet ist mit ihnen“', '„niemand ist mit ihnen“'],
        },
        {
          q: 'Was wird der Moschiach nach Raschi zu „Er küsse mich mit den Küssen Seines Mundes“ offenbaren?',
          hint: 'Schir HaSchirim 1,2.',
          opts: ['„das Geheimnis der Gründe der Tora und ihre verborgenen Schätze“', '„eine neue Torarolle“', '„eine neue Sprache“', '„neue Mizwot“'],
        },
        {
          q: 'Was sagte der Pharao zu Mosche und Aharon?',
          hint: 'Schemot 5,2.',
          opts: ['„Ich kenne den Ewigen nicht“', '„Wer ist wie Du unter den Mächtigen“', '„Der Ewige — Er ist G-tt“', '„Höre, Israel“'],
        },
        {
          q: 'Der Name „Elokim“ hat in Gematria denselben Wert wie das Wort…',
          hint: '1 + 30 + 5 + 10 + 40 = 86.',
          opts: ['„Hatewa“ — die Natur', '„Hanes“ — das Wunder', '„Ha’emet“ — die Wahrheit', '„Ha’olam“ — die Welt'],
        },
      ],
      reveal: {
        h: 'Etwas Neues — auch für die Ägypter',
        p: 'In seinem Brief erzählt der Baal Schem Tow, dass er den Moschiach fragte: „Wann kommt der Herr?“ — und er antwortete: „Wenn sich deine Quellen nach draußen verbreiten.“ Weil das nach dem 19. Kislew begann, ist die Befreiung des Alter Rebben eine Vorbereitung auf die vollständige Erlösung. Und in ihrem Wesen gleicht sie ihr: In der Zukunft werden die Geheimnisse der Tora offenbar. Die künftige Erlösung gleicht dem Auszug aus Ägypten: „Wie in den Tagen deines Auszugs… werde Ich ihm Wunder zeigen.“<sup data-src="micah-7-15"></sup> Und beim Auszug gab es etwas Neues nicht nur für die Juden, sondern für die Ägypter: „Und die Ägypter werden erkennen, dass Ich der Ewige bin.“<sup data-src="ex-7-5"></sup> Von sich aus haben sie nur mit dem Namen Elokim zu tun — und er hat in Gematria denselben Wert wie das Wort „Hatewa“, „die Natur“: G-tt lenkt die Welt durch die Natur, und Sein Licht ist nicht zu sehen. Die wunderbare Führung, über der Natur, kommt vom Namen des Ewigen (Hawaja). Ihn kannten die Ägypter nicht: „Ich kenne den Ewigen nicht.“<sup data-src="ex-5-2"></sup> Beim Auszug lernten sie ihn kennen.',
      },
      lessons: [
        {
          h: 'Wann kommt der Moschiach',
          b: `<p>Um das zu erklären, braucht man eine Einleitung.</p><p>Die Worte des Baal Schem Tow in seinem Brief sind bekannt: Als er im Palast des Moschiach war, fragte er den Moschiach: „Wann kommt der Herr?“ — und der Moschiach antwortete: „Wenn sich deine Quellen nach draußen verbreiten.“<sup data-src="prov-5-16"></sup></p><p>Und weil die Verbreitung der Quellen des Baal Schem Tow nach draußen vor allem mit der Befreiung am 19. Kislew begann, folgt daraus: Die Befreiung des Alter Rebben am 19. Kislew ist eine Vorbereitung auf die allgemeine und vollständige Erlösung, wenn unser gerechter Moschiach kommt.</p>`,
        },
        {
          h: 'Jede Befreiung — ein Teil der Erlösung',
          b: `<p>In Wahrheit hängt jede Befreiung eines Juden, auch des einfachsten, mit der allgemeinen Erlösung ganz Israels zusammen: „denn der Name Erlösung gilt auch für sie“, wie Raschi sagt.</p><p>Der Grund ist einfach zu verstehen. Das Wesen der Erlösung, wenn der Moschiach kommt, hängt mit allen dreien zusammen: „Israel, der Tora und dem Heiligen, gelobt sei Er“ — und sie sind „alle eins“. Denn wie bekannt ist, ist auch „die Schechina im Exil“: Wohin die Juden auch verbannt wurden, „die Schechina ist mit ihnen“.<sup data-src="megillah-29a"></sup></p><p>So ist es auch bei der Befreiung eines einzelnen Menschen: Mit ihm werden auch die Tora und die Mizwot befreit, die er hält — und darum ist es auch eine Befreiung der Schechina, die mit ihm in seinem Exil ist. Und erst recht die Befreiung des Führers der Generation: Hier sieht man offen, dass sie auf ganz Israel wirkt und eine allgemeine Bedeutung für die Tora hat.</p>`,
        },
        {
          h: 'Die Geheimnisse der Tora — mit dem Moschiach',
          b: `<p>Und in unserem Fall muss man noch etwas hinzufügen: Der Sinn dieser Befreiung — der Befreiung des inneren Teils der Tora, ihrer Geheimnisse — ist derselbe wie der Sinn der künftigen Erlösung. Denn dann wird die Offenbarung des inneren Teils der Tora vollständig sein.</p><p>So erklärt Raschi den Vers „Er küsse mich mit den Küssen Seines Mundes“: Es geht um „das Geheimnis der Gründe der Tora und ihre verborgenen Schätze“, die unser gerechter Moschiach offenbaren wird.</p><p>Daraus folgt: Die Worte des Alter Rebben im Brief, dass die Befreiung am 19. Kislew „ein Wunder der Wunder“ ist, auch „in den Augen aller Fürsten und aller Völker“,<sup data-src="ps-118-23"></sup> sind wichtig, um die Verbindung zwischen dieser Befreiung und der künftigen Erlösung zu verstehen.</p>`,
        },
        {
          h: '„Wie in den Tagen des Auszugs aus Ägypten“',
          b: `<p>Man kann sagen, dass die Erklärung so ist. Es heißt: „Wie in den Tagen deines Auszugs aus dem Land Ägypten werde Ich ihm Wunder zeigen“<sup data-src="micah-7-15"></sup> — die Erlösung und die Wunder der Zukunft gleichen der Erlösung und den Wundern „der Tage deines Auszugs aus dem Land Ägypten“. Nur werden sie in der Zukunft höher sein: „Wunder“ (Nifla’ot) im Vergleich zu den Wundern (Nissim) des Auszugs aus Ägypten.</p><p>Daraus ist klar: Was in der Zukunft neu sein wird, kann man von der Erlösung aus Ägypten lernen.</p>`,
        },
        {
          h: 'Etwas Neues — nicht nur für Israel',
          b: `<p>Beim Auszug und bei der Erlösung aus Ägypten gab es etwas Neues nicht nur für die Juden.</p><p>Damit die Juden würdig waren, am Berg Sinai die Tora zu empfangen, mussten sie im „Eisentiegel“<sup data-src="deut-4-20"></sup> des ägyptischen Exils gereinigt werden. Und die Reinigung wurde beim Auszug aus Ägypten vollendet.</p><p>Aber es gab auch etwas Neues für die Ägypter selbst und für die Völker der Welt überhaupt. Es heißt: „Und die Ägypter werden erkennen, dass Ich der Ewige bin.“<sup data-src="ex-7-5"></sup></p>`,
        },
        {
          h: 'Elokim ist „die Natur“',
          b: `<p>Von sich aus haben der Pharao und die Ägypter keine Verbindung zur Kenntnis des Namens des Ewigen. Der Pharao sagte: „Ich kenne den Ewigen nicht.“<sup data-src="ex-5-2"></sup> Von sich aus haben sie nur mit dem Namen Elokim zu tun — so wie Josef zum Pharao sagte: „Elokim wird antworten, was zu Pharaos Wohl ist.“<sup data-src="gen-41-16"></sup></p><p>Und der Name Elokim hat in Gematria denselben Wert wie das Wort „Hatewa“, „die Natur“: <span class="he">אלקים</span> = 1 + 30 + 5 + 10 + 40 = 86, <span class="he">הטבע</span> = 5 + 9 + 2 + 70 = 86. Das heißt: Durch den Namen Elokim lenkt der Heilige, gelobt sei Er, die Welt nach der Natur, und das g-ttliche Licht ist in ihr nicht offen zu sehen.</p><p>Die Führung über der Natur, die wunderbare Führung, kommt vom Namen des Ewigen (Hawaja). Und der Pharao, die Ägypter und die Völker der Welt überhaupt haben keine Verbindung dazu und kein Verständnis dafür.</p><p>Das war das Neue bei der Erlösung aus Ägypten: „Und die Ägypter erkannten, dass Ich der Ewige bin“ — sie lernten die wunderbare Führung der Welt kennen, über der Natur, die mit dem Namen des Ewigen verbunden ist.</p>`,
        },
      ],
      reflection: 'Wo sehe ich in meinem Leben nur „die Natur“ — und wo bemerke ich, dass G-tt dahintersteht?',
      takeaways: [
        'Der Moschiach sagte dem Baal Schem Tow: Er kommt, „wenn sich deine Quellen nach draußen verbreiten“.',
        'Die Quellen verbreiteten sich nach dem 19. Kislew — also ist er eine Vorbereitung auf die Erlösung.',
        'Jede Befreiung eines Juden ist ein Teil der allgemeinen Erlösung: Mit ihm werden die Tora, die Mizwot und die Schechina befreit.',
        'Die künftige Erlösung ist „wie in den Tagen des Auszugs aus Ägypten“, nur höher.',
        'Die Ägypter kannten nur Elokim — „die Natur“. Beim Auszug lernten sie den Ewigen kennen, die Führung über der Natur.',
      ],
      puzzle: {
        q: 'Ordne die Erklärung: vom Brief des Baal Schem Tow — zu den Ägyptern.',
        pieces: ['Wann kommt der Moschiach', 'Die Quellen — nach draußen', 'Geheimnisse der Tora — mit dem Moschiach', 'Wie beim Auszug aus Ägypten', 'Die Ägypter erkannten den Ewigen'],
        meaning: 'Der 19. Kislew bereitet die Erlösung vor, und die Erlösung gleicht dem Auszug aus Ägypten, als sogar die Ägypter G-tt erkannten.',
      },
    },
    {
      title: 'Alles Fleisch wird sehen',
      cond: `<p>Über die künftige Erlösung sagt der Prophet:</p><p class="verse" dir="rtl" lang="he">ונגלה כבוד ה׳ וראו כל בשר יחדו כי פי ה׳ דבר</p><p>„Und die Herrlichkeit des Ewigen wird offenbar, und alles Fleisch wird zusammen sehen, dass der Mund des Ewigen gesprochen hat.“<sup data-src="isaiah-40-5"></sup></p><p>Wie wird sich das davon unterscheiden, wie die Ägypter G-tt erkannten? Und was kann jeder von uns schon jetzt tun?</p>`,
      steps: [
        {
          q: 'Wie erkannten die Ägypter, „dass Ich der Ewige bin“?',
          hint: 'Denk an die zehn Plagen.',
          opts: ['„durch Plagen und Unterwerfung“', '„durch Lernen“', '„durch einen Traum“', '„durch Geschenke“'],
        },
        {
          q: 'Das Wort „sie werden erkennen“ (wejad’u) — wie im Vers „und er züchtigte (wajoda) damit die Leute von Sukkot“. Was bedeutet es?',
          hint: 'Gideon züchtigte sie mit Dornen.',
          opts: ['„Zerbrechen“', '„Freude“', '„Schlaf“', '„Schweigen“'],
        },
        {
          q: 'Was wird der König Moschiach nach dem Rambam mit der Welt tun?',
          hint: '„…um G-tt gemeinsam zu dienen.“',
          opts: ['„die ganze Welt in Ordnung bringen“', '„die ganze Welt mit Krieg erobern“', '„die Welt lassen, wie sie ist“', '„die Welt verlassen“'],
        },
        {
          q: 'Die Anfangsbuchstaben des Beginns des Buches des Rambam — „Jesod haJesodot we’Amud haChochmot“ — ergeben…',
          hint: 'J, H, W, H.',
          opts: ['„den Namen des Ewigen — Hawaja“', '„den Namen Elokim“', '„den Namen Mosche“', '„das Wort ‚Tora‘“'],
        },
        {
          q: 'Was sahen die Fürsten bei der Befreiung am 19. Kislew?',
          hint: 'Mehr, als dass die Natur nicht allmächtig ist.',
          opts: ['„dass die Natur vor G-tt überhaupt kein Dasein hat“', '„dass der König stark ist“', '„dass es viele Chassidim gibt“', '„dass das Gericht gerecht ist“'],
        },
        {
          q: 'Welche Aufgabe folgt daraus für jeden?',
          hint: 'Damit der Name G-ttes auch unter den Völkern groß wird.',
          opts: ['„unter den Völkern die sieben Gebote und den Glauben an G-ttes Einheit verbreiten“', '„schweigen“', '„nur für sich selbst lernen“', '„auf die Erlösung warten und nichts tun“'],
        },
      ],
      reveal: {
        h: 'Nicht durch Plagen — durch In-Ordnung-Bringen',
        p: 'In der künftigen Erlösung wird der Einfluss auf die Völker der Welt keine Zugabe sein, sondern ein Teil der Erlösung selbst: Die Schechina kommt aus dem Exil — und die Wahrheit des Namens des Ewigen wird offenbar: Alles existiert nur „durch die Wahrheit Seines Daseins“.<sup data-src="rambam-yesodei-1-1"></sup> Darum heißt es „alles Fleisch wird sehen“: Das körperliche Fleisch selbst wird sehen, dass das wahre Dasein der Welt „der Mund des Ewigen“ ist. In Ägypten kam die Erkenntnis durch Plagen und Unterwerfung — „sie werden erkennen“ bedeutet „sie werden zerbrochen“<sup data-src="judges-8-16"></sup> —, weil jene Erlösung nicht vollständig war. Aber in der Zukunft, wenn die Körperlichkeit des Körpers und der Welt geläutert ist,<sup data-src="tanya-36"></sup> werden die Völker G-tt dadurch erkennen, dass die Welt in Ordnung gebracht wird: „Dann wende Ich den Völkern eine klare Sprache zu, damit sie alle den Namen des Ewigen anrufen.“<sup data-src="zeph-3-9"></sup> Der 19. Kislew ist eine Vorbereitung darauf: Die Fürsten und die Völker sahen nicht nur, dass die Natur nicht von selbst herrscht, sondern dass sie vor G-tt überhaupt kein Dasein hat — die Einheit G-ttes, wie sie vom Namen des Ewigen kommt, über der Natur. Darum „antworteten sie und sagten: Vom Ewigen ist dies geschehen, es ist wunderbar in unseren Augen“.<sup data-src="ps-118-23"></sup>',
      },
      lessons: [
        {
          h: 'Er bringt die ganze Welt in Ordnung',
          b: `<p>Etwas Ähnliches, nur viel höher, wird in der Zukunft geschehen. Außer der Erlösung Israels, der Tora und des Heiligen, gelobt sei Er, wird sie auf die ganze Welt wirken, auf alle Völker — wie es viele Verse und Prophezeiungen über die Erlösung sagen.</p><p>Der Rambam schreibt in seinem Buch — einem Buch der „Gesetze der Gesetze“ —, dass der König Moschiach dann „die ganze Welt in Ordnung bringen wird, damit alle zusammen G-tt dienen, wie es heißt: ‚Denn dann wende Ich den Völkern eine klare Sprache zu, damit sie alle den Namen des Ewigen anrufen und Ihm einmütig dienen.‘“<sup data-src="zeph-3-9"></sup></p>`,
        },
        {
          h: 'Keine Zugabe, sondern das Wesen',
          b: `<p>Und dieses Versprechen — der Einfluss auf die Völker der Welt — ist keine „Nebensache“, die man mit dem Kommen des Moschiach bekommt. Es hängt mit dem Wesen der Erlösung selbst zusammen. Denn dann „geht“ die Schechina aus dem Exil — und dadurch wird die Wahrheit des Namens des Ewigen offenbar: „Alle Geschöpfe — Himmel, Erde und was dazwischen ist — existieren nur durch die Wahrheit Seines Daseins.“<sup data-src="rambam-yesodei-1-1"></sup> Und „die Wahrheit Seines Daseins“ ist der Name des Ewigen, Hawaja. Er bedeutet „der, der Dasein gibt“, über der Natur der Welt.</p><p>Und die allerersten Worte des Buches des Rambam — „Jesod haJesodot we’Amud haChochmot“, „Der Grund aller Grundsätze und die Säule der Weisheit“ — ergeben mit ihren Anfangsbuchstaben diesen Namen, wie sein Enkel Rabbi David HaNagid schreibt.</p>`,
        },
        {
          h: '„Alles Fleisch wird sehen“',
          b: `<p>Darum heißt es über die Zukunft: „Und die Herrlichkeit des Ewigen wird offenbar, und alles Fleisch wird zusammen sehen, dass der Mund des Ewigen gesprochen hat.“<sup data-src="isaiah-40-5"></sup> Die Offenbarung des Namens des Ewigen — „und die Herrlichkeit des Ewigen wird offenbar“ — wird dazu führen, dass das körperliche Fleisch selbst spürbar sieht: Das wahre Dasein der materiellen Welt ist „der Mund des Ewigen“.</p><p>Wenn die Verhüllung des G-ttlichen aufhört, die Schechina aus dem Exil kommt und die wahre Wirklichkeit der Welt — das G-ttliche („der Mund des Ewigen“) — offenbar wird, dann geschieht es so, dass „alles Fleisch sieht“: Das Fleisch wird die Herrlichkeit G-ttes durch Eigenschaften sehen, die dann in seiner Natur selbst sein werden — so wie jetzt Augen aus Fleisch von Natur aus körperliche Dinge sehen.</p>`,
        },
        {
          h: 'Plagen oder In-Ordnung-Bringen',
          b: `<p>Das ist eines der neuen Dinge der künftigen Erlösung im Vergleich zur Erlösung „der Tage deines Auszugs aus dem Land Ägypten“. In Ägypten entstand die Erkenntnis der Ägypter, „dass Ich der Ewige bin“, durch die Plagen und die Unterwerfung: „Und sie werden erkennen“ kommt von dem Wort für „Zerbrechen“, wie es heißt: „Und er züchtigte (wajoda) damit die Leute von Sukkot.“<sup data-src="judges-8-16"></sup></p><p>Aber in der Zukunft wird es heißen: „Und alles Fleisch wird zusammen sehen, dass der Mund des Ewigen gesprochen hat“ — nicht durch Plagen und Unterwerfung, sondern dadurch, dass die Welt in Ordnung gebracht wird, wie der Rambam sagt: „Er wird die ganze Welt in Ordnung bringen…, damit sie alle den Namen des Ewigen anrufen und Ihm einmütig dienen.“<sup data-src="zeph-3-9"></sup></p><p>Der Grund für den Unterschied: Die Erlösung aus Ägypten war nicht vollständig, auch nicht für die Schechina. Darum wirkte sie auf die Ägypter nur durch Zerbrechen und Unterwerfung, nicht durch In-Ordnung-Bringen und Läutern. Und sie brachte sie nur zu der Erkenntnis, „dass Ich der Ewige bin“. Aber in der vollständigen Erlösung der Zukunft „wird die Körperlichkeit des Körpers und der Welt geläutert“<sup data-src="tanya-36"></sup> — und dann wird auch das körperliche Fleisch von Natur aus „die Herrlichkeit des Ewigen“ sehen.</p>`,
        },
        {
          h: 'Das Wunder des 19. Kislew',
          b: `<p>Daraus verstehen wir auch den 19. Kislew — warum der Alter Rebbe in seinem Brief den Einfluss auf die Fürsten und die Völker betont: „Und sie antworteten und sagten: Nur vom Ewigen ist dies geschehen, es ist wunderbar in unseren Augen.“<sup data-src="ps-118-23"></sup></p><p>Dass die Befreiung am 19. Kislew eine Vorbereitung auf die künftige Erlösung ist und ihr gleicht, zeigt sich nicht nur in der Befreiung des Alter Rebben und der Lehre der Chassidut selbst. Es zeigt sich auch darin, dass „G-tt Wunder getan hat… und Seinen großen und heiligen Namen groß gemacht hat… besonders in den Augen aller Fürsten und aller Völker“. Die Wunder des Ewigen wurden auch vor ihren Augen offenbar.</p>`,
        },
        {
          h: 'Damit der Name auch unter den Völkern groß wird',
          b: `<p>„Diese Tage werden erinnert und begangen.“ Besonders der 19. Kislew, über den der Alter Rebbe sagte: „Dieser Tag wird für immer in Israel als Fest bestimmt, an dem Sein großer Name groß und geheiligt wird.“ Darum muss man jedes Jahr von ihm lernen und Kraft für diese geistige Arbeit bekommen, die der Alter Rebbe in seinem Brief betont.</p><p>Das heißt: Dieser Tag gibt Lebenskraft und neue Kraft, die Quellen nach draußen zu verbreiten. Und außerdem muss man überall, wohin die Hand jedes Einzelnen reicht, erreichen, dass „Sein großer Name vor vielen groß und geheiligt wird“ — auch unter den Völkern der Welt: dass Fürsten und Völker sehen und „antworten und sagen: Vom Ewigen ist dies geschehen“. Das kommt noch zu dem klaren Gesetz des Rambam hinzu: „Mosche, unser Lehrer, befahl nach dem Wort G-ttes“, alle Menschen der Welt dazu zu bringen, die noachidischen Gebote anzunehmen — und sie zu halten, „weil der Heilige, gelobt sei Er, sie in der Tora befohlen hat“.</p>`,
        },
        {
          h: 'Der Glaube an Seine Einheit',
          b: `<p>Zu dieser Aufgabe gehört auch das Bemühen, unter den Völkern der Welt den Glauben an die Einheit G-ttes zu verbreiten — so wie er aus der Offenbarung des Namens des Ewigen kommt und wie es der Alter Rebbe ausführlich in seinem Buch Tanja erklärt, im „Tor der Einheit und des Glaubens“.</p><p>Das ist ein Teil der Befreiung am 19. Kislew und eine Vorbereitung auf die allgemeine und vollständige Erlösung: Die Einheit G-ttes, wie sie in Wahrheit bei Israel ist — dass es außer Ihm überhaupt kein Dasein gibt, wie der Rambam schreibt: „Er allein ist die Wahrheit, und kein anderer hat eine Wahrheit wie Seine Wahrheit. Und das meint die Tora: ‚Es gibt nichts außer Ihm‘“<sup data-src="rambam-yesodei-1-4"></sup> — soll auch unter den Völkern der Welt leuchten und bekannt werden.</p>`,
        },
        {
          h: 'Zwei neue Dinge — eine Vorbereitung auf die Erlösung',
          b: `<p>Es stimmt: Nach einigen Meinungen sind die Kinder Noachs selbst nur vor dem Götzendienst gewarnt, nicht vor dem „Schituf“ — dem Glauben, dass G-tt einen „Partner“ hat. Aber das bedeutet nur, dass es ihnen nicht verboten ist. Klar ist: Wenn sie verstehen und fühlen, dass es keinen „Partner“ gibt — bis zu einem gewissen Verständnis der Einheit G-ttes, dass „es nichts außer Ihm gibt“<sup data-src="deut-4-35"></sup> —, dann hilft ihnen das, die sieben noachidischen Gebote sorgfältig und in allen Einzelheiten zu halten und Israel in allen seinen Dingen zu helfen.</p><p>Diese zwei neuen Dinge sind eine Vorbereitung, die die Zeit der Erlösung näherbringt und beschleunigt. Dann werden beide vollständig sein: „Und die Herrlichkeit des Ewigen wird offenbar, und alles Fleisch wird zusammen sehen“, und „Fremde werden dastehen und eure Herden weiden“.<sup data-src="isaiah-61-5"></sup></p>`,
        },
        {
          h: 'Wunderbar in unseren Augen',
          b: `<p>Darin liegt das Besondere der Befreiung am 19. Kislew als Vorbereitung auf die künftige Erlösung.</p><p>Als G-tt „Wunder tat und Seinen großen und heiligen Namen groß machte… besonders in den Augen aller Fürsten und aller Völker — denn auch in ihren Augen war die Sache ein Wunder der Wunder“, da sahen sie nicht nur, dass die Natur mit all ihren Gesetzen nicht aus eigener Kraft herrscht. Sie sahen, dass sie überhaupt kein Dasein hat und vor dem Heiligen, gelobt sei Er, keinen wirklichen Platz einnimmt.</p><p>Das ist die Offenbarung der Einheit G-ttes — nicht so, wie sie vom Namen Elokim kommt (in Gematria „die Natur“), der sich in die Natur kleidet, sondern so, wie sie vom Namen des Ewigen kommt, über der Natur. Darum „antworteten sie und sagten: Vom Ewigen ist dies geschehen, es ist wunderbar in unseren Augen“.<sup data-src="ps-118-23"></sup></p>`,
        },
      ],
      reflection: 'Wie kann ich einem guten Bekannten, der kein Jude ist, helfen zu sehen, dass „es vom Ewigen geschehen ist“?',
      takeaways: [
        'In der Zukunft ist der Einfluss auf die Völker ein Teil des Wesens der Erlösung: Der Name des Ewigen, die Quelle von allem, was existiert, wird offenbar.',
        '„Alles Fleisch wird sehen“: Das Fleisch selbst wird sehen, dass das wahre Dasein der Welt „der Mund des Ewigen“ ist.',
        'In Ägypten — Erkenntnis durch Plagen und Unterwerfung. In der Zukunft — dadurch, dass die Welt in Ordnung gebracht wird.',
        'Am 19. Kislew sahen die Fürsten: Vor G-tt hat die Natur überhaupt kein Dasein.',
        'Die Aufgabe jedes Einzelnen: auch unter den Völkern — die sieben noachidischen Gebote und der Glaube an G-ttes Einheit.',
      ],
      puzzle: {
        q: 'Ordne die Antwort des Rebben: von Ägypten — zu unserer Aufgabe.',
        pieces: ['In Ägypten — durch Plagen', 'In der Zukunft — die Welt in Ordnung', 'Alles Fleisch wird sehen', 'Die Natur hat kein Dasein', 'Der Name groß unter den Völkern'],
        meaning: 'Die Ägypter erkannten G-tt, als sie durch die Plagen zerbrochen wurden. In der Zukunft wird die Welt in Ordnung gebracht und sieht von selbst. Der 19. Kislew ist der Anfang davon, und unsere Aufgabe ist es, weiterzumachen.',
      },
    },
  ],
  final: {
    title: 'Ermittlung gelöst',
    allSolved:
      'Alle vier Rätsel gelöst. Der Alter Rebbe betonte, dass „alle Fürsten und alle Völker“ das Wunder der Befreiung sahen — nicht als Beweis für die Gegner: Darin gleicht der 19. Kislew der künftigen Erlösung. Beim Auszug aus Ägypten erkannten die Völker G-tt durch Plagen. In der Zukunft wird die Welt in Ordnung gebracht, und „alles Fleisch wird sehen“. Jedes Jahr gibt der 19. Kislew Kraft, die Quellen der Chassidut zu verbreiten — und dass der Name G-ttes auch unter den Völkern groß wird: die sieben noachidischen Gebote und der Glaube an Seine Einheit.',
  },
  puzzle: {
    q: 'Ordne den Weg der Rede.',
    pieces: ['Ein Wunder in den Augen der Völker', 'Die Befreiung der Chassidut', 'Eine Vorbereitung auf die Erlösung', 'Wie der Auszug aus Ägypten — nur höher', 'G-ttes Name — auch unter den Völkern'],
    meaning: 'Vom Brief des Alter Rebben zu unserer Aufgabe: Der 19. Kislew beginnt, was in der Erlösung sein wird, wenn die ganze Welt sieht: „Vom Ewigen ist dies geschehen.“',
  },
  audience: 'Ab 11 Jahren: der Abschnitt Wajischlach, die Geschichte des 19. Kislew, der Auszug aus Ägypten, die sieben noachidischen Gebote, die Namen G-ttes. Jüngere Kinder — zusammen mit einem Erwachsenen.',
  practice:
    'Diese Woche ist der 19. Kislew: Lerne etwas aus der Chassidut und erzähl es jemand anderem — damit die „Quellen“ weiterfließen. Und wenn du einen Bekannten hast, der kein Jude ist, dann finde einen freundlichen Anlass, ihm von den sieben noachidischen Geboten zu erzählen und davon, dass ein einziger Schöpfer die Welt erschafft und lenkt.',
  highlight: '„Vom Ewigen ist dies geschehen, es ist wunderbar in unseren Augen“ (Tehillim 118,23): der 19. Kislew — ein Wunder auch in den Augen der Völker.',
  share: ({ score, max, time, grid, allSolved, site }) => `✨ Der Alter Rebbe kommt aus dem Gefängnis frei und schreibt: „Alle Fürsten und alle Völker“ sahen das Wunder. Warum ist das so wichtig — befreit wurde doch die Chassidut?

Ich ermittle zusammen mit dem Lubawitscher Rebben — „Niflaot des Rebben“, Abschnitt Wajischlach, 19. Kislew. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bis jetzt:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: der Brief über die Befreiung, die Geheimnisse der Tora werden frei, der Auszug aus Ägypten und „alles Fleisch wird sehen“.
Spiel mit 👉 ${site}`,
  source:
    'Die Ermittlung folgt Reden des Lubawitscher Rebben am 19. Kislew 5743 und 5744 (Likkutej Sichot, Bd. 25, 19. Kislew), in hebräischer Übersetzung; Nacherzählung des Projekts.',
};

export default de;
