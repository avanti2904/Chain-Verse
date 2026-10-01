// ============================================================================
// /api/queue
// Real-time clinic queue tracking and patient wait-time estimation
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const departmentId = searchParams.get('departmentId');
  const patientId = searchParams.get('patientId');

  let list = mockStore.queue;
  if (departmentId) {
    list = list.filter(q => q.department_id === departmentId);
  }
  if (patientId) {
    list = list.filter(q => q.patient_id === patientId);
  }

  // Count active waiting
  const waitingCount = list.filter(q => q.status === 'WAITING').length;
  const inConsultCount = list.filter(q => q.status === 'WITH_DOCTOR').length;

  return NextResponse.json({
    queue: list,
    meta: {
      totalInQueue: list.length,
      waiting: waitingCount,
      inConsultation: inConsultCount,
      averageWaitMinutes: 18
    }
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const entry = mockStore.queue.find(q => q.id === body.id);
    if (!entry) {
      return NextResponse.json({ error: 'Queue entry not found' }, { status: 404 });
    }

    if (body.status) entry.status = body.status;
    if (body.estimated_wait_minutes !== undefined) entry.estimated_wait_minutes = body.estimated_wait_minutes;

    return NextResponse.json({ queueEntry: entry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update queue entry' }, { status: 500 });
  }
}
