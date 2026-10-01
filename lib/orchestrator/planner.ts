// ============================================================================
// Orchestrator Execution Planner
// Generates directed task pipelines based on intent, input type, and risk profile
// ============================================================================

import { TaskIntent, InputType } from '@/types';
import { PlannedStep, OrchestratorPlan } from './types';

export function createExecutionPlan(params: {
  intent: TaskIntent;
  inputType: InputType;
  hasAttachments: boolean;
  isEmergency: boolean;
  primaryModelId: string;
  fallbackModelId: string;
}): OrchestratorPlan {
  const steps: PlannedStep[] = [];
  const route: string[] = ['input_sanitizer', 'emergency_guard'];

  steps.push({
    name: 'Sanitize Input & Enforce Limits',
    component: 'SAFETY_VALIDATOR',
    requiredCapability: 'input_validation',
    critical: true
  });

  steps.push({
    name: 'Deterministic Emergency & Red-Flag Scan',
    component: 'EMERGENCY_GUARD',
    requiredCapability: 'deterministic_safety',
    critical: true
  });

  if (params.isEmergency) {
    route.push('emergency_escalation_protocol', 'audit_tracer');
    steps.push({
      name: 'Activate Emergency Escalation Workflow',
      component: 'EMERGENCY_GUARD',
      requiredCapability: 'escalation_protocol',
      critical: true
    });
    return {
      intent: params.intent,
      route,
      steps,
      primaryModelId: params.primaryModelId,
      fallbackModelId: params.fallbackModelId
    };
  }

  // Multimodal / Document handling
  if (params.hasAttachments || params.inputType === 'pdf' || params.inputType === 'image') {
    route.push('document_vision_pipeline', 'clinical_rules');
    steps.push({
      name: 'Extract Tabular Findings & OCR Parameters',
      component: 'DOCUMENT_VISION',
      requiredCapability: 'medical_document_ocr',
      critical: true
    });
  }

  // Intent classification and routing
  route.push('intent_classifier', 'clinical_rules');
  steps.push({
    name: 'Classify Task Intent & Domain Capability',
    component: 'INTENT_CLASSIFIER',
    requiredCapability: 'intent_classification',
    critical: true
  });

  steps.push({
    name: 'Evaluate Clinical Rule Engine',
    component: 'CLINICAL_RULES',
    requiredCapability: 'clinical_rules_evaluation',
    critical: true
  });

  // Specialized Model Step
  route.push('specialized_model_worker');
  steps.push({
    name: `Execute Specialized Clinical NLP Worker (${params.intent})`,
    component: 'SPECIALIZED_MODEL',
    requiredCapability: 'clinical_summarization',
    critical: true
  });

  // Safety validation and localization
  route.push('safety_validator', 'disclaimer_injector', 'audit_tracer');
  steps.push({
    name: 'Validate Output Phrasing & Strip Diagnostic Claims',
    component: 'SAFETY_VALIDATOR',
    requiredCapability: 'output_validation',
    critical: true
  });

  return {
    intent: params.intent,
    route,
    steps,
    primaryModelId: params.primaryModelId,
    fallbackModelId: params.fallbackModelId
  };
}
