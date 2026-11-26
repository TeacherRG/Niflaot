"""
Словарный инфинитив глагола — «לִכְתֹּב», как в словаре (владелец, 26.11.2026: «на русском и немецком — инфинитив, значит и на
иврите нужен инфинитив; то, что не упоминается в Танахе, не должно влиять на общую структуру»).

Инфинитив конструкт с ל того биньяна, в котором стоит словарная форма (`he` в src/tanakh/words.json): קַל — לִשְׁמֹר, נִפְעַל —
לְהִשָּׁמֵר, פִּעֵל — לְדַבֵּר, הִפְעִיל — לְהַגְדִּיל, הִתְפַּעֵל — לְהִתְהַלֵּךְ; арамейский — לְמִבְנֵא, לְהַשְׁכָּחָה.
1. Есть в Танахе (OSHB: тот же биньян, без окончания-местоимения) — берётся форма Танаха; без ל в тексте — ל ставится по правилу
   (לִ перед шва, לַ / לֶ перед хатафом, לָ перед ударным первым слогом: לָתֵת, לָשֶׁבֶת, לָבוֹא; לְ — иначе).
2. Нет в Танахе — по грамматике (классы корня: пустые, ל"ה, удвоенные, פ"י, פ"נ, гортанные) и помечается `infTanakh: 0`:
   на сайте рядом — значок перечёркнутой книги «такой формы в Танахе нет».
3. Ручные поправки — INF_FIX в scripts/fetch-words.py (редкие биньяны, причастия в заголовке, особые формы).
"""
import re
import unicodedata

SH, HP, HS, HQ, HI, TS, SG, PT, QM, HL, HLV, QB, DG = (
    'ְ', 'ֲ', 'ֱ', 'ֳ', 'ִ', 'ֵ', 'ֶ', 'ַ', 'ָ', 'ֹ', 'ֺ', 'ֻ', 'ּ')
SHD, SND = 'ׁ', 'ׂ'
VOW = set('ֱֲֳִֵֶַָׇֹֺֻ')
FIN = {'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ'}
TOFIN = {v: k for k, v in FIN.items()}
BGD = 'בגדכפת'


def nfc(s):
    """без знаков кантилляции и метега, в одном порядке знаков"""
    return unicodedata.normalize('NFC', unicodedata.normalize('NFD', re.sub('[֑-ֽ֯׀׃]', '', s)))


def clusters(w):
    """слово → [буква, её знаки]"""
    out = []
    for ch in unicodedata.normalize('NFD', w):
        if 'א' <= ch <= 'ת':
            out.append([ch, ''])
        elif out:
            out[-1][1] += ch
    return out


def join(cl):
    s = ''
    for i, (b, m) in enumerate(cl):
        b = FIN.get(b, b)
        if i == len(cl) - 1:
            b = TOFIN.get(b, b)
            if b == 'ך' and not (set(m) & (VOW | {SH})):
                m += SH
        s += b + ''.join(sorted(m, key=lambda c: {SHD: 0, SND: 0, DG: 1}.get(c, 2)))
    return unicodedata.normalize('NFC', s)


def base(c): return FIN.get(c[0], c[0])
def vow(c): return ''.join(x for x in c[1] if x in VOW)
def nodg(c): return [c[0], c[1].replace(DG, '')]
def L(x, m=''): return [x[0], x[1:] + m]
def fur(c3): return PT if c3[0] in 'חע' else ''          # פתח גנוב: לִשְׁמֹעַ
def word(pre, cl): return pre + join(cl)


def root_letters(w):
    """буквы корня (BDB, иначе — буквы заголовка) с точкой ש / שׂ, как в заголовке"""
    r = [FIN.get(x, x) for x in (w.get('root') or ''.join(base(c) for c in clusters(w['he'])))]
    dots = [(SND if SND in c[1] else SHD) for c in clusters(w['he']) if base(c) == 'ש']
    return ['ש' + (dots.pop(0) if dots else SHD) if x == 'ש' else x for x in r]


def has_hiriq_yod(he):
    cl = clusters(nfc(he))
    return any(HI in a[1] and b[0] == 'י' and not vow(b) for a, b in zip(cl, cl[1:]))


def start(c1):
    """ל и первая буква корня в קַל: לִשְׁ, לַחְ, לַעֲ, לֶאֱ, לִי"""
    if c1[0] == 'ח': return 'ל' + PT, [L(c1, SH)]
    if c1[0] in 'עה': return 'ל' + PT, [L(c1, HP)]
    if c1[0] == 'א': return 'ל' + SG, [L(c1, HS)]
    if c1[0] == 'י': return 'ל' + HI, [['י', '']]
    return 'ל' + HI, [L(c1, SH)]


def lene(c1, c2):
    """דגש קל во второй букве — после немой шва (не после гортанной с хатафом и не после לִי)"""
    return DG if c2[0] in BGD and c1[0] not in 'אהעי' else ''


def mid(c2, m=''):
    """ו вторым корневым — согласная: холам над ней — ֺ (לִגְוֺעַ)"""
    return ['ו', m.replace(HL, HLV)] if c2[0] == 'ו' else L(c2, m)


def qal(r, he):
    c1, c2 = r[0], r[1]
    c3 = r[2] if len(r) > 2 else r[1]
    hv = nfc(he)
    if len(r) == 3 and c3[0] == 'ה':                         # ל"ה: לִבְנוֹת, לַעֲשׂוֹת
        p, cl = start(c1)
        return word(p, cl + [L(c2, lene(c1, c2)), ['ו', HL], ['ת', '']])
    hollow = len(r) == 3 and c2[0] in 'וי' and c1[0] != 'י' and (
        'וּ' in hv or 'וֹ' in hv or has_hiriq_yod(he) or len(clusters(hv)) == 2)
    if hollow:                                               # ע"ו / ע"י: לָקוּם, לָבוֹא, לָשִׂים
        v = [['ו', DG]] if 'וּ' in hv else [['ו', HL]] if 'וֹ' in hv else None
        if v is None:
            v = [['י', '']] if (c2[0] == 'י' or has_hiriq_yod(he)) else [['ו', DG]]
        first = L(c1, HI) if v[0][0] == 'י' else L(c1)
        return word('ל' + QM, [first] + v + [L(c3, fur(c3))])
    if c2[0] == c3[0]:                                       # ע"ע: לָסֹב
        return word('ל' + QM, [L(c1, HL), L(c3)])
    p, cl = start(c1)                                        # לִשְׁמֹר, לַעֲמֹד, לֶאֱסֹר, לַחְשֹׁב
    return word(p, cl + [mid(c2, lene(c1, c2) + HL), L(c3, fur(c3))])


def niph(r, he):
    c1, c2, c3 = r[0], r[1], r[2]
    g = c1[0] in 'אהחער'
    h = 'לְה' + (TS if g else HI)
    d = '' if g else DG
    if c3[0] == 'ה': return word(h, [L(c1, d + QM), L(c2), ['ו', HL], ['ת', '']])      # לְהִבָּנוֹת
    if c2[0] in 'וי' and c1[0] != 'י': return word(h, [L(c1, d), ['ו', HL], L(c3, fur(c3))])  # לְהִכּוֹן
    if c1[0] == 'י': return word('לְה' + HI, [['ו', DG + QM], L(c2, TS), L(c3, fur(c3))])  # לְהִוָּלֵד
    return word(h, [L(c1, d + QM), L(c2, TS), L(c3, fur(c3))])                          # לְהִשָּׁמֵר


def lh_end(cl):
    """ל"ה: …ָה → …וֹת; после удвоенной ו — וֹּת (לְצַוֹּת)"""
    if len(cl) >= 2 and base(cl[-1]) == 'ה' and not vow(cl[-1]) and QM in cl[-2][1]:
        if base(cl[-2]) == 'ו' and DG in cl[-2][1]:
            return cl[:-2] + [['ו', DG + HL], ['ת', '']]
        cl[-2][1] = cl[-2][1].replace(QM, '')
        return cl[:-1] + [['ו', HL], ['ת', '']]
    return None


def piel(he):
    """פִּעֵל от заголовка: דִּבֶּר → לְדַבֵּר, בֵּרַךְ → לְבָרֵךְ, צִוָּה → לְצַוֹּת, כִּרְסֵם → לְכַרְסֵם"""
    cl = clusters(nfc(he))
    v1 = QM if base(cl[1]) in 'רא' and SH not in cl[1][1] else PT
    cl[0] = nodg(cl[0])
    cl[0][1] = re.sub('[ִֵֶַָ]', v1, cl[0][1]) if vow(cl[0]) else cl[0][1] + v1
    e = lh_end(cl)
    if e: return 'לְ' + join(e)
    if vow(cl[-2]) in (SG, PT, TS):
        cl[-2][1] = re.sub('[ֵֶַ]', TS, cl[-2][1])
        if base(cl[-1]) in 'חע' and PT not in cl[-1][1]: cl[-1][1] += PT
    return 'לְ' + join(cl)


def from_head(he, kind):
    """הִפְעִיל, הִתְפַּעֵל, פּוֹלֵל — от заголовка: הִגְדִּיל → לְהַגְדִּיל, הֶאֱמִין → לְהַאֲמִין, הֵקִים → לְהָקִים,
    הוֹשִׁיעַ → לְהוֹשִׁיעַ, הִרְבָּה → לְהַרְבּוֹת; הִתְחַזַּק → לְהִתְחַזֵּק; כּוֹנֵן → לְכוֹנֵן"""
    cl = clusters(nfc(he))
    if kind == 'polel':
        cl[0] = nodg(cl[0])
        return 'לְ' + join(cl)
    if kind == 'hiph':
        v = vow(cl[0])
        if v == SG: cl[0][1] = PT; cl[1][1] = cl[1][1].replace(HS, HP)
        elif v == HI: cl[0][1] = PT
        elif v == TS and not (len(cl) > 1 and cl[1][0] == 'י' and not vow(cl[1])): cl[0][1] = QM
    e = lh_end(cl)
    w = join(e or cl)
    if not e and kind == 'hitp':
        cl = clusters(w)
        if len(cl) >= 2 and cl[-1][0] not in 'חע' and PT in cl[-2][1]:
            cl[-2][1] = cl[-2][1].replace(PT, TS)
            w = join(cl)
    return 'לְ' + w


def binyan(he, stem):
    """биньян заголовка — по его виду, проверенный по счёту биньянов OSHB (stem: {'Hq': 51, 'Hh': 33, …})"""
    he = nfc(he)
    cl = clusters(he)
    v0, b0 = vow(cl[0]), base(cl[0])
    h = lambda k: stem.get('H' + k, 0)
    if re.match('^הִ(תְ|שְׁתַּ|שְׂתַּ|סְתַּ|צְטַ|זְדַּ)', he) or (
            b0 == 'ה' and v0 == HI and len(cl) > 1 and base(cl[1]) in 'טדת' and DG in cl[1][1] and h('t') > h('h')):
        return 'hitp'
    if (b0 == 'ה' and v0 in (HI, SG, TS) or he.startswith('הוֹ') or he.startswith('הֹ')) and (h('h') or h('H')):
        return 'hiph'
    if b0 == 'נ' and v0 in (HI, SG) and len(cl) > 1 and (SH in cl[1][1] or HS in cl[1][1] or HP in cl[1][1]) and h('N'):
        return 'niph'
    if b0 == 'נ' and v0 == HI and DG in cl[1][1] and h('N') > h('p'): return 'niph'
    if b0 == 'נ' and he.startswith('נוֹ') and h('N'): return 'niph'
    if b0 == 'נ' and v0 == QM and h('N') > h('q') and len(cl) == 3 and vow(cl[1]) == TS: return 'niph'   # נָקֵל
    if v0 == HI and len(cl) == 3 and base(cl[1]) == 'י' and not vow(cl[1]) and DG not in cl[1][1]: return 'qal'  # שִׁיר
    if v0 in (HI, TS) and len(cl) >= 3 and (h('p') or h('o')): return 'piel'
    if (v0 == HL or (len(cl) > 1 and cl[1][0] == 'ו' and HL in cl[1][1])) and (h('o') or h('p')) and len(cl) >= 4:
        return 'polel'
    return 'qal'


# коды биньянов OSHB (иврит), подходящие к биньяну заголовка
CODES = {'qal': 'q', 'niph': 'N', 'piel': 'p', 'hiph': 'h', 'hitp': 'tvr', 'polel': 'o'}


def generate(w, b):
    r = root_letters(w)
    if b == 'qal': return qal(r, w['he'])
    if b == 'niph': return niph(r, w['he'])
    if b == 'piel': return piel(w['he'])
    return from_head(w['he'], b)


def aramaic(w):
    """арамейский פְּעַל: לְמִכְתַּב; ל"א / ל"ה: לְמִבְנֵא; гортанная первая: לְמֶעְבַּד; פ"נ: לְמִפַּק; ע"ו: לִמְקָם"""
    r = root_letters(w)
    c1, c2, c3 = r[0], r[1], r[2] if len(r) > 2 else r[1]
    if len(r) == 3 and c2[0] in 'וי' and c1[0] != 'י' and 'וּ' in nfc(w['he']):
        return word('לִ', [['מ', SH], L(c1, QM), L(c3)])
    if c1[0] == 'נ' and len(r) == 3:
        pre = [['מ', HI], L(c2, DG + PT)]
    elif c1[0] in 'אהחע':
        pre = [['מ', SG], L(c1, SH if c1[0] == 'ע' else HS)]
        pre.append(L(c2, lene(c1, c2) + (TS if c3[0] in 'אהי' else PT)))
        return word('לְ', pre + ([['א', '']] if c3[0] in 'אהי' else [L(c3)]))
    elif c1[0] == 'י':
        pre = [['מ', HI], ['י', ''], L(c2, PT)]
    else:
        pre = [['מ', HI], L(c1, SH), L(c2, lene(c1, c2) + (TS if c3[0] in 'אהי' else PT))]
    return word('לְ', pre + ([['א', '']] if c3[0] in 'אהי' else [L(c3)]))


def with_l(pre, form):
    """форма инфинитива из текста → со своей ל (из текста, если там была ל)"""
    pre, form = nfc(pre), nfc(form)
    i = pre.rfind('ל')
    if i >= 0: return pre[i:] + form
    cl = clusters(form)
    if base(cl[0]) == 'ה' and len(cl) > 1: return 'לְ' + form
    v = cl[0][1]
    if SH in v:                                              # כְּתֹב → לִכְתֹּב: шва становится немой
        cl[0] = nodg(cl[0])
        if len(cl) > 1 and base(cl[1]) in BGD and DG not in cl[1][1]: cl[1][1] = DG + cl[1][1]
        return 'ל' + HI + join(cl)
    for hat, pv in ((HP, PT), (HS, SG), (HQ, QM)):
        if hat in v: return 'ל' + pv + form
    cl[0] = nodg(cl[0])
    nv = sum(1 for c in cl if vow(c))
    segolate = form.endswith('ת') and nv == 2 and vow(cl[0]) in (SG, PT, TS)
    return 'ל' + (QM if nv <= 1 or segolate else SH) + join(cl)


def same(a, b):
    """та же форма — без дагеша, метега и разницы полного и краткого холама"""
    def k(s):
        s = unicodedata.normalize('NFD', s).replace(DG, '').replace('ֽ', '').replace(HLV, HL)
        return unicodedata.normalize('NFC', s.replace('ו' + HL, HL).replace(HL + 'ו', HL))
    return k(a) == k(b)


INF_RU = re.compile(r'(ть|ться|ти|тись|чь|чься)$')


def is_verb_translation(t):
    """перевод — глагол (есть инфинитив вне скобок): «быть, стать», «поспешно говорить»; не «свежий», «безумец»"""
    t = re.sub(r'\([^)]*\)', '', t or '')
    return any(INF_RU.search(x) for x in re.findall(r'[А-Яа-яЁё-]+', t))
