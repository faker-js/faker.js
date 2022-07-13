import type { Faker } from '../..';

export interface Cvss {
  score: number;
  vector: string;
  rating: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export class SecurityModule {
  constructor(private readonly faker: Faker) {
    // Bind `this` so namespaced is working correctly
    for (const name of Object.getOwnPropertyNames(SecurityModule.prototype)) {
      if (name === 'constructor' || typeof this[name] !== 'function') {
        continue;
      }
      this[name] = this[name].bind(this);
    }
  }

  /**
   * Generates a random CVE
   *
   * @example
   * faker.security.cve() // 'CVE-2011-0762'
   */
  cve(): string {
    return [
      'CVE',
      // Year
      this.faker.date
        .between('1999-01-01T00:00:00.000Z', '2022-01-01T00:00:00.000Z')
        .getFullYear(),
      // Sequence in the year
      this.faker.random.numeric(5, { allowLeadingZeros: true }),
    ].join('-');
  }

  /**
   * Generates a random CWE
   *
   * @example
   * faker.security.cwe() // 'CWE-####'
   */
  cwe(): string {
    return ['CWE', this.faker.random.numeric(4)].join('-');
  }

  /**
   * Generates a random CVSS return
   * Based on:
   * https://www.first.org/cvss/calculator/3.1
   *
   * @example
   * faker.security.cvss()
   */
  cvss(): Cvss {
    return {
      score: 0.5,
      vector: [
        'CVSS:3.1',
        `AV:${this.faker.helpers.arrayElement('NALP'.split(''))}`,
        `AC:${this.faker.helpers.arrayElement('LH'.split(''))}`,
        `PR:${this.faker.helpers.arrayElement('NLH'.split(''))}`,
        `UI:${this.faker.helpers.arrayElement('NR'.split(''))}`,
        `S:${this.faker.helpers.arrayElement('UC'.split(''))}`,
        `C:${this.faker.helpers.arrayElement('NLH'.split(''))}`,
        `I:${this.faker.helpers.arrayElement('NLH'.split(''))}`,
        `A:${this.faker.helpers.arrayElement('NLH'.split(''))}`,
      ].join('/'),
      rating: this.faker.helpers.arrayElement([
        'none',
        'low',
        'medium',
        'high',
        'critical',
      ]),
    };
  }
}
