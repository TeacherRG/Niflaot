#!/usr/bin/env python3
"""
«Мишне Тора — глава в день» (the one-chapter-a-day Rambam cycle): texts of the chapters and the slides of the explanation.

    python3 scripts/fetch-rambam.py books                     # src/rambam/books.json — the 88 parts of the cycle (once)
    python3 scripts/fetch-rambam.py text  <from> [<to>]       # public/rambam/text/<id>.json for the chapters of these dates
    python3 scripts/fetch-rambam.py slides <id> <file.pdf>    # the presentation → public/rambam/slides/<id>/NN.webp + skeleton
    python3 scripts/fetch-rambam.py words [ru]                # src/rambam/words/ru-*.txt → public/rambam/words/ru.json
    python3 scripts/fetch-rambam.py todo  [<to>]              # words of the chapters (till that date) without a translation

The cycle (src/core/rambam.ts): from Sunday 27 Nisan 5744 (29.04.1984), one chapter a day, 1017 days, then again — the order
and chapter counts as in @hebcal/learning (`mishnehTorah.json`), checked against chabad.org.

Text — Sefaria's public export: Hebrew «Torat Emet 363» (with vowel points, Public Domain), English — Eliyahu Touger,
Moznaim (CC BY-NC). Divine Names in Hebrew — as in the lessons (ה׳), like scripts/fetch-sources.py.
Slides — the project's own presentations (© niflaot.app), one WebP per page; the halachot each explains and its text are
written by hand in public/rambam/slides/<id>/slides.json (the skeleton has the halachot read from nothing — fill them).
"""
import datetime, importlib.util, json, re, subprocess, sys, tempfile, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BOOKS = ROOT / 'src' / 'rambam' / 'books.json'
TEXT = ROOT / 'public' / 'rambam' / 'text'
SLIDES = ROOT / 'public' / 'rambam' / 'slides'
WORDS = ROOT / 'public' / 'rambam' / 'words'
BASE = 'https://storage.googleapis.com/sefaria-export/json/Halakhah/Mishneh Torah/'
HE = 'Hebrew/Torat Emet 363.json'
EN = 'English/Mishneh Torah, trans. by Eliyahu Touger. Jerusalem, Moznaim Pub. c1986-c2007.json'
START = datetime.date(1984, 4, 29)

spec = importlib.util.spec_from_file_location('fs', ROOT / 'scripts' / 'fetch-sources.py')
fs = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fs)

# the order of the cycle (the first four parts are read by verses / lists, not chapters — we keep their count)
ORDER = [("Transmission of the Oral Law", 3), ("Positive Mitzvot", 3), ("Negative Mitzvot", 3), ("Overview of Mishneh Torah Contents", 3)]

def get(url):
    with urllib.request.urlopen(urllib.parse.quote(url, safe=':/'), timeout=120) as r:
        return json.load(r)

def books():
    return json.loads(BOOKS.read_text())

def chapter_of(day):
    """(book, perek) of the cycle on this date"""
    bs = books()
    n = (day - START).days % sum(b['ch'] for b in bs)
    for b in bs:
        if n < b['ch']:
            return b, n + 1
        n -= b['ch']

def slug(name):
    return re.sub(r'[^a-z]+', '-', name.lower()).strip('-')

def cmd_books():
    """the 88 parts in the order of the cycle, with their Sefaria folder (books.json from @hebcal/learning must be at hand)"""
    src = json.loads(Path(sys.argv[2]).read_text()) if len(sys.argv) > 2 else None
    if not src:
        sys.exit('usage: books <mishnehTorah.json as {name: chapters}>')
    folders = {}
    q = urllib.parse.urlencode({'prefix': 'json/Halakhah/Mishneh Torah/', 'delimiter': '/', 'fields': 'prefixes'})
    with urllib.request.urlopen('https://storage.googleapis.com/storage/v1/b/sefaria-export/o?' + q) as r:
        for p in json.load(r)['prefixes']:
            sefer = p.split('/')[-2]
            if not sefer.startswith('Sefer'):
                continue
            q2 = urllib.parse.urlencode({'prefix': p, 'delimiter': '/', 'fields': 'prefixes'})
            with urllib.request.urlopen('https://storage.googleapis.com/storage/v1/b/sefaria-export/o?' + q2) as r2:
                for b in json.load(r2).get('prefixes', []):
                    title = b.split('/')[-2]
                    folders[title.replace('Mishneh Torah, ', '')] = sefer + '/' + title
    out = []
    for name, ch in src.items():
        out.append({'id': slug(name), 'en': name, 'ch': ch, 'path': folders.get(name)})
    BOOKS.parent.mkdir(parents=True, exist_ok=True)
    BOOKS.write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n')
    print(len(out), 'parts,', sum(b['ch'] for b in out), 'days;', 'no folder:', [b['en'] for b in out if not b['path']])

def plain(s, lang):
    s = fs.clean(s, lang)
    s = re.sub(r'</?[bi]>', '', s)
    return s.replace('"', '״') if lang == 'he' else s

_cache = {}
def version(path, file):
    key = path + file
    if key not in _cache:
        _cache[key] = get(BASE + path + '/' + file)
    return _cache[key]

def cmd_text():
    a = datetime.date.fromisoformat(sys.argv[2])
    b = datetime.date.fromisoformat(sys.argv[3]) if len(sys.argv) > 3 else a
    TEXT.mkdir(parents=True, exist_ok=True)
    while a <= b:
        book, perek = chapter_of(a)
        if not book['path']:
            print(a, book['en'], perek, '— no chapters on Sefaria (lists of the mitzvot): skipped')
            a += datetime.timedelta(days=1)
            continue
        he, en = version(book['path'], HE), version(book['path'], EN)
        cid = f"{book['id']}-{perek}"
        hh = [plain(x, 'he') for x in he['text'][perek - 1]]
        ee = [plain(x, 'en') for x in en['text'][perek - 1]]
        if len(hh) != len(ee):
            print('  ! halachot: he', len(hh), 'en', len(ee))
        data = {
            'id': cid, 'book': book['id'], 'perek': perek,
            'title': {'he': (he.get('heTitle') or '').replace('משנה תורה, ', ''), 'en': book['en']},
            'he': hh, 'en': ee,
            'src': {'he': fs.meta(he), 'en': fs.meta(en)},
        }
        (TEXT / f'{cid}.json').write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')
        print(a, cid, len(hh), 'halachot')
        a += datetime.timedelta(days=1)

def cmd_slides():
    cid, pdf = sys.argv[2], Path(sys.argv[3])
    out = SLIDES / cid
    out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(['pdfimages', '-png', str(pdf), f'{tmp}/s'], check=True)
        from PIL import Image
        pages = sorted(p for p in Path(tmp).glob('s-*.png') if Image.open(p).mode != 'L')  # the soft masks are grey
        old = json.loads((out / 'slides.json').read_text()) if (out / 'slides.json').exists() else {'slides': []}
        slides = []
        for i, p in enumerate(pages):
            img = Image.open(p).convert('RGB')
            if img.width > 1600:
                img = img.resize((1600, round(img.height * 1600 / img.width)))
            name = f'{i + 1:02d}.webp'
            img.save(out / name, 'WEBP', quality=80, method=6)
            prev = old['slides'][i] if i < len(old['slides']) else {}
            slides.append({'img': name, 'w': img.width, 'h': img.height, 'hl': prev.get('hl'), 'title': prev.get('title', ''), 'text': prev.get('text', '')})
    (out / 'slides.json').write_text(json.dumps({'slides': slides}, ensure_ascii=False, indent=1) + '\n')
    size = sum(f.stat().st_size for f in out.glob('*.webp'))
    print(cid, len(slides), 'slides,', size // 1024, 'KB — write «hl», «title», «text» of each in', out / 'slides.json')

KEEP = re.compile(r'[א-ת״׳]')
def key(word):
    """a word of the text → its key in the dictionary: letters (and ״ ׳ of abbreviations), no vowel points"""
    w = re.sub(r'[֑-ׇ]', '', word)
    w = re.sub(r'[^א-ת״׳]', '', w)
    return w.strip('׳') if not re.search('[א-ת]׳$', w) else w

SRC_WORDS = ROOT / 'src' / 'rambam' / 'words'
def read_words(lang):
    """src/rambam/words/<lang>-*.txt: «слово|перевод|основная форма» → {key: [translation, base form]}"""
    d = {}
    for f in sorted(SRC_WORDS.glob(f'{lang}-*.txt')):
        for n, line in enumerate(f.read_text().splitlines(), 1):
            if not line.strip() or line.startswith('#'):
                continue
            parts = line.split('|')
            if len(parts) != 3 or not parts[1].strip():
                sys.exit(f'{f.name}:{n}: «слово|перевод|основная форма» — {line}')
            k = key(parts[0])
            if k in d and d[k][0] != parts[1].strip():
                print(f'  {f.name}:{n}: {k} — второй перевод, остаётся первый', file=sys.stderr)
                continue
            d[k] = [parts[1].strip(), parts[2].strip()] if parts[2].strip() else [parts[1].strip()]
    return d

def cmd_words():
    """the project's dictionary → public/rambam/words/<lang>.json (what the page loads)"""
    lang = sys.argv[2] if len(sys.argv) > 2 else 'ru'
    d = read_words(lang)
    WORDS.mkdir(parents=True, exist_ok=True)
    (WORDS / f'{lang}.json').write_text(json.dumps(d, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(lang, len(d), 'words')

def cmd_todo():
    lang = 'ru'
    upto = sys.argv[2] if len(sys.argv) > 2 else None
    d = read_words(lang)
    miss = {}
    days = []
    if upto:
        a, b = datetime.date.today(), datetime.date.fromisoformat(upto)
        while a <= b:
            book, perek = chapter_of(a)
            days.append(f"{book['id']}-{perek}")
            a += datetime.timedelta(days=1)
    for f in sorted(TEXT.glob('*.json')):
        if upto and f.stem not in days:
            continue
        for h in json.loads(f.read_text())['he']:
            for w in h.split():
                k = key(w)
                if k and k not in d:
                    miss.setdefault(k, (w, f.stem))
    for k, (w, c) in miss.items():
        print(k, w, c, sep='\t')
    print(len(miss), 'words without a translation', file=sys.stderr)

if __name__ == '__main__':
    {'books': cmd_books, 'text': cmd_text, 'slides': cmd_slides, 'words': cmd_words, 'todo': cmd_todo}[sys.argv[1]]()
