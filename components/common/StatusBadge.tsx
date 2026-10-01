'use client';

// ============================================================================
// Clinical Severity & Status Badge
// Color-coded for LOW_PRIORITY, ROUTINE, REVIEW_REQUIRED, URGENT_REVIEW
// ============================================================================

import React from 'react';
import { ClinicalSeverity } from '@/types';
import { AlertTriangle, Clock, ShieldAlert, Check } from 'lucide-react';

interface StatusBadgeProps {
  severity: ClinicalSeverity;
  size?: 'sm' | 'md';
}

export function StatusBadge({ severity, size = 'md' }: StatusBadgeProps) {
  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  switch (severity) {
    case 'URGENT_REVIEW':
      return (
        <span className={`inline-flex items-center gap-1 font-bold rounded-full bg-rose-100 text-rose-800 border border-rose-300 ${pad}`}>
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          URGENT REVIEW
        </span>
      );

    case 'REVIEW_REQUIRED':
      return (
        <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-300 ${pad}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          REVIEW REQUIRED
        </span>
      );

    case 'ROUTINE':
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-sky-50 text-sky-800 border border-sky-200 ${pad}`}>
          <Clock className="w-3 h-3 text-sky-600" />
          ROUTINE
        </span>
      );

    case 'LOW_PRIORITY':
    default:
      return (
        <span className={`inline-flex items-center gap-1 font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${pad}`}>
          <Check className="w-3 h-3 text-slate-500" />
          LOW PRIORITY
        </span>
      );
  }
}
