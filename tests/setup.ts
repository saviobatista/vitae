// Filter noisy pdfjs warnings that do not affect text extraction
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  const [first] = args;
  const msg = typeof first === "string" ? first : "";
  if (
    msg.includes("Warning: Cannot access the `require` function") ||
    msg.includes("Warning: Cannot polyfill `DOMMatrix`") ||
    msg.includes("Warning: Cannot polyfill `ImageData`") ||
    msg.includes("Warning: Cannot polyfill `Path2D`") ||
    msg.includes("Warning: Indexing all PDF objects") ||
    msg.includes(
      "Warning: UnknownErrorException: Ensure that the `standardFontDataUrl` API parameter is provided"
    )
  ) {
    return;
  }
  // passthrough others
  return (originalWarn as any)(...args);
};
