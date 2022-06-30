import type { Faker } from '../..';
import { FakerError } from '../../errors/faker-error';

/**
 * Module to generate numbers of any kind.
 */
export class NumberModule {
  constructor(private readonly faker: Faker) {
    // Bind `this` so namespaced is working correctly
    for (const name of Object.getOwnPropertyNames(NumberModule.prototype)) {
      if (name === 'constructor' || typeof this[name] !== 'function') {
        continue;
      }
      this[name] = this[name].bind(this);
    }
  }

  /**
   * Returns a single random integer between zero and the given max value or the given range.
   * The bounds are inclusive.
   *
   * @param options Maximum value or options object.
   * @param options.min Lower bound for generated number. Defaults to `0`.
   * @param options.max Upper bound for generated number. Defaults to `min + 99999`.
   *
   * @throws When options define `max < min`.
   *
   * @example
   * faker.number.int() // 55422
   * faker.number.int(100) // 52
   * faker.number.int({ min: 1000000 }) // 1031433
   * faker.number.int({ max: 100 }) // 42
   */
  int(options: number | { min?: number; max?: number } = {}): number {
    if (typeof options === 'number') {
      options = { max: options };
    }

    const { min = 0 } = options;
    const max = options.max ?? min + 99999;

    if (max === min) {
      return min;
    }

    if (max < min) {
      throw new FakerError(`Max ${max} should be greater than min ${min}.`);
    }

    const randomInt = this.faker.mersenne.rand(max + 1, min);

    return randomInt;
  }

  /**
   * Returns a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) number.
   *
   * @param length Length of the generated number. Defaults to `1`.
   *
   * @example
   * faker.datatype.hex() // 'b'
   * faker.datatype.hex(10) // 'ae13f044fb'
   */
  hex(length = 1): string {
    let hexString = '';

    for (let i = 0; i < length; i++) {
      hexString += this.faker.helpers.arrayElement([
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
      ]);
    }

    return hexString;
  }
}
