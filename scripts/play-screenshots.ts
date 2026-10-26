/**
 * Google Play: phone screenshots of the app for the listing — store/play/<ru|en|de>/NN-<name>.png, 1080×1920 (9:16; the
 * site at 360×640 px, ×3). The pages of the built site (`npm run build` first), the same in both modes; the feature graphic
 * is drawn by scripts/og-images.ts.
 *
 *   npm run build && npm i --no-save playwright && npx tsx scripts/play-screenshots.ts [--site http://localhost:4173]
 *
 * Without --site it starts `vite preview` itself. The visit counter is blocked; the onboarding and «Как играть» are
 * answered in localStorage, so every shot shows the page itself.
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const arg = (name: string) => {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : undefined;
};

const SHOTS: { name: string; mode: 'kids' | 'adults'; route: string }[] = [
  { name: 'kids-home', mode: 'kids', route: '' },
  { name: 'riddle', mode: 'kids', route: 'baal-haturim-vayera/r/1' },
  { name: 'memo', mode: 'kids', route: 'baal-haturim-vayera/memo' },
  { name: 'lashon', mode: 'kids', route: 'lashon' },
  { name: 'adults-home', mode: 'adults', route: '' },
  { name: 'neviim', mode: 'adults', route: 'neviim' },
  { name: 'nigun', mode: 'adults', route: 'nigun/anim-zmirot' },
  { name: 'academy', mode: 'adults', route: 'academy' },
];

let site = arg('--site');
let preview: ReturnType<typeof spawn> | undefined;
if (!site) {
  preview = spawn('node_modules/.bin/vite', ['preview', '--port', '4173', '--strictPort'], { stdio: ['ignore', 'pipe', 'inherit'] });
  site = await new Promise<string>((ok, fail) => {
    const timer = setTimeout(() => fail(new Error('vite preview did not start')), 30_000);
    preview!.stdout!.on('data', (d: Buffer) => {
      const m = /http:\/\/localhost:\d+/.exec(String(d));
      if (m) {
        clearTimeout(timer);
        ok(m[0]);
      }
    });
  });
}

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
try {
  for (const lang of ['ru', 'en', 'de'] as const) {
    const dir = `store/play/${lang}`;
    mkdirSync(dir, { recursive: true });
    for (const [i, shot] of SHOTS.entries()) {
      const ctx = await browser.newContext({ viewport: { width: 360, height: 640 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: lang });
      await ctx.route(/goatcounter/, (r) => r.abort());
      await ctx.addInitScript(
        ([lang, mode]) => {
          localStorage.setItem('niflaot:lang', lang);
          localStorage.setItem('niflaot:mode', mode);
          localStorage.setItem('niflaot:hebrew', 'letters');
          localStorage.setItem('niflaot:help-seen', '1');
          localStorage.setItem('niflaot:offer-hidden', String(Date.now()));
        },
        [lang, shot.mode],
      );
      const page = await ctx.newPage();
      await page.goto(`${site}/?lang=${lang}#/${shot.route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(800);
      const path = `${dir}/${String(i + 1).padStart(2, '0')}-${shot.name}.png`;
      await page.screenshot({ path });
      console.log(path);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  preview?.kill();
}
process.exit(0);
