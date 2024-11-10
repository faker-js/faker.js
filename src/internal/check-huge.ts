import { FakerError } from '../errors/faker-error';

/**
 * Check if the count is potentially too huge to be executable in a reasonable time or using default memory limits.
 *
 * @internal
 *
 * @param count The count to check.
 * @param name The name of the parameter.
 * @param allowHuge Whether to allow huge counts.
 */
export function checkHuge(
  count: number | { max: number },
  name: string,
  allowHuge: boolean = false
): void {
  const maxCount = typeof count === 'number' ? count : count.max;
  if (!allowHuge && maxCount >= 1e6) {
    throw new FakerError(
      `The ${name} parameter is potentially too huge to be executable in a reasonable time or using default memory limits. Please make sure that you didn't confuse count/length with numbers in an expected range. Set the 'allowHuge' option to 'true' to bypass this security check.`
    );
  }
}
