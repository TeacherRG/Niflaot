# Рассылка «Новые уроки — на почту» (Buttondown)

Форма — `src/components/Subscribe.tsx` (в итоге урока и под лентой «Знаете ли вы?»), включается variable репозитория
`SUBSCRIBE_URL` = `https://buttondown.com/api/emails/embed-subscribe/niflaot`. Язык сайта уходит тегом (`ru`, `en`, `de`).

## Настройка

1. buttondown.com, рассылка `niflaot`; Settings → Subscribing — подтверждение адреса (double opt-in) включено.
2. Subscribers → Tags — теги `ru`, `en`, `de`.
3. Приветственное письмо (Settings → Emails / Subscribing → Welcome email) — текст ниже: одно письмо на трёх языках
   (тег при подписке ещё может не дойти до шаблона, поэтому все три языка вместе, свой — найдётся по заголовку).
4. GitHub → Settings → Secrets and variables → Actions → Variables: `SUBSCRIBE_URL` (адрес выше) → выкладка сайта.
5. Письма — RSS-to-email по лентам (`feed.xml` → тег `ru`, `feed-en.xml` → `en`, `feed-de.xml` → `de`) или вручную
   раз в неделю с отбором по тегу.

## Приветственное письмо

**Тема:** Добро пожаловать в Нифлаот · Welcome to Niflaot · Willkommen bei Niflaot

---

### Добро пожаловать в Нифлаот!

Спасибо, что подписались. «Нифлаот» — значит «чудеса»: здесь чудеса Торы открываются глазами разных учителей — Бааль ґа-Турима
и Любавичского Ребе. Ответ не дают готовым — его находят сами, шаг за шагом.

**Что будет приходить:** раз в неделю, к недельной главе, — новые уроки и загадка недели. Не чаще. В Шабат писем нет.

**С чего начать:**

- [Урок недельной главы](https://niflaot.mychitas.app/?ref=mail&lang=ru) — игра для детей с 8 лет и всей семьи, иврит знать не нужно;
- [«Знаете ли вы?»](https://niflaot.mychitas.app/?ref=mail&lang=ru#/facts) — чудеса Торы короткими карточками;
- [«Пророки и Писания»](https://niflaot.mychitas.app/?ref=mail&lang=ru#/neviim) — для подростков и взрослых: понемногу каждый день.

Всё бесплатно, на русском, английском и немецком. Вопросы и пожелания — просто ответьте на это письмо.

Отписаться можно одним нажатием — ссылка внизу каждого письма.

Шалом и до встречи у недельной главы!
Нифлаот · Тора-проект MyChitas

---

### Welcome to Niflaot!

Thank you for subscribing. "Niflaot" means "wonders": here the wonders of the Torah open up through the eyes of different
teachers — the Baal HaTurim and the Lubavitcher Rebbe. The answer is never handed to you — you find it yourself, step by step.

**What you will get:** once a week, for the weekly portion — new lessons and the riddle of the week. No more than that.
No emails on Shabbat.

**Where to start:**

- [This week's lesson](https://niflaot.mychitas.app/?ref=mail&lang=en) — a game for children from 8 and the whole family, no Hebrew needed;
- ["Did you know?"](https://niflaot.mychitas.app/?ref=mail&lang=en#/facts) — wonders of the Torah in short cards;
- ["Prophets and Writings"](https://niflaot.mychitas.app/?ref=mail&lang=en#/neviim) — for teens and adults: a little every day.

Everything is free, in English, Russian and German. Questions or wishes? Just reply to this email.

You can unsubscribe with one click — the link is at the bottom of every email.

Shalom, and see you at the weekly portion!
Niflaot · MyChitas Torah project

---

### Willkommen bei Niflaot!

Danke, dass du dich angemeldet hast. „Niflaot“ heißt „Wunder“: Hier entdeckst du die Wunder der Tora mit den Augen
verschiedener Lehrer — des Baal HaTurim und des Lubawitscher Rebben. Die Antwort bekommst du nicht fertig — du findest sie
selbst, Schritt für Schritt.

**Was du bekommst:** einmal pro Woche, zum Wochenabschnitt — neue Lektionen und das Rätsel der Woche. Nicht öfter.
Am Schabbat kommen keine E-Mails.

**So fängst du an:**

- [Die Lektion der Woche](https://niflaot.mychitas.app/?ref=mail&lang=de) — ein Spiel für Kinder ab 8 und die ganze Familie, Hebräisch musst du nicht können;
- [„Wusstest du?“](https://niflaot.mychitas.app/?ref=mail&lang=de#/facts) — Wunder der Tora in kurzen Karten;
- [„Propheten und Schriften“](https://niflaot.mychitas.app/?ref=mail&lang=de#/neviim) — für Jugendliche und Erwachsene: jeden Tag ein Stück.

Alles ist kostenlos, auf Deutsch, Englisch und Russisch. Fragen oder Wünsche? Antworte einfach auf diese E-Mail.

Abmelden kannst du dich mit einem Klick — der Link steht unten in jeder E-Mail.

Schalom, und bis zum nächsten Wochenabschnitt!
Niflaot · Tora-Projekt MyChitas
