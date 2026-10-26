#!/usr/bin/env python3
"""
«Петь в микрофон» (src/core/singing.ts): the pitch of the recording of a niggun, worked out once — every 50 ms the
pitch of the voice in the recording (MIDI note, one decimal; 0 — no clear pitch: a pause, a breath, noise).
The site compares the singer's voice with it, octave aside.

  python3 scripts/nigun-pitch.py lubo-bratzi      → public/nigun/lubo-bratzi.pitch.json

Needs ffmpeg and numpy. Autocorrelation over the whole mix (the browser hears the singer with pitchy, src/core/singing.ts).
Tried 26.10.2026: Spotify Basic Pitch on the mix gives no better melody (repeats of the same line agree 51–59 %, this — 61 %);
a better reference needs the voice separated first (Demucs, as UltraSinger does) — its model weights are not reachable from
the cloud container, so that would run in a GitHub Action or on a computer.
"""
import json, subprocess, sys
import numpy as np

SR = 16000
HOP = 0.05
WIN = 2048
LO, HI = 70, 1000  # Hz: a low man's voice … a child's high note


def pitch(frame: np.ndarray) -> float:
    frame = frame - frame.mean()
    rms = np.sqrt((frame ** 2).mean())
    if rms < 0.01:
        return 0.0
    # normalized autocorrelation over the lags of the voice range
    ac = np.correlate(frame, frame, 'full')[len(frame) - 1:]
    ac /= ac[0] + 1e-9
    lo, hi = int(SR / HI), int(SR / LO)
    seg = ac[lo:hi]
    k = int(np.argmax(seg))
    best = seg[k]
    if best < 0.45:
        return 0.0
    # the first peak close to the best one — not an octave below it
    for j in range(len(seg)):
        if seg[j] >= 0.9 * best and (j == 0 or seg[j] >= seg[j - 1]) and (j + 1 >= len(seg) or seg[j] >= seg[j + 1]):
            k = j
            break
    lag = lo + k
    # parabolic refinement
    if 1 <= lag < len(ac) - 1:
        a, b, c = ac[lag - 1], ac[lag], ac[lag + 1]
        d = (a - c) / (2 * (a - 2 * b + c) + 1e-9)
        lag = lag + max(-1, min(1, d))
    f = SR / lag
    return round(69 + 12 * np.log2(f / 440), 1)


def main():
    nid = sys.argv[1]
    src = f'public/nigun/{nid}.mp3'
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.int16).astype(np.float64) / 32768
    hop = int(SR * HOP)
    out = []
    for i in range(0, len(a) - WIN, hop):
        out.append(pitch(a[i:i + WIN]))
    # a lone voiced frame between pauses is noise
    for i in range(1, len(out) - 1):
        if out[i] and not out[i - 1] and not out[i + 1]:
            out[i] = 0.0
    # a median of 5 frames: single jumps to a harmonic (an octave or a fifth up) are not the melody
    sm = []
    for i in range(len(out)):
        win = [x for x in out[max(0, i - 2):i + 3] if x]
        sm.append(float(np.median(win)) if out[i] and len(win) >= 3 else (out[i] if out[i] and len(win) < 3 else 0.0))
    out = [round(x, 1) for x in sm]
    voiced = sum(1 for x in out if x)
    with open(f'public/nigun/{nid}.pitch.json', 'w') as f:
        json.dump({'hop': HOP, 'p': out}, f, separators=(',', ':'))
    print(f'{nid}: {len(out)} frames, {voiced} with a pitch ({round(100 * voiced / len(out))}%)')


if __name__ == '__main__':
    main()
