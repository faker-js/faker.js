import { describe, expect, it } from 'vitest';
import { faker } from '../dist/faker';

describe('animal', () => {
  describe('dog()', () => {
    it('returns random value from dog array', () => {
      const dog = faker.animal.dog();
      expect(faker.definitions.animal.dog).toContain(dog);
    });
  });
});
