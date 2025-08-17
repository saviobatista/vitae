import { ValidationIssue, ValidationResult } from "@/types";

export const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function isPdf(file: File): boolean {
  if (!file.type || !file.name) return false;
  const type = file.type.toLowerCase().trim();
  const name = file.name.toLowerCase().trim();

  return (
    new Set(["application/pdf", "application/octet-stream"]).has(type) ||
    name.endsWith(".pdf")
  );
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

  if (!isPdf(file)) {
    issues.push("NOT_PDF");
  }

  if (file.size === 0) {
    issues.push("EMPTY_FILE");
  }

  if (!isUnderLimit(file, maxBytes)) {
    issues.push("TOO_LARGE");
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}
