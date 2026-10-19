import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Father of a Multitude of Nations',
  hero: {
    heading: 'Why did the letter <i>ר</i> stay in Avraham’s name?',
    author: 'based on talks of the Lubavitcher Rebbe · Likkutei Sichot, vol. 25 and vol. 30, Lech Lecha',
    intro:
      'Avram became Avraham — “father of a multitude of nations.” But the name kept the letter ר, which is not in those words. And Sarai lost her letter י. Why was one letter allowed to stay and the other not? And why did Avraham build three altars, if Rashi explains only two? Investigate together with the Rebbe.',
  },
  summary:
    'The letter ר “did not move from its place” in Avraham’s name, while the י of Sarai went to Yehoshua. Why? And Avraham’s three altars: they sustain the world, they atone — and the third, in Hebron, only for G-d: a sign of the Third Temple and King David.',
  glossary: {},
  riddles: [
    {
      title: 'The Letter That Stayed',
      cond: `<p>G-d said to Avram:</p><p class="verse" dir="rtl" lang="he">ולא יקרא עוד את שמך אברם והיה שמך אברהם כי אב המון גוים נתתיך</p><p>“No longer shall you be called Avram, but your name shall be Avraham, for I have made you the father of a multitude of nations.”<sup data-src="gen-17-5"></sup></p><p>Rashi explains: “father of a multitude of nations” — <b>av hamon goyim</b> — is hidden in the name אברהם itself. But the name has a letter that is not in these words. Rashi says this letter “did not move from its place” — for even the letter י taken from the name Sarai complained until it was added to the name Yehoshua.<sup data-src="rashi-17-5"></sup></p><p>The Rebbe asks: what kind of proof is that? The letter י did leave!</p>`,
      steps: [
        {
          q: 'What does Rashi call the link between “father of a multitude of nations” and the name Avraham?',
          hint: 'From the words — letter by letter — comes the name.',
          opts: ['“an acrostic (notarikon) of his name”', '“a new name with no special meaning”', '“a translation of the name into Aramaic”', '“the name of his city”'],
        },
        {
          q: 'Which letter of the name אברהם is not in the words אב המון (“father of a multitude”)?',
          hint: 'Compare the letters: א־ב — “av,” ה־מ — “hamon.”',
          opts: ['the letter reish', 'the letter alef', 'the letter beit', 'the letter hei'],
        },
        {
          q: 'Rashi gives the example of the letter י of the name Sarai. What did it do when it was taken away?',
          hint: 'The letter was “offended.”',
          opts: ['“it complained to the Shechinah”', '“it was forgotten”', '“it turned into a hei”', '“it was written twice in the Torah”'],
        },
        {
          q: 'To whose name was this letter י finally added?',
          hint: 'Moshe renamed Hoshea son of Nun.',
          opts: ['“to the name Yehoshua”', '“to the name Yitzchak”', '“to the name Yisrael”', '“to the name Yehudah”'],
        },
      ],
      reveal: {
        h: 'A proof the other way round?',
        p: 'The letter י of Sarai did “move from its place” — it went to Yehoshua, another name and another person<sup data-src="numbers-13-16"></sup> — while about the letter ר Rashi says: “it did not move from its place.” What kind of proof is that? And more: Rashi writes “for <i>even</i> the י,” — so the letter י had less reason to complain. But isn’t it the same: both letters were taken from the name of a tzaddik? And why does Rashi explain at such length where the ר comes from: “he was a father only to Aram”?',
      },
      lessons: [
        {
          h: 'An acrostic of the name',
          b: `<p>On the verse “No longer shall you be called Avram, but your name shall be Avraham, for I have made you the father of a multitude of nations,”<sup data-src="gen-17-5"></sup> Rashi quotes the words “for… the father of a multitude of nations” and explains: “An acrostic [notarikon] of his name. And the reish that was in it at first — when he was a father only to Aram, his place, and now he is a father to the whole world — even it did not move from its place: for even the yud of Sarai complained to the Shechinah until it was added to Yehoshua, as it says: ‘And Moshe called Hoshea son of Nun Yehoshua.’”<sup data-src="rashi-17-5"></sup></p><p>The simple meaning: the words “for… father” give the reason for the name Avraham — so “father of a multitude of nations” is hidden in the name itself. That is why Rashi explains: it is “an acrostic of his name.” (That is also why Rashi quotes the word “for,” even though it is not part of the acrostic: it is from “for” that we see this explains the name.)</p><p>But then a question arises: why did the letter ר remain in the name Avraham, if it is not part of the acrostic? Rashi answers: it “did not move from its place,” and brings an example and a proof — the yud of Sarai, about which the chapter later says: “Do not call her Sarai, for Sarah is her name.”<sup data-src="gen-17-15"></sup> It “complained to the Shechinah” (that it was taken from Sarah’s name) “until it was added to Yehoshua.” So here too: so that the ר would not complain like the yud of Sarai, it was not taken from Avraham’s name.</p>`,
        },
        {
          h: 'A proof the other way round',
          b: `<p>But we need to understand. First, the example of the yud of Sarai seems to prove the opposite. The yud did “move from its place” and was added to Yehoshua<sup data-src="numbers-13-16"></sup> — both another name and another person. Yet here Rashi says that the ר “did not move from its place”!</p><p>Besides, that happened hundreds of years later — and all that time the yud remained “complaining”: it stood and cried out for many years until Yehoshua came.</p>`,
        },
        {
          h: 'The word “even”',
          b: `<p>Second, Rashi writes: “<b>for even</b> the yud of Sarai complained” — not “<b>and likewise</b> the yud.”<sup data-src="rashi-17-5"></sup> This shows that the yud of Sarai had less room to complain than the ר of Avraham: not only the ר of Avraham, but <i>even</i> the yud of Sarai complained.</p><p>This is surprising: what is the difference between them? Both seem to have the same reason to complain — a letter is taken from the name of a tzaddik.</p>`,
        },
        {
          h: 'Rashi’s extra words',
          b: `<p>This will be understood once we first ask why Rashi writes at such length: “And the reish that was in it at first — when he was a father only to Aram, his place, and now he is a father to the whole world — even it did not move from its place.”</p><p>Rashi does not mention the name “Avram” here at all; he begins right away: “And the reish that was in it at first…” (and only then adds: “when he was a father only to Aram”). All the more so since the Gemara says: “At first he became a father to Aram, and in the end he became a father to the whole world.”<sup data-src="berakhot-13a"></sup> So Rashi’s main point here is not to explain the acrostic of the earlier name Avram, but only why the letter ר remained in the name Avraham. (Rashi does not need to explain an acrostic of the name Avram: for the meaning of the name Avraham — “father of a multitude of nations” — it hardly matters whether the earlier name had a similar meaning.)</p><p>But if Rashi only wants to explain why the ר “did not move from its place,” he could have said briefly: “An acrostic of ‘father of a multitude of nations,’ and the reish that was in it at first did not move from its place, for even the yud…” Why does he need to explain that the ר was in the name because “he was a father only to Aram”?</p><p>We also need to understand Rashi’s exact words: “even the reish… <b>did not move from its place</b>.” These are unusual words; it would seem simpler to say: “it was not taken away” or “it was not removed from his name.”</p>`,
        },
      ],
      reflection: 'When I start something new and big, do I sometimes forget what I had before that was good?',
      takeaways: [
        '“Father of a multitude of nations” is an acrostic of the name Avraham; the letter ר is not in those words.',
        'Rashi: the ר “did not move from its place” — for even the י of Sarai complained until it was added to Yehoshua.',
        'The Rebbe’s question: the י did leave — to another name and person — so what kind of proof is that?',
        'The word “even” says the י had less reason to complain than the ר. Why?',
        'And why does Rashi explain that the ר comes from “father to Aram,” and write “did not move from its place”?',
      ],
      puzzle: {
        q: 'Put the investigation in order: from the verse to the Rebbe’s questions.',
        pieces: ['Avram → Avraham', 'The acrostic “av hamon”', 'The letter ר is extra', 'Example: the י of Sarai', 'But the י did leave!'],
        meaning: 'Rashi explains why the ר stayed with the example of the י — yet the י went to Yehoshua. So the two letters took different paths, and the answer lies in the meaning of the names themselves.',
      },
    },
    {
      title: 'Sarai and Sarah',
      cond: `<p>In the same chapter G-d says to Avraham:</p><p class="verse" dir="rtl" lang="he">שרי אשתך לא תקרא את שמה שרי כי שרה שמה</p><p>“As for Sarai your wife, do not call her Sarai, for Sarah is her name.”<sup data-src="gen-17-15"></sup></p><p>Rashi explains: “Sarai” is “my princess” — “a princess to me and not to others”; “Sarah” is simply “princess” — “she will be a princess over all.”<sup data-src="rashi-17-15"></sup> And the Gemara says: “At first she was Sarai — a princess to her own nation — and in the end she became Sarah — to the whole world.”<sup data-src="berakhot-13a"></sup></p><p>The Rebbe looks for the answer in the meaning of the names themselves: what did the letter ר mean in the name Avram — and what did the letter י mean in the name Sarai?</p>`,
      steps: [
        {
          q: 'According to Rashi, what was Avram before he was called Avraham?',
          hint: 'Aram is the place he came from.',
          opts: ['“a father to Aram”', '“a father to the whole world”', '“a father to Canaan”', '“a father only to his own sons”'],
        },
        {
          q: '“A father to Aram” — and “a father to the whole world.” How is one related to the other?',
          hint: 'Aram is also part of the world.',
          opts: ['“the first is included in the second”', '“the first contradicts the second”', '“they are not related at all”', '“the first is bigger than the second”'],
        },
        {
          q: 'And what, according to Rashi, does the name “Sarai” mean?',
          hint: 'The letter י at the end means “my.”',
          opts: ['“a princess to me and not to others”', '“a princess over all”', '“a princess to her own nation”', '“a princess over Avraham”'],
        },
        {
          q: 'Sarah became “a princess over all” — even over Avraham. What did G-d later say to Avraham about Sarah?',
          hint: 'Listen — to whom?',
          opts: ['“whatever Sarah tells you, listen to her voice”', '“do not listen to her voice”', '“send her away”', '“he shall rule over you”'],
        },
        {
          q: 'The letter ר found a place in the name Avraham. But the letter י has no place in the name Sarah. So how was it “appeased”?',
          hint: 'It was not left — it was added to another name.',
          opts: ['“it was added to the name Yehoshua”', '“it was left in the name Sarah”', '“it was erased completely”', '“it was given to Avraham”'],
        },
      ],
      reveal: {
        h: 'The meaning of the letter decides',
        p: 'The ר stands for “father to Aram,” and “father to Aram” is included in “father to the whole world”: its meaning lives on in the new name. So its complaint is strong — “my meaning remains, why remove me?” — and the answer is: the ר “did not move from its place.” But the י means “mine — and not for others,” the opposite of “Sarah — princess over all,” even over Avraham: “whatever Sarah tells you, listen to her voice.”<sup data-src="gen-21-12"></sup> There is no place for the י in the new name — so its complaint is weaker (“even”), and it can be appeased only in another way: by adding it to the name Yehoshua.',
      },
      lessons: [
        {
          h: 'A name tells the essence',
          b: `<p>As has been explained many times, in the plain meaning of the Torah, in Rashi’s way, nothing is said for no reason. A person’s name expresses his essence, and Rashi explains the meaning of a name where it matters. So there is no room to think that the name “Avram” said nothing about Avraham’s own life.</p><p>That is what Rashi tells us with his words “when he was a father only to Aram, his place”:<sup data-src="rashi-17-5"></sup> by the plain meaning, one cannot say that G-d left a letter in a name only “because of a complaint,” if the letter itself has no connection with the meaning of the name. But the letter ר does have such a connection: its meaning in the name Avram — “father to Aram” — is connected with the meaning of the name Avraham — “father of a multitude of nations.” For “father to the whole world” includes “father to Aram” too (the general includes the particular) — so this is not a cancellation, only an addition.</p><p>And the exact words “did not move from its place”: one could say that the ר remained because its meaning (“father to Aram”) simply became part of “father to the whole world,” as one of the parts of the world. But Rashi stresses something new: the ר remained <i>in its own place</i> — “father to Aram” stays in the name Avraham as a separate meaning of its own, even though in essence it is included in “father to the whole world.”</p>`,
        },
        {
          h: 'Two complaints, two answers',
          b: `<p>Now the proof is clear too: “for even the yud of Sarai complained.” The letter ר of Avraham has an argument and a complaint: since its meaning remains in the name, there is no reason to remove it from the tzaddik’s name; on the contrary — it should stay. But the yud of Sarai has no such argument: in the meaning of the name Sarah the yud has no place (as explained below). So it has less reason to complain — and still <i>even</i> it complained, and that is why it was “added” to Yehoshua.<sup data-src="numbers-13-16"></sup></p><p>This also explains the difference: the yud “moved from its place,” and the ר did not. The comparison and the proof are only that complaints have an effect; but <i>how</i> a letter is appeased depends on the case. Here the meaning of the ר remains in the name Avraham — so it stays in its place. The yud of Sarai has no place in the new name — it cannot be left “in its place,” so it is appeased another way: it is added to another name.</p>`,
        },
        {
          h: 'Sarai — Avraham’s princess',
          b: `<p>But why does the yud have no place in the name Sarah? It would seem the opposite! Rashi explains: “Sarai means ‘a princess to me and not to others’; but Sarah is simply ‘princess’: she will be a princess over all.”<sup data-src="rashi-17-15"></sup> So “Sarai” (“to me”) seems included in “Sarah” (“over all”), just as “father to Aram” is included in “father to the whole world.” Why, then, is the yud “not in its place”?</p><p>The answer lies precisely in Rashi’s explanation. According to the Gemara, “at first she became Sarai — a princess to her own nation — and in the end she became Sarah — to the whole world”<sup data-src="berakhot-13a"></sup>: then the difference between Sarai and Sarah would be exactly like the difference between Avram and Avraham. But Rashi explains “Sarai” differently: “a princess <b>to me</b>.” And the verse speaks of this name to Avraham: “G-d said to Avraham: As for Sarai your wife…”<sup data-src="gen-17-15"></sup> — so “Sarai” means “Avraham’s princess.”</p><p>Therefore the meaning of “Sarai” (“to me” — to Avraham) is the opposite of “Sarah” (“over all,” over Avraham as well). “Sarai” means that she is a princess for Avraham, and, as it is said, “he shall rule over you.”<sup data-src="gen-3-16"></sup> But “Sarah — over all” means she is a princess over Avraham too: “Whatever Sarah tells you, listen to her voice”!<sup data-src="gen-21-12"></sup> That is why there is no place in the name Sarah for the yud, which meant “to me.”</p>`,
        },
        {
          h: '“Over all” cancels “to me”',
          b: `<p>This also explains Rashi’s words: “Do not call her Sarai — for that means ‘a princess to me and not to others’ — for Sarah is simply her name: she will be a princess over all.”<sup data-src="rashi-17-15"></sup> About Avraham Rashi writes “at first… a father to Aram… and now — a father to the whole world,” but here he does not say “at first.” For the meaning of the name “Sarai” does not just stay in the past — it is cancelled: “to me, <i>and not to others</i>.” Since G-d wanted her to be “a princess over all,” the name Sarai (“to me and not to others”) had to be cancelled: had it remained, Sarah could not be “a princess over all.”</p><p>(Also: the words “whatever Sarah tells you, listen to her voice”<sup data-src="gen-21-12"></sup> were said several years after she was named Sarah — and they were said as something new.)</p>`,
        },
        {
          h: 'Av ram — the hidden intellect',
          b: `<p>The “wine of the Torah” in Rashi’s words is an inner explanation that fits both names, Avram and Avraham. The Alter Rebbe (in Torah Or) explains: “Avram” is made of the words “av ram” — “exalted father”: “av” is wisdom (chochmah), and “ram” is what is above it, “the intellect hidden from every thought.” And the change from Avram to Avraham (“father of a multitude of nations”) means: even this “intellect hidden from every thought” must reach “a multitude of nations” — shine downward, so that people can understand it.</p><p>One might think: since the “hidden intellect” comes down to “a multitude of nations,” it loses its height. So Rashi says: “even the reish… did not move from its place”<sup data-src="rashi-17-5"></sup> — “ram,” the height, stays in its place and in its loftiness, and at the same time reaches down to “a multitude of nations.” This is what is new and special about Avraham: the joining of “above” and “below” — the hidden intellect comes down and stays what it is.</p>`,
        },
        {
          h: 'Your own place first',
          b: `<p>A lesson for serving G-d. It is known that everything the Patriarchs had is passed down as an inheritance to every Jew. So too the name “Avraham” — “father of a multitude of nations”: every Jew has the power to influence “a multitude of nations,” the whole world.</p><p>But one must know: “the reish… father to Aram, his place… did not move from its place.” Although a Jew must act in the whole world, the first duty is to influence his own place and surroundings (as the law says: “the poor of your own city come first”<sup data-src="bava-metzia-71a"></sup>), and only then, from there, to become “a father to the whole world.”</p>`,
        },
      ],
      reflection: 'Who is “my Aram” — my place and the people close to me? What good can I do for them first?',
      takeaways: [
        'A name expresses the essence: “Avram” — “father to Aram,” his place.',
        '“Father to the whole world” includes “father to Aram” — so the ר stayed and even “did not move from its place.”',
        '“Sarai” — “a princess to me and not to others”; “Sarah” — a princess over all, even over Avraham: “listen to her voice.”',
        'The י has no place in the name Sarah — so it was appeased another way: added to the name Yehoshua.',
        'The lesson: influence the whole world — but your own place first (“the poor of your own city come first”).',
      ],
      puzzle: {
        q: 'Put the Rebbe’s answer in order: from the meaning of the letters to the lesson.',
        pieces: ['“Father to Aram” is in “father to the whole world”', 'The ר stays in its place', '“Mine” versus “over all”', 'The י goes to Yehoshua', 'Your own place first'],
        meaning: 'A letter stays when its meaning lives on in the new name, and leaves when it contradicts it. So too we: we influence the whole world without leaving our own place.',
      },
    },
    {
      title: 'Three Altars',
      cond: `<p>In our parshah Avraham builds three altars:</p><p class="verse" dir="rtl" lang="he">ויבן שם מזבח לה׳ הנראה אליו</p><p>— in Shechem, after G-d’s words “To your offspring I will give this land”;<sup data-src="gen-12-7"></sup> the second — between Beit El and Ai;<sup data-src="gen-12-8"></sup> the third — in Hebron.<sup data-src="gen-13-18"></sup></p><p>Rashi explains the first two. About the third — he is silent. The Midrash says there were three altars: for the good news of the Land of Israel, for acquiring it, and so that his children would not fall.<sup data-src="bereshit-rabbah-39-16"></sup> So why didn’t Rashi explain the third?</p>`,
      steps: [
        {
          q: 'According to Rashi, why did Avraham build the first altar?',
          hint: 'G-d promised him children and the land.',
          opts: ['“for the good news of offspring and the good news of the Land of Israel”', '“for acquiring the land”', '“so that his children would not fall”', '“in honor of the king”'],
        },
        {
          q: 'And the second, near the city of Ai? Rashi: he foresaw that his descendants would stumble there — because of whose sin?',
          hint: 'In the days of Yehoshua, when forbidden things were taken from Jericho.',
          opts: ['“because of Achan’s sin”', '“because of the sin of the golden calf”', '“because of the generation of the Flood”', '“because of the sale of Yosef”'],
        },
        {
          q: 'The Midrash: the third altar was “for acquiring” the land. But by the plain meaning G-d said: “Arise, walk through the land… for to you I will give it.” Why is that not acquiring?',
          hint: 'Look at the tense of the verb.',
          opts: ['“‘I will give’ is future: the land is still to be given”', '“Avraham did not walk through it”', '“Avraham had already bought it”', '“there was no room for an altar there”'],
        },
        {
          q: 'How was Hebron different from Avraham’s earlier places?',
          hint: 'Until then he “kept traveling toward the south.”',
          opts: ['“there he settled”', '“there he was born”', '“there he fought”', '“there he was circumcised”'],
        },
        {
          q: 'The Gemara: “Mizbe’ach” (altar) — “meziach, mezin, mechabev, mechaper.” Which of these is not a benefit for a person, but love between Israel and their Father?',
          hint: 'It does not feed, atone or remove decrees.',
          opts: ['“mechabev — endears”', '“mezin — sustains”', '“mechaper — atones”', '“meziach — removes”'],
        },
        {
          q: 'The Rambam divides offerings into four kinds: olah, chatat, asham, shelamim. But chatat and asham both come for atonement. How many kinds are there if they are counted together (as the Midrash divides them)?',
          hint: '4 − 1.',
        },
      ],
      reveal: {
        h: 'Three actions of the altar',
        p: '“The deeds of the fathers are a sign for the children”:<sup data-src="tanchuma-lech-lecha-9"></sup> Avraham’s altars are a sign and a source of strength for the altar of his descendants, in the Mishkan and in the Temple. And the altar has three actions: it “sustains” the world, it “removes and atones” — and it “endears Israel to their Father.”<sup data-src="ketubot-10b"></sup> So too the three kinds of offerings: shelamim (eaten by the owners), chatat and asham (for atonement), and the olah — entirely for G-d.',
      },
      lessons: [
        {
          h: 'Three altars',
          b: `<p>Our parshah tells that Avraham built three altars: “and he built there an altar to the L-rd who had appeared to him”;<sup data-src="gen-12-7"></sup> “and he built there an altar to the L-rd and called in the name of the L-rd”;<sup data-src="gen-12-8"></sup> “and he built there an altar to the L-rd.”<sup data-src="gen-13-18"></sup> The Sages explained that Avraham built all three altars in the Land of Israel for the sake of his children: the first — for the good news of the Land of Israel; the second, near Ai — “so that his children would not fall” (when G-d promised him the land, he foresaw that his descendants would stumble there); the third — after he fulfilled the command “Arise, walk through the land in its length and its breadth, for to you I will give it” — “for acquiring it.”<sup data-src="bereshit-rabbah-39-16"></sup></p><p>In his commentary Rashi brings from the Midrash the meaning of the first two altars. On the first: “for the good news of offspring and the good news of the Land of Israel.”<sup data-src="rashi-12-7"></sup> On the second: “He foresaw that his children would stumble there because of the sin of Achan, and he prayed there for them.”<sup data-src="rashi-12-8"></sup> But about the third altar Rashi is silent and explains nothing.</p>`,
        },
        {
          h: 'Why not “for acquiring”',
          b: `<p>Why didn’t Rashi explain, as the Midrash does, that the third altar was “for acquiring”? According to the Midrash, Avraham “acquired” the land by walking through it — so it fits to say that the altar was built for its acquisition. But by the plain meaning of the verse, the command “Arise, walk through the land…” is not in order to acquire it: the verse ends “for to you I <b>will give</b> it”<sup data-src="gen-13-17"></sup> — in the future. That is, the walking was only to see how great the land is that G-d would give in the future. So one cannot explain that this altar was built “for acquiring.”</p><p>But if so, why did Rashi, after explaining the reasons for the first two altars, say nothing about the reason for the third?</p>`,
        },
        {
          h: 'Hebron — the first settled place',
          b: `<p>One could say simply: Rashi has already explained that Avraham built an altar for good news — for the good news of the Land of Israel — so there is no need to look for another reason for the third. After all, the verse tells that Avraham built it after an even greater promise: “All the land that you see, to you I will give it and to your offspring forever, and I will make your offspring like the dust of the earth.”<sup data-src="gen-13-17"></sup> Avraham heard good news — and built an altar, like the first.</p><p>But this is far from the plain words “and he built <b>there</b> an altar”: the building is tied to the place. (The first — “to the L-rd who had appeared to him,” where G-d appeared; the second — “and called in the name of the L-rd,” where he prayed.) But the third was built in Hebron for news received before he came to Hebron — what does the place have to do with it?</p><p>By the plain meaning one can explain: Hebron is the first place in the Land of Israel where Avraham settled for good. Before that he was on the road: “he kept traveling toward the south”<sup data-src="gen-12-9"></sup> — and only when he came to Hebron did he settle: “And he came and settled in the plains of Mamre, which are in Hebron.”<sup data-src="gen-13-18"></sup> (And later Sarah died in Hebron, where Avraham lived.) So this is the most fitting place to thank G-d for the good news — when he settled in the Land of Israel for a long time. But even so the question is not fully resolved.</p>`,
        },
        {
          h: 'The deeds of the fathers are a sign for the children',
          b: `<p>The explanation. The Sages said: “The Holy One, blessed be He, gave Avraham a sign: whatever happened to him happened to his children”<sup data-src="tanchuma-lech-lecha-9"></sup> — “the deeds of the fathers are a sign for the children.” So the altars that Avraham built are connected with the altar for the offerings of his children — in the Mishkan and in the Temple.</p><p>This is the point of Avraham building exactly three altars: the altar of his “children” has three actions, and the sign (and the strength) for them is Avraham’s three altars.</p>`,
        },
        {
          h: 'Mizbe’ach: sustains, atones, endears',
          b: `<p>About the altar the Sages said: “‘Mizbe’ach’ — meziach, and mezin, mechabev, mechaper”:<sup data-src="ketubot-10b"></sup> it removes (harsh decrees from Israel); it sustains — thanks to the offerings the world receives its food, for the offerings are brought from food and bring blessing to it; it endears Israel to their Father; and it atones for sins.</p><p>These four actions fall, in general, into three kinds: a) “mezin” — sustenance for the world; b) “meziach and mechaper” — cancelling what is undesirable (decrees and sins); c) “mechabev — endearing Israel to their Father.”</p><p>The same division of “four that are three” is found in the offerings on the altar. The Rambam divides offerings into four kinds: olah, chatat, asham and shelamim; while in the Midrash they are divided into three: olah, shelamim and chatat. There is no contradiction: chatat and asham have one content — both come for atonement.</p>`,
        },
        {
          h: 'Three kinds of offerings',
          b: `<p>One can say that the three actions of the altar correspond to the three kinds of offerings.</p><p>The <b>shelamim</b>, eaten by their owners, correspond to the altar “sustaining” the world: just as the owners merit this food (ordinary, bodily food) through an offering brought to G-d, so “thanks to the offerings the world receives its food.”<sup data-src="ketubot-10b"></sup></p><p>The <b>chatat</b> (and asham), brought for atonement, are “removes… atones.”</p><p>And the <b>olah</b>, burnt on the altar entirely for G-d — its meaning is “endearing Israel to their Father.” As the Midrash says, the olah is brought only for the glory of the Holy One, blessed be He, while the shelamim and chatat are for ourselves. That is, the shelamim and chatat benefit the one who brings them (sustenance, or cancelling what is undesirable), while the olah is only for G-d’s glory, and through it Israel becomes beloved to their Father in Heaven.</p>`,
        },
      ],
      reflection: 'When I do a good deed — what is it for? Do I sometimes do something “just for G-d,” asking nothing in return?',
      takeaways: [
        'Avraham built three altars: in Shechem, near Ai and in Hebron.',
        'Rashi: the first — for the good news of offspring and of the land; the second — a prayer for his children who would stumble through Achan’s sin. About the third Rashi is silent.',
        'By the plain meaning “to you I will give it” is future; so the third altar is not “for acquiring.” Hebron is where Avraham settled.',
        '“The deeds of the fathers are a sign for the children”: Avraham’s altars are a sign for the altar in the Temple.',
        'The altar sustains, atones and endears Israel to their Father — like shelamim, chatat (and asham) and olah: 4 − 1 = 3.',
      ],
      puzzle: {
        q: 'Put the investigation in order: from the question to the three actions of the altar.',
        pieces: ['Three altars', 'Rashi is silent about the third', '“Will give” — in the future', 'The deeds of the fathers are a sign', 'Sustains · atones · endears'],
        meaning: 'The third altar is not “for acquiring”; Avraham’s altars are a sign for the altar of his children, which has three actions, like the three kinds of offerings.',
      },
    },
    {
      title: 'The Altar in Hebron',
      cond: `<p>Let us go back to the third altar:</p><p class="verse" dir="rtl" lang="he">ויבא וישב באלני ממרא אשר בחברון ויבן שם מזבח לה׳</p><p>“And he came and settled in the plains of Mamre, which are in Hebron, and he built there an altar to the L-rd.”<sup data-src="gen-13-18"></sup></p><p>No good news, no prayer — simply “an altar to the L-rd.” And much later, in the same Hebron, “all the elders of Israel came to the king… and King David made a covenant with them in Hebron before the L-rd.”<sup data-src="samuel2-5-3"></sup> What do Avraham’s altar and King David have in common?</p>`,
      steps: [
        {
          q: 'Which of the three altars was built only for G-d’s glory, with no other purpose?',
          hint: 'Rashi did not write a word about it.',
          opts: ['“the altar in Hebron”', '“the altar in Shechem”', '“the altar near Ai”', '“the altar on Mount Moriah”'],
        },
        {
          q: 'Which offering is burnt on the altar entirely, “only for G-d’s glory”?',
          hint: 'Neither the owners nor (except for the hide) the kohanim eat it.',
          opts: ['“olah”', '“shelamim”', '“chatat”', '“asham”'],
        },
        {
          q: 'Which word is the name “Hebron” connected with?',
          hint: 'Hebrew “chibur.”',
          opts: ['“connection”', '“war”', '“rest”', '“strength”'],
        },
        {
          q: 'The first altar is like the First Temple, the second like the Second. And the third?',
          hint: 'The Temple that is yet to be built.',
          opts: ['“the Third Temple”', '“the First Temple”', '“the Second Temple”', '“the Mishkan in the desert”'],
        },
        {
          q: 'Who was anointed king over all Israel in Hebron?',
          hint: 'His kingship is eternal, and Moshiach comes from his line.',
          opts: ['“David”', '“Shaul”', '“Shlomo”', '“Yehoshua”'],
        },
      ],
      reveal: {
        h: 'An altar with no “what for”',
        p: 'Rashi does not explain the purpose of the third altar because it had no purpose for a person: it was built only “to the L-rd” — like an olah, entirely for G-d. This is service with complete self-sacrifice, without any calculation — and precisely in Hebron, for “Hebron” comes from the word “connection.” The three altars are a sign of the three Temples, and the third, in Hebron, where David was anointed,<sup data-src="samuel2-5-3"></sup> is a sign of the Third Temple and the kingdom of Moshiach: “And My servant David shall be king over them.”<sup data-src="ezekiel-37-24"></sup>',
      },
      lessons: [
        {
          h: 'Three parts of every offering',
          b: `<p>One can say that these three actions are found, in general, in every offering, because all have three parts: a) the blood is sprinkled on the altar; b) the kohanim and the owners eat the offering (and of the olah the kohanim receive the hide); c) the revelation of the Shechinah — the fire that came down from heaven and “consumed” the offerings (and in general — that the altar stands in the Temple, “the House of G-d prepared for offerings to be brought in it,” as the Rambam writes).</p><p>The part of the offering eaten by the kohanim and the owners hints at the altar “sustaining” the world.</p><p>The blood sprinkled on the altar is what brings atonement for sins and forgiveness (and this includes forgiveness for everything undesirable).</p><p>And the revelation of the Shechinah in the offerings (the fire from heaven; and in general that the altar is in the Temple, “the House of G-d”) shows how beloved Israel are — to the point that “as one comes to see, so one comes to be seen”<sup data-src="chagigah-2a"></sup>: all this revelation is for the sake of Israel, the people close to Him.</p>`,
        },
        {
          h: 'Three levels of service',
          b: `<p>It is known that the service of the offerings is called simply “the service” (avodah): in it all of the service of G-d is expressed. So, just as the offerings have these three sides, all of the service of G-d has three parts.</p><p>The beginning is the service of Torah and mitzvot, “food for the soul” (“sustains”): the Torah is “our life,” and of the mitzvot it is said: “which a person shall do and live by them.”<sup data-src="lev-18-5"></sup> It is known that the 248 positive mitzvot correspond to the 248 limbs of a person, and by keeping Torah and mitzvot the life (of the soul) is drawn into a person’s limbs.</p><p>Higher than this is the service of return (teshuvah): even if a person has sinned, done damage and strayed from the path — G-d forbid — he repairs it through teshuvah (“atones” and “removes”).</p><p>But the fullness of attachment to G-d is the service of self-sacrifice: a person gives himself and all he has to G-d (like an olah, entirely for G-d). True self-sacrifice is not for a reward and not for any benefit (bodily or even spiritual, for the soul), but only for G-d’s glory, without any calculation at all. And when a person gives himself wholly to G-d like this and seeks nothing for himself, he “endears Israel to their Father.”</p>`,
        },
        {
          h: 'Avraham’s three altars',
          b: `<p>Now the meaning of Avraham’s three altars is clear — by the rule “the deeds of the fathers are a sign for the children”: in them Avraham laid the foundation (the “sign”) of the three main parts of Israel’s service in all generations.</p><p>The first altar — “for the good news of offspring and the good news of the Land of Israel”<sup data-src="rashi-12-7"></sup>: these are the needs of a person, both bodily and spiritual (like “sustains”). The second — where he prayed for his children because of Achan’s sin<sup data-src="rashi-12-8"></sup>: this is “removes… atones.” And about the third Rashi does not explain its meaning — because the purpose of this altar is not some side benefit, but only to build an altar to G-d (like an olah — entirely for G-d, only for His glory). This is “endears”: such an offering brings G-d’s love for Israel.</p><p>So Avraham’s three altars go in order, from the light to the weighty: the first — for the good news of offspring and land (“sustains”); the second — a prayer over Achan’s sin (“removes… atones”); the third — “and he built there an altar to the L-rd,”<sup data-src="gen-13-18"></sup> simply so, with no other purpose — only for G-d’s glory.</p><p>[This also explains why, on the first altar, Rashi does not quote the words “to the L-rd who had appeared to him.” It would seem that the plain meaning of the verse is: after G-d appeared to Avraham, he built an altar “to the L-rd who had appeared to him” — to give thanks for this appearance (or the appearance awakened in him the wish to serve G-d with an altar). Yet Rashi explains that the altar was (only) “for the good news of offspring and the good news of the Land of Israel.” This is because service goes in steps, from below upward, from the light to the weighty, and the words “to the L-rd who had appeared to him” do not describe the purpose of the altar, but only the time: he received the good news when G-d appeared to him.]</p>`,
        },
        {
          h: 'Hebron — connection',
          b: `<p>This also explains why the verse stresses about the third altar “and he built <b>there</b> an altar to the L-rd”<sup data-src="gen-13-18"></sup> — precisely in Hebron: the meaning of this altar is connected precisely with the city of Hebron.</p><p>It is known that “Hebron” comes from the word “chibur,” “connection.” (Elsewhere it is explained that this is connected with the city of Hebron itself: there the Patriarchs and Matriarchs of all Israel are buried, and “only three are called Patriarchs,” and all prayers rise through Hebron.) And the true bond and connection of Israel with G-d is when the service is not “for ourselves,” not for a person’s benefit (not even the highest — atonement), but when one’s “altar” — the offering — is only for G-d’s glory, entirely for G-d.</p>`,
        },
        {
          h: 'Three Temples',
          b: `<p>It is known that the main thing in the Temple — “the House of G-d prepared for offerings to be brought in it” — is the altar. So one can say that Avraham’s three altars correspond to the three Temples.</p><p>Elsewhere it is explained at length that in spiritual service the difference between the First and the Second Temple is this: the First Temple is the service of the tzaddikim, and the Second, built (after the destruction of the First and) to repair the destruction, is the service of return (teshuvah). So Avraham’s first altar — matching the service of Torah and mitzvot — is the “sign” of the First Temple, the service of the tzaddikim (they are called so for keeping Torah and mitzvot); the second — matching the service of teshuvah — is the “sign” of the service of the Second Temple.</p><p>But the goal and the fullness is the Third Temple, the fullness of the service of G-d, when the promise will come true: “for they shall see, eye to eye”<sup data-src="isaiah-52-8"></sup> — the complete revelation of G-dliness, and so also the complete attachment of Israel to G-d, complete self-nullification before Him. And this is exactly like Avraham’s third altar in Hebron, whose whole meaning is “and he built there an altar to the L-rd.”</p><p>Support for this is found in the words of the Midrash: Avraham built an altar in Hebron because it is the place where David was made king and where a covenant was made, as it says: “All the elders of Israel came to the king to Hebron, and King David made a covenant with them in Hebron before the L-rd.”<sup data-src="samuel2-5-3"></sup></p>`,
        },
        {
          h: 'The kingdom of David',
          b: `<p>It is known that the kingship of King David (especially when he actually became king over all Israel) is an eternal kingship, and its fullness is the kingship of King Moshiach. According to the ruling of the Rambam, King Moshiach will arise and restore the kingship of David to its former rule; and more than that, the Midrashim of the Sages say that King Moshiach is King David himself.</p><p>So this altar of Avraham is connected with the kingship of David — the kingship of Moshiach, when the fullness of the service of G-d will come.</p>`,
        },
        {
          h: 'The lesson: service bound up with the Redemption',
          b: `<p>The lesson for our deeds and our service now. Since “the deeds of the fathers are a sign for the children,” Avraham’s three altars must be part of the service of every Jew.</p><p>And since the third altar matches the fullness that will come in the true and complete Redemption through our righteous Moshiach — it follows that all of our service (the altar and the offerings in the service of G-d), even in the time of exile, must be bound up with the kingship of David — David, King Moshiach.</p><p>That is, both the service of Torah and mitzvot and teshuvah must be filled with the clear knowledge that the fullness of the service of G-d will come only in the future (then the mitzvot will be kept “according to the command of Your will”; and, as is known from the words of the Ramban, the mitzvot we keep now are only “signposts”).</p><p>And this awakens even more the desire and longing for the true and complete Redemption — and so brings near and hastens the time when we will see with our own eyes, in actual deed, the fulfillment of the covenant with King David, David King Moshiach: “And My servant David shall be king over them, and they all shall have one shepherd… and David My servant shall be their prince forever”<sup data-src="ezekiel-37-24"></sup> — speedily, in our days.</p>`,
        },
      ],
      reflection: 'What can I do today simply “for G-d” — not for a benefit and not for praise?',
      takeaways: [
        'Every offering has three parts: it is eaten (sustains), its blood is sprinkled (atones), fire from heaven (G-d’s love for Israel).',
        'And service has three levels: Torah and mitzvot, teshuvah, and self-sacrifice only for G-d.',
        'The first altar — the needs of a person, the second — atonement, the third — only “to the L-rd”; that is why Rashi is silent about it.',
        '“Hebron” — “connection”: the true bond with G-d is service without calculation.',
        'The three altars are a sign of the three Temples; the third, in Hebron, where David was anointed, is a sign of the Third Temple and the kingdom of Moshiach.',
      ],
      puzzle: {
        q: 'Put the Rebbe’s answer in order: from the light to the highest.',
        pieces: ['Good news of offspring and land', 'A prayer over Achan’s sin', '“An altar to the L-rd” — and nothing more', 'Hebron — connection', 'The Third Temple and King David'],
        meaning: 'Avraham’s altars rise from a benefit for a person to service only for G-d; the third, in Hebron, is a sign of the fullness of service in the days of Moshiach.',
      },
    },
  ],
  final: {
    title: 'Case solved',
    allSolved:
      'All four riddles are solved. The letter ר stayed in its place, while the י went to Yehoshua; Avraham’s third altar was only for G-d, a sign of the Third Temple. Influence the whole world — without leaving your own place.',
  },
  puzzle: {
    q: 'Put the path of both talks in order.',
    pieces: ['The ר did not move from its place', 'The י went to Yehoshua', 'Your own place first', 'Three altars', 'Hebron — toward Moshiach'],
    meaning: 'Avraham’s name teaches us to influence the whole world without leaving our own place, and his altars — to serve G-d from the simple to the highest, up to the fullness of the Third Temple.',
  },
  audience: 'Ages 11 and up: a close reading of Rashi and the meaning of names; offerings and the Temple are explained. Younger children — together with adults.',
  practice:
    'Start with your own “Aram”: today do one good deed for someone close by — in your family, class or building (“the poor of your own city come first”) — simply for G-d, expecting nothing in return.',
  highlight: '“For I have made you the father of a multitude of nations” (Genesis 17:5): the letter ר “did not move from its place” — influence the whole world without leaving your own place.',
  share: ({ score, max, time, grid, allSolved, site }) => `✨ Avram became Avraham — yet the letter ר stayed in his name. Why? And why did Avraham need three altars?

I’m investigating together with the Lubavitcher Rebbe — “Niflaot of the Rebbe,” Parshat Lech Lecha. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: the letter that stayed, Sarai and Sarah, three altars and the altar in Hebron.
Play 👉 ${site}

©mychitas.app`,
  source:
    'The investigation follows talks of the Lubavitcher Rebbe: Shabbat Parshat Lech Lecha 5744 (Likkutei Sichot, vol. 25, Lech Lecha, talk 3) and 7 Mar-Cheshvan 5746 (Likkutei Sichot, vol. 30, Lech Lecha, talk 1), in Hebrew translation; retold by the project.',
};

export default en;
