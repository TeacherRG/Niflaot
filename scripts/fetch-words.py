#!/usr/bin/env python3
"""
«Слова Танаха»: частотный словарь Пророков и Писаний для изучения иврита по словам отрывка дня.

    python3 scripts/fetch-words.py fetch     # открытая разметка Танаха и словарь → .cache/oshb (без них build не работает)
    python3 scripts/fetch-words.py build     # → src/tanakh/words.json и public/tanakh/words/<дата>.json
    python3 scripts/fetch-words.py todo ru   # слова без перевода на этом языке (по порядку частоты)

Источники (свободные лицензии):
  Open Scriptures Hebrew Bible (github.com/openscriptures/morphhb) — основная форма каждого слова текста (лемма, номер
  Стронга) и его разбор: CC BY 4.0, «Open Scriptures Hebrew Bible Project»; сам текст (WLC) — Public Domain;
  HebrewStrong.xml (github.com/openscriptures/HebrewLexicon) — заглавная форма слова с огласовками и его происхождение
  («from H1696») — словарь Стронга, Public Domain.
Считаются только Пророки и Писания (книги цикла); имена собственные — отдельно (не входят в словарь), приставки
ו ה ב ל מ כ ש — не слова. Нумерация стихов совпадает с нашими файлами дней (проверяется при сборке).
Переводы слов — проекта: src/tanakh/words/<ru|en|de>.json (`{"1961": "быть, стать, случиться"}`).
Имена Всевышнего в заглавной форме — как во всём проекте (אֱלֹקִים, אֵ-ל, אֲדֹ-נָי, שַׁ-דַּי).
"""
import collections, json, re, sys, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / '.cache' / 'oshb'
DAYS = ROOT / 'public' / 'tanakh'
OUT_DAYS = DAYS / 'words'
OUT = ROOT / 'src' / 'tanakh' / 'words.json'
TR = ROOT / 'src' / 'tanakh' / 'words'
RAW = 'https://raw.githubusercontent.com/openscriptures'
# сколько слов в словаре (с частотами и по дням); переводы — по мере готовности, с начала списка
SIZE = 1000

BOOKS = {
    'Josh': 'joshua', 'Judg': 'judges', '1Sam': 'i-samuel', '2Sam': 'ii-samuel', '1Kgs': 'i-kings', '2Kgs': 'ii-kings',
    'Isa': 'isaiah', 'Jer': 'jeremiah', 'Ezek': 'ezekiel', 'Hos': 'hosea', 'Joel': 'joel', 'Amos': 'amos',
    'Obad': 'obadiah', 'Jonah': 'jonah', 'Mic': 'micah', 'Nah': 'nahum', 'Hab': 'habakkuk', 'Zeph': 'zephaniah',
    'Hag': 'haggai', 'Zech': 'zechariah', 'Mal': 'malachi', 'Ps': 'psalms', 'Prov': 'proverbs', 'Job': 'job',
    'Song': 'song-of-songs', 'Ruth': 'ruth', 'Lam': 'lamentations', 'Eccl': 'ecclesiastes', 'Esth': 'esther',
    'Dan': 'daniel', 'Ezra': 'ezra', 'Neh': 'nehemiah', '1Chr': 'i-chronicles', '2Chr': 'ii-chronicles',
}
# Имена Всевышнего: заглавная форма на экране (номер Стронга → как писать)
# корень, который Стронг даёт неверно: номер → правильный (None — не показывать)
ROOT_FIX = {'1964': None, '4940': 'שפח', '5542': None}
NAMES = {'430': 'אֱלֹקִים', '433': 'אֱלוֹקַּ', '426': 'אֱלָהּ', '410': 'אֵ-ל', '136': 'אֲדֹ-נָי', '7706': 'שַׁ-דַּי', '3050': 'קָהּ'}


def cmd_fetch():
    (CACHE / 'wlc').mkdir(parents=True, exist_ok=True)
    for b in BOOKS:
        urllib.request.urlretrieve(f'{RAW}/morphhb/master/wlc/{b}.xml', CACHE / 'wlc' / f'{b}.xml')
    urllib.request.urlretrieve(f'{RAW}/HebrewLexicon/master/HebrewStrong.xml', CACHE / 'HebrewStrong.xml')
    print(f'saved to {CACHE}')


def lexicon():
    """номер Стронга → (заглавная форма, часть речи, происхождение: номер слова-корня или None)"""
    out = {}
    text = (CACHE / 'HebrewStrong.xml').read_text(encoding='utf-8')
    for m in re.finditer(r'<entry id="H(\d+)">\s*<w pos="([^"]*)"[^>]*>([^<]*)</w>(.*?)</entry>', text, re.S):
        src = re.search(r'<source>(.*?)</source>', m[4], re.S)
        frm = None
        if src:
            s = src[1].strip()
            # «from H1696», «a primitive root» — берём первое «from», если оно в начале описания
            f = re.match(r'(?:(?:a |an )?(?:prolonged |masculine |feminine |collective |apparently |probably |perhaps )?(?:form )?)?from <w src="H(\d+)"', s)
            if f: frm = f[1]
        out[m[1]] = (m[3], m[2], frm)
    return out


def tokens():
    """(книга, глава, стих) → номера Стронга слов стиха, без имён собственных; и число имён"""
    by = collections.defaultdict(list)
    aram = collections.Counter()
    names = 0
    W = re.compile(r'<verse osisID="([^"]+)">|<w lemma="([^"]*)"[^>]*?morph="([^"]*)"')
    for b, slug in BOOKS.items():
        ref = None
        for m in W.finditer((CACHE / 'wlc' / f'{b}.xml').read_text(encoding='utf-8')):
            if m[1]:
                _, c, v = m[1].split('.')
                ref = (slug, int(c), int(v))
                continue
            parts = [p for p in m[2].split('/') if re.match(r'\d', p)]
            if not parts: continue
            last = re.sub(r'^[HA]', '', m[3]).split('/')[-1]
            if last.startswith('Np'):
                names += 1
                continue
            l = re.match(r'\d+', parts[-1])[0]
            by[ref].append(l)
            if m[3].startswith('A'): aram[l] += 1
    return by, names, aram


FINAL = str.maketrans('ךםןףץ', 'כמנפצ')
SOFIT = str.maketrans('כמנפצ', 'ךםןףץ')
def letters(he):
    return re.sub(r'[^א-ת]', '', he).translate(FINAL)

def inside(root, word):
    it = iter(word)
    return all(c in it for c in root)


def cmd_build():
    lex = lexicon()
    by, names, aram = tokens()
    count = collections.Counter(l for ls in by.values() for l in ls)
    total = sum(count.values())
    ranked = [l for l, _ in count.most_common()][:SIZE]
    words = []
    for l in ranked:
        he, pos, frm = lex[l]
        w = {'id': l, 'he': NAMES.get(l, he), 'pos': pos, 'n': count[l]}
        # корень: глагол — сам себе корень; слово «от глагола» — тот глагол
        verb = pos.split()[0] == 'v'
        root = l if verb else frm if frm and lex.get(frm, ('', ''))[1] == 'v' else None
        r = letters(lex[root][0]) if root else ''
        # у Стронга бывают сомнительные происхождения (בַּיִת «от» בנה): корень — только если его буквы по порядку есть в слове
        if r and (verb or inside(r, letters(he))): w['root'] = r[:-1] + r[-1].translate(SOFIT)
        if l in ROOT_FIX:
            w.pop('root', None)
            if ROOT_FIX[l]: w['root'] = ROOT_FIX[l]
        # арамейское слово (Даниэль, Эзра): чаще всего встречается в арамейских главах
        if aram[l] * 2 > count[l]: w['aram'] = 1
        words.append(w)
    covered = 0
    for w in words:
        covered += w['n']
        w['cov'] = round(covered / total * 100, 1)
    head = {'source': 'Open Scriptures Hebrew Bible Project (CC BY 4.0); Strong’s Hebrew Dictionary (Public Domain)',
            'total': total, 'names': names, 'lemmas': len(count)}
    body = ',\n'.join(json.dumps(w, ensure_ascii=False) for w in words)
    OUT.write_text(json.dumps(head, ensure_ascii=False)[:-1] + ', "words": [\n' + body + '\n]}\n', encoding='utf-8')
    known = set(ranked)
    OUT_DAYS.mkdir(exist_ok=True)
    n = 0
    for f in sorted(DAYS.glob('????-??-??.json')):
        day = json.loads(f.read_text(encoding='utf-8'))
        out = {}
        for s in ('neviim', 'ketuvim'):
            ls = []
            for v in day[s]['verses']:
                ls += by.get((v['b'], v['c'], v['v']), [])
            c = collections.Counter(l for l in ls if l in known)
            out[s] = {'n': len(ls), 'w': dict(sorted(c.items(), key=lambda x: -x[1]))}
        (OUT_DAYS / f.name).write_text(json.dumps(out, separators=(',', ':')) + '\n', encoding='utf-8')
        n += 1
    print(f'{total} words ({len(count)} lemmas, {names} names); top {SIZE} cover {words[-1]["cov"]}%; {n} days → {OUT_DAYS}')


def cmd_todo(lang):
    tr = json.loads((TR / f'{lang}.json').read_text(encoding='utf-8')) if (TR / f'{lang}.json').exists() else {}
    lex = lexicon()
    for i, w in enumerate(json.loads(OUT.read_text(encoding='utf-8'))['words'], 1):
        if w['id'] not in tr:
            print(i, w['id'], w['he'], w['pos'], w.get('root', ''), sep='\t')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['fetch']: cmd_fetch()
    elif a == ['build']: cmd_build()
    elif a[:1] == ['todo'] and len(a) == 2: cmd_todo(a[1])
    else: sys.exit(__doc__)
