import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LOCALE, FALLBACK_LOCALE, LOCALES, isLocale, type Locale } from './config';
import ru, { type MessageKey, type Messages, type PluralForms } from './locales/ru';
import en from './locales/en';
import de from './locales/de';

export { LOCALES, FALLBACK_LOCALE, isLocale, type Locale };

const MESSAGES: Record<Locale, Messages> = { ru, en, de };
const STORAGE_KEY = 'niflaot:lang';

type Vars = Record<string, string | number>;

const interpolate = (s: string, vars?: Vars) =>
  vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;

function detectLocale(): Locale {
  try {
    const q = new URLSearchParams(location.search).get('lang');
    if (isLocale(q)) return q;
  } catch {}
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLocale(saved)) return saved;
  } catch {}
  for (const l of navigator.languages ?? [navigator.language]) {
    const code = l?.slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  // a browser in another language: English
  return DEFAULT_LOCALE;
}

interface I18n {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** Translate a UI key. Pass `n` in vars to select a plural form. */
  t: (key: MessageKey, vars?: Vars) => string;
  /** Pick a value from a per-locale map, falling back to FALLBACK_LOCALE. */
  pick: <T>(map: Partial<Record<Locale, T>>) => { value: T; locale: Locale };
}

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = LOCALES[locale].dir;
  }, [locale]);

  const value = useMemo<I18n>(() => {
    const plural = new Intl.PluralRules(locale);
    const t: I18n['t'] = (key, vars) => {
      const msg = MESSAGES[locale][key] ?? MESSAGES[FALLBACK_LOCALE][key] ?? key;
      if (typeof msg === 'string') return interpolate(msg, vars);
      const forms = msg as PluralForms;
      const n = Number(vars?.n ?? 0);
      return interpolate(forms[plural.select(n)] ?? forms.other, vars);
    };
    const pick: I18n['pick'] = (map) => {
      const own = map[locale];
      if (own !== undefined) return { value: own, locale };
      const fb = map[FALLBACK_LOCALE] ?? Object.values(map)[0];
      if (fb === undefined) throw new Error('pick(): empty locale map');
      return { value: fb as never, locale: map[FALLBACK_LOCALE] !== undefined ? FALLBACK_LOCALE : (Object.keys(map)[0] as Locale) };
    };
    return { locale, setLocale, t, pick };
  }, [locale, setLocale]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}

/** Renders a trusted, static translation string that contains inline HTML. */
export function Html({ html, as: Tag = 'span', className }: { html: string; as?: 'span' | 'div' | 'p' | 'h1' | 'h3' | 'li'; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
