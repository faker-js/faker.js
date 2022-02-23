/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import ro from '../locales/ro';
import en from '../locales/en';

const faker = new Faker({
  locale: 'ro',
  localeFallback: 'en',
  locales: {
    ro,
    en,
  },
});

export = faker;
