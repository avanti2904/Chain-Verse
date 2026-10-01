// ============================================================================
// POST /api/ai/chat
// Dedicated conversational endpoint routed through the orchestrator
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { orchestrateHealthcareRequest } from '@/lib/orchestrator/router';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await orchestrateHealthcareRequest({
      sessionId: body.sessionId || `sess-${Date.now()}`,
      userId: body.userId,
      patientId: body.patientId,
      role: body.role || 'PATIENT',
      inputType: body.inputType || 'text',
      message: body.message || '',
      language: body.language || 'en',
      conversationContext: body.conversationContext || []
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Chat orchestration error:', error);
    return NextResponse.json({ error: 'Chat processing failed' }, { status: 500 });
  }
}
