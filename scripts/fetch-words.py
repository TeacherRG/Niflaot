#!/usr/bin/env python3
"""
«Слова Танаха»: частотный словарь Пророков и Писаний для изучения иврита по словам отрывка дня.

    python3 scripts/fetch-words.py fetch     # открытая разметка Танаха и словарь → .cache/oshb (без них build не работает)
    python3 scripts/fetch-words.py build     # → src/tanakh/words.json, public/tanakh/words/<дата>.json и примеры стихов
    python3 scripts/fetch-words.py todo ru   # слова без перевода на этом языке (по порядку частоты)
    python3 scripts/fetch-words.py stems     # глаголы почти без каль — проверить FORM_FIX (настоящая форма вместо Стронга)

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
# переводы стихов проекта (ru, de): src/tanakh/<язык>/<книга>.json → `t`
VERSE_TR = ROOT / 'src' / 'tanakh'
RAW = 'https://raw.githubusercontent.com/openscriptures'
# сколько слов в словаре (с частотами и по дням); переводы — по мере готовности, с начала списка;
# 1–1000 — первый уровень, 1001–1500 — второй, более редкие слова (12–22 раза в Пророках и Писаниях)
SIZE = 1500

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
# в BDB: יָנַח (הניח) — от נוח, לוּץ — от ליץ; בּוֹר и אוֹת — у словарей нет согласия, корня не показываем.
# Догадки BDB, которые ученику не показываем: «восемь» от «жир» (שְׁמֹנֶה ← שמן), בַּרְזֶל ← ברז, הָמוֹן ← המן (у Радака — המה),
# חוֹמָה, חֲצֹצְרָה, אַרְמוֹן, אוּלָם, אֳנִיָּה; слова от имён народов (יְהוּדִי, יְבוּסִי, כּוּשִׁי).
ROOT_FIX = {'1964': None, '4940': 'שפח', '5542': None, '3240': 'נוח', '3887': 'ליץ', '953': None, '226': None,
            '8083': None, '8084': None, '1270': None, '1995': None, '2346': None, '2689': None, '759': None, '197': None,
            '591': None, '3064': None, '2983': None, '3569': None,
            # второй уровень: «восьмой» и «цена» (שְׁמִינִי ← שמן, מְחִיר ← מחר), מְזוּזָה ← זוז, אֶצְבַּע ← צבע, יוֹנָה, אָתוֹן,
            # בְּרוֹשׁ, תַּנִּין, כִּלְיָה, מֹאזְנַיִם ← אזן; слова от имён (מוֹאָבִי, בְּאֵר שֶׁבַע)
            '8066': None, '4242': None, '4201': None, '676': None, '3123': None, '860': None, '1265': None, '8577': None,
            '3629': None, '3976': None, '4125': None, '884': None}
# Одно слово, которое Стронг разбил на два номера: יָלַךְ (3212) — условная форма для יֵלֵךְ, לֵךְ, לֶכֶת, וַיֵּלֶךְ — это
# тот же глагол הָלַךְ (1980); такого слова нет, в словаре — одна запись. Номер → номер, куда засчитывается.
MERGE = {'3212': '1980'}
# Основная форма на экране, где у Стронга не та: огласовка (שָׁנֶה — «год» — пишется שָׁנָה, אֵל → אֶל) и глаголы, которых
# в Танахе почти нет в каль (< 10 %): Стронг даёт условную форму каль (צָוָה, דָבַר), показываем настоящую — 3 л. ед. ч.
# прошедшего самого частого биньяна (צִוָּה, דִּבֶּר, הִכָּה, נִשְׁבַּע); где перевод — два биньяна, по первому значению.
# Корень считается по форме Стронга (буквы корня). Список — `python3 scripts/fetch-words.py stems`.
FORM_FIX = {'8141': 'שָׁנָה', '1696': 'דִּבֶּר', '5221': 'הִכָּה', '5046': 'הִגִּיד', '6680': 'צִוָּה', '1245': 'בִּקֵּשׁ',
            '3559': 'הֵכִין', '3467': 'הוֹשִׁיעַ', '5337': 'הִצִּיל', '1984': 'הִלֵּל', '3898': 'נִלְחַם', '7812': 'הִשְׁתַּחֲוָה',
            '7650': 'נִשְׁבַּע', '7843': 'הִשְׁחִית', '5012': 'נִבָּא', '3034': 'הוֹדָה', '3680': 'כִּסָּה', '7604': 'נִשְׁאַר',
            '7993': 'הִשְׁלִיךְ', '2490': 'חִלֵּל', '6942': 'קִדֵּשׁ', '5162': 'נִחֵם', '4422': 'נִמְלַט', '7999': 'שִׁלֵּם',
            '539': 'הֶאֱמִין', '6419': 'הִתְפַּלֵּל', '3498': 'נוֹתַר', '6999': 'קִטֵּר', '5641': 'הִסְתִּיר', '8334': 'שֵׁרֵת',
            '5329': 'נִצֵּחַ', '5027': 'הִבִּיט', '6381': 'נִפְלָא', '7919': 'הִשְׂכִּיל', '8045': 'הִשְׁמִיד', '3240': 'הִנִּיחַ',
            '7925': 'הִשְׁכִּים', '3198': 'הוֹכִיחַ', '4116': 'מִהֵר', '5324': 'נִצַּב', '6960': 'קִוָּה', '7181': 'הִקְשִׁיב',
            '2167': 'זִמֵּר', '7321': 'הֵרִיעַ', '5080': 'הִדִּיחַ', '7355': 'רִחַם', '2778': 'חֵרֵף', '3176': 'יִחֵל',
            '2763': 'הֶחֱרִים', '6565': 'הֵפֵר', '3637': 'נִכְלַם', '926': 'נִבְהַל', '238': 'הֶאֱזִין', '3665': 'נִכְנַע',
            '5234': 'הִכִּיר', '5749': 'הֵעִיד', '3557': 'הֵכִיל', '3320': 'הִתְיַצֵּב', '8248': 'הִשְׁקָה', '5352': 'נִקָּה',
            '2244': 'נֶחְבָּא', '3213': 'הֵילִיל', '3582': 'כִּחֵד', '3985': 'מֵאֵן', '5381': 'הִשִּׂיג', '5423': 'נִתֵּק',
            '6923': 'קִדֵּם', '3722': 'כִּפֶּר', '1319': 'בִּשֵּׂר', '6950': 'נִקְהַל', '3276': 'הוֹעִיל', '6974': 'הֵקִיץ',
            # слова 1001–1500 (второй уровень, 26.10.2026)
            '3950': 'לִקֵּט', '5254': 'נִסָּה', '7065': 'קִנֵּא', '6823': 'צִפָּה', '2094': 'הִזְהִיר', '7768': 'שִׁוַּע',
            '8172': 'נִשְׁעַן', '183': 'הִתְאַוָּה', '914': 'הִבְדִּיל', '3187': 'הִתְיַחֵשׂ', '7682': 'נִשְׂגָּב', '4549': 'נָמֵס',
            '5362': 'הִקִּיף', '5956': 'הֶעְלִים', '8581': 'תִּעֵב', '1792': 'דִּכָּא', '2986': 'הוּבַל', '3584': 'כִּחֵשׁ',
            '5496': 'הֵסִית', '6504': 'נִפְרַד', '3576': 'כִּזֵּב', '7270': 'רִגֵּל', '3259': 'נוֹעַד', '5953': 'עוֹלֵל',
            '535': 'אֻמְלַל', '7921': 'שִׁכֵּל', '1204': 'בִּעֵת', '2974': 'הוֹאִיל', '8259': 'הִשְׁקִיף', '5059': 'נִגֵּן',
            '5377': 'הִשִּׁיא', '7324': 'הֵרִיק', '5068': 'הִתְנַדֵּב', '2904': 'הֵטִיל', '2442': 'חִכָּה', '5130': 'הֵנִיף',
            '6286': 'הִתְפָּאֵר',
            '884': 'בְּאֵר־שֶׁבַע',  # имя города, два слова — через макаф
            # заглавная форма Стронга, которой в тексте нет, — та, что есть: מַת читалось бы как מֵת «мёртвый», а слово —
            # только מְתִים / מְתֵי «люди»; שׁוֹא → שׁוֹאָה, זַעַק → זְעָקָה, צֹהַר «окно» (Берешит) → צָהֳרַיִם «полдень»,
            # слова только во множественном / двойственном (מֵישָׁרִים, חֹרִים, נְתִינִים, תִּמֹרִים, מֹאזְנַיִם, מְצִלְתַּיִם),
            # арамейские — как написано в Даниэле и Эзре (אֲנָה, גּוֹא)
            '4962': 'מְתִים', '7722': 'שׁוֹאָה', '2201': 'זְעָקָה', '6672': 'צָהֳרַיִם', '4339': 'מֵישָׁרִים', '2715': 'חֹרִים',
            '5411': 'נְתִינִים', '8561': 'תִּמֹרִים', '3976': 'מֹאזְנַיִם', '4700': 'מְצִלְתַּיִם', '576': 'אֲנָה', '1459': 'גּוֹא',
            # не глаголы: огласовка (אֵל → אֶל, אֶמֶת → אֱמֶת) или слово, что бывает только в одной форме (אַשְׁרֵי, לְמַעַן)
            '413': 'אֶל', '3881': 'לֵוִי', '571': 'אֱמֶת', '8441': 'תּוֹעֵבָה', '6435': 'פֶּן', '7125': 'לִקְרַאת',
            '4616': 'לְמַעַן', '1836': 'דְּנָה', '835': 'אַשְׁרֵי', '8394': 'תְּבוּנָה', '8384': 'תְּאֵנָה', '8328': 'שֹׁרֶשׁ',
            '4306': 'מָטָר', '6903': 'קֳבֵל', '2459': 'חֵלֶב', '5668': 'עֲבוּר', '5980': 'לְעֻמַּת', '5978': 'עִמָּדִי',
            '4686': 'מְצוּדָה', '1314': 'בֹּשֶׂם', '4578': 'מֵעִים', '4975': 'מָתְנַיִם', '5271': 'נְעוּרִים', '1544': 'גִּלּוּלִים',
            '6490': 'פִּקּוּדִים',
            # Стронг дал смихут или редкую форму вместо обычной полной (абсолютной): לַיִל → לַיְלָה,
            # עֶוֶל → עַוְלָה, слово почти только во множественном (שְׁלָמִים, רַחֲמִים)
            '3915': 'לַיְלָה', '2403': 'חַטָּאת', '8597': 'תִּפְאֶרֶת', '8433': 'תּוֹכַחַת', '738': 'אַרְיֵה',
            '5766': 'עַוְלָה', '5591': 'סְעָרָה', '7339': 'רְחוֹב', '8002': 'שְׁלָמִים', '7356': 'רַחֲמִים'}
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
            l = MERGE.get(l, l)
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
        if l in FORM_FIX: w['he'] = FORM_FIX[l]
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
    cmd_examples(ranked)
    print(f'{total} words ({len(count)} lemmas, {names} names); top {SIZE} cover {words[-1]["cov"]}%; {n} days → {OUT_DAYS}')


MARKS = re.compile(r'[\u0591-\u05C7/]')
def surface():
    """(книга, глава, стих) → [(номер Стронга или None, буквы слова)] по порядку; стихи с кетив/кри — без них (в них
    написание WLC и наше могут не совпасть)"""
    out = {}
    W = re.compile(r'<verse osisID="([^"]+)">|</verse>|<w lemma="([^"]*)"[^>]*?morph="([^"]*)"[^>]*>([^<]*)</w>')
    for b, slug in BOOKS.items():
        x = (CACHE / 'wlc' / f'{b}.xml').read_text(encoding='utf-8')
        ref, ws, bad = None, [], False
        for m in W.finditer(re.sub(r'<note\b.*?</note>', '', x, flags=re.S)):
            if m[1]:
                _, c, v = m[1].split('.')
                ref, ws = (slug, int(c), int(v)), []
                continue
            if m[0] == '</verse>':
                out[ref] = ws
                continue
            parts = [p for p in m[2].split('/') if re.match(r'\d', p)]
            name = re.sub(r'^[HA]', '', m[3]).split('/')[-1].startswith('Np')
            l = re.match(r'\d+', parts[-1])[0] if parts and not name else None
            l = MERGE.get(l, l)
            ws.append((l, letters(MARKS.sub('', m[4]))))
        for v in re.findall(r'<verse osisID="([^"]+)">(?:(?!</verse>).)*?<note type="variant">', x, re.S):
            _, c, vv = v.split('.')
            out.pop((slug, int(c), int(vv)), None)
    return out


def cmd_examples(ranked):
    """Пример стиха для каждого слова словаря («Мои слова»): из Пророков и Писаний, где слово встречается;
    сначала — стих, у которого есть перевод проекта (ru и de), потом — 6–18 слов, короче, раньше по циклу.
    → public/tanakh/words/examples-<язык>.json: {номер: [дата, раздел, «книга глава:стих», [до, слово, после], перевод,
    1 — если перевод английский (на этом языке стих ещё не переведён)]}"""
    sf = surface()
    trs = {lang: {} for lang in ('ru', 'de')}
    for lang in trs:
        for f in (VERSE_TR / lang).glob('*.json'):
            for k, v in json.loads(f.read_text(encoding='utf-8')).items():
                if v.get('t'): trs[lang][(f.stem, *map(int, k.split(':')))] = v['t']
    verses = {}
    for f in sorted(DAYS.glob('????-??-??.json')):
        day = json.loads(f.read_text(encoding='utf-8'))
        for s in ('neviim', 'ketuvim'):
            for v in day[s]['verses']:
                verses.setdefault((v['b'], v['c'], v['v']), (f.stem, s, v['he'], v['en']))
    where = collections.defaultdict(list)
    for ref, ws in sf.items():
        if ref not in verses: continue
        for i, (l, _) in enumerate(ws):
            if l: where[l].append((ref, i))
    out = {lang: {} for lang in ('ru', 'en', 'de')}
    missing = 0
    for l in ranked:
        best = None
        for ref, i in where[l]:
            date, sec, he, en = verses[ref]
            parts = re.split(r'([ \u05BE]+)', he.replace('׃', '').strip())
            cons = [letters(p).replace('ק', 'ה') for p in parts]
            ws = sf[ref]
            # то же слово в нашем тексте: по порядку среди слов с теми же буквами (Имена — ק вместо ה)
            word = ws[i][1].replace('ק', 'ה')
            k = sum(1 for _, w in ws[:i] if w.replace('ק', 'ה') == word)
            hits = [j for j, c in enumerate(cons) if c == word]
            if len(hits) <= k: continue
            j = hits[k]
            n = len(ws)
            key = (not (ref in trs['ru'] and ref in trs['de']), not 6 <= n <= 18, n, date)
            if best is None or key < best[0]:
                best = (key, ref, date, sec, [''.join(parts[:j]), parts[j], ''.join(parts[j + 1:]) + '׃'], en)
        if not best:
            missing += 1
            continue
        _, ref, date, sec, he, en = best
        r = f'{ref[0]} {ref[1]}:{ref[2]}'
        out['en'][l] = [date, sec, r, he, en]
        for lang in trs:
            t = trs[lang].get(ref)
            out[lang][l] = [date, sec, r, he, t] if t else [date, sec, r, he, en, 1]
    for lang, ex in out.items():
        (OUT_DAYS / f'examples-{lang}.json').write_text(json.dumps(ex, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print(f'examples: {len(out["en"])} words ({missing} without), translated ru {sum(len(x) == 5 for x in out["ru"].values())}')


def cmd_todo(lang):
    tr = json.loads((TR / f'{lang}.json').read_text(encoding='utf-8')) if (TR / f'{lang}.json').exists() else {}
    lex = lexicon()
    for i, w in enumerate(json.loads(OUT.read_text(encoding='utf-8'))['words'], 1):
        if w['id'] not in tr:
            print(i, w['id'], w['he'], w['pos'], w.get('root', ''), sep='\t')


def cmd_stems():
    """глаголы словаря, которых почти нет в каль (< 10 %): биньяны и частая форма 3 л. ед. ч. прошедшего — для FORM_FIX"""
    words = {w['id']: w for w in json.loads(OUT.read_text(encoding='utf-8'))['words'] if w['pos'].split()[0] == 'v'}
    stem, forms = collections.defaultdict(collections.Counter), collections.defaultdict(collections.Counter)
    W = re.compile(r'<w lemma="([^"]*)"[^>]*?morph="([^"]*)"[^>]*>([^<]*)</w>')
    for b in BOOKS:
        for m in W.finditer((CACHE / 'wlc' / f'{b}.xml').read_text(encoding='utf-8')):
            parts = [p for p in m[1].split('/') if re.match(r'\d', p)]
            if not parts: continue
            l = re.match(r'\d+', parts[-1])[0]
            mo = re.sub(r'^[HA]', '', m[2]).split('/')[-1]
            if l not in words or not mo.startswith('V'): continue
            stem[l][mo[1]] += 1
            if mo[2:] == 'p3ms' and '/' not in m[3]: forms[(l, mo[1])][re.sub('[\u0591-\u05AF\u05BD\u05C0\u05C3]', '', m[3])] += 1
    for l, w in words.items():
        c = stem[l]
        if c and c['q'] < sum(c.values()) / 10:
            top = c.most_common(1)[0][0]
            print(l, w['he'], 'FIX' if l in FORM_FIX else 'new', dict(c.most_common()), forms[(l, top)].most_common(2), sep='\t')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['fetch']: cmd_fetch()
    elif a == ['build']: cmd_build()
    elif a[:1] == ['todo'] and len(a) == 2: cmd_todo(a[1])
    elif a == ['stems']: cmd_stems()
    else: sys.exit(__doc__)
