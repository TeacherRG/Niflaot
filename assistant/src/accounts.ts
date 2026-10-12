/**
 * Accounts of the site («Войти», src/core/account.ts on the site). A guest needs none of this — everything works
 * without an account; an account keeps the progress on every device, puts the player on the leaderboards, into
 * classes, and counts the questions to the AI teacher.
 *
 * One Durable Object `Accounts` (SQLite). Login: a 6-digit code to the email (Resend, secret RESEND_API_KEY;
 * without it registration is off — `/account/config` says so). Codes and session tokens are kept only as SHA-256
 * hashes. A child under 14 (Austria / GDPR art. 8): the account stays **pending** — nothing synced, not on the
 * boards, not in classes — until a parent confirms by the link sent to the parent's email.
 * Kept per account: email, nickname, age group (14+ / under 14), parent's email (under 14), language, the synced
 * progress (src/core/sync.ts), its summary, classes, the count of AI questions. «Удалить аккаунт» deletes all of it.
 */
import { DurableObject } from 'cloudflare:workers';
import { validEmail, validNick } from './rules';
import { mergeSnapshots, summarize, type Snapshot } from '../../src/core/sync';

export interface MailEnv {
  RESEND_API_KEY?: string;
  /** e.g. «Нифлаот <noreply@mychitas.app>» — the domain must be verified at Resend */
  MAIL_FROM?: string;
  /** the site, for links in the emails */
  SITE_URL?: string;
  /** local development only (`wrangler dev --var DEV_CODES:1`): codes go to the log instead of an email */
  DEV_CODES?: string;
}

const CODE_TTL = 10 * 60_000;
const CODE_TRIES = 5;
const SESSION_TTL = 180 * 864e5;
const MAX_PROGRESS = 256 * 1024;
/** the parent's consent email: not more often than once in 2 minutes and 5 times a day per account */
const CONSENT_GAP = 2 * 60_000;
const CONSENT_PER_DAY = 5;
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const LANGS = ['ru', 'en', 'de'] as const;
type Lang = (typeof LANGS)[number];

const enc = new TextEncoder();
const b64url = (buf: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const sha = async (s: string) => b64url(await crypto.subtle.digest('SHA-256', enc.encode(s)));
const random = (n: number) => b64url(crypto.getRandomValues(new Uint8Array(n)));
const json = (o: unknown, status = 200) => Response.json(o, { status });
const fail = (error: string, status = 400) => json({ error }, status);

const lang = (l: unknown): Lang => (LANGS.includes(l as Lang) ? (l as Lang) : 'ru');
const clamp = (n: unknown, max: number) => (Number.isFinite(n) ? Math.max(0, Math.min(max, Math.floor(n as number))) : 0);

type User = {
  id: string;
  email: string;
  nick: string | null;
  age: 'adult' | 'child' | null;
  parent_email: string | null;
  parent_ok: number;
  board: number;
  lang: string;
};
const active = (u: User) => !!u.nick && (u.age === 'adult' || (u.age === 'child' && u.parent_ok === 1));

/* ───── emails ───── */

const MAIL = {
  code: {
    ru: (c: string) => ({ subject: `Нифлаот: код для входа ${c}`, text: `Ваш код для входа на Нифлаот: ${c}\n\nОн действует 10 минут. Если вы не входили на сайт — просто не обращайте внимания на это письмо.` }),
    en: (c: string) => ({ subject: `Niflaot: your sign-in code ${c}`, text: `Your Niflaot sign-in code: ${c}\n\nIt is valid for 10 minutes. If you didn't try to sign in, just ignore this email.` }),
    de: (c: string) => ({ subject: `Niflaot: dein Anmeldecode ${c}`, text: `Dein Anmeldecode für Niflaot: ${c}\n\nEr gilt 10 Minuten. Wenn du dich nicht anmelden wolltest, beachte diese E-Mail einfach nicht.` }),
  },
  consent: {
    ru: (nick: string, link: string) => ({
      subject: `Нифлаот: ваш ребёнок просит разрешения — ${nick}`,
      text: `Здравствуйте!\n\nВаш ребёнок зарегистрировался на сайте Нифлаот (niflaot.mychitas.app) — уроки-игры по Торе — под ником «${nick}» и указал ваш адрес как адрес родителя.\n\nДетям до 14 лет нужно согласие родителя. С согласием сайт будет хранить: email ребёнка, ник, прогресс в уроках; ник и очки видны в таблице лидеров и учителю класса, если ребёнок вступит в класс. Подробно — ${'{site}'}/#/privacy\n\nЧтобы разрешить, откройте ссылку и нажмите «Разрешаю»:\n${link}\n\nЕсли вы не согласны или не знаете, о чём речь, — ничего не делайте: без вашего согласия прогресс не сохраняется, а через 30 дней запись удаляется.`,
    }),
    en: (nick: string, link: string) => ({
      subject: `Niflaot: your child asks for permission — ${nick}`,
      text: `Hello!\n\nYour child has signed up on Niflaot (niflaot.mychitas.app) — Torah lessons as games — as “${nick}” and gave your address as the parent's.\n\nChildren under 14 need a parent's consent. With it, the site keeps: the child's email, nickname and lesson progress; the nickname and points are shown on the leaderboard and to the teacher of a class the child joins. Details — ${'{site}'}/#/privacy\n\nTo allow it, open the link and tap “I allow”:\n${link}\n\nIf you don't agree or don't know what this is about, do nothing: without your consent no progress is kept, and after 30 days the record is deleted.`,
    }),
    de: (nick: string, link: string) => ({
      subject: `Niflaot: Dein Kind bittet um Erlaubnis — ${nick}`,
      text: `Hallo!\n\nDein Kind hat sich auf Niflaot (niflaot.mychitas.app) — Tora-Lektionen als Spiele — als „${nick}“ angemeldet und deine Adresse als Adresse eines Elternteils angegeben.\n\nKinder unter 14 brauchen die Zustimmung eines Elternteils. Damit speichert die Seite: die E-Mail des Kindes, den Spitznamen und den Lernfortschritt; Spitzname und Punkte sind in der Bestenliste und für die Lehrkraft einer Klasse sichtbar, der das Kind beitritt. Mehr dazu — ${'{site}'}/#/privacy\n\nUm es zu erlauben, öffne den Link und tippe auf „Ich erlaube es“:\n${link}\n\nWenn du nicht einverstanden bist oder nicht weißt, worum es geht, tu nichts: Ohne deine Zustimmung wird kein Fortschritt gespeichert, und nach 30 Tagen wird der Eintrag gelöscht.`,
    }),
  },
};

async function sendMail(env: MailEnv, to: string, m: { subject: string; text: string }) {
  if (!env.RESEND_API_KEY && env.DEV_CODES === '1') return console.log(`[dev mail] to ${to}: ${m.subject}\n${m.text}`);
  if (!env.RESEND_API_KEY) throw new Error('mail is not configured');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM || 'Niflaot <onboarding@resend.dev>', to: [to], subject: m.subject, text: m.text }),
  });
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text().catch(() => '')}`);
}

/* ───── the Durable Object ───── */

export class Accounts extends DurableObject<MailEnv> {
  private sql = this.ctx.storage.sql;

  constructor(ctx: DurableObjectState, env: MailEnv) {
    super(ctx, env);
    this.sql.exec(`
      CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, nick TEXT, nick_lc TEXT UNIQUE,
        age TEXT, parent_email TEXT, parent_ok INTEGER NOT NULL DEFAULT 0, consent TEXT, board INTEGER NOT NULL DEFAULT 1,
        lang TEXT NOT NULL DEFAULT 'ru', created INTEGER NOT NULL, last INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS codes (email TEXT PRIMARY KEY, hash TEXT NOT NULL, expires INTEGER NOT NULL,
        tries INTEGER NOT NULL DEFAULT 0, sent INTEGER NOT NULL, sent_hour INTEGER NOT NULL DEFAULT 1);
      CREATE TABLE IF NOT EXISTS sessions (hash TEXT PRIMARY KEY, user TEXT NOT NULL, expires INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS progress (user TEXT PRIMARY KEY, data TEXT NOT NULL, summary TEXT NOT NULL, updated INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS classes (id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, name TEXT NOT NULL, teacher TEXT NOT NULL, created INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS members (class TEXT NOT NULL, user TEXT NOT NULL, joined INTEGER NOT NULL, PRIMARY KEY (class, user));
      CREATE TABLE IF NOT EXISTS ai (user TEXT NOT NULL, day TEXT NOT NULL, n INTEGER NOT NULL, PRIMARY KEY (user, day));
      CREATE TABLE IF NOT EXISTS chat_day (day TEXT PRIMARY KEY, n INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS consent_mail (user TEXT PRIMARY KEY, sent INTEGER NOT NULL, day TEXT NOT NULL, n INTEGER NOT NULL);
    `);
  }

  private one<T extends Record<string, SqlStorageValue>>(q: string, ...b: unknown[]): T | undefined {
    return this.sql.exec<T>(q, ...b).toArray()[0];
  }

  private async user(req: Request): Promise<User | null> {
    const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer /, '');
    if (!token || token.length > 100) return null;
    const s = this.one<{ user: string; expires: number }>('SELECT user, expires FROM sessions WHERE hash = ?', await sha(token));
    if (!s || s.expires < Date.now()) return null;
    const u = this.one<User>('SELECT * FROM users WHERE id = ?', s.user);
    if (u) this.sql.exec('UPDATE users SET last = ? WHERE id = ?', Date.now(), u.id);
    return u ?? null;
  }

  private me(u: User) {
    const classes = this.sql
      .exec<{ id: string; name: string; code: string; teacher: string }>(
        `SELECT c.id, c.name, c.code, c.teacher FROM classes c WHERE c.teacher = ?
         UNION SELECT c.id, c.name, c.code, c.teacher FROM classes c JOIN members m ON m.class = c.id WHERE m.user = ?`,
        u.id, u.id,
      )
      .toArray()
      .map((c) => ({ id: c.id, name: c.name, code: c.teacher === u.id ? c.code : undefined, teacher: c.teacher === u.id }));
    const today = new Date().toISOString().slice(0, 10);
    const ai = this.one<{ today: number; total: number }>(
      'SELECT COALESCE(SUM(CASE WHEN day = ? THEN n END), 0) AS today, COALESCE(SUM(n), 0) AS total FROM ai WHERE user = ?',
      today, u.id,
    )!;
    return {
      user: { email: u.email, nick: u.nick, age: u.age, parentEmail: u.parent_email, parentOk: !!u.parent_ok, board: !!u.board, lang: u.lang, active: active(u) },
      classes,
      ai,
    };
  }

  /** Throws 'wait' when the account asked too often: the parent's address is any address the child typed. */
  private async consentMail(u: User) {
    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const prev = this.one<{ sent: number; day: string; n: number }>('SELECT sent, day, n FROM consent_mail WHERE user = ?', u.id);
    const n = prev?.day === day ? prev.n + 1 : 1;
    if ((prev && now - prev.sent < CONSENT_GAP) || n > CONSENT_PER_DAY) throw new Error('wait');
    this.sql.exec(
      `INSERT INTO consent_mail (user, sent, day, n) VALUES (?, ?, ?, ?)
       ON CONFLICT(user) DO UPDATE SET sent = excluded.sent, day = excluded.day, n = excluded.n`,
      u.id, now, day, n,
    );
    const token = random(24);
    this.sql.exec('UPDATE users SET consent = ? WHERE id = ?', await sha(token), u.id);
    const site = this.env.SITE_URL || 'https://niflaot.mychitas.app';
    const m = MAIL.consent[lang(u.lang)](u.nick!, `${site}/?lang=${u.lang}#/consent/${token}`);
    await sendMail(this.env, u.parent_email!, { subject: m.subject, text: m.text.replace('{site}', site) });
  }

  /** a question to /chat (from the worker): counted for the day of everyone together, refused above the limit */
  private async chatQuota(req: Request) {
    const day = new Date().toISOString().slice(0, 10);
    const limit = Number(req.headers.get('X-Limit')) || 1000;
    const n = this.one<{ n: number }>('SELECT n FROM chat_day WHERE day = ?', day)?.n ?? 0;
    if (n >= limit) return json({ ok: false });
    this.sql.exec('INSERT INTO chat_day (day, n) VALUES (?, 1) ON CONFLICT(day) DO UPDATE SET n = n + 1', day);
    if (req.headers.get('Authorization')) await this.aiUse(req);
    return json({ ok: true });
  }

  /** the AI teacher was asked a question by this session's account (from /chat) */
  private async aiUse(req: Request) {
    const u = await this.user(req);
    if (!u) return json({ ok: false });
    this.sql.exec(
      'INSERT INTO ai (user, day, n) VALUES (?, ?, 1) ON CONFLICT(user, day) DO UPDATE SET n = n + 1',
      u.id, new Date().toISOString().slice(0, 10),
    );
    return json({ ok: true });
  }

  /** every night: pending children's accounts older than 30 days, expired codes and sessions go */
  async alarm() {
    const now = Date.now();
    for (const u of this.sql.exec<{ id: string }>("SELECT id FROM users WHERE age = 'child' AND parent_ok = 0 AND created < ?", now - 30 * 864e5).toArray())
      this.deleteUser(u.id);
    // never finished the profile in a week
    for (const u of this.sql.exec<{ id: string }>('SELECT id FROM users WHERE nick IS NULL AND created < ?', now - 7 * 864e5).toArray()) this.deleteUser(u.id);
    this.sql.exec('DELETE FROM codes WHERE expires < ?', now - 864e5);
    this.sql.exec('DELETE FROM sessions WHERE expires < ?', now);
    this.sql.exec('DELETE FROM chat_day WHERE day < ?', new Date(now - 90 * 864e5).toISOString().slice(0, 10));
    await this.ctx.storage.setAlarm(now + 864e5);
  }

  private deleteUser(id: string) {
    for (const c of this.sql.exec<{ id: string }>('SELECT id FROM classes WHERE teacher = ?', id).toArray()) {
      this.sql.exec('DELETE FROM members WHERE class = ?', c.id);
      this.sql.exec('DELETE FROM classes WHERE id = ?', c.id);
    }
    for (const t of ['members', 'progress', 'sessions', 'ai', 'consent_mail']) this.sql.exec(`DELETE FROM ${t} WHERE user = ?`, id);
    this.sql.exec('DELETE FROM users WHERE id = ?', id);
  }

  async fetch(req: Request): Promise<Response> {
    if (!(await this.ctx.storage.getAlarm())) await this.ctx.storage.setAlarm(Date.now() + 864e5);
    const url = new URL(req.url);
    const path = url.pathname;
    const body = req.method === 'POST' || req.method === 'PUT' ? ((await req.json().catch(() => null)) as Record<string, any> | null) : null;
    if ((req.method === 'POST' || req.method === 'PUT') && !body) return fail('bad json');

    if (path === '/config') return json({ mail: !!this.env.RESEND_API_KEY || this.env.DEV_CODES === '1' });
    if (path === '/chat-quota') return this.chatQuota(req);

    /* ── login ── */
    if (path === '/code') {
      const email = String(body!.email ?? '').trim().toLowerCase();
      if (!validEmail(email)) return fail('email');
      const now = Date.now();
      const prev = this.one<{ sent: number; sent_hour: number }>('SELECT sent, sent_hour FROM codes WHERE email = ?', email);
      if (prev && now - prev.sent < 60_000) return fail('wait', 429);
      const hourCount = prev && now - prev.sent < 3600_000 ? prev.sent_hour + 1 : 1;
      if (hourCount > 5) return fail('wait', 429);
      const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, '0');
      this.sql.exec(
        `INSERT INTO codes (email, hash, expires, tries, sent, sent_hour) VALUES (?, ?, ?, 0, ?, ?)
         ON CONFLICT(email) DO UPDATE SET hash = excluded.hash, expires = excluded.expires, tries = 0, sent = excluded.sent, sent_hour = excluded.sent_hour`,
        email, await sha(`${email}:${code}`), now + CODE_TTL, now, hourCount,
      );
      try {
        await sendMail(this.env, email, MAIL.code[lang(body!.lang)](code));
      } catch (e) {
        console.error(e);
        return fail('mail', 503);
      }
      return json({ ok: true });
    }
    if (path === '/login') {
      const email = String(body!.email ?? '').trim().toLowerCase();
      const code = String(body!.code ?? '').replace(/\D/g, '');
      const c = this.one<{ hash: string; expires: number; tries: number }>('SELECT hash, expires, tries FROM codes WHERE email = ?', email);
      if (!c || c.expires < Date.now() || c.tries >= CODE_TRIES) return fail('expired', 401);
      if (c.hash !== (await sha(`${email}:${code}`))) {
        this.sql.exec('UPDATE codes SET tries = tries + 1 WHERE email = ?', email);
        return fail('code', 401);
      }
      this.sql.exec('DELETE FROM codes WHERE email = ?', email);
      let u = this.one<User>('SELECT * FROM users WHERE email = ?', email);
      if (!u) {
        const id = random(12);
        this.sql.exec('INSERT INTO users (id, email, lang, created, last) VALUES (?, ?, ?, ?, ?)', id, email, lang(body!.lang), Date.now(), Date.now());
        u = this.one<User>('SELECT * FROM users WHERE id = ?', id)!;
      }
      const token = random(32);
      this.sql.exec('INSERT INTO sessions (hash, user, expires) VALUES (?, ?, ?)', await sha(token), u.id, Date.now() + SESSION_TTL);
      return json({ token, ...this.me(u) });
    }
    if (path === '/consent') {
      const token = String(body!.token ?? '');
      if (!token || token.length > 64) return fail('token');
      const u = this.one<User>('SELECT * FROM users WHERE consent = ?', await sha(token));
      if (!u) return fail('token', 404);
      this.sql.exec('UPDATE users SET parent_ok = 1, consent = NULL WHERE id = ?', u.id);
      return json({ ok: true, nick: u.nick });
    }
    if (path === '/leaders' && !url.searchParams.get('class')) return json(this.leaders(null));

    /* ── signed in ── */
    const u = await this.user(req);
    if (!u) return fail('auth', 401);

    if (path === '/me') return json(this.me(u));
    if (path === '/profile') {
      const nick = String(body!.nick ?? '').trim().replace(/\s+/g, ' ');
      if (!validNick(nick)) return fail('nick');
      const taken = this.one('SELECT 1 FROM users WHERE nick_lc = ? AND id != ?', nick.toLowerCase(), u.id);
      if (taken) return fail('nick-taken', 409);
      // the age group is chosen once: a child can't turn into an adult to skip the parent
      const age = u.age ?? (body!.age === 'adult' ? 'adult' : body!.age === 'child' ? 'child' : null);
      if (!age) return fail('age');
      let parent = u.parent_email;
      if (age === 'child' && !u.parent_ok) {
        const p = String(body!.parentEmail ?? '').trim().toLowerCase();
        if (!validEmail(p) || p === u.email) return fail('parent');
        parent = p;
      }
      this.sql.exec(
        'UPDATE users SET nick = ?, nick_lc = ?, age = ?, parent_email = ?, board = ?, lang = ? WHERE id = ?',
        nick, nick.toLowerCase(), age, parent, body!.board === false ? 0 : 1, lang(body!.lang), u.id,
      );
      const nu = this.one<User>('SELECT * FROM users WHERE id = ?', u.id)!;
      if (age === 'child' && !nu.parent_ok && (parent !== u.parent_email || !u.nick)) {
        try {
          await this.consentMail(nu);
        } catch (e) {
          console.error(e);
          return json({ ...this.me(nu), mail: false });
        }
      }
      return json(this.me(nu));
    }
    if (path === '/consent/resend') {
      if (u.age !== 'child' || u.parent_ok || !u.parent_email) return fail('no');
      try {
        await this.consentMail(u);
      } catch (e) {
        if ((e as Error).message === 'wait') return fail('wait', 429);
        console.error(e);
        return fail('mail', 503);
      }
      return json({ ok: true });
    }
    if (path === '/logout') {
      const token = (req.headers.get('Authorization') ?? '').replace(/^Bearer /, '');
      this.sql.exec('DELETE FROM sessions WHERE hash = ?', await sha(token));
      return json({ ok: true });
    }
    if (path === '/delete') {
      this.deleteUser(u.id);
      return json({ ok: true });
    }

    /* ── progress: only for an active account (an adult, or a child with the parent's consent) ── */
    if (path === '/progress' && req.method === 'GET') {
      if (!active(u)) return json({ data: {}, updated: 0 });
      const p = this.one<{ data: string; updated: number }>('SELECT data, updated FROM progress WHERE user = ?', u.id);
      return json({ data: p ? JSON.parse(p.data) : {}, updated: p?.updated ?? 0 });
    }
    if (path === '/progress' && req.method === 'PUT') {
      if (!active(u)) return fail('pending', 403);
      const data = body!.data;
      if (!data || typeof data !== 'object' || Array.isArray(data)) return fail('data');
      const clean: Record<string, string> = {};
      for (const [k, v] of Object.entries(data))
        if (typeof v === 'string' && /^niflaot:(lesson:[a-z0-9-]{1,60}|daily|tanakh-quiz|hebrew|lang|math-level)$/.test(k)) clean[k] = v;
      // merged with what the account already has: a second device that hasn't seen the first one's progress
      // must not overwrite it (each device sends its whole copy)
      const stored = this.one<{ data: string }>('SELECT data FROM progress WHERE user = ?', u.id);
      const merged = mergeSnapshots(clean, stored ? (JSON.parse(stored.data) as Snapshot) : {});
      const raw = JSON.stringify(merged);
      if (raw.length > MAX_PROGRESS) return fail('too large', 413);
      // the summary is counted here from the merged copy; only the streak comes from the device
      const s = summarize(merged, clamp(body!.summary?.streak, 1e4));
      const lessons: Record<string, number> = {};
      for (const [k, v] of Object.entries(s.lessons)) lessons[k] = clamp(v, 100);
      const summary = { points: clamp(s.points, 1e6), solved: clamp(s.solved, 1e4), days: clamp(s.days, 1e4), streak: s.streak, lessons };
      this.sql.exec(
        `INSERT INTO progress (user, data, summary, updated) VALUES (?, ?, ?, ?)
         ON CONFLICT(user) DO UPDATE SET data = excluded.data, summary = excluded.summary, updated = excluded.updated`,
        u.id, raw, JSON.stringify(summary), Date.now(),
      );
      return json({ ok: true });
    }

    /* ── leaderboards and classes ── */
    if (path === '/leaders') {
      const cls = url.searchParams.get('class')!;
      const ok = this.one('SELECT 1 FROM classes WHERE id = ? AND teacher = ? UNION SELECT 1 FROM members WHERE class = ? AND user = ?', cls, u.id, cls, u.id);
      if (!ok) return fail('class', 404);
      return json(this.leaders(cls));
    }
    if (!active(u)) return fail('pending', 403);
    if (path === '/class' && req.method === 'POST') {
      if (u.age !== 'adult') return fail('adult', 403);
      const name = String(body!.name ?? '').trim().slice(0, 60);
      if (name.length < 2) return fail('name');
      if ((this.one<{ n: number }>('SELECT COUNT(*) AS n FROM classes WHERE teacher = ?', u.id)?.n ?? 0) >= 20) return fail('too many', 409);
      let code = '';
      do code = [...crypto.getRandomValues(new Uint8Array(6))].map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
      while (this.one('SELECT 1 FROM classes WHERE code = ?', code));
      const id = random(9);
      this.sql.exec('INSERT INTO classes (id, code, name, teacher, created) VALUES (?, ?, ?, ?, ?)', id, code, name, u.id, Date.now());
      return json(this.me(u));
    }
    if (path === '/class/join') {
      const code = String(body!.code ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      const c = this.one<{ id: string; teacher: string }>('SELECT id, teacher FROM classes WHERE code = ?', code);
      if (!c) return fail('class', 404);
      if (c.teacher !== u.id) this.sql.exec('INSERT OR IGNORE INTO members (class, user, joined) VALUES (?, ?, ?)', c.id, u.id, Date.now());
      return json(this.me(u));
    }
    if (path === '/class/leave') {
      const id = String(body!.id ?? '');
      const c = this.one<{ teacher: string }>('SELECT teacher FROM classes WHERE id = ?', id);
      if (c?.teacher === u.id) {
        this.sql.exec('DELETE FROM members WHERE class = ?', id);
        this.sql.exec('DELETE FROM classes WHERE id = ?', id);
      } else this.sql.exec('DELETE FROM members WHERE class = ? AND user = ?', id, u.id);
      return json(this.me(u));
    }
    if (path === '/class/remove') {
      const c = this.one('SELECT 1 FROM classes WHERE id = ? AND teacher = ?', String(body!.id ?? ''), u.id);
      if (!c) return fail('class', 404);
      const m = this.one<{ id: string }>('SELECT id FROM users WHERE nick_lc = ?', String(body!.nick ?? '').toLowerCase());
      if (m) this.sql.exec('DELETE FROM members WHERE class = ? AND user = ?', String(body!.id), m.id);
      return json({ ok: true });
    }
    if (path.startsWith('/class/')) {
      const id = path.slice(7);
      const c = this.one<{ id: string; name: string; code: string }>('SELECT id, name, code FROM classes WHERE id = ? AND teacher = ?', id, u.id);
      if (!c) return fail('class', 404);
      const members = this.sql
        .exec<{ nick: string; summary: string | null; updated: number | null; joined: number }>(
          `SELECT u.nick, p.summary, p.updated, m.joined FROM members m JOIN users u ON u.id = m.user
           LEFT JOIN progress p ON p.user = m.user WHERE m.class = ? ORDER BY u.nick_lc`,
          id,
        )
        .toArray()
        .map((m) => ({ nick: m.nick, ...(m.summary ? JSON.parse(m.summary) : { points: 0, solved: 0, days: 0, streak: 0, lessons: {} }), updated: m.updated, joined: m.joined }));
      return json({ class: c, members });
    }
    return fail('not found', 404);
  }

  /** top 20 by points and by «Гиматрия дня» streak; only active accounts that agreed to be shown (or a class's members) */
  private leaders(cls: string | null) {
    const where = cls
      ? `JOIN members m ON m.user = u.id AND m.class = ?`
      : '';
    const rows = this.sql
      .exec<{ nick: string; summary: string }>(
        `SELECT u.nick, p.summary FROM users u JOIN progress p ON p.user = u.id ${where}
         WHERE u.nick IS NOT NULL AND (u.age = 'adult' OR u.parent_ok = 1) ${cls ? '' : 'AND u.board = 1'}`,
        ...(cls ? [cls] : []),
      )
      .toArray()
      .map((r) => ({ nick: r.nick, ...JSON.parse(r.summary) }));
    const top = (k: 'points' | 'streak' | 'days') =>
      rows
        .filter((r) => r[k] > 0)
        .sort((a, b) => b[k] - a[k] || a.nick.localeCompare(b.nick))
        .slice(0, 20)
        .map((r) => ({ nick: r.nick, v: r[k] }));
    return { points: top('points'), streak: top('streak'), days: top('days') };
  }
}
