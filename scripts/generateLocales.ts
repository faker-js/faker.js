import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Options } from 'prettier';
import { format } from 'prettier';
import options from '../.prettierrc.cjs';
import type { LocaleDefinition } from '../src';
import { DEFINITIONS } from '../src/definitions';

// Constants

const pathRoot = resolve(__dirname, '..');
const pathLocale = resolve(pathRoot, 'src', 'locale');
const pathLocales = resolve(pathRoot, 'src', 'locales');
const pathLocalesIndex = resolve(pathLocales, 'index.ts');
const pathDocsApiLocalization = resolve(
  pathRoot,
  'docs',
  'api',
  'localization.md'
);

const prettierTsOptions: Options = { ...options, parser: 'typescript' };
const prettierMdOptions: Options = { ...options, parser: 'markdown' };

const scriptCommand = 'pnpm run generate:locales';

const autoGeneratedCommentHeader = `/*
 * This file is automatically generated.
 * Run '${scriptCommand}' to update.
 */`;

// Helper functions

function removeIndexTs(files: string[]): string[] {
  const index = files.indexOf('index.ts');
  if (index !== -1) {
    files.splice(index, 1);
  }
  return files;
}

function removeTsSuffix(files: string[]): string[] {
  return files.map((f) => f.replace('.ts', ''));
}

function escapeImport(module: string): string {
  if (module === 'name') {
    return 'name_';
  } else if (module === 'type') {
    return 'type_';
  } else {
    return module;
  }
}

function escapeField(module: string): string {
  if (module === 'name') {
    return 'name: name_';
  } else if (module === 'type') {
    return 'type: type_';
  } else {
    return module;
  }
}

function containsAll(checked?: string[], expected?: string[]): boolean {
  if (typeof expected === 'undefined' || typeof checked === 'undefined') {
    return true;
  }
  return expected.every((c) => checked.includes(c));
}

function generateLocaleFile(locale: string) {
  let content = `
      ${autoGeneratedCommentHeader}

      import { Faker } from '..';
      import ${locale} from '../locales/${locale}';
      ${locale !== 'en' ? "import en from '../locales/en';" : ''}

      const faker = new Faker({
        locale: '${locale}',
        localeFallback: 'en',
        locales: {
          ${locale},
          ${locale !== 'en' ? 'en,' : ''}
        },
      });

      export = faker;
      `;

  content = format(content, prettierTsOptions);
  writeFileSync(resolve(pathLocale, locale + '.ts'), content);
}

function generateLocalesIndexFile(
  path: string,
  name: string,
  type: string,
  depth: number,
  extra: string = '',
  expected?: string[]
) {
  let modules = readdirSync(path);
  modules = removeIndexTs(modules);
  modules = removeTsSuffix(modules);
  const importType = type;
  if (!containsAll(modules, expected)) {
    type = `Partial<${type}>`;
  }
  let fieldType = '';
  let asType = '';
  if (!containsAll(expected, modules)) {
    asType = ` as ${type}`;
  } else {
    fieldType = `: ${type}`;
  }
  let content = `${autoGeneratedCommentHeader}
      import type { ${importType} } from '..${'/..'.repeat(depth)}';
      ${modules
        .map((module) => `import ${escapeImport(module)} from './${module}';`)
        .join('\n')}

      const ${name}${fieldType} = {
        ${extra}
        ${modules.map((module) => `${escapeField(module)},`).join('\n')}
      }${asType};

      export default ${name};
      `;
  content = format(content, prettierTsOptions);
  writeFileSync(resolve(path, 'index.ts'), content);
}

// Start of actual logic

const locales = readdirSync(pathLocales);
removeIndexTs(locales);

let localeIndexImports = "import type { LocaleDefinition } from '..';\n";
let localeIndexType = 'export type KnownLocale =\n';
let localeIndexLocales = 'const locales: KnownLocales = {\n';

let localizationLocales = '| Locale | Name |\n| :--- | :--- |\n';

for (const locale of locales) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const localeDef: LocaleDefinition = require('../src/locales/' +
    locale).default;
  const localeTitle = localeDef.title;
  const localeSeparator = localeDef.separator;

  localeIndexImports += `import ${locale} from './${locale}';\n`;
  localeIndexType += `  | '${locale}'\n`;
  localeIndexLocales += `  ${locale},\n`;
  localizationLocales += `| ${locale} | ${localeTitle} |\n`;

  // src/locale/<locale>.ts
  generateLocaleFile(locale);

  // src/locales/<locale>/index.ts
  const pathModules = resolve(pathLocales, locale);
  generateLocalesIndexFile(
    pathModules,
    locale,
    'LocaleDefinition',
    1,
    `title: '${localeTitle}',` +
      (localeSeparator ? `\nseparator: '${localeSeparator}',` : ''),
    undefined
  );

  let modules = readdirSync(pathModules);
  modules = removeIndexTs(modules);
  modules = removeTsSuffix(modules);
  for (const module of modules) {
    // src/locales/<locale>/<module>/index.ts
    const pathModule = resolve(pathModules, module);
    const def: string[] = DEFINITIONS[module];
    if (typeof def === 'undefined') {
      continue;
    }
    generateLocalesIndexFile(
      pathModule,
      module,
      `${module.replace(/(^|_)([a-z])/g, (s) =>
        s.replace('_', '').toUpperCase()
      )}Definitions`,
      2,
      '',
      def
    );
  }
}

// src/locales/index.ts

let indexContent = `
  ${autoGeneratedCommentHeader}

  ${localeIndexImports}

  ${localeIndexType};

  export type KnownLocales = Record<KnownLocale, LocaleDefinition>;

  ${localeIndexLocales}};

  export default locales;
  `;

indexContent = format(indexContent, prettierTsOptions);
writeFileSync(pathLocalesIndex, indexContent);

// docs/api/localization.md

localizationLocales = format(localizationLocales, prettierMdOptions);

let localizationContent = readFileSync(pathDocsApiLocalization, 'utf-8');
localizationContent = localizationContent.replace(
  /(^<!-- LOCALES-AUTO-GENERATED-START -->$).*(^<!-- LOCALES-AUTO-GENERATED-END -->$)/gms,
  `$1\n\n<!-- Run '${scriptCommand}' to update. -->\n\n${localizationLocales}\n$2`
);
writeFileSync(pathDocsApiLocalization, localizationContent);
