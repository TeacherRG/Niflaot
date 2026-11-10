import type { LessonText } from '../../types';

const de: LessonText = {
  title: 'Baal HaTurim: Wajeze',
  hero: {
    heading: 'Baal HaTurim: <i>vier Rätsel über Jaakows Weg</i>',
    author: 'nach dem Kommentar des Baal HaTurim, Rabbi Jaakow ben Ascher',
    intro:
      'Der Baal HaTurim hat in der Parascha Wajeze versteckte Wörter und Zahlen gefunden. Rechne selbst nach: Bei wem Jaakow auf dem Weg nach Charan lernte, warum die Sonne zu früh unterging, was Jaakow auf der Leiter sah, wessen Name am Brunnen versteckt ist — und wer Lawan erzählte, dass Jaakow geflohen war.',
  },
  summary:
    'Wajeze mit den Augen des Baal HaTurim: Die letzten Buchstaben von „Jaakow aus Be’er-Scheva“ ergeben Ewer, die ersten Schem; „und er ging“ = 66 = „am selben Tag“; „denn die Sonne war untergegangen“ — „erlosch“; „Ort“ dreimal — drei Feste; „Leiter“ = 130 = „Sinai“, „und siehe, eine Leiter“ = „und das Ende“; die letzten Buchstaben von „und Jaakow erwachte aus seinem Schlaf und sagte“ — „Gemeinde“; „denn aus diesem Brunnen“ = 345 = „Mosche“; „Liebesäpfel“ = „wie ein Mensch“; „darum“ = „Maß für Maß“; „dass er geflohen war“ = 240 = „Amalek“.',
  glossary: {
    'ויצא': '„und er ging hinaus“ — der Name der Parascha',
    'ויצא יעקב מבאר שבע': '„und Jaakow ging aus Be’er-Scheva hinaus“',
    'יעקב מבאר שבע': '„Jaakow aus Be’er-Scheva“',
    'מבאר שבע': '„aus Be’er-Scheva“',
    'עבר': 'Ewer — Schems Urenkel; in seinem Haus lernte man Tora',
    'שם': 'Schem — Noachs Sohn',
    'וילך': '„und er ging“',
    'וילך חרנה': '„und er ging nach Charan“',
    'בו ביום': '„am selben Tag“',
    'בלילה': '„in der Nacht“',
    'למחרת': '„am nächsten Tag“',
    'אחר שנה': '„nach einem Jahr“',
    'כי בא השמש': '„denn die Sonne war untergegangen“',
    'כבה': '„erlosch“',
    'מקום': '„Ort“',
    'ויפגע במקום': '„und er traf auf den Ort“',
    'סלם': '„Leiter“',
    'סלם מצב ארצה': '„eine Leiter steht auf der Erde“',
    'והנה': '„und siehe“',
    'והנה סלם': '„und siehe, eine Leiter“',
    'סיני': 'Sinai — der Berg, an dem die Tora gegeben wurde',
    'מזבח': '„Altar“',
    'הר': '„Berg“',
    'ירושלים': 'Jeruschalajim',
    'וקץ': '„und das Ende“',
    'גלות': '„Exil“',
    'שלום': '„Frieden“',
    'משיח': 'Moschiach',
    'וייקץ יעקב משנתו ויאמר': '„und Jaakow erwachte aus seinem Schlaf und sagte“',
    'צבור': '„Gemeinde, eine Versammlung von Menschen“',
    'וידר יעקב נדר': '„und Jaakow legte ein Gelübde ab“',
    'כי מן הבאר ההוא': '„denn aus diesem Brunnen“',
    'הבאר': '„der Brunnen“',
    'ההוא': '„dieser“',
    'משה': 'Mosche',
    'אהרן': 'Aharon',
    'מרים': 'Mirjam',
    'יהושע': 'Jehoschua',
    'דודאים': '„Liebesäpfel“ (Alraunen) — die Pflanze, die Reuwen fand',
    'וימצא דודאים בשדה': '„und er fand Liebesäpfel auf dem Feld“',
    'כאדם': '„wie ein Mensch“',
    'לחם': '„Brot“',
    'עץ': '„Baum“',
    'פרח': '„Blume“',
    'לכן': '„darum“',
    'לכן ישכב עמך הלילה': '„darum soll er heute Nacht bei dir liegen“ — Rachels Worte an Lea',
    'מדה במדה': '„Maß für Maß“',
    'כי ברח': '„dass er geflohen war“',
    'כי ברח יעקב': '„dass Jaakow geflohen war“',
    'עמלק': 'Amalek — ein Volk, ein Feind Israels',
    'לבן': 'Lawan',
    'פרעה': 'der Pharao',
    'עשו': 'Esaw',
  },
  translit: {
    'וילך': 'wajelech',
    'מקום': 'makom',
    'סלם': 'sulam',
    'והנה': 'wehine',
    'הבאר': 'habe’er',
    'ההוא': 'hahu',
    'דודאים': 'dudaim',
    'לכן': 'lachen',
  },
  riddles: [
    {
      title: 'Der Weg nach Charan',
      cond: `<p>Der Baal HaTurim — Rabbi Jaakow ben Ascher (um 1269–1343), Verfasser des Gesetzbuchs „Arba’a Turim“. Zu jedem Vers der Tora hat er kurze Hinweise hinterlassen: Gematriot, erste und letzte Buchstaben von Wörtern, Wörter, die im Tanach nur zwei- oder dreimal vorkommen. Die Parascha Wajeze beginnt so:</p><p class="verse" dir="rtl" lang="he">ויצא יעקב מבאר שבע וילך חרנה</p><p>„Und Jaakow ging aus Be’er-Scheva hinaus und ging nach Charan.“<sup data-src="gen-28-10"></sup> Jaakow verließ seinen Bruder Esaw, der ihn töten wollte, und ging zu seinem Onkel Lawan.</p><p class="verse" dir="rtl" lang="he">ויפגע במקום וילן שם כי בא השמש</p><p>„Und er traf auf den Ort und übernachtete dort, denn die Sonne war untergegangen …“<sup data-src="gen-28-11"></sup></p>`,
      steps: [
        {
          q: 'Nimm die letzten Buchstaben der Wörter <span class="he">יעקב מבאר שבע</span> — „Jaakow aus Be’er-Scheva“. Du darfst die Buchstaben umstellen. Welcher Name kommt heraus?',
          hint: 'Der Name von Schems Urenkel mit drei Buchstaben: Von ihm kommt das Wort „Iwri“, „Hebräer“.',
        },
        {
          q: 'Jetzt die ersten Buchstaben der Wörter <span class="he">מבאר שבע</span>. Welcher Name kommt heraus? Du darfst die Buchstaben umstellen.',
          hint: 'Der Name von Noachs Sohn mit zwei Buchstaben.',
        },
        {
          q: 'Wie viel ergibt das Wort <span class="he">וילך</span> — „und er ging“?',
          hint: 'ו = 6, י = 10, ל = 30, ך = 20.',
        },
        {
          q: 'Welche Wörter ergeben dieselbe Zahl — und sagen, <b>wann</b> Jaakow an den „Ort“ kam?',
          opts: ['„am selben Tag“', '„in der Nacht“', '„am nächsten Tag“', '„nach einem Jahr“'],
        },
        {
          q: 'Nimm die ersten Buchstaben der Wörter <span class="he">כי בא השמש</span> — „denn die Sonne war untergegangen“. Du darfst die Buchstaben umstellen. Welches Wort kommt heraus — und was geschah mit der Sonne?',
          hint: 'Ein Wort mit drei Buchstaben: „erlosch“.',
        },
      ],
      reveal: {
        h: 'Die Sonne erlosch zu früh',
        p: 'Die letzten Buchstaben von „Jaakow mi-Be’er Scheva“ ergeben Ewer, die ersten Buchstaben von „mi-Be’er Scheva“ ergeben Schem: Jaakow versteckte sich und lernte im Haus von Schem und Ewer. „Wajelech“, „und er ging“, = 66 = „bo bajom“, „am selben Tag“. Und die ersten Buchstaben von „ki wa haschemesch“ ergeben „kawa“, „erlosch“: Die Sonne ging vor ihrer Zeit unter, damit Jaakow an diesem Ort übernachtete.',
      },
      lessons: [
        {
          h: 'Im Haus von Schem und Ewer',
          b: `<p>Die letzten Buchstaben von <span class="he">יעקב מבאר שבע</span>: ב, ר, ע — <span class="he">עבר</span>, Ewer.<sup data-src="bht-28-10-3"></sup> Die ersten Buchstaben von <span class="he">מבאר שבע</span>: מ, ש — <span class="he">שם</span>, Schem.<sup data-src="bht-28-10-6"></sup></p><p>Raschi sagt, wie viele Jahre Jaakow bei Ewer lernte — und dass er all diese Jahre nachts nicht schlafen ging.<sup data-src="rashi-28-11-5"></sup></p><p class="expl"><b>Erklärung.</b> Bevor Jaakow in das Haus des Betrügers Lawan ging, sammelte er im Lehrhaus Kraft. Tora, die man vorher lernt, schützt einen Menschen dort, wo es schwer ist.</p>`,
        },
        {
          h: 'Am selben Tag',
          b: `<p><span class="he">וילך</span> = 6 + 10 + 30 + 20 = 66; <span class="he">בו ביום</span> = 8 + 58 = 66.<sup data-src="bht-28-10-7"></sup></p><p class="expl"><b>Erklärung.</b> Von Be’er-Scheva bis zum „Ort“ — dem Berg Morija — ist es weit, und doch kam Jaakow am selben Tag dort an: Der Weg „wurde kürzer“ vor ihm. Wenn ein Mensch dorthin geht, wo er sein soll, hilft G-tt ihm auf dem Weg.</p>`,
        },
        {
          h: 'Die Sonne erlosch',
          b: `<p>Die ersten Buchstaben von <span class="he">כי בא השמש</span>: כ, ב, ה — <span class="he">כבה</span>, „erlosch“.<sup data-src="bht-28-11-2"></sup></p><p>Raschi erklärt, warum die Tora nicht einfach sagt: „und die Sonne ging unter“.<sup data-src="rashi-28-11-3"></sup></p><p class="expl"><b>Erklärung.</b> Jaakow wollte weitergehen — aber G-tt „löschte“ die Sonne, damit er am heiligen Ort übernachtete und dort träumte. Manchmal ist ein Halt unterwegs kein Hindernis, sondern ein Geschenk.</p>`,
        },
      ],
      reflection: 'Jaakow lernte zuerst und ging erst dann an einen schweren Ort. Was kann ich „auf den Weg mitnehmen“ — vorher lernen oder vorbereiten?',
      takeaways: [
        'Die letzten Buchstaben von „יעקב מבאר שבע“ — עבר, die ersten von „מבאר שבע“ — שם: Jaakow lernte im Haus von Schem und Ewer.',
        'וילך = 66 = בו ביום: Er kam am selben Tag an den „Ort“.',
        'Die ersten Buchstaben von „כי בא השמש“ — כבה: Die Sonne erlosch vor ihrer Zeit.',
      ],
    },
    {
      title: 'Die Leiter',
      cond: `<p>Schau dir noch einmal den Vers über Jaakows Nacht an:</p><p class="verse" dir="rtl" lang="he">ויפגע במקום וילן שם כי בא השמש ויקח מאבני המקום וישם מראשתיו וישכב במקום ההוא</p><p>„Und er traf auf den Ort und übernachtete dort, denn die Sonne war untergegangen; und er nahm von den Steinen des Ortes und legte sie unter seinen Kopf und legte sich an diesem Ort schlafen.“<sup data-src="gen-28-11"></sup> Und Jaakow träumte:</p><p class="verse" dir="rtl" lang="he">ויחלם והנה סלם מצב ארצה וראשו מגיע השמימה</p><p>„Und er träumte, und siehe, eine Leiter stand auf der Erde, und ihre Spitze reichte bis zum Himmel, und siehe, Engel G-ttes stiegen auf ihr hinauf und hinab.“<sup data-src="gen-28-12"></sup></p>`,
      steps: [
        {
          q: 'Wie oft steht im ersten Vers das Wort <span class="he">מקום</span> — „Ort“ (mit Vorsilben: במקום, המקום)?',
          hint: 'Schau auf den Anfang, die Mitte und das Ende des Verses.',
        },
        {
          q: 'Wie viel ergibt das Wort <span class="he">סלם</span> — „Leiter“? In der Tora steht es ohne ו.',
          hint: 'ס = 60, ל = 30, ם = 40.',
        },
        {
          q: 'Welches Wort ergibt dieselbe Zahl — und sagt, was G-tt Jaakow noch auf der Leiter zeigte?',
          opts: ['Sinai', '„Altar“', '„Berg“', 'Jeruschalajim'],
        },
        {
          q: 'Und wie viel ergeben die beiden Wörter <span class="he">והנה סלם</span> — „und siehe, eine Leiter“?',
          hint: 'והנה = 6 + 5 + 50 + 5; zähl die „Leiter“ dazu.',
        },
        {
          q: 'Welches Wort ergibt dieselbe Zahl?',
          opts: ['„und das Ende“', '„Exil“', '„Frieden“', 'Moschiach'],
        },
      ],
      reveal: {
        h: 'Sinai und das Ende der Exile',
        p: '„Ort“ steht im Vers dreimal: ein Hinweis auf die drei Feste, an denen Jaakows Kinder zum Tempel an diesem Ort hinaufziehen werden. „Sulam“, „Leiter“, = 130 = „Sinai“: G-tt zeigte Jaakow, wie seine Kinder am Berg Sinai stehen werden. Und „wehine sulam“, „und siehe, eine Leiter“, = 196 = „wakez“, „und das Ende“: Er zeigte ihm, wann die Exile enden.',
      },
      lessons: [
        {
          h: 'Dreimal „Ort“',
          b: `<p>Im Vers: <span class="he">במקום</span>, <span class="he">המקום</span>, <span class="he">במקום</span> — dreimal.<sup data-src="bht-28-11-1"></sup> Drei Feste — Pessach, Schawuot und Sukkot, an denen ganz Israel zum Tempel in Jeruschalajim hinaufzog.</p><p class="expl"><b>Erklärung.</b> Der Stein, auf dem Jaakow schlief, lag dort, wo später der Tempel stehen sollte. Eine Nacht unseres Vaters — und Tausende Festwallfahrten seiner Kinder.</p>`,
        },
        {
          h: 'Leiter — Sinai',
          b: `<p><span class="he">סלם</span> = 60 + 30 + 40 = 130; <span class="he">סיני</span> = 60 + 10 + 50 + 10 = 130.<sup data-src="bht-28-12-6"></sup></p><p class="expl"><b>Erklärung.</b> Die Leiter steht auf der Erde, und ihre Spitze reicht bis zum Himmel. So ist auch die Tora vom Sinai: Sie lebt auf der Erde, in ganz normalen Dingen — und hebt den Menschen bis zum Himmel.</p>`,
        },
        {
          h: 'Und das Ende',
          b: `<p><span class="he">והנה</span> = 6 + 5 + 50 + 5 = 66; <span class="he">והנה סלם</span> = 66 + 130 = 196; <span class="he">וקץ</span> = 6 + 100 + 90 = 196.<sup data-src="bht-28-12-5"></sup></p><p class="expl"><b>Erklärung.</b> Die Engel stiegen hinauf und hinab — Königreiche kommen und gehen. Aber Jaakow sah auch das Ende: Jedes Exil hat eine Grenze. Darum muss man auch in schweren Zeiten die Hoffnung nicht verlieren.</p>`,
        },
      ],
      reflection: 'Die Leiter steht auf der Erde und reicht bis zum Himmel. Welche ganz normale Sache kann ich heute so tun, dass sie eine „Sprosse“ nach oben wird?',
      takeaways: [
        '„Ort“ dreimal im Vers: die drei Feste, an denen man zum Tempel hinaufzieht.',
        'סלם = 130 = סיני: Auf der Leiter sah Jaakow, wie man am Berg Sinai stehen wird.',
        'והנה סלם = 196 = וקץ: G-tt zeigte ihm das Ende der Exile.',
      ],
    },
    {
      title: 'Der Brunnen Mosches',
      cond: `<p>Jaakow wachte auf:</p><p class="verse" dir="rtl" lang="he">וייקץ יעקב משנתו ויאמר אכן יש ה׳ במקום הזה</p><p>„Und Jaakow erwachte aus seinem Schlaf und sagte: Wirklich, der Ewige ist an diesem Ort, und ich wusste es nicht!“<sup data-src="gen-28-16"></sup> Er ging weiter nach Osten und kam an einen Brunnen:</p><p class="verse" dir="rtl" lang="he">כי מן הבאר ההוא ישקו העדרים</p><p>„Und er sah, und siehe, ein Brunnen auf dem Feld, und drei Schafherden lagen daneben, denn aus diesem Brunnen tränkte man die Herden; und der Stein auf der Öffnung des Brunnens war groß.“<sup data-src="gen-29-2"></sup></p>`,
      steps: [
        {
          q: 'Nimm die letzten Buchstaben der Wörter <span class="he">וייקץ יעקב משנתו ויאמר</span> — „und Jaakow erwachte aus seinem Schlaf und sagte“. Du darfst die Buchstaben umstellen. Welches Wort kommt heraus?',
          hint: 'Ein Wort mit vier Buchstaben: „Gemeinde, eine Versammlung von Menschen“. Das End-ץ ist derselbe Buchstabe wie צ.',
        },
        {
          q: 'Wie viel ergeben die Wörter <span class="he">כי מן הבאר ההוא</span> — „denn aus diesem Brunnen“?',
          hint: 'כי = 30, מן = 90, הבאר = 208, ההוא = 17.',
        },
        {
          q: 'Wessen Name ergibt dieselbe Zahl?',
          opts: ['Mosche', 'Aharon', 'Mirjam', 'Jehoschua'],
        },
      ],
      reveal: {
        h: 'Der Brunnen Mosches',
        p: 'Die letzten Buchstaben von „wajikaz Jaakow mischnato wajomer“ ergeben „zibur“, „Gemeinde“: Das Gebet eines Menschen wird am besten zusammen mit der Gemeinde gehört. Und „ki min habe’er hahu“, „denn aus diesem Brunnen“, = 345 = „Mosche“: In dem Brunnen, an dem Jaakow Rachel traf, sieht der Baal HaTurim Mosche — auch er wird seine Frau an einem Brunnen treffen und die Herde tränken.',
      },
      lessons: [
        {
          h: 'Beten mit der Gemeinde',
          b: `<p>Die letzten Buchstaben von <span class="he">וייקץ יעקב משנתו ויאמר</span>: ץ, ב, ו, ר — <span class="he">צבור</span>, „Gemeinde“.<sup data-src="bht-28-16-1"></sup></p><p class="expl"><b>Erklärung.</b> Jaakow betete an diesem Ort allein — und doch lehrt der Baal HaTurim aus seinen Worten, dass das Gebet mit der Gemeinde am besten gehört wird. Eine Stimme kann verloren gehen, aber viele Stimmen zusammen steigen hinauf, wie auf einer Leiter.</p>`,
        },
        {
          h: 'Aus diesem Brunnen',
          b: `<p><span class="he">כי</span> = 30, <span class="he">מן</span> = 90, <span class="he">הבאר</span> = 208, <span class="he">ההוא</span> = 17; zusammen 30 + 90 + 208 + 17 = 345; <span class="he">משה</span> = 40 + 300 + 5 = 345.<sup data-src="bht-29-2-4"></sup></p><p>Jaakow traf Rachel am Brunnen und rollte den großen Stein allein weg. Viele Jahre später saß auch Mosche, nachdem er aus Ägypten geflohen war, an einem Brunnen in Midjan, setzte sich für Jitros Töchter ein und tränkte ihre Herde.</p><p class="expl"><b>Erklärung.</b> Ein Brunnen ist ein Ort der Begegnung und der Fürsorge: Jaakow und Mosche begannen beide ein neues Leben damit, dass sie anderen halfen, die Schafe zu tränken.</p>`,
        },
      ],
      reflection: 'Am Brunnen halfen Jaakow und Mosche zuerst anderen. Wem kann ich heute helfen — auch wenn es nicht meine Aufgabe ist?',
      takeaways: [
        'Die letzten Buchstaben von „וייקץ יעקב משנתו ויאמר“ — צבור: Das Gebet wird mit der Gemeinde am besten gehört.',
        'כי מן הבאר ההוא = 345 = משה: Jaakows Brunnen ist ein Hinweis auf Mosche.',
      ],
    },
    {
      title: 'Liebesäpfel und eine Flucht',
      cond: `<p>Jaakow bekam Söhne. Eines Tages fand der älteste, Reuwen, auf dem Feld Liebesäpfel:</p><p class="verse" dir="rtl" lang="he">וימצא דודאים בשדה</p><p>„Und Reuwen ging in den Tagen der Weizenernte und fand Liebesäpfel auf dem Feld und brachte sie Lea, seiner Mutter.“ Rachel bat Lea darum — und sagte zu ihr:</p><p class="verse" dir="rtl" lang="he">לכן ישכב עמך הלילה תחת דודאי בנך</p><p>„Darum soll er heute Nacht bei dir liegen, für die Liebesäpfel deines Sohnes.“<sup data-src="gen-30-14"></sup> Zwanzig Jahre vergingen. Jaakow verließ Lawan mit seiner ganzen Familie, ohne es ihm zu sagen:</p><p class="verse" dir="rtl" lang="he">ויגד ללבן ביום השלישי כי ברח יעקב</p><p>„Und am dritten Tag wurde Lawan berichtet, dass Jaakow geflohen war.“<sup data-src="gen-31-22"></sup></p>`,
      steps: [
        {
          q: 'Wie viel ergibt das Wort <span class="he">דודאים</span> — „Liebesäpfel“?',
          hint: 'ד = 4, ו = 6, ד = 4, א = 1, י = 10, ם = 40.',
        },
        {
          q: 'Welches Wort ergibt dieselbe Zahl — und sagt, wie die Wurzel der Pflanze aussieht?',
          opts: ['„wie ein Mensch“', '„Brot“', '„Baum“', '„Blume“'],
        },
        {
          q: 'Rachel sagte <span class="he">לכן</span> — „darum“. Wie viel ergibt dieses Wort?',
          hint: 'ל = 30, כ = 20, ן = 50.',
        },
        {
          q: 'Wie viel ergeben die Wörter <span class="he">כי ברח</span> — „dass er geflohen war“?',
          hint: 'כי = 30, ברח = 2 + 200 + 8.',
        },
        {
          q: 'Der Baal HaTurim: Jemand erzählte Lawan, dass Jaakow geflohen war. Wessen Name ergibt dieselbe Zahl?',
          opts: ['Amalek', 'Lawan', 'der Pharao', 'Esaw'],
        },
      ],
      reveal: {
        h: 'Maß für Maß',
        p: '„Dudaim“, „Liebesäpfel“, = 65 = „ke’adam“, „wie ein Mensch“. „Lachen“, „darum“, = 100 = „mida ke-mida“, „Maß für Maß“: Rachel überließ Lea eine Nacht mit Jaakow für die Liebesäpfel — Maß für Maß. Und „ki warach“, „dass er geflohen war“, = 240 = „Amalek“: Amalek war es, der Lawan von Jaakows Flucht erzählte — und später erzählte er dem Pharao von Israels Flucht.',
      },
      lessons: [
        {
          h: 'Wie ein Mensch',
          b: `<p>Raschi sagt, warum die Tora erwähnt, dass es „in den Tagen der Weizenernte“ war.<sup data-src="rashi-30-14-1"></sup></p><p><span class="he">דודאים</span> = 4 + 6 + 4 + 1 + 10 + 40 = 65; <span class="he">כאדם</span> = 20 + 1 + 4 + 40 = 65.<sup data-src="bht-30-14"></sup> Die Wurzel der Alraune sieht wirklich aus wie eine kleine Menschenfigur.</p><p>An derselben Stelle bemerkt der Baal HaTurim: In den Namen der zwölf Stämme kommt der Buchstabe ס nur in <span class="he">יוסף</span> vor und der Buchstabe ע nur in <span class="he">שמעון</span>.</p><p class="expl"><b>Erklärung.</b> Reuwen war noch ein Junge — und doch nahm er auf dem Feld nur, was niemandem gehörte, und nicht den Weizen eines anderen. Sein Geschenk für die Mutter war ehrlich.</p>`,
        },
        {
          h: 'Maß für Maß',
          b: `<p><span class="he">לכן</span> = 30 + 20 + 50 = 100; <span class="he">מדה במדה</span> = 49 + 51 = 100.<sup data-src="bht-30-15-2"></sup></p><p>Der Baal HaTurim erklärt auch Leas Worte: Als sie Lewi, ihren dritten Sohn, bekam, sagte sie „denn ich habe ihm drei geboren“, und als sie Sewulun, den sechsten, bekam: „denn ich habe ihm sechs geboren“. Jaakow sollte zwölf Söhne von vier Frauen haben — drei für jede —, und sie hatte zwei Anteile.</p><p class="expl"><b>Erklärung.</b> Maß für Maß — so lenkt G-tt die Welt: Jede Tat kommt zum Menschen im selben „Maß“ zurück. Darum lohnt es sich, auch kleine Entscheidungen gut abzuwägen.</p>`,
        },
        {
          h: 'Wer es Lawan erzählte',
          b: `<p>Die Wörter <span class="he">כי ברח</span> stehen im Tanach zweimal: „dass Jaakow geflohen war“ und „dass das Volk geflohen war“ (Schemot 14,5).<sup data-src="bht-31-22-1"></sup> <span class="he">כי ברח</span> = 30 + 210 = 240; <span class="he">עמלק</span> = 70 + 40 + 30 + 100 = 240.<sup data-src="bht-31-22-2"></sup></p><p class="expl"><b>Erklärung.</b> Lawan und den Pharao hat derselbe Amalek gegen Israel „aufgeweckt“. Ein Feind sucht einen Grund anzugreifen — und beide Male hat G-tt Sein Volk gerettet.</p>`,
        },
      ],
      reflection: '„Maß für Maß“: Meine Taten kommen zu mir zurück. Welche gute Tat will ich heute „säen“?',
      takeaways: [
        'דודאים = 65 = כאדם: Die Wurzel sieht aus wie ein Mensch.',
        'לכן = 100 = מדה במדה: Jede Tat kommt Maß für Maß zurück.',
        'כי ברח = 240 = עמלק: Amalek erzählte Lawan, dass Jaakow geflohen war.',
      ],
    },
  ],
  memo: {
    intro:
      'Zwölf Kommentare des Baal HaTurim zur Parascha Wajeze — zwölf Kartenpaare. Jedes Bild erzählt von einem Kommentar, und sein Paar sind die Worte der Tora, um die es darin geht.',
    items: [
      {
        title: 'Ewers Lehrhaus',
        caption: 'Eine Schriftrolle und eine Öllampe',
        verse: '„und Jaakow ging aus Be’er-Scheva hinaus“',
        quote: '„Jaakow aus Be’er-Scheva“ — die letzten Buchstaben ergeben „Ewer“: Er war im Haus Ewers verborgen.',
        explain:
          'Die letzten Buchstaben der Wörter יעקב מבאר שבע: ב, ר, ע — עבר, Ewer. Bevor Jaakow zu Lawan kam, lernte er vierzehn Jahre Tora im Haus Ewers — und, wie Raschi sagt, ging er all diese Jahre nachts nicht schlafen.',
        moral: 'Auf einen schweren Weg nimmt man Tora mit.',
      },
      {
        title: 'Am selben Tag',
        caption: 'Ein Weg und die Sonne hoch oben',
        verse: '„und er ging nach Charan“',
        quote: '„Und er ging“ — in Gematria „am selben Tag“.',
        explain:
          'Das Wort וילך = 66, und בו ביום („am selben Tag“) = 66. Der Weg war weit, aber Jaakow kam am selben Tag an den heiligen Ort: Der Weg „wurde kürzer“ vor ihm.',
        moral: 'Wer den richtigen Weg geht, dem hilft G-tt unterwegs.',
      },
      {
        title: 'Dreimal „Ort“',
        caption: 'Drei Pilger gehen zu einem Berg',
        verse: '„und er traf auf den Ort“',
        quote: 'Dreimal steht im Vers „Ort“ — ein Hinweis auf die drei Feste, an denen seine Kinder zu diesem Ort hinaufziehen werden.',
        explain:
          'Im Vers 28,11 steht das Wort „Ort“ dreimal. An diesem Ort sollte der Tempel stehen, und dreimal im Jahr — zu Pessach, Schawuot und Sukkot — zog ganz Israel dorthin.',
        moral: 'Eine Nacht unseres Vaters wurde zum Weg für seine Kinder.',
      },
      {
        title: 'Die Sonne erlosch',
        caption: 'Die Sonne hinter den Bergen',
        verse: '„denn die Sonne war untergegangen“',
        quote: '„Denn die Sonne war untergegangen“ — die ersten Buchstaben ergeben „erlosch“: Das Licht der Sonne erlosch vor seiner Zeit.',
        explain:
          'Die ersten Buchstaben der Wörter כי בא השמש: כ, ב, ה — כבה, „erlosch“. Die Sonne ging zu früh unter, damit Jaakow am heiligen Ort übernachtete und von der Leiter träumte.',
        moral: 'Ein Halt unterwegs kann ein Geschenk sein.',
      },
      {
        title: 'Die Leiter und der Sinai',
        caption: 'Eine Leiter bis zu den Wolken',
        verse: '„eine Leiter steht auf der Erde“',
        quote: '„Leiter“ — in Gematria „Sinai“: Er zeigte ihm, wie man am Berg Sinai stehen wird.',
        explain:
          'Das Wort סלם = 130, und סיני = 130. Die Leiter steht auf der Erde, und ihre Spitze reicht bis zum Himmel — wie die Tora vom Sinai.',
        moral: 'Die Tora verbindet Erde und Himmel.',
      },
      {
        title: 'Das Ende der Exile',
        caption: 'Stufen, und oben der Morgen',
        verse: '„und siehe, eine Leiter“',
        quote: '„Und siehe, eine Leiter“ — in Gematria „und das Ende“: Er zeigte ihm das Ende der Exile.',
        explain:
          'והנה סלם = 66 + 130 = 196, und וקץ („und das Ende“) = 196. Die Engel stiegen hinauf und hinab, wie Königreiche, die kommen und gehen. Aber jedes Exil hat ein Ende.',
        moral: 'Auch in schweren Zeiten verliert man die Hoffnung nicht.',
      },
      {
        title: 'Zusammen ist das Gebet stärker',
        caption: 'Menschen beten zusammen',
        verse: '„und Jaakow erwachte aus seinem Schlaf und sagte“',
        quote: 'Die letzten Buchstaben ergeben „Gemeinde“: Das Gebet eines Menschen wird mit der Gemeinde am besten gehört.',
        explain:
          'Die letzten Buchstaben der Wörter וייקץ יעקב משנתו ויאמר: ץ, ב, ו, ר — צבור, „Gemeinde“. Viele Stimmen zusammen hört man besser als eine.',
        moral: 'Zusammen betet man besser.',
      },
      {
        title: 'Das erste Gelübde',
        caption: 'Ein Gedenkstein und ein Ölkrug',
        verse: '„und Jaakow legte ein Gelübde ab“',
        quote: '„Und er gelobte“ — der Erste, der ein Gelübde ablegte, war Jaakow.',
        explain:
          'Das Wort וידר („und er gelobte“) steht im Tanach dreimal: über Jaakow, über Israel und über Jiftach. Jaakow versprach G-tt als Erster: Wenn Du mit mir bist, gebe ich den Zehnten. Darum heißt G-tt in den Tehillim „der Starke Jaakows“.',
        moral: 'Ein gutes Versprechen von Herzen bringt einen Menschen weiter.',
      },
      {
        title: 'Der Brunnen Mosches',
        caption: 'Ein Brunnen und eine Schafherde',
        verse: '„denn aus diesem Brunnen“',
        quote: '„Denn aus diesem Brunnen“ — in Gematria „Mosche“.',
        explain:
          'כי מן הבאר ההוא = 30 + 90 + 208 + 17 = 345, und משה = 345. Jaakow traf Rachel an einem Brunnen; viele Jahre später traf auch Mosche seine Frau an einem Brunnen und tränkte die Herde.',
        moral: 'Ein neues Leben beginnt damit, anderen zu helfen.',
      },
      {
        title: 'Wie ein Mensch',
        caption: 'Eine Alraune mit Wurzel',
        verse: '„und er fand Liebesäpfel auf dem Feld“',
        quote: '„Liebesäpfel“ — in Gematria „wie ein Mensch“.',
        explain:
          'Das Wort דודאים = 65, und כאדם („wie ein Mensch“) = 65: Die Wurzel sieht aus wie eine kleine Menschenfigur. Reuwen fand sie zur Erntezeit — und nahm nur, was niemandem gehörte, nicht den Weizen eines anderen.',
        moral: 'Ein Geschenk soll ehrlich sein.',
      },
      {
        title: 'Maß für Maß',
        caption: 'Eine Waage mit zwei Schalen',
        verse: '„darum soll er heute Nacht bei dir liegen“',
        quote: '„Darum“ — in Gematria „Maß für Maß“.',
        explain:
          'Das Wort לכן = 100, und מדה במדה = 100. Rachel überließ Lea eine Nacht mit Jaakow für die Liebesäpfel. Maß für Maß: Jede Tat kommt zum Menschen zurück.',
        moral: 'Jede Tat kommt Maß für Maß zurück.',
      },
      {
        title: 'Wer es Lawan erzählte',
        caption: 'Ein Bote läuft durch die Wüste',
        verse: '„dass Jaakow geflohen war“',
        quote: '„Dass er geflohen war“ — in Gematria „Amalek“.',
        explain:
          'כי ברח = 30 + 210 = 240, und עמלק = 240. Der Midrasch sagt: Amalek erzählte Lawan, dass Jaakow geflohen war, und später dem Pharao, dass Israel geflohen war. Beide Male rettete G-tt Sein Volk.',
        moral: 'Der Feind sucht einen Grund, aber G-tt beschützt.',
      },
    ],
  },
  daily: {
    intro:
      'Die Parascha Wajeze für jeden Tag: zwei Kommentare des Baal HaTurim am Tag — von Sonntag bis Freitag. Der Vers, die Worte des Baal HaTurim auf Hebräisch mit Übersetzung und eine Erklärung — etwa fünf Minuten.',
    items: [
      {
        h: 'Schem, Ewer und „am selben Tag“',
        b: '<p>Die letzten Buchstaben von <span class="he">יעקב מבאר שבע</span>: ב, ר, ע — <span class="he">עבר</span>; die ersten Buchstaben von <span class="he">מבאר שבע</span>: מ, ש — <span class="he">שם</span>. <span class="he">וילך</span> = 6 + 10 + 30 + 20 = 66 = <span class="he">בו ביום</span>.</p><p>Raschi: Vierzehn Jahre lernte Jaakow im Haus Ewers und ging all diese Jahre nachts nicht schlafen. Und an den „Ort“, den Berg Morija, kam er am selben Tag: Der Weg „wurde kürzer“ vor ihm.</p><p class="expl"><b>Erklärung.</b> Zuerst lernen, dann der schwere Weg. Tora, die man vorher lernt, schützt einen Menschen unterwegs.</p>',
      },
      {
        h: 'Dreimal „Ort“',
        b: '<p>Im Vers steht das Wort „Ort“ dreimal: <span class="he">במקום</span>, <span class="he">המקום</span>, <span class="he">במקום</span> — ein Hinweis auf die drei Feste, Pessach, Schawuot und Sukkot, an denen Jaakows Kinder zu diesem Ort, zum Tempel, hinaufziehen werden. Die ersten Buchstaben von <span class="he">כי בא השמש</span>: כ, ב, ה — <span class="he">כבה</span>, „erlosch“.</p><p>Raschi: Die Sonne ging für ihn plötzlich unter, vor ihrer Zeit, damit er an diesem Ort übernachtete.</p><p class="expl"><b>Erklärung.</b> Jaakow wollte weitergehen, aber G-tt hielt ihn an — und genau in dieser Nacht sah er die Leiter.</p>',
      },
      {
        h: 'Die Leiter: Sinai und das Ende der Exile',
        b: '<p><span class="he">סלם</span> = 60 + 30 + 40 = 130 = <span class="he">סיני</span>. <span class="he">והנה סלם</span> = 66 + 130 = 196 = <span class="he">וקץ</span>.</p><p>G-tt zeigte Jaakow, wie man am Berg Sinai stehen wird — und das Ende der Exile. In der Tora steht das Wort „Leiter“ ohne ו — so stimmt die Rechnung.</p><p class="expl"><b>Erklärung.</b> Die Leiter steht auf der Erde und reicht bis zum Himmel: Die Tora lebt in ganz normalen Dingen und hebt den Menschen nach oben. Und jedes Exil hat ein Ende.</p>',
      },
      {
        h: 'Die Gemeinde und Lernen im Traum',
        b: '<p>Die letzten Buchstaben von <span class="he">וייקץ יעקב משנתו ויאמר</span>: ץ, ב, ו, ר — <span class="he">צבור</span>, „Gemeinde“: Das Gebet eines Menschen wird mit der Gemeinde am besten gehört.</p><p>Und noch etwas: <span class="he">משנתו</span>, „aus seinem Schlaf“, kann man „mi-mischnato“ lesen — „aus seinem Lernen“: Am Tag dachte Jaakow über die Tora nach, und auch im Traum hörte sein Herz nicht damit auf.</p><p class="expl"><b>Erklärung.</b> Woran ein Mensch am Tag denkt, das sieht er in der Nacht. Gute Gedanken am Tag — gute Träume in der Nacht.</p>',
      },
      {
        h: 'Die Tore des Himmels bei Tagesanbruch',
        b: '<p>„Und das ist das Tor des Himmels“, und gleich danach: „und Jaakow stand früh am Morgen auf“. Der Baal HaTurim: Bei Tagesanbruch werden die Tore des Himmels geöffnet, und das ist eine gute Zeit zum Beten.</p><p class="expl"><b>Erklärung.</b> Der Morgen ist der Anfang des Tages. Wer den Tag mit einem Gebet beginnt, geht durch offene „Tore“ in ihn hinein.</p>',
      },
      {
        h: 'Das erste Gelübde',
        b: '<p>Das Wort <span class="he">וידר</span>, „und er gelobte“, steht im Tanach dreimal: „und Jaakow gelobte“, „und Israel gelobte“, „und Jiftach gelobte“. Die Gerechten legten Gelübde ab, und der Erste war Jaakow. Darum heißt es: „der dem Ewigen schwor, dem Starken Jaakows gelobte“ (Tehillim 132,2).</p><p>Jaakow versprach: Wenn G-tt mit ihm auf dem Weg ist, ihm Brot und Kleidung gibt und er in Frieden zurückkommt, — dann wird der Stein ein Haus G-ttes, und von allem, was er hat, gibt er den Zehnten.</p><p class="expl"><b>Erklärung.</b> Jaakow bat um wenig — Brot und Kleidung — und versprach großzügig. So bittet man G-tt: bescheiden für sich und großzügig für andere.</p>',
      },
      {
        h: 'Der Brunnen Mosches',
        b: '<p>„Und siehe, ein Brunnen auf dem Feld“ — ein Hinweis auf den Brunnen, den Israel in der Wüste hatte. <span class="he">כי מן הבאר ההוא</span> = 30 + 90 + 208 + 17 = 345 = <span class="he">משה</span>.</p><p>In dieser Geschichte (Bereschit 29,1–10) steht das Wort „Brunnen“ siebenmal. Der Brunnen in der Wüste ging vierzig Jahre mit Israel; und Mosche traf, wie Jaakow, seine Frau an einem Brunnen.</p><p class="expl"><b>Erklärung.</b> Ein Brunnen gibt allen Wasser, die kommen. So waren Jaakow und Mosche: Ihre Kraft war, anderen zu geben.</p>',
      },
      {
        h: 'Lawans Umarmung',
        b: '<p>„Und er umarmte ihn und küsste ihn“: Der Baal HaTurim erklärt, warum Lawan es so eilig hatte. Zuerst umarmte er Jaakow, um zu prüfen, ob er Münzen am Gürtel hatte, und als er nichts fand, küsste er ihn, um zu prüfen, ob er einen Edelstein im Mund hatte.</p><p class="expl"><b>Erklärung.</b> Auch eine warme Umarmung kann berechnend sein. Wichtig ist nicht nur, was ein Mensch tut, sondern auch, warum.</p>',
      },
      {
        h: 'Liebesäpfel',
        b: '<p><span class="he">דודאים</span> = 4 + 6 + 4 + 1 + 10 + 40 = 65 = <span class="he">כאדם</span>, „wie ein Mensch“: Die Wurzel sieht aus wie eine kleine Menschenfigur.</p><p>Der Baal HaTurim bemerkt auch: In den Namen der Stämme kommt der Buchstabe ס nur in Josefs Namen vor — er ist der Gegner Esaws —, und der Buchstabe ע nur in Schimons.</p><p class="expl"><b>Erklärung.</b> Reuwen brachte seiner Mutter zur Erntezeit ein Geschenk vom Feld — und nahm nur, was niemandem gehörte (Raschi). Ein ehrliches Geschenk ist mehr wert als ein teures.</p>',
      },
      {
        h: 'Maß für Maß',
        b: '<p><span class="he">לכן</span> = 30 + 20 + 50 = 100 = <span class="he">מדה במדה</span>.</p><p>Rachel überließ Lea eine Nacht mit Jaakow für die Liebesäpfel — Maß für Maß. Der Baal HaTurim erklärt auch Leas Worte: bei Lewi — „ich habe ihm drei geboren“, bei Sewulun — „sechs“: zwölf Stämme von vier Frauen — drei für jede, und sie hatte zwei Anteile.</p><p class="expl"><b>Erklärung.</b> So lenkt G-tt die Welt: Jede Tat kommt zum Menschen im selben Maß zurück.</p>',
      },
      {
        h: 'Wer es Lawan erzählte',
        b: '<p><span class="he">כי ברח</span> = 30 + 210 = 240 = <span class="he">עמלק</span>.</p><p>Diese Wörter stehen im Tanach zweimal: „dass Jaakow geflohen war“ und „dass das Volk geflohen war“ (Schemot 14,5). Der Midrasch: Amalek erzählte Lawan von Jaakows Flucht und dem Pharao von Israels Flucht.</p><p class="expl"><b>Erklärung.</b> Ein Feind sucht, wie er schaden kann — aber G-tt hat Lawan und den Pharao aufgehalten.</p>',
      },
      {
        h: 'Machanajim',
        b: '<p>Jaakow kam ins Land Israel zurück, und Engel G-ttes kamen ihm entgegen. Er nannte den Ort <span class="he">מחנים</span>, „zwei Lager“. Der Baal HaTurim liest das Wort als Notarikon: „me’otam chajalim natal Jaakow malachim“ — „von diesen Kriegern nahm Jaakow Engel“.</p><p class="expl"><b>Erklärung.</b> Engel begleiteten Jaakow auf seinem Weg — und kamen ihm entgegen, als er zurückkehrte. Wer mit G-tt geht, geht nie allein.</p>',
      },
    ],
  },
  final: {
    title: 'Eine Leiter bis zum Himmel',
    allSolved:
      'Alle vier Rätsel sind gelöst. Jaakow lernte im Haus von Schem und Ewer und kam am selben Tag an den „Ort“, und die Sonne erlosch vor ihrer Zeit; „Ort“ dreimal, wie die drei Feste; die Leiter = Sinai, „und siehe, eine Leiter“ = „und das Ende“ der Exile; das Gebet wird mit der Gemeinde gehört, und Jaakows Brunnen ist ein Hinweis auf Mosche; Liebesäpfel sind „wie ein Mensch“, „darum“ heißt Maß für Maß, und Amalek war es, der Lawan von Jaakows Flucht erzählte.',
  },
  audience: 'Gematria von einem bis vier Wörtern, Addition, Spiele mit ersten und letzten Buchstaben; eine bekannte Geschichte — der Traum von der Leiter, Jaakow am Brunnen, Rachel und Lea. Jüngere Kinder — zusammen mit einem Erwachsenen.',
  practice:
    'Bete diese Woche mindestens einmal zusammen mit anderen — in der Synagoge oder mit deiner Familie — und beginne einen Tag mit einem Gebet bei Tagesanbruch oder gleich nach dem Aufwachen: „Bei Tagesanbruch werden die Tore des Himmels geöffnet.“',
  highlight: '„Denn aus diesem Brunnen“ ergibt „Mosche“: In Jaakows Brunnen sieht der Baal HaTurim Mosche.',
  share: ({ score, max, time, grid, allSolved, site }) => `🪜 Was sah Jaakow auf der Leiter? Die Antwort steckt in der Gematria des Wortes „Leiter“.

Ich spiele ein Gematria-Spiel zum Kommentar des Baal HaTurim zu Wajeze. ${allSolved ? 'Alle vier Rätsel gelöst:' : 'Mein Weg bisher:'}

✦ ${score} von ${max} Punkten · ⏱ ${time}
${grid}

Vier Rätsel: bei wem Jaakow lernte und warum die Sonne zu früh erlosch, die Leiter — Sinai und das Ende der Exile, wessen Name am Brunnen versteckt ist, Liebesäpfel „wie ein Mensch“ und wer Lawan erzählte, dass Jaakow geflohen war. Schaffst du es besser?
Spiel mit 👉 ${site}

©mychitas.app`,
  source:
    'Nach dem Kommentar des Baal HaTurim (Rabbi Jaakow ben Ascher, 14. Jh.) zur Parascha Wajeze (Bereschit 28,10–32,3), Kurzfassung („Kizur Baal HaTurim“). Hebräischer Text — Sefaria; Übersetzung — Projekt Niflaot.',
};

export default de;
