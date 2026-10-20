/**
 * «Петь в микрофон» (Karaoke.tsx): the singer's voice is compared with the recording — note by note, octave aside
 * (a child or a woman sings an octave up). The only place the site asks for the microphone, and only after a tap on
 * «Петь в микрофон»; the sound is analysed right here on the device — nothing is recorded or sent, and the microphone
 * is turned off when the singing stops.
 *
 * The reference: the pitch of the recording every 50 ms (`public/nigun/<id>.pitch.json`, scripts/nigun-pitch.py,
 * the same detector). A line scores by the share of its sung moments where the singer is within a semitone of the
 * recording: SING_PASS of them — the full 10 points.
 */
export interface PitchTrack {
  hop: number;
  /** MIDI note per frame, 0 — no pitch */
  p: number[];
}

/** in tune: within a semitone of the recording, in any octave */
export const TOLERANCE = 1;
/** the share of a line's sung moments in tune for the full points */
export const SING_PASS = 0.6;
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

/** A line's points from its tally: moments the recording sings, and of them those the singer sang in tune. */
export const linePoints = (sung: number, inTune: number) => (sung ? Math.round(SING_POINTS * Math.min(1, inTune / sung / SING_PASS)) : 0);

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
