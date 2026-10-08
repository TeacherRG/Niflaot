import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Three Hours',
  hero: {
    heading: 'Why couldn’t Adam hold out <i>for just three hours?</i>',
    author: 'from a talk of the Lubavitcher Rebbe · Simchat Torah 5723',
    intro:
      'The first man — fashioned by the hands of G-d Himself — heard the prohibition from Him directly. A prohibition for just three hours. And he could not hold out. Investigate with the Rebbe: why — and what it teaches every home.',
  },
  summary:
    'Why couldn’t Adam keep a prohibition for just three hours? “Whoever is greater than his fellow, his evil inclination is greater too.” Why at Sinai Moshe spoke to the women first. The home as a small Sanctuary.',
  glossary: {},
  riddles: [
    {
      title: 'Three hours',
      cond: `<p>Parshat Bereshit is read at the end of Tishrei, at the start of the new year, and it gives guidance for the whole year. It contains the first command G-d gave to man:</p><p class="verse" dir="rtl" lang="he">ומעץ הדעת טוב ורע לא תאכל ממנו כי ביום אכלך ממנו מות תמות</p><p>“But of the tree of the knowledge of good and evil, you shall not eat of it; for on the day that you eat of it you shall surely die.”<sup data-src="gen-2-17"></sup></p><p>The Talmud lays out the sixth day of creation hour by hour. The day has twelve hours. <b>In the ninth hour</b> Adam was commanded not to eat from the tree; <b>in the tenth</b> he sinned.<sup data-src="sanhedrin-38b"></sup> When the twelfth hour ends, the first Shabbat begins — and the prohibition is lifted.</p>`,
      steps: [
        {
          q: 'How many hours did Adam need to hold out — from the command in the ninth hour to the end of the day?',
          hint: 'Subtract 9 from the 12 hours of the day.',
        },
        {
          q: 'And how many hours did he actually hold out?',
          hint: 'The command — in the ninth hour; the sin — in the tenth.',
        },
        {
          q: 'The Midrash wonders: Adam could not hold out for even an hour, while his descendants, by the Torah’s command, do not eat the fruit of a young tree for three years. What is this prohibition called?',
          hint: 'The Torah calls the fruit of a tree’s first years “uncircumcised” — ערלים.',
          opts: [
            '“orlah” — the fruit of a tree in its first three years',
            '“shemitah” — the seventh year, when the land is not worked',
            '“yovel” — the fiftieth year',
            '“Shabbat” — the day of rest',
          ],
        },
      ],
      reveal: {
        h: 'He needed three hours. He held out one',
        p: 'The prohibition applied only on that day: from the ninth hour until evening, three hours. But Adam sinned already in the tenth. “Adam, you could not stand by your command for even one hour,” says the Midrash, “while your descendants wait three years for orlah!”<sup data-src="bereshit-rabbah-21-7"></sup>',
      },
      lessons: [
        {
          h: 'Bereshit — guidance for the whole year',
          b: `<p>Parshat Bereshit is read at the end of Tishrei, the month that begins the new year. That is why what it tells us is guidance for the whole coming year.</p><p>One such teaching is G-d’s first command: the directive to Adam not to eat from the Tree of Knowledge. It is apparent from the Midrash that this command applied only on that day.<sup data-src="bereshit-rabbah-21-7"></sup> And when one considers the events of the sixth day of creation, it turns out that it was to be in effect for only three hours. The command was given in the ninth hour after daybreak;<sup data-src="sanhedrin-38b"></sup> three hours later the day was to end, the first Shabbat was to begin — and the prohibition was to be lifted. Yet despite the short time involved, Adam could not restrain himself and violated G-d’s command.</p>`,
        },
        {
          h: 'Fashioned by the hands of G-d',
          b: `<p>The question arises. Adam was “the handiwork of the Holy One, blessed be He, Himself”<sup data-src="bereshit-rabbah-24-5"></sup> and heard this prohibition from Him directly. How could he not restrain himself for even three hours?</p><p>The Midrash speaks of this in wonder: “Who will remove the dust from your eyes, Adam? You could not stand by the command for even one hour — while your children wait three years for orlah.”<sup data-src="bereshit-rabbah-21-7"></sup></p>`,
        },
        {
          h: 'Not only mysteries',
          b: `<p>It is true that many mystical secrets are associated with this sin. But every narrative of the Torah must also be understood in its plain sense: “a verse does not depart from its plain meaning.”<sup data-src="shabbat-63a"></sup> So why — in the plain sense — did Adam transgress?</p>`,
        },
      ],
      reflection: 'What are my “three hours” today — a short effort that seems simple, yet somehow is the hardest of all?',
      takeaways: [
        'Bereshit is read at the start of the year: its stories are guidance for the whole year.',
        'The prohibition of the Tree of Knowledge applied only on that day: from the ninth hour to Shabbat — three hours.',
        'Adam sinned in the tenth hour — he could not hold out even one hour, while his descendants wait three years for orlah.',
        'The question of the talk: how could the handiwork of G-d, who heard the command from Him directly, not restrain himself?',
      ],
      puzzle: {
        q: 'Put the sixth day of creation in order, hour by hour.',
        pieces: ['Hour 9: the command', 'Hour 10: the sin', 'Hour 12: the day ends', 'Shabbat: the prohibition lifted'],
        meaning: 'He had to hold out three hours, until Shabbat — but Adam sinned after just one. Hence the question of the whole talk: why?',
      },
    },
    {
      title: 'Greater than his fellow',
      cond: `<p>The Rebbe answers: we must understand <b>what the evil inclination</b> (yetzer hara) <b>is really after</b>.</p><p>The Talmud tells of Abaye, a great sage. Once he saw another man withstand a temptation and thought: “In his place I would not have withstood it.” Abaye was deeply distressed. Then an elder came and taught him: “Whoever is greater than his fellow — his … is greater too.”<sup data-src="sukkah-52a"></sup></p>`,
      steps: [
        {
          q: 'The evil inclination has all kinds of arguments, but, the Rebbe says, they have one aim. Which?',
          hint: 'The evil inclination is not after pleasure for its own sake.',
          opts: [
            '“that a person go against G-d’s will”',
            '“that a person enjoy himself”',
            '“that a person rest”',
            '“that a person succeed”',
          ],
        },
        {
          q: 'Complete the elder’s words: “Whoever is greater than his fellow — his … is greater too.”',
          hint: 'Abaye was distressed that he would not have withstood the temptation. How did the elder comfort him?',
          opts: ['“his evil inclination”', '“his reward”', '“his honor”', '“his portion”'],
        },
        {
          q: 'Rav Yosef asked the son of the sage Rabbah: “Your father — in what was he especially …?” He answered: “In tzitzit.” Which word is missing?',
          hint: 'Rabbah guarded this mitzvah greatly: if a thread of his tzitzit tore, he would not take another step until he had tied on a new one.',
          opts: ['“careful, vigilant”', '“joyful”', '“wealthy”', '“strong”'],
        },
      ],
      reveal: {
        h: 'The greater the man, the greater his evil inclination',
        p: 'The evil inclination wants one thing — that a person go against G-d’s will — and it fights hardest where a mitzvah matters most. Adam, the handiwork of G-d, was greater than all, and the fate of him and of all his descendants depended on the command about the Tree. So the evil inclination, clothed in the serpent, came against him with all its power.',
      },
      lessons: [
        {
          h: 'What the evil inclination wants',
          b: `<p>The entire intent of the evil inclination is to make a person do the opposite of what G-d wants. All the arguments it offers to persuade a person to transgress a prohibition or not to perform a mitzvah have one motive: that the person should transgress G-d’s will.</p><p>There are situations — because of the individual, the place or the time — in which observing a mitzvah takes on particular importance. In these situations the evil inclination makes a special effort. Although in truth such a mitzvah is easy to keep, precisely because it is so important, the evil inclination presents all kinds of demands and rationales to keep the person from fulfilling G-d’s will.</p>`,
        },
        {
          h: 'Why the “easy” feels hardest',
          b: `<p>There are times when each of us can “hear the voice” of the evil inclination trying to persuade us in just this way. Some aspects of keeping the Torah and its mitzvot should logically be far easier than others. And yet at times a person feels that precisely these “easy” matters are the greatest challenge. As explained, the evil inclination resists most where the matter is most important for that person.</p><p>The halachic weight of the question is not what decides. At times the challenge lies in a Rabbinic ordinance or even a custom, while a mitzvah of the Torah is far easier to keep. And yet, for the person’s spiritual welfare, the Rabbinic mitzvah or the custom can be more important at that time.</p>`,
        },
        {
          h: 'Every soul has its mitzvot',
          b: `<p>A parallel concept. Chassidic teaching interprets<sup data-src="tanya-ih-7"></sup> the Sages’ question “Your father — in what was he especially careful?”<sup data-src="shabbat-118b"></sup> to mean that every soul has particular mitzvot more connected with its mission in this world than others. The word <span class="he">זהיר</span> (“careful”) is related to <span class="he">זוהר</span> — “radiance”: through this mitzvah the soul shines.</p><p>And since the evil inclination knows that these mitzvot are more important, it puts greater obstacles in their way.</p>`,
        },
        {
          h: 'Greater than his fellow',
          b: `<p>This explains the Sages’ words: “Whoever is greater than his fellow — his evil inclination is greater too.”<sup data-src="sukkah-52a"></sup> The greater a person is, the more important the mitzvot he performs — and the more the evil inclination opposes him.</p><p>There is also another explanation. To allow for free choice, the powers of holiness must be balanced by the forces that oppose them. Since he has been given greater powers in holiness — he is “greater than his fellow” — his evil inclination is also granted greater power.</p>`,
        },
        {
          h: 'Why Adam ate from the Tree',
          b: `<p>Now we can understand why Adam ate from the Tree of Knowledge. He was “the handiwork of the Holy One, blessed be He, Himself,” that is, “greater than his fellows” — and so “his evil inclination was greater than he.”</p><p>All the more so because the command not to eat from the Tree of Knowledge had far-reaching implications, as seen from how far Adam and all his descendants fell because of the sin. Therefore the evil inclination, clothed in the serpent, contended with Adam with all its power and compelled him to eat from the Tree of Knowledge.</p>`,
        },
      ],
      reflection: 'Which “easy” mitzvah is the hardest for me? Perhaps that is exactly my mitzvah?',
      takeaways: [
        'The evil inclination wants one thing: that a person go against G-d’s will.',
        'It resists most where a mitzvah matters most — for this person, in this place, at this time.',
        'That is why the “easy” is sometimes the hardest. Every soul has its own mitzvot: זהיר (“careful”) is related to זוהר, “radiance”.',
        '“Whoever is greater than his fellow, his evil inclination is greater too”: Adam, the handiwork of G-d, faced the strongest evil inclination.',
      ],
      puzzle: {
        q: 'Put the Rebbe’s answer together: from the rule — to Adam.',
        pieces: ['The aim: against G-d’s will', 'The greater the mitzvah, the harder', 'Greater man, greater inclination', 'Adam — G-d’s handiwork', 'The strongest test'],
        meaning: 'The evil inclination fights where it matters most. Adam was greater than all — so his test was the strongest; that is why he could not hold out even three hours.',
      },
    },
    {
      title: 'To whom G-d spoke',
      cond: `<p>But the Rebbe has one more clue. Compare the command G-d gave Adam with Chava’s words to the serpent.</p><p>The command:</p><p class="verse" dir="rtl" lang="he">ומעץ הדעת טוב ורע לא תאכל ממנו</p><p>“But of the tree of the knowledge of good and evil, you shall not eat of it.”<sup data-src="gen-2-17"></sup></p><p>Chava, to the serpent:</p><p class="verse" dir="rtl" lang="he">ומפרי העץ אשר בתוך הגן אמר אלקים לא תאכלו ממנו ולא תגעו בו פן תמתון</p><p>“But of the fruit of the tree in the midst of the garden, G-d said: You shall not eat of it, nor shall you touch it, lest you die.”<sup data-src="gen-3-3"></sup></p>`,
      steps: [
        {
          q: 'Which of Chava’s words were not in G-d’s command?',
          hint: 'G-d forbade only eating.',
          opts: ['“nor shall you touch it”', '“you shall not eat of it”', '“of the tree of knowledge”', '“of good and evil”'],
        },
        {
          q: 'Before giving the Torah, G-d told Moshe: “So shall you say to the house of Yaakov and tell the children of Israel.” Who are “the house of Yaakov”, whom Moshe addressed first?',
          hint: '“The children of Israel” in this verse are the men.',
          opts: ['“the women”', '“the men”', '“the elders”', '“the kohanim”'],
        },
        {
          q: 'The wedding blessing: “Grant joy to these loving companions, as You gladdened Your creation in the Garden of Eden …”. Which word of the blessing does the Rebbe explain as “before the sin”?',
          hint: 'The Rebbe asks: why is this word here, when everyone knows the Garden of Eden was long, long ago?',
          opts: ['“of old, before”', '“today”', '“forever”', '“now”'],
        },
      ],
      reveal: {
        h: 'Had Chava heard it herself',
        p: 'It was Adam, not Chava, who heard the prohibition. So she added on her own “nor shall you touch it” — and the serpent pushed her against the tree and said: “See, you did not die from touching it; you will not die from eating either.” Had Chava heard the command from G-d Himself, the serpent would not have fooled her, and she would have kept Adam back. That is why at Sinai Moshe spoke to the women first.',
      },
      lessons: [
        {
          h: 'To whom G-d spoke',
          b: `<p>When G-d gave the Torah to the Jewish people, He told Moshe: “So shall you say to the house of Yaakov.”<sup data-src="ex-19-3"></sup> Our Sages explain: “the house of Yaakov” are the women; Moshe was to tell them about receiving the Torah first. Why? The Midrash answers: G-d wanted to prevent a recurrence of what happened with the Tree of Knowledge — then it was Adam, and not Chava, who heard the command from G-d.<sup data-src="shemot-rabbah-28-2"></sup></p>`,
        },
        {
          h: 'Chava’s addition',
          b: `<p>This is what made the sin possible. Chava too was G-d’s handiwork — as it is written: “And the L-rd G-d built the rib…”<sup data-src="gen-2-21"></sup>. But she had not heard the command from G-d Himself — and she erred by widening the prohibition: she said that one may not only not eat from the tree, but not touch it either. This addition led to the sin: the serpent pushed her, she touched the tree, and it said: “See, you did not die from touching it; you will not die from eating either.”<sup data-src="bereshit-rabbah-19-3"></sup></p><p>Had Chava heard the prohibition of the Tree of Knowledge from G-d Himself, the serpent would not have fooled her, and she would have kept Adam from sinning — despite all the challenges of the evil inclination. This is what our Sages’ words about the giving of the Torah reflect.</p>`,
        },
        {
          h: 'The home — a small Sanctuary',
          b: `<p>The very word “Torah” is related to “horaah” — “instruction”. The stories of Parshat Bereshit give guidance for the whole year. So too this concept gives guidance about how a Jewish home should be.</p><p>Every Jewish home is “a small Sanctuary”<sup data-src="ez-11-16"></sup>, of which G-d says: “…and I will dwell among them.”<sup data-src="ex-25-8"></sup> The conduct of the home depends on its mistress, whom our tradition calls “the mainstay of the home”: <span class="he">עקרת הבית</span><sup data-src="ps-113-9"></sup> — “akeret habayit”, which the Sages read as “ikaro shel bayit”, “the main part of the home”. She should therefore be encouraged to bring more energy and joy to her Jewish practice. And this should be done remembering that “the Torah’s ways are pleasant ways, and all its paths are peace”<sup data-src="prov-3-17"></sup>, rather than by autocratic directives.</p><p>This protects the whole household, the husband included: had Chava heard the command from G-d Himself, she not only would not have sinned herself, but would also have kept Adam from the serpent’s overtures.</p>`,
        },
        {
          h: 'Half an hour a day',
          b: `<p>So the foundation of every person’s Torah activity begins in his own home. The Rebbe Rashab once said (Hayom Yom, 22 Tevet): just as putting on tefillin every day is a Torah commandment for every Jew, whether a great scholar or a simple person, so too every Jew is obligated to spend half an hour every day thinking about the education of his children. He must do everything in his power — and even beyond it — so that his children follow the path in which he guides them.</p>`,
        },
        {
          h: '“As of old”',
          b: `<p>Efforts to increase the Torah involvement of Jewish women will benefit Jewish men too. A wife’s thoughts, words and deeds will not run contrary to her husband’s; she will assist and complement him in all things, bringing binah — understanding — to the home. Our Sages say: “The Holy One, blessed be He, gave woman greater binah than man.”<sup data-src="niddah-45b"></sup></p><p>A wife active in Torah affects her entire household, making it a fit place for the Shechinah to rest. This is reflected in the wedding blessing: “Grant joy to these loving companions, as You gladdened Your creation in the Garden of Eden of old (<span class="he">מקדם</span>).”<sup data-src="ketubot-8a"></sup> Why “of old”? Everyone knows the story of Adam and Chava took place long ago. The blessing, however, refers to the time “before” — before the sin.</p><p>We wish that every new marriage be like the bond between Adam and Chava before the sin, when each assisted the other. Then the home will be fit to host G-d’s Presence, and there will be joy — “as You gladdened Your creation in the Garden of Eden of old.”</p>`,
        },
      ],
      reflection: 'How can I add joy and light to my home today — with a kind word rather than a directive?',
      takeaways: [
        'Adam, not Chava, heard the prohibition; she added “nor shall you touch it” — and the serpent used it.',
        'That is why at Sinai Moshe spoke first to the women — “the house of Yaakov”.',
        'Every home is a small Sanctuary, and its mainstay is the mistress of the home. Encourage her with pleasant ways, not with orders.',
        'The Rebbe Rashab: half an hour a day thinking about the children’s education is everyone’s duty, like tefillin.',
        '“As of old” — like Adam and Chava before the sin, when each helped the other.',
      ],
      puzzle: {
        q: 'Put the thought together: from the Garden of Eden — to the home.',
        pieces: ['Chava did not hear it herself', 'She added “nor touch it”', 'The serpent pushed — and fooled', 'At Sinai — the women first', 'The home — a small Sanctuary'],
        meaning: 'Chava’s mistake began with not hearing the command herself. That is why the Torah was given to the women first — and why it depends on the mistress of the home whether the home becomes a small Sanctuary.',
      },
    },
  ],
  final: {
    title: 'Case closed',
    allSolved:
      'All three riddles are solved. The three hours Adam could not hold out are explained: the greater the person, the greater the test. And the repair begins at home.',
  },
  puzzle: {
    q: 'Put together the path of the whole talk.',
    pieces: ['Three hours — and he failed', 'The greater, the greater the test', 'Chava did not hear it herself', 'At Sinai — the women first', 'The home — a small Sanctuary'],
    meaning: 'Adam failed because he was great, and Chava did not hear the command herself. The repair is in the home, where everyone hears the Torah and helps one another.',
  },
  cards: {
    intro: 'Twelve verses of Parshat Bereshit — and for each one explanation of the Rebbe from Likkutei Sichos. Find which explanation belongs to which verse.',
    items: [
      {
        title: 'Why with a ב',
        verse: '“In the beginning”',
        card: 'First acknowledge the Giver of the Torah (א), then learn it (ב)',
        explain: 'The Torah begins with the letter ב, not א. The Rebbe explains: learning Torah with intellect and understanding is the second step, ב. Before it comes the first step, א: to recognize and thank the One who gave the Torah.',
        horaah: 'Before learning, pause for a moment and remember Who gave the Torah — and then learn with intellect and understanding.',
      },
      {
        title: 'The hidden light',
        verse: '“Let there be light”',
        card: 'Light was created first and hidden in the Torah — for us to reveal',
        explain: 'Light — the main purpose of creation — was created first, though it was not yet needed, and then hidden; and G-d called it good. This light was hidden in the Torah, so that we have the power to reveal it again.',
        horaah: 'The purpose of our service is not only to drive away darkness, but to refine our portion of the world until it becomes light itself: “to turn darkness into light”.',
      },
      {
        title: 'Stars and fate',
        verse: '“Let there be lights”',
        card: 'The heavenly lights influence a life, but a Jew is not limited by them',
        explain: 'Mazal — the influence of the heavenly bodies — can affect a person’s life. But a Jew is not limited by it.',
        horaah: 'When you add to your service of G-d, there is no need to fear any “influences” at all.',
      },
      {
        title: 'Sun and moon',
        verse: '“the two great lights”',
        card: 'Created equal — only afterwards was the moon diminished',
        explain: 'The two luminaries were first created equal, and only afterwards was the moon’s light diminished. For the Jewish people, who receive the Torah, the Oral Torah (the moon) depends on the Written Torah (the sun) and is smaller than it. But from G-d’s side — in His plan — they are equal.',
        horaah: 'The Oral Torah is as precious as the Written Torah: from the side of the Giver of the Torah they are equal.',
      },
      {
        title: 'A mate for the great fish',
        verse: '“the great sea creatures”',
        card: 'The great fish had a mate: even a tzaddik needs a companion',
        explain: 'Rashi emphasizes that the great sea creatures had a mate; G-d called it good, and set one of them aside as a reward for the righteous. Hence: even a tzaddik needs a “companion” — a friend in serving G-d.',
        horaah: 'Find yourself a companion in serving G-d: everyone needs one, even a tzaddik.',
      },
      {
        title: 'The blessing of the fifth day',
        verse: '“And He blessed them”',
        card: 'Fish live in water — in G-d’s unlimited kindness',
        explain: 'On the fifth day G-d blessed the fish. Jews are born with a streak of kindness (chesed), but it is limited. Those born on the fifth day of the week are blessed with unlimited kindness — like the fish, nourished in the water by G-d’s kindness.',
        horaah: 'G-d’s unlimited kindness is received through complete self-nullification (bittul) — as the water completely covers the fish.',
      },
      {
        title: 'Without meat',
        verse: '“to you it shall be for food”',
        card: 'Man is creation’s peak, yet was not given meat: against arrogance',
        explain: 'The preceding verses raise man above the animals as the pinnacle of creation. Not allowing him to eat animals ensures that his greatness does not lead to arrogance.',
        horaah: 'The higher a person stands, the more he must guard against arrogance.',
      },
      {
        title: 'The exact moment',
        verse: '“And G-d finished on the seventh day”',
        card: 'G-d knows the exact moment Shabbat begins',
        explain: 'Rashi’s second explanation: in completing creation G-d did not violate Shabbat, because He knows the exact moment it begins.',
        horaah: 'Every moment is special: one missing moment can affect one’s entire service.',
      },
      {
        title: 'A new repair',
        verse: '“which G-d created to make”',
        card: 'Shabbat raised the world higher — so it needed a new repair',
        explain: 'In the six days of creation the world was complete. When Shabbat came — a higher level — the world now needed a new, higher tikkun (repair).',
        horaah: 'In our generation the world needs the learning of the inner part of the Torah — Chassidut.',
      },
      {
        title: 'Names for the animals',
        verse: '“that was its name”',
        card: 'By naming the animals Adam connected creation to its Source',
        explain: 'Adam’s service — naming the animals — connected creation with its Source. The giving of the Torah gave the power to connect creation with G-dliness itself; that is the service of the Jewish people.',
        horaah: 'In the blessings before the Shema we humble the animal soul; in the Shema itself we connect with G-dliness.',
      },
      {
        title: 'The best of what you have',
        verse: '“of the fruit of the ground”',
        card: 'Hevel brought the best of his kind — though better kinds existed',
        explain: 'Kayin brought an offering “of the fruit of the ground”, while Hevel brought the best of his kind, even though better kinds existed. Everything belongs to G-d, so what matters is not the kind but bringing the best of what one has.',
        horaah: 'In beautifying a mitzvah, do the best you can — within your own means.',
      },
      {
        title: 'A firm decision',
        verse: '“for I regret that I made them”',
        card: 'Not even in thought did G-d reach a firm decision against man',
        explain: 'G-d thought of destroying mankind, but issued the decree only after He had softened His anger. He considered what to do with man, but did not come to a firm decision even in thought.',
        horaah: 'Speak only good of others. And when you see someone do something wrong, make no firm judgment about him — even in thought.',
      },
    ],
  },
  audience: 'From 11: the arithmetic is the simplest, but the talk is about the evil inclination, family and home; younger children — together with an adult.',
  practice:
    'Choose an “easy” mitzvah that for some reason is hardest for you, and do it today with special care: perhaps it is truly yours. And for adults — in the words of the Rebbe Rashab — find half an hour today to think about your children’s education.',
  highlight: '“Whoever is greater than his fellow, his evil inclination is greater too” (Sukkah 52a).',
  share: ({ score, max, time, grid, allSolved, site }) => `⏳ Adam could not keep a prohibition for just three hours. Why?

I’m investigating with the Lubavitcher Rebbe — “Niflaot of the Rebbe”, Parshat Bereshit. ${allSolved ? 'All three riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Three riddles: the three hours of the sixth day, “greater than his fellow”, and why at Sinai Moshe spoke to the women first. Then — the cards: 12 verses of the portion and the Rebbe’s explanations.
Play 👉 ${site}

©mychitas.app`,
  source:
    'From a talk of the Lubavitcher Rebbe (Simchat Torah 5723; Likkutei Sichos, vol. 3, Bereshit), translated by E. Touger (Sichos in English); retold by the project. Cards — from the weekly table of the Rebbe’s talks “Nishmat Ephraim” (parshapages.com).',
};

export default en;
