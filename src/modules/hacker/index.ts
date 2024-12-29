import { ModuleBase } from '../../internal/module-base';

/**
 * Module to generate hacker/IT words and phrases.
 *
 * ### Overview
 *
 * There are methods for different parts of speech, such as [`abbreviation()`](https://fakerjs.dev/api/hacker.html#abbreviation), [`adjective()`](https://fakerjs.dev/api/hacker.html#adjective), [`noun()`](https://fakerjs.dev/api/hacker.html#noun), [`verb()`](https://fakerjs.dev/api/hacker.html#verb), and [`ingverb()`](https://fakerjs.dev/api/hacker.html#ingverb). Alternatively, [`phrase()`](https://fakerjs.dev/api/hacker.html#phrase) creates a longer phrase combining these words.
 *
 * ### Related modules
 *
 * Various modules allow for generating other types of words and phrases:
 *
 * - [faker.word](https://fakerjs.dev/api/word.html) uses general vocabulary rather than hacker-specific terms.
 * - [faker.lorem](https://fakerjs.dev/api/lorem.html) uses faux-Latin "lorem ipsum" text.
 * - [faker.company](https://fakerjs.dev/api/company.html) includes corporate catchphrases and buzzwords.
 */
export class HackerModule extends ModuleBase {
  /**
   * Returns a random hacker/IT abbreviation.
   *
   * @example
   * faker.hacker.abbreviation() // 'RAM'
   *
   * @since 2.0.1
   */
  abbreviation(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.hacker.abbreviation
    );
  }

  /**
   * Returns a random hacker/IT adjective.
   *
   * @example
   * faker.hacker.adjective() // 'neural'
   *
   * @since 2.0.1
   */
  adjective(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.hacker.adjective
    );
  }

  /**
   * Returns a random hacker/IT noun.
   *
   * @example
   * faker.hacker.noun() // 'matrix'
   *
   * @since 2.0.1
   */
  noun(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.hacker.noun);
  }

  /**
   * Returns a random hacker/IT verb.
   *
   * @example
   * faker.hacker.verb() // 'input'
   *
   * @since 2.0.1
   */
  verb(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.hacker.verb);
  }

  /**
   * Returns a random hacker/IT verb for continuous actions (en: ing suffix; e.g. hacking).
   *
   * @example
   * faker.hacker.ingverb() // 'indexing'
   *
   * @since 2.0.1
   */
  ingverb(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.hacker.ingverb
    );
  }

  /**
   * Generates a random hacker/IT phrase.
   *
   * @example
   * faker.hacker.phrase() // 'Use the online SQL firewall, then you can hack the neural monitor!'
   *
   * @since 2.0.1
   */
  phrase(): string {
    const data = {
      abbreviation: this.abbreviation,
      adjective: this.adjective,
      ingverb: this.ingverb,
      noun: this.noun,
      verb: this.verb,
    };

    const phrase = this.faker.helpers.arrayElement(
      this.faker.definitions.hacker.phrase
    );
    return this.faker.helpers.mustache(phrase, data);
  }
}
