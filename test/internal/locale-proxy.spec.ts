import { describe, expect, it } from 'vitest';
import { FakerError, en } from '../../src';
import { createLocaleProxy } from '../../src/internal/locale-proxy';

describe('LocaleProxy', () => {
  const locale = createLocaleProxy(en);
  const enAirline = en.airline ?? { never: 'missing' };

  describe('locale', () => {
    it('should be possible to use equals on locale', () => {
      expect(locale).toEqual(createLocaleProxy(en));
    });

    it('should be possible to use not equals on locale', () => {
      expect(locale).not.toEqual(createLocaleProxy({}));
    });
  });

  describe('category', () => {
    it('should be possible to check for a missing category', () => {
      expect('category' in locale).toBe(true);
    });

    it('should be possible to check for an existing category', () => {
      expect('airline' in locale).toBe(true);
    });

    it('should be possible to access the title', () => {
      expect(locale.metadata.title).toBe('English');
    });

    it('should be possible to access a missing category', () => {
      expect(locale.category).toBeDefined();
    });

    it('should not be possible to add a new category', () => {
      expect(() => {
        // @ts-expect-error: LocaleProxy is read-only.
        locale.category = {};
      }).toThrow(
        new FakerError('You cannot edit the locale data on the faker instance')
      );
    });

    it('should not be possible to replace a category', () => {
      expect(() => {
        // @ts-expect-error: LocaleProxy is read-only.
        locale.airline = {};
      }).toThrow(
        new FakerError('You cannot edit the locale data on the faker instance')
      );
    });

    it('should not be possible to delete a missing category', () => {
      expect(() => {
        // @ts-expect-error: LocaleProxy is read-only.
        delete locale.category;
      }).toThrow(
        new FakerError('You cannot edit the locale data on the faker instance')
      );
    });

    it('should not be possible to delete an existing category', () => {
      expect(() => {
        // @ts-expect-error: LocaleProxy is read-only.
        delete locale.airline;
      }).toThrow(
        new FakerError('You cannot edit the locale data on the faker instance')
      );
    });

    it('should be possible to get all categories keys on empty locale', () => {
      const empty = createLocaleProxy({});

      expect(Object.keys(empty)).toEqual([]);
    });

    it('should be possible to get all categories keys on actual locale', () => {
      expect(Object.keys(locale).sort()).toEqual(Object.keys(en).sort());
    });
  });

  describe('entry', () => {
    it('should be possible to check for a missing entry in a missing category', () => {
      expect('missing' in locale.category).toBe(false);
    });

    it('should be possible to check for a missing entry in a present category', () => {
      expect('missing' in locale.airline).toBe(false);
    });

    it('should be possible to check for a present entry', () => {
      expect('airline' in locale.airline).toBe(true);
    });

    it('should not be possible to access a missing entry in a missing category', () => {
      expect(() => locale.category.missing).toThrow(
        new FakerError(
          `The locale data for 'category.missing' are missing in this locale.
  If this is a custom Faker instance, please make sure all required locales are used e.g. '[de_AT, de, en, base]'.
  Please contribute the missing data to the project or use a locale/Faker instance that has these data.
  For more information see https://fakerjs.dev/guide/localization.html`
        )
      );
    });

    it('should not be possible to access a missing entry in a present category', () => {
      expect(() => locale.airline.missing).toThrow(
        new FakerError(
          `The locale data for 'airline.missing' are missing in this locale.
  If this is a custom Faker instance, please make sure all required locales are used e.g. '[de_AT, de, en, base]'.
  Please contribute the missing data to the project or use a locale/Faker instance that has these data.
  For more information see https://fakerjs.dev/guide/localization.html`
        )
      );
    });

    it('should be possible to access a present entry', () => {
      expect(locale.airline.airline).toBeDefined();
    });

    it('should not be possible to access an unavailable entry in a present category', () => {
      const unavailable = createLocaleProxy({
        airline: { airline: null },
      });

      expect(() => unavailable.airline.airline).toThrow(
        new FakerError(
          `The locale data for 'airline.airline' aren't applicable to this locale.
  If you think this is a bug, please report it at: https://github.com/faker-js/faker`
        )
      );
    });

    it('should not be possible to add a new entry in a missing category', () => {
      expect(() => {
        // @ts-expect-error: LocaleProxy is read-only.
        locale.category.missing = {};
      }).toThrow(
        new FakerError('You cannot edit the locale data on the faker instance')
      );
    });

    it('should not be possible to add a new entry in an existing category', () => {
      expect(() => {
        // @ts-expect-error: LocaleProxy is read-only.
        locale.airline.missing = {};
      }).toThrow(
        new FakerError('You cannot edit the locale data on the faker instance')
      );
    });

    it('should not be possible to replace an entry in an existing category', () => {
      expect(() => {
        // @ts-expect-error: LocaleProxy is read-only.
        locale.airline.airline = ['dummy'];
      }).toThrow(
        new FakerError('You cannot edit the locale data on the faker instance')
      );
    });

    it('should not be possible to delete a missing entry in a missing category', () => {
      expect(() => {
        // @ts-expect-error: LocaleProxy is read-only.
        delete locale.category.missing;
      }).toThrow(
        new FakerError('You cannot edit the locale data on the faker instance')
      );
    });

    it('should not be possible to delete a missing entry in an existing category', () => {
      expect(() => {
        // @ts-expect-error: LocaleProxy is read-only.
        delete locale.airline.missing;
      }).toThrow(
        new FakerError('You cannot edit the locale data on the faker instance')
      );
    });

    it('should not be possible to delete an existing entry in an existing category', () => {
      expect(() => {
        // @ts-expect-error: LocaleProxy is read-only.
        delete locale.airline.airline;
      }).toThrow(
        new FakerError('You cannot edit the locale data on the faker instance')
      );
    });

    it('should be possible to get all keys from missing category', () => {
      expect(Object.keys(locale.missing)).toEqual([]);
    });

    it('should be possible to get all keys from existing category', () => {
      expect(Object.keys(locale.airline).sort()).toEqual(
        Object.keys(enAirline).sort()
      );
    });
  });
});
