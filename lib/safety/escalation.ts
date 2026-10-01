// ============================================================================
// Clinical Escalation & Safety Incident Handler
// Records safety events and dispatches alerts to the doctor queue
// ============================================================================

import { SafetyEvent, ClinicalSeverity } from '@/types';
import { mockStore } from '@/lib/supabase/mock-store';

export async function recordSafetyEscalation(params: {
  sessionId: string;
  patientId?: string;
  severity: ClinicalSeverity;
  trigger: string;
  source: string;
  actionTaken: string;
  humanReviewRequired: boolean;
}): Promise<SafetyEvent> {
  const event: SafetyEvent = {
    id: `safe-evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    session_id: params.sessionId,
    patient_id: params.patientId,
    severity: params.severity,
    trigger: params.trigger,
    source: params.source,
    action_taken: params.actionTaken,
    human_review_required: params.humanReviewRequired,
    created_at: new Date().toISOString()
  };

  // Persist into mock store
  mockStore.safetyEvents.unshift(event);

  // If patient has an appointment, escalate its priority to URGENT_REVIEW or REVIEW_REQUIRED
  if (params.patientId) {
    const apt = mockStore.appointments.find(a => a.patient_id === params.patientId);
    if (apt) {
      apt.priority = params.severity;
    }
    const q = mockStore.queue.find(item => item.patient_id === params.patientId);
    if (q) {
      q.priority = params.severity;
    }
  }

  return event;
}
