import type { MockInstance } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { generateMersenne32Randomizer, SimpleFaker, simpleFaker } from '../src';
import { keys } from '../src/internal/keys';

describe('simpleFaker', () => {
  it('should not log anything on startup', () => {
    const spies: MockInstance[] = keys(console)
      .filter((key) => typeof console[key] === 'function')
      .map((methodName) => vi.spyOn(console, methodName));

    // eslint-disable-next-line @typescript-eslint/no-require-imports, unicorn/prefer-module -- Using import() requires types being build but the CI / TS-Check runs without them.
    expect(require('..').simpleFaker).toBeDefined();

    expect(new SimpleFaker()).toBeDefined();

    for (const spy of spies) {
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    }
  });

  describe('constructor()', () => {
    describe('randomizer', () => {
      it('should be possible to provide a custom Randomizer', () => {
        const customFaker = new SimpleFaker({
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
        const customFaker = new SimpleFaker({
          seed: 12345,
        });

        expect(customFaker.number.int()).toBe(8373237378417847);
        expect(customFaker.number.int()).toBe(2849657659447330);
        expect(customFaker.number.int()).toBe(1656593383470774);

        customFaker.seed(12345); // Retry with the expected seed

        expect(customFaker.number.int()).toBe(8373237378417847);
        expect(customFaker.number.int()).toBe(2849657659447330);
        expect(customFaker.number.int()).toBe(1656593383470774);
      });
    });

    describe('randomizer+seed', () => {
      it('should take apply both the randomizer and seed', () => {
        const customFaker = new SimpleFaker({
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
      const seed = simpleFaker.seed();

      expect(seed).toBeDefined();
      expect(seed).toBeTypeOf('number');
    });

    it('should reset the sequence when calling `seed`', () => {
      const seed = simpleFaker.seed();

      const num1 = simpleFaker.number.int();

      const newSeed = simpleFaker.seed(seed);
      const num2 = simpleFaker.number.int();

      expect(num1).toBe(num2);
      expect(newSeed).toBe(seed);

      const num3 = simpleFaker.number.int();
      expect(num1).not.toBe(num3);
    });

    it('seed(number)', () => {
      simpleFaker.seed(1);

      const actual = simpleFaker.string.uuid();
      expect(actual).toMatchInlineSnapshot(
        '"6b042125-686a-43e0-8a68-23cf5bee102e"'
      );
    });

    it('seed(number[])', () => {
      simpleFaker.seed([1, 2, 3]);

      const actual = simpleFaker.string.uuid();
      expect(actual).toMatchInlineSnapshot(
        '"9e7e0e9f-9e8e-4408-b5b1-8002907d7dd6"'
      );
    });
  });

  describe('defaultRefDate', () => {
    it('should be a defined', () => {
      expect(simpleFaker.defaultRefDate).toBeDefined();
    });

    it('should be a date in the very recent past', () => {
      const start = Date.now();
      const refDate = simpleFaker.defaultRefDate().getTime();
      const end = Date.now();
      expect(refDate).toBeGreaterThanOrEqual(start);
      expect(refDate).toBeLessThanOrEqual(end);
    });
  });
});
