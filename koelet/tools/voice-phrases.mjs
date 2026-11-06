// Все предложения, которые может сказать Хранитель, для одного языка: Map ключ → текст.
// Общий модуль для tools/tts.mjs (озвучка) и tests/playthrough.mjs (проверка покрытия).
import {createRequire} from 'node:module';
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const VoiceKey = createRequire(import.meta.url)('../voice-key.js');

/* Поля, которые никогда не произносятся (технические значения, иврит). */
const SKIP_FIELDS = new Set(['type', 'key', 'ic', 'game', 'art', 'mood', 'age', 'tool', 'who', 'he', 'heb', 'id', 'v', 'file', 'src', 'color', 'hair', 'skin', 'style', 'theme', 'img']);
/* Строки интерфейса, которые Хранитель не читает: окно «О приложении», отчёт, сертификат, источники. */
const SKIP_UI = /^(about|doc|lesson|report|rep|cert|final\.foot|donate|shab|pasuk|hy|gal|adm|door|parsha|lang|share|hud|menu|ach|toast|audio|gate)\b/;
/* Подстановки {{x}} разворачиваются всеми значениями полей «x» из content (например,
   {{what}} → «монет», «идей»…; {{name}} → названия миров). Для {{name}} есть ещё вариант
   без имени: так озвучены фразы с именем героя (игра уберёт имя при поиске).
   Фразы с другими подстановками (числа, списки) говорит голос браузера. */

const read = p => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
export function collect(lang) {
  const texts = [], values = {};                    // values: поле → все его значения в content
  const walk = (v, field, own) => {
    if (typeof v === 'string') {
      if (SKIP_FIELDS.has(field) || !/\p{L}/u.test(v)) return;
      if (own) (values[field] = values[field] || new Set()).add(v);
      // одно латинское слово строчными — технический код (pic, item…) или английское значение
      // подстановки («ideas» для {{what}}): само по себе не произносится, но в подстановки идёт
      if (!/^[a-z0-9_.-]+$/.test(v)) texts.push(v);
    }
    else if (Array.isArray(v)) v.forEach(x => walk(x, field, own));
    else if (v && typeof v === 'object') for (const k in v) if (!SKIP_FIELDS.has(k) && k !== '__ag') walk(v[k], k === 'y' || k === 't' || k === 'a' ? field : k, own);
  };
  const dir = join(ROOT, 'content', lang);
  for (const f of readdirSync(dir)) if (f.endsWith('.json') && f !== 'parsha.json') walk(read(`content/${lang}/${f}`), '', true);
  const ui = read(`locales/${lang}.json`);
  for (const k in ui) if (!SKIP_UI.test(k)) walk(ui[k], '', false);
  values.name = new Set([...(values.name || []), ui['map.proName'], '']);

  const out = new Map();                              // ключ → текст для синтеза
  const add = s => { for (const x of VoiceKey.sentences(s)) { const k = VoiceKey.key(x); if (k && !out.has(k)) out.set(k, x); } };
  const gender = (s, g) => s.replace(/\{([^{}|]*)\|([^{}|]*)\}/g, (_, m, f) => g ? f : m);
  for (const s of texts) {
    for (const g of [0, 1]) {                           // мальчик / девочка
      for (const sent of VoiceKey.sentences(gender(s, g))) {
        const vars = [...new Set([...sent.matchAll(/\{\{(\w+)\}\}/g)].map(m => m[1]))];
        if (vars.some(v => !values[v])) continue;
        let variants = [sent];
        for (const v of vars) variants = variants.flatMap(x => [...values[v]].map(val => x.split(`{{${v}}}`).join(gender(val, g))));
        variants.forEach(add);
      }
    }
  }
  return out;
}
