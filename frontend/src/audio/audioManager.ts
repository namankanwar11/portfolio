"use client";

import { Howl, Howler } from "howler";

class AudioManager {
  private inited = false;
  private isMuted = false;

  public sounds: Record<string, Howl> = {};

  private lastScrollPlay = 0;

  public init() {
    if (typeof window === "undefined" || this.inited) return;

    const savedMute = localStorage.getItem("ai_portfolio_muted");
    this.isMuted = savedMute === "true";
    Howler.mute(this.isMuted);

    this.sounds = {
      ambient: new Howl({
        src: ["/sounds/ambient.wav"],
        loop: true,
        volume: 0.1,
        html5: true,
      }),
      scroll: new Howl({
        src: ["/sounds/scroll.wav"],
        volume: 0.05,
      }),
      hover: new Howl({
        src: ["/sounds/hover.wav"],
        volume: 0.15,
      }),
      click: new Howl({
        src: ["/sounds/click.wav"],
        volume: 0.2,
      }),
      unlock: new Howl({
        src: ["/sounds/unlock.wav"],
        volume: 0.3,
      }),
      transition: new Howl({
        src: ["/sounds/transition.wav"],
        volume: 0.2,
      }),
    };

    this.inited = true;

    const startAudioContext = () => {
      if (this.sounds.ambient && !this.sounds.ambient.playing()) {
        this.sounds.ambient.play();
      }
      window.removeEventListener("click", startAudioContext);
      window.removeEventListener("keydown", startAudioContext);
      window.removeEventListener("touchstart", startAudioContext);
    };

    window.addEventListener("click", startAudioContext);
    window.addEventListener("keydown", startAudioContext);
    window.addEventListener("touchstart", startAudioContext);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.sounds.ambient?.pause();
      } else {
        if (!this.isMuted && this.inited) {
          this.sounds.ambient?.play();
        }
      }
    });
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    localStorage.setItem("ai_portfolio_muted", String(this.isMuted));
    return this.isMuted;
  }

  public getMuted() {
    return this.isMuted;
  }

  public play(name: keyof typeof this.sounds) {
    if (!this.inited || this.isMuted || !this.sounds[name]) return;
    this.sounds[name].play();
  }

  public playScroll(velocity: number) {
    if (!this.inited || this.isMuted || !this.sounds.scroll) return;

    const now = performance.now();

    if (now - this.lastScrollPlay > 100) {
      const vol = Math.min(0.2, Math.abs(velocity) * 0.005);
      if (vol > 0.01) {
        this.sounds.scroll.volume(vol);
        this.sounds.scroll.play();
        this.lastScrollPlay = now;
      }
    }
  }
}

export const audioManager = new AudioManager();
