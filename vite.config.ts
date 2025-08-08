import { defineConfig } from "vite";

// Prevent Vitest/Vite from loading project PostCSS config during tests
export default defineConfig({
  css: {
    postcss: {
      plugins: [],
    },
  },
});
