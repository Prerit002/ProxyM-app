import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

/**
 * Moves dist/src/popup/popup.html → dist/popup/popup.html after build
 * so the manifest default_popup path "popup/popup.html" resolves correctly.
 */
function flattenPopupHtml(): Plugin {
  return {
    name: "flatten-popup-html",
    closeBundle() {
      const src = resolve(__dirname, "dist/src/popup/popup.html");
      const destDir = resolve(__dirname, "dist/popup");
      const dest = resolve(destDir, "popup.html");
      if (fs.existsSync(src)) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(src, dest);
        // Remove the now-redundant nested folder
        fs.rmSync(resolve(__dirname, "dist/src"), { recursive: true, force: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), flattenPopupHtml()],
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/popup.html"),
        background: resolve(__dirname, "src/background/background.ts"),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === "background") return "background.js";
          return "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
