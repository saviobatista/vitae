import { PdfTextExtractionError } from "@/types";

function normalizeWhitespace(input: string): string {
  // Normalize line endings and whitespace, collapse multiples
  let output = input
    .replace(/\r\n?/g, "\n")
    .replace(/[\u00A0\t]/g, " ") // NBSP and tabs to spaces
    .replace(/[ \u00A0]{2,}/g, " "); // collapse multiple spaces

  // Trim each line's edges
  output = output
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");

  // Collapse 3+ newlines to 2
  output = output.replace(/\n{3,}/g, "\n\n");
  return output.trim();
}

/**
 * Extract plain text from a PDF buffer.
 */
export async function extractText(buffer: ArrayBuffer): Promise<string> {
  try {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    // Reduce noisy logs in Node test environment
    try {
      const pdfjsAny = pdfjs as {
        setVerbosityLevel?: (level: number) => void;
        VerbosityLevel?: { ERRORS?: number };
      };
      if (typeof pdfjsAny.setVerbosityLevel === "function") {
        pdfjsAny.setVerbosityLevel(pdfjsAny.VerbosityLevel?.ERRORS ?? 0);
      }
    } catch {}

    const loadingTask = pdfjs.getDocument({
      data: buffer,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const pdf = await loadingTask.promise;

    const pageTexts: string[] = [];
    const numPages = pdf.numPages;
    for (let pageNum = 1; pageNum <= numPages; pageNum += 1) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const strings = content.items
        .map((item: unknown) => {
          if (
            typeof item === "object" &&
            item !== null &&
            "str" in item &&
            typeof (item as { str: unknown }).str === "string"
          ) {
            return (item as { str: string }).str;
          }
          return "";
        })
        .filter(Boolean);
      // Join strings with spaces, then normalize
      const pageText = normalizeWhitespace(strings.join(" "));
      pageTexts.push(pageText);
    }

    const combined = pageTexts.join("\n\n");
    return normalizeWhitespace(combined);
  } catch (error: unknown) {
    const message =
      error instanceof Error && typeof error.message === "string"
        ? error.message
        : "Unknown PDF parsing error";
    if (/Password.*required|Encrypted PDF/i.test(message)) {
      throw new PdfTextExtractionError(
        "Failed to parse PDF: file is encrypted or password-protected."
      );
    }
    if (
      /Invalid PDF structure|Format Error|Parsing error|Bad XRef/i.test(message)
    ) {
      throw new PdfTextExtractionError(
        "Failed to parse PDF: file appears to be invalid or corrupt."
      );
    }
    throw new PdfTextExtractionError(`Failed to parse PDF: ${message}`);
  }
}

export { PdfTextExtractionError };
export default extractText;
