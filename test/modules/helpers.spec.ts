import { describe, expect, it } from 'vitest';
import { FakerError, faker } from '../../src';
import { luhnCheck } from '../../src/modules/helpers/luhn-check';
import { seededTests } from '../support/seeded-runs';
import { times } from './../support/times';
import './../vitest-extensions';

const NON_SEEDED_BASED_RUN = 5;

describe('helpers', () => {
  seededTests(faker, 'helpers', (t) => {
    t.describe('slugify', (t) => {
      t.it('noArgs').it('some string', 'hello world');
    });

    t.describe('replaceSymbols', (t) => {
      t.it('noArgs')
        .it('only symbols', '#?*#?*')
        .it('some string', '^1234567890ß´°!"§$%&/()=?`+#*,..-;:_');
    });

    t.describe('replaceCreditCardSymbols', (t) => {
      t.it('noArgs')
        .it('only symbols', '####-[4-9]-##!!-L')
        .it('some string', '^1234567890ß´°!"§$%&/()=?`+#*,..-;:_L');
    });

    t.describe('fromRegExp', (t) => {
      t.it('with static string', 'Hello World!')
        .it('with static RegExp', /Hello World!/)
        .it('with dynamic string', '[A-D0-9]-[A-D0-9]-A')
        .it('with dynamic RegExp', /[A-D0-9]-[A-D0-9]-A/)
        .it('with wildcard character', /./)
        .it('with wildcard character and quantifier', /.{3}/)
        .it('with wildcard character and min max quantifier', /.{1,5}/)
        .it('with optional character', /A?-[A-D0-9]?-[a-d0-4]?/)
        .it('with optional repetition', /A*-[A-D0-9]*-[a-d0-4]*/)
        .it('with required repetition', /A+-[A-D0-9]+-[a-d0-4]+/)
        .it('with quantifier', /A{2}-[A-D0-9]{4}-[a-d0-4]{6}/)
        .it('with quantifier ranges', /A{2,6}-[A-D0-9]{4,6}-[a-d0-4]{6,8}/)
        .it('with case insensitive flag', /[A-D0-9]{10}/i)
        .it('with negation and case insensitive flag', /[^a-t0-7]{10}/i)
        .it('with negation', /[^A-Za-y0-9]{10}/);
    });

    t.describe('mustache', (t) => {
      t.it('template with string', 'Hello {{name}}!', { name: 'John' }).it(
        'template with method',
        'Hello {{name}}!',
        { name: () => 'John' }
      );
    });

    t.describe('arrayElement', (t) => {
      t.it('with array', [...'Hello World!']);
    });

    t.describe('enumValue', (t) => {
      enum Color {
        Red,
        Green,
        Blue,
      }

      enum HttpStatus {
        Ok = 200,
        BadRequest = 400,
        Unauthorized = 401,
      }

      enum Country {
        BR = 'Brazil',
        USA = 'United States of America',
      }

      enum MixedFoo {
        Foo = 0,
        Bar = 1,
        // eslint-disable-next-line @typescript-eslint/no-mixed-enums
        FooName = 'Foo',
        BarName = 'Bar',
      }

      t.it('with default enum', Color)
        .it('with enum starting from some index', HttpStatus)
        .it('with string enum', Country)
        .it('with mixed enum', MixedFoo);
    });

    t.describe('weightedArrayElement', (t) => {
      t.it('with array', [
        { weight: 5, value: 'sunny' },
        { weight: 4, value: 'rainy' },
        { weight: 1, value: 'snowy' },
      ]);

      t.it('with array with percentages', [
        { weight: 0.5, value: 'sunny' },
        { weight: 0.4, value: 'rainy' },
        { weight: 0.1, value: 'snowy' },
      ]);
    });

    t.describe('arrayElements', (t) => {
      t.it('with array', [...'Hello World!'])
        .it('with array and count', [...'Hello World!'], 3)
        .it('with array and count range', [...'Hello World!'], {
          min: 1,
          max: 5,
        });
    });

    t.describe('shuffle', (t) => {
      t.it('with array', [...'Hello World!'])
        .it('with array and inplace true', [...'Hello World!'], {
          inplace: true,
        })
        .it('with array and inplace false', [...'Hello World!'], {
          inplace: false,
        });
    });

    t.describe('uniqueArray', (t) => {
      t.it('with array', [...'Hello World!'], 3);
    });

    t.describe('maybe', (t) => {
      t.it('with only value', () => 'Hello World!').it(
        'with value and probability',
        () => 'Hello World!',
        { probability: 0.1 }
      );
    });

    t.describe('objectKey', (t) => {
      t.it('simple', { a: 1, b: 2, c: 3 });
    });

    t.describe('objectValue', (t) => {
      t.it('simple', { a: 1, b: 2, c: 3 });
    });

    t.describe('objectEntry', (t) => {
      t.it('simple', { a: 1, b: 2, c: 3 });
    });

    t.describe('fake', (t) => {
      t.it('with empty string', '')
        .it('with a static template', 'my test string')
        .it('with a dynamic template', 'my string: {{string.sample}}')
        .it('with multiple static templates', ['A', 'B', 'C'])
        .it('with multiple dynamic templates', [
          '{{string.sample}}',
          '{{location.city_name}}',
          '{{location.streetAddress}}',
        ]);
    });

    t.describe('rangeToNumber', (t) => {
      t.it('with number', 5).it('with range', { min: 1, max: 10 });
    });

    t.describe('multiple', (t) => {
      t.it('with only method', () => faker.number.int())
        .it('with method and count', () => faker.number.int(), {
          count: 5,
        })
        .it('with method and count range', () => faker.number.int(), {
          count: { min: 1, max: 10 },
        })
        .it('with method using index', (_, i) => i * 3);
    });
  });

  describe.each(times(NON_SEEDED_BASED_RUN).map(() => faker.seed()))(
    'random seeded tests for seed %i',
    () => {
      describe('arrayElement', () => {
        it('should return a random element in the array', () => {
          const testArray = ['hello', 'to', 'you', 'my', 'friend'];
          const actual = faker.helpers.arrayElement(testArray);

          expect(testArray).toContain(actual);
        });

        it('should return a random element in the array when there is only 1', () => {
          const testArray = ['hello'];
          const actual = faker.helpers.arrayElement(testArray);

          expect(actual).toBe('hello');
        });

        it('should throw on an empty array', () => {
          expect(() => faker.helpers.arrayElement([])).toThrow(
            new FakerError('Cannot get value from empty dataset.')
          );
        });

        describe('should not throw on an array with nullish elements', () => {
          it.each(['', 0, undefined, null, false])('%s', (nullishValue) => {
            expect(() =>
              faker.helpers.arrayElement([nullishValue])
            ).not.toThrow();
          });
        });
      });

      describe('enumValue', () => {
        enum ColorValueEnum {
          Red,
          Green,
          Blue,
        }
        enum ColorValueWithStartIndexEnum {
          Red = 3,
          Green,
          Blue,
        }
        enum ColorStringEnum {
          Red = 'RED',
          Green = 'GREEN',
          Blue = 'BLUE',
        }
        enum FooMixedEnum {
          Foo = 0,
          Bar = 1,
          // eslint-disable-next-line @typescript-eslint/no-mixed-enums
          StrFoo = 'FOO',
          StrBar = 'BAR',
        }

        it('should return a value from a numeric enum', () => {
          const actual = faker.helpers.enumValue(ColorValueEnum);
          expect([0, 1, 2]).toContain(actual);
        });

        it('should return a value from a numeric enum that first value is not 0', () => {
          const actual = faker.helpers.enumValue(ColorValueWithStartIndexEnum);
          expect([3, 4, 5]).toContain(actual);
        });

        it('should return a value from a string enum', () => {
          const actual = faker.helpers.enumValue(ColorStringEnum);
          expect(['RED', 'GREEN', 'BLUE']).toContain(actual);
        });

        it('should return a value from a mixed enum', () => {
          const actual = faker.helpers.enumValue(FooMixedEnum);
          expect([0, 1, 'FOO', 'BAR']).toContain(actual);
        });
      });

      describe('weightedArrayElement', () => {
        it('should return a weighted random element in the array', () => {
          const testArray = [
            { weight: 10, value: 'hello' },
            { weight: 5, value: 'to' },
            { weight: 3, value: 'you' },
            { weight: 2, value: 'my' },
            { weight: 1, value: 'friend' },
          ];
          const actual = faker.helpers.weightedArrayElement(testArray);

          expect(testArray.map((a) => a.value)).toContain(actual);
        });

        it('should return a weighted random element in the array using floats', () => {
          const testArray = [
            { weight: 0.1, value: 'hello' },
            { weight: 0.05, value: 'to' },
            { weight: 0.03, value: 'you' },
            { weight: 0.02, value: 'my' },
            { weight: 0.01, value: 'friend' },
          ];
          const actual = faker.helpers.weightedArrayElement(testArray);

          expect(testArray.map((a) => a.value)).toContain(actual);
        });

        it('should return the only element in the array when there is only 1', () => {
          const testArray = [{ weight: 10, value: 'hello' }];
          const actual = faker.helpers.weightedArrayElement(testArray);

          expect(actual).toBe('hello');
        });

        it('should throw if the array is empty', () => {
          expect(() => faker.helpers.weightedArrayElement([])).toThrow(
            new FakerError(
              'weightedArrayElement expects an array with at least one element'
            )
          );
        });

        it('should allow falsey values', () => {
          const testArray = [{ weight: 1, value: false }];
          const actual = faker.helpers.weightedArrayElement(testArray);
          expect(actual).toBe(false);
        });

        it('should throw if any weight is zero', () => {
          const testArray = [
            { weight: 0, value: 'hello' },
            { weight: 5, value: 'to' },
          ];
          expect(() => faker.helpers.weightedArrayElement(testArray)).toThrow(
            new FakerError(
              'weightedArrayElement expects an array of { weight, value } objects where weight is a positive number'
            )
          );
        });

        it('should throw if any weight is negative', () => {
          const testArray = [
            { weight: -1, value: 'hello' },
            { weight: 5, value: 'to' },
          ];
          expect(() => faker.helpers.weightedArrayElement(testArray)).toThrow(
            new FakerError(
              'weightedArrayElement expects an array of { weight, value } objects where weight is a positive number'
            )
          );
        });

        it('should not throw with a frozen array', () => {
          const testArray = [
            { weight: 7, value: 'ice' },
            { weight: 3, value: 'snow' },
          ];
          const frozenArray = Object.freeze(testArray);
          expect(() =>
            faker.helpers.weightedArrayElement(frozenArray)
          ).not.toThrow();
        });
      });

      describe('arrayElements', () => {
        it('should return a subset with random elements in the array', () => {
          const testArray = ['hello', 'to', 'you', 'my', 'friend'];
          const subset = faker.helpers.arrayElements(testArray);

          // Check length
          expect(subset.length).toBeGreaterThanOrEqual(1);
          expect(subset.length).toBeLessThanOrEqual(testArray.length);

          // Check elements
          for (const element of subset) {
            expect(testArray).toContain(element);
          }

          // Check uniqueness
          expect(subset).not.toContainDuplicates();
        });

        it('should return a subset of fixed length with random elements in the array', () => {
          const testArray = ['hello', 'to', 'you', 'my', 'friend'];
          const subset = faker.helpers.arrayElements(testArray, 3);

          // Check length
          expect(subset).toHaveLength(3);

          // Check elements
          for (const element of subset) {
            expect(testArray).toContain(element);
          }

          // Check uniqueness
          expect(subset).toHaveLength(new Set(subset).size);
        });

        it('should return a subset with random elements in the array for a length range', () => {
          const testArray = ['hello', 'to', 'you', 'my', 'friend'];
          const subset = faker.helpers.arrayElements(testArray, {
            min: 2,
            max: 4,
          });

          // Check length
          expect(subset.length).toBeGreaterThanOrEqual(2);
          expect(subset.length).toBeLessThanOrEqual(4);

          // Check elements
          for (const element of subset) {
            expect(testArray).toContain(element);
          }

          // Check uniqueness
          expect(subset).not.toContainDuplicates();
        });

        it('should return an array with all elements when count > array length', () => {
          const testArray = ['hello', 'to', 'you', 'my', 'friend'];
          const subset = faker.helpers.arrayElements(testArray, 6);

          // Check length
          expect(subset).toHaveLength(5);

          // Check elements
          for (const element of subset) {
            expect(testArray).toContain(element);
          }
        });

        it('should return an empty array when array length > 0 and count = 0', () => {
          const testArray = ['hello', 'to', 'you', 'my', 'friend'];
          const result = faker.helpers.arrayElements(testArray, 0);

          expect(result).toHaveLength(0);
        });

        it('should return an empty array when receiving an empty array', () => {
          const result = faker.helpers.arrayElements([]);

          expect(result).toHaveLength(0);
        });

        it('should return an empty array when receiving an empty array and count > 0', () => {
          const result = faker.helpers.arrayElements([], 3);

          expect(result).toHaveLength(0);
        });

        it('should return the only element in the array when there is only 1', () => {
          const testArray = ['hello'];
          const actual = faker.helpers.arrayElements(testArray);
          expect(actual).toEqual(testArray);
        });

        it('should return each element with a somewhat equal distribution with 2 elements', () => {
          const input = Array.from({ length: 2 }, (_, i) => i);
          const occurrences = Array.from({ length: 2 }, () => 0);

          for (let i = 0; i < 1000; i++) {
            const [result] = faker.helpers.arrayElements(input, 1);
            occurrences[result]++;
          }

          for (const occurrence of occurrences) {
            expect(occurrence).toBeGreaterThanOrEqual(400);
            expect(occurrence).toBeLessThanOrEqual(600);
          }
        });

        it.each([10, 100, 1000])(
          'should return each element with a somewhat equal distribution with %s elements',
          (length) => {
            const input = Array.from({ length }, (_, i) => i % 10);
            const occurrences = Array.from({ length: 10 }, () => 0);

            for (let i = 0; i < 1000; i++) {
              const [result] = faker.helpers.arrayElements(input, 1);
              occurrences[result]++;
            }

            for (const occurrence of occurrences) {
              expect(occurrence).toBeGreaterThanOrEqual(50);
              expect(occurrence).toBeLessThanOrEqual(150);
            }
          }
        );

        describe('should not throw on an array with nullish elements', () => {
          it.each(['', 0, undefined, null, false])('%s', (nullishValue) => {
            expect(() =>
              faker.helpers.arrayElements(
                [nullishValue, nullishValue, nullishValue],
                2
              )
            ).not.toThrow();
          });
        });
      });

      describe('slugify()', () => {
        it('removes non-word characters from strings except . and -', () => {
          expect(faker.helpers.slugify('foo bar')).toBe('foo-bar');
          expect(faker.helpers.slugify('Faker is cool')).toBe('Faker-is-cool');
          expect(faker.helpers.slugify('super*star')).toBe('superstar');
          expect(faker.helpers.slugify("d'angelo.net")).toBe('dangelo.net');
          expect(faker.helpers.slugify('hello你好')).toBe('hello');
        });

        it('strips simple diacritics from strings', () => {
          expect(faker.helpers.slugify('Aiden.Harªann')).toBe('Aiden.Haraann');
          expect(faker.helpers.slugify('Adèle.Argüello')).toBe(
            'Adele.Arguello'
          );
        });
      });

      describe('replaceSymbols()', () => {
        it('returns empty string with no arguments', () => {
          expect(faker.helpers.replaceSymbols()).toBe('');
        });

        describe("when '*' passed", () => {
          it('replaces it with alphanumeric', () => {
            const num = faker.helpers.replaceSymbols('*AB');
            expect(num).toMatch(/\wAB/);
          });
        });
      });

      describe('replaceCreditCardSymbols()', () => {
        it('returns a credit card number given a schema', () => {
          const number = faker.helpers.replaceCreditCardSymbols(
            '6453-####-####-####-###L'
          );
          expect(number).toMatch(
            /^6453-([0-9]){4}-([0-9]){4}-([0-9]){4}-([0-9]){4}$/
          );
          expect(number).toSatisfy(luhnCheck);
        });

        it('supports different symbols', () => {
          const number = faker.helpers.replaceCreditCardSymbols(
            '6453-****-****-****-***L',
            '*'
          );
          expect(number).toMatch(
            /^6453-([0-9]){4}-([0-9]){4}-([0-9]){4}-([0-9]){4}$/
          );
          expect(number).toSatisfy(luhnCheck);
        });

        it('handles regexp style input', () => {
          let number = faker.helpers.replaceCreditCardSymbols(
            '6453-*{4}-*{4}-*{4}-*{3}L',
            '*'
          );
          expect(number).toMatch(
            /^6453-([0-9]){4}-([0-9]){4}-([0-9]){4}-([0-9]){4}$/
          );
          expect(number).toSatisfy(luhnCheck);
          number = faker.helpers.replaceCreditCardSymbols(
            '645[5-9]-#{4,6}-#{1,2}-#{4,6}-#{3}L'
          );
          expect(number).toMatch(
            /^645[5-9]-([0-9]){4,6}-([0-9]){1,2}-([0-9]){4,6}-([0-9]){4}$/
          );
          expect(number).toSatisfy(luhnCheck);
        });
      });

      describe('fromRegExp()', () => {
        describe('single character patterns', () => {
          it('handles case sensitive characters', () => {
            const actual = faker.helpers.fromRegExp(/w/);
            expect(actual).toHaveLength(1);
            expect(actual).not.toContain('W');
            expect(actual).toBe('w');
            expect(actual).toMatch(/^w$/);
          });

          it.skip('handles case insensitive characters', () => {
            const set = new Set<string>();
            for (let i = 0; i < 100; i++) {
              const actual = faker.helpers.fromRegExp(/w/i);
              expect(actual).toHaveLength(1);
              expect(actual).toMatch(/^W$/i);
              set.add(actual);
            }

            expect(set.size).toBe(2);
          });

          it('handles case insensitive symbols', () => {
            const actual = faker.helpers.fromRegExp(/%/i);
            expect(actual).toHaveLength(1);
            expect(actual).toBe('%');
            expect(actual).toMatch(/^%$/i);
          });

          it.skip('handles the wildcard character', () => {
            const set = new Set<string>();
            for (let i = 0; i < 100; i++) {
              const actual = faker.helpers.fromRegExp(/./);
              expect(actual).toHaveLength(1);
              expect(actual).toMatch(/^.$/);
              set.add(actual);
            }

            expect(set.size).toBeGreaterThan(5);
          });
        });

        describe('fixed length patterns', () => {
          it('handles case sensitive characters', () => {
            const actual = faker.helpers.fromRegExp(/w{100}/);
            expect(actual).toHaveLength(100);
            expect(actual).not.toContain('W');
            expect(actual).toContain('w');
            expect(actual).toBe('w'.repeat(100));
            expect(actual).toMatch(/^w{100}$/);
          });

          it('handles case insensitive characters', () => {
            const actual = faker.helpers.fromRegExp(/w{100}/i);
            expect(actual).toHaveLength(100);
            expect(actual).toContain('W');
            expect(actual).toContain('w');
            expect(actual).toMatch(/^W{100}$/i);
          });

          it('handles case insensitive symbols', () => {
            const actual = faker.helpers.fromRegExp(/%{100}/i);
            expect(actual).toHaveLength(100);
            expect(actual).toBe('%'.repeat(100));
            expect(actual).toMatch(/^%{100}$/);
          });

          it('handles the wildcard character', () => {
            const actual = faker.helpers.fromRegExp(/.{100}/);
            expect(actual).toHaveLength(100);
            expect(actual).toMatch(/^.{100}$/);
            const set = new Set(actual);
            expect(set.size).toBeGreaterThan(5);
          });
        });

        describe('length range patterns', () => {
          it('handles case sensitive characters', () => {
            const actual = faker.helpers.fromRegExp(/w{5,10}/);
            expect(actual.length).toBeGreaterThanOrEqual(5);
            expect(actual.length).toBeLessThanOrEqual(10);
            expect(actual).not.toContain('W');
            expect(actual).toContain('w');
            expect(actual).toMatch(/^w{5,10}$/);
          });

          it('handles case insensitive characters', () => {
            const actual = faker.helpers.fromRegExp(/w{50,100}/i);
            expect(actual.length).toBeGreaterThanOrEqual(50);
            expect(actual.length).toBeLessThanOrEqual(100);
            expect(actual).toContain('W');
            expect(actual).toContain('w');
            expect(actual).toMatch(/^W{50,100}$/i);
          });

          it('handles case insensitive symbols', () => {
            const actual = faker.helpers.fromRegExp(/%{50,100}/i);
            expect(actual.length).toBeGreaterThanOrEqual(50);
            expect(actual.length).toBeLessThanOrEqual(100);
            expect(actual).toMatch(/^%{50,100}$/);
          });

          it('handles the wildcard character', () => {
            const actual = faker.helpers.fromRegExp(/.{50,100}/);
            expect(actual.length).toBeGreaterThanOrEqual(50);
            expect(actual.length).toBeLessThanOrEqual(100);
            expect(actual).toMatch(/^.{50,100}$/);
            const set = new Set(actual);
            expect(set.size).toBeGreaterThan(5);
          });
        });

        it('creates a numerical range', () => {
          const actual = faker.helpers.fromRegExp('Hello[0-9]');
          expect(actual).toMatch(/^Hello[0-9]$/);
        });

        it('deals with multiple tokens in one string', () => {
          const actual = faker.helpers.fromRegExp(
            'Test#{5}%{2,5}Testing*[1-5]{10}END'
          );
          expect(actual).toMatch(/^Test#{5}%{2,5}Testing*[1-5]{10}END$/);
        });

        it('throws error when min > max outside set', () => {
          expect(() => faker.helpers.fromRegExp('#{10,5}')).toThrow();
        });

        it('throws error when min > max in set', () => {
          expect(() => faker.helpers.fromRegExp('[a-z0-9]{10,5}')).toThrow();
        });

        it('deals with RegExp object', () => {
          const actual = faker.helpers.fromRegExp(/[A-D0-9]{4}-[A-D0-9]{4}/);
          expect(actual).toMatch(/^[A-D0-9]{4}-[A-D0-9]{4}$/);
        });

        it('doesnt include negated characters', () => {
          const actual = faker.helpers.fromRegExp(/[^a-t0-9]{4}/i);
          expect(actual).toHaveLength(4);
          expect(actual).toMatch(/[^a-t0-9]{4}/);
        });

        it('handles case insensitive flags', () => {
          const actual = faker.helpers.fromRegExp(/[A-D0-9]{4}-[A-D0-9]{4}/i);
          expect(actual).toHaveLength(9);
          expect(actual).toMatch(/^[A-D0-9]{4}-[A-D0-9]{4}$/i);
        });
      });

      describe('shuffle()', () => {
        it('the output is the same length as the input', () => {
          const shuffled = faker.helpers.shuffle(['a', 'b']);

          expect(shuffled).toHaveLength(2);
        });

        it('empty array returns empty array', () => {
          const shuffled = faker.helpers.shuffle([]);
          expect(shuffled).toHaveLength(0);
        });

        it('mutates the input array in place', () => {
          const input = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
          const shuffled = faker.helpers.shuffle(input, { inplace: true });
          expect(shuffled).toStrictEqual(input);
        });

        it('does not mutate the input array by default', () => {
          const input = Object.freeze([
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
          ]);
          expect(() => faker.helpers.shuffle(input)).not.toThrow();
        });

        it('does not mutate the input array when inplace is false', () => {
          const input = Object.freeze([
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
          ]);
          expect(() =>
            faker.helpers.shuffle(input, { inplace: false })
          ).not.toThrow();
        });

        it('throws an error when the input array is readonly and inplace is true', () => {
          const input = Object.freeze([
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
          ]);
          expect(() =>
            // @ts-expect-error: we want to test that it throws
            faker.helpers.shuffle(input, { inplace: true })
          ).toThrow();
        });
      });

      describe('uniqueArray()', () => {
        it('custom array returns unique array', () => {
          const input = ['a', 'a', 'a', 'a,', 'a', 'a', 'a', 'a', 'b'];
          const length = 2;
          const unique = faker.helpers.uniqueArray(input, length);
          expect(unique).not.toContainDuplicates();
          expect(unique).toHaveLength(length);
        });

        it('definition array returns unique array', () => {
          const length = faker.number.int({ min: 1, max: 6 });
          const unique = faker.helpers.uniqueArray(
            faker.definitions.hacker.noun,
            length
          );
          expect(unique).not.toContainDuplicates();
          expect(unique).toHaveLength(length);
        });

        it('function returns unique array', () => {
          const length = faker.number.int({ min: 1, max: 6 });
          const unique = faker.helpers.uniqueArray(faker.lorem.word, length);
          expect(unique).not.toContainDuplicates();
          expect(unique).toHaveLength(length);
        });

        it('empty array returns empty array', () => {
          const length = faker.number.int({ min: 1, max: 6 });
          const unique = faker.helpers.uniqueArray([], length);
          expect(unique).toHaveLength(0);
        });

        it('length longer than source returns max length', () => {
          const input = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
          const length = input.length + 1;
          const unique = faker.helpers.uniqueArray(input, length);
          expect(unique).not.toContainDuplicates();
          expect(unique).toHaveLength(input.length);
        });

        it('function with length longer than possible values returns', () => {
          const fn = () => faker.helpers.arrayElement(['a', 'b']);
          const length = 3;
          const unique = faker.helpers.uniqueArray(fn, length);
          expect(unique).not.toContainDuplicates();
          expect(unique).toHaveLength(2);
        });
      });

      describe('mustache()', () => {
        it('returns empty string with no template input', () => {
          expect(faker.helpers.mustache(undefined, {})).toBe('');
        });

        it('returns empty string with empty template input', () => {
          expect(faker.helpers.mustache('', {})).toBe('');
        });

        it('supports string replace values', () => {
          const actual = faker.helpers.mustache('1{{value}}3', { value: '2' });

          expect(actual).toBe('123');
        });

        it('supports function replace values faker values', () => {
          const actual = faker.helpers.mustache('1{{value}}3', {
            value: faker.string.alphanumeric({ length: 2 }),
          });

          expect(actual).toHaveLength(4);
        });

        it.each([
          ['$&', 4],
          ["$'", 4],
        ])('supports replace value %s', (value, expectedLength) => {
          const actual = faker.helpers.mustache('1{{value}}3', {
            value,
          });

          expect(actual).toBe(`1${value}3`);
          expect(actual).toHaveLength(expectedLength);
        });

        it('supports function replace values faker function', () => {
          const actual = faker.helpers.mustache('1{{value}}3', {
            value: () => faker.string.sample(3),
          });

          expect(actual).toHaveLength(5);
        });

        it('supports function replace values no args', () => {
          const actual = faker.helpers.mustache('1{{value}}3', {
            value: () => '7',
          });

          expect(actual).toBe('173');
        });

        it('supports function replace values with args', () => {
          const actual = faker.helpers.mustache('1{{value}}3', {
            value: (key) => String(key.length),
          });

          expect(actual).toBe('193');
        });
      });

      describe('maybe', () => {
        it('should always return the callback result when probability is 1', () => {
          const actual = faker.helpers.maybe(() => 'foo', { probability: 1 });

          expect(actual).toBe('foo');
        });

        it('should never return the callback result when probability is 0', () => {
          const method: () => unknown = expect.fail;
          const actual = faker.helpers.maybe(method, {
            probability: 0,
          });

          expect(actual).toBeUndefined();
        });

        it('should not mutate the input object', () => {
          const input = Object.freeze({
            probability: 0.4,
          });

          expect(() => faker.helpers.maybe(() => 'foo', input)).not.toThrow();
        });
      });

      describe('objectKey', () => {
        it('should return a random key', () => {
          const testObject = {
            hello: 'to',
            you: 'my',
            friend: '!',
          };
          const actual = faker.helpers.objectKey(testObject);

          expect(Object.keys(testObject)).toContain(actual);
        });

        it('should throw if given object is empty', () => {
          expect(() => faker.helpers.objectKey({})).toThrow(
            new FakerError('Cannot get value from empty dataset.')
          );
        });
      });

      describe('objectValue', () => {
        it('should return a random value', () => {
          const testObject = {
            hello: 'to',
            you: 'my',
            friend: '!',
          };
          const actual = faker.helpers.objectValue(testObject);

          expect(Object.values(testObject)).toContain(actual);
        });

        it('should throw if given object is empty', () => {
          expect(() => faker.helpers.objectValue({})).toThrow(
            new FakerError('Cannot get value from empty dataset.')
          );
        });
      });

      describe('objectEntry', () => {
        it('should return a random key, value pair', () => {
          const testObject = {
            hello: 'to',
            you: 'my',
            friend: '!',
          };
          const [key, value] = faker.helpers.objectEntry(testObject);

          expect(Object.keys(testObject)).toContain(key);
          expect(Object.values(testObject)).toContain(value);
          expect(testObject[key]).toEqual(value);
        });

        it('should throw if given object is empty', () => {
          expect(() => faker.helpers.objectEntry({})).toThrow(
            new FakerError('Cannot get value from empty dataset.')
          );
        });
      });

      describe('fake()', () => {
        it('does allow empty string input', () => {
          const actual = faker.helpers.fake('');
          expect(actual).toBe('');
        });

        it('replaces a token with a random value for a method without parentheses', () => {
          const actual = faker.helpers.fake('{{string.numeric}}');
          expect(actual).toMatch(/^\d$/);
        });

        it('replaces multiple tokens with random values for methods without parentheses', () => {
          const actual = faker.helpers.fake(
            '{{string.numeric}}{{string.numeric}}{{string.numeric}}'
          );
          expect(actual).toMatch(/^\d{3}$/);
        });

        it('replaces a token with a random value for a method with empty parentheses', () => {
          const actual = faker.helpers.fake('{{string.numeric()}}');
          expect(actual).toMatch(/^\d$/);
        });

        it('replaces a token with a random value for a method with an unquoted parameter', () => {
          const random = faker.helpers.fake('{{helpers.slugify(This Works)}}');
          expect(random).toBe('This-Works');
        });

        it('replaces a token with a random value for a method with a simple parameter', () => {
          const actual = faker.helpers.fake('{{string.numeric(3)}}');
          expect(actual).toMatch(/^\d{3}$/);
        });

        it('replaces a token with a random value for a method with an array parameter', () => {
          const arr = ['one', 'two', 'three'];
          const actual = faker.helpers.fake(
            '{{helpers.arrayElement(["one", "two", "three"])}}'
          );
          expect(arr).toContain(actual);
        });

        it('replaces a token with a random value for a method with an object parameter', () => {
          const actual = faker.helpers.fake('{{string.alpha({"length": 3})}}');
          expect(actual).toMatch(/^[a-z]{3}$/i);
        });

        it('replaces a token with a random value for a method with multiple parameters', () => {
          const actual = faker.helpers.fake(
            '{{string.numeric(5, {"allowLeadingZeros": true})}}'
          );
          expect(actual).toMatch(/^\d{5}$/);
        });

        it('should throw with empty array parameters', () => {
          expect(() => faker.helpers.fake([])).toThrow(
            new FakerError('Cannot get value from empty dataset.')
          );
        });

        it('does not allow invalid module name', () => {
          expect(() => faker.helpers.fake('{{foo.bar}}')).toThrow(
            new FakerError(`Cannot resolve expression 'foo.bar'`)
          );
        });

        it('does allow missing method name', () => {
          const actual = faker.helpers.fake('{{location}}');
          expect(actual).toBe('[object Object]');
        });

        it('does not allow invalid method name', () => {
          expect(() => faker.helpers.fake('{{location.foo}}')).toThrow(
            new FakerError(`Cannot resolve expression 'location.foo'`)
          );
        });

        it('should support complex data', () => {
          const actual = faker.helpers.fake('{{science.unit}}');
          expect(actual).toBe('[object Object]');
        });

        it('should support resolving a value in a complex object', () => {
          const complex = faker.helpers.fake('{{airline.airline}}');
          expect(complex).toBe('[object Object]');

          const actual = faker.helpers.fake('{{airline.airline.iataCode}}');
          expect(actual).toBeTypeOf('string');
          expect(
            faker.definitions.airline.airline.map(({ iataCode }) => iataCode)
          ).toContain(actual);
        });

        it('should be able to return empty strings', () => {
          expect(faker.helpers.fake('{{string.alphanumeric(0)}}')).toBe('');
        });

        it('should be able to return locale definition strings', () => {
          expect(faker.definitions.cell_phone?.formats).toContain(
            faker.helpers.fake('{{cell_phone.formats}}')
          );
        });

        it('should be able to return locale definition strings that starts with the name of an existing module', () => {
          expect(faker.definitions.location.city_name).toContain(
            faker.helpers.fake('{{location.city_name}}')
          );
        });

        it('should be able to pass multiple static templates', () => {
          expect(['A', 'B', 'C']).toContain(
            faker.helpers.fake(['A', 'B', 'C'])
          );
        });

        it('should be able to pass multiple dynamic templates', () => {
          expect(faker.definitions.company.buzz_noun).toContain(
            faker.helpers.fake([
              '{{company.buzz_noun}}',
              '{{company.buzzNoun}}',
            ])
          );
        });

        it('should be able to handle only {{ brackets', () => {
          expect(faker.helpers.fake('{{hello')).toBe('{{hello');
          expect(faker.helpers.fake('hello{{')).toBe('hello{{');
        });

        it('should be able to handle only }} brackets', () => {
          expect(faker.helpers.fake('hello}}')).toBe('hello}}');
          expect(faker.helpers.fake('}}hello')).toBe('}}hello');
        });

        it('should be able to handle inverted brackets', () => {
          expect(faker.helpers.fake('}}hello{{')).toBe('}}hello{{');
        });

        it('should be able to handle random }} brackets', () => {
          expect(faker.helpers.fake('}}hello{{string.alpha}}')).toMatch(
            /^}}hello[a-zA-Z]$/
          );
        });

        it('should be able to handle connected brackets', () => {
          expect(faker.helpers.fake('{{{string.alpha}}}')).toMatch(
            /^{[a-zA-Z]}$/
          );
        });

        it('should be able to handle empty brackets', () => {
          expect(faker.helpers.fake('{{}}')).toBe('{{}}');
        });

        it('should be able to handle special replacement patterns', () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (faker.string as any).special = () => '$&';

          expect(faker.helpers.fake('{{string.special}}')).toBe('$&');

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (faker.string as any).special;
        });

        it('should support deprecated module aliases', () => {
          expect(faker.definitions.location.state).toContain(
            faker.helpers.fake('{{address.state}}')
          );
          expect([
            ...(faker.definitions.person.first_name.female ?? []),
            ...(faker.definitions.person.first_name.generic ?? []),
            ...(faker.definitions.person.first_name.male ?? []),
          ]).toContain(faker.helpers.fake('{{name.firstName}}'));
        });

        it('should not trim whitespace', () => {
          expect(faker.helpers.fake('   ---   ')).toBe('   ---   ');
        });
      });

      describe('rangeToNumber()', () => {
        it('should return a number', () => {
          expect(faker.helpers.rangeToNumber(1)).toBe(1);
        });

        it('should return a number in a range', () => {
          const actual = faker.helpers.rangeToNumber({ min: 1, max: 10 });
          expect(actual).toBeGreaterThanOrEqual(1);
          expect(actual).toBeLessThanOrEqual(10);
        });
      });

      describe('multiple()', () => {
        it('should generate values from the function with a default length of 3', () => {
          const result = faker.helpers.multiple(() => faker.person.firstName());
          expect(result).toBeTypeOf('object');
          expect(Array.isArray(result)).toBe(true);
          expect(result).toHaveLength(3);
        });

        it('should generate the given amount of values from the function', () => {
          const result = faker.helpers.multiple(
            () => faker.person.firstName(),
            {
              count: 5,
            }
          );
          expect(result).toBeTypeOf('object');
          expect(Array.isArray(result)).toBe(true);
          expect(result).toHaveLength(5);
        });

        it('should generate a ranged number of values from the function', () => {
          const result = faker.helpers.multiple(
            () => faker.person.firstName(),
            {
              count: { min: 1, max: 10 },
            }
          );
          expect(result).toBeTypeOf('object');
          expect(Array.isArray(result)).toBe(true);
          expect(result.length).toBeGreaterThanOrEqual(1);
          expect(result.length).toBeLessThanOrEqual(10);
        });

        it('should generate values using index of created value', () => {
          const result = faker.helpers.multiple((_, i) => i * 2, {
            count: 3,
          });
          expect(result).toBeTypeOf('object');
          expect(Array.isArray(result)).toBe(true);
          expect(result).toHaveLength(3);
          expect(result).toStrictEqual([0, 2, 4]);
        });
      });
    }
  );

  describe('uniqueArray', () => {
    it('works as expected when seeded', () => {
      const input = ['a', 'a', 'a', 'a', 'a', 'f', 'g', 'h', 'i', 'j'];
      faker.seed(100);
      const unique = faker.helpers.uniqueArray(input, 5);
      expect(unique).toStrictEqual(['j', 'a', 'g', 'i', 'f']);
    });
  });
});
