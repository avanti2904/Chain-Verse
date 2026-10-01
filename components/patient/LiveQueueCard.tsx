'use client';

// ============================================================================
// Live Queue Tracker Component
// Displays ticket position, estimated wait minutes, and clinic intake details
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Users, Clock, Stethoscope, RefreshCw, CheckCircle2 } from 'lucide-react';
import { QueueEntry } from '@/types';

export function LiveQueueCard() {
  const [queueEntry, setQueueEntry] = useState<QueueEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queue?patientId=55555555-5555-5555-5555-555555555551');
      const data = await res.json();
      if (data.queue && data.queue.length > 0) {
        setQueueEntry(data.queue[0]);
      }
    } catch (err) {
      console.error('Failed to load queue:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Live Outpatient Queue</h4>
            <p className="text-xs text-slate-500">Real-time consultation queue tracking</p>
          </div>
        </div>

        <button
          onClick={fetchQueue}
          disabled={isLoading}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition cursor-pointer"
          title="Refresh Queue"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {queueEntry ? (
        <div className="space-y-4">
          <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Your Ticket Number</span>
              <div className="text-3xl font-extrabold text-teal-950 mt-0.5">#{queueEntry.queue_number}</div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Est. Wait Time</span>
              <div className="text-2xl font-bold text-slate-900 mt-0.5">~{queueEntry.estimated_wait_minutes} min</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Department</span>
              <span className="font-semibold text-slate-800">{queueEntry.department_name || 'Cardiology & Vascular Health'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-500 block mb-0.5">Attending Clinician</span>
              <span className="font-semibold text-slate-800">{queueEntry.doctor_name || 'Dr. Rajesh Patel, MD'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Check-in confirmed. Please remain in the second floor waiting lounge.</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500 text-xs">
          No active queue entry found. Book an appointment or check in at the reception.
        </div>
      )}
    </div>
  );
}
