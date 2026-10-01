// ============================================================================
// Clinical Context Manager
// Hydrates patient medical background and conversational memory
// ============================================================================

import { mockStore } from '@/lib/supabase/mock-store';

export interface HydratedPatientContext {
  patientId?: string;
  patientName?: string;
  chronicConditions: string[];
  allergies: string[];
  recentAppointments: string[];
  conversationSnippet: string;
}

export function hydrateClinicalContext(params: {
  patientId?: string;
  userId?: string;
  conversationContext?: Array<{ role: string; content: string }>;
}): HydratedPatientContext {
  const patient = params.patientId 
    ? mockStore.patients.find(p => p.id === params.patientId)
    : mockStore.patients[0]; // fallback default demo patient

  const profile = patient 
    ? mockStore.profiles.find(pr => pr.id === patient.profile_id)
    : undefined;

  const conversationSnippet = params.conversationContext
    ? params.conversationContext.slice(-4).map(c => `${c.role.toUpperCase()}: ${c.content}`).join('\n')
    : '';

  // Extract from mock store
  return {
    patientId: patient?.id,
    patientName: profile?.full_name || 'Arav Kumar',
    chronicConditions: ['Essential Hypertension (Stage 1)'],
    allergies: ['Penicillin Allergy (Urticaria)'],
    recentAppointments: ['Cardiology follow-up pending'],
    conversationSnippet
  };
}
