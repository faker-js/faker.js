import { FakerError } from '../../errors/faker-error';
import { ModuleBase } from '../../internal/module-base';

/**
 * Represents a language with its full name, 2 character ISO 639-1 code, and 3 character ISO 639-2 code.
 */
export interface Language {
  /**
   * The full name for the language (e.g. `English`).
   */
  name: string;

  /**
   * The 2 character [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1) code.
   */
  alpha2: string;

  /**
   * The 3 character [ISO 639-2](https://en.wikipedia.org/wiki/ISO_639-2) code.
   */
  alpha3: string;
}

/**
 * Module to generate addresses and locations. Prior to Faker 8.0.0, this module was known as `faker.address`.
 *
 * ### Overview
 *
 * For a typical street address for a locale, use [`streetAddress()`](https://fakerjs.dev/api/location.html#streetaddress), [`city()`](https://fakerjs.dev/api/location.html#city), [`state()`](https://fakerjs.dev/api/location.html#state)), and [`zipCode()`](https://fakerjs.dev/api/location.html#zipcode). Most locales provide localized versions for a specific country.
 *
 * If you need latitude and longitude coordinates, use [`latitude()`](https://fakerjs.dev/api/location.html#latitude) and [`longitude()`](https://fakerjs.dev/api/location.html#longitude), or [`nearbyGPSCoordinate()`](https://fakerjs.dev/api/location.html#nearbygpscoordinate) for a latitude/longitude near a given location.
 *
 * For a random country, you can use [`country()`](https://fakerjs.dev/api/location.html#country) or [`countryCode()`](https://fakerjs.dev/api/location.html#countrycode).
 */
export class LocationModule extends ModuleBase {
  /**
   * Generates random zip code from specified format. If format is not specified,
   * the locale's zip format is used.
   *
   * @param options The format used to generate the zip code or an options object.
   * @param options.state The state to generate the zip code for.
   * If the current locale does not have a corresponding `postcode_by_state` definition, an error is thrown.
   * @param options.format The optional format used to generate the zip code.
   * By default, a random format is used from the locale zip formats.
   * This won't be used if the state option is specified.
   *
   * @see faker.helpers.replaceSymbols(): For more information about how the pattern is used.
   *
   * @example
   * faker.location.zipCode() // '76546-4893'
   * faker.location.zipCode('####') // '7559'
   *
   * @since 8.0.0
   */
  zipCode(
    options:
      | string
      | {
          /**
           * The state to generate the zip code for.
           *
           * If the current locale does not have a corresponding `postcode_by_state` definition, an error is thrown.
           */
          state?: string;
          /**
           * The optional format used to generate the zip code.
           *
           * This won't be used if the state option is specified.
           *
           * @default faker.definitions.location.postcode
           */
          format?: string;
        } = {}
  ): string {
    if (typeof options === 'string') {
      options = { format: options };
    }

    const { state } = options;

    if (state != null) {
      const zipPattern =
        this.faker.definitions.location.postcode_by_state[state];

      if (zipPattern == null) {
        throw new FakerError(
          `No zip code definition found for state "${state}"`
        );
      }

      return this.faker.helpers.fake(zipPattern);
    }

    let { format = this.faker.definitions.location.postcode } = options;
    if (typeof format === 'string') {
      format = [format];
    }

    format = this.faker.helpers.arrayElement(format);

    return this.faker.helpers.replaceSymbols(format);
  }

  /**
   * Generates a random localized city name.
   *
   * @example
   * faker.location.city() // 'Michealstead'
   * fakerDE.location.city() // 'Mervescheid'
   *
   * @since 8.0.0
   */
  city(): string {
    return this.faker.helpers.fake(
      this.faker.definitions.location.city_pattern
    );
  }

  /**
   * Generates a random building number.
   *
   * @example
   * faker.location.buildingNumber() // '7654'
   *
   * @since 8.0.0
   */
  buildingNumber(): string {
    return this.faker.helpers
      .arrayElement(this.faker.definitions.location.building_number)
      .replaceAll(/#+/g, (m) =>
        this.faker.string.numeric({
          length: m.length,
          allowLeadingZeros: false,
        })
      );
  }

  /**
   * Generates a random localized street name.
   *
   * @example
   * faker.location.street() // 'Rau Parks'
   *
   * @since 8.0.0
   */
  street(): string {
    return this.faker.helpers.fake(
      this.faker.definitions.location.street_pattern
    );
  }

  /**
   * Generates a random localized street address.
   *
   * @param options Whether to use a full address or an options object.
   * @param options.useFullAddress When true this will generate a full address.
   * Otherwise it will just generate a street address.
   *
   * @example
   * faker.location.streetAddress() // '7654 Kertzmann Tunnel'
   * faker.location.streetAddress(false) // '475 Walsh Center'
   * faker.location.streetAddress(true) // '18789 Marsh Lane Suite 261'
   * faker.location.streetAddress({ useFullAddress: true }) // '542 Market Place Suite 166'
   *
   * @since 8.0.0
   */
  streetAddress(
    options:
      | boolean
      | {
          /**
           * When true this will generate a full address.
           * Otherwise it will just generate a street address.
           */
          useFullAddress?: boolean;
        } = {}
  ): string {
    if (typeof options === 'boolean') {
      options = { useFullAddress: options };
    }

    const { useFullAddress } = options;

    const formats = this.faker.definitions.location.street_address;
    const format = formats[useFullAddress ? 'full' : 'normal'];

    return this.faker.helpers.fake(format);
  }

  /**
   * Generates a random localized secondary address. This refers to a specific location at a given address
   * such as an apartment or room number.
   *
   * @example
   * faker.location.secondaryAddress() // 'Suite 765'
   *
   * @since 8.0.0
   */
  secondaryAddress(): string {
    return this.faker.helpers
      .fake(this.faker.definitions.location.secondary_address)
      .replaceAll(/#+/g, (m) =>
        this.faker.string.numeric({
          length: m.length,
          allowLeadingZeros: false,
        })
      );
  }

  /**
   * Returns a random localized county, or other equivalent second-level administrative entity for the locale's country such as a district or department.
   *
   * @example
   * fakerEN_GB.location.county() // 'Kent'
   * fakerEN_US.location.county() // 'Lee County'
   *
   * @since 8.0.0
   */
  county(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.county
    );
  }

  /**
   * Returns a random country name.
   *
   * @example
   * faker.location.country() // 'Mali'
   *
   * @since 8.0.0
   */
  country(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.country
    );
  }

  /**
   * Returns a random continent name.
   *
   * @example
   * faker.location.continent() // 'Australia'
   *
   * @since 9.1.0
   */
  continent(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.continent
    );
  }

  /**
   * Returns a random [ISO_3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) country code.
   *
   * @param options The code to return or an options object.
   * @param options.variant The variant to return. Can be one of:
   *
   * - `'alpha-2'` (two-letter code)
   * - `'alpha-3'` (three-letter code)
   * - `'numeric'` (numeric code)
   *
   * Defaults to `'alpha-2'`.
   *
   * @example
   * faker.location.countryCode() // 'MA'
   * faker.location.countryCode('alpha-2') // 'PL'
   * faker.location.countryCode('alpha-3') // 'MRT'
   * faker.location.countryCode('numeric') // '434'
   *
   * @since 8.0.0
   */
  countryCode(
    options:
      | 'alpha-2'
      | 'alpha-3'
      | 'numeric'
      | {
          /**
           * The code to return.
           * Can be either `'alpha-2'` (two-letter code),
           * `'alpha-3'` (three-letter code)
           * or `'numeric'` (numeric code).
           *
           * @default 'alpha-2'
           */
          variant?: 'alpha-2' | 'alpha-3' | 'numeric';
        } = {}
  ): string {
    if (typeof options === 'string') {
      options = { variant: options };
    }

    const { variant = 'alpha-2' } = options;
    const key = (() => {
      switch (variant) {
        case 'numeric': {
          return 'numeric';
        }

        case 'alpha-3': {
          return 'alpha3';
        }

        case 'alpha-2': {
          return 'alpha2';
        }
      }
    })();

    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.country_code
    )[key];
  }

  /**
   * Returns a random localized state, or other equivalent first-level administrative entity for the locale's country such as a province or region.
   * Generally, these are the ISO 3166-2 subdivisions for a country.
   * If a locale doesn't correspond to one specific country, the method may return ISO 3166-2 subdivisions from one or more countries that uses that language. For example, the `ar` locale includes subdivisions from Arabic-speaking countries, such as Tunisia, Algeria, Syria, Lebanon, etc.
   * For historical compatibility reasons, the default `en` locale only includes states in the United States (identical to `en_US`). However, you can use other English locales, such as `en_IN`, `en_GB`, and `en_AU`, if needed.
   *
   * @param options An options object.
   * @param options.abbreviated If true this will return abbreviated first-level administrative entity names.
   * Otherwise this will return the long name. Defaults to `false`.
   *
   * @example
   * faker.location.state() // 'Nevada'
   * fakerEN_CA.location.state() // 'Nunavut'
   * fakerDE.location.state() // 'Niedersachsen'
   * faker.location.state({ abbreviated: true }) // 'OK'
   *
   * @since 8.0.0
   */
  state(
    options: {
      /**
       * If true this will return abbreviated first-level administrative entity names.
       * Otherwise this will return the long name.
       *
       * @default false
       */
      abbreviated?: boolean;
    } = {}
  ): string {
    const { abbreviated = false } = options;
    const stateDataSet = abbreviated
      ? this.faker.definitions.location.state_abbr
      : this.faker.definitions.location.state;

    return this.faker.helpers.arrayElement(stateDataSet);
  }

  /**
   * Generates a random latitude.
   *
   * @param options An options object.
   * @param options.max The upper bound for the latitude to generate. Defaults to `90`.
   * @param options.min The lower bound for the latitude to generate. Defaults to `-90`.
   * @param options.precision The number of decimal points of precision for the latitude. Defaults to `4`.
   *
   * @example
   * faker.location.latitude() // 8.7864
   * faker.location.latitude({ max: 10 }) // -18.481
   * faker.location.latitude({ max: 10, min: -10 }) // 2.0553
   * faker.location.latitude({ max: 10, min: -10, precision: 5 }) // 0.89766
   *
   * @since 8.0.0
   */
  latitude(
    options: {
      /**
       * The upper bound for the latitude to generate.
       *
       * @default 90
       */
      max?: number;
      /**
       * The lower bound for the latitude to generate.
       *
       * @default -90
       */
      min?: number;
      /**
       * The number of decimal points of precision for the latitude.
       *
       * @default 4
       */
      precision?: number;
    } = {}
  ): number {
    const { max = 90, min = -90, precision = 4 } = options;

    return this.faker.number.float({ min, max, fractionDigits: precision });
  }

  /**
   * Generates a random longitude.
   *
   * @param options An options object.
   * @param options.max The upper bound for the longitude to generate. Defaults to `180`.
   * @param options.min The lower bound for the longitude to generate. Defaults to `-180`.
   * @param options.precision The number of decimal points of precision for the longitude. Defaults to `4`.
   *
   * @example
   * faker.location.longitude() // 17.5729
   * faker.location.longitude({ max: 10 }) // -44.114
   * faker.location.longitude({ max: 10, min: -10 }) // 2.0553
   * faker.location.longitude({ max: 10, min: -10, precision: 5 }) // 0.89766
   *
   * @since 8.0.0
   */
  longitude(
    options: {
      /**
       * The upper bound for the longitude to generate.
       *
       * @default 180
       */
      max?: number;
      /**
       * The lower bound for the longitude to generate.
       *
       * @default -180
       */
      min?: number;
      /**
       * The number of decimal points of precision for the longitude.
       *
       * @default 4
       */
      precision?: number;
    } = {}
  ): number {
    const { max = 180, min = -180, precision = 4 } = options;

    return this.faker.number.float({ max, min, fractionDigits: precision });
  }

  /**
   * Returns a random direction (cardinal and ordinal; northwest, east, etc).
   *
   * @param options The options to use.
   * @param options.abbreviated If true this will return abbreviated directions (NW, E, etc).
   * Otherwise this will return the long name. Defaults to `false`.
   *
   * @example
   * faker.location.direction() // 'Northeast'
   * faker.location.direction({ abbreviated: true }) // 'NW'
   *
   * @since 8.0.0
   */
  direction(
    options: {
      /**
       * If true this will return abbreviated directions (NW, E, etc).
       * Otherwise this will return the long name.
       *
       * @default false
       */
      abbreviated?: boolean;
    } = {}
  ): string {
    const { abbreviated = false } = options;

    if (!abbreviated) {
      return this.faker.helpers.arrayElement([
        ...this.faker.definitions.location.direction.cardinal,
        ...this.faker.definitions.location.direction.ordinal,
      ]);
    }

    return this.faker.helpers.arrayElement([
      ...this.faker.definitions.location.direction.cardinal_abbr,
      ...this.faker.definitions.location.direction.ordinal_abbr,
    ]);
  }

  /**
   * Returns a random cardinal direction (north, east, south, west).
   *
   * @param options The options to use.
   * @param options.abbreviated If true this will return abbreviated directions (N, E, etc).
   * Otherwise this will return the long name. Defaults to `false`.
   *
   * @example
   * faker.location.cardinalDirection() // 'South'
   * faker.location.cardinalDirection({ abbreviated: true }) // 'S'
   *
   * @since 8.0.0
   */
  cardinalDirection(
    options: {
      /**
       * If true this will return abbreviated directions (N, E, etc).
       * Otherwise this will return the long name.
       *
       * @default false
       */
      abbreviated?: boolean;
    } = {}
  ): string {
    const { abbreviated = false } = options;

    if (!abbreviated) {
      return this.faker.helpers.arrayElement(
        this.faker.definitions.location.direction.cardinal
      );
    }

    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.direction.cardinal_abbr
    );
  }

  /**
   * Returns a random ordinal direction (northwest, southeast, etc).
   *
   * @param options Whether to use abbreviated or an options object.
   * @param options.abbreviated If true this will return abbreviated directions (NW, SE, etc).
   * Otherwise this will return the long name. Defaults to `false`.
   *
   * @example
   * faker.location.ordinalDirection() // 'Southeast'
   * faker.location.ordinalDirection({ abbreviated: true }) // 'SE'
   *
   * @since 8.0.0
   */
  ordinalDirection(
    options: {
      /**
       * If true this will return abbreviated directions (NW, SE, etc).
       * Otherwise this will return the long name.
       *
       * @default false
       */
      abbreviated?: boolean;
    } = {}
  ): string {
    const { abbreviated = false } = options;

    if (!abbreviated) {
      return this.faker.helpers.arrayElement(
        this.faker.definitions.location.direction.ordinal
      );
    }

    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.direction.ordinal_abbr
    );
  }

  /**
   * Generates a random GPS coordinate within the specified radius from the given coordinate.
   *
   * @param options The options for generating a GPS coordinate.
   * @param options.origin The original coordinate to get a new coordinate close to.
   * If no coordinate is given, a random one will be chosen.
   * @param options.radius The maximum distance from the given coordinate to the new coordinate. Defaults to `10`.
   * @param options.isMetric If `true` assume the radius to be in kilometers. If `false` for miles. Defaults to `false`.
   *
   * @example
   * faker.location.nearbyGPSCoordinate() // [ 8.7864, 77.4682 ]
   * faker.location.nearbyGPSCoordinate({ origin: [33, -170] }) // [ 32.95274756100263, -170.06271843206343 ]
   * faker.location.nearbyGPSCoordinate({ origin: [33, -170], radius: 1000, isMetric: true }) // [ 35.66934494697957, -175.13118223236756 ]
   *
   * @since 8.0.0
   */
  nearbyGPSCoordinate(
    options: {
      /**
       * The original coordinate to get a new coordinate close to.
       */
      origin?: [latitude: number, longitude: number];
      /**
       * The maximum distance from the given coordinate to the new coordinate.
       *
       * @default 10
       */
      radius?: number;
      /**
       * If `true` assume the radius to be in kilometers. If `false` for miles.
       *
       * @default false
       */
      isMetric?: boolean;
    } = {}
  ): [latitude: number, longitude: number] {
    const { origin, radius = 10, isMetric = false } = options;

    // If there is no origin, the best we can do is return a random GPS coordinate.
    if (origin == null) {
      return [this.latitude(), this.longitude()];
    }

    const angleRadians = this.faker.number.float({
      max: 2 * Math.PI,
      fractionDigits: 5,
    }); // in ° radians

    const radiusMetric = isMetric ? radius : radius * 1.60934; // in km
    const errorCorrection = 0.995; // avoid float issues
    const distanceInKm =
      this.faker.number.float({
        max: radiusMetric,
        fractionDigits: 3,
      }) * errorCorrection; // in km

    /**
     * The distance in km per degree for earth.
     */
    const kmPerDegree = 40_000 / 360; // in km/°

    const distanceInDegree = distanceInKm / kmPerDegree; // in °

    const coordinate: [latitude: number, longitude: number] = [
      origin[0] + Math.sin(angleRadians) * distanceInDegree,
      origin[1] + Math.cos(angleRadians) * distanceInDegree,
    ];

    // Box latitude [-90°, 90°]
    coordinate[0] = coordinate[0] % 180;
    if (coordinate[0] < -90 || coordinate[0] > 90) {
      coordinate[0] = Math.sign(coordinate[0]) * 180 - coordinate[0];
      coordinate[1] += 180;
    }

    // Box longitude [-180°, 180°]
    coordinate[1] = (((coordinate[1] % 360) + 540) % 360) - 180;

    return [coordinate[0], coordinate[1]];
  }

  /**
   * Returns a random IANA time zone relevant to this locale.
   *
   * The returned time zone is tied to the current locale.
   *
   * @see [IANA Time Zone Database](https://www.iana.org/time-zones)
   * @see faker.date.timeZone(): For generating a random time zone from all available time zones.
   *
   * @example
   * faker.location.timeZone() // 'Asia/Dili'
   *
   * @since 8.0.0
   */
  timeZone(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.time_zone
    );
  }

  /**
   * Returns a random spoken language.
   *
   * @see [ISO 639-1](https://en.wikipedia.org/wiki/ISO_639-1)
   * @see [ISO 639-2](https://en.wikipedia.org/wiki/ISO_639-2)
   * @see [ISO 639-2 Language Code List](https://www.loc.gov/standards/iso639-2/php/code_list.php)
   *
   * @example
   * faker.location.language() // { 'name': 'Ukrainian', 'alpha2': 'uk', 'alpha3': 'ukr' }
   * faker.location.language().name // 'Catalan'
   * faker.location.language().alpha2 // 'sk'
   * faker.location.language().alpha3 // 'ukr'
   *
   * @since 9.4.0
   */
  language(): Language {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.location.language
    );
  }
}
