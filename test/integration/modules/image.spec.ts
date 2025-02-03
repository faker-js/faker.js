/*
 * Integration tests for the image methods ensuring that the returned urls work.
 */
import https from 'node:https';
import { resolve as urlResolve } from 'node:url';
import { describe, expect, it } from 'vitest';
import { faker } from '../../../src';

/**
 * Checks that the given address is a working https address.
 *
 * An address is considered working, if it:
 *
 * - is a string
 * - starts with https
 * - is a proper url
 * - returns a http-200 (after redirects)
 *
 * There is a separate unit test file for checking if the returned URL matches the expectations (domain, parameters, etc.).
 *
 * @param address The address to check.
 */
async function assertWorkingUrl(address: string): Promise<void> {
  expect(address).toBeTypeOf('string');
  expect(address).toMatch(/^https:\/\//);
  expect(() => new URL(address)).not.toThrow();

  await expect(
    new Promise((resolve, reject) => {
      https
        .get(address, ({ statusCode, headers: { location } }) => {
          if (statusCode == null) {
            reject(new Error(`No StatusCode, expected 200 for '${address}'`));
          } else if (statusCode === 200) {
            resolve(true);
          } else if (statusCode >= 300 && statusCode < 400 && location) {
            const newAddress = urlResolve(address, location);
            assertWorkingUrl(newAddress)
              .then(() => resolve(true))
              .catch((error: unknown) => {
                reject(
                  new Error(`Failed to resolve redirect to '${location}'`, {
                    cause: error,
                  })
                );
              });
          } else {
            reject(
              new Error(
                `Bad StatusCode ${statusCode} expected 200 for '${address}'`
              )
            );
          }
        })
        .on('error', (error: unknown) => {
          reject(new Error(`Failed to get '${address}'`, { cause: error }));
        });
    })
  ).resolves.toBe(true);
}

describe('image', () => {
  describe('avatar', () => {
    it('should return a random avatar url', async () => {
      const actual = faker.image.avatar();
      await assertWorkingUrl(actual);
    });
  });

  describe('avatarGitHub', () => {
    it('should return a random avatar url from GitHub', async () => {
      const actual = faker.image.avatarGitHub();
      await assertWorkingUrl(actual);
    });
  });

  describe('url', () => {
    it('should return a random image url', async () => {
      const actual = faker.image.url();
      await assertWorkingUrl(actual);
    });

    it('should return a random image url with a width', async () => {
      const actual = faker.image.url({ width: 100 });
      await assertWorkingUrl(actual);
    });

    it('should return a random image url with a height', async () => {
      const actual = faker.image.url({ height: 100 });
      await assertWorkingUrl(actual);
    });

    it('should return a random image url with a width and height', async () => {
      const actual = faker.image.url({ width: 128, height: 64 });
      await assertWorkingUrl(actual);
    });
  });

  describe('urlLoremFlickr', () => {
    it('should return a random image url from LoremFlickr', async () => {
      const actual = faker.image.urlLoremFlickr();
      await assertWorkingUrl(actual);
    });
  });

  describe('urlPicsumPhotos', () => {
    it('should return a random image url from PicsumPhotos', async () => {
      const actual = faker.image.urlPicsumPhotos();
      await assertWorkingUrl(actual);
    });
  });

  describe('urlPlaceholder', () => {
    it('should return a random image url from Placeholder', async () => {
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      const actual = faker.image.urlPlaceholder();
      await assertWorkingUrl(actual);
    });
  });
});
