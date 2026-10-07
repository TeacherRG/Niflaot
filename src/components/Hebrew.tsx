/** Wraps runs of Hebrew words in <span class="he"> (used for equations). */
export function HebrewRuns({ text }: { text: string }) {
  return (
    <>
      {text.split(/([א-ת]+(?:\s[א-ת]+)*)/).map((part, i) =>
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
