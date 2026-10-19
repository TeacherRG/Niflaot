#!/usr/bin/env python3
"""
«Слова Танаха»: частотный словарь Пророков и Писаний для изучения иврита по словам отрывка дня.

    python3 scripts/fetch-words.py fetch     # открытая разметка Танаха и словарь → .cache/oshb (без них build не работает)
    python3 scripts/fetch-words.py build     # → src/tanakh/words.json и public/tanakh/words/<дата>.json
    python3 scripts/fetch-words.py todo ru   # слова без перевода на этом языке (по порядку частоты)

Источники (свободные лицензии):
  Open Scriptures Hebrew Bible (github.com/openscriptures/morphhb) — основная форма каждого слова текста (лемма, номер
  Стронга) и его разбор: CC BY 4.0, «Open Scriptures Hebrew Bible Project»; сам текст (WLC) — Public Domain;
  HebrewStrong.xml (github.com/openscriptures/HebrewLexicon) — заглавная форма слова с огласовками (словарь Стронга, PD);
  LexicalIndex.xml (там же) — корни по словарю Брауна — Драйвера — Бриггса (1906, PD): традиционная система трёхбуквенных
  корней; Радака («Сефер ґа-шорашим») в открытых выгрузках нет — корень показываем, только если BDB его даёт и его буквы
  по порядку есть в слове, спорные — в ROOT_FIX.
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
# Корень, где правило ниже ошибается: номер → правильный (None — не показывать). Глаголы с «чужим» корнем — как у Радака и
# в BDB: יָלַךְ — от הלך, יָנַח (הניח) — от נוח, לוּץ — от ליץ; בּוֹר и אוֹת — у словарей нет согласия, корня не показываем.
# Догадки BDB, которые ученику не показываем: «восемь» от «жир» (שְׁמֹנֶה ← שמן), בַּרְזֶל ← ברז, הָמוֹן ← המן (у Радака — המה),
# חוֹמָה, חֲצֹצְרָה, אַרְמוֹן, אוּלָם, אֳנִיָּה; слова от имён народов (יְהוּדִי, יְבוּסִי, כּוּשִׁי).
ROOT_FIX = {'1964': None, '4940': 'שפח', '5542': None, '3212': 'הלך', '3240': 'נוח', '3887': 'ליץ', '953': None, '226': None,
            '8083': None, '8084': None, '1270': None, '1995': None, '2346': None, '2689': None, '759': None, '197': None,
            '591': None, '3064': None, '2983': None, '3569': None}
# Основная форма, где у Стронга не та огласовка (שָׁנֶה — «год» — пишется שָׁנָה): номер → правильная форма
FORM_FIX = {'8141': 'שָׁנָה'}
NAMES = {'430': 'אֱלֹקִים', '433': 'אֱלוֹקַּ', '426': 'אֱלָהּ', '410': 'אֵ-ל', '136': 'אֲדֹ-נָי', '7706': 'שַׁ-דַּי', '3050': 'קָהּ'}


def cmd_fetch():
    (CACHE / 'wlc').mkdir(parents=True, exist_ok=True)
    for b in BOOKS:
        urllib.request.urlretrieve(f'{RAW}/morphhb/master/wlc/{b}.xml', CACHE / 'wlc' / f'{b}.xml')
    urllib.request.urlretrieve(f'{RAW}/HebrewLexicon/master/HebrewStrong.xml', CACHE / 'HebrewStrong.xml')
    urllib.request.urlretrieve(f'{RAW}/HebrewLexicon/master/LexicalIndex.xml', CACHE / 'LexicalIndex.xml')
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


def bdb_roots():
    """номер Стронга → корни по словарю Брауна — Драйвера — Бриггса (LexicalIndex.xml: у основного слова — `root`, у
    производного — ссылка на основное; глагол без пометки — сам себе корень)"""
    x = (CACHE / 'LexicalIndex.xml').read_text(encoding='utf-8')
    ents, by = {}, collections.defaultdict(list)
    for m in re.finditer(r'<entry id="([^"]+)">(.*?)</entry>', x, re.S):
        b = m[2]
        w = re.search(r'<w[^>]*>([^<]*)</w>', b)
        pos = re.search(r'<pos>([^<]*)</pos>', b)
        et = re.search(r'<etym(?: root="([^"]*)")? type="(\w+)">([^<]*)</etym>', b)
        ents[m[1]] = (w[1] if w else '', pos[1] if pos else '', et[1] if et else None, et[2] if et else None, (et[3] if et else '').strip())
        for st in re.findall(r'strong="(\d+)"', b): by[st].append(m[1])
    def root(e):
        w, pos, r, typ, ref = e
        if typ == 'main' and r: return r
        if typ == 'sub' and ref in ents:
            mw, mpos, mr, _, _ = ents[ref]
            return mr or (mw if mpos == 'V' else None)
        return w if pos == 'V' else None
    return {st: {letters(r) for r in map(root, (ents[i] for i in ids)) if r and letters(r)} for st, ids in by.items()}


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
    bdb = bdb_roots()
    by, names, aram = tokens()
    count = collections.Counter(l for ls in by.values() for l in ls)
    total = sum(count.values())
    ranked = [l for l, _ in count.most_common()][:SIZE]
    words = []
    for l in ranked:
        he, pos, frm = lex[l]
        he = FORM_FIX.get(l, he)
        w = {'id': l, 'he': NAMES.get(l, he), 'pos': pos, 'n': count[l]}
        # корень — по BDB (традиционная система трёхбуквенных корней — Ибн Джанах, Радак), и только если его буквы по
        # порядку есть в самом слове: этимологические догадки (בַּיִת «от» בין) ученику не показываем; Имена — без корня
        verb = pos.split()[0] == 'v'
        rs = sorted(r for r in bdb.get(l, ()) if inside(r, letters(he))) if l not in NAMES else []
        if verb and not rs and letters(he) in bdb.get(l, {letters(he)}): rs = [letters(he)]
        if len(rs) == 1: w['root'] = rs[0][:-1] + rs[0][-1].translate(SOFIT)
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
    head = {'source': 'Open Scriptures Hebrew Bible Project (CC BY 4.0); Strong’s Hebrew Dictionary and Brown–Driver–Briggs (Public Domain)',
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
