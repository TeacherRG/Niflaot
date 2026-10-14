import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Go Out of the Ark',
  hero: {
    heading: 'Why was Noach commanded <i>to go out of the ark?</i>',
    author: 'based on a talk of the Lubavitcher Rebbe · Likkutei Sichot, vol. 25, Noach',
    intro:
      'The earth is already dry — and Noach sits in the ark and waits. Why didn’t he want to go out? Why did G-d have to command him “Go out” — and give a separate command about the animals? Investigate together with the Rebbe. And then — cards: twelve verses of the parshah and the Rebbe’s explanations.',
  },
  summary:
    'Why didn’t Noach want to leave the ark? In the ark there was peace, as in the days of Moshiach — and still: “Go out” and fill the earth. King Chizkiyahu and “the secrets of the Merciful One.” Plus cards: 12 verses of Parshat Noach and the Rebbe’s explanations.',
  glossary: {},
  riddles: [
    {
      title: 'Why a command?',
      cond: `<p>The Flood lasted a whole year. The Torah tells how the water left the earth, until at last:</p><p class="verse" dir="rtl" lang="he">ובחדש השני בשבעה ועשרים יום לחדש יבשה הארץ</p><p>“And in the second month, on the twenty-seventh day of the month, the earth was dry.”<sup data-src="gen-8-13"></sup> Right after this G-d says to Noach:</p><p class="verse" dir="rtl" lang="he">צא מן התבה אתה ואשתך ובניך ונשי בניך אתך</p><p>“Go out of the ark — you, and your wife, and your sons, and your sons’ wives with you.” And all the animals, birds and creeping things — “bring them out with you.”<sup data-src="gen-8-16-17"></sup></p><p>The Rebbe asks: if the earth was already dry — why command Noach to “go out”? Wouldn’t he have gone out by himself? And why another, separate command about the animals?</p>`,
      steps: [
        {
          q: 'Rashi explains what “the earth was dry” on the twenty-seventh day means. What happened to the earth?',
          hint: 'A month earlier the water was already gone, but the earth was still like mud.',
          opts: ['“it became hard, as earth should be”', '“it became like mud”', '“it was covered with water again”', '“it was covered with grass”'],
        },
        {
          q: 'The Midrash answers the question in Noach’s name. What did Noach say?',
          hint: 'The way Noach went into the ark — that is how he wanted to go out.',
          opts: ['“I went in only with permission — and I will go out only with permission”', '“I was afraid of the water”', '“I didn’t know the earth was dry”', '“I was asleep”'],
        },
        {
          q: 'But the Rebbe notes: Rashi does not bring this Midrash. According to Rashi, G-d told Noach “come into the ark” because Noach did not want to go in. So when did Noach go in?',
          hint: 'Rashi: Noach “believed and did not believe” that the Flood would come.',
          opts: ['“when the waters forced him”', '“right away and happily”', '“after all the animals”', '“when the raven came”'],
        },
        {
          q: 'In the verse about the animals the word is written “hotzei” (“bring out”) but read “haytzei” (“tell them to go out”). According to Rashi, what must Noach do if the animals do not want to go out?',
          hint: '“Haytzei” — tell them to go out. And “hotzei”?',
          opts: ['“bring them out yourself”', '“leave them in the ark”', '“go out without them”', '“let them go into the sea”'],
        },
      ],
      reveal: {
        h: 'The command is about going out itself',
        p: 'One could say: the command was needed not for going out, but for <i>how</i> to go out — husband and wife together: in the ark men and women lived apart, and here G-d allowed them family life again.<sup data-src="rashi-8-16"></sup> But the plain words of the verse say: the command was also about going out itself. And about the animals even more so: “if they do not want to go out, you bring them out.”<sup data-src="rashi-8-17"></sup> So both Noach and the animals did not want to leave the ark. Why?',
      },
      lessons: [
        {
          h: 'The earth was already dry',
          b: `<p>Our parshah tells: “And in the second month, on the twenty-seventh day of the month, the earth was dry” — and then G-d told Noach: “Go out of the ark, you and your wife… every living thing… bring out with you.”<sup data-src="gen-8-16-17"></sup></p><p>This is hard to understand. The earth was already completely dry: Rashi explains the word “dry” — “it became hard, as it should be.”<sup data-src="rashi-8-14"></sup> (When, even before that, “the waters were dried up from the earth,” it was still like mud.<sup data-src="gen-8-13"></sup>) Why, then, did Noach have to be told “Go out of the ark”? After all, everything Noach did before this — looking to see whether the water had gone from the earth — he did by himself, without a command.</p><p>What is more: a command to Noach himself is not enough — a separate command is needed about the animals: “every living thing… birds, cattle and every creeping thing… bring out with you”!</p>`,
        },
        {
          h: 'With permission?',
          b: `<p>The Midrash says: when the waters calmed, Noach should have gone out of the ark, but he said: “I went into the ark with the permission of the Holy One, blessed be He, Who told me: ‘Come, you and all your household, into the ark’ — and now I will go out only with His permission.”<sup data-src="bereshit-rabbah-34-4"></sup></p><p>But Rashi does not bring this Midrash. More importantly — according to the plain meaning, as Rashi writes explicitly, G-d told Noach “come… into the ark”<sup data-src="gen-7-1"></sup> not to give him permission, but because Noach did not want to go in: he “believed and did not believe that the Flood would come, and did not enter the ark until the waters forced him.”<sup data-src="rashi-7-7"></sup></p>`,
        },
        {
          h: 'How to go out',
          b: `<p>Simply put, one could say: the command was needed not for going out itself, but for <i>how</i> to go out: “you and your wife, and your sons, and your sons’ wives with you.” Rashi explains: “husband and wife — here He allowed them married life again.”<sup data-src="rashi-8-16"></sup> In the ark it had been different: “the men separately and the women separately” — married life there was forbidden.<sup data-src="rashi-6-18"></sup></p><p>The same with the animals: it had to be said (at the end of the verse) that they would “swarm on the earth, and be fruitful and multiply on the earth.” Rashi: “but not in the ark — this tells us that the cattle and the birds too were forbidden to mate there.”<sup data-src="rashi-8-17-2"></sup></p>`,
        },
        {
          h: 'And still — going out itself',
          b: `<p>But the plain words of the verse show that the command was also about going out itself — “go out of the ark.” And about the animals it is said even more strongly: “it is written ‘hotzei’… if they do not want to go out — you bring them out.”<sup data-src="rashi-8-17"></sup> So the animals might not want to leave the ark — and that is why it says “bring them out,” even against their will. (The Maharal in his book Gur Aryeh explains: they did not want to leave because in the ark their food was ready for them.)</p>`,
        },
      ],
      reflection: 'Do I have my own “ark” — a place where I feel so good that I don’t want to leave it?',
      takeaways: [
        'The earth was completely dry — “it became hard, as it should be” — and still G-d commanded Noach: “Go out of the ark.”',
        'The Midrash: Noach went in with permission and waited for permission to go out. But according to Rashi, Noach had to be commanded to go in because he did not want to.',
        'A simple answer: the command was about how to go out — husband and wife together; in the ark they lived apart.',
        'But the verse also speaks of going out itself, and about the animals — “if they do not want to, bring them out.” Neither Noach nor the animals wanted to leave.',
      ],
      puzzle: {
        q: 'Put the investigation in order: from the verse to the question.',
        pieces: ['The earth became hard', '“Go out of the ark”', 'How: husband and wife together', '“If they refuse — bring them out”', 'Why didn’t they want to leave?'],
        meaning: 'The command was needed not only for how to go out, but for going out itself: both Noach and the animals did not want to leave the ark. Why — the next riddle will reveal.',
      },
    },
    {
      title: 'The wolf with the lamb',
      cond: `<p>The prophet Isaiah describes what the world will be like in the days of Moshiach:</p><p class="verse" dir="rtl" lang="he">וגר זאב עם כבש ונמר עם גדי ירבץ… ונער קטן נהג בם</p><p>“And the wolf shall dwell with the lamb, and the leopard shall lie down with the kid… and a little child shall lead them… They shall not hurt nor destroy.”<sup data-src="isaiah-11-6"></sup></p><p>The Rebbe says: in Noach’s ark there was the same peace. For a whole year all the animals lived together — the predators too — and did no harm to one another at all.</p><p>True, G-d told Noach to make “compartments” in the ark<sup data-src="gen-6-14"></sup> — a separate room for each kind.<sup data-src="rashi-6-14"></sup> Maybe the predators were simply locked up? Check it together with the Rebbe.</p>`,
      steps: [
        {
          q: 'Complete the prophet’s words: “And the wolf shall dwell with the …”',
          hint: 'The wolf — with the one it usually eats.',
          opts: ['“lamb”', '“bear”', '“leopard”', '“lion”'],
        },
        {
          q: 'Who looked after all the animals in the ark? There were Noach and his wife, three sons and their wives. How many people in all?',
          hint: '1 + 1 + 3 + 3.',
        },
        {
          q: 'According to Rashi, which animals and birds did Noach let into the ark? How did they get there?',
          hint: 'Rashi: those that “kept to their own kind and had not corrupted their way.”',
          opts: ['“they came by themselves”', '“Noach caught them”', '“Noach’s sons brought them”', '“the water carried them”'],
        },
        {
          q: 'One more word of the prophet: who will lead the wolf, the leopard and the lion in the days of Moshiach?',
          hint: 'The one who is himself the weakest of all.',
          opts: ['“a little child”', '“a great king”', '“an old shepherd”', '“a lion”'],
        },
      ],
      reveal: {
        h: 'In the ark the nature of the predators changed',
        p: 'Even if every kind had its own compartment, it is hard to believe that the predators behaved for a whole year without touching anyone even once. In a zoo, many workers are needed to look after a lot of predators — and in the ark there were only eight people, with all the animals of the world in their care! So in the ark the very nature of the predators changed — as it will be in the days of Moshiach, when “a little child shall lead them.”<sup data-src="isaiah-11-6"></sup>',
      },
      lessons: [
        {
          h: 'As in the days of Moshiach',
          b: `<p>One of the explanations. In many places (in Chassidic discourses) it is explained that in Noach’s ark there was peace — like the peace there will be in the future: “And the wolf shall dwell with the lamb… they shall not hurt nor destroy.”<sup data-src="isaiah-11-6"></sup> In Noach’s ark all kinds of cattle and beasts lived together — including predators and beasts that tear their prey — and still “they did no harm to one another at all and did not destroy one another.”</p>`,
        },
        {
          h: 'Compartments — but that is not enough',
          b: `<p>This follows from the plain meaning of the verse, too. On the words “make compartments in the ark”<sup data-src="gen-6-14"></sup> Rashi explains: “separate rooms for each kind of cattle and beast”<sup data-src="rashi-6-14"></sup> — that is, each kind lived apart from the others. And still:</p><p>a) it is hard to say that the predators, by their nature — only because they were in separate places — behaved like this for such a long time, a whole year, without a single case of one animal harming another;</p><p>b) we see with our own eyes (in a zoo): to look after a large number of predators, very many people are needed. But in Noach’s ark there were only eight people — Noach, his wife, his sons and their wives — and they looked after all the animals, of all the kinds in the whole world!</p><p>So in the ark the nature of the predators changed — as it will be in the future, and then it is possible that “a little child shall lead them.”</p>`,
        },
        {
          h: 'A miracle from the start',
          b: `<p>And there is nothing to wonder at. Rashi already explained earlier: only “those that kept to their own kind and had not corrupted their way” came to the ark; “they came by themselves, and whatever the ark accepted, [Noach] let in.”<sup data-src="rashi-6-20"></sup> From this we see: a) only the best came to the ark — those that had not corrupted their way; b) already on their way to the ark the predators harmed no one; c) their coming and d) their entering the ark were completely a miracle.</p><p>So it is no wonder at all that later too, once they were in the ark, this miracle continued: the animals did not destroy one another, and the nature of the predators changed so that they did not harm other animals.</p>`,
        },
      ],
      reflection: 'Where is it easiest for me to be kind and peaceful? What would it take to be like that outside my “ark” too?',
      takeaways: [
        'In Noach’s ark there was peace, as in the days of Moshiach: “the wolf shall dwell with the lamb.”',
        'Separate compartments do not explain how the predators harmed no one for a whole year.',
        'In a zoo many workers look after the predators, but in the ark there were only 8 people.',
        'The animals came by themselves, and only the best — that alone was a miracle; in the ark it went on: the nature of the predators changed.',
      ],
      puzzle: {
        q: 'Put the Rebbe’s proof in order: from the question to the conclusion.',
        pieces: ['Separate compartments', 'A whole year — no harm', 'Only 8 people', 'The predators’ nature changed', 'As in the days of Moshiach'],
        meaning: 'Compartments are not enough: eight people could not have held back the predators for a whole year. So their nature changed — and the ark was like the world of Moshiach.',
      },
    },
    {
      title: 'Fill the earth',
      cond: `<p>Now it is clear why Noach and the animals did not want to go out: in the ark there was peace, as in the days of Moshiach. Outside — the ordinary world.</p><p>And still G-d said: “Go out of the ark… bring out with you… that they may swarm on the earth, and be fruitful and multiply on the earth.”<sup data-src="gen-8-16-17"></sup> And then He blessed Noach and his sons:</p><p class="verse" dir="rtl" lang="he">פרו ורבו ומלאו את הארץ</p><p>“Be fruitful and multiply, and fill the earth.”<sup data-src="gen-9-1"></sup></p><p>So which is higher — the ark or the world outside?</p>`,
      steps: [
        {
          q: 'According to the Rebbe, why didn’t Noach want to leave the ark?',
          hint: 'Remember the last riddle: what was the world in the ark like?',
          opts: ['“in the ark it was like the days of Moshiach — leaving means going down”', '“he was afraid of the rain”', '“he didn’t know the earth was dry”', '“he was sorry to leave the ark he had built”'],
        },
        {
          q: 'And the predators — why did they especially not want to go out?',
          hint: 'What will happen to them outside?',
          opts: ['“outside they would become predators again and do harm”', '“they would get wet in the rain”', '“they would get lost”', '“they would forget Noach”'],
        },
        {
          q: 'Which of the words said at the exit was impossible in the ark?',
          hint: 'Rashi: “on the earth — and not in the ark.”',
          opts: ['“be fruitful and multiply”', '“make yourself an ark”', '“send out the raven”', '“build an altar”'],
        },
        {
          q: 'Complete the blessing to Noach: “Be fruitful and multiply, and fill the …”',
          hint: 'Not the ark.',
          opts: ['“earth”', '“ark”', '“sky”', '“sea”'],
        },
        {
          q: 'What was this world created for? “The Holy One, blessed be He, desired to have an abode in the …”',
          hint: 'In the Tanya: not in the higher worlds.',
          opts: ['“lower worlds”', '“palace of heaven”', '“ark in the middle of the sea”', '“Garden of Eden”'],
        },
      ],
      reveal: {
        h: 'Going out — a descent for the sake of an ascent',
        p: 'To leave the ark means to go down: to leave a world like the days of Moshiach. And the predators would become predators again. That is why Noach would not have gone out without a command. But the goal is “be fruitful and multiply, and fill the earth”<sup data-src="gen-9-1"></sup> — to build the world anew. In the ark, with all its miracles, everything was limited. But in having children, generation after generation, G-d’s infinite power is revealed — and precisely in the ordinary, “lower” world: G-d wants “an abode in the lower worlds.”<sup data-src="tanya-36"></sup>',
      },
      lessons: [
        {
          h: 'They did not want to go down',
          b: `<p>That is why, even after “the earth was dry,” the command “go out of the ark” was needed:<sup data-src="gen-8-16-17"></sup> Noach did not want to leave the ark, since it was a place of peace like the peace of the future. [And according to Chassidut, the G-dly light that will be revealed in the future shone in Noach’s ark.] So leaving the ark is a descent compared to what there was in the ark.</p><p>All the more so the predators. Once they leave the ark, they go back to their nature — and become fierce and dangerous again. That is why they did not want to go out: they did not want to become predators again.</p>`,
        },
        {
          h: 'Why a command about the animals',
          b: `<p>That is why a special command about the animals was needed too: “every living thing that is with you… bring out with you” — and even “if they do not want to go out, you bring them out.”<sup data-src="rashi-8-17"></sup> For Noach could have reasoned: for Noach himself (with his wife and children) leaving the ark is necessary — to act in the world outside the ark; so for the good of the world outside it is worth going down. But the predators? Letting them out of the ark means returning them to their old nature, and there will be predators in the world again!</p><p>That is why G-d commanded Noach: even so — “every living thing… bring out with you.” From this we understand: going out — “go out of the ark… bring out with you” — brings an ascent, even compared to what there was in the ark.</p>`,
        },
        {
          h: 'To fill the earth',
          b: `<p>What is this ascent? There is a hint in the words of the verse itself: “Go out of the ark, you and your wife…” — that is, permission for family life; and “bring out with you… that they may swarm on the earth, and be fruitful and multiply on the earth.”<sup data-src="gen-8-16-17"></sup> The first thing said at the exit is connected with “be fruitful and multiply” — and in the ark this was impossible. So the service in the ark was limited, and the goal and the new thing in going out is to fulfill “be fruitful and multiply, and fill the earth.”<sup data-src="gen-1-28"></sup></p><p>After the Flood, when “He wiped out every living thing,” Noach’s task was to build the world anew, to fill the earth. As it says right afterwards: “And G-d blessed Noach and his sons, and said to them: Be fruitful and multiply, and fill the earth”<sup data-src="gen-9-1"></sup> — this is both a blessing and a commandment.</p>`,
        },
        {
          h: 'The infinite — in the lower world',
          b: `<p>Everything in the physical world comes from the spiritual. So going out of the ark also has a spiritual meaning.</p><p>What is new in “be fruitful and multiply” is that the power of the Infinite (Ein Sof) is revealed in it: birth knows no limit, it goes on generation after generation, to the end of all generations.</p><p>This is the difference between the ark and the world outside. In the ark, even though what will be in the future was revealed there (the animals’ nature changed), everything was limited, within bounds. But serving G-d in the world outside, in the world as it is by nature — precisely in the “lower” place G-d’s boundless power is revealed. For the purpose of creation is that “the Holy One, blessed be He, desired to have an abode in the lower worlds.”<sup data-src="tanya-36"></sup> It is precisely below that the “inheritance without bounds” is revealed.</p>`,
        },
      ],
      reflection: 'What is my “going out of the ark”: what good can I do today not only for myself, but for the world around me?',
      takeaways: [
        'The ark was like the world of Moshiach; leaving it means going down. The predators would become predators again.',
        'That is why Noach would not have gone out without a command — and certainly would not have let the predators out.',
        'The first thing said at the exit is “be fruitful and multiply”: in the ark this was impossible.',
        'Noach’s task was to build the world anew: “fill the earth.”',
        'In having children G-d’s infinite power is revealed — and precisely in the lower world: G-d wants “an abode in the lower worlds.”',
      ],
      puzzle: {
        q: 'Put the Rebbe’s answer in order: from the descent to the ascent.',
        pieces: ['The ark — like Moshiach’s world', 'Going out — going down', '“Bring out” — the predators too', '“Be fruitful and multiply”', 'An abode in the lower worlds'],
        meaning: 'Leaving the ark looks like a descent, but through “be fruitful and multiply” the infinite is revealed in the ordinary world — and so G-d gets an abode in the lower worlds.',
      },
    },
    {
      title: 'Go out of your own ark',
      cond: `<p>From this the Rebbe draws lessons for us too — both in our spiritual life and in the plain meaning of the words “be fruitful and multiply.”</p><p>The Baal Shem Tov, the founder of Chassidut, read the words “come… into the ark”<sup data-src="gen-7-1"></sup> in his own way: in Hebrew “teivah” means not only “ark,” but something else too.</p><p>And the Talmud tells about King Chizkiyahu (Hezekiah). He saw through divine inspiration that unworthy children would come from him — and decided not to marry. Then the prophet Isaiah came to him and brought him G-d’s words…<sup data-src="berakhot-10a"></sup></p>`,
      steps: [
        {
          q: 'According to the Baal Shem Tov, what does “come into the ark (teivah)” mean?',
          hint: '“Teivah” in Hebrew also means …',
          opts: ['“go into the words of prayer and Torah”', '“go into your house”', '“go into a book”', '“get on a ship”'],
        },
        {
          q: 'G-d said: “go out… you and your wife, and your sons, and your sons’ wives” — couples together. And how, according to the Torah, did they actually go out?',
          hint: 'Look at who walks next to Noach in the story of the exit (Genesis 8:18).',
          opts: ['“Noach and his sons — then his wife and daughters-in-law”', '“Noach with his wife, the sons with their wives”', '“Noach alone”', '“Noach and the animals”'],
        },
        {
          q: 'What did the prophet Isaiah answer King Chizkiyahu, who did not marry because he knew he would have unworthy children?',
          hint: '“…What you were commanded — that you must do.”',
          opts: ['“Why do you involve yourself with the secrets of the Merciful One?”', '“You did the right thing”', '“Wait until you are old”', '“Ask the Sages”'],
        },
        {
          q: 'Chizkiyahu married after all. Among his descendants was a king of whom it is said: “And like him there was no king before him who turned to the L-rd with all his heart.” Who was he?',
          hint: 'Not Menasheh — he was exactly the unworthy son.',
          opts: ['“Yoshiyahu (Josiah)”', '“Menasheh”', '“Achav (Ahab)”', '“Shaul (Saul)”'],
        },
        {
          q: 'The Talmud: “The son of David (Moshiach) will not come until …”',
          hint: 'It speaks of souls waiting to be born.',
          opts: ['“all the souls in the ‘guf’ are used up” (the treasury of souls)', '“the Temple is built”', '“everyone builds himself an ark”', '“all the waters dry up”'],
        },
      ],
      reveal: {
        h: 'Go out — and build',
        p: 'Sometimes one must “come into the ark” — into the words of Torah and prayer — but afterwards go out and act in the world around. And “be fruitful and multiply” in its plain sense is a special task for our generation, which lived through its own flood. Calculations of “what if” must not hold us back: “what you were commanded — that you must do.”<sup data-src="berakhot-10a"></sup> With every child G-d opens a new channel of blessing, and every child brings the coming of Moshiach closer.<sup data-src="yevamot-62a"></sup>',
      },
      lessons: [
        {
          h: 'Don’t hide in the ark',
          b: `<p>From this there is a lesson for serving G-d. Some people tend to shut themselves in the “four cubits” of Torah: to study Torah all day and not deal at all with what happens in the world around them.</p><p>Even someone who says: “I study the inner part of the Torah — ‘know the G-d of your father,’ as the Rambam also writes at the end of his book: in the days of Moshiach ‘the whole world will be busy only with knowing G-d’” — may object: why should I leave the four cubits of Torah and Judaism and act “in the street”? The answer is: “Go out of the ark!”</p><p>True, there are times when one must “come into the ark.” The Baal Shem Tov explains the words “come… into the ark”<sup data-src="gen-7-1"></sup>: go into the “teivot” — the words of Torah and prayer — when a flood rises, the “raging waters” of the world. But afterwards one must go out of the ark and act in the world around.</p>`,
        },
        {
          h: 'Filling the earth — spiritually too',
          b: `<p>One must not think that it is all only about one’s own good: one must think of the good of others. The goal is to “fill the earth”: “let your wellsprings spread outward” (the Baal Shem Tov), to the farthest “outside.” “Be fruitful and multiply” in the spiritual sense means bringing more and more people to Torah, without limits: “and you shall spread out to the west, and to the east, and to the north, and to the south”<sup data-src="gen-28-14"></sup> — an “inheritance without bounds.” This is what will bring the redemption through Moshiach, of whom it is said: “The breaker is gone up before them.”<sup data-src="micah-2-13"></sup></p>`,
        },
        {
          h: 'Building anew',
          b: `<p>There is one more lesson — from “be fruitful and multiply” in its plain sense. Man’s first task after the Flood, when “He wiped out every living thing,” was: “be fruitful and multiply, and fill the earth”<sup data-src="gen-9-1"></sup> — to build the world anew.</p><p>This is a special lesson for our generation, which lived through a flood — may the Merciful One save us: a large and precious part of the Jewish people, its glow and beauty, was destroyed. So first of all we must know: the responsibility to rebuild the Jewish people rests on us — in the simplest, physical sense, too. For there to be people to engage with in spiritual matters, there must first of all be Jews.</p>`,
        },
        {
          h: 'Calculations',
          b: `<p>Some people reason like this: having children is a huge responsibility. They must be provided for — both materially and spiritually: raised in the way of Torah and mitzvot. Who knows whether I have the strength to raise children properly, so that they are healthy in body and soul?</p><p>So, in their view, one must first settle one’s own situation — both material and spiritual — and only later think about, and later still fulfill, the mitzvah “be fruitful and multiply.” About this comes the lesson from Noach.</p>`,
        },
        {
          h: 'Why Noach held back',
          b: `<p>Although G-d told Noach: “Go out of the ark, you and your wife” — “husband and wife: here He allowed them”<sup data-src="rashi-8-16"></sup> — the Torah tells that in fact “Noach went out, and his sons, and his wife, and his sons’ wives”<sup data-src="gen-8-18"></sup> — separately, not “husband and wife.”</p><p>The commentators explain (following Rashi): “Noach was worried about the mitzvah of ‘be fruitful and multiply.’”<sup data-src="rashi-9-9"></sup> That is, Noach reasoned: what is the use of having children? The same thing could happen again: they will sin, and the waters of the Flood will come and sweep them away. So G-d first promised him that He would not destroy the world again — and only then commanded: “be fruitful and multiply.”</p><p>But how could Noach, “a righteous and perfect man,” act against G-d’s will because of some calculations? This is not difficult: Noach thought that the words “go out… you and your wife” were only a permission (“here He allowed them”), not a command. So G-d then added: this is not only a permission but a command — “be fruitful and multiply.”</p><p>Still, it is not clear: G-d promised there would be no more flood — but Noach was worried above all about his children’s spiritual state. If there is a fear “lest they sin again,” would it reassure him that they will not be punished, if their spiritual state is the same as that of the generation of the Flood?</p>`,
        },
        {
          h: 'The secrets of the Merciful One',
          b: `<p>From this there is a clear lesson: “Why do you involve yourself with the secrets of the Merciful One?” A Jew must do everything that depends on him: fulfill the mitzvah “be fruitful and multiply,” and then raise his sons and daughters according to the Torah — and not refrain from doing G-d’s will because of his own calculations.</p><p>The Sages tell about King Chizkiyahu: he saw through divine inspiration that “unworthy children” would come from him, and so he did not want to fulfill the mitzvah “be fruitful and multiply.” G-d punished him for it, because “why do you involve yourself with the secrets of the Merciful One? What you were commanded — that you must do.”<sup data-src="berakhot-10a"></sup> We see: even when you know for certain what will happen, you may not refrain from G-d’s commandment; all the more so when it is only a fear that comes from your own calculation.</p><p>And more: later, among Chizkiyahu’s descendants, Yoshiyahu was born, of whom it is said: “And like him there was no king before him who turned to the L-rd with all his heart… according to all the Torah of Moshe; and after him none arose like him”<sup data-src="kings2-23-25"></sup> — and other righteous kings. On the contrary: fulfill G-d’s commandment with joy and with full trust that G-d will surely help and grant success in raising your children — especially in the merit of fulfilling “be fruitful and multiply” without any calculations.</p>`,
        },
        {
          h: 'A new channel of livelihood',
          b: `<p>All that was said above is about worries over the children’s spiritual state. That depends above all on the parents: G-d gave them the mitzvah (and the merit) to raise their children in the way of Torah, and the free choice to fulfill it.</p><p>But when it comes to livelihood — when people calculate that their income does not allow them to have children — they show that they are “of little faith.” Livelihood does not depend on a person’s choice. A Jew is indeed told to work, but his work is only a vessel for G-d’s blessing; food and livelihood come from above. As everyone says in the blessing after meals: “…Who feeds the whole world in His goodness — with grace, with kindness and with mercy.”</p><p>And since G-d commanded a Jew to “be fruitful and multiply,” surely with every child that is born a new channel opens for G-d’s blessing, for food and livelihood — for the new child too, “in His goodness, with grace, with kindness and with mercy,” from His hand — full, open, holy and generous.</p>`,
        },
        {
          h: 'G-d gives the strength',
          b: `<p>The same is true of the strength of the soul. Others say they do not have the strength — neither of body nor of soul — to raise more sons and daughters: it takes great effort of both soul and body.</p><p>One must know: since G-d commanded it, and He “asks only according to their strength,” it is clear that He gives the strength needed to fulfill His will. So there is no need to interfere with one’s own calculations; one should rely on G-d — and with joy, as in all serving of G-d. (There are situations when, according to the Torah, one must act differently — for reasons of health and the like; but this is decided by a rabbi, not by the person through his own calculations.) And if the strength is truly lacking — G-d will take care of it. For children to be born, a special blessing from G-d is needed: “And G-d blessed them… be fruitful and multiply.”<sup data-src="gen-1-28"></sup></p><p>The truth is that such trust in G-d not only does not harm a person’s health, but the opposite: the way to true peace of mind is to live by the order that G-d set. When the natural order of family life is disturbed, it brings “nerves”… and above all harms the relationship between husband and wife. Calculating the “right time” for children was called “family planning,” but in fact it leads to the opposite: not to order and building a family, but to disorder.</p>`,
        },
        {
          h: 'Closer to the redemption',
          b: `<p>The mitzvah “be fruitful and multiply” has a special connection to our generation. The Gemara says: “The son of David will not come until all the souls in the ‘guf’ are used up” — the treasury of souls.<sup data-src="yevamot-62a"></sup> So the birth of one more Jewish child brings closer the complete redemption of all Israel through David, King Moshiach.</p><p>And since we live in the generation of the “footsteps of Moshiach” and hope and pray that “the offshoot of David, Your servant” will sprout soon, right now — it is clear that a Jew must do everything that depends on him so that “all the souls in the guf are used up” — and this will hasten the coming of the “son of David” with the true and complete redemption through our righteous Moshiach.</p>`,
        },
      ],
      reflection: 'Where do I hide in my own “ark” — and to whom can I bring something good outside it today?',
      takeaways: [
        'Sometimes one must “come into the ark” — into the words of Torah and prayer — but then go out and act in the world.',
        'After the Flood the first task was to build anew: “be fruitful and multiply.” This is a special lesson for the generation that lived through the Holocaust.',
        'Noach was worried about his future children. Chizkiyahu heard: “What you were commanded — that you must do” — and among his descendants was the righteous King Yoshiyahu.',
        'With every child G-d opens a new channel of blessing and gives the strength.',
        '“The son of David will not come until all the souls in the guf are used up”: every child brings Moshiach closer.',
      ],
      puzzle: {
        q: 'Put the Rebbe’s lesson in order: from the ark to the redemption.',
        pieces: ['Go into the words of Torah', 'Go out to the world', 'Build anew', '“What you were commanded — do”', 'Every child — closer to Moshiach'],
        meaning: 'The ark of Torah gives strength, but the goal is to go out and fill the world; not calculations but G-d’s will decides — and so the redemption comes closer.',
      },
    },
  ],
  final: {
    title: 'Investigation solved',
    allSolved:
      'All four riddles are solved. The ark was like the world of Moshiach — and still G-d said: “Go out.” The goal is to fill the world and make it an abode for G-d.',
  },
  puzzle: {
    q: 'Put the path of the whole talk in order.',
    pieces: ['The earth is dry — yet a command is needed', 'In the ark — peace, as in Moshiach’s days', 'Going out — going down', 'Filling the earth', 'Going out of your own ark'],
    meaning: 'Noach did not want to leave an ark that was like the world of Moshiach. But G-d wants an abode below: to go out and fill the earth — and each of us must go out of his own ark to the world.',
  },
  cards: {
    intro: 'Twelve verses of Parshat Noach — and for each one explanation of the Rebbe from Likkutei Sichot. Find which explanation goes with which verse.',
    items: [
      {
        title: 'The main offspring',
        verse: '“These are the generations of Noach”',
        card: 'The main “offspring” of the righteous are their good deeds',
        explain: 'The Torah says “these are the generations of Noach” — and before it names his children, it speaks of his righteousness. Rashi explains: the main “offspring” of the righteous are their good deeds. The good a person does stays after him forever.',
        horaah: 'Every good deed is like a child who lives on. Do one good deed today beyond the usual.',
        poem: [
          '“The generations of Noach,” the Torah starts,',
          'Yet first it tells the goodness of his heart.',
          'The offspring of the righteous are good deeds —',
          'They live on long after, like growing seeds.',
        ],
      },
      {
        title: '“The waters of Noach”',
        verse: '“The end of all flesh has come before Me”',
        card: 'Noach did not pray for his generation — we must care for all',
        explain: 'G-d told Noach that the world would be destroyed. Noach built the ark, but he did not ask for mercy for the people of his generation, as Avraham and Moshe later did. That is why, says the Zohar, the prophet Isaiah calls the Flood “the waters of Noach.” The Rebbe teaches: this shows how important it is to care for others.',
        horaah: 'Don’t shut yourself in your own “ark”: pray and care not only for yourself, but for the people around you.',
        poem: [
          'G-d said, “The end of all has come” —',
          'For his generation Noach prayed for none.',
          '“The waters of Noach” the Flood was named:',
          'Pray for all — let no one be left unclaimed.',
        ],
      },
      {
        title: 'A hundred and twenty years',
        verse: '“Make yourself an ark”',
        card: 'The ark took 120 years — so people would ask and return',
        explain: 'G-d could have saved Noach without an ark, but He told him to build one. Rashi explains: Noach built the ark for a hundred and twenty years, so that people would see it, ask “why?” — and have time to repent.',
        horaah: 'A good deed done in front of everyone is a lesson by itself: it makes people ask and think.',
        poem: [
          '“Make an ark,” G-d told Noach one day;',
          'For six score years he built it, come what may,',
          'So people would see and ask him, “Why?” —',
          'And turn back to G-d before the waters rose high.',
        ],
      },
      {
        title: 'A window or a stone',
        verse: '“Make a light for the ark”',
        card: 'A window lets light in from outside; a gem shines by itself',
        explain: 'Rashi brings two opinions: the tzohar was a window, or a precious stone that gave light. The Rebbe explains: a window lets light in from outside — this is how we chase away the darkness of the world; a stone shines from within — this is how the world itself becomes a source of light.',
        horaah: 'Don’t only let the light of Torah into your life — become a light yourself.',
        poem: [
          '“Make a light for the ark”: a window or a stone?',
          'A window lets the outside sunlight in,',
          'A gem shines brightly all on its own:',
          'The world itself will glow — let’s begin!',
        ],
      },
      {
        title: 'The ark is a word',
        verse: '“Come, you and all your household, into the ark”',
        card: '“Teivah” also means “word”: enter the words of Torah and prayer',
        explain: 'The Baal Shem Tov taught: “teivah” means not only “ark” but also “word.” The waters of the Flood are the stormy waters of worries about making a living. The command “come into the ark” means: enter the words of Torah and prayer — and they will protect you and your whole home.',
        horaah: 'When worries flood in — step into the words of prayer and Torah, together with your family.',
        poem: [
          '“Come into the teivah” — come into the word:',
          'The words of prayer and Torah, spoken and heard.',
          'Let waters of worry storm all around —',
          'In these words your home and you are safe and sound.',
        ],
      },
      {
        title: 'Springs of wisdom',
        verse: '“All the fountains of the great deep burst open”',
        card: 'Like the springs of the Flood, springs of wisdom open before Moshiach',
        explain: 'The Flood began in the six hundredth year of Noach’s life: the fountains of the deep and the windows of heaven opened. The Zohar says: in the six hundredth year of the sixth millennium, the gates of wisdom above and the springs of wisdom below will open. The Rebbe explains: the revealing of the inner Torah and the growth of science prepare the world for the days of Moshiach.',
        horaah: 'Use knowledge and technology for good — for Torah and mitzvot.',
        poem: [
          'The fountains of the deep burst open wide;',
          'In the six hundredth year, wisdom’s rising tide:',
          'The Torah’s inner light and science too',
          'Prepare the world for Moshiach to come through.',
        ],
      },
      {
        title: 'Forty days',
        verse: '“forty days and forty nights”',
        card: 'Forty days, like forty se’ah of a mikveh: the Flood purified the world',
        explain: 'The rain of the Flood fell for forty days and forty nights. The Rebbe explains: this is like the forty se’ah of water in a mikveh. The Flood was not only a punishment — it purified the earth, and after it the world was new.',
        horaah: 'Even in something hard, look for purification and a new beginning.',
        poem: [
          'For forty days the rain came pouring down —',
          'Like forty se’ah of a mikveh, pure and clean.',
          'Not just a punishment: the world was washed and seen',
          'Renewed by its Creator, all around.',
        ],
      },
      {
        title: '“Only” Noach',
        verse: '“And only Noach was left”',
        card: 'Noach was left alone — worn out from caring for all in the ark',
        explain: 'Rashi explains the word “only” (אך): in its plain meaning — Noach was left alone. And by the Midrash — he groaned and coughed blood from the work: day and night he fed the animals, and once he was late, and a lion hurt him. The Rebbe joins both explanations: you can preserve the world only by giving yourself fully.',
        horaah: 'Care for those who depend on you — on time and with all your heart, even when it is hard.',
        poem: [
          '“Only Noach was left” — alone, worn through:',
          'He fed the animals all day and all night too.',
          'To save the world, give all you’ve got —',
          'Care on time, though easy it is not.',
        ],
      },
      {
        title: 'Go out of the ark',
        verse: '“Go out of the ark”',
        card: 'Noach waited for G-d’s word to go out — and carried holiness out',
        explain: 'The earth was already dry, but Noach did not leave the ark by himself: he waited until G-d said, “Go out of the ark.” The Rebbe teaches: the ark is a time to fill up with holiness, but then you must go out into the world — build a family (“be fruitful and multiply”), settle the earth, and make the whole world a home for G-d.',
        horaah: 'What you received in prayer and study — bring it into an ordinary day: at home, at school, at work.',
        poem: [
          'Noach did not leave until he heard',
          'G-d say, “Go out!” — and then he stirred.',
          'Fill up in the ark, then go out wide,',
          'And make the world G-d’s home, with Him inside.',
        ],
      },
      {
        title: 'The image of G-d',
        verse: '“for in the image of G-d He made man”',
        card: 'Man is made “in the image of G-d” — so every life is holy',
        explain: 'After the Flood, G-d gave Noach and his sons laws for all humanity, and among them — not to kill, “for in the image of G-d He made man.” The Rebbe explains: every person has a G-dly image, and the laws for the children of Noach stand on this.',
        horaah: 'Respect every person: in each one is “the image of G-d.”',
        poem: [
          'G-d told Noach, “Do not shed man’s blood:',
          'In G-d’s own image every person stood.”',
          'In everyone there is the Creator’s face —',
          'So treat each person with respect and grace.',
        ],
      },
      {
        title: 'The rainbow',
        verse: '“I have set My bow in the cloud”',
        card: 'The rainbow is a sign: the world is pure and can rise after a fall',
        explain: 'Why was there no rainbow before the Flood? The Rebbe explains: the Flood and Noach’s offerings purified the world — and the rainbow could be seen. It is a sign that the world has “grown up”: even if it stumbles, it can rise and return to its Creator. When G-d sees the rainbow, He does not destroy the world.',
        horaah: 'If you stumble, don’t despair: you can always rise and return (teshuvah).',
        poem: [
          'A rainbow in the cloud — a sign for all to know:',
          'The world was purified and ready now to grow.',
          'If you fall, get up — to your Creator turn:',
          'The way of teshuvah is always there to return.',
        ],
      },
      {
        title: 'Not looking at another’s shame',
        verse: '“and they did not see their father’s nakedness”',
        card: 'Shem and Yefet didn’t look at their father’s mistake — they covered it',
        explain: 'When Noach was drunk and lay uncovered, Cham saw and told his brothers. But Shem and Yefet walked backward, covered their father, and did not look at him. The Rebbe teaches: when you see something bad in another, don’t stare and don’t tell — help and cover.',
        horaah: 'If you see someone’s mistake — don’t tell others about it; quietly help.',
        poem: [
          'Cham saw his father and told it around;',
          'Shem and Yefet walked backward and covered him there.',
          'If someone’s mistake by you is found —',
          'Help and cover, as they did, with care.',
        ],
      },
    ],
  },
  audience: 'Ages 11 and up: the counting is the simplest, but the talk is about family, children and our generation; younger children together with an adult. The cards suit younger children too.',
  practice:
    'Go out of your own “ark” today: after praying or studying Torah, share one thought from the Torah with someone or do him a kindness — “fill the earth” with light.',
  highlight: '“Be fruitful and multiply, and fill the earth” (Genesis 9:1): in the ark there was peace, as in the days of Moshiach, but G-d wants an abode below.',
  share: ({ score, max, time, grid, allSolved, site }) => `🕊 The earth is already dry — and Noach doesn’t leave the ark. Why did G-d have to command: “Go out”?

I’m investigating together with the Lubavitcher Rebbe — Niflaot of the Rebbe, Parshat Noach. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: why a command to go out, the wolf with the lamb in the ark, “fill the earth,” and how to go out of your own ark. And then — cards: 12 verses of the parshah and the Rebbe’s explanations.
Play 👉 ${site}

©mychitas.app`,
  source:
    'The investigation is based on a talk of the Lubavitcher Rebbe (Shabbat Parshat Noach 5741 and 5743, Shabbat Parshat Chayei Sarah 5743; Likkutei Sichot, vol. 25, Noach, talk 3, in its Hebrew translation); retold by the project. The cards are based on talks on Parshat Noach (Likkutei Sichot, vols. 1, 5, 10, 15, 25).',
};

export default en;
