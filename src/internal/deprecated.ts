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
export function deprecated(opts: DeprecatedOptions): void {
  let message = `[@faker-js/faker]: ${opts.deprecated} is deprecated`;

  if (opts.since) {
    message += ` since v${opts.since}`;
  }

  if (opts.until) {
    message += ` and will be removed in v${opts.until}`;
  }

  if (opts.proposed) {
    message += `. Please use ${opts.proposed} instead`;
  }

  // eslint-disable-next-line no-undef -- Using console here is intentional and required
  console.warn(`${message}.`);
}
