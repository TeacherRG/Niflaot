#!/usr/bin/env python3
"""
«Шнаим микра ве-эхад таргум» в «Святом чтении» (src/components/ShnayimPage.tsx): стих Торы дважды и Таргум Онкелос один раз,
по отрывку (алие) главы в день недели: вс — 1-й … Шабат — 7-й.

    python3 scripts/fetch-shnayim.py [глава…]     # → public/reading/torah/shnayim-<глава>.json (по умолчанию — все из PARSHIOT)

Тора — «Tanach with Ta'amei Hamikra» (tanach.us, Public Domain), Таргум — «Onkelos Genesis…» (toratemetfreeware.com, Public Domain),
оба из открытой выгрузки Sefaria. Читается кери; Имена — как во всём проекте (clean из scripts/fetch-sources.py).
Новая глава — строка в PARSHIOT: книга и границы семи отрывков (по Хумашу «Тора Менахем» / chabad.org).
"""
import importlib.util, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'reading' / 'torah'

_spec = importlib.util.spec_from_file_location('fetch_reading', ROOT / 'scripts' / 'fetch-reading.py')
fr = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fr)
fs = fr.fs

BOOKS = {'genesis': 'Genesis', 'exodus': 'Exodus', 'leviticus': 'Leviticus', 'numbers': 'Numbers', 'deuteronomy': 'Deuteronomy'}
PARSHIOT = {
    'vayera': ('genesis', 'וַיֵּרָא', ['18:1', '18:15', '19:1', '19:21', '21:5', '21:22', '22:1', '22:24']),  # последняя — конец главы
}


def pos(r):
    c, v = r.split(':')
    return int(c), int(v)


def verses(text, a, b):
    """стихи от a до b включительно: [(«глава:стих», текст)]"""
    (ca, va), (cb, vb) = pos(a), pos(b)
    out = []
    for c in range(ca, cb + 1):
        ch = text[c - 1]
        for v in range(va if c == ca else 1, (vb if c == cb else len(ch)) + 1):
            out.append((f'{c}:{v}', ch[v - 1]))
    return out


def prev(text, r):
    """стих перед r"""
    c, v = pos(r)
    return f'{c}:{v - 1}' if v > 1 else f'{c - 1}:{len(text[c - 2])}'


def build(slug):
    book, he, marks = PARSHIOT[slug]
    name = BOOKS[book]
    torah = fs.load(f"Tanakh/Torah/{name}/Hebrew/Tanach with Ta'amei Hamikra.json")
    targum = fs.load(f'Tanakh/Targum/Onkelos/Torah/Onkelos {name}/Hebrew/Onkelos {name}.json')
    aliyot = []
    for k in range(7):
        a = marks[k]
        b = marks[k + 1] if k == 6 else prev(torah['text'], marks[k + 1])
        vs = []
        for (r, m), (_, t) in zip(verses(torah['text'], a, b), verses(targum['text'], a, b)):
            m = re.sub(r'\s*[({][פס][)}]\s*$', '', fs.clean(fr.qere(m), 'he'))  # знак открытого / закрытого раздела
            t = re.sub(r'\s*\([^)]*\)', '', fs.clean(t, 'he'))  # «(נ״י …)», «(גי׳ …)» — пометки издания, чтецу не нужны
            t = re.sub(r'\s+', ' ', t).strip()
            t = re.sub(r'(?<![א-ת])י[ְ]?יָ?(?![א-ת\u0591-\u05C7])', 'ה׳', t)  # Имя в Таргуме (יְיָ) — как во всём проекте
            t = t.rstrip(':׃') + '׃'
            assert m and t and not re.search(r'[\[\](){}<>]', m + t), r
            vs.append({'r': r, 'm': m, 't': t})
        aliyot.append({'from': a, 'to': b, 'v': vs})
    data = {
        'parsha': slug,
        'book': book,
        'he': he,
        'torah': fs.meta(torah),
        'targum': fs.meta(targum),
        'aliyot': aliyot,
    }
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f'shnayim-{slug}.json').write_text(json.dumps(data, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'wrote shnayim-{slug}.json: ' + ', '.join(f"{x['from']}–{x['to']} ({len(x['v'])})" for x in aliyot))


def main():
    for slug in sys.argv[1:] or PARSHIOT:
        build(slug)


if __name__ == '__main__':
    sys.exit(main())
