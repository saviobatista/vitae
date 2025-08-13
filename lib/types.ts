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
 * Validation for ResumePDF
 */

export type ValidationIssue = "NOT_PDF" | "TOO_LARGE" | "EMPTY_FILE";
export interface ValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
  errors: string[];
}

/**
 * dropZone for resume
 */
export type DropzoneProps = {
  accept?: string;
  onFile: (file?: File) => void;
};

/**
 * Props errors upload
 */
export type FileErrorsProps = { errors: string[] };

export type Props = FileErrorsProps & { maxMB?: number };

/**
 * FileCard upload PDF
 */
export type SelectedFileCardProps = { file: File; onClear: () => void };

/**
 * Hold file memo
 */
export type UploadContextValue = {
  file: File | null;
  setFile: (f: File | null) => void;
  clear: () => void;
};
