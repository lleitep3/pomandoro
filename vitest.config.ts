import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig(({ mode }) => ({
  plugins: [svelte({ hot: !process.env.VITEST })],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["src/**/*.{test,spec}.{js,ts}"],
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      all: true,
      include: ["src/**/*.{ts,svelte}"],
      exclude: [
        "src/**/*.{test,spec}.ts",
        "src/**/test-setup.ts",
        "src/main.ts",
        "src/env.d.ts",
        "**/node_modules/**",
        "**/dist/**",
        "**/*.d.ts",
      ],
      thresholds: {
        // Strict threshold for core logic (Business Rules)
        "src/lib/stores/**/*.ts": {
          statements: 90,
          branches: 75,
          functions: 90,
          lines: 90,
        },
        // Components are tested via E2E as per AGENTS.md
        "src/**/*.svelte": {
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0,
        },
      },
    },
  },
}));
