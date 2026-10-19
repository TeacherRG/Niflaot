/**
 * «Викторина вместе» (part of `npm run check`): the rules of a room (src/core/quizGame.ts) — joining, one answer,
 * points, the question closes when everyone answered, only the host moves the game, the right answer is not on the
 * screens before the reveal; and the decks of the site (src/core/quizDecks.ts) — every deck is one the server accepts,
 * the same questions and right answers in every language, the right answer not always in one place.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { QUESTION_MS, hostToday, opened, answer, cleanName, hostCommand, join, newRoom, pickQuestions, tick, validDeck, view, type QuizDeck } from '../src/core/quizGame';
import { buildDecks, deckProblems, QUIZ_LANGS, type DayQuiz } from '../src/core/quizDecks';
import ru from '../src/i18n/locales/ru';
import en from '../src/i18n/locales/en';
import de from '../src/i18n/locales/de';

const errors: string[] = [];
const err = (s: string) => errors.push(s);

/* ───── the rules ───── */
const deck: QuizDeck = {
  id: 'test-deck',
  title: 'Test',
  questions: [
    { q: 'One?', o: ['a', 'b', 'c'], a: 1, ex: 'x' },
    { q: 'Two?', o: ['a', 'b'], a: 0 },
  ],
};
if (!validDeck(deck)) err('quiz: a good deck is refused');
if (validDeck({ ...deck, questions: [{ q: 'Q', o: ['a', 'a'], a: 0 }] })) err('quiz: same options accepted');
if (validDeck({ ...deck, questions: [{ q: 'Q', o: ['a', 'b'], a: 2 }] })) err('quiz: answer out of range accepted');
if (validDeck({ ...deck, id: '../x' })) err('quiz: a bad deck id accepted');
if (cleanName('  <b>Dov\u0000id</b>   the   great and wonderful ') !== 'bDovid/b the great a') err(`quiz: name cleaning «${cleanName('  <b>Dov\u0000id</b>   the   great and wonderful ')}»`);
if (cleanName('   ') !== null) err('quiz: an empty name accepted');

const t0 = 1_000_000;
const r = newRoom('ABCDE', 'key', 'ru', deck, t0);
if (join(r, 'p1aaaaaaaa', 'Dov') !== 'ok' || join(r, 'p2aaaaaaaa', 'Sara') !== 'ok') err('quiz: join');
if (hostCommand(r, 'next', t0)) err('quiz: «next» in the lobby');
if (!hostCommand(r, 'start', t0) || r.phase !== 'question') err('quiz: start');
const v = view(r, t0, 'p1aaaaaaaa');
if (v.reveal || JSON.stringify(v).includes('"a":1')) err('quiz: the right answer is on the screen before the reveal');
if (!answer(r, 'p1aaaaaaaa', 0, 1, t0)) err('quiz: a right answer refused');
if (answer(r, 'p1aaaaaaaa', 0, 2, t0 + 10)) err('quiz: a second answer accepted');
if (r.players.p1aaaaaaaa.score !== 1000) err(`quiz: points for an instant answer ${r.players.p1aaaaaaaa.score}`);
if (answer(r, 'nobody0000', 0, 1, t0)) err('quiz: an answer from an unknown player');
if (!answer(r, 'p2aaaaaaaa', 0, 0, t0 + QUESTION_MS / 2) || r.phase !== 'reveal') err('quiz: everyone answered — the question must close');
if (r.players.p2aaaaaaaa.score !== 0) err('quiz: points for a wrong answer');
const rv = view(r, t0, 'p2aaaaaaaa');
if (rv.reveal?.a !== 1 || rv.reveal.counts.join() !== '1,1,0' || rv.me?.got !== 0 || rv.me.place !== 2) err(`quiz: reveal view ${JSON.stringify(rv)}`);
hostCommand(r, 'next', t0 + 20_000);
if (r.phase !== 'question' || r.i !== 1) err('quiz: next question');
answer(r, 'p1aaaaaaaa', 1, 0, t0 + 20_000 + QUESTION_MS / 2);
if (r.players.p1aaaaaaaa.score !== 1750) err(`quiz: points at half time ${r.players.p1aaaaaaaa.score}`);
if (tick(r, t0 + 20_000 + QUESTION_MS - 1) || !tick(r, t0 + 20_000 + QUESTION_MS) || r.phase !== 'reveal') err('quiz: the time is up');
if (answer(r, 'p2aaaaaaaa', 1, 0, t0 + 20_000 + QUESTION_MS + 1)) err('quiz: an answer after the time');
hostCommand(r, 'next', t0 + 60_000);
if (r.phase !== 'final' || view(r, t0).top[0].name !== 'Dov') err('quiz: final');
if (join(r, 'p3aaaaaaaa', 'Late') !== 'started') err('quiz: joining a finished game');
if (pickQuestions(deck.questions, 6).length !== 2 || pickQuestions([...Array(30).keys()].map((k) => ({ q: `${k}`, o: ['a', 'b'], a: 0 })), 12).length !== 12)
  err('quiz: picking questions');

const dated = [{ q: 'a', o: ['1', '2'], a: 0, d: '2026-10-20' }, { q: 'b', o: ['1', '2'], a: 0 }];
const at = Date.parse('2026-10-19T12:00:00Z');
if (opened(dated, hostToday('2026-10-19', at)).length !== 1 || opened(dated, hostToday('2026-10-20', at)).length !== 2)
  err('quiz: questions of a day that has not begun are taken');
if (hostToday('2026-10-25', at) !== '2026-10-19' || hostToday('x', at) !== '2026-10-19') err('quiz: an unlikely date of the host is taken');

/* ───── the decks of the site ───── */
const dir = 'src/tanakh/quiz';
const tanakh = Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => [f.slice(0, -5), JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')) as DayQuiz]));
const { index, decks } = buildDecks(tanakh, { ru, en, de });
for (const p of deckProblems(decks)) err(`quiz deck ${p}: the server would refuse it`);
for (const info of index) {
  const per = QUIZ_LANGS.map((l) => decks[l].find((d) => d.id === info.id)!);
  if (per.some((d) => !d || d.questions.length !== info.n)) err(`quiz deck ${info.id}: not the same questions in every language`);
  else if (per.some((d) => d.questions.some((q, k) => q.a !== per[0].questions[k].a || q.o.length !== per[0].questions[k].o.length)))
    err(`quiz deck ${info.id}: the right answers differ between languages`);
  const at = new Set(per[0]?.questions.map((q) => q.a));
  if (info.n >= 6 && at.size < 2) err(`quiz deck ${info.id}: the right answer is always in one place`);
  if (/<|&\w+;/.test(JSON.stringify(per))) err(`quiz deck ${info.id}: HTML left in the text`);
}
if (!index.some((d) => d.kind === 'torah')) err('quiz: no Torah deck');

if (errors.length) {
  console.error(errors.map((e) => '✗ ' + e).join('\n'));
  process.exit(1);
}
console.log(`✓ Викторина вместе: правила комнаты, ${index.length} колод (${index.map((d) => d.n).reduce((a, b) => a + b, 0)} вопросов) — на ru/en/de, сервер их примет`);
