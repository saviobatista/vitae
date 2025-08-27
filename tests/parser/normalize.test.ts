import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

import en from "@/i18n/messages/en.json";
import extractText from "@/parser/extractText";
import { normalizeBlock } from "@/parser/normalize";

const fixturesDir = path.resolve(__dirname, "..", "fixtures");
const singlePdfPath = path.join(fixturesDir, "sample.pdf");
const hasSingleFixture = existsSync(singlePdfPath);
const multiPdfPath = path.join(fixturesDir, "sample-multi-page.pdf");
const hasMultiFixture = existsSync(multiPdfPath);

const L = en.parser.dates;

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  const ab = new ArrayBuffer(buf.byteLength);
  new Uint8Array(ab).set(buf);
  return ab;
}

const normNL = (s: string) => s.replace(/\r\n?/g, "\n");

const hasAlpha = (s: string) => /[A-Za-zÀ-ÿ]/.test(s);
const ISO_RANGE_RE = /\b\d{4}(?:-\d{2})?\s-\s(?:\d{4}(?:-\d{2})?|Present)\b/;

describe("Integration: extractText + normalizeBlock", () => {
  it.runIf(hasSingleFixture)(
    "normalizes sample.pdf (single page)",
    async () => {
      const buffer = await readFile(singlePdfPath);
      const text = await extractText(toArrayBuffer(buffer));

      expect(typeof text).toBe("string");
      expect(text.length).toBeGreaterThan(10);

      const normalized = normalizeBlock(text, L);

      expect(typeof normalized).toBe("string");
      expect(normalized.length).toBeGreaterThan(10);
      expect(hasAlpha(normalized)).toBe(true);

      expect(normalized).not.toMatch(/ {2,}/);
      expect(normalized).not.toMatch(/\n{3,}/);
      for (const line of normNL(normalized).split("\n")) {
        expect(line.endsWith(" ")).toBe(false);
      }

      if (
        /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|Now|20\d{2})\b/i.test(
          normalized
        )
      ) {
        expect(ISO_RANGE_RE.test(normalized)).toBe(true);
      }
    },
    30_000
  );

  it.runIf(hasMultiFixture)(
    "normalizes sample-multi-page.pdf",
    async () => {
      const buffer = await readFile(multiPdfPath);
      const text = await extractText(toArrayBuffer(buffer));

      expect(typeof text).toBe("string");
      expect(text.length).toBeGreaterThan(10);

      const normalized = normalizeBlock(text, L);

      expect(typeof normalized).toBe("string");
      expect(normalized.length).toBeGreaterThan(20);
      expect(hasAlpha(normalized)).toBe(true);

      expect(normalized).not.toMatch(/ {2,}/);
      expect(normalized).not.toMatch(/\n{3,}/);

      const lineCount = normNL(normalized).split("\n").length;
      expect(lineCount).toBeGreaterThan(2);
    },
    30_000
  );

  it("end-to-end on synthetic text (no PDF)", async () => {
    const raw = [
      "Jan 2020 – Present",
      "Desenvolvi um sis-",
      "tema em Node.js  ",
      "- Bullet A",
      "- Bullet B",
      "Mar 2019 - Jul 2021",
    ].join("\n");

    const out = normalizeBlock(raw, L);
    const HAY = normNL(out);

    const DESC_RE = /Desenvolvi\s+um\s+sistema\s+em\s+Node\.js/;
    const BULLET_A_RE = /[–-][\s\u00A0]*Bullet A\b/;
    const BULLET_B_RE = /[–-][\s\u00A0]*Bullet B\b/;

    expect(HAY).toContain("2020-01 - Present");
    expect(HAY).toMatch(DESC_RE);
    expect(HAY).toMatch(BULLET_A_RE);
    expect(HAY).toMatch(BULLET_B_RE);
    expect(HAY).toContain("2019-03 - 2021-07");

    const idxDateOpen = HAY.indexOf("2020-01 - Present");
    const idxDesc = HAY.search(DESC_RE);
    const idxBulletA = HAY.search(BULLET_A_RE);
    const idxBulletB = HAY.search(BULLET_B_RE);
    const idxDateEnd = HAY.indexOf("2019-03 - 2021-07");

    expect(idxDateOpen).toBeGreaterThanOrEqual(0);
    expect(idxDesc).toBeGreaterThan(idxDateOpen);
    expect(idxBulletA).toBeGreaterThan(idxDesc);
    expect(idxBulletB).toBeGreaterThan(idxBulletA);
    expect(idxDateEnd).toBeGreaterThan(idxBulletB);

    expect(HAY).not.toMatch(/ {2,}/);
    expect(HAY).not.toMatch(/\n{3,}/);
  });
});
