import { describe, expect, it } from 'vitest';
import { randomSeed } from '../../src/internal/seed';

describe('seed', () => {
  it('should generate a random seed', () => {
    const actual = randomSeed();

    expect(actual).toBeTypeOf('number');
    expect(actual).not.toBe(randomSeed());
  });
});
