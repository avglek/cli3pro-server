export function toCamelCase(str: string): string {
  const inx = str.indexOf('_');
  let result;
  if (inx > 0) {
    result =
      str.slice(0, inx).toLowerCase() +
      str.slice(inx + 1, inx + 2) +
      str.slice(inx + 2).toLowerCase();
  } else {
    result = str.toLowerCase();
  }
  return result;
}
