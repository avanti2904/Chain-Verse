// ============================================================================
// Orchestrator Types & Execution Specifications
// ============================================================================

export * from '@/types';

export interface PlannedStep {
  name: string;
  component: 'INTENT_CLASSIFIER' | 'EMERGENCY_GUARD' | 'CLINICAL_RULES' | 'SPECIALIZED_MODEL' | 'DOCUMENT_VISION' | 'SAFETY_VALIDATOR' | 'LOCALIZATION';
  requiredCapability: string;
  critical: boolean;
}

export interface OrchestratorPlan {
  intent: string;
  route: string[];
  steps: PlannedStep[];
  primaryModelId: string;
  fallbackModelId: string;
}
