/*
 * This file is automatically generated.
 * Run 'pnpm run generate:locales' to update.
 */

import { Faker } from '../faker';
import en from '../locales/en';
import fr from '../locales/fr';

const faker = new Faker({
  locale: 'fr',
  localeFallback: 'en',
  locales: {
    fr,
    en,
  },
});

export = faker;
