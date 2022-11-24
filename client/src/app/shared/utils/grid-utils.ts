import { ValueFormatterParams } from 'ag-grid-community';
import dayjs from 'dayjs';
import { FilterModelItem } from '../interfaces';

export function dataFormatter(
  params: ValueFormatterParams,
  format: string | null | undefined,
  type: string | undefined
): string {
  let value = params.value;

  if (!type) {
    return value;
  }

  switch (type) {
    case 'NUMBER':
      if (value === null || value === undefined) return '';
      if (format) {
        return formatStringToFixFloat(value.toString(), format).toString();
      }
      return Number.parseInt(value.toString()).toString();
    case 'DATE':
      if (dayjs(value, 'YYYY-MM-DDTHH:mm:ss.SSSZ').isValid()) {
        const currYear = value.slice(0, value.indexOf('-'));
        const nowYear = dayjs().year();
        if (currYear === '0000') {
          value = nowYear + '-' + value.slice(value.indexOf('-') + 1);
        }
        if (format) {
          format = format
            .toUpperCase()
            .replace('YY', 'YYYY')
            .replace('NN', 'mm');
          return dayjs(value).format(format);
        } else {
          return dayjs(value).format('DD.MM.YYYY');
        }
      }
      return value;
  }

  return value;
}

export function formatStringToFixFloat(value: string, format: string): number {
  const a = format;
  const b = value;
  const f =
    b.indexOf('.') + 1 === 0
      ? b
      : b.slice(0, b.indexOf('.') + 1 + a.slice(a.indexOf('.') + 1).length);

  return Number.parseFloat(f);
}

export function prepareFilter(params: any): FilterModelItem[] {
  const keys = Object.keys(params);
  return keys.map((key) => {
    return {
      colId: key,
      value: params[key].filter,
      valueTo: params[key].filterTo,
      type: params[key].type,
      filterType: params[key].filterType,
      dateFrom: params[key].dateFrom,
      dateTo: params[key].dateTo,
    };
  });
}
