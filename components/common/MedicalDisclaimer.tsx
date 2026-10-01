'use client';

// ============================================================================
// Medical Disclaimer Banner Component
// Displays non-diagnostic clinical disclaimer across all relevant screens
// ============================================================================

import React from 'react';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { STANDARD_MEDICAL_DISCLAIMER } from '@/lib/safety/medical-disclaimer';

interface MedicalDisclaimerProps {
  compact?: boolean;
}

export function MedicalDisclaimer({ compact = false }: MedicalDisclaimerProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-amber-50/80 border border-amber-200/80 rounded-md text-[11px] text-amber-900 leading-tight">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <p>
          <span className="font-semibold">Clinical Notice:</span> AI outputs are for assistance and triage coordination only. Clinician verification is required before medical action.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 flex items-start gap-2.5">
      <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-slate-900">Clinical Responsibility & Non-Diagnostic Guarantee</p>
        <p className="mt-0.5 leading-relaxed text-slate-600">{STANDARD_MEDICAL_DISCLAIMER}</p>
      </div>
    </div>
  );
}
