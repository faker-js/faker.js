import { describe, expect, describe as vi_describe, it as vi_it } from 'vitest';
import type { Faker } from '../../src/faker';
import type { Callable, MethodOf } from '../../src/internal/types';

export const seededRuns = [42, 1337, 1211];

/**
 * A type allowing only the names of faker modules.
 */
type FakerModule = {
  [Key in keyof Faker]: Faker[Key] extends Callable | string | number | number[]
    ? never
    : Key extends 'definitions' | 'locales'
      ? never
      : Key;
}[keyof Faker];

/**
 * Picks only the methods from the given type.
 */
type OnlyMethods<T> = Pick<T, MethodOf<T>>;

/**
 * A Faker type with modules trimmed to only methods.
 */
type OnlyMethodsFaker = {
  [Key in FakerModule]: OnlyMethods<Faker[Key]>;
};

/**
 * The type allowing only the names of methods that have exactly zero arguments.
 */
type NoArgsMethodOf<TObjectType> = MethodOf<TObjectType> &
  {
    [Key in MethodOf<TObjectType, () => unknown>]: TObjectType[Key] extends (
      arg0: string | number | boolean | Record<string, undefined>,
      ...args: unknown[]
    ) => unknown
      ? Key
      : never;
  }[MethodOf<TObjectType, () => unknown>];

/**
 * Method that prepares seeded tests.
 *
 * It ensures that all methods in that module have exactly one test case or block associated to them.
 * Duplicate calls to `t.it(methodName)` or `t.describe(methodName)` will directly throw an error.
 * Before the method returns it will check that there are tests for all methods of the module.
 *
 * You may add custom vitest's `it` and `describe` blocks both on a module and method level,
 * however these will be ignored by the completeness checks and you have to call the `setup()` callback yourself.
 *
 * @param faker The faker instance to use for the tests.
 * @param module The name of the faker module to test.
 * @param factory The factory used to create the seeded tests. Supports both fluent and individual calls.
 *
 * @example
 * seededTests(faker, 'random', (t) => {
 *  t.it('methodWithoutArgs')
 *    .itRepeated('methodWithoutArgs2', 5)
 *    .describe('methodWithArgs3', (t) => {
 *      t.it('noArgs')
 *        .it('withParam1', 1337)
 *        .it('variant1', { min: 0})
 *        .it('variant2', { max: 1337})
 *        .it('variant1And2', { min: 0, max: 1337})
 *    });
 * })
 */
export function seededTests<
  TFakerModule extends FakerModule,
  TModule extends Record<string, Callable> = OnlyMethodsFaker[TFakerModule],
>(
  faker: Faker,
  module: TFakerModule,
  factory: (tg: TestGenerator<TFakerModule, TModule>, setup: () => void) => void
): void {
  describe.each(seededRuns)('%s', (seed) => {
    const testGenerator: TestGenerator<TFakerModule, TModule> =
      new TestGenerator(faker, seed, module);
    factory(testGenerator, () => testGenerator.setup());

    testGenerator.expectAllMethodsToBeTested();
  });
}

/**
 * Generator for seed based tests.
 *
 * The individual methods generate default test blocks, that use test snapshots to verify consistent return values.
 */
class TestGenerator<
  TModuleName extends FakerModule,
  TModule extends Record<string, Callable> = OnlyMethodsFaker[TModuleName],
> {
  private readonly tested: Set<MethodOf<TModule>> = new Set();
  private readonly module: TModule;

  constructor(
    private readonly faker: Faker,
    private readonly seed: number,
    private readonly moduleName: TModuleName
  ) {
    this.module = this.faker[moduleName] as unknown as TModule;
  }

  /**
   * Ensures that there is only one test block for each method.
   *
   * @param method The method name to check.
   */
  private expectNotTested(method: MethodOf<TModule>): void {
    expect(
      this.tested.has(method),
      `${method} not to be tested yet`
    ).toBeFalsy();
    this.tested.add(method);
  }

  /**
   * Should never be called from tests.
   *
   * Configures the faker instance for the test by resetting the seed.
   *
   * This method will automatically be called by the default methods
   * and should be called at the beginning of custom vitest's `it` blocks.
   */
  setup(): void {
    this.faker.seed(this.seed);
  }

  /**
   * Runs the instructions for a vitest's `it` block.
   *
   * @param method The method name to call.
   * @param args The arguments to call it with.
   * @param extraStackFrames Additional stack frames to add into the stacktrace.
   * @param repetitions The number of times to call it.
   */
  private callAndVerify<TMethodName extends MethodOf<TModule>>(
    method: TMethodName,
    args: Parameters<TModule[TMethodName]>,
    extraStackFrames: () => string[],
    repetitions: number = 1
  ): void {
    this.setup();
    const callable = this.module[method];
    if (callable == null) {
      throw new Error(`Method ${method} not found in ${this.moduleName}`);
    }

    for (let i = 0; i < repetitions; i++) {
      try {
        const value = callable(...args);
        expect(value).toMatchSnapshot();
      } catch (error: unknown) {
        throw patchExtraStackFrames(error, extraStackFrames);
      }
    }
  }

  /**
   * Permanently ignores this method.
   *
   * @param method The name of the method.
   */
  skip(method: MethodOf<TModule>): this {
    this.expectNotTested(method);
    vi_it.skip(method);
    return this;
  }

  /**
   * Generates a test for a method without arguments.
   *
   * @param method The name of the method.
   */
  it(method: NoArgsMethodOf<TModule>): this {
    return this.itRepeated(method, 1);
  }

  /**
   * Generates a repeated test for a method without arguments.
   * The seed is not reset between repetitions.
   *
   * @param method The name of the method.
   * @param repetitions The number of repetitions to run.
   */
  itRepeated(method: NoArgsMethodOf<TModule>, repetitions: number): this {
    this.expectNotTested(method);
    const extraStackFrames = collectExtraStackFrames();
    vi_it(method, () =>
      this.callAndVerify(
        method,
        [] as unknown as Parameters<TModule[NoArgsMethodOf<TModule>]>,
        extraStackFrames,
        repetitions
      )
    );
    return this;
  }

  /**
   * Generates no argument tests for the given methods.
   *
   * @param methods The names of the methods.
   */
  itEach<TMethodName extends NoArgsMethodOf<TModule>>(
    ...methods: TMethodName[]
  ): this {
    for (const method of methods) {
      this.it(method);
    }

    return this;
  }

  /**
   * Generates a test section for a method.
   * Useful to cover multiple argument variations.
   *
   * @param method The name of the method.
   * @param factory The factory used to generate the individual tests.
   */
  describe<TMethodName extends MethodOf<TModule>>(
    method: TMethodName,
    factory: (tester: MethodTester<TModule[TMethodName]>) => void
  ): this {
    this.expectNotTested(method);
    const callAndVerify: TestGenerator<TModuleName, TModule>['callAndVerify'] =
      this.callAndVerify.bind(this);
    const variantNames = new Set<string>();
    const expectVariantNotTested = (name: string): void => {
      expect(
        variantNames.has(name),
        `${name} test to be unique for ${method}`
      ).toBeFalsy();
      variantNames.add(name);
    };

    const tester: MethodTester<TModule[TMethodName]> = {
      it(name: string, ...args: Parameters<TModule[TMethodName]>) {
        expectVariantNotTested(name);
        const extraStackFrames = collectExtraStackFrames(
          /* t. */ `it('${name}', `.length // ...args)
        );
        vi_it(name, () => callAndVerify(method, args, extraStackFrames));
        return tester;
      },
      itRepeated(
        name: string,
        repetitions: number,
        ...args: Parameters<TModule[TMethodName]>
      ) {
        expectVariantNotTested(name);
        const extraStackFrames = collectExtraStackFrames(
          /* t. */ `itRepeated('${name}', ${repetitions}, `.length // ...args)
        );
        vi_it(name, () =>
          callAndVerify(method, args, extraStackFrames, repetitions)
        );
        return tester;
      },
    };
    vi_describe(method, () => {
      factory(tester);
    });
    return this;
  }

  /**
   * Generates a test section for multiple methods with a similar signature.
   * Useful to cover multiple argument variations.
   *
   * @param methods The names of the methods to generate the tests for.
   */
  describeEach<TMethodName extends MethodOf<TModule>>(
    ...methods: TMethodName[]
  ): (factory: (tester: MethodTester<TModule[TMethodName]>) => void) => this {
    return (factory) => {
      for (const method of methods) {
        this.describe(method, factory);
      }

      return this;
    };
  }

  /**
   * Should never be called from tests.
   *
   * Checks that all methods in the module have associated tests.
   * This method will be called automatically at the end of each run.
   */
  expectAllMethodsToBeTested(): void {
    const actual = [...this.tested].sort();
    const expected = Object.entries(this.module)
      .filter(([, value]) => typeof value === 'function')
      .map(([key]) => key)
      .sort();
    vi_it('should test all methods', () => {
      expect(actual).toEqual(expected);
    });
  }
}

/**
 * Lazily collects the current call stack with an additional offset.
 *
 * Vitest's stacktraces only contain the stacktrace from inside `it(name, () => { here })`.
 * This method collects the location where the `it` block is created instead of executed.
 * The stack frames can then later be added to the error stack to provide a more accurate location.
 *
 * @param extraOffset The additional offset to add to the column numbers to account for the name of the test.
 */
function collectExtraStackFrames(extraOffset: number = 0): () => string[] {
  const stack = new Error('collect').stack;
  if (stack == null) {
    return () => [];
  }

  return () =>
    stack
      .split('\n')
      .map((e) => e.replaceAll('\\', '/')) // Windows to Linux paths
      .filter((e) => e.includes('/test/')) // exclude node_modules
      .filter((e) => !e.includes('/test/support/')) // exclude this file
      .map((e) =>
        e.replace(/:(\d+)$/, (_, column: string) => `:${+column + extraOffset}`)
      );
}

/**
 * Modifies the error stack to include the given additional stack frames after the last occurrence of this file.
 *
 * @param error The error to modify.
 * @param extraStackFrames The additional stack frames to add.
 */
function patchExtraStackFrames(
  error: unknown,
  extraStackFrames: () => string[]
): unknown {
  if (error instanceof Error && error.stack != null) {
    const stack = error.stack.split('\n');
    const index = stack.findLastIndex((e) =>
      e
        .replaceAll('\\', '/') // Windows to Linux paths
        .includes('/test/support/')
    );
    stack.splice(index + 1, 0, ...extraStackFrames());
    error.stack = stack.join('\n');
  }

  return error;
}

/**
 * Simple interface for a test generator for a given method.
 */
interface MethodTester<TMethod extends Callable> {
  /**
   * Generates a test for the method.
   *
   * @param name The name of the test case.
   * @param args The arguments to use in the test.
   */
  it(name: string, ...args: Parameters<TMethod>): this;

  /**
   * Generates a repeated test for the method.
   * The seed is not reset between repetitions.
   *
   * @param name The name of the test case.
   * @param repetitions The number of repetitions to run.
   * @param args The arguments to use in the test.
   */
  itRepeated(
    name: string,
    repetitions: number,
    ...args: Parameters<TMethod>
  ): this;
}
