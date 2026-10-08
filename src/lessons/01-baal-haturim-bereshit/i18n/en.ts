import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Baal HaTurim: Bereshit',
  hero: {
    heading: 'Baal HaTurim: <i>four riddles of the Torah’s beginning</i>',
    author: 'based on the commentary of the Baal HaTurim, Rabbi Yaakov ben Asher',
    intro:
      'The great commentator found numbers, first and last letters of words and Masoretic “pairs” in the first chapters of the Torah. Count them yourself: when the world was created, why light is Torah, what man is made of and whom the Almighty loves.',
  },
  summary:
    'Bereshit 1–4 through the eyes of the Baal HaTurim: “Bereshit bara” = “created on Rosh Hashanah”, light = 613, man from the earth, a seal and challah, the seventh day and the seventh generation.',
  glossary: {
    'בראשית': 'in the beginning',
    'ברא': 'created',
    'את': 'direct-object particle',
    'האור': 'the light',
    'אדמה': 'earth, soil',
    'ויבאה': 'and He brought her',
    'עדי': 'my witness',
  },
  riddles: [
    {
      title: 'In the beginning — truth',
      cond: `<p>The Baal HaTurim is Rabbi Yaakov ben Asher (c. 1269–1343), author of the law code “Arba’ah Turim”. On every verse of the Torah he left short allusions: gematria, first and last letters of words, words that appear in all of Tanakh exactly two or three times. His first allusion is on the Torah’s first words:</p><p class="verse" dir="rtl" lang="he">בראשית ברא אלקים את השמים ואת הארץ</p><p>“In the beginning G-d created the heaven and the earth.”<sup data-src="gen-1-1"></sup></p>`,
      steps: [
        {
          q: 'What are the first two words of the Torah, <span class="he">בראשית ברא</span>, worth?',
          hint: 'בראשית = 2 + 200 + 1 + 300 + 10 + 400; ברא = 2 + 200 + 1.',
        },
        {
          q: 'The Baal HaTurim found a phrase with the same gematria — it tells <b>when</b> the world was created. Which one?',
          opts: ['“created on Rosh Hashanah”', '“created in the month of Nisan”', '“created on the first day”', '“created in six days”'],
        },
        {
          q: 'Build a word from the <b>last</b> letters of the Torah’s first three words. Take them from the end — from the third word back to the first.',
          hint: 'The last letters of the words are marked: ם, א, ת. The three-letter word means “truth”.',
        },
        {
          q: 'The second chapter says: “these are the generations of the heaven and the earth <span class="he">בהבראם</span> — when they were created”. Rearrange <b>all</b> the letters of this word to make “in Avraham” — the Patriarch’s name with the prefix <span class="he">ב</span>.',
          hint: 'Avraham’s name is אברהם. Put ב (“in”) before it.',
        },
      ],
      reveal: {
        h: 'The world was created on Rosh Hashanah — with truth',
        p: 'The Torah’s first two words, “Bereshit bara”, equal 1116 — like “created on Rosh Hashanah”. The last letters of “Bereshit bara Elokim” form the word “emet”, truth: the world was created with truth. And the word “behibar’am”, “when they were created”, has the same letters as “be-Avraham”: heaven and earth were created for the sake of Avraham.',
      },
      lessons: [
        {
          h: 'How to read the Baal HaTurim',
          b: `<p>The Baal HaTurim’s commentary, printed in almost every Chumash, is a collection of short allusions. It uses several devices. <b>Gematria</b>: two phrases with the same number are linked in meaning. <b>Rashei teivot and sofei teivot</b> (<span class="he">ר״ת</span>, <span class="he">ס״ת</span>): the first or last letters of neighbouring words form a new word. <b>Notarikon</b>: each letter of a word is read as the start of a separate word. <b>“Two in the Masorah”</b> (<span class="he">ב׳ במסורה</span>): a word appears in all of Tanakh exactly twice, and the two places explain each other.</p><p>Every number in this lesson has been checked. Two gematriot of the commentary do not add up in our count — this is said plainly, and they were left out of the riddles.</p>`,
        },
        {
          h: 'The world was created on Rosh Hashanah',
          b: `<p>The Baal HaTurim writes: “<b>Bereshit bara</b> — in gematria: <b>created on Rosh Hashanah</b> (the world).”<sup data-src="bht-1-1"></sup> <span class="he">בראשית</span> = 913, <span class="he">ברא</span> = 203, together 1116. And <span class="he">בראש</span> (503) + <span class="he">השנה</span> (360) + <span class="he">נברא</span> (253) is also 1116.</p><p>The Torah’s very first words speak of the day on which the world began: the head of the year.</p>`,
        },
        {
          h: '“Bereshit” — for the sake of the Torah and Israel',
          b: `<p>Next the Baal HaTurim reads <span class="he">בראשית</span> as a notarikon — six letters, six words: <span class="he">בראשונה ראה אלקים שיקבלו ישראל תורה</span> — “<b>first of all G-d saw that Israel would accept the Torah</b>”.</p><p>Even before creating heaven and earth, the Almighty “saw” the purpose of creation: a people that would accept the Torah.</p>`,
        },
        {
          h: 'The seal of truth',
          b: `<p>The last letters of <span class="he">בראשית ברא אלקים</span> — <span class="he">ת</span>, <span class="he">א</span>, <span class="he">ם</span> — form the word <span class="he">אמת</span>, “truth”. This teaches, says the Baal HaTurim, that the Almighty created the world with truth, as it is said: “The beginning of Your word is truth.”<sup data-src="ps-119-160"></sup> “And so there are many verses whose last letters form <span class="he">אמת</span>.”</p><p>The beginning of G-d’s word — the first verse of the Torah — carries the seal of truth at its “end”.</p>`,
        },
        {
          h: 'The spirit of Mashiach',
          b: `<p>On the second verse — “and the spirit of G-d hovered over the waters” — the Baal HaTurim writes that the words <span class="he">ורוח אלקים מרחפת</span> equal in gematria <span class="he">זו רוחו של משיח</span>, “this is the spirit of Mashiach”.<sup data-src="bht-1-2"></sup> Already in the Torah’s second verse, over the primordial waters, hovers the spirit of the future redemption.</p><p>To be honest: in our count the numbers differ (1034 and 921) — perhaps the Baal HaTurim had a different spelling of the words. That is why this gematria is not part of the riddles.</p>`,
        },
        {
          h: 'For the sake of Avraham',
          b: `<p>In the second chapter: “These are the generations of the heaven and the earth <span class="he">בהבראם</span> — when they were created.”<sup data-src="gen-2-4"></sup> The Baal HaTurim: the letters of <span class="he">בהבראם</span> are the letters of <span class="he">באברהם</span>, “in Avraham”: <b>heaven and earth were created in the merit of Avraham</b>.<sup data-src="bht-2-4"></sup> Both words have the same letters, so their gematria is the same too — 250.</p><p>The end of the same verse says “earth and heaven” — in reverse order. According to the Masorah this phrase appears twice: here and in the psalm “His glory is above earth and heaven”. Why do we give thanks for earth and heaven? Because He made earth and heaven.</p>`,
        },
      ],
      reflection: 'How does my day begin? If “the beginning of Your word is truth”, which first word, which first deed in the morning will set the tone for everything else?',
      takeaways: [
        'בראשית ברא = 1116 = בראש השנה נברא: the world was created on Rosh Hashanah.',
        'Notarikon of בראשית: “first of all G-d saw that Israel would accept the Torah”.',
        'The last letters of בראשית ברא אלקים form אמת: the world was created with truth; “the beginning of Your word is truth”.',
        'בהבראם has the letters of באברהם (250): heaven and earth were created for the sake of Avraham.',
      ],
      puzzle: {
        q: 'Put the allusions in the order of the Torah text.',
        pieces: ['בראשית ברא = 1116', '“Created on Rosh Hashanah”', 'Last letters: אמת', 'בהבראם = באברהם'],
        meaning: 'The Torah’s first words name the day of creation — Rosh Hashanah; their last letters set the seal of truth; and “when they were created” reveals for whose sake: for Avraham’s.',
      },
    },
    {
      title: 'Light is Torah',
      cond: `<p>The first day of creation. The Torah says:</p><p class="verse" dir="rtl" lang="he">וירא אלקים את האור כי טוב ויבדל אלקים בין האור ובין החשך</p><p>“And G-d saw the light, that it was good; and G-d divided the light from the darkness.”<sup data-src="gen-1-1"></sup></p><p>The Baal HaTurim finds three allusions in this verse: to the Torah, to the covenant and to Havdalah — the separation at the end of Shabbat.</p>`,
      steps: [
        {
          q: 'What are the words <span class="he">את האור</span> — “the light” (with the direct-object particle <span class="he">את</span>) — worth?',
          hint: 'את = 1 + 400; האור = 5 + 1 + 6 + 200.',
        },
        { q: 'Which word has the same gematria?', opts: ['“in the Torah”', '“Torah”', '“faith”', '“commandment”'] },
        {
          q: 'Build a word from the <b>last</b> letters of <span class="he">את האור כי טוב</span> (“the light, that it was good”), from the last word back to the first.',
          hint: 'The last letters are marked; take them from <span class="he">טוב</span> back to <span class="he">את</span>. You get “brit” — covenant.',
        },
        { q: 'What is the word <span class="he">ויבדל</span> — “and He divided” — worth?', hint: '6 + 10 + 2 + 4 + 30.' },
        {
          q: 'On the fourth day: “Let there be luminaries.” The word is usually spelled <span class="he">מאורת</span>, but in the Torah it has <b>one letter less</b>: <span class="he">מארת</span>. Tap the letter the Torah leaves out.',
          hint: 'Compare the two spellings letter by letter: מ־א־?־ר־ת.',
        },
      ],
      reveal: {
        h: 'Light is the 613 commandments',
        p: '“Et ha-or” is 613, like “ba-Torah”, “in the Torah”, and like the number of the Torah’s commandments (תרי״ג). The last letters of “et ha-or ki tov” form the word “brit”, covenant. And “vayavdel”, “and He divided”, equals 52: that is how many times a year we make Havdalah at the end of Shabbat.',
      },
      lessons: [
        {
          h: 'The light is in the Torah',
          b: `<p>The Baal HaTurim: “<span class="he">את האור</span> — its gematria is <span class="he">בתורה</span>, and it amounts to <span class="he">תרי״ג</span>”, 613.<sup data-src="bht-1-4"></sup> <span class="he">את</span> (401) + <span class="he">האור</span> (212) = 613; <span class="he">בתורה</span> = 2 + 611 = 613. The light of the first day is the light of the Torah with its 613 commandments.</p><p>Note: the word “Torah” (<span class="he">תורה</span>) is 611, while “in the Torah” is 613. The light is not the Torah “somewhere”, but what is inside it.</p>`,
        },
        {
          h: 'The covenant',
          b: `<p>The last letters of <span class="he">את האור כי טוב</span> — <span class="he">ת</span>, <span class="he">ר</span>, <span class="he">י</span>, <span class="he">ב</span> — form the word <span class="he">ברית</span>, “covenant”. The light about which the Almighty said “good” is His covenant with creation.</p>`,
        },
        {
          h: 'Havdalah: first benefit from the light',
          b: `<p>“And G-d saw the light, that it was good — and divided.” First “saw that it was good”, and only then “divided”. From here, says the Baal HaTurim, we learn that one does not bless the candle (at Havdalah) until one has benefited from its light. So the Mishnah says: “One does not recite the blessing over the candle until one benefits from its light.”<sup data-src="berakhot-51b"></sup></p><p>And more: <span class="he">ויבדל</span> = 6 + 10 + 2 + 4 + 30 = 52 — the number of times a year we “divide” (make Havdalah) at the end of Shabbat: a year has 52 weeks.</p>`,
        },
        {
          h: 'Above the firmament — a secret',
          b: `<p>On the second day: “…and divided the waters under the firmament from the waters <span class="he">מעל לרקיע</span> — above the firmament”. According to the Masorah these words appear twice: here and in Ezekiel’s vision of the Chariot — “and there was a voice above the firmament”. The Baal HaTurim learns from this: just as the <b>Work of Creation</b> is not expounded in public, so the <b>Work of the Chariot</b> is not expounded.<sup data-src="bht-1-7"></sup> Both are secrets of the Torah.</p>`,
        },
        {
          h: 'A star for every blade of grass',
          b: `<p>On the third day: “fruit tree… <span class="he">מזריע זרע למינהו</span> — yielding seed after its kind”. The first letters of these words are <span class="he">מזל</span>, “mazal”, a heavenly guardian: there is no blade of grass that has no mazal above it.<sup data-src="bht-1-12"></sup></p>`,
        },
        {
          h: 'Luminaries without a vav',
          b: `<p>On the fourth day: “Let there be <span class="he">מארת</span> — luminaries.” The word is written “defectively”, without the letter <span class="he">ו</span>. The Baal HaTurim explains: only the sun was created to give light. The moon was created only so that people would not worship the sun, as they might if it were alone.<sup data-src="bht-1-14"></sup></p>`,
        },
      ],
      reflection: 'Where in my life is there a light I already use but have not yet thanked for? And what in my day should be “divided” — the way Havdalah divides the holy from the weekday?',
      takeaways: [
        'את האור = 613 = בתורה = תרי״ג: the light of the first day is the light of the Torah and its 613 commandments.',
        'The last letters of “את האור כי טוב” form ברית, covenant.',
        '“Saw that it was good” — then “divided”: the Havdalah candle is blessed only after benefiting from its light.',
        'ויבדל = 52 — Havdalahs a year, one for each Shabbat.',
        'More allusions: “above the firmament” is a secret, like the Chariot; every blade of grass has its mazal; the moon was created so that the sun would not be worshipped.',
      ],
      puzzle: {
        q: 'Put the allusions of verse 1:4 in the order of its words.',
        pieces: ['את האור = 613 = בתורה', 'Last letters of “את האור כי טוב”: ברית', '“Saw that it was good”: first benefit from the light', 'ויבדל = 52 Havdalahs a year'],
        meaning: 'The light of the first day is Torah and covenant; the Almighty first “saw that it was good”, then “divided” — so every week we too bless the light and then divide Shabbat from the weekdays.',
      },
    },
    {
      title: 'Man from the earth',
      cond: `<p>How was man created? The Torah says:</p><p class="verse" dir="rtl" lang="he">וייצר ה׳ אלקים את האדם עפר מן האדמה ויפח באפיו נשמת חיים ויהי האדם לנפש חיה</p><p>“Then the L-rd G-d formed man of the dust of the ground, and breathed into his nostrils the breath of life; and man became a living soul.”<sup data-src="gen-2-7"></sup></p><p>The Baal HaTurim notes: the letters of <em>האדם</em>, “man”, hide what man was taken from.</p>`,
      steps: [
        {
          q: 'Rearrange <b>all</b> the letters of <span class="he">האדם</span> (“man”) to make the word “earth”.',
          hint: 'Earth in Hebrew is “adamah”: אדמה.',
        },
        {
          q: 'Build a word from the <b>last</b> letters of <span class="he">ויפח באפיו נשמת חיים</span> (“and breathed into his nostrils the breath of life”).',
          hint: 'The last letters are marked. You get “chotam” — a seal.',
        },
        {
          q: 'Now from the <b>first</b> letters of <span class="he">האדם לנפש חיה</span> (“man — a living soul”). They need to be rearranged.',
          hint: 'The first letters are marked. You get “challah”.',
        },
        {
          q: 'The Almighty “brought” Chava “to the man”. In full the word is spelled <span class="he">ויביאה</span>, but in the Torah it is <span class="he">ויבאה</span>, “defectively”. Tap the letter the Torah leaves out.',
          hint: 'Compare letter by letter: ו־י־ב־?־א־ה.',
        },
        {
          q: 'What is the word <span class="he">ויבאה</span> (“and He brought her”) worth as written in the Torah?',
          hint: '6 + 10 + 2 + 1 + 5.',
        },
      ],
      reveal: {
        h: 'Earth, seal and challah',
        p: '“Ha-adam” and “adamah” are 50: man was taken from the earth. The last letters of “and breathed into his nostrils the breath of life” give “chotam”, a seal, and the first letters of “man — a living soul” give “challah”: Adam was the “challah of the world”. The word “and He brought her”, written without a yud, equals 24: the Almighty adorned Chava with twenty-four ornaments and brought her to Adam.',
      },
      lessons: [
        {
          h: 'Dust, blood and gall',
          b: `<p>On the verse “And G-d created man in His own image”<sup data-src="gen-1-27"></sup> the Baal HaTurim writes: <span class="he">האדם</span> has the letters of <span class="he">אדמה</span>, because man was created from the earth. And the word <span class="he">אדם</span> is a notarikon: <span class="he">אפר</span>, <span class="he">דם</span>, <span class="he">מרה</span> — “dust, blood, gall”.<sup data-src="bht-1-27"></sup></p><p>So their gematria is the same too: <span class="he">האדם</span> = <span class="he">אדמה</span> = 50.</p>`,
        },
        {
          h: 'Two inclinations',
          b: `<p>The word “and He formed” appears twice in the story of creation, spelled differently. Of man — <b>in full</b>, with two yuds: <span class="he">וייצר</span>. Of the animals — “and out of the ground the L-rd G-d formed every beast of the field” — <b>defectively</b>, with one yud: <span class="he">ויצר</span>. The Baal HaTurim: man has two “yetzers”, two inclinations — the good and the evil; the animals have only one.<sup data-src="bht-2-7"></sup></p>`,
        },
        {
          h: 'Seal and soul',
          b: `<p>The last letters of <span class="he">ויפח באפיו נשמת חיים</span> — <span class="he">ח</span>, <span class="he">ו</span>, <span class="he">ת</span>, <span class="he">ם</span> — form <span class="he">חותם</span>, “seal”: the soul the Almighty breathed into man is His seal.</p><p>The word <span class="he">נשמת</span> (“breath”, “soul”) appears four times according to the Masorah: “and breathed into his nostrils the <i>breath</i> of life”; “all in whose nostrils was the <i>breath</i> of the spirit of life” (of the Flood); “the <i>soul</i> of man is the lamp of the L-rd”<sup data-src="prov-20-27"></sup>; “the <i>breath</i> of the L-rd, like a stream of brimstone”. The Baal HaTurim links them: the soul of man is the lamp of the L-rd, “and if not” — the breath of the L-rd becomes a stream of brimstone.</p>`,
        },
        {
          h: 'The challah of the world',
          b: `<p>The first letters of <span class="he">האדם לנפש חיה</span> — <span class="he">ה</span>, <span class="he">ל</span>, <span class="he">ח</span> — are <span class="he">חלה</span>, challah: Adam was the “challah of the world”. Just as challah is the first portion of the dough, set apart for the Almighty, so man is the choicest, holy portion of all creation.</p>`,
        },
        {
          h: 'Twenty-four ornaments',
          b: `<p>“And the rib… the L-rd G-d made into a woman, and brought her to the man.”<sup data-src="gen-2-21"></sup> The word <span class="he">ויבאה</span> is written defectively and equals 24: the Almighty adorned Chava with twenty-four ornaments and brought her to Adam.</p><p>In full spelling — <span class="he">ויביאה</span> — the word appears four times according to the Masorah: “and brought her to the man”; “and Yitzchak brought her into the tent”; “and brought her into the city of David” — Pharaoh’s daughter, whom Shlomo took; “and the L-rd watched over the evil and brought it”. The Baal HaTurim explains: before Shlomo married Pharaoh’s daughter he ruled over the upper realms — just like Adam, who was driven from the upper realms because of Chava. With Yitzchak it was the opposite: Rivkah took Sarah’s place, as the Midrash says.<sup data-src="bht-2-22"></sup></p>`,
        },
        {
          h: 'After the sin: the talebearer and ingratitude',
          b: `<p>“Have you eaten of the tree of which I commanded you that you should not eat?”<sup data-src="gen-3-11"></sup> The last letters of <span class="he">אשר צויתיך לבלתי אכל</span> — <span class="he">ר</span>, <span class="he">ך</span>, <span class="he">י</span>, <span class="he">ל</span> — form <span class="he">רכיל</span>, “talebearer”: you followed the counsel of a talebearer — the serpent.</p><p>The word <span class="he">המן</span> (“of…?”) appears three times according to the Masorah: “of the tree?”; “out of this rock?” — Moshe’s words at Mei Merivah; “out of the threshing floor or out of the winepress?”. According to the view that the tree Adam ate from was wheat — hence “the threshing floor”. And just as death was decreed on Adam for “of the tree”, so there death was decreed for “out of this rock”.<sup data-src="bht-3-11"></sup></p><p>“And the man said: the woman whom You gave to be with me, she gave me of the tree, and I ate.” Of this it is said: “Whoever repays evil for good, evil shall not depart from his house.”<sup data-src="prov-17-13"></sup> The last letters of <span class="he">רעה לא תמוש רעה</span> — <span class="he">ה</span>, <span class="he">א</span>, <span class="he">ש</span>, <span class="he">ה</span> — are <span class="he">האשה</span>, “the woman”: Adam was ungrateful for the wife the Almighty gave him as a helper. And “she gave me of the tree”, by the plain meaning, is “she struck me with a stick until I listened to her”.<sup data-src="bht-3-12"></sup></p>`,
        },
        {
          h: 'Priestly garments, the guard and two desires',
          b: `<p>“And the L-rd G-d made for Adam and his wife garments of skin <span class="he">וילבשם</span> — and clothed them.”<sup data-src="gen-3-21"></sup> According to the Masorah this word appears twice: here and of Aharon and his sons — “and clothed them with tunics”. This teaches that the Almighty made priestly garments for the first man; Bereshit Rabbah says that the firstborn served in them. And this verse has eight words — like the eight garments of the High Priest.<sup data-src="bht-3-21"></sup></p><p>“…<span class="he">לשמר</span> — to guard the way to the Tree of Life.” The notarikon of <span class="he">לשמר</span>: <span class="he">לילין שדין מזיקין רוחין</span> — night spirits, demons, harmful beings and spirits.<sup data-src="bht-3-24"></sup></p><p>The Almighty tells Kayin about sin: “unto you is <span class="he">תשוקתו</span> — its desire”. According to the Masorah — twice: here and “I am my beloved’s, and his desire is toward me” (Song of Songs). The Sages said: there are two desires — the desire of the wicked for sin, and the desire of the Holy One, blessed be He, for Israel.<sup data-src="bht-4-7"></sup></p>`,
        },
      ],
      reflection: 'I am made of “dust, blood and gall” — and I carry the Almighty’s seal. What can I give thanks for today, instead of looking, like Adam, for someone to blame?',
      takeaways: [
        'האדם = אדמה = 50: man from the earth; אדם — “dust, blood, gall”.',
        'וייצר with two yuds: man has two inclinations, the animals one.',
        'The last letters of “ויפח באפיו נשמת חיים” form חותם, a seal; the first letters of “האדם לנפש חיה” form חלה — Adam is the challah of the world.',
        'ויבאה = 24: Chava was adorned with twenty-four ornaments.',
        'After the sin: אשר צויתיך לבלתי אכל → רכיל (a talebearer’s counsel); “evil for good” → האשה (ingratitude).',
      ],
      puzzle: {
        q: 'Put the path of man in the order of the verses: from creation to the sin.',
        pieces: ['האדם = אדמה = 50', 'Last letters: חותם, seal', 'First letters: חלה, challah of the world', 'ויבאה = 24 ornaments', 'Last letters: רכיל, talebearer'],
        meaning: 'Man is taken from the earth and sealed with the Almighty’s seal; he is the challah of the world; he is given an adorned wife — yet he follows the counsel of a talebearer.',
      },
    },
    {
      title: 'The seventh',
      cond: `<p>The six days of creation end with the words <em>יום הששי. ויכלו השמים</em> — “the sixth day. And the heavens were finished”. The first letters of these words, writes the Baal HaTurim, form the four-letter Name of the Almighty: with it He sealed creation.<sup data-src="bht-1-31"></sup> Then comes the seventh day:</p><p class="verse" dir="rtl" lang="he">ויכל אלקים ביום השביעי מלאכתו אשר עשה וישבת ביום השביעי מכל מלאכתו אשר עשה. ויברך אלקים את יום השביעי ויקדש אתו כי בו שבת מכל מלאכתו אשר ברא אלקים לעשות</p><p>“And on the seventh day G-d finished His work which He had made; and He rested on the seventh day from all His work which He had made. And G-d blessed the seventh day, and hallowed it; because that in it He rested from all His work which G-d in creating had made.”<sup data-src="gen-2-1"></sup></p><p>And at the end of these chapters the Baal HaTurim cites the words of Job: <em>גם עתה הנה בשמים עדי</em> — “even now, behold, my witness is in heaven”.<sup data-src="job-16-19"></sup></p>`,
      steps: [
        { q: 'How many times does the word <span class="he">מלאכתו</span>, “His work”, appear in these two verses?', hint: 'Go through the verses and mark every מלאכתו.' },
        { q: 'What is the word <span class="he">עדי</span>, “my witness”, worth?', hint: '70 + 4 + 10.' },
        { q: 'Whose name equals this number?', opts: ['Chanoch (Enoch)', 'Noach', 'Yered', 'Enosh'] },
        {
          q: 'Chanoch “walked with G-d, and he was not, for G-d took him”. Which generation from Adam was he? (Adam is the first.)',
          hint: 'אדם · שת · אנוש · קינן · מהללאל · ירד · חנוך',
        },
      ],
      reveal: {
        h: 'The Almighty loves the seventh',
        p: 'The word “His work” appears three times — for the three creations from which He “rested”: heaven, earth and sea. “My witness” in heaven is 84, like Chanoch: the Almighty took him up to heaven as a witness. Chanoch was the seventh generation from Adam, and the Almighty loves the seventh: of Moshe too, seventh from Avraham, it says “and Moshe went up to G-d”.',
      },
      lessons: [
        {
          h: 'Creation under the seal of the Name',
          b: `<p>The first letters of “<b>Y</b>om <b>ha</b>-shishi. <b>Va</b>-yechulu <b>ha</b>-shamayim” form the four-letter Name of the Almighty (Havayah): with it the Work of Creation was sealed.<sup data-src="bht-1-31"></sup> Likewise in the psalm: “<b>Y</b>ismechu <b>ha</b>-shamayim <b>ve</b>-tagel <b>ha</b>-aretz” — “Let the heavens be glad, and let the earth rejoice”<sup data-src="ps-96-11"></sup>: the first letters are the same Name, with which the world was sealed.</p><p>We do not write or pronounce the Name itself — that is why it is not in the riddle.</p>`,
        },
        {
          h: 'The most desired of days',
          b: `<p>“And G-d finished” (<span class="he">ויכל</span>) — Targum Yerushalmi translates: “and He desired”. This is what we say in the Shabbat prayer: “the most desired of days You called it”.</p><p>The passage “Vayechulu” says “His work” three times — for the three works from which He rested: heaven, earth and sea. And of the seventh day it is not written “and there was evening and there was morning” — because we add from the weekday to the holy: Shabbat is welcomed earlier and escorted out later.<sup data-src="bht-2-2"></sup></p>`,
        },
        {
          h: 'The manna rests',
          b: `<p>The word <span class="he">וישבות</span> (“and He rested”) appears twice according to the Masorah: here and “and the manna ceased” (book of Joshua). This explains Moshe’s words in the story of the manna: “This is what the L-rd has spoken: a day of rest, a holy Shabbat.” We do not find that Moshe had told them so beforehand — but it was hidden in the six days of creation: “and He rested on the seventh day” — “and the manna ceased”.</p><p>Another explanation: it teaches that the manna did not fall on Shabbat, as is proven in tractate Kiddushin. And another: it alludes to what the Sages expounded — “He blessed it with the manna and sanctified it with the manna”.<sup data-src="bht-2-2"></sup></p>`,
        },
        {
          h: 'Three blessings',
          b: `<p>The words “and G-d blessed” appear joined to their object three times: here (Shabbat), “and G-d blessed Noach” and “and G-d blessed Yitzchak”. When the Almighty created the world, He blessed Shabbat and the world. In the days of Noach, when all the earlier ones perished and the world was renewed, it had to be blessed a second time. And then He blessed Yitzchak — as the Midrash says: “Until now I had to bless My creatures; from now on the blessings are entrusted to your hands” (to Avraham).<sup data-src="bht-2-3"></sup></p>`,
        },
        {
          h: 'A witness in heaven',
          b: `<p>Job says: “Even now, behold, my witness (<span class="he">עדי</span>) is in heaven, and He that testifies of me is on high.”<sup data-src="job-16-19"></sup> The Baal HaTurim: <span class="he">עדי</span> in gematria is <span class="he">חנוך</span>, Chanoch (84). The Almighty took one who lived before the Flood and one after the Flood — Chanoch and Pinchas — and raised them to heaven to testify about Him.<sup data-src="bht-4-18"></sup> There the Baal HaTurim also writes that the word <span class="he">ושהדי</span> (“and He that testifies of me”) equals the name of the angel Metatron; but in our count the numbers differ (325 and 314), so this is not in the riddle.</p><p>Of Chanoch the Torah says: “And Chanoch walked with G-d, and he was not; for G-d took him.”<sup data-src="gen-5-21"></sup></p>`,
        },
        {
          h: 'All the seventh are beloved',
          b: `<p>Why did the Almighty choose Chanoch? Because he was the <b>seventh generation</b>: Adam, Shet, Enosh, Kenan, Mahalalel, Yered, Chanoch. And the Holy One, blessed be He, loves the seventh.</p><p>So too Moshe was seventh from the Patriarchs: Avraham, Yitzchak, Yaakov, Levi, Kehat, Amram, Moshe. And of him it is written: “And Moshe went up to G-d.”<sup data-src="ex-19-3"></sup> The seventh day is Shabbat, the seventh generation is Chanoch, the seventh from Avraham is Moshe: the seventh ascend to the Almighty.</p>`,
        },
      ],
      reflection: 'What in my week is the “seventh”, beloved by the Almighty? How can I add a little “from the weekday” to it — welcome it earlier and escort it out later?',
      takeaways: [
        'The first letters of “יום הששי ויכלו השמים” form the four-letter Name: creation is sealed with it.',
        'Three times “מלאכתו” — heaven, earth, sea. No “evening and morning” on the seventh day: we add from the weekday to the holy.',
        'וישבות — about Shabbat and about the manna: the manna “rested” on Shabbat.',
        'עדי = 84 = חנוך: a witness in heaven.',
        'Chanoch is seventh from Adam, Moshe seventh from Avraham: the Almighty loves the seventh.',
      ],
      puzzle: {
        q: 'Put the lesson about the seventh in order: from the end of creation to the seventh generations.',
        pieces: ['The Name seals the six days', 'The seventh day — “most desired”', 'עדי = 84 = חנוך', 'Chanoch — seventh from Adam', 'Moshe — seventh from Avraham'],
        meaning: 'Creation is sealed with the Name, the seventh day is the most desired; the witness in heaven is Chanoch, the seventh generation, just as Moshe is seventh from Avraham: the Almighty loves the seventh.',
      },
    },
  ],
  final: {
    title: 'The beginning revealed',
    allSolved:
      'All four riddles solved. The world was created on Rosh Hashanah and sealed with truth, the light of the first day is Torah, man carries the Almighty’s seal, and the seventh ascend to Him.',
  },
  puzzle: {
    q: 'Put the path of the whole lesson in the order of the chapters of Bereshit.',
    pieces: ['Beginning: בראשית ברא = 1116', 'Light: את האור = 613', 'Man: האדם = אדמה', 'The seventh: עדי = חנוך'],
    meaning: 'From the first word to the seventh generation: the world was created with truth, it shines with Torah, man from the earth carries the Divine seal, and the seventh are beloved by the Almighty.',
  },
  practice:
    'At the next Havdalah, first look at the candle’s light — for example, at your fingernails in its glow — and only then say the blessing: like the Torah, first “saw the light, that it was good”, then “divided”. And welcome next Shabbat a few minutes early — add from the weekday to the holy.',
  highlight: 'The Torah’s first words tell when the world was created: on Rosh Hashanah.',
  share: ({ score, max, time, grid, allSolved, site }) => `📜 When was the world created? The answer is hidden in the Torah’s first two words.

I’m searching for it in a gematria game based on the commentary of the Baal HaTurim. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: on “Bereshit bara” and truth, on the light that equals Torah, on man from the earth, and on the seventh day and the seventh generation. Can you do better?
Play 👉 ${site}

©mychitas.app`,
  source:
    'Based on the commentary of the Baal HaTurim (Rabbi Yaakov ben Asher, 14th c.) on chapters 1–4 of Bereshit, short version (“Kitzur Baal HaTurim”). Hebrew text — Sefaria.',
};

export default en;
