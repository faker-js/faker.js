import { FakerError } from '../../errors/faker-error';
import { groupBy } from '../../internal/group-by';

/**
 * The error handling strategies for the `filterWordListByLength` function.
 *
 * Always returns a new array.
 */
const STRATEGIES = {
  fail: () => {
    throw new FakerError('No words found that match the given length.');
  },
  closest: (
    wordList: ReadonlyArray<string>,
    length: { min: number; max: number }
  ): string[] => {
    const wordsByLength = groupBy(wordList, (word) => word.length);
    const lengths = Object.keys(wordsByLength).map(Number);
    const min = Math.min(...lengths);
    const max = Math.max(...lengths);

    const closestOffset = Math.min(length.min - min, max - length.max);

    return wordList.filter(
      (word) =>
        word.length === length.min - closestOffset ||
        word.length === length.max + closestOffset
    );
  },
  shortest: (wordList: ReadonlyArray<string>): string[] => {
    const minLength = Math.min(...wordList.map((word) => word.length));
    return wordList.filter((word) => word.length === minLength);
  },
  longest: (wordList: ReadonlyArray<string>): string[] => {
    const maxLength = Math.max(...wordList.map((word) => word.length));
    return wordList.filter((word) => word.length === maxLength);
  },
  'any-length': (wordList: ReadonlyArray<string>): string[] => {
    return [...wordList];
  },
} satisfies Record<
  NonNullable<Parameters<typeof filterWordListByLength>[0]['strategy']>,
  (wordList: string[], length: { min: number; max: number }) => string[]
>;

/**
 * Filters a string array for values with a matching length.
 * If length is not provided or no values with a matching length are found,
 * then the result will be determined using the given error handling strategy.
 *
 * @param options The options to provide.
 * @param options.wordList A list of words to filter.
 * @param options.length The exact or the range of lengths the words should have.
 * @param options.strategy The strategy to apply when no words with a matching length are found. Defaults to `'any-length'`.
 *
 * Available error handling strategies:
 *
 * - `fail`: Throws an error if no words with the given length are found.
 * - `shortest`: Returns any of the shortest words.
 * - `closest`: Returns any of the words closest to the given length.
 * - `longest`: Returns any of the longest words.
 * - `any-length`: Returns a copy of the original word list.
 */
export function filterWordListByLength(options: {
  wordList: ReadonlyArray<string>;
  length?: number | { min: number; max: number };
  strategy?: 'fail' | 'closest' | 'shortest' | 'longest' | 'any-length';
}): string[] {
  const { wordList, length, strategy = 'any-length' } = options;

  if (length != null) {
    const filter: (word: string) => boolean =
      typeof length === 'number'
        ? (word) => word.length === length
        : (word) => word.length >= length.min && word.length <= length.max;

    const wordListWithLengthFilter = wordList.filter(filter);

    if (wordListWithLengthFilter.length > 0) {
      return wordListWithLengthFilter;
    }

    if (typeof length === 'number') {
      return STRATEGIES[strategy](wordList, { min: length, max: length });
    }

    return STRATEGIES[strategy](wordList, length);
  } else if (strategy === 'shortest' || strategy === 'longest') {
    return STRATEGIES[strategy](wordList);
  }

  return [...wordList];
}
