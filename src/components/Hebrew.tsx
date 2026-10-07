/** Wraps runs of Hebrew words (incl. geresh, gershayim, maqaf) in <span class="he"> so they don't reorder nearby text. */
export function HebrewRuns({ text }: { text: string }) {
  return (
    <>
      {text.split(/([א-ת][א-ת׳״־]*(?:\s[א-ת][א-ת׳״־]*)*)/).map((part, i) =>
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
