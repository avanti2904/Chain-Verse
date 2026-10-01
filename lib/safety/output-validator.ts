// ============================================================================
// Clinical Output Validator & Hallucination Guard
// Strips overconfident definitive diagnosis claims & enforces safe language
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  sanitizedText: string;
  violations: string[];
  confidenceAdjustment: number;
}

const FORBIDDEN_DIAGNOSTIC_PATTERNS = [
  /you definitely have\b/gi,
  /you are diagnosed with\b/gi,
  /my diagnosis is\b/gi,
  /you must take \d+\s*(mg|ml|tablets?)/gi,
  /stop taking your prescribed/gi,
  /there is no need to see a doctor/gi,
  /this is 100% (benign|cancerous|safe)/gi
];

export function validateClinicalOutput(rawText: string): ValidationResult {
  const violations: string[] = [];
  let sanitizedText = rawText;
  let confidenceAdjustment = 0;

  for (const pattern of FORBIDDEN_DIAGNOSTIC_PATTERNS) {
    if (pattern.test(sanitizedText)) {
      violations.push(`Detected overconfident or prohibited phrase matching: ${pattern}`);
      confidenceAdjustment -= 0.15;
      
      // Replace with safe clinical phrasing
      sanitizedText = sanitizedText.replace(pattern, (matched) => {
        if (/you definitely have|you are diagnosed with|my diagnosis is/i.test(matched)) {
          return "this information may suggest possibilities that warrant clinician assessment for";
        }
        if (/you must take/i.test(matched)) {
          return "a physician may evaluate suitable therapy such as";
        }
        if (/stop taking your prescribed/i.test(matched)) {
          return "discuss any medication changes with your prescribing physician";
        }
        if (/there is no need to see a doctor/i.test(matched)) {
          return "routine clinical evaluation remains advised";
        }
        return "clinical evaluation is advised regarding";
      });
    }
  }

  return {
    isValid: violations.length === 0,
    sanitizedText,
    violations,
    confidenceAdjustment
  };
}
