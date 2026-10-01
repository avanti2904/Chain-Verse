// ============================================================================
// In-Memory Stateful Mock Store for Hackathon Zero-Config & DEMO_MODE
// Seeded with fictional patients, doctors, appointments, queue, and rules
// ============================================================================

import { 
  Profile, 
  Doctor, 
  Patient, 
  Department, 
  Appointment, 
  QueueEntry, 
  ModelRegistryItem, 
  ClinicalRule, 
  MedicalDocument, 
  StructuredExtraction,
  SafetyEvent,
  DoctorReview,
  OrchestrationStepTrace
} from '@/types';

class MockDataStore {
  profiles: Profile[] = [
    {
      id: '33333333-3333-3333-3333-333333333331',
      email: 'admin@metrohospital.org',
      full_name: 'Dr. Sarah Chen, MD (Chief Medical Officer)',
      role: 'HOSPITAL_ADMIN',
      phone: '+1 (555) 300-0001',
      preferred_language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333332',
      email: 'dr.patel@metrohospital.org',
      full_name: 'Dr. Rajesh Patel, MD',
      role: 'DOCTOR',
      phone: '+1 (555) 300-0002',
      preferred_language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333333',
      email: 'dr.sharma@metrohospital.org',
      full_name: 'Dr. Ananya Sharma, MD',
      role: 'DOCTOR',
      phone: '+1 (555) 300-0003',
      preferred_language: 'hi',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333334',
      email: 'dr.deshmukh@metrohospital.org',
      full_name: 'Dr. Vikram Deshmukh, MD',
      role: 'DOCTOR',
      phone: '+1 (555) 300-0004',
      preferred_language: 'mr',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    // Fictional Patients
    {
      id: '33333333-3333-3333-3333-333333333341',
      email: 'arav.kumar.demo@example.com',
      full_name: 'Arav Kumar',
      role: 'PATIENT',
      phone: '+1 (555) 400-0001',
      preferred_language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333342',
      email: 'sunita.sharma.demo@example.com',
      full_name: 'Sunita Sharma',
      role: 'PATIENT',
      phone: '+1 (555) 400-0002',
      preferred_language: 'hi',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '33333333-3333-3333-3333-333333333343',
      email: 'rohit.kulkarni.demo@example.com',
      full_name: 'Rohit Kulkarni',
      role: 'PATIENT',
      phone: '+1 (555) 400-0003',
      preferred_language: 'mr',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  departments: Department[] = [
    {
      id: '22222222-2222-2222-2222-222222222221',
      hospital_id: '11111111-1111-1111-1111-111111111111',
      name: 'General & Internal Medicine',
      code: 'GEN-MED',
      description: 'Primary care, clinical triage, chronic illness management',
      active: true
    },
    {
      id: '22222222-2222-2222-2222-222222222222',
      hospital_id: '11111111-1111-1111-1111-111111111111',
      name: 'Cardiology & Vascular Health',
      code: 'CARD-01',
      description: 'Cardiac evaluation, ECG review, acute angina triage',
      active: true
    }
  ];

  doctors: Doctor[] = [
    {
      id: '44444444-4444-4444-4444-444444444441',
      profile_id: '33333333-3333-3333-3333-333333333332',
      hospital_id: '11111111-1111-1111-1111-111111111111',
      license_number: 'MD-LIC-98421',
      specialty: 'Cardiology & Interventional Care',
      bio: 'Senior Cardiologist specializing in acute coronary triage & preventive cardiology.',
      is_available: true,
      department_ids: ['22222222-2222-2222-2222-222222222222'],
      created_at: new Date().toISOString()
    },
    {
      id: '44444444-4444-4444-4444-444444444442',
      profile_id: '33333333-3333-3333-3333-333333333333',
      hospital_id: '11111111-1111-1111-1111-111111111111',
      license_number: 'MD-LIC-87312',
      specialty: 'Internal Medicine & Diabetology',
      bio: 'Consultant Physician with expertise in complex metabolic and chronic conditions.',
      is_available: true,
      department_ids: ['22222222-2222-2222-2222-222222222221'],
      created_at: new Date().toISOString()
    },
    {
      id: '44444444-4444-4444-4444-444444444443',
      profile_id: '33333333-3333-3333-3333-333333333334',
      hospital_id: '11111111-1111-1111-1111-111111111111',
      license_number: 'MD-LIC-65190',
      specialty: 'General Medicine & Urgent Care',
      bio: 'Acute care lead responsible for urgent triage workflows and multidisciplinary care.',
      is_available: true,
      department_ids: ['22222222-2222-2222-2222-222222222221'],
      created_at: new Date().toISOString()
    }
  ];

  patients: Patient[] = [
    {
      id: '55555555-5555-5555-5555-555555555551',
      profile_id: '33333333-3333-3333-3333-333333333341',
      date_of_birth: '1985-04-12',
      gender: 'Male',
      blood_group: 'O+',
      emergency_contact_name: 'Pooja Kumar',
      emergency_contact_phone: '+1 (555) 400-9901',
      address: '742 Evergreen Terrace, Springfield',
      created_at: new Date().toISOString()
    },
    {
      id: '55555555-5555-5555-5555-555555555552',
      profile_id: '33333333-3333-3333-3333-333333333342',
      date_of_birth: '1972-09-24',
      gender: 'Female',
      blood_group: 'B+',
      emergency_contact_name: 'Ramesh Sharma',
      emergency_contact_phone: '+1 (555) 400-9902',
      address: '12 Gandhi Road, Pune',
      created_at: new Date().toISOString()
    },
    {
      id: '55555555-5555-5555-5555-555555555553',
      profile_id: '33333333-3333-3333-3333-333333333343',
      date_of_birth: '1991-11-03',
      gender: 'Male',
      blood_group: 'A+',
      emergency_contact_name: 'Sneha Kulkarni',
      emergency_contact_phone: '+1 (555) 400-9903',
      address: '45 Shivaji Nagar, Mumbai',
      created_at: new Date().toISOString()
    }
  ];

  appointments: Appointment[] = [
    {
      id: '88888888-8888-8888-8888-888888888881',
      patient_id: '55555555-5555-5555-5555-555555555551',
      doctor_id: '44444444-4444-4444-4444-444444444441',
      department_id: '22222222-2222-2222-2222-222222222222',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '10:30',
      status: 'IN_PROGRESS',
      reason: 'Recurrent palpitations and exertional dyspnea.',
      priority: 'REVIEW_REQUIRED',
      patient_name: 'Arav Kumar',
      doctor_name: 'Dr. Rajesh Patel, MD',
      department_name: 'Cardiology & Vascular Health',
      created_at: new Date().toISOString()
    },
    {
      id: '88888888-8888-8888-8888-888888888882',
      patient_id: '55555555-5555-5555-5555-555555555552',
      doctor_id: '44444444-4444-4444-4444-444444444442',
      department_id: '22222222-2222-2222-2222-222222222221',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '11:00',
      status: 'CONFIRMED',
      reason: 'Quarterly diabetic checkup and elevated fasting blood glucose.',
      priority: 'ROUTINE',
      patient_name: 'Sunita Sharma',
      doctor_name: 'Dr. Ananya Sharma, MD',
      department_name: 'General & Internal Medicine',
      created_at: new Date().toISOString()
    }
  ];

  queue: QueueEntry[] = [
    {
      id: '99999999-9999-9999-9999-999999999991',
      appointment_id: '88888888-8888-8888-8888-888888888881',
      patient_id: '55555555-5555-5555-5555-555555555551',
      department_id: '22222222-2222-2222-2222-222222222222',
      doctor_id: '44444444-4444-4444-4444-444444444441',
      queue_number: 101,
      status: 'WITH_DOCTOR',
      priority: 'REVIEW_REQUIRED',
      check_in_time: new Date(Date.now() - 25 * 60000).toISOString(),
      estimated_wait_minutes: 0,
      patient_name: 'Arav Kumar',
      doctor_name: 'Dr. Rajesh Patel, MD',
      department_name: 'Cardiology & Vascular Health'
    },
    {
      id: '99999999-9999-9999-9999-999999999992',
      appointment_id: '88888888-8888-8888-8888-888888888882',
      patient_id: '55555555-5555-5555-5555-555555555552',
      department_id: '22222222-2222-2222-2222-222222222221',
      doctor_id: '44444444-4444-4444-4444-444444444442',
      queue_number: 102,
      status: 'WAITING',
      priority: 'ROUTINE',
      check_in_time: new Date(Date.now() - 10 * 60000).toISOString(),
      estimated_wait_minutes: 15,
      patient_name: 'Sunita Sharma',
      doctor_name: 'Dr. Ananya Sharma, MD',
      department_name: 'General & Internal Medicine'
    }
  ];

  models: ModelRegistryItem[] = [
    {
      id: '66666666-6666-6666-6666-666666666661',
      name: 'Gemini 1.5 Flash (Clinical NLP)',
      provider: 'gemini',
      model_name: 'gemini-1.5-flash',
      task_types: ['clinical_summarization', 'symptom_extraction', 'intent_classification'],
      input_types: ['text', 'json'],
      cost_type: 'FREE_TIER',
      availability: 'ONLINE',
      priority: 1,
      max_context: 1000000,
      supports_vision: true,
      supports_audio: false,
      supports_tools: true,
      enabled: true
    },
    {
      id: '66666666-6666-6666-6666-666666666662',
      name: 'Gemini Multimodal Vision',
      provider: 'gemini',
      model_name: 'gemini-1.5-flash-vision',
      task_types: ['medical_document_ocr', 'lab_report_extraction'],
      input_types: ['image', 'pdf'],
      cost_type: 'FREE_TIER',
      availability: 'ONLINE',
      priority: 1,
      max_context: 1000000,
      supports_vision: true,
      supports_audio: false,
      supports_tools: false,
      enabled: true
    },
    {
      id: '66666666-6666-6666-6666-666666666663',
      name: 'Groq Llama-3 70B (Fast Triage)',
      provider: 'groq',
      model_name: 'llama-3.3-70b-versatile',
      task_types: ['fast_classification', 'intent_routing'],
      input_types: ['text'],
      cost_type: 'FREE_TIER',
      availability: 'ONLINE',
      priority: 2,
      max_context: 8192,
      supports_vision: false,
      supports_audio: false,
      supports_tools: true,
      enabled: true
    },
    {
      id: '66666666-6666-6666-6666-666666666664',
      name: 'Hugging Face BioBERT (Clinical NER)',
      provider: 'huggingface',
      model_name: 'dmis-lab/biobert-v1.1',
      task_types: ['medical_entity_extraction', 'clinical_triage'],
      input_types: ['text'],
      cost_type: 'FREE_TIER',
      availability: 'ONLINE',
      priority: 3,
      max_context: 512,
      supports_vision: false,
      supports_audio: false,
      supports_tools: false,
      enabled: true
    },
    {
      id: '66666666-6666-6666-6666-666666666665',
      name: 'Deterministic Mock Provider (Offline Fallback)',
      provider: 'mock',
      model_name: 'deterministic-clinical-v1',
      task_types: ['clinical_summarization', 'medical_document_ocr', 'intent_classification', 'translation'],
      input_types: ['text', 'image', 'pdf', 'audio'],
      cost_type: 'FREE_TIER',
      availability: 'ONLINE',
      priority: 4,
      max_context: 4096,
      supports_vision: true,
      supports_audio: true,
      supports_tools: true,
      enabled: true
    }
  ];

  clinicalRules: ClinicalRule[] = [
    {
      id: '77777777-7777-7777-7777-777777777771',
      name: 'Acute Coronary Syndrome Alert',
      category: 'EMERGENCY',
      conditions: [
        { field: 'symptom', operator: 'contains_any', values: ['chest pain', 'radiating to arm', 'crushing chest', 'jaw pain'] }
      ],
      severity: 'URGENT_REVIEW',
      action: 'Flag immediate emergency alert, recommend urgent ER attendance, notify cardiologist on call.',
      active: true
    },
    {
      id: '77777777-7777-7777-7777-777777777772',
      name: 'Critical Hyperglycemia / Lab Alert',
      category: 'LAB_ALERT',
      conditions: [
        { field: 'blood_glucose', operator: '>', values: [300] }
      ],
      severity: 'REVIEW_REQUIRED',
      action: 'Flag high laboratory glucose finding for clinician verification and diabetic review.',
      active: true
    },
    {
      id: '77777777-7777-7777-7777-777777777773',
      name: 'Acute Respiratory Distress',
      category: 'EMERGENCY',
      conditions: [
        { field: 'symptom', operator: 'contains_any', values: ['severe shortness of breath', 'gasping', 'cyanosis', 'stridor'] }
      ],
      severity: 'URGENT_REVIEW',
      action: 'Display immediate 911 / emergency protocol banner and trigger hospital triage alert.',
      active: true
    }
  ];

  documents: MedicalDocument[] = [
    {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      patient_id: '55555555-5555-5555-5555-555555555551',
      file_name: 'CBC_Lipid_Panel_Report_2026.pdf',
      file_url: '/sample-reports/cbc_lipid_panel.pdf',
      file_type: 'application/pdf',
      file_size_bytes: 245000,
      document_type: 'LAB_REPORT',
      status: 'ANALYZED',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];

  extractions: Record<string, StructuredExtraction> = {
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa': {
      documentType: 'Lipid Profile & Complete Blood Count',
      patientName: 'Arav Kumar',
      date: '2026-09-28',
      testName: 'Comprehensive Metabolic & Lipid Panel',
      observations: [
        'Total cholesterol elevated significantly above target limit (242 mg/dL).',
        'LDL cholesterol is in high risk range (165 mg/dL).',
        'HDL cholesterol is borderline low (38 mg/dL).',
        'Hematology indices (Hemoglobin, Platelets) are within standard clinical limits.'
      ],
      parameters: [
        { name: 'Hemoglobin', value: '13.8', unit: 'g/dL', ref_range: '13.5 - 17.5', abnormal: false },
        { name: 'Total Cholesterol', value: '242', unit: 'mg/dL', ref_range: '< 200', abnormal: true, flag: 'HIGH' },
        { name: 'Triglycerides', value: '195', unit: 'mg/dL', ref_range: '< 150', abnormal: true, flag: 'ELEVATED' },
        { name: 'HDL Cholesterol', value: '38', unit: 'mg/dL', ref_range: '> 40', abnormal: true, flag: 'LOW' },
        { name: 'LDL Cholesterol', value: '165', unit: 'mg/dL', ref_range: '< 100', abnormal: true, flag: 'HIGH' },
        { name: 'Platelets', value: '280,000', unit: '/mcL', ref_range: '150,000 - 450,000', abnormal: false }
      ],
      abnormalFlags: ['Total Cholesterol: HIGH (242)', 'LDL: HIGH (165)', 'Triglycerides: ELEVATED (195)', 'HDL: LOW (38)'],
      confidence: 0.96,
      summary: 'Lipid panel indicates marked hypercholesterolemia and dyslipidemia. Complete blood count parameters are normal.'
    }
  };

  safetyEvents: SafetyEvent[] = [
    {
      id: 'se-001',
      patient_id: '55555555-5555-5555-5555-555555555551',
      session_id: 'sess-001',
      severity: 'REVIEW_REQUIRED',
      trigger: 'Elevated lipid markers + exertional shortness of breath',
      source: 'Orchestrator Safety Guardrail',
      action_taken: 'Flagged for Cardiology Clinician Review',
      human_review_required: true,
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  ];

  doctorReviews: DoctorReview[] = [
    {
      id: 'rev-001',
      patient_id: '55555555-5555-5555-5555-555555555551',
      doctor_id: '44444444-4444-4444-4444-444444444441',
      decision: 'VERIFIED',
      notes: 'Reviewed AI-extracted lipid panel. High LDL confirmed. Initiating Statin therapy and scheduling echocardiogram.',
      verified: true,
      created_at: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  orchestrationLogs: Array<{
    runId: string;
    timestamp: string;
    intent: string;
    selectedModel: string;
    totalLatencyMs: number;
    confidence: number;
    severity: string;
    fallbackUsed: boolean;
    status: string;
    steps: OrchestrationStepTrace[];
  }> = [];
}

// Global singleton instance
const globalForStore = global as unknown as { mockDataStoreInstance?: MockDataStore };
export const mockStore = globalForStore.mockDataStoreInstance || new MockDataStore();
if (process.env.NODE_ENV !== 'production') globalForStore.mockDataStoreInstance = mockStore;
