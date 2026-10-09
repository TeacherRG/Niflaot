/**
 * After `vite build`: pages and files for search engines and a stricter browser policy.
 *  - dist/<slug>/index.html for every lesson: its own title, description, canonical URL, Open Graph,
 *    JSON-LD and the lesson outline as static HTML (the app replaces it on start and opens the lesson);
 *  - static outline of the catalog in dist/index.html, with real links to the lesson pages;
 *  - dist/sitemap.xml and dist/robots.txt;
 *  - Open Graph picture: dist/og/<slug>.png if it exists (scripts/og-images.ts), else dist/og/site.png;
 *  - Content-Security-Policy <meta> on every page (GitHub Pages can't send headers).
 * Run by `npm run build`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { LESSONS, LESSON_GROUPS, type Lesson } from '../src/lessons';
import { SITE_URL } from '../src/core/site';
import { displayNames } from '../src/core/names';
import { buildTags } from '../src/core/tags';
import ru from '../src/i18n/locales/ru';
import { markHebrewHtml } from '../src/core/langMarkup';
import { stripFootnotes } from '../src/sources/footnotes';

const DIST = 'dist';
const LOCALE = 'ru';
const ui = ru;
const shell = readFileSync(`${DIST}/index.html`, 'utf8');

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** plain text for meta tags and static HTML: no markup, Names of G-d as on screen */
const plain = (html: string) => displayNames(html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
const text = (l: Lesson) => l.texts[LOCALE]!;
/** «Урок 2», or «Нифлаот Ребе · Урок 1» for a lesson of the Rebbe's section */
const lessonLabel = (l: Lesson) =>
  `${l.series === 'rebbe' ? `${ui['rebbe.section']} · ` : ''}${ui['catalog.lesson'].toString().replace('{n}', String(l.number))}`;
const lessonUrl = (l: Lesson) => `${SITE_URL}/${l.slug}/`;

/* ───── Content-Security-Policy ───── */

const assistant = process.env.VITE_ASSISTANT_URL ? new URL(process.env.VITE_ASSISTANT_URL).origin : '';
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://gc.zgo.at",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://niflaot.goatcounter.com",
  `connect-src 'self' https://api.github.com https://niflaot.goatcounter.com${assistant ? ` ${assistant}` : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

/* ───── page assembly ───── */

interface Page {
  title: string;
  description: string;
  url: string;
  type: 'website' | 'article';
  jsonLd: object;
  /** link-preview picture in dist/og/ (scripts/og-images.ts), without .png */
  image: string;
  imageAlt: string;
  body: string;
  /** path from the page to dist root */
  root: string;
}

function setMeta(html: string, attr: 'name' | 'property', key: string, value: string) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`);
  if (!re.test(html)) throw new Error(`index.html: no <meta ${attr}="${key}">`);
  return html.replace(re, () => `<meta ${attr}="${key}" content="${esc(value)}" />`);
}

function render(p: Page): string {
  let html = shell
    .replace(/<title>[^<]*<\/title>/, () => `<title>${esc(p.title)}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${p.url}" />`);
  html = setMeta(html, 'name', 'description', p.description);
  html = setMeta(html, 'property', 'og:type', p.type);
  html = setMeta(html, 'property', 'og:title', p.title);
  html = setMeta(html, 'property', 'og:description', p.description);
  html = setMeta(html, 'property', 'og:url', p.url);
  const image = existsSync(`${DIST}/og/${p.image}.png`) ? p.image : 'site';
  html = setMeta(html, 'property', 'og:image', `${SITE_URL}/og/${image}.png`);
  html = setMeta(html, 'property', 'og:image:alt', p.imageAlt);
  // `<` escaped so text can never close the <script> element
  const ld = JSON.stringify(p.jsonLd).replace(/</g, '\\u003c');
  html = html.replace(
    '<meta charset="utf-8" />',
    `<meta charset="utf-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
  );
  // replacer functions: the texts may contain `$`
  html = html.replace('</head>', () => `  <script type="application/ld+json">${ld}</script>\n  </head>`);
  // Hebrew: lang="he" translate="no" — for the browser's translation, reading mode and «read aloud»
  const body = markHebrewHtml(p.body);
  html = html.replace('<div id="root"></div>', () => `<div id="root"><div class="static">${body}</div></div>`);
  if (p.root !== './') html = html.replace(/(src|href)="\.\/assets\//g, `$1="${p.root}assets/`);
  if (!html.includes(body)) throw new Error('index.html: no <div id="root"></div>');
  return html;
}

const AUTHOR = { '@type': 'Person', name: 'Ицхак Гинзбург', alternateName: 'Rabbi Yitzchak Ginsburgh' };
const PUBLISHER = { '@type': 'Organization', name: 'MyChitas', url: 'https://mychitas.app' };
const SITE = { '@type': 'WebSite', name: 'Нифлаот', url: `${SITE_URL}/` };

/* ───── catalog ───── */

const tags = buildTags(LOCALE);
const home: Page = {
  title: `${ui['app.title']} — ${ui['catalog.uvp']} · MyChitas`,
  description: plain(ui['catalog.intro'] as string),
  url: `${SITE_URL}/`,
  type: 'website',
  root: './',
  image: 'site',
  imageAlt: `${ui['app.title']} — ${ui['catalog.uvp']}`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      { ...SITE, inLanguage: ['ru', 'en', 'de'], description: plain(ui['catalog.intro'] as string), publisher: PUBLISHER },
      {
        '@type': 'ItemList',
        name: ui['catalog.heading'],
        itemListElement: LESSONS.map((l, i) => ({ '@type': 'ListItem', position: i + 1, url: lessonUrl(l), name: text(l).title })),
      },
    ],
  },
  body: `<header><p class="he">נפלאות</p><h1>${esc(ui['app.title'] as string)} — ${esc(ui['catalog.uvp'] as string)}</h1><p>${esc(plain(ui['catalog.intro'] as string))}</p></header>
<h2>${esc(ui['catalog.heading'] as string)}</h2>
${LESSON_GROUPS.map(
  (g) => `<h3>${esc(g.name.ru)} · <span class="he">${g.he}</span></h3><ul>${g.lessons
    .map((l) => `<li><a href="./${l.slug}/"><span class="he">${esc(displayNames(l.hebrewTitle))}</span> — ${esc(text(l).title)}</a>: ${esc(plain(text(l).summary))}</li>`)
    .join('')}</ul>`,
).join('\n')}
<h2>${esc(ui['catalog.tags'] as string)}</h2>
<p>${tags.map((t) => (t.he ? `<span class="he">${esc(displayNames(t.label))}</span>` : esc(t.label))).join(' · ')}</p>`,
};

/* ───── lessons ───── */

function lessonPage(l: Lesson): Page {
  const tx = text(l);
  const keywords = tags.filter((t) => !t.he && t.lessons.includes(l)).map((t) => t.label);
  return {
    title: `${tx.title} — ${lessonLabel(l)} · ${ui['app.title']}`,
    description: plain(tx.summary),
    url: lessonUrl(l),
    type: 'article',
    root: '../',
    image: l.slug,
    imageAlt: `${displayNames(l.hebrewTitle)} — ${tx.title}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: tx.title,
      alternateName: displayNames(l.hebrewTitle),
      description: plain(tx.summary),
      url: lessonUrl(l),
      inLanguage: 'ru',
      image: `${SITE_URL}/og/${l.slug}.png`,
      learningResourceType: 'game',
      interactivityType: 'active',
      typicalAgeRange: `${l.age}-`,
      audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: plain(tx.audience) },
      author: l.author ? { '@type': 'Person', ...l.author } : AUTHOR,
      publisher: PUBLISHER,
      isPartOf: SITE,
      keywords: ['гиматрия', 'Тора', ...keywords].join(', '),
    },
    // one <article>: the whole retelling, so a browser's reading mode and «read aloud» get the lesson itself
    body: `<article><header><p><a href="../">${esc(ui['app.title'] as string)}</a> · ${esc(lessonLabel(l))}</p>
<p class="he">${esc(displayNames(l.hebrewTitle))}</p><h1>${esc(plain(tx.hero.heading))}</h1><p class="author">${esc(plain(tx.hero.author))}</p><p>${esc(String(ui['age.title']))}: ${esc(String(ui['age.long']).replace('{n}', String(l.age)))}. ${esc(plain(tx.audience))}</p><p>${esc(plain(tx.hero.intro))}</p></header>
${tx.riddles
  .map(
    (r) => `<section><h2>${esc(plain(r.title))}</h2><p>${esc(plain(r.cond))}</p>${r.lessons
      .map((s) => `<h3>${esc(plain(s.h))}</h3>${displayNames(stripFootnotes(s.b))}`)
      .join('')}${r.takeaways?.length ? `<ul>${r.takeaways.map((k) => `<li>${esc(plain(k))}</li>`).join('')}</ul>` : ''}</section>`,
  )
  .join('\n')}
<p>${esc(plain(tx.practice))}</p></article>`,
  };
}

/* ───── write ───── */

writeFileSync(`${DIST}/index.html`, render(home));
for (const l of LESSONS) {
  mkdirSync(`${DIST}/${l.slug}`, { recursive: true });
  writeFileSync(`${DIST}/${l.slug}/index.html`, render(lessonPage(l)));
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  `${DIST}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[`${SITE_URL}/`, ...LESSONS.map(lessonUrl)].map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`,
);
writeFileSync(`${DIST}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`prerender: index + ${LESSONS.length} lesson pages, sitemap.xml, robots.txt`);
