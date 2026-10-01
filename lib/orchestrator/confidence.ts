// ============================================================================
// Confidence & Uncertainty Calculator
// Computes multi-factor clinical confidence and flags low-certainty outputs
// ============================================================================

export interface ConfidenceEvaluation {
  finalConfidence: number;
  isSufficient: boolean;
  requiresHumanReview: boolean;
  penaltiesApplied: string[];
}

export function evaluateOrchestrationConfidence(params: {
  modelConfidence: number;
  safetyViolationsCount: number;
  isFallbackUsed: boolean;
  isEmergencyTriggered: boolean;
  hasAmbiguousSymptoms: boolean;
}): ConfidenceEvaluation {
  let score = params.modelConfidence;
  const penaltiesApplied: string[] = [];

  if (params.isFallbackUsed) {
    score -= 0.05;
    penaltiesApplied.push('Fallback provider execution deduction (-0.05)');
  }

  if (params.safetyViolationsCount > 0) {
    const deduction = Math.min(0.20, params.safetyViolationsCount * 0.10);
    score -= deduction;
    penaltiesApplied.push(`Clinical guardrail sanitization deduction (-${deduction})`);
  }

  if (params.hasAmbiguousSymptoms) {
    score -= 0.08;
    penaltiesApplied.push('Non-specific symptom cluster ambiguity (-0.08)');
  }

  // Bound score between 0.10 and 0.99
  const finalConfidence = Math.max(0.10, Math.min(0.99, Number(score.toFixed(3))));
  
  // Human review threshold: < 0.85 or when safety events trigger
  const requiresHumanReview = finalConfidence < 0.85 || params.isEmergencyTriggered || params.safetyViolationsCount > 0;
  const isSufficient = finalConfidence >= 0.70;

  return {
    finalConfidence,
    isSufficient,
    requiresHumanReview,
    penaltiesApplied
  };
}
