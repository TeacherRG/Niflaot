#!/usr/bin/env python3
"""
«Пророки» и «Писания»: тексты дней трёхлетнего цикла (src/core/tanakhCycle.ts).

    python3 scripts/fetch-tanakh.py books                        # число стихов в главах → src/tanakh/books.json
    npx tsx scripts/tanakh-cycle.ts                               # расписание цикла → src/tanakh/cycle.json
    python3 scripts/fetch-tanakh.py days 2026-10-11 2029-09-30   # → public/tanakh/<дата>.json (из выгрузки Sefaria)
    python3 scripts/fetch-tanakh.py ru-import joshua перевод.txt   # перевод блоками → src/tanakh/ru/joshua.json
    python3 scripts/fetch-tanakh.py en-import joshua translation.txt  # английский Мецудат Давид → src/tanakh/en/joshua.json
    python3 scripts/fetch-tanakh.py de-import joshua Übersetzung.txt  # немецкий — так же → src/tanakh/de/joshua.json
    python3 scripts/fetch-tanakh.py tr                           # переводы проекта (src/tanakh/ru|en|de) → в файлы дней

Каждый учебный день — отрывок Невиим и отрывок Ктувим. На каждый стих (всё — открытая выгрузка Sefaria):
  he  — масоретский текст с огласовками (Tanach with Nikkud, Public Domain);
  en  — английский перевод (Tanakh: The Holy Scriptures, JPS 1985, CC-BY-NC);
  md  — Мецудат Давид, простое объяснение стиха: he — оригинал (Public Domain), ru/en/de — перевод проекта;
  rashi — Раши: he — оригинал (Public Domain), en — Metsudah / Judaica Press (CC-BY), ru/de — перевод проекта;
  ru, de — перевод стиха проекта (src/tanakh/ru|de/<книга>.json), где он уже есть.
Комментарий — список: на стих несколько комментариев, в начале каждого слова стиха — <b>.
Имена Всевышнего — как во всём проекте (ה׳, אלקים, G-d, L-rd; Б-г, Г-сподь; G-tt, der Ewige).
Рав Штейнзальц (© Steinsaltz Center) на сайте не показывается — только ссылка на Sefaria.
"""
import importlib.util, json, re, sys, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BOOKS = ROOT / 'src' / 'tanakh' / 'books.json'
CYCLE = ROOT / 'src' / 'tanakh' / 'cycle.json'
OUT = ROOT / 'public' / 'tanakh'

# общие помощники scripts/fetch-sources.py: загрузка выгрузки Sefaria, clean() с Именами
_spec = importlib.util.spec_from_file_location('fetch_sources', ROOT / 'scripts' / 'fetch-sources.py')
fs = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fs)

HE = 'Hebrew/Tanach with Nikkud.json'
EN = 'English/Tanakh The Holy Scriptures, published by JPS.json'
# где в JPS 1985 стиха нет (Йеґошуа 21:36–37 — он даёт их только в сноске): JPS 1917, Public Domain
EN_FALLBACK = 'English/The Holy Scriptures A New Translation JPS 1917.json'
FOLDER = {'neviim': 'Tanakh/Prophets/', 'ketuvim': 'Tanakh/Writings/'}

def book_file(b, f):
    return FOLDER[b['section']] + b['sefaria'] + '/' + f

def cmd_books():
    data = json.loads(BOOKS.read_text(encoding='utf-8'))
    for b in data['books']:
        he = fs.load(book_file(b, HE))['text']
        b['verses'] = [len([v for v in ch]) for ch in he]
        sys.stderr.write(f"✓ {b['slug']}: {len(b['verses'])} глав, {sum(b['verses'])} стихов\n")
    BOOKS.write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    n = {s: sum(sum(b['verses']) for b in data['books'] if b['section'] == s) for s in FOLDER}
    print(f'wrote {BOOKS}: Невиим {n["neviim"]} стихов, Ктувим {n["ketuvim"]} стихов')

def track(books, section):
    return [(b, c + 1, v + 1) for b in books if b['section'] == section for c, n in enumerate(b['verses']) for v in range(n)]

# ───── комментарии: Мецудат Давид и Раши ─────
# Из открытой выгрузки Sefaria, по стихам (деление стихов — как в «Tanach with Nikkud»): на стих — список комментариев,
# у каждого начало — слова стиха (<b>), дальше объяснение. Иврит — Public Domain; английский Раши — CC-BY (Metsudah,
# Judaica Press). Мецудат Давид — основное объяснение (его нет только у Рут, Эйхи и Эстер — там Раши); переводы
# Мецудат Давид на ru/en/de и Раши на ru/de — переводы проекта (src/tanakh/<язык>/<книга>.json).
COMM = {
    'md': ('Acharonim on Tanakh/Metzudat David/', 'Metzudat David on '),
    'rashi': ('Rishonim on Tanakh/Rashi/', 'Rashi on '),
}
FREE = ('Public Domain', 'CC0', 'CC-BY')
_ls = {}
def listing(prefix):
    if prefix not in _ls:
        q = urllib.parse.urlencode({'prefix': 'json/' + prefix, 'fields': 'items(name)'})
        with urllib.request.urlopen('https://storage.googleapis.com/storage/v1/b/sefaria-export/o?' + q, timeout=60) as r:
            _ls[prefix] = [i['name'][5:] for i in json.load(r).get('items', []) if not i['name'].endswith('merged.json')]
    return _ls[prefix]

def filled(x):
    return sum(filled(y) for y in x) if isinstance(x, list) else int(bool(isinstance(x, str) and x.strip()))

_comm = {}
def commentary(kind, b, lang):
    """Текст комментария к книге: самое полное издание со свободной лицензией; None — нет такого."""
    key = (kind, b['slug'], lang)
    if key not in _comm:
        folder, title = COMM[kind]
        sec = 'Prophets/' if b['section'] == 'neviim' else 'Writings/'
        best = None
        for path in listing(f'Tanakh/{folder}{sec}{title}{b["sefaria"]}/{lang}/'):
            d = fs.load(path)
            if d.get('license') in FREE and (best is None or filled(d['text']) > filled(best['text'])): best = d
        _comm[key] = best
    return _comm[key]

def comm_html(t, lang):
    """clean() проекта; только <b> (слова стиха); на иврите ה' → ה׳, «יי» → ה׳, без невидимых знаков направления."""
    t = re.sub(r'</?i>', '', fs.clean(t.replace('\u200e', '').replace('\u200f', ''), lang)).strip()
    if lang == 'he':
        t = re.sub(r"(?<![\u05B0-\u05BD\u05BF-\u05C7א-ת])((?:[ובכלמש])?)ה'(?![א-ת])", r'\1ה׳', t)
        t = re.sub(r"(?<![א-ת])((?:[ובכלמש])?)יי'?(?![א-ת])", r'\1ה׳', t)
        t = re.sub(r':(?=[א-ת])', ': ', t)
    return t.replace('<b> ', ' <b>').replace(' </b>', '</b> ')

def verse_comm(kind, b, ch, v, lang):
    d = commentary(kind, b, lang)
    if not d: return []
    try: xs = d['text'][ch - 1][v - 1]
    except IndexError: return []
    if isinstance(xs, str): xs = [xs]
    return [h for h in (comm_html(x, 'he' if lang == 'Hebrew' else 'en') for x in xs if isinstance(x, str)) if h]

def comm_meta(kind, b, lang):
    d = commentary(kind, b, lang)
    return fs.meta(d) if d else None

def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

# ───── переводы проекта ─────
# src/tanakh/<язык>/<книга>.json: {"<глава>:<стих>": {"t": стих, "md": [комментарии Мецудат Давид], "rashi": [комментарии Раши]}}.
# Стих (ru, de) — с английского JPS 1985 (CC BY-NC); Мецудат Давид и Раши — с ивритского оригинала (Public Domain),
# каждый комментарий — отдельной строкой в том же порядке, слова стиха в начале — <b>. Английский файл (en) — только
# Мецудат Давид (английский стих — JPS, английский Раши — Sefaria). Переводится по неделям, раньше дней цикла.
TR_LANGS = ('ru', 'en', 'de')
_tr = {}
def tr_book(lang, slug):
    if (lang, slug) not in _tr:
        f = ROOT / 'src' / 'tanakh' / lang / f'{slug}.json'
        _tr[lang, slug] = json.loads(f.read_text(encoding='utf-8')) if f.exists() else {}
    return _tr[lang, slug]

def add_tr(verse):
    """Кладёт в стих переводы проекта, где они есть: стих <язык> (ru, de), md.<язык>, rashi.<язык>
    (Имена — Б-г, Г-сподь / G-d / G-tt, der Ewige — проверяет npm run check)."""
    for lang in TR_LANGS:
        r = tr_book(lang, verse['b']).get(f"{verse['c']}:{verse['v']}") or {}
        if lang != 'en':
            verse.pop(lang, None)
            if r.get('t'): verse[lang] = r['t']
        for kind in ('md', 'rashi'):
            if kind not in verse or (kind == 'rashi' and lang == 'en'): continue
            verse[kind].pop(lang, None)
            if r.get(kind): verse[kind][lang] = r[kind]

def cmd_tr_import(lang, slug, files):
    """Перевод, написанный блоками (=== глава:стих / T: / MD: / RASHI:), → src/tanakh/<язык>/<книга>.json.
    MD: и RASHI: — по строке на комментарий, по порядку; новые строки блока заменяют прежний перевод этого вида."""
    data = tr_book(lang, slug)
    for f in files:
        cur, seen = None, set()
        for line in Path(f).read_text(encoding='utf-8').splitlines():
            m = re.match(r'=== (\d+):(\d+)$', line)
            if m:
                cur, seen = data.setdefault(f'{m.group(1)}:{m.group(2)}', {}), set()
                continue
            m = re.match(r'(T|MD|RASHI): (.*)$', line)
            if not m or cur is None:
                if line.strip(): sys.exit(f'{f}: непонятная строка: {line[:60]}')
                continue
            k, t = m.groups()
            if k == 'T': cur['t'] = t.strip(); continue
            k = k.lower()
            if k not in seen: cur[k] = []; seen.add(k)
            cur[k].append(t.strip())
    out = ROOT / 'src' / 'tanakh' / lang
    out.mkdir(parents=True, exist_ok=True)
    keys = sorted(data, key=lambda k: tuple(map(int, k.split(':'))))
    (out / f'{slug}.json').write_text(json.dumps({k: data[k] for k in keys}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{lang}/{slug}: {len(data)} стихов')

def cmd_tr():
    """Переводы из src/tanakh/ru|en|de → в готовые файлы дней (без сети)."""
    n = 0
    for f in sorted(OUT.glob('????-??-??.json')):
        day = json.loads(f.read_text(encoding='utf-8'))
        before = json.dumps(day, ensure_ascii=False, separators=(',', ':'))
        for sec in ('neviim', 'ketuvim'):
            for v in day[sec]['verses']: add_tr(v)
        after = json.dumps(day, ensure_ascii=False, separators=(',', ':'))
        if after != before:
            f.write_text(after + '\n', encoding='utf-8'); n += 1
            vs = [v for sec in ('neviim', 'ketuvim') for v in day[sec]['verses']]
            done = ', '.join(f"{lang}: стих {sum(lang in v for v in vs)}, Мецудат Давид {sum(lang in v.get('md', {}) for v in vs)}" for lang in TR_LANGS)
            sys.stderr.write(f"✓ {day['date']}: {done}\n")
    print(f'updated {n} days')

# ───── один раздел одного дня ─────

def section_day(books, section, a, z):
    t = track(books, section)[a:z]
    verses, refs, versions = [], [], {}
    for b, ch, v in t:
        he = fs.load(book_file(b, HE)); en = fs.load(book_file(b, EN))
        versions['he'] = fs.meta(he); versions['en'] = fs.meta(en)
        en_ch = en['text'][ch - 1] if ch - 1 < len(en['text']) else []
        verse = {'b': b['slug'], 'c': ch, 'v': v,
                 'he': fs.clean(he['text'][ch - 1][v - 1], 'he'),
                 # the page shows the verse as plain text: no <i> (JPS italicizes «Selah», transliterations)
                 'en': re.sub(r'</?i>', '', fs.clean(en_ch[v - 1], 'en')) if v - 1 < len(en_ch) else ''}
        if not verse['en']:
            old = fs.load(book_file(b, EN_FALLBACK))['text'][ch - 1]
            if v - 1 < len(old) and old[v - 1].strip():
                verse['en'] = re.sub(r'</?i>', '', fs.clean(old[v - 1], 'en'))
                verse['enFrom'] = 'JPS 1917'
        md = verse_comm('md', b, ch, v, 'Hebrew')
        if md:
            verse['md'] = {'he': md}
            versions['md'] = comm_meta('md', b, 'Hebrew')
        rashi_he, rashi_en = verse_comm('rashi', b, ch, v, 'Hebrew'), verse_comm('rashi', b, ch, v, 'English')
        if rashi_he or rashi_en:
            verse['rashi'] = {k: x for k, x in (('he', rashi_he), ('en', rashi_en)) if x}
            if rashi_he: versions['rashi'] = comm_meta('rashi', b, 'Hebrew')
            if rashi_en: versions['rashiEn'] = comm_meta('rashi', b, 'English')
        add_tr(verse)
        verses.append(verse)
        if not refs or refs[-1]['b'] != b['slug']:
            refs.append({'b': b['slug'], 'from': [ch, v], 'to': [ch, v]})
        refs[-1]['to'] = [ch, v]
    for r in refs:
        b = next(x for x in books if x['slug'] == r['b'])
        (c1, v1), (c2, v2) = r['from'], r['to']
        ref = f"{b['sefaria']} {c1}:{v1}-" + (f'{v2}' if c1 == c2 else f'{c2}:{v2}')
        r['url'] = 'https://www.sefaria.org/' + urllib.parse.quote(ref.replace(' ', '_').replace(':', '.'), safe='_.,;-')
    return {'refs': refs, 'verses': verses, 'versions': versions}

def cmd_days(start, end):
    books = json.loads(BOOKS.read_text(encoding='utf-8'))['books']
    cycle = json.loads(CYCLE.read_text(encoding='utf-8'))
    OUT.mkdir(parents=True, exist_ok=True)
    n = 0
    for i, (date, na, nz, ka, kz) in enumerate(cycle['days']):
        if not (start <= date <= end): continue
        day = {'date': date, 'day': i + 1, 'days': len(cycle['days']),
               'neviim': section_day(books, 'neviim', na, nz),
               'ketuvim': section_day(books, 'ketuvim', ka, kz)}
        (OUT / f'{date}.json').write_text(json.dumps(day, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
        s = {k: f"{len(day[k]['verses'])} стихов, Мецудат Давид {sum('md' in v for v in day[k]['verses'])}, Раши {sum('rashi' in v for v in day[k]['verses'])}" for k in ('neviim', 'ketuvim')}
        sys.stderr.write(f"✓ {date} (день {i + 1}): Невиим {s['neviim']}; Ктувим {s['ketuvim']}\n")
        n += 1
    # список готовых дней — сайт показывает только их
    ready = sorted(p.stem for p in OUT.glob('????-??-??.json'))
    (OUT / 'index.json').write_text(json.dumps({'days': ready}) + '\n', encoding='utf-8')
    print(f'wrote {n} days to {OUT}')

if __name__ == '__main__':
    args = sys.argv[1:]
    if args[:1] == ['books']: cmd_books()
    elif args[:1] in (['ru'], ['tr']): cmd_tr()
    elif args[:1] in (['ru-import'], ['en-import'], ['de-import']) and len(args) >= 3: cmd_tr_import(args[0][:2], args[1], args[2:])
    elif args[:1] == ['days'] and len(args) == 3: cmd_days(args[1], args[2])
    else: sys.exit(__doc__)
