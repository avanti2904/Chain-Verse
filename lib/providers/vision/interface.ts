// ============================================================================
// Vision & Document OCR Provider Interface
// Extracts structured laboratory parameters and radiology reports from documents
// ============================================================================

import { StructuredExtraction } from '@/types';

export interface VisionProvider {
  readonly name: string;
  readonly providerId: 'gemini_vision' | 'mock_vision';

  isAvailable(): boolean;

  extractReport(params: {
    fileData?: string; // base64 or text
    mimeType?: string;
    fileName: string;
    timeoutMs?: number;
  }): Promise<StructuredExtraction>;
}
