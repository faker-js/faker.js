import type { MockInstance } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { Faker, faker, generateMersenne32Randomizer } from '../src';
import { FakerError } from '../src/errors/faker-error';
import { keys } from '../src/internal/keys';

describe('faker', () => {
  it('should not log anything on startup', async () => {
    const spies: MockInstance[] = keys(console)
      .filter((key) => typeof console[key] === 'function')
      .map((methodName) => vi.spyOn(console, methodName));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: Types may or may not exist, depending on whether the project was built first.
    const file: unknown = await import('..');
    expect(file).toBeDefined();

    new Faker({ locale: { metadata: { title: '' } } });

    for (const spy of spies) {
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    }
  });

  describe('getMetadata()', () => {
    it('should return metadata for the locale', () => {
      expect(faker.getMetadata()).toBeDefined();
      expect(faker.getMetadata().title).toBeTypeOf('string');
      // Not all properties are tested here, see locale-imports.spec.ts for full tests
    });
  });

  describe('rawDefinitions', () => {
    it('locale rawDefinition accessibility', () => {
      // Metadata
      expect(faker.rawDefinitions.metadata?.title).toBeDefined();
      // Standard modules
      expect(faker.rawDefinitions.location?.city_name).toBeDefined();
      // Non-existing module
      expect(faker.rawDefinitions.missing).toBeUndefined();
      // Non-existing definition in a non-existing module
      expect(faker.rawDefinitions.missing?.missing).toBeUndefined();
      // Non-existing definition in an existing module
      expect(faker.rawDefinitions.location?.missing).toBeUndefined();
    });
  });

  describe('definitions', () => {
    it('locale definition accessibility', () => {
      // Metadata
      expect(faker.definitions.metadata.title).toBeDefined();
      // Standard modules
      expect(faker.definitions.location.city_name).toBeDefined();
      // Non-existing module
      expect(faker.definitions.missing).toBeDefined();
      // Non-existing definition in a non-existing module
      expect(() => faker.definitions.missing?.missing).toThrow();
      // Non-existing definition in an existing module
      expect(() => faker.definitions.location.missing).toThrow();
    });
  });

  describe('constructor()', () => {
    describe('locale', () => {
      it('should throw error if no locales passed', () => {
        expect(() => new Faker({ locale: [] })).toThrow(
          new FakerError(
            'The locale option must contain at least one locale definition.'
          )
        );
      });
    });

    describe('randomizer', () => {
      it('should be possible to provide a custom Randomizer', () => {
        const customFaker = new Faker({
          locale: {},
          randomizer: {
            next: () => 0,
            seed: () => void 0,
          },
        });

        expect(customFaker.number.int()).toBe(0);
        expect(customFaker.number.int()).toBe(0);
        expect(customFaker.number.int()).toBe(0);
      });
    });

    describe('seed', () => {
      it('should be possible to provide an initial seed', () => {
        const customFaker = new Faker({
          locale: {},
          seed: 12345,
        });

        expect(customFaker.number.int()).toBe(8373237378417847);
        expect(customFaker.number.int()).toBe(2849657659447330);
        expect(customFaker.number.int()).toBe(1656593383470774);

        customFaker.seed(12345);

        expect(customFaker.number.int()).toBe(8373237378417847);
        expect(customFaker.number.int()).toBe(2849657659447330);
        expect(customFaker.number.int()).toBe(1656593383470774);
      });
    });

    describe('randomizer+seed', () => {
      it('should take apply both the randomizer and seed', () => {
        const customFaker = new Faker({
          locale: {},
          randomizer: generateMersenne32Randomizer(67890),
          seed: 12345,
        });

        expect(customFaker.number.int()).toBe(8373237322874880);
        expect(customFaker.number.int()).toBe(8017800868134912);
        expect(customFaker.number.int()).toBe(2849657711493120);

        customFaker.seed(12345); // Retry with the expected seed

        expect(customFaker.number.int()).toBe(8373237322874880);
        expect(customFaker.number.int()).toBe(8017800868134912);
        expect(customFaker.number.int()).toBe(2849657711493120);
      });
    });
  });

  // This is only here for coverage
  // The actual test is in mersenne.spec.ts
  describe('seed()', () => {
    it('seed()', () => {
      const seed = faker.seed();

      expect(seed).toBeDefined();
      expect(seed).toBeTypeOf('number');
    });

    it('should reset the sequence when calling `seed`', () => {
      const seed = faker.seed();

      const num1 = faker.number.int();

      const newSeed = faker.seed(seed);
      const num2 = faker.number.int();

      expect(num1).toBe(num2);
      expect(newSeed).toBe(seed);

      const num3 = faker.number.int();
      expect(num1).not.toBe(num3);
    });

    it('seed(number)', () => {
      faker.seed(1);

      const actual = faker.animal.cat();
      expect(actual).toBe('Korat');
    });

    it('seed(number[])', () => {
      faker.seed([1, 2, 3]);

      const actual = faker.animal.cat();
      expect(actual).toBe('Oriental');
    });
  });

  describe('defaultRefDate', () => {
    it('should be a defined', () => {
      expect(faker.defaultRefDate).toBeDefined();
    });

    it('should be a date in the very recent past', () => {
      const start = Date.now();
      const refDate = faker.defaultRefDate().getTime();
      const end = Date.now();
      expect(refDate).toBeGreaterThanOrEqual(start);
      expect(refDate).toBeLessThanOrEqual(end);
    });
  });
});
