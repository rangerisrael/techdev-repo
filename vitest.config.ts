import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      "server-only": path.resolve(__dirname, "vitest.server-only-stub.ts"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    exclude: ["node_modules/**", "e2e/**"],
  },
});
