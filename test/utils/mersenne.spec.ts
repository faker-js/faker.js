import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { MersenneTwister19937 } from '../../src/internal/mersenne';
import { randomSeed } from '../../src/internal/seed';
import type { Randomizer } from '../../src/randomizer';
import {
  generateMersenne32Randomizer,
  generateMersenne53Randomizer,
} from '../../src/utils/mersenne';
import { seededRuns } from '../support/seeded-runs';
import { times } from '../support/times';
import {
  MERSENNE_MAX_VALUE,
  TWISTER_32CO_MAX_VALUE,
  TWISTER_53CO_MAX_VALUE,
} from './mersenne-test-utils';

const NON_SEEDED_BASED_RUN = 25;

function newTwister(seed: number = randomSeed()): MersenneTwister19937 {
  const twister = new MersenneTwister19937();
  twister.initGenrand(seed);
  return twister;
}

describe('MersenneTwister19937', () => {
  describe('genrandInt32()', () => {
    it('should be able to return 0', () => {
      const twister = newTwister(257678572);

      // There is no single value seed that can produce 0 in the first call
      for (let i = 0; i < 5; i++) {
        twister.genrandInt32();
      }

      const actual = twister.genrandInt32();
      expect(actual).toBe(0);
    });

    it('should be able to return 2^32-1', () => {
      const twister = newTwister(2855577693);
      const actual = twister.genrandInt32();
      expect(actual).toBe(2 ** 32 - 1);
    });
  });

  describe('genrandReal2()', () => {
    it('should be able to return 0', () => {
      const twister = newTwister();
      // shortcut to return minimal value
      // the test above shows that it is possible to return 0
      twister.genrandInt32 = () => 0;
      const actual = twister.genrandReal2();
      expect(actual).toBe(0);
    });

    it('should be able to return almost 1', () => {
      const twister = newTwister();
      // shortcut to return maximal value
      // the test above shows that it is possible to return 2^32-1
      twister.genrandInt32 = () => 2 ** 32 - 1;
      const actual = twister.genrandReal2();
      expect(actual).toBe(TWISTER_32CO_MAX_VALUE);
    });
  });

  describe('genrandRes53()', () => {
    it('should be able to return 0', () => {
      const twister = newTwister();
      // shortcut to return minimal value
      // the test above shows that it is possible to return 0
      twister.genrandInt32 = () => 0;
      const actual = twister.genrandRes53();
      expect(actual).toBe(0);
    });

    it('should be able to return almost 1', () => {
      const twister = newTwister();
      // shortcut to return maximal value
      // the test above shows that it is possible to return 2^32-1
      twister.genrandInt32 = () => 2 ** 32 - 1;
      const actual = twister.genrandRes53();
      expect(actual).toBe(TWISTER_53CO_MAX_VALUE);
    });
  });
});

describe.each([
  ['generateMersenne32Randomizer()', generateMersenne32Randomizer],
  ['generateMersenne53Randomizer()', generateMersenne53Randomizer],
])('%s', (_, factory) => {
  const randomizer: Randomizer = factory();

  it('should return a result matching the interface', () => {
    expect(randomizer).toBeDefined();
    expect(randomizer).toBeTypeOf('object');
    expect(randomizer.next).toBeTypeOf('function');
    expect(randomizer.seed).toBeTypeOf('function');
  });

  describe.each(
    [...seededRuns, ...seededRuns.map((v) => [v, 1, 2])].map((v) => [v])
  )('seed: %j', (seed) => {
    beforeEach(() => {
      randomizer.seed(seed);
    });

    it('should return deterministic value for next()', () => {
      const actual = randomizer.next();

      expect(actual).toMatchSnapshot();
    });
  });

  describe.each(
    times(NON_SEEDED_BASED_RUN).flatMap(() => [
      [randomSeed()],
      [[randomSeed(), randomSeed()]],
    ])
  )('random seeded tests %j', (seed) => {
    beforeAll(() => {
      randomizer.seed(seed);
    });

    describe('next', () => {
      it('should return random number from interval [0, 1)', () => {
        const actual = randomizer.next();

        expect(actual).toBeGreaterThanOrEqual(0);
        expect(actual).toBeLessThanOrEqual(MERSENNE_MAX_VALUE);
        expect(actual).toBeLessThan(1);
      });
    });
  });
});
