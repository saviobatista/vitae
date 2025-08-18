import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";



import extractText, { PdfTextExtractionError } from "@/parser/extractText";

const fixturesDir = path.resolve(__dirname, "..", "fixtures");
const singlePdfPath = path.join(fixturesDir, "sample.pdf");
const hasSingleFixture = existsSync(singlePdfPath);
const multiPdfPath = path.join(fixturesDir, "sample-multi-page.pdf");
const hasMultiFixture = existsSync(multiPdfPath);

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  const ab = new ArrayBuffer(buf.byteLength);
  new Uint8Array(ab).set(buf);
  return ab;
}

describe("extractText", () => {
  it.runIf(hasSingleFixture)(
    "extracts plain text from a valid single-page PDF",
    async () => {
      const buffer = await readFile(singlePdfPath);

      const text = await extractText(toArrayBuffer(buffer));

      expect(typeof text).toBe("string");
      expect(text.length).toBeGreaterThan(10);
      // Heuristic: text should not contain excessive multiple newlines
      expect(/\n{3,}/.test(text)).toBe(false);
    }
  );

  it.runIf(hasSingleFixture)(
    "returns consistent output formatting with normalized whitespace",
    async () => {
      const buffer = await readFile(singlePdfPath);
      const text = await extractText(toArrayBuffer(buffer));

      // No tabs or NBSP, multiple spaces collapsed
      expect(text).not.toMatch(/[\t\u00A0]/);
      expect(text).not.toMatch(/ {2,}/);
    }
  );

  it.runIf(hasMultiFixture)(
    "combines multiple pages into a single normalized text stream",
    async () => {
      const buffer = await readFile(multiPdfPath);
      const text = await extractText(toArrayBuffer(buffer));

      expect(typeof text).toBe("string");
      expect(text.length).toBeGreaterThan(10);
      // Should contain at least one double-newline page separator as a heuristic
      const sections = text.split(/\n{2,}/);
      expect(sections.length).toBeGreaterThan(1);
      expect(/\n{3,}/.test(text)).toBe(false);
    }
  );

  it("throws a friendly error for invalid input bytes", async () => {
    const fake = Buffer.from("Not a PDF");
    await expect(extractText(toArrayBuffer(fake))).rejects.toThrow(
      PdfTextExtractionError
    );
  });
});
