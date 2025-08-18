/**
 * Custom error class for PDF text extraction failures
 */
export class PdfTextExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PdfTextExtractionError";
  }
}

/**
 * Interface for PDF.js text content item
 */
export interface PdfTextContentItem {
  str?: string;
  [key: string]: unknown;
}

/**
 * Interface for PDF.js text content
 */
export interface PdfTextContent {
  items: PdfTextContentItem[];
  [key: string]: unknown;
}

/**
 * Interface for PDF.js page
 */
export interface PdfPage {
  getTextContent(): Promise<PdfTextContent>;
  [key: string]: unknown;
}

/**
 * Interface for PDF.js document
 */
export interface PdfDocument {
  numPages: number;
  getPage(pageNum: number): Promise<PdfPage>;
  [key: string]: unknown;
}

/**
 * Interface for PDF.js loading task options
 */
export interface PdfLoadingTaskOptions {
  data: ArrayBuffer;
  standardFontDataUrl?: string;
  [key: string]: unknown;
}

/**
 * Interface for PDF.js module
 */
export interface PdfJsModule {
  getDocument(options: PdfLoadingTaskOptions): {
    promise: Promise<PdfDocument>;
  };
  setVerbosityLevel?: (level: number) => void;
  VerbosityLevel?: {
    ERRORS?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * Interface for a single résumé block (e.g., Experience, Education, Skills)
 */
export interface ResumeBlock {
  content: string;
  confidence: number;
  startLine: number;
  endLine: number;
}

/**
 * Interface for the complete segmentation result
 */
export interface SegmentationResult {
  blocks: {
    experience?: string;
    education?: string;
    skills?: string;
    [key: string]: string | undefined;
  };
  warnings: string[];
  metadata: {
    totalBlocks: number;
    confidence: number;
    detectedSections: string[];
  };
}

/**
 * Custom error class for segmentation failures
 */
export class SegmentationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SegmentationError";
  }
}
