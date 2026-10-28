#!/usr/bin/env python3
"""
«Святое чтение» — проворное чтение Теґилим (src/components/ReadingPage.tsx).

    python3 scripts/fetch-reading.py     # → public/reading/tehillim/<глава>.json и public/reading/tehillim/index.json

Текст — «Tanach with Ta'amei Hamikra» (огласовки и знаки кантилляции, tanach.us, Public Domain) из открытой выгрузки Sefaria.
Читается кери: ктив без огласовок перед [кери] убирается, скобки — тоже; перевёрнутая нун (׆) не нужна чтецу.
Имена Всевышнего — как во всём проекте (ה׳, אלקים, אד-ני: respect_names из scripts/fetch-sources.py).
"""
import importlib.util, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'reading' / 'tehillim'

_spec = importlib.util.spec_from_file_location('fetch_sources', ROOT / 'scripts' / 'fetch-sources.py')
fs = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fs)

SRC = "Tanakh/Writings/Psalms/Hebrew/Tanach with Ta'amei Hamikra.json"
SEP = re.compile(r'[\s\u05BE]+')


def qere(v):
    """«ואת [וְאַתָּ֥ה]» → «וְאַתָּ֥ה», «מיורדי־[מִיָּֽרְדִי־]» → «מִיָּֽרְדִי־»: читается кери."""
    v = v.replace('(׆)', ' ')
    v = re.sub(r'(?:(?<=\s)|^)[א-ת\u05BE]+\s*(?=\[)', '', v)  # ктив — буквы без огласовок
    v = v.replace('[', '').replace(']', '')
    return re.sub(r'\s+', ' ', v).strip()


def words(v):
    """Слова для счёта: через пробел и макаф, без пасека (׀)."""
    return [w for w in SEP.split(v) if re.search('[א-ת]', w)]


def main():
    d = fs.load(SRC)
    OUT.mkdir(parents=True, exist_ok=True)
    counts = []
    for c, ch in enumerate(d['text'], 1):
        verses = [fs.clean(qere(v), 'he') for v in ch]
        assert all(v and '[' not in v and '(' not in v for v in verses), c
        (OUT / f'{c}.json').write_text(json.dumps({'c': c, 'v': verses}, ensure_ascii=False) + '\n', encoding='utf-8')
        counts.append(sum(len(words(v)) for v in verses))
    index = {
        'book': 'tehillim',
        'he': 'תְּהִלִּים',
        'version': fs.meta(d),
        'words': counts,
    }
    old = OUT / 'index.json'
    if old.exists() and 'audio' in (prev := json.loads(old.read_text(encoding='utf-8'))):
        index['audio'] = prev['audio']  # записи глав и разметку учителя — не терять
    (OUT / 'index.json').write_text(json.dumps(index, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'wrote {OUT}: {len(counts)} глав, {sum(counts)} слов')


if __name__ == '__main__':
    sys.exit(main())
