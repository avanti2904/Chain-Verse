// ============================================================================
// AI Provider Abstraction Interface
// Decouples the orchestration layer from specific model vendors
// ============================================================================

import { TaskIntent } from '@/types';

export interface AIResponse {
  text: string;
  confidence: number;
  modelUsed: string;
  latencyMs: number;
  tokensUsed?: number;
}

export interface ClassificationResult {
  intent: TaskIntent;
  confidence: number;
  modelUsed: string;
  latencyMs: number;
  rawExplanation?: string;
}

export interface ClinicalSummaryResult {
  subjective: string;
  objective: string;
  assessmentHints: string;
  planSuggestions: string;
  confidence: number;
  modelUsed: string;
  latencyMs: number;
}

export interface AIProvider {
  readonly name: string;
  readonly providerId: 'gemini' | 'groq' | 'huggingface' | 'mock';
  
  isAvailable(): boolean;

  generateText(
    prompt: string, 
    options?: { systemPrompt?: string; timeoutMs?: number }
  ): Promise<AIResponse>;

  classifyIntent(
    message: string, 
    options?: { timeoutMs?: number }
  ): Promise<ClassificationResult>;

  summarizeClinical(
    context: { symptoms: string; history?: string; conversation?: string },
    options?: { timeoutMs?: number }
  ): Promise<ClinicalSummaryResult>;
}
