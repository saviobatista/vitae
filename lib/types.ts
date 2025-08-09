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
  isEvalSupported: boolean;
  useSystemFonts: boolean;
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
