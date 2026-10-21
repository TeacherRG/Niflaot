/**
 * «Слушать»: the lesson's text in parts (dist/tts/<lang>/<slug>.json, written by scripts/prerender.ts from
 * src/core/narration.ts) and the address of a part's recording at the assistant's worker (assistant/src/tts.ts:
 * recorded by Gemini TTS for the first listener, then kept and served to everyone).
 */
import { ASSISTANT_URL } from './assistant';
import type { Narration } from './speech';

/** the site's root (as in src/core/tanakh.ts): the build uses relative paths, the code lives in /assets/ */
const up = '..';
const root = () => (import.meta.env.DEV ? import.meta.env.BASE_URL : new URL(up, import.meta.url).href);

const cache = new Map<string, Promise<Narration | null>>();

/** null — no recording for this lesson (no assistant, or a dev build without the prerendered texts) */
export function loadNarration(lang: string, slug: string): Promise<Narration | null> {
  if (!ASSISTANT_URL) return Promise.resolve(null);
  const key = `${lang}/${slug}`;
  let p = cache.get(key);
  if (!p) {
    p = fetch(`${root()}tts/${key}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<Narration>) : null))
      .catch(() => (cache.delete(key), null));
    cache.set(key, p);
  }
  return p;
}

export const partUrl = (lang: string, slug: string, h: string) => `${ASSISTANT_URL.replace(/\/$/, '')}/tts/${lang}/${slug}/${h}.wav`;

/** a recording as a blob: address; the first time the worker records it (up to a minute) */
export async function fetchPart(lang: string, slug: string, h: string, signal?: AbortSignal): Promise<string> {
  const r = await fetch(partUrl(lang, slug, h), { signal });
  // 503 «quota» — Gemini's limit of the day is spent (assistant/src/tts.ts)
  if (!r.ok) throw new Error(r.status === 503 && (await r.text().catch(() => '')) === 'quota' ? 'quota' : `tts ${r.status}`);
  return URL.createObjectURL(await r.blob());
}

/**
 * 0.1 s of a silent WAV: played right in the tap, it lets Safari (iPhone, iPad) play the recording that arrives later.
 * Not empty: Safari refuses a file without samples, and then the element stays locked.
 */
export const silence = () => {
  const n = 2400 * 2;
  const b = new Uint8Array(44 + n);
  const v = new DataView(b.buffer);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  v.setUint32(4, 36 + n, true);
  str(8, 'WAVEfmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 24000, true);
  v.setUint32(28, 48000, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  str(36, 'data');
  v.setUint32(40, n, true);
  return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
};
