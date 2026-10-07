import type { LessonText } from '../../types';

const en: LessonText = {
  title: 'Tikun Partzuf-Zanav',
  hero: {
    heading: 'The mathematics of the soul: <i>four gematria riddles</i>',
    author: 'based on an article by Rabbi Yitzchak Ginsburgh',
    intro:
      'Count the numerical values of words, discover hidden equalities and uncover their meaning: pride and desire, prayer, the three faces of a person and the secret of marriage.',
  },
  summary: 'Pride and desire, prayer, the three faces of a person and the secret of marriage — four riddles about the face, the mask and the heart.',
  glossary: {
    'פרצוף': 'face, countenance',
    'זנב': 'tail',
    'גאוה': 'pride',
    'תאוה': 'desire',
    'אש': 'fire',
    'אלף': 'alef',
    'שין': 'shin',
    'תפלה': 'prayer',
    'פנים': 'inner face',
    'מסכה': 'mask',
    'לעיני': 'before the eyes',
    'כל': 'of all',
    'ישראל': 'Israel',
    'אשה': 'woman',
    'טוב': 'good',
    'חי': 'life',
    'ויבן': 'and He built',
  },
  riddles: [
    {
      title: 'The cosmic balance of two forces',
      cond: `<p>The Sages of the Talmud debate what the “back side” (<em>אחור</em>) of the first man was, from which Chava was created: some say a face (<em>פרצוף</em>), others say a tail (<em>זנב</em>).</p><p>Chassidut explains: behind the “face” stands the root of pride (<em>גאוה</em>), behind the “tail” — the root of desire (<em>תאוה</em>). Weigh both pairs.</p>`,
      steps: [
        { q: 'What is <span class="he">פרצוף + גאוה</span>?', hint: 'פרצוף = 456, and גאוה is 3 + 1 + 6 + 5.' },
        { q: 'What is <span class="he">זנב + תאוה</span>?', hint: 'זנב = 7 + 50 + 2, and תאוה = 400 + 1 + 6 + 5.' },
        {
          q: 'Which word, with its letters spelled out in full (מילוי), gives exactly 471?',
          opts: ['fire · אלף + שין', 'light · אלף + וו + ריש', 'water · מם + יוד + מם', 'spirit · ריש + וו + חית'],
        },
      ],
      reveal: {
        h: 'The fire of pride and the fire of passion',
        p: 'Both sides of the subconscious stand in perfect balance. Both are fire: the letter Alef is the root of the proud “I”, the letter Shin is the flame of passion.',
      },
      lessons: [
        { h: "What woman was created from", b: `<p>The most direct meaning of the debate about the “face” and the “tail” is a debate about <b>what woman was created from</b>. The Gemara (Berachot 61a, Eruvin 18a) discusses the words “and G-d built the rib (<span class="he">צלע</span>)… into a woman”. What was this “rib”?</p><p><b>One says — a “partzuf”, a face.</b> Adam was created with two faces: a male face in front and a female face behind. The Almighty separated them, and the back face became Chava. According to this view, woman is from the very start a complete, separate face, equal to man.</p><p><b>The other says — a “zanav”, a tail.</b> Adam had a small appendage behind, and woman was “built” from it. According to this view, she begins from something small and develops.</p><p>The lesson continues this line. <b>Rav, the idealist:</b> woman is originally a “partzuf”, a perfect creation. <b>Shmuel, the realist:</b> woman is originally a “tail”, and the path to perfection is gradual.</p><p>The word “tail” (<span class="he">זנב</span>) has the gematria 59, like “niddah” (<span class="he">נדה</span>): 50 + 4 + 5. This hints at a state of separation and impurity that must be rectified. Hence the ideal of a marriage begun in purity.</p>` },
        {
          h: 'The year פ״ז: face and tail',
          b: `<p>The year ה׳תשפ״ז reads as a hint to “partzuf-zanav”: the letters פ and ז begin both words. The first man was created “behind and before”, and the Sages debate what his back side was. Rav says — a face, Shmuel says — a tail.</p><p>In Kabbalah a person’s “back” is his subconscious, what he cannot see in himself. So the debate is about what lies in the depths of the unconscious: a self-image or a drive.</p>`,
        },
        {
          h: 'What is a “partzuf”',
          b: `<p>A “partzuf” is neither the face itself (פנים) nor a mask (מסכה), but something in between. It is the image a person wants to show others: how he wishes to appear before people. Hence its connection to pride.</p><p>Pride is described as the “other side” (סטרא אחרא): a person seems to put on someone else’s self-awareness and raise himself above his fellow. The “tail” is connected to the straying of the heart and eyes, and its rectification is guarding the covenant.</p>`,
        },
        {
          h: 'Chabad and Breslov: what lies at the root',
          b: `<p>The Chassidic schools differ just as Rav and Shmuel do. In Chabad the main root of evil is pride, the “partzuf”. In Breslov it is desire, the “tail”.</p><p>The numbers show that both positions weigh the same: “partzuf-pride” equals “tail-desire”, 471. That is “fire” spelled out in full: Alef — the root of self-awareness, Shin — the flame of passion. The rectification of pride is the humility of Moshe, “the humblest of men”.</p>`,
        },
        {
          h: 'Freud and Jung',
          b: `<p>Modern psychology also starts from the subconscious, which reveals itself in dreams. For Freud a dream expresses the lowest part of the personality, the drives of the “id” — this is the “tail”.</p><p>For Jung a dream can also express the highest part of the personality, up to a “prophetic” glimpse into the collective unconscious — this is the “partzuf”. Jung’s concept of the “persona”, the mask worn before society, essentially coincides with the “partzuf”.</p>`,
        },
      ],
      reflection: 'What is stronger in me today — the wish to appear (“partzuf”) or the wish to receive (“tail”)? In what situation did it show itself this week?',
      sourceNotes: {
        "gen-2-21": "The verse Rav and Shmuel debate: “and G-d built the rib (צלע)…”. Section “What woman was created from”.",
        "berakhot-61a": "The debate itself: “one said a face (פרצוף), the other a tail (זנב)”. The basis of the whole lesson.",
      },
      takeaways: [
        "Rav and Shmuel debate what Adam’s “back side”, from which Chava was made, was: a “face” (פרצוף) or a “tail” (זנב). In one view woman is equal from the start; in the other she grows from something small.",
        "A person’s “back” is the subconscious. Behind the “face” lies the root of pride (גאוה), behind the “tail” the root of desire (תאוה).",
        "פרצוף + גאוה = זנב + תאוה = 471 = אש spelled out in full (אלף + שין): both passions are fire, and they weigh the same.",
        "Chabad sees pride as the main root of evil, Breslov sees desire. Jung’s “persona” is the “partzuf”; Freud’s drives of the “id” are the “tail”.",
        "זנב = 59 = נדה: a hint to separation that must be rectified — hence the ideal of a marriage begun in purity.",
      ],
    },
    {
      title: 'The mathematics of rectification',
      cond: `<p>Combine both extremes of the subconscious — the “face” and the “tail” (<em>פרצוף־זנב</em>) — in a single analysis. What service of G-d do they add up to, and which mitzvah rectifies both roots?</p>`,
      steps: [
        { q: 'What is <span class="he">פרצוף + זנב</span>?', hint: 'You already know both numbers from the first riddle: 456 and 59.' },
        { q: 'Which word has the gematria 515?', opts: ['prayer', 'Torah', 'tzedakah', 'teshuvah'] },
        { q: 'Which mitzvah rectifies both the head and the heart?', opts: ['tefillin', 'tzitzit', 'mezuzah', 'Shabbat'] },
      ],
      reveal: {
        h: 'Prayer binds the face and the tail',
        p: 'The hand tefillin are placed opposite the heart to subdue the passions (the “tail”). The head tefillin are placed on the brain to humble the pride of the intellect (the “face”).',
      },
      lessons: [
        {
          h: 'Prayer and tefillin',
          b: `<p>Add both sides together, “partzuf” and “zanav”, and you get “prayer” (תפלה). To rectify both drives there are two tefillin.</p><p>The hand tefillin are placed opposite the heart: they rectify the desire that lives in the heart. This is the “prayer of David”, the heart of all Israel. The head tefillin are placed on the brain, the seat of self-awareness: they rectify pride. This is the “prayer of Moshe”, the head of the people.</p>`,
        },
      ],
      reflection: 'Which one sentence will I say in prayer tomorrow so that it comes from both the head and the heart?',
      takeaways: [
        "פרצוף + זנב = 515 = תפלה: prayer joins and rectifies both sides of the subconscious.",
        "The hand tefillin, opposite the heart, rectify desire (“the prayer of David”).",
        "The head tefillin, on the brain, humble the pride of the intellect (“the prayer of Moshe”).",
      ],
    },
    {
      title: 'Moshe’s three levels: from mask to love',
      cond: `<p>The article distinguishes three levels on which a person shows himself:</p><p>• the hard mask (<em>מסכה</em>), worn in anger and judgment;<br>• the social façade (<em>פרצוף</em>), worn when going out to teach others;<br>• the true inner face (<em>פנים</em>), which conceals love for one’s fellow.</p><p>Add all three. Which phrase from the very end of the Torah do you get?</p>`,
      steps: [
        { q: 'What is <span class="he">פנים + פרצוף + מסכה</span>?', hint: 'פנים = 80 + 50 + 10 + 40, מסכה = 40 + 60 + 20 + 5.' },
        {
          q: 'Which phrase of the Torah equals this number?',
          opts: ['before the eyes of all Israel', 'Hear, O Israel', 'In the beginning He created', 'Moshe, our teacher'],
        },
        { q: '761 is the centered square number of order 20. Calculate <span class="num">20² + 19²</span>.', hint: '400 + 361.' },
      ],
      reveal: {
        h: 'The last words of the Torah',
        p: 'The Torah ends with the words “before the eyes of all Israel” (Devarim 34:12). All three of Moshe’s levels — mask, façade and inner face — are revealed together before the whole people.',
      },
      lessons: [
        {
          h: 'Moshe’s mask',
          b: `<p>After the sin of the golden calf Moshe began to cover his face with a veil. The lesson connects this with the moments when Moshe grew angry and erred: anger hides the true face. The mask is the guise one wears when coming to rebuke.</p>`,
        },
        {
          h: 'Moshe’s partzuf',
          b: `<p>When Moshe teaches the people Torah — explaining what is forbidden and what is permitted — he comes out to them in the guise of a teacher. This is his “partzuf”, the face of instruction.</p>`,
        },
        {
          h: 'Moshe’s true face',
          b: `<p>Moshe’s inner essence is boundless love for Israel. He is ready to be erased from the Torah, if only the people are forgiven. He is the “faithful shepherd”, leading the people with compassion.</p><p>All three levels together — mask, partzuf and face — give 761, “before the eyes of all Israel”: the last words of the Torah, which immediately join its beginning, “Bereshit”.</p>`,
        },
        {
          h: 'Realist and idealist',
          b: `<p>The lesson also reads the debate between Rav and Shmuel as a debate between two worldviews. Shmuel is a realist: the world develops gradually, from “tail” to “face”, as in evolution. Rav is an idealist: creation is perfect from the very start, a complete “partzuf”.</p><p>Hence the different views of the days of Mashiach: for Shmuel it is a gradual rectification within nature, for Rav a miraculous transformation of the world.</p>`,
        },
      ],
      reflection: 'Where do I wear a mask, where do I show a “partzuf”, and to whom do I open my true face? Who deserves to see it more often?',
      sourceNotes: {
        "deut-34-10": "The last words of the Torah — “before the eyes of all Israel” (לעיני כל ישראל = 761): this riddle’s solution.",
        "ex-34-33": "Moshe covers his face with a veil (מסוה) — section “Moshe’s mask”.",
        "ex-32-31": "“Erase me from Your book” — Moshe’s love for the people, section “Moshe’s true face”.",
        "num-12-3": "“Moshe was the humblest of men”: humility as the rectification of pride (the “face”).",
      },
      takeaways: [
        "A person has three levels: the mask (מסכה) — the guise of anger and rebuke; the “partzuf” — the teacher’s face before people; the true face (פנים) — hidden love.",
        "פנים + פרצוף + מסכה = 761 = לעיני כל ישראל — the last words of the Torah; 761 = 20² + 19².",
        "Moshe’s inner essence is boundless love for Israel: he is ready to be erased from the Torah for the people’s sake.",
        "Rav is an idealist: creation is perfect from the start. Shmuel is a realist: rectification is gradual, from “tail” to “face”.",
      ],
    },
    {
      title: 'The secret of marriage: from egoism to good',
      cond: `<p>In an egoistic marriage (“I find”, <em>מוצא אני</em>) a person seeks to satisfy his ambitions (the “face”) or his desires (the “tail”). Rising to a meeting “face to face”, he finds a true wife (<em>מצא אשה</em>) and attains good (<em>טוב</em>).</p>`,
      steps: [
        { q: 'How many times greater is <span class="he">אשה</span> than <span class="he">טוב</span>?', hint: 'אשה = 306, טוב = 17. Divide.' },
        { q: 'Which word equals this multiplier?', opts: ['life', 'love', 'one', 'heart'] },
        {
          q: 'With the word <span class="he">ויבן</span> (“and He built”) the Almighty created woman. How many times does it contain <span class="he">טוב</span>?',
          hint: 'ויבן = 6 + 10 + 2 + 50 = 68.',
        },
      ],
      reveal: {
        h: 'Found a wife — found good',
        p: '“Woman” is eighteen times “good”, that is, life drawn from good. The very act of her creation, “and He built”, contains good four times.',
      },
      lessons: [
        { h: "How he sees his wife", b: `<p>The debate between Rav and Shmuel moves inside the man. Whether he sees his wife as a “face” or a “tail” depends on his own “back” — his subconscious.</p><p>If he sees a “tail”, he looks at her through desire. If he sees a “partzuf”, he looks at her as part of his own honor.</p><p>The rectification is to see her not through his own “back”, but face to face, as she truly is. Then “he who has found a wife has found good”.</p>` },
        {
          h: '“I find” and “found a wife”',
          b: `<p>Scripture says both “He who has found a wife has found good” and “I find more bitter than death the woman”. The difference is in who is looking. The gaze of “I find” is subjective: a person sees his wife through his own “I”.</p><p>The “tail” in marriage seeks the satisfaction of desires. The “partzuf” seeks in the wife a complement to one’s own image and status. In both cases a person sees not her, but himself.</p>`,
        },
        {
          h: 'Seeing only good',
          b: `<p>The goal is to move from a “back to back” relationship to a “face to face” one. Then a person sees his wife as she is, without masks or projections — and sees the good in her.</p><p>Hence the numbers: “woman” is 18 times “good”, “a life of good”. The word “and He built”, with which woman was created, is four times “good”.</p>`,
        },
        {
          h: 'Sukkot: face to face',
          b: `<p>The word “and He built” is also connected to the sukkah. On Sukkot the Almighty places a person “face to face” with what stands before him, and he merits to see the true face — of his wife, of himself and of the Creator.</p>`,
        },
      ],
      reflection: 'When I look at someone close to me, do I see them or my own reflection? What one good thing will I notice in them today?',
      sourceNotes: {
        "berakhot-8a": "“Matza or motzeh?” — the source of the pair “found a wife” / “I find”.",
        "prov-18-22": "“He who found a wife found good” (טוב = 17): hence אשה = 18 × טוב.",
        "eccl-7-26": "“I find more bitter than death the woman” — the view through one’s own “I”.",
        "gen-2-21": "“And He built (ויבן)…” — ויבן = 68 = 4 × טוב, the riddle’s third step.",
      },
      takeaways: [
        "The debate moves inside the man: seeing a “tail”, he looks at his wife through desire; seeing a “partzuf”, as part of his own honor.",
        "“I find” is a view through one’s own “I”; “found a wife” is a face-to-face meeting without masks. Then “he who found a wife found good”.",
        "אשה (306) = 18 × טוב (17), and 18 = חי — “life drawn from good”; ויבן (68) = 4 × טוב.",
        "On Sukkot the Almighty places a person face to face — with his wife, with himself and with the Creator.",
      ],
    },
  ],
  final: {
    title: 'Tikun complete',
    allSolved:
      'All four riddles are solved. Face and tail, pride and passion are joined in prayer and revealed before the eyes of all Israel.',
  },
  practice:
    "This week, before praying, ask yourself: what is stronger in me right now — the wish to appear or the wish to receive? And once a day, look at someone close to you “face to face”: say out loud one good thing you see in them.",
  highlight: "Pride and desire weigh the same: both are fire (אש = 471).",
  share: ({ score, max, time, grid, allSolved, site }) => `🔥 What do pride and desire have in common?
The answer is hidden in a single number.

I’m searching for it in a gematria game based on Rabbi Yitzchak Ginsburgh’s lesson “Tikun Partzuf-Zanav”. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles: on pride and passion, on prayer, on the mask and the true face — and on husband and wife meeting face to face. Can you do better?
Play 👉 ${site}

©pnimi.org.il ©mychitas.app`,
  source:
    'Based on the lesson “Tikun Partzuf-Zanav”, “Niflaot” booklet, Bereshit ה׳תשפ״ז (Gal Einai). Full Hebrew text: pnimi.org.il',
};

export default en;
