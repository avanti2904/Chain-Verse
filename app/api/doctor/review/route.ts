// ============================================================================
// /api/doctor/review
// Clinician verification and sign-off for AI-generated observations
// Distinguishes AI-extracted findings from clinically verified conclusions
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mockStore } from '@/lib/supabase/mock-store';
import { DoctorReview } from '@/types';

const schema = z.object({
  patientId: z.string().min(1),
  doctorId: z.string().min(1),
  aiTaskId: z.string().optional(),
  decision: z.enum(['VERIFIED', 'MODIFIED', 'REJECTED']),
  notes: z.string().default(''),
  verified: z.boolean().default(true)
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid clinical review data' }, { status: 400 });
    }

    const review: DoctorReview = {
      id: `rev-${Date.now()}`,
      patient_id: parsed.data.patientId,
      doctor_id: parsed.data.doctorId,
      ai_task_id: parsed.data.aiTaskId,
      decision: parsed.data.decision,
      notes: parsed.data.notes,
      verified: parsed.data.verified,
      created_at: new Date().toISOString()
    };

    mockStore.doctorReviews.unshift(review);

    return NextResponse.json({
      success: true,
      review,
      message: 'Clinical review successfully submitted and tagged as CLINICALLY VERIFIED.'
    });
  } catch (error) {
    console.error('Doctor review submission error:', error);
    return NextResponse.json({ error: 'Failed to record doctor review' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get('patientId');

  let list = mockStore.doctorReviews;
  if (patientId) {
    list = list.filter(r => r.patient_id === patientId);
  }

  return NextResponse.json({ reviews: list });
}
