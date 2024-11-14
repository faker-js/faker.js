import isCreditCard from 'validator/lib/isCreditCard';
import { describe, expect, it } from 'vitest';
import { faker, fakerZH_CN } from '../../src';
import { FakerError } from '../../src/errors/faker-error';
import {
  BitcoinAddressFamily,
  BitcoinNetwork,
} from '../../src/modules/finance/bitcoin';
import ibanLib from '../../src/modules/finance/iban';
import { luhnCheck } from '../../src/modules/helpers/luhn-check';
import { seededTests } from '../support/seeded-runs';
import { times } from './../support/times';

const NON_SEEDED_BASED_RUN = 5;

describe('finance', () => {
  seededTests(faker, 'finance', (t) => {
    t.itEach(
      'accountName',
      'routingNumber',
      'transactionType',
      'creditCardIssuer',
      'currency',
      'currencyCode',
      'currencyName',
      'currencySymbol',
      'litecoinAddress',
      'creditCardCVV',
      'ethereumAddress',
      'transactionDescription'
    );

    t.describe('accountNumber', (t) => {
      t.it('noArgs')
        .it('with length', 10)
        .it('with length option', { length: 10 });
    });

    t.describe('pin', (t) => {
      t.it('noArgs')
        .it('with length', 10)
        .it('with length option', { length: 10 });
    });

    t.describe('amount', (t) => {
      t.it('noArgs')
        .it('with min option', { min: 10 })
        .it('with min and max option', { min: 10, max: 50 })
        .it('with min, max and dec option', { min: 10, max: 50, dec: 5 })
        .it('with min, max, dec and symbol option', {
          min: 10,
          max: 50,
          dec: 5,
          symbol: '#',
        })
        .it('with min, max, dec, symbol and autoFormat option', {
          min: 10,
          max: 50,
          dec: 5,
          symbol: '#',
          autoFormat: false,
        });
    });

    t.describe('bic', (t) => {
      t.it('noArgs').it('with branch code', { includeBranchCode: true });
    });

    t.describe('iban', (t) => {
      t.it('noArgs')
        .it('with formatted option', { formatted: true })
        .it('with formatted and countryCode option', {
          formatted: true,
          countryCode: 'DE',
        });
    });

    t.describe('creditCardNumber', (t) => {
      t.it('noArgs')
        .it('with issuer', 'visa')
        .it('with issuer option visa', { issuer: 'visa' })
        .it('with issuer option mastercard', { issuer: 'mastercard' });
    });

    t.describe('maskedNumber', (t) => {
      t.it('noArgs')
        .it('with length', 5)
        .it('with length option', { length: 5 })
        .it('with length and parenthesis option', { length: 5, parens: false })
        .it('with length, parenthesis and ellipsis option', {
          length: 5,
          parens: false,
          ellipsis: true,
        });
    });

    t.describe('bitcoinAddress', (t) => {
      t.it('noArgs')
        .it('with type option', { type: BitcoinAddressFamily.Legacy })
        .it('with type and network option', {
          type: BitcoinAddressFamily.Legacy,
          network: BitcoinNetwork.Mainnet,
        });
    });
  });

  describe.each(times(NON_SEEDED_BASED_RUN).map(() => faker.seed()))(
    'random seeded tests for seed %i',
    () => {
      describe('accountNumber()', () => {
        it('should supply a default length', () => {
          const accountNumber = faker.finance.accountNumber();

          expect(accountNumber).toBeTruthy();
          expect(
            accountNumber,
            'The length of the account number should be 8 characters long'
          ).toHaveLength(8);
        });

        it('should have same length as given length number', () => {
          const accountNumber = faker.finance.accountNumber(16);

          expect(accountNumber).toBeTruthy();
          expect(
            accountNumber,
            'The length of the account number should match the given number'
          ).toHaveLength(16);
        });

        it('should have same length as given length object', () => {
          const accountNumber = faker.finance.accountNumber({ length: 12 });

          expect(accountNumber).toBeTruthy();
          expect(
            accountNumber,
            'The length of the account number should match the given number'
          ).toHaveLength(12);
        });
      });

      describe('accountName()', () => {
        it('should return a string', () => {
          const accountName = faker.finance.accountName();

          expect(accountName).toBeTruthy();
          expect(accountName).toBeTypeOf('string');
        });
      });

      describe('routingNumber()', () => {
        it('should return a string', () => {
          const routingNumber = faker.finance.routingNumber();

          expect(routingNumber).toBeTypeOf('string');
        });
      });

      describe('maskedNumber()', () => {
        it('should return contain parenthesis, ellipsis and have a length of 4 by default', () => {
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          const actual = faker.finance.maskedNumber();

          expect(actual).toMatch(/\(\.{3}\d{4}\)/);
        });

        it('should set a default length', () => {
          const expected = 4; // default account mask length
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          const mask = faker.finance.maskedNumber({
            parens: false,
            ellipsis: false,
          });

          expect(
            mask,
            `The expected default mask length is ${expected} but it was ${mask.length}`
          ).toHaveLength(expected);
        });

        it('should set a specified length', () => {
          const expected = faker.number.int({ min: 1, max: 20 });

          // eslint-disable-next-line @typescript-eslint/no-deprecated
          const mask = faker.finance.maskedNumber({
            length: expected,
            parens: false,
            ellipsis: false,
          }); // the length of mask picks 4 if the random number generator picks 0

          expect(
            mask,
            `The expected default mask length is ${expected} but it was ${mask.length}`
          ).toHaveLength(expected);
        });
      });

      describe('amount()', () => {
        it('should use the default amounts when not passing arguments', () => {
          const amount = faker.finance.amount();

          expect(amount).toBeTruthy();
          expect(amount).toBeTypeOf('string');
          expect(+amount).toBeGreaterThanOrEqual(0);
          expect(+amount).toBeLessThanOrEqual(1000);
        });

        //TODO: add support for more currency and decimal options
        it('should not include a currency symbol by default', () => {
          const amount = faker.finance.amount();

          expect(amount).toBeTruthy();
          expect(amount).toBeTypeOf('string');
          expect(
            amount,
            'The expected match should not include a currency symbol'
          ).toMatch(/^[0-9.]+$/);
        });

        it('should handle negative amounts', () => {
          const amount = faker.finance.amount({ min: -200, max: -1 });

          expect(amount).toBeTruthy();
          expect(amount).toBeTypeOf('string');
          expect(+amount).toBeLessThanOrEqual(-1);
          expect(+amount).toBeGreaterThanOrEqual(-200);
        });

        it('should use the default dec', () => {
          const amount = faker.finance.amount({ min: 100, max: 100 });

          expect(amount).toBeTruthy();
          expect(amount).toBeTypeOf('string');
          expect(amount).toBe('100.00');
        });

        it('should handle argument dec', () => {
          const amount = faker.finance.amount({ min: 100, max: 100, dec: 1 });

          expect(amount).toBeTruthy();
          expect(amount).toBeTypeOf('string');
          expect(amount).toBe('100.0');
        });

        it('should handle argument dec = 0', () => {
          const amount = faker.finance.amount({ min: 100, max: 100, dec: 0 });

          expect(amount).toBeTruthy();
          expect(amount).toBeTypeOf('string');
          expect(amount).toBe('100');
        });

        it.each([false, undefined])(
          'should return unformatted if autoformat is %s',
          (autoFormat) => {
            const number = 6000;
            const amount = faker.finance.amount({
              min: number,
              max: number,
              dec: 0,
              autoFormat,
            });

            expect(amount).toBe(number.toString());
          }
        );

        it('should return the number formatted on the current locale', () => {
          const number = 6000;
          const decimalPlaces = 2;
          const expected = number.toLocaleString(undefined, {
            minimumFractionDigits: decimalPlaces,
          });

          const amount = faker.finance.amount({
            min: number,
            max: number,
            dec: decimalPlaces,
            autoFormat: true,
          });

          expect(amount).toStrictEqual(expected);
        });
      });

      describe('transactionType()', () => {
        it('should return a string', () => {
          const transactionType = faker.finance.transactionType();

          expect(transactionType).toBeTypeOf('string');
        });
      });

      describe('currency()', () => {
        it('should return a valid currency object', () => {
          const currency = faker.finance.currency();
          expect(currency.code).toBeTypeOf('string');
          expect(currency.code).toMatch(/^[A-Z]{3}$/);
          expect(currency.name).toBeTypeOf('string');
          expect(currency.symbol).toBeTypeOf('string');
        });
      });

      describe('currencyCode()', () => {
        it('should return a valid three letter currency code', () => {
          const currencyCode = faker.finance.currencyCode();

          expect(currencyCode).toBeTypeOf('string');
          expect(currencyCode).toMatch(/^[A-Z]{3}$/);
        });
      });

      describe('currencyName()', () => {
        it('should return a string', () => {
          const currencyName = faker.finance.currencyName();

          expect(currencyName).toBeTypeOf('string');
        });
      });

      describe('currencySymbol()', () => {
        it('should return a string', () => {
          const currencySymbol = faker.finance.currencySymbol();

          expect(currencySymbol).toBeTypeOf('string');
        });
      });

      describe('bitcoinAddress()', () => {
        const m_legacy = /^1[A-HJ-NP-Za-km-z1-9]{25,39}$/;
        const t_legacy = /^m[A-HJ-NP-Za-km-z1-9]{25,39}$/;
        const m_segwit = /^3[A-HJ-NP-Za-km-z1-9]{25,39}$/;
        const t_segwit = /^2[A-HJ-NP-Za-km-z1-9]{25,39}$/;
        const m_bech32 = /^bc1[ac-hj-np-z02-9]{39,39}$/;
        const t_bech32 = /^tb1[ac-hj-np-z02-9]{39,39}$/;
        const m_taproot = /^bc1p[ac-hj-np-z02-9]{58,58}$/;
        const t_taproot = /^tb1p[ac-hj-np-z02-9]{58,58}$/;

        const isBtcAddress = (address: string) =>
          [
            m_legacy,
            t_legacy,
            m_segwit,
            t_segwit,
            m_bech32,
            t_bech32,
            m_taproot,
            t_taproot,
          ].some((r) => r.test(address));

        it('should return a valid bitcoin address', () => {
          const bitcoinAddress = faker.finance.bitcoinAddress();

          expect(bitcoinAddress).toBeTruthy();
          expect(bitcoinAddress).toBeTypeOf('string');
          expect(bitcoinAddress).toSatisfy(isBtcAddress);
        });

        it.each([
          [BitcoinAddressFamily.Legacy, m_legacy],
          [BitcoinAddressFamily.Segwit, m_segwit],
          [BitcoinAddressFamily.Bech32, m_bech32],
          [BitcoinAddressFamily.Taproot, m_taproot],
        ] as const)(
          'should handle the type = $type argument',
          (type, regex) => {
            const bitcoinAddress = faker.finance.bitcoinAddress({
              type,
            });

            expect(bitcoinAddress).toBeTruthy();
            expect(bitcoinAddress).toBeTypeOf('string');
            expect(bitcoinAddress).toSatisfy(isBtcAddress);
            expect(bitcoinAddress).toMatch(regex);
          }
        );

        it.each([
          [BitcoinNetwork.Mainnet, [m_legacy, m_segwit, m_bech32, m_taproot]],
          [BitcoinNetwork.Testnet, [t_legacy, t_segwit, t_bech32, t_taproot]],
        ] as const)(
          'should handle the network = $network argument',
          (network, regexes) => {
            const bitcoinAddress = faker.finance.bitcoinAddress({
              network,
            });

            expect(bitcoinAddress).toBeTruthy();
            expect(bitcoinAddress).toBeTypeOf('string');
            expect(bitcoinAddress).toSatisfy(isBtcAddress);
            expect(bitcoinAddress).toSatisfy<string>((v) =>
              regexes.some((r) => r.test(v))
            );
          }
        );

        it.each([
          [BitcoinAddressFamily.Legacy, BitcoinNetwork.Mainnet, m_legacy],
          [BitcoinAddressFamily.Legacy, BitcoinNetwork.Testnet, t_legacy],
          [BitcoinAddressFamily.Segwit, BitcoinNetwork.Mainnet, m_segwit],
          [BitcoinAddressFamily.Segwit, BitcoinNetwork.Testnet, t_segwit],
          [BitcoinAddressFamily.Bech32, BitcoinNetwork.Mainnet, m_bech32],
          [BitcoinAddressFamily.Bech32, BitcoinNetwork.Testnet, t_bech32],
          [BitcoinAddressFamily.Taproot, BitcoinNetwork.Mainnet, m_taproot],
          [BitcoinAddressFamily.Taproot, BitcoinNetwork.Testnet, t_taproot],
        ] as const)(
          'should handle the type = $type and network = $network arguments',
          (type, network, regex) => {
            const bitcoinAddress = faker.finance.bitcoinAddress({
              type,
              network,
            });

            expect(bitcoinAddress).toBeTruthy();
            expect(bitcoinAddress).toBeTypeOf('string');
            expect(bitcoinAddress).toSatisfy(isBtcAddress);
            expect(bitcoinAddress).toMatch(regex);
          }
        );
      });

      describe('litecoinAddress()', () => {
        it('should return a valid litecoin address', () => {
          const litecoinAddress = faker.finance.litecoinAddress();

          expect(litecoinAddress).toBeTypeOf('string');
          expect(litecoinAddress).toMatch(/^[LM3][1-9a-km-zA-HJ-NP-Z]{25,32}$/);
        });
      });

      describe('creditCardNumber()', () => {
        it('should return a random credit card number', () => {
          let number = faker.finance.creditCardNumber();
          number = number.replaceAll(/\D/g, ''); // remove formatting

          expect(number.length).toBeGreaterThanOrEqual(13);
          expect(number.length).toBeLessThanOrEqual(20);
          expect(number).toMatch(/^\d{13,20}$/);
          expect(number).toSatisfy(luhnCheck);
        });

        it('should return a valid credit card number', () => {
          expect(faker.finance.creditCardNumber('')).toSatisfy(luhnCheck);
          expect(faker.finance.creditCardNumber()).toSatisfy(luhnCheck);
          expect(faker.finance.creditCardNumber('visa')).toSatisfy(luhnCheck);
          expect(faker.finance.creditCardNumber('mastercard')).toSatisfy(
            luhnCheck
          );
          expect(faker.finance.creditCardNumber('discover')).toSatisfy(
            luhnCheck
          );
          expect(faker.finance.creditCardNumber()).toSatisfy(luhnCheck);
          expect(faker.finance.creditCardNumber()).toSatisfy(luhnCheck);
        });

        it('should ignore case for issuer', () => {
          const seed = faker.seed();
          const actualNonLowerCase = faker.finance.creditCardNumber('ViSa');

          faker.seed(seed);
          const actualLowerCase = faker.finance.creditCardNumber('visa');

          expect(actualNonLowerCase).toBe(actualLowerCase);
        });

        it('should return a correct credit card number when issuer provided', () => {
          //TODO: implement checks for each format with regexp
          const visa = faker.finance.creditCardNumber('visa');
          expect(visa).toMatch(/^4(([0-9]){12}|([0-9]){3}(-([0-9]){4}){3})$/);
          expect(visa).toSatisfy(luhnCheck);

          const mastercard = faker.finance.creditCardNumber('mastercard');
          expect(mastercard).toSatisfy((value) =>
            isCreditCard(value as string, { provider: 'mastercard' })
          );
          expect(mastercard).toSatisfy(luhnCheck);

          const discover = faker.finance.creditCardNumber('discover');

          expect(discover).toSatisfy(luhnCheck);

          const american_express =
            faker.finance.creditCardNumber('american_express');
          expect(american_express).toSatisfy(luhnCheck);
          const diners_club = faker.finance.creditCardNumber('diners_club');
          expect(diners_club).toSatisfy(luhnCheck);
          const jcb = faker.finance.creditCardNumber('jcb');
          expect(jcb).toSatisfy(luhnCheck);
          const maestro = faker.finance.creditCardNumber('maestro');
          expect(maestro).toSatisfy(luhnCheck);
        });

        it('should generate a valid union pay credit card', () => {
          const actual = fakerZH_CN.finance.creditCardNumber('unionpay');
          expect(actual).toSatisfy(luhnCheck);
          expect(actual).toSatisfy((value) =>
            isCreditCard(value as string, { provider: 'unionpay' })
          );
        });

        it('should return custom formatted strings', () => {
          let number = faker.finance.creditCardNumber('###-###-##L');
          expect(number).toMatch(/^\d{3}-\d{3}-\d{3}$/);
          expect(number).toSatisfy(luhnCheck);

          number = faker.finance.creditCardNumber('234[5-9]#{999}L');
          expect(number).toMatch(/^234[5-9]\d{1000}$/);
          expect(number).toSatisfy(luhnCheck);
        });
      });

      describe('creditCardIssuer()', () => {
        it('should return a string', () => {
          const issuer = faker.finance.creditCardIssuer();
          expect(issuer).toBeTypeOf('string');
          expect(Object.keys(faker.definitions.finance.credit_card)).toContain(
            issuer
          );
        });
      });

      describe('creditCardCVV()', () => {
        it('should return a valid credit card CVV', () => {
          const cvv = faker.finance.creditCardCVV();

          expect(cvv).toBeTypeOf('string');
          expect(cvv).toMatch(/\d{3}/);
          expect(
            cvv,
            'The length of the cvv should be 3 characters long'
          ).toHaveLength(3);
        });
      });

      describe('pin()', () => {
        it('should return a string', () => {
          const pin = faker.finance.pin();
          expect(pin).toBeTypeOf('string');
        });

        it('should contain only digits', () => {
          const pin = faker.finance.pin();
          expect(pin).toMatch(/^[0-9]+$/);
        });

        it('should default to a length of 4', () => {
          const pin = faker.finance.pin();
          expect(pin).toHaveLength(4);
        });

        it('should return a pin with the specified length', () => {
          const pin = faker.finance.pin(5);
          expect(pin).toHaveLength(5);
        });

        it('should throw an error when length is less than 1', () => {
          expect(() => faker.finance.pin(-5)).toThrow(/^minimum length is 1$/);
        });
      });

      describe('ethereumAddress()', () => {
        it('should return a valid ethereum address', () => {
          const ethereumAddress = faker.finance.ethereumAddress();

          expect(ethereumAddress).toBeTypeOf('string');
          expect(ethereumAddress).toMatch(/^(0x)[0-9a-f]{40}$/);
        });
      });

      describe('iban()', () => {
        it('should return a random yet formally correct IBAN number', () => {
          const iban = faker.finance.iban();
          const bban = iban.substring(4) + iban.substring(0, 4);

          expect(
            ibanLib.mod97(ibanLib.toDigitString(bban)),
            'the result should be equal to 1'
          ).toBe(1);
        });

        it('should return a specific and formally correct IBAN number', () => {
          const iban = faker.finance.iban({
            formatted: false,
            countryCode: 'DE',
          });
          const bban = iban.substring(4) + iban.substring(0, 4);
          const countryCode = iban.substring(0, 2);

          expect(countryCode).toBe('DE');
          expect(
            ibanLib.mod97(ibanLib.toDigitString(bban)),
            'the result should be equal to 1'
          ).toBe(1);
        });

        it.each(['AA', 'EU'])(
          'throws an error for unsupported country code "%s"',
          (unsupportedCountryCode) =>
            expect(() =>
              faker.finance.iban({
                formatted: false,
                countryCode: unsupportedCountryCode,
              })
            ).toThrow(
              new FakerError(
                `Country code ${unsupportedCountryCode} not supported.`
              )
            )
        );
      });

      describe('bic()', () => {
        it('should return a BIC number', () => {
          const bic = faker.finance.bic();

          expect(bic).toBeTypeOf('string');
          expect(bic).toMatch(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/);
          expect(ibanLib.iso3166).toContain(bic.substring(4, 6));
        });

        it('should return a BIC number with branch code', () => {
          const bic = faker.finance.bic({ includeBranchCode: true });

          expect(bic).toBeTypeOf('string');
          expect(bic).toMatch(/^[A-Z]{6}[A-Z0-9]{2}[A-Z0-9]{3}$/);
          expect(ibanLib.iso3166).toContain(bic.substring(4, 6));
        });
      });

      describe('transactionDescription()', () => {
        it('should return a string', () => {
          const transactionDescription = faker.finance.transactionDescription();

          expect(transactionDescription).toBeTypeOf('string');
        });
      });
    }
  );
});
