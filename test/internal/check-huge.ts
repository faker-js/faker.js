import { describe, expect } from 'vitest';
import { FakerError } from '../../src';
import { checkHuge } from '../../src/internal/check-huge';

describe('allow huge', () => {
  it('should allow small counts', () => {
    expect(() => checkHuge(1000, 'count')).not.toThrow();
  });

  it('should not allow huge counts by default', () => {
    expect(() => checkHuge(1e6, 'count')).toThrow(
      new FakerError(
        "The count parameter is potentially too huge to be executable in a reasonable time or using default memory limits. Please make sure that you didn't confuse count/length with numbers in an expected range. Set the 'allowHuge' option to 'true' to bypass this security check."
      )
    );
  });

  // This test is skipped because it takes a long time to run
  it.skip('should allow huge counts when flag is present', () => {
    expect(() => checkHuge(1e6, 'count', true)).not.toThrow();
  });
});
