/**
 * «Загадка недели» в Telegram-каналы (ru / en / de) — запускается GitHub Action `.github/workflows/telegram.yml`
 * по воскресеньям и средам. Берёт загадку из ленты «Знаете ли вы?» (src/core/facts.ts) **текущей главы** (та, чей Шабат —
 * сегодня или позже, `parshaOf` из src/core/dailyMessage.ts): в воскресенье — первую, в среду — вторую (дальше — по очереди);
 * один и тот же факт на всех языках — и публикует **только вопрос** с картинкой урока; ответ и разбор — по ссылке на сайт
 * (`#/facts/<id>`, метка `?ref=channel` для GoatCounter).
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
import { collectFacts, type Fact } from '../src/core/facts';
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

function post(f: Fact, loc: Loc): string {
  const text = f.lesson.texts[loc] ?? f.lesson.texts.ru!;
  const he = f.kind === 'eq' ? f.q : f.from;
  const gloss = he
    .split(' + ')
    .map((w) => text.glossary[w])
    .filter(Boolean)
    .join(' · ');
  const question = f.kind === 'eq' ? t(loc, 'facts.qEq') : t(loc, `facts.qLt.${f.take}`);
  const who = t(loc, `teacher.${teacherOf(f.lesson)}.short`);
  const source = text.title.includes(who) ? text.title : `${who} · ${text.title}`;
  return [
    `✨ ${html(question)} <b>${html(displayNames(he))}</b>${gloss ? ` (${html(gloss)})` : ''}?`,
    '',
    `🤔 ${html(t(loc, 'facts.postCta'))} 👉 ${html(routeLink(`facts/${f.id}`, 'channel', loc))}`,
    '',
    `📖 ${html(source)}`,
  ].join('\n');
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

/** the Mini App button: the same fact on the site, inside Telegram */
const buttons = (loc: Loc) =>
  APP ? { reply_markup: { inline_keyboard: [[{ text: t(loc, 'tg.open'), url: miniAppLink(APP, `facts/${fact.id}`, loc) }]] } } : {};

const photo = `${SITE_URL}/og/${fact.lesson.slug}.png`;
if (!DRY && !Object.values(CHATS).some(Boolean)) throw new Error('no channel: set TELEGRAM_CHAT_RU / _EN / _DE (Variables or Secrets)');
let failed = false;
for (const loc of Object.keys(UI) as Loc[]) {
  const caption = post(fact, loc);
  if (DRY) {
    console.log(`── ${loc} (${CHATS[loc] ?? 'нет канала'}) · ${photo}\n${caption}\n${APP ? `[${t(loc, 'tg.open')}] ${miniAppLink(APP, `facts/${fact.id}`, loc)}\n` : ''}`);
    continue;
  }
  const chat = CHATS[loc];
  if (!chat) continue;
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  try {
    await tg('sendPhoto', { chat_id: chat, photo, caption, parse_mode: 'HTML', ...buttons(loc) });
  } catch (e) {
    // no picture for this lesson yet — the question alone
    console.warn(`${loc}: ${(e as Error).message}; sending text`);
    try {
      await tg('sendMessage', { chat_id: chat, text: caption, parse_mode: 'HTML', ...buttons(loc) });
    } catch (e2) {
      console.error(`${loc}: ${(e2 as Error).message}`);
      failed = true;
      continue;
    }
  }
  console.log(`${loc}: posted ${fact.id} to ${chat}`);
}
if (failed) process.exit(1);
