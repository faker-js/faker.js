import { FakerError } from '../../errors/faker-error';
import type { Faker } from '../../faker';
import { toBase64Url } from '../../internal/base64';
import { deprecated } from '../../internal/deprecated';
import { ModuleBase } from '../../internal/module-base';
import { charMapping } from './char-mappings';

export type EmojiType =
  | 'smiley'
  | 'body'
  | 'person'
  | 'nature'
  | 'food'
  | 'travel'
  | 'activity'
  | 'object'
  | 'symbol'
  | 'flag';

export type HTTPStatusCodeType =
  | 'informational'
  | 'success'
  | 'clientError'
  | 'serverError'
  | 'redirection';

export type HTTPProtocolType = 'http' | 'https';

export enum IPv4Network {
  /**
   * Equivalent to: `0.0.0.0/0`
   */
  Any = 'any',
  /**
   * Equivalent to: `127.0.0.0/8`
   *
   * @see [RFC1122](https://www.rfc-editor.org/rfc/rfc1122)
   */
  Loopback = 'loopback',
  /**
   * Equivalent to: `10.0.0.0/8`
   *
   * @see [RFC1918](https://www.rfc-editor.org/rfc/rfc1918)
   */
  PrivateA = 'private-a',
  /**
   * Equivalent to: `172.16.0.0/12`
   *
   * @see [RFC1918](https://www.rfc-editor.org/rfc/rfc1918)
   */
  PrivateB = 'private-b',
  /**
   * Equivalent to: `192.168.0.0/16`
   *
   * @see [RFC1918](https://www.rfc-editor.org/rfc/rfc1918)
   */
  PrivateC = 'private-c',
  /**
   * Equivalent to: `192.0.2.0/24`
   *
   * @see [RFC5737](https://www.rfc-editor.org/rfc/rfc5737)
   */
  TestNet1 = 'test-net-1',
  /**
   * Equivalent to: `198.51.100.0/24`
   *
   * @see [RFC5737](https://www.rfc-editor.org/rfc/rfc5737)
   */
  TestNet2 = 'test-net-2',
  /**
   * Equivalent to: `203.0.113.0/24`
   *
   * @see [RFC5737](https://www.rfc-editor.org/rfc/rfc5737)
   */
  TestNet3 = 'test-net-3',
  /**
   * Equivalent to: `169.254.0.0/16`
   *
   * @see [RFC3927](https://www.rfc-editor.org/rfc/rfc3927)
   */
  LinkLocal = 'link-local',
  /**
   * Equivalent to: `224.0.0.0/4`
   *
   * @see [RFC5771](https://www.rfc-editor.org/rfc/rfc5771)
   */
  Multicast = 'multicast',
}

export type IPv4NetworkType = `${IPv4Network}`;

const ipv4Networks: Record<IPv4Network, string> = {
  [IPv4Network.Any]: '0.0.0.0/0',
  [IPv4Network.Loopback]: '127.0.0.0/8',
  [IPv4Network.PrivateA]: '10.0.0.0/8',
  [IPv4Network.PrivateB]: '172.16.0.0/12',
  [IPv4Network.PrivateC]: '192.168.0.0/16',
  [IPv4Network.TestNet1]: '192.0.2.0/24',
  [IPv4Network.TestNet2]: '198.51.100.0/24',
  [IPv4Network.TestNet3]: '203.0.113.0/24',
  [IPv4Network.LinkLocal]: '169.254.0.0/16',
  [IPv4Network.Multicast]: '224.0.0.0/4',
};

/**
 * Checks whether the given string is a valid slug for `domainWord`s.
 *
 * @param slug The slug to check.
 */
function isValidDomainWordSlug(slug: string): boolean {
  return /^[a-z][a-z-]*[a-z]$/i.exec(slug) !== null;
}

/**
 * Tries various ways to produce a valid domain word slug, falling back to a random string if needed.
 *
 * @param faker The faker instance to use.
 * @param word The initial word to slugify.
 */
function makeValidDomainWordSlug(faker: Faker, word: string): string {
  const slug1 = faker.helpers.slugify(word);
  if (isValidDomainWordSlug(slug1)) {
    return slug1;
  }

  const slug2 = faker.helpers.slugify(faker.lorem.word());
  if (isValidDomainWordSlug(slug2)) {
    return slug2;
  }

  return faker.string.alpha({
    casing: 'lower',
    length: faker.number.int({ min: 4, max: 8 }),
  });
}

/**
 * Generates a random color in hex format with the given base color.
 *
 * @param faker The faker instance to use.
 * @param base The base color to use.
 */
function colorFromBase(faker: Faker, base: number): string {
  return Math.floor((faker.number.int(256) + base) / 2)
    .toString(16)
    .padStart(2, '0');
}

/**
 * Module to generate internet related entries.
 *
 * ### Overview
 *
 * For user accounts, you may need an [`email()`](https://fakerjs.dev/api/internet.html#email) and a [`password()`](https://fakerjs.dev/api/internet.html#password), as well as a ASCII [`username()`](https://fakerjs.dev/api/internet.html#username) or Unicode [`displayName()`](https://fakerjs.dev/api/internet.html#displayname). Since the emails generated could coincidentally be real email addresses, you should not use these for sending real email addresses. If this is a concern, use [`exampleEmail()`](https://fakerjs.dev/api/internet.html#exampleemail) instead.
 *
 * For websites, you can generate a [`domainName()`](https://fakerjs.dev/api/internet.html#domainname) or a full [`url()`](https://fakerjs.dev/api/internet.html#url).
 *
 * To make your data more 🔥, you can use [`emoji()`](https://fakerjs.dev/api/internet.html#emoji).
 *
 * You also have access to a number of the more technical elements of web requests, such as [`httpMethod`](https://fakerjs.dev/api/internet.html#httpmethod), [`httpStatusCode`](https://fakerjs.dev/api/internet.html#httpstatuscode), [`ip`](https://fakerjs.dev/api/internet.html#ip), [`mac`](https://fakerjs.dev/api/internet.html#mac), [`userAgent`](https://fakerjs.dev/api/internet.html#useragent), and [`port`](https://fakerjs.dev/api/internet.html#port).
 */
export class InternetModule extends ModuleBase {
  /**
   * Generates an email address using the given person's name as base.
   *
   * @param options The options to use.
   * @param options.firstName The optional first name to use. If not specified, a random one will be chosen.
   * @param options.lastName The optional last name to use. If not specified, a random one will be chosen.
   * @param options.provider The mail provider domain to use. If not specified, a random free mail provider will be chosen.
   * @param options.allowSpecialCharacters Whether special characters such as ``.!#$%&'*+-/=?^_`{|}~`` should be included
   * in the email address. Defaults to `false`.
   *
   * @example
   * faker.internet.email() // 'Kassandra4@hotmail.com'
   * faker.internet.email({ firstName: 'Jeanne'}) // 'Jeanne63@yahoo.com'
   * faker.internet.email({ firstName: 'Jeanne'}) // 'Jeanne_Smith63@yahoo.com'
   * faker.internet.email({ firstName: 'Jeanne', lastName: 'Doe' }) // 'Jeanne.Doe63@yahoo.com'
   * faker.internet.email({ firstName: 'Jeanne', lastName: 'Doe', provider: 'example.fakerjs.dev' }) // 'Jeanne_Doe88@example.fakerjs.dev'
   * faker.internet.email({ firstName: 'Jeanne', lastName: 'Doe', provider: 'example.fakerjs.dev', allowSpecialCharacters: true }) // 'Jeanne%Doe88@example.fakerjs.dev'
   *
   * @since 2.0.1
   */
  email(
    options: {
      /**
       * The optional first name to use.
       *
       * @default faker.person.firstName()
       */
      firstName?: string;
      /**
       * The optional last name to use.
       *
       * @default faker.person.lastName()
       */
      lastName?: string;
      /**
       * The mail provider domain to use. If not specified, a random free mail provider will be chosen.
       */
      provider?: string;
      /**
       * Whether special characters such as ``.!#$%&'*+-/=?^_`{|}~`` should be included in the email address.
       *
       * @default false
       */
      allowSpecialCharacters?: boolean;
    } = {}
  ): string {
    const {
      firstName,
      lastName,
      provider = this.faker.helpers.arrayElement(
        this.faker.definitions.internet.free_email
      ),
      allowSpecialCharacters = false,
    } = options;

    let localPart: string = this.username({ firstName, lastName });
    // Strip any special characters from the local part of the email address
    // This could happen if invalid chars are passed in manually in the firstName/lastName
    localPart = localPart.replaceAll(/[^A-Za-z0-9._+-]+/g, '');

    // The local part of an email address is limited to 64 chars per RFC 3696
    // We limit to 50 chars to be more realistic
    localPart = localPart.substring(0, 50);
    if (allowSpecialCharacters) {
      const usernameChars: string[] = [...'._-'];
      const specialChars: string[] = [...".!#$%&'*+-/=?^_`{|}~"];
      localPart = localPart.replace(
        this.faker.helpers.arrayElement(usernameChars),
        this.faker.helpers.arrayElement(specialChars)
      );
    }

    // local parts may not contain two or more consecutive . characters
    localPart = localPart.replaceAll(/\.{2,}/g, '.');

    // local parts may not start with or end with a . character
    localPart = localPart.replace(/^\./, '');
    localPart = localPart.replace(/\.$/, '');

    return `${localPart}@${provider}`;
  }

  /**
   * Generates an email address using an example mail provider using the given person's name as base.
   *
   * @param options An options object.
   * @param options.firstName The optional first name to use. If not specified, a random one will be chosen.
   * @param options.lastName The optional last name to use. If not specified, a random one will be chosen.
   * @param options.allowSpecialCharacters Whether special characters such as ``.!#$%&'*+-/=?^_`{|}~`` should be included
   * in the email address. Defaults to `false`.
   *
   * @example
   * faker.internet.exampleEmail() // 'Helmer.Graham23@example.com'
   * faker.internet.exampleEmail({ firstName: 'Jeanne' }) // 'Jeanne96@example.net'
   * faker.internet.exampleEmail({ firstName: 'Jeanne' }) // 'Jeanne.Smith96@example.net'
   * faker.internet.exampleEmail({ firstName: 'Jeanne', lastName: 'Doe' }) // 'Jeanne_Doe96@example.net'
   * faker.internet.exampleEmail({ firstName: 'Jeanne', lastName: 'Doe', allowSpecialCharacters: true }) // 'Jeanne%Doe88@example.com'
   *
   * @since 3.1.0
   */
  exampleEmail(
    options: {
      /**
       * The optional first name to use.
       *
       * @default faker.person.firstName()
       */
      firstName?: string;
      /**
       * The optional last name to use.
       *
       * @default faker.person.lastName()
       */
      lastName?: string;
      /**
       * Whether special characters such as ``.!#$%&'*+-/=?^_`{|}~`` should be included in the email address.
       *
       * @default false
       */
      allowSpecialCharacters?: boolean;
    } = {}
  ): string {
    const { firstName, lastName, allowSpecialCharacters = false } = options;

    const provider = this.faker.helpers.arrayElement(
      this.faker.definitions.internet.example_email
    );

    return this.email({
      firstName,
      lastName,
      provider,
      allowSpecialCharacters,
    });
  }

  /**
   * Generates a username using the given person's name as base.
   * The resulting username may use neither, one or both of the names provided.
   * This will always return a plain ASCII string.
   * Some basic stripping of accents and transliteration of characters will be done.
   *
   * @param options An options object.
   * @param options.firstName The optional first name to use. If not specified, a random one will be chosen.
   * @param options.lastName The optional last name to use. If not specified, a random one will be chosen.
   *
   * @see faker.internet.displayName(): For generating an Unicode display name.
   *
   * @example
   * faker.internet.userName() // 'Nettie_Zboncak40'
   * faker.internet.userName({ firstName: 'Jeanne' }) // 'Jeanne98'
   * faker.internet.userName({ firstName: 'Jeanne' }) // 'Jeanne.Smith98'
   * faker.internet.userName({ firstName: 'Jeanne', lastName: 'Doe'}) // 'Jeanne_Doe98'
   * faker.internet.userName({ firstName: 'John', lastName: 'Doe' }) // 'John.Doe'
   * faker.internet.userName({ firstName: 'Hélene', lastName: 'Müller' }) // 'Helene_Muller11'
   * faker.internet.userName({ firstName: 'Фёдор', lastName: 'Достоевский' }) // 'Fedor.Dostoevskii50'
   * faker.internet.userName({ firstName: '大羽', lastName: '陳' }) // 'hlzp8d.tpv45' - note neither name is used
   *
   * @since 2.0.1
   *
   * @deprecated Use `faker.internet.username()` instead.
   */
  userName(
    options: {
      /**
       * The optional first name to use.
       *
       * @default faker.person.firstName()
       */
      firstName?: string;
      /**
       * The optional last name to use.
       *
       * @default faker.person.lastName()
       */
      lastName?: string;
    } = {}
  ): string {
    deprecated({
      deprecated: 'faker.internet.userName()',
      proposed: 'faker.internet.username()',
      since: '9.1.0',
      until: '10.0.0',
    });

    return this.username(options);
  }

  /**
   * Generates a username using the given person's name as base.
   * The resulting username may use neither, one or both of the names provided.
   * This will always return a plain ASCII string.
   * Some basic stripping of accents and transliteration of characters will be done.
   *
   * @param options An options object.
   * @param options.firstName The optional first name to use. If not specified, a random one will be chosen.
   * @param options.lastName The optional last name to use. If not specified, a random one will be chosen.
   *
   * @see faker.internet.displayName(): For generating an Unicode display name.
   *
   * @example
   * faker.internet.username() // 'Nettie_Zboncak40'
   * faker.internet.username({ firstName: 'Jeanne' }) // 'Jeanne98'
   * faker.internet.username({ firstName: 'Jeanne' }) // 'Jeanne.Smith98'
   * faker.internet.username({ firstName: 'Jeanne', lastName: 'Doe'}) // 'Jeanne_Doe98'
   * faker.internet.username({ firstName: 'John', lastName: 'Doe' }) // 'John.Doe'
   * faker.internet.username({ firstName: 'Hélene', lastName: 'Müller' }) // 'Helene_Muller11'
   * faker.internet.username({ firstName: 'Фёдор', lastName: 'Достоевский' }) // 'Fedor.Dostoevskii50'
   * faker.internet.username({ firstName: '大羽', lastName: '陳' }) // 'hlzp8d.tpv45' - note neither name is used
   *
   * @since 9.1.0
   */
  username(
    options: {
      /**
       * The optional first name to use.
       *
       * @default faker.person.firstName()
       */
      firstName?: string;
      /**
       * The optional last name to use.
       *
       * @default faker.person.lastName()
       */
      lastName?: string;
    } = {}
  ): string {
    const {
      firstName = this.faker.person.firstName(),
      lastName = this.faker.person.lastName(),
      lastName: hasLastName,
    } = options;

    const separator = this.faker.helpers.arrayElement(['.', '_']);
    const disambiguator = this.faker.number.int(99);
    const strategies: Array<() => string> = [
      () => `${firstName}${separator}${lastName}${disambiguator}`,
      () => `${firstName}${separator}${lastName}`,
    ];
    if (!hasLastName) {
      strategies.push(() => `${firstName}${disambiguator}`);
    }

    let result = this.faker.helpers.arrayElement(strategies)();

    // There may still be non-ascii characters in the result.
    // First remove simple accents etc
    result = result
      .normalize('NFKD') //for example è decomposes to as e +  ̀
      .replaceAll(/[\u0300-\u036F]/g, ''); // removes combining marks

    result = [...result]
      .map((char) => {
        // If we have a mapping for this character, (for Cyrillic, Greek etc) use it
        if (charMapping[char]) {
          return charMapping[char];
        }

        const charCode = char.codePointAt(0) ?? Number.NaN;

        if (charCode < 0x80) {
          // Keep ASCII characters
          return char;
        }

        // Final fallback return the Unicode char code value for Chinese, Japanese, Korean etc, base-36 encoded
        return charCode.toString(36);
      })
      .join('');
    result = result.toString().replaceAll("'", '');
    result = result.replaceAll(' ', '');

    return result;
  }

  /**
   * Generates a display name using the given person's name as base.
   * The resulting display name may use one or both of the provided names.
   * If the input names include Unicode characters, the resulting display name will contain Unicode characters.
   * It will not contain spaces.
   *
   * @param options An options object.
   * @param options.firstName The optional first name to use. If not specified, a random one will be chosen.
   * @param options.lastName The optional last name to use. If not specified, a random one will be chosen.
   *
   * @see faker.internet.username(): For generating a plain ASCII username.
   *
   * @example
   * faker.internet.displayName() // 'Nettie_Zboncak40'
   * faker.internet.displayName({ firstName: 'Jeanne', lastName: 'Doe' }) // 'Jeanne98' - note surname not used.
   * faker.internet.displayName({ firstName: 'John', lastName: 'Doe' }) // 'John.Doe'
   * faker.internet.displayName({ firstName: 'Hélene', lastName: 'Müller' }) // 'Hélene_Müller11'
   * faker.internet.displayName({ firstName: 'Фёдор', lastName: 'Достоевский' }) // 'Фёдор.Достоевский50'
   * faker.internet.displayName({ firstName: '大羽', lastName: '陳' }) // '大羽.陳'
   *
   * @since 8.0.0
   */
  displayName(
    options: {
      /**
       * The optional first name to use.
       *
       * @default faker.person.firstName()
       */
      firstName?: string;
      /**
       * The optional last name to use.
       *
       * @default faker.person.lastName()
       */
      lastName?: string;
    } = {}
  ): string {
    const {
      firstName = this.faker.person.firstName(),
      lastName = this.faker.person.lastName(),
    } = options;

    const separator = this.faker.helpers.arrayElement(['.', '_']);
    const disambiguator = this.faker.number.int(99);
    const strategies: Array<() => string> = [
      () => `${firstName}${disambiguator}`,
      () => `${firstName}${separator}${lastName}`,
      () => `${firstName}${separator}${lastName}${disambiguator}`,
    ];

    let result = this.faker.helpers.arrayElement(strategies)();
    result = result.toString().replaceAll("'", '');
    result = result.replaceAll(' ', '');
    return result;
  }

  /**
   * Returns a random web protocol. Either `http` or `https`.
   *
   * @example
   * faker.internet.protocol() // 'http'
   *
   * @since 2.1.5
   */
  protocol(): 'http' | 'https' {
    const protocols: ['http', 'https'] = ['http', 'https'];
    return this.faker.helpers.arrayElement(protocols);
  }

  /**
   * Returns a random http method.
   *
   * Can be either of the following:
   *
   * - `GET`
   * - `POST`
   * - `PUT`
   * - `DELETE`
   * - `PATCH`
   *
   * @example
   * faker.internet.httpMethod() // 'PATCH'
   *
   * @since 5.4.0
   */
  httpMethod(): 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' {
    const httpMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] = [
      'GET',
      'POST',
      'PUT',
      'DELETE',
      'PATCH',
    ];
    return this.faker.helpers.arrayElement(httpMethods);
  }

  /**
   * Generates a random HTTP status code.
   *
   * @param options Options object.
   * @param options.types A list of the HTTP status code types that should be used.
   *
   * @example
   * faker.internet.httpStatusCode() // 200
   * faker.internet.httpStatusCode({ types: ['success', 'serverError'] }) // 500
   *
   * @since 7.0.0
   */
  httpStatusCode(
    options: {
      /**
       * A list of the HTTP status code types that should be used.
       *
       * @default Object.keys(faker.definitions.internet.http_status_code)
       */
      types?: ReadonlyArray<HTTPStatusCodeType>;
    } = {}
  ): number {
    const {
      types = Object.keys(
        this.faker.definitions.internet.http_status_code
      ) as HTTPStatusCodeType[],
    } = options;
    const httpStatusCodeType = this.faker.helpers.arrayElement(types);
    return this.faker.helpers.arrayElement(
      this.faker.definitions.internet.http_status_code[httpStatusCodeType]
    );
  }

  /**
   * Generates a random http(s) url.
   *
   * @param options Optional options object.
   * @param options.appendSlash Whether to append a slash to the end of the url (path). Defaults to a random boolean value.
   * @param options.protocol The protocol to use. Defaults to `'https'`.
   *
   * @example
   * faker.internet.url() // 'https://remarkable-hackwork.info'
   * faker.internet.url({ appendSlash: true }) // 'https://slow-timer.info/'
   * faker.internet.url({ protocol: 'http', appendSlash: false }) // 'http://www.terrible-idea.com'
   *
   * @since 2.1.5
   */
  url(
    options: {
      /**
       * Whether to append a slash to the end of the url (path).
       *
       * @default faker.datatype.boolean()
       */
      appendSlash?: boolean;
      /**
       * The protocol to use.
       *
       * @default 'https'
       */
      protocol?: HTTPProtocolType;
    } = {}
  ): string {
    const { appendSlash = this.faker.datatype.boolean(), protocol = 'https' } =
      options;
    return `${protocol}://${this.domainName()}${appendSlash ? '/' : ''}`;
  }

  /**
   * Generates a random domain name.
   *
   * @example
   * faker.internet.domainName() // 'slow-timer.info'
   *
   * @since 2.0.1
   */
  domainName(): string {
    return `${this.domainWord()}.${this.domainSuffix()}`;
  }

  /**
   * Returns a random domain suffix.
   *
   * @example
   * faker.internet.domainSuffix() // 'com'
   * faker.internet.domainSuffix() // 'name'
   *
   * @since 2.0.1
   */
  domainSuffix(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.internet.domain_suffix
    );
  }

  /**
   * Generates a random domain word.
   *
   * @example
   * faker.internet.domainWord() // 'close-reality'
   * faker.internet.domainWord() // 'weird-cytoplasm'
   *
   * @since 2.0.1
   */
  domainWord(): string {
    // Generate an ASCII "word" in the form `noun-adjective`
    // For locales with non-ASCII characters, we fall back to lorem words, or a random string

    const word1 = makeValidDomainWordSlug(
      this.faker,
      this.faker.word.adjective()
    );
    const word2 = makeValidDomainWordSlug(this.faker, this.faker.word.noun());
    return `${word1}-${word2}`.toLowerCase();
  }

  /**
   * Generates a random IPv4 or IPv6 address.
   *
   * @example
   * faker.internet.ip() // '245.108.222.0'
   * faker.internet.ip() // '4e5:f9c5:4337:abfd:9caf:1135:41ad:d8d3'
   *
   * @since 2.0.1
   */
  ip(): string {
    return this.faker.datatype.boolean() ? this.ipv4() : this.ipv6();
  }

  /**
   * Generates a random IPv4 address.
   *
   * @param options The optional options object.
   * @param options.cidrBlock The optional CIDR block to use. Must be in the format `x.x.x.x/y`. Defaults to `'0.0.0.0/0'`.
   *
   * @example
   * faker.internet.ipv4() // '245.108.222.0'
   * faker.internet.ipv4({ cidrBlock: '192.168.0.0/16' }) // '192.168.215.224'
   *
   * @since 6.1.1
   */
  ipv4(options?: {
    /**
     * The optional CIDR block to use. Must be in the format `x.x.x.x/y`.
     *
     * @default '0.0.0.0/0'
     */
    cidrBlock?: string;
  }): string;
  /**
   * Generates a random IPv4 address.
   *
   * @param options The optional options object.
   * @param options.network The optional network to use. This is intended as an alias for well-known `cidrBlock`s. Defaults to `'any'`.
   *
   * @example
   * faker.internet.ipv4() // '245.108.222.0'
   * faker.internet.ipv4({ network: 'private-a' }) // '10.199.154.205'
   *
   * @since 6.1.1
   */
  ipv4(options?: {
    /**
     * The optional network to use. This is intended as an alias for well-known `cidrBlock`s.
     *
     * @default 'any'
     */
    network?: IPv4NetworkType;
  }): string;
  /**
   * Generates a random IPv4 address.
   *
   * @param options The optional options object.
   * @param options.cidrBlock The optional CIDR block to use. Must be in the format `x.x.x.x/y`. Defaults to `'0.0.0.0/0'`.
   * @param options.network The optional network to use. This is intended as an alias for well-known `cidrBlock`s. Defaults to `'any'`.
   *
   * @example
   * faker.internet.ipv4() // '245.108.222.0'
   * faker.internet.ipv4({ cidrBlock: '192.168.0.0/16' }) // '192.168.215.224'
   * faker.internet.ipv4({ network: 'private-a' }) // '10.199.154.205'
   *
   * @since 6.1.1
   */
  ipv4(
    options?:
      | {
          /**
           * The optional CIDR block to use. Must be in the format `x.x.x.x/y`.
           *
           * @default '0.0.0.0/0'
           */
          cidrBlock?: string;
        }
      | {
          /**
           * The optional network to use. This is intended as an alias for well-known `cidrBlock`s.
           *
           * @default 'any'
           */
          network?: IPv4NetworkType;
        }
  ): string;
  ipv4(
    options: { cidrBlock?: string; network?: IPv4NetworkType } = {}
  ): string {
    const { network = 'any', cidrBlock = ipv4Networks[network] } = options;

    if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/.test(cidrBlock)) {
      throw new FakerError(
        `Invalid CIDR block provided: ${cidrBlock}. Must be in the format x.x.x.x/y.`
      );
    }

    const [ipText, subnet] = cidrBlock.split('/');
    const subnetMask = 0xffffffff >>> Number.parseInt(subnet);
    const [rawIp1, rawIp2, rawIp3, rawIp4] = ipText.split('.').map(Number);
    const rawIp = (rawIp1 << 24) | (rawIp2 << 16) | (rawIp3 << 8) | rawIp4;
    const networkIp = rawIp & ~subnetMask;
    const hostOffset = this.faker.number.int(subnetMask);
    const ip = networkIp | hostOffset;
    return [
      (ip >>> 24) & 0xff,
      (ip >>> 16) & 0xff,
      (ip >>> 8) & 0xff,
      ip & 0xff,
    ].join('.');
  }

  /**
   * Generates a random IPv6 address.
   *
   * @example
   * faker.internet.ipv6() // '269f:1230:73e3:318d:842b:daab:326d:897b'
   *
   * @since 4.0.0
   */
  ipv6(): string {
    return Array.from({ length: 8 }, () =>
      this.faker.string.hexadecimal({
        length: 4,
        casing: 'lower',
        prefix: '',
      })
    ).join(':');
  }

  /**
   * Generates a random port number.
   *
   * @example
   * faker.internet.port() // 9414
   *
   * @since 5.4.0
   */
  port(): number {
    return this.faker.number.int(65535);
  }

  /**
   * Generates a random user agent string.
   *
   * @example
   * faker.internet.userAgent()
   * // 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_1 like Mac OS X) AppleWebKit/537.19.86 (KHTML, like Gecko) Version/18_3 Mobile/15E148 Safari/598.43'
   *
   * @since 2.0.1
   */
  userAgent(): string {
    return this.faker.helpers.fake(
      this.faker.definitions.internet.user_agent_pattern
    );
  }

  /**
   * Generates a random css hex color code in aesthetically pleasing color palette.
   *
   * Based on
   * http://stackoverflow.com/questions/43044/algorithm-to-randomly-generate-an-aesthetically-pleasing-color-palette
   *
   * @param options An options object.
   * @param options.redBase The optional base red in range between `0` and `255`. Defaults to `0`.
   * @param options.greenBase The optional base green in range between `0` and `255`. Defaults to `0`.
   * @param options.blueBase The optional base blue in range between `0` and `255`. Defaults to `0`.
   *
   * @example
   * faker.internet.color() // '#30686e'
   * faker.internet.color({ redBase: 100, greenBase: 100, blueBase: 100 }) // '#4e5f8b'
   *
   * @since 2.0.1
   */
  color(
    options: {
      /**
       * The optional base red in range between `0` and `255`.
       *
       * @default 0
       */
      redBase?: number;
      /**
       * The optional base green in range between `0` and `255`.
       *
       * @default 0
       */
      greenBase?: number;
      /**
       * The optional base blue in range between `0` and `255`.
       *
       * @default 0
       */
      blueBase?: number;
    } = {}
  ): string {
    const { redBase = 0, greenBase = 0, blueBase = 0 } = options;

    const red = colorFromBase(this.faker, redBase);
    const green = colorFromBase(this.faker, greenBase);
    const blue = colorFromBase(this.faker, blueBase);

    return `#${red}${green}${blue}`;
  }

  /**
   * Generates a random mac address.
   *
   * @param options An options object.
   * @param separator The optional separator to use. Can be either `':'`, `'-'` or `''`. Defaults to `':'`.
   *
   * @example
   * faker.internet.mac() // '32:8e:2e:09:c6:05'
   *
   * @since 3.0.0
   */
  mac(options?: {
    /**
     * The optional separator to use. Can be either `':'`, `'-'` or `''`.
     *
     * @default ':'
     */
    separator?: string;
  }): string;
  /**
   * Generates a random mac address.
   *
   * @param separator The optional separator to use. Can be either `':'`, `'-'` or `''`. Defaults to `':'`.
   *
   * @example
   * faker.internet.mac() // '32:8e:2e:09:c6:05'
   *
   * @since 3.0.0
   */
  mac(separator?: string): string;
  /**
   * Generates a random mac address.
   *
   * @param options The optional separator or an options object.
   * @param separator The optional separator to use. Can be either `':'`, `'-'` or `''`. Defaults to `':'`.
   *
   * @example
   * faker.internet.mac() // '32:8e:2e:09:c6:05'
   *
   * @since 3.0.0
   */
  mac(
    options?:
      | string
      | {
          /**
           * The optional separator to use. Can be either `':'`, `'-'` or `''`.
           *
           * @default ':'
           */
          separator?: string;
        }
  ): string;
  mac(
    options:
      | string
      | {
          /**
           * The optional separator to use. Can be either `':'`, `'-'` or `''`.
           *
           * @default ':'
           */
          separator?: string;
        } = {}
  ): string {
    if (typeof options === 'string') {
      options = { separator: options };
    }

    let { separator = ':' } = options;

    let i: number;
    let mac = '';

    const acceptableSeparators = [':', '-', ''];
    if (!acceptableSeparators.includes(separator)) {
      separator = ':';
    }

    for (i = 0; i < 12; i++) {
      mac += this.faker.number.hex(15);
      if (i % 2 === 1 && i !== 11) {
        mac += separator;
      }
    }

    return mac;
  }

  /**
   * Generates a random password-like string. Do not use this method for generating actual passwords for users.
   * Since the source of the randomness is not cryptographically secure, neither is this generator.
   *
   * @param options An options object.
   * @param options.length The length of the password to generate. Defaults to `15`.
   * @param options.memorable Whether the generated password should be memorable. Defaults to `false`.
   * @param options.pattern The pattern that all chars should match.
   * This option will be ignored, if `memorable` is `true`. Defaults to `/\w/`.
   * @param options.prefix The prefix to use. Defaults to `''`.
   *
   * @example
   * faker.internet.password() // '89G1wJuBLbGziIs'
   * faker.internet.password({ length: 20 }) // 'aF55c_8O9kZaPOrysFB_'
   * faker.internet.password({ length: 20, memorable: true }) // 'lawetimufozujosodedi'
   * faker.internet.password({ length: 20, memorable: true, pattern: /[A-Z]/ }) // 'HMAQDFFYLDDUTBKVNFVS'
   * faker.internet.password({ length: 20, memorable: true, pattern: /[A-Z]/, prefix: 'Hello ' }) // 'Hello IREOXTDWPERQSB'
   *
   * @since 2.0.1
   */
  password(
    options: {
      /**
       * The length of the password to generate.
       *
       * @default 15
       */
      length?: number;
      /**
       * Whether the generated password should be memorable.
       *
       * @default false
       */
      memorable?: boolean;
      /**
       * The pattern that all chars should match.
       * This option will be ignored, if `memorable` is `true`.
       *
       * @default /\w/
       */
      pattern?: RegExp;
      /**
       * The prefix to use.
       *
       * @default ''
       */
      prefix?: string;
    } = {}
  ): string {
    /*
     * password-generator ( function )
     * Copyright(c) 2011-2013 Bermi Ferrer <bermi@bermilabs.com>
     * MIT Licensed
     */
    const vowel = /[aeiouAEIOU]$/;
    const consonant = /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ]$/;
    const _password = (
      length: number,
      memorable: boolean,
      pattern: RegExp,
      prefix: string
    ): string => {
      if (prefix.length >= length) {
        return prefix;
      }

      if (memorable) {
        pattern = consonant.test(prefix) ? vowel : consonant;
      }

      const n = this.faker.number.int(94) + 33;
      let char = String.fromCodePoint(n);
      if (memorable) {
        char = char.toLowerCase();
      }

      if (!pattern.test(char)) {
        return _password(length, memorable, pattern, prefix);
      }

      return _password(length, memorable, pattern, prefix + char);
    };

    const {
      length = 15,
      memorable = false,
      pattern = /\w/,
      prefix = '',
    } = options;

    return _password(length, memorable, pattern, prefix);
  }

  /**
   * Generates a random emoji.
   *
   * @param options Options object.
   * @param options.types A list of the emoji types that should be included. Possible values are `'smiley'`, `'body'`, `'person'`, `'nature'`, `'food'`, `'travel'`, `'activity'`, `'object'`, `'symbol'`, `'flag'`. By default, emojis from any type will be included.
   *
   * @example
   * faker.internet.emoji() // '🥰'
   * faker.internet.emoji({ types: ['food', 'nature'] }) // '🥐'
   *
   * @since 6.2.0
   */
  emoji(
    options: {
      /**
       * A list of the emoji types that should be used.
       *
       * @default Object.keys(faker.definitions.internet.emoji)
       */
      types?: ReadonlyArray<EmojiType>;
    } = {}
  ): string {
    const {
      types = Object.keys(this.faker.definitions.internet.emoji) as EmojiType[],
    } = options;
    const emojiType = this.faker.helpers.arrayElement(types);
    return this.faker.helpers.arrayElement(
      this.faker.definitions.internet.emoji[emojiType]
    );
  }

  /**
   * Generates a random JWT (JSON Web Token) Algorithm.
   *
   * @see faker.internet.jwt(): For generating random JWT (JSON Web Token).
   *
   * @example
   * faker.internet.jwtAlgorithm() // 'HS256'
   * faker.internet.jwtAlgorithm() // 'RS512'
   *
   * @since 9.1.0
   */
  jwtAlgorithm(): string {
    return this.faker.helpers.arrayElement(
      this.faker.definitions.internet.jwt_algorithm
    );
  }

  /**
   * Generates a random JWT (JSON Web Token).
   *
   * Please note that this method generates a random signature instead of a valid one.
   *
   * @param options The optional options object.
   * @param options.header The Header to use for the token. Defaults to a random object with the following fields: `alg` and `typ`.
   * @param options.payload The Payload to use for the token. Defaults to a random object with the following fields: `iat`, `exp`, `nbf`, `iss`, `sub`, `aud`, and `jti`.
   * @param options.refDate The date to use as reference point for the newly generated date.
   *
   * @see https://datatracker.ietf.org/doc/html/rfc7519
   * @see faker.internet.jwtAlgorithm(): For generating random JWT (JSON Web Token) Algorithm.
   *
   * @example
   * faker.internet.jwt() // 'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MzI2MzgxMDYsImV4cCI6MTczMjY5MjUwOSwibmJmIjoxNzA1MDgxNjQ4LCJpc3MiOiJHdXRrb3dza2kgYW5kIFNvbnMiLCJzdWIiOiJlMzQxZjMwNS0yM2I2LTRkYmQtOTY2ZC1iNDRiZmM0ZGIzMGUiLCJhdWQiOiI0YzMwZGE3Yi0zZDUzLTQ4OGUtYTAyZC0zOWI2MDZiZmYxMTciLCJqdGkiOiJiMGZmOTMzOC04ODMwLTRmNDgtYjA3Ny1kNDNmMjU2OGZlYzAifQ.oDLVR73M0u5SjMPlc1aruxbdK7l2titXSeo9J5M1JUd65a1X9MhCz7FOobtX8eaj'
   * faker.internet.jwt({ header: { alg: 'HS256' }}) // 'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MTg2MTM3MTIsImV4cCI6MTcxODYzMzY3OSwibmJmIjoxNjk3MjYzNjMwLCJpc3MiOiJEb3lsZSBhbmQgU29ucyIsInN1YiI6IjYxYWRkYWFmLWY4MjktNDkzZS1iNTI1LTJjMGJkNjkzOTdjNyIsImF1ZCI6IjczNjcyMjVjLWIwMWMtNGE1My1hYzQyLTYwOWJkZmI1MzBiOCIsImp0aSI6IjU2Y2ZkZjAxLWRhMzMtNGUxNi04MzJiLTFlYTk3ZGY1MTQ2YSJ9.5iUgaCaFVPZ8d1QD0xMjoeJbmPVyUfKfoRQ6Njzm5MLp5F4UMh5REbPCrW70fAkr'
   * faker.internet.jwt({ payload: { iss: 'Acme' }}) // 'eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJBY21lIn0.syUt0GBukNac8Cn1AGKFq2SWAXWy1YIfl0uOYiwg6TZ3omAW0c7FGWY6bC7ZOFSt'
   * faker.internet.jwt({ refDate: '2020-01-01T00:00:00.000Z' }) // 'eyJhbGciOiJFUzM4NCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1Nzc4MDY4NDUsImV4cCI6MTU3Nzg0NjI4MCwibmJmIjoxNTgxNTQyMDYwLCJpc3MiOiJLcmVpZ2VyLCBBbHRlbndlcnRoIGFuZCBQYXVjZWsiLCJzdWIiOiI5NzVjMjMyOS02MDlhLTRjYTYtYjBkZi05ZmY4MGZiNDUwN2QiLCJhdWQiOiI0ODQxZWYwNi01OWYwLTQzMWEtYmFmZi0xMjkxZmRhZDdhNjgiLCJqdGkiOiJmNDBjZTJiYi00ZWYyLTQ1MjMtOGIxMy1kN2Q4NTA5N2M2ZTUifQ.cuClEZQ0CyPIMVS5uxrMwWXz0wcqFFdt0oNne3PMryyly0jghkxVurss2TapMC3C'
   *
   * @since 9.1.0
   */
  jwt(
    options: {
      /**
       * The header to use for the token. If present, it will replace any default values.
       *
       * @default
       * {
       *   alg: faker.internet.jwtAlgorithm(),
       *   typ: 'JWT'
       * }
       */
      header?: Record<string, unknown>;
      /**
       * The payload to use for the token. If present, it will replace any default values.
       *
       * @default
       * {
       *   iat: faker.date.recent(),
       *   exp: faker.date.soon(),
       *   nbf: faker.date.anytime(),
       *   iss: faker.company.name(),
       *   sub: faker.string.uuid(),
       *   aud: faker.string.uuid(),
       *   jti: faker.string.uuid()
       * }
       */
      payload?: Record<string, unknown>;
      /**
       * The date to use as reference point for the newly generated date.
       *
       * @default faker.defaultRefDate()
       */
      refDate?: string | Date | number;
    } = {}
  ): string {
    const { refDate = this.faker.defaultRefDate() } = options;

    const iatDefault = this.faker.date.recent({ refDate });

    const {
      header = {
        alg: this.jwtAlgorithm(),
        typ: 'JWT',
      },
      payload = {
        iat: Math.round(iatDefault.valueOf() / 1000),
        exp: Math.round(
          this.faker.date.soon({ refDate: iatDefault }).valueOf() / 1000
        ),
        nbf: Math.round(this.faker.date.anytime({ refDate }).valueOf() / 1000),
        iss: this.faker.company.name(),
        sub: this.faker.string.uuid(),
        aud: this.faker.string.uuid(),
        jti: this.faker.string.uuid(),
      },
    } = options;

    const encodedHeader = toBase64Url(JSON.stringify(header));
    const encodedPayload = toBase64Url(JSON.stringify(payload));
    const signature = this.faker.string.alphanumeric(64);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
}
