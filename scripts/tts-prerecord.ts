/**
 * «Слушать»: records the parts ahead, so no listener waits — every part of the lessons (their parts are on the site,
 * `SITE_URL/tts/<lang>/<slug>.json`) and the passages of the Prophets / Writings from today for `--days` days (only days
 * translated into the language — src/core/tanakhNarration.ts, the same code as the page and the worker). A part that is
 * recorded already comes back at once; a new one is recorded by the worker (assistant/src/tts.ts) with Gemini TTS.
 * The worker lets 20 new recordings a minute from one address through (`LIMITER`), so the parts go one by one; Gemini's
 * per-minute limit — wait and go on, its daily limit (100 recordings a day per model on the paid Tier 1) — stop (the
 * reason comes from the worker in `X-Quota`); a failure of Gemini (502, the reason — `X-Error`) is tried once more, and after two
 * failed parts in a row the rest of that lesson / day is left for the next run (failures spend the limit too).
 *
 *   npx tsx scripts/tts-prerecord.ts [--lang ru] [--days 14] [--lessons-only] [--dry]
 * Needs ASSISTANT_URL (the worker); the site — SITE_URL (default https://niflaot.mychitas.app).
 * Run by .github/workflows/tts-prerecord.yml.
 */
import { readFileSync, existsSync } from 'node:fs';
import { LESSONS } from '../src/lessons';
import { tanakhLang, tanakhNarration, tanakhSlug } from '../src/core/tanakhNarration';
import { CYCLE, localToday } from '../src/core/tanakh';

const arg = (name: string, def: string) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : def;
};
const flag = (name: string) => process.argv.includes(`--${name}`);
const lang = arg('lang', 'ru') as 'ru' | 'en' | 'de';
const days = Number(arg('days', '14'));
const SITE = (process.env.SITE_URL ?? 'https://niflaot.mychitas.app').replace(/\/$/, '');
const WORKER = (process.env.ASSISTANT_URL ?? '').replace(/\/$/, '');
if (!WORKER && !flag('dry')) throw new Error('ASSISTANT_URL is not set');

const jobs: { slug: string; label: string; h: string }[] = [];
for (const l of LESSONS) {
  if (!l.texts[lang]) continue;
  const r = await fetch(`${SITE}/tts/${lang}/${l.slug}.json`);
  if (!r.ok) {
    console.log(`${l.slug}: no parts on the site yet (${r.status})`);
    continue;
  }
  const n = (await r.json()) as { parts: { h: string; label: string }[] };
  n.parts.forEach((p, k) => jobs.push({ slug: l.slug, label: `${l.slug} ${k + 1}/${n.parts.length}`, h: p.h }));
}
if (!flag('lessons-only')) {
  const today = localToday();
  for (const d of CYCLE.filter((x) => x.date >= today).slice(0, days)) {
    const file = `public/tanakh/${d.date}.json`;
    if (!existsSync(file)) continue;
    const day = JSON.parse(readFileSync(file, 'utf8'));
    if (tanakhLang(day, lang) !== lang) continue;
    for (const s of ['neviim', 'ketuvim'] as const) {
      const n = await tanakhNarration(day, s, lang);
      n?.parts.forEach((p, k) => jobs.push({ slug: tanakhSlug(s, d.date), label: `${s} ${d.date} ${k + 1}/${n.parts.length}`, h: p.h }));
    }
  }
}
console.log(`${jobs.length} parts (${lang})`);
if (flag('dry')) process.exit(0);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let fresh = 0, ready = 0, failed = 0;
// a lesson / day whose parts fail one after another: each failure costs Gemini requests of the day's limit too
// (25.10.2026 «Ноах» failed in every part and took the day's limit) — after two failed parts in a row the rest of it waits
const failing = new Map<string, number>();
const skipped = new Set<string>();
for (const j of jobs) {
  if ((failing.get(j.slug) ?? 0) >= 2) {
    skipped.add(j.slug);
    continue;
  }
  for (let attempt = 0; ; attempt++) {
    const t = Date.now();
    const r = await fetch(`${WORKER}/tts/${lang}/${j.slug}/${j.h}.wav`, { headers: { Origin: SITE } });
    const ms = Date.now() - t;
    if (r.ok) {
      await r.arrayBuffer();
      // a part from storage comes back in well under a second; a new recording takes seconds
      if (ms > 1500) fresh++, console.log(`recorded ${j.label} (${(ms / 1000).toFixed(1)} s)`);
      else ready++;
      failing.set(j.slug, 0);
      // the rate limit: 20 new recordings a minute
      if (ms > 1500) await sleep(3500);
      break;
    }
    const body = await r.text();
    if (r.status === 503 && body === 'quota') {
      // which limit (assistant/src/tts.ts): per minute — wait and go on; per day — stop
      const why = r.headers.get('X-Quota') ?? '';
      const wait = Number(r.headers.get('Retry-After') ?? 60);
      console.log(`quota at ${j.label}: ${why || '?'} (retry after ${wait} s)`);
      if (/PerDay/i.test(why) || wait > 600 || attempt >= 5) throw new Error(`the quota of Gemini is spent — stopped at ${j.label}; recorded ${fresh}, ready ${ready}`);
      await sleep(Math.max(wait, 30) * 1000);
      continue;
    }
    if (r.status === 429 && attempt < 3) {
      await sleep(60_000);
      continue;
    }
    // what Gemini answered (assistant/src/tts.ts)
    const why = `${r.status} ${body.slice(0, 100)}${r.headers.get('X-Error') ? ` — ${r.headers.get('X-Error')}` : ''}`;
    // Gemini fails now and then for a minute (the worker answers 502): once more after a pause
    if (r.status === 502 && attempt < 1) {
      console.log(`retry ${j.label}: ${why}`);
      await sleep(30_000);
      continue;
    }
    failed++;
    failing.set(j.slug, (failing.get(j.slug) ?? 0) + 1);
    console.log(`FAILED ${j.label}: ${why}`);
    break;
  }
}
console.log(`done: recorded ${fresh}, already there ${ready}, failed ${failed}`);
if (skipped.size) console.log(`skipped after failures (the next run tries again): ${[...skipped].join(', ')}`);
if (failed) process.exit(1);
