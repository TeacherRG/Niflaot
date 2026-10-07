export function formatTime(ms: number) {
  const t = Math.floor(ms / 1000);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = String(t % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
}

/** Copy text, falling back to selecting `el` so the user can copy manually. */
export async function copyText(text: string, el?: Element | null): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    if (el) {
      const r = document.createRange();
      r.selectNodeContents(el);
      const sel = getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
    }
    return false;
  }
}

/** Reading speed for dense lesson text with Hebrew inserts, words per minute. */
const WPM = 130;

/** Average reading time of an HTML text, in seconds. */
export const readingSec = (html: string) => Math.round((html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length / WPM) * 60);

/** «≈ 30 с» under a minute (rounded to 5 s), then minutes in half-minute steps: «≈ 1,5 мин». */
export function formatEstimate(sec: number, locale: string, t: (key: 'est.sec' | 'est.min', vars: { n: string }) => string) {
  if (sec < 60) return t('est.sec', { n: String(Math.max(5, Math.round(sec / 5) * 5)) });
  const min = Math.round(sec / 30) / 2;
  return t('est.min', { n: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(min) });
}
