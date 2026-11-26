/**
 * Multiplayer dreidel rooms. The server is the only source of randomness and coin accounting.
 * POST /dreidel/new -> {code,key}; GET /dreidel/ws/<CODE>?role=host&key=... | ?role=player&pid=...
 */
import { DurableObject } from 'cloudflare:workers';
import { CODE_CHARS, cleanName, validCode, validPid, ROOM_TTL } from '../../src/core/quizGame';
import type { Accounts } from './accounts';

const FACES = ['נ', 'ג', 'ה', 'ש'] as const;
type Face = (typeof FACES)[number];
type Player = { pid: string; name: string; coins: number; accountId?: string; escrowed?: boolean };
type Spin = { id: number; pid: string; name: string; face: Face; delta: number; at: number };
type Room = {
  code: string;
  hostKey: string;
  created: number;
  phase: 'lobby' | 'playing' | 'final';
  players: Player[];
  turn: number;
  pot: number;
  spinId: number;
  last?: Spin;
  settled?: boolean;
};
type Tag = { role: 'host' } | { role: 'player'; pid: string; account?: boolean };

export interface DreidelEnv {
  DREIDEL: DurableObjectNamespace<DreidelRoom>;
  ACCOUNTS: DurableObjectNamespace<Accounts>;
  DREIDEL_INTERNAL_SECRET?: string;
}

const randomString = (n: number, chars: string) => {
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
};

function publicView(room: Room, now: number, pid?: string) {
  const current = room.players[room.turn];
  const me = pid ? room.players.find((p) => p.pid === pid) : undefined;
  return {
    code: room.code,
    phase: room.phase,
    // Never publish player IDs: possession of a pid authorizes that player's WebSocket actions.
    players: room.players.map(({ name, coins }) => ({ name, coins })),
    count: room.players.length,
    pot: room.pot,
    turnName: current?.name ?? null,
    last: room.last ? { id: room.last.id, name: room.last.name, face: room.last.face, delta: room.last.delta, at: room.last.at } : null,
    now,
    me: me ? { name: me.name, coins: me.coins, canSpin: room.phase === 'playing' && current?.pid === me.pid } : null,
  };
}

function finish(room: Room) {
  const solvent = room.players.filter((p) => p.coins > 0);
  const recipients = solvent.length === 1 ? solvent : room.players;
  if (recipients.length && room.pot > 0) {
    const share = Math.floor(room.pot / recipients.length);
    let remainder = room.pot % recipients.length;
    for (const p of recipients) {
      const extra = remainder > 0 ? 1 : 0;
      p.coins += share + extra;
      remainder -= extra;
    }
  }
  room.pot = 0;
  room.phase = 'final';
  room.settled = false;
}

function advance(room: Room) {
  room.turn = (room.turn + 1) % room.players.length;
  const solvent = room.players.filter((p) => p.coins > 0).length;
  if (solvent <= 1) {
    finish(room);
    return;
  }
  if (room.pot === 0) {
    for (const p of room.players) {
      if (p.coins > 0) {
        p.coins -= 1;
        room.pot += 1;
      }
    }
    if (room.pot === 0) finish(room);
  }
}

function spin(room: Room, pid: string, now: number) {
  if (room.phase !== 'playing' || room.players[room.turn]?.pid !== pid) return false;
  const player = room.players[room.turn];
  const random = new Uint32Array(1);
  crypto.getRandomValues(random);
  const face = FACES[random[0] % FACES.length];
  let delta = 0;
  if (face === 'ג') {
    delta = room.pot;
    player.coins += room.pot;
    room.pot = 0;
  } else if (face === 'ה') {
    delta = Math.ceil(room.pot / 2);
    player.coins += delta;
    room.pot -= delta;
  } else if (face === 'ש' && player.coins > 0) {
    player.coins -= 1;
    room.pot += 1;
    delta = -1;
  }
  room.last = { id: ++room.spinId, pid, name: player.name, face, delta, at: now };
  advance(room);
  return true;
}

export class DreidelRoom extends DurableObject<DreidelEnv> {
  private room?: Room | null;

  private async load(): Promise<Room | null> {
    if (this.room === undefined) this.room = (await this.ctx.storage.get<Room>('room')) ?? null;
    return this.room;
  }

  private async save() {
    if (this.room) await this.ctx.storage.put('room', this.room);
    const room = this.room;
    if (room) {
      const at = room.phase === 'final' && room.settled === false ? Date.now() + 60_000 : room.created + ROOM_TTL;
      if ((await this.ctx.storage.getAlarm()) !== at) await this.ctx.storage.setAlarm(at);
    }
  }

  private broadcast() {
    const room = this.room;
    if (!room) return;
    const now = Date.now();
    for (const ws of this.ctx.getWebSockets()) {
      const tag = ws.deserializeAttachment() as Tag | null;
      try {
        ws.send(JSON.stringify(publicView(room, now, tag?.role === 'player' ? tag.pid : undefined)));
      } catch {}
    }
  }

  private async wipe() {
    const room = await this.load();
    if (room?.phase === 'playing') finish(room);
    if (room?.phase === 'final' && !(await this.settleRoom(room))) {
      await this.ctx.storage.setAlarm(Date.now() + 60_000);
      return;
    }
    for (const ws of this.ctx.getWebSockets()) {
      try { ws.close(4000, 'room closed'); } catch {}
    }
    this.room = null;
    await this.ctx.storage.deleteAll();
  }

  private async accountCall(path: 'consume' | 'reserve' | 'settle', body: object): Promise<any | null> {
    const secret = this.env.DREIDEL_INTERNAL_SECRET;
    if (!secret) return null;
    try {
      const stub = this.env.ACCOUNTS.get(this.env.ACCOUNTS.idFromName('main'));
      const response = await stub.fetch(`https://accounts/internal/dreidel/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Dreidel-Internal': secret },
        body: JSON.stringify(body),
      });
      return response.ok ? await response.json() : null;
    } catch { return null; }
  }

  private async startRoom(room: Room): Promise<boolean> {
    if (room.phase !== 'lobby' || room.players.length < 2) return false;
    const accounts = room.players.filter((p) => p.accountId);
    if (accounts.length && !this.env.DREIDEL_INTERNAL_SECRET) return false;
    for (const p of accounts) {
      const result = await this.accountCall('reserve', { userId: p.accountId, room: room.code });
      if (!result?.ok) {
        let pending = false;
        // A response may be lost after a successful reserve; settle all account players idempotently.
        for (const player of accounts) {
          const release = await this.accountCall('settle', { userId: player.accountId, room: room.code, payout: 10 });
          if (!release?.ok) { player.escrowed = true; pending = true; }
          else player.escrowed = false;
        }
        if (pending) {
          room.players.forEach((player) => { player.coins = 10; });
          room.pot = 0;
          room.phase = 'final';
          room.settled = false;
          await this.save();
        }
        return false;
      }
      p.escrowed = true;
    }
    room.players.forEach((p) => (p.coins = 10));
    room.players.forEach((p) => (p.coins -= 1));
    room.pot = room.players.length;
    room.turn = 0;
    room.last = undefined;
    room.spinId = 0;
    room.phase = 'playing';
    room.settled = false;
    return true;
  }

  private async settleRoom(room: Room): Promise<boolean> {
    if (room.phase !== 'final') return true;
    for (const p of room.players) {
      if (!p.accountId || !p.escrowed) continue;
      const result = await this.accountCall('settle', { userId: p.accountId, room: room.code, payout: p.coins });
      if (!result?.ok) return false;
      p.escrowed = false;
    }
    room.settled = true;
    return true;
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const now = Date.now();
    if (url.pathname === '/init' && req.method === 'POST') {
      const existing = await this.load();
      if (existing && now - existing.created < ROOM_TTL) return new Response('busy', { status: 409 });
      if (existing) await this.wipe();
      const body = await req.json() as { code?: string; key?: string };
      if (!validCode(body.code) || typeof body.key !== 'string' || body.key.length < 24)
        return new Response('bad room', { status: 400 });
      this.room = { code: body.code, hostKey: body.key, created: now, phase: 'lobby', players: [], turn: 0, pot: 0, spinId: 0 };
      await this.save();
      return new Response('ok');
    }
    if (url.pathname === '/ws') {
      if (req.headers.get('Upgrade') !== 'websocket') return new Response('websocket only', { status: 426 });
      const room = await this.load();
      if (!room || now - room.created >= ROOM_TTL) return new Response('no room', { status: 404 });
      const role = url.searchParams.get('role');
      let tag: Tag;
      if (role === 'host' && url.searchParams.get('key') === room.hostKey) tag = { role: 'host' };
      else if (role === 'player' && url.searchParams.get('ticket')) {
        const identity = await this.accountCall('consume', { ticket: url.searchParams.get('ticket'), room: room.code });
        if (!identity?.ok || typeof identity.userId !== 'string' || !/^[A-Za-z0-9_-]{8,32}$/.test(identity.userId)) return new Response('forbidden', { status: 403 });
        tag = { role: 'player', pid: identity.userId, account: true };
      } else if (role === 'player' && validPid(url.searchParams.get('pid'))) tag = { role: 'player', pid: url.searchParams.get('pid')! };
      else return new Response('forbidden', { status: 403 });
      const pair = new WebSocketPair();
      this.ctx.acceptWebSocket(pair[1], [tag.role]);
      pair[1].serializeAttachment(tag);
      pair[1].send(JSON.stringify(publicView(room, now, tag.role === 'player' ? tag.pid : undefined)));
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    return new Response('not found', { status: 404 });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    const room = await this.load();
    if (!room || typeof message !== 'string' || message.length > 512) return;
    const tag = ws.deserializeAttachment() as Tag | null;
    let m: { t?: string; name?: unknown };
    try { m = JSON.parse(message); } catch { return; }
    if (!m || typeof m !== 'object') return;
    const now = Date.now();
    let changed = false;
    if (tag?.role === 'host') {
      if (m.t === 'start') {
        changed = await this.startRoom(room);
        if (!changed) {
          ws.send(JSON.stringify({ error: this.env.DREIDEL_INTERNAL_SECRET ? 'balance' : 'escrow' }));
          if (room.phase === 'final') changed = true;
        }
      }
      if (m.t === 'end' && room.phase === 'playing') { finish(room); changed = true; }
    } else if (tag?.role === 'player' && (tag.account ? /^[A-Za-z0-9_-]{8,32}$/.test(tag.pid) : validPid(tag.pid))) {
      if (m.t === 'hello') {
        const name = cleanName(m.name);
        if (!name) { ws.send(JSON.stringify({ error: 'name' })); return; }
        const existing = room.players.find((p) => p.pid === tag.pid);
        if (existing) {
          if (room.phase === 'lobby') existing.name = name;
          changed = true;
        } else if (room.phase === 'lobby' && room.players.length < 30) {
          room.players.push({ pid: tag.pid, name, coins: 10, ...(tag.account ? { accountId: tag.pid } : {}) });
          changed = true;
        } else {
          ws.send(JSON.stringify({ error: room.phase === 'lobby' ? 'full' : 'started' }));
          return;
        }
      } else if (m.t === 'spin') changed = spin(room, tag.pid, now);
    }
    if (changed) {
      if (room.phase === 'final') await this.settleRoom(room);
      await this.save();
      this.broadcast();
    }
  }

  async webSocketClose(ws: WebSocket, code: number) {
    try { ws.close(code, 'bye'); } catch {}
  }

  async alarm() {
    const room = await this.load();
    if (!room || Date.now() - room.created < ROOM_TTL) return;
    if (room.phase === 'playing') finish(room);
    if (room.phase === 'final' && !(await this.settleRoom(room))) {
      await this.ctx.storage.setAlarm(Date.now() + 60_000);
      return;
    }
    await this.wipe();
  }
}

export async function dreidelRoute(req: Request, env: DreidelEnv, path: string): Promise<Response> {
  const ws = /^\/ws\/([A-Z0-9]{5})$/.exec(path);
  if (ws) {
    if (!validCode(ws[1])) return new Response('Not found', { status: 404 });
    const url = new URL(req.url);
    return env.DREIDEL.get(env.DREIDEL.idFromName(ws[1])).fetch(new Request('https://dreidel/ws' + url.search, req));
  }
  if (path !== '/new' || req.method !== 'POST') return new Response('Not found', { status: 404 });
  const key = randomString(32, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
  for (let i = 0; i < 8; i++) {
    const code = randomString(5, CODE_CHARS);
    const response = await env.DREIDEL.get(env.DREIDEL.idFromName(code)).fetch('https://dreidel/init', {
      method: 'POST',
      body: JSON.stringify({ code, key }),
    });
    if (response.ok) return Response.json({ code, key });
    if (response.status !== 409) return new Response('Error', { status: 500 });
  }
  return new Response('Busy', { status: 503 });
}
