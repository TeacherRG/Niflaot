#!/usr/bin/env python3
"""
Разбор слов Пророков и Писаний моделью Dicta (DictaBERT-joint, dicta-il/dictabert-joint на Hugging Face; Dicta — Israel Center
for Text Analysis): для окошка над словом на странице дня (WordPop.tsx) — приставки, основная форма (лемма) и окончание
каждого слова нашего текста. Из облачного контейнера Hugging Face закрыт — запускает `.github/workflows/dicta-parse.yml`.

    python3 scripts/dicta-parse.py [--limit N] [--probe]

Пишет в `public/tanakh/words/<дата>.json` поле `v` (как `fetch-words.py build`, формат — в его описании) и рядом поле `src: "dicta"`;
лемма, которой нет в словаре проекта (src/tanakh/words.json, 1500 слов), пишется самой собой: `=лемма` вместо номера.
Сравнение с прежним разбором (Open Scriptures) — в `dicta-report.md`: где совпала основная форма, приставки, окончание.
`--probe` — только напечатать сырой ответ модели на два стиха и описание модели (лицензия).
"""
import collections, glob, json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DAYS = ROOT / 'public' / 'tanakh'
OUT_DAYS = DAYS / 'words'
WORDS = ROOT / 'src' / 'tanakh' / 'words.json'
MODEL = 'dicta-il/dictabert-joint'

MARKS = re.compile(r'[֑-ׇ]')
FINAL = str.maketrans('ךםןףץ', 'כמנפצ')
def letters(s):
    return re.sub(r'[^א-ת]', '', s).translate(FINAL)

# приставки Dicta (отдельные куски `seg`) → буквы OSHB, которые понимает WordPop
PREFIX = {'ו': 'c', 'ה': 'd', 'ב': 'b', 'ל': 'l', 'מ': 'm', 'כ': 'k', 'ש': 's'}
# часть речи Dicta (UD) → начало части речи словаря Стронга в words.json
POS = {'VERB': 'v', 'AUX': 'v', 'NOUN': 'n', 'PROPN': 'n-pr', 'ADJ': 'a', 'ADP': 'prep', 'ADV': 'adv', 'PRON': 'p',
       'CCONJ': 'conj', 'SCONJ': 'conj', 'NUM': 'n', 'INTJ': 'inj', 'DET': 'd'}
# Имена в тексте проекта написаны с ק (אלקים) и ה׳ — модели даём обычное написание
NAME_IDS = {'430', '433', '426', '410', '136', '7706', '3050'}


def verses():
    """все стихи дней цикла: (дата, раздел, «книга глава:стих», слова нашего текста)"""
    out = []
    for f in sorted(DAYS.glob('????-??-??.json')):
        day = json.loads(f.read_text(encoding='utf-8'))
        for s in ('neviim', 'ketuvim'):
            for v in day[s]['verses']:
                parts = [p for p in re.split(r'[ ־]+', v['he'].replace('׃', '').strip()) if p]
                out.append((f.stem, s, f"{v['b']} {v['c']}:{v['v']}", parts))
    return out


def model_word(p):
    """слово, как его увидит модель: без огласовок; Имена — обычным написанием"""
    if re.fullmatch(r'ה[׳\']', MARKS.sub('', p)): return 'יהוה'
    w = letters(MARKS.sub('', p).replace('-', ''))
    return re.sub(r'אלק', 'אלה', w)


def dictionary():
    """буквы основной формы → [(номер, часть речи, место по частоте)]; второй ключ — без ו и י (Dicta пишет полным письмом)"""
    words = json.loads(WORDS.read_text(encoding='utf-8'))['words']
    full, plain = collections.defaultdict(list), collections.defaultdict(list)
    for i, w in enumerate(words):
        L = letters(w['he'])
        if w['id'] in NAME_IDS: L = L.replace('ק', 'ה')
        full[L].append((w['id'], w['pos'], i))
        plain[L[:1] + re.sub('[וי]', '', L[1:])].append((w['id'], w['pos'], i))
    return full, plain


def pick(lemma, pos, full, plain):
    L = letters(lemma)
    cands = full.get(L) or plain.get(L[:1] + re.sub('[וי]', '', L[1:])) or []
    if not cands: return None
    want = POS.get(pos, '')
    good = [c for c in cands if want and c[1].split()[0].startswith(want)]
    return min(good or cands, key=lambda c: c[2])[0]


def code(tok, part, nxt, full, plain):
    """разбор одного слова → «приставки|номер|окончание» (как у fetch-words.py)"""
    if re.fullmatch(r'ה[׳\']', MARKS.sub('', part)): return '|H'
    morph = tok.get('morph') or {}
    seg = tok.get('seg') or [tok.get('token', '')]
    pref = ''.join(PREFIX.get(letters(s)[:1], '') for s in seg[:-1] if len(letters(s)) == 1)
    pos = morph.get('pos', '')
    lex = tok.get('lex') or ''
    if pos == 'PROPN': lid = 'n'
    else:
        lid = pick(lex, pos, full, plain) or (f'={letters(lex)}' if letters(lex) else '')
    suf = ''
    sf = morph.get('suffix_feats') or {}
    if morph.get('suffix') and sf:
        g = {'Masc': 'm', 'Fem': 'f'}.get(sf.get('Gender', ''), 'c')
        n = {'Sing': 's', 'Plur': 'p'}.get(sf.get('Number', ''), '')
        p = str(sf.get('Person', ''))[:1]
        if p in '123' and n: suf = f'{p}{g}{n}'
    # кетив: слово без огласовок, а за ним — кери в скобках
    ketiv = not MARKS.search(part) and nxt is not None and nxt.startswith('[') and len(letters(part)) > 1
    return ('!' if ketiv else '') + '|'.join([pref, lid, suf]).rstrip('|')


def main():
    args = sys.argv[1:]
    import torch
    from transformers import AutoModel, AutoTokenizer
    tok = AutoTokenizer.from_pretrained(MODEL)
    model = AutoModel.from_pretrained(MODEL, trust_remote_code=True)
    model.eval()
    vs = verses()
    if '--probe' in args:
        from huggingface_hub import hf_hub_download
        print(Path(hf_hub_download(MODEL, 'README.md')).read_text(encoding='utf-8')[:1500])
        for _, _, ref, parts in vs[:2]:
            with torch.no_grad():
                print(ref, json.dumps(model.predict([' '.join(model_word(p) for p in parts)], tok, output_style='json'), ensure_ascii=False)[:3000])
        return
    if '--limit' in args: vs = vs[: int(args[args.index('--limit') + 1])]
    full, plain = dictionary()
    rows, bad = {}, 0
    B = 16
    for i in range(0, len(vs), B):
        batch = vs[i:i + B]
        texts = [' '.join(w for w in (model_word(p) for p in parts) if w) for _, _, _, parts in batch]
        with torch.no_grad():
            res = model.predict(texts, tok, output_style='json')
        for (date, s, ref, parts), r in zip(batch, res):
            toks = r.get('tokens', [])
            real = [j for j, p in enumerate(parts) if model_word(p)]
            row = [0] * len(parts)
            if len(toks) != len(real):
                bad += 1
            else:
                for t, j in zip(toks, real):
                    row[j] = code(t, parts[j], parts[j + 1] if j + 1 < len(parts) else None, full, plain)
            rows[(date, s, ref)] = row
        if i // B % 50 == 0: print(f'{i + len(batch)} / {len(vs)} verses', flush=True)
    # сравнение с прежним разбором (Open Scriptures) и запись
    agree = collections.Counter()
    by_day = collections.defaultdict(dict)
    for (date, s, ref), row in rows.items(): by_day[date].setdefault(s, {})[ref] = row
    diffs = []
    for date, secs in sorted(by_day.items()):
        f = OUT_DAYS / f'{date}.json'
        out = json.loads(f.read_text(encoding='utf-8'))
        for s, vsec in secs.items():
            old = out[s].get('v', {})
            for ref, row in vsec.items():
                for a, b in zip(old.get(ref, []), row):
                    if not a or not b: continue
                    pa, pb = a.lstrip('!').split('|') + ['', ''], b.lstrip('!').split('|') + ['', '']
                    agree['words'] += 1
                    agree['prefix'] += pa[0] == pb[0]
                    agree['suffix'] += pa[2] == pb[2]
                    if pa[1][:1].isdigit():
                        agree['oshb_dict'] += 1
                        agree['lemma'] += pa[1] == pb[1]
                        if pa[1] != pb[1] and len(diffs) < 60: diffs.append(f'{ref}: OSHB {a} → Dicta {b}')
            out[s]['v'] = vsec
        out['src'] = 'dicta'
        f.write_text(json.dumps(out, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    pct = lambda k, n: f"{agree[k] / max(1, agree[n]) * 100:.1f}%"
    report = [
        f'Разбор Dicta (`{MODEL}`): {len(rows)} стихов, не сопоставились по словам: {bad}.',
        '',
        f'Совпадение с прежним разбором (Open Scriptures), по {agree["words"]} словам: приставки — {pct("prefix", "words")}, '
        f'окончание — {pct("suffix", "words")}, основная форма у слов словаря — {pct("lemma", "oshb_dict")} (из {agree["oshb_dict"]}).',
        '',
        'Примеры расхождений основной формы:',
        '',
        *[f'- {d}' for d in diffs],
    ]
    (ROOT / 'dicta-report.md').write_text('\n'.join(report) + '\n', encoding='utf-8')
    print('\n'.join(report[:3]))


if __name__ == '__main__':
    main()
