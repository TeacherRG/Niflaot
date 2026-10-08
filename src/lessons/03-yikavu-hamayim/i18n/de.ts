import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Jikawu ha-Majim',
  hero: {
    heading: 'Das Geheimnis des neunten Verses: <i>vier Rätsel über den „einen Ort“</i>',
    author: 'nach einer Reschima von Rabbiner Jizchak Ginsburgh',
    intro:
      'In jedem Wochenabschnitt verbirgt der neunte Vers eine tiefe Absicht. Finde sie gleich im ersten Abschnitt der Tora: Einheit im Ort, drei Bedeutungen des Wortes „Kaw“, die Zahl 59 und alle „Neunen“ von Bereschit.',
  },
  summary:
    'Der neunte Vers der Tora: „Es sollen sich die Wasser an einem Ort sammeln“. Mikwe, Linie und Hoffnung, die Zahl 59 und der neunte Buchstabe, das neunte Wort und der neunte Abschnitt von Bereschit.',
  glossary: {
    'יקוו': 'es sollen sich sammeln',
    'מקום': 'Ort',
    'אחד': 'eins',
    'קוה': 'Wurzel: sammeln, hoffen',
    'מקוה': 'Mikwe, Sammlung der Wasser',
    'קו': 'Linie',
    'תקוה': 'Hoffnung',
    'זנב': 'Schwanz',
    'יחיאל': 'Jechiel',
    'אם חי': 'Mutter des Lebendigen',
    'היתה': 'war',
    'תהו': 'Chaos, Tohu',
    'יעקב': 'Jaakow',
    'רחל': 'Rachel',
    'והוא': 'und er',
    'ימשל': 'wird herrschen',
    'בך': 'über dich',
  },
  riddles: [
    {
      title: 'Das Eine im Ort',
      cond: `<p>Der Rebbe von Izbica, Verfasser des „Mei HaSchiloach“, lehrt: In jedem Wochenabschnitt verbirgt der <b>neunte Vers</b> eine tiefere Absicht, als der einfache Sinn zeigt. Neun ist die Sefira Jessod, die Eigenschaft des Zaddiks Josef, und der Buchstabe <em>ט</em> ist „das Gute, das im Inneren verborgen ist“.</p><p>Im ersten Abschnitt der Tora lautet der neunte Vers so:</p><p class="verse" dir="rtl" lang="he">ויאמר אלקים יקוו המים מתחת השמים אל מקום אחד ותראה היבשה ויהי כן</p><p>„Und G-tt sprach: Es sollen sich die Wasser unter dem Himmel an einem Ort sammeln, und das Trockene werde sichtbar. Und es ward so.“</p>`,
      steps: [
        {
          q: 'Wie viele Wörter hat der neunte Vers?',
          hint: 'ויאמר · אלקים · יקוו · המים · מתחת · השמים · אל · מקום · אחד · ותראה · היבשה · ויהי · כן',
        },
        { q: 'Welches Wort hat eine Gematria, die gleich der Zahl der Wörter ist?', opts: ['eins', 'gut', 'Leben', 'Licht'] },
        {
          q: 'Und wie viele Buchstaben hat der Vers?',
          hint: 'ויאמר — 5 Buchstaben, אלקים — 5, יקוו — 4… Zähle die Buchstaben aller 13 Wörter zusammen.',
        },
      ],
      reveal: {
        h: '„Eins“ kommt zum zweiten Mal in die Welt',
        p: 'Der neunte Vers hat 13 Wörter — so viel wie die Gematria des Wortes „eins“ (אחד) — und 52 Buchstaben, viermal „eins“. Hier erklingt das Wort „eins“ zum zweiten Mal in der Tora: zuerst „ein Tag“ — Einheit in der Zeit, jetzt „ein Ort“ — Einheit im Raum.',
      },
      lessons: [
        {
          h: 'Die Regel des „Mei HaSchiloach“',
          b: `<p>Bekannt ist die Regel des Verfassers des „Mei HaSchiloach“: In jedem Wochenabschnitt liegt im neunten Vers von seinem Beginn an eine tiefere Absicht, als jedes Auge nach dem einfachen Sinn sieht.<sup data-src="mei-hashiloach-balak"></sup> Warum gerade der neunte? Die neunte Sefira ist Jessod, „Grundlage“, die Eigenschaft des Zaddiks Josef. In ihr ist etwas verborgen. Der Sohar sagt über den Buchstaben <span class="he">ט</span> (Tet, der neunte Buchstabe des Alphabets): „Dein Gutes ist in dir verborgen“<sup data-src="zohar-tet"></sup> — seine Form ist nach innen gebogen, als hüte er einen Schatz.</p><p>Der Rebbe von Izbica selbst bringt diese Regel im Abschnitt Balak, beim neunten Vers jenes Abschnitts. Doch der Raw zeigt, dass man sie vor allem auf den allerersten Abschnitt der Tora anwenden sollte: Denn „alles folgt dem Anfang“ und „der Körper folgt dem Kopf“.</p>`,
        },
        {
          h: 'Der neunte Vers — der erste Vers des dritten Tages',
          b: `<p>Der Bericht über den ersten Schöpfungstag umfasst fünf Verse (sie enden mit den Worten „und es ward Abend, und es ward Morgen — ein Tag“). Der zweite Tag hat drei Verse. Also ist der neunte Vers der Tora der erste Vers des dritten Tages.<sup data-src="gen-1-1"></sup> Er vollendet die Arbeit mit den Wassern, die am zweiten Tag begonnen wurde: „Es sollen sich die Wasser unter dem Himmel an einem Ort sammeln, und das Trockene werde sichtbar.“</p><p>Die Wurzel des neunten Verses — das Neue, das in ihm verborgen ist, „das Gute, das im Inneren verborgen ist“ — ist das Wort <span class="he">יקוו</span>, „es sollen sich sammeln“. Darauf kommen wir im zweiten Rätsel zurück.</p>`,
        },
        {
          h: 'Eins in der Zeit, eins im Ort',
          b: `<p>Hier erscheint das Wort „eins“ (<span class="he">אחד</span>) zum zweiten Mal in der Tora. Das erste Mal heißt es: „und es ward Abend, und es ward Morgen — ein Tag“: das Offenbarwerden des Einen in der Zeit. Jetzt — „an einem Ort“: das Offenbarwerden des Einen im Raum.</p><p>Zeit und Ort verhalten sich zueinander wie das männliche und das weibliche Prinzip. In der Sprache des „Sefer Jezira“ heißt die Zeit „Schana“ (Jahr) und der Ort „Olam“ (Welt). Die dritte Dimension ist „Nefesch“, die Seele. Die Einheit in der Seele zeigt sich später, im zweiten Kapitel, nach der Erschaffung von Adam und Chawa: „und sie werden zu einem Fleisch“<sup data-src="gen-2-24"></sup>. So schließen sich alle drei: Welt, Jahr, Seele.</p>`,
        },
        {
          h: 'Die Mikwe — der Ort, an dem Trockenes und Gras erscheinen',
          b: `<p>Die Einheit im Ort zeigt sich in der „Mikwe der Wasser“, der Sammlung des Wassers. Im Hebräischen klingen „Makom“ (Ort) und „Mikwe“ fast gleich, und das ist kein Zufall. Die Wasser sammeln sich an einem Ort, damit „das Trockene sichtbar werde“, damit die Erde bereit sei für den nächsten Schöpfungsspruch — die Hauptarbeit des dritten Tages: „Die Erde lasse Gras sprossen“.</p><p>Wie die Tanja erklärt, ist dieser Spruch ewig<sup data-src="tanya-ih-20"></sup>: Auch heute wächst jeder Grashalm durch die Kraft jener Worte. Der „eine Ort“, den die Wasser frei machen, ist also ein Raum, in dem Leben beständig wachsen kann.</p>`,
        },
        {
          h: 'Dreizehn Wörter, zweiundfünfzig Buchstaben',
          b: `<p>Der neunte Vers hat 13 Wörter — die Gematria des Wortes „eins“ (<span class="he">אחד</span> = 1 + 8 + 4). Ebenso viele Wörter hat der Vers, der mit „einem Tag“ endet, und der Vers „und sie werden zu einem Fleisch“. Der Vers hat 52 Buchstaben — genau viermal „eins“, das vollkommene Verhältnis 1 : 4.</p><p>So ist schon im Bau des Verses enthalten, wovon er spricht — die Einheit.</p>`,
        },
      ],
      reflection: 'Wo zeigt sich in meinem Leben das Eine in der Zeit — in Gewohnheiten und Tagen —, und wo im Ort — im Haus, im Raum um mich? Welchen einen Ort kann ich zu einem „einen Ort“ machen?',
      takeaways: [
        'Die Regel des „Mei HaSchiloach“: Der neunte Vers jedes Abschnitts verbirgt eine tiefe Absicht. Neun ist Jessod, die Eigenschaft Josefs, „das Gute, das im Inneren verborgen ist“.',
        'Der neunte Vers der Tora — „es sollen sich die Wasser an einem Ort sammeln“: der erste Vers des dritten Tages (5 Verse des ersten Tages + 3 des zweiten).',
        'Das zweite „eins“ der Tora: „ein Tag“ — Einheit in der Zeit, „ein Ort“ — im Raum, „ein Fleisch“ — in der Seele.',
        '13 Wörter = אחד, 52 Buchstaben = 4 × 13.',
      ],
      puzzle: {
        q: 'Setze den Gedankengang zusammen: von der Regel — zur Zahl — zum Sinn.',
        pieces: ['Regel: Der neunte Vers verbirgt eine Absicht', 'Der neunte Vers der Tora — „an einem Ort“', '13 Wörter = אחד', 'Einheit im Raum'],
        meaning: 'Der neunte Vers der Tora lautet „Es sollen sich die Wasser an einem Ort sammeln“: 13 Wörter, wie אחד. Nach dem „einen Tag“ in der Zeit zeigt sich die Einheit im Ort.',
      },
    },
    {
      title: 'Mikwe, Linie und Hoffnung',
      cond: `<p>Das Wort <em>יקוו</em> — „es sollen sich sammeln“ — kommt von der Wurzel <em>קוה</em>. Diese Wurzel hat drei Bedeutungen: <b>Mikwe</b> (<em>מקוה</em>) — Sammlung der Wasser, <b>Linie</b> (<em>קו</em>) und <b>Hoffnung</b> (<em>תקוה</em>).</p><p>Der Raw sieht in ihnen die ganze Ordnung des Herabsteigens der Welten: das Zusammenziehen des Lichtes, den Strahl aus dem Unendlichen und das Licht, das nach oben zurückkehrt. Rechne nach.</p>`,
      steps: [
        { q: 'Wie viel ist die Wurzel <span class="he">קוה</span>?', hint: '100 + 6 + 5.' },
        {
          q: 'Welches Wort hat dieselbe Zahl wie der voll ausgeschriebene Buchstabe Alef (<span class="he">אלף</span>)?',
          opts: ['Wunder', 'Licht', 'Wasser', 'Geist'],
        },
        {
          q: 'Finde den Durchschnitt der drei Wörter <span class="he">מקוה</span>, <span class="he">קו</span> und <span class="he">תקוה</span>.',
          hint: 'מקוה = 151, קו = 106, תקוה = 511. Zähle zusammen und teile durch 3.',
        },
        {
          q: 'Wessen Name ist gleich dieser Zahl?',
          opts: ['Aharon', 'Mosche', 'Jaakow', 'David'],
        },
      ],
      reveal: {
        h: 'Hoffnung, die zum Dienst wurde',
        p: 'Die Wurzel „Kaw“ ist 111 — wie „Alef“ und wie „Pele“, Wunder. Der Durchschnitt ihrer drei Bedeutungen ist 256: sechzehn zum Quadrat, zwei hoch acht. Das ist die Gematria des Namens Aharon, des Hohepriesters: Dienst im Tempel und große Liebe zu Israel.',
      },
      lessons: [
        {
          h: 'Drei Bedeutungen einer Wurzel',
          b: `<p>Die Wurzel <span class="he">קוה</span> hat drei Bedeutungen. Die erste ist das Sammeln, wie der Targum übersetzt: „Itkanschun“, „es sollen sich sammeln“. Daher „Mikwe“ — Sammlung der Wasser. Die zweite ist Hoffnung, „Tikwa“. Die dritte ist Linie, „Kaw“.</p><p>Die Gematria der Wurzel ist 111. Das ist „Alef“ in voller Schreibweise (<span class="he">אלף</span>) und das Wort „Pele“ — Wunder, mit denselben Buchstaben in anderer Reihenfolge. Die Broschüre, aus der die Lektion stammt, heißt „Niflaot“ — „Wunder“.</p>`,
        },
        {
          h: 'Zusammenziehung: „Ich bin der Ort der Welt“',
          b: `<p>Die Sammlung aller unteren Wasser an einem Ort ist das Geheimnis des Zimzum, der ersten „Zusammenziehung“ des g-ttlichen Lichtes. Das Licht zieht sich zu den Seiten zurück, und gerade dort, im frei gewordenen Raum, entsteht der „Ort der Welt“.</p><p>Die Weisen sagen über den Allmächtigen: „Er ist der Ort der Welt, doch die Welt ist nicht Sein Ort.“<sup data-src="bereshit-rabbah-68-9"></sup> Und zu Mosche wird gesagt: „Siehe, ein Ort ist bei Mir.“<sup data-src="ex-33-21"></sup> Der große Kreis des Lichtes des Unendlichen umgibt den leeren Ort, den die Zusammenziehung frei gemacht hat. „Und das Trockene werde sichtbar“ — das ist das „Reschimu“, die Spur des Lichtes, die nach der Zusammenziehung im leeren Raum zurückblieb.</p>`,
        },
        {
          h: 'Die Linie, die Welten baut',
          b: `<p>Danach wird in den leeren Raum ein „Kaw“ gezogen — eine Linie, ein Strahl des Lichtes aus dem Unendlichen. Auch ihn verbirgt das Wort „Jikawu“. Die Linie geht von der verborgenen Tiefe des Unendlichen zum Ort des Reschimu und lässt aus ihm alle Welten wachsen: Adam Kadmon, Azilut, Brija, Jezira, Assija.</p><p>Radak schreibt im „Buch der Wurzeln“, dass „Kaw“ auch Bau bedeutet: „über die ganze Erde ging ihre Linie aus“<sup data-src="ps-19-5"></sup> — das heißt ihr Bau. Durch die Linie werden alle Welten gebaut.</p>`,
        },
        {
          h: 'Hoffnung: Das Licht kehrt zurück',
          b: `<p>Am Ende, wenn die Linie bis ganz nach unten reicht, steigt das Licht wieder auf — das ist „Or Chosser“, das zurückkehrende Licht. Das ist das Geheimnis der guten Hoffnung von allem, was der Allmächtige in Seiner Welt zu Seiner Ehre erschaffen hat: das Streben, sich in Ihm aufzulösen, „vom Sein zum Nichts“ überzugehen, im Bewusstsein, dass nichts sich selbst erschafft.</p><p>Hoffnung — jeden Tag, jeden Augenblick — darauf, dass Seine Herrlichkeit offenbar wird: „und die Erde leuchtete von Seiner Herrlichkeit“.<sup data-src="ez-43-2"></sup> Diese Herrlichkeit ist die Quelle des Entstehens, des Lebens und des Bestehens der ganzen Schöpfung.</p>`,
        },
        {
          h: 'Aharon: 256',
          b: `<p>Mikwe (<span class="he">מקוה</span>) = 151, Linie (<span class="he">קו</span>) = 106, Hoffnung (<span class="he">תקוה</span>) = 511. Zusammen 768, der Durchschnitt ist 256. Das ist sechzehn zum Quadrat, vier hoch vier und zwei hoch acht. Eine zusätzliche Schönheit: „Mikwe“ und „Linie“ ergeben zusammen 257, also 256 mit der Einheit des Ganzen, und „Hoffnung“ ist 511, mit der Einheit des Ganzen 512, zweimal 256.</p><p>256 ist die Gematria des Namens Aharon (<span class="he">אהרן</span>), des Hohepriesters. Sein Weg ist der Dienst für den Allmächtigen im Tempel und die Liebe zu Israel: der Priestersegen, die Heilung jeder Krankheit von Leib und Seele, „große Liebe“ bis zur Selbstaufopferung.</p>`,
        },
        {
          h: 'Drei Linien: Awraham, Jizchak, Jaakow',
          b: `<p>Die drei Bedeutungen der Wurzel entsprechen den drei Linien der Welt der Berichtigung. <b>Die Mikwe ist Barmherzigkeit, die Linie Awrahams.</b> Für ihn betet man: „Gedenke des Vaters, der Dir nachging wie Wasser.“ Die Wasser fließen ohne Ende an einen Ort: „den Ort, wo Awraham vor G-tt gestanden hatte“.<sup data-src="gen-19-27"></sup> Der „eine Ort“ ist der Ort, von dem gesagt ist: „einer war Awraham“.<sup data-src="ez-33-24"></sup></p><p><b>Die Linie ist die mittlere Linie, die Linie Jaakows.</b> Sie wird gerade vom Strahl des Unendlichen gezogen und baut alle Welten. Ihre äußere Seite ist die Kraft der Trennung, ihr linker Teil. Ihre innere Seite ist die Kraft der Verbindung, die rechte: wenn sie sich nach rechts neigt, „um das Linke in das Rechte einzuschließen“.</p><p><b>Die Hoffnung ist die linke Linie, die Linie Jizchaks,</b> die von unten nach oben aufsteigt: „Hoffe auf den Ewigen, sei stark, und dein Herz sei fest, und hoffe auf den Ewigen!“<sup data-src="ps-27-14"></sup> Die sechs Wörter zusammen — Mikwe, Awraham, Hoffnung, Jizchak, Linie, Jaakow — ergeben 1406.</p>`,
        },
      ],
      reflection: 'Worauf hoffe ich heute? Wie verwandle ich diese Hoffnung in eine „Linie“ — einen konkreten Schritt, den ich tun werde?',
      takeaways: [
        'Die Wurzel קוה = 111 = אלף = פלא (Wunder): Mikwe — Sammlung der Wasser, Kaw — Linie, Tikwa — Hoffnung.',
        'Die Mikwe ist Zimzum und Reschimu („das Trockene werde sichtbar“); die Linie ist der Strahl aus dem Unendlichen, der Welten baut; die Hoffnung ist das zurückkehrende Licht, das Streben der Schöpfung zur Quelle.',
        '(מקוה 151 + קו 106 + תקוה 511) : 3 = 256 = אהרן — Dienst und Liebe zu Israel.',
        'Drei Linien: Mikwe — Awraham (Barmherzigkeit), Linie — Jaakow (Mitte), Hoffnung — Jizchak (linke Linie, von unten nach oben).',
      ],
      puzzle: {
        q: 'Setze die Ordnung zusammen, die in der Wurzel קוה verborgen ist: die Wurzel, ihre drei Bedeutungen in der Reihenfolge der Erschaffung der Welten und ihr Durchschnitt.',
        pieces: ['קוה = 111 = פלא, Wunder', 'Mikwe: Zusammenziehung, „Ort der Welt“', 'Linie: der Strahl, der Welten baut', 'Hoffnung: Das Licht kehrt zurück', 'Durchschnitt der drei: 256 = אהרן'],
        meaning: 'Die Wunder-Wurzel entfaltet sich dreifach: Die Zusammenziehung macht Raum frei, die Linie baut Welten, die Hoffnung führt das Licht zur Quelle zurück. Ihr Durchschnitt ist Aharon: Dienst und Liebe.',
      },
    },
    {
      title: 'Neunundfünfzig',
      cond: `<p>Die Gematria des ganzen neunten Verses von Bereschit ist <b>3068</b>, und er hat 52 Buchstaben.</p><p>Der Rebbe von Izbica selbst leitete seine Regel aus dem neunten Vers des Abschnitts Balak ab:</p><p class="verse" dir="rtl" lang="he">ויאמר בלעם אל האלקים בלק בן צפר מלך מואב שלח אלי</p><p>„Und Bilam sprach zu G-tt: Balak, der Sohn Zippors, der König von Moab, hat zu mir gesandt.“<sup data-src="num-22-10"></sup> Seine Gematria ist <b>1593</b>. Was haben die beiden Verse gemeinsam?</p>`,
      steps: [
        { q: 'Wie groß ist der durchschnittliche Wert eines Buchstabens des neunten Verses von Bereschit?', hint: '3068 : 52.' },
        { q: 'Wie viel Mal größer ist 1593 als diese Zahl?', hint: '1593 : 59.' },
        {
          q: 'Beide Verse sind ohne Rest durch 59 teilbar: 3068 = 52 × 59 und 1593 = 27 × 59. Welches dieser Wörter ist ebenfalls 59?',
          opts: ['Schwanz', 'Gesicht, Antlitz', 'Hochmut', 'Begierde'],
        },
      ],
      reveal: {
        h: 'Der gemeinsame Nenner — der „Schwanz“',
        p: 'Der durchschnittliche Buchstabe des neunten Verses ist 59, und der Vers Bilams ist genau 27-mal 59. Die beiden „neunten“ Verse haben also die gemeinsame Zahl 59. Und 59 ist der „Schwanz“ (זנב) aus der Lektion „Tikkun Parzuf-Sanaw“: So schließt sich diese Lektion an den Streit um „Gesicht“ und „Schwanz“ an. Die Zahl 59 hat noch zwei „Namensvettern“ — den Namen Jechiel (יחיאל) und die Worte „Mutter des Lebendigen“ (אם חי). In beiden ist das Wort חי verborgen — „Leben“.',
      },
      lessons: [
        {
          h: 'Das Maß der Schöpfung',
          b: `<p>Die Gematria des neunten Verses ist 3068. Das ist 13 („eins“) mal 236. Und 236 ist die Gematria der Worte „und reich an Kraft“ (<span class="he">ורב כח</span>) aus dem Vers „Groß ist unser Herr und reich an Kraft“.<sup data-src="ps-147-5"></sup> Das ist das Geheimnis des „Schiur Koma“ — des „Maßes der Größe des Schöpfers“, von dem ein alter Midrasch spricht.</p><p>Nimmt man aus dem Vers das Wort „eins“ selbst heraus, ergeben die übrigen Wörter 3055 — genau fünfmal „Tora“ (<span class="he">תורה</span> = 611): wie die fünf Bücher, die ganze Tora.</p>`,
        },
        {
          h: 'Der durchschnittliche Buchstabe — 59',
          b: `<p>3068 ist 52-mal 59. Der durchschnittliche Buchstabe des neunten Verses ist also 59. Der neunte Vers des Abschnitts Balak, auf den der Rebbe von Izbica seine Regel stützt, ist 1593 — das ist 27-mal 59. Der gemeinsame Nenner der beiden Verse ist die Zahl 59.</p><p>Der Raw bringt noch zwei Wörter mit derselben Zahl 59 — um zu zeigen, dass diese Zahl „lebendig“ ist.</p><p><b>Jechiel</b> (<span class="he">יחיאל</span> = 10 + 8 + 10 + 1 + 30) ist ein jüdischer Name, wörtlich „G-tt möge leben“ (<span class="he">יחי אל</span>).</p><p><b>„Mutter des Lebendigen“</b> (<span class="he">אם חי</span> = 1 + 40 + 8 + 10) — so nennt die Tora Chawa: „Und der Mensch nannte seine Frau Chawa, denn sie war die Mutter alles Lebendigen“ (Bereschit 3,20)<sup data-src="gen-3-20"></sup>. Und Chawa ist eben die Frau, über deren Erschaffung „Gesicht“ und „Schwanz“ stritten.</p><p>In beiden Wörtern steht <span class="he">חי</span> — „Leben“. Deshalb nennt der Raw 59 eine „lebendige Primzahl“ (Primzahl, weil sie nur durch 1 und sich selbst teilbar ist).</p>`,
        },
        {
          h: '59 ist der „Schwanz“',
          b: `<p>Und vor allem: 59 ist die Gematria des Wortes „Schwanz“ (<span class="he">זנב</span>). Das ist das Geheimnis des Streits aus der Lektion „Tikkun Parzuf-Sanaw“: „Einer sagte — Gesicht, der andere sagte — Schwanz“<sup data-src="berakhot-61a"></sup>, darüber, woraus die Frau erschaffen wurde.</p><p>In der Kabbala weist der „Schwanz“ auf Jessod hin — die neunte Eigenschaft — im Zustand der „Kleinheit“ (Katnut). Das ist auch das Geheimnis der Urschlange, die Chawa verführte.<sup data-src="shabbat-146a"></sup> Dort liegt die Wurzel des körperlichen Verlangens: „und zu deinem Mann wird dein Verlangen sein“.<sup data-src="gen-3-16"></sup> So ist der neunte Vers mit der neunten Eigenschaft verbunden und die neunte Eigenschaft mit dem „Schwanz“.</p>`,
        },
        {
          h: 'Geheiligtes Verlangen',
          b: `<p>Auch das Verlangen des Mannes nach seiner Frau kommt von hier. In der Heiligkeit heißt es darüber: „Das Verlangen der Gerechten ist nur Gutes“.<sup data-src="prov-11-23"></sup> Das Wort „nur“ (<span class="he">אך</span>) ist eine Verminderung: Der Gerechte vermindert in sich das körperliche Verlangen, und dann erfüllt sich „nur Gutes für Israel“.<sup data-src="ps-73-1"></sup></p><p>Daher auch der Ausdruck des Talmuds „besser zu zweit leben als allein“.<sup data-src="yevamot-118b"></sup> Der Raw bemerkt: Der Buchstabe <span class="he">נ</span> ist der neunte vom Ende des Alphabets (ת, ש, ר, ק, צ, פ, ע, ס, נ). Er warnt, dass darin auch die Wurzel der Zügellosigkeit liegt — deshalb braucht das Verlangen Heiligkeit.</p>`,
        },
      ],
      reflection: 'Welches „Kleine“ in mir — ein Wunsch, eine Gewohnheit, ein „Schwanz“ — kann ich nicht unterdrücken, sondern heiligen? Was muss ich dafür heute tun?',
      takeaways: [
        'Der neunte Vers = 3068 = 13 × 236 (ורב כח — „Maß des Schöpfers“); ohne das Wort „eins“ — 3055 = 5 × תורה.',
        'Der durchschnittliche Buchstabe des Verses = 3068 : 52 = 59. Der neunte Vers des Abschnitts Balak = 1593 = 27 × 59.',
        '59 = זנב — der „Schwanz“ aus der Lektion „Tikkun Parzuf-Sanaw“: Die Neun führt zu Jessod und zum Streit darüber, woraus Chawa erschaffen wurde. 59 ist auch der Name Jechiel („G-tt möge leben“) und „Mutter des Lebendigen“ (אם חי) — Chawa: In beiden steht חי, „Leben“.',
        'Das Verlangen wird geheiligt: „Das Verlangen der Gerechten ist nur Gutes“.',
      ],
      puzzle: {
        q: 'Setze den Gedankengang zusammen: vom Vers aus Bereschit — zur gemeinsamen Zahl und ihrem Sinn.',
        pieces: ['Vers aus Bereschit: 3068, 52 Buchstaben', 'Durchschnittlicher Buchstabe: 59', 'Vers aus Balak: 1593 = 27 × 59', '59 = זנב, „Schwanz“', 'Geheiligtes Verlangen — „nur Gutes“'],
        meaning: 'Beide „neunten“ Verse sind durch 59 teilbar — den „Schwanz“, die Wurzel des Verlangens. In der Heiligkeit wird dieses Verlangen zu „nur Gutem“.',
      },
    },
    {
      title: 'Alle Neunen von Bereschit',
      cond: `<p>Die Regel des neunten Verses betrifft nicht nur Verse, sondern auch <b>Buchstaben, Wörter und Abschnitte</b>: Neun ist die Sefira Jessod, die „alles“ heißt und Gegensätze in sich tragen kann.</p><p>Sehen wir uns den neunten Buchstaben, das neunte Wort und den neunten Abschnitt der Tora an. Das neunte Wort ist <em>היתה</em> („war“): <em>והארץ היתה תהו ובהו</em> — „und die Erde war wüst und leer“.<sup data-src="gen-1-1"></sup> Der neunte Abschnitt sind die Worte an Chawa nach der Sünde; sie enden so: <em>והוא ימשל בך</em> — „und er wird über dich herrschen“.</p>`,
      steps: [
        { q: 'Welcher Buchstabe ist der neunte in der Tora? (<span class="he">בראשית ברא…</span>)', opts: ['Alef · 1', 'He · 5', 'Resch · 200', 'Schin · 300'] },
        { q: 'Wie viel ist das neunte Wort der Tora, <span class="he">היתה</span>?', hint: '5 + 10 + 400 + 5.' },
        { q: 'Wie viel sind die Worte <span class="he">והוא ימשל בך</span>?', hint: 'והוא = 18, ימשל = 380, בך = 22.' },
        {
          q: 'Welches Paar ergibt zusammen dieselbe Zahl?',
          opts: ['Jaakow und Rachel', 'Awraham und Sara', 'Jizchak und Riwka', 'Adam und Chawa'],
        },
      ],
      reveal: {
        h: 'Vom Chaos zur Einheit von Jaakow und Rachel',
        p: 'Der neunte Buchstabe der Tora ist Alef, das zweite Alef, wie das zweite „eins“. Das neunte Wort „war“ (420) spricht vom Chaos, in das die Welt zurückkehrte. Genauso viel ergibt „und er wird über dich herrschen“: die Folge der Sünde. Die Berichtigung dieser Zahl ist der Bund von Jaakow und Rachel: 182 + 238 = 420.',
      },
      lessons: [
        {
          h: 'Warum nicht nur Verse',
          b: `<p>Die Regel des „Mei HaSchiloach“ spricht von Versen, doch aus demselben Grund gilt sie für Buchstaben, Wörter und Abschnitte. Jede Neun weist auf die Sefira Jessod hin. Jessod heißt „alles“ — „denn alles im Himmel und auf Erden“ —, und in ihm liegt die Kraft, Gegensätze zu tragen; das ist das „Geheimnis“, die Grundlage.</p><p>Es gibt auch einen deutlichen Hinweis im neunten Vers selbst: Sein neuntes Wort ist „eins“ (<span class="he">אחד</span>). Doch während in den Versen „ein Tag“ und „ein Fleisch“ das Wort „eins“ an dreizehnter Stelle steht, am Ende, ist es hier das neunte. Neun ist die Gematria des Wortes „Ach“ (<span class="he">אח</span>, Bruder): So steht bei Jecheskel einmal „Ach“ statt „Echad“ geschrieben. Hier ist die männliche Seite der Einheit betont.</p>`,
        },
        {
          h: 'Der neunte Buchstabe — das zweite Alef',
          b: `<p>Zählen wir die Buchstaben der Tora ab: <span class="he">ב ר א ש י ת</span> — sechs, dann <span class="he">ב ר א</span> — der neunte Buchstabe ist das Alef des Wortes „bara“, „erschuf“. Mit ihm endet die erste Wortverbindung der Tora „Bereschit bara“ — das Geheimnis von „Wort und halbem Wort“.</p><p>Das ist das zweite Alef in der Tora, so wie im neunten Vers das zweite „eins“ der Tora erklingt. Alef ist gleich eins: Auch hier offenbart die Neun die Einheit.</p>`,
        },
        {
          h: 'Das neunte Wort — „war“',
          b: `<p>Das neunte Wort der Tora ist „war“ (<span class="he">היתה</span>): „und die Erde war wüst und leer“. Hier erscheint in der Tora zum ersten Mal die Wurzel „sein“ — „Dasein“, das Entstehen von „etwas aus nichts“. Nach dem Ramban bedeutet „bara“ die Erschaffung von etwas aus nichts; „bara“ und „war“ — beide Verben stehen an zweiter Stelle in ihren Versen.</p><p>Doch im Wort „war“ liegt auch die Bedeutung der Zerstörung: „Unheil über Unheil“ (<span class="he">הוה על הוה</span>)<sup data-src="ez-7-26"></sup>. Das ist das Geheimnis des „Zerbrechens der Gefäße“ in der Welt des Tohu, der Welt des Chaos. Das Wort „Tohu“ (<span class="he">תהו</span>) = 411 — wie „etwas aus nichts“ (<span class="he">יש מאין</span>). Chaos ist das Gefühl „ich werde herrschen“ (die Worte Adonijas)<sup data-src="kings1-1-5"></sup>, ein „Etwas“, das aus der Quelle des „Nichts“ gewachsen ist. Die Berichtigung ist die wahre Selbstaufhebung vor dem wahren Sein.</p>`,
        },
        {
          h: 'Der neunte Abschnitt — die Worte an Chawa',
          b: `<p>Der neunte Abschnitt der Tora ist der Fluch über Chawa nach der Sünde am Baum der Erkenntnis: „Zur Frau sprach Er: Mehren, mehren werde Ich deine Mühsal und deine Schwangerschaft, unter Schmerzen wirst du Kinder gebären, und zu deinem Mann wird dein Verlangen sein, und er wird über dich herrschen.“<sup data-src="gen-3-16"></sup> Man kann sagen, dass dies die Hauptfolge der Sünde und die Ordnung der Welt nach ihr ist.</p><p>Die Worte „und er wird über dich herrschen“ (<span class="he">והוא ימשל בך</span>) sind 420 — wie „war“ (<span class="he">היתה</span>): die Rückkehr der Welt, der Erde, des weiblichen Prinzips ins Chaos. 420 ist auch „Jaakow“ + „Rachel“ (182 + 238), doch in umgekehrter, „schattenhafter“ Form. Im Bund von Jaakow und Rachel steht Rachel unter ihm — eine Folge der Sünde Chawas. Sara aber stand über Awraham, und Riwka war Jizchak gleich.</p>`,
        },
        {
          h: 'Sonne und Mond',
          b: `<p>Die Worte „und er wird über dich herrschen“ haben drei Wörter und zehn Buchstaben. Das mittlere Wort ist 140: das sind „Chochma“ und „Bina“ (73 + 67) und „Sonne“ und „Mond“ (<span class="he">חמה</span> 53 + <span class="he">לבנה</span> 87). Hier liegt ein Hinweis auf die Quelle der Sünde am Baum: die Klage des Mondes, der sagte „zwei Könige können nicht eine Krone gebrauchen“<sup data-src="chullin-60b"></sup>, und seine Verkleinerung.</p><p>Der mittlere Buchstabe ist 42: „Ima“, Mutter (<span class="he">אמא</span>), und der zweiundvierzigbuchstabige Name. Bina, die „Mutter“, „nistet im Thron“, in der Welt Brija, wo das „Etwas aus nichts“ beginnt. Zusammen 140 + 42 = 182 — Jaakow, der Rachel zur Frau nimmt, und zusammen ergeben sie wieder 420.</p>`,
        },
        {
          h: 'Der ganze Vers: 193',
          b: `<p>Der ganze Vers über Chawa — 16 Wörter — ist 4246, also 22-mal 193. Das letzte Wort des Verses ist „über dich“ (<span class="he">בך</span>) = 22. Der Vers ist also 192-mal „dich“ und noch einmal „dich“ am Ende. Und 192 ist dreimal „Adam und Chawa“ (45 + 19 = 64).</p><p>In der Kabbala ist 193 der heilige Name <span class="he">טפטפיה</span>, das Geheimnis des Bundes von Mann und Frau. Es ist auch der Buchstabe <span class="he">ז</span> (mit dem „Schwanz“ beginnt) in doppelter voller Schreibweise: <span class="he">זין יוד נון</span> = 193. Und die volle Schreibweise des Namens <span class="he">כוזו</span> (eine Buchstabenvertauschung des Namens des Ewigen, die man auf die Mesusa schreibt): <span class="he">כף ואו זין ואו</span> = 193.</p><p>Der Baal Schem Tov erklärte diesen Namen im Dienst des Menschen: „Ku“ (<span class="he">כו</span> = 26, wie der Name des Ewigen) — „ba-so u-wa-so“, in diesem und in jenem, also in jeder Sache. „Ich stelle den Ewigen allezeit vor mich.“<sup data-src="ps-16-8"></sup> Das ist auch das Geheimnis der Worte „Ich bin der Ewige, euer G-tt“<sup data-src="num-15-41"></sup>, mit denen das „Schma“ endet.</p>`,
        },
      ],
      reflection: 'Wo erklingt in mir „ich werde herrschen“? Wie führe ich dieses „Ich“ zu seiner Quelle zurück — und verwandle Herrschaft in einen Bund?',
      takeaways: [
        'Die Regel der Neun gilt auch für Buchstaben, Wörter und Abschnitte. Der neunte Buchstabe der Tora ist א, das zweite Alef, wie das zweite „eins“.',
        'Das neunte Wort ist היתה (420): Dasein und Zerbrechen der Gefäße in der Welt des Tohu; תהו = 411 = יש מאין.',
        'Der neunte Abschnitt sind die Worte an Chawa: „והוא ימשל בך“ = 420 = היתה = יעקב + רחל — Folge der Sünde und ihre Berichtigung.',
        'Das mittlere Wort 140 (חכמה + בינה, חמה + לבנה), der mittlere Buchstabe 42 (אמא): 140 + 42 = 182 = יעקב.',
        'Der ganze Vers = 4246 = 22 × 193 (טפטפיה, כוזו): Der Allmächtige ist „in diesem und in jenem“, in jeder Sache.',
      ],
      puzzle: {
        q: 'Setze die Neunen der Tora vom Kleinen zum Großen zusammen — und die Berichtigung.',
        pieces: ['Neunter Buchstabe — א', 'Neuntes Wort — היתה, 420', 'Neunter Abschnitt — והוא ימשל בך, 420', 'Berichtigung: יעקב + רחל = 420'],
        meaning: 'Die Neunen der Tora — Buchstabe, Wort, Abschnitt — führen von der Einheit durch Chaos und Herrschaft zum Bund von Jaakow und Rachel.',
      },
    },
  ],
  final: {
    title: 'Die Einheit ist offenbart',
    allSolved:
      'Alle vier Rätsel sind gelöst. Die Wasser haben sich an einem Ort gesammelt, die Linie hat sich ausgestreckt, und die Hoffnung ist zu ihrer Quelle zurückgekehrt.',
  },
  puzzle: {
    q: 'Setze den Weg der ganzen Lektion zusammen: wie der neunte Vers vom „einen Ort“ zum Bund führt.',
    pieces: ['Die Wasser sammeln sich an einem Ort', 'Mikwe, Linie und Hoffnung', '59: der „Schwanz“, der geheiligt wird', 'Herrschaft wird zum Bund'],
    meaning: 'Die Wasser haben sich an einem Ort gesammelt, die Linie hat sich ausgestreckt, die Hoffnung ist zur Quelle zurückgekehrt — und die Neun hat zum Bund von Jaakow und Rachel geführt.',
  },
  audience: 'Erfordert Division und Mittelwert (Klasse 4–5); die Begriffe der Welten werden im Kurs erklärt.',
  practice:
    'Wähle einen „Ort“ — eine Ecke im Haus oder eine Zeit des Tages — und mache ihn zu einem „einen Ort“: Dort betest, lernst oder sprichst du ein gutes Wort. Und einen deiner Wünsche unterdrücke nicht, sondern heilige ihn: Richte ihn auf das Gute.',
  highlight: 'Der neunte Vers der Tora und der „Schwanz“ — eine Zahl: 59.',
  share: ({ score, max, time, grid, allSolved, site }) => `🌊 Was haben der neunte Vers der Tora und der „Schwanz“ gemeinsam?
Die Antwort ist eine einzige Zahl.

Ich suche sie in einem Gematria-Spiel nach der Lektion von Rabbiner Jizchak Ginsburgh „Jikawu ha-Majim“. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bisher:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: über den einen Ort, über Mikwe, Linie und Hoffnung, über die Zahl 59 und über alle „Neunen“ von Bereschit. Schaffst du es besser?
Spiel mit 👉 ${site}

©pnimi.org.il ©mychitas.app`,
  source:
    'Nach der Reschima „Jikawu ha-Majim el Makom Echad“ (24. Tischri 5787), Broschüre „Niflaot“ Nr. 422, Bereschit ה׳תשפ״ז (Gal Einai). Vollständiger hebräischer Text: pnimi.org.il',
};

export default de;
