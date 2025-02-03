import { describe, expect, it } from 'vitest';
import { CssFunction, CssSpace, faker } from '../../src';
import { seededTests } from '../support/seeded-runs';
import { times } from './../support/times';

const NON_SEEDED_BASED_RUN = 5;

describe('color', () => {
  seededTests(faker, 'color', (t) => {
    t.itEach(
      'human',
      'space',
      'cssSupportedFunction',
      'cssSupportedSpace',
      'rgb',
      'hsl',
      'hwb',
      'cmyk',
      'lab',
      'lch',
      'colorByCSSColorSpace'
    );
  });

  describe.each(times(NON_SEEDED_BASED_RUN).map(() => faker.seed()))(
    'random seeded tests for seed %i',
    () => {
      describe(`human()`, () => {
        it('should return random human readable color from human color array', () => {
          const color = faker.color.human();
          expect(faker.definitions.color.human).toContain(color);
        });
      });

      describe(`space()`, () => {
        it('should return random color space from color space array', () => {
          const space = faker.color.space();
          expect(faker.definitions.color.space).toContain(space);
        });
      });

      describe(`cssSupportedFunction()`, () => {
        it('should return random css supported color function from css functions array', () => {
          const func = faker.color.cssSupportedFunction();
          expect(Object.values(CssFunction)).toContain(func);
        });
      });

      describe(`cssSupportedSpace()`, () => {
        it('should return random css supported color space from css spaces array', () => {
          const space = faker.color.cssSupportedSpace();
          expect(Object.values(CssSpace)).toContain(space);
        });
      });

      describe(`rgb()`, () => {
        it('should return a random rgb hex color', () => {
          const color = faker.color.rgb();
          expect(color).match(/^(#[a-f0-9]{6})$/);
        });
      });

      describe(`rgb({ prefix: '0x' })`, () => {
        it('should return a random rgb hex color with # prefix', () => {
          const color = faker.color.rgb({ prefix: '0x' });
          expect(color).match(/^(0x[a-f0-9]{6})$/);
        });
      });

      describe(`rgbHex({ prefix: '0x', casing: 'lower' })`, () => {
        it('should return a random rgb hex color with # prefix and lower casing only', () => {
          const color = faker.color.rgb({ prefix: '0x', casing: 'lower' });
          expect(color).match(/^(0x[a-f0-9]{6})$/);
        });
      });

      describe(`rgb({ prefix: '0x', casing: 'upper' })`, () => {
        it('should return a random rgb hex color with # prefix and upper casing only', () => {
          const color = faker.color.rgb({ prefix: '0x', casing: 'upper' });
          expect(color).match(/^(0x[A-F0-9]{6})$/);
        });
      });

      describe(`rgb({ format: 'decimal' })`, () => {
        it('should return a random rgb color in decimal format', () => {
          const color = faker.color.rgb({ format: 'decimal' });
          expect(color).length(3);
          for (const value of color) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(255);
          }
        });
      });

      describe(`rgb({ format: 'css' })`, () => {
        it('should return a random rgb color in css format', () => {
          const color = faker.color.rgb({ format: 'css' });
          expect(color).match(/^(rgb\([0-9]{1,3}, [0-9]{1,3}, [0-9]{1,3}\))$/);
        });
      });

      describe(`rgb({ format: 'binary' })`, () => {
        it('should return a random rgb color in binary format', () => {
          const color = faker.color.rgb({ format: 'binary' });
          expect(color).match(/^([01]{8} [01]{8} [01]{8})$/);
        });
      });

      describe(`rgb({ includeAlpha: true })`, () => {
        it('should return a random rgb color in hex format with alpha value', () => {
          const color = faker.color.rgb({ includeAlpha: true });
          expect(color).match(/^(#[a-fA-F0-9]{8})$/);
        });
      });

      describe(`rgb({ format: 'decimal', includeAlpha: true })`, () => {
        it('should return a random rgb color in hex format with alpha value', () => {
          const color = faker.color.rgb({
            format: 'decimal',
            includeAlpha: true,
          });
          expect(color.at(-1)).toBeGreaterThanOrEqual(0);
          expect(color.at(-1)).toBeLessThanOrEqual(1);
          for (const value of color.slice(0, 4)) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(255);
          }
        });
      });

      describe(`rgb({ format: 'binary', includeAlpha: true })`, () => {
        it('should return a random rgb color in binary format with alpha value', () => {
          const color = faker.color.rgb({
            format: 'binary',
            includeAlpha: true,
          });
          expect(color).match(/^([01]{8} [01]{8} [01]{8} [01]{8,32})$/);
        });
      });

      describe(`rgb({ format: 'css', includeAlpha: true })`, () => {
        it('should return a random rgb color in css format with alpha value', () => {
          const color = faker.color.rgb({ format: 'css', includeAlpha: true });
          expect(color).match(
            /^(rgba\([0-9]{1,3}, [0-9]{1,3}, [0-9]{1,3}, \d*\.?\d*\))$/
          );
        });
      });

      describe(`cmyk()`, () => {
        it('should return a random cmyk color', () => {
          const color = faker.color.cmyk();
          expect(color).length(4);
          for (const value of color) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          }
        });
      });

      describe(`cmyk({ format: 'decimal' })`, () => {
        it('should return a random cmyk color in decimal format', () => {
          const color = faker.color.cmyk({ format: 'decimal' });
          expect(color).length(4);
          for (const value of color) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          }
        });
      });

      describe(`cmyk({ format: 'css' })`, () => {
        it('should return a random cmyk color in css format', () => {
          const color = faker.color.cmyk({ format: 'css' });
          expect(color).match(
            /^(cmyk\([0-9]{1,3}%, [0-9]{1,3}%, [0-9]{1,3}%, [0-9]{1,3}%\))$/
          );
        });
      });

      describe(`cmyk({ format: 'binary' })`, () => {
        it('should return a random cmyk color in binary format', () => {
          const color = faker.color.cmyk({ format: 'binary' });
          expect(color).match(
            /^([01]{8,32} [01]{8,32} [01]{8,32} [01]{8,32})$/
          );
        });
      });

      describe(`hsl()`, () => {
        it('should return a random hsl color in decimal format', () => {
          const color = faker.color.hsl();
          expect(color).length(3);
          expect(color[0]).toBeGreaterThanOrEqual(0);
          expect(color[0]).toBeLessThanOrEqual(360);
          for (const value of color.slice(1)) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          }
        });
      });

      describe(`hsl({ format: 'css' })`, () => {
        it('should return a random hsl color in css format', () => {
          const color = faker.color.hsl({ format: 'css' });
          expect(color).match(
            /^(hsl\([0-9]{1,3}deg [0-9]{1,3}% [0-9]{1,3}%\))$/
          );
        });
      });

      describe(`hsl({ format: 'css', includeAlpha: true })`, () => {
        it('should return a random hsl color in css format with an alpha value', () => {
          const color = faker.color.hsl({ format: 'css', includeAlpha: true });
          expect(color).match(
            /^(hsl\([0-9]{1,3}deg [0-9]{1,3}% [0-9]{1,3}% \/ \d*\.?\d*\))$/
          );
        });
      });

      describe(`hsl({ format: 'binary' })`, () => {
        it('should return a random hsl color in binary format', () => {
          const color = faker.color.hsl({ format: 'binary' });
          expect(color).match(/^([01]{8,32} [01]{8,32} [01]{8,32})$/);
        });
      });

      describe(`hsl({ format: 'binary', includeAlpha: true })`, () => {
        it('should return a random hsl color in binary format with an alpha value', () => {
          const color = faker.color.hsl({
            format: 'binary',
            includeAlpha: true,
          });
          expect(color).match(
            /^([01]{8,32} [01]{8,32} [01]{8,32} [01]{8,32})$/
          );
        });
      });

      describe(`hwb()`, () => {
        it('should return a random hwb color in decimal format', () => {
          const color = faker.color.hwb();
          expect(color).length(3);
          expect(color[0]).toBeGreaterThanOrEqual(0);
          expect(color[0]).toBeLessThanOrEqual(360);
          for (const value of color.slice(1)) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          }
        });
      });

      describe(`hwb({ format: 'decimal' })`, () => {
        it('should return a random hwb color in decimal format', () => {
          const color = faker.color.hwb();
          expect(color).length(3);
          expect(color[0]).toBeGreaterThanOrEqual(0);
          expect(color[0]).toBeLessThanOrEqual(360);
          for (const value of color.slice(1)) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          }
        });
      });

      describe(`hwb({ format: 'css' })`, () => {
        it('should return a random hwb color in css format', () => {
          const color = faker.color.hwb({ format: 'css' });
          expect(color).match(/^(hwb\([0-9]{1,3} [0-9]{1,3}% [0-9]{1,3}%\))$/);
        });
      });

      describe(`hwb({ format: 'binary' })`, () => {
        it('should return a random hwb color in binary format', () => {
          const color = faker.color.hwb({ format: 'binary' });
          expect(color).match(/^([01]{8,32} [01]{8,32} [01]{8,32})$/);
        });
      });

      describe(`lab()`, () => {
        it('should return a random lab color in decimal format', () => {
          const color = faker.color.lab();
          expect(color).length(3);
          expect(color[0]).toBeGreaterThanOrEqual(0);
          expect(color[0]).toBeLessThanOrEqual(1);
          for (const value of color) {
            expect(value).toBeGreaterThanOrEqual(-100);
            expect(value).toBeLessThanOrEqual(100);
          }
        });
      });

      describe(`lab({ format: 'decimal' })`, () => {
        it('should return a random lab color in decimal format', () => {
          const color = faker.color.lab({ format: 'decimal' });
          expect(color).length(3);
          expect(color[0]).toBeGreaterThanOrEqual(0);
          expect(color[0]).toBeLessThanOrEqual(1);
          for (const value of color) {
            expect(value).toBeGreaterThanOrEqual(-100);
            expect(value).toBeLessThanOrEqual(100);
          }
        });
      });

      describe(`lab({ format: 'css' })`, () => {
        it('should return a random lab color in css format', () => {
          const color = faker.color.lab({ format: 'css' });
          expect(color).match(
            /^(lab\((\d*\.?\d*|[0-9]{1,3})% -?\d*\.?\d* -?\d*\.?\d*\))$/
          );
        });
      });

      describe(`lab({ format: 'binary' })`, () => {
        it('should return a random lab color in binary format', () => {
          const color = faker.color.lab({ format: 'binary' });
          expect(color).match(/^([01]{8,32} [01]{8,32} [01]{8,32})$/);
        });
      });

      describe(`lch()`, () => {
        it('should return a random lch color in decimal format', () => {
          const color = faker.color.lch();
          expect(color).length(3);
          expect(color[0]).toBeGreaterThanOrEqual(0);
          expect(color[0]).toBeLessThanOrEqual(1);
          for (const value of color) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(230);
          }
        });
      });

      describe(`lch({ format: 'decimal' })`, () => {
        it('should return a random lch color in decimal format', () => {
          const color = faker.color.lch({ format: 'decimal' });
          expect(color).length(3);
          expect(color[0]).toBeGreaterThanOrEqual(0);
          expect(color[0]).toBeLessThanOrEqual(1);
          for (const value of color) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(230);
          }
        });
      });

      describe(`lch({ format: 'css' })`, () => {
        it('should return a random lch color in css format', () => {
          const color = faker.color.lch({ format: 'css' });
          expect(color).match(
            /^(lch\((\d*\.?\d*|[0-9]{1,3})% \d*\.?\d* \d*\.?\d*\))$/
          );
        });
      });

      describe(`lch({ format: 'binary' })`, () => {
        it('should return a random lch color in binary format', () => {
          const color = faker.color.lch({ format: 'binary' });
          expect(color).match(/^([01]{8,32} [01]{8,32} [01]{8,32})$/);
        });
      });

      describe(`colorByCSSColorSpace()`, () => {
        it('should return a random color for a CSS color space in decimal format', () => {
          const color = faker.color.colorByCSSColorSpace();
          expect(color).length(3);
          for (const value of color) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          }
        });
      });

      describe(`colorByCSSColorSpace({ format: 'decimal' })`, () => {
        it('should return a random color for a CSS color space in decimal format', () => {
          const color = faker.color.colorByCSSColorSpace({ format: 'decimal' });
          expect(color).length(3);
          for (const value of color) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          }
        });
      });

      describe(`colorByCSSColorSpace({ format: 'css' })`, () => {
        it('should return a random color for a CSS color space in css format', () => {
          const color = faker.color.colorByCSSColorSpace({
            format: 'css',
            space: 'prophoto-rgb',
          });
          expect(color).match(
            /^color\(prophoto-rgb \d*\.?\d* \d*\.?\d* \d*\.?\d*\)$/
          );
        });
      });

      describe(`colorByCSSColorSpace({ format: 'binary' })`, () => {
        it('should return a random color for a CSS color space in binary format', () => {
          const color = faker.color.colorByCSSColorSpace({ format: 'binary' });
          expect(color).match(/^([01]{8,32} [01]{8,32} [01]{8,32})$/);
        });
      });
    }
  );
});
