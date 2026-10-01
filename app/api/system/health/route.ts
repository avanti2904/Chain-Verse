// ============================================================================
// GET /api/system/health
// System operational status, provider availability, and demo mode indicator
// ============================================================================

import { NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';
import { GeminiProvider } from '@/lib/providers/ai/gemini';
import { GroqProvider } from '@/lib/providers/ai/groq';
import { HuggingFaceProvider } from '@/lib/providers/ai/huggingface';

export async function GET() {
  const gemini = new GeminiProvider();
  const groq = new GroqProvider();
  const hf = new HuggingFaceProvider();

  return NextResponse.json({
    status: 'HEALTHY',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demoMode: process.env.DEMO_MODE === 'true' || true,
    providers: {
      gemini: { available: gemini.isAvailable(), configured: Boolean(process.env.GEMINI_API_KEY) },
      groq: { available: groq.isAvailable(), configured: Boolean(process.env.GROQ_API_KEY) },
      huggingface: { available: hf.isAvailable(), configured: Boolean(process.env.HUGGINGFACE_API_KEY) },
      mock: { available: true, status: 'ONLINE_ACTIVE' }
    },
    systemMetrics: {
      activeModels: mockStore.models.filter(m => m.enabled).length,
      activeClinicalRules: mockStore.clinicalRules.filter(r => r.active).length,
      queueDepth: mockStore.queue.filter(q => q.status === 'WAITING').length
    }
  });
}
