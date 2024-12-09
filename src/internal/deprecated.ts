/* eslint-disable jsdoc/require-param */

/**
 * A deprecation should never be done in a patch.
 */
type DeprecationSemVer = `${number}.${number}`;

/** @internal */
export interface DeprecatedOptions {
  /**
   * The name of the function, following the syntax `faker.[module].[function]()`.
   */
  deprecated: string;
  /**
   * An alternative solution.
   */
  proposed?: string;
  /**
   * The semver since when this is deprecated.
   */
  since?: DeprecationSemVer;
  /**
   * The semver when this will be removed.
   */
  until?: DeprecationSemVer;
}

/**
 * @internal
 */
export function deprecated(options: DeprecatedOptions): void {
  const { deprecated, since, until, proposed } = options;
  let message = `[@faker-js/faker]: ${deprecated} is deprecated`;

  if (since) {
    message += ` since v${since}`;
  }

  if (until) {
    message += ` and will be removed in v${until}`;
  }

  if (proposed) {
    message += `. Please use ${proposed} instead`;
  }

  // eslint-disable-next-line no-undef -- Using console here is intentional and required
  console.warn(`${message}.`);
}
