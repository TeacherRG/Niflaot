/**
 * «Викторина вместе» — живая викторина: ведущий показывает вопросы на большом экране, игроки отвечают с телефонов.
 * Правила игры — чистые функции без API Cloudflare: ими живёт комната на сервере (assistant/src/quiz.ts, Durable Object
 * QuizRoom), их проверяет `npm run check` (scripts/check-quiz.ts), типы видов берёт страница (src/components/QuizPage.tsx).
 *
 * Сервер — единственный судья: правильный ответ знает только он и открывает его после вопроса; ход игры меняет
 * только ведущий (секретный ключ комнаты); очки — 500 за верный ответ и до 500 за скорость. Имя — только на эту игру:
 * комната со всеми именами стирается через ROOM_TTL после создания, ничего не сохраняется в аккаунтах.
 */

export interface QuizQuestion {
  /** вопрос — обычный текст (иврит — как есть) */
  q: string;
  /** 2–4 варианта */
  o: string[];
  /** номер верного варианта */
  a: number;
  /** пояснение после ответа: стих, глава, отрывок */
  ex?: string;
  /** день отрывка (YYYY-MM-DD): до него вопрос в игру не берётся */
  d?: string;
}

/** Колода на одном языке — файл сайта `/quiz/<язык>/<id>.json` (собирает scripts/prerender.ts из src/core/quizDecks.ts). */
export interface QuizDeck {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export const QUESTION_MS = 30_000;
export const MAX_PLAYERS = 60;
export const ROOM_TTL = 6 * 3600_000;
export const MAX_QUESTIONS = 80;
/** сколько вопросов можно выбрать для игры */
export const GAME_SIZES = [6, 12, 20] as const;
/** код комнаты: 5 знаков без похожих (0/O, 1/I/L) */
export const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export const validCode = (c: unknown): c is string => typeof c === 'string' && new RegExp(`^[${CODE_CHARS}]{5}$`).test(c);
export const validPid = (p: unknown): p is string => typeof p === 'string' && /^[A-Za-z0-9]{8,32}$/.test(p);
export const validDeckId = (d: unknown): d is string => typeof d === 'string' && /^[a-z0-9-]{3,48}$/.test(d);

/** Имя игрока: 1–20 знаков, без управляющих символов и лишних пробелов. */
export function cleanName(s: unknown): string | null {
  if (typeof s !== 'string') return null;
  const n = s.replace(/[\p{C}<>]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 20).trim();
  return n || null;
}

const str = (s: unknown, max: number): s is string => typeof s === 'string' && s.trim().length > 0 && s.length <= max;

/** Колода с сайта — только правильной формы (сервер берёт её с сайта, но проверяет всё равно). */
export function validDeck(x: unknown): QuizDeck | null {
  const d = x as QuizDeck;
  if (!d || !validDeckId(d.id) || !str(d.title, 160) || !Array.isArray(d.questions)) return null;
  if (d.questions.length < 1 || d.questions.length > MAX_QUESTIONS) return null;
  for (const q of d.questions) {
    if (!q || !str(q.q, 400) || !Array.isArray(q.o) || q.o.length < 2 || q.o.length > 4) return null;
    if (!q.o.every((o) => str(o, 160)) || new Set(q.o).size !== q.o.length) return null;
    if (!Number.isInteger(q.a) || q.a < 0 || q.a >= q.o.length) return null;
    if (q.ex !== undefined && !str(q.ex, 200)) return null;
    if (q.d !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(q.d)) return null;
  }
  return { id: d.id, title: d.title, questions: d.questions.map(({ q, o, a, ex, d }) => ({ q, o, a, ...(ex ? { ex } : {}), ...(d ? { d } : {}) })) };
}

/**
 * Сегодня у ведущего (дата его устройства) — если она правдоподобна: на Земле сейчас бывает от UTC−12 до UTC+14;
 * иначе — дата по UTC.
 */
export function hostToday(claimed: unknown, now: number): string {
  const iso = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  const ok = typeof claimed === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(claimed) && claimed >= iso(now - 12 * 3600_000) && claimed <= iso(now + 14 * 3600_000);
  return ok ? (claimed as string) : iso(now);
}

/** Вопросы дней, которые у ведущего уже наступили: к завтрашнему отрывку вопросов нет. */
export const opened = (qs: QuizQuestion[], today: string) => qs.filter((q) => !q.d || q.d <= today);

/** `n` вопросов колоды, разбросанных по ней (в порядке колоды): из недели Танаха — все дни, а не только первые. */
export function pickQuestions(qs: QuizQuestion[], n: number, rnd = Math.random): QuizQuestion[] {
  if (n >= qs.length) return qs.slice();
  const idx = qs.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx
    .slice(0, n)
    .sort((a, b) => a - b)
    .map((i) => qs[i]);
}

export type Phase = 'lobby' | 'question' | 'reveal' | 'final';

export interface Player {
  name: string;
  score: number;
  /** ответы: номер вопроса → [вариант, очки] */
  ans: Record<number, [number, number]>;
}

export interface Room {
  code: string;
  hostKey: string;
  lang: string;
  deck: { id: string; title: string };
  qs: QuizQuestion[];
  phase: Phase;
  /** текущий вопрос */
  i: number;
  /** когда показан вопрос и когда он закрывается, мс */
  shown: number;
  deadline: number;
  players: Record<string, Player>;
  created: number;
}

export function newRoom(code: string, hostKey: string, lang: string, deck: QuizDeck, now: number): Room {
  return { code, hostKey, lang, deck: { id: deck.id, title: deck.title }, qs: deck.questions, phase: 'lobby', i: 0, shown: 0, deadline: 0, players: {}, created: now };
}

export const expired = (r: Room, now: number) => now >= r.created + ROOM_TTL;

/** Игрок вошёл (или вернулся с тем же pid — с теми же очками, имя можно поменять только в лобби). */
export function join(r: Room, pid: string, name: unknown): 'ok' | 'full' | 'name' | 'started' {
  const n = cleanName(name);
  if (!n) return 'name';
  const p = r.players[pid];
  if (p) {
    if (r.phase === 'lobby') p.name = n;
    return 'ok';
  }
  if (r.phase === 'final') return 'started';
  if (Object.keys(r.players).length >= MAX_PLAYERS) return 'full';
  r.players[pid] = { name: n, score: 0, ans: {} };
  return 'ok';
}

const answered = (r: Room) => Object.values(r.players).filter((p) => p.ans[r.i]).length;

/** Очки за верный ответ: 500 и до 500 за скорость. */
export const points = (r: Room, at: number) => 500 + Math.round((500 * Math.max(0, r.deadline - at)) / QUESTION_MS);

/** Ответ игрока — один раз, только пока вопрос открыт. Ответили все — вопрос закрывается сам. */
export function answer(r: Room, pid: string, i: unknown, c: unknown, now: number): boolean {
  const p = r.players[pid];
  const q = r.qs[r.i];
  if (!p || r.phase !== 'question' || i !== r.i || p.ans[r.i] || now > r.deadline) return false;
  if (!Number.isInteger(c) || (c as number) < 0 || (c as number) >= q.o.length) return false;
  const pts = c === q.a ? points(r, now) : 0;
  p.ans[r.i] = [c as number, pts];
  p.score += pts;
  if (answered(r) === Object.keys(r.players).length) reveal(r);
  return true;
}

function ask(r: Room, i: number, now: number) {
  r.phase = 'question';
  r.i = i;
  r.shown = now;
  r.deadline = now + QUESTION_MS;
}

export function reveal(r: Room) {
  if (r.phase === 'question') r.phase = 'reveal';
}

/** Команды ведущего. */
export function hostCommand(r: Room, cmd: unknown, now: number): boolean {
  if (cmd === 'start' && r.phase === 'lobby') return ask(r, 0, now), true;
  if (cmd === 'reveal' && r.phase === 'question') return reveal(r), true;
  if (cmd === 'next' && r.phase === 'reveal') {
    if (r.i + 1 < r.qs.length) ask(r, r.i + 1, now);
    else r.phase = 'final';
    return true;
  }
  if (cmd === 'end' && r.phase !== 'final') return (r.phase = 'final'), true;
  return false;
}

/** Время вопроса вышло (alarm сервера). */
export function tick(r: Room, now: number): boolean {
  if (r.phase === 'question' && now >= r.deadline) return reveal(r), true;
  return false;
}

/* ───── what the screens see ───── */

export interface ScoreRow {
  name: string;
  score: number;
}

export interface View {
  phase: Phase;
  code: string;
  title: string;
  lang: string;
  /** номер вопроса (с 0) и всего */
  i: number;
  n: number;
  q?: { q: string; o: string[]; deadline: number };
  /** после вопроса: верный вариант, сколько выбрали каждый, пояснение */
  reveal?: { a: number; counts: number[]; ex?: string };
  /** игроков и сколько уже ответили */
  players: number;
  answered: number;
  /** лобби — все имена; после вопроса и в конце — места по очкам */
  names: string[];
  top: ScoreRow[];
  /** только игроку: его имя, очки, ответ на этот вопрос и место */
  me?: { name: string; score: number; pick?: number; got?: number; place: number };
  /** часы сервера — экран считает таймер от них */
  now: number;
}

const ranking = (r: Room) => Object.entries(r.players).sort((a, b) => b[1].score - a[1].score || a[1].name.localeCompare(b[1].name));

export function view(r: Room, now: number, pid?: string): View {
  const open = r.phase === 'question' || r.phase === 'reveal';
  const q = r.qs[r.i];
  const ranked = ranking(r);
  const v: View = {
    phase: r.phase,
    code: r.code,
    title: r.deck.title,
    lang: r.lang,
    i: r.i,
    n: r.qs.length,
    players: ranked.length,
    answered: open ? answered(r) : 0,
    names: r.phase === 'lobby' ? ranked.map(([, p]) => p.name) : [],
    top: r.phase === 'reveal' || r.phase === 'final' ? ranked.slice(0, 10).map(([, p]) => ({ name: p.name, score: p.score })) : [],
    now,
  };
  if (open) v.q = { q: q.q, o: q.o, deadline: r.deadline };
  if (r.phase === 'reveal') {
    const counts = q.o.map(() => 0);
    for (const p of Object.values(r.players)) if (p.ans[r.i]) counts[p.ans[r.i][0]]++;
    v.reveal = { a: q.a, counts, ex: q.ex };
  }
  const me = pid ? r.players[pid] : undefined;
  if (me) {
    const a = me.ans[r.i];
    v.me = { name: me.name, score: me.score, place: ranked.findIndex(([k]) => k === pid) + 1 };
    if (open && a) v.me.pick = a[0];
    if (r.phase === 'reveal') v.me.got = a ? a[1] : 0;
  }
  return v;
}
