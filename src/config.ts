/**
 * The possible configuration options, that can be set.
 * This type exists to be extended for plugins via type augmentation.
 *
 * The `@default` tag is used to indicate the default value, that should be used if, the config is absent.
 */
export interface FakerConfig {
  /**
   * The function used to generate the `refDate` date instance, if not provided as method param.
   * The function must return a new valid `Date` instance for every call.
   *
   * @see [Reproducible Results](https://fakerjs.dev/guide/usage.html#reproducible-results)
   * @see faker.seed(): For generating reproducible values.
   *
   * @since 9.0.0
   *
   * @default () => new Date()
   */
  defaultRefDate?: () => Date;
}
