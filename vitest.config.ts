import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
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
        // Strict threshold for core logic
        "src/lib/stores/**/*.ts": {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
        },
        // Show components in report but don't block CI yet
        "src/**/*.svelte": {
          statements: 0,
          branches: 0,
          functions: 0,
          lines: 0,
        },
      },
    },
  },
});
