'use client';

// ============================================================================
// In-Depth Patient Clinical Encounter Chart
// Side-by-side display clearly distinguishing:
// PATIENT REPORTED, AI EXTRACTED, AI GENERATED SUMMARY, and CLINICALLY VERIFIED
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  User, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ShieldAlert, 
  HeartPulse, 
  Clock, 
  AlertTriangle,
  Stethoscope,
  Layers,
  ChevronRight
} from 'lucide-react';
import { ClinicalVerificationBadge } from '@/components/common/ClinicalVerificationBadge';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ClinicalVerificationPanel } from '@/components/doctor/ClinicalVerificationPanel';
import { MedicalDisclaimer } from '@/components/common/MedicalDisclaimer';

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedNotes, setVerifiedNotes] = useState('');

  return (
    <div className="space-y-6">
      {/* Back Link & Header */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/doctor" className="hover:text-slate-800 flex items-center gap-1 font-medium transition">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Doctor Workstation
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-800 font-semibold">Clinical Encounter Chart</span>
      </div>

      {/* Patient Demographic Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-lg">
            AK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Arav Kumar</h2>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                MRN: #984210
              </span>
              <StatusBadge severity="REVIEW_REQUIRED" size="sm" />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span>Age: 41 (Male)</span>
              <span>•</span>
              <span>Blood Group: <strong className="text-slate-700">O+</strong></span>
              <span>•</span>
              <span>Chief Dept: Cardiology & Vascular Health</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isVerified ? (
            <ClinicalVerificationBadge type="CLINICALLY_VERIFIED" verifiedBy="Dr. Rajesh Patel, MD" />
          ) : (
            <ClinicalVerificationBadge type="AI_GENERATED_SUMMARY" />
          )}
        </div>
      </div>

      {/* Section 1: Patient Reported (Teal Accent) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-sky-600" />
            1. Patient Reported Chief Complaint & Intake Voice Transcript
          </h3>
          <ClinicalVerificationBadge type="PATIENT_REPORTED" />
        </div>

        <div className="p-4 bg-sky-50/50 rounded-lg border border-sky-100 text-xs text-slate-800 space-y-2">
          <p className="font-semibold text-sky-950">
            "I have been experiencing recurrent episodes of heart fluttering and chest tightness for the past 4 days, especially when climbing stairs. I also feel mildly out of breath."
          </p>
          <div className="flex items-center gap-4 text-slate-500 pt-1 text-[11px]">
            <span>Onset: 4 days ago</span>
            <span>•</span>
            <span>Exertional Trigger: Stairs</span>
            <span>•</span>
            <span>Input Channel: Web Speech API (Microphone)</span>
          </div>
        </div>
      </div>

      {/* Section 2: AI Extracted Lab Findings (Purple Accent) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" />
            2. AI Extracted Findings from Uploaded Report (CBC_Lipid_Panel_Report_2026.pdf)
          </h3>
          <ClinicalVerificationBadge type="AI_EXTRACTED" />
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Parameter</th>
                <th className="py-2.5 px-4">Observed Value</th>
                <th className="py-2.5 px-4">Reference Range</th>
                <th className="py-2.5 px-4 text-right">Extracted Flag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-rose-50/40">
                <td className="py-2.5 px-4 font-bold text-slate-900">Total Cholesterol</td>
                <td className="py-2.5 px-4 font-mono font-bold text-rose-700">242 mg/dL</td>
                <td className="py-2.5 px-4 text-slate-600">&lt; 200 mg/dL</td>
                <td className="py-2.5 px-4 text-right">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">HIGH</span>
                </td>
              </tr>
              <tr className="bg-rose-50/40">
                <td className="py-2.5 px-4 font-bold text-slate-900">LDL Cholesterol</td>
                <td className="py-2.5 px-4 font-mono font-bold text-rose-700">165 mg/dL</td>
                <td className="py-2.5 px-4 text-slate-600">&lt; 100 mg/dL</td>
                <td className="py-2.5 px-4 text-right">
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">HIGH</span>
                </td>
              </tr>
              <tr className="bg-amber-50/30">
                <td className="py-2.5 px-4 font-bold text-slate-900">Triglycerides</td>
                <td className="py-2.5 px-4 font-mono font-bold text-amber-800">195 mg/dL</td>
                <td className="py-2.5 px-4 text-slate-600">&lt; 150 mg/dL</td>
                <td className="py-2.5 px-4 text-right">
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">ELEVATED</span>
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-bold text-slate-900">Hemoglobin</td>
                <td className="py-2.5 px-4 font-mono text-slate-800">13.8 g/dL</td>
                <td className="py-2.5 px-4 text-slate-600">13.5 - 17.5 g/dL</td>
                <td className="py-2.5 px-4 text-right">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold text-[10px]">NORMAL</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: AI Generated Clinical Summary (Amber Accent) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            3. AI Generated Pre-Consultation Summary (Synthesized Note)
          </h3>
          <ClinicalVerificationBadge type="AI_GENERATED_SUMMARY" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-amber-50/40 rounded-lg border border-amber-200 space-y-1">
            <span className="font-bold text-amber-900 block uppercase tracking-wider text-[10px]">Subjective Findings</span>
            <p className="text-slate-700 leading-relaxed">
              Patient reports 4-day history of palpitations and exertional dyspnea. Known history of Stage 1 hypertension managed with Telmisartan.
            </p>
          </div>

          <div className="p-4 bg-amber-50/40 rounded-lg border border-amber-200 space-y-1">
            <span className="font-bold text-amber-900 block uppercase tracking-wider text-[10px]">Objective Findings</span>
            <p className="text-slate-700 leading-relaxed">
              Recent lipid profile demonstrates significant hypercholesterolemia (Total: 242 mg/dL, LDL: 165 mg/dL). Baseline CBC hematology indices are within standard limits.
            </p>
          </div>

          <div className="p-4 bg-amber-50/40 rounded-lg border border-amber-200 space-y-1">
            <span className="font-bold text-amber-900 block uppercase tracking-wider text-[10px]">Differential Considerations</span>
            <p className="text-slate-700 leading-relaxed">
              Symptom presentation and dyslipidemia warrant evaluation for exertional coronary ischemia, paroxysmal supraventricular arrhythmia, or hypertensive heart disease.
            </p>
          </div>

          <div className="p-4 bg-amber-50/40 rounded-lg border border-amber-200 space-y-1">
            <span className="font-bold text-amber-900 block uppercase tracking-wider text-[10px]">Suggested Workup</span>
            <p className="text-slate-700 leading-relaxed">
              1. 12-lead Electrocardiogram (ECG).<br />
              2. Transthoracic Echocardiogram.<br />
              3. Clinician evaluation for Statin therapy initiation.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Physician Verification Panel */}
      <ClinicalVerificationPanel
        patientId="55555555-5555-5555-5555-555555555551"
        doctorName="Dr. Rajesh Patel, MD"
        initialVerified={isVerified}
        onVerifiedChange={(verified, notes) => {
          setIsVerified(verified);
          setVerifiedNotes(notes);
        }}
      />

      <MedicalDisclaimer />
    </div>
  );
}
