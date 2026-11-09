# «Слово — картинка»: 50 картинок для первых слов Танаха

Механика игры: четыре плитки с картинками и слово на иврите посередине; нужно нажать на нужную картинку.
Картинки — для первых 50 **слов, которые можно нарисовать**, по частоте в Пророках и Писаниях (`src/tanakh/words.json`).
Служебные и отвлечённые слова пропущены: אֵת, עַל, אָמַר, כֹּל, לֹא, אֲשֶׁר, כִּי, דָּבָר, שֵׁם, נֶפֶשׁ, Имена Всевышнего и др.

Игра — `#/pics` (`src/components/PicWordsPage.tsx`, логика — `src/core/picWords.ts`). **Готовы картинки 1–50, кроме 43 «семь» и 44 «хлеб»; из партии 51–100 — сеткой 5×5 (08.11.2026) пришли четыре, сосуд, нос и ещё 21 слово не из таблицы: коза, стан (шатры), росток, смоковница, змей, лев, прах, голубь, рыба, топор, корабль, пень, луна, звезда, дождь, лист, колючка, посох, колодец, жертвенник, ступени — они в игре (`PIC_WORDS`), из таблицы их можно не рисовать** (их панели генератор обрезал справа — перегенерировать; 07.11.2026; в 38–40 вместо «четыре», «сосуд», «нос» пришли корова, овца и виноград — они в таблице, а те три слова — в конце, 51–53).

**Новая картинка:** генератор иногда кладёт картинку поверх фона с тонкой рамкой (светлая вертикальная линия ≈ 10 % от края) —
её обрезать, дополнить до квадрата цветом фона, сжать: 512×512, WebP q80 → `public/lashon/pics/<номер Стронга>.webp`;
номер — добавить в `PIC_WORDS` (по порядку), путающиеся слова — в одну группу `PIC_GROUPS`. Проверка — `scripts/check-words.ts`
(картинка, перевод на трёх языках, в вопросе — 4 картинки, которые не путаются).

---

## 1. Общий стиль — вставлять перед каждой картинкой

```
Flat vintage linocut-style illustration, like a hand-printed woodcut: bold dark navy (#1F2A44) outlines
of even thickness, a little fine hatching for shading, only 2–3 flat colours, no gradients, no 3D,
no photorealism. ONE simple object (or one small scene) centred, filling about 60% of the frame,
generous empty space around it. Plain solid background of a single flat colour: {BG}.
Square 1:1, 1024×1024. Friendly, clear, readable at small size on a phone.
Absolutely no text, no letters, no numbers, no Hebrew or Latin script anywhere in the image.
People: simple stylised figures in the land of Israel in biblical times — modest clothing: long
tunics and cloaks; women in long dresses with a head covering; men with beards. Kind faces, no violence, no blood.
```

**Фон `{BG}`** — по очереди, чтобы на поле игры рядом не стояли два одинаковых цвета:
1. `soft sage green #7FA89B`
2. `dusty pink #F0C1D4`
3. `pale lavender #ADB2D6`
4. `deep plum #9A3F7C`
5. `warm cream #F3E6C8`
6. `tchelet blue #8DB6D9`

Детали предмета — в 2–3 цветах, которые хорошо видны на этом фоне: тёмно-синий контур, плюс золото
`#E0B33A`, бирюза `#7EDFE0`, вишнёвый `#7A1F4C` или белый.

**Стрелка-указатель** (для семьи и «большой»): если на картинке две фигуры, на нужную показывает
`a small bold coral-pink arrow pointing at …` — так игрок видит, кто тут «сын», а кто «отец».

---

## 2. 50 картинок

| № | Стронг | Слово | Перевод | Что нарисовать (вставить вместо «ONE simple object…») | Фон |
|---|---|---|---|---|---|
| 1 | 1121 | בֵּן | сын | a father and a small boy holding hands; a coral-pink arrow points at the boy | 1 |
| 2 | 4428 | מֶלֶךְ | царь | a bearded king on a simple throne, wearing a golden crown and a long robe | 2 |
| 3 | 1004 | בַּיִת | дом | a small flat-roofed stone house of ancient Israel with a wooden door and one window | 3 |
| 4 | 776 | אֶרֶץ | земля, страна | the planet Earth as a simple globe with green land and blue sea | 4 |
| 5 | 3117 | יוֹם | день | a bright sun high above gentle hills, clear daylight | 6 |
| 6 | 376 | אִישׁ | мужчина | a grown man with a beard standing, full figure, in a tunic and cloak | 5 |
| 7 | 6440 | פָּנִים | лицо | a friendly human face, front view, close-up, only the face | 1 |
| 8 | 5971 | עַם | народ | a crowd of many small people standing together, seen from the front | 2 |
| 9 | 3027 | יָד | рука | an open human hand, palm forward | 3 |
| 10 | 5892 | עִיר | город | an ancient walled city on a hill: stone walls, towers, many small houses | 4 |
| 11 | 1 | אָב | отец | a bearded father and a small boy holding hands; a coral-pink arrow points at the father | 5 |
| 12 | 5869 | עַיִן | глаз | one large human eye with eyelashes, close-up | 6 |
| 13 | 5650 | עֶבֶד | слуга | a servant in a simple tunic carrying a tray with a jug and cups | 1 |
| 14 | 1870 | דֶּרֶךְ | дорога | a winding dirt road going over hills into the distance | 2 |
| 15 | 259 | אֶחָד | один | exactly ONE pomegranate | 3 |
| 16 | 3820 | לֵב | сердце | a simple red heart shape | 5 |
| 17 | 8141 | שָׁנָה | год | one tree drawn four times in a circle: blossoming, green, autumn, bare — the four seasons | 4 |
| 18 | 802 | אִשָּׁה | женщина | a woman in a long dress with a head covering, full figure | 6 |
| 19 | 7218 | רֹאשׁ | голова | a human head in profile with hair and beard, no body | 1 |
| 20 | 3548 | כֹּהֵן | коэн | a kohen of the Temple in white linen garments with a white turban and a sash | 2 |
| 21 | 8147 | שְׁנַיִם | два | exactly TWO pomegranates side by side | 3 |
| 22 | 1419 | גָּדוֹל | большой | a big camel next to a tiny camel; a coral-pink arrow points at the big one | 5 |
| 23 | 6963 | קוֹל | голос, звук | a person calling out with hands cupped around the mouth, curved sound waves | 4 |
| 24 | 2022 | הַר | гора | one tall mountain with a rocky peak | 6 |
| 25 | 1323 | בַּת | дочь | a mother and a little girl holding hands; a coral-pink arrow points at the girl | 1 |
| 26 | 2719 | חֶרֶב | меч | an ancient short sword lying horizontally, with a decorated hilt | 2 |
| 27 | 6310 | פֶּה | рот | a smiling human mouth with lips, close-up | 3 |
| 28 | 4325 | מַיִם | вода | water pouring from a clay jug into a clay bowl, with splashes | 5 |
| 29 | 7307 | רוּחַ | ветер | strong wind: curling wind lines blowing leaves and bending a palm tree | 4 |
| 30 | 251 | אָח | брат | two boys standing shoulder to shoulder; a coral-pink arrow points at one of them | 6 |
| 31 | 8064 | שָׁמַיִם | небо | an open sky with a few clouds and birds, nothing on the ground | 1 |
| 32 | 8179 | שַׁעַר | ворота | a big ancient city gate: stone arch with heavy wooden doors | 2 |
| 33 | 7969 | שָׁלוֹשׁ | три | exactly THREE pomegranates in a row | 3 |
| 34 | 3220 | יָם | море | sea waves up to the horizon with one small sailing boat | 5 |
| 35 | 784 | אֵשׁ | огонь | a campfire: flames over a few logs | 4 |
| 36 | 3701 | כֶּסֶף | серебро | a small pile of shiny SILVER coins and a silver bar (silver-grey, not gold) | 6 |
| 37 | 2091 | זָהָב | золото | a small pile of shiny GOLD bars and a gold ring (bright gold) | 1 |
| 38 | 1241 | בָּקָר | крупный скот, коровы | a cow standing, side view | 2 |
| 39 | 6629 | צֹאן | мелкий скот, овцы | a fluffy sheep standing, side view | 3 |
| 40 | 6025 | עֵנָב | виноградина, виноград | a bunch of grapes with a vine leaf | 5 |
| 41 | 6086 | עֵץ | дерево | a single olive tree with a thick twisted trunk | 4 |
| 42 | 7704 | שָׂדֶה | поле | a field of ripe wheat with a low horizon | 6 |
| 43 | 7651 | שֶׁבַע | семь | exactly SEVEN pomegranates in two rows (four and three) | 1 |
| 44 | 3899 | לֶחֶם | хлеб | a round loaf of bread | 2 |
| 45 | 5288 | נַעַר | юноша | a teenage boy (about 14), full figure, a shepherd's staff in hand | 3 |
| 46 | 2568 | חָמֵשׁ | пять | exactly FIVE pomegranates (three above two) | 5 |
| 47 | 7272 | רֶגֶל | нога | a human leg and bare foot, side view | 4 |
| 48 | 68 | אֶבֶן | камень | one large rough stone | 6 |
| 49 | 5612 | סֵפֶר | книга | a closed thick old book with a ribbon bookmark, blank cover | 1 |
| 50 | 3915 | לַיְלָה | ночь | a dark night sky with a crescent moon and stars over a sleeping village | 2 |

---

## 2а. Следующие 50 картинок (51–100)

51–55 — пять, которых ещё нет («четыре», «сосуд», «нос» и заново «семь», «хлеб»), 56–100 — следующие по частоте слова, которые
можно нарисовать. Отвлечённые слова, Имена, ангелы, ковчег, идолы, кровь и Мишкан пропущены.

**Добавить к общему стилю** (прошлая партия пришла коллажем, рисунки обрезаны):

```
ONE single image per request. Full square canvas, the background colour fills the whole canvas edge to edge.
No grid, no panels, no frames, no borders, no white margins, nothing from other pictures.
The whole object is inside the frame with empty space on every side — nothing touches or is cut by the edge.
```

Файлы — по номеру таблицы: `51.png` … `100.png`.

| № | Стронг | Слово | Перевод | Что нарисовать | Фон |
|---|---|---|---|---|---|
| 51 | 702 | אַרְבַּע | четыре | exactly FOUR pomegranates, two above two, all four whole and well inside the frame | 2 |
| 52 | 3627 | כְּלִי | сосуд | an ancient clay jar with two handles | 3 |
| 53 | 639 | אַף | нос | a human nose, close-up, side view | 5 |
| 54 | 7651 | שֶׁבַע | семь | exactly SEVEN pomegranates: a row of four above a row of three, every one whole, well inside the frame | 4 |
| 55 | 3899 | לֶחֶם | хлеб | a round loaf of bread, whole, centred, with space on all sides | 6 |
| 56 | 4196 | מִזְבֵּחַ | жертвенник | a square altar of rough stones with four small horn-shaped corners, nothing on it | 1 |
| 57 | 4057 | מִדְבָּר | пустыня | desert: sand dunes under a hot sky, one small acacia tree | 2 |
| 58 | 517 | אֵם | мать | a mother in a long dress and head covering holding a small child by the hand; a coral-pink arrow points at the mother | 3 |
| 59 | 241 | אֹזֶן | ухо | one human ear, close-up, side view | 5 |
| 60 | 8337 | שֵׁשׁ | шесть | exactly SIX pomegranates: two rows of three, every one whole | 4 |
| 61 | 1242 | בֹּקֶר | утро | morning: the sun just rising over hills, rooster on a fence | 6 |
| 62 | 6235 | עֶשֶׂר | десять | exactly TEN pomegranates: two rows of five, small, every one whole | 1 |
| 63 | 168 | אֹהֶל | шатёр | a goat-hair tent of the desert, open flap, tent pegs and ropes | 2 |
| 64 | 3678 | כִּסֵּא | престол, трон | an empty golden throne with lions carved on the armrests, nobody on it | 3 |
| 65 | 5483 | סוּס | конь | a horse standing, side view | 5 |
| 66 | 2346 | חוֹמָה | стена (городская) | a long city wall of big stone blocks with battlements, no gate | 4 |
| 67 | 2205 | זָקֵן | старый, старейшина | an old man with a long white beard leaning on a walking stick | 6 |
| 68 | 5104 | נָהָר | река | a wide river flowing between green banks with reeds | 1 |
| 69 | 3196 | יַיִן | вино | a clay wine jar and a goblet filled with dark red wine, no grapes | 2 |
| 70 | 8121 | שֶׁמֶשׁ | солнце | a big bright sun with rays, nothing else | 3 |
| 71 | 4294 | מַטֶּה | посох | a single wooden shepherd’s staff with a curved top, standing upright | 5 |
| 72 | 7393 | רֶכֶב | колесница | an ancient two-wheeled chariot pulled by two horses, empty | 4 |
| 73 | 899 | בֶּגֶד | одежда | a folded long tunic and a striped cloak lying on a chest | 6 |
| 74 | 3671 | כָּנָף | крыло | one large bird wing with long feathers | 1 |
| 75 | 5178 | נְחֹשֶׁת | медь | a shiny copper pot and copper bowl (reddish copper colour, not gold, not silver) | 2 |
| 76 | 8083 | שְׁמֹנֶה | восемь | exactly EIGHT pomegranates: two rows of four, every one whole | 3 |
| 77 | 8081 | שֶׁמֶן | масло (оливковое) | a small clay jug of golden olive oil with a few green olives beside it | 5 |
| 78 | 738 | אַרְיֵה | лев | a lion standing, side view, with a big mane | 4 |
| 79 | 1817 | דֶּלֶת | дверь | one closed wooden door with iron studs, in a stone frame, no house around | 6 |
| 80 | 7892 | שִׁיר | песня | three children singing together, mouths open, a few floating musical notes | 1 |
| 81 | 6529 | פְּרִי | плод | a basket of fruits: figs and dates (no pomegranates, no grapes) | 2 |
| 82 | 3754 | כֶּרֶם | виноградник | a vineyard: neat rows of grapevines on a hillside | 3 |
| 83 | 7198 | קֶשֶׁת | лук (для стрельбы); радуга | a hunting bow without an arrow, drawn large | 5 |
| 84 | 352 | אַיִל | баран | a ram with big curled horns, standing | 4 |
| 85 | 269 | אָחוֹת | сестра | two girls holding hands; a coral-pink arrow points at one of them | 6 |
| 86 | 7782 | שׁוֹפָר | шофар | one ram’s-horn shofar, curved | 1 |
| 87 | 730 | אֶרֶז | кедр | a tall cedar tree of Lebanon with wide flat layers of branches | 2 |
| 88 | 6697 | צוּר | скала | a tall steep rocky cliff | 3 |
| 89 | 1270 | בַּרְזֶל | железо | an iron axe head and an iron chain (dark grey metal) | 5 |
| 90 | 7676 | שַׁבָּת | Шабат | two lit Shabbat candles in candlesticks and a covered challah on a table | 4 |
| 91 | 4043 | מָגֵן | щит | a round ancient shield, front view | 6 |
| 92 | 3206 | יֶלֶד | ребёнок | a small child (about 4 years old) standing and smiling, full figure | 1 |
| 93 | 6153 | עֶרֶב | вечер | evening: the sun setting behind hills, orange-pink sky | 2 |
| 94 | 2543 | חֲמוֹר | осёл | a donkey standing, side view | 3 |
| 95 | 7979 | שֻׁלְחָן | стол | an empty wooden table, side view | 5 |
| 96 | 4026 | מִגְדָּל | башня | one tall stone watchtower, alone on a hill | 4 |
| 97 | 8127 | שֵׁן | зуб | one big white tooth | 6 |
| 98 | 3658 | כִּנּוֹר | арфа, лира | an ancient wooden lyre (David’s harp) with strings | 1 |
| 99 | 5775 | עוֹף | птица | one small bird sitting on a branch | 2 |
| 100 | 1706 | דְּבַשׁ | мёд | a clay pot of honey with a honey dipper and one honeycomb | 3 |

**Не встретятся в одном вопросе** (похожие): числа (все гранаты); люди (мать, сестра, ребёнок, старик — с мужчиной, отцом, сыном…);
утро / вечер / солнце / день / ночь; река / море / вода; кедр / дерево; скала / камень / гора; стена / город / ворота / башня; дверь / дом;
трон / царь; лев, конь, осёл, баран — с коровой и овцой; медь / железо / серебро / золото; вино / вода; виноградник / виноград / поле;
Шабат / хлеб; посох / юноша; лира / песня.

## 3. Что проверить в каждой картинке

- Нет ни одной буквы и цифры, даже на книге, монетах и свитках.
- Одежда скромная, никакого насилия: меч просто лежит, без крови.
- Числа (1, 2, 3, 4, 5, 7) — **ровно столько** гранатов. Генераторы часто ошибаются, пересчитать.
- Картинку понятно без подписи даже в 150 px.
- Внутри одного вопроса игры не будут рядом слова, которые путаются: семья (сын / дочь / отец / брат /
  мужчина / юноша / женщина / слуга), лицо / голова / рот / нос / глаз, небо / день / ночь,
  вода / море, земля / поле, серебро / золото, числа между собой.
