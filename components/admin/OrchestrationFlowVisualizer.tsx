'use client';

// ============================================================================
// Orchestration Flow Visualizer (Hackathon Anchor Feature)
// Visual interactive DAG displaying:
// Request -> Intent Classifier -> Router -> Selected Model -> Safety Engine -> Result Validator -> Final Response
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  GitCommit, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  Cpu, 
  ShieldCheck, 
  RefreshCw, 
  Layers,
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';
import { OrchestrationStepTrace } from '@/types';

interface OrchestrationLogItem {
  runId: string;
  timestamp: string;
  intent: string;
  selectedModel: string;
  totalLatencyMs: number;
  confidence: number;
  severity: string;
  fallbackUsed: boolean;
  status: string;
  steps: OrchestrationStepTrace[];
}

export function OrchestrationFlowVisualizer() {
  const [logs, setLogs] = useState<OrchestrationLogItem[]>([]);
  const [selectedRun, setSelectedRun] = useState<OrchestrationLogItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orchestration-logs');
      const data = await res.json();
      if (data.logs && data.logs.length > 0) {
        setLogs(data.logs);
        setSelectedRun(data.logs[0]);
      } else {
        // Fallback default sample run for instant hackathon visualization
        const defaultRun: OrchestrationLogItem = {
          runId: 'run-demo-sample-01',
          timestamp: new Date().toISOString(),
          intent: 'SYMPTOM_QUERY',
          selectedModel: 'Google Gemini 1.5 Flash',
          totalLatencyMs: 142,
          confidence: 0.94,
          severity: 'REVIEW_REQUIRED',
          fallbackUsed: false,
          status: 'COMPLETED',
          steps: [
            { stepNumber: 1, component: 'InputSanitizer', action: 'Sanitized input text & checked token limits', status: 'SUCCESS', latencyMs: 8, confidence: 1.0 },
            { stepNumber: 2, component: 'EmergencyGuardrail', action: 'Deterministic red-flag symptom scan', status: 'SUCCESS', latencyMs: 14, confidence: 1.0 },
            { stepNumber: 3, component: 'TaskRouter', action: 'Intent classified as [SYMPTOM_QUERY]. Selected tool: CLINICAL_NLP_SERVICE', status: 'SUCCESS', latencyMs: 22, confidence: 0.96 },
            { stepNumber: 4, component: 'ClinicalRuleEngine', action: 'Evaluated active rules: Category TRIAGE, Severity: REVIEW_REQUIRED', status: 'SUCCESS', latencyMs: 12, confidence: 0.98 },
            { stepNumber: 5, component: 'SpecializedWorker', action: 'Generated clinical pre-consultation summary', status: 'SUCCESS', latencyMs: 65, confidence: 0.94, modelUsed: 'gemini-1.5-flash' },
            { stepNumber: 6, component: 'SafetyValidator', action: 'Sanitized clinical terminology & attached non-diagnostic disclaimer', status: 'SUCCESS', latencyMs: 11, confidence: 1.0 },
            { stepNumber: 7, component: 'HumanEscalation', action: 'Flagged for doctor review queue', status: 'SUCCESS', latencyMs: 10, confidence: 1.0 }
          ]
        };
        setLogs([defaultRun]);
        setSelectedRun(defaultRun);
      }
    } catch (err) {
      console.error('Failed to load orchestration logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const flowNodes = [
    { title: '1. Inbound Request', desc: 'Auth, Sanitize, Payload Validate', component: 'InputSanitizer' },
    { title: '2. Emergency Guard', desc: 'Deterministic Red-Flag Scan', component: 'EmergencyGuardrail' },
    { title: '3. Intent Classifier', desc: 'NLP Task & Tool Mapping', component: 'TaskRouter' },
    { title: '4. Clinical Rules', desc: 'Severity & Triage Scoring', component: 'ClinicalRuleEngine' },
    { title: '5. Specialized Model', desc: 'Gemini / Groq / Vision OCR', component: 'SpecializedWorker' },
    { title: '6. Safety Validator', desc: 'Non-diagnostic Disclaimer', component: 'SafetyValidator' },
    { title: '7. Clinician Review', desc: 'Human Verification Gate', component: 'HumanEscalation' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            AI Orchestration Flow Monitor & DAG Trace
          </h3>
          <p className="text-xs text-slate-500">
            Real-time visual telemetry of model routing, safety guardrails, latency, and fallback cascades
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Runs
          </button>
        </div>
      </div>

      {/* Selected Run Quick Telemetry Badges */}
      {selectedRun && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <span className="text-slate-500 block mb-0.5">Task Intent</span>
            <span className="font-bold text-indigo-700">{selectedRun.intent}</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <span className="text-slate-500 block mb-0.5">Selected Model</span>
            <span className="font-bold text-slate-800 truncate block">{selectedRun.selectedModel}</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <span className="text-slate-500 block mb-0.5">Total Latency</span>
            <span className="font-bold text-emerald-700">{selectedRun.totalLatencyMs} ms</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <span className="text-slate-500 block mb-0.5">Confidence Score</span>
            <span className="font-bold text-sky-700">{Math.round(selectedRun.confidence * 100)}%</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <span className="text-slate-500 block mb-0.5">Fallback Cascade</span>
            <span className={`font-bold ${selectedRun.fallbackUsed ? 'text-amber-600' : 'text-slate-700'}`}>
              {selectedRun.fallbackUsed ? 'Fallback Active' : 'Primary Execution'}
            </span>
          </div>
        </div>
      )}

      {/* Visual Horizontal DAG Node Pipeline */}
      <div className="overflow-x-auto pb-3">
        <div className="min-w-[850px] p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between relative">
            {flowNodes.map((node, i) => {
              const matchingStep = selectedRun?.steps?.find(s => s.component.toLowerCase().includes(node.component.toLowerCase()));
              const isPassed = Boolean(matchingStep);

              return (
                <React.Fragment key={i}>
                  <div
                    onClick={() => setActiveStepIndex(i)}
                    className={`flex flex-col items-center text-center p-3 rounded-xl border transition cursor-pointer w-32 shrink-0 ${
                      activeStepIndex === i
                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400'
                        : isPassed
                        ? 'bg-white border-slate-300 hover:border-slate-400 shadow-2xs'
                        : 'bg-slate-100 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 leading-tight">{node.title}</span>
                    <span className="text-[9px] text-slate-500 mt-1 line-clamp-1">{node.desc}</span>
                    {matchingStep && (
                      <span className="mt-1.5 text-[9px] font-mono text-emerald-700 font-semibold">
                        {matchingStep.latencyMs}ms
                      </span>
                    )}
                  </div>

                  {i < flowNodes.length - 1 && (
                    <div className="flex-1 flex justify-center items-center text-slate-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Step Execution Trace Log */}
      {selectedRun && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-slate-500" />
            Granular Execution Steps for Trace ID: <span className="font-mono text-indigo-700">{selectedRun.runId}</span>
          </h4>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
            {selectedRun.steps.map((step, idx) => (
              <div key={idx} className="p-3 bg-white hover:bg-slate-50/60 flex items-start justify-between text-xs gap-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 font-mono text-[10px] flex items-center justify-center font-bold text-slate-600 mt-0.5">
                    {step.stepNumber}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{step.component}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {step.status}
                      </span>
                      {step.modelUsed && (
                        <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                          {step.modelUsed}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mt-0.5">{step.action}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-semibold text-slate-700">{step.latencyMs} ms</span>
                  <span className="text-slate-400 block text-[10px]">{Math.round(step.confidence * 100)}% conf</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
