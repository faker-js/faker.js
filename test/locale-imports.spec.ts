import { describe, expect, it } from 'vitest';
import type { Faker } from '../src';
import { allLocales } from '../src';
import { keys } from '../src/internal/keys';

describe.each(keys(allLocales))('locale imports', (locale) => {
  it(`should be possible to directly require('@faker-js/faker/locale/${locale}')`, () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, unicorn/prefer-module
    const { faker } = require(`../dist/locale/${locale}.cjs`) as {
      faker: Faker;
    };

    expect(faker).toBeDefined();
    expect(faker.string.alpha()).toBeTypeOf('string');
    expect(faker.definitions.metadata.title).toBe(
      allLocales[locale].metadata?.title
    );
  });

  it(`should be possible to directly import('@faker-js/faker/locale/${locale}')`, async () => {
    const { faker } = (await import(`../dist/locale/${locale}.js`)) as {
      faker: Faker;
    };

    expect(faker).toBeDefined();
    expect(faker.string.alpha()).toBeTypeOf('string');
    expect(faker.definitions.metadata.title).toBe(
      allLocales[locale].metadata?.title
    );
  });

  it('should have complete metadata values', () => {
    const metadata = allLocales[locale].metadata ?? {};
    expect(metadata.title).toBeTypeOf('string');
    expect(metadata.code).toBeTypeOf('string');
    expect(metadata.code).toEqual(locale);
    if (locale !== 'base') {
      expect(metadata.code).toEqual(
        [metadata.language, metadata.country, metadata.variant]
          .filter((v) => v != null)
          .join('_')
      );
      expect(metadata.language).toBeTypeOf('string');
      expect(metadata.language).toMatch(/^[a-z]{2}$/);
      expect(metadata.script).toBeTypeOf('string');
      expect([
        'Arab',
        'Armn',
        'Cyrl',
        'Deva',
        'Geor',
        'Grek',
        'Hans',
        'Hant',
        'Hebr',
        'Jpan',
        'Kore',
        'Latn',
        'Thaa',
        'Thai',
      ]).toContain(metadata.script);
      expect(metadata.endonym).toBeTypeOf('string');
      expect(metadata.dir).toBeTypeOf('string');
      expect(['ltr', 'rtl']).toContain(metadata.dir);
      if (metadata.country) {
        expect(metadata.country).toBeTypeOf('string');
        expect(metadata.country).toMatch(/^[A-Z]{2}$/);
      }
    }
  });
});
