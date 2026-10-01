// ============================================================================
// Healthcare AI Model Orchestration Platform - Domain & System Types
// ============================================================================

export type UserRole = 'PATIENT' | 'DOCTOR' | 'HOSPITAL_ADMIN';

export type ClinicalSeverity = 
  | 'LOW_PRIORITY' 
  | 'ROUTINE' 
  | 'REVIEW_REQUIRED' 
  | 'URGENT_REVIEW';

export type TaskIntent =
  | 'SYMPTOM_QUERY'
  | 'MEDICAL_REPORT_ANALYSIS'
  | 'APPOINTMENT_REQUEST'
  | 'APPOINTMENT_CANCEL'
  | 'APPOINTMENT_RESCHEDULE'
  | 'PATIENT_HISTORY_SUMMARY'
  | 'TRANSLATION'
  | 'VOICE_TRANSCRIPTION'
  | 'DOCTOR_SUMMARY'
  | 'WAIT_TIME_QUERY'
  | 'GENERAL_HEALTH_INFORMATION'
  | 'EMERGENCY_FLAG'
  | 'HOSPITAL_WORKFLOW'
  | 'ADMIN_QUERY'
  | 'UNKNOWN';

export type InputType = 'text' | 'voice' | 'pdf' | 'image' | 'json';

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export type ModelProviderName = 'gemini' | 'groq' | 'huggingface' | 'mock' | 'browser_speech';

// --- Profiles & Users ---
export interface Profile {
  id: string;
  auth_user_id?: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  preferred_language: SupportedLanguage;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  profile_id: string;
  profile?: Profile;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  address?: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  profile_id: string;
  profile?: Profile;
  hospital_id: string;
  license_number: string;
  specialty: string;
  bio?: string;
  is_available: boolean;
  department_ids?: string[];
  created_at: string;
}

export interface Department {
  id: string;
  hospital_id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
}

// --- Appointments & Queue ---
export type AppointmentStatus = 
  | 'SCHEDULED' 
  | 'CONFIRMED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  department_id: string;
  slot_id?: string;
  appointment_date: string;
  appointment_time: string;
  status: AppointmentStatus;
  reason?: string;
  priority: ClinicalSeverity;
  patient_name?: string;
  doctor_name?: string;
  department_name?: string;
  created_at: string;
}

export type QueueStatus = 'WAITING' | 'CALLED' | 'WITH_DOCTOR' | 'COMPLETED' | 'SKIPPED';

export interface QueueEntry {
  id: string;
  appointment_id?: string;
  patient_id: string;
  department_id: string;
  doctor_id?: string;
  queue_number: number;
  status: QueueStatus;
  priority: ClinicalSeverity;
  check_in_time: string;
  estimated_wait_minutes: number;
  patient_name?: string;
  doctor_name?: string;
  department_name?: string;
}

// --- Medical Records & Extractions ---
export interface MedicalDocument {
  id: string;
  patient_id: string;
  session_id?: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size_bytes: number;
  document_type: string;
  status: 'UPLOADED' | 'PROCESSING' | 'ANALYZED' | 'ERROR';
  created_at: string;
}

export interface ExtractedParameter {
  name: string;
  value: string;
  unit: string;
  ref_range: string;
  abnormal: boolean;
  flag?: string;
}

export interface StructuredExtraction {
  documentType: string;
  patientName?: string;
  date?: string;
  testName?: string;
  observations: string[];
  parameters: ExtractedParameter[];
  abnormalFlags: string[];
  sourcePage?: number;
  confidence: number;
  summary: string;
}

// --- Model Registry & Execution ---
export interface ModelRegistryItem {
  id: string;
  name: string;
  provider: ModelProviderName;
  model_name: string;
  task_types: string[];
  input_types: string[];
  cost_type: 'FREE_TIER' | 'PAID' | 'LOCAL';
  availability: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  priority: number;
  max_context: number;
  supports_vision: boolean;
  supports_audio: boolean;
  supports_tools: boolean;
  enabled: boolean;
}

// --- Orchestrator Contracts ---
export interface OrchestrationAttachment {
  name: string;
  type: string;
  size: number;
  url?: string;
  base64Data?: string;
}

export interface OrchestrationRequest {
  userId?: string;
  patientId?: string;
  sessionId: string;
  role: UserRole;
  inputType: InputType;
  message: string;
  language?: SupportedLanguage;
  attachments?: OrchestrationAttachment[];
  conversationContext?: Array<{
    role: 'user' | 'assistant' | 'system' | 'clinician';
    content: string;
  }>;
}

export interface OrchestrationStepTrace {
  stepNumber: number;
  component: string;
  action: string;
  status: 'SUCCESS' | 'FALLBACK' | 'SKIPPED' | 'ERROR';
  latencyMs: number;
  confidence: number;
  modelUsed?: string;
  details?: Record<string, unknown>;
  error?: string;
}

export interface OrchestrationResponse {
  runId: string;
  sessionId: string;
  intent: TaskIntent;
  status: 'COMPLETED' | 'ESCALATED' | 'FALLBACK_COMPLETED' | 'ERROR';
  route: string[];
  selectedModel: string;
  fallbackUsed: boolean;
  confidence: number;
  totalLatencyMs: number;
  severity: ClinicalSeverity;
  requiresHumanReview: boolean;
  disclaimer: string;
  result: {
    message: string;
    translatedMessage?: string;
    symptoms?: Array<{
      name: string;
      severity: ClinicalSeverity;
      durationDays?: number;
      bodySite?: string;
    }>;
    extractedReport?: StructuredExtraction;
    appointmentSuggestion?: {
      department: string;
      specialty: string;
      priority: ClinicalSeverity;
      suggestedSlots?: string[];
    };
    queueStatus?: {
      currentNumber: number;
      estimatedWaitMinutes: number;
      aheadInQueue: number;
    };
    clinicalSummary?: {
      subjective: string;
      objective: string;
      assessmentHints: string;
      planSuggestions: string;
      isVerified: boolean;
    };
    safetyNotice?: string;
  };
  steps: OrchestrationStepTrace[];
}

// --- Clinical Rules ---
export interface RuleCondition {
  field: string;
  operator: 'contains_any' | 'equals' | '>' | '<' | 'is';
  values: unknown[];
}

export interface ClinicalRule {
  id: string;
  name: string;
  category: 'EMERGENCY' | 'TRIAGE' | 'DRUG_INTERACTION' | 'LAB_ALERT';
  conditions: RuleCondition[];
  severity: ClinicalSeverity;
  action: string;
  active: boolean;
}

// --- Safety & Escalation ---
export interface SafetyEvent {
  id: string;
  patient_id?: string;
  session_id: string;
  severity: ClinicalSeverity;
  trigger: string;
  source: string;
  action_taken: string;
  human_review_required: boolean;
  created_at: string;
}

// --- Doctor Review ---
export interface DoctorReview {
  id: string;
  patient_id: string;
  ai_task_id?: string;
  doctor_id: string;
  decision: 'VERIFIED' | 'MODIFIED' | 'REJECTED';
  notes: string;
  verified: boolean;
  created_at: string;
}
