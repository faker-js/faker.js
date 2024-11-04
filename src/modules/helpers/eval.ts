import { FakerError } from '../../errors/faker-error';
import type { Faker } from '../../faker';

const REGEX_DOT_OR_BRACKET = /\.|\(/;

/**
 * Resolves the given expression and returns its result. This method should only be used when using serialized expressions.
 *
 * This method is useful if you have to build a random string from a static, non-executable source
 * (e.g. string coming from a developer, stored in a database or a file).
 *
 * It tries to resolve the expression on the given/default entrypoints:
 *
 * ```js
 * const firstName = fakeEval('person.firstName', faker);
 * const firstName2 = fakeEval('person.first_name', faker);
 * ```
 *
 * Is equivalent to:
 *
 * ```js
 * const firstName = faker.person.firstName();
 * const firstName2 = faker.helpers.arrayElement(faker.rawDefinitions.person.first_name);
 * ```
 *
 * You can provide parameters as well. At first, they will be parsed as json,
 * and if that isn't possible, it will fall back to string:
 *
 * ```js
 * const message = fakeEval('phone.number(+!# !## #### #####!)', faker);
 * ```
 *
 * It is also possible to use multiple parameters (comma separated).
 *
 * ```js
 * const pin = fakeEval('string.numeric(4, {"allowLeadingZeros": true})', faker);
 * ```
 *
 * This method can resolve expressions with varying depths (dot separated parts).
 *
 * ```ts
 * const airlineModule = fakeEval('airline', faker); // AirlineModule
 * const airlineObject = fakeEval('airline.airline', faker); // { name: 'Etihad Airways', iataCode: 'EY' }
 * const airlineCode = fakeEval('airline.airline.iataCode', faker); // 'EY'
 * const airlineName = fakeEval('airline.airline().name', faker); // 'Etihad Airways'
 * const airlineMethodName = fakeEval('airline.airline.name', faker); // 'bound airline'
 * ```
 *
 * It is NOT possible to access any values not passed as entrypoints.
 *
 * This method will never return arrays, as it will pick a random element from them instead.
 *
 * @param expression The expression to evaluate on the entrypoints.
 * @param faker The faker instance to resolve array elements.
 * @param entrypoints The entrypoints to use when evaluating the expression.
 *
 * @see faker.helpers.fake() If you wish to have a string with multiple expressions.
 *
 * @example
 * fakeEval('person.lastName', faker) // 'Barrows'
 * fakeEval('helpers.arrayElement(["heads", "tails"])', faker) // 'tails'
 * fakeEval('number.int(9999)', faker) // 4834
 *
 * @since 8.4.0
 */
export function fakeEval(
  expression: string,
  faker: Faker,
  entrypoints: ReadonlyArray<unknown> = [faker, faker.rawDefinitions]
): unknown {
  if (expression.length === 0) {
    throw new FakerError('Eval expression cannot be empty.');
  }

  if (entrypoints.length === 0) {
    throw new FakerError('Eval entrypoints cannot be empty.');
  }

  let current = entrypoints;
  let remaining = expression;
  do {
    let index: number;
    if (remaining.startsWith('(')) {
      [index, current] = evalProcessFunction(remaining, current, expression);
    } else {
      [index, current] = evalProcessExpression(remaining, current);
    }

    remaining = remaining.substring(index);

    // Remove garbage and resolve array values
    current = current
      .filter((value) => value != null)
      .map((value): unknown =>
        Array.isArray(value) ? faker.helpers.arrayElement(value) : value
      );
  } while (remaining.length > 0 && current.length > 0);

  if (current.length === 0) {
    throw new FakerError(`Cannot resolve expression '${expression}'`);
  }

  const value = current[0];
  return typeof value === 'function' ? value() : value;
}

/**
 * Evaluates a function call and returns the new read index and the mapped results.
 *
 * @param input The input string to parse.
 * @param entrypoints The entrypoints to attempt the call on.
 * @param expression The full expression to use in errors.
 */
function evalProcessFunction(
  input: string,
  entrypoints: ReadonlyArray<unknown>,
  expression: string
): [continueIndex: number, mapped: unknown[]] {
  const [index, params] = findParams(input);
  const nextChar = input[index + 1];
  switch (nextChar) {
    case '.':
    case '(':
    case undefined: {
      break; // valid
    }

    default: {
      throw new FakerError(
        `Expected dot ('.'), open parenthesis ('('), or nothing after function call but got '${nextChar}'`
      );
    }
  }

  return [
    index + (nextChar === '.' ? 2 : 1), // one for the closing bracket, one for the dot
    entrypoints.map((entrypoint): unknown =>
      // TODO @ST-DDT 2023-12-11: Replace in v10
      // typeof entrypoint === 'function' ? entrypoint(...params) : undefined
      {
        if (typeof entrypoint === 'function') {
          return entrypoint(...params);
        }

        // eslint-disable-next-line no-undef
        console.warn(
          `[@faker-js/faker]: Invoking expressions which are not functions is deprecated since v9.0 and will be removed in v10.0.
Please remove the parentheses or replace the expression with an actual function.
${expression}
${' '.repeat(expression.length - input.length)}^`
        );

        return entrypoint;
      }
    ),
  ];
}

/**
 * Tries to find the parameters of a function call.
 *
 * @param input The input string to parse.
 */
function findParams(input: string): [continueIndex: number, params: unknown[]] {
  let index = input.indexOf(')', 1);
  if (index === -1) {
    throw new FakerError(`Missing closing parenthesis in '${input}'`);
  }

  while (index !== -1) {
    const params = input.substring(1, index);
    try {
      // assuming that the params are valid JSON
      return [index, JSON.parse(`[${params}]`) as unknown[]];
    } catch {
      if (!params.includes("'") && !params.includes('"')) {
        try {
          // assuming that the params are a single unquoted string
          return [index, JSON.parse(`["${params}"]`) as unknown[]];
        } catch {
          // try again with the next index
        }
      }
    }

    index = input.indexOf(')', index + 1);
  }

  index = input.lastIndexOf(')');
  const params = input.substring(1, index);
  return [index, [params]];
}

/**
 * Processes one expression part and returns the new read index and the mapped results.
 *
 * @param input The input string to parse.
 * @param entrypoints The entrypoints to resolve on.
 */
function evalProcessExpression(
  input: string,
  entrypoints: ReadonlyArray<unknown>
): [continueIndex: number, mapped: unknown[]] {
  const result = REGEX_DOT_OR_BRACKET.exec(input);
  const dotMatch = (result?.[0] ?? '') === '.';
  const index = result?.index ?? input.length;
  const key = input.substring(0, index);
  if (key.length === 0) {
    throw new FakerError(`Expression parts cannot be empty in '${input}'`);
  }

  const next = input[index + 1];
  if (dotMatch && (next == null || next === '.' || next === '(')) {
    throw new FakerError(`Found dot without property name in '${input}'`);
  }

  return [
    index + (dotMatch ? 1 : 0),
    entrypoints.map((entrypoint) => resolveProperty(entrypoint, key)),
  ];
}

/**
 * Resolves the given property on the given entrypoint.
 *
 * @param entrypoint The entrypoint to resolve the property on.
 * @param key The property name to resolve.
 */
function resolveProperty(entrypoint: unknown, key: string): unknown {
  switch (typeof entrypoint) {
    case 'function': {
      try {
        entrypoint = entrypoint();
      } catch {
        return undefined;
      }

      return entrypoint?.[key as keyof typeof entrypoint];
    }

    case 'object': {
      return entrypoint?.[key as keyof typeof entrypoint];
    }

    default: {
      return undefined;
    }
  }
}
