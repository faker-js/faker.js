import { afterEach, describe, expect, it, vi } from 'vitest';
import { FakerError, allLocales, faker, fakerAZ } from '../../src';
import { seededTests } from '../support/seeded-runs';
import { times } from './../support/times';

const converterMap = [
  (d: Date) => d,
  (d: Date) => d.toISOString(),
  (d: Date) => d.valueOf(),
];

const NON_SEEDED_BASED_RUN = 5;
const refDate = '2021-02-21T17:09:15.711Z';

function calculateAge(birthdate: Date, refDate: Date): number {
  let age = refDate.getFullYear() - birthdate.getFullYear();
  if (
    refDate.getMonth() < birthdate.getMonth() ||
    (refDate.getMonth() === birthdate.getMonth() &&
      refDate.getDate() < birthdate.getDate())
  ) {
    age--;
  }

  return age;
}

describe('date', () => {
  seededTests(faker, 'date', (t) => {
    t.describe('anytime', (t) => {
      t.it('with only string refDate', { refDate })
        .it('with only Date refDate', { refDate: new Date(refDate) })
        .it('with only number refDate', {
          refDate: new Date(refDate).getTime(),
        });
    });

    t.describeEach(
      'past',
      'future'
    )((t) => {
      t.it('with only string refDate', { refDate })
        .it('with only Date refDate', { refDate: new Date(refDate) })
        .it('with only number refDate', {
          refDate: new Date(refDate).getTime(),
        })
        .it('with value', { years: 10, refDate });
    });

    t.describeEach(
      'recent',
      'soon'
    )((t) => {
      t.it('with only string refDate', { refDate })
        .it('with only Date refDate', { refDate: new Date(refDate) })
        .it('with only number refDate', {
          refDate: new Date(refDate).getTime(),
        })
        .it('with value', { days: 10, refDate });
    });

    t.describeEach(
      'weekday',
      'month'
    )((t) => {
      t.it('noArgs')
        .it('with abbreviated = true', { abbreviated: true })
        .it('with context = true', { context: true })
        .it('with abbreviated = true and context = true', {
          abbreviated: true,
          context: true,
        });
    });

    t.it('timeZone');

    t.describe('between', (t) => {
      t.it('with string dates', {
        from: '2021-02-21T17:09:15.711Z',
        to: '2021-04-21T17:11:17.711Z',
      })
        .it('with Date dates', {
          from: new Date('2021-02-21T17:09:15.711Z'),
          to: new Date('2021-04-21T17:11:17.711Z'),
        })
        .it('with mixed dates', {
          from: '2021-02-21T17:09:15.711Z',
          to: new Date('2021-04-21T17:11:17.711Z'),
        });
    });

    t.describe('betweens', (t) => {
      t.it('with string dates', {
        from: '2021-02-21T17:09:15.711Z',
        to: '2021-04-21T17:11:17.711Z',
      })
        .it('with Date dates', {
          from: new Date('2021-02-21T17:09:15.711Z'),
          to: new Date('2021-04-21T17:11:17.711Z'),
        })
        .it('with mixed dates', {
          from: '2021-02-21T17:09:15.711Z',
          to: new Date('2021-04-21T17:11:17.711Z'),
        })
        .it('with string dates and count', {
          from: '2021-02-21T17:09:15.711Z',
          to: '2021-04-21T17:11:17.711Z',
          count: 5,
        })
        .it('with Date dates and count', {
          from: new Date('2021-02-21T17:09:15.711Z'),
          to: new Date('2021-04-21T17:11:17.711Z'),
          count: 5,
        })
        .it('with Date dates and count range', {
          from: new Date('2021-02-21T17:09:15.711Z'),
          to: new Date('2021-04-21T17:11:17.711Z'),
          count: { min: 3, max: 5 },
        });
    });

    t.describe('birthdate', (t) => {
      t.it('with only refDate', { refDate })
        .it('with age and refDate', {
          mode: 'age',
          min: 40,
          max: 40,
          refDate,
        })
        .it('with age range and refDate', {
          mode: 'age',
          min: 20,
          max: 80,
          refDate,
        })
        .it('with year', {
          mode: 'year',
          min: 2000,
          max: 2000,
        })
        .it('with year range', {
          mode: 'year',
          min: 1900,
          max: 2000,
        });
    });
  });

  describe.each(times(NON_SEEDED_BASED_RUN).map(() => faker.seed()))(
    'random seeded tests for seed %i',
    () => {
      describe('toDate()', () => {
        describe.each([
          'anytime',
          'past',
          'future',
          'recent',
          'soon',
          'birthdate',
        ] as const)('%s', (method) => {
          it.each(['invalid', Number.NaN, new Date(Number.NaN)] as const)(
            'should reject invalid refDates %s',
            (refDate) => {
              expect(() => faker.date[method]({ refDate })).toThrow(
                new FakerError(`Invalid refDate date: ${refDate.toString()}`)
              );
            }
          );
        });
      });

      describe('anytime()', () => {
        it('should return a date', () => {
          const actual = faker.date.anytime();

          expect(actual).toBeDefined();
          expect(actual).toBeInstanceOf(Date);
        });
      });

      describe('past()', () => {
        it('should return a date 5 years in the past', () => {
          const today = new Date();
          const yearsAgo = new Date(today);
          yearsAgo.setFullYear(yearsAgo.getFullYear() - 5);

          const date = faker.date.past({ years: 5 });

          expect(date).lessThan(today);
          expect(date).greaterThanOrEqual(yearsAgo);
        });

        it('should throw an error when years = 0', () => {
          const refDate = new Date();
          expect(() =>
            faker.date.past({ years: 0, refDate: refDate.toISOString() })
          ).toThrow(new FakerError('Years must be greater than 0.'));
        });

        it.each(converterMap)(
          'should return a past date relative to given refDate',
          (converter) => {
            const refDate = new Date();
            refDate.setFullYear(refDate.getFullYear() + 5);

            const date = faker.date.past({
              years: 5,
              refDate: converter(refDate),
            });

            expect(date).lessThan(refDate);
            expect(date).greaterThan(new Date());
          }
        );
      });

      describe('future()', () => {
        it('should return a date 75 years into the future', () => {
          const date = faker.date.future({ years: 75 });

          expect(date).greaterThan(new Date());
        });

        it('should throw an error when years = 0', () => {
          const refDate = new Date();
          expect(() =>
            faker.date.future({ years: 0, refDate: refDate.toISOString() })
          ).toThrow(new FakerError('Years must be greater than 0.'));
        });

        it.each(converterMap)(
          'should return a date 75 years after the date given',
          (converter) => {
            const refDate = new Date(1880, 11, 9, 10, 0, 0, 0); // set the date beyond the usual calculation (to make sure this is working correctly)

            const date = faker.date.future({
              years: 75,
              refDate: converter(refDate),
            });

            // date should be after the date given, but before the current time
            expect(date).greaterThan(refDate);
            expect(date).lessThan(new Date());
          }
        );
      });

      describe('between()', () => {
        it.each(converterMap)(
          'should return a random date between the dates given',
          (converter) => {
            const from = new Date(1990, 5, 7, 9, 11, 0, 0);
            const to = new Date(2000, 6, 8, 10, 12, 0, 0);

            const date = faker.date.between({
              from: converter(from),
              to: converter(to),
            });

            expect(date).greaterThan(from);
            expect(date).lessThan(to);
          }
        );

        it('should throw an error when from is after to', () => {
          expect(() =>
            faker.date.between({
              from: '2000-01-01',
              to: '1990-01-01',
            })
          ).toThrow(new FakerError('`from` date must be before `to` date.'));
        });

        it('should allow date 0 (start of UNIX epoch)', () => {
          const date = faker.date.between({
            from: 0,
            to: '1970-12-31',
          });
          expect(date).greaterThan(new Date(0));
        });

        it('should throw an error if to is invalid', () => {
          expect(() =>
            faker.date.between({
              from: '1990-01-01',
              to: 'not-a-date',
            })
          ).toThrow(new FakerError('Invalid to date: not-a-date'));
        });
      });

      describe('betweens()', () => {
        it.each(converterMap)(
          'should return an array of 3 ( by default ) sorted random dates between the dates given',
          (converter) => {
            const from = new Date(1990, 5, 7, 9, 11, 0, 0);
            const to = new Date(2000, 6, 8, 10, 12, 0, 0);

            const dates = faker.date.betweens({
              from: converter(from),
              to: converter(to),
            });

            expect(dates).toHaveLength(3);

            expect(dates[0]).greaterThan(from);
            expect(dates[0]).lessThan(dates[1]);
            expect(dates[1]).lessThan(dates[2]);
            expect(dates[2]).lessThan(to);
          }
        );

        it.each(converterMap)(
          'should return an array of 2 sorted random dates between the dates given',
          (converter) => {
            const from = new Date(1990, 5, 7, 9, 11, 0, 0);
            const to = new Date(2000, 6, 8, 10, 12, 0, 0);

            const dates = faker.date.betweens({
              from: converter(from),
              to: converter(to),
              count: 2,
            });

            expect(dates).toHaveLength(2);

            expect(dates[0]).greaterThan(from);
            expect(dates[0]).lessThan(dates[1]);
            expect(dates[1]).lessThan(to);
          }
        );

        it.each(converterMap)(
          'should return an array of 3-5 sorted random dates between the dates given',
          (converter) => {
            const from = new Date(1990, 5, 7, 9, 11, 0, 0);
            const to = new Date(2000, 6, 8, 10, 12, 0, 0);

            const dates = faker.date.betweens({
              from: converter(from),
              to: converter(to),
              count: {
                min: 3,
                max: 5,
              },
            });

            expect(dates.length).greaterThanOrEqual(3);
            expect(dates.length).lessThanOrEqual(5);

            expect(dates[0]).greaterThan(from);
            for (let i = 1; i < dates.length; i++) {
              expect(dates[i]).greaterThan(dates[i - 1]);
            }

            expect(dates.at(-1)).lessThan(to);
          }
        );

        it('should throw an error when from is after to', () => {
          expect(() =>
            faker.date.betweens({
              from: '2000-01-01',
              to: '1990-01-01',
              count: 3,
            })
          ).toThrow(new FakerError('`from` date must be before `to` date.'));
        });

        it('should throw an error if to is invalid', () => {
          expect(() =>
            faker.date.betweens({
              from: '1990-01-01',
              to: 'not-a-date',
              count: 3,
            })
          ).toThrow(new FakerError('Invalid to date: not-a-date'));
        });
      });

      describe('recent()', () => {
        it('should return a date N days from the recent past', () => {
          const date = faker.date.recent({ days: 30 });

          expect(date).lessThanOrEqual(new Date());
        });

        it('should throw an error when days = 0', () => {
          const refDate = new Date();
          expect(() =>
            faker.date.recent({ days: 0, refDate: refDate.toISOString() })
          ).toThrow(new FakerError('Days must be greater than 0.'));
        });

        it.each(converterMap)(
          'should return a date N days from the recent past, starting from refDate',
          (converter) => {
            const days = 30;
            const refDate = new Date(2120, 11, 9, 10, 0, 0, 0); // set the date beyond the usual calculation (to make sure this is working correctly)

            const lowerBound = new Date(
              refDate.getTime() - days * 24 * 60 * 60 * 1000
            );

            const date = faker.date.recent({
              days,
              refDate: converter(refDate),
            });

            expect(
              lowerBound,
              '`recent()` date should not be further back than `n` days ago'
            ).lessThanOrEqual(date);
            expect(
              date,
              '`recent()` date should not be ahead of the starting date reference'
            ).lessThanOrEqual(refDate);
          }
        );
      });

      describe('soon()', () => {
        it('should return a date N days into the future', () => {
          const date = faker.date.soon({ days: 30 });

          expect(date).greaterThanOrEqual(new Date());
        });

        it('should throw an error when days = 0', () => {
          const refDate = new Date();
          expect(() =>
            faker.date.soon({ days: 0, refDate: refDate.toISOString() })
          ).toThrow(new FakerError('Days must be greater than 0.'));
        });

        it.each(converterMap)(
          'should return a date N days from the recent future, starting from refDate',
          (converter) => {
            const days = 30;
            const refDate = new Date(1880, 11, 9, 10, 0, 0, 0); // set the date beyond the usual calculation (to make sure this is working correctly)

            const upperBound = new Date(
              refDate.getTime() + days * 24 * 60 * 60 * 1000
            );

            const date = faker.date.soon({ days, refDate: converter(refDate) });

            expect(
              date,
              '`soon()` date should not be further ahead than `n` days ago'
            ).lessThanOrEqual(upperBound);
            expect(
              refDate,
              '`soon()` date should not be behind the starting date reference'
            ).lessThanOrEqual(date);
          }
        );
      });

      describe('month()', () => {
        it('should return random value from date.month.wide array by default', () => {
          const month = faker.date.month();
          expect(faker.definitions.date.month.wide).toContain(month);
        });

        it('should return random value from date.month.wide_context array for context option', () => {
          // Use a locale which has a wide_context array
          const month = fakerAZ.date.month({ context: true });
          expect(fakerAZ.definitions.date.month.wide_context).toContain(month);
        });

        it('should return random value from date.month.abbr array for abbreviated option', () => {
          const month = faker.date.month({ abbreviated: true });
          expect(faker.definitions.date.month.abbr).toContain(month);
        });

        it('should return random value from date.month.abbr_context array for abbreviated and context option', () => {
          // Use a locale (e.g. az) which has a wide_context array
          const month = fakerAZ.date.month({
            abbreviated: true,
            context: true,
          });
          expect(fakerAZ.definitions.date.month.abbr_context).toContain(month);
        });

        it('should return random value from date.month.wide array for context option when date.month.wide_context array is missing', () => {
          // Use a locale (e.g. the default en) which has no wide_context array
          const month = faker.date.month({ context: true });
          expect(faker.definitions.date.month.wide).toContain(month);
        });

        it('should return random value from date.month.abbr array for abbreviated and context option when date.month.abbr_context array is missing', () => {
          // Use a locale (e.g. the default en) which has no abbr_context array
          const month = faker.date.month({ abbreviated: true, context: true });
          expect(faker.definitions.date.month.abbr).toContain(month);
        });
      });

      describe('weekday()', () => {
        it('should return random value from date.weekday.wide array by default', () => {
          const weekday = faker.date.weekday();
          expect(faker.definitions.date.weekday.wide).toContain(weekday);
        });

        it('should return random value from date.weekday.wide_context array for context option', () => {
          // Use a locale (e.g. az) which has a wide_context array
          const weekday = fakerAZ.date.weekday({ context: true });
          expect(fakerAZ.definitions.date.weekday.wide_context).toContain(
            weekday
          );
        });

        it('should return random value from date.weekday.abbr array for abbreviated option', () => {
          const weekday = faker.date.weekday({ abbreviated: true });
          expect(faker.definitions.date.weekday.abbr).toContain(weekday);
        });

        it('should return random value from date.weekday.abbr_context array for abbreviated and context option', () => {
          // Use a locale (e.g. az) which has a abbr_context array
          const weekday = fakerAZ.date.weekday({
            abbreviated: true,
            context: true,
          });
          expect(fakerAZ.definitions.date.weekday.abbr_context).toContain(
            weekday
          );
        });

        it('should return random value from date.weekday.wide array for context option when date.weekday.wide_context array is missing', () => {
          // Use a locale (e.g. the default en) which has no wide_context array
          const weekday = faker.date.weekday({ context: true });
          expect(faker.definitions.date.weekday.wide).toContain(weekday);
        });

        it('should return random value from date.weekday.abbr array for abbreviated and context option when date.weekday.abbr_context array is missing', () => {
          // Use a locale (e.g. the default en) which has no abbr_context array
          const weekday = faker.date.weekday({
            abbreviated: true,
            context: true,
          });
          expect(faker.definitions.date.weekday.abbr).toContain(weekday);
        });
      });

      describe('birthdate', () => {
        it('returns a random birthdate', () => {
          const birthdate = faker.date.birthdate();
          expect(birthdate).toBeInstanceOf(Date);
        });

        it('returns a random birthdate in one year', () => {
          const min = 1990;
          const max = 1990;

          const birthdate = faker.date.birthdate({ min, max, mode: 'year' });

          // birthdate is a date object
          expect(birthdate).toBeInstanceOf(Date);

          // Generated date is between min and max
          expect(birthdate.getUTCFullYear()).toBeGreaterThanOrEqual(min);
          expect(birthdate.getUTCFullYear()).toBeLessThanOrEqual(max);
        });

        it('returns a random birthdate between two years', () => {
          const min = 1990;
          const max = 2000;

          const birthdate = faker.date.birthdate({ min, max, mode: 'year' });

          // birthdate is a date object
          expect(birthdate).toBeInstanceOf(Date);

          // Generated date is between min and max
          expect(birthdate.getUTCFullYear()).toBeGreaterThanOrEqual(min);
          expect(birthdate.getUTCFullYear()).toBeLessThanOrEqual(max);
        });

        it('returns a random birthdate for specific age', () => {
          const min = 21;
          const max = 21;
          const refDate = new Date();

          const birthdate = faker.date.birthdate({
            min,
            max,
            refDate,
            mode: 'age',
          });

          expect(birthdate).toBeInstanceOf(Date);
          const value = birthdate.valueOf();
          const refDateValue = refDate.valueOf();
          expect(value).toBeLessThanOrEqual(refDateValue);
          const age = calculateAge(birthdate, refDate);
          expect(age).toBe(21);
        });

        it('returns a random birthdate between two ages', () => {
          const min = 21;
          const max = 22;
          const refDate = new Date();

          const birthdate = faker.date.birthdate({ min, max, mode: 'age' });

          expect(birthdate).toBeInstanceOf(Date);
          const value = birthdate.valueOf();
          const refDateValue = refDate.valueOf();
          expect(value).toBeLessThanOrEqual(refDateValue);
          const age = calculateAge(birthdate, refDate);
          expect(age).toBeGreaterThanOrEqual(21);
          expect(age).toBeLessThanOrEqual(22);
        });

        it.each(['min', 'max', 'mode'] as const)(
          "should throw an error when '%s' is not provided",
          (key) => {
            const options = { min: 18, max: 80, mode: 'age' } as const;

            // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
            delete options[key];

            expect(() => faker.date.birthdate(options)).toThrow(
              new FakerError(
                `The 'min', 'max', and 'mode' options must be set together.`
              )
            );
          }
        );

        it('should throw an error when the min > max year', () => {
          const min = 2000;
          const max = 1990;

          expect(() =>
            faker.date.birthdate({ min, max, mode: 'year' })
          ).toThrow(
            new FakerError(
              `Max year 1990 should be greater than or equal to min year 2000.`
            )
          );
        });

        it('should throw an error when the min > max age', () => {
          const min = 31;
          const max = 25;
          const refDate = Date.UTC(2020, 0, 1);

          expect(() =>
            faker.date.birthdate({ min, max, refDate, mode: 'age' })
          ).toThrow(
            new FakerError(
              `Max age 25 should be greater than or equal to min age 31.`
            )
          );
        });
      });

      describe('timeZone', () => {
        it('should return a random timezone', () => {
          const actual = faker.date.timeZone();
          expect(faker.definitions.date.time_zone).toContain(actual);
        });
      });
    }
  );

  describe('definitions', () => {
    describe('timeZone', () => {
      it('should have timezones in the base locale', () => {
        expect(allLocales.base.date?.time_zone).toSatisfy(Array.isArray);
        expect(allLocales.base.date?.time_zone?.length).toBeGreaterThan(0);
      });

      it.each(
        Object.entries(allLocales).filter(([locale]) => locale !== 'base')
      )('should not have any timezones in %s', (_, data) => {
        expect(data.date?.time_zone).toBeUndefined();
      });
    });
  });

  describe('refDateSource', () => {
    afterEach(() => {
      faker.setDefaultRefDate();
    });

    it('should use the refDateSource when refDate is not provided (with function)', () => {
      faker.setDefaultRefDate(() => new Date(Date.UTC(2020, 0, 1)));
      faker.seed(20200101);
      const date = faker.date.past();
      expect(date).toBeInstanceOf(Date);
      expect(date).toMatchInlineSnapshot(`2019-11-06T02:07:17.181Z`);

      faker.seed(20200101);
      const date2 = faker.date.past();
      expect(date2).toMatchInlineSnapshot(`2019-11-06T02:07:17.181Z`);
    });

    it('should use the refDateSource when refDate is not provided (with value)', () => {
      faker.setDefaultRefDate(Date.UTC(2020, 0, 1));
      faker.seed(20200101);
      const date = faker.date.past();
      expect(date).toMatchInlineSnapshot(`2019-11-06T02:07:17.181Z`);

      faker.seed(20200101);
      const date2 = faker.date.past();
      expect(date2).toMatchInlineSnapshot(`2019-11-06T02:07:17.181Z`);
    });

    it('should not use the refDateSource when refDate is provided (with function)', () => {
      const spy: () => Date = vi.fn();
      faker.setDefaultRefDate(spy);
      faker.seed(20200101);

      const date = faker.date.past({ refDate: Date.UTC(2020, 0, 1) });
      expect(date).toBeInstanceOf(Date);
      expect(date).toMatchInlineSnapshot(`2019-11-06T02:07:17.181Z`);

      faker.seed(20200101);
      const date2 = faker.date.past({ refDate: Date.UTC(2020, 0, 1) });
      expect(date2).toMatchInlineSnapshot(`2019-11-06T02:07:17.181Z`);

      expect(spy).not.toHaveBeenCalled();
    });
  });
});
