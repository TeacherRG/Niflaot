import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Yikavu HaMayim',
  hero: {
    heading: 'The secret of the ninth verse: <i>four riddles about “one place”</i>',
    author: 'based on a note by Rabbi Yitzchak Ginsburgh',
    intro:
      'In every weekly portion the ninth verse hides a deep intention. Find it in the very first portion of the Torah: unity in place, the three meanings of “kav”, the number 59 and all the “nines” of Bereshit.',
  },
  summary:
    'The ninth verse of the Torah: “Let the waters gather into one place”. Mikveh, line and hope, the number 59, and the ninth letter, word and section of Bereshit.',
  glossary: {
    'יקוו': 'let them gather',
    'מקום': 'place',
    'אחד': 'one',
    'קוה': 'root: gather, hope',
    'מקוה': 'mikveh, gathering of waters',
    'קו': 'line',
    'תקוה': 'hope',
    'זנב': 'tail',
    'יחיאל': 'Yechiel',
    'אם חי': 'mother of the living',
    'היתה': 'was',
    'תהו': 'chaos, tohu',
    'יעקב': 'Yaakov',
    'רחל': 'Rachel',
  },
  riddles: [
    {
      title: 'The One in place',
      cond: `<p>The Rebbe of Izbica, author of the “Mei HaShiloach”, teaches: in every portion the <b>ninth verse</b> hides an intention deeper than its plain meaning. Nine is the sefirah of Yesod, the attribute of Yosef the tzaddik, and the letter <em>ט</em> is “goodness hidden within”.</p><p>In the first portion of the Torah the ninth verse reads:</p><p class="verse" dir="rtl" lang="he">ויאמר אלהים יקוו המים מתחת השמים אל מקום אחד ותראה היבשה ויהי כן</p><p>“And G-d said: let the waters under the heavens gather into one place, and let the dry land appear. And it was so.”</p>`,
      steps: [
        {
          q: 'How many words are in the ninth verse?',
          hint: 'ויאמר · אלהים · יקוו · המים · מתחת · השמים · אל · מקום · אחד · ותראה · היבשה · ויהי · כן',
        },
        { q: 'Which word has a gematria equal to the number of words?', opts: ['one', 'good', 'life', 'light'] },
        {
          q: 'And how many letters are in the verse? Hint: exactly four times the number of words.',
          hint: '5 + 5 + 4 + 4 + 4 + 5 + 2 + 4 + 3 + 5 + 5 + 4 + 2, or simply 4 × 13.',
        },
      ],
      reveal: {
        h: '“One” enters the world a second time',
        p: 'The ninth verse has 13 words — the gematria of “one” (אחד) — and 52 letters, four times “one”. Here the word “one” appears in the Torah for the second time: first “one day” — unity in time; now “one place” — unity in space.',
      },
      lessons: [
        {
          h: 'The rule of the “Mei HaShiloach”',
          b: `<p>The author of the “Mei HaShiloach” has a well-known rule: in every weekly portion, the ninth verse from its beginning holds an intention deeper than what every eye sees in its plain meaning. Why the ninth? The ninth sefirah is Yesod, “foundation”, the attribute of Yosef the tzaddik, and something is hidden in it. The Zohar says of the letter <span class="he">ט</span> (tet, the ninth letter): “your goodness is hidden within you”.</p><p>The Rebbe of Izbica himself states the rule in portion Balak, on the ninth verse of that portion. The Rav shows that it applies first of all to the very first portion of the Torah: “everything follows the opening” and “the body follows the head”.</p>`,
        },
        {
          h: 'The ninth verse opens the third day',
          b: `<p>The first day of creation takes five verses (ending with “and there was evening and there was morning, one day”). The second day takes three. So the ninth verse of the Torah is the first verse of the third day. It completes the work with the waters begun on the second day: “Let the waters under the heavens gather into one place, and let the dry land appear.”</p><p>The root of the ninth verse — what is new and hidden in it, “goodness concealed within” — is the word <span class="he">יקוו</span>, “let them gather”. We return to it in the second riddle.</p>`,
        },
        {
          h: 'One in time, one in place',
          b: `<p>Here the word “one” (<span class="he">אחד</span>) appears in the Torah for the second time. The first time — “and there was evening and there was morning, one day” — reveals the One in time. Now — “into one place” — the One is revealed in space.</p><p>Time and place relate to each other as masculine and feminine. In the language of Sefer Yetzirah, time is called “shanah” (year) and place is called “olam” (world). The third dimension is “nefesh”, the soul. Unity in the soul is revealed later, in the second section, after the creation of Adam and Chava: “and they shall become one flesh”. Thus all three are completed: world, year, soul.</p>`,
        },
        {
          h: 'The mikveh — where land and grass appear',
          b: `<p>Unity in place is revealed in the “mikveh of waters”, the gathering of water. In Hebrew “makom” (place) and “mikveh” sound alike, and not by chance. The waters gather into one place so that “the dry land may appear”, so that the earth is ready for the next utterance of creation — the main work of the third day: “Let the earth sprout vegetation”.</p><p>As the Tanya explains, this utterance is eternal: even today every blade of grass grows by the power of those words. The “one place” cleared by the waters is a space where life can grow constantly.</p>`,
        },
        {
          h: 'Thirteen words, fifty-two letters',
          b: `<p>The ninth verse has 13 words — the gematria of “one” (<span class="he">אחד</span> = 1 + 8 + 4). So does the verse ending with “one day”, and the verse “and they shall become one flesh”. The verse has 52 letters — “one” exactly four times, a perfect ratio of 1 : 4.</p><p>So the very structure of the verse already holds what it speaks of — unity.</p>`,
        },
      ],
      reflection: 'Where in my life does oneness appear in time — in habits and days — and where in place — at home, in the space around me? Which one place can I make into “one place”?',
      takeaways: [
        "The rule of the “Mei HaShiloach”: the ninth verse of every portion hides a deep intention. Nine is Yesod, the attribute of Yosef, “goodness hidden within”.",
        "The ninth verse of the Torah — “let the waters gather into one place” — is the first verse of the third day (5 verses of day one + 3 of day two).",
        "The second “one” in the Torah: “one day” — unity in time, “one place” — in space, “one flesh” — in the soul.",
        "13 words = אחד, 52 letters = 4 × 13.",
      ],
    },
    {
      title: 'Mikveh, line and hope',
      cond: `<p>The word <em>יקוו</em> — “let them gather” — comes from the root <em>קוה</em>. The root has three meanings: <b>mikveh</b> (<em>מקוה</em>), a gathering of waters; <b>line</b> (<em>קו</em>); and <b>hope</b> (<em>תקוה</em>).</p><p>The Rav sees in them the whole order of the descent of the worlds: the contraction of light, the ray from the Infinite, and the light that returns upward. Let’s count.</p>`,
      steps: [
        { q: 'What is the root <span class="he">קוה</span>?', hint: '100 + 6 + 5.' },
        {
          q: 'Which word has the same number as the letter alef spelled out in full (<span class="he">אלף</span>)?',
          opts: ['wonder', 'light', 'water', 'spirit'],
        },
        {
          q: 'Find the average of three words: <span class="he">מקוה</span>, <span class="he">קו</span> and <span class="he">תקוה</span>.',
          hint: 'מקוה = 151, קו = 106, תקוה = 511. Add them and divide by 3.',
        },
        { q: 'Whose name equals this number?', opts: ['Aharon', 'Moshe', 'Yaakov', 'David'] },
      ],
      reveal: {
        h: 'Hope that becomes service',
        p: 'The root “kav” equals 111 — like “alef” and like “pele”, wonder. The average of its three meanings is 256: sixteen squared, two to the eighth power. It is the gematria of Aharon, the High Priest: service in the Temple and great love for Israel.',
      },
      lessons: [
        {
          h: 'Three meanings of one root',
          b: `<p>The root <span class="he">קוה</span> has three meanings. The first is gathering, as the Targum translates: “yitkanshun”, “let them gather”. Hence “mikveh”, a gathering of waters. The second is hope, “tikvah”. The third is a line, “kav”.</p><p>The root’s gematria is 111. That is “alef” spelled in full (<span class="he">אלף</span>) and the word “pele”, wonder, with the same letters rearranged. The booklet this lesson comes from is called “Niflaot” — “wonders”.</p>`,
        },
        {
          h: 'Contraction: “I am the place of the world”',
          b: `<p>The gathering of all the lower waters into one place is the secret of the tzimtzum, the first “contraction” of the Divine light. The light withdraws to the sides, and precisely there, in the vacated space, the “place of the world” comes into being.</p><p>The Sages say of the Almighty: “He is the place of the world, but the world is not His place”. And Moshe was told: “Here is a place with Me”. The great circle of the Infinite light surrounds the empty space cleared by the contraction. “And let the dry land appear” is the “reshimu”, the impression of light that remained in the empty space after the contraction.</p>`,
        },
        {
          h: 'The line that builds worlds',
          b: `<p>Then the “kav” — a line, a ray of light from the Infinite — is drawn into the empty space. The word “yikavu” hides it too. The line goes from the concealed depth of the Infinite to the place of the reshimu and grows from it all the worlds: Adam Kadmon, Atzilut, Beriah, Yetzirah, Asiyah.</p><p>Radak, in his Book of Roots, writes that “kav” also means building: “their line has gone out through all the earth” — that is, their structure. Through the line all the worlds are built.</p>`,
        },
        {
          h: 'Hope: the light returns',
          b: `<p>At the end, when the line has reached the very bottom, the light rises back — “or chozer”, returning light. This is the secret of the good hope of everything the Almighty created in His world for His glory: the longing to be nullified to Him, to pass “from something to nothing”, knowing that nothing makes itself.</p><p>Hope — every day, every moment — that His glory will be revealed: “and the earth shone with His glory”. That glory is the source of the coming-into-being, the life and the existence of all creation.</p>`,
        },
        {
          h: 'Aharon: 256',
          b: `<p>Mikveh (<span class="he">מקוה</span>) = 151, line (<span class="he">קו</span>) = 106, hope (<span class="he">תקוה</span>) = 511. Together 768, and the average is 256. That is sixteen squared, four to the fourth and two to the eighth. An extra beauty: “mikveh” and “line” together give 257, 256 plus one for the whole, and “hope” is 511, which with one for the whole is 512, twice 256.</p><p>256 is the gematria of Aharon (<span class="he">אהרן</span>), the High Priest. His path is service of the Almighty in the Temple and love of Israel: the priestly blessing, the healing of every illness of body and soul, “great love” to the point of self-sacrifice.</p>`,
        },
        {
          h: 'Three lines: Avraham, Yitzchak, Yaakov',
          b: `<p>The three meanings of the root correspond to the three lines of the world of rectification. <b>Mikveh is kindness, the line of Avraham.</b> Of him we pray: “remember the father who followed You like water”. Endless waters enter one place: “the place where Avraham stood before G-d”. “One place” is the place of which it is said “Avraham was one”.</p><p><b>Line is the middle line, the line of Yaakov.</b> It extends directly from the ray of the Infinite and builds all the worlds. Its outer side is the power of division, its left side. Its inner side is the power of inclusion, the right: when it leans to the right, “to include the left in the right”.</p><p><b>Hope is the left line, the line of Yitzchak,</b> rising from below upward: “Hope to G-d, be strong and let your heart take courage, and hope to G-d!” The six words together — mikveh, Avraham, hope, Yitzchak, line, Yaakov — add up to 1406.</p>`,
        },
      ],
      reflection: 'What am I hoping for today? How can I turn this hope into a “line” — one concrete step I will take?',
      takeaways: [
        "The root קוה = 111 = אלף = פלא (wonder): mikveh — gathering of waters, kav — line, tikvah — hope.",
        "Mikveh is the tzimtzum and the reshimu (“let the dry land appear”); the line is the ray from the Infinite that builds the worlds; hope is the returning light, creation longing for its Source.",
        "(מקוה 151 + קו 106 + תקוה 511) : 3 = 256 = אהרן — service and love of Israel.",
        "Three lines: mikveh — Avraham (kindness), line — Yaakov (the middle), hope — Yitzchak (the left line, rising upward).",
      ],
    },
    {
      title: 'Fifty-nine',
      cond: `<p>The gematria of the whole ninth verse of Bereshit is <b>3068</b>, and it has 52 letters.</p><p>The Rebbe of Izbica derived his rule from the ninth verse of portion Balak:</p><p class="verse" dir="rtl" lang="he">ויאמר בלעם אל האלהים בלק בן צפר מלך מואב שלח אלי</p><p>“And Bilam said to G-d: Balak son of Tzipor, king of Moav, has sent to me.” Its gematria is <b>1593</b>. What do the two verses have in common?</p>`,
      steps: [
        { q: 'What is the average value of one letter of the ninth verse of Bereshit?', hint: '3068 : 52.' },
        { q: 'How many times greater is 1593 than this number?', hint: '1593 : 59.' },
        {
          q: 'Both verses divide evenly by 59: 3068 = 52 × 59 and 1593 = 27 × 59. Which word from the first lesson (“Tikun Partzuf-Zanav”) also equals 59?',
          opts: ['tail', 'face, countenance', 'pride', 'desire'],
        },
      ],
      reveal: {
        h: 'The common denominator — the “tail”',
        p: 'The average letter of the ninth verse is 59, and Bilam’s verse is exactly 27 times 59. The common divisor of the two “ninth” verses is 59, “zanav”, the tail. So the new lesson connects to the first: nine, Yesod, and the debate over the “face” and the “tail”.',
      },
      lessons: [
        {
          h: 'The measure of creation',
          b: `<p>The gematria of the ninth verse is 3068. That is 13 (“one”) times 236. And 236 is the gematria of “and great in strength” (<span class="he">ורב כח</span>) from the verse “Great is our L-rd and great in strength”. This is the secret of “shiur komah”, the “measure of the Creator’s stature”, spoken of in an ancient midrash.</p><p>Remove the word “one” itself, and the remaining words give 3055 — exactly five times “Torah” (<span class="he">תורה</span> = 611): like the five books, the entire Torah.</p>`,
        },
        {
          h: 'The average letter is 59',
          b: `<p>3068 is 52 times 59, so the average letter of the ninth verse equals 59. The ninth verse of portion Balak, on which the Rebbe of Izbica builds his rule, equals 1593 — 27 times 59. The common denominator of the two verses is 59.</p><p>59 is a prime; the Rav calls it “the living prime”. It is the gematria of the name Yechiel (<span class="he">יחיאל</span>) and of “mother of the living” (<span class="he">אם חי</span>) — a hint to Chava, called “the mother of all living”.</p>`,
        },
        {
          h: '59 is the “tail”',
          b: `<p>Most importantly, 59 is the gematria of “tail” (<span class="he">זנב</span>). This is the secret of the debate from the previous lesson: “one said a face, the other said a tail”, about what woman was created from.</p><p>In Kabbalah the “tail” points to Yesod — the ninth attribute — in its state of “smallness” (katnut). It is also the secret of the primordial snake that seduced Chava. There lies the root of bodily desire: “and your desire shall be to your husband”. So the ninth verse is tied to the ninth attribute, and the ninth attribute to the “tail”.</p>`,
        },
        {
          h: 'Sanctified desire',
          b: `<p>A husband’s desire for his wife also comes from here. In holiness it is said: “the desire of the righteous is only good”. The word “only” (<span class="he">אך</span>) is a diminution: the tzaddik diminishes bodily desire in himself, and then “only good to Israel” is fulfilled.</p><p>Hence also the Talmudic saying “better to live as two than alone”. The Rav notes that the letter <span class="he">נ</span> is the ninth from the end of the alphabet (ת, ש, ר, ק, צ, פ, ע, ס, נ). He warns that this also holds a root of licentiousness — which is why desire needs holiness.</p>`,
        },
      ],
      reflection: 'Which “small” thing in me — a desire, a habit, a “tail” — can I sanctify instead of suppressing? What would that take today?',
      takeaways: [
        "The ninth verse = 3068 = 13 × 236 (ורב כח — “the measure of the Creator”); without the word “one” — 3055 = 5 × תורה.",
        "The average letter = 3068 : 52 = 59. The ninth verse of Balak = 1593 = 27 × 59.",
        "59 = זנב = יחיאל = אם חי: the nine leads to Yesod and to the “tail” of the first lesson.",
        "Desire is sanctified: “the desire of the righteous is only good”.",
      ],
    },
    {
      title: 'All the nines of Bereshit',
      cond: `<p>The rule of the ninth verse applies not only to verses but also to <b>letters, words and sections</b>: nine is the sefirah of Yesod, which is called “all” and can carry opposites within it.</p><p>Let’s look at the ninth letter, ninth word and ninth section of the Torah. The ninth word is <em>היתה</em> (“was”): <em>והארץ היתה תהו ובהו</em> — “and the earth was chaos and void”. The ninth section is G-d’s words to Chava after the sin, ending with: <em>והוא ימשל בך</em> — “and he shall rule over you”.</p>`,
      steps: [
        { q: 'Which letter is the ninth in the Torah? (<span class="he">בראשית ברא…</span>)', opts: ['alef · 1', 'hei · 5', 'resh · 200', 'shin · 300'] },
        { q: 'What is the ninth word of the Torah, <span class="he">היתה</span>?', hint: '5 + 10 + 400 + 5.' },
        { q: 'What do the words <span class="he">והוא ימשל בך</span> equal?', hint: 'והוא = 18, ימשל = 380, בך = 22.' },
        { q: 'Which couple together gives the same number?', opts: ['Yaakov and Rachel', 'Avraham and Sarah', 'Yitzchak and Rivkah', 'Adam and Chava'] },
      ],
      reveal: {
        h: 'From chaos to the union of Yaakov and Rachel',
        p: 'The ninth letter of the Torah is alef — the second alef, like the second “one”. The ninth word “was” (420) speaks of the chaos the world returned to. Exactly the same is “and he shall rule over you” — the consequence of the sin. The rectification of this number is the union of Yaakov and Rachel: 182 + 238 = 420.',
      },
      lessons: [
        {
          h: 'Why not only verses',
          b: `<p>The rule of the “Mei HaShiloach” speaks of verses, but for the same reason it holds for letters, words and sections. Every nine hints at the sefirah of Yesod. Yesod is called “all” — “for all that is in heaven and on earth” — and it has the power to carry opposites; it is “secret”, the foundation.</p><p>There is a clear hint in the ninth verse itself: its ninth word is “one” (<span class="he">אחד</span>). In the verses “one day” and “one flesh” the word “one” is the thirteenth, at the end; here it is the ninth. Nine is the gematria of “ach” (<span class="he">אח</span>, brother): in Yechezkel “ach” is once written instead of “echad”. Here the masculine side of unity is emphasized.</p>`,
        },
        {
          h: 'The ninth letter — the second alef',
          b: `<p>Count the letters of the Torah: <span class="he">ב ר א ש י ת</span> — six, then <span class="he">ב ר א</span> — the ninth letter is the alef of “bara”, “created”. It completes the first phrase of the Torah, “Bereshit bara” — the secret of “a word and half a word”.</p><p>This is the second alef in the Torah, just as the ninth verse holds the second “one” in the Torah. Alef equals one: here too the nine reveals unity.</p>`,
        },
        {
          h: 'The ninth word — “was”',
          b: `<p>The ninth word of the Torah is “was” (<span class="he">היתה</span>): “and the earth was chaos and void”. Here the root “to be” appears in the Torah for the first time — being, the coming of “something from nothing”. According to the Ramban, “bara” means creating something from nothing; “bara” and “was” are each the second word of their verse.</p><p>But “was” also carries a meaning of ruin: “calamity upon calamity” (<span class="he">הוה על הוה</span>). This is the secret of the “breaking of the vessels” in the world of Tohu, the world of chaos. “Tohu” (<span class="he">תהו</span>) = 411 — like “something from nothing” (<span class="he">יש מאין</span>). Chaos is the feeling “I will reign” (the words of Adoniyahu), a “something” grown out of the source of “nothing”. The rectification is true self-nullification before the true Being.</p>`,
        },
        {
          h: 'The ninth section — G-d’s words to Chava',
          b: `<p>The ninth section of the Torah is Chava’s curse after the sin of the Tree of Knowledge: “To the woman He said: I will greatly increase your sorrow and your pregnancy; in pain you shall bear children; your desire shall be to your husband, and he shall rule over you.” One may say this is the main consequence of the sin and the order of the world after it.</p><p>The words “and he shall rule over you” (<span class="he">והוא ימשל בך</span>) equal 420 — like “was” (<span class="he">היתה</span>): the return of the world, the earth, the feminine to chaos. 420 is also “Yaakov” + “Rachel” (182 + 238), but in its opposite, “shadow” form. In the union of Yaakov and Rachel, Rachel stands below him — a consequence of Chava’s sin. Sarah stood above Avraham, and Rivkah was equal to Yitzchak.</p>`,
        },
        {
          h: 'Sun and moon',
          b: `<p>“And he shall rule over you” has three words and ten letters. The average word is 140: that is “Chochmah” and “Binah” (73 + 67) and “sun” and “moon” (<span class="he">חמה</span> 53 + <span class="he">לבנה</span> 87). Here is a hint to the source of the sin of the Tree: the moon’s complaint that “two kings cannot use one crown”, and its diminishing.</p><p>The average letter is 42: “ima”, mother (<span class="he">אמא</span>), and the 42-letter Name. Binah, the “mother”, “nests in the throne”, in the world of Beriah, where “something from nothing” begins. Together 140 + 42 = 182 — Yaakov, who marries Rachel, and together they again give 420.</p>`,
        },
        {
          h: 'The whole verse: 193',
          b: `<p>The whole verse about Chava — 16 words — equals 4246, that is, 22 times 193. The last word of the verse, “over you” (<span class="he">בך</span>), is 22. So the verse is 192 times “you” plus one more “you” at the end. And 192 is three times “Adam and Chava” (45 + 19 = 64).</p><p>In Kabbalah 193 is the holy Name <span class="he">טפטפיה</span>, the secret of the union of husband and wife. It is also the letter <span class="he">ז</span> (which begins “tail”) spelled out twice: <span class="he">זין יוד נון</span> = 193. And the full spelling of the Name <span class="he">כוזו</span> (a letter substitution of G-d’s Name, written on the mezuzah): <span class="he">כף ואו זין ואו</span> = 193.</p><p>The Baal Shem Tov explained this Name in a person’s service: “ku” (<span class="he">כו</span> = 26, like G-d’s Name) — “ba-zo u-va-zo”, in this and in that, that is, in every single thing. “I set G-d before me always.” It is also the secret of the words “I am G-d your G-d”, which close the Shema.</p>`,
        },
      ],
      reflection: 'Where does “I will reign” sound inside me? How can I return this “I” to its source — and turn rule into union?',
      takeaways: [
        "The rule of nine also holds for letters, words and sections. The ninth letter of the Torah is א — the second alef, like the second “one”.",
        "The ninth word is היתה (420): being, and the breaking of the vessels in the world of Tohu; תהו = 411 = יש מאין.",
        "The ninth section is G-d’s words to Chava: “והוא ימשל בך” = 420 = היתה = יעקב + רחל — the consequence of the sin and its rectification.",
        "Average word 140 (חכמה + בינה, חמה + לבנה), average letter 42 (אמא): 140 + 42 = 182 = יעקב.",
        "The whole verse = 4246 = 22 × 193 (טפטפיה, כוזו): G-d is “in this and in that”, in every single thing.",
      ],
    },
  ],
  final: {
    title: 'Unity revealed',
    allSolved:
      'All four riddles are solved. The waters have gathered into one place, the line has been drawn, and hope has returned to its Source.',
  },
  share: ({ score, max, time, grid, allSolved, site }) => `🌊 What do the ninth verse of the Torah and the “tail” have in common?
The answer is a single number.

I’m searching for it in a gematria game based on Rabbi Yitzchak Ginsburgh’s lesson “Yikavu HaMayim”. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: on one place, on mikveh, line and hope, on the number 59 and on all the “nines” of Bereshit. Can you do better?
Play 👉 ${site}

©pnimi.org.il ©mychitas.app`,
  source:
    'Based on the note “Yikavu HaMayim el Makom Echad” (24 Tishrei 5787), “Niflaot” booklet No. 422, Bereshit ה׳תשפ״ז (Gal Einai). Full Hebrew text: pnimi.org.il',
};

export default en;
