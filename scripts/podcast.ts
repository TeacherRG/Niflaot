/**
 * The podcast: every lesson of «Слушать» as one MP3 episode. The parts the worker has recorded (assistant/src/tts.ts,
 * Gemini TTS — `scripts/tts-prerecord.ts` records them ahead) are joined with a short pause, encoded by ffmpeg (MP3,
 * mono, 64 kbit/s, ID3) and uploaded to the GitHub release `podcast` of this repository (public, free, no size limits
 * that matter here). The list of episodes — `episodes.json` in the same release: `{<lang>: {<slug>: {file, id, bytes,
 * seconds}}}`; `scripts/prerender.ts` reads it while building the site and writes the feeds dist/podcast.xml (ru),
 * podcast-en.xml, podcast-de.xml.
 *
 * An episode is made only when ALL parts of the lesson are recorded (the worker never records for this script: no
 * Origin of the site); `id` — the hash of the parts' hashes: a changed text records anew, and its episode is rebuilt
 * under a new file name (the old file is deleted). Nothing changed — nothing is uploaded.
 *
 *   npx tsx scripts/podcast.ts [--lang ru] [--dry]
 * Needs ASSISTANT_URL (the worker), `gh` with GH_TOKEN (contents: write) and ffmpeg; the site — SITE_URL.
 * Run by .github/workflows/podcast.yml after the narration is pre-recorded; changes start a deploy of the site.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LESSONS, PARSHIOT } from '../src/lessons';
import { displayNames } from '../src/core/names';
import { PODCAST_RELEASE, PODCAST_VERSION, episodeTitle, type PodcastEpisodes } from '../src/core/podcast';

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : undefined;
};
const dry = process.argv.includes('--dry');
const LANGS = (arg('lang') ? [arg('lang')] : ['ru', 'en', 'de']) as ('ru' | 'en' | 'de')[];
const SITE = (process.env.SITE_URL ?? 'https://niflaot.mychitas.app').replace(/\/$/, '');
const WORKER = (process.env.ASSISTANT_URL ?? '').replace(/\/$/, '');
if (!WORKER) throw new Error('ASSISTANT_URL is not set');

const TAG = PODCAST_RELEASE.tag;
const gh = (...args: string[]) => execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
const tmp = mkdtempSync(join(tmpdir(), 'podcast-'));

/** the release with the audio: made on the first run */
if (!dry)
  try {
    gh('release', 'view', TAG, '--json', 'tagName');
  } catch {
    gh('release', 'create', TAG, '--title', 'Podcast audio', '--latest=false', '--notes', 'The audio of the Niflaot podcast (scripts/podcast.ts). Do not delete: the feeds link to these files.');
  }

const old: PodcastEpisodes = await fetch(PODCAST_RELEASE.manifest)
  .then((r) => (r.ok ? (r.json() as Promise<PodcastEpisodes>) : {}))
  .catch(() => ({}));
const next: PodcastEpisodes = JSON.parse(JSON.stringify(old));
let changed = 0;
const stale: string[] = [];

/** PCM of our own WAV (assistant/src/tts.ts `wav`): mono, 16 bit; the header — 44 bytes */
function pcmOf(wav: Uint8Array) {
  const v = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
  if (String.fromCharCode(...wav.slice(0, 4)) !== 'RIFF' || v.getUint16(22, true) !== 1 || v.getUint16(34, true) !== 16) throw new Error('not a mono 16-bit WAV');
  return { rate: v.getUint32(24, true), pcm: wav.slice(44, 44 + v.getUint32(40, true)) };
}

for (const lang of LANGS)
  for (const l of LESSONS) {
    if (!l.texts[lang]) continue;
    const r = await fetch(`${SITE}/tts/${lang}/${l.slug}.json`);
    if (!r.ok) continue;
    const { parts } = (await r.json()) as { parts: { h: string }[] };
    const id = createHash('sha256').update(`${PODCAST_VERSION}:${parts.map((p) => p.h).join(',')}`).digest('hex').slice(0, 12);
    if (old[lang]?.[l.slug]?.id === id) continue;

    // every part must be recorded already; a missing one — the episode waits for tomorrow's pre-recording
    const audio: { rate: number; pcm: Uint8Array }[] = [];
    for (const p of parts) {
      const a = await fetch(`${WORKER}/tts/${lang}/${l.slug}/${p.h}.wav`);
      if (!a.ok) break;
      audio.push(pcmOf(new Uint8Array(await a.arrayBuffer())));
    }
    if (audio.length < parts.length) {
      console.log(`${lang} ${l.slug}: ${audio.length} of ${parts.length} parts recorded — later`);
      continue;
    }
    const rate = audio[0].rate;
    if (audio.some((a) => a.rate !== rate)) throw new Error(`${lang} ${l.slug}: parts of different sample rates`);
    // a pause of 0.8 s between the parts (chapters), as the player on the site makes
    const gap = new Uint8Array(Math.round(rate * 0.8) * 2);
    const raw = join(tmp, `${lang}-${l.slug}.pcm`);
    writeFileSync(raw, new Uint8Array());
    audio.forEach((a, k) => {
      if (k) appendFileSync(raw, gap);
      appendFileSync(raw, a.pcm);
    });
    const seconds = Math.round(audio.reduce((s, a) => s + a.pcm.length, gap.length * (audio.length - 1)) / 2 / rate);

    const tx = l.texts[lang]!;
    const file = `${lang}-${l.slug}-${id}.mp3`;
    const out = join(tmp, file);
    const parsha = PARSHIOT[l.parsha].name[lang] ?? PARSHIOT[l.parsha].name.ru;
    const title = displayNames(episodeTitle(tx.title.replace(/<[^>]+>/g, ''), parsha));
    execFileSync('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-f', 's16le', '-ar', String(rate), '-ac', '1', '-i', raw,
      // 44.1 kHz — what every podcast app plays without a hitch
      '-ar', '44100', '-ac', '1', '-codec:a', 'libmp3lame', '-b:a', '64k',
      '-id3v2_version', '3', '-metadata', `title=${title}`, '-metadata', 'artist=Niflaot · MyChitas',
      '-metadata', `album=${{ ru: 'Нифлаот', en: 'Niflaot', de: 'Niflaot' }[lang]}`, '-metadata', 'genre=Podcast',
      out,
    ]);
    const bytes = readFileSync(out).length;
    console.log(`${lang} ${l.slug}: ${parts.length} parts, ${Math.round(seconds / 60)} min, ${(bytes / 1e6).toFixed(1)} MB → ${file}`);
    if (!dry) gh('release', 'upload', TAG, out, '--clobber');
    const was = old[lang]?.[l.slug]?.file;
    if (was && was !== file) stale.push(was);
    (next[lang] ??= {})[l.slug] = { file, id, bytes, seconds };
    changed++;
  }

if (!changed) {
  console.log('podcast: nothing new');
  process.exit(0);
}
if (dry) {
  console.log(`podcast: ${changed} episodes would be uploaded (--dry)`);
  process.exit(0);
}
const manifest = join(tmp, 'episodes.json');
writeFileSync(manifest, JSON.stringify(next, null, 1));
gh('release', 'upload', TAG, manifest, '--clobber');
// the old files only after the new list is up: a feed built meanwhile never links to a deleted file
for (const f of stale)
  try {
    gh('release', 'delete-asset', TAG, f, '--yes');
  } catch {
    console.log(`could not delete ${f}`);
  }
console.log(`podcast: ${changed} episodes uploaded`);
// the feeds are written by the site's build: tell the workflow to deploy
if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, 'changed=true\n');
