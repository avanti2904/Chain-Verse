// ============================================================================
// Orchestrator Safety Check Bridge
// Coordinates deterministic emergency checks, prompt safety, and output validation
// ============================================================================

import { evaluateEmergencyRules, EmergencyMatch } from '@/lib/safety/emergency-rules';
import { validateClinicalOutput, ValidationResult } from '@/lib/safety/output-validator';
import { attachMedicalDisclaimer, EMERGENCY_ALERT_MESSAGE } from '@/lib/safety/medical-disclaimer';
import { recordSafetyEscalation } from '@/lib/safety/escalation';

export interface ComprehensiveSafetyEvaluation {
  emergency: EmergencyMatch;
  sanitization: ValidationResult;
  isEmergency: boolean;
  safeMessage: string;
}

export async function runSafetyChecks(params: {
  sessionId: string;
  patientId?: string;
  rawInput: string;
  proposedOutput?: string;
}): Promise<ComprehensiveSafetyEvaluation> {
  // 1. Scan incoming message for red-flag life-threatening presentations
  const emergency = evaluateEmergencyRules(params.rawInput);

  if (emergency.isEmergency) {
    await recordSafetyEscalation({
      sessionId: params.sessionId,
      patientId: params.patientId,
      severity: 'URGENT_REVIEW',
      trigger: `Red-flag symptom match: ${emergency.matchedKeywords.join(', ')}`,
      source: 'Deterministic Emergency Guardrail',
      actionTaken: emergency.recommendedAction,
      humanReviewRequired: true
    });

    return {
      emergency,
      sanitization: { isValid: true, sanitizedText: EMERGENCY_ALERT_MESSAGE, violations: [], confidenceAdjustment: 0 },
      isEmergency: true,
      safeMessage: attachMedicalDisclaimer(EMERGENCY_ALERT_MESSAGE)
    };
  }

  // 2. Validate proposed output if available
  const outputText = params.proposedOutput || '';
  const sanitization = validateClinicalOutput(outputText);
  const safeMessage = attachMedicalDisclaimer(sanitization.sanitizedText);

  return {
    emergency,
    sanitization,
    isEmergency: false,
    safeMessage
  };
}
