import { ModuleBase } from '../../internal/module-base';

/**
 * Color space names supported by CSS.
 */
export enum CssSpace {
  SRGB = 'sRGB',
  DisplayP3 = 'display-p3',
  REC2020 = 'rec2020',
  A98RGB = 'a98-rgb',
  ProphotoRGB = 'prophoto-rgb',
}

/**
 * Color space names supported by CSS.
 */
export type CssSpaceType = `${CssSpace}`;

/**
 * Functions supported by CSS to produce color.
 */
export enum CssFunction {
  RGB = 'rgb',
  RGBA = 'rgba',
  HSL = 'hsl',
  HSLA = 'hsla',
  HWB = 'hwb',
  CMYK = 'cmyk',
  LAB = 'lab',
  LCH = 'lch',
  COLOR = 'color',
}

/**
 * Functions supported by CSS to produce color.
 */
export type CssFunctionType = `${CssFunction}`;

export type StringColorFormat = 'css' | 'binary';
export type NumberColorFormat = 'decimal';
export type ColorFormat = StringColorFormat | NumberColorFormat;
export type Casing = 'lower' | 'upper' | 'mixed';

/**
 * Formats the hex format of a generated color string according
 * to options specified by user.
 *
 * @param hexColor Hex color string to be formatted.
 * @param options Options object.
 * @param options.prefix Prefix of the generated hex color.
 * @param options.casing Letter type case of the generated hex color.
 */
function formatHexColor(
  hexColor: string,
  options: {
    prefix: string;
    casing: Casing;
  }
): string {
  const { prefix, casing } = options;

  switch (casing) {
    case 'upper': {
      hexColor = hexColor.toUpperCase();
      break;
    }

    case 'lower': {
      hexColor = hexColor.toLowerCase();
      break;
    }

    case 'mixed':
    // Do nothing
  }

  if (prefix) {
    hexColor = prefix + hexColor;
  }

  return hexColor;
}

/**
 * Converts an array of numbers into binary string format.
 *
 * @param values Array of values to be converted.
 */
function toBinary(values: number[]): string {
  const binary: string[] = values.map((value) => {
    const isFloat = value % 1 !== 0;
    if (isFloat) {
      const buffer = new ArrayBuffer(4);
      new DataView(buffer).setFloat32(0, value);
      const bytes = new Uint8Array(buffer);
      return toBinary([...bytes]).replaceAll(' ', '');
    }

    return (value >>> 0).toString(2).padStart(8, '0');
  });
  return binary.join(' ');
}

/**
 * Converts the given value to a percentage (`round(value * 100)`).
 *
 * @param value The value to convert to a percentage.
 */
function toPercentage(value: number): number {
  return Math.round(value * 100);
}

/**
 * Converts an array of numbers into CSS accepted format.
 *
 * @param values Array of values to be converted.
 * @param cssFunction CSS function to be generated for the color. Defaults to `'rgb'`.
 * @param space Color space to format CSS color function with. Defaults to `'sRGB'`.
 */
function toCSS(
  values: number[],
  cssFunction: CssFunctionType = 'rgb',
  space: CssSpaceType = 'sRGB'
): string {
  switch (cssFunction) {
    case 'rgba': {
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${values[3]})`;
    }

    case 'color': {
      return `color(${space} ${values[0]} ${values[1]} ${values[2]})`;
    }

    case 'cmyk': {
      return `cmyk(${toPercentage(values[0])}%, ${toPercentage(
        values[1]
      )}%, ${toPercentage(values[2])}%, ${toPercentage(values[3])}%)`;
    }

    case 'hsl': {
      return `hsl(${values[0]}deg ${toPercentage(values[1])}% ${toPercentage(
        values[2]
      )}%)`;
    }

    case 'hsla': {
      return `hsl(${values[0]}deg ${toPercentage(values[1])}% ${toPercentage(
        values[2]
      )}% / ${toPercentage(values[3])})`;
    }

    case 'hwb': {
      return `hwb(${values[0]} ${toPercentage(values[1])}% ${toPercentage(
        values[2]
      )}%)`;
    }

    case 'lab': {
      return `lab(${toPercentage(values[0])}% ${values[1]} ${values[2]})`;
    }

    case 'lch': {
      return `lch(${toPercentage(values[0])}% ${values[1]} ${values[2]})`;
    }

    case 'rgb': {
      return `rgb(${values[0]}, ${values[1]}, ${values[2]})`;
    }
  }
}

/**
 * Converts an array of color values to the specified color format.
 *
 * @param values Array of color values to be converted.
 * @param format Format of generated RGB color.
 * @param cssFunction CSS function to be generated for the color. Defaults to `'rgb'`.
 * @param space Color space to format CSS color function with. Defaults to `'sRGB'`.
 */
function toColorFormat(
  values: number[],
  format: ColorFormat,
  cssFunction: CssFunctionType = 'rgb',
  space: CssSpaceType = 'sRGB'
): string | number[] {
  switch (format) {
    case 'css': {
      return toCSS(values, cssFunction, space);
    }

    case 'binary': {
      return toBinary(values);
    }

    case 'decimal': {
      return values;
    }
  }
}

/**
 * Module to generate colors.
 *
 * ### Overview
 *
 * For a human-readable color like `'red'`, use [`human()`](https://fakerjs.dev/api/color.html#human).
 *
 * For a hex color like `#ff0000` used in HTML/CSS, use [`rgb()`](https://fakerjs.dev/api/color.html#rgb). There are also methods for other color formats such as [`hsl()`](https://fakerjs.dev/api/color.html#hsl), [`cmyk()`](https://fakerjs.dev/api/color.html#cmyk), [`hwb()`](https://fakerjs.dev/api/color.html#hwb), [`lab()`](https://fakerjs.dev/api/color.html#lab), and [`lch()`](https://fakerjs.dev/api/color.html#lch).
 */
export class ColorModule extends ModuleBase {
  /**
   * Returns a random human-readable color name.
   *
   * @example
   * faker.color.human() // 'orchid'
   *
   * @since 7.0.0
   */
  human(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.color.human);
  }

  /**
   * Returns a random color space name from the worldwide accepted color spaces.
   * Source: https://en.wikipedia.org/wiki/List_of_color_spaces_and_their_uses
   *
   * @example
   * faker.color.space() // 'Natural Color System (NSC)'
   *
   * @since 7.0.0
   */
  space(): string {
    return this.faker.helpers.arrayElement(this.faker.definitions.color.space);
  }

  /**
   * Returns a random css supported color function name.
   *
   * @example
   * faker.color.cssSupportedFunction() // 'hwb'
   *
   * @since 7.0.0
   */
  cssSupportedFunction(): CssFunctionType {
    return this.faker.helpers.enumValue(CssFunction);
  }

  /**
   * Returns a random css supported color space name.
   *
   * @example
   * faker.color.cssSupportedSpace() // 'rec2020'
   *
   * @since 7.0.0
   */
  cssSupportedSpace(): CssSpaceType {
    return this.faker.helpers.enumValue(CssSpace);
  }

  /**
   * Returns an RGB color.
   *
   * @example
   * faker.color.rgb() // '#cfdb9e'
   *
   * @since 7.0.0
   */
  rgb(): string;
  /**
   * Returns an RGB color.
   *
   * @param options Options object.
   * @param options.prefix Prefix of the generated hex color. Only applied when 'hex' format is used. Defaults to `'#'`.
   * @param options.casing Letter type case of the generated hex color. Only applied when `'hex'` format is used. Defaults to `'lower'`.
   * @param options.format Format of generated RGB color. Defaults to `hex`.
   * @param options.includeAlpha Adds an alpha value to the color (RGBA). Defaults to `false`.
   *
   * @example
   * faker.color.rgb() // '#cfdb9e'
   * faker.color.rgb({ prefix: '0x' }) // '0x9df8bb'
   * faker.color.rgb({ casing: 'upper' }) // '#CE110C'
   * faker.color.rgb({ casing: 'lower' }) // '#bdfbab'
   * faker.color.rgb({ prefix: '#', casing: 'lower' }) // '#2e3eb9'
   * faker.color.rgb({ format: 'hex', casing: 'lower' }) // '#5bac0d'
   * faker.color.rgb({ format: 'css' }) // 'rgb(156, 157, 241)'
   * faker.color.rgb({ format: 'binary' }) // '10101110 01011100 01101111'
   * faker.color.rgb({ includeAlpha: true }) // '#f1ee4268'
   * faker.color.rgb({ format: 'css', includeAlpha: true }) // 'rgba(145, 112, 253, 0.1)'
   *
   * @since 7.0.0
   */
  rgb(options?: {
    /**
     * Prefix of the generated hex color. Only applied when 'hex' format is used.
     *
     * @default '#'
     */
    prefix?: string;
    /**
     * Letter type case of the generated hex color. Only applied when `'hex'` format is used.
     *
     * @default 'lower'
     */
    casing?: Casing;
    /**
     * Format of generated RGB color.
     *
     * @default 'hex'
     */
    format?: 'hex' | StringColorFormat;
    /**
     * Adds an alpha value to the color (RGBA).
     *
     * @default false
     */
    includeAlpha?: boolean;
  }): string;
  /**
   * Returns an RGB color.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'hex'`.
   * @param options.includeAlpha Adds an alpha value to the color (RGBA). Defaults to `false`.
   *
   * @example
   * faker.color.rgb() // '#cfdb9e'
   * faker.color.rgb({ format: 'decimal' }) // [ 112, 228, 246 ]
   * faker.color.rgb({ format: 'decimal', includeAlpha: true }) // [ 98, 202, 135, 0.57 ]
   *
   * @since 7.0.0
   */
  rgb(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'hex'
     */
    format?: NumberColorFormat;
    /**
     * Adds an alpha value to the color (RGBA).
     *
     * @default false
     */
    includeAlpha?: boolean;
  }): number[];
  /**
   * Returns an RGB color.
   *
   * @param options Options object.
   * @param options.prefix Prefix of the generated hex color. Only applied when `'hex'` format is used. Defaults to `'#'`.
   * @param options.casing Letter type case of the generated hex color. Only applied when `'hex'` format is used. Defaults to `'lower'`.
   * @param options.format Format of generated RGB color. Defaults to `'hex'`.
   * @param options.includeAlpha Adds an alpha value to the color (RGBA). Defaults to `false`.
   *
   * @example
   * faker.color.rgb() // '#cfdb9e'
   * faker.color.rgb({ prefix: '0x' }) // '0x9df8bb'
   * faker.color.rgb({ casing: 'upper' }) // '#CE110C'
   * faker.color.rgb({ casing: 'lower' }) // '#bdfbab'
   * faker.color.rgb({ prefix: '#', casing: 'lower' }) // '#2e3eb9'
   * faker.color.rgb({ format: 'hex', casing: 'lower' }) // '#5bac0d'
   * faker.color.rgb({ format: 'decimal' }) // [ 156, 157, 241 ]
   * faker.color.rgb({ format: 'css' }) // 'rgb(174, 92, 111)'
   * faker.color.rgb({ format: 'binary' }) // '10110010 00001111 10101010'
   * faker.color.rgb({ includeAlpha: true }) // '#e4268c9f'
   * faker.color.rgb({ format: 'css', includeAlpha: true }) // 'rgba(26, 53, 41, 0.65)'
   * faker.color.rgb({ format: 'decimal', includeAlpha: true }) // [ 64, 119, 62, 0.16 ]
   *
   * @since 7.0.0
   */
  rgb(options?: {
    /**
     * Prefix of the generated hex color. Only applied when `'hex'` format is used.
     *
     * @default '#'
     */
    prefix?: string;
    /**
     * Letter type case of the generated hex color. Only applied when `'hex'` format is used.
     *
     * @default 'lower'
     */
    casing?: Casing;
    /**
     * Format of generated RGB color.
     *
     * @default 'hex'
     */
    format?: 'hex' | ColorFormat;
    /**
     * Adds an alpha value to the color (RGBA).
     *
     * @default false
     */
    includeAlpha?: boolean;
  }): string | number[];
  rgb(
    options: {
      prefix?: string;
      casing?: Casing;
      format?: 'hex' | ColorFormat;
      includeAlpha?: boolean;
    } = {}
  ): string | number[] {
    const {
      format = 'hex',
      includeAlpha = false,
      prefix = '#',
      casing = 'lower',
    } = options;
    let color: string | number[];
    let cssFunction: CssFunctionType = 'rgb';
    if (format === 'hex') {
      color = this.faker.string.hexadecimal({
        length: includeAlpha ? 8 : 6,
        prefix: '',
      });
      color = formatHexColor(color, { prefix, casing });
      return color;
    }

    color = Array.from({ length: 3 }, () => this.faker.number.int(255));
    if (includeAlpha) {
      color.push(this.faker.number.float({ multipleOf: 0.01 }));
      cssFunction = 'rgba';
    }

    return toColorFormat(color, format, cssFunction);
  }

  /**
   * Returns a CMYK color.
   *
   * @example
   * faker.color.cmyk() // [ 0.55, 0.72, 0.6, 0.55 ]
   *
   * @since 7.0.0
   */
  cmyk(): number[];
  /**
   * Returns a CMYK color.
   *
   * @param options Options object.
   * @param options.format Format of generated CMYK color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.cmyk() // [ 0.55, 0.72, 0.6, 0.55 ]
   * faker.color.cmyk({ format: 'css' }) // 'cmyk(42%, 65%, 44%, 90%)'
   * faker.color.cmyk({ format: 'binary' }) // '00111111011110000101000111101100 00111110110000101000111101011100 00111111010010100011110101110001 00111111000001111010111000010100'
   *
   * @since 7.0.0
   */
  cmyk(options?: {
    /**
     * Format of generated CMYK color.
     *
     * @default 'decimal'
     */
    format?: StringColorFormat;
  }): string;
  /**
   * Returns a CMYK color.
   *
   * @param options Options object.
   * @param options.format Format of generated CMYK color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.cmyk() // [ 0.55, 0.72, 0.6, 0.55 ]
   * faker.color.cmyk({ format: 'decimal' }) // [ 0.42, 0.65, 0.44, 0.9 ]
   *
   * @since 7.0.0
   */
  cmyk(options?: {
    /**
     * Format of generated CMYK color.
     *
     * @default 'decimal'
     */
    format?: NumberColorFormat;
  }): number[];
  /**
   * Returns a CMYK color.
   *
   * @param options Options object.
   * @param options.format Format of generated CMYK color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.cmyk() // [ 0.55, 0.72, 0.6, 0.55 ]
   * faker.color.cmyk({ format: 'decimal' }) // [ 0.42, 0.65, 0.44, 0.9 ]
   * faker.color.cmyk({ format: 'css' }) // 'cmyk(97%, 38%, 79%, 53%)'
   * faker.color.cmyk({ format: 'binary' }) // '00111111000100011110101110000101 00111111011011100001010001111011 00111101100011110101110000101001 00111101101000111101011100001010'
   *
   * @since 7.0.0
   */
  cmyk(options?: {
    /**
     * Format of generated CMYK color.
     *
     * @default 'decimal'
     */
    format?: ColorFormat;
  }): string | number[];
  cmyk(options: { format?: ColorFormat } = {}): string | number[] {
    const { format = 'decimal' } = options;
    const color: string | number[] = Array.from({ length: 4 }, () =>
      this.faker.number.float({ multipleOf: 0.01 })
    );
    return toColorFormat(color, format, 'cmyk');
  }

  /**
   * Returns an HSL color.
   *
   * @example
   * faker.color.hsl() // [ 198, 0.72, 0.6 ]
   *
   * @since 7.0.0
   */
  hsl(): number[];
  /**
   * Returns an HSL color.
   *
   * @param options Options object.
   * @param options.format Format of generated HSL color. Defaults to `'decimal'`.
   * @param options.includeAlpha Adds an alpha value to the color (RGBA). Defaults to `false`.
   *
   * @example
   * faker.color.hsl() // [ 198, 0.72, 0.6 ]
   * faker.color.hsl({ format: 'css' }) // 'hsl(196deg 42% 65%)'
   * faker.color.hsl({ format: 'css', includeAlpha: true }) // 'hsl(157deg 90% 97% / 38)'
   * faker.color.hsl({ format: 'binary' }) // '100011101 00111111000001111010111000010100 00111111000100011110101110000101'
   * faker.color.hsl({ format: 'binary', includeAlpha: true }) // '101001110 00111101100011110101110000101001 00111101101000111101011100001010 00111100101000111101011100001010'
   *
   * @since 7.0.0
   */
  hsl(options?: {
    /**
     * Format of generated HSL color.
     *
     * @default 'decimal'
     */
    format?: StringColorFormat;
    /**
     * Adds an alpha value to the color (RGBA).
     *
     * @default false
     */
    includeAlpha?: boolean;
  }): string;
  /**
   * Returns an HSL color.
   *
   * @param options Options object.
   * @param options.format Format of generated HSL color. Defaults to `'decimal'`.
   * @param options.includeAlpha Adds an alpha value to the color (RGBA). Defaults to `false`.
   *
   * @example
   * faker.color.hsl() // [ 198, 0.72, 0.6 ]
   * faker.color.hsl({ format: 'decimal' }) // [ 196, 0.42, 0.65 ]
   * faker.color.hsl({ format: 'decimal', includeAlpha: true }) // [ 157, 0.9, 0.97, 0.38 ]
   *
   * @since 7.0.0
   */
  hsl(options?: {
    /**
     * Format of generated HSL color.
     *
     * @default 'decimal'
     */
    format?: NumberColorFormat;
    /**
     * Adds an alpha value to the color (RGBA).
     *
     * @default false
     */
    includeAlpha?: boolean;
  }): number[];
  /**
   * Returns an HSL color.
   *
   * @param options Options object.
   * @param options.format Format of generated HSL color. Defaults to `'decimal'`.
   * @param options.includeAlpha Adds an alpha value to the color (RGBA). Defaults to `false`.
   *
   * @example
   * faker.color.hsl() // [ 198, 0.72, 0.6 ]
   * faker.color.hsl({ format: 'decimal' }) // [ 196, 0.42, 0.65 ]
   * faker.color.hsl({ format: 'decimal', includeAlpha: true }) // [ 157, 0.9, 0.97, 0.38 ]
   * faker.color.hsl({ format: 'css' }) // 'hsl(285deg 53% 57%)'
   * faker.color.hsl({ format: 'css', includeAlpha: true }) // 'hsl(334deg 7% 8% / 2)'
   * faker.color.hsl({ format: 'binary' }) // '100101100 00111111010001111010111000010100 00111111010111101011100001010010'
   * faker.color.hsl({ format: 'binary', includeAlpha: true }) // '101100001 00111111010011001100110011001101 00111110111010111000010100011111 00111111010001111010111000010100'
   *
   * @since 7.0.0
   */
  hsl(options?: {
    /**
     * Format of generated HSL color.
     *
     * @default 'decimal'
     */
    format?: ColorFormat;
    /**
     * Adds an alpha value to the color (RGBA).
     *
     * @default false
     */
    includeAlpha?: boolean;
  }): string | number[];
  hsl(
    options: {
      format?: ColorFormat;
      includeAlpha?: boolean;
    } = {}
  ): string | number[] {
    const { format = 'decimal', includeAlpha = false } = options;
    const hsl: number[] = [this.faker.number.int(360)];
    for (let i = 0; i < (options?.includeAlpha ? 3 : 2); i++) {
      hsl.push(this.faker.number.float({ multipleOf: 0.01 }));
    }

    return toColorFormat(hsl, format, includeAlpha ? 'hsla' : 'hsl');
  }

  /**
   * Returns an HWB color.
   *
   * @example
   * faker.color.hwb() // [ 198, 0.72, 0.6 ]
   *
   * @since 7.0.0
   */
  hwb(): number[];
  /**
   * Returns an HWB color.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.hwb() // [ 198, 0.72, 0.6 ]
   * faker.color.hwb({ format: 'css' }) // 'hwb(196 42% 65%)'
   * faker.color.hwb({ format: 'binary' }) // '10011101 00111111011001100110011001100110 00111111011110000101000111101100'
   *
   * @since 7.0.0
   */
  hwb(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: StringColorFormat;
  }): string;
  /**
   * Returns an HWB color.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.hwb() // [ 198, 0.72, 0.6 ]
   * faker.color.hwb({ format: 'decimal' }) // [ 196, 0.42, 0.65 ]
   *
   * @since 7.0.0
   */
  hwb(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: NumberColorFormat;
  }): number[];
  /**
   * Returns an HWB color.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.hwb() // [ 198, 0.72, 0.6 ]
   * faker.color.hwb({ format: 'decimal' }) // [ 196, 0.42, 0.65 ]
   * faker.color.hwb({ format: 'css' }) // 'hwb(157 90% 97%)'
   * faker.color.hwb({ format: 'binary' }) // '10001010 00111111010010100011110101110001 00111111000001111010111000010100'
   *
   * @since 7.0.0
   */
  hwb(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: ColorFormat;
  }): string | number[];
  /**
   * Returns an HWB color.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.hwb() // [201, 0.21, 0.31]
   * faker.color.hwb({ format: 'decimal' }) // [201, 0.21, 0.31]
   * faker.color.hwb({ format: 'css' }) // 'hwb(354 72% 41%)'
   * faker.color.hwb({ format: 'binary' }) // (8-32 bits x 3)
   *
   * @since 7.0.0
   */
  hwb(
    options: {
      /**
       * Format of generated RGB color.
       *
       * @default 'decimal'
       */
      format?: ColorFormat;
    } = {}
  ): string | number[] {
    const { format = 'decimal' } = options;
    const hsl: number[] = [this.faker.number.int(360)];
    for (let i = 0; i < 2; i++) {
      hsl.push(this.faker.number.float({ multipleOf: 0.01 }));
    }

    return toColorFormat(hsl, format, 'hwb');
  }

  /**
   * Returns a LAB (CIELAB) color.
   *
   * @example
   * faker.color.lab() // [ 0.548814, 43.0379, 20.5527 ]
   *
   * @since 7.0.0
   */
  lab(): number[];
  /**
   * Returns a LAB (CIELAB) color.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.lab() // [ 0.548814, 43.0379, 20.5527 ]
   * faker.color.lab({ format: 'css' }) // 'lab(54% -15.269 29.1788)'
   * faker.color.lab({ format: 'binary' }) // '00111110111000000000101101100111 01000010100111001011010110001110 01000010101110010111011100010111'
   *
   * @since 7.0.0
   */
  lab(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: StringColorFormat;
  }): string;
  /**
   * Returns a LAB (CIELAB) color.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.lab() // [ 0.548814, 43.0379, 20.5527 ]
   * faker.color.lab({ format: 'decimal' }) // [ 0.544883, -15.269, 29.1788 ]
   *
   * @since 7.0.0
   */
  lab(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: NumberColorFormat;
  }): number[];
  /**
   * Returns a LAB (CIELAB) color.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.lab() // [ 0.548814, 43.0379, 20.5527 ]
   * faker.color.lab({ format: 'decimal' }) // [ 0.544883, -15.269, 29.1788 ]
   * faker.color.lab({ format: 'css' }) // 'lab(44% 78.3546 92.7326)'
   * faker.color.lab({ format: 'binary' }) // '00111110110001000101001001100001 01000010011010010110000101001000 01000000101110001110110110010001'
   *
   * @since 7.0.0
   */
  lab(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: ColorFormat;
  }): string | number[];
  lab(options: { format?: ColorFormat } = {}): string | number[] {
    const { format = 'decimal' } = options;
    const lab = [this.faker.number.float({ multipleOf: 0.000001 })];
    for (let i = 0; i < 2; i++) {
      lab.push(
        this.faker.number.float({ min: -100, max: 100, multipleOf: 0.0001 })
      );
    }

    return toColorFormat(lab, format, 'lab');
  }

  /**
   * Returns an LCH color. Even though upper bound of
   * chroma in LCH color space is theoretically unbounded,
   * it is bounded to 230 as anything above will not
   * make a noticeable difference in the browser.
   *
   * @example
   * faker.color.lch() // [ 0.548814, 164.5, 138.6 ]
   *
   * @since 7.0.0
   */
  lch(): number[];
  /**
   * Returns an LCH color. Even though upper bound of
   * chroma in LCH color space is theoretically unbounded,
   * it is bounded to 230 as anything above will not
   * make a noticeable difference in the browser.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.lch() // [ 0.548814, 164.5, 138.6 ]
   * faker.color.lch({ format: 'css' }) // 'lch(54% 97.4 148.6)'
   * faker.color.lch({ format: 'binary' }) // '00111110111000000000101101100111 01000011010011010001100110011010 01000011010111011011001100110011'
   *
   * @since 7.0.0
   */
  lch(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: StringColorFormat;
  }): string;
  /**
   * Returns an LCH color. Even though upper bound of
   * chroma in LCH color space is theoretically unbounded,
   * it is bounded to 230 as anything above will not
   * make a noticeable difference in the browser.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.lch() // [ 0.548814, 164.5, 138.6 ]
   * faker.color.lch({ format: 'decimal' }) // [ 0.544883, 97.4, 148.6 ]
   *
   * @since 7.0.0
   */
  lch(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: NumberColorFormat;
  }): number[];
  /**
   * Returns an LCH color. Even though upper bound of
   * chroma in LCH color space is theoretically unbounded,
   * it is bounded to 230 as anything above will not
   * make a noticeable difference in the browser.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   *
   * @example
   * faker.color.lch() // [ 0.548814, 164.5, 138.6 ]
   * faker.color.lch({ format: 'decimal' }) // [ 0.544883, 97.4, 148.6 ]
   * faker.color.lch({ format: 'css' }) // 'lch(44% 205.1 221.7)'
   * faker.color.lch({ format: 'binary' }) // '00111110110001000101001001100001 01000011001101100001100110011010 01000010111100110011001100110011'
   *
   * @since 7.0.0
   */
  lch(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: ColorFormat;
  }): string | number[];
  lch(options: { format?: ColorFormat } = {}): string | number[] {
    const { format = 'decimal' } = options;
    const lch = [this.faker.number.float({ multipleOf: 0.000001 })];
    for (let i = 0; i < 2; i++) {
      lch.push(this.faker.number.float({ max: 230, multipleOf: 0.1 }));
    }

    return toColorFormat(lch, format, 'lch');
  }

  /**
   * Returns a random color based on CSS color space specified.
   *
   * @example
   * faker.color.colorByCSSColorSpace() // [ 0.5488, 0.7152, 0.6028 ]
   *
   * @since 7.0.0
   */
  colorByCSSColorSpace(): number[];
  /**
   * Returns a random color based on CSS color space specified.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   * @param options.space Color space to generate the color for. Defaults to `'sRGB'`.
   *
   * @example
   * faker.color.colorByCSSColorSpace() // [ 0.5488, 0.7152, 0.6028 ]
   * faker.color.colorByCSSColorSpace({ format: 'css', space: 'display-p3' }) // 'color(display-p3 0.5449 0.4236 0.6459)'
   * faker.color.colorByCSSColorSpace({ format: 'binary' }) // '00111110111000000000110100011011 00111111011001000100110100000001 00111111011101101011010100001011'
   *
   * @since 7.0.0
   */
  colorByCSSColorSpace(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: StringColorFormat;
    /**
     * Color space to generate the color for.
     *
     * @default 'sRGB'
     */
    space?: CssSpaceType;
  }): string;
  /**
   * Returns a random color based on CSS color space specified.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   * @param options.space Color space to generate the color for. Defaults to `'sRGB'`.
   *
   * @example
   * faker.color.colorByCSSColorSpace() // [ 0.5488, 0.7152, 0.6028 ]
   * faker.color.colorByCSSColorSpace({ format: 'decimal' }) // [ 0.5449, 0.4236, 0.6459 ]
   *
   * @since 7.0.0
   */
  colorByCSSColorSpace(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: NumberColorFormat;
    /**
     * Color space to generate the color for.
     *
     * @default 'sRGB'
     */
    space?: CssSpaceType;
  }): number[];
  /**
   * Returns a random color based on CSS color space specified.
   *
   * @param options Options object.
   * @param options.format Format of generated RGB color. Defaults to `'decimal'`.
   * @param options.space Color space to generate the color for. Defaults to `'sRGB'`.
   *
   * @example
   * faker.color.colorByCSSColorSpace() // [ 0.5488, 0.7152, 0.6028 ]
   * faker.color.colorByCSSColorSpace({ format: 'decimal' }) // [ 0.5449, 0.4236, 0.6459 ]
   * faker.color.colorByCSSColorSpace({ format: 'css', space: 'display-p3' }) // 'color(display-p3 0.4376 0.8918 0.9637)'
   * faker.color.colorByCSSColorSpace({ format: 'binary' }) // '00111110110001000100110100000001 00111111010010101011001101101000 00111111000001110110010111111110'
   *
   * @since 7.0.0
   */
  colorByCSSColorSpace(options?: {
    /**
     * Format of generated RGB color.
     *
     * @default 'decimal'
     */
    format?: ColorFormat;
    /**
     * Color space to generate the color for.
     *
     * @default 'sRGB'
     */
    space?: CssSpaceType;
  }): string | number[];
  colorByCSSColorSpace(
    options: {
      format?: ColorFormat;
      space?: CssSpaceType;
    } = {}
  ): string | number[] {
    const { format = 'decimal', space = 'sRGB' } = options;

    const color = Array.from({ length: 3 }, () =>
      this.faker.number.float({ multipleOf: 0.0001 })
    );
    return toColorFormat(color, format, 'color', space);
  }
}
