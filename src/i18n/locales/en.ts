import type { Messages } from './ru';

const en: Messages = {
  'app.title': 'Niflaot',
  'app.brandSub': 'MyChitas',
  'app.language': 'Language',

  'catalog.heading': 'Lessons',
  'catalog.intro':
    'Gematria games based on articles by Rabbi Yitzchak Ginsburgh from the “Niflaot” booklet. Count the numerical values of words, discover hidden equalities and uncover their meaning.',
  'catalog.lesson': 'Lesson {n}',
  'catalog.riddles': { one: '{n} riddle', other: '{n} riddles' },
  'catalog.progress': '{done} of {total} solved',
  'catalog.soon': 'More lessons coming soon',
  'catalog.back': '← All lessons',
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

  'footer.rights': 'All texts belong entirely to <b>Rabbi Yitzchak Ginsburgh</b>.',
  'footer.idea': 'Idea & project',
  'footer.ideaVal': 'Torah project',
  'footer.contact': 'Questions & suggestions',
  'footer.copyMail': 'Copy address',
  'footer.copied': 'Copied',
  'footer.donate': 'Support the project',
  'footer.donateText': 'Your contribution helps create new games and Torah materials.',
  'footer.fine': '© MyChitas · Texts: Rabbi Yitzchak Ginsburgh',
};

export default en;
