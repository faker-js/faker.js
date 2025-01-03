import { ModuleBase } from '../../internal/module-base';

const commonFileTypes = ['video', 'audio', 'image', 'text', 'application'];

const commonMimeTypes = [
  'application/pdf',
  'audio/mpeg',
  'audio/wav',
  'image/png',
  'image/jpeg',
  'image/gif',
  'video/mp4',
  'video/mpeg',
  'text/html',
];

const commonInterfaceTypes = ['en', 'wl', 'ww'] as const;
const commonInterfaceSchemas = {
  index: 'o',
  slot: 's',
  mac: 'x',
  pci: 'p',
} as const;

const CRON_DAY_OF_WEEK = [
  'SUN',
  'MON',
  'TUE',
  'WED',
  'THU',
  'FRI',
  'SAT',
] as const;

/**
 * Generates fake data for many computer systems properties.
 */
export class SystemModule extends ModuleBase {
  /**
   * Returns a random file name with extension.
   *
   * @param options An options object.
   * @param options.extensionCount Define how many extensions the file name should have. Defaults to `1`.
   *
   * @example
   * faker.system.fileName() // 'faithfully_calculating.u8mdn'
   * faker.system.fileName({ extensionCount: 2 }) // 'times_after.swf.ntf'
   * faker.system.fileName({ extensionCount: { min: 1, max: 2 } }) // 'jaywalk_like_ill.osfpvg'
   *
   * @since 3.1.0
   */
  fileName(
    options: {
      /**
       * Define how many extensions the file name should have.
       *
       * @default 1
       */
      extensionCount?:
        | number
        | {
            /**
             * Minimum number of extensions.
             */
            min: number;
            /**
             * Maximum number of extensions.
             */
            max: number;
          };
    } = {}
  ): string {
    const { extensionCount = 1 } = options;

    const baseName = this.faker.word
      .words()
      .toLowerCase()
      .replaceAll(/\W/g, '_');

    const extensionsSuffix = this.faker.helpers
      .multiple(() => this.fileExt(), { count: extensionCount })
      .join('.');

    if (extensionsSuffix.length === 0) {
      return baseName;
    }

    return `${baseName}.${extensionsSuffix}`;
  }

  /**
   * Returns a random file name with a given extension or a commonly used extension.
   *
   * @param extension The file extension to use. Empty string is considered to be not set.
   *
   * @example
   * faker.system.commonFileName() // 'dollar.jpg'
   * faker.system.commonFileName('txt') // 'global_borders_wyoming.txt'
   *
   * @since 3.1.0
   */
  commonFileName(extension?: string): string {
    const fileName = this.fileName({ extensionCount: 0 });

    return `${fileName}.${extension || this.commonFileExt()}`;
  }

  /**
   * Returns a mime-type.
   *
   * @example
   * faker.system.mimeType() // 'video/vnd.vivo'
   *
   * @since 3.1.0
   */
  mimeType(): string {
    const mimeTypeKeys = Object.keys(this.faker.definitions.system.mime_type);

    return this.faker.helpers.arrayElement(mimeTypeKeys);
  }

  /**
   * Returns a commonly used file type.
   *
   * @example
   * faker.system.commonFileType() // 'audio'
   *
   * @since 3.1.0
   */
  commonFileType(): string {
    return this.faker.helpers.arrayElement(commonFileTypes);
  }

  /**
   * Returns a commonly used file extension.
   *
   * @example
   * faker.system.commonFileExt() // 'gif'
   *
   * @since 3.1.0
   */
  commonFileExt(): string {
    return this.fileExt(this.faker.helpers.arrayElement(commonMimeTypes));
  }

  /**
   * Returns a file type.
   *
   * @example
   * faker.system.fileType() // 'message'
   *
   * @since 3.1.0
   */
  fileType(): string {
    const mimeTypes = this.faker.definitions.system.mime_type;

    const typeSet = new Set(
      Object.keys(mimeTypes).map((key) => key.split('/')[0])
    );
    return this.faker.helpers.arrayElement([...typeSet]);
  }

  /**
   * Returns a file extension.
   *
   * @param mimeType Valid [mime-type](https://github.com/jshttp/mime-db/blob/master/db.json)
   *
   * @example
   * faker.system.fileExt() // 'emf'
   * faker.system.fileExt('application/json') // 'json'
   *
   * @since 3.1.0
   */
  fileExt(mimeType?: string): string {
    const mimeTypes = this.faker.definitions.system.mime_type;

    if (typeof mimeType === 'string') {
      return this.faker.helpers.arrayElement(mimeTypes[mimeType].extensions);
    }

    const extensionSet = new Set(
      Object.values(mimeTypes).flatMap(({ extensions }) => extensions)
    );
    return this.faker.helpers.arrayElement([...extensionSet]);
  }

  /**
   * Returns a directory path.
   *
   * @example
   * faker.system.directoryPath() // '/etc/mail'
   *
   * @since 3.1.0
   */
  directoryPath(): string {
    const paths = this.faker.definitions.system.directory_path;
    return this.faker.helpers.arrayElement(paths);
  }

  /**
   * Returns a file path.
   *
   * @example
   * faker.system.filePath() // '/usr/local/src/money.dotx'
   *
   * @since 3.1.0
   */
  filePath(): string {
    return `${this.directoryPath()}/${this.fileName()}`;
  }

  /**
   * Returns a [semantic version](https://semver.org).
   *
   * @example
   * faker.system.semver() // '1.15.2'
   *
   * @since 3.1.0
   */
  semver(): string {
    return [
      this.faker.number.int(9),
      this.faker.number.int(20),
      this.faker.number.int(20),
    ].join('.');
  }

  /**
   * Returns a random [network interface](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/networking_guide/sec-understanding_the_predictable_network_interface_device_names).
   *
   * @param options The options to use.
   * @param options.interfaceType The interface type. Can be one of `en`, `wl`, `ww`.
   * @param options.interfaceSchema The interface schema. Can be one of `index`, `slot`, `mac`, `pci`.
   *
   * @example
   * faker.system.networkInterface() // 'enp0s3'
   * faker.system.networkInterface({ interfaceType: 'wl' }) // 'wlo1'
   * faker.system.networkInterface({ interfaceSchema: 'mac' }) // 'enx000c29c00000'
   * faker.system.networkInterface({ interfaceType: 'en', interfaceSchema: 'pci' }) // 'enp5s0f1d0'
   *
   * @since 7.4.0
   */
  networkInterface(
    options: {
      /**
       * The interface type. Can be one of `en`, `wl`, `ww`.
       *
       * @default faker.helpers.arrayElement(['en', 'wl', 'ww'])
       */
      interfaceType?: (typeof commonInterfaceTypes)[number];
      /**
       * The interface schema. Can be one of `index`, `slot`, `mac`, `pci`.
       *
       * @default faker.helpers.objectKey(['index' | 'slot' | 'mac' | 'pci'])
       */
      interfaceSchema?: keyof typeof commonInterfaceSchemas;
    } = {}
  ): string {
    const {
      interfaceType = this.faker.helpers.arrayElement(commonInterfaceTypes),
      interfaceSchema = this.faker.helpers.objectKey(commonInterfaceSchemas),
    } = options;

    let suffix: string;
    let prefix = '';
    switch (interfaceSchema) {
      case 'index': {
        suffix = this.faker.string.numeric();
        break;
      }

      case 'slot': {
        suffix = `${this.faker.string.numeric()}${
          this.faker.helpers.maybe(() => `f${this.faker.string.numeric()}`) ??
          ''
        }${this.faker.helpers.maybe(() => `d${this.faker.string.numeric()}`) ?? ''}`;
        break;
      }

      case 'mac': {
        suffix = this.faker.internet.mac('');
        break;
      }

      case 'pci': {
        prefix =
          this.faker.helpers.maybe(() => `P${this.faker.string.numeric()}`) ??
          '';
        suffix = `${this.faker.string.numeric()}s${this.faker.string.numeric()}${
          this.faker.helpers.maybe(() => `f${this.faker.string.numeric()}`) ??
          ''
        }${this.faker.helpers.maybe(() => `d${this.faker.string.numeric()}`) ?? ''}`;
        break;
      }
    }

    return `${prefix}${interfaceType}${commonInterfaceSchemas[interfaceSchema]}${suffix}`;
  }

  /**
   * Returns a random cron expression.
   *
   * @param options The optional options to use.
   * @param options.includeYear Whether to include a year in the generated expression. Defaults to `false`.
   * @param options.includeNonStandard Whether to include a `@yearly`, `@monthly`, `@daily`, etc text labels in the generated expression. Defaults to `false`.
   *
   * @example
   * faker.system.cron() // '45 23 * * 6'
   * faker.system.cron({ includeYear: true }) // '45 23 * * 6 2067'
   * faker.system.cron({ includeYear: false }) // '45 23 * * 6'
   * faker.system.cron({ includeNonStandard: false }) // '45 23 * * 6'
   * faker.system.cron({ includeNonStandard: true }) // '@yearly'
   *
   * @since 7.5.0
   */
  cron(
    options: {
      /**
       * Whether to include a year in the generated expression.
       *
       * @default false
       */
      includeYear?: boolean;
      /**
       * Whether to include a `@yearly`, `@monthly`, `@daily`, etc text labels in the generated expression.
       *
       * @default false
       */
      includeNonStandard?: boolean;
    } = {}
  ): string {
    const { includeYear = false, includeNonStandard = false } = options;

    // create the arrays to hold the available values for each component of the expression
    const minutes = [this.faker.number.int(59), '*'];
    const hours = [this.faker.number.int(23), '*'];
    const days = [this.faker.number.int({ min: 1, max: 31 }), '*', '?'];
    const months = [this.faker.number.int({ min: 1, max: 12 }), '*'];
    const daysOfWeek = [
      this.faker.number.int(6),
      this.faker.helpers.arrayElement(CRON_DAY_OF_WEEK),
      '*',
      '?',
    ];
    const years = [this.faker.number.int({ min: 1970, max: 2099 }), '*'];

    const minute = this.faker.helpers.arrayElement(minutes);
    const hour = this.faker.helpers.arrayElement(hours);
    const day = this.faker.helpers.arrayElement(days);
    const month = this.faker.helpers.arrayElement(months);
    const dayOfWeek = this.faker.helpers.arrayElement(daysOfWeek);
    const year = this.faker.helpers.arrayElement(years);

    // create and return the cron expression string
    let standardExpression = `${minute} ${hour} ${day} ${month} ${dayOfWeek}`;
    if (includeYear) {
      standardExpression += ` ${year}`;
    }

    const nonStandardExpressions = [
      '@annually',
      '@daily',
      '@hourly',
      '@monthly',
      '@reboot',
      '@weekly',
      '@yearly',
    ];

    return !includeNonStandard || this.faker.datatype.boolean()
      ? standardExpression
      : this.faker.helpers.arrayElement(nonStandardExpressions);
  }
}
