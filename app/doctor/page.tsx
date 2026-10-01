'use client';

// ============================================================================
// Doctor Clinical Workstation Dashboard
// Patient Queue, Today's Appointments, AI Triage Summaries, and Safety Flags
// ============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  Calendar, 
  ArrowRight, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  ShieldAlert,
  Search,
  RefreshCw
} from 'lucide-react';
import { Appointment, QueueEntry, ClinicalSeverity } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SafetyAlertBanner } from '@/components/doctor/SafetyAlertBanner';
import { ClinicalVerificationBadge } from '@/components/common/ClinicalVerificationBadge';

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [aptRes, qRes] = await Promise.all([
        fetch('/api/appointments?doctorId=44444444-4444-4444-4444-444444444441'),
        fetch('/api/queue')
      ]);

      const aptData = await aptRes.json();
      const qData = await qRes.json();

      if (aptData.appointments) setAppointments(aptData.appointments);
      if (qData.queue) setQueue(qData.queue);
    } catch (err) {
      console.error('Failed to load doctor dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Clinician Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-lg">
            RP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Dr. Rajesh Patel, MD</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
                Senior Cardiologist
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Metro Apex General Hospital • License: MD-LIC-98421 • Room 204B (Cardiology Clinic)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Safety Alert Banner */}
      <SafetyAlertBanner />

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Today's Appointments</span>
          <span className="text-2xl font-bold text-slate-900">{appointments.length} Scheduled</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Waiting in Queue</span>
          <span className="text-2xl font-bold text-teal-700">
            {queue.filter(q => q.status === 'WAITING').length} Patients
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">AI Summaries Pending Review</span>
          <span className="text-2xl font-bold text-amber-600">2 Pending</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs text-slate-500 block mb-1">Clinical Verification Rate</span>
          <span className="text-2xl font-bold text-emerald-700">100% Verified</span>
        </div>
      </div>

      {/* Active Patient Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600" />
              Active Clinic Patient Queue & Triage Status
            </h3>
            <p className="text-xs text-slate-500">
              Patients prioritized by deterministic clinical rules and AI pre-consultation extraction
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Ticket</th>
                <th className="py-2.5 px-4">Patient Name</th>
                <th className="py-2.5 px-4">Chief Complaint / Triage Reason</th>
                <th className="py-2.5 px-4">Triage Severity</th>
                <th className="py-2.5 px-4">Queue Status</th>
                <th className="py-2.5 px-4 text-right">Clinical Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    #{entry.queue_number}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{entry.patient_name || 'Arav Kumar'}</span>
                    <span className="text-[11px] text-slate-500 font-mono">ID: {entry.patient_id.slice(0, 8)}...</span>
                  </td>
                  <td className="py-3 px-4 max-w-xs text-slate-700 truncate">
                    Recurrent palpitation episodes and exertional dyspnea.
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge severity={entry.priority} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      entry.status === 'WITH_DOCTOR'
                        ? 'bg-teal-100 text-teal-800 border border-teal-300'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/doctor/patients/${entry.patient_id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
                    >
                      <span>Open Clinical Chart</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
