/* eslint-disable no-undef -- This file serves as a compatibility layer between environments */
/**
 * This works the same as `Buffer.from(input).toString('base64')`
 * to work on both Node.js and browser environment.
 *
 * @internal
 *
 * @param input The string to encode to Base64.
 *
 * @returns Base64 encoded string.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648
 *
 * @example const encodedHeader = toBase64(JSON.stringify(header));
 */
export const toBase64: (input: string) => string =
  typeof Buffer === 'undefined'
    ? (input) => {
        const utf8Bytes = new TextEncoder().encode(input);
        const binaryString = Array.from(utf8Bytes, (byte) =>
          String.fromCodePoint(byte)
        ).join('');
        return btoa(binaryString);
      }
    : (input) => Buffer.from(input).toString('base64');

/**
 * This works the same as `Buffer.from(input).toString('base64url')`
 * to work on both Node.js and browser environment.
 *
 * @internal
 *
 * @param input The string to encode to Base64 URL.
 *
 * @returns Base64 URL encoded string.
 *
 * @see https://datatracker.ietf.org/doc/html/rfc4648
 *
 * @example const encodedHeader = toBase64Url(JSON.stringify(header));
 */
export const toBase64Url: (input: string) => string =
  typeof Buffer === 'undefined'
    ? (input) =>
        toBase64(input)
          .replaceAll('+', '-')
          .replaceAll('/', '_')
          .replaceAll(/=+$/g, '')
    : (input) => Buffer.from(input).toString('base64url');
