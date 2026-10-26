/**
 * Link-preview pictures (Open Graph, 1200×630) in the style of the share card:
 * public/og/site.png for the catalog, public/og/<slug>.png for every lesson, mental-math.png, daily.png, facts.png and
 * letters.png for «Устный счёт», «Гематрия дня», «Знаете ли вы?» and «Буквы за 5 минут»; neviim, ketuvim, hebrew-words,
 * hemshech, quiz and nigun.png for the pages of the daily study, «Викторина вместе» and «Святая музыка».
 * Also the app icons for «install on the phone» (manifest — scripts/prerender.ts): public/icons/icon-192.png,
 * icon-512.png, maskable-512.png (the mark inside the safe zone) and apple-touch-icon.png (180).
 * And the podcast covers public/podcast/cover-<ru|en|de>.jpg (3000×3000 — Apple Podcasts, Spotify; feeds — prerender).
 * The PNGs are committed; re-run after adding a lesson or changing its title or key equation:
 *
 *   npm i --no-save playwright && npx tsx scripts/og-images.ts
 *
 * Uses the pre-installed Chromium (/opt/pw-browsers) and the site's Google Fonts.
 */
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';
import { LESSONS, PARSHIOT, type Lesson } from '../src/lessons';
import { displayNames } from '../src/core/names';
import { SITE_HOST } from '../src/core/site';
import ru from '../src/i18n/locales/ru';

const OUT = 'public/og';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const isHe = (s: string) => /[א-ת]/.test(s);

const tokens = (line: string[]) =>
  line
    .map((t) =>
      isHe(t)
        ? `<b class="he">${esc(displayNames(t))}</b>`
        : /\d/.test(t)
          ? `<b class="n">${esc(t)}</b>`
          : `<i>${esc(t)}</i>`,
    )
    .join('');

function page(o: { eyebrow: string; eyebrowHtml?: string; he: string; title: string; sub: string; highlight?: string[][]; letters: [string, string] }) {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Frank+Ruhl+Libre:wght@700;900&family=Manrope:wght@600;700&family=IBM+Plex+Mono:wght@600&display=block">
<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#141A33;background-image:radial-gradient(900px 420px at 50% -60px,#2A3463 0,transparent 70%);color:#fff;font-family:Manrope,sans-serif;overflow:hidden;position:relative}
.frame{position:absolute;inset:28px;border:1px solid rgba(216,181,101,.55);outline:1px solid rgba(216,181,101,.3);outline-offset:-8px}
.l{position:absolute;font-family:"Frank Ruhl Libre";font-weight:900;color:rgba(216,181,101,.08);line-height:1}
.l1{font-size:520px;left:-40px;top:-140px}.l2{font-size:460px;right:-20px;bottom:-230px}
.in{position:absolute;inset:28px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;padding:0 80px}
.eyebrow{font-size:20px;letter-spacing:.28em;text-transform:uppercase;color:#D8B565;font-weight:700;display:flex;align-items:center;gap:18px}
.eyebrow .he{font-family:"Frank Ruhl Libre";letter-spacing:0;font-size:24px;direction:rtl;unicode-bidi:isolate}
.eyebrow:before,.eyebrow:after{content:"";width:48px;height:1px;background:rgba(216,181,101,.6)}
.heb{font-family:"Frank Ruhl Libre";font-weight:900;font-size:${o.he.length > 14 ? 76 : 96}px;line-height:1.05;direction:rtl;background:linear-gradient(180deg,#F1DDA4,#C9A04E);-webkit-background-clip:text;color:transparent}
h1{font-family:"Cormorant Garamond";font-weight:700;font-size:56px;line-height:1.05}
.eq{display:grid;gap:4px;margin-top:6px}
.eq div{display:flex;gap:18px;align-items:baseline;justify-content:center}
.eq .he{font-family:"Frank Ruhl Libre";font-weight:700;font-size:44px;color:#fff;direction:rtl}
.eq .n{font-family:"IBM Plex Mono";font-weight:600;font-size:38px;color:#D8B565}
.eq i{font-style:normal;font-family:"IBM Plex Mono";font-size:34px;color:#C9CEE0}
.sub{font-size:22px;color:#C9CEE0;font-weight:600}
.site{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:"IBM Plex Mono";font-size:18px;color:#D8B565;letter-spacing:.06em}
</style></head><body>
<div class="l l1">${o.letters[0]}</div><div class="l l2">${o.letters[1]}</div><div class="frame"></div>
<div class="in">
<div class="eyebrow">${o.eyebrowHtml ?? esc(o.eyebrow)}</div>
<div class="heb">${esc(displayNames(o.he))}</div>
<h1>${esc(o.title)}</h1>
${o.highlight ? `<div class="eq">${o.highlight.map((l) => `<div dir="ltr">${tokens(l)}</div>`).join('')}</div>` : ''}
<div class="sub">${esc(o.sub)}</div>
</div>
<div class="site">${SITE_HOST}</div>
</body></html>`;
}

const lessonPage = (l: Lesson) =>
  page({
    eyebrow: `${l.series === 'rebbe' ? 'Нифлаот Ребе' : 'Нифлаот'} · ${PARSHIOT[l.parsha].name.ru} ${PARSHIOT[l.parsha].year} · урок ${l.number}`,
    he: l.hebrewTitle,
    title: l.texts.ru!.title,
    // a talk of the Rebbe is an investigation, not a gematria game
    sub: `${!l.riddles.length ? 'Карточки' : l.kind === 'sicha' ? 'Расследование' : 'Игра-гематрия'} ${l.texts.ru!.hero.author}`,
    highlight: l.highlight,
    letters: l.heroLetters,
  });

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const p = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const shots: [string, string][] = [
  [
    'site',
    page({
      eyebrow: '5787 · ה׳תשפ״ז',
      eyebrowHtml: '5787 · <span class="he">ה׳תשפ״ז</span>',
      he: 'נפלאות',
      title: 'Онлайн-академия Торы · от 8 до 120',
      sub: 'Тора · Пророки и Писания · Хасидут',
      letters: ['נ', 'פ'],
    }),
  ],
  [
    'mental-math',
    page({
      eyebrow: 'Нифлаот · устный счёт',
      he: 'חשבון',
      title: 'Ментальная арифметика',
      sub: 'Сложение · вычитание · умножение · деление — в уме, по шагам',
      highlight: [['456', '+', '15', '=', '471']],
      letters: ['ח', 'ש'],
    }),
  ],
  [
    'daily',
    page({
      eyebrow: 'Нифлаот · каждый день',
      he: 'גימטריה',
      title: ru['daily.title'] as string,
      sub: 'Одно слово Торы в день — сложите его буквы в уме',
      highlight: [['🟥', '🟨', '🟩']],
      letters: ['ג', 'מ'],
    }),
  ],
  [
    'facts',
    page({
      eyebrow: 'Нифлаот · знаете ли вы?',
      he: 'נפלאות',
      title: ru['facts.title'] as string,
      sub: 'Загадки Торы: гематрия и тайные слова в первых буквах',
      highlight: [['האדם', '=', '50', '=', 'אדמה']],
      letters: ['ד', 'ע'],
    }),
  ],
  [
    'letters',
    page({
      eyebrow: 'Нифлаот · алеф-бет',
      he: 'אבגד',
      title: ru['abc.title'] as string,
      sub: '22 буквы иврита: название, звучание и число',
      highlight: [['א', '=', '1', '·', 'ב', '=', '2', '·', 'ג', '=', '3']],
      letters: ['א', 'ב'],
    }),
  ],
  [
    'neviim',
    page({
      eyebrow: 'Нифлаот · взрослым',
      he: 'נביאים',
      title: 'Пророки за три года',
      sub: 'Отрывок на каждый день · перевод · Мецудат Давид и Раши',
      letters: ['נ', 'ב'],
    }),
  ],
  [
    'ketuvim',
    page({
      eyebrow: 'Нифлаот · взрослым',
      he: 'כתובים',
      title: 'Писания за три года',
      sub: 'Теґилим, Мишлей, Иов и свитки — понемногу каждый день',
      letters: ['כ', 'ת'],
    }),
  ],
  [
    'hebrew-words',
    page({
      eyebrow: 'Нифлаот · взрослым',
      he: 'מילים',
      title: '500 слов Танаха',
      sub: '80 % текста Пророков и Писаний · перевод, корень, повторение',
      letters: ['מ', 'ל'],
    }),
  ],
  [
    'learn-hebrew',
    page({
      eyebrow: 'Нифлаот · святой язык',
      he: 'לשון הקודש',
      title: 'Учить иврит — язык Торы и Пророков',
      sub: 'Буквы, слова Торы и 1000 слов Танаха · уроки по 5 минут',
      letters: ['ל', 'ש'],
    }),
  ],
  [
    'hemshech',
    page({
      eyebrow: 'Нифлаот · хасидут',
      he: 'המשך תרס״ו',
      title: 'Ґемшех Самех-Вав',
      sub: 'Маамары Ребе Рашаба — по 10 минут в учебный день',
      letters: ['ה', 'ס'],
    }),
  ],
  [
    'quiz',
    page({
      eyebrow: 'Нифлаот · вместе',
      he: 'חידון',
      title: ru['lq.title'] as string,
      sub: 'Вопросы на экране — ответы с телефонов: для класса и семьи',
      letters: ['ח', 'ד'],
    }),
  ],
  [
    'nigun',
    page({
      eyebrow: 'Нифлаот · святая музыка',
      he: 'ניגון',
      title: ru['nigun.title'] as string,
      sub: 'Хасидские нигуны с караоке — слушать, петь и учить',
      letters: ['נ', 'ג'],
    }),
  ],
  ...LESSONS.map((l) => [l.slug, lessonPage(l)] as [string, string]),
];
for (const [name, html] of shots) {
  await p.setContent(html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`${OUT}/${name}.png`);
}

/* app icons: נ in gold on the night-blue of the site, in a thin gold frame */
const icon = (size: number, inset: number) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@900&display=block">
<style>*{margin:0}body{width:${size}px;height:${size}px;background:#141A33;background-image:radial-gradient(${size}px ${size * 0.7}px at 50% 0,#2A3463 0,transparent 75%);position:relative;overflow:hidden}
.f{position:absolute;inset:${inset}px;border:${Math.max(2, size / 96)}px solid rgba(216,181,101,.7);border-radius:${size * 0.12}px}
.l{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:"Frank Ruhl Libre";font-weight:900;font-size:${(size - 2 * inset) * 0.78}px;line-height:1;padding-bottom:${size * 0.04}px;background:linear-gradient(180deg,#F1DDA4,#C9A04E);-webkit-background-clip:text;color:transparent}</style>
</head><body><div class="f"></div><div class="l">נ</div></body></html>`;
mkdirSync('public/icons', { recursive: true });
for (const [name, size, inset] of [
  ['icon-192', 192, 12],
  ['icon-512', 512, 32],
  ['maskable-512', 512, 92],
  ['apple-touch-icon', 180, 12],
] as const) {
  await p.setViewportSize({ width: size, height: size });
  await p.setContent(icon(size, inset), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `public/icons/${name}.png` });
  console.log(`public/icons/${name}.png`);
}

/* podcast covers: the same night-blue and gold, נפלאות and the podcast's name — square, 3000 px */
const COVER_SUB = { ru: 'Уроки Торы вслух', en: 'Torah lessons aloud', de: 'Tora-Lektionen zum Hören' } as const;
const cover = (lang: keyof typeof COVER_SUB) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@700&family=Frank+Ruhl+Libre:wght@900&family=Manrope:wght@700&display=block">
<style>*{margin:0;box-sizing:border-box}body{width:3000px;height:3000px;background:#141A33;background-image:radial-gradient(3000px 2100px at 50% 0,#2A3463 0,transparent 75%);position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:90px}
.f{position:absolute;inset:150px;border:16px solid rgba(216,181,101,.7);border-radius:300px}
.he{font-family:"Frank Ruhl Libre";font-weight:900;font-size:640px;line-height:1;background:linear-gradient(180deg,#F1DDA4,#C9A04E);-webkit-background-clip:text;color:transparent;padding-bottom:40px}
.t{font-family:"Cormorant Garamond";font-weight:700;font-size:330px;line-height:1;color:#F6EBD0}
.s{font-family:Manrope;font-weight:700;font-size:150px;color:#D8B565;letter-spacing:4px;text-align:center}
.w{position:absolute;bottom:250px;font-family:Manrope;font-weight:700;font-size:90px;color:rgba(246,235,208,.6)}</style>
</head><body><div class="f"></div><div class="he" dir="rtl">נפלאות</div><div class="t">${lang === 'ru' ? 'Нифлаот' : 'Niflaot'}</div><div class="s">${COVER_SUB[lang]}</div><div class="w">${SITE_HOST}</div></body></html>`;
mkdirSync('public/podcast', { recursive: true });
await p.setViewportSize({ width: 3000, height: 3000 });
for (const lang of ['ru', 'en', 'de'] as const) {
  await p.setContent(cover(lang), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `public/podcast/cover-${lang}.jpg`, type: 'jpeg', quality: 86 });
  console.log(`public/podcast/cover-${lang}.jpg`);
}
await browser.close();
