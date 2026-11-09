/** «Zip — стих Торы» (src/core/zip.ts — not imported: it brings the sources) and «Лоскуты гематрии» (src/core/patches.ts): the storage keys */
export const ZIP_KEY = 'niflaot:zip';
export const PATCHES_KEY = 'niflaot:patches';

/**
 * For the reminder (public/sw.js, ZIP_LINE): the level and the day of the last solved verse; nothing if the game was
 * never played — then the message has no line about it.
 */
export function zipReminder(raw: string | null): { l: number; w: string } | undefined {
  try {
    const x = JSON.parse(raw ?? 'null');
    if (!x || typeof x !== 'object' || !x.d || typeof x.d !== 'object') return undefined;
    const days = Object.values<any>(x.d).map((r) => String(r?.[0] ?? '')).sort();
    if (!days.length) return undefined;
    return { l: Math.min(10, Math.max(1, Math.round(Number(x.l) || 1))), w: days[days.length - 1] };
  } catch {
    return undefined;
  }
}

/** The tile on the adults' home: the level of the next puzzle and whether a verse was solved today (no zip.ts import). */
export function zipTile(raw: string | null, today: string): { l: number; today: boolean } {
  const z = zipReminder(raw);
  if (!z) return { l: 1, today: false };
  return { l: z.l, today: z.w === today };
}

/** The «Игры» tile (Catalog.tsx): the level of the next board of «Лоскуты гематрии» and whether a board was solved today. */
export function patchesTile(raw: string | null, today: string): { l: number; today: boolean; played: boolean } {
  try {
    const x = JSON.parse(raw ?? 'null');
    if (!x || typeof x !== 'object') return { l: 1, today: false, played: false };
    return { l: Math.min(10, Math.max(1, Math.round(Number(x.l) || 1))), today: x.w === today, played: (Number(x.g) || 0) > 0 };
  } catch {
    return { l: 1, today: false, played: false };
  }
}
