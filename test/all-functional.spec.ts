import { describe, expect, it } from 'vitest';
import type { Faker, allLocales } from '../src';
import { allFakers, fakerEN } from '../src';
import { keys } from '../src/internal/keys';

const IGNORED_MODULES = new Set(['definitions', 'helpers', 'fakerCore']);

function getMethodNamesByModules(faker: Faker): { [module: string]: string[] } {
  return Object.fromEntries(
    Object.keys(faker)
      .filter(isTestableModule)
      .sort()
      .map<[string, string[]]>((moduleName) => [
        moduleName,
        getMethodNamesOf(faker[moduleName]),
      ])
      .filter(([module, methods]) => {
        if (methods.length === 0) {
          console.log(`Skipping ${module} - No testable methods`);
          return false;
        }

        return true;
      })
  );
}

function isTestableModule(moduleName: string): moduleName is keyof Faker {
  return !IGNORED_MODULES.has(moduleName);
}

function getMethodNamesOf(module: object): string[] {
  return keys(module).filter((method) => typeof module[method] === 'function');
}

type SkipConfig<TModule> = Partial<
  Record<keyof TModule, '*' | ReadonlyArray<keyof typeof allLocales>>
>;

const BROKEN_LOCALE_METHODS = {
  // TODO @ST-DDT 2022-03-28: these are TODOs (usually broken locale files)
  date: {
    between: '*',
    betweens: '*',
  },
  location: {
    state: ['az', 'nb_NO', 'ro_MD'],
    zipCode: ['en_HK'],
  },
  string: {
    fromCharacters: '*',
  },
  person: {
    prefix: ['az', 'id_ID', 'ru', 'zh_CN', 'zh_TW'],
    suffix: ['az', 'it', 'mk', 'pt_PT', 'ro_MD', 'ru'],
  },
} satisfies {
  [module_ in keyof Faker]?: SkipConfig<Faker[module_]>;
};

function isWorkingLocaleForMethod(
  module: string,
  method: string,
  locale: string
): boolean {
  // @ts-expect-error: We don't have types for the dynamic access
  const broken = BROKEN_LOCALE_METHODS[module]?.[method] ?? [];
  return broken !== '*' && !broken.includes(locale);
}

// Basic smoke tests to make sure each method is at least implemented and returns a value.

const modules = getMethodNamesByModules(fakerEN);

describe('BROKEN_LOCALE_METHODS test', () => {
  it('should not contain obsolete configuration (modules)', () => {
    const existingModules = Object.keys(modules);
    const configuredModules = Object.keys(BROKEN_LOCALE_METHODS);
    const obsoleteModules = configuredModules.filter(
      (module) => !existingModules.includes(module)
    );

    expect(obsoleteModules, 'No obsolete configuration').toEqual([]);
  });

  describe.each(Object.keys(modules))('%s', (module) => {
    it('should not contain obsolete configuration (methods)', () => {
      const existingMethods = modules[module];
      const configuredMethods = Object.keys(
        // @ts-expect-error: We don't have types for the dynamic access
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        BROKEN_LOCALE_METHODS[module] ?? {}
      );
      const obsoleteMethods = configuredMethods.filter(
        (method) => !existingMethods.includes(method)
      );

      expect(obsoleteMethods, 'No obsolete configuration').toEqual([]);
    });
  });
});

describe('functional tests', () => {
  describe.each(Object.entries(allFakers))('%s', (locale, faker) => {
    if (locale === 'base') {
      it.skip('base locale is checked by other tests');
      return;
    }

    describe.each(Object.entries(modules))('%s', (module, methods) => {
      // eslint-disable-next-line vitest/prefer-each -- need to dynamically succeed/fail
      for (const meth of methods) {
        const testAssertion = () => {
          // TODO @ST-DDT 2022-03-28: Use random seed once there are no more failures
          faker.seed(1);
          // @ts-expect-error: We don't have types for the dynamic access
          const result = faker[module][meth]();

          if (meth === 'boolean') {
            expect(result).toBeTypeOf('boolean');
          } else {
            expect(result).toBeTruthy();
            expect(result).not.toEqual([]);
          }
        };

        if (isWorkingLocaleForMethod(module, meth, locale)) {
          it(`${meth}()`, testAssertion);
        } else {
          // TODO @ST-DDT 2022-03-28: Remove once there are no more failures
          // We expect a failure here to ensure we remove the exclusions when fixed
          it.fails(`${meth}()`, testAssertion);
        }
      }
    });
  });
});

describe('faker.helpers.fake functional tests', () => {
  describe.each(Object.entries(allFakers))('%s', (locale, faker) => {
    if (locale === 'base') {
      it.skip('base locale is checked by other tests');
      return;
    }

    describe.each(Object.entries(modules))('%s', (module, methods) => {
      // eslint-disable-next-line vitest/prefer-each -- need to dynamically succeed/fail
      for (const meth of methods) {
        const testAssertion = () => {
          // TODO @ST-DDT 2022-03-28: Use random seed once there are no more failures
          faker.seed(1);
          const result = faker.helpers.fake(`{{${module}.${meth}}}`);

          expect(result).toBeTypeOf('string');
          expect(result).not.toBe('');
          expect(result).not.toBe('null');
          expect(result).not.toBe('undefined');
        };

        if (isWorkingLocaleForMethod(module, meth, locale)) {
          it(`${meth}()`, testAssertion);
        } else {
          // TODO @ST-DDT 2022-03-28: Remove once there are no more failures
          // We expect a failure here to ensure we remove the exclusions when fixed
          it.fails(`${meth}()`, testAssertion);
        }
      }
    });
  });
});
