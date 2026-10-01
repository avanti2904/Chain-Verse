// ============================================================================
// Tool & Service Selector
// Maps classified intents to deterministic hospital services and workflows
// ============================================================================

import { TaskIntent } from '@/types';

export type SelectedToolType = 
  | 'APPOINTMENT_SERVICE'
  | 'QUEUE_SERVICE'
  | 'DOCUMENT_OCR_SERVICE'
  | 'EMERGENCY_ESCALATION_SERVICE'
  | 'CLINICAL_NLP_SERVICE'
  | 'TRANSLATION_SERVICE';

export interface ToolSelection {
  tool: SelectedToolType;
  action: string;
  isDeterministic: boolean;
  endpoint?: string;
}

export function selectHospitalTool(intent: TaskIntent): ToolSelection {
  switch (intent) {
    case 'APPOINTMENT_REQUEST':
    case 'APPOINTMENT_CANCEL':
    case 'APPOINTMENT_RESCHEDULE':
      return {
        tool: 'APPOINTMENT_SERVICE',
        action: 'Route directly to Outpatient Scheduling Desk & Doctor Slot Allocator',
        isDeterministic: true,
        endpoint: '/api/appointments'
      };

    case 'WAIT_TIME_QUERY':
      return {
        tool: 'QUEUE_SERVICE',
        action: 'Query live queue database for current patient position and wait estimate',
        isDeterministic: true,
        endpoint: '/api/queue'
      };

    case 'MEDICAL_REPORT_ANALYSIS':
      return {
        tool: 'DOCUMENT_OCR_SERVICE',
        action: 'Route to multimodal document processing pipeline',
        isDeterministic: false,
        endpoint: '/api/ai/analyze-report'
      };

    case 'EMERGENCY_FLAG':
      return {
        tool: 'EMERGENCY_ESCALATION_SERVICE',
        action: 'Immediate red-flag triage escalation and emergency notification dispatch',
        isDeterministic: true
      };

    case 'TRANSLATION':
      return {
        tool: 'TRANSLATION_SERVICE',
        action: 'Route through localization pipeline preserving medical terminology',
        isDeterministic: true,
        endpoint: '/api/ai/translate'
      };

    case 'SYMPTOM_QUERY':
    case 'PATIENT_HISTORY_SUMMARY':
    case 'GENERAL_HEALTH_INFORMATION':
    default:
      return {
        tool: 'CLINICAL_NLP_SERVICE',
        action: 'Execute clinical pre-consultation triage and entity summarization',
        isDeterministic: false,
        endpoint: '/api/ai/chat'
      };
  }
}
