import type { DeclarationReflection, ProjectReflection } from 'typedoc';
import type { Method } from '../../docs/.vitepress/components/api-docs/method';
import { writeApiDocsModule } from './apiDocsWriter';
import { analyzeSignature, toBlock } from './signature';
import {
  extractModuleFieldName,
  extractModuleName,
  selectApiMethodSignatures,
  selectApiModules,
} from './typedoc';
import type { PageAndDiff, PageAndDiffIndex } from './utils';

/**
 * Analyzes and writes the documentation for modules and their methods such as `faker.animal.cat()`.
 *
 * @param project The project used to extract the modules.
 * @returns The generated pages.
 */
export function processModules(project: ProjectReflection): PageAndDiffIndex {
  return selectApiModules(project).map(processModule);
}

/**
 * Analyzes and writes the documentation for a module and its methods such as `faker.animal.cat()`.
 *
 * @param module The module to process.
 * @returns The generated pages.
 */
function processModule(module: DeclarationReflection): PageAndDiff {
  const moduleName = extractModuleName(module);
  const moduleFieldName = extractModuleFieldName(module);
  console.log(`Processing Module ${moduleName}`);
  const comment = toBlock(module.comment);
  const methods = processMethods(module, `faker.${moduleFieldName}.`);

  return writeApiDocsModule(moduleName, moduleFieldName, comment, methods);
}

export function processMethods(
  module: DeclarationReflection,
  accessor: string
): Method[] {
  const methods: Method[] = [];

  for (const [methodName, signature] of Object.entries(
    selectApiMethodSignatures(module)
  )) {
    console.debug(`- ${methodName}`);
    methods.push(analyzeSignature(signature, accessor, methodName));
  }

  return methods;
}
