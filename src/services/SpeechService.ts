/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';

class SpeechService {
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (this.synth) {
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  private getBestVoiceForLanguage(lang: Language): SpeechSynthesisVoice | null {
    const langMap: Record<Language, string> = {
      'PT': 'pt-PT', // Prefer European Portuguese
      'EN': 'en-GB', // Prefer British for similarity to European context
      'ES': 'es-ES',
      'FR': 'fr-FR'
    };

    const targetLang = langMap[lang];
    
    // 1. Try to find a "natural" or "premium" voice first
    const premium = this.voices.find(v => v.lang.replace('_', '-').includes(targetLang) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Premium')));
    if (premium) return premium;

    // 2. Try any voice for that language
    const anyVoice = this.voices.find(v => v.lang.replace('_', '-').includes(targetLang));
    return anyVoice || null;
  }

  private prepareText(text: string): string {
    // 1. Handle spelling patterns: "L - O - B - O" -> "L, O, B, O"
    // This forces the TTS to pause slightly and read individual letters clearly.
    let processed = text.replace(/ \- /g, ', ');

    // 2. Handle syllable divisions: "PAN-DA" -> "PAN, DA"
    // Replacing internal hyphens with a comma ensures the child hears each syllable separately.
    processed = processed.replace(/(\w)\-(\w)/g, '$1, $2');

    // 3. Handle specific formatting like ".___." or "___" (blanks)
    // We can replace these with a small silence or just leave them as they are usually skipped.
    processed = processed.replace(/___/g, '...');

    return processed;
  }

  public speak(text: string, lang: Language) {
    if (!this.synth) return;

    // Stop previous speech
    this.synth.cancel();

    const processedText = this.prepareText(text);
    const utterance = new SpeechSynthesisUtterance(processedText);
    const voice = this.getBestVoiceForLanguage(lang);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    const langMap: Record<Language, string> = {
      'PT': 'pt-PT',
      'EN': 'en-GB',
      'ES': 'es-ES',
      'FR': 'fr-FR'
    };
    utterance.lang = langMap[lang];
    
    // To make it "agradável, suave e calma":
    // Normal pitch and slightly slower rate for a calm feeling
    utterance.pitch = 1.05; 
    utterance.rate = 0.95;
    utterance.volume = 1;

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
