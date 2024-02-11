import { beforeAll, describe, expect, it } from 'vitest';
import { analyzeModule } from '../../../scripts/apidoc/module-methods';
import { initMarkdownRenderer } from '../../../scripts/apidoc/utils/markdown';
import * as ModuleTests from './module.example';
import { loadExampleModules } from './utils';

beforeAll(initMarkdownRenderer);
const modules = await loadExampleModules();

describe('module', () => {
  describe('analyzeModule()', () => {
    it('dummy dependency to rerun the test if the example changes', () => {
      expect(Object.keys(ModuleTests)).not.toEqual([]);
    });

    it('expected and actual modules are equal', () => {
      expect(Object.keys(modules).sort()).toMatchSnapshot();
    });

    it.each(Object.entries(modules))('%s', (_, module) => {
      const actual = analyzeModule(module);

      expect(actual).toMatchSnapshot();
    });
  });
});
