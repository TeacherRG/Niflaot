/**
 * «Слушать» — reads a page block aloud with the browser's speech synthesis (Web Speech API), block by block:
 * headings, paragraphs, list items and equations, in order. Text in Hebrew (`lang="he"`) is read by a Hebrew voice
 * when the device has one, otherwise skipped (its translation is next to it). Decorative parts (`aria-hidden`) are skipped.
 */
export const canSpeak = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

const BCP47: Record<string, string> = { ru: 'ru-RU', en: 'en-US', de: 'de-DE', he: 'he-IL' };
const BLOCKS = 'h1, h2, h3, h4, p, li, .q, .read-ans, .eq, .fact-he, .fact-a, .poem-verse';

/** The blocks of `root` to read, outermost only, visible and with text. */
export function speechBlocks(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(BLOCKS)].filter(
    (el) => !el.closest('[aria-hidden="true"], .no-speak') && !el.parentElement?.closest(BLOCKS) && el.textContent!.trim(),
  );
}

/** Runs of one language inside a block: [lang, text]. */
export function speechRuns(block: HTMLElement, pageLang: string): [string, string][] {
  const runs: [string, string][] = [];
  const walk = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    const el = n.parentElement!;
    if (el.closest('[aria-hidden="true"], .no-speak, sup')) continue;
    const lang = (el.closest('[lang]')?.getAttribute('lang') ?? pageLang).slice(0, 2);
    const text = n.textContent!.replace(/\s+/g, ' ');
    if (!text.trim()) {
      if (runs.length) runs[runs.length - 1][1] += ' ';
      continue;
    }
    if (runs.length && runs[runs.length - 1][0] === lang) runs[runs.length - 1][1] += text;
    else runs.push([lang, text]);
  }
  // a run of bare punctuation («?», «,») is not read on its own
  return runs.map(([l, t]) => [l, t.trim()] as [string, string]).filter(([, t]) => /[\p{L}\p{N}]/u.test(t));
}

const voiceFor = (lang: string) => speechSynthesis.getVoices().find((v) => v.lang.replace('_', '-').toLowerCase().startsWith(lang));

/**
 * Speaks `blocks` from `from`; `onBlock(i)` before each block, `onEnd()` after the last one or on stop.
 * Returns a stop function.
 */
export function speak(blocks: HTMLElement[], pageLang: string, onBlock: (i: number) => void, onEnd: () => void, from = 0) {
  speechSynthesis.cancel();
  let stopped = false;
  const he = voiceFor('he');
  const next = (i: number) => {
    if (stopped) return;
    if (i >= blocks.length) return onEnd();
    const runs = speechRuns(blocks[i], pageLang).filter(([l]) => l !== 'he' || he);
    if (!runs.length) return next(i + 1);
    onBlock(i);
    runs.forEach(([l, text], k) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = BCP47[l] ?? l;
      const v = l === 'he' ? he : voiceFor(l);
      if (v) u.voice = v;
      if (k === runs.length - 1) u.onend = () => next(i + 1);
      u.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled' && k === runs.length - 1) next(i + 1);
      };
      speechSynthesis.speak(u);
    });
  };
  next(from);
  return () => {
    stopped = true;
    speechSynthesis.cancel();
    onEnd();
  };
}
