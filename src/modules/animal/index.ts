import { ModuleBase } from '../../internal/module-base';

/**
 * Module to generate animal related entries.
 *
 * ### Overview
 *
 * For a general type of animal (e.g. `'dog'`), use [`type()`](https://fakerjs.dev/api/animal.html#type).
 *
 * Otherwise, use one of the more specific methods, such as [`cat()`](https://fakerjs.dev/api/animal.html#cat) for a specific breed of cat.
 *
 * All values may be localized.
 */
export class AnimalModule extends ModuleBase {
  /**
   * Returns a random dog breed.
   *
   * @example
   * faker.animal.dog() // 'Irish Water Spaniel'
   *
   * @since 5.5.0
   */
  dog(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.dog);
  }

  /**
   * Returns a random cat breed.
   *
   * @example
   * faker.animal.cat() // 'Singapura'
   *
   * @since 5.5.0
   */
  cat(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.cat);
  }

  /**
   * Returns a random snake species.
   *
   * @example
   * faker.animal.snake() // 'Eyelash viper'
   *
   * @since 5.5.0
   */
  snake(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.snake);
  }

  /**
   * Returns a random bear species.
   *
   * @example
   * faker.animal.bear() // 'Asian black bear'
   *
   * @since 5.5.0
   */
  bear(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.bear);
  }

  /**
   * Returns a random lion species.
   *
   * @example
   * faker.animal.lion() // 'Northeast Congo Lion'
   *
   * @since 5.5.0
   */
  lion(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.lion);
  }

  /**
   * Returns a random cetacean species.
   *
   * @example
   * faker.animal.cetacean() // 'Spinner Dolphin'
   *
   * @since 5.5.0
   */
  cetacean(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.animal.cetacean
    );
  }

  /**
   * Returns a random horse breed.
   *
   * @example
   * faker.animal.horse() // 'Swedish Warmblood'
   *
   * @since 5.5.0
   */
  horse(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.horse);
  }

  /**
   * Returns a random bird species.
   *
   * @example
   * faker.animal.bird() // 'Buller's Shearwater'
   *
   * @since 5.5.0
   */
  bird(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.bird);
  }

  /**
   * Returns a random cow species.
   *
   * @example
   * faker.animal.cow() // 'Brava'
   *
   * @since 5.5.0
   */
  cow(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.cow);
  }

  /**
   * Returns a random fish species.
   *
   * @example
   * faker.animal.fish() // 'Mandarin fish'
   *
   * @since 5.5.0
   */
  fish(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.fish);
  }

  /**
   * Returns a random crocodilian species.
   *
   * @example
   * faker.animal.crocodilia() // 'Philippine Crocodile'
   *
   * @since 5.5.0
   */
  crocodilia(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.animal.crocodilia
    );
  }

  /**
   * Returns a random insect species.
   *
   * @example
   * faker.animal.insect() // 'Pyramid ant'
   *
   * @since 5.5.0
   */
  insect(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.animal.insect
    );
  }

  /**
   * Returns a random rabbit species.
   *
   * @example
   * faker.animal.rabbit() // 'Florida White'
   *
   * @since 5.5.0
   */
  rabbit(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.animal.rabbit
    );
  }

  /**
   * Returns a random rodent breed.
   *
   * @example
   * faker.animal.rodent() // 'Cuscomys ashanika'
   *
   * @since 7.4.0
   */
  rodent(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.animal.rodent
    );
  }

  /**
   * Returns a random animal type.
   *
   * @example
   * faker.animal.type() // 'crocodile'
   *
   * @since 5.5.0
   */
  type(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.type);
  }

  /**
   * Returns a random pet name.
   *
   * @example
   * faker.animal.petName() // 'Coco'
   *
   * @since 9.2.0
   */
  petName(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.animal.pet_name
    );
  }
}
