# Healthcare AI Model Orchestration Platform: Technical Architecture

> **Core Philosophy**: *"One healthcare system. Multiple specialized AI models. One intelligent orchestration layer."*

---

## 1. System Topology

The CareOrchestrate platform decouples user interactions from underlying artificial intelligence models and external clinical systems. It is structured into 5 cohesive tiers:

1. **Presentation Tier**:
   - **Patient Portal**: Multilingual conversational intake, Web Speech API voice capture, medical document upload, and live waiting queue tracking.
   - **Doctor Workstation**: Clinical queue, side-by-side comparison of Patient Reported vs. AI Extracted findings, safety alert banner, and 1-click clinical verification.
   - **Admin Console**: Live visual Directed Acyclic Graph (DAG) orchestration monitor, AI model registry manager, and configurable clinical decision rules editor.

2. **Security & Gateway Boundary**:
   - Role-Based Access Control (`PATIENT`, `DOCTOR`, `HOSPITAL_ADMIN`).
   - Server-only API secrets isolation (zero secret leakage to browser bundles).
   - Strict input validation using Zod schemas.

3. **Orchestration Kernel (`/lib/orchestrator`)**:
   - **Deterministic Task Router**: Bypasses LLMs for routine workflows (appointments, queue status, cancellations).
   - **Clinical Context Manager**: Hydrates patient history, allergies, and conversational memory.
   - **Model Selector**: Matches tasks to models based on priority, capability, and availability.
   - **Cascade Fallback Controller**: Seamlessly degrades from primary (Gemini/Groq) to secondary (HuggingFace) to deterministic offline mock.
   - **Confidence & Uncertainty Scorer**: Deducts confidence for ambiguous symptoms or rule violations, triggering human escalation.

4. **Clinical Guardrails & Rules Engine (`/lib/safety`, `/lib/clinical`)**:
   - **Emergency Rules**: Scans for acute life-threatening symptoms (e.g., myocardial infarction, anaphylaxis, severe dyspnea, acute stroke).
   - **Configurable Clinical Rules**: Evaluates conditions to set severity (`LOW_PRIORITY`, `ROUTINE`, `REVIEW_REQUIRED`, `URGENT_REVIEW`).
   - **Output Validator & Hallucination Guard**: Replaces definitive diagnostic claims with safe probabilistic clinical observations.
   - **Mandatory Medical Disclaimer**: Appends non-diagnostic clinical transparency notices.

5. **Persistence Tier (`/lib/supabase`)**:
   - 28 PostgreSQL relational tables configured with Row Level Security (RLS), foreign keys, and indexes.
   - Stateful in-memory mock store (`mock-store.ts`) for zero-configuration, 100% offline hackathon execution (`DEMO_MODE=true`).

---

## 2. Pluggable Provider Abstraction Layer

The platform is vendor-independent. AI model providers are abstracted behind standard TypeScript interfaces:

- `AIProvider`: Text generation, intent classification, clinical pre-consultation summarization.
- `VisionProvider`: Medical report OCR, tabular parameter extraction, reference range checking.
- `SpeechProvider`: Speech-to-text conversion (Browser Web Speech API + Whisper adapter).
- `TranslationProvider`: Localization across English, Hindi, and Marathi with medical terminology preservation.

If any external API fails or is unconfigured, the system automatically falls back to deterministic logic without crashing.
