import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['./**/*.ts'],
      exclude: ['**/*.spec.ts', '**/*.d.ts', 'node_modules/**'],
      thresholds: {
        // Requires 90% function coverage
        functions: 90,
        // Require that no more than 10 lines are uncovered
        lines: -10,
      },
    },
  },
});
