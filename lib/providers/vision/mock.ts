// ============================================================================
// Deterministic Mock Vision & Document Processing Provider
// Handles PDF/Image medical reports in DEMO_MODE without external keys
// ============================================================================

import { VisionProvider } from './interface';
import { StructuredExtraction } from '@/types';

export class MockVisionProvider implements VisionProvider {
  readonly name = 'Deterministic Medical Document Extraction Engine';
  readonly providerId = 'mock_vision' as const;

  isAvailable(): boolean {
    return true;
  }

  async extractReport(params: {
    fileData?: string;
    mimeType?: string;
    fileName: string;
    timeoutMs?: number;
  }): Promise<StructuredExtraction> {
    await new Promise(r => setTimeout(r, 200)); // simulated OCR latency

    const lowerName = params.fileName.toLowerCase();

    // 1. Lipid / Metabolic Panel Case
    if (lowerName.includes('lipid') || lowerName.includes('cholesterol') || lowerName.includes('cbc')) {
      return {
        documentType: 'Hematology & Lipid Profile Panel',
        patientName: 'Arav Kumar',
        date: '2026-09-28',
        testName: 'Complete Blood Count & Comprehensive Lipid Profile',
        observations: [
          'Marked elevation in Total Cholesterol and Low-Density Lipoprotein (LDL).',
          'Elevated serum triglycerides exceeding recommended fasting threshold.',
          'Sub-optimal High-Density Lipoprotein (HDL) protective levels.',
          'Hemoglobin, Hematocrit, and Platelet levels are within standard physiologic limits.'
        ],
        parameters: [
          { name: 'Hemoglobin', value: '13.8', unit: 'g/dL', ref_range: '13.5 - 17.5', abnormal: false },
          { name: 'Total Cholesterol', value: '242', unit: 'mg/dL', ref_range: '< 200', abnormal: true, flag: 'HIGH' },
          { name: 'Triglycerides', value: '195', unit: 'mg/dL', ref_range: '< 150', abnormal: true, flag: 'ELEVATED' },
          { name: 'HDL Cholesterol', value: '38', unit: 'mg/dL', ref_range: '> 40', abnormal: true, flag: 'LOW' },
          { name: 'LDL Cholesterol', value: '165', unit: 'mg/dL', ref_range: '< 100', abnormal: true, flag: 'HIGH' },
          { name: 'Platelets', value: '280,000', unit: '/mcL', ref_range: '150,000 - 450,000', abnormal: false }
        ],
        abnormalFlags: [
          'Total Cholesterol: 242 mg/dL [HIGH]',
          'LDL Cholesterol: 165 mg/dL [HIGH]',
          'Triglycerides: 195 mg/dL [ELEVATED]',
          'HDL Cholesterol: 38 mg/dL [LOW]'
        ],
        sourcePage: 1,
        confidence: 0.96,
        summary: 'Laboratory findings show hypercholesterolemia with an atherogenic dyslipidemia profile. Routine CBC parameters are normal.'
      };
    }

    // 2. Chest X-Ray / Radiology Case
    if (lowerName.includes('xray') || lowerName.includes('x-ray') || lowerName.includes('chest') || lowerName.includes('radiology')) {
      return {
        documentType: 'Diagnostic Radiology Report (Chest PA)',
        patientName: 'Unable to reliably extract this value',
        date: '2026-09-30',
        testName: 'Chest Radiograph - Posteroanterior (PA) View',
        observations: [
          'Clear bilateral lung fields without focal consolidation or pneumothorax.',
          'Cardiothoracic ratio is within normal limits (< 0.50).',
          'Costophrenic and cardiophrenic angles are well-defined.',
          'Bony thorax and soft tissues unremarkable.'
        ],
        parameters: [
          { name: 'Cardiothoracic Ratio', value: '0.46', unit: 'ratio', ref_range: '< 0.50', abnormal: false },
          { name: 'Lung Expansion', value: 'Satisfactory (9 posterior ribs)', unit: '', ref_range: 'Normal', abnormal: false }
        ],
        abnormalFlags: [],
        sourcePage: 1,
        confidence: 0.93,
        summary: 'Normal chest radiograph. No evidence of acute cardiopulmonary disease.'
      };
    }

    // 3. Generic Diagnostic Document Fallback
    return {
      documentType: 'Clinical Diagnostic Report',
      patientName: 'Unable to reliably extract this value',
      date: new Date().toISOString().split('T')[0],
      testName: params.fileName,
      observations: [
        'Document scanned and text extracted successfully.',
        'Extracted test parameters flagged for clinician review and verification.'
      ],
      parameters: [
        { name: 'Extracted Marker', value: 'Present', unit: '', ref_range: 'Standard', abnormal: false }
      ],
      abnormalFlags: [],
      sourcePage: 1,
      confidence: 0.88,
      summary: 'Diagnostic report processed. Clinician verification is required prior to therapeutic decisions.'
    };
  }
}
