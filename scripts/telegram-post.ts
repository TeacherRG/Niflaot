/**
 * «Загадка недели» в Telegram-каналы (ru / en / de) — запускается GitHub Action `.github/workflows/telegram.yml`
 * по воскресеньям и средам. Берёт загадку из ленты «Знаете ли вы?» (src/core/facts.ts) **текущей главы** (та, чей Шабат —
 * сегодня или позже, `parshaOf` из src/core/dailyMessage.ts): в воскресенье — первую, в среду — вторую (дальше — по очереди);
 * один и тот же факт на всех языках — и публикует его **как карточку ленты: сразу ответ** (владелец, 02.11.2026: «вопрос
 * непонятен и неинтересен»): слово или равенство с переводом, заголовок, смысл и «Чему это учит?» (`factMeaning`), с картинкой
 * урока; весь урок — по ссылке на сайт (`#/facts/<id>`, метка `?ref=channel` для GoatCounter). Подпись к картинке у Telegram —
 * до 1024 знаков: длиннее — текстом, картинка урока — превью над ним.
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
 * факт главы по очереди).
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
    .filter((x) => x !== undefined && x !== false)
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

const photo = `${SITE_URL}/og/${fact.lesson.slug}.png`;
if (!DRY && !Object.values(CHATS).some(Boolean)) throw new Error('no channel: set TELEGRAM_CHAT_RU / _EN / _DE (Variables or Secrets)');
let failed = false;
for (const loc of Object.keys(UI) as Loc[]) {
  const caption = post(fact, loc);
  if (DRY) {
    console.log(`── ${loc} (${CHATS[loc] ?? 'нет канала'}) · ${photo} · ${visible(caption)} знаков${visible(caption) > 1024 ? ' — текстом' : ''}\n${caption}\n${APP ? `[${t(loc, 'tg.open')}] ${miniAppLink(APP, `facts/${fact.id}`, loc)}\n` : ''}`);
    continue;
  }
  const chat = CHATS[loc];
  if (!chat) continue;
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  // a caption is up to 1024 characters: a longer post goes as text with the lesson's picture as the preview above it
  const asText = { chat_id: chat, text: caption, parse_mode: 'HTML', link_preview_options: { url: photo, prefer_large_media: true, show_above_text: true }, ...buttons(loc) };
  try {
    if (visible(caption) > 1024) await tg('sendMessage', asText);
    else await tg('sendPhoto', { chat_id: chat, photo, caption, parse_mode: 'HTML', ...buttons(loc) });
  } catch (e) {
    // no picture for this lesson yet — the text alone
    console.warn(`${loc}: ${(e as Error).message}; sending text`);
    try {
      await tg('sendMessage', { ...asText, link_preview_options: { is_disabled: true } });
    } catch (e2) {
      console.error(`${loc}: ${(e2 as Error).message}`);
      failed = true;
      continue;
    }
  }
  console.log(`${loc}: posted ${fact.id} to ${chat}`);
}
if (failed) process.exit(1);
