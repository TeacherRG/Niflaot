import type { Messages } from './ru';

const en: Messages = {
  'app.title': 'Niflaot',
  'app.brandSub': 'MyChitas',
  'app.language': 'Language',

  'menu.open': 'Open menu',
  'menu.close': 'Close',
  'menu.lessons': 'Lessons',
  'menu.allLessons': 'All lessons',
  'lang.choose': 'Interface language',
  'hero.howTo': 'How to play',

  'help.title': 'How to play',
  'help.body':
    '<ol><li><b>Read the riddle.</b> Each riddle is a short passage from the lesson and a few Hebrew words.</li><li><b>Tap a word card</b> to reveal its letters and their numerical values. Adding them up is up to you.</li><li><b>Answer step by step:</b> type a number or pick an option. Each step unlocks after the previous one.</li><li><b>Stuck?</b> Tap “Hint” — the answer stays yours, but earns fewer points.</li><li><b>Once solved</b>, the solution, a retelling of the lesson and a question for reflection unlock.</li></ol><p>The calculator at the bottom of the page computes the gematria of any word. Progress and notes are stored only on this device.</p>',
  'help.scoring': 'Points',
  'help.table': 'Letter values',
  'help.finals': 'Final letters ך ם ן ף ץ have the same values as regular ones.',
  'help.go': 'Got it, let’s play',

  'about.title': 'About the project',
  'about.body':
    '<p><b>Niflaot</b> is a series of gematria games based on articles by Rabbi Yitzchak Ginsburgh from the “Niflaot” booklet (Gal Einai). You count the numerical values of words, discover hidden equalities and, step by step, uncover the meaning behind them.</p><h4>Who it is for</h4><ul><li><b>Parents</b> — to learn Torah together with their children through play.</li><li><b>Chitas readers</b> — as a continuation of daily study.</li><li><b>Young prodigies</b> — those who love numbers, riddles and depth.</li><li><b>Everyone</b> who wants to see wonders — <i>niflaot</i> — in their own life.</li></ul><h4>Goals</h4><ul><li><b>Torah study.</b> Not passive reading but a living search: you find each equality yourself, and so the meaning stays with you.</li><li><b>Rectifying the traits of the soul.</b> Each lesson addresses specific traits — pride, desire, anger, love — and leads from understanding to working on oneself.</li></ul><h4>Objectives</h4><ul><li>Make Rabbi Ginsburgh’s deep articles accessible through play: riddle, solution, retelling of the lesson.</li><li>Turn knowledge into personal work: after every riddle — a question for yourself and room for your notes.</li><li>Release new lessons regularly and translate them into more languages.</li></ul><p>The full Hebrew text of the articles is on pnimi.org.il. All texts belong entirely to Rabbi Yitzchak Ginsburgh. Idea and production — the <a href="https://mychitas.app" target="_blank" rel="noopener">mychitas.app</a> Torah project.</p>',

  'catalog.heading': 'Lessons',
  'catalog.intro':
    'Gematria games based on articles by Rabbi Yitzchak Ginsburgh from the “Niflaot” booklet. Count the numerical values of words, discover hidden equalities and uncover their meaning.',
  'catalog.lesson': 'Lesson {n}',
  'catalog.riddles': { one: '{n} riddle', other: '{n} riddles' },
  'catalog.progress': '{done} of {total} solved',
  'catalog.soon': 'More lessons coming soon',
  'catalog.fallback': 'This lesson has not been translated into the selected language yet — showing the Russian text.',

  'top.timer': 'Play time',
  'top.points': { one: '{n} point', other: '{n} points' },
  'top.riddle': 'Riddle {n}',
  'top.summary': 'Summary',

  'rules.first': 'right on the first try — <b>10</b>',
  'rules.next': 'second try — <b>5</b>, third — <b>2</b>',
  'rules.hint': 'after a hint — <b>3</b>',
  'rules.limit': 'mistake limit: 3 for numbers, 2 for choices — then the answer is revealed for <b>0</b>',
  'rules.lesson': 'the lesson unlocks once solved',

  'riddle.of': 'Riddle {n} of {total}',
  'riddle.locked': '📜 The lesson for this riddle unlocks once you solve it',
  'riddle.sumYourself': 'add it up yourself',
  'riddle.answer': 'Answer',
  'riddle.check': 'Check',
  'riddle.hint': 'Hint',
  'riddle.hintPrefix': 'Hint:',
  'riddle.correct': 'Correct! +{p}',
  'riddle.outOfTries': 'Out of tries. The answer:',
  'riddle.zeroPoints': '0 points',
  'riddle.triesLeft': 'Tries left: {n}.',
  'riddle.wrongNum': 'That doesn’t add up. Check the letter values and try again.',
  'riddle.wrongChoice': 'Not that one. Look at this option’s number and pick another.',
  'riddle.prev': '← Back',
  'riddle.next': 'Next riddle →',
  'riddle.toSummary': 'To the summary →',

  'lessons.title': 'Lesson unlocked',
  'lessons.sub': '· a retelling in our own words',
  'refl.title': 'A question for yourself',
  'refl.sub': '· there is no right answer',
  'refl.placeholder': 'Write down a thought. It stays only on this device.',

  'final.inProgress': ' · game in progress',
  'final.partial': 'Riddles solved: {done} of {total}. Return to the rest using the numbers at the top.',
  'final.share': 'Share your result',
  'final.copy': 'Copy text',
  'final.copied': 'Copied ✓',
  'final.selected': 'Text selected — press “Copy”',
  'final.legend': '🟩 first try · 🟨 second try or with a hint · 🟥 answer revealed · ⬜ unsolved',
  'final.restart': 'Start over',
  'final.confirm': 'Erase points, time and notes?',
  'final.no': 'No',
  'final.yes': 'Yes, start over',

  'calc.title': 'Gematria calculator',
  'calc.sub':
    'Type a Hebrew word or use the on-screen keyboard. If its number matches a word from the game, you will see it.',
  'calc.input': 'Hebrew word',
  'calc.equals': 'Equals:',
  'calc.noMatch': 'No matches among the game’s words',
  'calc.space': 'space',
  'calc.backspace': 'delete',

  'footer.contact': 'Questions & suggestions',
  'footer.donate': 'Support the project',
  'footer.fine': '© mychitas.app · Texts: Rabbi Yitzchak Ginsburgh',
};

export default en;
