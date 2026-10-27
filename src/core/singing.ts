import { PitchDetector } from 'pitchy';

/**
 * «Петь в микрофон» (Karaoke.tsx): the singer's voice is compared with the recording — note by note, octave aside
 * (a child or a woman sings an octave up). The only place the site asks for the microphone, and only after a tap on
 * «Петь в микрофон»; the sound is analysed right here on the device — nothing is sent, and the microphone is turned off
 * when the singing stops. Recorded only if the singer ticks «Записать моё пение» (`record`): the voice with the niggun
 * under it, kept in memory to listen to, download or share (the phone's «Отправить…») — never uploaded, gone with the page.
 *
 * The reference: the pitch of the recording every 50 ms (`public/nigun/<id>.pitch.json`, scripts/nigun-pitch.py).
 * Lenient on purpose — a phone microphone, an untrained voice: a line scores by the share of the recording's notes
 * the singer meets within TOLERANCE, the singer a little early (EARLY) or late (LATE — the phone's speaker or Bluetooth headphones and the microphone add their own delay, and a line lasts only 2–5 s), of the moments
 * the microphone heard a note (not less than HEARD of the line — a breath or a lost frame is no loss).
 * SING_FLOOR of them — still nothing (a monotone hum meets that much by chance), SING_PASS — the full 10 points.
 * Calibrated on the recording's own melody (scripts/check-nigun.ts): exact, 0.8 s late, the microphone hearing a quarter
 * of the frames, a semitone off — 98–100 % and no line without a star; one note held through the song — under 35 %,
 * random notes — under 25 %. (Before 26.10.2026 — 0.4 s either way and HEARD 0.4: «half the lines without a star».)
 */
export interface PitchTrack {
  hop: number;
  /** MIDI note per frame, 0 — no pitch */
  p: number[];
}

/** in tune: within a semitone and a half of the recording, in any octave */
export const TOLERANCE = 1.5;
/** the singer may be this many seconds early … late */
export const EARLY = 0.3;
export const LATE = 0.9;
/** the share of a line's notes met: below SING_FLOOR — 0, from SING_PASS — the full points, linear between */
export const SING_FLOOR = 0.35;
export const SING_PASS = 0.6;
/**
 * The encouragement (the owner, 26.10.2026: «add up to 50 % while playing — the user must be pleased, we'll make it exact
 * later»): a line's points × SING_BONUS, capped at SING_POINTS. A line with nothing in tune stays 0, so a hum doesn't earn.
 */
export const SING_BONUS = 1.5;
/** the moments the microphone heard a note count at least as this share of the line */
export const HEARD = 0.25;
export const SING_POINTS = 10;
/** the microphone: quieter than this (RMS) is silence — lower than for the recording, a voice at a phone is soft */
export const MIC_QUIET = 0.004;

/** The distance in semitones between two notes, octave aside: 0 … 6. */
export const pitchDistance = (a: number, b: number) => {
  const d = Math.abs(a - b) % 12;
  return Math.min(d, 12 - d);
};

/** pitchy's clarity (0–1) of a real note; below it the frame is noise, a breath or a consonant */
export const CLARITY = 0.8;

/**
 * The pitch of a frame of the microphone as a MIDI note (70–1000 Hz), or 0 — silence (below MIC_QUIET) or no clear note.
 * The detector is pitchy (the McLeod Pitch Method, 0BSD — github.com/ianprime0509/pitchy): a tuner's algorithm, steadier
 * on a soft voice than the plain autocorrelation the site had before (26.10.2026).
 */
export function micPitch(detector: PitchDetector<Float32Array>, buf: Float32Array, sampleRate: number): number {
  let energy = 0;
  for (let i = 0; i < buf.length; i++) energy += buf[i] * buf[i];
  if (Math.sqrt(energy / buf.length) < MIC_QUIET) return 0;
  const [hz, clarity] = detector.findPitch(buf, sampleRate);
  if (clarity < CLARITY || hz < 70 || hz > 1000) return 0;
  return 69 + 12 * Math.log2(hz / 440);
}

/** The recording's note at second `t`, or 0. */
export const refAt = (track: PitchTrack, t: number) => track.p[Math.round(t / track.hop)] ?? 0;

/** The singer's notes by the recording's frames (0 — nothing heard), for the whole song. */
export const newVoice = (track: PitchTrack) => new Float32Array(track.p.length);

/** Is the singer's note `me` in tune with the recording around second `t` (LATE before … EARLY after)? For the live hint. */
export function inTuneAt(track: PitchTrack, t: number, me: number): boolean {
  if (!me) return false;
  const k = Math.round(t / track.hop);
  for (let i = Math.max(0, k - Math.round(LATE / track.hop)); i <= k + Math.round(EARLY / track.hop) && i < track.p.length; i++)
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
  let best = 0;
  // d > 0 — the singer late
  for (let d = -Math.round(EARLY / track.hop); d <= Math.round(LATE / track.hop); d++) {
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
  const raw = SING_POINTS * Math.max(0, Math.min(1, (best - SING_FLOOR) / (SING_PASS - SING_FLOOR)));
  // the encouragement: a line already sung in tune in part gets up to half more (never above the full points)
  return Math.round(Math.min(SING_POINTS, raw * SING_BONUS));
}

/** A line's stars on the strip above the lines: 0–3 (no numbers while singing). */
export const lineStars = (points: number) => (points >= SING_POINTS ? 3 : points >= 6 ? 2 : points >= 3 ? 1 : 0);

/** the recording of the singing: what the browser can make — mp4 (Safari, Chrome), else webm / ogg */
const REC_TYPES = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus'];
/** the niggun under the voice in the recording — quieter than the voice */
const MUSIC_GAIN = 0.45;

export interface Mic {
  read: () => number;
  /** the niggun under the voice follows the player: from second `t`, at `rate`, or stopped */
  sync: (t: number, playing: boolean, rate: number) => void;
  /** turns everything off; the recording, if one was made */
  stop: () => Promise<Blob | null>;
}

/**
 * The microphone, on a tap: the stream and an analyser. With `record` — also a MediaRecorder of the voice and, if
 * `music` (the niggun's mp3) is given, the niggun mixed under it — only into the recording, not to the speakers.
 */
export async function openMic(opts: { record?: boolean; music?: ArrayBuffer } = {}): Promise<Mic> {
  // the singer's own voice: no echo of the recording through the speakers; no automatic volume — on some phones (Samsung)
  // it squeezes a singing voice down, and pitchy finds the note of a soft voice anyway (above MIC_QUIET)
  const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false } });
  const ctx = new AudioContext();
  await ctx.resume();
  const src = ctx.createMediaStreamSource(stream);
  const an = ctx.createAnalyser();
  an.fftSize = 2048;
  src.connect(an);
  const buf = new Float32Array(an.fftSize);
  const detector = PitchDetector.forFloat32Array(an.fftSize);

  let rec: MediaRecorder | null = null;
  const chunks: Blob[] = [];
  let music: AudioBuffer | null = null;
  let gain: GainNode | null = null;
  let playing: AudioBufferSourceNode | null = null;
  if (opts.record && typeof MediaRecorder !== 'undefined') {
    const out = ctx.createMediaStreamDestination();
    src.connect(out);
    if (opts.music) {
      try {
        music = await ctx.decodeAudioData(opts.music);
        gain = ctx.createGain();
        gain.gain.value = MUSIC_GAIN;
        gain.connect(out);
      } catch {
        music = null; // the voice alone
      }
    }
    const type = REC_TYPES.find((x) => MediaRecorder.isTypeSupported(x));
    try {
      rec = new MediaRecorder(out.stream, type ? { mimeType: type } : undefined);
      rec.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      rec.start(1000);
    } catch {
      rec = null;
    }
  }
  // the voice reaches the recording later than the player's sound reached the singer (the speaker's and the
  // microphone's delay) — the niggun under it is held back as much
  const lag = Math.min(0.4, (ctx.outputLatency || 0.05) + (ctx.baseLatency || 0) + 0.05);

  return {
    read: () => {
      an.getFloatTimeDomainData(buf);
      return micPitch(detector, buf, ctx.sampleRate);
    },
    sync: (t, on, rate) => {
      try {
        playing?.stop();
      } catch {
        /* not started */
      }
      playing = null;
      if (!on || !music || !gain || ctx.state === 'closed' || t >= music.duration) return;
      playing = ctx.createBufferSource();
      playing.buffer = music;
      playing.playbackRate.value = rate;
      playing.connect(gain);
      playing.start(ctx.currentTime + lag, Math.max(0, t));
    },
    stop: async () => {
      if (rec && rec.state !== 'inactive') {
        const r = rec;
        await new Promise<void>((done) => {
          r.onstop = () => done();
          r.stop();
        });
      }
      stream.getTracks().forEach((x) => x.stop());
      void ctx.close();
      return rec && chunks.length ? new Blob(chunks, { type: rec.mimeType || chunks[0].type }) : null;
    },
  };
}

/** The file of a recording to download or share: «niflaot-<id>.m4a» (or .webm / .ogg), the type without codecs. */
export function recordingFile(blob: Blob, id: string): File {
  const type = blob.type.split(';')[0] || 'audio/webm';
  const ext = type === 'audio/mp4' ? 'm4a' : type === 'audio/ogg' ? 'ogg' : 'webm';
  return new File([blob], `niflaot-${id}.${ext}`, { type });
}
