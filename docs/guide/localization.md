# Localization

## Switching locales

Did you know Faker supports many different locales?  
When using our default instance `import { faker } from '@faker-js/faker'` you get English data.
However, we also provide pre-built instances for [more than 60 available locales](#available-locales).

For example, you can import the German locale:

`import { fakerDE as faker } from '@faker-js/faker'`

::: tip Note
You can also build your own Faker instances, with custom locales/overwrites.
:::

## Custom locales and fallbacks

If our built-in faker instances don't satisfy your needs, you can build your own:

```ts
import type { LocaleDefinition } from '@faker-js/faker';
import { base, de, de_CH, en, Faker } from '@faker-js/faker';

const customLocale: LocaleDefinition = {
  title: 'My custom locale',
  internet: {
    domainSuffix: ['test'],
  },
};

export const customFaker = new Faker({
  locale: [customLocale, de_CH, de, en, base],
});
```

In this example there are 5 locales. Each of these is checked in order, and the first locale which contains the requested data will be used:

- `customLocale` is your custom locale definition which will override all other fallback definitions.
- `de_CH` is a specific locale definition that overrides some German definitions with `CH` (Switzerland) data.
- `de` is a generic `de` (German) locale definition.
- `en` is a generic `en` (English) locale definition. This is our most complete locale, so we add it to fill some gaps. Depending on your needs, you might want or not want to have it as a fallback.
- `base` is the base locale definition which contains definitions that can be used in every language (e.g. emojis).

## Available locales

<!-- LOCALES-AUTO-GENERATED-START -->

<!-- Run 'pnpm run generate:locales' to update. -->

| Locale        | Name                      | Faker              |
| :------------ | :------------------------ | :----------------- |
| `af_ZA`       | Afrikaans (South Africa)  | `fakerAF_ZA`       |
| `ar`          | Arabic                    | `fakerAR`          |
| `az`          | Azerbaijani               | `fakerAZ`          |
| `base`        | Base                      | `fakerBASE`        |
| `cs_CZ`       | Czech (Czechia)           | `fakerCS_CZ`       |
| `da`          | Danish                    | `fakerDA`          |
| `de`          | German                    | `fakerDE`          |
| `de_AT`       | German (Austria)          | `fakerDE_AT`       |
| `de_CH`       | German (Switzerland)      | `fakerDE_CH`       |
| `dv`          | Maldivian                 | `fakerDV`          |
| `el`          | Greek                     | `fakerEL`          |
| `en`          | English                   | `fakerEN`          |
| `en_AU`       | English (Australia)       | `fakerEN_AU`       |
| `en_AU_ocker` | English (Australia Ocker) | `fakerEN_AU_ocker` |
| `en_BORK`     | English (Bork)            | `fakerEN_BORK`     |
| `en_CA`       | English (Canada)          | `fakerEN_CA`       |
| `en_GB`       | English (Great Britain)   | `fakerEN_GB`       |
| `en_GH`       | English (Ghana)           | `fakerEN_GH`       |
| `en_HK`       | English (Hong Kong)       | `fakerEN_HK`       |
| `en_IE`       | English (Ireland)         | `fakerEN_IE`       |
| `en_IN`       | English (India)           | `fakerEN_IN`       |
| `en_NG`       | English (Nigeria)         | `fakerEN_NG`       |
| `en_US`       | English (United States)   | `fakerEN_US`       |
| `en_ZA`       | English (South Africa)    | `fakerEN_ZA`       |
| `eo`          | Esperanto                 | `fakerEO`          |
| `es`          | Spanish                   | `fakerES`          |
| `es_MX`       | Spanish (Mexico)          | `fakerES_MX`       |
| `fa`          | Farsi/Persian             | `fakerFA`          |
| `fi`          | Finnish                   | `fakerFI`          |
| `fr`          | French                    | `fakerFR`          |
| `fr_BE`       | French (Belgium)          | `fakerFR_BE`       |
| `fr_CA`       | French (Canada)           | `fakerFR_CA`       |
| `fr_CH`       | French (Switzerland)      | `fakerFR_CH`       |
| `fr_LU`       | French (Luxembourg)       | `fakerFR_LU`       |
| `fr_SN`       | French (Senegal)          | `fakerFR_SN`       |
| `he`          | Hebrew                    | `fakerHE`          |
| `hr`          | Croatian                  | `fakerHR`          |
| `hu`          | Hungarian                 | `fakerHU`          |
| `hy`          | Armenian                  | `fakerHY`          |
| `id_ID`       | Indonesian (Indonesia)    | `fakerID_ID`       |
| `it`          | Italian                   | `fakerIT`          |
| `ja`          | Japanese                  | `fakerJA`          |
| `ka_GE`       | Georgian (Georgia)        | `fakerKA_GE`       |
| `ko`          | Korean                    | `fakerKO`          |
| `lv`          | Latvian                   | `fakerLV`          |
| `mk`          | Macedonian                | `fakerMK`          |
| `nb_NO`       | Norwegian (Norway)        | `fakerNB_NO`       |
| `ne`          | Nepali                    | `fakerNE`          |
| `nl`          | Dutch                     | `fakerNL`          |
| `nl_BE`       | Dutch (Belgium)           | `fakerNL_BE`       |
| `pl`          | Polish                    | `fakerPL`          |
| `pt_BR`       | Portuguese (Brazil)       | `fakerPT_BR`       |
| `pt_PT`       | Portuguese (Portugal)     | `fakerPT_PT`       |
| `ro`          | Romanian                  | `fakerRO`          |
| `ro_MD`       | Romanian (Moldova)        | `fakerRO_MD`       |
| `ru`          | Russian                   | `fakerRU`          |
| `sk`          | Slovak                    | `fakerSK`          |
| `sr_RS_latin` | Serbian (Serbia, Latin)   | `fakerSR_RS_latin` |
| `sv`          | Swedish                   | `fakerSV`          |
| `th`          | Thai                      | `fakerTH`          |
| `tr`          | Turkish                   | `fakerTR`          |
| `uk`          | Ukrainian                 | `fakerUK`          |
| `ur`          | Urdu                      | `fakerUR`          |
| `uz_UZ_latin` | Uzbek (Uzbekistan, Latin) | `fakerUZ_UZ_latin` |
| `vi`          | Vietnamese                | `fakerVI`          |
| `yo_NG`       | Yoruba (Nigeria)          | `fakerYO_NG`       |
| `zh_CN`       | Chinese (China)           | `fakerZH_CN`       |
| `zh_TW`       | Chinese (Taiwan)          | `fakerZH_TW`       |
| `zu_ZA`       | Zulu (South Africa)       | `fakerZU_ZA`       |

<!-- LOCALES-AUTO-GENERATED-END -->

The `Locale` (data) and `Faker` columns refer to the respective `import` names:

```ts
import { de, fakerDE } from '@faker-js/faker';
```

::: tip Note
Some locales have limited coverage and rely more heavily on the English locale as the source for features they currently do not have.
However, in most cases, using a specific locale will be beneficial in the long term as specifying a locale reduces the time necessary for startup, which has a compounding effect on testing frameworks that reload the imports every execution.
:::

## Locale codes

Locales are named in a systematic way. The first two characters are a lowercase language code following the [ISO 639-1 standard](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) for example `ar` for Arabic or `en` for English.

The same language may be spoken in different countries, with different patterns for addresses, phone numbers etc. Optionally a two-letter uppercase country code can be added after an underscore, following the [ISO 3166-1 alpha-2 standard](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2), for example `en_US` represents English (United States) and `en_AU` represents English (Australia).

Rarely, an additional variant may be needed to fully represent an accented variant of the locale, or for languages which can be written in different scripts. This is appended after another underscore, for example `en_AU_ocker` (English in Australia in "Ocker" dialect) or `sr_RS_latin` (Serbian in Serbia in Latin script).

The recommended way to access Faker instances is by using one of the individual imports as shown above. If needed you can access all prebuilt Faker instances or all locale definitions via an object where the locale codes are the keys:

```ts
import { allFakers, allLocales } from '@faker-js/faker';

console.dir(allFakers['de_AT']); // the prebuilt Faker instance for de_AT
console.dir(allLocales['de_AT']); // the raw locale definitions for de_AT
```

This could be useful if you want to enumerate all locales, for example:

```ts
import { allFakers } from '@faker-js/faker';

for (let key of Object.keys(allFakers)) {
  try {
    console.log(
      `In locale ${key}, a sample name is ${allFakers[key].person.fullName()}`
    );
  } catch (e) {
    console.log(`In locale ${key}, an error occurred: ${e}`);
  }
}
```

## Handling Missing Data Errors

```txt
[Error]: The locale data for 'category.entry' are missing in this locale.
Please contribute the missing data to the project or use a locale/Faker instance that has these data.
For more information see https://fakerjs.dev/guide/localization.html
```

If you receive this error, this means you are using a locale (`Faker` instance) that does not have the relevant data for that method yet.
Please consider contributing the missing data, so that others can use them in the future as well.

As a workaround, you can provide additional fallbacks to your `Faker` instance:

```ts
import { Faker, el } from '@faker-js/faker'; // [!code --]
import { Faker, base, el, en } from '@faker-js/faker'; // [!code ++]

const faker = new Faker({
  locale: [el], // [!code --]
  locale: [el, en, base], // [!code ++]
});
console.log(faker.location.country()); // 'Belgium'
```

::: tip Note
Of course, you can use [Custom Locales and Fallbacks](#custom-locales-and-fallbacks) for this as well.
:::

## Handling Not-Applicable Data Errors

```txt
[Error]: The locale data for 'category.entry' aren't applicable to this locale.
If you think this is a bug, please report it at: https://github.com/faker-js/faker
```

If you receive this error, this means the current locale is unable to provide reasonable values for that method.
For example, there are no zip codes in Hongkong, so for that reason the `en_HK` locale is unable to provide these data.
The same applies to other locales and methods.

```ts
import { fakerEN_HK } from '@faker-js/faker';

console.log(fakerEN_HK.location.zipCode()); // Error // [!code error]
```

For these cases, we explicitly set the data to `null` to clarify, that we have thought about it, but there are no valid values to put there.
We could have used an empty array `[]`, but some locale data are stored as objects `{}`,
so `null` works for both of them without custom downstream handling of missing data.

::: tip Note
We are by far no experts in all provided languages/countries/locales,
so if you think this is an error for your locale, please create an issue and consider contributing the relevant data.
:::

If you want to use other fallback data instead, you can define them like this:

```ts{4}
import { Faker, en, en_HK } from '@faker-js/faker';

const faker = new Faker({
  locale: [{ location: { postcode: en.location.postcode } }, en_HK],
});
console.log(faker.location.zipCode()); // '17551-0348'
```

::: warning Warning
Since `null` is considered present data, it will not use any fallbacks for that.
So the following code does **not** work:

```ts
import { Faker, en, en_HK } from '@faker-js/faker';

const faker = new Faker({
  locale: [en_HK, { location: { postcode: en.location.postcode } }], // [!code warning]
});
console.log(faker.location.zipCode()); // Error // [!code error]
```

:::

See also: [Custom Locales and Fallbacks](#custom-locales-and-fallbacks)
