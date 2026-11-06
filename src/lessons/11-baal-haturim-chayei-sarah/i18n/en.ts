import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Baal HaTurim: Chayei Sarah',
  hero: {
    heading: 'Baal HaTurim: <i>four riddles about Sarah’s tent</i>',
    author: 'based on the commentary of the Baal HaTurim, Rabbi Yaakov ben Asher',
    intro:
      'The Baal HaTurim found hidden words and numbers in Parshat Chayei Sarah. Work them out yourself: which “sun” is hidden in Sarah’s years, what the Cave of Machpelah cost, what Avraham’s servant swore by and what he asked for at the well, and how Rivkah came into Sarah’s tent.',
  },
  summary:
    'Chayei Sarah through the eyes of the Baal HaTurim: “Sarah — a hundred years” — the first letters spell “sun,” “and were” = Sarah’s 37 main years, “to Efron” = 400 = “an evil eye,” “and the field of Efron passed” — Esav, “please, your hand” = “circumcision,” water and blood in the prayer at the well, “with this man” — Moshe, “become” = “so,” “and he brought her” = 24.',
  glossary: {
    'חיי שרה': '“the life of Sarah” — the name of the parshah',
    'שרה': 'Sarah',
    'מאה': '“a hundred”',
    'שנה': '“year”',
    'שרה מאה שנה': '“Sarah — a hundred years” — from the first verse of the parshah',
    'שמש': 'shemesh — the sun',
    'רבקה': 'Rivkah',
    'רחל': 'Rachel',
    'לאה': 'Leah',
    'מלכה': 'Milkah — Betuel’s mother',
    'ויהיו': '“and were” — the first word of the parshah',
    'ויהיו חיי שרה': '“and the life of Sarah was” — the beginning of the parshah',
    'עפרון': 'Efron — the full spelling of the name',
    'עפרן': 'Efron — without ו: so it is written when Avraham weighs out the silver',
    'לעפרן': '“to Efron” — written without ו',
    'עין רע': '“an evil eye” — stinginess, begrudging others',
    'עין טובה': '“a good eye” — generosity',
    'לב טוב': '“a good heart”',
    'יד פתוחה': '“an open hand”',
    'ויקם שדה עפרון': '“and the field of Efron passed” — to Avraham',
    'עשו': 'Esav — Yaakov’s twin brother',
    'נא': '“please”',
    'ידך': '“your hand”',
    'נא ידך': '“please, your hand”',
    'שים נא ידך': '“place, please, your hand” — this is how Avraham made his servant swear',
    'מילה': 'milah — circumcision',
    'ברית': 'brit — covenant',
    'שבועה': 'an oath',
    'תפלין': 'tefillin',
    'עם אדני אברהם': '“to my master Avraham” — from the servant’s prayer at the well',
    'חסד': 'chesed — kindness',
    'חסד עם אדני אברהם': '“kindness to my master Avraham”',
    'מים': 'mayim — water',
    'דמים': 'damim — blood',
    'ד': 'the letter dalet',
    'ובה אדע': '“and by her I will know” — from the servant’s prayer at the well',
    'עם האיש הזה': '“with this man” — Rivkah was asked: “Will you go with this man?”',
    'משה': 'Moshe',
    'את היי': '“you — become” — from the blessing for Rivkah',
    'היי': '“become” (in the blessing for Rivkah)',
    'כה': '“so” — “so shall your offspring be”',
    'אלף': '“a thousand”',
    'רב': '“many”',
    'זרע': '“offspring”',
    'לשוח בשדה': '“to meditate in the field” — Yitzchak went out into the field toward evening',
    'ויבאה': '“and he brought her” — here without the second י',
    'ויביאה': '“and he brought her” — the full spelling, with two יs',
    'ויבאה יצחק האהלה': '“and Yitzchak brought her into the tent”',
  },
  translit: {
    'ויהיו': 'vayihyu',
    'עפרן': 'Efron',
    'נא': 'na',
    'ידך': 'yadcha',
    'היי': 'hayi',
    'ויבאה': 'vayevi’eha',
  },
  riddles: [
    {
      title: 'Sarah’s sun',
      cond: `<p>The Baal HaTurim is Rabbi Yaakov ben Asher (c. 1269–1343), author of the law code <i>Arba’ah Turim</i>. On every verse of the Torah he left short hints: gematria, the first and last letters of words, and words that appear in Tanakh only two or three times. Parshat Chayei Sarah begins like this:</p><p class="verse" dir="rtl" lang="he">ויהיו חיי שרה מאה שנה ועשרים שנה ושבע שנים שני חיי שרה</p><p>“And the life of Sarah was a hundred years and twenty years and seven years — the years of the life of Sarah.”<sup data-src="gen-23-1"></sup></p>`,
      steps: [
        {
          q: 'The Baal HaTurim takes the first letters of the words <span class="he">שרה מאה שנה</span> — “Sarah — a hundred years.” You may rearrange the letters. Which word comes out?',
          hint: 'A three-letter word: what rises every morning and sets every evening.',
        },
        {
          q: 'Right before this parshah, at the end of Vayeira, the Torah says: “And Betuel fathered…” The Baal HaTurim: before Sarah’s “sun” set, this girl’s sun had already risen. Who is she?',
          opts: ['Rivkah', 'Rachel', 'Leah', 'Milkah'],
        },
        {
          q: 'The parshah begins with the word <span class="he">ויהיו</span> — “and were.” What does it add up to?',
          hint: 'ו = 6, י = 10, ה = 5.',
        },
        {
          q: 'Sarah was 90 when Yitzchak was born, and she lived to 127. How many years did Sarah live after Yitzchak was born?',
          hint: '127 − 90.',
        },
      ],
      reveal: {
        h: 'One sun sets — another rises',
        p: 'The first letters of “Sarah me’ah shanah” spell שמש, “sun”: before Sarah’s sun set, Rivkah’s sun rose. And “vayihyu” = 37 — the years Sarah lived after Yitzchak was born: these were her main years.',
      },
      lessons: [
        {
          h: 'The sun sets — the sun rises',
          b: `<p>The first letters of <span class="he">שרה מאה שנה</span>: ש, מ, ש — <span class="he">שמש</span>, “sun.”<sup data-src="bht-23-1"></sup> The Baal HaTurim quotes a verse from Kohelet: “The sun rises, and the sun sets.”<sup data-src="ecclesiastes-1-5"></sup></p><p>And the last words of the previous parshah are about the family of Avraham’s brother: “And Betuel fathered Rivkah.”<sup data-src="gen-22-23"></sup> Rivkah will become Yitzchak’s wife and the mistress of Sarah’s tent.</p><p class="expl"><b>Explanation.</b> The world is never left without the righteous: before one departs, the one who will continue the work has already been born.</p>`,
        },
        {
          h: 'Thirty-seven main years',
          b: `<p><span class="he">ויהיו</span> = 6 + 10 + 5 + 10 + 6 = 37.<sup data-src="bht-23-1"></sup></p><p>When G-d promised Avraham a son, he wondered: “Can Sarah, ninety years old, give birth?”<sup data-src="gen-17-17"></sup> 127 − 90 = 37: exactly that many years Sarah lived beside her son.</p><p class="expl"><b>Explanation.</b> The main years of life are the years in which a person raises those who will continue his path.</p>`,
        },
      ],
      reflection: 'Sarah lived so that after her a new sun “rose” — Rivkah. To whom can I pass on today something good that I have learned?',
      takeaways: [
        'The first letters of “שרה מאה שנה” spell שמש, the sun.',
        'Before Sarah’s sun set, Rivkah’s sun rose.',
        'ויהיו = 37 = 127 − 90: Sarah’s main years — from Yitzchak’s birth.',
      ],
    },
    {
      title: 'The price of the cave',
      cond: `<p>Sarah died in Chevron. Avraham wanted to bury her in the Cave of Machpelah and bought the field with the cave from Efron the Hittite. Efron spoke much and nicely, but when it came to the price, he named a huge sum. And the Torah says:</p><p class="verse" dir="rtl" lang="he">וישקל אברהם לעפרן את הכסף</p><p>“And Avraham weighed out to Efron the silver he had named in the hearing of the children of Chet — four hundred shekels of silver at the merchants’ rate.”<sup data-src="gen-23-16"></sup></p>`,
      steps: [
        {
          q: 'At first Efron’s name is written in full, <span class="he">עפרון</span>, but here, when Avraham weighs out the silver, it is written without ו: <span class="he">עפרן</span>. What does this word add up to?',
          hint: 'ע = 70, פ = 80, ר = 200, ן = 50.',
        },
        {
          q: 'The Baal HaTurim: exactly that many shekels Efron took for the cave. And which phrase equals this number — and tells <b>what kind of person</b> Efron was?',
          opts: ['“an evil eye” — stinginess', '“a good eye” — generosity', '“a good heart”', '“an open hand”'],
        },
        {
          q: 'The field passed to Avraham: <span class="he">ויקם שדה עפרון</span> — “and the field of Efron passed.” Take the first letters of these words — you may rearrange them. Whose name is hidden?',
          hint: 'The name of Yaakov’s twin brother.',
        },
      ],
      reveal: {
        h: 'An evil eye',
        p: 'Efron without ו adds up to 400 — like “ayin ra,” “an evil eye,” and like the 400 shekels he took for the cave. And the first letters of “vayakam sedeh Efron,” read backwards, spell Esav: he will yet come to contest the cave.',
      },
      lessons: [
        {
          h: 'Four hundred shekels',
          b: `<p><span class="he">עפרן</span> = 70 + 80 + 200 + 50 = 400; <span class="he">עין רע</span> = 130 + 270 = 400.<sup data-src="bht-23-16"></sup></p><p>Rashi also explains why Efron’s name has no ו in this place.<sup data-src="rashi-23-16"></sup></p><p class="expl"><b>Explanation.</b> At first Efron offered the field as a gift, and then he took a huge sum. The letter missing from his name shows what was missing in him: a good eye.</p>`,
        },
        {
          h: 'Esav and the cave',
          b: `<p>The first letters of <span class="he">ויקם שדה עפרון</span>: ו, ש, ע — backwards: <span class="he">עשו</span>, Esav.<sup data-src="bht-23-17"></sup> The Torah lists in detail what passed to Avraham: the field, the cave, all the trees around it — all before the eyes of the people of the town.<sup data-src="gen-23-17"></sup></p><p class="expl"><b>Explanation.</b> Avraham paid the full price before witnesses. What was bought honestly is yours, even if someone later wants to dispute it.</p>`,
        },
      ],
      reflection: 'Efron begrudged Avraham. Where can I look at someone else today with a “good eye” — be happy for them or share without regret?',
      takeaways: [
        'עפרן without ו = 400 = עין רע, “an evil eye.”',
        '400 — the shekels Efron took for the Cave of Machpelah.',
        'The first letters of “ויקם שדה עפרון,” backwards, spell עשו: Esav will dispute the cave.',
      ],
    },
    {
      title: 'An oath and a prayer at the well',
      cond: `<p>Avraham grew old and sent his senior servant to find a wife for Yitzchak — from his own family, in Aram Naharaim. First he made him swear:</p><p class="verse" dir="rtl" lang="he">שים נא ידך תחת ירכי</p><p>“Place, please, your hand under my thigh, and I will make you swear by the L-rd…”<sup data-src="gen-24-2"></sup></p><p>The servant came to the well outside the town and prayed: “O L-rd, G-d of my master Avraham, grant me good fortune this day, and show kindness to my master Avraham.”<sup data-src="gen-24-12"></sup></p><p class="verse" dir="rtl" lang="he">ועשה חסד עם אדני אברהם</p>`,
      steps: [
        {
          q: 'What do the words <span class="he">נא ידך</span> — “please, your hand” — add up to?',
          hint: 'נא = 50 + 1; ידך = 10 + 4 + 20.',
        },
        {
          q: 'Which word equals this number — and tells <b>by what</b> Avraham made him swear?',
          opts: ['circumcision', 'covenant', 'oath', 'tefillin'],
        },
        {
          q: 'Take the last letters of the words <span class="he">עם אדני אברהם</span> — “to my master Avraham.” You may rearrange them. Which word comes out?',
          hint: 'A three-letter word: what we drink.',
        },
        {
          q: 'Right before these words stands <span class="he">חסד</span> — “kindness.” Add its last letter too. Which word comes out now?',
          hint: 'A four-letter word: “blood.”',
        },
      ],
      reveal: {
        h: 'Water and blood',
        p: '“Na yadcha” = 85 = “milah”: Avraham made him swear by the circumcision. The last letters of “im adoni Avraham” spell “mayim,” water: in reward for the water Avraham gave his guests, answer at the water. And with the ד of “chesed” — “damim,” blood: in the merit of Avraham on Mount Moriah.',
      },
      lessons: [
        {
          h: 'An oath by the circumcision',
          b: `<p><span class="he">נא ידך</span> = 51 + 34 = 85; <span class="he">מילה</span> = 40 + 10 + 30 + 5 = 85.<sup data-src="bht-24-2-2"></sup></p><p>Rashi explains why one swears holding an object of a mitzvah, and why Avraham chose this very mitzvah.<sup data-src="rashi-24-2"></sup></p><p class="expl"><b>Explanation.</b> Avraham tied the oath to the dearest thing he had: the mitzvah he had fulfilled through pain.</p>`,
        },
        {
          h: 'Water and blood',
          b: `<p>The last letters of <span class="he">עם אדני אברהם</span>: ם, י, ם — <span class="he">מים</span>, “water.” Together with the <span class="he">ד</span> of <span class="he">חסד</span>: <span class="he">דמים</span>, “blood.”<sup data-src="bht-24-12"></sup></p><p>When three guests came to Avraham, he said: “Let a little water be brought; wash your feet.”<sup data-src="gen-18-4"></sup> And on Mount Moriah he had already taken the knife to offer up Yitzchak.<sup data-src="gen-22-10"></sup></p><p class="expl"><b>Explanation.</b> Good is never lost: the water Avraham gave his guests “came back” to his household at the well — there the servant met Rivkah.</p>`,
        },
      ],
      reflection: 'Avraham’s servant asked “in the merit” of his master’s good deeds. Which good deed of my parents or teachers can I continue?',
      takeaways: [
        'נא ידך = 85 = מילה: Avraham made him swear by the circumcision.',
        'The last letters of “עם אדני אברהם” spell מים: a reward for the water given to guests.',
        'With the ד of חסד — דמים: in the merit of Avraham on Mount Moriah.',
      ],
    },
    {
      title: 'Rivkah in Sarah’s tent',
      cond: `<p>At the well Rivkah gave water to the servant and to all his camels. Her family agreed, but they asked Rivkah herself:</p><p class="verse" dir="rtl" lang="he">התלכי עם האיש הזה</p><p>“Will you go with this man?” And she said: “I will go.”<sup data-src="gen-24-58"></sup> Before the journey they blessed Rivkah: “Our sister, may you become thousands of myriads!”<sup data-src="gen-24-60"></sup> And Yitzchak brought her into the tent of his mother Sarah, took her as his wife, and loved her.<sup data-src="gen-24-67"></sup></p>`,
      steps: [
        {
          q: 'Take the last letters of the words <span class="he">עם האיש הזה</span> — “with this man.” You may rearrange them. Whose name comes out?',
          hint: 'The name of the one who brought the Torah to Israel.',
        },
        {
          q: 'The blessing says <span class="he">את היי</span> — “you — become.” What does the word <span class="he">היי</span> add up to?',
          hint: 'ה = 5, י = 10.',
        },
        {
          q: 'The Baal HaTurim: this number equals a word from the promise to Avraham, when G-d showed him the stars: “… shall your offspring be.” Which word?',
          opts: ['“so”', '“a thousand”', '“many”', '“offspring”'],
        },
        {
          q: '<span class="he">ויבאה</span> — “and he brought her.” Here the word is written defectively, without the second י. What does it add up to?',
          hint: 'ו = 6, י = 10, ב = 2, א = 1, ה = 5.',
        },
      ],
      reveal: {
        h: 'Twenty-four ornaments',
        p: 'The last letters of “im ha’ish hazeh” spell Moshe: Rivkah’s wedding was according to the law of Moshe and Israel. “Hayi” = 25 = “koh,” “so”: may the promise to Avraham, “so shall your offspring be,” come true. And “vayevi’eha” without the second י = 24: Rivkah was adorned with twenty-four ornaments.',
      },
      lessons: [
        {
          h: 'According to the law of Moshe',
          b: `<p>The last letters of <span class="he">עם האיש הזה</span>: ם, ש, ה — <span class="he">משה</span>.<sup data-src="bht-24-58"></sup></p><p class="expl"><b>Explanation.</b> Rivkah was asked whether she agreed — and she answered herself: “I will go.” At a Jewish wedding to this day one says: “according to the law of Moshe and Israel.”</p>`,
        },
        {
          h: 'So shall your offspring be',
          b: `<p><span class="he">היי</span> = 5 + 10 + 10 = 25; <span class="he">כה</span> = 20 + 5 = 25.<sup data-src="bht-24-60-1"></sup> The word <span class="he">כה</span> comes from the promise to Avraham: G-d took him outside and said: “Look toward heaven and count the stars, if you are able to count them… So shall your offspring be.”<sup data-src="gen-15-5"></sup></p><p class="expl"><b>Explanation.</b> The blessing given to Avraham continues through Rivkah: from her will come a people as numerous as the stars.</p>`,
        },
        {
          h: 'Twenty-four ornaments',
          b: `<p><span class="he">ויבאה</span> = 6 + 10 + 2 + 1 + 5 = 24.<sup data-src="bht-24-67-1"></sup> In full this word would be written <span class="he">ויביאה</span> — with two יs.</p><p>Rashi tells what returned to the tent together with Rivkah.<sup data-src="rashi-24-67"></sup></p><p class="expl"><b>Explanation.</b> Rivkah’s finest ornament was her deeds: in the tent the lamp burned again, there was blessing in the bread and a cloud over the entrance — as in Sarah’s days.</p>`,
        },
      ],
      reflection: 'With Rivkah, light, blessing and the cloud returned to the tent. What good can I bring into my home — light, order, warmth?',
      takeaways: [
        'The last letters of “עם האיש הזה” spell משה: according to the law of Moshe and Israel.',
        'היי = 25 = כה: “so shall your offspring be.”',
        'ויבאה without the second י = 24: Rivkah was adorned with 24 ornaments.',
        'Rashi: with Rivkah, the lamp, the blessing in the dough and the cloud returned to the tent.',
      ],
    },
  ],
  memo: {
    intro:
      'Twelve comments of the Baal HaTurim on Parshat Chayei Sarah — twelve pairs of cards. Each picture tells about one comment, and its pair is the Torah words it speaks about.',
    items: [
      {
        title: 'Rivkah’s sun',
        caption: 'One sun sets as another rises',
        verse: '“the life of Sarah”',
        quote: 'Before the sun of Sarah set, the sun of Rivkah rose.',
        explain:
          'The last words of the previous parshah are “And Betuel fathered Rivkah,” and this parshah begins with Sarah’s passing. The Baal HaTurim teaches: G-d took care in advance that Yitzchak would have a wife worthy of Sarah’s tent.',
        moral: 'The world is never left without the righteous.',
      },
      {
        title: 'A sun in Sarah’s years',
        caption: 'The sun in the sky',
        verse: '“Sarah — a hundred years”',
        quote: '“Sarah — a hundred years” — the first letters spell “shemesh” [sun]: “the sun rises and the sun sets.”',
        explain:
          'Take the first letters of the words שרה מאה שנה: ש, מ, ש — you get שמש, “sun.” Sarah’s life shone like the sun for everyone who came into her tent.',
        moral: 'A righteous person shines for others like the sun.',
      },
      {
        title: 'Sarah’s main years',
        caption: 'Sarah with little Yitzchak',
        verse: '“and the life of Sarah was”',
        quote: 'The number of “vayihyu” was her main years, from when Yitzchak was born: she was ninety when he was born.',
        explain:
          'The word ויהיו (“and were”) = 37. Sarah gave birth to Yitzchak at 90 and lived to 127. 127 − 90 = 37: that is how many years she raised her son — these were her main years.',
        note: 'Sarah lived 37 years after Yitzchak was born',
        moral: 'The main years are those in which we raise children and teach them good.',
      },
      {
        title: 'Efron’s evil eye',
        caption: 'Scales and silver coins',
        verse: '“to Efron”',
        quote: '“To Efron” — written without vav: in gematria “ayin ra” [an evil eye]; “Efron” = 400 — like the four hundred shekels for the cave.',
        explain:
          'Efron spoke nicely, but took a huge sum for the cave. Here his name is written without ו: עפרן = 400, like עין רע — “an evil eye,” stinginess. And Avraham paid him 400 shekels of silver.',
        moral: 'Speaking nicely is not enough — look at others with a good eye.',
      },
      {
        title: 'Esav and the cave',
        caption: 'The entrance to the Cave of Machpelah',
        verse: '“and the field of Efron passed”',
        quote: '“And the field of Efron passed” — the first letters, reversed, spell “Esav”: he will rise to contest the cave.',
        explain:
          'Take the first letters of the words ויקם שדה עפרון: ו, ש, ע — read them backwards: עשו, Esav. Avraham bought the cave honestly, before witnesses — and Esav would later argue about who should be buried there.',
        moral: 'An honest purchase before witnesses protects against future quarrels.',
      },
      {
        title: 'An oath by the circumcision',
        caption: 'Avraham and his servant take an oath',
        verse: '“place, please, your hand”',
        quote: '“Please, your hand” — in gematria “milah” [circumcision]: he made him swear by the circumcision.',
        explain:
          'Avraham asked his servant to swear that he would find Yitzchak a wife from his family. נא ידך = 85, and מילה (“circumcision”) = 85. Circumcision was Avraham’s first mitzvah, and it was very dear to him.',
        moral: 'The most important promise is tied to what is dearest.',
      },
      {
        title: 'Water at the well',
        caption: 'A well and a jug of water',
        verse: '“to my master Avraham”',
        quote: '“To my master Avraham” — the last letters spell “mayim” [water]: in reward for “let a little water be brought,” answer him at the water.',
        explain:
          'The servant prayed at the well: “Show kindness to my master Avraham.” The last letters of עם אדני אברהם: ם, י, ם — מים, “water.” Avraham once gave water to his guests — and now the answer came at the water.',
        moral: 'The good we do comes back.',
      },
      {
        title: 'A girl who does kindness',
        caption: 'Rivkah waters the camels',
        verse: '“and by her I will know”',
        quote: '“And by her I will know that You have shown kindness” — if she is a righteous woman who does kindness.',
        explain:
          'The servant asked for a sign: a girl who would give water to him and to his camels too. The Baal HaTurim explains: this is how he would know she is righteous and loves to do kindness — and such a girl is right for Yitzchak.',
        moral: 'A good heart shows in deeds.',
      },
      {
        title: 'According to the law of Moshe',
        caption: 'Rivkah sets out on a camel',
        verse: '“with this man”',
        quote: '“With this man” — the last letters spell “Moshe”: a hint that everything went according to the law of Moshe and Israel.',
        explain:
          'The family asked Rivkah: “Will you go with this man?” — and she answered: “I will go.” The last letters of עם האיש הזה: ם, ש, ה — משה, Moshe. Even today at a wedding one says: “according to the law of Moshe and Israel.”',
        moral: 'A marriage is built by the law of the Torah — and with the bride’s consent.',
      },
      {
        title: 'So shall your offspring be',
        caption: 'A starry sky',
        verse: '“you — become”',
        quote: '“Hayi” in gematria “koh” [so]: may you merit what is said: “so shall your offspring be.”',
        explain:
          'They blessed Rivkah: “May you become thousands of myriads!” The word היי = 25, and כה (“so”) = 25. This word comes from the promise to Avraham: “Look at the stars… so shall your offspring be.”',
        moral: 'Parents’ blessing lives on in their children.',
      },
      {
        title: 'The Minchah prayer',
        caption: 'Yitzchak prays in a field at sunset',
        verse: '“to meditate in the field”',
        quote: '“To meditate in the field” — Yitzchak instituted the Minchah prayer, and then Rivkah came his way.',
        explain:
          'Yitzchak went out into the field toward evening — and prayed. This is how the afternoon prayer, Minchah, began. And just then the caravan with Rivkah was approaching: the prayer and its answer met.',
        moral: 'Even in the middle of the day, it is worth stopping to pray.',
      },
      {
        title: 'Twenty-four ornaments',
        caption: 'Rivkah, adorned, enters the tent',
        verse: '“and Yitzchak brought her into the tent”',
        quote: '“And he brought her” — written defectively and adds up to twenty-four: she was adorned with twenty-four ornaments.',
        explain:
          'The word ויבאה is written here without the second י and equals 24. Yitzchak brought Rivkah into Sarah’s tent adorned like a bride. And Rashi tells: with her, the lamp, the blessing in the bread and the cloud returned to the tent.',
        note: 'a bride’s 24 ornaments',
        moral: 'The finest ornament is good deeds.',
      },
    ],
  },
  final: {
    title: 'The tent shines again',
    allSolved:
      'All four riddles are solved. A sun is hidden in Sarah’s years, and before it set, Rivkah’s sun rose; Efron without ו is “an evil eye” and 400 shekels; Avraham made his servant swear by the circumcision, and at the well the servant asked “in the merit of water and blood”; Rivkah went “according to the law of Moshe,” received the blessing “so shall your offspring be” and came into Sarah’s tent — and the light returned.',
  },
  audience: 'Gematria of one or two words, subtraction, games with first and last letters; a familiar story — Sarah, Efron, Avraham’s servant and Rivkah at the well. Younger children — together with an adult.',
  practice:
    'This week do a kindness “like Rivkah” — more than you were asked: if someone asks for water for one, give water to those beside him too; when you help, don’t spare time or effort.',
  highlight: '“To Efron” without ו equals “an evil eye”: 400 — like the four hundred shekels he took for the cave.',
  share: ({ score, max, time, grid, allSolved, site }) => `☀️ Which “sun” is hidden in Sarah’s years? The answer is in the first letters of the words.

I’m playing a gematria game based on the Baal HaTurim’s commentary on Parshat Chayei Sarah. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: Sarah’s sun and her main years, what the Cave of Machpelah cost and what an “evil eye” is, what Avraham’s servant swore by and what he asked for at the well, how Rivkah came into Sarah’s tent. Can you do better?
Play 👉 ${site}

©mychitas.app`,
  source:
    'Based on the commentary of the Baal HaTurim (Rabbi Yaakov ben Asher, 14th century) on Parshat Chayei Sarah (Genesis 23:1–25:18), short version (“Kitzur Baal HaTurim”). Hebrew text — Sefaria.',
};

export default en;
