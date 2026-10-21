/**
 * «Слушать»: what the lessons (src/core/narration.ts) and the passages of the Prophets and Writings
 * (src/core/tanakhNarration.ts) share — the text said aloud in parts (≤ MAX_PART: a part is recorded in one go by
 * the worker assistant/src/tts.ts), the Names said as Chabad says them (`spoken`), never written out, and the address
 * of a part (`partHash`). No heavy imports: the worker bundles this module too.
 */
import { displayNames } from './names';

export type NarrationLang = 'ru' | 'en' | 'de';

/** a new version records everything anew (the way the text is put together changed) */
export const NARRATION_VERSION = 1;
export const MAX_PART = 1200;

export interface NarrationPart {
  /** 16 hex: the part's address at the worker (`/tts/<lang>/<slug>/<h>.wav`) */
  h: string;
  /** what is playing: the chapter's title */
  label: string;
  /** the chapter (0-based) — the page scrolls to `#riddle-<ri + 1>`; absent for the title and the end */
  ri?: number;
  text: string;
}

export interface Narration {
  v: number;
  /** the language it is read in, when not the page's (an untranslated passage of the day — English) */
  lang?: NarrationLang;
  parts: NarrationPart[];
}

const ENTITIES: Record<string, string> = { nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', laquo: '«', raquo: '»', mdash: '—', ndash: '–', hellip: '…' };

/** HTML → paragraphs of plain text */
export function paragraphs(html: string): string[] {
  return html
    .replace(/<sup[^>]*>.*?<\/sup>/g, '')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<\/?(p|div|li|ul|ol|h[1-6]|blockquote|section|tr|table)[^>]*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#\d+|[a-z]+);/g, (m, e: string) => (e[0] === '#' ? String.fromCharCode(Number(e.slice(1))) : (ENTITIES[e] ?? m)))
    .split(/\n+/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/**
 * How the Names are said: in Russian «Всевышний» (by case), in English and German «Hashem» / «Haschem»;
 * ה׳ — «Ашем» / «Hashem». The written forms with a dash would be read letter by letter.
 */
export function spoken(s: string, lang: NarrationLang): string {
  const he = lang === 'ru' ? 'Ашем' : lang === 'de' ? 'Haschem' : 'Hashem';
  s = displayNames(s)
    .replace(/ה׳ צב-אות/g, `${he} ${lang === 'ru' ? 'Цеваот' : lang === 'de' ? 'Zewaot' : 'Tzevaot'}`)
    .replace(/ה׳/g, he)
    .replace(/א-ל(?![א-ת])/g, lang === 'ru' ? 'Кель' : 'Kel')
    // as said in learning: «Адни», «Шакай», «Элока», «Цеваот»
    .replace(/אד-ני|אדנ-י|אדו-ני/g, lang === 'ru' ? 'Адни' : 'Adni')
    .replace(/שד-י|ש-די|שַׁ-דַּי/g, lang === 'ru' ? 'Шакай' : 'Shakai')
    .replace(/אלו-ה|אלו-ק/g, lang === 'ru' ? 'Элока' : 'Eloka')
    .replace(/צב-אות/g, lang === 'ru' ? 'Цеваот' : lang === 'de' ? 'Zewaot' : 'Tzevaot');
  if (lang === 'ru') {
    const cases: Record<string, string> = { '': 'Всевышний', а: 'Всевышнего', у: 'Всевышнему', ом: 'Всевышним', е: 'Всевышнем' };
    return words(s, lang)
      .replace(/Б-г(ом|а|у|е)?(?![а-яё])/g, (_, e = '') => cases[e])
      .replace(/Г-спод(ь|а|у|ом|е|и)(?![а-яё])/g, (_, e: string) => cases[e === 'ь' || e === 'и' ? '' : e])
      .replace(/Б-жий(?![а-яё])/g, 'Всевышнего')
      .replace(/Б-же(?![а-яё])/g, 'Всевышний')
      // an adjective, not a Name: «Б-жественный» — «Божественный»
      .replace(/Б-ж/g, 'Бож');
  }
  if (lang === 'de')
    return words(s, lang)
      .replace(/G-ttes([a-zäöüß]+)/g, (_, w: string) => `Haschems ${w[0].toUpperCase()}${w.slice(1)}`)
      .replace(/G-ttes/g, 'Haschems')
      .replace(/G-ttlich/g, 'Göttlich')
      .replace(/G-tte?(?![a-zäöüß])/g, 'Haschem');
  return words(s, lang)
    .replace(/G-dliness/g, 'Divinity')
    .replace(/G-dly/g, 'divine')
    .replace(/G-d's/g, "Hashem's")
    .replace(/(?:[Tt]he )?L-rd/g, 'Hashem')
    .replace(/G-d/g, 'Hashem');
}

/** «בראשית = 913, 503 + 360» — said in words */
const words = (s: string, lang: NarrationLang) => {
  const w = { ru: ['равно', 'плюс', 'минус'], en: ['equals', 'plus', 'minus'], de: ['gleich', 'plus', 'minus'] }[lang];
  return s
    .replace(/\s=\s/g, ` ${w[0]} `)
    .replace(/(\S)\s\+\s(?=\S)/g, `$1 ${w[1]} `)
    .replace(/(\d)\s[−-]\s(?=\d)/g, `$1 ${w[2]} `);
};

/** a long paragraph — by sentences, so no part is longer than MAX_PART */
const pieces = (p: string): string[] => {
  if (p.length <= MAX_PART) return [p];
  const out: string[] = [];
  let cur = '';
  for (const s of p.match(/[^.!?…]+[.!?…]+["»”)]*\s*|[^.!?…]+$/g) ?? [p]) {
    if (cur && (cur + s).length > MAX_PART) out.push(cur.trim()), (cur = '');
    cur += s;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
};

/** the paragraphs of a chapter in parts of up to MAX_PART */
export const group = (paras: string[]): string[] => {
  const out: string[] = [];
  let cur = '';
  for (const p of paras.flatMap(pieces)) {
    if (cur && cur.length + p.length + 2 > MAX_PART) out.push(cur), (cur = '');
    cur = cur ? `${cur}\n\n${p}` : p;
  }
  if (cur) out.push(cur);
  return out;
};

/** a heading read as its own sentence */
export const sentence = (s: string) => (/[.!?…:]$/.test(s) ? s : `${s}.`);

/** 16 hex of sha-256 — the part's address; the same in the browser, in the worker and in scripts/prerender.ts */
export async function partHash(lang: string, text: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${NARRATION_VERSION}\n${lang}\n${text}`));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('').slice(0, 16);
}
