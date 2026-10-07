# ИИ-помощник Нифлаот (Cloudflare Worker)

Сайт статический (GitHub Pages), поэтому ключ Claude API нельзя держать в нём.
Этот маленький сервер принимает вопросы с сайта, добавляет контекст урока и отвечает через Claude
(модель `claude-opus-5-5`, усилие `low` для быстрых ответов; при отказе модели — серверный фолбэк `fallbacks: "default"`).
Гиматрию модель не считает «в уме»: у неё есть инструмент `gematria`, который использует тот же код, что и сайт
(`src/core/gematria.ts`).

Что помощник знает о странице: урок, на какой загадке пользователь, и **только у решённых загадок** —
разгадку, текст урока и первоисточники. Ответы нерешённых загадок на сервер не отправляются, поэтому
помощник не может их раскрыть.

## Запуск

```bash
cd assistant
npm install
npx wrangler login                          # аккаунт Cloudflare (бесплатного тарифа достаточно)
npx wrangler secret put ANTHROPIC_API_KEY   # ключ с console.anthropic.com
npx wrangler deploy                         # выдаст адрес вида https://niflaot-assistant.<аккаунт>.workers.dev
```

Затем в репозитории GitHub: **Settings → Secrets and variables → Actions → Variables** →
переменная `ASSISTANT_URL` = адрес воркера. После следующей публикации `main` кнопка ✦ и пункт меню
откроют ИИ-чат вместо офлайн-помощника. Пока переменной нет — работает офлайн-помощник.

Разрешённые адреса сайта — `ALLOWED_ORIGINS` в `wrangler.toml` (localhost разрешён всегда).

Локально: `npx wrangler dev` (ключ — в `assistant/.dev.vars`: `ANTHROPIC_API_KEY=...`), сайт —
`VITE_ASSISTANT_URL=http://localhost:8787 npm run dev`.

## Расходы и защита

- Ограничения запроса: до 20 реплик, вопрос до 2000 символов, контекст урока до 24 000 символов.
- Системная подсказка кэшируется (prompt caching).
- Рекомендуется задать в Cloudflare правило Rate Limiting на `/chat` (например, 20 запросов в минуту с IP)
  и месячный лимит расходов в консоли Anthropic.
