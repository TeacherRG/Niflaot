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

/** What «Моё обучение» shows of a lesson played on this device; null — not opened yet. */
export interface LessonSummary {
  /** riddles solved (0-based indices) */
  done: number[];
  score: number;
  /** the best score, «Начать заново» included */
  best: number;
  /** the player's notes (the question to oneself), by riddle */
  notes: Record<number, string>;
}

export function lessonSummary(slug: string, legacy?: string): LessonSummary | null {
  for (const key of [`niflaot:lesson:${slug}`, legacy]) {
    if (!key) continue;
    try {
      const s = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (!s || !Array.isArray(s.done)) continue;
      const score = Number.isFinite(s.score) ? s.score : 0;
      return {
        done: s.done.filter((x: unknown) => Number.isInteger(x)),
        score,
        best: Math.max(score, Number.isFinite(s.best) ? s.best : 0),
        notes: s.notes && typeof s.notes === 'object' ? s.notes : {},
      };
    } catch {}
  }
  return null;
}
