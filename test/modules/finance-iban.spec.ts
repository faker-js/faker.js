import { isIBAN } from 'validator';
import { describe, expect, it } from 'vitest';
import { faker } from '../../src';
import { prettyPrintIban } from '../../src/modules/finance';
import ibanLib from '../../src/modules/finance/iban';
import { times } from '../support/times';

const NON_SEEDED_BASED_RUN = 25;

describe('finance_iban', () => {
  describe('generic IBAN country checks', () => {
    it.each(ibanLib.formats.map((entry) => entry.country))('%s', (country) => {
      expect(country).toMatch(/^[A-Z]{2}$/);
      const actual = faker.finance.iban({
        formatted: true,
        countryCode: country,
      });

      expect(actual).toMatch(new RegExp(`^${country}`));
      expect(actual).toSatisfy(isIBAN);
    });
  });

  describe.each(times(NON_SEEDED_BASED_RUN).map(() => faker.seed()))(
    'random seeded tests for seed %i',
    () => {
      describe('specific IBAN country checks', () => {
        it('IBAN for Georgia is correct', () => {
          // Georgia
          // https://transferwise.com/fr/iban/georgia
          // Length 22
          // BBAN 2c,16n
          // GEkk bbcc cccc cccc cccc cc
          // b = National bank code (alpha)
          // c = Account number

          // example IBAN GE29 NB00 0000 0101 9049 17

          const iban = faker.finance.iban({
            formatted: false,
            countryCode: 'GE',
          });

          expect(iban).toSatisfy(isIBAN);

          const ibanFormatted = prettyPrintIban(iban);
          const bban = iban.substring(4) + iban.substring(0, 4);

          expect(
            22,
            `GE IBAN would be 22 chars length, given is ${iban.length}`
          ).toBe(iban.length);

          expect(
            iban.substring(0, 2),
            `${iban.substring(
              0,
              2
            )} must contains only characters in GE IBAN ${ibanFormatted}`
          ).toMatch(/^[A-Z]{2}$/);
          expect(
            iban.substring(2, 4),
            `${iban.substring(
              2,
              4
            )} must contains only digits in GE IBAN ${ibanFormatted}`
          ).toMatch(/^\d{2}$/);
          expect(
            iban.substring(4, 6),
            `${iban.substring(
              4,
              6
            )} must contains only characters in GE IBAN ${ibanFormatted}`
          ).toMatch(/^[A-Z]{2}$/);
          expect(
            iban.substring(6, 24),
            `${iban.substring(
              6,
              24
            )} must contains only digits in GE IBAN ${ibanFormatted}`
          ).toMatch(/^\d{16}$/);

          expect(
            ibanLib.mod97(ibanLib.toDigitString(bban)),
            'the result should be equal to 1'
          ).toBe(1);
        });

        it('IBAN for Pakistan is correct', () => {
          // https://transferwise.com/fr/iban/pakistan
          // Example IBAN Pakistan
          // PK36SCBL0000001123456702
          // IBAN en format imprimé
          // PK36 SCBL 0000 0011 2345 6702
          // Code pays 2 alpha
          // PK
          // Key 2 digits
          // Bank Code 4 alpha
          // Account Code 16 digits
          // Total Length 24 chars

          const iban = faker.finance.iban({
            formatted: false,
            countryCode: 'PK',
          });

          expect(iban).toSatisfy(isIBAN);

          const ibanFormated = prettyPrintIban(iban);
          const bban = iban.substring(4) + iban.substring(0, 4);

          expect(
            24,
            `PK IBAN would be 24 chars length, given is ${iban.length}`
          ).toBe(iban.length);

          expect(
            iban.substring(0, 2),
            `${iban.substring(
              0,
              2
            )} must contains only characters in PK IBAN ${ibanFormated}`
          ).toMatch(/^[A-Z]{2}$/);
          expect(
            iban.substring(2, 4),
            `${iban.substring(
              2,
              4
            )} must contains only digits in PK IBAN ${ibanFormated}`
          ).toMatch(/^\d{2}$/);
          expect(
            iban.substring(4, 8),
            `${iban.substring(
              4,
              8
            )} must contains only characters in PK IBAN ${ibanFormated}`
          ).toMatch(/^[A-Z]{4}$/);
          expect(
            iban.substring(8, 24),
            `${iban.substring(
              8,
              24
            )} must contains only digits in PK IBAN ${ibanFormated}`
          ).toMatch(/^\d{16}$/);

          expect(
            ibanLib.mod97(ibanLib.toDigitString(bban)),
            'the result should be equal to 1'
          ).toBe(1);
        });

        it('IBAN for Turkish is correct', () => {
          // https://transferwise.com/fr/iban/turkey
          // Un IBAN en Turquie est constitué de 26 caractères :
          //
          //   Code pays à 2 lettres
          //   Clé de contrôle à 2 chiffres
          //   5 caractères du SWIFT/BIC de la banque
          //   Code à 1 chiffres pour le code national
          //   Code à 16 chiffres pour le numéro de compte bancaire
          //   Vous avez déjà un code IBAN ?
          //
          //   Exemple d'IBAN en Turquie	TR330006100519786457841326
          //   IBAN en format imprimé	TR33 0006 1005 1978 6457 8413 26
          //   Code pays	TR
          //   Clé de contrôle	33
          //   Code banque	00061
          //   Chiffre d'indicatif national	0
          //   Numéro de compte bancaire	0519786457841326

          const iban = faker.finance.iban({
            formatted: false,
            countryCode: 'TR',
          });

          expect(iban).toSatisfy(isIBAN);

          const ibanFormated = prettyPrintIban(iban);
          const bban = iban.substring(4) + iban.substring(0, 4);

          expect(
            26,
            `PK IBAN would be 26 chars length, given is ${iban.length}`
          ).toBe(iban.length);

          expect(
            iban.substring(0, 2),
            `Country Code:${iban.substring(
              0,
              2
            )} must contains only characters in PK IBAN ${ibanFormated}`
          ).toMatch(/^[A-Z]{2}$/);
          expect(
            iban.substring(2, 4),
            `Control key:${iban.substring(
              2,
              4
            )} must contains only digits in PK IBAN ${ibanFormated}`
          ).toMatch(/^\d{2}$/);
          expect(
            iban.substring(4, 9),
            `Swift Bank Code:${iban.substring(
              4,
              9
            )} must contains only digits in PK IBAN ${ibanFormated}`
          ).toMatch(/^\d{5}$/);
          expect(
            iban.substring(9, 10),
            `National Digit:${iban.substring(
              9,
              10
            )} must contains only digits in PK IBAN ${ibanFormated}`
          ).toMatch(/^\d{1}$/);
          expect(
            iban.substring(10, 26),
            `Account Code:${iban.substring(
              10,
              26
            )} must contains only digits in PK IBAN ${ibanFormated}`
          ).toMatch(/^\d{16}$/);

          expect(
            iban.substring(2, 26),
            `No character after TR ${ibanFormated}`
          ).toMatch(/^\d{24}$/);

          expect(
            ibanLib.mod97(ibanLib.toDigitString(bban)),
            'the result should be equal to 1'
          ).toBe(1);
        });

        it('IBAN for Azerbaijan is correct', () => {
          // Azerbaijan
          // https://transferwise.com/fr/iban/azerbaijan
          // Length 28
          // BBAN 4c,20n
          // GEkk bbbb cccc cccc cccc cccc cccc
          // b = National bank code (alpha)
          // c = Account number

          // example IBAN AZ21 NABZ 0000 0000 1370 1000 1944

          const iban = faker.finance.iban({
            formatted: false,
            countryCode: 'AZ',
          });

          expect(iban).toSatisfy(isIBAN);

          const ibanFormated = prettyPrintIban(iban);
          const bban = iban.substring(4) + iban.substring(0, 4);

          expect(
            28,
            `AZ IBAN would be 28 chars length, given is ${iban.length}`
          ).toBe(iban.length);

          expect(
            iban.substring(0, 2),
            `${iban.substring(
              0,
              2
            )} must contains only characters in AZ IBAN ${ibanFormated}`
          ).toMatch(/^[A-Z]{2}$/);
          expect(
            iban.substring(2, 4),
            `${iban.substring(
              2,
              4
            )} must contains only digits in AZ IBAN ${ibanFormated}`
          ).toMatch(/^\d{2}$/);
          expect(
            iban.substring(4, 8),
            `${iban.substring(
              4,
              8
            )} must contains only characters in AZ IBAN ${ibanFormated}`
          ).toMatch(/^[A-Z]{4}$/);
          expect(
            iban.substring(8, 28),
            `${iban.substring(
              8,
              28
            )} must contains 20 digits in AZ IBAN ${ibanFormated}`
          ).toMatch(/^\d{20}$/);

          expect(
            ibanLib.mod97(ibanLib.toDigitString(bban)),
            'the result should be equal to 1'
          ).toBe(1);
        });

        it('IBAN for Costa Rica is correct', () => {
          // Costa Rica
          // https://wise.com/us/iban/costa-rica
          // Length 22
          // BBAN 1n,3n,14n
          // CRkk xbbb cccc cccc cccc cccc cccc
          // x = reserve digit
          // b = National bank code (digits)
          // c = Account number (digits)

          // example IBAN CR05 0152 0200 1026 2840 66

          const iban = faker.finance.iban({
            formatted: false,
            countryCode: 'CR',
          });

          expect(iban).toSatisfy(isIBAN);

          const ibanFormated = prettyPrintIban(iban);
          const bban = iban.substring(4) + iban.substring(0, 4);

          expect(
            22,
            `CR IBAN would be 22 chars length, given is ${iban.length}`
          ).toBe(iban.length);

          expect(
            iban.substring(0, 2),
            `${iban.substring(
              0,
              2
            )}must start with 'CR' in CR IBAN ${ibanFormated}`
          ).toBe('CR');

          expect(
            iban.substring(2, 22),
            `${iban.substring(
              2,
              22
            )} must contains only digits in AZ IBAN ${ibanFormated}`
          ).toMatch(/^\d{20}$/);

          expect(
            ibanLib.mod97(ibanLib.toDigitString(bban)),
            'the result should be equal to 1'
          ).toBe(1);
        });

        it('IBAN for Albania is correct', () => {
          // Albania
          // https://wise.com/gb/iban/albania
          //
          // example Albania IBAN: AL64 0650 0752 4840 3787 O431 31W3
          // Length 28
          // BBAN 2c,26n
          // AL
          // Check digits 	        2 digits
          // Bank code 	            3 digits
          // Branch code            4 digits
          // National check digit   1 digit
          // Bank account number    16 digit

          const iban = faker.finance.iban({
            formatted: false,
            countryCode: 'AL',
          });
          const ibanFormated = prettyPrintIban(iban);

          expect(iban).toSatisfy(isIBAN);

          expect(
            28,
            `AL IBAN would be 28 chars length, given is ${iban.length}`
          ).toBe(iban.length);

          expect(
            34,
            `AL formatted IBAN would be 34 chars length, given is ${ibanFormated.length}`
          ).toBe(ibanFormated.length);

          expect(
            iban.substring(0, 2),
            `First two character should be AL, given is ${iban.substring(0, 2)}`
          ).toBe('AL');
        });
      });
    }
  );
});
