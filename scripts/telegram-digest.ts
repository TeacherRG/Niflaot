/**
 * «Неделя в Академии» в Telegram — каждую среду вечером: пост с тем, что учили с воскресенья, коротко пересказанным —
 * Пророки и Писания по дням (пересказ проекта, src/tanakh/retell.json) с одним стихом недели в каждом разделе, отрывки
 * Хасидута с одной фразой, нигун недели — и вторым сообщением PDF дайджеста недели
 * (`#/digest/<воскресенье>`, WeekDigest.tsx, src/core/weekDigest.ts) на языке канала — тот же лист, что даёт «Печать» на
 * сайте. Стих недели выбирает тот же `quoteVerse`, что и страница, по всем дням недели (`public/tanakh/<дата>.json`).
 * Пост — коротко: у дня Пророков и Писаний — первое предложение пересказа, у Хасидута — названия отрывков; весь пересказ
 * и «Коротко» Хасидута — на листе (PDF). Не длиннее 4096 знаков (лимит Telegram). На неделе без учёбы — ничего.
 *
 * Запускает `.github/workflows/telegram-digest.yml`: по средам, попытки каждые 10 минут с 17:00 по Вене (GitHub опаздывает
 * и пропускает запуски); первая дошедшая публикует и оставляет метку дня в кэше Actions (`DIGEST_POSTED_FILE`, ключ
 * `digest-posted-<дата>`) — остальные попытки ничего не делают. Каналы и бот — те же, что у «К шабатнему столу»: secret
 * `TELEGRAM_BOT_TOKEN`, variables `TELEGRAM_CHAT_RU/EN/DE`; язык без канала пропускается; с variable `TELEGRAM_APP` — кнопка
 * «открыть внутри Telegram». В Шабат — даже при ручном запуске ничего.
 *
 * Проверить без отправки: `npx tsx scripts/telegram-digest.ts --dry [--date 2026-10-28] [--pdf]` (`--pdf` — сохранить PDF
 * в `digest-<воскресенье>-<язык>.pdf`; `PDF_SITE=http://localhost:4173` — локальная копия сайта, `CHROMIUM_PATH` — свой
 * браузер; нужен playwright: `npm i --no-save playwright`).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import type { DayContent, DayVerse } from '../src/core/tanakh';
import { BOOKS, rangeLabel, type Section } from '../src/core/tanakhCycle';
import { CYCLE } from '../src/core/tanakh';
import { HEMSHECH } from '../src/core/hemshech';
import { firstSentence, quoteSentence, quoteVerse, retell, weekDays, weekNigun, weekPassages, weekStart } from '../src/core/weekDigest';
import { routeLink, SITE_URL } from '../src/core/site';
import { miniAppLink } from '../src/core/telegram';
import { civilDate } from '../src/core/hebrewDate';
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
  if (process.env.DIGEST_POSTED_FILE && !DRY) writeFileSync(process.env.DIGEST_POSTED_FILE, `${now.toISOString().slice(0, 10)} ${why}\n`);
};
// a scheduled run posts from 17:00 Vienna time on (the workflow skips earlier attempts too)
const fired = process.env.TELEGRAM_SCHEDULE;
if (fired && !DRY) {
  const viennaHour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Vienna', hour: 'numeric', hourCycle: 'h23' }).format(now));
  if (viennaHour < 17) {
    console.log(`cron «${fired}»: в Вене ${viennaHour} ч — рано, публикует следующая попытка.`);
    process.exit(0);
  }
}
if (!DRY && (now.getUTCDay() === 6 || (now.getUTCDay() === 5 && now.getUTCHours() >= 12))) {
  console.log('Шабат — сегодня не публикуем.');
  markDone('shabbat');
  process.exit(0);
}

const date = dateArg >= 0 ? args[dateArg + 1] : now.toISOString().slice(0, 10);
const sunday = weekStart(date);
const days = weekDays(sunday, date).map((d) => JSON.parse(readFileSync(`public/tanakh/${d.date}.json`, 'utf8')) as DayContent);
const passages = weekPassages(sunday, date);
if (!days.length && !passages.length) {
  console.log(`${date}: на этой неделе ещё не учились — дайджеста нет, не публикуем.`);
  markDone('nothing');
  process.exit(0);
}
const route = `digest/${sunday}`;
const nigun = weekNigun(sunday);
// the verse of the week in each section: the same choice as a day's on the page, over all the days of the week
const verses = {
  neviim: quoteVerse(days.flatMap((d) => d.neviim.verses)),
  ketuvim: quoteVerse(days.flatMap((d) => d.ketuvim.verses)),
};

const html = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = (s: string) => s.replace(/<[^>]+>/g, '').trim();
const t = (loc: Loc, key: string, vars: Record<string, string | number> = {}) =>
  String((UI[loc] as Record<string, unknown>)[key] ?? (ru as Record<string, unknown>)[key]).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
const dayMonth = (iso: string, loc: Loc) => new Intl.DateTimeFormat(loc, { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));

const weekday = (iso: string, loc: Loc) => new Intl.DateTimeFormat(loc, { weekday: 'short', timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`));

/** A section of the Prophets and Writings: the week's passage, each day in the first sentence of its retelling, and the verse of the week. */
function sectionLines(section: Section, icon: string, loc: Loc): string[] {
  if (!days.length) return [];
  const cyc = days.map((d) => CYCLE.find((c) => c.date === d.date)!);
  const range = rangeLabel(section, [cyc[0][section][0], cyc[cyc.length - 1][section][1]], loc);
  const lines = ['', `${icon} <b>${html(t(loc, `tanakh.${section}`))}</b> · ${html(range)}`];
  for (const d of days) {
    const told = retell(d.date, section, loc);
    if (told) lines.push(`<b>${html(weekday(d.date, loc))}:</b> ${html(firstSentence(told))}`);
  }
  const v = verses[section];
  if (v) {
    const ref = `${BOOKS.find((b) => b.slug === v.b)?.name[loc] ?? v.b} ${v.c}:${v.v}`;
    lines.push(`${html(plain(v.he))}`, `<i>«${html(plain(v[loc] ?? v.en))}»</i> (${html(ref)})`);
  }
  return lines;
}

/** The passages of Chassidut: their titles, and a sentence of the last. */
function hemshechLines(loc: Loc): string[] {
  if (!passages.length) return [];
  const lines = ['', `✦ <b>${html(t(loc, 'hs.menuLbl'))} · ${html(HEMSHECH.title[loc])}</b>`];
  for (const { p, date } of passages)
    lines.push(`<b>${html(weekday(date, loc))}:</b> ${html(p.title[loc])}`);
  const last = passages[passages.length - 1].p;
  lines.push(`<i>«${html(quoteSentence(last[loc]))}»</i>`, `© The Neirot Foundation · ${html(HEMSHECH.creditUrl.replace(/^https?:\/\/(www\.)?/, ''))}`);
  return lines;
}

const LIMIT = 4096;
/** The length Telegram counts: the text without the tags, the entities decoded. */
const shown = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&(amp|lt|gt);/g, '_').length;
function post(loc: Loc): string {
  const last = [...days.map((d) => d.date), ...passages.map((p) => p.date)].sort().pop()!;
  const text = [
      `📰 <b>${html(t(loc, 'digest.title'))}</b> · ${html(dayMonth(sunday, loc))} – ${html(civilDate(last, loc))}`,
      html(t(loc, 'digest.post.lead')),
      ...sectionLines('neviim', '📖', loc),
      ...sectionLines('ketuvim', '📜', loc),
      ...hemshechLines(loc),
      '',
      `🎵 <b>${html(t(loc, 'digest.nigun'))}:</b> ${html(nigun.title[loc])} — ${html(routeLink(`nigun/${nigun.id}`, 'channel', loc))}`,
      '',
      `👉 ${html(t(loc, 'digest.post.all'))} ${html(routeLink(route, 'channel', loc))}`,
    ].join('\n');
  if (shown(text) > LIMIT) throw new Error(`${loc}: the post is ${shown(text)} characters, Telegram takes ${LIMIT}`);
  return text;
}

const buttons = (loc: Loc) =>
  APP ? { reply_markup: { inline_keyboard: [[{ text: `📰 ${t(loc, 'digest.title')}`, url: miniAppLink(APP, route, loc) }]] } } : {};

/** The digest as «Печать» makes it: the live site's page in a headless browser, saved as A4 PDF. */
async function digestPdf(loc: Loc): Promise<Uint8Array> {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    const page = await browser.newPage();
    await page.route(/goatcounter/, (r) => r.abort());
    // a machine: no onboarding (the digest is the same in both modes)
    await page.addInitScript(() => {
      localStorage.setItem('niflaot:mode', 'adults');
      localStorage.setItem('niflaot:hebrew', 'letters');
    });
    await page.goto(`${process.env.PDF_SITE || SITE_URL}/?lang=${loc}#/${route}`, { waitUntil: 'load' });
    await page.waitForSelector('.wd .st-head', { timeout: 60_000 });
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
    console.log(`── ${loc} (${CHATS[loc] ?? 'нет канала'}) · ${shown(text)} знаков\n${text}\n${APP ? `${JSON.stringify(buttons(loc).reply_markup)}\n` : ''}`);
    if (PDF_ONLY) {
      const file = `digest-${sunday}-${loc}.pdf`;
      writeFileSync(file, await digestPdf(loc));
      console.log(`PDF: ${file}`);
    }
    continue;
  }
  const chat = CHATS[loc];
  if (!chat) continue;
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  try {
    await tg('sendMessage', { chat_id: chat, text, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, ...buttons(loc) });
    console.log(`${loc}: posted ${sunday} to ${chat}`);
    markDone('posted');
  } catch (e) {
    console.error(`${loc}: ${(e as Error).message}`);
    failed = true;
    continue;
  }
  try {
    const pdf = await digestPdf(loc);
    await tgFile(chat, pdf, `niflaot-week-${sunday}-${loc}.pdf`, t(loc, 'digest.post.pdf'));
    console.log(`${loc}: PDF ${Math.round(pdf.length / 1024)} KB sent`);
  } catch (e) {
    console.error(`${loc}: PDF — ${(e as Error).message}`);
    failed = true;
  }
}
if (failed) process.exit(1);
