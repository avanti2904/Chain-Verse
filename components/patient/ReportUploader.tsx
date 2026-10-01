'use client';

// ============================================================================
// Medical Report Uploader & Structured Extraction Viewer
// Parses laboratory panels and displays verified vs unverified clinical findings
// ============================================================================

import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Loader2, 
  Tag, 
  Layers 
} from 'lucide-react';
import { StructuredExtraction } from '@/types';
import { ClinicalVerificationBadge } from '@/components/common/ClinicalVerificationBadge';
import { MedicalDisclaimer } from '@/components/common/MedicalDisclaimer';

export function ReportUploader() {
  const [selectedFile, setSelectedFile] = useState<string>('CBC_Lipid_Panel_Report_2026.pdf');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractionResult, setExtractionResult] = useState<StructuredExtraction | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);

  const predefinedSamples = [
    {
      name: 'CBC_Lipid_Panel_Report_2026.pdf',
      type: 'Lipid Profile & Hematology',
      desc: 'Simulated lab report with elevated Cholesterol (242) and LDL (165)'
    },
    {
      name: 'Chest_Radiograph_PA_Report.pdf',
      type: 'Diagnostic Radiology',
      desc: 'Normal posteroanterior chest X-ray report'
    }
  ];

  const handleProcessDocument = async (fileName: string) => {
    setSelectedFile(fileName);
    setIsProcessing(true);
    setExtractionResult(null);

    try {
      const res = await fetch('/api/ai/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          patientId: '55555555-5555-5555-5555-555555555551'
        })
      });

      const data = await res.json();
      setExtractionResult(data.extracted);
      setDocumentId(data.documentId);
    } catch (err) {
      console.error('Failed to extract report:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload & Sample Selector Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-sky-600" />
              Upload Medical Report or Select Demo File
            </h3>
            <p className="text-xs text-slate-500">
              Multimodal document pipeline extracts laboratory values without fabricating missing parameters.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-sky-50 text-sky-800 text-xs font-semibold rounded-md border border-sky-200">
            PDF & Image OCR Supported
          </span>
        </div>

        {/* 1-Click Demo File Selector Chips */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            Select Fictional Test Report to Run Extraction Pipeline:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {predefinedSamples.map(sample => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleProcessDocument(sample.name)}
                disabled={isProcessing}
                className={`p-3.5 rounded-lg border text-left transition cursor-pointer flex items-start gap-3 ${
                  selectedFile === sample.name
                    ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-9 h-9 rounded bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate">{sample.name}</span>
                    <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {sample.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{sample.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-300 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-800">Processing Medical Document...</p>
              <p className="text-xs text-slate-500">Routing through Document Vision Adapter and OCR normalization</p>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Structured Results */}
      {extractionResult && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap justify-between items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{extractionResult.testName}</h4>
                <p className="text-xs text-slate-500">Document Type: {extractionResult.documentType} • Confidence: {Math.round(extractionResult.confidence * 100)}%</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ClinicalVerificationBadge type="AI_EXTRACTED" />
              <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-medium">
                Pending Doctor Verification
              </span>
            </div>
          </div>

          {/* Observations Box */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/40">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              AI Synthesized Observations
            </h5>
            <ul className="space-y-1.5">
              {extractionResult.observations.map((obs, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Structured Parameters Table */}
          <div className="p-6">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
              Extracted Parameters & Reference Ranges ({extractionResult.parameters.length} Found)
            </h5>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Test Parameter</th>
                    <th className="py-2.5 px-4">Observed Value</th>
                    <th className="py-2.5 px-4">Standard Units</th>
                    <th className="py-2.5 px-4">Reference Range</th>
                    <th className="py-2.5 px-4 text-right">Clinical Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {extractionResult.parameters.map((param, i) => (
                    <tr key={i} className={param.abnormal ? 'bg-amber-50/40' : 'hover:bg-slate-50'}>
                      <td className="py-2.5 px-4 font-semibold text-slate-900">{param.name}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{param.value}</td>
                      <td className="py-2.5 px-4 text-slate-500">{param.unit || '—'}</td>
                      <td className="py-2.5 px-4 text-slate-600">{param.ref_range || '—'}</td>
                      <td className="py-2.5 px-4 text-right">
                        {param.abnormal ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            {param.flag || 'OUT OF RANGE'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            NORMAL
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-purple-50/60 rounded-lg border border-purple-200 text-xs text-purple-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Clinical Extraction Note:</span> {extractionResult.summary}
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <MedicalDisclaimer compact />
          </div>
        </div>
      )}
    </div>
  );
}
