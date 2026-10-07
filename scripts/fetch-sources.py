#!/usr/bin/env python3
"""
Downloads the primary-source passages quoted in the lessons from Sefaria's public export
(https://github.com/Sefaria/Sefaria-Export → storage.googleapis.com/sefaria-export) and writes
src/sources/sefaria.json. Run it again after adding a source to SOURCES below:

    python3 scripts/fetch-sources.py

Hebrew/Aramaic and English are taken verbatim (HTML tags reduced to <b>/<i>); Divine Names are
written respectfully (יהוה → ה׳, אלהים → אלקים; Бог → Б-г). Russian comes from Sefaria where a
Russian version exists (Torah: D. Slivniak, Da Project); other Russian translations are the
project's own and live in src/sources/ru.ts.

Finding a passage for a new lesson (no Sefaria API needed — the export is public):

    python3 scripts/fetch-sources.py ls   "Talmud/Bavli/Seder Moed/"            # browse the library
    python3 scripts/fetch-sources.py ls   "Tanakh/Writings/Psalms/English/"     # list versions of a book
    python3 scripts/fetch-sources.py find "Talmud/Bavli/Seder Zeraim/Berakhot" פרצוף זנב
    python3 scripts/fetch-sources.py find "Chasidut/Chabad/Tanya" תדשא

`find` prints every segment containing all the words (vowel points ignored) with its address
and a ready-to-paste SOURCES entry. Then add the entry below and run the script without arguments.
See docs/LESSON-GUIDE.md.
"""
import json, re, sys, urllib.parse, urllib.request
from pathlib import Path

BASE = 'https://storage.googleapis.com/sefaria-export/json/'
OUT = Path(__file__).resolve().parent.parent / 'src' / 'sources' / 'sefaria.json'

TANAKH_HE = 'Hebrew/Tanach with Text Only.json'
TANAKH_EN = 'English/The Holy Scriptures A New Translation JPS 1917.json'
TORAH_RU = 'English/Russian Torah translation, by Dmitri Slivniak, Ph.D., edited by Dr. Itzhak Streshinsky. Da Project, 2011 [ru].json'
BAVLI_HE = 'Hebrew/William Davidson Edition - Aramaic.json'
BAVLI_EN = 'English/William Davidson Edition - English.json'

BOOK = {
    'Genesis': ('Tanakh/Torah/Genesis/', 'Берешит', 'Torah'),
    'Exodus': ('Tanakh/Torah/Exodus/', 'Шмот', 'Torah'),
    'Numbers': ('Tanakh/Torah/Numbers/', 'Бемидбар', 'Torah'),
    'Deuteronomy': ('Tanakh/Torah/Deuteronomy/', 'Дварим', 'Torah'),
    'Ezekiel': ('Tanakh/Prophets/Ezekiel/', 'Йехезкель', 'Prophets'),
    'I Kings': ('Tanakh/Prophets/I Kings/', 'Млахим I', 'Prophets'),
    'Psalms': ('Tanakh/Writings/Psalms/', 'Тегилим', 'Writings'),
    'Proverbs': ('Tanakh/Writings/Proverbs/', 'Мишлей', 'Writings'),
    'Ecclesiastes': ('Tanakh/Writings/Ecclesiastes/', 'Коэлет', 'Writings'),
    'Berakhot': ('Talmud/Bavli/Seder Zeraim/Berakhot/', 'Брахот', 'Talmud'),
    'Shabbat': ('Talmud/Bavli/Seder Moed/Shabbat/', 'Шабат', 'Talmud'),
    'Yevamot': ('Talmud/Bavli/Seder Nashim/Yevamot/', 'Йевамот', 'Talmud'),
    'Chullin': ('Talmud/Bavli/Seder Kodashim/Chullin/', 'Хулин', 'Talmud'),
}

# id: (kind, Sefaria ref for the link, [pieces]); a piece is (book, chapter-or-daf, first, last)
# For other works: ('custom', title_ru, title_en, ref, he_file, en_file, path)
SOURCES = {
    # lesson 1
    'gen-2-21': ('Genesis', 2, 21, 22),
    'berakhot-61a': ('Berakhot', '61a', 4, 19),
    'deut-34-10': ('Deuteronomy', 34, 10, 12),
    'ex-34-33': ('Exodus', 34, 33, 35),
    'ex-32-31': ('Exodus', 32, 31, 32),
    'num-12-3': ('Numbers', 12, 3, 3),
    'berakhot-8a': ('Berakhot', '8a', 9, 9),
    'prov-18-22': ('Proverbs', 18, 22, 22),
    'eccl-7-26': ('Ecclesiastes', 7, 26, 26),
    # lesson 2
    'gen-1-1': ('Genesis', 1, 1, 9),
    'gen-2-24': ('Genesis', 2, 24, 24),
    'gen-3-16': ('Genesis', 3, 16, 16),
    'gen-3-20': ('Genesis', 3, 20, 20),
    'gen-19-27': ('Genesis', 19, 27, 27),
    'ex-33-21': ('Exodus', 33, 21, 21),
    'num-22-10': ('Numbers', 22, 10, 10),
    'num-15-41': ('Numbers', 15, 41, 41),
    'ps-19-5': ('Psalms', 19, 5, 5),
    'ps-27-14': ('Psalms', 27, 14, 14),
    'ps-147-5': ('Psalms', 147, 5, 5),
    'ps-73-1': ('Psalms', 73, 1, 1),
    'ps-16-8': ('Psalms', 16, 8, 8),
    'prov-11-23': ('Proverbs', 11, 23, 23),
    'ez-33-24': ('Ezekiel', 33, 24, 24),
    'ez-43-2': ('Ezekiel', 43, 2, 2),
    'ez-7-26': ('Ezekiel', 7, 26, 26),
    'kings1-1-5': ('I Kings', 1, 5, 5),
    'shabbat-146a': [('Shabbat', '145b', 15, 15), ('Shabbat', '146a', 0, 0)],
    'yevamot-118b': ('Yevamot', '118b', 15, 15),
    'chullin-60b': ('Chullin', '60b', 1, 3),
    'bereshit-rabbah-68-9': ('custom', 'Берешит Раба 68:9', 'Bereshit Rabbah 68:9', 'Bereshit Rabbah 68:9', 'Midrash',
                             'Midrash/Aggadah/Midrash Rabbah/Bereshit Rabbah/Hebrew/merged.json',
                             'Midrash/Aggadah/Midrash Rabbah/Bereshit Rabbah/English/The Sefaria Midrash Rabbah, 2022.json', [67, 8]),
    'mei-hashiloach-balak': ('custom', '«Мей ха-Шилоах», т. I, Балак', 'Mei HaShiloach, Vol. I, Balak', 'Mei HaShiloach, Volume I, Numbers, Balak 2', 'Chasidut',
                             'Chasidut/Izhbitz/Mei HaShiloach/Hebrew/merged.json',
                             'Chasidut/Izhbitz/Mei HaShiloach/English/Living waters, the Mei HaShiloach. Trans. and edited by Betsalel Philip Edwards, Jerusalem, J. Aronson 2001 [Revised digital edition, 2021].json',
                             ['Volume I', 'Numbers', 'Balak', 1]),
    'zohar-tet': ('custom', 'Зоар, Предисловие (I, 3а)', 'Zohar, Introduction (I, 3a)', 'Zohar, Introduction 6:12', 'Zohar',
                  'Kabbalah/Zohar/Zohar/Hebrew/Sulam Edition, Jerusalem 1945.json',
                  'Kabbalah/Zohar/Zohar/English/The Zohar; London, Soncino Press, 1933.json', ['Introduction', 5, 11]),
    'tanya-ih-20': ('custom', 'Тания, Игерет а-Кодеш 20', 'Tanya, Iggeret HaKodesh 20', 'Tanya, Part IV; Iggeret HaKodesh 20:29', 'Chasidut',
                    'Chasidut/Chabad/Tanya/Hebrew/Kehot Publication Society.json',
                    'Chasidut/Chabad/Tanya/English/Kehot Publication Society English Translation.json',
                    ['Part IV; Iggeret HaKodesh', 19, 28]),
}

KIND = {
    'Torah': ('Тора', 'Torah'), 'Prophets': ('Пророки', 'Prophets'), 'Writings': ('Писания', 'Writings'),
    'Talmud': ('Гемара', 'Gemara'), 'Midrash': ('Мидраш', 'Midrash'), 'Chasidut': ('Хасидут', 'Chassidut'), 'Zohar': ('Зоар', 'Zohar'),
}
EN_BOOK = {'I Kings': 'I Kings'}

_cache = {}
def load(path):
    if path not in _cache:
        url = BASE + urllib.parse.quote(path)
        sys.stderr.write(f'  ↓ {path}\n')
        with urllib.request.urlopen(url, timeout=180) as r:
            _cache[path] = json.load(r)
    return _cache[path]

def daf_index(daf):  # '61a' → 120 (Sefaria Talmud arrays start at 1a)
    n, side = int(daf[:-1]), daf[-1]
    return (n - 1) * 2 + (1 if side == 'b' else 0)

MARKS = '\u0591-\u05C7'
HOLY = re.compile(r'^[והבכלמש]*אלה(ים|יכם|יכן|ינו|יך|יו|יה|יהם|י)$')

def respect_names(s):
    """יהוה → ה׳; אלהים and its forms → אלקים (also with vowel points). «אלהי זהב» (an idol) is left as is."""
    words = re.split(r'([^א-ת' + MARKS + r'׳״]+)', s)
    for i, w in enumerate(words):
        plain = re.sub('[' + MARKS + ']', '', w)
        if 'יהוה' in plain:
            words[i] = plain.replace('יהוה', 'ה׳')
        elif HOLY.match(plain) and not (plain.endswith('אלהי') and i + 2 < len(words) and re.sub('[' + MARKS + ']', '', words[i + 2]) == 'זהב'):
            # replace the ה of אלה… with ק, keeping vowel points
            pos = plain.index('אלה') + 2
            k = -1
            for j, ch in enumerate(w):
                if '\u05D0' <= ch <= '\u05EA':
                    k += 1
                    if k == pos:
                        words[i] = w[:j] + 'ק' + w[j + 1:]
                        break
    return ''.join(words)

def clean(s, lang):
    s = re.sub(r'<sup[^>]*>.*?</sup>\s*<i class="footnote">.*?</i>', '', s, flags=re.S)
    s = re.sub(r'<i data-overlay[^>]*></i>', '', s)
    s = re.sub(r'<br\s*/?>', ' ', s)
    s = re.sub(r'<(?!/?(b|i)>)[^>]+>', '', s)          # keep only <b> and <i>
    s = re.sub(r'\s+', ' ', s).strip()
    if lang == 'he':
        s = respect_names(s)
    if lang == 'ru':
        s = re.sub(r'\bБог(а|у|ом|е)?\b', lambda m: 'Б-г' + (m.group(1) or ''), s)
        s = re.sub(r'\bГосподь\b', 'Г-сподь', s)
        s = re.sub(r'\bГоспод(а|у|ом|е)\b', lambda m: 'Г-спод' + m.group(1), s)
        s = re.sub(r'\bБож(ий|ья|ье|ьи|ьего|ьей|ьему|ьим|ьих|ественн\w*)\b', lambda m: 'Б-ж' + m.group(1), s)
    return s

def meta(d):
    return {'title': d.get('versionTitle'), 'license': d.get('license'), 'source': d.get('versionSource')}

def tanakh_or_talmud(book, sec, a, b):
    folder, ru_name, kind = BOOK[book]
    if kind == 'Talmud':
        he_d, en_d = load(folder + BAVLI_HE), load(folder + BAVLI_EN)
        i = daf_index(sec)
        pick = lambda d: d['text'][i][a:b + 1]
        ru_d = None
    else:
        he_d, en_d = load(folder + TANAKH_HE), load(folder + TANAKH_EN)
        pick = lambda d: d['text'][sec - 1][a - 1:b]
        ru_d = load(folder + TORAH_RU) if kind == 'Torah' else None
    return kind, ru_name, he_d, en_d, ru_d, pick

def label(book, sec, a, b, ru_name):
    rng = f'{a}' if a == b else f'{a}–{b}'
    if isinstance(sec, str):
        n, side = sec[:-1], sec[-1]
        return f'{ru_name} {n}{"а" if side == "a" else "б"}', f'{book} {sec}'
    return f'{ru_name} {sec}:{rng}', f'{book} {sec}:{rng}'

# ───────────────────────── helper commands: ls / find ─────────────────────────

def cmd_ls(prefix):
    q = urllib.parse.urlencode({'prefix': 'json/' + prefix, 'delimiter': '/', 'fields': 'prefixes,items(name,size)'})
    with urllib.request.urlopen('https://storage.googleapis.com/storage/v1/b/sefaria-export/o?' + q, timeout=60) as r:
        d = json.load(r)
    for x in d.get('prefixes', []):
        print('📁', x[len('json/'):])
    for i in d.get('items', []):
        print('📄', i['name'][len('json/'):], f"({int(i.get('size', 0)) // 1024} KB)")

def _walk(x, path=()):
    if isinstance(x, str):
        yield path, x
    elif isinstance(x, list):
        for i, y in enumerate(x):
            yield from _walk(y, path + (i,))
    elif isinstance(x, dict):
        for k, y in x.items():
            yield from _walk(y, path + (k,))

def _daf(i):  # 120 → '61a'
    return f"{i // 2 + 1}{'ab'[i % 2]}"

def cmd_find(book, words):
    path = book if book.endswith('.json') else book.rstrip('/') + '/Hebrew/merged.json'
    d = load(path)
    talmud = path.startswith('Talmud/Bavli/')
    tanakh = path.startswith('Tanakh/')
    name = path.split('/')[-3]
    n = 0
    for p, txt in _walk(d['text']):
        plain = re.sub('[' + MARKS + ']', '', re.sub(r'<[^>]+>', '', txt))
        if not all(w in plain for w in words):
            continue
        n += 1
        if talmud and len(p) == 2:
            where = f"{name} {_daf(p[0])}:{p[1] + 1}   →  ('{name}', '{_daf(p[0])}', {p[1]}, {p[1]})"
        elif tanakh and len(p) == 2:
            where = f"{name} {p[0] + 1}:{p[1] + 1}   →  ('{name}', {p[0] + 1}, {p[1] + 1}, {p[1] + 1})"
        else:
            where = f"path {list(p)}   →  ('custom', …, {list(p)})"
        print(f'── {where}')
        print('  ', plain[:300])
        if n >= 20:
            print('… (first 20 matches)')
            break
    if not n:
        print('nothing found')

if len(sys.argv) > 1 and sys.argv[1] in ('ls', 'find'):
    if sys.argv[1] == 'ls':
        cmd_ls(sys.argv[2] if len(sys.argv) > 2 else '')
    else:
        cmd_find(sys.argv[2], sys.argv[3:])
    sys.exit(0)

# ───────────────────────── fetch all SOURCES ─────────────────────────
out = {}
for sid, spec in SOURCES.items():
    if isinstance(spec, tuple) and spec[0] == 'custom':
        _, t_ru, t_en, ref, kind, he_p, en_p, path = spec
        he_d, en_d = load(he_p), load(en_p)
        def at(d):
            x = d['text']
            for k in path: x = x[k]
            return [x] if isinstance(x, str) else x
        he, en, ru, versions = at(he_d), at(en_d), None, {'he': meta(he_d), 'en': meta(en_d)}
        titles = (t_ru, t_en)
    else:
        pieces = spec if isinstance(spec, list) else [spec]
        he, en, ru, versions, t_ru, t_en, ref_parts = [], [], [], {}, [], [], []
        for (book, sec, a, b) in pieces:
            kind, ru_name, he_d, en_d, ru_d, pick = tanakh_or_talmud(book, sec, a, b)
            he += pick(he_d); en += pick(en_d)
            if ru_d is not None: ru += pick(ru_d)
            versions = {'he': meta(he_d), 'en': meta(en_d), **({'ru': meta(ru_d)} if ru_d else {})}
            lr, le = label(book, sec, a, b, ru_name)
            t_ru.append(lr); t_en.append(le)
            # Sefaria numbers Talmud segments from 1; the pieces above use 0-based indices
            sa, sb = (a + 1, b + 1) if kind == 'Talmud' else (a, b)
            ref_parts.append(f'{book} {sec}:{sa}' + (f'-{sb}' if sb != sa else ''))
        if len(pieces) > 1 and all(pc[0] == pieces[0][0] for pc in pieces):
            # one book, several dapim/chapters: «Шабат 145б–146а»
            titles = (t_ru[0] + '–' + t_ru[-1].split(' ', 1)[1], t_en[0] + '–' + t_en[-1].split(' ', 1)[1])
        else:
            titles = (' — '.join(t_ru), ' — '.join(t_en))
        ref = ref_parts[0] if len(ref_parts) == 1 else ref_parts[0] + '-' + ref_parts[-1].split(' ', 1)[1]
        ru = ru or None
    out[sid] = {
        'kind': {'ru': KIND[kind][0], 'en': KIND[kind][1]},
        'title': {'ru': titles[0], 'en': titles[1]},
        'ref': ref,
        'url': 'https://www.sefaria.org/' + urllib.parse.quote(ref.replace(' ', '_').replace(':', '.'), safe='_.,;-'),
        'he': [clean(s, 'he') for s in he if s],
        'en': [clean(s, 'en') for s in en if s],
        **({'ru': [clean(s, 'ru') for s in ru if s]} if ru else {}),
        'versions': versions,
    }
    sys.stderr.write(f'✓ {sid}: {len(out[sid]["he"])} he / {len(out[sid]["en"])} en' + (f' / {len(out[sid]["ru"])} ru' if ru else '') + '\n')

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
print(f'wrote {OUT} ({len(out)} sources)')
