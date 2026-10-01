'use client';

// ============================================================================
// Clinical Verification Badge Component
// Distinctly tags: PATIENT REPORTED, AI EXTRACTED, AI GENERATED SUMMARY, CLINICALLY VERIFIED
// ============================================================================

import React from 'react';
import { User, Sparkles, CheckCircle2, FileSearch } from 'lucide-react';

export type ClinicalSourceType = 
  | 'PATIENT_REPORTED' 
  | 'AI_EXTRACTED' 
  | 'AI_GENERATED_SUMMARY' 
  | 'CLINICALLY_VERIFIED';

interface BadgeProps {
  type: ClinicalSourceType;
  verifiedBy?: string;
  verifiedAt?: string;
  className?: string;
}

export function ClinicalVerificationBadge({ type, verifiedBy, verifiedAt, className = '' }: BadgeProps) {
  switch (type) {
    case 'PATIENT_REPORTED':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 ${className}`}>
          <User className="w-3 h-3 text-sky-600" />
          PATIENT REPORTED
        </span>
      );

    case 'AI_EXTRACTED':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200 ${className}`}>
          <FileSearch className="w-3 h-3 text-purple-600" />
          AI EXTRACTED (Unverified)
        </span>
      );

    case 'AI_GENERATED_SUMMARY':
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 ${className}`}>
          <Sparkles className="w-3 h-3 text-amber-600" />
          AI GENERATED SUMMARY
        </span>
      );

    case 'CLINICALLY_VERIFIED':
      return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-2xs ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          CLINICALLY VERIFIED
          {verifiedBy && <span className="font-normal text-emerald-700 ml-1">by {verifiedBy}</span>}
        </span>
      );

    default:
      return null;
  }
}
