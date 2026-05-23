/** צליל טיסת חללית — MP3 למעבר רביע במטריצה 3D */

const WHOOSH_SRC = '/sounds/spaceship-whoosh.mp3';
const MASTER_VOLUME = 0.55;
const FADE_MS = 620;

class MatrixFlightSound {
  constructor() {
    /** @type {HTMLAudioElement | null} */
    this.audio = null;
    this.muted = false;
    this.ready = false;
    /** @type {number | null} */
    this.fadeTimer = null;
    this.loadPromise = null;
  }

  ensureAudio() {
    if (this.audio) return this.audio;
    this.audio = new Audio(WHOOSH_SRC);
    this.audio.preload = 'auto';
    this.audio.volume = MASTER_VOLUME;
    return this.audio;
  }

  load() {
    if (this.ready) return Promise.resolve(true);
    if (this.loadPromise) return this.loadPromise;

    const audio = this.ensureAudio();
    this.loadPromise = new Promise((resolve) => {
      const done = () => {
        this.ready = true;
        resolve(true);
      };
      const fail = () => {
        this.ready = false;
        resolve(false);
      };
      if (audio.readyState >= 3) {
        done();
        return;
      }
      audio.addEventListener('canplaythrough', done, { once: true });
      audio.addEventListener('error', fail, { once: true });
      audio.load();
    });
    return this.loadPromise;
  }

  async resume() {
    const ok = await this.load();
    return ok;
  }

  clearFade() {
    if (this.fadeTimer != null) {
      window.clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
  }

  /**
   * @param {{ exiting?: boolean }} opts
   */
  async start(opts = {}) {
    if (this.muted) return;
    const ok = await this.load();
    if (!ok || !this.audio) return;

    this.clearFade();
    this.stopImmediate();

    const exiting = !!opts.exiting;
    const audio = this.audio;
    audio.loop = true;
    audio.currentTime = 0;
    audio.volume = exiting ? MASTER_VOLUME * 0.75 : MASTER_VOLUME;
    audio.playbackRate = exiting ? 0.9 : 0.96;

    try {
      await audio.play();
    } catch {
      /* נחסם עד אינטראקציה */
    }
  }

  stopImmediate() {
    this.clearFade();
    if (!this.audio) return;
    this.audio.pause();
    this.audio.loop = false;
    this.audio.currentTime = 0;
    this.audio.volume = MASTER_VOLUME;
  }

  stop() {
    if (!this.audio || this.audio.paused) return;

    this.clearFade();
    const audio = this.audio;
    const startVol = audio.volume;
    const steps = 8;
    const stepMs = FADE_MS / steps;
    let step = 0;

    this.fadeTimer = window.setInterval(() => {
      step += 1;
      audio.volume = Math.max(0, startVol * (1 - step / steps));
      if (step >= steps) {
        this.stopImmediate();
      }
    }, stepMs);
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted) this.stopImmediate();
    else if (this.audio) this.audio.volume = MASTER_VOLUME;
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }
}

export const matrixFlightSound = new MatrixFlightSound();
