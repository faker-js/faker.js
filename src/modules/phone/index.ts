import { ModuleBase } from '../../internal/module-base';
import { legacyReplaceSymbolWithNumber } from '../helpers';

/**
 * Module to generate phone-related data.
 *
 * ### Overview
 *
 * For a phone number, use [`number()`](https://fakerjs.dev/api/phone.html#number). Many locales provide country-specific formats.
 */
export class PhoneModule extends ModuleBase {
  /**
   * Generates a random phone number.
   *
   * @param options Options object
   * @param options.style Style of the phone number. Defaults to `'human'`.
   *
   * @see faker.string.numeric(): For generating a random string of numbers.
   * @see faker.helpers.fromRegExp(): For generating a phone number matching a regular expression.
   *
   * @example
   * faker.phone.number() // '765-564-8937 x5590'
   * faker.phone.number({ style: 'human' }) // '(287) 897-4716'
   * faker.phone.number({ style: 'national' }) // '(395) 527-4506'
   * faker.phone.number({ style: 'international' }) // '+16697346066'
   *
   * @since 7.3.0
   */
  number(
    options: {
      /**
       * Style of the generated phone number:
       * - `'human'`: (default) A human-input phone number, e.g. `555-770-7727` or `555.770.7727 x1234`
       * - `'national'`: A phone number in a standardized national format, e.g. `(555) 123-4567`.
       * - `'international'`: A phone number in the E.123 international format, e.g. `+15551234567`
       *
       * @default 'human'
       */
      style?: 'human' | 'national' | 'international';
    } = {}
  ): string {
    const { style = 'human' } = options;
    const formats = this.faker.definitions.phone_number.format;

    const definitions = formats[style];
    if (!definitions) {
      throw new Error(`No definitions for ${style} in this locale`);
    }

    const format = this.faker.helpers.arrayElement(definitions);
    return legacyReplaceSymbolWithNumber(this.faker, format);
  }

  /**
   * Generates IMEI number.
   *
   * @example
   * faker.phone.imei() // '57-654648-937559-8'
   *
   * @since 6.2.0
   */
  imei(): string {
    return this.faker.helpers.replaceCreditCardSymbols(
      '##-######-######-L',
      '#'
    );
  }
}
