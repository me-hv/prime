/**
 * Web Audio API Metronome Engine
 * Uses precision lookahead scheduling via audioContext.currentTime
 * to eliminate timing drift even when the browser tab is backgrounded.
 */

export type Subdivision = "quarter" | "eighth" | "sixteenth" | "triplet";

export class MetronomeEngine {
  private audioContext: AudioContext | null = null;
  private isRunning: boolean = false;
  private bpm: number = 90;
  private beatsPerBar: number = 4;
  private subdivision: Subdivision = "quarter";
  private volume: number = 0.8;
  private isMuted: boolean = false;

  private currentBeat: number = 0; // 0 to (beatsPerBar - 1)
  private currentSubdivisionIndex: number = 0;
  private nextNoteTime: number = 0.0;
  private timerId: number | null = null;

  // Lookahead settings
  private lookaheadMs: number = 25.0; // How frequently to call scheduling (ms)
  private scheduleAheadTime: number = 0.1; // How far ahead to schedule audio (sec)

  // Callbacks
  private onBeatCallback: ((beatIndex: number, isAccent: boolean, subIndex: number) => void) | null = null;

  constructor(initialBpm: number = 90, initialBeatsPerBar: number = 4) {
    this.bpm = Math.max(40, Math.min(240, initialBpm));
    this.beatsPerBar = initialBeatsPerBar;
  }

  private initAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  public setOnBeat(callback: (beatIndex: number, isAccent: boolean, subIndex: number) => void) {
    this.onBeatCallback = callback;
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(40, Math.min(240, newBpm));
  }

  public getBpm(): number {
    return this.bpm;
  }

  public setBeatsPerBar(beats: number) {
    this.beatsPerBar = Math.max(1, Math.min(12, beats));
    if (this.currentBeat >= this.beatsPerBar) {
      this.currentBeat = 0;
    }
  }

  public getBeatsPerBar(): number {
    return this.beatsPerBar;
  }

  public setSubdivision(sub: Subdivision) {
    this.subdivision = sub;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public start() {
    if (this.isRunning) return;
    this.initAudioContext();
    if (!this.audioContext) return;

    this.isRunning = true;
    this.currentBeat = 0;
    this.currentSubdivisionIndex = 0;
    this.nextNoteTime = this.audioContext.currentTime + 0.05;

    this.scheduler();
  }

  public stop() {
    this.isRunning = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.currentBeat = 0;
    this.currentSubdivisionIndex = 0;
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  private getSubdivisionMultiplier(): number {
    switch (this.subdivision) {
      case "eighth":
        return 2;
      case "sixteenth":
        return 4;
      case "triplet":
        return 3;
      case "quarter":
      default:
        return 1;
    }
  }

  private nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    const subMultiplier = this.getSubdivisionMultiplier();
    const secondsPerSub = secondsPerBeat / subMultiplier;

    this.nextNoteTime += secondsPerSub;

    this.currentSubdivisionIndex++;
    if (this.currentSubdivisionIndex >= subMultiplier) {
      this.currentSubdivisionIndex = 0;
      this.currentBeat = (this.currentBeat + 1) % this.beatsPerBar;
    }
  }

  private scheduleNote(time: number, beatIndex: number, subIndex: number) {
    const isMainBeat = subIndex === 0;
    const isAccent = isMainBeat && beatIndex === 0;

    // Trigger visual callback synced to audio time
    if (this.onBeatCallback && this.audioContext) {
      const delayMs = Math.max(0, (time - this.audioContext.currentTime) * 1000);
      setTimeout(() => {
        if (this.isRunning && this.onBeatCallback) {
          this.onBeatCallback(beatIndex, isAccent, subIndex);
        }
      }, delayMs);
    }

    if (this.isMuted || !this.audioContext) return;

    // Create synthesized percussion click
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    // Frequencies: Accent 1000Hz (Sine), Regular main beat 750Hz, Subdivision 500Hz
    if (isAccent) {
      osc.frequency.setValueAtTime(1050, time);
      gain.gain.setValueAtTime(this.volume, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
      osc.start(time);
      osc.stop(time + 0.06);
    } else if (isMainBeat) {
      osc.frequency.setValueAtTime(750, time);
      gain.gain.setValueAtTime(this.volume * 0.75, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);
      osc.start(time);
      osc.stop(time + 0.045);
    } else {
      // Subdivision click
      osc.frequency.setValueAtTime(520, time);
      gain.gain.setValueAtTime(this.volume * 0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
      osc.start(time);
      osc.stop(time + 0.025);
    }
  }

  private scheduler = () => {
    if (!this.isRunning || !this.audioContext) return;

    while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.nextNoteTime, this.currentBeat, this.currentSubdivisionIndex);
      this.nextNote();
    }

    this.timerId = window.setTimeout(this.scheduler, this.lookaheadMs);
  };

  public destroy() {
    this.stop();
    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
    this.audioContext = null;
  }
}
