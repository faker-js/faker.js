import type {Faker} from '../..';

/**
 * Module to generate animal related entries.
 */
export class AnimalModule {
  constructor(private readonly faker: Faker) {
    // Bind `this` so namespaced is working correctly
    for (const name of Object.getOwnPropertyNames(
      AnimalModule.prototype
    ) as Array<keyof AnimalModule | 'constructor'>) {
      if (name === 'constructor' || typeof this[name] !== 'function') {
        continue;
      }

      this[name] = this[name].bind(this);
    }

  }

  /**
   *   return randomly one of animals different types     .
   *
   * @example
   * faker.animal.random() // 'bear'
   *
   * @since
   */
  random(): string {
    // define array of animals
    const typeOfAnimals = [
      'bear', 'bird', 'cat', 'cetacean', 'cow', 'crocodilia', 'dog',
      'fish', 'horse', 'insect', 'lion', 'rabbit', 'rodent', 'snake'];

    // get length of typeOfAnimals
    const length: number = typeOfAnimals.length - 1;
    // get random number between 0 and length
    const index: number = this.faker.helpers.rangeToNumber({min: 0, max: length});
    // pick up  one of typeOfAnimals item
    const choice: string = typeOfAnimals[index];
    //define variable for store result of choice
    let arrayOfCreatures: string[] = [];

    //  select of animal types
    switch (choice) {
      case 'bear':
        arrayOfCreatures = this.faker.definitions.animal.bear;
        break;
      case 'bird':
        arrayOfCreatures = this.faker.definitions.animal.bird;
        break;
      case 'cat':
        arrayOfCreatures = this.faker.definitions.animal.cat;
        break;
      case 'cetacean':
        arrayOfCreatures = this.faker.definitions.animal.cetacean;
        break;
      case 'crocodilia':
        arrayOfCreatures = this.faker.definitions.animal.crocodilia;
        break;
      case 'dog':
        arrayOfCreatures = this.faker.definitions.animal.dog;
        break;
      case 'fish':
        arrayOfCreatures = this.faker.definitions.animal.fish;
        break;
      case 'horse':
        arrayOfCreatures = this.faker.definitions.animal.horse;
        break;
      case 'insect':
        arrayOfCreatures = this.faker.definitions.animal.insect;
        break;
      case 'lion':
        arrayOfCreatures = this.faker.definitions.animal.lion;
        break;
      case 'rabbit':
        arrayOfCreatures = this.faker.definitions.animal.rabbit;
        break;
      case 'rodent':
        arrayOfCreatures = this.faker.definitions.animal.rodent;
        break;
      case 'snake':
        arrayOfCreatures = this.faker.definitions.animal.snake;
        break;
    }
   // pick up randomly one of selected animal array
    return this.faker.helpers.arrayElement(arrayOfCreatures);

  }

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
   * faker.animal.type() // 'crocodilia'
   *
   * @since 5.5.0
   */
  type(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.animal.type);
  }

}
