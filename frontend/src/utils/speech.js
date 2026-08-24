/**
 * Browser-native Web Speech API wrapper for Multilingual Voice Synthesis
 * Free, offline-friendly, zero external API keys needed.
 */

class VoiceSynthesisService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  getBestVoice(lang = 'en') {
    if (!this.voices || this.voices.length === 0) {
      this.loadVoices();
    }

    const langCodeMap = {
      en: ['en-IN', 'en-GB', 'en-US', 'en'],
      hi: ['hi-IN', 'hi'],
      as: ['as-IN', 'bn-IN', 'hi-IN', 'en-IN'], // Fallback to related regional synthesis if Assamese voice is missing on device
      bn: ['bn-IN', 'bn', 'hi-IN']
    };

    const targetPrefixes = langCodeMap[lang] || ['en-IN', 'en'];

    for (const prefix of targetPrefixes) {
      const match = this.voices.find(v => v.lang && v.lang.toLowerCase().startsWith(prefix.toLowerCase()));
      if (match) return match;
    }

    return this.voices[0] || null;
  }

  speak(text, { lang = 'en', onStart, onEnd, onError } = {}) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported on this browser/device.');
      if (onError) onError(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Choose appropriate regional voice and tag
    const langCode = lang === 'hi' ? 'hi-IN' : lang === 'as' ? 'as-IN' : lang === 'bn' ? 'bn-IN' : 'en-IN';
    utterance.lang = langCode;
    utterance.rate = 0.95; // Calm, clear delivery for emergency alerts
    utterance.pitch = 1.0;

    const matchedVoice = this.getBestVoice(lang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
  }

  isSupported() {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }
}

export const speechService = new VoiceSynthesisService();
