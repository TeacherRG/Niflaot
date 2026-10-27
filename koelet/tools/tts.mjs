// Готовая озвучка через Azure AI Speech: npm run voice
// Собирает все тексты (content/<lang>/*.json, locales/<lang>.json), режет на
// предложения (voice-key.js — те же правила, что в игре), разворачивает формы
// рода {он|она} и озвучивает каждое новое предложение в audio/<lang>/<ключ>.mp3.
// Уже озвученные предложения не отправляются повторно; лишние файлы удаляются.
//
//   AZURE_SPEECH_KEY=… AZURE_SPEECH_REGION=westeurope npm run voice
//   --lang=de      только один язык
//   --dry          ничего не отправлять, только посчитать фразы и знаки
//   --rpm=18       запросов в минуту (бесплатный тариф F0 — 20; S0 — можно 600)
//   --jobs=1       запросов одновременно (для S0 — 4…8)
//   --force        озвучить всё заново (например, после смены голоса)
//   --list         вывести JSON {ключ: предложение} (для проверки, без отправки)
// Голоса, скорость и словарь произношения — tools/tts-config.json.
import {existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {collect} from './voice-phrases.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CFG = JSON.parse(readFileSync(join(ROOT, 'tools/tts-config.json'), 'utf8'));
const arg = (n, d) => { const a = process.argv.find(x => x.startsWith(`--${n}=`)); return a ? a.split('=')[1] : d; };
const flag = n => process.argv.includes(`--${n}`);
const LIST = flag('list'), DRY = flag('dry') || LIST, FORCE = flag('force');
const RPM = +arg('rpm', 18), JOBS = Math.max(1, +arg('jobs', 1));
const LANGS = arg('lang') ? [arg('lang')] : Object.keys(CFG.voices);
const KEY = process.env.AZURE_SPEECH_KEY, REGION = process.env.AZURE_SPEECH_REGION;
const ENDPOINT = process.env.AZURE_SPEECH_ENDPOINT || `https://${REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
if (!DRY && (!KEY || !REGION)) { console.error('Нужны переменные AZURE_SPEECH_KEY и AZURE_SPEECH_REGION (или --dry).'); process.exit(1); }

const xml = s => s.replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;'}[c]));
function ssml(lang, text) {
  const lex = (CFG.lexicon || {})[lang] || {}, words = Object.keys(lex).sort((a, b) => b.length - a.length);
  const re = words.length ? new RegExp(`(?<![\\p{L}])(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\p{L}])`, 'gu') : null;
  const s = (re ? text.split(re) : [text]).map((part, i) => i % 2 ? `<sub alias="${xml(lex[part])}">${xml(part)}</sub>` : xml(part)).join('');
  const voice = CFG.voices[lang], locale = voice.split('-').slice(0, 2).join('-');
  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}"><voice name="${voice}"><prosody rate="${CFG.rate || '0%'}">${s}</prosody></voice></speak>`;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
let nextSlot = 0;
async function slot() { const now = Date.now(), at = Math.max(now, nextSlot); nextSlot = at + 60000 / RPM; if (at > now) await sleep(at - now); }
async function synth(lang, text) {
  for (let attempt = 1; ; attempt++) {
    await slot();
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {'Ocp-Apim-Subscription-Key': KEY, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': CFG.format, 'User-Agent': 'koelet-tts'},
      body: ssml(lang, text)
    }).catch(e => ({ok: false, status: 0, statusText: e.message, headers: new Headers()}));
    if (r.ok) return Buffer.from(await r.arrayBuffer());
    if (r.status === 401 || r.status === 403) { console.error(`Azure ${r.status}: проверь AZURE_SPEECH_KEY и AZURE_SPEECH_REGION.`); process.exit(1); }
    if ((r.status === 429 || r.status >= 500 || r.status === 0) && attempt < 6) {
      const wait = (+r.headers.get('retry-after') || 15 * attempt) * 1000;
      console.warn(`  ${r.status || 'сеть'} — жду ${wait / 1000} с`); nextSlot = Date.now() + wait; continue;
    }
    throw new Error(`Azure ${r.status} ${r.statusText}: ${text.slice(0, 60)}`);
  }
}

const sig = lang => `${CFG.voices[lang]} ${CFG.rate} ${CFG.format} ${JSON.stringify((CFG.lexicon || {})[lang] || {})}`;
let failed = 0;
for (const lang of LANGS) {
  if (!CFG.voices[lang]) { console.error(`Нет голоса для «${lang}» в tools/tts-config.json`); process.exit(1); }
  const phrases = collect(lang), dir = join(ROOT, 'audio', lang), idxFile = join(dir, 'index.json');
  const old = existsSync(idxFile) ? JSON.parse(readFileSync(idxFile, 'utf8')) : {};
  const redo = FORCE || (old.voice && old.voice !== sig(lang));
  const have = new Set(redo ? [] : (old.keys || []).filter(k => existsSync(join(dir, k + '.mp3'))));
  const todo = [...phrases].filter(([k]) => !have.has(k));
  if (LIST) { console.log(JSON.stringify(Object.fromEntries(phrases))); continue; }
  const chars = todo.reduce((n, [, s]) => n + s.length, 0);
  console.log(`${lang}: фраз ${phrases.size}, уже есть ${have.size}, озвучить ${todo.length} (${chars} знаков)${redo && !FORCE ? ' — голос или словарь изменились, озвучиваю заново' : ''}`);
  if (DRY) continue;
  mkdirSync(dir, {recursive: true});
  const saveIndex = () => writeFileSync(idxFile, JSON.stringify({voice: sig(lang), keys: [...have].filter(k => phrases.has(k)).sort()}) + '\n');
  let n = 0;
  const queue = [...todo];
  await Promise.all(Array.from({length: JOBS}, async () => {
    for (let item; (item = queue.shift());) {
      const [k, text] = item;
      try { writeFileSync(join(dir, k + '.mp3'), await synth(lang, text)); have.add(k); }
      catch (e) { failed++; console.error('  ✗ ' + e.message); }
      if (++n % 25 === 0) { saveIndex(); console.log(`  ${n}/${todo.length}`); }
    }
  }));
  for (const f of readdirSync(dir)) if (f.endsWith('.mp3') && !phrases.has(f.slice(0, -4))) unlinkSync(join(dir, f));   // устаревшие фразы
  saveIndex();
  console.log(`  ✓ ${lang}: готово ${[...have].filter(k => phrases.has(k)).length}/${phrases.size}`);
}
if (failed) { console.error(`Не удалось озвучить: ${failed}. Запусти ещё раз — готовые фразы не повторяются.`); process.exit(1); }
