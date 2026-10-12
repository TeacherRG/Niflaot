/**
 * «Пророки и Писания» — отрывок дня в Telegram-каналы (ru / en / de) каждый учебный день цикла: что читать сегодня
 * (раздел, книга и стихи), сколько это займёт и ссылки на страницы дня (`#/neviim/<дата>`, `#/ketuvim/<дата>`,
 * метка `?ref=channel` для GoatCounter). Запускает GitHub Action `.github/workflows/telegram-tanakh.yml` каждое утро.
 * В день без чтения (Шабат, праздник, 9 ава — их нет в src/tanakh/cycle.json) ничего не публикуется; в Шабат —
 * даже при ручном запуске.
 *
 * Каналы и бот — те же, что у «Загадки недели» (scripts/telegram-post.ts): secret `TELEGRAM_BOT_TOKEN`,
 * variables `TELEGRAM_CHAT_RU`, `TELEGRAM_CHAT_EN`, `TELEGRAM_CHAT_DE`; язык без канала пропускается.
 *
 * Проверить без отправки: `npx tsx scripts/telegram-tanakh.ts --dry` (`--date 2026-10-12` — другой день).
 */
import { readFileSync } from 'node:fs';
import { CYCLE, readingMinutes, type DayContent } from '../src/core/tanakh';
import { rangeLabel, SECTIONS, type Section } from '../src/core/tanakhCycle';
import { civilDate, jewishDate } from '../src/core/hebrewDate';
import { routeLink } from '../src/core/site';
import ru from '../src/i18n/locales/ru';
import en from '../src/i18n/locales/en';
import de from '../src/i18n/locales/de';

const UI = { ru, en, de } as const;
type Loc = keyof typeof UI;
const CHATS: Record<Loc, string | undefined> = {
  ru: process.env.TELEGRAM_CHAT_RU,
  en: process.env.TELEGRAM_CHAT_EN,
  de: process.env.TELEGRAM_CHAT_DE,
};
const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const dateArg = args.indexOf('--date');
const SECTION_HE: Record<Section, string> = { neviim: 'נביאים', ketuvim: 'כתובים' };

const now = new Date();
const wd = now.getUTCDay();
if (!DRY && (wd === 6 || (wd === 5 && now.getUTCHours() >= 12))) {
  console.log('Шабат — сегодня не публикуем.');
  process.exit(0);
}
// the run is early in the morning in Europe: the UTC date is the readers' date
const date = dateArg >= 0 ? args[dateArg + 1] : now.toISOString().slice(0, 10);
const index = CYCLE.findIndex((d) => d.date === date);
if (index < 0) {
  console.log(`${date}: чтения нет (Шабат, праздник или вне цикла) — не публикуем.`);
  process.exit(0);
}
const day = CYCLE[index];
const content = JSON.parse(readFileSync(new URL(`../public/tanakh/${date}.json`, import.meta.url), 'utf8')) as DayContent;
// the project's translation where the whole day is translated (as on the site), otherwise English
const ready = (l: 'ru' | 'de') => SECTIONS.every((s) => content[s].verses.every((v) => v[l]));

const html = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (loc: Loc, key: string, vars: Record<string, string | number> = {}) =>
  String((UI[loc] as Record<string, unknown>)[key] ?? (ru as Record<string, unknown>)[key]).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));

function post(loc: Loc): string {
  const tr = (loc === 'ru' || loc === 'de') && ready(loc) ? loc : 'en';
  const lines = [
    `📜 <b>${html(t(loc, 'tanakh.post.title'))}</b>`,
    `${html(civilDate(date, loc))} · ${jewishDate(date)} · ${html(t(loc, 'tanakh.day', { n: index + 1, total: CYCLE.length }))}`,
  ];
  for (const s of SECTIONS) {
    const verses = content[s].verses;
    const plain = readingMinutes(verses, true, tr, false);
    const withSt = readingMinutes(verses, true, tr, true);
    lines.push(
      '',
      `📖 <b>${html(t(loc, `tanakh.${s}`))}</b> ${SECTION_HE[s]} — ${html(rangeLabel(s, day[s], loc))}`,
      `⏱ ${html(t(loc, 'tanakh.readingTime', { n: plain }))} · ${html(t(loc, 'tanakh.post.withSt', { n: withSt }))}`,
      `👉 ${html(routeLink(`${s}/${date}`, 'channel', loc))}`,
    );
  }
  return lines.join('\n');
}

async function tg(method: string, body: object) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; description?: string };
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
}

let failed = false;
for (const loc of Object.keys(UI) as Loc[]) {
  const text = post(loc);
  if (DRY) {
    console.log(`── ${loc} (${CHATS[loc] ?? 'нет канала'})\n${text}\n`);
    continue;
  }
  const chat = CHATS[loc];
  if (!chat) continue;
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  try {
    await tg('sendMessage', { chat_id: chat, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true } });
    console.log(`${loc}: posted ${date} to ${chat}`);
  } catch (e) {
    console.error(`${loc}: ${(e as Error).message}`);
    failed = true;
  }
}
if (failed) process.exit(1);
