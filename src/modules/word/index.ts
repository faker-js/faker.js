import type { Faker } from '../..';
import { filterWordListByLength } from './filterWordListByLength';

/**
 * Module to return various types of words.
 */
export class WordModule {
  constructor(private readonly faker: Faker) {
    // Bind `this` so namespaced is working correctly
    for (const name of Object.getOwnPropertyNames(WordModule.prototype)) {
      if (name === 'constructor' || typeof this[name] !== 'function') {
        continue;
      }
      this[name] = this[name].bind(this);
    }
  }

  /**
   * Returns an adjective of random or optionally specified length.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found. Defaults to 'any-length'.
   *
   * @example
   * faker.word.adjective() // 'pungent'
   * faker.word.adjective(5) // 'slimy'
   * faker.word.adjective(100) // 'complete'
   *
   * @since 6.0.0
   */
  adjective(
    options:
      | number
      | {
          length?: number | { min: number; max: number };
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    const opts = typeof options === 'number' ? { length: options } : options;
    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...opts,
        wordList: this.faker.definitions.word.adjective,
      })
    );
  }

  /**
   * Returns an adverb of random or optionally specified length.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found. Defaults to 'any-length'.
   *
   * @example
   * faker.word.adverb() // 'quarrelsomely'
   * faker.word.adverb(5) // 'madly'
   * faker.word.adverb(100) // 'sadly'
   *
   * @since 6.0.0
   */
  adverb(
    options:
      | number
      | {
          length?: number | { min: number; max: number };
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    const opts = typeof options === 'number' ? { length: options } : options;
    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...opts,
        wordList: this.faker.definitions.word.adverb,
      })
    );
  }

  /**
   * Returns a conjunction of random or optionally specified length.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found. Defaults to 'any-length'.
   *
   * @example
   * faker.word.conjunction() // 'in order that'
   * faker.word.conjunction(5) // 'since'
   * faker.word.conjunction(100) // 'as long as'
   *
   * @since 6.0.0
   */
  conjunction(
    options:
      | number
      | {
          length?: number | { min: number; max: number };
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    const opts = typeof options === 'number' ? { length: options } : options;
    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...opts,
        wordList: this.faker.definitions.word.conjunction,
      })
    );
  }

  /**
   * Returns an interjection of random or optionally specified length.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found. Defaults to 'any-length'.
   *
   * @example
   * faker.word.interjection() // 'gah'
   * faker.word.interjection(5) // 'fooey'
   * faker.word.interjection(100) // 'yowza'
   *
   * @since 6.0.0
   */
  interjection(
    options:
      | number
      | {
          length?: number | { min: number; max: number };
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    const opts = typeof options === 'number' ? { length: options } : options;
    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...opts,
        wordList: this.faker.definitions.word.interjection,
      })
    );
  }

  /**
   * Returns a noun of random or optionally specified length.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found. Defaults to 'any-length'.
   *
   * @example
   * faker.word.noun() // 'external'
   * faker.word.noun(5) // 'front'
   * faker.word.noun(100) // 'care'
   *
   * @since 6.0.0
   */
  noun(
    options:
      | number
      | {
          length?: number | { min: number; max: number };
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    const opts = typeof options === 'number' ? { length: options } : options;
    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...opts,
        wordList: this.faker.definitions.word.noun,
      })
    );
  }

  /**
   * Returns a preposition of random or optionally specified length.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found. Defaults to 'any-length'.
   *
   * @example
   * faker.word.preposition() // 'without'
   * faker.word.preposition(5) // 'abaft'
   * faker.word.preposition(100) // 'an'
   *
   * @since 6.0.0
   */
  preposition(
    options:
      | number
      | {
          length?: number | { min: number; max: number };
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    const opts = typeof options === 'number' ? { length: options } : options;
    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...opts,
        wordList: this.faker.definitions.word.preposition,
      })
    );
  }

  /**
   * Returns a verb of random or optionally specified length.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found. Defaults to 'any-length'.
   *
   * @example
   * faker.word.verb() // 'act'
   * faker.word.verb(5) // 'tinge'
   * faker.word.verb(100) // 'mess'
   *
   * @since 6.0.0
   */
  verb(
    options:
      | number
      | {
          length?: number | { min: number; max: number };
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    const opts = typeof options === 'number' ? { length: options } : options;
    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...opts,
        wordList: this.faker.definitions.word.verb,
      })
    );
  }
}
