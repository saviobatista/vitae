import {
  isPdf,
  isUnderLimit,
  MAX_FILE_BYTES,
  validateResumeFile,
} from "lib/validation/resumeFile";
import { describe, it, expect } from "vitest";

function fakeFile(name: string, size: number, type = ""): File {
  return { name, size, type } as unknown as File;
}

describe("validation/resumeFile", () => {
  describe("isPdf", () => {
    it("returns true when MIME type is application/pdf", () => {
      const f = fakeFile("cv.pdf", 1000, "application/pdf");
      expect(isPdf(f)).toBe(true);
    });

    it("returns true when extension is .PDF even without MIME type (case-insensitive)", () => {
      const f = fakeFile("my-resume.PDF", 1000, "");
      expect(isPdf(f)).toBe(true);
    });

    it("returns false when file is not a PDF (png)", () => {
      const f = fakeFile("photo.png", 1000, "image/png");
      expect(isPdf(f)).toBe(false);
    });

    it("treats application/octet-stream as PDF only if extension is .pdf", () => {
      const f1 = fakeFile("cv.pdf", 1000, "application/octet-stream");
      const f2 = fakeFile("cv.txt", 1000, "application/octet-stream");
      expect(isPdf(f1)).toBe(true);
      expect(isPdf(f2)).toBe(false);
    });
  });

  describe("isUnderLimit", () => {
    it("returns true when size <= MAX_FILE_BYTES (exact limit)", () => {
      const f = fakeFile("cv.pdf", MAX_FILE_BYTES, "application/pdf");
      expect(isUnderLimit(f, MAX_FILE_BYTES)).toBe(true);
    });

    it("returns false when size > MAX_FILE_BYTES", () => {
      const f = fakeFile("cv.pdf", MAX_FILE_BYTES + 1, "application/pdf");
      expect(isUnderLimit(f, MAX_FILE_BYTES)).toBe(false);
    });
  });

  describe("validateResumeFile", () => {
    it("OK when file is a valid PDF and <= 5MB", () => {
      const f = fakeFile("cv.pdf", 1 * 1024 * 1024, "application/pdf");
      const res = validateResumeFile(f);
      expect(res.ok).toBe(true);
      expect(res.issues).toEqual([]);
      expect(res.errors).toEqual([]);
    });

    it("NOT_PDF when extension/MIME is not PDF", () => {
      const f = fakeFile("photo.png", 500_000, "image/png");
      const res = validateResumeFile(f);
      expect(res.ok).toBe(false);
      expect(res.issues).toContain("NOT_PDF");
      expect(res.issues).not.toContain("TOO_LARGE");
      expect(res.issues).not.toContain("EMPTY_FILE");
      expect(res.errors).toEqual([]);
    });

    it("TOO_LARGE when file size exceeds 5MB", () => {
      const f = fakeFile("cv.pdf", MAX_FILE_BYTES + 10, "application/pdf");
      const res = validateResumeFile(f);
      expect(res.ok).toBe(false);
      expect(res.issues).toContain("TOO_LARGE");
      expect(res.issues).not.toContain("NOT_PDF");
      expect(res.issues).not.toContain("EMPTY_FILE");
      expect(res.errors).toEqual([]);
    });

    it("EMPTY_FILE when file size is 0", () => {
      const f = fakeFile("cv.pdf", 0, "application/pdf");
      const res = validateResumeFile(f);
      expect(res.ok).toBe(false);
      expect(res.issues).toEqual(["EMPTY_FILE"]);
      expect(res.errors).toEqual([]);
    });

    it("NOT_PDF and TOO_LARGE when both validations fail", () => {
      const f = fakeFile("file.xyz", MAX_FILE_BYTES + 10, "");
      const res = validateResumeFile(f);
      expect(res.ok).toBe(false);
      expect(res.issues).toEqual(
        expect.arrayContaining(["NOT_PDF", "TOO_LARGE"])
      );
      expect(res.errors).toEqual([]);
    });
  });
});
