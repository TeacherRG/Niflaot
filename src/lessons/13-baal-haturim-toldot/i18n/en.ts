import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Baal HaTurim: Toldot',
  hero: {
    heading: 'Baal HaTurim: <i>four riddles about the sons of Yitzchak</i>',
    author: 'based on the commentary of the Baal HaTurim, Rabbi Yaakov ben Asher',
    intro:
      'The Baal HaTurim found hidden words and numbers in Parshat Toldot. Count them yourself: whom Yitzchak looked like, what is hidden in the word “Aramean,” how many nations came out after Yaakov, in whose tents he studied, for how many years Avraham earned his reward — and on which festival Yitzchak blessed Yaakov.',
  },
  summary:
    'Parshat Toldot through the eyes of the Baal HaTurim: “fathered” = 55 = “resembling,” “the Aramean” — the letters of “the cheat,” “his wife” = “straw and fire,” “afterwards” = 70 nations, “a wholehearted man” — Shem, “lands” without ו — six generations until Moshe, “because” = 172 years, “he smelled” = “it was the day of Pesach,” “scent” = “the night of Pesach,” 26 words of blessing.',
  glossary: {
    'תולדות': '“generations,” “the story of the family” — the name of the parshah',
    'הוליד': '“fathered”',
    'אברהם הוליד את יצחק': '“Avraham fathered Yitzchak”',
    'דומה': '“resembling, alike”',
    'שונה': '“different”',
    'גדול': '“big”',
    'קטן': '“small”',
    'לבן הארמי': '“Lavan the Aramean”',
    'הארמי': '“the Aramean” — from Aram',
    'הרמאי': '“the cheat”',
    'אשתו': '“his wife”',
    'ותהר רבקה אשתו': '“and Rivkah his wife conceived”',
    'קש ואש': '“straw and fire”',
    'אש ומים': '“fire and water”',
    'אור וחשך': '“light and darkness”',
    'אבן ועץ': '“stone and wood”',
    'כן': '“so,” here: “afterwards” (ואחרי כן)',
    'ואחרי כן יצא אחיו': '“and afterwards his brother came out”',
    'תם': '“wholehearted, simple”',
    'איש תם': '“a wholehearted man” — so the Torah calls Yaakov',
    'שם': 'Shem — the son of Noach',
    'יעקב': 'Yaakov',
    'מלאך האלהים': '“an angel of G-d”',
    'הגן עדן': '“the Garden of Eden”',
    'איש שדה': '“a man of the field” — so the Torah calls Esav',
    'איש ציד': '“a hunter”',
    'אדום': 'Edom — Esav’s second name',
    'הלעיטני נא מן': '“let me gulp down, please, from…” — Esav’s words',
    'המן': 'Haman — the enemy of the Jews in the Book of Esther',
    'הארצת': '“lands” — written without ו',
    'הארצות': '“lands” — the full spelling, with ו',
    'הארצת האל': '“all these lands”',
    'משה': 'Moshe',
    'אהרן': 'Aharon',
    'יהושע': 'Yehoshua',
    'דוד': 'David',
    'עקב': '“because,” “as a result of”',
    'עקב אשר שמע אברהם בקלי': '“because Avraham listened to My voice”',
    'ויקרא שמה רחבות': '“and he called it Rechovot” — “wide spaces”',
    'לצוד': '“to hunt”',
    'לצוד ציד': '“to hunt game”',
    'מן גזל': '“from stolen goods”',
    'נא אל הצאן': '“please, to the flock”',
    'לך נא אל הצאן': '“go, please, to the flock” — Rivkah’s words to Yaakov',
    'נאה': '“fitting, beautiful”',
    'משם': '“from there”',
    'משלי': '“from my own”',
    'וירח': '“and he smelled”',
    'ריח': '“scent”',
    'וירח את ריח בגדיו': '“and he smelled the scent of his garments”',
    'יום פסח היה': '“it was the day of Pesach”',
    'ליל פסח': '“the night of Pesach”',
    'ליל שבת': '“Shabbat night”',
    'יום כפור': '“Yom Kippur”',
    'ראש השנה': '“Rosh Hashanah”',
    'ויאמר מי אפוא': '“and he said: who, then…”',
    'אמו': '“his mother”',
  },
  translit: {
    'הוליד': 'holid',
    'אשתו': 'ishto',
    'כן': 'ken',
    'תם': 'tam',
    'יעקב': 'Yaakov',
    'הארצת': 'ha’aratzot',
    'עקב': 'ekev',
    'וירח': 'vayarach',
    'ריח': 're’ach',
  },
  riddles: [
    {
      title: 'Like his father',
      cond: `<p>The Baal HaTurim is Rabbi Yaakov ben Asher (c. 1269–1343), author of the law code “Arba’ah Turim.” On every verse of the Torah he left short hints: gematria, first and last letters of words, words that appear in Tanach only two or three times. Parshat Toldot begins like this:</p><p class="verse" dir="rtl" lang="he">ואלה תולדת יצחק בן אברהם אברהם הוליד את יצחק</p><p>“These are the generations of Yitzchak, the son of Avraham: Avraham fathered Yitzchak.”<sup data-src="gen-25-19"></sup> Yitzchak married Rivkah, the daughter of Betuel the Aramean, the sister of Lavan the Aramean.<sup data-src="gen-25-20"></sup> For twenty years they had no children; Yitzchak prayed for his wife — and G-d answered him: “and Rivkah his wife conceived.”<sup data-src="gen-25-21"></sup></p>`,
      steps: [
        {
          q: 'What does the word <span class="he">הוליד</span> — “fathered” — equal?',
          hint: 'ה = 5, ו = 6, ל = 30, י = 10, ד = 4.',
        },
        {
          q: 'Which word equals this number — and tells <b>how</b> Yitzchak looked next to his father?',
          opts: ['resembling', 'different', 'big', 'small'],
        },
        {
          q: 'Lavan is called <span class="he">הארמי</span> — “the Aramean.” Rearrange all the letters of this word. Which word about Lavan do you get?',
          hint: 'The word begins with ה and ends with י: Lavan will later cheat Yaakov.',
        },
        {
          q: 'What does the word <span class="he">אשתו</span> — “his wife” — equal?',
          hint: 'א = 1, ש = 300, ת = 400, ו = 6.',
        },
        {
          q: 'Rivkah was carrying two sons — Yaakov and Esav. Which two words equal this number — and tell what their descendants will be for each other?',
          opts: ['“straw and fire”', '“fire and water”', '“light and darkness”', '“stone and wood”'],
        },
      ],
      reveal: {
        h: 'Straw and fire',
        p: '“Holid,” “fathered,” = 55 = “domeh,” “resembling”: Yitzchak’s face looked like Avraham’s. “Ha’arami,” “the Aramean,” has the same letters as “haramai,” “the cheat.” And “ishto,” “his wife,” = 707 = “kash va’esh,” “straw and fire”: the house of Yaakov is fire, and the house of Esav is straw.',
      },
      lessons: [
        {
          h: 'A face like his father’s',
          b: `<p><span class="he">הוליד</span> = 5 + 6 + 30 + 10 + 4 = 55; <span class="he">דומה</span> = 4 + 6 + 40 + 5 = 55.<sup data-src="bht-25-19"></sup></p><p>The verse says it twice: “Yitzchak, the son of Avraham” and “Avraham fathered Yitzchak.” Rashi explains why this is needed.<sup data-src="rashi-25-19"></sup></p><p class="expl"><b>Explanation.</b> A son who looks like his father is a testimony for everyone. But Yitzchak’s main likeness to Avraham was not in his face but in his path: he continued his father’s work.</p>`,
        },
        {
          h: 'The Aramean and the cheat',
          b: `<p>The letters of <span class="he">הארמי</span>: ה, א, ר, מ, י — rearranged: <span class="he">הרמאי</span>, “the cheat.”<sup data-src="bht-25-20-2"></sup></p><p class="expl"><b>Explanation.</b> Rivkah grew up in the house of Betuel and Lavan — and still became a tzaddeket. The place where a person grows up does not decide for him what he will be.</p>`,
        },
        {
          h: 'Straw and fire',
          b: `<p><span class="he">אשתו</span> = 1 + 300 + 400 + 6 = 707; <span class="he">קש ואש</span> = 400 + 307 = 707.<sup data-src="bht-25-21-2"></sup></p><p>These are the words of the prophet Ovadiah: “The house of Yaakov shall be fire, and the house of Yosef a flame, and the house of Esav straw.”<sup data-src="obadiah-1-18"></sup></p><p class="expl"><b>Explanation.</b> Already at the moment Rivkah conceived, it was said how the struggle of her sons would end: fire is stronger than straw. A small fire can light a lot of straw — and straw cannot put out fire.</p>`,
        },
      ],
      reflection: 'Yitzchak was like his father — in his face and in his deeds. What good thing do I want to learn from my parents or teachers?',
      takeaways: [
        'הוליד = 55 = דומה: Yitzchak’s face looked like Avraham’s.',
        'הארמי has the same letters as הרמאי, “the cheat.”',
        'אשתו = 707 = קש ואש: the house of Yaakov is fire, the house of Esav straw.',
      ],
    },
    {
      title: 'Two from one womb',
      cond: `<p>Rivkah gave birth to twins. Esav came out first, red and all covered with hair.</p><p class="verse" dir="rtl" lang="he">ואחרי כן יצא אחיו וידו אחזת בעקב עשו</p><p>“And afterwards his brother came out, his hand holding on to Esav’s heel, and he was named Yaakov.”<sup data-src="gen-25-26"></sup> The boys grew up — and became very different:</p><p class="verse" dir="rtl" lang="he">ויעקב איש תם ישב אהלים</p><p>“Esav was a man who knew hunting, a man of the field, and Yaakov was a wholehearted man, dwelling in tents.”<sup data-src="gen-25-27"></sup></p>`,
      steps: [
        {
          q: 'What does the word <span class="he">כן</span> equal — from the words “and afterwards his brother came out”?',
          hint: 'כ = 20, ן = 50.',
        },
        {
          q: 'Take the last letters of the words <span class="he">איש תם</span> — “a wholehearted man.” Whose name do you get? The letters may be rearranged.',
          hint: 'The two-letter name of a son of Noach.',
        },
        {
          q: 'The word <span class="he">תם</span> = 440. The Baal HaTurim: that is how many years would pass until the Shechinah “dwelt in a tent” — in the Beit HaMikdash. From the Exodus to the building of the Beit HaMikdash were 480 years, and 40 of them Israel was in the desert. How many years passed from entering the Land of Israel until the Beit HaMikdash was built?',
          hint: '480 − 40.',
        },
        {
          q: 'What does the name <span class="he">יעקב</span> equal?',
          hint: 'י = 10, ע = 70, ק = 100, ב = 2.',
        },
        {
          q: 'Which words equal the name of Yaakov?',
          opts: ['“an angel of G-d”', '“a man of the field”', '“a hunter”', 'Edom'],
        },
      ],
      reveal: {
        h: 'Learning in the tents of Shem',
        p: '“Ken” = 70: after Esav “come out” the seventy nations of the world, while Yaakov is one. The last letters of “ish tam” — Shem: Yaakov sat in the tents of Shem and studied. “Tam” = 440 — the years from entering the Land until the Beit HaMikdash. And “Yaakov” = 182 = “malach ha’Elokim,” “an angel of G-d.”',
      },
      lessons: [
        {
          h: 'Seventy nations',
          b: `<p><span class="he">כן</span> = 20 + 50 = 70.<sup data-src="bht-25-26-1"></sup></p><p class="expl"><b>Explanation.</b> First Esav came out, “and afterwards” — Yaakov. The nations of the world are seventy, and Israel is one, special. Importance is not measured by numbers.</p>`,
        },
        {
          h: 'The tents of Shem',
          b: `<p>The last letters of <span class="he">איש תם</span>: ש, ם — <span class="he">שם</span>, Shem.<sup data-src="bht-25-27"></sup> Rashi also tells in whose tents Yaakov sat.<sup data-src="rashi-25-27"></sup></p><p><span class="he">תם</span> = 400 + 40 = 440. “In the four hundred and eightieth year after the children of Israel came out of Egypt… he began to build the House of the L-rd.”<sup data-src="kings1-6-1"></sup> 480 − 40 years in the desert = 440.</p><p class="expl"><b>Explanation.</b> Yaakov’s tent of learning is the beginning of the road that leads to the Beit HaMikdash. Where Torah is studied, the Shechinah dwells.</p>`,
        },
        {
          h: 'An angel of G-d',
          b: `<p><span class="he">יעקב</span> = 10 + 70 + 100 + 2 = 182; <span class="he">מלאך האלהים</span> = 91 + 91 = 182, and <span class="he">הגן עדן</span> = 58 + 124 = 182.<sup data-src="bht-25-27"></sup></p><p class="expl"><b>Explanation.</b> Yaakov is “a wholehearted man”: his words and his deeds are the same. Such a person is like an angel — an angel always does what it was sent to do.</p>`,
        },
      ],
      reflection: 'Yaakov was “wholehearted”: what he said is what he thought. Where can I today say exactly what I think — honestly and kindly?',
      takeaways: [
        'כן = 70: the seventy nations of the world — besides Yaakov.',
        'The last letters of “איש תם” — שם: Yaakov studied in the tents of Shem.',
        'תם = 440 = 480 − 40: from entering the Land until the Beit HaMikdash.',
        'יעקב = 182 = מלאך האלהים.',
      ],
    },
    {
      title: 'A reward for listening',
      cond: `<p>There was a famine in the land, and Yitzchak went to Gerar. G-d told him: do not go down to Egypt, live in this land —</p><p class="verse" dir="rtl" lang="he">כי לך ולזרעך אתן את כל הארצת האל</p><p>“…for to you and to your descendants I will give all these lands, and I will fulfill the oath that I swore to Avraham your father.”<sup data-src="gen-26-3"></sup> And why?</p><p class="verse" dir="rtl" lang="he">עקב אשר שמע אברהם בקלי</p><p>“Because Avraham listened to My voice and kept My charge, My commandments, My statutes and My laws.”<sup data-src="gen-26-5"></sup></p>`,
      steps: [
        {
          q: 'In full, the word “lands” is written <span class="he">הארצות</span>, but here it is <span class="he">הארצת</span>. Which letter is missing? Tap it.',
        },
        {
          q: 'The letter ו = 6. The Baal HaTurim: the land will be given after six generations — Yitzchak, Yaakov, Levi, Kehat, Amram and… Who is the sixth?',
          opts: ['Moshe', 'Aharon', 'Yehoshua', 'David'],
        },
        {
          q: 'What does the word <span class="he">עקב</span> — “because” — equal?',
          hint: 'ע = 70, ק = 100, ב = 2.',
        },
        {
          q: 'Avraham lived 175 years. Our Sages say he recognized his Creator when he was three years old. For how many years did Avraham “listen to His voice”?',
          hint: '175 − 3.',
        },
      ],
      reveal: {
        h: 'One hundred and seventy-two years',
        p: '“Ha’aratzot” without ו: the land will be given after six generations, in the days of Moshe. And “ekev” = 172: Avraham recognized his Creator at three and lived 175 years — for 172 years he listened to His voice. And the Ten Commandments also have 172 words.',
      },
      lessons: [
        {
          h: 'Six generations',
          b: `<p>The word <span class="he">הארצת</span> has no ו, and ו = 6.<sup data-src="bht-26-3-2"></sup></p><p class="expl"><b>Explanation.</b> G-d’s promise will surely come true, even if one has to wait a long time: the land was promised to Yitzchak, and they would enter it in the days of Moshe and Yehoshua — six generations later.</p>`,
        },
        {
          h: 'One hundred and seventy-two',
          b: `<p><span class="he">עקב</span> = 70 + 100 + 2 = 172.<sup data-src="bht-26-5-1"></sup> Avraham lived 175 years<sup data-src="gen-25-7"></sup>, and he recognized his Creator at the age of three — so says the Talmud.<sup data-src="nedarim-32a"></sup> 175 − 3 = 172.</p><p>The verse <span class="he">עקב אשר שמע אברהם בקלי וישמר משמרתי מצותי חקותי ותורתי</span> has 10 words, and the Ten Commandments (Shemot 20:2–14) have 172 words.<sup data-src="ex-20-2"></sup></p><p class="expl"><b>Explanation.</b> Avraham did not learn the commandments once — he listened to G-d’s voice every year of his life. That is why the reward went to his children too.</p>`,
        },
      ],
      reflection: 'Avraham listened to G-d’s voice for 172 years — every day. What one good deed can I do every day, not just sometimes?',
      takeaways: [
        'הארצת without ו (= 6): the land — after six generations, in the days of Moshe.',
        'עקב = 172 = 175 − 3: that is how many years Avraham listened to G-d’s voice.',
        'The Ten Commandments have 172 words.',
      ],
    },
    {
      title: 'A blessing on Pesach',
      cond: `<p>Yitzchak grew old, his eyes grew dim, and he wanted to bless Esav. Rivkah heard this and said to Yaakov:</p><p class="verse" dir="rtl" lang="he">לך נא אל הצאן וקח לי משם שני גדיי עזים טבים</p><p>“Go, please, to the flock and take me from there two good young goats, and I will make them into a dish for your father, the way he loves it.”<sup data-src="gen-27-9"></sup> Yaakov came to his father.</p><p class="verse" dir="rtl" lang="he">וירח את ריח בגדיו</p><p>“And he came close and kissed him, and he smelled the scent of his garments and blessed him.”<sup data-src="gen-27-27"></sup> This is the blessing:</p><p class="verse" dir="rtl" lang="he">ויתן לך האלהים מטל השמים ומשמני הארץ ורב דגן ותירש יעבדוך עמים וישתחו לך לאמים הוה גביר לאחיך וישתחוו לך בני אמך ארריך ארור ומברכיך ברוך</p><p>“May G-d give you of the dew of the heavens and of the fat of the earth, and plenty of grain and wine. May nations serve you…”<sup data-src="gen-27-28"></sup></p>`,
      steps: [
        {
          q: 'Rivkah said: “go,” <span class="he">לך</span>, — and then <span class="he">נא אל הצאן</span>. Take the first letters of these three words — the letters may be rearranged. Which word do you get?',
          hint: 'A three-letter word: “fitting, beautiful.”',
        },
        {
          q: 'What does the word <span class="he">וירח</span> — “and he smelled” — equal?',
          hint: 'ו = 6, י = 10, ר = 200, ח = 8.',
        },
        {
          q: 'What does the word <span class="he">ריח</span> — “scent” — equal?',
          hint: 'ר = 200, י = 10, ח = 8.',
        },
        {
          q: 'The Baal HaTurim: “and he smelled” = “it was the day of Pesach.” And which words equal the word “scent”?',
          opts: ['“the night of Pesach”', '“Shabbat night”', '“Yom Kippur”', '“Rosh Hashanah”'],
        },
        {
          q: 'Count the words of the blessing in Hebrew — from <span class="he">ויתן</span> to <span class="he">ברוך</span>. How many are there?',
          hint: 'The first verse has 10 words, the second 16.',
        },
      ],
      reveal: {
        h: 'Twenty-six words',
        p: 'The first letters of “na el hatzon” — “na’eh”: “lech — na’eh lach,” “it is fitting for you.” “Vayarach” = 224 = “yom Pesach hayah,” “it was the day of Pesach,” and “re’ach” = 218 = “leil Pesach,” “the night of Pesach”: Yitzchak blessed Yaakov on Pesach. And the blessing has 26 words, like the number of the four-letter Name.',
      },
      lessons: [
        {
          h: 'Two young goats',
          b: `<p>The first letters of <span class="he">נא אל הצאן</span>: נ, א, ה — <span class="he">נאה</span>, “fitting.”<sup data-src="bht-27-9"></sup> <span class="he">משם</span> = 40 + 300 + 40 = 380; <span class="he">משלי</span> = 40 + 300 + 30 + 10 = 380.</p><p>Rashi also explains why the goats were “from her own.”<sup data-src="rashi-27-9"></sup></p><p class="expl"><b>Explanation.</b> For a mitzvah Rivkah took not what belonged to others but her own — what was due to her by her ketubah. A mitzvah done with what belongs to others is no mitzvah.</p>`,
        },
        {
          h: 'The scent of Pesach',
          b: `<p><span class="he">וירח</span> = 6 + 10 + 200 + 8 = 224; <span class="he">יום פסח היה</span> = 56 + 148 + 20 = 224.<sup data-src="bht-27-27-2"></sup></p><p><span class="he">ריח</span> = 200 + 10 + 8 = 218; <span class="he">ליל פסח</span> = 70 + 148 = 218.<sup data-src="bht-27-27-3"></sup></p><p class="expl"><b>Explanation.</b> Pesach is a time when G-d blesses and frees. On the night Israel leaves Egypt, Yaakov’s blessing will come true too.</p>`,
        },
        {
          h: 'Ten and twenty-six',
          b: `<p>The verse <span class="he">ויתן לך האלהים מטל השמים ומשמני הארץ ורב דגן ותירש</span> has 10 words.<sup data-src="bht-27-28"></sup> And the whole blessing has 10 + 16 = 26 words; the four-letter Name = 10 + 5 + 6 + 5 = 26.<sup data-src="bht-27-29-1"></sup></p><p class="expl"><b>Explanation.</b> Yitzchak did not bless his son by himself: in every word of the blessing is G-d’s Name. A person passes the blessing on, but G-d gives it.</p>`,
        },
      ],
      reflection: 'Rivkah took “her own” for the mitzvah, not someone else’s. What of my own — time, strength, a thing — can I give today to a good deed?',
      takeaways: [
        'The first letters of “נא אל הצאן” — נאה; משם = 380 = משלי.',
        'וירח = 224 = יום פסח היה; ריח = 218 = ליל פסח.',
        'Yaakov’s blessing has 26 words, like the number of the Name.',
      ],
    },
  ],
  memo: {
    intro:
      'Twelve comments of the Baal HaTurim on Parshat Toldot — twelve pairs of cards. Each picture tells about one comment, and its pair is the Torah words it speaks about.',
    items: [
      {
        title: 'Like his father',
        caption: 'A father and son with similar faces',
        verse: '“Avraham fathered Yitzchak”',
        quote: '“Fathered” — in gematria “resembling”: Yitzchak’s face looked like Avraham’s.',
        explain:
          'The word הוליד (“fathered”) = 55, and דומה (“resembling”) = 55. Rashi explains: mockers said that Yitzchak was not Avraham’s son. So G-d made Yitzchak’s face look like his father’s — and everyone saw the truth.',
        moral: 'The best testimony is deeds like our parents’ deeds.',
      },
      {
        title: 'The Aramean cheat',
        caption: 'The mask of a trickster',
        verse: '“Lavan the Aramean”',
        quote: '“Lavan the Aramean” — the letters of “the cheat.”',
        explain:
          'Rearrange the letters of הארמי (“the Aramean”) — and you get הרמאי (“the cheat”). Lavan will later cheat Yaakov: he will give him Leah instead of Rachel. And Rivkah grew up in such a family — and became a tzaddeket.',
        moral: 'Where you grew up does not decide who you will be.',
      },
      {
        title: 'Straw and fire',
        caption: 'A fire and a bundle of straw',
        verse: '“and Rivkah his wife conceived”',
        quote: '“His wife” — in gematria “straw and fire”: the house of Yaakov is fire, and the house of Esav straw.',
        explain:
          'The word אשתו = 707, and קש ואש (“straw and fire”) = 707. Rivkah carried two sons. The prophet Ovadiah said: the house of Yaakov will be fire, and the house of Esav straw. Fire is stronger than straw.',
        moral: 'A small fire is stronger than a big pile of straw.',
      },
      {
        title: 'Seventy and one',
        caption: 'Many flags and one star',
        verse: '“and afterwards his brother came out”',
        quote: '“Ken” equals seventy: seventy nations — besides Yaakov.',
        explain:
          'The word כן = 20 + 50 = 70. First Esav was born, “and afterwards” Yaakov. The nations of the world are seventy, and Israel is one, special.',
        note: 'the 70 nations of the world',
        moral: 'Importance is not measured by numbers.',
      },
      {
        title: 'The tents of Shem',
        caption: 'Yaakov studies in a tent',
        verse: '“a wholehearted man”',
        quote: '“A wholehearted man” — the last letters spell “Shem”: he sat in the tents of Shem and studied.',
        explain:
          'The last letters of the words איש תם: ש, ם — שם, Shem, the son of Noach. Yaakov sat in the tent and learned Torah from Shem and his great-grandson Ever.',
        moral: 'A wholehearted person is one who learns.',
      },
      {
        title: 'Bread and Haman',
        caption: 'A bowl of lentils and bread',
        verse: '“let me gulp down, please, from…”',
        quote: '“Let me gulp down, please, from” — the first letters spell “Haman”: as Yaakov bought Esav’s birthright for bread, so Mordechai “bought” Haman for a piece of bread.',
        explain:
          'The first letters of the words הלעיטני נא מן: ה, נ, מ — המן, Haman. Esav sold his birthright for bread and lentils. And many years later Esav’s descendant Haman “sold” himself to Mordechai as a slave for a piece of bread.',
        moral: 'Whoever does not value what is holy loses it for a bowl of lentils.',
      },
      {
        title: 'Six generations',
        caption: 'A ladder with six steps',
        verse: '“all these lands”',
        quote: '“Lands” — written without vav: the land will be given after six generations — Yitzchak, Yaakov, Levi, Kehat, Amram, Moshe.',
        explain:
          'In full the word is written הארצות, but here it is הארצת, without ו. The letter ו = 6: the promise to Yitzchak will come true after six generations, in the days of Moshe.',
        moral: 'G-d’s promise comes true, even if we have to wait long.',
      },
      {
        title: '172 years',
        caption: 'A boy looks at the stars',
        verse: '“because Avraham listened to My voice”',
        quote: 'For 172 years he listened to My voice: at three he recognized his Creator, and he lived 175 years.',
        explain:
          'The word עקב = 70 + 100 + 2 = 172. Avraham lived 175 years and recognized his Creator at three: 175 − 3 = 172. And the Ten Commandments also have 172 words.',
        note: 'for 172 years Avraham listened to G-d’s voice',
        moral: 'We should listen to G-d every day of our life.',
      },
      {
        title: 'The well “Wide Spaces”',
        caption: 'A well in a wide open field',
        verse: '“and he called it Rechovot”',
        quote: '“Rechovot” — against Greece, which forbade immersing; and a miracle happened: everyone found a mikveh.',
        explain:
          'Yitzchak dug three wells — Esek, Sitnah and Rechovot. The Baal HaTurim: these are three exiles. Rechovot is Greece: the Greeks forbade the Jews to immerse in a mikveh, and G-d made a miracle — everyone had water.',
        moral: 'Even when it is forbidden, G-d opens wide spaces.',
      },
      {
        title: 'Hunting with stolen goods',
        caption: 'A bow and an arrow',
        verse: '“to hunt game”',
        quote: '“To hunt” — in gematria “from stolen goods.”',
        explain:
          'The word לצוד = 130, and מן גזל (“from stolen goods”) = 130. Esav went hunting to bring his father a dish. The Baal HaTurim hints: he might have obtained even this dishonestly.',
        moral: 'A gift from stolen goods is no gift.',
      },
      {
        title: 'The scent of Pesach',
        caption: 'A Pesach table',
        verse: '“and he smelled the scent of his garments”',
        quote: '“And he smelled” — in gematria “it was the day of Pesach”; “scent” — in gematria “the night of Pesach.”',
        explain:
          'וירח = 224 = יום פסח היה, and ריח = 218 = ליל פסח. Yitzchak blessed Yaakov on Pesach. And Rashi says: Yaakov’s garments had the scent of the Garden of Eden.',
        moral: 'Pesach is a time of blessing.',
      },
      {
        title: 'Who was it?',
        caption: 'A mother hugs her son',
        verse: '“and he said: who, then…”',
        quote: '“And he said: who, then” — the first letters spell “his mother”: who arranged this? Rivkah.',
        explain:
          'Yitzchak trembled and asked: “Who, then, was it?” The first letters of the words ויאמר מי אפוא: ו, מ, א — אמו, “his mother.” It was Rivkah who arranged that Yaakov received the blessing.',
        moral: 'A mother sees what is fitting for whom.',
      },
    ],
  },
  daily: {
    intro:
      'Parshat Toldot every day: two comments of the Baal HaTurim — from Sunday to Friday. The verse, the Baal HaTurim’s words in Hebrew with a translation, and an explanation — about five minutes.',
    items: [
      {
        h: 'Like his father',
        b: '<p><span class="he">הוליד</span> = 5 + 6 + 30 + 10 + 4 = 55 = <span class="he">דומה</span>.</p><p>Why does the Torah say twice: “Yitzchak, the son of Avraham” and “Avraham fathered Yitzchak”? Rashi: the mockers of that generation said that Sarah had conceived from Avimelech. So G-d made Yitzchak’s face look like Avraham’s — and everyone acknowledged: “Avraham fathered Yitzchak.”</p><p class="expl"><b>Explanation.</b> A son who looks like his father is a testimony. A son who continues his father’s path is an even stronger one.</p>',
      },
      {
        h: 'Straw and fire',
        b: '<p><span class="he">אשתו</span> = 1 + 300 + 400 + 6 = 707 = <span class="he">קש ואש</span>.</p><p>The Baal HaTurim brings the words of the prophet Ovadiah (1:18): “The house of Yaakov shall be fire, and the house of Yosef a flame, and the house of Esav straw.”</p><p class="expl"><b>Explanation.</b> Already at the moment Rivkah conceived, it was said how the struggle of her sons would end: fire is stronger than straw. A little light pushes away much darkness.</p>',
      },
      {
        h: 'Seventy nations',
        b: '<p><span class="he">כן</span> = 20 + 50 = 70.</p><p>First Esav came out, “and afterwards” Yaakov. In the Torah, seventy nations came from the sons of Noach; Israel is not counted among them.</p><p class="expl"><b>Explanation.</b> There are many nations, and Israel is one. Its task is not to become “the seventy-first,” but to be special.</p>',
      },
      {
        h: 'The tents of Shem',
        b: '<p>The last letters of <span class="he">איש תם</span>: ש, ם — <span class="he">שם</span>, Shem. <span class="he">תם</span> = 400 + 40 = 440: from the Exodus to the Beit HaMikdash were 480 years (I Kings 6:1), without the forty years in the desert — 440.</p><p><span class="he">יעקב</span> = 10 + 70 + 100 + 2 = 182 = <span class="he">מלאך האלהים</span> = <span class="he">הגן עדן</span>.</p><p class="expl"><b>Explanation.</b> Yaakov’s tent of learning is the beginning of the road to the Beit HaMikdash. Where Torah is studied, the Shechinah dwells.</p>',
      },
      {
        h: 'Bread and Haman',
        b: '<p>The first letters of <span class="he">הלעיטני נא מן</span>: ה, נ, מ — <span class="he">המן</span>, Haman.</p><p>Esav came back from the field tired and sold his birthright for bread and lentil stew. The Midrash tells: in the days of Esther, Haman, Esav’s descendant, asked Mordechai for bread — and “sold” himself to him as a slave for a piece of bread.</p><p class="expl"><b>Explanation.</b> Whoever trades the eternal for the momentary ends up in debt himself. What is holy is not sold for a bowl of stew.</p>',
      },
      {
        h: 'Six generations',
        b: '<p>In full — <span class="he">הארצות</span>, in the Torah — <span class="he">הארצת</span>: without ו, and ו = 6.</p><p>Yitzchak, Yaakov, Levi, Kehat, Amram, Moshe — six generations. In the days of Moshe, Israel left Egypt and set out for the promised land.</p><p class="expl"><b>Explanation.</b> G-d’s promise comes true exactly — even if generations pass between the word and the deed.</p>',
      },
      {
        h: 'One hundred and seventy-two',
        b: '<p><span class="he">עקב</span> = 70 + 100 + 2 = 172. Avraham lived 175 years (Bereishit 25:7) and recognized his Creator at three (Nedarim 32a): 175 − 3 = 172.</p><p>The verse has 10 words, like the Ten Commandments, and the Commandments themselves (Shemot 20:2–14) have 172 words. Avraham passed ten tests, and the world was created with ten utterances.</p><p class="expl"><b>Explanation.</b> Avraham listened to G-d’s voice not once but for all 172 years — and that is why the blessing passed to his son.</p>',
      },
      {
        h: 'Three wells — three exiles',
        b: '<p>Yitzchak dug three wells: Esek (“quarrel”), Sitnah (“hostility”) and Rechovot (“wide spaces”).</p><p>The Baal HaTurim: Esek is Babylon, which “oppressed” Yehudah; Sitnah is Haman, who wrote an “accusation” against Yerushalayim (the word שטנה appears once more, in the Book of Ezra, 4:6); Rechovot is Greece: the Greeks forbade immersing in a mikveh, but a miracle happened — everyone found water. “And we will be fruitful in the land.”</p><p class="expl"><b>Explanation.</b> After quarrel and hostility come wide spaces. Exiles end — and Yitzchak’s well remains.</p>',
      },
      {
        h: 'Hunting with stolen goods',
        b: '<p><span class="he">לצוד</span> = 30 + 90 + 6 + 4 = 130 = <span class="he">מן גזל</span>.</p><p>Yitzchak asked Esav to hunt game and prepare a dish. The Baal HaTurim hints: Esav might bring something obtained dishonestly.</p><p class="expl"><b>Explanation.</b> A good deed done in a dishonest way loses its power. A gift from stolen goods is no gift.</p>',
      },
      {
        h: 'Two young goats',
        b: '<p>The first letters of <span class="he">נא אל הצאן</span>: נ, א, ה — <span class="he">נאה</span>. The first letters of <span class="he">וקח לי משם שני</span>: ו, ל, מ, ש — <span class="he">משלו</span>, “from his own”; <span class="he">משם</span> = 380 = <span class="he">משלי</span>.</p><p>It was Pesach: one goat for the Pesach offering, the other for the festival offering. And they were “from my own”: so Yitzchak wrote for Rivkah in her ketubah (Rashi).</p><p class="expl"><b>Explanation.</b> For a mitzvah we take what is our own, honestly earned — and the very best: “two good young goats.”</p>',
      },
      {
        h: 'The scent of Pesach',
        b: '<p><span class="he">וירח</span> = 6 + 10 + 200 + 8 = 224 = <span class="he">יום פסח היה</span>. <span class="he">ריח</span> = 200 + 10 + 8 = 218 = <span class="he">ליל פסח</span>.</p><p>Rashi: Yaakov’s garments had the scent of the Garden of Eden.</p><p class="expl"><b>Explanation.</b> Yitzchak blessed Yaakov on Pesach — the festival on which G-d would later bring his descendants to freedom.</p>',
      },
      {
        h: 'Who was it?',
        b: '<p>The first letters of <span class="he">ויאמר מי אפוא</span>: ו, מ, א — <span class="he">אמו</span>, “his mother.”</p><p>Yitzchak “trembled a very great trembling” and asked: “Who, then, was it?” The answer is hidden in the question itself: Rivkah arranged everything. And Yitzchak said: “He shall indeed be blessed.”</p><p class="expl"><b>Explanation.</b> Rivkah saw to whom the blessing was fitting and was not afraid to act. And Yitzchak, once he understood, agreed with her.</p>',
      },
    ],
  },
  final: {
    title: 'The blessing went to Yaakov',
    allSolved:
      'All four riddles are solved. Yitzchak looked like Avraham, and Lavan “the Aramean” is “the cheat”; the house of Yaakov is fire, the house of Esav straw; after Esav come seventy nations, while Yaakov studied in the tents of Shem and equals “an angel of G-d”; the land will be given after six generations, because Avraham listened to G-d’s voice for 172 years; and Yaakov received the blessing on Pesach — twenty-six words, like the number of the Name.',
  },
  audience: 'Gematria of one or two words, subtraction, letter games; a familiar story — Yaakov and Esav, the lentil stew and Yitzchak’s blessing. Younger children — together with an adult.',
  practice:
    'This week do a good deed “from your own” — with your own time, your own strength, your own pocket money — and do it as well as you can, the way Rivkah chose “two good young goats.”',
  highlight: '“Scent” equals “the night of Pesach”: Yitzchak blessed Yaakov on Pesach.',
  share: ({ score, max, time, grid, allSolved, site }) => `🍲 Which name is hidden in Esav’s words “let me gulp down”? The answer is in the first letters.

I’m playing a gematria game based on the Baal HaTurim’s commentary on Parshat Toldot. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: whom Yitzchak looked like and what “straw and fire” means, how many nations came out after Yaakov and in whose tents he studied, Avraham’s 172 years, and on which festival Yitzchak blessed Yaakov. Can you do better?
Play 👉 ${site}

©mychitas.app`,
  source:
    'Based on the commentary of the Baal HaTurim (Rabbi Yaakov ben Asher, 14th century) on Parshat Toldot (Bereishit 25:19–28:9), the short version (“Kitzur Baal HaTurim”). Hebrew text — Sefaria.',
};

export default en;
