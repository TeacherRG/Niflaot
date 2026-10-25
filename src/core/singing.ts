/**
 * «Петь в микрофон» (Karaoke.tsx): the singer's voice is compared with the recording — note by note, octave aside
 * (a child or a woman sings an octave up). The only place the site asks for the microphone, and only after a tap on
 * «Петь в микрофон»; the sound is analysed right here on the device — nothing is recorded or sent, and the microphone
 * is turned off when the singing stops.
 *
 * The reference: the pitch of the recording every 50 ms (`public/nigun/<id>.pitch.json`, scripts/nigun-pitch.py,
 * the same detector). Lenient on purpose — a phone microphone, an untrained voice: a line scores by the share of the
 * recording's notes the singer meets within TOLERANCE, the singer a little late or early (the best shift up to LAG),
 * of the moments the microphone heard a note (not less than HEARD of the line — a breath or a lost frame is no loss).
 * SING_FLOOR of them — still nothing (a monotone hum meets that much by chance), SING_PASS — the full 10 points.
 * Calibrated on the recording's own notes: a singer half a second late, a semitone or two off, the microphone deaf
 * to half the frames — 99–100 %; one note held through the song — 44 %, random notes — 10 %.
 */
export interface PitchTrack {
  hop: number;
  /** MIDI note per frame, 0 — no pitch */
  p: number[];
}

/** in tune: within a semitone and a half of the recording, in any octave */
export const TOLERANCE = 1.5;
/** the singer may be this many seconds late or early */
export const LAG = 0.4;
/** the share of a line's notes met: below SING_FLOOR — 0, from SING_PASS — the full points, linear between */
export const SING_FLOOR = 0.3;
export const SING_PASS = 0.6;
/** the moments the microphone heard a note count at least as this share of the line */
export const HEARD = 0.4;
export const SING_POINTS = 10;

/** The distance in semitones between two notes, octave aside: 0 … 6. */
export const pitchDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 12;
  return Math.min(d, 12 - d);
};

/** The pitch of a frame of sound (autocorrelation; 70–1000 Hz) as a MIDI note, or 0 — silence or no clear note. */
export function detectPitch(buf: Float32Array, sampleRate: number): number {
  const n = buf.length;
  let mean = 0;
  for (let i = 0; i < n; i++) mean += buf[i];
  mean /= n;
  let energy = 0;
  for (let i = 0; i < n; i++) energy += (buf[i] - mean) ** 2;
  if (Math.sqrt(energy / n) < 0.01) return 0;
  const lo = Math.floor(sampleRate / 1000);
  const hi = Math.min(n - 1, Math.ceil(sampleRate / 70));
  const ac = new Float32Array(hi + 2);
  for (let lag = lo - 1; lag <= hi + 1; lag++) {
    let s = 0;
    for (let i = 0; i + lag < n; i++) s += (buf[i] - mean) * (buf[i + lag] - mean);
    ac[lag] = s / energy;
  }
  let k = lo;
  for (let lag = lo; lag <= hi; lag++) if (ac[lag] > ac[k]) k = lag;
  const best = ac[k];
  if (best < 0.45) return 0;
  // the first peak close to the best one — not an octave below it
  for (let lag = lo; lag <= hi; lag++)
    if (ac[lag] >= 0.9 * best && ac[lag] >= ac[lag - 1] && ac[lag] >= ac[lag + 1]) {
      k = lag;
      break;
    }
  const [a, b, c] = [ac[k - 1], ac[k], ac[k + 1]];
  const d = (a - c) / (2 * (a - 2 * b + c) || 1);
  const lag = k + Math.max(-1, Math.min(1, d));
  return 69 + 12 * Math.log2(sampleRate / lag / 440);
}

/** The recording's note at second `t`, or 0. */
export const refAt = (track: PitchTrack, t: number) => track.p[Math.round(t / track.hop)] ?? 0;

/** The singer's notes by the recording's frames (0 — nothing heard), for the whole song. */
export const newVoice = (track: PitchTrack) => new Float32Array(track.p.length);

/** Is the singer's note `me` in tune with the recording around second `t` (± LAG)? For the live hint. */
export function inTuneAt(track: PitchTrack, t: number, me: number): boolean {
  if (!me) return false;
  const k = Math.round(t / track.hop);
  const w = Math.round(LAG / track.hop);
  for (let i = Math.max(0, k - w); i <= k + w && i < track.p.length; i++)
    if (track.p[i] && pitchDistance(me, track.p[i]) <= TOLERANCE) return true;
  return false;
}

/** The points of the line from second `from` to `to`: 0 … SING_POINTS (see the top of the file). */
export function linePoints(track: PitchTrack, voice: Float32Array, from: number, to: number): number {
  const f0 = Math.round(from / track.hop);
  const f1 = Math.min(track.p.length, Math.round(to / track.hop));
  let notes = 0;
  for (let f = f0; f < f1; f++) if (track.p[f]) notes++;
  if (!notes) return 0;
  const w = Math.round(LAG / track.hop);
  let best = 0;
  for (let d = -w; d <= w; d++) {
    let met = 0;
    let heard = 0;
    for (let f = f0; f < f1; f++) {
      const me = voice[f + d];
      if (!track.p[f] || !me) continue;
      heard++;
      if (pitchDistance(me, track.p[f]) <= TOLERANCE) met++;
    }
    best = Math.max(best, met / Math.max(heard, HEARD * notes));
  }
  return Math.round(SING_POINTS * Math.max(0, Math.min(1, (best - SING_FLOOR) / (SING_PASS - SING_FLOOR))));
}

/** A line's stars on the strip above the lines: 0–3 (no numbers while singing). */
export const lineStars = (points: number) => (points >= SING_POINTS ? 3 : points >= 6 ? 2 : points >= 3 ? 1 : 0);

/** The microphone, on a tap: the stream and an analyser; `stop()` turns everything off. */
export async function openMic(): Promise<{ read: () => number; stop: () => void }> {
  // the singer's own voice: no echo of the recording through the speakers, no automatic volume
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false } });
  const ctx = new AudioContext();
  await ctx.resume();
  const src = ctx.createMediaStreamSource(stream);
  const an = ctx.createAnalyser();
  an.fftSize = 2048;
  src.connect(an);
  const buf = new Float32Array(an.fftSize);
  return {
    read: () => {
      an.getFloatTimeDomainData(buf);
      return detectPitch(buf, ctx.sampleRate);
    },
    stop: () => {
      stream.getTracks().forEach((t) => t.stop());
      void ctx.close();
    },
  };
}
