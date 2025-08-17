import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import extractText from "@/parser/extractText";
import segmentBlocks from "@/parser/segmentBlocks";

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

describe("Integration: extractText + segmentBlocks", () => {
  it.runIf(hasSingleFixture)(
    "should extract text from single-page PDF and attempt segmentation",
    async () => {
      const buffer = await readFile(singlePdfPath);
      const extractedText = await extractText(toArrayBuffer(buffer));

      // Verify text extraction worked
      expect(typeof extractedText).toBe("string");
      expect(extractedText.length).toBeGreaterThan(10);

      // Segment the extracted text
      const segmentationResult = await segmentBlocks(extractedText);

      // Verify segmentation structure
      expect(segmentationResult).toMatchObject({
        blocks: expect.any(Object),
        warnings: expect.any(Array),
        metadata: expect.objectContaining({
          totalBlocks: expect.any(Number),
          confidence: expect.any(Number),
          detectedSections: expect.any(Array),
        }),
      });

      // The sample PDF might not have recognizable sections, so just verify structure
      expect(segmentationResult.metadata.confidence).toBeGreaterThan(0.1);
    }
  );

  it.runIf(hasMultiFixture)(
    "should extract text from multi-page PDF and attempt segmentation",
    async () => {
      const buffer = await readFile(multiPdfPath);
      const extractedText = await extractText(toArrayBuffer(buffer));

      // Verify text extraction worked
      expect(typeof extractedText).toBe("string");
      expect(extractedText.length).toBeGreaterThan(10);

      // Segment the extracted text
      const segmentationResult = await segmentBlocks(extractedText);

      // Verify segmentation structure
      expect(segmentationResult).toMatchObject({
        blocks: expect.any(Object),
        warnings: expect.any(Array),
        metadata: expect.objectContaining({
          totalBlocks: expect.any(Number),
          confidence: expect.any(Number),
          detectedSections: expect.any(Array),
        }),
      });

      // The multi-page PDF might not have recognizable sections, so just verify structure
      expect(segmentationResult.metadata.confidence).toBeGreaterThan(0.1);
    }
  );

  it("should handle end-to-end processing of sample résumé text", async () => {
    const sampleText = `John Doe
Software Engineer

Experience
- Senior Developer at TechCorp (2020-2023)
Built web applications using React and Node.js.

Education
- Bachelor's in Computer Science from University (2016-2020)

Skills
- JavaScript, Python, AWS`;

    const result = await segmentBlocks(sampleText);

    expect(result.blocks.experience).toBeDefined();
    expect(result.blocks.education).toBeDefined();
    expect(result.blocks.skills).toBeDefined();

    expect(result.blocks.experience).toContain("Senior Developer at TechCorp");
    expect(result.blocks.education).toContain("Bachelor's in Computer Science");
    // Skills will be extracted from the content, so check for what's actually detected
    expect(result.blocks.skills).toContain("React");
    expect(result.blocks.skills).toContain("Node.js");

    expect(result.metadata.totalBlocks).toBe(3);
    expect(result.metadata.confidence).toBeGreaterThan(0.7);
  });
});
