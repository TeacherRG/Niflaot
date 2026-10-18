/**
 * «Пророки и Писания» — отрывок дня в Telegram-каналы (ru / en / de) каждый учебный день цикла: что читать сегодня
 * (раздел, книга и стихи), сколько это займёт и ссылки на страницы дня (`#/neviim/<дата>`, `#/ketuvim/<дата>`,
 * метка `?ref=channel` для GoatCounter). Запускает GitHub Action `.github/workflows/telegram-tanakh.yml` каждое утро:
 * попытки каждые 5 минут с 6:00 по Вене (GitHub запускает по расписанию с опозданием, а иногда пропускает); публикует
 * первая, что дошла; что сегодня уже сделано — опубликовано или публиковать нечего (Шабат, день без чтения), — workflow
 * помнит сам (файл-метка в кэше Actions, `TANAKH_POSTED_FILE`), и остальные попытки дня ничего не делают.
 * В день без чтения (Шабат, праздник, 9 ава — их нет в src/tanakh/cycle.json) ничего не публикуется; в Шабат —
 * даже при ручном запуске.
 *
 * Каналы и бот — те же, что у «Загадки недели» (scripts/telegram-post.ts): secret `TELEGRAM_BOT_TOKEN`,
 * variables `TELEGRAM_CHAT_RU`, `TELEGRAM_CHAT_EN`, `TELEGRAM_CHAT_DE`; язык без канала пропускается; с variable
 * `TELEGRAM_APP` (Mini App, `<бот>/<приложение>`) — под постом кнопки «Пророки» и «Писания»: страница дня внутри Telegram.
 *
 * Вторым сообщением — **PDF дня для печати**: страница дня с сайта, сохранённая браузером (Playwright) так же, как
 * кнопка «Распечатать»: иврит и перевод на языке канала, с Мецудат Давид, «Пророки» и «Писания» вместе. Не вышел PDF —
 * текст всё равно уходит, запуск — красный.
 *
 * Проверить без отправки: `npx tsx scripts/telegram-tanakh.ts --dry` (`--date 2026-10-12` — другой день;
 * `--pdf` — ещё и сохранить PDF в `tanakh-<дата>-<язык>.pdf`, нужен playwright: `npm i --no-save playwright`).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { CYCLE, readingMinutes, type DayContent } from '../src/core/tanakh';
import { rangeLabel, SECTIONS, type Section } from '../src/core/tanakhCycle';
import { civilDate, jewishDate } from '../src/core/hebrewDate';
import { routeLink, SITE_URL } from '../src/core/site';
import { miniAppLink } from '../src/core/telegram';
import { wordOfDay, type DayWords, type Word } from '../src/core/words';
import WORDS from '../src/tanakh/words.json';
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
const APP = process.env.TELEGRAM_APP;
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const PDF_ONLY = args.includes('--pdf');
const dateArg = args.indexOf('--date');
const SECTION_HE: Record<Section, string> = { neviim: 'נביאים', ketuvim: 'כתובים' };

const now = new Date();
// a scheduled run posts from 6:00 Vienna time on (the workflow already skips earlier ones; this is the same rule)
const fired = process.env.TELEGRAM_SCHEDULE;
if (fired && !DRY) {
  const viennaHour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Vienna', hour: 'numeric', hourCycle: 'h23' }).format(now));
  if (viennaHour < 6) {
    console.log(`cron «${fired}»: в Вене ${viennaHour} ч — рано, публикует следующая попытка.`);
    process.exit(0);
  }
}
/** today is done — posted, or nothing to post: the workflow saves this mark, and the later attempts of the day skip */
const markDone = (why: string) => {
  if (process.env.TANAKH_POSTED_FILE && !DRY) writeFileSync(process.env.TANAKH_POSTED_FILE, `${now.toISOString().slice(0, 10)} ${why}\n`);
};
const wd = now.getUTCDay();
if (!DRY && (wd === 6 || (wd === 5 && now.getUTCHours() >= 12))) {
  console.log('Шабат — сегодня не публикуем.');
  markDone('shabbat');
  process.exit(0);
}
// the run is early in the morning in Europe: the UTC date is the readers' date
const date = dateArg >= 0 ? args[dateArg + 1] : now.toISOString().slice(0, 10);
const index = CYCLE.findIndex((d) => d.date === date);
if (index < 0) {
  console.log(`${date}: чтения нет (Шабат, праздник или вне цикла) — не публикуем.`);
  markDone('no reading');
  process.exit(0);
}
const day = CYCLE[index];
const content = JSON.parse(readFileSync(new URL(`../public/tanakh/${date}.json`, import.meta.url), 'utf8')) as DayContent;
// the project's translation where the whole day is translated (as on the site), otherwise English
const ready = (l: 'ru' | 'de') => SECTIONS.every((s) => content[s].verses.every((v) => v[l]));

// «Слово дня» — from both passages of the day (src/core/words.ts), with the project's translation in the channel's language
const dayWords = JSON.parse(readFileSync(new URL(`../public/tanakh/words/${date}.json`, import.meta.url), 'utf8')) as DayWords;
const wordTr = (loc: Loc) => JSON.parse(readFileSync(new URL(`../src/tanakh/words/${loc}.json`, import.meta.url), 'utf8')) as Record<string, string>;

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
    const plain = readingMinutes(verses, true, tr, { md: false, rashi: false });
    const withComm = readingMinutes(verses, true, tr, { md: true, rashi: false });
    lines.push(
      '',
      `📖 <b>${html(t(loc, `tanakh.${s}`))}</b> ${SECTION_HE[s]} — ${html(rangeLabel(s, day[s], loc))}`,
      `⏱ ${html(t(loc, 'tanakh.readingTime', { n: plain }))} · ${html(t(loc, 'tanakh.post.withComm', { n: withComm }))}`,
      `👉 ${html(routeLink(`${s}/${date}`, 'channel', loc))}`,
    );
  }
  const wtr = wordTr(loc);
  const w: Word | undefined = wordOfDay(dayWords, (WORDS as { words: Word[] }).words, wtr);
  if (w)
    lines.push(
      '',
      `🔤 <b>${html(t(loc, 'words.post'))}:</b> ${w.he} — ${html(wtr[w.id])}`,
      `${w.root ? `${html(t(loc, 'words.root'))} ${w.root} · ` : ''}${html(t(loc, 'words.count', { n: w.n }))}`,
      `👉 ${html(routeLink('words', 'channel', loc))}`,
    );
  return lines.join('\n');
}

/** the Mini App buttons: the day's two pages on the site, inside Telegram */
const buttons = (loc: Loc) =>
  APP
    ? { reply_markup: { inline_keyboard: [SECTIONS.map((s) => ({ text: `📖 ${t(loc, `tanakh.${s}`)}`, url: miniAppLink(APP, `${s}/${date}`, loc) }))] } }
    : {};

/**
 * The day's printout, as the «Распечатать» button makes it: the live site's page of the day in a headless browser —
 * the Hebrew and the translation in the channel's language, with Metzudat David, both sections — saved as A4 PDF.
 */
const VIEW: Record<Loc, string> = { ru: 'he-ru', en: 'he-en', de: 'he-de' };
async function dayPdf(loc: Loc): Promise<Uint8Array> {
  const { chromium } = await import('playwright');
  // CHROMIUM_PATH — a browser already on the machine (locally); in GitHub Actions playwright installs its own
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const page = await browser.newPage();
    // a machine's visit — not counted in the statistics
    await page.route(/goatcounter/, (r) => r.abort());
    await page.addInitScript(
      ([view]) => {
        localStorage.setItem('niflaot:tanakh-view', JSON.stringify({ text: view, md: true, rashi: false, de: true }));
        localStorage.setItem('niflaot:tanakh-print-both', '1');
      },
      [VIEW[loc]],
    );
    // PDF_SITE — another copy of the site (a local `npm run dev` / `vite preview`), for checking without the live one
    await page.goto(`${process.env.PDF_SITE || SITE_URL}/?lang=${loc}#/neviim/${date}`, { waitUntil: 'load' });
    // the second section is in the page only for print (hidden on screen): attached, not visible
    await page.waitForSelector('.tk-print-other .tk-verse', { state: 'attached', timeout: 60_000 });
    await page.evaluate(() => document.fonts.ready);
    return await page.pdf({ format: 'A4', printBackground: true });
  } finally {
    await browser.close();
  }
}

async function tgFile(chat: string, pdf: Uint8Array, name: string, caption: string) {
  const form = new FormData();
  form.append('chat_id', chat);
  form.append('caption', caption);
  form.append('document', new Blob([pdf], { type: 'application/pdf' }), name);
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, { method: 'POST', body: form });
  const json = (await res.json()) as { ok: boolean; description?: string };
  if (!json.ok) throw new Error(`sendDocument: ${json.description}`);
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

if (!DRY && !Object.values(CHATS).some(Boolean)) throw new Error('no channel: set TELEGRAM_CHAT_RU / _EN / _DE (Variables or Secrets)');
let failed = false;
for (const loc of Object.keys(UI) as Loc[]) {
  const text = post(loc);
  if (DRY) {
    console.log(`── ${loc} (${CHATS[loc] ?? 'нет канала'})\n${text}\n${APP ? `${JSON.stringify(buttons(loc).reply_markup)}\n` : ''}`);
    if (PDF_ONLY) {
      const file = `tanakh-${date}-${loc}.pdf`;
      writeFileSync(file, await dayPdf(loc));
      console.log(`PDF: ${file}`);
    }
    continue;
  }
  const chat = CHATS[loc];
  if (!chat) continue;
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  try {
    await tg('sendMessage', { chat_id: chat, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, ...buttons(loc) });
    console.log(`${loc}: posted ${date} to ${chat}`);
    markDone('posted');
  } catch (e) {
    console.error(`${loc}: ${(e as Error).message}`);
    failed = true;
    continue;
  }
  try {
    const pdf = await dayPdf(loc);
    await tgFile(chat, pdf, `niflaot-${date}.pdf`, t(loc, 'tanakh.post.pdf', { date: civilDate(date, loc) }));
    console.log(`${loc}: PDF ${Math.round(pdf.length / 1024)} KB sent`);
  } catch (e) {
    console.error(`${loc}: PDF — ${(e as Error).message}`);
    failed = true;
  }
}
if (failed) process.exit(1);
