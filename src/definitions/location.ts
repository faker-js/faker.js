import type { Language } from '../modules/location';
import type { LocaleEntry } from './definitions';

/**
 * The possible definitions related to addresses and locations.
 */
export type LocationDefinition = LocaleEntry<{
  /**
   * Postcodes patterns by state
   */
  postcode_by_state: {
    [state: string]: string | string[];
  };

  /**
   * Postcodes patterns.
   */
  postcode: string | string[];

  /**
   * The patterns to generate city names.
   */
  city_pattern: string[];

  /**
   * The names of actual cities.
   */
  city_name: string[];

  /**
   * Common city prefixes.
   */
  city_prefix: string[];

  /**
   * Common city suffixes.
   */
  city_suffix: string[];

  /**
   * The names of all continents.
   */
  continent: string[];

  /**
   * The names of all countries.
   */
  country: string[];

  /**
   * The [ISO_3166-1](https://en.wikipedia.org/wiki/ISO_3166-1) country codes.
   */
  country_code: Array<{ alpha2: string; alpha3: string; numeric: string }>;

  /**
   * The names of this country's states, or other first-level administrative areas.
   */
  state: string[];

  /**
   * The abbreviated names of this country's states, or other first-level administrative areas.
   */
  state_abbr: string[];

  /**
   * The names of counties, or other second-level administrative areas, inside the country's states.
   */
  county: string[];

  /**
   * The names of the compass directions.
   * First the 4 cardinal directions, then the 4 ordinal directions.
   */
  direction: {
    /**
     * The names of the cardinal compass directions.
     * Cardinal directions are the four main points of a compass.
     */
    cardinal: string[];

    /**
     * The abbreviated names of the cardinal compass directions.
     * Cardinal directions are the four main points of a compass.
     */
    cardinal_abbr: string[];

    /**
     * The names of ordinal compass directions.
     * Ordinal directions are combinations of cardinal directions.
     */
    ordinal: string[];

    /**
     * The abbreviated names of ordinal compass directions.
     * Ordinal directions are combinations of cardinal directions.
     */
    ordinal_abbr: string[];
  };

  /**
   * The pattern used to generate building numbers. Since building numbers rarely start with 0, any consecutive # characters will be replaced by a number without a leading zero.
   */
  building_number: string[];

  /**
   * The patterns to generate street names.
   */
  street_pattern: string[];

  /**
   * The names of actual streets.
   */
  street_name: string[];

  /**
   * Common street prefixes.
   */
  street_prefix: string[];

  /**
   * Common street suffixes.
   */
  street_suffix: string[];

  /**
   * The pattern used to generate street addresses.
   */
  street_address: {
    /**
     * The fake pattern to generate only the street address.
     */
    normal: string;

    /**
     * The fake pattern to generate the full street address including the secondary address.
     */
    full: string;
  };

  /**
   * The address "inside" an address/e.g. an apartment or office. Since these rarely start with 0, any consecutive # characters will be replaced by a number without a leading zero.
   */
  secondary_address: string[];

  /**
   * A list of time zones names relevant to this locale.
   *
   * @see [IANA Time Zone Database](https://www.iana.org/time-zones)
   */
  time_zone: string[];

  /**
   * A list of spoken languages.
   *
   * @see [ISO 639-2 Language Code List](https://www.loc.gov/standards/iso639-2/php/code_list.php)
   */
  language: Language[];
}>;
