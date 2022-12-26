import { IOption } from '../interfaces';

export function toCamelCase(str: string | null | undefined): string {
  if (!str) {
    return '';
  }
  const inx = str.indexOf('_');
  let result;
  if (inx > 0) {
    result =
      str.slice(0, inx).toLowerCase() +
      str.slice(inx + 1, inx + 2).toUpperCase() +
      str.slice(inx + 2).toLowerCase();
  } else {
    result = str.toLowerCase();
  }
  return result;
}

export function parseAndCamelCase(str: string | null | undefined): string {
  if (!str) return '';

  const arr = str.split(';');
  const res = arr.map((s) => toCamelCase(s));

  return res.join(';');
}

export function parseSimpleParams(list: string): IOption[] | null {
  const items = list.split('\n');
  if (items) {
    return items.map((item) => {
      const arr = item.split('=');
      return {
        label: arr[0].split('_').join(' ').trim(),
        value: arr[1].trim()
          ? arr[1].trim()
          : arr[0].split('_').join(' ').trim(),
      };
    });
  } else {
    return null;
  }
}

export function checkFileName(str: string): string {
  return str.replace(/['<','>',':','\"','\"','\/','\\','|','?','*']/g, '_');
}

export function checkWorkSheetName(str: string): string {
  return str.replace(
    /['<','>',':','\"','\"','\/','\\','|','?','*','\[','\]']/g,
    '_'
  );
}

export function parseTemplate(
  template: string | undefined | null,
  replacement: { [key: string]: string }
): string | undefined {
  if (!template) {
    return undefined;
  }

  return template.replace(/%\w+/g, (str) => {
    const key = toCamelCase(str.slice(1, str.length));
    return replacement[key] || str;
  });
}

export function buildOracleDbType(
  type: string | undefined
): string | undefined {
  if (!type) return undefined;
  return type;
}
