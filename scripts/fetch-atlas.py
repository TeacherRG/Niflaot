#!/usr/bin/env python3
"""
«Кто и где» — справки о людях и местах Пророков и Писаний: окошко над именем в стихе и блок под отрывком дня.

    python3 scripts/fetch-atlas.py fetch   # открытые данные → .cache/atlas (без них build не работает)
    python3 scripts/fetch-atlas.py build   # → public/tanakh/atlas/<дата>.json и public/tanakh/atlas/map.json
    python3 scripts/fetch-atlas.py todo ru [до-даты]   # кто встречается в отрывках до даты и ещё без справки на языке

Файл дня `public/tanakh/atlas/<дата>.json`:
  `v` — {«книга глава:стих»: {номер слова нашего текста (через пробел и макаф, как в HeVerse): id}};
  `o` — {neviim|ketuvim: [id по порядку первого появления в отрывке]};
  `e` — {id: справка}: `k` m — мужчина, f — женщина, g — народ / род / группа, p — место, x — другое;
        `he` — имя на иврите (с огласовками), `en` — имя по-английски (как в ESV — запасное, своё — в src/tanakh/atlas/en.json);
        у людей — `fa`, `mo`, `sp`, `sib`, `ch` (отец, мать, супруги, братья и сёстры, дети — id; их справки тоже в `e`);
        у мест — `ll` [широта, долгота], `q` — уверенность в месте 0–1000 (OpenBible), `ty` — вид (settlement, river…);
        `n` — в скольких стихах Танаха упоминается, `bk` — {книга: стихов}.
`map.json` — суша (многоугольники, обрезанные по окну карты), озёра, реки и `towns` — ориентиры: [id, широта, долгота,
иврит, английский, упоминаний] (известные города, место надёжно), от Синая до Ливана (Natural Earth, PD), упрощённые: для своей SVG-карты
(без чужих тайлов — работает офлайн, печатается, никого не отслеживает).

Источники (свободные лицензии; подпись — под блоком «Кто и где» и в «О проекте»):
  STEPBible Data (github.com/STEPBible/STEPBible-Data, Tyndale House, Cambridge) — CC BY 4.0:
    TAHOT — каждое слово Танаха с «различённым» номером Стронга: какое именно лицо или место названо в этом стихе;
    TIPNR — все имена собственные: семья, колено, все упоминания, координаты мест (по OpenBible).
    Описания TIPNR (Brief/Short/Article — написаны ИИ, по христианским словарям) НЕ берём: справки пишет проект —
    src/tanakh/atlas/<ru|en|de>.json, по простому смыслу стиха (Раши, Мецудат Давид, Седер олам).
  OpenBible.info Bible Geocoding Data (github.com/openbibleinfo/Bible-Geocoding-Data) — CC BY 4.0: где это место и насколько
    уверенно (time_total лучшей идентификации).
  Natural Earth (naturalearthdata.com) — Public Domain: берег, озёра, реки.
Имя Всевышнего (LORD, God…) справкой не становится — в окошке над ним, как и было, «Имя Всевышнего».
"""
import json, math, re, sys, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cache' / 'atlas'
DAYS = ROOT / 'public' / 'tanakh'
OUT = DAYS / 'atlas'
TEXTS = ROOT / 'src' / 'tanakh' / 'atlas'
STEP = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/'
TIPNR = 'Proper Nouns/TIPNR - Translators Individualised Proper Names with all References - STEPBible.org CC BY.txt'
TAHOT = [f'Translators Amalgamated OT+NT/TAHOT {p} - Translators Amalgamated Hebrew OT - STEPBible.org CC BY.txt'
         for p in ('Jos-Est', 'Job-Sng', 'Isa-Mal')]
GEO = 'https://raw.githubusercontent.com/openbibleinfo/Bible-Geocoding-Data/main/data/ancient.jsonl'
NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'

BOOKS = {
    'Jos': 'joshua', 'Jdg': 'judges', '1Sa': 'i-samuel', '2Sa': 'ii-samuel', '1Ki': 'i-kings', '2Ki': 'ii-kings',
    'Isa': 'isaiah', 'Jer': 'jeremiah', 'Ezk': 'ezekiel', 'Hos': 'hosea', 'Jol': 'joel', 'Amo': 'amos',
    'Oba': 'obadiah', 'Jon': 'jonah', 'Mic': 'micah', 'Nam': 'nahum', 'Hab': 'habakkuk', 'Zep': 'zephaniah',
    'Hag': 'haggai', 'Zec': 'zechariah', 'Mal': 'malachi', 'Psa': 'psalms', 'Pro': 'proverbs', 'Job': 'job',
    'Sng': 'song-of-songs', 'Rut': 'ruth', 'Lam': 'lamentations', 'Ecc': 'ecclesiastes', 'Est': 'esther',
    'Dan': 'daniel', 'Ezr': 'ezra', 'Neh': 'nehemiah', '1Ch': 'i-chronicles', '2Ch': 'ii-chronicles',
}
# Тора — в счёт упоминаний (книга → наш id), но не в отрывки дня
TORAH = {'Gen': 'genesis', 'Exo': 'exodus', 'Lev': 'leviticus', 'Num': 'numbers', 'Deu': 'deuteronomy'}
# Имена Всевышнего и «небесное» — не справки
SKIP = re.compile(r'^(LORD|God|Lord|Almighty|Most High|Holy One|Rock|Lord of hosts|LORD of hosts|Mighty One)@')
KIND = {'Male': 'm', 'Female': 'f', 'Group': 'g', 'Place': 'p'}
# «другое» (Сэла, Песах, музыкальные слова надписей Теґилим) — не справка; кроме этих (id → вид)
KIND_FIX = {'3477H': 'x'}   # Сефер ґа-Яшар — книга, у TIPNR — «человек»
X_ALLOW = {'3477H'}
# ошибки разметки TAHOT в стихе: (книга, глава, стих) → {неверный id: верный}
# (None — не справка). 7:17 — «семья Зераха» из колена Йеґуды (7:1, 7:18), не Зерах, сын Шимона; 12:23 — «царь Гоима в
# Гилгале» (לְגִלְגָּל), не Галилея (так читает Септуагинта); 12:22 — «Йокнеам у Кармеля» — гора Кармель, не город Кармель в Йеґуде
FIX = {('joshua', 7, 17): {'2226L': '2226I'}, ('joshua', 12, 23): {'1551': None}, ('joshua', 12, 22): {'3760G': '3760H'}}
# семья не по традиции: id → {поле: None (убрать) или новое значение}. Давид: «Авигайль, дочь Нахаша» (Шмуэль II 17:25) —
# Нахаш — это Ишай, умерший «из-за змея» (נחש), без своего греха (Бава Батра 17а; Радак там): не мать Давида
FAMILY_FIX = {'1732': {'mo': None}}
# имя на иврите, где у TIPNR его нет или оно не то, что в стихе
HE_FIX = {'5158M': 'שִׁיחוֹר', '5911': 'עָכוֹר', '3844I': 'בִּקְעַת הַלְּבָנוֹן'}
# место: берём точку, только если это не целая страна / область (их точка на карте обманывает)
AREA = {'region', 'country', 'people group'}
# окно карты: от Синая и Египетского потока до Ливана и Гилада
BBOX = (33.6, 29.4, 37.2, 34.0)

MARKS = re.compile(r'[֑-ֽ֯׀׃-׆]')   # знаки кантилляции, мeтег, пасек, соф пасук
POINTS = re.compile(r'[֑-ׇ]')
NORM = str.maketrans('ךםןףץק', 'כמנפצה')


def letters(s):
    return re.sub(r'[^א-ת]', '', POINTS.sub('', s)).translate(NORM)


def cmd_fetch():
    CACHE.mkdir(parents=True, exist_ok=True)
    for p in [TIPNR, *TAHOT]:
        urllib.request.urlretrieve(STEP + urllib.parse.quote(p), CACHE / Path(p).name)
    urllib.request.urlretrieve(GEO, CACHE / 'ancient.jsonl')
    for f in ('ne_10m_land', 'ne_10m_lakes', 'ne_10m_rivers_lake_centerlines'):
        urllib.request.urlretrieve(f'{NE}{f}.geojson', CACHE / f'{f}.geojson')
    print(f'saved to {CACHE}')


def refs(s):
    """«Jos.9.3; Jos.9.17; Num.13.8,16; 1Ch.8.29a» → [(книга, глава, стих)] (Тора и Пророки/Писания; LXX — нет)"""
    out, book, ch = [], None, None
    for part in re.split(r';\s*', s.strip()):
        if not part or part.startswith('LXX'): continue
        m = re.match(r'(?:([1-3]?[A-Z][a-z]{1,2})\.)?(?:(\d+)\.)?(\d+)[a-z]?((?:,\d+[a-z]?)*)$', part)
        if not m: continue
        book = m[1] or book
        ch = int(m[2]) if m[2] else ch
        for v in [m[3], *re.findall(r'\d+', m[4])]:
            out.append((book, ch, int(v)))
    return out


# «различённый» номер Стронга (H3389, H3091G…) → запись TIPNR: TAHOT и TIPNR иногда называют одно лицо по-разному
# (Jerusalem@Jos.10.1 / Jerusalem@Gen.14.18) — тогда находим по номеру
DSTRONG = {}


def tipnr():
    """UnifiedName → справка (без описаний TIPNR)"""
    text = (CACHE / Path(TIPNR).name).read_text(encoding='utf-8')
    recs, cur, sect = {}, None, None
    dstr = DSTRONG
    for line in text.split('\n'):
        line = line.rstrip('\r')
        if line.startswith('$=========='):
            sect = 'place' if 'PLACE' in line else 'other' if 'OTHER' in line else 'person'
            cur = None
            continue
        f = line.split('\t')
        if re.match(r'[^\t– @]+@[^\t]+=[HG]\d', f[0]):
            name, ustrong = f[0].split('=', 1)
            if not ustrong.startswith('H'):
                cur = None
                continue
            typ = f[8].strip() if len(f) > 8 else ''
            cur = recs[name] = {'name': name, 'id': ustrong[1:], 'sect': sect, 'type': typ, 'f': f, 'he': None, 'main': False, 'refs': []}
            continue
        if cur and line.startswith('– ') and not line.startswith('– Total') and len(f) > 4:
            d = re.match(r'(H\w+?)«', f[2])
            if d: dstr.setdefault(d[1], cur)
            m = re.search(r'«H\w+=([^\t]+)', f[2])
            if m and (cur['he'] is None or (not cur['main'] and f[0].strip() in ('– Named', '– Group', '– Mentioned'))):
                cur['he'] = MARKS.sub('', m[1]).split(',')[0].strip()
                cur['main'] = f[0].strip() in ('– Named', '– Group', '– Mentioned')
            cur['refs'] += refs(f[4])
    return recs


def family(rec, by_name):
    f = rec['f']
    # безымянные («дочь фараона», «жена Шимона») — без имени на иврите — в семью не идут
    ids = lambda s: [by_name[n]['id'] for n in (x.strip() for x in re.findall(r'[^,+]+@[^,+\s]+', s or '')) if n in by_name and by_name[n]['he']]
    out = {}
    if rec['sect'] == 'person':
        par = (f[2] if len(f) > 2 else '').split('+')
        fa, mo = ids(par[0]) if par else [], ids(par[1]) if len(par) > 1 else []
        if fa: out['fa'] = fa[0]
        if mo: out['mo'] = mo[0]
        for key, i in (('sib', 3), ('sp', 4), ('ch', 5)):
            v = ids(f[i] if len(f) > i else '')
            if v: out[key] = v[:12]
    return out


def geo():
    """«Gibeon@Jos.9.3» → (широта, долгота, уверенность 0–1000, вид)"""
    out, owned = {}, set()
    for line in (CACHE / 'ancient.jsonl').read_text(encoding='utf-8').split('\n'):
        if not line.strip(): continue
        d = json.loads(line)
        keys = [v['id'] for v in d.get('linked_data', {}).values() if isinstance(v, dict) and '@' in str(v.get('id', ''))]
        ids = d.get('identifications') or []
        if not keys or not ids: continue
        best = ids[0]
        res = next((r for r in best.get('resolutions', []) if r.get('lonlat')), None)
        if not res: continue
        lon, lat = map(float, res['lonlat'].split(','))
        val = (round(lat, 4), round(lon, 4), max(0, min(1000, int(best.get('score', {}).get('time_total', 0)))), (d.get('types') or [''])[0])
        own = re.sub(r'\s*\d+$', '', d.get('friendly_id', ''))
        # по имени OpenBible (у TIPNR — поле «OpenBible name»: Bethel_1, Jerusalem): связь надёжнее id записи
        out['#' + d.get('friendly_id', '')] = val
        for k in keys:
            # одно место может быть связано с несколькими записями («долина Гивона» → Гивон): своя запись важнее
            # своя запись важнее; из нескольких своих (Babylon 1 — город, Babylon 2 — Рим в Новом Завете) — первая
            if k not in out or (own == k.split('@')[0] and k not in owned): out[k] = val
            if own == k.split('@')[0]: owned.add(k)
    return out


def tahot():
    """(книга, глава, стих) по нашей (еврейской) нумерации → [(буквы слова, UnifiedName или None)]"""
    out = {}
    W = re.compile(r'^([1-3]?[A-Z][a-z]{1,2})\.(\d+)\.(\d+)(?:\((\d+)\.(\d+)\))?#\d+=([A-Z(][^\t]*)\t([^\t]*)\t[^\t]*\t[^\t]*\t[^\t]*\t.*$')
    for p in TAHOT:
        for line in (CACHE / Path(p).name).read_text(encoding='utf-8').split('\n'):
            m = W.match(line.rstrip('\r'))
            if not m or m[1] not in BOOKS or m[6].startswith('X'): continue
            c, v = (int(m[4]), int(m[5])) if m[4] else (int(m[2]), int(m[3]))
            n = re.search(r'\{(H\w+)=[^}]*?»([^}@»]+@[^}]+)\}', line)
            name = (n[2].split('|')[-1].strip(), n[1]) if n else None
            out.setdefault((BOOKS[m[1]], c, v), []).append((letters(m[7]), name))
    return out


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
    print('map:', {k: (len(v), sum(map(len, v))) for k, v in out.items()})


def cmd_build():
    recs = tipnr()
    by_name = {n: r for n, r in recs.items()}
    by_id = {r['id']: r for r in recs.values()}
    places = geo()
    words = tahot()

    def entity(r, full):
        e = {'k': KIND_FIX.get(r['id']) or ('p' if r['sect'] == 'place' else KIND.get(r['type'], 'x')), 'he': HE_FIX.get(r['id'], r['he'] or ''),
             'en': r['name'].split('@')[0].replace('_', ' ')}
        if not full: return e
        e.update(family(r, by_name))
        for k, v in FAMILY_FIX.get(r['id'], {}).items():
            if v is None: e.pop(k, None)
            else: e[k] = v
        if e['k'] == 'p':
            nm, at = r['name'].split('@', 1)
            key = nm + '@' + re.sub(r'-[A-Za-z0-9]*$', '', at)
            ob = (r['f'][1] if len(r['f']) > 1 else '').split('=')[0].strip().replace('_', ' ')
            g = places.get('#' + ob) or places.get(key)
            if g and g[3] not in AREA:
                e['ll'], e['q'], e['ty'] = [g[0], g[1]], g[2], g[3]
            elif g: e['ty'] = g[3]
        vs = sorted({(b, c, v) for b, c, v in r['refs']}, key=lambda x: x)
        e['n'] = len(vs)
        bk = {}
        for b, c, v in vs:
            s = BOOKS.get(b) or TORAH.get(b)
            if s: bk[s] = bk.get(s, 0) + 1
        e['bk'] = bk
        return e

    OUT.mkdir(parents=True, exist_ok=True)
    tot = hit = days = 0
    missed = set()
    for f in sorted(DAYS.glob('????-??-??.json')):
        day = json.loads(f.read_text(encoding='utf-8'))
        vmap, order, ents = {}, {}, {}
        for s in ('neviim', 'ketuvim'):
            order[s] = []
            for v in day[s]['verses']:
                ws = words.get((v['b'], v['c'], v['v']), [])
                parts = [p for p in re.split(r'[ ־]+', v['he'].replace('׃', '').strip()) if p]
                row, i = {}, 0
                for k, p in enumerate(parts):
                    L = letters(p)
                    if not L: continue
                    for j in range(i, min(i + 4, len(ws))):
                        wl, name = ws[j]
                        if wl == L:
                            i = j + 1
                            r = name and not SKIP.match(name[0]) and (by_name.get(name[0]) or DSTRONG.get(name[1]))
                            if name and not r and not SKIP.match(name[0]): missed.add(name)
                            if r:
                                rid = FIX.get((v['b'], v['c'], v['v']), {}).get(r['id'], r['id'])
                                if rid is None: break
                                r = by_id[rid]
                                kind = KIND_FIX.get(rid) or ('p' if r['sect'] == 'place' else KIND.get(r['type'], 'x'))
                                if kind == 'x' and rid not in X_ALLOW: break
                                row[str(k)] = r['id']
                                tot += 1
                                if r['id'] not in order[s]: order[s].append(r['id'])
                            break
                if row: vmap[f"{v['b']} {v['c']}:{v['v']}"] = row
        for s in order:
            for i in order[s]:
                r = by_id[i]
                ents[i] = entity(r, True)
        for i in list(ents):
            for key in ('fa', 'mo', 'sp', 'sib', 'ch'):
                for j in ([ents[i][key]] if isinstance(ents[i].get(key), str) else ents[i].get(key, [])):
                    if j not in ents and j in by_id: ents[j] = entity(by_id[j], False)
        (OUT / f.name).write_text(json.dumps({'v': vmap, 'o': order, 'e': ents}, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
        days += 1
    if missed: print('not in TIPNR:', sorted(missed)[:20], len(missed))
    for k in FIX: assert all(i in by_id for i in FIX[k].values() if i)
    print(f'build: {days} days, {tot} names in the text linked to {len(recs)} records')
    # ориентиры на карте (серым): известные города и места, где место установлено надёжно, — по числу упоминаний
    towns = []
    for r in recs.values():
        if r['sect'] != 'place': continue
        e = entity(r, True)
        x0, y0, x1, y1 = BBOX
        if e.get('ll') and e.get('q', 0) >= 800 and e['n'] >= 25 and e.get('ty') == 'settlement' and x0 <= e['ll'][1] <= x1 and y0 <= e['ll'][0] <= y1:
            towns.append([r['id'], *e['ll'], e['he'], e['en'], e['n']])
    towns.sort(key=lambda t: -t[-1])
    cmd_map(towns)


def cmd_todo(lang, until=None):
    have = json.loads((TEXTS / f'{lang}.json').read_text(encoding='utf-8')) if (TEXTS / f'{lang}.json').exists() else {}
    need = {}
    for f in sorted(OUT.glob('????-??-??.json')):
        if until and f.stem > until: break
        d = json.loads(f.read_text(encoding='utf-8'))
        for s in ('neviim', 'ketuvim'):
            for i in d['o'][s]:
                if i not in have and i not in need: need[i] = (f.stem, d['e'][i])
    for i, (date, e) in need.items():
        print(date, i, e['k'], e['he'], e['en'], e.get('n'), sep='\t')
    print(len(need), 'without', lang, file=sys.stderr)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['fetch']: cmd_fetch()
    elif a == ['build']: cmd_build()
    elif a == ['map']: cmd_map()
    elif a[:1] == ['todo'] and len(a) in (2, 3): cmd_todo(*a[1:])
    else: sys.exit(__doc__)
