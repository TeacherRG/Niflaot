#!/usr/bin/env python3
"""Шахарит сидура «Теилат Ашем» — только слова молитвы.

Источник — выгрузка Sefaria «Weekday Siddur Chabad» (Wikisource), `public/reading/siddur/Weekday Siddur Chabad - he - merged.json`.
В ней в строки молитвы вписаны указания мелким шрифтом (`<small>`: законы, «בעשי״ת», «אמן», «חזן:», номера), заголовки без огласовок
(«ברכת הגומל», «קדיש יתום») и пометки (кетив «לא כ'», «(פב״פ)»). Здесь остаётся только текст, который произносят:
- из `<small>` — только огласованные куски от 4 слов (Кдуша, «Анену», «Модим де-Рабанан», «Авину малкену», «Барух шем…»);
- вне `<small>` — слова с огласовками (и «י״ה בו״ה» в «Ле-шем ихуд»);
- `<br>` — новая строка, без тегов, без «|», лишних пробелов и пустых скобок.

Запуск: python3 scripts/build-shacharit.py → public/reading/siddur/shacharit-he.json
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'public/reading/siddur/Weekday Siddur Chabad - he - merged.json'
OUT = ROOT / 'public/reading/siddur/shacharit-he.json'

SECTIONS = [
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
]
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
    shacharit = data['text']['Shacharit']
    sections = []
    for key, title in SECTIONS:
        lines = []
        for raw in shacharit[key]:
            raw = re.sub(r'<small>(.*?)</small>', lambda m: ' ' + small_runs(m.group(1)) + ' ', raw, flags=re.S)
            for part in re.split(r'<br\s*/?>', raw):
                line = clean_line(split_glued(part) if '<' not in part else part)
                if line:
                    lines.append(line)
        if lines:
            sections.append({'key': key, 'title': title, 'lines': lines})
    out = {
        'title': data['title'],
        'heTitle': data['heTitle'],
        'source': data['versionSource'],
        'version': (data.get('versions') or [['Wikisource']])[0][0],
        'sections': sections,
    }
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=1) + '\n', encoding='utf-8')
    print(f'{OUT.relative_to(ROOT)}: {len(sections)} sections, {sum(len(s["lines"]) for s in sections)} lines')


if __name__ == '__main__':
    main()
