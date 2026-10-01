-- ============================================================================
-- Healthcare AI Model Orchestration Platform
-- Database Seed Data (Fictional Demo Data Only)
-- 5 Fictional Patients, 3 Doctors, 2 Departments, Appointments, Rules, Models
-- ============================================================================

-- 1. Hospital
INSERT INTO hospitals (id, name, code, address, phone, emergency_phone)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Metro Apex General Hospital',
  'MAGH-01',
  '100 Healthcare Parkway, Medical District, Suite 500',
  '+1 (555) 234-5678',
  '+1 (555) 911-0000'
) ON CONFLICT DO NOTHING;

-- 2. Departments
INSERT INTO departments (id, hospital_id, name, code, description, active)
VALUES 
(
  '22222222-2222-2222-2222-222222222221',
  '11111111-1111-1111-1111-111111111111',
  'General & Internal Medicine',
  'GEN-MED',
  'Primary adult care, comprehensive triage, chronic disease management',
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Cardiology & Vascular Health',
  'CARD-01',
  'Cardiac evaluation, ECG interpretation, hypertension, chest pain triage',
  true
) ON CONFLICT DO NOTHING;

-- 3. User Profiles (Admins, Doctors, Patients)
-- Hospital Admin
INSERT INTO profiles (id, email, full_name, role, phone, preferred_language)
VALUES (
  '33333333-3333-3333-3333-333333333331',
  'admin@metrohospital.org',
  'Dr. Sarah Chen, MD (Chief Medical Officer & Admin)',
  'HOSPITAL_ADMIN',
  '+1 (555) 300-0001',
  'en'
) ON CONFLICT DO NOTHING;

-- Doctors
INSERT INTO profiles (id, email, full_name, role, phone, preferred_language)
VALUES 
(
  '33333333-3333-3333-3333-333333333332',
  'dr.patel@metrohospital.org',
  'Dr. Rajesh Patel, MD',
  'DOCTOR',
  '+1 (555) 300-0002',
  'en'
),
(
  '33333333-3333-3333-3333-333333333333',
  'dr.sharma@metrohospital.org',
  'Dr. Ananya Sharma, MD',
  'DOCTOR',
  '+1 (555) 300-0003',
  'hi'
),
(
  '33333333-3333-3333-3333-333333333334',
  'dr.deshmukh@metrohospital.org',
  'Dr. Vikram Deshmukh, MD',
  'DOCTOR',
  '+1 (555) 300-0004',
  'mr'
) ON CONFLICT DO NOTHING;

-- Patients Profiles (5 Fictional Patients)
INSERT INTO profiles (id, email, full_name, role, phone, preferred_language)
VALUES 
(
  '33333333-3333-3333-3333-333333333341',
  'arav.kumar.demo@example.com',
  'Arav Kumar',
  'PATIENT',
  '+1 (555) 400-0001',
  'en'
),
(
  '33333333-3333-3333-3333-333333333342',
  'sunita.sharma.demo@example.com',
  'Sunita Sharma',
  'PATIENT',
  '+1 (555) 400-0002',
  'hi'
),
(
  '33333333-3333-3333-3333-333333333343',
  'rohit.kulkarni.demo@example.com',
  'Rohit Kulkarni',
  'PATIENT',
  '+1 (555) 400-0003',
  'mr'
),
(
  '33333333-3333-3333-3333-333333333344',
  'meera.nair.demo@example.com',
  'Meera Nair',
  'PATIENT',
  '+1 (555) 400-0004',
  'en'
),
(
  '33333333-3333-3333-3333-333333333345',
  'david.miller.demo@example.com',
  'David Miller',
  'PATIENT',
  '+1 (555) 400-0005',
  'en'
) ON CONFLICT DO NOTHING;

-- 4. Doctors Entities
INSERT INTO doctors (id, profile_id, hospital_id, license_number, specialty, bio, is_available)
VALUES 
(
  '44444444-4444-4444-4444-444444444441',
  '33333333-3333-3333-3333-333333333332',
  '11111111-1111-1111-1111-111111111111',
  'MD-LIC-98421',
  'Cardiology & Interventional Care',
  'Senior Cardiologist with 14 years clinical experience in acute coronary care and heart failure management.',
  true
),
(
  '44444444-4444-4444-4444-444444444442',
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'MD-LIC-87312',
  'Internal Medicine & Diabetology',
  'Consultant Physician specializing in metabolic disorders, preventative health, and multi-morbidity care.',
  true
),
(
  '44444444-4444-4444-4444-444444444443',
  '33333333-3333-3333-3333-333333333334',
  '11111111-1111-1111-1111-111111111111',
  'MD-LIC-65190',
  'General Medicine & Urgent Care Triage',
  'Acute medicine lead overseeing urgent outpatient triage and clinical escalation protocols.',
  true
) ON CONFLICT DO NOTHING;

-- Doctor Department Junction
INSERT INTO doctor_departments (doctor_id, department_id, is_primary)
VALUES 
('44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222', true),
('44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222221', true),
('44444444-4444-4444-4444-444444444443', '22222222-2222-2222-2222-222222222221', true)
ON CONFLICT DO NOTHING;

-- 5. Patients Entities
INSERT INTO patients (id, profile_id, date_of_birth, gender, blood_group, emergency_contact_name, emergency_contact_phone, address)
VALUES 
(
  '55555555-5555-5555-5555-555555555551',
  '33333333-3333-3333-3333-333333333341',
  '1985-04-12',
  'Male',
  'O+',
  'Pooja Kumar',
  '+1 (555) 400-9901',
  '742 Evergreen Terrace, Springfield'
),
(
  '55555555-5555-5555-5555-555555555552',
  '33333333-3333-3333-3333-333333333342',
  '1972-09-24',
  'Female',
  'B+',
  'Ramesh Sharma',
  '+1 (555) 400-9902',
  '12 Gandhi Road, Pune'
),
(
  '55555555-5555-5555-5555-555555555553',
  '33333333-3333-3333-3333-333333333343',
  '1991-11-03',
  'Male',
  'A+',
  'Sneha Kulkarni',
  '+1 (555) 400-9903',
  '45 Shivaji Nagar, Mumbai'
),
(
  '55555555-5555-5555-5555-555555555554',
  '33333333-3333-3333-3333-333333333344',
  '1968-02-18',
  'Female',
  'AB-',
  'Vijay Nair',
  '+1 (555) 400-9904',
  '88 Marine Drive, Kochi'
),
(
  '55555555-5555-5555-5555-555555555555',
  '33333333-3333-3333-3333-333333333345',
  '1988-07-30',
  'Male',
  'O-',
  'Claire Miller',
  '+1 (555) 400-9905',
  '304 Maple Avenue, Denver'
) ON CONFLICT DO NOTHING;

-- 6. Model Registry (Pre-configured AI Providers)
INSERT INTO model_registry (id, name, provider, model_name, task_types, input_types, cost_type, availability, priority, max_context, supports_vision, supports_audio, supports_tools, enabled)
VALUES 
(
  '66666666-6666-6666-6666-666666666661',
  'Gemini 1.5 Flash (Clinical NLP)',
  'gemini',
  'gemini-1.5-flash',
  ARRAY['clinical_summarization', 'symptom_extraction', 'intent_classification'],
  ARRAY['text', 'json'],
  'FREE_TIER',
  'ONLINE',
  1,
  1000000,
  true,
  false,
  true,
  true
),
(
  '66666666-6666-6666-6666-666666666662',
  'Gemini Multimodal Vision',
  'gemini',
  'gemini-1.5-flash-vision',
  ARRAY['medical_document_ocr', 'lab_report_extraction'],
  ARRAY['image', 'pdf'],
  'FREE_TIER',
  'ONLINE',
  1,
  1000000,
  true,
  false,
  false,
  true
),
(
  '66666666-6666-6666-6666-666666666663',
  'Groq Llama-3 70B (Fast Triage)',
  'groq',
  'llama-3.3-70b-versatile',
  ARRAY['fast_classification', 'intent_routing'],
  ARRAY['text'],
  'FREE_TIER',
  'ONLINE',
  2,
  8192,
  false,
  false,
  true,
  true
),
(
  '66666666-6666-6666-6666-666666666664',
  'Hugging Face BioBERT (Embedding & Classification)',
  'huggingface',
  'dmis-lab/biobert-v1.1',
  ARRAY['medical_entity_extraction', 'clinical_triage'],
  ARRAY['text'],
  'FREE_TIER',
  'ONLINE',
  3,
  512,
  false,
  false,
  false,
  true
),
(
  '66666666-6666-6666-6666-666666666665',
  'Deterministic Mock Provider (Offline Fallback)',
  'mock',
  'deterministic-clinical-v1',
  ARRAY['clinical_summarization', 'medical_document_ocr', 'intent_classification', 'translation'],
  ARRAY['text', 'image', 'pdf', 'audio'],
  'FREE_TIER',
  'ONLINE',
  4,
  4096,
  true,
  true,
  true,
  true
) ON CONFLICT DO NOTHING;

-- 7. Configurable Clinical Rules
INSERT INTO clinical_rules (id, name, category, conditions, severity, action, active)
VALUES 
(
  '77777777-7777-7777-7777-777777777771',
  'Acute Coronary / Severe Chest Pain Alert',
  'EMERGENCY',
  '[{"field": "symptom", "operator": "contains_any", "values": ["chest pain", "radiating to left arm", "crushing pressure", "jaw pain", "angina"]}, {"field": "dyspnea", "operator": "is", "values": [true]}]'::jsonb,
  'URGENT_REVIEW',
  'Escalate immediately to emergency department protocol and display urgent care notice to patient.',
  true
),
(
  '77777777-7777-7777-7777-777777777772',
  'Critical Hyperglycemia / Ketoacidosis Warning',
  'LAB_ALERT',
  '[{"field": "fasting_blood_glucose", "operator": ">", "values": [350]}, {"field": "hba1c", "operator": ">", "values": [12.0]}]'::jsonb,
  'REVIEW_REQUIRED',
  'Notify attending diabetologist and schedule urgent clinic slot within 24 hours.',
  true
),
(
  '77777777-7777-7777-7777-777777777773',
  'Severe Acute Dyspnea & Respiratory Distress',
  'EMERGENCY',
  '[{"field": "symptom", "operator": "contains_any", "values": ["stridor", "cannot catch breath", "blue lips", "cyanosis", "severe shortness of breath"]}]'::jsonb,
  'URGENT_REVIEW',
  'Immediate clinician pager escalation and advise nearest emergency room attendance.',
  true
),
(
  '77777777-7777-7777-7777-777777777774',
  'Routine Preventative Health Checkup',
  'TRIAGE',
  '[{"field": "intent", "operator": "equals", "values": ["general_checkup", "wellness"]}]'::jsonb,
  'ROUTINE',
  'Direct to standard outpatient scheduling with General Medicine department.',
  true
) ON CONFLICT DO NOTHING;

-- 8. Sample Appointments & Waiting Queue
INSERT INTO appointments (id, patient_id, doctor_id, department_id, appointment_date, appointment_time, status, reason, priority)
VALUES 
(
  '88888888-8888-8888-8888-888888888881',
  '55555555-5555-5555-5555-555555555551',
  '44444444-4444-4444-4444-444444444441',
  '22222222-2222-2222-2222-222222222222',
  CURRENT_DATE,
  '10:30:00',
  'IN_PROGRESS',
  'Recurrent palpitation episodes and mild shortness of breath on exertion.',
  'REVIEW_REQUIRED'
),
(
  '88888888-8888-8888-8888-888888888882',
  '55555555-5555-5555-5555-555555555552',
  '44444444-4444-4444-4444-444444444442',
  '22222222-2222-2222-2222-222222222221',
  CURRENT_DATE,
  '11:00:00',
  'CONFIRMED',
  'Type 2 diabetes quarterly follow-up and recent elevated fasting glucose.',
  'ROUTINE'
),
(
  '88888888-8888-8888-8888-888888888883',
  '55555555-5555-5555-5555-555555555553',
  '44444444-4444-4444-4444-444444444443',
  '22222222-2222-2222-2222-222222222221',
  CURRENT_DATE,
  '11:30:00',
  'SCHEDULED',
  'Persistent dry cough for 3 weeks and evening low-grade fever.',
  'REVIEW_REQUIRED'
) ON CONFLICT DO NOTHING;

-- Queue Entries
INSERT INTO queue_entries (id, appointment_id, patient_id, department_id, doctor_id, queue_number, status, priority, estimated_wait_minutes)
VALUES 
(
  '99999999-9999-9999-9999-999999999991',
  '88888888-8888-8888-8888-888888888881',
  '55555555-5555-5555-5555-555555555551',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444441',
  101,
  'WITH_DOCTOR',
  'REVIEW_REQUIRED',
  0
),
(
  '99999999-9999-9999-9999-999999999992',
  '88888888-8888-8888-8888-888888888882',
  '55555555-5555-5555-5555-555555555552',
  '22222222-2222-2222-2222-222222222221',
  '44444444-4444-4444-4444-444444444442',
  102,
  'WAITING',
  'ROUTINE',
  15
),
(
  '99999999-9999-9999-9999-999999999993',
  '88888888-8888-8888-8888-888888888883',
  '55555555-5555-5555-5555-555555555553',
  '22222222-2222-2222-2222-222222222221',
  '44444444-4444-4444-4444-444444444443',
  103,
  'WAITING',
  'REVIEW_REQUIRED',
  35
) ON CONFLICT DO NOTHING;

-- 9. Sample Patient Medical History
INSERT INTO patient_medical_history (patient_id, category, title, details, diagnosed_year, status)
VALUES 
('55555555-5555-5555-5555-555555555551', 'CHRONIC_CONDITION', 'Essential Hypertension', 'Stage 1 hypertension managed with Telmisartan 40mg once daily.', 2021, 'ACTIVE'),
('55555555-5555-5555-5555-555555555551', 'ALLERGY', 'Penicillin Allergy', 'Developed urticarial rash in 2015. Avoid beta-lactams.', 2015, 'ACTIVE'),
('55555555-5555-5555-5555-555555555552', 'CHRONIC_CONDITION', 'Type 2 Diabetes Mellitus', 'Diet controlled + Metformin 500mg BD. Last HbA1c: 7.4%.', 2018, 'ACTIVE'),
('55555555-5555-5555-5555-555555555554', 'SURGERY', 'Cholecystectomy', 'Laparoscopic gallbladder removal without complications.', 2019, 'RESOLVED')
ON CONFLICT DO NOTHING;

-- 10. Sample Medical Document & Extraction
INSERT INTO medical_documents (id, patient_id, file_name, file_url, file_type, file_size_bytes, document_type, status)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '55555555-5555-5555-5555-555555555551',
  'CBC_Lipid_Panel_Report_2026.pdf',
  '/sample-reports/cbc_lipid_panel.pdf',
  'application/pdf',
  245000,
  'LAB_REPORT',
  'ANALYZED'
) ON CONFLICT DO NOTHING;

INSERT INTO document_extractions (id, document_id, extraction_type, raw_text, structured_data, confidence)
VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'LAB_PANEL_EXTRACTION',
  'METRO CLINICAL LAB - HEMATOLOGY & BIOCHEMISTRY\nHemoglobin: 13.8 g/dL (Ref: 13.5-17.5)\nTotal Cholesterol: 242 mg/dL [HIGH] (Ref: < 200)\nTriglycerides: 195 mg/dL [ELEVATED] (Ref: < 150)\nHDL: 38 mg/dL [LOW] (Ref: > 40)\nLDL: 165 mg/dL [HIGH] (Ref: < 100)\nPlatelet Count: 280,000 /mcL (Ref: 150,000-450,000)',
  '{
    "test_name": "Comprehensive Lipid Panel & Complete Blood Count",
    "collection_date": "2026-09-28",
    "laboratory": "Metro Clinical Diagnostics Laboratory",
    "parameters": [
      {"name": "Hemoglobin", "value": "13.8", "unit": "g/dL", "ref_range": "13.5 - 17.5", "abnormal": false},
      {"name": "Total Cholesterol", "value": "242", "unit": "mg/dL", "ref_range": "< 200", "abnormal": true, "flag": "HIGH"},
      {"name": "Triglycerides", "value": "195", "unit": "mg/dL", "ref_range": "< 150", "abnormal": true, "flag": "ELEVATED"},
      {"name": "HDL Cholesterol", "value": "38", "unit": "mg/dL", "ref_range": "> 40", "abnormal": true, "flag": "LOW"},
      {"name": "LDL Cholesterol", "value": "165", "unit": "mg/dL", "ref_range": "< 100", "abnormal": true, "flag": "HIGH"},
      {"name": "Platelets", "value": "280000", "unit": "/mcL", "ref_range": "150000 - 450000", "abnormal": false}
    ],
    "abnormal_findings_count": 4,
    "confidence_score": 0.96
  }'::jsonb,
  0.960
) ON CONFLICT DO NOTHING;
