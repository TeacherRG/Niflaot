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
