-- ============================================================================
-- Healthcare AI Model Orchestration Platform
-- Database Migration 001: Initial Schema
-- 28 Relational Tables with RLS, Foreign Keys, Indexes, and Constraints
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status AS ENUM ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE queue_status AS ENUM ('WAITING', 'CALLED', 'WITH_DOCTOR', 'COMPLETED', 'SKIPPED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE clinical_severity AS ENUM ('LOW_PRIORITY', 'ROUTINE', 'REVIEW_REQUIRED', 'URGENT_REVIEW');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'PATIENT',
  phone TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL UNIQUE,
  specialty TEXT NOT NULL,
  bio TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Doctor Departments (Junction)
CREATE TABLE IF NOT EXISTS doctor_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  is_primary BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(doctor_id, department_id)
);

-- 6. Patients Table
CREATE TABLE IF NOT EXISTS patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  date_of_birth DATE,
  gender TEXT,
  blood_group TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Appointment Slots Table
CREATE TABLE IF NOT EXISTS appointment_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_patients INT NOT NULL DEFAULT 1,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  slot_id UUID REFERENCES appointment_slots(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status NOT NULL DEFAULT 'SCHEDULED',
  reason TEXT,
  priority clinical_severity NOT NULL DEFAULT 'ROUTINE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Queue Entries Table
CREATE TABLE IF NOT EXISTS queue_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  queue_number INT NOT NULL,
  status queue_status NOT NULL DEFAULT 'WAITING',
  priority clinical_severity NOT NULL DEFAULT 'ROUTINE',
  check_in_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  estimated_wait_minutes INT NOT NULL DEFAULT 15,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Patient Sessions Table
CREATE TABLE IF NOT EXISTS patient_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  language TEXT NOT NULL DEFAULT 'en',
  channel TEXT NOT NULL DEFAULT 'WEB_TEXT',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 11. Conversation Messages Table
CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES patient_sessions(id) ON DELETE CASCADE,
  sender_role TEXT NOT NULL,
  message_text TEXT NOT NULL,
  original_language TEXT NOT NULL DEFAULT 'en',
  translated_text TEXT,
  audio_url TEXT,
  is_voice BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Patient Symptoms Table
CREATE TABLE IF NOT EXISTS patient_symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES patient_sessions(id) ON DELETE SET NULL,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  symptom_name TEXT NOT NULL,
  severity clinical_severity NOT NULL DEFAULT 'ROUTINE',
  duration_days INT,
  body_site TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Patient Medical History Table
CREATE TABLE IF NOT EXISTS patient_medical_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- 'ALLERGY', 'CHRONIC_CONDITION', 'MEDICATION', 'SURGERY'
  title TEXT NOT NULL,
  details TEXT,
  diagnosed_year INT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Medical Documents Table
CREATE TABLE IF NOT EXISTS medical_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  session_id UUID REFERENCES patient_sessions(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'LAB_REPORT', -- 'LAB_REPORT', 'PRESCRIPTION', 'IMAGING', 'DISCHARGE_SUMMARY'
  status TEXT NOT NULL DEFAULT 'UPLOADED', -- 'UPLOADED', 'PROCESSING', 'ANALYZED', 'ERROR'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Document Extractions Table
CREATE TABLE IF NOT EXISTS document_extractions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES medical_documents(id) ON DELETE CASCADE,
  extraction_type TEXT NOT NULL,
  raw_text TEXT,
  structured_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence NUMERIC(4,3) NOT NULL DEFAULT 0.000,
  extracted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. AI Summaries Table
CREATE TABLE IF NOT EXISTS ai_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES patient_sessions(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  subjective TEXT NOT NULL,
  objective TEXT,
  assessment_hints TEXT NOT NULL,
  plan_suggestions TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_by_doctor_id UUID REFERENCES doctors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. AI Tasks Table
CREATE TABLE IF NOT EXISTS ai_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES patient_sessions(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  input_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  priority clinical_severity NOT NULL DEFAULT 'ROUTINE',
  requested_capability TEXT NOT NULL,
  selected_model TEXT NOT NULL,
  fallback_model TEXT,
  confidence NUMERIC(4,3) DEFAULT 0.000,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

-- 18. AI Task Results Table
CREATE TABLE IF NOT EXISTS ai_task_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES ai_tasks(id) ON DELETE CASCADE,
  output_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  raw_response TEXT,
  token_count INT DEFAULT 0,
  latency_ms INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. Model Registry Table
CREATE TABLE IF NOT EXISTS model_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL, -- 'gemini', 'groq', 'huggingface', 'mock', 'browser_speech'
  model_name TEXT NOT NULL,
  task_types TEXT[] NOT NULL DEFAULT '{}',
  input_types TEXT[] NOT NULL DEFAULT '{}',
  cost_type TEXT NOT NULL DEFAULT 'FREE_TIER',
  availability TEXT NOT NULL DEFAULT 'ONLINE',
  priority INT NOT NULL DEFAULT 1,
  max_context INT NOT NULL DEFAULT 8192,
  supports_vision BOOLEAN NOT NULL DEFAULT false,
  supports_audio BOOLEAN NOT NULL DEFAULT false,
  supports_tools BOOLEAN NOT NULL DEFAULT false,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 20. Model Usage Table
CREATE TABLE IF NOT EXISTS model_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID REFERENCES model_registry(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL,
  latency_ms INT NOT NULL DEFAULT 0,
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'SUCCESS',
  error_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 21. Orchestration Runs Table
CREATE TABLE IF NOT EXISTS orchestration_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES patient_sessions(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  run_id TEXT NOT NULL UNIQUE,
  trigger_event TEXT NOT NULL,
  detected_intent TEXT NOT NULL,
  overall_status TEXT NOT NULL DEFAULT 'COMPLETED',
  total_latency_ms INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 22. Orchestration Steps Table
CREATE TABLE IF NOT EXISTS orchestration_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orchestration_run_id UUID NOT NULL REFERENCES orchestration_runs(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  component TEXT NOT NULL,
  input_reference TEXT,
  output_reference TEXT,
  status TEXT NOT NULL DEFAULT 'SUCCESS',
  latency_ms INT NOT NULL DEFAULT 0,
  confidence NUMERIC(4,3) DEFAULT 1.000,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 23. Clinical Rules Table
CREATE TABLE IF NOT EXISTS clinical_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'EMERGENCY', 'TRIAGE', 'DRUG_INTERACTION', 'LAB_ALERT'
  conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
  severity clinical_severity NOT NULL DEFAULT 'ROUTINE',
  action TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 24. Safety Events Table
CREATE TABLE IF NOT EXISTS safety_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  session_id UUID REFERENCES patient_sessions(id) ON DELETE CASCADE,
  severity clinical_severity NOT NULL DEFAULT 'URGENT_REVIEW',
  trigger TEXT NOT NULL,
  source TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  human_review_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 25. Doctor Reviews Table
CREATE TABLE IF NOT EXISTS doctor_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  ai_task_id UUID REFERENCES ai_tasks(id) ON DELETE SET NULL,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  decision TEXT NOT NULL, -- 'VERIFIED', 'MODIFIED', 'REJECTED'
  notes TEXT,
  verified BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 26. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'INFO',
  is_read BOOLEAN NOT NULL DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 27. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  actor_role TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 28. Consents Table
CREATE TABLE IF NOT EXISTS consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL DEFAULT 'AI_ASSISTED_TRIAGE',
  granted BOOLEAN NOT NULL DEFAULT true,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT
);

-- ============================================================================
-- Indexes for High-Performance Clinical Queries
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_patients_profile ON patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_doctors_hospital ON doctors(hospital_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_queue_dept_status ON queue_entries(department_id, status);
CREATE INDEX IF NOT EXISTS idx_queue_patient ON queue_entries(patient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_patient ON patient_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_messages_session ON conversation_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_docs_patient ON medical_documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_session ON ai_tasks(session_id);
CREATE INDEX IF NOT EXISTS idx_orch_runs_session ON orchestration_runs(session_id);
CREATE INDEX IF NOT EXISTS idx_orch_steps_run ON orchestration_steps(orchestration_run_id);
CREATE INDEX IF NOT EXISTS idx_safety_patient ON safety_events(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- ============================================================================
-- Row Level Security (RLS) Setup
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE queue_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_extractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch current profile role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
BEGIN
  RETURN (
    SELECT role FROM profiles
    WHERE auth_user_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users see own, Admins & Doctors can see relevant
CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT USING (auth_user_id = auth.uid() OR get_current_user_role() IN ('HOSPITAL_ADMIN', 'DOCTOR'));

-- Patients: Patient reads own, Clinicians read all in hospital
CREATE POLICY "Patient reads own data" ON patients
  FOR SELECT USING (
    profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
    OR get_current_user_role() IN ('DOCTOR', 'HOSPITAL_ADMIN')
  );

-- Appointments: Patients read own, Doctors read assigned, Admins read all
CREATE POLICY "Appointments access" ON appointments
  FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()))
    OR doctor_id IN (SELECT id FROM doctors WHERE profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()))
    OR get_current_user_role() = 'HOSPITAL_ADMIN'
  );

-- Medical Documents: Patient & Doctor access
CREATE POLICY "Medical docs access" ON medical_documents
  FOR ALL USING (
    patient_id IN (SELECT id FROM patients WHERE profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()))
    OR get_current_user_role() IN ('DOCTOR', 'HOSPITAL_ADMIN')
  );

-- Audit logs: Admins only
CREATE POLICY "Admin audit log access" ON audit_logs
  FOR SELECT USING (get_current_user_role() = 'HOSPITAL_ADMIN');
