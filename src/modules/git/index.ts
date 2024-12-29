import { ModuleBase } from '../../internal/module-base';

const nbsp = '\u00A0';

/**
 * Module to generate git related entries.
 *
 * ### Overview
 *
 * [`commitEntry()`](https://fakerjs.dev/api/git.html#commitentry) generates a random commit entry as printed by `git log`. This includes a commit hash [`commitSha()`](https://fakerjs.dev/api/git.html#commitsha), author, date [`commitDate()`](https://fakerjs.dev/api/git.html#commitdate), and commit message [`commitMessage()`](https://fakerjs.dev/api/git.html#commitmessage). You can also generate a random branch name with [`branch()`](https://fakerjs.dev/api/git.html#branch).
 */
export class GitModule extends ModuleBase {
  /**
   * Generates a random branch name.
   *
   * @example
   * faker.git.branch() // 'matrix-parse'
   *
   * @since 5.0.0
   */
  branch(): string {
    const noun = this.faker.hacker.noun().replace(' ', '-');
    const verb = this.faker.hacker.verb().replace(' ', '-');
    return `${noun}-${verb}`;
  }

  /**
   * Generates a random commit entry as printed by `git log`.
   *
   * @param options Options for the commit entry.
   * @param options.merge Whether to generate a merge message line. Defaults to 20% `true` and 80% `false`.
   * @param options.eol Choose the end of line character to use. Defaults to `'CRLF'`.
   * 'LF' = '\n',
   * 'CRLF' = '\r\n'
   * @param options.refDate The date to use as reference point for the commit. Defaults to `new Date()`.
   *
   * @example
   * faker.git.commitEntry()
   * // 'commit fdb9e9df8bbce110cbdfbab2e3eb95bac0dddef7
   * // Author: Humberto Beier <Humberto.Beier98@yahoo.com>
   * // Date: Tue Dec 31 04:00:46 2024 -0800
   * //
   * //     override cross-platform hard drive
   * // '
   *
   * @since 5.0.0
   */
  commitEntry(
    options: {
      /**
       * Set to `true` to generate a merge message line.
       *
       * @default faker.datatype.boolean({ probability: 0.2 })
       */
      merge?: boolean;
      /**
       * Choose the end of line character to use.
       *
       * - 'LF' = '\n',
       * - 'CRLF' = '\r\n'
       *
       * @default 'CRLF'
       */
      eol?: 'LF' | 'CRLF';
      /**
       * The date to use as reference point for the commit.
       *
       * @default new Date()
       */
      refDate?: string | Date | number;
    } = {}
  ): string {
    const {
      merge = this.faker.datatype.boolean({ probability: 0.2 }),
      eol = 'CRLF',
      refDate,
    } = options;

    const lines = [`commit ${this.faker.git.commitSha()}`];

    if (merge) {
      lines.push(
        `Merge: ${this.commitSha({ length: 7 })} ${this.commitSha({
          length: 7,
        })}`
      );
    }

    const firstName = this.faker.person.firstName();
    const lastName = this.faker.person.lastName();
    const fullName = this.faker.person.fullName({ firstName, lastName });
    const username = this.faker.internet.username({ firstName, lastName });
    let user = this.faker.helpers.arrayElement([fullName, username]);
    const email = this.faker.internet.email({ firstName, lastName });

    // Normalize user according to https://github.com/libgit2/libgit2/issues/5342
    user = user.replaceAll(/^[.,:;"\\']|[<>\n]|[.,:;"\\']$/g, '');

    lines.push(
      `Author: ${user} <${email}>`,
      `Date: ${this.commitDate({ refDate })}`,
      '',
      `${nbsp.repeat(4)}${this.commitMessage()}`,
      // to end with a eol char
      ''
    );

    const eolChar = eol === 'CRLF' ? '\r\n' : '\n';
    const entry = lines.join(eolChar);

    return entry;
  }

  /**
   * Generates a random commit message.
   *
   * @example
   * faker.git.commitMessage() // 'input optical microchip'
   *
   * @since 5.0.0
   */
  commitMessage(): string {
    return `${this.faker.hacker.verb()} ${this.faker.hacker.adjective()} ${this.faker.hacker.noun()}`;
  }

  /**
   * Generates a date string for a git commit using the same format as `git log`.
   *
   * @param options The optional options object.
   * @param options.refDate The date to use as reference point for the commit. Defaults to `faker.defaultRefDate()`.
   *
   * @example
   * faker.git.commitDate() // 'Tue Dec 31 12:10:16 2024 +0600'
   * faker.git.commitDate({ refDate: '2020-01-01' }) // 'Tue Dec 31 14:27:58 2019 +0200'
   *
   * @since 8.0.0
   */
  commitDate(
    options: {
      /**
       * The date to use as reference point for the commit.
       *
       * @default faker.defaultRefDate()
       */
      refDate?: string | Date | number;
    } = {}
  ): string {
    const { refDate = this.faker.defaultRefDate() } = options;
    // Git uses a non-standard date format for commits by default per https://mirrors.edge.kernel.org/pub/software/scm/git/docs/git-log.html
    // --date=default is the default format, and is based on ctime(3) output. It shows a single line with three-letter day of the week, three-letter month, day-of-month, hour-minute-seconds in "HH:MM:SS" format, followed by 4-digit year, plus timezone information, unless the local time zone is used, e.g. Thu Jan 1 00:00:00 1970 +0000.
    // To avoid relying on the Intl global which may not be available in all environments, we implement a custom date format using built-in Javascript date functions.
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = this.faker.date.recent({ days: 1, refDate });
    const day = days[date.getUTCDay()];
    const month = months[date.getUTCMonth()];
    const dayOfMonth = date.getUTCDate();
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const timezone = this.faker.number.int({ min: -11, max: 12 });
    const timezoneHours = Math.abs(timezone).toString().padStart(2, '0');
    const timezoneMinutes = '00';
    const timezoneSign = timezone >= 0 ? '+' : '-';
    return `${day} ${month} ${dayOfMonth} ${hours}:${minutes}:${seconds} ${year} ${timezoneSign}${timezoneHours}${timezoneMinutes}`;
  }

  /**
   * Generates a random commit sha.
   *
   * By default, the length of the commit sha is 40 characters.
   *
   * For a shorter commit sha, use the `length` option.
   *
   * Usual short commit sha length is:
   * - 7 for GitHub
   * - 8 for GitLab
   *
   * @param options Options for the commit sha.
   * @param options.length The length of the commit sha. Defaults to `40`.
   *
   * @example
   * faker.git.commitSha() // 'cfdb9e9df8bbce110cbdfbab2e3eb95bac0dddef'
   * faker.git.commitSha({ length: 7 }) // '79f1ee4'
   * faker.git.commitSha({ length: 8 }) // '268c9f24'
   *
   * @since 5.0.0
   */
  commitSha(
    options: {
      /**
       * The length of the commit sha.
       *
       * @default 40
       */
      length?: number;
    } = {}
  ): string {
    const { length = 40 } = options;
    return this.faker.string.hexadecimal({
      length,
      casing: 'lower',
      prefix: '',
    });
  }
}
