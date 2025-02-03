import { defineConfig } from 'vitest/config';
import { CI_PREFLIGHT } from './scripts/env';

const VITEST_SEQUENCE_SEED = Date.now();

console.log('VITEST_SEQUENCE_SEED', VITEST_SEQUENCE_SEED);

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    setupFiles: ['test/setup.ts'],
    include: ['test/**/*.spec.ts'],
    exclude: ['test/integration/**/*.spec.ts'],
    coverage: {
      all: true,
      provider: 'v8',
      reporter: ['clover', 'cobertura', 'lcov', 'text'],
      include: ['src'],
    },
    reporters: CI_PREFLIGHT ? ['basic', 'github-actions'] : ['basic'],
    sequence: {
      seed: VITEST_SEQUENCE_SEED,
      shuffle: true,
    },
    onStackTrace(_, { file }) {
      if (
        file.includes('/src/internal/locale-proxy') ||
        file.includes('/test/support/')
      ) {
        return false;
      }

      return true;
    },
    typecheck: {
      enabled: true,
      include: ['test/**/*.spec-d.ts'],
    },
    onConsoleLog(log, type) {
      if (
        type === 'stderr' &&
        log.includes('[@faker-js/faker]:') &&
        log.includes('deprecated')
      ) {
        return false;
      }
    },
  },
});
