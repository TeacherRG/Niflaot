import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Drei Stunden',
  hero: {
    heading: 'Warum hielt Adam <i>nur drei Stunden</i> nicht durch?',
    author: 'nach einer Rede des Lubawitscher Rebben · Simchat Tora 5723',
    intro:
      'Der erste Mensch — das Werk der Hände G-ttes Selbst — hörte das Verbot von Ihm Selbst. Ein Verbot für nur drei Stunden. Und er hielt nicht durch. Ermittle mit dem Rebben: warum — und was das jedes Zuhause lehrt.',
  },
  summary:
    'Warum hielt Adam ein Verbot für nur drei Stunden nicht durch? „Wer größer ist als sein Gefährte, dessen böser Trieb ist auch größer.“ Warum Mosche am Sinai zuerst zu den Frauen sprach. Das Zuhause als kleines Heiligtum.',
  glossary: {},
  riddles: [
    {
      title: 'Drei Stunden',
      cond: `<p>Den Abschnitt Bereschit liest man am Ende des Tischri, am Anfang des neuen Jahres, und er gibt Weisung für das ganze Jahr. In ihm steht das erste Gebot, das G-tt dem Menschen gab:</p><p class="verse" dir="rtl" lang="he">ומעץ הדעת טוב ורע לא תאכל ממנו כי ביום אכלך ממנו מות תמות</p><p>„Aber vom Baum der Erkenntnis von Gut und Böse sollst du nicht essen; denn an dem Tag, an dem du davon isst, musst du sterben.“<sup data-src="gen-2-17"></sup></p><p>Der Talmud teilt den sechsten Schöpfungstag nach Stunden ein. Der Tag hat zwölf Stunden. <b>In der neunten Stunde</b> erhielt Adam das Gebot, nicht von dem Baum zu essen, <b>in der zehnten</b> sündigte er.<sup data-src="sanhedrin-38b"></sup> Wenn die zwölfte Stunde zu Ende geht, beginnt der erste Schabbat — und das Verbot wird aufgehoben.</p>`,
      steps: [
        {
          q: 'Wie viele Stunden musste Adam durchhalten — vom Gebot in der neunten Stunde bis zum Ende des Tages?',
          hint: 'Ziehe von den 12 Stunden des Tages 9 ab.',
        },
        {
          q: 'Und wie viele Stunden hielt er tatsächlich durch?',
          hint: 'Das Gebot — in der neunten Stunde, die Sünde — in der zehnten.',
        },
        {
          q: 'Der Midrasch wundert sich: Adam hielt nicht einmal eine Stunde durch, seine Nachkommen aber essen nach dem Gebot der Tora drei Jahre lang nicht die Früchte eines jungen Baumes. Wie heißt dieses Verbot?',
          hint: 'Die Tora nennt die Früchte der ersten Jahre eines Baumes „unbeschnitten“ — ערלים.',
          opts: [
            '„Orla“ — die Früchte eines Baumes in den ersten drei Jahren',
            '„Schmitta“ — das siebte Jahr, in dem das Land ruht',
            '„Jowel“ — das fünfzigste Jahr',
            '„Schabbat“ — der Ruhetag',
          ],
        },
      ],
      reveal: {
        h: 'Nötig waren drei Stunden. Er hielt eine durch',
        p: 'Das Verbot galt nur an jenem Tag: von der neunten Stunde bis zum Abend, drei Stunden. Adam aber sündigte schon in der zehnten. „Adam, du konntest nicht einmal eine Stunde in deinem Gebot bestehen“, sagt der Midrasch, „während deine Nachkommen drei Jahre auf die Orla warten!“<sup data-src="bereshit-rabbah-21-7"></sup>',
      },
      lessons: [
        {
          h: 'Bereschit — Weisung für das ganze Jahr',
          b: `<p>Den Abschnitt Bereschit liest man am Ende des Tischri, des Monats, mit dem das neue Jahr beginnt. Darum ist das, was in ihm erzählt wird, Weisung für das ganze kommende Jahr.</p><p>Eine davon ist das erste Gebot G-ttes: das Verbot an Adam, vom Baum der Erkenntnis zu essen. Aus dem Midrasch geht hervor, dass dieses Verbot nur an jenem Tag galt.<sup data-src="bereshit-rabbah-21-7"></sup> Betrachtet man die Ereignisse des sechsten Schöpfungstages, so sollte es nur drei Stunden lang gelten. Das Gebot wurde in der neunten Stunde nach Tagesanbruch gegeben;<sup data-src="sanhedrin-38b"></sup> drei Stunden später endete der Tag, der erste Schabbat begann — und das Verbot wurde aufgehoben. Und doch konnte Adam sich trotz der kurzen Zeit nicht beherrschen und übertrat G-ttes Gebot.</p>`,
        },
        {
          h: 'Das Werk der Hände G-ttes',
          b: `<p>Es stellt sich die Frage. Adam war „das Gebilde der Hände des Heiligen, gelobt sei Er, Selbst“<sup data-src="bereshit-rabbah-24-5"></sup> und hörte dieses Verbot von Ihm Selbst. Wie konnte er sich nicht einmal drei Stunden lang beherrschen?</p><p>Der Midrasch spricht darüber mit Staunen: „Wer nimmt dir den Staub von den Augen, Adam? Nicht einmal eine Stunde konntest du in dem Gebot bestehen — und deine Kinder warten drei Jahre, bis die Orla vorüber ist.“<sup data-src="bereshit-rabbah-21-7"></sup></p>`,
        },
        {
          h: 'Nicht nur Geheimnisse',
          b: `<p>Gewiss sind mit dieser Sünde viele Geheimnisse der Tora verbunden. Doch jede Erzählung der Tora muss auch in ihrem einfachen Sinn verstanden werden: „Ein Vers verlässt nicht seinen einfachen Sinn.“<sup data-src="shabbat-63a"></sup> Warum also übertrat Adam das Verbot — im einfachen Sinn?</p>`,
        },
      ],
      reflection: 'Was sind heute meine „drei Stunden“ — eine kurze Anstrengung, die einfach scheint, aber aus irgendeinem Grund am schwersten fällt?',
      takeaways: [
        'Bereschit liest man am Anfang des Jahres: seine Erzählungen sind Weisung für das ganze Jahr.',
        'Das Verbot des Baumes der Erkenntnis galt nur an jenem Tag: von der neunten Stunde bis zum Schabbat — drei Stunden.',
        'Adam sündigte in der zehnten Stunde — er hielt nicht einmal eine Stunde durch, seine Nachkommen aber warten drei Jahre auf die Orla.',
        'Die Frage der Rede: Wie konnte das Werk der Hände G-ttes, der das Gebot von Ihm Selbst hörte, sich nicht beherrschen?',
      ],
      puzzle: {
        q: 'Ordne den sechsten Schöpfungstag nach Stunden.',
        pieces: ['9. Stunde: das Gebot', '10. Stunde: die Sünde', '12. Stunde: der Tag endet', 'Schabbat: Verbot aufgehoben'],
        meaning: 'Er musste drei Stunden durchhalten, bis zum Schabbat — doch Adam sündigte schon nach einer. Daher die Frage der ganzen Rede: warum?',
      },
    },
    {
      title: 'Größer als sein Gefährte',
      cond: `<p>Der Rebbe antwortet: Man muss verstehen, <b>worauf der böse Trieb</b> (Jezer hara) <b>eigentlich aus ist</b>.</p><p>Der Talmud erzählt von Abaje, einem großen Weisen. Einmal sah er, wie ein anderer Mann einer Versuchung widerstand, und dachte: „An seiner Stelle hätte ich nicht widerstanden.“ Abaje war tief betrübt. Da kam ein Greis und lehrte ihn: „Wer größer ist als sein Gefährte — dessen … ist auch größer.“<sup data-src="sukkah-52a"></sup></p>`,
      steps: [
        {
          q: 'Der böse Trieb hat allerlei Argumente, aber, sagt der Rebbe, nur ein Ziel. Welches?',
          hint: 'Dem bösen Trieb geht es nicht um das Vergnügen an sich.',
          opts: [
            '„dass der Mensch gegen G-ttes Willen handelt“',
            '„dass der Mensch Vergnügen hat“',
            '„dass der Mensch sich ausruht“',
            '„dass der Mensch Erfolg hat“',
          ],
        },
        {
          q: 'Ergänze die Worte des Greises: „Wer größer ist als sein Gefährte — dessen … ist auch größer.“',
          hint: 'Abaje war betrübt, dass er der Versuchung nicht widerstanden hätte. Womit tröstete ihn der Greis?',
          opts: ['„sein böser Trieb“', '„sein Lohn“', '„seine Ehre“', '„sein Anteil“'],
        },
        {
          q: 'Raw Josef fragte den Sohn des Weisen Rabba: „Dein Vater — worin war er besonders …?“ Er antwortete: „In Zizit.“ Welches Wort fehlt?',
          hint: 'Rabba hütete dieses Gebot sehr: Riss ein Faden seiner Zizit, tat er keinen Schritt, bevor er einen neuen angebracht hatte.',
          opts: ['„sorgsam, achtsam“', '„fröhlich“', '„reich“', '„stark“'],
        },
      ],
      reveal: {
        h: 'Wer größer ist, dessen böser Trieb ist größer',
        p: 'Der böse Trieb will nur eines — dass der Mensch gegen G-ttes Willen handelt —, und er kämpft am stärksten dort, wo ein Gebot am wichtigsten ist. Adam, das Werk der Hände G-ttes, war größer als alle, und vom Gebot über den Baum hing sein Schicksal und das aller seiner Nachkommen ab. Darum trat der böse Trieb, gekleidet in die Schlange, mit aller Kraft gegen ihn an.',
      },
      lessons: [
        {
          h: 'Was der böse Trieb will',
          b: `<p>Das ganze Streben des bösen Triebes ist, dass der Mensch das Gegenteil von dem tut, was G-tt will. Alle Argumente, mit denen er zur Übertretung eines Verbots oder zur Unterlassung eines Gebots überredet, haben ein einziges Motiv: dass der Mensch G-ttes Willen übertritt.</p><p>Es gibt Lagen — wegen des Menschen selbst, wegen des Ortes oder wegen der Zeit —, in denen die Erfüllung eines Gebots besonders wichtig ist. Dann strengt sich der böse Trieb besonders an. Obwohl ein solches Gebot in Wahrheit leicht zu halten ist, bringt der böse Trieb gerade weil es so wichtig ist, allerlei Forderungen und Begründungen vor, um den Menschen davon abzuhalten, G-ttes Willen zu erfüllen.</p>`,
        },
        {
          h: 'Warum das „Leichte“ am schwersten fällt',
          b: `<p>Jeder von uns kann manchmal „die Stimme“ seines bösen Triebes hören, der ihn genau so überreden will. Manche Seiten der Erfüllung von Tora und Geboten sollten logisch viel leichter sein als andere. Und doch fühlt ein Mensch manchmal, dass gerade diese „leichten“ Dinge die größte Herausforderung sind. Wie gesagt, widersetzt sich der böse Trieb am meisten dort, wo eine Sache für diesen Menschen am wichtigsten ist.</p><p>Das halachische „Gewicht“ der Frage entscheidet dabei nicht. Manchmal liegt die Schwierigkeit in einer rabbinischen Anordnung oder sogar in einem Brauch, während ein Gebot der Tora viel leichter zu halten ist. Und doch kann für das geistige Wohl des Menschen die rabbinische Anordnung oder der Brauch in diesem Moment wichtiger sein.</p>`,
        },
        {
          h: 'Jede Seele hat ihre Gebote',
          b: `<p>Ein verwandter Gedanke. Die chassidische Lehre deutet<sup data-src="tanya-ih-7"></sup> die Frage der Weisen „Dein Vater — worin war er besonders sorgsam?“<sup data-src="shabbat-118b"></sup> so: Jede Seele hat besondere Gebote, die mit ihrer Aufgabe in dieser Welt enger verbunden sind als andere. Das Wort <span class="he">זהיר</span> („sorgsam“) ist mit <span class="he">זוהר</span> verwandt — „Glanz“: durch dieses Gebot leuchtet die Seele.</p><p>Und weil der böse Trieb weiß, dass diese Gebote wichtiger sind, stellt er ihnen größere Hindernisse in den Weg.</p>`,
        },
        {
          h: 'Größer als sein Gefährte',
          b: `<p>So lassen sich die Worte der Weisen erklären: „Wer größer ist als sein Gefährte — dessen böser Trieb ist auch größer.“<sup data-src="sukkah-52a"></sup> Je größer ein Mensch ist, desto wichtiger sind die Gebote, die er erfüllt — und desto stärker stellt sich ihm der böse Trieb entgegen.</p><p>Es gibt noch eine andere Erklärung. Damit der Mensch freie Wahl hat, müssen die Kräfte der Heiligkeit und die ihnen entgegenstehenden Kräfte im Gleichgewicht sein. Da ihm größere Kräfte in der Heiligkeit gegeben sind — er ist „größer als sein Gefährte“ —, ist auch seinem bösen Trieb größere Kraft gegeben.</p>`,
        },
        {
          h: 'Warum Adam vom Baum aß',
          b: `<p>Nun ist verständlich, warum Adam vom Baum der Erkenntnis aß. Er war „das Gebilde der Hände des Heiligen, gelobt sei Er, Selbst“, also „größer als seine Gefährten“ — und darum war auch „sein böser Trieb größer als er“.</p><p>Zumal vom Verbot, vom Baum der Erkenntnis zu essen, sehr viel abhing: Das zeigt sich daran, wie tief Adam und alle seine Nachkommen durch die Sünde fielen. Darum trat der böse Trieb, gekleidet in die Schlange, mit aller Kraft gegen Adam an und brachte ihn dazu, vom Baum der Erkenntnis zu essen.</p>`,
        },
      ],
      reflection: 'Welches „leichte“ Gebot fällt mir am schwersten? Vielleicht ist gerade das mein Gebot?',
      takeaways: [
        'Der böse Trieb will nur eines: dass der Mensch gegen G-ttes Willen handelt.',
        'Am stärksten widersetzt er sich dort, wo ein Gebot am wichtigsten ist — für diesen Menschen, an diesem Ort, zu dieser Zeit.',
        'Darum fällt das „Leichte“ manchmal am schwersten. Jede Seele hat ihre Gebote: זהיר („sorgsam“) ist mit זוהר, „Glanz“, verwandt.',
        '„Wer größer ist als sein Gefährte, dessen böser Trieb ist auch größer“: Adam, das Werk der Hände G-ttes, traf auf den stärksten bösen Trieb.',
      ],
      puzzle: {
        q: 'Setze die Antwort des Rebben zusammen: von der Regel — zu Adam.',
        pieces: ['Ziel: gegen G-ttes Willen', 'Je wichtiger, desto schwerer', 'Größerer Mensch, größerer Trieb', 'Adam — Werk G-ttes Hände', 'Die stärkste Prüfung'],
        meaning: 'Der böse Trieb kämpft dort, wo es am wichtigsten ist. Adam war größer als alle — darum war seine Prüfung die stärkste; deshalb hielt er nicht einmal drei Stunden durch.',
      },
    },
    {
      title: 'Zu wem G-tt sprach',
      cond: `<p>Doch der Rebbe hat noch ein Indiz. Vergleiche das Gebot, das G-tt Adam gab, mit Chawas Worten an die Schlange.</p><p>Das Gebot:</p><p class="verse" dir="rtl" lang="he">ומעץ הדעת טוב ורע לא תאכל ממנו</p><p>„Aber vom Baum der Erkenntnis von Gut und Böse sollst du nicht essen.“<sup data-src="gen-2-17"></sup></p><p>Chawa an die Schlange:</p><p class="verse" dir="rtl" lang="he">ומפרי העץ אשר בתוך הגן אמר אלקים לא תאכלו ממנו ולא תגעו בו פן תמתון</p><p>„Aber von der Frucht des Baumes in der Mitte des Gartens hat G-tt gesagt: Ihr sollt nicht davon essen und ihn nicht berühren, damit ihr nicht sterbt.“<sup data-src="gen-3-3"></sup></p>`,
      steps: [
        {
          q: 'Welche Worte Chawas standen nicht in G-ttes Gebot?',
          hint: 'G-tt verbot nur das Essen.',
          opts: ['„und ihn nicht berühren“', '„du sollst nicht davon essen“', '„vom Baum der Erkenntnis“', '„von Gut und Böse“'],
        },
        {
          q: 'Vor der Gabe der Tora sprach G-tt zu Mosche: „So sollst du zum Haus Jaakow sprechen und den Kindern Israels verkünden.“ Wer ist „das Haus Jaakow“, an das Mosche sich zuerst wandte?',
          hint: '„Die Kinder Israels“ sind in diesem Vers die Männer.',
          opts: ['„die Frauen“', '„die Männer“', '„die Ältesten“', '„die Kohanim“'],
        },
        {
          q: 'Der Hochzeitssegen: „Erfreue die liebenden Gefährten, wie Du Dein Geschöpf im Garten Eden erfreut hast …“. Welches Wort des Segens erklärt der Rebbe als „vor der Sünde“?',
          hint: 'Der Rebbe fragt: Wozu steht dieses Wort hier, wo doch jeder weiß, dass der Garten Eden sehr lange her ist?',
          opts: ['„von einst, vorher“', '„heute“', '„für immer“', '„jetzt“'],
        },
      ],
      reveal: {
        h: 'Hätte Chawa es selbst gehört',
        p: 'Das Verbot hörte Adam, nicht Chawa. Darum fügte sie von sich aus „und ihn nicht berühren“ hinzu — und die Schlange stieß sie an den Baum und sprach: „Siehst du, von der Berührung bist du nicht gestorben — vom Essen wirst du es auch nicht.“ Hätte Chawa das Gebot von G-tt Selbst gehört, hätte die Schlange sie nicht getäuscht, und sie hätte Adam zurückgehalten. Darum wandte sich Mosche am Sinai zuerst an die Frauen.',
      },
      lessons: [
        {
          h: 'Zu wem G-tt sprach',
          b: `<p>Als G-tt dem jüdischen Volk die Tora gab, sprach Er zu Mosche: „So sollst du zum Haus Jaakow sprechen.“<sup data-src="ex-19-3"></sup> Unsere Weisen erklären: „das Haus Jaakow“ sind die Frauen; Mosche sollte ihnen zuerst vom Empfang der Tora erzählen. Warum? Der Midrasch antwortet: G-tt wollte verhindern, dass sich wiederholt, was mit dem Baum der Erkenntnis geschah — damals hörte Adam das Gebot von G-tt, nicht Chawa.<sup data-src="shemot-rabbah-28-2"></sup></p>`,
        },
        {
          h: 'Chawas Zusatz',
          b: `<p>Das machte die Sünde möglich. Auch Chawa war G-ttes Werk — es heißt: „Und G-tt der Ewige baute die Rippe…“<sup data-src="gen-2-21"></sup>. Doch das Gebot hatte sie nicht von G-tt Selbst gehört — und sie irrte, indem sie das Verbot erweiterte: Sie sagte, man dürfe den Baum nicht nur nicht essen, sondern nicht einmal berühren. Dieser Zusatz führte zur Sünde: Die Schlange stieß sie, sie berührte den Baum, und die Schlange sprach: „Siehst du, von der Berührung bist du nicht gestorben — vom Essen wirst du es auch nicht.“<sup data-src="bereshit-rabbah-19-3"></sup></p><p>Hätte Chawa das Verbot des Baumes der Erkenntnis von G-tt Selbst gehört, hätte die Schlange sie nicht getäuscht, und sie hätte Adam von der Sünde abgehalten — trotz aller Prüfungen des bösen Triebes. Das zeigen die Worte unserer Weisen über die Gabe der Tora.</p>`,
        },
        {
          h: 'Das Zuhause — ein kleines Heiligtum',
          b: `<p>Schon das Wort „Tora“ ist mit „Hora’a“ verwandt — „Weisung“. Die Erzählungen des Abschnitts Bereschit geben Weisung für das ganze Jahr. So gibt auch dieser Gedanke eine Weisung, wie ein jüdisches Zuhause sein soll.</p><p>Jedes jüdische Zuhause ist „ein kleines Heiligtum“<sup data-src="ez-11-16"></sup>, von dem G-tt sagt: „…und Ich werde in ihrer Mitte wohnen.“<sup data-src="ex-25-8"></sup> Die Führung des Hauses hängt von der Hausfrau ab, die unsere Überlieferung „die Grundlage des Hauses“ nennt: <span class="he">עקרת הבית</span><sup data-src="ps-113-9"></sup> — „akeret habajit“, was die Weisen als „ikaro schel bajit“ lesen, „das Wichtigste des Hauses“. Darum soll man sie ermutigen, ihre Gebote mit mehr Schwung und Freude zu erfüllen. Und das soll man tun im Bewusstsein, dass „die Wege der Tora liebliche Wege und alle ihre Pfade Frieden sind“<sup data-src="prov-3-17"></sup>, und nicht durch herrische Anweisungen.</p><p>So wird das ganze Haus geschützt, auch der Ehemann: Hätte Chawa das Gebot von G-tt Selbst gehört, hätte sie nicht nur selbst nicht gesündigt, sondern auch Adam vor den Einflüsterungen der Schlange bewahrt.</p>`,
        },
        {
          h: 'Eine halbe Stunde am Tag',
          b: `<p>Also beginnt die Grundlage aller Tätigkeit eines Menschen in der Tora in seinem eigenen Haus. Der Rebbe Raschab sagte einmal (Hajom Jom, 22. Tewet): So wie das tägliche Anlegen der Tefillin ein Gebot der Tora für jeden Juden ist, ob großer Gelehrter oder einfacher Mensch, so ist jeder Jude verpflichtet, jeden Tag eine halbe Stunde über die Erziehung seiner Kinder nachzudenken. Er muss alles tun, was in seiner Macht steht — und sogar darüber hinaus —, damit seine Kinder den Weg gehen, auf dem er sie führt.</p>`,
        },
        {
          h: '„Wie einst“',
          b: `<p>Bemühungen, Frauen enger mit der Tora zu verbinden, kommen auch den Männern zugute. Die Frau wird ihrem Mann in Gedanken, Worten und Taten nicht widersprechen, sondern ihm helfen und ihn in allem ergänzen und Bina — Verständnis — ins Haus bringen. Unsere Weisen sagen: „Der Heilige, gelobt sei Er, gab der Frau mehr Bina als dem Mann.“<sup data-src="niddah-45b"></sup></p><p>Eine Frau, die mit der Tora verbunden ist, wirkt auf das ganze Haus und macht es zu einem Ort, an dem die Schechina weilen kann. Das spiegelt sich im Hochzeitssegen: „Erfreue die liebenden Gefährten, wie Du Dein Geschöpf im Garten Eden einst (<span class="he">מקדם</span>) erfreut hast.“<sup data-src="ketubot-8a"></sup> Wozu „einst“? Jeder weiß, dass die Geschichte von Adam und Chawa sehr lange her ist. Doch der Segen meint die Zeit „davor“ — vor der Sünde.</p><p>Wir wünschen, dass jede neue Ehe wie der Bund von Adam und Chawa vor der Sünde sei, als jeder dem anderen half. Dann wird das Haus der g-ttlichen Gegenwart würdig, und es wird Freude darin sein — „wie Du Dein Geschöpf im Garten Eden einst erfreut hast“.</p>`,
        },
      ],
      reflection: 'Wie kann ich heute in meinem Zuhause mehr Freude und Licht bringen — mit einem guten Wort statt einer Anweisung?',
      takeaways: [
        'Das Verbot hörte Adam, nicht Chawa; sie fügte „und ihn nicht berühren“ hinzu — und die Schlange nutzte das aus.',
        'Darum wandte sich Mosche am Sinai zuerst an die Frauen — „das Haus Jaakow“.',
        'Jedes Zuhause ist ein kleines Heiligtum, seine Grundlage ist die Hausfrau. Man soll sie mit lieblichen Wegen ermutigen, nicht mit Befehlen.',
        'Der Rebbe Raschab: eine halbe Stunde am Tag über die Erziehung der Kinder nachzudenken ist jedermanns Pflicht, wie Tefillin.',
        '„Wie einst“ — wie Adam und Chawa vor der Sünde, als jeder dem anderen half.',
      ],
      puzzle: {
        q: 'Setze den Gedankengang zusammen: vom Garten Eden — zum Zuhause.',
        pieces: ['Chawa hörte es nicht selbst', 'Sie fügte „nicht berühren“ hinzu', 'Die Schlange stieß — und täuschte', 'Am Sinai — zuerst die Frauen', 'Das Haus — ein kleines Heiligtum'],
        meaning: 'Chawas Fehler begann damit, dass sie das Gebot nicht selbst hörte. Darum wurde die Tora zuerst den Frauen gegeben — und von der Hausfrau hängt ab, ob das Haus ein kleines Heiligtum wird.',
      },
    },
  ],
  final: {
    title: 'Der Fall ist gelöst',
    allSolved:
      'Alle drei Rätsel sind gelöst. Die drei Stunden, die Adam nicht durchhielt, sind erklärt: Je größer der Mensch, desto größer die Prüfung. Und die Besserung beginnt zu Hause.',
  },
  puzzle: {
    q: 'Setze den Weg der ganzen Rede zusammen.',
    pieces: ['Drei Stunden — und er versagte', 'Je größer, desto größer die Prüfung', 'Chawa hörte es nicht selbst', 'Am Sinai — zuerst die Frauen', 'Das Haus — ein kleines Heiligtum'],
    meaning: 'Adam versagte, weil er groß war, und Chawa hörte das Gebot nicht selbst. Die Besserung liegt im Zuhause, wo jeder die Tora hört und dem anderen hilft.',
  },
  cards: {
    intro: 'Zwölf Verse des Abschnitts Bereschit — und zu jedem eine Erklärung des Rebben aus den Likkutej Sichot. Finde, welche Erklärung zu welchem Vers gehört.',
    items: [
      {
        title: 'Warum mit ב',
        verse: '„Im Anfang“',
        card: 'Zuerst den Geber der Tora anerkennen (א), dann sie lernen (ב)',
        explain: 'Die Tora beginnt mit dem Buchstaben ב, nicht mit א. Der Rebbe erklärt: Die Tora mit Verstand und Begreifen zu lernen ist die zweite Stufe, ב. Davor kommt die erste Stufe, א: Den, der die Tora gab, anzuerkennen und Ihm zu danken.',
        horaah: 'Vor dem Lernen einen Moment innehalten und sich erinnern, Wer die Tora gab — und dann mit Verstand und Begreifen lernen.',
      },
      {
        title: 'Das verborgene Licht',
        verse: '„Es werde Licht“',
        card: 'Das Licht wurde zuerst erschaffen und in der Tora verborgen',
        explain: 'Das Licht — das Hauptziel der Schöpfung — wurde zuerst erschaffen, obwohl es noch nicht gebraucht wurde, und dann verborgen; und G-tt nannte es gut. Dieses Licht ist in der Tora verborgen, damit wir die Kraft haben, es wieder zu enthüllen.',
        horaah: 'Das Ziel des Dienstes ist nicht nur, die Dunkelheit zu vertreiben, sondern den eigenen Teil der Welt zu läutern, bis er selbst Licht wird: „Dunkelheit in Licht verwandeln“.',
      },
      {
        title: 'Sterne und Schicksal',
        verse: '„Es seien Lichter“',
        card: 'Die Himmelslichter beeinflussen das Leben, doch ein Jude ist frei',
        explain: 'Masal — der Einfluss der Himmelskörper — kann das Leben eines Menschen beeinflussen. Doch ein Jude ist nicht durch ihn begrenzt.',
        horaah: 'Wer im Dienst G-ttes zulegt, muss keinerlei „Einflüsse“ fürchten.',
      },
      {
        title: 'Sonne und Mond',
        verse: '„die zwei großen Lichter“',
        card: 'Zuerst gleich erschaffen — erst danach wurde der Mond kleiner',
        explain: 'Die beiden Himmelslichter wurden zuerst gleich erschaffen, und erst danach wurde das Licht des Mondes vermindert. Für das jüdische Volk, das die Tora empfängt, hängt die Mündliche Tora (der Mond) von der Schriftlichen (der Sonne) ab und ist kleiner als sie. Doch von G-ttes Seite — nach Seinem Plan — sind beide gleich.',
        horaah: 'Die Mündliche Tora ist so kostbar wie die Schriftliche: von der Seite des Gebers der Tora sind sie gleich.',
      },
      {
        title: 'Ein Paar für den großen Fisch',
        verse: '„die großen Seeungeheuer“',
        card: 'Der große Fisch hatte ein Paar: auch ein Zaddik braucht Gefährten',
        explain: 'Raschi betont, dass die großen Seeungeheuer ein Paar waren; G-tt nannte es gut und bewahrte eines davon als Lohn für die Gerechten auf. Daraus folgt: Auch ein Zaddik braucht einen „Gefährten“ — einen Freund im Dienst G-ttes.',
        horaah: 'Suche dir einen Gefährten im Dienst G-ttes: Jeder braucht einen, sogar ein Zaddik.',
      },
      {
        title: 'Der Segen des fünften Tages',
        verse: '„Und Er segnete sie“',
        card: 'Fische leben im Wasser — in G-ttes grenzenloser Güte',
        explain: 'Am fünften Tag segnete G-tt die Fische. Juden haben von Geburt an einen Zug der Güte (Chessed), doch er ist begrenzt. Wer am fünften Wochentag geboren ist, ist mit grenzenloser Güte gesegnet — wie die Fische, die im Wasser von G-ttes Güte genährt werden.',
        horaah: 'G-ttes grenzenlose Güte empfängt man durch völlige Selbsthingabe (Bittul) — so wie das Wasser die Fische ganz bedeckt.',
      },
      {
        title: 'Ohne Fleisch',
        verse: '„euch soll es zur Nahrung sein“',
        card: 'Krone der Schöpfung, doch ohne Fleisch — gegen Hochmut',
        explain: 'Die vorigen Verse erheben den Menschen über die Tiere als Krone der Schöpfung. Dass er keine Tiere essen durfte, sorgt dafür, dass seine Größe nicht zu Hochmut führt.',
        horaah: 'Je höher ein Mensch steht, desto mehr muss er sich vor Hochmut hüten.',
      },
      {
        title: 'Der genaue Augenblick',
        verse: '„Und G-tt vollendete am siebten Tag“',
        card: 'G-tt kennt den genauen Augenblick, in dem der Schabbat beginnt',
        explain: 'Raschis zweite Erklärung: Als G-tt die Schöpfung vollendete, verletzte Er den Schabbat nicht, denn Er kennt den genauen Augenblick, in dem er beginnt.',
        horaah: 'Jeder Augenblick ist besonders: Ein fehlender Augenblick kann den ganzen Dienst beeinträchtigen.',
      },
      {
        title: 'Eine neue Besserung',
        verse: '„das G-tt erschaffen hatte, um es zu machen“',
        card: 'Der Schabbat hob die Welt höher — sie brauchte neues Tikkun',
        explain: 'In den sechs Schöpfungstagen war die Welt vollendet. Als der Schabbat kam — eine höhere Stufe —, brauchte die Welt ein neues, höheres Tikkun (Besserung).',
        horaah: 'In unserer Generation braucht die Welt das Lernen des inneren Teils der Tora — der Chassidut.',
      },
      {
        title: 'Namen für die Tiere',
        verse: '„das ist sein Name“',
        card: 'Mit den Namen verband Adam die Schöpfung mit ihrer Quelle',
        explain: 'Adams Dienst — er gab den Tieren Namen — verband die Schöpfung mit ihrer Quelle. Die Gabe der Tora gab die Kraft, die Schöpfung mit der G-ttlichkeit selbst zu verbinden; das ist der Dienst des jüdischen Volkes.',
        horaah: 'In den Segenssprüchen vor dem Schma demütigen wir die tierische Seele, im Schma selbst verbinden wir uns mit der G-ttlichkeit.',
      },
      {
        title: 'Das Beste von dem, was man hat',
        verse: '„von der Frucht des Bodens“',
        card: 'Hewel gab das Beste seiner Art — obwohl es bessere Arten gab',
        explain: 'Kajin brachte ein Opfer „von der Frucht des Bodens“, Hewel aber das Beste seiner Art, obwohl es bessere Arten gab. Alles gehört G-tt, darum kommt es nicht auf die Art an, sondern darauf, das Beste von dem zu bringen, was man hat.',
        horaah: 'Bei der Verschönerung eines Gebots das Beste tun, was man kann — im Rahmen der eigenen Möglichkeiten.',
      },
      {
        title: 'Ein fester Beschluss',
        verse: '„denn es reut Mich, dass Ich sie gemacht habe“',
        card: 'Nicht einmal in Gedanken fasste G-tt einen festen Beschluss',
        explain: 'G-tt dachte daran, die Menschheit zu vernichten, sprach den Beschluss aber erst aus, nachdem Er Seinen Zorn besänftigt hatte. Er überlegte, was mit dem Menschen zu tun sei, kam aber nicht einmal in Gedanken zu einem festen Beschluss.',
        horaah: 'Über andere nur Gutes sagen. Und wer sieht, dass jemand Schlechtes tut, soll über ihn kein festes Urteil fällen — nicht einmal in Gedanken.',
      },
    ],
  },
  audience: 'Ab 11: Das Rechnen ist ganz einfach, doch es geht um den bösen Trieb, Familie und Zuhause; Jüngere — zusammen mit einem Erwachsenen.',
  practice:
    'Wähle ein „leichtes“ Gebot, das dir aus irgendeinem Grund am schwersten fällt, und erfülle es heute mit besonderer Sorgfalt: Vielleicht ist es wirklich deins. Und für Erwachsene — nach dem Wort des Rebben Raschab — heute eine halbe Stunde finden, um über die Erziehung der eigenen Kinder nachzudenken.',
  highlight: '„Wer größer ist als sein Gefährte, dessen böser Trieb ist auch größer“ (Sukka 52a).',
  share: ({ score, max, time, grid, allSolved, site }) => `⏳ Adam hielt ein Verbot für nur drei Stunden nicht durch. Warum?

Ich ermittle mit dem Lubawitscher Rebben — „Niflaot des Rebben“, Abschnitt Bereschit. ${allSolved ? 'Alle drei Rätsel gelöst:' : 'Mein Weg bisher:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Drei Rätsel: die drei Stunden des sechsten Tages, „größer als sein Gefährte“ und warum Mosche am Sinai zuerst zu den Frauen sprach. Danach — die Karten: 12 Verse des Abschnitts und die Erklärungen des Rebben.
Spiel 👉 ${site}

©mychitas.app`,
  source:
    'Nach einer Rede des Lubawitscher Rebben (Simchat Tora 5723; Likkutej Sichot, Bd. 3, Bereschit), englische Übersetzung von E. Touger (Sichos in English); nacherzählt vom Projekt. Karten — nach der Wochentabelle der Reden des Rebben „Nischmat Ephraim“ (parshapages.com).',
};

export default de;
