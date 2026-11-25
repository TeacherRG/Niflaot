#!/usr/bin/env python3
"""Сидур «Теилат Ашем» — Шахарит, Минха, Маарив и Биркат ґа-мазон: только слова молитвы.

Источник — выгрузка Sefaria «Weekday Siddur Chabad» (Wikisource), `public/reading/siddur/Weekday Siddur Chabad - he - merged.json`.
В ней в строки молитвы вписаны указания мелким шрифтом (`<small>`: законы, «בעשי״ת», «אמן», «חזן:», номера), заголовки без огласовок
(«ברכת הגומל», «קדיש יתום») и пометки (кетив «לא כ'», «(פב״פ)»). Здесь остаётся только текст, который произносят:
- из `<small>` — только огласованные куски от 4 слов (Кдуша, «Анену», «Модим де-Рабанан», «Авину малкену», «Барух шем…»);
- вне `<small>` — слова с огласовками (и «י״ה בו״ה» в «Ле-шем ихуд»);
- `<br>` — новая строка, без тегов, без «|», лишних пробелов и пустых скобок.

Маарив в выгрузке — один список без разделов: разделы — по началу молитв (`MAARIV`, номера строк выгрузки).

Запуск: python3 scripts/build-siddur.py → public/reading/siddur/<молитва>-he.json (shacharit, mincha, maariv, birkat-hamazon)
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'public/reading/siddur/Weekday Siddur Chabad - he - merged.json'
OUT_DIR = ROOT / 'public/reading/siddur'

# раздел: (путь в выгрузке, название, первая строка, конец — строки выгрузки [от, до); без них — весь список)
SHACHARIT = [(('Shacharit', k), t, None, None) for k, t in [
    ('Upon Arising', 'השכמת הבוקר'),
    ('Morning Blessings', 'ברכות השחר'),
    ('Morning Prayer', 'תפילת שחרית'),
    ('Kaddish DeRabbanan', 'קדיש דרבנן'),
    ('Hodu', 'הודו'),
    ('Pesukei Dezimra', 'פסוקי דזמרה'),
    ('Blessings of the Shema', 'ברכות קריאת שמע'),
    ('The Amidah', 'תפילת העמידה'),
    ('Tachnun', 'תחנון'),
    ('Torah Reading', 'קריאת התורה'),
    ('Ashrei Uva LeZion', 'אשרי ובא לציון'),
    ('Song of the Day', 'שיר של יום'),
    ("Mourner's Kaddish", 'קדיש יתום'),
    ('Kaveh', 'קווה'),
    ('Aleinu', 'עלינו לשבח'),
]]
MINCHA = [(('Mincha', k), t, None, None) for k, t in [
    ('Korbanot', 'קרבנות'),
    ('Ashrei', 'אשרי'),
    ('Amidah', 'תפילת העמידה'),
    ('Tachanun', 'תחנון'),
    ('Aleinu', 'עלינו לשבח'),
]]
MAARIV = [(('Maariv',), t, a, b) for t, a, b in [
    ('והוא רחום', 0, 3),
    ('ברכות קריאת שמע', 3, 16),
    ('תפילת העמידה', 16, 58),
    ('קדיש שלם', 58, 63),
    ('ויהי נועם', 63, 67),
    ('עלינו לשבח', 67, 74),
]]
BIRKAT = [(('Blessings', 'Birkat HaMazon'), t, a, b) for t, a, b in [
    ('על נהרות בבל', 0, 3),
    ('שיר המעלות', 3, 7),
    ('מים אחרונים', 7, 11),
    ('זימון', 11, 17),
    ('ברכת המזון', 17, 33),
]]
# названия разделов на языках сайта (меню «Разделы» и подзаголовок раздела); иврит — сам заголовок
TITLES = {
    'השכמת הבוקר': ('При пробуждении · Модэ ани', 'Upon Arising · Modeh Ani', 'Beim Aufstehen · Mode ani'),
    'ברכות השחר': ('Утренние благословения', 'Morning Blessings', 'Morgensegen'),
    'תפילת שחרית': ('Перед молитвой · Корбанот', 'Before Prayer · Korbanot', 'Vor dem Gebet · Korbanot'),
    'קדיש דרבנן': ('Кадиш де-Рабанан', 'Kaddish deRabbanan', 'Kaddisch de-Rabbanan'),
    'הודו': ('Ґоду', 'Hodu', 'Hodu'),
    'פסוקי דזמרה': ('Псукей де-зимра', 'Pesukei deZimra', 'Pessukej de-Simra'),
    'ברכות קריאת שמע': ('Благословения Шма', 'Blessings of the Shema', 'Segenssprüche des Schma'),
    'תפילת העמידה': ('Амида', 'Amidah', 'Amida'),
    'תחנון': ('Таханун', 'Tachanun', 'Tachanun'),
    'קריאת התורה': ('Чтение Торы', 'Torah Reading', 'Toralesung'),
    'אשרי ובא לציון': ('Ашрей и «У-ва ле-Цион»', 'Ashrei and Uva LeZion', 'Aschrej und Uwa le-Zion'),
    'שיר של יום': ('Песнь дня', 'Song of the Day', 'Lied des Tages'),
    'קדיש יתום': ('Кадиш скорбящих', "Mourner's Kaddish", 'Kaddisch der Trauernden'),
    'קווה': ('Кавэ', 'Kaveh', 'Kawe'),
    'עלינו לשבח': ('Алейну', 'Aleinu', 'Alejnu'),
    'קרבנות': ('Корбанот', 'Korbanot', 'Korbanot'),
    'אשרי': ('Ашрей', 'Ashrei', 'Aschrej'),
    'והוא רחום': ('Ве-ґу рахум', 'Vehu Rachum', 'We-hu rachum'),
    'קדיש שלם': ('Полный кадиш', 'Full Kaddish', 'Ganzer Kaddisch'),
    'ויהי נועם': ('Ви-ґи ноам', 'Vihi Noam', 'Wihi noam'),
    'על נהרות בבל': ('«Ал наґарот Бавель» — в дни Тахануна', 'Al Naharot Bavel — on days with Tachanun', 'Al naharot Bawel — an Tagen mit Tachanun'),
    'שיר המעלות': ('«Шир ґа-маалот» — в дни без Тахануна', 'Shir Hamaalot — on days without Tachanun', 'Schir ha-maalot — an Tagen ohne Tachanun'),
    'מים אחרונים': ('Маим ахроним', 'Mayim Acharonim', 'Majim acharonim'),
    'זימון': ('Зимун', 'Zimun', 'Simun'),
    'ברכת המזון': ('Биркат ґа-мазон', 'Birkat Hamazon', 'Birkat ha-Mason'),
}
PRAYERS = {'shacharit': SHACHARIT, 'mincha': MINCHA, 'maariv': MAARIV, 'birkat-hamazon': BIRKAT}
# сокращения без огласовок, которые произносят
KEEP_BARE = {'י״ה', 'בו״ה'}
MIN_SMALL_RUN = 4

# Амида: указания мелким шрифтом выгрузки (без огласовок) → пометки ⟦ключ⟧; текст пометки — на языке сайта (`siddur.note.<ключ>`),
# на странице она мелкая и не входит в подсветку. Только в разделах «תפילת העמידה».
AMIDAH = 'תפילת העמידה'
NOTES = {
    'בעשי״ת': 'aseret',
    'בקיץ': 'summer',
    'בחורף': 'winter',
    'כשהש״ץ חוזר הש״ע אומרים זה:': 'kedusha',
    'בתענית צבור אומר הש״ץ כאן עננו': 'aneinu-chazan',
    'בתענית צבור יאמר כאן': 'aneinu',
    'בראש חודש ובחול המועד אומרים:': 'yaale',
    'בראש חדש:': 'rosh-chodesh',
    'בחוה״מ פסח:': 'pesach',
    'בחוה״מ סוכות:': 'sukkot',
    'מודים דרבנן': 'modim-drabbanan',
    'בחנוכה ופורים אומרים כאן ועל הנסים:': 'al-hanisim',
    'לחנוכה—': 'chanukah',
    'לפורים—': 'purim',
    'לשליח ציבור:': 'chazan',
    'בתענית ציבור אומר השליח ציבור:': 'fast-chazan',
    'אמן': 'amen',
    '(בתשעה באב אומרים כאן נחם)': 'nachem-here',
    'במנחת תשעה באב:': 'nachem',
    'במוצאי שבת ויום טוב אומרים:': 'havdalah',
    # Биркат ґа-мазон
    'בראש חודש—': 'rc-hr',
    'בסוכות—': 'sukkot-hr',
    'ביום שמתפללים בו מוסף —': 'musaf',
}
# длинные указания — по началу
NOTE_PREFIX = {'בחנוכה ופורים אומרים כאן ועל הנסים': 'al-hanisim'}
# начало благословения Амиды — выделенные слова выгрузки → ⟦b<номер>⟧ (номер и название — `siddur.note.b<номер>`)
BLESSINGS = {
    'ברוך': 'b1', 'אתה גבור': 'b2', 'אתה קדוש': 'b3', 'אתה חונן': 'b4', 'השיבנו': 'b5', 'סלחלנו': 'b6', 'ראה נא': 'b7',
    'רפאנו': 'b8', 'ברך עלינו': 'b9', 'תקע': 'b10', 'השיבה': 'b11', 'ולמלשינים': 'b12', 'עלהצדיקים': 'b13', 'ולירושלם': 'b14',
    'אתצמח': 'b15', 'שמע קולנו': 'b16', 'רצה': 'b17', 'מודים': 'b18', 'שים': 'b19', 'אלהי': 'after',
}
MARK = re.compile(r'⟦[a-z0-9-]+⟧')

# Отдельные молитвы во всех разделах (владелец, 25.11.2026: «все отдельные молитвы отделить линией и заглавной буквой, как брахот
# Амиды, и подписать: Кадиш, Таханун…»): выделенное начало строки выгрузки → ⟦p⟧ (черта и большая первая буква); известные
# молитвы — ⟦pr-<ключ>⟧ (ещё и подпись `siddur.p.<ключ>`). Продолжения внутри Кадиша и Алейну — без черты.
CONTINUE = ('תתקבל', 'יהא שלמא', 'עשה שלום', 'על ישראל ועל רבנן', 'ועלכן')
PRAYER_NAMES = [
    ('מודה אני', 'modeh-ani'), ('מהטבו', 'mah-tovu'), ('מה טבו', 'mah-tovu'), ('אדון עולם', 'adon-olam'),
    ('אנא בכח', 'ana-bekoach'), ('הודו ליי', 'hodu'), ('ברוך שאמר', 'baruch-sheamar'), ('אשרי יושבי', 'ashrei'),
    ('אז ישיר', 'az-yashir'), ('אז ישירמשה', 'az-yashir'), ('ישתבח', 'yishtabach'), ('ברכו אתיי', 'barchu'),
    ('שמע ישראל', 'shema'), ('אשמנו', 'vidui'), ('אבינו מלכנו', 'avinu-malkenu'), ('ובא לציון', 'uva-letzion'),
    ('אין כאלהינו', 'ein-keloheinu'), ('עלינו לשבח', 'aleinu'),
]


def prayer_start(m: re.Match, raw: str) -> str:
    """Выделенное начало строки → ⟦p⟧, кроме продолжений Кадиша и Алейну и заголовков без огласовок («קדיש יתום»)."""
    rest = bare(raw[m.start(2):])
    if rest.startswith(CONTINUE) or not any(vocalized(w) for w in m.group(2).split()):
        return m.group(1) + m.group(2)
    return f'{m.group(1)}⟦p⟧ {m.group(2)}'


def bare_start(line: str) -> str:
    return bare(MARK.sub(' ', re.sub(r'⟦[^⟧]*⟧', ' ', line)))


def kaddish_kind(lines: list[str], k: int) -> str:
    """Вид Кадиша по его продолжению: «תתקבל» — полный, «על ישראל ועל רבנן» — де-рабанан, «יהא שלמא» — скорбящих, иначе — хаци."""
    kind = 'kaddish-half'
    for line in lines[k + 1:k + 5]:
        b = bare_start(line)
        if line.startswith('⟦p') :
            break
        if b.startswith('תתקבל'):
            return 'kaddish-full'
        if b.startswith('על ישראל ועל רבנן'):
            return 'kaddish-drabbanan'
        if b.startswith('יהא שלמא'):
            kind = 'kaddish-yatom'
    return kind


# абзацы Шма, не выделенные в выгрузке (владелец, 25.11.2026: «выделить большой буквой ואהבת, והיה, ויאמר»)
PARAGRAPHS = ('ואהבת את',)
def name_prayers(lines: list[str]) -> list[str]:
    """⟦p⟧ у известных молитв → ⟦pr-<ключ>⟧; невыделенные абзацы Шма → ⟦p⟧."""
    out = [f'⟦p⟧ {line}' if not line.startswith('⟦') and bare_start(line).startswith(PARAGRAPHS) else line for line in lines]
    for k, line in enumerate(out):
        if not line.startswith('⟦p⟧'):
            continue
        b = bare_start(line)
        key = 'kaddish' if b.startswith('יתגדל') else next((v for o, v in PRAYER_NAMES if b.startswith(o)), None)
        if key == 'kaddish':
            key = kaddish_kind(out, k)
        if key:
            out[k] = f'⟦pr-{key}⟧' + line[len('⟦p⟧'):]
    return out

# Условия вставок: ⟦?усл⟧ … ⟦/⟧ — текст говорят, только когда условие выполнено (⟦?!усл⟧ — когда нет); страница решает по календарю
# (`src/core/siddurDay.ts`: aseret, tal / geshem, bracha / matar, fast, av9, rc, pesach, sukkot, yaale, chanukah, purim, hanisim,
# havdalah; chazan — только хазан при повторении, читателю не показывается). Строка, которая начинается с такой пометки, — вся вставка.
LINE_COND = {'aseret': 'aseret', 'aneinu-chazan': 'chazan', 'aneinu': 'fast', 'yaale': 'yaale', 'al-hanisim': 'hanisim',
             'chanukah': 'chanukah', 'purim': 'purim', 'chazan': 'chazan', 'fast-chazan': 'chazan', 'nachem': 'av9',
             'havdalah': 'havdalah', 'rc-hr': 'rc', 'sukkot-hr': 'sukkot'}
YAALE = {'rosh-chodesh': 'rc', 'pesach': 'pesach', 'sukkot': 'sukkot'}


def conditions(line: str) -> str:
    """Строка Амиды с пометками → с условиями вставок (что говорят только летом / зимой, в Десять дней раскаяния, в пост…)."""
    # 2-е благословение: «летом — מוריד הטל: зимой — משיב הרוח ומוריד הגשם:»
    line = re.sub(r'⟦summer⟧ ([^⟦]*?:) ⟦winter⟧ ([^⟦]*?:)', r'⟦?tal⟧⟦summer⟧ \1⟦/⟧ ⟦?geshem⟧⟦winter⟧ \2⟦/⟧', line)
    # 9-е благословение: «ותן летом — ברכה (зимой — טל ומטר לברכה)»
    line = re.sub(r'⟦summer⟧ (\S+) \(⟦winter⟧ ([^)]*)\)', r'⟦?bracha⟧⟦summer⟧ \1⟦/⟧ ⟦?matar⟧⟦winter⟧ \2⟦/⟧', line)
    # Десять дней раскаяния — замена: «האל (המלך) הקדוש», «מלך אוהב צדקה ומשפט: (המלך המשפט:)», «עשה שלום (השלום)»
    def aseret(m: re.Match) -> str:
        words = m.group(1).split(' ')
        n = 4 if 'משפט' in bare(m.group(2)) else 1
        return ' '.join(words[:-n]) + f' ⟦?!aseret⟧{" ".join(words[-n:])}⟦/⟧ ⟦?aseret⟧⟦aseret⟧ {m.group(2)}⟦/⟧'
    line = re.sub(r'^(.*?) \(⟦aseret⟧ ([^)]*)\)', aseret, line)
    # «Яале ве-яво»: «ביום — Рош ходеш: ראש החדש הזה. Песах: חג המצות הזה. Суккот: חג הסכות הזה.»
    line = re.sub(r'⟦(rosh-chodesh|pesach|sukkot)⟧ ([^.⟦]*\.)', lambda m: f'⟦?{YAALE[m.group(1)]}⟧⟦{m.group(1)}⟧ {m.group(2)}⟦/⟧', line)
    line = line.replace('⟦nachem-here⟧', '⟦?av9⟧⟦nachem-here⟧⟦/⟧')
    # Биркат ґа-мазон: «מגדל (в день Мусафа — מגדול)»; «Авину малкену»: «חדש (в пост — ברך)»
    line = re.sub(r'(\S+) \(⟦musaf⟧ ([^)]*)\)', r'⟦?!yaale⟧\1⟦/⟧ ⟦?yaale⟧⟦musaf⟧ \2⟦/⟧', line)
    line = re.sub(r'(\S+) \(⟦taanit⟧ ([^)]*)\)', r'⟦?!taanit⟧\1⟦/⟧ ⟦?taanit⟧⟦taanit⟧ \2⟦/⟧', line)
    head = re.match(r'⟦([a-z0-9-]+)⟧', line)
    if head and head.group(1) in LINE_COND:
        line = f'⟦?{LINE_COND[head.group(1)]}⟧{line}⟦/⟧'
    return line


# Вне Амиды (владелец, 25.11.2026: «распространить» календарь): строки выгрузки, которые говорят не каждый день, — по указаниям
# выгрузки (`<small>` перед ними). (молитва, раздел) → [(первая, последняя строка выгрузки в разделе, условие, пометка)];
# условие с «!» — когда условие не выполнено. Пометка — у первой строки (`siddur.note.<ключ>`).
ITEM_CONDS = {
    ('shacharit', 'ברכות השחר'): [(15, 15, '!tishabav', 'not-tishabav')],  # «שעשה לי כל צרכי» — не в 9 Ава
    ('shacharit', 'תפילת שחרית'): [(4, 4, 'tachanun', 'tachanun'), (7, 7, 'tachanun', 'tachanun'),
                                    (19, 19, 'tachanun', 'tachanun'), (31, 31, 'tachanun', 'tachanun')],
    ('shacharit', 'פסוקי דזמרה'): [(16, 16, 'aseret', 'aseret')],  # «שיר המעלות ממעמקים»
    ('shacharit', 'תחנון'): [(1, 33, 'tachanun', 'tachanun'), (10, 30, 'monthu', 'monthu'), (31, 31, 'avinu', 'avinu')],
    ('shacharit', 'קריאת התורה'): [(1, 1, 'erechapayim', 'erechapayim')],
    ('shacharit', 'אשרי ובא לציון'): [(2, 2, 'tachanun', 'tachanun')],  # «למנצח… יענך»
    ('shacharit', 'שיר של יום'): [(1, 1, 'tachanun', 'tachanun'), *[(2 + 4 * d, 4 + 4 * d, f'day{d}', f'day{d}') for d in range(1, 7)],
                                  (31, 31, 'rc', 'rc'), (34, 34, 'elul', 'elul')],
    ('mincha', 'תחנון'): [(1, 11, 'tachanun', 'tachanun'), (9, 9, 'avinu', 'avinu')],
    ('mincha', 'עלינו לשבח'): [(0, 0, 'elul', 'elul')],
    ('maariv', 'ויהי נועם'): [(1, 2, 'vihinoam', 'vihinoam'), (3, 3, 'motzash', 'motzash')],
    ('birkat-hamazon', 'על נהרות בבל'): [(1, 2, 'tachanun', 'tachanun')],
    ('birkat-hamazon', 'שיר המעלות'): [(1, 1, '!tachanun', 'no-tachanun')],
}
# разделы с пометками, как в Амиде (мелкий шрифт → ⟦ключ⟧, условия строк)
NOTE_SECTIONS = {('birkat-hamazon', 'ברכת המזון')}
# «Авину малкену» — весь мелким шрифтом, внутри: «בעשרת ימי תשובה:» (כתבנו…) и «[בתענית ציבור … ]» (זכרנו…)
AVINU = {('shacharit', 'תחנון'): 31, ('mincha', 'תחנון'): 9}


def avinu_lines(raw: str) -> list[str]:
    raw = re.sub(r'^\s*<small>|</small>\s*$', '', raw)
    raw = raw.replace('(<small>בתענית ציבור:</small>', '(⟦taanit⟧ ')
    raw = raw.replace('<small>בעשרת ימי תשובה:</small>', '⟦blk-aseret⟧')
    raw = raw.replace('[<small>בתענית ציבור</small>', '⟦blk-taanit⟧')
    out, block, note = [], None, ''
    for part in re.split(r'<br\s*/?>', raw):
        if '⟦blk-' in part:
            block = 'aseret' if 'blk-aseret' in part else 'taanit'
            note = f'⟦{block}⟧ '
            continue
        end = part.rstrip().endswith(']')
        line = clean_line(split_glued(part.replace(']', ' ')) if '<' not in part else part.replace(']', ' '))
        if line:
            line = conditions(line)
            out.append(f'⟦?{block}⟧{note}{line}⟦/⟧' if block else line)
            note = ''
        if end:
            block = None
    return out


def wrap_items(lines: list[str], items: list[int], conds: list[tuple]) -> list[str]:
    """Строки из строк выгрузки [от, до] — в ⟦?усл⟧ … ⟦/⟧; пометка — у первой."""
    out = list(lines)
    for a, b, cond, note in sorted(conds, key=lambda c: (c[1] - c[0]), reverse=False):
        first = True
        for k, j in enumerate(items):
            if a <= j <= b:
                neg = '!' if cond.startswith('!') else ''
                out[k] = f'⟦?{neg}{cond.lstrip("!")}⟧' + (f'⟦{note}⟧ ' if first else '') + out[k] + '⟦/⟧'
                first = False
    return out


def bare(text: str) -> str:
    """Без тегов, огласовок, макафа и невидимых знаков — для сравнения с NOTES и BLESSINGS."""
    text = re.sub(r'<[^>]+>', ' ', text).replace('־', '').replace('͏', '')
    text = re.sub('[\u0591-\u05C7]', '', text)
    return re.sub(r'\s+', ' ', text).strip().rstrip(',')


def note_small(inner: str) -> str:
    """Мелкий шрифт Амиды: указание до первого <br> → пометка, дальше — огласованные куски молитвы."""
    head = bare(re.split(r'<br\s*/?>', inner)[0])
    key = NOTES.get(head) or next((v for k, v in NOTE_PREFIX.items() if head.startswith(k)), None)
    return ' ' + (f'⟦{key}⟧ ' if key else '') + small_runs(inner) + ' '


def mark_blessing(m: re.Match) -> str:
    key = BLESSINGS.get(bare(m.group(1)))
    return (f' ⟦{key}⟧ ' if key else ' ') + m.group(1) + ' '


LETTER = re.compile('[א-ת]')
POINT = re.compile('[ְ-ׇּׁׂ]')


def vocalized(word: str) -> bool:
    return bool(LETTER.search(word)) and bool(POINT.search(word))


def split_glued(text: str) -> str:
    """«זה:שִׁיר», «מלכנו.אָבִֽינוּ» — пробел после знака; «עננועֲנֵֽנוּ» — подпись без огласовок, слитая со словом."""
    text = re.sub(r'([:.])(?=[א-ת])', r'\1 ', text)
    out = []
    for w in text.split():
        m = re.match('^([א-ת]{2,})(?=[א-ת][֑-ׇ])', w)
        if m and not POINT.search(m.group(1)):
            out += [m.group(1), w[len(m.group(1)):]]
        else:
            out.append(w)
    return ' '.join(out)


def small_runs(text: str) -> str:
    """Из мелкого шрифта — только огласованные куски молитвы от MIN_SMALL_RUN слов."""
    words = split_glued(re.sub(r'<[^>]+>', ' ', text)).split()
    runs, cur = [], []
    for w in words + ['']:
        if w and vocalized(w):
            cur.append(w)
            continue
        if len(cur) >= MIN_SMALL_RUN:
            runs.append(' '.join(cur))
        cur = []
    return ' '.join(runs)


def clean_line(text: str) -> str:
    text = text.replace('͏', '').replace('‍', '').replace('\xa0', ' ').replace(' ', ' ').replace('|', ' ')
    text = re.sub(r'<[^>]+>', ' ', text)
    words = [w for w in text.split() if not LETTER.search(w) or vocalized(w) or w.strip('()[]') in KEEP_BARE]
    s = ' '.join(words)
    s = re.sub(r'\(\s*\)|\[\s*\]', ' ', s)
    s = re.sub(r'([(\[])\s+', r'\1', s)
    s = re.sub(r'\s+([)\],.:;])', r'\1', s)
    s = re.sub(r'([,.:;])(?=[^\s)\]])', r'\1 ', s)
    s = re.sub(r'\s+', ' ', s).strip()
    s = re.sub(r'^[,.:;\s—-]+', '', s)
    return s if LETTER.search(s) else ''


def main() -> None:
    data = json.loads(SRC.read_text(encoding='utf-8'))
    index = {}
    for name, plan in PRAYERS.items():
        sections = []
        for path, title, start, end in plan:
            node = data['text']
            for k in path:
                node = node[k]
            lines, items = [], []
            amidah = title == AMIDAH
            notes = amidah or (name, title) in NOTE_SECTIONS
            carry = ''  # пометки строки без слов (указание перед <br>) — к началу следующей строки
            for j, raw in enumerate(node[start:end]):
                if AVINU.get((name, title)) == j:
                    got = avinu_lines(raw)
                    lines += got
                    items += [j] * len(got)
                    continue
                if amidah:
                    raw = re.sub(r'<small>(.*?)</small>', lambda m: note_small(m.group(1)), raw, flags=re.S)
                    raw = re.sub(r'<b>(.*?)</b>', mark_blessing, raw, flags=re.S)
                elif notes:
                    raw = re.sub(r'<small>(.*?)</small>', lambda m: note_small(m.group(1)), raw, flags=re.S)
                    raw = re.sub(r'^((?:\s|<br\s*/?>)*)<b>(.*?)</b>', lambda m: prayer_start(m, raw), raw, count=1, flags=re.S)
                else:
                    raw = re.sub(r'<small>(.*?)</small>', lambda m: ' ' + small_runs(m.group(1)) + ' ', raw, flags=re.S)
                    # выделенное начало строки — новая молитва (кроме продолжений Кадиша и Алейну)
                    raw = re.sub(r'^((?:\s|<br\s*/?>)*)<b>(.*?)</b>', lambda m: prayer_start(m, raw), raw, count=1, flags=re.S)
                for part in re.split(r'<br\s*/?>', raw):
                    line = clean_line(split_glued(part) if '<' not in part else part)
                    if line:
                        line = f'{carry} {line}'.strip() if carry else line
                        lines.append(conditions(line) if notes else line)
                        items.append(j)
                        carry = ''
                    else:
                        carry = ' '.join([carry, *MARK.findall(part)]).strip()
            if lines:
                if not amidah:
                    lines = name_prayers(lines)
                lines = wrap_items(lines, items, ITEM_CONDS.get((name, title), []))
                ru, en, de = TITLES[title]
                sections.append({'key': '/'.join(path) + (f':{start}' if start is not None else ''), 'title': title,
                                 't': {'ru': ru, 'en': en, 'de': de}, 'lines': lines})
        out = {
            'title': data['title'],
            'heTitle': data['heTitle'],
            'source': data['versionSource'],
            'version': (data.get('versions') or [['Wikisource']])[0][0],
            'sections': sections,
        }
        path = OUT_DIR / f'{name}-he.json'
        path.write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
        print(f'{path.relative_to(ROOT)}: {len(sections)} sections, {sum(len(s["lines"]) for s in sections)} lines')
        index[name] = [{'title': s['title'], 't': s['t']} for s in sections]
    # меню «Разделы» — все молитвы сразу, без загрузки их текстов
    (OUT_DIR / 'index.json').write_text(json.dumps(index, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
