import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", ".next", "dist"],
    globals: false,
    setupFiles: ["tests/setup.ts"],
    reporters: ["default"],
    hookTimeout: 20000,
    testTimeout: 30000,
    onConsoleLog(log, type) {
      // Silence known benign pdfjs-dist warnings in Node
      if (
        typeof log === "string" &&
        (log.includes("Warning: Cannot access the `require` function") ||
          log.includes("Warning: Cannot polyfill `DOMMatrix`") ||
          log.includes("Warning: Cannot polyfill `ImageData`") ||
          log.includes("Warning: Cannot polyfill `Path2D`") ||
          log.includes("Warning: Indexing all PDF objects") ||
          log.includes(
            "Warning: UnknownErrorException: Ensure that the `standardFontDataUrl` API parameter is provided"
          ))
      ) {
        return false;
      }
    },
  },
});
