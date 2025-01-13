import { ModuleBase } from '../../internal/module-base';

/**
 * Module to generate company related entries.
 *
 * ### Overview
 *
 * To generate a random company name, use [`name()`](https://fakerjs.dev/api/company.html#name). This is localized in many locales.
 *
 * To generate jargon-filled company catchphrases and buzzwords, use [`catchPhrase()`](https://fakerjs.dev/api/company.html#catchphrase) or [`buzzPhrase()`](https://fakerjs.dev/api/company.html#buzzphrase).
 *
 * ### Related Modules
 *
 * - For products and commerce, use [`faker.commerce`](https://fakerjs.dev/api/commerce.html).
 * - For finance-related entries, use [`faker.finance`](https://fakerjs.dev/api/finance.html).
 */
export class CompanyModule extends ModuleBase {
  /**
   * Generates a random company name.
   *
   * @example
   * faker.company.name() // 'Rau LLC'
   *
   * @since 7.4.0
   */
  name(): string {
    return this.faker.helpers.fake(this.faker.definitions.company.name_pattern);
  }

  /**
   * Generates a random catch phrase that can be displayed to an end user.
   *
   * @example
   * faker.company.catchPhrase() // 'Organic optimizing methodology'
   *
   * @since 2.0.1
   */
  catchPhrase(): string {
    return [
      this.catchPhraseAdjective(),
      this.catchPhraseDescriptor(),
      this.catchPhraseNoun(),
    ].join(' ');
  }

  /**
   * Generates a random buzz phrase that can be used to demonstrate data being viewed by a manager.
   *
   * @example
   * faker.company.buzzPhrase() // 'iterate rich models'
   *
   * @since 8.0.0
   */
  buzzPhrase(): string {
    return [this.buzzVerb(), this.buzzAdjective(), this.buzzNoun()].join(' ');
  }

  /**
   * Returns a random catch phrase adjective that can be displayed to an end user..
   *
   * @example
   * faker.company.catchPhraseAdjective() // 'Organic'
   *
   * @since 2.0.1
   */
  catchPhraseAdjective(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.company.adjective
    );
  }

  /**
   * Returns a random catch phrase descriptor that can be displayed to an end user..
   *
   * @example
   * faker.company.catchPhraseDescriptor() // 'intermediate'
   *
   * @since 2.0.1
   */
  catchPhraseDescriptor(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.company.descriptor
    );
  }

  /**
   * Returns a random catch phrase noun that can be displayed to an end user..
   *
   * @example
   * faker.company.catchPhraseNoun() // 'knowledge base'
   *
   * @since 2.0.1
   */
  catchPhraseNoun(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.company.noun);
  }

  /**
   * Returns a random buzz adjective that can be used to demonstrate data being viewed by a manager.
   *
   * @example
   * faker.company.buzzAdjective() // 'mission-critical'
   *
   * @since 8.0.0
   */
  buzzAdjective(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.company.buzz_adjective
    );
  }

  /**
   * Returns a random buzz verb that can be used to demonstrate data being viewed by a manager.
   *
   * @example
   * faker.company.buzzVerb() // 'iterate'
   *
   * @since 8.0.0
   */
  buzzVerb(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.company.buzz_verb
    );
  }

  /**
   * Returns a random buzz noun that can be used to demonstrate data being viewed by a manager.
   *
   * @example
   * faker.company.buzzNoun() // 'metrics'
   *
   * @since 8.0.0
   */
  buzzNoun(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.company.buzz_noun
    );
  }
}
