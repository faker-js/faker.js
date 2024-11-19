import { isEmail, isHexadecimal, isSlug } from 'validator';
import { describe, expect, it } from 'vitest';
import { faker } from '../../src';
import { seededTests } from '../support/seeded-runs';
import { times } from './../support/times';

const NON_SEEDED_BASED_RUN = 5;

const refDate = '2020-01-01T00:00:00.000Z';

function isValidCommitAuthor(email: string): boolean {
  // `validator.isEmail()` does not support display names
  // that contain unquoted characters like . output by Git so we need
  // to quote the display name
  const quotedEmail = email.replace(/^(.*) </, '"$1" <');
  return isEmail(quotedEmail, {
    require_display_name: true,
  });
}

describe('git', () => {
  seededTests(faker, 'git', (t) => {
    t.itEach('branch', 'commitMessage');

    t.describe('commitSha', (t) => {
      t.it('noArgs')
        .it('with length 7', { length: 7 })
        .it('with length 8', { length: 8 });
    });

    t.describeEach(
      'commitEntry',
      'commitDate'
    )((t) => {
      t.it('with only string refDate', { refDate })
        .it('with only Date refDate', { refDate: new Date(refDate) })
        .it('with only number refDate', {
          refDate: new Date(refDate).getTime(),
        });
    });
  });

  describe.each(times(NON_SEEDED_BASED_RUN).map(() => faker.seed()))(
    'random seeded tests for seed %i',
    () => {
      describe('branch()', () => {
        it('should return a random branch', () => {
          const branch = faker.git.branch();

          expect(branch).toBeTruthy();
          expect(branch).toBeTypeOf('string');
          expect(branch).toSatisfy(isSlug);
        });
      });

      describe('commitEntry', () => {
        it('should return a valid random commitEntry', () => {
          const commitEntry = faker.git.commitEntry();

          expect(commitEntry).toBeTruthy();
          expect(commitEntry).toBeTypeOf('string');

          const parts = commitEntry.split(/\r?\n/);

          expect(parts.length).toBeGreaterThanOrEqual(6);
          expect(parts.length).toBeLessThanOrEqual(7);

          expect(parts[0]).toMatch(/^commit [a-f0-9]+$/);

          const authorRegex = /^Author: .*$/;
          if (parts.length === 7) {
            expect(parts[1]).toMatch(/^Merge: [a-f0-9]+ [a-f0-9]+$/);
            expect(parts[2]).toMatch(authorRegex);
            expect(parts[2].substring(8)).toSatisfy(isValidCommitAuthor);
            expect(parts[3]).toMatch(/^Date: .+$/);
            expect(parts[4]).toBe('');
            expect(parts[5]).toMatch(/^\s{4}.+$/);
          } else {
            expect(parts[1]).toMatch(authorRegex);
            expect(parts[1].substring(8)).toSatisfy(isValidCommitAuthor);
            expect(parts[2]).toMatch(/^Date: .+$/);
            expect(parts[3]).toBe('');
            expect(parts[4]).toMatch(/^\s{4}.+$/);
          }
        });

        it('should return a random commitEntry with a default end of line character of "\r\n"', () => {
          const commitEntry = faker.git.commitEntry();
          const parts = commitEntry.split('\r\n');

          expect(parts.length).toBeGreaterThanOrEqual(6);
          expect(parts.length).toBeLessThanOrEqual(7);
        });

        it('should return a random commitEntry with a configured end of line character of "\r\n" with eol = CRLF', () => {
          const commitEntry = faker.git.commitEntry({
            eol: 'CRLF',
          });
          const parts = commitEntry.split('\r\n');

          expect(parts.length).toBeGreaterThanOrEqual(6);
          expect(parts.length).toBeLessThanOrEqual(7);
        });

        it('should return a random commitEntry with a configured end of line character of "\n" with eol = LF', () => {
          const commitEntry = faker.git.commitEntry({
            eol: 'LF',
          });
          const parts = commitEntry.split('\n');

          expect(parts.length).toBeGreaterThanOrEqual(6);
          expect(parts.length).toBeLessThanOrEqual(7);

          expect(commitEntry).not.contains('\r\n');
        });
      });

      describe('commitMessage', () => {
        it('should return a random commitMessage', () => {
          const commitMessage = faker.git.commitMessage();

          expect(commitMessage).toBeTruthy();
          expect(commitMessage).toBeTypeOf('string');

          const parts = commitMessage.split(' ');
          expect(parts.length).toBeGreaterThanOrEqual(3);
        });
      });

      describe('commitDate', () => {
        it('should return a random commitDate', () => {
          const commitDate = faker.git.commitDate();

          expect(commitDate).toBeTruthy();
          expect(commitDate).toBeTypeOf('string');

          const parts = commitDate.split(' ');
          expect(parts).toHaveLength(6);
        });
      });

      describe('commitSha', () => {
        it('should return a random full commitSha', () => {
          const commitSha = faker.git.commitSha();

          expect(commitSha).toBeTruthy();
          expect(commitSha).toBeTypeOf('string');
          expect(commitSha).toSatisfy(isHexadecimal);
          expect(commitSha).toHaveLength(40);
        });

        it.each([
          ['GitHub', 7],
          ['GitLab', 8],
        ])(
          'should return a random short commitSha for %s',
          (_provider, length) => {
            const commitSha = faker.git.commitSha({ length });

            expect(commitSha).toBeTruthy();
            expect(commitSha).toBeTypeOf('string');
            expect(commitSha).toSatisfy(isHexadecimal);
            expect(commitSha).toHaveLength(length);
          }
        );
      });
    }
  );
});
