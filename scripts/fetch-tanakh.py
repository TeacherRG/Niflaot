#!/usr/bin/env python3
"""
«Пророки» и «Писания»: тексты дней трёхлетнего цикла (src/core/tanakhCycle.ts).

    python3 scripts/fetch-tanakh.py books                        # число стихов в главах → src/tanakh/books.json
    npx tsx scripts/tanakh-cycle.ts                               # расписание цикла → src/tanakh/cycle.json
    python3 scripts/fetch-tanakh.py days 2026-10-11 2026-10-18 \
        --steinsaltz "<The Steinsaltz Neviim>" --steinsaltz "<The Steinsaltz Ketuvim>"   # → public/tanakh/<дата>.json
    python3 scripts/fetch-tanakh.py ru-import joshua перевод.txt   # перевод блоками → src/tanakh/ru/joshua.json
    python3 scripts/fetch-tanakh.py ru                           # русский перевод проекта (src/tanakh/ru) → в файлы дней

Каждый учебный день — отрывок Невиим и отрывок Ктувим. На каждый стих:
  he  — масоретский текст с огласовками (Sefaria: Tanach with Nikkud, Public Domain);
  en  — английский перевод (Sefaria: Tanakh: The Holy Scriptures, JPS 1985, CC-BY-NC);
  st  — рав Адин Штейнзальц: стих с вплетённым объяснением на иврите и по-английски (The Steinsaltz Tanakh,
        архивы глав с chabad.org — открытая выгрузка Sefaria его не содержит); сноски — <small class="fn">;
  intro — вступления Штейнзальца к разделам (заголовок и текст, he + en);
  ru, st.ru, intro.ru — русский перевод проекта (src/tanakh/ru/<книга>.json), где он уже есть.
Имена Всевышнего — как во всём проекте (ה׳, אלקים, G-d, L-rd). Другие языки перевода — потом, рядом с "en".
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

# ───── комментарий Штейнзальца ─────
# The Steinsaltz Tanakh (Невиим, Ктувим): по главе файл <папка книги>/chapter_NNN.json с chabad.org —
# verses[i]: text_he / text_en (стих с вплетённым объяснением) и commentary (вступления к разделам: title_*, comment_*).

FOLDER_SLUG = {
    'Amos': 'amos', 'Chaggai_Haggai': 'haggai', 'Chavakuk_Habakkuk': 'habakkuk', 'Hoshea_Hosea': 'hosea', 'Malachi': 'malachi',
    'Melachim_II_II_Kings': 'ii-kings', 'Melachim_I_I_Kings': 'i-kings', 'Michah_Micah': 'micah', 'Nachum_Nahum': 'nahum',
    'Ovadiah_Obadiah': 'obadiah', 'Shmuel_II_II_Samuel': 'ii-samuel', 'Shmuel_I_I_Samuel': 'i-samuel', 'Shoftim_Judges': 'judges',
    'Tzefaniah_Zephaniah': 'zephaniah', 'Yechezkel_Ezekiel': 'ezekiel', 'Yehoshua_Joshua': 'joshua', 'Yeshayahu_Isaiah': 'isaiah',
    'Yirmiyahu_Jeremiah': 'jeremiah', 'Yoel_Joel': 'joel', 'Yonah_Jonah': 'jonah', 'Zechariah': 'zechariah',
    'Daniel': 'daniel', 'Divrei_Hayamim_II_Chronicles_II': 'ii-chronicles', 'Divrei_Hayamim_I_Chronicles_I': 'i-chronicles',
    'Eichah_Lamentations': 'lamentations', 'Esther': 'esther', 'Ezra': 'ezra', 'Iyov_Job': 'job', 'Kohelet_Ecclesiastes': 'ecclesiastes',
    'Mishlei_Proverbs': 'proverbs', 'Nechemiah_Nehemiah': 'nehemiah', 'Rut_Ruth': 'ruth', 'Shir_Hashirim_Song_of_Songs': 'song-of-songs',
    'Tehillim_Psalms': 'psalms',
}
# где деление на стихи у Штейнзальца другое, чем в масоретском тексте Sefaria: (книга, глава, стих) Штейнзальца → наш
def remap(slug, ch, v):
    if slug == 'i-samuel' and ch == 23 and v == 29: return 24, 1
    if slug == 'i-samuel' and ch == 24: return 24, v + 1
    if slug == 'jeremiah' and ch == 30 and v == 25: return 31, 1
    if slug == 'jeremiah' and ch == 31: return 31, v + 1
    if slug == 'joshua' and ch == 21 and v >= 36: return 21, v + 2   # у Штейнзальца нет 21:36–37
    return ch, v

_st = None
def steinsaltz(dirs):
    """{(книга, глава, стих): {'he', 'en', 'intro': [...]}} из всех папок архива."""
    global _st
    if _st is not None: return _st
    _st = {}
    for root in dirs:
        for f in Path(root).glob('**/chapter_*.json'):
            slug = FOLDER_SLUG.get(f.parent.name)
            if not slug: continue
            ch0 = int(re.search(r'\d+', f.stem).group())
            for x in json.loads(f.read_text(encoding='utf-8'))['verses']:
                ch, v = remap(slug, ch0, int(x['verse_num_en']))
                e = {'he': steinsaltz_html(x.get('text_he', ''), 'he'), 'en': steinsaltz_html(x.get('text_en', ''), 'en')}
                intro = [{'title': {'he': st_clean(c.get('title_he', ''), 'he'), 'en': st_clean(c.get('title_en', ''), 'en')},
                          'he': st_clean(c.get('comment_he', ''), 'he'), 'en': st_clean(c.get('comment_en', ''), 'en')}
                         for c in x.get('commentary', [])]
                if intro: e['intro'] = intro
                _st[(slug, ch, v)] = e
    sys.stderr.write(f'  Штейнзальц: {len(_st)} стихов\n')
    return _st

NIQQUD = re.compile('[ְ-ׇֽֿׁׂׅׄ]')
HE_NOTE = re.compile(r'(?:וראו|ראו|כיוצא|עיין|השוו|על פי|ע"פ|בבלי|ירושלמי|תרגום|רש"י|רש״י|רד"ק|רד״ק|רמב"ן|מצודת|אברבנאל|מלבי"ם|מלבי״ם|רלב"ג|ראב"ע|אבן עזרא|ר"י קרא|ספרי|מדרש|פסיקתא|בראשית|שמות|ויקרא|במדבר|דברים|שמואל|מלכים|ישעיה|ירמיה|יחזקאל|תהלים|משלי|איוב)')
EN_NOTE = re.compile(r'(?:See|see also|Compare|Cf\.)\b')

def split_notes(s, lang):
    """В текстах chabad.org сноски вклеены в строку («…משהראו רמב"ן דברים לד,יא.  – לֹא…») и кончаются двойным
    пробелом. Начало сноски: на иврите — первое слово-ссылка после последнего слова стиха (с огласовками),
    по-английски — последнее «See…». Возвращает [(вид, текст)]: 't' — текст, 'n' — сноска; что не распознано — текст."""
    out, pos = [], 0
    ends = [m for m in re.finditer(r' {2,}', s)] + [None]
    for m in ends:
        seg = s[pos:m.start()] if m else s[pos:]
        start = None
        if lang == 'he':
            last = max((x.end() for x in NIQQUD.finditer(seg)), default=0)
            k = HE_NOTE.search(seg, last)
            if k and len(seg) - k.start() < 260 and (m or (k.start() > 0 and not seg[k.start() - 1].isspace())):
                start = k.start()
        else:
            if m:
                ks = [k for k in EN_NOTE.finditer(seg) if len(seg) - k.start() < 300]
                if ks: start = ks[-1].start()
            else:  # в конце текста — последнее предложение «See ….»
                k = None
                for k in re.finditer(r'(?:^|(?<=[.!?:]\s))(?:See|Cf\.)\b', seg): pass
                if k and len(seg) - k.start() < 250 and seg.rstrip().endswith('.') and '. ' not in seg[k.start():].rstrip()[:-1]:
                    start = k.start()
        if start is None: out.append(('t', seg))
        else: out += [('t', seg[:start]), ('n', seg[start:])]
        if m: pos = m.end()
    res = []
    for k, t in out:
        t = re.sub(r'\s+', ' ', t)
        if not t.strip(): continue
        if res and res[-1][0] == k == 't': res[-1] = ('t', res[-1][1] + ' ' + t)
        else: res.append((k, t))
    return [(k, t.strip()) for k, t in res]

HOLY_ST = re.compile(r'^[והבכלמש]*אלוה(ים|יכם|ינו|יך|יו|יה|יהם|י)$')

def st_clean(t, lang):
    """clean() проекта + Имена в стиле Штейнзальца: ה' → ה׳, אלוהים → אלוקים (с огласовками)."""
    t = fs.clean(t, lang)
    if lang != 'he': return t
    t = re.sub(r"(?<![\u05B0-\u05BD\u05BF-\u05C7א-ת])((?:[ובכלמש][\u05B0-\u05BD\u05BF-\u05C7]*)?)ה'(?![א-ת])", r'\1ה׳', t)
    def holy(w):
        plain = NIQQUD.sub('', w.group())
        if not HOLY_ST.match(re.sub('[\u0591-\u05C7]', '', plain)): return w.group()
        pos = re.sub('[\u0591-\u05C7]', '', plain).index('אלוה') + 3
        k = -1
        for j, ch in enumerate(w.group()):
            if 'א' <= ch <= 'ת':
                k += 1
                if k == pos: return w.group()[:j] + 'ק' + w.group()[j + 1:]
        return w.group()
    t = re.sub(r'[א-ת\u0591-\u05C7]+', holy, t)
    return re.sub(r':(?=[א-ת])', ': ', t)

def esc(t):
    return t.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def steinsaltz_html(s, lang):
    """HTML объяснения: сноски — <small class="fn">; на иврите слова стиха (с огласовками) — <b>, объяснение — обычным."""
    if not s.strip(): return ''
    parts = []
    for kind, t in split_notes(s, lang):
        t = esc(st_clean(t, lang))
        if kind == 'n':
            parts.append(f'<small class="fn">{t}</small>')
        elif lang == 'he':
            parts.append(re.sub(r'\S+', lambda w: f'<b>{w.group()}</b>' if NIQQUD.search(w.group()) else w.group(), t).replace('</b> <b>', ' '))
        else:
            parts.append(t)
    return ' '.join(parts)

# ───── русский перевод проекта ─────
# src/tanakh/ru/<книга>.json: {"<глава>:<стих>": {"t": стих, "st": Штейнзальц (HTML: <b> — слова стиха, <small class="fn"> —
# сноски), "intro": [{"title", "text"}] — вступления в том же порядке}}. Переводится по неделям, раньше дней цикла.
RU = ROOT / 'src' / 'tanakh' / 'ru'
_ru = {}
def ru_book(slug):
    if slug not in _ru:
        f = RU / f'{slug}.json'
        _ru[slug] = json.loads(f.read_text(encoding='utf-8')) if f.exists() else {}
    return _ru[slug]

def add_ru(verse):
    """Кладёт в стих перевод проекта, если он есть: ru, st.ru, intro[i].ru и intro[i].title.ru (Имена — Б-г, Г-сподь — проверяет npm run check)."""
    for k in ('ru',): verse.pop(k, None)
    if 'st' in verse: verse['st'].pop('ru', None)
    for x in verse.get('intro', []):
        x.pop('ru', None); x['title'].pop('ru', None)
    r = ru_book(verse['b']).get(f"{verse['c']}:{verse['v']}")
    if not r: return
    # текст проекта уже написан по правилам (Б-г, Г-сподь); clean() не нужен — он срезал бы разметку сносок
    verse['ru'] = r['t']
    if r.get('st') and 'st' in verse: verse['st']['ru'] = r['st']
    for x, y in zip(verse.get('intro', []), r.get('intro', [])):
        x['ru'] = y['text']; x['title']['ru'] = y['title']

def cmd_ru_import(slug, files):
    """Перевод, написанный блоками (=== глава:стих / T: / ST: / INTRO-TITLE: / INTRO:), → src/tanakh/ru/<книга>.json."""
    data = ru_book(slug)
    for f in files:
        cur = None
        for line in Path(f).read_text(encoding='utf-8').splitlines():
            m = re.match(r'=== (\d+):(\d+)$', line)
            if m:
                cur = data[f'{m.group(1)}:{m.group(2)}'] = {}
                continue
            m = re.match(r'(T|ST|INTRO-TITLE|INTRO): (.*)$', line)
            if not m or cur is None:
                if line.strip(): sys.exit(f'{f}: непонятная строка: {line[:60]}')
                continue
            k, t = m.groups()
            if k == 'T': cur['t'] = t
            elif k == 'ST': cur['st'] = t
            elif k == 'INTRO-TITLE': cur.setdefault('intro', []).append({'title': t})
            else: cur['intro'][-1]['text'] = t
    RU.mkdir(parents=True, exist_ok=True)
    keys = sorted(data, key=lambda k: tuple(map(int, k.split(':'))))
    (RU / f'{slug}.json').write_text(json.dumps({k: data[k] for k in keys}, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{slug}: {len(data)} стихов переведено')

def cmd_ru():
    """Переводы из src/tanakh/ru → в готовые файлы дней (без сети)."""
    n = 0
    for f in sorted(OUT.glob('????-??-??.json')):
        day = json.loads(f.read_text(encoding='utf-8'))
        before = json.dumps(day, ensure_ascii=False, separators=(',', ':'))
        for sec in ('neviim', 'ketuvim'):
            for v in day[sec]['verses']: add_ru(v)
        after = json.dumps(day, ensure_ascii=False, separators=(',', ':'))
        if after != before:
            f.write_text(after + '\n', encoding='utf-8'); n += 1
            sys.stderr.write(f"✓ {day['date']}: русский — {sum('ru' in v for sec in ('neviim', 'ketuvim') for v in day[sec]['verses'])} стихов\n")
    print(f'updated {n} days')

# ───── один раздел одного дня ─────

def section_day(books, section, a, z, st_dirs):
    t = track(books, section)[a:z]
    verses, refs, versions = [], [], {}
    st = steinsaltz(st_dirs) if st_dirs else {}
    for b, ch, v in t:
        he = fs.load(book_file(b, HE)); en = fs.load(book_file(b, EN))
        versions['he'] = fs.meta(he); versions['en'] = fs.meta(en)
        en_ch = en['text'][ch - 1] if ch - 1 < len(en['text']) else []
        verse = {'b': b['slug'], 'c': ch, 'v': v,
                 'he': fs.clean(he['text'][ch - 1][v - 1], 'he'),
                 # the page shows the verse as plain text: no <i> (JPS italicizes «Selah», transliterations)
                 'en': re.sub(r'</?i>', '', fs.clean(en_ch[v - 1], 'en')) if v - 1 < len(en_ch) else ''}
        s = st.get((b['slug'], ch, v))
        if not verse['en']:
            old = fs.load(book_file(b, EN_FALLBACK))['text'][ch - 1]
            if v - 1 < len(old) and old[v - 1].strip():
                verse['en'] = re.sub(r'</?i>', '', fs.clean(old[v - 1], 'en'))
                verse['enFrom'] = 'JPS 1917'
        if s:
            verse['st'] = {'he': s['he'], 'en': s['en']}
            if 'intro' in s: verse['intro'] = s['intro']
            versions['steinsaltz'] = {'title': 'The Steinsaltz Tanakh', 'license': '© Koren Publishers Jerusalem / Steinsaltz Center', 'source': 'https://www.chabad.org/library/bible_cdo/'}
        add_ru(verse)
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

def cmd_days(start, end, st_dirs):
    books = json.loads(BOOKS.read_text(encoding='utf-8'))['books']
    cycle = json.loads(CYCLE.read_text(encoding='utf-8'))
    OUT.mkdir(parents=True, exist_ok=True)
    n = 0
    for i, (date, na, nz, ka, kz) in enumerate(cycle['days']):
        if not (start <= date <= end): continue
        day = {'date': date, 'day': i + 1, 'days': len(cycle['days']),
               'neviim': section_day(books, 'neviim', na, nz, st_dirs),
               'ketuvim': section_day(books, 'ketuvim', ka, kz, st_dirs)}
        (OUT / f'{date}.json').write_text(json.dumps(day, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
        s = {k: f"{len(day[k]['verses'])} стихов, Штейнзальц {sum('st' in v for v in day[k]['verses'])}" for k in ('neviim', 'ketuvim')}
        sys.stderr.write(f"✓ {date} (день {i + 1}): Невиим {s['neviim']}; Ктувим {s['ketuvim']}\n")
        n += 1
    # список готовых дней — сайт показывает только их
    ready = sorted(p.stem for p in OUT.glob('????-??-??.json'))
    (OUT / 'index.json').write_text(json.dumps({'days': ready}) + '\n', encoding='utf-8')
    print(f'wrote {n} days to {OUT}')

if __name__ == '__main__':
    args = sys.argv[1:]
    dirs = []
    while '--steinsaltz' in args:
        k = args.index('--steinsaltz'); dirs.append(args[k + 1]); del args[k:k + 2]
    if args[:1] == ['books']: cmd_books()
    elif args[:1] == ['ru']: cmd_ru()
    elif args[:1] == ['ru-import'] and len(args) >= 3: cmd_ru_import(args[1], args[2:])
    elif args[:1] == ['days'] and len(args) == 3: cmd_days(args[1], args[2], dirs)
    else: sys.exit(__doc__)
