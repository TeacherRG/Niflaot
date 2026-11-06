#!/usr/bin/env python3
"""
Разметка записей «Святого чтения» по паузам чтеца — когда начинается каждое слово.

Слов в записи не размечал никто, а равномерная оценка (по длине слов на всю запись) уходит вперёд
или отстаёт: чтец делает паузы в конце стиха и на знаках-«остановках» (этнахта, ревиа…). Здесь:
1. запись → громкость каждые 10 мс (ffmpeg), паузы — тише «пола» записи на 6 дБ, от 0,2 с;
2. куски речи между паузами раскладываются по словам (динамическое программирование): кусок —
   несколько слов подряд, его длина ≈ сумма длин слов (буквы), пауза — скорее на конце стиха
   и на разделительном знаке, чем между связанными словами; лишний кусок (объявление главы,
   вздох) может остаться без слов;
3. внутри куска слова идут по длине.

Выход — public/reading/times/<запись>.json: [время начала каждого куска текста со словами, с]
(как `startTimes` в src/core/reading.ts: куски между пробелами, кроме пасека «׀»).

  python3 scripts/reading-times.py            # все записи
  python3 scripts/reading-times.py 23 119.2   # только эти
"""
import json, math, re, subprocess, sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
AUDIO = ROOT / 'public/reading/Audio'
OUT = ROOT / 'public/reading/times'
HOP = 0.01

# разделительные знаки (и прозы, и книг אמ״ת); этнахта и конец стиха — отдельно
DISJ = set('֖֛֚֭֮֒֓֔֕֗֘֙֜֝֞֟֠֡׀')
ETNACHTA = '֑'


def verses_of(name: str) -> list[str]:
    if name == 'tora_53':
        return json.loads((ROOT / 'public/reading/torah/haazinu.json').read_text())['v']
    ch, part = (name.split('.') + [''])[:2]
    v = json.loads((ROOT / f'public/reading/tehillim/{int(ch)}.json').read_text())['v']
    if int(ch) == 119:
        v = v[96:] if part == '2' else v[:96]
    return v


def tokens(verses: list[str]):
    """куски со словами: [длина, сила остановки после него 0–3] — как tokens() на сайте (пасек «׀» — не кусок)"""
    out = []
    for v in verses:
        parts = v.split()
        mine = []
        for s in parts:
            if any(re.search('[א-ת]', x) for x in s.split('־')):
                stop = 2 if ETNACHTA in s else 1 if any(c in DISJ for c in s) else 0
                mine.append([len(re.findall('[א-ת]', s)) + 1.5, stop])
            elif '׀' in s and mine:
                mine[-1][1] = max(mine[-1][1], 1)
        if mine:
            mine[-1][1] = 3
        out += mine
    return out


def loudness(path: Path) -> np.ndarray:
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', str(path), '-ac', '1', '-ar', '16000', '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    n = int(16000 * HOP)
    m = len(x) // n
    db = 20 * np.log10(np.sqrt((x[: m * n].reshape(m, n) ** 2).mean(1) + 1e-12))
    return np.convolve(db, np.ones(5) / 5, 'same')


def segments(db: np.ndarray, min_pause=0.2, add=6.0):
    """куски речи [(начало, конец, пауза после)]"""
    # «пол» записи — без цифровой тишины в начале и в конце (−120 дБ)
    heard = db[db > -90]
    thr = np.percentile(heard if len(heard) else db, 5) + add
    sil = db < thr
    segs, i, n = [], 0, len(db)
    start = None
    while i < n:
        if sil[i]:
            j = i
            while j < n and sil[j]:
                j += 1
            if (j - i) * HOP >= min_pause or j == n or i == 0:
                if start is not None:
                    segs.append([start * HOP, i * HOP, (j - i) * HOP])
                start = None
            elif start is None:
                start = i
            i = j
        else:
            if start is None:
                start = i
            i += 1
    if start is not None:
        segs.append([start * HOP, n * HOP, 0.0])
    # совсем короткие всплески (щелчок, вдох) — не речь
    return [s for s in segs if s[1] - s[0] >= 0.12]


PAUSE_COST = {3: 0.0, 2: 0.15, 1: 0.45, 0: 2.5}
EXTRA = 3.0       # кусок без слов (объявление, вздох)
MAX_WORDS = 30    # слов в одном куске — не больше


def align(toks, segs):
    N, M = len(toks), len(segs)
    U = np.cumsum([0.0] + [t[0] for t in toks])
    speech = sum(e - s for s, e, _ in segs)
    rate = speech / U[-1]
    INF = float('inf')
    cost = np.full((M + 1, N + 1), INF)
    back = np.zeros((M + 1, N + 1), dtype=np.int32)
    cost[0, 0] = 0
    for j in range(M):
        s, e, p = segs[j]
        d = e - s
        # пауза после куска: длинная пауза между связанными словами — дорого
        pw = min(p, 1.5)
        row = cost[j]
        ks = np.nonzero(row < INF)[0]
        for k in ks:
            base = row[k]
            # кусок без слов
            c = base + EXTRA + d
            if c < cost[j + 1, k]:
                cost[j + 1, k], back[j + 1, k] = c, k
            for k2 in range(k + 1, min(N, k + MAX_WORDS) + 1):
                exp = (U[k2] - U[k]) * rate
                c = base + 4 * math.log(d / exp) ** 2
                if j < M - 1 and k2 < N:
                    c += pw * PAUSE_COST[toks[k2 - 1][1]]
                if k2 < N and j == M - 1:
                    continue
                if c < cost[j + 1, k2]:
                    cost[j + 1, k2], back[j + 1, k2] = c, k
    if cost[M, N] == INF:
        raise ValueError('не разложилось')
    # назад: какие слова у какого куска
    spans, k = [], N
    for j in range(M, 0, -1):
        k0 = back[j, k]
        spans.append((j - 1, k0, k))
        k = k0
    spans.reverse()
    times = [0.0] * N
    for j, a, b in spans:
        if a == b:
            continue
        s, e, _ = segs[j]
        tot = U[b] - U[a]
        for w in range(a, b):
            times[w] = round(s + (U[w] - U[a]) / tot * (e - s), 2)
    stops = sum(1 for j, a, b in spans if b > a and b < N and toks[b - 1][1] == 3)
    return times, cost[M, N] / max(M, 1), stops


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    names = sys.argv[1:] or sorted((p.stem for p in AUDIO.glob('*.mp3')), key=lambda s: (not s[0].isdigit(), [int(x) if x.isdigit() else x for x in re.split(r'(\d+)', s)]))
    for name in names:
        toks = tokens(verses_of(name))
        db = loudness(AUDIO / f'{name}.mp3')
        verses_n = sum(1 for t in toks if t[1] == 3)
        # порог паузы: у тихих записей «пол» ниже — если пауз меньше, чем стихов, порог выше
        for add in (6, 9, 12, 15, 18):
            segs = segments(db, add=add)
            if len(segs) >= verses_n:
                break
        times, avg, stops = align(toks, segs)
        (OUT / f'{name}.json').write_text(json.dumps(times, separators=(',', ':')))
        print(f'{name}: слов {len(toks)}, кусков речи {len(segs)}, концов стиха на паузе {stops}/{verses_n - 1}, цена {avg:.2f}')


if __name__ == '__main__':
    main()
