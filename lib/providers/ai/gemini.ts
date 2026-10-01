// ============================================================================
// Google Gemini Provider Adapter
// Free-tier compatible REST adapter with timeout and fallback support
// ============================================================================

import { AIProvider, AIResponse, ClassificationResult, ClinicalSummaryResult } from './interface';
import { TaskIntent } from '@/types';

export class GeminiProvider implements AIProvider {
  readonly name = 'Google Gemini 1.5 Flash';
  readonly providerId = 'gemini' as const;
  private apiKey: string;
  private modelName: string;

  constructor(apiKey?: string, modelName = 'gemini-1.5-flash') {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || '';
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
    const timeoutMs = options?.timeoutMs || 8000;

    if (!this.isAvailable()) {
      throw new Error('Gemini API key is not configured.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;
      const payload: Record<string, unknown> = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        }
      };

      if (options?.systemPrompt) {
        payload.systemInstruction = {
          parts: [{ text: options.systemPrompt }]
        };
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini API Error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return {
        text: outputText,
        confidence: 0.95,
        modelUsed: this.modelName,
        latencyMs: Date.now() - startTime,
        tokensUsed: data.usageMetadata?.totalTokenCount || 0
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
    const prompt = `You are a healthcare orchestration task classifier.
Classify the user input into EXACTLY ONE of these categories:
- SYMPTOM_QUERY
- MEDICAL_REPORT_ANALYSIS
- APPOINTMENT_REQUEST
- APPOINTMENT_CANCEL
- APPOINTMENT_RESCHEDULE
- PATIENT_HISTORY_SUMMARY
- TRANSLATION
- WAIT_TIME_QUERY
- GENERAL_HEALTH_INFORMATION
- EMERGENCY_FLAG

Return a valid JSON object ONLY, with format:
{"intent": "CATEGORY_NAME", "confidence": 0.95, "explanation": "brief reason"}

User Input: "${message}"`;

    try {
      const response = await this.generateText(prompt, { timeoutMs: options?.timeoutMs || 5000 });
      const cleanJson = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        intent: (parsed.intent as TaskIntent) || 'SYMPTOM_QUERY',
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.90,
        modelUsed: this.modelName,
        latencyMs: Date.now() - startTime,
        rawExplanation: parsed.explanation
      };
    } catch {
      // Fallback intent determination
      return {
        intent: 'SYMPTOM_QUERY',
        confidence: 0.80,
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
    const prompt = `You are a medical scribe assisting a doctor.
Summarize the following patient information into a structured clinical pre-consultation note.
Do NOT make a final diagnosis. Keep findings objective and clear.

Patient Symptoms: ${context.symptoms}
Medical History: ${context.history || 'None reported'}
Conversation Context: ${context.conversation || 'None'}

Return ONLY a JSON object with this exact schema:
{
  "subjective": "Patient-reported symptoms and onset",
  "objective": "Observations, history, lab mentions if any",
  "assessmentHints": "Differential considerations for the physician",
  "planSuggestions": "Recommended questions, tests to consider, or precautions"
}`;

    const response = await this.generateText(prompt, { timeoutMs: options?.timeoutMs || 8000 });
    const cleanJson = response.text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const parsed = JSON.parse(cleanJson);
      return {
        subjective: parsed.subjective || context.symptoms,
        objective: parsed.objective || 'Pending clinical examination.',
        assessmentHints: parsed.assessmentHints || 'Awaiting attending doctor evaluation.',
        planSuggestions: parsed.planSuggestions || '1. Clinical review by physician.',
        confidence: 0.94,
        modelUsed: this.modelName,
        latencyMs: Date.now() - startTime
      };
    } catch {
      return {
        subjective: context.symptoms,
        objective: 'Patient-reported details.',
        assessmentHints: 'To be evaluated by clinician.',
        planSuggestions: 'Review in consultation.',
        confidence: 0.85,
        modelUsed: this.modelName,
        latencyMs: Date.now() - startTime
      };
    }
  }
}
