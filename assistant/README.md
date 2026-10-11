# ИИ-помощник Нифлаот (Cloudflare Worker)

Сайт статический (GitHub Pages), поэтому ключ Claude API нельзя держать в нём.
Этот маленький сервер принимает вопросы с сайта, добавляет контекст урока и отвечает через Claude
(модель `claude-opus-5-5`, усилие `low` для быстрых ответов; при отказе модели — серверный фолбэк `fallbacks: "default"`).
Гиматрию модель не считает «в уме»: у неё есть инструмент `gematria`, который использует тот же код, что и сайт
(`src/core/gematria.ts`).

Что помощник знает о странице: урок, на какой загадке пользователь, и **только у решённых загадок** —
разгадку, текст урока и первоисточники. Ответы нерешённых загадок на сервер не отправляются, поэтому
помощник не может их раскрыть.

## Запуск без терминала (GitHub Actions)

1. Cloudflare → **Manage Account → Account API Tokens → Create Token** → шаблон **Edit Cloudflare Workers** → создать, скопировать.
   Account ID — на главной странице аккаунта Cloudflare (справа, «Account ID»).
2. Ключ Claude: platform.claude.com (бывший console.anthropic.com) → **API Keys → Create Key**; там же **Limits** — месячный лимит расходов.
3. GitHub → **Settings → Secrets and variables → Actions → Secrets**: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
   `ANTHROPIC_API_KEY`.
4. **Actions → Deploy AI assistant → Run workflow** (`.github/workflows/assistant.yml`). В конце шага «Deploy» —
   адрес `https://niflaot-assistant.<поддомен>.workers.dev`.
5. **Variables** → `ASSISTANT_URL` = этот адрес; затем **Actions → Deploy → Run workflow** (или любой пуш в `main`).

## Запуск из терминала

```bash
cd assistant
npm install
npx wrangler login                          # аккаунт Cloudflare (бесплатного тарифа достаточно)
npx wrangler secret put ANTHROPIC_API_KEY   # ключ с platform.claude.com (бывший console.anthropic.com)
npx wrangler deploy                         # выдаст адрес вида https://niflaot-assistant.<аккаунт>.workers.dev
```

Затем в репозитории GitHub: **Settings → Secrets and variables → Actions → Variables** →
переменная `ASSISTANT_URL` = адрес воркера. После следующей публикации `main` кнопка ✦ и пункт меню
откроют ИИ-чат вместо офлайн-помощника. Пока переменной нет — работает офлайн-помощник.

Разрешённые адреса сайта — `ALLOWED_ORIGINS` в `wrangler.toml` (localhost разрешён всегда).
Запросы с других страниц (заголовок `Origin` не из списка) и без `Origin` отклоняются с кодом 403.

Локально: `npx wrangler dev` (ключ — в `assistant/.dev.vars`: `ANTHROPIC_API_KEY=...`), сайт —
`VITE_ASSISTANT_URL=http://localhost:8787 npm run dev`.

## Расходы и защита

- Ограничения запроса: до 20 реплик, вопрос до 2000 символов, контекст урока до 24 000 символов.
- Системная подсказка кэшируется (prompt caching).
- Тело запроса — не больше 256 КБ, ответ модели — не больше 4000 токенов за раунд.
- Ограничение частоты встроено: 20 запросов в минуту с одного IP (`[[ratelimits]]` в `wrangler.toml`), сверх — код 429.
- Проверка `Origin` не защищает от скриптов вне браузера (они подделывают заголовок), поэтому обязательно задайте
  месячный лимит расходов в консоли Anthropic.
