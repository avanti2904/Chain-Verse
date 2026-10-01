// ============================================================================
// Deterministic Mock AI Provider
// 100% Offline, Zero-Cost, Hackathon-Ready Clinical NLP Engine
// ============================================================================

import { AIProvider, AIResponse, ClassificationResult, ClinicalSummaryResult } from './interface';
import { TaskIntent } from '@/types';

export class MockAIProvider implements AIProvider {
  readonly name = 'Deterministic Clinical Mock Engine';
  readonly providerId = 'mock' as const;

  isAvailable(): boolean {
    return true;
  }

  async generateText(
    prompt: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: { systemPrompt?: string; timeoutMs?: number }
  ): Promise<AIResponse> {
    const startTime = Date.now();
    await new Promise(r => setTimeout(r, 120)); // simulated latency

    return {
      text: `Based on clinical triage protocols, the reported presentation has been noted. Routine monitoring is recommended until consultation with an attending physician.`,
      confidence: 0.94,
      modelUsed: 'deterministic-clinical-v1',
      latencyMs: Date.now() - startTime,
      tokensUsed: 42
    };
  }

  async classifyIntent(
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: { timeoutMs?: number }
  ): Promise<ClassificationResult> {
    const startTime = Date.now();
    const lower = message.toLowerCase();
    let intent: TaskIntent = 'SYMPTOM_QUERY';
    let confidence = 0.92;

    if (
      lower.includes('chest pain') ||
      lower.includes('heart attack') ||
      lower.includes('cannot breathe') ||
      lower.includes('stroke') ||
      lower.includes('passed out')
    ) {
      intent = 'EMERGENCY_FLAG';
      confidence = 0.99;
    } else if (
      lower.includes('book') || 
      lower.includes('appointment') || 
      lower.includes('schedule') || 
      lower.includes('doctor visit')
    ) {
      intent = 'APPOINTMENT_REQUEST';
      confidence = 0.96;
    } else if (lower.includes('cancel')) {
      intent = 'APPOINTMENT_CANCEL';
      confidence = 0.95;
    } else if (lower.includes('reschedule') || lower.includes('change time') || lower.includes('postpone')) {
      intent = 'APPOINTMENT_RESCHEDULE';
      confidence = 0.94;
    } else if (
      lower.includes('report') || 
      lower.includes('test result') || 
      lower.includes('blood test') || 
      lower.includes('lipid') || 
      lower.includes('scan') ||
      lower.includes('x-ray')
    ) {
      intent = 'MEDICAL_REPORT_ANALYSIS';
      confidence = 0.95;
    } else if (
      lower.includes('queue') || 
      lower.includes('wait time') || 
      lower.includes('waiting') || 
      lower.includes('my turn')
    ) {
      intent = 'WAIT_TIME_QUERY';
      confidence = 0.97;
    } else if (lower.includes('history') || lower.includes('previous records')) {
      intent = 'PATIENT_HISTORY_SUMMARY';
      confidence = 0.91;
    } else if (lower.includes('translate') || lower.includes('in hindi') || lower.includes('in marathi')) {
      intent = 'TRANSLATION';
      confidence = 0.93;
    }

    await new Promise(r => setTimeout(r, 60));

    return {
      intent,
      confidence,
      modelUsed: 'deterministic-intent-router',
      latencyMs: Date.now() - startTime,
      rawExplanation: `Deterministic keyword match on tokens.`
    };
  }

  async summarizeClinical(
    context: { symptoms: string; history?: string; conversation?: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: { timeoutMs?: number }
  ): Promise<ClinicalSummaryResult> {
    const startTime = Date.now();
    await new Promise(r => setTimeout(r, 150));

    return {
      subjective: `Patient reports: "${context.symptoms}". Relevant past history: ${context.history || 'No prior adverse medical history reported.'}`,
      objective: `Vital signs awaiting clinical intake triage. Patient oriented to time, place, and person.`,
      assessmentHints: `Clinical presentation warrants evaluation for symptomatic resolution and differential diagnostic workup by the attending medical officer.`,
      planSuggestions: `1. Clinician consultation recommended.\n2. Review pertinent laboratory/radiological investigations.\n3. Advise patient on symptom tracking and immediate emergency precautions.`,
      confidence: 0.93,
      modelUsed: 'deterministic-clinical-summarizer',
      latencyMs: Date.now() - startTime
    };
  }
}
