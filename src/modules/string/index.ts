import { FakerError } from '../../errors/faker-error';
import { CROCKFORDS_BASE32, dateToBase32 } from '../../internal/base32';
import { toDate } from '../../internal/date';
import { SimpleModuleBase } from '../../internal/module-base';
import type { LiteralUnion } from '../../internal/types';

export type Casing = 'upper' | 'lower' | 'mixed';

const UPPER_CHARS: ReadonlyArray<string> = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
const LOWER_CHARS: ReadonlyArray<string> = [...'abcdefghijklmnopqrstuvwxyz'];
const DIGIT_CHARS: ReadonlyArray<string> = [...'0123456789'];

export type LowerAlphaChar =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

export type UpperAlphaChar =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'V'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';

export type NumericChar =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9';

export type AlphaChar = LowerAlphaChar | UpperAlphaChar;
export type AlphaNumericChar = AlphaChar | NumericChar;

/**
 * Module to generate string related entries.
 *
 * ### Overview
 *
 * For a string containing just A-Z characters, use [`alpha()`](https://fakerjs.dev/api/string.html#alpha). To add digits too, use [`alphanumeric()`](https://fakerjs.dev/api/string.html#alphanumeric). If you only want punctuation marks/symbols, use [`symbol()`](https://fakerjs.dev/api/string.html). For a full set of ASCII characters, use [`sample()`](https://fakerjs.dev/api/string.html#sample). For a custom set of characters, use [`fromCharacters()`](https://fakerjs.dev/api/string.html#fromcharacters).
 *
 * For strings of base-ten digits, use [`numeric()`](https://fakerjs.dev/api/string.html#numeric). For other bases, use [`binary()`](https://fakerjs.dev/api/string.html#binary), [`octal()`](https://fakerjs.dev/api/string.html#octal), or [`hexadecimal()`](https://fakerjs.dev/api/string.html#hexadecimal)).
 *
 * You can generate standard ID strings using [`uuid()`](https://fakerjs.dev/api/string.html#uuid) or [`nanoid()`](https://fakerjs.dev/api/string.html#nanoid).
 *
 * ### Related modules
 *
 * - Emoji can be found at [`faker.internet.emoji()`](https://fakerjs.dev/api/internet.html#emoji).
 * - The [`faker.helpers`](https://fakerjs.dev/api/helpers.html) module includes a number of string related methods.
 */
export class StringModule extends SimpleModuleBase {
  /**
   * Generates a string from the given characters.
   *
   * @param characters The characters to use for the string. Can be a string or an array of characters.
   * If it is an array, then each element is treated as a single character even if it is a string with multiple characters.
   * @param length The length of the string to generate either as a fixed length or as a length range. Defaults to `1`.
   * @param length.min The minimum length of the string to generate.
   * @param length.max The maximum length of the string to generate.
   *
   * @example
   * faker.string.fromCharacters('abc') // 'b'
   * faker.string.fromCharacters(['a', 'b', 'c']) // 'c'
   * faker.string.fromCharacters('abc', 10) // 'bbbbbccbcb'
   * faker.string.fromCharacters('abc', { min: 5, max: 10 }) // 'caaacccc'
   *
   * @since 8.0.0
   */
  fromCharacters(
    characters: string | ReadonlyArray<string>,
    length:
      | number
      | {
          /**
           * The minimum length of the string to generate.
           */
          min: number;
          /**
           * The maximum length of the string to generate.
           */
          max: number;
        } = 1
  ): string {
    length = this.faker.helpers.rangeToNumber(length);
    if (length <= 0) {
      return '';
    }

    if (typeof characters === 'string') {
      characters = [...characters];
    }

    if (characters.length === 0) {
      throw new FakerError(
        'Unable to generate string: No characters to select from.'
      );
    }

    return this.faker.helpers
      .multiple(() => this.faker.helpers.arrayElement(characters as string[]), {
        count: length,
      })
      .join('');
  }

  /**
   * Generating a string consisting of letters in the English alphabet.
   *
   * @param options Either the length of the string to generate or the optional options object.
   * @param options.length The length of the string to generate either as a fixed length or as a length range. Defaults to `1`.
   * @param options.casing The casing of the characters. Defaults to `'mixed'`.
   * @param options.exclude An array with characters which should be excluded in the generated string. Defaults to `[]`.
   *
   * @example
   * faker.string.alpha() // 'C'
   * faker.string.alpha(10) // 'LFCwHwUYtP'
   * faker.string.alpha({ length: { min: 5, max: 10 } }) // 'DWdebROT'
   * faker.string.alpha({ casing: 'lower' }) // 'z'
   * faker.string.alpha({ exclude: ['W'] }) // 'O'
   * faker.string.alpha({ length: 5, casing: 'upper', exclude: ['A'] }) // 'MUDQE'
   *
   * @since 8.0.0
   */
  alpha(
    options:
      | number
      | {
          /**
           * The length of the string to generate either as a fixed length or as a length range.
           *
           * @default 1
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the string to generate.
                 */
                min: number;
                /**
                 * The maximum length of the string to generate.
                 */
                max: number;
              };
          /**
           * The casing of the characters.
           *
           * @default 'mixed'
           */
          casing?: Casing;
          /**
           * An array with characters which should be excluded in the generated string.
           *
           * @default []
           */
          exclude?: ReadonlyArray<LiteralUnion<AlphaChar>> | string;
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = {
        length: options,
      };
    }

    const length = this.faker.helpers.rangeToNumber(options.length ?? 1);
    if (length <= 0) {
      return '';
    }

    const { casing = 'mixed' } = options;
    let { exclude = [] } = options;

    if (typeof exclude === 'string') {
      exclude = [...exclude];
    }

    let charsArray: string[];
    switch (casing) {
      case 'upper': {
        charsArray = [...UPPER_CHARS];
        break;
      }

      case 'lower': {
        charsArray = [...LOWER_CHARS];
        break;
      }

      case 'mixed': {
        charsArray = [...LOWER_CHARS, ...UPPER_CHARS];
        break;
      }
    }

    charsArray = charsArray.filter((elem) => !exclude.includes(elem));

    return this.fromCharacters(charsArray, length);
  }

  /**
   * Generating a string consisting of alpha characters and digits.
   *
   * @param options Either the length of the string to generate or the optional options object.
   * @param options.length The length of the string to generate either as a fixed length or as a length range. Defaults to `1`.
   * @param options.casing The casing of the characters. Defaults to `'mixed'`.
   * @param options.exclude An array of characters and digits which should be excluded in the generated string. Defaults to `[]`.
   *
   * @example
   * faker.string.alphanumeric() // 'y'
   * faker.string.alphanumeric(5) // 'IBxqE'
   * faker.string.alphanumeric({ length: { min: 5, max: 10 } }) // 'TXnNwzV'
   * faker.string.alphanumeric({ casing: 'upper' }) // '2'
   * faker.string.alphanumeric({ exclude: ['W'] }) // '5'
   * faker.string.alphanumeric({ length: 5, exclude: ["a"] }) // '1PMSY'
   *
   * @since 8.0.0
   */
  alphanumeric(
    options:
      | number
      | {
          /**
           * The length of the string to generate either as a fixed length or as a length range.
           *
           * @default 1
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the string to generate.
                 */
                min: number;
                /**
                 * The maximum length of the string to generate.
                 */
                max: number;
              };
          /**
           * The casing of the characters.
           *
           * @default 'mixed'
           */
          casing?: Casing;
          /**
           * An array of characters and digits which should be excluded in the generated string.
           *
           * @default []
           */
          exclude?: ReadonlyArray<LiteralUnion<AlphaNumericChar>> | string;
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = {
        length: options,
      };
    }

    const length = this.faker.helpers.rangeToNumber(options.length ?? 1);
    if (length <= 0) {
      return '';
    }

    const { casing = 'mixed' } = options;
    let { exclude = [] } = options;

    if (typeof exclude === 'string') {
      exclude = [...exclude];
    }

    let charsArray = [...DIGIT_CHARS];

    switch (casing) {
      case 'upper': {
        charsArray.push(...UPPER_CHARS);
        break;
      }

      case 'lower': {
        charsArray.push(...LOWER_CHARS);
        break;
      }

      case 'mixed': {
        charsArray.push(...LOWER_CHARS, ...UPPER_CHARS);
        break;
      }
    }

    charsArray = charsArray.filter((elem) => !exclude.includes(elem));

    return this.fromCharacters(charsArray, length);
  }

  /**
   * Returns a [binary](https://en.wikipedia.org/wiki/Binary_number) string.
   *
   * @param options The optional options object.
   * @param options.length The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. Defaults to `1`.
   * @param options.prefix Prefix for the generated number. Defaults to `'0b'`.
   *
   * @see faker.number.binary(): For generating a binary number (within a range).
   *
   * @example
   * faker.string.binary() // '0b1'
   * faker.string.binary({ length: 10 }) // '0b1110101101'
   * faker.string.binary({ length: { min: 5, max: 10 } }) // '0b11000111'
   * faker.string.binary({ prefix: '0b' }) // '0b1'
   * faker.string.binary({ length: 10, prefix: 'bin_' }) // 'bin_1010101100'
   *
   * @since 8.0.0
   */
  binary(
    options: {
      /**
       * The length of the string (excluding the prefix) to generate either as a fixed length or as a length range.
       *
       * @default 1
       */
      length?:
        | number
        | {
            /**
             * The minimum length of the string (excluding the prefix) to generate.
             */
            min: number;
            /**
             * The maximum length of the string (excluding the prefix) to generate.
             */
            max: number;
          };
      /**
       * Prefix for the generated number.
       *
       * @default '0b'
       */
      prefix?: string;
    } = {}
  ): string {
    const { prefix = '0b' } = options;

    let result = prefix;
    result += this.fromCharacters(['0', '1'], options.length ?? 1);
    return result;
  }

  /**
   * Returns an [octal](https://en.wikipedia.org/wiki/Octal) string.
   *
   * @param options The optional options object.
   * @param options.length The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. Defaults to `1`.
   * @param options.prefix Prefix for the generated number. Defaults to `'0o'`.
   *
   * @see faker.number.octal(): For generating an octal number (within a range).
   *
   * @example
   * faker.string.octal() // '0o4'
   * faker.string.octal({ length: 10 }) // '0o5443537736'
   * faker.string.octal({ length: { min: 5, max: 10 } }) // '0o47000666'
   * faker.string.octal({ prefix: '0o' }) // '0o7'
   * faker.string.octal({ length: 10, prefix: 'oct_' }) // 'oct_6360517432'
   *
   * @since 8.0.0
   */
  octal(
    options: {
      /**
       * The length of the string (excluding the prefix) to generate either as a fixed length or as a length range.
       *
       * @default 1
       */
      length?:
        | number
        | {
            /**
             * The minimum length of the string (excluding the prefix) to generate.
             */
            min: number;
            /**
             * The maximum length of the string (excluding the prefix) to generate.
             */
            max: number;
          };
      /**
       * Prefix for the generated number.
       *
       * @default '0o'
       */
      prefix?: string;
    } = {}
  ): string {
    const { prefix = '0o' } = options;

    let result = prefix;
    result += this.fromCharacters(
      ['0', '1', '2', '3', '4', '5', '6', '7'],
      options.length ?? 1
    );
    return result;
  }

  /**
   * Returns a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) string.
   *
   * @param options The optional options object.
   * @param options.length The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. Defaults to `1`.
   * @param options.casing Casing of the generated number. Defaults to `'mixed'`.
   * @param options.prefix Prefix for the generated number. Defaults to `'0x'`.
   *
   * @example
   * faker.string.hexadecimal() // '0xc'
   * faker.string.hexadecimal({ length: 10 }) // '0xfdb9e9DF8B'
   * faker.string.hexadecimal({ length: { min: 5, max: 10 } }) // '0xcE110CBD'
   * faker.string.hexadecimal({ prefix: '0x' }) // '0xF'
   * faker.string.hexadecimal({ casing: 'lower' }) // '0xb'
   * faker.string.hexadecimal({ length: 10, prefix: '#' }) // '#aB2e3Eb95B'
   * faker.string.hexadecimal({ length: 10, casing: 'upper' }) // '0xAC0DDDEF79'
   * faker.string.hexadecimal({ casing: 'lower', prefix: '' }) // 'f'
   * faker.string.hexadecimal({ length: 10, casing: 'mixed', prefix: '0x' }) // '0x1ee4268c9F'
   *
   * @since 8.0.0
   */
  hexadecimal(
    options: {
      /**
       * The length of the string (excluding the prefix) to generate either as a fixed length or as a length range.
       *
       * @default 1
       */
      length?:
        | number
        | {
            /**
             * The minimum length of the string (excluding the prefix) to generate.
             */
            min: number;
            /**
             * The maximum length of the string (excluding the prefix) to generate.
             */
            max: number;
          };
      /**
       * Casing of the generated number.
       *
       * @default 'mixed'
       */
      casing?: Casing;
      /**
       * Prefix for the generated number.
       *
       * @default '0x'
       */
      prefix?: string;
    } = {}
  ): string {
    const { casing = 'mixed', prefix = '0x' } = options;
    const length = this.faker.helpers.rangeToNumber(options.length ?? 1);
    if (length <= 0) {
      return prefix;
    }

    let wholeString = this.fromCharacters(
      [
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
      ],
      length
    );

    if (casing === 'upper') {
      wholeString = wholeString.toUpperCase();
    } else if (casing === 'lower') {
      wholeString = wholeString.toLowerCase();
    }

    return `${prefix}${wholeString}`;
  }

  /**
   * Generates a given length string of digits.
   *
   * @param options Either the length of the string to generate or the optional options object.
   * @param options.length The length of the string to generate either as a fixed length or as a length range. Defaults to `1`.
   * @param options.allowLeadingZeros Whether leading zeros are allowed or not. Defaults to `true`.
   * @param options.exclude An array of digits which should be excluded in the generated string. Defaults to `[]`.
   *
   * @see faker.number.int(): For generating a number (within a range).
   *
   * @example
   * faker.string.numeric() // '5'
   * faker.string.numeric(5) // '76546'
   * faker.string.numeric(42) // '489375590008789747161954274506669634606621'
   * faker.string.numeric({ length: { min: 5, max: 10 } }) // '354912'
   * faker.string.numeric({ length: 42, allowLeadingZeros: false }) // '262421161138080949670212134065250593617215'
   * faker.string.numeric({ length: 6, exclude: ['0'] }) // '181737'
   *
   * @since 8.0.0
   */
  numeric(
    options:
      | number
      | {
          /**
           * The length of the string to generate either as a fixed length or as a length range.
           *
           * @default 1
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the string to generate.
                 */
                min: number;
                /**
                 * The maximum length of the string to generate.
                 */
                max: number;
              };
          /**
           * Whether leading zeros are allowed or not.
           *
           * @default true
           */
          allowLeadingZeros?: boolean;
          /**
           * An array of digits which should be excluded in the generated string.
           *
           * @default []
           */
          exclude?: ReadonlyArray<LiteralUnion<NumericChar>> | string;
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = {
        length: options,
      };
    }

    const length = this.faker.helpers.rangeToNumber(options.length ?? 1);
    if (length <= 0) {
      return '';
    }

    const { allowLeadingZeros = true } = options;
    let { exclude = [] } = options;

    if (typeof exclude === 'string') {
      exclude = [...exclude];
    }

    const allowedDigits = DIGIT_CHARS.filter(
      (digit) => !exclude.includes(digit)
    );

    if (
      allowedDigits.length === 0 ||
      (allowedDigits.length === 1 &&
        !allowLeadingZeros &&
        allowedDigits[0] === '0')
    ) {
      throw new FakerError(
        'Unable to generate numeric string, because all possible digits are excluded.'
      );
    }

    let result = '';

    if (!allowLeadingZeros && !exclude.includes('0')) {
      result += this.faker.helpers.arrayElement(
        allowedDigits.filter((digit) => digit !== '0')
      );
    }

    result += this.fromCharacters(allowedDigits, length - result.length);

    return result;
  }

  /**
   * Returns a string containing UTF-16 chars between 33 and 125 (`!` to `}`).
   *
   * @param length The length of the string (excluding the prefix) to generate either as a fixed length or as a length range. Defaults to `10`.
   * @param length.min The minimum length of the string to generate.
   * @param length.max The maximum length of the string to generate.
   *
   * @example
   * faker.string.sample() // 'TcYSH]IszD'
   * faker.string.sample(5) // "jRUw'"
   * faker.string.sample({ min: 5, max: 10 }) // '"niq|'
   *
   * @since 8.0.0
   */
  sample(
    length:
      | number
      | {
          /**
           * The minimum length of the string to generate.
           */
          min: number;
          /**
           * The maximum length of the string to generate.
           */
          max: number;
        } = 10
  ): string {
    length = this.faker.helpers.rangeToNumber(length);

    const charCodeOption = {
      min: 33,
      max: 125,
    };

    let returnString = '';

    while (returnString.length < length) {
      returnString += String.fromCodePoint(
        this.faker.number.int(charCodeOption)
      );
    }

    return returnString;
  }

  /**
   * Returns a UUID v4 ([Universally Unique Identifier](https://en.wikipedia.org/wiki/Universally_unique_identifier)).
   *
   * @example
   * faker.string.uuid() // '8b986a7e-f6c8-49e1-910d-cdfc7c1a2f86'
   *
   * @since 8.0.0
   */
  uuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replaceAll('x', () => this.faker.number.hex({ min: 0x0, max: 0xf }))
      .replaceAll('y', () => this.faker.number.hex({ min: 0x8, max: 0xb }));
  }

  /**
   * Returns a ULID ([Universally Unique Lexicographically Sortable Identifier](https://github.com/ulid/spec)).
   *
   * @param options The optional options object.
   * @param options.refDate The timestamp to encode into the ULID.
   * The encoded timestamp is represented by the first 10 characters of the result.
   * Defaults to `faker.defaultRefDate()`.
   *
   * @example
   * faker.string.ulid() // '01JGFF53C0HPKHDMEWYCSGJX22'
   * faker.string.ulid({ refDate: '2020-01-01T00:00:00.000Z' }) // '01DXF6DT000TRVZSER3M4YGD8R'
   *
   * @since 9.1.0
   */
  ulid(
    options: {
      /**
       * The date to use as reference point for the newly generated ULID encoded timestamp.
       * The encoded timestamp is represented by the first 10 characters of the result.
       *
       * @default faker.defaultRefDate()
       */
      refDate?: string | Date | number;
    } = {}
  ): string {
    const { refDate = this.faker.defaultRefDate() } = options;
    const date = toDate(refDate);

    return dateToBase32(date) + this.fromCharacters(CROCKFORDS_BASE32, 16);
  }

  /**
   * Generates a [Nano ID](https://github.com/ai/nanoid).
   *
   * @param length The length of the string to generate either as a fixed length or as a length range. Defaults to `21`.
   * @param length.min The minimum length of the Nano ID to generate.
   * @param length.max The maximum length of the Nano ID to generate.
   *
   * @example
   * faker.string.nanoid() // 'IxETnwV5PR-MDWpMzCCGr'
   * faker.string.nanoid(10) // '3F7mr_aff6'
   * faker.string.nanoid({ min: 13, max: 37 }) // 'cOPYYJhij3zwzj8hAPGJfAdrHOSSI'
   *
   * @since 8.0.0
   */
  nanoid(
    length:
      | number
      | {
          /**
           * The minimum length of the Nano ID to generate.
           */
          min: number;
          /**
           * The maximum length of the Nano ID to generate.
           */
          max: number;
        } = 21
  ): string {
    length = this.faker.helpers.rangeToNumber(length);
    if (length <= 0) {
      return '';
    }

    const generators = [
      {
        value: () => this.alphanumeric(1),
        // a-z is 26 characters
        // this times 2 for upper & lower case is 52
        // add all numbers 0-9 (10 in total) you get 62
        weight: 62,
      },
      {
        value: () => this.faker.helpers.arrayElement(['_', '-']),
        weight: 2,
      },
    ];
    let result = '';
    while (result.length < length) {
      const charGen = this.faker.helpers.weightedArrayElement(generators);
      result += charGen();
    }

    return result;
  }

  /**
   * Returns a string containing only special characters from the following list:
   *
   * ```txt
   * ! " # $ % & ' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _ ` { | } ~
   * ```
   *
   * @param length The length of the string to generate either as a fixed length or as a length range. Defaults to `1`.
   * @param length.min The minimum length of the string to generate.
   * @param length.max The maximum length of the string to generate.
   *
   * @example
   * faker.string.symbol() // '&lt;'
   * faker.string.symbol(5) // '[>&lt;.?'
   * faker.string.symbol({ min: 5, max: 10 }) // '{}-^;=|'
   *
   * @since 8.0.0
   */
  symbol(
    length:
      | number
      | {
          /**
           * The minimum length of the string to generate.
           */
          min: number;
          /**
           * The maximum length of the string to generate.
           */
          max: number;
        } = 1
  ): string {
    return this.fromCharacters(
      [
        '!',
        '"',
        '#',
        '$',
        '%',
        '&',
        "'",
        '(',
        ')',
        '*',
        '+',
        ',',
        '-',
        '.',
        '/',
        ':',
        ';',
        '<',
        '=',
        '>',
        '?',
        '@',
        '[',
        '\\',
        ']',
        '^',
        '_',
        '`',
        '{',
        '|',
        '}',
        '~',
      ],
      length
    );
  }
}
