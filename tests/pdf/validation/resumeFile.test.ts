import { describe, it, expect } from "vitest";
import {
  isPdf,
  isUnderLimit,
  MAX_FILE_BYTES,
  validateResumeFile,
} from "../../../lib/validation/resumeFile";

function fakeFile(name: string, sizeBytes: number, type = ""): File {
  return { name, size: sizeBytes, type } as unknown as File;
}

describe("validation/resumeFile", () => {
  describe("isPdf", () => {
    it("retorna true quando MIME é application/pdf", () => {
      const f = fakeFile("cv.pdf", 1000, "application/pdf");
      expect(isPdf(f)).toBe(true);
    });

    it("retorna true quando extensão é .PDF mesmo sem MIME (case-insensitive)", () => {
      const f = fakeFile("meu-curriculo.PDF", 1000, "");
      expect(isPdf(f)).toBe(true);
    });

    it("retorna false quando não é PDF (png)", () => {
      const f = fakeFile("foto.png", 1000, "image/png");
      expect(isPdf(f)).toBe(false);
    });
  });

  describe("isUnderLimit", () => {
    it("retorna true quando size <= MAX_FILE_BYTES (limite exato)", () => {
      const f = fakeFile("cv.pdf", MAX_FILE_BYTES, "application/pdf");
      expect(isUnderLimit(f, MAX_FILE_BYTES)).toBe(true);
    });

    it("retorna false quando size > MAX_FILE_BYTES", () => {
      const f = fakeFile("cv.pdf", MAX_FILE_BYTES + 1, "application/pdf");
      expect(isUnderLimit(f, MAX_FILE_BYTES)).toBe(false);
    });
  });

  describe("validateResumeFile", () => {
    it("OK quando é PDF válido e <= 5MB", () => {
      const f = fakeFile("cv.pdf", 1 * 1024 * 1024, "application/pdf");
      const res = validateResumeFile(f);
      expect(res.ok).toBe(true);
      expect(res.issues).toEqual([]);
      expect(res.errors).toEqual([]);
    });

    it("NOT_PDF quando extensão/MIME não for PDF", () => {
      const f = fakeFile("foto.png", 500_000, "image/png");
      const res = validateResumeFile(f);
      expect(res.ok).toBe(false);
      expect(res.issues).toContain("NOT_PDF");
      expect(res.errors.join(" ")).toMatch(/pdf/i);
      expect(res.issues).not.toContain("TOO_LARGE");
    });

    it("TOO_LARGE quando tamanho excede 5MB", () => {
      const f = fakeFile("cv.pdf", MAX_FILE_BYTES + 10, "application/pdf");
      const res = validateResumeFile(f);
      expect(res.ok).toBe(false);
      expect(res.issues).toContain("TOO_LARGE");
      expect(res.errors.join(" ")).toMatch(/5mb/i);
      expect(res.issues).not.toContain("NOT_PDF");
    });

    it("NOT_PDF e TOO_LARGE quando ambos falham", () => {
      const f = fakeFile("arquivo.xyz", MAX_FILE_BYTES + 10, "");
      const res = validateResumeFile(f);
      expect(res.ok).toBe(false);
      expect(res.issues).toEqual(
        expect.arrayContaining(["NOT_PDF", "TOO_LARGE"])
      );
      expect(res.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
