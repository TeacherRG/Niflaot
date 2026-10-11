/**
 * After `vite build`: pages and files for search engines and a stricter browser policy.
 *  - dist/<slug>/index.html for every lesson: its own title, description, canonical URL, Open Graph,
 *    JSON-LD and the lesson outline as static HTML (the app replaces it on start and opens the lesson);
 *  - static outline of the catalog in dist/index.html, with real links to the lesson pages;
 *  - «Устный счёт», «Гиматрия дня», «Знаете ли вы?» and «Буквы за 5 минут» for search engines: dist/mental-math/,
 *    dist/daily/, dist/facts/, dist/letters/ (ru) and the same under dist/en/, dist/de/ — with hreflang alternates;
 *    the app opens the trainer / the game / the feed / the letters on them;
 *  - web app manifests (install on the phone): dist/manifest.webmanifest (ru), manifest-en / manifest-de.webmanifest;
 *  - the service worker dist/sw.js (public/sw.js with this build's version and files to keep for offline use) and
 *    dist/daily-message.json — the daily reminder's message for the coming days (src/core/dailyMessage.ts);
 *  - dist/sitemap.xml and dist/robots.txt;
 *  - Atom feeds of the lessons: dist/feed.xml (ru), dist/feed-en.xml, dist/feed-de.xml — for readers, a newsletter
 *    and auto-posting services (links marked ?ref=rss);
 *  - Open Graph picture: dist/og/<slug>.png if it exists (scripts/og-images.ts), else dist/og/site.png;
 *  - Content-Security-Policy <meta> on every page (GitHub Pages can't send headers).
 * Run by `npm run build`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { LESSONS, LESSON_GROUPS, type Lesson } from '../src/lessons';
import { SITE_URL, lessonLink, staticPath, type StaticPage } from '../src/core/site';
import { EXAMPLES, OPS, SIGN, answer, solve } from '../src/core/mentalMath';
import { KEYBOARD, VALUES } from '../src/core/gematria';
import { ALEPH_BET, FINAL_FORMS, LOOKALIKES, letterName, letterSound } from '../src/core/letterNames';
import { NUMS, collectFacts } from '../src/core/facts';
import { MSG_LOCALES, schedule } from '../src/core/dailyMessage';
import { displayNames } from '../src/core/names';
import { buildTags } from '../src/core/tags';
import ru from '../src/i18n/locales/ru';
import en from '../src/i18n/locales/en';
import de from '../src/i18n/locales/de';
import { PARSHIOT } from '../src/lessons/parshiot';
import { markHebrewHtml } from '../src/core/langMarkup';
import { stripFootnotes } from '../src/sources/footnotes';
import { quoteView, sectionQuotes } from '../src/core/quotes';

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
/** the newsletter's sign-up form posts there (src/components/Subscribe.tsx) */
const subscribe = process.env.VITE_SUBSCRIBE_URL ? new URL(process.env.VITE_SUBSCRIBE_URL).origin : '';
const CSP = [
  "default-src 'self'",
  "script-src 'self' https://gc.zgo.at",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https://niflaot.goatcounter.com",
  // «Урок дня»: the recordings come from the assistant's server; blob: — the admin listens before uploading
  `media-src 'self' blob:${assistant ? ` ${assistant}` : ''}`,
  `connect-src 'self' https://api.github.com https://niflaot.goatcounter.com${assistant ? ` ${assistant}` : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  `form-action 'self'${subscribe ? ` ${subscribe}` : ''}`,
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
  /** page language (default ru) and the same page in other languages */
  lang?: 'ru' | 'en' | 'de';
  alternates?: { lang: string; url: string }[];
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
  if (p.lang && p.lang !== 'ru') {
    html = html.replace('<html lang="ru">', `<html lang="${p.lang}">`);
    html = html.replace('href="/manifest.webmanifest"', `href="/manifest-${p.lang}.webmanifest"`);
    html = setMeta(html, 'property', 'og:locale', p.lang === 'en' ? 'en_US' : 'de_DE');
  }
  if (p.alternates)
    html = html.replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      (m) =>
        `${m}\n${[...p.alternates!, { lang: 'x-default', url: p.alternates![0].url }]
          .map((a) => `    <link rel="alternate" hreflang="${a.lang}" href="${a.url}" />`)
          .join('\n')}`,
    );
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
  description: ui['catalog.seo'],
  url: `${SITE_URL}/`,
  type: 'website',
  root: './',
  image: 'site',
  imageAlt: `${ui['app.title']} — ${ui['catalog.uvp']}`,
  jsonLd: {
    '@context': 'https://schema.org',
    '@graph': [
      { ...SITE, inLanguage: ['ru', 'en', 'de'], description: ui['catalog.seo'], publisher: PUBLISHER },
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
    (r, ri) => {
      const quotes = sectionQuotes(l.riddles[ri], r);
      return `<section><h2>${esc(plain(r.title))}</h2><p>${esc(plain(r.cond))}</p>${r.lessons
      .map((s, k) => `<h3>${esc(plain(s.h))}</h3>${quotes.lessons[k]
        .map((q) => {
          const v = quoteView(q, 'ru');
          return `<blockquote><p>${esc(v.title)}</p>${v.segs.map((sg) => `<p class="he">${sg.he}</p><p>${sg.tr}</p>`).join('')}</blockquote>`;
        })
        .join('')}${displayNames(stripFootnotes(s.b))}`)
      .join('')}${r.takeaways?.length ? `<ul>${r.takeaways.map((k) => `<li>${esc(plain(k))}</li>`).join('')}</ul>` : ''}</section>`;
    },
  )
  .join('\n')}
<p>${esc(plain(tx.practice))}</p></article>`,
  };
}

/* ───── «Устный счёт» and «Гиматрия дня» ───── */

const LANGS = [
  { lang: 'ru', ui: ru },
  { lang: 'en', ui: en },
  { lang: 'de', ui: de },
] as const;
type Ui = (typeof LANGS)[number]['ui'];
const s = (ui: Ui, k: keyof Ui) => String(ui[k]);
/** Hebrew in a plain text as <span class="he"> */
const heRuns = (t: string) => esc(t).replace(/[א-ת][א-ת״׳"' ]*[א-ת״׳]|[א-ת]/g, (m) => `<span class="he">${m}</span>`);
const alternatesOf = (page: StaticPage) => LANGS.map((l) => ({ lang: l.lang, url: `${SITE_URL}${staticPath(page, l.lang)}` }));

function mathPage(lang: 'ru' | 'en' | 'de', ui: Ui): Page {
  const root = lang === 'ru' ? '../' : '../../';
  const url = `${SITE_URL}${staticPath('mental-math', lang)}`;
  return {
    title: `${s(ui, 'math.seoTitle')} · ${s(ui, 'app.title')}`,
    description: s(ui, 'math.seoLead'),
    url,
    type: 'article',
    root,
    lang,
    alternates: alternatesOf('mental-math'),
    image: 'mental-math',
    imageAlt: s(ui, 'math.seoTitle'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: s(ui, 'math.seoTitle'),
      description: s(ui, 'math.seoLead'),
      url,
      inLanguage: lang,
      learningResourceType: ['exercise', 'game'],
      interactivityType: 'active',
      isAccessibleForFree: true,
      typicalAgeRange: '7-',
      teaches: OPS.map((o) => s(ui, `math.name.${o}` as keyof Ui)),
      publisher: PUBLISHER,
      isPartOf: SITE,
    },
    body: `<article><header><p><a href="${root}">${esc(s(ui, 'app.title'))}</a> · ${esc(s(ui, 'math.title'))}</p>
<h1>${esc(s(ui, 'math.seoTitle'))}</h1><p>${esc(s(ui, 'math.seoLead'))}</p>
<p><a href="${root}#/math/add">${esc(s(ui, 'math.seoTrain'))} →</a> · <a href="${root}${staticPath('daily', lang).slice(1)}">${esc(s(ui, 'math.daily'))} →</a></p></header>
${OPS.map(
  (o) => `<section><h2>${esc(s(ui, `math.op.${o}` as keyof Ui))}: ${esc(s(ui, `math.name.${o}` as keyof Ui))}</h2>${s(ui, `math.idea.${o}` as keyof Ui)}
<h3>${esc(s(ui, 'math.examples'))}</h3><ul>${EXAMPLES[o]
    .map((e) => `<li><p>${heRuns(e.label)}: ${e.a} ${SIGN[o]} ${e.b} = ${answer(e)}</p><ol>${solve(e).map((x) => `<li>${esc(x.text)}</li>`).join('')}</ol></li>`)
    .join('')}</ul></section>`,
).join('\n')}
</article>`,
  };
}

function dailyPage(lang: 'ru' | 'en' | 'de', ui: Ui): Page {
  const root = lang === 'ru' ? '../' : '../../';
  const url = `${SITE_URL}${staticPath('daily', lang)}`;
  const letters = KEYBOARD.filter((c) => !'ךםןףץ'.includes(c));
  return {
    title: `${s(ui, 'daily.seoTitle')} · ${s(ui, 'app.title')}`,
    description: s(ui, 'daily.seoLead'),
    url,
    type: 'article',
    root,
    lang,
    alternates: alternatesOf('daily'),
    image: 'daily',
    imageAlt: s(ui, 'daily.seoTitle'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: s(ui, 'daily.title'),
      description: s(ui, 'daily.seoLead'),
      url,
      inLanguage: lang,
      learningResourceType: 'game',
      interactivityType: 'active',
      isAccessibleForFree: true,
      typicalAgeRange: '7-',
      publisher: PUBLISHER,
      isPartOf: SITE,
    },
    body: `<article><header><p><a href="${root}">${esc(s(ui, 'app.title'))}</a> · ${esc(s(ui, 'daily.title'))}</p>
<h1>${esc(s(ui, 'daily.seoTitle'))}</h1><p>${esc(s(ui, 'daily.seoLead'))}</p>
<p><a href="${root}#/daily">${esc(s(ui, 'daily.play'))} →</a> · <a href="${root}${staticPath('mental-math', lang).slice(1)}">${esc(s(ui, 'math.title'))} →</a></p></header>
<section><h2>${esc(s(ui, 'daily.title'))}</h2>${s(ui, 'daily.rules')}</section>
<section><h2>${esc(s(ui, 'daily.values'))}</h2><table><tbody>${letters
      .map((c) => `<tr><td class="he">${c}</td><td>${VALUES[c]}</td></tr>`)
      .join('')}</tbody></table></section>
</article>`,
  };
}


/** «Знаете ли вы?»: every riddle of the feed — the question, the answer folded, a link to its place in the lesson. */
function factsPage(lang: 'ru' | 'en' | 'de', ui: Ui): Page {
  const root = lang === 'ru' ? '../' : '../../';
  const url = `${SITE_URL}${staticPath('facts', lang)}`;
  const facts = collectFacts(LESSONS);
  const he = (w: string) => `<span class="he">${esc(displayNames(w))}</span>`;
  const item = (f: (typeof facts)[number]) => {
    const tx = f.lesson.texts[lang] ?? f.lesson.texts.ru!;
    const gl = (w: string) => w.split(' + ').map((x) => tx.glossary[x]).filter(Boolean).join(' + ');
    const word = (w: string) => `${he(w)}${gl(w) ? ` (${esc(gl(w))})` : ''}`;
    const q = f.kind === 'eq' ? `${s(ui, 'facts.qEq')} ${word(f.q)}?` : `${s(ui, `facts.qLt.${f.take}` as keyof Ui)} ${word(f.from)}?`;
    const a = f.kind === 'eq' ? f.rest.map((p) => (NUMS.test(p) ? esc(p) : word(p))).join(' = ') : word(f.word);
    const where = f.ri !== undefined ? `<a href="${root}${f.lesson.slug}/">${esc(tx.title)}</a> · ${esc(s(ui, 'facts.where').replace('{n}', String(f.ri + 1)))}` : `<a href="${root}${f.lesson.slug}/">${esc(tx.title)}</a>`;
    return `<li><p>${q}</p><details><summary>${esc(s(ui, 'facts.answer'))}</summary><p>${a}</p></details><p>${where}</p></li>`;
  };
  return {
    title: `${s(ui, 'facts.seoTitle')} · ${s(ui, 'app.title')}`,
    description: s(ui, 'facts.seoLead'),
    url,
    type: 'article',
    root,
    lang,
    alternates: alternatesOf('facts'),
    image: 'facts',
    imageAlt: s(ui, 'facts.seoTitle'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: s(ui, 'facts.title'),
      description: s(ui, 'facts.seoLead'),
      url,
      inLanguage: lang,
      learningResourceType: 'quiz',
      interactivityType: 'active',
      isAccessibleForFree: true,
      typicalAgeRange: '8-',
      publisher: PUBLISHER,
      isPartOf: SITE,
    },
    body: `<article><header><p><a href="${root}">${esc(s(ui, 'app.title'))}</a> · ${esc(s(ui, 'facts.title'))}</p>
<h1>${esc(s(ui, 'facts.seoTitle'))}</h1><p>${esc(s(ui, 'facts.seoLead'))}</p>
<p><a href="${root}#/facts">${esc(s(ui, 'facts.seoPlay'))} →</a> · <a href="${root}${staticPath('daily', lang).slice(1)}">${esc(s(ui, 'daily.title'))} →</a> · <a href="${root}${staticPath('letters', lang).slice(1)}">${esc(s(ui, 'abc.title'))} →</a></p></header>
<section><h2>${esc(s(ui, 'facts.title'))}</h2><ol>${facts.map(item).join('')}</ol></section>
</article>`,
  };
}

/** «Буквы за 5 минут»: the table of the letters — shape, name, sound, number — and the lookalikes. */
function lettersPage(lang: 'ru' | 'en' | 'de', ui: Ui): Page {
  const root = lang === 'ru' ? '../' : '../../';
  const url = `${SITE_URL}${staticPath('letters', lang)}`;
  const row = (c: string) => `<tr><td class="he">${c}</td><td>${esc(letterName(c, lang))}</td><td>${esc(letterSound(c, lang))}</td><td>${VALUES[c]}</td></tr>`;
  const table = (cap: string, cs: string[]) =>
    `<section><h2>${esc(cap)}</h2><table><thead><tr><th>${esc(s(ui, 'abc.colLetter'))}</th><th>${esc(s(ui, 'abc.colName'))}</th><th>${esc(s(ui, 'abc.colSound'))}</th><th>${esc(s(ui, 'abc.colValue'))}</th></tr></thead><tbody>${cs.map(row).join('')}</tbody></table></section>`;
  return {
    title: `${s(ui, 'abc.seoTitle')} · ${s(ui, 'app.title')}`,
    description: s(ui, 'abc.seoLead'),
    url,
    type: 'article',
    root,
    lang,
    alternates: alternatesOf('letters'),
    image: 'letters',
    imageAlt: s(ui, 'abc.seoTitle'),
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: s(ui, 'abc.title'),
      description: s(ui, 'abc.seoLead'),
      url,
      inLanguage: lang,
      learningResourceType: ['reference', 'quiz'],
      interactivityType: 'active',
      isAccessibleForFree: true,
      typicalAgeRange: '6-',
      teaches: s(ui, 'abc.seoTitle'),
      publisher: PUBLISHER,
      isPartOf: SITE,
    },
    body: `<article><header><p><a href="${root}">${esc(s(ui, 'app.title'))}</a> · ${esc(s(ui, 'abc.title'))}</p>
<h1>${esc(s(ui, 'abc.seoTitle'))}</h1><p>${esc(s(ui, 'abc.seoLead'))}</p><p>${esc(s(ui, 'abc.lead'))}</p>
<p><a href="${root}#/letters">${esc(s(ui, 'abc.seoPlay'))} →</a> · <a href="${root}${staticPath('facts', lang).slice(1)}">${esc(s(ui, 'facts.title'))} →</a> · <a href="${root}${staticPath('daily', lang).slice(1)}">${esc(s(ui, 'daily.title'))} →</a></p></header>
${table(s(ui, 'abc.units'), ALEPH_BET.slice(0, 9))}
${table(s(ui, 'abc.tens'), ALEPH_BET.slice(9, 18))}
${table(s(ui, 'abc.hundreds'), ALEPH_BET.slice(18))}
${table(s(ui, 'abc.finals'), FINAL_FORMS)}
<section><h2>${esc(s(ui, 'abc.alike'))}</h2><ul>${LOOKALIKES.map((g) => `<li>${g.map((c) => `<span class="he">${c}</span> ${esc(letterName(c, lang))}`).join(' · ')}</li>`).join('')}</ul></section>
</article>`,
  };
}

const STATIC_OUT: [string, Page][] = LANGS.flatMap(({ lang, ui }) => [
  [staticPath('mental-math', lang), mathPage(lang, ui)] as [string, Page],
  [staticPath('daily', lang), dailyPage(lang, ui)] as [string, Page],
  [staticPath('facts', lang), factsPage(lang, ui)] as [string, Page],
  [staticPath('letters', lang), lettersPage(lang, ui)] as [string, Page],
]);

/* ───── write ───── */

writeFileSync(`${DIST}/index.html`, render(home));
for (const l of LESSONS) {
  mkdirSync(`${DIST}/${l.slug}`, { recursive: true });
  writeFileSync(`${DIST}/${l.slug}/index.html`, render(lessonPage(l)));
}

for (const [path, page] of STATIC_OUT) {
  mkdirSync(`${DIST}${path}`, { recursive: true });
  writeFileSync(`${DIST}${path}index.html`, render(page));
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  `${DIST}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[`${SITE_URL}/`, ...LESSONS.map(lessonUrl), ...STATIC_OUT.map(([, p]) => p.url)].map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`,
);
/* ───── Atom feeds ───── */

const FEEDS = [
  { locale: 'ru', file: 'feed.xml', ui: ru },
  { locale: 'en', file: 'feed-en.xml', ui: en },
  { locale: 'de', file: 'feed-de.xml', ui: de },
] as const;
/** a lesson «comes out» on the Sunday of its portion's week */
const published = (l: Lesson) => {
  const d = new Date(`${PARSHIOT[l.parsha].shabbat}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 6);
  return d.toISOString().replace('.000', '');
};
for (const f of FEEDS) {
  const items = LESSONS.filter((l) => l.texts[f.locale]).reverse();
  const entries = items.map((l) => {
    const tx = l.texts[f.locale]!;
    const link = lessonLink(l.slug, 'rss', f.locale);
    return `  <entry>
    <id>${lessonUrl(l)}#${f.locale}</id>
    <title>${esc(`${displayNames(l.hebrewTitle)} — ${plain(tx.title)}`)}</title>
    <link rel="alternate" href="${esc(link)}" />
    <link rel="enclosure" type="image/png" href="${SITE_URL}/og/${existsSync(`${DIST}/og/${l.slug}.png`) ? l.slug : 'site'}.png" />
    <published>${published(l)}</published>
    <updated>${published(l)}</updated>
    <summary>${esc(plain(tx.summary))}</summary>
  </entry>`;
  });
  writeFileSync(
    `${DIST}/${f.file}`,
    `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${f.locale}">
  <id>${SITE_URL}/${f.file}</id>
  <title>${esc(`${f.ui['app.title']} — ${f.ui['catalog.uvp']}`)}</title>
  <link rel="self" href="${SITE_URL}/${f.file}" />
  <link rel="alternate" href="${SITE_URL}/?lang=${f.locale}&amp;ref=rss" />
  <updated>${items.length ? published(items[0]) : `${today}T00:00:00Z`}</updated>
  <author><name>MyChitas</name><uri>https://mychitas.app</uri></author>
${entries.join('\n')}
</feed>
`,
  );
}


/* ───── web app manifests: «install on the phone» ───── */

for (const { lang, ui } of LANGS) {
  const start = (path: string) => `${path}?lang=${lang}&ref=app`;
  const manifest = {
    id: '/',
    name: `${s(ui, 'app.title')} — ${s(ui, 'catalog.uvp')}`,
    short_name: s(ui, 'app.title'),
    description: s(ui, 'catalog.seo'),
    lang,
    dir: 'ltr',
    start_url: start('/'),
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#141A33',
    theme_color: '#141A33',
    categories: ['education', 'books', 'kids'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: s(ui, 'daily.title'), url: start(staticPath('daily', lang)), icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: s(ui, 'facts.title'), url: start(staticPath('facts', lang)), icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: s(ui, 'abc.title'), url: start(staticPath('letters', lang)), icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
    ],
  };
  writeFileSync(`${DIST}/manifest${lang === 'ru' ? '' : `-${lang}`}.webmanifest`, `${JSON.stringify(manifest, null, 2)}\n`);
}

/* ───── service worker and the daily message ───── */

// offline: the app's code, styles and fonts, the icons and manifests (the Memo pictures are kept when first seen)
const assets = readdirSync(`${DIST}/assets`).filter((f) => /\.(js|css|woff2)$/.test(f)).map((f) => `/assets/${f}`);
const precache = [...assets, '/icons/icon-192.png', '/manifest.webmanifest', '/manifest-en.webmanifest', '/manifest-de.webmanifest'];
const version = createHash('sha256').update(assets.join('\n')).update(readFileSync(`${DIST}/index.html`)).digest('hex').slice(0, 12);
const sw = readFileSync(`${DIST}/sw.js`, 'utf8');
if (!sw.includes("/*__VERSION__*/ 'dev'") || !sw.includes('/*__PRECACHE__*/ []')) throw new Error('public/sw.js: no build placeholders');
writeFileSync(
  `${DIST}/sw.js`,
  sw.replace("/*__VERSION__*/ 'dev'", `'${version}'`).replace('/*__PRECACHE__*/ []', JSON.stringify(precache)),
);
// from yesterday (time zones behind UTC) for two months: the reminder keeps working if the site is not rebuilt for a while
const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
const days = schedule(yesterday, 62, SITE_URL);
writeFileSync(
  `${DIST}/daily-message.json`,
  JSON.stringify({ updated: today, fallback: Object.fromEntries(MSG_LOCALES.map((l) => [l, LANGS.find((x) => x.lang === l)!.ui['push.fallback']])), days }),
);

writeFileSync(`${DIST}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`prerender: index + ${LESSONS.length} lesson pages + ${STATIC_OUT.length} math / daily / facts / letters pages, sitemap.xml, robots.txt, ${FEEDS.length} feeds, ${LANGS.length} manifests, sw.js (${precache.length} files offline), daily messages for ${Object.keys(days).length} days`);
