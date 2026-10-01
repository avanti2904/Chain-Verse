// ============================================================================
// /api/admin/models
// Manage registered AI models, toggle status, and adjust orchestration priorities
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';

export async function GET() {
  return NextResponse.json({ models: mockStore.models });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const model = mockStore.models.find(m => m.id === body.id);
    if (!model) {
      return NextResponse.json({ error: 'Model not found in registry' }, { status: 404 });
    }

    if (body.enabled !== undefined) model.enabled = body.enabled;
    if (body.priority !== undefined) model.priority = body.priority;
    if (body.availability) model.availability = body.availability;

    return NextResponse.json({ success: true, model });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update model' }, { status: 500 });
  }
}
