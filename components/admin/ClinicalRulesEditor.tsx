'use client';

// ============================================================================
// Clinical Rules Configuration Editor
// Allows authorized administrators to inspect, toggle, and add clinical rules
// ============================================================================

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Check, Power, RefreshCw, AlertTriangle, Layers } from 'lucide-react';
import { ClinicalRule, ClinicalSeverity } from '@/types';
import { StatusBadge } from '@/components/common/StatusBadge';

export function ClinicalRulesEditor() {
  const [rules, setRules] = useState<ClinicalRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<'EMERGENCY' | 'TRIAGE' | 'LAB_ALERT'>('TRIAGE');
  const [newRuleSeverity, setNewRuleSeverity] = useState<ClinicalSeverity>('REVIEW_REQUIRED');
  const [newRuleAction, setNewRuleAction] = useState('');

  const fetchRules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/rules');
      const data = await res.json();
      if (data.rules) setRules(data.rules);
    } catch (err) {
      console.error('Failed to load rules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const toggleRule = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/admin/rules', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive })
      });
      const data = await res.json();
      if (data.success) {
        setRules(prev => prev.map(r => r.id === id ? { ...r, active: !currentActive } : r));
      }
    } catch (err) {
      console.error('Failed to toggle rule:', err);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRuleAction.trim()) return;

    try {
      const res = await fetch('/api/admin/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRuleName,
          category: newRuleCategory,
          severity: newRuleSeverity,
          action: newRuleAction,
          conditions: [{ field: 'symptom', operator: 'contains_any', values: [newRuleName.toLowerCase()] }],
          active: true
        })
      });
      const data = await res.json();
      if (data.success) {
        setRules(prev => [data.rule, ...prev]);
        setNewRuleName('');
        setNewRuleAction('');
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Failed to create rule:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            Configurable Clinical Decision Rules
          </h3>
          <p className="text-xs text-slate-500">
            Deterministic rules executed prior to AI generation to enforce clinical triage boundaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Clinical Rule</span>
          </button>

          <button
            onClick={fetchRules}
            disabled={isLoading}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Add Rule Modal/Form */}
      {showAddForm && (
        <form onSubmit={handleCreateRule} className="p-4 bg-teal-50/50 rounded-lg border border-teal-200 space-y-3 text-xs">
          <h4 className="font-bold text-teal-950">Add New Deterministic Clinical Rule</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Rule Name</label>
              <input
                type="text"
                value={newRuleName}
                onChange={e => setNewRuleName(e.target.value)}
                placeholder="e.g. Acute Abdominal Guarding"
                className="w-full p-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={newRuleCategory}
                onChange={e => setNewRuleCategory(e.target.value as any)}
                className="w-full p-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
              >
                <option value="TRIAGE">TRIAGE</option>
                <option value="EMERGENCY">EMERGENCY</option>
                <option value="LAB_ALERT">LAB_ALERT</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Severity Output</label>
              <select
                value={newRuleSeverity}
                onChange={e => setNewRuleSeverity(e.target.value as any)}
                className="w-full p-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
              >
                <option value="ROUTINE">ROUTINE</option>
                <option value="REVIEW_REQUIRED">REVIEW_REQUIRED</option>
                <option value="URGENT_REVIEW">URGENT_REVIEW</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Escalation Action</label>
            <input
              type="text"
              value={newRuleAction}
              onChange={e => setNewRuleAction(e.target.value)}
              placeholder="e.g. Trigger urgent surgical consult alert and advise immediate fast"
              className="w-full p-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-teal-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-semibold"
            >
              Save Rule
            </button>
          </div>
        </form>
      )}

      {/* Rules List */}
      <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
        {rules.map(rule => (
          <div key={rule.id} className="p-4 bg-white hover:bg-slate-50 flex items-start justify-between gap-4">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{rule.name}</span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                  {rule.category}
                </span>
                <StatusBadge severity={rule.severity} size="sm" />
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong className="text-slate-700">Enforced Action:</strong> {rule.action}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => toggleRule(rule.id, rule.active)}
                className={`px-3 py-1 rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  rule.active
                    ? 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <Power className="w-3 h-3" />
                <span>{rule.active ? 'Deactivate' : 'Activate'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
