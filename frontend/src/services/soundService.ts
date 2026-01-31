/**
 * Sound Effects Service
 * 
 * Provides audio feedback for user actions.
 * Sounds are disabled by default and respect user preferences.
 */

type SoundType = 'success' | 'error' | 'notification' | 'click' | 'complete';

interface SoundConfig {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
}

const SOUND_CONFIGS: Record<SoundType, SoundConfig[]> = {
  success: [
    { frequency: 523.25, duration: 0.1, type: 'sine', volume: 0.3 },  // C5
    { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.3 },  // E5
    { frequency: 783.99, duration: 0.15, type: 'sine', volume: 0.3 }, // G5
  ],
  error: [
    { frequency: 200, duration: 0.15, type: 'square', volume: 0.2 },
    { frequency: 150, duration: 0.2, type: 'square', volume: 0.2 },
  ],
  notification: [
    { frequency: 880, duration: 0.08, type: 'sine', volume: 0.2 },
    { frequency: 1046.5, duration: 0.12, type: 'sine', volume: 0.2 },
  ],
  click: [
    { frequency: 1000, duration: 0.03, type: 'sine', volume: 0.15 },
  ],
  complete: [
    { frequency: 392, duration: 0.1, type: 'sine', volume: 0.25 },   // G4
    { frequency: 523.25, duration: 0.1, type: 'sine', volume: 0.25 }, // C5
    { frequency: 659.25, duration: 0.1, type: 'sine', volume: 0.25 }, // E5
    { frequency: 783.99, duration: 0.2, type: 'sine', volume: 0.25 }, // G5
  ],
};

const STORAGE_KEY = 'stacksusu-sound-enabled';

class SoundService {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = false;
  private initialized: boolean = false;

  constructor() {
    // Load preference from storage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      this.enabled = stored === 'true';
    }
  }

  /**
   * Initialize the audio context (must be called after user interaction)
   */
  private initialize(): void {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.initialized = true;
    } catch (err) {
      console.warn('Web Audio API not supported:', err);
    }
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Enable or disable sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem(STORAGE_KEY, String(enabled));
  }

  /**
   * Toggle sound on/off
   */
  toggle(): boolean {
    this.setEnabled(!this.enabled);
    if (this.enabled) {
      this.play('click');
    }
    return this.enabled;
  }

  /**
   * Play a sound effect
   */
  play(type: SoundType): void {
    if (!this.enabled) return;
    
    // Initialize on first play (requires user interaction)
    if (!this.initialized) {
      this.initialize();
    }

    if (!this.audioContext) return;

    const configs = SOUND_CONFIGS[type];
    let startTime = this.audioContext.currentTime;

    configs.forEach((config) => {
      this.playTone(config, startTime);
      startTime += config.duration;
    });
  }

  /**
   * Play a single tone
   */
  private playTone(config: SoundConfig, startTime: number): void {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, startTime);

    gainNode.gain.setValueAtTime(config.volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + config.duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + config.duration);
  }

  /**
   * Play success sound
   */
  success(): void {
    this.play('success');
  }

  /**
   * Play error sound
   */
  error(): void {
    this.play('error');
  }

  /**
   * Play notification sound
   */
  notification(): void {
    this.play('notification');
  }

  /**
   * Play click sound
   */
  click(): void {
    this.play('click');
  }

  /**
   * Play completion sound
   */
  complete(): void {
    this.play('complete');
  }
}

// Export singleton instance
export const soundService = new SoundService();

export type { SoundType };
