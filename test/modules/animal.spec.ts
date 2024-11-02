import { describe, expect, it } from 'vitest';
import { faker } from '../../src';
import { seededTests } from '../support/seeded-runs';
import { times } from './../support/times';

const NON_SEEDED_BASED_RUN = 5;

describe('animal', () => {
  seededTests(faker, 'animal', (t) => {
    t.itEach(
      'bear',
      'bird',
      'cat',
      'cetacean',
      'cow',
      'crocodilia',
      'dog',
      'fish',
      'horse',
      'insect',
      'lion',
      'rabbit',
      'rodent',
      'snake',
      'type',
      'petName'
    );
  });

  describe.each(times(NON_SEEDED_BASED_RUN).map(() => faker.seed()))(
    'random seeded tests for seed %i',
    () => {
      describe('bear()', () => {
        it('should return random value from bear array', () => {
          const actual = faker.animal.bear();
          expect(faker.definitions.animal.bear).toContain(actual);
        });
      });

      describe('bird()', () => {
        it('should return random value from bird array', () => {
          const actual = faker.animal.bird();
          expect(faker.definitions.animal.bird).toContain(actual);
        });
      });

      describe('cat()', () => {
        it('should return random value from cat array', () => {
          const actual = faker.animal.cat();
          expect(faker.definitions.animal.cat).toContain(actual);
        });
      });

      describe('cetacean()', () => {
        it('should return random value from cetacean array', () => {
          const actual = faker.animal.cetacean();
          expect(faker.definitions.animal.cetacean).toContain(actual);
        });
      });

      describe('cow()', () => {
        it('should return random value from cow array', () => {
          const actual = faker.animal.cow();
          expect(faker.definitions.animal.cow).toContain(actual);
        });
      });

      describe('crocodilia()', () => {
        it('should return random value from crocodilia array', () => {
          const actual = faker.animal.crocodilia();
          expect(faker.definitions.animal.crocodilia).toContain(actual);
        });
      });

      describe('dog()', () => {
        it('should return random value from dog array', () => {
          const actual = faker.animal.dog();
          expect(faker.definitions.animal.dog).toContain(actual);
        });
      });

      describe('fish()', () => {
        it('should return random value from fish array', () => {
          const actual = faker.animal.fish();
          expect(faker.definitions.animal.fish).toContain(actual);
        });
      });

      describe('horse()', () => {
        it('should return random value from horse array', () => {
          const actual = faker.animal.horse();
          expect(faker.definitions.animal.horse).toContain(actual);
        });
      });

      describe('insect()', () => {
        it('should return random value from insect array', () => {
          const actual = faker.animal.insect();
          expect(faker.definitions.animal.insect).toContain(actual);
        });
      });

      describe('lion()', () => {
        it('should return random value from lion array', () => {
          const actual = faker.animal.lion();
          expect(faker.definitions.animal.lion).toContain(actual);
        });
      });

      describe('rabbit()', () => {
        it('should return random value from rabbit array', () => {
          const actual = faker.animal.rabbit();
          expect(faker.definitions.animal.rabbit).toContain(actual);
        });
      });

      describe('rodent()', () => {
        it('should return random value from rodent array', () => {
          const actual = faker.animal.rodent();
          expect(faker.definitions.animal.rodent).toContain(actual);
        });
      });

      describe('snake()', () => {
        it('should return random value from snake array', () => {
          const actual = faker.animal.snake();
          expect(faker.definitions.animal.snake).toContain(actual);
        });
      });

      describe('type()', () => {
        it('should return random value from type array', () => {
          const actual = faker.animal.type();
          expect(faker.definitions.animal.type).toContain(actual);
        });
      });

      describe('petName()', () => {
        it('should return random value from pet name array', () => {
          const actual = faker.animal.petName();
          expect(faker.definitions.animal.pet_name).toContain(actual);
        });
      });
    }
  );
});
