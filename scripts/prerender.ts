/**
 * After `vite build`: pages and files for search engines and a stricter browser policy.
 *  - dist/<slug>/index.html for every lesson: its own title, description, canonical URL, Open Graph,
 *    JSON-LD and the lesson outline as static HTML (the app replaces it on start and opens the lesson);
 *  - the home page in each language — dist/index.html (ru), dist/en/, dist/de/ (hreflang): the catalog with real links;
 *  - search snippets within limits: the meta description cut at a word to 160 characters, the <title> to 65 (`fitTitle`);
 *    JSON-LD with breadcrumbs, dates (git) and «free»; lesson titles say what people search for («гематрии недельной главы»);
 *  - «Святая музыка» dist/nigun/ (and en/de): the niggunim, their words and the source;
 *  - «Устный счёт», «Гематрия дня», «Знаете ли вы?» and «Буквы за 5 минут» for search engines: dist/mental-math/,
 *    dist/daily/, dist/facts/, dist/letters/, dist/hebrew-words/, dist/learn-hebrew/ (ru) and the same under dist/en/, dist/de/ — with hreflang alternates;
 *    the app opens the trainer / the game / the feed / the letters on them;
 *  - web app manifests (install on the phone): dist/manifest.webmanifest (ru), manifest-en / manifest-de.webmanifest;
 *  - the service worker dist/sw.js (public/sw.js with this build's version and files to keep for offline use) and
 *    dist/quiz/index.json, dist/quiz/<язык>/<id>.json — колоды «Викторины вместе» (src/core/quizDecks.ts);
 *    dist/daily-message.json — the daily reminder's message for the coming days (src/core/dailyMessage.ts);
 *  - dist/sitemap.xml (lastmod — the day the page's sources last changed in git, the pages of the day — today; hreflang
 *    alternates) and dist/robots.txt;
 *  - Atom feeds of the lessons: dist/feed.xml (ru), dist/feed-en.xml, dist/feed-de.xml — for readers, a newsletter
 *    and auto-posting services (links marked ?ref=rss);
 *  - the podcast — RSS with iTunes tags: dist/podcast.xml (ru), podcast-en.xml, podcast-de.xml; the episodes (MP3 in a
 *    GitHub release) are made by scripts/podcast.ts, the list is fetched while building — offline, no podcast feeds;
 *  - Open Graph picture: dist/og/<slug>.png if it exists (scripts/og-images.ts), else dist/og/site.png;
 *  - Content-Security-Policy <meta> on every page (GitHub Pages can't send headers).
 * Run by `npm run build`.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { NIGUNIM } from '../src/nigun';
import { torahWords } from '../src/core/torahWords';
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
import { narration } from '../src/core/narration';
import { PODCAST_FEEDS, PODCAST_RELEASE, episodeTitle, type PodcastEpisodes } from '../src/core/podcast';
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
/**
 * Search snippets: Google and Яндекс show about 155–160 characters of a description and 60–65 of a title, the rest is
 * cut mid-word. The meta description is cut here at a word (the full text stays in JSON-LD and on the page).
 */
const snippet = (t: string, max = 160) => {
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max / 2)).replace(/[\s,;:.—–-]+$/, '')}…`;
};
/**
 * <title> within 65 characters: the brand stays if it fits — a long title first loses its tail after « — », « – » or
 * «: » (the h1 and og:title keep the whole); a title that still doesn't fit loses the brand.
 */
const BRAND = / · (Нифлаот|Niflaot|MyChitas)$/;
function fitTitle(t: string, max = 65) {
  if (t.length <= max) return t;
  const brand = t.match(BRAND)?.[0] ?? '';
  const bare = t.slice(0, t.length - brand.length);
  const heads = [bare, ...[...bare.matchAll(/ [—–] |: /g)].map((m) => bare.slice(0, m.index)).reverse()].filter((h) => h.length >= 25);
  return heads.map((h) => h + brand).find((x) => x.length <= max) ?? heads.find((h) => h.length <= max) ?? bare;
}
/** the day a file or folder last changed (git), for sitemap `lastmod` and JSON-LD `dateModified`; not in git — today */
const gitDates = new Map<string, string>();
function changed(...paths: string[]): string {
  const key = paths.join('\n');
  if (!gitDates.has(key)) {
    let d = '';
    try {
      d = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...paths], { encoding: 'utf8' }).trim();
    } catch {}
    gitDates.set(key, d || new Date().toISOString().slice(0, 10));
  }
  return gitDates.get(key)!;
}
const latest = (...dates: string[]) => dates.sort().pop()!;
const plain = (html: string) => displayNames(html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
const text = (l: Lesson) => l.texts[LOCALE]!;
/** «Урок 2», or «Нифлаот Ребе · Урок 1» for a lesson of the Rebbe's section */
const lessonLabel = (l: Lesson, u: Record<string, unknown> = ui) =>
  `${l.series === 'rebbe' ? `${u['rebbe.section']} · ` : ''}${String(u['catalog.lesson']).replace('{n}', String(l.number))}`;
/** a lesson's static page: Russian at the root, English and German under /en/, /de/ */
const lessonUrl = (l: Lesson, lang: 'ru' | 'en' | 'de' = 'ru') => `${SITE_URL}/${lang === 'ru' ? '' : `${lang}/`}${l.slug}/`;
const LESSON_LANGS = ['ru', 'en', 'de'] as const;
const KEYWORDS = { ru: ['гематрия', 'Тора'], en: ['gematria', 'Torah'], de: ['Gematria', 'Tora'] };
/** a talk of the Rebbe has no gematria */
const SICHA_KEYWORDS = { ru: ['Тора', 'Любавичский Ребе', 'Ликутей сихот'], en: ['Torah', 'the Lubavitcher Rebbe', 'Likkutei Sichot'], de: ['Tora', 'der Lubawitscher Rebbe', 'Likkutej Sichot'] };

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
  // «Слушать»: the recorded parts are fetched from the assistant and played as blob: (src/components/ListenBar.tsx)
  "media-src 'self' blob:",
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
  /** the day the page's content last changed (sitemap) */
  lastmod?: string;
}

function setMeta(html: string, attr: 'name' | 'property', key: string, value: string) {
  const re = new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`);
  if (!re.test(html)) throw new Error(`index.html: no <meta ${attr}="${key}">`);
  return html.replace(re, () => `<meta ${attr}="${key}" content="${esc(value)}" />`);
}

function render(p: Page): string {
  let html = shell
    .replace(/<title>[^<]*<\/title>/, () => `<title>${esc(fitTitle(p.title))}</title>`)
    .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${p.url}" />`);
  html = setMeta(html, 'name', 'description', snippet(p.description));
  html = setMeta(html, 'property', 'og:type', p.type);
  html = setMeta(html, 'property', 'og:title', p.title);
  html = setMeta(html, 'property', 'og:description', snippet(p.description, 200));
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
  if (p.root !== './') html = html.replace(/(src|href)="\.\/assets\//g, `$1="${p.root}assets/`).replace('src="./look.js"', `src="${p.root}look.js"`);
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

const PUBLISHER = { '@type': 'Organization', name: 'MyChitas', url: 'https://mychitas.app', logo: `${SITE_URL}/icons/icon-512.png?v=2` };
const SITE = { '@type': 'WebSite', name: 'Нифлаот', url: `${SITE_URL}/` };

/* ───── catalog ───── */

const tags = buildTags(LOCALE);
/** a lesson's folder: src/lessons/NN-<slug> */
const lessonDir = (l: Lesson) => `src/lessons/${readdirSync('src/lessons').find((d) => d.replace(/^\d+-/, '') === l.slug)}`;
const lessonChanged = (l: Lesson) => changed(lessonDir(l));
/** a lesson «comes out» on the Sunday of its portion's week */
const publishedDay = (l: Lesson) => {
  const d = new Date(`${PARSHIOT[l.parsha].shabbat}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 6);
  return d.toISOString().slice(0, 10);
};
const homeUrl = (lang: 'ru' | 'en' | 'de') => `${SITE_URL}/${lang === 'ru' ? '' : `${lang}/`}`;
/** «Главная → урок»: breadcrumbs for search results */
const crumbs = (lang: 'ru' | 'en' | 'de', name: string, url: string) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: String({ ru, en, de }[lang]['app.title']), item: homeUrl(lang) },
    { '@type': 'ListItem', position: 2, name, item: url },
  ],
});

/**
 * The home page in each language: `/` (ru), `/en/`, `/de/` (hreflang between them) — what the academy is, the lessons by
 * portion (every teacher), the daily study of the adults and the pages for search; the app opens the catalog on them.
 */
function homePage(lang: 'ru' | 'en' | 'de'): Page {
  const u = { ru, en, de }[lang] as Record<string, unknown>;
  const t = (k: string) => esc(String(u[k]));
  const root = lang === 'ru' ? './' : '../';
  const langTags = lang === 'ru' ? tags : buildTags(lang);
  const lessons = LESSONS.filter((l) => l.texts[lang]);
  const tx = (l: Lesson) => l.texts[lang]!;
  const page = (p: StaticPage) => `/${lang === 'ru' ? '' : `${lang}/`}${p}/`;
  const others = LESSON_LANGS.filter((x) => x !== lang);
  const OTHER = { ru: 'По-русски', en: 'In English', de: 'Auf Deutsch' } as const;
  return {
    title: `${u['catalog.seoTitle']} · MyChitas`,
    description: String(u['catalog.seo']),
    url: homeUrl(lang),
    type: 'website',
    root,
    lang,
    alternates: LESSON_LANGS.map((x) => ({ lang: x, url: homeUrl(x) })),
    lastmod: latest(...LESSONS.map(lessonChanged), changed('scripts/prerender.ts', `src/i18n/locales/${lang}.ts`)),
    image: 'site',
    imageAlt: String(u['catalog.seoTitle']),
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        { ...SITE, name: String(u['app.title']), alternateName: ['נפלאות', 'Niflaot', 'Нифлаот'], inLanguage: lang, description: String(u['catalog.seo']), publisher: PUBLISHER },
        { ...PUBLISHER, '@type': 'EducationalOrganization', name: `${u['app.title']} · MyChitas`, url: homeUrl(lang), parentOrganization: PUBLISHER },
        {
          '@type': 'ItemList',
          name: String(u['catalog.heading']),
          itemListElement: lessons.map((l, i) => ({ '@type': 'ListItem', position: i + 1, url: lessonUrl(l, lang), name: tx(l).title })),
        },
      ],
    },
    body: `<header><p class="he">נפלאות</p><h1>${t('app.title')} — ${t('catalog.uvp')}</h1><p>${esc(plain(String(u['catalog.intro'])))}</p></header>
<h2>${t('wing.kids')}: ${t('catalog.heading')}</h2>
${LESSON_GROUPS.map((g) => {
  const ls = [...g.lessons, ...g.rebbe].filter((l) => l.texts[lang]);
  return ls.length
    ? `<h3>${esc(g.name[lang] ?? g.name.ru)} · <span class="he">${g.he}</span></h3><ul>${ls
        .map((l) => `<li><a href="${lessonUrl(l, lang)}"><span class="he">${esc(displayNames(l.hebrewTitle))}</span> — ${esc(tx(l).title)}</a>: ${esc(plain(tx(l).summary))}</li>`)
        .join('')}</ul>`
    : '';
}).join('\n')}
<h2>${t('wing.adults')}: ${t('home.adultsTitle')}</h2>
<p>${t('wing.adultsSub')}.</p>
<ul><li><a href="${page('neviim')}">${t('tanakh.neviim')}</a></li><li><a href="${page('ketuvim')}">${t('tanakh.ketuvim')}</a></li><li><a href="${page('hemshech')}">${t('hs.menuLbl')}</a></li><li><a href="${page('hebrew-words')}">${t('words.seoShort')}</a></li><li><a href="${page('learn-hebrew')}">${t('ln.seoShort')}</a></li></ul>
<p>${t('menu.torahRead')}: ${lessons.map((l) => `<a href="${root}#/${l.slug}/read">${esc(tx(l).title)}</a>`).join(' · ')}</p>
<h2>${t('seo.more')}</h2>
<ul><li><a href="${page('facts')}">${t('facts.title')}</a></li><li><a href="${page('daily')}">${t('daily.title')}</a></li><li><a href="${page('learn-hebrew')}">${t('ln.seoShort')}</a></li><li><a href="${page('letters')}">${t('abc.title')}</a></li><li><a href="${page('mental-math')}">${t('math.title')}</a></li><li><a href="${page('nigun')}">${t('nigun.title')}</a></li><li><a href="${page('quiz')}">${t('lq.title')}</a></li></ul>
${others
  .map(
    (o) => `<h2 lang="${o}">${OTHER[o]}</h2><ul lang="${o}"><li><a href="${homeUrl(o)}">${esc(String({ ru, en, de }[o]['catalog.seoTitle']))}</a></li>${LESSONS.filter((l) => l.texts[o])
      .map((l) => `<li><a href="${lessonUrl(l, o)}">${esc(l.texts[o]!.title)}</a></li>`)
      .join('')}</ul>`,
  )
  .join('\n')}
<h2>${t('catalog.tags')}</h2>
<p>${langTags.map((x) => (x.he ? `<span class="he">${esc(displayNames(x.label))}</span>` : esc(x.label))).join(' · ')}</p>`,
  };
}

/* ───── lessons ───── */

/** The languages a lesson's text exists in — each gets its own static page. */
const lessonLangs = (l: Lesson) => LESSON_LANGS.filter((lang) => l.texts[lang]);

function lessonPage(l: Lesson, lang: 'ru' | 'en' | 'de' = 'ru'): Page {
  const tx = l.texts[lang]!;
  const ui = { ru, en, de }[lang] as Record<string, unknown>;
  const langTags = lang === 'ru' ? tags : buildTags(lang);
  const keywords = langTags.filter((t) => !t.he && t.lessons.includes(l)).map((t) => t.label);
  const root = lang === 'ru' ? '../' : '../../';
  const parsha = PARSHIOT[l.parsha].name[lang] ?? PARSHIOT[l.parsha].name.ru;
  // what people search for: «гематрии недельной главы», «Ребе о главе Ноах» — not «Урок 4»
  const topic = l.kind === 'sicha' ? String(ui['seo.lessonSicha']).replace('{parsha}', parsha) : String(ui['seo.lessonCommentary']);
  const url = lessonUrl(l, lang);
  // the other lessons of the portion first, then the rest: links between the lesson pages
  const near = [...LESSONS.filter((x) => x !== l && x.parsha === l.parsha), ...LESSONS.filter((x) => x.parsha !== l.parsha).reverse()].filter((x) => x.texts[lang]);
  const modified = lessonChanged(l);
  return {
    title: `${tx.title} — ${topic} · ${ui['app.title']}`,
    description: plain(tx.summary),
    url,
    type: 'article',
    root,
    lang,
    alternates: lessonLangs(l).map((x) => ({ lang: x, url: lessonUrl(l, x) })),
    lastmod: modified,
    image: l.slug,
    imageAlt: `${displayNames(l.hebrewTitle)} — ${tx.title}`,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
    {
      '@type': 'LearningResource',
      name: tx.title,
      alternateName: displayNames(l.hebrewTitle),
      description: plain(tx.summary),
      url,
      inLanguage: lang,
      isAccessibleForFree: true,
      datePublished: publishedDay(l),
      dateModified: latest(publishedDay(l), modified),
      about: { '@type': 'Thing', name: `${parsha} (${PARSHIOT[l.parsha].he})` },
      image: `${SITE_URL}/og/${l.slug}.png`,
      learningResourceType: 'game',
      interactivityType: 'active',
      typicalAgeRange: `${l.age}-`,
      audience: { '@type': 'EducationalAudience', educationalRole: 'student', audienceType: plain(tx.audience) },
      author: { '@type': 'Person', ...l.author },
      publisher: PUBLISHER,
      isPartOf: SITE,
      keywords: [...(l.kind === 'sicha' ? SICHA_KEYWORDS : KEYWORDS)[lang], parsha, ...keywords].join(', '),
    },
    crumbs(lang, tx.title, url),
      ],
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
<p>${esc(plain(tx.practice))}</p></article>
<nav class="no-speak"><h2>${esc(String(ui['seo.otherLessons']))}</h2><ul>${near
  .map((x) => `<li><a href="${lessonUrl(x, lang)}">${esc(x.texts[lang]!.title)}</a> — ${esc(PARSHIOT[x.parsha].name[lang] ?? PARSHIOT[x.parsha].name.ru)}</li>`)
  .join('')}</ul></nav>`,
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
<p><a href="${root}#/letters">${esc(s(ui, 'abc.seoPlay'))} →</a> · <a href="${root}${staticPath('facts', lang).slice(1)}">${esc(s(ui, 'facts.title'))} →</a> · <a href="${root}${staticPath('daily', lang).slice(1)}">${esc(s(ui, 'daily.title'))} →</a> · <a href="${root}${staticPath('learn-hebrew', lang).slice(1)}">${esc(s(ui, 'ln.seoShort'))} →</a></p></header>
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
  const cov = [100, 300, 500, 1000, 1500, 2000].map((n) => `<li>${esc(fill('words.seoCov', { n, p: pctAt(n) }))}</li>`).join('');
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
<p><a href="${root}#/words">${esc(s(ui, 'words.seoStart'))} →</a> · <a href="${root}${staticPath('neviim', lang).slice(1)}">${esc(s(ui, 'tanakh.neviim'))} →</a> · <a href="${root}${staticPath('ketuvim', lang).slice(1)}">${esc(s(ui, 'tanakh.ketuvim'))} →</a> · <a href="${root}${staticPath('learn-hebrew', lang).slice(1)}">${esc(s(ui, 'ln.seoShort'))} →</a></p></header>
${levels.join('\n')}
<p><small>${esc(s(ui, 'words.src'))}</small></p>
</article>`,
  };
}

/**
 * «Учить иврит — язык Торы и язык Пророков» for search (`/learn-hebrew/`): the course «Святой язык — уроки»
 * (src/core/lashon.ts) — how it works, the letters, the Torah words by portion, the levels of 50 words of Tanakh — and
 * the questions people ask (FAQPage). The app opens the course.
 */
function lashonPage(lang: 'ru' | 'en' | 'de', ui: Ui): Page {
  const root = lang === 'ru' ? '../' : '../../';
  const url = `${SITE_URL}${staticPath('learn-hebrew', lang)}`;
  const fill = (key: string, vars: Record<string, string | number>) => s(ui, key as keyof Ui).replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
  const title = s(ui, 'ln.seoTitle');
  const lead = s(ui, 'ln.seoLead');
  const tw = torahWords(LESSONS, lang);
  const torah = [...new Set(tw.map((w) => w.parsha))]
    .map((p) => {
      const ws = tw.filter((w) => w.parsha === p && !w.he.includes(' '));
      return `<h3>${esc(PARSHIOT[p].name[lang] ?? PARSHIOT[p].name.ru)} · <span class="he">${PARSHIOT[p].he}</span></h3><ul>${ws
        .map((w) => `<li><span class="he">${w.he}</span> — ${esc(w.tr)}</li>`)
        .join('')}</ul>`;
    })
    .join('\n');
  const tr = WORD_TR[lang];
  const learn = WORDS.words.filter((w) => tr[w.id]);
  const levels: string[] = [];
  for (let i = 0; i < learn.length; i += 50) {
    const ws = learn.slice(i, i + 50);
    levels.push(`<li><b>${esc(fill('ln.group', { n: i / 50 + 1, a: i + 1, b: i + ws.length }))}</b>: ${ws
      .slice(0, 8)
      .map((w) => `<span class="he">${w.he}</span> (${esc(tr[w.id])})`)
      .join(', ')}…</li>`);
  }
  const faq = [1, 2, 3, 4].map((n) => [s(ui, `ln.seoQ${n}` as keyof Ui), s(ui, `ln.seoA${n}` as keyof Ui)]);
  return {
    title: `${title} · ${s(ui, 'app.title')}`,
    description: lead,
    url,
    type: 'article',
    root,
    lang,
    alternates: alternatesOf('learn-hebrew'),
    image: 'learn-hebrew',
    imageAlt: title,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'LearningResource',
          name: title,
          description: lead,
          url,
          inLanguage: lang,
          learningResourceType: ['lesson', 'quiz', 'flashcards'],
          interactivityType: 'active',
          isAccessibleForFree: true,
          typicalAgeRange: '8-',
          teaches: s(ui, 'ln.seoShort'),
          about: [
            { '@type': 'Language', name: 'Biblical Hebrew', alternateName: ['Lashon HaKodesh', 'לשון הקודש'] },
            { '@type': 'Thing', name: 'Torah' },
            { '@type': 'Thing', name: 'Nevi’im (Prophets)' },
          ],
          publisher: PUBLISHER,
          isPartOf: SITE,
        },
        {
          '@type': 'FAQPage',
          inLanguage: lang,
          mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
        },
      ],
    },
    body: `<article><header><p><a href="${root}">${esc(s(ui, 'app.title'))}</a> · ${esc(s(ui, 'academy.fac.lashon'))} · <span class="he">לשון הקודש</span></p>
<h1>${esc(title)}</h1><p>${esc(lead)}</p><p>${esc(s(ui, 'ln.seoHow'))}</p>
<p><a href="${root}#/lashon">${esc(s(ui, 'ln.seoStart'))} →</a> · <a href="${root}${staticPath('letters', lang).slice(1)}">${esc(s(ui, 'abc.title'))} →</a> · <a href="${root}${staticPath('hebrew-words', lang).slice(1)}">${esc(s(ui, 'words.seoShort'))} →</a></p></header>
<section><h2>${esc(s(ui, 'ln.seoAbcH'))}</h2><p>${esc(s(ui, 'ln.seoAbcP'))}</p><p class="he">${[...ALEPH_BET, ...FINAL_FORMS].join(' ')}</p></section>
<section><h2>${esc(s(ui, 'ln.seoTorahH'))}</h2><p>${esc(s(ui, 'ln.seoTorahP'))}</p>
${torah}</section>
<section><h2>${esc(s(ui, 'ln.seoTanakhH'))}</h2><p>${esc(s(ui, 'ln.seoTanakhP'))}</p><ul>${levels.join('')}</ul></section>
<section><h2>${esc(s(ui, 'ln.seoFaqH'))}</h2>${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('\n')}</section>
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

/** «Святая музыка»: the niggunim — about each and its words (with how it is read and a translation on en/de); the app opens `#/nigun` */
function nigunPage(lang: 'ru' | 'en' | 'de', ui: Ui): Page {
  const root = lang === 'ru' ? '../' : '../../';
  const url = `${SITE_URL}${staticPath('nigun', lang)}`;
  const title = `${s(ui, 'nigun.title')} — ${s(ui, 'nigun.seoTitle')}`;
  const lead = s(ui, 'nigun.lead');
  return {
    title: `${title} · ${s(ui, 'app.title')}`,
    description: lead,
    url,
    type: 'article',
    root,
    lang,
    alternates: alternatesOf('nigun'),
    lastmod: latest(changed('src/nigun', 'public/nigun'), changed(`src/i18n/locales/${lang}.ts`)),
    image: 'nigun',
    imageAlt: title,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'LearningResource',
          name: title,
          description: lead,
          url,
          inLanguage: lang,
          learningResourceType: ['audio', 'game'],
          interactivityType: 'active',
          isAccessibleForFree: true,
          publisher: PUBLISHER,
          isPartOf: SITE,
          hasPart: NIGUNIM.map((n) => ({
            '@type': 'MusicComposition',
            name: n.title[lang],
            inLanguage: n.lang,
            description: n.about[lang],
            recordedAs: { '@type': 'MusicRecording', name: n.title[lang], url: `${homeUrl(lang)}#/nigun/${n.id}`, audio: { '@type': 'AudioObject', contentUrl: `${SITE_URL}/${n.audio}` } },
          })),
        },
        crumbs(lang, s(ui, 'nigun.title'), url),
      ],
    },
    body: `<article><header><p><a href="${root}${lang === 'ru' ? '' : `${lang}/`}">${esc(s(ui, 'app.title'))}</a> · ${esc(s(ui, 'nigun.sub'))}</p>
<h1>${esc(title)}</h1><p>${esc(lead)}</p></header>
${NIGUNIM.map(
  (n) => `<section><h2>${esc(n.title[lang])}</h2><p>${esc(n.about[lang])}</p><p><a href="${root}#/nigun/${n.id}">${esc(s(ui, 'nigun.karaoke'))} →</a></p>
<h3>${esc(s(ui, 'nigun.seoAbout'))}</h3><ol>${n.lines
    .map((x) => `<li>${esc(x.text)}${lang !== n.lang && x.tr?.[lang] ? ` — <i>${esc(x.read?.[lang] ?? '')}</i>: ${esc(x.tr[lang]!)}` : ''}</li>`)
    .join('')}</ol>
<p>${esc(s(ui, 'nigun.credit'))} <a href="${n.source.url}">${esc(n.source.name)}</a></p></section>`,
).join('\n')}
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
  [staticPath('nigun', lang), nigunPage(lang, ui)] as [string, Page],
  [staticPath('learn-hebrew', lang), lashonPage(lang, ui)] as [string, Page],
]);
// lastmod: pages that change every day (the passage of the day, the opened passages, the quiz sets of the week) — today;
// the facts — from the lessons; the rest — when their texts or this script changed
const DAILY_PAGES = ['daily', 'neviim', 'ketuvim', 'hemshech', 'quiz'];
for (const [path, page] of STATIC_OUT)
  page.lastmod ??= DAILY_PAGES.some((d) => path.endsWith(`/${d}/`))
    ? today
    : path.endsWith('/facts/')
      ? latest(...LESSONS.map(lessonChanged))
      : changed('scripts/prerender.ts', `src/i18n/locales/${page.lang ?? 'ru'}.ts`, 'src/tanakh/words');

/* ───── write ───── */

const HOMES = LESSON_LANGS.map((lang) => homePage(lang));
for (const h of HOMES) {
  const dir = `${DIST}${h.url.slice(SITE_URL.length)}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}index.html`, render(h));
}
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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...HOMES, ...LESSON_OUT.map((x) => x.page), ...STATIC_OUT.map(([, p]) => p)]
  .map(
    (p) =>
      `  <url><loc>${p.url}</loc><lastmod>${p.lastmod ?? today}</lastmod>${(p.alternates ?? [])
        .map((a) => `<xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.url}"/>`)
        .join('')}</url>`,
  )
  .join('\n')}
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


/* ───── the podcast: «Слушать урок» as episodes (scripts/podcast.ts uploads the MP3s and the list) ───── */

const episodes: PodcastEpisodes = await fetch(process.env.PODCAST_MANIFEST ?? PODCAST_RELEASE.manifest, { signal: AbortSignal.timeout(20_000) })
  .then((r) => (r.ok ? (r.json() as Promise<PodcastEpisodes>) : {}))
  .catch((e) => (console.log(`podcast: no list of episodes (${e})`), {}));
const rfc822 = (iso: string) => new Date(iso).toUTCString().replace('GMT', '+0000');
const hms = (sec: number) => [Math.floor(sec / 3600), Math.floor(sec / 60) % 60, sec % 60].map((n) => String(n).padStart(2, '0')).join(':');
let podcastFeeds = 0;
for (const f of FEEDS) {
  const lang = f.locale;
  const list = LESSONS.filter((l) => l.texts[lang] && episodes[lang]?.[l.slug]).reverse();
  if (!list.length) continue;
  const u = f.ui as Record<string, string>;
  const self = `${SITE_URL}/${PODCAST_FEEDS[lang]}`;
  const items = list.map((l) => {
    const tx = l.texts[lang]!;
    const e = episodes[lang]![l.slug];
    const link = `${lessonUrl(l, lang)}?ref=podcast`;
    const parsha = PARSHIOT[l.parsha].name[lang] ?? PARSHIOT[l.parsha].name.ru;
    const desc = `${plain(tx.summary)}\n\n${u['podcast.more']} ${link}`;
    return `    <item>
      <title>${esc(episodeTitle(plain(tx.title), parsha))}</title>
      <description>${esc(desc)}</description>
      <link>${esc(link)}</link>
      <guid isPermaLink="false">niflaot-${lang}-${l.slug}</guid>
      <pubDate>${rfc822(published(l))}</pubDate>
      <enclosure url="${PODCAST_RELEASE.base}/${e.file}" length="${e.bytes}" type="audio/mpeg" />
      <itunes:duration>${hms(e.seconds)}</itunes:duration>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
      <itunes:image href="${SITE_URL}/podcast/cover-${lang}.jpg" />
    </item>`;
  });
  writeFileSync(
    `${DIST}/${PODCAST_FEEDS[lang]}`,
    `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:podcast="https://podcastindex.org/namespace/1.0">
  <channel>
    <title>${esc(u['podcast.title'])}</title>
    <link>${SITE_URL}/?lang=${lang}&amp;ref=podcast</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <language>${lang}</language>
    <description>${esc(u['podcast.desc'])}</description>
    <copyright>© MyChitas · niflaot.mychitas.app</copyright>
    <podcast:locked>no</podcast:locked>
    <podcast:guid>${createHash('sha256').update(self).digest('hex').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/, '$1-$2-$3-$4-$5')}</podcast:guid>
    <itunes:author>Niflaot · MyChitas</itunes:author>
    <itunes:owner><itunes:name>MyChitas</itunes:name><itunes:email>Office@mychitas.app</itunes:email></itunes:owner>
    <itunes:image href="${SITE_URL}/podcast/cover-${lang}.jpg" />
    <image><url>${SITE_URL}/podcast/cover-${lang}.jpg</url><title>${esc(u['podcast.title'])}</title><link>${SITE_URL}/</link></image>
    <itunes:category text="Religion &amp; Spirituality"><itunes:category text="Judaism" /></itunes:category>
    <itunes:category text="Kids &amp; Family"><itunes:category text="Education for Kids" /></itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <itunes:type>episodic</itunes:type>
    <lastBuildDate>${rfc822(published(list[0]))}</lastBuildDate>
${items.join('\n')}
  </channel>
</rss>
`,
  );
  podcastFeeds++;
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
    // ?v=2 — the round seal «נפלאות» (28.10.2026): a new address makes installed apps fetch the new icon
    icons: [
      { src: '/icons/icon-192.png?v=2', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/maskable-512.png?v=2', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: s(ui, 'daily.title'), url: start(staticPath('daily', lang)), icons: [{ src: '/icons/icon-192.png?v=2', sizes: '192x192' }] },
      { name: s(ui, 'facts.title'), url: start(staticPath('facts', lang)), icons: [{ src: '/icons/icon-192.png?v=2', sizes: '192x192' }] },
      { name: s(ui, 'abc.title'), url: start(staticPath('letters', lang)), icons: [{ src: '/icons/icon-192.png?v=2', sizes: '192x192' }] },
    ],
  };
  writeFileSync(`${DIST}/manifest${lang === 'ru' ? '' : `-${lang}`}.webmanifest`, `${JSON.stringify(manifest, null, 2)}\n`);
}

/* ───── service worker and the daily message ───── */

// offline: the app's code, styles and fonts, the icons and manifests (the Memo pictures are kept when first seen)
const assets = readdirSync(`${DIST}/assets`).filter((f) => /\.(js|css|woff2)$/.test(f)).map((f) => `/assets/${f}`);
const precache = [...assets, '/look.js', '/icons/icon-192.png?v=2', '/manifest.webmanifest', '/manifest-en.webmanifest', '/manifest-de.webmanifest'];
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

/* ───── «Слушать»: the text of every lesson's read page in parts, for the worker's Gemini TTS (src/core/narration.ts) ───── */

let narrated = 0;
for (const l of LESSONS)
  for (const lang of lessonLangs(l)) {
    const u = { ru, en, de }[lang] as Record<string, string>;
    const n = narration(
      l,
      lang,
      { chapter: (k, total) => u['read.chapter'].replace('{n}', String(k)).replace('{total}', String(total)), reflection: u['refl.title'], practice: u['final.practice'] },
      (t) => createHash('sha256').update(t).digest('hex').slice(0, 16),
    );
    if (!n) continue;
    mkdirSync(`${DIST}/tts/${lang}`, { recursive: true });
    writeFileSync(`${DIST}/tts/${lang}/${l.slug}.json`, JSON.stringify(n));
    narrated++;
  }

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
${podcastFeeds ? `- Podcast — the lessons read aloud (RSS): ${(['en', 'ru', 'de'] as const).filter((l) => existsSync(`${DIST}/${PODCAST_FEEDS[l]}`)).map((l) => `[${LANG_NAME[l]}](${SITE_URL}/${PODCAST_FEEDS[l]})`).join(', ')}\n` : ''}`,
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
console.log(`prerender: index + ${LESSON_OUT.length} lesson pages (ru/en/de) + ${STATIC_OUT.length} math / daily / facts / letters / prophets / writings / words pages, sitemap.xml, robots.txt, llms.txt, ${FEEDS.length} feeds, ${podcastFeeds} podcast feeds, ${LANGS.length} manifests, sw.js (${precache.length} files offline), daily messages for ${Object.keys(days).length} days, ${quiz.index.length} quiz decks, ${narrated} lessons to listen to`);
