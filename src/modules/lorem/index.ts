import { ModuleBase } from '../../internal/module-base';
import { filterWordListByLength } from '../word/filter-word-list-by-length';

/**
 * Module to generate random texts and words.
 *
 * ### Overview
 *
 * Generate dummy content using traditional faux-Latin [lorem ipsum](https://en.wikipedia.org/wiki/Lorem_ipsum) (in other locales to `en`, alternative words may be used).
 *
 * In order of increasing size you can generate a single [`word()`](https://fakerjs.dev/api/lorem.html#word), multiple [`words()`](https://fakerjs.dev/api/lorem.html#words), a [`sentence()`](https://fakerjs.dev/api/lorem.html#sentence), multiple [`sentences()`](https://fakerjs.dev/api/lorem.html#sentences), [`lines()`](https://fakerjs.dev/api/lorem.html#lines) separated by newlines, one [`paragraph()`](https://fakerjs.dev/api/lorem.html#paragraph), or multiple [`paragraphs()`](https://fakerjs.dev/api/lorem.html#paragraphs).
 *
 * The generic [`text()`](https://fakerjs.dev/api/lorem.html#text) method can be used to generate some text between one sentence and multiple paragraphs, while [`slug()`](https://fakerjs.dev/api/lorem.html#slug) generates an URL-friendly hyphenated string.
 */
export class LoremModule extends ModuleBase {
  /**
   * Generates a word of a specified length.
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
   * faker.lorem.word() // 'inflammatio'
   * faker.lorem.word(5) // 'teneo'
   * faker.lorem.word({ strategy: 'shortest' }) // 'a'
   * faker.lorem.word({ length: { min: 5, max: 7 }, strategy: 'fail' }) // 'pauci'
   *
   * @since 3.1.0
   */
  word(
    options:
      | number
      | {
          /**
           * The expected length of the word.
           *
           * @default 1
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
        wordList: this.faker.definitions.lorem.word,
      })
    );
  }

  /**
   * Generates a space separated list of words.
   *
   * @param wordCount The number of words to generate. Defaults to `3`.
   * @param wordCount.min The minimum number of words to generate.
   * @param wordCount.max The maximum number of words to generate.
   *
   * @example
   * faker.lorem.words() // 'inflammatio sumo pax'
   * faker.lorem.words(10) // 'impedit curriculum sint debitis vallum vix credo textilis eveniet minus'
   * faker.lorem.words({ min: 1, max: 3 }) // 'aeneus alias accusator'
   *
   * @since 2.0.1
   */
  words(
    wordCount:
      | number
      | {
          /**
           * The minimum number of words to generate.
           */
          min: number;
          /**
           * The maximum number of words to generate.
           */
          max: number;
        } = 3
  ): string {
    return this.faker.helpers
      .multiple(() => this.word(), { count: wordCount })
      .join(' ');
  }

  /**
   * Generates a space separated list of words beginning with a capital letter and ending with a period.
   *
   * @param wordCount The number of words, that should be in the sentence. Defaults to a random number between `3` and `10`.
   * @param wordCount.min The minimum number of words to generate. Defaults to `3`.
   * @param wordCount.max The maximum number of words to generate. Defaults to `10`.
   *
   * @example
   * faker.lorem.sentence() // 'Sumo pax impedit curriculum sint debitis vallum.'
   * faker.lorem.sentence(5) // 'Vix credo textilis eveniet minus.'
   * faker.lorem.sentence({ min: 3, max: 5 }) // 'Aeneus alias accusator tristis tergo.'
   *
   * @since 2.0.1
   */
  sentence(
    wordCount:
      | number
      | {
          /**
           * The minimum number of words to generate.
           */
          min: number;
          /**
           * The maximum number of words to generate.
           */
          max: number;
        } = { min: 3, max: 10 }
  ): string {
    const sentence = this.words(wordCount);
    return `${sentence.charAt(0).toUpperCase() + sentence.substring(1)}.`;
  }

  /**
   * Generates a slugified text consisting of the given number of hyphen separated words.
   *
   * @param wordCount The number of words to generate. Defaults to `3`.
   * @param wordCount.min The minimum number of words to generate.
   * @param wordCount.max The maximum number of words to generate.
   *
   * @example
   * faker.lorem.slug() // 'inflammatio-sumo-pax'
   * faker.lorem.slug(5) // 'impedit-curriculum-sint-debitis-vallum'
   * faker.lorem.slug({ min: 1, max: 3 }) // 'credo-textilis-eveniet'
   *
   * @since 4.0.0
   */
  slug(
    wordCount:
      | number
      | {
          /**
           * The minimum number of words to generate.
           */
          min: number;
          /**
           * The maximum number of words to generate.
           */
          max: number;
        } = 3
  ): string {
    const words = this.words(wordCount);
    return this.faker.helpers.slugify(words);
  }

  /**
   * Generates the given number of sentences.
   *
   * @param sentenceCount The number of sentences to generate. Defaults to a random number between `2` and `6`.
   * @param sentenceCount.min The minimum number of sentences to generate. Defaults to `2`.
   * @param sentenceCount.max The maximum number of sentences to generate. Defaults to `6`.
   * @param separator The separator to add between sentences. Defaults to `' '`.
   *
   * @example
   * faker.lorem.sentences() // 'Pax impedit curriculum sint debitis vallum vix credo. Eveniet minus vespillo aeneus alias accusator tristis tergo usus. Thermae deinde termes angustus rerum arbitro vinco enim cuppedia celo. Defleo minus accusamus quae perspiciatis provident villa statim contigo.'
   * faker.lorem.sentences(2) // 'Subiungo adulescens sopor spargo bene aperiam. Convoco molestiae decens voveo ambitus.'
   * faker.lorem.sentences(2, '\n')
   * // 'Arx solitudo catena deleniti.
   * // Articulus amor sollicito aptus.'
   * faker.lorem.sentences({ min: 1, max: 3 }) // 'Trado alter tum alo voluptatibus.'
   *
   * @since 2.0.1
   */
  sentences(
    sentenceCount:
      | number
      | {
          /**
           * The minimum number of sentences to generate.
           */
          min: number;
          /**
           * The maximum number of sentences to generate.
           */
          max: number;
        } = { min: 2, max: 6 },
    separator: string = ' '
  ): string {
    return this.faker.helpers
      .multiple(() => this.sentence(), { count: sentenceCount })
      .join(separator);
  }

  /**
   * Generates a paragraph with the given number of sentences.
   *
   * @param sentenceCount The number of sentences to generate. Defaults to `3`.
   * @param sentenceCount.min The minimum number of sentences to generate.
   * @param sentenceCount.max The maximum number of sentences to generate.
   *
   * @example
   * faker.lorem.paragraph() // 'Sumo pax impedit curriculum sint debitis vallum. Credo textilis eveniet minus vespillo aeneus alias accusator tristis tergo. Volutabrum thermae deinde termes angustus rerum arbitro vinco enim.'
   * faker.lorem.paragraph(2) // 'Celo teres defleo minus accusamus quae. Provident villa statim contigo debilito subiungo adulescens.'
   * faker.lorem.paragraph({ min: 1, max: 3 }) // 'Bene aperiam comedo convoco molestiae decens voveo ambitus. Arx solitudo catena deleniti. Articulus amor sollicito aptus.'
   *
   * @since 2.0.1
   */
  paragraph(
    sentenceCount:
      | number
      | {
          /**
           * The minimum number of sentences to generate.
           */
          min: number;
          /**
           * The maximum number of sentences to generate.
           */
          max: number;
        } = 3
  ): string {
    return this.sentences(sentenceCount);
  }

  /**
   * Generates the given number of paragraphs.
   *
   * @param paragraphCount The number of paragraphs to generate. Defaults to `3`.
   * @param paragraphCount.min The minimum number of paragraphs to generate.
   * @param paragraphCount.max The maximum number of paragraphs to generate.
   * @param separator The separator to use. Defaults to `'\n'`.
   *
   * @example
   * faker.lorem.paragraphs()
   * // 'Sumo pax impedit curriculum sint debitis vallum. Credo textilis eveniet minus vespillo aeneus alias accusator tristis tergo. Volutabrum thermae deinde termes angustus rerum arbitro vinco enim.
   * // Celo teres defleo minus accusamus quae. Provident villa statim contigo debilito subiungo adulescens. Spargo bene aperiam comedo convoco molestiae decens voveo.
   * // Bellicus arx solitudo. Deleniti caries articulus amor sollicito. Auxilium corporis trado alter.'
   * 
   * faker.lorem.paragraphs(5)
   * // 'Alo voluptatibus delicate voluptatibus pecco tactus adflicto cimentarius animi. Angustus cometes cupio advoco stultus. Cena eos aliquid nemo vetus comis sopor.
   * // Sumptus clam auctus occaecati. Tricesimus abeo spiritus. Tabesco vivo carpo nemo omnis.
   * // Cado viridis dedecor tyrannus subnecto coadunatio torqueo. Uxor nobis uxor stultus surgo desino. Sequi curriculum pecto accusantium cogito solutio clam quae curto appositus.
   * // Molestiae officiis natus solitudo solio. Vel corona debeo vapulus timidus succurro. Verto summopere vulticulus.
   * // Ustilo ascisco possimus anser. Timor modi cum aegrus subiungo defetiscor suppono usitas voluptates. Absum contigo sustineo astrum eligendi adopto aveho accusamus textus.'
   * 
   * faker.lorem.paragraphs(2, '<br/>\n')
   * // 'Coniuratio vestrum succurro addo. Quas neque capio victus. Facilis officia sustineo color cubicularis bellum audentia.&lt;br/>
   * // Tactus depraedor calcar caterva adsuesco damno color subito crapula attero. Aegre spoliatio defetiscor. Vel vulariter bis somnus celer accusator tempora.'
   * 
   * faker.lorem.paragraphs({ min: 1, max: 3 }) // 'Odio tripudio quo uter certus theologus. Viridis stips bibo vinitor. Catena benigne eaque acies beatus currus corrumpo delectus.'
   *
   * @since 2.0.1
   */
  paragraphs(
    paragraphCount:
      | number
      | {
          /**
           * The minimum number of paragraphs to generate.
           */
          min: number;
          /**
           * The maximum number of paragraphs to generate.
           */
          max: number;
        } = 3,
    separator: string = '\n'
  ): string {
    return this.faker.helpers
      .multiple(() => this.paragraph(), { count: paragraphCount })
      .join(separator);
  }

  /**
   * Generates a random text based on a random lorem method.
   *
   * @example
   * faker.lorem.text() // 'Pax impedit curriculum sint debitis vallum vix credo. Eveniet minus vespillo aeneus alias accusator tristis tergo usus. Thermae deinde termes angustus rerum arbitro vinco enim cuppedia celo.'
   * faker.lorem.text()
   * // 'Minus accusamus quae perspiciatis provident villa. Contigo debilito subiungo adulescens sopor spargo bene aperiam. Convoco molestiae decens voveo ambitus.
   * // Arx solitudo catena deleniti. Articulus amor sollicito aptus. Corporis trado alter tum.
   * // Voluptatibus delicate voluptatibus. Tactus adflicto cimentarius animi clementia angustus cometes. Advoco stultus minima cena eos aliquid.'
   *
   * @since 3.1.0
   */
  text(): string {
    const methods: Array<keyof LoremModule> = [
      'sentence',
      'sentences',
      'paragraph',
      'paragraphs',
      'lines',
    ];

    const method = this.faker.helpers.arrayElement(methods);

    return this[method]();
  }

  /**
   * Generates the given number lines of lorem separated by `'\n'`.
   *
   * @param lineCount The number of lines to generate. Defaults to a random number between `1` and `5`.
   * @param lineCount.min The minimum number of lines to generate. Defaults to `1`.
   * @param lineCount.max The maximum number of lines to generate. Defaults to `5`.
   *
   * @example
   * faker.lorem.lines()
   * // 'Pax impedit curriculum sint debitis vallum vix credo.
   * // Eveniet minus vespillo aeneus alias accusator tristis tergo usus.
   * // Thermae deinde termes angustus rerum arbitro vinco enim cuppedia celo.'
   * 
   * faker.lorem.lines()
   * // 'Minus accusamus quae perspiciatis provident villa.
   * // Contigo debilito subiungo adulescens sopor spargo bene aperiam.
   * // Convoco molestiae decens voveo ambitus.
   * // Arx solitudo catena deleniti.'
   * 
   * faker.lorem.lines(2)
   * // 'Articulus amor sollicito aptus.
   * // Corporis trado alter tum.'
   * 
   * faker.lorem.lines({ min: 1, max: 3 }) // 'Delicate voluptatibus pecco tactus adflicto cimentarius animi clementia angustus cometes.'
   *
   * @since 3.1.0
   */
  lines(
    lineCount:
      | number
      | {
          /**
           * The minimum number of lines to generate.
           */
          min: number;
          /**
           * The maximum number of lines to generate.
           */
          max: number;
        } = { min: 1, max: 5 }
  ): string {
    return this.sentences(lineCount, '\n');
  }
}
