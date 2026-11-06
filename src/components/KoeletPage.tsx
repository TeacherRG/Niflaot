import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { TopBar } from './TopBar';
import { AddCourse } from './AddCourse';
import { markStudied } from '../core/habit';
import { KOELET_KEY, readKoelet } from '../core/koelet';

/** the game's own language (koelet/i18n.js): Ukrainian, chosen inside the game, stays — the site has no Ukrainian */
const gameLang = (locale: string) => {
  try {
    if (localStorage.getItem('koelet-lang') === 'uk') return 'uk';
  } catch {}
  return locale;
};

/**
 * `#/koelet` — «Тайна Коэлета», a course of the academy: the adventure on the Book of Kohelet (koelet/ — plain HTML/JS with
 * its own tests, served at /koelet/) inside the site, in an <iframe> of the same address under the top bar — so the menu,
 * the Shabbat rest, «Мои курсы» and the habit work as on every page. The game keeps its progress in this browser
 * (`koelet-game-v1`, read by src/core/koelet.ts); a step done there counts as a day of study. No tab bar and no floating
 * buttons here: the game has its own «Назад» at the bottom and its own guide (the Keeper).
 */
export function KoeletPage() {
  const { t, locale } = useI18n();
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    document.title = `${t('koelet.title')} · ${t('app.title')}`;
  }, [t]);
  // the iframe takes the rest of the screen under the top bar; the page itself does not scroll
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('koelet-on');
    const fit = () => {
      const el = frame.current;
      if (el) el.style.height = `${Math.max(320, window.innerHeight - el.getBoundingClientRect().top)}px`;
    };
    fit();
    addEventListener('resize', fit);
    const ro = new ResizeObserver(fit);
    const top = document.querySelector('.top');
    if (top) ro.observe(top);
    return () => {
      html.classList.remove('koelet-on');
      removeEventListener('resize', fit);
      ro.disconnect();
    };
  }, []);
  // a step, a choice, sparks in the game — a day of study (src/core/habit.ts)
  useEffect(() => {
    let sparks = readKoelet()?.sparks ?? 0;
    const on = (e: StorageEvent) => {
      if (e.key !== KOELET_KEY) return;
      const now = readKoelet()?.sparks ?? 0;
      if (now > sparks) markStudied();
      sparks = now;
    };
    addEventListener('storage', on);
    return () => removeEventListener('storage', on);
  }, []);
  return (
    <>
      <TopBar title={t('koelet.title')} />
      <div className="koelet-bar no-print">
        <span>
          <b>{t('koelet.title')}</b> · {t('koelet.kicker')}
        </span>
        <AddCourse course="koelet" />
      </div>
      <iframe
        ref={frame}
        className="koelet-frame"
        key={locale}
        src={`/koelet/?lang=${gameLang(locale)}`}
        title={t('koelet.title')}
        allow="camera; autoplay; fullscreen"
      />
    </>
  );
}
