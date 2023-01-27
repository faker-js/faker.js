import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { ProjectReflection } from 'typedoc';
import type { Method } from '../../docs/.vitepress/components/api-docs/method';
import type { APIGroup, APIItem } from '../../docs/api/api-types';
import { formatMarkdown, formatTypescript } from './format';
import {
  extractModuleName,
  extractSourceBaseUrl,
  selectApiMethods,
  selectApiModules,
} from './typedoc';
import type { PageIndex } from './utils';
import { pathDocsDir, pathOutputDir } from './utils';

const pathDocsApiPages = resolve(pathDocsDir, '.vitepress', 'api-pages.ts');
const pathDocsApiSearchIndex = resolve(
  pathDocsDir,
  'api',
  'api-search-index.json'
);

const scriptCommand = 'pnpm run generate:api-docs';

// Moved here because this must not be formatted by prettier
const vitePressInFileOptions = `---
editLink: false
---

`;

/**
 * Writes the api page for the given module to the correct location.
 *
 * @param moduleName The name of the module to write the docs for.
 * @param lowerModuleName The lowercase name of the module.
 * @param comment The module comments.
 * @param methods The methods of the module.
 */
export function writeApiDocsModulePage(
  moduleName: string,
  lowerModuleName: string,
  comment: string,
  methods: Method[]
): void {
  // Write api docs page
  let content = `
  <script setup>
  import ApiDocsMethod from '../.vitepress/components/api-docs/method.vue';
  import ${lowerModuleName} from './${lowerModuleName}.json';
  </script>

  <!-- This file is automatically generated. -->
  <!-- Run '${scriptCommand}' to update -->

  # ${moduleName}

  ::: v-pre

  ${comment}

  :::

  ${methods
    .map(
      (method) => `
  ## ${method.name}

  <ApiDocsMethod :method="${lowerModuleName}.${method.name}" v-once />
  `
    )
    .join('')}
  `.replace(/\n +/g, '\n');

  content = vitePressInFileOptions + formatMarkdown(content);

  writeFileSync(resolve(pathOutputDir, `${lowerModuleName}.md`), content);
}

/**
 * Writes the api docs data to correct location.
 *
 * @param lowerModuleName The lowercase name of the module.
 * @param methods The methods data to save.
 */
export function writeApiDocsData(
  lowerModuleName: string,
  methods: Method[]
): void {
  const content = JSON.stringify(
    methods.reduce<Record<string, Method>>(
      (map, method) => ({
        ...map,
        [method.name]: method,
      }),
      {}
    )
  );

  writeFileSync(resolve(pathOutputDir, `${lowerModuleName}.json`), content);
}

/**
 * Writes the api docs index to correct location.
 *
 * @param pages The pages to write into the index.
 */
export function writeApiPagesIndex(pages: PageIndex): void {
  // Write api-pages.ts
  console.log('Updating api-pages.ts');
  pages.sort((a, b) => a.text.localeCompare(b.text));
  pages.splice(0, 0, { text: 'Overview', link: '/api/' });
  let apiPagesContent = `
    // This file is automatically generated.
    // Run '${scriptCommand}' to update
    export const apiPages = ${JSON.stringify(pages)};
    `.replace(/\n +/, '\n');

  apiPagesContent = formatTypescript(apiPagesContent);

  writeFileSync(pathDocsApiPages, apiPagesContent);
}

export function writeApiSearchIndex(project: ProjectReflection): void {
  const apiIndex: APIGroup[] = [];

  const moduleApiSection: APIGroup = {
    text: 'Module API',
    items: [],
  };

  apiIndex.push(moduleApiSection);

  const apiModules = selectApiModules(project);

  moduleApiSection.items = apiModules
    .map((module) => {
      const moduleName = extractModuleName(module);
      const apiSection: APIItem = {
        text: moduleName,
        link: moduleName.toLowerCase(),
        headers: selectApiMethods(module).map((child) => ({
          anchor: child.name,
          text: child.name,
        })),
      };

      return apiSection;
    })
    .sort((a, b) => a.text.localeCompare(b.text));

  writeFileSync(pathDocsApiSearchIndex, JSON.stringify(apiIndex));
}

export function writeSourceBaseUrl(project: ProjectReflection): void {
  const baseUrl = extractSourceBaseUrl(project);

  let content = `
  // This file is automatically generated.
  // Run '${scriptCommand}' to update
  export const sourceBaseUrl = '${baseUrl}';
  `.replace(/\n +/, '\n');

  content = formatTypescript(content);

  writeFileSync(resolve(pathOutputDir, 'source-base-url.ts'), content);
}
