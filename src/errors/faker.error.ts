/**
 * An error instance that will be thrown by faker.
 */
export class FakerError extends Error {
  constructor(message: string) {
    super(message);
  }
}
