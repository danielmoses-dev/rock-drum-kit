// Web Audio API Synthesis Engine for Drums, Melodic Synth, and Real-Time FFT Analysis

class DrumAudioEngine {
  private ctx: AudioContext | null = null;
  public masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMasterVolume(val: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  // 1. Kick Drum (Deep punchy pitch envelope + transient attack)
  public playKick(accent = 1.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Pitch sweep: 160Hz -> 42Hz
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.12);

    // Amplitude envelope
    gain.gain.setValueAtTime(1.2 * accent, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    // Attack click
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = "triangle";
    clickOsc.frequency.setValueAtTime(400, t);
    clickGain.gain.setValueAtTime(0.6 * accent, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain);
    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);

    osc.start(t);
    clickOsc.start(t);
    osc.stop(t + 0.5);
    clickOsc.stop(t + 0.03);
  }

  // 2. Snare Drum (Dual resonant tones + white noise wire rattle)
  public playSnare(accent = 1.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Body tone
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(195, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.1);
    oscGain.gain.setValueAtTime(0.8 * accent, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    // Snare wires (High-passed noise buffer)
    const bufferSize = this.ctx.sampleRate * 0.3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(900, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(1.1 * accent, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.start(t);
    noise.start(t);
    osc.stop(t + 0.22);
    noise.stop(t + 0.32);
  }

  // 3. Hi-Hat (Metallic multi-oscillator burst)
  public playHiHat(open = false, accent = 1.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const decay = open ? 0.45 : 0.08;

    const bufferSize = this.ctx.sampleRate * decay;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(8500, t);
    bandpass.Q.setValueAtTime(2.5, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.9 * accent, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + decay);

    noise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + decay + 0.02);
  }

  // 4. Toms (Tuned resonant decay)
  public playTom(freq = 120, accent = 1.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(freq * 1.3, t);
    osc.frequency.exponentialRampToValueAtTime(freq, t + 0.15);

    gain.gain.setValueAtTime(1.1 * accent, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.5);
  }

  // 5. Crash & Ride Cymbals
  public playCrash(accent = 1.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.8;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.setValueAtTime(4500, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(1.2 * accent, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

    noise.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.masterGain);

    noise.start(t);
    noise.stop(t + 1.9);
  }

  public playRide(isBell = false, accent = 1.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const f = isBell ? 1250 : 820;

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(f, t);
    oscGain.gain.setValueAtTime(0.8 * accent, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
    osc.connect(oscGain);
    oscGain.connect(this.masterGain);

    const bufferSize = this.ctx.sampleRate * 0.4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(6000, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3 * accent, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.start(t);
    noise.start(t);
    osc.stop(t + 0.85);
    noise.stop(t + 0.4);
  }

  // 6. Hand Clap
  public playClap(accent = 1.0) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const burstCount = 3;
    for (let i = 0; i < burstCount; i++) {
      const offset = i * 0.012;
      const bufferSize = this.ctx.sampleRate * 0.15;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        output[j] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, t + offset);
      filter.Q.setValueAtTime(2, t + offset);

      const gain = this.ctx.createGain();
      const vol = (i === burstCount - 1 ? 1.0 : 0.4) * accent;
      gain.gain.setValueAtTime(vol, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + (i === burstCount - 1 ? 0.18 : 0.02));

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(t + offset);
      noise.stop(t + offset + 0.2);
    }
  }

  // 7. Melodic Synthesizer Notes
  private noteFreqMap: Record<string, number> = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    G4: 392.0,
    A4: 440.0,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
  };

  public playSynthNote(note: string, waveType: "saw" | "square" | "sine" | "pluck" = "saw") {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const freq = this.noteFreqMap[note] || 440;
    const t = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = waveType === "saw" ? "sawtooth" : waveType === "square" ? "square" : waveType === "sine" ? "sine" : "sawtooth";
    osc.frequency.setValueAtTime(freq, t);

    // Filter envelope
    filter.type = "lowpass";
    const filterCutoff = waveType === "pluck" ? 4000 : 2500;
    filter.frequency.setValueAtTime(filterCutoff, t);
    filter.frequency.exponentialRampToValueAtTime(300, t + (waveType === "pluck" ? 0.35 : 0.6));

    const duration = waveType === "pluck" ? 0.4 : 0.7;
    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  public getByteFrequencyData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }
}

export const soundEngine = new DrumAudioEngine();
