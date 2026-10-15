/**
 * «Ґемшех Самех-Вав» (часть npm run check), src/hemshech/5666.json:
 *  - у каждого отрывка en / ru / de — абзац в абзац, без пустых; иврита нет (источник — только английский);
 *  - отрывок — не дольше 10 минут чтения на каждом языке; название, «коротко», 3–4 вопроса, 3–4 разных варианта на ru, en, de;
 *  - Имена: Б-г, Г-сподь; английский и немецкий — по scripts/style-rules.ts; только текст, без HTML;
 *  - подпись переводчиков (The Neirot Foundation) и ссылка на neirot.com — условие разрешения.
 */
import book from '../src/hemshech/5666.json';
import { styleErrors } from './style-rules';
import { passageMinutes, type HsBook } from '../src/core/hemshech';

const B = book as HsBook;
const errors: string[] = [];
const err = (m: string) => errors.push(m);
const LANGS = ['ru', 'en', 'de'] as const;
const badRuName = (s: string) => /(^|[^\p{L}-])(Бог|Господ|Бож)/u.test(s);
const check = (where: string, l: (typeof LANGS)[number], s: string) => {
  if (typeof s !== 'string' || !s.trim()) return err(`${where} (${l}): пусто`);
  if (/[֐-׿]/.test(s)) err(`${where} (${l}): иврит — в этом разделе только переводы`);
  if (/[<>]|javascript:/i.test(s)) err(`${where} (${l}): только текст`);
  if (l === 'ru' && badRuName(s)) err(`${where}: Имена по-русски — Б-г, Г-сподь`);
  if (l !== 'ru') for (const e of styleErrors(l, s)) err(`${where} (${l}): ${e}`);
};

for (const l of LANGS) check('credit', l, B.credit[l]);
if (!/Neirot Foundation/.test(B.credit.en) || !/^https:\/\/www\.neirot\.com/.test(B.creditUrl)) err('credit: нужна подпись The Neirot Foundation и ссылка на neirot.com');
const ids = new Set<string>();
let n = 0;
for (const m of B.maamarim)
  for (const p of m.passages) {
    n++;
    if (ids.has(p.id)) err(`${p.id}: повтор id`);
    ids.add(p.id);
    if (!p.en.length || p.en.length !== p.ru.length || p.en.length !== p.de.length) err(`${p.id}: en ${p.en.length} / ru ${p.ru.length} / de ${p.de.length} абзацев`);
    for (const l of LANGS) {
      check(`${p.id} title`, l, p.title[l]);
      check(`${p.id} summary`, l, p.summary[l]);
      p[l].forEach((s, i) => check(`${p.id} ¶${i + 1}`, l, s));
      if (passageMinutes(p, l) > 10) err(`${p.id} (${l}): ${passageMinutes(p, l)} мин — отрывок длиннее 10 минут`);
    }
    if (p.questions.length < 3 || p.questions.length > 4) err(`${p.id}: нужно 3–4 вопроса`);
    p.questions.forEach((q, i) => {
      if (q.o.length < 3 || q.o.length > 4) err(`${p.id} вопрос ${i + 1}: нужно 3–4 варианта`);
      for (const l of LANGS) {
        check(`${p.id} вопрос ${i + 1}`, l, q.q[l]);
        q.o.forEach((o) => check(`${p.id} вопрос ${i + 1}`, l, o[l]));
        if (new Set(q.o.map((o) => o[l])).size !== q.o.length) err(`${p.id} вопрос ${i + 1} (${l}): одинаковые варианты`);
      }
    });
  }

if (errors.length) {
  console.error(`✗ Ґемшех Самех-Вав: ${errors.length} ошибок\n  ${errors.slice(0, 40).join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ Ґемшех Самех-Вав: ${B.maamarim.length} маамар(ов), ${n} отрывков — переводы, вопросы, подпись Neirot`);
