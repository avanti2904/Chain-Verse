// ============================================================================
// POST /api/ai/translate
// Localization service supporting EN, HI, MR
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { MockTranslationProvider } from '@/lib/providers/translation/mock';

const schema = z.object({
  text: z.string().min(1),
  sourceLang: z.enum(['en', 'hi', 'mr']).default('en'),
  targetLang: z.enum(['en', 'hi', 'mr'])
});

const translator = new MockTranslationProvider();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid translation payload' }, { status: 400 });
    }

    const res = await translator.translate(
      parsed.data.text,
      parsed.data.sourceLang,
      parsed.data.targetLang
    );

    return NextResponse.json(res);
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
