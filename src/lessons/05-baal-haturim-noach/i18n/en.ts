import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Baal HaTurim: Noach',
  hero: {
    heading: 'Baal HaTurim: <i>five riddles of Noach and the Flood</i>',
    author: 'after the commentary of the Baal HaTurim, Rabbi Yaakov ben Asher',
    intro:
      'The Baal HaTurim found numbers and hidden words in the portion of Noach. Count for yourself: what kind of man Noach was, how many days the Flood lasted, who else was saved with the ark, and what happened after the Flood — with the wine, the tower and the language; and how to count in atbash and “with the kolel”.',
    art: 'The ark on the mountains after the flood: a rainbow, a dove with an olive leaf, the animals coming down, Noach giving thanks',
  },
  summary:
    'The portion of Noach through the eyes of the Baal HaTurim: “chamas” = “the waters of Noach”, “ketz” — 190 days of Flood, the “tzohar” — a shining stone, “ach Noach” = Og, wine = wailing, and the builders’ “come, let us” hides “carefree ease”, and Sarah in atbash is Yiskah.',
  glossary: {
    'נח': 'Noach (the name means “rest”, “pleasant”)',
    'היה': '“was”',
    'תמים היה': '“was perfect”',
    'האלהים התהלך נח': '“Noach walked with G-d”',
    'חכם': 'a wise man',
    'חמס': 'violence, robbery',
    'מי נח': 'the waters of Noach',
    'גיהנם': 'Gehinnom — where the soul is cleansed after death',
    'מבול': 'flood',
    'תיבה': 'ark',
    'גשם': 'rain',
    'קץ': 'end',
    'משחיתם': '“I will destroy them”',
    'משחיתם את הארץ': '“I will destroy them with the earth”',
    'מאה': 'a hundred',
    'היא שלשה טפחים': '“it is three handbreadths” (three tefachim)',
    'צהר': 'tzohar — a window, the source of light in the ark',
    'לאור האבן': '“for the light of the stone”',
    'לאור החלון': '“for the light of the window”',
    'אור הירח': '“the light of the moon”',
    'חלון גדול': '“a big window”',
    'לשבעת': '“after seven…”',
    'הימים': '“…days”',
    'לשבעת הימים': '“after seven days”',
    'לימי אבל מתושלח': '“for the days of mourning for Metushelach”',
    'לימי המבול': '“for the days of the Flood”',
    'לימי שמחה': '“for days of joy”',
    'לימי גשם': '“for days of rain”',
    'מתושלח': 'Metushelach, Noach’s grandfather',
    'היקום אשר עשיתי': '“all existence that I made”',
    'לא חיים לתחיית המתים': '“they will not live at the resurrection of the dead”',
    'טוב': 'good',
    'אך': '“only”',
    'אך נח': '“only Noach”',
    'עוג': 'Og, the giant, king of Bashan',
    'שם': 'Shem, son of Noach',
    'חם': 'Cham, son of Noach',
    'יפת': 'Yefet, son of Noach',
    'מקים את בריתי אתכם': '“I establish My covenant with you”',
    'מתים': 'the dead',
    'היין': 'the wine',
    'יללה': 'wailing',
    'שמחה': 'joy',
    'כרם': 'vineyard',
    'ענבים': 'grapes',
    'ויתגל': '“and he uncovered himself”',
    'גליות': 'exiles',
    'יהיה': '“shall be”',
    'איש אל רעהו הבה': '“to one another: come, let us”',
    'שלוה': 'carefree ease',
    'שפה': 'language (lit. “lip”)',
    'אחת': 'one',
    'שפה אחת': '“one language”',
    'לשון הקדש': 'the holy tongue — the Hebrew of the Torah',
    'שפה ברורה': '“a clear language”',
    'לשון זהב': '“a golden tongue”',
    'שפת עבר': '“the language of Ever”',
    'שרה': 'Sarah',
    'בגץ': '“bgtz” — the name שרה in atbash',
    'יסכה': 'Yiskah, daughter of Haran',
    'רבקה': 'Rivkah',
    'רחל': 'Rachel',
    'לאה': 'Leah',
  },
  translit: {
    'היה': 'hayah',
    'חמס': 'chamas',
    'קץ': 'ketz',
    'צהר': 'tzohar',
    'לשבעת': 'leshivat',
    'הימים': 'hayamim',
    'אך': 'ach',
    'נח': 'Noach',
    'היין': 'hayayin',
    'יהיה': 'yihyeh',
    'שפה': 'safah',
    'אחת': 'achat',
    'שרה': 'Sarah',
  },
  riddles: [
    {
      title: 'Noach the tzaddik',
      cond: `<p>The Baal HaTurim — Rabbi Yaakov ben Asher (c. 1269–1343), author of the law code “Arba’ah Turim”. On every verse of the Torah he left short hints: gematria, the first and last letters of words, words that appear in Tanakh exactly two or three times. The portion of Noach begins like this:</p><p class="verse" dir="rtl" lang="he">אלה תולדת נח נח איש צדיק תמים היה בדרתיו את האלקים התהלך נח</p><p>“These are the generations of Noach. Noach was a righteous man, perfect in his generations; Noach walked with G-d.”<sup data-src="gen-6-9"></sup></p><p>And two verses later: “and the earth was filled with <em>חמס</em> — violence.”</p>`,
      steps: [
        {
          q: 'How many times is the name <span class="he">נח</span> — Noach — written in this verse?',
          hint: 'Go through the verse word by word and mark every נח.',
        },
        {
          q: '“Perfect <span class="he">היה</span> — was he.” What is the value of the word <span class="he">היה</span>?',
          hint: '5 + 10 + 5.',
        },
        {
          q: 'Build a word from the <b>last</b> letters of the words <span class="he">האלקים התהלך נח</span> (“Noach walked with G-d”). You may rearrange the letters.',
          hint: 'The last letters are highlighted. You will get a word meaning “a wise man”.',
        },
        {
          q: 'What is the value of the word <span class="he">חמס</span> — “violence”?',
          hint: '8 + 40 + 60.',
        },
        {
          q: 'The Baal HaTurim found a phrase with the same gematria — it tells <b>how</b> the generation of the Flood was punished. Which one?',
          opts: ['“the waters of Noach”', '“flood”', '“ark”', '“rain”'],
        },
      ],
      reveal: {
        h: 'A wise tzaddik and “the waters of Noach”',
        p: 'Noach’s name stands in the verse three times: Noach saw three worlds. “Hayah” — “was” — equals 20: Noach was perfect in all twenty generations from Adam to Avraham. The last letters of “Noach walked with G-d” give “chacham” — a wise man. And “chamas”, violence, equals 108 — like “mei Noach”, “the waters of Noach”: measure for measure.',
      },
      lessons: [
        {
          h: '“These are the generations”',
          b: `<p>The Baal HaTurim compares four places where the Torah says “these are the generations” (<i>eleh toldot</i>): each time these words begin something new and leave what came before behind.<sup data-src="bht-6-9"></sup></p><p class="expl"><b>Explanation.</b> With Noach the story begins anew.</p>`,
        },
        {
          h: 'Noach, Noach, Noach',
          b: `<p>All three explanations answer why the name <span class="he">נח</span> stands three times in the first verse of the portion: three worlds, three people saved in a tzaddik’s merit, and “pleasant” — the name <span class="he">נח</span> itself can be read so.<sup data-src="bht-6-9"></sup></p>`,
        },
        {
          h: 'Perfect for twenty generations',
          b: `<p><span class="he">היה</span> = 5 + 10 + 5 = 20 — the number of generations from Adam to Avraham.<sup data-src="bht-6-9"></sup></p><p class="expl"><b>Explanation.</b> From Adam to Noach there are ten generations, and from Noach to Avraham another ten. Noach lived so long that he saw them all.</p>`,
        },
        {
          h: 'A wise man',
          b: `<p>The last letters of <span class="he">האלקים התהלך נח</span> — <span class="he">ם</span>, <span class="he">ך</span>, <span class="he">ח</span> — form <span class="he">חכם</span>.<sup data-src="bht-6-9"></sup> The verse the Baal HaTurim brings is from Proverbs: “The fruit of the righteous is a tree of life, and he who wins souls is wise.”<sup data-src="prov-11-30"></sup></p>`,
        },
        {
          h: 'Violence and waters',
          b: `<p><span class="he">חמס</span> = 8 + 40 + 60 = 108; <span class="he">מי נח</span> = 50 + 58 = 108; <span class="he">גיהנם</span> = 3 + 10 + 5 + 50 + 40 = 108.<sup data-src="bht-6-11-2"></sup></p><p class="expl"><b>Explanation.</b> The generation of the Flood robbed — and was washed away by “the waters of Noach”; “boiling water” means that the waters of the Flood were hot.</p>`,
        },
      ],
      reflection: 'Noach was “pleasant to Heaven and to people”. Whom can I please today — both the Almighty and the person next to me?',
      takeaways: [
        'The name נח three times in the verse: Noach saw three worlds; he saved three sons — as Daniel and Job saved three.',
        'היה = 20: Noach was perfect for twenty generations, from Adam to Avraham.',
        'The last letters of “האלקים התהלך נח” — חכם: “he who wins souls is wise”.',
        'חמס = 108 = מי נח = גיהנם: measure for measure.',
      ],
    },
    {
      title: 'The ark',
      cond: `<p>The Almighty says to Noach:</p><p class="verse" dir="rtl" lang="he">קץ כל בשר בא לפני כי מלאה הארץ חמס מפניהם והנני משחיתם את הארץ</p><p>“The end of all flesh has come before Me, for the earth is filled with violence because of them, and behold, I will destroy them with the earth.”</p><p>And He tells him to build an ark — three hundred cubits long, fifty wide, thirty high — and to make in it a <em>צהר</em>, a source of light.<sup data-src="gen-6-13"></sup></p>`,
      steps: [
        {
          q: 'The Baal HaTurim: the word <span class="he">קץ</span> — “end” — hints <b>how many days</b> the Flood lasted. What is its value?',
          hint: '100 + 90.',
        },
        {
          q: 'It rained for forty days. For how many days after that did the water <b>rise</b>, if the total number of days is the value of <span class="he">קץ</span>?',
          hint: 'Subtract 40 from the value of קץ.',
        },
        {
          q: 'Build a word from the <b>first</b> letters of the words <span class="he">משחיתם את הארץ</span> (“I will destroy them with the earth”). You may rearrange the letters.',
          hint: 'The first letters are highlighted. You will get a number — how many cubits tall people were before the Flood.',
        },
        {
          q: 'What is the value of the word <span class="he">צהר</span> — the “tzohar”, the source of light in the ark?',
          hint: '90 + 5 + 200.',
        },
        {
          q: 'Which phrase has the same gematria — and tells <b>what</b> the tzohar was?',
          opts: ['“for the light of the stone”', '“for the light of the window”', '“the light of the moon”', '“a big window”'],
        },
      ],
      reveal: {
        h: 'One hundred and ninety days and a shining stone',
        p: '“Ketz” — “end” — equals 190: forty days of rain and one hundred and fifty days of rising water. The first letters of “I will destroy them with the earth” give “me’ah” — a hundred: people were a hundred cubits tall. And the “tzohar” equals 295 — like “le-or ha-even”, “for the light of the stone”: a precious stone lit up the ark.',
      },
      lessons: [
        {
          h: 'The end — 190 days',
          b: `<p>40 days of rain + 150 days while the water rose = 190 = <span class="he">קץ</span> (100 + 90).<sup data-src="bht-6-13-1"></sup></p>`,
        },
        {
          h: 'A hundred cubits tall',
          b: `<p>The first letters of <span class="he">משחיתם את הארץ</span> — <span class="he">מ</span>, <span class="he">א</span>, <span class="he">ה</span> — form <span class="he">מאה</span>, “a hundred”.<sup data-src="bht-6-13-6"></sup></p>`,
        },
        {
          h: 'Three handbreadths of earth',
          b: `<p><span class="he">משחיתם</span> = 40 + 300 + 8 + 10 + 400 + 40 = 798 = <span class="he">היא שלשה טפחים</span> (16 + 635 + 147).<sup data-src="bht-6-13-4"></sup> Which three handbreadths? Rashi explains: the earth itself was washed away to the depth of a plow, three handbreadths.<sup data-src="rashi-6-13"></sup></p>`,
        },
        {
          h: 'A stone that shone',
          b: `<p>Rashi brings two opinions about the tzohar: a window or a shining stone.<sup data-src="rashi-6-16"></sup> The Baal HaTurim’s gematria supports the second: <span class="he">צהר</span> = 90 + 5 + 200 = 295 = <span class="he">לאור האבן</span> (237 + 58).<sup data-src="bht-6-16-1"></sup></p>`,
        },
      ],
      reflection: 'A stone lit up the ark while the water raged outside. What in my life gives me light from inside when things are hard outside?',
      takeaways: [
        'קץ = 190 = 40 days of rain + 150 days of rising water.',
        'The first letters of “משחיתם את הארץ” — מאה: people were a hundred cubits tall.',
        'משחיתם = 798 = היא שלשה טפחים: even the top layer of the earth was washed away, as deep as a plow.',
        'צהר = 295 = לאור האבן: a precious stone lit up the ark.',
      ],
    },
    {
      title: 'The Flood and the covenant',
      cond: `<p>Before the Flood the Almighty waited seven days:</p><p class="verse" dir="rtl" lang="he">ויהי לשבעת הימים ומי המבול היו על הארץ</p><p>“And it came to pass after the seven days that the waters of the Flood were upon the earth.”<sup data-src="gen-7-10"></sup></p><p>The Flood wiped out every living thing, and only of one it says: <em>וישאר אך נח ואשר אתו בתבה</em> — “and only Noach remained, and those with him in the ark.”<sup data-src="gen-7-23"></sup> And after the Flood the Almighty says: <em>הנני מקים את בריתי אתכם</em> — “behold, I establish My covenant with you.”<sup data-src="gen-9-9"></sup></p>`,
      steps: [
        {
          q: 'What is the value of the words <span class="he">לשבעת הימים</span> — “after the seven days”?',
          hint: 'לשבעת = 30 + 300 + 2 + 70 + 400; הימים = 5 + 10 + 40 + 10 + 40.',
        },
        {
          q: 'The Baal HaTurim found a phrase with the same gematria — it explains <b>why</b> there were these seven days. Which one?',
          opts: ['“for the days of mourning for Metushelach”', '“for the days of the Flood”', '“for days of joy”', '“for days of rain”'],
        },
        {
          q: 'What is the value of the words <span class="he">אך נח</span> — “only Noach”?',
          hint: 'אך = 1 + 20; נח = 50 + 8.',
        },
        {
          q: 'The Baal HaTurim: someone else was saved with Noach — his name has the same gematria. Who?',
          opts: ['Og, the giant', 'Shem, son of Noach', 'Cham, son of Noach', 'Yefet, son of Noach'],
        },
        {
          q: 'Build a word from the <b>last</b> letters of the words <span class="he">מקים את בריתי אתכם</span> (“I establish My covenant with you”). You may rearrange the letters.',
          hint: 'The last letters are highlighted. You will get a word meaning “the dead”.',
        },
      ],
      reveal: {
        h: 'Mourning, a giant and a promise of life',
        p: '“Le-shivat ha-yamim” is 907, like “for the days of mourning for Metushelach”: the Almighty held back the Flood while the tzaddik was mourned. “Ach Noach” equals 79 — like Og: the giant was saved too. And the last letters of “I establish My covenant with you” give “metim” — the dead: the covenant is a promise that the dead will live again.',
      },
      lessons: [
        {
          h: 'They will not live',
          b: `<p>Seven days before the Flood the Almighty said: “and I will blot out <span class="he">את כל היקום אשר עשיתי</span>.”<sup data-src="gen-7-4"></sup> Both phrases are 1452 in gematria.<sup data-src="bht-7-4"></sup></p><p>The third place of the word <span class="he">היקום</span> is about Datan and Aviram, Korach’s men, whom the earth swallowed “with all their possessions”.<sup data-src="deut-11-6"></sup></p>`,
        },
        {
          h: 'Seven days of mourning',
          b: `<p><span class="he">לשבעת</span> = 802, <span class="he">הימים</span> = 105, together 907 = <span class="he">לימי אבל מתושלח</span>.<sup data-src="bht-7-10"></sup> Rashi writes of the same seven days of mourning — on the words “in yet seven days” (7:4).<sup data-src="rashi-7-4"></sup></p>`,
        },
        {
          h: 'The seventeenth — “tov”',
          b: `<p>The Flood began “on the seventeenth day of the month”,<sup data-src="gen-7-11"></sup> and <span class="he">טוב</span> = 9 + 6 + 2 = 17.<sup data-src="bht-7-11"></sup> The words “they spend their days in good” are from the book of Job, about the wicked.<sup data-src="job-21-13"></sup></p><p class="expl"><b>Explanation.</b> The generation of the Flood lived in plenty and goodness — and on the “day of good” the punishment came.</p>`,
        },
        {
          h: 'And Og remained',
          b: `<p>Two limitations in a row — <span class="he">וישאר</span> (“remained”) and <span class="he">אך</span> (“only”).<sup data-src="bht-7-23"></sup> The gematria: <span class="he">אך נח</span> = 21 + 58 = 79 = <span class="he">עוג</span> (70 + 6 + 3).</p><p class="expl"><b>Explanation.</b> Og is the giant who, many years later, became king of Bashan.</p>`,
        },
        {
          h: 'The covenant — a promise of life',
          b: `<p>The last letters of <span class="he">מקים את בריתי אתכם</span> — <span class="he">ם</span>, <span class="he">ת</span>, <span class="he">י</span>, <span class="he">ם</span> — form <span class="he">מתים</span>.<sup data-src="bht-9-9"></sup></p><p class="expl"><b>Explanation.</b> So the story that began with “all existence will not live” ends with a promise: the dead will live again.</p>`,
        },
      ],
      reflection: 'The Almighty held back the Flood to mourn a tzaddik. Which good people around me do I value — and do I tell them so while they are near?',
      takeaways: [
        'היקום אשר עשיתי = 1452 = לא חיים לתחיית המתים; wealth without gratitude leads to sin — in the Flood and with Korach.',
        'לשבעת הימים = 907 = לימי אבל מתושלח: seven days of mourning for a tzaddik.',
        'טוב = 17: the Flood came on the seventeenth — to those who “spent their days in good”.',
        'אך נח = 79 = עוג: Og was saved too.',
        'The last letters of “מקים את בריתי אתכם” — מתים: the covenant is a promise of the resurrection of the dead.',
      ],
    },
    {
      title: 'The wine and the tower',
      cond: `<p>After the Flood Noach planted a vineyard:</p><p class="verse" dir="rtl" lang="he">וישת מן היין וישכר ויתגל בתוך אהלה</p><p>“And he drank of the wine, and became drunk, and uncovered himself within his tent.”<sup data-src="gen-9-20"></sup></p><p>Then Noach said of Canaan, son of Cham: <em>עבד עבדים יהיה לאחיו</em> — “a slave of slaves shall he be to his brothers.”<sup data-src="gen-9-25"></sup> And some generations later people decided to build a city and a tower up to the heavens: <em>ויאמרו איש אל רעהו הבה נלבנה לבנים</em> — “and they said to one another: come, let us make bricks.”<sup data-src="gen-11-1"></sup></p>`,
      steps: [
        {
          q: 'What is the value of the word <span class="he">היין</span> — “the wine”?',
          hint: '5 + 10 + 10 + 50.',
        },
        {
          q: 'Which word has the same gematria — and tells <b>what</b> wine leads to?',
          opts: ['“wailing”', '“joy”', '“vineyard”', '“grapes”'],
        },
        {
          q: 'Rearrange <b>all</b> the letters of the word <span class="he">ויתגל</span> (“and he uncovered himself”) to make the word “exiles”.',
          hint: 'Exile in Hebrew is “galut”; in the plural it is a five-letter word beginning with ג.',
        },
        {
          q: '“A slave of slaves <span class="he">יהיה</span> — shall he be.” What is the value of the word <span class="he">יהיה</span>?',
          hint: '10 + 5 + 10 + 5.',
        },
        {
          q: 'Build a word from the <b>last</b> letters of the words <span class="he">איש אל רעהו הבה</span> (“to one another: come, let us”). You may rearrange the letters.',
          hint: 'The last letters are highlighted. You will get a word meaning “carefree ease”.',
        },
      ],
      reveal: {
        h: 'Wailing, exile and carefree ease',
        p: '“Ha-yayin” — the wine — equals 75, like “yelalah” — wailing. In “va-yitgal”, “and he uncovered himself”, are the letters of “galuyot”, exiles: because of wine they went into exile. “Yihyeh” — “shall be” — equals 30: thirty shekels, the price of a slave. And the last letters of “to one another: come, let us” give “shalvah” — carefree ease: because of it the builders of the tower sinned.',
      },
      lessons: [
        {
          h: 'Wine and wailing',
          b: `<p><span class="he">היין</span> = 5 + 10 + 10 + 50 = 75 = <span class="he">יללה</span> (10 + 30 + 30 + 5).<sup data-src="bht-9-21"></sup></p><p class="expl"><b>Explanation.</b> Wine drunk without measure brings weeping.</p>`,
        },
        {
          h: 'The letters of exile',
          b: `<p><span class="he">ויתגל</span> and <span class="he">גליות</span> have the same letters, so the same number too: 449.<sup data-src="bht-9-21"></sup> “At the head of the exiles” are the words of the prophet Amos about those who “drink wine in bowls and anoint themselves with the finest oils — and do not grieve over the ruin of Yosef”.<sup data-src="amos-6-6"></sup></p>`,
        },
        {
          h: 'Thirty shekels',
          b: `<p>Noach said this of Canaan when he woke up. <span class="he">יהיה</span> = 10 + 5 + 10 + 5 = 30.<sup data-src="bht-9-25"></sup> The price of a slave is named in the law of the Torah: if an ox gores a slave, the owner of the ox pays “thirty shekels of silver”.<sup data-src="ex-21-32"></sup></p>`,
        },
        {
          h: 'The carefree builders of the tower',
          b: `<p>People settled in the valley of Shinar and decided to build a city and a tower up to the heavens. The last letters of <span class="he">איש אל רעהו הבה</span> — <span class="he">ש</span>, <span class="he">ל</span>, <span class="he">ו</span>, <span class="he">ה</span> — form <span class="he">שלוה</span>.<sup data-src="bht-11-3-1"></sup></p><p class="expl"><b>Explanation.</b> So too at the start of the portion: the generation of the Flood sinned “because of great goodness”, Korach — because of wealth. When there is plenty of everything, it is easy to forget from Whom it all comes.</p>`,
        },
      ],
      reflection: 'When things go well for me — do I remember from Whom it comes, or do I become careless? What can I do today so that good times lead me to gratitude, not to pride?',
      takeaways: [
        'היין = 75 = יללה: wine without measure brings weeping.',
        'ויתגל — the letters of גליות: because of wine they went into exile “at the head of the exiles”.',
        'יהיה = 30: thirty shekels — the price of a slave.',
        'The last letters of “איש אל רעהו הבה” — שלוה: the builders of the tower sinned from too much ease.',
      ],
    },
    {
      title: 'One language and Sarah’s name',
      cond: `<p>Before the Tower of Bavel all people had one language:</p><p class="verse" dir="rtl" lang="he">ויהי כל הארץ שפה אחת ודברים אחדים</p><p>“And the whole earth was of one language and of one speech.”<sup data-src="gen-11-1"></sup></p><p>And at the end of the portion the wives of Avram and Nachor are named — <em>שרי</em> and <em>מלכה</em> — and one more girl about whom the Torah tells nothing else: <em>יסכה</em>, Yiskah.<sup data-src="gen-11-29"></sup></p><p>Here the Baal HaTurim counts <b>not in the usual gematria</b>: the first hint needs the “kolel” — 1 is added for the expression itself; the second uses <b>atbash</b>: every letter is swapped with its “mirror” (first ↔ last: <span class="he">א</span> ↔ <span class="he">ת</span>, second ↔ second to last: <span class="he">ב</span> ↔ <span class="he">ש</span>…).</p>`,
      steps: [
        {
          q: 'What is the value of the words <span class="he">שפה אחת</span> — “one language”?',
          hint: 'שפה = 300 + 80 + 5; אחת = 1 + 8 + 400.',
        },
        {
          q: 'Add the “kolel” — 1 for the expression itself as a whole. What do you get?',
          hint: 'Add 1 to the sum of the previous step.',
        },
        {
          q: 'Which expression equals this number — and tells <b>which</b> language it was?',
          opts: ['“the holy tongue”', '“a clear language”', '“a golden tongue”', '“the language of Ever”'],
        },
        {
          q: 'Write the name <span class="he">שרה</span> (Sarah) in atbash: instead of <span class="he">ש</span> write <span class="he">ב</span>, instead of <span class="he">ר</span> — <span class="he">ג</span>, instead of <span class="he">ה</span> — <span class="he">צ</span>. What is the value of the new word?',
          hint: 'The new letters are bet, gimel and tzadi: 2 + 3 + 90.',
        },
        {
          q: 'Whose name in this portion has the same gematria?',
          opts: ['Yiskah', 'Rivkah', 'Rachel', 'Leah'],
        },
      ],
      reveal: {
        h: 'The holy tongue and Sarah the prophetess',
        p: '“Safah achat” is 794, and with the kolel 795, like “lashon ha-kodesh”, the holy tongue: before the tower everyone spoke the holy tongue. The name “Sarah” in atbash becomes “bgtz” — 95, like “Yiskah”: the Sages say that Yiskah is Sarah.',
      },
      lessons: [
        {
          h: 'The holy tongue',
          b: `<p>Before the tower all people spoke one language — the language of the Torah.<sup data-src="bht-11-1-2"></sup></p><p class="expl"><b>Explanation.</b> Let’s count: <span class="he">שפה</span> = 385, <span class="he">אחת</span> = 409, together 794; <span class="he">לשון הקדש</span> = 386 + 409 = 795. The difference is one. The Baal HaTurim simply writes “gematria”, and the numbers match by the rule “<b>with the kolel</b>”: 1 is added for the whole expression. 794 + 1 = 795.</p>`,
        },
        {
          h: 'Sarah is Yiskah',
          b: `<p>Yiskah is mentioned at the end of the portion — “the father of Milkah and the father of Yiskah” — and nowhere else. In atbash <span class="he">ש</span> becomes <span class="he">ב</span>, <span class="he">ר</span> becomes <span class="he">ג</span>, <span class="he">ה</span> becomes <span class="he">צ</span>: <span class="he">בגץ</span> = 2 + 3 + 90 = 95 = <span class="he">יסכה</span> (10 + 60 + 20 + 5).<sup data-src="bht-11-29"></sup></p><p>In the Gemara Rabbi Yitzchak explains why she was called so: Sarah was one of the seven prophetesses and “saw” (<i>sachtah</i>) with Divine inspiration — that is why the Almighty told Avraham: “whatever Sarah tells you, listen to her voice”. And also because everyone “gazed” at her beauty.<sup data-src="megillah-14a"></sup></p>`,
        },
      ],
      reflection: 'Before the tower everyone spoke one holy language. With which words can I make my speech “holy” today — kind, truthful, without rudeness?',
      takeaways: [
        'Besides the usual gematria there are small, ordinal and great numbers, full spelling, the kolel, atbash, albam; letter devices — rashei/sofei teivot and notarikon.',
        'שפה אחת = 794, with the kolel 795 = לשון הקדש: before the tower everyone spoke the holy tongue.',
        'שרה in atbash is בגץ = 95 = יסכה: Yiskah is Sarah.',
        'Sarah is a prophetess: “whatever Sarah tells you, listen to her voice”.',
      ],
    },
  ],
  memo: {
    intro:
      'Twelve comments of the Baal HaTurim on the portion of Noach — twelve pairs of cards. Each picture tells about one comment, and its pair is the Torah words the comment speaks about.',
    items: [
      {
        title: 'Noach saw three worlds',
        caption: 'Noach and three windows: three worlds',
        verse: '“These are the generations of Noach. Noach…”',
        quote: '“Noach, Noach” — “Noach” is written three times in the verse: he saw three worlds.',
        explain:
          'In the first verse of the portion the name נח appears three times: “These are the generations of Noach. Noach was a righteous man… Noach walked with G-d.” The Baal HaTurim explains: Noach saw three worlds — the world before the flood, the world covered with water, and the new world after the flood.',
        moral: 'The world can change beyond recognition — but a righteous person stays righteous in every one of its worlds.',
      },
      {
        title: 'Noach was wise',
        caption: 'A wise man with staff and scroll teaches',
        verse: '“Noach walked with G-d”',
        quote: '“Noach walked with G-d” — the last letters spell חכם (wise). As it says: “He who wins souls is wise.”',
        explain:
          'Take the last letters of האלקים התהלך נח: ם, ך, ח. Rearrange them — and you get חכם, “wise”. The Baal HaTurim quotes a verse from Mishlei: “He who wins souls is wise.” Noach was a wise man: for 120 years he built the ark and called on people to change their ways.',
        moral: 'A wise person does not only know things himself — he helps others become better too.',
      },
      {
        title: '“Violence” — “the waters of Noach”',
        caption: 'Boiling waves of the flood',
        verse: '“and the earth was filled with violence”',
        quote: '“Violence” has the value of “the waters of Noach”: they were paid back measure for measure. “Violence” has the value of “Gehinnom”: they were judged with boiling water.',
        explain:
          'The word חמס (“violence”, robbery) equals 108 — just like מי נח, “the waters of Noach”. The generation of the flood robbed — and was punished by the waters of the flood: measure for measure. And 108 is also גיהנם, Gehinnom: our Sages say the waters of the flood were boiling.',
        moral: 'What a person does to others comes back to him. So it is worth doing only good to others.',
      },
      {
        title: 'The end — 190 days',
        caption: 'Rain and long days of high water',
        verse: '“the end of all flesh”',
        quote: '“The end of all flesh” — a hint to the days of the flood: as many as the number of “ketz”: 40 days of rain and 150 days of rising water.',
        explain:
          'G-d told Noach: “The end of all flesh has come.” The word קץ (“end”) equals 190: ק = 100, ץ = 90. That is exactly how long the flood lasted: it rained for 40 days, and then for 150 more days the water rose and stayed over the earth. 40 + 150 = 190.',
        note: '40 days of rain + 150 days of high water',
        moral: 'Even the hardest time has its measure and its end — G-d knows how long it will last.',
      },
      {
        title: 'Giants a hundred cubits tall',
        caption: 'A giant, a shorter man and a measure',
        verse: '“I will destroy them with the earth”',
        quote: '“I will destroy them with the earth” — the first letters spell מאה (a hundred). They were a hundred cubits tall — and He made them shorter.',
        explain:
          'The first letters of the words משחיתם את הארץ: מ, א, ה — together מאה, “a hundred”. The people before the flood were giants — a hundred cubits tall. The Baal HaTurim teaches: G-d “destroyed” their great height.',
        moral: 'Strength and height do not make a person great. Good deeds do.',
      },
      {
        title: 'Light in the ark',
        caption: 'A shining stone above the ark’s animals',
        verse: '“make a light for the ark”',
        quote: '“Tzohar” has the value of “for the light of the stone”.',
        explain:
          'G-d told Noach to make a צהר — a tzohar, a source of light — in the ark. Rashi brings two opinions: a window or a shining precious stone. The Baal HaTurim finds the answer in the number: צהר = 295 = לאור האבן, “for the light of the stone”. The stone shone in the ark when it was dark outside.',
        moral: 'Even on the darkest days you can find light — and become a light for others.',
      },
      {
        title: 'Seven days of mourning',
        caption: 'A family mourns, the ark is waiting',
        verse: '“And it came to pass after seven days”',
        quote: '“After seven days” has the value of “for the days of mourning for Metushelach”.',
        explain:
          'The flood did not begin at once, but “after seven days”. Why? The words לשבעת הימים equal 907 — like לימי אבל מתושלח, “for the days of mourning for Metushelach”. Metushelach, Noach’s grandfather, was a tzaddik, and G-d held back the flood for seven days while people mourned him.',
        moral: 'A tzaddik is remembered and mourned — even in the middle of great trouble. Respect for people matters more than haste.',
      },
      {
        title: 'The seventeenth — “tov”',
        caption: 'Heaven’s windows open — the Flood begins',
        verse: '“on the seventeenth day of the month”',
        quote: '“On the seventeenth day of the month” — of this it is said: “they spend their days in good”: as the number of “tov” [17] — on that day of the month the Flood came down.',
        explain:
          'The Flood began on the seventeenth day of the second month: on that day the windows of heaven opened. The Baal HaTurim notes: טוב — “good” — equals 17 (9 + 6 + 2). The generation of the Flood lived in plenty and goodness, “spending their days in good” — and on the “day of good” the punishment came.',
        note: 'the 17th of the month, when the Flood began',
        moral: 'Plenty and goodness are given to do good with, not to forget G-d.',
      },
      {
        title: 'Og survived too',
        caption: 'Og the giant on the roof of the ark',
        verse: '“And only Noach was left”',
        quote: '“Only Noach” has the value of “Og”.',
        explain:
          'The Torah says: “And only Noach was left, and those with him in the ark.” But the words אך נח (“only Noach”) equal 79 — like עוג, Og. So the giant Og was saved too: our Sages tell that he held on to the ark from outside. Later Og became king of Bashan, and Moshe fought against him.',
        moral: 'The Torah chooses every letter: even a short word like “only” can tell a whole story.',
      },
      {
        title: 'The covenant and the resurrection',
        caption: 'A rainbow over the new earth',
        verse: '“I establish My covenant with you”',
        quote: '“I establish My covenant with you” — the last letters spell מתים (the dead). A hint to the resurrection of the dead.',
        explain:
          'After the flood G-d made a covenant with Noach, and its sign is the rainbow. Take the last letters of מקים את בריתי אתכם: ם, ת, י, ם — and you get מתים, “the dead”. The Baal HaTurim teaches: a promise is hidden in this covenant — one day the dead will live again.',
        moral: 'After the greatest trouble G-d promises life. We trust that everything will end well.',
      },
      {
        title: 'Wine and wailing',
        caption: 'A vineyard and a spilled cup',
        verse: '“And he drank of the wine”',
        quote: '“The wine” has the value of “wailing”. “And he uncovered himself” has the letters of “exiles”: because of wine they went into exile at the head of the exiles.',
        explain:
          'Noach planted a vineyard, drank of the wine and became drunk. The word היין (“the wine”) equals 75 — like יללה, “wailing”. And ויתגל (“and he uncovered himself”) has the same letters as גליות, “exiles”. The prophet Amos speaks of those who drink wine from bowls: they will be the first to go into exile.',
        moral: 'A good thing in measure is joy; without measure it can become trouble. We ourselves decide where to stop.',
      },
      {
        title: 'One language — the holy tongue',
        caption: 'Everyone reads one scroll together',
        verse: '“one language”',
        quote: '“One language” has the value of “the holy tongue”.',
        explain:
          'Before the Tower of Bavel all people had “one language”. Which one? שפה אחת = 794, and לשון הקדש, “the holy tongue”, is 795. The difference of 1 is the “kolel” — one for the whole expression. So the Baal HaTurim teaches: everyone spoke the holy tongue, the language of the Torah.',
        moral: 'The language of the Torah once united all people. Every word of it we learn is a step toward unity.',
      },
    ],
  },
  final: {
    title: 'The ark is open',
    allSolved:
      'All five riddles are solved. Noach is a wise tzaddik, “chamas” was punished with “the waters of Noach”, the ark shone with a stone, Og was saved with Noach, the covenant after the Flood promises life, the wine and the carefree builders teach us to be careful, and atbash reveals that Yiskah is Sarah.',
  },
  audience: 'Addition, letter games and atbash, a familiar story — Noach, the ark and the Flood. Younger children — together with an adult.',
  practice:
    'This week, when something works out for you or you receive a gift, say “thank you” out loud — to the Almighty and to whoever helped you. Three times the Baal HaTurim shows: trouble comes not from poverty but from “shalvah” — good times whose Source was forgotten.',
  highlight: 'The “violence” of the Flood generation equals “the waters of Noach”: the Almighty repays measure for measure.',
  share: ({ score, max, time, grid, allSolved, site }) => `🌊 What does the “violence” of the Flood generation equal? The answer is in “the waters of Noach”.

I’m playing a gematria game on the Baal HaTurim’s commentary on the portion of Noach. ${allSolved ? 'All five riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Five riddles: about Noach the tzaddik and “the waters of Noach”, the ark and the shining stone, the Flood, Og the giant and the covenant, the wine and the tower, the holy tongue and Sarah’s name. Can you do better?
Play 👉 ${site}

©mychitas.app`,
  source:
    'After the commentary of the Baal HaTurim (Rabbi Yaakov ben Asher, 14th century) on the portion of Noach (Genesis 6:9–11:32), short version (“Kitzur Baal HaTurim”). Hebrew text — Sefaria.',
};

export default en;
