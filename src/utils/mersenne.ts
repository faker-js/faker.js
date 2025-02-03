import { MersenneTwister19937 } from '../internal/mersenne';
import { randomSeed } from '../internal/seed';
import type { Randomizer } from '../randomizer';

/**
 * Generates a MersenneTwister19937 randomizer with 32 bits of precision.
 * This is the default randomizer used by faker prior to v9.0.
 *
 * @param seed The initial seed to use. Defaults to a random number.
 *
 * @example
 * import { de, en, generateMersenne32Randomizer, Faker } from '@faker-js/faker';
 *
 * const randomizer = generateMersenne32Randomizer();
 * randomizer.seed(42);
 * // Share the same randomizer between multiple instances
 * const customFaker1 = new Faker({ locale: de, randomizer });
 * const customFaker2 = new Faker({ locale: en, randomizer });
 *
 * @since 8.2.0
 */
export function generateMersenne32Randomizer(
  seed: number = randomSeed()
): Randomizer {
  const twister = new MersenneTwister19937(seed);

  return {
    next(): number {
      return twister.nextF32();
    },
    seed(seed: number | number[]): void {
      twister.seed(seed);
    },
  };
}

/**
 * Generates a MersenneTwister19937 randomizer with 53 bits of precision.
 * This is the default randomizer used by faker starting with v9.0.
 *
 * @param seed The initial seed to use. Defaults to a random number.
 *
 * @example
 * import { de, en, generateMersenne53Randomizer, Faker } from '@faker-js/faker';
 *
 * const randomizer = generateMersenne53Randomizer();
 * randomizer.seed(42);
 * // Share the same randomizer between multiple instances
 * const customFaker1 = new Faker({ locale: de, randomizer });
 * const customFaker2 = new Faker({ locale: en, randomizer });
 *
 * @since 9.0.0
 */
export function generateMersenne53Randomizer(
  seed: number = randomSeed()
): Randomizer {
  const twister = new MersenneTwister19937(seed);

  return {
    next(): number {
      return twister.nextF53();
    },
    seed(seed: number | number[]): void {
      twister.seed(seed);
    },
  };
}
