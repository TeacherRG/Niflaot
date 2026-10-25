/**
 * A calculation paragraph of a lesson section — it opens with a Hebrew word and «= число»
 * (`<p><span class="he">וירא</span> = 6 + 10 + 200 + 1 = 217; …</p>`) — gets the class `calc`,
 * and every calculation of it (after «; » or a full stop) of it its own line: on screen they read as a worked sum, not as prose.
 */
export function markCalcs(html: string): string {
  return html.replace(/<p>(<span class="he">[^<]*<\/span> = \d[\s\S]*?)<\/p>/g, (_, body: string) => {
    const lines = body.split(/; (?=<span class="he">|\d)|(?<=\.) (?=<span class="he">[^<]*<\/span> = )/);
    return `<p class="calc">${lines.map((l) => `<span class="calc-line">${l}</span>`).join('')}</p>`;
  });
}
