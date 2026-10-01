'use client';

// ============================================================================
// Doctor Safety Alert Banner
// Alerts clinicians of urgent triage events, red-flag symptoms, and critical lab values
// ============================================================================

import React, { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, ArrowUpRight, Check } from 'lucide-react';
import { SafetyEvent } from '@/types';

export function SafetyAlertBanner() {
  const [alerts, setAlerts] = useState<SafetyEvent[]>([]);

  useEffect(() => {
    fetch('/api/doctor/alerts')
      .then(res => res.json())
      .then(data => {
        if (data.alerts) setAlerts(data.alerts);
      })
      .catch(err => console.error('Failed to load doctor alerts:', err));
  }, []);

  if (alerts.length === 0) return null;

  return (
    <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-xl shadow-xs mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-rose-950">
                Urgent Clinical Attention Required ({alerts.length} Pending Event{alerts.length > 1 ? 's' : ''})
              </h4>
              <span className="px-2 py-0.5 text-[10px] uppercase font-extrabold bg-rose-600 text-white rounded">
                High Priority
              </span>
            </div>
            <p className="text-xs text-rose-800 mt-1">
              Deterministic emergency rules or critical out-of-range lab markers have escalated the following cases:
            </p>

            <div className="mt-3 space-y-2">
              {alerts.slice(0, 3).map(alert => (
                <div key={alert.id} className="bg-white/80 p-2.5 rounded-lg border border-rose-200 text-xs text-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-rose-900 mr-2">{alert.trigger}</span>
                    <span className="text-slate-600">— Action: {alert.action_taken}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono ml-4 shrink-0">
                    {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
