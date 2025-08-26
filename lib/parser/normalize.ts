export function normalizeWhitespace(input: string): string {
  const unicodeNormalized =
    typeof input.normalize === "function" ? input.normalize("NFKC") : input;

  const lineBreaksNormalized = unicodeNormalized.replace(/\r\n?/g, "\n");

  const spacesStandardized = lineBreaksNormalized.replace(/\u00A0|\t/g, " ");

  const lineEndsTrimmed = spacesStandardized
    .split("\n")
    .map((line) => line.replace(/[ ]+$/g, ""))
    .join("\n");

  const spacesCollapsed = lineEndsTrimmed.replace(/[ ]{2,}/g, " ");

  const dashesNormalized = spacesCollapsed.replace(/[–—]/g, "–");

  const paragraphsNormalized = dashesNormalized.replace(/\n{3,}/g, "\n\n");

  const result = paragraphsNormalized.trim();

  return result;
}
