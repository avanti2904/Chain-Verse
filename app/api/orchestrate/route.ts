// ============================================================================
// POST /api/orchestrate
// Primary entrypoint for the Healthcare AI Model Orchestration Platform
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { orchestrateHealthcareRequest } from '@/lib/orchestrator/router';
import { OrchestrationRequest } from '@/types';

const orchestrateSchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  userId: z.string().optional(),
  patientId: z.string().optional(),
  role: z.enum(['PATIENT', 'DOCTOR', 'HOSPITAL_ADMIN']).default('PATIENT'),
  inputType: z.enum(['text', 'voice', 'pdf', 'image', 'json']).default('text'),
  message: z.string().default(''),
  language: z.enum(['en', 'hi', 'mr']).default('en'),
  attachments: z.array(z.object({
    name: z.string(),
    type: z.string(),
    size: z.number(),
    url: z.string().optional(),
    base64Data: z.string().optional()
  })).optional(),
  conversationContext: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system', 'clinician']),
    content: z.string()
  })).optional()
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = orchestrateSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid orchestration request payload',
          details: parseResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
        },
        { status: 400 }
      );
    }

    const requestPayload: OrchestrationRequest = parseResult.data;
    const orchestrationResult = await orchestrateHealthcareRequest(requestPayload);

    return NextResponse.json(orchestrationResult, { status: 200 });
  } catch (error) {
    console.error('Orchestration pipeline execution error:', error);
    return NextResponse.json(
      {
        error: 'An internal error occurred during clinical model orchestration.',
        safeMessage: 'Unable to complete automated triage at this time. Please proceed to the clinic intake desk.'
      },
      { status: 500 }
    );
  }
}
