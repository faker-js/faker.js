import type { LocaleDefinition, MetadataDefinition } from './definitions';
import { FakerError } from './errors/faker-error';
import { deprecated } from './internal/deprecated';
import type { LocaleProxy } from './internal/locale-proxy';
import { createLocaleProxy } from './internal/locale-proxy';
import { AirlineModule } from './modules/airline';
import { AnimalModule } from './modules/animal';
import { BookModule } from './modules/book';
import { ColorModule } from './modules/color';
import { CommerceModule } from './modules/commerce';
import { CompanyModule } from './modules/company';
import { DatabaseModule } from './modules/database';
import { DateModule } from './modules/date';
import { FinanceModule } from './modules/finance';
import { FoodModule } from './modules/food';
import { GitModule } from './modules/git';
import { HackerModule } from './modules/hacker';
import { HelpersModule } from './modules/helpers';
import { ImageModule } from './modules/image';
import { InternetModule } from './modules/internet';
import type { LocationModule as AddressModule } from './modules/location';
import { LocationModule } from './modules/location';
import { LoremModule } from './modules/lorem';
import { MusicModule } from './modules/music';
import type { PersonModule as NameModule } from './modules/person';
import { PersonModule } from './modules/person';
import { PhoneModule } from './modules/phone';
import { ScienceModule } from './modules/science';
import { SystemModule } from './modules/system';
import { VehicleModule } from './modules/vehicle';
import { WordModule } from './modules/word';
import type { Randomizer } from './randomizer';
import { SimpleFaker } from './simple-faker';
import { mergeLocales } from './utils/merge-locales';

/**
 * This is Faker's main class containing all modules that can be used to generate data.
 *
 * Please have a look at the individual modules and methods for more information and examples.
 *
 * @example
 * import { faker } from '@faker-js/faker';
 * // const { faker } = require('@faker-js/faker');
 *
 * // faker.seed(1234);
 *
 * faker.person.firstName(); // 'John'
 * faker.person.lastName(); // 'Doe'
 * @example
 * import { Faker, es } from '@faker-js/faker';
 * // const { Faker, es } = require('@faker-js/faker');
 *
 * // create a Faker instance with only es data and no en fallback (=> smaller bundle size)
 * const customFaker = new Faker({ locale: [es] });
 *
 * customFaker.person.firstName(); // 'Javier'
 * customFaker.person.lastName(); // 'Ocampo Corrales'
 *
 * customFaker.music.genre(); // throws Error as this data is not available in `es`
 */
export class Faker extends SimpleFaker {
  readonly rawDefinitions: LocaleDefinition;
  readonly definitions: LocaleProxy;

  readonly airline: AirlineModule = new AirlineModule(this);
  readonly animal: AnimalModule = new AnimalModule(this);
  readonly book: BookModule = new BookModule(this);
  readonly color: ColorModule = new ColorModule(this);
  readonly commerce: CommerceModule = new CommerceModule(this);
  readonly company: CompanyModule = new CompanyModule(this);
  readonly database: DatabaseModule = new DatabaseModule(this);
  readonly date: DateModule = new DateModule(this);
  readonly finance = new FinanceModule(this);
  readonly food = new FoodModule(this);
  readonly git: GitModule = new GitModule(this);
  readonly hacker: HackerModule = new HackerModule(this);
  readonly helpers: HelpersModule = new HelpersModule(this);
  readonly image: ImageModule = new ImageModule(this);
  readonly internet: InternetModule = new InternetModule(this);
  readonly location: LocationModule = new LocationModule(this);
  readonly lorem: LoremModule = new LoremModule(this);
  readonly music: MusicModule = new MusicModule(this);
  readonly person: PersonModule = new PersonModule(this);
  readonly phone: PhoneModule = new PhoneModule(this);
  readonly science: ScienceModule = new ScienceModule(this);
  readonly system: SystemModule = new SystemModule(this);
  readonly vehicle: VehicleModule = new VehicleModule(this);
  readonly word: WordModule = new WordModule(this);

  // Aliases
  /** @deprecated Use {@link Faker#location} instead */
  get address(): AddressModule {
    deprecated({
      deprecated: 'faker.address',
      proposed: 'faker.location',
      since: '8.0',
      until: '10.0',
    });
    return this.location;
  }

  /** @deprecated Use {@link Faker#person} instead */
  get name(): NameModule {
    deprecated({
      deprecated: 'faker.name',
      proposed: 'faker.person',
      since: '8.0',
      until: '10.0',
    });
    return this.person;
  }

  /**
   * Creates a new instance of Faker.
   *
   * In most cases you should use one of the prebuilt Faker instances instead of the constructor, for example `fakerDE`, `fakerFR`, ...
   *
   * You only need to use the constructor if you need custom fallback logic or a custom locale.
   *
   * For more information see our [Localization Guide](https://fakerjs.dev/guide/localization.html).
   *
   * @param options The options to use.
   * @param options.locale The locale data to use.
   * @param options.randomizer The Randomizer to use.
   * Specify this only if you want to use it to achieve a specific goal,
   * such as sharing the same random generator with other instances/tools.
   * Defaults to faker's Mersenne Twister based pseudo random number generator.
   * @param options.seed The initial seed to use.
   * The seed can be used to generate reproducible values.
   * Refer to the `seed()` method for more information.
   * Defaults to a random seed.
   *
   * @example
   * import { Faker, es } from '@faker-js/faker';
   * // const { Faker, es } = require('@faker-js/faker');
   *
   * // create a Faker instance with only es data and no en fallback (=> smaller bundle size)
   * const customFaker = new Faker({ locale: [es] });
   *
   * customFaker.person.firstName(); // 'Javier'
   * customFaker.person.lastName(); // 'Ocampo Corrales'
   *
   * customFaker.music.genre(); // throws Error as this data is not available in `es`
   *
   * @since 8.0.0
   */
  constructor(options: {
    /**
     * The locale data to use for this instance.
     * If an array is provided, the first locale that has a definition for a given property will be used.
     *
     * @see mergeLocales(): For more information about how the locales are merged.
     */
    locale: LocaleDefinition | LocaleDefinition[];

    /**
     * The Randomizer to use.
     * Specify this only if you want to use it to achieve a specific goal,
     * such as sharing the same random generator with other instances/tools.
     *
     * @default generateMersenne53Randomizer()
     */
    randomizer?: Randomizer;

    /**
     * The initial seed to use.
     * The seed can be used to generate reproducible values.
     *
     * Refer to the `seed()` method for more information.
     *
     * Defaults to a random seed.
     */
    seed?: number;
  }) {
    super({ randomizer: options.randomizer, seed: options.seed });

    let { locale } = options;

    if (Array.isArray(locale)) {
      if (locale.length === 0) {
        throw new FakerError(
          'The locale option must contain at least one locale definition.'
        );
      }

      locale = mergeLocales(locale);
    }

    this.rawDefinitions = locale;
    this.definitions = createLocaleProxy(this.rawDefinitions);
  }

  /**
   * Returns an object with metadata about the current locale.
   *
   * @example
   * import { faker, fakerES_MX } from '@faker-js/faker';
   * // const { faker, fakerES_MX } = require("@faker-js/faker")
   * faker.getMetadata(); // { title: 'English', code: 'en', language: 'en', endonym: 'English', dir: 'ltr', script: 'Latn' }
   * fakerES_MX.getMetadata(); // { title: 'Spanish (Mexico)', code: 'es_MX', language: 'es', endonym: 'Español (México)', dir: 'ltr', script: 'Latn', country: 'MX' }
   *
   * @since 8.1.0
   */
  getMetadata(): MetadataDefinition {
    return this.rawDefinitions.metadata ?? {};
  }
}

export type FakerOptions = ConstructorParameters<typeof Faker>[0];
