/**
 * «Слушать» — the lessons read aloud by a male voice of Google Cloud Text-to-Speech, Chirp 3 HD (the voice Charon;
 * secret GOOGLE_TTS_KEY — an API key of a Google Cloud project with the Text-to-Speech API on; without it GEMINI_API_KEY
 * is tried, which works when the same project has that API on). MP3. The first listener of a part waits while it is
 * recorded; the audio is kept in a Durable Object with SQLite storage (Narrator, one per lesson and language — free plan,
 * nothing to set up) and every next listener gets the ready file.
 *
 * GET /tts/<lang>/<slug>/<hash>.mp3 — one part of a lesson, or of a passage of the day (`<slug>` = `neviim-<date>` /
 * `ketuvim-<date>`). The text is never taken from the request: the object finds the part with this hash in the site's
 * own `SITE_URL/tts/<lang>/<slug>.json` (scripts/prerender.ts, src/core/narration.ts), or builds the passage's parts
 * from `SITE_URL/tanakh/<date>.json` (src/core/tanakhNarration.ts, the same code as the page) — so nobody can make it
 * speak (and pay for) other texts, and a changed text gets a new hash.
 */
import { DurableObject } from 'cloudflare:workers';
import { parseTanakhSlug, tanakhLang, tanakhNarration, type SpokenDay } from '../../src/core/tanakhNarration';

export interface TtsEnv {
  SITE_URL?: string;
  GOOGLE_TTS_KEY?: string;
  GEMINI_API_KEY?: string;
  /** a Chirp 3 HD voice; Charon — a calm, clear male voice (the same name in every language) */
  TTS_VOICE?: string;
  NARRATOR: DurableObjectNamespace<Narrator>;
}

const DEFAULT_VOICE = 'Charon';
const LOCALES: Record<string, string> = { ru: 'ru-RU', en: 'en-US', de: 'de-DE' };
/** the full voice name — also the part of the key in storage: another voice records anew */
const voiceName = (lang: string, voice: string) => `${LOCALES[lang]}-Chirp3-HD-${voice}`;
const MAX_TEXT = 4000;
/** a value of SQLite storage is at most 2 MB: the file is kept in pieces */
const PIECE = 1024 * 1024;

interface Part {
  h: string;
  text: string;
}

export async function ttsRoute(
  req: Request,
  env: TtsEnv,
  path: string,
  headers: Record<string, string>,
  mayGenerate: () => Promise<boolean>,
): Promise<Response> {
  // `.wav` — the address of the site's earlier build, until it is redeployed (the file is MP3 either way)
  const m = path.match(/^\/(ru|en|de)\/([a-z0-9-]{1,64})\/([0-9a-f]{16})\.(mp3|wav)$/);
  if (!m) return new Response('Not found', { status: 404, headers });
  if (req.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: { ...headers, Allow: 'GET' } });
  if (!(env.GOOGLE_TTS_KEY || env.GEMINI_API_KEY)) return new Response('off', { status: 503, headers });
  const [, lang, slug, hash] = m;
  const stub = env.NARRATOR.get(env.NARRATOR.idFromName(`${lang}/${slug}`));
  const ask = (gen: boolean) => stub.fetch(`https://narrator/${lang}/${slug}/${hash}${gen ? '?gen=1' : ''}`);
  let r = await ask(false);
  // not recorded yet: a recording costs money — only from the site's pages and through the rate limit
  if (r.status === 404 && (await r.text()) === 'missing') {
    if (!(await mayGenerate())) return new Response('Too many requests', { status: 429, headers: { ...headers, 'Retry-After': '60' } });
    r = await ask(true);
  }
  if (!r.ok) return new Response(r.body, { status: r.status, headers: { ...headers, 'Cache-Control': 'no-store' } });
  return new Response(r.body, {
    headers: {
      ...headers,
      'Content-Type': 'audio/mpeg',
      'Content-Length': r.headers.get('Content-Length') ?? '',
      // a part's address has the hash of its text: the file never changes
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

/** The recordings of one lesson in one language. Single-threaded: two first listeners at once don't pay twice. */
export class Narrator extends DurableObject<TtsEnv> {
  private sql = this.ctx.storage.sql;
  private pending = new Map<string, Promise<Uint8Array>>();

  constructor(ctx: DurableObjectState, env: TtsEnv) {
    super(ctx, env);
    this.sql.exec('CREATE TABLE IF NOT EXISTS audio (key TEXT NOT NULL, n INTEGER NOT NULL, data BLOB NOT NULL, PRIMARY KEY (key, n))');
    // the WAV recordings of Gemini TTS (before Chirp 3 HD) are not used any more
    this.sql.exec("DELETE FROM audio WHERE key NOT LIKE '%-Chirp3-HD-%'");
  }

  private load(key: string): Uint8Array | null {
    const rows = this.sql.exec<{ data: ArrayBuffer }>('SELECT data FROM audio WHERE key = ? ORDER BY n', key).toArray();
    if (!rows.length) return null;
    const out = new Uint8Array(rows.reduce((s, r) => s + r.data.byteLength, 0));
    let o = 0;
    for (const r of rows) {
      out.set(new Uint8Array(r.data), o);
      o += r.data.byteLength;
    }
    return out;
  }

  private save(key: string, mp3: Uint8Array) {
    this.ctx.storage.transactionSync(() => {
      this.sql.exec('DELETE FROM audio WHERE key = ?', key);
      for (let n = 0; n * PIECE < mp3.length; n++) this.sql.exec('INSERT INTO audio (key, n, data) VALUES (?, ?, ?)', key, n, mp3.slice(n * PIECE, (n + 1) * PIECE));
    });
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const [, lang, slug, hash] = url.pathname.split('/');
    const voice = voiceName(lang, this.env.TTS_VOICE || DEFAULT_VOICE);
    const key = `${hash}-${voice}`;
    const send = (mp3: Uint8Array) => new Response(mp3, { headers: { 'Content-Length': String(mp3.length) } });
    const ready = this.load(key);
    if (ready) return send(ready);
    if (url.searchParams.get('gen') !== '1') return new Response('missing', { status: 404 });

    let job = this.pending.get(key);
    if (!job) {
      job = this.record(lang, slug, hash, voice).then((mp3) => (this.save(key, mp3), mp3));
      this.pending.set(key, job);
      job.finally(() => this.pending.delete(key)).catch(() => {});
    }
    try {
      return send(await job);
    } catch (e) {
      if (e instanceof NotFound) return new Response('Not found', { status: 404 });
      // the quota of Text-to-Speech is spent: the recorded parts still play, the new ones — later
      if (e instanceof Quota) return new Response('quota', { status: 503, headers: { 'Retry-After': '3600' } });
      console.error('tts', e);
      return new Response('failed', { status: 502 });
    }
  }

  private async record(lang: string, slug: string, hash: string, voice: string): Promise<Uint8Array> {
    const site = (this.env.SITE_URL ?? 'https://niflaot.mychitas.app').replace(/\/$/, '');
    const json = <T>(path: string) =>
      fetch(`${site}${path}`)
        .then((r) => (r.ok ? r.json<T>() : null))
        .catch(() => null);
    const day = parseTanakhSlug(slug);
    let parts: Part[] | undefined;
    if (day) {
      const content = await json<SpokenDay>(`/tanakh/${day.date}.json`);
      // only in the language the page reads the day in (an untranslated day — English)
      const n = content && tanakhLang(content, lang) === lang ? await tanakhNarration(content, day.section, lang as 'ru' | 'en' | 'de') : null;
      parts = n?.parts;
    } else parts = (await json<{ parts?: Part[] }>(`/tts/${lang}/${slug}.json`))?.parts;
    const part = parts?.find((p) => p.h === hash);
    if (!part || typeof part.text !== 'string' || part.text.length > MAX_TEXT) throw new NotFound();
    return speak(this.env, lang, part.text, voice);
  }
}

class NotFound extends Error {}
class Quota extends Error {}

const HEBREW = /[\u0590-\u05FF][\u0590-\u05FF\s״׳"'-]*/g;

/**
 * Google Cloud Text-to-Speech (Chirp 3 HD) → MP3. A spent quota (429) — `Quota`: the part waits. Should the service
 * refuse a text with Hebrew letters in a Russian / English / German voice (400), it is asked again without them.
 */
async function speak(env: TtsEnv, lang: string, text: string, voice: string): Promise<Uint8Array> {
  const key = env.GOOGLE_TTS_KEY || env.GEMINI_API_KEY!;
  for (const input of [text, text.replace(HEBREW, ' ').replace(/[ \t]{2,}/g, ' ')]) {
    const r = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ input: { text: input }, voice: { languageCode: LOCALES[lang], name: voice }, audioConfig: { audioEncoding: 'MP3' } }),
    });
    if (r.status === 429) {
      console.error('tts 429', (await r.text()).slice(0, 300));
      throw new Quota();
    }
    if (r.status === 400 && input === text && /[\u0590-\u05FF]/.test(text)) {
      console.error('tts 400, again without Hebrew', (await r.text()).slice(0, 300));
      continue;
    }
    if (!r.ok) throw new Error(`text-to-speech ${r.status}: ${(await r.text()).slice(0, 300)}`);
    const out = await r.json<{ audioContent?: string }>();
    if (!out.audioContent) throw new Error('text-to-speech: no audio');
    return fromBase64(out.audioContent);
  }
  throw new Error('text-to-speech: refused');
}

function fromBase64(s: string): Uint8Array {
  const native = (Uint8Array as unknown as { fromBase64?: (s: string) => Uint8Array }).fromBase64;
  if (native) return native(s);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
