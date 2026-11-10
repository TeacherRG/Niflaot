/**
 * Wraps runs of Hebrew words in <span class="he"> (direction rtl, isolated) so they don't reorder the text around them.
 * A word is a letter followed by letters, niqqud and cantillation marks (U+0591–U+05C7: without them a vocalized word
 * fell apart into single isolated letters, laid out left to right — the word read backwards), geresh / gershayim
 * (also ASCII ' and " between letters: צ"ל); words joined by spaces, maqaf or a hyphen (א-ל) stay one run.
 */
import { displayNames } from '../core/names';

const L = '\\u05D0-\\u05EA\\uFB1D-\\uFB4F';
const WORD = `[${L}](?:[${L}\\u0591-\\u05C7\\u05F0-\\u05F4]|['"](?=[${L}]))*`;
export const HEBREW_RUN = new RegExp(`(${WORD}(?:[\\s\\u05BE-]+${WORD})*)`);

export function HebrewRuns({ text }: { text: string }) {
  return (
    <>
      {displayNames(text)
        .split(HEBREW_RUN)
        .map((part, i) =>
          i % 2 ? (
            <span key={i} className="he">
              {part}
            </span>
          ) : (
            part
          ),
        )}
    </>
  );
}
