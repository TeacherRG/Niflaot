import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CONTENT_OF, DEFAULT_LOCALE, FALLBACK_LOCALE, LOCALES, UI_LOCALES, isLocale, isUiLocale, type Locale, type UiLocale } from './config';
import ru, { type MessageKey, type Messages, type PluralForms } from './locales/ru';
import en from './locales/en';
import de from './locales/de';
import he from './locales/he';
import { STATIC_PAGES } from '../core/site';
import { setUiLang } from './uiLang';
import { pushLanguage } from '../core/push';

export { LOCALES, UI_LOCALES, FALLBACK_LOCALE, isLocale, isUiLocale, type Locale, type UiLocale };

const MESSAGES: Record<UiLocale, Partial<Messages>> = { ru, en, de, he };
/** Where a missing string comes from: Hebrew — English, the rest — Russian (texts are written in Russian first). */
const UI_FALLBACK: Record<UiLocale, UiLocale[]> = { ru: [], en: ['ru'], de: ['ru'], he: ['en', 'ru'] };
const STORAGE_KEY = 'niflaot:lang';

type Vars = Record<string, string | number>;

const interpolate = (s: string, vars?: Vars) =>
  vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;

function detectLocale(): UiLocale {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (isUiLocale(q)) return q;
    // the static pages of other languages: /en/mental-math/, /de/daily/
    const dir = location.pathname.split('/').filter(Boolean)[0];
    if (isLocale(dir)) return dir;
    // …and their Russian versions at the root (/daily/, /letters/): hreflang promises Russian there
    if (dir && dir in STATIC_PAGES) return 'ru';
  } catch {}
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isUiLocale(saved)) return saved;
  } catch {}
  for (const l of navigator.languages ?? [navigator.language]) {
    let code = l?.slice(0, 2).toLowerCase();
    if (code === 'iw') code = 'he';
    if (isUiLocale(code)) return code;
  }
  // a browser in another language: English
  return DEFAULT_LOCALE;
}

interface I18n {
  /** The content language: lessons, translations, transliteration (Hebrew interface — English content). */
  locale: Locale;
  /** The interface language (ru, en, de or he). */
  ui: UiLocale;
  setLocale: (l: UiLocale) => void;
  /** Translate a UI key. Pass `n` in vars to select a plural form. */
  t: (key: MessageKey, vars?: Vars) => string;
  /** Pick a value from a per-locale map, falling back to FALLBACK_LOCALE. */
  pick: <T>(map: Partial<Record<Locale, T>>) => { value: T; locale: Locale };
}

const Ctx = createContext<I18n | null>(null);

export { uiLang } from './uiLang';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [ui, setLocaleState] = useState<UiLocale>(detectLocale);
  const locale = CONTENT_OF[ui];
  setUiLang(ui);

  const setLocale = useCallback((l: UiLocale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = ui;
    document.documentElement.dir = UI_LOCALES[ui].dir;
    // «install on the phone»: the app's name and shortcuts in the same language (manifests — scripts/prerender.ts)
    // the daily reminder in the same language (src/core/push.ts)
    pushLanguage(locale);
    document.querySelector('link[rel="manifest"]')?.setAttribute('href', `/manifest${locale === 'ru' ? '' : `-${locale}`}.webmanifest`);
    // the language goes into the address (?lang=ru): the browser's «listen to this page» and a shared link open the
    // page anew, without this browser's settings — and must get it in the same language
    try {
      const url = new URL(location.href);
      if (url.searchParams.get('lang') !== ui) {
        url.searchParams.set('lang', ui);
        history.replaceState(history.state, '', url);
      }
    } catch {}
  }, [ui, locale]);

  const value = useMemo<I18n>(() => {
    const chain = [ui, ...UI_FALLBACK[ui]];
    const t: I18n['t'] = (key, vars) => {
      let msg: string | PluralForms | undefined;
      let from: UiLocale = ui;
      for (const l of chain) {
        msg = MESSAGES[l][key];
        if (msg !== undefined) {
          from = l;
          break;
        }
      }
      if (msg === undefined) return key;
      if (typeof msg === 'string') return interpolate(msg, vars);
      const forms = msg as PluralForms;
      const n = Number(vars?.n ?? 0);
      return interpolate(forms[new Intl.PluralRules(from).select(n)] ?? forms.other, vars);
    };
    const pick: I18n['pick'] = (map) => {
      const own = map[locale];
      if (own !== undefined) return { value: own, locale };
      const fb = map[FALLBACK_LOCALE] ?? Object.values(map)[0];
      if (fb === undefined) throw new Error('pick(): empty locale map');
      return { value: fb as never, locale: map[FALLBACK_LOCALE] !== undefined ? FALLBACK_LOCALE : (Object.keys(map)[0] as Locale) };
    };
    return { locale, ui, setLocale, t, pick };
  }, [locale, ui, setLocale]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}

/** Renders a trusted, static translation string that contains inline HTML. */
export function Html({ html, as: Tag = 'span', className }: { html: string; as?: 'span' | 'div' | 'p' | 'h1' | 'h3' | 'li' | 'main'; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
