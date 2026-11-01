/**
 * «Всё бесплатно» (`#/free`, `FreePage.tsx`; для поиска — `/free/`, `freePage` в scripts/prerender.ts): что даёт Нифлаот без
 * подписки. Один список для приложения и для статической страницы; тексты — `free.<id>.h` / `free.<id>.p` (ru/en/de).
 * Конкурентов не называем — только наше.
 */
export const FREE_FEATURES = [
  { id: 'tanakh', href: '#/neviim', he: 'נ״ך' },
  { id: 'words', href: '#/words', he: 'מִלִּים' },
  { id: 'teacher', href: '#/teacher', he: 'מוֹרֶה' },
  { id: 'notes', href: '#/bookmarks', he: 'סִימָן' },
  { id: 'torah', href: '#/', he: 'תּוֹרָה' },
  { id: 'hemshech', href: '#/hemshech', he: 'חֲסִידוּת' },
  { id: 'lashon', href: '#/lashon', he: 'לָשׁוֹן' },
  { id: 'reading', href: '#/reading', he: 'תְּהִלִּים' },
  { id: 'academy', href: '#/academy', he: 'תְּעוּדָה' },
  { id: 'family', href: '#/quiz', he: 'מִשְׁפָּחָה' },
  { id: 'everywhere', href: '#/account', he: 'תָּמִיד' },
] as const;
export type FreeId = (typeof FREE_FEATURES)[number]['id'];
