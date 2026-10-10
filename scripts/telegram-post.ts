/**
 * «Загадка недели» в Telegram-каналы (ru / en / de) — запускается GitHub Action `.github/workflows/telegram.yml`
 * по воскресеньям и средам. Берёт загадку из ленты «Знаете ли вы?» (src/core/facts.ts) по очереди — один и тот же
 * факт на всех языках — и публикует **только вопрос** с картинкой урока; ответ и разбор — по ссылке на сайт
 * (`#/facts/<id>`, метка `?ref=channel` для GoatCounter).
 *
 * Настройка в GitHub (Settings → Secrets and variables → Actions):
 *  - secret `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather; бот — администратор каждого канала;
 *  - variables `TELEGRAM_CHAT_RU`, `TELEGRAM_CHAT_EN`, `TELEGRAM_CHAT_DE` — канал (`@niflaot_ru` или числовой id);
 *    язык без канала пропускается.
 * В Шабат (с полудня пятницы по UTC до конца субботы) ничего не публикуется — даже при ручном запуске.
 *
 * Проверить локально без отправки: `npx tsx scripts/telegram-post.ts --dry` (`--slot N` — другой факт по очереди).
 */
import { LESSONS } from '../src/lessons';
import { collectFacts, type Fact } from '../src/core/facts';
import { displayNames } from '../src/core/names';
import { SITE_URL, routeLink } from '../src/core/site';
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
const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const slotArg = args.indexOf('--slot');

const now = new Date();
const day = now.getUTCDay();
if (!DRY && (day === 6 || (day === 5 && now.getUTCHours() >= 12))) {
  console.log('Шабат — сегодня не публикуем.');
  process.exit(0);
}

const facts = collectFacts(LESSONS);
if (!facts.length) throw new Error('no facts');
// two posts a week: a new slot every 3.5 days, the facts in turn
const slot = slotArg >= 0 ? Number(args[slotArg + 1]) : Math.floor(now.getTime() / (3.5 * 864e5));
const fact = facts[slot % facts.length];

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

const photo = `${SITE_URL}/og/${fact.lesson.slug}.png`;
let failed = false;
for (const loc of Object.keys(UI) as Loc[]) {
  const caption = post(fact, loc);
  if (DRY) {
    console.log(`── ${loc} (${CHATS[loc] ?? 'нет канала'}) · ${photo}\n${caption}\n`);
    continue;
  }
  const chat = CHATS[loc];
  if (!chat) continue;
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not set');
  try {
    await tg('sendPhoto', { chat_id: chat, photo, caption, parse_mode: 'HTML' });
  } catch (e) {
    // no picture for this lesson yet — the question alone
    console.warn(`${loc}: ${(e as Error).message}; sending text`);
    try {
      await tg('sendMessage', { chat_id: chat, text: caption, parse_mode: 'HTML' });
    } catch (e2) {
      console.error(`${loc}: ${(e2 as Error).message}`);
      failed = true;
      continue;
    }
  }
  console.log(`${loc}: posted ${fact.id} to ${chat}`);
}
if (failed) process.exit(1);
