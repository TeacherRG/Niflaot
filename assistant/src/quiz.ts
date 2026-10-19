/**
 * «Викторина вместе» (src/core/quizGame.ts — правила): комната — Durable Object QuizRoom, по одному на код.
 * Ведущий и игроки подключаются по WebSocket (с «засыпанием» — hibernation: пока все думают, объект не тратит время).
 * Ход игры и очки считает только комната; правильный ответ уходит на экраны после вопроса. Через ROOM_TTL комната
 * закрывает соединения и стирает всё — имена игроков нигде не остаются.
 *
 * POST /quiz/new {deck, lang, n} → {code, key}: колода берётся с сайта (`SITE_URL/quiz/<lang>/<deck>.json`),
 * а не из запроса — чужие тексты в комнату не попадут. GET /quiz/ws/<CODE>?role=host&key=… | ?role=player&pid=…
 */
import { DurableObject } from 'cloudflare:workers';
import {
  CODE_CHARS,
  GAME_SIZES,
  expired,
  hostCommand,
  hostToday,
  opened,
  join,
  newRoom,
  pickQuestions,
  answer,
  tick,
  validCode,
  validDeck,
  validDeckId,
  validPid,
  view,
  ROOM_TTL,
  type Room,
} from '../../src/core/quizGame';

const LANGS = ['ru', 'en', 'de'];

export interface QuizEnv {
  SITE_URL?: string;
  QUIZ: DurableObjectNamespace<QuizRoom>;
}

interface Tag {
  role: 'host' | 'player';
  pid?: string;
}

const randomString = (n: number, chars: string) => {
  const b = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(b, (x) => chars[x % chars.length]).join('');
};

export class QuizRoom extends DurableObject<QuizEnv> {
  private room?: Room | null;

  private async load(): Promise<Room | null> {
    if (this.room === undefined) this.room = (await this.ctx.storage.get<Room>('room')) ?? null;
    return this.room;
  }

  private async save() {
    if (this.room) await this.ctx.storage.put('room', this.room);
    // the next alarm: the end of the question or the end of the room's life
    const r = this.room;
    if (!r) return;
    const at = r.phase === 'question' ? Math.min(r.deadline, r.created + ROOM_TTL) : r.created + ROOM_TTL;
    if ((await this.ctx.storage.getAlarm()) !== at) await this.ctx.storage.setAlarm(at);
  }

  private broadcast() {
    const r = this.room;
    if (!r) return;
    const now = Date.now();
    for (const ws of this.ctx.getWebSockets()) {
      const tag = ws.deserializeAttachment() as Tag | null;
      try {
        ws.send(JSON.stringify(view(r, now, tag?.role === 'player' ? tag.pid : undefined)));
      } catch {}
    }
  }

  private async wipe() {
    for (const ws of this.ctx.getWebSockets())
      try {
        ws.close(4000, 'room closed');
      } catch {}
    this.room = null;
    await this.ctx.storage.deleteAll();
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const now = Date.now();
    if (url.pathname === '/init' && req.method === 'POST') {
      const r = await this.load();
      if (r && !expired(r, now)) return new Response('busy', { status: 409 });
      if (r) await this.wipe();
      const { code, key, lang, deck } = (await req.json()) as { code: string; key: string; lang: string; deck: unknown };
      const d = validDeck(deck);
      if (!d) return new Response('bad deck', { status: 400 });
      this.room = newRoom(code, key, lang, d, now);
      await this.save();
      return new Response('ok');
    }
    if (url.pathname === '/ws') {
      if (req.headers.get('Upgrade') !== 'websocket') return new Response('websocket only', { status: 426 });
      const r = await this.load();
      if (!r || expired(r, now)) return new Response('no room', { status: 404 });
      const role = url.searchParams.get('role');
      let tag: Tag;
      if (role === 'host' && url.searchParams.get('key') === r.hostKey) tag = { role: 'host' };
      else if (role === 'player' && validPid(url.searchParams.get('pid'))) tag = { role: 'player', pid: url.searchParams.get('pid')! };
      else return new Response('forbidden', { status: 403 });
      const pair = new WebSocketPair();
      this.ctx.acceptWebSocket(pair[1], [tag.role]);
      pair[1].serializeAttachment(tag);
      pair[1].send(JSON.stringify(view(r, now, tag.pid)));
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    return new Response('not found', { status: 404 });
  }

  async webSocketMessage(ws: WebSocket, msg: string | ArrayBuffer) {
    const r = await this.load();
    if (!r || typeof msg !== 'string' || msg.length > 512) return;
    const tag = ws.deserializeAttachment() as Tag | null;
    let m: { t?: string; name?: unknown; i?: unknown; c?: unknown; cmd?: unknown };
    try {
      m = JSON.parse(msg);
    } catch {
      return;
    }
    const now = Date.now();
    let changed = false;
    if (tag?.role === 'host' && m.t === 'cmd') changed = hostCommand(r, m.cmd, now);
    else if (tag?.role === 'player' && tag.pid) {
      if (m.t === 'hello') {
        const res = join(r, tag.pid, m.name);
        if (res !== 'ok') ws.send(JSON.stringify({ error: res }));
        changed = res === 'ok';
      } else if (m.t === 'answer') changed = answer(r, tag.pid, m.i, m.c, now);
    }
    if (!changed) return;
    await this.save();
    this.broadcast();
  }

  async webSocketClose(ws: WebSocket, code: number) {
    try {
      ws.close(code, 'bye');
    } catch {}
  }

  async alarm() {
    const r = await this.load();
    if (!r) return;
    const now = Date.now();
    if (expired(r, now)) return this.wipe();
    if (tick(r, now)) this.broadcast();
    await this.save();
  }
}

/** /quiz/new and /quiz/ws/<CODE> — called from the worker after the origin check. */
export async function quizRoute(req: Request, env: QuizEnv, path: string): Promise<Response> {
  const ws = /^\/ws\/([A-Z0-9]{5})$/.exec(path);
  if (ws) {
    if (!validCode(ws[1])) return new Response('Not found', { status: 404 });
    const url = new URL(req.url);
    return env.QUIZ.get(env.QUIZ.idFromName(ws[1])).fetch(new Request(`https://quiz/ws${url.search}`, req));
  }
  if (path !== '/new' || req.method !== 'POST') return new Response('Not found', { status: 404 });
  const raw = await req.text().catch(() => '');
  if (raw.length > 512) return new Response('Too large', { status: 413 });
  let body: { deck?: unknown; lang?: unknown; n?: unknown; today?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response('Bad request', { status: 400 });
  }
  const lang = LANGS.includes(body.lang as string) ? (body.lang as string) : 'ru';
  if (!validDeckId(body.deck)) return new Response('Bad deck', { status: 400 });
  const res = await fetch(`${(env.SITE_URL ?? 'https://niflaot.mychitas.app').replace(/\/$/, '')}/quiz/${lang}/${body.deck}.json`, {
    cf: { cacheTtl: 300 },
  } as RequestInit);
  const deck = res.ok ? validDeck(await res.json().catch(() => null)) : null;
  if (deck) deck.questions = opened(deck.questions, hostToday(body.today, Date.now()));
  if (!deck?.questions.length) return new Response('No such deck', { status: 404 });
  const n = GAME_SIZES.includes(body.n as 6) ? (body.n as number) : 12;
  deck.questions = pickQuestions(deck.questions, n);
  const key = randomString(24, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
  for (let k = 0; k < 6; k++) {
    const code = randomString(5, CODE_CHARS);
    const r = await env.QUIZ.get(env.QUIZ.idFromName(code)).fetch('https://quiz/init', {
      method: 'POST',
      body: JSON.stringify({ code, key, lang, deck }),
    });
    if (r.ok) return new Response(JSON.stringify({ code, key }), { headers: { 'Content-Type': 'application/json' } });
    if (r.status !== 409) return new Response('Error', { status: 500 });
  }
  return new Response('Busy', { status: 503 });
}
