import { ModuleBase } from '../../internal/module-base';

/**
 * Module to generate book related entries.
 *
 * ### Overview
 *
 * - For a random title, use [`title()`](https://fakerjs.dev/api/book.html#title).
 * - For a random existing author name, use [`author()`](https://fakerjs.dev/api/book.html#author).
 * - For a random non-existing author name, use [`faker.person.fullName()`](https://fakerjs.dev/api/person.html#fullname).
 * - For a random genre, use [`genre()`](https://fakerjs.dev/api/book.html#genre).
 * - For a random series, use [`series()`](https://fakerjs.dev/api/book.html#series).
 * - For a random publisher, use [`publisher()`](https://fakerjs.dev/api/book.html#publisher).
 * - For a random book format, use [`format()`](https://fakerjs.dev/api/book.html#format).
 * - For a random isbn, use [`faker.commerce.isbn()`](https://fakerjs.dev/api/commerce.html#isbn)
 *
 * All values may be localized.
 */
export class BookModule extends ModuleBase {
  /**
   * Returns a random author name.
   *
   * @example
   * faker.book.author() // 'Joseph Conrad'
   *
   * @since 9.1.0
   */
  author(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.book.author);
  }

  /**
   * Returns a random book format.
   *
   * @example
   * faker.book.format() // 'Hardcover'
   *
   * @since 9.1.0
   */
  format(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.book.format);
  }

  /**
   * Returns a random genre.
   *
   * @example
   * faker.book.genre() // 'Memoir'
   *
   * @since 9.1.0
   */
  genre(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.book.genre);
  }

  /**
   * Returns a random publisher.
   *
   * @example
   * faker.book.publisher() // 'Jarrolds Publishing'
   *
   * @since 9.1.0
   */
  publisher(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.book.publisher
    );
  }

  /**
   * Returns a random series.
   *
   * @example
   * faker.book.series() // 'The Dresden Files'
   *
   * @since 9.1.0
   */
  series(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.book.series);
  }

  /**
   * Returns a random title.
   *
   * @example
   * faker.book.title() // 'Second Treatise of Government'
   *
   * @since 9.1.0
   */
  title(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.book.title);
  }
}
