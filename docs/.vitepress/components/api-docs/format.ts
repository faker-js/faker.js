const nbsp = '\u00A0';

export function formatResult(result: unknown): string {
  return result === undefined
    ? 'undefined'
    : typeof result === 'bigint'
      ? `${result}n`
      : JSON.stringify(result, undefined, 2)
          .replaceAll('\\r', '')
          .replaceAll(nbsp, ' ')
          .replaceAll(
            /(^ *|: )"([^'\n]*?)"(?=,?$|: )/gm,
            (_, p1, p2) => `${p1}'${p2.replace(/\\"/g, '"')}'`
          )
          .replaceAll(/\n */g, ' ');
}

export function formatResultForHtml(result: unknown): string {
  return formatResult(result).replaceAll('<', '&lt;');
}
