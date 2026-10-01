'use client';

// ============================================================================
// Hospital Admin & Orchestration Control Console
// Live DAG Flow Visualizer, Model Registry, Clinical Rules Editor, System Telemetry
// ============================================================================

import React, { useState } from 'react';
import { 
  Settings, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  BarChart3, 
  Server,
  Lock,
  RefreshCw
} from 'lucide-react';
import { OrchestrationFlowVisualizer } from '@/components/admin/OrchestrationFlowVisualizer';
import { ModelRegistryTable } from '@/components/admin/ModelRegistryTable';
import { ClinicalRulesEditor } from '@/components/admin/ClinicalRulesEditor';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'monitor' | 'models' | 'rules' | 'health'>('monitor');

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-lg">
            SC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Dr. Sarah Chen, MD</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold">
                Chief Medical Officer & Hospital Admin
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Metro Apex General Hospital • Operations, Model Governance & Clinical Orchestration Console
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600">
          <Lock className="w-3.5 h-3.5 text-slate-500" />
          <span>Role-Based Access: <strong>HOSPITAL_ADMIN</strong></span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('monitor')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
            activeTab === 'monitor'
              ? 'border-indigo-600 text-indigo-700 bg-white font-bold shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Live DAG Flow Visualizer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('models')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
            activeTab === 'models'
              ? 'border-indigo-600 text-indigo-700 bg-white font-bold shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Model Registry & Priorities</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition border-b-2 cursor-pointer ${
            activeTab === 'rules'
              ? 'border-indigo-600 text-indigo-700 bg-white font-bold shadow-2xs'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Clinical Rule Engine</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'monitor' && (
        <OrchestrationFlowVisualizer />
      )}

      {activeTab === 'models' && (
        <ModelRegistryTable />
      )}

      {activeTab === 'rules' && (
        <ClinicalRulesEditor />
      )}
    </div>
  );
}
