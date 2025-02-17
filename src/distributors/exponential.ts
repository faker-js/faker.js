import { FakerError } from '../errors/faker-error';
import type { Distributor } from './distributor';
import { uniformDistributor } from './uniform';

/**
 * Creates a new function that generates power-law/exponentially distributed values.
 * This function uses `(base ** next() - 1) / (base - 1)` to spread the values.
 *
 * The following table shows the rough distribution of values generated using `exponentialDistributor({ base: x })`:
 *
 * |  Result   | Base 0.1 | Base 0.5 | Base 1 | Base 2 | Base 10 |
 * | :-------: | -------: | -------: | -----: | -----: | ------: |
 * | 0.0 - 0.1 |     4.1% |     7.4% |  10.0% |  13.8% |   27.8% |
 * | 0.1 - 0.2 |     4.5% |     7.8% |  10.0% |  12.5% |   16.9% |
 * | 0.2 - 0.3 |     5.0% |     8.2% |  10.0% |  11.5% |   12.1% |
 * | 0.3 - 0.4 |     5.7% |     8.7% |  10.0% |  10.7% |    9.4% |
 * | 0.4 - 0.5 |     6.6% |     9.3% |  10.0% |  10.0% |    7.8% |
 * | 0.5 - 0.6 |     7.8% |     9.9% |  10.0% |   9.3% |    6.6% |
 * | 0.6 - 0.7 |     9.4% |    10.7% |  10.0% |   8.8% |    5.7% |
 * | 0.7 - 0.8 |    12.1% |    11.5% |  10.0% |   8.2% |    5.0% |
 * | 0.8 - 0.9 |    16.9% |    12.6% |  10.0% |   7.8% |    4.5% |
 * | 0.9 - 1.0 |    27.9% |    13.8% |  10.0% |   7.5% |    4.1% |
 *
 * The following table shows the rough distribution of values generated using `exponentialDistributor({ bias: x })`:
 *
 * |  Result   | Bias -9 | Bias -1 | Bias 0 | Bias 1 | Bias 9 |
 * | :-------: | ------: | ------: | -----: | -----: | -----: |
 * | 0.0 - 0.1 |   27.9% |   13.7% |  10.0% |   7.4% |   4.1% |
 * | 0.1 - 0.2 |   16.9% |   12.5% |  10.0% |   7.8% |   4.5% |
 * | 0.2 - 0.3 |   12.1% |   11.6% |  10.0% |   8.3% |   5.1% |
 * | 0.3 - 0.4 |    9.5% |   10.7% |  10.0% |   8.8% |   5.7% |
 * | 0.4 - 0.5 |    7.8% |   10.0% |  10.0% |   9.3% |   6.6% |
 * | 0.5 - 0.6 |    6.6% |    9.3% |  10.0% |   9.9% |   7.7% |
 * | 0.6 - 0.7 |    5.7% |    8.8% |  10.0% |  10.7% |   9.5% |
 * | 0.7 - 0.8 |    5.0% |    8.2% |  10.0% |  11.5% |  12.1% |
 * | 0.8 - 0.9 |    4.5% |    7.8% |  10.0% |  12.6% |  16.8% |
 * | 0.9 - 1.0 |    4.1% |    7.4% |  10.0% |  13.7% |  27.9% |
 *
 * @param options The options for generating the distributor.
 * @param options.base The base of the exponential distribution. Should be greater than 0. Defaults to `2`.
 * The higher/more above `1` the `base`, the more likely the number will be closer to the minimum value.
 * The lower/closer to zero the `base`, the more likely the number will be closer to the maximum value.
 * Values of `1` will generate a uniform distributor.
 * Can alternatively be configured using the `bias` option.
 * @param options.bias An alternative way to specify the `base`. Also accepts values below zero. Defaults to `-1`.
 * The higher/more positive the `bias`, the more likely the number will be closer to the maximum value.
 * The lower/more negative the `bias`, the more likely the number will be closer to the minimum value.
 * Values of `0` will generate a uniform distributor.
 * Can alternatively be configured using the `base` option.
 *
 * @example
 * import { exponentialDistributor, generateMersenne53Randomizer } from '@faker-js/faker';
 *
 * const randomizer = generateMersenne53Randomizer();
 * const distributor = exponentialDistributor();
 * distributor(randomizer) // 0.04643770898904198
 * distributor(randomizer) // 0.13436127925491848
 * distributor(randomizer) // 0.4202905589842396
 * distributor(randomizer) // 0.5164955927828387
 * distributor(randomizer) // 0.3476359433171099
 *
 * @since 9.6.0
 */
export function exponentialDistributor(
  options?:
    | {
        /**
         * The base of the exponential distribution. Should be greater than 0.
         * The higher/more above `1` the `base`, the more likely the number will be closer to the minimum value.
         * The lower/closer to zero the `base`, the more likely the number will be closer to the maximum value.
         * Values of `1` will generate a uniform distribution.
         * Can alternatively be configured using the `bias` option.
         *
         * @default 2
         */
        base?: number;
      }
    | {
        /**
         * An alternative way to specify the `base`. Also accepts values below zero.
         * The higher/more positive the `bias`, the more likely the number will be closer to the maximum value.
         * The lower/more negative the `bias`, the more likely the number will be closer to the minimum value.
         * Values of `0` will generate a uniform distribution.
         * Can alternatively be configured using the `base` option.
         *
         * @default -1
         */
        bias?: number;
      }
): Distributor;
/**
 * Creates a new function that generates exponentially distributed values.
 * This function uses `(base ** next() - 1) / (base - 1)` to spread the values.
 *
 * @param options The options for generating the distributor.
 * @param options.base The base of the exponential distribution. Should be greater than 0. Defaults to `2`.
 * The higher/more above `1` the `base`, the more likely the number will be closer to the minimum value.
 * The lower/closer to zero the `base`, the more likely the number will be closer to the maximum value.
 * Values of `1` will generate a uniform distributor.
 * Can alternatively be configured using the `bias` option.
 * @param options.bias An alternative way to specify the `base`. Also accepts values below zero. Defaults to `-1`.
 * The higher/more positive the `bias`, the more likely the number will be closer to the maximum value.
 * The lower/more negative the `bias`, the more likely the number will be closer to the minimum value.
 * Values of `0` will generate a uniform distributor.
 * Can alternatively be configured using the `base` option.
 */
export function exponentialDistributor(
  options: {
    base?: number;
    bias?: number;
  } = {}
): Distributor {
  const { bias = -1, base = bias <= 0 ? -bias + 1 : 1 / (bias + 1) } = options;

  if (base === 1) {
    return uniformDistributor();
  } else if (base <= 0) {
    throw new FakerError('Base should be greater than 0.');
  }

  return ({ next }) => (base ** next() - 1) / (base - 1);
}
