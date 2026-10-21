/**
 * «Слушать»: the lesson's text in parts (dist/tts/<lang>/<slug>.json, written by scripts/prerender.ts from
 * src/core/narration.ts) and the address of a part's recording at the assistant's worker (assistant/src/tts.ts:
 * recorded by Gemini TTS for the first listener, then kept and served to everyone).
 */
import { ASSISTANT_URL } from './assistant';
import type { Narration } from './narration';

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
  if (!r.ok) throw new Error(`tts ${r.status}`);
  return URL.createObjectURL(await r.blob());
}

/** a silent WAV: played right in the tap, it lets iPhone's Safari play the recording that arrives later */
export const silence = () => {
  const b = new Uint8Array(44);
  const v = new DataView(b.buffer);
  [...'RIFF'].forEach((c, i) => v.setUint8(i, c.charCodeAt(0)));
  v.setUint32(4, 36, true);
  [...'WAVEfmt '].forEach((c, i) => v.setUint8(8 + i, c.charCodeAt(0)));
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 24000, true);
  v.setUint32(28, 48000, true);
  v.setUint16(32, 2, true);
  v.setUint16(34, 16, true);
  [...'data'].forEach((c, i) => v.setUint8(36 + i, c.charCodeAt(0)));
  return URL.createObjectURL(new Blob([b], { type: 'audio/wav' }));
};
