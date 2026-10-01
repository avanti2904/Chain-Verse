// ============================================================================
// GET /api/doctor/alerts
// Active safety events and urgent review escalation feed for clinicians
// ============================================================================

import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';

export async function GET() {
  const alerts = mockStore.safetyEvents;
  const urgentCount = alerts.filter(a => a.severity === 'URGENT_REVIEW').length;

  return NextResponse.json({
    alerts,
    meta: {
      totalAlerts: alerts.length,
      urgentEscalations: urgentCount,
      requiresReview: alerts.filter(a => a.human_review_required).length
    }
  });
}
