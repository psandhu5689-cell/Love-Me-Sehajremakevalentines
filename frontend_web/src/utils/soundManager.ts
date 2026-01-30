import { Howl } from 'howler'

// Sound categories and their cooldown times (ms)
const COOLDOWNS = {
  uiTap: 120,
  uiNavigate: 250,
  uiSuccess: 500,
  uiError: 500,
  special: 300,
  game: 200,
  cat: 3000,
}

class SoundManager {
  private sounds: Map<string, Howl> = new Map()
  private lastPlayed: Map<string, number> = new Map()
  private volume: number = 0.3
  private muted: boolean = false
  private initialized: boolean = false

  constructor() {
    // Load mute state from localStorage
    const savedMute = localStorage.getItem('soundMuted')
    this.muted = savedMute === 'true'
    
    // Initialize sounds after first user interaction
    if (typeof window !== 'undefined') {
      const initSounds = () => {
        if (!this.initialized) {
          this.initializeSounds()
          this.initialized = true
          document.removeEventListener('click', initSounds)
          document.removeEventListener('touchstart', initSounds)
        }
      }
      document.addEventListener('click', initSounds, { once: true })
      document.addEventListener('touchstart', initSounds, { once: true })
    }
  }

  private initializeSounds() {
    // UI Sounds (using existing audio or creating simple tones)
    this.sounds.set('uiTap', new Howl({
      src: ['/audio/ui-tap.mp3'],
      volume: this.volume * 0.5,
      preload: true,
    }))

    this.sounds.set('uiNavigate', new Howl({
      src: ['/audio/ui-navigate.mp3'],
      volume: this.volume * 0.6,
      preload: true,
    }))

    this.sounds.set('uiSuccess', new Howl({
      src: ['/audio/ui-success.mp3'],
      volume: this.volume * 0.7,
      preload: true,
    }))

    this.sounds.set('uiError', new Howl({
      src: ['/audio/ui-error.mp3'],
      volume: this.volume * 0.5,
      preload: true,
    }))

    this.sounds.set('uiBack', new Howl({
      src: ['/audio/ui-back.mp3'],
      volume: this.volume * 0.5,
      preload: true,
    }))

    // Special sounds
    this.sounds.set('kiss', new Howl({
      src: ['/audio/kiss.mp3'],
      volume: this.volume * 0.6,
      preload: true,
    }))

    this.sounds.set('magic', new Howl({
      src: ['/audio/magic.mp3'],
      volume: this.volume * 0.6,
      preload: true,
    }))

    this.sounds.set('sparkle', new Howl({
      src: ['/audio/sparkle.mp3'],
      volume: this.volume * 0.5,
      preload: true,
    }))

    this.sounds.set('heart', new Howl({
      src: ['/audio/heart.mp3'],
      volume: this.volume * 0.6,
      preload: true,
    }))

    // Game sounds
    this.sounds.set('cardFlip', new Howl({
      src: ['/audio/card-flip.mp3'],
      volume: this.volume * 0.4,
      preload: true,
    }))

    this.sounds.set('match', new Howl({
      src: ['/audio/match.mp3'],
      volume: this.volume * 0.6,
      preload: true,
    }))

    this.sounds.set('wordFound', new Howl({
      src: ['/audio/word-found.mp3'],
      volume: this.volume * 0.6,
      preload: true,
    }))

    this.sounds.set('celebration', new Howl({
      src: ['/audio/celebration.mp3'],
      volume: this.volume * 0.7,
      preload: true,
    }))

    this.sounds.set('toggleOn', new Howl({
      src: ['/audio/toggle-on.mp3'],
      volume: this.volume * 0.4,
      preload: true,
    }))

    this.sounds.set('toggleOff', new Howl({
      src: ['/audio/toggle-off.mp3'],
      volume: this.volume * 0.4,
      preload: true,
    }))
  }

  private getCooldownCategory(soundName: string): string {
    if (soundName.startsWith('ui')) return soundName
    if (soundName === 'kiss' || soundName === 'magic' || soundName === 'sparkle' || soundName === 'heart') return 'special'
    if (soundName === 'cardFlip' || soundName === 'match' || soundName === 'wordFound') return 'game'
    if (soundName.includes('cat')) return 'cat'
    return 'uiTap'
  }

  private canPlay(soundName: string): boolean {
    if (this.muted) return false
    if (!this.initialized) return false

    const category = this.getCooldownCategory(soundName)
    const cooldown = COOLDOWNS[category] || COOLDOWNS.uiTap
    const lastTime = this.lastPlayed.get(category) || 0
    const now = Date.now()

    return now - lastTime >= cooldown
  }

  play(soundName: string) {
    if (!this.canPlay(soundName)) return

    const sound = this.sounds.get(soundName)
    if (sound) {
      try {
        sound.play()
        const category = this.getCooldownCategory(soundName)
        this.lastPlayed.set(category, Date.now())
      } catch (error) {
        console.warn('Sound play failed:', soundName, error)
      }
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    this.sounds.forEach(sound => {
      sound.volume(this.volume)
    })
  }

  toggleMute() {
    this.muted = !this.muted
    localStorage.setItem('soundMuted', this.muted.toString())
    return this.muted
  }

  setMuted(muted: boolean) {
    this.muted = muted
    localStorage.setItem('soundMuted', muted.toString())
  }

  isMuted(): boolean {
    return this.muted
  }

  // Quick play methods for common actions
  tap() { this.play('uiTap') }
  navigate() { this.play('uiNavigate') }
  success() { this.play('uiSuccess') }
  error() { this.play('uiError') }
  back() { this.play('uiBack') }
}

// Create singleton instance
export const soundManager = new SoundManager()

// Export convenience functions
export const playSound = (name: string) => soundManager.play(name)
export const playSoundTap = () => soundManager.tap()
export const playSoundNavigate = () => soundManager.navigate()
export const playSoundSuccess = () => soundManager.success()
export const playSoundError = () => soundManager.error()
export const playSoundBack = () => soundManager.back()

export default soundManager
