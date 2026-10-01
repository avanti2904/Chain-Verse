'use client';

// ============================================================================
// Patient Portal Dashboard
// AI Consultation, Voice Input, Lab Report Upload, and Live Queue Tracking
// ============================================================================

import React, { useState } from 'react';
import { 
  User, 
  MessageSquare, 
  UploadCloud, 
  Clock, 
  Calendar, 
  FileText, 
  Activity, 
  ShieldCheck,
  Globe,
  HeartPulse
} from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { ConsultationChat } from '@/components/patient/ConsultationChat';
import { ReportUploader } from '@/components/patient/ReportUploader';
import { LiveQueueCard } from '@/components/patient/LiveQueueCard';
import { MedicalDisclaimer } from '@/components/common/MedicalDisclaimer';

export default function PatientDashboardPage() {
  const [activeTab, setActiveTab] = useState<'consultation' | 'reports' | 'appointments' | 'history'>('consultation');
  const [language, setLanguage] = useState<SupportedLanguage>('en');

  return (
    <div className="space-y-6">
      {/* Patient Profile Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-lg">
            AK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Arav Kumar</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                Patient ID: P-84912
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span>DOB: 1985-04-12 (41 yrs)</span>
              <span>•</span>
              <span>Blood Group: <strong className="text-slate-700">O+</strong></span>
              <span>•</span>
              <span>Primary Clinic: Metro Apex General</span>
            </div>
          </div>
        </div>

        {/* Language Selection Bar */}
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 text-xs">
          <Globe className="w-4 h-4 text-slate-500 ml-1" />
          <span className="font-semibold text-slate-600 mr-1">Language:</span>
          {(['en', 'hi', 'mr'] as SupportedLanguage[]).map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                language === lang
                  ? 'bg-sky-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिंदी' : 'मराठी'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('consultation')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
            activeTab === 'consultation'
              ? 'border-sky-600 text-sky-700 bg-white font-bold shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>AI Consultation & Voice Intake</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
            activeTab === 'reports'
              ? 'border-sky-600 text-sky-700 bg-white font-bold shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Lab Report / OCR</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
            activeTab === 'appointments'
              ? 'border-sky-600 text-sky-700 bg-white font-bold shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Live Queue & Appointments</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
            activeTab === 'history'
              ? 'border-sky-600 text-sky-700 bg-white font-bold shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <HeartPulse className="w-4 h-4" />
          <span>Medical History & Allergies</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'consultation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ConsultationChat language={language} />
          </div>
          <div className="space-y-6">
            <LiveQueueCard />
            <MedicalDisclaimer />
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <ReportUploader />
      )}

      {activeTab === 'appointments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LiveQueueCard />
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              Scheduled Clinic Consultations
            </h4>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Cardiology & Vascular Health</span>
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-semibold">CONFIRMED</span>
              </div>
              <p className="text-slate-600">Attending: Dr. Rajesh Patel, MD</p>
              <p className="text-slate-500">Date: Today • Time: 10:30 AM • Room: 204B</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 text-xs">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Clinical Profile & Background</h4>
            <p className="text-slate-500">Documented chronic diagnoses and verified allergies used by the context manager</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 block">Essential Hypertension (Stage 1)</span>
              <p className="text-slate-600">Diagnosed 2021. Managed on Telmisartan 40mg once daily.</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-semibold text-[10px]">
                ACTIVE
              </span>
            </div>

            <div className="p-4 bg-rose-50/60 rounded-lg border border-rose-200 space-y-1">
              <span className="font-bold text-rose-900 block">Penicillin Allergy (Severe)</span>
              <p className="text-rose-700">Developed acute urticarial reaction in 2015. Avoid all beta-lactams.</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-semibold text-[10px]">
                HIGH RISK ALLERGY
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
