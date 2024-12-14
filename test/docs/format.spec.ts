import { describe, expect, it } from 'vitest';
import { formatResult } from '../../docs/.vitepress/components/api-docs/format';

describe('formatResult', () => {
  it('should format undefined', () => {
    const value = undefined;
    const actual = formatResult(value);

    expect(actual).toBeTypeOf('string');
    expect(actual).toBe('undefined');
    expect(actual).toMatchSnapshot();
  });

  it('should format bigint', () => {
    const actual = formatResult(135464154865415n);

    expect(actual).toBeTypeOf('string');
    expect(actual).toMatchSnapshot();
  });

  it('should format object', () => {
    const actual = formatResult({ a: 1, b: '2' });

    expect(actual).toBeTypeOf('string');
    expect(actual).toMatchSnapshot();
  });

  it('should format array', () => {
    const actual = formatResult([1, '2']);

    expect(actual).toBeTypeOf('string');
    expect(actual).toMatchSnapshot();
  });

  it('should format string', () => {
    const actual = formatResult('a simple string');

    expect(actual).toBeTypeOf('string');
    expect(actual).toMatchSnapshot();
  });

  it('should format string with special characters', () => {
    const actual = formatResult('string with "special" characters');

    expect(actual).toBeTypeOf('string');
    expect(actual).toMatchSnapshot();
  });

  it('should format string with new lines', () => {
    const actual = formatResult('string\nwith\nnew\nlines');

    expect(actual).toBeTypeOf('string');
    expect(actual).toMatchSnapshot();
  });

  it('should format number', () => {
    const actual = formatResult(123);

    expect(actual).toBeTypeOf('string');
    expect(actual).toMatchSnapshot();
  });

  it('should format Date', () => {
    const actual = formatResult(new Date(Date.UTC(2025, 0, 1)));

    expect(actual).toBeTypeOf('string');
    expect(actual).toMatchSnapshot();
  });
});
