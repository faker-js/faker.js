import type { Casing, ColorFormat } from '../../../src';
import { FakerError } from '../../../src/errors/faker-error';
import type { LiteralUnion } from '../../../src/internal/types';
import type { AlphaNumericChar } from '../../../src/modules/string';
// explicitly export types so they show up in the docs as decomposed types
export type {
  Casing,
  ColorFormat,
  NumberColorFormat,
  StringColorFormat,
} from '../../../src';
export type { LiteralUnion } from '../../../src/internal/types';
export type { AlphaNumericChar } from '../../../src/modules/string';

/**
 * Parameter options type with default from signature.
 */
export type ParameterOptionsTypeA = {
  /**
   * Options value.
   */
  value?: number;
};

/**
 * Parameter options type with default from jsdocs. Defaults to `{value: 0}`.
 */
export type ParameterOptionsTypeB = {
  /**
   * Options value.
   */
  value?: number;
};

/**
 * Parameter options type with default from inner jsdocs.
 */
export type ParameterOptionsTypeC = {
  /**
   * Options value. Defaults to `0`.
   */
  value?: number;
};

/**
 * Parameter options type with default from signature.
 */
export interface ParameterOptionsInterfaceA {
  /**
   * Options value.
   */
  value?: number;
}

/**
 * Parameter options type with default from jsdocs.
 */
export interface ParameterOptionsInterfaceB {
  /**
   * Options value.
   */
  value?: number;
}

/**
 * Parameter options type with default from inner jsdocs.
 */
export interface ParameterOptionsInterfaceC {
  /**
   * Options value. Defaults to `0`.
   */
  value?: number;
}

/**
 * A or B.
 */
export type AB = 'a' | 'b';

export class SignatureTest {
  /**
   * Test with no parameters.
   *
   * @since 1.0.0
   */
  noParamMethod(): number {
    return 0;
  }

  /**
   * Test with a required parameter.
   *
   * @param a The number parameter.
   *
   * @since 1.0.0
   */
  requiredNumberParamMethod(a: number): number {
    return a;
  }

  /**
   * Test with an optional parameter.
   *
   * @param b The string parameter.
   *
   * @since 1.0.0
   */
  optionalStringParamMethod(b?: string): number {
    return b ? 0 : 1;
  }

  /**
   * Test with a default parameter.
   *
   * @param c The boolean parameter.
   *
   * @since 1.0.0
   */
  defaultBooleanParamMethod(c: boolean = true): number {
    return c ? 1 : 0;
  }

  /**
   * Test with multiple parameters.
   *
   * @param a The number parameter.
   * @param b The string parameter.
   * @param c The boolean parameter.
   *
   * @since 1.0.0
   */
  multiParamMethod(a: number, b?: string, c: boolean = true): number {
    return c ? a : b ? 0 : 1;
  }

  /**
   * Test with a function parameters.
   *
   * @param fn The function parameter.
   *
   * @since 1.0.0
   */
  functionParamMethod(fn: (a: string) => number): number {
    return fn('a');
  }

  /**
   * Test with string union.
   *
   * @param value `'a'` or `'b'`.
   * @param options The options parameter.
   * @param options.casing The casing parameter.
   * @param options.format The format parameter.
   * @param options.excludes The excludes parameter.
   *
   * @since 1.0.0
   */
  stringUnionParamMethod(
    value: 'a' | 'b',
    options?: {
      /**
       * The casing parameter.
       */
      casing?: Casing;
      /**
       * The format parameter.
       */
      format?: 'hex' | ColorFormat;
      /**
       * The excludes parameter.
       */
      excludes?: ReadonlyArray<AlphaNumericChar>;
    }
  ): string {
    return options?.format ?? value;
  }

  /**
   * Test with LiteralUnion.
   *
   * @param value `'a'` or `'b'`.
   * @param namedValue `'a'` or `'b'`.
   * @param array Array of `'a'` or `'b'`.
   * @param namedArray Array of `'a'` or `'b'`.
   * @param mixed Value `'a'` or `'b'` or an array thereof.
   * @param namedMixed Value `'a'` or `'b'` or an array thereof.
   *
   * @since 1.0.0
   */
  literalUnionParamMethod(
    value: LiteralUnion<'a' | 'b'>,
    namedValue: LiteralUnion<AB>,
    array: ReadonlyArray<LiteralUnion<'a' | 'b'>>,
    namedArray: ReadonlyArray<LiteralUnion<AB>>,
    mixed: LiteralUnion<'a' | 'b'> | ReadonlyArray<LiteralUnion<'a' | 'b'>>,
    namedMixed: ReadonlyArray<LiteralUnion<AB>> | LiteralUnion<AB>
  ): string {
    return (
      value +
      namedValue +
      array.join('') +
      namedArray.join('') +
      String(mixed) +
      String(namedMixed)
    );
  }

  /**
   * Test with a Record parameter.
   *
   * @param object The Record parameter.
   *
   * @since 1.0.0
   */
  recordParamMethod(object: Record<string, number>): number {
    return object.a;
  }

  /**
   * Test with an options parameter.
   *
   * @param options The options parameter.
   * @param options.a The number parameter.
   * @param options.b The string parameter.
   * @param options.c The boolean parameter.
   * @param options.d The method parameter.
   * @param options.e The LiteralUnion parameter.
   *
   * @since 1.0.0
   */
  optionsParamMethod(options: {
    /**
     * The number parameter.
     */
    a: number;
    /**
     * The string parameter.
     */
    b?: string;
    /**
     * The boolean parameter.
     */
    c: boolean;
    /**
     * The method parameter.
     */
    d: () => string;
    /**
     * A parameter with inline documentation.
     *
     * @default 'a'
     */
    e: LiteralUnion<'a' | 'b'>;
  }): number {
    return options.a;
  }

  /**
   * Test with a function parameters (inline types) with defaults.
   *
   * @param a Parameter with signature default.
   * It also has a more complex description.
   * @param a.value The number parameter.
   * @param b Parameter with jsdocs default.
   *
   * It also has a more complex description.
   *
   * Defaults to `{ value: 1 }`.
   * @param b.value The number parameter.
   * @param c Parameter with inner jsdocs default.
   * @param c.value The number parameter. It also has a more complex description. Defaults to `2`.
   *
   * @since 1.0.0
   */
  optionsInlineParamMethodWithDefaults(
    a: {
      /**
       * The number parameter.
       */
      value?: number;
    } = { value: 1 },
    b: {
      /**
       * The number parameter.
       */
      value?: number;
    },
    c: {
      /**
       * The number parameter.
       */
      value?: number;
    }
  ): number {
    return a.value ?? b.value ?? c.value ?? -1;
  }

  /**
   * Test with a function parameters with defaults.
   *
   * @param a Parameter with signature default.
   * @param a.value The number parameter.
   * @param b Parameter with jsdocs default. Defaults to `{ value: 1 }`.
   * @param b.value The number parameter.
   * @param c Parameter with inner jsdocs default.
   * @param c.value The number parameter. Defaults to `2`.
   *
   * @since 1.0.0
   */
  optionsTypeParamMethodWithDefaults(
    a: ParameterOptionsTypeA = { value: 1 },
    b: ParameterOptionsTypeB,
    c: ParameterOptionsTypeC
  ): number {
    return a.value ?? b.value ?? c.value ?? -1;
  }

  /**
   * Test with a function parameters with defaults.
   *
   * @param a Parameter with signature default.
   * @param a.value The number parameter.
   * @param b Parameter with jsdocs default. Defaults to `{ value: 1 }`.
   * @param b.value The number parameter.
   * @param c Parameter with inner jsdocs default.
   * @param c.value The number parameter. Defaults to `2`.
   *
   * @since 1.0.0
   */
  optionsInterfaceParamMethodWithDefaults(
    a: ParameterOptionsInterfaceA = { value: 1 },
    b: ParameterOptionsInterfaceB,
    c: ParameterOptionsInterfaceC
  ): number {
    return a.value ?? b.value ?? c.value ?? -1;
  }

  /**
   * Test with example marker.
   *
   * @example
   * test.apidocs.methodWithExample() // 0
   *
   * @since 1.0.0
   */
  methodWithExample(): number {
    return 0;
  }

  /**
   * Test with deprecated and see marker.
   *
   * @see test.apidocs.methodWithExample()
   *
   * @since 1.0.0
   *
   * @deprecated do something else
   */
  methodWithDeprecated(): number {
    return 0;
  }

  /**
   * Test with throws.
   *
   * @throws Everytime.
   *
   * @since 1.0.0
   */
  methodWithThrows(): number {
    throw new FakerError('Test error');
  }

  /**
   * Test with multiple throws.
   *
   * @throws First error case.
   * @throws Another error case.
   *
   * @since 1.0.0
   */
  methodWithMultipleThrows(): number {
    throw new FakerError('Another test error');
  }

  /**
   * Test with deprecated option.
   *
   * @param option The options.
   * @param option.a Some deprecated option.
   * @param option.b Some other deprecated option.
   * @param option.c Some other option.
   *
   * @since 1.0.0
   */
  methodWithDeprecatedOption(option: {
    /**
     * Some deprecated option.
     *
     * @deprecated do something else.
     */
    a: string;
    /**
     * Some other deprecated option.
     *
     * @deprecated do something else.
     */
    b: () => number;
    /**
     * Some other option.
     */
    c: number;
  }): number {
    return option.c;
  }

  /**
   * Test with multiple see markers.
   *
   * @see test.apidocsmethodWithExample()
   * @see test.apidocsmethodWithDeprecated()
   *
   * @since 1.0.0
   */
  methodWithMultipleSeeMarkers(): number {
    return 0;
  }

  /**
   * Test with multiple see markers and backticks.
   *
   * @see test.apidocsmethodWithExample() with parameter `foo`.
   * @see test.apidocsmethodWithDeprecated() with parameter `bar` and `baz`.
   *
   * @since 1.0.0
   */
  methodWithMultipleSeeMarkersAndBackticks(): number {
    return 0;
  }

  /**
   * Test with since marker.
   *
   * @since 1.0.0
   */
  methodWithSinceMarker(): number {
    return 0;
  }

  /**
   * Complex array parameter.
   *
   * @template T The type of the entries to pick from.
   *
   * @param array Array to pick the value from.
   * @param array[].weight The weight of the value.
   * @param array[].value The value to pick.
   *
   * @since 1.0.0
   */
  complexArrayParameter<T>(
    array: ReadonlyArray<{
      /**
       * The weight of the value.
       */
      weight: number;
      /**
       * The value to pick.
       */
      value: T;
    }>
  ): T {
    return array[0].value;
  }
}
