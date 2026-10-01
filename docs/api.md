# CareOrchestrate API Reference

All endpoints accept and return JSON. Endpoints enforce role authorization and input validation via Zod.

---

## 1. Master Orchestration

### `POST /api/orchestrate`
Primary entry point for patient interactions, symptom triage, document processing, and queue queries.

#### Request Body
```json
{
  "sessionId": "demo-session-patient-101",
  "patientId": "55555555-5555-5555-5555-555555555551",
  "role": "PATIENT",
  "inputType": "text",
  "message": "I have chest tightness and my arm hurts",
  "language": "en",
  "attachments": []
}
```

#### Response (200 OK)
```json
{
  "runId": "run-1727783921-9a4f2",
  "sessionId": "demo-session-patient-101",
  "intent": "EMERGENCY_FLAG",
  "status": "ESCALATED",
  "route": ["input_sanitizer", "emergency_guardrail", "emergency_escalation_protocol"],
  "selectedModel": "deterministic-emergency-protocol",
  "fallbackUsed": false,
  "confidence": 0.99,
  "totalLatencyMs": 32,
  "severity": "URGENT_REVIEW",
  "requiresHumanReview": true,
  "disclaimer": "Non-Diagnostic Clinical Disclaimer...",
  "result": {
    "message": "Potentially urgent information detected...",
    "safetyNotice": "EMERGENCY ALERT: Activate emergency cardiac triage..."
  },
  "steps": [...]
}
```

---

## 2. Document & Vision Processing

### `POST /api/ai/analyze-report`
Extracts structured parameters, reference ranges, and abnormal flags from PDF or image reports.

#### Request Body
```json
{
  "fileName": "CBC_Lipid_Panel_Report_2026.pdf",
  "patientId": "55555555-5555-5555-5555-555555555551"
}
```

#### Response (200 OK)
```json
{
  "documentId": "doc-1727783990",
  "extracted": {
    "documentType": "Hematology & Lipid Profile Panel",
    "patientName": "Arav Kumar",
    "testName": "Complete Blood Count & Comprehensive Lipid Profile",
    "parameters": [
      { "name": "Total Cholesterol", "value": "242", "unit": "mg/dL", "ref_range": "< 200", "abnormal": true, "flag": "HIGH" },
      { "name": "LDL Cholesterol", "value": "165", "unit": "mg/dL", "ref_range": "< 100", "abnormal": true, "flag": "HIGH" }
    ],
    "abnormalFlags": ["Total Cholesterol: 242 mg/dL [HIGH]", "LDL Cholesterol: 165 mg/dL [HIGH]"],
    "confidence": 0.96
  },
  "providerUsed": "Deterministic Medical Document Extraction Engine",
  "verified": false
}
```

---

## 3. Clinician Verification

### `POST /api/doctor/review`
Records formal physician review and converts unverified AI findings to Clinically Verified status.

#### Request Body
```json
{
  "patientId": "55555555-5555-5555-5555-555555555551",
  "doctorId": "44444444-4444-4444-4444-444444444441",
  "decision": "VERIFIED",
  "notes": "Correlated AI extraction with clinical complaints. Initiating Statin therapy.",
  "verified": true
}
```

---

## 4. Admin Management

- `GET /api/admin/models` - Lists all registered AI models.
- `PATCH /api/admin/models` - Updates model priority and enabled status.
- `GET /api/admin/rules` - Lists active clinical decision rules.
- `POST /api/admin/rules` - Creates a new deterministic clinical rule.
- `GET /api/admin/orchestration-logs` - Real-time observability and latency telemetry.
- `GET /api/system/health` - System status and provider availability check.
