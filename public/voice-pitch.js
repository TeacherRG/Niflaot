// Сдвиг высоты голоса без смены темпа: две головки чтения по линии задержки,
// окна Ханна со сдвигом в полпериода (сумма весов всегда 1). Для «Святого чтения» (src/core/voicePitch.ts).
const WIN = 0.06; // окно, с: длиннее — меньше дрожания, больше эха
class VoicePitch extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [{ name: 'ratio', defaultValue: 1, minValue: 0.5, maxValue: 2, automationRate: 'k-rate' }];
  }
  constructor() {
    super();
    this.win = Math.round(WIN * sampleRate);
    this.size = 1 << Math.ceil(Math.log2(this.win * 2 + 4));
    this.buf = [new Float32Array(this.size), new Float32Array(this.size)];
    this.w = 0;
    this.phase = 0;
  }
  read(b, delay) {
    const pos = this.w - delay;
    const i = Math.floor(pos);
    const f = pos - i;
    const m = this.size - 1;
    return b[i & m] * (1 - f) + b[(i + 1) & m] * f;
  }
  process(inputs, outputs, params) {
    const input = inputs[0];
    const output = outputs[0];
    const ratio = params.ratio[0];
    const n = output[0].length;
    const ch = Math.min(output.length, 2);
    const step = (1 - ratio) / this.win;
    for (let s = 0; s < n; s++) {
      this.phase = (this.phase + step + 1) % 1;
      const p2 = (this.phase + 0.5) % 1;
      const g1 = Math.sin(Math.PI * this.phase) ** 2;
      const g2 = 1 - g1;
      const d1 = 1 + this.phase * this.win;
      const d2 = 1 + p2 * this.win;
      for (let c = 0; c < ch; c++) {
        const src = input[c] ?? input[0];
        const x = src ? src[s] : 0;
        const b = this.buf[c];
        b[this.w & (this.size - 1)] = x;
        output[c][s] = ratio === 1 ? x : g1 * this.read(b, d1) + g2 * this.read(b, d2);
      }
      this.w++;
    }
    return true;
  }
}
registerProcessor('voice-pitch', VoicePitch);
