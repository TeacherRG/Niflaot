#!/usr/bin/env python3
"""Build Strong-number → Biblical Hebrew infinitive-construct lookup.

Source: Macula Hebrew-derived Biblical Hebrew Morphological FST.
Only verb lemmas and their attested/gap-filled infinitive-construct cells are used.
The preferred binyan is the lemma's qatal binyan; this avoids mixing homonymous
or derived stems. Forms are matched to Niflaot's Strong dictionary by vocalized lemma.
"""
import csv
import json
import re
import sys
import unicodedata
import urllib.request
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORDS = ROOT / "src/tanakh/words.json"
OUT = ROOT / "public/tanakh/words/infinitives.json"
URL = "https://raw.githubusercontent.com/fhardison/biblical-hebrew-form-generator-validator/main/output/forms.csv"

def norm(s):
    s = unicodedata.normalize("NFC", s or "")
    # Ignore niqqud and cantillation for lexical matching.
    return "".join(c for c in s if not 0x0591 <= ord(c) <= 0x05C7)

def main():
    with urllib.request.urlopen(URL, timeout=90) as response:
        raw = response.read().decode("utf-8-sig")
    rows = list(csv.DictReader(raw.splitlines()))
    if not rows or not {"lemma", "stem", "vtype", "surface"}.issubset(rows[0]):
        raise SystemExit("FST forms.csv schema changed; expected lemma, stem, vtype, surface")

    by_lemma = defaultdict(list)
    for row in rows:
        if row.get("lemma") and row.get("stem"):
            by_lemma[norm(row["lemma"])].append(row)

    source = json.loads(WORDS.read_text(encoding="utf-8"))
    result = {}
    missing = []
    for word in source["words"]:
        if "v" not in word.get("pos", "").split():
            continue
        candidates = by_lemma.get(norm(word["he"]), [])
        qatal_stems = Counter(
            row["stem"] for row in candidates
            if row.get("vtype", "").strip().lower() == "qatal"
        )
        infs = [
            row for row in candidates
            if row.get("vtype", "").strip().lower() == "infinitive construct"
        ]
        if not infs:
            missing.append(word["id"])
            continue
        preferred = qatal_stems.most_common(1)[0][0] if qatal_stems else None
        same_stem = [row for row in infs if row["stem"] == preferred] if preferred else []
        pool = same_stem or infs

        def score(row):
            surface = unicodedata.normalize("NFC", row.get("surface", "")).strip()
            attested = row.get("attested", "").strip().lower() == "attested"
            refs = len([x for x in re.split(r"[;, ]+", row.get("refs", "")) if x])
            # Prefer the familiar ל-infinitive where the corpus attests one,
            # then attested data, then the best-supported form.
            return (surface.startswith("ל"), attested, refs, len(surface))

        chosen = max(pool, key=score)
        form = unicodedata.normalize("NFC", chosen.get("surface", "")).strip()
        if form:
            result[word["id"]] = form
        else:
            missing.append(word["id"])

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Biblical Hebrew infinitives: {len(result)} mapped; {len(missing)} unmatched")
    if len(result) < 100:
        raise SystemExit("Infinitive lookup coverage unexpectedly low; refusing to publish")

if __name__ == "__main__":
    main()
