import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["tests/contracts/**/*.contract.{ts,tsx}"],
    coverage: {
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage/contract",
    },
  },
});

