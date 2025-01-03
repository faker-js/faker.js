import { defineConfig } from 'tsup';
import { allLocales } from './src';

export default defineConfig({
  entry: [
    'src/index.ts',
    ...Object.keys(allLocales).map((locale) => `src/locale/${locale}.ts`),
  ],
  outDir: 'dist',
  clean: true,
  format: ['esm', 'cjs'],
  target: ['es2022', 'node18'],
  dts: true,
  minify: true,
  sourcemap: false,
  splitting: true,
});
