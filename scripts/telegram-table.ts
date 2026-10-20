/**
 * «К шабатнему столу» в Telegram — каждую пятницу утром: пост с загадкой для детей (только вопрос — ответ на листе)
 * и вторым сообщением PDF листа главы (`#/shabbat-table/<глава>`, ShabbatTable.tsx, src/core/shabbatTable.ts) на языке
 * канала — тот же лист, что даёт «Печать» на сайте. Глава — та, чей Шабат наступает в ближайшие 6 дней (по пятницам —
 * завтра); нет такой главы с уроками — ничего не публикуется. В Шабат — даже при ручном запуске ничего.
 *
 * Запускает `.github/workflows/telegram-table.yml`: по пятницам, попытки каждые 10 минут с 8:00 по Вене (GitHub
 * опаздывает и пропускает запуски); первая дошедшая публикует и оставляет метку дня в кэше Actions
 * (`TABLE_POSTED_FILE`, ключ `table-posted-<дата>`) — остальные попытки ничего не делают.
 * Каналы и бот — те же, что у «Загадки недели»: secret `TELEGRAM_BOT_TOKEN`, variables `TELEGRAM_CHAT_RU/EN/DE`;
 * язык без канала пропускается; с variable `TELEGRAM_APP` — кнопка «открыть лист» внутри Telegram.
 *
 * Проверить без отправки: `npx tsx scripts/telegram-table.ts --dry [--date 2026-10-23] [--pdf]` (`--pdf` — сохранить
 * PDF в `table-<глава>-<язык>.pdf`; `PDF_SITE=http://localhost:4173` — локальная копия сайта, `CHROMIUM_PATH` — свой
 * браузер; нужен playwright: `npm i --no-save playwright`).
 */
import { writeFileSync } from 'node:fs';
import { LESSON_GROUPS, PARSHIOT, type ParshaId } from '../src/lessons';
import { tableSheet } from '../src/core/shabbatTable';
import { displayNames } from '../src/core/names';
import { civilDate, jewishDate } from '../src/core/hebrewDate';
import { routeLink, SITE_URL } from '../src/core/site';
import { miniAppLink } from '../src/core/telegram';
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
const now = new Date();

const markDone = (why: string) => {
  if (process.env.TABLE_POSTED_FILE && !DRY) writeFileSync(process.env.TABLE_POSTED_FILE, `${now.toISOString().slice(0, 10)} ${why}\n`);
};
// a scheduled run posts from 8:00 Vienna time on (the workflow skips earlier attempts too)
const fired = process.env.TELEGRAM_SCHEDULE;
if (fired && !DRY) {
  const viennaHour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Vienna', hour: 'numeric', hourCycle: 'h23' }).format(now));
  if (viennaHour < 8) {
    console.log(`cron «${fired}»: в Вене ${viennaHour} ч — рано, публикует следующая попытка.`);
    process.exit(0);
  }
}
const wd = now.getUTCDay();
if (!DRY && (wd === 6 || (wd === 5 && now.getUTCHours() >= 12))) {
  console.log('Шабат — сегодня не публикуем.');
  markDone('shabbat');
  process.exit(0);
}

const date = dateArg >= 0 ? args[dateArg + 1] : now.toISOString().slice(0, 10);
const plusDays = (d: string, n: number) => new Date(Date.parse(`${d}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
// the Shabbat of this week: within the next 6 days (on a Friday — tomorrow)
const group = LESSON_GROUPS.find((g) => g.shabbat > date && g.shabbat <= plusDays(date, 6));
const sheet = group && tableSheet(group.id as ParshaId);
if (!group || !sheet) {
  console.log(`${date}: у главы этой недели нет уроков — листа нет, не публикуем.`);
  markDone('no sheet');
  process.exit(0);
}
const parsha = group.id as ParshaId;
const route = `shabbat-table/${parsha}`;

const html = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (loc: Loc, key: string, vars: Record<string, string | number> = {}) =>
  String((UI[loc] as Record<string, unknown>)[key] ?? (ru as Record<string, unknown>)[key]).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const nameOf = (loc: Loc) => PARSHIOT[parsha].name[loc as keyof (typeof PARSHIOT)[ParshaId]['name']] ?? PARSHIOT[parsha].name.ru;

function post(loc: Loc): string {
  const lines = [
    `📄 <b>${html(t(loc, 'table.post.title', { parsha: nameOf(loc) }))}</b> · פרשת ${PARSHIOT[parsha].he}`,
    `${html(t(loc, 'print.shabbat'))}, ${html(civilDate(group!.shabbat, loc))} · ${jewishDate(group!.shabbat)}`,
    '',
    html(t(loc, 'table.post.lead')),
  ];
  // the first riddle of the sheet: only the question — the answer is on paper
  const f = sheet!.facts[0];
  if (f) {
    const text = f.lesson.texts[loc] ?? f.lesson.texts.ru!;
    const he = f.kind === 'eq' ? f.q : f.from;
    const gloss = he.split(' + ').map((w) => text.glossary[w]).filter(Boolean).join(' + ');
    const q = f.kind === 'eq' ? t(loc, 'facts.qEq') : t(loc, `facts.qLt.${f.take}`);
    lines.push('', `🧒 <b>${html(t(loc, 'table.post.riddle'))}</b> ${html(q)} ${displayNames(he)}${gloss ? ` (${html(gloss)})` : ''}?`, html(t(loc, 'table.post.answer')));
  }
  lines.push('', `👉 ${html(routeLink(route, 'channel', loc))}`, '', `<i>ושננתם לבניך ודברת בם</i> — ${html(t(loc, 'slogan'))} (${html(t(loc, 'slogan.ref'))})`);
  return lines.join('\n');
}

const buttons = (loc: Loc) =>
  APP ? { reply_markup: { inline_keyboard: [[{ text: `📄 ${t(loc, 'table.title')}`, url: miniAppLink(APP, route, loc) }]] } } : {};

/** The sheet as «Печать» makes it: the live site's page in a headless browser, saved as A4 PDF. */
async function sheetPdf(loc: Loc): Promise<Uint8Array> {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const page = await browser.newPage();
    await page.route(/goatcounter/, (r) => r.abort());
    // a machine: no onboarding, the children's mode (the sheet is the same in both)
    await page.addInitScript(() => {
      localStorage.setItem('niflaot:mode', 'kids');
      localStorage.setItem('niflaot:hebrew', 'letters');
    });
    await page.goto(`${process.env.PDF_SITE || SITE_URL}/?lang=${loc}#/${route}`, { waitUntil: 'load' });
    await page.waitForSelector('.st-head', { timeout: 60_000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => ((i.onload = r), (i.onerror = r))))));
    });
    await page.emulateMedia({ media: 'print' });
    return await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
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

async function tgFile(chat: string, pdf: Uint8Array, name: string, caption: string) {
  const form = new FormData();
  form.append('chat_id', chat);
  form.append('caption', caption);
  form.append('document', new Blob([pdf], { type: 'application/pdf' }), name);
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, { method: 'POST', body: form });
  const json = (await res.json()) as { ok: boolean; description?: string };
  if (!json.ok) throw new Error(`sendDocument: ${json.description}`);
}

if (!DRY && !Object.values(CHATS).some(Boolean)) throw new Error('no channel: set TELEGRAM_CHAT_RU / _EN / _DE (Variables or Secrets)');
let failed = false;
for (const loc of Object.keys(UI) as Loc[]) {
  const text = post(loc);
  if (DRY) {
    console.log(`── ${loc} (${CHATS[loc] ?? 'нет канала'})\n${text}\n${APP ? `${JSON.stringify(buttons(loc).reply_markup)}\n` : ''}`);
    if (PDF_ONLY) {
      const file = `table-${parsha}-${loc}.pdf`;
      writeFileSync(file, await sheetPdf(loc));
      console.log(`PDF: ${file}`);
    }
    continue;
  }
  const chat = CHATS[loc];
  if (!chat) continue;
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  try {
    await tg('sendMessage', { chat_id: chat, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, ...buttons(loc) });
    console.log(`${loc}: posted ${parsha} to ${chat}`);
    markDone('posted');
  } catch (e) {
    console.error(`${loc}: ${(e as Error).message}`);
    failed = true;
    continue;
  }
  try {
    const pdf = await sheetPdf(loc);
    await tgFile(chat, pdf, `niflaot-${parsha}-${loc}.pdf`, t(loc, 'table.post.pdf', { parsha: nameOf(loc) }));
    console.log(`${loc}: PDF ${Math.round(pdf.length / 1024)} KB sent`);
  } catch (e) {
    console.error(`${loc}: PDF — ${(e as Error).message}`);
    failed = true;
  }
}
if (failed) process.exit(1);
