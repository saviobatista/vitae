import { ValidationIssue, ValidationResult } from "@/types";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function isPdf(file: File): boolean {
  const type = (file.type || "").toLowerCase().trim();
  const name = (file.name || "").toLowerCase().trim();

  const pdfMimes = new Set([
    "application/pdf",
    "application/x-pdf",
    "application/acrobat",
    "applications/vnd.pdf",
    "text/pdf",
    "text/x-pdf",
  ]);

  const looksLikePdfMime = type ? pdfMimes.has(type) : false;
  const looksLikePdfExt = name.endsWith(".pdf");

  return looksLikePdfMime || looksLikePdfExt;
}

export function isUnderLimit(
  file: File,
  maxBytes: number = MAX_FILE_BYTES
): boolean {
  return file.size <= maxBytes;
}

export function validateResumeFile(
  file: File,
  maxBytes: number = MAX_FILE_BYTES
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const errors: string[] = [];

  if (!isPdf(file)) {
    issues.push("NOT_PDF");
    errors.push("O arquivo precisa ser um PDF (.pdf).");
  }

  if (!isUnderLimit(file, maxBytes)) {
    issues.push("TOO_LARGE");
    errors.push(
      "Tamanho máximo permitido é 5MB. Se necessário, compacte seu PDF."
    );
  }

  return {
    ok: issues.length === 0,
    issues,
    errors,
  };
}
