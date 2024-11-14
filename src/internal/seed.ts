/**
 * Generates a random seed.
 *
 * @internal
 */
export function randomSeed(): number {
  return Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER);
}
