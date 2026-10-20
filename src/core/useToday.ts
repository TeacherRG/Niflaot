import { useEffect, useState } from 'react';
import type { TodayStudy } from './todayStudy';

/**
 * «Сегодня» (src/core/todayStudy.ts) for a component: the marks at once, then the reading times. The module and the cycle's
 * data load only here — not in the main bundle. `active` false — nothing is loaded (the menu while it is closed).
 */
export function useToday(locale: string, active = true): TodayStudy | null {
  const [today, setToday] = useState<TodayStudy | null>(null);
  useEffect(() => {
    if (!active) return;
    let live = true;
    import('./todayStudy').then(async (m) => {
      const base = m.todayStudy(locale);
      if (!live) return;
      setToday(base);
      const full = await m.withMinutes(base, locale);
      if (live) setToday(full);
    });
    return () => {
      live = false;
    };
  }, [locale, active]);
  return today;
}
