#!/usr/bin/env python3
"""
«Living the Mizmor» — практические выводы к главам Теґилим с nafshi.org (ред. Ицхок Кирзнер).

    python3 scripts/fetch-nafshi.py fetch    # страницы раздела Tehillim → .cache/nafshi (не в git)
    python3 scripts/fetch-nafshi.py ru       # src/nafshi/ru.json → public/reading/living/ru/<глава>.json (без сети)
    python3 scripts/fetch-nafshi.py build    # → src/nafshi/living.json и маячки public/reading/living/<глава>.json

Условия сайта (главная nafshi.org, «How Does NAFSHI Work?»): текст отдельных глав можно свободно скачивать и
копировать; некоммерческое воспроизведение по главам не ограничено; нельзя издавать книгой и использовать
коммерчески. Это НЕ общественное достояние: подпись и ссылка обязательны, перевод и переработка — лучше с
письменного согласия редактора. На сайте — маячки у стихов Теґилим («Святое чтение»), по-английски, с подписью и ссылкой.

Русский перевод проекта — src/nafshi/ru.json (те же записи по порядку: {title, quote?, text?}; сверяет
check-reading.ts); `python3 scripts/fetch-nafshi.py ru` (и build) кладёт его в public/reading/living/ru/<глава>.json —
окно маячка на русском сайте показывает перевод, со ссылкой на английский оригинал.

Раздел есть не у всех глав (у автора — работа продолжается): 1–67 и 120–134.
"""
import html, json, re, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cache' / 'nafshi'
OUT = ROOT / 'src' / 'nafshi' / 'living.json'
API = 'https://nafshi.org/wp-json/wp/v2/posts?categories=3&per_page=100&orderby=id&order=asc&page=%d'
KINDS = {'lessons': 'lessons', 'tefillos': 'tefillos', 'tehillos': 'tehillos'}
HE = r'֐-׿'


def fetch():
    CACHE.mkdir(parents=True, exist_ok=True)
    for page in (1, 2):
        req = urllib.request.Request(API % page, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=120).read()
        (CACHE / f'tehillim-{page}.json').write_bytes(data)
        print(page, len(json.loads(data)))


def blocks(h):
    h = re.sub(r'<(script|style)[^>]*>.*?</\1>', '', h, flags=re.S)
    h = re.sub(r'</(div|p|h[1-6]|li|tr)>|<br\s*/?>', '\n', h)
    t = html.unescape(re.sub(r'<[^>]+>', '', h)).replace('\xa0', ' ')
    return [tidy(b) for b in t.split('\n') if b.strip()]


def tidy(s):
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'\s+([.,;:!?”])', r'\1', s)
    return re.sub(r'([“(\[])\s+', r'\1', s)


ITEM = re.compile(
    r'^\[(\d+):(\d+)(?:\s*[-–—]\s*(\d+))?\]\s*'          # [23:1]
    r'([^–—' + HE + r']*?)\s*\.?\s*[–—-]\s*'               # SHEPHERD. –
    r'([' + HE + r'][' + HE + r'\s’\'"־\-.,:;!?()]*?)\s*[–—-]?\s*'  # иврит –
    r'“([^”]*)”\s*(.*)$')                                  # “перевод” вывод


def head(x):
    """«Tefillos for Life – Your Gratitude .» → ('tefillos', 'Your Gratitude')"""
    m = re.match(r'^(Lessons|Tefillos|Tehillos) for Life(?:\s*[–—-]\s*(.*?))?\s*\.?$', x, re.I)
    if m:
        return KINDS[m.group(1).lower()], (m.group(2) or '').strip()
    return None


def parse(bl):
    start = [k for k, x in enumerate(bl) if re.fullmatch(r'Living the Mizmor\.?', x)]
    if not start:
        return None
    body = []
    for x in bl[start[0] + 1:]:
        if re.fullmatch(r'Sources\.?', x):
            break
        body.append(x)
    out = {'intro': '', 'groups': []}
    for x in body:
        h = head(x)
        if h:
            out['groups'].append({'kind': h[0], 'topic': h[1], 'items': []})
        elif x.startswith('['):
            if not out['groups']:
                out['groups'].append({'kind': 'other', 'topic': '', 'items': []})
            m = ITEM.match(x)
            ref = re.match(r'^\[(\d+:\d+(?:\s*[-–—]\s*\d+)?)\]', x)
            item = {'ref': re.sub(r'\s*[–—]\s*', '-', ref.group(1)) if ref else ''}
            if m and '[' not in m.group(7):
                item.update(title=m.group(4).strip(' .'), he=m.group(5).strip(), quote=m.group(6).strip(),
                            text=m.group(7).strip())
            else:
                item['raw'] = x  # сложная запись (два стиха в одной) — как есть
            out['groups'][-1]['items'].append(item)
        elif not out['groups']:
            out['intro'] = (out['intro'] + ' ' + x).strip()
        elif len(x) < 40:
            out['groups'].append({'kind': 'other', 'topic': x.strip(' .'), 'items': []})
        else:
            out['groups'][-1].setdefault('notes', []).append(x)
    return out


def build():
    posts = []
    for f in sorted(CACHE.glob('tehillim-*.json')):
        posts += json.loads(f.read_text())
    res, intro = {}, None
    for p in posts:
        title = tidy(html.unescape(p['title']['rendered']))
        bl = blocks(p['content']['rendered'])
        if p['slug'] == 'introduction-to-tehillim':
            k = [i for i, x in enumerate(bl) if x.startswith('Living the Mizmor')]
            intro = {'url': p['link'], 'text': bl[k[0]:] if k else []}
            continue
        m = re.match(r'^Mizmor (\d{3})\s*[–—.-]\s*(.*)$', title)
        if not m or '-' in title[:12] and title[10] == '-':
            continue
        living = parse(bl)
        if not living:
            continue
        n = int(m.group(1))
        assert str(n) not in res, title
        rev = next((int(r.group(1)) for x in bl for r in [re.search(r'\[\s*Rev\.?\s*(\d+)\s*\]', x)] if r), None)
        bad = [i['ref'] for g in living['groups'] for i in g['items'] if not i['ref'].startswith(f'{n}:')]
        if bad:
            print(f'  ⚠ Mizmor {n}: ссылка на другую главу {bad}')
        res[str(n)] = {'n': n, 'title': m.group(2).strip(), 'url': p['link'], 'rev': rev,
                       'modified': p['modified'][:10], **living}
    res = dict(sorted(res.items(), key=lambda kv: int(kv[0])))
    data = {
        'source': 'nafshi.org — Tehillim, section “Living the Mizmor”',
        'editor': 'Yitzchok Kirzner',
        'terms': 'Free non-commercial reproduction chapter by chapter; not in book form, no commercial use '
                 '(nafshi.org, “How Does NAFSHI Work?”). Not public domain — credit and link required.',
        'fetched': max(p['modified'][:10] for p in posts),
        'about': intro,
        'mizmorim': res,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + '\n')
    items = [i for v in res.values() for g in v['groups'] for i in g['items']]
    print(f'глав: {len(res)} · выводов: {len(items)} · не разобрано по полям: {sum("raw" in i for i in items)}')
    print('главы:', ranges(sorted(map(int, res))))


# ── маячки «Святого чтения»: public/reading/living/<глава>.json ─────────────────────────────────────────────────────
PUB = ROOT / 'public' / 'reading' / 'living'
TEXT = ROOT / 'public' / 'reading' / 'tehillim'
TOPICS = [('behavior', 'behavior'), ('actions', 'behavior'), ('attitude', 'attitude'), ('relationship', 'relationship'),
          ('gratitude', 'gratitude'), ('anguish', 'anguish'), ('teshuvah', 'teshuvah'), ('berachah', 'berachah'),
          ('refuah', 'refuah'), ('yeshuah', 'yeshuah'), ('geulah', 'geulah'), ('contemplation', 'contemplation'),
          ('acclaim', 'acclaim'), ('praise', 'contemplation'), ('requests', 'requests')]
FINAL = str.maketrans('ךםןףץ', 'כמנפצ')


def bare(s):
    """согласные слова: без огласовок и знаков, конечные = обычные; Имена источника (ה’, אלקים) — как в тексте"""
    s = re.sub(r'ה[’‘\'׳](?![א-ת])', 'יהוה', s)
    s = re.sub(r'[\u0591-\u05c7]', '', s)
    s = s.replace('אלק', 'אלה').replace('אלוק', 'אלה').replace('א־ל', 'אל').replace('א-ל', 'אל').replace('אלוה', 'אלה')
    s = re.sub(r'[^א-ת]', '', s).translate(FINAL)
    return s


def words_of(s):
    return [w for w in (bare(x) for x in re.split(r'[\s\u05be]+', s)) if w]


def loose(w):
    return w.replace('ו', '').replace('י', '')


def find(verse, he):
    """куски стиха (между пробелами; макаф не делит), в которых стоят слова `he` подряд → [первый, последний] или None"""
    toks = verse.split()
    flat = [(bare(part), i) for i, t in enumerate(toks) for part in t.split('\u05be') if bare(part)]
    want = words_of(he)
    if not want:
        return None
    for eq in (lambda a, b: a == b, lambda a, b: loose(a) == loose(b)):
        for k in range(len(flat) - len(want) + 1):
            if all(eq(flat[k + j][0], want[j]) for j in range(len(want))):
                return [flat[k][1], flat[k + len(want) - 1][1]]
    return None


def topic_id(t):
    low = t.lower()
    return next((v for k, v in TOPICS if k in low), '')


def beacons():
    data = json.loads(OUT.read_text())
    PUB.mkdir(parents=True, exist_ok=True)
    for f in PUB.glob('*.json'):
        f.unlink()
    total = placed = 0
    for key, mz in data['mizmorim'].items():
        verses = json.loads((TEXT / f'{key}.json').read_text())['v']
        items = []
        for g in mz['groups']:
            for it in g['items']:
                m = re.match(r'(\d+):(\d+)', it['ref'])
                if not m or int(m.group(1)) != mz['n'] or not 1 <= int(m.group(2)) <= len(verses):
                    print(f'  ⚠ {key}: нет стиха {it["ref"]}')
                    continue
                v = int(m.group(2))
                if 'raw' in it:  # запись с опечаткой источника: слова стиха — первый кусок иврита, текст — как есть
                    raw = re.sub(r'^\[[^\]]*\]\.?\s*', '', it['raw'])
                    hm = re.search('[' + HE + '][' + HE + r'\s’‘\'"־,:;.\-]*', raw)
                    he = hm.group(0) if hm else ''
                    txt = re.sub(r'\[\d+:\d+\]', '', re.sub('[' + HE + r'][' + HE + r'’‘־]*', '', raw))
                    rec = {'text': tidy(re.sub(r'(\s*[–—]\s*)+', ' ', txt)).strip(' –—-')}
                    tm = re.match(r'^([A-Z][A-Z ’\'-]{2,})\.', raw)
                    if tm:
                        rec['title'] = tm.group(1).strip()
                        rec['text'] = rec['text'][len(tm.group(1)):].strip(' –—-.')
                else:
                    he = it['he']
                    rec = {'title': it['title'], 'quote': it['quote'], 'text': it['text']}
                rec = {k: x for k, x in rec.items() if x}
                if not rec.get('text') and not rec.get('quote'):
                    continue
                r = find(verses[v - 1], he)
                total += 1
                out = {'v': v, 'kind': g['kind'], 'topic': topic_id(g['topic'])}
                if r:
                    placed += 1
                    out['r'] = r
                    # те же слова буквами, как в keys.json «Ключевых мест»: по ним маячок встаёт в стихе отрывка дня Ктувим
                    toks = verses[v - 1].split()[r[0]:r[1] + 1]
                    out['w'] = ' '.join(x for t in toks for x in (re.sub(r'[^א-ת]', '', part) for part in t.split('\u05be')) if x)
                out.update(rec)
                items.append(out)
        items.sort(key=lambda x: (x['v'], x.get('r', [0])[0]))
        (PUB / f'{key}.json').write_text(json.dumps({'c': mz['n'], 'title': mz['title'], 'url': mz['url'], 'items': items},
                                                    ensure_ascii=False, separators=(',', ':')) + '\n')
    (PUB / 'index.json').write_text(json.dumps({
        'source': 'Living the Mizmor — nafshi.org', 'editor': data['editor'], 'url': 'https://nafshi.org/category/tehillim/',
        'terms': data['terms'], 'chapters': sorted(int(k) for k in data['mizmorim'])}, ensure_ascii=False) + '\n')
    print(f'маячки: {total} · слова найдены в стихе: {placed} · у номера стиха: {total - placed}')


def ru():
    """src/nafshi/ru.json → public/reading/living/ru/<глава>.json (окно маячка на русском сайте; без сети)."""
    src = json.loads((ROOT / 'src' / 'nafshi' / 'ru.json').read_text())['chapters']
    out = PUB / 'ru'
    out.mkdir(parents=True, exist_ok=True)
    for c, ch in src.items():
        (out / f'{c}.json').write_text(json.dumps(ch, ensure_ascii=False, separators=(',', ':')) + '\n')
    print(f'русский перевод маячков: глав {len(src)}')


def ranges(ns):
    out, a = [], None
    for i, n in enumerate(ns):
        if a is None:
            a = n
        if i + 1 == len(ns) or ns[i + 1] != n + 1:
            out.append(str(a) if a == n else f'{a}–{n}')
            a = None
    return ', '.join(out)


if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    if cmd == 'fetch':
        fetch()
    elif cmd == 'build':
        build()
        beacons()
        ru()
    elif cmd == 'ru':
        ru()
    else:
        print(__doc__)
