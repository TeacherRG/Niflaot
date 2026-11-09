/**
 * «Поиск по Пророкам и Писаниям» (`#/search`, src/components/TanakhSearchPage.tsx): индекс — все стихи Невиим и Ктувим
 * из файлов дней `public/tanakh/<дата>.json`, по разделу в порядке Танаха (номер стиха в разделе — как `track()` в
 * src/core/tanakhCycle.ts). Файлы `tanakh/search/<he|en|ru|de>.json` = `{neviim: string[], ketuvim: string[]}`:
 * иврит — с огласовками, как на странице дня; en — JPS; ru, de — перевод проекта (непереведённый стих — "").
 * Собирает плагин в vite.config.ts: в `npm run dev` — на лету, в сборке — в dist/tanakh/search/. Проверка — check-tanakh.ts.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

type Sec = 'neviim' | 'ketuvim';
export const SEARCH_LANGS = ['he', 'en', 'ru', 'de'] as const;
export type SearchLang = (typeof SEARCH_LANGS)[number];
export type SearchIndex = Record<Sec, string[]>;

interface Book {
  slug: string;
  section: Sec;
  verses: number[];
}
interface DayVerse {
  b: string;
  c: number;
  v: number;
  he: string;
  en: string;
  ru?: string;
  de?: string;
}

export function buildSearchIndex(dir = 'public/tanakh', booksFile = 'src/tanakh/books.json'): Record<SearchLang, SearchIndex> {
  const books = (JSON.parse(readFileSync(booksFile, 'utf8')) as { books: Book[] }).books;
  const pos = new Map<string, [Sec, number]>();
  const size: Record<Sec, number> = { neviim: 0, ketuvim: 0 };
  for (const b of books)
    b.verses.forEach((n, c) => {
      for (let v = 1; v <= n; v++) pos.set(`${b.slug} ${c + 1}:${v}`, [b.section, size[b.section]++]);
    });
  const out = Object.fromEntries(
    SEARCH_LANGS.map((l) => [l, { neviim: Array(size.neviim).fill(''), ketuvim: Array(size.ketuvim).fill('') }]),
  ) as Record<SearchLang, SearchIndex>;
  for (const f of readdirSync(dir).filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort()) {
    const day = JSON.parse(readFileSync(join(dir, f), 'utf8')) as Record<Sec, { verses: DayVerse[] }>;
    for (const s of ['neviim', 'ketuvim'] as const)
      for (const v of day[s]?.verses ?? []) {
        const p = pos.get(`${v.b} ${v.c}:${v.v}`);
        if (!p) continue;
        for (const l of SEARCH_LANGS) out[l][p[0]][p[1]] = v[l] ?? '';
      }
  }
  return out;
}
