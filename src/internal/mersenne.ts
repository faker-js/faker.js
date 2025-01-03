// Based on: https://github.com/dubzzz/pure-rand/blob/5da623a4eebf47f01c5b87c43c9fb4d43ad949bd/src/generator/MersenneTwister.ts

const N = 624;
const M = 397;
const R = 31;
const A = 0x9908b0df;
const F = 1812433253;
const U = 11;
const S = 7;
const B = 0x9d2c5680;
const T = 15;
const C = 0xefc60000;
const L = 18;
const MASK_LOWER = 2 ** R - 1;
const MASK_UPPER = 2 ** R;
const HIGH_MULTIPLIER_53 = 67108864.0;
const FLOATIFY_32 = 1.0 / 4294967296.0;
const FLOATIFY_53 = 1.0 / 9007199254740992.0;

const { imul, trunc } = Math;

/**
 * Generates the random state from the given number or array.
 *
 * @param seed The seed to generate the random state from.
 */
function seedFrom(seed: number | number[]): number[] {
  return typeof seed === 'number' ? numberSeeded(seed) : arraySeeded(seed);
}

/**
 * Generates the random state from the given number.
 *
 * @param seed The seed to generate the random state from.
 */
function numberSeeded(seed: number): number[] {
  const out = Array.from<number>({ length: N });
  out[0] = seed;

  for (let idx = 1; idx !== N; ++idx) {
    const xored = out[idx - 1] ^ (out[idx - 1] >>> 30);
    out[idx] = trunc(imul(F, xored) + idx);
  }

  return out;
}

/**
 * Generates the random state from the given array.
 *
 * @param seed The seed to generate the random state from.
 */
function arraySeeded(seed: number[]): number[] {
  const out = numberSeeded(19650218);

  let idxOut = 1;
  let idxSeed = 0;

  for (let iteration = Math.max(N, seed.length); iteration !== 0; --iteration) {
    const xored = out[idxOut - 1] ^ (out[idxOut - 1] >>> 30);
    out[idxOut] = trunc(
      (out[idxOut] ^ imul(xored, 1664525)) + seed[idxSeed] + idxSeed
    );
    idxOut++;
    idxSeed++;

    if (idxOut >= N) {
      out[0] = out[N - 1];
      idxOut = 1;
    }

    if (idxSeed >= seed.length) {
      idxSeed = 0;
    }
  }

  for (let iteration = N - 1; iteration !== 0; iteration--) {
    out[idxOut] = trunc(
      (out[idxOut] ^
        imul(out[idxOut - 1] ^ (out[idxOut - 1] >>> 30), 1566083941)) -
        idxOut
    );
    idxOut++;

    if (idxOut >= N) {
      out[0] = out[N - 1];
      idxOut = 1;
    }
  }

  out[0] = 0x80000000;
  return out;
}

/**
 * Twists the given randomness states.
 *
 * @param states The randomness states to twist.
 *
 * @returns The given states.
 */
function twist(states: number[]): number[] {
  for (let idx = 0; idx !== N - M; ++idx) {
    const y = (states[idx] & MASK_UPPER) + (states[idx + 1] & MASK_LOWER);
    states[idx] = states[idx + M] ^ (y >>> 1) ^ (-(y & 1) & A);
  }

  for (let idx = N - M; idx !== N - 1; ++idx) {
    const y = (states[idx] & MASK_UPPER) + (states[idx + 1] & MASK_LOWER);
    states[idx] = states[idx + M - N] ^ (y >>> 1) ^ (-(y & 1) & A);
  }

  const y = (states[N - 1] & MASK_UPPER) + (states[0] & MASK_LOWER);
  states[N - 1] = states[M - 1] ^ (y >>> 1) ^ (-(y & 1) & A);
  return states;
}

/**
 * Mersenne Twister based random number generator.
 */
export class MersenneTwister19937 {
  /**
   * Creates a new Mersenne Twister random number generator based on the given seed.
   *
   * @param seed The seed to generate the random state from. Defaults to a random seed.
   */
  constructor(seed?: number | number[]);
  /**
   * Creates a new Mersenne Twister random number generator based on the given seed.
   *
   * @param seed The seed to generate the random state from. Defaults to a random seed.
   * @param states The states to use, must be an array of 624 32-bit integers.
   * @param index The index to use, must be a number between 0 and 623.
   */
  constructor(
    seed: number | number[] = Math.random() * Number.MAX_SAFE_INTEGER,
    private states: number[] = twist(seedFrom(seed)),
    private index: number = 0
  ) {}

  /**
   * Generates the next 32-bit unsigned integer.
   */
  nextU32(): number {
    let y = this.states[this.index];
    y ^= this.states[this.index] >>> U;
    y ^= (y << S) & B;
    y ^= (y << T) & C;
    y ^= y >>> L;
    if (++this.index >= N) {
      this.states = twist(this.states);
      this.index = 0;
    }

    return y >>> 0;
  }

  /**
   * Generates the next 32-bit float.
   */
  nextF32(): number {
    return this.nextU32() * FLOATIFY_32;
  }

  /**
   * Generates the next 53-bit unsigned integer.
   */
  nextU53(): number {
    const high = this.nextU32() >>> 5;
    const low = this.nextU32() >>> 6;
    return high * HIGH_MULTIPLIER_53 + low;
  }

  /**
   * Generates the next 53-bit float.
   */
  nextF53(): number {
    return this.nextU53() * FLOATIFY_53;
  }

  /**
   * Sets the seed of the random number generator.
   *
   * @param seed The seed to use.
   */
  seed(seed: number | number[]): void {
    this.states = twist(seedFrom(seed));
    this.index = 0;
  }
}
