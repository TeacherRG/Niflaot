// Full playthrough in a real browser (Playwright + Chromium): npm run test:play
// Plays the game from the title screen to the certificate for several
// language × age × gender combinations and checks every screen:
//  - no JavaScript errors and no failed local files;
//  - no leftover {boy|girl} forms, {{placeholders}}, raw locale keys or "undefined";
//  - the right alphabet (no Cyrillic in German, no ы/э/ъ/ё in Ukrainian);
//  - all 7 worlds done, final tabs render, certificate image is drawn;
//  - the real jigsaw appears and the mirror step works without a camera;
//  - the start screen turns on music, the greeting is spoken, every screen gets a voice hint;
//  - sound is on at every start, even if an earlier visit chose «Без звука»;
//  - after a silence the Keeper asks «Тебе чем-то помочь?».
//
// Options:
//   --lang=de        only scenarios in this language (ru | uk | de)
//   --quick          one scenario per language instead of all
//   --shots[=dir]    save screenshots of every screen (default: tests/screenshots/)
//   --headed         show the browser window
import {chromium} from 'playwright';
import {mkdir, readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {startServer} from '../tools/serve.mjs';
import {collect} from '../tools/voice-phrases.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const arg = (name) => { const a = process.argv.find(x => x === `--${name}` || x.startsWith(`--${name}=`)); return a === undefined ? undefined : (a.split('=')[1] ?? true); };
const onlyLang = arg('lang'), quick = !!arg('quick'), headed = !!arg('headed');
const shotsDir = arg('shots') === undefined ? null : (arg('shots') === true ? ROOT + 'tests/screenshots' : arg('shots'));

const ALL = [
  {lang: 'ru', age: 't', g: 'm'}, {lang: 'ru', age: 'y', g: 'f'},
  {lang: 'uk', age: 'y', g: 'f'}, {lang: 'uk', age: 't', g: 'm'},
  {lang: 'de', age: 't', g: 'm'}, {lang: 'de', age: 'y', g: 'f'},
  {lang: 'en', age: 't', g: 'f'}, {lang: 'en', age: 'y', g: 'm'},
  {lang: 'ru', age: 'a', g: 'f'}, {lang: 'uk', age: 'a', g: 'm'}, {lang: 'de', age: 'a', g: 'f'}, {lang: 'en', age: 'a', g: 'm'}
];
let scenarios = ALL.filter(s => !onlyLang || s.lang === onlyLang);
if (quick) scenarios = scenarios.filter((s, i, a) => a.findIndex(x => x.lang === s.lang) === i);
if (!scenarios.length) { console.error(`No scenarios for --lang=${onlyLang}`); process.exit(2); }

const INPUT = {ru: ['Тест', 'собираю модели', 'умею мирить друзей'], uk: ['Тест', 'збираю моделі', 'вмію мирити друзів'], de: ['Test', 'Modelle bauen', 'Streit schlichten'], en: ['Test', 'building models', 'making peace between friends']};
const ALPHABET = {de: /[А-Яа-яЁёІіЇїЄєҐґ]/, en: /[А-Яа-яЁёІіЇїЄєҐґ]/, uk: /[ЫыЭэЪъЁё]/};
// only dotted keys: a bare key like «letters» is an ordinary English word
const localeKeys = Object.keys(JSON.parse(await readFile(ROOT + 'locales/ru.json', 'utf8'))).filter(k => k.includes('.'));
const KEY_RE = new RegExp('(^|\\s)(' + localeKeys.map(k => k.replace(/\./g, '\\.')).join('|') + ')(\\s|$)');

function textProblems(text, lang) {
  const out = [];
  const snip = re => (text.match(new RegExp('.{0,30}' + re.source + '.{0,30}', 's')) || [''])[0].replace(/\s+/g, ' ');
  if (/[{}|]/.test(text)) out.push('leftover {…|…} or {{…}}: ' + snip(/[{}|]/));
  if (/\bundefined\b|\bNaN\b|\[object Object\]/.test(text)) out.push('undefined/NaN: ' + snip(/undefined|NaN|\[object Object\]/));
  if (KEY_RE.test(text)) out.push('raw locale key: ' + snip(KEY_RE));
  if (ALPHABET[lang]?.test(text)) out.push('wrong alphabet: ' + snip(ALPHABET[lang]));
  return out;
}

async function run(browser, base, sc) {
  const name = `${sc.lang}-${{y: '8-11', t: '12-15', a: '16plus'}[sc.age]}-${sc.g === 'f' ? 'girl' : 'boy'}`;
  const ctx = await browser.newContext({viewport: {width: 375, height: 800}});
  const page = await ctx.newPage();
  const problems = new Set(), seen = {jigsaw: false, mirror: false};
  const add = m => problems.add(m);
  page.on('pageerror', e => add('JS error: ' + e.message));
  let framing = false; // the iframe check below aborts the framed page's requests on purpose
  page.on('requestfailed', r => { if (!framing && r.url().startsWith(base) && !/\/audio\/.*\.mp3$/.test(r.url())) add('failed to load ' + r.url().slice(base.length)); });
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) add('console error: ' + m.text()); });
  // players never talk to other servers; GitHub only after the admin signs in (mocked below, nothing real is sent)
  let adminOn = false;
  const gh = [];
  page.on('request', r => { const u = r.url(); if (!u.startsWith(base) && !u.startsWith('data:') && !u.startsWith('blob:') && !(adminOn && u.startsWith('https://api.github.com/'))) add('request to another server: ' + u.slice(0, 80)); });
  await page.route('https://api.github.com/**', r => {
    const req = r.request(), u = new URL(req.url()), m = req.method();
    gh.push({m, path: u.pathname, body: req.postData()});
    if (u.pathname === '/repos/TeacherRG/Koelet') return r.fulfill({json: {permissions: {push: true}}});
    if (u.pathname === '/user') return r.fulfill({json: {login: 'tester'}});
    // a read-only key: the public repository can be read, but writing is refused
    if (req.headers().authorization === 'Bearer github_pat_readonly' && m !== 'GET') return r.fulfill({status: 403, json: {}});
    if (m === 'GET') return r.fulfill({status: 404, json: {}});
    return r.fulfill({status: 201, json: {}});
  });
  await page.addInitScript(l => {
    try { localStorage.setItem('koelet-lang', l); localStorage.setItem('koelet-audio', JSON.stringify({music: false, voice: false})); } catch (e) {}   // an old «Без звука» must not stick
    // record everything the voice guide says (headless browsers have no audible voices)
    window.__spoken = [];
    if (window.speechSynthesis) { const orig = speechSynthesis.speak.bind(speechSynthesis); speechSynthesis.speak = u => { window.__spoken.push(u.text); try { orig(u); } catch (e) {} }; }
  }, sc.lang);
  // ready-made voice (audio/<lang>/): the list of every phrase from the texts, the mp3 files
  // themselves are «missing» so the browser voice speaks and gets recorded
  const phrases = [...collect(sc.lang).keys()];
  await page.route(`${base}audio/${sc.lang}/index.json`, r => r.fulfill({json: {keys: phrases}}));
  await page.route(`${base}audio/**/*.mp3`, r => r.fulfill({status: 404, body: ''}));
  await page.goto(base + 'index.html');
  await page.waitForSelector('#start', {timeout: 15000});
  await page.waitForFunction(() => Voice.keys, null, {timeout: 5000}).catch(() => add('voice: audio/index.json was not loaded'));
  await page.evaluate(() => { window.__miss = []; const clip = Voice.clip; Voice.clip = function (s) { const r = clip.call(this, s); if (!r) window.__miss.push(s); return r; }; });
  let shot = 0;
  // start screen: the tap turns on music and the greeting
  if (!(await page.waitForSelector('#gate-go', {timeout: 5000}).catch(() => null))) add('start screen (music gate) did not appear');
  else {
    await page.click('#gate-go');
    await page.waitForTimeout(1500);
    const a = await page.evaluate(() => ({playing: Music.playing, t: Music.el ? Music.el.currentTime : 0, spoken: window.__spoken.slice()}));
    if (!a.playing || a.t <= 0) add('background music is not playing after the start screen');
    if (!a.spoken.length) add('greeting was not spoken');
  }
  const snap = async label => { if (shotsDir) await page.screenshot({path: `${shotsDir}/${name}-${String(++shot).padStart(3, '0')}-${label}.png`, fullPage: true}); };
  await snap('title');
  const [heroName, ownFlow, ownQuality] = INPUT[sc.lang];
  // quick settings on the title screen: language + music/voice switches
  await page.click('#setbtn');
  if (!(await page.$('#qmenu [data-lang]')) || (await page.$$('#qmenu [data-audio]')).length !== 2) add('title settings menu is incomplete');
  await page.keyboard.press('Escape');
  await page.click('#start');
  // «Готово» without age and gender → both fields turn red with a hint
  await page.click('#ready');
  if ((await page.$$('.req.bad .req-err')).length !== 2 || await page.evaluate(() => S.screen) !== 'create') add('missing age/gender is not highlighted on the hero screen');
  await page.click(`[data-age="${sc.age}"]`); await page.click(`[data-g="${sc.g}"]`);
  await page.fill('#hname', heroName);
  await snap('create');
  await page.click('#ready'); await page.click('#go');

  const has = async s => (await page.$(s)) !== null;
  const enabled = async s => { const e = await page.$(s); return !!e && await e.isEnabled(); };
  let steps = 0, ownUsed = false, rechosen = false, navChecked = false, i = 0;
  for (; i < 700; i++) {
    const screen = await page.evaluate(() => S.screen);
    const text = await page.evaluate(() => document.querySelector('#stage').innerText);
    for (const p of textProblems(text, sc.lang)) add(`[${screen}] ${p}`);
    if (screen === 'final') break;
    if (!navChecked && screen === 'world' && await enabled('[data-nav="-1"]')) {
      // arrows under the HUD: back one step, then forward again up to the step reached
      navChecked = true; const at = await page.evaluate(() => S.s);
      await page.click('[data-nav="-1"]'); const back = await page.evaluate(() => S.s);
      const fwdOn = await enabled('[data-nav="1"]'); await page.click('[data-nav="1"]');
      if (back !== at - 1 || !fwdOn || await page.evaluate(() => S.s) !== at) add('step arrows do not go back and forward');
    }
    if (!seen.back && screen === 'world' && await page.evaluate(() => S.s) >= 3) {
      // «Назад» at the bottom and the phone's back button: one step back each
      seen.back = true;
      const s0 = await page.evaluate(() => S.s);
      if (!(await has('#stepback'))) add('no «Назад» button at the bottom of a step');
      else {
        await page.click('#stepback');
        if (await page.evaluate(() => S.s) !== s0 - 1) add(`«Назад» did not go one step back (${s0} → ${await page.evaluate(() => S.s)})`);
        await page.goBack();
        await page.waitForFunction(n => S.s === n, s0 - 2, {timeout: 3000}).catch(() => add('the phone\'s back button did not go one step back'));
      }
      continue;
    }
    if (!(await has('.whatif')) && await has('#wi')) { await page.click('#wi'); continue; }
    if (await enabled('#nx')) { await snap(screen); await page.click('#nx'); steps++; continue; }
    if (screen === 'map') { const n = await page.$('.mnode.open'); if (n) { await n.click(); continue; } if (await has('#fin')) { await page.click('#fin'); continue; } }
    if (await has('#autosolve')) {
      seen.jigsaw = !!(await page.waitForSelector('#jig canvas', {timeout: 10000}).catch(() => null));
      if (!seen.jigsaw) add('jigsaw did not render');
      await snap('jigsaw'); await page.click('#autosolve'); continue;
    }
    if (await has('#camskip')) { seen.mirror = true; await snap('mirror'); await page.click('#camskip'); continue; }
    if (!ownUsed && await has('#ownok') && await has('.opts') && await enabled('#ownin')) { await page.fill('#ownin', ownFlow); await page.click('#ownok'); ownUsed = true; continue; }
    const opts = await page.$$('.opt:not([disabled])');
    if (opts.length > 1 && !rechosen) {
      // an accidental tap can be undone: the second option replaces the first, sparks are given once
      rechosen = true; await opts[0].click(); const sp = await page.evaluate(() => S.sparks);
      await opts[1].click();
      const ok = await page.evaluate(sp => S.sparks === sp && document.querySelectorAll('.opt.picked').length === 1 && document.querySelectorAll('.opt')[1].classList.contains('picked'), sp);
      if (!ok) add('a picked option cannot be changed (or sparks are given twice)');
      continue;
    }
    if (opts.length) { await opts[i % opts.length].click(); continue; }
    if (await has('#tap')) { await page.click('#tap'); await page.waitForTimeout(250); continue; }
    if (await has('#show')) { await page.click('#show'); continue; }
    let clicked = false;
    for (const id of ['#night', '#see', '#put']) if (await has(id)) { await page.click(id); clicked = true; break; }
    if (clicked) continue;
    if (await has('.mz-card')) { seen.maslow = true; await page.click('.mz-card'); await page.click(`.mz-drop >> nth=${(await has('.mz-chip')) ? 3 : 0}`); continue; }
    if (await has('.tl-ev')) { seen.timeline = true; const n = (await page.$$('.tl-slot.in')).length; if (!n) await page.click('.tl-ev[data-n="1"]'); await page.click(`.tl-ev[data-n="${n}"]`); continue; }
    if (await has('.item') && await page.evaluate(() => { const d = document.querySelector('#donate'); return !!d && !d.hidden; })) add('donate heart is shown over a mini-game');
    if (await has('.item')) { await page.click('.item:not(.got)', {force: true}).catch(() => {}); await page.waitForTimeout(250); continue; }
    if (await has('.tile')) { for (const t of await page.$$('.tile[data-t="1"]:not(.hit)')) await t.click(); continue; }
    if (await has('.sp:not(.on)')) { await page.click('.sp:not(.on)'); continue; }
    if (await has('.circ')) { for (let k = 0; k < 4; k++) { await page.click(`.circ >> nth=${k}`); await page.click('[data-o="0"]'); } continue; }
    if (await has('.chip')) { if (await has('#ownin')) await page.fill('#ownin', ownQuality); await page.click('.chip:not(.on)'); await page.click('.chip:not(.on) >> nth=1'); continue; }
    add(`stuck on screen "${screen}"`); break;
  }
  if (i >= 700) {
    // say where the driver got stuck: screen, step type, open sheet, visible buttons
    const where = await page.evaluate(() => { let st = typeof steps === 'function' && ['world', 'prologue'].includes(S.screen) ? steps()[idx()] : null; if (typeof st === 'function') st = null;
      return `${S.screen}/${st ? st.type + (st.game ? ':' + JSON.stringify(st.game) : '') : '-'}${document.querySelector('.sheet') ? ' + open sheet' : ''}; buttons: ` + [...document.querySelectorAll('#stage button:not([disabled])')].slice(0, 6).map(b => (b.id || b.className) + (b.innerText ? ' «' + b.innerText.slice(0, 20) + '»' : '')).join(', '); });
    add('did not reach the final screen — stuck on ' + where);
  }

  const spoken = await page.evaluate(() => window.__spoken);
  // every sentence the Keeper says must have a ready-made recording (tools/tts.mjs)
  for (const m of new Set(await page.evaluate(() => window.__miss))) add(`[voice] no recording for: ${m}`);
  for (const text of spoken) for (const p of textProblems(text, sc.lang)) add(`[voice] ${p}`);
  if (spoken.length < steps) add(`voice hints: only ${spoken.length} phrases for ${steps} screens`);
  const state = await page.evaluate(() => ({screen: S.screen, done: S.done.filter(Boolean).length}));
  if (state.screen !== 'final') add(`ended on "${state.screen}" instead of "final"`);
  if (state.done !== 7) add(`only ${state.done} of 7 worlds done`);
  if (!seen.jigsaw) add('jigsaw step was not reached');
  if (!seen.mirror) add('mirror step was not reached');
  if (sc.age === 'a' && !seen.maslow) add('16+: Maslow pyramid (Solomon\'s experiments) was not reached');
  if (sc.age === 'a' && !seen.timeline) add('16+: history timeline was not reached');
  if (sc.age !== 'a' && (seen.maslow || seen.timeline)) add('16+ mini-games shown to a child');
  if (state.screen === 'final') {
    for (const tab of ['path', 'ach', 'cert']) {
      await page.click(`[data-tab="${tab}"]`);
      const tx = await page.evaluate(() => document.querySelector('#tabp').innerText);
      for (const p of textProblems(tx, sc.lang)) add(`[final/${tab}] ${p}`);
      await snap('final-' + tab);
    }
    // a minute of silence (shortened here) → the Keeper offers help
    const idleText = JSON.parse(await readFile(ROOT + `locales/${sc.lang}.json`, 'utf8'))['voice.idle'];
    await page.evaluate(() => { window.__spoken.length = 0; Voice.idleMs = 700; Voice.cancel(); });
    await page.waitForTimeout(1500);
    if (!(await page.evaluate(q => window.__spoken.some(x => x.startsWith(q)), idleText))) add('no «can I help?» after silence');
    await page.evaluate(() => { Voice.idleMs = 60000; Voice.idle(); });
    if (!(await page.waitForSelector('#cert img', {timeout: 8000}).catch(() => null))) add('certificate image was not drawn');
    // «About» from the menu: project link, four sections, closes with Escape
    await page.click('#menubtn'); await page.click('[data-m="about"]');
    const about = await page.evaluate(() => { const d = document.querySelector('.sheet.about'); return d && {text: d.innerText, href: (d.querySelector('a') || {}).href, secs: d.querySelectorAll('.about-sec').length}; });
    if (!about) add('«About» window did not open');
    else {
      if (!/^https:\/\/mychitas\.app\/?$/.test(about.href || '')) add('«About»: no link to mychitas.app');
      if (about.secs !== 4) add(`«About»: ${about.secs} sections instead of 4`);
      for (const p of textProblems(about.text, sc.lang)) add(`[about] ${p}`);
      await snap('about');
      await page.keyboard.press('Escape');
      if (await has('.sheet.about')) add('«About» did not close with Escape');
    }
    // «Book an online lesson» from the menu: mailto link, three sections, closes with Escape
    await page.click('#menubtn'); await page.click('[data-m="lesson"]');
    const lesson = await page.evaluate(() => { const d = document.querySelector('.sheet.lesson'); return d && {text: d.innerText, href: (d.querySelector('a[href^="mailto:"]') || {}).href, secs: d.querySelectorAll('.about-sec').length}; });
    if (!lesson) add('«Online lesson» window did not open');
    else {
      if (lesson.href !== 'mailto:office@mychitas.app') add(`«Online lesson»: mail link is "${lesson.href}"`);
      if (lesson.secs !== 3) add(`«Online lesson»: ${lesson.secs} sections instead of 3`);
      for (const p of textProblems(lesson.text, sc.lang)) add(`[lesson] ${p}`);
      await snap('lesson');
      await page.keyboard.press('Escape');
      if (await has('.sheet.lesson')) add('«Online lesson» did not close with Escape');
    }
    // donate button (heart) leads to mychitas.app/donate
    const donate = await page.evaluate(() => (document.querySelector('#donate') || {}).href);
    if (donate !== 'https://mychitas.app/donate') add(`donate link is "${donate}" instead of https://mychitas.app/donate`);
    // the hero chip opens the profile with level and all achievements
    await page.click('#herobtn');
    const prof = await page.evaluate(() => { const d = document.querySelector('.sheet.profile'); return d && {text: d.innerText, achs: d.querySelectorAll('.ach').length}; });
    if (!prof) add('hero chip did not open the profile');
    else {
      if (prof.achs !== 6) add(`profile: ${prof.achs} achievements instead of 6`);
      for (const p of textProblems(prof.text, sc.lang)) add(`[profile] ${p}`);
      await snap('profile');
      await page.click('#closeM');
      if (await has('.sheet.profile')) add('profile did not close with ✕');
    }
    // «К Шабату» from the menu: six A4 sheets, nothing spills over the page, print gets them all, «Назад» returns
    await page.click('#menubtn'); await page.click('[data-m="shab"]');
    const sh = await page.evaluate(() => ({screen: S.screen, thumbs: document.querySelectorAll('.shab-thumb .pp').length, text: document.querySelector('#stage').innerText}));
    if (sh.screen !== 'shabbat' || sh.thumbs !== 6) add(`«К Шабату»: screen "${sh.screen}", ${sh.thumbs} sheets instead of 6`);
    for (const p of textProblems(sh.text, sc.lang)) add(`[shabbat] ${p}`);
    await snap('shabbat');
    await page.evaluate(() => { window.__printed = -1; window.print = () => { window.__printed = document.querySelectorAll('#print-area .pp').length; }; });
    await page.click('#shprint');
    await page.waitForFunction(() => window.__printed >= 0, null, {timeout: 5000}).catch(() => {});
    const pr = await page.evaluate(() => ({n: window.__printed, text: document.querySelector('#print-area').innerText,
      over: [...document.querySelectorAll('.shab-thumb .pp-body')].filter(b => b.scrollHeight > b.clientHeight + 1).map(b => b.parentElement.className)}));
    if (pr.n !== 6) add(`«К Шабату»: ${pr.n} sheets sent to print instead of 6`);
    if (pr.over.length) add('«К Шабату»: content does not fit the A4 sheet: ' + pr.over.join(', '));
    for (const p of textProblems(pr.text, sc.lang)) add(`[shabbat/print] ${p}`);
    // real print layout: the sheets' own page size (portrait A4) wins over the certificate's landscape one
    await page.emulateMedia({media: 'print'});
    const pdf = (await page.pdf({preferCSSPageSize: true, printBackground: true})).toString('latin1');
    await page.emulateMedia({media: null});
    const boxes = [...pdf.matchAll(/\/MediaBox\s*\[\s*0 0 ([\d.]+) ([\d.]+)\s*\]/g)].map(m => [Math.round(+m[1]), Math.round(+m[2])]);
    if (boxes.length !== 6 || boxes.some(([w, h]) => w !== 595 || h !== 842)) add(`«К Шабату»: printed ${boxes.length} pages (${boxes.map(b => b.join('×')).join(', ')}) instead of 6 portrait A4`);
    await page.evaluate(() => shabPrintDone());
    await page.click('#shback');
    if (await page.evaluate(() => S.screen) !== 'final') add('«К Шабату»: «Назад» did not return to the final screen');
    // «Твой стих в Танахе» from the menu: a Hebrew name gives a verse for its letters, «Назад» returns
    await page.click('#menubtn'); await page.click('[data-m="mine"]'); await page.click('[data-m="pasuk"]');
    await page.evaluate(() => { const i = document.querySelector('#hebname'); i.value = 'משה'; i.dispatchEvent(new Event('input')); });
    await page.waitForSelector('.pasuk-v', {timeout: 5000}).catch(() => {});
    const pa = await page.evaluate(() => ({screen: S.screen, verses: document.querySelectorAll('.pasuk-v').length, text: [...document.querySelectorAll('#stage .lead, #stage .group h3, .pasuk-what, figcaption')].map(e => e.innerText).join('\n')}));
    if (pa.screen !== 'pasuk' || pa.verses !== 2) add(`«Твой стих»: screen "${pa.screen}", ${pa.verses} verses instead of 2 for משה`);
    for (const p of textProblems(pa.text, sc.lang)) add(`[pasuk] ${p}`);
    await snap('pasuk');
    await page.click('#paback');
    if (await page.evaluate(() => S.screen) !== 'final') add('«Твой стих»: «Назад» did not return to the final screen');
    // «Твой день в „Айом-йом“» from the menu: a birthday gives an entry of the book; the full certificate draws
    await page.click('#menubtn'); await page.click('[data-m="mine"]'); await page.click('[data-m="hayom"]');
    await page.fill('#hyg', '2012-03-14'); await page.dispatchEvent('#hyg', 'change');
    await page.waitForSelector('.hy-v', {timeout: 5000}).catch(() => {});
    const hy = await page.evaluate(() => ({screen: S.screen, ok: !!document.querySelector('.hy-v'), date: (document.querySelector('.hy-loc') || {}).innerText || '', text: [...document.querySelectorAll('#stage .lead, #stage .group h3, #stage label, .hy-loc, figcaption')].map(e => e.innerText).join('\n')}));
    if (hy.screen !== 'hayom' || !hy.ok || !/20/.test(hy.date)) add(`«Айом-йом»: screen "${hy.screen}", entry ${hy.ok}, date "${hy.date}" (14.03.2012 = 20 Adar)`);
    for (const p of textProblems(hy.text, sc.lang)) add(`[hayom] ${p}`);
    await snap('hayom');
    await page.click('#hyback');
    if (await page.evaluate(() => S.screen) !== 'final') add('«Айом-йом»: «Назад» did not return to the final screen');
    // «Картина со стихом» only for 16+: from the menu the picture for משה draws (print A4 in full size); the donate link carries no letters
    await page.click('#menubtn'); await page.click('[data-m="mine"]');
    const galItem = await page.$('[data-m="gallery"]');
    if (sc.age !== 'a') { if (galItem) add('«Картина со стихом» is in the menu for a child'); await page.click('#closeM'); }
    else if (!galItem) add('«Картина со стихом» is missing from the menu for 16+');
    else {
      await galItem.click();
      await page.waitForSelector('.gal-cv', {timeout: 8000}).catch(() => {});
      const ga = await page.evaluate(async () => { const c = await galCanvas('print');
        return {screen: S.screen, prev: !!document.querySelector('.gal-cv'), w: c && c.width, h: c && c.height, href: document.querySelector('#galdon').getAttribute('href'),
          text: [...document.querySelectorAll('#stage .lead, #stage .group h3, #stage .segb, #stage label, #stage .pasuk-hint, .gal-donate p, .shab-note')].map(e => e.innerText).join('\n')}; });
      if (ga.screen !== 'gallery' || !ga.prev || ga.w !== 2480 || ga.h !== 3508) add(`«Картина»: screen "${ga.screen}", preview ${ga.prev}, print ${ga.w}×${ga.h} instead of 2480×3508`);
      if (!/^https:\/\/mychitas\.app\/donate\/art\?lang=\w+&kind=\w+$/.test(ga.href || '')) add('«Картина»: the donate link must carry only language and kind: ' + ga.href);
      for (const p of textProblems(ga.text, sc.lang)) add(`[gallery] ${p}`);
      await snap('gallery');
      await page.click('#galback');
      if (await page.evaluate(() => S.screen) !== 'final') add('«Картина»: «Назад» did not return to the final screen');
    }
    // «Мой удел в Торе» from the menu: three scrolls — the verse of משה, «Айом-йом» and the portion of 14.03.2012
    // (Shabbat 17.03.2012 = Vayakhel-Pekudei), and the sheet with all three
    await page.click('#menubtn'); await page.click('[data-m="mine"]'); await page.click('[data-m="lot"]');
    await page.waitForFunction(() => document.querySelector('#lot-parsha .pasuk-name') && document.querySelector('#lot-hayom .hy-v') && document.querySelector('#lot-verse .pasuk-v'), null, {timeout: 8000}).catch(() => {});
    const lot = await page.evaluate(() => ({screen: S.screen, step: S.lotStep, parsha: (document.querySelector('#lot-parsha') || {}).innerText || '', names: tl('parsha.names'),
      sheet: !!document.querySelector('#lotsheet img'), text: document.querySelector('#stage').innerText}));
    if (lot.screen !== 'lot' || lot.step) add(`«Мой удел»: screen "${lot.screen}", step "${lot.step}" instead of the three scrolls`);
    if (!lot.parsha.includes('ויקהל') || !lot.parsha.includes(lot.names[21]) || !lot.parsha.includes(lot.names[22])) add('«Мой удел»: the portion of 14.03.2012 is not Vayakhel-Pekudei: ' + lot.parsha.slice(0, 120));
    if (!lot.sheet) add('«Мой удел»: the sheet with the three scrolls did not draw');
    for (const p of textProblems(lot.text, sc.lang)) add(`[lot] ${p}`);
    await snap('lot');
    await page.click('#lotback');
    if (await page.evaluate(() => S.screen) !== 'final') add('«Мой удел»: «Назад» did not return to the final screen');
    // the certificate itself stays as it was; the verse and «Айом-йом» go to the second, personal page
    if (!(await page.evaluate(async () => { const u = await drawPersonalSheet(); return !!u && u.length > 1000 && !!(await personalHayom()) && !!(await personalVerse()); }))) add('the personal page (verse and «Айом-йом») did not draw');
    // final → «Назад» → map, and the map's «Назад» → title (no «Назад» there)
    await page.click('#stepback');
    if (await page.evaluate(() => S.screen) !== 'map') add('«Назад» on the final screen did not open the map');
    await page.click('#stepback');
    if (await page.evaluate(() => S.screen) !== 'title' || await page.evaluate(() => !document.querySelector('#backbar').hidden)) add('«Назад» on the map did not open the title screen, or the title has a «Назад» button');
    // the phone's «back» on the title screen asks before leaving; «Остаться» keeps the game open
    await page.goBack();
    if (!(await page.waitForSelector('#exitq', {timeout: 2000}).catch(() => null))) add('system «back» on the title screen left without asking');
    else {
      await page.click('#exstay');
      if (await page.$('#exitq') || await page.evaluate(() => S.screen) !== 'title' || !(await page.evaluate(() => history.state && history.state.koelet))) add('«Остаться» in the exit question did not keep the game');
    }
  }
  // «Вход для админов» on the title (one scenario per language): a GitHub key signs in, the upload screen is the verse
  // screen, a tap on a verse shows the upload button; the picture and gallery/verses.json go to the repository (mocked)
  if (sc.age === 't' && await page.evaluate(() => S.screen) === 'title') {
    adminOn = true;
    // the title has no admin button for players: the way in is at the bottom of «О приложении»
    if (await page.$('#admbtn')) add('admin: the sign-in button is on the title screen for everyone');
    await page.click('#aboutbtn'); await page.click('#admabout');
    await page.fill('#admtok', 'github_pat_readonly');
    await page.click('#admgo');
    await page.waitForFunction(t => (document.querySelector('#admmsg') || {}).textContent === t, await page.evaluate(() => t('adm.noRights')), {timeout: 5000}).catch(() => add('admin: a read-only key was let in (or no hint about Contents: Read and write)'));
    if (await page.evaluate(() => isAdmin())) add('admin: a read-only key was let in');
    await page.fill('#admtok', 'github_pat_test');
    await page.click('#admgo');
    await page.waitForFunction(() => S.screen === 'admin', null, {timeout: 5000}).catch(() => add('admin: sign-in did not open the upload screen'));
    const adm = await page.evaluate(() => ({key: (JSON.parse(localStorage.getItem('koelet-admin') || '{}')).token, inGame: localStorage.getItem(KEY).includes('github_pat')}));
    if (adm.key !== 'github_pat_test' || adm.inGame) add('admin: the key must be kept in koelet-admin only, never in the saved game');
    await page.evaluate(() => { const i = document.querySelector('#hebname'); i.value = 'משה'; i.dispatchEvent(new Event('input')); });
    await page.waitForSelector('#pares [data-v]', {timeout: 5000}).catch(() => {});
    await page.click('#pares [data-v] blockquote');
    await page.waitForSelector('.adm-up input[type=file]', {state: 'attached', timeout: 3000}).catch(() => add('admin: no upload button after a tap on the verse'));
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==', 'base64');
    await page.setInputFiles('.adm-up input[type=file]', {name: 'art.png', mimeType: 'image/png', buffer: png}).catch(() => {});
    await page.waitForFunction(t => (document.querySelector('.adm-st') || {}).textContent === t, await page.evaluate(() => t('adm.done')), {timeout: 5000}).catch(() => add('admin: upload did not finish: ' + gh.map(x => x.m + ' ' + x.path).join(', ')));
    const puts = gh.filter(x => x.m === 'PUT');
    const img = puts.find(x => /\/contents\/gallery\/v-\d+-\d+-\d+-\w+\.png$/.test(x.path)), list = puts.find(x => x.path.endsWith('/contents/gallery/verses.json'));
    let map = {}; try { map = JSON.parse(Buffer.from(JSON.parse(list.body).content, 'base64').toString('utf8')); } catch (e) {}
    const key = img && img.path.match(/v-(\d+-\d+-\d+)-/)[1];
    if (!img || !list || !(map[key] || []).some(f => img.path.endsWith(f))) add('admin: the picture or its line in gallery/verses.json was not sent');
    if (await page.evaluate(() => (document.querySelector('#stage').innerText.match(/\badm\.\w+/) || [''])[0])) add('admin: raw locale key on the screen');
    await page.click('#admout');
    if (await page.evaluate(() => isAdmin() || !!localStorage.getItem('koelet-admin') || S.screen !== 'title')) add('admin: «Выйти из админки» did not erase the key');
    adminOn = false;
  }
  // the certificate photo lives only for the tab (sessionStorage), never in the saved game
  const ph = await page.evaluate(() => { S.photo = 'data:image/jpeg;base64,AAAA'; save();
    const ok = !localStorage.getItem(KEY).includes('photo') && sessionStorage.getItem(PHOTO_KEY) === S.photo;
    delete S.photo; save(); return ok && !sessionStorage.getItem(PHOTO_KEY); });
  if (!ph) add('the certificate photo is kept in localStorage (or not cleared from sessionStorage)');
  // inside someone else's iframe the game hides itself and reopens as the whole page (clickjacking guard, frame-guard.js)
  const url = page.url().replace(/[?#].*$/, ''); framing = true;
  await page.setContent(`<iframe src="${url}"></iframe>`).catch(() => {});
  let unframed = false;
  for (let k = 0; k < 40 && !unframed; k++) {
    unframed = await page.evaluate(() => !document.querySelector('iframe') && typeof S === 'object').catch(() => false);
    if (!unframed) await page.waitForTimeout(250);
  }
  if (!unframed) add('the game stays inside a foreign iframe');
  await ctx.close();
  return {name, steps, problems: [...problems]};
}

const server = await startServer(0);
const base = `http://127.0.0.1:${server.address().port}/`;
if (shotsDir) await mkdir(shotsDir, {recursive: true});
const launch = {headless: !headed};
if (!existsSync(chromium.executablePath()) && existsSync('/opt/pw-browsers/chromium')) launch.executablePath = '/opt/pw-browsers/chromium';
const browser = await chromium.launch(launch);
let failed = 0;
try {
  const results = await Promise.all(scenarios.map(sc => run(browser, base, sc).catch(e => ({name: `${sc.lang}-${sc.age}-${sc.g}`, steps: 0, problems: ['crashed: ' + e.message]}))));
  for (const r of results) {
    if (r.problems.length) { failed++; console.log(`✗ ${r.name} (${r.steps} steps)\n    ` + r.problems.join('\n    ')); }
    else console.log(`✓ ${r.name} — ${r.steps} steps, all 7 worlds, certificate, music and voice`);
  }
} finally { await browser.close(); server.close(); }
if (shotsDir) console.log(`Screenshots: ${shotsDir}`);
process.exit(failed ? 1 : 0);
