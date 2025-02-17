import type { Distributor } from './distributor';

/**
 * Creates a new function that generates uniformly distributed values.
 * The likelihood of each value is the same.
 *
 * The following table shows the rough distribution of values generated using `uniformDistributor()`:
 *
 * |  Result   | Uniform |
 * | :-------: | ------: |
 * | 0.0 - 0.1 |   10.0% |
 * | 0.1 - 0.2 |   10.0% |
 * | 0.2 - 0.3 |   10.0% |
 * | 0.3 - 0.4 |   10.0% |
 * | 0.4 - 0.5 |   10.0% |
 * | 0.5 - 0.6 |   10.0% |
 * | 0.6 - 0.7 |   10.0% |
 * | 0.7 - 0.8 |   10.0% |
 * | 0.8 - 0.9 |   10.0% |
 * | 0.9 - 1.0 |   10.0% |
 *
 * @returns A new uniform distributor function.
 *
 * @example
 * const distributor = uniformDistributor();
 * distributor(randomizer) // 0.9100215692561207
 * distributor(randomizer) // 0.791632947887336
 * distributor(randomizer) // 0.14770035310214324
 * distributor(randomizer) // 0.28282249581185814
 * distributor(randomizer) // 0.017890944117802343
 *
 * @since 9.6.0
 */
export function uniformDistributor(): Distributor {
  return UNIFORM_DISTRIBUTOR;
}

const UNIFORM_DISTRIBUTOR: Distributor = ({ next }) => next();
