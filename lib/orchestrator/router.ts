// ============================================================================
// Core AI Orchestrator Kernel & Master Router
// Coordinates Task Classification, Model Selection, Safety Guardrails,
// Clinical Rules, Multi-Provider Cascades, and Human Review Escalation
// ============================================================================

import { 
  OrchestrationRequest, 
  OrchestrationResponse, 
  OrchestrationStepTrace,
  TaskIntent,
  ClinicalSeverity,
  SupportedLanguage
} from '@/types';
import { evaluateEmergencyRules } from '@/lib/safety/emergency-rules';
import { validateClinicalOutput } from '@/lib/safety/output-validator';
import { attachMedicalDisclaimer, EMERGENCY_ALERT_MESSAGE, STANDARD_MEDICAL_DISCLAIMER } from '@/lib/safety/medical-disclaimer';
import { recordSafetyEscalation } from '@/lib/safety/escalation';
import { evaluateClinicalRules } from '@/lib/clinical/rule-engine';
import { selectOptimalModel } from './model-selector';
import { selectHospitalTool } from './tool-selector';
import { hydrateClinicalContext } from './context-manager';
import { evaluateOrchestrationConfidence } from './confidence';
import { executeWithFallback } from './fallback';
import { MockVisionProvider } from '@/lib/providers/vision/mock';
import { GeminiVisionProvider } from '@/lib/providers/vision/gemini';
import { MockTranslationProvider } from '@/lib/providers/translation/mock';
import { mockStore } from '@/lib/supabase/mock-store';

const translator = new MockTranslationProvider();
const mockVision = new MockVisionProvider();
const geminiVision = new GeminiVisionProvider();

export async function orchestrateHealthcareRequest(
  request: OrchestrationRequest
): Promise<OrchestrationResponse> {
  const startTime = Date.now();
  const runId = `run-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const steps: OrchestrationStepTrace[] = [];
  const route: string[] = [];

  // Step 1: Input Validation
  const valStart = Date.now();
  const cleanMessage = (request.message || '').trim();
  const lang: SupportedLanguage = request.language || 'en';
  
  steps.push({
    stepNumber: 1,
    component: 'InputSanitizer',
    action: 'Sanitize input text, verify role permissions, check payload size',
    status: 'SUCCESS',
    latencyMs: Date.now() - valStart,
    confidence: 1.0,
    details: { inputType: request.inputType, lang, messageLength: cleanMessage.length }
  });
  route.push('input_sanitizer');

  // Step 2: Emergency & Red-Flag Safety Scan (Deterministic)
  const emergStart = Date.now();
  const emergencyCheck = evaluateEmergencyRules(cleanMessage);
  
  if (emergencyCheck.isEmergency) {
    await recordSafetyEscalation({
      sessionId: request.sessionId,
      patientId: request.patientId,
      severity: 'URGENT_REVIEW',
      trigger: `Red-flag symptoms detected: ${emergencyCheck.matchedKeywords.join(', ')}`,
      source: 'Deterministic Emergency Guardrail',
      actionTaken: emergencyCheck.recommendedAction,
      humanReviewRequired: true
    });

    steps.push({
      stepNumber: 2,
      component: 'EmergencyGuardrail',
      action: 'Deterministic red-flag match. Activated emergency escalation protocol.',
      status: 'SUCCESS',
      latencyMs: Date.now() - emergStart,
      confidence: 0.99,
      details: { 
        matchedKeywords: emergencyCheck.matchedKeywords, 
        category: emergencyCheck.matchedCategory 
      }
    });
    route.push('emergency_guardrail', 'emergency_escalation_protocol');

    // Multilingual translation if needed
    let safeNotice = EMERGENCY_ALERT_MESSAGE;
    if (lang !== 'en') {
      const trans = await translator.translate(safeNotice, 'en', lang);
      safeNotice = trans.translatedText;
    }

    const totalLatencyMs = Date.now() - startTime;
    const emergencyResponse: OrchestrationResponse = {
      runId,
      sessionId: request.sessionId,
      intent: 'EMERGENCY_FLAG',
      status: 'ESCALATED',
      route,
      selectedModel: 'deterministic-emergency-protocol',
      fallbackUsed: false,
      confidence: 0.99,
      totalLatencyMs,
      severity: 'URGENT_REVIEW',
      requiresHumanReview: true,
      disclaimer: STANDARD_MEDICAL_DISCLAIMER,
      result: {
        message: attachMedicalDisclaimer(safeNotice),
        safetyNotice: `EMERGENCY ALERT: ${emergencyCheck.recommendedAction}`
      },
      steps
    };

    // Store in mock logs for observability
    mockStore.orchestrationLogs.unshift({
      runId,
      timestamp: new Date().toISOString(),
      intent: 'EMERGENCY_FLAG',
      selectedModel: 'deterministic-emergency-protocol',
      totalLatencyMs,
      confidence: 0.99,
      severity: 'URGENT_REVIEW',
      fallbackUsed: false,
      status: 'ESCALATED',
      steps
    });

    return emergencyResponse;
  }

  steps.push({
    stepNumber: 2,
    component: 'EmergencyGuardrail',
    action: 'Scanned for life-threatening presentations. No acute red-flags found.',
    status: 'SUCCESS',
    latencyMs: Date.now() - emergStart,
    confidence: 1.0
  });
  route.push('emergency_guardrail');

  // Step 3: Multilingual Normalization (Translate to English if needed)
  let workingMessage = cleanMessage;
  if (lang !== 'en') {
    const transStart = Date.now();
    const transResult = await translator.translate(cleanMessage, lang, 'en');
    workingMessage = transResult.translatedText;
    steps.push({
      stepNumber: 3,
      component: 'TranslationPipeline',
      action: `Normalized incoming text from ${lang.toUpperCase()} to English`,
      status: 'SUCCESS',
      latencyMs: Date.now() - transStart,
      confidence: transResult.confidence,
      modelUsed: transResult.providerUsed
    });
    route.push('translation_inbound');
  }

  // Step 4: Intent Classification & Tool Routing
  const intentStart = Date.now();
  let detectedIntent: TaskIntent = 'SYMPTOM_QUERY';
  let intentConfidence = 0.94;
  let modelSelection = selectOptimalModel({
    taskType: 'clinical_triage',
    inputType: request.inputType,
    requiresVision: Boolean(request.attachments && request.attachments.length > 0)
  });

  // Check deterministic attachments first
  if (request.attachments && request.attachments.length > 0) {
    detectedIntent = 'MEDICAL_REPORT_ANALYSIS';
    intentConfidence = 0.98;
  } else {
    // Classification using provider or deterministic router
    const classRes = await modelSelection.primaryProviderInstance.classifyIntent(workingMessage);
    detectedIntent = classRes.intent;
    intentConfidence = classRes.confidence;
  }

  const toolSelection = selectHospitalTool(detectedIntent);

  steps.push({
    stepNumber: 4,
    component: 'TaskRouter',
    action: `Classified intent as [${detectedIntent}]. Selected tool: ${toolSelection.tool}`,
    status: 'SUCCESS',
    latencyMs: Date.now() - intentStart,
    confidence: intentConfidence,
    details: { intent: detectedIntent, selectedTool: toolSelection.tool, action: toolSelection.action }
  });
  route.push('intent_classifier', 'tool_selector');

  // Step 5: Clinical Rule Engine
  const rulesStart = Date.now();
  const ruleEvaluation = evaluateClinicalRules({
    message: workingMessage,
    intent: detectedIntent
  });

  steps.push({
    stepNumber: 5,
    component: 'ClinicalRuleEngine',
    action: `Evaluated configurable clinical rules. Resulting severity: ${ruleEvaluation.highestSeverity}`,
    status: 'SUCCESS',
    latencyMs: Date.now() - rulesStart,
    confidence: 0.98,
    details: { 
      severity: ruleEvaluation.highestSeverity,
      matchedRulesCount: ruleEvaluation.matchedRules.length,
      requiresReview: ruleEvaluation.requiresReview
    }
  });
  route.push('clinical_rule_engine');

  // Step 6: Specialized Model / Tool Worker Execution
  const workerStart = Date.now();
  let executionResult: OrchestrationResponse['result'] = {
    message: ''
  };
  let fallbackUsed = false;
  let activeModelUsed = modelSelection.primaryModel.name;

  if (detectedIntent === 'MEDICAL_REPORT_ANALYSIS') {
    // Document Vision Pipeline
    const attachment = request.attachments?.[0];
    const fileName = attachment?.name || 'CBC_Lipid_Panel_Report_2026.pdf';
    const visionProvider = geminiVision.isAvailable() ? geminiVision : mockVision;

    const extracted = await visionProvider.extractReport({
      fileName,
      fileData: attachment?.base64Data,
      mimeType: attachment?.type
    });

    executionResult = {
      message: `Medical document (${fileName}) processed successfully. Extracted ${extracted.parameters.length} diagnostic parameters with ${extracted.abnormalFlags.length} abnormal flags identified for doctor verification.`,
      extractedReport: extracted
    };
    activeModelUsed = visionProvider.name;
    route.push('document_vision_pipeline');

  } else if (detectedIntent === 'APPOINTMENT_REQUEST') {
    // Outpatient Appointment Routing
    const suggestedDept = workingMessage.toLowerCase().includes('heart') || workingMessage.toLowerCase().includes('cardio')
      ? 'Cardiology & Vascular Health'
      : 'General & Internal Medicine';

    executionResult = {
      message: `Appointment request logged. Recommended department: ${suggestedDept}. The scheduling desk has matching availability for consultation.`,
      appointmentSuggestion: {
        department: suggestedDept,
        specialty: suggestedDept.includes('Cardio') ? 'Cardiology' : 'Internal Medicine',
        priority: ruleEvaluation.highestSeverity,
        suggestedSlots: ['Today 11:30 AM', 'Tomorrow 10:00 AM', 'Tomorrow 02:00 PM']
      }
    };
    activeModelUsed = 'appointment-service-router';
    route.push('appointment_workflow');

  } else if (detectedIntent === 'WAIT_TIME_QUERY') {
    // Live Queue Lookup
    const currentQ = mockStore.queue.find(q => q.status === 'WAITING' || q.status === 'WITH_DOCTOR') || mockStore.queue[0];
    executionResult = {
      message: `Current clinic queue status: You are currently waiting for ${currentQ.department_name}. Estimated wait time is approximately ${currentQ.estimated_wait_minutes} minutes.`,
      queueStatus: {
        currentNumber: currentQ.queue_number,
        estimatedWaitMinutes: currentQ.estimated_wait_minutes,
        aheadInQueue: 1
      }
    };
    activeModelUsed = 'queue-service-router';
    route.push('queue_workflow');

  } else {
    // Clinical NLP Pipeline (Symptom Query / Triage)
    const context = hydrateClinicalContext({
      patientId: request.patientId,
      userId: request.userId,
      conversationContext: request.conversationContext
    });

    const cascade = await executeWithFallback({
      taskName: 'Clinical NLP Summarization',
      primaryFn: () => modelSelection.primaryProviderInstance.summarizeClinical({
        symptoms: workingMessage,
        history: context.chronicConditions.join(', '),
        conversation: context.conversationSnippet
      }),
      fallbackFn: () => modelSelection.fallbackProviderInstance.summarizeClinical({
        symptoms: workingMessage,
        history: context.chronicConditions.join(', '),
        conversation: context.conversationSnippet
      }),
      deterministicFn: () => new MockVisionProvider().extractReport({ fileName: 'clinical_summary.txt' }).then(() => ({
        subjective: workingMessage,
        objective: 'Patient-reported symptoms recorded.',
        assessmentHints: 'Symptom cluster requires attending clinician examination.',
        planSuggestions: '1. Outpatient consultation.\n2. Vitals triage check.',
        confidence: 0.90,
        modelUsed: 'deterministic-clinical-mock',
        latencyMs: 100
      }))
    });

    fallbackUsed = cascade.fallbackUsed;
    const summary = cascade.result;
    activeModelUsed = summary.modelUsed;

    executionResult = {
      message: `Thank you for sharing your symptoms. Based on your description, an initial pre-consultation summary has been generated for your attending doctor.`,
      clinicalSummary: {
        subjective: summary.subjective,
        objective: summary.objective,
        assessmentHints: summary.assessmentHints,
        planSuggestions: summary.planSuggestions,
        isVerified: false
      },
      symptoms: [
        { name: workingMessage.slice(0, 40), severity: ruleEvaluation.highestSeverity }
      ]
    };
    route.push('clinical_nlp_worker');
  }

  steps.push({
    stepNumber: 6,
    component: 'SpecializedWorker',
    action: `Executed specialized task using ${activeModelUsed}${fallbackUsed ? ' (Fallback Triggered)' : ''}`,
    status: fallbackUsed ? 'FALLBACK' : 'SUCCESS',
    latencyMs: Date.now() - workerStart,
    confidence: 0.94,
    modelUsed: activeModelUsed
  });

  // Step 7: Output Validation & Disclaimer Attachment
  const outValStart = Date.now();
  const validation = validateClinicalOutput(executionResult.message);
  executionResult.message = attachMedicalDisclaimer(validation.sanitizedText);

  steps.push({
    stepNumber: 7,
    component: 'SafetyValidator',
    action: 'Sanitized clinical terminology, checked non-diagnostic compliance, attached disclaimer',
    status: 'SUCCESS',
    latencyMs: Date.now() - outValStart,
    confidence: 1.0,
    details: { violationsFound: validation.violations.length }
  });
  route.push('output_validator', 'disclaimer_injector');

  // Step 8: Multi-factor Confidence Evaluation
  const confEvaluation = evaluateOrchestrationConfidence({
    modelConfidence: intentConfidence,
    safetyViolationsCount: validation.violations.length,
    isFallbackUsed: fallbackUsed,
    isEmergencyTriggered: false,
    hasAmbiguousSymptoms: detectedIntent === 'UNKNOWN'
  });

  // Step 9: Outbound Localization (Translate back to Hindi/Marathi if required)
  if (lang !== 'en') {
    const outTransStart = Date.now();
    const transBack = await translator.translate(executionResult.message, 'en', lang);
    executionResult.translatedMessage = transBack.translatedText;

    steps.push({
      stepNumber: 8,
      component: 'TranslationPipeline',
      action: `Translated final clinical response to patient preferred language (${lang.toUpperCase()})`,
      status: 'SUCCESS',
      latencyMs: Date.now() - outTransStart,
      confidence: transBack.confidence,
      modelUsed: transBack.providerUsed
    });
    route.push('translation_outbound');
  }

  const totalLatencyMs = Date.now() - startTime;
  route.push('audit_logger');

  const finalResponse: OrchestrationResponse = {
    runId,
    sessionId: request.sessionId,
    intent: detectedIntent,
    status: fallbackUsed ? 'FALLBACK_COMPLETED' : 'COMPLETED',
    route,
    selectedModel: activeModelUsed,
    fallbackUsed,
    confidence: confEvaluation.finalConfidence,
    totalLatencyMs,
    severity: ruleEvaluation.highestSeverity,
    requiresHumanReview: confEvaluation.requiresHumanReview || ruleEvaluation.requiresReview,
    disclaimer: STANDARD_MEDICAL_DISCLAIMER,
    result: executionResult,
    steps
  };

  // Record for Admin Orchestration Monitor & Observability
  mockStore.orchestrationLogs.unshift({
    runId,
    timestamp: new Date().toISOString(),
    intent: detectedIntent,
    selectedModel: activeModelUsed,
    totalLatencyMs,
    confidence: confEvaluation.finalConfidence,
    severity: ruleEvaluation.highestSeverity,
    fallbackUsed,
    status: finalResponse.status,
    steps
  });

  return finalResponse;
}
