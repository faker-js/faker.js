import { FakerError } from '../../errors/faker-error';
import { ModuleBase } from '../../internal/module-base';

// Source for official prefixes: https://www.isbn-international.org/range_file_generation
const ISBN_LENGTH_RULES: Record<
  string,
  Array<[rangeMaximum: number, length: number]>
> = {
  '0': [
    [1999999, 2],
    [2279999, 3],
    [2289999, 4],
    [3689999, 3],
    [3699999, 4],
    [6389999, 3],
    [6397999, 4],
    [6399999, 7],
    [6449999, 3],
    [6459999, 7],
    [6479999, 3],
    [6489999, 7],
    [6549999, 3],
    [6559999, 4],
    [6999999, 3],
    [8499999, 4],
    [8999999, 5],
    [9499999, 6],
    [9999999, 7],
  ],
  '1': [
    [99999, 3],
    [299999, 2],
    [349999, 3],
    [399999, 4],
    [499999, 3],
    [699999, 2],
    [999999, 4],
    [3979999, 3],
    [5499999, 4],
    [6499999, 5],
    [6799999, 4],
    [6859999, 5],
    [7139999, 4],
    [7169999, 3],
    [7319999, 4],
    [7399999, 7],
    [7749999, 5],
    [7753999, 7],
    [7763999, 5],
    [7764999, 7],
    [7769999, 5],
    [7782999, 7],
    [7899999, 5],
    [7999999, 4],
    [8004999, 5],
    [8049999, 5],
    [8379999, 5],
    [8384999, 7],
    [8671999, 5],
    [8675999, 4],
    [8697999, 5],
    [9159999, 6],
    [9165059, 7],
    [9168699, 6],
    [9169079, 7],
    [9195999, 6],
    [9196549, 7],
    [9729999, 6],
    [9877999, 4],
    [9911499, 6],
    [9911999, 7],
    [9989899, 6],
    [9999999, 7],
  ],
};

/**
 * Module to generate commerce and product related entries.
 *
 * ### Overview
 *
 * For a long product name like `'Incredible Soft Gloves'`, use [`productName()`](https://fakerjs.dev/api/commerce.html#productname). The product names are generated from a list of adjectives, materials, and products, which can each be accessed separately using [`productAdjective()`](https://fakerjs.dev/api/commerce.html#productadjective), [`productMaterial()`](https://fakerjs.dev/api/commerce.html#productmaterial), and [`product()`](https://fakerjs.dev/api/commerce.html#product). You can also create a description using [`productDescription()`](https://fakerjs.dev/api/commerce.html#productdescription).
 *
 * For a department in a shop or product category, use [`department()`](https://fakerjs.dev/api/commerce.html#department).
 *
 * You can also create a price using [`price()`](https://fakerjs.dev/api/commerce.html#price).
 */
export class CommerceModule extends ModuleBase {
  /**
   * Returns a department inside a shop.
   *
   * @example
   * faker.commerce.department() // 'Garden'
   *
   * @since 3.0.0
   */
  department(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.commerce.department
    );
  }

  /**
   * Generates a random descriptive product name.
   *
   * @example
   * faker.commerce.productName() // 'Incredible Soft Gloves'
   *
   * @since 3.0.0
   */
  productName(): string {
    return `${this.productAdjective()} ${this.productMaterial()} ${this.product()}`;
  }

  /**
   * Generates a price between min and max (inclusive).
   *
   * To better represent real-world prices, when `options.dec` is greater than `0`, the final decimal digit in the returned string will be generated as follows:
   *
   * - 50% of the time: `9`
   * - 30% of the time: `5`
   * - 10% of the time: `0`
   * - 10% of the time: a random digit from `0` to `9`
   *
   * @param options An options object.
   * @param options.min The minimum price. Defaults to `1`.
   * @param options.max The maximum price. Defaults to `1000`.
   * @param options.dec The number of decimal places. Defaults to `2`.
   * @param options.symbol The currency value to use. Defaults to `''`.
   *
   * @example
   * faker.commerce.price() // '828.07'
   * faker.commerce.price({ min: 100 }) // '904.19'
   * faker.commerce.price({ min: 100, max: 200 }) // '154.55'
   * faker.commerce.price({ min: 100, max: 200, dec: 0 }) // '133'
   * faker.commerce.price({ min: 100, max: 200, dec: 0, symbol: '$' }) // '$114'
   *
   * @since 3.0.0
   */
  price(
    options: {
      /**
       * The minimum price.
       *
       * @default 1
       */
      min?: number;
      /**
       * The maximum price.
       *
       * @default 1000
       */
      max?: number;
      /**
       * The number of decimal places.
       *
       * @default 2
       */
      dec?: number;
      /**
       * The currency value to use.
       *
       * @default ''
       */
      symbol?: string;
    } = {}
  ): string {
    const { dec = 2, max = 1000, min = 1, symbol = '' } = options;

    if (min < 0 || max < 0) {
      return `${symbol}0`;
    }

    if (min === max) {
      return `${symbol}${min.toFixed(dec)}`;
    }

    const generated = this.faker.number.float({
      min,
      max,
      fractionDigits: dec,
    });

    if (dec === 0) {
      return `${symbol}${generated.toFixed(dec)}`;
    }

    const oldLastDigit = (generated * 10 ** dec) % 10;
    const newLastDigit = this.faker.helpers.weightedArrayElement([
      { weight: 5, value: 9 },
      { weight: 3, value: 5 },
      { weight: 1, value: 0 },
      {
        weight: 1,
        value: this.faker.number.int({ min: 0, max: 9 }),
      },
    ]);

    const fraction = (1 / 10) ** dec;
    const oldLastDigitValue = oldLastDigit * fraction;
    const newLastDigitValue = newLastDigit * fraction;
    const combined = generated - oldLastDigitValue + newLastDigitValue;

    if (min <= combined && combined <= max) {
      return `${symbol}${combined.toFixed(dec)}`;
    }

    return `${symbol}${generated.toFixed(dec)}`;
  }

  /**
   * Returns an adjective describing a product.
   *
   * @example
   * faker.commerce.productAdjective() // 'Handcrafted'
   *
   * @since 3.0.0
   */
  productAdjective(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.commerce.product_name.adjective
    );
  }

  /**
   * Returns a material of a product.
   *
   * @example
   * faker.commerce.productMaterial() // 'Rubber'
   *
   * @since 3.0.0
   */
  productMaterial(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.commerce.product_name.material
    );
  }

  /**
   * Returns a short product name.
   *
   * @example
   * faker.commerce.product() // 'Computer'
   *
   * @since 3.0.0
   */
  product(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.commerce.product_name.product
    );
  }

  /**
   * Returns a product description.
   *
   * @example
   * faker.commerce.productDescription() // 'Featuring Phosphorus-enhanced technology, our Fish offers unparalleled Modern performance'
   *
   * @since 5.0.0
   */
  productDescription(): string {
    return this.faker.helpers.fake(
      this.faker.definitions.commerce.product_description
    );
  }

  /**
   * Returns a random [ISBN](https://en.wikipedia.org/wiki/ISBN) identifier.
   *
   * @param options The variant to return or an options object.
   * @param options.variant The variant to return. Can be either `10` (10-digit format)
   * or `13` (13-digit format). Defaults to `13`.
   * @param options.separator The separator to use in the format. Defaults to `'-'`.
   *
   * @example
   * faker.commerce.isbn() // '978-0-692-82459-7'
   * faker.commerce.isbn(10) // '1-155-36404-X'
   * faker.commerce.isbn(13) // '978-1-60808-867-6'
   * faker.commerce.isbn({ separator: ' ' }) // '978 0 452 81498 1'
   * faker.commerce.isbn({ variant: 10, separator: ' ' }) // '0 940319 49 7'
   * faker.commerce.isbn({ variant: 13, separator: ' ' }) // '978 1 6618 9122 0'
   *
   * @since 8.1.0
   */
  isbn(
    options:
      | 10
      | 13
      | {
          /**
           * The variant of the identifier to return.
           * Can be either `10` (10-digit format)
           * or `13` (13-digit format).
           *
           * @default 13
           */
          variant?: 10 | 13;

          /**
           * The separator to use in the format.
           *
           * @default '-'
           */
          separator?: string;
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = { variant: options };
    }

    const { variant = 13, separator = '-' } = options;

    const prefix = '978';
    const [group, groupRules] =
      this.faker.helpers.objectEntry(ISBN_LENGTH_RULES);
    const element = this.faker.string.numeric(8);
    const elementValue = Number.parseInt(element.slice(0, -1));

    const registrantLength = groupRules.find(
      ([rangeMaximum]) => elementValue <= rangeMaximum
    )?.[1];

    if (!registrantLength) {
      // This can only happen if the ISBN_LENGTH_RULES are corrupted
      throw new FakerError(
        `Unable to find a registrant length for the group ${group}`
      );
    }

    const registrant = element.slice(0, registrantLength);
    const publication = element.slice(registrantLength);

    const data = [prefix, group, registrant, publication];
    if (variant === 10) {
      data.shift();
    }

    const isbn = data.join('');

    let checksum = 0;
    for (let i = 0; i < variant - 1; i++) {
      const weight = variant === 10 ? i + 1 : i % 2 ? 3 : 1;
      checksum += weight * Number.parseInt(isbn[i]);
    }

    checksum = variant === 10 ? checksum % 11 : (10 - (checksum % 10)) % 10;

    data.push(checksum === 10 ? 'X' : checksum.toString());

    return data.join(separator);
  }
}
