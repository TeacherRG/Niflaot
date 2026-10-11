/**
 * «Урок дня» — the recorded lessons of the passage of the day (Пророки / Писания), in Cloudflare R2 (binding AUDIO).
 * The files are `<section>/<date>`, their title and length are the object's custom metadata.
 *
 * GET  /audio/list/<section>          → [{date, title, duration, type, size, v}] — only the days that have come
 *                                       (with the admin's GitHub token — all, the coming days too)
 * GET  /audio/file/<section>/<date>   → the recording, with Range (the player seeks); a coming day — 404
 * PUT  /audio/file/<section>/<date>   → upload (body — the file; X-Title, X-Duration), the admin only
 * DELETE /audio/file/<section>/<date> → remove, the admin only
 *
 * The admin is whoever may push to the site's repository: the same GitHub token as the text editor of `#/admin`,
 * checked with GitHub on each upload. Without the R2 binding every route answers 404 and the site shows no player.
 */
export interface AudioEnv {
  AUDIO?: R2Bucket;
  /** the site's repository, «owner/name»: who may push to it may upload */
  ADMIN_REPO?: string;
}

const SECTIONS = ['neviim', 'ketuvim'];
const TYPES = ['audio/mpeg', 'audio/mp4', 'audio/x-m4a', 'audio/aac', 'audio/ogg', 'audio/webm', 'audio/wav', 'audio/x-wav'];
/** a lesson of an hour in good mp3 is ~60 MB; the free plan takes bodies up to 100 MB */
const MAX_SIZE = 95 * 1024 * 1024;

/** Today in the earliest time zone (UTC+14): the day's recording opens when the day has come somewhere. */
const latestToday = () => new Date(Date.now() + 14 * 3600_000).toISOString().slice(0, 10);

async function isAdmin(req: Request, env: AudioEnv): Promise<boolean> {
  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !/^[\w-]{20,255}$/.test(token)) return false;
  const res = await fetch(`https://api.github.com/repos/${env.ADMIN_REPO ?? 'TeacherRG/Niflaot'}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'niflaot-assistant',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  }).catch(() => null);
  if (!res?.ok) return false;
  const repo = await res.json<{ permissions?: { push?: boolean } }>().catch(() => null);
  return !!repo?.permissions?.push;
}

export async function audioRoute(req: Request, env: AudioEnv, path: string, headers: Record<string, string>): Promise<Response> {
  const bucket = env.AUDIO;
  const notFound = () => new Response('Not found', { status: 404, headers });
  if (!bucket) return notFound();
  const json = (o: unknown, cache = 'no-store') =>
    new Response(JSON.stringify(o), { headers: { ...headers, 'Content-Type': 'application/json', 'Cache-Control': cache } });

  const list = path.match(/^\/list\/(\w+)$/);
  if (list && req.method === 'GET') {
    const section = list[1];
    if (!SECTIONS.includes(section)) return notFound();
    // with a token — the admin's list (the coming days too); a token that doesn't pass is refused, not ignored
    const all = req.headers.has('Authorization');
    if (all && !(await isAdmin(req, env))) return new Response('Forbidden', { status: 403, headers });
    const today = latestToday();
    const items = [];
    let cursor: string | undefined;
    do {
      const page = await bucket.list({ prefix: `${section}/`, cursor, include: ['customMetadata', 'httpMetadata'] });
      for (const o of page.objects) {
        const date = o.key.slice(section.length + 1);
        if (!all && date > today) continue;
        items.push({
          date,
          title: o.customMetadata?.title ?? '',
          duration: Number(o.customMetadata?.duration) || 0,
          type: o.httpMetadata?.contentType ?? '',
          size: o.size,
          v: o.etag.slice(0, 8),
        });
      }
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
    return json(items, all ? 'no-store' : 'public, max-age=300');
  }

  const file = path.match(/^\/file\/(\w+)\/(\d{4}-\d{2}-\d{2})$/);
  if (!file || !SECTIONS.includes(file[1])) return notFound();
  const key = `${file[1]}/${file[2]}`;

  if (req.method === 'GET' || req.method === 'HEAD') {
    if (file[2] > latestToday()) return notFound();
    const obj = await bucket.get(key, { range: req.headers, onlyIf: req.headers });
    if (!obj) return notFound();
    const h = new Headers(headers);
    obj.writeHttpMetadata(h);
    h.set('ETag', obj.httpEtag);
    h.set('Accept-Ranges', 'bytes');
    // the link carries the version (?v=…): a new recording of the day gets a new link
    h.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (!('body' in obj)) return new Response(null, { status: 304, headers: h });
    const r = obj.range as { offset?: number; length?: number; suffix?: number } | undefined;
    if (r && req.headers.has('Range')) {
      const offset = r.suffix !== undefined ? obj.size - r.suffix : r.offset ?? 0;
      const length = r.suffix ?? r.length ?? obj.size - offset;
      h.set('Content-Range', `bytes ${offset}-${offset + length - 1}/${obj.size}`);
      h.set('Content-Length', String(length));
      return new Response(req.method === 'HEAD' ? null : obj.body, { status: 206, headers: h });
    }
    h.set('Content-Length', String(obj.size));
    return new Response(req.method === 'HEAD' ? null : obj.body, { headers: h });
  }

  if (req.method !== 'PUT' && req.method !== 'DELETE') return notFound();
  if (!(await isAdmin(req, env))) return new Response('Forbidden', { status: 403, headers });
  if (req.method === 'DELETE') {
    await bucket.delete(key);
    return json({ ok: true });
  }
  const type = (req.headers.get('Content-Type') ?? '').split(';')[0].trim().toLowerCase();
  if (!TYPES.includes(type)) return new Response('Unsupported type', { status: 415, headers });
  const size = Number(req.headers.get('Content-Length') ?? 0);
  if (!size || size > MAX_SIZE) return new Response('Too large', { status: 413, headers });
  const title = decodeURIComponent(req.headers.get('X-Title') ?? '').slice(0, 200);
  const duration = String(Math.max(0, Math.round(Number(req.headers.get('X-Duration')) || 0)));
  const obj = await bucket.put(key, req.body, {
    httpMetadata: { contentType: type },
    customMetadata: { title, duration },
  });
  return json({ ok: true, v: obj?.etag.slice(0, 8) });
}
