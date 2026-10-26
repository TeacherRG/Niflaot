import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'An Everlasting Covenant',
  hero: {
    heading: 'Why is a circumcision at <i>eight days</i> greater than at thirteen years?',
    author: 'based on a talk of the Lubavitcher Rebbe · Likkutei Sichot, vol. 25, Vayeira',
    intro:
      'Yitzchak and Yishmael argue about whom G-d loves more. Yishmael: “I was circumcised at thirteen — I could have refused, and I didn’t!” Yitzchak: “And I — at eight days.” But what merit does a baby have, who chose nothing? Investigate together with the Rebbe — and discover what an “everlasting covenant” is.',
  },
  summary:
    'Yishmael was circumcised at thirteen, Yitzchak at eight days. Why is Yitzchak “more beloved”? The Rebbe explains: the brit milah is an “everlasting covenant,” and it is G-d, not man, who makes it. That is why it is done right away, to a baby — and only with Yitzchak did it become visible that this covenant comes entirely from Above.',
  glossary: {},
  riddles: [
    {
      title: 'Eight Days or Thirteen Years',
      cond: `<p>The Midrash tells:</p><p class="verse" dir="rtl" lang="he">יצחק וישמעאל היו מדיינים זה עם זה, זה אומר אני חביב ממך שנמלתי לשלש עשרה שנה, וזה אמר חביב אני ממך שנמלתי לשמונה ימים</p><p>“Yitzchak and Yishmael were arguing with each other. One said: ‘I am more beloved than you, for I was circumcised at thirteen years.’ And the other said: ‘I am more beloved than you, for I was circumcised at eight days.’”<sup data-src="bereshit-rabbah-55-4"></sup></p><p>Why thirteen years is a merit is clear: Yishmael could have refused, and he didn’t.<sup data-src="rashi-22-1"></sup> But what is the merit of eight days? A baby decided nothing!</p>`,
      steps: [
        {
          q: 'How does Yishmael explain why he is “more beloved”?',
          hint: 'At thirteen a person can already say “no.”',
          opts: ['“I could have protested — and I did not”', '“I am the firstborn”', '“I was circumcised first”', '“my father circumcised me”'],
        },
        {
          q: 'The commentators on the Midrash explain Yitzchak’s merit by a rule. Which one?',
          hint: 'This mitzvah has its own day.',
          opts: ['“a mitzvah in its proper time is better”', '“one mitzvah brings another”', '“the reward of a mitzvah is a mitzvah”', '“one joy is not mixed with another”'],
        },
        {
          q: 'Where does the Torah say that the time of circumcision is eight days?',
          hint: 'G-d speaks to Avraham about all his descendants.',
          opts: ['“At the age of eight days every male shall be circumcised”', '“On that very day”', '“He who is born in your house must be circumcised”', '“You shall circumcise the flesh of your foreskin”'],
        },
        {
          q: 'G-d told Yishmael to be circumcised not at eight days. When, then, was the “proper time” of the mitzvah for him?',
          hint: 'Look how old Yishmael was on that day.',
          opts: ['“at thirteen years”', '“at eight days”', '“at ninety-nine years”', '“at thirty-seven years”'],
        },
        {
          q: '“A mitzvah in its proper time” — an advantage in what?',
          hint: 'Is the time the whole mitzvah or just one detail of it?',
          opts: ['“in a detail of the mitzvah — its time”', '“in the whole mitzvah”', '“in the reward of the mitzvah”', '“in the intention of the mitzvah”'],
        },
      ],
      reveal: {
        h: 'A Detail Against the Whole',
        p: '“A mitzvah in its proper time” is an advantage in only one detail of the mitzvah — its time. But Yishmael’s merit concerns the whole mitzvah: “I could have protested — and I did not.” How can Yitzchak compare the two and say “I am more beloved than you”? And for Yishmael, thirteen years was the “proper time”: that is when G-d commanded him.<sup data-src="gen-17-24"></sup> So “circumcised at eight days” is not a detail but something that concerns the whole circumcision: a circumcision at eight days is of a different kind and a different quality.',
      },
      lessons: [
        {
          h: 'The Brothers’ Argument',
          b: `<p>The Midrash tells: “Yitzchak and Yishmael were arguing with each other. One said: ‘I am more beloved than you, for I was circumcised at thirteen years.’ And the other said: ‘I am more beloved than you, for I was circumcised at eight days.’”<sup data-src="bereshit-rabbah-55-4"></sup></p><p>This needs to be understood. Why being “circumcised at thirteen years” makes a person more “beloved” is simple. That is how Yishmael argues later in the Midrash: “because I could have protested — and I did not” (Rashi also tells this at the beginning of the Binding of Yitzchak: Yishmael boasted to Yitzchak that he was circumcised at thirteen and did not protest<sup data-src="rashi-22-1"></sup>). But what advantage is there in “I was circumcised at eight days,” so that because of it Yitzchak claims: “I am more beloved than you”?</p>`,
        },
        {
          h: '“A Mitzvah in Its Proper Time”',
          b: `<p>The commentators on the Midrash explain: the advantage is that “a mitzvah in its proper time is better,” and the time of the mitzvah of circumcision is “eight days”: “At the age of eight days every male among you shall be circumcised, throughout your generations.”<sup data-src="gen-17-12"></sup></p><p>But this is not yet enough. For G-d commanded Yishmael to be circumcised only when he was thirteen years old<sup data-src="gen-17-24"></sup> — so one cannot say that he lacks the advantage of “a mitzvah in its proper time”: for him, then (at thirteen), was the “proper time” of the mitzvah.</p><p>(As was once explained why Avraham could circumcise himself on Yom Kippur, although the law is that a circumcision not on its proper day does not override Shabbat and Yom Tov, and Avraham kept the whole Torah before it was given:<sup data-src="yoma-28b"></sup> since that is when he was commanded about circumcision, for him it was a circumcision on its proper day.)</p>`,
        },
        {
          h: 'A Detail and the Whole',
          b: `<p>And more. “A mitzvah in its proper time is better” is only an advantage in one detail of fulfilling the mitzvah — the time of the mitzvah. How, then, can one compare Yitzchak’s fulfilling the mitzvah “in its proper time” with the advantage of Yishmael’s circumcision, which concerns the whole fulfillment of the mitzvah (“I could have protested — and I did not”),<sup data-src="bereshit-rabbah-55-4"></sup> so that because of it Yitzchak would say: “I am more beloved than you”?</p><p>We are forced to say: Yitzchak’s being “circumcised at eight days” is not just a detail of the mitzvah — its time. It concerns the circumcision as a whole: a circumcision at eight days is of a different kind and a different quality.</p>`,
        },
      ],
      reflection: 'What matters more to me in a good deed: that I chose it myself — or that G-d said so?',
      takeaways: [
        'The Midrash: Yishmael — “I was circumcised at thirteen,” Yitzchak — “and I at eight days”; each says: “I am more beloved.”',
        'Yishmael’s merit is clear: he could have protested — and did not.',
        'The commentators: Yitzchak had “a mitzvah in its proper time”; the time of circumcision is eight days.',
        'But for Yishmael, thirteen years was the “proper time” — that is when G-d commanded him.',
        'And the time is only a detail of the mitzvah. So eight days is a circumcision of a different kind.',
      ],
      puzzle: {
        q: 'Put the investigation in order: from the argument — to the Rebbe’s question.',
        pieces: ['Yitzchak and Yishmael argue', '“I could have protested”', '“A mitzvah in its proper time”', 'For Yishmael — also his proper time', 'Eight days — a different kind'],
        meaning: 'The answer “a mitzvah in its proper time” does not explain the argument: time is only a detail. So a circumcision at eight days differs in its very essence.',
      },
    },
    {
      title: 'An Everlasting Covenant',
      cond: `<p>The Sages list who received which mitzvah: “The first man was commanded seven mitzvot… Noach was given the prohibition of a limb from a living animal… Avraham was commanded about circumcision, <b>Yitzchak dedicated it at eight days</b>.” For Yitzchak was the first to be circumcised at eight days:</p><p class="verse" dir="rtl" lang="he">וימל אברהם את יצחק בנו בן שמנת ימים כאשר צוה אתו אלקים</p><p>“And Avraham circumcised his son Yitzchak at the age of eight days, as G-d had commanded him.”<sup data-src="gen-21-4"></sup></p><p>The Midrash separates “eight days” from the brit milah itself — as a mitzvah of its own. Why? The Rebbe looks for the answer in what a brit milah is: “And My covenant shall be in your flesh as an everlasting covenant.”<sup data-src="gen-17-13"></sup></p>`,
      steps: [
        {
          q: 'According to the Midrash, what did Yitzchak add to the mitzvah of circumcision?',
          hint: 'Avraham received the mitzvah, and Yitzchak…',
          opts: ['“dedicated it at eight days”', '“the prohibition of the sciatic nerve”', '“the prohibition of a limb from a living animal”', '“levirate marriage”'],
        },
        {
          q: 'According to the verse, what kind of covenant is the brit milah to be?',
          hint: '“…in your flesh as a covenant…”',
          opts: ['“an everlasting covenant”', '“an everlasting possession”', '“a servant forever”', '“an everlasting statute”'],
        },
        {
          q: 'Why do two people who love each other make a covenant?',
          hint: 'While all is well, no covenant is needed.',
          opts: ['“so that the love remains even if something disturbs it”', '“to receive a reward”', '“to begin the love”', '“to tell everyone”'],
        },
        {
          q: 'Yet a covenant between two people can still change. Why?',
          hint: 'People are created beings.',
          opts: ['“a created being can change”', '“a covenant is not written down”', '“a covenant has no witnesses”', '“a covenant is made with blood”'],
        },
        {
          q: 'Avraham kept the whole Torah before it was given. Why, then, did he perform the brit milah only when G-d commanded him?',
          hint: 'Something eternal — who can create it?',
          opts: ['“a created being cannot make an everlasting covenant”', '“he did not know about this mitzvah”', '“he was afraid of the pain”', '“he was waiting for Yitzchak’s birth”'],
        },
      ],
      reveal: {
        h: 'Everlasting Means from G-d',
        p: 'The brit milah is an “everlasting covenant”:<sup data-src="gen-17-13"></sup> an eternal bond between the one circumcised and G-d. A covenant between two people, however strong, can change: a person is a created being, and a created being can change. But when G-d Himself makes the covenant — with a Jew who is circumcised — it is an “everlasting covenant,” and no change is possible in it. That is why Avraham, who kept the whole Torah before it was given,<sup data-src="yoma-28b"></sup> did not circumcise himself until G-d commanded him: a created being cannot, by its own powers, create something eternal.',
      },
      lessons: [
        {
          h: 'Yitzchak Dedicated the Eighth Day',
          b: `<p>This can also be seen from the words of the Sages: “The first man was commanded seven mitzvot… Noach was given the prohibition of a limb from a living animal… Avraham was commanded about circumcision, Yitzchak dedicated it at eight days” — because Yitzchak was “the first to be circumcised at eight days”: “And Avraham circumcised his son Yitzchak at the age of eight days.”<sup data-src="gen-21-4"></sup></p><p>But at first glance: why does the Midrash divide the mitzvah of circumcision into two parts — the command to Avraham and the “dedication” at eight days (through Yitzchak)? Would one detail (circumcision at eight days) be reason to credit Yitzchak with “dedicating” the mitzvah of circumcision? And more: the Midrash makes it a separate part, as if it were an addition like the prohibition of a limb from a living animal given to Noach.</p><p>So “circumcised at eight days” is the main innovation in the mitzvah of circumcision itself.</p>`,
        },
        {
          h: 'What a Covenant Is',
          b: `<p>It can be explained this way. The content of the brit milah (in the words of the verse) is: “And My covenant shall be in your flesh as an everlasting covenant”:<sup data-src="gen-17-13"></sup> through the brit milah an eternal bond is created between the one circumcised and the Holy One, blessed be He — a covenant.</p><p>The idea of a covenant between two who love each other: when they want to be sure that their love will be such that nothing will disturb it, they strengthen it with a covenant. Through the covenant they become bound in such a way that even if a reason arises that could disturb the love, it will not disturb it.</p>`,
        },
        {
          h: 'A Covenant That Does Not Change',
          b: `<p>But when two people make a covenant, it can happen that the covenant also weakens: a created being can change. When the Holy One, blessed be He, makes the covenant — and in our case with the Jewish people (through a Jew being circumcised) — it is an “everlasting covenant,”<sup data-src="gen-17-13"></sup> and no change at all is possible in it.</p><p>This is also one of the explanations why Avraham did not circumcise himself until the Holy One, blessed be He, commanded him — although Avraham kept the whole Torah before it was given:<sup data-src="yoma-28b"></sup> a created being cannot, by its own powers, do something that belongs to an “everlasting covenant.” An everlasting covenant is possible only when the Creator gives the mitzvah and He Himself “makes the covenant.”</p>`,
        },
      ],
      reflection: 'Sometimes I don’t feel like doing a mitzvah, or I am upset. Does that change my bond with G-d?',
      takeaways: [
        'The Midrash: Avraham was commanded about circumcision, and Yitzchak “dedicated it at eight days” — as a mitzvah of its own.',
        'So eight days is the main innovation in the brit milah itself.',
        'The brit milah is an “everlasting covenant”: a bond nothing can disturb.',
        'A covenant of people can weaken — created beings can change; G-d’s covenant is everlasting.',
        'That is why Avraham did not circumcise himself until G-d commanded: a created being cannot create the eternal.',
      ],
      puzzle: {
        q: 'Put the Rebbe’s answer in order: from the Midrash — to the everlasting covenant.',
        pieces: ['Yitzchak dedicated the eighth day', 'The brit milah is a covenant', 'A covenant of people can change', 'G-d’s covenant is everlasting', 'Avraham waited for the command'],
        meaning: 'The brit milah is an everlasting covenant, and only G-d can create the eternal; that is why Avraham, too, waited for His command.',
      },
    },
    {
      title: 'Why a Baby',
      cond: `<p>Three circumcisions — three ages:</p><p class="verse" dir="rtl" lang="he">ואברהם בן תשעים ותשע שנה בהמלו בשר ערלתו וישמעאל בנו בן שלש עשרה שנה</p><p>“Avraham was ninety-nine years old when he was circumcised, and his son Yishmael was thirteen years old.”<sup data-src="gen-17-24"></sup> And Yitzchak was circumcised at eight days.<sup data-src="gen-21-4"></sup></p><p>What a person does by his own powers, he does when he is ready: when he understands and can take part himself. Why, then, is the brit milah done to a baby who understands nothing? And why is the circumcision of Yitzchak, “the first circumcised at eight days,” greater than that of Avraham himself?</p>`,
      steps: [
        {
          q: 'Who really makes the covenant of the brit milah?',
          hint: 'A person performs the circumcision. And the covenant?',
          opts: ['“the Holy One, blessed be He”', '“the one being circumcised”', '“the mohel”', '“the child’s father”'],
        },
        {
          q: 'Then when should the brit milah be done?',
          hint: 'There is no point waiting for the child to grow up.',
          opts: ['“at the first opportunity”', '“when he grows up and understands”', '“at his bar mitzvah”', '“when he himself wants to”'],
        },
        {
          q: 'The Sages: Avraham recognized his Creator when he was…',
          hint: 'Still a small child.',
          opts: ['“three years old”', '“eight days old”', '“thirteen years old”', '“ninety-nine years old”'],
        },
        {
          q: 'Before the brit milah, G-d told Avraham: “Walk before Me and be…”',
          hint: 'Rashi: as long as the foreskin is there, there is a blemish.',
          opts: ['“perfect (tamim)”', '“rich”', '“a king”', '“an elder”'],
        },
        {
          q: 'What was all of Avraham’s service until ninety-nine for the covenant?',
          hint: 'Not a cause and not a payment.',
          opts: ['“a preparation for the covenant”', '“a vessel and cause of the covenant”', '“a payment for the covenant”', '“unrelated to the covenant”'],
        },
        {
          q: 'In whom was it revealed that the covenant of the brit milah comes entirely from G-d?',
          hint: 'The one who decided nothing himself.',
          opts: ['“in Yitzchak”', '“in Avraham”', '“in Yishmael”', '“in Yaakov”'],
        },
      ],
      reveal: {
        h: 'A Gift from Above',
        p: 'It is G-d, not man, who makes the covenant of the brit milah: people perform the circumcision, but the bond that comes about is entirely from the side of the Holy One, blessed be He. So there is no point waiting for the child to grow up — even then the covenant would not be his doing — and the brit milah is done at the first opportunity, at eight days. Avraham received the brit milah only after a long path — from age three to ninety-nine,<sup data-src="nedarim-32a"></sup> and his service was only a preparation: the covenant is a gift from Above. But since it came after Avraham’s service and his decision, it was not visible in him that the covenant is entirely from Above. That was revealed only in Yitzchak, circumcised at eight days.',
      },
      lessons: [
        {
          h: 'Why Precisely at Eight Days',
          b: `<p>From this we also understand why the time of the brit milah is precisely in a person’s infancy, at eight days, when the one being circumcised cannot take part at all in the fulfillment of the mitzvah.<sup data-src="gen-21-4"></sup></p><p>What a person does by his own powers requires preparation and a time when he is ready and able to do it. But the “covenant” created through the brit milah comes entirely from the side of the Creator — the “hands” of the person being circumcised have no part in it at all.</p>`,
        },
        {
          h: 'Not Man to G-d, but G-d to Man',
          b: `<p>The act of the mitzvah itself is indeed done by a person, but the covenant that comes about through it is from the Holy One, blessed be He.<sup data-src="gen-17-13"></sup> That is: the meaning of the brit milah is not that a person binds himself to the Holy One, blessed be He, but the opposite: when a Jew is circumcised, the Holy One, blessed be He, binds Himself to him in an “everlasting covenant.”</p><p>Therefore there is no point at all in waiting until the child grows up and can take part in the mitzvah himself: in any case it would not be the whole act. On the contrary — at the first opportunity (when the child is healthy enough, at eight days) he is circumcised.</p>`,
        },
        {
          h: 'Avraham’s Path',
          b: `<p>This explains the advantage of the circumcision of Yitzchak — “the first circumcised at eight days” — over the circumcision of Avraham (and Yishmael).</p><p>Avraham received the mitzvah of circumcision only after he had prepared himself for it through all his earlier service, until he was ninety-nine years old. And he went in order, step by step: from “recognizing his Creator” (according to different opinions — at three,<sup data-src="nedarim-32a"></sup> at forty, at forty-eight), through his service of making G-d known in the world, up to the highest perfection possible for a created being. Only after that was he given (from Above) the mitzvah of circumcision, through which he became “perfect”: “Walk before Me and be perfect.”<sup data-src="gen-17-1"></sup> (Rashi: “through this mitzvah you will be perfect: as long as the foreskin is on you, you are blemished before Me.”<sup data-src="rashi-17-1"></sup>)</p><p>Therefore in his brit milah it was not clearly visible that this “covenant” is a bond that comes fully and only from Above.</p>`,
        },
        {
          h: 'A Preparation, Not a Cause',
          b: `<p>That is: even for Avraham, his earlier service was not a “vessel” for the covenant, a cause of the covenant. For the covenant created through the brit milah is an “everlasting covenant,”<sup data-src="gen-17-13"></sup> and a created being, of which it is said “all that comes into being passes away,” cannot do anything eternal. The greatest of the great (the one who understands the mitzvah best) is no “closer” to it than the smallest of the small.</p><p>Avraham’s service was only a preparation for the covenant: after he completed his service as far as a created being can, the Holy One, blessed be He, gave him a gift from Above — an “everlasting covenant.”</p><p>(As the Gemara says: “Had he not given him pleasure, he would not have given him a gift.” The pleasure is not payment for the gift, and certainly not something that obliges the giver: a gift comes from the giver. And yet it is given precisely when the other has given him pleasure.)</p>`,
        },
        {
          h: 'Avraham’s Decision',
          b: `<p>And yet, since it came after Avraham’s service, his fulfillment of the mitzvah of circumcision was “mixed” with his service: even the brit milah itself was bound up with his own “decision” — that he must circumcise himself. The command came not only from the Holy One, blessed be He: his own mind also decided that he must be circumcised.</p><p>Therefore it was not clearly visible in him how the covenant comes entirely from Above. (So too with Yishmael, who was circumcised at thirteen, when he was already grown and understanding:<sup data-src="gen-17-24"></sup> it turns out that Yishmael agreed with his own mind to circumcise himself and bind himself to the Holy One, blessed be He.)</p>`,
        },
        {
          h: 'Yitzchak: The Covenant Entirely from Above',
          b: `<p>Only in Yitzchak, who was circumcised at eight days,<sup data-src="gen-21-4"></sup> was it revealed what the covenant of the brit milah is: a bond created not from the side of the person being circumcised, a created being, but entirely from the side of the Holy One, blessed be He.</p><p>That is why Yitzchak says to Yishmael: “I am more beloved than you, for I was circumcised at eight days.”<sup data-src="bereshit-rabbah-55-4"></sup> Not because he did the mitzvah “on time,” but because in his circumcision the very essence of the brit milah is visible — an everlasting covenant that G-d makes.</p>`,
        },
      ],
      reflection: 'Is my bond with G-d my own merit or His gift? How does that change the way I learn and pray?',
      takeaways: [
        'G-d makes the covenant of the brit milah: the person being circumcised has no part in it.',
        'That is why it is done at the first opportunity — at eight days, without waiting for the child to grow up.',
        'Avraham went toward the brit milah from age three to ninety-nine — and only then received it and became “perfect.”',
        'His service was a preparation for the covenant, not its cause: the eternal is a gift from Above.',
        'For Avraham and Yishmael the brit milah was bound up with their decision; only in Yitzchak is it visible that the covenant is entirely from Above.',
      ],
      puzzle: {
        q: 'Put the Rebbe’s answer in order: from the essence of the covenant — to Yitzchak’s advantage.',
        pieces: ['G-d makes the covenant', 'The brit milah at the first opportunity', 'Avraham’s service — a preparation', 'A gift from Above', 'Yitzchak: the covenant entirely from Above'],
        meaning: 'Since the covenant is from G-d, it is given to a baby; for Avraham it came after his service, while in Yitzchak it became visible that the covenant is a pure gift from Above.',
      },
    },
  ],
  final: {
    title: 'Investigation Solved',
    allSolved:
      'All three riddles solved. Eight days is not just “a mitzvah on time”: the brit milah is an everlasting covenant, and G-d makes it. That is why it is given to a baby, and in Yitzchak it was revealed that the covenant is entirely a gift from Above.',
  },
  puzzle: {
    q: 'Put the path of the talk in order.',
    pieces: ['Yitzchak and Yishmael argue', 'Eight days — not a detail', 'The brit milah — an everlasting covenant', 'G-d makes it', 'Yitzchak — the covenant from Above'],
    meaning: 'A circumcision at eight days shows the essence of the brit milah: an everlasting covenant that G-d gives every Jew, even before he can understand or decide anything.',
  },
  audience: 'Ages 11+: working through the argument in the Midrash and the meaning of a covenant; the brit milah is explained with care. Younger children — together with adults.',
  practice:
    'Our bond with G-d is a gift from Above, not a reward for how big and smart I am. Today, do one mitzvah not because “I decided so,” but because G-d commanded it — and be glad that this bond is always yours.',
  highlight: '“And My covenant shall be in your flesh as an everlasting covenant” (Bereishit 17:13): G-d makes the everlasting covenant — that is why it is given to a baby of eight days.',
  share: ({ score, max, time, grid, allSolved, site }) => `✨ Yishmael was circumcised at thirteen, Yitzchak at eight days. Whom does G-d love more? And why is the brit milah done to a baby?

I’m investigating together with the Lubavitcher Rebbe — “Niflaot of the Rebbe,” Parshat Vayeira. ${allSolved ? 'All three riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Three riddles: eight days or thirteen years, an everlasting covenant, and why a baby.
Play 👉 ${site}

©mychitas.app`,
  source:
    'The investigation follows a talk of the Lubavitcher Rebbe on the last day of Pesach 5741 (Likkutei Sichot, vol. 25, Vayeira, talk 3), in Hebrew translation; retold by the project.',
};

export default en;
