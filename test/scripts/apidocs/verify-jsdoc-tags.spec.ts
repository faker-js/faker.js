import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isSemVer, isURL } from 'validator';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { processComponents } from '../../../scripts/apidocs/generate';
import { extractSummaryDefault } from '../../../scripts/apidocs/output/page';
import { getProject } from '../../../scripts/apidocs/project';

// This test suite ensures, that every method
// - has working examples
// - running these do not log anything, unless the method is deprecated
// - has a valid @since tag
// - has valid @see tags
// - has proper links in the description

const tempDir = resolve(dirname(fileURLToPath(import.meta.url)), 'temp');
const relativeImportPath = `${'../'.repeat(5)}src`;

afterAll(() => {
  // Remove temp folder
  if (existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true });
  }
});

const modules = processComponents(getProject());

function resolveDirToModule(moduleName: string): string {
  return resolve(tempDir, moduleName);
}

function resolvePathToMethodFile(
  moduleName: string,
  methodName: string,
  signature: number
): string {
  const dir = resolveDirToModule(moduleName);
  // TODO @ST-DDT 2024-09-23: Remove this in v10
  if (methodName === 'userName') {
    methodName = 'userNameDeprecated';
  }

  return resolve(dir, `${methodName}_${signature}.ts`);
}

const allowedReferences = new Set(
  modules.flatMap(({ camelTitle, methods, category }) => {
    return methods.map(({ name }) =>
      category ? `faker.${camelTitle}.${name}` : `${camelTitle}.${name}`
    );
  })
);
const allowedLinks = new Set(
  modules.flatMap(({ camelTitle, methods }) => {
    return [
      `/api/${camelTitle}.html`,
      ...methods.map(
        ({ name }) => `/api/${camelTitle}.html#${name.toLowerCase()}`
      ),
    ];
  })
);

function assertDescription(description: string): void {
  const linkRegexp = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [...description.matchAll(linkRegexp)].map((m) => m[2]);

  for (const link of links) {
    expect(link).toMatch(/^https?:\/\//);
    expect(link).toSatisfy(isURL);

    if (link.includes('fakerjs.dev/api/')) {
      expect(allowedLinks, `${link} to point to a valid target`).toContain(
        link.replace(/.*fakerjs.dev\//, '/')
      );
    }
  }
}

describe('check docs completeness', () => {
  it('all modules and methods are present', () => {
    // This could be converted to an Object, but that would erase the order of the pages
    const pageContents = modules.map((m) => [
      m.camelTitle,
      m.methods.map((m) => m.name),
    ]);

    expect(pageContents).toMatchSnapshot();
  });
});

describe('verify JSDoc tags', () => {
  describe.each(modules.map((m) => [m.camelTitle, m]))(
    '%s',
    (moduleName, module) => {
      describe('verify module', () => {
        it('verify description', () => {
          assertDescription(module.description);
        });
      });

      describe.each(module.methods.map((m) => [m.name, m]))(
        '%s',
        (methodName, method) => {
          describe.each(method.signatures.map((s, i) => [i, s]))(
            '%i',
            (signatureIndex, signature) => {
              beforeAll(() => {
                // Write temp files to disk
                // By extracting the examples
                // Guessing required imports
                // And saving them to disk for later execution

                const dir = resolveDirToModule(moduleName);
                mkdirSync(dir, { recursive: true });
                const path = resolvePathToMethodFile(
                  moduleName,
                  methodName,
                  signatureIndex
                );

                let examples = signature.examples.join('\n');
                if (moduleName === 'faker' && methodName === 'constructor') {
                  // That case should demonstrate an error and is thus not suitable for testing
                  examples = examples.replace(
                    'customFaker.music.genre()',
                    '// customFaker.music.genre()'
                  );
                }

                // Replace imports for users with our source path
                examples = examples.replaceAll(
                  " from '@faker-js/faker'",
                  ` from '${relativeImportPath}'`
                );

                if (moduleName === 'randomizer') {
                  examples = `import { generateMersenne32Randomizer } from '${relativeImportPath}/utils/mersenne';

const randomizer = generateMersenne32Randomizer();

${examples}`;
                }

                // If imports are present, we expect them to be complete
                if (!examples.includes('import ')) {
                  const imports = [
                    // collect the imports for the various locales e.g. fakerDE_CH
                    ...new Set(examples.match(/(?<!\.)faker[^.]*(?=\.)/g)),
                  ];

                  if (imports.length > 0) {
                    examples = `import { ${imports.join(
                      ', '
                    )} } from '${relativeImportPath}';\n\n${examples}`;
                  }
                }

                writeFileSync(path, examples);
              });

              it('verify description', () => {
                assertDescription(signature.description);
              });

              it('verify @example tag', { timeout: 30000 }, async () => {
                const examples = signature.examples.join('\n');

                expect(
                  examples,
                  `${moduleName}.${methodName} to have examples`
                ).not.toBe('');

                // Grab path to example file
                const path = resolvePathToMethodFile(
                  moduleName,
                  methodName,
                  signatureIndex
                );

                // Executing the examples should not throw
                await expect(
                  import(`${path}?scope=example`),
                  examples
                ).resolves.toBeDefined();
              });

              // This only checks whether the whole method is deprecated or not
              // It does not check whether the method is deprecated for a specific set of arguments
              it('verify @deprecated tag', { timeout: 30000 }, async () => {
                // Grab path to example file
                const path = resolvePathToMethodFile(
                  moduleName,
                  methodName,
                  signatureIndex
                );

                const consoleWarnSpy = vi.spyOn(console, 'warn');

                // Run the examples
                await import(`${path}?scope=deprecated`);

                // Verify that deprecated methods log a warning
                const { deprecated } = signature;
                if (deprecated == null) {
                  expect(consoleWarnSpy).not.toHaveBeenCalled();
                } else {
                  expect(consoleWarnSpy).toHaveBeenCalled();
                  expect(deprecated).not.toBe('');
                }
              });

              describe.each(signature.parameters.map((p) => [p.name, p]))(
                '%s',
                (_, parameter) => {
                  it('verify default value', () => {
                    const {
                      name,
                      default: paramDefault,
                      description,
                    } = parameter;

                    const commentDefault = extractSummaryDefault(description);
                    if (paramDefault) {
                      if (
                        /^{.*}$/.test(paramDefault) ||
                        paramDefault.includes('\n')
                      ) {
                        expect(commentDefault).toBeUndefined();
                      } else if (
                        !name.includes('.') &&
                        // Skip check of defaults in descriptions if it is a paraphrased function call
                        (commentDefault ||
                          (!description.includes('Defaults to') &&
                            !paramDefault.includes('(')))
                      ) {
                        expect(
                          commentDefault,
                          `Expect '${name}'s js implementation default to be the same as the jsdoc summary default`
                        ).toBe(paramDefault);
                      }
                    }
                  });

                  it('verify description', () => {
                    assertDescription(parameter.description);
                  });
                }
              );

              it('verify @see tags', () => {
                for (const link of signature.seeAlsos) {
                  if (link.startsWith('faker.')) {
                    // Expected @see faker.xxx.yyy()
                    expect(
                      link,
                      'Expect method reference to contain ()'
                    ).toContain('(');
                    expect(
                      link,
                      'Expect method reference to contain ()'
                    ).toContain(')');
                    expect(
                      link,
                      "Expect method reference to have a ': ' after the parenthesis"
                    ).toContain('): ');
                    expect(
                      link,
                      'Expect method reference to have a description starting with a capital letter'
                    ).toMatch(/\): [A-Z]/);
                    expect(
                      link,
                      'Expect method reference to start with a standard description phrase'
                    ).toMatch(
                      /\): (?:For generating |For more information about |For using |For the replacement method)/
                    );
                    expect(
                      link,
                      'Expect method reference to have a description ending with a dot'
                    ).toMatch(/\.$/);
                    expect(allowedReferences).toContain(
                      link.replace(/\(.*/, '')
                    );
                  }
                }
              });

              it('verify @since tag', () => {
                const { since } = signature;
                expect(since, '@since to be present').toBeTruthy();
                expect(since).not.toBe('');
                expect(since, '@since to be a valid semver').toSatisfy(
                  isSemVer
                );
              });
            }
          );
        }
      );
    }
  );
});
