/**
 * Language markup for the browser's own tools — page translation, reading mode, «read aloud»:
 * every piece of Hebrew (`.he`, `.heb`, `[lang="he"]`) gets `lang="he"` and `translate="no"`.
 * The Torah words always come with the project's translation next to them, so a machine translation must not
 * touch them (nor the Names of G-d), and a voice reads them as Hebrew. The page language itself is
 * `<html lang>` (set by the i18n provider); a lesson shown in a fallback language marks its own block.
 */
const HEBREW = '.he, .heb, [lang="he"]';

function mark(el: Element) {
  if (!el.getAttribute('lang')) el.setAttribute('lang', 'he');
  if (el.getAttribute('translate') !== 'no') el.setAttribute('translate', 'no');
}

/** Marks the Hebrew inside `root` (and `root` itself). */
export function markHebrew(root: ParentNode) {
  if (root instanceof Element && root.matches(HEBREW)) mark(root);
  root.querySelectorAll(HEBREW).forEach(mark);
}

/** Keeps the Hebrew of the whole page marked as React renders it. */
export function installLangMarkup() {
  markHebrew(document.body);
  const mo = new MutationObserver((records) => {
    for (const r of records)
      if (r.type === 'childList') r.addedNodes.forEach((n) => n instanceof Element && markHebrew(n));
      else if (r.target instanceof Element && r.target.matches(HEBREW)) mark(r.target);
  });
  mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  return () => mo.disconnect();
}

/** The same for an HTML string (static pages written by scripts/prerender.ts). */
export const markHebrewHtml = (html: string) =>
  html.replace(/<([a-z][a-z0-9]*)(\s[^>]*)?>/g, (tag, name: string, attrs = '') => {
    const hebrew = /\sclass="(?:he|heb)(?:\s[^"]*)?"/.test(attrs) || /\slang="he"/.test(attrs);
    if (!hebrew) return tag;
    const add = `${/\slang=/.test(attrs) ? '' : ' lang="he"'}${/\stranslate=/.test(attrs) ? '' : ' translate="no"'}`;
    return `<${name}${attrs}${add}>`;
  });
