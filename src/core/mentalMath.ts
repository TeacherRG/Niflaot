/**
 * Mental arithmetic: one technique per operation, plus a step-by-step solver
 * that explains any problem with that technique.
 *
 *  +  place values, left to right   456 + 15  → 456 + 10 = 466 → 466 + 5 = 471
 *  −  counting up (making change)    471 − 456 → 456 → 460 (+4) → 471 (+11) → 15
 *  ×  split into friendly parts      27 × 59   → 27 × 60 − 27 × 1 = 1620 − 27 = 1593
 *  :  chunking (repeated big bites)  3068 : 52 → 52 × 50 = 2600, left 468 → 52 × 9 = 468 → 59
 */

export type Op = 'add' | 'sub' | 'mul' | 'div';
export const OPS: Op[] = ['add', 'sub', 'mul', 'div'];
export const SIGN: Record<Op, string> = { add: '+', sub: '−', mul: '×', div: ':' };

export interface Problem {
  op: Op;
  a: number;
  b: number;
}

/** One line of a worked solution. `left` marks "remaining" in division. */
export type Step = { text: string } | { text: string; left: number };

export const answer = ({ op, a, b }: Problem) =>
  op === 'add' ? a + b : op === 'sub' ? a - b : op === 'mul' ? a * b : a / b;

const fmt = (n: number) => String(n);
const ceilTo = (n: number, u: number) => Math.ceil(n / u) * u;

/** Splits n into place-value parts: 3068 → [3000, 60, 8]. */
function places(n: number) {
  const parts: number[] = [];
  for (let u = 10 ** (String(n).length - 1); u >= 1; u /= 10) {
    const d = Math.floor((n % (u * 10)) / u) * u;
    if (d) parts.push(d);
  }
  return parts;
}

function solveAdd(a: number, b: number): Step[] {
  const steps: Step[] = [];
  let cur = a;
  for (const p of places(b)) {
    steps.push({ text: `${fmt(cur)} + ${fmt(p)} = ${fmt(cur + p)}` });
    cur += p;
  }
  return steps;
}

/** Count up from b to a in round jumps, then add the jumps. */
function solveSub(a: number, b: number): Step[] {
  const jumps: number[] = [];
  const path: string[] = [fmt(b)];
  let cur = b;
  while (cur < a) {
    let next: number;
    if ((a - cur < 100 && cur % 10 === 0) || (a - cur < 1000 && cur % 100 === 0)) next = a;
    else if (cur % 10 && ceilTo(cur, 10) <= a) next = ceilTo(cur, 10);
    else if (cur % 100 && ceilTo(cur, 100) <= a) next = ceilTo(cur, 100);
    else if (cur % 1000 && ceilTo(cur, 1000) <= a) next = ceilTo(cur, 1000);
    else if (a - cur < 100) next = a;
    else {
      const u = a - cur >= 1000 ? 1000 : 100;
      next = cur + Math.floor((a - cur) / u) * u;
    }
    jumps.push(next - cur);
    path.push(`${fmt(next)} (+${fmt(next - cur)})`);
    cur = next;
  }
  return [
    { text: path.join(' → ') },
    { text: jumps.length > 1 ? `${jumps.join(' + ')} = ${fmt(a - b)}` : `= ${fmt(a - b)}` },
  ];
}

function solveMul(a: number, b: number): Step[] {
  // a one-digit factor: split the other one into place values
  if (Math.min(a, b) < 10) {
    const [big, small] = a >= b ? [a, b] : [b, a];
    if (big % 10 >= 8 && big >= 10) return roundUp(big, small);
    const parts = places(big);
    if (parts.length === 1) return [{ text: `${big} × ${small} = ${big * small}` }];
    const lines: Step[] = parts.map((p) => ({ text: `${p} × ${small} = ${p * small}` }));
    lines.push({ text: `${parts.map((p) => p * small).join(' + ')} = ${big * small}` });
    return lines;
  }
  // a factor just below a round number: round it up and take the extra away
  const near = [a, b].filter((x) => x % 10 >= 8).sort((x, y) => ceilTo(x, 10) - x - (ceilTo(y, 10) - y))[0];
  if (near !== undefined) return roundUp(near, near === a ? b : a);
  // otherwise split the smaller factor into tens + units
  const [x, y] = a <= b ? [a, b] : [b, a];
  const tens = x - (x % 10);
  const units = x % 10;
  if (!units) return [{ text: `${y} × ${tens / 10} = ${(y * tens) / 10}` }, { text: `${(y * tens) / 10} × 10 = ${y * tens}` }];
  return [
    { text: `${x} = ${tens} + ${units}` },
    { text: `${y} × ${tens} = ${y * tens}` },
    { text: `${y} × ${units} = ${y * units}` },
    { text: `${y * tens} + ${y * units} = ${x * y}` },
  ];
}

function roundUp(x: number, y: number): Step[] {
  const r = ceilTo(x, 10);
  const d = r - x;
  return [
    { text: `${x} = ${r} − ${d}` },
    { text: `${y} × ${r} = ${y * r}` },
    { text: `${y} × ${d} = ${y * d}` },
    { text: `${y * r} − ${y * d} = ${x * y}` },
  ];
}

/** Take away the divisor in big round bites (×100, ×10, ×1 …), then add the bites. */
function solveDiv(a: number, b: number): Step[] {
  const steps: Step[] = [];
  const bites: number[] = [];
  let rem = a;
  for (let u = 10 ** (String(Math.floor(a / b)).length - 1); u >= 1; u /= 10) {
    const d = Math.floor(rem / (b * u));
    if (!d) continue;
    const bite = d * u;
    steps.push({ text: `${b} × ${bite} = ${b * bite}`, left: rem - b * bite });
    bites.push(bite);
    rem -= b * bite;
  }
  steps.push({ text: bites.length > 1 ? `${bites.join(' + ')} = ${a / b}` : `= ${a / b}` });
  return steps;
}

export function solve(p: Problem): Step[] {
  switch (p.op) {
    case 'add':
      return solveAdd(p.a, p.b);
    case 'sub':
      return solveSub(p.a, p.b);
    case 'mul':
      return solveMul(p.a, p.b);
    case 'div':
      return solveDiv(p.a, p.b);
  }
}

const rnd = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));

/** Random problem; level 0 easy … 2 hard. Division always comes out whole. */
export function generate(op: Op, level: number): Problem {
  switch (op) {
    case 'add':
      return [
        { op, a: rnd(12, 89), b: rnd(11, 59) },
        { op, a: rnd(101, 699), b: rnd(12, 299) },
        { op, a: rnd(1001, 4999), b: rnd(101, 999) },
      ][level];
    case 'sub': {
      const a = [rnd(30, 99), rnd(150, 999), rnd(1100, 4999)][level];
      // keep b in the upper part of a: counting up stays short
      return { op, a, b: rnd(Math.ceil(a * 0.45), a - 3) };
    }
    case 'mul':
      return [
        { op, a: rnd(12, 49), b: rnd(3, 9) },
        { op, a: rnd(12, 39), b: rnd(11, 29) },
        { op, a: rnd(23, 99), b: rnd(13, 69) },
      ][level];
    case 'div': {
      const [b, q] = [
        [rnd(3, 9), rnd(11, 39)],
        [rnd(11, 29), rnd(6, 39)],
        [rnd(13, 69), rnd(12, 99)],
      ][level];
      return { op, a: b * q, b };
    }
  }
}

/** Worked examples taken from the lessons' gematria. */
export const EXAMPLES: Record<Op, (Problem & { label: string })[]> = {
  add: [
    { op: 'add', a: 456, b: 15, label: 'פרצוף + גאוה' },
    { op: 'add', a: 412, b: 59, label: 'תאוה + זנב' },
    { op: 'add', a: 151, b: 106, label: 'מקוה + קו' },
  ],
  sub: [
    { op: 'sub', a: 471, b: 456, label: '471 − פרצוף' },
    { op: 'sub', a: 420, b: 182, label: '420 − יעקב = רחל' },
    { op: 'sub', a: 512, b: 256, label: '512 − אהרן' },
  ],
  mul: [
    { op: 'mul', a: 18, b: 17, label: '18 × טוב = אשה' },
    { op: 'mul', a: 27, b: 59, label: '27 × זנב' },
    { op: 'mul', a: 13, b: 236, label: 'אחד × ורב כח' },
  ],
  div: [
    { op: 'div', a: 3068, b: 52, label: 'יקוו המים … : 52' },
    { op: 'div', a: 1593, b: 59, label: 'ויאמר בלעם … : זנב' },
    { op: 'div', a: 306, b: 17, label: 'אשה : טוב' },
  ],
};

/** Which operation a hint like "3068 : 52." asks for (used to link hints to the technique). */
export function opInText(s: string): Op | null {
  if (/\d\s*:\s*\d/.test(s)) return 'div';
  if (/\d\s*×\s*\d/.test(s)) return 'mul';
  if (/\d\s*[−-]\s*\d/.test(s)) return 'sub';
  if (/\d\s*\+\s*\d/.test(s)) return 'add';
  return null;
}

// ───────────────────────── coach: step-by-step help for one concrete example ─────────────────────────

/** An arithmetic expression found in a hint: "5 + 10 + 400 + 5", "3068 : 52", "27 × 59", "471 − 456". */
export interface Expr {
  op: Op;
  terms: number[];
  text: string;
}

/** Finds the first arithmetic expression in a hint. Sums may have many terms; other operations two. */
export function parseExpr(s: string): Expr | null {
  const m = /\d+(?:\s*[+−×:-]\s*\d+)+/.exec(s);
  if (!m) return null;
  const terms = m[0].split(/\s*[+−×:-]\s*/).map(Number);
  const ops = [...m[0].matchAll(/[+−×:-]/g)].map((x) => x[0].replace('-', '−'));
  if (ops.every((o) => o === '+')) return { op: 'add', terms, text: m[0] };
  if (ops.length !== 1) return null;
  const op: Op = ops[0] === '−' ? 'sub' : ops[0] === '×' ? 'mul' : 'div';
  if (op === 'sub' && terms[0] < terms[1]) return null;
  if (op === 'div' && terms[0] % terms[1] !== 0) return null;
  return { op, terms, text: m[0] };
}

/** One step of the coach: a question with a numeric answer, or a line to read. */
export type CoachStep =
  | { kind: 'ask'; ask: string; answer: number; tip?: string[] }
  | { kind: 'info'; text: string };

const ASK = /^(.*?)\s*=\s*(\d+)$/;

/**
 * Turns an expression into questions that follow the technique of its operation.
 * `t.from(a, b)` and `t.left` are localized prompts for counting up and for the remainder.
 */
export function coachSteps(e: Expr, t: { from: (a: number, b: number) => string; left: (a: number, b: number) => string }): CoachStep[] {
  const steps: CoachStep[] = [];
  if (e.op === 'add') {
    let cur = e.terms[0];
    for (const x of e.terms.slice(1)) {
      // tip: the place-value way to add this term
      const tip = cur >= 10 && x >= 10 ? solve({ op: 'add', a: cur, b: x }).map((s) => s.text) : undefined;
      steps.push({ kind: 'ask', ask: `${cur} + ${x}`, answer: cur + x, tip: tip && tip.length > 1 ? tip : undefined });
      cur += x;
    }
    return steps;
  }
  const [a, b] = e.terms;
  if (e.op === 'sub') {
    // counting up: each jump is a question, then the sum of the jumps
    const path = solve({ op: 'sub', a, b })[0].text.split(' → ').map((p) => Number(p.split(' ')[0]));
    for (let i = 1; i < path.length; i++)
      steps.push({ kind: 'ask', ask: t.from(path[i - 1], path[i]), answer: path[i] - path[i - 1] });
    const jumps = path.slice(1).map((p, i) => p - path[i]);
    if (jumps.length > 1) steps.push({ kind: 'ask', ask: jumps.join(' + '), answer: a - b });
    return steps;
  }
  for (const s of solve({ op: e.op, a, b })) {
    const m = ASK.exec(s.text);
    if (!m || !/[+−×]/.test(m[1])) {
      steps.push({ kind: 'info', text: s.text }); // e.g. "59 = 60 − 1"
      continue;
    }
    steps.push({ kind: 'ask', ask: m[1], answer: Number(m[2]) });
    if ('left' in s && s.left > 0) {
      // division by chunks: after each chunk ask what is left
      const before = s.left + Number(m[2]);
      steps.push({ kind: 'ask', ask: t.left(before, Number(m[2])), answer: s.left });
    }
  }
  return steps;
}

/** Resolves a coach chain: substitutes $1, $2 … with earlier results; returns the parsed expressions. */
export function coachChain(chain: string[]): { expr: Expr; result: number }[] {
  const out: { expr: Expr; result: number }[] = [];
  for (const raw of chain) {
    const text = raw.replace(/\$(\d+)/g, (_, k) => String(out[Number(k) - 1]?.result ?? NaN));
    const expr = parseExpr(text);
    if (!expr) throw new Error(`coach: cannot parse "${raw}"`);
    const result =
      expr.op === 'add' ? expr.terms.reduce((x, y) => x + y, 0) : answer({ op: expr.op, a: expr.terms[0], b: expr.terms[1] });
    out.push({ expr, result });
  }
  return out;
}
