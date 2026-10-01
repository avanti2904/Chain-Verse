# CareOrchestrate AI: Healthcare AI Model Orchestration Platform

> **"One healthcare system. Multiple specialized AI models. One intelligent orchestration layer."**

CareOrchestrate is a modular, production-ready, hackathon-tested healthcare AI orchestration platform. It acts as an intelligent coordination layer between patients, doctors, hospitals, AI models, clinical documents, voice streams, appointment systems, and clinical decision-support rules.

The platform **never** claims to autonomously diagnose diseases, prescribe medication, or replace clinical judgement. AI assists with summarization, triage routing, parameter extraction, and risk flagging while final clinical decisions remain strictly with qualified clinicians.

---

## Key Features

1. **Intelligent Orchestration Kernel (`/lib/orchestrator`)**:
   - Deterministic task routing (bypasses LLMs for routine appointment booking, cancellation, and queue lookups).
   - Dynamic Model Selector matching tasks to providers based on capability, priority, latency, and cost.
   - 3-tier cascade fallback: Primary (Gemini/Groq) → Secondary (HuggingFace) → Offline Deterministic Mock.
   - Multi-factor confidence scoring and human escalation gates.

2. **Safety Layer & Clinical Guardrails (`/lib/safety`, `/lib/clinical`)**:
   - Deterministic emergency symptom regex/rule evaluation for acute red-flag presentations (e.g. myocardial infarction, anaphylaxis, severe dyspnea).
   - Configurable clinical rule evaluator (`LOW_PRIORITY`, `ROUTINE`, `REVIEW_REQUIRED`, `URGENT_REVIEW`).
   - Output validator stripping overconfident diagnostic language.
   - Non-diagnostic clinical transparency disclaimers across all AI outputs.

3. **Pluggable Provider Abstraction Layer (`/lib/providers`)**:
   - LLMs: Google Gemini 1.5 Flash, Groq Cloud (Llama-3.3 70B), HuggingFace Inference API, Deterministic Mock.
   - Document & Vision: Gemini 1.5 Flash Multimodal Vision & Mock OCR extractor.
   - Voice: Native Browser Web Speech API & Whisper-compatible adapter.
   - Localization: Multilingual pipeline supporting English, Hindi (`हिंदी`), and Marathi (`मराठी`).

4. **Dedicated Role Portals**:
   - **Patient Portal**: Conversational triage, microphone voice input, medical lab report upload, appointment scheduling, and live queue tracking.
   - **Doctor Clinical Workstation**: Live clinic queue, safety alert banner, side-by-side comparison of **Patient Reported** vs. **AI Extracted** findings, and 1-click clinical verification.
   - **Hospital Admin Console**: Real-time visual DAG execution trace monitor, AI model registry configuration (toggle enable/disable, priority re-ranking), and dynamic clinical rule editor.

5. **100% Offline `DEMO_MODE`**:
   - Operates completely offline without requiring any external paid API keys or cloud database setup.

---

## 3-Minute Hackathon Evaluation Walkthrough

Follow this clinical scenario:

1. **Step 1: Patient Multilingual Selection**:
   - Navigate to the [Patient Portal](http://localhost:3000/patient).
   - Select **हिंदी** or **मराठी** in the language switcher.
2. **Step 2: Voice or Text Symptom Query**:
   - Click the microphone icon to speak, or click the quick chip: *"I have severe chest pain radiating to my left arm and shortness of breath."*
   - Click **Send**.
3. **Step 3: Deterministic Emergency Detection**:
   - Notice the red emergency alert banner: The orchestrator deterministically bypasses LLM guessing and triggers emergency cardiac triage.
4. **Step 4: Report Upload & Parameter Extraction**:
   - Click the **Upload Lab Report / OCR** tab.
   - Click on the pre-loaded fictional report: `CBC_Lipid_Panel_Report_2026.pdf`.
   - The multimodal pipeline extracts Total Cholesterol (242 mg/dL [HIGH]), LDL (165 mg/dL [HIGH]), and Triglycerides (195 mg/dL [ELEVATED]) without fabricating data.
5. **Step 5: Doctor Workstation Inspection**:
   - Navigate to the [Doctor Workstation](http://localhost:3000/doctor).
   - Observe the Safety Alert banner and open **Arav Kumar's** clinical chart.
   - Clearly view findings tagged as **PATIENT REPORTED**, **AI EXTRACTED (Unverified)**, and **AI GENERATED SUMMARY**.
6. **Step 6: Clinician Verification & Electronic Stamp**:
   - In the verification panel, select **Verify AI Findings**, enter doctor notes, and click **Sign & Clinically Verify Record**.
   - The record status dynamically updates to **CLINICALLY VERIFIED by Dr. Rajesh Patel, MD**.
7. **Step 7: Admin Visual Orchestration DAG Monitor**:
   - Navigate to the [Admin Console](http://localhost:3000/admin).
   - Inspect the visual 7-node DAG trace displaying model name, latency in milliseconds, confidence score, and fallback status.

---

## Technology Stack

- **Framework**: Next.js 15 (App Router, Server Actions, API Routes)
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Database**: Supabase PostgreSQL (28 Relational Tables, RLS, Indexes) + In-Memory Mock Store
- **AI/ML Layer**: Vendor-agnostic interfaces for Gemini, Groq, HuggingFace, Whisper, and Web Speech API
- **Validation**: Zod schema enforcement

---

## Setup & Running Locally

### 1. Prerequisites
- Node.js (v18+)
- npm or pnpm

### 2. Installation
```bash
git clone <repository-url>
cd "Model Orchestration"
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
To run with live API providers, add your free keys in `.env.local`:
- `GEMINI_API_KEY`: [Google AI Studio](https://aistudio.google.com/)
- `GROQ_API_KEY`: [Groq Cloud Console](https://console.groq.com/)
- `HUGGINGFACE_API_KEY`: [Hugging Face Settings](https://huggingface.co/settings/tokens)

> **Note**: If keys are left blank, the platform automatically activates `DEMO_MODE=true` using the deterministic clinical mock provider.

### 4. Running the Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Demo Credentials & Profiles

| Role | Name | Email | Specialty / Function |
| :--- | :--- | :--- | :--- |
| **Hospital Admin** | Dr. Sarah Chen, MD | `admin@metrohospital.org` | Chief Medical Officer |
| **Doctor** | Dr. Rajesh Patel, MD | `dr.patel@metrohospital.org` | Cardiology & Vascular Health |
| **Doctor** | Dr. Ananya Sharma, MD | `dr.sharma@metrohospital.org` | Internal Medicine & Diabetology |
| **Doctor** | Dr. Vikram Deshmukh, MD | `dr.deshmukh@metrohospital.org` | General Medicine & Urgent Care |
| **Patient** | Arav Kumar | `arav.kumar.demo@example.com` | Outpatient (Hypertension, Lipid Risk) |
| **Patient** | Sunita Sharma | `sunita.sharma.demo@example.com` | Outpatient (Type 2 Diabetes) |
| **Patient** | Rohit Kulkarni | `rohit.kulkarni.demo@example.com` | Outpatient (Marathi speaker) |

---

## Database Migrations & Supabase Setup

If connecting to an external Supabase project:
1. Open the Supabase SQL Editor.
2. Execute [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) to create all 28 tables, RLS policies, and indexes.
3. Execute [`supabase/seed.sql`](./supabase/seed.sql) to seed fictional demo data.
4. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`.

---

## Known Limitations & Future Scalability

1. **Audio File Streaming**: Currently uses client-side Web Speech API and base64 Whisper transcription. Future roadmap includes bi-directional WebSocket audio streaming using Gemini Live API.
2. **DICOM Viewer**: Medical document extraction currently parses PDF and image-converted radiology reports. Full volumetric DICOM viewing is planned for Phase 2.
3. **FHIR / HL7 Interoperability**: Schema maps to FHIR R4 resources (`Patient`, `Encounter`, `Observation`, `DiagnosticReport`), ready for SMART-on-FHIR hospital EHR integration.
