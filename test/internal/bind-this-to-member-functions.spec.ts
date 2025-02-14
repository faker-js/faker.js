import { describe, expect, it } from 'vitest';
import type { Faker } from '../../src';
import { faker } from '../../src';
import { bindThisToMemberFunctions } from '../../src/internal/bind-this-to-member-functions';

describe('internal', () => {
  describe('bind-this-to-member-functions', () => {
    it('should bind this to member functions', () => {
      class SomeModule {
        constructor(private readonly faker: Faker) {}

        someMethod(): number {
          return this.faker.number.int();
        }
      }

      const someModule = new SomeModule(faker);

      const someMethodWithoutBind = someModule.someMethod;

      expect(() => someMethodWithoutBind()).toThrow(
        new TypeError("Cannot read properties of undefined (reading 'faker')")
      );

      bindThisToMemberFunctions(someModule);

      const someMethod = someModule.someMethod;

      expect(() => someMethod()).not.toThrow();
    });
  });
});
