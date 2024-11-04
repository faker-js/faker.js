// TODO @ST-DDT 2024-11-04: This file can be removed in v2.0.0 which requires Node 20+
declare module 'eslint-plugin-file-progress' {
  import type { Rule } from 'eslint';

  export const rules: {
    activate: Rule.RuleModule;
  };
}
