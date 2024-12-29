import { FakerError } from '../../errors/faker-error';
import { ModuleBase } from '../../internal/module-base';
import { filterWordListByLength } from './filter-word-list-by-length';

/**
 * Module to return various types of words.
 */
export class WordModule extends ModuleBase {
  /**
   * Returns a random adjective.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * Defaults to `'any-length'`.
   *
   * @example
   * faker.word.adjective() // 'negligible'
   * faker.word.adjective(5) // 'short'
   * faker.word.adjective(100) // 'perky'
   * faker.word.adjective({ strategy: 'shortest' }) // 'mad'
   * faker.word.adjective({ length: { min: 5, max: 7 }, strategy: "fail" }) // 'likable'
   *
   * @since 6.0.0
   */
  adjective(
    options:
      | number
      | {
          /**
           * The expected length of the word.
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the word.
                 */
                min: number;
                /**
                 * The maximum length of the word.
                 */
                max: number;
              };
          /**
           * The strategy to apply when no words with a matching length are found.
           *
           * Available error handling strategies:
           *
           * - `fail`: Throws an error if no words with the given length are found.
           * - `shortest`: Returns any of the shortest words.
           * - `closest`: Returns any of the words closest to the given length.
           * - `longest`: Returns any of the longest words.
           * - `any-length`: Returns a word with any length.
           *
           * @default 'any-length'
           */
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = { length: options };
    }

    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...options,
        wordList: this.faker.definitions.word.adjective,
      })
    );
  }

  /**
   * Returns a random adverb.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * Defaults to `'any-length'`.
   *
   * @example
   * faker.word.adverb() // 'often'
   * faker.word.adverb(5) // 'sadly'
   * faker.word.adverb(100) // 'promptly'
   * faker.word.adverb({ strategy: 'shortest' }) // 'not'
   * faker.word.adverb({ length: { min: 5, max: 7 }, strategy: "fail" }) // 'likely'
   *
   * @since 6.0.0
   */
  adverb(
    options:
      | number
      | {
          /**
           * The expected length of the word.
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the word.
                 */
                min: number;
                /**
                 * The maximum length of the word.
                 */
                max: number;
              };
          /**
           * The strategy to apply when no words with a matching length are found.
           *
           * Available error handling strategies:
           *
           * - `fail`: Throws an error if no words with the given length are found.
           * - `shortest`: Returns any of the shortest words.
           * - `closest`: Returns any of the words closest to the given length.
           * - `longest`: Returns any of the longest words.
           * - `any-length`: Returns a word with any length.
           *
           * @default 'any-length'
           */
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = { length: options };
    }

    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...options,
        wordList: this.faker.definitions.word.adverb,
      })
    );
  }

  /**
   * Returns a random conjunction.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * Defaults to `'any-length'`.
   *
   * @example
   * faker.word.conjunction() // 'provided'
   * faker.word.conjunction(5) // 'which'
   * faker.word.conjunction(100) // 'supposing'
   * faker.word.conjunction({ strategy: 'shortest' }) // 'or'
   * faker.word.conjunction({ length: { min: 5, max: 7 }, strategy: "fail" }) // 'since'
   *
   * @since 6.0.0
   */
  conjunction(
    options:
      | number
      | {
          /**
           * The expected length of the word.
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the word.
                 */
                min: number;
                /**
                 * The maximum length of the word.
                 */
                max: number;
              };
          /**
           * The strategy to apply when no words with a matching length are found.
           *
           * Available error handling strategies:
           *
           * - `fail`: Throws an error if no words with the given length are found.
           * - `shortest`: Returns any of the shortest words.
           * - `closest`: Returns any of the words closest to the given length.
           * - `longest`: Returns any of the longest words.
           * - `any-length`: Returns a word with any length.
           *
           * @default 'any-length'
           */
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = { length: options };
    }

    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...options,
        wordList: this.faker.definitions.word.conjunction,
      })
    );
  }

  /**
   * Returns a random interjection.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * Defaults to `'any-length'`.
   *
   * @example
   * faker.word.interjection() // 'ugh'
   * faker.word.interjection(5) // 'yahoo'
   * faker.word.interjection(100) // 'eek'
   * faker.word.interjection({ strategy: 'shortest' }) // 'aw'
   * faker.word.interjection({ length: { min: 5, max: 7 }, strategy: "fail" }) // 'boohoo'
   *
   * @since 6.0.0
   */
  interjection(
    options:
      | number
      | {
          /**
           * The expected length of the word.
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the word.
                 */
                min: number;
                /**
                 * The maximum length of the word.
                 */
                max: number;
              };
          /**
           * The strategy to apply when no words with a matching length are found.
           *
           * Available error handling strategies:
           *
           * - `fail`: Throws an error if no words with the given length are found.
           * - `shortest`: Returns any of the shortest words.
           * - `closest`: Returns any of the words closest to the given length.
           * - `longest`: Returns any of the longest words.
           * - `any-length`: Returns a word with any length.
           *
           * @default 'any-length'
           */
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = { length: options };
    }

    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...options,
        wordList: this.faker.definitions.word.interjection,
      })
    );
  }

  /**
   * Returns a random noun.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * Defaults to `'any-length'`.
   *
   * @example
   * faker.word.noun() // 'mantua'
   * faker.word.noun(5) // 'slide'
   * faker.word.noun(100) // 'newsletter'
   * faker.word.noun({ strategy: 'shortest' }) // 'ad'
   * faker.word.noun({ length: { min: 5, max: 7 }, strategy: "fail" }) // 'jungle'
   *
   * @since 6.0.0
   */
  noun(
    options:
      | number
      | {
          /**
           * The expected length of the word.
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the word.
                 */
                min: number;
                /**
                 * The maximum length of the word.
                 */
                max: number;
              };
          /**
           * The strategy to apply when no words with a matching length are found.
           *
           * Available error handling strategies:
           *
           * - `fail`: Throws an error if no words with the given length are found.
           * - `shortest`: Returns any of the shortest words.
           * - `closest`: Returns any of the words closest to the given length.
           * - `longest`: Returns any of the longest words.
           * - `any-length`: Returns a word with any length.
           *
           * @default 'any-length'
           */
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = { length: options };
    }

    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...options,
        wordList: this.faker.definitions.word.noun,
      })
    );
  }

  /**
   * Returns a random preposition.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * Defaults to `'any-length'`.
   *
   * @example
   * faker.word.preposition() // 'like'
   * faker.word.preposition(5) // 'round'
   * faker.word.preposition(100) // 'next'
   * faker.word.preposition({ strategy: 'shortest' }) // 'a'
   * faker.word.preposition({ length: { min: 5, max: 7 }, strategy: "fail" }) // 'circa'
   *
   * @since 6.0.0
   */
  preposition(
    options:
      | number
      | {
          /**
           * The expected length of the word.
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the word.
                 */
                min: number;
                /**
                 * The maximum length of the word.
                 */
                max: number;
              };
          /**
           * The strategy to apply when no words with a matching length are found.
           *
           * Available error handling strategies:
           *
           * - `fail`: Throws an error if no words with the given length are found.
           * - `shortest`: Returns any of the shortest words.
           * - `closest`: Returns any of the words closest to the given length.
           * - `longest`: Returns any of the longest words.
           * - `any-length`: Returns a word with any length.
           *
           * @default 'any-length'
           */
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = { length: options };
    }

    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...options,
        wordList: this.faker.definitions.word.preposition,
      })
    );
  }

  /**
   * Returns a random verb.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * Defaults to `'any-length'`.
   *
   * @example
   * faker.word.verb() // 'nauseate'
   * faker.word.verb(5) // 'slump'
   * faker.word.verb(100) // 'pause'
   * faker.word.verb({ strategy: 'shortest' }) // 'pip'
   * faker.word.verb({ length: { min: 5, max: 7 }, strategy: "fail" }) // 'implode'
   *
   * @since 6.0.0
   */
  verb(
    options:
      | number
      | {
          /**
           * The expected length of the word.
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the word.
                 */
                min: number;
                /**
                 * The maximum length of the word.
                 */
                max: number;
              };
          /**
           * The strategy to apply when no words with a matching length are found.
           *
           * Available error handling strategies:
           *
           * - `fail`: Throws an error if no words with the given length are found.
           * - `shortest`: Returns any of the shortest words.
           * - `closest`: Returns any of the words closest to the given length.
           * - `longest`: Returns any of the longest words.
           * - `any-length`: Returns a word with any length.
           *
           * @default 'any-length'
           */
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = { length: options };
    }

    return this.faker.helpers.arrayElement(
      filterWordListByLength({
        ...options,
        wordList: this.faker.definitions.word.verb,
      })
    );
  }

  /**
   * Returns a random word, that can be an adjective, adverb, conjunction, interjection, noun, preposition, or verb.
   *
   * @param options The expected length of the word or the options to use.
   * @param options.length The expected length of the word.
   * @param options.strategy The strategy to apply when no words with a matching length are found.
   *
   * Available error handling strategies:
   *
   * - `fail`: Throws an error if no words with the given length are found.
   * - `shortest`: Returns any of the shortest words.
   * - `closest`: Returns any of the words closest to the given length.
   * - `longest`: Returns any of the longest words.
   * - `any-length`: Returns a word with any length.
   *
   * Defaults to `'any-length'`.
   *
   * @example
   * faker.word.sample() // 'jealous'
   * faker.word.sample(5) // 'weird'
   *
   * @since 8.0.0
   */
  sample(
    options:
      | number
      | {
          /**
           * The expected length of the word.
           */
          length?:
            | number
            | {
                /**
                 * The minimum length of the word.
                 */
                min: number;
                /**
                 * The maximum length of the word.
                 */
                max: number;
              };
          /**
           * The strategy to apply when no words with a matching length are found.
           *
           * Available error handling strategies:
           *
           * - `fail`: Throws an error if no words with the given length are found.
           * - `shortest`: Returns any of the shortest words.
           * - `closest`: Returns any of the words closest to the given length.
           * - `longest`: Returns any of the longest words.
           * - `any-length`: Returns a word with any length.
           *
           * @default 'any-length'
           */
          strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
        } = {}
  ): string {
    const wordMethods = this.faker.helpers.shuffle([
      this.adjective,
      this.adverb,
      this.conjunction,
      this.interjection,
      this.noun,
      this.preposition,
      this.verb,
    ]);

    for (const randomWordMethod of wordMethods) {
      try {
        return randomWordMethod(options);
      } catch {
        // catch missing locale data potentially required by randomWordMethod
        continue;
      }
    }

    throw new FakerError(
      'No matching word data available for the current locale'
    );
  }

  /**
   * Returns a random string containing some words separated by spaces.
   *
   * @param options The optional options object or the number of words to return.
   * @param options.count The number of words to return. Defaults to a random value between `1` and `3`.
   *
   * @example
   * faker.word.words() // 'tapioca blaring'
   * faker.word.words(5) // 'the mismatch plagiarise past interestingly'
   * faker.word.words({ count: 5 }) // 'reassuringly amongst wedge colorfully orientate'
   * faker.word.words({ count: { min: 5, max: 10 } }) // 'ceramic yuck supposing friendly serpentine if'
   *
   * @since 8.0.0
   */
  words(
    options:
      | number
      | {
          /**
           * The number of words to return.
           *
           * @default { min: 1, max: 3 }
           */
          count?:
            | number
            | {
                /**
                 * The minimum number of words to return.
                 */
                min: number;
                /**
                 * The maximum number of words to return.
                 */
                max: number;
              };
        } = {}
  ): string {
    if (typeof options === 'number') {
      options = { count: options };
    }

    const { count = { min: 1, max: 3 } } = options;

    return this.faker.helpers
      .multiple(() => this.sample(), { count })
      .join(' ');
  }
}
