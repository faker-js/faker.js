import { defineConfig } from 'vitest/config';
import config from './vitest.config';

delete config.test?.coverage;
delete config.test?.typecheck;
delete config.test?.exclude;

export default defineConfig({
  test: {
    ...config.test,
    include: ['test/integration/**/*.spec.ts'],
    testTimeout: 30000,
  },
});
