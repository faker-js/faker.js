import { describe, expect, it } from 'vitest';
import { toRefreshFunction } from '../../../scripts/apidocs/output/page';
import type { RawApiDocsMethod } from '../../../scripts/apidocs/processing/method';
import type { RawApiDocsSignature } from '../../../scripts/apidocs/processing/signature';

function newTestMethod(
  signature: Partial<RawApiDocsSignature>
): RawApiDocsMethod {
  return {
    name: 'test',
    signatures: [
      {
        deprecated: 'deprecated',
        description: 'description',
        since: 'since',
        parameters: [],
        returns: {
          type: 'simple',
          text: 'returns',
        },
        throws: [],
        signature: 'signature',
        examples: [],
        seeAlsos: [],
        ...signature,
      },
    ],
    source: {
      filePath: 'test/page.spec.ts',
      line: 1,
      column: 1,
    },
  };
}

describe('toRefreshFunction', () => {
  it("should return 'undefined' when there are no faker calls", async () => {
    // given
    const method = newTestMethod({
      examples: ['const a = 1;'],
    });

    // when
    const result = await toRefreshFunction(method);

    // then
    expect(result).toBe('undefined');
  });

  it('should handle single line calls with semicolon', async () => {
    // given
    const method = newTestMethod({
      examples: ['faker.number.int(); // 834135'],
    });

    // when
    const result = await toRefreshFunction(method);

    // then
    expect(result).toMatchSnapshot();
  });

  it('should handle single line calls without semicolon', async () => {
    // given
    const method = newTestMethod({
      examples: ['faker.number.int() // 834135'],
    });

    // when
    const result = await toRefreshFunction(method);

    // then
    expect(result).toMatchSnapshot();
  });

  it('should handle multiple calls', async () => {
    // given
    const method = newTestMethod({
      examples: ['faker.number.int()', 'faker.number.int()'],
    });

    // when
    const result = await toRefreshFunction(method);

    // then
    expect(result).toMatchSnapshot();
  });

  it('should handle multiline calls', async () => {
    // given
    const method = newTestMethod({
      examples: 'faker.number.int({\n  min: 1,\n  max: 10\n})'.split('\n'),
    });

    // when
    const result = await toRefreshFunction(method);

    // then
    expect(result).toMatchSnapshot();
  });

  it('should handle properties after calls', async () => {
    // given
    const method = newTestMethod({
      examples: ['faker.airline.airport().name'],
    });

    // when
    const result = await toRefreshFunction(method);

    // then
    expect(result).toMatchSnapshot();
  });
});
