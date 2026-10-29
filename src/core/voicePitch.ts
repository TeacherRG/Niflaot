// На быстрой скорости браузер сохраняет высоту голоса, но тембр становится тоньше —
// поэтому голос чуть опускается (`public/voice-pitch.js`): с 1.5× на полутон и больше, на 3.5× — на 3,5 полутона.
// Элемент подключается к Web Audio только на быстрой скорости; не вышло — звучит как есть.

const FROM = 1.25;
const MAX_SEMITONES = 3.5;

/** На сколько полутонов опустить голос на этой скорости (0 — не трогать). */
export function lowerSemitones(rate: number): number {
  if (rate <= FROM) return 0;
  return -Math.min(MAX_SEMITONES, Math.round((rate - FROM) * 1.6 * 10) / 10);
}

let ctx: AudioContext | null = null;
let loading: Promise<boolean> | null = null;
const nodes = new WeakMap<HTMLMediaElement, AudioWorkletNode>();

function ready(): Promise<boolean> {
  if (loading) return loading;
  loading = (async () => {
    try {
      ctx = new AudioContext();
      await ctx.audioWorklet.addModule(`${import.meta.env.BASE_URL}voice-pitch.js`);
      return true;
    } catch {
      return false;
    }
  })();
  return loading;
}

/** Вызывать по нажатию «▶» — иначе браузер не даст звуку идти через Web Audio. */
export function resumeVoice(): void {
  if (ctx && ctx.state === 'suspended') void ctx.resume();
}

/** Поставить высоту голоса под скорость. */
export async function setVoicePitch(el: HTMLMediaElement | null, rate: number): Promise<void> {
  if (!el) return;
  const semis = lowerSemitones(rate);
  let node = nodes.get(el);
  if (!node) {
    if (!semis || typeof AudioWorkletNode === 'undefined') return;
    if (!(await ready()) || !ctx) return;
    if (nodes.has(el)) node = nodes.get(el);
    else {
      try {
        node = new AudioWorkletNode(ctx, 'voice-pitch', { outputChannelCount: [2] });
        ctx.createMediaElementSource(el).connect(node).connect(ctx.destination);
        nodes.set(el, node);
      } catch {
        return;
      }
    }
    resumeVoice();
  }
  node?.parameters.get('ratio')?.setValueAtTime(2 ** (semis / 12), ctx!.currentTime);
}
