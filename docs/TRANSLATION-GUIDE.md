# Английский и немецкий: правила перевода и транслитерации

Тексты сайта на английском и немецком пишутся так, как пишет ортодоксальный иудаизм — по образцу
**chabad.org** (английский) и **de.chabad.org** (немецкий). Это обязательно для уроков, Memo, карточек,
интерфейса, словаря терминов (`src/i18n/glossary.ts`), партнёров и переводов первоисточников проекта
(`src/sources/en.ts`, `src/sources/de.ts`).

Запрещённые формы ловит `npm run check` (список — `scripts/style-rules.ts`; новое правило — добавить туда же).
Остальное в этом документе проверяет человек.

---

## 1. Общее для обоих языков

### Имена Всевышнего
| | English | Deutsch |
|---|---|---|
| Б-г | **G-d**, G-d’s, G-dly, G-dliness | **G-tt**, G-ttes, g-ttlich, G-ttlichkeit |
| Г-сподь (в стихе) | **L-rd** | der Ewige |
| Всевышний | the Almighty, the Holy One, blessed be He | der Allmächtige, der Heilige, gelobt sei Er |
| ה׳ / Имя из четырёх букв | Hashem, the Four-Letter Name (Havayah) | Haschem, der Name aus vier Buchstaben (Hawaja) |
| Творец | the Creator | der Schöpfer |

- Никогда: God, Lord, Jehovah, Yahweh / Gott, göttlich, Jahwe, Jehova.
- Местоимения о Всевышнем — с большой буквы: He, His, Him, You, Your / Er, Sein, Ihm, Du, Dein.
- Иврит на экране: `אלקים`, `ה׳`, `ה׳ צב-אות`, `א-ל` (см. `CLAUDE.md`).

### Только еврейские слова, без христианских
| нельзя | English | Deutsch |
|---|---|---|
| Old Testament, Bible / Altes Testament, Bibel | Torah, Tanakh, Scripture | Tora, Tanach, die Schrift |
| Messiah / Messias | **Moshiach** | **Moschiach** |
| Sabbath / Sabbat | **Shabbat** | **Schabbat** |
| Eve / Eva | **Chavah** | **Chawa** |
| sacrifice / Opfer (о храмовом) | offering, korban | Opfergabe, Korban |
| Pentecost, Tabernacles / Pfingsten | Shavuot, Sukkot | Schawuot, Sukkot (Laubhüttenfest — только как пояснение) |
| Rabbiner | Rabbi | **Rabbi** (как на de.chabad.org) |

- «Ребе»: the Rebbe, the Rebbe’s / der Rebbe, **des Rebben**. «Любавичский Ребе» — the Lubavitcher Rebbe /
  der Lubawitscher Rebbe.
- Тора — Torah / **Tora** (не Thora), заповедь — mitzvah, mitzvot / **Mizwa, Mizwot** (или Gebot).
- Цитаты из Торы и слова мудрецов передаются точно; не «улучшать» и не добавлять от имени автора.

### Люди Торы — ивритские имена
| русский | English | Deutsch |
|---|---|---|
| Адам, Хава | Adam, Chavah | Adam, Chawa |
| Каин, Эвель, Шет | Kayin, Hevel, Shet | Kajin, Hewel, Schet |
| Ханох, Ноах | Chanoch, Noach | Chanoch, Noach |
| Авраам, Сара | Avraham, Sarah | Awraham, Sara |
| Ицхак, Ривка | Yitzchak, Rivkah | Jizchak, Riwka |
| Яаков, Рахель, Лея | Yaakov, Rachel, Leah | Jaakow, Rachel, Lea |
| Йосеф, Моше, Аарон | Yosef, Moshe, Aharon | Josef, Mosche, Aharon |
| Давид, Шломо | David, Shlomo | David, Schlomo |
| Иов | Job (книга) | Ijow |

Детям незнакомое имя можно один раз пояснить привычной формой **в скобках**: «Chanoch (Henoch)».

### Книги и главы
- **English** — как в ссылках chabad.org: книги Танаха по-английски (Genesis, Exodus, Psalms, Proverbs, Job,
  Isaiah, Ezekiel, Joshua), недельные главы — на иврите: **Bereishit**, Noach, Lech Lecha… (`Parshat Bereishit`).
  Мидраш — Bereishit Rabbah. Беседы Ребе — **Likkutei Sichot** (но издательство — *Sichos in English*).
- **Deutsch** — как на de.chabad.org: книги на иврите — **Bereschit, Schemot, Wajikra, Bamidbar, Dewarim, Tehillim,
  Mischle, Ijow, Jeschajahu, Jecheskel, Jehoschua, Schir HaSchirim**; немецкое название — только в скобках:
  «Tehillim (Psalmen)». Ссылки — «Dewarim 34,12». Недельная глава — Wochenabschnitt. Беседы Ребе — **Likkutej Sichot**.

---

## 2. Транслитерация

Произношение — современное ивритское (как у Хабада на сайтах): ת без дагеша = t (Shabbat / Schabbat, mitzvot / Mizwot).

| буква | English (chabad.org) | Deutsch (de.chabad.org) |
|---|---|---|
| ח, כ без дагеша | ch — Chanoch, Chochmah | ch — Chanoch, Chochma |
| צ | tz — tzaddik, Tzimtzum | z — Zaddik, Zimzum |
| ש | sh — Moshe | sch — Mosche |
| ז | z — Zohar | s — Sohar, Masal |
| ס | s | s / ss между гласными — Chessed, Pessach |
| י | y — Yaakov | j — Jaakow |
| ו, ב без дагеша | v — Avraham, Hevel | w — Awraham, Hewel |
| ה в конце | ah — Torah, Chavah, Kabbalah, teshuvah | a — Tora, Chawa, Kabbala, Teschuwa |
| цере перед י («эй») | ei — Bereishit, Likkutei | ej — Likkutej, Raschej tewot (но Bereschit — так на de.chabad.org) |
| удвоенная (дагеш) | Kabbalah, tikkun, Sukkot | Kabbala, Tikkun, Sukkot |
| артикль ה | Ha- с большой в названиях: Baal HaTurim, Mei HaShiloach; Rosh Hashanah | Baal HaTurim, Mei HaSchiloach; Rosch Haschana |

Устоявшиеся у Хабада формы не меняются: Rebbe, Chabad, Chassidut / Chassidic, Moshiach / Moschiach, Tanya / Tanja,
Hayom Yom / Hajom Jom, Simchat Torah / Simchat Tora, Yom Kippur / Jom Kippur.

Термины Каббалы и Хасидута — с переводом при первом упоминании и в словаре `glossary.ts`
(«Zimzum — „Zusammenziehung“…»).

---

## 3. Язык

### English
- Американская орфография, как на chabad.org: color, center, honor, coloring.
- Простые фразы: урок читают и дети 10–12 лет. Одна мысль — одно предложение.
- Кавычки “ ”, апостроф ’, тире —.

### Deutsch — простой, понятный детям
Немецкий — **не книжный и не высокий стиль**, а простой современный язык, который поймёт ребёнок 9–12 лет
(и взрослый, для которого немецкий не родной).
- **«du»** везде — и в игре, и на экране Шабата, и в помощнике. Никакого «Sie».
- Короткие предложения: до ~20 слов, одна мысль. Длинное — разбить на два.
- Глаголы вместо отглагольных существительных: «wenn man Tefillin legt», а не «das Anlegen der Tefillin»;
  «was die Welt hervorbringt», а не «die Hervorbringungen».
- Без цепочек родительного падежа («die Erfüllung des Gebots des …»), без канцелярита
  («beeinträchtigen», «Begründungen vorbringen») и научных слов («Projektionen», «Weltanschauungen»,
  «Partikel des direkten Objekts»). Если без термина нельзя — объяснить его простыми словами.
- Действительный залог чаще страдательного: «Der Allmächtige schuf…», а не «Es wurde erschaffen…».
- Стих Торы в тексте урока можно передать простыми словами (по Хиршу); полный текст издания — в блоке «Quellen».
- Кавычки „ “, апостроф ’, тире —.

---

## 4. Порядок работы

1. Перевод делается с русского текста урока и сверяется с ивритским оригиналом и Sefaria.
2. Имена, книги и термины — по таблицам выше; новый термин — сразу в `glossary.ts` на всех языках.
3. Немецкий перечитать вслух: где запинаешься — упростить.
4. `npm run check` — запрещённые формы (`scripts/style-rules.ts`) и всё остальное.
