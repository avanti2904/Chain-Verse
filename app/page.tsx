import React from 'react';
import Link from 'next/link';
import { 
  Activity, 
  User, 
  Stethoscope, 
  Settings, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Globe,
  Mic
} from 'lucide-react';
import { MedicalDisclaimer } from '@/components/common/MedicalDisclaimer';

export default function HomePage() {
  return (
    <div className="space-y-10 py-4">
      {/* Hero Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-800">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            Hackathon Production Architecture • Non-Diagnostic Coordination Layer
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            One Healthcare System. <br />
            Multiple Specialized AI Models. <br />
            <span className="text-sky-600">One Intelligent Orchestration Layer.</span>
          </h1>

          <p className="text-base text-slate-600 leading-relaxed">
            CareOrchestrate acts as the intelligent coordination kernel between patients, clinicians, 
            electronic health records, laboratory reports, voice streams, and clinical decision-support rules. 
            AI assists, summarizes, and routes — while qualified clinicians verify and decide.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/patient"
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl text-sm flex items-center gap-2 transition shadow-sm"
            >
              <User className="w-4 h-4" />
              <span>Launch Patient Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/doctor"
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm flex items-center gap-2 transition shadow-sm"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor Workstation</span>
            </Link>

            <Link
              href="/admin"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm flex items-center gap-2 transition shadow-sm"
            >
              <Settings className="w-4 h-4" />
              <span>Admin & Live DAG Monitor</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3-Minute Hackathon Demonstration Flow */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-600" />
            3-Minute Hackathon End-to-End Evaluation Workflow
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Follow this step-by-step clinical scenario demonstrating multi-model routing, safety, and human-in-the-loop verification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Multilingual Voice & Chat Intake</h3>
            <p className="text-slate-600 leading-relaxed">
              Patient selects English, Hindi, or Marathi and types or speaks symptoms. Web Speech API converts audio to text, and the orchestrator normalizes incoming languages.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Document Vision & Rule Engine</h3>
            <p className="text-slate-600 leading-relaxed">
              Patient selects a fictional lab report (CBC / Lipid Profile). The Vision OCR pipeline extracts structured parameters without hallucinating, and deterministic clinical rules score severity.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Doctor Review & Clinical Stamp</h3>
            <p className="text-slate-600 leading-relaxed">
              Doctor workstation inspects Patient Reported vs. AI Extracted findings side-by-side, reviews safety alerts, and marks the record as Clinically Verified with an official electronic signature.
            </p>
          </div>
        </div>
      </section>

      {/* Role Navigation Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patient Portal */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-sky-300 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Patient Portal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              AI-assisted intake consultation, microphone voice input, medical lab report upload, appointment scheduling, and live waiting queue tracking.
            </p>
          </div>
          <Link
            href="/patient"
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition"
          >
            <span>Open Patient View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Doctor Workstation */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-teal-300 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Doctor Workstation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clinical queue, patient summary breakdown (Patient Reported vs. AI Extracted), red-flag emergency alert review, and 1-click clinical verification.
            </p>
          </div>
          <Link
            href="/doctor"
            className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 transition"
          >
            <span>Open Doctor View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Admin Console & Live Monitor */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between space-y-4 hover:border-indigo-300 transition">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Admin & Orchestration Monitor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Live visual DAG execution trace, AI model registry configuration, dynamic clinical rule editor, latency metrics, and audit telemetry.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
          >
            <span>Open Admin Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Compliance & Safety Guarantee */}
      <MedicalDisclaimer />
    </div>
  );
}
