import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Baal HaTurim: Vayishlach',
  hero: {
    heading: 'Baal HaTurim: <i>four riddles about the meeting of Yaakov and Esav</i>',
    author: 'based on the commentary of the Baal HaTurim, Rabbi Yaakov ben Asher',
    intro:
      'Yaakov is coming home — and Esav is coming toward him with four hundred men. The Baal HaTurim found hidden words and numbers in Parshat Vayishlach. Count for yourself: what Yaakov told his brother with a single word, whom he saw in his prayer, who wrestled with him at night — and what was in Esav’s kiss.',
  },
  summary:
    'Parshat Vayishlach through the eyes of the Baal HaTurim: “I sojourned” = 613 — with Lavan, Yaakov kept the mitzvot; “I have an ox” = 546 = “Yosef was born”; “with my staff” = 182 = “Yaakov”; the first letters of “save me, please, from the hand” spell Haman; “a gift” = 103 = “stones”; “a man with him” = 427 = “Esav — Edom,” and the last letters of “and a man wrestled with him” spell “his straw”; “the hollow of his thigh” = 338 = “to disqualify him from the priesthood”; “you bless me” = 682 = “he acknowledged my blessing”; seven bows — “a righteous man falls seven times and rises”; “and he kissed him” = 427 = “to bite him”; “my brother, let what is yours be yours” = 645 = “these are the blessings.”',
  glossary: {
    'וישלח': '“and he sent” — the name of the parshah',
    'גרתי': '“I sojourned”',
    'עם לבן גרתי': '“I have sojourned with Lavan”',
    'שור': '“ox”',
    'לי': '“to me, I have”',
    'לי שור': '“I have an ox”',
    'ויהי לי שור וחמור': '“and I have ox and donkey”',
    'קרן יוסף': '“the horn of Yosef”',
    'חמור': '“donkey”',
    'בכור': '“firstborn”',
    'יששכר': 'Yissachar — a son of Yaakov',
    'שנולד יוסף': '“Yosef was born”',
    'שנולד בנימין': '“Binyamin was born”',
    'שמת לבן': '“Lavan died”',
    'שבא עשו': '“Esav came”',
    'במקלי': '“with my staff”',
    'כי במקלי עברתי את הירדן': '“for with my staff I crossed the Jordan”',
    'יעקב': 'Yaakov',
    'ישראל': 'Yisrael',
    'אברהם': 'Avraham',
    'יצחק': 'Yitzchak',
    'הצילני נא מיד': '“save me, please, from the hand”',
    'הצילני נא מיד אחי': '“save me, please, from the hand of my brother”',
    'המן': 'Haman — the enemy of the Jews in the Megillah of Esther',
    'מנחה': '“a gift”',
    'מנחה לעשו אחיו': '“a gift for Esav his brother”',
    'אבנים': '“stones”',
    'זהב': '“gold”',
    'כסף': '“silver”',
    'צאן': '“sheep”',
    'איש': '“a man”',
    'עמו': '“with him”',
    'איש עמו': '“a man with him”',
    'ויאבק איש עמו': '“and a man wrestled with him”',
    'עד עלות השחר': '“until the break of dawn”',
    'עשו אדום': '“Esav — Edom”',
    'מלאך': '“angel”',
    'פרעה': 'Pharaoh',
    'לבן הארמי': 'Lavan the Aramean',
    'קשו': '“his straw”',
    'בכף ירכו': '“the hollow of his thigh”',
    'ויגע בכף ירכו': '“and he touched the hollow of his thigh”',
    'לפוסלו מכהונה': '“to disqualify him from the priesthood”',
    'ברכתני': '“(unless) you bless me”',
    'כי אם ברכתני': '“unless you bless me”',
    'הודה לברכתי': '“he acknowledged my blessing”',
    'נתן לי שלום': '“he gave me peace”',
    'שלחני לדרכי': '“he sent me on my way”',
    'הלך לשעיר': '“he went to Seir”',
    'וישקהו': '“and he kissed him”',
    'וישתחו ארצה שבע פעמים': '“and he bowed to the ground seven times”',
    'ויפל על צוארו וישקהו': '“and he fell on his neck and kissed him”',
    'לנושכיהו': '“to bite him”',
    'לחבקו': '“to hug him”',
    'לברכו': '“to bless him”',
    'לאהבו': '“to love him”',
    'אחי יהי לך אשר לך': '“my brother, let what is yours be yours”',
    'אחי': '“my brother”',
    'יהי': '“let it be”',
    'לך': '“yours, to you”',
    'אשר': '“that which”',
    'זה הברכות': '“these are the blessings”',
    'זה הבכורה': '“this is the birthright”',
    'זה הצאן': '“these are the sheep”',
    'זה הכסף': '“this is the silver”',
    'אדני': '“my lord”',
  },
  translit: {
    'גרתי': 'garti',
    'שור': 'shor',
    'במקלי': 'bemakli',
    'מנחה': 'minchah',
    'איש': 'ish',
    'ברכתני': 'berachtani',
    'וישקהו': 'vayishakehu',
  },
  riddles: [
    {
      title: 'The message to Esav',
      cond: `<p>The Baal HaTurim is Rabbi Yaakov ben Asher (c. 1269–1343), author of the code of law Arba’ah Turim. On every verse of the Torah he left short hints: gematriot, the first and last letters of words. For twenty years Yaakov lived with Lavan. Now he is returning home and sends messengers to his brother Esav:</p><p class="verse" dir="rtl" lang="he">כה אמר עבדך יעקב עם לבן גרתי ואחר עד עתה</p><p>“Thus says your servant Yaakov: I have sojourned with Lavan and stayed until now.”<sup data-src="gen-32-5"></sup></p><p class="verse" dir="rtl" lang="he">ויהי לי שור וחמור צאן ועבד ושפחה</p><p>“And I have ox and donkey, sheep, servant and maidservant.”<sup data-src="gen-32-6"></sup></p>`,
      steps: [
        {
          q: 'What is the value of the word <span class="he">גרתי</span> — “I sojourned”?',
          hint: 'ג = 3, ר = 200, ת = 400, י = 10.',
        },
        {
          q: 'And what is the value of the word <span class="he">שור</span> — “ox”?',
          hint: 'ש = 300, ו = 6, ר = 200.',
        },
        {
          q: 'Which words equal this number? Moshe called this son of Yaakov “his firstborn ox.”',
          opts: ['“the horn of Yosef”', '“donkey”', '“firstborn”', 'Yissachar'],
        },
        {
          q: 'What is the value of both words <span class="he">לי שור</span> — “I have an ox”?',
          hint: 'לי = 30 + 10; add the “ox.”',
        },
        {
          q: 'Which words equal this number — and tell what Yaakov waited for before returning?',
          opts: ['“Yosef was born”', '“Binyamin was born”', '“Lavan died”', '“Esav came”'],
        },
      ],
      reveal: {
        h: 'Two hints in one message',
        p: '“Garti,” “I sojourned,” = 613: the number of mitzvot in the Torah. Yaakov tells his brother: I lived with Lavan — and stayed myself. “Shor,” “ox,” = 506 = “keren Yosef,” “the horn of Yosef,” and “li shor,” “I have an ox,” = 546 = “shenolad Yosef,” “Yosef was born”: Yaakov set out to meet Esav once Yosef was born — the one whom Esav cannot overcome.',
      },
      lessons: [
        {
          h: 'With Lavan — and with the mitzvot',
          b: `<p><span class="he">גרתי</span> = 3 + 200 + 400 + 10 = 613. Rashi brings this gematria,<sup data-src="rashi-32-5"></sup> and the Baal HaTurim says the same in brief.<sup data-src="bht-32-5-1"></sup></p><p class="expl"><b>Explanation.</b> Twenty years next to a deceiver — and not one bad habit. Wherever a person lives, he can stay true to what he was taught at home.</p>`,
        },
        {
          h: 'The ox is Yosef',
          b: `<p><span class="he">שור</span> = 300 + 6 + 200 = 506; <span class="he">קרן יוסף</span> = 350 + 156 = 506. <span class="he">לי שור</span> = 40 + 506 = 546; <span class="he">שנולד יוסף</span> = 390 + 156 = 546.<sup data-src="bht-32-6-2"></sup></p><p>Why, of all animals, did Yaakov name the ox and the donkey first? The ox is Yosef: when Moshe blessed the tribes, he said of Yosef “his firstborn ox” (Deuteronomy 33:17). The donkey is Yissachar: Yaakov called him “a strong-boned donkey” (Genesis 49:14).<sup data-src="bht-32-6-1"></sup></p><p class="expl"><b>Explanation.</b> Yaakov does not come to Esav empty-handed: he has Yosef — a strength before which Esav retreats — and Yissachar, the voice of Torah in the houses of study. Yaakov’s strength is in his children and in their learning.</p>`,
        },
      ],
      reflection: 'Yaakov lived with Lavan and did not learn from his deeds. In which company is it hardest for me to stay myself — and what helps me?',
      takeaways: [
        'גרתי = 613: with Lavan, Yaakov kept the mitzvot.',
        'שור = 506 = קרן יוסף: the ox hints at Yosef, and the donkey at Yissachar.',
        'לי שור = 546 = שנולד יוסף: Yaakov returned once Yosef was born.',
      ],
    },
    {
      title: 'Yaakov’s prayer',
      cond: `<p>The messengers came back: Esav is coming, and four hundred men with him. Yaakov was afraid and began to pray:</p><p class="verse" dir="rtl" lang="he">כי במקלי עברתי את הירדן הזה ועתה הייתי לשני מחנות</p><p>“I am too small for all the kindnesses… for with my staff I crossed this Jordan, and now I have become two camps.”<sup data-src="gen-32-11"></sup></p><p class="verse" dir="rtl" lang="he">הצילני נא מיד אחי מיד עשו</p><p>“Save me, please, from the hand of my brother, from the hand of Esav: for I fear him, lest he come and strike me, mother with children.”<sup data-src="gen-32-12"></sup> Then he prepared a present:</p><p class="verse" dir="rtl" lang="he">ויקח מן הבא בידו מנחה לעשו אחיו</p><p>“And he took, from what came into his hand, a gift for Esav his brother.”<sup data-src="gen-32-14"></sup></p>`,
      steps: [
        {
          q: 'What is the value of the word <span class="he">במקלי</span> — “with my staff”?',
          hint: 'ב = 2, מ = 40, ק = 100, ל = 30, י = 10.',
        },
        {
          q: 'Whose name equals this number?',
          opts: ['Yaakov', 'Yisrael', 'Avraham', 'Yitzchak'],
        },
        {
          q: 'Take the first letters of the words <span class="he">הצילני נא מיד</span> — “save me, please, from the hand.” You may rearrange the letters. Whose name do you get?',
          hint: 'A three-letter name — the enemy of the Jews in the Megillah of Esther.',
        },
        {
          q: 'What is the value of the word <span class="he">מנחה</span> — “a gift”?',
          hint: 'מ = 40, נ = 50, ח = 8, ה = 5.',
        },
        {
          q: 'Which word equals this number — and tells what was in the gift besides the flocks?',
          opts: ['“stones”', '“gold”', '“silver”', '“sheep”'],
        },
      ],
      reveal: {
        h: 'One staff, one prayer',
        p: '“Bemakli,” “with my staff,” = 182 = “Yaakov”: I crossed the Jordan by myself, alone, with a single staff. The first letters of “hatzileni na miyad” spell “Haman”: hidden in Yaakov’s prayer is already the rescue of his children from Haman, who also wanted to destroy “little children and women.” And “minchah,” “a gift,” = 103 = “avanim,” “stones”: Yaakov sent Esav precious stones as well.',
      },
      lessons: [
        {
          h: 'Only I and my staff',
          b: `<p><span class="he">במקלי</span> = 2 + 40 + 100 + 30 + 10 = 182; <span class="he">יעקב</span> = 10 + 70 + 100 + 2 = 182.<sup data-src="bht-32-11-2"></sup></p><p class="expl"><b>Explanation.</b> Yaakov begins his prayer with thanks: I came here with nothing, and now I have two camps. One who remembers how he started knows how to give thanks.</p>`,
        },
        {
          h: 'A prayer for many generations',
          b: `<p>The first letters of <span class="he">הצילני נא מיד</span>: ה, נ, מ — <span class="he">המן</span>, Haman.<sup data-src="bht-32-12-1"></sup> Yaakov fears that Esav will strike “mother with children” — and Haman’s decree ordered the destruction of “little children and women” (Esther 3:13). Haman was a descendant of Amalek, Esav’s grandson.</p><p class="expl"><b>Explanation.</b> Yaakov asked for himself — and his prayer helped his children many centuries later. A sincere prayer is never lost.</p>`,
        },
        {
          h: 'Stones as a gift',
          b: `<p><span class="he">מנחה</span> = 40 + 50 + 8 + 5 = 103; <span class="he">אבנים</span> = 1 + 2 + 50 + 10 + 40 = 103.<sup data-src="bht-32-14"></sup></p><p class="expl"><b>Explanation.</b> Yaakov prepared for the meeting in three ways: with prayer, with a gift, and for war if need be. He prayed as though everything depends on the Almighty — and did everything he could himself.</p>`,
        },
      ],
      reflection: 'Yaakov remembered that he crossed the Jordan with only a staff. For which of the things I have now do I want to say “thank you”?',
      takeaways: [
        'במקלי = 182 = יעקב: I crossed the Jordan alone, with a single staff.',
        'The first letters of “הצילני נא מיד” spell המן: Yaakov’s prayer is also for rescue from Haman.',
        'מנחה = 103 = אבנים: the gift included precious stones.',
      ],
    },
    {
      title: 'Wrestling until dawn',
      cond: `<p>At night Yaakov brought his family across the Yabok stream and was left alone:</p><p class="verse" dir="rtl" lang="he">ויותר יעקב לבדו ויאבק איש עמו עד עלות השחר</p><p>“And Yaakov was left alone, and a man wrestled with him until the break of dawn. And he saw that he could not overcome him, and he touched the hollow of his thigh…”</p><p class="verse" dir="rtl" lang="he">ויאמר לא אשלחך כי אם ברכתני</p><p>“And he said: Let me go, for dawn has broken. And he said: I will not let you go unless you bless me.”<sup data-src="gen-32-25"></sup></p>`,
      steps: [
        {
          q: 'What is the value of the words <span class="he">איש עמו</span> — “a man with him”?',
          hint: 'איש = 1 + 10 + 300; עמו = 70 + 40 + 6.',
        },
        {
          q: 'Which words equal this number — and tell whose angel this was?',
          opts: ['“Esav — Edom”', '“angel”', 'Pharaoh', 'Lavan the Aramean'],
        },
        {
          q: 'Take the last letters of the words <span class="he">ויאבק איש עמו</span> — “and a man wrestled with him.” Which word do you get?',
          hint: 'Three letters in order: “his straw.”',
        },
        {
          q: 'Yaakov said: “I will not let you go unless <span class="he">ברכתני</span>” — “you bless me.” What is the value of this word?',
          hint: 'ב = 2, ר = 200, כ = 20, ת = 400, נ = 50, י = 10.',
        },
        {
          q: 'Which words equal this number — and tell what Yaakov obtained from the angel?',
          opts: ['“he acknowledged my blessing”', '“he gave me peace”', '“he sent me on my way”', '“he went to Seir”'],
        },
      ],
      reveal: {
        h: 'Esav’s angel acknowledged the blessing',
        p: '“Ish imo,” “a man with him,” = 427 = “Esav — Edom”: the one who wrestled with Yaakov was the ministering angel of Esav. The last letters of “vaye’avek ish imo” spell “kasho,” “his straw”: the house of Yaakov will be fire, and the house of Esav — straw. And “berachtani,” “you bless me,” = 682 = “hodah levirchati,” “he acknowledged my blessing”: Yaakov did not let the angel go until he agreed that Yitzchak’s blessings are his.',
      },
      lessons: [
        {
          h: 'A man — and straw',
          b: `<p><span class="he">איש</span> = 311, <span class="he">עמו</span> = 116; <span class="he">איש עמו</span> = 311 + 116 = 427; <span class="he">עשו אדום</span> = 376 + 51 = 427.<sup data-src="bht-32-25-2"></sup></p><p>The last letters of <span class="he">ויאבק איש עמו</span>: ק, ש, ו — <span class="he">קשו</span>, “his straw.”<sup data-src="bht-32-25-3"></sup> These are the words of the prophet Ovadiah.<sup data-src="obadiah-1-18"></sup></p><p class="expl"><b>Explanation.</b> The angel was strong and the struggle lasted all night — yet the very words about the struggle already hide its end: straw cannot stand before fire. Even a long night ends with dawn.</p>`,
        },
        {
          h: 'Why he touched the thigh',
          b: `<p><span class="he">בכף</span> = 102, <span class="he">ירכו</span> = 236; <span class="he">בכף ירכו</span> = 102 + 236 = 338; <span class="he">לפוסלו מכהונה</span> = 212 + 126 = 338.<sup data-src="bht-32-26"></sup></p><p class="expl"><b>Explanation.</b> Before the Torah was given, the firstborn performed the service, and a kohen with an injury cannot serve. Esav’s angel was still arguing over the birthright that Esav sold for a pot of lentils. But Yaakov, limping, went on — and remained blessed.</p>`,
        },
        {
          h: '“Unless you bless me”',
          b: `<p><span class="he">ברכתני</span> = 2 + 200 + 20 + 400 + 50 + 10 = 682; <span class="he">הודה לברכתי</span> = 20 + 662 = 682.<sup data-src="bht-32-27"></sup></p><p class="expl"><b>Explanation.</b> Yaakov received his father’s blessings, and Esav felt he had been cheated. Now Esav’s own angel admitted: they belong to Yaakov by right. Yaakov did not walk away from a hard conversation until the matter was clear.</p>`,
        },
      ],
      reflection: 'Yaakov wrestled all night and did not let go until he received a blessing. In which hard task is it important for me not to give up before “dawn”?',
      takeaways: [
        'איש עמו = 427 = עשו אדום: Esav’s angel wrestled with Yaakov.',
        'The last letters of “ויאבק איש עמו” spell קשו: the house of Esav is straw before fire.',
        'בכף ירכו = 338 = לפוסלו מכהונה: the angel wanted to take the service of the firstborn from Yaakov.',
        'ברכתני = 682 = הודה לברכתי: the angel acknowledged Yaakov’s blessings.',
      ],
    },
    {
      title: 'The brothers meet',
      cond: `<p>Morning came. Yaakov saw Esav and went ahead:</p><p class="verse" dir="rtl" lang="he">וישתחו ארצה שבע פעמים עד גשתו עד אחיו</p><p>“And he bowed to the ground seven times, until he came near to his brother.”</p><p class="verse" dir="rtl" lang="he">וירץ עשו לקראתו ויחבקהו ויפל על צוארו וישקהו ויבכו</p><p>“And Esav ran to meet him, and embraced him, and fell on his neck and kissed him, and they wept.”<sup data-src="gen-33-3"></sup> Yaakov asked him to accept the gift, and Esav answered:</p><p class="verse" dir="rtl" lang="he">יש לי רב אחי יהי לך אשר לך</p><p>“I have plenty; my brother, let what is yours be yours.”<sup data-src="gen-33-9"></sup></p>`,
      steps: [
        {
          q: 'How many times did Yaakov bow to the ground as he walked toward his brother?',
          hint: 'The number is written in the verse.',
        },
        {
          q: 'What is the value of the word <span class="he">וישקהו</span> — “and he kissed him”? In the Torah scroll there are dots above it.',
          hint: 'ו = 6, י = 10, ש = 300, ק = 100, ה = 5, ו = 6.',
        },
        {
          q: 'Which word equals this number — and tells what Esav wanted at first?',
          opts: ['“to bite him”', '“to hug him”', '“to bless him”', '“to love him”'],
        },
        {
          q: 'What is the value of Esav’s words <span class="he">אחי יהי לך אשר לך</span> — “my brother, let what is yours be yours”?',
          hint: 'אחי = 19, יהי = 25, לך = 50, אשר = 501, לך = 50.',
        },
        {
          q: 'Which words equal this number — and tell what Esav really conceded to Yaakov?',
          opts: ['“these are the blessings”', '“this is the birthright”', '“these are the sheep”', '“this is the silver”'],
        },
      ],
      reveal: {
        h: 'A kiss — and “what is yours”',
        p: 'Seven bows — “a righteous man falls seven times and rises.” “Vayishakehu,” “and he kissed him,” = 427 = “lenoshchehu,” “to bite him” — the same number as “Esav — Edom”: Esav wanted to bite his brother, but it came out a kiss. And the words “my brother, let what is yours be yours” = 645 = “zeh haberachot,” “these are the blessings”: Esav himself agreed that the blessings are Yaakov’s. And one more thing: eight times Yaakov called Esav “my lord” — and Esav had eight kings before Israel had one.',
      },
      lessons: [
        {
          h: 'Seven bows',
          b: `<p>For the seven bows the Baal HaTurim quotes a verse from Proverbs.<sup data-src="prov-24-16"></sup><sup data-src="bht-33-3"></sup></p><p class="expl"><b>Explanation.</b> Yaakov does not bow out of weakness. Every bow is a step toward peace: seven times he “falls” and seven times he rises, and with every step the anger in Esav’s heart melts.</p>`,
        },
        {
          h: 'Dots above the kiss',
          b: `<p><span class="he">וישקהו</span> = 6 + 10 + 300 + 100 + 5 + 6 = 427; <span class="he">לנושכיהו</span> = 30 + 50 + 6 + 300 + 20 + 10 + 5 + 6 = 427.<sup data-src="bht-33-4"></sup> It is the same number as <span class="he">איש עמו</span> and <span class="he">עשו אדום</span> in the previous riddle.</p><p>In the Torah scroll there is a dot above every letter of this word. Rashi brings two opinions about what they mean.<sup data-src="rashi-33-4"></sup></p><p class="expl"><b>Explanation.</b> Esav ran toward him with a bad intention — and it ended with both of them in tears. Yaakov’s prayer, gift and seven bows did their work: even an enemy can be met in a way that makes him a brother.</p>`,
        },
        {
          h: '“What is yours”',
          b: `<p><span class="he">אחי</span> = 19, <span class="he">יהי</span> = 25, <span class="he">לך</span> = 50, <span class="he">אשר</span> = 501; <span class="he">אחי יהי לך אשר לך</span> = 19 + 25 + 50 + 501 + 50 = 645; <span class="he">זה הברכות</span> = 12 + 633 = 645.<sup data-src="bht-33-9"></sup></p><p class="expl"><b>Explanation.</b> At night Esav’s angel acknowledged the blessings, and by day — Esav himself, in his own words. The quarrel that began in Yitzchak’s house ended in peace.</p>`,
        },
        {
          h: 'Eight times “my lord”',
          b: `<p>At the end of the parshah the Torah lists the kings of Edom who reigned “before any king reigned over the children of Israel”<sup data-src="gen-36-31"></sup> — there are eight of them. And in our parshah Yaakov calls Esav <span class="he">אדני</span>, “my lord,” eight times: 32:5, 32:6, 32:19, 33:8, 33:13, twice in 33:14, and 33:15.<sup data-src="bht-36-31"></sup></p><p class="expl"><b>Explanation.</b> Every word has weight. Yaakov’s politeness saved his family — and still the Torah counted every “my lord.” Respect is good, but it is better not to say more words than needed.</p>`,
        },
      ],
      reflection: 'Yaakov walked toward a brother who was angry with him — with bows and a gift. With whom should I make peace, and what first step can I take?',
      takeaways: [
        'Seven bows: “a righteous man falls seven times and rises.”',
        'וישקהו = 427 = לנושכיהו: Esav wanted to bite, but it came out a kiss.',
        'אחי יהי לך אשר לך = 645 = זה הברכות: Esav himself conceded the blessings.',
        'Eight times “my lord” — eight kings of Edom before the kings of Israel.',
      ],
    },
  ],
  memo: {
    intro:
      'Twelve comments of the Baal HaTurim on Parshat Vayishlach — twelve pairs of cards. Each picture tells about one comment, and its pair is the words of the Torah it speaks about.',
    items: [
      {
        title: '613 mitzvot with Lavan',
        caption: 'A scroll',
        verse: '“I have sojourned with Lavan”',
        quote: '“I have sojourned with Lavan” — although I was in Lavan’s house, I kept the 613 mitzvot.',
        explain:
          'The word גרתי (“I sojourned”) = 3 + 200 + 400 + 10 = 613 — the number of mitzvot in the Torah. Yaakov lived twenty years with Lavan the deceiver — and did not learn from his deeds.',
        moral: 'Wherever you live, you can stay yourself.',
      },
      {
        title: 'Yosef was born',
        caption: 'The head of an ox with horns',
        verse: '“and I have ox and donkey”',
        quote: '“I have an ox” — in gematria “Yosef was born.”',
        explain:
          'לי שור = 40 + 506 = 546, and שנולד יוסף (“Yosef was born”) = 546. The ox is the sign of Yosef: Moshe called him “his firstborn ox.” Yaakov set out to meet Esav once Yosef was born.',
        moral: 'Yaakov’s strength is in his children.',
      },
      {
        title: 'With a single staff',
        caption: 'A staff and a river',
        verse: '“for with my staff I crossed the Jordan”',
        quote: '“With my staff” — in gematria “Yaakov”: I myself, alone.',
        explain:
          'The word במקלי = 182, and יעקב = 182. Yaakov crossed the Jordan alone, with a single staff — and came back with a large family and two camps. He begins his prayer with thanks.',
        moral: 'One who remembers how he started knows how to give thanks.',
      },
      {
        title: 'Mother with children',
        caption: 'A mother and two children',
        verse: '“save me, please, from the hand of my brother”',
        quote: '“Save me, please, from the hand” — the first letters spell “Haman,” who went out to strike mother with children.',
        explain:
          'The first letters of הצילני נא מיד: ה, נ, מ — המן, Haman. He, a descendant of Esav, also wanted to destroy “little children and women.” Yaakov’s prayer helped his children in the days of Esther as well.',
        moral: 'A sincere prayer helps even many generations later.',
      },
      {
        title: 'Stones as a gift',
        caption: 'A pouch and precious stones',
        verse: '“a gift for Esav his brother”',
        quote: '“A gift” — in gematria “stones”: he sent him precious stones.',
        explain:
          'The word מנחה = 103, and אבנים (“stones”) = 103. Besides the flocks, Yaakov sent Esav precious stones — the kind one can tie up in one’s hand.',
        moral: 'Pray — and do everything you can yourself.',
      },
      {
        title: 'Who wrestled with Yaakov',
        caption: 'Two wrestle under the stars',
        verse: '“and a man wrestled with him”',
        quote: '“A man with him” — in gematria “Esav — Edom.”',
        explain:
          'איש עמו = 311 + 116 = 427, and עשו אדום = 427. The one who wrestled with Yaakov at night was the ministering angel of Esav.',
        moral: 'Do not retreat, even when the opponent is strong.',
      },
      {
        title: 'Straw and fire',
        caption: 'A sheaf of straw and a flame',
        verse: '“until the break of dawn”',
        quote: '“And a man wrestled with him” — the last letters spell “his straw”: “and the house of Esav for straw.”',
        explain:
          'The last letters of ויאבק איש עמו: ק, ש, ו — קשו, “his straw.” The prophet Ovadiah says: the house of Yaakov will be fire, and the house of Esav — straw.',
        moral: 'Even the longest night ends with dawn.',
      },
      {
        title: 'The service of the firstborn',
        caption: 'An altar with fire',
        verse: '“and he touched the hollow of his thigh”',
        quote: '“The hollow of his thigh” — in gematria “to disqualify him from the priesthood.”',
        explain:
          'בכף ירכו = 102 + 236 = 338, and לפוסלו מכהונה = 338. Yaakov bought the birthright from Esav, and with it the right to serve. Esav’s angel wanted to take that right from him.',
        moral: 'Yaakov limped — and still went on.',
      },
      {
        title: 'A blessing at dawn',
        caption: 'The sun rises over the hills',
        verse: '“unless you bless me”',
        quote: '“You bless me” — in gematria “he acknowledged my blessing”: for he was Esav’s angel.',
        explain:
          'The word ברכתני = 682, and הודה לברכתי (“he acknowledged my blessing”) = 682. Yaakov did not let the angel go until he admitted: Yitzchak’s blessings belong to Yaakov.',
        moral: 'A hard task is seen through to the end.',
      },
      {
        title: 'Seven bows',
        caption: 'A man bows; seven circles',
        verse: '“and he bowed to the ground seven times”',
        quote: '“And he bowed to the ground seven times” — “for a righteous man falls seven times and rises.”',
        explain:
          'Yaakov bowed seven times as he came near Esav. The Baal HaTurim recalls a verse from Proverbs: a righteous man falls seven times — and rises. With every bow the anger in Esav’s heart melted.',
        moral: 'The first step toward peace is not weakness but strength.',
      },
      {
        title: 'Dots above the kiss',
        caption: 'Brothers embrace; six dots above them',
        verse: '“and he fell on his neck and kissed him”',
        quote: '“And he kissed him” — in gematria “to bite him.”',
        explain:
          'The word וישקהו = 427, and לנושכיהו (“to bite him”) = 427. In the Torah scroll there are dots above this word: Esav wanted to bite his brother — but it came out a kiss, and both wept.',
        moral: 'Even an enemy can be met in a way that makes him a brother.',
      },
      {
        title: '“What is yours”',
        caption: 'A document with a seal',
        verse: '“my brother, let what is yours be yours”',
        quote: '“My brother, let what is yours be yours” — in gematria “these are the blessings.”',
        explain:
          'אחי יהי לך אשר לך = 19 + 25 + 50 + 501 + 50 = 645, and זה הברכות (“these are the blessings”) = 645. Esav himself said: the blessings are yours.',
        moral: 'An old quarrel can end in peace.',
      },
    ],
  },
  daily: {
    intro:
      'Parshat Vayishlach for every day: two comments of the Baal HaTurim a day — Sunday through Friday. The verse, the words of the Baal HaTurim in Hebrew with a translation, and an explanation — about five minutes.',
    items: [
      {
        h: '“I have sojourned with Lavan”',
        b: '<p><span class="he">גרתי</span> = 3 + 200 + 400 + 10 = 613.</p><p>Rashi brings this gematria: “I sojourned with Lavan — and kept the 613 mitzvot, and did not learn from his evil deeds.” Yaakov is telling Esav: I am still the same Yaakov.</p><p class="expl"><b>Explanation.</b> Twenty years next to a deceiver — and not one bad habit. Wherever a person lives, he can stay true to what he was taught at home.</p>',
      },
      {
        h: 'Ox and donkey',
        b: '<p><span class="he">לי שור</span> = 40 + 506 = 546 = <span class="he">שנולד יוסף</span>. <span class="he">שור</span> = 300 + 6 + 200 = 506 = <span class="he">קרן יוסף</span>.</p><p>The ox is Yosef: Moshe said of him “his firstborn ox” (Deuteronomy 33:17). The donkey is Yissachar: “a strong-boned donkey” (Genesis 49:14), the tribe that learns Torah.</p><p class="expl"><b>Explanation.</b> Yaakov does not come to Esav empty-handed: with him are Yosef and the voice of Torah in the houses of study.</p>',
      },
      {
        h: 'With a single staff',
        b: '<p><span class="he">במקלי</span> = 2 + 40 + 100 + 30 + 10 = 182 = <span class="he">יעקב</span>.</p><p>Yaakov left home alone, with a single staff — and returns with a family and two camps. This is how he begins his prayer: “I am too small for all the kindnesses.”</p><p class="expl"><b>Explanation.</b> One who remembers how he started knows how to give thanks — and how to ask.</p>',
      },
      {
        h: 'Haman in Yaakov’s prayer',
        b: '<p>The first letters of <span class="he">הצילני נא מיד</span>: ה, נ, מ — <span class="he">המן</span>, Haman.</p><p>Yaakov fears for “mother with children,” and Haman’s decree was to destroy “little children and women” (Esther 3:13). Haman was a descendant of Amalek, Esav’s grandson.</p><p class="expl"><b>Explanation.</b> Yaakov asked for himself — and his prayer helped his children many centuries later.</p>',
      },
      {
        h: 'Stones as a gift',
        b: '<p><span class="he">מנחה</span> = 40 + 50 + 8 + 5 = 103 = <span class="he">אבנים</span>.</p><p>“From what came into his hand” — what fits in a hand: precious stones. Yaakov sent them together with the flocks.</p><p class="expl"><b>Explanation.</b> Yaakov prayed as though everything depends on the Almighty — and prepared a gift as though everything depends on him.</p>',
      },
      {
        h: 'A man — and straw',
        b: '<p><span class="he">איש עמו</span> = 311 + 116 = 427 = <span class="he">עשו אדום</span>. The last letters of <span class="he">ויאבק איש עמו</span>: ק, ש, ו — <span class="he">קשו</span>, “his straw.”</p><p>The prophet Ovadiah: “And the house of Yaakov shall be fire… and the house of Esav for straw” (Obadiah 1:18).</p><p class="expl"><b>Explanation.</b> The struggle lasted all night — yet the very words about it already hide its end. Even a long night ends with dawn.</p>',
      },
      {
        h: 'Why he touched the thigh',
        b: '<p><span class="he">בכף ירכו</span> = 102 + 236 = 338 = <span class="he">לפוסלו מכהונה</span>.</p><p>Yaakov bought the birthright from Esav, and the service belonged to the firstborn. A kohen with an injury does not serve — so Esav’s angel struck Yaakov on the thigh.</p><p class="expl"><b>Explanation.</b> Yaakov limped — and went on. The wound did not cancel what was his by right.</p>',
      },
      {
        h: '“Unless you bless me”',
        b: '<p><span class="he">ברכתני</span> = 2 + 200 + 20 + 400 + 50 + 10 = 682 = <span class="he">הודה לברכתי</span>.</p><p>Yaakov did not let the angel go until he admitted: Yitzchak’s blessings are Yaakov’s.</p><p class="expl"><b>Explanation.</b> Yaakov did not walk away from a hard conversation until the matter was clear.</p>',
      },
      {
        h: 'Seven bows',
        b: '<p>Yaakov bowed to the ground seven times as he came near his brother. The Baal HaTurim: “for a righteous man falls seven times and rises” (Proverbs 24:16) — and to remove seven abominations from Esav’s heart.</p><p class="expl"><b>Explanation.</b> Every bow is a step toward peace. The first step toward another is not weakness but strength.</p>',
      },
      {
        h: 'Dots above the kiss',
        b: '<p><span class="he">וישקהו</span> = 6 + 10 + 300 + 100 + 5 + 6 = 427 = <span class="he">לנושכיהו</span>.</p><p>In the Torah scroll there are dots above the word. Rashi: some say Esav did not kiss him with his whole heart; and Rabbi Shimon ben Yochai says that at that moment his pity was stirred and he kissed him with his whole heart.</p><p class="expl"><b>Explanation.</b> Esav ran with a bad intention — and it ended with both in tears. Even an enemy can be met in a way that makes him a brother.</p>',
      },
      {
        h: '“What is yours”',
        b: '<p><span class="he">אחי יהי לך אשר לך</span> = 19 + 25 + 50 + 501 + 50 = 645 = <span class="he">זה הברכות</span>.</p><p>At night Esav’s angel acknowledged the blessings, and by day — Esav himself, in his own words.</p><p class="expl"><b>Explanation.</b> The quarrel that began in Yitzchak’s house ended in peace.</p>',
      },
      {
        h: 'Eight kings of Edom',
        b: '<p>Yaakov called Esav “my lord” eight times — and Esav had eight kings before any king reigned over Israel.</p><p>Eight times: 32:5, 32:6, 32:19, 33:8, 33:13, twice in 33:14, and 33:15. The kings of Edom at the end of the parshah (36:31–39) are also eight.</p><p class="expl"><b>Explanation.</b> Every word has weight: the Torah counted every “my lord.” Respect is good, but it is better not to say more words than needed.</p>',
      },
    ],
  },
  final: {
    title: 'A meeting in peace',
    allSolved:
      'All four riddles are solved. With Lavan, Yaakov kept the 613 mitzvot and returned once Yosef was born; he crossed the Jordan with a single staff, and hidden in his prayer is the rescue from Haman; at night Esav’s angel wrestled with him — and acknowledged his blessings; and by day Esav’s kiss, which could have been a bite, ended in tears, and Esav himself said: “what is yours is yours.”',
  },
  audience: 'Gematria of one to five words, addition, games with first and last letters; a familiar story — Yaakov and Esav, the wrestling with the angel. Younger children — together with an adult.',
  practice:
    'This week, take the first step toward peace with someone you have quarreled with: a kind word, a small gift, or simply “shalom.” And before a hard task — like Yaakov — first say “thank you” to the Almighty for what you already have.',
  highlight: '“And he kissed him” equals “to bite him”: Esav wanted to bite, but it came out a kiss.',
  share: ({ score, max, time, grid, allSolved, site }) => `🤝 What was in Esav’s kiss? The answer is in the gematria of the word “and he kissed him.”

I’m playing a gematria game on the Baal HaTurim’s commentary to Parshat Vayishlach. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: what Yaakov told Esav with one word, who is hidden in his prayer, who wrestled with him until dawn, and what was in his brother’s kiss. Can you do better?
Play 👉 ${site}

©mychitas.app`,
  source:
    'Based on the commentary of the Baal HaTurim (Rabbi Yaakov ben Asher, 14th c.) on Parshat Vayishlach (Genesis 32:4–36:43), the short version (Kitzur Baal HaTurim). Hebrew text — Sefaria; translation — the Niflaot project.',
};

export default en;
