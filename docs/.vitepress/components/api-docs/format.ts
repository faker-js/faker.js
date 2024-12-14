export function formatResult(result: unknown): string {
  return result === undefined
    ? 'undefined'
    : typeof result === 'bigint'
      ? `${result}n`
      : JSON.stringify(result, undefined, 2)
          .replaceAll('\\r', '')
          .replaceAll('<', '&lt;')
          .replaceAll(
            /(^ *|: )"([^'\n]*?)"(,?$|: )/gm,
            (_, p1, p2, p3) => `${p1}'${p2.replace(/\\"/g, '"')}'${p3}`
          )
          .replaceAll(/\n */g, ' ');
}
