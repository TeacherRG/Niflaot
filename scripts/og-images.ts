/**
 * Link-preview pictures (Open Graph, 1200×630) in the style of the share card:
 * public/og/site.png for the catalog, public/og/<slug>.png for every lesson, mental-math.png, daily.png, facts.png and
 * letters.png for «Устный счёт», «Гематрия дня», «Знаете ли вы?» and «Буквы за 5 минут»; neviim, ketuvim, hebrew-words,
 * hemshech, quiz and nigun.png for the pages of the daily study, «Викторина вместе» and «Святая музыка».
 * Every picture carries the site's logo — the round seal «נפלאות» (src/assets/logos/niflaot.webp; the big one for the covers —
 * scripts/assets/niflaot-logo.webp). Also the app icons for «install on the phone» (manifest — scripts/prerender.ts):
 * public/icons/icon-192.png, icon-512.png, maskable-512.png (the seal inside the safe zone) and apple-touch-icon.png (180).
 * And the podcast covers public/podcast/cover-<ru|en|de>.jpg (3000×3000 — Apple Podcasts, Spotify; feeds — prerender).
 * The pictures are in English for every page and language (one preview, readable everywhere — owner's decision).
 * The PNGs are committed; re-run after adding a lesson or changing its title or key equation:
 *
 *   npm i --no-save playwright && npx tsx scripts/og-images.ts
 *
 * Uses the pre-installed Chromium (/opt/pw-browsers) and the site's Google Fonts.
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { LESSONS, PARSHIOT, type Lesson } from '../src/lessons';
import { displayNames } from '../src/core/names';
import { SITE_HOST } from '../src/core/site';
import en from '../src/i18n/locales/en';

const OUT = 'public/og';
/** the round seal «נפלאות» — one logo everywhere (owner, 28.10.2026): 512 px for previews and icons, 1600 px for the podcast covers */
const LOGO = `data:image/webp;base64,${readFileSync('src/assets/logos/niflaot.webp').toString('base64')}`;
const LOGO_BIG = `data:image/webp;base64,${readFileSync('scripts/assets/niflaot-logo.webp').toString('base64')}`;
const NAVY = '#0B1D3C';
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
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Frank+Ruhl+Libre:wght@700;900&family=Manrope:wght@600;700&family=IBM+Plex+Mono:wght@600&display=block">
<style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#141A33;background-image:radial-gradient(900px 420px at 50% -60px,#2A3463 0,transparent 70%);color:#fff;font-family:Manrope,sans-serif;overflow:hidden;position:relative}
.frame{position:absolute;inset:28px;border:1px solid rgba(216,181,101,.55);outline:1px solid rgba(216,181,101,.3);outline-offset:-8px}
.l{position:absolute;font-family:"Frank Ruhl Libre";font-weight:900;color:rgba(216,181,101,.08);line-height:1}
.l1{font-size:520px;left:-40px;top:-140px}.l2{font-size:460px;right:-20px;bottom:-230px}
.in{position:absolute;inset:28px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;padding:0 120px}
.logo{position:absolute;top:46px;left:46px;width:104px;height:104px}
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
<div class="l l1">${o.letters[0]}</div><div class="l l2">${o.letters[1]}</div><div class="frame"></div><img class="logo" src="${LOGO}" alt="">
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
    eyebrow: `${l.series === 'rebbe' ? 'Niflaot of the Rebbe' : 'Niflaot'} · ${PARSHIOT[l.parsha].name.en ?? PARSHIOT[l.parsha].name.ru} ${PARSHIOT[l.parsha].year} · lesson ${l.number}`,
    he: l.hebrewTitle,
    title: (l.texts.en ?? l.texts.ru)!.title,
    // a talk of the Rebbe is an investigation, not a gematria game
    sub: `${!l.riddles.length ? 'Cards' : l.kind === 'sicha' ? 'Investigation' : 'Gematria game'} ${(l.texts.en ?? l.texts.ru)!.hero.author}`,
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
      title: 'Online Torah Academy · from 8 to 120',
      sub: 'Torah · Prophets and Writings · Chassidut',
      letters: ['נ', 'פ'],
    }),
  ],
  [
    'mental-math',
    page({
      eyebrow: 'Niflaot · mental math',
      he: 'חשבון',
      title: 'Mental Math',
      sub: 'Addition · subtraction · multiplication · division — in your head, step by step',
      highlight: [['456', '+', '15', '=', '471']],
      letters: ['ח', 'ש'],
    }),
  ],
  [
    'daily',
    page({
      eyebrow: 'Niflaot · every day',
      he: 'גימטריה',
      title: en['daily.title'] as string,
      sub: 'One word of Torah a day — add up its letters in your head',
      highlight: [['🟥', '🟨', '🟩']],
      letters: ['ג', 'מ'],
    }),
  ],
  [
    'facts',
    page({
      eyebrow: 'Niflaot · did you know?',
      he: 'נפלאות',
      title: en['facts.title'] as string,
      sub: 'Torah riddles: gematria and words hidden in first letters',
      highlight: [['האדם', '=', '50', '=', 'אדמה']],
      letters: ['ד', 'ע'],
    }),
  ],
  [
    'letters',
    page({
      eyebrow: 'Niflaot · alef-bet',
      he: 'אבגד',
      title: en['abc.title'] as string,
      sub: '22 Hebrew letters: name, sound and number',
      highlight: [['א', '=', '1', '·', 'ב', '=', '2', '·', 'ג', '=', '3']],
      letters: ['א', 'ב'],
    }),
  ],
  [
    'neviim',
    page({
      eyebrow: 'Niflaot · for adults',
      he: 'נביאים',
      title: 'The Prophets in three years',
      sub: 'A passage every day · translation · Metzudat David and Rashi',
      letters: ['נ', 'ב'],
    }),
  ],
  [
    'ketuvim',
    page({
      eyebrow: 'Niflaot · for adults',
      he: 'כתובים',
      title: 'The Writings in three years',
      sub: 'Tehillim, Mishlei, Iyov and the scrolls — a little every day',
      letters: ['כ', 'ת'],
    }),
  ],
  [
    'hebrew-words',
    page({
      eyebrow: 'Niflaot · for adults',
      he: 'מילים',
      title: '500 words of Tanakh',
      sub: '80% of the Prophets and Writings · translation, root, review',
      letters: ['מ', 'ל'],
    }),
  ],
  [
    'learn-hebrew',
    page({
      eyebrow: 'Niflaot · the holy tongue',
      he: 'לשון הקודש',
      title: 'Learn Hebrew — the language of the Torah',
      sub: 'Letters, words of the Torah and 2000 words of Tanakh · 5-minute lessons',
      letters: ['ל', 'ש'],
    }),
  ],
  [
    'hemshech',
    page({
      eyebrow: 'Niflaot · Chassidut',
      he: 'המשך תרס״ו',
      title: 'Hemshech Samech-Vav',
      sub: 'Maamarim of the Rebbe Rashab — 10 minutes a study day',
      letters: ['ה', 'ס'],
    }),
  ],
  [
    'quiz',
    page({
      eyebrow: 'Niflaot · together',
      he: 'חידון',
      title: en['lq.title'] as string,
      sub: 'Questions on the screen, answers from phones — for class and family',
      letters: ['ח', 'ד'],
    }),
  ],
  [
    'nigun',
    page({
      eyebrow: 'Niflaot · holy music',
      he: 'ניגון',
      title: en['nigun.title'] as string,
      sub: 'Chassidic niggunim with karaoke — listen, sing and learn',
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

/* app icons: the seal on its night-blue; maskable — inside the safe zone (a circle of 80 %) */
const icon = (size: number, inset: number) => `<!doctype html><html><head><meta charset="utf-8">
<style>*{margin:0}body{width:${size}px;height:${size}px;background:${NAVY};position:relative;overflow:hidden}
img{position:absolute;inset:${inset}px;width:${size - 2 * inset}px;height:${size - 2 * inset}px}</style>
</head><body><img src="${LOGO}" alt=""></body></html>`;
mkdirSync('public/icons', { recursive: true });
for (const [name, size, inset] of [
  ['icon-192', 192, 4],
  ['icon-512', 512, 10],
  ['maskable-512', 512, 52],
  ['apple-touch-icon', 180, 8],
] as const) {
  await p.setViewportSize({ width: size, height: size });
  await p.setContent(icon(size, inset), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `public/icons/${name}.png` });
  console.log(`public/icons/${name}.png`);
}

/* podcast covers: only the seal on its night-blue — no words, the site speaks several languages (owner, 28.10.2026);
   one picture, saved for each feed (ru, en, de) — square, 3000 px */
const cover = () => `<!doctype html><html><head><meta charset="utf-8">
<style>*{margin:0}body{width:3000px;height:3000px;background:${NAVY};display:flex;align-items:center;justify-content:center;overflow:hidden}
img{width:2700px;height:2700px}</style>
</head><body><img src="${LOGO_BIG}" alt=""></body></html>`;
mkdirSync('public/podcast', { recursive: true });
await p.setViewportSize({ width: 3000, height: 3000 });
for (const lang of ['ru', 'en', 'de'] as const) {
  await p.setContent(cover(), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `public/podcast/cover-${lang}.jpg`, type: 'jpeg', quality: 86 });
  console.log(`public/podcast/cover-${lang}.jpg`);
}
await browser.close();
