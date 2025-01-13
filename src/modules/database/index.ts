import { ModuleBase } from '../../internal/module-base';

/**
 * Module to generate database related entries.
 *
 * ### Overview
 *
 * Traditional relational database tables have data organized in columns with specific types - [`column()`](https://fakerjs.dev/api/database.html#column), [`type()`](https://fakerjs.dev/api/database.html#type). The database usually has an [`engine()`](https://fakerjs.dev/api/database.html#engine) and a default [`collation()`](https://fakerjs.dev/api/database.html#collation) for sorting.
 *
 * For the NoSQL database MongoDB, [`mongodbObjectId()`](https://fakerjs.dev/api/database.html#mongodbobjectid) provides a random ID.
 */
export class DatabaseModule extends ModuleBase {
  /**
   * Returns a random database column name.
   *
   * @example
   * faker.database.column() // 'name'
   *
   * @since 4.0.0
   */
  column(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.database.column
    );
  }

  /**
   * Returns a random database column type.
   *
   * @example
   * faker.database.type() // 'mediumint'
   *
   * @since 4.0.0
   */
  type(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.database.type
    );
  }

  /**
   * Returns a random database collation.
   *
   * @example
   * faker.database.collation() // 'cp1250_general_ci'
   *
   * @since 4.0.0
   */
  collation(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.database.collation
    );
  }

  /**
   * Returns a random database engine.
   *
   * @example
   * faker.database.engine() // 'InnoDB'
   *
   * @since 4.0.0
   */
  engine(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.database.engine
    );
  }

  /**
   * Returns a MongoDB [ObjectId](https://docs.mongodb.com/manual/reference/method/ObjectId/) string.
   *
   * @example
   * faker.database.mongodbObjectId() // 'cfdb9e9df8bbce110cbdfbab'
   *
   * @since 6.2.0
   */
  mongodbObjectId(): string {
    return this.faker.string.hexadecimal({
      length: 24,
      casing: 'lower',
      prefix: '',
    });
  }
}
