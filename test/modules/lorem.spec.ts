import { isSlug } from 'validator';
import { describe, expect, it } from 'vitest';
import { faker } from '../../src';
import { seededTests } from '../support/seeded-runs';
import { times } from './../support/times';

const NON_SEEDED_BASED_RUN = 5;

describe('lorem', () => {
  seededTests(faker, 'lorem', (t) => {
    t.describe('word', (t) => {
      t.it('noArgs')
        .it('with length', 10)
        .it('with options.length', { length: 10 })
        .it('with options.strategy', { strategy: 'shortest' })
        .it('with options.length and options.strategy', {
          length: { min: 18, max: 20 },
          strategy: 'closest',
        });
    });
    t.describeEach(
      'words',
      'sentence',
      'slug',
      'sentences',
      'paragraph',
      'paragraphs',
      'text',
      'lines'
    )((t) => {
      t.it('noArgs')
        .it('with length', 10)
        .it('with length range', { min: 10, max: 20 });
    });
  });

  describe.each(times(NON_SEEDED_BASED_RUN).map(() => faker.seed()))(
    'random seeded tests for seed %i',
    () => {
      describe('word()', () => {
        it('should return random value from word array', () => {
          const actual = faker.lorem.word();

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');
          expect(faker.definitions.lorem.word).toContain(actual);
        });

        // INFO @Shinigami92 2022-02-11: Seems there are only words with a max length of 14 characters
        it.each(times(14))(
          'should return random value from word array with a max length of %i characters',
          (length) => {
            const actual = faker.lorem.word(length);

            expect(actual).toBeTruthy();
            expect(actual).toBeTypeOf('string');
            expect(faker.definitions.lorem.word).toContain(actual);
            expect(actual).toHaveLength(length);
          }
        );
      });

      describe('words()', () => {
        it('should return three random values from words array', () => {
          const actual = faker.lorem.words();

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');

          const words = actual.split(' ');

          expect(words).toHaveLength(3);

          for (const word of words) {
            expect(faker.definitions.lorem.word).toContain(word);
          }
        });

        it.each(times(25))(
          'should return %i random values from words array',
          (num) => {
            const actual = faker.lorem.words(num);

            expect(actual).toBeTruthy();
            expect(actual).toBeTypeOf('string');

            const words = actual.split(' ');

            expect(words).toHaveLength(num);

            for (const word of words) {
              expect(faker.definitions.lorem.word).toContain(word);
            }
          }
        );

        it('should return a random amount of words', () => {
          const actual = faker.lorem.words({ min: 10, max: 20 });

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');

          const words = actual.split(' ');

          expect(words.length).toBeGreaterThanOrEqual(10);
          expect(words.length).toBeLessThanOrEqual(20);

          for (const word of words) {
            expect(faker.definitions.lorem.word).toContain(word);
          }
        });
      });

      describe('sentence()', () => {
        it('should return a sentence', () => {
          const actual = faker.lorem.sentence();

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');
          expect(actual.at(-1)).toBe('.');
        });

        it.each(times(25))(
          'should return a sentence with %i words',
          (wordCount) => {
            const actual = faker.lorem.sentence(wordCount);

            expect(actual).toBeTruthy();
            expect(actual).toBeTypeOf('string');
            expect(actual.at(-1)).toBe('.');

            const words = actual.split(' ');

            expect(words).toHaveLength(wordCount);
          }
        );

        it('should return a sentence with a random amount of words', () => {
          const actual = faker.lorem.sentence({ min: 10, max: 20 });

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');

          const words = actual.split(' ');

          expect(words.length).toBeGreaterThanOrEqual(10);
          expect(words.length).toBeLessThanOrEqual(20);
        });
      });

      describe('slug()', () => {
        it('should return a slug', () => {
          const actual = faker.lorem.slug();

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');
          expect(actual).toSatisfy(isSlug);
        });

        it.each(times(25))(
          'should return a slug combined from %i words',
          (wordCount) => {
            const actual = faker.lorem.slug(wordCount);

            expect(actual).toBeTruthy();
            expect(actual).toBeTypeOf('string');

            const words = actual.split('-');

            expect(words).toHaveLength(wordCount);

            if (wordCount > 1) {
              expect(actual).toSatisfy(isSlug);
            }
          }
        );
      });

      describe('sentences()', () => {
        it('should return sentences', () => {
          const actual = faker.lorem.sentences();

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');
          expect(actual.at(-1)).toBe('.');
        });

        it.each(times(10))('should return %i sentences', (sentenceCount) => {
          const actual = faker.lorem.sentences(sentenceCount);

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');
          expect(actual.at(-1)).toBe('.');

          const sentences = actual.split('. ');

          expect(sentences).toHaveLength(sentenceCount);
        });

        it.each(times(10))(
          'should return %i sentences separated by \\n',
          (sentenceCount) => {
            const separator = '\n';
            const actual = faker.lorem.sentences(sentenceCount, separator);

            expect(actual).toBeTruthy();
            expect(actual).toBeTypeOf('string');
            expect(actual.at(-1)).toBe('.');

            const sentences = actual.split(separator);

            expect(sentences).toHaveLength(sentenceCount);

            for (const sentence of sentences) {
              expect(sentence.at(-1)).toBe('.');
            }
          }
        );

        it('should return a random amount of sentences', () => {
          const actual = faker.lorem.sentences({ min: 10, max: 20 });

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');

          const sentences = actual.split('. ');

          expect(sentences.length).toBeGreaterThanOrEqual(10);
          expect(sentences.length).toBeLessThanOrEqual(20);
        });
      });

      describe('paragraph()', () => {
        it('should return a paragraph', () => {
          const actual = faker.lorem.paragraph();

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');
          expect(actual.at(-1)).toBe('.');
        });

        it.each(times(10))(
          'should return a paragraph with %i sentences',
          (sentenceCount) => {
            const actual = faker.lorem.paragraph(sentenceCount);

            expect(actual).toBeTruthy();
            expect(actual).toBeTypeOf('string');
            expect(actual.at(-1)).toBe('.');

            const sentences = actual.split('. ');

            expect(sentences.length).toBeGreaterThanOrEqual(sentenceCount);
            expect(sentences.length).toBeLessThanOrEqual(sentenceCount + 3);
          }
        );

        it('should return a paragraph with a random amount of sentences', () => {
          const actual = faker.lorem.paragraph({ min: 10, max: 20 });

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');

          const sentences = actual.split('. ');

          expect(sentences.length).toBeGreaterThanOrEqual(10);
          expect(sentences.length).toBeLessThanOrEqual(20);
        });
      });

      describe('paragraphs()', () => {
        it('should return paragraphs', () => {
          const actual = faker.lorem.paragraphs();

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');
          expect(actual.at(-1)).toBe('.');
        });

        it.each(times(5))('should return %i paragraphs', (paragraphCount) => {
          const actual = faker.lorem.paragraphs(paragraphCount);

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');
          expect(actual.at(-1)).toBe('.');

          const paragraphs = actual.split('\n');

          expect(paragraphs).toHaveLength(paragraphCount);
        });

        it.each(times(5))(
          'should return %i paragraphs separated by \\n\\n',
          (paragraphCount) => {
            const separator = '\n\n';
            const actual = faker.lorem.paragraphs(paragraphCount, separator);

            expect(actual).toBeTruthy();
            expect(actual).toBeTypeOf('string');
            expect(actual.at(-1)).toBe('.');

            const paragraphs = actual.split(separator);

            expect(paragraphs).toHaveLength(paragraphCount);
          }
        );

        it('should return a random amount of paragraphs', () => {
          const actual = faker.lorem.paragraphs({ min: 10, max: 20 });

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');

          const paragraphs = actual.split('\n');

          expect(paragraphs.length).toBeGreaterThanOrEqual(10);
          expect(paragraphs.length).toBeLessThanOrEqual(20);
        });
      });

      describe('text()', () => {
        it('should return text', () => {
          const actual = faker.lorem.text();

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');
        });
      });

      describe('lines()', () => {
        it('should return lines', () => {
          const actual = faker.lorem.lines();

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');
        });

        it.each(times(25))('should return %i lines', (lineCount) => {
          const actual = faker.lorem.lines(lineCount);

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');

          const lines = actual.split('\n');

          expect(lines).toHaveLength(lineCount);
        });

        it('should return a random amount of lines', () => {
          const actual = faker.lorem.lines({ min: 10, max: 20 });

          expect(actual).toBeTruthy();
          expect(actual).toBeTypeOf('string');

          const lines = actual.split('\n');

          expect(lines.length).toBeGreaterThanOrEqual(10);
          expect(lines.length).toBeLessThanOrEqual(20);
        });
      });
    }
  );
});
