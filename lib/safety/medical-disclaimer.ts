// ============================================================================
// Medical Disclaimer & Clinical Transparency Utilities
// Enforces non-diagnostic compliance across all AI outputs
// ============================================================================

export const STANDARD_MEDICAL_DISCLAIMER = 
  "Non-Diagnostic Clinical Disclaimer: This platform provides clinical coordination, triage assistance, and medical information summarization. It does not provide definitive medical diagnoses, prescribe medications, or replace direct assessment by a licensed healthcare professional. All AI-generated observations must be verified by a clinician.";

export const EMERGENCY_ALERT_MESSAGE = 
  "Potentially urgent information detected. Please seek immediate professional medical assistance, contact emergency services (e.g., 911 / 112 / 108), or proceed to the nearest emergency department immediately.";

export function attachMedicalDisclaimer(responseMessage: string): string {
  if (responseMessage.includes("Non-Diagnostic Clinical Disclaimer")) {
    return responseMessage;
  }
  return `${responseMessage}\n\n---\n*${STANDARD_MEDICAL_DISCLAIMER}*`;
}
