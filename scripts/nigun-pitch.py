#!/usr/bin/env python3
"""
«Петь в микрофон» (src/core/singing.ts): the pitch of the recording of a niggun, worked out once — every 50 ms the
pitch of the voice in the recording (MIDI note, one decimal; 0 — no clear pitch: a pause, a breath, noise).
The site compares the singer's voice with it, octave aside.

  python3 scripts/nigun-pitch.py lubo-bratzi                → public/nigun/lubo-bratzi.pitch.json (the whole mix)
  python3 scripts/nigun-pitch.py lubo-bratzi --vocals [--keep v.flac]  → the voice separated first (Demucs), its notes by pYIN
  python3 scripts/nigun-pitch.py lubo-bratzi --stem v.flac             → the notes of a voice already separated (pYIN)

The whole mix: ffmpeg and numpy, autocorrelation — where a choir or an accordion is louder, the reference is not the
melody a singer sings. Tried 26.10.2026: Spotify Basic Pitch on the mix is no better (repeats of the same line agree
51–59 %, this — 61 %). So, as UltraSinger does: the voice is separated by Demucs (htdemucs, `--two-stems=vocals`) and its
notes found by pYIN (librosa) — `.github/workflows/nigun-pitch.yml` runs it (the cloud container can't download the
model's weights) and pushes the notes and the separated voice (nigun-stems/, to tune pYIN without Demucs) to a branch,
with scripts/nigun-repeats.ts's report. Needs then: torch, demucs, librosa, soundfile; no ffmpeg.
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


def mix_notes(src: str) -> list[float]:
    """The whole recording: autocorrelation every 50 ms."""
    raw = subprocess.run(['ffmpeg', '-v', 'quiet', '-i', src, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.int16).astype(np.float64) / 32768
    hop = int(SR * HOP)
    return [pitch(a[i:i + WIN]) for i in range(0, len(a) - WIN, hop)]


# pYIN on the separated voice: a note where the voice is likely (PROB) and not near-silent (QUIET of the loud frames).
# A strict pYIN (its own «voiced» and 0.5) kept a note in only 17–29 % of the recordings (run 26.10.2026) — too few.
PROB = 0.15
QUIET = 0.03


def load(path: str, sr: int, mono: bool = True):
    """Any audio file (mp3 too — libsndfile ≥ 1.1), resampled; no ffmpeg needed."""
    import librosa
    y, _ = librosa.load(path, sr=sr, mono=mono)
    return y


def voice_notes(wav: str) -> list[float]:
    """A voice alone (no instruments): pYIN."""
    import librosa
    y = load(wav, SR)
    hop = int(SR * HOP)
    f0, _, prob = librosa.pyin(y, fmin=LO, fmax=HI, sr=SR, frame_length=WIN, hop_length=hop)
    # the separated voice keeps a little of the instruments: a near-silent frame is not the singer
    rms = librosa.feature.rms(y=y, frame_length=WIN, hop_length=hop)[0]
    quiet = QUIET * float(np.percentile(rms, 95))
    return [round(float(69 + 12 * np.log2(f / 440)), 1) if p >= PROB and r >= quiet and f == f else 0.0
            for f, p, r in zip(f0, prob, rms)]


def separate(src: str, keep: str | None = None) -> str:
    """Demucs (htdemucs): the voice of the recording, apart from the instruments. `keep` — save it (FLAC, 16 kHz mono)."""
    import tempfile
    import soundfile
    out = tempfile.mkdtemp()
    # Demucs reads a WAV by itself (an MP3 would need ffmpeg)
    wav = f'{out}/mix.wav'
    soundfile.write(wav, load(src, 44100, mono=False).T, 44100)
    subprocess.run([sys.executable, '-m', 'demucs', '--two-stems=vocals', '-n', 'htdemucs', '-o', out, wav], check=True)
    vocals = f'{out}/htdemucs/mix/vocals.wav'
    if keep:
        soundfile.write(keep, load(vocals, SR), SR, format='FLAC')
    return vocals


def main():
    nid = sys.argv[1]
    args = sys.argv[2:]
    src = f'public/nigun/{nid}.mp3'
    if '--stem' in args:
        out = voice_notes(args[args.index('--stem') + 1])
    elif '--vocals' in args:
        keep = args[args.index('--keep') + 1] if '--keep' in args else None
        out = voice_notes(separate(src, keep))
    else:
        out = mix_notes(src)
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
