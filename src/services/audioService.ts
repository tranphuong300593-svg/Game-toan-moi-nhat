/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AudioSettings } from '../types';

export interface VoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
  isDefault: boolean;
  isNatural: boolean;
  genderHint?: 'female' | 'male' | 'neutral';
}

class SoundEffectsService {
  private ctx: AudioContext | null = null;
  private bgmInterval: any = null;
  private isBgmPlaying = false;
  private bgmGainNode: GainNode | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Cached voice lists
  private voicesLoaded = false;
  private enVoices: SpeechSynthesisVoice[] = [];
  private viVoices: SpeechSynthesisVoice[] = [];
  private voiceSubscribers: (() => void)[] = [];

  private settings: AudioSettings = {
    sfxEnabled: true,
    speechEnabled: true,
    bgmEnabled: false,
    volume: 0.8,
    speechRate: 0.88, // Natural gentle pace for Grade 1 children
    speechPitch: 1.05, // Cheerful child-friendly pitch
  };

  constructor() {
    // Load persisted audio settings if available
    try {
      const saved = localStorage.getItem('math_adventure_audio_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }

    // Set up Speech Synthesis voices handling
    this.initVoices();
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // --- VOICE INITIALIZATION & DISCOVERY ---
  private initVoices() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      // Filter English voices (strictly en-US first, then other en-*)
      this.enVoices = allVoices.filter((v) => v.lang.toLowerCase().startsWith('en'));
      // Sort en-US first, then natural/female voices
      this.enVoices.sort((a, b) => {
        const aIsUs = a.lang.toLowerCase() === 'en-us' ? 10 : 0;
        const bIsUs = b.lang.toLowerCase() === 'en-us' ? 10 : 0;
        const aNatural = /natural|online|google|samantha|victoria|jenny|aria|zira/i.test(a.name) ? 5 : 0;
        const bNatural = /natural|online|google|samantha|victoria|jenny|aria|zira/i.test(b.name) ? 5 : 0;
        return (bIsUs + bNatural) - (aIsUs + aNatural);
      });

      // Filter & prioritize Vietnamese voices (natural female voices first: HoaiMy, Google, Linh, Mai)
      this.viVoices = allVoices.filter((v) => v.lang.toLowerCase().startsWith('vi'));
      this.viVoices.sort((a, b) => {
        const aFemale = /hoaimy|linh|mai|google|female|nu/i.test(a.name) ? 10 : 0;
        const bFemale = /hoaimy|linh|mai|google|female|nu/i.test(b.name) ? 10 : 0;
        const aNatural = /natural|online|google/i.test(a.name) ? 5 : 0;
        const bNatural = /natural|online|google/i.test(b.name) ? 5 : 0;
        return (bFemale + bNatural) - (aFemale + bNatural);
      });

      this.voicesLoaded = true;
      this.notifyVoiceSubscribers();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public subscribeVoices(cb: () => void): () => void {
    this.voiceSubscribers.push(cb);
    if (this.voicesLoaded) cb();
    return () => {
      this.voiceSubscribers = this.voiceSubscribers.filter((s) => s !== cb);
    };
  }

  private notifyVoiceSubscribers() {
    this.voiceSubscribers.forEach((cb) => {
      try {
        cb();
      } catch {
        // ignore
      }
    });
  }

  public getAvailableEnglishVoices(): VoiceOption[] {
    return this.enVoices.map((v) => ({
      name: v.name,
      lang: v.lang,
      voiceURI: v.voiceURI,
      isDefault: v.default,
      isNatural: /natural|online|google|samantha|victoria|jenny|aria/i.test(v.name),
      genderHint: /female|samantha|victoria|jenny|aria|zira|karen/i.test(v.name)
        ? 'female'
        : /male|david|mark|guy/i.test(v.name)
        ? 'male'
        : 'neutral',
    }));
  }

  public getAvailableVietnameseVoices(): VoiceOption[] {
    return this.viVoices.map((v) => ({
      name: v.name,
      lang: v.lang,
      voiceURI: v.voiceURI,
      isDefault: v.default,
      isNatural: /natural|online|google/i.test(v.name),
    }));
  }

  public hasEnglishVoice(): boolean {
    return this.enVoices.length > 0;
  }

  public hasVietnameseVoice(): boolean {
    return this.viVoices.length > 0;
  }

  public getSettings(): AudioSettings {
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...partial };
    try {
      localStorage.setItem('math_adventure_audio_settings', JSON.stringify(this.settings));
    } catch {
      // ignore
    }

    if (this.settings.bgmEnabled && !this.isBgmPlaying) {
      this.startBGM();
    } else if (!this.settings.bgmEnabled && this.isBgmPlaying) {
      this.stopBGM();
    }
  }

  // --- SOUND EFFECTS (Web Audio API) ---

  // Ting-ting correct answer chime
  public playCorrect() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const masterVol = this.settings.volume * 0.35;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.07);

      gain.gain.setValueAtTime(0, this.ctx!.currentTime + idx * 0.07);
      gain.gain.linearRampToValueAtTime(masterVol, this.ctx!.currentTime + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + idx * 0.07 + 0.32);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(this.ctx!.currentTime + idx * 0.07);
      osc.stop(this.ctx!.currentTime + idx * 0.07 + 0.33);
    });
  }

  // Gentle encouraging tone for incorrect answer
  public playIncorrect() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    const vol = this.settings.volume * 0.22;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Jumping / hopping boing
  public playJump() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    const vol = this.settings.volume * 0.3;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(650, now + 0.16);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.21);
  }

  // Train whistle
  public playWhistle() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [587.33, 739.99]; // D5 and F#5
    const now = this.ctx.currentTime;
    const vol = this.settings.volume * 0.2;

    freqs.forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.05);
      gain.gain.setValueAtTime(vol, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    });
  }

  // Car engine acceleration
  public playEngine() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    const vol = this.settings.volume * 0.25;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.35);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.41);
  }

  // Water splash for fishing
  public playSplash() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(250, now + 0.15);

    gain.gain.setValueAtTime(this.settings.volume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.17);
  }

  // Magic chest opening chime
  public playMagicChime() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chord = [523, 659, 784, 987, 1046, 1318];
    const now = this.ctx.currentTime;

    chord.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.05);

      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(this.settings.volume * 0.22, now + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.36);
    });
  }

  // Victory fanfare
  public playVictory() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const fanfare = [
      { note: 523.25, time: 0, dur: 0.15 },    // C5
      { note: 659.25, time: 0.14, dur: 0.15 }, // E5
      { note: 783.99, time: 0.28, dur: 0.15 }, // G5
      { note: 1046.5, time: 0.44, dur: 0.45 }  // C6
    ];

    const now = this.ctx.currentTime;
    const vol = this.settings.volume * 0.35;

    fanfare.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f.note, now + f.time);

      gain.gain.setValueAtTime(0, now + f.time);
      gain.gain.linearRampToValueAtTime(vol, now + f.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + f.time + f.dur);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + f.time);
      osc.stop(now + f.time + f.dur + 0.02);
    });
  }

  // Short cheering and applause sound using filtered noise bursts
  public playApplause() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate soft clapping noise profile
      for (let i = 0; i < bufferSize; i++) {
        // burst claps
        const burst = Math.sin((i / bufferSize) * Math.PI * 18);
        data[i] = (Math.random() * 2 - 1) * Math.max(0, burst) * 0.6;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.settings.volume * 0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // ignore
    }
  }

  // Click tap
  public playClick() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(this.settings.volume * 0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Pop bubble effect
  public playPop() {
    if (!this.settings.sfxEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.06);

    gain.gain.setValueAtTime(this.settings.volume * 0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  // --- BACKGROUND GENTLE MUSIC LOOP WITH DUCKING ---
  private startBGM() {
    if (this.isBgmPlaying) return;
    this.initCtx();
    this.isBgmPlaying = true;

    // Upbeat gentle pentatonic pattern (C - D - E - G - A)
    const melody = [523.25, 587.33, 659.25, 783.99, 880, 783.99, 659.25, 587.33];
    let noteIdx = 0;

    this.bgmInterval = setInterval(() => {
      if (!this.settings.bgmEnabled || !this.ctx) return;
      const freq = melody[noteIdx % melody.length];
      noteIdx++;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        // Duck BGM if speech is currently active
        const duckFactor = this.currentUtterance ? 0.2 : 1.0;
        const vol = this.settings.volume * 0.035 * duckFactor;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.42);
      } catch {
        // ignore
      }
    }, 450);
  }

  private stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // --- ENGLISH & VIETNAMESE TTS ENGINE ---

  // Stop any current speech (used when navigating screens or clicking new audio)
  public cancelSpeech() {
    if (this.gameTimer) {
      clearTimeout(this.gameTimer);
      this.gameTimer = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Speak text: Strictly en-US English only when requested via English speaker button!
   * Entirely removes Vietnamese robot voice across all lessons, games, and UI.
   */
  public speak(
    text: string,
    lang: 'vi' | 'en' = 'en',
    options?: {
      slow?: boolean;
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
    }
  ) {
    // Prompt 5: "Không phát âm tiếng Việt. Tắt và loại bỏ giọng nói Robot trong toàn bộ bài học, bài tập và trò chơi."
    if (lang === 'vi') {
      if (options?.onEnd) options.onEnd();
      return;
    }

    if (!this.settings.speechEnabled) {
      if (options?.onEnd) options.onEnd();
      return;
    }
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      if (options?.onEnd) options.onEnd();
      return;
    }

    // Stop preceding speech to prevent overlapping voices
    this.cancelSpeech();

    try {
      // Preprocess text to ensure math symbols and abbreviations are read naturally in en-US
      let processedText = text
        .replace(/\+/g, ' plus ')
        .replace(/[−-]/g, ' minus ')
        .replace(/=/g, ' equals ')
        .replace(/>/g, ' is greater than ')
        .replace(/</g, ' is less than ')
        .replace(/\bcm\b/gi, ' centimeters ')
        .replace(/\bkg\b/gi, ' kilograms ')
        .replace(/\s+/g, ' ')
        .trim();

      const utter = new SpeechSynthesisUtterance(processedText);
      utter.lang = 'en-US';

      // Find best English voice (strictly en-US first)
      let pickedVoice: SpeechSynthesisVoice | undefined;

      if (this.settings.selectedEnVoiceURI) {
        pickedVoice = this.enVoices.find((v) => v.voiceURI === this.settings.selectedEnVoiceURI);
      }

      if (!pickedVoice) {
        pickedVoice = this.enVoices.find(
          (v) =>
            v.lang.toLowerCase() === 'en-us' &&
            /natural|online|google|samantha|victoria|jenny|aria|zira/i.test(v.name)
        );
      }

      if (!pickedVoice) {
        pickedVoice = this.enVoices.find((v) => v.lang.toLowerCase() === 'en-us');
      }

      if (!pickedVoice) {
        pickedVoice = this.enVoices.find((v) => v.lang.toLowerCase().startsWith('en'));
      }

      if (pickedVoice && pickedVoice.lang.toLowerCase().startsWith('en')) {
        utter.voice = pickedVoice;
      }

      const baseRate = options?.rate ?? this.settings.speechRate ?? 0.88;
      utter.rate = options?.slow ? 0.72 : baseRate;
      utter.pitch = options?.pitch ?? this.settings.speechPitch ?? 1.0;
      utter.volume = Math.min(1, this.settings.volume * 1.2);

      this.currentUtterance = utter;

      utter.onend = () => {
        this.currentUtterance = null;
        if (options?.onEnd) options.onEnd();
      };
      utter.onerror = () => {
        this.currentUtterance = null;
        if (options?.onEnd) options.onEnd();
      };

      window.speechSynthesis.speak(utter);
    } catch {
      this.currentUtterance = null;
      if (options?.onEnd) options.onEnd();
    }
  }

  // Sparkle / glitter chime effect
  public playSparkle() {
    this.playMagicChime();
  }

  // Convenience English speech helper (en-US)
  public speakEn(
    text: string,
    options?: {
      slow?: boolean;
      rate?: number;
      pitch?: number;
      onEnd?: () => void;
    }
  ) {
    this.speak(text, 'en', options);
  }

  // Vietnamese speech is completely disabled per prompt requirements
  public speakVi(_text: string, options?: { slow?: boolean; onEnd?: () => void }) {
    if (options && (options as any).onEnd) (options as any).onEnd();
  }

  // Slow pronunciation helper for children English phonics learning
  public speakSlow(text: string, _lang: 'vi' | 'en' = 'en') {
    this.speak(text, 'en', { slow: true });
  }

  /**
   * Spoken math expressions in English en-US only
   */
  public speakMathExpression(expr: string, _lang: 'vi' | 'en' = 'en') {
    const clean = expr.trim();
    let enSpeech = clean
      .replace(/\+/g, ' plus ')
      .replace(/−|-/g, ' minus ')
      .replace(/=/g, ' equals ')
      .replace(/>/g, ' is greater than ')
      .replace(/</g, ' is less than ')
      .replace(/\?/g, 'what')
      .replace(/\s+/g, ' ');

    this.speak(enSpeech, 'en');
  }

  // General audio without voice (used by standard lessons and reviews)
  public praiseCorrect(_langMode?: 'vi' | 'bilingual' | 'en', onComplete?: () => void) {
    this.playCorrect();
    setTimeout(() => {
      this.playApplause();
      if (onComplete) onComplete();
    }, 280);
  }

  // Gentle tone for wrong answer, NO voice (used by standard lessons and reviews)
  public encourageWrong(_langMode?: 'vi' | 'bilingual' | 'en') {
    this.playIncorrect();
  }

  // Victory fanfare, NO voice (used by standard lessons and reviews)
  public praiseVictory(_langMode?: 'vi' | 'bilingual' | 'en') {
    this.playVictory();
    setTimeout(() => {
      this.playApplause();
    }, 380);
  }

  // =========================================================================
  // KHO TRÒ CHƠI (GAME PARK) – ENGLISH VOICE FEEDBACK SYSTEM
  // =========================================================================
  private lastCorrectPhrase = '';
  private lastWrongPhrase = '';
  private lastVictoryPhrase = '';
  private gameTimer: any = null;

  private pickRandomNonRepeating(pool: readonly string[], last: string): string {
    const available = pool.filter((p) => p !== last);
    const chosenList = available.length > 0 ? available : pool;
    return chosenList[Math.floor(Math.random() * chosenList.length)];
  }

  /**
   * KHO TRÒ CHƠI: Correct answer event.
   * Plays chime sound and cheerful, kid-friendly en-US praise voice.
   */
  public playAndSpeakGameCorrect() {
    this.playCorrect();
    if (this.gameTimer) {
      clearTimeout(this.gameTimer);
      this.gameTimer = null;
    }
    this.cancelSpeech();

    const phrase = this.pickRandomNonRepeating(GAME_CORRECT_PHRASES, this.lastCorrectPhrase);
    this.lastCorrectPhrase = phrase;

    // Speak naturally in en-US with gentle, cheerful tone for Grade 1 children
    this.gameTimer = setTimeout(() => {
      this.speak(phrase, 'en', {
        rate: 0.94,
        pitch: 1.08,
      });
    }, 60);
  }

  /**
   * KHO TRÒ CHƠI: Wrong answer event.
   * Plays gentle error tone and encouraging, gentle en-US voice.
   */
  public playAndSpeakGameWrong() {
    this.playIncorrect();
    if (this.gameTimer) {
      clearTimeout(this.gameTimer);
      this.gameTimer = null;
    }
    this.cancelSpeech();

    const phrase = this.pickRandomNonRepeating(GAME_WRONG_PHRASES, this.lastWrongPhrase);
    this.lastWrongPhrase = phrase;

    this.gameTimer = setTimeout(() => {
      this.speak(phrase, 'en', {
        rate: 0.9,
        pitch: 1.02,
      });
    }, 60);
  }

  /**
   * KHO TRÒ CHƠI: Victory / Game Completion event.
   * Plays victory fanfare, applause, and enthusiastic completion en-US phrase.
   */
  public playAndSpeakGameCelebrate() {
    this.playVictory();
    if (this.gameTimer) {
      clearTimeout(this.gameTimer);
      this.gameTimer = null;
    }
    this.cancelSpeech();

    setTimeout(() => {
      this.playApplause();
    }, 380);

    const phrase = this.pickRandomNonRepeating(GAME_VICTORY_PHRASES, this.lastVictoryPhrase);
    this.lastVictoryPhrase = phrase;

    this.gameTimer = setTimeout(() => {
      this.speak(phrase, 'en', {
        rate: 0.92,
        pitch: 1.1,
      });
    }, 220);
  }

  /**
   * KHU ÔN TẬP TỔNG HỢP: Celebratory music upon submitting an exam.
   * Plays a lively, cute, bright celebratory tune with ting-ting chimes and gentle applause (~2.2 - 2.4s).
   * Upon completion, executes onMusicEnd to start the English praise voice cleanly without overlapping.
   */
  public playExamCelebration(onMusicEnd?: () => void) {
    if (!this.settings.sfxEnabled) {
      if (onMusicEnd) setTimeout(onMusicEnd, 300);
      return;
    }
    this.initCtx();
    if (!this.ctx) {
      if (onMusicEnd) setTimeout(onMusicEnd, 300);
      return;
    }

    this.cancelSpeech();

    const now = this.ctx.currentTime;
    const vol = this.settings.volume * 0.32;

    // Upbeat celebratory melody & glockenspiel chimes (~2.2s)
    const melody: { note: number; time: number; dur: number; type: OscillatorType }[] = [
      { note: 523.25, time: 0, dur: 0.16, type: 'triangle' },     // C5
      { note: 659.25, time: 0.14, dur: 0.16, type: 'triangle' },  // E5
      { note: 783.99, time: 0.28, dur: 0.18, type: 'triangle' },  // G5
      { note: 1046.50, time: 0.44, dur: 0.32, type: 'sine' },     // C6 (Ting-ting 1)
      { note: 1174.66, time: 0.72, dur: 0.16, type: 'triangle' }, // D6
      { note: 1318.51, time: 0.88, dur: 0.20, type: 'triangle' }, // E6
      { note: 1567.98, time: 1.08, dur: 0.28, type: 'sine' },     // G6 (Ting-ting 2)
      // Bright celebratory closing chord at 1.35s
      { note: 523.25, time: 1.35, dur: 0.85, type: 'triangle' },  // C5
      { note: 659.25, time: 1.35, dur: 0.85, type: 'triangle' },  // E5
      { note: 1046.50, time: 1.35, dur: 0.85, type: 'sine' },     // C6
      { note: 2093.00, time: 1.35, dur: 0.80, type: 'sine' },     // C7 (sparkling chime)
    ];

    melody.forEach((m) => {
      try {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = m.type;
        osc.frequency.setValueAtTime(m.note, now + m.time);

        gain.gain.setValueAtTime(0, now + m.time);
        gain.gain.linearRampToValueAtTime(vol * (m.type === 'sine' ? 0.75 : 1), now + m.time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + m.time + m.dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + m.time);
        osc.stop(now + m.time + m.dur + 0.02);
      } catch {
        // ignore
      }
    });

    // Soft clapping/applause noise burst layered starting at 0.5s and fading by 2.15s
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 1.6);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        const burst = Math.sin((i / bufferSize) * Math.PI * 14);
        data[i] = (Math.random() * 2 - 1) * Math.max(0, burst) * 0.45;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;
      filter.Q.value = 1.0;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0, now + 0.5);
      noiseGain.gain.linearRampToValueAtTime(this.settings.volume * 0.16, now + 0.7);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.15);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now + 0.5);
    } catch {
      // ignore
    }

    // Invoke callback after 2.3s so music finishes cleanly before speech starts
    if (onMusicEnd) {
      setTimeout(() => {
        onMusicEnd();
      }, 2350);
    }
  }
}

export interface ExamPraiseItem {
  en: string;
  vi: string;
}

// English voice feedback phrases for KHU ÔN TẬP TỔNG HỢP
export const EXAM_PRAISES_PERFECT: readonly ExamPraiseItem[] = [
  { en: 'Excellent! You got them all right!', vi: 'Xuất sắc! Con đã làm đúng tất cả các câu!' },
  { en: 'Amazing! Perfect score!', vi: 'Tuyệt vời! Điểm 10 hoàn hảo!' },
  { en: "Fantastic! You're a math star!", vi: 'Thật kỳ diệu! Con là một ngôi sao Toán học!' },
];

export const EXAM_PRAISES_GOOD: readonly ExamPraiseItem[] = [
  { en: 'Great job! Keep it up!', vi: 'Làm tốt lắm! Hãy tiếp tục phát huy nhé!' },
  { en: "Well done! You're doing great!", vi: 'Giỏi lắm! Con đang làm rất tốt!' },
  { en: 'Awesome work! Keep learning!', vi: 'Thật tuyệt vời! Chăm chỉ học tập nhé!' },
];

export const EXAM_PRAISES_ENCOURAGE: readonly ExamPraiseItem[] = [
  { en: 'Good effort! Keep trying!', vi: 'Rất cố gắng! Hãy tiếp tục thử sức nhé!' },
  { en: 'You did it! Keep practicing!', vi: 'Con đã làm được rồi! Chăm chỉ luyện tập thêm nhé!' },
  { en: 'Nice try! You can do it!', vi: 'Nỗ lực rất tốt! Con chắc chắn làm được!' },
  { en: "Keep going! You're learning every day!", vi: 'Cố lên nào! Mỗi ngày con đều tiến bộ hơn!' },
];

export function getExamPraise(score: number): ExamPraiseItem {
  if (score >= 10) {
    return EXAM_PRAISES_PERFECT[Math.floor(Math.random() * EXAM_PRAISES_PERFECT.length)];
  }
  if (score >= 7) {
    return EXAM_PRAISES_GOOD[Math.floor(Math.random() * EXAM_PRAISES_GOOD.length)];
  }
  return EXAM_PRAISES_ENCOURAGE[Math.floor(Math.random() * EXAM_PRAISES_ENCOURAGE.length)];
}

// English voice feedback phrases for KHO TRÒ CHƠI
export const GAME_CORRECT_PHRASES: readonly string[] = [
  'Correct!',
  'Great job!',
  'Well done!',
  'Excellent!',
  'Amazing!',
  'You got it!',
  'Fantastic!',
  'Good work!',
];

export const GAME_WRONG_PHRASES: readonly string[] = [
  'Try again!',
  'Not quite!',
  'Keep trying!',
  'Almost there!',
  'Give it another try!',
  'You can do it!',
];

export const GAME_VICTORY_PHRASES: readonly string[] = [
  'Congratulations!',
  'You did it!',
  'Wonderful job!',
  "You're a math star!",
];

export const soundService = new SoundEffectsService();

/**
 * Dedicated sound and English voice feedback engine for KHO TRÒ CHƠI
 */
export const soundEffects = {
  click: () => soundService.playClick(),
  correct: () => soundService.playAndSpeakGameCorrect(),
  wrong: () => soundService.playAndSpeakGameWrong(),
  celebrate: () => soundService.playAndSpeakGameCelebrate(),
};

