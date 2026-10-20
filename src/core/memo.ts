import { gematria } from './gematria';
import { phraseTiles, expectedTiles, type Take } from './letterPuzzle';
import { displayNames } from './names';
import type { Lesson, MemoGematria, MemoLetters } from '../lessons/types';

/**
 * Memo pictures of every lesson: src/lessons/NN-<slug>/memo/NN.png, portrait 3:4, line art for colouring (bundled by Vite);
 * a lesson may also have them in colour for the screen — memo/color/NN.webp.
 */
const ART = import.meta.glob<string>('../lessons/*/memo/*.png', { eager: true, query: '?url', import: 'default' });
const COLOR = import.meta.glob<string>('../lessons/*/memo/color/*.webp', { eager: true, query: '?url', import: 'default' });

const pictures = (art: Record<string, string>, dir: string) =>
  Object.entries(art)
    .filter(([path]) => path.includes(dir))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);

/** Picture URLs of a lesson's Memo, in order (item k → NN = k + 1): in colour where there is a colour set, `print` — always the line art. */
export function memoImages(lesson: Lesson, print = false): string[] {
  const color = print ? [] : pictures(COLOR, `-${lesson.slug}/memo/color/`);
  return color.length ? color : pictures(ART, `-${lesson.slug}/memo/`);
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
