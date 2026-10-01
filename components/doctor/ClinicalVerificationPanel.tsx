'use client';

// ============================================================================
// Clinical Verification & Doctor Sign-Off Panel
// Explicitly confirms or modifies AI-generated observations with physician stamp
// ============================================================================

import React, { useState } from 'react';
import { CheckCircle2, Edit3, XCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { ClinicalVerificationBadge } from '@/components/common/ClinicalVerificationBadge';

interface ClinicalVerificationPanelProps {
  patientId: string;
  doctorName?: string;
  initialVerified?: boolean;
  onVerifiedChange?: (verified: boolean, notes: string) => void;
}

export function ClinicalVerificationPanel({
  patientId,
  doctorName = 'Dr. Rajesh Patel, MD',
  initialVerified = false,
  onVerifiedChange
}: ClinicalVerificationPanelProps) {
  const [isVerified, setIsVerified] = useState(initialVerified);
  const [decision, setDecision] = useState<'VERIFIED' | 'MODIFIED' | 'REJECTED'>('VERIFIED');
  const [doctorNotes, setDoctorNotes] = useState(
    'Correlated AI extraction with patient complaints. Lipid panel indicates atherogenic dyslipidemia. Initiating Atorvastatin 20mg OD and scheduling stress echocardiogram.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmitReview = async () => {
    setIsSubmitting(true);
    setSuccessNotice(null);

    try {
      const res = await fetch('/api/doctor/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId,
          doctorId: '44444444-4444-4444-4444-444444444441',
          decision,
          notes: doctorNotes,
          verified: decision !== 'REJECTED'
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsVerified(decision !== 'REJECTED');
        setSuccessNotice(`Clinician verification saved. Tagged as ${decision}.`);
        if (onVerifiedChange) {
          onVerifiedChange(decision !== 'REJECTED', doctorNotes);
        }
      }
    } catch (err) {
      console.error('Failed to submit doctor review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            Physician Clinical Verification & Final Sign-Off
          </h4>
          <p className="text-xs text-slate-500">
            Mandatory human-in-the-loop validation: AI summaries are assistive until verified by licensed clinician.
          </p>
        </div>

        <div>
          {isVerified ? (
            <ClinicalVerificationBadge type="CLINICALLY_VERIFIED" verifiedBy={doctorName} />
          ) : (
            <ClinicalVerificationBadge type="AI_EXTRACTED" />
          )}
        </div>
      </div>

      {/* Review Decision Buttons */}
      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-2">Clinical Assessment Decision:</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setDecision('VERIFIED')}
            className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              decision === 'VERIFIED'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-1 ring-emerald-400'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Verify AI Findings
          </button>

          <button
            type="button"
            onClick={() => setDecision('MODIFIED')}
            className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              decision === 'MODIFIED'
                ? 'bg-amber-50 text-amber-800 border-amber-400 ring-1 ring-amber-400'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-4 h-4 text-amber-600" />
            Modify with Notes
          </button>

          <button
            type="button"
            onClick={() => setDecision('REJECTED')}
            className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
              decision === 'REJECTED'
                ? 'bg-rose-50 text-rose-800 border-rose-400 ring-1 ring-rose-400'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <XCircle className="w-4 h-4 text-rose-600" />
            Reject AI Observation
          </button>
        </div>
      </div>

      {/* Doctor Clinical Notes Input */}
      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">
          Attending Clinician Observations & Formal Assessment Notes:
        </label>
        <textarea
          rows={3}
          value={doctorNotes}
          onChange={e => setDoctorNotes(e.target.value)}
          placeholder="Enter formal medical evaluation, diagnostic impressions, and treatment orders..."
          className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 font-sans leading-relaxed"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-[11px] text-slate-500">
          Signed electronically by: <strong className="text-slate-800">{doctorName}</strong> (License: MD-LIC-98421)
        </div>

        <button
          type="button"
          onClick={handleSubmitReview}
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-medium rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Review...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign & Clinically Verify Record</span>
            </>
          )}
        </button>
      </div>

      {successNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}
    </div>
  );
}
