// ============================================================================
// Cascade & Fallback Execution Controller
// Guarantees resilient task execution through progressive fallback layers
// ============================================================================

import { AIProvider, AIResponse, ClassificationResult, ClinicalSummaryResult } from '@/lib/providers/ai/interface';
import { MockAIProvider } from '@/lib/providers/ai/mock';

const deterministicMock = new MockAIProvider();

export async function executeWithFallback<T>(params: {
  taskName: string;
  primaryFn: () => Promise<T>;
  fallbackFn: () => Promise<T>;
  deterministicFn: () => Promise<T>;
}): Promise<{ result: T; fallbackUsed: boolean; tierUsed: 'PRIMARY' | 'SECONDARY' | 'DETERMINISTIC'; error?: string }> {
  try {
    const res = await params.primaryFn();
    return { result: res, fallbackUsed: false, tierUsed: 'PRIMARY' };
  } catch (primaryErr) {
    console.warn(`[Orchestrator Cascade] Primary provider failed for ${params.taskName}:`, primaryErr);

    try {
      const res = await params.fallbackFn();
      return { result: res, fallbackUsed: true, tierUsed: 'SECONDARY', error: String(primaryErr) };
    } catch (fallbackErr) {
      console.warn(`[Orchestrator Cascade] Secondary fallback failed for ${params.taskName}:`, fallbackErr);
      const res = await params.deterministicFn();
      return { 
        result: res, 
        fallbackUsed: true, 
        tierUsed: 'DETERMINISTIC', 
        error: `Cascade to offline deterministic fallback: ${String(fallbackErr)}` 
      };
    }
  }
}
