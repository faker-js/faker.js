import { ModuleBase } from '../../internal/module-base';

/**
 * The possible definitions related to elements.
 */
export interface ChemicalElement {
  /**
   * The symbol for the element (e.g. `'He'`).
   */
  symbol: string;
  /**
   * The name for the element (e.g. `'Cerium'`).
   */
  name: string;
  /**
   * The atomic number for the element (e.g. `52`).
   */
  atomicNumber: number;
}

export interface Unit {
  /**
   * The long version of the unit (e.g. `meter`).
   */
  name: string;
  /**
   * The short version/abbreviation of the element (e.g. `Pa`).
   */
  symbol: string;
}

/**
 * Module to generate science related entries.
 *
 * ### Overview
 *
 * Both methods in this module return objects rather than strings. For example, you can use `faker.science.chemicalElement().name` to pick out the specific property you need.
 */
export class ScienceModule extends ModuleBase {
  /**
   * Returns a random periodic table element.
   *
   * @example
   * faker.science.chemicalElement() // { 'symbol': 'Tb', 'name': 'Terbium', 'atomicNumber': 65 }
   * faker.science.chemicalElement() // { 'symbol': 'At', 'name': 'Astatine', 'atomicNumber': 85 }
   * faker.science.chemicalElement() // { 'symbol': 'Hf', 'name': 'Hafnium', 'atomicNumber': 72 }
   *
   * @since 7.2.0
   */
  chemicalElement(): ChemicalElement {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.science.chemical_element
    );
  }

  /**
   * Returns a random scientific unit.
   *
   * @example
   * faker.science.unit() // { 'name': 'ohm', 'symbol': 'Ω' }
   * faker.science.unit() // { 'name': 'gray', 'symbol': 'Gy' }
   * faker.science.unit() // { 'name': 'degree Celsius', 'symbol': '°C' }
   *
   * @since 7.2.0
   */
  unit(): Unit {
    return this.faker.helpers.arrayElement(this.faker.definitions.science.unit);
  }
}
