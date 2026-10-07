/**
 * Link-preview pictures (Open Graph, 1200×630) in the style of the share card:
 * public/og/site.png for the catalog and public/og/<slug>.png for every lesson.
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
    eyebrow: `Нифлаот · ${PARSHIOT[l.parsha].name.ru} ${PARSHIOT[l.parsha].year} · урок ${l.number}`,
    he: l.hebrewTitle,
    title: l.texts.ru!.title,
    sub: 'Игра-гиматрия по статье рава Ицхака Гинзбурга',
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
      title: ru['catalog.uvp'] as string,
      sub: 'Игры-гиматрии по статьям рава Ицхака Гинзбурга',
      letters: ['נ', 'פ'],
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
await browser.close();
