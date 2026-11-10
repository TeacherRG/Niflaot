/**
 * «Загадка недели» в Telegram-каналы (ru / en / de) — запускается GitHub Action `.github/workflows/telegram.yml`
 * по воскресеньям и средам. Берёт загадку из ленты «Знаете ли вы?» (src/core/facts.ts) **текущей главы** (та, чей Шабат —
 * сегодня или позже, `parshaOf` из src/core/dailyMessage.ts): в воскресенье — первую, в среду — вторую (дальше — по очереди);
 * один и тот же факт на всех языках — и публикует его **как карточку ленты: сразу ответ** (владелец, 02.11.2026: «вопрос
 * непонятен и неинтересен»): слово или равенство с переводом, заголовок, смысл и «Чему это учит?» (`factMeaning`), с картинкой
 * урока; весь урок — по ссылке на сайт (`#/facts/<id>`, метка `?ref=channel` для GoatCounter).
 * **Картинка — карточка этого факта** (та же, что «📤 Поделиться» в ленте: слово / равенство, смысл, «Чему это учит?» —
 * на языке канала): сайт открывается в браузере (Playwright), карточка рисуется кнопкой 📤 и приходит загрузкой. Раньше шла
 * общая картинка урока (`og/<урок>.png`), и она не совпадала с текстом (владелец, 10.11.2026). Карточки нет (браузер не
 * запустился) — пост уходит текстом, без чужой картинки. Подпись к картинке у Telegram — до 1024 знаков: длиннее — картинка
 * и под ней текст отдельным сообщением.
 *
 * Настройка в GitHub (Settings → Secrets and variables → Actions):
 *  - secret `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather; бот — администратор каждого канала;
 *  - variables `TELEGRAM_CHAT_RU`, `TELEGRAM_CHAT_EN`, `TELEGRAM_CHAT_DE` — канал (`@niflaot_ru` или числовой id);
 *    язык без канала пропускается;
 *  - variable `TELEGRAM_APP` (необязательно) — Mini App из @BotFather, `<бот>/<приложение>`: под постом кнопка
 *    «Открыть в Telegram» — та же загадка на сайте прямо внутри Telegram (src/core/telegram.ts).
 * В Шабат (с полудня пятницы по UTC до конца субботы) ничего не публикуется — даже при ручном запуске.
 *
 * Проверить локально без отправки: `npx tsx scripts/telegram-post.ts --dry [--date 2026-10-21]` (`--slot N` — другой
 * факт главы по очереди; `--card` — ещё и нарисовать карточки в `telegram-card-<язык>.png`; `PDF_SITE=http://localhost:5173`
 * — локальная копия сайта, `CHROMIUM_PATH` — свой браузер).
 */
import { LESSONS } from '../src/lessons';
import { NUMS, collectFacts, factMeaning, type Fact } from '../src/core/facts';
import { parshaOf } from '../src/core/dailyMessage';
import { PARSHIOT } from '../src/lessons/parshiot';
import { displayNames } from '../src/core/names';
import { SITE_URL, routeLink } from '../src/core/site';
import { miniAppLink } from '../src/core/telegram';
import { teacherOf } from '../src/lessons/teachers';
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
const CARD = args.includes('--card');
const slotArg = args.indexOf('--slot');
const dateArg = args.indexOf('--date');

const now = dateArg >= 0 ? new Date(`${args[dateArg + 1]}T07:00:00Z`) : new Date();
const day = now.getUTCDay();
if (!DRY && (day === 6 || (day === 5 && now.getUTCHours() >= 12))) {
  console.log('Шабат — сегодня не публикуем.');
  process.exit(0);
}

// the facts of this week's portion (its Shabbat is today or later), not of the one just read
const today = now.toISOString().slice(0, 10);
const parsha = parshaOf(today);
const all = collectFacts(LESSONS);
const facts = all.filter((f) => f.lesson.parsha === parsha);
if (!facts.length) throw new Error(`no facts for ${parsha}`);
// two posts a week: Sunday — the first fact of the portion, Wednesday — the second (after the last portion — on in turn)
const sunday = (Date.parse(`${PARSHIOT[parsha].shabbat}T00:00:00Z`) - 6 * 864e5) / 864e5;
const days = Math.max(0, Math.floor(Date.parse(`${today}T00:00:00Z`) / 864e5) - sunday);
const slot = slotArg >= 0 ? Number(args[slotArg + 1]) : Math.floor((days + 1) / 3.5);
const fact = facts[slot % facts.length];
console.log(`${today}: глава ${parsha}, загадка ${(slot % facts.length) + 1} из ${facts.length}`);

const html = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const t = (loc: Loc, key: string) => String((UI[loc] as Record<string, unknown>)[key] ?? (ru as Record<string, unknown>)[key]);

/** plain text; each run of Hebrew words isolated right-to-left (U+2067…U+2069) — as on the site, so the clients don't reorder
 * «ם, ש, ה — משה» together with the punctuation around it */
const plain = (h: string) =>
  displayNames(h.replace(/<sup[^>]*><\/sup>/g, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).replace(
    /[א-ת][א-ת׳״־]*(?:\s[א-ת][א-ת׳״־]*)*/g,
    (m) => `\u2067${m}\u2069`,
  );

function post(f: Fact, loc: Loc): string {
  const text = f.lesson.texts[loc] ?? f.lesson.texts.ru!;
  const gloss = (h: string) =>
    h
      .split(' + ')
      .map((w) => text.glossary[w])
      .filter(Boolean)
      .join(' · ');
  const word = (h: string) => `<b>${html(plain(h))}</b>${gloss(h) ? ` (${html(gloss(h))})` : ''}`;
  // the answer at once: «ויהיו («и было») = 37» or the hidden word «משה (Моше)»
  const answer =
    f.kind === 'eq' ? [word(f.q), ...f.rest.map((p) => (NUMS.test(p) ? `<b>${html(p)}</b>` : word(p)))].join(' = ') : word(f.word);
  const meaning = factMeaning(f, text);
  // where the hidden word was taken from — when the meaning doesn't say it (as on the card)
  const from = f.kind !== 'eq' && !meaning.text?.includes(f.from) ? `${t(loc, `facts.from.${f.take}`)} ${plain(f.from)}` : undefined;
  const who = t(loc, `teacher.${teacherOf(f.lesson)}.short`);
  const source = text.title.includes(who) ? text.title : `${who} · ${text.title}`;
  return [
    `✨ ${answer}`,
    from && html(from),
    meaning.title && `\n<b>${html(meaning.title)}</b>`,
    meaning.text && html(plain(meaning.text)),
    meaning.moral && `\n<b>${html(meaning.moralLabel ?? t(loc, 'memo.learn'))}</b> ${html(plain(meaning.moral))}`,
    '',
    `📖 ${html(t(loc, 'facts.cardLesson'))} 👉 ${html(routeLink(`facts/${f.id}`, 'channel', loc))}`,
    `<i>${html(source)}</i>`,
  ]
    .filter((x) => x !== undefined)
    .join('\n');
}

/** what Telegram counts against the 1024 of a caption: the text without the HTML */
const visible = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').length;

async function tg(method: string, body: object) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as { ok: boolean; description?: string };
  if (!json.ok) throw new Error(`${method}: ${json.description}`);
}

/** the Mini App button: the same fact on the site, inside Telegram */
const buttons = (loc: Loc) =>
  APP ? { reply_markup: { inline_keyboard: [[{ text: t(loc, 'tg.open'), url: miniAppLink(APP, `facts/${fact.id}`, loc) }]] } } : {};

/**
 * The fact's card as «📤 Поделиться» in the feed draws it, in the channel's language: the live site in a headless browser,
 * `#/facts/<id>`, the share button of this card — on a computer the picture comes as a download.
 */
async function factCards(locs: Loc[]): Promise<Partial<Record<Loc, Buffer>>> {
  const out: Partial<Record<Loc, Buffer>> = {};
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const loc of locs) {
      try {
        const ctx = await browser.newContext({ acceptDownloads: true, viewport: { width: 1000, height: 900 } });
        const page = await ctx.newPage();
        await page.route(/goatcounter/, (r) => r.abort());
        // a machine: no onboarding; no system share sheet — the card is downloaded
        await page.addInitScript(() => {
          localStorage.setItem('niflaot:mode', 'kids');
          localStorage.setItem('niflaot:hebrew', 'letters');
          Object.defineProperty(navigator, 'canShare', { value: undefined });
        });
        await page.goto(`${process.env.PDF_SITE || SITE_URL}/?lang=${loc}#/facts/${fact.id}`, { waitUntil: 'load' });
        const btn = page.locator(`article[id="${fact.id}"] .fact-share`);
        await btn.waitFor({ timeout: 60_000 });
        await page.evaluate(() => document.fonts.ready);
        const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60_000 }), btn.click()]);
        const file = await dl.path();
        if (file) out[loc] = await (await import('node:fs/promises')).readFile(file);
        await ctx.close();
      } catch (e) {
        console.warn(`${loc}: no card — ${(e as Error).message}`);
      }
    }
  } finally {
    await browser.close();
  }
  return out;
}

async function tgPhoto(chat: string, png: Buffer, caption: string | undefined, extra: object) {
  const form = new FormData();
  form.append('chat_id', chat);
  form.append('photo', new Blob([png], { type: 'image/png' }), `niflaot-${fact.id}.png`);
  if (caption) {
    form.append('caption', caption);
    form.append('parse_mode', 'HTML');
  }
  for (const [k, v] of Object.entries(extra)) form.append(k, JSON.stringify(v));
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, { method: 'POST', body: form });
  const json = (await res.json()) as { ok: boolean; description?: string };
  if (!json.ok) throw new Error(`sendPhoto: ${json.description}`);
}

if (!DRY && !Object.values(CHATS).some(Boolean)) throw new Error('no channel: set TELEGRAM_CHAT_RU / _EN / _DE (Variables or Secrets)');
const locs = (Object.keys(UI) as Loc[]).filter((loc) => (DRY ? CARD : CHATS[loc]));
const cards = locs.length ? await factCards(locs).catch((e) => (console.warn(`no browser: ${(e as Error).message}`), {})) : {};
let failed = false;
for (const loc of Object.keys(UI) as Loc[]) {
  const caption = post(fact, loc);
  const card = (cards as Partial<Record<Loc, Buffer>>)[loc];
  if (DRY) {
    if (card) await (await import('node:fs/promises')).writeFile(`telegram-card-${loc}.png`, card);
    console.log(`── ${loc} (${CHATS[loc] ?? 'нет канала'}) · ${card ? `карточка telegram-card-${loc}.png` : 'без карточки'} · ${visible(caption)} знаков${visible(caption) > 1024 ? ' — текстом под картинкой' : ''}\n${caption}\n${APP ? `[${t(loc, 'tg.open')}] ${miniAppLink(APP, `facts/${fact.id}`, loc)}\n` : ''}`);
    continue;
  }
  const chat = CHATS[loc];
  if (!chat) continue;
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  const asText = { chat_id: chat, text: caption, parse_mode: 'HTML', link_preview_options: { is_disabled: true }, ...buttons(loc) };
  try {
    if (!card) await tg('sendMessage', asText);
    // a caption is up to 1024 characters: a longer post — the card, then the text under it
    else if (visible(caption) > 1024) {
      await tgPhoto(chat, card, undefined, {});
      await tg('sendMessage', asText);
    } else await tgPhoto(chat, card, caption, buttons(loc));
  } catch (e) {
    console.warn(`${loc}: ${(e as Error).message}; sending text`);
    try {
      await tg('sendMessage', asText);
    } catch (e2) {
      console.error(`${loc}: ${(e2 as Error).message}`);
      failed = true;
      continue;
    }
  }
  console.log(`${loc}: posted ${fact.id} to ${chat}${card ? ' with its card' : ' as text'}`);
}
if (failed) process.exit(1);
