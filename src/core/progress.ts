/** How many riddles of a lesson are solved on this device (the lesson state in localStorage; the old key once). */
export function lessonProgress(slug: string, legacy?: string): number {
  for (const key of [`niflaot:lesson:${slug}`, legacy]) {
    if (!key) continue;
    try {
      const s = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (s && Array.isArray(s.done)) return s.done.length;
    } catch {}
  }
  return 0;
}

/** The best points of a lesson on this device (0 when not played) — for the certificates of «Академия». */
export function lessonScore(slug: string, legacy?: string): number {
  for (const key of [`niflaot:lesson:${slug}`, legacy]) {
    if (!key) continue;
    try {
      const s = JSON.parse(localStorage.getItem(key) ?? 'null');
      // «Начать заново» keeps the best earlier score
      if (s && Number.isFinite(s.score)) return Math.max(s.score, Number.isFinite(s.best) ? s.best : 0);
    } catch {}
  }
  return 0;
}
