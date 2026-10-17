/**
 * An allowlist sanitizer for the inline HTML of texts edited on the site (`#/admin` drafts and
 * `src/content/overrides.json`): those go into the page through `dangerouslySetInnerHTML`, so only the tags
 * and attributes the lesson and UI texts really use survive; everything else — `<script>`, `<iframe>`,
 * `on…=` handlers, `style`, `javascript:` / `data:` links — is dropped. Works on the string (no DOM), so the
 * prerender and `npm run check` run it too. The texts of the source files are trusted and don't pass through it.
 */

const TAGS = new Set([
  'p', 'b', 'i', 'em', 'strong', 'u', 's', 'span', 'bdi', 'sup', 'sub', 'small', 'br', 'code',
  'ul', 'ol', 'li', 'h3', 'h4', 'a',
]);
const VOID = new Set(['br']);
/** tags whose content goes too, not only the tag */
const DROP_WITH_CONTENT = new Set(['script', 'style', 'iframe', 'object', 'embed', 'template', 'noscript', 'textarea', 'title', 'svg', 'math']);
const ATTRS = new Set(['class', 'dir', 'lang', 'id', 'title', 'role', 'tabindex', 'href', 'target', 'rel', 'translate']);
const DATA_OR_ARIA = /^(data|aria)-[a-z][a-z0-9-]*$/;

const esc = (s: string) => s.replace(/&(?![a-zA-Z]+;|#\d+;|#x[0-9a-fA-F]+;)/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Links: in-site (`#/…`, `/…`, relative), https, http and mailto only. */
export function safeHref(v: string): boolean {
  // what the browser ignores when it reads a scheme: control characters and whitespace
  const s = v.replace(/[\u0000- \u007f-\u009f]/g, '').toLowerCase();
  const scheme = /^([a-z][a-z0-9+.-]*):/.exec(s);
  return !scheme || ['https', 'http', 'mailto'].includes(scheme[1]);
}

const decode = (s: string) =>
  s
    .replace(/&#x([0-9a-f]+);?/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);?/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&colon;/gi, ':')
    .replace(/&tab;/gi, '\t')
    .replace(/&newline;/gi, '\n')
    .replace(/&amp;/gi, '&');

function attrs(src: string): string {
  let out = '';
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const m of src.matchAll(re)) {
    const name = m[1].toLowerCase();
    if (!ATTRS.has(name) && !DATA_OR_ARIA.test(name)) continue;
    const value = m[2] ?? m[3] ?? m[4] ?? '';
    if (name === 'href' && !safeHref(decode(value))) continue;
    out += ` ${name}="${esc(decode(value))}"`;
  }
  return out;
}

export function sanitizeHtml(html: string): string {
  let out = '';
  let skip: string | null = null;
  const re = /<!--[\s\S]*?(?:-->|$)|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|<|>/g;
  let last = 0;
  for (const m of html.matchAll(re)) {
    const text = html.slice(last, m.index);
    last = m.index! + m[0].length;
    if (!skip) out += text;
    const [all, close, rawTag, rest] = m;
    if (!rawTag) {
      // a comment, a lone "<" or ">": comments go, the signs stay as text
      if (!skip && (all === '<' || all === '>')) out += all === '<' ? '&lt;' : '&gt;';
      continue;
    }
    const tag = rawTag.toLowerCase();
    if (skip) {
      if (close && tag === skip) skip = null;
      continue;
    }
    if (DROP_WITH_CONTENT.has(tag)) {
      if (!close && !/\/\s*$/.test(rest)) skip = tag;
      continue;
    }
    if (!TAGS.has(tag)) continue;
    if (close) out += VOID.has(tag) ? '' : `</${tag}>`;
    else out += `<${tag}${attrs(rest)}>`;
  }
  if (!skip) out += html.slice(last);
  return out;
}
