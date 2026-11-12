#!/usr/bin/env python3
"""
«Living the Mizmor» — практические выводы к главам Теґилим с nafshi.org (ред. Ицхок Кирзнер).

    python3 scripts/fetch-nafshi.py fetch    # страницы раздела Tehillim → .cache/nafshi (не в git)
    python3 scripts/fetch-nafshi.py build    # → src/nafshi/living.json

Условия сайта (главная nafshi.org, «How Does NAFSHI Work?»): текст отдельных глав можно свободно скачивать и
копировать; некоммерческое воспроизведение по главам не ограничено; нельзя издавать книгой и использовать
коммерчески. Это НЕ общественное достояние: подпись и ссылка обязательны, перевод и переработка — лучше с
письменного согласия редактора. На сайт Нифлаот эти данные пока не выводятся.

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
    else:
        print(__doc__)
