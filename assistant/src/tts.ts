/**
 * «Слушать» — the lessons read aloud by a male voice of Gemini TTS (Google AI Studio key, secret GEMINI_API_KEY).
 * The first listener of a part waits while it is generated; the audio is kept in a Durable Object with SQLite storage
 * (Narrator, one per lesson and language — free plan, nothing to set up) and every next listener gets the ready file.
 *
 * GET /tts/<lang>/<slug>/<hash>.wav — one part of a lesson, or of a passage of the day (`<slug>` = `neviim-<date>` /
 * `ketuvim-<date>`). The text is never taken from the request: the object finds the part with this hash in the site's
 * own `SITE_URL/tts/<lang>/<slug>.json` (scripts/prerender.ts, src/core/narration.ts), or builds the passage's parts
 * from `SITE_URL/tanakh/<date>.json` (src/core/tanakhNarration.ts, the same code as the page) — so nobody can make it
 * speak (and pay for) other texts, and a changed text gets a new hash.
 */
import { DurableObject } from 'cloudflare:workers';
import { parseTanakhSlug, tanakhLang, tanakhNarration, type SpokenDay } from '../../src/core/tanakhNarration';
import { dropouts, MAX_DROPOUTS } from '../../src/core/speech';

export interface TtsEnv {
  SITE_URL?: string;
  GEMINI_API_KEY?: string;
  /** Gemini TTS model; when it is unknown (404) the next of FALLBACK_MODELS is tried */
  TTS_MODEL?: string;
  /** a prebuilt voice of Gemini TTS; Charon — a calm, clear male voice */
  TTS_VOICE?: string;
  NARRATOR: DurableObjectNamespace<Narrator>;
  GATE: DurableObjectNamespace<GeminiGate>;
}

const DEFAULT_MODEL = 'gemini-3.1-flash-tts-preview';
const FALLBACK_MODELS = ['gemini-2.5-pro-preview-tts', 'gemini-2.5-flash-preview-tts'];
const DEFAULT_VOICE = 'Charon';
const MAX_TEXT = 4000;
/** a value of SQLite storage is at most 2 MB: the file is kept in pieces */
const PIECE = 1024 * 1024;
/** a recording with dropouts (`dropouts`) is made again — at most this many times in all; then the best one is kept */
const TAKES = 3;

/**
 * How the narrator reads: said to the model before the text (it is not read aloud). Short and plain: with a longer
 * instruction (the Hebrew pronunciation as well) the recordings clicked every few words and once broke off, while the
 * same text with this one came out clean. Changing it records everything anew (`STYLE_VERSION` is in the key).
 */
const STYLE: Record<string, string> = {
  ru: 'Прочитай вслух по-русски, спокойно и тепло:',
  en: 'Read aloud in English, calmly and warmly:',
  de: 'Lies auf Deutsch vor, ruhig und warm:',
};
// 3: the parts recorded by a fallback model when the quota ran out (they clicked) are recorded anew
const STYLE_VERSION = 3;

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
  const m = path.match(/^\/(ru|en|de)\/([a-z0-9-]{1,64})\/([0-9a-f]{16})\.(wav|mp3)$/);
  if (!m) return new Response('Not found', { status: 404, headers });
  if (req.method !== 'GET') return new Response('Method not allowed', { status: 405, headers: { ...headers, Allow: 'GET' } });
  if (!env.GEMINI_API_KEY) return new Response('off', { status: 503, headers });
  const [, lang, slug, hash] = m;
  const stub = env.NARRATOR.get(env.NARRATOR.idFromName(`${lang}/${slug}`));
  const ask = (gen: boolean) => stub.fetch(`https://narrator/${lang}/${slug}/${hash}${gen ? '?gen=1' : ''}`);
  let r = await ask(false);
  // not recorded yet: a recording costs money — only from the site's pages and through the rate limit
  if (r.status === 404 && (await r.text()) === 'missing') {
    if (!(await mayGenerate())) return new Response('Too many requests', { status: 429, headers: { ...headers, 'Retry-After': '60' } });
    r = await ask(true);
  }
  if (!r.ok) {
    const quota = r.headers.get('X-Quota');
    const error = r.headers.get('X-Error');
    return new Response(r.body, {
      status: r.status,
      headers: {
        ...headers,
        'Cache-Control': 'no-store',
        ...(quota ? { 'X-Quota': quota, 'Retry-After': r.headers.get('Retry-After') ?? '3600' } : {}),
        ...(error ? { 'X-Error': error } : {}),
      },
    });
  }
  return new Response(r.body, {
    headers: {
      ...headers,
      'Content-Type': 'audio/wav',
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

  private save(key: string, wav: Uint8Array) {
    this.ctx.storage.transactionSync(() => {
      this.sql.exec('DELETE FROM audio WHERE key = ?', key);
      for (let n = 0; n * PIECE < wav.length; n++) this.sql.exec('INSERT INTO audio (key, n, data) VALUES (?, ?, ?)', key, n, wav.slice(n * PIECE, (n + 1) * PIECE));
    });
  }

  /** Check cached audio too: older recordings may have been saved after every take contained dropouts. */
  private check(key: string, wav: Uint8Array): boolean {
    const holes = holesOf(wav);
    if (holes > MAX_DROPOUTS) {
      console.error('tts', key, 'dropouts', holes, '— recorded again');
      this.sql.exec('DELETE FROM audio WHERE key = ?', key);
      return false;
    }
    return true;
  }

  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const [, lang, slug, hash] = url.pathname.split('/');
    const voice = this.env.TTS_VOICE || DEFAULT_VOICE;
    // another voice, model or instruction records anew
    const key = `${hash}-${voice}-${this.env.TTS_MODEL || DEFAULT_MODEL}-s${STYLE_VERSION}`;
    const send = (wav: Uint8Array) => new Response(wav, { headers: { 'Content-Length': String(wav.length) } });
    const ready = this.load(key);
    if (ready && this.check(key, ready)) return send(ready);
    if (url.searchParams.get('gen') !== '1') return new Response('missing', { status: 404 });

    let job = this.pending.get(key);
    if (!job) {
      job = this.record(lang, slug, hash, voice).then((wav) => (this.save(key, wav), wav));
      this.pending.set(key, job);
      job.finally(() => this.pending.delete(key)).catch(() => {});
    }
    try {
      return send(await job);
    } catch (e) {
      if (e instanceof NotFound) return new Response('Not found', { status: 404 });
      // the day's limit of Gemini is spent: the recorded parts still play, the new ones — tomorrow
      // X-Quota — which limit of Gemini (per minute / per day, free tier or paid): scripts/tts-prerecord.ts waits or stops
      if (e instanceof Quota) return new Response('quota', { status: 503, headers: { 'Retry-After': String(e.retry ?? 3600), 'X-Quota': e.message } });
      console.error('tts', e);
      // X-Error — what Gemini answered (scripts/tts-prerecord.ts prints it; a header is ASCII only)
      const why = String(e instanceof Error ? e.message : e).replace(/[^\x20-\x7e]+/g, ' ').slice(0, 300);
      return new Response('failed', { status: 502, headers: { 'X-Error': why } });
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
    // Gemini's audio is now and then cut by dropouts (clicks, breaks): only clean takes may be stored.
    let fewestHoles = Infinity;
    for (let take = 1; take <= TAKES; take++) {
      const wav = await speak(this.env, lang, part.text, voice);
      const holes = holesOf(wav);
      if (holes <= MAX_DROPOUTS) return wav;
      console.error('tts', slug, hash, 'take', take, 'dropouts', holes);
      fewestHoles = Math.min(fewestHoles, holes);
    }
    throw new Error(`gemini audio quality: all ${TAKES} takes exceeded ${MAX_DROPOUTS} dropouts (fewest: ${fewestHoles})`);
  }
}

/**
 * Gemini refuses requests from some countries («User location is not supported»): a Durable Object runs near whoever
 * first made it, so a lesson's Narrator may sit in such a place. Every call to Gemini goes through this one object,
 * created in Western Europe, instead.
 */
export class GeminiGate extends DurableObject<TtsEnv> {
  async fetch(req: Request): Promise<Response> {
    const { model, body } = await req.json<{ model: string; body: unknown }>();
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': this.env.GEMINI_API_KEY! },
      body: JSON.stringify(body),
    });
    return new Response(r.body, { status: r.status });
  }
}

class NotFound extends Error {}
class Quota extends Error {
  constructor(
    reason: string,
    /** seconds Gemini asks to wait */
    readonly retry?: number,
  ) {
    super(reason);
  }
}

/** the limit Gemini names in a 429: «<quota id> <metric> limit N», and how long to wait */
function quotaOf(body: string): Quota {
  try {
    const details = (JSON.parse(body) as { error?: { details?: { violations?: { quotaId?: string; quotaMetric?: string; quotaValue?: string }[]; retryDelay?: string }[] } }).error?.details ?? [];
    const v = details.flatMap((d) => d.violations ?? []);
    const retry = Number(details.find((d) => d.retryDelay)?.retryDelay?.replace(/s$/, ''));
    return new Quota(v.map((x) => `${x.quotaId ?? ''} ${x.quotaMetric?.split('/').pop() ?? ''} limit ${x.quotaValue ?? '?'}`.trim()).join('; ') || 'quota', Number.isFinite(retry) ? Math.ceil(retry) : undefined);
  } catch {
    return new Quota('quota');
  }
}

/**
 * Gemini TTS → 16-bit PCM → a WAV file. An unknown model (404) hands over to the next. A spent quota (429 — the free
 * tier has a small daily limit) does not: the 2.5 models' audio clicks every few words, and a part recorded by another
 * model would be kept under this one for good — the part waits for the quota instead. An answer without audio (the model's stream broke off —
 * `finishReason` SAFETY / OTHER, «please retry») is asked again once. The audio may come in several pieces: all are joined.
 */
async function speak(env: TtsEnv, lang: string, text: string, voice: string): Promise<Uint8Array> {
  const models = [env.TTS_MODEL || DEFAULT_MODEL, ...FALLBACK_MODELS.filter((x) => x !== env.TTS_MODEL)];
  let rateWaits = 0;
  for (const model of models)
    for (let attempt = 0; attempt < 2; attempt++) {
      const r = await env.GATE.get(env.GATE.idFromName('weur'), { locationHint: 'weur' }).fetch('https://gate/', {
        method: 'POST',
        body: JSON.stringify({
          model,
          body: {
            contents: [{ parts: [{ text: `${STYLE[lang]}\n\n${text}` }] }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
            },
          },
        }),
      });
      if (r.status === 429) {
        const body = await r.text();
        console.error('tts', model, 429, body.slice(0, 500));
        const quota = quotaOf(body);
        // a per-minute limit passes in seconds: wait and ask again instead of «tomorrow»
        if (!/PerDay/i.test(quota.message) && (quota.retry ?? 15) <= 30 && ++rateWaits <= 3) {
          await new Promise((res) => setTimeout(res, ((quota.retry ?? 15) + 1) * 1000));
          attempt--;
          continue;
        }
        throw quota;
      }
      if (r.status === 404) break;
      if (!r.ok) throw new Error(`gemini ${model} ${r.status}: ${(await r.text()).slice(0, 300)}`);
      const out = await r.json<{
        candidates?: { finishReason?: string; content?: { parts?: { inlineData?: { mimeType?: string; data?: string } }[] } }[];
      }>();
      const pieces = (out.candidates?.[0]?.content?.parts ?? []).map((p) => p.inlineData).filter((d) => d?.data);
      if (!pieces.length) {
        console.error('tts', model, 'no audio', out.candidates?.[0]?.finishReason);
        continue;
      }
      const rate = Number(pieces[0]!.mimeType?.match(/rate=(\d+)/)?.[1] ?? 24000);
      const pcm = pieces.map((d) => fromBase64(d!.data!));
      const all = new Uint8Array(pcm.reduce((n, x) => n + x.length, 0));
      let o = 0;
      for (const x of pcm) {
        all.set(x, o);
        o += x.length;
      }
      return wav(all, rate);
    }
  throw new Error('gemini: no audio from any TTS model');
}

/** the dropouts of a WAV made by `wav` (44-byte header, mono 16-bit) */
function holesOf(file: Uint8Array): number {
  const rate = new DataView(file.buffer, file.byteOffset).getUint32(24, true);
  const pcm = new Int16Array(file.buffer.slice(file.byteOffset + 44, file.byteOffset + file.length - ((file.length - 44) % 2)));
  return dropouts(pcm, rate);
}

function fromBase64(s: string): Uint8Array {
  const native = (Uint8Array as unknown as { fromBase64?: (s: string) => Uint8Array }).fromBase64;
  if (native) return native(s);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/** a WAV header in front of mono 16-bit PCM */
export function wav(pcm: Uint8Array, rate: number): Uint8Array {
  const out = new Uint8Array(44 + pcm.length);
  const v = new DataView(out.buffer);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  v.setUint32(4, 36 + pcm.length, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true); // PCM
  v.setUint16(22, 1, true); // mono
  v.setUint32(24, rate, true);
  v.setUint32(28, rate * 2, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, pcm.length, true);
  out.set(pcm, 44);
  return out;
}
