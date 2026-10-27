# Картинки художника: фоны, Хранитель, аватары

Игра умеет показывать вместо нарисованных кодом картинок **готовые иллюстрации** — свой набор для каждой
возрастной группы:

| Папка | Возраст | Стиль |
|---|---|---|
| `art/y/` | 8–11 | тёплая книжка-картинка (гуашь и акварель) |
| `art/t/` | 12–15 | современный еврейский графический роман |
| `art/a/` | 16+ | хасидская живопись иерусалимско-цфатской школы |

Пока героя ещё нет (титульный экран), показывается набор `t`. Чего нет в папке — игра рисует как раньше,
поэтому загружать можно частями: хоть один фон.

В каждой папке возраста три подпапки:

| Подпапка | Что | Сколько | Формат | Размер (лучше) | Не больше |
|---|---|---|---|---|---|
| `bg/` | фоны миров | 10 (+10 вертикальных по желанию) | `.webp` / `.jpg` / `.png` | 2400 × 1600 (3 : 2); вертикальный `-p` 1440 × 2560 (9 : 16) | 1 МБ |
| `keeper/` | Хранитель, 6 настроений | 6 | `.png` / `.webp`, **прозрачный фон** | 800 × 1000 (4 : 5) | 500 КБ |
| `avatar/` | аватары героя | 12 (+72 с ролями по желанию) | `.png` / `.webp`, **прозрачный фон** | 512 × 512 (1 : 1) | 250 КБ |

Итого минимальный полный набор: **28 картинок на возраст, 84 на всю игру.**

## Имена файлов (строго так, латиницей)

**Фоны `bg/`** — `base` (титульный экран и экран героя), `library` (пролог, «Мой удел», «К Шабату»…),
`city` (мир 1, рынок), `puzzle` (мир 2), `mirror` (мир 3), `tent` (мир 4), `workshop` (мир 5), `lab` (мир 6),
`sukkah` (мир 7 и финал), `map` (карта миров). Вертикальная версия для телефона — то же имя с `-p`:
`library-p.webp`. Без неё телефон показывает середину горизонтальной картинки.

**Хранитель `keeper/`** — `smile`, `joy`, `think`, `wow`, `warm`, `point` (см. промты ниже).
Обязателен хотя бы `smile`: остальных настроений, которых нет, он заменяет.

**Аватары `avatar/`** — `m1`…`m6` (мальчик / мужчина, внешность 1–6) и `f1`…`f6` (девочка / женщина).
Внешности соответствуют шести кружкам «Внешность» на экране героя (кожа и волосы, см. таблицу ниже).
Роль героя игра рисует значком в углу аватара. Если хочется, чтобы роль была на самой картинке, —
добавь файлы с ролью: `m3-artist.webp` (роли: `explorer` исследователь, `inventor` изобретатель,
`chronicler` летописец, `traveler` путешественник, `artist` художник, `musician` музыкант).
Порядок поиска: `m3-artist` → `m3` → `m-artist` → `m` → рисунок кодом.
«Одежда» на экране героя с картинками меняет цвет фона за аватаром.

## Как загрузить

1. На GitHub открой репозиторий → папку `art` → **Add file → Upload files**.
2. Перетащи файлы и впиши путь папки перед ними, например `art/y/keeper/` (GitHub создаст папки сам).
   Можно загрузить сразу всю папку `y` с подпапками.
3. Внизу — «Create a new branch» или прямо в `main`, как договорились.
4. Напиши Claude «подключи картинки» — он запустит `npm run art` (составит `art/manifest.json`, проверит
   имена, размеры и вес) и `npm test`. Без `manifest.json` игра новые файлы не видит.

Перед загрузкой сожми: [squoosh.app](https://squoosh.app) → WebP, качество 80 (для прозрачных — WebP
тоже держит прозрачность). Фоны 2400 px в WebP обычно 200–500 КБ.

---

# Промты

Промты на английском — генераторы (ChatGPT / DALL·E, Midjourney, Ideogram, Flux, Leonardo) понимают его лучше.
Каждый промт = **стиль возраста** + **сюжет** + **общие правила**. Склеивай три блока подряд.

## Общие правила (добавлять в конец каждого промта)

```
No text, no letters, no Hebrew or any other writing, no numbers, no signatures, no watermarks.
Modest Orthodox Jewish dress code: men and boys wear a kippah, tzitzit fringes visible at the waist; girls and women wear skirts below the knee, sleeves past the elbow, closed neckline. No crosses, no religious symbols of other faiths, no idols, no depiction of the Divine.
```

Почему так: генераторы пишут иврит с ошибками, а Имена Всевышнего на картинке нельзя (её могут распечатать и
выбросить). Буквы, стих и подписи игра ставит сама шрифтом.

Перед загрузкой проверь глазами: нет ли случайных «букв» на корешках книг, вывесках, свитках; скромная ли
одежда; пять ли пальцев. Используй только генераторы, чьи условия разрешают использовать картинки в проекте.

## Стиль по возрастам (начало каждого промта)

**8–11 · `art/y/`**
```
Warm children's picture-book illustration in the spirit of contemporary Orthodox Jewish children's books: gouache and watercolor on textured paper, soft rounded shapes, gentle brown outlines, friendly characters with big kind eyes, warm sunny palette of honey yellow, terracotta, sky blue, olive green and cream, cozy details, soft daylight, cheerful and calm.
```

**12–15 · `art/t/`**
```
Contemporary Jewish graphic-novel illustration, like modern Orthodox youth-magazine comics: clean confident ink linework, flat cel-shaded colors with subtle grain texture, realistic proportions, calm but dynamic composition, rich palette of deep teal, ochre, coral, Jerusalem-stone beige and navy, crisp light and soft shadows.
```

**16+ · `art/a/`**
```
Contemporary Chassidic fine-art painting in the Jerusalem and Tzfat art tradition: expressive acrylic and oil on canvas with visible brushwork, luminous golden light, Jerusalem-stone ochres, lapis blue, pomegranate red and olive green, delicate touches of gold leaf, slightly naive mystical perspective, dignified, contemplative and joyful mood.
```

Чтобы весь набор одного возраста был в одном стиле: сделай сначала одну удачную картинку и дальше давай её
как образец стиля (ChatGPT: «same style as the attached image»; Midjourney: `--sref <ссылка>`; Leonardo:
Style Reference).

## Фоны `bg/` — 3 : 2 (`--ar 3:2`), вертикальные `-p` — 9 : 16 (`--ar 9:16`)

Фон уходит под полупрозрачную карточку с текстом, видны края и низ. Поэтому: **без людей**, светлый воздушный
тон, спокойная середина, главное — по краям и внизу. Добавь к каждому фону:

```
Wide background scene without any people, light and airy overall tone, low contrast in the center (text panel will cover it), interesting details along the left and right edges and at the bottom, horizon in the lower third.
```

Для вертикальной версии `-p` добавь вместо этого:
```
Tall vertical background without any people, light and airy, calm empty middle, the main details at the top and the bottom.
```

| Файл | Сюжет (вставить после стиля) |
|---|---|
| `base` | `Panorama of Jerusalem's Old City at golden morning light seen from the hills, olive trees and a pomegranate tree in the foreground, warm stone walls, soft clouds, a winding path leading into the city.` |
| `library` | `Interior of an old beit midrash library: tall wooden bookshelves full of leather-bound holy books with plain blank spines, a tall arched window with warm sunbeams, a wooden reading table with an open book with blank pages, a brass oil lamp.` |
| `city` | `An ancient Jerusalem marketplace at sunset in the time of King Shlomo: colorful striped awnings over market stalls with pomegranates, figs, grapes and spices, hanging copper lanterns glowing, stone archways and city walls behind.` |
| `puzzle` | `A dreamy landscape of large colorful jigsaw puzzle pieces floating in the sky above soft green rolling hills, one golden piece glowing, gentle clouds, sense of searching and wonder.` |
| `mirror` | `A quiet hall of tall arched mirrors in golden frames reflecting soft blue light, a checkered pale blue and white floor, sunlight glints, calm and mysterious.` |
| `tent` | `Desert landscape at warm evening: a large goat-hair tent open on all four sides like the tent of Avraham, date palms, sand dunes, a big soft sun low in the sky, a jug of water and a welcoming rug at the entrance.` |
| `workshop` | `A sunny carpenter's workshop: wooden pegboard with hand tools (hammer, saw, chisels, plane), a long workbench with planks and wood shavings, sunlight from a window, a half-built wooden chair.` |
| `lab` | `A bright wondrous laboratory of wisdom from King Shlomo's palace: shelves of glass flasks and jars with colorful glowing liquids, brass scales, plants in pots, scrolls tied with ribbons (closed, no writing), soft lavender light.` |
| `sukkah` | `Inside a sukkah at night: a roof of green palm and branch schach with stars shining through, colorful paper chains and hanging fruit decorations, a festive table with a white cloth, an etrog in a silver box, a lulav, warm lamplight.` |
| `map` | `Old parchment treasure map texture filling the whole picture: faint winding paths, little hills, trees and a compass rose drawn in sepia ink, worn edges, no lettering at all.` |

## Хранитель `keeper/` — 4 : 5 (`--ar 4:5`), прозрачный фон

Один и тот же персонаж во всех шести настроениях и во всех трёх стилях. Описание персонажа (вставлять в каждый
промт после стиля):

```
The Keeper: a kind elderly Jewish sage and teacher, long soft white beard, round thin wire glasses, a large dark-navy velvet kippah, warm wise eyes, a long deep-purple robe like a kapote with a golden stripe down the front, a white shirt, white tzitzit fringes at the waist, simple dark shoes. Full body, standing, facing the viewer, centered, the whole figure from the top of the head to the feet fills 95% of the picture height, feet at the very bottom edge. Isolated on a transparent background (or plain white background for later removal), no shadow, no floor, no scenery.
```

| Файл | Настроение (вставить в конец описания) |
|---|---|
| `smile` | `Gentle smile, holding a closed leather-bound book with both hands at his chest.` |
| `joy` | `Joyful laugh with eyes squinting happily, rosy cheeks, both arms opened wide in welcome.` |
| `think` | `Thoughtful, one eyebrow raised, one hand on his chin, the other arm across his chest, looking slightly up.` |
| `wow` | `Amazed and delighted, eyes wide, mouth in a small "oh", both hands raised open at shoulder height.` |
| `warm` | `Tender smile with softly closed eyes, rosy cheeks, right hand on his heart.` |
| `point` | `Friendly smile, right hand raised with the index finger pointing up as if sharing an idea, left arm relaxed.` |

Порядок: сначала `smile`, потом остальные с ним как образцом персонажа (ChatGPT: прикрепи `smile` и напиши
«the same character, same style, new pose: …»; Midjourney: `--cref <ссылка> --cw 100`). Для другого
возраста — тот же персонаж, но с образцом стиля этого возраста.

Если генератор не даёт прозрачный фон: белый фон → убрать в remove.bg, Photopea («Удалить фон») или
Canva, сохранить PNG/WebP с прозрачностью.

## Аватары `avatar/` — 1 : 1 (`--ar 1:1`), прозрачный фон

Портрет по плечи. Общая часть (после стиля):

```
Head-and-shoulders portrait of a single character, facing the viewer, friendly slight smile, centered, the top of the head at 8% from the top edge, shoulders cut by the bottom edge. Isolated on a transparent background (or plain white background for later removal), no scenery, no frame.
```

Кто на портрете (по возрасту набора):

- `y`: `a Jewish boy of about 9` / `a Jewish girl of about 9`
- `t`: `a Jewish teenage boy of about 14` / `a Jewish teenage girl of about 14`
- `a`: `a Jewish young man of about 25` / `a Jewish young woman of about 25`

Одежда: мальчики и мужчины — `white button shirt, dark kippah, tzitzit fringes`; для `a` можно добавить
`short neat beard` у 2–3 внешностей. Девочки и женщины — `modest cardigan over a blouse with a closed
neckline`; для `a` у 2–3 внешностей — `stylish headscarf (tichel)` (замужняя), у остальных — без.
Одежду держи спокойных цветов — цвет «Одежды», который выберет игрок, игра даёт фоном.

Внешность (как кружки на экране героя):

| № | Кожа и волосы | Мальчик `m1…m6` | Девочка `f1…f6` |
|---|---|---|---|
| 1 | светлая кожа, тёмно-каштановые волосы | `fair skin, short straight dark-brown hair` | `fair skin, dark-brown hair in a neat ponytail` |
| 2 | смуглая кожа, чёрные волосы | `light olive skin, short black curly hair` | `light olive skin, black curly hair with a hairband` |
| 3 | загорелая кожа, каштановые | `tan skin, brown hair with long curled peyot behind the ears` | `tan skin, long brown hair in one braid` |
| 4 | светлая кожа, рыжие волосы | `fair skin with freckles, ginger red hair` | `fair skin with freckles, ginger red hair in a bun` |
| 5 | тёмная кожа, чёрные волосы | `dark brown skin, short black curly hair` (Ethiopian Jewish) | `dark brown skin, black curly hair tied back` |
| 6 | очень светлая кожа, светлые волосы | `very fair skin, blond hair` | `very fair skin, blond hair in two braids` |

По желанию — версии с ролью (`m3-artist` и т. п.), добавить в конец:
`explorer` — `wearing a safari hat over the kippah, holding a magnifying glass`;
`inventor` — `brass goggles pushed up on the forehead`;
`chronicler` — `holding a small notebook and a pen`;
`traveler` — `a warm scarf and a backpack strap on the shoulder`;
`artist` — `holding a paintbrush, a little paint on the cheek`;
`musician` — `holding a violin`.
(Для девочек с шляпой/береткой всё так же; у мальчиков головной убор поверх кипы.)

Сначала сделай `m1` и `f1`, дальше — с ними как образцом стиля, чтобы все 12 были одной серией.
