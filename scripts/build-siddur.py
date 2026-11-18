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
            lines = []
            for raw in node[start:end]:
                raw = re.sub(r'<small>(.*?)</small>', lambda m: ' ' + small_runs(m.group(1)) + ' ', raw, flags=re.S)
                for part in re.split(r'<br\s*/?>', raw):
                    line = clean_line(split_glued(part) if '<' not in part else part)
                    if line:
                        lines.append(line)
            if lines:
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
