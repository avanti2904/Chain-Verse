'use client';

// ============================================================================
// Model Registry Configuration Table
// Enables administrators to toggle AI models, reorder priority, and inspect capabilities
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Cpu, Check, X, Shield, Eye, Wrench, RefreshCw, Power } from 'lucide-react';
import { ModelRegistryItem } from '@/types';

export function ModelRegistryTable() {
  const [models, setModels] = useState<ModelRegistryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/models');
      const data = await res.json();
      if (data.models) setModels(data.models);
    } catch (err) {
      console.error('Failed to load models:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const toggleModel = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/admin/models', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, enabled: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setModels(prev => prev.map(m => m.id === id ? { ...m, enabled: !currentStatus } : m));
      }
    } catch (err) {
      console.error('Failed to toggle model:', err);
    }
  };

  const updatePriority = async (id: string, newPriority: number) => {
    try {
      const res = await fetch('/api/admin/models', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, priority: newPriority })
      });
      const data = await res.json();
      if (data.success) {
        setModels(prev => prev.map(m => m.id === id ? { ...m, priority: newPriority } : m));
      }
    } catch (err) {
      console.error('Failed to update priority:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            AI Model Registry & Routing Priority
          </h3>
          <p className="text-xs text-slate-500">
            Configure primary and fallback model candidates. Priority 1 is selected first for matching tasks.
          </p>
        </div>

        <button
          onClick={fetchModels}
          disabled={isLoading}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-4">Model Name</th>
              <th className="py-2.5 px-4">Provider</th>
              <th className="py-2.5 px-4">Priority</th>
              <th className="py-2.5 px-4">Capabilities</th>
              <th className="py-2.5 px-4">Context Limit</th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {models.map(model => (
              <tr key={model.id} className={model.enabled ? 'hover:bg-slate-50/70' : 'bg-slate-50/40 opacity-70'}>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{model.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">{model.model_name}</div>
                </td>

                <td className="py-3 px-4">
                  <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {model.provider}
                  </span>
                </td>

                <td className="py-3 px-4">
                  <select
                    value={model.priority}
                    onChange={e => updatePriority(model.id, Number(e.target.value))}
                    disabled={!model.enabled}
                    className="border border-slate-200 rounded px-2 py-1 font-bold text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5].map(p => (
                      <option key={p} value={p}>Rank #{p}</option>
                    ))}
                  </select>
                </td>

                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    {model.supports_vision && (
                      <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-semibold" title="Vision OCR">
                        Vision
                      </span>
                    )}
                    {model.supports_tools && (
                      <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 text-[10px] font-semibold" title="Function Calling">
                        Tools
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                      NLP
                    </span>
                  </div>
                </td>

                <td className="py-3 px-4 font-mono text-slate-600">
                  {model.max_context.toLocaleString()} tokens
                </td>

                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    model.enabled 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-100 text-slate-600 border border-slate-300'
                  }`}>
                    {model.enabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => toggleModel(model.id, model.enabled)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1 ml-auto ${
                      model.enabled
                        ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Power className="w-3 h-3" />
                    <span>{model.enabled ? 'Disable' : 'Enable'}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
