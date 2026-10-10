import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Baal HaTurim: Noach',
  hero: {
    heading: 'Baal HaTurim: <i>four riddles of Noach and the Flood</i>',
    author: 'after the commentary of the Baal HaTurim, Rabbi Yaakov ben Asher',
    intro:
      'The Baal HaTurim found numbers and hidden words in the portion of Noach. Count for yourself: what kind of man Noach was, how many days the Flood lasted, who else was saved with the ark, and what happened after the Flood — with the wine and with the tower.',
  },
  summary:
    'The portion of Noach through the eyes of the Baal HaTurim: “chamas” = “the waters of Noach”, “ketz” — 190 days of Flood, the “tzohar” — a shining stone, “ach Noach” = Og, wine = wailing, and the builders’ “come, let us” hides “carefree ease”.',
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
          h: 'How to read the Baal HaTurim',
          b: `<p>The commentary of the Baal HaTurim, printed in almost every Chumash, is made of short hints. His tools: <b>gematria</b> — two expressions with the same number are linked in meaning; <b>rashei teivot and sofei teivot</b> (<span class="he">ר״ת</span>, <span class="he">ס״ת</span>) — the first or last letters of neighboring words form a new word; <b>“two or three in the Masorah”</b> — a word appears in all of Tanakh exactly two or three times, and those places explain each other.</p><p>Every number in this lesson has been checked. A few gematriot of the commentary on Noach do not add up in our count — they are not in the lesson.</p>`,
        },
        {
          h: '“These are the generations”',
          b: `<p>The words “these are the generations” (<i>eleh toldot</i>) appear, says the Baal HaTurim, in four places: “the generations of the heavens”, “the generations of Noach”, “the generations of Shem”, “the generations of Yaakov”. Each time they set aside what came before: “the generations of the heavens” — the first chaos, <i>tohu va-vohu</i>; “the generations of Noach” — the generations before him; “the generations of Shem” — the sons of Cham and Yefet; “the generations of Yaakov” — Esav and his chiefs.<sup data-src="bht-6-9"></sup> With Noach the story begins anew.</p>`,
        },
        {
          h: 'Noach, Noach, Noach',
          b: `<p>Noach’s name is written three times in the first verse of the portion. The Baal HaTurim gives three explanations. First: Noach <b>saw three worlds</b>. Second: Noach is one of three tzaddikim who each saved three people in his merit. Noach saved three sons — Shem, Cham and Yefet; Daniel saved Chananiah, Mishael and Azariah by explaining the king’s dream; Job (Iyov) saved his three friends — Eliphaz, Bildad and Zophar.</p><p>Third: the name Noach means “pleasant”. He was <b>pleasant</b> to Heaven and to people, to the upper and the lower beings, in this world and in the World to Come.</p>`,
        },
        {
          h: 'Perfect for twenty generations',
          b: `<p>“Perfect <span class="he">היה</span> — was he.” The word <span class="he">היה</span> = 5 + 10 + 5 = 20. The Baal HaTurim: Noach was perfect in all <b>twenty generations from Adam to Avraham</b>. But once Avraham came, Noach was no longer counted as perfect.</p><p>From Adam to Noach there are ten generations, and from Noach to Avraham another ten. Noach lived so long that he saw them all.</p>`,
        },
        {
          h: 'A wise man',
          b: `<p>The last letters of the words <span class="he">האלקים התהלך נח</span> — <span class="he">ם</span>, <span class="he">ך</span>, <span class="he">ח</span> — form the word <span class="he">חכם</span>, “a wise man”. This, says the Baal HaTurim, is what is said in Proverbs: “The fruit of the righteous is a tree of life, <b>and he who wins souls is wise</b>.”<sup data-src="prov-11-30"></sup></p>`,
        },
        {
          h: 'Violence and waters',
          b: `<p>“And the earth was filled with <span class="he">חמס</span> — violence.” <span class="he">חמס</span> = 8 + 40 + 60 = 108, and <span class="he">מי נח</span>, “the waters of Noach”, is also 108 (50 + 58). This teaches, says the Baal HaTurim, that the Almighty repaid them <b>measure for measure</b>.</p><p>And more: <span class="he">חמס</span> equals <span class="he">גיהנם</span> in gematria (3 + 10 + 5 + 50 + 40 = 108). This teaches that they were judged with boiling water: the waters of the Flood were hot.<sup data-src="bht-6-11-2"></sup></p>`,
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
          b: `<p>“The end of all flesh has come before Me.” The Baal HaTurim: the Almighty <b>hinted to Noach the days of the Flood</b> — as many as the word <span class="he">קץ</span>: 100 + 90 = 190. Forty days of rain and one hundred and fifty days in which the water grew stronger.<sup data-src="bht-6-13-1"></sup> 40 + 150 = 190.</p>`,
        },
        {
          h: 'A hundred cubits tall',
          b: `<p>“Behold, I will destroy them with the earth” — <span class="he">משחיתם את הארץ</span>. The first letters — <span class="he">מ</span>, <span class="he">א</span>, <span class="he">ה</span> — form <span class="he">מאה</span>, “a hundred”. This teaches, says the Baal HaTurim, that the Almighty destroyed their stature: people before the Flood were <b>a hundred cubits tall</b>.<sup data-src="bht-6-13-6"></sup></p>`,
        },
        {
          h: 'Three handbreadths of earth',
          b: `<p>Another hint in the same word: <span class="he">משחיתם</span> = 40 + 300 + 8 + 10 + 400 + 40 = 798 — like <span class="he">היא שלשה טפחים</span>, “it is three handbreadths” (16 + 635 + 147).<sup data-src="bht-6-13-4"></sup></p><p>Which three handbreadths? Rashi explains: “with the earth” — because even the top layer of the earth, as deep as a plow goes, <b>three handbreadths</b>, was washed away and wiped out.<sup data-src="rashi-6-13"></sup></p>`,
        },
        {
          h: 'A stone that shone',
          b: `<p>“Make a <span class="he">צהר</span> for the ark.” What is a tzohar? Rashi brings two opinions: some say a window, others say <b>a precious stone that gave them light</b>.<sup data-src="rashi-6-16"></sup></p><p>The Baal HaTurim supports the second opinion with a gematria: <span class="he">צהר</span> = 90 + 5 + 200 = 295, and <span class="he">לאור האבן</span>, “for the light of the stone”, is also 295 (237 + 58).<sup data-src="bht-6-16-1"></sup></p>`,
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
          b: `<p>Seven days before the Flood the Almighty said: “and I will blot out <span class="he">את כל היקום אשר עשיתי</span> — all existence that I made.”<sup data-src="gen-7-4"></sup> The Baal HaTurim: <span class="he">היקום אשר עשיתי</span> equals in gematria <span class="he">לא חיים לתחיית המתים</span> — “they will not live at the resurrection of the dead” (1452).<sup data-src="bht-7-4"></sup></p><p>The word <span class="he">היקום</span> (“existence”) appears three times in the Masorah: “and I will blot out all existence”, “and He blotted out all existence” — about the Flood, and “all the existence at their feet” — about the wealth of Korach and his men. This teaches: just as the generation of the Flood sinned <b>because of their great goodness and wealth</b>, so Korach, because of his great wealth, raised himself over others and sinned.</p>`,
        },
        {
          h: 'Seven days of mourning',
          b: `<p>“And it came to pass <span class="he">לשבעת הימים</span> — after the seven days.” <span class="he">לשבעת</span> = 802, <span class="he">הימים</span> = 105, together 907 — like <span class="he">לימי אבל מתושלח</span>, “for the days of mourning for Metushelach”.<sup data-src="bht-7-10"></sup></p><p>Metushelach, Noach’s grandfather, was a tzaddik and died just before the Flood. The Almighty held back the Flood for seven days — the days of mourning for him.</p>`,
        },
        {
          h: 'The seventeenth — “tov”',
          b: `<p>“…<b>on the seventeenth day</b> of the month, on that day all the fountains of the great deep burst open, and the windows of the heavens were opened.”<sup data-src="gen-7-11"></sup> The Baal HaTurim recalls Job’s words about the wicked: “they spend their days in good (<span class="he">בטוב</span>).”<sup data-src="job-21-13"></sup> <span class="he">טוב</span> = 9 + 6 + 2 = 17: on the day whose number is “tov”, the Flood came down. The generation of the Flood lived in plenty and goodness — and on the “day of good” the punishment came.</p><p>There the Baal HaTurim also writes that “and the windows of the heavens” equals in gematria “that He took two stars from the Kimah constellation”; but in our count the numbers do not match (1016 and 1011), so this gematria is not in the riddles.<sup data-src="bht-7-11"></sup></p>`,
        },
        {
          h: 'And Og remained',
          b: `<p>“And <span class="he">אך</span> — only — Noach remained.” The Baal HaTurim explains a rule of interpretation: the verse has two “limitations” in a row — “remained” and “only”. And a limitation after a limitation comes to <b>add</b>: so not only Noach remained — <b>Og remained too</b>.</p><p>And the gematria confirms it: <span class="he">אך נח</span> = 21 + 58 = 79, and <span class="he">עוג</span> = 70 + 6 + 3 = 79.<sup data-src="bht-7-23"></sup> Og is the giant who, many years later, became king of Bashan.</p>`,
        },
        {
          h: 'The covenant — a promise of life',
          b: `<p>After the Flood: “Behold, <span class="he">מקים את בריתי אתכם</span> — I establish My covenant with you.” The last letters — <span class="he">ם</span>, <span class="he">ת</span>, <span class="he">י</span>, <span class="he">ם</span> — form <span class="he">מתים</span>, “the dead”. This is a hint to the <b>resurrection of the dead</b>: the Almighty establishes His covenant with them to bring them back to life.<sup data-src="bht-9-9"></sup></p><p>So the story that began with “all existence will not live” ends with a promise: the dead will live again.</p>`,
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
          b: `<p>“And he drank of <span class="he">היין</span> — the wine.” <span class="he">היין</span> = 5 + 10 + 10 + 50 = 75, and <span class="he">יללה</span>, “wailing”, is also 75 (10 + 30 + 30 + 5). The Baal HaTurim: wine drunk without measure brings weeping.<sup data-src="bht-9-21"></sup></p>`,
        },
        {
          h: 'The letters of exile',
          b: `<p>“<span class="he">ויתגל</span> — and he uncovered himself.” These are the same letters as in the word <span class="he">גליות</span>, “exiles” (both words are 449). The Baal HaTurim explains: because of wine they went into exile “at the head of the exiles”.<sup data-src="bht-9-21"></sup></p><p>These are the words of the prophet Amos about those who “drink wine in bowls and anoint themselves with the finest oils — and do not grieve over the ruin of Yosef: therefore now they shall go into exile at the head of the exiles.”<sup data-src="amos-6-6"></sup></p>`,
        },
        {
          h: 'Thirty shekels',
          b: `<p>When Noach woke up, he said of Canaan: “a slave of slaves <span class="he">יהיה</span> — shall he be to his brothers.” <span class="he">יהיה</span> = 10 + 5 + 10 + 5 = 30. The Baal HaTurim: this hints at the price of a slave — <b>thirty shekels</b>.<sup data-src="bht-9-25"></sup></p><p>So the Torah says in the law: if an ox gores a slave, the owner of the ox pays “thirty shekels of silver”.<sup data-src="ex-21-32"></sup></p>`,
        },
        {
          h: 'The carefree builders of the tower',
          b: `<p>People settled in the valley of Shinar, and <span class="he">איש אל רעהו הבה</span> — “they said to one another: come, let us” make bricks and build a tower up to the heavens. The last letters — <span class="he">ש</span>, <span class="he">ל</span>, <span class="he">ו</span>, <span class="he">ה</span> — form <span class="he">שלוה</span>, “carefree ease”. The Baal HaTurim: they sinned <b>because of the excessive ease</b> they had.<sup data-src="bht-11-3-1"></sup></p><p>So too at the start of the portion: the generation of the Flood sinned “because of great goodness”, Korach — because of wealth. When there is plenty of everything, it is easy to forget from Whom it all comes.</p>`,
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
  ],
  final: {
    title: 'The ark is open',
    allSolved:
      'All four riddles are solved. Noach is a wise tzaddik, “chamas” was punished with “the waters of Noach”, the ark shone with a stone, Og was saved with Noach, the covenant after the Flood promises life, and the wine and the carefree builders teach us to be careful.',
  },
  audience: 'Addition and letter games, a familiar story — Noach, the ark and the Flood. Younger children — together with an adult.',
  practice:
    'This week, when something works out for you or you receive a gift, say “thank you” out loud — to the Almighty and to whoever helped you. Three times the Baal HaTurim shows: trouble comes not from poverty but from “shalvah” — good times whose Source was forgotten.',
  highlight: 'The “violence” of the Flood generation equals “the waters of Noach”: the Almighty repays measure for measure.',
  share: ({ score, max, time, grid, allSolved, site }) => `🌊 What does the “violence” of the Flood generation equal? The answer is in “the waters of Noach”.

I’m playing a gematria game on the Baal HaTurim’s commentary on the portion of Noach. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: about Noach the tzaddik and “the waters of Noach”, the ark and the shining stone, the Flood, Og the giant and the covenant, the wine and the tower. Can you do better?
Play 👉 ${site}

©mychitas.app`,
  source:
    'After the commentary of the Baal HaTurim (Rabbi Yaakov ben Asher, 14th century) on the portion of Noach (Genesis 6:9–11:32), short version (“Kitzur Baal HaTurim”). Hebrew text — Sefaria.',
};

export default en;
