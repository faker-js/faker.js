import { ModuleBase } from '../../internal/module-base';

/**
 * Module to generate vehicle related entries.
 *
 * ### Overview
 *
 * Most methods are related to cars/automobiles: a [`vehicle()`](https://fakerjs.dev/api/vehicle.html#vehicle) name is comprised of a car [`manufacturer()`](https://fakerjs.dev/api/vehicle.html#manufacturer) and [`model()`](https://fakerjs.dev/api/vehicle.html#model). You can also generate [`fuel()`](https://fakerjs.dev/api/vehicle.html#fuel), [`type()`](https://fakerjs.dev/api/vehicle.html#type), and [`color()`](https://fakerjs.dev/api/vehicle.html#color), as well as typical car registration IDs [`vin()`](https://fakerjs.dev/api/vehicle.html#vin) and [`vrm()`](https://fakerjs.dev/api/vehicle.html#vrm).
 *
 * If you prefer two wheels, you can generate a [`bicycle()`](https://fakerjs.dev/api/vehicle.html#bicycle) type instead.
 */
export class VehicleModule extends ModuleBase {
  /**
   * Returns a random vehicle.
   *
   * @example
   * faker.vehicle.vehicle() // 'Mazda Model S'
   *
   * @since 5.0.0
   */
  vehicle(): string {
    return `${this.manufacturer()} ${this.model()}`;
  }

  /**
   * Returns a manufacturer name.
   *
   * @example
   * faker.vehicle.manufacturer() // 'Mazda'
   *
   * @since 5.0.0
   */
  manufacturer(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.vehicle.manufacturer
    );
  }

  /**
   * Returns a vehicle model.
   *
   * @example
   * faker.vehicle.model() // 'Golf'
   *
   * @since 5.0.0
   */
  model(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.vehicle.model
    );
  }

  /**
   * Returns a vehicle type.
   *
   * @example
   * faker.vehicle.type() // 'Minivan'
   *
   * @since 5.0.0
   */
  type(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.vehicle.type);
  }

  /**
   * Returns a fuel type.
   *
   * @example
   * faker.vehicle.fuel() // 'Gasoline'
   *
   * @since 5.0.0
   */
  fuel(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.vehicle.fuel);
  }

  /**
   * Returns a vehicle identification number (VIN).
   *
   * @example
   * faker.vehicle.vin() // 'JPKHDMEWYCVH59000'
   *
   * @since 5.0.0
   */
  vin(): string {
    const exclude = ['o', 'i', 'q', 'O', 'I', 'Q'];
    return `${this.faker.string.alphanumeric({
      length: 10,
      casing: 'upper',
      exclude,
    })}${this.faker.string.alpha({
      length: 1,
      casing: 'upper',
      exclude,
    })}${this.faker.string.alphanumeric({
      length: 1,
      casing: 'upper',
      exclude,
    })}${this.faker.string.numeric({ length: 5, allowLeadingZeros: true })}`;
  }

  /**
   * Returns a vehicle color.
   *
   * @example
   * faker.vehicle.color() // 'orchid'
   *
   * @since 5.0.0
   */
  color(): string {
    return this.faker.color.human();
  }

  /**
   * Returns a vehicle registration number (Vehicle Registration Mark - VRM)
   *
   * @example
   * faker.vehicle.vrm() // 'OS65LQL'
   *
   * @since 5.4.0
   */
  vrm(): string {
    return `${this.faker.string.alpha({
      length: 2,
      casing: 'upper',
    })}${this.faker.string.numeric({
      length: 2,
      allowLeadingZeros: true,
    })}${this.faker.string.alpha({
      length: 3,
      casing: 'upper',
    })}`;
  }

  /**
   * Returns a type of bicycle.
   *
   * @example
   * faker.vehicle.bicycle() // 'Hybrid Bicycle'
   *
   * @since 5.5.0
   */
  bicycle(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.vehicle.bicycle_type
    );
  }
}
