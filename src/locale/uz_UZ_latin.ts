/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import base from '../locales/base';
import en from '../locales/en';
import uz_UZ_latin from '../locales/uz_UZ_latin';

/**
 * The faker instance for the `uz_UZ_latin` locale.
 *
 * - Language: Uzbek (Uzbekistan, Latin)
 * - Endonym: O'zbekcha
 *
 * This instance uses the following locales internally (in descending precedence):
 *
 * - `uz_UZ_latin`
 * - `en`
 * - `base`
 */
export const faker = new Faker({
  locale: [uz_UZ_latin, en, base],
});
