# Промт для картинок Memo (Бааль ґа-Турим)

12 раскрасок одним листом: контуры без заливки, без текста, каждая картинка вертикальная 3:4.
Готовый лист → `python3 scripts/memo-frame.py --sheet <лист.png> src/lessons/NN-slug/memo <Parsha>`
(делит лист по белым промежуткам между рамками; ряды любой длины, всего 12). **Порядок картинок —
слева направо, сверху вниз = номера пар 1–12**; не совпал — переименовать файлы перед запуском.
Подписи `caption` в `i18n/<язык>.ts` должны описывать то, что нарисовано.

## Общая часть — вставлять всегда

```
A printable colouring page for children: ONE sheet with 12 separate pictures in a grid
of 4 columns × 3 rows, each picture in its own thin rounded rectangular frame, portrait 3:4,
with clear white gaps between the frames. Order: left to right, top to bottom, numbered 1–12
in my list (do NOT draw the numbers).
Style: clean black line art only, bold even outlines, simple shapes, large areas to colour,
no shading, no grey, no fill, no colour, white background. Warm storybook feel, friendly.
People: the land of Israel in biblical times, modest clothing — long tunics and cloaks, men with
beards and head coverings, women in long dresses with head coverings; kind faces; no violence, no blood.
Absolutely no text, no letters, no numbers, no Hebrew or Latin script anywhere (scrolls and
documents are blank or have only wavy lines).
The 12 pictures:
```

## Ваеце (`15-baal-haturim-vayetze`)

```
1. An open blank scroll on a low table next to a small clay oil lamp with a flame — a study room.
2. A lone traveller with a staff on a long road; a big round sun high in the sky.
3. Three pilgrims in cloaks walking together up a path towards a mountain.
4. The sun half hidden behind hills, its rays fading; a few first stars.
5. A tall ladder rising from the ground up into the clouds.
6. A staircase of steps going upwards; at the top a bright sunrise.
7. A group of people standing close together, praying, heads slightly bowed.
8. A standing stone pillar with a jug pouring oil onto its top.
9. A stone well with a round lid moved aside, several sheep drinking around it.
10. A mandrake plant with leaves on top and a root that looks like a little human figure.
11. Old-fashioned balance scales with two pans, perfectly level.
12. A messenger running fast across a desert, sand dunes behind him.
```

## Ваишлах (`17-baal-haturim-vayishlach`)

```
1. A rolled scroll tied with a ribbon (blank, no writing).
2. The head of a strong ox with big curved horns, seen from the front.
3. A man holding a wooden staff, standing on the bank of a river.
4. A mother hugging two small children.
5. A small open cloth pouch with gemstones spilling out.
6. Two figures wrestling at night under a sky full of stars.
7. A sheaf of straw with flames rising next to it.
8. A stone altar with a fire burning on top.
9. The sun rising over gentle hills, long rays.
10. A man bowing low to the ground; above him a row of seven small circles.
11. Two bearded brothers embracing; above them a row of six small dots.
12. A document with a wax seal and a ribbon (blank, no writing).
```
