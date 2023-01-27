import { ValueFormatterParams } from 'ag-grid-community';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FilterModelItem } from '../interfaces';

dayjs.extend(utc);

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
        if (currYear === '0000') {
          return '01.01.0001';
        }
        if (format) {
          format = format
            .toUpperCase()
            .replace('YY', 'YYYY')
            .replace('NN', 'mm');
          return dayjs.utc(value).format(format);
        } else {
          return dayjs.utc(value).format('DD.MM.YYYY');
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

export function parseColor(color: number | null): string {
  if (color === null || color === undefined) {
    return '';
  }
  let colorStr = '000000' + color.toString(16);
  colorStr = colorStr.slice(-6);
  const blue = colorStr.slice(0, 2);
  const green = colorStr.slice(2, 4);
  const red = colorStr.slice(4);

  return `#${red}${green}${blue}`;
}

export function packColor(color: string): number {
  console.log('pack color:', color);
  let colorStr = color.slice(-6);
  const blue = colorStr.slice(4);
  const green = colorStr.slice(2, 4);
  const red = colorStr.slice(0, 2);

  colorStr = `${blue}${green}${red}`;

  return Number.parseInt(colorStr, 16);
}

export function addFontStyle(option: number | null): { [key: string]: string } {
  const fontWeight = option && option & 1 ? 'bold' : 'normal';
  const fontStyle = option && option & 2 ? 'italic' : 'normal';
  let textDecoration = option && option & 4 ? 'underline' : 'none';
  textDecoration = option && option & 8 ? 'line-through' : textDecoration;

  return {
    fontWeight,
    fontStyle,
    textDecoration,
  };
}
