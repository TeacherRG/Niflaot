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
    },
  ],
  final: {
    title: 'Tikun complete',
    allSolved:
      'All four riddles are solved. Face and tail, pride and passion are joined in prayer and revealed before the eyes of all Israel.',
  },
  share: ({ score, max, time, grid, allSolved }) => `🔥 What do pride and desire have in common?
The answer is hidden in a single number.

I’m searching for it in a gematria game based on Rabbi Yitzchak Ginsburgh’s lesson “Tikun Partzuf-Zanav”. ${allSolved ? 'All four riddles solved:' : 'My path so far:'}

✦ ${score} of ${max} points · ⏱ ${time}
${grid}

Four riddles about the face, the mask and the heart. Can you do better?
Play 👉 mychitas.app

©pnimi.org.il ©mychitas.app`,
  source:
    'Based on the lesson “Tikun Partzuf-Zanav”, “Niflaot” booklet, Bereshit ה׳תשפ״ז (Gal Einai). Full Hebrew text: pnimi.org.il',
};

export default en;
