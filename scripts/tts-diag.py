"""Temporary: where do the clicks of «Слушать» come from — the recording of the worker or Gemini itself."""
import json, struct, sys, base64

def stats(name, pcm, rate):
    n = len(pcm) // 2
    s = struct.unpack(f'<{n}h', pcm[: n * 2])
    d = [abs(s[i] - s[i - 1]) for i in range(1, n)]
    # a click: one jump far above the jumps around it (speech at 24 kHz changes smoothly from sample to sample)
    clicks = []
    W = 48
    for i in range(W, len(d) - W):
        if d[i] > 1500:
            around = sorted(d[i - W : i - 2] + d[i + 3 : i + W])
            med = around[len(around) // 2] or 1
            if d[i] > 12 * med and (not clicks or i - clicks[-1] > rate // 100):
                clicks.append(i)
    times = [round(c / rate, 2) for c in clicks]
    gaps = [round(b - a, 2) for a, b in zip(times, times[1:])]
    print(f'== {name}: {n / rate:.1f} s at {rate} Hz, peak {max(map(abs, s)) if s else 0}')
    print(f'   clicks: {len(clicks)} ({len(clicks) / max(1e-9, n / rate):.2f} per s); at: {times[:40]}')
    if gaps:
        gs = sorted(gaps)
        print(f'   spacing: median {gs[len(gs) // 2]} s, min {gs[0]}, max {gs[-1]}')
    # silent stretches inside the speech (|x| < 30 for > 120 ms)
    run, quiet = 0, []
    for i, x in enumerate(s):
        if abs(x) < 30:
            run += 1
        else:
            if run > rate * 0.12: quiet.append((round((i - run) / rate, 2), round(run / rate, 2)))
            run = 0
    print(f'   pauses > 120 ms: {len(quiet)}; {quiet[:20]}')

for f in sys.argv[1:]:
    b = open(f, 'rb').read()
    if f.endswith('.wav'):
        if len(b) < 44:
            print(f'== {f}: not a WAV ({b[:200]!r})')
            continue
        stats(f, b[44:], struct.unpack('<I', b[24:28])[0])
        continue
    g = json.loads(b)
    c = (g.get('candidates') or [{}])[0]
    print(f'== {f}: modelVersion {g.get("modelVersion")}, finish {c.get("finishReason")}, error {g.get("error", {}).get("message")}')
    for k, p in enumerate((c.get('content') or {}).get('parts', [])):
        d = p.get('inlineData')
        if d:
            rate = int(d['mimeType'].split('rate=')[1].split(';')[0]) if 'rate=' in d['mimeType'] else 24000
            pcm = base64.b64decode(d['data'])
            stats(f'{f} part {k} ({d["mimeType"]})', pcm, rate)
            open(f.replace('.json', f'-{k}.wav'), 'wb').write(b'RIFF' + struct.pack('<I', 36 + len(pcm)) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 1, 1, rate, rate * 2, 2, 16) + b'data' + struct.pack('<I', len(pcm)) + pcm)
