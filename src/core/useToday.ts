import { useEffect, useState } from 'react';
import type { TodayStudy } from './todayStudy';
import type { Pace } from './courses';

/**
 * «Сегодня» (src/core/todayStudy.ts) for a component: the marks at once, then the reading times. The module and the cycle's
 * data load only here — not in the main bundle. `pace` — of the Prophets and Writings (src/core/courses.ts). `active` false — nothing is loaded (the menu while it is closed).
 */
export function useToday(locale: string, active = true, pace: Pace = 'cycle'): TodayStudy | null {
  const [today, setToday] = useState<TodayStudy | null>(null);
  useEffect(() => {
    if (!active) return;
    let live = true;
    import('./todayStudy').then(async (m) => {
      const base = m.todayStudy(locale, pace);
      if (!live) return;
      setToday(base);
      const full = await m.withMinutes(base, locale);
      if (live) setToday(full);
    });
    return () => {
      live = false;
    };
  }, [locale, active, pace]);
  return today;
}
