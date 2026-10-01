# Orchestrator & Task Routing Engine

## 1. Deterministic vs. AI-Assisted Routing

A key architectural flaw of superficial healthcare chatbot demos is routing every single request to a large language model. This causes high latency, unnecessary cost, potential hallucinations, and clinical safety risks.

CareOrchestrate enforces a **deterministic-first** routing strategy:

```
User Input
    │
    ▼
Input Sanitizer & Token Limits
    │
    ▼
Emergency Guardrail (Deterministic Regex & Keyword Scan)
    │  ├─ Acute Red-Flag Match ──► Immediate Emergency Escalation & Safe Notice
    │
    ▼
Multimodal Document Detector
    │  ├─ Attachment is PDF/Image ──► Vision / OCR Extraction Pipeline
    │
    ▼
Task Router & Intent Classifier
    │  ├─ Appointment Intent ─────► Deterministic Appointment Scheduling Service
    │  ├─ Queue / Wait Time ──────► Deterministic Live Queue Service
    │  └─ Symptoms / Medical ─────► Clinical NLP Pipeline
    │
    ▼
Clinical Rule Engine (Scores Severity: ROUTINE / REVIEW_REQUIRED / URGENT_REVIEW)
    │
    ▼
Specialized Model Worker (Gemini 1.5 Flash / Groq Llama-3 / Mock Fallback)
    │
    ▼
Output Validator & Hallucination Guard (Enforces Non-Diagnostic Phrasing)
    │
    ▼
Multi-Factor Confidence & Human Escalation Gate
    │
    ▼
Doctor Workstation Queue (Clinician Review & Verification)
```

---

## 2. Multi-Provider Fallback Cascade

To ensure 99.99% system availability even during external API downtime or rate limits, the orchestrator implements a three-tier cascade:

1. **Tier 1 (Primary Model)**: Google Gemini 1.5 Flash (free tier) or Groq Llama-3.3 70B.
2. **Tier 2 (Secondary Fallback)**: HuggingFace Inference API.
3. **Tier 3 (Deterministic Offline Mock)**: Local deterministic clinical NLP engine (`MockAIProvider`). Runs with 0 API keys and guarantees hackathon judges can test all workflows offline.
