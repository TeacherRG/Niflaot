import { gematria } from './gematria';
import { phraseTiles, expectedTiles, type Take } from './letterPuzzle';
import { displayNames } from './names';
import type { Lesson, MemoGematria, MemoLetters } from '../lessons/types';

/** Memo pictures of every lesson: src/lessons/NN-<slug>/memo/NN.png, portrait 3:4 (bundled by Vite). */
const ART = import.meta.glob<string>('../lessons/*/memo/*.png', { eager: true, query: '?url', import: 'default' });

/** Picture URLs of a lesson's Memo, in order (item k → NN = k + 1). */
export function memoImages(lesson: Lesson): string[] {
  return Object.entries(ART)
    .filter(([path]) => path.includes(`-${lesson.slug}/memo/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);
}

/** «בראשית ברא = 913 + 203 = 1116» — the sum of a phrase word by word (shown with respectful Names). */
export function sumLine(phrase: string) {
  const words = phrase.split(/\s+/).filter(Boolean);
  const parts = words.map(gematria);
  return `${displayNames(phrase)} = ${parts.length > 1 ? `${parts.join(' + ')} = ` : ''}${gematria(phrase)}`;
}

/** The lines of a gematria: each side with its sum. */
export const gematriaLines = (g: MemoGematria) => [sumLine(g.a), ...(g.b ? [sumLine(g.b)] : [])];

/** «בראשית ברא אלקים → ת · א · ם → אמת» */
export function lettersLine(l: MemoLetters) {
  const tiles = phraseTiles(l.from);
  const taken = [...expectedTiles(tiles, l.take as Take)].map((i) => tiles[i].c);
  return `${displayNames(l.from)} → ${taken.join(' · ')} → ${l.word}`;
}
