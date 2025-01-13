/**
 * IATA stands for [International Air Transport Association](https://iata.org).
 * It's the trade association for the world's airlines and it is
 * responsible for setting standards relating to many aspects of airline
 * operations.
 */
import { ModuleBase } from '../../internal/module-base';

export enum Aircraft {
  Narrowbody = 'narrowbody',
  Regional = 'regional',
  Widebody = 'widebody',
}

export type AircraftType = `${Aircraft}`;

export interface Airline {
  /**
   * The name of the airline (e.g. `'American Airlines'`).
   */
  readonly name: string;
  /**
   * The 2 character IATA code of the airline (e.g. `'AA'`).
   */
  readonly iataCode: string;
}

export interface Airplane {
  /**
   * The name of the airplane (e.g. `'Airbus A321'`).
   */
  readonly name: string;
  /**
   * The IATA code of the airplane (e.g. `'321'`).
   */
  readonly iataTypeCode: string;
}

export interface Airport {
  /**
   * The name of the airport (e.g. `'Dallas Fort Worth International Airport'`).
   */
  readonly name: string;
  /**
   * The IATA code of the airport (e.g. `'DFW'`).
   */
  readonly iataCode: string;
}

const numerics = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const visuallySimilarCharacters = ['0', 'O', '1', 'I', 'L'];
const aircraftTypeMaxRows: Record<AircraftType, number> = {
  regional: 20,
  narrowbody: 35,
  widebody: 60,
};
const aircraftTypeSeats: Record<AircraftType, string[]> = {
  regional: ['A', 'B', 'C', 'D'],
  narrowbody: ['A', 'B', 'C', 'D', 'E', 'F'],
  widebody: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'],
};

/**
 * Module to generate airline and airport related data.
 *
 * ### Overview
 *
 * Several methods in this module return objects rather than strings. For example, you can use `faker.airline.airport().iataCode` to pick out the specific property you need.
 *
 * For a random airport, use [`airport()`](https://fakerjs.dev/api/airline.html#airport).
 *
 * For a random airline, use [`airline()`](https://fakerjs.dev/api/airline.html#airline).
 *
 * For a dummy booking, a passenger will generally book a flight on a specific [`flightNumber()`](https://fakerjs.dev/api/airline.html#flightnumber), [`airplane()`](https://fakerjs.dev/api/airline.html#airplane), be allocated a [`seat()`](https://fakerjs.dev/api/airline.html#seat), and [`recordLocator()`](https://fakerjs.dev/api/airline.html#recordlocator).
 *
 * ### Related Modules
 *
 * - To generate sample passenger data, you can use the methods of the [`faker.person`](https://fakerjs.dev/api/person.html) module.
 */
export class AirlineModule extends ModuleBase {
  /**
   * Generates a random airport.
   *
   * @example
   * faker.airline.airport() // { 'name': 'Leonardo da Vinci-Fiumicino Airport', 'iataCode': 'FCO' }
   *
   * @since 8.0.0
   */
  airport(): Airport {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.airline.airport
    );
  }

  /**
   * Generates a random airline.
   *
   * @example
   * faker.airline.airline() // { 'name': 'Korean Air', 'iataCode': 'KE' }
   *
   * @since 8.0.0
   */
  airline(): Airline {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.airline.airline
    );
  }

  /**
   * Generates a random airplane.
   *
   * @example
   * faker.airline.airplane() // { 'name': 'Canadair CL-44', 'iataTypeCode': 'CL4' }
   *
   * @since 8.0.0
   */
  airplane(): Airplane {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.airline.airplane
    );
  }

  /**
   * Generates a random [record locator](https://en.wikipedia.org/wiki/Record_locator). Record locators
   * are used by airlines to identify reservations. They're also known as booking reference numbers,
   * locator codes, confirmation codes, or reservation codes.
   *
   * @param options The options to use.
   * @param options.allowNumerics Whether to allow numeric characters. Defaults to `false`.
   * @param options.allowVisuallySimilarCharacters Whether to allow visually similar characters such as '1' and 'I'. Defaults to `false`.
   *
   * @example
   * faker.airline.recordLocator() // 'PTQPKR'
   * faker.airline.recordLocator({ allowNumerics: true }) // 'FWYDTJ'
   * faker.airline.recordLocator({ allowVisuallySimilarCharacters: true }) // 'OYBCAV'
   * faker.airline.recordLocator({ allowNumerics: true, allowVisuallySimilarCharacters: true }) // 'SVZSGS'
   *
   * @since 8.0.0
   */
  recordLocator(
    options: {
      /**
       * Whether to allow numeric characters.
       *
       * @default false
       */
      allowNumerics?: boolean;
      /**
       * Whether to allow visually similar characters such as '1' and 'I'.
       *
       * @default false
       */
      allowVisuallySimilarCharacters?: boolean;
    } = {}
  ): string {
    const { allowNumerics = false, allowVisuallySimilarCharacters = false } =
      options;
    const excludedChars: string[] = [];
    if (!allowNumerics) {
      excludedChars.push(...numerics);
    }

    if (!allowVisuallySimilarCharacters) {
      excludedChars.push(...visuallySimilarCharacters);
    }

    return this.faker.string.alphanumeric({
      length: 6,
      casing: 'upper',
      exclude: excludedChars,
    });
  }

  /**
   * Generates a random seat.
   *
   * @param options The options to use.
   * @param options.aircraftType The aircraft type. Can be one of `narrowbody`, `regional`, `widebody`. Defaults to `narrowbody`.
   *
   * @example
   * faker.airline.seat() // '20E'
   * faker.airline.seat({ aircraftType: 'regional' }) // '13C'
   * faker.airline.seat({ aircraftType: 'widebody' }) // '26G'
   *
   * @since 8.0.0
   */
  seat(
    options: {
      /**
       * The aircraft type. Can be one of `narrowbody`, `regional`, `widebody`.
       *
       * @default 'narrowbody'
       */
      aircraftType?: AircraftType;
    } = {}
  ): string {
    const { aircraftType = Aircraft.Narrowbody } = options;
    const maxRow = aircraftTypeMaxRows[aircraftType];
    const allowedSeats = aircraftTypeSeats[aircraftType];
    const row = this.faker.number.int({ min: 1, max: maxRow });
    const seat = this.faker.helpers.arrayElement(allowedSeats);
    return `${row}${seat}`;
  }

  /**
   * Returns a random aircraft type.
   *
   * @example
   * faker.airline.aircraftType() // 'regional'
   *
   * @since 8.0.0
   */
  aircraftType(): AircraftType {
    return this.faker.helpers.enumValue(Aircraft);
  }

  /**
   * Returns a random flight number. Flight numbers are always 1 to 4 digits long. Sometimes they are
   * used without leading zeros (e.g.: `American Airlines flight 425`) and sometimes with leading
   * zeros, often with the airline code prepended (e.g.: `AA0425`).
   *
   * To generate a flight number prepended with an airline code, combine this function with the
   * `airline()` function and use template literals:
   * ```
   * `${faker.airline.airline().iataCode}${faker.airline.flightNumber({ addLeadingZeros: true })}` // 'AA0798'
   * ```
   *
   * @param options The options to use.
   * @param options.length The number or range of digits to generate. Defaults to `{ min: 1, max: 4 }`.
   * @param options.addLeadingZeros Whether to pad the flight number up to 4 digits with leading zeros. Defaults to `false`.
   *
   * @example
   * faker.airline.flightNumber() // '765'
   * faker.airline.flightNumber({ addLeadingZeros: true }) // '0064'
   * faker.airline.flightNumber({ addLeadingZeros: true, length: 2 }) // '0099'
   * faker.airline.flightNumber({ addLeadingZeros: true, length: { min: 2, max: 3 } }) // '0085'
   * faker.airline.flightNumber({ length: 3 }) // '690'
   * faker.airline.flightNumber({ length: { min: 2, max: 3 } }) // '18'
   *
   * @since 8.0.0
   */
  flightNumber(
    options: {
      /**
       * The number or range of digits to generate.
       *
       * @default { min: 1, max: 4 }
       */
      length?:
        | number
        | {
            /**
             * The minimum number of digits to generate.
             */
            min: number;
            /**
             * The maximum number of digits to generate.
             */
            max: number;
          };
      /**
       * Whether to pad the flight number up to 4 digits with leading zeros.
       *
       * @default false
       */
      addLeadingZeros?: boolean;
    } = {}
  ): string {
    const { length = { min: 1, max: 4 }, addLeadingZeros = false } = options;
    const flightNumber = this.faker.string.numeric({
      length,
      allowLeadingZeros: false,
    });
    return addLeadingZeros ? flightNumber.padStart(4, '0') : flightNumber;
  }
}
