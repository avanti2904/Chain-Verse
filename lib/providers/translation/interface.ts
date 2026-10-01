// ============================================================================
// Translation Provider Interface
// Supports English, Hindi, and Marathi clinical localization
// ============================================================================

import { SupportedLanguage } from '@/types';

export interface TranslationResult {
  translatedText: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  confidence: number;
  providerUsed: string;
}

export interface TranslationProvider {
  readonly name: string;
  
  isAvailable(): boolean;

  translate(
    text: string, 
    sourceLang: SupportedLanguage, 
    targetLang: SupportedLanguage
  ): Promise<TranslationResult>;

  detectLanguage(text: string): Promise<SupportedLanguage>;
}
