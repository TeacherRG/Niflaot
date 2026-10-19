/**
 * After `vite build`: pages and files for search engines and a stricter browser policy.
 *  - dist/<slug>/index.html for every lesson: its own title, description, canonical URL, Open Graph,
 *    JSON-LD and the lesson outline as static HTML (the app replaces it on start and opens the lesson);
 *  - static outline of the catalog in dist/index.html, with real links to the lesson pages;
 *  - «Устный счёт», «Гематрия дня», «Знаете ли вы?» and «Буквы за 5 минут» for search engines: dist/mental-math/,
 *    dist/daily/, dist/facts/, dist/letters/, dist/hebrew-words/ (ru) and the same under dist/en/, dist/de/ — with hreflang alternates;
 *    the app opens the trainer / the game / the feed / the letters on them;
 *  - web app manifests (install on the phone): dist/manifest.webmanifest (ru), manifest-en / manifest-de.webmanifest;
 *  - the service worker dist/sw.js (public/sw.js with this build's version and files to keep for offline use) and
 *    dist/quiz/index.json, dist/quiz/<язык>/<id>.json — колоды «Викторины вместе» (src/core/quizDecks.ts);
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
import { SITE_URL, staticPath, type StaticPage } from '../src/core/site';
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
import { BOOKS, track, type Section } from '../src/core/tanakhCycle';
import { readingMinutes, type DayVerse } from '../src/core/tanakh';
import { civilDate } from '../src/core/hebrewDate';
import { HEMSHECH, allPassages, passageDate } from '../src/core/hemshech';
import { buildDecks, deckProblems, QUIZ_LANGS, type DayQuiz } from '../src/core/quizDecks';
import cycleJson from '../src/tanakh/cycle.json';
import wordsJson from '../src/tanakh/words.json';
import wordsRu from '../src/tanakh/words/ru.json';
import wordsEn from '../src/tanakh/words/en.json';
import wordsDe from '../src/tanakh/words/de.json';

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
const lessonLabel = (l: Lesson, u: Record<string, unknown> = ui) =>
  `${l.series === 'rebbe' ? `${u['rebbe.section']} · ` : ''}${String(u['catalog.lesson']).replace('{n}', String(l.number))}`;
/** a lesson's static page: Russian at the root, English and German under /en/, /de/ */
const lessonUrl = (l: Lesson, lang: 'ru' | 'en' | 'de' = 'ru') => `${SITE_URL}/${lang === 'ru' ? '' : `${lang}/`}${l.slug}/`;
const LESSON_LANGS = ['ru', 'en', 'de'] as const;
const KEYWORDS = { ru: ['гематрия', 'Тора'], en: ['gematria', 'Torah'], de: ['Gematria', 'Tora'] };

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
  // the assistant also over WebSocket — «Викторина вместе» (src/core/liveQuiz.ts)
  `connect-src 'self' https://api.github.com https://niflaot.goatcounter.com${assistant ? ` ${assistant} ${assistant.replace(/^http/, 'ws')}` : ''}`,
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
  // ?v=<hash of the picture>: Telegram, WhatsApp… cache previews by URL — a new picture gets a new address
  const v = createHash('sha256').update(readFileSync(`${DIST}/og/${image}.png`)).digest('hex').slice(0, 8);
  html = setMeta(html, 'property', 'og:image', `${SITE_URL}/og/${image}.png?v=${v}`);
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
    `<meta charset="utf-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />${VERIFY}`,
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

/**
 * Ownership of the site for the webmaster tools — GitHub variables GOOGLE_SITE_VERIFICATION (Google Search Console),
 * BING_SITE_VERIFICATION (Bing Webmaster Tools), YANDEX_VERIFICATION (Яндекс Вебмастер): the code from the tool's
 * «HTML tag» option; without a variable — no tag.
 */
const VERIFY = (
  [
    ['google-site-verification', process.env.GOOGLE_SITE_VERIFICATION],
    ['msvalidate.01', process.env.BING_SITE_VERIFICATION],
    ['yandex-verification', process.env.YANDEX_VERIFICATION],
  ] as const
)
  .filter(([, v]) => v && /^[\w-]{6,128}$/.test(v))
  .map(([k, v]) => `\n    <meta name="${k}" content="${v}" />`)
  .join('');

const PUBLISHER = { '@type': 'Organization', name: 'MyChitas', url: 'https://mychitas.app' };
const SITE = { '@type': 'WebSite', name: 'Нифлаот', url: `${SITE_URL}/` };

/* ───── catalog ───── */

const tags = buildTags(LOCALE);
const home: Page = {
  title: `${ui['catalog.seoTitle']} · MyChitas`,
  description: ui['catalog.seo'],
  url: `${SITE_URL}/`,
  type: 'website',
  root: './',
  image: 'site',
  imageAlt: ui['catalog.seoTitle'],
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
<h2>${esc(ui['wing.kids'] as string)}: ${esc(ui['catalog.heading'] as string)}</h2>
${LESSON_GROUPS.map(
  (g) => `<h3>${esc(g.name.ru)} · <span class="he">${g.he}</span></h3><ul>${g.lessons
    .map((l) => `<li><a href="./${l.slug}/"><span class="he">${esc(displayNames(l.hebrewTitle))}</span> — ${esc(text(l).title)}</a>: ${esc(plain(text(l).summary))}</li>`)
    .join('')}</ul>`,
).join('\n')}
<h2>${esc(ui['wing.adults'] as string)}: ${esc(ui['home.adultsTitle'] as string)}</h2>
<p>${esc(ui['wing.adultsSub'] as string)}. <a href="./#/neviim">${esc(ui['tanakh.neviim'] as string)}</a> · <a href="./#/ketuvim">${esc(ui['tanakh.ketuvim'] as string)}</a> · <a href="./hebrew-words/">${esc(ui['words.seoShort'] as string)}</a></p>
<p>${esc(ui['menu.torahRead'] as string)}: ${LESSONS
  .map((l) => `<a href="./#/${l.slug}/read">${esc(text(l).title)}</a>`)
  .join(' · ')}</p>
<h2 lang="en">In English</h2><ul lang="en">${LESSONS.filter((l) => l.texts.en)
  .map((l) => `<li><a href="./en/${l.slug}/">${esc(l.texts.en!.title)}</a></li>`)
  .join('')}</ul>
<h2 lang="de">Auf Deutsch</h2><ul lang="de">${LESSONS.filter((l) => l.texts.de)
  .map((l) => `<li><a href="./de/${l.slug}/">${esc(l.texts.de!.title)}</a></li>`)
  .join('')}</ul>
<h2>${esc(ui['catalog.tags'] as string)}</h2>
<p>${tags.map((t) => (t.he ? `<span class="he">${esc(displayNames(t.label))}</span>` : esc(t.label))).join(' · ')}</p>`,
};

/* ───── lessons ───── */

/** The languages a lesson's text exists in — each gets its own static page. */
const lessonLangs = (l: Lesson) => LESSON_LANGS.filter((lang) => l.texts[lang]);

function lessonPage(l: Lesson, lang: 'ru' | 'en' | 'de' = 'ru'): Page {
  const tx = l.texts[lang]!;
  const ui = { ru, en, de }[lang] as Record<string, unknown>;
  const langTags = lang === 'ru' ? tags : buildTags(lang);
  const keywords = langTags.filter((t) => !t.he && t.lessons.includes(l)).map((t) => t.label);
  const root = lang === 'ru' ? '../' : '../../';
  return {
    title: `${tx.title} — ${lessonLabel(l, ui)} · ${ui['app.title']}`,
    description: plain(tx.summary),
    url: lessonUrl(l, lang),
    type: 'article',
    root,
    lang,
    alternates: lessonLangs(l).map((x) => ({ lang: x, url: lessonUrl(l, x) })),
    image: l.slug,
    imageAlt: `${displayNames(l.hebrewTitle)} — ${tx.title}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: tx.title,
      alternateName: displayNames(l.hebrewTitle),
      description: plain(tx.summary),
      url: lessonUrl(l, lang),
      inLanguage: lang,
      image: `${SITE_URL}/og/${l.slug}.png`,
      learningResourceType: 'game',
      interactivityType: 'active',
      typicalAgeRange: `${l.age}-`,
      audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: plain(tx.audience) },
      author: { '@type': 'Person', ...l.author },
      publisher: PUBLISHER,
      isPartOf: SITE,
      keywords: [...KEYWORDS[lang], ...keywords].join(', '),
    },
    // one <article>: the whole retelling, so a browser's reading mode and «read aloud» get the lesson itself
    body: `<article><header><p><a href="${root}${lang === 'ru' ? '' : `?lang=${lang}`}">${esc(ui['app.title'] as string)}</a> · ${esc(lessonLabel(l, ui))}</p>
<p class="he">${esc(displayNames(l.hebrewTitle))}</p><h1>${esc(plain(tx.hero.heading))}</h1><p class="author">${esc(plain(tx.hero.author))}</p><p>${esc(String(ui['age.title']))}: ${esc(String(ui['age.long']).replace('{n}', String(l.age)))}. ${esc(plain(tx.audience))}</p><p>${esc(plain(tx.hero.intro))}</p></header>
${tx.riddles
  .map(
    (r, ri) => {
      const quotes = sectionQuotes(l.riddles[ri], r);
      return `<section><h2>${esc(plain(r.title))}</h2><p>${esc(plain(r.cond))}</p>${r.lessons
      .map((s, k) => `<h3>${esc(plain(s.h))}</h3>${quotes.lessons[k]
        .map((q) => {
          const v = quoteView(q, lang);
          return `<blockquote><p>${esc(v.title)}</p>${v.segs.map((sg) => `<p class="he">${sg.he}</p><p>${sg.tr}</p>`).join('')}</blockquote>`;
        })
        .join('')}${displayNames(stripFootnotes(s.b))}`)
      .join('')}${r.takeaways?.length ? `<ul>${r.takeaways.map((k) => `<li>${esc(plain(k))}</li>`).join('')}</ul>` : ''}</section>`;
    },
  )
  .join('\n')}
${(tx.cards?.items ?? [])
  .map(
    (c, k) =>
      `<section><h2>${esc(plain(c.title))}</h2><p class="he">${esc(displayNames(l.cards!.items[k].verse))}</p><p>${esc(plain(c.verse))}</p><p>${esc(plain(c.explain))}</p><p>${esc(plain(c.horaah))}</p></section>`,
  )
  .join('\n')}
<p>${esc(plain(tx.practice))}</p></article>`,
  };
}

/* ───── «Устный счёт» and «Гематрия дня» ───── */

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

/** For every book of a section: the first and the last study day of the cycle where it is read, and how many days. */
const CYCLE_DAYS = cycleJson.days as [string, number, number, number, number][];
function bookPlan(section: Section) {
  const t = track(section);
  const k = section === 'neviim' ? 1 : 3;
  const plan = new Map<string, { from: string; to: string; days: number }>();
  for (const d of CYCLE_DAYS) {
    const seen = new Set<string>();
    for (let i = d[k]; i < d[k + 1]; i++) seen.add(t[i].book.slug);
    for (const slug of seen) {
      const p = plan.get(slug);
      if (p) {
        p.to = d[0];
        p.days++;
      } else plan.set(slug, { from: d[0], to: d[0], days: 1 });
    }
  }
  return BOOKS.filter((b) => b.section === section).map((b) => ({ book: b, ...plan.get(b.slug)! }));
}

/**
 * «Пророки» / «Писания» for search: the three-year reading plan — what the daily passage gives, the dates of the cycle
 * and a table of the books (Hebrew name, chapters, first and last day, days); the app opens today's passage.
 */
function tanakhPage(section: Section, lang: 'ru' | 'en' | 'de', ui: Ui): Page {
  const root = lang === 'ru' ? '../' : '../../';
  const url = `${SITE_URL}${staticPath(section, lang)}`;
  const other: Section = section === 'neviim' ? 'ketuvim' : 'neviim';
  const title = s(ui, `tanakh.seo.${section}.title` as keyof Ui);
  const lead = s(ui, `tanakh.seo.${section}.lead` as keyof Ui);
  const date = (iso: string) => civilDate(iso, lang);
  const cycle = s(ui, 'tanakh.cycle')
    .replace('{start}', date(CYCLE_DAYS[0][0]))
    .replace('{end}', date(CYCLE_DAYS[CYCLE_DAYS.length - 1][0]))
    .replace('{days}', String(CYCLE_DAYS.length));
  const rows = bookPlan(section)
    .map(
      (r) =>
        `<tr><td>${esc(r.book.name[lang])}</td><td class="he">${r.book.he}</td><td>${r.book.verses.length}</td><td>${esc(date(r.from))}</td><td>${esc(date(r.to))}</td><td>${r.days}</td></tr>`,
    )
    .join('');
  return {
    title: `${title} · ${s(ui, 'app.title')}`,
    description: lead,
    url,
    type: 'article',
    root,
    lang,
    alternates: alternatesOf(section),
    image: section,
    imageAlt: title,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: `${s(ui, `tanakh.${section}` as keyof Ui)} — ${s(ui, 'tanakh.daySub')}`,
      description: lead,
      url,
      inLanguage: lang,
      learningResourceType: ['reading plan', 'quiz'],
      educationalLevel: 'adult',
      isAccessibleForFree: true,
      publisher: PUBLISHER,
      isPartOf: SITE,
    },
    body: `<article><header><p><a href="${root}">${esc(s(ui, 'app.title'))}</a> · ${esc(s(ui, 'wing.adults'))} · ${esc(s(ui, `tanakh.${section}` as keyof Ui))}</p>
<h1>${esc(title)}</h1><p>${esc(lead)}</p><p>${esc(s(ui, 'tanakh.seo.what'))}</p><p>${esc(cycle)}</p>
<p><a href="${root}#/${section}">${esc(s(ui, 'tanakh.seo.open'))} →</a> · <a href="${root}#/${section}/quiz">${esc(s(ui, 'quiz.title'))} →</a> · <a href="${root}${staticPath(other, lang).slice(1)}">${esc(s(ui, `tanakh.${other}` as keyof Ui))} →</a> · <a href="${root}${staticPath('hebrew-words', lang).slice(1)}">${esc(s(ui, 'words.seoShort'))} →</a></p></header>
<section><h2>${esc(s(ui, 'tanakh.seo.books'))}</h2><table><thead><tr><th>${esc(s(ui, 'tanakh.seo.colBook'))}</th><th></th><th>${esc(s(ui, 'tanakh.seo.colChapters'))}</th><th>${esc(s(ui, 'tanakh.seo.colFrom'))}</th><th>${esc(s(ui, 'tanakh.seo.colTo'))}</th><th>${esc(s(ui, 'tanakh.seo.colDays'))}</th></tr></thead><tbody>${rows}</tbody></table></section>
</article>`,
  };
}

/**
 * «500 слов Танаха» for search: the most frequent words of the Prophets and Writings (src/core/words.ts) — how much of
 * the text 100 / 300 / 500 words cover, and every translated word by levels of 50: form, translation, root, how often.
 * The app opens «Мои слова» (the review). The source (Open Scriptures Hebrew Bible, CC BY 4.0) is credited.
 */
const WORDS = wordsJson as { words: { id: string; he: string; n: number; root?: string; cov: number }[] };
const WORD_TR = { ru: wordsRu, en: wordsEn, de: wordsDe } as Record<'ru' | 'en' | 'de', Record<string, string>>;
function wordsPage(lang: 'ru' | 'en' | 'de', ui: Ui): Page {
  const root = lang === 'ru' ? '../' : '../../';
  const url = `${SITE_URL}${staticPath('hebrew-words', lang)}`;
  const tr = WORD_TR[lang];
  const learn = WORDS.words.filter((w) => tr[w.id]);
  const fill = (key: string, vars: Record<string, string | number>) => s(ui, key as keyof Ui).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
  const pctAt = (n: number) => Math.round(WORDS.words[n - 1].cov);
  const cov = [100, 300, 500, 1000].map((n) => `<li>${esc(fill('words.seoCov', { n, p: pctAt(n) }))}</li>`).join('');
  const levels: string[] = [];
  for (let i = 0; i < learn.length; i += 50) {
    const ws = learn.slice(i, i + 50);
    const rows = ws
      .map(
        (w, k) =>
          `<tr><td>${i + k + 1}</td><td class="he">${w.he}</td><td>${esc(tr[w.id])}</td><td class="he">${w.root ?? ''}</td><td>${w.n}</td></tr>`,
      )
      .join('');
    levels.push(
      `<section><h2>${esc(fill('words.level', { a: i + 1, b: i + ws.length }))} · ${esc(fill('words.seoUpTo', { p: Math.round(ws[ws.length - 1].cov) }))}</h2><table><thead><tr><th>№</th><th>${esc(s(ui, 'words.seoColWord'))}</th><th>${esc(s(ui, 'words.seoColTr'))}</th><th>${esc(s(ui, 'words.seoColRoot'))}</th><th>${esc(s(ui, 'words.seoColCount'))}</th></tr></thead><tbody>${rows}</tbody></table></section>`,
    );
  }
  const title = s(ui, 'words.seoTitle');
  const lead = s(ui, 'words.seoLead');
  return {
    title: `${title} · ${s(ui, 'app.title')}`,
    description: lead,
    url,
    type: 'article',
    root,
    lang,
    alternates: alternatesOf('hebrew-words'),
    image: 'hebrew-words',
    imageAlt: title,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: title,
      description: lead,
      url,
      inLanguage: lang,
      learningResourceType: ['vocabulary list', 'flashcards'],
      educationalLevel: 'adult',
      isAccessibleForFree: true,
      teaches: s(ui, 'words.menuLbl'),
      publisher: PUBLISHER,
      isPartOf: SITE,
    },
    body: `<article><header><p><a href="${root}">${esc(s(ui, 'app.title'))}</a> · ${esc(s(ui, 'wing.adults'))} · ${esc(s(ui, 'words.menuLbl'))}</p>
<h1>${esc(title)}</h1><p>${esc(lead)}</p><ul>${cov}</ul><p>${esc(s(ui, 'words.seoHow'))}</p>
<p><a href="${root}#/words">${esc(s(ui, 'words.seoStart'))} →</a> · <a href="${root}${staticPath('neviim', lang).slice(1)}">${esc(s(ui, 'tanakh.neviim'))} →</a> · <a href="${root}${staticPath('ketuvim', lang).slice(1)}">${esc(s(ui, 'tanakh.ketuvim'))} →</a></p></header>
${levels.join('\n')}
<p><small>${esc(s(ui, 'words.src'))}</small></p>
</article>`,
  };
}

/** the day of the build: what is already open (passages of «Хасидут», weeks of the quiz) */
const today = new Date().toISOString().slice(0, 10);
// «Викторина вместе»: the decks — the quiz server takes a deck from here, never from the host
const quizDir = 'src/tanakh/quiz';
const tanakhQuiz = Object.fromEntries(
  readdirSync(quizDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => [f.slice(0, -5), JSON.parse(readFileSync(`${quizDir}/${f}`, 'utf8')) as DayQuiz]),
);
const quiz = buildDecks(tanakhQuiz, { ru, en, de });
const badDecks = deckProblems(quiz.decks);
if (badDecks.length) throw new Error(`quiz decks the server would refuse: ${badDecks.join(', ')}`);
/**
 * «Хасидут» for search: what «Ґемшех Самех-Вав» is and how it is learnt (a passage a study day, up to 10 minutes), and the
 * passages already open — title and the project's «Коротко»; the text itself only in the app, with the Neirot credit.
 */
function hemshechPage(lang: 'ru' | 'en' | 'de', ui: Ui): Page {
  const root = lang === 'ru' ? '../' : '../../';
  const url = `${SITE_URL}${staticPath('hemshech', lang)}`;
  const title = s(ui, 'hs.seoTitle');
  const lead = plain(s(ui, 'hs.lead'));
  const open = allPassages().filter((_, k) => passageDate(k) <= today);
  const list = HEMSHECH.maamarim
    .map((m) => ({ m, ps: open.filter((x) => x.m === m).map((x) => x.p) }))
    .filter((x) => x.ps.length)
    .map(
      ({ m, ps }) =>
        `<section><h2>${esc(m.title[lang])}</h2><ol>${ps
          .map((p) => `<li><a href="${root}#/hemshech/${p.id}">${esc(p.title[lang])}</a> — ${esc(plain(p.summary[lang]))}</li>`)
          .join('')}</ol></section>`,
    )
    .join('\n');
  return {
    title: `${title} · ${s(ui, 'app.title')}`,
    description: lead,
    url,
    type: 'article',
    root,
    lang,
    alternates: alternatesOf('hemshech'),
    image: 'hemshech',
    imageAlt: title,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: title,
      description: lead,
      url,
      inLanguage: lang,
      learningResourceType: ['reading plan', 'quiz'],
      educationalLevel: 'adult',
      isAccessibleForFree: true,
      author: { '@type': 'Person', name: 'Rabbi Sholom DovBer Schneersohn' },
      publisher: PUBLISHER,
      isPartOf: SITE,
    },
    body: `<article><header><p><a href="${root}">${esc(s(ui, 'app.title'))}</a> · ${esc(s(ui, 'wing.adults'))} · ${esc(s(ui, 'hs.menuLbl'))}</p>
<h1>${esc(title)}</h1><p>${esc(lead)}</p>
<p><a href="${root}#/hemshech">${esc(s(ui, 'hs.today'))} →</a></p></header>
${list}
<p><small>${esc(HEMSHECH.credit[lang])} · <a href="${HEMSHECH.creditUrl}">neirot.com</a>. ${esc(s(ui, 'hs.rights'))} Neirot.com</small></p>
</article>`,
  };
}

/** «Викторина вместе» for search: what it is, how a game goes, and the question sets the site has now. */
function quizPage(lang: 'ru' | 'en' | 'de', ui: Ui): Page {
  const root = lang === 'ru' ? '../' : '../../';
  const url = `${SITE_URL}${staticPath('quiz', lang)}`;
  const title = s(ui, 'lq.seoTitle');
  const lead = s(ui, 'lq.lead');
  const kinds = ['torah', 'tanakh', 'hs'] as const;
  const sets = kinds
    .map((k) => ({ k, ds: quiz.index.filter((d) => d.kind === k && (!d.from || d.from <= today)) }))
    .filter((g) => g.ds.length)
    .map((g) => `<h3>${esc(s(ui, `lq.group.${g.k}` as keyof Ui))}</h3><ul>${g.ds.map((d) => `<li>${esc(d.title[lang])} — ${esc(s(ui, 'lq.seoCount').replace('{n}', String(d.n)))}</li>`).join('')}</ul>`)
    .join('');
  return {
    title: `${title} · ${s(ui, 'app.title')}`,
    description: lead,
    url,
    type: 'article',
    root,
    lang,
    alternates: alternatesOf('quiz'),
    image: 'quiz',
    imageAlt: title,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: title,
      description: lead,
      url,
      inLanguage: lang,
      learningResourceType: ['quiz', 'game'],
      interactivityType: 'active',
      isAccessibleForFree: true,
      publisher: PUBLISHER,
      isPartOf: SITE,
    },
    body: `<article><header><p><a href="${root}">${esc(s(ui, 'app.title'))}</a> · ${esc(s(ui, 'lq.title'))}</p>
<h1>${esc(title)}</h1><p>${esc(lead)}</p></header>
<section><h2>${esc(s(ui, 'lq.howH'))}</h2><ol>${[1, 2, 3].map((k) => `<li><b>${esc(s(ui, `lq.how${k}` as keyof Ui))}</b> — ${esc(s(ui, `lq.how${k}s` as keyof Ui))}</li>`).join('')}</ol>
<p><a href="${root}#/quiz">${esc(s(ui, 'lq.hostGo'))} →</a></p></section>
<section><h2>${esc(s(ui, 'lq.step1'))}</h2>${sets}</section>
</article>`,
  };
}

const STATIC_OUT: [string, Page][] = LANGS.flatMap(({ lang, ui }) => [
  [staticPath('mental-math', lang), mathPage(lang, ui)] as [string, Page],
  [staticPath('daily', lang), dailyPage(lang, ui)] as [string, Page],
  [staticPath('facts', lang), factsPage(lang, ui)] as [string, Page],
  [staticPath('letters', lang), lettersPage(lang, ui)] as [string, Page],
  [staticPath('neviim', lang), tanakhPage('neviim', lang, ui)] as [string, Page],
  [staticPath('ketuvim', lang), tanakhPage('ketuvim', lang, ui)] as [string, Page],
  [staticPath('hebrew-words', lang), wordsPage(lang, ui)] as [string, Page],
  [staticPath('hemshech', lang), hemshechPage(lang, ui)] as [string, Page],
  [staticPath('quiz', lang), quizPage(lang, ui)] as [string, Page],
]);

/* ───── write ───── */

writeFileSync(`${DIST}/index.html`, render(home));
// every lesson in every language it has: /<slug>/, /en/<slug>/, /de/<slug>/ (hreflang between them)
const LESSON_OUT = LESSONS.flatMap((l) => lessonLangs(l).map((lang) => ({ l, lang, page: lessonPage(l, lang) })));
for (const { l, lang, page } of LESSON_OUT) {
  const dir = `${DIST}/${lang === 'ru' ? '' : `${lang}/`}${l.slug}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, render(page));
}

for (const [path, page] of STATIC_OUT) {
  mkdirSync(`${DIST}${path}`, { recursive: true });
  writeFileSync(`${DIST}${path}index.html`, render(page));
}

writeFileSync(
  `${DIST}/sitemap.xml`,
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[`${SITE_URL}/`, ...LESSON_OUT.map((x) => x.page.url), ...STATIC_OUT.map(([, p]) => p.url)].map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
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
    // the lesson's static page in the feed's language (its own title and text for previews and search)
    const link = `${lessonUrl(l, f.locale)}?ref=rss`;
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
// the adults' message: the reading time as on the home page (Hebrew, the translation of the day, Metzudat David)
const readMinutes = (date: string, loc: 'ru' | 'en' | 'de') => {
  const file = `public/tanakh/${date}.json`;
  if (!existsSync(file)) return undefined;
  const c = JSON.parse(readFileSync(file, 'utf8')) as Record<Section, { verses: DayVerse[] }>;
  const tr = loc !== 'en' && c.neviim.verses.every((v) => v[loc]) ? loc : 'en';
  return readingMinutes([...c.neviim.verses, ...c.ketuvim.verses], true, tr, { md: true, rashi: false });
};
const days = schedule(yesterday, 62, SITE_URL, readMinutes);
writeFileSync(
  `${DIST}/daily-message.json`,
  JSON.stringify({ updated: today, fallback: Object.fromEntries(MSG_LOCALES.map((l) => [l, LANGS.find((x) => x.lang === l)!.ui['push.fallback']])), days }),
);

for (const lang of QUIZ_LANGS) {
  mkdirSync(`${DIST}/quiz/${lang}`, { recursive: true });
  for (const d of quiz.decks[lang]) writeFileSync(`${DIST}/quiz/${lang}/${d.id}.json`, JSON.stringify(d));
}
writeFileSync(`${DIST}/quiz/index.json`, JSON.stringify(quiz.index));

/* ───── for AI assistants: /llms.txt (a map of the site) and /llms-full.txt (the lessons as plain text) ───── */

/** the text of a static page's article, paragraph by paragraph */
const pageText = (html: string) =>
  displayNames(
    html
      .replace(/<(h[1-3])[^>]*>/g, (_, h: string) => `\n\n${'#'.repeat(Number(h[1]) + 1)} `)
      .replace(/<\/(p|h[1-3]|li|blockquote|tr|section|header)>/g, '\n')
      .replace(/<li[^>]*>/g, '- ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
const LANG_NAME = { ru: 'Русский', en: 'English', de: 'Deutsch' } as const;
const link = (p: Page) => `- [${p.title.replace(/ · (Нифлаот|Niflaot|MyChitas).*$/, '')}](${p.url}): ${p.description}`;
const staticOf = (lang: string) => STATIC_OUT.filter(([, p]) => (p.lang ?? 'ru') === lang).map(([, p]) => p);
writeFileSync(
  `${DIST}/llms.txt`,
  `# Niflaot (נפלאות) — ${en['catalog.seoTitle'].replace(/^Niflaot — /, '')}

> ${en['catalog.seo']}

Niflaot is a free project of the MyChitas Torah project (${SITE_URL}), with partners Chabad Haus Wien and JRCV Vienna. The site works in Russian (the main language), English and German; no sign-up is needed, and it rests on Shabbat. Lessons on the weekly Torah portion: the Baal HaTurim (gematria and letters, with a Memo game) and the Lubavitcher Rebbe (Likkutei Sichot — an investigation and cards). Daily study for teens and adults: a passage of the Prophets and of the Writings (a three-year cycle, Hebrew with translation, Metzudat David and Rashi), Chassidut — the Rebbe Rashab’s Hemshech Samech-Vav, the most frequent Hebrew words of Tanakh, certificates of the Academy, and a live quiz for a class or a family.

Notes for assistants: out of respect, the site writes the Names of G-d as אלקים, ה׳, G-d, L-rd (Russian Б-г, German G-tt); please do the same when quoting. Texts and licences: Hebrew Tanakh, Rashi and Metzudat David — public domain; the English verse translation — JPS 1985 (CC BY-NC); the project’s own translations — CC BY-NC; Hemshech Samech-Vav in English — © The Neirot Foundation (neirot.com), used with permission: link to the site rather than reproducing it. Every page links to its primary sources on Sefaria. Reading the site to answer questions and to cite it is welcome; using its texts to train AI models is not permitted (robots.txt).

${LESSON_LANGS.map(
  (lang) => `## ${LANG_NAME[lang]}

${[...LESSON_OUT.filter((x) => x.lang === lang).map((x) => link(x.page)), ...staticOf(lang).map(link)].join('\n')}`,
).join('\n\n')}

## Optional

- [Full text of the lessons](${SITE_URL}/llms-full.txt): every lesson as plain text, in Russian, English and German
- [Sitemap](${SITE_URL}/sitemap.xml)
- [News feed (English)](${SITE_URL}/feed-en.xml), [Russian](${SITE_URL}/feed.xml), [German](${SITE_URL}/feed-de.xml)
`,
);
writeFileSync(
  `${DIST}/llms-full.txt`,
  `# Niflaot (נפלאות) — the lessons in full

> The retellings of all lessons of ${SITE_URL}, as on their static pages: the commentator’s words (Hebrew and translation), the explanation, the summary and the lesson for life. Names of G-d are written as on the site.

${LESSON_OUT.map((x) => `# ${x.page.title}\n\nURL: ${x.page.url}\nLanguage: ${LANG_NAME[x.lang]}\n\n${pageText(x.page.body)}`).join('\n\n---\n\n')}
`,
);

/**
 * robots.txt: search engines and AI assistants are welcome (Googlebot, Bingbot, Yandex, OAI-SearchBot, ChatGPT-User,
 * Claude-SearchBot, Claude-User, PerplexityBot…) — collecting the texts to train AI models is not: the owner's decision
 * (the permission of Neirot covers publishing on the site, not training). Only crawlers that exist for training are
 * named; `Content-Signal` (contentsignals.org) says the same to everyone else.
 */
const AI_TRAINING_BOTS = [
  'GPTBot', // OpenAI — training (search: OAI-SearchBot, a user's request: ChatGPT-User — allowed)
  'ClaudeBot', // Anthropic — training (Claude-SearchBot, Claude-User — allowed)
  'anthropic-ai',
  'Google-Extended', // Gemini training; Googlebot (search) is not affected
  'Applebot-Extended', // Apple Intelligence training; Applebot (search) is not affected
  'CCBot', // Common Crawl — the open corpus models are trained on
  'Meta-ExternalAgent', // Meta — training (meta-externalfetcher, a user's request — allowed)
  'FacebookBot',
  'Bytespider', // ByteDance
  'cohere-training-data-crawler',
  'cohere-ai',
  'AI2Bot', // Allen Institute
  'Diffbot',
  'Omgilibot', // Webz.io — sells data for training
  'PanguBot', // Huawei
  'Timpibot',
];
writeFileSync(
  `${DIST}/robots.txt`,
  `# Search engines and AI assistants are welcome: they help people find and quote the lessons.
# Collecting the texts to train AI models is not permitted.
User-agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=no
Allow: /

${AI_TRAINING_BOTS.map((b) => `User-agent: ${b}`).join('\n')}
Disallow: /

# A map of the site for AI assistants: ${SITE_URL}/llms.txt
Sitemap: ${SITE_URL}/sitemap.xml
`,
);
console.log(`prerender: index + ${LESSON_OUT.length} lesson pages (ru/en/de) + ${STATIC_OUT.length} math / daily / facts / letters / prophets / writings / words pages, sitemap.xml, robots.txt, llms.txt, ${FEEDS.length} feeds, ${LANGS.length} manifests, sw.js (${precache.length} files offline), daily messages for ${Object.keys(days).length} days, ${quiz.index.length} quiz decks`);
