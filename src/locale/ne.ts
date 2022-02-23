/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import ne from '../locales/ne';
import en from '../locales/en';

const faker = new Faker({
  locale: 'ne',
  localeFallback: 'en',
  locales: {
    ne,
    en,
  },
});

export = faker;
