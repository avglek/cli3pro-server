import { IDescParam } from '../interfaces';
import { toCamelCase } from './str-utils';

export function paramsToObject(params: IDescParam[]): {
  [key: string]: string;
} {
  return <{ [key: string]: string }>params.reduce((acc, item) => {
    if (item.fieldName)
      Object.assign(acc, {
        [toCamelCase(item.fieldName)]: item.value || item.defaultValue,
      });
    return acc;
  }, {});
}
