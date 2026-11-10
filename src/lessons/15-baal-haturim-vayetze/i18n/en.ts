import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Baal HaTurim: Vayetzei',
  hero: {
    heading: 'Baal HaTurim: <i>four riddles about Yaakov’s journey</i>',
    author: 'after the commentary of the Baal HaTurim, Rabbi Yaakov ben Asher',
    intro:
      'The Baal HaTurim found hidden words and numbers in the portion of Vayetzei. Work them out yourself: with whom Yaakov studied on the way to Charan, why the sun set early, what Yaakov saw on the ladder, whose name is hidden at the well — and who told Lavan that Yaakov had fled.',
  },
  summary:
    'Vayetzei through the eyes of the Baal HaTurim: the last letters of “Yaakov from Beer-sheva” spell Ever, the first letters spell Shem; “and he went” = 66 = “on that very day”; “for the sun had set” — “it went out”; “place” three times — three festivals; “ladder” = 130 = “Sinai”, “and behold, a ladder” = “and the end”; the last letters of “and Yaakov awoke from his sleep and said” — “congregation”; “for from that well” = 345 = “Moshe”; “mandrakes” = “like a person”; “therefore” = “measure for measure”; “that he had fled” = 240 = “Amalek”.',
  glossary: {
    'ויצא': '“and he went out” — the name of the portion',
    'ויצא יעקב מבאר שבע': '“and Yaakov went out from Beer-sheva”',
    'יעקב מבאר שבע': '“Yaakov from Beer-sheva”',
    'מבאר שבע': '“from Beer-sheva”',
    'עבר': 'Ever — Shem’s great-grandson; Torah was studied in his house',
    'שם': 'Shem — Noach’s son',
    'וילך': '“and he went”',
    'וילך חרנה': '“and he went to Charan”',
    'בו ביום': '“on that very day”',
    'בלילה': '“at night”',
    'למחרת': '“the next day”',
    'אחר שנה': '“after a year”',
    'כי בא השמש': '“for the sun had set”',
    'כבה': '“it went out”',
    'מקום': '“place”',
    'ויפגע במקום': '“and he came upon the place”',
    'סלם': '“ladder”',
    'סלם מצב ארצה': '“a ladder set on the ground”',
    'והנה': '“and behold”',
    'והנה סלם': '“and behold, a ladder”',
    'סיני': 'Sinai — the mountain where the Torah was given',
    'מזבח': '“altar”',
    'הר': '“mountain”',
    'ירושלים': 'Yerushalayim',
    'וקץ': '“and the end”',
    'גלות': '“exile”',
    'שלום': '“peace”',
    'משיח': 'Moshiach',
    'וייקץ יעקב משנתו ויאמר': '“and Yaakov awoke from his sleep and said”',
    'צבור': '“congregation, a gathering of people”',
    'וידר יעקב נדר': '“and Yaakov made a vow”',
    'כי מן הבאר ההוא': '“for from that well”',
    'הבאר': '“the well”',
    'ההוא': '“that”',
    'משה': 'Moshe',
    'אהרן': 'Aharon',
    'מרים': 'Miriam',
    'יהושע': 'Yehoshua',
    'דודאים': '“mandrakes” — the plant Reuven found',
    'וימצא דודאים בשדה': '“and he found mandrakes in the field”',
    'כאדם': '“like a person”',
    'לחם': '“bread”',
    'עץ': '“tree”',
    'פרח': '“flower”',
    'לכן': '“therefore”',
    'לכן ישכב עמך הלילה': '“therefore he shall lie with you tonight” — Rachel’s words to Leah',
    'מדה במדה': '“measure for measure”',
    'כי ברח': '“that he had fled”',
    'כי ברח יעקב': '“that Yaakov had fled”',
    'עמלק': 'Amalek — a nation, an enemy of Israel',
    'לבן': 'Lavan',
    'פרעה': 'Pharaoh',
    'עשו': 'Esav',
  },
  translit: {
    'וילך': 'vayelech',
    'מקום': 'makom',
    'סלם': 'sulam',
    'והנה': 'vehineh',
    'הבאר': 'habe’er',
    'ההוא': 'hahu',
    'דודאים': 'duda’im',
    'לכן': 'lachen',
  },
  riddles: [
    {
      title: 'The road to Charan',
      cond: `<p>The Baal HaTurim — Rabbi Yaakov ben Asher (c. 1269–1343), author of the law code “Arba’ah Turim”. On every verse of the Torah he left short hints: gematriot, first and last letters of words, words that appear in Tanach only two or three times. The portion of Vayetzei begins:</p><p class="verse" dir="rtl" lang="he">ויצא יעקב מבאר שבע וילך חרנה</p><p>“And Yaakov went out from Beer-sheva and went to Charan.”<sup data-src="gen-28-10"></sup> Yaakov left his brother Esav, who wanted to kill him, and went to his uncle Lavan.</p><p class="verse" dir="rtl" lang="he">ויפגע במקום וילן שם כי בא השמש</p><p>“And he came upon the place and stayed there overnight, for the sun had set…”<sup data-src="gen-28-11"></sup></p>`,
      steps: [
        {
          q: 'Take the last letters of the words <span class="he">יעקב מבאר שבע</span> — “Yaakov from Beer-sheva”. The letters may be rearranged. Whose name do you get?',
          hint: 'The three-letter name of Shem’s great-grandson: the word “Ivri”, “Hebrew”, comes from it.',
        },
        {
          q: 'Now the first letters of the words <span class="he">מבאר שבע</span>. Whose name do you get? The letters may be rearranged.',
          hint: 'The two-letter name of Noach’s son.',
        },
        {
          q: 'What does the word <span class="he">וילך</span> — “and he went” — add up to?',
          hint: 'ו = 6, י = 10, ל = 30, ך = 20.',
        },
        {
          q: 'Which words equal this number — and tell us <b>when</b> Yaakov reached “the place”?',
          opts: ['“on that very day”', '“at night”', '“the next day”', '“after a year”'],
        },
        {
          q: 'Take the first letters of the words <span class="he">כי בא השמש</span> — “for the sun had set”. The letters may be rearranged. Which word do you get — and what happened to the sun?',
          hint: 'A three-letter word: “it went out”.',
        },
      ],
      reveal: {
        h: 'The sun went out early',
        p: 'The last letters of “Yaakov mi-Be’er Sheva” spell Ever, and the first letters of “mi-Be’er Sheva” spell Shem: Yaakov hid and studied in the house of Shem and Ever. “Vayelech”, “and he went”, = 66 = “bo bayom”, “on that very day”. And the first letters of “ki va hashemesh” spell “kavah”, “it went out”: the sun set before its time so that Yaakov would spend the night at that place.',
      },
      lessons: [
        {
          h: 'In the house of Shem and Ever',
          b: `<p>The last letters of <span class="he">יעקב מבאר שבע</span>: ב, ר, ע — <span class="he">עבר</span>, Ever.<sup data-src="bht-28-10-3"></sup> The first letters of <span class="he">מבאר שבע</span>: מ, ש — <span class="he">שם</span>, Shem.<sup data-src="bht-28-10-6"></sup></p><p>Rashi tells how many years Yaakov studied with Ever — and that all those years he did not lie down to sleep at night.<sup data-src="rashi-28-11-5"></sup></p><p class="expl"><b>Explanation.</b> Before going to the house of Lavan the cheat, Yaakov gathered strength in the house of study. Torah learned in advance guards a person where life is hard.</p>`,
        },
        {
          h: 'On that very day',
          b: `<p><span class="he">וילך</span> = 6 + 10 + 30 + 20 = 66; <span class="he">בו ביום</span> = 8 + 58 = 66.<sup data-src="bht-28-10-7"></sup></p><p class="expl"><b>Explanation.</b> It is far from Beer-sheva to “the place” — Mount Moriah — yet Yaakov arrived there that same day: the road itself “shrank” before him. When a person goes where he needs to be, G-d helps him on the way.</p>`,
        },
        {
          h: 'The sun went out',
          b: `<p>The first letters of <span class="he">כי בא השמש</span>: כ, ב, ה — <span class="he">כבה</span>, “it went out”.<sup data-src="bht-28-11-2"></sup></p><p>Rashi explains why the Torah does not simply say “and the sun set”.<sup data-src="rashi-28-11-3"></sup></p><p class="expl"><b>Explanation.</b> Yaakov wanted to go on — but G-d “put out” the sun, so that he would stay the night at the holy place and dream there. Sometimes a stop on the way is not an obstacle but a gift.</p>`,
        },
      ],
      reflection: 'Yaakov first studied and only then went to a hard place. What can I “take with me on the road” — learn or prepare in advance?',
      takeaways: [
        'The last letters of “יעקב מבאר שבע” — עבר, the first letters of “מבאר שבע” — שם: Yaakov studied in the house of Shem and Ever.',
        'וילך = 66 = בו ביום: he reached “the place” on that very day.',
        'The first letters of “כי בא השמש” — כבה: the sun went out before its time.',
      ],
    },
    {
      title: 'The ladder',
      cond: `<p>Look again at the verse about Yaakov’s night:</p><p class="verse" dir="rtl" lang="he">ויפגע במקום וילן שם כי בא השמש ויקח מאבני המקום וישם מראשתיו וישכב במקום ההוא</p><p>“And he came upon the place and stayed there overnight, for the sun had set; and he took of the stones of the place and put them under his head, and lay down in that place.”<sup data-src="gen-28-11"></sup> And Yaakov dreamed:</p><p class="verse" dir="rtl" lang="he">ויחלם והנה סלם מצב ארצה וראשו מגיע השמימה</p><p>“And he dreamed, and behold, a ladder set on the ground, and its top reached heaven, and behold, angels of G-d going up and down on it.”<sup data-src="gen-28-12"></sup></p>`,
      steps: [
        {
          q: 'How many times does the first verse say <span class="he">מקום</span> — “place” (with prefixes: במקום, המקום)?',
          hint: 'Look at the beginning, the middle and the end of the verse.',
        },
        {
          q: 'What does the word <span class="he">סלם</span> — “ladder” — add up to? In the Torah it is written without ו.',
          hint: 'ס = 60, ל = 30, ם = 40.',
        },
        {
          q: 'Which word equals this number — and tells us what else G-d showed Yaakov on the ladder?',
          opts: ['Sinai', '“altar”', '“mountain”', 'Yerushalayim'],
        },
        {
          q: 'And what do both words <span class="he">והנה סלם</span> — “and behold, a ladder” — add up to?',
          hint: 'והנה = 6 + 5 + 50 + 5; add the “ladder”.',
        },
        {
          q: 'Which word equals this number?',
          opts: ['“and the end”', '“exile”', '“peace”', 'Moshiach'],
        },
      ],
      reveal: {
        h: 'Sinai and the end of the exiles',
        p: '“Place” appears three times in the verse: a hint to the three festivals on which Yaakov’s children would go up to the Temple at that place. “Sulam”, “ladder”, = 130 = “Sinai”: G-d showed Yaakov how his children would stand at Mount Sinai. And “vehineh sulam”, “and behold, a ladder”, = 196 = “vakeitz”, “and the end”: He showed him when the exiles would end.',
      },
      lessons: [
        {
          h: 'Three times “place”',
          b: `<p>In the verse: <span class="he">במקום</span>, <span class="he">המקום</span>, <span class="he">במקום</span> — three times.<sup data-src="bht-28-11-1"></sup> Three festivals — Pesach, Shavuot and Sukkot, when all Israel went up to the Temple in Yerushalayim.</p><p class="expl"><b>Explanation.</b> The stone on which Yaakov slept lay where the Temple would later stand. One night of our forefather — and thousands of festival pilgrimages of his children.</p>`,
        },
        {
          h: 'Ladder — Sinai',
          b: `<p><span class="he">סלם</span> = 60 + 30 + 40 = 130; <span class="he">סיני</span> = 60 + 10 + 50 + 10 = 130.<sup data-src="bht-28-12-6"></sup></p><p class="expl"><b>Explanation.</b> The ladder stands on the ground, and its top reaches heaven. So does the Torah given at Sinai: it lives on earth, in everyday things — and lifts a person up to heaven.</p>`,
        },
        {
          h: 'And the end',
          b: `<p><span class="he">והנה</span> = 6 + 5 + 50 + 5 = 66; <span class="he">והנה סלם</span> = 66 + 130 = 196; <span class="he">וקץ</span> = 6 + 100 + 90 = 196.<sup data-src="bht-28-12-5"></sup></p><p class="expl"><b>Explanation.</b> The angels went up and down — kingdoms come and go. But Yaakov also saw the end: every exile has a limit. So even in hard times one need not lose hope.</p>`,
        },
      ],
      reflection: 'The ladder stands on the ground and reaches heaven. Which ordinary thing can I do today so that it becomes a “rung” upward?',
      takeaways: [
        '“Place” three times in the verse: the three festivals of going up to the Temple.',
        'סלם = 130 = סיני: on the ladder Yaakov saw the standing at Mount Sinai.',
        'והנה סלם = 196 = וקץ: G-d showed him the end of the exiles.',
      ],
    },
    {
      title: 'Moshe’s well',
      cond: `<p>Yaakov woke up:</p><p class="verse" dir="rtl" lang="he">וייקץ יעקב משנתו ויאמר אכן יש ה׳ במקום הזה</p><p>“And Yaakov awoke from his sleep and said: Surely the L-rd is in this place, and I did not know!”<sup data-src="gen-28-16"></sup> He went on, to the east, and came to a well:</p><p class="verse" dir="rtl" lang="he">כי מן הבאר ההוא ישקו העדרים</p><p>“And he looked, and behold, a well in the field, and three flocks of sheep lying beside it, for from that well they watered the flocks; and the stone on the mouth of the well was large.”<sup data-src="gen-29-2"></sup></p>`,
      steps: [
        {
          q: 'Take the last letters of the words <span class="he">וייקץ יעקב משנתו ויאמר</span> — “and Yaakov awoke from his sleep and said”. The letters may be rearranged. Which word do you get?',
          hint: 'A four-letter word: “congregation, a gathering of people”. The final ץ is the same letter as צ.',
        },
        {
          q: 'What do the words <span class="he">כי מן הבאר ההוא</span> — “for from that well” — add up to?',
          hint: 'כי = 30, מן = 90, הבאר = 208, ההוא = 17.',
        },
        {
          q: 'Whose name equals this number?',
          opts: ['Moshe', 'Aharon', 'Miriam', 'Yehoshua'],
        },
      ],
      reveal: {
        h: 'Moshe’s well',
        p: 'The last letters of “vayikatz Yaakov mishnato vayomer” spell “tzibbur”, “congregation”: a person’s prayer is heard best together with a congregation. And “ki min habe’er hahu”, “for from that well”, = 345 = “Moshe”: in the well where Yaakov met Rachel, the Baal HaTurim sees Moshe — he too would meet his wife at a well and water the flock.',
      },
      lessons: [
        {
          h: 'Prayer with a congregation',
          b: `<p>The last letters of <span class="he">וייקץ יעקב משנתו ויאמר</span>: ץ, ב, ו, ר — <span class="he">צבור</span>, “congregation”.<sup data-src="bht-28-16-1"></sup></p><p class="expl"><b>Explanation.</b> Yaakov prayed at that place alone — yet from his words the Baal HaTurim teaches that prayer is heard best with a congregation. One voice may get lost, but many voices together rise up, as on a ladder.</p>`,
        },
        {
          h: 'From that well',
          b: `<p><span class="he">כי</span> = 30, <span class="he">מן</span> = 90, <span class="he">הבאר</span> = 208, <span class="he">ההוא</span> = 17; together 30 + 90 + 208 + 17 = 345; <span class="he">משה</span> = 40 + 300 + 5 = 345.<sup data-src="bht-29-2-4"></sup></p><p>Yaakov met Rachel at the well and rolled away the large stone by himself. Many years later Moshe, having fled Egypt, also sat by a well in Midian, stood up for Yitro’s daughters and watered their flock.</p><p class="expl"><b>Explanation.</b> A well is a place of meeting and of caring: both Yaakov and Moshe began a new life by helping others water their sheep.</p>`,
        },
      ],
      reflection: 'At the well Yaakov and Moshe first helped others. Whom can I help today — even if it isn’t my job?',
      takeaways: [
        'The last letters of “וייקץ יעקב משנתו ויאמר” — צבור: prayer is heard best with a congregation.',
        'כי מן הבאר ההוא = 345 = משה: Yaakov’s well hints at Moshe.',
      ],
    },
    {
      title: 'Mandrakes and a flight',
      cond: `<p>Sons were born to Yaakov. One day the eldest, Reuven, found mandrakes in the field:</p><p class="verse" dir="rtl" lang="he">וימצא דודאים בשדה</p><p>“And Reuven went in the days of the wheat harvest and found mandrakes in the field, and brought them to Leah his mother.” Rachel asked Leah for them — and said to her:</p><p class="verse" dir="rtl" lang="he">לכן ישכב עמך הלילה תחת דודאי בנך</p><p>“Therefore he shall lie with you tonight, in return for your son’s mandrakes.”<sup data-src="gen-30-14"></sup> Twenty years passed. Yaakov left Lavan with his whole family without telling him:</p><p class="verse" dir="rtl" lang="he">ויגד ללבן ביום השלישי כי ברח יעקב</p><p>“And it was told to Lavan on the third day that Yaakov had fled.”<sup data-src="gen-31-22"></sup></p>`,
      steps: [
        {
          q: 'What does the word <span class="he">דודאים</span> — “mandrakes” — add up to?',
          hint: 'ד = 4, ו = 6, ד = 4, א = 1, י = 10, ם = 40.',
        },
        {
          q: 'Which word equals this number — and tells us what the mandrake root looks like?',
          opts: ['“like a person”', '“bread”', '“tree”', '“flower”'],
        },
        {
          q: 'Rachel said <span class="he">לכן</span> — “therefore”. What does this word add up to?',
          hint: 'ל = 30, כ = 20, ן = 50.',
        },
        {
          q: 'What do the words <span class="he">כי ברח</span> — “that he had fled” — add up to?',
          hint: 'כי = 30, ברח = 2 + 200 + 8.',
        },
        {
          q: 'The Baal HaTurim: someone told Lavan that Yaakov had fled. Whose name equals this number?',
          opts: ['Amalek', 'Lavan', 'Pharaoh', 'Esav'],
        },
      ],
      reveal: {
        h: 'Measure for measure',
        p: '“Duda’im”, “mandrakes”, = 65 = “ke’adam”, “like a person”. “Lachen”, “therefore”, = 100 = “middah k’neged middah”, “measure for measure”: Rachel gave up a night with Yaakov to Leah for the mandrakes — measure for measure. And “ki varach”, “that he had fled”, = 240 = “Amalek”: it was Amalek who told Lavan of Yaakov’s flight — and later he would tell Pharaoh of Israel’s flight.',
      },
      lessons: [
        {
          h: 'Like a person',
          b: `<p>Rashi says why the Torah mentions that it was “in the days of the wheat harvest”.<sup data-src="rashi-30-14-1"></sup></p><p><span class="he">דודאים</span> = 4 + 6 + 4 + 1 + 10 + 40 = 65; <span class="he">כאדם</span> = 20 + 1 + 4 + 40 = 65.<sup data-src="bht-30-14"></sup> The mandrake root really does look like a little human figure.</p><p>In the same place the Baal HaTurim notes: of the names of the twelve tribes, the letter ס appears only in <span class="he">יוסף</span>, and the letter ע only in <span class="he">שמעון</span>.</p><p class="expl"><b>Explanation.</b> Reuven was still a boy — and yet in the field he took only what belonged to no one, not someone else’s wheat. His gift to his mother was an honest one.</p>`,
        },
        {
          h: 'Measure for measure',
          b: `<p><span class="he">לכן</span> = 30 + 20 + 50 = 100; <span class="he">מדה במדה</span> = 49 + 51 = 100.<sup data-src="bht-30-15-2"></sup></p><p>The Baal HaTurim also explains Leah’s words: on bearing Levi, her third son, she said “for I have borne him three”, and on bearing Zevulun, her sixth, “for I have borne him six”: Yaakov would have twelve sons from four wives — three for each — and she had two shares.</p><p class="expl"><b>Explanation.</b> Measure for measure — this is how G-d runs the world: every deed returns to a person in the same “size”. So even small decisions are worth weighing.</p>`,
        },
        {
          h: 'Who told Lavan',
          b: `<p>The words <span class="he">כי ברח</span> appear twice in Tanach: “that Yaakov had fled” and “that the people had fled” (Exodus 14:5).<sup data-src="bht-31-22-1"></sup> <span class="he">כי ברח</span> = 30 + 210 = 240; <span class="he">עמלק</span> = 70 + 40 + 30 + 100 = 240.<sup data-src="bht-31-22-2"></sup></p><p class="expl"><b>Explanation.</b> Both Lavan and Pharaoh were “stirred up” against Israel by the same Amalek. An enemy looks for a reason to attack — and both times G-d saved His people.</p>`,
        },
      ],
      reflection: '“Measure for measure”: my deeds come back to me. Which good deed do I want to “sow” today?',
      takeaways: [
        'דודאים = 65 = כאדם: the mandrake root looks like a person.',
        'לכן = 100 = מדה במדה: every deed returns measure for measure.',
        'כי ברח = 240 = עמלק: Amalek told Lavan that Yaakov had fled.',
      ],
    },
  ],
  memo: {
    intro:
      'Twelve comments of the Baal HaTurim on the portion of Vayetzei — twelve pairs of cards. Each picture tells about one comment, and its pair is the Torah words the comment is about.',
    items: [
      {
        title: 'Ever’s house of study',
        caption: 'A scroll and an oil lamp',
        verse: '“and Yaakov went out from Beer-sheva”',
        quote: '“Yaakov from Beer-sheva” — the last letters spell “Ever”: he was hidden in the house of Ever.',
        explain:
          'The last letters of the words יעקב מבאר שבע: ב, ר, ע — עבר, Ever. Before coming to Lavan, Yaakov studied Torah for fourteen years in the house of Ever — and, as Rashi says, all those years he did not lie down to sleep at night.',
        moral: 'On a hard road, take Torah with you.',
      },
      {
        title: 'On that very day',
        caption: 'A road and the sun high up',
        verse: '“and he went to Charan”',
        quote: '“And he went” — in gematria “on that very day”.',
        explain:
          'The word וילך = 66, and בו ביום (“on that very day”) = 66. The way was long, but Yaakov reached the holy place that same day: the road “shrank” before him.',
        moral: 'Whoever walks the right road, G-d helps on the way.',
      },
      {
        title: 'Three times “place”',
        caption: 'Three pilgrims walk to a mountain',
        verse: '“and he came upon the place”',
        quote: '“Place” is written three times in the verse — a hint to the three festivals on which his children would go up to that place.',
        explain:
          'In verse 28:11 the word “place” appears three times. The Temple would stand at this place, and three times a year — on Pesach, Shavuot and Sukkot — all Israel would go up there.',
        moral: 'One night of our forefather became a road for his children.',
      },
      {
        title: 'The sun went out',
        caption: 'The sun behind the mountains',
        verse: '“for the sun had set”',
        quote: '“For the sun had set” — the first letters spell “it went out”: the light of the sun went out before its time.',
        explain:
          'The first letters of the words כי בא השמש: כ, ב, ה — כבה, “it went out”. The sun set early so that Yaakov would spend the night at the holy place and dream of the ladder.',
        moral: 'A stop on the way can be a gift.',
      },
      {
        title: 'The ladder and Sinai',
        caption: 'A ladder up to the clouds',
        verse: '“a ladder set on the ground”',
        quote: '“Ladder” — in gematria “Sinai”: He showed him the standing at Mount Sinai.',
        explain:
          'The word סלם = 130, and סיני = 130. The ladder stands on the ground and its top reaches heaven — like the Torah given at Sinai.',
        moral: 'The Torah joins earth and heaven.',
      },
      {
        title: 'The end of the exiles',
        caption: 'Steps, and dawn at the top',
        verse: '“and behold, a ladder”',
        quote: '“And behold, a ladder” — in gematria “and the end”: He showed him the ends of the exiles.',
        explain:
          'והנה סלם = 66 + 130 = 196, and וקץ (“and the end”) = 196. The angels went up and down, like kingdoms that come and go. But every exile has an end.',
        moral: 'Even in hard times, don’t lose hope.',
      },
      {
        title: 'Prayer is stronger together',
        caption: 'People praying together',
        verse: '“and Yaakov awoke from his sleep and said”',
        quote: 'The last letters spell “congregation”: a person’s prayer is heard best with a congregation.',
        explain:
          'The last letters of the words וייקץ יעקב משנתו ויאמר: ץ, ב, ו, ר — צבור, “congregation”. Many voices together are heard better than one.',
        moral: 'It is better to pray together.',
      },
      {
        title: 'The first vow',
        caption: 'A stone pillar and a jug of oil',
        verse: '“and Yaakov made a vow”',
        quote: '“And he vowed” — the first who made a vow was Yaakov.',
        explain:
          'The word וידר (“and he vowed”) appears three times in Tanach: about Yaakov, about Israel and about Yiftach. Yaakov was the first to promise G-d: if You are with me, I will give a tenth. So in Tehillim G-d is called “the Mighty One of Yaakov”.',
        moral: 'A good promise made from the heart moves a person forward.',
      },
      {
        title: 'Moshe’s well',
        caption: 'A well and a flock of sheep',
        verse: '“for from that well”',
        quote: '“For from that well” — in gematria “Moshe”.',
        explain:
          'כי מן הבאר ההוא = 30 + 90 + 208 + 17 = 345, and משה = 345. Yaakov met Rachel at a well; many years later Moshe too would meet his wife at a well and water the flock.',
        moral: 'A new life begins with helping others.',
      },
      {
        title: 'Like a person',
        caption: 'A mandrake with its root',
        verse: '“and he found mandrakes in the field”',
        quote: '“Mandrakes” — in gematria “like a person”.',
        explain:
          'The word דודאים = 65, and כאדם (“like a person”) = 65: the mandrake root looks like a little human figure. Reuven found them at harvest time — and took what belonged to no one, not someone else’s wheat.',
        moral: 'A gift should be honest.',
      },
      {
        title: 'Measure for measure',
        caption: 'Scales with two pans',
        verse: '“therefore he shall lie with you tonight”',
        quote: '“Therefore” — in gematria “measure for measure”.',
        explain:
          'The word לכן = 100, and מדה במדה = 100. Rachel gave Leah a night with Yaakov in return for the mandrakes. Measure for measure: every deed comes back to a person.',
        moral: 'Every deed comes back measure for measure.',
      },
      {
        title: 'Who told Lavan',
        caption: 'A messenger runs through the desert',
        verse: '“that Yaakov had fled”',
        quote: '“That he had fled” — in gematria “Amalek”.',
        explain:
          'כי ברח = 30 + 210 = 240, and עמלק = 240. The Midrash says: Amalek told Lavan that Yaakov had fled, and later told Pharaoh that Israel had fled. Both times G-d saved His people.',
        moral: 'An enemy looks for a reason, but G-d protects.',
      },
    ],
  },
  daily: {
    intro:
      'The portion of Vayetzei day by day: two comments of the Baal HaTurim a day, from Sunday to Friday. The verse, the Baal HaTurim’s words in Hebrew with a translation, and an explanation — about five minutes.',
    items: [
      {
        h: 'Shem, Ever and “on that very day”',
        b: '<p>The last letters of <span class="he">יעקב מבאר שבע</span>: ב, ר, ע — <span class="he">עבר</span>; the first letters of <span class="he">מבאר שבע</span>: מ, ש — <span class="he">שם</span>. <span class="he">וילך</span> = 6 + 10 + 30 + 20 = 66 = <span class="he">בו ביום</span>.</p><p>Rashi: for fourteen years Yaakov studied in the house of Ever and all those years did not lie down to sleep at night. And he reached “the place”, Mount Moriah, that same day: the road “shrank” before him.</p><p class="expl"><b>Explanation.</b> First study, then a hard road. Torah learned in advance guards a person on the way.</p>',
      },
      {
        h: 'Three times “place”',
        b: '<p>The word “place” appears three times in the verse: <span class="he">במקום</span>, <span class="he">המקום</span>, <span class="he">במקום</span> — a hint to the three festivals, Pesach, Shavuot and Sukkot, when Yaakov’s children would go up to this place, the Temple. The first letters of <span class="he">כי בא השמש</span>: כ, ב, ה — <span class="he">כבה</span>, “it went out”.</p><p>Rashi: the sun set for him suddenly, before its time, so that he would spend the night at that place.</p><p class="expl"><b>Explanation.</b> Yaakov wanted to go on, but G-d stopped him — and it was that very night that he saw the ladder.</p>',
      },
      {
        h: 'The ladder: Sinai and the end of the exiles',
        b: '<p><span class="he">סלם</span> = 60 + 30 + 40 = 130 = <span class="he">סיני</span>. <span class="he">והנה סלם</span> = 66 + 130 = 196 = <span class="he">וקץ</span>.</p><p>G-d showed Yaakov the standing at Mount Sinai — and the ends of the exiles. In the Torah the word “ladder” is written without ו — and so the count works out.</p><p class="expl"><b>Explanation.</b> The ladder stands on the ground and reaches heaven: the Torah lives in everyday things and lifts a person up. And every exile has an end.</p>',
      },
      {
        h: 'A congregation and learning in a dream',
        b: '<p>The last letters of <span class="he">וייקץ יעקב משנתו ויאמר</span>: ץ, ב, ו, ר — <span class="he">צבור</span>, “congregation”: a person’s prayer is heard best with a congregation.</p><p>And more: <span class="he">משנתו</span>, “from his sleep”, can be read “mi-mishnato” — “from his learning”: by day Yaakov thought about the Torah, and even in his dream his heart did not stop thinking about it.</p><p class="expl"><b>Explanation.</b> What a person thinks about by day, he sees at night. Good thoughts by day — good dreams at night.</p>',
      },
      {
        h: 'The gates of heaven at dawn',
        b: '<p>“And this is the gate of heaven”, and right after it: “and Yaakov rose early in the morning”. The Baal HaTurim: at dawn the gates of heaven are opened, and it is a good time for prayer.</p><p class="expl"><b>Explanation.</b> Morning is the beginning of the day. Whoever begins the day with prayer enters it through open “gates”.</p>',
      },
      {
        h: 'The first vow',
        b: '<p>The word <span class="he">וידר</span>, “and he vowed”, appears three times in Tanach: “and Yaakov vowed”, “and Israel vowed”, “and Yiftach vowed”. The righteous made vows, and the first was Yaakov. So it says: “who swore to the L-rd, vowed to the Mighty One of Yaakov” (Psalms 132:2).</p><p>Yaakov promised: if G-d is with him on the way, gives him bread and clothing and he returns in peace — the stone will become a house of G-d, and of all he has he will give a tenth.</p><p class="expl"><b>Explanation.</b> Yaakov asked for little — bread and clothing — and promised generously. That is how to ask of G-d: modestly for oneself, generously for others.</p>',
      },
      {
        h: 'Moshe’s well',
        b: '<p>“And behold, a well in the field” — a hint to the well that Israel had in the wilderness. <span class="he">כי מן הבאר ההוא</span> = 30 + 90 + 208 + 17 = 345 = <span class="he">משה</span>.</p><p>In this story (Genesis 29:1–10) the word “well” appears seven times. The well in the wilderness went with Israel for forty years; and Moshe, like Yaakov, met his wife at a well.</p><p class="expl"><b>Explanation.</b> A well gives water to all who come. So were Yaakov and Moshe: their strength lay in giving to others.</p>',
      },
      {
        h: 'Lavan’s embrace',
        b: '<p>“And he embraced him and kissed him”: the Baal HaTurim explains why Lavan was in such a hurry. First he embraced Yaakov to check whether he had coins on his belt, and finding none, kissed him to check whether he had a precious stone in his mouth.</p><p class="expl"><b>Explanation.</b> A warm embrace can also be calculated. What matters is not only what a person does, but why.</p>',
      },
      {
        h: 'Mandrakes',
        b: '<p><span class="he">דודאים</span> = 4 + 6 + 4 + 1 + 10 + 40 = 65 = <span class="he">כאדם</span>, “like a person”: the mandrake root looks like a little human figure.</p><p>The Baal HaTurim also notes: of the names of the tribes, the letter ס appears only in Yosef’s name — he is Esav’s adversary — and the letter ע only in Shimon’s.</p><p class="expl"><b>Explanation.</b> Reuven brought his mother a gift from the field at harvest time — and took only what belonged to no one (Rashi). An honest gift is worth more than an expensive one.</p>',
      },
      {
        h: 'Measure for measure',
        b: '<p><span class="he">לכן</span> = 30 + 20 + 50 = 100 = <span class="he">מדה במדה</span>.</p><p>Rachel gave Leah a night with Yaakov in return for the mandrakes — measure for measure. The Baal HaTurim also explains Leah’s words: about Levi — “I have borne him three”, about Zevulun — “six”: twelve tribes from four wives — three each, and she had two shares.</p><p class="expl"><b>Explanation.</b> This is how G-d runs the world: every deed returns to a person in the same size.</p>',
      },
      {
        h: 'Who told Lavan',
        b: '<p><span class="he">כי ברח</span> = 30 + 210 = 240 = <span class="he">עמלק</span>.</p><p>These words appear twice in Tanach: “that Yaakov had fled” and “that the people had fled” (Exodus 14:5). The Midrash: Amalek told Lavan of Yaakov’s flight and Pharaoh of Israel’s flight.</p><p class="expl"><b>Explanation.</b> An enemy looks for a way to harm — but G-d stopped both Lavan and Pharaoh.</p>',
      },
      {
        h: 'Machanayim',
        b: '<p>Yaakov returned to the Land of Israel, and angels of G-d met him. He named that place <span class="he">מחנים</span>, “two camps”. The Baal HaTurim reads this word as a notarikon: “me’otam chayalim natal Yaakov mal’achim” — “from those soldiers Yaakov took angels”.</p><p class="expl"><b>Explanation.</b> Angels escorted Yaakov on his way — and met him when he returned. Whoever walks with G-d never walks alone.</p>',
      },
    ],
  },
  final: {
    title: 'A ladder to heaven',
    allSolved:
      'All four riddles are solved. Yaakov studied in the house of Shem and Ever and reached “the place” on that very day, and the sun went out before its time; “place” three times, like the three festivals; the ladder = Sinai, “and behold, a ladder” = “and the end” of the exiles; prayer is heard with a congregation, and Yaakov’s well hints at Moshe; mandrakes are “like a person”, “therefore” is measure for measure, and it was Amalek who told Lavan that Yaakov had fled.',
  },
  audience: 'Gematria of one to four words, addition, games with first and last letters; a familiar story — the dream of the ladder, Yaakov at the well, Rachel and Leah. Younger children — together with an adult.',
  practice:
    'This week, pray together with others at least once — in the synagogue or with your family — and begin one day with prayer at dawn or right after waking: “at dawn the gates of heaven are opened”.',
  highlight: '“For from that well” equals “Moshe”: in Yaakov’s well the Baal HaTurim sees Moshe.',
  share: ({ score, max, time, grid, allSolved, site }) => `🪜 What did Yaakov see on the ladder? The answer is in the gematria of the word “ladder”.

I’m playing a gematria game on the commentary of the Baal HaTurim on Vayetzei. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: with whom Yaakov studied and why the sun went out early, the ladder — Sinai and the end of the exiles, whose name is hidden at the well, mandrakes “like a person” and who told Lavan that Yaakov had fled. Can you do better?
Play 👉 ${site}

©mychitas.app`,
  source:
    'After the commentary of the Baal HaTurim (Rabbi Yaakov ben Asher, 14th century) on the portion of Vayetzei (Genesis 28:10–32:3), the short version (“Kitzur Baal HaTurim”). Hebrew text — Sefaria; translation — the Niflaot project.',
};

export default en;
