/**
 * The daily reminder of the site («Напоминать каждый день», src/core/push.ts on the site).
 *
 * One Durable Object `PushHub` (SQLite storage, free plan) keeps the subscriptions: the browser's push address,
 * the time zone, the hour and the language — no names, no emails. It also keeps its own VAPID key pair, made on
 * first use, so there is nothing to set up by hand. Once an hour (cron in wrangler.toml) it sends an **empty** push
 * to every subscription whose local hour has come and that got nothing today; the site's service worker
 * (public/sw.js) then shows the message of the day from /daily-message.json. Empty pushes need no payload
 * encryption — only the VAPID signature (ES256, WebCrypto).
 *
 * Never on Shabbat: nothing on Saturday (local), nothing on Friday from noon. A push service that answers
 * 404 / 410 means the subscription is gone — it is deleted. Sending goes in batches of BATCH per invocation
 * (the free plan allows 50 outgoing requests per invocation); the rest continues by an alarm a second later.
 */
import { DurableObject } from 'cloudflare:workers';
import { makeVapidKeys, vapidAuth, type VapidKeys } from './vapid';
import { LANGS, PUSH_HOURS, localTime, restDay, validEndpoint, validTz } from './rules';

const BATCH = 40;
const MAX_SUBS = 100_000;
const CONTACT = 'mailto:Office@mychitas.app';


type Sub = { endpoint: string; tz: string; hour: number; lang: string; last: string | null; test: number | null };

export class PushHub extends DurableObject {
  private sql = this.ctx.storage.sql;

  constructor(ctx: DurableObjectState, env: unknown) {
    super(ctx, env as never);
    this.sql.exec(`CREATE TABLE IF NOT EXISTS subs (
      endpoint TEXT PRIMARY KEY, tz TEXT NOT NULL, hour INTEGER NOT NULL, lang TEXT NOT NULL,
      last TEXT, test INTEGER, created TEXT NOT NULL)`);
    this.sql.exec('CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL)');
  }

  /* ───── VAPID ───── */

  private async keys(): Promise<VapidKeys> {
    const row = this.sql.exec<{ v: string }>("SELECT v FROM kv WHERE k = 'vapid'").toArray()[0];
    if (row) return JSON.parse(row.v);
    const keys = await makeVapidKeys();
    this.sql.exec("INSERT INTO kv (k, v) VALUES ('vapid', ?)", JSON.stringify(keys));
    return keys;
  }

  /** an empty push; true — delivered, false — the subscription is gone, null — the push service failed */
  private async send(endpoint: string, keys: VapidKeys): Promise<boolean | null> {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: await vapidAuth(endpoint, keys, CONTACT), TTL: '21600', Urgency: 'normal', 'Content-Length': '0' },
    });
    if (res.status === 404 || res.status === 410) return false;
    if (!res.ok) console.error('push', new URL(endpoint).host, res.status, await res.text().catch(() => ''));
    return res.ok || null;
  }

  /* ───── the hourly round ───── */

  private async round() {
    const now = new Date();
    const due: { endpoint: string; date: string }[] = [];
    for (const s of this.sql.exec<Sub>('SELECT endpoint, tz, hour, last FROM subs')) {
      const l = localTime(s.tz, now);
      if (l.hour === s.hour && s.last !== l.date && !restDay(l.weekday, l.hour)) due.push({ endpoint: s.endpoint, date: l.date });
      if (due.length > BATCH) break;
    }
    if (!due.length) return;
    const k = await this.keys();
    for (const d of due.slice(0, BATCH)) {
      // marked first: a failing push service must not get the same push again and again
      this.sql.exec('UPDATE subs SET last = ? WHERE endpoint = ?', d.date, d.endpoint);
      const ok = await this.send(d.endpoint, k).catch(() => null);
      if (ok === false) this.sql.exec('DELETE FROM subs WHERE endpoint = ?', d.endpoint);
    }
    if (due.length > BATCH) await this.ctx.storage.setAlarm(Date.now() + 1000);
  }

  async alarm() {
    await this.round();
  }

  /* ───── requests from the worker (already checked for the site's origin and the rate limit) ───── */

  async fetch(req: Request): Promise<Response> {
    const path = new URL(req.url).pathname;
    if (path === '/tick') {
      await this.round();
      return new Response('ok');
    }
    if (path === '/key') return Response.json({ key: (await this.keys()).pub });
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return new Response('bad json', { status: 400 });

    if (path === '/subscribe') {
      const sub = body.subscription as { endpoint?: unknown } | undefined;
      const { tz, hour, lang } = body;
      if (!validEndpoint(sub?.endpoint) || !validTz(tz) || !PUSH_HOURS.includes(hour as number) || !LANGS.includes(lang as string))
        return new Response('bad subscription', { status: 400 });
      const count = this.sql.exec<{ n: number }>('SELECT COUNT(*) AS n FROM subs').one().n;
      const known = this.sql.exec('SELECT 1 FROM subs WHERE endpoint = ?', sub.endpoint).toArray().length > 0;
      if (!known && count >= MAX_SUBS) return new Response('full', { status: 503 });
      // a new subscription today gets its first reminder tomorrow (or today, if its hour is still ahead)
      this.sql.exec(
        `INSERT INTO subs (endpoint, tz, hour, lang, last, test, created) VALUES (?, ?, ?, ?, NULL, NULL, ?)
         ON CONFLICT(endpoint) DO UPDATE SET tz = excluded.tz, hour = excluded.hour, lang = excluded.lang`,
        sub.endpoint, tz, hour, lang, new Date().toISOString(),
      );
      return Response.json({ ok: true });
    }
    if (path === '/unsubscribe') {
      if (validEndpoint(body.endpoint)) this.sql.exec('DELETE FROM subs WHERE endpoint = ?', body.endpoint);
      return Response.json({ ok: true });
    }
    if (path === '/test') {
      if (!validEndpoint(body.endpoint)) return new Response('bad endpoint', { status: 400 });
      const s = this.sql.exec<Sub>('SELECT * FROM subs WHERE endpoint = ?', body.endpoint).toArray()[0];
      if (!s) return new Response('not subscribed', { status: 404 });
      // one test a minute per subscription
      if (s.test && Date.now() - s.test < 60_000) return new Response('wait', { status: 429 });
      this.sql.exec('UPDATE subs SET test = ? WHERE endpoint = ?', Date.now(), s.endpoint);
      const ok = await this.send(s.endpoint, await this.keys());
      if (ok === false) {
        this.sql.exec('DELETE FROM subs WHERE endpoint = ?', s.endpoint);
        return new Response('gone', { status: 410 });
      }
      return ok ? Response.json({ ok: true }) : new Response('push service error', { status: 502 });
    }
    return new Response('Not found', { status: 404 });
  }
}
