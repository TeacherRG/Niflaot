import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Baal HaTurim: Lech Lecha',
  hero: {
    heading: 'Baal HaTurim: <i>five riddles about Avraham’s journey</i>',
    author: 'based on the commentary of the Baal HaTurim, Rabbi Yaakov ben Asher',
    intro:
      'The Baal HaTurim found numbers and hidden words in Parshat Lech Lecha. Count for yourself: how many years Avraham waited for Yitzchak, what showed him the way, why Avram and Lot parted, who Malki-Tzedek was, and what is hidden in the stars, in atbash and in Avraham’s new name.',
  },
  summary:
    'Parshat Lech Lecha through the eyes of the Baal HaTurim: “lech lecha” is a hundred years until Yitzchak is born, “I will show you” = “in the clouds”, “shalom” is hidden in the parting from Lot, Malki-Tzedek is Shem, “ba-mah” in atbash is 400 years, and “father of a multitude” twice is Yitzchak.',
  glossary: {
    'לך': '“go”; in “lech lecha” — “go for yourself”',
    'לך לך': '“go for yourself” — G-d’s first words to Avram',
    'אראך': '“I will show you”',
    'בעננים': '“in the clouds”',
    'בשמים': '“in the heavens”',
    'במים': '“in the water”',
    'ברוח': '“by the wind”',
    'ך': 'final letter kaf (20)',
    'ס׳ אותיות שבברכת כהנים': '“the sixty letters of the Priestly Blessing”',
    'אברהם': 'Avraham',
    'אברם': 'Avram — Avraham’s first name',
    'איש מעל אחיו אברם': '“from one another. Avram…” (the end of verse 13:11 and the start of 13:12)',
    'שלום': 'peace',
    'אל תצר את מואב': '“do not harass Moav”',
    'מואב': 'Moav — a nation descended from Lot',
    'מצרים': 'Egypt',
    'עמלק': 'Amalek',
    'אדום': 'Edom',
    'מלך שלם': '“king of Shalem” (Shalem — Jerusalem)',
    'מלכי צדק': 'Malki-Tzedek, king of Shalem',
    'שם': 'Shem, son of Noach',
    'שם בן נח': '“Shem, son of Noach”',
    'נח': 'Noach',
    'עבר': 'Ever, Shem’s great-grandson',
    'תרח': 'Terach, Avram’s father',
    'לוט': 'Lot, Avram’s nephew',
    'ויוצא אתו החוצה': '“and He took him outside”',
    'כה': '“koh” — “so”, “thus”',
    'יהיה': '“will be”',
    'ל׳ צדיקים בכל דור': '“thirty righteous people in every generation”',
    'צדיקים': 'righteous people (tzaddikim)',
    'מלכים': 'kings',
    'נביאים': 'prophets',
    'כוכבים': 'stars',
    'במה': '“ba-mah” — “how?”, “by what?”',
    'שיץ': '“shitz” — the word במה in atbash',
    'במה אדע': '“how will I know?”',
    'כי': '“that”',
    'גר': '“stranger”',
    'כי גר': '“that strangers”',
    'ועלטה היה והנה תנור': '“and there was darkness, and behold — a furnace”',
    'תוהו': 'tohu — chaos, emptiness',
    'אב': 'father',
    'המון': 'multitude',
    'אב המון': '“father of a multitude”',
    'ארבה': '“I will multiply”',
    'יצחק': 'Yitzchak',
    'ישמעאל': 'Yishmael',
    'יעקב': 'Yaakov',
    'אקים': '“I will establish”',
    'אשר קידש ידיד מבטן': '“Who sanctified the beloved one from the womb”',
    'אב המון גוים': '“father of a multitude of nations”',
    'וקראת את שמו יצחק': '“and you shall name him Yitzchak”',
    'לברית עולם לזרעו': '“as an everlasting covenant for his descendants”',
  },
  translit: {
    'לך': 'lech',
    'אראך': 'arecha',
    'כה': 'koh',
    'יהיה': 'yihyeh',
    'במה': 'ba-mah',
    'כי': 'ki',
    'גר': 'ger',
    'אב': 'av',
    'המון': 'hamon',
  },
  riddles: [
    {
      title: 'Go for yourself',
      cond: `<p>The Baal HaTurim is Rabbi Yaakov ben Asher (c. 1269–1343), author of the law code <i>Arba’ah Turim</i>. On every verse of the Torah he left short hints: gematria, the first and last letters of words, and words that appear in Tanakh exactly two or three times. Parshat Lech Lecha begins like this:</p><p class="verse" dir="rtl" lang="he">ויאמר ה׳ אל אברם לך לך מארצך וממולדתך ומבית אביך אל הארץ אשר אראך</p><p>“And the L-rd said to Avram: Go for yourself from your land, from your birthplace and from your father’s house, to the land that I will show you.” Then come the blessings: “and I will make you a great nation, and I will bless you, and make your name great…”<sup data-src="gen-12-1"></sup></p><p>Avram was seventy-five years old at the time.<sup data-src="gen-12-4"></sup></p>`,
      steps: [
        {
          q: 'The Baal HaTurim: the first words, <span class="he">לך לך</span> — “go for yourself” — hint at <b>how old</b> Avram will be when Yitzchak is born. What do the words <span class="he">לך לך</span> add up to?',
          hint: 'לך = 30 + 20 — and that twice.',
        },
        {
          q: 'Another hint: Avram set out at 75 — and after that he lived as many years as the words <span class="he">לך לך</span>. How many years did he live in all?',
          hint: '75 + the number of the last step.',
        },
        {
          q: '“To the land that I <span class="he">אראך</span> — will show you.” What is the word <span class="he">אראך</span> worth?',
          hint: '1 + 200 + 1 + 20.',
        },
        {
          q: 'Which word has the same gematria — and tells <b>how</b> G-d showed Avram the way?',
          opts: ['“in the clouds”', '“in the heavens”', '“in the water”', '“by the wind”'],
        },
        {
          q: 'The Baal HaTurim: the final letter <span class="he">ך</span> in the word “those who bless you” has three crowns, <i>tagin</i> (decorations on letters in a Torah scroll). Three times <span class="he">ך</span> — how much is that?',
          hint: 'ך = 20; 3 × 20.',
        },
      ],
      reveal: {
        h: 'A hundred years and the clouds',
        p: '“Lech lecha” is 100: at a hundred Avraham had Yitzchak, and after he set out he lived another hundred years — 175 in all. “Arecha” — “I will show you” — is 222, like “ba-ananim”, “in the clouds”: clouds went before Avraham and showed him the way. And three crowns on ך are 3 × 20 = 60: the number of letters in the Priestly Blessing.',
      },
      lessons: [
        {
          h: 'The beginning — a saying',
          b: `<p>In the story of Creation, “and He said” — <i>va-yomer</i> — appears ten times. The chapter about Avraham opens with the same word: <span class="he">ויאמר ה׳ אל אברם</span>.<sup data-src="bht-12-1"></sup></p>`,
        },
        {
          h: 'A hundred years',
          b: `<p><span class="he">לך לך</span> = 30 + 20 + 30 + 20 = 100.<sup data-src="bht-12-1"></sup> The Torah says: “Avraham was a hundred years old when his son Yitzchak was born to him,”<sup data-src="gen-21-5"></sup> and his whole life was a hundred and seventy-five years:<sup data-src="gen-25-7"></sup> 75 + 100 = 175.</p><p>The single word <span class="he">לך</span> = 30 + 20 = 50 — the number of generations in the last explanation.</p><p class="expl"><b>Explanation.</b> The very first words Avraham heard already held a promise: he will have a son, and he will live to old age.</p>`,
        },
        {
          h: 'Seven blessings',
          b: `<p>Here are these blessings in verses 12:2–3, in order: “I will make you a great nation”, “I will bless you”, “I will make your name great”, “you will be a blessing”, “I will bless those who bless you”, “the one who curses you I will curse”, “all the families of the earth will be blessed through you.”<sup data-src="gen-12-1"></sup> The words “And Avram was very rich” come from the next chapter (13:2).<sup data-src="bht-12-2-1"></sup></p>`,
        },
        {
          h: 'Clouds and the Priestly Blessing',
          b: `<p><span class="he">אראך</span> = 1 + 200 + 1 + 20 = 222; <span class="he">בעננים</span> = 2 + 70 + 50 + 50 + 10 + 40 = 222.<sup data-src="bht-12-2-3"></sup></p><p>The Priestly Blessing is three verses in the book of Numbers.<sup data-src="num-6-24"></sup> Count their letters (the Name of G-d is written with four letters): the first verse has 15, the second 20, the third 25; together 60 = 3 × 20.</p>`,
        },
      ],
      reflection: 'Avraham set out before he knew where to — and clouds showed him the way. What first step toward something good can I take today, even if I can’t yet see the whole path?',
      takeaways: [
        'The chapter about Avraham begins with “and He said” — like the Creation of the world.',
        'לך לך = 100: at a hundred Avraham had Yitzchak; 75 + 100 = 175 — his whole life.',
        'Verses 12:2–3 hold seven blessings for Avraham.',
        'אראך = 222 = בעננים: clouds showed Avraham the way.',
        'Three crowns on ך: 3 × 20 = 60 — the sixty letters of the Priestly Blessing.',
      ],
    },
    {
      title: 'Peace and Shem',
      cond: `<p>The shepherds of Avram and Lot quarreled, and Avram said to Lot: “Let there be no quarrel between me and you… If you go left, I will go right.” Lot chose the plain of the Jordan near Sodom:</p><p class="verse" dir="rtl" lang="he">ויפרדו איש מעל אחיו. אברם ישב בארץ כנען</p><p>“…and they parted from one another. Avram lived in the land of Canaan.”<sup data-src="gen-13-11"></sup></p><p>Later four kings took Lot captive, and Avram freed him. Out to meet Avram came <em>מלכי צדק מלך שלם</em> — Malki-Tzedek, king of Shalem and a priest of the Almighty: he brought out bread and wine and blessed Avram.<sup data-src="gen-14-18"></sup></p>`,
      steps: [
        {
          q: 'Build a word from the <b>last</b> letters of the words <span class="he">איש מעל אחיו אברם</span> (“from one another. Avram”). You may rearrange the letters.',
          hint: 'The last letters are highlighted. You will get a word that means “peace”.',
        },
        {
          q: 'The Baal HaTurim: this peace was promised to Lot’s descendants too — Israel may not make war on them. Which nation came from Lot?',
          opts: ['Moav', 'Egypt', 'Amalek', 'Edom'],
        },
        {
          q: 'Build a word from the <b>first</b> letters of the words <span class="he">מלך שלם</span> (“king of Shalem”). You may rearrange the letters.',
          hint: 'The first letters are highlighted. You will get a two-letter name — the word itself means “name”.',
        },
        {
          q: 'The Baal HaTurim: Malki-Tzedek is Shem. Whose son is he?',
          opts: ['Noach’s', 'Ever’s', 'Terach’s', 'Lot’s'],
        },
      ],
      reveal: {
        h: 'Peace and Shem',
        p: 'The last letters of “from one another. Avram” give “shalom” — peace: Avram and Lot parted to keep the peace, and peace was promised to their descendants: “Do not harass Moav.” The first letters of “melech Shalem”, “king of Shalem”, give “Shem”: Malki-Tzedek is Shem, the son of Noach.',
      },
      lessons: [
        {
          h: 'They parted for the sake of peace',
          b: `<p>The last letters of <span class="he">איש מעל אחיו אברם</span> — <span class="he">ש</span>, <span class="he">ל</span>, <span class="he">ו</span>, <span class="he">ם</span> — form <span class="he">שלום</span>.<sup data-src="bht-13-11"></sup> The last word, <span class="he">אברם</span>, already belongs to the next verse.</p><p>G-d said “Do not harass Moav” to Moshe when Israel passed by the land of Moav: “for I have given Ar to the children of Lot as a heritage.”<sup data-src="deut-2-9"></sup></p><p class="expl"><b>Explanation.</b> Sometimes, to keep the peace, it is better to part calmly than to go on quarreling.</p>`,
        },
        {
          h: 'Malki-Tzedek is Shem',
          b: `<p>The first letters of <span class="he">מלך שלם</span> — <span class="he">מ</span> and <span class="he">ש</span> — form <span class="he">שם</span>.<sup data-src="bht-14-18"></sup> Rashi explains it the same way, following the Midrash.<sup data-src="rashi-14-18"></sup></p><p class="expl"><b>Explanation.</b> Shem, son of Noach, lived through the Flood; the Torah calls him “a priest of the Almighty.”</p>`,
        },
      ],
      reflection: 'Avram let Lot choose the land first — for the sake of peace. In which argument can I give in today to keep the peace?',
      takeaways: [
        'The last letters of “איש מעל אחיו אברם” — שלום: Avram and Lot parted for the sake of peace.',
        'Peace was promised to the descendants too: “Do not harass Moav.”',
        'The first letters of “מלך שלם” — שם: Malki-Tzedek is Shem, the son of Noach.',
      ],
    },
    {
      title: 'Look at the stars',
      cond: `<p>Avram said to G-d: I have no children. And then:</p><p class="verse" dir="rtl" lang="he">ויוצא אתו החוצה ויאמר הבט נא השמימה וספר הכוכבים אם תוכל לספר אתם ויאמר לו כה יהיה זרעך</p><p>“And He took him outside and said: Look up at the sky and count the stars, if you are able to count them. And He said to him: So will your descendants be.” And Avram believed in G-d.<sup data-src="gen-15-5"></sup></p><p>The Baal HaTurim writes that at this time, at the Covenant between the Pieces, Avram was seventy-five years old.</p>`,
      steps: [
        {
          q: 'What is the word <span class="he">כה</span> — “so” — worth?',
          hint: '20 + 5.',
        },
        {
          q: 'The Baal HaTurim: after as many years as there are in the word <span class="he">כה</span>, Avram will have children. He is now 75. How old will he be when his son is born?',
          hint: '75 + the number of the last step.',
        },
        {
          q: '“So <span class="he">יהיה</span> — will — your descendants be.” What is the word <span class="he">יהיה</span> worth?',
          hint: '10 + 5 + 10 + 5.',
        },
        {
          q: 'The Baal HaTurim: this number tells <b>who</b> there will always be this many of in every generation. Who?',
          opts: ['righteous people', 'kings', 'prophets', 'stars'],
        },
      ],
      reveal: {
        h: 'Twenty-five years and thirty righteous people',
        p: '“Koh” — “so” — is 25: in twenty-five years, at a hundred, Avraham will have Yitzchak. “Yihyeh” — “will be” — is 30: there is no generation without thirty righteous people.',
      },
      lessons: [
        {
          h: 'Twenty-five more years',
          b: `<p><span class="he">כה</span> = 20 + 5 = 25.<sup data-src="bht-15-5-1"></sup> 75 + 25 = 100 — “Avraham was a hundred years old when his son Yitzchak was born to him.”<sup data-src="gen-21-5"></sup></p><p>On this verse Rashi brings a midrash: “Go out of your astrology!” — by the stars Avram has no son, but Avraham will.<sup data-src="rashi-15-5"></sup></p>`,
        },
        {
          h: 'Thirty righteous people',
          b: `<p><span class="he">יהיה</span> = 10 + 5 + 10 + 5 = 30.<sup data-src="bht-15-5-2"></sup></p><p class="expl"><b>Explanation.</b> G-d compared Avraham’s descendants to the stars. Stars shine at night — and so the righteous of every generation give light to people when it is dark around them.</p>`,
        },
      ],
      reflection: 'G-d told Avram: “Look up at the sky.” When something good seems impossible to me — can I “lift my eyes” and believe that everything can change?',
      takeaways: [
        'כה = 25: in twenty-five years, at a hundred, Avraham will have Yitzchak.',
        'Rashi: “Go out of your astrology” — by the stars Avram has no son, but Avraham will.',
        'יהיה = 30: in every generation there are thirty righteous people.',
      ],
    },
    {
      title: 'The Covenant between the Pieces',
      cond: `<p>G-d promised Avram the land of Canaan, and Avram asked:</p><p class="verse" dir="rtl" lang="he">ויאמר אד-ני ה׳ במה אדע כי אירשנה</p><p>“…O L-rd G-d, how will I know that I will inherit it?”<sup data-src="gen-15-8"></sup></p><p>Then G-d made a covenant with him — the “Covenant between the Pieces” — and said:</p><p class="verse" dir="rtl" lang="he">ידע תדע כי גר יהיה זרעך בארץ לא להם ועבדום וענו אתם ארבע מאות שנה</p><p>“Know that your descendants will be strangers in a land not theirs; they will be enslaved and oppressed for four hundred years.”<sup data-src="gen-15-13"></sup> And when the sun set — <em>ועלטה היה והנה תנור עשן</em>: “and there was darkness, and behold — a smoking furnace.”<sup data-src="gen-15-17"></sup></p><p>Here the Baal HaTurim counts not only with ordinary gematria. <b>Atbash</b> — every letter is swapped for its “mirror” letter: the first ↔ the last (<span class="he">א</span> ↔ <span class="he">ת</span>), the second ↔ the one before last (<span class="he">ב</span> ↔ <span class="he">ש</span>)… He also counts the <b>last letters</b> of words as a number.</p>`,
      steps: [
        {
          q: 'Write the word <span class="he">במה</span> (“how?”) in atbash: instead of <span class="he">ב</span> write <span class="he">ש</span>, instead of <span class="he">מ</span> — <span class="he">י</span>, instead of <span class="he">ה</span> — <span class="he">צ</span>. What is the new word worth?',
          hint: 'The new letters are shin, yud and tzadi: 300 + 10 + 90.',
        },
        {
          q: 'Add up the <b>last</b> letters of the words <span class="he">כי גר</span> (“that strangers”). How much is it?',
          hint: 'The last letters are י and ר: 10 + 200.',
        },
        {
          q: 'Rashi counts the four hundred years from Yitzchak’s birth: Yitzchak was 60 when Yaakov was born; Yaakov was 130 when he went down to Egypt; and in Egypt there passed as many years as in the last step. How many in all?',
          hint: '60 + 130 + 210.',
        },
        {
          q: 'Build a word from the <b>first</b> letters of the words <span class="he">ועלטה היה והנה תנור</span> (“and there was darkness, and behold — a furnace”). You may rearrange the letters.',
          hint: 'The first letters are highlighted. You will get a word from the second verse of the Torah — “chaos, emptiness”.',
        },
      ],
      reveal: {
        h: 'Four hundred years and tohu',
        p: '“Ba-mah” — “how?” — becomes “shitz” in atbash — 400: for this question Avraham’s descendants were given four hundred years. The last letters of “ki ger” are 210: the years Israel spent in Egypt; together with the years of Yitzchak and Yaakov, 60 + 130 + 210 = 400. And the first letters of “and there was darkness, and behold — a furnace” give “tohu”, chaos: Avraham was shown the exiles.',
      },
      lessons: [
        {
          h: 'Four hundred years',
          b: `<p>In atbash <span class="he">ב</span> → <span class="he">ש</span>, <span class="he">מ</span> → <span class="he">י</span>, <span class="he">ה</span> → <span class="he">צ</span>: <span class="he">שיץ</span> = 300 + 10 + 90 = 400.<sup data-src="bht-15-8"></sup></p><p>The second calculation is ordinary gematria: <span class="he">במה אדע</span> = 47 + 75 = 122 = 52 + 70.</p><p class="expl"><b>Explanation.</b> The seventy years are the Babylonian exile after the destruction of the First Temple.</p>`,
        },
        {
          h: 'Two hundred and ten years',
          b: `<p>The last letters of <span class="he">כי גר</span> are <span class="he">י</span> and <span class="he">ר</span>: 10 + 200 = 210.<sup data-src="bht-15-13"></sup> Rashi explains how the four hundred years fit with two hundred and ten years in Egypt: 60 + 130 + 210 = 400.<sup data-src="rashi-15-13"></sup></p>`,
        },
        {
          h: 'Tohu — chaos',
          b: `<p>The first letters of <span class="he">ועלטה היה והנה תנור</span> — <span class="he">ו</span>, <span class="he">ה</span>, <span class="he">ו</span>, <span class="he">ת</span> — read backward form <span class="he">תוהו</span>.<sup data-src="bht-15-17"></sup></p><p class="expl"><b>Explanation.</b> The word “tohu” comes from the second verse of the Torah: “and the earth was tohu va-vohu”, empty and formless. Exile is like the world before there was light. But then too, as at the beginning of the world, light comes after darkness.</p>`,
        },
      ],
      reflection: 'Avraham asked “how will I know?” — and learned about hard times, but also that they will end. When things are hard for me, do I remember that hard times have an end?',
      takeaways: [
        'במה in atbash — שיץ = 400: the four hundred years given to Avraham’s descendants.',
        'במה אדע = 122 = 52 + 70.',
        'The last letters of “כי גר” — י and ר = 210 years in Egypt; 60 + 130 + 210 = 400.',
        'The first letters of “ועלטה היה והנה תנור” — תוהו: Avraham was shown exiles that are like chaos.',
      ],
    },
    {
      title: 'Father of a multitude',
      cond: `<p>G-d made the covenant of circumcision with Avram and gave him a new name:</p><p class="verse" dir="rtl" lang="he">ולא יקרא עוד את שמך אברם והיה שמך אברהם כי אב המון גוים נתתיך</p><p>“Your name will no longer be called Avram; your name will be Avraham, for I have made you the father of a multitude of nations.”<sup data-src="gen-17-4"></sup></p><p>The words <em>אב המון</em> — “father of a multitude” — are said twice in this chapter. And about the son Sarah will bear it says: <em>ואת בריתי אקים את יצחק</em> — “but My covenant I will establish with Yitzchak.”<sup data-src="gen-17-19"></sup></p>`,
      steps: [
        {
          q: 'What do the words <span class="he">אב המון</span> — “father of a multitude” — add up to?',
          hint: 'אב = 1 + 2; המון = 5 + 40 + 6 + 50.',
        },
        {
          q: 'These words are said <b>twice</b> in the chapter. How much is that together?',
          hint: 'Double the number of the last step.',
        },
        {
          q: 'Whose name has the same gematria?',
          opts: ['Yitzchak', 'Yishmael', 'Yaakov', 'Avraham'],
        },
        {
          q: 'The Baal HaTurim reads the word <span class="he">אקים</span> (“I will establish”) as a <b>notarikon</b>: each of its letters begins a separate word. Which phrase do you get?',
          opts: ['“Who sanctified the beloved one from the womb”', '“father of a multitude of nations”', '“and you shall name him Yitzchak”', '“as an everlasting covenant for his descendants”'],
        },
      ],
      reveal: {
        h: 'Yitzchak in Avraham’s name',
        p: '“Av hamon” is 104, and twice — 208, like “Yitzchak”: Avraham’s new name already hides his son. And “akim” — “I will establish” — is a notarikon of “asher kidesh yedid mi-beten”, “Who sanctified the beloved one from the womb”: words said in the blessing at a brit milah.',
      },
      lessons: [
        {
          h: 'Twice “father of a multitude”',
          b: `<p><span class="he">אב המון</span> = 3 + 101 = 104; 104 + 104 = 208 = <span class="he">יצחק</span> (10 + 90 + 8 + 100).<sup data-src="bht-17-4"></sup> “Arbeh” — “I will multiply” — stands at the start of the same chapter (<span class="he">וארבה אותך</span>, 17:2): <span class="he">ארבה</span> = 1 + 200 + 2 + 5 = 208.</p>`,
        },
        {
          h: 'Sanctified from the womb',
          b: `<p>The first letters of the words <span class="he">אשר קידש ידיד מבטן</span> — <span class="he">א</span>, <span class="he">ק</span>, <span class="he">י</span>, <span class="he">מ</span> — are <span class="he">אקים</span>.<sup data-src="bht-17-21"></sup> These words come from the blessing said at a brit milah; the Gemara quotes it.<sup data-src="shabbat-137b"></sup></p><p class="expl"><b>Explanation.</b> So the covenant G-d established with Yitzchak continues in the brit milah of every Jewish boy.</p>`,
        },
      ],
      reflection: 'Avraham’s new name already hid the name of his future son. Which good deed I do today will become a “heritage” for those who come after me?',
      takeaways: [
        'אב המון = 104; twice — 208 = יצחק: Yitzchak is hidden in Avraham’s name.',
        'ארבה (“I will multiply”) = 208 = יצחק.',
        'אקים — a notarikon of “אשר קידש ידיד מבטן”, words of the blessing at a brit milah.',
      ],
    },
  ],
  memo: {
    intro:
      'Twelve comments of the Baal HaTurim on the portion of Lech Lecha — twelve pairs of cards. Each picture tells about one comment, and its pair is the Torah words that the comment is about.',
    items: [
      {
        title: 'A hundred years until Yitzchak',
        caption: 'Avram and his family set out',
        verse: '“Go for yourself”',
        quote: '“Go for yourself” — He hinted to him: when you are a hundred [years old], the number of “lech lecha”, then “I will make you a great nation” — when Yitzchak was born.',
        explain:
          'The word לך equals 50: ל = 30, ך = 20. “Lech lecha” is twice 50, that is 100. G-d told Avram “go for yourself” when he was seventy-five years old, and Yitzchak was born when Avraham turned one hundred. So the very first words already held a hint: at a hundred you will become the father of a great nation.',
        note: 'Avraham was 100 years old when Yitzchak was born',
        moral: 'G-d’s promise may not come true at once — but it will surely come true.',
      },
      {
        title: 'Ten sayings',
        caption: 'Ten lights — the ten sayings of Creation',
        verse: '“And the L-rd said to Avram”',
        quote: '[The Torah] began with a saying — the language with which the world was created: the world was created with ten sayings, and all of it was created only in the merit of Avraham.',
        explain:
          'The world was created with ten sayings: “And G-d said: Let there be light…” — ten times. The Torah also begins the story of Avraham with the words “and He said”. The Baal HaTurim explains: the whole world was created for the sake of Avraham — for the sake of a man who would teach people to know the Creator.',
        moral: 'The world was created for the sake of good deeds. And my good deeds are also part of why it was created.',
      },
      {
        title: 'Three blessings',
        caption: 'Avram raises his hands: a blessing',
        verse: '“and I will bless you, and make your name great”',
        quote: '“And I will make you a great nation, and I will bless you, and make your name great” — three blessings, corresponding to the three blessings of the Kohanim.',
        explain:
          'Here G-d blesses Avram three times. The Baal HaTurim sees in this the three blessings of the Kohanim: “May He bless you…”, “May He shine…”, “May He lift up…”. The Priestly Blessing has sixty letters, and there is a hint to them too: over the letter ך (20) in the word “those who bless you” there are three little crowns, and three times 20 is 60.',
        moral: 'Avraham’s blessing goes on: the Kohanim still bless his descendants today.',
      },
      {
        title: 'Pharaoh’s gifts',
        caption: 'Pharaoh, struck, sends Avram away',
        verse: '“take her and go”',
        quote: '“Take it in your hand and go”: although it is not stated here that [Pharaoh] gave him gifts, as Avimelech did, he certainly gave them.',
        explain:
          'Pharaoh took Sarai to his palace, and G-d struck his house with heavy plagues. Then Pharaoh returned Sarai and said to Avram: “Here is your wife, take her and go.” The words “and go” (ולך) appear in Tanakh five times; in the book of Jeremiah it says: “The scroll that you read from — take it in your hand and go.” The Baal HaTurim teaches: “and go” means that Avram was handed something from hand to hand — Pharaoh sent him away with gifts. And indeed, Avram left Egypt very rich.',
        moral: 'G-d protects the righteous — even out of trouble, they come away with good.',
      },
      {
        title: 'Parting for peace',
        caption: 'Avram and Lot part with their flocks',
        verse: '“from one another. Avram…”',
        quote: '“And they parted from one another. Avram” — the last letters: שלום (peace). They parted in order to keep the peace.',
        explain:
          'The shepherds of Avram and Lot quarreled. Avram said: “Let there be no quarrel between me and you… If you go left, I will go right.” Take the last letters of the words איש מעל אחיו אברם: ש, ל, ו, ם — they make שלום, “peace”. Avram and Lot did not part out of hatred, but to keep the peace.',
        moral: 'Sometimes, to keep the peace, it is better to give way and part kindly.',
      },
      {
        title: 'The fourteenth year',
        caption: 'A battle at night: Avram rescues Lot',
        verse: '“and in the fourteenth year”',
        quote: 'Just as the nations came against Chizkiyahu and fell into his hand, so they came against Avraham and fell into his hand.',
        explain:
          'Four mighty kings fought against five and took Lot captive. Avram, with a small band, caught up with them at night, defeated them and freed Lot. The words “and in the fourteenth” stand at the beginning of a verse only twice: here and in the book of Kings — “in the fourteenth year of King Chizkiyahu, Sancheriv went up” with a huge army against Jerusalem. The Baal HaTurim links the two stories: both Avram and Chizkiyahu defeated the mightiest enemies with G-d’s help.',
        moral: 'It is not strength or the number of soldiers that decides — help comes from G-d.',
      },
      {
        title: 'Malki-Tzedek is Shem',
        caption: 'Malki-Tzedek brings out bread and wine',
        verse: '“king of Shalem”',
        quote: '“King of Shalem” — the first letters: שם (Shem). This is Shem, the son of Noach.',
        explain:
          'After the victory Malki-Tzedek, king of Shalem and priest of G-d Most High, came out to meet Avram, brought out bread and wine and blessed him. The first letters of the words מלך שלם are מ and ש; swap them — you get שם, Shem. The Baal HaTurim teaches: Malki-Tzedek is Shem, the son of Noach, who was still alive in Avram’s days.',
        moral: 'The righteous of different generations meet and bless each other — that is how good is passed on.',
      },
      {
        title: 'Thirty righteous people',
        caption: 'Avram looks at the stars',
        verse: '“so shall your offspring be”',
        quote: '“Shall be” — in gematria “thirty”: there is no generation without thirty righteous people.',
        explain:
          'G-d took Avram outside his tent and said: “Look at the sky and count the stars… So shall your offspring be.” The word יהיה (“shall be”) equals 30: י = 10, ה = 5, י = 10, ה = 5. The Baal HaTurim teaches: in every generation there are at least thirty righteous people — they shine for the world like stars.',
        note: 'thirty righteous people in every generation',
        moral: 'Anyone can become one of those who shine for their generation.',
      },
      {
        title: 'Two hundred and ten years',
        caption: 'Yaakov’s family goes down to Egypt',
        verse: '“that your offspring shall be strangers”',
        quote: '“That strangers” — the last letters amount to the number רד״ו (210).',
        explain:
          'At the Covenant between the Parts G-d told Avram: “Know that your offspring shall be strangers in a land not theirs.” Take the last letters of the words כי גר: י (10) and ר (200) — together 210, like the word רדו, “go down”. That is how long Israel lived in Egypt: Yaakov and his family went down there, and after 210 years Moshe led the people out to freedom.',
        note: 'the years Avraham’s descendants lived in Egypt',
        moral: 'Even a long exile has its end — and G-d has measured it.',
      },
      {
        title: 'Prayer by the water',
        caption: 'Hagar by a spring in the desert',
        verse: '“by the spring of water”',
        quote: '“By the spring of water”: it is good to pray by water. And prayer is likened to water, as it is written: “Pour out your heart like water.”',
        explain:
          'Hagar, Sarai’s maid, fled into the desert, and an angel of G-d found her “by the spring of water”. These words appear in the Torah once more — when Avraham’s servant stood by a spring and prayed to find a wife for Yitzchak. The Baal HaTurim teaches: it is good to pray by water. And prayer itself is like water — the book of Eichah says: “Pour out your heart like water.”',
        moral: 'To pray is to open your heart to G-d simply and sincerely, the way water flows.',
      },
      {
        title: 'Yitzchak in Avraham’s name',
        caption: 'New names: Avraham and Sarah',
        verse: '“father of a multitude”',
        quote: 'Twice in this chapter — “father of a multitude”, and it amounts to the number of “Yitzchak”. And likewise “I will multiply” — in gematria “Yitzchak”.',
        explain:
          'G-d gave Avram a new name — Avraham: “for I have made you the father of a multitude of nations.” The words אב המון (“father of a multitude”) equal 104, and in the chapter they are written twice: 104 + 104 = 208. Exactly the same as יצחק, Yitzchak: 10 + 90 + 8 + 100. And the word ארבה (“I will multiply”) also equals 208. The new name already held a promise: Avraham and Sarah would have Yitzchak.',
        note: 'twice 104 = 208 = יצחק',
        moral: 'Sometimes what we hope for is already very close — we only need to wait.',
      },
      {
        title: 'The covenant of circumcision',
        caption: 'A circumcision knife and a lamp',
        verse: '“but My covenant I will establish”',
        quote: '“I will establish” — a notarikon: “Who sanctified the beloved one from the womb”.',
        explain:
          'G-d told Avraham: “But My covenant I will establish with Yitzchak.” Take the first letters of the words אשר קידש ידיד מבטן: א, ק, י, מ — they make אקים, “I will establish”. These words are from the blessing said at a brit milah. So the covenant that began with Avraham and Yitzchak continues with every Jewish boy.',
        moral: 'The covenant with G-d passes from generation to generation — and each of us is part of it.',
      },
    ],
  },
  final: {
    title: 'The way is open',
    allSolved:
      'All five riddles are solved. “Lech lecha” is a hundred years until Yitzchak is born, clouds showed Avraham the way, Avram and Lot parted for the sake of peace, Malki-Tzedek is Shem, “koh” is twenty-five years of waiting, “ba-mah” in atbash is four hundred years, and “father of a multitude” hides Yitzchak.',
  },
  audience: 'Addition, multiplying by 2 and 3, atbash and letter games; a familiar story — Avraham’s journey. Younger children — together with an adult.',
  practice:
    'This week, take your own “lech lecha” step: start a good deed you have been putting off — even if you can’t yet see how it will end. Avraham went to the land “that I will show you” — and clouds showed him the way.',
  highlight: '“I will show you” equals “in the clouds”: clouds went before Avraham and showed him the way.',
  share: ({ score, max, time, grid, allSolved, site }) => `☁️ How did Avraham find his way? The answer is hidden in the words “I will show you.”

I’m playing a gematria game based on the Baal HaTurim’s commentary on Parshat Lech Lecha. ${allSolved ? 'All five riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Five riddles: “go for yourself” and the clouds on the way, peace with Lot and Malki-Tzedek, the stars and thirty righteous people, the Covenant between the Pieces and atbash, Avraham’s name and Yitzchak. Can you do better?
Play 👉 ${site}

©mychitas.app`,
  source:
    'Based on the commentary of the Baal HaTurim (Rabbi Yaakov ben Asher, 14th century) on Parshat Lech Lecha (Genesis 12:1–17:27), short version (“Kitzur Baal HaTurim”). Hebrew text — Sefaria.',
};

export default en;
