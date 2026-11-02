#!/usr/bin/env python3
"""
«Кто и где» — справки о людях и местах Пророков и Писаний: окошко над именем в стихе и блок под отрывком дня.
Всё — свои данные проекта, по еврейским источникам; из открытых наборов — только разбор слов текста и контур карты.

    python3 scripts/fetch-words.py fetch    # разбор слов Танаха (Open Scriptures) → .cache/oshb (нужен и для «Слов отрывка»)
    python3 scripts/fetch-atlas.py fetch    # контур карты (Natural Earth) → .cache/atlas
    python3 scripts/fetch-atlas.py build    # → public/tanakh/atlas/<дата>.json и public/tanakh/atlas/map.json
    python3 scripts/fetch-atlas.py todo ru [до-даты]   # что подготовить: имена без записи, записи без справки на языке

Кто есть кто — src/tanakh/atlas/entities.json (проекта): {id: запись}:
  `k` — m мужчина, f женщина, g народ / род, p место, x другое (Сефер ґа-Яшар); `he` — имя на иврите;
  `s` — номера Стронга слов, которые называют эту запись (имя, «хеттей», «азатянин»…), по разбору Open Scriptures;
  `in` — где в Танахе эти слова — именно она: «*» (имя одно на весь Танах), «книга», «книга 7», «книга 10-12»,
         «книга 10:3», «книга 10:38-39», «книга 12:3-13:5». Тёзки (Йеґошуа бин Нун и Йеґошуа-первосвященник, Афек на
         равнине Шарон и Афек на севере) различаются только так — по Раши, Мецудат Давид, «Седер олам»; пустой `in` —
         запись только для семьи или ориентира на карте;
  `nc` — слово может быть и не именем (נֶגֶב «юг», יָשָׁר «прямой»): тогда — только в стихах `in`, и `in` не «*»;
  `fa`, `mo`, `sp`, `ch` — отец, мать, супруги, дети (id, по стихам Танаха);
  `ll` — [широта, долгота] места, `sure` — насколько известно, где оно: 2 — известно (раскопанный тель, имя
         сохранилось), 1 — вероятно, 0 — предположительно; нет `ll` — область, река или место не установлено;
  `a` — не точка, а область / река / море: радиус в км вокруг `ll` (на карте — пятно с подписью, без `sure`);
  `t` — ориентир на карте (известный город — серым, рядом с местами отрывка).
Имя без записи (или вне `in` всех записей) остаётся без справки — `todo` его покажет. Имена Всевышнего — никогда.

Файл дня `public/tanakh/atlas/<дата>.json`: `v` — {«книга глава:стих»: {номер слова нашего текста (через пробел и
макаф, как в HeVerse): id}}; `o` — {neviim|ketuvim: [id по порядку]}; `e` — {id: {k, he, fa?, mo?, sp?, ch?, ll?, sure?, a?}}
(и семья — {k, he}). `all.json` — для справочника `#/atlas`: `e` — все записи, `r` — {id: [стихов в цикле,
[[дата, раздел, «книга глава:стих»] — первый стих каждой главы, до 150 глав]]}. `map.json` — суша, озёра, реки (Natural Earth, PD) и ориентиры `towns` [id, широта, долгота, иврит].
Справки — src/tanakh/atlas/<ru|en|de>.json ({id: {n: имя, d: описание}}); проверка — scripts/check-atlas.ts.
"""
import importlib.util, json, math, re, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cache' / 'atlas'
DAYS = ROOT / 'public' / 'tanakh'
OUT = DAYS / 'atlas'
TEXTS = ROOT / 'src' / 'tanakh' / 'atlas'
NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
# окно карты: от Синая до Хамата, от моря до Башана
BBOX = (33.6, 29.4, 38.0, 35.6)
# Имена Всевышнего — не справки (номера Стронга)
GODLY = {'3068', '3069', '3050', '136', '410', '430', '433', '7706', '6635'}

_spec = importlib.util.spec_from_file_location('fetch_words', ROOT / 'scripts' / 'fetch-words.py')
fw = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(fw)
NORM = str.maketrans('ק', 'ה')


def cmd_fetch():
    CACHE.mkdir(parents=True, exist_ok=True)
    for f in ('ne_10m_land', 'ne_10m_lakes', 'ne_10m_rivers_lake_centerlines'):
        urllib.request.urlretrieve(f'{NE}{f}.geojson', CACHE / f'{f}.geojson')
    print(f'saved to {CACHE}')


def oshb():
    """(книга, глава, стих) → [(буквы слова, номер Стронга, разбор главного слова: Np — имя, Ng — «хеттей», Nc…)]"""
    out = {}
    W = re.compile(r'<verse osisID="([^"]+)">|</verse>|<w( type="x-ketiv")?[^>]*? lemma="([^"]*)"[^>]*?morph="([^"]*)"[^>]*>([^<]*)</w>')
    for b, slug in fw.BOOKS.items():
        ref, ws = None, []
        for m in W.finditer((fw.CACHE / 'wlc' / f'{b}.xml').read_text(encoding='utf-8')):
            if m[1]:
                _, c, v = m[1].split('.')
                ref, ws = (slug, int(c), int(v)), []
                continue
            if m[0] == '</verse>':
                out[ref] = ws
                continue
            nums = [p for p in m[3].split('/') if re.match(r'\d', p)]
            morph = [x for x in re.sub(r'^[HA]', '', m[4]).split('/') if not x.startswith('S')]
            ws.append((fw.letters(fw.MARKS.sub('', m[5])).translate(NORM), re.match(r'\d+', nums[-1])[0] if nums else '', morph[-1] if morph else ''))
    return out


def scope(spec):
    """«книга 10:38-39» → функция (книга, глава, стих) → bool"""
    if spec == '*': return lambda b, c, v: True
    m = re.fullmatch(r'([a-z-]+)(?: (\d+)(?::(\d+))?(?:-(\d+)(?::(\d+))?)?)?', spec)
    if not m: raise SystemExit(f'entities.json: непонятное место «{spec}»')
    book = m[1]
    if not m[2]: return lambda b, c, v: b == book
    c1 = int(m[2]); v1 = int(m[3]) if m[3] else 0
    if m[4] and m[5]: c2, v2 = int(m[4]), int(m[5])          # 12:3-13:5
    elif m[4] and m[3]: c2, v2 = c1, int(m[4])               # 10:38-39
    elif m[4]: c2, v2 = int(m[4]), 999                       # 10-12
    else: c2, v2 = c1, (v1 if m[3] else 999)                 # 10:3 или 7
    return lambda b, c, v: b == book and (c1, v1) <= (c, v) <= (c2, v2)


def entities():
    ents = json.loads((TEXTS / 'entities.json').read_text(encoding='utf-8'))
    index = {}
    for id_, e in ents.items():
        if e.get('nc') and '*' in e['in']: raise SystemExit(f'entities.json {id_}: `nc` — только с точным `in`')
        tests = [scope(s) for s in e['in']]
        for n in e['s']:
            if n in GODLY: raise SystemExit(f'entities.json {id_}: {n} — Имя Всевышнего')
            index.setdefault(n, []).append((id_, tests, bool(e.get('nc'))))
    return ents, index


def align(v, words):
    """слова нашего стиха (через пробел и макаф) → [(номер слова, буквы, номер Стронга, разбор)]"""
    ws = words.get((v['b'], v['c'], v['v']), [])
    parts = [p for p in re.split(r'[ ־]+', v['he'].replace('׃', '').strip()) if p]
    out, i = [], 0
    for k, p in enumerate(parts):
        L = fw.letters(p).translate(NORM)
        if not L: continue
        for j in range(i, min(i + 4, len(ws))):
            if ws[j][0] == L:
                out.append((k, *ws[j]))
                i = j + 1
                break
    return out


def link(index, b, c, v, num, morph):
    """id записи для слова, None — не имя или имени нет в записях; 'AMBIGUOUS:…' — две записи на одно место"""
    name = morph.startswith(('Np', 'Ng'))
    hits = [i for i, tests, nc in index.get(num, []) if (name or nc) and any(t(b, c, v) for t in tests)]
    if len(hits) > 1: return 'AMBIGUOUS:' + ','.join(hits)
    return hits[0] if hits else None


def cmd_build():
    ents, index = entities()
    words = oshb()
    OUT.mkdir(parents=True, exist_ok=True)
    tot = days = 0
    refs = {}  # id → [(дата, раздел, «книга глава:стих»)] — где имя встречается в цикле (для справочника)
    for f in sorted(DAYS.glob('????-??-??.json')):
        day = json.loads(f.read_text(encoding='utf-8'))
        vmap, order, out = {}, {}, {}
        for s in ('neviim', 'ketuvim'):
            order[s] = []
            for v in day[s]['verses']:
                row = {}
                for k, _, num, morph in align(v, words):
                    i = link(index, v['b'], v['c'], v['v'], num, morph)
                    if not i: continue
                    if i.startswith('AMBIGUOUS'): raise SystemExit(f"{f.name} {v['b']} {v['c']}:{v['v']}: {i} — уточните `in`")
                    row[str(k)] = i
                    tot += 1
                    ref = f"{v['b']} {v['c']}:{v['v']}"
                    r = refs.setdefault(i, [])
                    if not r or r[-1][2] != ref: r.append((f.stem, s, ref))
                    if i not in order[s]: order[s].append(i)
                if row: vmap[f"{v['b']} {v['c']}:{v['v']}"] = row
        keep = ('k', 'he', 'fa', 'mo', 'sp', 'ch', 'll', 'sure', 'a')
        for s in order:
            for i in order[s]:
                out[i] = {k: ents[i][k] for k in keep if k in ents[i]}
        for i in list(out):
            for j in [out[i].get('fa'), out[i].get('mo'), *out[i].get('sp', []), *out[i].get('ch', [])]:
                if j and j not in out: out[j] = {'k': ents[j]['k'], 'he': ents[j]['he']}
        (OUT / f.name).write_text(json.dumps({'v': vmap, 'o': order, 'e': out}, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
        days += 1
    # справочник (`#/atlas`): все записи и где они в цикле — сколько стихов и первые 40
    keep = ('k', 'he', 'fa', 'mo', 'sp', 'ch', 'll', 'sure', 'a')
    every = {i: {k: e[k] for k in keep if k in e} for i, e in ents.items()}
    # по главам: [дата первого стиха главы, раздел, «книга глава:стих»] — глава один раз, не больше 150
    def chapters(r):
        out, seen = [], set()
        for date, sec, ref in r:
            ch = ref.split(':')[0]
            if ch not in seen: seen.add(ch); out.append([date, sec, ref])
        return out[:150]
    where = {i: [len(r), chapters(r)] for i, r in refs.items()}
    (OUT / 'all.json').write_text(json.dumps({'e': every, 'r': where}, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print(f'build: {days} days, {tot} names in the text linked to {len(ents)} records')
    cmd_map([[i, *e['ll'], e['he']] for i, e in ents.items() if e.get('t')])


def clip(ring, box):
    """Сазерленд — Ходжмен: многоугольник, обрезанный прямоугольником (суша — заливкой, без обрывков у края)"""
    x0, y0, x1, y1 = box
    def cut(pts, inside, cross):
        out = []
        for i, p in enumerate(pts):
            q = pts[i - 1]
            if inside(p):
                if not inside(q): out.append(cross(q, p))
                out.append(p)
            elif inside(q): out.append(cross(q, p))
        return out
    at_x = lambda x: lambda a, b: [x, a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])]
    at_y = lambda y: lambda a, b: [a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]), y]
    for inside, cross in ((lambda p: p[0] >= x0, at_x(x0)), (lambda p: p[0] <= x1, at_x(x1)),
                          (lambda p: p[1] >= y0, at_y(y0)), (lambda p: p[1] <= y1, at_y(y1))):
        ring = cut(ring, inside, cross)
        if not ring: break
    return ring


def simplify(pts, eps):
    """Дуглас — Пекер"""
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1e-12
    i, dmax = 0, -1
    for j in range(1, len(pts) - 1):
        d = abs(dy * pts[j][0] - dx * pts[j][1] + x2 * y1 - y2 * x1) / L
        if d > dmax: i, dmax = j, d
    if dmax <= eps: return [pts[0], pts[-1]]
    return simplify(pts[:i + 1], eps)[:-1] + simplify(pts[i:], eps)


def cmd_map(towns=None):
    x0, y0, x1, y1 = BBOX
    box = (x0 - .5, y0 - .5, x1 + .5, y1 + .5)
    inside = lambda p: box[0] <= p[0] <= box[2] and box[1] <= p[1] <= box[3]
    rnd = lambda pts: [[round(a, 3), round(b, 3)] for a, b in pts]
    out = {}
    for key, f in (('land', 'ne_10m_land'), ('lakes', 'ne_10m_lakes'), ('rivers', 'ne_10m_rivers_lake_centerlines')):
        lines = []
        for ft in json.loads((CACHE / f'{f}.geojson').read_text(encoding='utf-8'))['features']:
            g = ft['geometry']
            if not g: continue
            if g['type'] in ('Polygon', 'MultiPolygon'):
                for poly in ([g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']):
                    ring = clip([p[:2] for p in poly[0][:-1]], box)
                    if len(ring) < 3: continue
                    # кольцо — двумя половинами: у замкнутой линии Дуглас — Пекер схлопывается
                    m = len(ring) // 2
                    s = simplify(ring[:m + 1], 0.004)[:-1] + simplify(ring[m:] + [ring[0]], 0.004)[:-1]
                    if len(s) >= 3: lines.append(rnd(s))
                continue
            for pts in ([g['coordinates']] if g['type'] == 'LineString' else g['coordinates']):
                run = []
                for p in pts + [[None, None]]:
                    if p[0] is not None and inside(p): run.append(p[:2])
                    else:
                        if len(run) > 1: lines.append(rnd(simplify(run, 0.004)))
                        run = []
        out[key] = lines
    OUT.mkdir(parents=True, exist_ok=True)
    if towns is None and (OUT / 'map.json').exists():
        towns = json.loads((OUT / 'map.json').read_text(encoding='utf-8')).get('towns', [])
    out['towns'] = towns or []
    (OUT / 'map.json').write_text(json.dumps({'bbox': BBOX, **out}, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print('map:', {k: len(v) for k, v in out.items()})


def cmd_todo(lang, until=None):
    """до даты: имена (Np / Ng) без записи — добавить в entities.json (или уточнить `in`), записи отрывков без справки"""
    ents, index = entities()
    words = oshb()
    have = json.loads((TEXTS / f'{lang}.json').read_text(encoding='utf-8'))
    names, texts = {}, {}
    for f in sorted(DAYS.glob('????-??-??.json')):
        if until and f.stem > until: break
        day = json.loads(f.read_text(encoding='utf-8'))
        for s in ('neviim', 'ketuvim'):
            for v in day[s]['verses']:
                ref = f"{v['b']} {v['c']}:{v['v']}"
                for k, L, num, morph in align(v, words):
                    i = link(index, v['b'], v['c'], v['v'], num, morph)
                    if i and not i.startswith('AMBIGUOUS'):
                        if i not in have: texts.setdefault(i, (f.stem, ref))
                    elif morph.startswith(('Np', 'Ng')) and num not in GODLY:
                        names.setdefault(num, (f.stem, ref, L, i))
    for num, (date, ref, L, i) in names.items():
        print('NAME', date, ref, num, L, i or 'нет записи', sep='\t')
    for i, (date, ref) in texts.items():
        print('TEXT', date, ref, i, ents[i]['he'], sep='\t')
    print(f'{len(names)} names without a record, {len(texts)} records without {lang}', file=sys.stderr)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['fetch']: cmd_fetch()
    elif a == ['build']: cmd_build()
    elif a == ['map']: cmd_map()
    elif a[:1] == ['todo'] and len(a) in (2, 3): cmd_todo(*a[1:])
    else: sys.exit(__doc__)
