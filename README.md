# Niflaot

**Сайт: https://niflaot.mychitas.app**

Игры-гиматрии по статьям рава Ицхака Гинзбурга из брошюры «Нифлаот» — проект [MyChitas](https://mychitas.app).
React + TypeScript + Vite, многоязычный интерфейс (сейчас: русский, English).

```bash
npm install
npm run dev      # локальный сервер
npm run build    # статическая сборка в dist/ (работает из любого подкаталога)
```

Маршруты (hash): `#/` — список уроков, `#/<slug>` — урок, например `#/tikun-partzuf-zanav`.
Язык можно задать параметром `?lang=en`; выбор запоминается.

## Структура

```
src/
  i18n/                     многоязычный модуль
    config.ts               список языков (код, название, направление ltr/rtl)
    locales/ru.ts, en.ts    строки интерфейса (ru — эталон, остальные проверяются типами)
    index.tsx               I18nProvider, useI18n(): t(key, vars) с плюралами, pick() с фолбэком
  core/                     гиматрия, форматирование, состояние игры (localStorage)
  components/               общий UI: шапка, загадка, итог, калькулятор, подвал
  lessons/
    index.ts                реестр уроков
    types.ts                схема урока
    01-tikun-partzuf-zanav/ урок №1
      index.ts              данные без языка: ивритские слова, ответы, числа
      i18n/ru.ts, en.ts     тексты урока на каждом языке
legacy/                     исходная однофайловая версия урока №1
```

## Как добавить урок

Полный порядок — в **[docs/LESSON-GUIDE.md](docs/LESSON-GUIDE.md)** (обязателен для каждого урока):
полный пересказ статьи, проверка всех чисел кодом, конспект и практический вывод,
первоисточники из Sefaria (`scripts/fetch-sources.py`), Имена Всевышнего, проверка в браузере.

Коротко: скопировать `src/lessons/01-…/` в `src/lessons/NN-<slug>/`, заполнить `index.ts`
и `i18n/<язык>.ts`, добавить урок в `src/lessons/index.ts`.

## Первоисточники (Sefaria)

```bash
python3 scripts/fetch-sources.py ls   "Tanakh/Writings/"                          # обзор библиотеки
python3 scripts/fetch-sources.py find "Talmud/Bavli/Seder Zeraim/Berakhot" פרצוף    # найти место
python3 scripts/fetch-sources.py                                                  # скачать все SOURCES
```

Тексты берутся из открытой выгрузки Sefaria и сохраняются в `src/sources/sefaria.json`;
русские переводы проекта — в `src/sources/ru.ts`.

## Помощник

Кнопка ✦ открывает помощника. Пока не задан адрес ИИ-сервера, это **офлайн-помощник**
(`src/components/Helper.tsx`): гиматрия любого слова по шагам (сотни → десятки → единицы,
`src/core/gematriaSteps.ts`), первоисточники решённых загадок и частые вопросы. Работает без сервера и ключей.

**ИИ-чат** (Claude) уже в коде, но скрыт: он работает через отдельный сервер с ключом Claude API —
`assistant/` (Cloudflare Worker), как развернуть — в [assistant/README.md](assistant/README.md).
Адрес сервера передаётся при сборке через `VITE_ASSISTANT_URL` (в GitHub — переменная репозитория
`ASSISTANT_URL`); когда она задана, вместо офлайн-помощника открывается чат.

## Как добавить язык

1. Добавьте код в `src/i18n/config.ts` (для иврита: `dir: 'rtl'`).
2. Создайте `src/i18n/locales/<код>.ts` по образцу `en.ts` и подключите его в `src/i18n/index.tsx`.
3. По желанию — переводы уроков в `src/lessons/*/i18n/<код>.ts`.

Все тексты уроков принадлежат раву Ицхаку Гинзбургу (pnimi.org.il).

## Публикация

Сайт живёт на **https://niflaot.mychitas.app** (GitHub Pages, домен задан в `public/CNAME`).
При каждом пуше в `main` workflow `.github/workflows/deploy.yml` собирает проект и публикует `dist/`.
Один раз в настройках репозитория: **Settings → Pages → Source: GitHub Actions**.
