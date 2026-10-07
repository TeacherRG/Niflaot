/**
 * Footnotes: lesson texts mark a source with <sup data-src="ID"></sup> right after the quote.
 * The marks are numbered in reading order (condition → solution → lesson sections) and become
 * small superscript links to the riddle's "Primary sources"; every source gets back-links (↩).
 */
const MARK = /<sup data-src="([^"]+)"><\/sup>/g;

export const stripFootnotes = (html: string) => html.replace(MARK, '');

export interface Footnotes {
  /** html blocks with numbered links, in the same order as given */
  html: string[];
  /** source id → footnote number */
  number: Record<string, number>;
  /** source id → ids of its reference marks in the text (for ↩ links) */
  refs: Record<string, string[]>;
  /** riddle's sources sorted by footnote number (unreferenced ones last) */
  ordered: string[];
}

export function footnotes(blocks: string[], sources: string[], ri: number, label: string): Footnotes {
  const number: Record<string, number> = {};
  const refs: Record<string, string[]> = {};
  let next = 1;
  const html = blocks.map((b) =>
    b.replace(MARK, (_, id: string) => {
      if (!sources.includes(id)) return '';
      number[id] ??= next++;
      const refId = `fnref-${ri}-${id}-${(refs[id] ??= []).length + 1}`;
      refs[id].push(refId);
      const n = number[id];
      return `<sup class="fn"><a role="button" tabindex="0" id="${refId}" data-fn="${id}" data-ri="${ri}" aria-label="${label} ${n}">${n}</a></sup>`;
    }),
  );
  const ordered = [...sources].sort((a, b) => (number[a] ?? 1e9) - (number[b] ?? 1e9));
  return { html, number, refs, ordered };
}

const flash = (el: Element) => {
  el.classList.remove('fn-flash');
  void (el as HTMLElement).offsetWidth;
  el.classList.add('fn-flash');
};

const openAncestors = (el: Element) => {
  for (let d = el.closest('details'); d; d = d.parentElement?.closest('details') ?? null) d.open = true;
};

const scrollTo = (el: Element, block: ScrollLogicalPosition) =>
  requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block }));

/** Global handler: footnote number → its source (opened); ↩ → back to the place in the text. */
export function installFootnoteNavigation() {
  const go = (target: HTMLElement | null) => {
    const ref = target?.closest('[data-fn]') as HTMLElement | null;
    if (ref) {
      const box = document.getElementById(`src-${ref.dataset.ri}-${ref.dataset.fn}`) as HTMLDetailsElement | null;
      if (!box) return false;
      openAncestors(box);
      box.open = true;
      scrollTo(box, 'start');
      flash(box);
      return true;
    }
    const back = target?.closest('[data-back]') as HTMLElement | null;
    if (back) {
      const el = document.getElementById(back.dataset.back!);
      if (!el) return false;
      openAncestors(el);
      scrollTo(el, 'center');
      flash(el);
      return true;
    }
    return false;
  };
  const onClick = (e: MouseEvent) => {
    if (go(e.target as HTMLElement)) e.preventDefault();
  };
  const onKey = (e: KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && go(e.target as HTMLElement)) e.preventDefault();
  };
  addEventListener('click', onClick);
  addEventListener('keydown', onKey);
  return () => {
    removeEventListener('click', onClick);
    removeEventListener('keydown', onKey);
  };
}
