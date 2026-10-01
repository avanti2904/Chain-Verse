// ============================================================================
// POST /api/ai/analyze-report
// Medical report and laboratory document analysis & parameter extraction
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MockVisionProvider } from '@/lib/providers/vision/mock';
import { GeminiVisionProvider } from '@/lib/providers/vision/gemini';
import { mockStore } from '@/lib/supabase/mock-store';

const schema = z.object({
  fileName: z.string().min(1),
  fileData: z.string().optional(),
  mimeType: z.string().optional(),
  patientId: z.string().optional()
});

const geminiVision = new GeminiVisionProvider();
const mockVision = new MockVisionProvider();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid document payload' }, { status: 400 });
    }

    const provider = geminiVision.isAvailable() ? geminiVision : mockVision;
    const extracted = await provider.extractReport({
      fileName: parsed.data.fileName,
      fileData: parsed.data.fileData,
      mimeType: parsed.data.mimeType
    });

    // Save metadata in mock store
    const docId = `doc-${Date.now()}`;
    mockStore.documents.unshift({
      id: docId,
      patient_id: parsed.data.patientId || mockStore.patients[0].id,
      file_name: parsed.data.fileName,
      file_url: `/uploads/${parsed.data.fileName}`,
      file_type: parsed.data.mimeType || 'application/pdf',
      file_size_bytes: 124000,
      document_type: extracted.documentType,
      status: 'ANALYZED',
      created_at: new Date().toISOString()
    });

    mockStore.extractions[docId] = extracted;

    return NextResponse.json({
      documentId: docId,
      extracted,
      providerUsed: provider.name,
      verified: false
    });
  } catch (error) {
    console.error('Report analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze report' }, { status: 500 });
  }
}
