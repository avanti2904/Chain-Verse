// ============================================================================
// Speech-to-Text Provider Interface
// Supports Browser Web Speech API (Client) & Whisper-compatible API (Server)
// ============================================================================

import { SupportedLanguage } from '@/types';

export interface TranscriptionResult {
  text: string;
  detectedLanguage?: SupportedLanguage;
  confidence: number;
  providerUsed: string;
  durationSeconds?: number;
}

export interface SpeechProvider {
  readonly name: string;
  readonly providerId: 'browser_speech' | 'whisper' | 'mock_speech';

  isAvailable(): boolean;

  transcribeAudio(params: {
    audioData?: string; // base64 or buffer
    mimeType?: string;
    language?: SupportedLanguage;
    timeoutMs?: number;
  }): Promise<TranscriptionResult>;
}
