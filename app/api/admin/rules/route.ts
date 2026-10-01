// ============================================================================
// /api/admin/rules
// Dynamic configuration of clinical rules, severity levels, and escalation actions
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { mockStore } from '@/lib/supabase/mock-store';
import { ClinicalRule } from '@/types';

export async function GET() {
  return NextResponse.json({ rules: mockStore.clinicalRules });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newRule: ClinicalRule = {
      id: `rule-${Date.now()}`,
      name: body.name || 'New Custom Clinical Rule',
      category: body.category || 'TRIAGE',
      conditions: body.conditions || [],
      severity: body.severity || 'ROUTINE',
      action: body.action || 'Default clinical routing',
      active: body.active !== undefined ? body.active : true
    };

    mockStore.clinicalRules.unshift(newRule);
    return NextResponse.json({ success: true, rule: newRule }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create rule' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const rule = mockStore.clinicalRules.find(r => r.id === body.id);
    if (!rule) {
      return NextResponse.json({ error: 'Rule not found' }, { status: 404 });
    }

    if (body.active !== undefined) rule.active = body.active;
    if (body.severity) rule.severity = body.severity;
    if (body.action) rule.action = body.action;
    if (body.name) rule.name = body.name;

    return NextResponse.json({ success: true, rule });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update rule' }, { status: 500 });
  }
}
