// ============================================================================
// Groq AI Provider Adapter (Ultra-low latency Llama-3 / Mixtral)
// OpenAI-compatible REST API adapter
// ============================================================================

import { AIProvider, AIResponse, ClassificationResult, ClinicalSummaryResult } from './interface';
import { TaskIntent } from '@/types';

export class GroqProvider implements AIProvider {
  readonly name = 'Groq Cloud (Llama-3.3 70B)';
  readonly providerId = 'groq' as const;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey?: string, modelName = 'llama-3.3-70b-versatile') {
    this.apiKey = apiKey || process.env.GROQ_API_KEY || '';
    this.modelName = modelName;
  }

  isAvailable(): boolean {
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  async generateText(
    prompt: string,
    options?: { systemPrompt?: string; timeoutMs?: number }
  ): Promise<AIResponse> {
    const startTime = Date.now();
    const timeoutMs = options?.timeoutMs || 6000;

    if (!this.isAvailable()) {
      throw new Error('Groq API key is not configured.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const messages = [];
      if (options?.systemPrompt) {
        messages.push({ role: 'system', content: options.systemPrompt });
      }
      messages.push({ role: 'user', content: prompt });

      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.modelName,
          messages,
          temperature: 0.1,
          max_tokens: 1024
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Groq API Error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      const outputText = data.choices?.[0]?.message?.content || '';

      return {
        text: outputText,
        confidence: 0.96,
        modelUsed: this.modelName,
        latencyMs: Date.now() - startTime,
        tokensUsed: data.usage?.total_tokens || 0
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async classifyIntent(
    message: string,
    options?: { timeoutMs?: number }
  ): Promise<ClassificationResult> {
    const startTime = Date.now();
    const prompt = `Classify this healthcare input into exactly one intent:
SYMPTOM_QUERY, MEDICAL_REPORT_ANALYSIS, APPOINTMENT_REQUEST, APPOINTMENT_CANCEL, APPOINTMENT_RESCHEDULE, PATIENT_HISTORY_SUMMARY, TRANSLATION, WAIT_TIME_QUERY, EMERGENCY_FLAG.
Respond ONLY with JSON: {"intent": "CATEGORY", "confidence": 0.95}

Input: "${message}"`;

    try {
      const res = await this.generateText(prompt, { timeoutMs: options?.timeoutMs || 4000 });
      const cleanJson = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        intent: (parsed.intent as TaskIntent) || 'SYMPTOM_QUERY',
        confidence: parsed.confidence || 0.92,
        modelUsed: this.modelName,
        latencyMs: Date.now() - startTime
      };
    } catch {
      return {
        intent: 'SYMPTOM_QUERY',
        confidence: 0.85,
        modelUsed: `${this.modelName}-fallback`,
        latencyMs: Date.now() - startTime
      };
    }
  }

  async summarizeClinical(
    context: { symptoms: string; history?: string; conversation?: string },
    options?: { timeoutMs?: number }
  ): Promise<ClinicalSummaryResult> {
    const startTime = Date.now();
    const prompt = `Summarize into clinical pre-consultation note (JSON format with keys: subjective, objective, assessmentHints, planSuggestions).
Symptoms: ${context.symptoms}
History: ${context.history || 'None'}
Conversation: ${context.conversation || 'None'}`;

    try {
      const res = await this.generateText(prompt, { timeoutMs: options?.timeoutMs || 6000 });
      const cleanJson = res.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        subjective: parsed.subjective || context.symptoms,
        objective: parsed.objective || 'Vitals standard.',
        assessmentHints: parsed.assessmentHints || 'Consultation required.',
        planSuggestions: parsed.planSuggestions || 'Physician review.',
        confidence: 0.93,
        modelUsed: this.modelName,
        latencyMs: Date.now() - startTime
      };
    } catch {
      return {
        subjective: context.symptoms,
        objective: 'Self-reported symptoms.',
        assessmentHints: 'Needs clinical review.',
        planSuggestions: 'Follow doctor advice.',
        confidence: 0.80,
        modelUsed: this.modelName,
        latencyMs: Date.now() - startTime
      };
    }
  }
}
