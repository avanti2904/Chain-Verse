// ============================================================================
// Model Selector Service
// Evaluates active models from registry and chooses optimal primary & fallback
// ============================================================================

import { ModelRegistryItem, InputType } from '@/types';
import { mockStore } from '@/lib/supabase/mock-store';
import { GeminiProvider } from '@/lib/providers/ai/gemini';
import { GroqProvider } from '@/lib/providers/ai/groq';
import { HuggingFaceProvider } from '@/lib/providers/ai/huggingface';
import { MockAIProvider } from '@/lib/providers/ai/mock';
import { AIProvider } from '@/lib/providers/ai/interface';

export interface ModelSelectionResult {
  primaryModel: ModelRegistryItem;
  fallbackModel: ModelRegistryItem;
  primaryProviderInstance: AIProvider;
  fallbackProviderInstance: AIProvider;
  selectionReason: string;
}

export function selectOptimalModel(params: {
  taskType: string;
  inputType: InputType;
  preferredProvider?: string;
  requiresVision?: boolean;
}): ModelSelectionResult {
  const models: ModelRegistryItem[] = mockStore.models.filter(m => m.enabled && m.availability === 'ONLINE');

  // Candidate filtering based on task and capabilities
  let candidates = models.filter(m => {
    if (params.requiresVision && !m.supports_vision) return false;
    return true;
  });

  if (candidates.length === 0) {
    candidates = models;
  }

  // Sort candidates by configured Priority (1 is highest)
  candidates.sort((a, b) => a.priority - b.priority);

  // Identify user-preferred or default primary
  let primary = candidates[0];
  if (params.preferredProvider) {
    const match = candidates.find(m => m.provider === params.preferredProvider);
    if (match) primary = match;
  }

  // Fallback is the next best candidate or deterministic mock
  const fallback = candidates.find(m => m.id !== primary.id) || 
    candidates.find(m => m.provider === 'mock') || 
    primary;

  const getProviderInstance = (model: ModelRegistryItem): AIProvider => {
    switch (model.provider) {
      case 'gemini':
        return new GeminiProvider();
      case 'groq':
        return new GroqProvider();
      case 'huggingface':
        return new HuggingFaceProvider();
      case 'mock':
      default:
        return new MockAIProvider();
    }
  };

  return {
    primaryModel: primary,
    fallbackModel: fallback,
    primaryProviderInstance: getProviderInstance(primary),
    fallbackProviderInstance: getProviderInstance(fallback),
    selectionReason: `Selected ${primary.name} based on priority ranking #${primary.priority} and required capability for ${params.taskType}.`
  };
}
