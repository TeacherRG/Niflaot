"""Temporary: where do the clicks of «Слушать» come from — the recording of the worker or Gemini itself."""
import json, struct, sys, base64

def stats(name, pcm, rate):
    n = len(pcm) // 2
    s = struct.unpack(f'<{n}h', pcm[: n * 2])
    jumps = [i for i in range(1, n) if abs(s[i] - s[i - 1]) > 12000]
    zeros, run, gaps = 0, 0, []
    for i, x in enumerate(s):
        if x == 0:
            run += 1
        else:
            if run > rate // 50: gaps.append((round((i - run) / rate, 2), round(run / rate, 3)))
            run = 0
    peak = max(abs(x) for x in s) if s else 0
    print(f'== {name}: {n} samples, {n / rate:.1f} s at {rate} Hz, peak {peak}')
    print(f'   big jumps (clicks?): {len(jumps)}; first at s: {[round(j / rate, 2) for j in jumps[:25]]}')
    print(f'   exact-zero gaps > 20 ms: {len(gaps)}; first: {gaps[:15]}')
    print(f'   odd byte count: {len(pcm) % 2}; "RIFF" inside data: {pcm.find(b"RIFF")}')
    # byte order: little-endian speech has small values; swapped — noise near full scale
    alt = struct.unpack(f'>{min(n, 48000)}h', pcm[: min(n, 48000) * 2])
    print(f'   mean |x| little-endian {sum(map(abs, s[:48000])) // max(1, min(n, 48000))}, big-endian {sum(map(abs, alt)) // max(1, len(alt))}')

wav = open(sys.argv[1], 'rb').read()
print('worker file:', len(wav), 'bytes; header', wav[:4], wav[8:16], 'fmt', struct.unpack('<HHIIHH', wav[20:36]), 'data', struct.unpack('<I', wav[40:44]))
stats('worker WAV', wav[44:], struct.unpack('<I', wav[24:28])[0])
g = json.load(open(sys.argv[2]))
print('gemini modelVersion:', g.get('modelVersion'), 'usage:', g.get('usageMetadata'))
parts = g['candidates'][0]['content']['parts']
print('gemini parts:', [(p.get('inlineData', {}).get('mimeType'), len(p.get('inlineData', {}).get('data', ''))) for p in parts])
for k, p in enumerate(parts):
    d = p.get('inlineData')
    if d:
        rate = int(d['mimeType'].split('rate=')[1].split(';')[0]) if 'rate=' in d['mimeType'] else 24000
        stats(f'gemini direct, part {k}', base64.b64decode(d['data']), rate)
